import json
import re
import subprocess

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

days = [36, 37, 38, 39, 40]
for d in days:
    filepath = f"scripts/bcom_acc_day{d}.json"
    with open(filepath, "r", encoding="utf-8") as f:
        lesson = json.load(f)
    
    assert lesson["coursePrefix"] == "bcom-accounting", f"Day {d} invalid coursePrefix"
    assert lesson["day"] == d, f"Day {d} invalid day number"
    assert len(lesson["parts"]) == 5, f"Day {d} does not have exactly 5 parts"
    
    total_w = 0
    for p in lesson["parts"]:
        part_num = p["part"]
        say = p["say"]
        w = count_words(say)
        total_w += w
        assert w >= 580, f"Day {d} Part {part_num} has {w} words (< 580)"
        
        check = p["check"]
        assert check["answer"] == 0, f"Day {d} Part {part_num} check.answer != 0"
        assert check["answerIndex"] == 0, f"Day {d} Part {part_num} check.answerIndex != 0"
        assert len(check["options"]) == 4, f"Day {d} Part {part_num} check does not have 4 options"
        assert len(check["explanation"].strip()) > 0, f"Day {d} Part {part_num} empty explanation"
        assert len(check["why"].strip()) > 0, f"Day {d} Part {part_num} empty why"
        
        # Test code execution matches output
        code = p["code"]
        expected_output = p["output"].strip()
        res = subprocess.run(["python", "-c", code], capture_output=True, text=True)
        assert res.returncode == 0, f"Day {d} Part {part_num} code failed: {res.stderr}"
        actual_output = res.stdout.strip()
        assert actual_output == expected_output, f"Day {d} Part {part_num} output mismatch:\nExpected:\n{expected_output}\nActual:\n{actual_output}"
        
    assert total_w >= 3000, f"Day {d} total words {total_w} < 3000"
    print(f"Day {d} PASS: 5 parts, total words {total_w}, code output 100% matched!")

print("ALL BLOCK 8 DAYS (36-40) FULLY VERIFIED AND PASS ALL INVARIANTS!")
