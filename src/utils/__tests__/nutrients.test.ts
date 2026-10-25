import { afterEach, describe, expect, it } from "vitest";

import { setDisplayLanguage } from "@/utils/helpers/locale";
import {
  formatDecimal,
  formatKcal,
  formatMacro,
  formatMultiplier,
} from "@/utils/helpers/nutrients";

afterEach(() => {
  setDisplayLanguage("ru");
});

describe("number formats in Russian", () => {
  it("uses a decimal comma and a space as the thousands separator", () => {
    setDisplayLanguage("ru");

    expect(formatMacro(12.5)).toBe("12,5");
    expect(formatDecimal(1234.5)).toBe("1\u00A0234,5");
    expect(formatMultiplier(1.5)).toBe("×1,5");
  });
});

describe("number formats in English", () => {
  it("uses a decimal point and a comma as the thousands separator", () => {
    setDisplayLanguage("en");

    expect(formatMacro(12.5)).toBe("12.5");
    expect(formatDecimal(1234.5)).toBe("1,234.5");
    expect(formatMultiplier(1.5)).toBe("×1.5");
  });

  it("keeps one decimal place for macros and drops it for whole decimals", () => {
    setDisplayLanguage("en");

    expect(formatMacro(3)).toBe("3.0");
    expect(formatDecimal(3)).toBe("3");
  });
});

describe("formatKcal", () => {
  it("rounds to whole numbers in both languages", () => {
    expect(formatKcal(99.6)).toBe("100");

    setDisplayLanguage("en");

    expect(formatKcal(99.4)).toBe("99");
  });
});
