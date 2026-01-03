import axios from "axios";

// Get backend URL from environment or use default
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: backendURL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log all errors for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Handle 401 Unauthorized - Only redirect if it's an owner/auth route
    if (error.response?.status === 401) {
      const isAuthRequired = error.config?.url?.includes('/owner') || 
                            error.config?.url?.includes('/profile') ||
                            error.config?.url?.includes('/next') ||
                            error.config?.url?.includes('/skip');
      
      if (isAuthRequired) {
        localStorage.removeItem("token");
        localStorage.removeItem("ownerId");
        localStorage.removeItem("shopId");
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access denied:", error.response.data?.error);
    }

    // Handle 500+ errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data?.error);
    }

    return Promise.reject(error);
  }
);

// ============ COUNTER APIs ============
export const createCounter = (shopId, name, number) =>
  API.post("/counter/create", { shopId, name, number });

export const getCountersByShop = (shopId) =>
  API.get(`/counter/by-shop/${shopId}`);

export const toggleCounter = (counterId, isActive) =>
  API.patch(`/counter/${counterId}/toggle`, { isActive });

export const assignStaffToCounter = (staffId, counterId) =>
  API.patch("/counter/assign-staff", { staffId, counterId });

export const deleteCounter = (counterId) =>
  API.delete(`/counter/${counterId}`);

// ============ QUEUE PAUSE/RESUME APIs ============
export const pauseQueue = (shopId) =>
  API.post("/queue/pause", { shopId });

export const resumeQueue = (shopId) =>
  API.post("/queue/resume", { shopId });

// ============ WAIT TIME API ============
export const getWaitTime = (shopId, tokenNumber) =>
  API.get(`/queue/wait-time?shopId=${shopId}&tokenNumber=${tokenNumber}`);

export default API;
