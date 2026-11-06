import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day39_cloud.json', 'r', encoding='utf-8') as f:
    day39 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day39['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 39 isn't already present
if '"day": 39' in content or 'day: 39' in content:
    print("Day 39 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day39 as pretty JSON indented by 2 spaces
day39_str = json.dumps(day39, indent=2)
# Indent the whole object by 2 spaces
indented_day39 = '\n'.join('  ' + line for line in day39_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day39 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 39 to src/lib/data/cloudWebLongLessons.ts!")
