/**
 * Форматирование чисел для показа: КБЖУ, граммы, дни, множитель.
 *
 * Домен возвращает сырые числа — округление КБЖУ живёт здесь и только здесь.
 * Разделитель дробной части русский: интерфейс одноязычный.
 */
const macroFormat = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const multiplierFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

const decimalFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

/** Ккал — до целых. */
export function formatKcal(value: number): string {
  return String(Math.round(value));
}

/** Число до одного знака, целые без дробной части (граммы, дни). */
export function formatDecimal(value: number): string {
  return decimalFormat.format(value);
}

/** Белки, жиры, углеводы — до одного знака. */
export function formatMacro(value: number): string {
  return macroFormat.format(value);
}

/** Множитель рецепта в журнале: «×2», «×1,5», до двух знаков, как в базе. */
export function formatMultiplier(value: number): string {
  return `×${multiplierFormat.format(value)}`;
}
