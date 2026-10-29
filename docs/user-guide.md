[Русский](user-guide.ru.md) · **English**

# How to use the app

Recipe Book is a phone app. It stores products with their nutrition (kcal, protein, fat, carbs) and recipes, calculates the nutrition of dishes by itself and keeps a log of what was cooked, when and how much. The interface is made for one hand and an iPhone screen; on a computer it opens as one narrow column.

## Installation and sign-in

The app opens in a browser, but it is more convenient on the home screen (Safari → "Share" → "Add to Home Screen"). Then it starts like a regular app, without the address bar.

Sign-in is by email and password. There is no registration in the app: the accounts are created in advance. The session is remembered, so there is no need to sign in again.

The data is loaded as a whole at start and stored on the phone. That is why search is instant and the recipes that were already opened are visible without a connection. Changes made without a connection are not saved: the app warns about the error.

## Navigation

There are four tabs at the bottom of the screen: **Recipes**, **Products**, **Log**, **Settings**. The "← Back" link on inner screens returns to where you came from, together with the search and the filters.

## Recipes

The main screen shows all recipes grouped by dish categories (the category names are your own, for example "Breakfasts" or "Soups").

- **Groups collapse** when you tap the heading; the app remembers which ones are collapsed. A recipe in several categories is visible in each of them, recipes without a category go into the last group ("Uncategorized").
- **A card in the list** shows the photo, the name, the cooking time, the calories per 100 g and a mark if the dish can be frozen.
- **Search** looks through the recipe names and the products in the composition: the query "chicken" also finds a recipe whose ingredients include chicken fillet. Letter case does not matter, and when the query has several words, all of them must be found.
- **Filters:** only freezable dishes and cooking time (up to 15, 30, 60 minutes or longer). The search and the filters are kept in the page address.
- The **"＋"** button in the lower right corner opens a new recipe.

## Recipe card

It opens when you tap a recipe in the list.

- **Nutrition** per 100 g, per serving and for the whole dish. If the yield of the cooked dish is set, the calculation uses it; otherwise it uses the raw weight, and the card warns about that.
- **Incomplete nutrition.** If a product has no calories or protein/fat/carbs filled in, it is left out of the total, and the card shows a warning and the list of such products. There are no silent zeros.
- **Values entered manually** are marked; the "Recalculate" button returns the calculation from the ingredients.
- **Ingredients** with grams, the "optional" marks and the pinned product variant; **steps**; **storage** (freezer, fridge); **video links**; **notes**.
- **Cooking history:** how many times it was cooked, when it was cooked last, the average yield and how many days it usually lasted.
- **"Log a cook"** adds an entry to the log (see below).
- **"Edit"** opens the editor.

## Recipe editor

The same screen is used for a new recipe and for editing.

- Name, time, number of servings, yield of the cooked dish in grams, notes, dish categories, photo.
- **The photo** is chosen from the gallery or taken with the camera and compressed on the phone before upload.
- **Ingredients.** A product is chosen by searching the product list. If there is no such product, it can be created right here with the "Create “…”" item. For each ingredient there are the grams, and in the menu: optional (not counted in nutrition), a specific product variant, a note such as "finely chopped".
- **Steps** and **ingredients** are reordered by dragging.
- **Nutrition is calculated at once**, while the ingredients are being entered: the bottom bar shows how much it comes to per 100 g and per serving.
- **Draft.** If you leave without saving, the app remembers what was entered and, the next time you open the editor, offers to restore the draft ("Restore draft") or to start over ("Start over").

## Products

The list of all products grouped by categories, with search by name. New products appear from the recipe editor, when they are added to the ingredients.

**Product variants.** One product can have several variants with different nutrition, for example cottage cheese of different brands. One variant is active: it is used for every recipe where the variant is not pinned explicitly. A variant with averaged numbers is marked ("averaged, should be replaced"): it is worth replacing with the data from the package.

**The product card** shows the nutrition per 100 g for each variant, lets you make another variant active ("Make active") and shows the recipes the product is used in. Changing the active variant immediately changes the nutrition of those recipes.

**Archiving.** A product can be moved to the archive ("Archive product"): it disappears from the product list and from the picker but stays in the recipes that already use it. There is no deletion in the app, neither for products nor for recipes.

## Log

The feed of all cooks, newest first, by months.

- **An entry** is made from the recipe card with the "Log a cook" button. By default it is today's date and one recipe (×1), so two taps are enough. Optionally: a multiplier (×2, ×3, ×4 or your own number), the actual yield in grams, the number of containers, a star rating, a note.
- **The nutrition in an entry** is fixed at the time of cooking. If the recipe or the product variant is changed later, the old entries keep their old numbers.
- **"Finished"** marks when the dish ran out: one tap for today, or "Other date" with a choice in the calendar. From these marks the recipe card calculates how many days it usually lasts.
- Tapping an entry opens the recipe.

## Settings

- **Export** — download a backup: all products, recipes, categories and the log in one JSON file ("Download backup"). Photos are not included in the file, only the links to them remain.
- **Import** — restore the database from such a file ("Choose file"). It works only on an empty database: if it already has products, recipes or log entries, the import refuses and changes nothing. A damaged or foreign file is rejected too, with an explanation and without a partial write.
- **Categories** of products and dishes: renaming and order (the "Up" and "Down" buttons). The order of the categories is the order of the groups in the lists.
- **Language** — the interface language, English or Русский. By default the app follows the browser language: a Russian browser gets the Russian interface, any other gets English. The choice made here is stored on the phone and replaces the automatic detection. Numbers and dates switch together with the language (`1,234.5` and `25 Oct 2026` in English, `1 234,5` and `25.10.2026` in Russian).
- **Sign out** — leave the account; the data stored on the phone is erased at that point.
