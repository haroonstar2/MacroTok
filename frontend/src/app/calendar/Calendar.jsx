import React, { useMemo, useState } from "react";
import "./global.css";

import {
  // Importing icons from lucide-react (these are SVG icons that are like React components)
  ChevronLeft,   // Left arrow 
  ChevronRight,  // Right arrow 
  Plus,          //Plus sign for Add Schedule
  Calendar as CalendarIcon,   // Calandar image used for add to calandar 
  Edit,                        // edit pencil for edit slot
  Trash2,                      // trash can for delete/remove
  Coffee,                      // coffee for brekfast 
  Utensils,                    // fork and knife used for lunch 
  UtensilsCrossed,             // crossed utensils used for dinner
} from "lucide-react";
import { motion } from "framer-motion";
const today = new Date();

//JavaScript months are 0-indexed (0 = Jan, 11 = Dec).
export default function Calendar({ activeDay, onPickDay = () => {} }) {
  const [monthIndex, setMonthIndex] = useState(today.getMonth()); 
  const [year, setYear] = useState(today.getFullYear());
  const [mealsByDay, setMealsByDay] = useState({});
  const [isOpen, setIsOpen] = useState(false); //Controls the "Schedule Recipe" dialog open/close
  const [modalMode, setModalMode] = useState("add"); // add | edit | remove

// new Date(y, m + 1, 0) gives the last day of the month
  const daysInMonth = useMemo(
    () => new Date(year, monthIndex + 1, 0).getDate(),
    [year, monthIndex]
  );
 
  const firstWeekday = useMemo(
    () => new Date(year, monthIndex, 1).getDay(),
    [year, monthIndex]
  );
 /* which weekday is the 1st day of this month?
  * 0 = Sunday, 1 = Monday, ... 6 = Saturday
  */
  const monthGrid = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [daysInMonth, firstWeekday]);

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
// Go to the previous month. If we are on January, we jump to December of the previous year.

 function prevMonth() {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else setMonthIndex((m) => m - 1);
 }

// Go to the next month. If we are on December, we jump to January of the next year.
  function nextMonth() {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else setMonthIndex((m) => m + 1);
  }

  const defaults = {
    breakfast: "Oatmeal & Berries",
    lunch: "Chicken Bowl",
    dinner: "Salmon & Veg",
  };

  function addMeal(mealType) {
    setMealsByDay((prev) => {
      const dayMeals = { ...(prev[activeDay] || {}) };
      dayMeals[mealType] = dayMeals[mealType] || defaults[mealType];
      return { ...prev, [activeDay]: dayMeals };
    });
  }

  function editMeal(mealType) {
    setMealsByDay((prev) => {
      const dayMeals = { ...(prev[activeDay] || {}) };
      if (!dayMeals[mealType]) return prev;
      const newName =
        window.prompt(`Rename ${mealType}:`, dayMeals[mealType]) ||
        dayMeals[mealType];
      dayMeals[mealType] = newName;
      return { ...prev, [activeDay]: dayMeals };
    });
  }

  function removeMeal(mealType) {
    setMealsByDay((prev) => {
      const dayMeals = { ...(prev[activeDay] || {}) };
      if (!dayMeals[mealType]) return prev;
      delete dayMeals[mealType];
      const next = { ...prev };
      if (Object.keys(dayMeals).length === 0) delete next[activeDay];
      else next[activeDay] = dayMeals;
      return next;
    });
  }

  const dayMeals = mealsByDay[activeDay];

  function isToday(d) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === monthIndex &&
      today.getDate() === d
    );
  }

  const ModalButtons = ({ mode }) => {
    const run = mode === "add" ? addMeal : mode === "edit" ? editMeal : removeMeal;
    const dayMeals = mealsByDay[activeDay] || {};
    const can = {
      breakfast: mode === "add" || !!dayMeals.breakfast,
      lunch: mode === "add" || !!dayMeals.lunch,
      dinner: mode === "add" || !!dayMeals.dinner,
    };
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
          label={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "Remove"} Breakfast`}
        />
        <Btn
          type="lunch"
          icon={Utensils}
          label={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "Remove"} Lunch`}
        />
        <Btn
          type="dinner"
          icon={UtensilsCrossed}
          label={`${mode === "add" ? "Add" : mode === "edit" ? "Edit" : "Remove"} Dinner`}
        />
      </div>
    );
  };

  return (
    <div className="cal-card">
      {/* Header */}
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

        <button className="cal-primary" onClick={() => { setModalMode("add"); setIsOpen(true); }}>
          <Plus size={16} />
          Schedule Recipe
        </button>
      </div>

      {/* Grid */}
      <div className="cal-grid cal-weekdays">
        {WEEKDAYS.map((d) => (
          <div key={d} className="cal-weekday">
            {d}
          </div>
        ))}
        {monthGrid.map((d, i) => {
          if (d === null)
            return <div key={i} className="cal-day cal-day-empty"></div>;
          const selected = d === activeDay;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`cal-day ${selected ? "cal-day-selected" : ""} ${
                isToday(d) && !selected ? "cal-day-today" : ""
              }`}
              onClick={() => onPickDay(d)}
            >
              {d}
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="cal-actions">
        <button className="cal-btn" onClick={() => { setModalMode("add"); setIsOpen(true); }}>
          <CalendarIcon size={16} /> Add
        </button>
        <button className="cal-btn" onClick={() => { setModalMode("edit"); setIsOpen(true); }}>
          <Edit size={16} /> Edit
        </button>
        <button className="cal-btn cal-danger" onClick={() => { setModalMode("remove"); setIsOpen(true); }}>
          <Trash2 size={16} /> Remove
        </button>
      </div>

      {/* Modal */}
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

      {/* Summary */}
      <div className="cal-summary">
        <strong>Day {activeDay} meals:</strong>{" "}
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
