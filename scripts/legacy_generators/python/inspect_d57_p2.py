with open('scripts/design_day57_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

import os, sys
sys.path.insert(0, os.path.abspath('.'))
from scripts.design_day57_data import DAY_57

code = DAY_57['parts'][1]['code']
lines = code.split('\n')
for i, l in enumerate(lines):
    if 'RegExp' in l:
        print(f"Line {i+1}: {repr(l)}")
