import type { IProduct, IProductCategory } from "@/types/products.types";

/** A category with its products — a unit of the list on the screen. */
interface IProductGroup {
  categoryId: string;
  categoryName: string;
  products: IProduct[];
}

/**
 * Laying products out by category in `sortOrder` order.
 *
 * Empty categories do not make it into the list: the directory is filled gradually, and a dozen
 * empty headings at the top would hide the little that has already been added.
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
