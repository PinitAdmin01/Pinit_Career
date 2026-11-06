"""
Master Compiler & Validator for Block 7 (Days 31-35)
Course: 37 (course-nlp: Natural Language Processing & Computational Linguistics)
PinIT Career OS - Month 2 Enterprise Expansion
"""

import os
import sys
import json
import subprocess

# Ensure scripts directory is on sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from nlp_builder.day31 import DAY_31_DATA
from nlp_builder.day32 import DAY_32_DATA
from nlp_builder.day33 import DAY_33_DATA
from nlp_builder.day34 import DAY_34_DATA
from nlp_builder.day35 import DAY_35_DATA

BLOCK_7_DAYS = [
    DAY_31_DATA,
    DAY_32_DATA,
    DAY_33_DATA,
    DAY_34_DATA,
    DAY_35_DATA
]

def validate_and_compile():
    print("=" * 70)
    print("APEX FOUNDATION VALIDATOR: NLP BLOCK 7 (DAYS 31-35)")
    print("=" * 70)

    total_words_all = 0
    total_parts_all = 0
    all_passed = True

    assert len(BLOCK_7_DAYS) == 5, f"Expected 5 days, found {len(BLOCK_7_DAYS)}"

    for day_idx, day_data in enumerate(BLOCK_7_DAYS, start=31):
        day_num = day_data.get("day")
        day_title = day_data.get("title")
        parts = day_data.get("parts", [])
        
        print(f"\nVerifying Day {day_num}: {day_title}")
        print("-" * 60)
        
        assert day_num == day_idx, f"Day number mismatch: expected {day_idx}, got {day_num}"
        assert len(parts) == 5, f"Day {day_num} must have exactly 5 parts, found {len(parts)}"
        
        day_words = 0

        for part_idx, part in enumerate(parts, start=1):
            total_parts_all += 1
            part_title = part.get("title", "")
            say_paras = part.get("say", [])
            words = len(" ".join(say_paras).split())
            day_words += words
            total_words_all += words

            # 1. Word count invariant: >= 600 words per part
            if words < 600:
                print(f"  [FAIL] Part {part_idx} ('{part_title[:30]}...'): {words} words (FAILED: < 600 words)")
                all_passed = False
            else:
                print(f"  [PASS] Part {part_idx} ('{part_title[:30]}...'): {words} words")

            # 2. Example invariant: >= 20 chars
            example = part.get("example", "")
            assert len(example) >= 20, f"Day {day_num} Part {part_idx} example too short: {len(example)} chars"

            # 3. Code Notes & TryIt invariants
            code_notes = part.get("codeNotes", [])
            assert len(code_notes) >= 2, f"Day {day_num} Part {part_idx} codeNotes must have >= 2 items"
            try_it = part.get("tryIt", "")
            assert len(try_it) >= 15, f"Day {day_num} Part {part_idx} tryIt too short: {len(try_it)} chars"

            # 4. MCQ diagnostic check invariants
            check = part.get("check", {})
            assert check.get("answer") == 0, f"Day {day_num} Part {part_idx} check.answer must be 0"
            assert check.get("answerIndex") == 0, f"Day {day_num} Part {part_idx} check.answerIndex must be 0"
            options = check.get("options", [])
            assert len(options) == 4, f"Day {day_num} Part {part_idx} options must be 4, got {len(options)}"
            why = check.get("why", "")
            assert len(why) >= 50, f"Day {day_num} Part {part_idx} why too short: {len(why)} chars"
            assert check.get("explanation") == why, f"Day {day_num} Part {part_idx} explanation must match why"

            # 5. Code runnable & output exact match
            code = part.get("code", "")
            expected_output = part.get("output", "").strip().replace("\r\n", "\n")
            
            res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, encoding="utf-8")
            if res.returncode != 0:
                print(f"  [ERROR] Day {day_num} Part {part_idx} code crashed:")
                print(res.stderr)
                all_passed = False
            else:
                actual_output = res.stdout.strip().replace("\r\n", "\n")
                if actual_output != expected_output:
                    print(f"  [MISMATCH] Day {day_num} Part {part_idx} output mismatch:")
                    print("--- ACTUAL ---")
                    print(actual_output)
                    print("--- EXPECTED ---")
                    print(expected_output)
                    all_passed = False

        print(f"Day {day_num} Total Words: {day_words} (Average: {day_words // 5} words/part)")

    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    print(f"Total Days:        {len(BLOCK_7_DAYS)}")
    print(f"Total Parts:       {total_parts_all}")
    print(f"Total Words:       {total_words_all} words across Block 7")
    print(f"Average Words/Day: {total_words_all // len(BLOCK_7_DAYS)} words/day")
    print(f"Average Words/Part:{total_words_all // total_parts_all} words/part")

    if not all_passed:
        print("\n[CRITICAL FAILURE] Some invariants were not satisfied. Aborting compilation.")
        sys.exit(1)

    # Save to data_nlp_block7.json
    out_path = os.path.join(BASE_DIR, "data_nlp_block7.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(BLOCK_7_DAYS, f, indent=2, ensure_ascii=False)

    print(f"\n[SUCCESS] Successfully compiled and serialized to: {out_path}")
    print(f"Output File Size: {os.path.getsize(out_path) / 1024:.2f} KB")

if __name__ == "__main__":
    validate_and_compile()
