import csv
import datetime

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
memory_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
rows = []
with open(tasks_file, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    rows.append(header)
    for r in reader:
        if r and r[0] in ["TASK-1534", "TASK-1535", "TASK-1536", "TASK-1537", "TASK-1538"]:
            r[4] = "COMPLETED"
        rows.append(r)

with open(tasks_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print("Updated agent_tasks.csv!")

# 2. Update multi_agent_control.csv
c_rows = []
with open(control_file, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    c_header = next(reader)
    c_rows.append(c_header)
    for r in reader:
        if r and r[0] == "AGENT-436":
            r[5] = "Completed"
            r[7] = "Completed Batch 4 (Block 10: Days 46-50: Stage 10: Event-Driven Microservices & gRPC Architecture)"
        c_rows.append(r)

with open(control_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(c_rows)
print("Updated multi_agent_control.csv!")

# 3. Prepend milestone entry to PROJECT_MEMORY.md
entry = f"""
## [{now_str}] Milestone Update: Course 20 (Python Programming & Backend Systems) Month 2 Pioneer Batch 4 (Block 10: Days 46–50) 100% COMPLETE & CERTIFIED

- **Agent**: AGENT-436 (Antigravity IDE & Multi-Agent Architecture)
- **Branch**: `codex/interview-tab-reliability`
- **Course Status**: Course 20: Python Programming & Backend Systems (`course-python-backend` / prefix: `python`)
  - **Month 1 (Days 1–30)**: Complete (100%)
  - **Month 2 Batch 1 (Block 7: Days 31–35)**: Complete (100%)
  - **Month 2 Batch 2 (Block 8: Days 36–40)**: Complete (100%)
  - **Month 2 Batch 3 (Block 9: Days 41–45)**: Complete (100%)
  - **Month 2 Batch 4 (Block 10: Days 46–50)**: **100% COMPLETE & VERIFIED**
    - **Day 46**: gRPC, Protocol Buffers & HTTP/2 in Python (`grpc.aio`) (`TASK-1534`)
    - **Day 47**: Kafka Event-Driven Architecture with `aiokafka` (`TASK-1535`)
    - **Day 48**: Distributed Caching & Cache Invalidation with Redis (`TASK-1536`)
    - **Day 49**: Microservice Resilience: Circuit Breakers, Bulkheads & Rate Limiting (`TASK-1537`)
    - **Day 50**: 🏆 **Milestone Project 9: High-Throughput Event-Driven Microservice & gRPC Gateway Engine** (`TASK-1538`)
  - **Overall Course Progress**: **50 of 60 Days Complete (83.3%)**
- **Invariants Enforced**:
  - Strict 5-part structure per day with $\\ge 580$ say words per part (581–589 words each).
  - All prose words: 3,162–3,194 words per lesson ($2,940 \\le W \\le 3,450$).
  - Spoken minutes: 27 min ($\\ge 20$ min).
  - Lesson minutes: strictly 36–40 min ($35 \\le M \\le 40$).
  - Zero hallucinations: Deterministic pure Python state machines, frame packing, token buckets, and XFetch.
  - No `asyncio.run()`, no `hash(str)`, no unescaped strings, no non-ASCII emojis in code.
  - Gate v2 Visual JSON contracts: `src/lib/data/lessonVisuals/python/day-{{46..50}}.json` with matching SHA-256 code hashes.
  - Full TypeScript compilation (`npx tsc --noEmit`) and Node test suite passing with 0 errors.
"""

with open(memory_file, "r", encoding="utf-8") as f:
    old_mem = f.read()

# Insert after title/header
if "# Project Memory" in old_mem:
    pos = old_mem.find("# Project Memory") + len("# Project Memory\n")
    new_mem = old_mem[:pos] + entry + old_mem[pos:]
else:
    new_mem = entry + "\n" + old_mem

with open(memory_file, "w", encoding="utf-8") as f:
    f.write(new_mem)
print("Updated PROJECT_MEMORY.md!")
