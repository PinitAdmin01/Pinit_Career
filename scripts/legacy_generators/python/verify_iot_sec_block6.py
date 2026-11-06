import json, subprocess, sys

days = [26, 27, 28, 29, 30]
all_days = []

print("=== VERIFYING IOT_SEC BLOCK 6 (DAYS 26-30) INVARIANTS ===")

for d in days:
    path = f"scripts/iot_sec_day{d}.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # 1. Course prefix
    assert data["coursePrefix"] == "iot_sec", f"Day {d} invalid coursePrefix {data['coursePrefix']}"
    # 2. Day number
    assert data["day"] == d, f"Day {d} invalid day number {data['day']}"
    # 3. Minutes
    assert data["minutes"] == 38, f"Day {d} invalid minutes {data['minutes']}"
    # 4. 5 parts
    assert len(data["parts"]) == 5, f"Day {d} parts length {len(data['parts'])} != 5"
    # 5. Project step
    assert "desc" not in data["projectStep"], f"Day {d} projectStep has forbidden 'desc' field!"
    assert len(data["projectStep"]["steps"]) >= 4, f"Day {d} projectStep steps < 4"
    # 6. Summary
    assert len(data["summary"]) >= 4, f"Day {d} summary items < 4"

    day_words = 0
    for idx, p in enumerate(data["parts"], 1):
        pw = sum(len(s.split()) for s in p["say"])
        day_words += pw
        assert pw >= 580, f"Day {d} Part {idx} word count {pw} < 580!"
        # Check
        chk = p["check"]
        assert len(chk["options"]) == 4, f"Day {d} Part {idx} check options != 4"
        assert chk["answer"] == 0, f"Day {d} Part {idx} check answer {chk['answer']} != 0"
        assert len(chk["why"]) > 20, f"Day {d} Part {idx} check why explanation too short"
        # Code notes
        assert len(p["codeNotes"]) >= 3, f"Day {d} Part {idx} codeNotes < 3"

        # Deterministic code check
        res = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        assert res.returncode == 0, f"Day {d} Part {idx} code execution failed: {res.stderr}"
        assert res.stdout.strip() == p["output"].strip(), f"Day {d} Part {idx} output mismatch!\nActual:\n{res.stdout.strip()}\nExpected:\n{p['output'].strip()}"

    print(f"PASS: Day {d} '{data['title'][:55]}...' -> {day_words} words, 5 parts >=580w, code 100% deterministic.")
    all_days.append(data)

with open("scripts/block6_iot_sec_all_days.json", "w", encoding="utf-8") as f:
    json.dump(all_days, f, indent=2)

print("\nSUCCESS: All Block 6 days verified 100% and saved to scripts/block6_iot_sec_all_days.json!")
