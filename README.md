# Circularity Matrix

A decision-support tool that helps identify the right circular economy strategy for a product, based on the HBR Circularity Matrix framework [Atasu, Dumas & Van Wassenhove, 2021](https://hbr.org/2021/07/the-circular-business-model).

Users answer 8 questions across three dimensions — access difficulty, process difficulty, and embedded value — and the tool maps their product onto an 8-cell matrix recommending one or more strategies: Retain Product Ownership (RPO), Product Life Extension (PLE), or Design for Recycling (DFR).

On a personal note, I built this project as I worked on portfolio circularity assessments at a large industrial tech company. I wanted a simple, interactive way to apply the HBR framework to our products and communicate strategy recommendations to stakeholders. This tool is the result — a lightweight, client-side app that can be easily deployed and shared.

### Access the live demo of the [Circularity-Matrix App](https://circularity-matrix.vercel.app/)

## Demo/Screenshot

![Homepage-Circularity Matrix](public/{0C157B32-D906-488F-9EEC-8D3C9C63C5BF}.png)

![Portffolio-Circularity Visualization](public/{C184AC68-01DD-46D3-A011-9916E1992EBE}.png)

## Features

- **Assessment wizard** — 8-question questionnaire that scores and places a product on the matrix
- **Matrix visualization** — SVG-based 2x2 grid with embedded value sub-cells and numbered product pins
- **Multi-product portfolio** — Assess multiple products and compare them on a single matrix
- **Product management** — Edit existing products, duplicate for variations, search and filter your portfolio
- **What-if analysis** — Toggle embedded value to see how the recommendation shifts
- **Data portability** — Export portfolio as JSON (backup/sharing) or CSV (analysis), import JSON backups
- **Share assessments** — Generate shareable URLs for individual products
- **PDF report** — Client-side export of the full portfolio with matrix visualization and per-product details
- **Matrix explorer** — Browse all 8 cells and their strategies without taking the quiz
- **Onboarding** — First-time tutorial and persistent help panel

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
├── components/   UI components (matrix, wizard, results, product list, onboarding, help panel)
└── lib/          Domain logic (types, questions, scoring, strategies, PDF, share-utils)
```

## License

MIT

## Created by
**Raka Adrianto** — Sustainability Product Manager

- GitHub: [@lugasraka](https://github.com/lugasraka)
- LinkedIn: [linkedin.com/in/lugasraka](https://www.linkedin.com/in/lugasraka/)

---

Any feedback or contributions are welcome! Please open an issue or submit a pull request.
