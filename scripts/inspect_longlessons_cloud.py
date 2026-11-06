import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.splitlines():
    if 'cloud' in line.lower():
        print(line)
