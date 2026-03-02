# BACKLOG

## P0 (Current)

- [x] Scaffold hybrid app foundation (Vite + Ionic + Capacitor config)
- [x] Implement food entry + nutrition resolution + daily summary vertical slice
- [x] Implement local history suggestions (ranking + clear/delete controls)
- [x] Add DI container + plugin contracts + web adapters
- [ ] Run full validation locally (`typecheck`, `test`, `build`) once package install succeeds

## P1 (Next)

- [ ] Add integration tests for entry→summary and suggestion lifecycle
- [ ] Add contract tests for provider interfaces
- [ ] Add mobile adapters under `src/platform/capacitor/*`
- [ ] Add routing shell for future multi-page expansion

## P2 (Later)

- [ ] Add signed remote manifest verification hardening
- [ ] Add PWA/offline cache strategy
- [ ] Prepare e2e web and mobile smoke flows
