import re

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\scripts\visuals\ai-prompt-masterclass-spec.ts', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'"id":\s*"Q33\.(\d+)"', text):
    num = int(m.group(1))
    if 30 <= num <= 50:
        start = max(0, m.start() - 50)
        end = min(len(text), m.end() + 250)
        print(f"=== Q33.{num} ===")
        print(text[start:end])
