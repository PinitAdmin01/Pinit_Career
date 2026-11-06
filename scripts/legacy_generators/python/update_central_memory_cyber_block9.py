# scripts/update_central_memory_cyber_block9.py
import os
import sys

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Update PROJECT_MEMORY.md
proj_mem_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")
with open(proj_mem_path, "r", encoding="utf-8") as f:
    proj_mem = f.read()

cyber_entry = """
## [2026-10-26 03:18:00] - Branch A: Course 09 (Cybersecurity Principles / cyber) Month 2 Block 9 (Days 41–45 & Milestone 9 Capstone) 100% Complete & Certified
- **Branch**: `main` (Branch A: Tech / IoT / Systems Architecture)
- **Worktree**: `Present-Career-os`
- **Course**: Course 09: Cybersecurity Principles (`course-cybersecurity` / `cyber` / `src/lib/data/cyberWebLongLessons.ts`)
- **Block**: Month 2 Block 9 (Days 41–45 & Milestone 9 Capstone: Application & API Security):
  - Day 41: OWASP Top 10 Core Mechanics & Injection Mitigation: SQL Injection, Blind SQLi, NoSQL Injection & Command Injection (3,209 words)
  - Day 42: Cross-Site Scripting (XSS) & Content Security Policy (CSP): Stored, Reflected, DOM XSS, Nonces & Context-Aware Escaping (3,386 words)
  - Day 43: Cross-Site Request Forgery (CSRF) & Cross-Origin Resource Sharing (CORS): SameSite, STP & Preflight Auditing (3,351 words)
  - Day 44: API Security & Broken Object Level Authorization (BOLA / IDOR): Mass Assignment & Rate Limiting (3,235 words)
  - Day 45: 🌟 Milestone 9 Capstone: The Enterprise Web Application Firewall (WAF) & Runtime Application Self-Protection (RASP) Engine (3,205 words; minutes: 60)
- **Total Block Words**: 16,386 words across 25 parts (average 655.4 words/part; all 25 parts >= 600 words)
- **Gate v2 Visual Envelopes**: `src/lib/data/lessonVisuals/cyber/day-41.json` through `day-45.json` generated with `schemaVersion: 2`, `compare` template, 4 synchronized steps (`intro`, `inspect`, `compare`, `verify`), and ZERO numeric digits in captions (`!/\d/`).
- **Verification & Testing**:
  - `tests/cyber_days41_45_expansion.test.ts`: 2/2 tests PASS (100%).
  - Full cyber regression suite (`tests/cyber_days31_35_expansion.test.ts` + `tests/cyber_days36_40_expansion.test.ts` + `tests/cyber_days41_45_expansion.test.ts`): 6/6 tests PASS (100%).
  - Days 1 to 45 sequential verification in `src/lib/data/cyberWebLongLessons.ts`.
  - TypeScript Compilation: `npx tsc --noEmit` verified with 0 errors (Exit code 0).
- **Task Logging**: Appended non-colliding `TASK-2183` through `TASK-2187` to `agent_tasks.csv`.
- **Course Status**: Course 09 (`cyber`) is now **45 / 60 Days (75.0% Complete)**!
- **Next Assignment**: Advance immediately to Month 2 Block 10 (Days 46–50: Cloud & Infrastructure Security: Linux Kernel Hardening, Container Security & Docker Isolation, Kubernetes Pod Security Standards, Cloud IAM, and Milestone 10 Capstone).
"""

with open(proj_mem_path, "a", encoding="utf-8") as f:
    f.write(cyber_entry)
print("Updated PROJECT_MEMORY.md successfully!")

# 2. Update agent_tasks.csv
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
task_lines = [
    'TASK-2183,"cyber Day 41: OWASP Top 10 Core Mechanics & Injection Mitigation: SQL Injection, Blind SQLi, NoSQL Injection & Command Injection",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 03:18:00\n',
    'TASK-2184,"cyber Day 42: Cross-Site Scripting (XSS) & Content Security Policy (CSP): Stored, Reflected, DOM XSS, Nonces & Context-Aware Escaping",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 03:18:00\n',
    'TASK-2185,"cyber Day 43: Cross-Site Request Forgery (CSRF) & Cross-Origin Resource Sharing (CORS): SameSite, STP & Preflight Auditing",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 03:18:00\n',
    'TASK-2186,"cyber Day 44: API Security & Broken Object Level Authorization (BOLA / IDOR): Mass Assignment & Rate Limiting",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 03:18:00\n',
    'TASK-2187,"cyber Day 45: Milestone 9 Capstone: The Enterprise Web Application Firewall (WAF) & Runtime Application Self-Protection (RASP) Engine",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 03:18:00\n'
]

with open(tasks_path, "a", encoding="utf-8") as f:
    f.writelines(task_lines)
print("Updated agent_tasks.csv successfully!")

# 3. Update multi_agent_control.csv
mac_path = os.path.join(memory_dir, "multi_agent_control.csv")
mac_line = 'AGENT-530,Branch A Tech/IoT/Systems Lead,Present-Career-os,main,"Course 09: Cybersecurity Principles (cyber) Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone) Complete & Verified. Progress: 45/60 Days (75.0%). Advancing to Block 10 (Days 46-50).",Active,2026-10-26 03:18:00\n'

with open(mac_path, "a", encoding="utf-8") as f:
    f.write(mac_line)
print("Updated multi_agent_control.csv successfully!")
