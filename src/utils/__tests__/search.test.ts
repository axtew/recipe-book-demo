import { describe, expect, it } from "vitest";

import { getSearchTokens, matchesTokens, normalizeSearch } from "../search";

describe("normalizeSearch", () => {
  it("normalizes case and replaces ё with е", () => {
    expect(normalizeSearch("  Мёд ГРЕЧКА ")).toBe("мед гречка");
  });
});

describe("getSearchTokens", () => {
  it("an empty query gives no words", () => {
    expect(getSearchTokens("   ")).toEqual([]);
  });

  it("splits on any whitespace", () => {
    expect(getSearchTokens("Курица  рис")).toEqual(["курица", "рис"]);
  });
});

describe("matchesTokens", () => {
  const texts = [normalizeSearch("Плов"), normalizeSearch("Курица, филе"), normalizeSearch("Рис")];

  it("without words everything matches", () => {
    expect(matchesTokens([], texts)).toBe(true);
  });

  it("finds a word in an ingredient product name", () => {
    expect(matchesTokens(getSearchTokens("курица"), texts)).toBe(true);
  });

  it("query words may be in different strings", () => {
    expect(matchesTokens(getSearchTokens("плов рис"), texts)).toBe(true);
  });

  it("all words are required", () => {
    expect(matchesTokens(getSearchTokens("плов гречка"), texts)).toBe(false);
  });

  it("ё in the query finds е in the text and vice versa", () => {
    expect(matchesTokens(getSearchTokens("МЁД"), [normalizeSearch("мед")])).toBe(true);
    expect(matchesTokens(getSearchTokens("мед"), [normalizeSearch("Мёд")])).toBe(true);
  });
});
