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
import SettingsPage from "./app/profile/SettingsPage";
import LikedPage from "./app/liked/LikedPage"; 
import useRecipesStore from "./store/recipeStore";
import "./app/sidebar/sidebar.css";
import "./App.css";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  let active = "home";
  if (location.pathname.startsWith("/calendar")) active = "plan";
  if (location.pathname.startsWith("/liked")) active = "liked";

  const handleSidebarNav = (id) => {
    switch (id) {
      case "home":
        navigate("/feed");
        break;
      case "plan":
        navigate("/calendar");
        break;
      case "liked":
        navigate("/liked");
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

function PlannerPage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  return (
    <Calendar activeDay={selectedDay} onPickDay={setSelectedDay} />
  );
}

function RecipePage() {
  const { id } = useParams();
  const recipes = useRecipesStore((state) => state.recipes);
  const recipe = recipes.find((r) => String(r.id) === String(id));
  const navigate = useNavigate();

  if (!recipe) return <div>Loading...</div>;
  return <RecipeView recipe={recipe} onBack={() => navigate(-1)} />;
}

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className={isDark ? "app app--dark" : "app app--light"}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<MacroTokLogin />}/>
          <Route path="/settings" element={<SettingsPage/>} />

          <Route element={<AppLayout/>}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/calendar" element={<PlannerPage />} />
            <Route path="/liked" element={<LikedPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}