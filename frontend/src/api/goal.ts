import { api } from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../app/calendar/mocks/goal.mock.js";

export function getGoal() {
  return USE_MOCKS ? mock.getGoal() : api(`/goal`);
}

export function putGoal(dailyGoal: any) {
  return USE_MOCKS
    ? mock.putGoal(dailyGoal)
    : api(`/goal`, {
        method: "PUT",
        body: JSON.stringify({ dailyGoal }),
      });
}
