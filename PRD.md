# Circularity Matrix — Product Requirements Document

## 1. Overview

**Product Name:** Circularity Matrix  
**Version:** 1.1  
**Framework Reference:** Atasu, Dumas & Van Wassenhove, "The Circular Business Model," *Harvard Business Review* (July–August 2021)

### 1.1 Purpose

A web-based decision-support tool that helps users identify which circular economy strategy best fits their product based on three dimensions: access to the product after use, process difficulty for value recovery, and embedded value. The tool implements the HBR Circularity Matrix framework, which maps products onto an 8-cell matrix and recommends one or more of three core strategies: **Retain Product Ownership (RPO)**, **Product Life Extension (PLE)**, and **Design for Recycling (DFR)**.

### 1.2 Target Users

- Business strategists evaluating circular economy opportunities  
- Sustainability consultants advising product teams  
- Product managers exploring end-of-life strategies  
- MBA students and researchers studying circular business models

### 1.3 Key Value Propositions

- Structured assessment replaces ad-hoc strategy selection  
- Multi-product portfolio view reveals strategic patterns across a product line  
- What-if analysis shows how changing embedded value shifts recommendations  
- **Product management** — edit, duplicate, and organize products with search and filters  
- **Data portability** — export/import portfolio as JSON or CSV for backup and analysis  
- **Shareable assessments** — generate URLs to share individual product results  
- Exportable PDF reports support stakeholder communication

---

## 2. Core Concepts

### 2.1 Three Strategies

| Strategy | Abbrev. | Description |
|----------|---------|-------------|
| Retain Product Ownership | RPO | Manufacturer retains ownership and sells the function as a service (leasing, pay-per-use). Ensures guaranteed return and control over the asset. |
| Product Life Extension | PLE | Extend useful life through maintenance, repair, refurbishment, or remanufacturing. Preserves embedded value in high-value products. |
| Design for Recycling | DFR | Design products so materials can be efficiently recovered and recycled at end of life. Focuses on material selection, mono-material design, and easy separation. |

### 2.2 Three Dimensions

| Dimension | Scale | Question Count | Description |
|-----------|-------|----------------|-------------|
| Access | Easy ↔ Hard | 3 | How easily the manufacturer can get the product back from the user after use. |
| Process | Easy ↔ Hard | 3 | How difficult it is to recover value from the returned product. |
| Embedded Value | Low ↔ High | 2 | How much material, component, brand, or technology value the product retains. |

### 2.3 The 8-Cell Matrix

The matrix is a 2 × 2 grid (Access × Process) with each cell split by Embedded Value (Low / High), yielding 8 cells:

| Access | Process | Embedded Value | Recommended Strategy | Example |
|--------|---------|----------------|---------------------|---------|
| Easy | Easy | Low | DFR | Aluminum cans (Real Alloy) |
| Easy | Easy | High | PLE + DFR | Branded reusable clothing (Patagonia) |
| Easy | Hard | Low | DFR + Partnerships | Mattresses (DSM-Niaga) |
| Easy | Hard | High | DFR | Consumer electronics (Apple recycling) |
| Hard | Easy | Low | DFR + Infrastructure | Packaging (BioPak) |
| Hard | Easy | High | PLE + RPO | Office equipment (Xerox), Tires (Michelin) |
| Hard | Hard | Low | DFR + RPO | Carpet tiles (Interface) |
| Hard | Hard | High | PLE | Wind turbines, industrial machinery |

---

## 3. Features

### 3.1 Interactive Questionnaire (Assessment Wizard)

**Route:** `/assess`

Users answer 8 questions to place a product on the matrix.

**Flow:**
1. Enter product name  
2. Answer 3 Access questions (distribution model, customer return propensity, reverse logistics maturity)  
3. Answer 3 Process questions (material complexity, disassembly difficulty, use-phase degradation)  
4. Answer 2 Embedded Value questions (material/component value, brand/technology value retention)  
5. View results

**Question Design:**
- Each question offers 5 options scored 1–5  
- Options include a short label and a descriptive sentence  
- **Examples expander** — toggle to see concrete product examples for each option level  
- Progress bar shows current step and active dimension label  
- Back/Next navigation; final step triggers scoring

**Scoring Algorithm:**
1. Normalize each answer to 0–1: `(answer - 1) / (max - 1)`  
2. Average normalized scores per dimension  
3. Threshold at 0.5: `≥ 0.5 → Hard/High`, `< 0.5 → Easy/Low`  
4. Map resulting position to the corresponding matrix cell  

### 3.2 Results View

Displayed after completing the questionnaire and when selecting a product in the portfolio.

**Contents:**
- **Dimension scores** — Three horizontal bars (0–100%) for Access, Process, Embedded Value  
- **Position label** — e.g., "Hard Access × Easy Process × High Embedded Value"  
- **Recommended strategy** — Cell label, color-coded strategy badges, description, real-world examples, implementation guidance  
- **What-if toggle** — Expands a panel showing the strategy recommendation if embedded value were flipped (High → Low or Low → High), same detail format  
- **Strategy glossary** — Brief definitions of RPO, PLE, and DFR for reference  
- **Share button** — Copy a shareable URL to the clipboard for this specific assessment

### 3.3 Circularity Matrix Visualization

An SVG-based 2×2 matrix with embedded value sub-cells.

**Features:**
- Color-coded cells (blue, green, yellow, pink tints)  
- Strategy labels inside each sub-cell  
- Numbered product pins (up to 15 distinct colors) placed in the cell matching each product's position  
- **Interactive pins** — hover for rich tooltips, click to select the product  
- Highlighted border on the selected/active cell  
- Clickable cells (on the Explore page)  
- Compact mode available for sidebar use  
- Axis labels: "Process Difficulty" (x-axis), "Access Difficulty" (y-axis)  
- **Product legend** — sidebar component mapping colors to product names

### 3.4 Multi-Product Portfolio

**Route:** `/portfolio`

Supports assessing and comparing multiple products on a single matrix.

**Layout (3-column on desktop):**
- **Sidebar** — Scrollable product list with colored dots matching matrix pins, strategy badges, position shorthand (e.g., H/E/H), and action buttons  
- **Center** — Full matrix visualization with all product pins. Highlights the cell of the currently selected product. Pins are clickable to select products.  
- **Right panel** — Full results card for the selected product (scores, strategy, what-if, guidance).

**Management:**
- Add products via the assessment wizard  
- **Edit products** — pencil icon reopens wizard with pre-filled answers  
- **Duplicate products** — copy icon creates a duplicate for quick variation testing  
- Remove individual products (instant, no confirmation)  
- Clear all products (two-step confirmation)  
- **Search and filter** — filter by name, strategy, or dimension values  
- Soft warning displayed when portfolio exceeds 15 products  
- State persisted to `localStorage` under key `circularity-matrix-portfolio`

**Data Portability:**
- **Export JSON** — download portfolio as `.json` for backup/sharing  
- **Export CSV** — download portfolio as `.csv` for spreadsheet analysis  
- **Import JSON** — upload previously exported portfolios to merge with current data  
- **PDF Report** — client-side generated multi-page report

### 3.5 Matrix Explorer

**Route:** `/explore`

Standalone interactive reference. No assessment required.

**Features:**
- Click any of the 8 cells to view its strategy details (label, description, examples, guidance, strategy definitions)  
- Axis explanation cards describe what Access and Process dimensions mean  
- Products from the portfolio appear as pins on the matrix for context

### 3.6 PDF Report Generation

**Trigger:** "Download Report" button on the Portfolio page.

**Technology:** Client-side generation via jsPDF (no server round-trip).

**Report Structure:**
- **Page 1 — Portfolio Overview:** Title, framework attribution, generation date, product count, strategy distribution chart, product list with positions  
- **Page 2 — Matrix Visualization:** Rendered 2×4 matrix with colored cells, strategy labels, numbered product pins, axis labels, and a legend mapping numbers to product names  
- **Pages 3+ — Product Detail (one page per product):** Product name, position, dimension scores (0–100%), recommended strategy with description/examples/guidance, what-if scenario, strategy definitions

### 3.7 Landing Page

**Route:** `/`

- Hero section with tagline and CTAs (Start Assessment, Explore Matrix)  
- "How It Works" — three-step visual guide (Assess → Get Strategy → Build Portfolio)  
- Strategy overview cards for RPO, PLE, and DFR with icons and descriptions  
- Bottom CTA to begin assessment

### 3.8 Onboarding & Help

**First-time User Tutorial:**
- 4-step modal shown on first visit  
- Covers: framework overview, three dimensions, three strategies, portfolio features  
- Dismissible; tracks completion in localStorage

**Help Panel:**
- Accessible from any page via (?) button in navigation  
- Slide-out panel with expandable sections:  
  - About the Framework  
  - The Three Strategies  
  - How Scoring Works  
  - Usage Tips  
  - External Resources (HBR article, GitHub, LinkedIn)

---

## 4. Information Architecture

```
/                  Landing page
/assess            Assessment wizard → Results view
/portfolio         Multi-product portfolio dashboard
/explore           Interactive matrix explorer
```

Persistent top navigation bar across all pages with active-state highlighting and help button.

---

## 5. Technical Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) with TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | React Context + `localStorage` persistence |
| PDF Generation | jsPDF (client-side, dynamically imported) |
| Matrix Rendering | Custom SVG (no charting library) |
| URL Sharing | Base64-encoded product data |
| Deployment Target | Static export (`output: 'export'`) — Vercel, Netlify, or any static host |

**Key Architectural Decisions:**
- **No backend / no database.** All state lives in the browser. This keeps the app deployable as a pure static site with zero infrastructure cost.  
- **Dynamic import for jsPDF.** The PDF library (~200 KB) is only loaded when the user clicks "Download Report," keeping the initial bundle small.  
- **SVG over canvas.** The matrix is rendered as SVG for accessibility, crisp scaling, and straightforward interactivity (click handlers on cells).

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| First Contentful Paint | < 1.5 s on 4G |
| Bundle size (initial) | < 200 KB gzipped (jsPDF excluded via dynamic import) |
| Browser support | Modern evergreen browsers (Chrome, Firefox, Safari, Edge) |
| Responsiveness | Usable on tablet and desktop; single-column reflow on mobile |
| Accessibility | Semantic HTML, keyboard-navigable questionnaire, sufficient color contrast |
| Data privacy | No data leaves the browser; no analytics, cookies, or third-party requests |
| Offline capability | Fully functional after initial load (static assets + localStorage) |

---

## 7. Constraints & Limitations

- **No user accounts or cloud sync.** Portfolio data exists only in the current browser's `localStorage`. Clearing browser data deletes the portfolio.  
- **Simplified scoring model.** The three-threshold binary classification (Easy/Hard, Low/High) is a deliberate simplification of continuous dimensions. Edge cases near the 0.5 boundary may feel arbitrary.  
- **8 questions only.** The questionnaire prioritizes speed over granularity. Deep industry-specific nuance is left to the user's interpretation of the guidance text.  
- **PDF layout is fixed.** Report generation uses programmatic coordinate layout, not a templating engine. Complex customization would require significant rework.  
- **15-product soft cap.** The matrix visualization supports up to 15 distinctly colored pins. Beyond that, colors repeat and the matrix becomes crowded.

---

## 8. Changelog

### v1.1 (March 2025)
- **Product management** — Edit and duplicate products  
- **Search and filter** — Portfolio sidebar with search by name/strategy, dimension filters  
- **Data portability** — Export portfolio as JSON or CSV; import JSON backups  
- **Shareable assessments** — Generate URLs to share individual products  
- **Interactive matrix** — Clickable pins with tooltips; product legend  
- **Questionnaire improvements** — Examples expander for each dimension  
- **Onboarding** — First-time tutorial and persistent help panel  
- **UI polish** — Better navigation, action buttons, and visual feedback

### v1.0 (Initial Release)
- Core assessment wizard with 8 questions  
- Matrix visualization with SVG rendering  
- Multi-product portfolio  
- What-if analysis  
- PDF report generation  
- Matrix explorer

---

## 9. Future Considerations

These represent potential future extensions:

- **Comparison mode** to show two products side-by-side with dimension deltas  
- **Custom questions** allowing industry-specific question sets  
- **Server-side persistence** with user accounts for team collaboration  
- **Weighted scoring** letting users adjust dimension importance  
- **Localization** for non-English markets

---

**Created by:** [Raka Adrianto](https://github.com/lugasraka)  
**LinkedIn:** [linkedin.com/in/lugasraka](https://www.linkedin.com/in/lugasraka/)
