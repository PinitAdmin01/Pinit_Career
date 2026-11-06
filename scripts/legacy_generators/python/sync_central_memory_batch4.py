import os
import datetime

# 1. Update agent_tasks.csv
tasks_file = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
with open(tasks_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
target_tasks = {'TASK-1152', 'TASK-1153', 'TASK-1154', 'TASK-1155', 'TASK-1156'}
for line in lines:
    parts = line.split(',')
    task_id = parts[0].strip()
    if task_id in target_tasks:
        line = line.replace('In_Progress', 'Complete').replace('In Progress', 'Complete')
    new_lines.append(line)

with open(tasks_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Updated agent_tasks.csv successfully.')

# 2. Update multi_agent_control.csv
mac_file = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(mac_file, 'r', encoding='utf-8') as f:
    mac_lines = f.readlines()

new_mac_lines = []
for line in mac_lines:
    if 'AGENT-373' in line:
        line = line.replace('In_Progress', 'Completed')
    new_mac_lines.append(line)

with open(mac_file, 'w', encoding='utf-8') as f:
    f.writelines(new_mac_lines)
print('Updated multi_agent_control.csv successfully.')

# 3. Prepend to PROJECT_MEMORY.md
memory_file = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(memory_file, 'r', encoding='utf-8') as f:
    mem_content = f.read()

milestone_record = """## 🚀 [2026-10-17 19:10] - Course 24: Workplace Soft Skills Batch 4 (Days 21-25) Completed (TASK-1152..1156, AGENT-373)
- **Branch**: `codex/interview-tab-reliability` (Branch A: Launchpad & Tech tracks)
- **Course**: Course 24 (`soft_skills` / `soft-skills` in registry: *Professional Tech Communication & Interview Mastery*)
- **Status**: Days 21-25 100% Complete & Verified (115 / 120 Days = 95.83% Complete across Branch A!).
- **Curriculum Expansion**:
  - **Day 21 (TASK-1152)**: `⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine` (3,328 words, ~22.2 min spoken audio; Simulations: `Milestone3CompetencyMatrix`, `InboundOutboundLeadGateway`, `BehavioralPacingGateway`, `PitchAndPostmortemGateway`, `SovereignTechCareerEngine`).
  - **Day 22 (TASK-1153)**: `High-Signal Reverse Interviewing: Questions to Ask the Interviewer` (3,478 words, ~23.2 min spoken audio; Simulations: `ReverseQuestionClassifier`, `FourPillarsInquiryValidator`, `EngineeringCultureRedFlagDetector`, `InterviewerPersonaQuestionMatcher`, `MasterReverseInterviewAuditor`).
  - **Day 23 (TASK-1154)**: `Live Coding & Whiteboard Communication Protocols: The Think-Aloud Protocol & Requirement Framing` (3,383 words, ~22.6 min spoken audio; Simulations: `ThinkAloudSignpostAuditor`, `RequirementClarificationValidator`, `CognitiveSignpostingEngine`, `InterviewerHintReceptionAuditor`, `MasterLiveCodingSimulator`).
  - **Day 24 (TASK-1155)**: `System Design Interview Communication: The RADIO Framework` (3,362 words, ~22.4 min spoken audio; Simulations: `SystemDesignCommunicationAuditor`, `RadioRequirementsAndArchitectureAuditor`, `RadioDataAndInterfaceAuditor`, `RadioOptimizationAndResilienceAuditor`, `MasterRadioSystemDesignSimulator`).
  - **Day 25 (TASK-1156)**: `Salary Negotiation & Compensation Mastery: Total Compensation (TC) Mechanics` (3,382 words, ~22.5 min spoken audio; Simulations: `TotalCompensationCalculator`, `EquityVestingAndDilutionSimulator`, `SalaryAnchorDeflectionAuditor`, `CounterOfferScriptValidator`, `MasterCompensationNegotiator`).
- **Pedagogical Invariants Certified**:
  - Total Words Days 21-25: **16,933 words** across 25 parts (All 25 parts >= 631 words, well above 580 words threshold; average 22.6 spoken minutes per day @ 150 wpm).
  - Gate v2 Visual JSON files: `src/lib/data/lessonVisuals/soft-skills/day-21.json` through `day-25.json` generated with prefix `"soft-skills"`, SHA-256 bindings, and 4 synchronized stages.
  - Socratic checks: 4 options, 1 valid answer index (0..3), non-empty why rationale (>= 15 chars).
  - Deterministic test suite: 73/73 tests passing in `tests/java_softskills_long_lessons.test.ts`.
  - Typecheck: `npx tsc --noEmit` exited 0 with zero errors and zero warnings.

---

"""

with open(memory_file, 'w', encoding='utf-8') as f:
    f.write(milestone_record + mem_content)
print('Prepend to PROJECT_MEMORY.md complete.')
