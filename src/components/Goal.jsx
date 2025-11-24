import React from "react";

/* ------------------------------------------------------------
   Goal Component
   ------------------------------------------------------------
   Displays daily calorie intake compared to the target goal.
   Computes:
     - Total intake from breakfast, lunch, and dinner
     - Percentage of goal consumed
     - Surplus, deficit, or target status
   Visual feedback is handled through CSS classes applied to:
     - Progress bar color
     - Status text
------------------------------------------------------------ */
export default function Goal({ dailyGoal = 1900, mealData = {} }) {
  /* ------------------------------------------------------------
     Extract calorie values from mealData.
     Default to 0 if values are missing or undefined.
  ------------------------------------------------------------ */
  const b = Number(mealData?.breakfast?.calories || 0);
  const l = Number(mealData?.lunch?.calories || 0);
  const d = Number(mealData?.dinner?.calories || 0);
  const intake = b + l + d;

  /* ------------------------------------------------------------
     Calculate percentage of the daily goal.
     Values are capped at 100% to avoid overflowing the bar.
  ------------------------------------------------------------ */
  const pct =
    dailyGoal > 0 ? Math.min(100, Math.round((intake / dailyGoal) * 100)) : 0;

  /* ------------------------------------------------------------
     Difference between intake and goal.
     Negative => deficit
     Zero     => on target
     Positive => surplus
  ------------------------------------------------------------ */
  const delta = intake - dailyGoal;

  /* ------------------------------------------------------------
     Determine status CSS class.
  ------------------------------------------------------------ */
  const status =
    delta === 0 ? "target" : delta < 0 ? "deficit" : "surplus";

  /* ------------------------------------------------------------
     Label displayed below progress bar.
     Shows deficit or surplus amount.
  ------------------------------------------------------------ */
  const deltaLabel =
    delta === 0
      ? "On target"
      : delta < 0
      ? `Deficit ${Math.abs(delta)} kcal`
      : `Surplus ${delta} kcal`;

  return (
    <div className="goal-card">
      <h3 className="goal-title">Daily Intake</h3>

      {/* --------------------------------------------------------
          Current intake and goal values.
          The input is read-only but kept for consistent layout.
      -------------------------------------------------------- */}
      <div className="goal-row">
        <div>
          <strong className="tabular-nums">{intake}</strong>
          {" / "}
          <span className="tabular-nums">{dailyGoal}</span> kcal
        </div>

        <input
          type="number"
          className="goal-input"
          value={dailyGoal}
          readOnly
          aria-label="Daily goal (read-only)"
        />
      </div>

      {/* --------------------------------------------------------
          Progress bar.
          The fill width and color depend on calculated status.
      -------------------------------------------------------- */}
      <div className="goal-bar">
        <div
          className={`goal-bar-fill goal-bar-fill--${status}`}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>

      {/* --------------------------------------------------------
          Status label (deficit, target, surplus).
      -------------------------------------------------------- */}
      <div className={`goal-status goal-status--${status}`}>
        {deltaLabel}
      </div>

      {/* --------------------------------------------------------
          Summary of individual meal values.
      -------------------------------------------------------- */}
      <div className="goal-summary">
        Breakfast: {b} kcal · Lunch: {l} kcal · Dinner: {d} kcal
      </div>
    </div>
  );
}
