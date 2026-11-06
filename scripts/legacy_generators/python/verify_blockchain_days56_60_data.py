# -*- coding: utf-8 -*-
"""
Verification script for Course 7 Month 2 Batch 6 (Days 56-60).
Block 12: Uniswap v4, Aave v3, PinIT Soulbound Tokens, Principal Web3 RFC, and Master Capstone.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from blockchain_day56_data import day56
from blockchain_day57_data import day57
from blockchain_day58_data import day58
from blockchain_day59_data import day59
from blockchain_day60_data import day60

days = [day56, day57, day58, day59, day60]

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
print("VERIFYING DAYS 56-60 DOMAIN INVARIANTS")
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

        if not p.get("code"):
            print(f"FAILED: Day {d} Part {idx+1} missing code!")
            all_passed = False

        if not p.get("output"):
            print(f"FAILED: Day {d} Part {idx+1} missing output!")
            all_passed = False

        if len(p.get("codeNotes", [])) < 3:
            print(f"FAILED: Day {d} Part {idx+1} has fewer than 3 codeNotes!")
            all_passed = False

        if not p.get("tryIt"):
            print(f"FAILED: Day {d} Part {idx+1} missing tryIt!")
            all_passed = False

        chk = p.get("check")
        if not chk or len(chk.get("options", [])) < 3:
            print(f"FAILED: Day {d} Part {idx+1} invalid check question/options!")
            all_passed = False

    if len(lesson["summary"]) < 5:
        print(f"FAILED: Day {d} summary has fewer than 5 items!")
        all_passed = False

    if len(lesson["projectStep"]["steps"]) < 5:
        print(f"FAILED: Day {d} projectStep has fewer than 5 steps!")
        all_passed = False

    if spoken < 20:
        print(f"FAILED: Day {d} spoken minutes {spoken} < 20!")
        all_passed = False

    if not (35 <= total_min <= 40):
        print(f"FAILED: Day {d} total minutes {total_min} not in [35, 40]!")
        all_passed = False

print("\n" + "=" * 80)
if all_passed:
    print("ALL DAYS 56-60 INVARIANTS PASSED! READY FOR GATE V2 VISUAL GENERATION & CORE APPEND.")
else:
    print("SOME CHECKS FAILED! REVIEW OUTPUT ABOVE.")
    sys.exit(1)
