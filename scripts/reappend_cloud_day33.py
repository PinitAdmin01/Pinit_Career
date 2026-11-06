import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day33_cloud.json', 'r', encoding='utf-8') as f:
    day33 = json.load(f)

day33['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where day 33 starts
marker = '{\n    "day": 33,'
if marker not in content:
    # try with 2 spaces
    marker = '{\n  "day": 33,'

idx = content.find(marker)
if idx == -1:
    # try any "day": 33
    idx = content.find('"day": 33')
    if idx != -1:
        # find the preceding '{'
        idx = content.rfind('{', 0, idx)

if idx == -1:
    print("Could not find Day 33 in cloudWebLongLessons.ts")
    sys.exit(1)

# Day 33 was appended at the end before '];'
# So from idx to the end of the file is Day 33
prefix = content[:idx].rstrip()
if prefix.endswith(','):
    prefix = prefix[:-1].rstrip()

# Format clean day33 as pretty JSON indented by 2 spaces
day33_str = json.dumps(day33, indent=2)
indented_day33 = '\n'.join('  ' + line for line in day33_str.splitlines())

new_content = prefix + ',\n' + indented_day33 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced Day 33 with clean object in cloudWebLongLessons.ts")
