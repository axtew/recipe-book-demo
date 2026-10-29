import { useMemo, useState } from "react";

import { BackLink } from "@/components/BackLink";
import { B2, H1, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useRecipes } from "@/hooks/useAppData.hook";
import { useRecipeDraft } from "@/hooks/useRecipeDraft.hook";
import { routerPaths } from "@/routes/_paths";

import { createEmptyDraft, recipeToDraft } from "./_helpers";
import { DraftPrompt } from "./_internal/DraftPrompt";
import { RecipeForm } from "./_internal/RecipeForm";
import { SPage, SPlaceholder } from "./_styles";
import type { IRecipeEditorPageProps, TDraftChoice } from "./_types";

/**
 * Recipe editor: one screen for both creating (`recipeId === null`) and editing.
 *
 * If localStorage holds an unsaved draft, it first asks what to do with it — the form is mounted
 * with the chosen initial state. The route mounts the screen with a `key` equal to the recipe id,
 * so switching recipes recreates all the state.
 */
export function RecipeEditorPage({ recipeId }: IRecipeEditorPageProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor);
  const recipes = useRecipes();
  const { storedDraft, saveDraft, clearDraft, finishDraft } = useRecipeDraft(recipeId);
  const [choice, setChoice] = useState<TDraftChoice>(
    storedDraft === null ? "discarded" : "pending",
  );

  const recipe = recipeId === null ? null : (recipes.find(({ id }) => id === recipeId) ?? null);

  const initialDraft = useMemo(() => {
    if (choice === "restored" && storedDraft !== null) return storedDraft;

    return recipe === null ? createEmptyDraft() : recipeToDraft(recipe);
  }, [choice, storedDraft, recipe]);

  const backLink =
    recipe === null ? (
      <BackLink to={routerPaths.home}>
        <B2 as="span">{l.backLink}</B2>
      </BackLink>
    ) : (
      <BackLink to={routerPaths.recipeCard} params={{ recipeId: recipe.id }}>
        <B2 as="span">{l.backLink}</B2>
      </BackLink>
    );

  if (recipeId !== null && recipe === null) {
    return (
      <SPage>
        {backLink}
        <SPlaceholder>
          <H3>{l.notFoundTitle}</H3>
          <B2 color="textMuted">{l.notFoundHint}</B2>
        </SPlaceholder>
      </SPage>
    );
  }

  return (
    <SPage>
      {backLink}
      <H1>{recipeId === null ? l.titleNew : l.titleEdit}</H1>

      {choice === "pending" ? (
        <DraftPrompt
          onRestore={() => setChoice("restored")}
          onDiscard={() => {
            clearDraft();
            setChoice("discarded");
          }}
        />
      ) : (
        <RecipeForm
          recipeId={recipeId}
          recipe={recipe}
          initialDraft={initialDraft}
          saveDraft={saveDraft}
          finishDraft={finishDraft}
        />
      )}
    </SPage>
  );
}
