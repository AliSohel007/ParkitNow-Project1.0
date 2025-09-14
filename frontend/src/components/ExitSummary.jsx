import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";

const ExitSummary = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const passedSummary = location.state?.summary;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (passedSummary) {
      setSummary({
        slot: passedSummary.slotId?.slot || "N/A",
        duration: `${passedSummary.duration} minutes`,
        totalFare: `₹${passedSummary.fare}`,
        status: "✅ Completed",
        exitTime: passedSummary.endTime,
      });
      setLoading(false);
      return;
    }

    let retries = 3;
    const retryDelay = 400;

    const fetchSummary = async () => {
      if (!bookingId) {
        setError("❌ Invalid booking ID");
        setLoading(false);
        return;
      }

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const res = await axios.get(`${API_BASE}/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const booking = res.data.booking;
          if (!booking) {
            setError("Booking not found.");
            break;
          }

          if (!booking.isActive && booking.fare && booking.endTime) {
            setSummary({
              slot: booking.slotId?.slot || "Unknown Slot",
              duration: booking.duration ? `${booking.duration} minutes` : "N/A",
              totalFare: booking.fare ? `₹${Math.round(booking.fare)}` : "N/A",
              status: "✅ Completed",
              exitTime: booking.endTime,
            });
            break;
          } else {
            console.warn(`⚠️ Booking not completed yet (attempt ${attempt})`);
            if (attempt < retries) await new Promise((res) => setTimeout(res, retryDelay));
            else setError("Booking not completed yet.");
          }
        } catch (err) {
          console.error("❌ Failed to fetch exit summary:", err);
          setError(err?.response?.data?.message || "Error fetching exit summary");
          break;
        }
      }
      setLoading(false);
    };

    fetchSummary();
  }, [bookingId, passedSummary, token]);

  if (loading) return <p className="text-center mt-8">⏳ Loading summary...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">❌ {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        🚗 Exit Summary
      </h2>
      <div className="space-y-2 text-lg">
        <p><strong>Slot:</strong> {summary.slot}</p>
        <p><strong>Duration:</strong> {summary.duration}</p>
        <p><strong>Total Fare:</strong> {summary.totalFare}</p>
        <p><strong>Status:</strong> {summary.status}</p>
        <p>
          <strong>Exit Time:</strong>{" "}
          {summary.exitTime ? new Date(summary.exitTime).toLocaleString() : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ExitSummary;
