import datetime

def claim():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated = []
    agent411_found = False
    for line in ctrl_lines:
        if "AGENT-411" in line:
            updated.append(
                f'AGENT-411,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1334,In Progress,{now_str},'
                '"CLAIMED: Month 2 Pioneer Batch 5: Block 11 — Days 51-55 (Public Speaking & CFP Writing, Technical Writing & Hacker News Virality, Remote Async Sovereignty, Staff+ Interview Gauntlet, Challenger O-Ring Disaster Forensics: TASK-1334..1338). Target: 55/60 Days (91.7% Complete)."\n'
            )
            agent411_found = True
        else:
            updated.append(line)

    if not agent411_found:
        updated.append(
            f'AGENT-411,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1334,In Progress,{now_str},'
            '"CLAIMED: Month 2 Pioneer Batch 5: Block 11 — Days 51-55 (Public Speaking & CFP Writing, Technical Writing & Hacker News Virality, Remote Async Sovereignty, Staff+ Interview Gauntlet, Challenger O-Ring Disaster Forensics: TASK-1334..1338). Target: 55/60 Days (91.7% Complete)."\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated)
    print("Claimed AGENT-411 in multi_agent_control.csv")

if __name__ == "__main__":
    claim()
