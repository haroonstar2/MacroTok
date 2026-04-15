/**
 * Sidebar.tsx
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
import "../styles/sidebar-themed.css";
import { useNavigate } from "react-router";

interface NavItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: string;
  onClick?: (id: string) => void;
}

/* ============================================================
   NAV ITEM (Reusable Button Component)
   ------------------------------------------------------------
   Each item includes:
     - icon (SVG)
     - label (text)
     - click event (calls parent onNav handler)
     - "active" style when selected
   ============================================================ */
function NavItem({ id, label, icon, active, onClick }: NavItemProps) {
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

interface SidebarProps {
  active?: string;
  onNav?: (id: string) => void;
}

/* ============================================================
   SIDEBAR MAIN COMPONENT
   ------------------------------------------------------------
   Contains:
     1. Brand title
     2. Navigation items
     3. Profile section at bottom
   ============================================================ */
export default function Sidebar({ active = "home", onNav }: SidebarProps) {
  const navigate = useNavigate();

  /* -------------------------------------------
     NAVIGATION ITEMS
     Each object holds:
       - id (identifier string)
       - label (menu name)
       - icon (inline SVG)
       - path (route path)
     ------------------------------------------- */
  const items = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: (
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
      path: "/meal-plan",
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
      id: "random",
      label: "Random Recipe",
      path: "/random",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M2 18h1.4c1.3 0 1.9 0 2.5-.2.5-.2 1-.5 1.4-1l9.4-9.4c.4-.4.7-.9 1-1.4.1-.6.1-1.2.1-2.5V2M18 2l4 4-4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 6h1.4c1.3 0 1.9 0 2.5.2.5.2 1 .5 1.4 1l9.4 9.4c.4.4.7.9 1 1.4.1.6.1 1.2.1 2.5V22M18 22l4-4-4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const handleNavClick = (item: typeof items[0]) => {
    if (onNav) {
      onNav(item.id);
    }
    navigate(item.path);
  };

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
      <div onClick={() => navigate("/")} className="sb-brand">
        MacroTok
      </div>

      {/* Navigation menu list */}
      <nav className="sb-nav">
        {items.map((it) => (
          <NavItem
            key={it.id}
            id={it.id}
            label={it.label}
            icon={it.icon}
            active={active}
            onClick={() => handleNavClick(it)}
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