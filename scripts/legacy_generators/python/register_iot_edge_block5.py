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
    'AGENT-461',
    'Antigravity',
    'codex/interview-tab-reliability',
    'Present-Career-os',
    'main',
    '9c8e024e',
    'In Progress',
    'Course 18 (iot_edge) Month 1 Block 5 (Days 21-25) TFLM, CMSIS-NN, Micro-Vision, KWS & Milestone 5',
    'active',
    now_str
]
mac_rows.append(new_agent_row)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Registered AGENT-461 in multi_agent_control.csv")

# Register tasks in agent_tasks.csv
block5_tasks = [
    ('TASK-1644', 'Course 18 iot_edge Day 21: TensorFlow Lite for Microcontrollers (TFLM): FlatBuffers, OpResolvers & Tensor Arena Memory Planning'),
    ('TASK-1645', 'Course 18 iot_edge Day 22: CMSIS-NN Kernel Acceleration: ARM Cortex-M Helium Extensions & Im2Col Matrix Transforms'),
    ('TASK-1646', 'Course 18 iot_edge Day 23: Embedded Micro-Vision: MobileNet Architectures, Inverted Residuals & 96x96 Person Detection'),
    ('TASK-1647', 'Course 18 iot_edge Day 24: Keyword Spotting (KWS): Depthwise 1D/2D Audio CNNs, Ring Buffers & False Trigger Suppression'),
    ('TASK-1648', 'Course 18 iot_edge Day 25: Milestone 5: TensorFlow Lite for Microcontrollers (TFLM) Tensor Arena & CMSIS-NN Engine')
]

task_rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        task_rows.append(r)

date_str = datetime.now().strftime("%Y-%m-%d")
time_str = datetime.now().strftime("%H:%M:%S")

for tid, desc in block5_tasks:
    row = [
        tid,
        date_str,
        time_str,
        'IN_PROGRESS',
        'codex/interview-tab-reliability',
        'Antigravity',
        desc,
        'python,node,git',
        'src/lib/data/iotEdgeLongLessons.ts,src/lib/data/lessonVisuals/iot_edge/day-21..25.json',
        'In progress curriculum expansion',
        'Present-Career-os',
        ''
    ]
    task_rows.append(row)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(task_rows)

print("Registered TASK-1644 through TASK-1648 in agent_tasks.csv")
