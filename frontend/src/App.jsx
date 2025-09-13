// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Parking from "./pages/Parking";
import Bookings from "./pages/Bookings";
import Settings from "./pages/Settings";
import BookingHistory from "./pages/BookingHistory";
import ExitSummary from "./components/ExitSummary";

// Admin components
import SlotManagement from "./components/admin/SlotManagement";
import RateSettings from "./components/admin/RateSettings";

const Layout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Topbar />
      <div className="p-4">{children}</div>
    </div>
  </div>
);

const RoleBasedDashboard = () => {
  const role = localStorage.getItem("role");
  return role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

function App() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Protected User/Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <RoleBasedDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parking"
        element={
          <ProtectedRoute>
            <Layout>
              <Parking />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Layout>
              <Bookings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-history"
        element={
          <ProtectedRoute>
            <Layout>
              <BookingHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exit-summary/:bookingId"
        element={
          <ProtectedRoute>
            <Layout>
              <ExitSummary />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 🔐 Admin-only Routes */}
      <Route
        path="/admin/slots"
        element={
          <ProtectedRoute>
            <Layout>
              <SlotManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rate-settings"
        element={
          <ProtectedRoute>
            <Layout>
              <RateSettings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 🚨 Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
