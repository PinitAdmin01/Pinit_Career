#!/usr/bin/env python3
"""
verify_iot_edge_block9.py
Audits Course 18 Month 2 Block 9 (Days 41–45) against all strict invariants.
"""
import json, os

files = [f"scripts/iot_edge_day{d}.json" for d in range(41, 46)]

print("=== AUDITING COURSE 18 MONTH 2 BLOCK 9 (DAYS 41-45) ===")
total_words_block = 0
for fpath in files:
    assert os.path.exists(fpath), f"File {fpath} does not exist!"
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    day_num = data["day"]
    assert data["minutes"] == 38, f"Day {day_num} duration {data['minutes']} != 38"
    assert len(data["parts"]) == 5, f"Day {day_num} parts count {len(data['parts'])} != 5"
    assert len(data["goal"]) > 20, f"Day {day_num} goal too short"
    assert len(data["recap"]) > 20, f"Day {day_num} recap too short"
    assert len(data["summary"]) >= 4, f"Day {day_num} summary < 4"
    assert len(data["projectStep"]["steps"]) >= 4, f"Day {day_num} projectStep.steps < 4"

    day_words = 0
    for idx, p in enumerate(data["parts"]):
        part_num = p.get("part", idx + 1)
        assert isinstance(p["say"], list), f"Day {day_num} Part {part_num} say is not a list"
        assert len(p["say"]) >= 4, f"Day {day_num} Part {part_num} say must have >= 4 paragraphs"
        wc = sum(len(s.split()) for s in p["say"])
        day_words += wc
        assert wc >= 580, f"Day {day_num} Part {part_num} say has only {wc} words (< 580)"
        assert isinstance(p["tryIt"], str), f"Day {day_num} Part {part_num} tryIt is not a string"
        assert len(p["codeNotes"]) >= 3, f"Day {day_num} Part {part_num} codeNotes < 3"
        assert len(p["check"]["options"]) == 4, f"Day {day_num} Part {part_num} check.options != 4"
        assert p["check"]["answer"] == 0, f"Day {day_num} Part {part_num} check.answer != 0"
        assert len(p["check"]["why"]) > 20, f"Day {day_num} Part {part_num} check.why too short"
        assert len(p["code"]) > 50, f"Day {day_num} Part {part_num} code too short"
        assert len(p["output"]) > 10, f"Day {day_num} Part {part_num} output too short"
    
    total_words_block += day_words
    print(f"[PASS] Day {day_num}: {day_words} words (avg {day_words//5} words/part), 5 parts, all invariants satisfied.")

print(f"\n[SUCCESS] BLOCK 9 VERIFICATION PASSED: {total_words_block} total words across Days 41-45 (Avg {total_words_block//5} words/day).")
