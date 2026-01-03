import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import API, { getWaitTime } from '../api';
import { motion } from 'framer-motion';

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function CustomerStatus() {
  const { shopId, token } = useParams();
  const [currentToken, setCurrentToken] = useState(12);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const tokenNum = parseInt(token);
  const audio = new Audio("/notify.txt");

  // Request browser notification permission on mount
  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Live socket listener for queue updates
  useEffect(() => {
    const socket = io(backendURL);

    const fetchStatus = async () => {
      try {
        const res = await API.get(`/queue/${shopId}`);
        // Handle new response format
        const currentToken = res.data.data?.currentToken || res.data.currentToken;
        setCurrentToken(currentToken);

        // Fetch wait time estimate
        try {
          const waitTimeRes = await getWaitTime(shopId, tokenNum);
          if (waitTimeRes.data.success) {
            setEstimatedWaitTime(waitTimeRes.data.data?.estimatedMinutes || 0);
          }
        } catch (err) {
          console.error("Failed to fetch wait time:", err);
        }
      } catch (err) {
        console.error("Failed to fetch queue status:", err.message);
      }
    };

    // initial fetch
    fetchStatus();

    socket.on("queueUpdate", (data) => {
      if (data?.shopId === shopId) {
        setCurrentToken(data.currentToken);

        // Play sound when it's your turn
        if (data.currentToken === Number(token)) {
          audio.play().catch(() => {});
        }

        // Notify when you're next
        if (
          data.currentToken === Number(token) - 1 &&
          Notification &&
          Notification.permission === "granted"
        ) {
          new Notification("You're next! 🚀", {
            body: "Get ready! Your turn is coming.",
            icon: "/favicon.ico",
          });
        }

        // Notify when it's your turn
        if (
          data.currentToken === Number(token) &&
          Notification &&
          Notification.permission === "granted"
        ) {
          new Notification("It's your turn! 🎉", {
            body: "Please go to the counter.",
            icon: "/favicon.ico",
          });
        }
      }
    });

    return () => socket.disconnect();
  }, [shopId, token]);

  const ahead = Math.max(0, tokenNum - currentToken);
  const isMyTurn = currentToken >= tokenNum;
  const myToken = tokenNum;

  let statusMessage;
  
  if (ahead > 0) {
    statusMessage = (
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 sm:p-6 text-center">
        <h3 className="font-bold text-yellow-600 text-lg sm:text-xl mb-2">Please wait 🙏</h3>
        <p className="text-sm sm:text-base text-gray-700">There are {ahead} people ahead of you.</p>
        {estimatedWaitTime > 0 && (
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            ⏱️ Estimated wait: {estimatedWaitTime} minute{estimatedWaitTime !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  } else if (currentToken === myToken - 1) {
    statusMessage = (
      <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 sm:p-6 text-center">
        <h3 className="font-bold text-blue-600 text-lg sm:text-xl mb-2">You're Next! 🚀</h3>
        <p className="text-sm sm:text-base text-gray-700">Please be ready.</p>
      </div>
    );
  } else if (currentToken === myToken) {
    statusMessage = (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 sm:p-6 text-center">
        <h3 className="font-bold text-green-600 text-lg sm:text-xl mb-2">It's Your Turn! 🎉</h3>
        <p className="text-sm sm:text-base text-gray-700">Please proceed to the counter.</p>
      </div>
    );
  } else if (currentToken > myToken) {
    statusMessage = (
      <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 sm:p-6 text-center">
        <h3 className="font-bold text-red-600 text-lg sm:text-xl mb-2">Token Passed ⚠️</h3>
        <p className="text-sm sm:text-base text-gray-700">You missed your turn. Go to the counter now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-4 sm:p-6 bg-gray-50">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center max-w-md w-full"
      >
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
              {localStorage.getItem("shopName")}
            </h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Status</h1>
            <p className="text-sm sm:text-base text-gray-600">Track your position in the queue</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-xl p-6 sm:p-8 text-center border-2 border-blue-200"
            >
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Your Token</p>
              <motion.p
                key={token}
                initial={{ scale: [1, 1.15, 1] }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl sm:text-6xl font-bold text-blue-600"
              >
                #{String(tokenNum).padStart(2, '0')}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center border-2 border-gray-200"
            >
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Currently Serving</p>
              <motion.p
                key={currentToken}
                initial={{ scale: [1, 1.15, 1] }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl font-bold text-gray-900"
              >
                #{String(currentToken).padStart(2, '0')}
              </motion.p>
            </motion.div>

            <div className="mt-4 sm:mt-6 w-full">{statusMessage}</div>

            <div className="text-center text-sm sm:text-base text-gray-700">
              Token #{String(myToken).padStart(2, '0')} • {isMyTurn ? 'Now Serving' : 'Waiting'} • {ahead} ahead of you
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-xs sm:text-sm text-gray-500 px-2">
              🔄 This page updates automatically. Keep it open to track your position.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

