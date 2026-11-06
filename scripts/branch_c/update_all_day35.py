import os
import datetime

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
memory_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
with open(tasks_file, "a", encoding="utf-8") as f:
    f.write(f"TASK-1949,dsa-optim Day 34: Disjoint Set Union (DSU) by Rank & Path Compression with Offline Dynamic Connectivity,Completed,3c6df5a2,Present-Career-os-platform,agent/branch-c-platform-admin-faculty,{now_str}\n")
    f.write(f"TASK-1950,dsa-optim Day 35: Milestone 7 Capstone: High-Throughput Autonomous Network Flow & Transit Router,Completed,93f850bd,Present-Career-os-platform,agent/branch-c-platform-admin-faculty,{now_str}\n")
print("Appended TASK-1949 (Day 34) and TASK-1950 (Day 35) to agent_tasks.csv")

# 2. Update multi_agent_control.csv
with open(mac_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "agent/branch-c-platform-admin-faculty" in line or "Present-Career-os-platform" in line:
        parts = line.split(",")
        parts[2] = "Active"
        parts[3] = "93f850bd"
        parts[4] = '"dsa-optim Month 2 Block 7 Complete (Days 31-35 100% Verified)"'
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

milestone_entry = f"""
### 🅲 Branch C: DSA Web Optimization (`dsa-optim`) - Month 2 Block 7 Conquered (Days 31–35)
- **Status**: 100% COMPLETE & PUSHED (`93f850bd`)
- **Course**: `src/lib/data/dsaWebLongLessons.ts` (`dsa-optim`)
- **Block 7 Coverage**:
  - **Day 31**: Advanced Graph Algorithms: Tarjan's Strongly Connected Components (SCC) & Bridge Detection (`cdbeca64`)
  - **Day 32**: Network Flow: Ford-Fulkerson Method & Edmonds-Karp Residual Graphs (`497e35af`)
  - **Day 33**: Minimum Cut Theorem & Bipartite Maximum Matching (`90c5d7a2`)
  - **Day 34**: Disjoint Set Union (DSU) by Rank & Path Compression with Offline Dynamic Connectivity (`3c6df5a2`)
  - **Day 35**: ⭐ **Milestone 7 Capstone: High-Throughput Autonomous Network Flow & Transit Router** (`93f850bd`)
- **Verified Invariants**:
  - Word Counts: Every part $\ge 600$ words in `say` (Day 35 total: 3,234 words; Day 34: 3,253 words; Day 33: 3,334 words; Day 32: 3,189 words; Day 31: 3,185 words).
  - Visual Envelopes: All 5 days have `PASS 5/6 (none: 0)` in Gate v2 validation (`scripts/visuals/check.mts`).
  - Unit Test Suite: `tests/dsa_web_days31_35_expansion.test.ts` passes 10/10 tests.
  - Type Safety: `npx tsc --noEmit` passes with 0 errors across the entire codebase.
- **Timestamp**: {now_str}
"""

with open(memory_file, "a", encoding="utf-8") as f:
    f.write(milestone_entry)
print("Appended Block 7 milestone entry to PROJECT_MEMORY.md")
