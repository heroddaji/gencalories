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
