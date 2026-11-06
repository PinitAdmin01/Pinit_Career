import datetime

def sync():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
    memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

    with open(tasks_path, "r", encoding="utf-8") as f:
        tasks_text = f.read()

    new_tasks = [
        f'TASK-1304,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 21 comp_fund Day 51: Historic Systems Catastrophe 1 (Knight Capital $440M Meltdown / Atomic Deploy / Circuit Breakers),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-51.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1305,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 21 comp_fund Day 52: Historic Systems Catastrophe 2 (CrowdStrike Falcon Global Ring 0 Kernel Crash / Bounds Validation / Canaries),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-52.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1306,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 21 comp_fund Day 53: Historic Systems Catastrophe 3 (Cloudflare Global ReDoS Outage / NFA Backtracking vs RE2 Thompson DFA),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-53.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1307,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 21 comp_fund Day 54: Operating Systems Convergence (Linux Monolithic io_uring vs Windows NT Executive IOCP vs macOS XNU kqueue),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-54.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1308,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 21 comp_fund Day 55: Modern Distributed OS & Cloud-Native Platforms (Kubernetes / AWS Firecracker 5ms MicroVMs / Unikernels),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-55.json; tests/systems_long_lessons_parity.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1304" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1304..1308 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_text = f.read()

    ctrl_line = (
        f'AGENT-405,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1304,Completed,{now_str},'
        '"5-Task Batch Protocol Complete: Month 2 Pioneer Batch 5 — Course 21 comp_fund Days 51-55: Knight Capital $440M Autopsy, CrowdStrike Ring 0 BSoD Autopsy & Staged Canaries, Cloudflare ReDoS Outopsy & RE2 Thompson DFA, Multi-OS Kernel Internals (Linux io_uring vs Windows NT IOCP vs macOS XNU kqueue) & Distributed OS / Firecracker 5ms MicroVMs / Unikernels (TASK-1304..1308) committed & pushed. 17,680 words (all 5 days >= 28.4 spoken min, avg 29.5 min/day), 120/120 parity tests passing, 0 tsc errors. Course 21 advances to 55/60 Days (91.7%)!"\n'
    )
    if "AGENT-405" not in ctrl_text:
        with open(control_path, "a", encoding="utf-8") as f:
            f.write(ctrl_line)
        print("Appended AGENT-405 to multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 21 (`comp_fund`) Month 2 Batch 5 (Days 51–55: Block 11) Complete ({now_str})
- **Agent**: `AGENT-405` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1304` through `TASK-1308`
- **Scope**:
  - **Day 51 (`TASK-1304`)**: *Historic Systems Catastrophe 1: The Knight Capital $440M 45-Minute Algorithmic Meltdown* (3,411 words, 28.4 min)
  - **Day 52 (`TASK-1305`)**: *Historic Systems Catastrophe 2: The CrowdStrike Falcon Global Windows Kernel Crash (BSoD)* (3,596 words, 30.0 min)
  - **Day 53 (`TASK-1306`)**: *Historic Systems Catastrophe 3: The Cloudflare Global Regex CPU Exhaustion Outage (ReDoS)* (3,663 words, 30.5 min)
  - **Day 54 (`TASK-1307`)**: *Operating Systems Convergence: Linux vs Windows NT Internals vs macOS Darwin (Mach Kernel)* (3,440 words, 28.7 min)
  - **Day 55 (`TASK-1308`)**: *Modern Distributed Operating Systems & Cloud-Native Platforms: Kubernetes, MicroVMs & Unikernels* (3,570 words, 29.8 min)
- **Verification**: 17,680 total words (avg 29.5 min/day), 120/120 passing tests in `tests/systems_long_lessons_parity.test.ts`, 0 TypeScript errors, Gate v2 visual specs `src/lib/data/lessonVisuals/comp_fund/day-{{51..55}}.json` verified with SHA-256 `codeHash` bindings.
"""
    if "TASK-1304" not in mem_text:
        with open(memory_path, "a", encoding="utf-8") as f:
            f.write(mem_entry)
        print("Updated PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
