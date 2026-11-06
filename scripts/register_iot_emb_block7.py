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

block7_tasks = [
    {
        'Task_ID': 'TASK-1589',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Bluetooth Low Energy (BLE): GAP/GATT Profiles, Services, Characteristics & Advertising Physics (Connection events, slave latency, CCCD notifications)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1590',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Embedded Wi-Fi & TCP/IP Sockets: Station vs SoftAP, LwIP Stack & Embedded TLS Physics (Non-blocking sockets, ECDSA P-256 vs RSA, SNTP time sync)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1591',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Sub-GHz Long Range (LoRa & LoRaWAN): Chirp Spread Spectrum, Spreading Factors & Link Budgets (1% regional duty cycle, Time-on-Air, OTAA join protocol)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1592',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'IEEE 802.15.4 Mesh Networks: Zigbee, Thread, Sleepy End Devices & Matter Protocol (6LoWPAN header compression, distance vector routing, MLE)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1593',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Milestone 6: Low-Power Multi-Radio Wireless Mesh Gateway Engine (Hardware PTA arbitration, multi-band 2.4GHz/Sub-GHz bridging, local Flash spillover)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    }
]

rows.extend(block7_tasks)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print('Updated agent_tasks.csv with TASK-1589..1593!')

# 2. Append to multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = list(csv.reader(open(mac_path, 'r', encoding='utf-8')))

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
mac_rows.append(['AGENT-450', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1589..1593', 'In_Progress', 'Course 14 iot_emb Block 7 (Days 31-35: BLE, Wi-Fi LwIP, LoRaWAN, Thread 802.15.4 & Milestone 6 Multi-Radio Gateway)', now_str])

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print('Appended AGENT-450 to multi_agent_control.csv!')
