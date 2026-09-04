from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from functools import wraps
import jwt
import os
import uuid
from datetime import datetime

# تحميل المتغيرات من ملف .env
from dotenv import load_dotenv
load_dotenv()

from ultralytics import YOLO
import cv2

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    Table, TableStyle, HRFlowable
)

# مكتبة Groq المجانية — ثبّتها بـ: pip install groq
from groq import Groq

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/defect_ai_db"
app.config["SECRET_KEY"] = "secret123"

mongo = PyMongo(app)
bcrypt = Bcrypt(app)


# المفتاح بيتقرا من ملف .env (مش مكتوب في الكود عشان الأمان)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

groq_client = Groq(api_key=GROQ_API_KEY)

# تحذير وقت تشغيل السيرفر لو لسه مفيش مفتاح صح
if not GROQ_API_KEY.startswith("gsk_"):
    print("⚠️  لسه مفيش مفتاح Groq! حط المفتاح في ملف .env بالشكل ده:")
    print("    GROQ_API_KEY=gsk_xxxxxxxx")
    print("    اعمله مجاناً من: https://console.groq.com")

UPLOAD_FOLDER = "uploads"
RESULTS_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

print("⏳ Loading YOLO model...")
model = YOLO("best.pt")
print("✅ Model loaded successfully")


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "No token"}), 401
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
        try:
            jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return wrapper


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    mongo.db.users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password
    })
    return jsonify({"message": "user created"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = mongo.db.users.find_one({"email": data["email"]})
    if not user:
        return jsonify({"error": "user not found"}), 401
    if not bcrypt.check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "wrong password"}), 401
    token = jwt.encode({"email": user["email"]}, app.config["SECRET_KEY"], algorithm="HS256")
    return jsonify({
        "message": "login success",
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    })


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file sent"}), 400

    file_id = uuid.uuid4().hex
    filename = f"{file_id}.jpg"
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_path)

    results = model.predict(source=input_path, conf=0.50, imgsz=512, verbose=False)
    r = results[0]

    annotated = r.plot(line_width=2)
    output_path = os.path.join(RESULTS_FOLDER, filename)
    cv2.imwrite(output_path, annotated)

    boxes = r.boxes
    count = 0 if boxes is None else len(boxes)
    confidences = []
    if boxes is not None and count > 0:
        confidences = [float(c) for c in boxes.conf.cpu().numpy().tolist()]

    if count > 0:
        status = "Defect"
        defect_type = "Corrosion"
        top_conf = round(max(confidences) * 100, 2)
    else:
        status = "No Defect"
        defect_type = "None"
        top_conf = 100.0

    # نخزّن اسم المنتج بشكل قابل للقراءة عشان التقرير
    product_id = f"P-{uuid.uuid4().hex[:6].upper()}"

    result = {
        "filename": filename,
        "productId": product_id,
        "status": status,
        "defectType": defect_type,
        "confidence": top_conf,
        "detectionsCount": count,
        "imageUrl": f"/result-image/{filename}",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    mongo.db.detections.insert_one(result.copy())
    result.pop("_id", None)
    return jsonify(result)


@app.route("/result-image/<filename>", methods=["GET"])
def result_image(filename):
    return send_from_directory(RESULTS_FOLDER, filename)


@app.route("/ai_chat", methods=["POST"])
def ai_chat():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"reply": "No data received"}), 400

    message = data.get("message", "").strip()
    if not message:
        return jsonify({"reply": "Please type a message."}), 400

    # لو المفتاح لسه مش متحطّ، نقول للمستخدم بوضوح بدل الخطأ الغامض
    if not GROQ_API_KEY.startswith("gsk_"):
        return jsonify({
            "reply": "⚠️ لازم تحط مفتاح Groq في ملف .env الأول "
                     "(المتغير GROQ_API_KEY). اعمله مجاناً من console.groq.com"
        }), 200

    total = mongo.db.detections.count_documents({})
    defects = mongo.db.detections.count_documents({"status": "Defect"})
    safe = total - defects
    last = mongo.db.detections.find_one(sort=[("_id", -1)])
    last_info = "No detections yet."
    if last:
        last_info = (
            f"Last detection: status={last.get('status')}, "
            f"defectType={last.get('defectType')}, "
            f"confidence={last.get('confidence')}%, "
            f"date={last.get('date')}"
        )

    system_prompt = (
        "You are an AI assistant for an industrial defect detection system. "
        "The system uses a YOLO model to detect corrosion defects in product images. "
        "Answer the user's questions helpfully and conversationally. "
        "You can reply in the same language the user writes in (Arabic or English). "
        "Here is the current inspection data you can reference:\n"
        f"- Total inspections: {total}\n"
        f"- Defective products: {defects}\n"
        f"- Safe (No Defect) products: {safe}\n"
        f"- {last_info}\n"
        "Use this data when relevant, but you can also answer general questions."
    )

    try:
        response = groq_client.chat.completions.create(
            # موديل أخف وأسرع بكتير — كفاية للأسئلة العادية
            # لو عايز ردود أدق ممكن ترجّعه لـ llama-3.3-70b-versatile
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            # قلّلنا الطول عشان الردود تطلع أسرع
            max_tokens=400,
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print("AI chat error:", e)
        return jsonify({"reply": "⚠️ Sorry, the AI assistant is currently unavailable."}), 500


@app.route("/report", methods=["GET"])
def report():
    # ممكن تطلب فحص معيّن بـ ?id=... وإلا هيجيب آخر فحص
    requested_id = request.args.get("id")
    if requested_id:
        d = mongo.db.detections.find_one({"productId": requested_id}, {"_id": 0})
    else:
        d = mongo.db.detections.find_one({}, {"_id": 0}, sort=[("_id", -1)])

    pdf_path = "report.pdf"
    doc = SimpleDocTemplate(
        pdf_path, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=20 * mm, bottomMargin=20 * mm
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle", parent=styles["Title"],
        fontSize=22, textColor=colors.HexColor("#005fa3"), spaceAfter=6
    )
    section_style = ParagraphStyle(
        "Section", parent=styles["Heading2"],
        fontSize=14, textColor=colors.HexColor("#007acc"), spaceBefore=14, spaceAfter=6
    )
    normal = styles["Normal"]

    content = []

    if not d:
        content.append(Paragraph("Inspection Report", title_style))
        content.append(Paragraph("No detections available yet.", normal))
        doc.build(content)
        return send_from_directory(".", pdf_path, as_attachment=True)

    status = d.get("status", "-")
    is_defect = status == "Defect"
    conf = d.get("confidence", 0)

    # ===== Title =====
    content.append(Paragraph("Inspection Report", title_style))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cccccc")))
    content.append(Spacer(1, 10))

    # ===== Product Information =====
    content.append(Paragraph("Product Information", section_style))
    info_table = Table([
        ["Product ID", d.get("productId", d.get("filename", "-"))],
        ["Inspection Date", d.get("date", "-")],
        ["Status", "Defective" if is_defect else "Healthy"],
        ["Confidence Score", f"{conf}%"],
    ], colWidths=[60 * mm, 100 * mm])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f4f8")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#333333")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
        ("PADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    content.append(info_table)

    # ===== Detection Result =====
    content.append(Paragraph("Detection Result", section_style))
    if is_defect:
        content.append(Paragraph(
            "A defect has been detected in the uploaded product image.", normal))
        content.append(Spacer(1, 4))
        content.append(Paragraph(f"<b>Defect Type:</b> {d.get('defectType', '-')}", normal))
        content.append(Paragraph(f"<b>Detection Confidence:</b> {conf}%", normal))
        content.append(Paragraph(
            f"<b>System Analysis:</b> The AI model identified a potential defect "
            f"with a confidence level of {conf}% based on the uploaded image analysis.",
            normal))
    else:
        content.append(Paragraph(
            "No defects were detected in the uploaded product image.", normal))
        content.append(Spacer(1, 4))
        content.append(Paragraph("<b>Product Condition:</b> Healthy", normal))
        content.append(Paragraph(f"<b>Detection Confidence:</b> {conf}%", normal))
        content.append(Paragraph(
            f"<b>System Analysis:</b> The AI model analyzed the uploaded image and "
            f"determined that the product appears to be in good condition with a "
            f"confidence level of {conf}%.",
            normal))

    # ===== Uploaded Image =====
    content.append(Paragraph("Uploaded Image", section_style))
    img_path = os.path.join(RESULTS_FOLDER, d.get("filename", ""))
    if os.path.exists(img_path):
        try:
            content.append(RLImage(img_path, width=120 * mm, height=120 * mm, kind="proportional"))
        except Exception:
            content.append(Paragraph("(Image could not be loaded)", normal))
    else:
        content.append(Paragraph("(Image not found)", normal))

    

    # ===== Support Message =====
    content.append(Spacer(1, 14))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cccccc")))
    content.append(Spacer(1, 8))
    support_style = ParagraphStyle(
        "Support", parent=normal, textColor=colors.HexColor("#007acc"), fontSize=11
    )
    content.append(Paragraph("<b>Need help understanding the result?</b>", support_style))
    content.append(Paragraph(
        "Please use the in-app AI Chat for assistance and detailed guidance.",
        support_style))

    doc.build(content)
    return send_from_directory(".", pdf_path, as_attachment=True)


@app.route("/report-all", methods=["GET"])
def report_all():
    # تقرير شامل بكل الفحوصات وكل صورها
    all_data = list(mongo.db.detections.find({}, {"_id": 0}).sort("_id", -1))

    pdf_path = "report_all.pdf"
    doc = SimpleDocTemplate(
        pdf_path, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=20 * mm, bottomMargin=20 * mm
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle", parent=styles["Title"],
        fontSize=22, textColor=colors.HexColor("#005fa3"), spaceAfter=6
    )
    section_style = ParagraphStyle(
        "Section", parent=styles["Heading2"],
        fontSize=14, textColor=colors.HexColor("#007acc"), spaceBefore=14, spaceAfter=6
    )
    normal = styles["Normal"]

    content = []
    content.append(Paragraph("Full Inspection Report", title_style))
    content.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cccccc")))
    content.append(Spacer(1, 8))

    if not all_data:
        content.append(Paragraph("No detections available yet.", normal))
        doc.build(content)
        return send_from_directory(".", pdf_path, as_attachment=True)

    # ملخّص إحصائي فوق
    total = len(all_data)
    defects = sum(1 for d in all_data if d.get("status") == "Defect")
    safe = total - defects
    content.append(Paragraph(
        f"<b>Total Inspected:</b> {total} &nbsp;&nbsp; "
        f"<b>No Defect:</b> {safe} &nbsp;&nbsp; "
        f"<b>Defect:</b> {defects}", normal))
    content.append(Spacer(1, 6))

    # كل فحص في قسم لوحده بصورته
    for i, d in enumerate(all_data, start=1):
        status = d.get("status", "-")
        is_defect = status == "Defect"
        conf = d.get("confidence", 0)

        content.append(Paragraph(f"Inspection #{i}", section_style))

        info_table = Table([
            ["Product ID", d.get("productId", d.get("filename", "-"))],
            ["Inspection Date", d.get("date", "-")],
            ["Status", "Defective" if is_defect else "Healthy"],
            ["Defect Type", d.get("defectType", "-")],
            ["Confidence Score", f"{conf}%"],
        ], colWidths=[60 * mm, 100 * mm])
        info_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f4f8")),
            ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#333333")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
            ("PADDING", (0, 0), (-1, -1), 6),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        content.append(info_table)
        content.append(Spacer(1, 6))

        # الصورة
        img_path = os.path.join(RESULTS_FOLDER, d.get("filename", ""))
        if os.path.exists(img_path):
            try:
                content.append(RLImage(img_path, width=90 * mm, height=90 * mm, kind="proportional"))
            except Exception:
                content.append(Paragraph("(Image could not be loaded)", normal))
        else:
            content.append(Paragraph("(Image not found)", normal))

        content.append(Spacer(1, 10))
        content.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e0e0e0")))

    # رسالة الـ AI Chat في الآخر
    content.append(Spacer(1, 14))
    support_style = ParagraphStyle(
        "Support", parent=normal, textColor=colors.HexColor("#007acc"), fontSize=11
    )
    content.append(Paragraph("<b>Need help understanding the results?</b>", support_style))
    content.append(Paragraph(
        "If you need any help or have a question, you can contact the AI Chat inside the system.",
        support_style))

    doc.build(content)
    return send_from_directory(".", pdf_path, as_attachment=True)


@app.route("/detections", methods=["GET"])
def detections():
    data = list(mongo.db.detections.find({}, {"_id": 0}).sort("_id", -1))
    return jsonify(data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)