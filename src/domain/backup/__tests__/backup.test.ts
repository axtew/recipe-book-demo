import { describe, expect, it } from "vitest";

import { BACKUP_VERSION, parseBackup } from "..";

const ID = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const TS = "2026-10-20T10:00:00.123456+00:00";

const nutrients = { kcal: 100, protein: 1, fat: 2, carbs: 3 };

function buildBackup() {
  return {
    version: BACKUP_VERSION,
    exported_at: TS,
    product_categories: [{ id: ID(1), name: "Молочное", sort_order: 10, created_at: TS }],
    dish_categories: [{ id: ID(2), name: "Завтраки", sort_order: 10, created_at: TS }],
    products: [
      {
        id: ID(3),
        name: "Молоко",
        category_id: ID(1),
        active_variant_id: ID(4) as string | null,
        note: null,
        archived_at: null,
        created_at: TS,
        updated_at: TS,
      },
    ],
    product_variants: [
      {
        id: ID(4),
        product_id: ID(3),
        name: null,
        kcal_100: 60,
        protein_100: 2.9,
        fat_100: 3.2,
        carbs_100: 4.7,
        is_approximate: false,
        source: "manual",
        note: null,
        archived_at: null,
        created_at: TS,
        updated_at: TS,
      },
    ],
    recipes: [
      {
        id: ID(5),
        name: "Каша",
        servings_base: 2,
        yield_grams: null,
        cook_time_min: 15,
        photo_path: `${ID(5)}/cover.webp`,
        notes: null,
        video_urls: [],
        freezable: false,
        freezer_days: null,
        fridge_days: null,
        kcal_100_override: null,
        protein_100_override: null,
        fat_100_override: null,
        carbs_100_override: null,
        archived_at: TS,
        created_at: TS,
        updated_at: TS,
      },
    ],
    recipe_steps: [{ id: ID(6), recipe_id: ID(5), sort_order: 0, text: "Сварить" }],
    recipe_dish_categories: [{ recipe_id: ID(5), dish_category_id: ID(2) }],
    recipe_ingredients: [
      {
        id: ID(7),
        recipe_id: ID(5),
        product_id: ID(3),
        pinned_variant_id: ID(4),
        amount_grams: 200,
        is_optional: false,
        note: null,
        sort_order: 0,
      },
    ],
    cook_logs: [
      {
        id: ID(8),
        recipe_id: ID(5),
        cooked_at: "2026-10-20",
        multiplier: 1,
        actual_yield_grams: null,
        containers: null,
        finished_at: null,
        rating: null,
        note: null,
        snapshot: {
          version: 1,
          nutrition: {
            total: nutrients,
            per100g: nutrients,
            perServing: nutrients,
            basis: "rawWeight",
            rawWeightGrams: 200,
            yieldGrams: null,
            overriddenFields: [],
            incompleteProducts: [],
          },
          servingsBase: 2,
          ingredients: [],
        },
        created_at: TS,
      },
    ],
  };
}

describe("parseBackup", () => {
  it("принимает корректный файл, архивные строки в том числе", () => {
    expect(parseBackup(JSON.stringify(buildBackup())).status).toBe("ok");
  });

  it("принимает пустую базу: девять пустых таблиц", () => {
    const empty = {
      ...buildBackup(),
      product_categories: [],
      dish_categories: [],
      products: [],
      product_variants: [],
      recipes: [],
      recipe_steps: [],
      recipe_dish_categories: [],
      recipe_ingredients: [],
      cook_logs: [],
    };

    expect(parseBackup(JSON.stringify(empty)).status).toBe("ok");
  });

  it("отвергает текст, который не JSON", () => {
    expect(parseBackup("{оборванный").status).toBe("notJson");
  });

  it("отвергает JSON без поля version", () => {
    expect(parseBackup("[]").status).toBe("notBackup");
    expect(parseBackup('{"products": []}').status).toBe("notBackup");
  });

  it("отвергает неизвестную версию формата", () => {
    const result = parseBackup(JSON.stringify({ ...buildBackup(), version: 99 }));

    expect(result).toEqual({ status: "unsupportedVersion", version: "99" });
  });

  it("называет место первой проблемы", () => {
    const backup = buildBackup();
    Object.assign(backup.products[0], { name: 5 });

    expect(parseBackup(JSON.stringify(backup))).toEqual({
      status: "invalid",
      path: "products[0].name",
    });
  });

  it("отвергает отсутствующую таблицу", () => {
    const backup: Partial<ReturnType<typeof buildBackup>> = buildBackup();
    delete backup.cook_logs;

    expect(parseBackup(JSON.stringify(backup)).status).toBe("invalid");
  });

  it("отвергает колонку, которой схема не знает", () => {
    const backup = buildBackup();
    Object.assign(backup.recipes[0], { surprise: 1 });

    expect(parseBackup(JSON.stringify(backup)).status).toBe("invalid");
  });

  it("отвергает снимок журнала, не прошедший свою схему", () => {
    const backup = buildBackup();
    Object.assign(backup.cook_logs[0].snapshot, { version: 2 });

    expect(parseBackup(JSON.stringify(backup))).toEqual({
      status: "invalid",
      path: "cook_logs[0].snapshot.version",
    });
  });

  it("не теряет неизвестные ключи внутри снимка журнала", () => {
    const backup = buildBackup();
    Object.assign(backup.cook_logs[0].snapshot, { extra: "kept" });

    const result = parseBackup(JSON.stringify(backup));

    expect(result.status).toBe("ok");
    expect(result.status === "ok" && result.backup.cook_logs[0].snapshot).toHaveProperty(
      "extra",
      "kept",
    );
  });

  it("отвергает висящую ссылку на рецепт", () => {
    const backup = buildBackup();
    backup.recipe_steps[0].recipe_id = ID(99);

    expect(parseBackup(JSON.stringify(backup))).toEqual({
      status: "invalid",
      path: "recipe_steps[0].recipe_id",
    });
  });

  it("отвергает закреплённый вариант чужого продукта", () => {
    const backup = buildBackup();
    backup.products.push({ ...backup.products[0], id: ID(30), active_variant_id: null });
    backup.recipe_ingredients[0].product_id = ID(30);

    expect(parseBackup(JSON.stringify(backup))).toEqual({
      status: "invalid",
      path: "recipe_ingredients[0].pinned_variant_id",
    });
  });

  it("отвергает активный вариант, принадлежащий другому продукту", () => {
    const backup = buildBackup();
    backup.products.push({ ...backup.products[0], id: ID(31) });

    expect(parseBackup(JSON.stringify(backup))).toEqual({
      status: "invalid",
      path: "products[1].active_variant_id",
    });
  });

  it("отвергает дубль id внутри таблицы", () => {
    const backup = buildBackup();
    backup.recipes.push({ ...backup.recipes[0] });

    expect(parseBackup(JSON.stringify(backup))).toEqual({
      status: "invalid",
      path: "recipes[1].id",
    });
  });
});
