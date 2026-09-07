/** Ккал и БЖУ. На что именно они посчитаны — на 100 г, на порцию, на всё блюдо — задаёт контекст. */
export interface INutrients {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

// ── Входные контракты ───────────────────────────────────────────────
// Минимальные формы входа объявлены здесь, а не импортированы из `src/types/`.
// Причина — независимость расчёта от слоя данных: модуль обязан запускаться в
// Node, а появление нового поля у сущности не должно трогать домен. Имена полей
// совпадают с сущностями, поэтому сущность подставляется на место такой формы
// структурно, без адаптера.

/** Продукт в том объёме, который нужен расчёту. */
export interface INutritionProduct {
  id: string;
  name: string;
  activeVariantId: string | null;
}

/**
 * Вариант продукта.
 *
 * Любое из четырёх полей КБЖУ может быть `null`: продукт заводится быстро, цифры
 * заполняются позже. Принадлежность варианта продукту здесь не проверяется — её
 * гарантируют составные внешние ключи схемы.
 */
export interface INutritionVariant {
  id: string;
  name: string | null;
  kcal100: number | null;
  protein100: number | null;
  fat100: number | null;
  carbs100: number | null;
}

/** Строка состава рецепта до разрешения варианта. */
export interface INutritionIngredient {
  id: string;
  productId: string;
  pinnedVariantId: string | null;
  amountGrams: number;
  isOptional: boolean;
}

// ── Результаты ──────────────────────────────────────────────────────

/** Ингредиент с уже разрешённым вариантом и его КБЖУ. */
export interface IResolvedIngredient {
  ingredientId: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  amountGrams: number;
  isOptional: boolean;
  isPinned: boolean;
  /** null, если у варианта не заполнено КБЖУ или активного варианта нет */
  nutrientsPer100: INutrients | null;
}

/** Какой вес взят делителем для «на 100 г»: заявленный выход блюда или вес сырья. */
export type TNutritionBasis = "yield" | "rawWeight";

export interface INutritionParams {
  servingsBase: number;
  yieldGrams: number | null;
  overrides: Partial<INutrients>;
}

export interface IRecipeNutrition {
  total: INutrients;
  per100g: INutrients;
  perServing: INutrients;
  basis: TNutritionBasis;
  rawWeightGrams: number;
  yieldGrams: number | null;
  /** Поля, значение которых взято из *_override, а не посчитано */
  overriddenFields: (keyof INutrients)[];
  /** Продукты без КБЖУ — источник предупреждения в карточке рецепта */
  incompleteProducts: { productId: string; productName: string }[];
}

/** Замораживается в cook_logs.snapshot */
export interface INutritionSnapshot {
  version: 1;
  nutrition: IRecipeNutrition;
  servingsBase: number;
  ingredients: Pick<
    IResolvedIngredient,
    "productId" | "productName" | "variantId" | "variantName" | "amountGrams" | "isOptional"
  >[];
}
