function HistoryTable({ results }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Latest Detections</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Product ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Defect</th>
            <th className="border p-2">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {results.slice().reverse().map((r) => (
            <tr key={r.id}>
              <td className="border p-2"><img src={r.image} className="w-16" /></td>
              <td className="border p-2">P-{r.id.toString().padStart(4,"0")}</td>
              <td className="border p-2">{r.status}</td>
              <td className="border p-2">{r.defect}</td>
              <td className="border p-2">{r.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;
