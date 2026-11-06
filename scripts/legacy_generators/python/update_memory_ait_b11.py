import datetime

memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'

# 1. Update agent_tasks.csv
new_task_line = 'TASK-BCOM-AIT-B11,"bcom_ait Days 51-55: Enterprise AI Safety Red Teaming Cyber Guardrails & Fiduciary Compliance",Completed,In-Flight,Present-Career-os,main,2026-10-27 20:45:00\n'
with open(tasks_path, 'r', encoding='utf-8') as f:
    csv_content = f.read()

if 'TASK-BCOM-AIT-B11' not in csv_content:
    with open(tasks_path, 'a', encoding='utf-8') as f:
        f.write(new_task_line)
    print("Updated agent_tasks.csv with TASK-BCOM-AIT-B11")
else:
    print("TASK-BCOM-AIT-B11 already in agent_tasks.csv")

# 2. Update PROJECT_MEMORY.md
with open(memory_path, 'r', encoding='utf-8') as f:
    mem_content = f.read()

block11_entry = """### [2026-10-27 20:45:00] Milestone Update: Course 31 (AI & Digital Transformation - `bcom_ait`) Month 2 Block 11 (Days 51-55 & Milestone 11 Capstone) CONQUERED! (55/60 Days - 91.7%)
- **Branch**: `main` in workspace `Present-Career-os`
- **Scope Completed**: Block 11 (Days 51 to 55: Enterprise AI Safety, Adversarial Red Teaming, Cyber Guardrails & Fiduciary Compliance):
  - **Day 51**: Adversarial Red Teaming: Jailbreak Defenses, Indirect Prompt Injections & ASCII Smuggling (3,227 words)
  - **Day 52**: Deterministic Output Guardrails: NeMo Guardrails, Llama-Guard, Regex Schemas & PII Redaction (3,308 words)
  - **Day 53**: Data Poisoning, Model Inversion Defenses & Differential Privacy in Enterprise AI Training (3,412 words)
  - **Day 54**: Algorithmic Fairness, Disparate Impact Auditing & Explainable AI (SHAP / LIME) in Credit/Hiring (3,124 words)
  - **Day 55 (Milestone 11 Capstone)**: Boardroom AI Fiduciary Governance Cockpit & EU AI Act Compliance Certification (3,136 words, CLEAIFA Credential Conferred)
- **Pedagogical & Runtime Invariants Enforced**:
  - **Strict Word Count**: **16,207 total words** across 25 parts. Every single part strictly >= 600 words (range: 600 to 743 words); every single day strictly >= 3,000 words (range: 3,124 to 3,412 words).
  - **Pure Python Standard Library Code**: 25 standalone executable snippets (pure Python standard library only, 0 third-party packages). All execution outputs verified and captured in `output`.
  - **Strict Assessment Invariants**: 25 diagnostic outage MCQs with 4 options each, strictly `answer: 0, answerIndex: 0`, and detailed technical `why` explanations.
  - **Gate v2 Visual Envelopes**: `day-51.json` through `day-55.json` compiled in `src/lib/data/lessonVisuals/bcom_ait/`, 25 entries verified via `tests/bcom_ait_days51_55_visuals.test.ts`.
  - **Unit Test Verification**: `npx tsx --test tests/bcom_ait_block11.test.ts` passed 6/6; regression `tests/bcom_ait_block10.test.ts`, `tests/bcom_ait_block9.test.ts`, `tests/bcom_ait_block8.test.ts`, `tests/bcom_ait_block7.test.ts` passed 24/24; visual tests passed 25/25. Total: 55/55 tests GREEN.
- **Track Progress**: Course 31 (`bcom_ait`) is now **55/60 Days Complete (91.7%)**! Final Next Target: Block 12 (Days 56 to 60: Final Grand Master Enterprise Capstone & Boardroom Fiduciary Defense).
"""

if 'bcom_ait) Month 2 Block 11' not in mem_content:
    idx = mem_content.find('### [2026-10-27 19:35:30]')
    if idx != -1:
        new_mem = mem_content[:idx] + block11_entry + mem_content[idx:]
    else:
        new_mem = mem_content + '\n\n' + block11_entry
    with open(memory_path, 'w', encoding='utf-8') as f:
        f.write(new_mem)
    print("Updated PROJECT_MEMORY.md with Block 11 entry")
else:
    print("bcom_ait Block 11 entry already in PROJECT_MEMORY.md")
