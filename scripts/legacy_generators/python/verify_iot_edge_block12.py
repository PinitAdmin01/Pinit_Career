#!/usr/bin/env python3
"""
verify_iot_edge_block12.py
Comprehensive deterministic verification script for Course 18 Month 2 Block 12 (Days 56-60).
"""
import json, sys

days_to_check = [56, 57, 58, 59, 60]
all_pass = True

print("================================================================================")
print("  Course 18 (iot_edge) Month 2 Block 12 (Days 56-60) Invariants Verification")
print("================================================================================")

for day in days_to_check:
    file_path = f"scripts/iot_edge_day{day}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        d = json.load(f)

    print(f"\n--- Verifying Day {day}: {d.get('title')} ---")
    
    # 1. Top-level keys
    assert d.get("coursePrefix") == "iot_edge", f"Day {day}: coursePrefix must be 'iot_edge'"
    assert d.get("day") == day, f"Day {day}: day field mismatch"
    assert len(d.get("title", "")) > 10, f"Day {day}: title too short"
    assert len(d.get("goal", "")) > 25, f"Day {day}: goal too short"
    assert d.get("minutes") == 38, f"Day {day}: minutes must be strictly 38"
    assert len(d.get("recap", "")) > 20, f"Day {day}: recap too short"
    
    parts = d.get("parts", [])
    assert len(parts) == 5, f"Day {day}: parts count must be exactly 5 (got {len(parts)})"

    # Summary and projectStep
    summary = d.get("summary", [])
    assert len(summary) >= 4, f"Day {day}: summary must have >= 4 bullets (got {len(summary)})"
    
    pstep = d.get("projectStep", {})
    assert "title" in pstep and len(pstep["title"]) > 5, f"Day {day}: projectStep.title invalid"
    assert len(pstep.get("steps", [])) >= 4, f"Day {day}: projectStep.steps must have >= 4 items"

    day_words = 0
    part_word_counts = []

    # 2. Check each part
    for idx, p in enumerate(parts):
        p_title = p.get("title", "")
        say_list = p.get("say", [])
        words = sum(len(s.split()) for s in say_list)
        day_words += words
        part_word_counts.append(words)

        assert len(p_title) > 5, f"Day {day} Part {idx+1}: title too short"
        assert len(say_list) >= 4, f"Day {day} Part {idx+1}: say must have >= 4 paragraphs (got {len(say_list)})"
        assert words >= 580, f"Day {day} Part {idx+1}: say words ({words}) must be >= 580!"
        assert len(p.get("example", "")) > 15, f"Day {day} Part {idx+1}: example too short"
        assert len(p.get("code", "")) > 50, f"Day {day} Part {idx+1}: code too short"
        assert len(p.get("output", "")) > 0, f"Day {day} Part {idx+1}: output missing"
        assert len(p.get("codeNotes", [])) >= 3, f"Day {day} Part {idx+1}: codeNotes must have >= 3 items"
        assert isinstance(p.get("tryIt"), str) and len(p["tryIt"]) > 15, f"Day {day} Part {idx+1}: tryIt must be plain string"

        chk = p.get("check", {})
        assert len(chk.get("question", "")) > 10, f"Day {day} Part {idx+1}: check.question invalid"
        opts = chk.get("options", [])
        assert len(opts) == 4, f"Day {day} Part {idx+1}: check.options must have 4 options (got {len(opts)})"
        assert chk.get("answer") == 0, f"Day {day} Part {idx+1}: check.answer must be 0 convention"
        assert len(chk.get("why", "")) > 20, f"Day {day} Part {idx+1}: check.why invalid"

    print(f"  Word Counts per part: {part_word_counts}")
    print(f"  Total Words: {day_words} ({day_words/120:.1f} spoken audio minutes)")
    print(f"  Day {day} Invariants: 100% VALIDATED!")

print("\n================================================================================")
print("  ALL BLOCK 12 (DAYS 56-60) INVARIANTS 100% VALIDATED DETERMINISTICALLY!")
print("================================================================================")
