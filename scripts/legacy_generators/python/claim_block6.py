import csv

control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

# 1. Register AGENT-420 in multi_agent_control.csv
with open(control_path, "a", encoding="utf-8") as f:
    f.write('AGENT-420,Antigravity,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1379,In_Progress,2026-10-18 16:46:00,"Branch B Block 6 (FINAL COURSE 22 COMPLETION): Course 22 (Digital Accounting & Taxation) Days 26-30 (Capital Gains & Sec 115BAA, Ratio Diagnostics, AS-3 Cash Flow, AI Invoicing & Benford Forensics, Milestone 6 Grand Master Capstone: TASK-1379..1383) in progress"\n')

# 2. Register TASK-1379..1383 in agent_tasks.csv
with open(tasks_path, "a", encoding="utf-8") as f:
    f.write('TASK-1379,2026-10-18,16:46:00,IN_PROGRESS,Block 134,Antigravity,Course 22 bcom-accounting Day 26: Capital Gains Taxation & Corporate Income Tax (Section 115BAA),write_to_file; run_command,src/lib/data/bcomAccountingLongLessons.ts; src/lib/data/lessonVisuals/bcom-accounting/day-26.json,IN_PROGRESS,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n')
    f.write('TASK-1380,2026-10-18,16:46:00,PENDING,Block 134,Antigravity,Course 22 bcom-accounting Day 27: Financial Statement Analysis: Liquidity Solvency & Profitability Ratios,write_to_file; run_command,src/lib/data/bcomAccountingLongLessons.ts; src/lib/data/lessonVisuals/bcom-accounting/day-27.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n')
    f.write('TASK-1381,2026-10-18,16:46:00,PENDING,Block 134,Antigravity,Course 22 bcom-accounting Day 28: Cash Flow Statement (AS-3): Operating Investing & Financing Cashflows,write_to_file; run_command,src/lib/data/bcomAccountingLongLessons.ts; src/lib/data/lessonVisuals/bcom-accounting/day-28.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n')
    f.write('TASK-1382,2026-10-18,16:46:00,PENDING,Block 134,Antigravity,Course 22 bcom-accounting Day 29: Cloud Accounting AI Invoicing (OCR) & Forensic Fraud Detection,write_to_file; run_command,src/lib/data/bcomAccountingLongLessons.ts; src/lib/data/lessonVisuals/bcom-accounting/day-29.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n')
    f.write('TASK-1383,2026-10-18,16:46:00,PENDING,Block 134,Antigravity,Course 22 bcom-accounting Day 30: 🏆 Milestone 6 Grand Master Capstone: Integrated Corporate Digital Accounting GST & Tax Audit Suite,write_to_file; run_command,src/lib/data/bcomAccountingLongLessons.ts; src/lib/data/lessonVisuals/bcom-accounting/day-30.json; tests/bcom_finance_accounting_long_lessons.test.ts,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n')

print("Block 6 registered successfully in shared memory.")
