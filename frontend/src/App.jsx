import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Outlet,
  useLocation,
} from "react-router-dom";

import MacroTokLogin from "./app/login/MacroTokLogin";
import Calendar from "./app/calendar/Calendar";
import Landing from "./app/landing/Landing";
import Feed from "./app/feed/Feed";
import Sidebar from "./app/sidebar/Sidebar";
import RecipeView from "./app/recipes/RecipeView";
import SettingsPage from "./app/profile/SettingsPage";
import LikedPage from "./app/liked/LikedPage";
import useRecipesStore from "./store/recipeStore";
import Bot from "./app/bot/ButtonBot";
import { CartProvider } from "./context/cartcontext";
import ShoppingPage from "./app/shopping/shoppingcart";
import Setup2FA from "./app/login/verify2fa"; // Or wherever your file is located


import "./app/sidebar/sidebar.css";
import "./App.css";

import UserProvider from "./UserContext";
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  const location = useLocation();
<<<<<<< HEAD
=======

  // This checks the current URL to tell the Sidebar which button to highlight
  const active = location.pathname.split('/')[1] || "home";

>>>>>>> ca5b7f2 (Andres' Updates NOT DONE)
  const navigate = useNavigate();

  let active = "home";
  if (location.pathname.startsWith("/calendar")) active = "plan";
  if (location.pathname.startsWith("/liked")) active = "liked";

  const handleSidebarNav = (id) => {
<<<<<<< HEAD
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
      case "settings":
        navigate("/settings");
        break;
      default:
        break;
    }
=======
  switch (id) {
    case "home":
      navigate("/feed");
      break;
    case "plan":
      navigate("/calendar");
      break;
    case "shopping":
      navigate("/shopping");
      break;
    case "settings":
      navigate("/settings");
      break;
    case "bot":
      navigate("/bot");
      break;
    default:
      break;
  }

>>>>>>> ca5b7f2 (Andres' Updates NOT DONE)
  };

  return (
    <div className="layout">
      <Sidebar active={active} onNav={handleSidebarNav} />
      <div className="layout-main">
        <Outlet />
      </div>
    </div>
  );
}

function PlannerPage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  return <Calendar activeDay={selectedDay} onPickDay={setSelectedDay} />;
}

function RecipePage() {
  const { id } = useParams();
  const recipes = useRecipesStore((state) => state.feedRecipes);
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
    <CartProvider>
      <Router>
<<<<<<< HEAD
        <UserProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<MacroTokLogin />} />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/feed" element={<Feed />} />
              <Route path="/calendar" element={<PlannerPage />} />
              <Route path="/liked" element={<LikedPage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
            </Route>
          </Routes>
        </UserProvider>
=======
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<MacroTokLogin />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/setup-2fa" element={<Setup2FA />} />
          <Route element={<AppLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/calendar" element={<PlannerPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/bot" element={<Bot />} />
          </Route>
        </Routes>
>>>>>>> ca5b7f2 (Andres' Updates NOT DONE)
      </Router>
    </CartProvider>
  </div>
);
}
