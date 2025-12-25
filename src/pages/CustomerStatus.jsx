import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

export default function CustomerStatus() {
  const { shopId, token } = useParams();
  const [currentToken, setCurrentToken] = useState(12);
  const tokenNum = parseInt(token);

  // Simulate auto-update of current token
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToken(prev => {
        // Only increment if it's less than customer's token
        if (prev < tokenNum) {
          return prev + 1;
        }
        return prev;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [tokenNum]);

  const ahead = Math.max(0, tokenNum - currentToken);
  const isMyTurn = currentToken >= tokenNum;

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Status</h1>
            <p className="text-gray-600">Track your position in the queue</p>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-lg p-6 text-center"
            >
              <p className="text-sm text-gray-600 mb-2">Your Token</p>
              <motion.p
                key={token}
                initial={{ scale: [1, 1.15, 1] }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-blue-600"
              >
                #{String(tokenNum).padStart(2, '0')}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-6 text-center"
            >
              <p className="text-sm text-gray-600 mb-2">Currently Serving</p>
              <motion.p
                key={currentToken}
                initial={{ scale: [1, 1.15, 1] }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-gray-900"
              >
                #{String(currentToken).padStart(2, '0')}
              </motion.p>
            </motion.div>

            {isMyTurn ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center"
              >
                <p className="text-lg font-bold text-green-700">It's Your Turn!</p>
                <p className="text-sm text-green-600 mt-1">Please proceed to the counter</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 rounded-lg p-6 text-center"
              >
                <p className="text-sm text-gray-600 mb-2">Customers Ahead</p>
                <motion.p
                  key={ahead}
                  initial={{ scale: [1, 1.15, 1] }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {ahead}
                </motion.p>
              </motion.div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              This page updates automatically. Keep it open to track your position.
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}

