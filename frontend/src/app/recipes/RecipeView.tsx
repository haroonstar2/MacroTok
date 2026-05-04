import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, Flame, ChefHat, ChevronDown } from "lucide-react";
import { Recipe } from "./recipe";
import { Button } from "../../components/ui/button";
// import "./recipe-detail.css";
import "../styles/recipe-detail.css";

import { useCart } from "../../context/cartcontext"; 

import "./recipe.css";
import DropDown from "./DropDownMenu/dropDown.jsx";
import "./DropDownMenu/dropDown.css";
import DropdownItem from "./DropDownMenu/dropDownItem";

function getNutrient(recipe: Recipe, name: string): number {
  return recipe.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;
}

function convertFraction(decimal: number) {
  if (!decimal) return "";

  const tolerance = 1.0e-6;
  let h1 = 1,
    h2 = 0;
  let k1 = 0,
    k2 = 1;
  let b = decimal;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
  return `${h1}/${k1}`;
}

function formatting(value: number) {
  if (Number.isInteger(value)) return value;

  const whole = Math.floor(value);
  const fraction = convertFraction(value - whole);

  if (whole == 0) return fraction;
  return `${whole} ${fraction}`;
}

interface RecipeViewProps {
  recipe: any;
  onBack: () => void;
}

export default function RecipeView({ recipe, onBack }: RecipeViewProps) {
  const navigate = useNavigate();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [servings, setServing] = useState(1);
  const items = [1, 2, 3, 4, 5, 6, 7];
  const { addSingleItem, addRecipeToCart } = useCart() as any;
  const getIngredientText = (item: any) =>
  `${formatting(item.amount * servings)} ${item.unit || ""} ${item.name || ""}`.trim();

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
            <Button
              className="btn"
              onClick={() => addRecipeToCart(recipe)}
            > Add All Ingredients to Cart </Button>

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
                <span> Yields {recipe.servings}</span>
              </div>

              {/*Drop Down Menu Section*/}
              <div className="meta-badge">
                <DropDown
                    buttonText={`${servings} serving${servings === 1 ? "" : "s"}`}
                  content={
                    <>
                      {items.map((item) => (
                        <DropdownItem
                          key={item}
                          onClick={() => setServing(item)}
                        >
                          {item}
                        </DropdownItem>
                      ))}
                    </>
                  }
                />
              </div>
              {/*End Drop Down Menu Section*/}
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
          key={item.id ?? index}
          className="ingredient-pill bg-slate-50 p-2 rounded border"
         onClick={() => addSingleItem(getIngredientText(item))}
        role="button"
          tabIndex={0}
        >
        <span>
         {formatting(item.amount * servings)} {item.unit} {item.name}
        </span>

        <span className="ingredient-tooltip">Add to shopping list</span>
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
