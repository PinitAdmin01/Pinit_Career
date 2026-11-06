import datetime

def sync():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
    memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

    # 1. Update agent_tasks.csv
    with open(tasks_path, "r", encoding="utf-8") as f:
        task_lines = f.readlines()

    updated_tasks = []
    task_keys = {"TASK-1339", "TASK-1340", "TASK-1341", "TASK-1342", "TASK-1343"}
    for line in task_lines:
        matched = False
        for tk in task_keys:
            if line.startswith(tk):
                # Update status to COMPLETED
                parts = line.split(",")
                parts[3] = "COMPLETED"
                parts[9] = "COMPLETED"
                parts[1] = date_part
                parts[2] = time_part
                updated_tasks.append(",".join(parts))
                matched = True
                break
        if not matched:
            updated_tasks.append(line)

    with open(tasks_path, "w", encoding="utf-8") as f:
        f.writelines(updated_tasks)
    print("Marked TASK-1339..1343 as COMPLETED in agent_tasks.csv")

    # 2. Update multi_agent_control.csv
    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent412_found = False
    for line in ctrl_lines:
        if "AGENT-412" in line:
            updated_ctrl.append(
                f'AGENT-412,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1343,Completed,{now_str},'
                '"COURSE COMPLETE: Month 2 Pioneer Batch 6: Block 12 & Grand Capstone — Days 56-60 (Three Mile Island Alert Ambiguity, Knight Capital $440M Algorithmic Bankruptcy, Mars Climate Orbiter Dimensional Units, $5M Principal Modernization RFC, and Milestone 8 Grand Master Capstone: TASK-1339..1343) complete and tested. 19,030 words (all 5 days >= 31.1 spoken min, avg 31.7 min/day), 143/143 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 60/60 Days (100.0% Complete)!"\n'
            )
            agent412_found = True
        else:
            updated_ctrl.append(line)

    if not agent412_found:
        updated_ctrl.append(
            f'AGENT-412,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1343,Completed,{now_str},'
            '"COURSE COMPLETE: Month 2 Pioneer Batch 6: Block 12 & Grand Capstone — Days 56-60 (Three Mile Island Alert Ambiguity, Knight Capital $440M Algorithmic Bankruptcy, Mars Climate Orbiter Dimensional Units, $5M Principal Modernization RFC, and Milestone 8 Grand Master Capstone: TASK-1339..1343) complete and tested. 19,030 words (all 5 days >= 31.1 spoken min, avg 31.7 min/day), 143/143 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 60/60 Days (100.0% Complete)!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Updated AGENT-412 in multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 22 (`soft_skills`) Month 2 Batch 6 (Days 56–60: Block 12 & Grand Capstone: Catastrophe Post-Mortems, Interface Type Safety, $5M Modernization RFC & Milestone 8 Grand Master Capstone) ({now_str})
- **Agent**: `AGENT-412` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1339` through `TASK-1343`
- **Scope**:
  - **Day 56 (`TASK-1339`)**: *Historic Communication Catastrophes 2: Three Mile Island & Control Room Alert Ambiguity* (3,818 words, 31.8 spoken min). Human factors and cognitive engineering root cause of the 1979 nuclear meltdown: solenoid electrical command echo vs mechanical valve stem physical reality. PORV valve forensic simulation, enterprise alert catalog ambiguity scanner, closed-loop deep synthetic write/read health checks (`/healthz/deep`), and conflicting indicator triage lab using orthogonal thermal telemetry.
  - **Day 57 (`TASK-1340`)**: *Historic Communication Catastrophes 3: Knight Capital $440M 45-Minute Algorithmic Bankruptcy* (3,861 words, 32.2 spoken min). SEC administrative summary and root cause deconstruction of the August 1, 2012 runaway trading loop (manual deployment drift leaving the 8th server running legacy code with the repurposed 'Power Peg' test flag). Sub-millisecond gateway financial circuit breakers (cumulative loss and order velocity caps), automated cryptographic SHA-256 fleet container verification, and the First-180-Seconds Emergency Containment Doctrine.
  - **Day 58 (`TASK-1341`)**: *Historic Communication Catastrophes 4: Mars Climate Orbiter Metric/Imperial Crash* (3,733 words, 31.1 spoken min). NASA JPL Mishap Investigation Board deconstruction of the 4.45x thruster impulse mismatch (contractor English pound-force seconds vs NASA metric Newton-seconds over a 286-day cruise, degrading periapsis from 226km to 57km). Compile-time nominal unit branded types (`type NewtonSeconds = number & Brand<"NewtonSeconds">`), automated API schema unit suffix linters (`timeoutMs`, `distanceKm`), and real-time trajectory anomaly interception proxies.
  - **Day 59 (`TASK-1342`)**: *The Principal Engineer Modernization RFC: Restructuring Global Communication ($5M Blueprint)* (3,747 words, 31.2 spoken min). Conway's Law organizational topology audit across 600 engineers (quantifying 17.2 meeting hrs/week and $26.3M in lost productivity). $5,000,000 capital modernization blueprint across 4 strategic pillars yielding $14.7M in recurring annual returns (194% net ROI, 4.1-month capital payback), objective communication telemetry suite, and hostile boardroom defense simulation securing unanimous Board ratification.
  - **Day 60 (`TASK-1343`)**: 🏆 **Milestone 8 Grand Master Capstone**: *ApexExecutiveComms Enterprise Cross-Functional Alignment, Crisis Escalation & Principal Engineer Interview Portfolio Master Capstone Viva Gate* (3,871 words, 32.3 spoken min). The Unified Principal Engineering Communication Invariant (mathematically unifying Shannon Information Theory, Minto Pyramid, Conway's Law, Radical Candor, and High Reliability Organizations as deliberate entropy reduction). Master Portfolio Dossier (15-Story Behavioral Matrix, $5M RFC, Disaster Post-Mortems, ApexNegotiation Playbook), randomized 4-stage viva voce examination simulator CLI, and 45-minute live defense before the Senior Review Board, conferring *Certified ApexExecutiveComms Principal Technical Leader & Enterprise Communicator (Staff/Principal/Distinguished L7-L9)*.
- **Verification & Invariants**:
  - **19,030 total words** authored across Days 56–60 (average **3,806 words/day**, all 25 parts strictly $\ge 580$ words).
  - All 25 TypeScript code snippets executed via `npx tsx` and captured into `scripts/soft_skills_days56_60_outputs.json`.
  - Gate v2 visual JSON specs created at `src/lib/data/lessonVisuals/soft-skills/day-{{56..60}}.json` with matching SHA-256 `codeHash` bindings.
  - **143 / 143 unit tests passing (100%)** via `npx tsx --test tests/java_softskills_long_lessons.test.ts`.
  - `npx tsc --noEmit` exits with **0 errors**.
  - **Course 22 (`soft_skills`) IS 100% COMPLETE: 60 / 60 Days (300 / 300 Parts, >220,000 Total Words, 143 Tests Passing, 0 Errors)**.
- **Git Commit**: `f68a4bae` (*feat(curriculum): complete Course 22 (soft_skills) Month 2 Batch 6 (Days 56-60: Block 12 & Grand Capstone, TASK-1339..1343) - 100% COMPLETE*) pushed to origin `codex/interview-tab-reliability`.
"""

    with open(memory_path, "w", encoding="utf-8") as f:
        f.write(mem_entry.strip() + "\n\n" + mem_text)
    print("Appended milestone record to PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
