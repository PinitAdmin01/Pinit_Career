import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('### Course 37:')
if idx != -1:
    print(text[idx:idx+2500])
