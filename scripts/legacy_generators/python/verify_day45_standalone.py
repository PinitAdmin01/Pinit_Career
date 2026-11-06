# scripts/verify_day45_standalone.py
import sys
import os
sys.path.insert(0, os.getcwd())
import subprocess
from scripts.data_scrm_day45 import DAY_DATA

print(f"Day {DAY_DATA['day']}: {DAY_DATA['title']}")
total_words = 0
for idx, p in enumerate(DAY_DATA['parts']):
    words = sum(len(s.split()) for s in p['say'])
    total_words += words
    print(f"  Part {idx+1}: {words} words | Code length: {len(p['code'])} chars")
    assert words >= 600, f"Part {idx+1} word count {words} < 600"
    res = subprocess.run([sys.executable, "-c", p['code']], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in part {idx+1}:\n{res.stderr}")
        sys.exit(1)
print(f"Day 45 TOTAL WORDS: {total_words}. All 5 parts >= 600 words and all 5 codes pass cleanly!")
