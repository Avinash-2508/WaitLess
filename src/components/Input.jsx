export default function Input({ label, type = 'text', value, onChange, placeholder, ...props }) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}

