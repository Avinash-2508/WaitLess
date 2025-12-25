import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login - redirect to owner dashboard
    navigate('/owner/demo-shop-123');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Shop Owner Login
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Sign in to manage your queue
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-8"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
