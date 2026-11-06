# scripts/verify_dist_block8_data.py
import json
import re
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day36_data import DAY_36_DATA as d36
from dist_day37_data import DAY_37_DATA as d37
from dist_day38_data import DAY_38_DATA as d38
from dist_day39_data import DAY_39_DATA as d39
from dist_day40_data import DAY_40_DATA as d40

days = [d36, d37, d38, d39, d40]
total_words = 0

print("=== VERIFYING DIST BLOCK 8 (DAYS 36-40) INVARIANTS ===")

for day_idx, d in enumerate(days, start=36):
    day_num = d["day"]
    assert day_num == day_idx, f"Day number mismatch: {day_num} != {day_idx}"
    assert d.get("coursePrefix") == "dist", f"Day {day_num} missing coursePrefix: 'dist'"
    assert d.get("course") == "dist", f"Day {day_num} missing course: 'dist'"
    assert len(d["summary"]) >= 4, f"Day {day_num} summary has < 4 items ({len(d['summary'])})"
    assert "projectStep" in d, f"Day {day_num} missing projectStep"
    assert "title" in d["projectStep"] and len(d["projectStep"]["steps"]) >= 3, f"Day {day_num} projectStep invalid"
    assert len(d["parts"]) == 5, f"Day {day_num} parts count != 5 ({len(d['parts'])})"
    
    day_words = 0
    for p in d["parts"]:
        part_num = p["part"]
        say_text = " ".join(p["say"])
        wc = len(say_text.split())
        assert wc >= 600, f"Day {day_num} Part {part_num} word count {wc} < 600!"
        assert "example" in p and len(p["example"]) > 10, f"Day {day_num} Part {part_num} missing example"
        
        # Check Socratic check
        chk = p["check"]
        assert chk["answer"] == 0, f"Day {day_num} Part {part_num} answer != 0"
        assert chk["answerIndex"] == 0, f"Day {day_num} Part {part_num} answerIndex != 0"
        assert len(chk["options"]) == 4, f"Day {day_num} Part {part_num} options count != 4"
        assert len(chk["why"]) >= 50, f"Day {day_num} Part {part_num} why length < 50"
        
        day_words += wc
        
    print(f"Day {day_num}: {day_words} words across 5 parts (All >= 600w). PASS")
    total_words += day_words

print(f"Total Block 8 Words: {total_words} words across 25 parts (Average {total_words/25:.1f}w/part).")
assert total_words >= 15000, f"Total Block 8 words {total_words} < 15,000!"

# Verify visual envelopes
print("\n=== VERIFYING GATE V2 VISUAL ENVELOPES ===")
for day_num in range(36, 41):
    vis_file = f"src/lib/data/lessonVisuals/dist/day-{day_num}.json"
    assert os.path.exists(vis_file), f"Visual file missing: {vis_file}"
    with open(vis_file, "r", encoding="utf-8") as f:
        env = json.load(f)
    assert env["schemaVersion"] == 2, f"Day {day_num} schemaVersion != 2"
    assert env.get("course") == "dist" or env.get("prefix") == "dist", f"Day {day_num} course/prefix mismatch"
    assert env["day"] == day_num, f"Day {day_num} day mismatch"
    assert len(env["entries"]) == 5, f"Day {day_num} visual entries != 5"
    
    for e_idx, entry in enumerate(env["entries"], start=1):
        spec = entry["spec"]
        assert spec["template"] == "compare", f"Day {day_num} Entry {e_idx} template != 'compare'"
        assert len(spec["steps"]) == 4, f"Day {day_num} Entry {e_idx} steps count != 4"
        for s in spec["steps"]:
            cap = s["caption"]
            m = re.search(r"\d", cap)
            assert not m, f"Day {day_num} Entry {e_idx} caption contains digit '{m.group(0)}': {cap}"
            
    print(f"Visual envelope day-{day_num}.json: 5/5 entries valid, ZERO numeric digits. PASS")

print("\nALL DIST BLOCK 8 (DAYS 36-40) AUDIT CHECKS PASSED PERFECTLY!")
