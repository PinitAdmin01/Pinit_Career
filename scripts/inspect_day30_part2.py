import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 30')
print(text[idx+2500:idx+5000])
