/**
 * Sidebar.jsx
 * ------------------------------------------------------------
 * MacroTok — Sidebar Navigation Component
 *
 * Displays the main navigation links (Home, Search, Meal Plan, etc.)
 * along with the brand title and simple profile footer section.
 *
 * Props:
 *   - active: the currently active section id (e.g., "home")
 *   - onNav: callback when a nav item is clicked (receives the id)
 * ------------------------------------------------------------
 */

import React from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";

/* ============================================================
   NAV ITEM (Reusable Button Component)
   ------------------------------------------------------------
   Each item includes:
     - icon (SVG)
     - label (text)
     - click event (calls parent onNav handler)
     - "active" style when selected
   ============================================================ */
function NavItem({ id, label, icon, active, onClick }) {
  return (
    <button
      className={`sb-item ${active === id ? "active" : ""}`} // highlight if active
      onClick={() => onClick?.(id)} // notify parent of selection
    >
      <span className="sb-icn" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ============================================================
   SIDEBAR MAIN COMPONENT
   ------------------------------------------------------------
   Contains:
     1. Brand title
     2. Navigation items
     3. Profile section at bottom
   ============================================================ */
export default function Sidebar({ active = "home", onNav }) {
  /* -------------------------------------------
     NAVIGATION ITEMS
     Each object holds:
       - id (identifier string)
       - label (menu name)
       - icon (inline SVG)
     ------------------------------------------- */

  const navigate = useNavigate();
  const items = [
    {
      id: "home",
      label: "Home",
      icon: (
        // Home icon (house)
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M3 11.5L12 4l9 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 10.5V20h13V10.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "plan",
      label: "Meal Plan",
      icon: (
        // Calendar icon
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" />
        </svg>
      ),
    },
  ];

  /* ============================================================
     RENDER STRUCTURE
     ------------------------------------------------------------
     <aside> — main sidebar container
       • Brand title (MacroTok)
       • Navigation map (NavItem)
       • Profile section
     ============================================================ */
  return (
    <aside className="sidebar">
      {/* App brand name at top */}
      <div onClick={() => navigate("/")} className="sb-brand">MacroTok</div>

      {/* Navigation menu list */}
      <nav className="sb-nav">
        {items.map((it) => (
          <NavItem
            key={it.id}
            id={it.id}
            label={it.label}
            icon={it.icon}
            active={active}
            onClick={onNav}
          />
        ))}
      </nav>

      {/* Profile summary at bottom of sidebar */}
      <div className="sb-profile" onClick={() => navigate("/settings")}>
        <div className="sb-avatar">U</div>
        <div>
          <div className="sb-profile-title">Your Profile</div>
          <div className="sb-profile-sub">View stats</div>
        </div>
      </div>
    </aside>
  );
}
