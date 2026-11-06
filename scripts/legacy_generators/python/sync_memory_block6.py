import csv

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
for r in csv.reader(open(mac_path, 'r', encoding='utf-8')):
    if len(r) > 0 and r[0] == 'AGENT-449':
        r = ['AGENT-449', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1584..1588', 'Completed', '207dcbf9', 'Course 14 (iot_emb) Month 1 Block 6: Days 26-30 Complete, verified & pushed (207dcbf9). Month 1 100% COMPLETE (30/30 Days).']
    rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print('Updated multi_agent_control.csv for AGENT-449!')

# 2. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_rows = []
tasks_to_complete = {'TASK-1584', 'TASK-1585', 'TASK-1586', 'TASK-1587', 'TASK-1588'}
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        if r.get('Task_ID') in tasks_to_complete:
            r['Status'] = 'COMPLETED'
            r['Dark_Gracity_Ref'] = 'COMPLETED'
        task_rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(task_rows)
print('Updated agent_tasks.csv marking TASK-1584..1588 as COMPLETED!')

# 3. Prepend to PROJECT_MEMORY.md
milestone_entry = """## [2026-10-19 00:36:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 1 Block 6 (Days 26–30: Static RTOS Memory, Software Timers, Tickless Low-Power Mode, MISRA-C Safety, Fault Crash Forensics & Capstone 1 Viva Voce Gate) 100% COMPLETE & MONTH 1 CERTIFIED

- **Agent**: AGENT-449 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1584..1588 (Marked COMPLETED in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: 207dcbf9)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: iot_emb)
  - **Month 1 Block 1 (Days 1–5: Architecture & Bitwise I/O)**: Complete (100%)
  - **Month 1 Block 2 (Days 6–10: Serial Communications & Hardware Buses)**: Complete (100%)
  - **Month 1 Block 3 (Days 11–15: Interrupts, Timers, SAR ADC & Real-Time DMA)**: Complete (100%)
  - **Month 1 Block 4 (Days 16–20: DMA Streams, Circular Streaming, D-Cache & Watchdogs)**: Complete (100%)
  - **Month 1 Block 5 (Days 21–25: FreeRTOS Kernel, Task Scheduling, Semaphores & Queues)**: Complete (100%)
  - **Month 1 Block 6 (Days 26–30: Static Memory, Tickless Idle, MISRA-C, Fault Handlers & Capstone 1)**: **100% COMPLETE & VERIFIED**
    - **Day 26 (TASK-1584)**: RTOS Dynamic Memory Allocation: heap_1 through heap_5, Fragmentation & Static Allocation
    - **Day 27 (TASK-1585)**: Software Timers & Idle Task Hook: Watchdog Kicking & Tickless Low-Power Mode (WFI/WFE)
    - **Day 28 (TASK-1586)**: MISRA-C & ISO 26262 Coding Standards: Static Analysis, Undefined Behavior & Safe Embedded Patterns
    - **Day 29 (TASK-1587)**: Production Hardware Debugging: SWD/JTAG Protocols, Fault Handlers & Core Dump Forensics
    - **Day 30 (TASK-1588)**: 🏆 **Capstone 1: NanoRTOS Preemptive Kernel & Multitasking Firmware Engine Capstone Viva Gate (Flight-Grade 30-Day Synthesis, Clock Tree, Circular DMA, RMS Schedulability, Priority Inheritance & Live Fault Forensics)**
  - **Month 1 Progress**: **30 of 30 Days Complete (100.0% OF MONTH 1 COMPLETE)**
  - **Overall 60-Day Track Progress**: **30 of 60 Days Complete (50.0%)**
- **Invariants Enforced & Quality Assurance**:
  - Strict 5-part LongLesson structure per day with deep technical explanations, C++ FreeRTOS constructs (`StaticTask_t`, `xTaskCreateStatic`, `portSUPPRESS_TICKS_AND_SLEEP`, `SCB_SHCSR`, `SCB_CFSR`, `BFAR`), terminal outputs, codeNotes, tryIt exercises, and socratic check questions (answer: 0).
  - Gate v2 Visual JSON contracts generated and SHA-256 hash verified in `src/lib/data/lessonVisuals/iot_emb/day-26.json` through `day-30.json` using the `register-bits` template with 4 synchronized steps (`intro`, `say1`, `example`, `tryIt`).
  - Unit test suite `tests/iot_emb_days26_30_expansion.test.ts` passing 100% (5 subtests, 0 failures), along with complete regression verification across all 30 days (`tests/iot_emb_days6_10...`, `days11_15...`, `days16_20...`, `days21_25...`, `days26_30...` — 25/25 subtests passing).
  - Clean TypeScript compilation (`npx tsc --noEmit`) with 0 errors across the codebase.

---

"""

mem_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(mem_path, 'r', encoding='utf-8') as f:
    old_mem = f.read()

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(milestone_entry + old_mem)

print('Prepended Milestone 6 / Month 1 Capstone update to PROJECT_MEMORY.md successfully!')
