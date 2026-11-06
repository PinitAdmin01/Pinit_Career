import csv
import datetime

now_dt = datetime.datetime.now()
date_str = now_dt.strftime("%Y-%m-%d")
time_str = now_dt.strftime("%H:%M:%S")

tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
fieldnames = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames

new_tasks = [
    {
        "Task_ID": "TASK-1699",
        "Date": date_str,
        "Time": time_str,
        "Status": "IN_PROGRESS",
        "Dark_Gracity_Ref": "IN_PROGRESS",
        "Execution_Engine": "Antigravity",
        "User_Goal": "Course 18 Day 51: Edge Swarm Intelligence: Distributed Consensus, Gossip Protocols & Collective Inference",
        "Tools_Used": "read_file, write_file, run_command",
        "Files_Created": "scripts/iot_edge_day51.json, src/lib/data/lessonVisuals/iot_edge/day-51.json",
        "Agent_Resolution": "Authoring Day 51 with >=580 words/part, 38 min class duration, runnable Python code, and Gate v2 visuals.",
        "Session_Folder": "Present-Career-os",
        "DELETE_FLAG": ""
    },
    {
        "Task_ID": "TASK-1700",
        "Date": date_str,
        "Time": time_str,
        "Status": "IN_PROGRESS",
        "Dark_Gracity_Ref": "IN_PROGRESS",
        "Execution_Engine": "Antigravity",
        "User_Goal": "Course 18 Day 52: Federated Learning on Microcontrollers: Local On-Device Gradient Computation & Secure Aggregation",
        "Tools_Used": "read_file, write_file, run_command",
        "Files_Created": "scripts/iot_edge_day52.json, src/lib/data/lessonVisuals/iot_edge/day-52.json",
        "Agent_Resolution": "Authoring Day 52 with >=580 words/part, 38 min class duration, runnable Python code, and Gate v2 visuals.",
        "Session_Folder": "Present-Career-os",
        "DELETE_FLAG": ""
    },
    {
        "Task_ID": "TASK-1701",
        "Date": date_str,
        "Time": time_str,
        "Status": "IN_PROGRESS",
        "Dark_Gracity_Ref": "IN_PROGRESS",
        "Execution_Engine": "Antigravity",
        "User_Goal": "Course 18 Day 53: Distributed Model Partitioning: Pipelined Inference Across BLE/Thread Multi-Node Clusters",
        "Tools_Used": "read_file, write_file, run_command",
        "Files_Created": "scripts/iot_edge_day53.json, src/lib/data/lessonVisuals/iot_edge/day-53.json",
        "Agent_Resolution": "Authoring Day 53 with >=580 words/part, 38 min class duration, runnable Python code, and Gate v2 visuals.",
        "Session_Folder": "Present-Career-os",
        "DELETE_FLAG": ""
    },
    {
        "Task_ID": "TASK-1702",
        "Date": date_str,
        "Time": time_str,
        "Status": "IN_PROGRESS",
        "Dark_Gracity_Ref": "IN_PROGRESS",
        "Execution_Engine": "Antigravity",
        "User_Goal": "Course 18 Day 54: On-Device Continuous Learning: Micro-Backpropagation, Low-Rank Adaptation (LoRA) & Drift Adaptation",
        "Tools_Used": "read_file, write_file, run_command",
        "Files_Created": "scripts/iot_edge_day54.json, src/lib/data/lessonVisuals/iot_edge/day-54.json",
        "Agent_Resolution": "Authoring Day 54 with >=580 words/part, 38 min class duration, runnable Python code, and Gate v2 visuals.",
        "Session_Folder": "Present-Career-os",
        "DELETE_FLAG": ""
    },
    {
        "Task_ID": "TASK-1703",
        "Date": date_str,
        "Time": time_str,
        "Status": "IN_PROGRESS",
        "Dark_Gracity_Ref": "IN_PROGRESS",
        "Execution_Engine": "Antigravity",
        "User_Goal": "Course 18 Day 55: Milestone 10: Autonomous Multi-Node Swarm Acoustic Triangulation & Federated Anomaly Localization Engine",
        "Tools_Used": "read_file, write_file, run_command",
        "Files_Created": "scripts/iot_edge_day55.json, src/lib/data/lessonVisuals/iot_edge/day-55.json",
        "Agent_Resolution": "Authoring Day 55 Milestone 10 with >=580 words/part, 38 min class duration, runnable Python code, and Gate v2 visuals.",
        "Session_Folder": "Present-Career-os",
        "DELETE_FLAG": ""
    }
]

with open(tasks_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    for task in new_tasks:
        writer.writerow(task)

print("Appended TASK-1699..1703 to agent_tasks.csv!")

# 2. Append AGENT-472 to multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
new_mac_row = [
    'AGENT-472',
    'Antigravity',
    'codex/interview-tab-reliability',
    'Present-Career-os',
    'TASK-1699..1703',
    'In_Progress',
    'Active',
    'Course 18 Block 11 (Days 51-55): Swarm Intelligence, Distributed Federated Learning & Milestone 10 Engine',
    f"{date_str} {time_str}",
    '759af0e6',
    '',
    ''
]

with open(mac_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(new_mac_row)

print("Appended AGENT-472 to multi_agent_control.csv!")
