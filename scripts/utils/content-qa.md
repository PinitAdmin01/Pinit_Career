# PinIT Career OS — Content QA Report

Generated: 2026-08-25T21:56:05.570Z

> Measured by importing the real TypeScript modules the application uses.
> The loader runs `transpileOnly` — this report does **not** typecheck.
> `npx tsc --noEmit` remains a separate mandatory gate.

**Courses:** 36 · **Blocks:** 3258 · **FATAL:** 0 · **DEFECT:** 270

## Per-course metrics

| Course | Shape | Days | Blocks | B/day | Authored distractors | Magic const | Pre-solved (JS) | Budget >2 | Distinct MC | MC/block | Transfer | Analogy | Prereq shape | Binding |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| course-3d-graphics | Array | 30 | 90 | 3 | 28.9% | 13.3% | 100% | 93.3% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-ai-digital-transformation | Array | 30 | 90 | 3 | 0% | 73.3% | 100% | 43.3% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-ai-eng | Array | 30 | 90 | 3 | 37.8% | 23.3% | 100% | 86.7% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-ai-prompt-literacy | Array | 30 | 90 | 3 | 0% | 80% | 100% | 38.9% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-blockchain-web3 | Array | 30 | 90 | 3 | 31.1% | 26.7% | 98.3% | 95.6% | 26 | 0.29 | 0 | 0 | dag | OK |
| course-business-analytics | Array | 30 | 90 | 3 | 0% | 35.6% | 98.3% | 90% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-cloud-native | Array | 30 | 90 | 3 | 28.9% | 12.2% | 93.2% | 78.9% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-computer-fundamentals | Array | 30 | 90 | 3 | 0% | 66.7% | 100% | 52.2% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-cybersecurity | Array | 30 | 90 | 3 | 0% | 52.2% | 98.3% | 38.9% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-database-eng | Array | 30 | 91 | 3 | 27.5% | 3.3% | 0% | 52.7% | 26 | 0.29 | 0 | 4 | dag | OK |
| course-design-systems | Array | 30 | 90 | 3 | 0% | 45.6% | 100% | 37.8% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-devops-cicd | Array | 30 | 90 | 3 | 33.3% | 22.2% | 88.3% | 86.7% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-digital-accounting | Array | 30 | 90 | 3 | 0% | 51.1% | 98.3% | 87.8% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-digital-marketing | Array | 30 | 90 | 3 | 0% | 51.1% | 100% | 62.2% | 26 | 0.29 | 0 | 0 | dag | OK |
| course-distributed-sys | Array | 30 | 90 | 3 | 33.3% | 22.2% | 100% | 91.1% | 29 | 0.32 | 0 | 0 | dag | OK |
| course-dsa-optim | Array | 30 | 90 | 3 | 14.4% | 0% | 88.3% | 76.7% | 27 | 0.3 | 0 | 1 | dag | OK |
| course-ecommerce-digital-biz | Array | 30 | 90 | 3 | 0% | 56.7% | 98.3% | 53.3% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-entrepreneurship-biz-mgmt | Array | 30 | 90 | 3 | 0% | 52.2% | 100% | 56.7% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-excel-data-viz | Array | 30 | 90 | 3 | 0% | 57.8% | 100% | 38.9% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-finance-investment | Array | 30 | 90 | 3 | 0% | 38.9% | 98.3% | 85.6% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-fullstack-js | Array | 30 | 90 | 3 | 25.6% | 3.3% | 76.7% | 72.2% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-git-version-control | Array | 30 | 90 | 3 | 0% | 33.3% | 98.3% | 40% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-iot-edge-ai | Record | 30 | 90 | 3 | 4.4% | 28.9% | 95% | 96.7% | 29 | 0.32 | 0 | 0 | dag | OK |
| course-iot-embedded | Array | 30 | 90 | 3 | 27.8% | 7.8% | 100% | 94.4% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-iot-network | Array | 30 | 90 | 3 | 17.8% | 25.6% | 95% | 95.6% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-iot-security | Array | 30 | 90 | 3 | 6.7% | 45.6% | 98.3% | 95.6% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-java-logic | Array | 30 | 103 | 3.4 | 69.9% | 0% | unmeasured | 7.8% | 72 | 0.7 | 0 | 54 | dag | OK |
| course-marketing-branding | Array | 30 | 90 | 3 | 0% | 61.1% | 100% | 83.3% | 26 | 0.29 | 0 | 0 | dag | OK |
| course-mobile-dev | Array | 30 | 90 | 3 | 0% | 54.4% | 100% | 38.9% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-nlp | Array | 30 | 90 | 3 | 0% | 40% | 98.3% | 38.9% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-operations-supplychain-compliance | Array | 30 | 90 | 3 | 0% | 64.4% | 100% | 62.2% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-python-backend | Array | 30 | 93 | 3.1 | 38.7% | 0% | 0% | 12.9% | 59 | 0.63 | 0 | 26 | dag | OK |
| course-quant-systems | Array | 30 | 90 | 3 | 0% | 36.7% | 98.3% | 95.6% | 28 | 0.31 | 0 | 0 | dag | OK |
| course-react-web | Array | 30 | 91 | 3 | 36.3% | 1.1% | 0% | 39.6% | 27 | 0.3 | 0 | 14 | dag | OK |
| course-sales-crm-success | Array | 30 | 90 | 3 | 0% | 57.8% | 100% | 52.2% | 27 | 0.3 | 0 | 0 | dag | OK |
| course-softskills-communication | Array | 30 | 90 | 3 | 0% | 61.1% | 100% | 38.9% | 27 | 0.3 | 0 | 0 | dag | OK |

## Cross-course duplication

- Diagnostic questions appearing in more than one course: **4**
  - `30` courses — "What certification string confirms Milestone 1 completion?"
  - `30` courses — "What certification string confirms Milestone 2 completion?"
  - `30` courses — "What certification string confirms Milestone 3 completion?"
  - `3` courses — "What credential title is officially conferred upon course graduation?"
- Recovery explanations reused verbatim: **24** distinct strings
  - 175× — "Matches header string."
  - 49× — "Matches status string."
  - 10× — "Score is 100/100."
  - 7× — "Matches milestone header."
  - 7× — "Type 3."
  - 3× — "Matches header."
  - 3× — "4 * 5 = 20."
  - 3× — "sqrt(250,000) = 500."
  - 3× — "Type 4."
  - 3× — "Count is 2."

## Defect findings by code

- **STARTER_LIKELY_PRESOLVED** — 138 occurrence(s) across 5 course(s)
- **NO_TRANSFER_TASKS** — 36 occurrence(s) across 36 course(s)
- **LOW_MISCONCEPTION_DENSITY** — 34 occurrence(s) across 34 course(s)
- **PRESOLVED_EXAMS** — 32 occurrence(s) across 32 course(s)
- **TOPIC_SHAPED_TAXONOMY** — 26 occurrence(s) across 26 course(s)
- **MISSING_PREREQUISITE** — 3 occurrence(s) across 2 course(s)
- **EXPORT_SHAPE_RECORD** — 1 occurrence(s) across 1 course(s)
