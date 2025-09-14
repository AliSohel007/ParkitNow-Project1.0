// src/components/admin/RateSettings.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const RateSettings = () => {
  const [price, setPrice] = useState(50);
  const [intervalTime, setIntervalTime] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ .env dynamic URL

  // 🔄 Fetch current rate from backend
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get(`${API_BASE}/rate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrice(res.data.price || 50);
        setIntervalTime(res.data.interval || 30);
      } catch (err) {
        console.error("Failed to fetch rate:", err.response?.data || err);
        setError("❌ Failed to load rate settings");
      }
    };
    fetchRate();
  }, [token, API_BASE]);

  // 📝 Update rate
  const updateRate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (price < 1 || intervalTime < 1) {
      setError("Rate and interval must be at least 1");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE}/rate`,
        {
          price: Number(price),
          interval: Number(intervalTime),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("✅ Rate updated successfully!");
    } catch (err) {
      console.error("Rate update failed:", err.response?.data || err);
      setError(err.response?.data?.message || "❌ Failed to update rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">⚙️ Parking Rate Settings</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Rate (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Time Interval (minutes)</label>
          <input
            type="number"
            value={intervalTime}
            onChange={(e) => setIntervalTime(Number(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
