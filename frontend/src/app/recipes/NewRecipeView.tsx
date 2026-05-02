import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, Flame, ChefHat, ChevronDown } from "lucide-react";
import { Recipe } from "./recipe";
// import { Button } from "../lib/ui-components";
import { Button } from "../../components/ui/button";
// import "./recipe-detail.css";
import "../styles/recipe-detail.css";

function getNutrient(recipe: Recipe, name: string): number {
  return recipe.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;
}

interface NewRecipeViewProps {
  recipe: any;
  onBack: () => void;
}

export default function NewRecipeView({ recipe, onBack }: NewRecipeViewProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  if (!recipe) {
    return (
      <div className="recipe-detail-container">
        <div className="recipe-not-found">
          <h1>Recipe Not Found</h1>
          <Button className="btn-back-error" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-content">
        {/* Back Button */}
        <Button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
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
                <span className="nutrition-value">
                  {getNutrient(recipe, "Protein")}g
                </span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">
                  {getNutrient(recipe, "Carbohydrates")}g
                </span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">
                  {getNutrient(recipe, "Fat")}g
                </span>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="ingredients-section">
              <h2 className="section-heading">Ingredients</h2>
              <ul className="ingredients-grid">
                {recipe.extendedIngredients?.map((item: any, index: number) => (
                  <li
                    key={index}
                    className="ingredient-pill bg-slate-50 p-2 rounded border"
                  >
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
                  className={`chevron-icon ${isInstructionsOpen ? "rotated" : ""}`}
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
                    <p className="no-instructions">
                      No instructions available for this recipe.
                    </p>
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
