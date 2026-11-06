import datetime

def update_agent_tasks():
    path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"TASK-1957,dsa-optim Day 38: Z-Algorithm & Longest Common Prefix (LCP) Array: Linear Pattern Matching & Suffix-Prefix Matching,Completed,cdb50a5a,Present-Career-os-platform,agent/branch-c-platform-admin-faculty,{now_str}\n"
    with open(path, 'a', encoding='utf-8') as f:
        f.write(entry)
    print("agent_tasks.csv updated with TASK-1957.")

def update_multi_agent_control():
    path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"AGENT-502,agent/branch-c-platform-admin-faculty,Active,cdb50a5a,\"dsa-optim Month 2 Block 8: Day 38 100% Complete & Pushed\",{now_str}\n"
    with open(path, 'a', encoding='utf-8') as f:
        f.write(entry)
    print("multi_agent_control.csv updated.")

def update_project_memory():
    path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"""
### 🅲 Branch C: DSA Web Optimization (`dsa-optim`) - Month 2 Block 8 Day 38 Conquered
- **Status**: 100% COMPLETE & PUSHED (`cdb50a5a`)
- **Course**: `src/lib/data/dsaWebLongLessons.ts` (`dsa-optim`)
- **Day 38**: Z-Algorithm & Longest Common Prefix (LCP) Array: Linear Pattern Matching & Suffix-Prefix Matching (`cdb50a5a`)
  - Part 1: The Z-Array Definition, Z-Box Invariant [L, R], and Linear O(N) Construction (745 words)
  - Part 2: Linear Exact Pattern Matching via S = P + '$' + T and Suffix-Prefix Boundary Discovery (620 words)
  - Part 3: Equivalence and Duality between Z-Array and Prefix Function Pi (620 words)
  - Part 4: String Matching with Wildcards / Don't-Care Characters and Fast Pattern Matching (700 words)
  - Part 5: Enterprise Application: Genome Sequence Variant Scanner & Structural Mutation Oracle (`GenomicVariantZScanner`) (649 words)
- **Verified Invariants**:
  - Total Words: 3,334 words across `say` arrays (every part >= 600 words).
  - Visual Envelope: `src/lib/data/lessonVisuals/dsa-optim/day-38.json` passes Gate v2 (`PASS 5/6 (none: 0)`).
  - Unit Tests: `tests/dsa_web_days36_40_expansion.test.ts` (6/6) and `tests/dsa_web_days31_35_expansion.test.ts` (10/10) pass.
  - Type Safety: `npx tsc --noEmit` passes with 0 errors across the entire codebase.
- **Timestamp**: {now_str}
"""
    with open(path, 'a', encoding='utf-8') as f:
        f.write(entry)
    print("PROJECT_MEMORY.md updated.")

if __name__ == '__main__':
    update_agent_tasks()
    update_multi_agent_control()
    update_project_memory()
