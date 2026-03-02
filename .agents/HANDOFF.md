# HANDOFF

## What was completed

- Reworked nutrition resolution so calories/macros now change by serving type and quantity.
- Replaced fixed per-serving nutrition catalog values with `per100g` baselines plus per-food unit weight mappings.
- Added conversion support for common units:
  - `g`, `kg`, `ml`, `l`, `oz`, `tsp`, `tbsp`, `cup`
  - per-food overrides for `serving`, `piece`, `slice`, `bowl`, `plate`
- Expanded local food catalog with more items/aliases (produce, proteins, grains, legumes, dairy, fats).
- Added unit test coverage for nutrition conversion behavior.
- Validation completed successfully:
  - `npm run typecheck` passed
  - `npm test` passed (5 files, 13 tests)

## Current blocker

- None.

## Immediate next steps

1. Add integration tests for UI serving selection -> saved nutrition snapshot correctness.
2. Add contract tests for conversion behavior on unknown/custom units.
3. Tune density assumptions for volume units (`ml`, `cup`) on selected foods where precision matters.
