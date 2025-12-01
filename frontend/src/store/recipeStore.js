import { create } from "zustand";
import recipeAPI from "../api/recipeAPI";

const useRecipesStore = create((set, get) => ({
  recipe: null, // Last fetched recipe

  recipes: [], // Total recipes

  numRandom: 1,

  getRandomRecipe: async () => {
    try {

      const { numRandom, recipes } = get();

      console.log("Fetching recipe...");
      const randomRecipe = await recipeAPI.get("/recipes/random", { params: { number: numRandom, includeNutrition: true } });
      console.log("[Spoonacular API] Random Recipe:", randomRecipe.data);
      
      const newRecipe = randomRecipe.data?.recipes?.[0] ?? null;

      set({
        recipe: newRecipe,
        recipes: [...recipes, newRecipe]
      });


      return newRecipe;

    } catch (err) {

      console.error("Failed to fetch recipe:", err);
      set({ recipe: null });
      return null;

    }
  },

  setRandom: (newRandom) => set({
    numRandom: newRandom
  })

}));

export default useRecipesStore;
