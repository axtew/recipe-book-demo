/** Пути всех роутов одним объектом — компоненты не пишут строковые литералы путей. */
export const routerPaths = {
  login: "/login",
  home: "/",
  recipeNew: "/recipes/new",
  recipeEdit: "/recipes/$recipeId/edit",
  products: "/products",
  productCard: "/products/$productId",
  log: "/log",
  settings: "/settings",
} as const;
