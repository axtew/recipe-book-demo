import type { ICookLog } from "@/types/cookLogs.types";

export interface IMonthGroup {
  /** `YYYY-MM` — ключ группы и порядок сортировки. */
  key: string;
  year: string;
  /** Номер месяца, 1–12. */
  month: number;
  logs: ICookLog[];
}

/**
 * Раскладывает записи журнала по месяцам готовки.
 *
 * Порядок записей и групп сохраняется как пришёл — сервис отдаёт журнал по
 * убыванию `cooked_at`, поэтому первой идёт самая свежая группа. Месяц берётся
 * из строки даты, без `Date`.
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
