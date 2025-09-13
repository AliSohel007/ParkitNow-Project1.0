import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

// ✅ Use centralized API config
import { API_BASE } from "../../config/api"; 

const Login = () => {
  const [email, setEmail] = useState("sohel2003@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Call backend login endpoint
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      console.log("✅ Login response:", res.data);

      const token = res.data.token;
      const role = res.data.role || "user";

      if (!token) throw new Error("No token received from backend");

      // ✅ Save token & role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ✅ Redirect based on role
      navigate(role === "admin" ? "/admin" : "/user");

    } catch (err) {
      console.error("❌ Login error:", err);

      // ✅ Handle network / 404 / backend errors
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password");
      } else if (err.request) {
        setError("Cannot reach server. Check API URL or network");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-5 animate-fadeIn"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">🔐 Login</h2>

        {/* Error message */}
        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-70"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Login"}
        </button>

        {/* Register link */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
