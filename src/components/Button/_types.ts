import type { ComponentPropsWithoutRef } from "react";

/**
 * Button kind by the role of the action:
 * - `primary` — the main action;
 * - `primaryOutline` — prominent but not the main one;
 * - `secondary` — neutral (cancel, “Reset”);
 * - `danger` — confirmation of a destructive action;
 * - `dangerOutline` — a destructive action that is yet to be confirmed.
 */
export type TButtonVariant =
  "primary" | "primaryOutline" | "secondary" | "danger" | "dangerOutline";

export interface IButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "className" | "style" | "type"
> {
  variant: TButtonVariant;
  /** The type is set explicitly: a button without it inside a form submits the form. */
  type: "button" | "submit";
  /** Button as wide as its content rather than the full column width. */
  isInline?: boolean;
}
