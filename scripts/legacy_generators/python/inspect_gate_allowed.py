import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/visuals/gate.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('COURSE_ALLOWED_TEMPLATES')
if idx != -1:
    print(text[idx:idx+2500])
