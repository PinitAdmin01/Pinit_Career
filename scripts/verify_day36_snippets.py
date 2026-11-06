import subprocess
import tempfile
import os
from design_day36_data import DAY_36

for i, p in enumerate(DAY_36['parts']):
    code = p['code']
    expected_out = p['output'].strip()
    
    with tempfile.NamedTemporaryFile(suffix='.ts', mode='w', delete=False, encoding='utf-8') as f:
        f.write(code)
        temp_name = f.name
        
    try:
        res = subprocess.run(f"npx tsx {temp_name}", shell=True, capture_output=True, text=True, encoding='utf-8')
        if res.returncode != 0:
            print(f"FAILED Part {i+1} compilation:")
            print(res.stderr)
            exit(1)
        actual_out = res.stdout.strip()
        if actual_out != expected_out:
            print(f"MISMATCH in Part {i+1}:")
            print("REPR EXPECTED:", repr(expected_out))
            print("REPR ACTUAL:  ", repr(actual_out))
        else:
            print(f"Part {i+1} TS snippet PASSED exact match!")
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

print("Checking finished.")
