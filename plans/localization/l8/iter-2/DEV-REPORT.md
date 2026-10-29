Status: COMPLETED

# L8 iter-2 DEV-REPORT (amendment «README, BACKLOG link»)

## Phase goal
Apply the L8 parts of the 2026-10-29 amendment «README, BACKLOG link»: language statements in the README pair, two small user-guide fixes, confirm the BACKLOG one-way link. The «L9 contract must include» bullet is not touched. Iteration 1 is kept as is.

## What was implemented
- `README.md`: line 5 rewritten (interface and documentation in English and Russian by browser language; demo data and `plans/` logs still Russian); «(in Russian)» markers dropped at the user-guide, local-environment and demo DEPLOY links; line-91 limitation is now «The demo content is in Russian for now.»
- `README.ru.md`: the same line-5 and line-91 rewrite in Russian; links retargeted to `docs/user-guide.ru.md` and `supabase/demo/DEPLOY.ru.md`. `docs/agents/local-environment.md` has no `.ru.md` pair, so it stays linked as is (README.ru.md never had a marker on it). Structure of the two READMEs stays parallel.
- `docs/user-guide.md:21`: «(the category names are your own, for example "Breakfasts" or "Soups")»; line 23 «Uncategorized» is the app's own fallback group and stays.
- `docs/user-guide.ru.md:5`: «Книга рецептов» -> «Recipe Book». The Russian lines 21-23 already say «категориям блюд («Завтраки», «Супы» и так далее)», which reads as examples, so left unchanged.
- BACKLOG: `BACKLOG.md` has no link to `BACKLOG-ru.md`; `BACKLOG-ru.md:1` links back to `BACKLOG.md`. Already right, no change.

## Files created
- `plans/localization/l8/iter-2/DEV-REPORT.md`

## Files modified (this iteration; iteration-1 files remain in place)
- `README.md`, `README.ru.md`, `docs/user-guide.md`, `docs/user-guide.ru.md`

## Remaining «Russian» / «русск» hits in the READMEs
- `README.md:5` — the new line-5 sentence itself (languages statement; demo data and `plans/` logs are Russian).
- `README.md:15` — «fictional, in Russian» demo line; left for L9 per the amendment.
- `README.md:34` — «These working logs are in Russian» about `plans/`; true, untouched.
- `README.md:91` — «The demo content is in Russian for now»; the clause kept for L9.
- `README.ru.md:5` — same as README.md:5.
- `README.ru.md:34` — «Рабочие журналы ведутся на русском»; true, untouched.
- `README.ru.md:91` — demo-content clause, kept for L9 (README.ru.md:15 has no language word; its counterpart goes to L9 with README.md:15).

## Verification
- `pnpm exec prettier --write` per file on the four files: unchanged.
- Relative links in the four changed files: scripted existence check, 0 broken.
- Publish dry run: `scripts/publish-public.ps1` against a temp source clone of the working tree (uncommitted state overlaid and committed in the clone, since the script publishes committed state only), `-WorkDir` in the scratchpad, no `-Remote`: «All checks passed», 89 commits. Both temp dirs deleted afterwards.
- `pnpm lint`: green, no output errors.
- Runtime/browser: not applicable (docs only).

## Known issues / follow-ups
- Nothing outside scope was changed. L9 inherits the demo statements listed above.
