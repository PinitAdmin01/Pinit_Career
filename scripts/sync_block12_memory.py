import os, sys

sys.stdout.reconfigure(encoding='utf-8')

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
PROJECT_MEMORY_PATH = os.path.join(MEMORY_DIR, "PROJECT_MEMORY.md")
AGENT_TASKS_PATH = os.path.join(MEMORY_DIR, "agent_tasks.csv")
MULTI_AGENT_PATH = os.path.join(MEMORY_DIR, "multi_agent_control.csv")

# 1. Prepend to PROJECT_MEMORY.md
entry = """## 🏆 [2026-10-20] AGENT-466: Course 02 (react-basics) Month 2 Block 12 (Days 56–60) Grand Master Capstone - 100% FULL COURSE COMPLETE!
- **Track**: Full-Stack React Web Development (`course-react-web` / `react-basics`)
- **Block Target**: Month 2 Block 12 (Days 56–60) — **60/60 Days Complete (100% COMPLETE: Full Course Conquered)**
- **Grand Master Milestone**: 🏆 **Grand Master Capstone & Production Deployment Gate: HyperGrid Enterprise Autonomous Trading & Edge Streaming Portal**
- **Git Commit**: `1bbc6875` pushed to `origin/codex/interview-tab-reliability`
- **Key Deliverables**:
  1. **Day 56**: Industrial Architecture Case Study 1: High-Frequency Trading Desk & Financial Telemetry (2,990 words, 5/5 sandboxed, 38 min).
  2. **Day 57**: Industrial Architecture Case Study 2: Global E-Commerce Streaming Architecture & PPR (2,942 words, 5/5 sandboxed, 38 min).
  3. **Day 58**: Industrial Architecture Case Study 3: Enterprise Collaborative Workspace & Server-Driven UI (2,960 words, 5/5 sandboxed, 38 min).
  4. **Day 59**: Principal Full-Stack React Architect RFC & System Design Defense (2,962 words, 5/5 sandboxed, 38 min).
  5. **Day 60**: 🏆 **Grand Master Capstone & Production Deployment Gate: HyperGrid Enterprise Autonomous Trading & Edge Streaming Portal** (3,063 words, 5/5 sandboxed, 40 min).
- **Invariants Verified**:
  - Word Counts: Every single part >= 580 words (2,942 to 3,063 words/day, delivering 25+ min audio, total 14,917 words across Block 12).
  - Code Determinism: 25/25 synchronous plain JS snippets executed and matched in `runLikeSandbox`.
  - Visual Contracts: 5 Gate v2 visual files (`day-56.json` to `day-60.json`) with matching SHA-256 codeHash and 4-step synchronization.
  - Test Suite: 18/18 tests passing across `tests/react_days{31..60}_expansion.test.ts`. Zero TypeScript errors (`tsc --noEmit` clean).
  - Course 02 Status: **60/60 Days 100% COMPLETE** (Month 1 + Month 2, 60 LongLessons, 300 Lesson Parts, 300 Visual Envelopes, 60 DayConfigs, 10 Project Milestones Fully Certified).

---

"""

print("Updating PROJECT_MEMORY.md...")
with open(PROJECT_MEMORY_PATH, 'r', encoding='utf-8') as f:
    orig_memory = f.read()

with open(PROJECT_MEMORY_PATH, 'w', encoding='utf-8') as f:
    f.write(entry + orig_memory)

print("PROJECT_MEMORY.md updated successfully!")

# 2. Update agent_tasks.csv
print("Updating agent_tasks.csv...")
with open(AGENT_TASKS_PATH, 'r', encoding='utf-8') as f:
    tasks_lines = f.readlines()

new_tasks_lines = []
for line in tasks_lines:
    if any(t in line for t in ["TASK-1669", "TASK-1670", "TASK-1671", "TASK-1672", "TASK-1673"]) and "Course 02" in line:
        line = line.replace("IN_PROGRESS", "COMPLETED")
    new_tasks_lines.append(line)

with open(AGENT_TASKS_PATH, 'w', encoding='utf-8') as f:
    f.writelines(new_tasks_lines)

print("agent_tasks.csv updated successfully!")

# 3. Update multi_agent_control.csv
print("Updating multi_agent_control.csv...")
with open(MULTI_AGENT_PATH, 'r', encoding='utf-8') as f:
    mac_lines = f.readlines()

new_mac_lines = []
for line in mac_lines:
    if "AGENT-466" in line and "Course 02" in line:
        line = line.replace("In_Progress,Active", "Completed,Done").replace(",,,", ",1bbc6875,,")
    new_mac_lines.append(line)

with open(MULTI_AGENT_PATH, 'w', encoding='utf-8') as f:
    f.writelines(new_mac_lines)

print("multi_agent_control.csv updated successfully!")
print("ALL CENTRAL MEMORY SYNCED PROMPTLY AND ACCURATELY!")
