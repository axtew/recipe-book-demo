/** Which category dictionary is being edited: product categories or dish categories. */
export type TCategoryKind = "product" | "dish";

/** Common category shape of both dictionaries. */
export interface ICategory {
  id: string;
  name: string;
  sortOrder: number;
}
