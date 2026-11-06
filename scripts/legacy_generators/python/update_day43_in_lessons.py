import json
import re

with open('scripts/day43_cloud.json', 'r', encoding='utf-8') as f:
    day43 = json.load(f)

day43['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find Day 43 in content
# Locate '"day": 43' or 'day: 43'
idx = content.find('"day": 43')
if idx == -1:
    idx = content.find('day: 43')

if idx == -1:
    print("Day 43 not found, using append logic")
    idx_end = content.rfind('];')
    day43_str = json.dumps(day43, indent=2)
    indented = '\n'.join('  ' + line for line in day43_str.splitlines())
    new_content = content[:idx_end].rstrip() + ',\n' + indented + '\n];\n'
else:
    print("Day 43 found, replacing it")
    # find starting '{' before idx
    start_bracket = content.rfind('{', 0, idx)
    # find ending '}' for this day object
    # Since Day 43 is currently the last object, it ends before '];'
    end_bracket = content.find('\n];', start_bracket)
    # let's be precise: find the closing '}' that corresponds to start_bracket
    # or find ',\n  {\n    "day": 43'
    day43_str = json.dumps(day43, indent=2)
    indented = '\n'.join('  ' + line for line in day43_str.splitlines())
    new_content = content[:start_bracket] + indented + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Day 43 replaced successfully in cloudWebLongLessons.ts!")
