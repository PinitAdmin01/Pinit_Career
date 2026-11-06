"""
Intermediate Verification Script for Batch 1 (Days 21-25)
Course: B.Com Banking & Financial Services (bcom_ban)
Step 3 of user batched protocol.
"""

import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bcom_ban_day21_builder import build_day21
from bcom_ban_day22_builder import build_day22
from bcom_ban_day23_builder import build_day23
from bcom_ban_day24_builder import build_day24
from bcom_ban_day25_builder import build_day25
from visual_builder import generate_ledger_sheet_visual, count_words

days = [build_day21(), build_day22(), build_day23(), build_day24(), build_day25()]

print("=== STEP 3: INTERMEDIATE AUDIT FOR BATCH 1 (DAYS 21-25) ===")
total_words = 0
for d in days:
    day_num = d["day"]
    w = count_words([p["say"] for p in d["parts"]])
    total_words += w
    part_words = [count_words(p["say"]) for p in d["parts"]]
    print(f"Day {day_num}: {w} words | Parts: {part_words}")
    assert w >= 2950, f"Day {day_num} failed total word budget ({w} < 2950)"
    for idx, pw in enumerate(part_words):
        assert pw >= 580, f"Day {day_num} Part {idx+1} failed word budget ({pw} < 580)"
        
    # Check visual generation
    entries = [{"title": p["title"], "code": p["code"]} for p in d["parts"]]
    spec = generate_ledger_sheet_visual("bcom_ban", day_num, entries)
    assert spec["schemaVersion"] == 1, "SchemaVersion mismatch"
    assert len(spec["entries"]) == 5, f"Day {day_num} visual entries mismatch"
    for e in spec["entries"]:
        assert len(e["codeHash"]) == 64, "Invalid SHA-256 hash length"
        assert e["spec"]["template"] == "ledger-sheet", "Template mismatch"
        for s in e["spec"]["steps"]:
            assert s["isBalanced"] is True, f"Step {s['at']} in Day {day_num} not balanced"
            assert s["totalDebit"] == s["totalCredit"], f"Step {s['at']} debits != credits"

print(f"\nAll 5 tasks in Batch 1 passed! Total words: {total_words} across 25 parts.")
print("=== BATCH 1 (DAYS 21-25) STEP 3 TEST PASSED WITH ZERO ERRORS ===")
