# Circularity Matrix — Agent Guide

This document provides essential information for AI coding agents working on the Circularity Matrix project.

---

## Project Overview

**Circularity Matrix** is a client-side web application that helps users identify the right circular economy strategy for their products. It implements the [HBR Circularity Matrix framework](https://hbr.org/2021/07/the-circular-business-model) by Atasu, Dumas & Van Wassenhove (2021).

Users answer 8 questions across three dimensions — Access Difficulty, Process Difficulty, and Embedded Value — and the tool maps their product onto an 8-cell matrix, recommending one or more strategies: Retain Product Ownership (RPO), Product Life Extension (PLE), or Design for Recycling (DFR).

### Key Characteristics

- **Pure static site** — No backend, no database, no API calls
- **Client-side only** — All data persists to `localStorage`
- **Privacy-first** — No data leaves the browser, no analytics, no cookies
- **PDF generation** — Client-side reports via jsPDF (dynamically imported)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS | v4 |
| PDF Generation | jsPDF | 4.2.0 |
| Fonts | Geist (Sans + Mono) | via next/font |

---

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with PortfolioProvider
│   │   ├── page.tsx           # Landing page (route: /)
│   │   ├── globals.css        # Tailwind v4 CSS imports
│   │   ├── assess/page.tsx    # Assessment wizard (route: /assess)
│   │   ├── portfolio/page.tsx # Portfolio dashboard (route: /portfolio)
│   │   └── explore/page.tsx   # Matrix explorer (route: /explore)
│   │
│   ├── components/            # React UI components
│   │   ├── Navigation.tsx     # Top navigation bar
│   │   ├── CircularityMatrix.tsx  # SVG-based 2×2 matrix visualization
│   │   ├── QuestionnaireWizard.tsx # Multi-step assessment form
│   │   ├── QuestionCard.tsx   # Individual question display
│   │   ├── ResultsCard.tsx    # Assessment results with what-if analysis
│   │   └── ProductList.tsx    # Portfolio sidebar product list
│   │
│   └── lib/                   # Domain logic and data
│       ├── types.ts           # TypeScript interfaces and types
│       ├── questions.ts       # 8 assessment questions (3+3+2 structure)
│       ├── scoring.ts         # Normalization and threshold scoring logic
│       ├── strategies.ts      # 8-cell matrix strategy definitions
│       ├── portfolio-context.tsx  # React Context + localStorage persistence
│       └── report-generator.ts    # jsPDF report generation
│
├── public/                    # Static assets (images, screenshots)
├── package.json              # NPM dependencies and scripts
├── next.config.ts            # Next.js config (static export)
├── tsconfig.json             # TypeScript configuration
├── postcss.config.mjs        # Tailwind CSS v4 PostCSS config
├── eslint.config.mjs         # ESLint config (eslint-config-next)
└── PRD.md                    # Product Requirements Document
```

---

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build static export (outputs to out/ directory)
npm run build

# Serve production build locally
npm run start

# Run ESLint
npm run lint
```

### Deployment

The app is configured for static export (`output: "export"` in `next.config.ts`). Build outputs go to the `out/` directory and can be deployed to any static host:

- Vercel (primary)
- Netlify
- GitHub Pages
- Any CDN or static file server

---

## Code Organization Principles

### Domain Logic (`src/lib/`)

All business logic is isolated from UI components:

- **`types.ts`** — Source of truth for all TypeScript interfaces. Key types:
  - `StrategyType`: `"RPO" | "PLE" | "DFR"`
  - `MatrixPosition`: `{ access, process, embeddedValue }`
  - `Product`: Contains answers, result, and metadata
  - `AssessmentResult`: Scores, position, cell, and what-if cell

- **`questions.ts`** — 8 questions structured by dimension:
  - 3 Access questions (distribution, customer return, reverse logistics)
  - 3 Process questions (material complexity, disassembly, degradation)
  - 2 Embedded Value questions (material value, brand/tech value)
  
  Each question has 5 options scored 1–5 with labels and descriptions.

- **`scoring.ts`** — Scoring algorithm:
  1. Normalize each answer: `(value - 1) / (max - 1)` → 0–1
  2. Average per dimension
  3. Threshold at 0.5: `≥ 0.5 = Hard/High`, `< 0.5 = Easy/Low`
  4. Map to 8-cell matrix position

- **`strategies.ts`** — 8 `CellStrategy` objects defining:
  - Strategy combinations (e.g., `["PLE", "RPO"]`)
  - Descriptions, real-world examples, implementation guidance
  - Cell IDs follow pattern: `{access}-{process}-{embeddedValue}`

- **`portfolio-context.tsx`** — React Context for portfolio state:
  - Stores products array
  - Persists to `localStorage` under key `circularity-matrix-portfolio`
  - Provides `addProduct`, `removeProduct`, `clearPortfolio` methods

### Components (`src/components/`)

Components follow single-responsibility pattern:

- **`CircularityMatrix`** — SVG visualization with coordinate math for cell placement
- **`QuestionnaireWizard`** — State machine for multi-step form flow
- **`ResultsCard`** — Displays scores, strategies, and what-if toggle

### Pages (`src/app/`)

All pages are Client Components ("use client") except `layout.tsx`:

- **`/assess`** — Wizard → Results flow
- **`/portfolio`** — 3-column layout: sidebar, matrix, detail panel
- **`/explore`** — Interactive matrix reference without assessment

---

## Key Architectural Decisions

### No Backend / No Database

All state lives in the browser via `localStorage`. This is intentional to:
- Enable zero-cost static hosting
- Guarantee data privacy (nothing leaves the browser)
- Support offline usage after initial load

**Implication:** Portfolio data is browser-specific and non-transferable. Clearing browser data deletes the portfolio.

### Dynamic Import for jsPDF

The PDF library (~200 KB) is loaded only when the user clicks "Download Report":

```typescript
import("@/lib/report-generator").then(({ generateReport }) => {
  generateReport(portfolio);
});
```

### SVG Over Canvas

The matrix uses SVG for:
- Accessibility (semantic elements)
- Crisp scaling at any resolution
- Easy interactivity (click handlers on cells)

---

## Testing Strategy

**Current state:** No automated tests are configured.

**Manual testing checklist:**
1. Complete assessment wizard and verify correct cell mapping
2. Add multiple products to portfolio (test up to 15+)
3. Test what-if toggle on results card
4. Verify PDF download generates correct report
5. Test localStorage persistence (refresh page)
6. Test clear portfolio confirmation flow
7. Verify matrix cell highlighting and pin placement

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** — No implicit any, null checks enforced
- **Explicit return types** on exported functions in `lib/`
- **Interface over type** for object shapes

### Naming Conventions

- Components: PascalCase (`CircularityMatrix.tsx`)
- Utilities: camelCase (`calculateScores`)
- Types/Interfaces: PascalCase (`AssessmentResult`)
- Constants: UPPER_SNAKE_CASE for true constants (`PIN_COLORS`)

### CSS/Styling

- **Tailwind CSS v4** with `@theme inline` for custom properties
- No custom CSS files except `globals.css`
- Use Tailwind utility classes exclusively (no CSS modules)
- Color palette: Blue (primary), Green (PLE), Purple (RPO), Yellow/Pink (matrix cells)

### Imports

- Use `@/` alias for imports from `src/`
- Group imports: React → External → Internal (lib) → Components

---

## State Management

### Portfolio Context

All components access portfolio via `usePortfolio()` hook:

```typescript
const { portfolio, addProduct, removeProduct, clearPortfolio } = usePortfolio();
```

Portfolio structure:
```typescript
interface Portfolio {
  products: Product[];
}
```

### localStorage

- Key: `circularity-matrix-portfolio`
- Automatically synced on every portfolio change
- Loaded once on app mount (handles SSR safely)

---

## Important Constraints

### 15-Product Soft Limit

The matrix visualization supports up to 15 distinctly colored pins (`PIN_COLORS` array). Beyond 15, colors repeat and the UI displays a warning.

### Scoring Simplification

The three-threshold binary classification (Easy/Hard, Low/High) is deliberate. Edge cases near the 0.5 boundary may feel arbitrary — this is by design per the HBR framework.

### PDF Layout

Report generation uses programmatic jsPDF coordinate layout. Complex customization would require significant rework.

---

## Environment Variables

None required. The app has no external API calls, no analytics, and no configurable backend.

---

## Security Considerations

- **XSS:** React's built-in escaping handles this; no dangerouslySetInnerHTML usage
- **Data exposure:** No sensitive data exists — all data is user-entered product names and answers
- **localStorage:** No authentication tokens or secrets stored

---

## Future Extension Points

Out of scope for v1.0 but architecturally feasible:

1. **Export/import JSON** — Add buttons to download/upload portfolio JSON
2. **Comparison mode** — Side-by-side product comparison with delta indicators
3. **Weighted scoring** — Allow users to adjust dimension importance
4. **Localization** — All strings are in source files, i18n-ready
5. **Server persistence** — Would require significant architecture change

---

## Reference Documentation

- **Framework:** [HBR Circularity Matrix](https://hbr.org/2021/07/the-circular-business-model) by Atasu, Dumas & Van Wassenhove
- **Detailed specs:** See `PRD.md` in project root
- **User documentation:** See `README.md`
