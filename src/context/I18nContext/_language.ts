import { LANGUAGE_STORAGE_KEY, LANGUAGES } from "@/constants/i18n.constants";
import type { TLanguage } from "@/types/language.types";

/**
 * Picks the UI language: a stored choice wins, otherwise a Russian browser gets
 * Russian and everything else gets English. Only the primary browser language
 * counts, not the whole preference list.
 */
export function detectLanguage(stored: string | null, browserLanguage: string): TLanguage {
  const storedLanguage = LANGUAGES.find((language) => language === stored);

  if (storedLanguage !== undefined) return storedLanguage;

  return browserLanguage.toLowerCase().startsWith("ru") ? "ru" : "en";
}

/** Raw stored value; storage may be unavailable (private mode), then there is no choice. */
export function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Remembers an explicit choice. A failed write is skipped: the choice then lasts until reload. */
export function storeLanguage(language: TLanguage) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage is a convenience here, not data.
  }
}
