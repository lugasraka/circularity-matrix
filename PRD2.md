# Circularity Matrix — Product Requirements Document

**Version:** 1.0 (PRD2)
**Status:** Draft — pending PM Point approval
**Date:** 2026-07-01

---

## 1. Problem

For **strategists, sustainability consultants, and product managers** who must decide how to make a product circular, the problem is that **choosing the right end-of-life strategy is expert-heavy, subjective, and slow** — which **delays decisions and produces recommendations no one can defend to a business audience.** Today they rely on **consultants, spreadsheets, or academic papers**, but these are **costly, inconsistent, and disconnected from a financial business case.**

**Business hypothesis:** We believe giving these users a **guided, framework-based assessment with a transparent financial model** will let them **produce a defensible circular-strategy recommendation in under a minute** because the frameworks (HBR Circularity Matrix, DIN R-Strategy) are established but currently inaccessible without expertise. We'll know it's true if **a first-time user completes an assessment and exports a report in a single session without external help.**

## 2. Target Users & Jobs

| Segment | Job story |
|---|---|
| Business strategist | When evaluating a product line, I want to position it against circular strategies, so I can prioritise investment. |
| Sustainability consultant | When advising a client, I want a repeatable, defensible method, so I can justify recommendations. |
| Product manager | When planning end-of-life, I want strategy + roadmap + ROI in one place, so I can build a business case. |
| Student / researcher | When studying circular models, I want a hands-on tool, so I can apply theory to real products. |

## 3. Goals & Non-Goals

**Goals**
- Turn two academic frameworks into a self-serve, sub-minute assessment.
- Support a defensible business case (roadmap + editable financial model).
- Guarantee data privacy and user data ownership (client-only, portable).

**Non-Goals**
- No multi-user accounts, collaboration, or server-side persistence.
- No AI/LLM API calls or external analytics.
- No prescriptive financial *advice* — the calculator models user-supplied assumptions only.

## 4. Success Metrics

| Type | Metric | Target | Measurement |
|---|---|---|---|
| **North Star** | Assessment completion → report export in one session | ≥ 70% of started assessments | Client-side funnel (localStorage flags) |
| Leading | Time to first result | ≤ 60s median | Timestamp: start → results render |
| Leading | Assessments started from a preset or AI suggestion | ≥ 50% | Assessment source flag |
| Guardrail | Data loss incidents from clearing browser storage | 0 unrecoverable (backup available) | Backup export usage |
| Guardrail | Payload / initial load | ≤ 250 KB before jsPDF | Build output inspection |

> Metrics are client-side and privacy-preserving; no data leaves the browser. Instrumentation itself is **out of scope for v1** and tracked as an open question.

## 5. Functional Requirements

### FR-001: Framework selection
**Priority:** Must

```gherkin
Scenario: User selects a framework
  Given the user is on /assess
  When they choose HBR Matrix or R-Strategy Scorecard
  Then the questionnaire loads the correct question set (8 HBR / 7 R-Strategy)

Scenario: No framework chosen
  Given the user is on /assess
  When no framework is selected
  Then the questionnaire is not shown and a selection prompt is displayed
```

### FR-002: Preset & AI-assisted start
**Priority:** Should

```gherkin
Scenario: Start from a preset
  Given a selected framework
  When the user picks one of the 28 product templates
  Then all answers are pre-filled and remain editable

Scenario: AI suggestion
  Given a product name is entered
  When the user requests AI assistance
  Then answers are suggested client-side with no external API call
```

### FR-003: Questionnaire & scoring
**Priority:** Must

```gherkin
Scenario: Complete assessment maps to a result
  Given all questions are answered
  When the user submits
  Then a strategy recommendation and matrix/scatter position are computed deterministically

Scenario: Incomplete assessment
  Given at least one question is unanswered
  When the user attempts to submit
  Then submission is blocked and unanswered questions are indicated
```

### FR-004: Financial calculator (HBR)
**Priority:** Should

```gherkin
Scenario: Live recalculation on assumption change
  Given a recommended strategy with a financial projection
  When the user edits an assumption (e.g. discount rate, resale price)
  Then investment, ROI, payback, and NPV recalculate immediately

Scenario: Reset to defaults
  Given edited assumptions
  When the user clicks reset
  Then all assumptions return to documented defaults
```

### FR-005: Portfolio management & persistence
**Priority:** Must

```gherkin
Scenario: Persist across sessions
  Given a product is added to the portfolio
  When the browser is reloaded
  Then the product is restored from localStorage

Scenario: Filter by framework
  Given products from both frameworks
  When the user filters by framework
  Then only matching products and the correct visualization are shown
```

### FR-006: Data ownership — backup & restore
**Priority:** Must

```gherkin
Scenario: One-click backup
  Given a non-empty portfolio
  When the user clicks "Back up now"
  Then a complete JSON export is downloaded

Scenario: Restore replaces portfolio
  Given a valid backup file
  When the user restores
  Then the portfolio is replaced while preserving product identity

Scenario: Import merges
  Given a valid export file
  When the user imports
  Then products are appended, optionally filtered by framework
```

### FR-007: Reports & export
**Priority:** Should

```gherkin
Scenario: PDF report
  Given at least one assessed product
  When the user generates a report
  Then a dual-framework PDF is produced client-side (jsPDF loaded on demand)

Scenario: Structured export
  Given assessed products
  When the user exports
  Then JSON/CSV is produced, filterable by framework
```

### FR-008: Explore mode
**Priority:** Could

```gherkin
Scenario: Reference without assessment
  Given the user is on /explore
  When they browse a framework
  Then all strategies/cells are viewable without starting an assessment
```

## 6. Non-Functional Requirements

| ID | Category | Threshold | Method |
|---|---|---|---|
| NFR-001 | Privacy | Zero network calls carrying user data; no cookies/analytics | Network inspection in build + runtime |
| NFR-002 | Performance | Time to interactive ≤ 1.5s on mid-tier laptop; jsPDF excluded from initial bundle | Lighthouse + bundle analysis |
| NFR-003 | Availability | Fully functional offline after first load | Static export served offline |
| NFR-004 | Accessibility | WCAG 2.2 AA for wizard, matrix, and forms | Axe audit + keyboard pass |
| NFR-005 | Portability | Deployable to any static host (no runtime backend) | `output: export` build |
| NFR-006 | Determinism | Identical answers always yield identical result | Unit test on scoring |

## 7. Scope

**In scope (v1):** dual-framework assessment, presets, client-side AI assist, scoring, HBR financial calculator, portfolio with framework filter, backup/restore/import, PDF/JSON/CSV export, explore mode.

**Out of scope:** accounts/auth, server persistence, real-time collaboration, LLM API integration, telemetry backend.

**Deferred:** usage instrumentation for the metrics above; weighted/custom scoring; side-by-side comparison deltas; localisation (strings are i18n-ready in source).

## 8. Constraints & Assumptions

- Static Next.js export; state lives in `localStorage` under `circularity-matrix-portfolio`.
- Portfolio is browser-specific and non-transferable except via backup/import.
- Matrix visualization supports ≤ 15 distinctly-coloured pins; beyond that colours repeat (warning shown).
- Frameworks are fixed to HBR Circularity Matrix and DIN R-Strategy for v1.

## 9. Traceability Matrix

| Business Need | FR/NFR | Status |
|---|---|---|
| Sub-minute defensible recommendation | FR-001, FR-003 | Implemented |
| Fast start | FR-002 | Implemented |
| Business case support | FR-004, FR-007 | Implemented |
| Portfolio insight | FR-005 | Implemented |
| Data ownership & privacy | FR-006, NFR-001 | Implemented |
| Framework learning/reference | FR-008 | Implemented |
| Offline, portable, private | NFR-001, NFR-003, NFR-005 | Implemented |

## 10. Open Questions

| # | Question | Owner | Notes |
|---|---|---|---|
| 1 | How do we measure the North Star without a telemetry backend? | PM | Consider privacy-preserving local counters or opt-in export |
| 2 | Is the 15-product pin limit acceptable, or is a portfolio ceiling needed? | PM/UX | Currently soft limit with warning |
| 3 | Should financial defaults be sourced/citable for credibility? | PM | Affects consultant trust |

## 11. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-01 | Product Manager (AIDE) | Initial problem-first PRD; reframes existing feature set around users, metrics, and acceptance criteria |
