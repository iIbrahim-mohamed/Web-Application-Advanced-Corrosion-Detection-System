import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import PieChart from "./components/PieChart";
import DetectionsTable from "./components/DetectionsTable";

import About from "./pages/About";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first.");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      const data = res.data;

      const newDetection = {
        image: URL.createObjectURL(image),
        id: data.productId,
        productId: data.productId,
        filename: data.filename,
        status: data.status,
        defect: data.defectType,
        confidence: data.confidence,
        date: data.date,
      };

      setDetections((prev) => [newDetection, ...prev]);
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check server.");
    }
  };

  const totalInspected = detections.length;
  const okCount = detections.filter((d) => d.status === "No Defect").length;
  const defectCount = detections.filter((d) => d.status === "Defect").length;

  const handleDelete = (idx) => {
    setDetections((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Router>
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Navbar />

        <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
          <Routes>
            {/* ====================== Home ====================== */}
            <Route
              path="/"
              element={
                <>
                  <h1
                    style={{
                      marginBottom: "30px",
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                    }}
                  ></h1>

                  {/* Upload Section */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "30px",
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleImageChange}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        flex: "1",
                        background: "#fff",
                      }}
                    />
                    <button
                      onClick={handleUpload}
                      style={{
                        padding: "12px 25px",
                        background: "#007acc",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "background 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#005fa3")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#007acc")
                      }
                    >
                      Upload Image
                    </button>
                  </div>

                  {/* Stats */}
                  <StatsCards
                    totalInspected={totalInspected}
                    noDefect={okCount}
                    defect={defectCount}
                    accuracy="97%"
                  />

                  {/* Chart */}
                  <div style={{ marginTop: "30px", marginBottom: "40px" }}>
                    <PieChart noDefect={okCount} defect={defectCount} />
                  </div>

                  {/* Table */}
                  <DetectionsTable
                    detections={detections}
                    onDelete={handleDelete}
                  />
                </>
              }
            />

            {/* Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;