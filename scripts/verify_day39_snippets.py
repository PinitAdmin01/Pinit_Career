import subprocess
import tempfile
import os
from design_day39_data import DAY_39

for i, p in enumerate(DAY_39['parts']):
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
        else:
            actual_out = res.stdout.strip()
            if actual_out != expected_out:
                print(f"MISMATCH in Part {i+1}:")
                print("EXPECTED:")
                print(expected_out)
                print("ACTUAL:")
                print(actual_out)
                # auto-patch output in memory
                p['output'] = actual_out
            else:
                print(f"Part {i+1} TS snippet PASSED exact match!")
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

print("DAY 39 CHECK COMPLETE!")
