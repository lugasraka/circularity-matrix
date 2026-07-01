# Circularity Matrix

A decision-support tool that helps identify the right circular economy strategy for products using two complementary frameworks:

- **HBR Circularity Matrix** — Maps products to RPO, PLE, or DFR strategies [Atasu, Dumas & Van Wassenhove, 2021](https://hbr.org/2021/07/the-circular-business-model)
- **R-Strategy Scorecard** — Evaluates 5 R-strategies (Reuse, Refurbish, Remanufacture, Repurpose, Recycle) based on the [DIN framework](https://www.din.de/en/innovation-and-research/circular-economy/standards-research-on-the-circular-economy/r-strategy-framework)claude

### Live Demo: [circularity-matrix.vercel.app](https://circularity-matrix.vercel.app/)

## Demo

![Video-Circularity Matrix](public/circularity-matrix-demo.gif)

## Features

- **Dual framework assessment** — HBR Matrix (strategic) or R-Strategy Scorecard (operational)
- **Strategy recommendations** — Framework-specific guidance with roadmaps and financial projections
- **Financial calculator** — Transparent, editable assumptions with live ROI/NPV recalculation
- **Portfolio management** — Track products with filtering and visualizations
- **Export & share** — PDF reports, JSON/CSV export, shareable URLs

## Tech Stack

- Next.js (App Router, TypeScript, static export)
- Tailwind CSS v4
- jsPDF (client-side PDF generation)
- React Context + localStorage for state
- Vercel for deployment

No backend. No database. No external API calls. Deploys as a static site.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build
```

Produces a static export in `out/`. Deploy to any static host.

## Project Structure

```
src/
├── app/          Pages (landing, assess, portfolio, explore)
├── components/   UI components (matrix, wizard, results, visualizations)
└── lib/          Domain logic (types, questions, scoring, strategies, presets, AI, PDF)
```

## License

MIT

## Created by

**Raka Adrianto**

- GitHub: [@lugasraka](https://github.com/lugasraka)
- LinkedIn: [linkedin.com/in/lugasraka](https://www.linkedin.com/in/lugasraka/)
