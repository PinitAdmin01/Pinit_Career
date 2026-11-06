"""
Block 210 Assembly: B.Com Digital Marketing Days 21-25 (Milestone 5 Capstone)
Tasks: TASK-841 through TASK-845
Generates Days 21-25, builds on-disk visual JSONs with SHA-256 bindings,
verifies all invariants, and appends to src/lib/data/bcomDmktLongLessons.ts.
"""

import os
import json
import hashlib
from visual_builder import count_words

from bcom_dmkt_day21_builder import build_day21_lesson, build_day21_visual
from bcom_dmkt_day22_builder import build_day22_lesson, build_day22_visual
from bcom_dmkt_day23_builder import build_day23_lesson, build_day23_visual
from bcom_dmkt_day24_builder import build_day24_lesson, build_day24_visual
from bcom_dmkt_day25_builder import build_day25_lesson, build_day25_visual

DAYS_CONFIG = [
    (21, build_day21_lesson, build_day21_visual),
    (22, build_day22_lesson, build_day22_visual),
    (23, build_day23_lesson, build_day23_visual),
    (24, build_day24_lesson, build_day24_visual),
    (25, build_day25_lesson, build_day25_visual),
]

def run_block210_assembly():
    visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_dmkt")
    os.makedirs(visuals_dir, exist_ok=True)
    
    assembled_lessons = []
    total_block_words = 0
    
    print("=" * 60)
    print("RUNNING BLOCK 210 ASSEMBLY: B.COM DMKT DAYS 21-25 (MILESTONE 5)")
    print("=" * 60)
    
    for day_num, lesson_builder, visual_builder in DAYS_CONFIG:
        lesson = lesson_builder()
        visual = visual_builder()
        
        # 1. Write visual JSON
        visual_path = os.path.join(visuals_dir, f"day-{day_num}.json")
        visual_json_str = json.dumps(visual, indent=2)
        with open(visual_path, "w", encoding="utf-8") as f:
            f.write(visual_json_str)
            
        # 2. Compute SHA-256
        h = hashlib.sha256(visual_json_str.encode("utf-8")).hexdigest()
        
        # 3. Bind visual hash to lesson
        lesson["visualBinding"] = {
            "schemaVersion": 1,
            "type": "funnel",
            "visualHash": h
        }
        
        # 4. Invariant audit
        day_words = sum(count_words(p["say"]) for p in lesson["parts"])
        total_block_words += day_words
        print(f"Day {day_num}: {day_words} words (Spoken Audio ~{round(day_words / 150, 1)} min) | SHA: {h[:12]}...")
        
        assert day_words >= 2950, f"Day {day_num} failed word budget: {day_words} < 2950"
        assert len(lesson["parts"]) == 5, f"Day {day_num} parts count != 5"
        for p_idx, p in enumerate(lesson["parts"]):
            pw = count_words(p["say"])
            assert pw >= 580, f"Day {day_num} Part {p_idx+1} word count {pw} < 580"
            assert "check" in p, f"Day {day_num} Part {p_idx+1} missing check"
            assert "why" in p["check"], f"Day {day_num} Part {p_idx+1} check missing why"
            
            # Execute simulation deterministically
            g = {}
            exec(p["code"], g)
            
        assembled_lessons.append(lesson)
        
    print("-" * 60)
    print(f"Block 210 Total Spoken Words: {total_block_words} (Avg: {round(total_block_words / len(DAYS_CONFIG), 1)} words/day)")
    print("ALL 5 DAYS PASSED STRICT BACKTRACKING INVARIANTS (100% CLEAN)!")
    print("-" * 60)
    
    # Append to bcomDmktLongLessons.ts
    target_ts = os.path.join("src", "lib", "data", "bcomDmktLongLessons.ts")
    with open(target_ts, "r", encoding="utf-8") as f:
        content = f.read().rstrip()
        
    # Remove trailing '];'
    assert content.endswith("];"), "bcomDmktLongLessons.ts does not end with '];'"
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
        
    print(f"Successfully appended Days 21-25 to {target_ts}!")

if __name__ == "__main__":
    run_block210_assembly()
