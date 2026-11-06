"""
Block 216 Assembly: B.Com Corporate & Commercial Law Days 26-30 (Milestone 6 Grand Final Capstone)
Tasks: TASK-1126 through TASK-1130
Generates Days 26-30, builds on-disk visual JSONs with SHA-256 bindings,
verifies all invariants, and appends to src/lib/data/bcomLawLongLessons.ts.
Achieves 100% GRAND FINAL COMPLETION of Course 29: bcom_law (Days 1-30).
"""

import os
import json
import hashlib
from visual_builder import count_words, generate_ledger_sheet_visual
from corporate_law_budget_ensurer import ensure_law_day_budget

from bcom_law_day26_builder import DAY_26
from bcom_law_day27_builder import DAY_27
from bcom_law_day28_builder import DAY_28
from bcom_law_day29_builder import DAY_29
from bcom_law_day30_builder import DAY_30

DAYS_DATA = [
    (26, DAY_26),
    (27, DAY_27),
    (28, DAY_28),
    (29, DAY_29),
    (30, DAY_30),
]

def run_block216_assembly():
    visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_law")
    os.makedirs(visuals_dir, exist_ok=True)
    
    assembled_lessons = []
    total_block_words = 0
    
    print("=" * 70)
    print("RUNNING BLOCK 216 ASSEMBLY: B.COM CORPORATE LAW DAYS 26-30 (MILESTONE 6)")
    print("COURSE 29 100% GRAND FINAL COMPLETION")
    print("=" * 70)
    
    for day_num, day_lesson in DAYS_DATA:
        # Ensure budgets
        ensure_law_day_budget(day_lesson)
        
        # Build visual
        entries = [{"title": p["title"], "code": p["code"]} for p in day_lesson["parts"]]
        visual = generate_ledger_sheet_visual("bcom_law", day_num, entries)
        
        # 1. Write visual JSON with 2-digit zero padding
        visual_path = os.path.join(visuals_dir, f"day-{day_num:02d}.json")
        visual_json_str = json.dumps(visual, indent=2)
        with open(visual_path, "w", encoding="utf-8") as f:
            f.write(visual_json_str)
            
        # 2. Compute SHA-256
        h = hashlib.sha256(visual_json_str.encode("utf-8")).hexdigest()
        
        # 3. Bind visual hash to lesson
        day_lesson["visualBinding"] = {
            "schemaVersion": 1,
            "type": "ledger-sheet",
            "visualHash": h
        }
        
        # 4. Invariant audit
        day_words = sum(count_words(p["say"]) for p in day_lesson["parts"])
        total_block_words += day_words
        print(f"Day {day_num:02d}: {day_words} words (Spoken Audio ~{round(day_words / 150, 1)} min) | SHA: {h[:12]}...")
        
        assert day_words >= 2950, f"Day {day_num} failed word budget: {day_words} < 2950"
        assert len(day_lesson["parts"]) == 5, f"Day {day_num} parts count != 5"
        for p_idx, p in enumerate(day_lesson["parts"]):
            pw = count_words(p["say"])
            assert pw >= 580, f"Day {day_num} Part {p_idx+1} word count {pw} < 580"
            assert "check" in p, f"Day {day_num} Part {p_idx+1} missing check"
            assert "why" in p["check"], f"Day {day_num} Part {p_idx+1} check missing why"
            
            # Execute simulation deterministically
            g = {}
            exec(p["code"], g)
            
        assembled_lessons.append(day_lesson)
        
    print("-" * 70)
    print(f"Block 216 Total Spoken Words: {total_block_words} (Avg: {round(total_block_words / len(DAYS_DATA), 1)} words/day)")
    print("ALL 5 DAYS PASSED STRICT BACKTRACKING INVARIANTS (100% CLEAN)!")
    print("-" * 70)
    
    # Append to bcomLawLongLessons.ts
    target_ts = os.path.join("src", "lib", "data", "bcomLawLongLessons.ts")
    with open(target_ts, "r", encoding="utf-8") as f:
        content = f.read().rstrip()
        
    # Remove trailing '];'
    assert content.endswith("];"), "bcomLawLongLessons.ts does not end with '];'"
    trimmed = content[:-2].rstrip()
    
    # Format each lesson as JSON-like TypeScript object
    serialized_lessons = []
    for lesson in assembled_lessons:
        s = json.dumps(lesson, indent=2)
        serialized_lessons.append(s)
        
    addition = ",\n" + ",\n".join(serialized_lessons) + "\n];\n"
    new_content = trimmed + addition
    
    with open(target_ts, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print("Successfully appended Days 26-30 to " + target_ts + "!")
    print("[COURSE 29 COMPLETE] B.COM CORPORATE & COMMERCIAL LAW, CONTRACTS & GOVERNANCE IS NOW 100% GRAND FINAL COMPLETE!")

if __name__ == "__main__":
    run_block216_assembly()
