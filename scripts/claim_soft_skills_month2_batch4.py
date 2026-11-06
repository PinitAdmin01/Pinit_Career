import datetime

def claim():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated = []
    agent410_found = False
    for line in ctrl_lines:
        if "AGENT-410" in line:
            updated.append(
                f'AGENT-410,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1329,In Progress,{now_str},'
                '"CLAIMED: Month 2 Pioneer Batch 4: Block 10 — Days 46-50 (Tech Offer Evaluation & Equity Anatomy, Compensation Negotiation Playbook, Difficult Conversations & Performance, Delivering Bad News to Leadership, Milestone 7 ApexNegotiation Suite: TASK-1329..1333). Target: 50/60 Days (83.3% Complete)."\n'
            )
            agent410_found = True
        else:
            updated.append(line)

    if not agent410_found:
        updated.append(
            f'AGENT-410,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1329,In Progress,{now_str},'
            '"CLAIMED: Month 2 Pioneer Batch 4: Block 10 — Days 46-50 (Tech Offer Evaluation & Equity Anatomy, Compensation Negotiation Playbook, Difficult Conversations & Performance, Delivering Bad News to Leadership, Milestone 7 ApexNegotiation Suite: TASK-1329..1333). Target: 50/60 Days (83.3% Complete)."\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated)
    print("Claimed AGENT-410 in multi_agent_control.csv")

if __name__ == "__main__":
    claim()
