import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieCharts({ results }) {
  const counts = results.reduce((acc, r) => {
    acc[r.defect] = (acc[r.defect] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: ["#00FF00", "#0000FF", "#FF0000", "#AAAAAA"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Defect Distribution</h3>
        <Pie data={data} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Defect Distribution (Alternative)</h3>
        <Pie data={data} />
      </div>
    </div>
  );
}

export default PieCharts;
