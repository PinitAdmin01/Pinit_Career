# scripts/verify_cyber_block8_data.py
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day36_data import DAY_36_DATA as d36
from cyber_day37_data import DAY_37_DATA as d37
from cyber_day38_data import DAY_38_DATA as d38
from cyber_day39_data import DAY_39_DATA as d39
from cyber_day40_data import DAY_40_DATA as d40

block8 = [d36, d37, d38, d39, d40]
total_words = 0
total_parts = 0

print("=== VERIFYING CYBER MONTH 2 BLOCK 8 (DAYS 36-40) DATA INVARIANTS ===")

for day_idx, day_data in enumerate(block8, start=36):
    assert day_data["day"] == day_idx, f"Day number mismatch: expected {day_idx}, got {day_data['day']}"
    assert day_data["course"] == "cyber", f"Course mismatch: {day_data['course']}"
    assert day_data["coursePrefix"] == "cyber", f"CoursePrefix mismatch: {day_data['coursePrefix']}"
    assert len(day_data["parts"]) == 5, f"Day {day_idx} must have exactly 5 parts"
    assert len(day_data["summary"]) >= 4, f"Day {day_idx} summary must have >= 4 items"
    assert isinstance(day_data["projectStep"], dict), f"Day {day_idx} projectStep must be dict"
    assert len(day_data["projectStep"]["steps"]) >= 3, f"Day {day_idx} projectStep steps must have >= 3 items"

    day_words = 0
    for p in day_data["parts"]:
        total_parts += 1
        part_num = p["part"]
        say_words = sum(len(x.split()) for x in p["say"])
        day_words += say_words
        total_words += say_words

        assert say_words >= 600, f"Day {day_idx} Part {part_num} words {say_words} < 600!"
        assert "example" in p and len(p["example"]) > 20, f"Day {day_idx} Part {part_num} missing example"
        assert "output" in p and len(p["output"]) > 0, f"Day {day_idx} Part {part_num} missing output"
        assert "code" in p and len(p["code"]) > 50, f"Day {day_idx} Part {part_num} code too short"
        assert "check" in p, f"Day {day_idx} Part {part_num} missing check"
        chk = p["check"]
        assert len(chk["options"]) == 4, f"Day {day_idx} Part {part_num} options must be exactly 4"
        assert chk["answer"] == 0, f"Day {day_idx} Part {part_num} answer must be 0"
        assert chk["answerIndex"] == 0, f"Day {day_idx} Part {part_num} answerIndex must be 0"
        assert len(chk["why"]) >= 50, f"Day {day_idx} Part {part_num} why must be >= 50 chars (got {len(chk['why'])})"

    print(f"Day {day_idx}: {day_words} words across 5 parts (Avg: {day_words/5:.1f} w/part) - PASS")

    # Verify Visual JSON
    visual_path = f"src/lib/data/lessonVisuals/cyber/day-{day_idx}.json"
    assert os.path.exists(visual_path), f"Visual envelope {visual_path} does not exist!"
    with open(visual_path, "r", encoding="utf-8") as vf:
        v_data = json.load(vf)
    assert v_data["schemaVersion"] == 2
    assert v_data["course"] == "cyber"
    assert v_data["prefix"] == "cyber"
    assert v_data["day"] == day_idx
    assert len(v_data["entries"]) == 5
    for e_idx, entry in enumerate(v_data["entries"]):
        assert entry["spec"]["template"] == "compare"
        steps = entry["spec"]["steps"]
        assert len(steps) == 4
        for step in steps:
            caption = step["caption"]
            for ch in caption:
                assert not ch.isdigit(), f"Found digit '{ch}' in caption: '{caption}' (Day {day_idx} Entry {e_idx})"

    print(f"Day {day_idx} Visual: Valid Gate v2, 5 entries, 0 numeric digits - PASS")

print(f"\nTOTAL BLOCK 8 WORDS: {total_words} across {total_parts} parts (Avg: {total_words/total_parts:.1f} w/part)")
assert total_words >= 15000, f"Total block words {total_words} < 15,000"
print("=== ALL BLOCK 8 DATA & VISUAL INVARIANTS 100% VERIFIED ===")
