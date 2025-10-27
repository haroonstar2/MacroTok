import { api } from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/goal.mock";

export function getGoal() {
  return USE_MOCKS ? mock.getGoal() : api(`/goal`);
}

export function putGoal(dailyGoal) {
  return USE_MOCKS
    ? mock.putGoal(dailyGoal)
    : api(`/goal`, {
        method: "PUT",
        body: JSON.stringify({ dailyGoal }),
      });
}
