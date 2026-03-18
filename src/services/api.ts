import axios from 'axios';

export const API = axios.create({
  // Add your backend URL here when it is available.
  // Example for Android emulator: http://10.0.2.2:3000
  timeout: 5000,
});

// Optional: interceptor (future use)
API.interceptors.request.use(config => {
  // attach token later
  return config;
});
