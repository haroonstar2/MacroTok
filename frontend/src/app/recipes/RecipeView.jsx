import React from "react";
import { useNavigate } from "react-router-dom";

function getNutrient(recipe, name) {
  return recipe.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;
}

export default function RecipeView({ recipe, onBack }) {

  console.log(recipe);  

  const navigate = useNavigate();

  if (!recipe) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Recipe Not Found</h1>
        <button className="btn btn--outline" onClick={onBack}>Back</button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
      <button
        className="btn btn--outline"
        onClick={() => {navigate("/feed")}}
        style={{ marginBottom: 12 }}
      >
        ← Back
      </button>

      <header style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h1 style={{ margin: "8px 0" }}>{recipe.title}</h1>
          <p style={{ color: "#6b7280" }}>
            🔥 {getNutrient(recipe, "Calories")} cal • ⏱ {recipe.readyInMinutes} min • {recipe.level}
          </p>
          <div style={{ marginTop: 12 }}>
            <strong>Ingredients</strong>
            <ul style={{ marginTop: 8 }}>
              {recipe.extendedIngredients.map((ing) => <li key={ing.id}>{ing.original}</li>)}
            </ul>
          </div>
        </div>

        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", borderRadius: 16, objectFit: "cover" }}
        />
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>Directions</h2>
        <ol style={{ marginTop: 8 }}>
          {recipe.analyzedInstructions[0].steps.map((s, i) => <li key={i} style={{ margin: "8px 0" }}>{s.step}</li>)}
        </ol>
      </section>
    </main>
  );
}
