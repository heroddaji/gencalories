# STATE

- Phase: **Phase 1 MVP (web-first + Capacitor-ready structure)**
- Status: **Nutrition-by-serving recalibrated and catalog expanded**
- Completed goals:
  - Revised local nutrition math to be serving-unit aware (g/kg/ml/l/oz/tsp/tbsp/cup + item-specific serving sizes).
  - Replaced per-serving fixed catalog values with per-100g nutrition baselines and unit-weight mappings.
  - Expanded local food catalog coverage with additional common foods and aliases.
  - Added unit tests covering serving conversion correctness in `LocalNutritionProvider`.
  - Passed validation (`npm run typecheck`, `npm test`).
- Current blockers:
  - None.
- Next actions:
  1. Add integration tests for add-food flows with multiple serving units from UI.
  2. Add contract tests for nutrition provider expectations across unknown/custom units.
  3. Add optional density overrides for volume-heavy foods to improve ml/cup precision.
