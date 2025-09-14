import { useEffect, useState } from "react";
import axios from "axios";
import { FaCarSide } from "react-icons/fa";
import { API_BASE } from "../config/api"; // central config

const AdminDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE}/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Ensure response is always array
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.slots || [];
      setSlots(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError("Failed to load slots");
      setSlots([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 10000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  // ✅ Safe calculations
  const total = slots.length;
  const vacant = slots.filter((s) => s.status === "vacant").length;
  const occupied = slots.filter((s) => s.status === "occupied").length;
  const reserved = slots.filter((s) => s.reserved).length;

  // ✅ Group by level
  const groupByLevel = {};
  slots.forEach((slot) => {
    const slotName = slot.slot || slot.slotNumber || slot.name || "A0";
    const firstLetter = slotName.charAt(0).toUpperCase();
    const level = firstLetter === "B" ? "Level 2" : "Level 1";

    if (!groupByLevel[level]) {
      groupByLevel[level] = [];
    }
    groupByLevel[level].push({ ...slot, slotName });
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 text-center border-t-4 border-blue-500">
          <h3 className="text-lg font-medium">Total Slots</h3>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center border-t-4 border-green-500">
          <h3 className="text-lg font-medium">Vacant</h3>
          <p className="text-3xl font-bold text-green-600">{vacant}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center border-t-4 border-red-500">
          <h3 className="text-lg font-medium">Occupied</h3>
          <p className="text-3xl font-bold text-red-600">{occupied}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center border-t-4 border-yellow-500">
          <h3 className="text-lg font-medium">Reserved</h3>
          <p className="text-3xl font-bold text-yellow-600">{reserved}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading slot data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      )}

      {/* Floor-wise Grid View */}
      <div className="space-y-8">
        {Object.entries(groupByLevel).map(([level, levelSlots]) => (
          <div key={level}>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              {level}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {levelSlots.map((slot) => {
                const isOccupied = slot.status === "occupied";
                const bgColor = isOccupied ? "bg-red-100" : "bg-green-100";
                const textColor = isOccupied ? "text-red-600" : "text-green-600";

                return (
                  <div
                    key={slot._id}
                    className={`rounded-xl p-4 ${bgColor} ${textColor} flex items-center justify-center gap-2 shadow-md transition-all duration-300`}
                  >
                    <span className="font-bold text-lg">{slot.slotName}</span>
                    <FaCarSide className="text-xl" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
