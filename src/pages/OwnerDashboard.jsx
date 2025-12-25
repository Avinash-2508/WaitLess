import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Button from '../components/Button';

export default function OwnerDashboard() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [currentToken, setCurrentToken] = useState(5);
  const [waiting, setWaiting] = useState(3);

  const handleNextCustomer = () => {
    setCurrentToken(prev => prev + 1);
    setWaiting(prev => Math.max(0, prev - 1));
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
            <p className="text-gray-600">Manage your queue</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-lg p-6 text-center"
            >
              <p className="text-sm text-gray-600 mb-2">Current Token</p>
              <motion.p
                key={currentToken}
                initial={{ scale: [1, 1.15, 1] }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-blue-600"
              >
                #{String(currentToken).padStart(2, '0')}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-6 text-center"
            >
              <p className="text-sm text-gray-600 mb-2">Waiting</p>
              <motion.p
                key={waiting}
                initial={{ scale: [1, 1.15, 1] }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-gray-900"
              >
                {waiting}
              </motion.p>
            </motion.div>
          </div>

          <div className="mt-4 space-y-4">
            <Button
              variant="primary"
              onClick={handleNextCustomer}
              disabled={waiting === 0}
            >
              Next Customer
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/shop/${shopId}/qr`)}
            >
              View QR Code
            </Button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}

