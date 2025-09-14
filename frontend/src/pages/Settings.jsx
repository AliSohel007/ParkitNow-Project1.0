import { useState } from "react";
import { FaUser, FaLock, FaRupeeSign, FaCreditCard } from "react-icons/fa";
import RateSettings from "../components/admin/RateSettings";
import ProfileSettings from "../components/settings/ProfileSettings";
import ChangePassword from "../components/settings/ChangePassword";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const role = localStorage.getItem("role");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛠️ Settings</h2>

      {/* 🔁 Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            activeTab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaUser /> Profile
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            activeTab === "password" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaLock /> Change Password
        </button>

        {role === "admin" && (
          <button
            onClick={() => setActiveTab("rate")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === "rate" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            <FaRupeeSign /> Rate Settings
          </button>
        )}

        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            activeTab === "payment" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          <FaCreditCard /> Payment
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out bg-white p-4 rounded shadow">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "password" && <ChangePassword />}
        {activeTab === "rate" && role === "admin" && <RateSettings />}
        {activeTab === "payment" && (
          <div className="text-gray-700">
            💳 Payment settings will be added soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
