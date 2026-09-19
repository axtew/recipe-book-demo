/**
 * Форматирование чисел КБЖУ для показа.
 *
 * Домен возвращает сырые числа — округление живёт здесь и только здесь.
 * Разделитель дробной части русский: интерфейс одноязычный.
 */
const macroFormat = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Ккал — до целых. */
export function formatKcal(value: number): string {
  return String(Math.round(value));
}

/** Белки, жиры, углеводы — до одного знака. */
export function formatMacro(value: number): string {
  return macroFormat.format(value);
}
