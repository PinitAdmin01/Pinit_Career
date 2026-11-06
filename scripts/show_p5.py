import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day31.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'p5_say = [' in line:
        print(''.join(lines[i:i+30]))
        break
