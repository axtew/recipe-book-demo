/**
 * The only meaningful width in the project is the ceiling of the content column.
 * A desktop layout is deliberately not designed (ADR 0001, docs/decisions/0001-personal-app-for-two.md).
 */
export const breakpoints = {
  contentMaxWidth: "600px",
} as const;
