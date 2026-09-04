import React from "react";

export default function StatsCards({ totalInspected, noDefect, defect, accuracy }) {
  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "default",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100px"
  };

  const cardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
  };

  const cardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
  };

  const labelStyle = { color: "#555", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "500" };
  const valueStyle = { fontSize: "1.5rem", fontWeight: "700", color: "#1a1a1a" };
  const defectiveStyle = { ...valueStyle, color: "#dc3545" };
  const accuracyStyle = { ...valueStyle, color: "#007acc" };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "20px",
      marginTop: "20px",
      marginBottom: "20px"
    }}>
      <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
        <div style={labelStyle}>Total Inspected</div>
        <div style={valueStyle}>{totalInspected}</div>
      </div>

      <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
        <div style={labelStyle}>No Defect</div>
        <div style={valueStyle}>{noDefect}</div>
      </div>

      <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
        <div style={labelStyle}>Defective</div>
        <div style={defectiveStyle}>{defect}</div>
      </div>

      <div style={cardStyle} onMouseEnter={cardHover} onMouseLeave={cardLeave}>
        <div style={labelStyle}>Accuracy</div>
        <div style={accuracyStyle}>{accuracy}</div>
      </div>
    </div>
  );
}