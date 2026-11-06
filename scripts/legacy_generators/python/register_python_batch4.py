import csv
import os
from datetime import datetime

MEM_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
TASKS_CSV = os.path.join(MEM_DIR, "agent_tasks.csv")
CONTROL_CSV = os.path.join(MEM_DIR, "multi_agent_control.csv")

# 1. Register tasks TASK-1534..1538 in agent_tasks.csv
new_tasks = [
    ["TASK-1534", "Course 20", "python", "Day 46 - gRPC, Protocol Buffers & HTTP/2 in Python (grpc.aio)", "IN_PROGRESS", "Binary protobuf serialization, HTTP/2 multiplexing, unary vs bidirectional streaming, grpc.aio async servicer."],
    ["TASK-1535", "Course 20", "python", "Day 47 - Kafka Event-Driven Architecture with aiokafka", "PENDING", "Kafka partitions, consumer groups, rebalance protocols, offset commit semantics (at-least-once), and aiokafka."],
    ["TASK-1536", "Course 20", "python", "Day 48 - Distributed Caching & Cache Invalidation with Redis", "PENDING", "Cache-aside, write-through, probabilistic early expiration (XFetch), cache stampede mitigation, and Redis clustering."],
    ["TASK-1537", "Course 20", "python", "Day 49 - Microservice Resilience: Circuit Breakers, Bulkheads & Rate Limiting", "PENDING", "Finite state machine circuit breakers (CLOSED/OPEN/HALF_OPEN), bulkhead concurrency isolation, and token bucket rate limiters."],
    ["TASK-1538", "Course 20", "python", "Day 50 - Milestone Project 9: High-Throughput Event-Driven Microservice & gRPC Gateway Engine", "PENDING", "Complete event-driven microservice synthesizing gRPC gateway, Kafka event streams, Redis cache tier, and circuit breakers."]
]

with open(TASKS_CSV, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Registered TASK-1534..1538 in agent_tasks.csv")

# 2. Register AGENT-436 as In_Progress in multi_agent_control.csv
control_rows = []
with open(CONTROL_CSV, "r", encoding="utf-8") as f:
    control_rows = list(csv.reader(f))

control_rows.append([
    "AGENT-436",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1534..1538",
    "In_Progress",
    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "Course 20 (python) Block 10: Days 46-50 (Stage 10: Event-Driven Microservices & High-Throughput gRPC Architecture)",
    "", "", "", ""
])

with open(CONTROL_CSV, "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(control_rows)

print("Registered AGENT-436 as In_Progress in multi_agent_control.csv")
