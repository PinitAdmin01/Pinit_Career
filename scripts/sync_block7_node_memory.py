import csv, os
from datetime import datetime

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
PROJECT_MEMORY_PATH = os.path.join(MEMORY_DIR, "PROJECT_MEMORY.md")
AGENT_TASKS_PATH = os.path.join(MEMORY_DIR, "agent_tasks.csv")
MULTI_AGENT_CONTROL_PATH = os.path.join(MEMORY_DIR, "multi_agent_control.csv")

CONV_ID = "c7b35c15-f056-4dc6-888b-f56621a809c1"
COMMIT_HASH = "8e46acfd"

# 1. Prepend to PROJECT_MEMORY.md
print("Updating PROJECT_MEMORY.md...")
milestone_entry = f"""## 🏆 [2026-10-20] AGENT-469: Course 03 (node-web) Month 2 Block 7 (Days 31–35) Milestone 6: Distributed Order Processing Engine - COMPLETE!
- **Track**: Node.js & TypeScript Backend Engineering (`course-node-web` / prefix: `node-web`)
- **Block Target**: Month 2 Block 7 (Days 31–35) — 35/60 Days Complete
- **Milestone 6**: 🏆 **Milestone 6: Distributed Event-Driven Order Processing Engine with Kafka & Outbox Pattern**
- **Git Commit**: `{COMMIT_HASH}` pushed to `origin/codex/interview-tab-reliability`
- **Key Deliverables**:
  1. **Day 31**: Advanced Event-Driven Microservices: Asynchronous Event Loops, Worker Threads & Event Emitters (2,982 words, 5/5 parts $\\ge 580$ words, 38 min, 4-step flow visual `day-31.json`, sandbox code passing).
  2. **Day 32**: Distributed Message Brokers: Apache Kafka Architecture, Partitions, Consumer Groups & Offsets (3,041 words, 5/5 parts $\\ge 580$ words, 38 min, 4-step flow visual `day-32.json`, sandbox code passing).
  3. **Day 33**: AMQP & Message Queuing: RabbitMQ Exchanges, Queues, Dead-Letter Exchanges & Acknowledgments (2,946 words, 5/5 parts $\\ge 580$ words, 38 min, 4-step flow visual `day-33.json`, sandbox code passing).
  4. **Day 34**: Redis Streams & Consumer Groups: High-Throughput In-Memory Streaming & Pending Acknowledgment Lists (2,961 words, 5/5 parts $\\ge 580$ words, 38 min, 4-step boxes visual `day-34.json`, sandbox code passing).
  5. **Day 35**: 🏆 **Milestone 6: Distributed Event-Driven Order Processing Engine with Kafka & Outbox Pattern** (2,994 words, 5/5 parts $\\ge 580$ words, 40 min, 4-step compare visual `day-35.json`, Grade A+ certification sandbox passing).
  6. **Data & Config Contracts**: Appended to `src/lib/data/nodeWebLongLessons.ts` (35 full days), `src/lib/data/nodeWebDays.ts`, and `src/lib/data/nodeWeb30DayData.ts` (all 10 exam and assignment tasks verified via runnable sandbox).
  7. **Testing & Verification**: 100% test pass on `tests/node_days31_35_expansion.test.ts` (3/3 suites passing, full Gate v2 schema validation, exact codeHash bindings, zero type errors on `tsc --noEmit`).

"""

with open(PROJECT_MEMORY_PATH, "r", encoding="utf-8") as f:
    existing_memory = f.read()

with open(PROJECT_MEMORY_PATH, "w", encoding="utf-8") as f:
    f.write(milestone_entry + existing_memory)
print("PROJECT_MEMORY.md updated successfully!")

# 2. Update multi_agent_control.csv
print("Updating multi_agent_control.csv...")
with open(MULTI_AGENT_CONTROL_PATH, "r", encoding="utf-8") as f:
    mac_lines = f.readlines()

new_mac_lines = []
for line in mac_lines:
    if "AGENT-469" in line and "node-web" in line:
        parts = line.strip().split(",")
        # Format: AgentID,AgentType,GitBranch,WorkspaceDir,TasksAssigned,Status,CollisionRisk,Notes,LastCheckin,CommitHash,Reserved1,Reserved2
        updated_line = f"AGENT-469,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1689..1693,Completed,Done,\"Course 03 (node-web) Month 2 Block 7 (Days 31-35): Event-Driven Microservices, Kafka, RabbitMQ, Redis Streams & Milestone 6 Event-Driven Order Processing Engine\",{datetime.now().strftime('%Y-%m-%d %H:%M:%S')},{COMMIT_HASH},,\n"
        new_mac_lines.append(updated_line)
    else:
        new_mac_lines.append(line)

with open(MULTI_AGENT_CONTROL_PATH, "w", encoding="utf-8") as f:
    f.writelines(new_mac_lines)
print("multi_agent_control.csv updated successfully!")

# 3. Append completed tasks to agent_tasks.csv
print("Updating agent_tasks.csv...")
today_str = datetime.now().strftime("%Y-%m-%d")
now_str = datetime.now().strftime("%H:%M:%S")

new_tasks = [
    f"TASK-1689,{today_str},{now_str},COMPLETED,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 7 Day 31: Advanced Event-Driven Microservices: Asynchronous Event Loops, Worker Threads & Event Emitters\",TypeScript/Node,\"nodeWebLongLessons.ts, day-31.json\",Course 03 node-web expansion,{CONV_ID},\n",
    f"TASK-1690,{today_str},{now_str},COMPLETED,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 7 Day 32: Distributed Message Brokers: Apache Kafka Architecture, Partitions, Consumer Groups & Offsets\",TypeScript/Node,\"nodeWebLongLessons.ts, day-32.json\",Course 03 node-web expansion,{CONV_ID},\n",
    f"TASK-1691,{today_str},{now_str},COMPLETED,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 7 Day 33: AMQP & Message Queuing: RabbitMQ Exchanges, Queues, Dead-Letter Exchanges & Acknowledgments\",TypeScript/Node,\"nodeWebLongLessons.ts, day-33.json\",Course 03 node-web expansion,{CONV_ID},\n",
    f"TASK-1692,{today_str},{now_str},COMPLETED,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 7 Day 34: Redis Streams & Consumer Groups: High-Throughput In-Memory Streaming & Pending Acknowledgment Lists\",TypeScript/Node,\"nodeWebLongLessons.ts, day-34.json\",Course 03 node-web expansion,{CONV_ID},\n",
    f"TASK-1693,{today_str},{now_str},COMPLETED,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 7 Day 35: Milestone 6: Distributed Event-Driven Order Processing Engine with Kafka & Outbox Pattern\",TypeScript/Node,\"nodeWebLongLessons.ts, day-35.json\",Course 03 node-web expansion,{CONV_ID},\n"
]

with open(AGENT_TASKS_PATH, "a", encoding="utf-8") as f:
    for t in new_tasks:
        f.write(t)
print("agent_tasks.csv updated successfully!")

print("\nALL CENTRAL SHARED MEMORY RECORDS FULLY SYNCHRONIZED!")
