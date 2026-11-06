import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/web_track_long_lessons.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.splitlines():
    if 'cloud' in line.lower() or 'run' in line.lower() or 'sandbox' in line.lower():
        print(line[:120])
