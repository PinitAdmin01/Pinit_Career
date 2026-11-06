"""
Block 211 Assembly: B.Com Digital Marketing Days 26-30 (Course 28 100% COMPLETE!)
Tasks: TASK-846 through TASK-850
Generates Days 26-30, builds on-disk visual JSONs with SHA-256 bindings,
verifies all invariants, and appends to src/lib/data/bcomDmktLongLessons.ts.
"""

import os
import json
import hashlib
from visual_builder import count_words

from bcom_dmkt_day26_builder import build_day26_lesson, build_day26_visual
from bcom_dmkt_day27_builder import build_day27_lesson, build_day27_visual
from bcom_dmkt_day28_builder import build_day28_lesson, build_day28_visual
from bcom_dmkt_day29_builder import build_day29_lesson, build_day29_visual
from bcom_dmkt_day30_builder import build_day30_lesson, build_day30_visual

DAYS_CONFIG = [
    (26, build_day26_lesson, build_day26_visual),
    (27, build_day27_lesson, build_day27_visual),
    (28, build_day28_lesson, build_day28_visual),
    (29, build_day29_lesson, build_day29_visual),
    (30, build_day30_lesson, build_day30_visual),
]

def run_block211_assembly():
    visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_dmkt")
    os.makedirs(visuals_dir, exist_ok=True)
    
    assembled_lessons = []
    total_block_words = 0
    
    print("=" * 60)
    print("RUNNING BLOCK 211 ASSEMBLY: B.COM DMKT DAYS 26-30 (COURSE 28 CAPSTONE)")
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
    print(f"Block 211 Total Spoken Words: {total_block_words} (Avg: {round(total_block_words / len(DAYS_CONFIG), 1)} words/day)")
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
        
    print("Successfully appended Days 26-30 to " + target_ts + "!")
    print("[COURSE 28 100% COMPLETE] B.COM DIGITAL MARKETING IS 100% COMPLETE ACROSS ALL 30 DAYS!")

if __name__ == "__main__":
    run_block211_assembly()
