import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./calendar.css";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid, CalendarDays } from "lucide-react";

import { db, auth } from "../../FirebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { getLikedPostIds } from "../../api/likesApi.js";
import RecipeCard from "../recipes/RecipeCard";

const today = new Date();

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const SLOTS = ["breakfast","lunch","dinner"];
const SLOT_META = {
  breakfast: { label: "Breakfast", emoji: "🌅", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "#fcd34d" },
  lunch:     { label: "Lunch",     emoji: "☀️",  dot: "#10b981", bg: "rgba(16,185,129,0.12)", text: "#6ee7b7" },
  dinner:    { label: "Dinner",    emoji: "🌙", dot: "#818cf8", bg: "rgba(129,140,248,0.12)", text: "#a5b4fc" },
};

const GOAL_PRESETS = { deficit: 1800, maintenance: 2000, surplus: 2500 };

function fmtKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function getNutrient(r, name) {
  return Number(r[name.toLowerCase()] || r.nutrition?.nutrients?.find(n => n.name === name)?.amount || 0);
}

function calcTotals(meals) {
  const all = [...(meals.breakfast||[]), ...(meals.lunch||[]), ...(meals.dinner||[])];
  return all.reduce((s,r) => ({
    calories: s.calories + getNutrient(r, "Calories"),
    protein:  s.protein  + getNutrient(r, "Protein"),
    carbs:    s.carbs    + getNutrient(r, "Carbohydrates"),
    fat:      s.fat      + (getNutrient(r, "Fat") || getNutrient(r, "fats")),
  }), { calories:0, protein:0, carbs:0, fat:0 });
}

export default function Calendar({ activeDay, onPickDay = () => {} }) {
  const [view, setView]           = useState("month");
  const [monthIdx, setMonthIdx]   = useState(today.getMonth());
  const [year, setYear]           = useState(today.getFullYear());
  const [selDay, setSelDay]       = useState(activeDay || today.getDate());
  const [calData, setCalData]     = useState({});   // dateKey → {breakfast,lunch,dinner}
  const [likedIds, setLikedIds]   = useState([]);
  const [goalMode, setGoalMode]   = useState("maintenance");

  // Fetch all liked IDs once
  useEffect(() => {
    getLikedPostIds().then(ids => setLikedIds(ids.map(String))).catch(console.error);
  }, []);

  // Fetch entire calendar collection
  const fetchAll = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "calendar"));
      const data = {};
      snap.forEach(doc => {
        const d = doc.data();
        data[doc.id] = {
          breakfast: d.breakfast || [],
          lunch:     d.lunch     || [],
          dinner:    d.dinner    || [],
        };
      });
      setCalData(data);
    } catch (err) { console.error("Calendar fetch error:", err); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Derived
  const selDateKey = fmtKey(year, monthIdx, selDay);
  const dayMeals   = calData[selDateKey] || { breakfast:[], lunch:[], dinner:[] };
  const totals      = useMemo(() => calcTotals(dayMeals), [dayMeals]);
  const calGoal     = GOAL_PRESETS[goalMode];
  const progress    = Math.min(100, Math.round((totals.calories / calGoal) * 100));

  // Month grid
  const daysInMonth  = useMemo(() => new Date(year, monthIdx + 1, 0).getDate(), [year, monthIdx]);
  const firstWeekday = useMemo(() => new Date(year, monthIdx, 1).getDay(), [year, monthIdx]);
  const monthGrid    = useMemo(() => {
    const cells = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [daysInMonth, firstWeekday]);

  // Week dates (Sun–Sat containing selDay)
  const weekDates = useMemo(() => {
    const base = new Date(year, monthIdx, selDay);
    const dow  = base.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - dow + i);
      return d;
    });
  }, [year, monthIdx, selDay]);

  function pickDay(d, m = monthIdx, y2 = year) {
    setSelDay(d); setMonthIdx(m); setYear(y2);
    onPickDay(d);
  }

  function prevPeriod() {
    if (view === "month") {
      if (monthIdx === 0) { setMonthIdx(11); setYear(y => y - 1); }
      else setMonthIdx(m => m - 1);
    } else {
      const d = new Date(year, monthIdx, selDay - 7);
      pickDay(d.getDate(), d.getMonth(), d.getFullYear());
    }
  }

  function nextPeriod() {
    if (view === "month") {
      if (monthIdx === 11) { setMonthIdx(0); setYear(y => y + 1); }
      else setMonthIdx(m => m + 1);
    } else {
      const d = new Date(year, monthIdx, selDay + 7);
      pickDay(d.getDate(), d.getMonth(), d.getFullYear());
    }
  }

  function isToday(date) {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  function mealDots(dateKey) {
    return SLOTS.filter(s => (calData[dateKey]?.[s]?.length || 0) > 0);
  }

  const periodTitle = view === "month"
    ? `${MONTHS[monthIdx]} ${year}`
    : `${weekDates[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${weekDates[6].toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;

  return (
    <div className="cal-page">

      {/* ── TOP HEADER ── */}
      <div className="cal-top-header">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevPeriod}><ChevronLeft size={16}/></button>
          <h2 className="cal-period-title">{periodTitle}</h2>
          <button className="cal-nav-btn" onClick={nextPeriod}><ChevronRight size={16}/></button>
        </div>
        <div className="cal-view-toggle">
          <button className={`view-btn ${view==="month"?"active":""}`} onClick={() => setView("month")}>
            <LayoutGrid size={14}/> Month
          </button>
          <button className={`view-btn ${view==="week"?"active":""}`} onClick={() => setView("week")}>
            <CalendarDays size={14}/> Week
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="cal-body">

        {/* ════ MONTH VIEW ════ */}
        {view === "month" && (
          <>
            <div className="cal-main-panel">
              <div className="cal-month-grid">
                {WEEKDAYS.map(d => <div key={d} className="cal-weekday-hdr">{d}</div>)}
                {monthGrid.map((d, i) => {
                  if (!d) return <div key={i} className="cal-cell cal-cell-empty"/>;
                  const dk = fmtKey(year, monthIdx, d);
                  const dots = mealDots(dk);
                  const selected  = d === selDay;
                  const isT = today.getDate()===d && today.getMonth()===monthIdx && today.getFullYear()===year;
                  return (
                    <motion.button key={i}
                      whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                      className={`cal-cell ${selected?"selected":""} ${isT?"today":""}`}
                      onClick={() => pickDay(d)}
                    >
                      <span className={`cal-cell-num ${isT?"today-num":""}`}>{d}</span>
                      {dots.length > 0 && (
                        <div className="cal-dots">
                          {dots.map(s => <span key={s} className="cal-dot" style={{background: SLOT_META[s].dot}}/>)}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Month → right sidebar */}
            <DaySidebar
              dateLabel={`${MONTHS[monthIdx]} ${selDay}, ${year}`}
              dayMeals={dayMeals}
              totals={totals}
              calGoal={calGoal}
              progress={progress}
              goalMode={goalMode}
              setGoalMode={setGoalMode}
              selDateKey={selDateKey}
              likedIds={likedIds}
              onRemove={fetchAll}
            />
          </>
        )}

        {/* ════ WEEK VIEW ════ */}
        {view === "week" && (
          <div className="cal-week-view">
            {/* Header row */}
            <div className="week-header-row">
              <div className="week-slot-spacer"/>
              {weekDates.map((date,i) => {
                const isT = isToday(date);
                const isSel = date.getDate()===selDay && date.getMonth()===monthIdx && date.getFullYear()===year;
                return (
                  <div key={i}
                    className={`week-day-hdr ${isSel?"selected":""} ${isT?"today":""}`}
                    onClick={() => pickDay(date.getDate(), date.getMonth(), date.getFullYear())}
                  >
                    <span className="week-day-name">{WEEKDAYS[date.getDay()]}</span>
                    <span className={`week-day-num ${isT?"today-num":""}`}>{date.getDate()}</span>
                  </div>
                );
              })}
            </div>

            {/* One row per slot */}
            {SLOTS.map(slot => (
              <div key={slot} className="week-slot-row">
                <div className="week-slot-label" style={{color: SLOT_META[slot].dot}}>
                  <span>{SLOT_META[slot].emoji}</span>
                  <span>{SLOT_META[slot].label}</span>
                </div>
                {weekDates.map((date, i) => {
                  const dk = fmtKey(date.getFullYear(), date.getMonth(), date.getDate());
                  const recipes = (calData[dk]?.[slot]) || [];
                  const isSel = date.getDate()===selDay && date.getMonth()===monthIdx && date.getFullYear()===year;
                  return (
                    <div key={i}
                      className={`week-cell ${isSel?"selected":""}`}
                      onClick={() => pickDay(date.getDate(), date.getMonth(), date.getFullYear())}
                    >
                      {recipes.length > 0 ? recipes.map(r => (
                        <div key={r.id} className="week-recipe-chip"
                          style={{borderLeftColor: SLOT_META[slot].dot, background: SLOT_META[slot].bg}}
                        >
                          {r.image && (
                            <img src={r.image} alt="" className="week-chip-img"
                              onError={e => e.target.style.display="none"}/>
                          )}
                          <span className="week-chip-name" style={{color: SLOT_META[slot].text}}>
                            {r.title}
                          </span>
                        </div>
                      )) : (
                        <div className="week-cell-empty">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Summary strip below week grid */}
            <div className="week-summary-strip">
              <DaySidebar
                dateLabel={`${MONTHS[monthIdx]} ${selDay}, ${year}`}
                dayMeals={dayMeals}
                totals={totals}
                calGoal={calGoal}
                progress={progress}
                goalMode={goalMode}
                setGoalMode={setGoalMode}
                selDateKey={selDateKey}
                likedIds={likedIds}
                onRemove={fetchAll}
                inline
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Day Detail Sidebar ── */
function DaySidebar({ dateLabel, dayMeals, totals, calGoal, progress, goalMode, setGoalMode, selDateKey, likedIds, onRemove, inline }) {
  return (
    <div className={inline ? "day-sidebar day-sidebar-inline" : "day-sidebar"}>
      <div className="sidebar-hdr">
        <h3 className="sidebar-date">{dateLabel}</h3>
        <span className="sidebar-kcal">{Math.round(totals.calories)} kcal</span>
      </div>

      {/* Progress */}
      <div className="sidebar-progress-box">
        <div className="progress-top-row">
          <span className="progress-label">Daily Goal</span>
          <div className="goal-chips">
            {Object.keys(GOAL_PRESETS).map(m => (
              <button key={m}
                className={`goal-chip ${goalMode===m?"active":""}`}
                onClick={() => setGoalMode(m)}
              >
                {m.charAt(0).toUpperCase()+m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill"
            style={{width:`${progress}%`, background: progress>=100?"#ef4444":"#4f39f6"}}/>
        </div>
        <p className="progress-text">{Math.round(totals.calories)} / {calGoal} kcal · {progress}%</p>
        <div className="macro-pills">
          <span className="mpill mpill-p">P {Math.round(totals.protein)}g</span>
          <span className="mpill mpill-c">C {Math.round(totals.carbs)}g</span>
          <span className="mpill mpill-f">F {Math.round(totals.fat)}g</span>
        </div>
      </div>

      {/* Meal slots */}
      <div className="sidebar-slots">
        {SLOTS.map(slot => (
          <div key={slot} className="sidebar-slot">
            <div className="sidebar-slot-label" style={{color: SLOT_META[slot].dot}}>
              {SLOT_META[slot].emoji} {SLOT_META[slot].label}
            </div>
            {(dayMeals[slot]||[]).length > 0
              ? (dayMeals[slot]).map(r => (
                  <RecipeCard key={`${slot}-${r.id}`}
                    recipe={r}
                    initiallyLiked={likedIds.includes(String(r.id))}
                    initiallyScheduled={true}
                    scheduledDate={selDateKey}
                    scheduledSlot={slot}
                    onRemove={onRemove}
                  />
                ))
              : <div className="slot-empty-msg">No meals planned</div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
