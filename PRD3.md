# Circularity Matrix -- Product Requirements Document

**Version:** 2.0 (PRD3)
**Status:** Draft -- pending PM Point approval
**Date:** 2026-07-01

---

## 1. Problem Statement

For **strategists, sustainability consultants, and product managers** evaluating circular economy options, choosing the right end-of-life strategy is expert-dependent, slow, and hard to defend to business stakeholders. Existing approaches (consultants, spreadsheets, academic papers) are costly, inconsistent, and disconnected from financial business cases.

**Hypothesis:** A guided, framework-based assessment with a transparent financial model will let users produce a defensible circular-strategy recommendation in under 60 seconds. We will know this is true if a first-time user completes an assessment and exports a report in a single session without external help.

## 2. Target Users

| Segment | Job to be done |
|---|---|
| Business strategist | Position product lines against circular strategies to prioritise investment |
| Sustainability consultant | Apply a repeatable, defensible method to justify client recommendations |
| Product manager | Get strategy, roadmap, and ROI in one place to build a business case |
| Student / researcher | Apply circular economy theory to real products hands-on |

## 3. Core Features

### Implemented (v1)

| Feature | Description | Framework |
|---|---|---|
| **Dual-framework assessment** | HBR Circularity Matrix (8 questions, 3 strategies: RPO/PLE/DFR) and R-Strategy Scorecard (7 criteria, 5 strategies: Reuse/Refurbish/Remanufacture/Repurpose/Recycle) | Both |
| **Presets and AI assist** | 24+ product templates with pre-filled answers; client-side AI suggestion from product description (no external API) | Both |
| **Deterministic scoring** | Normalised dimension scores map to matrix position (HBR) or suitability/practicality scatter (R-Strategy) | Both |
| **Financial calculator** | Editable assumptions (volume, cost, price, lifespan, discount rate); live recalculation of investment, ROI, payback, NPV | HBR |
| **Portfolio management** | localStorage persistence, framework filtering, product comparison | Both |
| **Backup / restore / import** | JSON export, full restore, merge import with framework filter | Both |
| **PDF / JSON / CSV export** | Client-side report generation (jsPDF loaded on demand) | Both |
| **Explore mode** | Browse framework strategies and matrix cells without starting an assessment | Both |

### Planned (v2 -- not yet committed)

- Usage instrumentation (privacy-preserving, client-side only)
- Weighted / custom scoring profiles
- Side-by-side comparison deltas between products
- Localisation (i18n-ready strings exist in source)
- Shareable assessment links (URL-encoded state, no server)

## 4. Success Metrics

| Type | Metric | Target | How measured |
|---|---|---|---|
| **North Star** | Assessment completion to report export in one session | >= 70% of started assessments | Client-side funnel (localStorage flags) |
| Leading | Time to first result | <= 60s median | Timestamp delta: start to results render |
| Leading | Assessments started from preset or AI suggestion | >= 50% | Assessment source flag |
| Guardrail | Data loss from browser storage clearing | 0 unrecoverable (backup available) | Backup export usage |
| Guardrail | Initial payload size (excluding jsPDF) | <= 250 KB | Build output inspection |

All metrics are client-side and privacy-preserving. No data leaves the browser.

## 5. Non-Functional Requirements

| ID | Category | Requirement | Verification |
|---|---|---|---|
| NFR-01 | Privacy | Zero network calls carrying user data; no cookies or analytics | Network inspection |
| NFR-02 | Performance | TTI <= 1.5s on mid-tier laptop; jsPDF excluded from initial bundle | Lighthouse + bundle analysis |
| NFR-03 | Offline | Fully functional offline after first load | Static export served offline |
| NFR-04 | Accessibility | WCAG 2.2 AA for wizard, matrix, and forms | Axe audit + keyboard pass |
| NFR-05 | Portability | Deployable to any static host (no runtime backend) | Next.js static export |
| NFR-06 | Determinism | Identical answers always yield identical results | Unit tests on scoring |

## 6. Technical Constraints

- **Stack:** Next.js 16 (static export), React 19, TypeScript, Tailwind CSS 4
- **State:** `localStorage` under key `circularity-matrix-portfolio`; browser-specific, non-transferable except via backup/import
- **Visualisation limit:** Matrix supports <= 15 distinctly-coloured pins; beyond that, colours repeat (warning shown)
- **Frameworks:** Fixed to HBR Circularity Matrix and DIN R-Strategy for v1
- **No backend:** All computation, storage, and AI assistance run client-side

## 7. Out of Scope

- User accounts, authentication, or server-side persistence
- Real-time collaboration or multi-user features
- LLM API calls or external AI services
- Telemetry backend or analytics services
- Prescriptive financial advice (calculator models user-supplied assumptions only)

## 8. Risks and Open Questions

| # | Item | Type | Notes |
|---|---|---|---|
| 1 | No telemetry backend to measure North Star metric | Risk | Consider privacy-preserving local counters or opt-in export |
| 2 | 15-product pin limit may be insufficient for power users | Question | Currently soft limit with warning; need user feedback |
| 3 | Financial defaults lack citations | Risk | Affects consultant trust and credibility |
| 4 | localStorage is browser-specific and size-limited (~5 MB) | Risk | Backup/restore mitigates but does not eliminate |

## 9. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 (PRD2) | 2026-07-01 | PM (AIDE) | Initial problem-first PRD |
| 2.0 (PRD3) | 2026-07-01 | PM (AIDE) | Concise rewrite; consolidated feature inventory from implementation; added v2 roadmap items, technical constraints, and risk register |
