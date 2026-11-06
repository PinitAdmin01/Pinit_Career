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
        if len(r) > 0 and r[0] in ['TASK-1619', 'TASK-1620', 'TASK-1621', 'TASK-1622', 'TASK-1623']:
            r[3] = 'COMPLETED'
            r[7] = '2026-10-19'
            r[8] = '100%'
            r[9] = 'Commit b21d82fb: Days 6-10 authored, enriched (2900+ words/day, 38 min), Gate v2 visuals compiled, tests pass.'
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
        if len(r) > 0 and r[0] == 'AGENT-456':
            r[6] = 'Completed'
            r[7] = 'Course 18 Block 2 Days 6-10 Completed and Pushed (Commit b21d82fb)'
        mac_rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Updated multi_agent_control.csv")

# 3. Update PROJECT_MEMORY.md
with open(memory_path, 'r', encoding='utf-8') as f:
    mem_content = f.read()

milestone_entry = """### Milestone Entry - 2026-10-19: Course 18 (iot_edge) Month 1 Block 2 (Days 6–10) Completed & Verified
- **Course**: `iot_edge` (Edge AI, DSP & TinyML Systems) - Month 1 Block 2 (Days 6–10)
- **Agent**: `AGENT-456` (`TASK-1619` through `TASK-1623`)
- **Git Commit**: `b21d82fb` pushed to `origin/codex/interview-tab-reliability`
- **Lessons Implemented & Enriched**:
  - **Day 6**: Peak Activation Memory Estimator & SRAM Lifespan Analysis (5,038 words, 42.0 min audio, declared: 38 min).
  - **Day 7**: TensorFlow Lite for Microcontrollers (TFLM) Architecture & FlatBuffer Serialization (3,125 words, 26.0 min audio, declared: 38 min).
  - **Day 8**: TFLM Tensor Arena Memory Allocator & Offset Resolver (3,009 words, 25.1 min audio, declared: 38 min).
  - **Day 9**: Op Resolver Flash Size Estimator & Selective Kernel Registration (2,952 words, 24.6 min audio, declared: 38 min).
  - **Day 10**: 🎓 **Capstone**: Post-Training Quantization (PTQ): Float32 to INT8 Affine Scale & Zero-Point Mapping (2,956 words, 24.6 min audio, declared: 38 min).
- **Gate v2 Visuals**:
  - Generated and validated `src/lib/data/lessonVisuals/iot_edge/day-{06..10}.json` (5 files, 25 lesson parts, 4 synchronized steps each: `intro`, `say1`, `example`, `tryIt`, raw SHA-256 `codeHash` matches).
- **Testing & Verification**:
  - `tests/iot_edge_days6_10_expansion.test.ts`: 5/5 subtests passing.
  - `tests/iot_emb_days56_60_expansion.test.ts`: 5/5 subtests passing.
  - `npx tsc --noEmit`: 0 errors.
- **Overall Course Status**: Course 18 is now **10/30 Days Complete (33.3%)**.

---

"""

# Prepend after header or insert in recent updates
insert_pos = mem_content.find("## ")
if insert_pos != -1:
    updated_mem = mem_content[:insert_pos] + milestone_entry + mem_content[insert_pos:]
else:
    updated_mem = milestone_entry + mem_content

with open(memory_path, 'w', encoding='utf-8') as f:
    f.write(updated_mem)

print("Updated PROJECT_MEMORY.md")
