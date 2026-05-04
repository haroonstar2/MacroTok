import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { CartContext } from "../../context/cartcontext"; 
import ShoppingPage from "./shoppingcart";

const renderPage = (items, clickHandler = () => {}) => {
  const fakeContext = {
    cartItems: items,
    decrementItem: clickHandler,
    clearCart: () => {}
  };

  return render(
    <CartContext.Provider value={fakeContext}>
      <MemoryRouter>
        <ShoppingPage />
      </MemoryRouter>
    </CartContext.Provider>
  );
};

describe("Shopping List Easy Tests", () => {
  test("Shows the empty state message when the list is empty", () => {
    renderPage([]);
    expect(screen.getByText(/Your list is empty/i)).toBeInTheDocument();
  });

  test("Shows the name of an item when it is added", () => {
    renderPage([{ key: "1", text: "Fresh Tomatoes", qty: 1 }]);
    expect(screen.getByText(/Fresh Tomatoes/i)).toBeInTheDocument();
  });
});