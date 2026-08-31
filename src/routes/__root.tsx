import { Outlet, createRootRoute, redirect, useRouterState } from "@tanstack/react-router";

import { AppLayout } from "@/components/AppLayout";
import { TabBar } from "@/components/TabBar";
import { getAuthSession } from "@/hooks/useAuth.hook";

const LOGIN_PATH = "/login";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (location.pathname === LOGIN_PATH) {
      return;
    }

    const session = await getAuthSession();

    if (session === null) {
      throw redirect({ to: LOGIN_PATH, search: { redirect: location.href } });
    }
  },
  component: RootComponent,
});

/** Показывает `/login` без обвязки и таб-бара, остальные роуты — в `AppLayout` с таб-баром. */
function RootComponent() {
  const isLoginRoute = useRouterState({
    select: (state) => state.location.pathname === LOGIN_PATH,
  });

  if (isLoginRoute) {
    return <Outlet />;
  }

  return (
    <AppLayout>
      <Outlet />
      <TabBar />
    </AppLayout>
  );
}
