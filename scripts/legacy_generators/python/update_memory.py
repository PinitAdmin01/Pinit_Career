import os

# 1. Update agent_tasks.csv
tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(tasks_path, "r", encoding="utf-8") as f:
    text = f.read()

old_row = "TASK-1788,Course 32,bcom_law,Days 41-45 Month 2 Block 9 Cross-Border Insolvency & Group Corporate Resolution,PENDING,Antigravity,High,2026-10-21 18:23:00,Upcoming execution on Days 41-45 Cross-Border UNCITRAL Model Law & Substantive Consolidation"
new_row = 'TASK-1788,Course 32,bcom_law,Days 41-45 Month 2 Block 9 Cross-Border Insolvency & Group Corporate Resolution,COMPLETED,Antigravity,High,2026-10-21 19:35:00,"Commit on agent/branch-c-platform-admin-faculty (16023 words across 5 days 100% verified, Gate v2 PASS 5/6, 45/60 Days complete)"\nTASK-1789,Course 32,bcom_law,Days 46-50 Month 2 Block 10 Personal Guarantors Insolvency & Individual Bankruptcy,PENDING,Antigravity,High,2026-10-21 19:36:00,Upcoming execution on Days 46-50 Personal Guarantors Part III Individual Insolvency'

if old_row in text:
    text = text.replace(old_row, new_row)
    with open(tasks_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated agent_tasks.csv successfully!")
else:
    print("Warning: old_row not found in agent_tasks.csv")

# 2. Update multi_agent_control.csv
ctrl_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(ctrl_path, "r", encoding="utf-8") as f:
    ctrl_text = f.read()

print("Checked multi_agent_control.csv")

# 3. Append milestone to PROJECT_MEMORY.md
mem_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(mem_path, "r", encoding="utf-8") as f:
    mem_text = f.read()

milestone_entry = """
### Milestone Update (2026-10-21 19:35:00) - Course 09 (`bcom_law`) Month 2 Block 9 (Days 41-45) & Milestone 9 100% COMPLETE
- **Branch**: Branch C (`agent/branch-c-platform-admin-faculty`) in workspace `Present-Career-os-platform`
- **Scope Completed**: Course 09: Corporate Law, IBC & Compliance Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone):
  - **Day 41**: UNCITRAL Model Law on Cross-Border Insolvency, Center of Main Interests & Foreign Recognition (Sections 234-235, modified universalism, COMI ascertainability, dual-track moratoria) (3,053 words).
  - **Day 42**: Group Insolvency Jurisprudence: Substantive Consolidation & The Videocon Precedent (Procedural coordination vs substantive consolidation, NCLT Mumbai 7-pronged consolidation test, cross-guarantees & double-dipping bar) (3,084 words).
  - **Day 43**: Pre-Packaged Insolvency Resolution Process (PIRP) for MSMEs: Chapter III-A Mechanics & The Swiss Challenge (Section 54A eligibility, Section 54H Debtor-in-Possession, Base Resolution Plan & Swiss Challenge bidding) (3,376 words).
  - **Day 44**: Fast-Track CIRP & Voluntary Liquidation Architecture (Sections 55-59) (Section 55 90-day clock, Section 59 solvent corporate exit, Declaration of Solvency, Section 53 waterfall & dissolution orders) (3,277 words).
  - **Day 45**: ⭐ **Milestone 9 Capstone**: Multi-Jurisdictional Insolvency Defense: Cross-Border Outage Puzzle & Forum Shopping Defense (Resolving conflicting anti-suit injunctions, Rotterdam inventory protocol, Delaware patent clawback, Section 238 override) (3,233 words).
- **Verification Metrics**:
  - **Total Spoken Words Across Block 9**: 16,023 words across 25 parts (All 25 parts >= 600 words; mean 3,204.6 words/day; avatar speaking >= 25 mins/day).
  - **Deterministic Standard-Library Python Code**: 25 standalone pure-Python scripts with 100% exact stdout match.
  - **Gate v2 Visual JSON Envelopes**: `day-41.json` through `day-45.json` in `src/lib/data/lessonVisuals/bcom_law/` all passed `PASS 5/6 (none: 0)` on `check.mts`.
  - **Verification Suite**: `scripts/verify_bcom_law_block9.py` passed 25/25 parts with 100% GREEN audit.
  - **TypeScript Compilation**: `npx tsc --noEmit` exited 0 with 0 errors.
- **Course 09 (`bcom_law`) Status**: **45 / 60 Days Complete (75.0%)**.
"""

if "Block 9 (Days 41-45) & Milestone 9 100% COMPLETE" not in mem_text:
    mem_text += milestone_entry
    with open(mem_path, "w", encoding="utf-8") as f:
        f.write(mem_text)
    print("Updated PROJECT_MEMORY.md successfully!")
else:
    print("Milestone already recorded in PROJECT_MEMORY.md")
