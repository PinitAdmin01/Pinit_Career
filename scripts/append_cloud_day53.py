import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day53.json', 'r', encoding='utf-8') as f:
    day53 = json.load(f)

day53['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 53 isn't already present
if '"day": 53' in content or 'day: 53' in content:
    print("Day 53 already present in cloudWebLongLessons.ts!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day53 as pretty JSON indented by 2 spaces
day53_str = json.dumps(day53, indent=2)
indented_day53 = '\n'.join('  ' + line for line in day53_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day53 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 53 to src/lib/data/cloudWebLongLessons.ts!")
