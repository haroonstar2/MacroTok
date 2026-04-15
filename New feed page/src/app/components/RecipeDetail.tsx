import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, Flame, ChefHat, ChevronDown } from "lucide-react";
import { Recipe } from "../types/recipe";
import { Button } from "../lib/ui-components";
import "../styles/recipe-detail.css";

function getNutrient(recipe: Recipe, name: string): number {
  return recipe.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Mock recipe data - in production, this would come from an API
  const recipe: Recipe = {
    id: Number(id),
    title: "Grilled Salmon with Lemon Butter Sauce",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    readyInMinutes: 30,
    servings: 4,
    level: "Medium",
    extendedIngredients: [
      { id: 1, name: "salmon", original: "4 salmon fillets (6 oz each)", amount: 4, unit: "fillets" },
      { id: 2, name: "butter", original: "4 tablespoons unsalted butter", amount: 4, unit: "tablespoons" },
      { id: 3, name: "lemon", original: "2 lemons (juiced and zested)", amount: 2, unit: "whole" },
      { id: 4, name: "garlic", original: "3 cloves garlic, minced", amount: 3, unit: "cloves" },
      { id: 5, name: "olive oil", original: "2 tablespoons olive oil", amount: 2, unit: "tablespoons" },
      { id: 6, name: "salt", original: "Salt and pepper to taste", amount: 1, unit: "pinch" },
      { id: 7, name: "fresh dill", original: "2 tablespoons fresh dill, chopped", amount: 2, unit: "tablespoons" },
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Pat the salmon fillets dry with paper towels and season both sides with salt and pepper." },
          { number: 2, step: "Heat olive oil in a large skillet over medium-high heat." },
          { number: 3, step: "Place salmon fillets skin-side up in the pan. Cook for 4-5 minutes until golden brown." },
          { number: 4, step: "Flip the salmon and cook for another 3-4 minutes until cooked through." },
          { number: 5, step: "Remove salmon from pan and set aside on a plate." },
          { number: 6, step: "In the same pan, reduce heat to medium and add butter and minced garlic. Cook for 1 minute." },
          { number: 7, step: "Add lemon juice, lemon zest, and fresh dill. Stir to combine and cook for 1-2 minutes." },
          { number: 8, step: "Return salmon to the pan and spoon the lemon butter sauce over the fillets." },
          { number: 9, step: "Serve immediately with your choice of vegetables or rice." },
        ],
      },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 380, unit: "kcal" },
        { name: "Protein", amount: 34, unit: "g" },
        { name: "Fat", amount: 26, unit: "g" },
        { name: "Carbohydrates", amount: 3, unit: "g" },
      ],
    },
  };

  if (!recipe) {
    return (
      <div className="recipe-detail-container">
        <div className="recipe-not-found">
          <h1>Recipe Not Found</h1>
          <Button className="btn-back-error" onClick={() => navigate("/feed")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-content">
        {/* Back Button */}
        <Button className="btn-back" onClick={() => navigate("/feed")}>
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Button>

        {/* Recipe Showcase Card */}
        <div className="recipe-showcase">
          {/* Recipe Image */}
          <div className="showcase-image-container">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="showcase-image"
            />
            <div className="image-overlay">
              <div className="level-badge">{recipe.level}</div>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="showcase-details">
            <h1 className="recipe-showcase-title">{recipe.title}</h1>

            {/* Recipe Meta */}
            <div className="showcase-meta">
              <div className="meta-badge">
                <Flame className="meta-badge-icon" />
                <span>{getNutrient(recipe, "Calories")} cal</span>
              </div>
              <div className="meta-badge">
                <Clock className="meta-badge-icon" />
                <span>{recipe.readyInMinutes} min</span>
              </div>
              <div className="meta-badge">
                <ChefHat className="meta-badge-icon" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            {/* Nutrition Stats */}
            <div className="nutrition-grid">
              <div className="nutrition-card">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">{getNutrient(recipe, "Protein")}g</span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">{getNutrient(recipe, "Carbohydrates")}g</span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">{getNutrient(recipe, "Fat")}g</span>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="ingredients-section">
              <h2 className="section-heading">Ingredients</h2>
              <ul className="ingredients-grid">
                {recipe.extendedIngredients.map((item) => (
                  <li key={item.id} className="ingredient-pill">
                    {item.original}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Section */}
            <div className="instructions-section">
              <div 
                className="instructions-header"
                onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
              >
                <h2 className="section-heading">Instructions</h2>
                <ChevronDown 
                  className={`chevron-icon ${isInstructionsOpen ? 'rotated' : ''}`}
                />
              </div>
              {isInstructionsOpen && (
                <>
                  {recipe.analyzedInstructions?.[0]?.steps ? (
                    <ol className="instructions-list">
                      {recipe.analyzedInstructions[0].steps.map((step) => (
                        <li key={step.number} className="instruction-step">
                          <span className="step-number">{step.number}</span>
                          <span className="step-text">{step.step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="no-instructions">No instructions available for this recipe.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}