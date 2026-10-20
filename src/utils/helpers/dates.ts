/**
 * Даты журнала готовки.
 *
 * Дата здесь — строка `YYYY-MM-DD` без времени и часового пояса, так же как в
 * базе. `Date` нужен только для того, чтобы узнать «сегодня» по местному
 * календарю устройства, и дальше строки не выходит.
 */
function pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

/** Сегодняшняя дата по местному календарю, `YYYY-MM-DD`. */
export function getTodayDate(now: Date = new Date()): string {
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1, 2)}-${pad(now.getDate(), 2)}`;
}

/** `YYYY-MM-DD` → `ДД.ММ.ГГГГ`. */
export function formatCookDate(date: string): string {
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
}
