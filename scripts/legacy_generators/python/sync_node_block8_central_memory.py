import csv, os, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(memory_dir, "multi_agent_control.csv")
project_memory_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")

# 1. Update agent_tasks.csv
tasks_to_complete = {"TASK-1694", "TASK-1695", "TASK-1696", "TASK-1697", "TASK-1698"}
updated_tasks = []

with open(agent_tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    updated_tasks.append(header)
    for row in reader:
        if row and row[0] in tasks_to_complete:
            row[4] = "COMPLETED"
        updated_tasks.append(row)

with open(agent_tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(updated_tasks)
print(f"Updated {tasks_to_complete} to COMPLETED in {agent_tasks_path}")

# 2. Update multi_agent_control.csv
updated_mac = []
with open(multi_agent_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    updated_mac.append(header)
    for row in reader:
        if row and row[0] == "AGENT-471":
            row[3] = "Completed"
            row[6] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        updated_mac.append(row)

with open(multi_agent_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(updated_mac)
print(f"Updated AGENT-471 to Completed in {multi_agent_path}")

# 3. Update PROJECT_MEMORY.md
timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
memory_entry = f"""
## [{timestamp}] Course 03 (`node-web`) Month 2 Block 8 (Days 36–40) Milestone 7 Expansion: Complete & Certified

- **Course**: Course 03: Node.js & TypeScript Backend Engineering (`course-node-web` / prefix: `node-web`)
- **Block**: Month 2 Block 8 (Days 36–40) — Milestone 7: Low-Latency Distributed Inventory Reservation Gateway with Redlock & Lua Caching
- **Curriculum Added**:
  - Day 36: High-Performance In-Memory Caching: Redis Cluster Sharding, Key Eviction Policies & Pipeline Batching (3,021 words, 38 mins)
  - Day 37: Distributed Locking & Concurrency Control: Redlock Algorithm, Lease Renewals & Fencing Tokens (3,119 words, 38 mins)
  - Day 38: Connection Pooling & Resource Sizing: Generic-Pool, Socket Reuse & PostgreSQL pgBouncer Gateways (2,993 words, 38 mins)
  - Day 39: Distributed Rate Limiting & Sliding Windows: Token Bucket, Leaky Bucket & Redis Lua Scripting (3,009 words, 38 mins)
  - Day 40: 🏆 **Milestone 7: Low-Latency Distributed Inventory Reservation Gateway with Redlock & Lua Caching** (2,947 words, 40 mins)
- **Pedagogical Invariants Verified**:
  - Strict 5-part `LongLesson` format across all 5 days (25 total parts).
  - Every single part $\ge 580$ words ($\ge 2,900$ to $3,120$ words per day, 15,089 words total in Block 8).
  - 100% deterministic pure JavaScript sandbox execution verified via `vm.runInNewContext`.
  - Gate v2 Visual JSON files created: `day-36.json` through `day-40.json` with matching SHA-256 `codeHash` bindings and allowed visual templates (`['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states']`).
  - Structured check questions: `{{ question, options, answer: 0, why }}` with `options.length >= 2`.
  - Clean `projectStep`: `{{ title, steps }}` with zero `desc`.
  - Plain JS parameter list starters in `nodeWeb30DayData.ts` passing `buildRunnable` sandbox execution.
- **Verification Suites**:
  - `tests/node_days36_40_expansion.test.ts`: 3/3 passed.
  - `tests/web_track_long_lessons.test.ts`: 26/26 passed.
  - `npx tsc --noEmit`: 0 errors.
- **Tasks & Agent Status**:
  - `TASK-1694` through `TASK-1698`: COMPLETED.
  - `AGENT-471`: Completed.
"""

with open(project_memory_path, 'r', encoding='utf-8') as f:
    existing_memory = f.read()

with open(project_memory_path, 'w', encoding='utf-8') as f:
    f.write(memory_entry.strip() + "\n\n" + existing_memory)

print(f"Prepend Milestone 7 entry to {project_memory_path} successfully!")
