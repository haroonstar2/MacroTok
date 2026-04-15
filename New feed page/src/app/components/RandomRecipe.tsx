/**
 * RandomRecipe.tsx
 * Displays a random recipe from the store with beautiful MacroTok styling
 */

import React, { useEffect, useState } from "react";
import { Shuffle, Clock, Flame, ChefHat, Loader2, ChevronDown } from "lucide-react";
import { Button } from "../lib/ui-components";
import useRecipesStore from "../store/recipeStore";
import "../styles/random-recipe.css";

function getNutrient(recipe: any, name: string): number {
  return recipe?.nutrition?.nutrients?.find((n: any) => n.name === name)?.amount ?? 0;
}

export default function RandomRecipe() {
  const { recipe, loading, getRandomRecipe } = useRecipesStore();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      await getRandomRecipe();
    };
    loadRecipe();
  }, [getRandomRecipe]);

  if (loading) {
    return (
      <div className="random-recipe-container">
        <div className="random-recipe-loading">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Finding your perfect recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="random-recipe-container">
        <div className="random-recipe-error">
          <h1>No Recipe Found</h1>
          <p>Failed to load recipe. Please try again.</p>
          <Button onClick={getRandomRecipe} className="btn-shuffle">
            <Shuffle className="w-5 h-5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="random-recipe-container">
      <div className="random-recipe-content">
        {/* Header with Shuffle Button */}
        <div className="random-recipe-header">
          <div>
            <h1 className="page-title">Random Recipe</h1>
            <p className="page-subtitle">Discover something new and delicious</p>
          </div>
          <Button onClick={getRandomRecipe} className="btn-shuffle">
            <Shuffle className="w-5 h-5" />
            Get Another Recipe
          </Button>
        </div>

        {/* Recipe Card */}
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
            <h2 className="recipe-showcase-title">{recipe.title}</h2>

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
              <h3 className="section-heading">Ingredients</h3>
              <ul className="ingredients-grid">
                {recipe.extendedIngredients &&
                  recipe.extendedIngredients.map((item) => (
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
                <h3 className="section-heading">Instructions</h3>
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