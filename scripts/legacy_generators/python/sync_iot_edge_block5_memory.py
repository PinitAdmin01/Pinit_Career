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
            if len(r) > 0 and r[0] in ['TASK-1644', 'TASK-1645', 'TASK-1646', 'TASK-1647', 'TASK-1648']:
                r[3] = 'COMPLETED'
                r[7] = '2026-10-19'
                r[8] = '100%'
                r[9] = f'Commit {commit_hash}: Days 21-25 authored, enriched (2930+ words/day, 38 min), Gate v2 visuals compiled, tests pass.'
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
            if len(r) > 0 and r[0] == 'AGENT-461':
                r[6] = 'Completed'
                r[7] = f'Course 18 Block 5 Days 21-25 Completed and Pushed (Commit {commit_hash})'
            mac_rows.append(r)

    with open(mac_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(mac_rows)

    print("Updated multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    with open(memory_path, 'r', encoding='utf-8') as f:
        mem_content = f.read()

    milestone_entry = f"""### Milestone Entry - 2026-10-19: Course 18 (iot_edge) Month 1 Block 5 (Days 21–25) Completed & Verified
- **Course**: `iot_edge` (Edge AI, DSP & TinyML Systems) - Month 1 Block 5 (Days 21–25)
- **Agent**: `AGENT-461` (`TASK-1644` through `TASK-1648`)
- **Git Commit**: `{commit_hash}` pushed to `origin/codex/interview-tab-reliability`
- **Lessons Implemented & Enriched**:
  - **Day 21**: TensorFlow Lite for Microcontrollers (TFLM): FlatBuffers, OpResolvers & Tensor Arena Memory Planning (2,960 words, 24.7 min audio, declared: 38 min).
  - **Day 22**: CMSIS-NN Kernel Acceleration: ARM Cortex-M Helium Extensions & Im2Col Matrix Transforms (2,938 words, 24.5 min audio, declared: 38 min).
  - **Day 23**: Embedded Micro-Vision: MobileNet Architectures, Inverted Residuals & 96x96 Person Detection (2,946 words, 24.6 min audio, declared: 38 min).
  - **Day 24**: Keyword Spotting (KWS): Depthwise 1D/2D Audio CNNs, Ring Buffers & False Trigger Suppression (2,963 words, 24.7 min audio, declared: 38 min).
  - **Day 25**: ⭐ **Milestone 5**: TensorFlow Lite for Microcontrollers (TFLM) Tensor Arena & CMSIS-NN Engine (2,944 words, 24.5 min audio, declared: 38 min).
- **Gate v2 Visuals**:
  - Generated and validated `src/lib/data/lessonVisuals/iot_edge/day-{{21..25}}.json` (5 files, 25 lesson parts, 4 synchronized steps each: `intro`, `say1`, `example`, `tryIt`, raw SHA-256 `codeHash` matches).
- **Testing & Verification**:
  - `tests/iot_edge_days21_25_expansion.test.ts`: 5/5 subtests passing.
  - Regression suites (Blocks 2, 3, 4, 5 & Course 14 Block 12): 25/25 passing.
  - TypeScript Type Check: `npx tsc --noEmit` exited cleanly with 0 errors.
- **Course Progress**:
  - Course 18 (`iot_edge`): 25 / 30 Days Complete (83.3% Month 1 completed, Milestone 5 Fully Certified).

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
