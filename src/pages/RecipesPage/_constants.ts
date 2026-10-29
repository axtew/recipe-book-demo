import type { TCookTimeFilter } from "@/types/recipes.types";

/** Bound in minutes: the upper one is inclusive; for `over60` the lower one is exclusive. */
export const COOK_TIME_LIMIT_MIN: Record<TCookTimeFilter, number> = {
  upTo15: 15,
  upTo30: 30,
  upTo60: 60,
  over60: 60,
};

/** Identifier of the group of recipes without categories; does not collide with category UUIDs. */
export const UNCATEGORIZED_GROUP_ID = "uncategorized";

export const COLLAPSED_GROUPS_STORAGE_KEY = "recipes:collapsed-groups";
