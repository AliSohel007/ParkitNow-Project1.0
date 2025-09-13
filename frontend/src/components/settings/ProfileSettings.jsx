import { useState, useEffect } from "react";
import axios from "axios";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Render/Env se dynamic URL

  // 🔄 Fetch admin profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({ name: res.data.name, email: res.data.email });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, API_BASE]);

  // 📝 Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put(`${API_BASE}/api/admin/me`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "❌ Failed to update profile");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">👤 Profile Settings</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
