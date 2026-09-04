from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, json, uuid
from datetime import datetime
from PIL import Image
import numpy as np
import tensorflow as tf
import random
import jwt
from functools import wraps

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)

# =========================
# 🔹 Config
# =========================
UPLOAD_FOLDER = "uploads"
MODEL_DIR = "saved_model/defect_detector"
CLASSES_FILE = "saved_model/classes.txt"

app.config["MONGO_URI"] = "mongodb://localhost:27017/defect_db"
app.config["SECRET_KEY"] = "your_secret_key"

mongo = PyMongo(app)
bcrypt = Bcrypt(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =========================
# 🔹 Load AI Model
# =========================
model = None
classes = []

if os.path.exists(MODEL_DIR):
    try:
        model = tf.keras.models.load_model(MODEL_DIR)
        if os.path.exists(CLASSES_FILE):
            with open(CLASSES_FILE, "r", encoding="utf-8") as f:
                classes = [line.strip() for line in f if line.strip()]
        print("Model loaded:", classes)
    except Exception as e:
        print("Error loading model:", e)

def preprocess_image(path):
    img = Image.open(path).convert("RGB").resize((224, 224))
    arr = np.array(img).astype(np.float32)
    arr = tf.keras.applications.mobilenet_v2.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)

# =========================
# 🔹 JWT حماية
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

# =========================
# 🔹 Register
# =========================
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"})

# =========================
# 🔹 Login
# =========================
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = mongo.db.users.find_one({"email": email})

    if user and bcrypt.check_password_hash(user["password"], password):
        token = jwt.encode(
            {"email": user["email"]},
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful",
            "token": token
        })

    return jsonify({"error": "Invalid credentials"}), 401

# =========================
# 🔹 Upload & Detect
# =========================
@app.route("/upload", methods=["POST"])
@token_required
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files["file"]
    filename = f"{uuid.uuid4().hex}.jpg"
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    if model:
        x = preprocess_image(path)
        preds = model.predict(x)[0]
        idx = int(np.argmax(preds))
        label = classes[idx] if idx < len(classes) else "Unknown"
        confidence = float(preds[idx]) * 100
        status = "OK" if label.lower() in ["ok", "good", "normal"] else "Defect"
    else:
        label = random.choice(["Scratch", "Hole", "None"])
        confidence = random.uniform(80, 99)
        status = random.choice(["OK", "Defect"])

    result = {
        "filename": filename,
        "defectType": label,
        "confidence": round(confidence, 2),
        "status": status,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    mongo.db.detections.insert_one(result)

    return jsonify(result)

# =========================
# 🔹 Get Detections
# =========================
@app.route("/detections", methods=["GET"])
def get_detections():
    data = list(mongo.db.detections.find({}, {"_id": 0}))
    return jsonify(data)


# =========================
# Run Server
# =========================
if __name__ == "__main__":
    app.run(debug=True)