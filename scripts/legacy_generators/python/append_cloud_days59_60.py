import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/cloud_day59.json', 'r', encoding='utf-8') as f:
    day59 = json.load(f)
day59['coursePrefix'] = 'cloud'

with open('scripts/cloud_day60.json', 'r', encoding='utf-8') as f:
    day60 = json.load(f)
day60['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify Day 59 and 60 aren't already present
if '"day": 59' in content:
    print("Day 59 already present!")
    sys.exit(0)

# Find the last closing bracket '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in cloudWebLongLessons.ts")
    sys.exit(1)

# Format day59 and day60 as pretty JSON indented by 2 spaces
day59_str = json.dumps(day59, indent=2)
indented_day59 = '\n'.join('  ' + line for line in day59_str.splitlines())

day60_str = json.dumps(day60, indent=2)
indented_day60 = '\n'.join('  ' + line for line in day60_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day59 + ',\n' + indented_day60 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Day 59 and Day 60 to src/lib/data/cloudWebLongLessons.ts!")
