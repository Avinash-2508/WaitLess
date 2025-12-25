import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow h-14 flex items-center px-6"
      >
        <h1 className="text-xl font-semibold text-blue-600">WaitLess</h1>
      </motion.nav>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex justify-center items-center p-4"
      >
        {children}
      </motion.main>
    </div>
  );
}
