/** Пути всех роутов одним объектом — компоненты не пишут строковые литералы путей. */
export const routerPaths = {
  login: "/login",
  home: "/",
  products: "/products",
  log: "/log",
  settings: "/settings",
} as const;
