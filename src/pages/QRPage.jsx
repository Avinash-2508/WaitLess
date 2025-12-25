import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import QRPlaceholder from '../components/QRPlaceholder';
import Button from '../components/Button';

export default function QRPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const customerUrl = `${window.location.origin}/customer/${shopId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your QR Code</h1>
            <p className="text-gray-600">Share this with your customers</p>
          </div>

          <div className="flex justify-center">
            <QRPlaceholder size={256} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customerUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="primary"
              onClick={() => navigate(`/owner/${shopId}`)}
            >
              Go To Dashboard
            </Button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}

