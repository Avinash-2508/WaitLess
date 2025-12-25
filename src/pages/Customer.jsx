import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Navbar';

export default function Customer() {
  const { queueId } = useParams();
  const [currentToken, setCurrentToken] = useState(5);
  const [myToken, setMyToken] = useState(null);
  const shopName = 'Coffee Shop';

  const handleGetToken = () => {
    setMyToken(currentToken + Math.floor(Math.random() * 3) + 1);
  };

  const handleLeaveQueue = () => {
    setMyToken(null);
  };

  useEffect(() => {
    const i = setInterval(() => {
      if (Math.random() > 0.6) {
        setCurrentToken(prev => prev + 1);
      }
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow p-6 w-full max-w-sm rounded-lg text-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Welcome to {shopName}</h1>

        {myToken === null ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGetToken}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          >
            Get Token
          </motion.button>
        ) : (
          <>
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm text-gray-600">Your Token</p>
                <motion.p
                  key={myToken}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-bold text-blue-600"
                >
                  #{myToken}
                </motion.p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Token</p>
                <motion.p
                  key={currentToken}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-semibold text-gray-900"
                >
                  #{currentToken}
                </motion.p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <motion.p
                  key={myToken - currentToken}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  className="text-lg font-semibold text-gray-900"
                >
                  {Math.max(0, myToken - currentToken)} people
                </motion.p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaveQueue}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50"
            >
              Leave Queue
            </motion.button>
          </>
        )}
      </motion.div>
    </Layout>
  );
}
