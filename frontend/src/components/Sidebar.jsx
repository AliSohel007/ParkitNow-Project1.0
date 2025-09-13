import {
  FaHome,
  FaCar,
  FaClipboardList,
  FaTools,
  FaThList,
  FaHistory,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const activeClass = (path) =>
    `flex items-center gap-3 p-2 rounded transition-all duration-200 ${
      location.pathname === path
        ? "bg-blue-800 text-white font-semibold"
        : "hover:bg-blue-700 text-gray-200"
    }`;

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">🚗 ParkitNow</h1>

      <nav className="flex flex-col gap-3">
        <Link to="/" className={activeClass("/")}>
          <FaHome /> Dashboard
        </Link>

        <Link to="/parking" className={activeClass("/parking")}>
          <FaCar /> Parking
        </Link>

        <Link to="/bookings" className={activeClass("/bookings")}>
          <FaClipboardList /> Bookings
        </Link>

        <Link to="/booking-history" className={activeClass("/booking-history")}>
          <FaHistory /> Booking History
        </Link>

        <Link to="/settings" className={activeClass("/settings")}>
          <FaTools /> Settings
        </Link>

        {/* 🔒 Admin-only */}
        {role === "admin" && (
          <>
            <Link to="/admin/slots" className={activeClass("/admin/slots")}>
              <FaThList /> Slot Management
            </Link>
            {/* ❌ Removed Rate Settings from Sidebar */}
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
