# scripts/verify_block9_all.py
import sys
import os
import subprocess

sys.path.insert(0, os.getcwd())

from scripts.data_scrm_day41 import DAY_DATA as d41
from scripts.data_scrm_day42 import DAY_DATA as d42
from scripts.data_scrm_day43 import DAY_DATA as d43
from scripts.data_scrm_day44 import DAY_DATA as d44
from scripts.data_scrm_day45 import DAY_DATA as d45

days = [d41, d42, d43, d44, d45]
grand_total_words = 0

print("=== BLOCK 9 (DAYS 41-45) RIGOROUS PEDAGOGICAL & CODE AUDIT ===")
for d in days:
    day_num = d["day"]
    title = d["title"]
    print(f"\n--- Day {day_num}: {title} ---")
    assert d["minutes"] == 45, f"Day {day_num} minutes != 45"
    assert len(d["summary"]) >= 4, f"Day {day_num} summary items < 4"
    assert "projectStep" in d, f"Day {day_num} missing projectStep"
    assert len(d["projectStep"]["steps"]) >= 4, f"Day {day_num} projectStep steps < 4"
    assert len(d["parts"]) == 5, f"Day {day_num} parts != 5"
    
    day_words = 0
    for idx, p in enumerate(d["parts"]):
        p_title = p["title"]
        p_words = sum(len(s.split()) for s in p["say"])
        day_words += p_words
        print(f"  Part {idx+1}: '{p_title[:45]}...' -> {p_words} words")
        assert p_words >= 600, f"Day {day_num} Part {idx+1} word count {p_words} < 600!"
        
        # Check MCQ
        diag = p["diagnosticCheck"]
        assert len(diag["options"]) == 4, f"Day {day_num} Part {idx+1} MCQ options != 4"
        assert diag["answer"] == 0, f"Day {day_num} Part {idx+1} answer != 0"
        assert diag["answerIndex"] == 0, f"Day {day_num} Part {idx+1} answerIndex != 0"
        assert len(diag["why"]) >= 20, f"Day {day_num} Part {idx+1} why explanation < 20 chars"
        
        # Test code standalone execution
        res = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"FAILED CODE in Day {day_num} Part {idx+1}:\n{res.stderr}")
            sys.exit(1)
            
    print(f"  -> Day {day_num} Total Words: {day_words} (PASSED >= 3000)")
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3000"
    grand_total_words += day_words

print(f"\n=======================================================")
print(f"BLOCK 9 GRAND TOTAL WORDS: {grand_total_words} across 5 days (25 parts).")
print(f"ALL 25/25 PARTS >= 600 WORDS. ALL 25 CODE SNIPPETS EXECUTE CLEANLY!")
print(f"=======================================================")
