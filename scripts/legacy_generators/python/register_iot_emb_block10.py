import csv
import datetime

mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    mac_rows = list(csv.reader(f))

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
mac_rows.append([
    'AGENT-453',
    'Antigravity',
    'codex/interview-tab-reliability',
    'Present-Career-os',
    'TASK-1604..1608',
    'In_Progress',
    '06ed54b7',
    'Course 14 iot_emb Block 10 (Days 46-50: FOTA Topologies, Delta Compression, Watchdog Rollbacks, Canary Fleet & Milestone 9 Zero-Brick FOTA Engine)',
    now_str
])

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Registered AGENT-453 in multi_agent_control.csv!")
