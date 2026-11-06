import re
import sys
import os

sys.path.insert(0, os.path.abspath('.'))

with open('scripts/design_day58_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

text_clean = text.replace('assert w >= 600', '# assert w >= 600')
locs = {}
exec(text_clean, globals(), locs)
DAY_58 = locs['DAY_58']

for i, p in enumerate(DAY_58['parts'], 1):
    w = len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', ' '.join(p['say'])))
    print(f"Part {i}: {w} words")
