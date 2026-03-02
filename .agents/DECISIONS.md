# DECISIONS

## ADR-001: Web-first modular baseline with Capacitor readiness

- **Context:** Repository started nearly empty; need fast MVP across web/mobile with clean architecture.
- **Decision:** Use Vite + React + Ionic + Capacitor config, with feature-layer structure under `src/features/*` and contracts in `src/app/di/contracts.ts`.
- **Consequences:** Fast local web iteration; mobile sync possible through Capacitor. Requires follow-up to add native adapters.

## ADR-002: Plugin-first local providers for MVP

- **Context:** Nutrition and suggestions required in MVP without external API dependencies.
- **Decision:** Implement `LocalNutritionProvider`, `LocalFoodSearchProvider`, local repositories, and DI composition in `createWebAppContainer`.
- **Consequences:** Fully offline-capable baseline and deterministic behavior; nutrition values are heuristic/local-catalog quality only.

## ADR-003: OTA safety model scaffolded via stateful provider

- **Context:** App must support default bundled fallback and rollback metadata.
- **Decision:** Implement `WebLiveUpdateProvider` with `getState/checkForUpdate/applyUpdate/rollback` and tracked metadata (bundle version/hash/signature/appliedAt/rollbackReason).
- **Consequences:** Safety contract exists now; production signature/hash validation and remote delivery pipeline still needed.
