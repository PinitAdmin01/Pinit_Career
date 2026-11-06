import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day54.json', 'r', encoding='utf-8') as f:
    day54 = json.load(f)

day54['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 54 isn't already present
if '"day": 54' in content or 'day: 54' in content:
    print("Day 54 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day54 as pretty JSON indented by 2 spaces
day54_str = json.dumps(day54, indent=2)
indented_day54 = '\n'.join('  ' + line for line in day54_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day54 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 54 to src/lib/data/cloudWebLongLessons.ts!")
