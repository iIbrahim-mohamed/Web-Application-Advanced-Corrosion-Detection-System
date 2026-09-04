import React from "react";

export default function Header() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: "#1a1a1a"
      }}>
        Dashboard
      </h1>
      <div style={{ display: "flex", gap: "12px" }}>
        <button style={{
          padding: "8px 16px",
          backgroundColor: "#007acc",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          transition: "background 0.3s"
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#005fa3"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#007acc"}
        >
          Notifications
        </button>

        <button style={{
          padding: "8px 16px",
          backgroundColor: "#6b7280",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          transition: "background 0.3s"
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#4b5563"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#6b7280"}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
