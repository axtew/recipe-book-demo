import type { ComponentPropsWithoutRef } from "react";

/**
 * Вид кнопки по роли действия:
 * - `primary` — главное действие;
 * - `primaryOutline` — заметное, но не главное;
 * - `secondary` — нейтральное (отмена, «Сбросить»);
 * - `danger` — подтверждение разрушающего действия;
 * - `dangerOutline` — разрушающее действие, которое ещё предстоит подтвердить.
 */
export type TButtonVariant =
  "primary" | "primaryOutline" | "secondary" | "danger" | "dangerOutline";

export interface IButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "className" | "style" | "type"
> {
  variant: TButtonVariant;
  /** Тип задаётся явно: кнопка без него внутри формы отправляет её. */
  type: "button" | "submit";
  /** Кнопка по ширине содержимого, а не на всю ширину колонки. */
  isInline?: boolean;
}
