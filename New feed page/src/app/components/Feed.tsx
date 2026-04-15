/**
 * Feed.tsx
 * This component renders the main recipe feed page of the MacroTok App. 
 * It displays a set of recipe cards with nutritional stats, difficulty, 
 * like buttons, and search bar for filtering recipes
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../styles/feed-themed.css";

// Recipe type definition
interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

interface Ingredient {
  original: string;
}

interface Step {
  number: number;
  step: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  nutrition?: {
    nutrients: Nutrient[];
  };
  extendedIngredients?: Ingredient[];
  analyzedInstructions?: Array<{
    steps: Step[];
  }>;
}

// Mock recipe data
const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Grilled Chicken & Quinoa Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    readyInMinutes: 25,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 450, unit: "kcal" },
        { name: "Protein", amount: 42, unit: "g" },
        { name: "Carbohydrates", amount: 35, unit: "g" },
        { name: "Fat", amount: 15, unit: "g" },
      ],
    },
    extendedIngredients: [
      { original: "Chicken breast" },
      { original: "Quinoa" },
      { original: "Broccoli" },
      { original: "Olive oil" },
      { original: "Garlic" },
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Cook" }, { number: 2, step: "Serve" }] }],
  },
  {
    id: 2,
    title: "Salmon & Sweet Potato",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    readyInMinutes: 30,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 520, unit: "kcal" },
        { name: "Protein", amount: 38, unit: "g" },
        { name: "Carbohydrates", amount: 45, unit: "g" },
        { name: "Fat", amount: 18, unit: "g" },
      ],
    },
    extendedIngredients: [
      { original: "Salmon fillet" },
      { original: "Sweet potato" },
      { original: "Asparagus" },
      { original: "Lemon" },
      { original: "Dill" },
      { original: "Butter" },
    ],
    analyzedInstructions: [
      { steps: [{ number: 1, step: "Prep" }, { number: 2, step: "Cook" }, { number: 3, step: "Plate" }] },
    ],
  },
  {
    id: 3,
    title: "Turkey Meatballs with Zoodles",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop",
    readyInMinutes: 35,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 380, unit: "kcal" },
        { name: "Protein", amount: 35, unit: "g" },
        { name: "Carbohydrates", amount: 28, unit: "g" },
        { name: "Fat", amount: 12, unit: "g" },
      ],
    },
    extendedIngredients: [
      { original: "Ground turkey" },
      { original: "Zucchini" },
      { original: "Marinara sauce" },
      { original: "Parmesan" },
      { original: "Basil" },
      { original: "Onion" },
      { original: "Garlic" },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Mix" },
          { number: 2, step: "Form" },
          { number: 3, step: "Bake" },
          { number: 4, step: "Spiralize" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Greek Yogurt Parfait",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop",
    readyInMinutes: 10,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 320, unit: "kcal" },
        { name: "Protein", amount: 25, unit: "g" },
        { name: "Carbohydrates", amount: 42, unit: "g" },
        { name: "Fat", amount: 8, unit: "g" },
      ],
    },
    extendedIngredients: [
      { original: "Greek yogurt" },
      { original: "Berries" },
      { original: "Granola" },
      { original: "Honey" },
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Layer ingredients" }] }],
  },
];

// Infer a simple difficulty level from the recipe
function getDifficulty(recipe: Recipe): string {
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

// Small reusable UI components
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

/**
 * StatBar - shows progress bar for a nutrient (Protein, Carbs, Fats)
 */
function StatBar({
  label,
  value,
  unit,
  variant,
}: {
  label: string;
  value: number;
  unit: string;
  variant: string;
}) {
  return (
    <div className={`stat ${variant ? `progress--${variant}` : ""}`}>
      <div className="stat-row">
        <span className="stat-label">{label}</span>
        <span className="stat-value">
          {Math.trunc(value)} {unit}
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

// DifficultyTag - colored tag showing recipe difficulty level
function DifficultyTag({ level }: { level: string }) {
  const tone =
    {
      Easy: "#27c07d",
      Medium: "#f2a93b",
      Hard: "#ef5350",
    }[level as keyof typeof toneMap] || "#27c07d";

  const toneMap = {
    Easy: "#27c07d",
    Medium: "#f2a93b",
    Hard: "#ef5350",
  };

  return (
    <span className="difficulty" style={{ background: tone }}>
      {level}
    </span>
  );
}

// Heart Button (like/unlike) - toggles between liked/unliked states
function HeartButton({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  const [liked, setLiked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onClick) onClick(e);
  };

  return (
    <button className={`heart ${liked ? "liked" : ""}`} onClick={handleClick} aria-label="like">
      {liked ? "❤️" : "🤍"}
    </button>
  );
}

/**
 * RecipeCard - displays a single recipe's image, nutrition info,
 * ingredients, and difficulty.
 */
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();

  const recipeDetails = {
    id: recipe.id,
    title: recipe.title,
    calories: Math.round(
      recipe.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount ?? 0
    ),
    readyInMinutes: recipe.readyInMinutes,
    image: recipe.image,
    protein: recipe.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount ?? 0,
    carbs: recipe.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")?.amount ?? 0,
    fats: recipe.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount ?? 0,
    ingredients: recipe.extendedIngredients?.map((i) => i.original) ?? [],
    level: getDifficulty(recipe),
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
            <HeartButton onClick={(e) => e.stopPropagation()} />
            <div className="overlay">
              <DifficultyTag level={recipeDetails.level} />
            </div>
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
                {recipeDetails.ingredients.slice(0, 5).map((k, idx) => (
                  <Chip key={idx}>{k}</Chip>
                ))}
                {recipeDetails.ingredients.length > 5 && (
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load mock recipes
    setRecipes(MOCK_RECIPES);
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="feed">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Macro-Friendly Recipes</h1>
          <p className="hero-subtitle">
            Track your macros while enjoying delicious, balanced meals tailored to your goals
          </p>
          
          {/* Custom Search Bar */}
          <div className="InputContainer">
            <input
              type="text"
              className="input"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="grid">
        {filteredRecipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </section>
    </div>
  );
}