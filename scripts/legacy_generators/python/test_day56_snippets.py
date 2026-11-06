import subprocess
import os
import sys

sys.path.insert(0, os.path.abspath('.'))
from scripts.design_day56_data import DAY_56

os.makedirs('temp_snippets', exist_ok=True)

for i, part in enumerate(DAY_56['parts'], 1):
    code = part['code']
    expected_output = part['output'].strip()
    
    file_path = f'temp_snippets/day56_p{i}.ts'
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
        
    res = subprocess.run(['npx', 'tsx', file_path], capture_output=True, text=True, shell=True)
    actual_output = res.stdout.strip()
    
    print(f"=== Day 56 Part {i} ===")
    if res.returncode != 0:
        print(f"ERROR: {res.stderr}")
        sys.exit(1)
        
    if actual_output == expected_output:
        print("MATCH! Output verified.")
    else:
        print("MISMATCH!")
        print("Expected:\n", expected_output)
        print("Actual:\n", actual_output)
        # Update part['output'] if needed
        part['output'] = actual_output

print("All Day 56 snippets executed cleanly!")
