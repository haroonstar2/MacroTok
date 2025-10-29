let store = { dailyGoal: 1900 };

export async function getGoal() {
  return delay({ ...store });
}

export async function putGoal(dailyGoal) {
  store.dailyGoal = dailyGoal;
  return delay({ ...store });
}

function delay(x) {
  return new Promise((r) => setTimeout(() => r(x), 150));
}
