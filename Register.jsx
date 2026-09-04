import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../components/logo.jpeg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      alert(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "60px",
      minHeight: "100vh",
      background: "#f5f5f5",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px 25px",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "350px",
        textAlign: "center"
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "160px",
            height: "160px",
            objectFit: "contain",
            margin: "0 auto 25px",
            display: "block"
          }}
        />

        <h2 style={{
          marginBottom: "25px",
          fontWeight: "700",
          fontSize: "1.6rem",
          color: "#1a1a1a"
        }}>
          Create Account
        </h2>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "0.95rem",
              outline: "none",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)"
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "0.95rem",
              outline: "none",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "0.95rem",
              outline: "none",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#007acc",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s"
            }}
            onMouseEnter={(e) =>
              !loading && (e.target.style.background = "#005fa3")
            }
            onMouseLeave={(e) =>
              !loading && (e.target.style.background = "#007acc")
            }
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#007acc", fontWeight: "600" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}