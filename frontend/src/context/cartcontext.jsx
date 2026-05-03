// src/context/CartContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

export const CartContext = createContext(null);
const norm = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");

// Cart item shape:
// { key: string, text: string, qty: number, sources: string[] }
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function clearCart() {
    setCartItems([]);
  }

  function removeItem(key) {
    setCartItems((prev) => prev.filter((it) => it.key !== key));
  }

  function updateQty(key, newQty) {
    setCartItems((prev) =>
      prev
        .map((it) => (it.key === key ? { ...it, qty: Math.max(1, Number(newQty) || 1) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  function addRecipeToCart(recipe) {
    // expects recipe.extendedIngredients: [{ original: "1 lb chicken", id: ...}, ...]
    if (!recipe?.extendedIngredients?.length) return;

    setCartItems((prev) => {
      const map = new Map(prev.map((it) => [it.key, { ...it }]));

      for (const ing of recipe.extendedIngredients) {
        const text = ing.original || "";
        if (!text) continue;

        const key = norm(text); // merge key
        const existing = map.get(key);

        if (!existing) {
          map.set(key, {
            key,
            text,
            qty: 1,
            sources: [recipe.id ?? recipe.title ?? "recipe"],
          });
        } else {
          existing.qty += 1;
          const src = recipe.id ?? recipe.title ?? "recipe";
          if (!existing.sources.includes(src)) existing.sources.push(src);
          map.set(key, existing);
        }
      }

      return Array.from(map.values());
    });
  }
// new
  function addSingleItem(text) {
  if (!text) return;
  const key = norm(text);
  setCartItems((prev) => {
    const existing = prev.find((it) => it.key === key);
    if (existing) {
      return prev.map((it) => (it.key === key ? { ...it, qty: it.qty + 1 } : it));
    }
    return [...prev, { key, text: text.trim(), qty: 1, sources: ["manual"] }];
  });
  
}
function decrementItem(key) {
  setCartItems((prev) =>
    prev.map((it) => 
      it.key === key ? { ...it, qty: it.qty - 1 } : it
    ).filter((it) => it.qty > 0) // If it hits 0, it actually removes it
  );
}

  const value = useMemo(
    () => ({
      cartItems,
      setCartItems,
      addRecipeToCart,
      updateQty,
      addSingleItem,
      removeItem,
      clearCart,
      decrementItem
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}