# scripts/verify_day48_snippets.py
import sys
import subprocess
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')
from design_day48_data import DAY_48

temp_dir = 'temp_snippets'
os.makedirs(temp_dir, exist_ok=True)

all_passed = True

for i, part in enumerate(DAY_48['parts']):
    snippet_path = os.path.join(temp_dir, f'day48_part{i+1}.ts')
    with open(snippet_path, 'w', encoding='utf-8') as f:
        f.write(part['code'])
    
    res = subprocess.run(['npx', 'tsx', snippet_path], capture_output=True, text=True, encoding='utf-8', shell=True)
    if res.returncode != 0:
        print(f"❌ Day 48 Part {i+1} compilation/execution failed:")
        print(res.stderr)
        all_passed = False
    else:
        actual_output = res.stdout.strip().replace('\r\n', '\n')
        expected_output = part['output'].strip().replace('\r\n', '\n')
        if actual_output == expected_output:
            print(f"✅ Day 48 Part {i+1} snippet executed and matched expected output perfectly.")
        else:
            print(f"⚠️ Day 48 Part {i+1} output mismatch:")
            print("ACTUAL:")
            print(actual_output)
            print("EXPECTED:")
            print(expected_output)
            all_passed = False

if all_passed:
    print("\n🎉 ALL 5 SNIPPETS FOR DAY 48 COMPILED & EXECUTED WITH ZERO ERRORS!")
else:
    sys.exit(1)
