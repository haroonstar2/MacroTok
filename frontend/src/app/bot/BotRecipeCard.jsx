import React from "react";
import { useNavigate } from "react-router-dom";

export default function BotRecipeCard({ recipe }) {
  const navigate = useNavigate();

  // This helper stays inside the component so we can use it below
  const getNutrient = (r, name) => 
    r.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;
  return (
    <div style={{ 
      marginTop: 10, padding: 12, borderRadius: 12, 
      background: "#fff", border: "1px solid #ddd", color: "#000" 
    }}>
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%", borderRadius: 8 }} />
      <h4 style={{ margin: "8px 0 4px 0", fontSize: 16 }}>{recipe.title}</h4>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
        🔥 {Math.round(getNutrient(recipe, "Calories"))} cal
        • ⏱ {recipe.readyInMinutes} min
      </p>
      <button 
        style={{ width: "100%", padding: "8px", borderRadius: 8, background: "#000", color: "#fff", border: "none", cursor: "pointer" }}
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        View Full Recipe
      </button>
    </div>
  );
}