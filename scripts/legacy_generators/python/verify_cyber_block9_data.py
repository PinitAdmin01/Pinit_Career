# scripts/verify_cyber_block9_data.py
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day41_data import DAY_41_DATA as d41
from cyber_day42_data import DAY_42_DATA as d42
from cyber_day43_data import DAY_43_DATA as d43
from cyber_day44_data import DAY_44_DATA as d44
from cyber_day45_data import DAY_45_DATA as d45

block9 = [d41, d42, d43, d44, d45]
total_words = 0
total_parts = 0

print("=== VERIFYING CYBER MONTH 2 BLOCK 9 (DAYS 41-45) DATA INVARIANTS ===")

for day_idx, day_data in enumerate(block9, start=41):
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

print(f"\nTOTAL BLOCK 9 WORDS: {total_words} across {total_parts} parts (Avg: {total_words/total_parts:.1f} w/part)")
assert total_words >= 15000, f"Total block words {total_words} < 15,000"
print("=== ALL BLOCK 9 DATA & VISUAL INVARIANTS 100% VERIFIED ===")
