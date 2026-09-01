# Playwright Tests for Automation TestStore 

E2E testovacia sada pre e-commerce funkcionalitu [automationteststore.com](https://automationteststore.com)

## Technológie
- Playwright Test + TypeScript
- Page Object Model (`pages/`)

## Inštalácia

- Node.js v20+ odporúčané

```bash
npm install
npx playwright install --with-deps
```

## Spustenie testov

```bash
npm test                 # všetky testy
npm run test:headed      # s viditeľným prehliadačom
npm run test:debug       # krokovací debug režim
npm run report           # otvorí posledný HTML report
```

## Štruktúra projektu
- `pages/` — Page Object Model
- `support/` — testové dáta a pomocné funkcie
- `tests/` — 5 testovacích scenárov (01–05)

## Známa nezrovnalosť v zadaní
Úloha 4 zadáva kategóriu "Cosmetics" → "Fragrance". Reálny web túto kategóriu nemá
(overené cez Site Map stránku) — "Fragrance" je samostatná top-level kategória.
Test preto používa najbližší reálny ekvivalent: `Makeup` → `Face`, so zachovaním
rovnakého overovania (breadcrumb, URL, návrat cez breadcrumb).
