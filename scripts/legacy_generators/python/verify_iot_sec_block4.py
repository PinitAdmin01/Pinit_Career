#!/usr/bin/env python3
"""
verify_iot_sec_block4.py
Rigorous verification of Course 19 (iot_sec) Month 1 Block 4 Days 16-20.
"""
import json, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

all_days = []
total_words = 0

for d in range(16, 21):
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
    assert "desc" not in data["projectStep"], f"Day {d} projectStep must not have 'desc'"

    day_words = []
    print(f"\n--- Verifying Day {d}: {data['title'][:55]}... ({data['minutes']} min) ---")
    for idx, part in enumerate(data["parts"], 1):
        assert len(part["title"]) > 5, f"Day {d} part {idx} title too short"
        assert isinstance(part["say"], list) and len(part["say"]) >= 4, f"Day {d} part {idx} say not list or < 4 paragraphs"
        
        words = sum(len(p.split()) for p in part["say"])
        day_words.append(words)
        print(f"  Part {idx} words: {words} | {part['title'][:40]}...")
        assert words >= 580, f"Day {d} Part {idx} word count {words} < 580!"

        assert len(part["example"]) > 15, f"Day {d} Part {idx} example too short"
        assert len(part["code"]) > 50, f"Day {d} Part {idx} code too short"
        assert len(part["output"]) > 0, f"Day {d} Part {idx} output empty"
        assert len(part.get("codeNotes", [])) >= 3, f"Day {d} Part {idx} codeNotes < 3"
        assert isinstance(part.get("tryIt"), str) and len(part["tryIt"]) > 15, f"Day {d} Part {idx} tryIt invalid"

        # Check question
        check = part.get("check")
        assert check, f"Day {d} Part {idx} check missing"
        assert check["answer"] == 0, f"Day {d} Part {idx} check.answer != 0"
        assert len(check["options"]) == 4, f"Day {d} Part {idx} options != 4"
        assert len(check["why"]) > 20, f"Day {d} Part {idx} why too short"

        # Deterministic Python code execution
        actual_output = run_code(part["code"])
        expected_output = part["output"].strip()
        assert actual_output == expected_output, f"Day {d} Part {idx} output mismatch!\nActual:\n{actual_output}\nExpected:\n{expected_output}"

    day_total = sum(day_words)
    total_words += day_total
    print(f"Day {d} Total Words: {day_total} - ALL CHECKS PASSED")
    all_days.append(data)

print(f"\n==========================================")
print(f"BLOCK 4 COMPLETE: 5 Days (16-20), 25 Parts")
print(f"Total Words: {total_words} (Avg: {total_words/5:.1f} words/day)")
print(f"All 25 code snippets executed and matched output 100%!")
print(f"==========================================")

with open("scripts/block4_iot_sec_all_days.json", "w", encoding="utf-8") as f:
    json.dump(all_days, f, indent=2, ensure_ascii=False)
print("Saved combined block to scripts/block4_iot_sec_all_days.json")
