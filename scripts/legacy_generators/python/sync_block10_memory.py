import csv
import datetime

# 1. Update agent_tasks.csv
tasks_file = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
rows = []
task_ids = {'TASK-1604', 'TASK-1605', 'TASK-1606', 'TASK-1607', 'TASK-1608'}

with open(tasks_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        if row.get('task_id') in task_ids:
            row['status'] = 'COMPLETED'
            row['completion_date'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
            row['notes'] = row.get('notes', '') + ' | Completed and verified with full 5-part LongLesson invariants and Gate v2 visuals.'
        rows.append(row)

with open(tasks_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Updated agent_tasks.csv: marked TASK-1604..1608 as COMPLETED.")

# 2. Update multi_agent_control.csv
mac_file = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = []
with open(mac_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    mac_fieldnames = reader.fieldnames
    for row in reader:
        if row.get('agent_id') == 'AGENT-453':
            row['status'] = 'Completed'
            row['notes'] = 'Completed iot_emb Month 2 Block 10 (Days 46-50: FOTA Topologies, Delta Updates & Milestone 9 Engine).'
        mac_rows.append(row)

with open(mac_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=mac_fieldnames)
    writer.writeheader()
    writer.writerows(mac_rows)

print("Updated multi_agent_control.csv: marked AGENT-453 as Completed.")

# 3. Prepend milestone record in PROJECT_MEMORY.md
mem_file = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(mem_file, 'r', encoding='utf-8') as f:
    mem_text = f.read()

milestone_record = f"""### Milestone Record: Course 14 (`iot_emb`) Month 2 Block 10 (Days 46–50: FOTA Topologies, Delta Updates & Milestone 9)
- **Timestamp**: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Agent**: AGENT-453 on branch `codex/interview-tab-reliability`
- **Scope**: Days 46–50 Complete (50/60 Days Total Complete for `iot_emb`)
- **Key Deliverables**:
  - **Day 46 (`TASK-1604`)**: FOTA Topologies: Dual-Bank Flash, Slot Swapping & Partition Maps (RWW execution, BFB2 Option Byte remap, monotonic 0xFF->0xFE->0xFC->0xF8 trailers, in-place sector swap).
  - **Day 47 (`TASK-1605`)**: Delta Updates & Binary Differential Compression (BSDiff control/diff/extra streams, Google Courgette instruction normalization, streaming XIP reconstruction).
  - **Day 48 (`TASK-1606`)**: Resilient Recovery & Watchdog Rollbacks (Probation trial boot, autonomous canary hardware self-test suite, RTC crash loop counters, immutable write-protected Golden Image fallback).
  - **Day 49 (`TASK-1607`)**: Large-Scale Fleet Management (Canary deployments 1%->10%->100%, >=99.9% crash-free stability invariant, cellular storm jitter backoff, dead device out-of-band BLE rescue).
  - **Day 50 (`TASK-1608`)**: 🏆 **Milestone 9: Zero-Brick Dual-Bank FOTA Firmware Update Engine** (Complete remote firmware lifecycle: chunked download into Slot 1, streaming SHA-256/ECDSA verification, atomic dual-bank BFB2 swap, probation trial boot, autonomous canary hardware self-test, confirmation bit commit, and automatic rollback on power cuts or watchdog trips with `MILESTONE 9 GATE VERDICT: FULLY PASSING & CERTIFIED OPERATIONAL`).
- **Pedagogical Invariants Verified**:
  - Class duration: 38–40 minutes per day.
  - Spoken words: >= 580 words per part (total audio > 2400 words per day).
  - Gate v2 Visuals: Synchronized `register-bits` visual contracts across all 25 parts (`src/lib/data/lessonVisuals/iot_emb/day-46..50.json`).
  - Unit tests: 43/43 tests passing in `tests/iot_emb_days*.test.ts`. TypeScript clean (`tsc --noEmit` = 0 errors).

---
"""

new_mem = mem_text.replace("## 📅 Recent Milestone Records\n", "## 📅 Recent Milestone Records\n" + milestone_record)
if new_mem == mem_text:
    # If header not found exactly, prepend to top
    new_mem = milestone_record + "\n" + mem_text

with open(mem_file, 'w', encoding='utf-8') as f:
    f.write(new_mem)

print("Updated PROJECT_MEMORY.md with Block 10 milestone record.")
