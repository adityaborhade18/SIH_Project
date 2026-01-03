import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    withCredentials: true, // Important for cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (optional - for adding auth tokens, logging, etc.)
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor (optional - for error handling)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Unauthorized - could redirect to login
            console.error('Unauthorized access - please login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
