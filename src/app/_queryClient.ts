import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { del, get, set } from "idb-keyval";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные должны переживать многодневные обрывы международной связности
      // (decisions.md §3) — кэш живёт неделю, а не дефолтные 5 минут.
      gcTime: 1000 * 60 * 60 * 24 * 7,
    },
  },
});

/** Адаптер idb-keyval под интерфейс AsyncStorage, ожидаемый персистером TanStack Query. */
const idbStorage = {
  getItem: async (key: string) => (await get<string>(key)) ?? null,
  setItem: (key: string, value: string) => set(key, value),
  removeItem: (key: string) => del(key),
};

export const queryPersister = createAsyncStoragePersister({ storage: idbStorage });
