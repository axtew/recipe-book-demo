/**
 * Приведение строки к виду, пригодному для сравнения.
 *
 * `ё` → `е` обязательна с обеих сторон сравнения: без неё «мед» не находит
 * «мёд», и наоборот — а набирают на телефоне обычно без точек.
 */
export function normalizeSearch(value: string): string {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

/**
 * Разбор запроса на слова для сопоставления.
 *
 * Пустой результат означает «запроса нет»: фильтровать нечем.
 */
export function getSearchTokens(query: string): string[] {
  const normalized = normalizeSearch(query);

  return normalized === "" ? [] : normalized.split(/\s+/);
}

/**
 * Каждое слово запроса должно встретиться хотя бы в одной из строк.
 *
 * Строки — уже нормализованные тексты, по которым ищут (название рецепта,
 * названия продуктов состава): слова запроса могут находиться в разных, так
 * «курица рис» находит рецепт, где курица в названии, а рис в составе.
 */
export function matchesTokens(tokens: string[], normalizedTexts: string[]): boolean {
  return tokens.every((token) => normalizedTexts.some((text) => text.includes(token)));
}
