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

/** Average number of days until “finished” for one entry — the date difference. */
function daysBetween(cookedAt: string, finishedAt: string): number | null {
  return calculateCookStats([createLog({ cookedAt, finishedAt })]).averageDaysToFinish;
}

describe("cookedAt / finishedAt date difference", () => {
  it("counts days within a month", () => {
    expect(daysBetween("2026-10-18", "2026-10-20")).toBe(2);
  });

  it("crosses a month and year boundary", () => {
    expect(daysBetween("2026-02-28", "2026-03-01")).toBe(1);
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
  });

  it("accounts for a leap year", () => {
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(daysBetween("2027-02-28", "2027-03-01")).toBe(1);
  });

  it("counts a whole year", () => {
    expect(daysBetween("2026-01-01", "2027-01-01")).toBe(365);
    expect(daysBetween("2028-01-01", "2029-01-01")).toBe(366);
  });
});

describe("calculateCookStats", () => {
  it("without entries gives zeros and missing values", () => {
    expect(calculateCookStats([])).toEqual({
      count: 0,
      lastCookedAt: null,
      averageYieldGrams: null,
      averageDaysToFinish: null,
    });
  });

  it("handles a single entry without a yield and without “finished”", () => {
    expect(calculateCookStats([createLog({})])).toEqual({
      count: 1,
      lastCookedAt: "2026-10-01",
      averageYieldGrams: null,
      averageDaysToFinish: null,
    });
  });

  it("takes the latest date regardless of entry order", () => {
    const stats = calculateCookStats([
      createLog({ cookedAt: "2026-09-05" }),
      createLog({ cookedAt: "2026-10-12" }),
      createLog({ cookedAt: "2026-08-30" }),
    ]);

    expect(stats.lastCookedAt).toBe("2026-10-12");
  });

  it("averages only entries with a value, a zero yield counts", () => {
    const stats = calculateCookStats([
      createLog({ actualYieldGrams: 1000, cookedAt: "2026-10-01", finishedAt: "2026-10-04" }),
      createLog({ actualYieldGrams: 0, cookedAt: "2026-10-10", finishedAt: "2026-10-10" }),
      createLog({ actualYieldGrams: null, cookedAt: "2026-10-15" }),
    ]);

    expect(stats.averageYieldGrams).toBe(500);
    expect(stats.averageDaysToFinish).toBe(1.5);
  });
});
