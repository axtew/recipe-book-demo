import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { TabBar } from "@/components/TabBar";
import { getAuthSession } from "@/hooks/useAuth.hook";

import { routerPaths } from "./_paths";
import { createCommonRoutes, createProtectedRoutes } from "./_routes";
import { AppLayout } from "./layouts/AppLayout";

const rootRoute = createRootRoute();

/**
 * Pathless layout-роут защищённой части: не добавляет сегмент в URL, только
 * оборачивает детей в `AppLayout` с таб-баром и охраняет их `beforeLoad`.
 */
const protectedLayoutRoute = createRoute({
  id: "protected-layout",
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ location }) => {
    const session = await getAuthSession();

    if (session === null) {
      throw redirect({ to: routerPaths.login, search: { redirect: location.href } });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <AppLayout>
      <Outlet />
      <TabBar />
    </AppLayout>
  );
}

const commonRoutes = createCommonRoutes(rootRoute);
const protectedRoutes = createProtectedRoutes(protectedLayoutRoute);

const routeTree = rootRoute.addChildren([
  ...commonRoutes,
  protectedLayoutRoute.addChildren(protectedRoutes),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
