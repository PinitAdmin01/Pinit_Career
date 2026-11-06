import csv
import datetime

# 1. Update agent_tasks.csv
tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
rows = []
with open(tasks_csv_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in ["TASK-1739", "TASK-1740", "TASK-1741", "TASK-1742", "TASK-1743"]:
            row[6] = "COMPLETED"
        rows.append(row)

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print("Updated agent_tasks.csv to COMPLETED for TASK-1739..1743")

# 2. Update multi_agent_control.csv
control_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
c_rows = []
with open(control_csv_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] == "AGENT-479":
            row[4] = "Completed"
        c_rows.append(row)

with open(control_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(c_rows)
print("Updated multi_agent_control.csv for AGENT-479 to Completed")

# 3. Update PROJECT_MEMORY.md
project_memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(project_memory_path, "r", encoding="utf-8") as f:
    mem = f.read()

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
entry = f"""
### Course 19: IoT Hardware Security, Root of Trust & Secure Boot (`iot_sec`) - Month 1 Block 4 & Milestone 4 (Completed {now_str})
- **Days Completed**: Days 16–20 (5 days, 25 parts). Total Course 19 progress: 20 / 30 Days (66.7% of Month 1).
- **Milestone 4 Certified**: ⭐ Day 20: IEEE 802.1AR Secure Device Identity & Bare-Metal TLS 1.3 Handshake Engine (`ApexMilestone4TlsIdentityEngine`).
- **Pedagogical Invariants Met**:
  - Day 16: [610, 611, 603, 606, 611] words (Total: 3,041)
  - Day 17: [601, 680, 580, 604, 588] words (Total: 3,053)
  - Day 18: [602, 595, 607, 620, 601] words (Total: 3,025)
  - Day 19: [580, 604, 589, 594, 607] words (Total: 2,974)
  - Day 20: [602, 609, 589, 581, 587] words (Total: 2,968)
  - Total Block 4 Word Count: **15,061 words** (all 25 parts strictly >= 580 words).
- **Gate v2 Visuals**: 25 visual envelopes compiled to `src/lib/data/lessonVisuals/iot_sec/day-{{16..20}}.json`.
- **Test Suite**: 6/6 tests passing in `tests/iot_sec_days16_20_expansion.test.ts` (18/18 overall `iot_sec` test suite passing).
- **Git Commit**: `a2b15e34` pushed to `codex/interview-tab-reliability`.
"""

mem += entry
with open(project_memory_path, "w", encoding="utf-8") as f:
    f.write(mem)
print("Updated PROJECT_MEMORY.md successfully!")
