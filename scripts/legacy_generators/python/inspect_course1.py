import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as fh:
    lines = fh.readlines()

current_day = None
for line in lines:
    line_s = line.strip()
    if line_s.startswith('"day":'):
        current_day = line_s
    elif line_s.startswith('"title":') and current_day is not None:
        print(f"{current_day} | {line_s}")
        current_day = None
