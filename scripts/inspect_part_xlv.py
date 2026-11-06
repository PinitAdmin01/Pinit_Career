import sys

with open('docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('## 4. Part XLV: Multi-Branch')
chunk = text[idx:idx+3500].encode('ascii', errors='replace').decode('ascii')
print(chunk)
