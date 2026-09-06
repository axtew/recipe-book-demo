import { Center, Loader } from "@mantine/core";
import { type ReactNode, useEffect, useState } from "react";

import type { I18n } from "@/types/i18n.types";

import { I18nContext } from "./_context";

interface IProps {
  children: ReactNode;
}

/**
 * Загружает единственный словарь `public/dictionaries/ru.json` и раздаёт его
 * через контекст всему дереву.
 *
 * Словарь лежит в `public/`, а не импортируется как модуль — это открывает
 * путь к переключению локали без пересборки, если он когда-нибудь понадобится.
 */
export function I18nProvider({ children }: IProps) {
  const [dictionary, setDictionary] = useState<I18n | null>(null);

  useEffect(() => {
    let isCancelled = false;

    fetch("/dictionaries/ru.json")
      .then((response) => response.json() as Promise<I18n>)
      .then((data) => {
        if (!isCancelled) {
          setDictionary(data);
        }
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить словарь", error);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (dictionary === null) {
    return (
      <Center h="100dvh">
        <Loader />
      </Center>
    );
  }

  return <I18nContext.Provider value={dictionary}>{children}</I18nContext.Provider>;
}
