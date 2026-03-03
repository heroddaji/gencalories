# STATE

- Phase: **Phase 1 MVP (web-first + Capacitor-ready structure)**
- Status: **Home nutrition dashboard redesigned for meal-based flow with profile-linked calorie target and mobile-themed UI**
- Completed goals:
  - Added mobile packaging npm commands for Android + iOS (`mobile:bundle`, `package:android`, `package:ios`).
  - Added Capacitor platform dependencies for Android and iOS in dev toolchain.
  - Reworked live update provider to fetch GitHub manifest, validate, prefetch/cache assets, and reload to latest app URL.
  - Preserved bundled fallback behavior with rollback state retention.
  - Documented deployment and OTA manifest format/workflow in README.
  - Added two-screen bottom tab bar shell in app root (`Home`, `Profile`) and wired screen switching.
  - Refactored home screen to show top calorie summary with pie-style progress and goal delta handling.
  - Added meal breakdown sections (breakfast, lunch, dinner, snacks) with calories/protein/carbs/fat totals.
  - Added per-meal add flow (`AddFoodToMealPage`) that lists available foods and logs selected items into the chosen meal.
  - Extended `FoodEntry` domain with `mealType` and migrated repository reads with backward-compatible default (`snack`).
  - Updated daily summary model to support nullable user goal (`goalCalories`, `goalDelta`) and profile-not-set messaging.
  - Updated profile screen to display current target (or not-set state) and save new daily target values.
  - Added Ionic mobile theme styling (`src/theme.css`) and responsive card/layout adjustments.
  - Passed validation (`npm run typecheck`, `npm test`, `npm run build`).
- Current blockers:
  - None.
- Next actions:
  1. Add runtime smoke test on physical Android/iOS devices for new meal-add UX and summary rendering.
  2. Add signed manifest verification (real cryptographic signature check, not prefix validation).
  3. Automate publishing manifest + assets to GitHub Pages/Release artifacts in CI.
