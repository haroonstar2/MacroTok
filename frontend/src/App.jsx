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
  Outlet,
  useLocation
} from "react-router-dom";

import MacroTokLogin from "./app/login/MacroTokLogin"
import Calendar from "./app/calendar/Calendar";
import Goal from "./app/calendar/Goal";
import Landing from "./app/landing/Landing";
import Feed from "./app/feed/Feed";
import Sidebar from "./app/sidebar/Sidebar";
import RecipeView from "./app/recipes/RecipeView";
import Recipes from "./app/recipes/recipes"; // temp to component to check spoonacular connection
import useRecipesStore from "./store/recipeStore";
// import { RECIPES } from "./store/temp_recipes";
import { MOCK_SPOONACULAR_RECIPES } from "./store/mock_spoonacular_recipes";
import "./app/sidebar/sidebar.css";
import "./App.css";


// Layout component that renders the sidebar and the active tab. 
function AppLayout() {

  const location = useLocation();

  const active = location.pathname.startsWith("/calendar")
    ? "plan"
    : "home";

  const navigate = useNavigate();
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
        break;
    }
  };

  return (
    <div className="layout">
      <Sidebar active={active} onNav={handleSidebarNav}/>

      <div className="layout-main">
        <Outlet />
      </div>
    </div>
  );
}

// ---------------- Planner Page ----------------

function PlannerPage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [mealData, setMealData] = useState({
    breakfast: { calories: 0 },
    lunch: { calories: 0 },
    dinner: { calories: 0 },
  });
  
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

  return (
    <div className="layout">
      <div className="layout-main">

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

  const recipes = useRecipesStore((state) => state.recipes); // Get all recipes currently loaded

  const recipe = MOCK_SPOONACULAR_RECIPES.find((r) => String(r.id) === String(id));
  const navigate = useNavigate();

  return <RecipeView recipe={recipe} onBack={() => navigate(-1)} />;
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
          <Route path="/login" element={<MacroTokLogin />}/>

          <Route element={<AppLayout/>}>
            <Route path="/test" element={<Recipes/>} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/calendar" element={<PlannerPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}
