import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { likePost, unlikePost } from "../../api/likesApi.js";
import { addRecipeToDate, removeRecipeFromDate, getScheduledEntriesForRecipe } from "../../api/calendar.js";
import { CalendarDays } from "lucide-react";
import "./recipe.css";

// --- Logic Helpers ---
function getDifficulty(recipe) {
  const time = recipe.readyInMinutes;
  const ingredients = recipe?.extendedIngredients?.length ?? 0;
  const steps = recipe?.analyzedInstructions?.[0]?.steps?.length ?? 0;

  let score = 0;
  if (time > 30) score++;
  if (ingredients > 10) score++;
  if (steps > 6) score++;

  if (score === 0) return "Easy";
  if (score === 1) return "Medium";
  return "Hard";
}

// --- Small UI Components ---
function Chip({ children }) {
  return <span className="chip">{children}</span>;
}

function StatBar({ label, value, unit, variant }) {
  return (
    <div className={`stat ${variant ? `progress--${variant}` : ""}`}>
      <div className="stat-row">
        <span className="stat-label">{label}</span>
        <span className="stat-value">
          {Math.trunc(value || 0)} {unit}
        </span>
      </div>
      <div className={`progress ${variant ? `progress--${variant}` : ""}`}>
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, ((value || 0) / 70) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function DifficultyTag({ level }) {
  const tone = {
    Easy: "#27c07d",
    Medium: "#f2a93b",
    Hard: "#ef5350",
  }[level] || "#27c07d";

  return (
    <span className="difficulty" style={{ background: tone }}>
      {level}
    </span>
  );
}

function HeartButton({ recipe, initiallyLiked }) {
  const [liked, setLiked] = useState(initiallyLiked);

  useEffect(() => {
    setLiked(initiallyLiked);
  }, [initiallyLiked]);

  const handleClick = async (e) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);

    try {
      if (newLikedState) {
        await likePost(recipe);
      } else {
        await unlikePost(recipe.id);
      }
    } catch (err) {
      console.error("Failed to sync like:", err);
      setLiked(!newLikedState);
    }
  };

  return (
    <button className={`heart ${liked ? "liked" : ""}`} onClick={handleClick}>
      {liked ? "❤️" : "🤍"}
    </button>
  );
}

// --- The Recipe Card Component ---
export default function RecipeCard({
  recipe,
  initiallyLiked,
  initiallyScheduled,
  scheduledDate: propDate,
  scheduledSlot: propSlot,
  onRemove,
}) {
  const navigate = useNavigate();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddNew, setShowAddNew]         = useState(false);
  const [isScheduled, setIsScheduled]       = useState(initiallyScheduled);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // All {date, slot} pairs where this recipe is currently scheduled
  const [scheduledEntries, setScheduledEntries] = useState(
    propDate && propSlot ? [{ date: propDate, slot: propSlot }] : []
  );

  // State for the "add to another day" form
  const [newEntry, setNewEntry] = useState({ date: "", slot: "breakfast" });

  // Extract details safely for rendering and storage
  const recipeDetails = {
    id: recipe.id,
    title: recipe.title,
    calories: recipe.calories || Math.round(recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount ?? 0),
    readyInMinutes: recipe.readyInMinutes || 0,
    image: recipe.image,
    protein: recipe.protein || recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount,
    carbs: recipe.carbs || recipe.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount,
    fats: recipe.fats || recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount,
    ingredients: recipe.extendedIngredients?.map(i => i.original) || [],
    level: recipe.level || getDifficulty(recipe)
  };

  // Sync state when props change (e.g. parent refreshes)
  useEffect(() => {
    setIsScheduled(initiallyScheduled);
    if (propDate && propSlot) {
      setScheduledEntries([{ date: propDate, slot: propSlot }]);
    } else if (!initiallyScheduled) {
      setScheduledEntries([]);
    }
  }, [initiallyScheduled, propDate, propSlot]);

  /**
   * Calendar icon click:
   *  - Blue (scheduled)  → fetch/show existing entries + "Add to another day" option
   *  - White (unscheduled) → show the add-date picker directly
   */
  const handleCalendarClick = async (e) => {
    e.stopPropagation();

    if (isScheduled) {
      // Lazy-load entries when we don't have them (e.g. Feed page)
      if (scheduledEntries.length === 0) {
        setLoadingEntries(true);
        const entries = await getScheduledEntriesForRecipe(recipe.id);
        setLoadingEntries(false);

        if (entries.length === 0) {
          // Stale flag — nothing actually stored; reset to white
          setIsScheduled(false);
          return;
        }
        setScheduledEntries(entries);
      }
      setShowDatePicker(true);
      setShowAddNew(false);
      return;
    }

    // Not scheduled – toggle the add picker
    setShowDatePicker(prev => !prev);
    setShowAddNew(false);
  };

  /**
   * Remove one specific {date, slot} entry.
   * If all entries removed → icon turns white.
   */
  const handleRemoveEntry = async (e, dateISO, slot) => {
    e.stopPropagation();
    try {
      await removeRecipeFromDate(recipe, dateISO, slot);

      const remaining = scheduledEntries.filter(
        entry => !(entry.date === dateISO && entry.slot === slot)
      );
      setScheduledEntries(remaining);

      if (remaining.length === 0) {
        setIsScheduled(false);
        setShowDatePicker(false);
        setShowAddNew(false);
      }

      if (onRemove) onRemove();
    } catch (err) {
      console.error("Failed to remove recipe from calendar:", err);
    }
  };

  /**
   * Add to a new date/slot.
   */
  const handleConfirmSave = async (e) => {
    e.stopPropagation();
    if (!newEntry.date) return alert("Please select a date");

    try {
      await addRecipeToDate(recipe, newEntry.date, newEntry.slot);
      setScheduledEntries(prev => [...prev, { date: newEntry.date, slot: newEntry.slot }]);
      setIsScheduled(true);
      setShowDatePicker(false);
      setShowAddNew(false);
      setNewEntry({ date: "", slot: "breakfast" });
    } catch (err) {
      console.error("Calendar save error:", err);
    }
  };

  const closePicker = (e) => {
    e.stopPropagation();
    setShowDatePicker(false);
    setShowAddNew(false);
  };

  return (
    <div className="card-link" onClick={() => navigate(`/recipe/${recipeDetails.id}`)}>
      <article className="card">
        <div className="card-media">
          <img src={recipeDetails.image} alt={recipeDetails.title} />

          <div className="card-actions">
            <button
              className={`calendar-trigger ${isScheduled ? "scheduled" : ""}`}
              onClick={handleCalendarClick}
              title={isScheduled ? "View / edit schedule" : "Add to calendar"}
            >
              <CalendarDays size={18} strokeWidth={2} />
            </button>
            <HeartButton recipe={recipe} initiallyLiked={initiallyLiked} />
          </div>

          {/* Date Picker Popover */}
          {showDatePicker && (
            <div className="date-picker-popover" onClick={(e) => e.stopPropagation()}>

              {/* ── Section 1: existing schedule entries ── */}
              {isScheduled && (
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: "bold", display: "block", marginBottom: 4 }}>
                    Already scheduled:
                  </label>

                  {loadingEntries ? (
                    <p style={{ fontSize: 12, margin: 0 }}>Loading…</p>
                  ) : scheduledEntries.length === 0 ? (
                    <p style={{ fontSize: 12, margin: 0, color: "#888" }}>No entries found.</p>
                  ) : (
                    scheduledEntries.map(({ date, slot }) => (
                      <div
                        key={`${date}-${slot}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                          padding: "4px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#333" }}>
                          📅 {date} &bull; {slot.charAt(0).toUpperCase() + slot.slice(1)}
                        </span>
                        <button
                          onClick={(e) => handleRemoveEntry(e, date, slot)}
                          style={{
                            padding: "3px 8px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 11,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}

                  <div style={{ margin: "10px 0 6px", borderTop: "1px solid #e5e5e5" }} />

                  {/* Toggle "Add to another day" */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAddNew(prev => !prev); }}
                    style={{
                      width: "100%",
                      padding: "6px 0",
                      background: "#1d4ed8",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {showAddNew ? "Cancel" : "+ Add to another day"}
                  </button>
                </div>
              )}

              {/* ── Section 2: add form (always visible when not scheduled, or toggled when scheduled) ── */}
              {(!isScheduled || showAddNew) && (
                <div style={{ marginTop: isScheduled ? 6 : 0 }}>
                  <label style={{ fontSize: 12, fontWeight: "bold" }}>Date:</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <label style={{ fontSize: 12, fontWeight: "bold", marginTop: 5 }}>Meal Slot:</label>
                  <select
                    value={newEntry.slot}
                    onChange={(e) => setNewEntry({ ...newEntry, slot: e.target.value })}
                    style={{ padding: 5, borderRadius: 4, border: "1px solid #ccc" }}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>

                  <button
                    onClick={handleConfirmSave}
                    style={{
                      marginTop: 10,
                      padding: 8,
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Save to Plan
                  </button>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={closePicker}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "4px 0",
                  background: "transparent",
                  color: "#888",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 11,
                }}
              >
                Close
              </button>
            </div>
          )}

          <div className="overlay"><DifficultyTag level={recipeDetails.level} /></div>
        </div>

        <div className="card-body">
          <h3 className="card-title">{recipeDetails.title}</h3>
          <div className="meta">
            <span>🔥 {Math.trunc(recipeDetails.calories)} calories</span>
            <span>• ⏱ {recipeDetails.readyInMinutes} min</span>
          </div>
          <div className="stats">
            <StatBar label="Protein" value={recipeDetails.protein} unit="g" variant="protein" />
            <StatBar label="Carbs" value={recipeDetails.carbs} unit="g" variant="carbs" />
            <StatBar label="Fats" value={recipeDetails.fats} unit="g" variant="fats" />
          </div>
          <div className="keys">
            <p className="keys-title">Key Ingredients</p>
            <div className="chips">
              {recipeDetails.ingredients.slice(0, 5).map((k, idx) => <Chip key={idx}>{k}</Chip>)}
              {recipeDetails.ingredients.length > 5 && (
                <Chip>+{recipeDetails.ingredients.length - 5} more</Chip>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
