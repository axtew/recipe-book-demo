import type { TLanguage } from "@/types/language.types";

/**
 * Language of the dictionary currently on screen, for code that lives outside
 * React — number and date formatters.
 *
 * Set by the i18n provider together with the dictionary, so a render never
 * mixes labels of one language with formats of another. The default keeps the
 * current output for code and tests that run without the provider.
 */
let displayLanguage: TLanguage = "ru";

export function setDisplayLanguage(value: TLanguage) {
  displayLanguage = value;
}

export function getDisplayLanguage(): TLanguage {
  return displayLanguage;
}
