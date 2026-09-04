import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px" }}>
      <h2>👤 Profile</h2>

      {user ? (
        <div style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "400px"
        }}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}