/** Kcal and protein/fat/carbs. What they are calculated for — per 100 g, per serving, per whole dish — is set by the context. */
export interface INutrients {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

// ── Input contracts ───────────────────────────────────────────────
// The minimal input shapes are declared here rather than imported from `src/types/`.
// The reason is keeping the calculation independent of the data layer: the module must run in
// Node, and a new field on an entity must not touch the domain. Field names
// match the entities, so an entity is substituted for such a shape
// structurally, without an adapter.

/** A product, with only what the calculation needs. */
export interface INutritionProduct {
  id: string;
  name: string;
  activeVariantId: string | null;
}

/**
 * A product variant.
 *
 * Any of the four nutrition fields may be `null`: a product is added in a hurry, the numbers
 * are filled in later. Whether the variant belongs to the product is not checked here — it is
 * guaranteed by the composite foreign keys of the schema.
 */
export interface INutritionVariant {
  id: string;
  name: string | null;
  kcal100: number | null;
  protein100: number | null;
  fat100: number | null;
  carbs100: number | null;
}

/** A recipe ingredient row before the variant is resolved. */
export interface INutritionIngredient {
  id: string;
  productId: string;
  pinnedVariantId: string | null;
  amountGrams: number;
  isOptional: boolean;
}

// ── Results ──────────────────────────────────────────────────────

/** An ingredient with an already resolved variant and its nutrition. */
export interface IResolvedIngredient {
  ingredientId: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  amountGrams: number;
  isOptional: boolean;
  isPinned: boolean;
  /** null if the variant's nutrition is not filled in or there is no active variant */
  nutrientsPer100: INutrients | null;
}

/** Which weight is taken as the divisor for “per 100 g”: the declared dish yield or the raw weight. */
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
  /** Fields whose value is taken from *_override rather than calculated */
  overriddenFields: (keyof INutrients)[];
  /** Products without nutrition — the source of the warning on the recipe card */
  incompleteProducts: { productId: string; productName: string }[];
}

/** Frozen into cook_logs.snapshot */
export interface INutritionSnapshot {
  version: 1;
  nutrition: IRecipeNutrition;
  servingsBase: number;
  ingredients: Pick<
    IResolvedIngredient,
    "productId" | "productName" | "variantId" | "variantName" | "amountGrams" | "isOptional"
  >[];
}
