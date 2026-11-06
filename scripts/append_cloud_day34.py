import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day34_cloud.json', 'r', encoding='utf-8') as f:
    day34 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day34['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 34 isn't already present
if '"day": 34' in content or 'day: 34' in content:
    print("Day 34 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day34 as pretty JSON indented by 2 spaces
day34_str = json.dumps(day34, indent=2)
# Indent the whole object by 2 spaces
indented_day34 = '\n'.join('  ' + line for line in day34_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day34 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 34 to src/lib/data/cloudWebLongLessons.ts!")
