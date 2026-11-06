import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day47_cloud.json', 'r', encoding='utf-8') as f:
    day47 = json.load(f)

# Ensure coursePrefix: 'cloud' is present
day47['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 47 isn't already present
if '"day": 47' in content or 'day: 47' in content:
    print("Day 47 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day47 as pretty JSON indented by 2 spaces
day47_str = json.dumps(day47, indent=2)
# Indent the whole object by 2 spaces
indented_day47 = '\n'.join('  ' + line for line in day47_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day47 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 47 to src/lib/data/cloudWebLongLessons.ts!")
