import { useEffect, useState } from "react";
import axios from "axios";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL; // ✅ URL .env se aayega

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching booking history", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📜 Booking History</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-5">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-5 border border-gray-200 rounded-xl shadow-md bg-white"
            >
              <p><strong>📍 Slot:</strong> {b.slotId?.slot || "N/A"}</p>
              <p><strong>💰 Rate:</strong> ₹{b.slotId?.rate || 0} / hour</p>
              <p><strong>⏱️ Start:</strong> {new Date(b.startTime).toLocaleString()}</p>
              <p><strong>🏁 End:</strong> {b.endTime ? new Date(b.endTime).toLocaleString() : "🟢 Ongoing"}</p>
              <p><strong>🕒 Duration:</strong> {b.durationMinutes ? `${b.durationMinutes} mins` : "-"}</p>
              <p><strong>📦 Blocks (5-min):</strong> {b.blocksUsed ?? "-"}</p>
              <p>
                <strong>💵 Fare:</strong>{" "}
                {b.fare && b.blocksUsed ? (
                  <>
                    ₹{b.fare}{" "}
                    <span className="text-sm text-gray-500">
                      ({b.blocksUsed} × ₹{Math.round((b.fare / b.blocksUsed) * 100) / 100})
                    </span>
                  </>
                ) : b.fare ? (
                  `₹${b.fare}`
                ) : (
                  "-"
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
