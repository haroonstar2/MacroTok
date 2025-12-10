import React, { useMemo, useState } from "react";
import "./global.css";
import "./calendar.css"
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";



const today = new Date();

export default function Calendar({ activeDay, onPickDay = () => {} }) {
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [recipesByDay, setRecipesByDay] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [recipeInput, setRecipeInput] = useState({
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: ""
});

  
  // Recipe Functions
  
const [goalMode, setGoalMode] = useState("deficit"); 

const GOAL_PRESETS = {
  deficit: 1800,
  maintenance: 2000,
  surplus: 2500
};

 async function searchRecipes(query) {
  if (!query || query.length < 2) return [];
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&addRecipeNutrition=true&apiKey=${import.meta.env.VITE_SPOON_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Spoonacular error:", err);
    return [];
  }
}

function extractNutrition(recipe) { //returns macros
  const calories = Math.round(
    recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount ?? 0
  );
  const protein = recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount ?? 0;
  const carbs = recipe.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount ?? 0;
  const fat = recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount ?? 0;
  return { calories, protein, carbs, fat };
}

function selectRecipe(recipe) {
  const { calories, protein, carbs, fat } = extractNutrition(recipe);

  setRecipeInput({
    name: recipe.title,
    calories,
    protein,
    carbs,
    fat
  });

  setSearchResults([]); // hide search results
}

  function addRecipe(day, recipe) {
    setRecipesByDay(prev => {
      const dayRecipes = prev[day] || [];

      if (dayRecipes.length >= 3) {
        alert("You can only add up to 3 recipes per day.");
        return prev;
      }

      return {
        ...prev,
        [day]: [...dayRecipes, recipe]
      };
    });
  }

  function getDailyTotals(day) {
  const dayRecipes = recipesByDay[day] || [];

  return dayRecipes.reduce(
    (sum, r) => ({
      calories: sum.calories + Number(r.calories || 0),
      protein: sum.protein + Number(r.protein || 0),
      carbs: sum.carbs + Number(r.carbs || 0),
      fat: sum.fat + Number(r.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}


  function editRecipe(day, index, newRecipe) {
    setRecipesByDay(prev => {
      const dayRecipes = prev[day] || [];
      dayRecipes[index] = { ...dayRecipes[index], ...newRecipe };
      return {
        ...prev,
        [day]: [...dayRecipes]
      };
    });
  }

  function removeRecipe(day, index) {
    setRecipesByDay(prev => {
      const updated = (prev[day] || []).filter((_, i) => i !== index);
      const result = { ...prev };
      if (updated.length === 0) delete result[day];
      else result[day] = updated;
      return result;
    });
  }

  // Calendar Math
  const daysInMonth = useMemo(
    () => new Date(year, monthIndex + 1, 0).getDate(),
    [year, monthIndex]
  );

  const firstWeekday = useMemo(
    () => new Date(year, monthIndex, 1).getDay(),
    [year, monthIndex]
  );

  const monthGrid = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [daysInMonth, firstWeekday]);

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

function formatFullDate(day) {
  return `${MONTHS[monthIndex]} ${day}`;
}


  const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  function prevMonth() {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(y => y - 1);
    } else {
      setMonthIndex(m => m - 1);
    }
  }

  function nextMonth() {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(y => y + 1);
    } else {
      setMonthIndex(m => m + 1);
    }
  }

  function isToday(d) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === monthIndex &&
      today.getDate() === d
    );
  }
  const totals = getDailyTotals(activeDay);
  const dayRecipes = recipesByDay[activeDay] || [];


  // RENDER
  return (
    <div className="cal-card">

      {/* Header */}
      <div className="cal-header">
        <div className="cal-header-left">
          <button className="cal-icon-btn" onClick={prevMonth}>
            <ChevronLeft />
          </button>

          <h2 className="cal-title">
            {MONTHS[monthIndex]} {year}
          </h2>

          <button className="cal-icon-btn" onClick={nextMonth}>
            <ChevronRight />
          </button>
        </div>

        <button className="cal-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Recipe
        </button>
      </div>

      {/* Grid */}
      <div className="cal-grid cal-weekdays">
        {WEEKDAYS.map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}

        {monthGrid.map((d, i) => {
          if (d === null)
            return <div key={i} className="cal-day cal-day-empty"></div>;

          const selected = d === activeDay;
          const dots = recipesByDay[d] || [];

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`cal-day ${selected ? "cal-day-selected" : ""} ${
                isToday(d) && !selected ? "cal-day-today" : ""
              }`}
              onClick={() => onPickDay(d)}
            >
              <div className="day-number">{d}</div>

              <div className="dots">
                {dots.map((_, i) => (
                  <span key={i} className="dot" />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
      {showAddModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Add Recipe for {formatFullDate(activeDay)}</h3>


      <input
  placeholder="Search recipe..."
  value={recipeInput.name}
  onChange={async (e) => {
    const q = e.target.value;
    setRecipeInput({ ...recipeInput, name: q });

    const results = await searchRecipes(q);
    setSearchResults(results);
  }}
/>

<div className="search-results">
  {searchResults.map(r => (
    <div 
      key={r.id}
      className="search-item"
      onClick={() => selectRecipe(r)}
    >
      {r.title}
    </div>
  ))}
</div>

{/* Display selected recipe macros */}
{recipeInput.name && (
  <div className="macro-box">
    <div><strong>Calories:</strong> {recipeInput.calories}</div>
    <div><strong>Protein:</strong> {recipeInput.protein} g</div>
    <div><strong>Carbs:</strong> {recipeInput.carbs} g</div>
    <div><strong>Fat:</strong> {recipeInput.fat} g</div>
  </div>
)}


      <button
        className="cal-primary"
        onClick={() => {
          // save recipe
          addRecipe(activeDay, recipeInput);

          // close modal
          setShowAddModal(false);

          // reset inputs
          setRecipeInput({
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: ""
          });
        }}
      >
        Save Recipe
      </button>

      <button className="cal-btn" onClick={() => setShowAddModal(false)}>
        Cancel
      </button>
    </div>
  </div>
)}


{activeDay && dayRecipes.length > 0 && (
  <div className="day-summary-box">
    {dayRecipes.map((r, index) => (
      <div key={index} className="summary-recipe">
        <strong>{r.name}</strong>
        <div className="summary-macros">
          <span>{Math.round(r.calories)} cal</span>
          <span>{Math.round(r.protein)}g protein</span>
          <span>{Math.round(r.carbs)}g carbs</span>
          <span>{Math.round(r.fat)}g fat</span>
        </div>
      </div>
    ))}
    
<div className="summary-totals">
  <strong>Daily Total</strong>

  <div className="summary-macros">
    <span>{totals.calories} cal</span>
    <span>{Math.round(totals.protein)}g protein</span>
    <span>{Math.round(totals.carbs)}g carbs</span>
    <span>{Math.round(totals.fat)}g fat</span>
  </div>
</div>


  </div>
)}


{activeDay && (
  <div className="macro-summary-card">
    <h3 className="macro-summary-title">
      Daily Macros • {formatFullDate(activeDay)}
    </h3>

    <div className="daily-intake-box">
  <h3>Daily Intake</h3>

  <div className="daily-kcals">
    <strong>{totals.calories}</strong> / {GOAL_PRESETS[goalMode]} kcal
  </div>

  {/* Progress bar from goals.jsx */}
<div className="goal-bar">
  <div
    className="goal-bar-fill"
    style={{
      width: `${Math.min(
        100,
        Math.round((totals.calories / GOAL_PRESETS[goalMode]) * 100)
      )}%`,
      background:
        totals.calories < GOAL_PRESETS[goalMode] ? "#16a34a" : "#dc2626",
      transition: "width 0.4s ease, background 0.4s ease",
    }}
  />
</div>

  <div className="goal-status">
  {totals.calories < GOAL_PRESETS[goalMode] &&
    `Deficit ${GOAL_PRESETS[goalMode] - totals.calories} kcal`}

  {totals.calories === GOAL_PRESETS[goalMode] &&
    "On Target"}

  {totals.calories > GOAL_PRESETS[goalMode] &&
    `Surplus ${totals.calories - GOAL_PRESETS[goalMode]} kcal`}
</div>


  <div className="goal-selector">
    <button 
      className={goalMode === "deficit" ? "active" : ""}
      onClick={() => setGoalMode("deficit")}
    >
      Deficit
    </button>

    <button 
      className={goalMode === "maintenance" ? "active" : ""}
      onClick={() => setGoalMode("maintenance")}
    >
      Maintenance
    </button>

    <button 
      className={goalMode === "surplus" ? "active" : ""}
      onClick={() => setGoalMode("surplus")}
    >
      Surplus
    </button>
  </div>
</div>
    <div className="meal-breakdown">
  Total: {Math.round(totals.calories)} kcal ·
  Protein: {Math.round(totals.protein)}g ·
  Carbs: {Math.round(totals.carbs)}g ·
  Fat: {Math.round(totals.fat)}g
</div>

  </div>
)}
    </div>
  );
}