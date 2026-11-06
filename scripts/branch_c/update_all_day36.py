import os
import datetime

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
memory_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
with open(tasks_file, "a", encoding="utf-8") as f:
    f.write(f"TASK-1951,dsa-optim Day 36: String Hashing: Polynomial Rolling Hashes Rabin-Karp & O(1) Substring Equality,Completed,14fd7961,Present-Career-os-platform,agent/branch-c-platform-admin-faculty,{now_str}\n")
print("Appended TASK-1951 (Day 36) to agent_tasks.csv")

# 2. Update multi_agent_control.csv
with open(mac_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "agent/branch-c-platform-admin-faculty" in line or "Present-Career-os-platform" in line:
        parts = line.split(",")
        parts[2] = "Active"
        parts[3] = "14fd7961"
        parts[4] = '"dsa-optim Month 2 Block 8: Day 36 100% Complete & Verified"'
        parts[5] = f"{now_str}\n"
        new_lines.append(",".join(parts))
    else:
        new_lines.append(line)

with open(mac_file, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
print("Updated multi_agent_control.csv")

# 3. Update PROJECT_MEMORY.md
with open(memory_file, "r", encoding="utf-8") as f:
    mem_content = f.read()

entry = f"""
### 🅲 Branch C: DSA Web Optimization (`dsa-optim`) - Month 2 Block 8 Day 36 Conquered
- **Status**: 100% COMPLETE & PUSHED (`14fd7961`)
- **Course**: `src/lib/data/dsaWebLongLessons.ts` (`dsa-optim`)
- **Day 36**: String Hashing: Polynomial Rolling Hashes, Rabin-Karp & O(1) Substring Equality (`14fd7961`)
  - Part 1: Foundations of String Hashing, Polynomial Rolling Hashes & Prime Base Selection (652 words)
  - Part 2: Collision Probabilities, The Birthday Paradox & 64-Bit Double Rolling Hashing (649 words)
  - Part 3: The Rabin-Karp Substring Search Algorithm & Sliding Window Hashes (644 words)
  - Part 4: High-Performance Substring Equality, O(log N) LCP & O(1) Palindrome Verification (640 words)
  - Part 5: Enterprise Application: Genomic Sequence Alignment & Deduplication Engine (605 words)
- **Verified Invariants**:
  - Total Words: 3,190 words across `say` arrays (every part >= 600 words).
  - Visual Envelope: `src/lib/data/lessonVisuals/dsa-optim/day-36.json` passes Gate v2 (`PASS 5/6 (none: 0)`).
  - Unit Tests: `tests/dsa_web_days36_40_expansion.test.ts` (2/2) and `tests/dsa_web_days31_35_expansion.test.ts` (10/10) pass.
  - Type Safety: `npx tsc --noEmit` passes with 0 errors across the entire codebase.
- **Timestamp**: {now_str}
"""

with open(memory_file, "a", encoding="utf-8") as f:
    f.write(entry)
print("Appended Day 36 entry to PROJECT_MEMORY.md")
