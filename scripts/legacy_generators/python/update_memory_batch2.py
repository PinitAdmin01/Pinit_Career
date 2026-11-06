import sys, os

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Update PROJECT_MEMORY.md
project_memory_file = os.path.join(memory_dir, "PROJECT_MEMORY.md")
with open(project_memory_file, "r", encoding="utf-8") as f:
    content = f.read()

batch2_entry = """* **2026-10-17 (Antigravity - 🏆 COURSE 24 BATCH 2 COMPLETE: WORKPLACE SOFT SKILLS DAYS 11-15 (SCR CRISIS COMMS, ZOPA/BATNA NEGOTIATION, DEEP WORK, BURNOUT PREVENTION, MILESTONE 2 CAPSTONE) - TASK-1137..1141):**
  - **Milestone Achievement:** Expanded Course 24 (Workplace Soft Skills / `soft_skills` / `soft-skills`) Days 11–15 on branch `codex/interview-tab-reliability` (in `src/lib/data/softSkillsLongLessons.ts` and `src/lib/data/lessonVisuals/soft-skills/day-11.json` through `day-15.json`).
  - **Batch 2 Expansion Summary (Days 11–15: 18,423 spoken words, all 5 days >= 22.1 spoken min @ 150 wpm, average 24.6 min/day):**
    - **Item 1: Executive Presence & Delivering Bad News: The SCR Communication Framework (TASK-1137 / Day 11):** (4,014 words, ~26.8m spoken). Overcoming Concealment Bias (MUM effect), Incident Escalation Latency & Concealment Risk Auditor, Situation-Complication-Resolution (SCR) crisis dispatches, blameless root-cause attribution (Five Whys vs human error), 3-tier SMART-E remediation governance (Immediate, Permanent, Observability), and Master Crisis Leadership certification. Generated `day-11.json`.
    - **Item 2: Negotiation & Persuasion for Engineers: Establishing ZOPA & BATNA (TASK-1138 / Day 12):** (3,952 words, ~26.3m spoken). Harvard Principled Negotiation (Fisher & Ury: separate people from problems, focus on underlying interests, objective criteria), mathematical mechanics of ZOPA (reservation points, positive overlap vs disjoint ZOPA), engineering BATNA fallback options (managed cloud SaaS vs custom 12w builds), Project Management Iron Triangle (Scope, Schedule, Budget with Quality invariant), neutralizing PM estimation anchoring bias with empirical task decompositions, and Master Engineering Persuasion Orchestrator. Generated `day-12.json`.
    - **Item 3: Time Management & Deep Work Boundary Setting: Maker's Schedule vs Manager's Schedule (TASK-1139 / Day 13):** (3,700 words, ~24.7m spoken). Attention Residue and context switching overhead (Dr. Gloria Mark's 23m 15s recovery latency), Paul Graham's Maker's Schedule vs Manager's Schedule (4-hour monolithic blocks vs 30-min modular slots), William Ury's Positive 'No' framework (Yes! - No. - Yes?) defending engineering focus with empathy, asynchronous communication batching (Slack/email triage at 12:30 PM & 4:30 PM, emergency PagerDuty bypass), and Master Engineering Deep Work & Focus Auditor. Generated `day-13.json`.
    - **Item 4: Mental Health, Imposter Syndrome & Burnout Prevention: Psychological Safety (TASK-1140 / Day 14):** (3,444 words, ~23.0m spoken). Amy Edmondson's 7 Dimensions & Google Project Aristotle (#1 predictor of high-performing engineering teams), deconstructing Imposter Syndrome with Julia Evans' factual Brag Document proof-of-work logs, Christina Maslach's Burnout triad (Emotional Exhaustion, Cynicism, Inefficacy) and 3-stage clinical progression, Carol Dweck's Growth Mindset & Cognitive Behavioral Reframing, and Master Engineering Well-Being & Resilience Engine. Generated `day-14.json`.
    - **Item 5: ⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine (TASK-1141 / Day 15):** (3,313 words, ~22.1m spoken). Comprehensive architectural synthesis of Days 6–14 into an integrated Technical Leadership Competency Matrix (Translation 25%, Feedback 30%, Negotiation 25%, Presentation 20%), Cross-Functional Business Translation Gateway (ELI5 analogies, $1.44M/yr ROI mapping), High-Trust Mediation Gateway (SBI feedback & IBR conflict resolution), SCR Executive Crisis Briefing Gateway, and Sovereign Technical Leadership Master Gateway (`executeTechLeadershipGateway` certifying `TECH_LEADERSHIP_MASTER_ACTIVE` with 100/100 score). Generated `day-15.json`.
  - **Deterministic TypeScript Test Suite Verification:** All 53 tests pass in `tests/java_softskills_long_lessons.test.ts` (0 failures, 100% pass rate).
  - **Static Typecheck:** Zero TypeScript compilation errors (`npx tsc --noEmit` exited 0).
  - **Gate v2 Visual JSON Validation:** All visual files `src/lib/data/lessonVisuals/soft-skills/day-11.json` through `day-15.json` generated with matching SHA-256 `codeHash` bindings for all 25 parts.

"""

with open(project_memory_file, "w", encoding="utf-8") as f:
    f.write(batch2_entry + content)
print("Updated PROJECT_MEMORY.md")

# 2. Update agent_tasks.csv
tasks_file = os.path.join(memory_dir, "agent_tasks.csv")
with open(tasks_file, "r", encoding="utf-8") as f:
    tasks_text = f.read()

for t_id in ["TASK-1137", "TASK-1138", "TASK-1139", "TASK-1140", "TASK-1141"]:
    tasks_text = tasks_text.replace(f"{t_id},Antigravity,In_Progress,", f"{t_id},Antigravity,Complete,")

with open(tasks_file, "w", encoding="utf-8") as f:
    f.write(tasks_text)
print("Updated agent_tasks.csv")

# 3. Update multi_agent_control.csv
control_file = os.path.join(memory_dir, "multi_agent_control.csv")
with open(control_file, "r", encoding="utf-8") as f:
    control_text = f.read()

old_agent_line = 'AGENT-368,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1141,In_Progress,2026-10-17 17:20:00,"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 11-15 (SCR Bad News Framework, ZOPA/BATNA Negotiation, Maker Deep Work, Imposter Syndrome Burnout, Milestone 2 Capstone, TASK-1137..1141)."'
new_agent_line = 'AGENT-368,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1141,Completed,2026-10-17 18:05:00,"5-Task Batch Protocol Complete: Course 24 soft_skills Days 11-15 (SCR Bad News Framework, ZOPA/BATNA Negotiation, Maker Deep Work, Imposter Syndrome Burnout, Milestone 2 Capstone, TASK-1137..1141) committed & pushed. 18,423 spoken words (all 5 days >= 22.1 spoken min), 53/53 tests passing in java_softskills_long_lessons.test.ts, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."'

if old_agent_line in control_text:
    control_text = control_text.replace(old_agent_line, new_agent_line)
else:
    # If not exact match, search line starting with AGENT-368,Antigravity,codex/interview-tab-reliability
    lines = control_text.splitlines()
    new_lines = []
    for l in lines:
        if l.startswith("AGENT-368,Antigravity,codex/interview-tab-reliability"):
            new_lines.append(new_agent_line)
        else:
            new_lines.append(l)
    control_text = "\n".join(new_lines) + "\n"

with open(control_file, "w", encoding="utf-8") as f:
    f.write(control_text)
print("Updated multi_agent_control.csv")
