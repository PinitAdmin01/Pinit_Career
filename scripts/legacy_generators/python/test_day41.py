import sys
import os
import subprocess

sys.path.insert(0, os.path.abspath('.'))
from scripts.nlp_builder.day41 import DAY_41_DATA

parts = DAY_41_DATA['parts']
print('Day 41 parts count:', len(parts))
total_words = 0
for i, p in enumerate(parts):
    wc = len(' '.join(p['say']).split())
    total_words += wc
    code = p.get('code', '')
    expected_out = p.get('output', '').strip()
    res = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)
    actual_out = res.stdout.strip()
    match = (actual_out == expected_out)
    print(f"Part {i+1}: {wc} words | code exit: {res.returncode} | out match: {match} ({len(actual_out)} chars)")
    if not match:
        print(f"  Expected: {expected_out[:80]}")
        print(f"  Actual:   {actual_out[:80]}")

print(f"Day 41 Total Words: {total_words}")
