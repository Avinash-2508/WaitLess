import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoaderButton from '../components/LoaderButton';
import SkeletonBlock from '../components/SkeletonBlock';
import { showSuccess, showError } from '../utils/toastManager';
import API from '../api';

export default function CustomerQueue() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchCurrentToken = async () => {
      try {
        console.log('Fetching queue status for shopId:', shopId);
        const res = await API.get(`/queue/${shopId}`);
        console.log('Queue status response:', res.data);
        
        if (!res.data.success) {
          throw new Error(res.data.error || "Failed to fetch status");
        }
        
        const queueData = res.data.data || res.data;
        setNextToken(queueData.nextToken ?? queueData.currentToken + 1);
      } catch (err) {
        console.error("Failed to load queue status:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        showError("Failed to load queue status: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentToken();
  }, [shopId]);

  const handleGetToken = async () => {
    setIsJoining(true);
    try {
      console.log('Attempting to join queue for shopId:', shopId);
      const res = await API.post(`/queue/${shopId}/join`);
      console.log('Join queue response:', res.data);
      
      if (!res.data.success) {
        showError(res.data.error || "Failed to join queue");
        return;
      }
      
      const token = res.data.data?.token || res.data.token;
      if (!token) {
        console.error('No token in response:', res.data);
        showError("Queue error. Try again.");
        return;
      }
      
      console.log('Token received:', token);
      showSuccess(`Token #${token} received!`);
      setTimeout(() => {
        window.location.href = `/customer/${shopId}/status/${token}`;
      }, 500);
    } catch (err) {
      console.error('Join queue error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details?.join(", ") ||
        err.message ||
        "Failed to join queue. Please check your connection.";
      showError(errorMsg);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full space-y-6">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              {localStorage.getItem("shopName") || "Queue"}
            </h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Join Queue</h1>
            <p className="text-sm sm:text-base text-gray-600">Get your token to track your position</p>
          </div>

          {loading ? (
            <SkeletonBlock variant="card" />
          ) : (
            <div className="bg-blue-50 rounded-xl p-6 sm:p-8 text-center border-2 border-blue-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Next Available Token</p>
              <p className="text-5xl sm:text-6xl font-bold text-blue-600">
                #{String(nextToken || 1).padStart(2, '0')}
              </p>
            </div>
          )}

          <LoaderButton
            variant="primary"
            onClick={handleGetToken}
            isLoading={isJoining}
            loadingText="Getting Token..."
            fullWidth
            size="lg"
            disabled={loading}
            className="min-h-[52px] text-base sm:text-lg"
          >
            Get Token
          </LoaderButton>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-xs sm:text-sm text-gray-500 px-2"
          >
            ✨ No registration required. Just get your token and track your position!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

