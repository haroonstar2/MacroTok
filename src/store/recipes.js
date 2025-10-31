import { create } from "zustand";
import api from "../lib/api";

const useRecipesStore = create((set) => ({
  recipe: null,
  getRandomRecipe: async () => {
    const res = await api.get("/recipes/random", { params: { number: 1 } });
    set({ recipe: res.data.recipes[0] });
  },
}));

export default useRecipesStore;
