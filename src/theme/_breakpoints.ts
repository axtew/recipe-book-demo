/**
 * Единственная значимая ширина в проекте — потолок контентной колонки.
 * Десктопный layout сознательно не проектируется (ADR 0001, docs/decisions/0001-personal-app-for-two.md).
 */
export const breakpoints = {
  contentMaxWidth: "600px",
} as const;
