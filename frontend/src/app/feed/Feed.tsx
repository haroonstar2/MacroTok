/**
 * Feed.tsx
 * This component renders the main recipe feed page of the MacroTok App.
 * It displays a set of recipe cards with nutritional stats, difficulty,
 * like buttons, and search bar for filtering recipes
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import "./feed-themed.css";
import "../styles/feed-themed.css";
import useRecipesStore from "../../store/recipeStore.js";
import { getLikedPostIds } from "../../api/likesApi.js";
import { getScheduledRecipeIds } from "../../api/calendar.js";
import RecipeCard from "../recipes/RecipeCard.jsx";

import DropDown from "../recipes/DropDownMenu/dropDown.jsx";
import "../recipes/DropDownMenu/dropDown.css";
import DropdownItem from "../recipes/DropDownMenu/dropDownItem";

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
  vegan?: boolean;
  dairyFree?: boolean;
  glutenFree?: boolean;
  nutrition?: {
    nutrients: Nutrient[];
  };
  extendedIngredients?: Ingredient[];
  analyzedInstructions?: Array<{
    steps: Step[];
  }>;
}

// Feed Main Component
export default function Feed() {
  const recipes = useRecipesStore((state) => state.feedRecipes || []);
  const getFeedRecipe = useRecipesStore((state) => state.getFeedRecipe);

  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [scheduledIds, setScheduledIds] = useState<string[]>([]); // State to track scheduled recipes

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filterOptions = ["All", "Vegan", "Gluten Free", "Dairy Free"];

  const navigate = useNavigate();

  // Fetch Recipes
  useEffect(() => {
    getFeedRecipe();
  }, []);

  useEffect(() => {
    async function loadUserData() {
      try {
        const lIds = await getLikedPostIds();
        setLikedIds(lIds.map(String));

        // Fetch Scheduled IDs from the calendar
        const sIds = await getScheduledRecipeIds();
        setScheduledIds(sIds.map(String)); //
      } catch (err) {
        console.error("Error loading user recipe data", err);
      }
    }
    loadUserData();
  }, []);

  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    // Check the search query
    const safeTitle = recipe?.title || "";
    const matchesSearch = safeTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check the dietary category
    let matchesCategory = true; // Defaults to true for "All"

    if (activeFilter === "Vegan") {
      matchesCategory = recipe.vegan ?? false;
    } else if (activeFilter === "Dairy Free") {
      matchesCategory = recipe.dairyFree ?? false;
    } else if (activeFilter === "Gluten Free") {
      matchesCategory = recipe.glutenFree ?? false;
    }

    //Return true only if it matches both the text search AND the category
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="feed">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Macro-Friendly Recipes</h1>
          <p className="hero-subtitle">
            Track your macros while enjoying delicious, balanced meals tailored
            to your goals
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

          <DropDown
            buttonText={`Filter: ${activeFilter}`}
            content={
              <>
                {filterOptions.map((option) => (
                  <DropdownItem
                    key={option}
                    onClick={() => setActiveFilter(option)}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </>
            }
          />
        </div>
      </section>

      {/* Main grid */}
      <section className="grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((r: Recipe, index: number) => (
            // The clickable wrapper with the unique key
            <div
              key={`${r.id}-${index}`}
              onClick={() => navigate(`/recipe/${r.id}`)}
              className="cursor-pointer"
            >
              {/* The actual card! */}
              <RecipeCard
                recipe={r}
                initiallyLiked={likedIds.includes(String(r.id))}
                initiallyScheduled={scheduledIds.includes(String(r.id))}
                scheduledDate={null}
                scheduledSlot={null}
                onRemove={() => {}}
              />
            </div>
          ))
        ) : (
          <p className="loading-text">Loading delicious recipes...</p>
        )}
      </section>
    </div>
  );
}
