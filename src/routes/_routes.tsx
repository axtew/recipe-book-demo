import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";

import { RouteStub } from "@/components/RouteStub";
import { useI18nSelector } from "@/context/I18nContext";
import { getAuthSession } from "@/hooks/useAuth.hook";
import { LoginPage } from "@/pages/LoginPage";

import { routerPaths } from "./_paths";

interface ILoginSearch {
  redirect: string;
}

/**
 * Роуты вне защищённой части — сейчас только логин.
 *
 * Принимают корневой роут параметром, а не импортируют его напрямую из
 * `AppRouter.tsx`: тот сам собирает дерево из этого модуля, и обратный импорт
 * дал бы циклическую зависимость между двумя файлами.
 */
export function createCommonRoutes(rootRoute: AnyRoute) {
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: routerPaths.login,
    validateSearch: (search: Record<string, unknown>): ILoginSearch => ({
      redirect: typeof search.redirect === "string" ? search.redirect : routerPaths.home,
    }),
    beforeLoad: async () => {
      const session = await getAuthSession();

      if (session !== null) {
        throw redirect({ to: routerPaths.home });
      }
    },
    component: LoginPage,
  });

  return [loginRoute] as const;
}

/** Роуты защищённой части — дети layout-роута с guard'ом в `beforeLoad`. */
export function createProtectedRoutes(protectedLayoutRoute: AnyRoute) {
  const recipesRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.home,
    component: RecipesStub,
  });

  const productsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.products,
    component: ProductsStub,
  });

  const logRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.log,
    component: LogStub,
  });

  const settingsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.settings,
    component: SettingsStub,
  });

  return [recipesRoute, productsRoute, logRoute, settingsRoute] as const;
}

function RecipesStub() {
  const l = useI18nSelector(({ l }) => l.navigation.recipes);
  return <RouteStub title={l} />;
}

function ProductsStub() {
  const l = useI18nSelector(({ l }) => l.navigation.products);
  return <RouteStub title={l} />;
}

function LogStub() {
  const l = useI18nSelector(({ l }) => l.navigation.log);
  return <RouteStub title={l} />;
}

function SettingsStub() {
  const l = useI18nSelector(({ l }) => l.navigation.settings);
  return <RouteStub title={l} />;
}
