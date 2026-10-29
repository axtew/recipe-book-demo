# Ideas backlog

A dump of ideas for development, so they do not get lost between conversations. Not a plan — there are no commitments or deadlines here.

**How it is kept.** An idea appears in a conversation — put it here at once, briefly: what, why, what it needs. As soon as an idea turns into work, it gets a phase in `plans/` or a step in `backend-track.md`, and only a link stays here. A decided "we do not do this" moves to the "Rejected" section with the reason, so that half a year later we do not discuss it again.

**Statuses:** 💡 idea · 📋 planned (has a phase) · ⏸ deferred on purpose · ✅ done · ❌ rejected

**Scale:** S — an evening · M — a few days · L — weeks · XL — in effect a new product

---

## Summary

| Idea | Status | Scale |
|---|---|---|
| [Menu planning for two weeks](#menu-planning-for-two-weeks) | ⏸ v2 | L |
| [Shopping list](#shopping-list) | ⏸ v2 | M |
| [Recipe import from a screenshot or a link](#recipe-import-from-a-screenshot-or-a-link) | ⏸ v2 | M |
| [Loading a recipe and products from JSON](#loading-a-recipe-and-products-from-json) | 💡 right after v1 | S–M |
| [Nutrition from a label photo](#nutrition-from-a-label-photo) | 📋 Phase 13, conditional | M |
| [Families and multi-tenancy](#families-and-multi-tenancy) | 💡 | L |
| [Household inventory](#household-inventory) | 💡 | L |
| [Food diary](#food-diary) | 💡 | L |
| [Planning assistant](#planning-assistant) | 💡 | L |
| [Publishing to the stores](#publishing-to-the-stores) | 💡 | M |
| [Demo data per UI language](#demo-data-per-ui-language) | ⏸ | M |
| [Offline writes](#offline-writes) | ⏸ | M |
| [Desktop layout](#desktop-layout) | ⏸ | M |
| [Cooking mode](#cooking-mode) | 💡 | S |
| [Milliliters and densities](#milliliters-and-densities) | ⏸ | S |
| [Category reference management screen](#category-reference-management-screen) | 💡 | S |
| ~~Composite FK for `pinned_variant_id`~~ | ✅ done 2026-08-18 | S |
| [Automatic export backup](#automatic-export-backup) | 💡 | S |
| [Backup together with photos](#backup-together-with-photos) | 💡 | S–M |
| [Backup import into a non-empty database](#backup-import-into-a-non-empty-database) | 💡 | M |
| [Drag-and-drop for categories in settings](#drag-and-drop-for-categories-in-settings) | 💡 | S |
| [Data that outlived its app version](#data-that-outlived-its-app-version) | 💡 cache done; draft in Phase 8 — partly | S |
| [Supabase auth config as code](#supabase-auth-config-as-code) | 💡 | S |
| ~~Public demo for the portfolio~~ | ✅ done — `plans/publication/plan.md` | M |
| ~~Second UI language~~ | ✅ done — [ADR 0034](docs/decisions/0034-bilingual-ui-by-browser-language.md) | M |
| [Closing sheets with a swipe down](#closing-sheets-with-a-swipe-down) | 💡 | S |
| [Tests beyond the calculation module](#tests-beyond-the-calculation-module) | 💡 | M |
| [Draft after a server-side edit under an open editor](#draft-after-a-server-side-edit-under-an-open-editor) | 💡 | S |
| [Moving away from styled-components](#moving-away-from-styled-components) | ⏸ | M |

---

## Big directions

### Families and multi-tenancy

**Why.** To share the app with friends and later, possibly, to promote it. Right now the database is shared by everyone who is signed in, so sign-ups cannot be opened: anyone who registers would see our recipes.

**What it needs.** The technical requirements are worked out in [ADR 0029](docs/decisions/0029-multi-tenancy-deferred.md), in short:

- tables `groups` + `group_members(group_id, user_id, role)`, a `group_id` column on all user tables;
- RLS policies through a `security definer` membership-check function — a direct subquery in a policy is run for every row, and on the membership table itself it causes recursion;
- `(select auth.uid())` instead of `auth.uid()`, otherwise it is called for every row;
- the product part: invitations, roles, a "share" screen;
- **automated tests for the policies** — "a user of group A does not see the data of group B". It cannot be done without them: the `GRANT-1` defect from Phase 1 showed that an access mistake is easy to miss, and in a multi-tenant schema the symmetric mistake looks like "everything works", just strangers see other people's data.

**Not prepared in advance.** Adding `group_id` to a database of a few hundred rows is a half-hour migration. Designing it now = slowing v1 down for a hypothesis. The only hedge that is already kept: the policies are written uniformly, so replacing `using (true)` with a membership check will be mechanical.

**Economics.** The free plan will hit the limit not on rows but on photos: ~20 families × 100 recipes × 150 KB ≈ 300 MB against a 1 GB quota, plus 5 GB of egress a month. After that Pro for $25/month.

**It will also surface:** "the whole dataset into the client" will have to be limited to one's own group (this comes out of RLS by itself), and `archived_at` and the log snapshots become other people's data — so the JSON export must return only one's own group.

---

### Household inventory

**Why.** A shopping list for the home in general, not only products for recipes. Plus hints: "laundry detergent was bought 3 weeks ago, it usually lasts a month — check".

**What it needs.** A separate domain: `household_items` + `purchases(item_id, purchased_at, quantity)`. It does not fit into `products` — detergent has no nutrition and no active variant in our sense.

**Important:** "it usually lasts a month" is statistics over the intervals between purchases, plain arithmetic. An LLM is needed here at most for the wording, not for the calculation.

**The bridge between the domains** is already laid: `product_categories.sort_order` = the order of the store departments.

---

### Food diary

**Why.** Full calorie tracking: what was eaten in a day, how much it comes to in nutrition.

**What it needs.** `meal_entries(date, recipe_id | product_id, amount_grams)` + a day screen + daily norms. The calculation module is reused as is — it is already pure and knows nothing about the UI.

**The first real multi-user cut appears here:** everyone has their own diary, even within one family. So this feature makes sense only after [families](#families-and-multi-tenancy), or with the entries bound to `user_id` directly.

---

### Planning assistant

**Why.** "Put together a menu for two weeks from what we like, taking freezing into account" and "put together a shopping list".

**What it needs.** The division of labour fixed in [ADR 0028](docs/decisions/0028-local-llm-assistant-deferred.md): **the LLM extracts and matches, deterministic code does the arithmetic**. Menu planning is an optimization problem, not a text one; a model is fine for wording and for parsing free input, but not for counting grams.

**RAG is not needed** — two hundred recipes fit into the context whole.

**A local model or the cloud.** On an RTX 3070 (8 GB) 7–9B models in Q4 fit — they are enough for extraction and matching, but a bit too small for long reasoning about a two-week menu. Besides, a local model needs a laptop that is awake and a tunnel ([ADR 0013](docs/decisions/0013-cloudflare-hosting.md)). More likely the cloud, as with the label.

---

### Publishing to the stores

**What it needs.** The App Store does not accept a PWA directly — a Capacitor wrapper is needed. Google Play accepts it through a Trusted Web Activity (Bubblewrap).

**Makes sense only after** [families](#families-and-multi-tenancy): without multi-tenancy there is nothing to publish to a store.

---

### Demo data per UI language

**Why.** The demo is a portfolio shown to English readers, and Russian recipes under an English UI read poorly; the other way round, Russian recipes would suit Russian-speaking visitors. One demo project holds data in one language only.

**What it needs.** Two demo Supabase projects (English and Russian). The sign-in screen picks the project and prefills the matching demo account by the detected language. Per-language data in one project is not possible without separating the data per user: every table has one "authenticated full access" policy, and multi-tenancy is deferred ([ADR 0029](docs/decisions/0029-multi-tenancy-deferred.md)).

**Costs.**

- switching the language in settings means switching the backend and signing in again;
- the reset, the schedule, the keep-alive and the migration rollout double;
- the free tier allows two active projects.

**Trigger.** Russian-speaking visitors become a target audience of the demo.

---

## From the original brief, deferred on purpose

### Menu planning for two weeks

⏸ v2, as the brief says. The final goal of the project: cook a lot in one day, freeze, eat for two weeks. The data for it is collected from the first version — the cooking log with the actual yield and the storage periods, `freezable`, `freezer_days`.

### Shopping list

⏸ v2. Total weights for the chosen menu, grouped by store departments through `product_categories.sort_order`.

### Recipe import from a screenshot or a link

⏸ v2. The most valuable feature for filling the database: my wife moves recipes over from screenshots and videos. A vision model parses the picture into a structure, a person confirms. Technically it is the same scheme as [nutrition from a label photo](#nutrition-from-a-label-photo), only the parsing is harder.

### Cooking mode

💡 Timers per step and screen-sleep protection (Screen Wake Lock API). Moved out of v1 in the brief. A small nice feature; the steps already lie in a separate table with `sort_order`, so tying a timer to a step will not be hard.

### Milliliters and densities

⏸ For now only grams: we weigh on a scale. It will be needed if we start measuring liquids by volume — then a `unit` + a density on the variant.

### Offline writes

⏸ For now reading works offline (the persisted cache), writing needs the network. If it turns out that input really gets lost in the kitchen — an outbox queue of mutations. A local improvement, it does not break the architecture.

### Desktop layout

⏸ v1 is one `max-width: 600px` column in the centre. A full desktop with two or three columns is a separate task, for when working from laptops comes up.

---

### Loading a recipe and products from JSON

**Why.** Filling the product reference by hand is still tolerable, but typing in recipes takes long: a dozen and a half ingredients with weights plus steps. The idea: hand Claude a recipe from a website or a video, get JSON in a fixed contract, load the file in the app.

**Why this is cheaper than [import from a photo or a link](#recipe-import-from-a-screenshot-or-a-link):** the parsing happens **outside the app**. No vision API, no Edge Function, no keys, no payment — the app only needs a "load JSON" screen. It is the cheap half of the same task, and it makes sense to do it first, adding the full import only if moving JSON by hand starts to be annoying.

**What is already ready for it in v1.** Phase 12 makes the import of a JSON backup: reading the file, zod validation, insertion. A recipe import is the same road with another input schema, so the amount of work is closer to S than to M.

**What it consists of:**

1. **The contract** — a zod schema of a recipe in `src/domain/schemas/`, separate from the backup schema. An ingredient in it refers to a product **by name**, not by `id`: an external parser does not have our ids.
2. **The skill** — reads a page or text and puts it into this contract. Its job is extraction and layout, **not arithmetic**: the app computes nutrition with its own module, exactly as written in [ADR 0028](docs/decisions/0028-local-llm-assistant-deferred.md). The skill may suggest nutrition for an unfamiliar product, but marks it `source: 'llm'` and `is_approximate: true`.
3. **The load screen** — and the main work is in it: **matching the ingredients with the product reference**. For each row — the product was found by name, or offer to create it, or choose by hand. Without this step the import silently breeds duplicates: "Flour", "wheat flour", "Flour, top grade".

**Where the pitfalls are:**

- **Matching matters more than parsing.** A model parses a recipe well; mapping "butter" onto an existing product is the app's job, and it has to be done with a person's confirmation, not automatically.
- **Units.** Websites write "2 tbsp" and "1 cup", and we have only grams ([ADR 0016](docs/decisions/0016-variants-and-active-variant.md)). The skill must convert to grams **or** honestly mark the row as not converted, not invent. Better a person adds the weight than an invented number goes into the database.
- **Contract version.** A `version` field in the JSON from day one, as in the backup — otherwise half a year later old files will load silently and crookedly.

**Order.** First the contract and the load screen (after Phase 12, they reuse its code), then the skill — it is useless without a receiver.

## Small things and tech debt

### Nutrition from a label photo

📋 Already described as Phase 13 in `plan.md`, conditional. Start only if entering the four numbers by hand really starts to be annoying. The key requirement is to tell "per 100 g" from "per serving": on Asian packages per-serving values are common, and taking one for a 100 g value means quietly spoiling the numbers in all recipes with this product.

### Category reference management screen

💡 Right now the product categories are created directly in the database through the SQL Editor — there is no pre-filling, by the decision of 2026-08-18. Phase 12 closes the editing of categories, but it is worth checking that it covers the product categories and not only the dish ones. While the reference is small, filling it by hand is even more convenient.

### Composite FK for `pinned_variant_id`

✅ **Done 2026-08-18**, migration `20260817175656_pinned_variant_integrity`. Closed while there were no recipes in the database — that is, without checking and cleaning existing data.

It was: `pinned_variant_id` referenced `product_variants(id)` with a plain foreign key, so a variant of butter could be pinned to the ingredient "Cucumbers". Now: the reference is the pair `(product_id, pinned_variant_id)` → `product_variants(product_id, id)`.

### Second UI language

✅ **Done**, [ADR 0034](docs/decisions/0034-bilingual-ui-by-browser-language.md): the UI is bilingual (English and Russian), the language follows the browser with a manual choice in settings, numbers and dates follow the language. It replaces the "deferred" status from [ADR 0032](docs/decisions/0032-english-ui-language-later.md). The demo data stays Russian — see [Demo data per UI language](#demo-data-per-ui-language).

### Supabase auth config as code

💡 The auth settings now live only in the dashboard: they cannot be seen in the repository, the cloud cannot be compared with the local stack, and they cannot be rolled back. The first price of this was the broken sign-in on 2026-08-31: the email provider was switched off instead of sign-ups, and it could be understood only from an error in the browser.

`supabase config push` can push `[auth]` from `config.toml` to the cloud. To use it, `config.toml` has to be brought to the production values (`site_url`, `additional_redirect_urls`, `enable_signup = false`) and a way to tell local values from cloud ones has to be added — the file now describes the local stack, and a push as is would open sign-ups and take the Site URL to `127.0.0.1`.

**Careful:** the command has no dry run, and it pushes the whole block, including the rate limits and the JWT lifetime. So this is not "switch on quickly" but a deliberate move with a check of every value.

**Benefit:** the settings are visible in the diff, the same in both environments and recoverable after an accidental click. It will be especially useful if it gets to [families and multi-tenancy](#families-and-multi-tenancy) — there will be noticeably more auth settings.

### Tests beyond the calculation module

💡 By the plan only `src/domain/nutrition/` is covered by tests — pure functions that need nothing but `vitest`. The owner wants to pull testing up as such, and the project is also a learning one, so an extension makes sense.

**In ascending order of the cost of the scaffolding:** the calculation module (Phase 4, nothing to install) → zod schemas (also pure) → repositories and hooks (needs `msw` or a mock of `supabase-js`) → components (`@testing-library/react`, `jsdom`, `@testing-library/jest-dom`, `fake-indexeddb`). Everything from the third item on needs new dependencies — that is, a separate decision.

**What cannot be done naively.** Taking `App` (the stack of providers from `src/app/App.tsx`) as a wrapper for component tests will not work, and it is worth knowing in advance:

- the query client is a module singleton with a week-long `gcTime` and a persister to IndexedDB. One client per file means the cache leaks between tests; the default `retry: 3` turns an error test into a hang until the timeout; there is no IndexedDB in jsdom. A test needs a fresh client with `retry: false` and `gcTime: 0`;
- `I18nProvider` fetches the dictionary through `fetch` and renders a loader until the response — in jsdom there is nowhere to go.

From this come two small changes that the very first test will force: move the creation of the client into a `createQueryClient()` factory (the singleton becomes a call to it) and let `I18nProvider` accept a ready dictionary instead of loading. **There is no need to do them in advance** — they will appear together with the test they get in the way of.

The test wrapper (`renderWithProviders`) will assemble the same providers with its own configuration — it is a neighbour of `App`, not its consumer.

### Closing sheets with a swipe down

💡 The bottom sheets (Mantine `Drawer`) close with a tap on the backdrop, a button and `Escape`, but not with a swipe down — Mantine has no such gesture. On an iPhone a swipe is expected by habit. The solution is a shared hook on `touchstart` / `touchmove` / `touchend` with a closing threshold, applied to the shared `SBottomSheetDrawer` and also to `ArchiveConfirm`, which still holds its own copy of the same height override. Taken out of the Phase 7 check as optional (2026-09-19).

### Automatic export backup

💡 The JSON export exists from the first version, but one has to remember to download it by hand. The idea: once a week put a snapshot into the cloud automatically. On the free Supabase plan backups are not guaranteed, so this export is the only real backup.

### Backup together with photos

💡 Written down on 2026-10-20, in the Phase 12 discussion. The v1 JSON export contains only the tables, so of the recipe photos only the path to the file in Storage is left in it. If the cloud disappears entirely, the recipes are restored without covers. The owner accepted this for v1.

The full variant: a ZIP archive holding the JSON and the photo files. On import the photos are uploaded back to the bucket, and the paths in the recipes stay the same. This will most likely need a ZIP packing dependency, for example `fflate`, and the owner's permission for it. The size also has to be taken into account: dozens of photos of 200–400 KB are megabytes; downloading such a file to a phone is acceptable.

### Drag-and-drop for categories in settings

💡 Written down on 2026-10-21 at the owner's request. The order of categories in settings (Phase 12) is changed with the "Up" and "Down" buttons: to move a category by several positions, several taps are needed. Dragging is wanted, as with the steps and ingredients in the recipe editor.

Everything for it is already there:
- `@dnd-kit/core` and `@dnd-kit/sortable` have been installed since Phase 8 and work on touch. The model is the sortable lists of the editor.
- The order is already written by the `reorder_categories` function: it takes the full list of ids and changes only `sort_order`. So the service and the database do not change, only the screen is edited.

Keep in mind the opposite note [“Buttons ↑↓ instead of dragging on the phone”](#buttons--instead-of-dragging-on-the-phone): in a long scrolling list dragging with a finger is inconvenient. There are few categories, the list is short, so here it does not get in the way. The drag handle is worth making separate (a 44px tap target), so that the name field stays editable.

### Backup import into a non-empty database

💡 Written down on 2026-10-20, in the Phase 12 discussion. In v1 the import is accepted only into an empty database, and it refuses a non-empty one with an explanation: that way a backup file cannot accidentally overwrite live data.

Later two modes are possible:
- **Replace everything.** Erase the current data and load the file. There are no deletes in the app by the invariant, so this mode needs a separate database function and an explicit confirmation.
- **Merge.** Add from the file only what is missing. The main work here is matching: coinciding `id`s, the same products under different `id`s, a conflict when the same record was changed in both places. A close task is [loading a recipe and products from JSON](#loading-a-recipe-and-products-from-json): the same matching with the product reference is there.

### Moving away from styled-components

⏸ Since 2025 SC is in maintenance mode: there will be no new features, only compatibility fixes. It works with React 19, the risk is accepted for a personal project. If it is ever needed — Linaria, vanilla-extract or Panda CSS (the last has the API closest to `styled`).

### Buttons ↑↓ instead of dragging on the phone

💡 Dragging inside a scrolling list on a phone is inconvenient: a finger cannot scroll and drag at the same time. The owner decided to do drag (dnd-kit supports touch), but if in practice it turns out inconvenient, reorder buttons are often nicer.

### Draft after a server-side edit under an open editor

💡 Found by the Phase 8.6 executor (2026-10-20). If a recipe changed on the server while its editor is open (an edit from another phone), the background refetch rebuilds `initialDraft`. Then the untouched form differs from it, and a draft is written when leaving the page. The next time the editor is opened, "There is an unsaved draft" appears although nobody edited anything. Reproduced only by editing the database by hand. There are two users, a simultaneous edit of one recipe is unlikely. The cure is to fix `initialDraft` at the editor's mount and not rebuild it from the refetch.

### Data that outlived its app version

💡 The bytes in storage do not rot by themselves — version drift spoils them: the data stays in IndexedDB and localStorage, while the code that wrote it is replaced when the PWA updates. There are two places, and they are treated differently.

**The persisted query cache — ✅ done 2026-09-07.** `buster` is set by the `CACHE_BUSTER` constant in `src/app/_queryClient.ts`, raising it is tied to checklist item `B7`. The "build hash" candidate was rejected: rollouts go on every push, and the offline cache would be reset every time. The analysis is in `plan.md` → "Additions", the entry of 2026-09-07.

**The recipe draft — validate, it is irrecoverable.** The autosave to localStorage (Phase 8) does not depend on the network and survives an app update. The scenario: she started filling in a recipe in the evening, at night a version with a new required field was rolled out, in the morning the draft is read by the new code. Dropping it silently is not allowed — it is a person's lost work. Read it through `safeParse` of the draft schema and, on a mismatch, show "the draft from <date> was restored incompletely", not crash and not stay silent.

**The draft — partly done in Phase 8.** Reading goes through `safeParse` of the draft schema, the screen does not crash. But a draft that fails the schema is **deleted silently**, without the "restored incompletely" message. This differs from the paragraph above. What is left: show the person that a draft existed and did not fit, before deleting it.

---

## Rejected

So that we do not discuss it a second time. Detailed reasoning is in [`docs/decisions/`](docs/decisions/README.md).

| Idea | Why not |
|---|---|
| Barcode scanner + Open Food Facts | Checked on real Vietnamese packages: more than half were not found, and the ones found have no nutrition. [ADR 0027](docs/decisions/0027-external-nutrition-sources.md) |
| FatSecret API | The OAuth secret cannot be kept in the browser; the free tier needs an IP whitelist, and the outgoing address of serverless floats |
| USDA FoodData Central | English only and American products; matching "sour cream 20%" → `Sour cream` without a model is unreliable |
| Our own server layer to hide the requests | It gives no security: what protects is authorization on every request, not the client's ignorance of the address. Server code with the secret key bypasses RLS, so it is **more dangerous** — a check can be forgotten in one handler. [ADR 0029](docs/decisions/0029-multi-tenancy-deferred.md) |
| Local-first on IndexedDB as the source of truth | Four devices → overwriting on simultaneous editing |
| Our own Node/Postgres backend | A week of work for dumb CRUD, adds nothing to the product |
| Multi-user mode in v1 | Deferred, not rejected — see [families](#families-and-multi-tenancy) |
