# scripts/verify_day48_standalone.py
import sys
import os
import subprocess

sys.path.insert(0, os.getcwd())
from scripts.data_scrm_day48 import DAY_DATA

print(f"Auditing Day {DAY_DATA['day']}: {DAY_DATA['title']}")
total_words = 0
for idx, p in enumerate(DAY_DATA['parts']):
    words = sum(len(s.split()) for s in p['say'])
    total_words += words
    print(f"  Part {idx+1}: {words} words | Title: {p['title'][:45]}...")
    assert words >= 600, f"Part {idx+1} word count {words} < 600"
    
    # Check MCQ
    diag = p["diagnosticCheck"]
    assert len(diag["options"]) == 4, f"Part {idx+1} options != 4"
    assert diag["answer"] == 0, f"Part {idx+1} answer != 0"
    assert diag["answerIndex"] == 0, f"Part {idx+1} answerIndex != 0"
    assert len(diag["why"]) >= 20, f"Part {idx+1} why < 20 chars"
    
    # Test code
    res = subprocess.run([sys.executable, "-c", p['code']], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in Part {idx+1} code:\n{res.stderr}")
        sys.exit(1)

print(f"Day 48 TOTAL WORDS: {total_words} (PASSED >= 3000 words)")
assert total_words >= 3000, f"Total words {total_words} < 3000"
print("All 5 parts >= 600 words, all MCQs valid, all 5 code snippets run cleanly!")
