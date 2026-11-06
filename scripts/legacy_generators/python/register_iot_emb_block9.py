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
        rows.append(r)

block9_tasks = [
    {
        'Task_ID': 'TASK-1599',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) & Secure Elements (ATECC608) (Silicon SRAM startup entropy, non-exportable private keys, JTAG RDP lock levels)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1600',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Embedded Cryptography: AES-128/256-GCM, SHA-256 & Curve25519 Math on Cortex-M (Constant-time memcmp, GHASH authentication tags, hardware CRYP engine, timing side-channels)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1601',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses (Chain of trust BL1/BL2, SHA-256 hashing, P-256 ECDSA verification, monotonic counter eFuses)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1602',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Flash Memory Architecture: Wear Leveling, LittleFS / SPIFFS & Power-Loss Recovery (NOR Flash physical block erases, 100k cycle limits, dynamic wear leveling, power-cut resilience)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1603',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Milestone 8: Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine (Two-stage bootloader, immutable RoT keys, anti-rollback checks, glitch-resistant validation)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    }
]

rows.extend(block9_tasks)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print('Updated agent_tasks.csv with TASK-1599..1603!')

# 2. Append to multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = list(csv.reader(open(mac_path, 'r', encoding='utf-8')))

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
mac_rows.append(['AGENT-452', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1599..1603', 'In_Progress', 'none', 'Course 14 iot_emb Block 9 (Days 41-45: Hardware Security, Cryptography & Secure Boot: RoT PUF, AES-GCM, Secure Boot, LittleFS, Milestone 8)', now_str])

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print('Appended AGENT-452 to multi_agent_control.csv!')
