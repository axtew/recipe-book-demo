MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Reviewed phase L1 (working tree vs index plus untracked): 32 ADRs translated in place, the index, and the new ADR 0033 / 0034. The translation is faithful and the stop condition holds: the Cyrillic search over `docs/decisions` returns 0 matches, 143 relative links resolve (my own check gives the same count as the developer report), `pnpm lint` exits 0. I found no defects. The notes below are non-blocking.

## Verification performed

- Cyrillic search (`rg -n` with the character class from the plan) over `docs/decisions` = 0 matches (rg exit 1).
- Link check (throwaway script in the scratchpad): 143 relative links in `docs/decisions/*.md`, 0 broken.
- `pnpm lint` = exit 0. `build` / `test` not re-run: no code touched.
- Mechanical parity of every translated file against `HEAD`, before the prose reading:
  - the multiset of link targets is identical for all 32 ADRs;
  - the dates are identical in all 32;
  - the backticked code tokens are identical in all except 0012 (the yo/ye sentence, see "Developer choices") and 0020 (the coefficient name `yield / <raw weight>` is now in English, correct);
  - the heading, bullet, numbered-item, nested-bullet and bold-marker counts are identical in all 32;
  - the numeric tokens are identical except for expected changes: 0001 "2 weeks" became "two-week"; 0027 "per 100 g" now occurs twice, matching the Russian word for "per-hundred-gram"; the 0012 code points; the new ADR numbers in 0002, 0031 and 0032.
- Nothing outside `docs/decisions/` and `plans/localization/` was touched. The ADR headings are not linked by anchor anywhere in the repo, and no script parses the ADR status lines.
- Prose side by side with the Russian original (`git show HEAD:...`): 0001, 0002, 0005, 0008, 0011, 0012, 0014, 0016, 0017, 0018, 0020, 0021, 0022, 0025, 0026, 0027, 0028, 0029, 0031, 0032 (20 files). The long ones are included: 0016, 0022, 0025, 0027, 0029 and 0020. Meaning is kept, nothing summarised, nothing added, options and consequences are complete, and the figures, dates and links are intact (Da Nang, AAG/APG, ~5 MB, 20 x 100 x 150 KB = 300 MB, 25 USD per month, the `RLS-1` defect, `B6`-`B9`). The English is natural and consistent: "Context and problem / Considered options / Decision / Consequences", `cook log`, `nutrition` for the Russian four-macro abbreviation.
- The index: the rule "an accepted ADR is not rewritten" is kept, plus one sentence on the language-only rewrite that links ADR 0033. All four statuses are listed. The rows for 0033 and 0034 are present and linked. The row titles equal the ADR headings. The statuses for 0002, 0031 and 0032 are exactly as the plan prescribes.
- ADR 0033 / 0034 against the plan decisions (L1 steps 3-4):
  - 0033 has `accepted`, 2026-10-25, supersedes 0031.
  - It carries every item the plan lists: English scope, bilingual README and reference docs (`X.md` / `X.ru.md`), `*-ru.md` read-copies (working repo only, excluded from the public copy, updated together with the original, never read by tools), what stays Russian (plans history and appended sections, `STATUS.md`, root `DEPLOY.md`, data), migration comments (one-time exception, strip-and-compare, rule unchanged), the unchanged technical names, ADR file names and pipeline vocabulary, and the three considered options (keep Russian; English only; the chosen split).
  - It also records the language-only rewrite, as step 2 requires. The reason (a portfolio for work abroad) is given.
  - 0034 has `accepted`, 2026-10-25, supersedes 0032 and the "Russian only" part of 0002. It covers `en.json` + `ru.json` with the `I18n` shape, detection by the primary `navigator.language` starting with `ru`, an explicit choice stored in `localStorage` "and only then" with detection never writing, formats per language (`1,234.5` / `25 Oct 2026` / Monday vs `1 234,5` / `DD.MM.YYYY`), the "Recipe Book" name in both languages, and the demo data staying Russian.
  - Nothing invented. The additions are consequences that follow directly from the plan: the stale `-ru.md` copy, the English migration comments with `backup_export_import` keeping Russian comments in prod, the key-parity test.

## Developer choices

- **0031 file status set to `superseded by ADR 0033`: accepted.** The plan named only the index row for 0031, but a file that says `accepted` while the index says `superseded` is an inconsistency, and 0002 / 0032 follow the same mechanism. This is a plan gap closed sensibly, not a code defect. The developer flagged it for the owner; I recommend keeping it.
- **`Supersedes:` line in 0033 / 0034: acceptable.** The plan states the supersession but not where it is recorded. The line is harmless and informative. It is a header field the other ADRs do not have; they record supersession only in the status line and the body.
- **0012 yo/ye sentence reworded to code points: faithful and acceptable.** The original normalises the two letters with a backticked pair. The new text, "Russian search folds the letter yo (U+0451) into ye (U+0435) on both sides of the comparison", keeps the meaning exactly, and nothing else in that ADR changed. The stop condition of the phase is a hard 0, and the "stays Russian (data)" rule is defined for code and test literals (`src/utils/search.ts` and similar), not for prose in ADRs, so leaving a visible Cyrillic glyph would have needed a plan amendment. The only cost is that the glyph is not visible to the reader. I would keep it as is.

## Notes (non-blocking)

- **Dangling quoted references, to carry into the next phases** (the developer listed them, and I confirmed against the text). The L4 / L8 contracts in the plan do not mention matching them yet, so the orchestrator should add them to the contracts or the phase prompts:
  - ADR 0017 quotes `conventions/data.md` -> "Purity of the domain module".
  - ADR 0025 quotes the `conventions/structure.md` section "Placement - one ladder for everything extracted" and the "Old name -> new" table of `plans/README.md`.
  - The BACKLOG section names quoted in 0004 / 0027 / 0028 / 0029 / 0030 / 0032 ("Rejected", "Nutrition from a label photo", "Planning assistant", "Recipe import from a screenshot or a link", "Families and multi-tenancy", "Publishing to the stores", "Household inventory").
  - In 0032, "Rejected" renders the Russian section name for rejected ideas, while the L8 plan calls the section "Rejected / deferred". Pick one when translating `BACKLOG.md`.
- **ADR 0034, considered options.** The plan lists three entries (always English by default; browser language; the decision). The ADR has two, with "language follows the browser, plus a manual choice in settings" as the chosen option. The choice and its reasoning are fully covered; the wording of the plan is ambiguous, so I do not count this as a deviation.
- **ADR 0033 does not mention two decisions from the "Decisions" list.** These are the Russian test data staying where the test checks Russian text (decision 5) and the strings compared against the database staying byte-identical (decision 9). Step 3 of L1 does not list them either, and the shared rules of the plan cover them for L5-L7, so there is no gap against the contract. If the owner wants the ADR to be self-contained for those phases, one line under "Stays Russian" would do.
- **ADR 0001 first-person detail.** The original context states in the third person that the husband has Android and the wife an iPhone; the translation says "My phone is Android, hers is an iPhone" (the author is the husband; the decision list below it keeps "the husband has Android"). The meaning is the same.
- **Line endings.** The developer reports the git LF to CRLF warning for the rewritten files (autocrlf). I found no CR characters in the working files and no trailing-whitespace lines.
- **Page-specific exports, UIKit, i18n and map checklist items: N/A.** This is a docs-only phase.
