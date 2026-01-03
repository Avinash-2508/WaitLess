import toast from 'react-hot-toast';

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fff',
    color: '#111827',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '500px',
  },
};

// Success toast with custom icon
export const showSuccess = (message) => {
  return toast.success(message, {
    ...toastConfig,
    iconTheme: {
      primary: '#22C55E',
      secondary: '#fff',
    },
  });
};

// Error toast with custom icon
export const showError = (message) => {
  return toast.error(message, {
    ...toastConfig,
    duration: 5000,
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  });
};

// Warning toast
export const showWarning = (message) => {
  return toast(message, {
    ...toastConfig,
    icon: '⚠️',
    style: {
      ...toastConfig.style,
      borderLeft: '4px solid #F59E0B',
    },
  });
};

// Loading toast
export const showLoading = (message = 'Loading...') => {
  return toast.loading(message, toastConfig);
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Promise toast - automatically handles loading, success, and error states
export const showPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    },
    toastConfig
  );
};
