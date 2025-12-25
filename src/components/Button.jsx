import { motion } from 'framer-motion';

export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const baseClasses = 'w-full px-6 py-3 rounded-lg font-medium text-lg transition-colors';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

