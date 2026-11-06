import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day48_cloud.json', 'r', encoding='utf-8') as f:
    day48 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day48['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 48 isn't already present
if '"day": 48' in content or 'day: 48' in content:
    print("Day 48 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day48 as pretty JSON indented by 2 spaces
day48_str = json.dumps(day48, indent=2)
# Indent the whole object by 2 spaces
indented_day48 = '\n'.join('  ' + line for line in day48_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day48 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 48 to src/lib/data/cloudWebLongLessons.ts!")
