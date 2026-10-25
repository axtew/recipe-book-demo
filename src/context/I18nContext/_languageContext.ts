import { createContext } from "react";

import type { TLanguage } from "@/types/language.types";

export interface ILanguageContext {
  /** Language of the dictionary currently shown. */
  language: TLanguage;
  /** Stores the choice and loads the dictionary. */
  setLanguage: (language: TLanguage) => void;
}

export const LanguageContext = createContext<ILanguageContext | null>(null);
