# CHANGELOG_AGENT

## 2026-03-02

- Initialized project tooling: Vite, TypeScript, Vitest, Ionic React, Capacitor config.
- Added app bootstrap and entrypoint (`src/main.tsx`, `src/app/App.tsx`).
- Added core shared types and utility functions.
- Implemented plugin contracts and app container interface.
- Implemented web adapters:
  - storage provider
  - sync provider
  - live update provider
- Implemented feature modules:
  - food entry (domain + use cases + repository + page)
  - nutrition lookup (local catalog/search providers)
  - history suggestions (ranking, repository, service, use cases, UI list)
  - daily summary (service + UI card)
  - user goal repository + set-goal use case
- Added DI composition in `createWebAppContainer`.
- Added unit tests:
  - text normalization/similarity
  - suggestion ranking
  - food entry factory
  - daily summary calculations
- Added autonomous context files under `.agents/`.

## 2026-03-03

- Added serving type domain module with canonical units, synonym normalization, and predefined-unit helpers.
- Updated food entry UI to support selectable serving types and custom units.
- Normalized serving units in food entry factory to persist canonical values.
- Added unit test coverage for serving unit synonym normalization.
- Fixed `normalizeFoodName` trailing-whitespace edge case after punctuation cleanup.
- Verified `npm run typecheck` and `npm test` pass.
- Reworked local nutrition provider to compute by serving unit and consumed mass using per-100g data.
- Expanded local food catalog and aliases with more realistic nutrition baselines.
- Added unit tests for local nutrition conversion accuracy.
- Added Android/iOS packaging scripts and native Capacitor platform dependencies.
- Implemented GitHub-manifest OTA flow with manifest fetch/validation, asset cache warmup, and reload to latest app URL.
- Documented OTA manifest schema and mobile packaging commands in README.
- Added Home/Profile bottom tab bar screen shell in `App.tsx`.
- Moved daily goal editing into new `ProfilePage` screen.
- Simplified `FoodEntryPage` into Home content without its own page-level header wrapper.
- Added meal-based home dashboard UI with:
  - top calorie summary pie against user target
  - per-meal nutrition breakdown for breakfast/lunch/dinner/snacks
  - per-meal add-food actions
- Added `mealType` to `FoodEntry` domain and flow (`foodEntryFactory`, `LogFoodEntryUseCase`, local repository migration fallback).
- Added new `AddFoodToMealPage` component for selecting foods from local catalog and logging to chosen meal.
- Updated daily summary model and service for nullable calorie goal (`goalCalories`, `goalDelta`) and not-set insights.
- Updated profile UI to show current target calorie state and support empty/not-set initial value.
- Added mobile Ionic theme overrides in `src/theme.css` and applied centered app content container.
- Updated unit tests for new `mealType` and nullable-goal behavior.
- Re-validated with `npm run typecheck`, `npm test`, and `npm run build`.
