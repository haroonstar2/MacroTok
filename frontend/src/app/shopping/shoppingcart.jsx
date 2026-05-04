import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../context/cartcontext";

import { CartContext } from "../../context/cartcontext";

export default function ShoppingPage() {
  const { cartItems, clearCart, decrementItem } = useCart();
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Shopping List</h1>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart} 
            style={{ 
              background: "none", 
              border: "1px solid #ef4444", 
              color: "#ef4444", 
              padding: "8px 16px", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Clear All
          </button>
        )}
      </header>

      {cartItems.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px", 
          background: "#f8fafc", 
          borderRadius: "24px", 
          border: "2px dashed #e2e8f0" 
        }}>
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" style={{ marginBottom: 16, opacity: 0.2 }}>
            <circle cx="32" cy="32" r="24" fill="#64748b" />
            <path d="M32 22V42M22 32H42" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <h2 style={{ color: "#475569", margin: "0 0 8px 0" }}>Your list is empty</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>Time to find a new recipe!</p>
          <button 
            className="btn btn--outline" 
            onClick={() => navigate("/feed")}
          >
            Go to Feed
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cartItems.map((item) => (
            <li 
              key={item.key} 
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "16px 20px", 
                background: "white",
                borderRadius: "16px",
                marginBottom: 12,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                border: "1px solid #f1f5f9"
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "#334155" }}>
                {item.qty > 1 && <strong style={{ color: "#2563EB", marginRight: 8 }}>{item.qty}x</strong>}
                {item.text}
              </span>

              <button
                onClick={() => decrementItem(item.key)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                  <defs>
                    <linearGradient id="redGrad" x1="8" y1="8" x2="56" y2="56">
                      <stop stopColor="#F87171" />
                      <stop offset="1" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="24" fill="url(#redGrad)" />
                  <path d="M24 24L40 40M40 24L24 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}