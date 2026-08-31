import type { Session } from "@supabase/supabase-js";
import { useState } from "react";

import { supabase } from "@/api/supabase";

/**
 * Текущая сессия Supabase из локального хранилища.
 *
 * Обычная функция, а не хук — вызывается из `beforeLoad` корневого роута,
 * который выполняется вне рендера React.
 */
export async function getAuthSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
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
