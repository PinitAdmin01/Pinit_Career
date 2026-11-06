import os, csv, datetime

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
COMMIT_HASH = "89408e5f"
TIMESTAMP = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update multi_agent_control.csv
mac_path = os.path.join(MEMORY_DIR, "multi_agent_control.csv")
with open(mac_path, 'r', encoding='utf-8') as f:
    rows = list(csv.reader(f))

updated_rows = []
for row in rows:
    if len(row) > 0 and row[0] == "AGENT-465":
        updated_rows.append([
            "AGENT-465",
            "Antigravity",
            "codex/interview-tab-reliability",
            "Present-Career-os",
            "TASK-1664..1668",
            "Completed",
            COMMIT_HASH,
            "Course 02 (react-basics) Month 2 Block 11 (Days 51-55) Milestone 10 Completed and Pushed (Commit 89408e5f) - 55/60 Days Complete (91.7%)",
            TIMESTAMP,
            "",
            ""
        ])
    else:
        updated_rows.append(row)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(updated_rows)

print("Updated multi_agent_control.csv")

# 2. Update agent_tasks.csv
tasks_path = os.path.join(MEMORY_DIR, "agent_tasks.csv")
with open(tasks_path, 'r', encoding='utf-8') as f:
    task_rows = list(csv.reader(f))

updated_task_rows = []
block11_task_ids = {"TASK-1664", "TASK-1665", "TASK-1666", "TASK-1667", "TASK-1668"}

for r in task_rows:
    if len(r) > 0 and r[0] in block11_task_ids:
        tid = r[0]
        day_num = int(tid.replace("TASK-", "")) - 1664 + 51
        updated_task_rows.append([
            tid,
            f"Course 02 Block 11 Day {day_num}",
            "Antigravity",
            "COMPLETED",
            "src/lib/data/reactLongLessons.ts",
            "High",
            f"Month 2 Day {day_num} App Router/Edge/PPR/SDUI/Milestone 10",
            TIMESTAMP[:10],
            "100%",
            f"Commit {COMMIT_HASH}: Days 51-55 authored, enriched (2965-3335 words/day, 38-40 min), Gate v2 visuals compiled, 15 tests pass. Milestone 10 Certified! 55 Days Complete.",
            "",
            ""
        ])
    else:
        updated_task_rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(updated_task_rows)

print("Updated agent_tasks.csv")

# 3. Prepend to PROJECT_MEMORY.md
pm_path = os.path.join(MEMORY_DIR, "PROJECT_MEMORY.md")
with open(pm_path, 'r', encoding='utf-8') as f:
    pm_content = f.read()

entry = f"""## 🚀 [{TIMESTAMP[:10]}] AGENT-465: Course 02 (react-basics) Month 2 Block 11 (Days 51–55) Milestone 10 Complete
- **Track**: Full-Stack React Web Development (`course-react-web` / `react-basics`)
- **Block Target**: Month 2 Block 11 (Days 51–55) — **55/60 Days Complete (91.7%)**
- **Milestone 10**: 🏆 **Enterprise Edge-Native Streaming Portal with Partial Prerendering (PPR), Edge Middleware & Server-Driven UI**
- **Commit**: `{COMMIT_HASH}` pushed to `origin/codex/interview-tab-reliability`
- **Key Deliverables**:
  1. **Day 51**: Next.js App Router Internals: Nested Layouts, Route Groups, Parallel Routes & Intercepting Routes (3,020 words, 5/5 sandboxed, 38 min).
  2. **Day 52**: Edge Runtime & Middleware Pipelines: Geo-Distributed Routing, Edge Caching, Web Crypto JWT & Token Bucket Rate Limiting (3,335 words, 5/5 sandboxed, 38 min).
  3. **Day 53**: Streaming Hybrid Rendering & Partial Prerendering (PPR): Static Shells, Dynamic Holes & React Experimental Cache (3,046 words, 5/5 sandboxed, 38 min).
  4. **Day 54**: Server-Driven UI (SDUI) & Dynamic Component Engines: JSON Wire Schemas, Component Registries & Polymorphic Rendering (2,995 words, 5/5 sandboxed, 38 min).
  5. **Day 55**: 🏆 **Milestone 10: Enterprise Edge-Native Streaming Portal with PPR, Edge Middleware & Server-Driven UI** (2,965 words, 5/5 sandboxed, 40 min).
- **Invariants Verified**:
  - Word Counts: Every single part >= 580 words (2,965 to 3,335 words/day, delivering 25+ min audio).
  - Code Determinism: 25/25 synchronous plain JS snippets executed and matched in `runLikeSandbox`.
  - Visual Contracts: 5 Gate v2 visual files (`day-51.json` to `day-55.json`) with matching SHA-256 codeHash and 4-step synchronization.
  - Test Suite: 15/15 tests passing across `tests/react_days{{31..55}}_expansion.test.ts` + `tests/react_long_lessons.test.ts`. Zero TypeScript errors (`tsc --noEmit` clean).
- **Next Block**: Month 2 Block 12 (Days 56–60 Capstone 2: Autonomous Trading & Streaming Portal Production Audit), bringing Course 02 to 60/60 Days (100% Complete).

---

"""

updated_pm = entry + pm_content
with open(pm_path, 'w', encoding='utf-8') as f:
    f.write(updated_pm)

print("Updated PROJECT_MEMORY.md")
