import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/web_track_long_lessons.test.ts', 'r', encoding='utf-8') as f:
    for line in f.readlines()[:20]:
        print(line.strip())
