import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Setup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate setup - generate shopId and redirect to QR page
    const shopId = 'demo-shop-123';
    navigate(`/shop/${shopId}/qr`);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center max-w-sm w-full"
      >
        <div className="bg-white shadow rounded-lg p-6 max-w-sm w-full space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Setup</h1>
            <p className="text-gray-600">Enter your shop details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Shop Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="My Awesome Shop"
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State"
              required
            />
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Restaurant, Retail, Service, etc."
              required
            />

            <div className="mt-4">
              <Button type="submit" variant="primary">
                Complete Setup
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}

