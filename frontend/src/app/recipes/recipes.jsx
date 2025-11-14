import React from "react";
import { useEffect } from "react";
import useRecipesStore from "../../store/recipes";

export default function Recipes() {
  const { recipe, getRandomRecipe } = useRecipesStore();

  useEffect(() => {
    const loadRecipe = async () => {
      await getRandomRecipe();      
    }
    loadRecipe();
  }, []);
  
  if (recipe === null) return <p>Loading or failed to load recipe...</p>;

  return (
    <div>
      <h1>Random Recipe</h1>
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} width="300" />
      <p>Ready in {recipe.readyInMinutes} minutes</p>

      <h3>Ingredients</h3>
      <ul>
        {recipe.extendedIngredients && recipe.extendedIngredients.map((item) => (
            <li key={item.id}>{item.original}</li>
          ))}
      </ul>

      <h3>Instructions</h3>
      <p>{recipe.instructions || "No instructions available."}</p>

      <button onClick={getRandomRecipe}>Get Another Random Recipe</button>
    </div>
  );
}
