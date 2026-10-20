import { describe, expect, it } from "vitest";

import { getSearchTokens, matchesTokens, normalizeSearch } from "../search";

describe("normalizeSearch", () => {
  it("приводит регистр и заменяет ё на е", () => {
    expect(normalizeSearch("  Мёд ГРЕЧКА ")).toBe("мед гречка");
  });
});

describe("getSearchTokens", () => {
  it("пустой запрос не даёт слов", () => {
    expect(getSearchTokens("   ")).toEqual([]);
  });

  it("делит по любым пробелам", () => {
    expect(getSearchTokens("Курица  рис")).toEqual(["курица", "рис"]);
  });
});

describe("matchesTokens", () => {
  const texts = [normalizeSearch("Плов"), normalizeSearch("Курица, филе"), normalizeSearch("Рис")];

  it("без слов подходит всё", () => {
    expect(matchesTokens([], texts)).toBe(true);
  });

  it("находит слово в названии продукта состава", () => {
    expect(matchesTokens(getSearchTokens("курица"), texts)).toBe(true);
  });

  it("слова запроса могут быть в разных строках", () => {
    expect(matchesTokens(getSearchTokens("плов рис"), texts)).toBe(true);
  });

  it("все слова обязательны", () => {
    expect(matchesTokens(getSearchTokens("плов гречка"), texts)).toBe(false);
  });

  it("ё в запросе находит е в тексте и наоборот", () => {
    expect(matchesTokens(getSearchTokens("МЁД"), [normalizeSearch("мед")])).toBe(true);
    expect(matchesTokens(getSearchTokens("мед"), [normalizeSearch("Мёд")])).toBe(true);
  });
});
