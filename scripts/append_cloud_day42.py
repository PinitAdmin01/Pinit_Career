import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day42_cloud.json', 'r', encoding='utf-8') as f:
    day42 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day42['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 42 isn't already present
if '"day": 42' in content or 'day: 42' in content:
    print("Day 42 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day42 as pretty JSON indented by 2 spaces
day42_str = json.dumps(day42, indent=2)
# Indent the whole object by 2 spaces
indented_day42 = '\n'.join('  ' + line for line in day42_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day42 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 42 to src/lib/data/cloudWebLongLessons.ts!")
