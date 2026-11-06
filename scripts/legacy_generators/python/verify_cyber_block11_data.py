import json
import os
import re

from cyber_day51_data import DAY_51_DATA
from cyber_day52_data import DAY_52_DATA
from cyber_day53_data import DAY_53_DATA
from cyber_day54_data import DAY_54_DATA
from cyber_day55_data import DAY_55_DATA

days = [DAY_51_DATA, DAY_52_DATA, DAY_53_DATA, DAY_54_DATA, DAY_55_DATA]

total_block_words = 0

print("=== VERIFYING CYBER BLOCK 11 DATA (DAYS 51-55) ===")

for day_data in days:
    day_num = day_data["day"]
    print(f"\n--- Day {day_num}: {day_data['title']} ---")
    assert day_data["course"] == "cyber"
    assert day_data["coursePrefix"] == "cyber"
    assert len(day_data["parts"]) == 5, f"Day {day_num} does not have 5 parts!"
    assert len(day_data["summary"]) >= 4, f"Day {day_num} summary has < 4 items!"
    assert "projectStep" in day_data, f"Day {day_num} missing projectStep!"
    assert len(day_data["projectStep"]["steps"]) >= 3, f"Day {day_num} projectStep has < 3 steps!"

    day_words = 0
    for p in day_data["parts"]:
        part_num = p["part"]
        say_words = sum(len(x.split()) for x in p["say"])
        print(f"  Part {part_num} Word Count: {say_words}")
        assert say_words >= 600, f"Day {day_num} Part {part_num} word count {say_words} < 600!"
        day_words += say_words

        # Check required fields
        assert p["title"], f"Day {day_num} Part {part_num} missing title!"
        assert p["code"], f"Day {day_num} Part {part_num} missing code!"
        assert p["example"], f"Day {day_num} Part {part_num} missing example!"
        assert p["output"], f"Day {day_num} Part {part_num} missing output!"
        assert p["check"], f"Day {day_num} Part {part_num} missing check!"

        check = p["check"]
        assert check["answer"] == 0, f"Day {day_num} Part {part_num} answer != 0!"
        assert check["answerIndex"] == 0, f"Day {day_num} Part {part_num} answerIndex != 0!"
        assert len(check["options"]) == 4, f"Day {day_num} Part {part_num} does not have 4 options!"
        assert len(check["why"]) >= 50, f"Day {day_num} Part {part_num} why length < 50 chars!"

    print(f"Day {day_num} Total Words: {day_words}")
    total_block_words += day_words

    # Verify Visual Envelope
    vis_path = f"src/lib/data/lessonVisuals/cyber/day-{day_num}.json"
    assert os.path.exists(vis_path), f"Visual envelope {vis_path} missing!"
    with open(vis_path, "r", encoding="utf-8") as f:
        vis = json.load(f)

    assert vis["schemaVersion"] == 2
    assert vis["course"] == "cyber"
    assert vis["prefix"] == "cyber"
    assert vis["day"] == day_num
    assert len(vis["entries"]) == 5

    for idx, e in enumerate(vis["entries"]):
        spec = e["spec"]
        assert spec["template"] == "compare"
        assert len(spec["steps"]) == 4
        assert [s["at"] for s in spec["steps"]] == ["intro", "inspect", "compare", "verify"]
        for s in spec["steps"]:
            caption = s["caption"]
            for ch in caption:
                assert not ch.isdigit(), f"Numeric digit '{ch}' found in Day {day_num} Part {idx+1} caption: {caption}"

print(f"\n==========================================")
print(f"ALL 25 PARTS IN BLOCK 11 VERIFIED!")
print(f"TOTAL BLOCK 11 WORDS: {total_block_words} words (avg {total_block_words/25:.1f} words/part)")
print(f"ALL 5 VISUAL ENVELOPES VERIFIED WITH ZERO DIGITS!")
print(f"==========================================")
