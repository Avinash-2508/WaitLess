import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const [queueId, setQueueId] = useState('queue-001');

  const handleCustomer = () => {
    if (queueId.trim()) {
      navigate(`/customer/${queueId}`);
    }
  };

  const handleOwner = () => {
    if (queueId.trim()) {
      navigate(`/owner/${queueId}`);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow p-6 w-full max-w-sm rounded-lg text-center space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-900">WaitLess</h1>
        <p className="text-gray-600">Queue Management System</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Queue ID
            </label>
            <input
              type="text"
              value={queueId}
              onChange={(e) => setQueueId(e.target.value)}
              placeholder="queue-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCustomer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          >
            Join as Customer
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOwner}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          >
            Enter as Owner
          </motion.button>
        </div>
      </motion.div>
    </Layout>
  );
}
