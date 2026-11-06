import json
import re
import subprocess
import sys

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

for day in range(41, 46):
    path = f"scripts/bcom_acc_day{day}.json"
    with open(path, "r", encoding="utf-8") as f:
        lesson = json.load(f)
    
    assert lesson["day"] == day, f"Day mismatch in {path}"
    assert lesson["coursePrefix"] == "bcom-accounting", f"Prefix mismatch in {path}"
    assert len(lesson["parts"]) == 5, f"Expected 5 parts in {path}, got {len(lesson['parts'])}"
    
    total_words = 0
    for p in lesson["parts"]:
        part_num = p["part"]
        say = p["say"]
        wc = count_words(say)
        total_words += wc
        assert wc >= 580, f"Day {day} Part {part_num} words {wc} < 580"
        
        check = p["check"]
        assert check["answer"] == 0, f"Day {day} Part {part_num} check.answer != 0"
        assert check["answerIndex"] == 0, f"Day {day} Part {part_num} check.answerIndex != 0"
        assert len(check["options"]) == 4, f"Day {day} Part {part_num} options != 4"
        assert len(check["explanation"].strip()) > 0, f"Day {day} Part {part_num} empty explanation"
        assert len(check["why"].strip()) > 0, f"Day {day} Part {part_num} empty why"
        
        # Test Python code execution and stdout
        code = p["code"]
        expected_output = p["output"].strip()
        res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
        assert res.returncode == 0, f"Day {day} Part {part_num} code failed with return code {res.returncode}:\n{res.stderr}"
        actual_output = res.stdout.strip()
        assert actual_output == expected_output, f"Day {day} Part {part_num} stdout mismatch:\nExpected:\n{expected_output}\nActual:\n{actual_output}"

    assert total_words >= 3000, f"Day {day} total words {total_words} < 3000"
    print(f"Day {day} verified successfully! (Total words: {total_words})")

print("\nALL BLOCK 9 DAYS (41-45) PASSED 100% OF VERIFICATION INVARIANTS!")
