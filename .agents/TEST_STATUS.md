# TEST STATUS

## Last run summary

- Dependency install: **BLOCKED** (network timeout to npm registry)
- Typecheck: **NOT RUN** (waiting on install)
- Unit tests: **NOT RUN** (waiting on install)
- Build: **NOT RUN** (waiting on install)

## Present test files

- `tests/unit/text.spec.ts`
- `tests/unit/suggestionRanking.spec.ts`
- `tests/unit/foodEntryFactory.spec.ts`
- `tests/unit/dailySummary.spec.ts`

## Notes

- `npm install` log indicates repeated `ETIMEDOUT` fetching packages (`@capacitor/core`, `@ionic/core`).
- Re-run validation once dependencies are successfully installed.
