import type { ICookLog } from "@/types/cookLogs.types";

export interface IMonthGroup {
  /** `YYYY-MM` — the group key and the sort order. */
  key: string;
  year: string;
  /** Month number, 1–12. */
  month: number;
  logs: ICookLog[];
}

/**
 * Lays out the log entries by the month of cooking.
 *
 * The order of entries and groups is kept as received — the service returns the log in descending
 * `cooked_at` order, so the newest group comes first. The month is taken from the date string,
 * without `Date`.
 */
export function groupLogsByMonth(logs: ICookLog[]): IMonthGroup[] {
  const groups: IMonthGroup[] = [];

  for (const log of logs) {
    const [year, month] = log.cookedAt.split("-");
    const key = `${year}-${month}`;
    const last = groups.at(-1);

    if (last?.key === key) {
      last.logs.push(log);
    } else {
      groups.push({ key, year, month: Number(month), logs: [log] });
    }
  }

  return groups;
}
