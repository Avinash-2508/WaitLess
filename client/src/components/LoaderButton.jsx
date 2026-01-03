import { motion } from 'framer-motion';

export default function LoaderButton({ 
  children, 
  isLoading = false, 
  loadingText = "Loading...",
  disabled = false,
  className = "",
  variant = "primary",
  fullWidth = false,
  ...props 
}) {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105",
    danger: "border-2 border-red-500 text-red-500 hover:bg-red-50 hover:scale-105",
    success: "bg-green-600 text-white hover:bg-green-700 hover:scale-105",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = variants[variant] || variants.primary;
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClass} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{isLoading ? loadingText : children}</span>
    </motion.button>
  );
}
