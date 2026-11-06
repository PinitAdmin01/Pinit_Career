import os
from datetime import datetime

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
AGENT_TASKS_PATH = os.path.join(MEMORY_DIR, "agent_tasks.csv")
MULTI_AGENT_CONTROL_PATH = os.path.join(MEMORY_DIR, "multi_agent_control.csv")

CONV_ID = "c7b35c15-f056-4dc6-888b-f56621a809c1"
now_date = datetime.now().strftime("%Y-%m-%d")
now_time = datetime.now().strftime("%H:%M:%S")

# Register in multi_agent_control.csv
mac_entry = f"AGENT-471,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1694..1698,In_Progress,Active,\"Course 03 (node-web) Month 2 Block 8 (Days 36-40): High-Performance Caching, Distributed Locking Redlock, Connection Pooling, Distributed Rate Limiting & Milestone 7 Low-Latency Inventory Reservation Gateway\",{now_date} {now_time},,,\n"

with open(MULTI_AGENT_CONTROL_PATH, "a", encoding="utf-8") as f:
    f.write(mac_entry)
print("Registered AGENT-471 in multi_agent_control.csv")

# Register tasks in agent_tasks.csv
tasks = [
    f"TASK-1694,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 8 Day 36: High-Performance In-Memory Caching: Redis Cluster Sharding, Key Eviction Policies & Pipeline Batching\",TypeScript/Node,\"nodeWebLongLessons.ts, day-36.json\",Course 03 node-web Block 8 expansion,{CONV_ID},\n",
    f"TASK-1695,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 8 Day 37: Distributed Locking & Concurrency Control: Redlock Algorithm, Lease Renewals & Fencing Tokens\",TypeScript/Node,\"nodeWebLongLessons.ts, day-37.json\",Course 03 node-web Block 8 expansion,{CONV_ID},\n",
    f"TASK-1696,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 8 Day 38: Connection Pooling & Resource Sizing: Generic-Pool, Socket Reuse & PostgreSQL pgBouncer Gateways\",TypeScript/Node,\"nodeWebLongLessons.ts, day-38.json\",Course 03 node-web Block 8 expansion,{CONV_ID},\n",
    f"TASK-1697,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 8 Day 39: Distributed Rate Limiting & Sliding Windows: Token Bucket, Leaky Bucket & Redis Lua Scripting\",TypeScript/Node,\"nodeWebLongLessons.ts, day-39.json\",Course 03 node-web Block 8 expansion,{CONV_ID},\n",
    f"TASK-1698,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,\"Course 03 Block 8 Day 40: Milestone 7: Low-Latency Distributed Inventory Reservation Gateway with Redlock & Lua Caching\",TypeScript/Node,\"nodeWebLongLessons.ts, day-40.json\",Course 03 node-web Block 8 expansion,{CONV_ID},\n"
]

with open(AGENT_TASKS_PATH, "a", encoding="utf-8") as f:
    for t in tasks:
        f.write(t)
print("Registered TASK-1694..1698 in agent_tasks.csv")
