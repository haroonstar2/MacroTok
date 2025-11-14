// simple in-memory mock database
const db = { days: {} };

export async function getCalendar() {
  return delay({ ...db });
}

export async function putDay(dateISO, dayData) {
  const day = new Date(dateISO).getDate();
  db.days[day] = dayData;
  return delay({ day, data: db.days[day] });
}

export async function patchSlot(dateISO, slot, data) {
  const day = new Date(dateISO).getDate();
  db.days[day] = { ...(db.days[day] || {}), [slot]: data };
  return delay({ day, data: db.days[day] });
}

export async function deleteDay(dateISO, slot) {
  const day = new Date(dateISO).getDate();
  if (slot && db.days[day]) delete db.days[day][slot];
  else delete db.days[day];
  return delay({ ok: true });
}

function delay(x) {
  return new Promise((r) => setTimeout(() => r(x), 200));
}
