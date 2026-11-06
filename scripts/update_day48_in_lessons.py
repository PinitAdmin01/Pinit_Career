import json

with open('scripts/day48_cloud.json', 'r', encoding='utf-8') as f:
    day48 = json.load(f)

day48['coursePrefix'] = 'cloud'

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

marker = '"day": 48'
idx48 = content.find(marker)
if idx48 == -1:
    marker = 'day: 48'
    idx48 = content.find(marker)

if idx48 != -1:
    start_idx = content.rfind('{', 0, idx48)
    last_idx = content.rfind('];')
    content_before = content[:start_idx].rstrip()
    if content_before.endswith(','):
        content_before = content_before[:-1].rstrip()
    
    day48_str = json.dumps(day48, indent=2)
    indented = '\n'.join('  ' + line for line in day48_str.splitlines())
    new_content = content_before + ',\n' + indented + '\n];\n'
    with open('src/lib/data/cloudWebLongLessons.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully updated Day 48 in cloudWebLongLessons.ts!')
else:
    print('Day 48 not found in file!')
