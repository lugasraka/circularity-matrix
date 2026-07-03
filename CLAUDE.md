# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Circularity Matrix is a **Next.js 16 + React 19 static site** that helps users select circular economy strategies for products. It implements two assessment frameworks:

- **HBR Circularity Matrix**: 8 questions across 3 dimensions (Access, Process, Embedded Value) → 2x2x2 cell → strategy recommendation (RPO/PLE/DFR)
- **R-Strategy Scorecard**: 7 criteria (suitability + practicality) → scores for 5 strategies (Reuse, Refurbish, Remanufacture, Repurpose, Recycle) with scatter plot visualization

All logic runs client-side. No backend API. State persists in localStorage.

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Static export to /out
npm run lint     # ESLint (next config)
```

No test framework is configured yet.

## Architecture

**Static export SPA** — `next.config.ts` sets `output: "export"`. Deploys to Vercel with no server runtime.

### Key Directories

- `src/app/` — Next.js App Router pages (`/`, `/assess`, `/explore`, `/portfolio`)
- `src/components/` — React components (all `"use client"`)
- `src/lib/` — Domain logic (scoring, strategies, financial calculations, PDF generation)
- `src/lib/r-strategy/` — R-Strategy framework module (types, criteria, scoring, presets)

### Path Alias

`@/*` maps to `src/*` (configured in tsconfig.json).

### State Management

`src/lib/portfolio-context.tsx` — React Context + localStorage (`"circularity-matrix-portfolio"` key). Provides add/update/remove/duplicate/import/export operations for the product portfolio.

### Domain Logic Separation

HBR and R-Strategy frameworks are cleanly separated:
- HBR: `src/lib/questions.ts`, `scoring.ts`, `strategies.ts`, `presets.ts`
- R-Strategy: `src/lib/r-strategy/` (own types, criteria, questions, scoring, presets)

Both share `src/lib/types.ts` for the unified `Product` type that holds either `answers + AssessmentResult` (HBR) or `rStrategyAnswers + RStrategyResult`.

### Assessment Flow

1. User selects framework mode (HBR or R-Strategy)
2. Optional preset fills answers from 28+ product templates
3. Questionnaire wizard collects answers
4. Scoring engine calculates results (dimension scores, cell/zone mapping)
5. Results show strategy recommendations with roadmaps and financial projections

### Financial Calculator

`src/lib/financial-calculator.ts` — computes per-strategy NPV/ROI/payback from volume, cost, and pricing inputs. Default assumptions: 30% service premium (RPO), 25% refurbish cost (PLE), 10% discount rate.

### PDF Generation

`src/lib/report-generator.ts` — client-side PDF via jsPDF. Portfolio overview + per-product results.

### AI Assistant

`src/lib/ai-assistant.ts` — pattern-matching heuristic (no LLM calls). Matches product names to category patterns and suggests question answers with confidence levels.

## Tech Stack

- Next.js 16.1, React 19.2, TypeScript 5 (strict mode)
- Tailwind CSS v4 (PostCSS plugin)
- jsPDF for PDF generation
- ESLint 9 flat config with next/core-web-vitals

## Routing

```
/           → Landing page
/assess     → Assessment wizard (mode → preset → questions → results)
/explore    → Interactive framework explorer
/portfolio  → Product portfolio (list, compare, filter, export)
```

## Conventions

- Conventional Commits: `type(scope): description`
- TypeScript strict mode — all domain types in `src/lib/types.ts`
- Components are `"use client"` (static export requires it)
- Custom Tailwind color tokens for strategies (purple/RPO, green/PLE, blue/DFR, emerald/Reuse, etc.)
