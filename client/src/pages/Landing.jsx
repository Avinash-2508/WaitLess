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
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6 sm:py-8">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.h1
            key="intro"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600"
          >
            WaitLess
          </motion.h1>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center max-w-2xl w-full"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 max-w-xl w-full shadow-sm border border-gray-100">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mb-4 sm:mb-6">WaitLess</h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 font-light">
                  Digital Queue System For Small Shops
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Link to="/register" className="block">
                  <Button variant="primary" fullWidth className="h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-full min-h-[52px]">
                    Register Your Shop
                  </Button>
                </Link>
                <Link to="/login" className="block">
                  <Button variant="outline" fullWidth className="h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-full min-h-[52px]">
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
