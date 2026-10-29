import { describe, expect, it } from "vitest";

import type { ICookLog } from "@/types/cookLogs.types";

import { groupLogsByMonth } from "./_helpers";

function createLog(id: string, cookedAt: string): ICookLog {
  return {
    actualYieldGrams: null,
    containers: null,
    cookedAt,
    finishedAt: null,
    id,
    multiplier: 1,
    note: null,
    rating: null,
    recipeId: "recipe",
    snapshot: null,
  };
}

describe("groupLogsByMonth", () => {
  it("returns an empty list when there are no entries", () => {
    expect(groupLogsByMonth([])).toEqual([]);
  });

  it("puts the entries of one month into one group", () => {
    const groups = groupLogsByMonth([createLog("a", "2026-10-20"), createLog("b", "2026-10-03")]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ key: "2026-10", year: "2026", month: 10 });
    expect(groups[0].logs.map(({ id }) => id)).toEqual(["a", "b"]);
  });

  it("separates months and years, keeping the order from newest to oldest", () => {
    const groups = groupLogsByMonth([
      createLog("a", "2026-10-20"),
      createLog("b", "2026-09-30"),
      createLog("c", "2025-09-30"),
    ]);

    expect(groups.map(({ key }) => key)).toEqual(["2026-10", "2026-09", "2025-09"]);
  });

  it("takes the month from the date string: the first day does not slip into the previous month", () => {
    expect(groupLogsByMonth([createLog("a", "2026-01-01")])[0]).toMatchObject({
      key: "2026-01",
      month: 1,
    });
  });
});
