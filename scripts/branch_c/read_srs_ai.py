with open('docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'Course 12|Applied AI', text, re.IGNORECASE)]
print(f"Found {len(matches)} matches")
for pos in matches[:5]:
    print(text[max(0, pos-100):min(len(text), pos+600)])
    print("="*60)
