// frontend/src/app/bot/ButtonBot.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRecipesStore from "../../store/recipeStore";
import { BOT_NAME, botStyles as styles, getOptionsForNode } from "./BotData";
import BotRecipeCard from "./BotRecipeCard";


export default function ButtonBot() {
  const navigate = useNavigate();
  const recipes = useRecipesStore((state) => state.recipes);

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
    // Helper to dig into your nested API data
    // Inside handlePick, under if (opt.key === "fetch_yes")
const getNutrient = (r, name) => 
  r.nutrition?.nutrients?.find((n) => n.name === name)?.amount ?? 0;

// This looks through EVERYTHING currently in your Feed store
let filtered = recipes.filter(r => {
  if (recipeFilter === "hp") return getNutrient(r, "Protein") >= 30;
  if (recipeFilter === "lc") return getNutrient(r, "Calories") <= 500;
  if (recipeFilter === "quick") return r.readyInMinutes <= 25;
  return true;
});

    const finalRecipe = filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)] 
      : null;

    if (finalRecipe) {
      const prot = Math.round(getNutrient(finalRecipe, "Protein"));
      const cals = Math.round(getNutrient(finalRecipe, "Calories"));
      
      setMessages((prev) => [
        ...prev,
        { 
          from: "bot", 
          text: `Found one! "${finalRecipe.title}" has ${prot}g protein and ${cals} calories. It only takes ${finalRecipe.readyInMinutes} minutes to make.`, 
          recipe: finalRecipe 
        }
      ]);
    } else {
      pushBot("I couldn't find a match! Try scrolling the feed to load more recipes first.");
    }

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


