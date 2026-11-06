import csv
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# Register in multi_agent_control.csv
mac_rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        mac_rows.append(r)

now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
new_agent_row = [
    'AGENT-462',
    'Antigravity',
    'codex/interview-tab-reliability',
    'Present-Career-os',
    'main',
    '1ec42c93',
    'In Progress',
    'Course 18 (iot_edge) Month 1 Block 6 (Days 26-30) Autoencoders, Energy Profiling, Multi-Modal Sensor Fusion & ApexTinyML Capstone',
    'active',
    now_str
]
mac_rows.append(new_agent_row)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Registered AGENT-462 in multi_agent_control.csv")

# Register tasks in agent_tasks.csv
block6_tasks = [
    ('TASK-1649', 'Course 18 iot_edge Day 26: Unsupervised Anomaly Detection: Under-Complete Autoencoders & Reconstruction Error'),
    ('TASK-1650', 'Course 18 iot_edge Day 27: TinyML Energy Profiling: Microjoules per Inference, Duty Cycles & Power Gating'),
    ('TASK-1651', 'Course 18 iot_edge Day 28: On-Device Sensor Fusion: Multi-Modal IMU + Acoustic Ingestion & Cross-Sensor Attention'),
    ('TASK-1652', 'Course 18 iot_edge Day 29: On-Device Continuous Learning: Few-Shot Transfer Learning & Flash-Resident Linear Heads'),
    ('TASK-1653', 'Course 18 iot_edge Day 30: Capstone 1: ApexTinyML Autonomous Industrial Motor Anomaly & Predictive Maintenance Edge Node Capstone Viva Gate')
]

task_rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        task_rows.append(r)

date_str = datetime.now().strftime("%Y-%m-%d")
time_str = datetime.now().strftime("%H:%M:%S")

for tid, desc in block6_tasks:
    row = [
        tid,
        date_str,
        time_str,
        'IN_PROGRESS',
        'codex/interview-tab-reliability',
        'Antigravity',
        desc,
        'python,node,git',
        'src/lib/data/iotEdgeLongLessons.ts,src/lib/data/lessonVisuals/iot_edge/day-26..30.json',
        'In progress curriculum expansion',
        'Present-Career-os',
        ''
    ]
    task_rows.append(row)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(task_rows)

print("Registered TASK-1649 through TASK-1653 in agent_tasks.csv")
