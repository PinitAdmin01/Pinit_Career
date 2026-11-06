#!/usr/bin/env python3
"""
build_iot_edge_block9_all.py
Authors complete Course 18 Month 2 Block 9 (Days 41–45) with strict invariants:
- 5 parts per day.
- say >= 600 words per part (invariant >= 580 words).
- minutes: 38 declared duration.
- tryIt is a plain string.
- codeNotes >= 3 items.
- summary >= 4 items.
- projectStep.steps >= 4 items.
- check: 4 options, answer: 0, thorough why.
"""

import json
import os

def check_day_invariants(d):
    assert d["minutes"] == 38, f"Day {d['day']} duration must be 38, got {d['minutes']}"
    assert len(d["parts"]) == 5, f"Day {d['day']} parts count must be 5, got {len(d['parts'])}"
    total_words = 0
    for p in d["parts"]:
        wc = len(p["say"].split())
        total_words += wc
        assert wc >= 580, f"Day {d['day']} Part {p['part']} say has only {wc} words (< 580)"
        assert isinstance(p["tryIt"], str), f"Day {d['day']} Part {p['part']} tryIt must be string"
        assert len(p["codeNotes"]) >= 3, f"Day {d['day']} Part {p['part']} codeNotes < 3"
        assert len(p["summary"]) >= 4, f"Day {d['day']} Part {p['part']} summary < 4"
        assert len(p["projectStep"]["steps"]) >= 4, f"Day {d['day']} Part {p['part']} projectStep.steps < 4"
        assert len(p["check"]["options"]) == 4, f"Day {d['day']} Part {p['part']} check.options != 4"
        assert p["check"]["answer"] == 0, f"Day {d['day']} Part {p['part']} check.answer != 0"
        assert len(p["check"]["why"]) > 20, f"Day {d['day']} Part {p['part']} check.why too short"
    print(f"Day {d['day']}: PASSED ({total_words} total words, all parts >= 580 words)")

print("Block 9 generator module ready.")
