import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import API from "../api";
import LoaderButton from '../components/LoaderButton';
import { showSuccess, showError } from '../utils/toastManager';
import { validateEmail, validatePassword } from '../utils/formValidation';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Always clear prior session when opening the login page
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Reset any previous session before logging in
      localStorage.clear();

      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Handle new response format with success/error
      if (!res.data.success) {
        showError(res.data.error || "Login failed");
        setIsLoading(false);
        return;
      }
      
      showSuccess("Login successful! Redirecting...");

      // Store credentials
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("ownerId", res.data.owner.id);
      localStorage.setItem("ownerEmail", res.data.owner.email);

      // If a shop already exists, fetch it automatically
      try {
        const shop = await API.get(`/shop/owner/${res.data.owner.id}`);
        if (shop.data?.data?.shop?.id) {
          localStorage.setItem("shopId", shop.data.data.shop.id);
          if (shop.data.data.shop.name) {
            localStorage.setItem("shopName", shop.data.data.shop.name);
          }
          window.location.href = `/owner/${shop.data.data.shop.id}`;
          return;
        }
      } catch (shopErr) {
        console.log("Shop fetch error, proceeding to setup");
      }

      window.location.href = "/setup";
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details?.join(", ") ||
        err.message ||
        "Login failed. Please check your connection and try again.";
      showError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-sm border border-gray-100"
      >

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
          Shop Owner Login
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Sign in to manage your queue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className={`w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 transition-all ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <Link 
              to="/reset-password" 
              className="text-blue-600 text-sm hover:text-blue-700 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <LoaderButton
            type="submit"
            isLoading={isLoading}
            loadingText="Logging in..."
            fullWidth
            className="h-12 text-base font-semibold mt-8"
          >
            Login
          </LoaderButton>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Register
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

 
