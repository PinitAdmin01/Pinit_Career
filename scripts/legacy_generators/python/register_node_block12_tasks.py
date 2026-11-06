import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date_str = datetime.datetime.now().strftime("%Y-%m-%d")
time_str = datetime.datetime.now().strftime("%H:%M:%S")

# 1. Register AGENT-478 in multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_entry = f'AGENT-478,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1734..1738,In_Progress,In_Progress,"Course 03 (node-web) Month 2 Block 12 (Days 56-60): Event-Driven Microservices with Kafka, CQRS/Event Sourcing, Sagas, Redis Cluster & Milestone 10 Capstone",{now_str},,,\n'

with open(mac_path, 'a', encoding='utf-8') as f:
    f.write(mac_entry)
print("Registered AGENT-478 in multi_agent_control.csv")

# 2. Register TASK-1734..1738 in agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
tasks = [
    (1734, "Course 03 Day 56: Event-Driven Microservices with Kafka: Consumer Groups, Partition Offsets & Rebalance Listeners", "scripts/node_day56.json, src/lib/data/lessonVisuals/node-web/day-56.json"),
    (1735, "Course 03 Day 57: CQRS, Event Sourcing & Transactional Outbox: Event Stores & Change Data Capture", "scripts/node_day57.json, src/lib/data/lessonVisuals/node-web/day-57.json"),
    (1736, "Course 03 Day 58: Distributed Sagas & Compensation Workflows: Orchestrator vs Choreography & Idempotent Retries", "scripts/node_day58.json, src/lib/data/lessonVisuals/node-web/day-58.json"),
    (1737, "Course 03 Day 59: High-Throughput Caching & Write-Behind Pipelines: Redis Cluster, Cache Invalidation & Stampede Protection", "scripts/node_day59.json, src/lib/data/lessonVisuals/node-web/day-59.json"),
    (1738, "Course 03 Day 60 Milestone 10 Capstone: High-Throughput Event-Driven Microservices Hub with Kafka Streaming, Outbox Pattern & Distributed Sagas", "scripts/node_day60.json, src/lib/data/lessonVisuals/node-web/day-60.json"),
]

task_lines = []
for tid, desc, files in tasks:
    line = f'TASK-{tid},{date_str},{time_str},IN_PROGRESS,IN_PROGRESS,Antigravity,PENDING,"read_file, write_file, run_command","{files}",{desc},Present-Career-os,\n'
    task_lines.append(line)

with open(tasks_path, 'a', encoding='utf-8') as f:
    f.writelines(task_lines)
print("Registered TASK-1734..1738 in agent_tasks.csv")
