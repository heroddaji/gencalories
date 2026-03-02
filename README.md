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

## Mobile (Android + iOS)

Add native projects once:

```bash
npm run cap:add:android
npm run cap:add:ios
```

Bundle current app code and sync native wrappers:

```bash
npm run mobile:bundle
```

Package builds:

```bash
npm run package:android
npm run package:ios
```

Open native IDE projects:

```bash
npm run mobile:open:android
npm run mobile:open:ios
```

## Validate

```bash
npm run typecheck
npm test
npm run build
```

## OTA Live Update (GitHub manifest)

The app is always bundled with local `dist` assets, then checks GitHub for a newer bundle manifest at startup/resume.

Configure in `.env`:

```bash
VITE_LIVE_UPDATE_MANIFEST_URL=https://raw.githubusercontent.com/<owner>/<repo>/<branch>/live-update/manifest.json
```

Expected manifest shape:

```json
{
  "version": "2026.03.03.1",
  "hash": "sha256-...",
  "signature": "sig_2026.03.03.1",
  "appUrl": "https://<owner>.github.io/<repo>/",
  "assets": [
    "/index.html",
    "/assets/index-abc123.js",
    "/assets/index-abc123.css"
  ]
}
```

Behavior:

1. App starts from bundled code.
2. If manifest version is newer, app prefetches `assets`, stores update metadata, and reloads to `appUrl`.
3. If update fetch/apply fails, app keeps bundled baseline and can rollback state automatically.

Release flow with GitHub:

1. Build and publish web assets to GitHub Pages (`appUrl` target).
2. Update [`live-update/manifest.json`](./live-update/manifest.json) with new `version`, `hash`, `signature`, and `assets`.
3. Commit and push manifest to `main` so raw GitHub manifest URL changes.
