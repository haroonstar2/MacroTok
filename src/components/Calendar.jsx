import React, { useMemo, useState } from "react";
import "./global.css";
import {
  // Icons from lucide-react (each icon is an SVG React component)
  ChevronLeft,         // Left arrow (previous month)
  ChevronRight,        // Right arrow (next month)
  Plus,                // Plus sign (open "Schedule Recipe" dialog)
  Calendar as CalendarIcon, // Calendar symbol for "Add"
  Edit,                // Pencil icon for edit
  Trash2,              // Trash can icon for remove
  Coffee,              // Coffee cup icon for breakfast
  Utensils,            // Utensils icon for lunch
  UtensilsCrossed,     // Crossed utensils icon for dinner
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Calendar
 * ------------------------------------------------------------
 * Props:
 *   - activeDay: number (1–31) initial selected day
 *   - onPickDay: function(dayNumber) invoked when a day is clicked
 *
 * Behavior:
 *   - Renders a monthly calendar grid
 *   - Starts at December 2025 (monthIndex = 11)
 *   - Supports navigating months and years (previous/next)
 *   - Tracks scheduled meals by day (breakfast, lunch, dinner)
 *   - Uses a modal to add, edit, or remove meals
 *   - Highlights the selected day and the current real date
 *
 * Note:
 *   - The component keeps its own internal selectedDay state.
 *     onPickDay is called as a notification to the parent.
 * ------------------------------------------------------------
 */
export default function Calendar({ activeDay = 1, onPickDay = () => {} }) {
  /**
   * selectedDay:
   *   - Day number currently selected in this calendar view
   *   - Initialized from activeDay prop
   */
  const [selectedDay, setSelectedDay] = useState(activeDay);

  /**
   * monthIndex:
   *   - 0-based month index where 0 = January, 11 = December
   *   - Initial value 11 => December
   */
  const [monthIndex, setMonthIndex] = useState(11);

  /**
   * year:
   *   - Initial year is 2025
   */
  const [year, setYear] = useState(2025);

  /**
   * mealsByDay:
   *   - Object where keys are day numbers (1–31)
   *   - Each value is an object containing optional keys:
   *       { breakfast?: string, lunch?: string, dinner?: string }
   *   - Example:
   *       {
   *         1: { breakfast: "Oatmeal", lunch: "Salad" },
   *         2: { dinner: "Pasta" }
   *       }
   */
  const [mealsByDay, setMealsByDay] = useState({});

  /**
   * isOpen:
   *   - Controls whether the modal (Schedule/Edit/Remove) is visible
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * modalMode:
   *   - Indicates which action the modal is performing:
   *       "add"   => add new meals
   *       "edit"  => rename existing meals
   *       "remove"=> remove existing meals
   */
  const [modalMode, setModalMode] = useState("add");

  /**
   * daysInMonth:
   *   - Number of days in the current month for the selected year
   *   - new Date(year, monthIndex + 1, 0) returns the last day of the month
   */
  const daysInMonth = useMemo(
    () => new Date(year, monthIndex + 1, 0).getDate(),
    [year, monthIndex]
  );

  /**
   * firstWeekday:
   *   - Day of week of the first day of the current month
   *   - 0 = Sunday, 1 = Monday, ..., 6 = Saturday
   */
  const firstWeekday = useMemo(
    () => new Date(year, monthIndex, 1).getDay(),
    [year, monthIndex]
  );

  /**
   * monthGrid:
   *   - Array representing the calendar cells for the current month view
   *   - Contains null values as leading placeholders for alignment
   *   - Example for a month starting on Wednesday:
   *       [null, null, null, 1, 2, 3, ..., 30]
   */
  const monthGrid = useMemo(() => {
    const cells = [];

    // Leading empty cells before day 1
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }

    // Actual day numbers
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }

    return cells;
  }, [daysInMonth, firstWeekday]);

  /**
   * MONTHS:
   *   - Names of months for display in the header
   */
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  /**
   * WEEKDAYS:
   *   - Short weekday labels used in the header row of the grid
   */
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /**
   * prevMonth:
   *   - Moves one month back
   *   - If the current month is January (index 0), wraps to December (11)
   *     and decreases the year by one
   */
  function prevMonth() {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  }

  /**
   * nextMonth:
   *   - Moves one month forward
   *   - If the current month is December (index 11), wraps to January (0)
   *     and increases the year by one
   */
  function nextMonth() {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  }

  /**
   * defaults:
   *   - Default meal labels used when adding meals to a day
   */
  const defaults = {
    breakfast: "Oatmeal & Berries",
    lunch: "Chicken Bowl",
    dinner: "Salmon & Veg",
  };

  /**
   * addMeal:
   *   - Adds a meal for the currently selected day if not already defined
   *   - mealType is one of: "breakfast" | "lunch" | "dinner"
   */
  function addMeal(mealType) {
    setMealsByDay((prev) => {
      const dayMeals = { ...(prev[selectedDay] || {}) };
      if (!dayMeals[mealType]) {
        dayMeals[mealType] = defaults[mealType];
      }
      return { ...prev, [selectedDay]: dayMeals };
    });
  }

  /**
   * editMeal:
   *   - Renames an existing meal for the selected day
   *   - Prompts the user for a new label
   *   - If meal does not exist, state is unchanged
   */
  function editMeal(mealType) {
    setMealsByDay((prev) => {
      const dayMeals = { ...(prev[selectedDay] || {}) };
      if (!dayMeals[mealType]) return prev;

      const newName =
        window.prompt(`Rename ${mealType}:`, dayMeals[mealType]) ||
        dayMeals[mealType];

      dayMeals[mealType] = newName;
      return { ...prev, [selectedDay]: dayMeals };
    });
  }

  /**
   * removeMeal:
   *   - Removes a meal from the selected day
   *   - If all meals are removed for that day, the day key is removed
   *     from mealsByDay
   */
  function removeMeal(mealType) {
    setMealsByDay((prev) => {
      const dayMeals = { ...(prev[selectedDay] || {}) };
      if (!dayMeals[mealType]) return prev;

      delete dayMeals[mealType];

      const next = { ...prev };
      if (Object.keys(dayMeals).length === 0) {
        delete next[selectedDay];
      } else {
        next[selectedDay] = dayMeals;
      }
      return next;
    });
  }

  /**
   * dayMeals:
   *   - Convenience reference for meals of the currently selected day
   */
  const dayMeals = mealsByDay[selectedDay];

  /**
   * today:
   *   - Current real-world date used to highlight the current day
   */
  const today = new Date();

  /**
   * isToday:
   *   - Returns true if the provided day number matches the real date
   *     (same year, month, and day)
   */
  function isToday(d) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === monthIndex &&
      today.getDate() === d
    );
  }

  /**
   * ModalButtons:
   *   - Renders the three buttons inside the modal (Breakfast, Lunch, Dinner)
   *   - Behavior changes based on modalMode:
   *       "add"    => calls addMeal
   *       "edit"   => calls editMeal
   *       "remove" => calls removeMeal
   *   - Buttons are disabled when the selected action is not valid
   *     (for example, edit/remove requires the meal to exist)
   */
  const ModalButtons = ({ mode }) => {
    // Select the handler based on mode
    const run =
      mode === "add" ? addMeal : mode === "edit" ? editMeal : removeMeal;

    const dayMeals = mealsByDay[selectedDay] || {};

    // Determine if each meal button should be enabled or disabled
    const can = {
      breakfast: mode === "add" || !!dayMeals.breakfast,
      lunch: mode === "add" || !!dayMeals.lunch,
      dinner: mode === "add" || !!dayMeals.dinner,
    };

    /**
     * Btn:
     *   - Internal reusable button component for each meal type
     */
    const Btn = ({ type, icon, label }) => {
      const Icon = icon;
      return (
        <button
          className={`cal-btn ${!can[type] ? "cal-btn-disabled" : ""}`}
          disabled={!can[type]}
          onClick={() => {
            run(type);
            setIsOpen(false);
          }}
        >
          <Icon size={16} /> {label}
        </button>
      );
    };

    return (
      <div className="cal-modal-buttons">
        <Btn
          type="breakfast"
          icon={Coffee}
          label={
            mode === "add"
              ? "Add Breakfast"
              : mode === "edit"
              ? "Edit Breakfast"
              : "Remove Breakfast"
          }
        />
        <Btn
          type="lunch"
          icon={Utensils}
          label={
            mode === "add"
              ? "Add Lunch"
              : mode === "edit"
              ? "Edit Lunch"
              : "Remove Lunch"
          }
        />
        <Btn
          type="dinner"
          icon={UtensilsCrossed}
          label={
            mode === "add"
              ? "Add Dinner"
              : mode === "edit"
              ? "Edit Dinner"
              : "Remove Dinner"
          }
        />
      </div>
    );
  };

  return (
    <div className="cal-card">
      {/* ----------------------------------------------------------
          HEADER: Month navigation and main "Schedule Recipe" button
          ---------------------------------------------------------- */}
      <div className="cal-header">
        <div className="cal-header-left">
          <button className="cal-icon-btn" onClick={prevMonth}>
            <ChevronLeft />
          </button>

          <h2 className="cal-title">
            {MONTHS[monthIndex]} {year}
          </h2>

          <button className="cal-icon-btn" onClick={nextMonth}>
            <ChevronRight />
          </button>
        </div>

        <button
          className="cal-primary"
          onClick={() => {
            setModalMode("add");
            setIsOpen(true);
          }}
        >
          <Plus size={16} />
          Schedule Recipe
        </button>
      </div>

      {/* ----------------------------------------------------------
          GRID: Weekday labels and day buttons
          ---------------------------------------------------------- */}
      <div className="cal-grid cal-weekdays">
        {/* Weekday header row */}
        {WEEKDAYS.map((d) => (
          <div key={d} className="cal-weekday">
            {d}
          </div>
        ))}

        {/* Month grid cells */}
        {monthGrid.map((d, i) => {
          // Empty cells used as placeholders before day 1
          if (d === null) {
            return <div key={i} className="cal-day cal-day-empty" />;
          }

          const selected = d === selectedDay;

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`cal-day ${selected ? "cal-day-selected" : ""} ${
                isToday(d) && !selected ? "cal-day-today" : ""
              }`}
              onClick={() => {
                setSelectedDay(d);  // update internal selection
                onPickDay(d);       // notify parent if needed
              }}
            >
              {d}
            </motion.button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------
          ACTIONS: Add / Edit / Remove buttons under the calendar
          ---------------------------------------------------------- */}
      <div className="cal-actions">
        <button
          className="cal-btn"
          onClick={() => {
            setModalMode("add");
            setIsOpen(true);
          }}
        >
          <CalendarIcon size={16} /> Add
        </button>

        <button
          className="cal-btn"
          onClick={() => {
            setModalMode("edit");
            setIsOpen(true);
          }}
        >
          <Edit size={16} /> Edit
        </button>

        <button
          className="cal-btn cal-danger"
          onClick={() => {
            setModalMode("remove");
            setIsOpen(true);
          }}
        >
          <Trash2 size={16} /> Remove
        </button>
      </div>

      {/* ----------------------------------------------------------
          MODAL: Add/Edit/Remove meal selection
          ---------------------------------------------------------- */}
      {isOpen && (
        <div className="cal-modal-wrapper">
          <div className="cal-modal">
            <div className="cal-modal-header">
              <strong>
                {modalMode === "add"
                  ? "Schedule a Recipe"
                  : modalMode === "edit"
                  ? "Edit Scheduled Recipe"
                  : "Remove Scheduled Recipe"}
              </strong>

              <button className="cal-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <p className="cal-modal-text">
              {modalMode === "add"
                ? "Select a meal to add."
                : modalMode === "edit"
                ? "Select a meal to rename."
                : "Select a meal to remove."}
            </p>

            <ModalButtons mode={modalMode} />
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------
          SUMMARY: Text description of meals for the selected day
          ---------------------------------------------------------- */}
      <div className="cal-summary">
        <strong>Day {selectedDay} meals:</strong>{" "}
        {dayMeals
          ? [
              dayMeals.breakfast && `Breakfast: ${dayMeals.breakfast}`,
              dayMeals.lunch && `Lunch: ${dayMeals.lunch}`,
              dayMeals.dinner && `Dinner: ${dayMeals.dinner}`,
            ]
              .filter(Boolean)
              .join(" • ")
          : "none yet"}
      </div>
    </div>
  );
}
