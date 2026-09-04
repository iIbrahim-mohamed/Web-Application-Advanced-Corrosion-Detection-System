const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// In-memory detections store
let detections = [];

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  // Dummy defect detection logic
  const status = Math.random() > 0.5 ? "OK" : "Defect";
  const defectType = status === "OK" ? "-" : "Scratch";
  const confidence = Math.floor(Math.random() * 21) + 80; // 80-100%

  const detection = {
    filename: file.filename,
    defectType,
    confidence,
    status,
    date: new Date().toISOString(),
  };

  // Avoid duplicates
  if (!detections.find((d) => d.filename === detection.filename)) {
    detections.unshift(detection);
  }

  res.json(detection);
});

// Get all detections
app.get("/detections", (req, res) => {
  res.json(detections);
});

// Delete single detection
app.delete("/detections/:filename", (req, res) => {
  const { filename } = req.params;
  detections = detections.filter((d) => d.filename !== filename);

  // Delete file
  const filePath = path.join(__dirname, "uploads", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  res.json({ success: true });
});

// Clear all
app.delete("/clear_all", (req, res) => {
  detections = [];
  fs.readdirSync(uploadDir).forEach((file) => fs.unlinkSync(path.join(uploadDir, file)));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
