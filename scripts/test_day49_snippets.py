import sys
import subprocess
import tempfile
import os
sys.path.append('scripts')
from design_day49_data import DAY_49

for idx, p in enumerate(DAY_49['parts']):
    code = p.get('code', '')
    with tempfile.NamedTemporaryFile(suffix='.ts', delete=False, mode='w', encoding='utf-8') as tf:
        tf.write(code)
        temp_name = tf.name
    try:
        res = subprocess.run(['npx', 'tsx', temp_name], capture_output=True, text=True, shell=True)
        print(f"=== PART {idx+1} ===")
        print("Exit code:", res.returncode)
        if res.returncode != 0:
            print("STDERR:", res.stderr)
        else:
            print("STDOUT:\n" + res.stdout)
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)
