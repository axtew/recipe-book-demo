import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useSignOut } from "@/hooks/useAuth.hook";
import { routerPaths } from "@/routes/_paths";

/** Signing out: afterwards comes the sign-in screen and an empty data cache. */
export function useSettingsPage() {
  const { signOut, isPending } = useSignOut();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasError, setHasError] = useState(false);

  async function handleSignOut() {
    setHasError(false);

    if (!(await signOut())) {
      setHasError(true);
      return;
    }

    // First leave the protected screen: while it is mounted, clearing the cache would trigger a
    // data reload, this time without a session.
    await navigate({ to: routerPaths.login, search: { redirect: routerPaths.home } });

    // The family's data must not stay in the cache and in IndexedDB on the device that was signed
    // out.
    queryClient.clear();
  }

  return { handleSignOut, isSignOutPending: isPending, hasSignOutError: hasError };
}
