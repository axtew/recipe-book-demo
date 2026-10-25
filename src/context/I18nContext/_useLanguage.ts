import { useContext } from "react";

import { type ILanguageContext, LanguageContext } from "./_languageContext";

/** Current UI language and its setter. */
export function useLanguage(): ILanguageContext {
  const value = useContext(LanguageContext);

  if (value === null) {
    throw new Error("useLanguage called outside I18nProvider or before the dictionary is loaded");
  }

  return value;
}
