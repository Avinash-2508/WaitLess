import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow h-14 flex items-center justify-between px-6"
      >
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-wide">
          WaitLess
        </Link>
      </motion.nav>

      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}

