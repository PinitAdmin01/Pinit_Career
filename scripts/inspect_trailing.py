import json
import re

with open('src/lib/data/devopsWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Check where DEVOPS_WEB_LONG_LESSONS ends
last_idx = text.rfind('];')
print(f"File length: {len(text)}, last '];' at index: {last_idx}")
print("Trailing 100 chars before '];':")
print(repr(text[last_idx-100:last_idx]))
