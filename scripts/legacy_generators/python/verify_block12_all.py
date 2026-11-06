# scripts/verify_block12_all.py
"""
Block 12 Comprehensive Verification Script (Days 56-60)
Course: bcom_scrm (Enterprise B2B Sales, Customer Success & CRM Systems Architecture)
Checks:
  - Pedagogical word counts (>=600 words/part; >=3,000 words/day)
  - Code snippet standalone execution (zero external dependencies, runs clean)
  - Socratic MCQ formatting (4 options, answer: 0, answerIndex: 0, why >= 20 chars)
  - Summary & ProjectStep structure
"""

import sys
import subprocess
from data_scrm_day56 import DAY_56_DATA
from data_scrm_day57 import DAY_57_DATA
from data_scrm_day58 import DAY_58_DATA
from data_scrm_day59 import DAY_59_DATA
from data_scrm_day60 import DAY_60_DATA

DAYS = [DAY_56_DATA, DAY_57_DATA, DAY_58_DATA, DAY_59_DATA, DAY_60_DATA]

def verify_all():
    total_words_block = 0
    all_passed = True
    
    print("=" * 70)
    print("STARTING BLOCK 12 (DAYS 56-60) PEDAGOGICAL & CODE VERIFICATION")
    print("=" * 70)

    for day_data in DAYS:
        day_num = day_data["day"]
        day_title = day_data["title"]
        print(f"\n--- Checking Day {day_num}: {day_title} ---")
        
        # Check basic structure
        assert day_data["minutes"] in [45, 60], f"Day {day_num} invalid minutes: {day_data['minutes']}"
        assert len(day_data["summary"]) >= 4, f"Day {day_num} summary points < 4"
        assert len(day_data["projectStep"]["steps"]) >= 4, f"Day {day_num} project steps < 4"
        
        day_words = 0
        for p_idx, part in enumerate(day_data["parts"]):
            part_title = part["title"]
            words = sum(len(p.strip().split()) for p in part["say"])
            day_words += words
            total_words_block += words
            
            print(f"  Part {p_idx+1}: {part_title} -> {words} words", end="")
            if words < 600:
                print(f" [FAILED: <600 words!]")
                all_passed = False
            else:
                print(f" [OK]")
                
            # Check MCQ
            mcq = part["check"]
            assert len(mcq["options"]) == 4, f"Day {day_num} Part {p_idx+1} MCQ options count != 4"
            assert mcq["answer"] == 0, f"Day {day_num} Part {p_idx+1} MCQ answer != 0"
            assert mcq["answerIndex"] == 0, f"Day {day_num} Part {p_idx+1} MCQ answerIndex != 0"
            assert len(mcq["why"]) >= 20, f"Day {day_num} Part {p_idx+1} MCQ why < 20 chars"
            
            # Check tryIt & codeNotes
            assert len(part["tryIt"]) >= 15, f"Day {day_num} Part {p_idx+1} tryIt < 15 chars"
            assert len(part["codeNotes"]) >= 3, f"Day {day_num} Part {p_idx+1} codeNotes < 3"
            
            # Run code snippet standalone
            code_str = part["code"]
            try:
                # Run through python subprocess to verify clean standalone stdout
                res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, timeout=10)
                if res.returncode != 0:
                    print(f"    --> CODE EXECUTION ERROR in Day {day_num} Part {p_idx+1}:\n{res.stderr}")
                    all_passed = False
                elif not res.stdout.strip():
                    print(f"    --> CODE OUTPUT EMPTY in Day {day_num} Part {p_idx+1}")
                    all_passed = False
            except Exception as e:
                print(f"    --> CODE EXEC EXCEPTION in Day {day_num} Part {p_idx+1}: {e}")
                all_passed = False

        print(f"  Total Day {day_num} Words: {day_words}", end="")
        if day_words < 3000:
            print(" [FAILED: <3000 words!]")
            all_passed = False
        else:
            print(" [OK]")

    print("\n" + "=" * 70)
    print(f"TOTAL BLOCK 12 WORDS: {total_words_block:,} across 25 parts")
    print(f"ALL INVARIANTS STATUS: {'100% VERIFIED & PASSED' if all_passed else 'FAILED'}")
    print("=" * 70)
    
    if not all_passed:
        sys.exit(1)

if __name__ == "__main__":
    verify_all()
