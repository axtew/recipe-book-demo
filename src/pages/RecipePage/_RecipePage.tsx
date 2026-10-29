import { BackLink } from "@/components/BackLink";
import { B1, B2, Caption1, H1, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";

import { CookLogAction } from "./_internal/CookLogAction";
import { CookStats } from "./_internal/CookStats";
import { IncompleteWarning } from "./_internal/IncompleteWarning";
import { IngredientsBlock } from "./_internal/IngredientsBlock";
import { NutritionBlock } from "./_internal/NutritionBlock";
import { StepsBlock } from "./_internal/StepsBlock";
import { StorageBlock } from "./_internal/StorageBlock";
import { VideoBlock } from "./_internal/VideoBlock";
import {
  SBadge,
  SEditLink,
  SHeader,
  SNotes,
  SPage,
  SPhoto,
  SPlaceholder,
  SSection,
  STopBar,
} from "./_styles";
import { useRecipeCard } from "./_useRecipeCard";

interface IProps {
  recipeId: string;
}

/**
 * Recipe card: photo, nutrition, storage, ingredients, steps, videos, notes and statistics from the
 * log — in this order on the screen.
 */
export function RecipePage({ recipeId }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard);
  const card = useRecipeCard(recipeId);

  if (card === null) {
    return (
      <SPage>
        <STopBar>
          <BackLink to={routerPaths.home}>
            <B2 as="span">{l.backLink}</B2>
          </BackLink>
        </STopBar>
        <SPlaceholder>
          <H3>{l.notFoundTitle}</H3>
          <B2 color="textMuted">{l.notFoundHint}</B2>
        </SPlaceholder>
      </SPage>
    );
  }

  const { recipe, nutrition, resolved, snapshot, productsById, metaParts, cookLogs } = card;

  return (
    <SPage>
      <STopBar>
        <BackLink to={routerPaths.home}>
          <B2 as="span">{l.backLink}</B2>
        </BackLink>
        <SEditLink to={routerPaths.recipeEdit} params={{ recipeId: recipe.id }}>
          <B2 as="span">{l.editButton}</B2>
        </SEditLink>
      </STopBar>

      {recipe.photoUrl !== null && <SPhoto src={recipe.photoUrl} alt={l.photoAlt} />}

      <SHeader>
        <H1>{recipe.name}</H1>
        <Caption1 color="textMuted">{metaParts.join(" · ")}</Caption1>
        {recipe.archivedAt !== null && (
          <SBadge>
            <Caption1 as="span" color="textMuted">
              {l.archivedBadge}
            </Caption1>
          </SBadge>
        )}
      </SHeader>

      <SSection>
        <IncompleteWarning products={nutrition.incompleteProducts} />
        <NutritionBlock recipeId={recipe.id} nutrition={nutrition} />
      </SSection>

      {recipe.freezable && (
        <StorageBlock freezerDays={recipe.freezerDays} fridgeDays={recipe.fridgeDays} />
      )}

      <IngredientsBlock
        ingredients={recipe.ingredients}
        resolved={resolved}
        productsById={productsById}
      />

      <StepsBlock steps={recipe.steps} />

      {recipe.videoUrls.length > 0 && <VideoBlock urls={recipe.videoUrls} />}

      {recipe.notes !== null && recipe.notes.trim() !== "" && (
        <SSection>
          <H3>{l.notes.title}</H3>
          <SNotes>
            <B1>{recipe.notes}</B1>
          </SNotes>
        </SSection>
      )}

      <CookStats cookLogs={cookLogs} />

      <CookLogAction recipeId={recipe.id} snapshot={snapshot} />
    </SPage>
  );
}
