import re
import json

with open('scripts/java_days56_60_snippets.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"capture\('([^']+)', \(\) => \{\n(.*?)\n\}\);"
matches = re.findall(pattern, text, re.DOTALL)
print(f'Total captured snippets: {len(matches)}')

snippets = {}
for k, body in matches:
    snippets[k] = body

with open('scripts/java_days56_60_snippets_dict.json', 'w', encoding='utf-8') as f:
    json.dump(snippets, f, indent=2)

print('Wrote scripts/java_days56_60_snippets_dict.json successfully!')
