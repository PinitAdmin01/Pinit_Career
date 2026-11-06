# -*- coding: utf-8 -*-
"""
Verification script for Course 7 Month 2 Batch 3 (Days 41-45).
"""

import sys
from blockchain_day41_data import day41
from blockchain_day42_data import day42
from blockchain_day43_data import day43
from blockchain_day44_data import day44
from blockchain_day45_data import day45

days = [day41, day42, day43, day44, day45]

def estimate_spoken_minutes(lesson):
    all_words = []
    for p in lesson["parts"]:
        all_words.extend(" ".join(p["say"]).split())
        if p.get("example"):
            all_words.extend(p["example"].split())
        if p.get("tryIt"):
            all_words.extend(p["tryIt"].split())
        if p.get("check") and p["check"].get("why"):
            all_words.extend(p["check"]["why"].split())
    return round(len(all_words) / 120), len(all_words)

def estimate_activity_minutes(lesson):
    minutes = sum((0.5 if p.get("code") else 0) + (1.0 if p.get("tryIt") else 0) + 0.5 for p in lesson["parts"])
    return round(minutes)

def estimate_lesson_minutes(lesson):
    spoken, _ = estimate_spoken_minutes(lesson)
    return spoken + estimate_activity_minutes(lesson)

print("=" * 80)
print("VERIFYING DAYS 41-45 DOMAIN INVARIANTS")
print("=" * 80)

all_passed = True
for lesson in days:
    d = lesson["day"]
    title = lesson["title"].encode('ascii', 'ignore').decode('ascii')
    parts = lesson["parts"]
    spoken, word_count = estimate_spoken_minutes(lesson)
    total_min = estimate_lesson_minutes(lesson)

    print(f"\n--- Day {d}: {title} ---")
    print(f"Parts count: {len(parts)} (expected 5)")
    print(f"Word count: {word_count} (spoken: {spoken} min, total: {total_min} min)")
    print(f"Summary items: {len(lesson['summary'])} (expected >= 5)")
    print(f"Project steps: {len(lesson['projectStep']['steps'])} (expected >= 5)")

    if len(parts) != 5:
        print(f"FAILED: Day {d} does not have exactly 5 parts!")
        all_passed = False

    for idx, p in enumerate(parts):
        part_words = sum(len(s.split()) for s in p["say"])
        if part_words < 580:
            print(f"FAILED: Day {d} Part {idx+1} has {part_words} words (< 580)!")
            all_passed = False
        if not p.get("codeNotes") or len(p["codeNotes"]) < 3:
            print(f"FAILED: Day {d} Part {idx+1} has fewer than 3 codeNotes!")
            all_passed = False
        if not p.get("code") or "console.log(" not in p["code"]:
            print(f"FAILED: Day {d} Part {idx+1} code does not contain console.log!")
            all_passed = False
        if not p.get("check") or len(p["check"].get("options", [])) < 3:
            print(f"FAILED: Day {d} Part {idx+1} check has fewer than 3 options!")
            all_passed = False

    if spoken < 20:
        print(f"FAILED: Day {d} spoken minutes {spoken} < 20!")
        all_passed = False

    if not (35 <= total_min <= 40):
        print(f"FAILED: Day {d} total minutes {total_min} not in [35, 40]!")
        all_passed = False

    if len(lesson["summary"]) < 5:
        print(f"FAILED: Day {d} summary has fewer than 5 items!")
        all_passed = False

    if len(lesson["projectStep"]["steps"]) < 5:
        print(f"FAILED: Day {d} projectStep has fewer than 5 steps!")
        all_passed = False

if all_passed:
    print("\nALL INVARIANTS PASSED PERFECTLY FOR DAYS 41-45!")
else:
    print("\nSOME INVARIANTS FAILED!")
    sys.exit(1)
