import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import type { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

/**
 * Срок жизни данных — и в памяти, и в снапшоте на диске.
 *
 * Неделя, а не дефолтные 5 минут: данные должны переживать многодневные обрывы
 * международной связности (`decisions.md §3`). Константа одна на обе настройки
 * намеренно — это два независимых параметра с разными дефолтами, и заданные по
 * отдельности они однажды разъедутся.
 */
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

/**
 * Версия формы персистируемых данных — не версия приложения.
 *
 * Поднимать при изменении сущностей, попадающих в кэш: снапшот старой формы
 * будет выброшен целиком, вместо того чтобы гидрироваться в новый код и сломать
 * экран на отсутствующем поле. Шаг `B7` в `backend-track.md` напоминает об этом
 * в чек-листе правки схемы.
 *
 * Не привязывать к версии сборки или хэшу: выкатки идут на каждый пуш, и тогда
 * офлайн-кэш обнулялся бы каждый раз — ровно то, ради чего он и заведён.
 */
const CACHE_BUSTER = "v1";

export const queryClient = new QueryClient({
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
