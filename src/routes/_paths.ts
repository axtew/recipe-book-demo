/** Paths of all routes in one object — components do not write path string literals. */
export const routerPaths = {
  login: "/login",
  home: "/",
  recipeNew: "/recipes/new",
  recipeCard: "/recipes/$recipeId",
  recipeEdit: "/recipes/$recipeId/edit",
  products: "/products",
  productCard: "/products/$productId",
  log: "/log",
  settings: "/settings",
} as const;
