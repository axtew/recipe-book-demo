import { NutrientsRow } from "@/components/NutrientsRow";
import { Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipeNutrition } from "@/domain/nutrition";

import { SBar, SLine } from "./_styles";

interface IProps {
  nutrition: IRecipeNutrition;
  hasCountedIngredients: boolean;
  isServingsValid: boolean;
}

/**
 * Липкая плашка КБЖУ над таб-баром: на 100 г и на порцию, пересчитывается по
 * мере ввода. Продукты без КБЖУ названы под цифрами — ноль на их месте был бы
 * неотличим от настоящего.
 */
export function NutritionBar({ nutrition, hasCountedIngredients, isServingsValid }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.nutritionBar);

  if (!hasCountedIngredients) {
    return (
      <SBar>
        <Caption2 color="textMuted">{l.empty}</Caption2>
      </SBar>
    );
  }

  const { per100g, perServing, incompleteProducts } = nutrition;

  return (
    <SBar>
      <SLine>
        <Caption2 color="textMuted">{l.per100g}</Caption2>
        <NutrientsRow
          kcal={per100g.kcal}
          protein={per100g.protein}
          fat={per100g.fat}
          carbs={per100g.carbs}
        />
      </SLine>
      <SLine>
        <Caption2 color="textMuted">{l.perServing}</Caption2>
        {isServingsValid ? (
          <NutrientsRow
            kcal={perServing.kcal}
            protein={perServing.protein}
            fat={perServing.fat}
            carbs={perServing.carbs}
          />
        ) : (
          <Caption2 color="textMuted">{l.servingsMissing}</Caption2>
        )}
      </SLine>
      {incompleteProducts.length > 0 && (
        <Caption2 color="danger">
          {l.incompleteProducts}:{" "}
          {incompleteProducts.map(({ productName }) => productName).join(", ")}
        </Caption2>
      )}
    </SBar>
  );
}
