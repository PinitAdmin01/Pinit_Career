import csv
import os
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

# 1. Update agent_tasks.csv
rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) > 0 and r[0] in ['TASK-1624', 'TASK-1625', 'TASK-1626', 'TASK-1627', 'TASK-1628']:
            r[3] = 'COMPLETED'
            r[7] = '2026-10-19'
            r[8] = '100%'
            r[9] = 'Commit 5780c99f: Days 11-15 authored, enriched (2950+ words/day, 38 min), Gate v2 visuals compiled, tests pass.'
        rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print("Updated agent_tasks.csv")

# 2. Update multi_agent_control.csv
mac_rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) > 0 and r[0] == 'AGENT-457':
            r[6] = 'Completed'
            r[7] = 'Course 18 Block 3 Days 11-15 Completed and Pushed (Commit 5780c99f)'
        mac_rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Updated multi_agent_control.csv")

# 3. Update PROJECT_MEMORY.md
with open(memory_path, 'r', encoding='utf-8') as f:
    mem_content = f.read()

milestone_entry = """### Milestone Entry - 2026-10-19: Course 18 (iot_edge) Month 1 Block 3 (Days 11–15) Completed & Verified
- **Course**: `iot_edge` (Edge AI, DSP & TinyML Systems) - Month 1 Block 3 (Days 11–15)
- **Agent**: `AGENT-457` (`TASK-1624` through `TASK-1628`)
- **Git Commit**: `5780c99f` pushed to `origin/codex/interview-tab-reliability`
- **Lessons Implemented & Enriched**:
  - **Day 11**: Float32 to INT8 Affine Quantizer & Dequantizer Engine (2,950 words, 24.6 min audio, declared: 38 min).
  - **Day 12**: INT8 to Float Dequantizer & CMSIS-NN Quantized Operators (2,950 words, 24.6 min audio, declared: 38 min).
  - **Day 13**: ⭐ **Milestone 1**: Complete INT8 Quantized Neural Network Interpreter Engine (2,954 words, 24.6 min audio, declared: 38 min).
  - **Day 14**: INT8 TinyML Inference Engine Master Kernel (3,053 words, 25.4 min audio, declared: 38 min).
  - **Day 15**: 🎓 **Capstone**: Model Compression Factor Calculator & SRAM/Flash Watermark Benchmark (3,052 words, 25.4 min audio, declared: 38 min).
- **Gate v2 Visuals**:
  - Generated and validated `src/lib/data/lessonVisuals/iot_edge/day-{11..15}.json` (5 files, 25 lesson parts, 4 synchronized steps each: `intro`, `say1`, `example`, `tryIt`, raw SHA-256 `codeHash` matches).
- **Testing & Verification**:
  - `tests/iot_edge_days11_15_expansion.test.ts`: 5/5 subtests passing.
  - Regression suites (`tests/iot_edge_days6_10_expansion.test.ts`, `tests/iot_emb_days56_60_expansion.test.ts`): 15/15 passing.
  - TypeScript Type Check: `npx tsc --noEmit` exited cleanly with 0 errors.
- **Course Progress**:
  - Course 18 (`iot_edge`): 15 / 30 Days Complete (50% Month 1 completed, Milestone 1 Fully Certified).

"""

# Prepend after header or at top of milestones
if "## Active Architecture Decisions & Milestones" in mem_content:
    parts = mem_content.split("## Active Architecture Decisions & Milestones", 1)
    new_mem = parts[0] + "## Active Architecture Decisions & Milestones\n\n" + milestone_entry + parts[1]
else:
    new_mem = milestone_entry + "\n" + mem_content

with open(memory_path, 'w', encoding='utf-8') as f:
    f.write(new_mem)

print("Updated PROJECT_MEMORY.md")
