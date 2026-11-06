import os, datetime

now_date = datetime.datetime.now().strftime("%Y-%m-%d")
now_time = datetime.datetime.now().strftime("%H:%M:%S")

# 1. Register tasks in agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
new_tasks = [
    f'TASK-1714,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 10 Day 46: Clustering, Process Model & IPC: Node.js Cluster Module, Master-Worker Topologies & Shared Sockets",TypeScript/Node,"nodeWebLongLessons.ts, day-46.json",Course 03 node-web Block 10 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1715,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 10 Day 47: Distributed Consensus Algorithms: Raft Leader Election, Heartbeats & Replicated State Machines",TypeScript/Node,"nodeWebLongLessons.ts, day-47.json",Course 03 node-web Block 10 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1716,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 10 Day 48: Fault Tolerance, Circuit Breaking & Chaos Engineering: Cockatiel Patterns, Bulkheads & Failure Isolation",TypeScript/Node,"nodeWebLongLessons.ts, day-48.json",Course 03 node-web Block 10 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1717,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,"Course 03 Block 10 Day 49: Dynamic Service Discovery & Health Checking: Consul / etcd Registration, Heartbeats & Client Load Balancing",TypeScript/Node,"nodeWebLongLessons.ts, day-49.json",Course 03 node-web Block 10 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1718,{now_date},{now_time},IN_PROGRESS,IN_PROGRESS,Antigravity IDE,Course 03 Block 10 Day 50: Milestone 9: Resilient Multi-Node Consensus Cluster with Raft Leader Election & Distributed Lease Manager,TypeScript/Node,"nodeWebLongLessons.ts, day-50.json",Course 03 node-web Block 10 expansion,c7b35c15-f056-4dc6-888b-f56621a809c1,\n'
]

with open(tasks_path, 'a', encoding='utf-8') as f:
    f.writelines(new_tasks)

print("Registered TASK-1714..1718 in agent_tasks.csv")

# 2. Register AGENT-474 in multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
agent_entry = f'AGENT-474,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1714..1718,In_Progress,Active,Active,\n'

with open(mac_path, 'a', encoding='utf-8') as f:
    f.write(agent_entry)

print("Registered AGENT-474 in multi_agent_control.csv")
