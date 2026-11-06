import csv
import datetime

tasks_file = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
mac_file = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
proj_mem_file = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'

# 1. Update agent_tasks.csv
tasks_to_complete = {'TASK-1614', 'TASK-1615', 'TASK-1616', 'TASK-1617', 'TASK-1618'}
rows = []
with open(tasks_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in tasks_to_complete:
            row[6] = 'COMPLETED'
            row[8] = '100%'
        rows.append(row)

with open(tasks_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print("Updated agent_tasks.csv")

# 2. Update multi_agent_control.csv
mac_rows = []
with open(mac_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        if row and len(row) > 0 and row[0] == 'AGENT-455':
            row[3] = 'Completed'
            row[6] = '100% Course 14 Complete (60/60 Days)'
        mac_rows.append(row)

with open(mac_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Updated multi_agent_control.csv")

# 3. Prepend Milestone record to PROJECT_MEMORY.md
memory_entry = f"""## 🏆 MILESTONE RECORD: Course 14: IoT, Firmware & Embedded Systems (iot_emb) 100% COMPLETE (60/60 Days)
- **Date**: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Agent**: AGENT-455 (Antigravity IDE)
- **Tasks**: TASK-1614 through TASK-1618
- **Commit**: `31167211`
- **Branch**: `codex/interview-tab-reliability` (pushed to origin)
- **Summary**:
  - Fully completed Month 2 Block 12 (Days 56–60), achieving **100% full course completion (60/60 Days)** for Course 14.
  - **Pedagogical Enrichment**:
    - Day 56: Functional Safety & Redundancy: 1oo2 / 2oo3 Voting Architectures, Dual-Core Lockstep & SIL-3 (3,220 words, 26.8 min spoken audio, declared: 38 min).
    - Day 57: Real-World Architecture Deep Dive: Medical Infusion Pump Firmware (3,277 words, 27.3 min spoken audio, declared: 38 min).
    - Day 58: Real-World Architecture Deep Dive: Connected Electric Vehicle Battery Management System (BMS) (3,171 words, 26.4 min spoken audio, declared: 38 min).
    - Day 59: Principal Embedded Systems Engineer RFC & Code Review: The Unbricking Crucible (3,153 words, 26.3 min spoken audio, declared: 38 min).
    - Day 60: Capstone 2: Production-Grade Mission-Critical Edge Computing Engine & Master Capstone Viva Gate (3,099 words, 25.8 min spoken audio, declared: 40 min).
  - **Gate v2 Visuals**:
    - All 5 on-disk visual JSON files compiled: `src/lib/data/lessonVisuals/iot_emb/day-56.json` through `day-60.json`.
    - 4 synchronized steps per visual (`intro`, `say1`, `example`, `tryIt`), tappable register bit labels, exact SHA-256 codeHash matches.
  - **Verification**:
    - Dedicated test suite `tests/iot_emb_days56_60_expansion.test.ts` (5/5 passing).
    - Comprehensive hardware visuals verification suite `tests/iot_hardware_visuals_verification.test.ts` (9/9 passing).
    - Full regression across all IoT test suites (24/24 passing).
    - TypeScript compiler check: `npx tsc --noEmit` = 0 errors.

---
"""

with open(proj_mem_file, 'r', encoding='utf-8') as f:
    existing_mem = f.read()

with open(proj_mem_file, 'w', encoding='utf-8') as f:
    f.write(memory_entry + existing_mem)

print("Updated PROJECT_MEMORY.md")
