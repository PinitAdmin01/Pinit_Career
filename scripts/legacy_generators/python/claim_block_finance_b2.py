import csv
import sys

# 1. Register AGENT-421 in multi_agent_control.csv
control_file = "C:/Users/Admin/Desktop/projects/memory of agent/multi_agent_control.csv"
with open(control_file, "a", newline="", encoding="utf-8") as f:
    f.write('AGENT-421,Antigravity,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1424,In_Progress,2026-10-18 17:52:00,"Branch B Block 2: Course 23 (Business Finance & Investment Management) Days 6-10 (Bond Valuation, YTM Approximation, Macaulay/Modified Duration & Immunization, Capital Budgeting NPV Rule, Milestone 2 Capital Budgeting IRR Bisection Capstone: TASK-1424..1428) in progress"\n')

print("Registered AGENT-421 in multi_agent_control.csv")

# 2. Register TASK-1424..1428 in agent_tasks.csv
tasks_file = "C:/Users/Admin/Desktop/projects/memory of agent/agent_tasks.csv"
tasks = [
    ("TASK-1424", "2026-10-18", "17:52:00", "IN_PROGRESS", "Block 135", "Antigravity",
     "Course 23 bcom-finance Day 6: Bond Valuation: Pricing Fixed Income Securities & Coupon Pricing",
     "write_to_file; run_command", "src/lib/data/bcomFinanceLongLessons.ts; src/lib/data/lessonVisuals/bcom-finance/day-06.json",
     "IN_PROGRESS", "481047a5-cc08-4e1b-9b8c-e007e0b97879", ""),
    ("TASK-1425", "2026-10-18", "17:52:00", "PENDING", "Block 135", "Antigravity",
     "Course 23 bcom-finance Day 7: Yield to Maturity (YTM) & Bond Yield Approximation",
     "write_to_file; run_command", "src/lib/data/bcomFinanceLongLessons.ts; src/lib/data/lessonVisuals/bcom-finance/day-07.json",
     "PENDING", "481047a5-cc08-4e1b-9b8c-e007e0b97879", ""),
    ("TASK-1426", "2026-10-18", "17:52:00", "PENDING", "Block 135", "Antigravity",
     "Course 23 bcom-finance Day 8: Interest Rate Risk: Macaulay Duration & Modified Duration",
     "write_to_file; run_command", "src/lib/data/bcomFinanceLongLessons.ts; src/lib/data/lessonVisuals/bcom-finance/day-08.json",
     "PENDING", "481047a5-cc08-4e1b-9b8c-e007e0b97879", ""),
    ("TASK-1427", "2026-10-18", "17:52:00", "PENDING", "Block 135", "Antigravity",
     "Course 23 bcom-finance Day 9: Capital Budgeting: Net Present Value (NPV) Decision Rule",
     "write_to_file; run_command", "src/lib/data/bcomFinanceLongLessons.ts; src/lib/data/lessonVisuals/bcom-finance/day-09.json",
     "PENDING", "481047a5-cc08-4e1b-9b8c-e007e0b97879", ""),
    ("TASK-1428", "2026-10-18", "17:52:00", "PENDING", "Block 135", "Antigravity",
     "Course 23 bcom-finance Day 10: 🏆 Milestone 2 Capstone: Capital Budgeting IRR Bisection Engine & Hurdle Rate Benchmark",
     "write_to_file; run_command", "src/lib/data/bcomFinanceLongLessons.ts; src/lib/data/lessonVisuals/bcom-finance/day-10.json; tests/bcom_finance_accounting_long_lessons.test.ts",
     "PENDING", "481047a5-cc08-4e1b-9b8c-e007e0b97879", "")
]

with open(tasks_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    for t in tasks:
        writer.writerow(t)

print("Registered TASK-1424..1428 in agent_tasks.csv")
