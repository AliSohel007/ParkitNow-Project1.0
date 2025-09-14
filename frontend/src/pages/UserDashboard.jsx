import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config/api"; // ✅ .env se ek hi source

const UserDashboard = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all vacant & unreserved slots
  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(
        (slot) => slot.status === "vacant" && !slot.reserved
      );
      setAvailableSlots(filtered);
    } catch (err) {
      console.error("Error fetching slots", err);
    }
  };

  // Fetch user's current active booking
  const fetchCurrentBooking = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bookings/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentBooking(res.data?.booking || null);
    } catch (err) {
      console.error("Error fetching current booking", err);
    }
  };

  // Book a slot
  const handleBook = async (slotId) => {
    if (loading || currentBooking) return;
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/bookings/create`,
        { slotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Slot booked successfully!");
      fetchSlots();
      fetchCurrentBooking();
    } catch (err) {
      console.error("Booking failed", err.response?.data || err.message);
      alert("❌ Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // End current booking
  const handleEndBooking = async (bookingId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/bookings/exit/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(
        `✅ Booking Ended!\nDuration: ${res.data.duration}\nFare: ₹${res.data.totalFare}`
      );
      fetchSlots();
      fetchCurrentBooking();
    } catch (err) {
      console.error("End booking failed", err.response?.data || err.message);
      alert("❌ Failed to end booking");
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchCurrentBooking();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <p className="text-gray-700">Welcome! Ready to book a slot? 🚗</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
        <div className="bg-green-500 text-white p-6 rounded shadow">
          <h2 className="text-3xl font-bold">{availableSlots.length}</h2>
          <p>Available Slots</p>
        </div>
        <div className="bg-gray-600 text-white p-6 rounded shadow">
          <h2 className="text-3xl font-bold">{currentBooking ? 1 : 0}</h2>
          <p>Your Active Booking</p>
        </div>
      </div>

      {/* Current Booking */}
      {currentBooking && (
        <div className="mb-6 p-4 border border-green-500 bg-green-50 rounded shadow">
          <h3 className="font-bold text-lg mb-2">📋 Your Current Booking</h3>
          <p>
            <strong>Slot:</strong> {currentBooking.slot?.slot}
          </p>
          <p>
            <strong>Rate:</strong> ₹{currentBooking.slot?.rate}
          </p>
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(currentBooking.startTime).toLocaleString()}
          </p>
          <button
            onClick={() => handleEndBooking(currentBooking._id)}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            End Booking
          </button>
        </div>
      )}

      {/* Available Slots Grid */}
      <h2 className="text-xl font-semibold mb-2">Available Slots</h2>
      {availableSlots.length === 0 ? (
        <p className="text-gray-500">
          No vacant slots available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableSlots.map((slot) => (
            <div
              key={slot._id}
              className="border p-4 rounded shadow flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-semibold">Slot: {slot.slot}</p>
                <p>Rate: ₹{slot.rate}</p>
                <p>Location: {slot.location || "-"}</p>
              </div>
              <button
                disabled={!!currentBooking || loading}
                onClick={() => handleBook(slot._id)}
                className={`mt-3 py-1 px-3 rounded text-white ${
                  currentBooking || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
