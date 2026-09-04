import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

/* ================= STYLES ================= */

const card = {
  width: "100%",
  maxWidth: "1000px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  margin: "40px auto",

  display: "flex",           // flex على الكارت
  flexDirection: "column",   // ترتيب عمودي
  alignItems: "center",      // محاذاة النصوص والعناصر في الوسط
};

const header = {
  marginBottom: "36px",
  textAlign: "center",       // نص في المنتصف
};

const title = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#111827",
  margin: 0,
};

const subtitle = {
  fontSize: "16px",
  color: "#6b7280",
  marginTop: "8px",
};

const content = {
  display: "flex",
  flexDirection: "row",      // الرسمة والستاتس جنب بعض
  alignItems: "center",      // وسط عمودي
  justifyContent: "center",  // وسط أفقي
  gap: "64px",
};

const chartWrapper = {
  width: "420px",
  height: "420px",
};

const stats = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",      // النصوص تبقى في النص
  gap: "32px",
};

const statItem = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const statValue = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#111827",
};

const statLabel = {
  fontSize: "16px",
  color: "#6b7280",
};

/* ========================================== */

function PieChart({ noDefect, defect }) {
  const data = {
    labels: ["No Defect", "Defect"],
    datasets: [
      {
        data: [noDefect, defect],
        backgroundColor: ["#28a745", "#dc3545"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={card}>
      {/* Header */}
      <div style={header}>
        <h2 style={title}>Product Quality Overview</h2>
        <div style={subtitle}>Live inspection status</div>
      </div>

      {/* Content */}
      <div style={content}>
        {/* Chart */}
        <div style={chartWrapper}>
          <Pie data={data} options={options} />
        </div>

        {/* Stats */}
        <div style={stats}>
          <StatItem color="#28a745" label="No Defect" value={noDefect} />
          <StatItem color="#dc3545" label="Defect" value={defect} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ color, label, value }) {
  return (
    <div style={{ ...statItem, justifyContent: "center" }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <div style={{ textAlign: "center" }}>
        <div style={statValue}>{value}</div>
        <div style={statLabel}>{label}</div>
      </div>
    </div>
  );
}

export default PieChart;