# TEST STATUS

## Last run summary

- Date: **2026-03-03**
- Typecheck: **PASS** (`npm run typecheck`)
- Unit tests: **PASS** (`npm test`)
  - 5 test files passed
  - 13 tests passed
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
- UI now has two screens with bottom tab bar navigation: Home (food logging/dashboard) and Profile (daily-goal management).
