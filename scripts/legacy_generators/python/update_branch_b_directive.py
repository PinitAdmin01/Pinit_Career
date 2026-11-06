import os
from datetime import datetime

timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

project_memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
multi_agent_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# Append to PROJECT_MEMORY.md
directive_text = f"""
---
## 🎯 Tri-Stream Cross-Branch Alignment & Explicit Branch B Directive ({timestamp})

### 1. Ground Truth Platform State (Cross-Branch Reconciliation)
- **Month 1 (Days 1–30)**: **97.8% Finished Platform-Wide (35/37 Courses Done)**.
  - **Only TWO courses missing Month 1 days in the entire platform**:
    1. `iot_net` (Course 18): Currently at **Day 20 / 30** (Days 21–30 remaining). 👉 **Exclusively owned by Branch A**.
    2. `bcom_ana` (Course 41): Currently at **Day 5 / 30** (Days 6–30 remaining). 👉 **Assigned to Branch C**.
  - **Resolution of Branch B's Prior Confusion**: Branch B observed 5-day stubs of Commerce courses in Branch A and assumed they were incomplete across the whole project. In reality, **Branch B itself already completed Month 1 (30/30 Days) for 13 of the 14 Commerce courses**! Branch A is the isolated Tech branch and simply had not pulled Branch B's commerce commits.

### 2. Explicit Workstream Ownership Across Branches

| Branch | Workspace | Assigned Track | Immediate Active Task | Full Milestone Goal |
|:---|:---|:---|:---|:---|
| **Branch A** | `Present-Career-os`<br>(`codex/interview-tab-reliability`) | **Tech & IoT Engineering** | Finish `iot_net` Month 1 Days 21–30. | Complete `iot_net` Month 1 (30/30) & Month 2 (60/60), then advance Tech courses. |
| **Branch B** | `Present-Career-os-commerce`<br>(`agent/branch-b-curriculum-commerce-iot`) | **Commerce Courses 1 to 7**<br>(`bcom_acc`, `bcom_fin`, `bcom_mkt`, `bcom_aud`, `bcom_ban`, `bcom_dmkt`, `bcom_ecom`) | Start **Course 01 `bcom_acc` Month 2 (Days 31–35)**. | Author Month 2 (Days 31–60) for all 7 assigned Commerce courses (210 Days total). |
| **Branch C** | `Present-Career-os-platform`<br>(`agent/branch-c-platform-admin-faculty`) | **Commerce Courses 8 to 14**<br>(`bcom_ent`, `bcom_law`, `bcom_ops`, `bcom_scrm`, `bcom_tax`, `bcom_ait`, `bcom_ana`) | Finish `bcom_ent` Days 54–60, then start `bcom_law`. Complete `bcom_ana` Days 6–30. | Author Month 2 (Days 31–60) for Courses 8 to 14 + `bcom_ana` Month 1 (235 Days total). |

### 3. Dedicated Instruction File Delivered to Branch B
- Created: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os-commerce\\BRANCH_B_TASK_ASSIGNMENT.md`
- Updated: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os-commerce\\AGENTS.md`
- Branch B has complete, step-by-step syllabus instructions, invariant targets (>=580 words/part), and zero ambiguity.
"""

with open(project_memory_path, "a", encoding="utf-8") as f:
    f.write(directive_text)

print("Updated PROJECT_MEMORY.md with cross-branch directive.")

mac_entry = f"AGENT-493,Antigravity,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1821..1825,Active,{timestamp},\"Branch B Mandate Initialized: Commerce Month 2 (Courses 1-7: bcom_acc to bcom_ecom). Assigned Course 01 bcom_acc Days 31-35. Zero conflict with Branch A/C.\",,,,\n"

with open(multi_agent_path, "a", encoding="utf-8") as f:
    f.write(mac_entry)

print("Appended AGENT-493 to multi_agent_control.csv")
