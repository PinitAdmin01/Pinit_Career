import csv
import os
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

def sync_memory(commit_hash="PENDING"):
    # 1. Update agent_tasks.csv
    rows = []
    with open(tasks_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for r in reader:
            if len(r) > 0 and r[0] in ['TASK-1634', 'TASK-1635', 'TASK-1636', 'TASK-1637', 'TASK-1638']:
                r[3] = 'COMPLETED'
                r[7] = '2026-10-19'
                r[8] = '100%'
                r[9] = f'Commit {commit_hash}: Days 16-20 authored, enriched (2940+ words/day, 38 min), Gate v2 visuals compiled, tests pass.'
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
            if len(r) > 0 and r[0] == 'AGENT-459':
                r[6] = 'Completed'
                r[7] = f'Course 18 Block 4 Days 16-20 Completed and Pushed (Commit {commit_hash})'
            mac_rows.append(r)

    with open(mac_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(mac_rows)

    print("Updated multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    with open(memory_path, 'r', encoding='utf-8') as f:
        mem_content = f.read()

    milestone_entry = f"""### Milestone Entry - 2026-10-19: Course 18 (iot_edge) Month 1 Block 4 (Days 16–20) Completed & Verified
- **Course**: `iot_edge` (Edge AI, DSP & TinyML Systems) - Month 1 Block 4 (Days 16–20)
- **Agent**: `AGENT-459` (`TASK-1634` through `TASK-1638`)
- **Git Commit**: `{commit_hash}` pushed to `origin/codex/interview-tab-reliability`
- **Lessons Implemented & Enriched**:
  - **Day 16**: Model Quantization Fundamentals: FP32 to INT8 Mapping, Scale, Zero-Point & Dynamic Range (3,075 words, 25.6 min audio, declared: 38 min).
  - **Day 17**: Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT) & Calibration Data (2,995 words, 24.9 min audio, declared: 38 min).
  - **Day 18**: Weight Pruning & Sparsity: Magnitude Pruning, Structured Channel Pruning & CSR Storage (2,948 words, 24.5 min audio, declared: 38 min).
  - **Day 19**: Knowledge Distillation for Microcontrollers: Teacher-Student Networks & Temperature Scaling (2,982 words, 24.8 min audio, declared: 38 min).
  - **Day 20**: ⭐ **Milestone 4**: INT8 Post-Training Quantization & Structured Pruning Optimization Engine (3,017 words, 25.1 min audio, declared: 38 min).
- **Gate v2 Visuals**:
  - Generated and validated `src/lib/data/lessonVisuals/iot_edge/day-{{16..20}}.json` (5 files, 25 lesson parts, 4 synchronized steps each: `intro`, `say1`, `example`, `tryIt`, raw SHA-256 `codeHash` matches).
- **Testing & Verification**:
  - `tests/iot_edge_days16_20_expansion.test.ts`: 5/5 subtests passing.
  - Regression suites (`tests/iot_edge_days6_10_expansion.test.ts`, `tests/iot_edge_days11_15_expansion.test.ts`, `tests/iot_emb_days56_60_expansion.test.ts`): 20/20 passing.
  - TypeScript Type Check: `npx tsc --noEmit` exited cleanly with 0 errors.
- **Course Progress**:
  - Course 18 (`iot_edge`): 20 / 30 Days Complete (66.7% Month 1 completed, Milestone 4 Fully Certified).

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

if __name__ == '__main__':
    import sys
    commit = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
    sync_memory(commit)
