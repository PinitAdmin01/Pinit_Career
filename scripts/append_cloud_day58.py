import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day58.json', 'r', encoding='utf-8') as f:
    day58 = json.load(f)

day58['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 58 isn't already present
if '"day": 58' in content or 'day: 58' in content:
    print("Day 58 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day58 as pretty JSON indented by 2 spaces
day58_str = json.dumps(day58, indent=2)
indented_day58 = '\n'.join('  ' + line for line in day58_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day58 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 58 to src/lib/data/cloudWebLongLessons.ts!")
