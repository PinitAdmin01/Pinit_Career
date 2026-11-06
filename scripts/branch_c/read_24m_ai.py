with open('docs/pinitcareer-24month-master-curriculum.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'Course 12|course-ai-eng|AI Engineering', text, re.IGNORECASE)]
for pos in matches[:5]:
    print(text[max(0, pos-100):min(len(text), pos+600)])
    print("="*60)
