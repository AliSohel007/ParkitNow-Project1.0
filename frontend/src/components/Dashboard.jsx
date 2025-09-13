const Dashboard = () => {
  return (
    <div className="p-6 flex-1 bg-gray-100 min-h-screen">
      {/* Card Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500 text-white p-6 rounded shadow text-center">
          <h3 className="text-4xl font-bold">120</h3>
          <p className="text-lg">Available</p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded shadow text-center">
          <h3 className="text-4xl font-bold">34</h3>
          <p className="text-lg">Occupied</p>
        </div>
        <div className="bg-gray-400 text-white p-6 rounded shadow text-center">
          <h3 className="text-4xl font-bold">12</h3>
          <p className="text-lg">Reserved</p>
        </div>
      </div>

      {/* Booking Table */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Parking Slot</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">A.101</td>
              <td>John Doc</td>
              <td>Aug 1, 2025</td>
              <td className="text-green-600">Confirmed</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">D.302</td>
              <td>Danss Smith</td>
              <td>July 31, 2025</td>
              <td className="text-green-600">Confirmed</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">C.305</td>
              <td>Jans Johnson</td>
              <td>July 30, 2025</td>
              <td className="text-green-600">Confirmed</td>
            </tr>
            <tr>
              <td className="py-2">D.404</td>
              <td>Michael Brown</td>
              <td>July 29, 2025</td>
              <td className="text-green-600">Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
