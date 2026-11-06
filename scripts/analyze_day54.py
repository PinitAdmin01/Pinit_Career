import sys, json
sys.stdout.reconfigure(encoding='utf-8')

# Read day54_builder.py and find the say arrays
lines = open('scripts/day54_builder.py', 'r', encoding='utf-8').readlines()

# Find "say" array start lines
for i, line in enumerate(lines):
    stripped = line.strip()
    if '"say"' in stripped and '[' in stripped:
        print(f'Line {i+1}: {stripped[:80]}')
    if '"title"' in stripped and 'Part' not in stripped and 'Masterclass' not in stripped:
        if 'Fiduciary' in stripped or 'Mathematical' in stripped or 'Explainable' in stripped or 'Local' in stripped or 'Masterclass' in stripped:
            print(f'  PART TITLE Line {i+1}: {stripped[:100]}')

# Count words in each part's say array
# Simpler approach: just run the builder in dry-run mode counting words
exec_code = """
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# Import the build function but don't assert
exec(open('scripts/day54_builder.py','r',encoding='utf-8').read().replace('assert words >= 600', '# assert words >= 600').replace('d54 = build_day54()', ''))
d54 = build_day54()
for i, part in enumerate(d54['parts']):
    say_text = ' '.join(part['say']) if isinstance(part['say'], list) else part['say']
    words = len(say_text.split())
    deficit = max(0, 600 - words)
    print(f'Part {i+1} ({part["title"][:60]}...): {words} words, deficit: {deficit}')
"""
print('\n--- Word count analysis ---')
import subprocess
r = subprocess.run([sys.executable, '-c', exec_code], capture_output=True, text=True, encoding='utf-8')
print(r.stdout)
if r.stderr:
    print('STDERR:', r.stderr[:500])
