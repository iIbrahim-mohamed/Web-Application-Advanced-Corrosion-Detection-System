import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.jpeg";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        background: "#fff",
        boxShadow: "0 4px 15px rgba(45, 188, 255, 0.08)",
        borderRadius: "12px",
        marginBottom: "25px",
        gap: "15px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />

        <h2
          style={{
            margin: 0,
            fontSize: "1.3rem",
          }}
        >
          Sentinel Corro
        </h2>
      </div>

      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          listStyle: "none",
          gap: "15px",
          margin: 0,
          padding: 0,
          justifyContent: "center",
        }}
      >
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chat">AI Chat</Link></li>
        <li><Link to="/about">About Us</Link></li>

        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>

      <div>
        {user ? (
          <>
            <span
              style={{
                marginRight: "10px",
                color: "green",
                display: "block",
                marginBottom: "5px",
              }}
            >
              {user.name}
            </span>

            <button
              onClick={logout}
              style={{
                padding: "8px 14px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <span style={{ color: "gray" }}>Logged Out</span>
        )}
      </div>
    </nav>
  );
}