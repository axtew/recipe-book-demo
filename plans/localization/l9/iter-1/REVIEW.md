MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Phase L9 (English demo seed), iteration 1, reviewed against `plans/localization/plan.md` («Phase L9» contract plus the amendments of 2026-10-29) and the working-tree diff. The change is a faithful translation: my own structural comparison of `HEAD:supabase/demo/seed.json` against the working file found 0 problems, `photos.json` is untouched, the translation keeps every fact, and the docs match the contract. Only non-blocking notes remain.

## Checks performed

1. **Structural comparison (own script, `git show HEAD:supabase/demo/seed.json` against the working file).**
   - 8209 nodes walked, 0 problems: same keys and order, same array lengths, every non-string value equal, and every string outside the text fields equal (ids, dates, `photo_path`, `video_urls`).
   - The 14 changed keys are exactly the ones the developer listed: category names, product, variant and recipe names, product, variant, recipe and ingredient notes, step texts, cook log notes, and the snapshot `productName` / `variantName` / `incompleteProducts[].productName`.
   - A second pass compared the digit sequences of every changed Russian string with its English counterpart (temperatures, minutes, grams, 1.5 cm, 2.5 l, 35–40, …). There were 0 differences, so no number was lost or altered.
   - The source files with all string literals masked (`"S"`) differ from HEAD only in the translated header comments and prettier line wrapping. Order, numbers, flags, `photo` and `videoUrls` are unchanged.
   - `git diff HEAD -- supabase/demo/photos.json` is empty (byte-identical).
2. **Cyrillic search** (the contract's first Verification command) over the sources, `_build.ts`, tests, `seed.json`, `load-seed.sql` and `photos.json` gives 0 hits. The docs search shows only the cross-link lines and the author name «Надежда Мустафаева» (`CREDITS.md:9`, `:26`).
3. **`pnpm vitest run supabase/demo`**: 12 passed, including «matches what the generator builds from the sources». **`pnpm lint`**: exit 0.
4. **No `src/` changes** (`git diff HEAD --stat -- src public` is empty). No stray files: `git status` shows only the planned files plus the staged orchestrator files. `plans/localization/l9/iter-1/` holds only the DEV-REPORT.
5. **Docs.**
   - `README.md:5`, `:15`, `:91` and the Russian pair are correct. The `plans/` logs clause stays, and the line-91 limitation now reads «in English only, whichever UI language is chosen».
   - `supabase/demo/README.md`: the «in Russian for now» sentence is gone, the data names are quoted in English with no gloss, and the recipe/photo table is in English. `README.ru.md` is consistent, with English data names inside Russian prose.
   - `CREDITS.md` and `CREDITS.ru.md`: the tables are in English and the author name is untouched.
   - ADR 0034: the «Demo data stays Russian» line is kept and the Update line is appended verbatim per contract.
   - BACKLOG pair: the two edits are correct, the idea, costs and trigger are unchanged, and the diff is 4 lines per file.
   - A repo-wide grep for «demo … Russian» outside `plans/` shows no remaining claim that the demo data is Russian, apart from the ADR history line that must stay.

## Translation quality

Names are natural English cookbook names, and there is no transliteration where a descriptive name exists: «Cottage cheese pancakes», «Stuffed cabbage rolls», «Chicken pilaf», «Charlotte apple cake», «Batch cooking». Widely known names are kept (Borscht, Blini, Hummus, Chili con carne, Pasta bolognese). The product naming is consistent across the sources, the snapshots, the README table and CREDITS: «Cottage cheese» is used for the product and inside the recipe names, the brands Meadow / Bright Day / Quiet Creek match between variants and the pinned variants, and «Homemade adjika» and «Sour cream 15%» keep their special-case roles (the test and the README bullet follow them). Steps and notes keep every fact: the step counts per recipe are unchanged (spot-checked pilaf, 7 steps), the cups-and-spoons note in «Blini» is complete, and the cookies yield note (400 g / 540 g) is complete. The register is imperative cookbook English.

### The flagged judgment calls

- **«Российский» → «Gouda» (`supabase/demo/source/products.ts:46`, `[363, 23.4, 29.5, 0]`).** I would change it to a neutral variant name.
  - The numbers are Russian semi-hard cheese. They fall inside the range of real Gouda labels, so it is not egregious, but it names a specific product whose nutrition the data does not claim to represent. The header comment says the values follow reference tables.
  - Gouda is also semi-hard, which sits oddly under the product «Hard cheese».
  - I suggest renaming the variant to «Semi-hard» (the siblings are one-word descriptors like «Regular» / «Lean» / «Cane»), with the product left as «Hard cheese». No recipe or cook log references this variant, so the rename touches only `products.ts` plus a regenerate of `seed.json` / `load-seed.sql`. This is a polish item, not a defect: keeping «Gouda» is defensible.
- **«Томаты в собственном соку» → «Canned tomatoes»**: fine, distinct from «Tomatoes», and the same numbers as before.
- **«Заготовки» → «Batch cooking»**: fine for the recipes that use it (stuffed cabbage rolls, chili, both frozen in portions). «Meal prep» would also work.
- **«Яблоки с дачи» → «Apples from the country house»**: understandable; «Apples from the dacha» or «from the garden» reads more natural, but this is a cook log note and optional.
- **«ProSto Kuhnya» and «Edim Doma»**: acceptable. These are channel and show names with no fixed English form, and the sources must not contain Cyrillic. «Skurikhin» in the header comment is likewise fine.

## Notes (non-blocking)

- **`recipes.ts:297`** «sprinkle with half of the lemon»: the Russian says to squeeze half a lemon over the fish, so «squeeze half of the lemon over» would be clearer.
- **`recipes.ts:597`** «until the blin is browned»: grammatical (blin is the singular) but unusual for English readers; «until the blini are browned on both sides» is more natural. Change both only if you regenerate anyway.
- **`CREDITS.md:9`** now has the sentence «The author name … is a name and is left as it is», while `CREDITS.ru.md` has no counterpart paragraph. The asymmetry existed before (the old English sentence had no Russian pair either) and the contract allowed it. If you want the pair symmetric, add the same sentence in Russian.
- **ADR 0034**: the Update line is indented two spaces as a continuation of the preceding bullet, so it renders inside the «Demo data stays Russian» list item. That is a reasonable reading of «append right after it»; nothing to change.
- **BACKLOG pair** is intentionally not prettier-formatted (it was not formatted at HEAD either), so this adds no formatting regression.
- **Page-specific exports without external consumers**: none (no code exports added).
- **Local live-check side effect** (14 dish categories after import because the import matches by name): the developer's explanation is correct for the demo reset (truncates `dish_categories` first). The orchestrator's Rollout step should confirm 7 dish categories after `demo.reset()`.
