import { useState, useEffect } from "react";
import API from "../api";

export default function StaffRegister() {
  const [shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    shopId: "",
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [loadingShops, setLoadingShops] = useState(true);
  const [error, setError] = useState("");

  // Fetch available shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Get all shops - this is a public endpoint
        const res = await API.get("/shop");
        if (res.data && res.data.data) {
          setShops(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error("Failed to load shops:", err.message);
        setError("Unable to load shops. Please try again.");
      } finally {
        setLoadingShops(false);
      }
    };
    fetchShops();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const registerStaff = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.shopId) {
      setError("Please select a shop");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/staff/register", {
        shopId: formData.shopId,
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (res.data.success) {
        alert("✅ Staff account created successfully! Now login with your credentials.");
        window.location.href = "/staff-login";
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.details?.[0] || "Registration failed";
      setError(errorMsg);
      setLoading(false);
    }
  };

  if (loadingShops) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-12">
        <p className="text-gray-600">Loading shops...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md">
        <div className="w-full p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Register as Staff</h1>
            <p className="text-sm sm:text-base text-gray-600">Create your staff account</p>
          </div>

          <form onSubmit={registerStaff} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Shop <span className="text-red-500">*</span></label>
              <select
                name="shopId"
                value={formData.shopId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Choose your shop...</option>
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name} ({shop.category})
                    </option>
                  ))
                ) : (
                  <option disabled>No shops available</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-2">Don't see your shop? Ask your owner to create it first.</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="staff@example.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2">Must contain: 8+ chars, uppercase letter, number, special character</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || shops.length === 0}
              className="w-full min-h-[52px] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base sm:text-lg"
            >
              {loading ? "Creating Account..." : "Create Staff Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/staff-login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Staff Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
