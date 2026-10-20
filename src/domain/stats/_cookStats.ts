import type { ICookLog } from "@/types/cookLogs.types";

type TStatsLog = Pick<ICookLog, "cookedAt" | "finishedAt" | "actualYieldGrams">;

interface ICookStats {
  count: number;
  /** Дата последней готовки, `YYYY-MM-DD`. */
  lastCookedAt: string | null;
  averageYieldGrams: number | null;
  averageDaysToFinish: number | null;
}

/**
 * Порядковый номер дня по григорианскому календарю.
 *
 * Дата — строка `YYYY-MM-DD` без часового пояса, поэтому разность дней
 * считается арифметикой над номерами, а не через `Date`: там переход на летнее
 * время давал бы дробные сутки.
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
 * Статистика рецепта по записям журнала: сколько раз готовили, когда в
 * последний раз, средний фактический выход и среднее число дней от готовки до
 * «доели». Записи без выхода или без даты «доели» в соответствующее среднее не
 * входят, а не считаются нулями.
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
