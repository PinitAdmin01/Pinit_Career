import os
from datetime import datetime

# 1. Update PROJECT_MEMORY.md
proj_mem_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(proj_mem_path, 'r', encoding='utf-8') as f:
    proj_mem = f.read()

entry_header = "* **2026-10-17 (Antigravity - 🎯 10-TASK BATCH PROTOCOL COMPLETE: COMP_FUND DAYS 12–21 & ⭐ MILESTONES 2 & 3 CAPSTONES COMPLETED - TASK-1061..1070):**\n"
entry_body = """  - **Item 1: Computer Fundamentals Day 12 LongLesson & Visual Suite (TASK-1061):** Digital Productivity & Advanced Keyboard Shortcuts: Touch Typing, Window Management & OS Ergonomics (3,318 words, 22.1 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-12.json`.
  - **Item 2: Computer Fundamentals Day 13 LongLesson & Visual Suite (TASK-1062):** Cloud Storage, Distributed File Sync & Object Buckets: Block vs File vs Object Storage (S3 API), Local Sync daemons, and Differential Chunk Sync (3,283 words, 21.9 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-13.json`.
  - **Item 3: Computer Fundamentals Day 14 LongLesson & Visual Suite (TASK-1063):** Data Formats, Serialization & Character Encoding Standards: ASCII, UTF-8/16/32, JSON vs Protocol Buffers vs MessagePack binary compaction (3,253 words, 21.7 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-14.json`.
  - **Item 4: Computer Fundamentals Day 15 LongLesson & Visual Suite & ⭐ Milestone 2 Capstone (TASK-1064):** Full-Stack Systems Architecture, Cloud Sync & Data Encoding Engine: Integrating storage, networking, serialization, and browser telemetry (3,218 words, 21.5 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-15.json`.
  - **Item 5: Computer Fundamentals Day 16 LongLesson & Visual Suite (TASK-1065):** Information Security Fundamentals: Passwords, Hashing, 2FA & Digital Hygiene: Shannon entropy, Argon2id/bcrypt salt rounds, TOTP RFC 6238 HMAC, and phishing defense (3,256 words, 21.7 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-16.json`.
  - **Item 6: Computer Fundamentals Day 17 LongLesson & Visual Suite (TASK-1066):** Operating System Security: User Account Control (UAC), Sudo & Firewalls: CPU rings 0 vs 3, Windows UAC integrity levels, Sudoers delegation, Stateful Packet Inspection (SPI), and MAC (SELinux/AppArmor) (3,300 words, 22.0 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-17.json`.
  - **Item 7: Computer Fundamentals Day 18 LongLesson & Visual Suite (TASK-1067):** Cryptography Fundamentals: Symmetric AES-256 vs Asymmetric RSA-4096 & SSH Keys: AES-256-GCM AEAD, RSA/Diffie-Hellman/Ed25519, OpenSSH keys, and X.509 PKI certificates (3,223 words, 21.5 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-18.json`.
  - **Item 8: Computer Fundamentals Day 19 LongLesson & Visual Suite (TASK-1068):** Hardware Peripherals & Display Interfaces: USB4, Thunderbolt 4 (40 Gbps) & HDMI 2.1: USB-C multiplexing, DP 2.1 UHBR20, PCIe DMA attacks & IOMMU security, and USB PD 3.1 240W EPR (3,306 words, 22.0 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-19.json`.
  - **Item 9: Computer Fundamentals Day 20 LongLesson & Visual Suite (TASK-1069):** Software Installation & Package Managers: APT, Homebrew, Winget & PATH Variables: DAG dependency resolution, GPG keys, APT/Homebrew/Winget architectures, and PATH precedence security (3,192 words, 21.3 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-20.json`.
  - **Item 10: Computer Fundamentals Day 21 LongLesson & Visual Suite & ⭐ Milestone 3 Capstone (TASK-1070):** Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine: Integrating host defense, cryptographic pipelines, peripheral topologies, and environmental isolation (3,156 words, 21.0 spoken min, 45m total duration). Generated `src/lib/data/lessonVisuals/comp_fund/day-21.json`.
  - **Item 11: Verification & Testing Suite:** 100% satisfied all 7-step batch protocol criteria. Strict 6-cycle backtracking audits passed with >= 21 spoken minutes per day, 5 Gate v2 visuals per day bound by valid SHA-256 codeHash, real-world examples, 4-option MCQs with pedagogical explanations, summary key takeaways, and 5-step projectSteps. All 31/31 tests passing in `tests/systems_long_lessons_parity.test.ts`. TypeScript compiler check `npx tsc --noEmit` cleanly exited with 0 errors. Single unified atomic commit pushed to `origin codex/interview-tab-reliability`.
"""

rule_marker = "## 4. Golden Rules for Antigravity & Sub-Agents in this Codebase\n"
if rule_marker in proj_mem and "TASK-1061..1070" not in proj_mem:
    idx = proj_mem.find(rule_marker) + len(rule_marker)
    proj_mem = proj_mem[:idx] + entry_header + entry_body + "\n" + proj_mem[idx:]
    with open(proj_mem_path, 'w', encoding='utf-8') as f:
        f.write(proj_mem)
    print("Updated PROJECT_MEMORY.md successfully.")
else:
    print("PROJECT_MEMORY.md already updated or marker not found.")

# 2. Update agent_tasks.csv
agent_tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
new_tasks = [
    'TASK-1061,Antigravity,Complete,"TASK-1061: Computer Fundamentals Day 12 - Digital Productivity & Advanced Keyboard Shortcuts: Touch Typing, Window Management & OS Ergonomics",2026-10-17\n',
    'TASK-1062,Antigravity,Complete,"TASK-1062: Computer Fundamentals Day 13 - Cloud Storage, Distributed File Sync & Object Buckets: S3 API, Local Sync & Chunk Hashing",2026-10-17\n',
    'TASK-1063,Antigravity,Complete,"TASK-1063: Computer Fundamentals Day 14 - Data Formats, Serialization & Character Encoding Standards: ASCII, UTF-8, JSON & Protocol Buffers",2026-10-17\n',
    'TASK-1064,Antigravity,Complete,"TASK-1064: Computer Fundamentals Day 15 - ⭐ MILESTONE 2: Full-Stack Systems Architecture & Cloud Storage Capstone",2026-10-17\n',
    'TASK-1065,Antigravity,Complete,"TASK-1065: Computer Fundamentals Day 16 - Information Security Fundamentals: Passwords, Hashing, 2FA & Digital Hygiene",2026-10-17\n',
    'TASK-1066,Antigravity,Complete,"TASK-1066: Computer Fundamentals Day 17 - Operating System Security: User Account Control (UAC), Sudo & Firewalls",2026-10-17\n',
    'TASK-1067,Antigravity,Complete,"TASK-1067: Computer Fundamentals Day 18 - Cryptography Fundamentals: Symmetric AES-256 vs Asymmetric RSA-4096 & SSH Keys",2026-10-17\n',
    'TASK-1068,Antigravity,Complete,"TASK-1068: Computer Fundamentals Day 19 - Hardware Peripherals & Display Interfaces: USB4, Thunderbolt 4 & HDMI 2.1",2026-10-17\n',
    'TASK-1069,Antigravity,Complete,"TASK-1069: Computer Fundamentals Day 20 - Software Installation & Package Managers: APT, Homebrew, Winget & PATH Variables",2026-10-17\n',
    'TASK-1070,Antigravity,Complete,"TASK-1070: Computer Fundamentals Day 21 - ⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine",2026-10-17\n',
]

with open(agent_tasks_path, 'r', encoding='utf-8') as f:
    tasks_content = f.read()

if "TASK-1061" not in tasks_content:
    with open(agent_tasks_path, 'a', encoding='utf-8') as f:
        for t in new_tasks:
            f.write(t)
    print("Appended TASK-1061..1070 to agent_tasks.csv successfully.")
else:
    print("Tasks already present in agent_tasks.csv.")

# 3. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_entry = 'AGENT-347,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1070,Completed,2026-10-17 03:25:00,"10-Task Batch Protocol Complete: comp_fund Days 12-21 & Milestones 2-3 Capstone (Course 21 Days 12-21) committed & pushed. 31/31 tests passing, 0 tsc errors, Gate v2 cells specs."\n'

with open(mac_path, 'r', encoding='utf-8') as f:
    mac_content = f.read()

if "AGENT-347" not in mac_content:
    with open(mac_path, 'a', encoding='utf-8') as f:
        f.write(mac_entry)
    print("Appended AGENT-347 to multi_agent_control.csv successfully.")
else:
    print("AGENT-347 already present in multi_agent_control.csv.")
