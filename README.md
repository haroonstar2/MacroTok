<<<<<<< Updated upstream
# MacroTok
=======
# MacroTok — Frontend (Calendar + Goal)
Overview

MacroTok is a React-based fitness & nutrition planner that helps users schedule meals, track calorie intake, and discover macro-balanced recipes — all in one clean interface.
this readME combines a Landing Page, Feed Page, Calendar Planner, Goal Tracker, and Recipe Detail View

Tech Stack
React 18
Vite
Plain CSS
Hooks + Component-based state management
No backend required (local mock recipe DB)
Optional API setup ready for expansion
##  Quick Start
```bash
npm install
npm run dev       # or: npm start (vite)

##Landing Page

Clean hero section with rotating food images every 5 seconds.
Theme toggle button for Light/Dark mode.
Smooth layout with feature highlights (“Schedule Recipes”, “Quick Add”, “Review Intake”).
CTA buttons for Open Calendar and See Features.
## Files
src/components/Landing.jsx
src/components/Landing.css

##Feed Page
Displays macro-balanced recipes in a modern 2-column grid.
Each card shows:
Image
Calories
Cooking time
Macronutrients (Protein, Carbs, Fats)
Like/Unlike button
Difficulty level
Ingredients as chips
 Clicking a card opens a detailed recipe page (from the local Recipe DB).
Responsive, shadowed cards with hover animations.
## Files
src/components/Feed.jsx
src/components/feed.css

#Recipe Database (Local “Mock DB”)
All recipes are stored locally in src/data/recipes.js.
Each entry includes:
{
  id: "grilled-chicken-salad-fruit",
  title: "Grilled Chicken Salad with Seasonal Fruit",
  img: "...",
  time: 30,
  calories: 468,
  protein: 52,
  carbs: 35,
  fats: 15,
  level: "Medium",
  ingredients: [...],
  steps: [...]
}
The app loads recipes dynamically from this file.
Clicking a recipe opens a RecipeDetail page showing full steps and ingredients.
#Files
src/data/recipes.js
src/components/RecipeDetail.jsx

##Calendar & Goal Tracker
Calendar displays the month view with active day selection.
Users can add, edit, or remove breakfast/lunch/dinner entries.
Goal component tracks total calorie intake versus daily goal (1900 kcal by default).
Includes Deficit, Surplus, and Clear demo buttons for quick examples.
##Files
src/components/Calendar.jsx
src/components/Goal.jsx

##Sidebar
Persistent navigation with icons for:
 Home
Search
 Meal Plan
Saved
Trending
Community
Profile section at the bottom with user avatar and quick link area.
Highlights the current page with green gradient.

##Files
src/components/Sidebar.jsx
src/components/sidebar.css


##Theme & Layout
Fully responsive design using plain CSS.
Uses custom variables (:root) for light and dark modes.
CSS organized per component for clarity.
App.jsx controls page routing via internal state (no router).

Project Structure
src/
 ├── App.jsx
 ├── data/
 │    └── recipes.js
 ├── components/
 │    ├── Landing.jsx / Landing.css
 │    ├── Feed.jsx / feed.css
 │    ├── Calendar.jsx
 │    ├── Goal.jsx
 │    ├── Sidebar.jsx / sidebar.css
 │    └── RecipeDetail.jsx
 ├── global.css
 

