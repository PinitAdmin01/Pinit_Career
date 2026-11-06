import json
import re
import subprocess
import os

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

days = [51, 52, 53, 54, 55]
all_passed = True

for d in days:
    filename = f"scripts/bcom_acc_day{d}.json"
    print(f"\n================ Verifying Day {d} ({filename}) ================")
    if not os.path.exists(filename):
        print(f"ERROR: {filename} does not exist!")
        all_passed = False
        continue

    with open(filename, "r", encoding="utf-8") as f:
        lesson = json.load(f)

    assert lesson["day"] == d, f"Day mismatch: {lesson['day']} != {d}"
    assert lesson["coursePrefix"] == "bcom-accounting", f"Course prefix mismatch: {lesson['coursePrefix']}"
    assert len(lesson["parts"]) == 5, f"Parts count != 5: {len(lesson['parts'])}"

    total_words = 0
    for p in lesson["parts"]:
        part_num = p["part"]
        say_text = p["say"]
        wc = count_words(say_text)
        total_words += wc
        print(f"  Part {part_num}: {wc} words (min 580)")
        if wc < 580:
            print(f"    FAILED: Part {part_num} has {wc} words (< 580)")
            all_passed = False

        # Check check
        chk = p["check"]
        if chk["answer"] != 0 or chk["answerIndex"] != 0:
            print(f"    FAILED: Check answer is not 0 (got answer={chk['answer']}, answerIndex={chk['answerIndex']})")
            all_passed = False
        if len(chk["options"]) != 4:
            print(f"    FAILED: Options count != 4 (got {len(chk['options'])})")
            all_passed = False
        if not chk.get("explanation") or not chk.get("why"):
            print(f"    FAILED: Missing explanation or why")
            all_passed = False

        # Execute code in temp file to verify stdout match
        code = p["code"]
        expected_output = p["output"].strip()
        
        with open("scripts/temp_exec.py", "w", encoding="utf-8") as tf:
            tf.write(code)
            
        res = subprocess.run(["python", "scripts/temp_exec.py"], capture_output=True, text=True)
        if os.path.exists("scripts/temp_exec.py"):
            os.remove("scripts/temp_exec.py")
            
        actual_output = res.stdout.strip()
        if actual_output != expected_output:
            print(f"    FAILED: Code output mismatch in Part {part_num}")
            print(f"      Expected:\n{expected_output}")
            print(f"      Actual:\n{actual_output}")
            all_passed = False

    print(f"  Total words: {total_words} (min 3000)")
    if total_words < 3000:
        print(f"    FAILED: Total words {total_words} < 3000")
        all_passed = False

if all_passed:
    print("\n>>> ALL BLOCK 11 DAYS (51-55) VERIFIED 100% INVARIANT-COMPLIANT! <<<")
else:
    print("\n>>> BLOCK 11 VERIFICATION FAILED! <<<")
    exit(1)
