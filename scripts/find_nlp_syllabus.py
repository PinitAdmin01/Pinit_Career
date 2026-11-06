import sys
import re

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Find matches for course-nlp or Block 9
for m in re.finditer(r'course-nlp.*?(?=###|\Z)', text, re.DOTALL):
    snippet = m.group(0)
    if 'Block 9' in snippet or 'Days 41' in snippet or 'Alignment' in snippet:
        print(snippet[:1200])
        print("="*60)
