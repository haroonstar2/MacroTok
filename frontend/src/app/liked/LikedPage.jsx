import React, { useEffect, useState } from "react";
import { getLikedPostIds } from "../../api/likesApi";
import useRecipesStore from "../../store/recipeStore";
import RecipeCard from "../recipes/RecipeCard"; //
import "../feed/feed.css"; // Reuse the layout styles

function LikedPage() {
  const [likedPosts, setLikedPosts] = useState([]);
  const recipes = useRecipesStore((state) => state.recipes);

  useEffect(() => {
    async function load() {
      try {
        const ids = await getLikedPostIds();
        // Match the recipes from your store with the liked IDs
        const filtered = recipes.filter((r) => ids.includes(String(r.id)));
        setLikedPosts(filtered);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [recipes]);

  return (
    <div className="feed">
      <section className="intro">
        <h1 className="intro-title">Your Liked Recipes</h1>
        <p className="intro-sub">Everything you've saved for later</p>
      </section>

      {/* The 'grid' class ensures it looks like the home page */}
      <section className="grid">
        {likedPosts.length === 0 ? (
          <p className="loading-text">No liked posts yet.</p>
        ) : (
          likedPosts.map((p) => (
            <RecipeCard 
              key={p.id} 
              recipe={p} 
              initiallyLiked={true} //
            />
          ))
        )}
      </section>
    </div>
  );
}

export default LikedPage;