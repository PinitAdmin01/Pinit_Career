with open('scripts/build_day49_py.py', 'r', encoding='utf-8') as f:
    text = f.read()

import sys
sys.path.append('scripts')
from design_day49_data import DAY_49

print("=== PART 2 CODE ===")
print(DAY_49['parts'][1]['code'])

print("=== PART 5 CODE ===")
print(DAY_49['parts'][4]['code'])
