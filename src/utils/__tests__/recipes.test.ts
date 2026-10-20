import { describe, expect, it } from "vitest";

import { normalizeRecipesSearch } from "@/utils/helpers/recipes";

describe("normalizeRecipesSearch", () => {
  it("оставляет корректные поля", () => {
    expect(normalizeRecipesSearch({ q: "плов", freezable: true, time: "upTo30" })).toEqual({
      q: "плов",
      freezable: true,
      time: "upTo30",
    });
  });

  it("пустой запрос и ложные флаги отбрасываются явным undefined", () => {
    const result = normalizeRecipesSearch({ q: "   ", freezable: false });

    expect(result).toHaveProperty("q", undefined);
    expect(result).toHaveProperty("freezable", undefined);
    expect(result).toHaveProperty("time", undefined);
  });

  it("неизвестное время и прежние числовые значения отбрасываются", () => {
    expect(normalizeRecipesSearch({ time: "zzz" }).time).toBeUndefined();
    expect(normalizeRecipesSearch({ time: 60 }).time).toBeUndefined();
  });

  it("число из JSON-разбора роутера становится строкой запроса", () => {
    expect(normalizeRecipesSearch({ q: 123 }).q).toBe("123");
  });
});
