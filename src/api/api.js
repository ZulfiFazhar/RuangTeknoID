import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ganti dengan URL backend Anda
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
