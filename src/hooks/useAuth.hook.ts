import type { Session } from "@supabase/supabase-js";
import { useState } from "react";

import { supabase } from "@/api/supabase";

/**
 * The current Supabase session from local storage.
 *
 * A plain function, not a hook — it is called from the routes' `beforeLoad`, which
 * runs outside React rendering.
 */
export async function getAuthSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    // No session and a network error are otherwise indistinguishable — both silently lead to /login.
    console.warn("Failed to get the Supabase session", error);
  }

  return data.session;
}

interface IUseSignInResult {
  signIn: (email: string, password: string) => Promise<boolean>;
  isPending: boolean;
  hasError: boolean;
}

/**
 * Sign in with email and password.
 *
 * There is no sign-up — accounts are created by hand in the Supabase dashboard, so
 * the only error outcome worth showing is a wrong
 * login/password pair.
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

/** Sign out of the account. Returns `false` if Supabase did not let the user out. */
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
