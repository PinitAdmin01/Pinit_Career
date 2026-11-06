import csv
import datetime

# 1. Update PROJECT_MEMORY.md
project_memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(project_memory_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

target_marker = "## 4. Golden Rules for Antigravity & Sub-Agents in this Codebase\n"
new_entry = """* **2026-10-17 (Antigravity - 🎯 10-TASK BATCH PROTOCOL COMPLETE: EXCEL_VIZ DAYS 27–30 & ⭐ MILESTONE 6 GRAND FINAL CAPSTONE (100% COURSE 24 COMPLETE) + COMP_FUND DAYS 6–11 COMPLETED - TASK-961..970):**
  - **Item 1: Excel Viz Day 27 LongLesson & Visual Suite (TASK-961):** Advanced Power Query M Language, Web Scraping, Fuzzy Matching & Multi-Source Reconciliation (3,166 words, 21.1 spoken min, 35m total duration). Generated `src/lib/data/lessonVisuals/excel_viz/day-27.json`.
  - **Item 2: Excel Viz Day 28 LongLesson & Visual Suite (TASK-962):** Multi-Entity Financial Consolidation & Global Currency Translation under GAAP/IFRS & ASC 830 (3,390 words, 22.6 spoken min, 38m total duration). Generated `src/lib/data/lessonVisuals/excel_viz/day-28.json`.
  - **Item 3: Excel Viz Day 29 LongLesson & Visual Suite (TASK-963):** Real-Time Financial Telemetry: Executive KPI Cockpits, Dynamic Slicers & Boardroom Storytelling (3,342 words, 22.3 spoken min, 37m total duration). Generated `src/lib/data/lessonVisuals/excel_viz/day-29.json`.
  - **Item 4: Excel Viz Day 30 LongLesson & Visual Suite & ⭐ Milestone 6 Grand Final Capstone (TASK-964):** Sovereign Enterprise Corporate Financial OS & Autonomous Treasury Platform (3,271 words, 21.8 spoken min, 40m total duration). Course 24 (`excel_viz`) is now officially 100% COMPLETE (30/30 days). Generated `src/lib/data/lessonVisuals/excel_viz/day-30.json`.
  - **Item 5: Computer Fundamentals Day 6 LongLesson & Visual Suite (TASK-965):** Process Management, Multitasking & Linux CPU Scheduling: Process Control Block (PCB/task_struct), PID/PPID hierarchy, multithreading synchronization, CPU context switching, Linux Completely Fair Scheduler (CFS), and cgroups v2 CPU throttling (3,541 words, 23.6 spoken min). Generated `src/lib/data/lessonVisuals/comp_fund/day-06.json`.
  - **Item 6: Computer Fundamentals Day 7 LongLesson & Visual Suite (TASK-966):** Computer Memory Hierarchy: L1/L2/L3 CPU Caches, RAM & Virtual Paging: Latency gap (ns vs ms), spatial/temporal locality, 64-byte cache lines, set-associative caches, MESI coherence, false sharing, page tables, MMU, and TLB hit ratios (3,502 words, 23.3 spoken min). Generated `src/lib/data/lessonVisuals/comp_fund/day-07.json`.
  - **Item 7: Computer Fundamentals Day 8 LongLesson & Visual Suite (TASK-967):** Storage Technologies, File Systems & Data Integrity: HDDs vs SATA SSDs vs NVMe PCIe (64K queues), RAID 0/1/5/6/10, silent bit rot corruption, ZFS Copy-on-Write checksumming, and block I/O schedulers (3,331 words, 22.2 spoken min). Generated `src/lib/data/lessonVisuals/comp_fund/day-08.json`.
  - **Item 8: Computer Fundamentals Day 9 LongLesson & Visual Suite (TASK-968):** Computer Networking: OSI Model, TCP/IP Stack, Subnetting & Routing: 7-layer OSI vs 4-layer TCP/IP, Ethernet MAC/ARP, IPv4 CIDR subnetting (/26 calculations), default gateways, and hierarchical DNS resolution (3,313 words, 22.1 spoken min). Generated `src/lib/data/lessonVisuals/comp_fund/day-09.json`.
  - **Item 9: Computer Fundamentals Day 10 LongLesson & Visual Suite (TASK-969):** Modern Internet & Web Protocols: TCP vs UDP, TCP 3-way handshake, TIME_WAIT socket states, HTTP/1.1 vs HTTP/2 binary multiplexing, HTTP/3 QUIC over UDP, and TLS 1.3 ECDHE handshakes (3,190 words, 21.3 spoken min). Generated `src/lib/data/lessonVisuals/comp_fund/day-10.json`.
  - **Item 10: Computer Fundamentals Day 11 LongLesson & Visual Suite (TASK-970):** Browser DevTools, Network Inspection & Web Performance: Multi-process browser architecture, Critical Rendering Path (DOM/CSSOM/Render Tree), Network waterfall TTFB, Cookie security (HttpOnly, Secure, SameSite), and JS Event Loop macrotask/microtask queues (3,123 words, 20.8 spoken min). Generated `src/lib/data/lessonVisuals/comp_fund/day-11.json`.
  - **Item 11: Verification & Testing Suite:** All 10 tasks passed strict 6-cycle backtracking audits (>= 20 spoken min, 4-5 visuals Gate v2 JSON, best real-world example, best 4-option MCQ, tryIt experiments). Bash runner enhanced with flag-aware `sort` and native `sha256sum`. 82/82 tests passing across `tests/quant_excel_long_lessons.test.ts` and `tests/systems_long_lessons_parity.test.ts`. Full-project TypeScript check `npx tsc --noEmit` exited 0. Single unified atomic commit `eb3c4fef` pushed to `origin codex/interview-tab-reliability`.
"""

if target_marker in pm_content:
    pm_content = pm_content.replace(target_marker, target_marker + new_entry + "\n", 1)
    with open(project_memory_path, "w", encoding="utf-8") as f:
        f.write(pm_content)
    print("Updated PROJECT_MEMORY.md successfully.")
else:
    print("Warning: target_marker not found in PROJECT_MEMORY.md")

# 2. Update agent_tasks.csv
agent_tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
tasks = [
    ("TASK-961", "Antigravity", "Complete", "TASK-961: Excel Viz Day 27 - Advanced Power Query M Language & Multi-Source Reconciliation", "2026-10-17"),
    ("TASK-962", "Antigravity", "Complete", "TASK-962: Excel Viz Day 28 - Multi-Entity Financial Consolidation & Global Currency Translation", "2026-10-17"),
    ("TASK-963", "Antigravity", "Complete", "TASK-963: Excel Viz Day 29 - Real-Time Financial Telemetry & Executive Cockpits", "2026-10-17"),
    ("TASK-964", "Antigravity", "Complete", "TASK-964: Excel Viz Day 30 - Milestone 6 Grand Final Capstone Sovereign Financial OS (Course 24 Complete)", "2026-10-17"),
    ("TASK-965", "Antigravity", "Complete", "TASK-965: Computer Fundamentals Day 6 - Process Management, Multitasking & Linux CPU Scheduling", "2026-10-17"),
    ("TASK-966", "Antigravity", "Complete", "TASK-966: Computer Fundamentals Day 7 - Computer Memory Hierarchy: L1/L2/L3 Caches, RAM & Virtual Paging", "2026-10-17"),
    ("TASK-967", "Antigravity", "Complete", "TASK-967: Computer Fundamentals Day 8 - Storage Technologies, File Systems & Data Integrity", "2026-10-17"),
    ("TASK-968", "Antigravity", "Complete", "TASK-968: Computer Fundamentals Day 9 - Computer Networking: OSI Model, TCP/IP, Subnetting & Routing", "2026-10-17"),
    ("TASK-969", "Antigravity", "Complete", "TASK-969: Computer Fundamentals Day 10 - Modern Internet & Web Protocols: TCP/UDP, HTTP/2/3, TLS 1.3", "2026-10-17"),
    ("TASK-970", "Antigravity", "Complete", "TASK-970: Computer Fundamentals Day 11 - Browser DevTools, Network Inspection & Web Performance", "2026-10-17"),
]

with open(agent_tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in tasks:
        writer.writerow(t)
print("Updated agent_tasks.csv with 10 completed tasks.")

# 3. Update multi_agent_control.csv
multi_agent_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
new_control_row = [
    "AGENT-328",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-970",
    "Completed",
    now_str,
    "10-Task Batch Protocol Complete: excel_viz Days 27-30 & Milestone 6 Grand Final Capstone (Course 24 100% Complete) + comp_fund Days 6-11 committed & pushed (eb3c4fef). 82/82 tests passing, 0 tsc errors."
]

with open(multi_agent_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(new_control_row)
print("Updated multi_agent_control.csv successfully.")
