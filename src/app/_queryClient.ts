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
      /** The mutation shows its own error next to its block: the general save notification is not needed. */
      showsOwnError?: boolean;
    };
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      // General message for any failed write. Specific cases such as
      // “product with this name already exists” are handled in the mutation's own onError.
      console.error(error);

      // Mutations that show their own error next to their block (`meta.showsOwnError`)
      // do not get the general notification: it would talk about “saving” where
      // nothing was saved.
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

/** idb-keyval adapter for the AsyncStorage interface expected by the TanStack Query persister. */
const idbStorage = {
  getItem: async (key: string) => (await get<string>(key)) ?? null,
  setItem: (key: string, value: string) => set(key, value),
  removeItem: (key: string) => del(key),
};

/**
 * Stub persister for the demo build. Once a night the demo database is reset to the reference state,
 * and a cache snapshot from IndexedDB of a returning visitor refers to rows that
 * no longer exist: the nutrition module throws on such a dangling reference, and the screen crashes.
 * Without reading the snapshot every visit starts with a request to the server; the cache is
 * neither serialized nor written.
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
