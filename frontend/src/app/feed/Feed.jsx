/**
 * Feed.jsx
 * this component renders the main recipe feed page of the MacroTok App. 
 * It displays a set of mock recipe cards with nutritional stats, difficulty, 
 * like buttons, and search bar for filtering recipes 
 * 
 * Fiyori Demewez
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./feed.css"; // Import external styling ;
import useRecipesStore from "../../store/recipeStore.js";
import { MOCK_SPOONACULAR_RECIPES } from "../../store/mock_spoonacular_recipes.js";
import { ACTUAL_SPOONACULAR_RECIPES } from "../../store/actual_spoonacular_recipes.js";

// Infer a simple difficulty level from the recipe
function getDifficulty(recipe) {
  const time = recipe.readyInMinutes;
  const ingredients = recipe.extendedIngredients.length;
  const steps = recipe.analyzedInstructions?.[0]?.steps?.length ?? 0;

  let score = 0;

  if (time > 30) score++;
  if (ingredients > 10) score++;
  if (steps > 6) score++;

  if (score === 0) return "Easy";
  if (score === 1) return "Medium";
  return "Hard";
}


// ---- Small reusable UI ---- 
// <chip/> -displays a small label eg ingredients tag
function Chip({ children }) {
  return <span className="chip">{children}</span>;
}
/*
<StateBar/> shows progress bar for a nutrient ( protein, Carbs, Fats)
@param {string} label - name of nutrient
 * @param {number} value - grams of nutrient
 * @param {string} unit - unit to display (e.g., "g")
 * @param {string} variant - used to color-code nutrient type
*/

function StatBar({ label, value, unit, variant }) {
  return (
    <div className={`stat ${variant ? `progress--${variant}` : ""}`}>
      <div className="stat-row">
        <span className="stat-label">{label}</span>
        <span className="stat-value">
          {Math.trunc(value)}
          {" "}
          {unit}
        </span>
      </div>
      <div className={`progress ${variant ? `progress--${variant}` : ""}`}>
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, (value / 70) * 100)}%` }}
        />
      </div>
    </div>
  );
}
// <DifficultyTag /> -colored tag showing recipe difficulty level

function DifficultyTag({ level }) {
  //Choose color tone based on difficulty level 
  const tone =
    {
      Easy: "#27c07d",
      Medium: "#f2a93b",
      Hard: "#ef5350",
    }[level] || "#27c07d";

  return (
    <span className="difficulty" style={{ background: tone }}>
      {level}
    </span>
  );
}

// ---- Heart Button (like/unlike) - toggles between liked/unliked states 
function HeartButton({ onClick }) {

  const [liked, setLiked] = useState(false); //track like state

  const handleClick = (e) => {
    e.stopPropagation();        // stop bubbling by default
    setLiked(!liked);           // toggle like
    if (onClick) onClick(e);    // call parent-provided onClick (optional)
  };

  return (
    <button
      className={`heart ${liked ? "liked" : ""}`}
      onClick={handleClick} //toggle like (red liked unlike white heart)
      aria-label="like"
    >
      {liked ? "❤️" : "🤍"}
    </button>
  );
}

/**
 * <RecipeCard /> - displays a single recipe’s image, nutrition info,
 * ingredients, and difficulty.
 * 
 * @param {object} recipe - recipe data object (title, img, macros, etc.)
 */


function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const recipeDetails = {
    id: recipe.id,
    title: recipe.title,
    calories: recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount,
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    protein: recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount,
    carbs: recipe.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount,
    fats: recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount,
    ingredients: recipe.extendedIngredients?.map(i => i.original),
    level: getDifficulty(recipe)
  };

  const openDetail = () => {
    navigate(`/recipe/${recipeDetails.id}`);
  };

  return (
    <div>

    <div className="card-link" onClick={openDetail} title={`View ${recipeDetails.title}`}>
      <article className="card">
        <div className="card-media">
          <img src={recipeDetails.image} alt={recipeDetails.title} />
          <HeartButton onClick={(e) => e.stopPropagation()}/>
          <div className="overlay"><DifficultyTag level={recipeDetails.level} /></div>
        </div>

        <div className="card-body">
          <h3 className="card-title">{recipeDetails.title}</h3>
          <div className="meta">
            <span>🔥 {Math.trunc(recipeDetails.calories)} calories</span>
            <span>• ⏱ {recipeDetails.readyInMinutes} min</span>
          </div>
          <div className="stats">
            <StatBar label="Protein" value={recipeDetails.protein} unit="g" variant="protein" />
            <StatBar label="Carbs" value={recipeDetails.carbs} unit="g" variant="carbs" />
            <StatBar label="Fats" value={recipeDetails.fats} unit="g" variant="fats" />
          </div>
          <div className="keys">
            <p className="keys-title">Key Ingredients</p>
            <div className="chips">
              {recipeDetails.ingredients.slice(0, 5).map((k) => <Chip key={k}>{k}</Chip>)}
              {recipeDetails.ingredients.length > 5 && <Chip>+{recipeDetails.ingredients.length - 5} more</Chip>}
            </div>
          </div>
        </div>
      </article>
    </div>
    </div>
  );
}

// ---- Feed Main Component ----
export default function Feed() {

  const recipe = useRecipesStore((state) => state.recipe);
  const recipes = useRecipesStore((state) => state.recipes);
  const getRandomRecipe = useRecipesStore((state) => state.getRandomRecipe);
  const setRandom = useRecipesStore((state => state.setRandom));


  // useEffect(() => {
  //     setRandom(4); // Number of new recipes that should be rendered when user scrolls down
  //     const loadRecipe = async () => {
  //       await getRandomRecipe();      
  //     }
  //     loadRecipe();
  //   }, []);

    // if (recipes.length === 0) {
    //   return <p>Something went wrong. Please try again. </p>
    // }

  return (
    <div className="feed">
      {/* --- Introduction Section --- */}
      <section className="intro">
        <h1 className="intro-title">Discover Macro-Friendly Recipes</h1>
        <p className="intro-sub">Track your macros while enjoying delicious, balanced meals</p>
      </section>

      <header className="feed-header">
        {/* <h2>Home</h2> */}
        <div className="search">
          <input placeholder="Search recipes..." />
        </div>
      </header>

<section className="grid">
  {ACTUAL_SPOONACULAR_RECIPES.map((r, index) => (
    <RecipeCard key={r.id || index} recipe={r} />
  ))}
</section>
    </div>
  );
}
