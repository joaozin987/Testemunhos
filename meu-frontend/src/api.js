import axios from "axios";

const LOCAL_API_URL = "https://testemunhos.onrender.com";

const PROD_API_URL = import.meta.env.VITE_API_URL;

const API_BASE_URL = PROD_API_URL || LOCAL_API_URL;

const api = axios.create({
 baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
 const token = localStorage.getItem("token");
 if (token) {
  config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});

export default api;