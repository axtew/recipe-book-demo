import { Center, Loader } from "@mantine/core";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { I18n } from "@/types/i18n.types";
import type { TLanguage } from "@/types/language.types";
import { setDisplayLanguage } from "@/utils/helpers/locale";

import { I18nContext } from "./_context";
import { setDictionary as storeDictionary } from "./_dictionary";
import { detectLanguage, readStoredLanguage, storeLanguage } from "./_language";
import { LanguageContext } from "./_languageContext";

interface IProps {
  children: ReactNode;
}

/**
 * Loads the dictionary of the current language from `public/dictionaries/` and
 * hands it to the whole tree through the context.
 *
 * The dictionary lives in `public/`, not in the bundle, so a language switch
 * needs no rebuild. On a switch the previous dictionary stays on screen until
 * the new one arrives: a full-screen loader would unmount the tree and drop an
 * open form. The display language and `<html lang>` are set in the same step
 * as the dictionary. Choosing a language whose dictionary failed to load
 * fetches it again.
 */
export function I18nProvider({ children }: IProps) {
  const [request, setRequest] = useState<{ language: TLanguage; attempt: number }>(() => ({
    language: detectLanguage(readStoredLanguage(), navigator.language),
    attempt: 0,
  }));
  const { language: requestedLanguage, attempt } = request;
  const hasFailedRef = useRef(false);
  const [loaded, setLoaded] = useState<{ data: I18n; language: TLanguage } | null>(null);

  useEffect(() => {
    let isCancelled = false;

    fetch(`/dictionaries/${requestedLanguage}.json`)
      .then((response) => response.json() as Promise<I18n>)
      .then((data) => {
        if (!isCancelled) {
          hasFailedRef.current = false;
          storeDictionary(data);
          setDisplayLanguage(requestedLanguage);
          document.documentElement.lang = requestedLanguage;
          setLoaded({ data, language: requestedLanguage });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          hasFailedRef.current = true;
        }

        console.error("Failed to load the dictionary", error);
      });

    return () => {
      isCancelled = true;
    };
    // `attempt` re-runs the effect when the same language is requested again after a failure.
  }, [requestedLanguage, attempt]);

  const setLanguage = useCallback((language: TLanguage) => {
    storeLanguage(language);
    // The same language is requested again only after a failed load: the new
    // attempt number re-runs the fetch effect.
    setRequest((previous) =>
      previous.language === language && !hasFailedRef.current
        ? previous
        : { language, attempt: previous.attempt + 1 },
    );
  }, []);

  const loadedLanguage = loaded?.language ?? requestedLanguage;
  const languageValue = useMemo(
    () => ({ language: loadedLanguage, setLanguage }),
    [loadedLanguage, setLanguage],
  );

  if (loaded === null) {
    return (
      <Center h="100dvh">
        <Loader />
      </Center>
    );
  }

  return (
    <LanguageContext.Provider value={languageValue}>
      <I18nContext.Provider value={loaded.data}>{children}</I18nContext.Provider>
    </LanguageContext.Provider>
  );
}
