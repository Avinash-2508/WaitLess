import { useState } from "react";import API from "../api";

export default function StaffLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/staff/login", { email: formData.email, password: formData.password });
      const { success, staff, token } = res.data || {};

      if (success && staff && staff.id && staff.shopId) {
        localStorage.setItem("staffId", staff.id);
        localStorage.setItem("shopId", staff.shopId);
        localStorage.setItem("token", token);
        window.location.href = `/counter/${staff.shopId}`;
      } else {
        setError("Invalid staff login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Invalid email or password";
      // Check if it's a "staff not found" error
      if (errorMsg.includes("Invalid") || errorMsg.includes("not found")) {
        setError(`Staff not found. Please register first or contact your shop owner.`);
      } else {
        setError(errorMsg);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Staff Login</h1>
          <p className="text-sm sm:text-base text-gray-600">Access Counter Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="staff@shop.com"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[52px] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base sm:text-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-center text-sm text-gray-600 mb-4">
            New staff member?
          </p>
          <a
            href="/staff-register"
            className="w-full min-h-[52px] bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center text-base sm:text-lg"
          >
            Register as Staff
          </a>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Are you a shop owner?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Owner Login
          </a>
        </p>
      </div>
    </div>
  );
}
