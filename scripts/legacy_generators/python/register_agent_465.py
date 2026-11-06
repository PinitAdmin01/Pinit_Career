import csv
import datetime

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 1. Register in multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    mac_rows = list(csv.reader(f))

new_mac_row = [
    'AGENT-465',
    'Antigravity',
    'codex/interview-tab-reliability',
    'Present-Career-os',
    'TASK-1664..1668',
    'In_Progress',
    'Active',
    'Course 02 (react-basics) Month 2 Block 11 (Days 51-55): Next.js App Router Internals, Edge Middleware, Partial Prerendering, Server-Driven UI & Milestone 10',
    now_str,
    '', '', ''
]
mac_rows.append(new_mac_row)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Registered AGENT-465 in multi_agent_control.csv!")

# 2. Register in agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
tasks = [
    ('TASK-1664', 'Course 02 Month 2 Day 51: Next.js App Router Internals: Nested Layouts, Route Groups, Parallel Routes & Intercepting Routes'),
    ('TASK-1665', 'Course 02 Month 2 Day 52: Edge Runtime & Middleware Pipelines: Geo-Distributed Routing, Edge Caching, JWT Verification & Rate Limiting'),
    ('TASK-1666', 'Course 02 Month 2 Day 53: Streaming Hybrid Rendering & Partial Prerendering (PPR): Static Shells, Dynamic Holes & React Experimental Cache'),
    ('TASK-1667', 'Course 02 Month 2 Day 54: Server-Driven UI (SDUI) & Dynamic Component Engines: JSON Wire Schemas, Component Registries & Polymorphic Rendering'),
    ('TASK-1668', 'Course 02 Month 2 Day 55: Milestone 10: Enterprise Edge-Native Streaming Portal with Partial Prerendering (PPR), Edge Middleware & Server-Driven UI')
]

fieldnames = []
rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

for tid, desc in tasks:
    rows.append({
        'Task_ID': tid,
        'Date': datetime.datetime.now().strftime('%Y-%m-%d'),
        'Time': datetime.datetime.now().strftime('%H:%M:%S'),
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Antigravity IDE',
        'User_Goal': desc,
        'Tools_Used': 'Python/Node/TSX',
        'Files_Created': 'reactLongLessons.ts, react30DayData.ts, day-51..55.json',
        'Agent_Resolution': 'In progress expansion for Course 02 Block 11',
        'Session_Folder': 'c7b35c15-f056-4dc6-888b-f56621a809c1',
        'DELETE_FLAG': ''
    })

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Registered TASK-1664..1668 in agent_tasks.csv!")
