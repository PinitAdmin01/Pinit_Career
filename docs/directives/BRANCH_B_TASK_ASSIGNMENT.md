# Branch B Mission Mandate: Commerce Month 2 Enterprise Expansion (Courses 1–7)

**Directive Date**: 2026-10-21  
**Worktree Workspace**: `C:\Users\Admin\Desktop\projects\Present-Career-os-commerce`  
**Git Branch**: `agent/branch-b-curriculum-commerce-iot`  
**Parent Strategy**: Tri-Stream Multi-Agent Parallel Execution  

---

## 🎯 Executive Overview & Ground-Truth Clarification

### 1. Platform-Wide Month 1 Status (No More Confusion!)
* **Platform-Wide Month 1 Completion**: **97.8% Complete (35 / 37 Courses Done)**.
* **Why did Branch B think 14 Commerce courses only had 5 days in Branch A?**
  - **Branch A** is working on the **Tech / IoT track** in a separate workspace (`Present-Career-os`). It has not yet pulled Branch B's commerce commits into its working directory.
  - Inside **Branch B's actual workspace** (`Present-Career-os-commerce`), **13 of the 14 Commerce courses ALREADY have all 30 days of Month 1 100% complete**!
  - Across the entire platform, the **ONLY TWO COURSES** missing Month 1 days are:
    1. `iot_net` (IoT Networking): At Day 20 / 30 (Missing Days 21–30). 👉 **Branch A is actively completing this.**
    2. `bcom_ana` (Business Analytics): At Day 5 / 30 (Missing Days 6–30). 👉 **Branch C is assigned to complete this.**

### 2. Multi-Agent Workload Division
To prevent duplication and guarantee zero-conflict parallel execution:
* **Branch A (`Present-Career-os`)**: Exclusively handles **Tech & IoT** (`iot_net` Month 1 Days 21–30, then Month 2 Days 31–60, followed by other Tech courses).
* **Branch B (`Present-Career-os-commerce`)**: Exclusively handles **Commerce Courses 1 to 7 Month 2 (Days 31–60)**.
* **Branch C (`Present-Career-os-platform`)**: Exclusively handles **Commerce Courses 8 to 14 Month 2 (Days 31–60)** + completing `bcom_ana` Days 6–30. (Branch C is already actively expanding `bcom_ent` at Day 53!).

---

## 📚 Branch B Assigned Courses: Month 2 (Days 31–60)

Branch B owns the first 7 Commerce courses. Month 1 (Days 1–30) is **ALREADY COMPLETE** for all 7 courses. Your mission is **Month 2 (Days 31–60)**:

| # | Course ID | Track Name | Month 1 Foundation (Days 1–30) | Branch B Target: Month 2 (Days 31–60) | Final Target |
|---|---|---|:---:|:---:|:---:|
| **01** | `bcom_acc` / `bcom_accounting` | Accounting & Forensic Bookkeeping | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **02** | `bcom_fin` / `bcom_finance` | Corporate Finance & Capital Markets | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **03** | `bcom_mkt` | Strategic Marketing & Brand Systems | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **04** | `bcom_aud` | Statutory Audit & Corporate Assurance | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **05** | `bcom_ban` | Banking, Treasury & Credit Operations | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **06** | `bcom_dmkt` | Digital Marketing Analytics & Performance | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |
| **07** | `bcom_ecom` | E-Commerce Platform Architecture | ✅ Complete (Days 1–30) | **Days 31–60 (30 Days)** | **60 Days** |

**Total Scope for Branch B**: Exactly **210 Days** (7 courses × 30 days).

---

## 📐 Strict Pedagogical & Engineering Invariants (Zero-Hallucination)
Every lesson added in Branch B **MUST** adhere to the standard PinIT Masterclass invariants:
1. **5 Parts per Day**: Each day contains exactly 5 detailed pedagogical parts.
2. **Word Count Strict Threshold**:
   - Every single part **MUST be $\ge 580$ words** (no placeholders, no fluff).
   - Average per day must be **$\ge 3,000$ words**.
3. **Execution Runtime**:
   - `minutes: 38` across all days.
   - Standalone standard-library Python code or deterministic TypeScript code.
   - Code outputs must match terminal executions 100%.
4. **Assessment Invariant**:
   - 4 selectable options.
   - `answerIndex: 0` (or `answer: 0`) is always the correct answer.
   - Deep `why` explanation citing statutory regulations, accounting standards (Ind AS / IFRS / GAAP), financial formulas, or economic theorems.
5. **Gate v2 Visual Envelopes**:
   - Every day requires a corresponding visual file at `src/lib/data/lessonVisuals/<coursePrefix>/day-<N>.json`.
   - Conforms strictly to Gate v2 schemas (`schemaVersion: 1`, bound code hashes).
6. **Testing & Verification**:
   - Write unit tests in `tests/` verifying parts, word counts, and deterministic code execution.
   - Run `npx tsc --noEmit` to ensure 0 TypeScript compilation errors.
7. **Commit & Central Memory Synchronization**:
   - Commit in blocks of 5 days (e.g., `feat(bcom_acc): complete Month 2 Block 7 Days 31-35`).
   - Push to `origin/agent/branch-b-curriculum-commerce-iot`.
   - Update `C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md`, `agent_tasks.csv`, and `multi_agent_control.csv`.

---

## 🚀 Execution Order for Branch B Agent
Start with **Course 01: `bcom_acc` (Accounting & Forensic Bookkeeping)**:
- **Block 7**: Days 31–35 (Forensic Accounting, Benford's Law, Fraud Triangle & Journal Entry Testing)
- **Block 8**: Days 36–40 (Consolidated Financial Statements, Ind AS 110 / IFRS 10 & Minority Interest)
- **Block 9**: Days 41–45 (Deferred Tax Accounting, Ind AS 12 & Temporary vs Permanent Differences)
- **Block 10**: Days 46–50 (Derivative Accounting, Hedge Accounting & MTM Valuation)
- **Block 11**: Days 51–55 (Insolvency & Bankruptcy Code Liquidation Accounting)
- **Block 12**: Days 56–60 (Forensic Audit Capstone & Corporate Governance Masterclass)

Then proceed sequentially to **Course 02 (`bcom_fin`)**, **Course 03 (`bcom_mkt`)**, etc.
