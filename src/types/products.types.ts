export interface IProductCategory {
  id: string;
  name: string;
  sortOrder: number;
}

interface IProductVariant {
  archivedAt: string | null;
  carbs100: number | null;
  createdAt: string;
  fat100: number | null;
  id: string;
  isApproximate: boolean;
  kcal100: number | null;
  name: string | null;
  note: string | null;
  productId: string;
  protein100: number | null;
  source: string;
}

export interface IProduct {
  activeVariantId: string | null;
  archivedAt: string | null;
  categoryId: string;
  id: string;
  name: string;
  note: string | null;
  variants: IProductVariant[];
}

export interface IProductInput {
  name: string;
  categoryId: string;
  note: string | null;
}

export interface IProductVariantInput {
  name: string | null;
  kcal100: number | null;
  protein100: number | null;
  fat100: number | null;
  carbs100: number | null;
  isApproximate: boolean;
  note: string | null;
}
