# scripts/fix_day46_snippets.py
import sys
sys.path.insert(0, 'scripts')
from design_day46_data import DAY_46
import json

# Replace .toLocaleString() with .toLocaleString('en-US') in Part 1
DAY_46['parts'][0]['code'] = DAY_46['parts'][0]['code'].replace('.toLocaleString()', ".toLocaleString('en-US')")

# Update Part 2 expected output
part2_output = """Total Grid Canvas: 7000px wide x 3200000px tall
Active Row Slice: 4998 to 5017
Active Col Slice: 11 to 20
Active Rendered DOM Cells: 200 cells (Out of 5,000,000 total)"""

DAY_46['parts'][1]['output'] = part2_output

with open('scripts/design_day46_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day46_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_46 = ' + json.dumps(DAY_46, indent=2) + '\n')

print('Cleanly updated Day 46 snippets!')
