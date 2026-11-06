with open('scripts/g3d_day56_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Day 56 keys:", [p for p in text.splitlines() if '"part":' in p or '"title":' in p or '"example":' in p][:15])
