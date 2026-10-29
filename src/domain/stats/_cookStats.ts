import type { ICookLog } from "@/types/cookLogs.types";

type TStatsLog = Pick<ICookLog, "cookedAt" | "finishedAt" | "actualYieldGrams">;

interface ICookStats {
  count: number;
  /** Date of the last cooking, `YYYY-MM-DD`. */
  lastCookedAt: string | null;
  averageYieldGrams: number | null;
  averageDaysToFinish: number | null;
}

/**
 * Ordinal day number in the Gregorian calendar.
 *
 * The date is a `YYYY-MM-DD` string without a time zone, so the day difference
 * is computed with arithmetic on the numbers rather than through `Date`: there the daylight saving
 * switch would give fractional days.
 */
function toDayNumber(date: string): number {
  const [year, month, day] = date.split("-").map(Number);

  const shiftedYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(shiftedYear / 400);
  const yearOfEra = shiftedYear - era * 400;
  const dayOfYear = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;

  return era * 146097 + dayOfEra;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Recipe statistics from cook log entries: how many times it was cooked, when it was
 * last cooked, the average actual yield and the average number of days from cooking to
 * “finished”. Entries without a yield or without a finished date do not count
 * toward the corresponding average, rather than counting as zeros.
 */
export function calculateCookStats(logs: TStatsLog[]): ICookStats {
  const lastCookedAt = logs.reduce<string | null>(
    (latest, log) => (latest === null || log.cookedAt > latest ? log.cookedAt : latest),
    null,
  );

  const yields = logs.flatMap((log) =>
    log.actualYieldGrams === null ? [] : [log.actualYieldGrams],
  );
  const daysToFinish = logs.flatMap((log) =>
    log.finishedAt === null ? [] : [toDayNumber(log.finishedAt) - toDayNumber(log.cookedAt)],
  );

  return {
    count: logs.length,
    lastCookedAt,
    averageYieldGrams: average(yields),
    averageDaysToFinish: average(daysToFinish),
  };
}
