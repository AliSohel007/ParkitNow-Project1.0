import { useState, useEffect } from "react";
import axios from "axios";

const RateSettings = () => {
  const [price, setPrice] = useState(50);
  const [interval, setInterval] = useState(30);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Backend base URL from environment variable
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch current rate on component mount
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/rate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Fetched rate from backend:", res.data);
        setPrice(res.data.price || 50);
        setInterval(res.data.interval || 30);
      } catch (err) {
        console.error("❌ Failed to fetch rate:", err.response?.data || err);
        alert("Error fetching rate settings.");
      }
    };

    fetchRate();
  }, [token, API_BASE]);

  // ✅ Update rate
  const updateRate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE}/api/rate`,
        {
          price: Number(price),
          interval: Number(interval),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Rate update success:", res.data);
      alert("✅ Rate updated successfully!");
    } catch (err) {
      console.error("❌ Rate update failed:", err.response?.data || err);
      alert(
        "❌ Failed to update rate: " +
          (err.response?.data?.message || "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">⚙️ Parking Rate Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Rate (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Time Interval (minutes)
          </label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        <button
          onClick={updateRate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default RateSettings;
