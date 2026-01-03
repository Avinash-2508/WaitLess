export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error = null,
  helperText = null,
  className = '',
  containerClassName = '',
  ...props 
}) {
  return (
    <div className={`w-full mb-4 ${containerClassName}`}>
      {label && (
        <label className="block mb-2 text-base font-semibold text-gray-800">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 text-base border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

