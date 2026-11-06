import datetime

def sync():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

    with open(tasks_path, "r", encoding="utf-8") as f:
        tasks_text = f.read()

    new_tasks = [
        f'TASK-1279,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 21 comp_fund Day 31: Hardware Virtualization (Type 1 vs Type 2 Hypervisors / Intel VT-x / Extended Page Tables EPT),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-31.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1280,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 21 comp_fund Day 32: Linux Containers Internals (6 Namespaces & cgroups v2 Unified Hierarchy),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-32.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1281,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 21 comp_fund Day 33: Container Images & Union File Systems (OverlayFS / Whiteouts / OCI Runtimes runc & containerd),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-33.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1282,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 21 comp_fund Day 34: Container Networking (veth Pairs / Linux Bridges / iptables SNAT-DNAT / CNI Plugins),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-34.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1283,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 21 comp_fund Day 35: Milestone 6 ApexContainer Rootless Container Engine & cgroups Virtualization Suite Viva,write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-35.json; tests/systems_long_lessons_parity.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1279" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1279..1283 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_text = f.read()

    ctrl_line = (
        f'AGENT-400,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1279,Completed,{now_str},'
        '"5-Task Batch Protocol Complete: Month 2 Pioneer Batch 1 — Course 21 comp_fund Days 31-35: Hardware Virtualization (VT-x/EPT/KVM), Linux Namespaces & cgroups v2, OverlayFS Union File Systems & OCI Runtimes, Container Virtual Networking (veth/Bridge/NAT/CNI) & ApexContainer Milestone 6 Viva (TASK-1279..1283) committed & pushed (44c1d309). 17,714 words (all 5 days >= 28.6 spoken min, avg 29.5 min/day), 100/100 parity tests passing, 0 tsc errors. Course 21 advances to 35/60 Days (58.3%)!"\n'
    )
    if "AGENT-400" not in ctrl_text:
        with open(control_path, "a", encoding="utf-8") as f:
            f.write(ctrl_line)
        print("Appended AGENT-400 to multi_agent_control.csv")

if __name__ == "__main__":
    sync()
