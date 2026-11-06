import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day57.json', 'r', encoding='utf-8') as f:
    day57 = json.load(f)

day57['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 57 isn't already present
if '"day": 57' in content or 'day: 57' in content:
    print("Day 57 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day57 as pretty JSON indented by 2 spaces
day57_str = json.dumps(day57, indent=2)
indented_day57 = '\n'.join('  ' + line for line in day57_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day57 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 57 to src/lib/data/cloudWebLongLessons.ts!")
