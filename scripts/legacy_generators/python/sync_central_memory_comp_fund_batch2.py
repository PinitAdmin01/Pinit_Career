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
        f'TASK-1289,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 21 comp_fund Day 36: Modern Linux Tracing (eBPF / BPF Verifier / kprobes / uprobes / bpftrace),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-36.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1290,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 21 comp_fund Day 37: Brendan Gregg USE Method & RED Method (Systems Bottleneck Calculus),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-37.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1291,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 21 comp_fund Day 38: Systems Profiling (Linux perf / On-CPU & Off-CPU Flame Graphs / Hardware PMU Counters),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-38.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1292,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 21 comp_fund Day 39: Production Core Dump Forensics (GDB / Registers / Stack Unwinding / DWARF Symbols),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-39.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1293,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 21 comp_fund Day 40: Milestone 7 ApexTrace eBPF Kernel Observability & Performance Profiling Suite Viva,write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-40.json; tests/systems_long_lessons_parity.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1289" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1289..1293 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_text = f.read()

    ctrl_line = (
        f'AGENT-402,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1289,Completed,{now_str},'
        '"5-Task Batch Protocol Complete: Month 2 Pioneer Batch 2 — Course 21 comp_fund Days 36-40: Modern Linux eBPF Tracing, Brendan Gregg USE & RED Methodologies, Linux perf On/Off-CPU Flame Graphs & PMU Counters, Production Core Dump Forensics (GDB/DWARF) & ApexTrace Milestone 7 Viva (TASK-1289..1293) committed & pushed. 17,490 words (all 5 days >= 27.9 spoken min, avg 29.1 min/day), 105/105 parity tests passing, 0 tsc errors. Course 21 advances to 40/60 Days (66.7%)!"\n'
    )
    if "AGENT-402" not in ctrl_text:
        with open(control_path, "a", encoding="utf-8") as f:
            f.write(ctrl_line)
        print("Appended AGENT-402 to multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 21 (`comp_fund`) Month 2 Batch 2 (Days 36–40: Block 8) Complete ({now_str})
- **Agent**: `AGENT-402` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1289` through `TASK-1293`
- **Scope**:
  - **Day 36 (`TASK-1289`)**: *Modern Linux Tracing: eBPF (Extended Berkeley Packet Filter), kprobes, uprobes & bpftrace* (3,350 words, 27.9 min)
  - **Day 37 (`TASK-1290`)**: *Brendan Gregg's USE Method & RED Method: Systems Bottleneck Calculus* (3,729 words, 31.1 min)
  - **Day 38 (`TASK-1291`)**: *Systems Profiling: Linux perf, CPU Flame Graphs & Hardware Performance Counters* (3,362 words, 28.0 min)
  - **Day 39 (`TASK-1292`)**: *Production Core Dump Forensics: GDB, Memory Registers, Stack Unwinding & DWARF Symbols* (3,437 words, 28.6 min)
  - **Day 40 (`TASK-1293`)**: *Milestone 7: ApexTrace eBPF Kernel Observability & Performance Profiling Suite Architecture Review* (3,612 words, 30.1 min)
- **Verification**: 17,490 total words (avg 29.1 min/day), 105/105 passing tests in `tests/systems_long_lessons_parity.test.ts`, 0 TypeScript errors, Gate v2 visual specs `src/lib/data/lessonVisuals/comp_fund/day-{{36..40}}.json` verified with SHA-256 `codeHash` bindings.
"""
    if "TASK-1289" not in mem_text:
        with open(memory_path, "a", encoding="utf-8") as f:
            f.write(mem_entry)
        print("Updated PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
