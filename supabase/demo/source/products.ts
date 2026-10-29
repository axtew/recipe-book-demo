import type { IDemoProductCategory } from "./_types";

// Values per 100 g follow well-known nutrition tables (Skurikhin, USDA);
// grains and pasta are given for the dry product, meat and fish for the raw one.
// A product with a single variant has no variant name.

export const PRODUCT_CATEGORIES: IDemoProductCategory[] = [
  {
    name: "Dairy and eggs",
    products: [
      {
        name: "Milk",
        variants: [
          { name: "Meadow 3.2%", per100: [60, 2.9, 3.2, 4.7], source: "label" },
          { name: "Meadow 2.5%", per100: [52, 2.8, 2.5, 4.8], source: "label" },
          { name: "Bright Day 3.5%", per100: [64, 3, 3.5, 4.7], source: "label" },
        ],
      },
      {
        name: "Cottage cheese",
        variants: [
          { name: "Quiet Creek 5%", per100: [121, 17.2, 5, 1.8], source: "label" },
          { name: "Quiet Creek 9%", per100: [159, 16.7, 9, 2], source: "label" },
          { name: "Fat-free", per100: [88, 18, 0.6, 1.8] },
        ],
      },
      { name: "Kefir 1%", variants: [{ per100: [40, 3, 1, 4] }] },
      { name: "Plain yogurt 1.5%", variants: [{ per100: [51, 5, 1.5, 3.5] }] },
      { name: "Cream 10%", variants: [{ per100: [118, 3, 10, 4] }] },
      { name: "Sour cream 20%", variants: [{ per100: [206, 2.8, 20, 3.2], source: "label" }] },
      {
        name: "Sour cream 15%",
        note: "Replaced by sour cream 20%, kept in old recipes",
        archived: true,
        variants: [{ per100: [158, 2.6, 15, 3], source: "label" }],
      },
      { name: "Butter 82.5%", variants: [{ per100: [748, 0.5, 82.5, 0.8] }] },
      {
        name: "Chicken egg",
        note: "Weight without the shell, one egg is about 55 g",
        variants: [{ per100: [157, 12.7, 11.5, 0.7] }],
      },
      {
        name: "Hard cheese",
        variants: [
          { name: "Gouda", per100: [363, 23.4, 29.5, 0] },
          { name: "Parmesan", per100: [392, 33, 28, 0], source: "label" },
        ],
      },
      { name: "Feta", variants: [{ per100: [264, 14.2, 21.3, 4.1] }] },
    ],
  },
  {
    name: "Meat and fish",
    products: [
      { name: "Chicken breast fillet", variants: [{ per100: [113, 23.6, 1.9, 0.4] }] },
      { name: "Skinless chicken thighs", variants: [{ per100: [121, 19.7, 4.1, 0] }] },
      {
        name: "Ground beef",
        variants: [
          {
            name: "Regular",
            per100: [254, 17.2, 20, 0],
            approximate: true,
            note: "Average across store packs",
          },
          { name: "Lean", per100: [176, 20, 10, 0], source: "label" },
        ],
      },
      {
        name: "Homemade ground meat",
        note: "Half pork, half beef",
        variants: [{ per100: [263, 16.7, 21.2, 0] }],
      },
      { name: "Beef shoulder", variants: [{ per100: [187, 18.9, 12.4, 0] }] },
      { name: "Salmon", variants: [{ per100: [208, 20, 13.6, 0] }] },
    ],
  },
  {
    name: "Vegetables, fruit and herbs",
    products: [
      { name: "Potatoes", variants: [{ per100: [77, 2, 0.4, 16.3] }] },
      { name: "Carrots", variants: [{ per100: [32, 1.3, 0.1, 6.9] }] },
      { name: "Onion", variants: [{ per100: [41, 1.4, 0, 10.4] }] },
      { name: "Garlic", variants: [{ per100: [143, 6.5, 0.5, 29.9] }] },
      { name: "White cabbage", variants: [{ per100: [28, 1.8, 0.1, 4.7] }] },
      { name: "Beetroot", variants: [{ per100: [43, 1.5, 0.1, 8.8] }] },
      { name: "Tomatoes", variants: [{ per100: [20, 1.1, 0.2, 3.7] }] },
      { name: "Cucumbers", variants: [{ per100: [15, 0.8, 0.1, 2.8] }] },
      { name: "Bell pepper", variants: [{ per100: [27, 1.3, 0, 5.3] }] },
      { name: "Broccoli", variants: [{ per100: [34, 2.8, 0.4, 6.6] }] },
      { name: "Pumpkin", variants: [{ per100: [22, 1, 0.1, 4.4] }] },
      { name: "Zucchini", variants: [{ per100: [24, 0.6, 0.3, 4.6] }] },
      { name: "Button mushrooms", variants: [{ per100: [27, 4.3, 1, 0.1] }] },
      { name: "Banana", note: "Peeled weight", variants: [{ per100: [96, 1.5, 0.5, 21] }] },
      { name: "Apples", variants: [{ per100: [47, 0.4, 0.4, 9.8] }] },
      { name: "Lemon", variants: [{ per100: [16, 0.9, 0.1, 3] }] },
      { name: "Dill", variants: [{ per100: [40, 2.5, 0.5, 6.3] }] },
      { name: "Parsley", variants: [{ per100: [49, 3.7, 0.4, 7.6] }] },
    ],
  },
  {
    name: "Grains, flour and pasta",
    products: [
      {
        name: "Rice",
        note: "Nutrition for the dry product",
        variants: [{ per100: [344, 6.7, 0.7, 78.9] }],
      },
      {
        name: "Buckwheat",
        note: "Nutrition for the dry product",
        variants: [{ per100: [313, 12.6, 3.3, 62.1] }],
      },
      { name: "Rolled oats", variants: [{ per100: [352, 12.3, 6.2, 61.8] }] },
      { name: "Semolina", variants: [{ per100: [328, 10.3, 1, 70.6] }] },
      {
        name: "Pasta",
        note: "Nutrition for the dry product",
        variants: [
          { name: "Spaghetti", per100: [337, 10.4, 1.1, 69.7], source: "label" },
          { name: "Thin vermicelli", per100: [336, 10.4, 1.1, 69.7], source: "label" },
        ],
      },
      { name: "Wheat flour", variants: [{ per100: [334, 10.3, 1.1, 68.9] }] },
      {
        name: "Sugar",
        variants: [
          { name: "White", per100: [399, 0, 0, 99.8] },
          { name: "Cane", per100: [380, 0.1, 0, 98.1] },
        ],
      },
      { name: "Breadcrumbs", variants: [{ per100: [347, 9.7, 1.2, 72.2] }] },
      { name: "Cooked chickpeas", variants: [{ per100: [164, 8.9, 2.6, 27.4] }] },
    ],
  },
  {
    name: "Pantry, oils and spices",
    products: [
      {
        name: "Vegetable oil",
        variants: [
          { name: "Sunflower", per100: [899, 0, 99.9, 0], source: "label" },
          { name: "Olive", per100: [898, 0, 99.8, 0], source: "label" },
          { name: "Corn", per100: [899, 0, 99.9, 0], source: "label" },
        ],
      },
      { name: "Tomato paste", variants: [{ per100: [92, 5, 0.5, 19] }] },
      { name: "Canned tomatoes", variants: [{ per100: [20, 1.1, 0.2, 3.7] }] },
      { name: "Canned kidney beans", variants: [{ per100: [95, 6.5, 0.3, 17] }] },
      { name: "Olives", variants: [{ per100: [175, 2.2, 15.1, 5.1] }] },
      { name: "Tahini", variants: [{ per100: [595, 17, 53.8, 21.2] }] },
      { name: "Honey", variants: [{ per100: [329, 0.8, 0, 81.5] }] },
      { name: "Walnuts", variants: [{ per100: [656, 16.2, 60.8, 11.1] }] },
      { name: "Almonds", variants: [{ per100: [645, 18.6, 57.7, 16.2] }] },
      { name: "Raisins", variants: [{ per100: [264, 2.9, 0.6, 66] }] },
      { name: "Salt", variants: [{ per100: [0, 0, 0, 0] }] },
      {
        name: "Water",
        note: "For recipes where water counts toward the weight of the dough",
        variants: [{ per100: [0, 0, 0, 0] }],
      },
      { name: "Vanilla sugar", variants: [{ per100: [379, 0, 0, 94.5] }] },
      { name: "Baking powder", variants: [{ per100: [53, 0, 0, 27.7] }] },
      { name: "Ground black pepper", variants: [{ per100: [251, 10.4, 3.3, 64] }] },
      { name: "Ground paprika", variants: [{ per100: [282, 14.1, 12.9, 54] }] },
      { name: "Ground cumin", variants: [{ per100: [375, 17.8, 22.3, 44.2] }] },
      { name: "Bay leaf", variants: [{ per100: [313, 7.6, 8.4, 75] }] },
      { name: "Ground cinnamon", variants: [{ per100: [247, 4, 1.2, 80.6] }] },
      { name: "Dried oregano", variants: [{ per100: [265, 9, 4.3, 69] }] },
      {
        name: "Homemade adjika",
        note: "Recipe from the neighbours, composition unknown — nutrition not filled in",
        variants: [{ per100: null, source: "manual" }],
      },
    ],
  },
];
