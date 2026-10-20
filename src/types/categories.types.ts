/** Какой справочник категорий правится: категории продуктов или категории блюд. */
export type TCategoryKind = "product" | "dish";

/** Общая форма категории обоих справочников. */
export interface ICategory {
  id: string;
  name: string;
  sortOrder: number;
}
