import { useResetRecipeNutritionOverridesMutation } from "@/api/mutations/recipes.mutations";
import { Button } from "@/components/Button";
import { NutrientsRow } from "@/components/NutrientsRow";
import { B2, Caption1, Caption2, H3, Num1, Num2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { INutrients, IRecipeNutrition } from "@/domain/nutrition";
import { formatKcal, formatMacro } from "@/utils/helpers/nutrients";
import { isNutritionEmpty } from "@/utils/helpers/recipes";

import { SBig, SCell, SLine, SMacros, SMarker, SWrapper } from "./_styles";

interface IProps {
  recipeId: string;
  nutrition: IRecipeNutrition;
}

const MACRO_FIELDS = ["protein", "fat", "carbs"] as const;

/**
 * Recipe nutrition: large per 100 g, smaller per serving and per whole dish.
 *
 * Manually entered values are marked with an asterisk, named under the numbers, and the
 * “Recalculate” button returns the calculation from the ingredients. Without a dish yield, next to
 * the per-100 g number there is a hint that it was calculated from the raw weight.
 */
export function NutritionBlock({ recipeId, nutrition }: IProps) {
  const l = useI18nSelector(({ l }) => ({ ...l.recipeCard.nutrition, nutrients: l.nutrients }));
  const { mutate, isPending } = useResetRecipeNutritionOverridesMutation();

  const { per100g, perServing, total, overriddenFields, basis } = nutrition;

  const isEmpty = isNutritionEmpty(nutrition);

  function renderMark(field: keyof INutrients) {
    return overriddenFields.includes(field) ? (
      <SMarker aria-label={l.overrideMark}>*</SMarker>
    ) : null;
  }

  return (
    <SWrapper>
      <H3>{l.title}</H3>

      {isEmpty ? (
        <B2 color="textMuted">{l.emptyHint}</B2>
      ) : (
        <>
          <SLine>
            <Caption1 color="textMuted">{l.per100g}</Caption1>
            <SBig>
              <Num1>
                {formatKcal(per100g.kcal)}
                {renderMark("kcal")}
              </Num1>
              <Caption1 color="textMuted">{l.nutrients.kcal}</Caption1>
            </SBig>
            <SMacros>
              {MACRO_FIELDS.map((field) => (
                <SCell key={field}>
                  <Num2>
                    {formatMacro(per100g[field])}
                    {renderMark(field)}
                  </Num2>
                  <Caption2 color="textMuted">{l.nutrients[field]}</Caption2>
                </SCell>
              ))}
            </SMacros>
            {basis === "rawWeight" && <Caption2 color="textMuted">{l.rawWeightHint}</Caption2>}
          </SLine>

          {overriddenFields.length > 0 && (
            <SLine>
              <Caption2 color="textMuted">
                {`* ${l.overrideNote} ${overriddenFields.map((field) => l.nutrients[field]).join(", ")}`}
              </Caption2>
              <Button
                variant="primaryOutline"
                type="button"
                isInline
                disabled={isPending}
                onClick={() => mutate(recipeId)}
              >
                {isPending ? l.recalculating : l.recalculate}
              </Button>
            </SLine>
          )}

          <SLine>
            <Caption1 color="textMuted">{l.perServing}</Caption1>
            <NutrientsRow
              kcal={perServing.kcal}
              protein={perServing.protein}
              fat={perServing.fat}
              carbs={perServing.carbs}
            />
          </SLine>

          <SLine>
            <Caption1 color="textMuted">{l.total}</Caption1>
            <NutrientsRow
              kcal={total.kcal}
              protein={total.protein}
              fat={total.fat}
              carbs={total.carbs}
            />
          </SLine>
        </>
      )}
    </SWrapper>
  );
}
