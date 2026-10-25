import { INTL_LOCALES } from "@/constants/i18n.constants";
import type { TLanguage } from "@/types/language.types";
import { getDisplayLanguage } from "@/utils/helpers/locale";

/**
 * Number formatting for display: nutrition values, grams, days, multiplier.
 *
 * The domain returns raw numbers — rounding of nutrition values lives here and
 * only here. The decimal separator follows the display language.
 */
interface IFormats {
  macro: Intl.NumberFormat;
  multiplier: Intl.NumberFormat;
  decimal: Intl.NumberFormat;
}

function createFormats(language: TLanguage): IFormats {
  const locale = INTL_LOCALES[language];

  return {
    macro: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    multiplier: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    decimal: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
  };
}

const formatsByLanguage: Record<TLanguage, IFormats> = {
  en: createFormats("en"),
  ru: createFormats("ru"),
};

function getFormats(): IFormats {
  return formatsByLanguage[getDisplayLanguage()];
}

/** Kcal — rounded to whole numbers. */
export function formatKcal(value: number): string {
  return String(Math.round(value));
}

/** A number with one decimal place at most; whole numbers have no fraction (grams, days). */
export function formatDecimal(value: number): string {
  return getFormats().decimal.format(value);
}

/** Protein, fat, carbohydrates — one decimal place. */
export function formatMacro(value: number): string {
  return getFormats().macro.format(value);
}

/** Recipe multiplier in the log: "×2", "×1.5", up to two decimals, as in the database. */
export function formatMultiplier(value: number): string {
  return `×${getFormats().multiplier.format(value)}`;
}
