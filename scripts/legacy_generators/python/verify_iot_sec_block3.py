#!/usr/bin/env python3
"""
verify_iot_sec_block3.py
Rigorous verification of Course 19 (iot_sec) Month 1 Block 3 Days 11-15.
"""
import json, subprocess, sys

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

all_days = []
total_words = 0

for d in range(11, 16):
    filepath = f"scripts/iot_sec_day{d}.json"
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert data["coursePrefix"] == "iot_sec", f"Day {d} coursePrefix error"
    assert data["day"] == d, f"Day {d} day mismatch"
    assert len(data["title"]) > 10, f"Day {d} title too short"
    assert len(data["goal"]) > 25, f"Day {d} goal too short"
    assert data["minutes"] == 38, f"Day {d} minutes must strictly be 38, got {data['minutes']}"
    assert len(data["recap"]) > 20, f"Day {d} recap too short"
    assert len(data["parts"]) == 5, f"Day {d} parts count != 5"
    assert len(data["summary"]) >= 4, f"Day {d} summary count < 4"
    assert "projectStep" in data and len(data["projectStep"]["steps"]) >= 4

    day_words = []
    for idx, part in enumerate(data["parts"], 1):
        assert len(part["title"]) > 5, f"Day {d} part {idx} title too short"
        assert isinstance(part["say"], list) and len(part["say"]) >= 4, f"Day {d} part {idx} say not list or < 4 paragraphs"
        wc = sum(len(para.split()) for para in part["say"])
        assert wc >= 580, f"VIOLATION: Day {d} part {idx} has {wc} words (< 580 strict invariant)"
        day_words.append(wc)
        
        assert len(part["example"]) > 20, f"Day {d} part {idx} example too short"
        assert isinstance(part["code"], str) and len(part["code"]) > 50, f"Day {d} part {idx} code empty/short"
        
        # Verify deterministic code output
        stdout = run_code(part["code"])
        assert stdout == part["output"].strip(), f"Day {d} part {idx} stdout mismatch!\nExpected:\n{part['output']}\nActual:\n{stdout}"
        
        assert isinstance(part["codeNotes"], list) and len(part["codeNotes"]) >= 3, f"Day {d} part {idx} codeNotes < 3"
        assert isinstance(part["tryIt"], str) and len(part["tryIt"]) > 20, f"Day {d} part {idx} tryIt invalid"
        
        chk = part["check"]
        assert len(chk["question"]) > 15, f"Day {d} part {idx} check question too short"
        assert isinstance(chk["options"], list) and len(chk["options"]) == 4, f"Day {d} part {idx} check options != 4"
        assert chk["answer"] == 0, f"Day {d} part {idx} check answer != 0"
        assert len(chk["why"]) > 20, f"Day {d} part {idx} check why too short"

    total_words += sum(day_words)
    print(f"Day {d} Verified PASS: Words per part: {day_words} (Total: {sum(day_words)}, Min: {min(day_words)})")
    all_days.append(data)

with open("scripts/block3_iot_sec_all_days.json", "w", encoding="utf-8") as f:
    json.dump(all_days, f, indent=2)

print(f"\nALL 5 DAYS (11-15) 100% VERIFIED PASS!")
print(f"Total Block 3 Word Count: {total_words} words (avg {total_words / 5:.1f} words/day)")
print(f"Saved combined JSON: scripts/block3_iot_sec_all_days.json")
