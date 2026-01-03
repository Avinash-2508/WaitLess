// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

export const validateShopName = (name) => {
  if (!name || name.trim() === "") return "Shop name is required";
  if (name.trim().length < 2) return "Shop name must be at least 2 characters";
  return null;
};

// Generic form validator
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = `${rule.label || field} is required`;
    } else if (rule.email && value) {
      const emailError = validateEmail(value);
      if (emailError) errors[field] = emailError;
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    } else if (rule.match && value !== formData[rule.match]) {
      errors[field] = `${rule.label || field} must match ${rule.matchLabel || rule.match}`;
    }
  });
  
  return errors;
};
