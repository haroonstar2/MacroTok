/**
 * MealPlan.tsx
 * Meal planning page with integrated calendar and daily tracking
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Search } from 'lucide-react';
import { motion } from 'motion/react';
import '../styles/meal-plan.css';

const today = new Date();

interface Recipe {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipesByDay {
  [day: number]: Recipe[];
}

const GOAL_PRESETS = {
  deficit: 1800,
  maintenance: 2000,
  surplus: 2500,
};

type GoalMode = keyof typeof GOAL_PRESETS;

export default function MealPlan() {
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [recipesByDay, setRecipesByDay] = useState<RecipesByDay>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [recipeInput, setRecipeInput] = useState<Recipe>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [goalMode, setGoalMode] = useState<GoalMode>('deficit');

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar calculations
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

  // Helper functions
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

  function isToday(d: number) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === monthIndex &&
      today.getDate() === d
    );
  }

  function formatFullDate(day: number) {
    return `${MONTHS[monthIndex]} ${day}`;
  }

  function addRecipe(day: number, recipe: Recipe) {
    setRecipesByDay(prev => {
      const dayRecipes = prev[day] || [];

      if (dayRecipes.length >= 3) {
        alert('You can only add up to 3 recipes per day.');
        return prev;
      }

      return {
        ...prev,
        [day]: [...dayRecipes, recipe],
      };
    });
  }

  function removeRecipe(day: number, index: number) {
    setRecipesByDay(prev => {
      const updated = (prev[day] || []).filter((_, i) => i !== index);
      const result = { ...prev };
      if (updated.length === 0) delete result[day];
      else result[day] = updated;
      return result;
    });
  }

  function getDailyTotals(day: number) {
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

  const totals = getDailyTotals(activeDay);
  const dayRecipes = recipesByDay[activeDay] || [];
  const dailyGoal = GOAL_PRESETS[goalMode];

  return (
    <div className="meal-plan-wrapper">
      {/* Calendar Card */}
      <div className="meal-plan-card">
        {/* Header */}
        <div className="meal-plan-header">
          <div className="header-left">
            <button className="icon-btn" onClick={prevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="month-title">
              {MONTHS[monthIndex]} {year}
            </h2>

            <button className="icon-btn" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button className="add-recipe-btn" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Schedule Recipe
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid weekdays">
          {WEEKDAYS.map(d => (
            <div key={d} className="weekday-label">{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {monthGrid.map((d, i) => {
            if (d === null)
              return <div key={i} className="calendar-day empty"></div>;

            const selected = d === activeDay;
            const dots = recipesByDay[d] || [];

            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`calendar-day ${selected ? 'selected' : ''} ${
                  isToday(d) && !selected ? 'today' : ''
                }`}
                onClick={() => setActiveDay(d)}
              >
                <div className="day-number">{d}</div>
                <div className="recipe-dots">
                  {dots.map((_, idx) => (
                    <span key={idx} className="dot" />
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Add Recipe Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="recipe-modal">
              <div className="modal-header">
                <h3 className="modal-title">Add Recipe for {formatFullDate(activeDay)}</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="modal-body">
                <input
                  className="recipe-input"
                  placeholder="Recipe name..."
                  value={recipeInput.name}
                  onChange={(e) =>
                    setRecipeInput({ ...recipeInput, name: e.target.value })
                  }
                />

                <div className="macro-inputs">
                  <input
                    type="number"
                    className="macro-input"
                    placeholder="Calories"
                    value={recipeInput.calories || ''}
                    onChange={(e) =>
                      setRecipeInput({ ...recipeInput, calories: Number(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    className="macro-input"
                    placeholder="Protein (g)"
                    value={recipeInput.protein || ''}
                    onChange={(e) =>
                      setRecipeInput({ ...recipeInput, protein: Number(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    className="macro-input"
                    placeholder="Carbs (g)"
                    value={recipeInput.carbs || ''}
                    onChange={(e) =>
                      setRecipeInput({ ...recipeInput, carbs: Number(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    className="macro-input"
                    placeholder="Fat (g)"
                    value={recipeInput.fat || ''}
                    onChange={(e) =>
                      setRecipeInput({ ...recipeInput, fat: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button
                    className="save-btn"
                    onClick={() => {
                      if (recipeInput.name && recipeInput.calories) {
                        addRecipe(activeDay, recipeInput);
                        setShowAddModal(false);
                        setRecipeInput({
                          name: '',
                          calories: 0,
                          protein: 0,
                          carbs: 0,
                          fat: 0,
                        });
                      }
                    }}
                  >
                    Save Recipe
                  </button>
                  <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Summary */}
        {activeDay && dayRecipes.length > 0 && (
          <div className="daily-summary">
            <h3 className="summary-title">Recipes for {formatFullDate(activeDay)}</h3>
            {dayRecipes.map((r, index) => (
              <div key={index} className="recipe-item">
                <div className="recipe-info">
                  <strong className="recipe-name">{r.name}</strong>
                  <div className="recipe-macros">
                    <span>{Math.round(r.calories)} cal</span>
                    <span>{Math.round(r.protein)}g protein</span>
                    <span>{Math.round(r.carbs)}g carbs</span>
                    <span>{Math.round(r.fat)}g fat</span>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeRecipe(activeDay, index)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Daily Goals */}
        {activeDay && (
          <div className="goals-section">
            <h3 className="goals-title">Daily Macros • {formatFullDate(activeDay)}</h3>

            <div className="intake-box">
              <h4 className="intake-title">Daily Intake</h4>

              <div className="intake-display">
                <strong>{totals.calories}</strong> / {dailyGoal} kcal
              </div>

              {/* Progress bar */}
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.round((totals.calories / dailyGoal) * 100))}%`,
                    background: totals.calories < dailyGoal ? '#4f39f6' : '#dc2626',
                  }}
                />
              </div>

              <div className="goal-status">
                {totals.calories < dailyGoal &&
                  `Deficit ${dailyGoal - totals.calories} kcal`}
                {totals.calories === dailyGoal && 'On Target'}
                {totals.calories > dailyGoal &&
                  `Surplus ${totals.calories - dailyGoal} kcal`}
              </div>

              {/* Goal selector buttons */}
              <div className="goal-selector">
                <button
                  className={goalMode === 'deficit' ? 'active' : ''}
                  onClick={() => setGoalMode('deficit')}
                >
                  Deficit
                </button>
                <button
                  className={goalMode === 'maintenance' ? 'active' : ''}
                  onClick={() => setGoalMode('maintenance')}
                >
                  Maintenance
                </button>
                <button
                  className={goalMode === 'surplus' ? 'active' : ''}
                  onClick={() => setGoalMode('surplus')}
                >
                  Surplus
                </button>
              </div>
            </div>

            <div className="macro-breakdown">
              Total: {Math.round(totals.calories)} kcal • Protein:{' '}
              {Math.round(totals.protein)}g • Carbs: {Math.round(totals.carbs)}g • Fat:{' '}
              {Math.round(totals.fat)}g
            </div>
          </div>
        )}
      </div>
    </div>
  );
}