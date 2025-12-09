import { create } from "zustand";
import recipeAPI from "../api/recipeAPI";
//import { db } from "../../../backend/firebaseConfig";
import { db } from "../firebaseConfig";

import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const useRecipesStore = create((set, get) => ({
  // last fetched recipe
  recipe: null,
  recipes: [],
  numRandom: 1,

  
  getRandomRecipe: async () => {
    try {
      const { numRandom, recipes, saveRecipeToFirestore } = get();

      console.log("Fetching recipe from Spoonacular...");
      const randomRecipe = await recipeAPI.get("/recipes/random", {
        params: { number: numRandom, includeNutrition: true }
      });
      console.log("[Spoonacular API] Random Recipe:", randomRecipe.data);

      const newRecipe = randomRecipe.data?.recipes?.[0] ?? null;

      if (!newRecipe) {
        console.warn("No recipe returned from Spoonacular");
        return null;
      }

      // updates our local state
      set({
        recipe: newRecipe,
        recipes: [...recipes, newRecipe]
      });

      await saveRecipeToFirestore(newRecipe);

      return newRecipe;
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      set({ recipe: null });
      return null;
    }
  },


  saveRecipeToFirestore: async (recipe) => {
    try {
      const formatted = {
        ...recipe,           
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "recipes"), formatted);
      console.log("[Firestore] Saved recipe:", formatted.title);
    } catch (err) {
      console.error("Failed to save recipe to Firestore:", err);
    }
  },

  //  Load recipes from Firestore for the feed
  loadRecipesFromFirestore: async () => {
    try {
      const snapshot = await getDocs(collection(db, "recipes"));
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,       // add unique Firestore ID
        ...doc.data()
      }));


      set({ recipes: loaded });
      console.log("[Firestore] Loaded recipes:", loaded.length);

      return loaded;
    } catch (err) {
      console.error("Failed to load recipes from Firestore:", err);
      return [];
    }
  },

  setRandom: (newRandom) => set({ numRandom: newRandom })
}));

export default useRecipesStore;