import React from "react";
import logo from "../components/logo.jpeg";

export default function About() {
  return (
    <div style={{
      fontFamily: "Georgia, 'Times New Roman', Times, serif",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "50px 20px",
      background: "transparent" // إزالة لون الخلفية
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
        padding: "40px 30px",
        maxWidth: "800px",
        width: "100%",
        textAlign: "center"
      }}>
        {/* اللوجو أكبر */}
        <img 
          src={logo} 
          alt="Logo" 
          style={{
            width: "220px",   // حجم أكبر
            height: "220px",
            objectFit: "contain",
            margin: "0 auto 30px",
            display: "block"
          }}
        />

        <h1 style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#007acc",
          marginBottom: "25px"
        }}>
          About Us – Sentinel Corro Team
        </h1>

        <p style={{
          fontSize: "1rem",
          lineHeight: "1.8",
          marginBottom: "20px",
          color: "#333",
          textAlign: "justify"
        }}>
          We are a dynamic team of 8 students from SUTECH – ELSEWEDY UNIVERSITY – Polytechnic of Egypt, representing diverse fields including Computer Science and Network & Cyber Security. Despite our different specialties, we are united by a single mission: to create an innovative project that transforms industry and sets new standards of excellence.
        </p>

        <p style={{
          fontSize: "1rem",
          lineHeight: "1.8",
          marginBottom: "25px",
          color: "#333",
          textAlign: "justify"
        }}>
          Guided by the mentorship of Dr. Mariam Mohamed, we strive to deliver a project that reflects our technical expertise, creativity, and commitment to making a real-world impact.
        </p>

        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#007acc",
          marginBottom: "15px",
          textAlign: "left"
        }}>
          Our Vision
        </h2>
        <ul style={{
          textAlign: "left",
          paddingLeft: "20px",
          marginBottom: "25px",
          color: "#333",
          lineHeight: "1.6"
        }}>
          <li>Detect metal corrosion at its earliest stage before it causes damage.</li>
          <li>Prevent failures and minimize operational risks.</li>
          <li>Enhance industrial safety and reduce losses.</li>
          <li>Analyze errors and provide AI-driven recommendations for smarter, faster decision-making.</li>
        </ul>

        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#007acc",
          marginBottom: "15px",
          textAlign: "left"
        }}>
          Our Mission
        </h2>
        <p style={{
          fontSize: "1rem",
          lineHeight: "1.8",
          color: "#333",
          textAlign: "justify"
        }}>
          Our goal is for Sentinel Corro – Sensor Metal Corrosion AI to become a landmark project that showcases our team’s potential, sets a benchmark for innovation, and drives the evolution of industrial safety and efficiency worldwide.
        </p>
      </div>
    </div>
  );
}

