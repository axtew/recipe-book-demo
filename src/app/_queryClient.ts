import { notifications } from "@mantine/notifications";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import type { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

import { CACHE_BUSTER, CACHE_MAX_AGE } from "@/constants/caching.constants";
import { getDictionary } from "@/context/I18nContext";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      // Общее сообщение на любую неудавшуюся запись. Частные случаи вроде
      // «продукт с таким именем уже есть» разбираются в onError самой мутации.
      console.error(error);

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

const queryPersister = createAsyncStoragePersister({ storage: idbStorage });

export const persistOptions: PersistQueryClientProviderProps["persistOptions"] = {
  persister: queryPersister,
  maxAge: CACHE_MAX_AGE,
  buster: CACHE_BUSTER,
};
