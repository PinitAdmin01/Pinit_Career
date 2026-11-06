# Branch C Mission Mandate: Commerce Month 2 Enterprise Expansion (Courses 8–14)

**Directive Date**: 2026-10-21  
**Worktree Workspace**: `C:\Users\Admin\Desktop\projects\Present-Career-os-platform`  
**Git Branch**: `agent/branch-c-platform-admin-faculty`  
**Parent Strategy**: Tri-Stream Multi-Agent Parallel Execution  

---

## 🎯 Executive Overview & Rebalance Mandate
To accelerate curriculum delivery across the Master Specification (`docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md`), the 14 B.Com / Commerce courses have been evenly partitioned between **Branch B** and **Branch C**:
* **Branch B** (`Present-Career-os-commerce`): Focuses on **Courses 1 to 7** (`bcom_acc` through `bcom_ecom`).
* **Branch C** (`Present-Career-os-platform`): Focuses on **Courses 8 to 14** (`bcom_ent` through `bcom_ana`).

---

## 📚 Branch C Assigned Courses & Target Milestones

| # | Course ID | Track Name | Month 1 Foundation (Days 1–30) | Branch C Target: Month 2 (Days 31–60) | Target Total Days |
|---|---|---|:---:|:---:|:---:|
| **08** | `bcom_ent` | Entrepreneurship & Venture Incubation | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **09** | `bcom_law` | Corporate Law, IBC & Compliance | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **10** | `bcom_ops` | Operations Management & Logistics | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **11** | `bcom_scrm`| Supply Chain & Vendor Risk Management | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **12** | `bcom_tax` | Direct & Indirect Taxation | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **13** | `bcom_ait` | AI & Fintech in Business Systems | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **14** | `bcom_ana` | Business Analytics & Decision Models | ⚠️ Days 1–5 Base (Needs Days 6–30) | **Days 31–60 (30 Days)** | **60 Days** |

**Total Curriculum Scope for Branch C**: **235 Days** of deep enterprise masterclass content.

---

## 📐 Strict Pedagogical & Engineering Invariants (Zero-Hallucination)
Every lesson added in Branch C **MUST** adhere to the standard PinIT Masterclass invariants:
1. **5 Parts per Day**: Each day contains exactly 5 detailed pedagogical parts.
2. **Word Count Strict Threshold**:
   - Every single part **MUST be $\ge 580$ words** (no shortcuts, no placeholder text).
   - Average per day must be **$\ge 3,000$ words**.
3. **Execution Runtime**:
   - `minutes: 38` across all days.
   - Standalone standard-library Python code or deterministic TypeScript code.
   - Code outputs must match terminal executions 100%.
4. **Assessment Invariant**:
   - 4 selectable options.
   - `answerIndex: 0` (or `answer: 0`) is always the correct answer.
   - Deep `why` explanation citing statutory sections, economic theorems, or algorithmic formulations.
5. **Gate v2 Visual Envelopes**:
   - Every day requires a corresponding visual file at `src/lib/data/lessonVisuals/<coursePrefix>/day-<N>.json`.
   - Conforms strictly to Gate v2 schemas.
6. **Testing & Verification**:
   - Write unit tests in `tests/` verifying parts, word counts, and deterministic code execution.
   - Run `npx tsc --noEmit` to ensure 0 TypeScript compilation errors.
7. **Commit & Central Memory Synchronization**:
   - Commit in blocks of 5 days (e.g., `feat(bcom_ent): complete Month 2 Block 7 Days 31-35`).
   - Push to `origin/agent/branch-c-platform-admin-faculty`.
   - Update `C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md`, `agent_tasks.csv`, and `multi_agent_control.csv`.

---

## 🚀 Recommended Execution Order for Branch C Agent
1. **Course 08 (`bcom_ent`)**:
   - Block 7: Days 31–35 (Cap Tables, Waterfall Modeling & SAFEs)
   - Block 8: Days 36–40 (Venture Debt, Term Sheet Covenants & Down Rounds)
   - Block 9: Days 41–45 (Cross-Border Flips, Tax Structuring & Holding Cos)
   - Block 10: Days 46–50 (Series B Scaling, Unit Economics & Churn Decay)
   - Block 11: Days 51–55 (IPO Readiness, DRHP Filing & Governance Committees)
   - Block 12: Days 56–60 (Venture Partner Capstone & Unicorn Boardroom Defense)
2. **Follow with Course 09 (`bcom_law`)**, **Course 10 (`bcom_ops`)**, etc.
