import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('src/lib/data/promptPythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('"day": 30')
if idx != -1:
    print(text[idx-50:idx+2500])
