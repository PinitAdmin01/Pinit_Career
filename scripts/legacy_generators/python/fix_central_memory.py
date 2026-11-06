import os

def fix_memory():
    tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
    mac_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

    # 1. multi_agent_control.csv
    with open(mac_csv, "r", encoding="utf-8", errors="ignore") as f:
        mac_text = f.read()

    # Split concatenated line if present
    if "bindings.\"AGENT-361" in mac_text:
        mac_text = mac_text.replace("bindings.\"AGENT-361", "bindings.\"\nAGENT-361")
        print("Separated AGENT-360 and AGENT-361 in multi_agent_control.csv")

    if not mac_text.endswith("\n"):
        mac_text += "\n"

    agent_362_line = 'AGENT-362,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1100,Completed,2026-10-17 16:00:00,"5-Task Batch Protocol Complete: git_vcs Days 21-25 (Course 22 Days 21-25: Milestone 3 & GitHub Collaboration, TASK-1096..1100) committed & pushed. 60/60 tests passing, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."\n'
    if "AGENT-362" not in mac_text:
        mac_text += agent_362_line
        print("Added AGENT-362 to multi_agent_control.csv")

    with open(mac_csv, "w", encoding="utf-8") as f:
        f.write(mac_text)

    # 2. agent_tasks.csv
    with open(tasks_csv, "r", encoding="utf-8", errors="ignore") as f:
        tasks_text = f.read()

    if "2026-10-17TASK-1096" in tasks_text:
        tasks_text = tasks_text.replace("2026-10-17TASK-1096", "2026-10-17\nTASK-1096")
        print("Separated TASK-1095 and TASK-1096 in agent_tasks.csv")

    git_vcs_tasks = [
        'TASK-1096,Antigravity,Complete,"TASK-1096: Expand Git & Version Control Systems Day 21: \u2b50 MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1097,Antigravity,Complete,"TASK-1097: Expand Git & Version Control Systems Day 22: GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1098,Antigravity,Complete,"TASK-1098: Expand Git & Version Control Systems Day 23: Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1099,Antigravity,Complete,"TASK-1099: Expand Git & Version Control Systems Day 24: GitHub Branch Protection Rules: Required CI Status Checks & Protected main with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1100,Antigravity,Complete,"TASK-1100: Expand Git & Version Control Systems Day 25: Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17'
    ]

    if not tasks_text.endswith("\n"):
        tasks_text += "\n"

    for t in git_vcs_tasks:
        key = t.split(',"')[1].split(':')[0]
        if key + ": Expand Git & Version Control" not in tasks_text:
            tasks_text += t + "\n"
            print(f"Added {key} to agent_tasks.csv")

    with open(tasks_csv, "w", encoding="utf-8") as f:
        f.write(tasks_text)

    print("Central memory files cleaned and synchronized successfully!")

if __name__ == "__main__":
    fix_memory()
