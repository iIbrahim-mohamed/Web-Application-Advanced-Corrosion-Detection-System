function Sidebar() {
  return (
    <div className="w-64 bg-white p-6 shadow h-screen">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">Dashboard</li>
        <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">Real-Time Detection</li>
        <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">History Log</li>
        <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">Upload Image</li>
      </ul>
    </div>
  );
}

export default Sidebar;
