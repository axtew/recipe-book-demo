import type { TLanguage } from "@/types/language.types";

/** UI languages in the order the switcher shows them. */
export const LANGUAGES: TLanguage[] = ["en", "ru"];

export const LANGUAGE_STORAGE_KEY = "recipe-book.language";

/** `Intl` locale used to format numbers and dates in each UI language. */
export const INTL_LOCALES: Record<TLanguage, string> = { en: "en-GB", ru: "ru-RU" };
