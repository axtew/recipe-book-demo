import type { Session } from "@supabase/supabase-js";
import { useState } from "react";

import { supabase } from "@/api/supabase";

/**
 * Текущая сессия Supabase из локального хранилища.
 *
 * Обычная функция, а не хук — вызывается из `beforeLoad` роутов, который
 * выполняется вне рендера React.
 */
export async function getAuthSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    // Отсутствие сессии и сетевая ошибка иначе неотличимы — обе ведут на /login молча.
    console.warn("Не удалось получить сессию Supabase", error);
  }

  return data.session;
}

interface IUseSignInResult {
  signIn: (email: string, password: string) => Promise<boolean>;
  isPending: boolean;
  hasError: boolean;
}

/**
 * Вход по email и паролю.
 *
 * Регистрации нет — аккаунты заводятся вручную в дашборде Supabase, поэтому
 * единственный исход ошибки, который имеет смысл показывать, — неверная пара
 * логин/пароль.
 */
export function useSignIn(): IUseSignInResult {
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function signIn(email: string, password: string): Promise<boolean> {
    setIsPending(true);
    setHasError(false);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsPending(false);

    if (error) {
      setHasError(true);
      return false;
    }

    return true;
  }

  return { signIn, isPending, hasError };
}

interface IUseSignOutResult {
  signOut: () => Promise<boolean>;
  isPending: boolean;
}

/** Выход из аккаунта. Возвращает `false`, если Supabase выйти не дал. */
export function useSignOut(): IUseSignOutResult {
  const [isPending, setIsPending] = useState(false);

  async function signOut(): Promise<boolean> {
    setIsPending(true);

    const { error } = await supabase.auth.signOut();

    setIsPending(false);

    return error === null;
  }

  return { signOut, isPending };
}
