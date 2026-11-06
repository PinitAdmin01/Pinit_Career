import csv
import datetime

print("=== UPDATING CENTRAL SHARED MEMORY FOR BLOCK 10 (DAYS 46-50) ===")

# 1. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(pm_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

block10_entry = """
### Milestone Record: Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 10 Complete (Days 46-50 & Milestone 10 Capstone)
- **Agent**: AGENT-501 (Branch B - Commerce & Financial Architecture)
- **Worktree**: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os-commerce`
- **Branch**: `agent/branch-b-curriculum-commerce-iot`
- **Scope**: Days 46–50 (5 Days, 25 Parts)
  - **Day 46**: Financial Statement Diagnostics & Advanced Ratio Analysis (Liquidity: Current, Quick, Cash, DIR; Solvency: Debt-to-Equity, ICR, tax-adjusted DSCR 3.0x; CCC 79.1d) (3,026 words). Emitted confirmation: `FINANCIAL_RATIO_DIAGNOSTICS_PASS`.
  - **Day 47**: DuPont Analysis & Return on Equity (ROE) Decomposition (3-Stage and 5-Stage Extended Models, ROE 24.94%, NOPAT $17.96M, ROIC 19.11% vs WACC 11.50%, EVA $7,149,680.00) (3,030 words). Emitted confirmation: `DUPONT_ROE_DECOMPOSITION_PASS`.
  - **Day 48**: Operating & Financial Leverage Dynamics (DOL 1.60x, DFL 1.25x, DCL 2.00x, EBIT-EPS Indifference $12.5M, Altman Z-Score 3.92 Safe Zone) (3,015 words). Emitted confirmation: `LEVERAGE_AND_DISTRESS_ANALYSIS_PASS`.
  - **Day 49**: Quality of Earnings & Forensic Accounting Diagnostics (Cash Flow Realism 1.20x, Sloan Total Accruals -$3,033,600.00, Accrual Ratio -2.59%, 8-variable Beneish M-Score -2.09 Low Risk) (3,006 words). Emitted confirmation: `EARNINGS_QUALITY_FORENSIC_PASS`.
  - **Day 50 (⭐ Milestone 10 Capstone)**: Advanced Corporate Financial Diagnostics & Forensic Audit Simulator (Simultaneous 4-domain synthesis, executive CFO & audit partner sign-off under CARO 2020 Clause 3(xi)/(xix)) (3,000 words). Emitted confirmation: `CORPORATE_FINANCIAL_DIAGNOSTICS_SUITE_PASS`.
- **Invariants**: 100% adherence to 5-part architecture, >= 580 words per part, >= 3,000 words per day, `check.answer: 0`, `check.answerIndex: 0`, Gate v2 visual envelopes in `src/lib/data/lessonVisuals/bcom-accounting/day-46.json` through `day-50.json` (ledger-sheet template with balanced postings and SHA-256 code hashes).
- **Verification**: All 12 tests in `tests/bcom_accounting_days46_50_expansion.test.ts` passed. All 112 regression tests passed. TypeScript check (`npx tsc --noEmit`) exited cleanly with 0 errors. Pushed to remote branch `agent/branch-b-curriculum-commerce-iot`.
- **Course 01 Overall Status**: 50 / 60 Days Complete (83.3% Conquered).
- **Next Target**: Block 11 (Days 51-55: Ind AS 36 Asset Impairments, Ind AS 38 Intangible Assets, Ind AS 113 Fair Value Measurement, Ind AS 105 Held for Sale, and Day 55 Milestone 11 Capstone).
"""

if "Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 10" not in pm_content:
    with open(pm_path, "a", encoding="utf-8") as f:
        f.write("\n" + block10_entry.strip() + "\n")
    print("Appended Block 10 to PROJECT_MEMORY.md")
else:
    print("Block 10 already noted in PROJECT_MEMORY.md")

# 2. Update agent_tasks.csv
tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
rows = []
fieldnames = []
with open(tasks_csv_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    fieldnames = header
    for r in reader:
        if r and len(r) >= 5:
            tid = r[0].strip()
            # Mark TASK-1881 to TASK-1885 as Completed
            if tid in [f"TASK-{i}" for i in range(1881, 1886)]:
                r[4] = "Completed"
        rows.append(r)

# Register Block 11 tasks TASK-1886 to TASK-1890 as Active
existing_tids = {r[0].strip() for r in rows if r}
block11_tasks = [
    ("TASK-1886", "bcom_acc Day 51: Ind AS 36 Impairment of Assets (CGU, Value in Use, Discount Rate, Impairment Loss & Reversal)", "Course 01 Block 11", "AGENT-501", "Active"),
    ("TASK-1887", "bcom_acc Day 52: Ind AS 38 Intangible Assets (R&D Capitalization, Finite vs Indefinite Useful Life, Amortization & Impairment)", "Course 01 Block 11", "AGENT-501", "Active"),
    ("TASK-1888", "bcom_acc Day 53: Ind AS 113 Fair Value Measurement (Fair Value Hierarchy Level 1/2/3, Valuation Techniques & Unobservable Inputs)", "Course 01 Block 11", "AGENT-501", "Active"),
    ("TASK-1889", "bcom_acc Day 54: Ind AS 105 Non-Current Assets Held for Sale & Discontinued Operations (Abandonment, Abandoned Group & Disclosures)", "Course 01 Block 11", "AGENT-501", "Active"),
    ("TASK-1890", "bcom_acc Day 55: Milestone 11 Capstone: Enterprise Asset Valuation, Impairment & Fair Value Measurement Suite", "Course 01 Block 11", "AGENT-501", "Active"),
]

for t in block11_tasks:
    if t[0] not in existing_tids:
        rows.append(list(t))

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    writer.writerows(rows)
print("Updated agent_tasks.csv (TASK-1881..1885 Completed, TASK-1886..1890 Active)")

# 3. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
mac_rows = []
with open(mac_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    for r in reader:
        if r and len(r) >= 3 and r[0].strip() == "AGENT-501":
            r[2] = "Active: Course 01 bcom_acc Block 11 (Days 51-55: Asset Impairments & Valuation)"
        mac_rows.append(r)

with open(mac_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(mac_rows)
print("Updated multi_agent_control.csv for AGENT-501")
