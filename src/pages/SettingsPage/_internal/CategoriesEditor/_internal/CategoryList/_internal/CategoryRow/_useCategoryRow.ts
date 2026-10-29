import { type KeyboardEvent, useState } from "react";

import { useRenameCategoryMutation } from "@/api/mutations/categories.mutations";
import type { ICategory, TCategoryKind } from "@/types/categories.types";

/**
 * Renaming a category in place.
 *
 * Saved when leaving the field or on Enter; an empty name is not saved but rolled back to the
 * previous one — a category always has a name.
 */
export function useCategoryRow(kind: TCategoryKind, category: ICategory) {
  const { mutate } = useRenameCategoryMutation(kind);
  const [name, setName] = useState(category.name);

  function commitName() {
    const trimmed = name.trim();

    if (trimmed === "") {
      setName(category.name);
      return;
    }

    if (trimmed === category.name) {
      setName(trimmed);
      return;
    }

    setName(trimmed);
    mutate({ id: category.id, name: trimmed }, { onError: () => setName(category.name) });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.currentTarget.blur();
  }

  return { name, setName, commitName, handleKeyDown };
}
