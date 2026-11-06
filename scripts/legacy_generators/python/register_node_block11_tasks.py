import os, datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Register in agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
if os.path.exists(tasks_path):
    with open(tasks_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_tasks = [
        f'TASK-1724,{datetime.date.today()},{datetime.datetime.now().strftime("%H:%M:%S")},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 11 Day 51: High-Throughput Stream Processing & Reactive Pipelines: Transform Streams, Backpressure & Memory Bounds",TypeScript/Node,"nodeWebLongLessons.ts, day-51.json",Course 03 node-web Block 11 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,',
        f'TASK-1725,{datetime.date.today()},{datetime.datetime.now().strftime("%H:%M:%S")},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 11 Day 52: Edge Security, TLS Offloading & Zero-Trust Identity: mTLS, Ephemeral Certificates, JWKS & RBAC",TypeScript/Node,"nodeWebLongLessons.ts, day-52.json",Course 03 node-web Block 11 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,',
        f'TASK-1726,{datetime.date.today()},{datetime.datetime.now().strftime("%H:%M:%S")},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 11 Day 53: Full-Lifecycle Distributed Observability: OpenTelemetry SDK, Trace Context Injection & Prometheus Histograms",TypeScript/Node,"nodeWebLongLessons.ts, day-53.json",Course 03 node-web Block 11 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,',
        f'TASK-1727,{datetime.date.today()},{datetime.datetime.now().strftime("%H:%M:%S")},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 11 Day 54: Dynamic Reverse Proxying, Protocol Translation & WebSocket Multiplexing: HTTP/1.1 to gRPC & WebSocket Hubs",TypeScript/Node,"nodeWebLongLessons.ts, day-54.json",Course 03 node-web Block 11 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,',
        f'TASK-1728,{datetime.date.today()},{datetime.datetime.now().strftime("%H:%M:%S")},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 11 Day 55: Milestone 10 Gateway Core: High-Throughput Edge Routing & Policy Engine with Transcoding & Adaptive Rate Limiting",TypeScript/Node,"nodeWebLongLessons.ts, day-55.json",Course 03 node-web Block 11 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,'
    ]
    
    with open(tasks_path, 'a', encoding='utf-8') as f:
        f.write('\n' + '\n'.join(new_tasks) + '\n')
    print("Registered TASK-1724..1728 in agent_tasks.csv")

# 2. Register in multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
if os.path.exists(mac_path):
    row = f'AGENT-476,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1724..1728,In_Progress,ff0b4af6,In_Progress\n'
    with open(mac_path, 'a', encoding='utf-8') as f:
        f.write(row)
    print("Registered AGENT-476 in multi_agent_control.csv")
