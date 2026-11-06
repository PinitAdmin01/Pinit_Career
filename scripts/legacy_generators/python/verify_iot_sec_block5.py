import json, subprocess, sys

def run_python_code(code: str) -> str:
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

all_days = []
for day in range(21, 26):
    path = f"scripts/iot_sec_day{day}.json"
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)

    # Invariants checks
    assert d["coursePrefix"] == "iot_sec", f"Day {day} coursePrefix mismatch: {d['coursePrefix']}"
    assert d["day"] == day, f"Day {day} day number mismatch: {d['day']}"
    assert d["minutes"] == 38, f"Day {day} minutes mismatch: {d['minutes']}"
    assert len(d["parts"]) == 5, f"Day {day} parts count != 5: {len(d['parts'])}"
    assert len(d.get("summary", [])) >= 4, f"Day {day} summary count < 4: {len(d.get('summary', []))}"
    
    ps = d.get("projectStep", {})
    assert "desc" not in ps, f"Day {day} projectStep contains forbidden 'desc' field!"
    assert "title" in ps and len(ps["title"]) > 0, f"Day {day} projectStep missing title!"
    assert len(ps.get("steps", [])) >= 4, f"Day {day} projectStep steps < 4: {len(ps.get('steps', []))}"

    part_wcs = []
    for idx, p in enumerate(d["parts"], 1):
        assert "title" in p and len(p["title"]) > 0
        assert "example" in p and len(p["example"]) > 0
        assert "tryIt" in p and len(p["tryIt"]) > 0
        assert len(p.get("codeNotes", [])) >= 3, f"Day {day} Part {idx} codeNotes < 3!"
        
        # Check questions
        chk = p.get("check", {})
        assert chk.get("answer") == 0, f"Day {day} Part {idx} check.answer != 0!"
        assert len(chk.get("options", [])) == 4, f"Day {day} Part {idx} check.options != 4!"
        assert "why" in chk and len(chk["why"]) > 0, f"Day {day} Part {idx} check missing why!"

        # Word count check
        wc = sum(len(s.split()) for s in p["say"])
        part_wcs.append(wc)
        assert wc >= 580, f"Day 21 Part {idx} word count {wc} < 580!" if day == 21 else f"Day {day} Part {idx} word count {wc} < 580!"

        # Code execution check
        actual_output = run_python_code(p["code"])
        expected_output = p["output"].strip()
        assert actual_output == expected_output, (
            f"Day {day} Part {idx} output mismatch!\nActual:\n{actual_output}\nExpected:\n{expected_output}"
        )

    total_words = sum(part_wcs)
    print(f"Day {day} verified! Total words: {total_words} | Parts: {part_wcs} | All 5 snippets match runtime.")
    all_days.append(d)

with open("scripts/block5_iot_sec_all_days.json", "w", encoding="utf-8") as f:
    json.dump(all_days, f, indent=2)

print(f"Successfully verified and saved all 5 days (21-25) into scripts/block5_iot_sec_all_days.json!")
