import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Button from '../components/Button';

export default function Landing() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.h1
            key="intro"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-bold text-blue-600"
          >
            WaitLess
          </motion.h1>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center max-w-sm w-full"
          >
            <div className="bg-white shadow rounded-lg p-6 max-w-sm w-full space-y-4">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-blue-600">WaitLess</h1>
                <p className="text-gray-600 text-lg">
                  Digital Queue System For Small Shops
                </p>
              </div>

              <div className="space-y-4 mt-4">
                <Link to="/register">
                  <Button variant="primary">
                    Register Your Shop
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
