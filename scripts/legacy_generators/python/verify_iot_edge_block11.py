#!/usr/bin/env python3
"""
verify_iot_edge_block11.py
Validates 100% of invariants for Course 18 Block 11 (Days 51-55).
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    return proc.stdout.strip().replace("\r\n", "\n")

all_valid = True

for d in range(51, 56):
    file_path = f"scripts/iot_edge_day{d}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"\n--- Verifying Day {d} ---")
    
    # Invariant 1: Top-level keys
    assert data["coursePrefix"] == "iot_edge", f"Day {d} invalid coursePrefix"
    assert data["day"] == d, f"Day {d} day mismatch"
    assert len(data["title"]) > 10, f"Day {d} title too short"
    assert len(data["goal"]) > 20, f"Day {d} goal too short"
    assert data["minutes"] == 38, f"Day {d} minutes must be 38, got {data['minutes']}"
    assert len(data["recap"]) > 20, f"Day {d} recap too short"
    assert len(data["parts"]) == 5, f"Day {d} must have exactly 5 parts"
    assert len(data["summary"]) >= 4, f"Day {d} summary must have >= 4 items"
    assert "projectStep" in data and len(data["projectStep"]["steps"]) >= 4, f"Day {d} invalid projectStep"
    
    # Invariant 2: Parts validation
    for i, p in enumerate(data["parts"]):
        # Say words >= 580
        words = sum(len(s.split()) for s in p["say"])
        assert words >= 580, f"Day {d} Part {i+1} words below 580: {words}"
        
        # Example
        assert len(p["example"]) > 20, f"Day {d} Part {i+1} example too short"
        
        # Code & Output exact match
        actual_output = run_code(p["code"])
        expected_output = p["output"].strip().replace("\r\n", "\n")
        assert actual_output == expected_output, f"Day {d} Part {i+1} code output mismatch!\nActual:\n{actual_output}\nExpected:\n{expected_output}"
        
        # CodeNotes
        assert len(p["codeNotes"]) >= 3, f"Day {d} Part {i+1} codeNotes < 3"
        
        # TryIt string
        assert isinstance(p["tryIt"], str) and len(p["tryIt"]) > 10, f"Day {d} Part {i+1} tryIt must be string"
        
        # Check
        check = p["check"]
        assert len(check["question"]) > 10, f"Day {d} Part {i+1} question too short"
        assert len(check["options"]) == 4, f"Day {d} Part {i+1} options != 4"
        assert check["answer"] == 0, f"Day {d} Part {i+1} answer must be 0"
        assert len(check["why"]) > 20, f"Day {d} Part {i+1} why too short"
        
        print(f"  Part {i+1}: {words} words, code match PASS, check PASS")

print("\n>>> ALL INVARIANTS FOR BLOCK 11 (DAYS 51-55) 100% VALIDATED DETERMINISTICALLY! <<<")
