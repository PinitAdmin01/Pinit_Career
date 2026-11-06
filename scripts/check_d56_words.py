import re
import sys

with open('scripts/design_day56_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

from scripts.design_day56_data import DAY_56

for i, p in enumerate(DAY_56['parts'], 1):
    words = len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', ' '.join(p['say'])))
    print(f"Part {i}: {words} words")
