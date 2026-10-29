import { describe, expect, it } from "vitest";

import { normalizeRecipesSearch } from "@/utils/helpers/recipes";

describe("normalizeRecipesSearch", () => {
  it("keeps valid fields", () => {
    expect(normalizeRecipesSearch({ q: "pilaf", freezable: true, time: "upTo30" })).toEqual({
      q: "pilaf",
      freezable: true,
      time: "upTo30",
    });
  });

  it("an empty query and false flags are dropped with an explicit undefined", () => {
    const result = normalizeRecipesSearch({ q: "   ", freezable: false });

    expect(result).toHaveProperty("q", undefined);
    expect(result).toHaveProperty("freezable", undefined);
    expect(result).toHaveProperty("time", undefined);
  });

  it("an unknown time and old numeric values are dropped", () => {
    expect(normalizeRecipesSearch({ time: "zzz" }).time).toBeUndefined();
    expect(normalizeRecipesSearch({ time: 60 }).time).toBeUndefined();
  });

  it("a number from the router's JSON parsing becomes a query string", () => {
    expect(normalizeRecipesSearch({ q: 123 }).q).toBe("123");
  });
});
