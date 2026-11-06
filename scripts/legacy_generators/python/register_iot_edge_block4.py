import csv
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# Register in multi_agent_control.csv
with open(mac_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([
        'AGENT-459',
        'Antigravity',
        'codex/interview-tab-reliability',
        'Present-Career-os',
        'TASK-1634..1638',
        'In_Progress',
        'none',
        'Course 18 (iot_edge) Month 1 Block 4 (Days 16-20): Model Quantization Fundamentals, PTQ vs QAT, Pruning & CSR, Knowledge Distillation, and Milestone 4 Optimization Engine',
        datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        '', '', ''
    ])

print("Registered AGENT-459 in multi_agent_control.csv")

# Register tasks in agent_tasks.csv
tasks = [
    ('TASK-1634', 'Course 18 (iot_edge) Day 16: Model Quantization Fundamentals: FP32 to INT8 Mapping, Scale, Zero-Point & Dynamic Range'),
    ('TASK-1635', 'Course 18 (iot_edge) Day 17: Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT) & Calibration Data'),
    ('TASK-1636', 'Course 18 (iot_edge) Day 18: Weight Pruning & Sparsity: Magnitude Pruning, Structured Channel Pruning & CSR Storage'),
    ('TASK-1637', 'Course 18 (iot_edge) Day 19: Knowledge Distillation for Microcontrollers: Teacher-Student Networks & Temperature Scaling'),
    ('TASK-1638', 'Course 18 (iot_edge) Day 20: Milestone 4: INT8 Post-Training Quantization & Structured Pruning Optimization Engine')
]

with open(tasks_path, 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    for tid, desc in tasks:
        writer.writerow([
            tid,
            desc,
            'Curriculum',
            'IN_PROGRESS',
            'HIGH',
            'AGENT-459',
            '2026-10-19',
            '',
            '0%',
            'Authoring Day with >= 2900 words, Gate v2 visual, 38 min declared, 4 options answer 0'
        ])

print("Registered TASK-1634..1638 in agent_tasks.csv")
