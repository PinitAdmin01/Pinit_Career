import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('.'))
from scripts.design_day60_data import DAY_60

os.makedirs('temp_snippets', exist_ok=True)

outputs = {}

for i, part in enumerate(DAY_60['parts'], 1):
    code = part['code']
    file_path = f'temp_snippets/day60_p{i}.ts'
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
        
    res = subprocess.run(['npx', 'tsx', file_path], capture_output=True, text=True, encoding='utf-8', shell=True)
    if res.returncode != 0:
        print(f"ERROR in Part {i}: {res.stderr}")
        sys.exit(1)
        
    actual = res.stdout.strip()
    outputs[i] = actual
    part['output'] = actual
    print(f"=== Day 60 Part {i} Output ===")
    print(actual)

# Save back to design_day60_data.py
with open('scripts/design_day60_data.py', 'w', encoding='utf-8') as f:
    f.write('''# scripts/design_day60_data.py
import re
import sys

def count_words(text_list):
    words = len(re.findall(r'\\b[A-Za-z0-9_\\-\\.\\$\\/:\\@\\\']+\\b', ' '.join(text_list)))
    return words

DAY_60 = ''' + repr(DAY_60) + '''

if __name__ == '__main__':
    print(f"Day 60: {DAY_60['title']}")
    for i, p in enumerate(DAY_60['parts'], 1):
        w = count_words(p['say'])
        print(f"  Part {i}: {w} words")
        assert w >= 600, f"Part {i} has {w} words (< 600)"
    print("Day 60 verification complete!")
''')

print("\nAll 5 Day 60 snippets successfully executed and synchronized with design_day60_data.py!")
