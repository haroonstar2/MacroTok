import React, { useState, useEffect } from "react";
// import "./sidebar.css";
import "../styles/sidebar-themed.css";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../startFirebase";

function NavItem({ id, label, icon, active, onClick }) {
  const isActive = active === id;
  return (
    <button
      className={`sb-item ${isActive ? "active" : ""}`}
      onClick={() => onClick?.(id)}
    >
      <span className="sb-icn" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar({ active = "home", onNav }) {
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState(null);
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const settings = docSnap.data().settings || {};
          if (settings.photoURL) setPhotoURL(settings.photoURL);
          const first = settings.firstName?.[0] || "";
          const last = settings.lastName?.[0] || "";
          if (first || last) setInitials((first + last).toUpperCase());
        }
      } catch (e) {
        console.error("Sidebar profile fetch failed:", e);
      }
    });
    return () => unsubscribe();
  }, []);

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
          
      id: "liked",
      label: "Liked",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={active === "liked" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: "shopping",
      label: "Shopping",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="20" r="1" />
          <circle cx="17" cy="20" r="1" />
          <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.6L21 8H6.2" />
        </svg>
      ),
    },
    {
      id: "bot",
      label: "Chatbot",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="8" width="12" height="10" rx="2" />
          <circle cx="9" cy="13" r="1" />
          <circle cx="15" cy="13" r="1" />
          <path d="M12 4v4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div onClick={() => navigate("/")} className="sb-brand">
        MacroTok
      </div>
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
      <div className="sb-profile" onClick={() => navigate("/settings")}>
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            className="sb-avatar sb-avatar-img"
          />
        ) : (
          <div className="sb-avatar">{initials}</div>
        )}
        <div>
          <div className="sb-profile-title">Your Profile</div>
          <div className="sb-profile-sub">View stats</div>
        </div>
      </div>
    </aside>
  );
}
