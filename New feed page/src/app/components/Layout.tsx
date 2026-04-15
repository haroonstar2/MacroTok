/**
 * Layout.tsx
 * Main layout wrapper that includes the sidebar and main content area
 */

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "../sidebar/Sidebar";
import "../sidebar/sidebar-themed.css";

export default function Layout() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("home");

  // Update active nav based on current path
  React.useEffect(() => {
    if (location.pathname === "/") {
      setActiveNav("home");
    } else if (location.pathname.startsWith("/meal-plan")) {
      setActiveNav("plan");
    }
  }, [location.pathname]);

  const handleNavigation = (id: string) => {
    setActiveNav(id);
  };

  return (
    <div className="layout">
      <Sidebar active={activeNav} onNav={handleNavigation} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}