import axios from 'axios';

const api = axios.create({
  // A URL base do seu servidor backend
  baseURL: import.meta.env.VITE_API_URL
});

export default api;