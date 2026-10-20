import { useMemo } from "react";

import { useI18nSelector } from "@/context/I18nContext";
import { buildSnapshot, calculateNutrition, resolveIngredients } from "@/domain/nutrition";
import {
  useCookLogs,
  useDishCategories,
  useProducts,
  useProductsById,
  useRecipes,
} from "@/hooks/useAppData.hook";
import { getNutritionOverrides } from "@/utils/helpers/recipes";

/**
 * Данные карточки рецепта: сам рецепт, его КБЖУ и снимок для записи в журнал,
 * разрешённые варианты ингредиентов, строка с категориями, временем и порциями, записи журнала.
 *
 * Возвращает `null`, если рецепта с таким id нет. Расчёт целиком в доменном
 * модуле; здесь только подготовка входа.
 */
export function useRecipeCard(recipeId: string) {
  const l = useI18nSelector(({ l }) => l.recipeCard);
  const recipes = useRecipes();
  const products = useProducts();
  const productsById = useProductsById();
  const dishCategories = useDishCategories();
  const cookLogs = useCookLogs();

  const recipe = useMemo(
    () => recipes.find(({ id }) => id === recipeId) ?? null,
    [recipes, recipeId],
  );

  const calculation = useMemo(() => {
    if (recipe === null) return null;

    const variants = products.flatMap((product) => product.variants);
    const resolved = resolveIngredients(recipe.ingredients, products, variants);

    const nutrition = calculateNutrition(resolved, {
      servingsBase: recipe.servingsBase,
      yieldGrams: recipe.yieldGrams,
      overrides: getNutritionOverrides(recipe),
    });

    return {
      resolved,
      nutrition,
      snapshot: buildSnapshot(nutrition, resolved, recipe.servingsBase),
    };
  }, [recipe, products]);

  const categoryNames = useMemo(() => {
    if (recipe === null) return [];

    return dishCategories
      .filter(({ id }) => recipe.dishCategoryIds.includes(id))
      .sort((first, second) => first.sortOrder - second.sortOrder)
      .map(({ name }) => name);
  }, [recipe, dishCategories]);

  const metaParts = useMemo(() => {
    if (recipe === null) return [];

    return [
      ...categoryNames,
      ...(recipe.cookTimeMin === null ? [] : [`${recipe.cookTimeMin} ${l.minutesUnit}`]),
      `${l.servingsLabel}: ${recipe.servingsBase}`,
    ];
  }, [recipe, categoryNames, l.minutesUnit, l.servingsLabel]);

  const recipeCookLogs = useMemo(
    () => cookLogs.filter((log) => log.recipeId === recipeId),
    [cookLogs, recipeId],
  );

  if (recipe === null || calculation === null) return null;

  return {
    recipe,
    nutrition: calculation.nutrition,
    resolved: calculation.resolved,
    snapshot: calculation.snapshot,
    productsById,
    metaParts,
    cookLogs: recipeCookLogs,
  };
}
