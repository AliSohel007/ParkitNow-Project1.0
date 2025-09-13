import { useEffect, useState } from "react";
import axios from "axios";

const Parking = () => {
  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Use .env API base
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const filteredSlots = slots.filter((slot) => {
    if (filter === "all") return true;
    if (filter === "vacant") return slot.status === "vacant";
    if (filter === "occupied") return slot.status === "occupied";
    if (filter === "reserved") return slot.reserved === true;
    return true;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        🅿️ Live Parking Status
      </h2>

      {/* Filter */}
      <div className="mb-6">
        <label className="mr-2 font-semibold text-gray-700">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm focus:outline-none"
        >
          <option value="all">All</option>
          <option value="vacant">🟢 Vacant</option>
          <option value="occupied">🔴 Occupied</option>
          <option value="reserved">🟡 Reserved</option>
        </select>
      </div>

      {loading ? (
        <p>⏳ Loading slots...</p>
      ) : filteredSlots.length === 0 ? (
        <p className="text-gray-500">No slots found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSlots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                🚗 Slot: {slot.slot}
              </h3>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-medium ${
                      slot.status === "vacant"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {slot.status === "vacant" ? "🟢 Vacant" : "🔴 Occupied"}
                  </span>
                </p>
                <p>
                  <strong>Reserved:</strong>{" "}
                  {slot.reserved ? "🟡 Yes" : "No"}
                </p>
                <p>
                  <strong>Rate:</strong> ₹{slot.rate}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {slot.location ? slot.location : "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Parking;
