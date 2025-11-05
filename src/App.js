/**
 * App.jsx
 * ------------------------------------------------------------
 * MacroTok — Main Application Component
 *
 * Handles navigation between:
 *   1. Landing Page
 *   2. Feed Page
 *   3. Planner Page (Calendar + Goal Tracker)
 *
 * Uses simple React state to switch views instead of routing.
 * ------------------------------------------------------------
 */

import React, { useState } from "react";

import Calendar from "./components/Calendar";
import Goal from "./components/Goal";
import Landing from "./components/Landing";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import RecipeDetail from "./components/RecipeDetail";
import { RECIPES } from "./data/recipes";
import "./components/sidebar.css";

export default function App() {
  // ✅ ALWAYS call hooks at the top, unconditionally
  const [view, setView] = useState("landing"); // "landing" | "planner" | "feed"
  const [selectedDay, setSelectedDay] = useState(1);
  const [mealData, setMealData] = useState({
    breakfast: { calories: 0 },
    lunch: { calories: 0 },
    dinner: { calories: 0 },
  });

  // Demo helpers (safe; not hooks)
  function loadDeficitExample() {
    setMealData({
      breakfast: { calories: 500 },
      lunch: { calories: 600 },
      dinner: { calories: 400 },
    });
  }
  function loadSurplusExample() {
    setMealData({
      breakfast: { calories: 700 },
      lunch: { calories: 800 },
      dinner: { calories: 600 },
    });
  }

  // Detect ?recipe=... AFTER hooks are declared
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("recipe");
  if (recipeId) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    const onBack = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("recipe");
      window.history.replaceState({}, "", url.toString());
      // optional: go to feed
      // setView("feed");
    };
    return <RecipeDetail recipe={recipe} onBack={onBack} />;
  }

  // ---- LANDING ----
  if (view === "landing") {
    return (
      <>
        <Landing />
        <div
          style={{
            textAlign: "center",
            margin: "20px 0 40px",
            display: "flex",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <button className="btn btn--filled" onClick={() => setView("planner")}>
            Open Calendar
          </button>
          <button className="btn btn--outline" onClick={() => setView("feed")}>
            Open Feed
          </button>
        </div>
      </>
    );
  }

  // ---- FEED ----
  if (view === "feed") {
    return (
      <div className="layout">
        <Sidebar
          active="home"
          onNav={(id) => {
            if (id === "home") setView("feed");
            if (id === "plan") setView("planner");
            if (id === "search") setView("feed");
            if (id === "saved") setView("feed");
            if (id === "trending") setView("feed");
            if (id === "community") setView("feed");
          }}
        />
        <div className="main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h1 style={{ margin: 0 }}>MacroTok</h1>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn--outline" onClick={() => setView("landing")}>
                Back to Landing
              </button>
              <button className="btn btn--filled" onClick={() => setView("planner")}>
                Go to Calendar
              </button>
            </div>
          </div>
          <Feed />
        </div>
      </div>
    );
  }

  // ---- PLANNER (Calendar + Goal) ----
  return (
    <div className="layout">
      <Sidebar
        active="plan"
        onNav={(id) => {
          if (id === "home") setView("feed");
          if (id === "plan") setView("planner");
          if (id === "search") setView("feed");
          if (id === "saved") setView("feed");
        }}
      />
      <div className="main" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>MacroTok</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--outline" onClick={() => setView("landing")}>
              Back to Landing
            </button>
            <button className="btn btn--outline" onClick={() => setView("feed")}>
              Open Feed
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "12px 0 20px" }}>
          <button className="cal-btn" onClick={loadDeficitExample}>
            Example: Deficit
          </button>
          <button className="cal-btn" onClick={loadSurplusExample}>
            Example: Surplus
          </button>
          <button
            className="cal-btn"
            onClick={() =>
              setMealData({
                breakfast: { calories: 0 },
                lunch: { calories: 0 },
                dinner: { calories: 0 },
              })
            }
          >
            Clear
          </button>
        </div>

        <div style={{ marginBottom: 40 }}>
          <Calendar
            activeDay={selectedDay}
            onPickDay={setSelectedDay}
            onDayMealsChange={setMealData}
          />
        </div>

        <Goal dailyGoal={1900} mealData={mealData} />
      </div>
    </div>
  );
}
