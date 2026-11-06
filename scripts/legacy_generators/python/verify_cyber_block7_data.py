# scripts/verify_cyber_block7_data.py
import json
import os
import re
import sys
sys.path.insert(0, os.getcwd())

from scripts.cyber_day31_data import DAY_31_DATA
from scripts.cyber_day32_data import DAY_32_DATA
from scripts.cyber_day33_data import DAY_33_DATA
from scripts.cyber_day34_data import DAY_34_DATA
from scripts.cyber_day35_data import DAY_35_DATA

days = [DAY_31_DATA, DAY_32_DATA, DAY_33_DATA, DAY_34_DATA, DAY_35_DATA]

total_block_words = 0
digit_re = re.compile(r"\d")

for day_idx, d in enumerate(days, 31):
    day_num = d["day"]
    assert day_num == day_idx, f"Expected day {day_idx}, got {day_num}"
    print(f"\n--- Verifying Day {day_num}: {d['title']} ---")

    assert len(d["summary"]) >= 4, f"Day {day_num} summary items < 4"
    assert isinstance(d["projectStep"], dict), f"Day {day_num} projectStep not dict"
    assert len(d["projectStep"]["steps"]) >= 3, f"Day {day_num} project steps < 3"

    day_words = 0
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} parts count {len(parts)} != 5"

    for p in parts:
        part_num = p["part"]
        say = p["say"]
        wc = sum(len(line.split()) for line in say)
        day_words += wc
        print(f"  Part {part_num} ({p['title']}): {wc} words")
        assert wc >= 600, f"Day {day_num} Part {part_num} word count {wc} < 600!"

        # Check example and output
        assert "example" in p and isinstance(p["example"], str) and len(p["example"]) > 0, f"Day {day_num} Part {part_num} missing example"
        assert "output" in p and isinstance(p["output"], str) and len(p["output"]) > 0, f"Day {day_num} Part {part_num} missing output"

        # Check socratic check
        check = p["check"]
        assert check["answer"] == 0, f"Day {day_num} Part {part_num} check.answer != 0"
        assert check["answerIndex"] == 0, f"Day {day_num} Part {part_num} check.answerIndex != 0"
        assert len(check["options"]) == 4, f"Day {day_num} Part {part_num} options != 4"
        assert len(check["why"]) >= 50, f"Day {day_num} Part {part_num} check.why length {len(check['why'])} < 50"

    print(f"Day {day_num} Total Words: {day_words}")
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3000"
    total_block_words += day_words

    # Verify visual envelope
    visual_path = f"src/lib/data/lessonVisuals/cyber/day-{day_num}.json"
    assert os.path.exists(visual_path), f"Visual envelope {visual_path} does not exist!"
    with open(visual_path, "r", encoding="utf-8") as f:
        vis = json.load(f)
    assert vis.get("schemaVersion") == 2, f"Visual {visual_path} schemaVersion != 2"
    assert len(vis.get("entries", [])) == 5, f"Visual {visual_path} entries != 5"

    for entry in vis["entries"]:
        spec = entry.get("spec", {})
        assert spec.get("template") == "compare", f"Visual {visual_path} template != compare"
        steps = spec.get("steps", [])
        assert len(steps) == 4, f"Visual {visual_path} steps != 4"
        for s in steps:
            cap = s.get("caption", "")
            match = digit_re.search(cap)
            assert not match, f"Visual {visual_path} caption contains digit '{match.group(0)}' in: {cap}"

print(f"\n==========================================")
print(f"BLOCK 7 TOTAL WORDS: {total_block_words} (average {total_block_words/25:.1f} words/part)")
print(f"ALL 25 PARTS >= 600 WORDS!")
print(f"ALL 5 VISUAL ENVELOPES VERIFIED (Gate v2, 0 digits)!")
print(f"==========================================")
