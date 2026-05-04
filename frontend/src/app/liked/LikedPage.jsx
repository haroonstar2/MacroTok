import React, { useEffect, useState } from "react";
import { getLikedRecipes } from "../../api/likesApi";
import RecipeCard from "../recipes/RecipeCard"; //
import "../feed/feed.css"; // Reuse the layout styles

function LikedPage() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const recipes = await getLikedRecipes();
        setLikedPosts(recipes);
      } catch (e) {
        console.error("Error loading liked posts:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
