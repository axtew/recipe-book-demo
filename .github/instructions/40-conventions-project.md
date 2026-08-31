### Data access — the only path to the backend

There is no application server: the client talks to Supabase (PostgREST + GoTrue + Storage) directly. The transport is `@supabase/supabase-js`; the project does **not** wrap it in an HTTP service and never issues raw `fetch` at PostgREST.

The path is fixed, and every step of it is mandatory:

```
component → TanStack Query hook (src/api/queries|mutations) → repository (src/api/repositories) → supabase client
```

- **A component never imports the Supabase client.** Not for a "quick" read, not in a `useEffect`. A component that needs data uses a query hook; one that writes uses a mutation hook. A direct `supabase.from(...)` outside `src/api/repositories/` is a defect.
- **Repositories are the only place that knows PostgREST.** Table names, `select()` strings with embedded relations, `.is('archived_at', null)` filters — all of it lives there and nowhere else.
- **Repositories are the type boundary.** `numeric` arrives from PostgREST as a **string**; the repository converts it to `number` and maps the generated row type into the project's own entity interface. Past this boundary a numeric string is a defect.
- **The generated types are the contract.** `src/types/database.types.ts` holds the real column set, nullability and row / insert / update shapes for every table — read it before declaring a type for anything that comes out of the database, instead of inferring the shape from a call site (see `Strong typing` above). It is regenerated with `pnpm db:types` after every migration and is never edited by hand.
- **One file per domain**, mirroring the service-per-domain layout: `products.repository.ts`, `recipes.repository.ts`, `cookLogs.repository.ts`, `categories.repository.ts`. Plain exported functions — there is no per-domain state to inject, so no base class.
- **Query keys and hooks** live in `src/api/queries/` and `src/api/mutations/`, one module per domain. A mutation invalidates by key; no manual refetch calls from components.
- **The whole dataset is loaded up front.** No server-side search, no pagination, no filtering pushed to the database — searching and filtering run over the in-memory dataset. A phase that adds a filtered request to the backend is contradicting the architecture, not optimising it.

`supabase/**`, `.env`, `src/types/database.types.ts` and `src/api/repositories/**` are **owner-only** (`CLAUDE.md` → «Разделение работ»). A phase needing a schema change stops and reports — no migrations, no workarounds, no stubs.

### Domain module purity

`src/domain/nutrition/` holds every arithmetic operation on nutrition values, and it must run in Node with no DOM. It imports **nothing** from React, Supabase or Mantine — pure functions over plain data. No component, hook or repository computes nutrition itself.

The module returns raw numbers; rounding is the UI's job (kcal to integers, macros to one decimal). A rounding call inside the domain module is a defect.

### Stack is fixed — reach for what is already here

Adding a dependency requires the owner's permission (`CLAUDE.md`). These are the cases where reaching for a library is the tempting-but-wrong move:

- **Forms** — the project's own hook. Do not add `react-hook-form`, `formik` or similar.
- **Sortable lists** — `@dnd-kit/core` + `@dnd-kit/sortable`. Do not hand-roll pointer-event dragging, and do not use the HTML5 drag-and-drop API — it does not work on touch devices at all.
- **Validation** — `zod`. Schemas live in `src/domain/schemas/`, one module per entity, and are reused for form validation, for validating an imported JSON backup, and later as structured-output schemas.
- **Heavy UI** — Mantine, for the components listed under Styling. Everything else is a project component.

### Routes and pages are different layers

Routing is TanStack Router in **code-based** mode — the route tree is written out explicitly, there is no codegen and no `routeTree.gen.ts`.

- `src/routes/` — the tree and nothing else: `_paths.ts` (every path as a named constant — no path string literals in components), `_routes.tsx` (`commonRoutes` / `protectedRoutes`), `AppRouter.tsx` (tree assembly + `createRouter`), `layouts/` (route-level wrappers). Markup does not live here.
- **The auth guard is `beforeLoad` on the protected layout route**, not a `<ProtectedRoute>` component: it runs before render, so there is no flash of a protected screen before the redirect.
- `src/pages/<Name>Page/` — the screen itself, following the component conventions above. Sub-components of a page go in its `_internal/`; nested parts of a component go in `_internal/`.

### Styling — project specifics

Typography is a set of project components in `src/components/Typography/` — `H1`–`H3`, `B1`–`B3`, `Caption1`–`Caption2`, `Numbers`. **A screen never sets `font-size` itself** — with exactly one exception: a form input carries `font-size: 16px`, because Safari on iOS zooms the page when a focused field's font is smaller than that. It is a platform constraint, not a size from the scale, and it stays with a comment saying so. Do not "fix" it by routing it through a typography component. A new size means: first a token in `src/theme/_typography.ts`, then a component, then usage — in that order. This is what keeps screens looking like one application instead of each one inventing its own headings.

Styled Components for layout, cards, headings, spacing — the project's own. **Mantine only for heavy components**: `Combobox`, `Drawer`, `DatePicker`, `Rating`, `NumberInput`, `Dropzone`, `Notifications`, `Skeleton`. Raising specificity over a Mantine component goes through `&&` in the styled wrapper — never `!important`. There is no in-repo UI kit: a primitive is either Mantine (for the list above) or a project component under `src/components/`.

Mobile-first, single column `max-width: 600px`; **iOS Safari is the reference platform** — `100dvh` (never `100vh`), `env(safe-area-inset-*)`, tap targets ≥ 44px. Where platforms disagree, iOS wins: the primary user is on an iPhone.

### i18n — project specifics

Dictionaries live in `public/dictionaries/`, one file per locale. Right now there is exactly one — `ru.json` — and the interface is Russian-only; the infrastructure exists so that user-visible text is collected in one place from the start rather than extracted from JSX later. Every rule in the generic i18n section applies to that single dictionary unchanged.

The `I18n` interface is `src/types/i18n.types.ts`; the selector hook is `useI18nSelector` from `src/context/I18nContext`.
