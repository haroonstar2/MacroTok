import React, { useState } from "react";
import { useCart } from "../../context/cartcontext";

export default function IngredientRow({ name }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addSingleItem } = useCart();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        borderRadius: "12px",
        background: isHovered ? "#f8fafc" : "transparent",
        transition: "all 0.2s ease",
        borderBottom: "1px solid #f1f5f9"
      }}
    >
      <span style={{ fontWeight: 500, color: "#334155" }}>{name}</span>

      {isHovered && (
        <button
          onClick={() => addSingleItem(name)}
          aria-label="Add to list"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center"
          }}
        >
        
          <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="blueGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#2563EB" />
              </linearGradient>
              <filter id="shadow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.18" />
              </filter>
            </defs>

            <circle cx="32" cy="32" r="24" fill="url(#blueGrad)" filter="url(#shadow)" />
            <path d="M32 22V42" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M22 32H42" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}