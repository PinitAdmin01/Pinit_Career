with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

treaty_entry = """

---

## 🏛️ TRI-BRANCH MASTER CURRICULUM & COLLISION-FREE TREATY (PDF v1.0)
**Execution Date**: 2026-10-25 02:55:00  
**Status**: APPROVED & ACTIVE  
**Reference Document**: `C:\\Users\\Admin\\Desktop\\PinIT_Tri_Branch_Curriculum_Master_Treaty.pdf`  
**Internal Mirror**: `docs/visuals/PinIT_Tri_Branch_Curriculum_Master_Treaty.pdf`

### 1. Master Course Allocation & Zero-Collision Firewalls (Total 467 Remaining Days)

| Branch | Workspace | Assigned Track | Total Remaining | Exclusive Course Allocations | Strict Negative Mandates |
|---|---|---|---|---|---|
| **Branch A** | `Present-Career-os` | Tech & Systems | **150 Days** | 1. `course-design-systems` (30d)<br>2. `course-fullstack-js` (30d)<br>3. `course-3d-graphics` (30d)<br>4. `course-distributed-sys` (30d)<br>5. `course-cybersecurity` (30d) | **DO NOT TOUCH** `dsaWebLongLessons.ts` (Branch C).<br>**DO NOT TOUCH** any `bcom*` commerce files (Branch B). |
| **Branch B** | `Present-Career-os-commerce` | Enterprise Commerce | **174 Days** | 1. `course-business-analytics` (55d)<br>2. `course-marketing-branding` (30d)<br>3. `course-digital-marketing` (30d)<br>4. `course-ecommerce-digital-biz` (29d)<br>5. `course-sales-crm-success` (30d) | **DO NOT TOUCH** any Tech or AI courses.<br>Dedicated exclusively to Commerce Track. |
| **Branch C** | `Present-Career-os-platform` | Algorithms & Applied AI | **143 Days** | 1. `course-dsa-optim` (23d - Day 38 in progress)<br>2. `course-ai-eng` (30d)<br>3. `course-ai-prompt-literacy` (30d)<br>4. `course-nlp` (30d)<br>5. `course-ai-digital-transformation` (30d) | **DO NOT TOUCH** Branch A frontend/systems files.<br>**DO NOT TOUCH** Branch B commerce files.<br>Finish DSA 38–60 before next AI course. |

### 2. Universal Pedagogical Invariants (Non-Negotiable)
1. **Slow-Reader Volume Invariant**: Every single lesson part MUST contain $\ge 600$ words in `say` array (3,000+ words per day).
2. **Everyday Physical Analogies**: Zero unexplained jargon. Deconstruct complex concepts through everyday physical systems.
3. **Socratic Check Quizzes**: 5 assessments per day (1 per part), 4 options each, `answerIndex: 0`, statutory why explanations $\ge 50$ words.
4. **Gate v2 Visual Envelopes**: `src/lib/data/lessonVisuals/{course}/day-{N}.json` with 4 synchronized steps, zero digits, vocabulary match, and SHA-256 bound.
5. **Zero-Error Compilation**: `npx tsc --noEmit` must pass with exit code 0 before every commit.
"""

if "TRI-BRANCH MASTER CURRICULUM & COLLISION-FREE TREATY" not in text:
    with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'a', encoding='utf-8') as f:
        f.write(treaty_entry)
    print("Appended treaty to PROJECT_MEMORY.md")
else:
    print("Treaty already in PROJECT_MEMORY.md")
