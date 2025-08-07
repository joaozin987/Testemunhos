import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// ... rest of the file
export default api; 