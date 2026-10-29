-- Loading the seed into the demo project. The file is built by the generator from `seed.json` and is not edited by hand.
-- Order of application — `supabase/demo/DEPLOY.md`; rebuild — `README.md` alongside.
insert into demo.seed (id, data)
values (1, $seed${
  "version": 1,
  "exported_at": "2026-10-21T08:00:00.000000+00:00",
  "product_categories": [
    {
      "id": "de000001-0000-4000-8000-000000000001",
      "name": "Dairy and eggs",
      "sort_order": 10,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000001-0000-4000-8000-000000000002",
      "name": "Meat and fish",
      "sort_order": 20,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000001-0000-4000-8000-000000000003",
      "name": "Vegetables, fruit and herbs",
      "sort_order": 30,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000001-0000-4000-8000-000000000004",
      "name": "Grains, flour and pasta",
      "sort_order": 40,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000001-0000-4000-8000-000000000005",
      "name": "Pantry, oils and spices",
      "sort_order": 50,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    }
  ],
  "dish_categories": [
    {
      "id": "de000002-0000-4000-8000-000000000001",
      "name": "Breakfasts",
      "sort_order": 10,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000002-0000-4000-8000-000000000002",
      "name": "Lunches",
      "sort_order": 20,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000002-0000-4000-8000-000000000003",
      "name": "Dinners",
      "sort_order": 30,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000002-0000-4000-8000-000000000004",
      "name": "Soups",
      "sort_order": 40,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000002-0000-4000-8000-000000000005",
      "name": "Baking",
      "sort_order": 50,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000002-0000-4000-8000-000000000006",
      "name": "Desserts",
      "sort_order": 60,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000002-0000-4000-8000-000000000007",
      "name": "Batch cooking",
      "sort_order": 70,
      "created_at": "2026-07-18T08:00:00.000000+00:00"
    }
  ],
  "products": [
    {
      "id": "de000003-0000-4000-8000-000000000001",
      "name": "Milk",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-000000000001",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000002",
      "name": "Cottage cheese",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-000000000004",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000003",
      "name": "Kefir 1%",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-000000000007",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000004",
      "name": "Plain yogurt 1.5%",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-000000000008",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000005",
      "name": "Cream 10%",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-000000000009",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000006",
      "name": "Sour cream 20%",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-00000000000a",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000007",
      "name": "Sour cream 15%",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-00000000000b",
      "note": "Replaced by sour cream 20%, kept in old recipes",
      "archived_at": "2026-09-02T10:00:00.000000+00:00",
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000008",
      "name": "Butter 82.5%",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-00000000000c",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000009",
      "name": "Chicken egg",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-00000000000d",
      "note": "Weight without the shell, one egg is about 55 g",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000000a",
      "name": "Hard cheese",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-00000000000e",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000000b",
      "name": "Feta",
      "category_id": "de000001-0000-4000-8000-000000000001",
      "active_variant_id": "de000004-0000-4000-8000-000000000010",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000000c",
      "name": "Chicken breast fillet",
      "category_id": "de000001-0000-4000-8000-000000000002",
      "active_variant_id": "de000004-0000-4000-8000-000000000011",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000000d",
      "name": "Skinless chicken thighs",
      "category_id": "de000001-0000-4000-8000-000000000002",
      "active_variant_id": "de000004-0000-4000-8000-000000000012",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000000e",
      "name": "Ground beef",
      "category_id": "de000001-0000-4000-8000-000000000002",
      "active_variant_id": "de000004-0000-4000-8000-000000000013",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000000f",
      "name": "Homemade ground meat",
      "category_id": "de000001-0000-4000-8000-000000000002",
      "active_variant_id": "de000004-0000-4000-8000-000000000015",
      "note": "Half pork, half beef",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000010",
      "name": "Beef shoulder",
      "category_id": "de000001-0000-4000-8000-000000000002",
      "active_variant_id": "de000004-0000-4000-8000-000000000016",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000011",
      "name": "Salmon",
      "category_id": "de000001-0000-4000-8000-000000000002",
      "active_variant_id": "de000004-0000-4000-8000-000000000017",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000012",
      "name": "Potatoes",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000018",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000013",
      "name": "Carrots",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000019",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000014",
      "name": "Onion",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-00000000001a",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000015",
      "name": "Garlic",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-00000000001b",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000016",
      "name": "White cabbage",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-00000000001c",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000017",
      "name": "Beetroot",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-00000000001d",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000018",
      "name": "Tomatoes",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-00000000001e",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000019",
      "name": "Cucumbers",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-00000000001f",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000001a",
      "name": "Bell pepper",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000020",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000001b",
      "name": "Broccoli",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000021",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000001c",
      "name": "Pumpkin",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000022",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000001d",
      "name": "Zucchini",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000023",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000001e",
      "name": "Button mushrooms",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000024",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000001f",
      "name": "Banana",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000025",
      "note": "Peeled weight",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000020",
      "name": "Apples",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000026",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000021",
      "name": "Lemon",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000027",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000022",
      "name": "Dill",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000028",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000023",
      "name": "Parsley",
      "category_id": "de000001-0000-4000-8000-000000000003",
      "active_variant_id": "de000004-0000-4000-8000-000000000029",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000024",
      "name": "Rice",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-00000000002a",
      "note": "Nutrition for the dry product",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000025",
      "name": "Buckwheat",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-00000000002b",
      "note": "Nutrition for the dry product",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000026",
      "name": "Rolled oats",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-00000000002c",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000027",
      "name": "Semolina",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-00000000002d",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000028",
      "name": "Pasta",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-00000000002e",
      "note": "Nutrition for the dry product",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000029",
      "name": "Wheat flour",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-000000000030",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000002a",
      "name": "Sugar",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-000000000031",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000002b",
      "name": "Breadcrumbs",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-000000000033",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000002c",
      "name": "Cooked chickpeas",
      "category_id": "de000001-0000-4000-8000-000000000004",
      "active_variant_id": "de000004-0000-4000-8000-000000000034",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000002d",
      "name": "Vegetable oil",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000035",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000002e",
      "name": "Tomato paste",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000038",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000002f",
      "name": "Canned tomatoes",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000039",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000030",
      "name": "Canned kidney beans",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000003a",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000031",
      "name": "Olives",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000003b",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000032",
      "name": "Tahini",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000003c",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000033",
      "name": "Honey",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000003d",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000034",
      "name": "Walnuts",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000003e",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000035",
      "name": "Almonds",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000003f",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000036",
      "name": "Raisins",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000040",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000037",
      "name": "Salt",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000041",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000038",
      "name": "Water",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000042",
      "note": "For recipes where water counts toward the weight of the dough",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000039",
      "name": "Vanilla sugar",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000043",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000003a",
      "name": "Baking powder",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000044",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000003b",
      "name": "Ground black pepper",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000045",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000003c",
      "name": "Ground paprika",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000046",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000003d",
      "name": "Ground cumin",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000047",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000003e",
      "name": "Bay leaf",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000048",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-00000000003f",
      "name": "Ground cinnamon",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-000000000049",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000040",
      "name": "Dried oregano",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000004a",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000003-0000-4000-8000-000000000041",
      "name": "Homemade adjika",
      "category_id": "de000001-0000-4000-8000-000000000005",
      "active_variant_id": "de000004-0000-4000-8000-00000000004b",
      "note": "Recipe from the neighbours, composition unknown — nutrition not filled in",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    }
  ],
  "product_variants": [
    {
      "id": "de000004-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000001",
      "name": "Meadow 3.2%",
      "kcal_100": 60,
      "protein_100": 2.9,
      "fat_100": 3.2,
      "carbs_100": 4.7,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-000000000001",
      "name": "Meadow 2.5%",
      "kcal_100": 52,
      "protein_100": 2.8,
      "fat_100": 2.5,
      "carbs_100": 4.8,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000001",
      "name": "Bright Day 3.5%",
      "kcal_100": 64,
      "protein_100": 3,
      "fat_100": 3.5,
      "carbs_100": 4.7,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-000000000002",
      "name": "Quiet Creek 5%",
      "kcal_100": 121,
      "protein_100": 17.2,
      "fat_100": 5,
      "carbs_100": 1.8,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000002",
      "name": "Quiet Creek 9%",
      "kcal_100": 159,
      "protein_100": 16.7,
      "fat_100": 9,
      "carbs_100": 2,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000002",
      "name": "Fat-free",
      "kcal_100": 88,
      "protein_100": 18,
      "fat_100": 0.6,
      "carbs_100": 1.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000003",
      "name": null,
      "kcal_100": 40,
      "protein_100": 3,
      "fat_100": 1,
      "carbs_100": 4,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-000000000004",
      "name": null,
      "kcal_100": 51,
      "protein_100": 5,
      "fat_100": 1.5,
      "carbs_100": 3.5,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-000000000005",
      "name": null,
      "kcal_100": 118,
      "protein_100": 3,
      "fat_100": 10,
      "carbs_100": 4,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-000000000006",
      "name": null,
      "kcal_100": 206,
      "protein_100": 2.8,
      "fat_100": 20,
      "carbs_100": 3.2,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000007",
      "name": null,
      "kcal_100": 158,
      "protein_100": 2.6,
      "fat_100": 15,
      "carbs_100": 3,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000008",
      "name": null,
      "kcal_100": 748,
      "protein_100": 0.5,
      "fat_100": 82.5,
      "carbs_100": 0.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "name": null,
      "kcal_100": 157,
      "protein_100": 12.7,
      "fat_100": 11.5,
      "carbs_100": 0.7,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-00000000000a",
      "name": "Gouda",
      "kcal_100": 363,
      "protein_100": 23.4,
      "fat_100": 29.5,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-00000000000a",
      "name": "Parmesan",
      "kcal_100": 392,
      "protein_100": 33,
      "fat_100": 28,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000000b",
      "name": null,
      "kcal_100": 264,
      "protein_100": 14.2,
      "fat_100": 21.3,
      "carbs_100": 4.1,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-00000000000c",
      "name": null,
      "kcal_100": 113,
      "protein_100": 23.6,
      "fat_100": 1.9,
      "carbs_100": 0.4,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-00000000000d",
      "name": null,
      "kcal_100": 121,
      "protein_100": 19.7,
      "fat_100": 4.1,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-00000000000e",
      "name": "Regular",
      "kcal_100": 254,
      "protein_100": 17.2,
      "fat_100": 20,
      "carbs_100": 0,
      "is_approximate": true,
      "source": "seed",
      "note": "Average across store packs",
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-00000000000e",
      "name": "Lean",
      "kcal_100": 176,
      "protein_100": 20,
      "fat_100": 10,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000015",
      "product_id": "de000003-0000-4000-8000-00000000000f",
      "name": null,
      "kcal_100": 263,
      "protein_100": 16.7,
      "fat_100": 21.2,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000016",
      "product_id": "de000003-0000-4000-8000-000000000010",
      "name": null,
      "kcal_100": 187,
      "protein_100": 18.9,
      "fat_100": 12.4,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000017",
      "product_id": "de000003-0000-4000-8000-000000000011",
      "name": null,
      "kcal_100": 208,
      "protein_100": 20,
      "fat_100": 13.6,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000018",
      "product_id": "de000003-0000-4000-8000-000000000012",
      "name": null,
      "kcal_100": 77,
      "protein_100": 2,
      "fat_100": 0.4,
      "carbs_100": 16.3,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000019",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "name": null,
      "kcal_100": 32,
      "protein_100": 1.3,
      "fat_100": 0.1,
      "carbs_100": 6.9,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000001a",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "name": null,
      "kcal_100": 41,
      "protein_100": 1.4,
      "fat_100": 0,
      "carbs_100": 10.4,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000001b",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "name": null,
      "kcal_100": 143,
      "protein_100": 6.5,
      "fat_100": 0.5,
      "carbs_100": 29.9,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000001c",
      "product_id": "de000003-0000-4000-8000-000000000016",
      "name": null,
      "kcal_100": 28,
      "protein_100": 1.8,
      "fat_100": 0.1,
      "carbs_100": 4.7,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000001d",
      "product_id": "de000003-0000-4000-8000-000000000017",
      "name": null,
      "kcal_100": 43,
      "protein_100": 1.5,
      "fat_100": 0.1,
      "carbs_100": 8.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000001e",
      "product_id": "de000003-0000-4000-8000-000000000018",
      "name": null,
      "kcal_100": 20,
      "protein_100": 1.1,
      "fat_100": 0.2,
      "carbs_100": 3.7,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000001f",
      "product_id": "de000003-0000-4000-8000-000000000019",
      "name": null,
      "kcal_100": 15,
      "protein_100": 0.8,
      "fat_100": 0.1,
      "carbs_100": 2.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000020",
      "product_id": "de000003-0000-4000-8000-00000000001a",
      "name": null,
      "kcal_100": 27,
      "protein_100": 1.3,
      "fat_100": 0,
      "carbs_100": 5.3,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000021",
      "product_id": "de000003-0000-4000-8000-00000000001b",
      "name": null,
      "kcal_100": 34,
      "protein_100": 2.8,
      "fat_100": 0.4,
      "carbs_100": 6.6,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000022",
      "product_id": "de000003-0000-4000-8000-00000000001c",
      "name": null,
      "kcal_100": 22,
      "protein_100": 1,
      "fat_100": 0.1,
      "carbs_100": 4.4,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000023",
      "product_id": "de000003-0000-4000-8000-00000000001d",
      "name": null,
      "kcal_100": 24,
      "protein_100": 0.6,
      "fat_100": 0.3,
      "carbs_100": 4.6,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000024",
      "product_id": "de000003-0000-4000-8000-00000000001e",
      "name": null,
      "kcal_100": 27,
      "protein_100": 4.3,
      "fat_100": 1,
      "carbs_100": 0.1,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000025",
      "product_id": "de000003-0000-4000-8000-00000000001f",
      "name": null,
      "kcal_100": 96,
      "protein_100": 1.5,
      "fat_100": 0.5,
      "carbs_100": 21,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000026",
      "product_id": "de000003-0000-4000-8000-000000000020",
      "name": null,
      "kcal_100": 47,
      "protein_100": 0.4,
      "fat_100": 0.4,
      "carbs_100": 9.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000027",
      "product_id": "de000003-0000-4000-8000-000000000021",
      "name": null,
      "kcal_100": 16,
      "protein_100": 0.9,
      "fat_100": 0.1,
      "carbs_100": 3,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000028",
      "product_id": "de000003-0000-4000-8000-000000000022",
      "name": null,
      "kcal_100": 40,
      "protein_100": 2.5,
      "fat_100": 0.5,
      "carbs_100": 6.3,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000029",
      "product_id": "de000003-0000-4000-8000-000000000023",
      "name": null,
      "kcal_100": 49,
      "protein_100": 3.7,
      "fat_100": 0.4,
      "carbs_100": 7.6,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000002a",
      "product_id": "de000003-0000-4000-8000-000000000024",
      "name": null,
      "kcal_100": 344,
      "protein_100": 6.7,
      "fat_100": 0.7,
      "carbs_100": 78.9,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000002b",
      "product_id": "de000003-0000-4000-8000-000000000025",
      "name": null,
      "kcal_100": 313,
      "protein_100": 12.6,
      "fat_100": 3.3,
      "carbs_100": 62.1,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000002c",
      "product_id": "de000003-0000-4000-8000-000000000026",
      "name": null,
      "kcal_100": 352,
      "protein_100": 12.3,
      "fat_100": 6.2,
      "carbs_100": 61.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000002d",
      "product_id": "de000003-0000-4000-8000-000000000027",
      "name": null,
      "kcal_100": 328,
      "protein_100": 10.3,
      "fat_100": 1,
      "carbs_100": 70.6,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000002e",
      "product_id": "de000003-0000-4000-8000-000000000028",
      "name": "Spaghetti",
      "kcal_100": 337,
      "protein_100": 10.4,
      "fat_100": 1.1,
      "carbs_100": 69.7,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000002f",
      "product_id": "de000003-0000-4000-8000-000000000028",
      "name": "Thin vermicelli",
      "kcal_100": 336,
      "protein_100": 10.4,
      "fat_100": 1.1,
      "carbs_100": 69.7,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000030",
      "product_id": "de000003-0000-4000-8000-000000000029",
      "name": null,
      "kcal_100": 334,
      "protein_100": 10.3,
      "fat_100": 1.1,
      "carbs_100": 68.9,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000031",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "name": "White",
      "kcal_100": 399,
      "protein_100": 0,
      "fat_100": 0,
      "carbs_100": 99.8,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000032",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "name": "Cane",
      "kcal_100": 380,
      "protein_100": 0.1,
      "fat_100": 0,
      "carbs_100": 98.1,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000033",
      "product_id": "de000003-0000-4000-8000-00000000002b",
      "name": null,
      "kcal_100": 347,
      "protein_100": 9.7,
      "fat_100": 1.2,
      "carbs_100": 72.2,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000034",
      "product_id": "de000003-0000-4000-8000-00000000002c",
      "name": null,
      "kcal_100": 164,
      "protein_100": 8.9,
      "fat_100": 2.6,
      "carbs_100": 27.4,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000035",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "name": "Sunflower",
      "kcal_100": 899,
      "protein_100": 0,
      "fat_100": 99.9,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000036",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "name": "Olive",
      "kcal_100": 898,
      "protein_100": 0,
      "fat_100": 99.8,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000037",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "name": "Corn",
      "kcal_100": 899,
      "protein_100": 0,
      "fat_100": 99.9,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "label",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000038",
      "product_id": "de000003-0000-4000-8000-00000000002e",
      "name": null,
      "kcal_100": 92,
      "protein_100": 5,
      "fat_100": 0.5,
      "carbs_100": 19,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000039",
      "product_id": "de000003-0000-4000-8000-00000000002f",
      "name": null,
      "kcal_100": 20,
      "protein_100": 1.1,
      "fat_100": 0.2,
      "carbs_100": 3.7,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000003a",
      "product_id": "de000003-0000-4000-8000-000000000030",
      "name": null,
      "kcal_100": 95,
      "protein_100": 6.5,
      "fat_100": 0.3,
      "carbs_100": 17,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000003b",
      "product_id": "de000003-0000-4000-8000-000000000031",
      "name": null,
      "kcal_100": 175,
      "protein_100": 2.2,
      "fat_100": 15.1,
      "carbs_100": 5.1,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000003c",
      "product_id": "de000003-0000-4000-8000-000000000032",
      "name": null,
      "kcal_100": 595,
      "protein_100": 17,
      "fat_100": 53.8,
      "carbs_100": 21.2,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000003d",
      "product_id": "de000003-0000-4000-8000-000000000033",
      "name": null,
      "kcal_100": 329,
      "protein_100": 0.8,
      "fat_100": 0,
      "carbs_100": 81.5,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000003e",
      "product_id": "de000003-0000-4000-8000-000000000034",
      "name": null,
      "kcal_100": 656,
      "protein_100": 16.2,
      "fat_100": 60.8,
      "carbs_100": 11.1,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000003f",
      "product_id": "de000003-0000-4000-8000-000000000035",
      "name": null,
      "kcal_100": 645,
      "protein_100": 18.6,
      "fat_100": 57.7,
      "carbs_100": 16.2,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000040",
      "product_id": "de000003-0000-4000-8000-000000000036",
      "name": null,
      "kcal_100": 264,
      "protein_100": 2.9,
      "fat_100": 0.6,
      "carbs_100": 66,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000041",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "name": null,
      "kcal_100": 0,
      "protein_100": 0,
      "fat_100": 0,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000042",
      "product_id": "de000003-0000-4000-8000-000000000038",
      "name": null,
      "kcal_100": 0,
      "protein_100": 0,
      "fat_100": 0,
      "carbs_100": 0,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000043",
      "product_id": "de000003-0000-4000-8000-000000000039",
      "name": null,
      "kcal_100": 379,
      "protein_100": 0,
      "fat_100": 0,
      "carbs_100": 94.5,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000044",
      "product_id": "de000003-0000-4000-8000-00000000003a",
      "name": null,
      "kcal_100": 53,
      "protein_100": 0,
      "fat_100": 0,
      "carbs_100": 27.7,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000045",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "name": null,
      "kcal_100": 251,
      "protein_100": 10.4,
      "fat_100": 3.3,
      "carbs_100": 64,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000046",
      "product_id": "de000003-0000-4000-8000-00000000003c",
      "name": null,
      "kcal_100": 282,
      "protein_100": 14.1,
      "fat_100": 12.9,
      "carbs_100": 54,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000047",
      "product_id": "de000003-0000-4000-8000-00000000003d",
      "name": null,
      "kcal_100": 375,
      "protein_100": 17.8,
      "fat_100": 22.3,
      "carbs_100": 44.2,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000048",
      "product_id": "de000003-0000-4000-8000-00000000003e",
      "name": null,
      "kcal_100": 313,
      "protein_100": 7.6,
      "fat_100": 8.4,
      "carbs_100": 75,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-000000000049",
      "product_id": "de000003-0000-4000-8000-00000000003f",
      "name": null,
      "kcal_100": 247,
      "protein_100": 4,
      "fat_100": 1.2,
      "carbs_100": 80.6,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000004a",
      "product_id": "de000003-0000-4000-8000-000000000040",
      "name": null,
      "kcal_100": 265,
      "protein_100": 9,
      "fat_100": 4.3,
      "carbs_100": 69,
      "is_approximate": false,
      "source": "seed",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    },
    {
      "id": "de000004-0000-4000-8000-00000000004b",
      "product_id": "de000003-0000-4000-8000-000000000041",
      "name": null,
      "kcal_100": null,
      "protein_100": null,
      "fat_100": null,
      "carbs_100": null,
      "is_approximate": false,
      "source": "manual",
      "note": null,
      "archived_at": null,
      "created_at": "2026-07-18T08:00:00.000000+00:00",
      "updated_at": "2026-07-18T08:00:00.000000+00:00"
    }
  ],
  "recipes": [
    {
      "id": "de000005-0000-4000-8000-000000000001",
      "name": "Cottage cheese pancakes",
      "servings_base": 3,
      "yield_grams": null,
      "cook_time_min": 25,
      "photo_path": "de000005-0000-4000-8000-000000000001/cover.webp",
      "notes": "The cottage cheese must be dry. If the mixture sticks to your hands, add a spoonful of flour, but no more: the pancakes will turn dense.",
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-07-20T09:00:00.000000+00:00",
      "updated_at": "2026-07-20T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000002",
      "name": "Oatmeal with banana and nuts",
      "servings_base": 1,
      "yield_grams": null,
      "cook_time_min": 10,
      "photo_path": "de000005-0000-4000-8000-000000000002/cover.webp",
      "notes": "Use a ripe banana with dark spots for the porridge: it is sweeter, so no honey is needed.",
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": null,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-07-22T09:00:00.000000+00:00",
      "updated_at": "2026-07-22T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000003",
      "name": "Cottage cheese casserole",
      "servings_base": 6,
      "yield_grams": 860,
      "cook_time_min": 50,
      "photo_path": "de000005-0000-4000-8000-000000000003/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 4,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-07-20T09:00:00.000000+00:00",
      "updated_at": "2026-07-20T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000004",
      "name": "Chicken pilaf",
      "servings_base": 6,
      "yield_grams": 1900,
      "cook_time_min": 75,
      "photo_path": "de000005-0000-4000-8000-000000000004/cover.webp",
      "notes": "Rinse the rice before adding it until the water runs clear — then the pilaf turns out fluffy.",
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-07-25T09:00:00.000000+00:00",
      "updated_at": "2026-07-25T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000005",
      "name": "Buckwheat with mushrooms and onion",
      "servings_base": 3,
      "yield_grams": null,
      "cook_time_min": 35,
      "photo_path": "de000005-0000-4000-8000-000000000005/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-07-28T09:00:00.000000+00:00",
      "updated_at": "2026-07-28T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000006",
      "name": "Pasta bolognese",
      "servings_base": 4,
      "yield_grams": 1450,
      "cook_time_min": 50,
      "photo_path": "de000005-0000-4000-8000-000000000006/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-01T09:00:00.000000+00:00",
      "updated_at": "2026-08-01T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000007",
      "name": "Stuffed cabbage rolls",
      "servings_base": 8,
      "yield_grams": 2300,
      "cook_time_min": 120,
      "photo_path": "de000005-0000-4000-8000-000000000007/cover.webp",
      "notes": "They freeze well when already cooked, in the sauce. Reheat in the oven or in a covered frying pan before serving.",
      "video_urls": [],
      "freezable": true,
      "freezer_days": 90,
      "fridge_days": 4,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-20T09:00:00.000000+00:00",
      "updated_at": "2026-08-20T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000008",
      "name": "Baked chicken with vegetables",
      "servings_base": 4,
      "yield_grams": null,
      "cook_time_min": 70,
      "photo_path": "de000005-0000-4000-8000-000000000008/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-15T09:00:00.000000+00:00",
      "updated_at": "2026-08-15T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000009",
      "name": "Chicken patties",
      "servings_base": 8,
      "yield_grams": 950,
      "cook_time_min": 45,
      "photo_path": "de000005-0000-4000-8000-000000000009/cover.webp",
      "notes": "For juiciness, dice the fillet finely with a knife instead of grinding it.",
      "video_urls": [],
      "freezable": true,
      "freezer_days": 90,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-08T09:00:00.000000+00:00",
      "updated_at": "2026-08-08T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-00000000000a",
      "name": "Salmon with broccoli",
      "servings_base": 2,
      "yield_grams": null,
      "cook_time_min": 25,
      "photo_path": "de000005-0000-4000-8000-00000000000a/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 2,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-01T09:00:00.000000+00:00",
      "updated_at": "2026-09-01T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-00000000000b",
      "name": "Borscht",
      "servings_base": 8,
      "yield_grams": 3300,
      "cook_time_min": 150,
      "photo_path": "de000005-0000-4000-8000-00000000000b/cover.webp",
      "notes": "It tastes better on the second day. For a bright colour, add a spoonful of lemon juice or vinegar at the end.",
      "video_urls": [],
      "freezable": true,
      "freezer_days": 90,
      "fridge_days": 4,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-05T09:00:00.000000+00:00",
      "updated_at": "2026-08-05T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-00000000000c",
      "name": "Chicken noodle soup",
      "servings_base": 6,
      "yield_grams": 2500,
      "cook_time_min": 50,
      "photo_path": "de000005-0000-4000-8000-00000000000c/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-05T09:00:00.000000+00:00",
      "updated_at": "2026-09-05T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-00000000000d",
      "name": "Pumpkin cream soup",
      "servings_base": 4,
      "yield_grams": 1500,
      "cook_time_min": 40,
      "photo_path": "de000005-0000-4000-8000-00000000000d/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-14T09:00:00.000000+00:00",
      "updated_at": "2026-09-14T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-00000000000e",
      "name": "Charlotte apple cake",
      "servings_base": 8,
      "yield_grams": 950,
      "cook_time_min": 60,
      "photo_path": "de000005-0000-4000-8000-00000000000e/cover.webp",
      "notes": "It works best with sweet-and-sour apples. If the apples are juicy, sprinkle them with a spoonful of flour.",
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 2,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-12T09:00:00.000000+00:00",
      "updated_at": "2026-08-12T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-00000000000f",
      "name": "Banana bread",
      "servings_base": 10,
      "yield_grams": 780,
      "cook_time_min": 70,
      "photo_path": "de000005-0000-4000-8000-00000000000f/cover.webp",
      "notes": "The bananas must be overripe, almost black. The baking powder is not counted: its weight is negligible.",
      "video_urls": [],
      "freezable": true,
      "freezer_days": 60,
      "fridge_days": 4,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-10T09:00:00.000000+00:00",
      "updated_at": "2026-09-10T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000010",
      "name": "Chili con carne",
      "servings_base": 6,
      "yield_grams": 1900,
      "cook_time_min": 90,
      "photo_path": "de000005-0000-4000-8000-000000000010/cover.webp",
      "notes": "The homemade adjika has an unknown composition: its nutrition figures are not filled in, so the calculation is incomplete.",
      "video_urls": [],
      "freezable": true,
      "freezer_days": 90,
      "fridge_days": 4,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-08-28T09:00:00.000000+00:00",
      "updated_at": "2026-08-28T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000011",
      "name": "Greek salad",
      "servings_base": 2,
      "yield_grams": null,
      "cook_time_min": 10,
      "photo_path": "de000005-0000-4000-8000-000000000011/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": null,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-18T09:00:00.000000+00:00",
      "updated_at": "2026-09-18T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000012",
      "name": "Hummus",
      "servings_base": 6,
      "yield_grams": null,
      "cook_time_min": 15,
      "photo_path": "de000005-0000-4000-8000-000000000012/cover.webp",
      "notes": null,
      "video_urls": [],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 5,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-22T09:00:00.000000+00:00",
      "updated_at": "2026-09-22T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000013",
      "name": "Oatmeal cookies",
      "servings_base": 16,
      "yield_grams": 540,
      "cook_time_min": 45,
      "photo_path": "de000005-0000-4000-8000-000000000013/cover.webp",
      "notes": "Based on a video from the ProSto Kuhnya channel (chef Belkovich). The raisin paste makes the dough softer. The video gives a yield of 400 g; here the weight is taken as 540 g: the sum of the raw ingredients minus the moisture lost in baking.",
      "video_urls": [
        "https://www.youtube.com/watch?v=Trwh6ZMIMAs"
      ],
      "freezable": false,
      "freezer_days": null,
      "fridge_days": 7,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-25T09:00:00.000000+00:00",
      "updated_at": "2026-09-25T09:00:00.000000+00:00"
    },
    {
      "id": "de000005-0000-4000-8000-000000000014",
      "name": "Blini",
      "servings_base": 5,
      "yield_grams": null,
      "cook_time_min": 40,
      "photo_path": "de000005-0000-4000-8000-000000000014/cover.webp",
      "notes": "Based on a video from Edim Doma (Yulia Vysotskaya). The original gives the amounts in cups and spoons; here they are converted to grams: a cup is 250 ml (milk and water 250 g each), flour is about 150 g per cup, a tablespoon of sugar is 25 g, of oil 17 g, a teaspoon of salt is 7 g, of baking powder 4 g, an egg is 55 g. Slightly more flour may be needed: the batter must stay thin.",
      "video_urls": [
        "https://www.youtube.com/watch?v=hfp7--DgLUo"
      ],
      "freezable": true,
      "freezer_days": 60,
      "fridge_days": 3,
      "kcal_100_override": null,
      "protein_100_override": null,
      "fat_100_override": null,
      "carbs_100_override": null,
      "archived_at": null,
      "created_at": "2026-09-27T09:00:00.000000+00:00",
      "updated_at": "2026-09-27T09:00:00.000000+00:00"
    }
  ],
  "recipe_steps": [
    {
      "id": "de000006-0000-4000-8000-000000000001",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "sort_order": 1,
      "text": "Mash the cottage cheese with a fork into small crumbs, add the egg, sugar and a pinch of salt."
    },
    {
      "id": "de000006-0000-4000-8000-000000000002",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "sort_order": 2,
      "text": "Add 60 g of flour and knead a soft dough that holds its shape."
    },
    {
      "id": "de000006-0000-4000-8000-000000000003",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "sort_order": 3,
      "text": "Sprinkle the remaining flour on a board. Roll the dough into apricot-sized balls and flatten them slightly."
    },
    {
      "id": "de000006-0000-4000-8000-000000000004",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "sort_order": 4,
      "text": "Coat each disc in flour and shake off the excess."
    },
    {
      "id": "de000006-0000-4000-8000-000000000005",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "sort_order": 5,
      "text": "Heat the oil in a frying pan and fry the pancakes over medium heat for 3 minutes per side until golden."
    },
    {
      "id": "de000006-0000-4000-8000-000000000006",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "sort_order": 6,
      "text": "Serve hot with sour cream or honey."
    },
    {
      "id": "de000006-0000-4000-8000-000000000007",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "sort_order": 1,
      "text": "Pour the milk over the oats and bring to a boil over medium heat."
    },
    {
      "id": "de000006-0000-4000-8000-000000000008",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "sort_order": 2,
      "text": "Cook for 5 minutes, stirring, until the porridge thickens."
    },
    {
      "id": "de000006-0000-4000-8000-000000000009",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "sort_order": 3,
      "text": "Mash half of the banana into the porridge and slice the rest into rounds."
    },
    {
      "id": "de000006-0000-4000-8000-00000000000a",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "sort_order": 4,
      "text": "Transfer the porridge to a bowl and top with the banana rounds and chopped nuts. Add honey and cinnamon if you like."
    },
    {
      "id": "de000006-0000-4000-8000-00000000000b",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "sort_order": 1,
      "text": "Mash the cottage cheese with the eggs and sugar until smooth."
    },
    {
      "id": "de000006-0000-4000-8000-00000000000c",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "sort_order": 2,
      "text": "Add the semolina and raisins, stir and leave for 15 minutes so the grain swells."
    },
    {
      "id": "de000006-0000-4000-8000-00000000000d",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "sort_order": 3,
      "text": "Grease the dish with butter and dust it with semolina. Spread the mixture in and level it."
    },
    {
      "id": "de000006-0000-4000-8000-00000000000e",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "sort_order": 4,
      "text": "Brush the top with sour cream."
    },
    {
      "id": "de000006-0000-4000-8000-00000000000f",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "sort_order": 5,
      "text": "Bake at 180 °C for about 35 minutes until the top browns."
    },
    {
      "id": "de000006-0000-4000-8000-000000000010",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "sort_order": 6,
      "text": "Cool in the dish for 10 minutes, then slice."
    },
    {
      "id": "de000006-0000-4000-8000-000000000011",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 1,
      "text": "Cut the meat into large pieces, the onion into half rings and the carrots into thick strips."
    },
    {
      "id": "de000006-0000-4000-8000-000000000012",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 2,
      "text": "Heat the oil in a heavy pot and sear the meat until crusty."
    },
    {
      "id": "de000006-0000-4000-8000-000000000013",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 3,
      "text": "Add the onion and fry for 5 minutes, then the carrots for another 7 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000014",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 4,
      "text": "Add the cumin, salt and pepper and pour in boiling water so that it barely covers the meat. Simmer for 20 minutes over low heat."
    },
    {
      "id": "de000006-0000-4000-8000-000000000015",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 5,
      "text": "Spread the rinsed rice in an even layer without stirring and add boiling water to 1.5 cm above the rice."
    },
    {
      "id": "de000006-0000-4000-8000-000000000016",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 6,
      "text": "When the water is absorbed, gather the rice into a mound, stick the garlic heads into the middle, cover with a lid and steam for 20 minutes over the lowest heat."
    },
    {
      "id": "de000006-0000-4000-8000-000000000017",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "sort_order": 7,
      "text": "Stir gently before serving."
    },
    {
      "id": "de000006-0000-4000-8000-000000000018",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "sort_order": 1,
      "text": "Pick over and rinse the buckwheat. Cover with twice its volume of hot water, add salt and cook covered for 15 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000019",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "sort_order": 2,
      "text": "Slice the mushrooms into plates, dice the onion and grate the carrot."
    },
    {
      "id": "de000006-0000-4000-8000-00000000001a",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "sort_order": 3,
      "text": "Fry the onion and carrot in oil for 5 minutes, then add the mushrooms and fry until the liquid evaporates."
    },
    {
      "id": "de000006-0000-4000-8000-00000000001b",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "sort_order": 4,
      "text": "Mix the cooked buckwheat with the vegetables and mushrooms and heat for a couple of minutes."
    },
    {
      "id": "de000006-0000-4000-8000-00000000001c",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "sort_order": 5,
      "text": "Serve with sour cream and chopped dill."
    },
    {
      "id": "de000006-0000-4000-8000-00000000001d",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "sort_order": 1,
      "text": "Finely chop the onion and carrot and crush the garlic."
    },
    {
      "id": "de000006-0000-4000-8000-00000000001e",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "sort_order": 2,
      "text": "Fry the onion and carrot in olive oil for 6 minutes, add the garlic for a minute."
    },
    {
      "id": "de000006-0000-4000-8000-00000000001f",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "sort_order": 3,
      "text": "Add the ground beef, break it up with a spatula and fry until it changes colour."
    },
    {
      "id": "de000006-0000-4000-8000-000000000020",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "sort_order": 4,
      "text": "Add the tomatoes, tomato paste, oregano and salt. Simmer over low heat for 25 minutes until the sauce thickens."
    },
    {
      "id": "de000006-0000-4000-8000-000000000021",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "sort_order": 5,
      "text": "Cook the spaghetti al dente according to the package instructions."
    },
    {
      "id": "de000006-0000-4000-8000-000000000022",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "sort_order": 6,
      "text": "Combine the pasta with the sauce and serve with grated Parmesan."
    },
    {
      "id": "de000006-0000-4000-8000-000000000023",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "sort_order": 1,
      "text": "Cut out the core of the cabbage and lower it into boiling water. Remove the leaves as they soften."
    },
    {
      "id": "de000006-0000-4000-8000-000000000024",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "sort_order": 2,
      "text": "Boil the rice until half-cooked. Finely chop the onion and fry it."
    },
    {
      "id": "de000006-0000-4000-8000-000000000025",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "sort_order": 3,
      "text": "Mix the ground meat with the rice, half of the onion, salt and pepper."
    },
    {
      "id": "de000006-0000-4000-8000-000000000026",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "sort_order": 4,
      "text": "Put a handful of filling on each leaf and wrap it like an envelope."
    },
    {
      "id": "de000006-0000-4000-8000-000000000027",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "sort_order": 5,
      "text": "Make a sauce from the carrots, the remaining onion, tomato paste and sour cream, adding a little water."
    },
    {
      "id": "de000006-0000-4000-8000-000000000028",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "sort_order": 6,
      "text": "Pack the cabbage rolls tightly into a pot, pour the sauce over them, add the bay leaf and simmer covered for 60 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000029",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "sort_order": 1,
      "text": "Mix the oil, paprika, salt, pepper and crushed garlic. Rub the mixture into the meat and leave it for 20 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-00000000002a",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "sort_order": 2,
      "text": "Cut the potatoes and carrots into large pieces, the zucchini and pepper into larger squares."
    },
    {
      "id": "de000006-0000-4000-8000-00000000002b",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "sort_order": 3,
      "text": "Put the vegetables on a baking tray, toss them with the rest of the marinade and place the meat on top."
    },
    {
      "id": "de000006-0000-4000-8000-00000000002c",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "sort_order": 4,
      "text": "Bake at 200 °C for about 45 minutes, stirring the vegetables once."
    },
    {
      "id": "de000006-0000-4000-8000-00000000002d",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "sort_order": 5,
      "text": "Sprinkle with chopped parsley before serving."
    },
    {
      "id": "de000006-0000-4000-8000-00000000002e",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "sort_order": 1,
      "text": "Finely chop the fillet, onion and dill."
    },
    {
      "id": "de000006-0000-4000-8000-00000000002f",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "sort_order": 2,
      "text": "Combine with the egg, sour cream, half of the breadcrumbs, salt and pepper. Knead and refrigerate for 15 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000030",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "sort_order": 3,
      "text": "With wet hands, shape eight patties and coat them in the remaining breadcrumbs."
    },
    {
      "id": "de000006-0000-4000-8000-000000000031",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "sort_order": 4,
      "text": "Fry in oil for 4 minutes per side, then finish covered over low heat for 8 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000032",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "sort_order": 1,
      "text": "Break the broccoli into florets and put them on a baking tray together with sliced garlic."
    },
    {
      "id": "de000006-0000-4000-8000-000000000033",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "sort_order": 2,
      "text": "Cut the fish into two portions, season with salt and pepper and sprinkle with half of the lemon."
    },
    {
      "id": "de000006-0000-4000-8000-000000000034",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "sort_order": 3,
      "text": "Put the fish on the vegetables and drizzle with oil."
    },
    {
      "id": "de000006-0000-4000-8000-000000000035",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "sort_order": 4,
      "text": "Bake at 200 °C for 15 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000036",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "sort_order": 5,
      "text": "Serve with lemon wedges and dill."
    },
    {
      "id": "de000006-0000-4000-8000-000000000037",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "sort_order": 1,
      "text": "Pour 2.5 l of cold water over the meat, bring to a boil, skim the foam and simmer over low heat for 1.5 hours."
    },
    {
      "id": "de000006-0000-4000-8000-000000000038",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "sort_order": 2,
      "text": "Grate the beetroot and carrots and chop the onion. Fry the onion with the carrots, add the beetroot and tomato paste and stew for 10 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000039",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "sort_order": 3,
      "text": "Take out the meat and tear it into pieces. Add the diced potatoes to the broth and the cabbage 10 minutes later."
    },
    {
      "id": "de000006-0000-4000-8000-00000000003a",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "sort_order": 4,
      "text": "After 10 minutes return the meat and add the fried vegetables, bay leaf, salt and pepper."
    },
    {
      "id": "de000006-0000-4000-8000-00000000003b",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "sort_order": 5,
      "text": "Bring to a boil, add the garlic, turn off the heat and let it stand covered for 20 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-00000000003c",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "sort_order": 6,
      "text": "Serve with dill and sour cream."
    },
    {
      "id": "de000006-0000-4000-8000-00000000003d",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "sort_order": 1,
      "text": "Put the meat into 2.3 l of cold water, bring to a boil, skim the foam and cook for 25 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-00000000003e",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "sort_order": 2,
      "text": "Fry the onion and carrot in oil."
    },
    {
      "id": "de000006-0000-4000-8000-00000000003f",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "sort_order": 3,
      "text": "Take out the chicken and shred it. Add the diced potatoes to the broth and cook for 10 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000040",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "sort_order": 4,
      "text": "Add the fried vegetables, noodles, bay leaf, salt and pepper. Cook for 5 minutes and return the meat."
    },
    {
      "id": "de000006-0000-4000-8000-000000000041",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "sort_order": 5,
      "text": "Serve with chopped parsley."
    },
    {
      "id": "de000006-0000-4000-8000-000000000042",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "sort_order": 1,
      "text": "Dice the vegetables and fry the onion in butter until soft."
    },
    {
      "id": "de000006-0000-4000-8000-000000000043",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "sort_order": 2,
      "text": "Add the pumpkin, carrots and potatoes and pour in hot water almost to the level of the vegetables."
    },
    {
      "id": "de000006-0000-4000-8000-000000000044",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "sort_order": 3,
      "text": "Cook covered for 20 minutes until everything is soft."
    },
    {
      "id": "de000006-0000-4000-8000-000000000045",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "sort_order": 4,
      "text": "Blend until smooth, pour in the warmed cream, add salt and pepper."
    },
    {
      "id": "de000006-0000-4000-8000-000000000046",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "sort_order": 5,
      "text": "Heat through without bringing to a boil."
    },
    {
      "id": "de000006-0000-4000-8000-000000000047",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "sort_order": 1,
      "text": "Beat the eggs with the sugar with a mixer for 8 minutes until the mass turns pale and triples in volume."
    },
    {
      "id": "de000006-0000-4000-8000-000000000048",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "sort_order": 2,
      "text": "Sift the flour and fold it in gently with a spatula from the bottom up."
    },
    {
      "id": "de000006-0000-4000-8000-000000000049",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "sort_order": 3,
      "text": "Cut the apples into wedges and put them into the greased pan, sprinkling with cinnamon."
    },
    {
      "id": "de000006-0000-4000-8000-00000000004a",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "sort_order": 4,
      "text": "Pour the batter over and bake at 180 °C for 35–40 minutes until a skewer comes out dry."
    },
    {
      "id": "de000006-0000-4000-8000-00000000004b",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "sort_order": 5,
      "text": "Leave it in the pan for 10 minutes so the cake does not sink."
    },
    {
      "id": "de000006-0000-4000-8000-00000000004c",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "sort_order": 1,
      "text": "Mash the bananas with a fork into a purée with small chunks."
    },
    {
      "id": "de000006-0000-4000-8000-00000000004d",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "sort_order": 2,
      "text": "Melt the butter, let it cool and combine with the bananas, sugar and eggs."
    },
    {
      "id": "de000006-0000-4000-8000-00000000004e",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "sort_order": 3,
      "text": "Add the flour, cinnamon, salt and a spoonful of baking powder and stir until no dry flour is left."
    },
    {
      "id": "de000006-0000-4000-8000-00000000004f",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "sort_order": 4,
      "text": "Fold in the chopped nuts if you are using them."
    },
    {
      "id": "de000006-0000-4000-8000-000000000050",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "sort_order": 5,
      "text": "Pour into a pan lined with paper and bake at 175 °C for about 55 minutes until a skewer comes out dry."
    },
    {
      "id": "de000006-0000-4000-8000-000000000051",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "sort_order": 6,
      "text": "Cool on a rack before slicing."
    },
    {
      "id": "de000006-0000-4000-8000-000000000052",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "sort_order": 1,
      "text": "Fry the finely chopped onion in oil until translucent, add the diced pepper and garlic."
    },
    {
      "id": "de000006-0000-4000-8000-000000000053",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "sort_order": 2,
      "text": "Add the ground beef, break it into small pieces and fry for 8 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000054",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "sort_order": 3,
      "text": "Add the paprika and cumin, then the adjika and tomatoes, and salt. Simmer covered for 40 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000055",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "sort_order": 4,
      "text": "Add the rinsed beans and cook for another 15 minutes uncovered until the sauce thickens."
    },
    {
      "id": "de000006-0000-4000-8000-000000000056",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "sort_order": 5,
      "text": "Cool and portion into containers: some for the fridge, some for the freezer."
    },
    {
      "id": "de000006-0000-4000-8000-000000000057",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "sort_order": 1,
      "text": "Cut the vegetables large: tomatoes into wedges, cucumbers into half-rounds, pepper into strips, onion into thin rings."
    },
    {
      "id": "de000006-0000-4000-8000-000000000058",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "sort_order": 2,
      "text": "Put them in a bowl together with the olives."
    },
    {
      "id": "de000006-0000-4000-8000-000000000059",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "sort_order": 3,
      "text": "Put the feta on top in one piece or in large cubes."
    },
    {
      "id": "de000006-0000-4000-8000-00000000005a",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "sort_order": 4,
      "text": "Drizzle with oil, sprinkle with oregano and add a little salt: the feta is already salty."
    },
    {
      "id": "de000006-0000-4000-8000-00000000005b",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "sort_order": 1,
      "text": "Squeeze the juice from the lemon, combine it with the tahini and whip into a pale paste."
    },
    {
      "id": "de000006-0000-4000-8000-00000000005c",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "sort_order": 2,
      "text": "Add the chickpeas, garlic, cumin and salt and blend, pouring in cold water a spoonful at a time until the mixture is velvety."
    },
    {
      "id": "de000006-0000-4000-8000-00000000005d",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "sort_order": 3,
      "text": "Transfer to a plate, make a well in the centre and pour in the olive oil."
    },
    {
      "id": "de000006-0000-4000-8000-00000000005e",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 1,
      "text": "Grind the rolled oats in a blender or mixer into flour."
    },
    {
      "id": "de000006-0000-4000-8000-00000000005f",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 2,
      "text": "Mix the oat flour with the wheat flour, baking powder, vanilla sugar, cinnamon, salt and sugar."
    },
    {
      "id": "de000006-0000-4000-8000-000000000060",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 3,
      "text": "Blend the raisins with warm water into a thick paste and add it to the dry mixture."
    },
    {
      "id": "de000006-0000-4000-8000-000000000061",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 4,
      "text": "Melt the butter with the honey over low heat and pour it into the bowl."
    },
    {
      "id": "de000006-0000-4000-8000-000000000062",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 5,
      "text": "Knead a firm dough by hand and refrigerate for 15 minutes."
    },
    {
      "id": "de000006-0000-4000-8000-000000000063",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 6,
      "text": "Roll the dough into balls, press them down slightly and place them on a paper-lined baking tray, leaving gaps."
    },
    {
      "id": "de000006-0000-4000-8000-000000000064",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "sort_order": 7,
      "text": "Bake in an oven preheated to 180 °C for 12 minutes and let the cookies cool on the tray."
    },
    {
      "id": "de000006-0000-4000-8000-000000000065",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "sort_order": 1,
      "text": "Pour the boiling water into the cold milk and stir: you get a warm liquid."
    },
    {
      "id": "de000006-0000-4000-8000-000000000066",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "sort_order": 2,
      "text": "Crack in the eggs, add the salt and sugar and whisk."
    },
    {
      "id": "de000006-0000-4000-8000-000000000067",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "sort_order": 3,
      "text": "Mix the flour with the baking powder and add it in portions, whisking constantly to avoid lumps."
    },
    {
      "id": "de000006-0000-4000-8000-000000000068",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "sort_order": 4,
      "text": "At the end pour in the oil and whisk well once more."
    },
    {
      "id": "de000006-0000-4000-8000-000000000069",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "sort_order": 5,
      "text": "Fry in a well-heated pan over slightly above medium heat until the blin is browned on both sides."
    }
  ],
  "recipe_dish_categories": [
    {
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "dish_category_id": "de000002-0000-4000-8000-000000000001"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "dish_category_id": "de000002-0000-4000-8000-000000000001"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "dish_category_id": "de000002-0000-4000-8000-000000000001"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "dish_category_id": "de000002-0000-4000-8000-000000000006"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "dish_category_id": "de000002-0000-4000-8000-000000000002"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "dish_category_id": "de000002-0000-4000-8000-000000000002"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "dish_category_id": "de000002-0000-4000-8000-000000000002"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "dish_category_id": "de000002-0000-4000-8000-000000000003"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "dish_category_id": "de000002-0000-4000-8000-000000000002"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "dish_category_id": "de000002-0000-4000-8000-000000000007"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "dish_category_id": "de000002-0000-4000-8000-000000000003"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "dish_category_id": "de000002-0000-4000-8000-000000000003"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "dish_category_id": "de000002-0000-4000-8000-000000000003"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "dish_category_id": "de000002-0000-4000-8000-000000000004"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "dish_category_id": "de000002-0000-4000-8000-000000000004"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "dish_category_id": "de000002-0000-4000-8000-000000000004"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "dish_category_id": "de000002-0000-4000-8000-000000000005"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "dish_category_id": "de000002-0000-4000-8000-000000000005"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "dish_category_id": "de000002-0000-4000-8000-000000000007"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "dish_category_id": "de000002-0000-4000-8000-000000000002"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "dish_category_id": "de000002-0000-4000-8000-000000000005"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "dish_category_id": "de000002-0000-4000-8000-000000000006"
    },
    {
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "dish_category_id": "de000002-0000-4000-8000-000000000001"
    }
  ],
  "recipe_ingredients": [
    {
      "id": "de000007-0000-4000-8000-000000000001",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000002",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000005",
      "amount_grams": 500,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000002",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "pinned_variant_id": null,
      "amount_grams": 55,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000003",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000029",
      "pinned_variant_id": null,
      "amount_grams": 80,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000004",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000031",
      "amount_grams": 25,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000005",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000006",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000007",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000006",
      "pinned_variant_id": null,
      "amount_grams": 60,
      "is_optional": true,
      "note": "For serving",
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000008",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "product_id": "de000003-0000-4000-8000-000000000033",
      "pinned_variant_id": null,
      "amount_grams": 20,
      "is_optional": true,
      "note": "For serving",
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000009",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-000000000026",
      "pinned_variant_id": null,
      "amount_grams": 50,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000000a",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-000000000001",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000002",
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000000b",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-00000000001f",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000000c",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-000000000034",
      "pinned_variant_id": null,
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000000d",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-000000000033",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": true,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-00000000000e",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-00000000003f",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": true,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000000f",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "product_id": "de000003-0000-4000-8000-000000000035",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": true,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000010",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000002",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000004",
      "amount_grams": 600,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000011",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "pinned_variant_id": null,
      "amount_grams": 110,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000012",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000027",
      "pinned_variant_id": null,
      "amount_grams": 50,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000013",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000031",
      "amount_grams": 50,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000014",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000008",
      "pinned_variant_id": null,
      "amount_grams": 20,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000015",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000007",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": false,
      "note": "For brushing the top",
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000016",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "product_id": "de000003-0000-4000-8000-000000000036",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": true,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000017",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-00000000000d",
      "pinned_variant_id": null,
      "amount_grams": 700,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000018",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-000000000024",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000019",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 350,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000001a",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 250,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000001b",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 30,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-00000000001c",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 80,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000001d",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-00000000003d",
      "pinned_variant_id": null,
      "amount_grams": 3,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-00000000001e",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 8,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-00000000001f",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000020",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000025",
      "pinned_variant_id": null,
      "amount_grams": 200,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000021",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-00000000001e",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000022",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 120,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000023",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 80,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000024",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 25,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000025",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 4,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000026",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000027",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000006",
      "pinned_variant_id": null,
      "amount_grams": 60,
      "is_optional": true,
      "note": "For serving",
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000028",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "product_id": "de000003-0000-4000-8000-000000000022",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": true,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000029",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000028",
      "pinned_variant_id": "de000004-0000-4000-8000-00000000002e",
      "amount_grams": 320,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000002a",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-00000000000e",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000002b",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-00000000002f",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000002c",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-00000000002e",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000002d",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 120,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-00000000002e",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000002f",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 12,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000030",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000036",
      "amount_grams": 25,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000031",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000040",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000032",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 6,
      "is_optional": false,
      "note": null,
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-000000000033",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "product_id": "de000003-0000-4000-8000-00000000000a",
      "pinned_variant_id": "de000004-0000-4000-8000-00000000000f",
      "amount_grams": 40,
      "is_optional": true,
      "note": "For serving",
      "sort_order": 11
    },
    {
      "id": "de000007-0000-4000-8000-000000000034",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000016",
      "pinned_variant_id": null,
      "amount_grams": 900,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000035",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-00000000000f",
      "pinned_variant_id": null,
      "amount_grams": 600,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000036",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000024",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000037",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000038",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000039",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-00000000002e",
      "pinned_variant_id": null,
      "amount_grams": 60,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000003a",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000006",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-00000000003b",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 30,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-00000000003c",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-00000000003e",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-00000000003d",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 12,
      "is_optional": false,
      "note": null,
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-00000000003e",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": false,
      "note": null,
      "sort_order": 11
    },
    {
      "id": "de000007-0000-4000-8000-00000000003f",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-00000000000d",
      "pinned_variant_id": null,
      "amount_grams": 800,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000040",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-000000000012",
      "pinned_variant_id": null,
      "amount_grams": 600,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000041",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 200,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000042",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-00000000001d",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000043",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-00000000001a",
      "pinned_variant_id": null,
      "amount_grams": 200,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000044",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000045",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000046",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-00000000003c",
      "pinned_variant_id": null,
      "amount_grams": 4,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000047",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 8,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000048",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-000000000049",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "product_id": "de000003-0000-4000-8000-000000000023",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": true,
      "note": null,
      "sort_order": 11
    },
    {
      "id": "de000007-0000-4000-8000-00000000004a",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-00000000000c",
      "pinned_variant_id": null,
      "amount_grams": 700,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000004b",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000004c",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "pinned_variant_id": null,
      "amount_grams": 55,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000004d",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-00000000002b",
      "pinned_variant_id": null,
      "amount_grams": 80,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000004e",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-000000000006",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-00000000004f",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000050",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 8,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000051",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000052",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "product_id": "de000003-0000-4000-8000-000000000022",
      "pinned_variant_id": null,
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000053",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-000000000011",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000054",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-00000000001b",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000055",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-000000000021",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000056",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000036",
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000057",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 6,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000058",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 3,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000059",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-00000000005a",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "product_id": "de000003-0000-4000-8000-000000000022",
      "pinned_variant_id": null,
      "amount_grams": 8,
      "is_optional": true,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-00000000005b",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000010",
      "pinned_variant_id": null,
      "amount_grams": 500,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000005c",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000017",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000005d",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000016",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000005e",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000012",
      "pinned_variant_id": null,
      "amount_grams": 350,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000005f",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000060",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000061",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-00000000002e",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000062",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000063",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 30,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000064",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-00000000003e",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-000000000065",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 11
    },
    {
      "id": "de000007-0000-4000-8000-000000000066",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 12
    },
    {
      "id": "de000007-0000-4000-8000-000000000067",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000022",
      "pinned_variant_id": null,
      "amount_grams": 20,
      "is_optional": true,
      "note": null,
      "sort_order": 13
    },
    {
      "id": "de000007-0000-4000-8000-000000000068",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "product_id": "de000003-0000-4000-8000-000000000006",
      "pinned_variant_id": null,
      "amount_grams": 160,
      "is_optional": true,
      "note": "For serving",
      "sort_order": 14
    },
    {
      "id": "de000007-0000-4000-8000-000000000069",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-00000000000d",
      "pinned_variant_id": null,
      "amount_grams": 500,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000006a",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000012",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000006b",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 120,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000006c",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000006d",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000028",
      "pinned_variant_id": "de000004-0000-4000-8000-00000000002f",
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-00000000006e",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 15,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000006f",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-00000000003e",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000070",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000071",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000072",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "product_id": "de000003-0000-4000-8000-000000000023",
      "pinned_variant_id": null,
      "amount_grams": 15,
      "is_optional": true,
      "note": null,
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-000000000073",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-00000000001c",
      "pinned_variant_id": null,
      "amount_grams": 800,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000074",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000012",
      "pinned_variant_id": null,
      "amount_grams": 200,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000075",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000076",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000013",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000077",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000005",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000078",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000008",
      "pinned_variant_id": null,
      "amount_grams": 20,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000079",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 6,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-00000000007a",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "product_id": "de000003-0000-4000-8000-00000000003b",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-00000000007b",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-000000000020",
      "pinned_variant_id": null,
      "amount_grams": 600,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000007c",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "pinned_variant_id": null,
      "amount_grams": 220,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000007d",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000031",
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000007e",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-000000000029",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000007f",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-000000000008",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": false,
      "note": "For the pan",
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000080",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "product_id": "de000003-0000-4000-8000-00000000003f",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": true,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000081",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-00000000001f",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000082",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-000000000029",
      "pinned_variant_id": null,
      "amount_grams": 220,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000083",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000032",
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000084",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "pinned_variant_id": null,
      "amount_grams": 110,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000085",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-000000000008",
      "pinned_variant_id": null,
      "amount_grams": 80,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000086",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-00000000003f",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-000000000087",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000088",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "product_id": "de000003-0000-4000-8000-000000000034",
      "pinned_variant_id": null,
      "amount_grams": 60,
      "is_optional": true,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000089",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000000e",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000014",
      "amount_grams": 600,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000008a",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-000000000030",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000008b",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000002f",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-00000000008c",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-00000000008d",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000001a",
      "pinned_variant_id": null,
      "amount_grams": 150,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-00000000008e",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 12,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000008f",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 25,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-000000000090",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000003c",
      "pinned_variant_id": null,
      "amount_grams": 5,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-000000000091",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-00000000003d",
      "pinned_variant_id": null,
      "amount_grams": 3,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-000000000092",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-000000000041",
      "pinned_variant_id": null,
      "amount_grams": 20,
      "is_optional": false,
      "note": null,
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-000000000093",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 8,
      "is_optional": false,
      "note": null,
      "sort_order": 11
    },
    {
      "id": "de000007-0000-4000-8000-000000000094",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-000000000019",
      "pinned_variant_id": null,
      "amount_grams": 200,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-000000000095",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-000000000018",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-000000000096",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-00000000001a",
      "pinned_variant_id": null,
      "amount_grams": 120,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-000000000097",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-000000000014",
      "pinned_variant_id": null,
      "amount_grams": 50,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-000000000098",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-00000000000b",
      "pinned_variant_id": null,
      "amount_grams": 100,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-000000000099",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-000000000031",
      "pinned_variant_id": null,
      "amount_grams": 40,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-00000000009a",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000036",
      "amount_grams": 20,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-00000000009b",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-000000000040",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-00000000009c",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-00000000009d",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-00000000002c",
      "pinned_variant_id": null,
      "amount_grams": 400,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-00000000009e",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-000000000032",
      "pinned_variant_id": null,
      "amount_grams": 70,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-00000000009f",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-000000000021",
      "pinned_variant_id": null,
      "amount_grams": 60,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a0",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-000000000015",
      "pinned_variant_id": null,
      "amount_grams": 10,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a1",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000036",
      "amount_grams": 30,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a2",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-00000000003d",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a3",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 4,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a4",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000029",
      "pinned_variant_id": null,
      "amount_grams": 110,
      "is_optional": false,
      "note": null,
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a5",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000026",
      "pinned_variant_id": null,
      "amount_grams": 170,
      "is_optional": false,
      "note": null,
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a6",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000031",
      "amount_grams": 140,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a7",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000008",
      "pinned_variant_id": null,
      "amount_grams": 80,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a8",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000036",
      "pinned_variant_id": null,
      "amount_grams": 25,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-0000000000a9",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000033",
      "pinned_variant_id": null,
      "amount_grams": 20,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-0000000000aa",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000039",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": "A quarter of a teaspoon",
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-0000000000ab",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-00000000003a",
      "pinned_variant_id": null,
      "amount_grams": 3,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    },
    {
      "id": "de000007-0000-4000-8000-0000000000ac",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-00000000003f",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 9
    },
    {
      "id": "de000007-0000-4000-8000-0000000000ad",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000038",
      "pinned_variant_id": null,
      "amount_grams": 60,
      "is_optional": false,
      "note": "Warm, for the raisin paste",
      "sort_order": 10
    },
    {
      "id": "de000007-0000-4000-8000-0000000000ae",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 2,
      "is_optional": false,
      "note": null,
      "sort_order": 11
    },
    {
      "id": "de000007-0000-4000-8000-0000000000af",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-000000000038",
      "pinned_variant_id": null,
      "amount_grams": 500,
      "is_optional": false,
      "note": "Boiling water, two cups",
      "sort_order": 1
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b0",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-000000000001",
      "pinned_variant_id": null,
      "amount_grams": 500,
      "is_optional": false,
      "note": "Cold, two cups",
      "sort_order": 2
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b1",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-000000000009",
      "pinned_variant_id": null,
      "amount_grams": 110,
      "is_optional": false,
      "note": null,
      "sort_order": 3
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b2",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-00000000002a",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000031",
      "amount_grams": 50,
      "is_optional": false,
      "note": null,
      "sort_order": 4
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b3",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-000000000037",
      "pinned_variant_id": null,
      "amount_grams": 3.5,
      "is_optional": false,
      "note": null,
      "sort_order": 5
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b4",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-000000000029",
      "pinned_variant_id": null,
      "amount_grams": 300,
      "is_optional": false,
      "note": null,
      "sort_order": 6
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b5",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-00000000003a",
      "pinned_variant_id": null,
      "amount_grams": 1,
      "is_optional": false,
      "note": null,
      "sort_order": 7
    },
    {
      "id": "de000007-0000-4000-8000-0000000000b6",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "product_id": "de000003-0000-4000-8000-00000000002d",
      "pinned_variant_id": "de000004-0000-4000-8000-000000000035",
      "amount_grams": 85,
      "is_optional": false,
      "note": null,
      "sort_order": 8
    }
  ],
  "cook_logs": [
    {
      "id": "de000008-0000-4000-8000-000000000001",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "cooked_at": "2026-08-02",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-08-05",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1475,
            "protein": 123.46000000000001,
            "fat": 65.65,
            "carbs": 98.13
          },
          "per100g": {
            "kcal": 171.51162790697674,
            "protein": 14.355813953488372,
            "fat": 7.633720930232559,
            "carbs": 11.41046511627907
          },
          "perServing": {
            "kcal": 245.83333333333334,
            "protein": 20.576666666666668,
            "fat": 10.941666666666668,
            "carbs": 16.355
          },
          "basis": "yield",
          "rawWeightGrams": 870,
          "yieldGrams": 860,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000002",
            "productName": "Cottage cheese",
            "variantId": "de000004-0000-4000-8000-000000000004",
            "variantName": "Quiet Creek 5%",
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000027",
            "productName": "Semolina",
            "variantId": "de000004-0000-4000-8000-00000000002d",
            "variantName": null,
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000007",
            "productName": "Sour cream 15%",
            "variantId": "de000004-0000-4000-8000-00000000000b",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000036",
            "productName": "Raisins",
            "variantId": "de000004-0000-4000-8000-000000000040",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-02T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000002",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "cooked_at": "2026-08-04",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-08-06",
      "rating": 5,
      "note": "With honey and sour cream",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1383.1499999999999,
            "protein": 98.725,
            "fat": 67.19,
            "carbs": 90.455
          },
          "per100g": {
            "kcal": 204.60798816568047,
            "protein": 14.604289940828401,
            "fat": 9.939349112426035,
            "carbs": 13.380917159763314
          },
          "perServing": {
            "kcal": 461.04999999999995,
            "protein": 32.90833333333333,
            "fat": 22.396666666666665,
            "carbs": 30.151666666666667
          },
          "basis": "rawWeight",
          "rawWeightGrams": 676,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 3,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000002",
            "productName": "Cottage cheese",
            "variantId": "de000004-0000-4000-8000-000000000005",
            "variantName": "Quiet Creek 9%",
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 55,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-04T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000003",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "cooked_at": "2026-08-09",
      "multiplier": 1,
      "actual_yield_grams": 1880,
      "containers": 4,
      "finished_at": "2026-08-12",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 3213.3600000000006,
            "protein": 175.33800000000002,
            "fat": 112.622,
            "carbs": 376.68600000000004
          },
          "per100g": {
            "kcal": 169.1242105263158,
            "protein": 9.228315789473687,
            "fat": 5.9274736842105265,
            "carbs": 19.82557894736842
          },
          "perServing": {
            "kcal": 535.5600000000001,
            "protein": 29.223000000000003,
            "fat": 18.770333333333333,
            "carbs": 62.781000000000006
          },
          "basis": "yield",
          "rawWeightGrams": 1822,
          "yieldGrams": 1900,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000d",
            "productName": "Skinless chicken thighs",
            "variantId": "de000004-0000-4000-8000-000000000012",
            "variantName": null,
            "amountGrams": 700,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000024",
            "productName": "Rice",
            "variantId": "de000004-0000-4000-8000-00000000002a",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 350,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 250,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003d",
            "productName": "Ground cumin",
            "variantId": "de000004-0000-4000-8000-000000000047",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-08-09T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000004",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "cooked_at": "2026-08-11",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-08-11",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 448.4,
            "protein": 14.280000000000001,
            "fat": 16.47,
            "carbs": 60.765
          },
          "per100g": {
            "kcal": 142.34920634920633,
            "protein": 4.533333333333333,
            "fat": 5.228571428571429,
            "carbs": 19.29047619047619
          },
          "perServing": {
            "kcal": 448.4,
            "protein": 14.280000000000001,
            "fat": 16.47,
            "carbs": 60.765
          },
          "basis": "rawWeight",
          "rawWeightGrams": 315,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 1,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000026",
            "productName": "Rolled oats",
            "variantId": "de000004-0000-4000-8000-00000000002c",
            "variantName": null,
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000001",
            "productName": "Milk",
            "variantId": "de000004-0000-4000-8000-000000000002",
            "variantName": "Meadow 2.5%",
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001f",
            "productName": "Banana",
            "variantId": "de000004-0000-4000-8000-000000000025",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000034",
            "productName": "Walnuts",
            "variantId": "de000004-0000-4000-8000-00000000003e",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000035",
            "productName": "Almonds",
            "variantId": "de000004-0000-4000-8000-00000000003f",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-11T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000005",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "cooked_at": "2026-08-14",
      "multiplier": 1,
      "actual_yield_grams": 3250,
      "containers": 6,
      "finished_at": "2026-08-20",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1860.5900000000001,
            "protein": 118.60499999999999,
            "fat": 94.512,
            "carbs": 136.975
          },
          "per100g": {
            "kcal": 56.38151515151516,
            "protein": 3.594090909090909,
            "fat": 2.864,
            "carbs": 4.150757575757575
          },
          "perServing": {
            "kcal": 232.57375000000002,
            "protein": 14.825624999999999,
            "fat": 11.814,
            "carbs": 17.121875
          },
          "basis": "yield",
          "rawWeightGrams": 1852,
          "yieldGrams": 3300,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000010",
            "productName": "Beef shoulder",
            "variantId": "de000004-0000-4000-8000-000000000016",
            "variantName": null,
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000017",
            "productName": "Beetroot",
            "variantId": "de000004-0000-4000-8000-00000000001d",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000016",
            "productName": "White cabbage",
            "variantId": "de000004-0000-4000-8000-00000000001c",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000012",
            "productName": "Potatoes",
            "variantId": "de000004-0000-4000-8000-000000000018",
            "variantName": null,
            "amountGrams": 350,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002e",
            "productName": "Tomato paste",
            "variantId": "de000004-0000-4000-8000-000000000038",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003e",
            "productName": "Bay leaf",
            "variantId": "de000004-0000-4000-8000-000000000048",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 160,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-14T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000006",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "cooked_at": "2026-08-16",
      "multiplier": 1,
      "actual_yield_grams": 1450,
      "containers": 3,
      "finished_at": "2026-08-18",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2539.36,
            "protein": 112.42000000000002,
            "fat": 109.716,
            "carbs": 269.788
          },
          "per100g": {
            "kcal": 175.128275862069,
            "protein": 7.753103448275864,
            "fat": 7.566620689655172,
            "carbs": 18.60606896551724
          },
          "perServing": {
            "kcal": 634.84,
            "protein": 28.105000000000004,
            "fat": 27.429,
            "carbs": 67.447
          },
          "basis": "yield",
          "rawWeightGrams": 1425,
          "yieldGrams": 1450,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 4,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000028",
            "productName": "Pasta",
            "variantId": "de000004-0000-4000-8000-00000000002e",
            "variantName": "Spaghetti",
            "amountGrams": 320,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000e",
            "productName": "Ground beef",
            "variantId": "de000004-0000-4000-8000-000000000013",
            "variantName": "Regular",
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002f",
            "productName": "Canned tomatoes",
            "variantId": "de000004-0000-4000-8000-000000000039",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002e",
            "productName": "Tomato paste",
            "variantId": "de000004-0000-4000-8000-000000000038",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 120,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 12,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000036",
            "variantName": "Olive",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000040",
            "productName": "Dried oregano",
            "variantId": "de000004-0000-4000-8000-00000000004a",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 6,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000a",
            "productName": "Hard cheese",
            "variantId": "de000004-0000-4000-8000-00000000000f",
            "variantName": "Parmesan",
            "amountGrams": 40,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-16T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000007",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "cooked_at": "2026-08-17",
      "multiplier": 1,
      "actual_yield_grams": 930,
      "containers": null,
      "finished_at": "2026-08-19",
      "rating": 5,
      "note": "Apples from the country house",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1801.7,
            "protein": 45.839999999999996,
            "fat": 37.599999999999994,
            "carbs": 313.46999999999997
          },
          "per100g": {
            "kcal": 189.6526315789474,
            "protein": 4.825263157894737,
            "fat": 3.9578947368421047,
            "carbs": 32.996842105263156
          },
          "perServing": {
            "kcal": 225.2125,
            "protein": 5.7299999999999995,
            "fat": 4.699999999999999,
            "carbs": 39.183749999999996
          },
          "basis": "yield",
          "rawWeightGrams": 1130,
          "yieldGrams": 950,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000020",
            "productName": "Apples",
            "variantId": "de000004-0000-4000-8000-000000000026",
            "variantName": null,
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 220,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-17T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000008",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "cooked_at": "2026-08-23",
      "multiplier": 1.5,
      "actual_yield_grams": 1420,
      "containers": 6,
      "finished_at": "2026-09-01",
      "rating": 4,
      "note": "Froze half",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1666.9600000000003,
            "protein": 183.644,
            "fat": 68.653,
            "carbs": 79.41
          },
          "per100g": {
            "kcal": 175.46947368421056,
            "protein": 19.330947368421054,
            "fat": 7.226631578947369,
            "carbs": 8.358947368421052
          },
          "perServing": {
            "kcal": 208.37000000000003,
            "protein": 22.9555,
            "fat": 8.581625,
            "carbs": 9.92625
          },
          "basis": "yield",
          "rawWeightGrams": 1089,
          "yieldGrams": 950,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000c",
            "productName": "Chicken breast fillet",
            "variantId": "de000004-0000-4000-8000-000000000011",
            "variantName": null,
            "amountGrams": 700,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 55,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002b",
            "productName": "Breadcrumbs",
            "variantId": "de000004-0000-4000-8000-000000000033",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-08-23T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000009",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "cooked_at": "2026-08-26",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-08-28",
      "rating": 3,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1009.0600000000001,
            "protein": 40.924,
            "fat": 34.688,
            "carbs": 143.14
          },
          "per100g": {
            "kcal": 138.227397260274,
            "protein": 5.6060273972602745,
            "fat": 4.751780821917809,
            "carbs": 19.60821917808219
          },
          "perServing": {
            "kcal": 336.35333333333335,
            "protein": 13.641333333333334,
            "fat": 11.562666666666667,
            "carbs": 47.71333333333333
          },
          "basis": "rawWeight",
          "rawWeightGrams": 730,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 3,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000025",
            "productName": "Buckwheat",
            "variantId": "de000004-0000-4000-8000-00000000002b",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001e",
            "productName": "Button mushrooms",
            "variantId": "de000004-0000-4000-8000-000000000024",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 120,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 4,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-08-26T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000000a",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "cooked_at": "2026-08-30",
      "multiplier": 1,
      "actual_yield_grams": 2250,
      "containers": 7,
      "finished_at": "2026-09-08",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2825.68,
            "protein": 133.31,
            "fat": 179.454,
            "carbs": 164.53
          },
          "per100g": {
            "kcal": 122.85565217391303,
            "protein": 5.796086956521739,
            "fat": 7.802347826086957,
            "carbs": 7.153478260869566
          },
          "perServing": {
            "kcal": 353.21,
            "protein": 16.66375,
            "fat": 22.43175,
            "carbs": 20.56625
          },
          "basis": "yield",
          "rawWeightGrams": 2106,
          "yieldGrams": 2300,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000016",
            "productName": "White cabbage",
            "variantId": "de000004-0000-4000-8000-00000000001c",
            "variantName": null,
            "amountGrams": 900,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000f",
            "productName": "Homemade ground meat",
            "variantId": "de000004-0000-4000-8000-000000000015",
            "variantName": null,
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000024",
            "productName": "Rice",
            "variantId": "de000004-0000-4000-8000-00000000002a",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002e",
            "productName": "Tomato paste",
            "variantId": "de000004-0000-4000-8000-000000000038",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003e",
            "productName": "Bay leaf",
            "variantId": "de000004-0000-4000-8000-000000000048",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 12,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-08-30T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000000b",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "cooked_at": "2026-09-02",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-09-04",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1383.1499999999999,
            "protein": 98.725,
            "fat": 67.19,
            "carbs": 90.455
          },
          "per100g": {
            "kcal": 204.60798816568047,
            "protein": 14.604289940828401,
            "fat": 9.939349112426035,
            "carbs": 13.380917159763314
          },
          "perServing": {
            "kcal": 461.04999999999995,
            "protein": 32.90833333333333,
            "fat": 22.396666666666665,
            "carbs": 30.151666666666667
          },
          "basis": "rawWeight",
          "rawWeightGrams": 676,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 3,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000002",
            "productName": "Cottage cheese",
            "variantId": "de000004-0000-4000-8000-000000000005",
            "variantName": "Quiet Creek 9%",
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 55,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-02T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000000c",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "cooked_at": "2026-09-05",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-09-07",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2014.8400000000001,
            "protein": 178.243,
            "fat": 76.88400000000001,
            "carbs": 143.285
          },
          "per100g": {
            "kcal": 92.93542435424355,
            "protein": 8.221540590405905,
            "fat": 3.5463099630996315,
            "carbs": 6.609086715867159
          },
          "perServing": {
            "kcal": 503.71000000000004,
            "protein": 44.56075,
            "fat": 19.221000000000004,
            "carbs": 35.82125
          },
          "basis": "rawWeight",
          "rawWeightGrams": 2168,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 4,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000d",
            "productName": "Skinless chicken thighs",
            "variantId": "de000004-0000-4000-8000-000000000012",
            "variantName": null,
            "amountGrams": 800,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000012",
            "productName": "Potatoes",
            "variantId": "de000004-0000-4000-8000-000000000018",
            "variantName": null,
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001d",
            "productName": "Zucchini",
            "variantId": "de000004-0000-4000-8000-000000000023",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001a",
            "productName": "Bell pepper",
            "variantId": "de000004-0000-4000-8000-000000000020",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003c",
            "productName": "Ground paprika",
            "variantId": "de000004-0000-4000-8000-000000000046",
            "variantName": null,
            "amountGrams": 4,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000023",
            "productName": "Parsley",
            "variantId": "de000004-0000-4000-8000-000000000029",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-05T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000000d",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "cooked_at": "2026-09-07",
      "multiplier": 1.5,
      "actual_yield_grams": 2850,
      "containers": 8,
      "finished_at": "2026-09-19",
      "rating": 5,
      "note": "Spicier than usual: the adjika turned out fiery",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1885.26,
            "protein": 156.469,
            "fat": 88.34899999999999,
            "carbs": 113.96399999999998
          },
          "per100g": {
            "kcal": 99.22421052631579,
            "protein": 8.23521052631579,
            "fat": 4.649947368421052,
            "carbs": 5.998105263157894
          },
          "perServing": {
            "kcal": 314.21,
            "protein": 26.078166666666664,
            "fat": 14.724833333333331,
            "carbs": 18.993999999999996
          },
          "basis": "yield",
          "rawWeightGrams": 1773,
          "yieldGrams": 1900,
          "overriddenFields": [],
          "incompleteProducts": [
            {
              "productId": "de000003-0000-4000-8000-000000000041",
              "productName": "Homemade adjika"
            }
          ]
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000e",
            "productName": "Ground beef",
            "variantId": "de000004-0000-4000-8000-000000000014",
            "variantName": "Lean",
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000030",
            "productName": "Canned kidney beans",
            "variantId": "de000004-0000-4000-8000-00000000003a",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002f",
            "productName": "Canned tomatoes",
            "variantId": "de000004-0000-4000-8000-000000000039",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001a",
            "productName": "Bell pepper",
            "variantId": "de000004-0000-4000-8000-000000000020",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 12,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003c",
            "productName": "Ground paprika",
            "variantId": "de000004-0000-4000-8000-000000000046",
            "variantName": null,
            "amountGrams": 5,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003d",
            "productName": "Ground cumin",
            "variantId": "de000004-0000-4000-8000-000000000047",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000041",
            "productName": "Homemade adjika",
            "variantId": "de000004-0000-4000-8000-00000000004b",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-09-07T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000000e",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "cooked_at": "2026-09-10",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-09-11",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 878.1899999999999,
            "protein": 69.254,
            "fat": 57.073,
            "carbs": 23.434
          },
          "per100g": {
            "kcal": 132.05864661654135,
            "protein": 10.414135338345867,
            "fat": 8.582406015037595,
            "carbs": 3.52390977443609
          },
          "perServing": {
            "kcal": 439.09499999999997,
            "protein": 34.627,
            "fat": 28.5365,
            "carbs": 11.717
          },
          "basis": "rawWeight",
          "rawWeightGrams": 665,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 2,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000011",
            "productName": "Salmon",
            "variantId": "de000004-0000-4000-8000-000000000017",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001b",
            "productName": "Broccoli",
            "variantId": "de000004-0000-4000-8000-000000000021",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000021",
            "productName": "Lemon",
            "variantId": "de000004-0000-4000-8000-000000000027",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000036",
            "variantName": "Olive",
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 6,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-10T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000000f",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "cooked_at": "2026-09-13",
      "multiplier": 2,
      "actual_yield_grams": 3800,
      "containers": 8,
      "finished_at": "2026-09-20",
      "rating": 5,
      "note": "For guests",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 3213.3600000000006,
            "protein": 175.33800000000002,
            "fat": 112.622,
            "carbs": 376.68600000000004
          },
          "per100g": {
            "kcal": 169.1242105263158,
            "protein": 9.228315789473687,
            "fat": 5.9274736842105265,
            "carbs": 19.82557894736842
          },
          "perServing": {
            "kcal": 535.5600000000001,
            "protein": 29.223000000000003,
            "fat": 18.770333333333333,
            "carbs": 62.781000000000006
          },
          "basis": "yield",
          "rawWeightGrams": 1822,
          "yieldGrams": 1900,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000d",
            "productName": "Skinless chicken thighs",
            "variantId": "de000004-0000-4000-8000-000000000012",
            "variantName": null,
            "amountGrams": 700,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000024",
            "productName": "Rice",
            "variantId": "de000004-0000-4000-8000-00000000002a",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 350,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 250,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003d",
            "productName": "Ground cumin",
            "variantId": "de000004-0000-4000-8000-000000000047",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-09-13T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000010",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "cooked_at": "2026-09-15",
      "multiplier": 1,
      "actual_yield_grams": 760,
      "containers": null,
      "finished_at": "2026-09-19",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2274.84,
            "protein": 43.21,
            "fat": 83.094,
            "carbs": 336.702
          },
          "per100g": {
            "kcal": 291.6461538461538,
            "protein": 5.53974358974359,
            "fat": 10.653076923076922,
            "carbs": 43.16692307692308
          },
          "perServing": {
            "kcal": 227.484,
            "protein": 4.321,
            "fat": 8.3094,
            "carbs": 33.6702
          },
          "basis": "yield",
          "rawWeightGrams": 913,
          "yieldGrams": 780,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 10,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000001f",
            "productName": "Banana",
            "variantId": "de000004-0000-4000-8000-000000000025",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 220,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000032",
            "variantName": "Cane",
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000034",
            "productName": "Walnuts",
            "variantId": "de000004-0000-4000-8000-00000000003e",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-15T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000011",
      "recipe_id": "de000005-0000-4000-8000-00000000000c",
      "cooked_at": "2026-09-17",
      "multiplier": 1,
      "actual_yield_grams": 2450,
      "containers": 4,
      "finished_at": "2026-09-22",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1391.89,
            "protein": 118.04,
            "fat": 38.022000000000006,
            "carbs": 138.67
          },
          "per100g": {
            "kcal": 55.6756,
            "protein": 4.7216000000000005,
            "fat": 1.5208800000000002,
            "carbs": 5.546799999999999
          },
          "perServing": {
            "kcal": 231.98166666666668,
            "protein": 19.673333333333336,
            "fat": 6.337000000000001,
            "carbs": 23.111666666666665
          },
          "basis": "yield",
          "rawWeightGrams": 1147,
          "yieldGrams": 2500,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000d",
            "productName": "Skinless chicken thighs",
            "variantId": "de000004-0000-4000-8000-000000000012",
            "variantName": null,
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000012",
            "productName": "Potatoes",
            "variantId": "de000004-0000-4000-8000-000000000018",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 120,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000028",
            "productName": "Pasta",
            "variantId": "de000004-0000-4000-8000-00000000002f",
            "variantName": "Thin vermicelli",
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003e",
            "productName": "Bay leaf",
            "variantId": "de000004-0000-4000-8000-000000000048",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000023",
            "productName": "Parsley",
            "variantId": "de000004-0000-4000-8000-000000000029",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-17T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000012",
      "recipe_id": "de000005-0000-4000-8000-00000000000b",
      "cooked_at": "2026-09-20",
      "multiplier": 2,
      "actual_yield_grams": 6400,
      "containers": 12,
      "finished_at": "2026-10-03",
      "rating": 5,
      "note": "Partly frozen",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1860.5900000000001,
            "protein": 118.60499999999999,
            "fat": 94.512,
            "carbs": 136.975
          },
          "per100g": {
            "kcal": 56.38151515151516,
            "protein": 3.594090909090909,
            "fat": 2.864,
            "carbs": 4.150757575757575
          },
          "perServing": {
            "kcal": 232.57375000000002,
            "protein": 14.825624999999999,
            "fat": 11.814,
            "carbs": 17.121875
          },
          "basis": "yield",
          "rawWeightGrams": 1852,
          "yieldGrams": 3300,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000010",
            "productName": "Beef shoulder",
            "variantId": "de000004-0000-4000-8000-000000000016",
            "variantName": null,
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000017",
            "productName": "Beetroot",
            "variantId": "de000004-0000-4000-8000-00000000001d",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000016",
            "productName": "White cabbage",
            "variantId": "de000004-0000-4000-8000-00000000001c",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000012",
            "productName": "Potatoes",
            "variantId": "de000004-0000-4000-8000-000000000018",
            "variantName": null,
            "amountGrams": 350,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002e",
            "productName": "Tomato paste",
            "variantId": "de000004-0000-4000-8000-000000000038",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003e",
            "productName": "Bay leaf",
            "variantId": "de000004-0000-4000-8000-000000000048",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 160,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-20T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000013",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "cooked_at": "2026-09-22",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-09-22",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 448.4,
            "protein": 14.280000000000001,
            "fat": 16.47,
            "carbs": 60.765
          },
          "per100g": {
            "kcal": 142.34920634920633,
            "protein": 4.533333333333333,
            "fat": 5.228571428571429,
            "carbs": 19.29047619047619
          },
          "perServing": {
            "kcal": 448.4,
            "protein": 14.280000000000001,
            "fat": 16.47,
            "carbs": 60.765
          },
          "basis": "rawWeight",
          "rawWeightGrams": 315,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 1,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000026",
            "productName": "Rolled oats",
            "variantId": "de000004-0000-4000-8000-00000000002c",
            "variantName": null,
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000001",
            "productName": "Milk",
            "variantId": "de000004-0000-4000-8000-000000000002",
            "variantName": "Meadow 2.5%",
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001f",
            "productName": "Banana",
            "variantId": "de000004-0000-4000-8000-000000000025",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000034",
            "productName": "Walnuts",
            "variantId": "de000004-0000-4000-8000-00000000003e",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000035",
            "productName": "Almonds",
            "variantId": "de000004-0000-4000-8000-00000000003f",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-22T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000014",
      "recipe_id": "de000005-0000-4000-8000-00000000000d",
      "cooked_at": "2026-09-26",
      "multiplier": 1,
      "actual_yield_grams": 1880,
      "containers": 3,
      "finished_at": "2026-09-29",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 732.11,
            "protein": 19.404000000000003,
            "fat": 33.233000000000004,
            "carbs": 91.90000000000002
          },
          "per100g": {
            "kcal": 48.80733333333333,
            "protein": 1.2936000000000003,
            "fat": 2.2155333333333336,
            "carbs": 6.126666666666668
          },
          "perServing": {
            "kcal": 183.0275,
            "protein": 4.851000000000001,
            "fat": 8.308250000000001,
            "carbs": 22.975000000000005
          },
          "basis": "yield",
          "rawWeightGrams": 1377,
          "yieldGrams": 1500,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 4,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000001c",
            "productName": "Pumpkin",
            "variantId": "de000004-0000-4000-8000-000000000022",
            "variantName": null,
            "amountGrams": 800,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000012",
            "productName": "Potatoes",
            "variantId": "de000004-0000-4000-8000-000000000018",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000005",
            "productName": "Cream 10%",
            "variantId": "de000004-0000-4000-8000-000000000009",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 6,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-09-26T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000015",
      "recipe_id": "de000005-0000-4000-8000-000000000006",
      "cooked_at": "2026-09-28",
      "multiplier": 1,
      "actual_yield_grams": 1500,
      "containers": 3,
      "finished_at": "2026-09-30",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2539.36,
            "protein": 112.42000000000002,
            "fat": 109.716,
            "carbs": 269.788
          },
          "per100g": {
            "kcal": 175.128275862069,
            "protein": 7.753103448275864,
            "fat": 7.566620689655172,
            "carbs": 18.60606896551724
          },
          "perServing": {
            "kcal": 634.84,
            "protein": 28.105000000000004,
            "fat": 27.429,
            "carbs": 67.447
          },
          "basis": "yield",
          "rawWeightGrams": 1425,
          "yieldGrams": 1450,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 4,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000028",
            "productName": "Pasta",
            "variantId": "de000004-0000-4000-8000-00000000002e",
            "variantName": "Spaghetti",
            "amountGrams": 320,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000e",
            "productName": "Ground beef",
            "variantId": "de000004-0000-4000-8000-000000000013",
            "variantName": "Regular",
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002f",
            "productName": "Canned tomatoes",
            "variantId": "de000004-0000-4000-8000-000000000039",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002e",
            "productName": "Tomato paste",
            "variantId": "de000004-0000-4000-8000-000000000038",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 120,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 12,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000036",
            "variantName": "Olive",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000040",
            "productName": "Dried oregano",
            "variantId": "de000004-0000-4000-8000-00000000004a",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 6,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000a",
            "productName": "Hard cheese",
            "variantId": "de000004-0000-4000-8000-00000000000f",
            "variantName": "Parmesan",
            "amountGrams": 40,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-09-28T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000016",
      "recipe_id": "de000005-0000-4000-8000-00000000000e",
      "cooked_at": "2026-10-01",
      "multiplier": 1,
      "actual_yield_grams": 900,
      "containers": null,
      "finished_at": "2026-10-03",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1801.7,
            "protein": 45.839999999999996,
            "fat": 37.599999999999994,
            "carbs": 313.46999999999997
          },
          "per100g": {
            "kcal": 189.6526315789474,
            "protein": 4.825263157894737,
            "fat": 3.9578947368421047,
            "carbs": 32.996842105263156
          },
          "perServing": {
            "kcal": 225.2125,
            "protein": 5.7299999999999995,
            "fat": 4.699999999999999,
            "carbs": 39.183749999999996
          },
          "basis": "yield",
          "rawWeightGrams": 1130,
          "yieldGrams": 950,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000020",
            "productName": "Apples",
            "variantId": "de000004-0000-4000-8000-000000000026",
            "variantName": null,
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 220,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-01T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000017",
      "recipe_id": "de000005-0000-4000-8000-000000000003",
      "cooked_at": "2026-10-03",
      "multiplier": 1,
      "actual_yield_grams": 850,
      "containers": null,
      "finished_at": "2026-10-07",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1475,
            "protein": 123.46000000000001,
            "fat": 65.65,
            "carbs": 98.13
          },
          "per100g": {
            "kcal": 171.51162790697674,
            "protein": 14.355813953488372,
            "fat": 7.633720930232559,
            "carbs": 11.41046511627907
          },
          "perServing": {
            "kcal": 245.83333333333334,
            "protein": 20.576666666666668,
            "fat": 10.941666666666668,
            "carbs": 16.355
          },
          "basis": "yield",
          "rawWeightGrams": 870,
          "yieldGrams": 860,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000002",
            "productName": "Cottage cheese",
            "variantId": "de000004-0000-4000-8000-000000000004",
            "variantName": "Quiet Creek 5%",
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000027",
            "productName": "Semolina",
            "variantId": "de000004-0000-4000-8000-00000000002d",
            "variantName": null,
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000007",
            "productName": "Sour cream 15%",
            "variantId": "de000004-0000-4000-8000-00000000000b",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000036",
            "productName": "Raisins",
            "variantId": "de000004-0000-4000-8000-000000000040",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-03T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000018",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "cooked_at": "2026-09-29",
      "multiplier": 1,
      "actual_yield_grams": 530,
      "containers": null,
      "finished_at": "2026-10-03",
      "rating": 5,
      "note": "Crisp at the edges, soft inside",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2262.4500000000003,
            "protein": 33.565,
            "fat": 77.912,
            "carbs": 356.59200000000004
          },
          "per100g": {
            "kcal": 418.9722222222223,
            "protein": 6.21574074074074,
            "fat": 14.428148148148148,
            "carbs": 66.03555555555556
          },
          "perServing": {
            "kcal": 141.40312500000002,
            "protein": 2.0978125,
            "fat": 4.8695,
            "carbs": 22.287000000000003
          },
          "basis": "yield",
          "rawWeightGrams": 612,
          "yieldGrams": 540,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 16,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000026",
            "productName": "Rolled oats",
            "variantId": "de000004-0000-4000-8000-00000000002c",
            "variantName": null,
            "amountGrams": 170,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 140,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000036",
            "productName": "Raisins",
            "variantId": "de000004-0000-4000-8000-000000000040",
            "variantName": null,
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000039",
            "productName": "Vanilla sugar",
            "variantId": "de000004-0000-4000-8000-000000000043",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003a",
            "productName": "Baking powder",
            "variantId": "de000004-0000-4000-8000-000000000044",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000038",
            "productName": "Water",
            "variantId": "de000004-0000-4000-8000-000000000042",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-09-29T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000019",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "cooked_at": "2026-10-04",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-10-05",
      "rating": 5,
      "note": "For a weekend breakfast",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2438.88,
            "protein": 59.37,
            "fat": 116.86500000000001,
            "carbs": 281.147
          },
          "per100g": {
            "kcal": 157.39787028073573,
            "protein": 3.831558567279768,
            "fat": 7.542110358180058,
            "carbs": 18.14436915133914
          },
          "perServing": {
            "kcal": 487.776,
            "protein": 11.873999999999999,
            "fat": 23.373,
            "carbs": 56.2294
          },
          "basis": "rawWeight",
          "rawWeightGrams": 1549.5,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 5,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000038",
            "productName": "Water",
            "variantId": "de000004-0000-4000-8000-000000000042",
            "variantName": null,
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000001",
            "productName": "Milk",
            "variantId": "de000004-0000-4000-8000-000000000001",
            "variantName": "Meadow 3.2%",
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 3.5,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003a",
            "productName": "Baking powder",
            "variantId": "de000004-0000-4000-8000-000000000044",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 85,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-04T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000001a",
      "recipe_id": "de000005-0000-4000-8000-000000000009",
      "cooked_at": "2026-10-05",
      "multiplier": 1,
      "actual_yield_grams": 940,
      "containers": 4,
      "finished_at": "2026-10-12",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1666.9600000000003,
            "protein": 183.644,
            "fat": 68.653,
            "carbs": 79.41
          },
          "per100g": {
            "kcal": 175.46947368421056,
            "protein": 19.330947368421054,
            "fat": 7.226631578947369,
            "carbs": 8.358947368421052
          },
          "perServing": {
            "kcal": 208.37000000000003,
            "protein": 22.9555,
            "fat": 8.581625,
            "carbs": 9.92625
          },
          "basis": "yield",
          "rawWeightGrams": 1089,
          "yieldGrams": 950,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000c",
            "productName": "Chicken breast fillet",
            "variantId": "de000004-0000-4000-8000-000000000011",
            "variantName": null,
            "amountGrams": 700,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 55,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002b",
            "productName": "Breadcrumbs",
            "variantId": "de000004-0000-4000-8000-000000000033",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-05T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000001b",
      "recipe_id": "de000005-0000-4000-8000-000000000011",
      "cooked_at": "2026-10-06",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-10-07",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 659.15,
            "protein": 22.33,
            "fat": 48.143,
            "carbs": 35.089999999999996
          },
          "per100g": {
            "kcal": 79.22475961538461,
            "protein": 2.683894230769231,
            "fat": 5.786418269230769,
            "carbs": 4.217548076923077
          },
          "perServing": {
            "kcal": 329.575,
            "protein": 11.165,
            "fat": 24.0715,
            "carbs": 17.544999999999998
          },
          "basis": "rawWeight",
          "rawWeightGrams": 832,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 2,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000019",
            "productName": "Cucumbers",
            "variantId": "de000004-0000-4000-8000-00000000001f",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000018",
            "productName": "Tomatoes",
            "variantId": "de000004-0000-4000-8000-00000000001e",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001a",
            "productName": "Bell pepper",
            "variantId": "de000004-0000-4000-8000-000000000020",
            "variantName": null,
            "amountGrams": 120,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000b",
            "productName": "Feta",
            "variantId": "de000004-0000-4000-8000-000000000010",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000031",
            "productName": "Olives",
            "variantId": "de000004-0000-4000-8000-00000000003b",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000036",
            "variantName": "Olive",
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000040",
            "productName": "Dried oregano",
            "variantId": "de000004-0000-4000-8000-00000000004a",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-06T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000001c",
      "recipe_id": "de000005-0000-4000-8000-000000000001",
      "cooked_at": "2026-10-08",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-10-10",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1383.1499999999999,
            "protein": 98.725,
            "fat": 67.19,
            "carbs": 90.455
          },
          "per100g": {
            "kcal": 204.60798816568047,
            "protein": 14.604289940828401,
            "fat": 9.939349112426035,
            "carbs": 13.380917159763314
          },
          "perServing": {
            "kcal": 461.04999999999995,
            "protein": 32.90833333333333,
            "fat": 22.396666666666665,
            "carbs": 30.151666666666667
          },
          "basis": "rawWeight",
          "rawWeightGrams": 676,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 3,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000002",
            "productName": "Cottage cheese",
            "variantId": "de000004-0000-4000-8000-000000000005",
            "variantName": "Quiet Creek 9%",
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 55,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-08T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000001d",
      "recipe_id": "de000005-0000-4000-8000-000000000013",
      "cooked_at": "2026-10-10",
      "multiplier": 1,
      "actual_yield_grams": 550,
      "containers": null,
      "finished_at": "2026-10-14",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2262.4500000000003,
            "protein": 33.565,
            "fat": 77.912,
            "carbs": 356.59200000000004
          },
          "per100g": {
            "kcal": 418.9722222222223,
            "protein": 6.21574074074074,
            "fat": 14.428148148148148,
            "carbs": 66.03555555555556
          },
          "perServing": {
            "kcal": 141.40312500000002,
            "protein": 2.0978125,
            "fat": 4.8695,
            "carbs": 22.287000000000003
          },
          "basis": "yield",
          "rawWeightGrams": 612,
          "yieldGrams": 540,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 16,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000026",
            "productName": "Rolled oats",
            "variantId": "de000004-0000-4000-8000-00000000002c",
            "variantName": null,
            "amountGrams": 170,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 140,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000036",
            "productName": "Raisins",
            "variantId": "de000004-0000-4000-8000-000000000040",
            "variantName": null,
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000039",
            "productName": "Vanilla sugar",
            "variantId": "de000004-0000-4000-8000-000000000043",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003a",
            "productName": "Baking powder",
            "variantId": "de000004-0000-4000-8000-000000000044",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000038",
            "productName": "Water",
            "variantId": "de000004-0000-4000-8000-000000000042",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-10T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000001e",
      "recipe_id": "de000005-0000-4000-8000-000000000008",
      "cooked_at": "2026-10-10",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-10-12",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2014.8400000000001,
            "protein": 178.243,
            "fat": 76.88400000000001,
            "carbs": 143.285
          },
          "per100g": {
            "kcal": 92.93542435424355,
            "protein": 8.221540590405905,
            "fat": 3.5463099630996315,
            "carbs": 6.609086715867159
          },
          "perServing": {
            "kcal": 503.71000000000004,
            "protein": 44.56075,
            "fat": 19.221000000000004,
            "carbs": 35.82125
          },
          "basis": "rawWeight",
          "rawWeightGrams": 2168,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 4,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000d",
            "productName": "Skinless chicken thighs",
            "variantId": "de000004-0000-4000-8000-000000000012",
            "variantName": null,
            "amountGrams": 800,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000012",
            "productName": "Potatoes",
            "variantId": "de000004-0000-4000-8000-000000000018",
            "variantName": null,
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001d",
            "productName": "Zucchini",
            "variantId": "de000004-0000-4000-8000-000000000023",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001a",
            "productName": "Bell pepper",
            "variantId": "de000004-0000-4000-8000-000000000020",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003c",
            "productName": "Ground paprika",
            "variantId": "de000004-0000-4000-8000-000000000046",
            "variantName": null,
            "amountGrams": 4,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000023",
            "productName": "Parsley",
            "variantId": "de000004-0000-4000-8000-000000000029",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-10T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-00000000001f",
      "recipe_id": "de000005-0000-4000-8000-000000000012",
      "cooked_at": "2026-10-11",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": 2,
      "finished_at": "2026-10-17",
      "rating": 4,
      "note": "Lasted almost a week",
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1373.2999999999997,
            "protein": 49.046,
            "fat": 78.556,
            "carbs": 130.11399999999998
          },
          "per100g": {
            "kcal": 238.42013888888883,
            "protein": 8.514930555555555,
            "fat": 13.638194444444443,
            "carbs": 22.58923611111111
          },
          "perServing": {
            "kcal": 228.8833333333333,
            "protein": 8.174333333333333,
            "fat": 13.092666666666666,
            "carbs": 21.685666666666663
          },
          "basis": "rawWeight",
          "rawWeightGrams": 576,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000002c",
            "productName": "Cooked chickpeas",
            "variantId": "de000004-0000-4000-8000-000000000034",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000032",
            "productName": "Tahini",
            "variantId": "de000004-0000-4000-8000-00000000003c",
            "variantName": null,
            "amountGrams": 70,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000021",
            "productName": "Lemon",
            "variantId": "de000004-0000-4000-8000-000000000027",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000036",
            "variantName": "Olive",
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003d",
            "productName": "Ground cumin",
            "variantId": "de000004-0000-4000-8000-000000000047",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 4,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-11T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000020",
      "recipe_id": "de000005-0000-4000-8000-00000000000f",
      "cooked_at": "2026-10-12",
      "multiplier": 1,
      "actual_yield_grams": 790,
      "containers": null,
      "finished_at": "2026-10-16",
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2274.84,
            "protein": 43.21,
            "fat": 83.094,
            "carbs": 336.702
          },
          "per100g": {
            "kcal": 291.6461538461538,
            "protein": 5.53974358974359,
            "fat": 10.653076923076922,
            "carbs": 43.16692307692308
          },
          "perServing": {
            "kcal": 227.484,
            "protein": 4.321,
            "fat": 8.3094,
            "carbs": 33.6702
          },
          "basis": "yield",
          "rawWeightGrams": 913,
          "yieldGrams": 780,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 10,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000001f",
            "productName": "Banana",
            "variantId": "de000004-0000-4000-8000-000000000025",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 220,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000032",
            "variantName": "Cane",
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000008",
            "productName": "Butter 82.5%",
            "variantId": "de000004-0000-4000-8000-00000000000c",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000034",
            "productName": "Walnuts",
            "variantId": "de000004-0000-4000-8000-00000000003e",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-12T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000021",
      "recipe_id": "de000005-0000-4000-8000-000000000005",
      "cooked_at": "2026-10-13",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": "2026-10-14",
      "rating": 4,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1009.0600000000001,
            "protein": 40.924,
            "fat": 34.688,
            "carbs": 143.14
          },
          "per100g": {
            "kcal": 138.227397260274,
            "protein": 5.6060273972602745,
            "fat": 4.751780821917809,
            "carbs": 19.60821917808219
          },
          "perServing": {
            "kcal": 336.35333333333335,
            "protein": 13.641333333333334,
            "fat": 11.562666666666667,
            "carbs": 47.71333333333333
          },
          "basis": "rawWeight",
          "rawWeightGrams": 730,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 3,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000025",
            "productName": "Buckwheat",
            "variantId": "de000004-0000-4000-8000-00000000002b",
            "variantName": null,
            "amountGrams": 200,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001e",
            "productName": "Button mushrooms",
            "variantId": "de000004-0000-4000-8000-000000000024",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 120,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 4,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-13T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000022",
      "recipe_id": "de000005-0000-4000-8000-000000000007",
      "cooked_at": "2026-10-14",
      "multiplier": 1,
      "actual_yield_grams": 2300,
      "containers": 8,
      "finished_at": null,
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2825.68,
            "protein": 133.31,
            "fat": 179.454,
            "carbs": 164.53
          },
          "per100g": {
            "kcal": 122.85565217391303,
            "protein": 5.796086956521739,
            "fat": 7.802347826086957,
            "carbs": 7.153478260869566
          },
          "perServing": {
            "kcal": 353.21,
            "protein": 16.66375,
            "fat": 22.43175,
            "carbs": 20.56625
          },
          "basis": "yield",
          "rawWeightGrams": 2106,
          "yieldGrams": 2300,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 8,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000016",
            "productName": "White cabbage",
            "variantId": "de000004-0000-4000-8000-00000000001c",
            "variantName": null,
            "amountGrams": 900,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000000f",
            "productName": "Homemade ground meat",
            "variantId": "de000004-0000-4000-8000-000000000015",
            "variantName": null,
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000024",
            "productName": "Rice",
            "variantId": "de000004-0000-4000-8000-00000000002a",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002e",
            "productName": "Tomato paste",
            "variantId": "de000004-0000-4000-8000-000000000038",
            "variantName": null,
            "amountGrams": 60,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000006",
            "productName": "Sour cream 20%",
            "variantId": "de000004-0000-4000-8000-00000000000a",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003e",
            "productName": "Bay leaf",
            "variantId": "de000004-0000-4000-8000-000000000048",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 12,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 2,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-14T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000023",
      "recipe_id": "de000005-0000-4000-8000-000000000010",
      "cooked_at": "2026-10-16",
      "multiplier": 1,
      "actual_yield_grams": 1880,
      "containers": 6,
      "finished_at": null,
      "rating": null,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 1885.26,
            "protein": 156.469,
            "fat": 88.34899999999999,
            "carbs": 113.96399999999998
          },
          "per100g": {
            "kcal": 99.22421052631579,
            "protein": 8.23521052631579,
            "fat": 4.649947368421052,
            "carbs": 5.998105263157894
          },
          "perServing": {
            "kcal": 314.21,
            "protein": 26.078166666666664,
            "fat": 14.724833333333331,
            "carbs": 18.993999999999996
          },
          "basis": "yield",
          "rawWeightGrams": 1773,
          "yieldGrams": 1900,
          "overriddenFields": [],
          "incompleteProducts": [
            {
              "productId": "de000003-0000-4000-8000-000000000041",
              "productName": "Homemade adjika"
            }
          ]
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000e",
            "productName": "Ground beef",
            "variantId": "de000004-0000-4000-8000-000000000014",
            "variantName": "Lean",
            "amountGrams": 600,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000030",
            "productName": "Canned kidney beans",
            "variantId": "de000004-0000-4000-8000-00000000003a",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002f",
            "productName": "Canned tomatoes",
            "variantId": "de000004-0000-4000-8000-000000000039",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001a",
            "productName": "Bell pepper",
            "variantId": "de000004-0000-4000-8000-000000000020",
            "variantName": null,
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 12,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 25,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003c",
            "productName": "Ground paprika",
            "variantId": "de000004-0000-4000-8000-000000000046",
            "variantName": null,
            "amountGrams": 5,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003d",
            "productName": "Ground cumin",
            "variantId": "de000004-0000-4000-8000-000000000047",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000041",
            "productName": "Homemade adjika",
            "variantId": "de000004-0000-4000-8000-00000000004b",
            "variantName": null,
            "amountGrams": 20,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-16T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000024",
      "recipe_id": "de000005-0000-4000-8000-00000000000a",
      "cooked_at": "2026-10-17",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": null,
      "rating": 5,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 878.1899999999999,
            "protein": 69.254,
            "fat": 57.073,
            "carbs": 23.434
          },
          "per100g": {
            "kcal": 132.05864661654135,
            "protein": 10.414135338345867,
            "fat": 8.582406015037595,
            "carbs": 3.52390977443609
          },
          "perServing": {
            "kcal": 439.09499999999997,
            "protein": 34.627,
            "fat": 28.5365,
            "carbs": 11.717
          },
          "basis": "rawWeight",
          "rawWeightGrams": 665,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 2,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000011",
            "productName": "Salmon",
            "variantId": "de000004-0000-4000-8000-000000000017",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001b",
            "productName": "Broccoli",
            "variantId": "de000004-0000-4000-8000-000000000021",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000021",
            "productName": "Lemon",
            "variantId": "de000004-0000-4000-8000-000000000027",
            "variantName": null,
            "amountGrams": 40,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000036",
            "variantName": "Olive",
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 6,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000022",
            "productName": "Dill",
            "variantId": "de000004-0000-4000-8000-000000000028",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-17T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000025",
      "recipe_id": "de000005-0000-4000-8000-000000000004",
      "cooked_at": "2026-10-18",
      "multiplier": 1,
      "actual_yield_grams": 1900,
      "containers": 4,
      "finished_at": null,
      "rating": null,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 3213.3600000000006,
            "protein": 175.33800000000002,
            "fat": 112.622,
            "carbs": 376.68600000000004
          },
          "per100g": {
            "kcal": 169.1242105263158,
            "protein": 9.228315789473687,
            "fat": 5.9274736842105265,
            "carbs": 19.82557894736842
          },
          "perServing": {
            "kcal": 535.5600000000001,
            "protein": 29.223000000000003,
            "fat": 18.770333333333333,
            "carbs": 62.781000000000006
          },
          "basis": "yield",
          "rawWeightGrams": 1822,
          "yieldGrams": 1900,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 6,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-00000000000d",
            "productName": "Skinless chicken thighs",
            "variantId": "de000004-0000-4000-8000-000000000012",
            "variantName": null,
            "amountGrams": 700,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000024",
            "productName": "Rice",
            "variantId": "de000004-0000-4000-8000-00000000002a",
            "variantName": null,
            "amountGrams": 400,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000013",
            "productName": "Carrots",
            "variantId": "de000004-0000-4000-8000-000000000019",
            "variantName": null,
            "amountGrams": 350,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000014",
            "productName": "Onion",
            "variantId": "de000004-0000-4000-8000-00000000001a",
            "variantName": null,
            "amountGrams": 250,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000015",
            "productName": "Garlic",
            "variantId": "de000004-0000-4000-8000-00000000001b",
            "variantName": null,
            "amountGrams": 30,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 80,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003d",
            "productName": "Ground cumin",
            "variantId": "de000004-0000-4000-8000-000000000047",
            "variantName": null,
            "amountGrams": 3,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 8,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003b",
            "productName": "Ground black pepper",
            "variantId": "de000004-0000-4000-8000-000000000045",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-18T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000026",
      "recipe_id": "de000005-0000-4000-8000-000000000002",
      "cooked_at": "2026-10-19",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": null,
      "rating": null,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 448.4,
            "protein": 14.280000000000001,
            "fat": 16.47,
            "carbs": 60.765
          },
          "per100g": {
            "kcal": 142.34920634920633,
            "protein": 4.533333333333333,
            "fat": 5.228571428571429,
            "carbs": 19.29047619047619
          },
          "perServing": {
            "kcal": 448.4,
            "protein": 14.280000000000001,
            "fat": 16.47,
            "carbs": 60.765
          },
          "basis": "rawWeight",
          "rawWeightGrams": 315,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 1,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000026",
            "productName": "Rolled oats",
            "variantId": "de000004-0000-4000-8000-00000000002c",
            "variantName": null,
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000001",
            "productName": "Milk",
            "variantId": "de000004-0000-4000-8000-000000000002",
            "variantName": "Meadow 2.5%",
            "amountGrams": 150,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000001f",
            "productName": "Banana",
            "variantId": "de000004-0000-4000-8000-000000000025",
            "variantName": null,
            "amountGrams": 100,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000034",
            "productName": "Walnuts",
            "variantId": "de000004-0000-4000-8000-00000000003e",
            "variantName": null,
            "amountGrams": 15,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000033",
            "productName": "Honey",
            "variantId": "de000004-0000-4000-8000-00000000003d",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003f",
            "productName": "Ground cinnamon",
            "variantId": "de000004-0000-4000-8000-000000000049",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": true
          },
          {
            "productId": "de000003-0000-4000-8000-000000000035",
            "productName": "Almonds",
            "variantId": "de000004-0000-4000-8000-00000000003f",
            "variantName": null,
            "amountGrams": 10,
            "isOptional": true
          }
        ]
      },
      "created_at": "2026-10-19T19:30:00.000000+00:00"
    },
    {
      "id": "de000008-0000-4000-8000-000000000027",
      "recipe_id": "de000005-0000-4000-8000-000000000014",
      "cooked_at": "2026-10-20",
      "multiplier": 1,
      "actual_yield_grams": null,
      "containers": null,
      "finished_at": null,
      "rating": null,
      "note": null,
      "snapshot": {
        "version": 1,
        "nutrition": {
          "total": {
            "kcal": 2438.88,
            "protein": 59.37,
            "fat": 116.86500000000001,
            "carbs": 281.147
          },
          "per100g": {
            "kcal": 157.39787028073573,
            "protein": 3.831558567279768,
            "fat": 7.542110358180058,
            "carbs": 18.14436915133914
          },
          "perServing": {
            "kcal": 487.776,
            "protein": 11.873999999999999,
            "fat": 23.373,
            "carbs": 56.2294
          },
          "basis": "rawWeight",
          "rawWeightGrams": 1549.5,
          "yieldGrams": null,
          "overriddenFields": [],
          "incompleteProducts": []
        },
        "servingsBase": 5,
        "ingredients": [
          {
            "productId": "de000003-0000-4000-8000-000000000038",
            "productName": "Water",
            "variantId": "de000004-0000-4000-8000-000000000042",
            "variantName": null,
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000001",
            "productName": "Milk",
            "variantId": "de000004-0000-4000-8000-000000000001",
            "variantName": "Meadow 3.2%",
            "amountGrams": 500,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000009",
            "productName": "Chicken egg",
            "variantId": "de000004-0000-4000-8000-00000000000d",
            "variantName": null,
            "amountGrams": 110,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002a",
            "productName": "Sugar",
            "variantId": "de000004-0000-4000-8000-000000000031",
            "variantName": "White",
            "amountGrams": 50,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000037",
            "productName": "Salt",
            "variantId": "de000004-0000-4000-8000-000000000041",
            "variantName": null,
            "amountGrams": 3.5,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-000000000029",
            "productName": "Wheat flour",
            "variantId": "de000004-0000-4000-8000-000000000030",
            "variantName": null,
            "amountGrams": 300,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000003a",
            "productName": "Baking powder",
            "variantId": "de000004-0000-4000-8000-000000000044",
            "variantName": null,
            "amountGrams": 1,
            "isOptional": false
          },
          {
            "productId": "de000003-0000-4000-8000-00000000002d",
            "productName": "Vegetable oil",
            "variantId": "de000004-0000-4000-8000-000000000035",
            "variantName": "Sunflower",
            "amountGrams": 85,
            "isOptional": false
          }
        ]
      },
      "created_at": "2026-10-20T19:30:00.000000+00:00"
    }
  ]
}$seed$::jsonb)
on conflict (id) do update set data = excluded.data, loaded_at = now();
