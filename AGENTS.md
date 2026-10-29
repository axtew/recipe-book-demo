# Recipe Book — instructions for agents

A personal mobile-first PWA for two people: a product reference, recipes with nutrition (kcal, protein, fat, carbs) calculation, search, a cooking log. The UI is in English and Russian and follows the browser language ([ADR 0034](docs/decisions/0034-bilingual-ui-by-browser-language.md)). The original brief is [`docs/task.md`](docs/task.md).

## Before work

1. `STATUS.md` (working repository only, it is not in the public copy) — where we are now: closed phases, the next step, open questions. Start there.
2. [`docs/decisions/`](docs/decisions/README.md) — accepted decisions (ADRs): the stack, the data model, the product boundaries. On any conflict they take priority.
3. [`plans/README.md`](plans/README.md) — how development is organized and the phase protocol; the plan of a task is `plans/<task>/plan.md` (for v1 — [`plans/recipe-book-v1/plan.md`](plans/recipe-book-v1/plan.md): DB schema, domain types, the nutrition module contract, the screen map, the phases).
4. The files from the table below, depending on what the task touches.

For reference: `DEPLOY.md` (working repository only; for your own deployment see [«Deploy your own»](README.md#deploy-your-own) in the README) — deployment, environment variables, the order of work with migrations in production, the release checklist. [`BACKLOG.md`](BACKLOG.md) — ideas for development and tech debt.

## What to read for a task

| The task touches | Read |
|---|---|
| any code in `src/` | [`conventions/code-style.md`](docs/agents/conventions/code-style.md), [`conventions/structure.md`](docs/agents/conventions/structure.md), [`conventions/typing.md`](docs/agents/conventions/typing.md), [`conventions/stack.md`](docs/agents/conventions/stack.md) |
| components, pages, layouts | + [`conventions/components.md`](docs/agents/conventions/components.md), [`conventions/styling.md`](docs/agents/conventions/styling.md) |
| user-facing texts, `public/dictionaries/` | + [`conventions/i18n.md`](docs/agents/conventions/i18n.md) |
| `src/routes/`, navigation, the auth guard | + [`conventions/routing.md`](docs/agents/conventions/routing.md) |
| `src/api/`, `src/domain/`, migrations, `supabase/`, the cache | + [`conventions/data.md`](docs/agents/conventions/data.md), [`architecture.md`](docs/architecture.md) |
| tests | + [`conventions/testing.md`](docs/agents/conventions/testing.md) |
| a live check (Docker, local Supabase, the dev user) | [`local-environment.md`](docs/agents/local-environment.md) |
| where the data on the screen comes from, the cache, the PWA | [`architecture.md`](docs/architecture.md) |
| a plan, a review, a pipeline phase | [`pipeline-profile.md`](docs/agents/pipeline-profile.md), [`plans/README.md`](plans/README.md) + everything the phase touches |
| deployment, a release | `DEPLOY.md` (working repository only); for your own deployment see [«Deploy your own»](README.md#deploy-your-own) in the README |

## Commands

```
pnpm dev            # dev server against the local Supabase
pnpm dev:prod       # dev server against the cloud — look only
pnpm dev:demo       # demo mode (banner, ready login, no photo upload) against the local stack
pnpm build:demo     # demo build (.env.demo)
pnpm deploy:demo    # build and deploy the demo — run by the owner
pnpm build          # production build (vite build && tsc -b)
pnpm preview        # preview the built bundle locally
pnpm lint           # lint
pnpm prettier       # format the whole repository
pnpm format         # format src/
pnpm test           # vitest
pnpm db:reset       # recreate the local DB from migrations + seed
pnpm db:types       # regenerate src/types/database.types.ts
```

Done = `pnpm lint` and `pnpm build` pass; if there are tests, `pnpm test` passes too. After any change to the DB schema **always** regenerate the types — never edit `database.types.ts` by hand.

## Hard invariants

Violating any of them is a defect even if the code works; the reviewer classifies each as `Issue source: code`.

- **All nutrition arithmetic lives only in `src/domain/nutrition/`.** The module does not import React, Supabase or Mantine. Rounding happens only at display ([`data.md`](docs/agents/conventions/data.md), [ADR 0017](docs/decisions/0017-nutrition-module-purity.md)).
- **There are no deletes.** Only `archived_at`; no `DELETE` from the app ([ADR 0014](docs/decisions/0014-archiving-instead-of-deletes.md)).
- **There are no silent zeros.** A product without nutrition is an entry in `incompleteProducts` and a visible warning in the UI, not a zero in the sum.
- **The generated row shape does not leave the service layer** (`src/api/services/`); numeric columns are checked against the actual response ([`data.md`](docs/agents/conventions/data.md)).
- **The dates `cooked_at` / `finished_at`** are `YYYY-MM-DD` strings: no `Date`, no time zones.
- **iOS has priority:** `100dvh`, `env(safe-area-inset-*)`, tap targets ≥44px ([`styling.md`](docs/agents/conventions/styling.md)).
- **New dependencies only with permission.** The stack is fixed in [ADR 0003–0009](docs/decisions/README.md).
- **The data is loaded into the client whole:** no server-side search, pagination or filtering in the database ([ADR 0012](docs/decisions/0012-whole-dataset-in-client.md)).

## Working rules

- **The cloud is the family's working database; test data is never written there.** A live check runs only on the local stack ([`local-environment.md`](docs/agents/local-environment.md)). `npx supabase db push` and `npx supabase stop --no-backup` are forbidden.
- **The owner's:** `npx supabase db push` to the cloud, the `.env*` files, the Supabase and Cloudflare dashboards. The executor writes everything else, migrations included, applies them to the local database only and reports that the migration is ready to be rolled out ([ADR 0026](docs/decisions/0026-work-split-lifted.md)).
- **Multi-step writes are a database function called through `rpc`**, not a chain of requests. **Never edit an applied migration** — only add a new one. **A new table** — `enable row level security`, a policy, `grant`. **The shape of an entity in the cache changed** — raise `CACHE_BUSTER`. **The input schema and the entity interface** are tied with `satisfies z.ZodType<…>`. Details — [`data.md`](docs/agents/conventions/data.md).
- **A phase:** one session — one phase; do only that phase; at the end go through the «Verification» items and report on each; the first failed check stops the chain. The protocol is in [`plans/README.md`](plans/README.md).
- **A plan that diverges from reality** (what the plan refers to does not exist; a step contradicts another decision; the idea does not work) — stop and ask, do not invent a workaround silently. The plan is fixed through an addition in its «Amendments» section.
- **Commits are made by the owner** after their review; agents do not commit. No traces of tools in git: no `Co-Authored-By`, no session links, no «generated» notes in commit messages, PR descriptions, branch names and tags.
- **An idea for the future** goes to [`BACKLOG.md`](BACKLOG.md), not into the current task. Before suggesting something «useful», check its «Rejected» section.
- **The interface text is not tied to gender** — the rule is about Russian text: impersonal and passive forms, the plural ([`i18n.md`](docs/agents/conventions/i18n.md)).
- **Language:** English for instructions, ADRs, code comments, developer-facing messages (`throw new Error(...)`, `console.*`), test names, commit messages and new files in `plans/` ([ADR 0033](docs/decisions/0033-english-repository-language.md)). Reference docs are bilingual; `plans/` history, `STATUS.md` and the root `DEPLOY.md` stay Russian. Agent instructions get no Russian copies ([ADR 0035](docs/decisions/0035-no-russian-copies-of-agent-instructions.md)). Headings, statuses and keys from the pipeline templates are not translated — the skills read them.

## What the project does not have

Do not suggest or add on your own initiative: SSR, server code other than Supabase Edge Functions, multi-user mode and roles, milliliters and unit conversions, a desktop layout (one column with `max-width: 600px`), offline writes. The reasons are in [`docs/decisions/`](docs/decisions/README.md).
