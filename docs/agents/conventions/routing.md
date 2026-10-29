# Routing — routes and pages are different layers

Routing is TanStack Router in **code-based** mode — the route tree is written out explicitly, there is no codegen and no `routeTree.gen.ts` ([ADR 0006](../../decisions/0006-tanstack-router-code-based.md)).

- `src/routes/` — the tree and nothing else: `_paths.ts` (every path as a named constant — no path string literals in components), `_routes.tsx` (`commonRoutes` / `protectedRoutes`), `AppRouter.tsx` (tree assembly + `createRouter`), `layouts/` (route-level wrappers). Markup does not live here.
- **The auth guard is `beforeLoad` on the protected layout route**, not a `<ProtectedRoute>` component: it runs before render, so there is no flash of a protected screen before the redirect.
- `src/pages/<Name>Page/` — the screen itself, following the component conventions above. Sub-components of a page go in its `_internal/`; nested parts of a component go in `_internal/`.
