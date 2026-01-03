import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import LoaderButton from '../components/LoaderButton';

export default function Setup() {
  const navigate = useNavigate();

  useEffect(() => {
    const shopId = localStorage.getItem('shopId');
    if (shopId) {
      window.location.href = `/owner/${shopId}`;
    }
  }, []);
  
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    category: ''
  });

  const categories = [
    { value: 'Hospital', label: 'Hospital' },
    { value: 'Shops', label: 'Shops' },
    { value: 'Salon', label: 'Salon' },
    { value: 'Government Offices', label: 'Government Offices' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await API.post("/shop", {
          name: formData.shopName,
          address: formData.address,
          category: formData.category,
        });

        // Handle new response format
        if (!res.data.success) {
          alert(res.data.error || "Failed to create shop");
          return;
        }

        const shopId = res.data.data.shop.id;
        const shopName = res.data.data.shop.name;

        localStorage.setItem("shopId", shopId);
        localStorage.setItem("shopName", shopName);
        window.location.href = `/shop/${shopId}/qr`;
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.details?.join(", ") ||
          "Failed to create shop";
        console.error("Setup error:", errorMsg);
        alert(errorMsg);
      }
    })();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop Setup</h1>
            <p className="text-sm sm:text-base text-gray-600">Enter your shop details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Shop Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="My Awesome Shop"
              required
              className="mb-6"
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
              required
              className="mb-6"
            />
            
            <div className="mb-6">
              <label htmlFor="category" className="block mb-2 text-base font-semibold text-gray-700">
                Category<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <LoaderButton 
              type="submit" 
              variant="primary" 
              fullWidth
              className="h-12 text-base font-semibold mt-8"
            >
              Complete Setup
            </LoaderButton>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

