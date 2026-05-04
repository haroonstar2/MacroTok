// frontend/src/app/bot/ButtonBot.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRecipesStore from "../../store/recipeStore";
import { BOT_NAME, botStyles as styles, getOptionsForNode } from "./BotData";
import BotRecipeCard from "./BotRecipeCard";
import { ACTUAL_SPOONACULAR_RECIPES } from "../../store/actual_spoonacular_recipes";

export default function ButtonBot() {
  const navigate = useNavigate();
  const recipes = useRecipesStore((state) => state.feedRecipes);

  // Each message: { from: "bot" | "user", text: string }
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Hello, I am ${BOT_NAME}. Pick a button and I’ll guide you.`,
    },
  ]);

  // "node" controls which button set to show
  const [node, setNode] = useState("root");
  const [recipeFilter, setRecipeFilter] = useState(null);

  const options = useMemo(() => getOptionsForNode(node), [node]);

  function pushBot(text) {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  }

  function pushUser(text) {
    setMessages((prev) => [...prev, { from: "user", text }]);
  }

  function go(toNode) {
    setNode(toNode);
  }

  function handlePick(opt) {
  // --- PART A: Record the user's choice ---
  pushUser(opt.label);

  // --- PART B: Remember the category ---
  if (["hp", "lc", "quick"].includes(opt.key)) {
    setRecipeFilter(opt.key);
  }

  // --- PART C: Handle "say" buttons (Navigates to next menu) ---
  if (opt.type === "say") {
    pushBot(opt.reply);
    if (opt.next) go(opt.next);
    return;
  }

  // --- PART D: Handle "route" buttons (Goes to another page) ---
  if (opt.type === "route") {
    pushBot(opt.reply ?? "Got you.");
    navigate(opt.to);
    return;
  }

  // --- PART E: Handle "action" buttons (The Filtering Math) ---
  if (opt.type === "action" && opt.key === "fetch_yes") {
  const recipeSource =
  recipes && recipes.length > 0 ? recipes : ACTUAL_SPOONACULAR_RECIPES;
  console.log("BOT recipes:", recipes);
  console.log("BOT recipeFilter:", recipeFilter);
  console.log("BOT first recipe:", recipes[0]);

  const getNutrient = (r, name) =>
    r.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;

  if (!recipes || recipes.length === 0) {
    pushBot("I do not have recipes loaded yet. Go to the feed first so recipes can load, then come back.");
    return;
  }

  let filtered = recipes.filter((r) => {
    if (recipeFilter === "hp") return getNutrient(r, "Protein") >= 30;
    if (recipeFilter === "lc") return getNutrient(r, "Calories") <= 500;
    if (recipeFilter === "quick") return Number(r.readyInMinutes) <= 25;
    return true;
  });

  if (filtered.length === 0) {
    filtered = recipes;
  }

  const finalRecipe =
    filtered[Math.floor(Math.random() * filtered.length)];

  const prot = Math.round(getNutrient(finalRecipe, "Protein"));
  const cals = Math.round(getNutrient(finalRecipe, "Calories"));

  setMessages((prev) => [
    ...prev,
    {
      from: "bot",
      text: `Found one! "${finalRecipe.title}" has about ${prot}g protein and ${cals} calories. It takes ${finalRecipe.readyInMinutes || "unknown"} minutes to make.`,
      recipe: finalRecipe,
    },
  ]);

  if (opt.next) go(opt.next);
  return;
}
  }

  function handleReset() {
    setMessages([
      { from: "bot", text: `Reset. Pick a button and I’ll guide you.` },
    ]);
    setNode("root");
    setRecipeFilter(null);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Chatbot</div>
          <div style={styles.sub}>Please Select an Option.</div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.smallBtn} onClick={handleReset}>
            Reset
          </button>
          <button style={styles.smallBtn} onClick={() => navigate("/feed")}>
            Back to Feed
          </button>
        </div>
      </div>

      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                ...styles.bubble,
                ...(m.from === "bot" ? styles.botBubble : styles.userBubble),
              }}
            >
              <div style={styles.bubbleLabel}>
                {m.from === "bot" ? BOT_NAME : "You"}
              </div>
              <div>{m.text}</div>

              {/* This only shows the card if the bot returns a recipe */}
              {m.from === "bot" && m.recipe && (
                <BotRecipeCard recipe={m.recipe} />
              )}
            </div>
          ))}
        </div>

        <div style={styles.options}>
          {options.map((opt) => (
            <button
              key={opt.key}
              style={styles.optionBtn}
              onClick={() => handlePick(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div> 
  );
}
