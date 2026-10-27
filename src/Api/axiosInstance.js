import axios from 'axios';
import { API_BASE_URL } from './config';

export const TOKEN_KEY = 'gcaaa_admin_token';
export const ADMIN_KEY = 'gcaaa_admin_user';

/**
 * Centralized Axios instance for GCAAA Admin Panel
 * Base URL: https://api.gcaalumniassociation.com/api (or local dev server)
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Automatically attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 unauthorized handling & error formatting
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !error.config?.url?.includes('/login')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_KEY);
        // Optional redirect to admin login if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred while processing the request';
    
    error.friendlyMessage = errorMsg;
    return Promise.reject(error);
  }
);

// Aliases for convenience across all admin modules
export const api = axiosInstance;
export default axiosInstance;
