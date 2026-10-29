Status: COMPLETED

## Phase goal
Make each recipe name in the product card's "Used in recipes" block a link to the recipe card; each row a tap target of at least 44px.

## What was implemented
- Each row is now a real anchor built with `createLink` (same pattern as the recipes list and the log entry), pointing at `routerPaths.recipeCard` with typed `params={{ recipeId }}`. It is a push navigation, so browser back returns to the product card.
- The anchor carries the former row's border/background/radius, `min-height: 44px`, `align-items: center`, and a `:focus-visible` outline in `theme.palette.primary` (same as the existing focus style in StorageFields).
- The doc comment was updated to say the names are links.
- No new user-facing text, no new dependencies.

## Files created
- plans/used-in-recipes-links/phase-1/iter-1/DEV-REPORT.md

## Files modified
- src/pages/ProductPage/_internal/UsedInRecipes/_UsedInRecipes.tsx: wraps the name in `SLink`, imports `routerPaths`, doc comment fixed.
- src/pages/ProductPage/_internal/UsedInRecipes/_styles.ts: `SItem` is now a flex `li`; added `SAnchor` and the exported `SLink = createLink(SAnchor)`.

## Verification
- `pnpm exec prettier --write` on the three files in the folder: unchanged.
- `pnpm lint`: passed, no output.
- `pnpm build`: passed.
- `pnpm test`: 16 files, 129 tests passed.
- Exports: `SLink` is imported by `_UsedInRecipes.tsx`.
- Live check on the local stack (observed by the developer, not formal evidence): product 103 shows one `<a href="/recipes/...301">` inside an `li`, height measured 44px; click opens the recipe card; `history.back()` returns to the product card. The empty-state text was not checked live: every dev product used by the dev recipe is non-empty and I did not find an unused product, and that branch is unchanged. The only console error is an IndexedDB `NotFoundError` from the query persister in the test browser, unrelated to this change.
- Browser closed, `.playwright-mcp` removed, dev server stopped.

## Known issues / follow-ups
None. No `Visual references` (design.source is none); the styling follows the recipe list row precedent (Free choice).
