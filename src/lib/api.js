import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SPOON_BASE_URL,
  params: {
    apiKey: import.meta.env.VITE_SPOON_API_KEY,
  },
});

export default api;
