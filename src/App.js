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
 * Uses React Router for navigation and a global light/dark theme.
 * ------------------------------------------------------------
 */

/**
 * App.jsx
 * ------------------------------------------------------------
 * MacroTok — Main Application Component
 * ------------------------------------------------------------
 */

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";

import Calendar from "./components/Calendar";
import Goal from "./components/Goal";
import Landing from "./components/Landing";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import RecipeDetail from "./components/RecipeDetail";
import { RECIPES } from "./data/recipes";
import "./components/sidebar.css";
import "./App.css";

// ---------------- Planner Page ----------------

function PlannerPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [mealData, setMealData] = useState({
    breakfast: { calories: 0 },
    lunch: { calories: 0 },
    dinner: { calories: 0 },
  });
  const navigate = useNavigate();

  const loadDeficitExample = () => {
    setMealData({
      breakfast: { calories: 500 },
      lunch: { calories: 600 },
      dinner: { calories: 400 },
    });
  };

  const loadSurplusExample = () => {
    setMealData({
      breakfast: { calories: 700 },
      lunch: { calories: 800 },
      dinner: { calories: 600 },
    });
  };

  const clearMeals = () => {
    setMealData({
      breakfast: { calories: 0 },
      lunch: { calories: 0 },
      dinner: { calories: 0 },
    });
  };

  // hook sidebar buttons into routes
  const handleSidebarNav = (id) => {
    switch (id) {
      case "home":
        navigate("/feed");
        break;
      case "plan":
        navigate("/calendar");
        break;
      default:
        // you can wire saved/trending/community later
        break;
    }
  };

  return (
    <div className="layout">
      <Sidebar active="plan" onNav={handleSidebarNav} />

      <div className="layout-main">
        <div className="planner-header">
          <h1>MacroTok</h1>
          <div className="planner-header__actions">
            <button className="btn btn--outline" onClick={() => navigate("/")}>
              Back to Landing
            </button>
            <button
              className="btn btn--outline"
              onClick={() => navigate("/feed")}
            >
              Open Feed
            </button>
          </div>
        </div>

        <div className="planner-buttons">
          <button className="cal-btn" onClick={loadDeficitExample}>
            Example: Deficit
          </button>
          <button className="cal-btn" onClick={loadSurplusExample}>
            Example: Surplus
          </button>
          <button className="cal-btn" onClick={clearMeals}>
            Clear
          </button>
        </div>

        <Calendar
          activeDay={selectedDay}
          onPickDay={setSelectedDay}
          onDayMealsChange={setMealData}
        />
        <Goal dailyGoal={1900} mealData={mealData} />
      </div>
    </div>
  );
}

// --------------- Recipe Page ------------------

function RecipePage() {
  const { id } = useParams();
  const recipe = RECIPES.find((r) => String(r.id) === String(id));
  const navigate = useNavigate();

  return <RecipeDetail recipe={recipe} onBack={() => navigate(-1)} />;
}

// --------------- App (Global Theme) ----------

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // apply/remove .dark on <html> so all CSS variables switch
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className={isDark ? "app app--dark" : "app app--light"}>
      <Router>
        {/* Global theme toggle – floating, doesn't push content down */}
        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-toggle__btn">
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/calendar" element={<PlannerPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </Router>
    </div>
  );
}
