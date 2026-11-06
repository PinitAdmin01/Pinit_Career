import json, subprocess, sys

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True, encoding='utf-8')
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

for day_num in range(56, 61):
    file_path = f"scripts/node_day{day_num}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    expected_min = 45 if day_num == 60 else 38
    assert data["minutes"] == expected_min, f"Day {day_num} minutes must be {expected_min}, got {data['minutes']}"
    assert data["day"] == day_num, f"Day {day_num} day field mismatch: {data['day']}"
    assert len(data["parts"]) == 5, f"Day {day_num} must have 5 parts, got {len(data['parts'])}"

    assert "projectStep" in data, f"Day {day_num} missing projectStep"
    ps = data["projectStep"]
    assert "title" in ps and "steps" in ps, f"Day {day_num} projectStep missing title/steps"
    assert "desc" not in ps, f"Day {day_num} projectStep must NOT have 'desc' field!"
    assert len(ps["steps"]) == 5, f"Day {day_num} projectStep steps length must be 5, got {len(ps['steps'])}"

    total_words = 0
    print(f"\n--- Verifying Day {day_num}: {data['title']} ({data['minutes']} min) ---")
    for p_idx, part in enumerate(data["parts"], 1):
        wc = sum(len(s.split()) for s in part["say"])
        total_words += wc
        print(f"  Part {p_idx} words: {wc} - {part['title'][:50]}...")
        assert wc >= 580, f"Day {day_num} Part {p_idx} word count {wc} < 580!"

        # Check question
        check = part.get("check")
        assert check, f"Day {day_num} Part {p_idx} missing check question"
        assert check.get("answer") == 0, f"Day {day_num} Part {p_idx} check.answer must be 0"
        assert len(check.get("options", [])) >= 2, f"Day {day_num} Part {p_idx} options must be >= 2"
        assert check.get("why"), f"Day {day_num} Part {p_idx} why must be non-empty"

        # Check deterministic code execution
        actual_output = run_code(part["code"])
        expected_output = part["output"].strip()
        assert actual_output == expected_output, f"Day {day_num} Part {p_idx} output mismatch!\nActual:\n{actual_output}\nExpected:\n{expected_output}"

    print(f"Day {day_num} Total Words: {total_words} - ALL INVARIANTS SATISFIED!")

print("\n>>> ALL DAYS 56-60 PASSED ALL VERIFICATIONS! <<<")
