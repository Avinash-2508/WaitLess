import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Button from '../components/Button';

export default function CustomerQueue() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [myToken, setMyToken] = useState(null);
  const [nextToken, setNextToken] = useState(15); // Simulated next available token

  const handleGetToken = () => {
    const token = nextToken;
    setMyToken(token);
    setNextToken(prev => prev + 1);
    // Redirect to status page
    navigate(`/customer/${shopId}/status/${token}`);
  };

  if (myToken) {
    // This shouldn't show if navigation works, but just in case
    return null;
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Queue</h1>
            <p className="text-gray-600">Get your token to track your position</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Next Available Token</p>
            <p className="text-3xl font-bold text-blue-600">
              #{String(nextToken).padStart(2, '0')}
            </p>
          </div>

          <div className="mt-4">
            <Button variant="primary" onClick={handleGetToken}>
              Get Token
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            No registration required. Just get your token and track your position!
          </p>
        </div>
      </motion.div>
    </Layout>
  );
}

