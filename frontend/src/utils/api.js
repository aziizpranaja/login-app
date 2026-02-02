import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Add request interceptor to include token (fallback)
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage as fallback
    const token = localStorage.getItem('token');
    console.log('Debug - Request URL:', config.url);
    console.log('Debug - withCredentials:', config.withCredentials);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Debug - Authorization header set:', config.headers.Authorization);
    } else {
      console.log('Debug - No token found in localStorage, relying on cookies');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Debug - Response error:', error);
    console.log('Debug - Response status:', error.response?.status);
    console.log('Debug - Response data:', error.response?.data);
    if (error.response?.status === 401) {
      console.log('Debug - 401 error detected, clearing localStorage and redirecting');
      // Clear localStorage as fallback
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
