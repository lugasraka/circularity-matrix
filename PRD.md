# Circularity Matrix — Product Requirements Document

**Version:** 2.0  
**Frameworks:** 
- HBR Circularity Matrix (Atasu, Dumas & Van Wassenhove, 2021)
- R-Strategy Scorecard (DIN framework)

---

## 1. Overview

### 1.1 Purpose

A web-based decision-support tool that identifies the optimal circular economy strategy for products using two complementary frameworks:

- **HBR Circularity Matrix** — Maps products to RPO, PLE, or DFR strategies
- **R-Strategy Scorecard** — Evaluates suitability vs. practicality for 5 R-strategies (Reuse, Refurbish, Remanufacture, Repurpose, Recycle)

### 1.2 Target Users

- Business strategists evaluating circular economy opportunities
- Sustainability consultants advising product teams
- Product managers exploring end-of-life strategies
- MBA students and researchers studying circular business models

### 1.3 Key Value Propositions

- **Dual frameworks** — Choose HBR Matrix for strategic positioning or R-Strategy for operational guidance
- **Speed** — Start from 28 product templates or AI suggestions; assess in under 1 minute
- **Actionability** — Implementation roadmaps with timelines and stakeholders
- **Business case support** — Financial ROI calculator with 5-year projections
- **Portfolio insights** — Multi-product comparison with framework filtering
- **Privacy-first** — No data leaves the browser

---

## 2. Core Concepts

### 2.1 HBR Circularity Matrix

| Strategy | Description |
|----------|-------------|
| **RPO** | Retain ownership, sell as service (leasing, pay-per-use) |
| **PLE** | Extend life via repair, refurbishment, remanufacturing |
| **DFR** | Design for material recovery and recycling |

**Dimensions:** Access (3 questions), Process (3 questions), Embedded Value (2 questions)

### 2.2 R-Strategy Scorecard

| Strategy | Description |
|----------|-------------|
| **Reuse** | Direct reuse without modification |
| **Refurbish** | Restore to working condition |
| **Remanufacture** | Rebuild to original specifications |
| **Repurpose** | Use for a different function |
| **Recycle** | Recover materials |

**Criteria:** Suitability (4 criteria) + Practicality (3 criteria)

---

## 3. Features

### 3.1 Assessment Flow

**Route:** `/assess`

1. **Framework Selection** — Choose HBR Matrix or R-Strategy Scorecard
2. **Template Selection** (optional) — Choose from 28 product presets
3. **Product Name + AI Assist** — AI suggests answers (client-side)
4. **Questionnaire** — 8 questions (HBR) or 7 questions (R-Strategy)
5. **Results** — Strategy recommendation + roadmap + financial projections

### 3.2 Portfolio Dashboard

**Route:** `/portfolio`

- Framework filter (HBR / R-Strategy)
- Matrix visualization (HBR) or scatter plot (R-Strategy)
- Edit, duplicate, search products
- Export JSON/CSV by framework
- PDF report generation (dual-framework support)

### 3.3 Matrix Explorer

**Route:** `/explore`

Browse both frameworks without assessment.

---

## 4. Information Architecture

```
/           Landing page
/assess     Assessment wizard (framework → templates → AI → questions → results)
/portfolio  Multi-product dashboard with framework filter
/explore    Dual-framework reference
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

### v2.0 (Current)
- **Dual framework support** — HBR Matrix + R-Strategy Scorecard
- **28 assessment presets** — 12 HBR + 16 R-Strategy templates
- **Framework filtering** — View HBR or R-Strategy products separately
- **Enhanced PDF reports** — Both frameworks in single export

### v1.2
- 12 product templates
- AI-assisted assessment
- Implementation roadmaps
- Financial calculator

### v1.0
- Core assessment and matrix visualization
- Multi-product portfolio
- PDF report generation

---

**Created by:** [Raka Adrianto](https://github.com/lugasraka)  
**LinkedIn:** [linkedin.com/in/lugasraka](https://www.linkedin.com/in/lugasraka/)
