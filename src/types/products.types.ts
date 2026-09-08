export interface IProductCategory {
  id: string;
  name: string;
  sortOrder: number;
}

interface IProductVariant {
  archivedAt: string | null;
  carbs100: number | null;
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
