import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomAnaLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'(?:[\'"]day[\'"]|\bday)\s*:\s*(\d+)', text)]
print('bcomAna on main has days:', sorted(list(set(days))))
