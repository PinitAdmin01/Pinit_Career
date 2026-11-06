import os, sys

sys.stdout.reconfigure(encoding='utf-8')

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
AGENT_TASKS_PATH = os.path.join(MEMORY_DIR, "agent_tasks.csv")
MULTI_AGENT_PATH = os.path.join(MEMORY_DIR, "multi_agent_control.csv")

# 1. Register AGENT-469 in multi_agent_control.csv
mac_entry = "AGENT-469,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1684..1688,In_Progress,Active,\"Course 03 (node-web) Month 2 Block 7 (Days 31-35): Event-Driven Microservices, Kafka, RabbitMQ, Redis Streams & Milestone 6 Event-Driven Order Processing Engine\",2026-10-20 16:50:00,,,\n"

with open(MULTI_AGENT_PATH, 'a', encoding='utf-8') as f:
    f.write(mac_entry)

print("Registered AGENT-469 in multi_agent_control.csv!")

# 2. Register TASK-1684 through TASK-1688 in agent_tasks.csv
tasks = [
    ("TASK-1684", "Course 03 Month 2 Day 31: Advanced Event-Driven Microservices: Asynchronous Event Loops, Worker Threads & Event Emitters"),
    ("TASK-1685", "Course 03 Month 2 Day 32: Distributed Message Brokers: Apache Kafka Architecture, Partitions, Consumer Groups & Offsets"),
    ("TASK-1686", "Course 03 Month 2 Day 33: AMQP & Message Queuing: RabbitMQ Exchanges, Queues, Dead-Letter Exchanges & Acknowledgments"),
    ("TASK-1687", "Course 03 Month 2 Day 34: Redis Streams & Consumer Groups: High-Throughput In-Memory Streaming & Pending Acknowledgment Lists"),
    ("TASK-1688", "Course 03 Month 2 Day 35: 🏆 Milestone 6: Distributed Event-Driven Order Processing Engine with Kafka & Outbox Pattern")
]

task_lines = []
conv_id = "c7b35c15-f056-4dc6-888b-f56621a809c1"
for tid, title in tasks:
    line = f"{tid},2026-10-20,16:50:00,IN_PROGRESS,IN_PROGRESS,Antigravity IDE,{title},Python/Node/TSX,\"nodeWebLongLessons.ts, nodeWebDays.ts, day-31..35.json\",Course 03 Month 2 Block 7 expansion,{conv_id},\n"
    task_lines.append(line)

with open(AGENT_TASKS_PATH, 'a', encoding='utf-8') as f:
    f.writelines(task_lines)

print("Registered TASK-1684 through TASK-1688 in agent_tasks.csv!")
