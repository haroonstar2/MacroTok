import axios from "axios";

const recipeAPI = axios.create({
  baseURL: import.meta.env.VITE_SPOON_BASE_URL,
  params: {
    apiKey: import.meta.env.VITE_SPOON_API_KEY,
  },
});

export default recipeAPI;
