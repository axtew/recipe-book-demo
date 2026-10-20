import { type KeyboardEvent, useState } from "react";

import { useRenameCategoryMutation } from "@/api/mutations/categories.mutations";
import type { ICategory, TCategoryKind } from "@/types/categories.types";

/**
 * Переименование категории на месте.
 *
 * Сохраняется при уходе из поля или по Enter; пустое название не сохраняется, а
 * откатывается к прежнему — у категории всегда есть имя.
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
