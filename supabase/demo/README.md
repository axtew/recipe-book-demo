[Русский](README.ru.md) · **English**

# Demo data

The reference for the demo project: 20 made-up recipes with photos (two of them based on videos), 65 products (75 variants), a cooking log of 39 entries. It is a version 1 backup file — the import on the settings screen accepts it, and so does the demo reset function (`setup.sql`). The step-by-step setup of the demo project for the owner is in `DEPLOY.md` next to this file.

The demo data (recipe, product and category names, steps, notes) is in Russian for now; the names quoted below are data and are left as they are, with an English gloss in parentheses.

## What is where

| Path                           | What                                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `source/products.ts`           | product categories, products, variants and nutrition per 100 g                                                              |
| `source/recipes.ts`            | recipes: composition in grams, steps, dish categories, storage, notes, the `photo` and `videoUrls` fields                   |
| `source/cookLogs.ts`           | the cooking log                                                                                                             |
| `source/_types.ts`             | shapes of the sources                                                                                                       |
| `_build.ts`                    | the generator: hands out `id`s, links rows by names, computes the nutrition snapshots with `src/domain/nutrition/`          |
| `seed.json`                    | the generator output; not edited by hand                                                                                    |
| `__tests__/seed.test.ts`       | checks `seed.json` against the sources, the backup schema, referential integrity, the log snapshots                         |
| `photos/`, `photos/CREDITS.md` | recipe photos (WebP, as the app saves them) and their sources                                                               |
| `photos.json`                  | which file from `photos/` goes where in Storage; built by the generator                                                     |
| `load-seed.sql`                | `seed.json` as one `INSERT` into the reference table `demo.seed`; built by the generator                                    |
| `setup.sql`                    | for the demo project only: the reference, the reset function, the nightly `pg_cron` schedule, closed Storage writes, a ping |
| `upload-photos.mjs`            | uploads the photos to the demo project's Storage with the secret key                                                        |
| `keepalive.ts`                 | the demo Worker script on a Cron Trigger: a ping so that the free Supabase project does not fall asleep                     |

## How to rebuild `seed.json`

One run rebuilds `seed.json`, `load-seed.sql` and `photos.json`. The generator is written in TypeScript and is started as a vitest test run: it understands the `@/` alias and pulls in the domain module, and the repository has no separate TS runtime. Editing the sources without rebuilding fails the test `matches what the generator builds from the sources`.

PowerShell:

```powershell
$env:WRITE_DEMO_SEED = "1"; pnpm vitest run supabase/demo; Remove-Item Env:WRITE_DEMO_SEED
```

bash:

```bash
WRITE_DEMO_SEED=1 pnpm vitest run supabase/demo
```

## Data rules

- Identifiers are deterministic: `de0000KK-0000-4000-8000-NNNNNNNNNNNN`, where `KK` is the kind of the row (01 product category, 02 dish category, 03 product, 04 variant, 05 recipe, 06 step, 07 ingredient, 08 log entry). A rebuild gives the same file.
- The nutrition numbers follow well-known nutrition tables. Grains and pasta are given for the dry product, meat and fish for the raw one.
- The only product without nutrition is «Аджика домашняя» (homemade adjika; the recipe «Чили кон карне» (chili con carne) shows the incomplete-calculation warning). The only archived product is «Сметана 15%» (sour cream 15%); it stays in the old «Творожная запеканка» (cottage cheese casserole).
- The log snapshots are computed from the recipe's base number of servings, as on the recipe card in the app; the multiplier is stored separately.
- Recipe photo: the file name from `photos/` in the `photo` field. In `seed.json` it becomes a `photo_path` of the form `<recipe id>/cover.webp` — exactly the path the app writes when a cover is uploaded (`uploadRecipePhoto`). The files themselves are not part of `seed.json`: the demo setup procedure puts them into Storage.
- Video: the `videoUrls` field goes into `video_urls`. The recipes «Овсяное печенье» (oatmeal cookies) and «Блины» (blini) are retold from videos in my own words; the amounts for «Блины» were converted from cups and spoons to grams, and the recipe note says so.
- The `seed.json` file is marked `eol=lf` in `.gitattributes`: it goes into `jsonb`, and the test compares it with the generator.
- The types of the folder are checked by `tsc -b` (the `tsconfig.demo.json` project, part of `pnpm build`).

## How the photos get into Storage

The bucket is `recipe-photos`, the object path is `<recipe id>/cover.webp`, `contentType: image/webp`, `upsert: true`. They are uploaded by `upload-photos.mjs` from the list in `photos.json` with the demo project's secret key (writing to the demo bucket is closed for users — `setup.sql` does that); the commands are in `DEPLOY.md` next to this file. The upload can be done before or after the `seed.json` import — the order does not matter, the public link is built from the path. A database reset does not touch Storage: the photos stay in place.

| Recipe                                                        | File in `photos/`    |
| ------------------------------------------------------------- | -------------------- |
| Сырники (cottage cheese pancakes)                             | `syrniki.webp`       |
| Овсянка с бананом и орехами (oatmeal with banana and nuts)    | `ovsyanka.webp`      |
| Творожная запеканка (cottage cheese casserole)                | `zapekanka.webp`     |
| Плов с курицей (chicken pilaf)                                | `plov.webp`          |
| Гречка с грибами и луком (buckwheat with mushrooms and onion) | `grechka.webp`       |
| Паста болоньезе (pasta bolognese)                             | `bolognese.webp`     |
| Голубцы (stuffed cabbage rolls)                               | `golubtsy.webp`      |
| Запечённая курица с овощами (baked chicken with vegetables)   | `baked-chicken.webp` |
| Куриные котлеты (chicken patties)                             | `cutlets.webp`       |
| Лосось с брокколи (salmon with broccoli)                      | `salmon.webp`        |
| Борщ (borscht)                                                | `borscht.webp`       |
| Куриный суп с лапшой (chicken noodle soup)                    | `chicken-soup.webp`  |
| Крем-суп из тыквы (pumpkin cream soup)                        | `pumpkin-soup.webp`  |
| Шарлотка (charlotte apple cake)                               | `charlotte.webp`     |
| Банановый хлеб (banana bread)                                 | `banana-bread.webp`  |
| Чили кон карне (chili con carne)                              | `chili.webp`         |
| Греческий салат (Greek salad)                                 | `greek-salad.webp`   |
| Хумус (hummus)                                                | `hummus.webp`        |
| Овсяное печенье (oatmeal cookies)                             | `cookies.webp`       |
| Блины (blini)                                                 | `blini.webp`         |

The "recipe → file" mapping lives in `source/recipes.ts` (the `photo` field); the table above is its copy for reading. The test makes sure there are no extra files in `photos/` and that each has an entry in `CREDITS.md`.

**After new migrations.** If a migration adds an app table or touches the Storage write policies, update the table list in `demo.reset()` and the `drop policy` statements in `setup.sql` and run it again in the demo project (details in `DEPLOY.md`, step 3). `setup.sql` itself aborts if the project has no demo user: that way it cannot be applied to the working database by mistake.
