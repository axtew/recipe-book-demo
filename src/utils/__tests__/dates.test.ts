import { afterEach, describe, expect, it } from "vitest";

import { formatCookDate, getTodayDate } from "@/utils/helpers/dates";
import { setDisplayLanguage } from "@/utils/helpers/locale";

afterEach(() => {
  setDisplayLanguage("ru");
});

describe("getTodayDate", () => {
  it("builds the date from local parts with leading zeros", () => {
    expect(getTodayDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("does not shift the date near midnight", () => {
    expect(getTodayDate(new Date(2026, 9, 20, 0, 0, 1))).toBe("2026-10-20");
    expect(getTodayDate(new Date(2026, 11, 31, 23, 59, 59))).toBe("2026-12-31");
  });
});

describe("formatCookDate", () => {
  it("reorders the date parts in Russian", () => {
    setDisplayLanguage("ru");

    expect(formatCookDate("2026-10-05")).toBe("05.10.2026");
  });

  it("prints day, short month and year in English", () => {
    setDisplayLanguage("en");

    expect(formatCookDate("2026-10-05")).toBe("5 Oct 2026");
  });

  it("uses the three-letter short form for September in English", () => {
    setDisplayLanguage("en");

    expect(formatCookDate("2026-09-30")).toBe("30 Sep 2026");
  });
});
