import json
import subprocess
import os
import hashlib

print("=== ASSEMBLING AND ALIGNING IOT_SEC BLOCK 10 (DAYS 46-50) ===")

all_days = []
total_words = 0

for day in range(46, 51):
    json_path = f"scripts/iot_sec_day{day}.json"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["coursePrefix"] = "iot_sec"
    data["minutes"] = 38
    
    parts = data["parts"]
    assert len(parts) == 5, f"Day {day} does not have 5 parts!"

    day_words = 0
    wcs = []
    for idx, part in enumerate(parts):
        # 1. Align output with exact python execution
        code = part.get("code", "")
        proc = subprocess.Popen(["python", "-"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = proc.communicate(input=code, timeout=15)
        assert proc.returncode == 0, f"Day {day} Part {idx+1} code failed!\n{stderr}"
        part["output"] = stdout.strip()

        # 2. Check word count
        say_text = " ".join(part["say"])
        wc = len(say_text.split())
        wcs.append(wc)
        day_words += wc
        assert wc >= 580, f"Day {day} Part {idx+1} word count {wc} < 580!"

        # 3. Check check question
        chk = part["check"]
        assert len(chk["options"]) == 4, f"Day {day} Part {idx+1} options != 4"
        if "answer" in chk:
            assert chk["answer"] == 0
        if "answerIndex" in chk:
            assert chk["answerIndex"] == 0

    total_words += day_words
    print(f"Day {day}: {day_words:,} words (Parts: {wcs}) - Verified!")

    # Check summary & projectStep
    assert len(data.get("summary", [])) >= 4, f"Day {day} summary < 4"
    ps = data.get("projectStep", {})
    assert len(ps.get("steps", [])) >= 4, f"Day {day} projectStep steps < 4"
    if "desc" in ps:
        del ps["desc"]

    # Save aligned JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    all_days.append(data)

# Save combined block JSON
with open("scripts/block10_iot_sec_all_days.json", "w", encoding="utf-8") as f:
    json.dump(all_days, f, indent=2, ensure_ascii=False)

print(f"\nTotal Block 10 Words: {total_words:,} (Average: {total_words // 5:,} words/day)")
print("Saved scripts/block10_iot_sec_all_days.json successfully!")
