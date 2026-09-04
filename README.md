# 🛡️ Sentinel Corro
## Advanced AI-Powered Corrosion Detection System

> An intelligent web-based inspection platform that uses **YOLO object detection** to identify corrosion in product images, visualize inspection results, maintain detection history, generate PDF reports, and provide an AI assistant for inspection-related questions.

---

## 📌 Overview

**Sentinel Corro** is an AI-powered industrial inspection web application designed to support automated corrosion detection from product images.

The platform combines a modern **React.js dashboard** with a **Python Flask backend**, a trained **YOLO model**, **MongoDB** for persistent inspection data, and an **AI Assistant powered by Groq**.

The system is designed around a simple workflow:

**Upload Image → AI Inspection → Detection Result → Store Result → Visualize History → Generate Report**

The project also includes authentication, an inspection dashboard, result visualization, PDF reporting, and an AI chat interface.

---

## ✨ Key Features

### 🔍 AI Corrosion Detection
- Upload product images for automated inspection.
- Uses a **YOLO model** for object detection.
- Configurable confidence threshold for predictions.
- Detects corrosion when relevant objects are found.
- Calculates and displays a confidence score.
- Generates an annotated result image with detected regions.

### 📊 Inspection Dashboard
- Total inspection statistics.
- Defect / No Defect overview.
- Detection confidence information.
- Inspection results table.
- Visual result summaries using charts.

### 🧾 Inspection Reports
- Generate a PDF report for the latest inspection.
- Generate a report for a specific Product ID.
- Generate a complete inspection report.
- Reports include product information, inspection date, status, confidence, detection result, and inspection image.

### 🤖 AI Assistant
- Integrated AI chat interface.
- Powered by **Groq**.
- Uses current inspection statistics when answering relevant questions.
- Supports both **Arabic and English** conversations.
- Can answer questions about the system, inspection results, machine problems, and suggested solutions.

### 🔐 Authentication
- User registration and login.
- Password hashing with **Bcrypt**.
- JWT-based authentication.
- Protected image-upload workflow.

### 🗄️ Data Management
- MongoDB database integration.
- Persistent storage for detection records.
- Unique Product IDs for inspections.
- Stores status, defect type, confidence, detection count, image URL, and timestamp.

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React.js** | User interface |
| **React Router** | Application navigation |
| **Axios** | API communication |
| **Material UI** | UI components |
| **Chart.js / react-chartjs-2** | Data visualization |
| **React Dropzone** | File upload support |
| **jsPDF / html2canvas** | Client-side PDF utilities |

### Backend

| Technology | Purpose |
|---|---|
| **Python** | Backend and AI integration |
| **Flask** | REST API |
| **Flask-CORS** | Cross-origin communication |
| **Ultralytics YOLO** | Corrosion object detection |
| **OpenCV** | Image processing and annotated results |
| **Pillow** | Image handling |
| **MongoDB** | Detection and user data storage |
| **PyMongo / Flask-PyMongo** | MongoDB integration |
| **Flask-Bcrypt** | Password hashing |
| **PyJWT** | JWT authentication |
| **ReportLab** | PDF report generation |
| **Groq API** | AI Assistant |

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│          React Frontend      │
│                              │
│ Dashboard • Login • Profile  │
│ About • AI Chat • Results    │
└──────────────┬───────────────┘
               │ HTTP / REST API
               ▼
┌──────────────────────────────┐
│        Flask Backend         │
│                              │
│ Authentication               │
│ Image Upload                 │
│ YOLO Inference               │
│ Detection Storage            │
│ PDF Reports                  │
│ AI Assistant                 │
└───────┬───────────┬──────────┘
        │           │
        ▼           ▼
┌────────────┐   ┌────────────────┐
│ MongoDB    │   │ YOLO Model     │
│            │   │                │
│ Users      │   │ best.pt        │
│ Detections │   │ Corrosion      │
└────────────┘   │ Detection      │
                 └────────────────┘
                       │
                       ▼
                Annotated Results
```

---

## 🔄 Application Workflow

### 1. Authentication
The user creates an account or logs into the system.

### 2. Image Upload
An inspection image is uploaded through the React dashboard.

### 3. AI Analysis
The Flask backend sends the image to the YOLO model for inference.

### 4. Detection
The system checks the detected objects and calculates the highest confidence score.

### 5. Result Classification
The inspection is classified as:

- **No Defect** — no corrosion detection was returned.
- **Defect** — corrosion was detected.

### 6. Data Storage
The inspection result is stored in MongoDB with a generated Product ID.

### 7. Visualization
The frontend displays the inspection result and updates the dashboard.

### 8. Reporting
The user can generate an individual or complete PDF inspection report.

### 9. AI Assistance
The built-in AI Assistant can use current inspection statistics to answer relevant questions.

---

## 📁 Project Structure

```text
Web-Application-for-Advanced-Corrosion-Detection-System/
│
├── public/
├── src/
│   ├── components/
│   │   ├── DetectionsTable.jsx
│   │   ├── Header.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── Navbar.jsx
│   │   ├── PieChart.jsx
│   │   └── StatsCards.jsx
│   │
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   └── index.css
│
├── app.py
├── server.py
├── server.js
├── create_model.py
├── best.pt
├── data.json
├── detections.json
├── package.json
├── requirements.txt
├── report.pdf
├── report_all.pdf
└── README.md
```

> **Note:** The repository contains multiple backend/model-related files. The main `app.py` implementation uses the Ultralytics YOLO pipeline, MongoDB, PDF reporting, and the Groq AI Assistant.

---

## ⚙️ Requirements

Before running the project, make sure you have:

- **Node.js** and npm
- **Python 3.x**
- **MongoDB**
- A valid trained YOLO model file: `best.pt`
- A **Groq API key** for the AI Assistant

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iIbrahim-mohamed/Web-Application-Advanced-Corrosion-Detection-System.git
cd Web-Application-Advanced-Corrosion-Detection-System
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Create a Python Virtual Environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

If your environment does not already provide the backend packages used by `app.py`, install the additional dependencies:

```bash
pip install ultralytics groq pymongo flask-pymongo flask-bcrypt PyJWT reportlab python-dotenv
```

### 5. Configure MongoDB

The backend uses MongoDB locally.

Default database configuration:

```text
mongodb://localhost:27017/defect_ai_db
```

Make sure MongoDB is running before starting the Flask backend.

### 6. Configure the Groq API

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Do **not** commit your real API key to GitHub.

### 7. Verify the YOLO Model

Make sure the trained model is available at:

```text
best.pt
```

The backend loads the model with:

```python
model = YOLO("best.pt")
```

---

## ▶️ Running the Application

### Start the Flask Backend

```bash
python app.py
```

The backend runs using Flask's development server.

### Start the React Frontend

In another terminal:

```bash
npm start
```

The React development application will normally be available at:

```text
http://localhost:3000
```

The frontend communicates with the Flask API on:

```text
http://localhost:5000
```

---

## 🔌 Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Create a new user |
| `POST` | `/login` | Authenticate a user |
| `POST` | `/upload` | Upload an image and run YOLO detection |
| `GET` | `/detections` | Retrieve stored detection records |
| `GET` | `/result-image/<filename>` | Retrieve an annotated result image |
| `POST` | `/ai_chat` | Send a message to the AI Assistant |
| `GET` | `/report` | Generate a single inspection report |
| `GET` | `/report-all` | Generate a complete inspection report |

---

## 📈 Detection Result

Each inspection can contain information such as:

```json
{
  "filename": "example.jpg",
  "productId": "P-ABC123",
  "status": "Defect",
  "defectType": "Corrosion",
  "confidence": 94.52,
  "detectionsCount": 2,
  "imageUrl": "/result-image/example.jpg",
  "date": "2026-09-04 12:30:00"
}
```

---

## 🧠 AI Detection Pipeline

The image-processing pipeline in `app.py` follows this general flow:

```text
Input Image
     │
     ▼
YOLO Inference
     │
     ▼
Detected Bounding Boxes
     │
     ├── No detections → No Defect
     │
     └── Detection(s) → Defect / Corrosion
                          │
                          ▼
                  Confidence Score
                          │
                          ▼
                  Annotated Image
                          │
                          ▼
                    MongoDB Record
```

The current implementation uses a confidence threshold of **0.50** and an image size of **512** for the YOLO prediction call.

---

## 🧾 PDF Reporting

The application provides automated PDF reporting through the Flask backend.

A report can include:

- Product ID
- Inspection date
- Inspection status
- Confidence score
- Detection result
- Uploaded / annotated inspection image
- System analysis

This makes the system suitable for keeping inspection records and sharing results.

---

## 🤖 AI Assistant

The AI Assistant is connected to the Groq API and receives contextual inspection information, including:

- Total inspections
- Number of defective products
- Number of safe products
- Latest detection result

It can communicate in **Arabic or English**, depending on the user's message.

Example questions:

```text
How does the system work?

Show the latest inspection result.

How many defective products were detected?

What should I do if corrosion is detected?
```

---

## 🔐 Security Considerations

The project includes several security-related mechanisms:

- Password hashing with Bcrypt.
- JWT-based authentication.
- Protected authentication flow for inspection operations.
- Environment variables for the Groq API key.
- CORS configuration for frontend/backend communication.

### Important Before Production

The current source contains development-oriented configuration such as local MongoDB settings and development secret values.

Before deploying publicly:

- Move all secrets to environment variables.
- Use a strong, randomly generated JWT secret.
- Configure MongoDB credentials securely.
- Restrict CORS to trusted origins.
- Validate uploaded file types and sizes.
- Disable Flask debug mode.
- Add rate limiting and stronger API validation.
- Never commit `.env` files or API keys.

---

## 🖥️ Interface

The application includes dedicated pages/components for:

- Dashboard
- Authentication
- User Profile
- About / Team
- AI Assistant
- Detection Results
- Statistics
- Charts
- PDF Reports

---

## 👥 Team

### Sentinel Corro Team

**Sentinel Corro – Sensor Metal Corrosion AI** was developed by a multidisciplinary student team from **SUTECH – Elsewedy University – Polytechnic of Egypt**, bringing together backgrounds including Computer Science and Network & Cyber Security.

The project was developed under the mentorship of **Dr. Mariam Mohamed**.

---

## 🎯 Vision

The project aims to support industrial inspection by helping identify corrosion at an early stage, reduce operational risks, improve inspection efficiency, and provide data-driven assistance for better decision-making.

---

## 🔮 Future Improvements

Potential future improvements include:

- Real-time camera/video inspection.
- More corrosion classes and defect categories.
- Improved model training and evaluation.
- Confidence threshold configuration from the dashboard.
- User-specific inspection history.
- Role-based access control.
- Advanced analytics and trend visualization.
- Cloud deployment.
- Containerization with Docker.
- Automated model/version management.
- More detailed AI-generated inspection recommendations.

---

## 📄 License

This project is currently presented as an academic / portfolio project.

If you plan to reuse or distribute the code, please contact the repository owner for licensing details.

---

## 👨‍💻 Author

**Ibrahim Mohamed**

- GitHub: `iIbrahim-mohamed`
- LinkedIn: `ibrahim-mohamed-679518423`

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  <b>Sentinel Corro</b><br>
  AI-Powered Corrosion Detection for Smarter Industrial Inspection
</p>
