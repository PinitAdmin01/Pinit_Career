import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('export interface LongLesson')
if idx != -1:
    print(text[idx:idx+2000])
else:
    print("Interface not found directly, showing first 50 lines:")
    print('\n'.join(text.splitlines()[:50]))
