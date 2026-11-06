import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Locate where Day 52 starts
marker = '"day": 52'
idx = content.find(marker)
if idx != -1:
    # Find the start of the object before "day": 52
    obj_start = content.rfind('{', 0, idx)
    # The new content should truncate at obj_start
    # check for preceding comma
    comma_idx = content.rfind(',', 0, obj_start)
    if comma_idx != -1:
        truncated = content[:comma_idx] + '\n];\n'
    else:
        truncated = content[:obj_start] + '];\n'
    content = truncated

with open('scripts/cloud_day52.json', 'r', encoding='utf-8') as f:
    day52 = json.load(f)

day52['coursePrefix'] = 'cloud'

idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];'")
    sys.exit(1)

day52_str = json.dumps(day52, indent=2)
indented_day52 = '\n'.join('  ' + line for line in day52_str.splitlines())

new_content = content[:idx].rstrip() + ',\n' + indented_day52 + '\n];\n'

with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully refreshed Day 52 in cloudWebLongLessons.ts!")
