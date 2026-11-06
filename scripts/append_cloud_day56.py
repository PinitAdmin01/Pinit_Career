import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day56.json', 'r', encoding='utf-8') as f:
    day56 = json.load(f)

day56['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 56 isn't already present
if '"day": 56' in content or 'day: 56' in content:
    print("Day 56 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day56 as pretty JSON indented by 2 spaces
day56_str = json.dumps(day56, indent=2)
indented_day56 = '\n'.join('  ' + line for line in day56_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day56 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 56 to src/lib/data/cloudWebLongLessons.ts!")
