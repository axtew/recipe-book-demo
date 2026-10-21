import type { TBackup } from "@/domain/backup";

/** Ккал, белки, жиры, углеводы на 100 г. */
type TPer100 = [kcal: number, protein: number, fat: number, carbs: number];

type TVariantSource = TBackup["product_variants"][number]["source"];

interface IDemoVariant {
  /** Название варианта (марка, жирность). У продукта с единственным вариантом не задаётся. */
  name?: string;
  /** `null` — КБЖУ не заполнено: рецепт с таким продуктом покажет предупреждение о неполном расчёте. */
  per100: TPer100 | null;
  /** Помечается как «усреднённое». */
  approximate?: true;
  /** По умолчанию `seed` — цифры из общих таблиц питательности. */
  source?: TVariantSource;
  note?: string;
}

interface IDemoProduct {
  name: string;
  note?: string;
  /** Архивный продукт: в списках скрыт, но остаётся в старых рецептах. */
  archived?: true;
  /** Первый вариант становится активным. */
  variants: IDemoVariant[];
}

export interface IDemoProductCategory {
  name: string;
  products: IDemoProduct[];
}

interface IDemoIngredient {
  /** Название продукта из `products.ts`. */
  product: string;
  /** Название варианта этого продукта, если он закреплён за ингредиентом. */
  variant?: string;
  grams: number;
  optional?: true;
  note?: string;
}

export interface IDemoRecipe {
  name: string;
  /** Названия категорий блюд; пусто — рецепт без категории. */
  categories: string[];
  /** Дата добавления, `YYYY-MM-DD`. */
  addedAt: string;
  servings: number;
  /** Вес готового блюда; без него КБЖУ на 100 г считается по весу сырья. */
  yieldGrams?: number;
  cookTimeMin: number;
  fridgeDays?: number;
  /** Заданное число суток — рецепт помечается как замораживаемый. */
  freezerDays?: number;
  notes?: string;
  /**
   * Имя файла из `supabase/demo/photos/` (например, `syrniki.webp`).
   * Без него у рецепта нет фото.
   */
  photo?: string;
  /** Ссылки на ролики; рецепт по видео пересказывается своими словами. */
  videoUrls?: string[];
  ingredients: IDemoIngredient[];
  steps: string[];
}

export interface IDemoCookLog {
  /** Название рецепта из `recipes.ts`. */
  recipe: string;
  /** Дата готовки, `YYYY-MM-DD`. */
  cookedAt: string;
  /** Во сколько раз порция больше базовой; по умолчанию 1. */
  multiplier?: number;
  yieldGrams?: number;
  containers?: number;
  /** Дата, когда «доели», `YYYY-MM-DD`. */
  finishedAt?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}
