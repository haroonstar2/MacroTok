import { api } from "./client";
import { USE_MOCKS } from "./config";
import * as mock from "../app/calendar/mocks/calendar.mock.js";

// Import Firebase dependencies for Firestore functionality
import { db, auth } from "../startFirebase.js";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
} from "firebase/firestore";

/**
 * Checks if a specific recipe is already scheduled for a specific date and slot.
 */
export async function getIsRecipeScheduled(
  recipeId,
  dateISO,
  slot = "recipes",
) {
  const user = auth.currentUser;
  if (!user) return false;

  const calendarRef = doc(db, "users", user.uid, "calendar", dateISO);
  const docSnap = await getDoc(calendarRef);

  if (docSnap.exists()) {
    const recipes = docSnap.data()[slot] || [];
    return recipes.some((r) => String(r.id) === String(recipeId));
  }
  return false;
}

/**
 * Fetches all unique recipe IDs scheduled globally in the calendar.
 * Useful for highlighting the icon on the Home/Feed page.
 */
export async function getScheduledRecipeIds() {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const calendarColl = collection(db, "users", user.uid, "calendar");
    const snapshot = await getDocs(calendarColl);

    const scheduledIds = new Set();
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Iterate through common meal slots to find IDs
      const slots = ["breakfast", "lunch", "dinner"];
      slots.forEach((slot) => {
        if (data[slot] && Array.isArray(data[slot])) {
          data[slot].forEach((r) => {
            if (r.id) scheduledIds.add(String(r.id));
          });
        }
      });
    });

    return Array.from(scheduledIds);
  } catch (error) {
    console.error("Error fetching scheduled IDs:", error);
    return [];
  }
}

/**
 * Adds a recipe to a specific date in Firestore.
 */
export async function addRecipeToDate(recipe, dateISO, slot = "breakfast") {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in.");

  const calendarRef = doc(db, "users", user.uid, "calendar", dateISO);

  // We structure the object exactly as it will be stored
  const recipeData = {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes || null,
    nutrition: recipe.nutrition || null,
    extendedIngredients: recipe.extendedIngredients || [],
  };

  return await setDoc(
    calendarRef,
    {
      date: dateISO,
      [slot]: arrayUnion(recipeData),
    },
    { merge: true },
  );
}

/**
 * Removes a recipe from a specific date in Firestore.
 * We fetch the stored document first so arrayRemove always gets an exact match,
 * regardless of the shape of the caller's recipe object.
 */
export async function removeRecipeFromDate(
  recipe,
  dateISO,
  slot = "breakfast",
) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in.");

  const calendarRef = doc(db, "users", user.uid, "calendar", dateISO);

  // Read the exact stored object so arrayRemove can match it precisely
  const docSnap = await getDoc(calendarRef);
  if (!docSnap.exists()) return;

  const storedSlot = docSnap.data()[slot] || [];
  const storedRecipe = storedSlot.find(
    (r) => String(r.id) === String(recipe.id),
  );
  if (!storedRecipe) return; // already removed or never there

  return await updateDoc(calendarRef, {
    [slot]: arrayRemove(storedRecipe),
  });
}

/**
 * Returns all {date, slot} entries where a recipe is scheduled.
 * Used so the card can show every date a dish is already planned.
 */
export async function getScheduledEntriesForRecipe(recipeId) {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const calendarColl = collection(db, "users", user.uid, "calendar");
    const snapshot = await getDocs(calendarColl);

    const entries = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const dateISO = docSnap.id;
      ["breakfast", "lunch", "dinner"].forEach((slot) => {
        if (
          Array.isArray(data[slot]) &&
          data[slot].some((r) => String(r.id) === String(recipeId))
        ) {
          entries.push({ date: dateISO, slot });
        }
      });
    });

    return entries;
  } catch (error) {
    console.error("Error fetching scheduled entries:", error);
    return [];
  }
}

/**
 * Standard API Helpers
 */
export function getCalendar({ year, month }) {
  return USE_MOCKS
    ? mock.getCalendar({ year, month })
    : api(`/calendar?year=${year}&month=${String(month).padStart(2, "0")}`);
}

export function putDay(dateISO, dayData) {
  return USE_MOCKS
    ? mock.putDay(dateISO, dayData)
    : api(`/calendar/${dateISO}`, {
        method: "PUT",
        body: JSON.stringify(dayData),
      });
}

export function patchSlot(dateISO, slot, data) {
  return USE_MOCKS
    ? mock.patchSlot(dateISO, slot, data)
    : api(`/calendar/${dateISO}`, {
        method: "PATCH",
        body: JSON.stringify({ slot, data }),
      });
}

export function deleteDay(dateISO, slot) {
  const qs = slot ? `?slot=${slot}` : "";
  return USE_MOCKS
    ? mock.deleteDay(dateISO, slot)
    : api(`/calendar/${dateISO}${qs}`, { method: "DELETE" });
}
