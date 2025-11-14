import { api } from "./client";
import { USE_MOCKS } from "../config";
import * as mock from "../mocks/calendar.mock";

/**
 * Calendar API — switch between mock and real backend.
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
