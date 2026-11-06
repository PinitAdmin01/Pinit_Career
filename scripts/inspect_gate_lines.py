import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/lesson_visuals_gate.test.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    print(''.join(lines[25:75]))
