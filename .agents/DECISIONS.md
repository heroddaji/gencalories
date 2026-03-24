# DECISIONS

## ADR-001: Web-first modular baseline with Capacitor readiness

- **Context:** Repository started nearly empty; need fast MVP across web/mobile with clean architecture.
- **Decision:** Use Vite + React + Ionic + Capacitor config, with feature-layer structure under `src/features/*` and contracts in `src/app/di/contracts.ts`.
- **Consequences:** Fast local web iteration; mobile sync possible through Capacitor. Requires follow-up to add native adapters.

## ADR-002: Plugin-first local providers for MVP
- **Context:** Nutrition and suggestions required in MVP without external API dependencies.
- **Decision:** Implement `LocalNutritionProvider`, `LocalFoodSearchProvider`, local repositories, and DI composition in `createWebAppContainer`.
- **Consequences:** Fully offline-capable baseline and deterministic behavior; nutrition values are heuristic/local-catalog quality only. Catalog later expanded with FoodData Central per-100g references to improve accuracy while remaining offline.

## ADR-003: OTA safety model scaffolded via stateful provider

- **Context:** App must support default bundled fallback and rollback metadata.
- **Decision:** Implement `WebLiveUpdateProvider` with `getState/checkForUpdate/applyUpdate/rollback` and tracked metadata (bundle version/hash/signature/appliedAt/rollbackReason).
- **Consequences:** Safety contract exists now; production signature/hash validation and remote delivery pipeline still needed.

## ADR-004: Mobile bootstrap must resolve mobile-scoped adapters

- **Context:** `createMobileAppContainer` had started using `MobileStorageProvider` but still instantiated `WebSyncProvider` and `WebLiveUpdateProvider`, which blurred platform boundaries and made the mobile path look partially web-wired.
- **Decision:** Add `MobileSyncProvider` and `MobileLiveUpdateProvider`, and update the mobile DI container to resolve dependencies only from `src/platform/mobile/*`. Implement the mobile live-update adapter with `@capawesome/capacitor-live-update` while preserving the shared `LiveUpdateProvider` contract shape used by the UI.
- **Consequences:** Clearer dependency inversion and platform ownership in bootstrap code; native OTA behavior is now explicit. Real-device verification is still required because the native adapter has no dedicated automated tests yet.
