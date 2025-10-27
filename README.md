<<<<<<< Updated upstream
# MacroTok
=======
# MacroTok — Frontend (Calendar + Goal)

##  Quick Start
```bash
npm install
npm run dev       # or: npm start
ech Stack

React 18
framer-motion
lucide-react

Plain CSS (src/global.css)
App Overview
🗓️ Calendar
Handles the month view, day selection, and Add/Edit/Remove meal features.
Goal
Displays intake / dailyGoal with deficit/surplus color feedback in a progress bar.
Components & Props

<Calendar />
activeDay: number                // currently selected day (1..31)
onPickDay(day: number): void     // called when user clicks a day
onDayMealsChange(data: {         // emits calories for the selected day
  breakfast: { calories: number },
  lunch:     { calories: number },
  dinner:    { calories: number },
}): void

<Goal/>
dailyGoal: number
mealData: {
  breakfast: { calories: number },
  lunch:     { calories: number },
  dinner:    { calories: number },
}

State Shape (Frontend)
// Calendar keeps meals by day (names only; demo calories are mapped per slot)
mealsByDay: {
  [day: number]: {
    breakfast?: { name: string },
    lunch?: { name: string },
    dinner?: { name: string }
  }
}

API Contract (for Backend Team)
Base URL: ${VITE_API_BASE_URL}
GET /calendar?year=YYYY&month=MM
Returns month’s meals (per day)
{
  "days": {
    "21": { "breakfast": {"name":"Oatmeal","calories":500} }
  }
}
PUT /calendar/:date
Full replace for a day (YYYY-MM-DD).
{
  "breakfast":{"name":"Oatmeal","calories":500},
  "lunch":{"name":"Chicken Bowl","calories":700},
  "dinner":{"name":"Salmon & Veg","calories":600}
}
PATCH /calendar/:date
Partial update for one slot.
{
  "slot":"lunch",
  "data":{"name":"Chicken Bowl","calories":700}
}
DELETE /calendar/:date
Delete one slot or the whole day.
GET /goal
{ "dailyGoal": 1900 }
PUT /goal
{ "dailyGoal": 1900 }
Auth: TBD(to be determined) by backend. Frontend is ready to add Authorization header

Environment Variables
Copy .env.example → .env and set:
VITE_API_BASE_URL=http://localhost:4000
VITE_USE_MOCKS=true
When VITE_USE_MOCKS=true, the app runs using the local mock API for testing.

Folder Structure (Current Frontend)
src/
  App.js
  global.css
  components/
    Calendar.jsx
    Goal.jsx

    Backend Handoff
1. Implement the endpoints listed in the API Contract section.
2. Frontend will switch VITE_USE_MOCKS=false and use real API calls.
3. Add Authorization header once login/auth logic is defined.

Development Scripts
"scripts": {
  "scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}

>>>>>>> Stashed changes
