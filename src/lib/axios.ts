import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import config from '@/env.local';

const api: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Set a timeout for requests
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Log request errors for debugging
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response, // Pass successful responses as-is
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // If the status is 401, redirect to the login page
      if (status === 401) {
        // Clear any stored tokens
        localStorage.removeItem('accessToken');
        // Redirect to the login page
        window.location.href = '/login';
      }

      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data,
      });
    }
    return Promise.reject({
      message: 'Network error. Please check your connection.',
      originalError: error,
    });
  }
);

export default api;