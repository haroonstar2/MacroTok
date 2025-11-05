import React from "react";

export default function RecipeDetail({ recipe, onBack }) {
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
  onClick={() => {
    // ✅ If this was opened in a new tab
    if (window.opener) {
      window.close();
    } else {
      // Fallback: remove query and go to Feed
      const url = new URL(window.location.href);
      url.searchParams.delete("recipe");
      window.history.replaceState({}, "", url.toString());
      window.location.reload();
    }
  }}
  style={{ marginBottom: 12 }}
>
  ← Back
</button>


      <header style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h1 style={{ margin: "8px 0" }}>{recipe.title}</h1>
          <p style={{ color: "#6b7280" }}>
            🔥 {recipe.calories} kcal • ⏱ {recipe.time} min • {recipe.level}
          </p>
          <div style={{ marginTop: 12 }}>
            <strong>Ingredients</strong>
            <ul style={{ marginTop: 8 }}>
              {recipe.ingredients.map((ing) => <li key={ing}>{ing}</li>)}
            </ul>
          </div>
        </div>

        <img
          src={recipe.img}
          alt={recipe.title}
          style={{ width: "100%", borderRadius: 16, objectFit: "cover" }}
        />
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>Directions</h2>
        <ol style={{ marginTop: 8 }}>
          {recipe.steps.map((s, i) => <li key={i} style={{ margin: "8px 0" }}>{s}</li>)}
        </ol>
      </section>
    </main>
  );
}
