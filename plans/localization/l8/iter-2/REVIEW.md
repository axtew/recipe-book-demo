MODE: review
STATUS: NEEDS_CHANGES
Issue source: code

## Summary

Iteration 2 of L8 reviewed against the 2026-10-29 amendment "Phase L8, L9 - added 2026-10-29 (README, BACKLOG link)" (L8 parts only). Both iteration-1 findings are closed and the README edits match the amendment line by line, with one exception: the new line-5 sentence says "the documentation" is in English and Russian, which overclaims.

## Iteration-1 findings

- Code issue (`docs/user-guide.md:21,23`): fixed. Line 21 now reads "(the category names are your own, for example "Breakfasts" or "Soups")"; line 23 keeps "Uncategorized", which is a dictionary label (`recipeList.uncategorized`).
- Plan gap (README pair outside every phase): closed by the amendment; the developer applied it.
- Plan gap (BACKLOG cross-link): closed. `BACKLOG.md` has no `BACKLOG-ru.md` reference (grep), `BACKLOG-ru.md:1` links back to `BACKLOG.md`.
- Iteration-1 note on `docs/user-guide.ru.md:5`: fixed, now "Recipe Book" (amendment item, ADR 0034).

## What was verified (no issues)

- `git diff HEAD -U0` over both READMEs shows exactly the amendment's changes and nothing else.
  - `README.md`: line 5 rewritten; the three "(in Russian)" markers dropped at :27 (user-guide), :58 (local-environment), :83 (demo DEPLOY); :91 reduced to "The demo content is in Russian for now."
  - `README.ru.md`: line 5 and :91 rewritten as the counterpart; :27 now links `docs/user-guide.ru.md`, :83 links `supabase/demo/DEPLOY.ru.md`. `docs/agents/local-environment.md` has no `.ru.md` pair (agent instructions get no Russian copy, ADR 0035), so it stays linked as is.
- `README.md:15` (demo "in Russian") and the line-91 demo-content clause are left for L9 as the amendment says; `README.md:34` / `README.ru.md:34` ("logs in Russian") are true and untouched. The developer's list of remaining "Russian" / "русск" hits matches the files and gives a reason for each.
- The two READMEs stay parallel: the changed hunks sit on the same lines (5, 27, 83, 91; :58 exists only in the English one because the Russian README never had that marker), and the link set differs only by the intended `.ru.md` retargets and the language switch link.
- Every link in both READMEs resolves to an existing file (the `.ru.md` targets exist in the working tree). The public English README links only English files.
- "The interface ... in English and Russian (the app follows the browser language)" is accurate (ADR 0034). "demo data and the logs under `plans/` are still in Russian" is accurate (ADR 0033, L9 pending).
- `pnpm lint` re-run by the reviewer: exit code 0, no output beyond the `eslint .` banner.
- I did not re-run the publish dry run; the developer's "All checks passed" is plausible: the only link changes point to files that are not excluded.

## Issues

### Code issues

#### Documentation accuracy

- [code] `README.md:5` and `README.ru.md:5` - "The interface and the documentation are in English and Russian" / "Интерфейс и документация - на английском и русском" overclaims. Per ADR 0033 only the README pair and the reference docs (user guide, manual checks, task, architecture, demo DEPLOY / README / CREDITS) have Russian copies; ADRs (`docs/decisions/`), `AGENTS.md`, `docs/agents/**` (incl. `local-environment.md`, which the same README links two paragraphs later) and `plans/README.md` are English only. A public reader who follows the sentence to an ADR or the conventions will find no Russian version. The amendment itself only asked to state that the interface is English and Russian; "documentation" was added by the developer. Narrow it, for example: "The interface is in English and Russian (the app follows the browser language), and the reference docs have English and Russian versions; the demo data and the logs under `plans/` are still in Russian." and the Russian counterpart. Keep both files parallel.

## Notes

- `README.ru.md:15` links `supabase/demo/photos/CREDITS.md` (English) although `CREDITS.ru.md` now exists. It is outside the three links the amendment names ("every other README statement untouched"), so leaving it is defensible; the "Russian README links the `.ru.md` pairs where they exist" clause could also be read as covering it. Owner's call; a one-token change if wanted.
- `docs/user-guide.ru.md:21-23` ("Завтраки", "Супы" and so on) reads as examples; the developer's decision to leave it is fine.
- Carried over from iteration 1 for L9: ADR 0034 line about the English seed, `supabase/demo/README.md` / `CREDITS.md` "Russian for now" sentences, `README.md:15` and the line-91 clause.
