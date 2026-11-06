with open('docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'Branch [A-Z]', text))
print("Branch occurrences in Master SRS:", len(matches))
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(text), m.end() + 250)
    print(text[start:end])
    print('='*50)
