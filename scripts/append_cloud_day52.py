import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day52.json', 'r', encoding='utf-8') as f:
    day52 = json.load(f)

day52['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 52 isn't already present
if '"day": 52' in content or 'day: 52' in content:
    print("Day 52 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day52 as pretty JSON indented by 2 spaces
day52_str = json.dumps(day52, indent=2)
indented_day52 = '\n'.join('  ' + line for line in day52_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day52 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 52 to src/lib/data/cloudWebLongLessons.ts!")
