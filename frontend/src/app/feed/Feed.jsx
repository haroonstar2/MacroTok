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

// Infer a simple difficulty level from the recipe
function getDifficulty(recipe) {
  const time = recipe.readyInMinutes;
  const ingredients = recipe?.extendedIngredients?.length ?? 0;
  const steps = recipe?.analyzedInstructions?.[0]?.steps?.length ?? 0;


  let score = 0;

  if (time > 30) score++;
  if (ingredients > 10) score++;
  if (steps > 6) score++;

  if (score === 0) return "Easy";
  if (score === 1) return "Medium";
  return "Hard";
}


// Small reusable UI 
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

// Heart Button (like/unlike) - toggles between liked/unliked states 
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
    calories: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount ?? 0),
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    protein: recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount,
    carbs: recipe.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount,
    fats: recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount,
    ingredients: recipe.extendedIngredients?.map(i => i.original),
    level: getDifficulty(recipe)
  };

  const openDetail = () => {
    console.log("we navigating yo", recipeDetails.id);
    
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
             {(recipeDetails?.ingredients ?? [])
              .slice(0, 5)
              .map((k, idx) => <Chip key={idx}>{k}</Chip>)}
              {(recipeDetails?.ingredients?.length ?? 0) > 5 && (
              <Chip>+{recipeDetails.ingredients.length - 5} more</Chip>
            )}
          </div>

          </div>
        </div>
      </article>
    </div>
    </div>
  );
}

// Feed Main Component 
export default function Feed() {
  
  const recipes = useRecipesStore((state) => state.recipes);
  const loadRecipesFromFirestore = useRecipesStore(
    (state) => state.loadRecipesFromFirestore
  );
  const setRandom = useRecipesStore((state) => state.setRandom);
  const getRandomRecipe = useRecipesStore((state) => state.getRandomRecipe); 


 useEffect(() => { 
    getRandomRecipe();
  }, []);


  useEffect(() => {
    setRandom(4);               // optional, sets how many random recipes to fetch
    loadRecipesFromFirestore(); // loads saved recipes from Firestore into Zustand
  }, [setRandom, loadRecipesFromFirestore]);

  return (
    <div className="feed">
      {/* Introduction Section */}
      <section className="intro">
        <h1 className="intro-title">Discover Macro-Friendly Recipes</h1>
        <p className="intro-sub">
          Track your macros while enjoying delicious, balanced meals
        </p>
      </section>

      <header className="feed-header">
        {/* <h2>Home</h2> */}
        <div className="search">
          <input placeholder="Search recipes..." />
        </div>
      </header>

      {/* main grid uses recipes from zustand */}
      <section className="grid">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </section>
    </div>
  );
}

