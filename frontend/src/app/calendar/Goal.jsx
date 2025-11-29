import React from "react";

/**
 * Goal Card with dynamic color feedback
 * -------------------------------------
 * Colors:
 *  - Green = calorie deficit
 *  - Gray = on target
 *  - Red = surplus
 */
// we can change the goal of calories here we set them to zero as 
// starter 
// deaily goal should be updated we have it 1900 for now 
export default function Goal({ dailyGoal = 1900, mealData = {} }) {
  const b = Number(mealData?.breakfast?.calories || 0);
  const l = Number(mealData?.lunch?.calories || 0);
  const d = Number(mealData?.dinner?.calories || 0);
  const intake = b + l + d; // total intake from breakfast, lunc and dinnet 
  

  const pct =
    dailyGoal > 0 ? Math.min(100, Math.round((intake / dailyGoal) * 100)) : 0;
  const delta = intake - dailyGoal;

  // Choose colors based on deficit/surplus
  const barColor =
    delta === 0 ? "#9ca3af" : delta < 0 ? "#16a34a" : "#dc2626"; // gray / green / red
  const textColor =
    delta === 0 ? "#374151" : delta < 0 ? "#166534" : "#991b1b";

  const deltaLabel =
    delta === 0
      ? "On target"
      : delta < 0
      ? `Deficit ${Math.abs(delta)} kcal`
      : `Surplus ${delta} kcal`;

  return (
    <div className="goal-card">
      <h3 className="goal-title">Daily Intake</h3>

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

      {/* Progress bar with dynamic color */}
      <div className="goal-bar">
        <div
          className="goal-bar-fill"
          style={{
            width: `${pct}%`,
            background: barColor,
            transition: "width 0.4s ease, background 0.4s ease",
          }}
        />
      </div>

      <div style={{ marginTop: 8, fontSize: 13, color: textColor }}>
        {deltaLabel}
      </div>

      <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
        Breakfast: {b} kcal · Lunch: {l} kcal · Dinner: {d} kcal
      </div>
    </div>
  );
}
