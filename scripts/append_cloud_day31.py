import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day31_cloud.json', 'r', encoding='utf-8') as f:
    day31 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day31['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 31 isn't already present
if '"day": 31' in content or 'day: 31' in content:
    print("Day 31 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day31 as pretty JSON indented by 2 spaces
day31_str = json.dumps(day31, indent=2)
# Indent the whole object by 2 spaces
indented_day31 = '\n'.join('  ' + line for line in day31_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day31 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 31 to src/lib/data/cloudWebLongLessons.ts!")
