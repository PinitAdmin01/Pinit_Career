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
        f'TASK-1329,{date_part},{time_part},COMPLETED,Block 10 (M2 Batch 4),Antigravity,Course 22 soft_skills Day 46: Tech Offer Evaluation: Base Salary, Equity Mechanics & Total Compensation Anatomy (Public RSUs vs Private ISOs / 4-Year Liquidity Lifecycle / Dilution Simulator / Contract Fine Print Audit),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-46.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1330,{date_part},{time_part},COMPLETED,Block 10 (M2 Batch 4),Antigravity,Course 22 soft_skills Day 47: The Compensation Negotiation Playbook: Leverage, Competing Offers & Counter-Offers (BATNA Leverage / 3-Way Bidding War Sequence / Multi-Dial Parametric Optimizer / Recruiter Hardball Phone Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-47.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1331,{date_part},{time_part},COMPLETED,Block 10 (M2 Batch 4),Antigravity,Course 22 soft_skills Day 48: Navigating Difficult Conversations: Performance Issues & Managing Out with Dignity (Radical Candor vs Ruinous Empathy / Objective PIP Dossier / SBI Scripting Engine / High-Emotion Review Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-48.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1332,{date_part},{time_part},COMPLETED,Block 10 (M2 Batch 4),Antigravity,Course 22 soft_skills Day 49: Delivering Bad News to Leadership: Missed Deadlines & Scalability Cliffs (HRO Theory & Early Warning / 3-Part Crisis Memo Blueprint / Risk Telemetry Sentinel CLI / Boardroom Confrontation Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-49.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1333,{date_part},{time_part},COMPLETED,Block 10 (M2 Batch 4),Antigravity,Course 22 soft_skills Day 50: Milestone 7 (M2): ApexNegotiation High-Stakes Tech Compensation & Executive Suite (Nash Equilibrium Game Theory / ApexNegotiation Master Dossier / Counter-Offer Simulator / Dual-Scenario Live Gauntlet - 100% COMPLETE),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-50.json; tests/java_softskills_long_lessons.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1329" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1329..1333 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent410_found = False
    for line in ctrl_lines:
        if "AGENT-410" in line:
            updated_ctrl.append(
                f'AGENT-410,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1329,Completed,{now_str},'
                '"BATCH COMPLETE: Month 2 Pioneer Batch 4: Block 10 — Days 46-50 (Tech Offer Evaluation, Compensation Negotiation Playbook, Difficult Conversations & Performance, Delivering Bad News, Milestone 7 ApexNegotiation Suite: TASK-1329..1333) complete and tested. 17,657 words (all 5 days >= 28.1 spoken min, avg 29.4 min/day), 123/123 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 50/60 Days (83.3% Complete)!"\n'
            )
            agent410_found = True
        else:
            updated_ctrl.append(line)

    if not agent410_found:
        updated_ctrl.append(
            f'AGENT-410,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1329,Completed,{now_str},'
            '"BATCH COMPLETE: Month 2 Pioneer Batch 4: Block 10 — Days 46-50 (Tech Offer Evaluation, Compensation Negotiation Playbook, Difficult Conversations & Performance, Delivering Bad News, Milestone 7 ApexNegotiation Suite: TASK-1329..1333) complete and tested. 17,657 words (all 5 days >= 28.1 spoken min, avg 29.4 min/day), 123/123 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 50/60 Days (83.3% Complete)!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Updated AGENT-410 in multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 22 (`soft_skills`) Month 2 Batch 4 (Days 46–50: Block 10 — High-Stakes Negotiations, Compensation & Difficult Conversations & Milestone 7 ApexNegotiation) ({now_str})
- **Agent**: `AGENT-410` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1329` through `TASK-1333`
- **Scope**:
  - **Day 46 (`TASK-1329`)**: *Tech Offer Evaluation: Base Salary, Equity Mechanics & Total Compensation Anatomy* (3,549 words, 29.6 spoken min). Public RSUs vs private ISO/NSO options, 4-year cumulative liquidity lifecycle modeling ($1.368M payout), cap table dilution simulator across venture rounds, and fine-print contract auditing (30-day PTEW and liquidation preference traps).
  - **Day 47 (`TASK-1330`)**: *The Compensation Negotiation Playbook: Leverage, Competing Offers & Counter-Offers* (3,565 words, 29.7 spoken min). BATNA leverage mechanics (+22.6% TC uplift), 3-way bidding war email calibration across Tier-1 firms, multi-dial parametric counter-offer generator (Cash vs Equity Heavy), and live hardball phone call defense de-escalating an exploding deadline ultimatum.
  - **Day 48 (`TASK-1331`)**: *Navigating Difficult Conversations: Performance Issues & Managing Out with Dignity* (3,550 words, 29.6 spoken min). Kim Scott's Radical Candor Matrix (eradicating Ruinous Empathy), objective legally defensible PIP milestone documentation, Situation-Behavior-Impact (SBI) scripting engine, and high-emotion performance review lab managing out with dignity.
  - **Day 49 (`TASK-1332`)**: *Delivering Bad News to Leadership: Missed Deadlines & Scalability Cliffs* (3,621 words, 30.2 spoken min). High-Reliability Organizational (HRO) theory and early bad news escalation (2,000 vs 10,000 QPS bottleneck), 3-part executive crisis memo blueprint, automated project health risk telemetry sentinel CLI, and hostile boardroom de-escalation lab preserving executive trust.
  - **Day 50 (`TASK-1333`)**: 🏆 **Milestone 7 Capstone**: *ApexNegotiation High-Stakes Tech Compensation & Executive Suite* (3,372 words, 28.1 spoken min). John Nash Equilibrium game-theoretic modeling ($428k closing target), ApexNegotiation master dossier ($75k annual uplift), automated counter-offer sparring simulator (92% acceptance probability), and 20-minute dual-scenario live gauntlet defense, conferring *Certified ApexNegotiation High-Stakes Technical Strategist (L7/L8)*.
- **Verification & Invariants**:
  - **17,657 total words** authored across Days 46–50 (average **3,531 words/day**, all 25 parts strictly $\ge 580$ words).
  - All 25 TypeScript code snippets executed via `npx tsx` and captured into `scripts/soft_skills_days46_50_outputs.json`.
  - Gate v2 visual JSON specs created at `src/lib/data/lessonVisuals/soft-skills/day-{{46..50}}.json` with matching SHA-256 `codeHash` bindings.
  - **123 / 123 unit tests passing (100%)** via `npx tsx --test tests/java_softskills_long_lessons.test.ts`.
  - `npx tsc --noEmit` exits with **0 errors**.
  - Course 22 (`soft_skills`) advances from 45/60 Days (75.0%) to **50 / 60 Days (83.3% Complete)** (250 / 300 parts complete).
- **Git Commit**: `63c6c71c` (*feat(curriculum): complete Course 22 (soft_skills) Month 2 Batch 4 (Days 46-50: Block 10, TASK-1329..1333)*) pushed to origin `codex/interview-tab-reliability`.
"""

    with open(memory_path, "w", encoding="utf-8") as f:
        f.write(mem_entry.strip() + "\n\n" + mem_text)
    print("Appended milestone record to PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
