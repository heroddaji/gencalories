# GenCalories (Hybrid Ionic + Capacitor MVP)

GenCalories is a modular calories-tracking app scaffold built with **Ionic React + Vite + Capacitor**.

## Implemented MVP

- Food entry with quantity + serving unit
- Local nutrition resolution (calories, protein, carbs, fat)
- Daily summary (total calories, macros, goal delta, insight message)
- History-powered suggestions with ranking (prefix + fuzzy + recency + frequency)
- History controls: delete single suggestion, clear all history
- Local daily calorie goal setting
- Live update provider scaffold with fallback/rollback state metadata

## Architecture

- `src/features/*` split by feature and layer (domain/application/infrastructure/presentation)
- Plugin-first contracts in `src/app/di/contracts.ts`
- Web composition root in `src/app/bootstrap/createWebAppContainer.ts`

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run typecheck
npm test
npm run build
```

> Note: During this run, npm registry timeouts (`ETIMEDOUT`) blocked dependency installation in this environment.
