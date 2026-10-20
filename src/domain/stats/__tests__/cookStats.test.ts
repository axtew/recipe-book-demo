import { describe, expect, it } from "vitest";

import { calculateCookStats } from "@/domain/stats";
import type { ICookLog } from "@/types/cookLogs.types";

function createLog(overrides: Partial<ICookLog>): ICookLog {
  return {
    actualYieldGrams: null,
    containers: null,
    cookedAt: "2026-10-01",
    finishedAt: null,
    id: "log",
    multiplier: 1,
    note: null,
    rating: null,
    recipeId: "recipe",
    snapshot: null,
    ...overrides,
  };
}

/** Среднее число дней до «доели» для одной записи — разность дат. */
function daysBetween(cookedAt: string, finishedAt: string): number | null {
  return calculateCookStats([createLog({ cookedAt, finishedAt })]).averageDaysToFinish;
}

describe("разность дат cookedAt / finishedAt", () => {
  it("считает дни внутри месяца", () => {
    expect(daysBetween("2026-10-18", "2026-10-20")).toBe(2);
  });

  it("переходит через конец месяца и года", () => {
    expect(daysBetween("2026-02-28", "2026-03-01")).toBe(1);
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
  });

  it("учитывает високосный год", () => {
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(daysBetween("2027-02-28", "2027-03-01")).toBe(1);
  });

  it("считает целый год", () => {
    expect(daysBetween("2026-01-01", "2027-01-01")).toBe(365);
    expect(daysBetween("2028-01-01", "2029-01-01")).toBe(366);
  });
});

describe("calculateCookStats", () => {
  it("без записей даёт нули и отсутствующие значения", () => {
    expect(calculateCookStats([])).toEqual({
      count: 0,
      lastCookedAt: null,
      averageYieldGrams: null,
      averageDaysToFinish: null,
    });
  });

  it("работает с единственной записью без выхода и без «доели»", () => {
    expect(calculateCookStats([createLog({})])).toEqual({
      count: 1,
      lastCookedAt: "2026-10-01",
      averageYieldGrams: null,
      averageDaysToFinish: null,
    });
  });

  it("берёт самую позднюю дату независимо от порядка записей", () => {
    const stats = calculateCookStats([
      createLog({ cookedAt: "2026-09-05" }),
      createLog({ cookedAt: "2026-10-12" }),
      createLog({ cookedAt: "2026-08-30" }),
    ]);

    expect(stats.lastCookedAt).toBe("2026-10-12");
  });

  it("усредняет только записи с заполненным значением, нулевой выход считается", () => {
    const stats = calculateCookStats([
      createLog({ actualYieldGrams: 1000, cookedAt: "2026-10-01", finishedAt: "2026-10-04" }),
      createLog({ actualYieldGrams: 0, cookedAt: "2026-10-10", finishedAt: "2026-10-10" }),
      createLog({ actualYieldGrams: null, cookedAt: "2026-10-15" }),
    ]);

    expect(stats.averageYieldGrams).toBe(500);
    expect(stats.averageDaysToFinish).toBe(1.5);
  });
});
