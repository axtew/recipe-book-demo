import { notifications } from "@mantine/notifications";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import type {
  Persister,
  PersistQueryClientProviderProps,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

import { CACHE_BUSTER, CACHE_MAX_AGE } from "@/constants/caching.constants";
import { getDictionary } from "@/context/I18nContext";
import { env } from "@/utils/env";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /** Мутация сама показывает ошибку у своего блока: общее уведомление о сохранении не нужно. */
      showsOwnError?: boolean;
    };
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      // Общее сообщение на любую неудавшуюся запись. Частные случаи вроде
      // «продукт с таким именем уже есть» разбираются в onError самой мутации.
      console.error(error);

      // Мутации, которые сами показывают ошибку у своего блока (`meta.showsOwnError`),
      // общее уведомление не получают: оно говорило бы про «сохранение» там,
      // где ничего не сохранялось.
      if (mutation.meta?.showsOwnError === true) return;

      const l = getDictionary();

      if (l !== null) {
        notifications.show({ color: "danger", message: l.mutation.error });
      }
    },
  }),
  defaultOptions: {
    queries: {
      gcTime: CACHE_MAX_AGE,
    },
  },
});

/** Адаптер idb-keyval под интерфейс AsyncStorage, ожидаемый персистером TanStack Query. */
const idbStorage = {
  getItem: async (key: string) => (await get<string>(key)) ?? null,
  setItem: (key: string, value: string) => set(key, value),
  removeItem: (key: string) => del(key),
};

/**
 * Персистер-пустышка для демо-сборки. Раз в ночь демо-база сбрасывается к эталону,
 * и снимок кэша из IndexedDB вернувшегося посетителя ссылается на строки, которых
 * уже нет: модуль расчёта бросает исключение на такой висячей ссылке, и экран падает.
 * Без чтения снимка каждый визит начинается с запроса к серверу; кэш не
 * сериализуется и не пишется.
 */
const noopPersister: Persister = {
  persistClient: async () => undefined,
  restoreClient: async () => undefined,
  removeClient: async () => undefined,
};

const queryPersister = env.isDemo
  ? noopPersister
  : createAsyncStoragePersister({ storage: idbStorage });

export const persistOptions: PersistQueryClientProviderProps["persistOptions"] = {
  persister: queryPersister,
  maxAge: CACHE_MAX_AGE,
  buster: CACHE_BUSTER,
};
