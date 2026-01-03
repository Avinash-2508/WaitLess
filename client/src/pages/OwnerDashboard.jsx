import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Button from '../components/Button';
import Input from '../components/Input';
import { showSuccess, showError, showWarning } from '../utils/toastManager';
import API, { pauseQueue, resumeQueue } from '../api';

export default function OwnerDashboard() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [currentToken, setCurrentToken] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [servedToday, setServedToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasResetPassword, setHasResetPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isCallingNext, setIsCallingNext] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTogglingPause, setIsTogglingPause] = useState(false);

  const fetchQueueStatus = async () => {
    try {
      const res = await API.get(`/queue/${shopId}`);
      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch queue status");
      }
      // Handle response format - data is directly in res.data.data
      const queueData = res.data.data;
      setCurrentToken(queueData.currentToken);
      setWaiting(queueData.waiting ?? 0);
      setServedToday(queueData.servedToday ?? 0);
      setIsPaused(queueData.pauseState ?? false);
    } catch (err) {
      console.error("Failed to fetch queue status:", err);
      if (err.response?.status === 401) {
        showError("Session expired. Please login again.");
        navigate('/login');
      } else {
        showError("Failed to load queue status. Please refresh the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkResetPassword = async () => {
    try {
      const ownerId = localStorage.getItem('ownerId');
      const res = await API.get(`/auth/check-reset-password/${ownerId}`);
      setHasResetPassword(res.data.hasResetPassword);
    } catch (err) {
      console.error("Failed to check reset password:", err);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    checkResetPassword();
    const socket = io("http://localhost:5000");
    socket.on("queueUpdate", (data) => {
      if (data?.shopId === shopId) {
        setCurrentToken(data.currentToken);
        if (typeof data.waiting === "number") setWaiting(data.waiting);
        fetchQueueStatus();
      }
    });
    return () => socket.disconnect();
  }, [shopId]);

  const handleNextCustomer = async () => {
    setIsCallingNext(true);
    try {
      await API.post(`/queue/${shopId}/next`);
      const res = await API.get(`/queue/${shopId}`);
      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch updated queue");
      }
      // Handle response format
      const queueData = res.data.data;
      setCurrentToken(queueData.currentToken);
      setWaiting(queueData.waiting);
      setServedToday(queueData.servedToday);
      showSuccess("Next customer called!");
    } catch (err) {
      console.error("Next customer error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details?.join(", ") ||
        err.message ||
        "Failed to call next customer";
      showError(errorMsg);
    } finally {
      setIsCallingNext(false);
    }
  };

  const handleResetTokens = async () => {
    if (isSettingPassword) {
      // Setting new reset password
      if (resetPassword.length < 4) {
        showError("Password must be at least 4 characters");
        return;
      }
      if (resetPassword !== confirmPassword) {
        showError("Passwords do not match");
        return;
      }
      setIsResetting(true);
      try {
        const ownerId = localStorage.getItem('ownerId');
        await API.post('/auth/set-reset-password', { 
          ownerId,
          resetPassword 
        });
        showSuccess("Reset password set successfully!");
        setHasResetPassword(true);
        setIsSettingPassword(false);
        setShowResetModal(false);
        setResetPassword('');
        setConfirmPassword('');
      } catch (err) {
        showError(err.response?.data?.error || "Failed to set reset password");
      } finally {
        setIsResetting(false);
      }
    } else {
      // Verifying existing reset password to clear tokens
      if (!resetPassword) {
        showError("Please enter your reset password");
        return;
      }
      setIsResetting(true);
      try {
        await API.post(`/queue/${shopId}/reset`, { resetPassword });
        showSuccess("All tokens have been reset successfully!");
        setShowResetModal(false);
        setResetPassword('');
        fetchQueueStatus();
      } catch (err) {
        showError(err.response?.data?.error || "Failed to reset tokens");
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleGeneratePaidToken = async () => {
    setIsGeneratingToken(true);
    try {
      const res = await API.post('/queue/owner/generate', { shopId });
      if (!res.data.success) {
        throw new Error(res.data.error || 'Failed to generate token');
      }
      const tokenNumber = res.data.data?.tokenNumber;
      showSuccess(`Token #${String(tokenNumber).padStart(2, '0')} Assigned`);
      await fetchQueueStatus();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to generate token';
      showError(errorMsg);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const openResetModal = () => {
    if (!hasResetPassword) {
      setIsSettingPassword(true);
    } else {
      setIsSettingPassword(false);
    }
    setShowResetModal(true);
    setResetPassword('');
    setConfirmPassword('');
  };

  const handleTogglePause = async () => {
    setIsTogglingPause(true);
    try {
      if (isPaused) {
        const res = await resumeQueue(shopId);
        if (!res.data.success) {
          throw new Error(res.data.error || 'Failed to resume queue');
        }
        setIsPaused(false);
        showSuccess('Queue resumed!');
      } else {
        const res = await pauseQueue(shopId);
        if (!res.data.success) {
          throw new Error(res.data.error || 'Failed to pause queue');
        }
        setIsPaused(true);
        showSuccess('Queue paused!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to toggle queue state';
      showError(errorMsg);
    } finally {
      setIsTogglingPause(false);
    }
  };

  const shopName = localStorage.getItem('shopName') || 'WaitLess';
  const currentTokenFormatted = `#${String(currentToken).padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:px-6 sm:py-8 bg-gray-50">
      <div className="w-full max-w-4xl text-center">
        {loading ? (
          <div className="p-6 bg-white shadow-lg sm:p-8 rounded-xl">
            <div className="space-y-6 animate-pulse">
              <div className="w-3/4 h-6 mx-auto bg-gray-200 rounded sm:h-8"></div>
              <div className="w-1/2 h-4 mx-auto bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                <div className="h-24 bg-gray-200 rounded sm:h-32"></div>
                <div className="h-24 bg-gray-200 rounded sm:h-32"></div>
                <div className="h-24 bg-gray-200 rounded sm:h-32"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white shadow-lg sm:p-8 rounded-xl">
            <div className="mb-6 text-center sm:mb-8">
              <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                Welcome • {shopName}
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                Queue Management Dashboard
              </p>
            </div>

            {/* Stats Row - Mobile first */}
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3 sm:gap-6 sm:mb-8">
              <div className="p-4 border-2 border-blue-200 sm:p-6 bg-blue-50 rounded-xl">
                <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                  Current Token
                </p>
                <p className="text-3xl font-bold text-blue-600 sm:text-4xl">
                  {currentTokenFormatted}
                </p>
              </div>

              <div className="p-4 border-2 border-orange-200 sm:p-6 bg-orange-50 rounded-xl">
                <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                  Waiting
                </p>
                <p className="text-3xl font-bold text-orange-600 sm:text-4xl">
                  {waiting || 0}
                </p>
              </div>

              <div className="p-4 border-2 border-green-200 sm:p-6 bg-green-50 rounded-xl">
                <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                  Served Today
                </p>
                <p className="text-3xl font-bold text-green-600 sm:text-4xl">
                  {servedToday}
                </p>
              </div>
            </div>

            {/* Action Buttons - Mobile optimized */}
            <div className="space-y-4">
              {/* Pause/Resume Toggle */}
              <Button
                onClick={handleTogglePause}
                className={`w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-colors rounded-lg disabled:opacity-50 min-h-[52px] ${
                  isPaused
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                disabled={isTogglingPause}
              >
                {isTogglingPause ? 'Processing...' : (isPaused ? '▶️ Resume Queue' : '⏸ Pause Queue')}
              </Button>

              <Button
                onClick={handleGeneratePaidToken}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-colors bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 min-h-[52px]"
                disabled={isGeneratingToken}
              >
                {isGeneratingToken ? 'Assigning...' : 'Generate Next Token (Payment Received)'}
              </Button>

              <Button
                onClick={handleNextCustomer}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[52px]"
                disabled={isCallingNext}
              >
                {isCallingNext ? 'Calling...' : 'Next Customer'}
              </Button>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <a href={`/shop/${shopId}/qr`} className="min-h-[44px]">
                  <Button className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-100 min-h-[44px]">
                    View QR
                  </Button>
                </a>
                
                <a href="/profile" className="min-h-[44px]">
                  <Button className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-100 min-h-[44px]">
                    Profile
                  </Button>
                </a>
                
                <a href={`/counter/${shopId}`} className="min-h-[44px]">
                  <Button className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700 min-h-[44px]">
                    Counter
                  </Button>
                </a>
                
                <a href={`/history/${shopId}`} className="min-h-[44px]">
                  <Button className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-colors rounded-lg hover:bg-gray-100 min-h-[44px]">
                    History
                  </Button>
                </a>
                
                <Button
                  onClick={openResetModal}
                  className="w-full col-span-2 sm:col-span-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 min-h-[44px]"
                >
                  Reset All Tokens
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50 sm:px-6">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              {isSettingPassword ? 'Set Reset Password' : 'Reset All Tokens'}
            </h2>

            <div>
              {isSettingPassword ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Set a password to protect the token reset function. You'll need this password whenever you want to reset tokens.
                  </p>
                  
                  <Input
                    type="password"
                    label="New Reset Password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Enter reset password"
                    required
                  />
                  
                  <Input
                    type="password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm reset password"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-700">
                      <strong>Warning:</strong> This will reset all tokens to zero and clear the queue. This action cannot be undone.
                    </p>
                  </div>
                  
                  <Input
                    type="password"
                    label="Enter Reset Password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Enter your reset password"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowResetModal(false);
                  setResetPassword('');
                  setConfirmPassword('');
                }}
                className="w-full px-4 py-2 transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetTokens}
                disabled={isResetting}
                className={`px-4 py-2 rounded-lg w-full transition-colors text-white ${
                  isSettingPassword 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {isResetting ? 'Processing...' : (isSettingPassword ? 'Set Password' : 'Reset Tokens')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

