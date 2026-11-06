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

block8_tasks = [
    {
        'Task_ID': 'TASK-1594',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament (Topic wildcards, Keep-Alive 1.5x, LWT disconnect detection)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1595',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern (RFC 7252 4-byte header, CON/NON/ACK, Block-wise transfer)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1596',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers (RS-485 DE/RE direction switching, t1.5/t3.5 frame silence, CRC-16)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1597',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR (RFC 8949) & MessagePack (Varint/ZigZag encoding, zero-allocation deserialization, 75% bandwidth reduction)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    },
    {
        'Task_ID': 'TASK-1598',
        'Date': 'Course 14',
        'Time': 'iot_emb',
        'Status': 'IN_PROGRESS',
        'Dark_Gracity_Ref': 'IN_PROGRESS',
        'Execution_Engine': 'Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge (RS-485 fieldbus polling decoupling, NanoPB binary packing, TLS MQTT publishing, Flash spooling)',
        'User_Goal': '',
        'Tools_Used': '',
        'Files_Created': '',
        'Agent_Resolution': '',
        'Session_Folder': '',
        'DELETE_FLAG': ''
    }
]

rows.extend(block8_tasks)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print('Updated agent_tasks.csv with TASK-1594..1598!')

# 2. Append to multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = list(csv.reader(open(mac_path, 'r', encoding='utf-8')))

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
mac_rows.append(['AGENT-451', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1594..1598', 'In_Progress', 'Course 14 iot_emb Block 8 (Days 36-40: Industrial IoT Protocols: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Bridge)', now_str])

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print('Appended AGENT-451 to multi_agent_control.csv!')
