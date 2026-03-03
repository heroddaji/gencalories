# STATE

- Phase: **Phase 1 MVP (web-first + Capacitor-ready structure)**
- Status: **Home/Profile bottom tab bar added + profile goal management moved to dedicated screen**
- Completed goals:
  - Added mobile packaging npm commands for Android + iOS (`mobile:bundle`, `package:android`, `package:ios`).
  - Added Capacitor platform dependencies for Android and iOS in dev toolchain.
  - Reworked live update provider to fetch GitHub manifest, validate, prefetch/cache assets, and reload to latest app URL.
  - Preserved bundled fallback behavior with rollback state retention.
  - Documented deployment and OTA manifest format/workflow in README.
  - Added two-screen bottom tab bar shell in app root (`Home`, `Profile`) and wired screen switching.
  - Refactored `FoodEntryPage` into a home-content component (removed in-page header/page wrappers).
  - Added `ProfilePage` under `user-profile-goals/presentation` for daily-goal editing.
  - Passed validation (`npm run typecheck`, `npm test`).
- Current blockers:
  - None.
- Next actions:
  1. Add runtime smoke test on physical Android/iOS devices for OTA reload behavior.
  2. Add signed manifest verification (real cryptographic signature check, not prefix validation).
  3. Automate publishing manifest + assets to GitHub Pages/Release artifacts in CI.
