# scripts/verify_cyber_block12_data.py
import json
import re

from scripts.cyber_day56_data import DAY_56_DATA
from scripts.cyber_day57_data import DAY_57_DATA
from scripts.cyber_day58_data import DAY_58_DATA
from scripts.cyber_day59_data import DAY_59_DATA
from scripts.cyber_day60_data import DAY_60_DATA

all_days = [DAY_56_DATA, DAY_57_DATA, DAY_58_DATA, DAY_59_DATA, DAY_60_DATA]

print("=== VERIFYING CYBER BLOCK 12 (DAYS 56-60) ===")

grand_total_words = 0

for d in all_days:
    day_num = d["day"]
    print(f"\n--- Checking Day {day_num}: {d['title']} ---")
    assert d["coursePrefix"] == "cyber", f"Day {day_num} coursePrefix mismatch"
    assert d["course"] == "cyber", f"Day {day_num} course mismatch"
    assert len(d["parts"]) == 5, f"Day {day_num} does not have 5 parts"
    assert len(d["summary"]) >= 4, f"Day {day_num} summary has < 4 items"
    assert "title" in d["projectStep"] and len(d["projectStep"]["steps"]) >= 3, f"Day {day_num} projectStep invalid"
    
    day_words = 0
    for p in d["parts"]:
        part_num = p["part"]
        wc = sum(len(x.split()) for x in p["say"])
        print(f"  Part {part_num} Word Count: {wc}")
        assert wc >= 600, f"Day {day_num} Part {part_num} has {wc} words (< 600)!"
        assert "example" in p and len(p["example"]) > 0, f"Day {day_num} Part {part_num} missing example"
        assert "output" in p and len(p["output"]) > 0, f"Day {day_num} Part {part_num} missing output"
        assert "code" in p and len(p["code"]) > 0, f"Day {day_num} Part {part_num} missing code"
        
        chk = p["check"]
        assert chk["answer"] == 0, f"Day {day_num} Part {part_num} answer != 0"
        assert chk["answerIndex"] == 0, f"Day {day_num} Part {part_num} answerIndex != 0"
        assert len(chk["options"]) == 4, f"Day {day_num} Part {part_num} options != 4"
        assert len(chk["why"]) >= 50, f"Day {day_num} Part {part_num} why length < 50 chars"
        
        day_words += wc
    
    print(f"Day {day_num} Total Words: {day_words}")
    grand_total_words += day_words
    
    # Check visual envelope
    visual_path = f"src/lib/data/lessonVisuals/cyber/day-{day_num}.json"
    with open(visual_path, "r", encoding="utf-8") as vf:
        visual = json.load(vf)
    assert visual["schemaVersion"] == 2, f"Visual schemaVersion != 2 in {visual_path}"
    assert visual["course"] == "cyber" and visual["prefix"] == "cyber", f"Visual course mismatch in {visual_path}"
    assert visual["day"] == day_num, f"Visual day mismatch in {visual_path}"
    assert len(visual["entries"]) == 5, f"Visual entries != 5 in {visual_path}"
    for entry in visual["entries"]:
        assert entry["spec"]["template"] == "compare", f"Visual template != compare in {visual_path}"
        steps = entry["spec"]["steps"]
        assert len(steps) == 4, f"Visual steps != 4 in {visual_path}"
        for step in steps:
            caption = step["caption"]
            assert not re.search(r'\d', caption), f"Found digit in caption '{caption}' in {visual_path}"
    print(f"  Visual {visual_path} PASSED (schema v2, 5 compare entries, zero digits).")

print(f"\n==========================================")
print(f"GRAND TOTAL BLOCK 12 WORDS: {grand_total_words}")
print(f"AVERAGE WORDS PER PART: {grand_total_words / 25:.1f}")
assert grand_total_words >= 15000, "Block 12 total words below 15,000!"
print("ALL BLOCK 12 INVARIANTS 100% VERIFIED AND PASSED!")
print(f"==========================================")
