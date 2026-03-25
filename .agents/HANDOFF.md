# HANDOFF

## What was completed (latest)

- Added a root Gradle override in `android/build.gradle` to force Java 17 source/target compatibility across Android modules, including `capacitor-android`.
- Verified the Java 17 override by running `:capacitor-android:compileDebugJavaWithJavac` with `JAVA_HOME` pointed at JDK 17; build passed.
- Moved Firebase web setup off the root entry file and into a shared module at `src/shared/firebase/app.ts`.
- Wired Firebase analytics initialization into the active Framework7 shell in `src/app/App2.tsx`.
- Removed the inline Firebase initialization block from `src/main.tsx` so the entry file only bootstraps React + Framework7.
- Installed the `firebase` SDK to satisfy the app imports and the Capacitor Firebase plugin’s web peer dependency.
- Ran `npm run cap:sync` so Android/iOS plugin registration now reflects the current dependency set, including `@capacitor-firebase/app` and `@capacitor-firebase/firestore`.
- Switched the Framework7 demo to the built-in `ios` theme in `src/app/App2.tsx`.
- Removed the `@/theme.css` import from `src/main.tsx` and deleted `src/theme.css` so the app now relies only on `framework7/css/bundle`.
- Simplified the demo markup to remove custom `app2-*` styling hooks.
- Verified the styling cleanup with `npm run build` ✅.
- Swapped the current UI entry point to a simple `Framework7 React` demo in `src/app/App2.tsx`.
- Cleaned `src/main.tsx` to import `framework7/css/bundle` directly and render `App2` without the previous Ionic CSS imports.
- Simplified `index.html` so Vite boots the app normally and the page title matches `GenCalories`; removed the direct `node_modules` Framework7 stylesheet link.
- Verified the Framework7 setup with `npm run build` ✅.
- Replaced web-named dependencies in `createMobileAppContainer` with mobile-scoped adapters:
  - `MobileSyncProvider`
  - `MobileLiveUpdateProvider`
- Implemented `MobileLiveUpdateProvider` using `@capawesome/capacitor-live-update` for native bundle discovery, download, activation, and rollback while persisting contract-compatible state in mobile storage.
- Verified the cleanup with `npm run typecheck` and `npm test -- --silent --reporter default` ✅.
- Added root `vite.config.ts` to register the React plugin and the `@` alias to `src`, fixing Vite dependency scanning/build resolution for `@/app/App` and `@/theme.css` imported by `src/main.tsx`.
- Verified fix with `npm run build` ✅.
- Expanded `defaultNutritionCatalog` with many FoodData Central–based items across fruits, vegetables, grains/starches, proteins, legumes, dairy/alternatives, fats/condiments, nuts/seeds, sweets, and beverages, with per-100g macros and common gram-per-unit mappings. Improves lookup and suggestions density.
- Tests still passing after expansion (`npm test -- --silent --reporter default`).
- Previous context retained: Summary tab, date-aware flows, BMI/profile expansion, meal management, repositories/use cases, loading-state polish, and test suite additions.

## Validation status

- `JAVA_HOME=$(/usr/libexec/java_home -v 17) GRADLE_USER_HOME=/tmp/gen-calories-gradle ./gradlew :capacitor-android:compileDebugJavaWithJavac --no-daemon` ✅ (latest)
- `npm run cap:sync` ✅ (latest; after Firebase dependency/setup cleanup)
- `npm run build` ✅ (latest; after Firebase wiring change)
- `npm run typecheck` ✅ (latest; after Firebase wiring change)
- `npm run build` ✅ (latest; after removing `theme.css` and forcing Framework7 iOS theme)
- `npm run build` ✅ (latest; after wiring Framework7 demo `App2`)
- `npm run typecheck` ✅ (latest)
- `npm test -- --silent --reporter default` ✅ (latest; 10 files / 27 tests)
- `npm run build` ✅ (latest; after adding `vite.config.ts` alias)
- `npm run typecheck` ✅ (previous run)
- `npm test -- --silent --reporter default` ✅ (latest, post-catalog expansion)
- `npm run mobile:bundle` ✅ (previous run; includes Capacitor sync)

## Current blockers

- None.

## Notes from latest run

- Forcing Java 17 is now implemented in the project-level Android Gradle file rather than in generated files like `android/app/capacitor.build.gradle` or vendored files under `node_modules/`.
- The first verification attempt showed that Android Gradle rejects `options.release`; final fix uses only `sourceCompatibility` and `targetCompatibility`.
- Keep launching Android builds with JDK 17 if you want this path to stay consistent locally.
- Firebase config currently lives in source code inside `src/shared/firebase/app.ts`; moving it to `VITE_*` env vars would be a good follow-up before production.
- Analytics initialization is now called from `App2.tsx`, which matches the currently active app shell. If the app switches back to `src/app/App.tsx`, Firebase bootstrap should move to a shared bootstrap layer rather than another page/shell file.
- `npm run cap:sync` succeeded and registered both Capacitor Firebase plugins on Android and iOS.
- Capacitor still warns that `@capacitor-community/sqlite` lacks `Package.swift`, so SPM-only iOS setups may need extra attention later.
- The active demo now uses Framework7’s built-in iOS look only; there are no project-specific CSS overrides in the runtime path.
- `src/theme.css` has been deleted, so any future custom styling should be reintroduced intentionally rather than inherited from the previous Ionic-based screen work.
- `App2.tsx` is now the active demo shell for experimenting with Framework7 React UI elements.
- The demo screen includes a navbar, food-entry form inputs, suggestion chips, action buttons, summary list items, and a bottom toolbar.
- Framework7 CSS now comes from the Vite/React import path instead of a static HTML link, which is safer for production bundling.
- Mobile DI wiring now respects platform boundaries better: the mobile container no longer imports `WebSyncProvider` or `WebLiveUpdateProvider`.
- `MobileSyncProvider` is intentionally a no-op adapter for now; update checks still happen via `liveUpdateProvider` from `FoodEntryPage`.
- `MobileLiveUpdateProvider` stores a simplified contract state (`currentBundleVersion`, hash/signature placeholders or bundle metadata, `appliedAt`, optional rollback reason) so the UI can keep using the shared `LiveUpdateProvider` interface.
- Dependency scan failure came from Vite lacking the `@` alias even though `tsconfig.json` had the path mapping; the new config now aligns Vite with TypeScript.
- Build now succeeds again; there is still an existing large chunk warning to address separately.
- Nutrition catalog greatly expanded; suggestions and lookups should find more matches with better macro accuracy.
- Spinner/loading improvements from prior run remain.

## Immediate next steps

1. Move Firebase web config from hard-coded source values to `VITE_FIREBASE_*` environment variables before production or team sharing.
2. Decide whether to keep the Java 17 override long-term or instead standardize the team/build machines on Java 21 to match upstream Capacitor defaults.
3. Decide whether the Framework7 demo should remain a temporary playground or become the main UI direction for the app shell.
4. If Framework7 is the direction, migrate the demo into the modular feature/presentation structure instead of keeping UI in a single `App2.tsx`.
