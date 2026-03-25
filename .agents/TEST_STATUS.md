# TEST STATUS

## Last run summary

- Date: **2026-03-25**
- Typecheck: **PASS** (`npm run typecheck`) — latest
- Unit tests: **PASS** (`npm test -- --silent --reporter default`) — latest
  - 10 test files passed
  - 27 tests passed
- Build: **PASS** (`npm run build`) — latest; verified after removing `theme.css` and using Framework7 iOS theme only
- Mobile bundle sync: **PASS** (`npm run mobile:bundle` → `npm run cap:sync`) — previous run
- OTA/provider tests: **NOT ADDED YET**

- Latest change quick check

- Forced Framework7 app theme to `ios` in `src/app/App2.tsx`.
- Removed the `@/theme.css` import from `src/main.tsx`.
- Deleted `src/theme.css`; runtime styling now comes only from `framework7/css/bundle`.
- Removed custom `app2-*` class usage from the demo screen.
- `npm run build` passes after the styling cleanup; existing Vite large-chunk warning still appears.
- Replaced the active entry UI with a simple Framework7 React demo in `src/app/App2.tsx`.
- `src/main.tsx` now imports `framework7/css/bundle` and renders `App2` directly without Ionic CSS imports.
- `index.html` now uses a clean Vite root scaffold and no longer links Framework7 assets from `node_modules`.
- `npm run build` passes with the Framework7 demo; existing Vite large-chunk warning still appears.
- Added `MobileLiveUpdateProvider` and `MobileSyncProvider` so `createMobileAppContainer` no longer imports web-specific provider classes.
- `MobileLiveUpdateProvider` now uses the Capawesome native plugin for bundle checks/download/apply/reset and persists contract-shaped state through mobile storage.
- No automated provider-specific tests yet for the native live-update adapter; current safety net is typecheck plus existing unit suite.
- Added root `vite.config.ts` to align Vite with TypeScript path aliases (`@` → `src`), which fixed dependency scan/build resolution for `src/main.tsx` imports.
- `npm run build` now completes successfully again; Vite still emits a large chunk warning for the main bundle.
- Nutrition catalog massively expanded with FoodData Central per-100g values and common gram-per-unit mappings; search/suggestions should surface more items. No new automated tests added for catalog size; unit suite still green.

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

- Mobile bootstrap wiring now matches the intended platform separation more closely, but real-device OTA verification is still outstanding.
- Food entries are now queried by **user + date**, and summary service now resolves by **user + date**.
- Repository now supports update/delete operations; Home and Add Food flows support inline edit/remove of meal rows.
- Added Summary tab with per-day browsing via buttons and swipe gestures.
- Daily summary card now includes three macro bars (protein, carbs, fat) in addition to calorie pie.
- Profile now supports age/height/current weight/target weight with BMI calculations and healthy-range indicators.
- Date utilities now include day-shifting and label-format helpers used by Summary tab and date-aware flows.
- Latest run fixed JSX namespace typing issues by returning `ReactElement` and ensuring React typings load; typecheck/build/mobile bundle all pass.
