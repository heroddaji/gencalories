# TEST STATUS

## Last run summary

- Date: **2026-03-03**
- Typecheck: **PASS** (`npm run typecheck`)
- Unit tests: **PASS** (`npm test`)
  - 10 test files passed
  - 27 tests passed
 Build: **PASS** (`npm run build`)
- Mobile bundle sync: **PASS** (`npm run mobile:bundle` → `npm run cap:sync`)
- OTA/provider tests: **NOT ADDED YET**

## Latest change quick check

- UI-only addition: Profile tab shows app version and bundle/build version; no new tests added. Recommend quick manual visual check in Profile tab.

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
- Latest run fixed JSX namespace typing issues by returning `ReactElement` and ensuring React typings load; typecheck/build/mobile bundle all pass.
