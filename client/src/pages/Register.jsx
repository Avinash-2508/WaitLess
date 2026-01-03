import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import { Link } from 'react-router-dom';
import API from '../api';
import LoaderButton from '../components/LoaderButton';
import { showSuccess, showError } from '../utils/toastManager';
import { validateEmail, validatePassword, validatePasswordMatch, validateRequired } from '../utils/formValidation';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateRequired(formData.name, 'Name');
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmError = validatePasswordMatch(formData.password, formData.confirmPassword);
    
    if (nameError || emailError || passwordError || confirmError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError
      });
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      // Clear any previous session before registering
      localStorage.clear();

      const res = await API.post('/auth/register', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      
      showSuccess(res.data.message || 'Registration successful!');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.error || 'Registration failed');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-sm border border-gray-100">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Generic error message */}
            {Object.values(errors).some(e => e) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                An error occurred. Please check the fields below.
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              required
              className="mb-6"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              error={errors.email}
              required
              className="mb-6"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              error={errors.password}
              required
              helperText={!errors.password && "Password must be at least 6 characters long"}
              className="mb-6"
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.confirmPassword}
              required
              className="mb-6"
            />

            <LoaderButton
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              loadingText="Creating Account..."
              className="mt-8 h-12 text-base font-semibold"
            >
              Create Account
            </LoaderButton>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline transition-colors">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

