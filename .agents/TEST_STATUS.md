# TEST STATUS

## Last run summary

- Date: **2026-03-03**
- Typecheck: **PASS** (`npm run typecheck`)
- Unit tests: **PASS** (`npm test`)
  - 10 test files passed
  - 27 tests passed
- Build: **PASS** (`npm run build`)
- OTA/provider tests: **NOT ADDED YET**

## Present test files

- `tests/unit/text.spec.ts`
- `tests/unit/suggestionRanking.spec.ts`
- `tests/unit/foodEntryFactory.spec.ts`
- `tests/unit/dailySummary.spec.ts`
- `tests/unit/localNutritionProvider.spec.ts`
- `tests/unit/bmi.spec.ts`
- `tests/unit/date.spec.ts`
- `tests/unit/localFoodEntryRepository.spec.ts`
- `tests/unit/updateFoodEntryUseCase.spec.ts`
- `tests/unit/localUserProfileRepository.spec.ts`

## Notes

- Food entries are now queried by **user + date**, and summary service now resolves by **user + date**.
- Repository now supports update/delete operations; Home and Add Food flows support inline edit/remove of meal rows.
- Added Summary tab with per-day browsing via buttons and swipe gestures.
- Daily summary card now includes three macro bars (protein, carbs, fat) in addition to calorie pie.
- Profile now supports age/height/current weight/target weight with BMI calculations and healthy-range indicators.
- Date utilities now include day-shifting and label-format helpers used by Summary tab and date-aware flows.
