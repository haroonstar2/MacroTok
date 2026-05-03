import { create } from "zustand";
import recipeAPI from "../api/recipeAPI";
import { db } from "../startFirebase";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

const shuffleWithSeed = (array, seed) => {
  let result = [...array];

  function rand() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const useRecipesStore = create((set, get) => ({
  // last fetched recipe
  dailyRecipe: null,
  feedRecipes: [],
  numRandom: 1,

  getRandomRecipe: async (forceRefresh = false) => {
    try {
      const { numRandom, feedRecipes, saveRecipeToFirestore } = get();

      const today = new Date().toISOString().split("T")[0];
      const cachedRecipe = localStorage.getItem("dailyRecipe");
      const cachedDate = localStorage.getItem("dailyRecipeDate");

      // Use a cache to load recipes
      if (!forceRefresh && cachedRecipe && cachedDate === today) {
        try {
          const parsed = JSON.parse(cachedRecipe);

          set({
            dailyRecipe: parsed,
            feedRecipes:
              feedRecipes.length > 0
                ? feedRecipes.some((r) => r.id === parsed.id)
                  ? feedRecipes
                  : [...feedRecipes, parsed]
                : feedRecipes,
          });

          console.log("loaded recipe from cache");
          return parsed;
        } catch {
          // Remove items from local storage to avoid dupes
          localStorage.removeItem("dailyRecipe");
          localStorage.removeItem("dailyRecipeDate");
        }
      }

      // If recipe is not cache, then call API
      console.log("fetching from spoonacular");
      const randomRecipe = await recipeAPI.get("/recipes/random", {
        params: { number: numRandom, includeNutrition: true },
      });
      //bug checking
      console.log("full api response:", randomRecipe.data);
      const newRecipe = randomRecipe.data?.recipes?.[0] ?? null;

      if (!newRecipe) {
        console.warn("no recipe returned. API RESPONSE:", randomRecipe.data);
        return null;
      }

      // Save the new recipe into the cache
      localStorage.setItem("dailyRecipe", JSON.stringify(newRecipe));
      localStorage.setItem("dailyRecipeDate", today);

      // Update state
      set({
        dailyRecipe: newRecipe,
        feedRecipes: feedRecipes.some((r) => r.id === newRecipe.id)
          ? feedRecipes
          : [...feedRecipes, newRecipe],
      });
      // Save the recipe to Firestore
      await saveRecipeToFirestore(newRecipe);
      return newRecipe;
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      set({ dailyRecipe: null });
      return null;
    }
  },

  getFeedRecipe: async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const cachedFeed = localStorage.getItem("dailyFeed");
      const cachedDate = localStorage.getItem("dailyFeedDate");

      if (cachedFeed && cachedDate === today) {
        const parsed = JSON.parse(cachedFeed);
        set({ feedRecipes: parsed });
        console.log("Loaded feed from cahce");
        return parsed;
      }

      console.log("Fetching new feed - ");

      const res = await recipeAPI.get("/recipes/random", {
        params: {
          number: 50,
          includeNutrition: true,
        },
      });
      const fetched = res.data?.recipes ?? [];
      //THIS IS WHERE SEEDED SHUFFLE BEGINS
      const seed = today
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const shuffled = shuffleWithSeed(fetched, seed);
      const finalFeed = shuffled.slice(0, 40);

      //THIS IS WHERE WE CACHE IT
      localStorage.setItem("dailyFeed", JSON.stringify(finalFeed));
      localStorage.setItem("dailyFeedDate", today);

      set({ feedRecipes: finalFeed });
      return finalFeed;
    } catch (err) {
      console.error("Failed to load feed:", err);
      return [];
    }
  },

  saveRecipeToFirestore: async (recipe) => {
    try {
      const formatted = {
        ...recipe,
        createdAt: serverTimestamp(),
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
        id: doc.id, // add unique Firestore ID
        ...doc.data(),
      }));

      const unique = Array.from(new Map(loaded.map((r) => [r.id, r])).values());

      set({ feedRecipes: unique });

      console.log("[Firestore] Loaded recipes:", unique.length);

      return unique;
    } catch (err) {
      console.error("Failed to load recipes from Firestore:", err);
      return [];
    }
  },

  setRandom: (newRandom) => set({ numRandom: newRandom }),
}));

export default useRecipesStore;
