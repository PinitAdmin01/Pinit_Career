import csv, os, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(memory_dir, "multi_agent_control.csv")

now = datetime.datetime.now()
date_str = now.strftime("%Y-%m-%d")
time_str = now.strftime("%H:%M:%S")

new_tasks = [
    ["TASK-1704", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity IDE", "Course 03 Block 9 Day 41: Advanced Asynchronous Concurrency Patterns: AsyncLocalStorage, Async Hooks & Request Context Tracing", "TypeScript/Node", "nodeWebLongLessons.ts, day-41.json", "Course 03 node-web Block 9 expansion", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""],
    ["TASK-1705", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity IDE", "Course 03 Block 9 Day 42: Production Memory Management & Profiling: V8 Heap Snapshots, Leak Detection & Allocation Timelines", "TypeScript/Node", "nodeWebLongLessons.ts, day-42.json", "Course 03 node-web Block 9 expansion", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""],
    ["TASK-1706", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity IDE", "Course 03 Block 9 Day 43: Low-Latency Binary Protocols: Protocol Buffers, MessagePack & Binary WebSocket Serialization", "TypeScript/Node", "nodeWebLongLessons.ts, day-43.json", "Course 03 node-web Block 9 expansion", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""],
    ["TASK-1707", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity IDE", "Course 03 Block 9 Day 44: High-Performance Networking: HTTP/2 Multiplexing, ALPN Negotiation & gRPC Services in Node.js", "TypeScript/Node", "nodeWebLongLessons.ts, day-44.json", "Course 03 node-web Block 9 expansion", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""],
    ["TASK-1708", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity IDE", "Course 03 Block 9 Day 45: Milestone 8: High-Throughput Binary Telemetry Aggregator with gRPC & AsyncLocalStorage", "TypeScript/Node", "nodeWebLongLessons.ts, day-45.json", "Course 03 node-web Block 9 expansion", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""]
]

with open(agent_tasks_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)
print(f"Appended TASK-1704..1708 to {agent_tasks_path}")

new_agent_row = [
    "AGENT-473",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1704..1708",
    "In_Progress",
    "Active",
    "Course 03 (node-web) Month 2 Block 9 (Days 41-45): AsyncLocalStorage, V8 Heap Profiling, Binary Protocol Buffers, gRPC & Milestone 8 Binary Telemetry Aggregator",
    f"{date_str} {time_str}",
    "ed871468",
    "",
    ""
]

with open(multi_agent_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(new_agent_row)
print(f"Registered AGENT-473 in {multi_agent_path}")
