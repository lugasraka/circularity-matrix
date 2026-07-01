# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:3000
npm run build        # static export to out/
npm run start        # serve production build
npm run lint         # ESLint (eslint-config-next)
```

No automated test framework is configured. Testing is manual.

## Architecture

Circularity Matrix is a **pure client-side** Next.js 16 (App Router) application with **zero backend dependencies**. All data persists to `localStorage`; nothing leaves the browser.

### Dual Framework Design

The app implements two complementary circular economy frameworks:

1. **HBR Circularity Matrix** — 8 questions across 3 dimensions (Access, Process, Embedded Value), binary threshold at 0.5, maps to an 8-cell matrix recommending RPO/PLE/DFR strategies
2. **R-Strategy Scorecard** — 7 criteria questions, scores 5 R-strategies (Reuse, Refurbish, Remanufacture, Repurpose, Recycle) on suitability (60%) + practicality (40%), renders as a scatter plot

### Key Layout

- `src/app/` — Next.js pages. All are Client Components (`"use client"`) except `layout.tsx`
- `src/components/` — UI components. R-Strategy specific ones live in `components/r-strategy/`
- `src/lib/` — All domain logic: scoring, questions, strategies, financial calculations, PDF generation. R-Strategy logic is in `lib/r-strategy/`

### State Management

Single React Context (`PortfolioProvider` in `portfolio-context.tsx`) wraps the app in `layout.tsx`. Access via `usePortfolio()` hook. Persists to `localStorage` key `circularity-matrix-portfolio`.

### Static Export

Configured with `output: "export"` in `next.config.ts`. Build output goes to `out/` for deployment to any static host (Vercel primary).

## Scoring Algorithms

**HBR:** Normalize answers `(value - 1) / 4` to 0-1, average per dimension, threshold at 0.5 to map into 8-cell matrix (2x2x2 of Easy/Hard, Low/High).

**R-Strategy:** Normalize to 0-100, score each strategy per criterion (8 scenarios), suitability = avg of 4 criteria, practicality = avg of 3 criteria, overall = 60/40 weighted blend. Zone-based recommendation with recycling fallback.

## Conventions

- TypeScript strict mode. Use `@/` path alias for imports from `src/`
- Tailwind CSS v4 with `@theme inline` — no CSS modules, no custom CSS files beyond `globals.css`
- jsPDF is dynamically imported (~200KB) only when user triggers PDF download
- 15-product soft limit due to distinct pin colors in matrix visualization (`PIN_COLORS` array)
- Commit format: `type(scope): description` (conventional commits)

## Key Constraints

- No environment variables needed — no external APIs, no analytics, no auth
- Portfolio data is browser-local and non-transferable
- The 0.5 scoring threshold is deliberate per the HBR framework — edge cases feeling arbitrary is by design
- PDF report uses programmatic jsPDF coordinate layout (no HTML-to-PDF conversion)
