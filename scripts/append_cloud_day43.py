import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day43_cloud.json', 'r', encoding='utf-8') as f:
    day43 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day43['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 43 isn't already present
if '"day": 43' in content or 'day: 43' in content:
    print("Day 43 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day43 as pretty JSON indented by 2 spaces
day43_str = json.dumps(day43, indent=2)
# Indent the whole object by 2 spaces
indented_day43 = '\n'.join('  ' + line for line in day43_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day43 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 43 to src/lib/data/cloudWebLongLessons.ts!")
