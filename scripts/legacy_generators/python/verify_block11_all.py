# scripts/verify_block11_all.py
import sys
import subprocess
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(repo_root))

from scripts.data_scrm_day51 import DAY_DATA as d51
from scripts.data_scrm_day52 import DAY_DATA as d52
from scripts.data_scrm_day53 import DAY_DATA as d53
from scripts.data_scrm_day54 import DAY_DATA as d54
from scripts.data_scrm_day55 import DAY_DATA as d55

days = [d51, d52, d53, d54, d55]

print("==================================================")
print("VERIFYING BLOCK 11 (Days 51 to 55) INVARIANTS")
print("==================================================")

total_block_words = 0

for d_idx, day in enumerate(days):
    day_num = day["day"]
    title = day["title"]
    print(f"\n--- Day {day_num}: {title} ---")
    
    assert len(day["parts"]) == 5, f"Day {day_num} must have exactly 5 parts"
    assert len(day["summary"]) >= 4, f"Day {day_num} must have >= 4 summary items"
    assert len(day["projectStep"]["steps"]) >= 4, f"Day {day_num} must have >= 4 project steps"
    
    day_words = 0
    for p_idx, part in enumerate(day["parts"]):
        p_num = p_idx + 1
        p_title = part["title"]
        words = sum(len(para.split()) for para in part["say"])
        day_words += words
        
        print(f"  Part {p_num} ({p_title[:35]}...): {words} words")
        assert words >= 600, f"Day {day_num} Part {p_num} has {words} words (< 600 required)"
        
        # Verify MCQ
        mcq = part["diagnosticCheck"]
        assert len(mcq["options"]) == 4, f"Day {day_num} Part {p_num} MCQ must have 4 options"
        assert mcq["answer"] == 0, f"Day {day_num} Part {p_num} MCQ answer must be 0"
        assert mcq["answerIndex"] == 0, f"Day {day_num} Part {p_num} MCQ answerIndex must be 0"
        assert len(mcq["why"]) >= 20, f"Day {day_num} Part {p_num} MCQ why must be >= 20 chars"
        
        # Verify Code execution
        code = part["code"]
        res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"FAILED CODE IN DAY {day_num} PART {p_num}:\n{code}\nERROR: {res.stderr}")
            sys.exit(1)
        print(f"    -> Code executed cleanly (stdout {len(res.stdout)} chars)")
        
    print(f"Day {day_num} Total Words: {day_words} (>= 3,000 required)")
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3,000"
    total_block_words += day_words

print("\n==================================================")
print(f"BLOCK 11 VERIFICATION COMPLETE!")
print(f"Total Block 11 Word Count: {total_block_words} words across 25 parts")
assert total_block_words >= 15000, f"Total block words {total_block_words} < 15,000"
print("ALL INVARIANTS SATISFIED 100%!")
print("==================================================")
