# Circularity Matrix — Product Requirements Document

**Version:** 1.2  
**Framework:** Atasu, Dumas & Van Wassenhove, "The Circular Business Model," *Harvard Business Review* (2021)

---

## 1. Overview

### 1.1 Purpose

A web-based decision-support tool that identifies the optimal circular economy strategy for a product using the HBR Circularity Matrix framework. Maps products onto an 8-cell matrix recommending **RPO** (Retain Product Ownership), **PLE** (Product Life Extension), or **DFR** (Design for Recycling).

### 1.2 Target Users

- Business strategists evaluating circular economy opportunities
- Sustainability consultants advising product teams
- Product managers exploring end-of-life strategies
- MBA students and researchers studying circular business models

### 1.3 Key Value Propositions

- **Speed** — Start from templates or AI suggestions; assess in under 1 minute
- **Actionability** — Implementation roadmaps with timelines, stakeholders, and risks
- **Business case support** — Financial ROI calculator with 5-year projections
- **Portfolio insights** — Multi-product comparison on single matrix
- **Privacy-first** — No data leaves the browser

---

## 2. Core Concepts

### 2.1 Three Strategies

| Strategy | Description |
|----------|-------------|
| **RPO** | Retain ownership, sell as service (leasing, pay-per-use) |
| **PLE** | Extend life via repair, refurbishment, remanufacturing |
| **DFR** | Design for material recovery and recycling |

### 2.2 Three Dimensions

| Dimension | Scale | Questions |
|-----------|-------|-----------|
| Access | Easy ↔ Hard | 3 (distribution, returns, reverse logistics) |
| Process | Easy ↔ Hard | 3 (materials, disassembly, degradation) |
| Embedded Value | Low ↔ High | 2 (material value, brand/tech value) |

---

## 3. Features

### 3.1 Assessment Flow

**Route:** `/assess`

1. **Template Selection** (optional) — Choose from 12+ product presets
2. **Product Name + AI Assist** — Describe product; AI suggests answers (client-side)
3. **Questionnaire** — Review/refine 8 questions with smart defaults
4. **Results** — Strategy recommendation + roadmap + financial projections

### 3.2 Results View

- Dimension scores (0–100% bars)
- Recommended strategy with description, examples, guidance
- **Implementation Roadmap** — Phase-by-phase actions (quick/medium/long term) with effort/cost indicators
- **Financial Calculator** — Investment, annual benefit, payback, 5-year ROI/NPV
- What-if toggle (flip embedded value)
- Shareable URL generation

### 3.3 Portfolio Dashboard

**Route:** `/portfolio`

- 3-column layout: product list | matrix visualization | results panel
- Edit, duplicate, search, filter products
- Export JSON/CSV, import JSON
- PDF report generation

### 3.4 Matrix Explorer

**Route:** `/explore`

Browse all 8 cells without assessment. Portfolio products appear as pins for context.

---

## 4. Information Architecture

```
/           Landing page
/assess     Assessment wizard (templates → AI → questions → results)
/portfolio  Multi-product dashboard
/explore    Matrix reference
```

---

## 5. Technical Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| State | React Context + localStorage |
| PDF | jsPDF (dynamic import) |
| Matrix | Custom SVG |

**Key Decisions:**
- No backend/database — pure static site
- AI assistant is client-side rule-based (no API calls)
- jsPDF loaded on-demand

---

## 6. Changelog

### v1.2 (Current)
- **Assessment presets** — 12+ product templates
- **AI-assisted assessment** — Client-side answer suggestions
- **Implementation roadmaps** — Phase-by-phase action plans per strategy
- **Financial calculator** — ROI, NPV, payback estimates

### v1.1
- Product management (edit, duplicate, search, filter)
- Data portability (JSON/CSV export/import)
- Shareable assessment URLs
- Onboarding tutorial

### v1.0
- Core assessment and matrix visualization
- Multi-product portfolio
- PDF report generation

---

**Created by:** [Raka Adrianto](https://github.com/lugasraka)  
**LinkedIn:** [linkedin.com/in/lugasraka](https://www.linkedin.com/in/lugasraka/)
