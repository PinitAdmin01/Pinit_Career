import csv

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
for r in csv.reader(open(mac_path, 'r', encoding='utf-8')):
    if len(r) > 0 and r[0] == 'AGENT-448':
        r = ['AGENT-448', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1579..1583', 'Completed', 'c2b50274', 'Course 14 (iot_emb) Month 1 Block 5: Days 21-25 Complete, verified & pushed (c2b50274). 25/30 Days Complete.']
    rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print('Updated multi_agent_control.csv for AGENT-448!')

# 2. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_rows = []
tasks_to_complete = {'TASK-1579', 'TASK-1580', 'TASK-1581', 'TASK-1582', 'TASK-1583'}
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
print('Updated agent_tasks.csv marking TASK-1579..1583 as COMPLETED!')

# 3. Prepend to PROJECT_MEMORY.md
milestone_entry = """## [2026-10-19 00:27:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 1 Block 5 (Days 21–25: Real-Time Operating Systems: FreeRTOS Kernel, Task Scheduling, Semaphores & Queues) 100% COMPLETE & CERTIFIED

- **Agent**: AGENT-448 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1579..1583 (Marked COMPLETED in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: c2b50274)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: iot_emb)
  - **Month 1 Block 1 (Days 1–5: Architecture & Bitwise I/O)**: Complete (100%)
  - **Month 1 Block 2 (Days 6–10: Serial Communications & Hardware Buses)**: Complete (100%)
  - **Month 1 Block 3 (Days 11–15: Interrupts, Timers, SAR ADC & Real-Time DMA)**: Complete (100%)
  - **Month 1 Block 4 (Days 16–20: DMA Streams, Circular Streaming, D-Cache & Watchdogs)**: Complete (100%)
  - **Month 1 Block 5 (Days 21–25: FreeRTOS Kernel, Task Scheduling, Semaphores & Queues)**: **100% COMPLETE & VERIFIED**
    - **Day 21 (TASK-1579)**: Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks & Stacks
    - **Day 22 (TASK-1580)**: Preemptive Scheduling & Context Switching: PendSV Exception, SysTick & Assembly Stack Swapping
    - **Day 23 (TASK-1581)**: Task Synchronization: Semaphores, Mutexes & Priority Inversion (The Mars Pathfinder Incident)
    - **Day 24 (TASK-1582)**: Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications & Event Groups
    - **Day 25 (TASK-1583)**: 🏆 **Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine (4 Prioritized Concurrent Tasks, Sub-2μs Scheduling Jitter, Priority-Inheritance Mutexes & Inter-Task Queues)**
  - **Course Progress**: **25 of 30 Days Complete (83.33%)**
- **Invariants Enforced & Quality Assurance**:
  - Strict 5-part LongLesson structure per day with deep technical explanations, C++ FreeRTOS kernel constructs (`TCB_t`, `pxTopOfStack`, `SCB_ICSR`, `SCB_SHPR3`, `xTaskNotifyGive`, `portYIELD_FROM_ISR`), terminal outputs, codeNotes, tryIt exercises, and socratic check questions (answer: 0).
  - Gate v2 Visual JSON contracts generated and SHA-256 hash verified in `src/lib/data/lessonVisuals/iot_emb/day-21.json` through `day-25.json` using the `register-bits` template with 4 synchronized steps (`intro`, `say1`, `example`, `tryIt`).
  - Unit test suite `tests/iot_emb_days21_25_expansion.test.ts` passing 100% (5 subtests, 0 failures).
  - Clean TypeScript compilation (`npx tsc --noEmit`) with 0 errors across the codebase.

---

"""

mem_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(mem_path, 'r', encoding='utf-8') as f:
    old_mem = f.read()

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(milestone_entry + old_mem)

print('Prepended Milestone 5 update to PROJECT_MEMORY.md successfully!')
