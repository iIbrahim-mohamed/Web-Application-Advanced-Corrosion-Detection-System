import React, { useState, useEffect, useRef } from "react";

function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! Ask me about system, results, or problems.", id: 1 }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(customText = null) {
    const text = customText || input;
    if (!text.trim()) return;

    const userMsg = { sender: "user", text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/ai_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setTimeout(() => {
        const botMsg = { sender: "bot", text: data.reply, id: Date.now() };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
      }, 600);

    } catch (err) {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "❌ Server error",
        id: Date.now()
      }]);
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>🤖 AI Assistant</div>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#007acc" : "#f1f1f1",
              color: msg.sender === "user" ? "#fff" : "#222"
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div style={styles.typing}>🤖 Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.suggestions}>
        <button onClick={() => sendMessage("How does the system work?")}>System Work</button>
        <button onClick={() => sendMessage("Show last result")}>Last Result</button>
        <button onClick={() => sendMessage("Machine problem")}>Machine Problem</button>
        <button onClick={() => sendMessage("Give solution")}>Solution</button>
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={() => sendMessage()} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  },
  header: { background: "#007acc", color: "#fff", padding: "15px", fontWeight: "bold", fontSize: "18px" },
  chatBox: { height: "400px", overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9" },
  message: { padding: "12px 16px", borderRadius: "18px", maxWidth: "70%", animation: "fadeIn 0.3s ease" },
  typing: { fontStyle: "italic", color: "#888" },
  suggestions: { display: "flex", gap: "8px", padding: "10px", flexWrap: "wrap", borderTop: "1px solid #eee" },
  inputArea: { display: "flex", borderTop: "1px solid #ddd" },
  input: { flex: 1, padding: "12px", border: "none", outline: "none" },
  button: { padding: "12px 18px", background: "#007acc", color: "#fff", border: "none", cursor: "pointer" }
};

export default Chat;