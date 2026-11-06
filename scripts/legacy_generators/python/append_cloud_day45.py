import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day45_cloud.json', 'r', encoding='utf-8') as f:
    day45 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day45['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 45 isn't already present
if '"day": 45' in content or 'day: 45' in content:
    print("Day 45 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day45 as pretty JSON indented by 2 spaces
day45_str = json.dumps(day45, indent=2)
# Indent the whole object by 2 spaces
indented_day45 = '\n'.join('  ' + line for line in day45_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day45 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 45 to src/lib/data/cloudWebLongLessons.ts!")
