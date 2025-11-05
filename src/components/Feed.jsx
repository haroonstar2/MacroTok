/**
 * Feed.jsx
 * this component renders the main recipe feed page of the MacroTok App. 
 * It displays a set of mock recipe cards with nutritional stats, difficulty, 
 * like buttons, and search bar for filtering recipes 
 * 
 * Fiyori Demewez
 
 */


import React, { useState } from "react";
import "./feed.css"; // Import external styling 
import { RECIPES } from "../data/recipes";

// ---- Recipe Images ---- taken from allRecipe this mock placeholder 
const IMG1 =
  "https://www.allrecipes.com/thmb/KRMA0qCLcWQPUJVbI0GhfTTBjfg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/3083572-48d16efa3aa646d79f111ffe7083e247.jpg";
const IMG2 =
  "https://www.allrecipes.com/thmb/YwjKMwHsgrH0zHYwzXnpIgLERFg=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/14186grilled-chicken-salad-with-seasonal-fruitMyHotSouthernMessvideo4x3-f5a19d6ca2454588b6117e54c30e2d93.jpg";
const IMG3 =
  "https://www.allrecipes.com/thmb/JPGRfk-Yu7zBMJR7u3e0V1deU7s=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/525680-59785dcd66c64d6ebca2afd2b94e23cb.jpg";
const IMG4 =
  "https://www.allrecipes.com/thmb/zrmqMcZQpoXE3MaFuT2EXd5ZVN0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/3857628-701ac554cbee469385dde8dfa347af81.jpg";

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
          {value}
          {unit}
        </span>
      </div>
      progress bar visualization 
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
function HeartButton() {
  const [liked, setLiked] = useState(false); //track like state
  return (
    <button
      className={`heart ${liked ? "liked" : ""}`}
      onClick={() => setLiked(!liked)} //toggle like (red liked unlike white heart)
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
  const {
    id, title, calories, time, img, protein, carbs, fats, ingredients, level
  } = recipe;

  const openDetail = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("recipe", id); // e.g., ?recipe=grilled-chicken-salad-fruit
    window.open(url.toString(), "_blank", "noopener,noreferrer"); // open detail in new tab
  };

  return (
    <button className="card-link" onClick={openDetail} title={`View ${title}`}>
      <article className="card">
        <div className="card-media">
          <img src={img} alt={title} />
          <HeartButton />
          <div className="overlay"><DifficultyTag level={level} /></div>
        </div>

        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="meta">
            <span>🔥 {calories} calories</span>
            <span>• ⏱ {time} min</span>
          </div>
          <div className="stats">
            <StatBar label="Protein" value={protein} unit="g" variant="protein" />
            <StatBar label="Carbs" value={carbs} unit="g" variant="carbs" />
            <StatBar label="Fats" value={fats} unit="g" variant="fats" />
          </div>
          <div className="keys">
            <p className="keys-title">Key Ingredients</p>
            <div className="chips">
              {ingredients.slice(0, 5).map((k) => <Chip key={k}>{k}</Chip>)}
              {ingredients.length > 5 && <Chip>+{ingredients.length - 5} more</Chip>}
            </div>
          </div>
        </div>
      </article>
    </button>
  );
}

// ---- Mock Recipes ----
const MOCK_RECIPES = [
  {
    title: "purple monstrosity fruit  Smoothie ",
    calories: 88,
    time: 5,
    img: IMG1,
    protein: 1,
    carbs: 21,
    fats: 0,
    ingredients: ["2 frozen bananas, skins removed and cut in chunks", "½ cup frozen blueberries", "1 tablespoon honey (Optional)", "1 teaspoon vanilla extract (Optional)"],
    level: "Easy",
  },
  {
    title: "Grilled Chicken & Veggies",
    calories: 567,
    time: 35,
    img: IMG2,
    protein: 18,
    carbs: 23,
    fats: 46,
    ingredients: ["1 pound skinless, boneless chicken breast halves", "½ cup pecans", "⅓ cup red wine vinegar", "½ cup white sugar", "1 cup vegetable oil","½ onion, minced", "1 teaspoon ground mustard","1 teaspoon salt","¼ teaspoon ground white pepper"
      ,"2 heads Bibb lettuce - rinsed, dried and torn", "1 cup sliced fresh strawberries"],
    level: "Medium",
  },
  {
    title: "Quinoa Porrridge with Cinnamon Apples",
    calories: 402,
    time: 40,
    img: IMG3,
    protein: 11,
    carbs: 59,
    fats: 14,
    ingredients: ["1 cup red quinoa, rinsed and drained", "2 cups water", "1 tablespoon butter", "1 apple - peeled, cored and diced", "½ teaspoon salt", "1 tablespoon ground cinnamon"
      ,"2 tablespoons maple syrup","⅓ cup sliced almonds","1 ½ cups almond milk","1 tablespoon half-and-half cream, or to taste (Optional)"],
    level: "Medium",
  },
  {
    title: "Oat and Quinoa Breakfast Cake",
    calories: 407,
    time: 20,
    img: IMG4,
    protein: 14,
    carbs: 53,
    fats: 17,
    ingredients: ["2 tablespoons cold water, or as needed"," 1 tablespoon coconut oil ","3 eggs", "1 cup almond flour ","2 cups vanilla soy milk", "1 cup milk", "⅔ cup maple syrup", "⅓ cup hemp powder", "1 tablespoon ground cinnamon","¼ teaspoon ground nutmeg", " 2 apples, peeled and diced"
      ,"1 ½ cups rolled oats, divided","1 cup uncooked quinoa ","⅓ cup chopped pecans ","¼ cup raisins","¼ cup flax seeds ","1 banana, thinly sliced "
    ],
    level: "Easy",
  },
];

// ---- Feed Main Component ----
export default function Feed() {
  return (
    <div className="feed">
      {/* --- Introduction Section --- */}
      <section className="intro">
        <h1 className="intro-title">Discover Macro-Friendly Recipes</h1>
        <p className="intro-sub">Track your macros while enjoying delicious, balanced meals</p>
      </section>

      <header className="feed-header">
        <h2>Home</h2>
        <div className="search">
          <input placeholder="Search recipes..." />
        </div>
      </header>

      // Replace your map with RECIPES
<section className="grid">
  {RECIPES.map((r) => (
    <RecipeCard key={r.id} recipe={r} />
  ))}
</section>
    </div>
  );
}
