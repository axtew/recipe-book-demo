import { useState } from "react";

import { COLLAPSED_GROUPS_STORAGE_KEY } from "./_constants";

function readCollapsed(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(COLLAPSED_GROUPS_STORAGE_KEY) ?? "[]");

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * Свёрнутые группы списка рецептов: переживают перезагрузку через localStorage.
 *
 * Недоступное хранилище не ломает экран — группы просто не запоминаются.
 */
export function useCollapsedGroups() {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggle = (groupId: string) => {
    const next = collapsed.includes(groupId)
      ? collapsed.filter((id) => id !== groupId)
      : [...collapsed, groupId];

    setCollapsed(next);

    try {
      localStorage.setItem(COLLAPSED_GROUPS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Хранилище недоступно — состояние живёт до закрытия вкладки.
    }
  };

  return { isCollapsed: (groupId: string) => collapsed.includes(groupId), toggle };
}
