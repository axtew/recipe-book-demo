import dayjs from "dayjs";

import { getDisplayLanguage } from "@/utils/helpers/locale";

/**
 * Cook log dates.
 *
 * A date here is a `YYYY-MM-DD` string without time or time zone, same as in
 * the database. `Date` is needed only to find out "today" by the device's local
 * calendar and never leaves this file as a value.
 */
function pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

/** Today's date by the local calendar, `YYYY-MM-DD`. */
export function getTodayDate(now: Date = new Date()): string {
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1, 2)}-${pad(now.getDate(), 2)}`;
}

/** `YYYY-MM-DD` → `DD.MM.YYYY` in Russian, `D MMM YYYY` in English. */
export function formatCookDate(date: string): string {
  if (getDisplayLanguage() === "en") {
    // dayjs, not Intl: newer ICU prints "Sept" for the English short month.
    return dayjs(date).locale("en").format("D MMM YYYY");
  }

  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
}
