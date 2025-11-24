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
     2. Navigation items (Home, Search, etc.)
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
      id: "search",
      label: "Search",
      icon: (
        // Magnifying glass
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
    {
      id: "saved",
      label: "Saved",
      icon: (
        // Bookmark icon
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
        // Trending up arrow
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
        // Users / Group icon
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
      <div className="sb-brand">MacroTok</div>

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
