# AGENTS.md — Hybrid Ionic + Capacitor Calories App Delivery Plan

## 1) Purpose

This document defines how autonomous and human agents should design, implement, test, and evolve a **hybrid (Web + iOS + Android)** calories-counting app using a **modern modular architecture** and **plugin-first approach**.

Primary product goal:

- User can input food.
- App resolves calories + nutrition values.
- App provides clear daily consumption summary.
- App remembers previously entered foods and provides instant suggestions.

---

## 2) Product Scope (Functional Requirements)

### Core user journeys

1. **Food Entry**
   - User enters food name (manual text in MVP).
   - User can select suggested food from history/autocomplete.
   - User can set amount/serving.

2. **Nutrition Resolution**
   - Resolve calories + macros (protein/carbs/fat at minimum).
   - Store nutrition snapshot at the time of entry.

3. **Daily Summary**
   - Total calories consumed for day.
   - Macro split + goal delta (remaining/exceeded).
   - Plain-language daily insight summary.

4. **History-based Smart Suggestions (Required)**
   - Search foods that were previously entered.
   - As user types, app suggests past foods quickly.
   - Suggestions prioritize recency + frequency + text relevance.

5. **On-the-fly Update**
   - App ships with default local bundle.
   - Supports runtime update via signed OTA manifest/bundle.
   - Safe rollback to bundled baseline on failure.

---

## 3) Architecture Guardrails

### A. Layered + Modular

Use clean boundaries per feature and layer:

- `domain/` — entities, value objects, invariants, policies
- `application/` — use cases, orchestration services
- `infrastructure/` — API clients, persistence, plugin adapters
- `presentation/` — Ionic pages/components/view models

Each feature should be isolated under `src/features/*`.

### B. Plugin-first (Dependency Inversion)

Define interfaces in domain/application; implementations in infrastructure.

Required plugin contracts:

- `NutritionProvider`
- `FoodSearchProvider`
- `FoodHistoryRepository`
- `FoodSuggestionService`
- `StorageProvider`
- `SyncProvider` (optional phase)
- `LiveUpdateProvider`

No feature may directly depend on vendor SDKs.

### C. Cross-platform parity

- One shared codebase for web + Capacitor mobile.
- Platform-specific code only in adapters (`infrastructure/platform/*`).
- Device APIs wrapped behind interfaces.

---

## 4) Proposed Project Structure

```text
src/
  app/
    bootstrap/
    routing/
    di/
  shared/
    ui/
    utils/
    types/
  features/
    food-entry/
      domain/
      application/
      infrastructure/
      presentation/
    nutrition-lookup/
      domain/
      application/
      infrastructure/
      presentation/
    food-history-suggestions/
      domain/
      application/
      infrastructure/
      presentation/
    daily-summary/
      domain/
      application/
      infrastructure/
      presentation/
    user-profile-goals/
      domain/
      application/
      infrastructure/
      presentation/
  platform/
    capacitor/
    web/

tests/
  unit/
  integration/
  contract/
  e2e-web/
  e2e-mobile/

.agents/
  STATE.md
  BACKLOG.md
  DECISIONS.md
  HANDOFF.md
  TEST_STATUS.md
  CHANGELOG_AGENT.md
  RUNS/
```

---

## 5) Domain Design Notes

### Core entities

- `FoodEntry`
  - id, userId, foodName, normalizedFoodName, quantity, servingUnit, consumedAt
  - nutritionSnapshot (calories, protein, carbs, fat, micros?)
- `DailyConsumptionSummary`
  - date, totalCalories, macroTotals, goalDelta, insights
- `FoodHistoryItem`
  - normalizedName, displayName, lastUsedAt, useCount, recentServing

### Normalization rules

- Lowercase + trim + collapse whitespace.
- Remove punctuation noise for search key.
- Keep display value unchanged for UX.

---

## 6) Food History Search + Instant Suggestions

### Requirements

- Suggestion response target: **<100ms local query latency**.
- Trigger suggestions on input debounce (e.g., 100–150ms).
- Show top N ranked suggestions (e.g., top 8).

### Ranking policy (default)

Weighted score combining:

1. Prefix match score (highest)
2. Fuzzy similarity score
3. Recency boost (`lastUsedAt`)
4. Frequency boost (`useCount`)
5. Optional context boost (meal time proximity)

### Data lifecycle

- Upsert history on successful entry save.
- Deduplicate by normalized key.
- Maintain bounded size (e.g., max 2,000 records per user).
- Provide privacy control: delete single entry / clear all history.

---

## 7) Testing Strategy (All Aspects)

### Unit tests

- Domain invariants, calculations, normalization, ranking.

### Component tests

- Ionic component behavior, forms, validation, suggestion dropdown UX.

### Integration tests

- Feature modules with real repository adapters (mock external network).

### Contract tests

- Validate each provider implementation against shared interfaces.

### E2E tests

- **Web:** Playwright
- **Mobile:** Maestro/Appium for Android + iOS flows

Critical flows:

- Add food → nutrition resolved → appears in daily summary.
- Re-enter similar text → previous food suggested quickly.
- Clearing history removes suggestion outcomes.
- Offline mode behaves with cached/bundled logic.

### Quality gates (CI)

- Required: lint, typecheck, unit/integration/contract tests, e2e smoke.
- Coverage targets (starting baseline):
  - Domain/Application: >= 85%
  - Infrastructure/Presentation: >= 70%

---

## 8) Web + Mobile Runtime Strategy

- Web: PWA-compatible build, offline caching for critical views.
- Mobile: Capacitor wrappers with native storage + background-safe update checks.
- Keep business logic shared across platforms.

---

## 9) OTA / Live Update Policy (with bundled fallback)

1. App always contains a stable default bundle.
2. On startup/resume, check signed remote manifest.
3. If newer version available, download and verify checksum/signature.
4. Apply update safely (next launch or controlled activation point).
5. Health-check after activation.
6. On failure/crash-loop, rollback automatically to bundled baseline.

Must track:

- Current bundle version
- Manifest hash/signature
- Applied timestamp
- Rollback reason if any

---

## 10) Autonomous Agent Continuity Protocol (.agents)

Agents must persist execution context in files:

- `.agents/STATE.md` — current phase, goals, blockers, next actions
- `.agents/BACKLOG.md` — prioritized tasks with status
- `.agents/DECISIONS.md` — ADR logs (why, alternatives, consequences)
- `.agents/HANDOFF.md` — concise handoff for next run
- `.agents/TEST_STATUS.md` — latest test matrix and failures
- `.agents/CHANGELOG_AGENT.md` — cumulative implementation changes
- `.agents/RUNS/<timestamp>.md` — per-run journal

### Mandatory update rule per autonomous run

Before ending a run, agent must update at least:

1. `STATE.md`
2. `HANDOFF.md`
3. `TEST_STATUS.md`

---

## 11) Definition of Done (DoD)

A task/feature is complete only when:

1. Modular boundaries respected (no architecture violations).
2. Required tests added and passing.
3. Backward compatibility and migrations addressed.
4. Agent memory files updated.
5. Documentation updated (including this AGENTS.md if guardrails changed).

---

## 12) Delivery Phases

### Phase 1 — MVP

- Food entry + nutrition lookup + daily summary
- Local history + suggestion ranking v1
- Web + Android baseline

### Phase 2 — Expansion

- iOS parity hardening
- Barcode scanning
- Optional cloud sync and account linking

### Phase 3 — Optimization

- Personalized insights
- Advanced ranking model
- Performance tuning and analytics-driven UX refinement

---

## 13) Agent Execution Rules

- Prefer small vertical slices.
- Keep changes merge-friendly and test-backed.
- Do not bypass tests or architecture boundaries for speed.
- Record all major technical decisions in `DECISIONS.md`.
- If requirements conflict, prioritize user safety, data integrity, and rollback capability.
