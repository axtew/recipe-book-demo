import { useReorderCategoriesMutation } from "@/api/mutations/categories.mutations";
import type { ICategory, TCategoryKind } from "@/types/categories.types";

/** Moving a category to the adjacent position: the new order goes to the database as a whole. */
export function useCategoryList(kind: TCategoryKind, categories: ICategory[]) {
  const { mutate, isPending } = useReorderCategoriesMutation(kind);

  function moveCategory(index: number, offset: -1 | 1) {
    const next = [...categories];
    const target = index + offset;

    [next[index], next[target]] = [next[target], next[index]];

    mutate(next);
  }

  return { moveCategory, isPending };
}
