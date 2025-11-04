import React, { useState } from "react";
import { Routes, Route, useNavigate} from "react-router-dom";

import Calendar from "./app/calendar/Calendar";
import Goal from "./app/calendar/Goal"
import Recipes from "./app/recipes/recipes";

export default function App() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);

  // Goal consumes this
  const [mealData, setMealData] = useState({
    breakfast: { calories: 0 },
    lunch:     { calories: 0 },
    dinner:    { calories: 0 },
  });

  // Quick demo presets for your team
  function loadDeficitExample() {
    // 500 + 600 + 400 = 1500 (deficit vs 1900)
    setMealData({
      breakfast: { calories: 500 },
      lunch:     { calories: 600 },
      dinner:    { calories: 400 },
    });
  }
  function loadSurplusExample() {
    // 700 + 800 + 600 = 2100 (surplus vs 1900)
    setMealData({
      breakfast: { calories: 700 },
      lunch:     { calories: 800 },
      dinner:    { calories: 600 },
    });
  }

  return (
    <Routes>
      <Route path="/" element={
        <div style={{ padding: 20 }}>
          <h1>MacroTok</h1>
          <p onClick={() => navigate("/app/recipes")}>Recipes</p>

          {/* Demo buttons just to show intent to your team */}
          <div style={{ display: "flex", gap: 8, margin: "12px 0 20px" }}>
            <button className="cal-btn" onClick={loadDeficitExample}>Example: Deficit</button>
            <button className="cal-btn" onClick={loadSurplusExample}>Example: Surplus</button>
            <button className="cal-btn" onClick={() => setMealData({ breakfast:{calories:0}, lunch:{calories:0}, dinner:{calories:0} })}>
              Clear
            </button>
          </div>

          <div style={{ marginBottom: 40 }}>
            <Calendar
              activeDay={selectedDay}
              onPickDay={setSelectedDay}
              onDayMealsChange={setMealData}  // Calendar updates Goal when meals change
              />
          </div>

          <Goal dailyGoal={1900} mealData={mealData} />
        </div>
        }/>

    {/* Recipes page */}
    <Route path="/app/recipes" element={<Recipes/>}/>
  </Routes>
  );
}
