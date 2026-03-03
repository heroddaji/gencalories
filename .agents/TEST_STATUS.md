# TEST STATUS

## Last run summary

- Date: **2026-03-03**
- Typecheck: **PASS** (`npm run typecheck`)
- Unit tests: **PASS** (`npm test`)
  - 5 test files passed
  - 14 tests passed
- Build: **PASS** (`npm run build`)
- OTA/provider tests: **NOT ADDED YET**

## Present test files

- `tests/unit/text.spec.ts`
- `tests/unit/suggestionRanking.spec.ts`
- `tests/unit/foodEntryFactory.spec.ts`
- `tests/unit/dailySummary.spec.ts`
- `tests/unit/localNutritionProvider.spec.ts`

## Notes

- Nutrition resolution now uses serving-unit conversion and per-100g baselines.
- Local catalog expanded to additional foods with per-food serving-size mappings.
- Live update provider now targets GitHub manifest URL and can prefetch/cache listed assets before reload.
- Baseline manifest file now exists at `live-update/manifest.json` for immediate OTA endpoint availability.
- UI now has two screens with bottom tab bar navigation: Home (meal-based nutrition dashboard) and Profile (daily-goal management).
- Home now includes calorie-target pie summary and meal sections (breakfast/lunch/dinner/snacks) with macro totals and add-food actions.
- Added `AddFoodToMealPage` flow for selecting from available foods and logging into a chosen meal.
- Domain model now includes `mealType` on `FoodEntry`, with backward-compatible fallback to `snack` for older persisted entries.
- Daily goal can be absent (`null`), and summary UI/insights handle not-set targets explicitly.
