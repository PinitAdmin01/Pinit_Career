import csv, datetime

commit_hash = "a2b15e34"
timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# Update agent_tasks.csv
rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) > 0 and r[0] in ['TASK-1739', 'TASK-1740', 'TASK-1741', 'TASK-1742', 'TASK-1743']:
            r[3] = "COMPLETED"
            r[4] = "COMPLETED"
            r[6] = "DONE"
            while len(r) < 12:
                r.append("")
            r[11] = commit_hash
        rows.append(r)
with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print("Corrected agent_tasks.csv")

# Update multi_agent_control.csv
rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) > 0 and r[0] == 'AGENT-479':
            while len(r) < 12:
                r.append("")
            # Fix AGENT-479 row to standard format:
            # Task_ID,Date,Time,Assigned_Agent,Git_Branch,Branch_Address,Worktree_Folder,Agent_Status,Last_Commit,Active_Files,Conflict_Alerts,EXCEL_ACTION
            r = [
                "AGENT-479",
                "Antigravity",
                "codex/interview-tab-reliability",
                "Present-Career-os",
                "TASK-1739..1743",
                "Completed",
                "Completed",
                "Course 19 (iot_sec) Month 1 Block 4 (Days 16-20): IEEE 802.1AR PKI, Zero-Heap ASN.1 DER, OCSP Stapling, MCU TLS 1.3 & Milestone 4 Handshake Engine",
                "2026-10-20 19:45:00",
                commit_hash,
                timestamp,
                ""
            ]
        rows.append(r)
with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print("Corrected multi_agent_control.csv")
