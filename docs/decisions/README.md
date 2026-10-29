# Decisions (ADR)

Architectural and product decisions in the [MADR](https://adr.github.io/madr/) format: status, date, context and problem, considered options, decision, consequences.
A new decision gets the next number, `NNNN-short-title.md` (file names are in English). An accepted decision is not rewritten: it is replaced by a new ADR that links to the old one. The one exception is a language-only rewrite that keeps the meaning unchanged ([ADR 0033](0033-english-repository-language.md)).
Statuses: `accepted`, `deferred` (deliberately not doing now, will come back later), `superseded by ADR NNNN`, `partly superseded by ADR NNNN`.

The decisions were collected from the earlier decision log kept since 2026-08-02; dates are the dates of the decisions themselves. Ideas for the future and rejected ideas are in [`BACKLOG.md`](../../BACKLOG.md).

| No. | Decision | Status |
|---|---|---|
| [0001](0001-personal-app-for-two.md) | Personal app for two, phones, iOS first | accepted |
| [0002](0002-russian-ui-with-i18n.md) | Russian-only UI, but the i18n infrastructure is set up | accepted; partly superseded by ADR 0034 |
| [0003](0003-spa-pwa-on-vite.md) | SPA + PWA on Vite, React and TypeScript | accepted |
| [0004](0004-styled-components-and-mantine.md) | styled-components for own markup, Mantine for heavy components | accepted |
| [0005](0005-tanstack-query-persisted-cache.md) | TanStack Query with an IndexedDB cache: read offline, write online only | accepted |
| [0006](0006-tanstack-router-code-based.md) | TanStack Router in code-based mode, routes and pages are separate layers | accepted |
| [0007](0007-zod-and-own-form-hook.md) | zod for untrusted input, own form hook | accepted |
| [0008](0008-dnd-kit-for-sorting.md) | dnd-kit for sortable lists | accepted |
| [0009](0009-pnpm-package-manager.md) | Package manager is pnpm | accepted |
| [0010](0010-supabase-without-own-backend.md) | Supabase without own server code, Singapore region | accepted |
| [0011](0011-manual-accounts-signup-off.md) | Accounts are created manually, sign-up is off | accepted |
| [0012](0012-whole-dataset-in-client.md) | The whole dataset is loaded into the client | accepted |
| [0013](0013-cloudflare-hosting.md) | The frontend is hosted in the cloud on Cloudflare | accepted |
| [0014](0014-archiving-instead-of-deletes.md) | No deletes, archiving only | accepted |
| [0015](0015-grant-plus-rls.md) | Data access = grant + RLS policy | accepted |
| [0016](0016-variants-and-active-variant.md) | Product and its variants: grams, one active variant, nullable nutrition | accepted |
| [0017](0017-nutrition-module-purity.md) | Nutrition calculation is an isolated pure module, no silent zeros | accepted |
| [0018](0018-cook-log-snapshot-and-dates.md) | The cook log stores a nutrition snapshot; dates are strings without time zones | accepted |
| [0019](0019-dish-categories-many-to-many.md) | Dish categories are many-to-many | accepted |
| [0020](0020-recipe-content-and-backup.md) | Recipe content: steps, one photo, dish weight; export to JSON | accepted |
| [0021](0021-mobile-first-ux.md) | Mobile-first UX, the recipe editor is the central screen | accepted |
| [0022](0022-data-access-path-and-services.md) | Data path: component → hook → service → Supabase client | accepted |
| [0023](0023-rpc-for-multi-step-writes.md) | Multi-step writes are database functions called through `rpc` | accepted |
| [0024](0024-no-external-state-store.md) | There will be no separate state store | accepted |
| [0025](0025-code-structure-and-conventions.md) | Repository structure and code conventions come from `Carbon-spa`, with changes | accepted |
| [0026](0026-work-split-lifted.md) | The work split is lifted: executors write everything, including the database | accepted |
| [0027](0027-external-nutrition-sources.md) | External nutrition sources rejected; replacement is a label photo through a cloud vision API | accepted |
| [0028](0028-local-llm-assistant-deferred.md) | Local LLM is a reserve for v2+, not doing now | deferred |
| [0029](0029-multi-tenancy-deferred.md) | Multi-tenancy and open sign-up are a reserve for v3+, not preparing now | deferred |
| [0030](0030-household-purchases-deferred.md) | Household purchases are a reserve for v3 | deferred |
| [0031](0031-russian-language-of-repository.md) | The repository language is Russian | superseded by ADR 0033 |
| [0032](0032-english-ui-language-later.md) | English UI language later, as a separate task | superseded by ADR 0034 |
| [0033](0033-english-repository-language.md) | English is the repository language, Russian is the second language of reference docs | accepted; partly superseded by ADR 0035 |
| [0034](0034-bilingual-ui-by-browser-language.md) | Bilingual UI, the language follows the browser | accepted |
| [0035](0035-no-russian-copies-of-agent-instructions.md) | No Russian copies of agent instructions | accepted |
