import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Total lines in cloudWebLongLessons.ts:', len(lines))
print(''.join(lines[-25:]))
