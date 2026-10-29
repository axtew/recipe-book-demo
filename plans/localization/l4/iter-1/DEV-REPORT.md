Status: STOPPED_ON_PLAN_GAP

# Phase L4 — iteration 1

## Phase goal

Agent instructions in English (15 files), a Russian `-ru.md` read-copy next to each, `scripts/publish-exclude.txt` keeps the copies out of the public repository.

## Plan gap

The plan says: "`scripts/publish-exclude.txt` — add `glob:*-ru.md`" (Files to modify, and step 4: "Confirm `git filter-repo` matches `glob:*-ru.md`").

Reality, `scripts/publish-public.ps1`:

- `Read-ExcludeList` throws on any line matching `^(glob|regex|literal):` with "only plain literal paths are supported". Adding the planned line makes every publish run fail before filtering.
- The header of `scripts/publish-exclude.txt` says the same ("No glob:/regex: prefixes: the script also uses this list to look for markdown links to excluded files").
- The same literal list feeds the leak check (`:(literal)` pathspec) and `Find-ExcludedLinks` (exact path or directory-prefix match), so a glob would not work there even if the parser accepted it.

The Potential gotchas line "`*` in `glob:` crosses `/`; still verify" assumes the script passes globs to filter-repo; it does not.

The user constraint limits the scope to the 15 files, their copies and `publish-exclude.txt` — the script is out of scope, so the gap cannot be closed from inside this phase.

## Files created / modified

None. The git index and working tree are untouched (apart from this report).

## Recommended fix (owner decides)

1. Amend L4 step 2 / "Files to modify": list the 15 `-ru.md` files as literal paths in `scripts/publish-exclude.txt` (works with the script as is, and the link check then also catches any public link to a copy; cost: the list is edited whenever a copy is added, and L8 adds `BACKLOG-ru.md`). Step 4 then checks the dry run result as planned.
2. Or extend L4 scope to `scripts/publish-public.ps1` (glob support in `Read-ExcludeList`, the leak pathspec and `Find-ExcludedLinks`) — a larger change and it changes hashes on the next push.

Option 1 is the smaller one. On approval, the phase is re-run unchanged otherwise.
