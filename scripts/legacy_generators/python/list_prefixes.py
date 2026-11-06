import re

with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const LONG_LESSON_SOURCES:[^=]+=\s*\{([^}]+)\};', text, re.DOTALL)
if m:
    entries = re.findall(r'[\'"]?([a-zA-Z0-9_-]+)[\'"]?\s*:', m.group(1))
    print(f'Total prefixes: {len(entries)}')
    print(entries)
