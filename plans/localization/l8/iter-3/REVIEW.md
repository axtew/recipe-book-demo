MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Iteration 3 of L8 (fix after the iter-2 review) reviewed against ADR 0033/0035 and the 2026-10-29 amendment. The line-5 overclaim is fixed, both READMEs stay parallel, and nothing outside the iter-3 delta changed. The phase as a whole is clean.

## Verified

- `README.md:5` / `README.ru.md:5` now say: interface in English and Russian (follows the browser language, ADR 0034); reference docs have English and Russian versions; demo data and the `plans/` logs are still in Russian. This matches ADR 0033 exactly: the Russian pairs exist for README, `docs/user-guide`, `manual-checks`, `task`, `architecture`, `supabase/demo/*` (all present as `.ru.md`), while ADRs, `AGENTS.md`, `docs/agents/**` are no longer claimed. "Documentation" is gone, as suggested in iter-2.
- The two sentences are semantically identical, same position, same structure. Both READMEs remain parallel (changed hunks on lines 5, 15 [ru only, intended], 27, 58 [en only, as before], 83, 91).
- `README.ru.md:15` now links `supabase/demo/photos/CREDITS.ru.md` (label and target); the file exists, and `scripts/publish-exclude.txt` has no match for CREDITS (only `BACKLOG-ru.md` was added to the exclusions, and neither README links it). This resolves the iter-2 note, consistent with the amendment's "Russian README links the `.ru.md` pairs where they exist". `README.md:15` correctly keeps the English `CREDITS.md`.
- Every relative link in both READMEs resolves (scripted existence check, no MISSING). The public English README links only English files.
- Cumulative diff of the two READMEs vs HEAD is 10 lines each, all within the amendment plus the two iter-3 changes; nothing else touched.
- Per the developer's report `pnpm lint` exit 0; iter-2 re-run was also 0. README-only changes cannot affect it, so I did not re-run it.

## Notes

- "the logs under `plans/` are still in Russian": strictly, ADR 0033 makes new files in `plans/` English (the L8 iteration files themselves are English), so "still" refers to the history. Same wording is already in `README.md:34` / `README.ru.md:34`; accurate enough, no change needed.
- For L9 (carried over): `README.md:15` and `README.md:91` ("demo content is in Russian for now"), ADR 0034 line about the English seed, `supabase/demo/README.md` / `CREDITS.md` "Russian for now" sentences.
