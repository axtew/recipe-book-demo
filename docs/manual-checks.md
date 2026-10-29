[Русский](manual-checks.ru.md) · **English**

# Manual checks before the v1 release

What the automated checks did not cover: the executors tested in a headless browser on a computer, not on an iPhone. Go through this once on the phone, **from the PWA installed on the home screen** — its behaviour differs from a Safari tab. If a problem is found, write it here under the item and say so in the session.

Drawn up on 2026-10-21 from the reports of Phases 8–12. Update it when a check is passed or a new one appears.

## 0. Before the checks — rollout

- [x] `npx supabase db push` — the two migrations of Phase 12: `20261021090000_backup_export_import.sql` and `20261021120000_reorder_categories.sql`. Without them export, import and category order do not work in the cloud.
- [x] Roll out the frontend (`DEPLOY.md` → "The regular rollout cycle").
- [x] **A trial export on production** right after the rollout. The export checks every row strictly; if some old record in the production database does not fit the schema, the export fails — better to learn that now.
- [ ] The rest of the `DEPLOY.md` checklist → "Checklist before the first release".

## 1. Installation, sign-in, general

- [ ] It installs on the home screen and opens without the address bar.
- [ ] The session survives closing the app, no new sign-in is needed.
- [ ] The tab bar is not covered by the system gesture bar or the keyboard.
- [ ] After the app is updated with an old cache (a `CACHE_BUSTER` change), the data loads again without errors.
- [ ] Without a connection: "Couldn’t load the data" → "Retry" with the connection back loads the data.

## 2. "Back" navigation

It works through the browser history; in an installed PWA its behaviour is the main thing to check.

- [ ] List with a search → recipe → "← Back": the search and the filters are in place.
- [ ] Recipe → "Edit" → save → "← Back" leads to the list, not to the previous card.
- [ ] New recipe → save → the card opened → "← Back" leads to the list.
- [ ] Product → "← Back"; log → recipe → "← Back" returns to the log.
- [ ] A recipe link opened anew (after restarting the PWA) — "← Back" leads to the list, not "nowhere".

## 3. Recipe list

- [ ] The "＋" button does not cover the last card and does not run onto the tab bar.
- [ ] The filter sheet looks fine and closes.
- [ ] Fast typing in the search: the field does not "roll back" the letters already typed.

## 4. Recipe editor

- [ ] Dragging ingredients and steps with a finger; the list does not scroll by itself meanwhile.
- [ ] Photo: choosing from the gallery and taking with the camera, compression, saving.
- [ ] Replacing the cover: after saving the new photo is shown at once, not the old one.
- [ ] Keyboard: "Done"/Enter in a single-line field hides the keyboard and does not submit the form; in the notes Enter inserts a line break.
- [ ] Fields do not zoom the page on focus (iOS zoom).
- [ ] Creating a product right from the ingredient picker: the sheet opens, the name is filled in from the search, the button is enabled.
- [ ] The draft prompt: start a recipe, leave without saving, come back — "Restore draft" and "Start over".

## 5. Recipe card

- [ ] A video link opens in an external app/browser.
- [ ] "Recalculate" (if the recipe has manually entered values).

## 6. Products

- [ ] "Make active" on a variant; the nutrition of the recipes with this product changes.
- [ ] Archiving a product: the confirmation sheet, the product is gone from the product list.

## 7. Log

- [ ] "Log a cook" in two taps.
- [ ] The calendar over the sheet: it opens, a day is picked with a finger, on a narrow screen it does not hit the edges in an inconvenient way.
- [ ] Entering "1,5" in the multiplier field by hand (the intermediate "1," may be reset).
- [ ] Stars and "Clear rating".
- [ ] "Finished" and "Other date": the sheet closes smoothly, without a cut-off animation.

## 8. Settings

- [ ] "Download backup": the file is saved on the iPhone (in "Files" or through the "Share" sheet), from the PWA too. If it does not download from the PWA — say so: the fallback is the Web Share API.
- [ ] Import: choosing a file opens "Files"; on a non-empty database — a clear refusal, nothing changes.
- [ ] Categories: renaming with the keyboard, "Up"/"Down", the order is kept.
- [ ] Language: the switcher changes the interface language at once, numbers and dates change with it, the choice survives a restart of the PWA.
- [ ] "Sign out" — the sign-in screen, signing in again loads the data.

## 9. Appearance after Phase 11.5

- [ ] The buttons in all sheets are the same, none is smaller than a finger.
- [ ] The fields have no ▲▼ arrows, numbers are entered from the numeric keyboard.
