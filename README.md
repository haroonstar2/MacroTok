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
backend/
├──api/
├──src/
   ├──api/
   ├──hello/
firebase/
├── config.js
frontend/
├──src/
│   ├── App.jsx
│   ├── data/
│   │    └── recipes.js
│   ├── components/
│   │    ├── Landing.jsx / Landing.css
│   ├── Feed.jsx / feed.css
│   │    ├── Calendar.jsx
│   │    ├── Goal.jsx
│   │    ├── Sidebar.jsx / sidebar.css
│   │    └── RecipeDetail.jsx
├── global.css
```
## Scrum Updates

**October 30 - November 13. 2025**

This cycle was focused on converting the Figma mock-ups into code, integrating the Spoonacular API functionality, and supporting basic account management through Firebase. Roles this cycle were the same as last cycle. 

Fiyori focused on the high priority web pages, such as the calendar, landing, and home feed pages, using static data. Basic navigation through the pages and light and dark mode were added as well. Mahmoud continued to work on converting the login and signup pages and adding them to the repository. Harika finished most of the Firebase account integration. Adrian created a class to fetch data from the Spoonacular API and display that data onto the feed tiles. Andres created a test file to call the Spoonacular API. He is working on storing this data inside a Firebase database so we can circumvent the 50 API call limit. Haroon focused on merging new commits into the development branch and writing test documentation.

The goals for the next cycle are:
- Create secure databases to store user and recipe data
- Use the Tile class to call the database and display information
- Finalize and push the Firebase account  and database code
- Add backend functionality to the frontend

**October 16-30, 2025**

This cycle was focused on assigning roles and responsibilities to the team members, designing UI, and setting up the repository for future development. Roles were delegated as follows. 

Haroon was designated as the team lead. He would be responsible for generating documentation, creating pull requests, and guiding members to the next action. Fiyori and Mahmoud were in charge of creating mock-up designs of the different pages in our app. Andres researched several APIs for gathering our recipes and listed the advantages and disadvantages of each service. Adrian and Harika were responsible for integrating Firebase into the project. Harika handled user authentication and integrated it into temporary pages to test functionality. Adrian worked on the Google sign-in functionality.

Fiyori created the design for the landing, calendar, and home pages. Mahmoud created a sign-in page. Andres decided the Spoonacular API would be the best fit for our project. He created a recipe page that calls the API and displays the information. Harika completed the user authentication and Google sign-in functionality. Adrian started creating a class to take data from the Spoonacular API and display it in a React component. Haroon established the repository with a file structure for easy organization and merged Fiyori’s and Andres’ commits into the development branch.

The goals for the next cycle are:
- Incorporate the Firebase functionality, the settings page, and card page into the development branch
- Start adding functionality to the frontend components


