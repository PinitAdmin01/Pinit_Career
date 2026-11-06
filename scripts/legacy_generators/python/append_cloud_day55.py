import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day55.json', 'r', encoding='utf-8') as f:
    day55 = json.load(f)

day55['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 55 isn't already present
if '"day": 55' in content or 'day: 55' in content:
    print("Day 55 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day55 as pretty JSON indented by 2 spaces
day55_str = json.dumps(day55, indent=2)
indented_day55 = '\n'.join('  ' + line for line in day55_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day55 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 55 to src/lib/data/cloudWebLongLessons.ts!")
