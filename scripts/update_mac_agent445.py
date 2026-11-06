import csv

mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) > 0 and r[0] == 'AGENT-445':
            # AGENT-445,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1564..1568,Completed,eb4b06ca,"Course 14 (iot_emb) Month 1 Block 2: Days 6-10 Complete, verified & pushed (eb4b06ca). 10/30 Days Complete."
            r = ['AGENT-445', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1564..1568', 'Completed', 'eb4b06ca', 'Course 14 (iot_emb) Month 1 Block 2: Days 6-10 Complete, verified & pushed (eb4b06ca). 10/30 Days Complete.']
        rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print('Updated AGENT-445 in multi_agent_control.csv successfully!')
