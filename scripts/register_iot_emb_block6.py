import csv
import datetime

# 1. Update and append agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
rows = []
fieldnames = []

with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        if r.get('Task_ID') in ['TASK-1579', 'TASK-1580', 'TASK-1581', 'TASK-1582', 'TASK-1583']:
            r['Status'] = 'COMPLETED'
            r['Dark_Gracity_Ref'] = 'COMPLETED'
        rows.append(r)

block6_tasks = [
    {
        'Task_ID': 'TASK-1584',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'RTOS Dynamic Memory Allocation: heap_1 through heap_5, Fragmentation & Static Allocation (xTaskCreateStatic, xQueueCreateStatic, deterministic heap invariants)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1585',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Software Timers & Idle Task Hook: Watchdog Kicking & Tickless Low-Power Mode (WFI/WFE, LPTIM deep sleep, daemon task mechanics)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1586',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'MISRA-C & ISO 26262 Coding Standards: Static Analysis, Undefined Behavior & Safe Embedded Patterns (integer promotion, bounded loops, Cppcheck/Clang-Tidy)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1587',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Production Hardware Debugging: SWD/JTAG Protocols, Fault Handlers & Core Dump Forensics (HardFault naked assembly, CFSR/BFAR decoding, addr2line symbol resolution)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1588',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Capstone 1: NanoRTOS Preemptive Kernel & Multitasking Firmware Engine Capstone Viva Gate (complete 30-day embedded synthesis, clock tree, DMA, RTOS, MISRA-C & fault injection)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    }
]

rows.extend(block6_tasks)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print('Updated agent_tasks.csv with TASK-1584..1588!')

# 2. Append to multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = list(csv.reader(open(mac_path, 'r', encoding='utf-8')))

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
mac_rows.append(['AGENT-449', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1584..1588', 'In_Progress', 'Course 14 iot_emb Block 6 (Days 26-30: Static RTOS, Tickless Low Power, MISRA-C, Fault Handlers & Month 1 Capstone)', now_str])

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print('Appended AGENT-449 to multi_agent_control.csv!')
