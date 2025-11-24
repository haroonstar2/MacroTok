/**
 * Sidebar.jsx
 * ------------------------------------------------------------
 * Navigation panel for the MacroTok application.
 *
 * Responsibilities:
 *   - Display navigation links such as Home, Search, Meal Plan, etc.
 *   - Highlight the active navigation section.
 *   - Trigger parent callbacks when a section is selected.
 *   - Display a static profile summary at the bottom.
 *
 * Props:
 *   - active: string identifying the currently selected section
 *   - onNav: function invoked when a navigation item is clicked
 * ------------------------------------------------------------
 */

import React from "react";
import "./sidebar.css";

/* ------------------------------------------------------------
   NavItem Component
   ------------------------------------------------------------
   Represents a single clickable navigation button.
   Displays an icon and label.
   Applies an "active" class when the id matches the current view.
------------------------------------------------------------ */
function NavItem({ id, label, icon, active, onClick }) {
  return (
    <button
      className={`sb-item ${active === id ? "active" : ""}`}
      onClick={() => onClick?.(id)}
    >
      <span className="sb-icn" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------
   Sidebar Component
   ------------------------------------------------------------
   Provides the left-side navigation structure.
   Contains:
     • Application brand
     • Navigation item list
     • Profile section at the bottom
------------------------------------------------------------ */
export default function Sidebar({ active = "home", onNav }) {
  /* ------------------------------------------------------------
     Navigation Item Definitions
     ------------------------------------------------------------
     Each entry contains:
       - id: unique identifier
       - label: display text
       - icon: inline SVG symbol
  ------------------------------------------------------------ */
  const items = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 10.5V20h13V10.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Search",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      ),
    },
    {
      id: "plan",
      label: "Meal Plan",
      icon: (
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
    {
      id: "saved",
      label: "Saved",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 3h12v18l-6-4-6 4z" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "trending",
      label: "Trending",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M14 8h6v6" />
        </svg>
      ),
    },
    {
      id: "community",
      label: "Community",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  /* ------------------------------------------------------------
     Render Structure
     ------------------------------------------------------------
     <aside>                  Wrapper for entire sidebar
       • Brand
       • Navigation list
       • Profile summary
  ------------------------------------------------------------ */
  return (
    <aside className="sidebar">
      <div className="sb-brand">MacroTok</div>

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

      <div className="sb-profile">
        <div className="sb-avatar">U</div>
        <div>
          <div className="sb-profile-title">Your Profile</div>
          <div className="sb-profile-sub">View stats</div>
        </div>
      </div>
    </aside>
  );
}
