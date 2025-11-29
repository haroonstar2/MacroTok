import { create } from "zustand";
import recipeAPI from "../api/recipeAPI";

const useRecipesStore = create((set) => ({
  recipe: null,
  getRandomRecipe: async () => {
    try {
      console.log("Fetching recipe...");
      const res = await recipeAPI.get("/recipes/random", { params: { number: 1 } });
      console.log("API Response:", res.data);
      
      const newRecipe = res.data?.recipes?.[0] ?? null;
      set({ recipe: newRecipe });
      return newRecipe;
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      set({ recipe: null });
      return null;
    }
  },
}));

export default useRecipesStore;
