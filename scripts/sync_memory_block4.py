import csv

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
for r in csv.reader(open(mac_path, 'r', encoding='utf-8')):
    if len(r) > 0 and r[0] == 'AGENT-447':
        r = ['AGENT-447', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1574..1578', 'Completed', '3a19f623', 'Course 14 (iot_emb) Month 1 Block 4: Days 16-20 Complete, verified & pushed (3a19f623). 20/30 Days Complete.']
    rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print('Updated multi_agent_control.csv for AGENT-447!')

# 2. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_rows = []
tasks_to_complete = {'TASK-1574', 'TASK-1575', 'TASK-1576', 'TASK-1577', 'TASK-1578'}
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        if r.get('Task_ID') in tasks_to_complete:
            r['Status'] = 'COMPLETED'
        task_rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(task_rows)
print('Updated agent_tasks.csv marking TASK-1574..1578 as COMPLETED!')

# 3. Prepend to PROJECT_MEMORY.md
milestone_entry = """## [2026-10-19 00:20:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 1 Block 4 (Days 16–20: DMA Controller, Circular Streaming Buffers, D-Cache Coherence, Hardware Watchdogs & Milestone 4 Engine) 100% COMPLETE & CERTIFIED

- **Agent**: AGENT-447 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1574..1578 (Marked COMPLETED in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: 3a19f623)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: iot_emb)
  - **Month 1 Block 1 (Days 1–5: Architecture & Bitwise I/O)**: Complete (100%)
  - **Month 1 Block 2 (Days 6–10: Serial Communications & Hardware Buses)**: Complete (100%)
  - **Month 1 Block 3 (Days 11–15: Interrupts, Timers, SAR ADC & Real-Time DMA)**: Complete (100%)
  - **Month 1 Block 4 (Days 16–20: DMA Streams, Circular Streaming, D-Cache & Watchdogs)**: **100% COMPLETE & VERIFIED**
    - **Day 16 (TASK-1574)**: Direct Memory Access (DMA) Controller: Streams, Channels & Bus Matrix Arbitration
    - **Day 17 (TASK-1575)**: Circular DMA & Ping-Pong Buffers: Half-Transfer (HT) & Transfer-Complete (TC) Zero-Copy Streaming
    - **Day 18 (TASK-1576)**: Cache Coherency & Memory Barriers: D-Cache Invalidation, Clean-and-Invalidate & Cortex-M7 Physics
    - **Day 19 (TASK-1577)**: Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) & Anti-Freeze Fail-Safes
    - **Day 20 (TASK-1578)**: 🏆 **Milestone 4: Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine (Circular Ingestion, 32B Cache Alignment, Multi-Task Heartbeats & Post-Mortem RCC Diagnostics)**
  - **Course Progress**: **20 of 30 Days Complete (66.67%)**
- **Invariants Enforced & Quality Assurance**:
  - Strict 5-part LongLesson structure per day with deep technical explanations, C++ bitwise and hardware register definitions (DMA_SxCR, DMA_SxNDTR, SCB_CCR, IWDG_KR, WWDG_CR), terminal outputs, codeNotes, tryIt exercises, and socratic check questions (answer: 0).
  - Gate v2 Visual JSON contracts generated and SHA-256 hash verified in src/lib/data/lessonVisuals/iot_emb/day-16.json through day-20.json using the register-bits template with 4 synchronized steps (intro, say1, example, tryIt).
  - Unit test suite tests/iot_hardware_visuals_verification.test.ts passing 100% across all Days 1–20 (4 test suites, all passing).
  - Clean TypeScript compilation (npx tsc --noEmit) with 0 errors across the codebase.

---

"""

mem_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(mem_path, 'r', encoding='utf-8') as f:
    old_mem = f.read()

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(milestone_entry + old_mem)

print('Prepended Milestone 4 update to PROJECT_MEMORY.md successfully!')
