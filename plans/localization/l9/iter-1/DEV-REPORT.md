Status: COMPLETED

# DEV-REPORT — Phase L9, iteration 1

## Phase goal

The demo data becomes English: recipes, products, variants, categories, steps, notes and cook log notes; `seed.json` / `load-seed.sql` regenerated, `photos.json` untouched; the documents that describe the demo data say so. The Rollout block is not mine (orchestrator).

## What was implemented

- `supabase/demo/source/{products,recipes,cookLogs}.ts`, `_build.ts` (`DISH_CATEGORIES`), `__tests__/seed.test.ts`: every Cyrillic string literal replaced by its English counterpart through a one-shot script in the scratchpad (exact-string map, throws on an unmapped literal, so numbers, grams, flags, order, `photo` names and `videoUrls` were not touched). The three file-header comments were translated by hand.
- `seed.json`, `load-seed.sql` regenerated with `WRITE_DEMO_SEED=1 pnpm vitest run supabase/demo`; `photos.json` unchanged (git shows no diff).
- Docs: `supabase/demo/README.md` + `.ru.md` (the «in Russian for now» sentence removed from the English file; data names quoted in English with no gloss; the recipe/photo table in English), `supabase/demo/photos/CREDITS.md` + `.ru.md` (recipe names in English, the sentence replaced by one about the author name only), `README.md` + `README.ru.md` (line 5 clause, line 15, line 91 limitation), ADR 0034 (Update line), `BACKLOG.md` + `BACKLOG-ru.md` (two spots, see below). `DEPLOY.md` / `DEPLOY.ru.md` name no demo data and do not say it is Russian (checked with `rg`) — untouched.
- No `src/` change. No new exports.

## Files created

- `plans/localization/l9/iter-1/DEV-REPORT.md` — this report.

## Files modified

- `supabase/demo/source/products.ts`, `supabase/demo/source/recipes.ts`, `supabase/demo/source/cookLogs.ts` — English data and header comments.
- `supabase/demo/_build.ts` — `DISH_CATEGORIES` in English (the same names `recipes.ts` uses).
- `supabase/demo/__tests__/seed.test.ts` — expected names (`Blini`, `Oatmeal cookies`, `Homemade adjika`).
- `supabase/demo/seed.json`, `supabase/demo/load-seed.sql` — regenerated.
- `supabase/demo/README.md`, `supabase/demo/README.ru.md`, `supabase/demo/photos/CREDITS.md`, `supabase/demo/photos/CREDITS.ru.md` — see above.
- `README.md`, `README.ru.md` — demo statements.
- `docs/decisions/0034-bilingual-ui-by-browser-language.md` — «Update 2026-10-29» line right after the «Demo data stays Russian» line.
- `BACKLOG.md`, `BACKLOG-ru.md` — «Second UI language» row: «The demo data stays Russian» -> «is English»; «Demo data per UI language», «Why»: the sentence saying Russian recipes under an English UI read poorly no longer matches reality, reworded (the data is English; Russian-speaking visitors see English recipes under a Russian UI). The idea itself, its costs and its trigger are unchanged.

## Verification results

- `rg -n "[А-Яа-яЁё]" supabase/demo/source supabase/demo/_build.ts supabase/demo/__tests__ supabase/demo/seed.json supabase/demo/load-seed.sql supabase/demo/photos.json` = 0 hits.
- Same search over `supabase/demo/README.md supabase/demo/photos/CREDITS.md supabase/demo/DEPLOY.md README.md docs/decisions/0034-bilingual-ui-by-browser-language.md`: only the cross-link line 1 of README.md, supabase/demo/README.md, DEPLOY.md and CREDITS.md, and in CREDITS.md the author name «Надежда Мустафаева» (line 9 and the casserole-photo row).
- Grep «Russian» / «русск» in `README.md`, `README.ru.md`, `supabase/demo/README.md`, `CREDITS.md`: the remaining hits are the `plans/` logs clause (line 5 and line 34 of both READMEs; stays by the plan), the bilingual-UI statements and the `.ru.md` pair links. Nothing says the demo data is Russian any more, except history text that must stay: the ADR 0034 «Demo data stays Russian» line (kept, followed by the Update).
- Structural comparison (`HEAD:supabase/demo/seed.json` vs the new file; script `scratchpad/compare.cjs`): 8209 nodes walked, 0 problems — same keys, same array lengths, every non-string value equal, every string outside the text fields equal (ids, dates, `photo_path`, `video_urls`, numbers). Row counts: product_categories 5, dish_categories 7, products 65, product_variants 75, recipes 20, recipe_steps 105, recipe_dish_categories 23, recipe_ingredients 182, cook_logs 39. Keys whose strings changed:

```
$.product_categories[].name x5
$.dish_categories[].name x7
$.products[].name x65
$.products[].note x9
$.product_variants[].name x17
$.product_variants[].note x1
$.recipes[].name x20
$.recipes[].notes x11
$.recipe_steps[].text x105
$.recipe_ingredients[].note x11
$.cook_logs[].snapshot.ingredients[].productName x354
$.cook_logs[].snapshot.ingredients[].variantName x59
$.cook_logs[].note x9
$.cook_logs[].snapshot.nutrition.incompleteProducts[].productName x2
```

- `photos.json`: `git diff HEAD -- supabase/demo/photos.json` is empty (byte-identical).
- `pnpm vitest run supabase/demo`: 12 passed, including «matches what the generator builds from the sources» (generator run with `WRITE_DEMO_SEED=1` first, then the full `pnpm test`).
- Prettier: `pnpm exec prettier --write <file>` per changed source/test/doc file. For `BACKLOG.md` / `BACKLOG-ru.md` prettier rewrote their tables on ~85 lines each, so I restored both from HEAD and applied the two text edits without prettier (the diff is 4 lines per file).
- `pnpm lint` exit 0; `pnpm build` exit 0; `pnpm test` exit 0 (16 files, 129 tests). The baseline in `plans/localization/baseline/` had no errors; no new ones.
- Exports: none added.
- Live check, local stack only. The local DB held only the dev data (1 recipe, 13 products, all `dddddddd-` ids). Steps: data-only `pg_dump` kept in the scratchpad as a safety net; `supabase/dev-data-cleanup.sql` emptied the target (the import needs an empty database); `pnpm dev`; signed in as the dev user; English UI set through `localStorage` (`recipe-book.language` = `en`, the test browser is Russian); `seed.json` imported through the settings import block (file set on the input from the page; the app answered «Imported 65 products, 20 recipes and 39 log entries»). Observed (diagnostic, not evidence-grade): recipe list «Total recipes: 20», grouped Breakfasts / Lunches / Dinners, English names, no Cyrillic in the page text; «Chili con carne» shows «Nutrition is not fully filled in» in the list and in the log, and its card lists «Homemade adjika» among the products without nutrition (steps, notes and storage read as English); products page shows the five English categories and English product and variant names; log page «October 2026» with English names and dates like `20 Oct 2026`. Only console error: an IndexedDB `NotFoundError` from the persister in the test browser profile, unrelated to the data.
- Side effect to know about: the import matches dish categories by name, so the seven English categories were added next to the seven Russian reference ones, and the local settings page showed 14 dish categories. On the demo project `demo.reset()` truncates `dish_categories` before the import, so it should not happen there; the orchestrator can confirm 7 dish categories after the rollout reset.
- Restore, as `docs/agents/local-environment.md` says: `npx supabase db reset`, `supabase/dev-data.sql`, dev-user sign-up. Counts before the check = after the restore: recipes 1, products 13, product_variants 17, cook_logs 0, product_categories 5, dish_categories 7, recipe_steps 3, recipe_ingredients 5; the dev user `dev@recipe-book.local` exists (its id is new after the reset). Dev server stopped, `.playwright-mcp` removed.
- Phase stop condition: satisfied. Runtime verification beyond the local live check: not performed by the developer (Visual Verification N/A); Rollout is the orchestrator's.

## Known issues / follow-ups

- Proper names with no English form are kept in Latin transliteration because the sources must have no Cyrillic: the video sources in the recipe notes («ProSto Kuhnya», chef Belkovich; «Edim Doma», Yulia Vysotskaya) and «Skurikhin» in the header comment of `products.ts`. `videoUrls` are unchanged.
- Judgment calls in names, for the reviewer: «Российский» (cheese variant) -> «Gouda» (close in nutrition and internationally known; numbers unchanged); «Томаты в собственном соку» -> «Canned tomatoes» (distinct from «Tomatoes»); «Заготовки» -> «Batch cooking»; «Шампиньоны» -> «Button mushrooms»; «Яблоки с дачи» -> «Apples from the country house»; «Куриные котлеты» -> «Chicken patties» (as in the old README photo gloss); the note «КБЖУ для сухого / сухой / сухих» -> «Nutrition for the dry product» in all three places.
- Fictional brands: Луговое -> Meadow, Ясный день -> Bright Day, Тихий ручей -> Quiet Creek, consistent across variants and the pinned variants in ingredients.
- The Russian copies (`supabase/demo/README.ru.md`, `CREDITS.ru.md`) quote the data in English with no Russian gloss (the plan allowed a gloss only optionally).
- Nothing from the plan contradicted reality.

## Name mapping (Russian -> English), in source order

**Recipes**

| Russian | English |
|---|---|
| Сырники | Cottage cheese pancakes |
| Овсянка с бананом и орехами | Oatmeal with banana and nuts |
| Творожная запеканка | Cottage cheese casserole |
| Плов с курицей | Chicken pilaf |
| Гречка с грибами и луком | Buckwheat with mushrooms and onion |
| Паста болоньезе | Pasta bolognese |
| Голубцы | Stuffed cabbage rolls |
| Запечённая курица с овощами | Baked chicken with vegetables |
| Куриные котлеты | Chicken patties |
| Лосось с брокколи | Salmon with broccoli |
| Борщ | Borscht |
| Куриный суп с лапшой | Chicken noodle soup |
| Крем-суп из тыквы | Pumpkin cream soup |
| Шарлотка | Charlotte apple cake |
| Банановый хлеб | Banana bread |
| Чили кон карне | Chili con carne |
| Греческий салат | Greek salad |
| Хумус | Hummus |
| Овсяное печенье | Oatmeal cookies |
| Блины | Blini |

**Dish categories**

| Russian | English |
|---|---|
| Завтраки | Breakfasts |
| Обеды | Lunches |
| Ужины | Dinners |
| Супы | Soups |
| Выпечка | Baking |
| Десерты | Desserts |
| Заготовки | Batch cooking |

**Product categories**

| Russian | English |
|---|---|
| Молочное и яйца | Dairy and eggs |
| Мясо и рыба | Meat and fish |
| Овощи, фрукты и зелень | Vegetables, fruit and herbs |
| Крупы, мука и макароны | Grains, flour and pasta |
| Бакалея, масла и специи | Pantry, oils and spices |

**Products**

| Russian | English |
|---|---|
| Молоко | Milk |
| Творог | Cottage cheese |
| Кефир 1% | Kefir 1% |
| Йогурт натуральный 1.5% | Plain yogurt 1.5% |
| Сливки 10% | Cream 10% |
| Сметана 20% | Sour cream 20% |
| Сметана 15% | Sour cream 15% |
| Сливочное масло 82.5% | Butter 82.5% |
| Яйцо куриное | Chicken egg |
| Сыр твёрдый | Hard cheese |
| Сыр фета | Feta |
| Куриное филе | Chicken breast fillet |
| Куриные бёдра без кожи | Skinless chicken thighs |
| Говяжий фарш | Ground beef |
| Фарш домашний | Homemade ground meat |
| Говядина, лопатка | Beef shoulder |
| Лосось (сёмга) | Salmon |
| Картофель | Potatoes |
| Морковь | Carrots |
| Лук репчатый | Onion |
| Чеснок | Garlic |
| Капуста белокочанная | White cabbage |
| Свёкла | Beetroot |
| Помидоры | Tomatoes |
| Огурцы | Cucumbers |
| Перец болгарский | Bell pepper |
| Брокколи | Broccoli |
| Тыква | Pumpkin |
| Кабачок | Zucchini |
| Шампиньоны | Button mushrooms |
| Банан | Banana |
| Яблоки | Apples |
| Лимон | Lemon |
| Укроп | Dill |
| Петрушка | Parsley |
| Рис | Rice |
| Гречка | Buckwheat |
| Овсяные хлопья | Rolled oats |
| Манная крупа | Semolina |
| Макароны | Pasta |
| Мука пшеничная | Wheat flour |
| Сахар | Sugar |
| Панировочные сухари | Breadcrumbs |
| Нут отварной | Cooked chickpeas |
| Масло растительное | Vegetable oil |
| Томатная паста | Tomato paste |
| Томаты в собственном соку | Canned tomatoes |
| Фасоль красная консервированная | Canned kidney beans |
| Маслины | Olives |
| Паста тахини | Tahini |
| Мёд | Honey |
| Грецкий орех | Walnuts |
| Миндаль | Almonds |
| Изюм | Raisins |
| Соль | Salt |
| Вода | Water |
| Ванильный сахар | Vanilla sugar |
| Разрыхлитель теста | Baking powder |
| Перец чёрный молотый | Ground black pepper |
| Паприка молотая | Ground paprika |
| Зира молотая | Ground cumin |
| Лавровый лист | Bay leaf |
| Корица молотая | Ground cinnamon |
| Орегано сушёный | Dried oregano |
| Аджика домашняя | Homemade adjika |

**Product variants**

| Russian | English |
|---|---|
| Луговое 3.2% | Meadow 3.2% |
| Луговое 2.5% | Meadow 2.5% |
| Ясный день 3.5% | Bright Day 3.5% |
| Тихий ручей 5% | Quiet Creek 5% |
| Тихий ручей 9% | Quiet Creek 9% |
| Обезжиренный | Fat-free |
| Российский | Gouda |
| Пармезан | Parmesan |
| Классический | Regular |
| Нежирный | Lean |
| Спагетти | Spaghetti |
| Вермишель тонкая | Thin vermicelli |
| Белый | White |
| Тростниковый | Cane |
| Подсолнечное | Sunflower |
| Оливковое | Olive |
| Кукурузное | Corn |