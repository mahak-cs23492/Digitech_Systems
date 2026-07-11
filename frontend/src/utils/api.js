import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Falls back to proxy in development
});

// Automatically inject JWT token from localStorage into requests
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
