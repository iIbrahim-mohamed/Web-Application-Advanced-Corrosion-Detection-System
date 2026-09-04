import React from "react";

function DetectionsTable({ detections, onDelete }) {

  // تقرير فحص واحد (آخر فحص أو فحص معيّن بالـ ID)
  const downloadReport = async (productId = null) => {
    if (detections.length === 0) {
      alert("No detections available to generate report");
      return;
    }

    try {
      const url = productId
        ? `http://localhost:5000/report?id=${encodeURIComponent(productId)}`
        : `http://localhost:5000/report`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Server error");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Inspection_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download report. Check the server.");
    }
  };

  // تقرير شامل بكل الفحوصات وكل الصور
  const downloadAllReport = async () => {
    if (detections.length === 0) {
      alert("No detections available to generate report");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/report-all");
      if (!res.ok) throw new Error("Server error");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Full_Inspection_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download report. Check the server.");
    }
  };

  return (
    <div style={{
      background: "#f9fafb",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      marginBottom: "20px"
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "0",
        textAlign: "center",
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      }}>
        <thead style={{
          background: "linear-gradient(90deg, #007acc, #005fa3)",
          color: "#fff"
        }}>
          <tr>
            <th style={{ padding: "14px 10px" }}>Image</th>
            <th>Product ID</th>
            <th>Status</th>
            <th>Defect</th>
            <th>Confidence</th>
            <th>Date</th>
            <th>Report</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {detections.map((d, idx) => (
            <tr key={idx}>
              <td><img src={d.image} alt="Detection" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }} /></td>
              <td>{d.id}</td>
              <td style={{ color: d.status === "No Defect" ? "#28a745" : "#dc3545", fontWeight: "bold" }}>{d.status}</td>
              <td>{d.defect}</td>
              <td>{d.confidence}%</td>
              <td>{d.date}</td>
              <td>
                <button
                  onClick={() => downloadReport(d.productId || d.id)}
                  style={{ padding: "6px 12px", background: "#007acc", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}
                >
                  PDF
                </button>
              </td>
              <td>
                <button onClick={() => onDelete(idx)} style={{ padding: "6px 12px", background: "#ff4d4f", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: "25px" }}>
        <button
          onClick={downloadAllReport}
          style={{
            padding: "12px 22px",
            background: "linear-gradient(90deg, #007acc, #005fa3)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

export default DetectionsTable;