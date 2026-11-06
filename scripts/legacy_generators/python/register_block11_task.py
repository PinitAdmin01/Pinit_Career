# scripts/register_block11_task.py
import sys, os, datetime
sys.stdout.reconfigure(encoding='utf-8')
control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
with open(control_file, "a", encoding="utf-8") as f:
    f.write(f'AGENT-501,Agent Branch B,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1851..1855,Active,{now_str},"Course 06 bcom_law Month 2 Block 11 (Days 51-55: ESG, BRSR Core, CSR Section 135 and Whistleblower Vigil Mechanism)",,,,\n')
print("Updated multi_agent_control.csv for TASK-1851..1855 Active")
