[Русский](README.ru.md) · **English**

# Recipe Book

> **This is the public copy of my working repository.** The working one is private: I use the app myself. This copy is synced from it by hand with a script (`git filter-repo` plus a few checks) that leaves out working notes, learning materials and deployment credentials, so commit hashes differ from the private repository. The interface is in English and Russian (the app follows the browser language), and the reference docs have English and Russian versions; the logs under `plans/` are still in Russian.

A personal mobile-first PWA: a product reference with nutrition values, recipes with an automatic calorie and macro calculation (kcal, protein, fat, carbs), search, and a cooking log.

## Live demo

**https://recipe-book-demo.stevvy1122.workers.dev**

- Login `demo@recipe-book.example`, password `demo-recipe-book` (the sign-in screen fills them in, one tap to enter).
- The demo is shared by all visitors, and its data is reset to the reference set every night (00:00 UTC). Photo upload is disabled.
- Recipes, products and cooking log are fictional, in English; photos come from Unsplash and Pexels, sources are in [`supabase/demo/photos/CREDITS.md`](supabase/demo/photos/CREDITS.md).
- It is the same code base as the working app, built with the `VITE_DEMO` flag against a separate Supabase project.

## What it does

- **Products** with calories, protein, fat and carbs per 100 g, several brands (variants) per product, one of them the active one.
- **Recipes** with ingredients in grams, steps, dish categories, storage notes, a photo and video links. Nutrition is calculated per 100 g, per portion and for the whole dish.
- **Honest calculation.** A product without nutrition data is never counted as zero: the recipe says the calculation is incomplete and lists the products responsible.
- **Search and filters** over recipes and products; the whole dataset lives in the client, so search is instant and works offline for reading.
- **Cooking log** with a nutrition snapshot, rating, yield and how long a batch lasted; recipe cards show the history and averages.
- Backup export and import as JSON; archiving instead of deleting.

The full walkthrough is in [`docs/user-guide.md`](docs/user-guide.md).

## How it was made

The architecture, the decisions, the plans, the acceptance of every phase and the review are mine. The code is written mostly by AI agents following a pipeline: **plan → phase (developer agent) → static review (reviewer agent) → my review → commit by me**. Agents never commit. All their artifacts are kept so the process can be traced:

- [`docs/decisions/`](docs/decisions/README.md) - architecture decision records: the stack, the data model, product boundaries, rejected alternatives.
- [`plans/README.md`](plans/README.md) - how development is organised, and the plans, phase reports and reviews of every task (`plans/<task>/`). These working logs are in Russian.
- [`AGENTS.md`](AGENTS.md) - the map and the hard invariants the agents work by; the conventions it points to are in [`docs/agents/`](docs/agents/conventions/).

Decisions worth a look:

- All nutrition arithmetic lives in one pure module with no React or Supabase imports, rounding only at display time ([ADR 0017](docs/decisions/0017-nutrition-module-purity.md)).
- No deletes, only archiving ([ADR 0014](docs/decisions/0014-archiving-instead-of-deletes.md)); cooking-log entries store a nutrition snapshot ([ADR 0018](docs/decisions/0018-cook-log-snapshot-and-dates.md)).
- Supabase without own server code: access is a grant plus a row level security policy ([ADR 0015](docs/decisions/0015-grant-plus-rls.md)); multi-step writes are database functions called through `rpc` ([ADR 0023](docs/decisions/0023-rpc-for-multi-step-writes.md)).
- The whole dataset is loaded into the client and cached in IndexedDB ([ADR 0012](docs/decisions/0012-whole-dataset-in-client.md), [ADR 0005](docs/decisions/0005-tanstack-query-persisted-cache.md)).

## Stack

React 19, TypeScript, Vite, a PWA via `vite-plugin-pwa`; Mantine and styled-components; TanStack Query (with an IndexedDB persister) and TanStack Router; zod; dnd-kit; Supabase (Postgres, Auth, Storage) with no server code of its own; Cloudflare Workers for static hosting; pnpm; ESLint, Prettier, Vitest.

## Getting started

You need Node.js (a current LTS), pnpm, Docker and the Supabase CLI (it is a dev dependency, run it with `npx supabase`).

```bash
pnpm install
npx supabase start      # local Supabase, needs Docker running
pnpm dev                # dev server against the local database (.env.development)
```

Sample data and a local dev user are described in [`docs/agents/local-environment.md`](docs/agents/local-environment.md); the dev data script is `supabase/dev-data.sql`. To see the demo mode locally (banner, prefilled login) run `pnpm dev:demo`.

| Command           | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `pnpm dev`        | dev server against the local Supabase stack                        |
| `pnpm dev:demo`   | the same in demo mode                                              |
| `pnpm build`      | production build (`vite build && tsc -b`), reads `.env.production` |
| `pnpm build:demo` | demo build, reads `.env.demo`                                      |
| `pnpm preview`    | preview of the built app                                           |
| `pnpm lint`       | ESLint                                                             |
| `pnpm test`       | Vitest                                                             |
| `pnpm db:reset`   | recreate the local database from migrations and seed               |
| `pnpm db:types`   | regenerate `src/types/database.types.ts` from the local schema     |

## Tests

`pnpm test` runs Vitest. The nutrition module is tested in plain Node without a DOM; the demo reference data (`supabase/demo/seed.json`) is checked against the backup schema, referential integrity and the module's own calculation.

## Deploy your own

1. Create a Supabase project, **turn off sign-ups** (Authentication -> Sign In / Providers -> User Signups) and create your user by hand: the database policies give every signed-in user access to all data.
2. Link the CLI and apply the migrations: `npx supabase link --project-ref <ref>`, then `npx supabase db push`.
3. Copy [`.env.example`](.env.example) to `.env.production` and fill in the project URL and the publishable key. Only the publishable key goes into the build; the secret key and the database password never do.
4. `pnpm build`, then host `dist/`. The repository ships a Cloudflare Workers static-assets config (`wrangler.jsonc`): `npx wrangler deploy`.

A full stand like the live demo (separate project, shared login, nightly reset, keep-alive for the free tier) is described step by step in [`supabase/demo/DEPLOY.md`](supabase/demo/DEPLOY.md).

## Known limitations

- Built for two users on phones, iOS first; the desktop layout is a single centred column.
- Writes need a network connection; offline, previously loaded data can only be read.
- The whole dataset is loaded on start: no server-side search, pagination or filtering, by design for this data size.
- Accounts are created by hand, there is no registration, no roles and no sharing between households.
- The demo content is in English only, whichever UI language is chosen.
