export const topStats = {
  total: 1540,
  ok: 1416,
  defective: 124,
  accuracy: 97
};

export const pieData = [
  { type: "Crack", value: 50, color: "#4ade80" },
  { type: "Scratch", value: 40, color: "#3b82f6" },
  { type: "Contamination", value: 34, color: "#f87171" }
];

export const latestDetections = [
  {
    id: "P-1123",
    image: "/images/plastic1.jpg",
    status: "Defect",
    defect: "Crack",
    confidence: 0.92,
    date: "2025-11-22"
  },
  {
    id: "P-1124",
    image: "/images/plastic2.jpg",
    status: "OK",
    defect: "None",
    confidence: 0.99,
    date: "2025-11-22"
  }
];
