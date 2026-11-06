import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day36_cloud.json', 'r', encoding='utf-8') as f:
    day36 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day36['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 36 isn't already present
if '"day": 36' in content or 'day: 36' in content:
    print("Day 36 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day36 as pretty JSON indented by 2 spaces
day36_str = json.dumps(day36, indent=2)
# Indent the whole object by 2 spaces
indented_day36 = '\n'.join('  ' + line for line in day36_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day36 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 36 to src/lib/data/cloudWebLongLessons.ts!")
