# scripts/verify_block12_data.py
import sys
import os
import json

sys.path.insert(0, os.path.dirname(__file__))

from g3d_day56_data import DAY_56_DATA
from g3d_day57_data import DAY_57_DATA
from g3d_day58_data import DAY_58_DATA
from g3d_day59_data import DAY_59_DATA
from g3d_day60_data import DAY_60_DATA

days = [DAY_56_DATA, DAY_57_DATA, DAY_58_DATA, DAY_59_DATA, DAY_60_DATA]
total_block_words = 0

print("=== VERIFYING BLOCK 12 (DAYS 56-60 & GRAND FINAL CAPSTONE) ===")

for day_data in days:
    day_num = day_data["day"]
    title = day_data["title"]
    parts = day_data["parts"]
    day_words = 0
    print(f"\n--- Day {day_num}: {title} ---")
    
    assert len(parts) == 5, f"Day {day_num} must have exactly 5 parts, found {len(parts)}"
    assert isinstance(day_data["summary"], list) and len(day_data["summary"]) >= 4, f"Day {day_num} summary must have >= 4 items"
    assert isinstance(day_data["projectStep"], dict) and len(day_data["projectStep"]["steps"]) >= 3, f"Day {day_num} projectStep must have >= 3 steps"
    
    for p in parts:
        part_num = p["part"]
        say = p["say"]
        code = p["code"]
        output = p["output"]
        check = p["check"]
        
        wc = sum(len(s.split()) for s in say)
        day_words += wc
        print(f"  Part {part_num} '{p['title'][:40]}...': {wc} words")
        assert wc >= 600, f"Day {day_num} Part {part_num} word count {wc} below 600!"
        assert check["answer"] == 0 and check["answerIndex"] == 0, f"Check answer must be 0"
        assert len(check["options"]) == 4, f"Check must have exactly 4 options"
        assert len(check["why"]) >= 50, f"Check why length must be >= 50 chars"
        
    print(f"Day {day_num} Total Words: {day_words}")
    total_block_words += day_words
    
    # Check visual envelope exists and has 0 digits in captions
    vis_path = f"src/lib/data/lessonVisuals/g3d/day-{day_num}.json"
    assert os.path.exists(vis_path), f"Visual envelope {vis_path} missing!"
    with open(vis_path, "r", encoding="utf-8") as f:
        vis_data = json.load(f)
    assert vis_data["day"] == day_num, f"Visual day mismatch: {vis_data['day']} != {day_num}"
    assert len(vis_data["entries"]) == 5, f"Visual entries count must be 5"
    for e_idx, entry in enumerate(vis_data["entries"]):
        for step in entry["spec"]["steps"]:
            caption = step["caption"]
            for ch in caption:
                assert not ch.isdigit(), f"Digit '{ch}' found in visual caption: '{caption}'"

print(f"\n=======================================================")
print(f"BLOCK 12 TOTAL WORDS: {total_block_words} words across 25 parts")
print(f"Average Words/Part: {total_block_words / 25:.1f} words")
print(f"Average Words/Day: {total_block_words / 5:.1f} words")
print(f"ALL 25 PARTS >= 600 WORDS. ALL CHECKS, SUMMARIES, PROJECT STEPS & VISUALS VERIFIED!")
