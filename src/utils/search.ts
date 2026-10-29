/**
 * Reduces a string to a form suitable for comparison.
 *
 * `ё` → `е` is mandatory on both sides of the comparison: without it «мед» does not find
 * «мёд», and vice versa — and on a phone people usually type without the dots.
 */
export function normalizeSearch(value: string): string {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

/**
 * Splits a query into words for matching.
 *
 * An empty result means “no query”: there is nothing to filter by.
 */
export function getSearchTokens(query: string): string[] {
  const normalized = normalizeSearch(query);

  return normalized === "" ? [] : normalized.split(/\s+/);
}

/**
 * Every query word must occur in at least one of the strings.
 *
 * The strings are already normalized texts being searched (the recipe name,
 * the names of the ingredient products): query words may be in different ones, so
 * «курица рис» finds a recipe where chicken is in the name and rice is in the ingredients.
 */
export function matchesTokens(tokens: string[], normalizedTexts: string[]): boolean {
  return tokens.every((token) => normalizedTexts.some((text) => text.includes(token)));
}
