import csv
import datetime

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

tasks = [
    ("TASK-1172", "Antigravity", "In_Progress", "TASK-1172: Expand Excel & Financial Engineering Day 31: Dynamic Three-Statement Financial Modeling: Integrated P&L, Balance Sheet & Cash Flow Loops (Month 2 Batch 1)", "2026-10-17"),
    ("TASK-1173", "Antigravity", "In_Progress", "TASK-1173: Expand Excel & Financial Engineering Day 32: Debt Sculpting, Revolver Schedules & Circular Reference Resolution (Iterative Calculation Mechanics)", "2026-10-17"),
    ("TASK-1174", "Antigravity", "In_Progress", "TASK-1174: Expand Excel & Financial Engineering Day 33: Capital Budgeting & Valuation: Discounted Cash Flow (DCF), WACC & Multi-Tier Waterfall Returns", "2026-10-17"),
    ("TASK-1175", "Antigravity", "In_Progress", "TASK-1175: Expand Excel & Financial Engineering Day 34: Advanced Sensitivity & Scenario Managers: Two-Way Data Tables, Tornado Charts & Monte Carlo Simulations", "2026-10-17"),
    ("TASK-1176", "Antigravity", "In_Progress", "TASK-1176: Expand Excel & Financial Engineering Day 35: ⭐ MILESTONE 4: ApexValuation Three-Statement Financial Modeling & Monte Carlo DCF Engine Suite", "2026-10-17"),
]

with open(tasks_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    for t in tasks:
        writer.writerow(t)

print("Tasks TASK-1172..1176 appended to agent_tasks.csv")

control_row = [
    "AGENT-377",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1176",
    "In_Progress",
    datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "5-Task Batch Protocol In Progress: Launching Month 2 (Days 31-60) Pioneer on Branch A: Course 21 excel_viz Days 31-35 (Three-Statement Models, Debt Sculpting & Circularity, DCF & WACC Waterfall, Sensitivity & Monte Carlo, Milestone 4 ApexValuation Suite, TASK-1172..1176)."
]

with open(control_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(control_row)

print("AGENT-377 claimed in multi_agent_control.csv")
