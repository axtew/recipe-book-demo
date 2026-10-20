import { type AnyRoute, createRoute, redirect, useParams } from "@tanstack/react-router";

import { RouteStub } from "@/components/RouteStub";
import { useI18nSelector } from "@/context/I18nContext";
import { getAuthSession } from "@/hooks/useAuth.hook";
import { LoginPage } from "@/pages/LoginPage";
import { ProductPage } from "@/pages/ProductPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { RecipeEditorPage } from "@/pages/RecipeEditorPage";
import { RecipePage } from "@/pages/RecipePage";

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
export function createCommonRoutes<TRoot extends AnyRoute>(rootRoute: TRoot) {
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
export function createProtectedRoutes<TLayout extends AnyRoute>(protectedLayoutRoute: TLayout) {
  const recipesRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.home,
    component: RecipesStub,
  });

  const recipeNewRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.recipeNew,
    component: function RecipeNewRoute() {
      return <RecipeEditorPage recipeId={null} />;
    },
  });

  function RecipeCardRoute() {
    const { recipeId } = useParams({ from: "/protected-layout/recipes/$recipeId" });

    return <RecipePage recipeId={recipeId} />;
  }

  const recipeCardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.recipeCard,
    component: RecipeCardRoute,
  });

  function RecipeEditRoute() {
    const { recipeId } = useParams({ from: "/protected-layout/recipes/$recipeId/edit" });

    // key пересоздаёт редактор целиком при смене рецепта: состояние формы не должно перетекать.
    return <RecipeEditorPage key={recipeId} recipeId={recipeId} />;
  }

  const recipeEditRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.recipeEdit,
    component: RecipeEditRoute,
  });

  const productsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.products,
    component: ProductsPage,
  });

  function ProductCardRoute() {
    const { productId } = useParams({ from: "/protected-layout/products/$productId" });

    return <ProductPage productId={productId} />;
  }

  const productCardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: routerPaths.productCard,
    component: ProductCardRoute,
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

  return [
    recipesRoute,
    recipeNewRoute,
    recipeCardRoute,
    recipeEditRoute,
    productsRoute,
    productCardRoute,
    logRoute,
    settingsRoute,
  ] as const;
}

function RecipesStub() {
  const l = useI18nSelector(({ l }) => l.navigation.recipes);
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
