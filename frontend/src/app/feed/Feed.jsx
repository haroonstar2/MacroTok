import React, { useState, useEffect } from "react";
import "./feed.css";
import useRecipesStore from "../../store/recipeStore.js";
import { getLikedPostIds } from "../../api/likesApi.js";
import { getScheduledRecipeIds } from "../../api/calendar.js"; // Import the new calendar helper
import RecipeCard from "../recipes/RecipeCard";

export default function Feed() {
  const recipes = useRecipesStore((state) => state.recipes || []);
  const loadRecipesFromFirestore = useRecipesStore(
    (state) => state.loadRecipesFromFirestore,
  );
  const setRandom = useRecipesStore((state) => state.setRandom);
  const getRandomRecipe = useRecipesStore((state) => state.getRandomRecipe);

  const [likedIds, setLikedIds] = useState([]);
  const [scheduledIds, setScheduledIds] = useState([]); // State to track scheduled recipes

  // Fetch Recipes
  useEffect(() => {
    if (getRandomRecipe) getRandomRecipe();
    if (setRandom) setRandom(4);
    if (loadRecipesFromFirestore) loadRecipesFromFirestore();
  }, [getRandomRecipe, setRandom, loadRecipesFromFirestore]);

  // Fetch Liked and Scheduled Post IDs
  useEffect(() => {
    async function loadUserData() {
      try {
        const lIds = await getLikedPostIds();
        setLikedIds(lIds.map(String));

        // Fetch Scheduled IDs from the calendar
        const sIds = await getScheduledRecipeIds();
        setScheduledIds(sIds.map(String)); //
      } catch (err) {
        console.error("Error loading user recipe data", err);
      }
    }
    loadUserData();
  }, []);

  return (
    <div className="feed">
      <section className="intro">
        <h1 className="intro-title">Discover Macro-Friendly Recipes</h1>
        <p className="intro-sub">
          Track your macros while enjoying delicious, balanced meals
        </p>
      </section>

      <header className="feed-header">
        <div className="search">
          <input placeholder="Search recipes..." />
        </div>
      </header>

      <section className="grid">
        {recipes.length > 0 ? (
          recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              initiallyLiked={likedIds.includes(String(r.id))}
              initiallyScheduled={scheduledIds.includes(String(r.id))} // Pass scheduled status to card
            />
          ))
        ) : (
          <p className="loading-text">Loading delicious recipes...</p>
        )}
      </section>
    </div>
  );
}
