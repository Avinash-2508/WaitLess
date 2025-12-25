import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Navbar';

export default function Owner() {
  const { queueId } = useParams();
  const [currentToken, setCurrentToken] = useState(5);

  const handleNext = () => {
    setCurrentToken(currentToken + 1);
  };

  return (
    <Layout>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow p-6 w-full max-w-sm rounded-lg text-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>

        <div className="space-y-3 py-4">
          <div>
            <p className="text-sm text-gray-600">Current Token</p>
            <motion.p
              key={currentToken}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-blue-600"
            >
              #{currentToken}
            </motion.p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Next</p>
            <motion.p
              key={currentToken + 1}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-semibold text-gray-900"
            >
              #{currentToken + 1}
            </motion.p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Waiting</p>
            <p className="text-lg font-semibold text-gray-900">3 people</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
        >
          Next Customer
        </motion.button>
      </motion.div>
    </Layout>
  );
}
