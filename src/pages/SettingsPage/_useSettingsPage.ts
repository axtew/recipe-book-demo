import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useSignOut } from "@/hooks/useAuth.hook";
import { routerPaths } from "@/routes/_paths";

/** Выход из аккаунта: после него — экран входа и пустой кэш данных. */
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

    // Сначала уходим с защищённого экрана: пока он смонтирован, очистка кэша
    // запустила бы повторную загрузку данных уже без сессии.
    await navigate({ to: routerPaths.login, search: { redirect: routerPaths.home } });

    // Данные семьи не должны оставаться в кэше и в IndexedDB на устройстве, с которого вышли.
    queryClient.clear();
  }

  return { handleSignOut, isSignOutPending: isPending, hasSignOutError: hasError };
}
