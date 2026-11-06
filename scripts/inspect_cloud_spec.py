import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/visuals/cloud-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find block 7 specs
idx = text.find('Day 31')
if idx != -1:
    print(text[idx-100:idx+3000])
else:
    print("Day 31 not found, printing occurrences:")
    for line in text.splitlines():
        if '31' in line or 'Block 7' in line or 'BLOCK_7' in line or 'Block7' in line:
            print(line)
