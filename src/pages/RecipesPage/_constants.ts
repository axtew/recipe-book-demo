import type { TCookTimeFilter } from "@/types/recipes.types";

/** Граница в минутах: верхняя нестрогая; для `over60` — нижняя строгая. */
export const COOK_TIME_LIMIT_MIN: Record<TCookTimeFilter, number> = {
  upTo15: 15,
  upTo30: 30,
  upTo60: 60,
  over60: 60,
};

/** Идентификатор группы рецептов без категорий; не пересекается с UUID категорий. */
export const UNCATEGORIZED_GROUP_ID = "uncategorized";

export const COLLAPSED_GROUPS_STORAGE_KEY = "recipes:collapsed-groups";
