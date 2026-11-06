import re

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove '"id": "...",\n' or '"id": "..."'
cleaned = re.sub(r'^\s*"id":\s*"[^"]*",?\s*$', '', text, flags=re.MULTILINE)

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(cleaned)

print("Removed all part 'id' fields from designWebLongLessons.ts.")
