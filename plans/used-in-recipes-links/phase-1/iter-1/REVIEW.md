MODE: review
STATUS: APPROVED
Issue source: none

## Summary
Reviewed the "Used in recipes" block change (`_UsedInRecipes.tsx`, `_styles.ts`). Each recipe name is now a typed `createLink` anchor to `routerPaths.recipeCard`. The change matches the recipes-list precedent, uses theme tokens only, and the doc comment is accurate. No blocking issues.

## Notes
- Precedent match: `SItem` (flex `li`) + `SAnchor` + `SLink = createLink(SAnchor)` mirrors `src/pages/RecipesPage/_internal/RecipeCard/_styles.ts:4-27`, including the `createLink` doc comment. The usage `to={routerPaths.recipeCard} params={{ recipeId }}` is identical to `RecipeCard/_RecipeCard.tsx:35` and `LogEntry/_LogEntry.tsx:60`. No path string literal.
- Styling: only theme tokens (`palette.border`, `surface`, `primary`); `44px` is the project's established tap-target form (same literal in the sibling `_styles.ts` files); no hex, no sticky/fixed, no new typography size (name stays in `B1`).
- Accessible name: the anchor contains only `<B1>{recipe.name}</B1>`, so the name is the recipe name. `B1` renders a `<p>`, as in the precedent link.
- Focus: `:focus-visible` 2px `primary` outline with 2px offset is identical to `RecipeEditorPage/_internal/StorageFields/_styles.ts:44-47`. The recipes-list and log links have no focus style, so this block is now slightly ahead of them. The task required it, so this is not a defect. A shared focus style for links could go to `BACKLOG.md`.
- Back navigation: the row is a push `Link`; `BackLink` on the recipe card calls `router.history.back()` when history exists (`BackLink/_BackLink.tsx:28-38`), so back returns to the product card. In a direct-open/PWA-restart case it falls back to `routerPaths.home`. That is existing behaviour, not a regression.
- Empty state: the `recipes.length === 0` branch and the `B2` text are unchanged (`_UsedInRecipes.tsx:18-20`). No regression is visible statically.
- Doc comment: "Recipes that contain the product, each a link to the recipe card." is true. The old "plain text" claim was removed.
- Exports: `SLink` has an importer (`_UsedInRecipes.tsx`); `SAnchor` is not exported. No unused exports, no new i18n keys, no new dependencies.
- Padding `10px 12px` differs from the sibling rows (`8px`, `12px`). It is the row's former padding, kept as is, so not an issue.
- Verification claims (lint, build, test 129) are the developer's. I did not re-run them. This is a static review.
