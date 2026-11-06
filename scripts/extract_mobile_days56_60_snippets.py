import json
import re

with open('scripts/mobile_days56_60_snippets.ts', 'r', encoding='utf-8') as f:
    text = f.read()

snippets = {}
pattern = r"capture\('([^']+)',\s*\(\)\s*=>\s*\{([\s\S]*?)\n\}\);"
matches = re.findall(pattern, text)

for key, body in matches:
    lines = body.split('\n')
    clean_lines = []
    for line in lines:
        if line.startswith('  '):
            clean_lines.append(line[2:])
        else:
            clean_lines.append(line)
    snippets[key] = '\n'.join(clean_lines).strip()

print(f"Extracted {len(snippets)} snippets")
with open('scripts/mobile_days56_60_snippets_dict.json', 'w', encoding='utf-8') as f:
    json.dump(snippets, f, indent=2)

print("Saved to scripts/mobile_days56_60_snippets_dict.json")
