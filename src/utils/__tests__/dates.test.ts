import { describe, expect, it } from "vitest";

import { formatCookDate, getTodayDate } from "@/utils/helpers/dates";

describe("getTodayDate", () => {
  it("собирает дату из местных частей с ведущими нулями", () => {
    expect(getTodayDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("не сдвигает дату около полуночи", () => {
    expect(getTodayDate(new Date(2026, 9, 20, 0, 0, 1))).toBe("2026-10-20");
    expect(getTodayDate(new Date(2026, 11, 31, 23, 59, 59))).toBe("2026-12-31");
  });
});

describe("formatCookDate", () => {
  it("переставляет части даты", () => {
    expect(formatCookDate("2026-10-05")).toBe("05.10.2026");
  });
});
