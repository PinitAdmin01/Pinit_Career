import re
import json

with open('scripts/mobile_days36_40_snippets.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"capture\('(m\d+p\d+)', \(\) => \{\n([\s\S]*?)\n\}\);"
matches = re.findall(pattern, text)
res = {}
for name, body in matches:
    lines = body.split('\n')
    unindented = []
    for line in lines:
        if line.startswith('  '):
            unindented.append(line[2:])
        else:
            unindented.append(line)
    res[name] = '\n'.join(unindented)

with open('scripts/mobile_days36_40_snippets_dict.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, indent=2)

print('Saved', len(res), 'snippets')
