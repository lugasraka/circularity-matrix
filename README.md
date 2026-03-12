# Circularity Matrix

A decision-support tool that helps identify the right circular economy strategy for a product, based on the HBR Circularity Matrix framework [Atasu, Dumas & Van Wassenhove, 2021](https://hbr.org/2021/07/the-circular-business-model).

Users answer 8 questions across three dimensions — access difficulty, process difficulty, and embedded value — and the tool maps their product onto an 8-cell matrix recommending one or more strategies: Retain Product Ownership (RPO), Product Life Extension (PLE), or Design for Recycling (DFR).

On a personal note, I built this project as I worked on portfolio circularity assessments at a large industrial tech company. I wanted a simple, interactive way to apply the HBR framework to our products and communicate strategy recommendations to stakeholders. This tool is the result — a lightweight, client-side app that can be easily deployed and shared.

## Features

- **Assessment wizard** — 8-question questionnaire that scores and places a product on the matrix
- **Matrix visualization** — SVG-based 2x2 grid with embedded value sub-cells and numbered product pins
- **Multi-product portfolio** — Assess multiple products and compare them on a single matrix
- **What-if analysis** — Toggle embedded value to see how the recommendation shifts
- **PDF report** — Client-side export of the full portfolio with matrix visualization and per-product details
- **Matrix explorer** — Browse all 8 cells and their strategies without taking the quiz

## Tech Stack

- Next.js (App Router, TypeScript, static export)
- Tailwind CSS v4
- jsPDF (client-side PDF generation, dynamically imported)
- React Context + localStorage for state persistence

No backend. No database. Deploys as a static site.

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

Produces a static export in `out/`. Deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project Structure

```
src/
├── app/          Pages (landing, assess, portfolio, explore)
├── components/   UI components (matrix, wizard, results, product list)
└── lib/          Domain logic (types, questions, scoring, strategies, PDF)
```

## License

MIT

## Created by
[Raka Adrianto, Sustainability Product Manager](https://github.com/lugasraka)