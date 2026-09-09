import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://capstone-proj-l76p.onrender.com/api",
});

// Automatically attach the token to every request, if the user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;