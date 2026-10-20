import type { IRecipe } from "@/types/recipes.types";

/** Рецепт в виде, готовом для списка: посчитанное КБЖУ и тексты для поиска. */
export interface IRecipeListItem {
  recipe: IRecipe;
  /** Нормализованные название рецепта и названия продуктов состава. */
  searchTexts: string[];
  /** Ккал на 100 г; `null`, если считать не из чего. */
  kcal100: number | null;
  /** Есть продукты без КБЖУ — цифра занижена, и карточка обязана это показать. */
  isNutritionIncomplete: boolean;
}

/** Категория со своими рецептами; `name === null` — группа «Без категории». */
export interface IRecipeGroup {
  id: string;
  name: string | null;
  items: IRecipeListItem[];
}
