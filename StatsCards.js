function StatsCards({ results }) {
  const total = results.length;
  const ok = results.filter(r => r.status === "OK").length;
  const defective = results.filter(r => r.status === "Defective").length;
  const accuracy = total === 0 ? 0 : Math.round((ok / total) * 100);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">Total Inspected<br/><strong>{total}</strong></div>
      <div className="bg-white p-4 rounded shadow">OK Products<br/><strong>{ok}</strong></div>
      <div className="bg-white p-4 rounded shadow">Defective<br/><strong>{defective}</strong></div>
      <div className="bg-white p-4 rounded shadow">Accuracy<br/><strong>{accuracy}%</strong></div>
    </div>
  );
}

export default StatsCards;
