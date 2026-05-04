// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { likePost, unlikePost } from "../../api/likesApi.js";
import {
  addRecipeToDate,
  removeRecipeFromDate,
  getScheduledEntriesForRecipe,
} from "../../api/calendar.js";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn(() => vi.fn()) };
});

vi.mock("lucide-react", () => ({
  CalendarDays: () => <span data-testid="calendar-icon" />,
}));

vi.mock("../../api/likesApi.js", () => ({
  likePost: vi.fn(),
  unlikePost: vi.fn(),
}));

vi.mock("../../api/calendar.js", () => ({
  addRecipeToDate: vi.fn(),
  removeRecipeFromDate: vi.fn(),
  getScheduledEntriesForRecipe: vi.fn(),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockRecipe = {
  id: 123,
  title: "Test Recipe",
  image: "https://example.com/image.jpg",
  readyInMinutes: 30,
  calories: 500,
  protein: 30,
  carbs: 50,
  fats: 20,
  extendedIngredients: [
    { original: "Ingredient 1" },
    { original: "Ingredient 2" },
  ],
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <RecipeCard
        recipe={mockRecipe}
        initiallyLiked={false}
        initiallyScheduled={false}
        {...props}
      />
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ══════════════════════════════════════════════════════════════════════════════
// LIKE / UNLIKE BUTTON
// ══════════════════════════════════════════════════════════════════════════════

describe("Like / Unlike Button", () => {

  test("renders 🤍 by default when not liked", () => {
    renderCard({ initiallyLiked: false });
    expect(screen.getByRole("button", { name: "🤍" })).toBeInTheDocument();
  });

  test("clicking 🤍 calls likePost and toggles heart to ❤️", async () => {
    likePost.mockResolvedValue();
    renderCard({ initiallyLiked: false });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "🤍" }));
    expect(likePost).toHaveBeenCalledWith(mockRecipe);
    expect(screen.getByRole("button", { name: "❤️" })).toBeInTheDocument();
  });

  test("clicking ❤️ calls unlikePost and toggles heart to 🤍", async () => {
    unlikePost.mockResolvedValue();
    renderCard({ initiallyLiked: true });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "❤️" }));
    expect(unlikePost).toHaveBeenCalledWith(mockRecipe.id);
    expect(screen.getByRole("button", { name: "🤍" })).toBeInTheDocument();
  });

  test("like rolls back to 🤍 if likePost throws an error", async () => {
    likePost.mockRejectedValue(new Error("Network error"));
    renderCard({ initiallyLiked: false });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "🤍" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "🤍" })).toBeInTheDocument()
    );
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// CALENDAR ICON
// ══════════════════════════════════════════════════════════════════════════════

describe("Calendar Icon", () => {

  test("clicking calendar icon when unscheduled opens the date picker", async () => {
    const { container } = renderCard({ initiallyScheduled: false });
    const user = userEvent.setup();
    await user.click(screen.getByTitle("Add to calendar"));
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
  });

  test("date picker shows a meal slot selector with Breakfast, Lunch, Dinner", async () => {
    renderCard({ initiallyScheduled: false });
    const user = userEvent.setup();
    await user.click(screen.getByTitle("Add to calendar"));
    expect(screen.getByRole("option", { name: /breakfast/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /lunch/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /dinner/i })).toBeInTheDocument();
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// ADD TO CALENDAR
// ══════════════════════════════════════════════════════════════════════════════

describe("Add to Calendar", () => {

  test("saving without selecting a date shows alert and does not call API", async () => {
    addRecipeToDate.mockResolvedValue();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderCard({ initiallyScheduled: false });
    const user = userEvent.setup();
    await user.click(screen.getByTitle("Add to calendar"));
    await user.click(screen.getByRole("button", { name: /save to plan/i }));
    expect(alertMock).toHaveBeenCalledWith("Please select a date");
    expect(addRecipeToDate).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  test("valid date + breakfast slot calls addRecipeToDate correctly", async () => {
    addRecipeToDate.mockResolvedValue();
    const { container } = renderCard({ initiallyScheduled: false });
    const user = userEvent.setup();
    await user.click(screen.getByTitle("Add to calendar"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2026-04-01" },
    });
    await user.click(screen.getByRole("button", { name: /save to plan/i }));
    expect(addRecipeToDate).toHaveBeenCalledWith(mockRecipe, "2026-04-01", "breakfast");
  });

  test("calendar button becomes 'scheduled' after successful save", async () => {
    addRecipeToDate.mockResolvedValue();
    const { container } = renderCard({ initiallyScheduled: false });
    const user = userEvent.setup();
    await user.click(screen.getByTitle("Add to calendar"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2026-04-01" },
    });
    await user.click(screen.getByRole("button", { name: /save to plan/i }));
    await waitFor(() =>
      expect(screen.getByTitle("View / edit schedule")).toBeInTheDocument()
    );
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// REMOVE FROM CALENDAR
// ══════════════════════════════════════════════════════════════════════════════

describe("Remove from Calendar", () => {

  const scheduleProps = {
    initiallyScheduled: true,
    scheduledDate: "2026-03-15",
    scheduledSlot: "dinner",
  };

  test("clicking Remove calls removeRecipeFromDate with correct recipe, date, slot", async () => {
    removeRecipeFromDate.mockResolvedValue();
    renderCard(scheduleProps);
    const user = userEvent.setup();
    await user.click(screen.getByTitle("View / edit schedule"));
    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(removeRecipeFromDate).toHaveBeenCalledWith(mockRecipe, "2026-03-15", "dinner");
  });

  test("after removing the last entry, calendar icon turns unscheduled", async () => {
    removeRecipeFromDate.mockResolvedValue();
    renderCard(scheduleProps);
    const user = userEvent.setup();
    await user.click(screen.getByTitle("View / edit schedule"));
    await user.click(screen.getByRole("button", { name: /remove/i }));
    await waitFor(() =>
      expect(screen.getByTitle("Add to calendar")).toBeInTheDocument()
    );
  });

  test("onRemove callback is fired after a successful removal", async () => {
    removeRecipeFromDate.mockResolvedValue();
    const onRemove = vi.fn();
    renderCard({ ...scheduleProps, onRemove });
    const user = userEvent.setup();
    await user.click(screen.getByTitle("View / edit schedule"));
    await user.click(screen.getByRole("button", { name: /remove/i }));
    await waitFor(() => expect(onRemove).toHaveBeenCalled());
  });

});
