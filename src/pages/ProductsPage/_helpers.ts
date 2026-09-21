import type { IProduct, IProductCategory } from "@/types/products.types";

/** Категория со своими продуктами — единица списка на экране. */
interface IProductGroup {
  categoryId: string;
  categoryName: string;
  products: IProduct[];
}

/**
 * Раскладка продуктов по категориям в порядке `sortOrder`.
 *
 * Пустые категории в список не попадают: справочник заполняется постепенно, и
 * десяток пустых заголовков сверху прятал бы то немногое, что уже заведено.
 */
export function groupProducts(
  products: IProduct[],
  categories: IProductCategory[],
): IProductGroup[] {
  const productsByCategory = new Map<string, IProduct[]>();

  products.forEach((product) => {
    const group = productsByCategory.get(product.categoryId);

    if (group === undefined) {
      productsByCategory.set(product.categoryId, [product]);
      return;
    }

    group.push(product);
  });

  return [...categories]
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      products: productsByCategory.get(category.id) ?? [],
    }))
    .filter((group) => group.products.length > 0);
}
