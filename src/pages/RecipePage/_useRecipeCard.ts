import { useMemo } from "react";

import { useI18nSelector } from "@/context/I18nContext";
import { calculateNutrition, resolveIngredients } from "@/domain/nutrition";
import {
  useCookLogs,
  useDishCategories,
  useProducts,
  useProductsById,
  useRecipes,
} from "@/hooks/useAppData.hook";

import { getNutritionOverrides } from "./_helpers";

/**
 * Данные карточки рецепта: сам рецепт, его КБЖУ, разрешённые варианты
 * ингредиентов, строка с категориями, временем и порциями, записи журнала.
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

    return {
      resolved,
      nutrition: calculateNutrition(resolved, {
        servingsBase: recipe.servingsBase,
        yieldGrams: recipe.yieldGrams,
        overrides: getNutritionOverrides(recipe),
      }),
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
    productsById,
    metaParts,
    cookLogs: recipeCookLogs,
  };
}
