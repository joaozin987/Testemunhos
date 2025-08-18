import axios from 'axios';

const api = axios.create({
  // A URL base do seu servidor backend
  baseURL: 'http://localhost:3000'
});

export default api;