#!/usr/bin/env python3
"""
generate_block9_content.py
Generates Days 41 to 45 for Course 18 (iot_edge).
"""
import json, sys

def verify_and_save(day_dict, filename):
    print(f"--- Verifying Day {day_dict['day']} ---")
    assert day_dict["minutes"] == 38, f"Invalid minutes: {day_dict['minutes']}"
    assert len(day_dict["parts"]) == 5, f"Expected 5 parts, got {len(day_dict['parts'])}"
    total_w = 0
    for p in day_dict["parts"]:
        wc = len(p["say"].split())
        total_w += wc
        print(f"  Part {p['part']}: {wc} words in say")
        if wc < 580:
            raise ValueError(f"Part {p['part']} failed word count: {wc} < 580")
        if not isinstance(p["tryIt"], str):
            raise TypeError(f"Part {p['part']} tryIt must be str")
        if len(p["codeNotes"]) < 3:
            raise ValueError(f"Part {p['part']} codeNotes < 3")
        if len(p["summary"]) < 4:
            raise ValueError(f"Part {p['part']} summary < 4")
        if len(p["projectStep"]["steps"]) < 4:
            raise ValueError(f"Part {p['part']} projectStep.steps < 4")
        if len(p["check"]["options"]) != 4:
            raise ValueError(f"Part {p['part']} options != 4")
        if p["check"]["answer"] != 0:
            raise ValueError(f"Part {p['part']} answer != 0")
        if len(p["check"]["why"]) < 20:
            raise ValueError(f"Part {p['part']} why too short")
    print(f"Day {day_dict['day']} passed with {total_w} total words.")
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(day_dict, f, indent=2)
    print(f"Saved {filename}")

if __name__ == "__main__":
    print("Content generation helper loaded.")
