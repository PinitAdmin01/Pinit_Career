import csv

control_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
c_rows = []
with open(control_csv_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] == "AGENT-480":
            if len(row) > 9:
                row[9] = "525e4609"
        c_rows.append(row)

with open(control_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(c_rows)

print("Updated AGENT-480 with commit 525e4609 in multi_agent_control.csv!")
