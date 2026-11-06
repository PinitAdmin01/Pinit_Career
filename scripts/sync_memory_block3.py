import csv

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
agent_found = False
with open(mac_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) > 0 and r[0] == 'AGENT-446':
            r = ['AGENT-446', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1569..1573', 'Completed', 'f78f8a99', 'Course 14 (iot_emb) Month 1 Block 3: Days 11-15 Complete, verified & pushed (f78f8a99). 15/30 Days Complete.']
            agent_found = True
        rows.append(r)

if not agent_found:
    rows.append(['AGENT-446', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1569..1573', 'Completed', 'f78f8a99', 'Course 14 (iot_emb) Month 1 Block 3: Days 11-15 Complete, verified & pushed (f78f8a99). 15/30 Days Complete.'])

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print('Updated multi_agent_control.csv with AGENT-446!')

# 2. Update agent_tasks.csv with TASK-1569..1573
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    task_rows = list(reader)

new_tasks = [
    {
        'Task_ID': 'TASK-1569',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'COMPLETED',
        'Dark_Gracity_Ref': 'COMPLETED',
        'Execution_Engine': 'Day 11 - Nested Vectored Interrupt Controller (NVIC): Vector Tables, VTOR Relocation & Exception Stacking',
        'User_Goal': 'Master Cortex-M vector table layout, VTOR 512-byte alignment, 8-word hardware exception stacking, and priority grouping.',
        'Tools_Used': 'Antigravity C++ AST Engine & Gate v2 Visuals',
        'Files_Created': 'src/lib/data/iotEmbLongLessons.ts, src/lib/data/lessonVisuals/iot_emb/day-11.json',
        'Agent_Resolution': 'Completed & Verified',
        'Session_Folder': 'Present-Career-os',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1570',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'COMPLETED',
        'Dark_Gracity_Ref': 'COMPLETED',
        'Execution_Engine': 'Day 12 - Hardware Interrupt Latency, Tail-Chaining, Late-Arrival & DWT Benchmarking',
        'User_Goal': 'Quantify ARM Cortex-M hardware interrupt latency, 6-cycle tail-chaining optimization, late-arrival preemption, and DWT->CYCCNT cycle counting.',
        'Tools_Used': 'Antigravity C++ AST Engine & Gate v2 Visuals',
        'Files_Created': 'src/lib/data/iotEmbLongLessons.ts, src/lib/data/lessonVisuals/iot_emb/day-12.json',
        'Agent_Resolution': 'Completed & Verified',
        'Session_Folder': 'Present-Career-os',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1571',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'COMPLETED',
        'Dark_Gracity_Ref': 'COMPLETED',
        'Execution_Engine': 'Day 13 - Hardware Timers: Prescalers, Auto-Reload (ARR) & Center-Aligned PWM',
        'User_Goal': 'Master 16-bit/32-bit hardware timers, timer prescalers, auto-reload registers, and center-aligned complementary PWM with dead-time generation.',
        'Tools_Used': 'Antigravity C++ AST Engine & Gate v2 Visuals',
        'Files_Created': 'src/lib/data/iotEmbLongLessons.ts, src/lib/data/lessonVisuals/iot_emb/day-13.json',
        'Agent_Resolution': 'Completed & Verified',
        'Session_Folder': 'Present-Career-os',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1572',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'COMPLETED',
        'Dark_Gracity_Ref': 'COMPLETED',
        'Execution_Engine': 'Day 14 - Analog-to-Digital Converters (ADC): 12-Bit SAR, Sampling Time & VREFINT Calibration',
        'User_Goal': 'Master 12-bit SAR ADC physics, RC input impedance settling time, conversion clock limits, and factory VREFINT power supply calibration.',
        'Tools_Used': 'Antigravity C++ AST Engine & Gate v2 Visuals',
        'Files_Created': 'src/lib/data/iotEmbLongLessons.ts, src/lib/data/lessonVisuals/iot_emb/day-14.json',
        'Agent_Resolution': 'Completed & Verified',
        'Session_Folder': 'Present-Career-os',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1573',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'COMPLETED',
        'Dark_Gracity_Ref': 'COMPLETED',
        'Execution_Engine': 'Day 15 - Milestone 3: Real-Time Hardware Signal Generator & DMA Data Engine',
        'User_Goal': 'Construct unified hardware data acquisition engine linking TIM2 TRGO hardware triggers, 12-bit ADC, DMA circular double-buffering, and DSP True RMS analysis.',
        'Tools_Used': 'Antigravity C++ AST Engine & Gate v2 Visuals',
        'Files_Created': 'src/lib/data/iotEmbLongLessons.ts, src/lib/data/lessonVisuals/iot_emb/day-15.json',
        'Agent_Resolution': 'Completed & Verified',
        'Session_Folder': 'Present-Career-os',
        'DELETE_FLAG': ''
    }
]

# Ensure we don't duplicate
existing_task_ids = {r.get('Task_ID') for r in task_rows}
for nt in new_tasks:
    if nt['Task_ID'] in existing_task_ids:
        for r in task_rows:
            if r.get('Task_ID') == nt['Task_ID']:
                r.update(nt)
    else:
        task_rows.append(nt)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(task_rows)
print('Updated agent_tasks.csv with TASK-1569..1573!')
