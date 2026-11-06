import sys, os

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Update PROJECT_MEMORY.md
project_memory_file = os.path.join(memory_dir, "PROJECT_MEMORY.md")
with open(project_memory_file, "r", encoding="utf-8") as f:
    content = f.read()

batch3_entry = """* **2026-10-17 (Antigravity - 🏆 COURSE 24 BATCH 3 COMPLETE: WORKPLACE SOFT SKILLS DAYS 16-20 (GOOGLE X-Y-Z RESUME, LINKEDIN BRANDING, STAR METHOD, 90S PITCH, BLAMELESS POSTMORTEM FAILURE STORYTELLING) - TASK-1142..1146):**
  - **Milestone Achievement:** Expanded Course 24 (Workplace Soft Skills / `soft_skills` / `soft-skills`) Days 16–20 on branch `codex/interview-tab-reliability` (in `src/lib/data/softSkillsLongLessons.ts` and `src/lib/data/lessonVisuals/soft-skills/day-16.json` through `day-20.json`).
  - **Batch 3 Expansion Summary (Days 16–20: 16,536 spoken words, all 5 days >= 21.8 spoken min @ 150 wpm, average 22.0 min/day):**
    - **Item 1: Tech Resume Engineering: The Google X-Y-Z Formula & Impact Quantification (TASK-1142 / Day 16):** (3,354 words, ~22.4m spoken). ATS plain-text parsing mechanics (Greenhouse/Lever), eye-tracking 6-second recruiter F-pattern scan, Google X-Y-Z formula ("Accomplished [X] as measured by [Y] by doing [Z]"), replacing passive buzzwords with active architectural verbs, engineering scale quantification (QPS, latency, memory, cloud compute spend), Order-of-Magnitude Fermi estimation for unmonitored metrics, 4-tier modular tech stack taxonomy, single-column single-page layout invariants, and Master Technical Resume Auditor. Generated `day-16.json`.
    - **Item 2: LinkedIn Optimization & Personal Branding: High-Signal Engineering Profiles (TASK-1143 / Day 17):** (3,322 words, ~22.1m spoken). Recruiter Boolean search algorithms and semantic ranking weights (Headline 3x, Current Title 2x, About 1.5x), 3-part technical headline formula (`Role | Core Stack | Quantified Scale`), first-person engineering narrative arc in About section, scannable 4-tier stack taxonomy, pinning proof-of-work (GitHub repos with Mermaid architecture diagrams, demo GIFs, automated tests, and deep-dive technical postmortems), avoiding cringe engagement farming, establishing an inbound recruiting engine. Generated `day-17.json`.
    - **Item 3: The Behavioral Interview Framework: The STAR Method & Time Allocation (TASK-1144 / Day 18):** (3,291 words, ~21.9m spoken). Diagnostic engineering risk rubrics (Amazon 16 Leadership Principles, Google Ambiguity Navigation), STAR cognitive compression algorithm (Situation, Task, Action, Result), strict 60/40 Action Pacing Invariant (S+T < 35%, Action 50-65% to avoid Context Traps), eliminating the passive 'We' trap via the I/We Duality Invariant, concluding Results with empirical metrics and permanent systemic engineering guardrails (linters, CI tests, runbooks), and Master STAR Behavioral Interview Suite. Generated `day-18.json`.
    - **Item 4: Answering "Tell Me About Yourself": The 90-Second Present-Past-Future Pitch (TASK-1145 / Day 19):** (3,300 words, ~22.0m spoken). First-impression cognitive anchoring effect and confirmation bias in the opening 90 seconds, 3-Act Narrative Arc (Present ~25%, Past ~50%, Future ~25%), 30-second crucible project teaser embedding scale anchors and architectural patterns as irresistible conversational bait, cadence control (130-150 WPM, 180-220 words), eliminating awkward fade-outs with an authoritative Conversational Pass-Back, and Master Elevator Pitch Engine across multiple engineering tracks. Generated `day-19.json`.
    - **Item 5: Tackling "Tell Me About a Time You Failed": Blameless Postmortem Storytelling (TASK-1146 / Day 20):** (3,269 words, ~21.8m spoken). Dissecting what engineering directors test (intellectual humility, operational resilience, learning velocity), eliminating fake humblebrags and blame-shifting, the 4-phase SRE Blameless Postmortem framework (Timeline & Blast Radius, Immediate Triage, Root Cause, Guardrails), the Five Whys causal penetration depth (from physical symptom down to systemic governance), hierarchy of systemic guardrails (linters, AST checks, chaos tests, circuit breakers, canaries), and Master Blameless Postmortem Storytelling Suite. Generated `day-20.json`.
  - **Deterministic TypeScript Test Suite Verification:** All 63 tests pass in `tests/java_softskills_long_lessons.test.ts` (0 failures, 100% pass rate).
  - **Static Typecheck:** Zero TypeScript compilation errors (`npx tsc --noEmit` exited 0).
  - **Gate v2 Visual JSON Validation:** All visual files `src/lib/data/lessonVisuals/soft-skills/day-16.json` through `day-20.json` generated with matching SHA-256 `codeHash` bindings for all 25 parts.
  - **Branch A Overall Progress:** 110 / 120 Days Completed (91.67% complete, only 10 days / 8.33% remaining in Course 24 Days 21-30).

"""

with open(project_memory_file, "w", encoding="utf-8") as f:
    f.write(batch3_entry + content)
print("Updated PROJECT_MEMORY.md")

# 2. Update agent_tasks.csv
tasks_file = os.path.join(memory_dir, "agent_tasks.csv")
with open(tasks_file, "r", encoding="utf-8") as f:
    tasks_text = f.read()

for t_id in ["TASK-1142", "TASK-1143", "TASK-1144", "TASK-1145", "TASK-1146"]:
    tasks_text = tasks_text.replace(f"{t_id},Antigravity,In_Progress,", f"{t_id},Antigravity,Complete,")

with open(tasks_file, "w", encoding="utf-8") as f:
    f.write(tasks_text)
print("Updated agent_tasks.csv")

# 3. Update multi_agent_control.csv
control_file = os.path.join(memory_dir, "multi_agent_control.csv")
with open(control_file, "r", encoding="utf-8") as f:
    control_text = f.read()

old_agent_line = 'AGENT-370,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1146,In_Progress,2026-10-17 18:10:00,"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 16-20 (Google X-Y-Z Resume, LinkedIn Brand, STAR Behavioral Method, Tell Me About Yourself Pitch, Failure Storytelling, TASK-1142..1146)."'
new_agent_line = 'AGENT-370,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1146,Completed,2026-10-17 18:38:00,"5-Task Batch Protocol Complete: Course 24 soft_skills Days 16-20 (Google X-Y-Z Resume, LinkedIn Brand, STAR Behavioral Method, Tell Me About Yourself Pitch, Failure Storytelling, TASK-1142..1146) committed & pushed. 16,536 spoken words (all 5 days >= 21.8 spoken min), 63/63 tests passing in java_softskills_long_lessons.test.ts, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings. Branch A at 91.67%."'

if old_agent_line in control_text:
    control_text = control_text.replace(old_agent_line, new_agent_line)
else:
    lines = control_text.splitlines()
    new_lines = []
    for l in lines:
        if l.startswith("AGENT-370,Antigravity,codex/interview-tab-reliability"):
            new_lines.append(new_agent_line)
        else:
            new_lines.append(l)
    control_text = "\n".join(new_lines) + "\n"

with open(control_file, "w", encoding="utf-8") as f:
    f.write(control_text)
print("Updated multi_agent_control.csv")
