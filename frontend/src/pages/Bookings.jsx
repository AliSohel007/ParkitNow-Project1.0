import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api"; // ✅ single source

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loadingCheckoutId, setLoadingCheckoutId] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const endpoint =
        role === "admin" ? `${API_BASE}/bookings/all` : `${API_BASE}/bookings/my`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data?.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err.response?.data || err.message);
      setError("Error loading bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Checkout active booking (user only)
  const handleCheckout = async (bookingId) => {
    setLoadingCheckoutId(bookingId);

    try {
      const res = await axios.post(
        `${API_BASE}/bookings/exit/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const completedBooking = res.data.booking;
      navigate(`/exit-summary/${completedBooking._id}`, {
        state: { summary: completedBooking },
      });
    } catch (err) {
      console.error("Exit failed:", err.response?.data || err.message);
      alert(err?.response?.data?.message || "❌ Failed to checkout");
    } finally {
      setLoadingCheckoutId("");
      fetchBookings(); // refresh bookings after checkout
    }
  };

  // Filters
  const filteredByEmail = bookings.filter((b) =>
    role === "admin"
      ? b.userId?.email?.toLowerCase().includes(searchEmail.toLowerCase())
      : true
  );

  const filteredByDate = filteredByEmail.filter((b) => {
    const start = new Date(b.startTime);
    return (
      (!fromDate || start >= new Date(fromDate)) &&
      (!toDate || start <= new Date(toDate))
    );
  });

  // Export CSV
  const exportToCSV = () => {
    if (!filteredByDate.length) return;

    const rows = filteredByDate.map((b) => ({
      Email: b.userId?.email || "N/A",
      Slot: b.slotId?.slot || "N/A",
      Rate: b.slotId?.rate || 0,
      Location: b.slotId?.location || "Not specified",
      StartTime: new Date(b.startTime).toLocaleString(),
      EndTime: b.endTime ? new Date(b.endTime).toLocaleString() : "-",
      Duration: b.duration || "-",
      Fare: b.fare || "-",
      Status: b.isActive ? "Active" : "Completed",
    }));

    const csv =
      "data:text/csv;charset=utf-8," +
      [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).join(","))].join("\n");

    const encoded = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        {role === "admin" ? "📋 All Bookings (Admin)" : "📋 Your Bookings"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Filters */}
      {role === "admin" && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {filteredByDate.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredByDate.map((booking) => (
            <div key={booking._id} className="border p-4 rounded shadow bg-white">
              {role === "admin" && (
                <p className="text-sm text-gray-600 mb-2">
                  👤 User: <strong>{booking.userId?.email || "N/A"}</strong>
                </p>
              )}
              <h3 className="font-semibold text-lg mb-2">
                Slot: {booking.slotId?.slot || "N/A"}
              </h3>
              <p>
                <strong>Location:</strong> {booking.slotId?.location || "Not specified"}
              </p>
              <p>
                <strong>Rate:</strong> ₹{booking.slotId?.rate || 0}
              </p>
              <p>
                <strong>Start Time:</strong> {new Date(booking.startTime).toLocaleString()}
              </p>
              {booking.endTime && (
                <p>
                  <strong>End Time:</strong> {new Date(booking.endTime).toLocaleString()}
                </p>
              )}
              {booking.duration && (
                <p>
                  <strong>Duration:</strong> {booking.duration} minutes
                </p>
              )}
              {booking.fare && (
                <p>
                  <strong>Total Fare:</strong> ₹{booking.fare}
                </p>
              )}
              <p>
                <strong>Status:</strong> {booking.isActive ? "🟢 Active" : "✅ Completed"}
              </p>

              <p className="text-xs mt-2 text-gray-500">
                <strong>Booking ID:</strong> {booking._id}
              </p>

              {/* Checkout button for active bookings (user only) */}
              {booking.isActive && role !== "admin" && (
                <button
                  onClick={() => handleCheckout(booking._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                  disabled={loadingCheckoutId === booking._id}
                >
                  {loadingCheckoutId === booking._id ? "Processing..." : "Checkout"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
