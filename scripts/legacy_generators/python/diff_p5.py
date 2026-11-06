import subprocess
import tempfile
import os
from design_day36_data import DAY_36

p = DAY_36['parts'][4]
code = p['code']
with tempfile.NamedTemporaryFile(suffix='.ts', mode='w', delete=False, encoding='utf-8') as f:
    f.write(code)
    temp_name = f.name

res = subprocess.run(f"npx tsx {temp_name}", shell=True, capture_output=True, text=True, encoding='utf-8')
print("RETURN CODE:", res.returncode)
actual = res.stdout.strip()
expected = p['output'].strip()

with open('scripts/p5_actual.txt', 'w', encoding='utf-8') as out_f:
    out_f.write(actual)
with open('scripts/p5_expected.txt', 'w', encoding='utf-8') as exp_f:
    exp_f.write(expected)

print("Actual length:", len(actual), "Expected length:", len(expected))
print("Match?", actual == expected)
if actual != expected:
    import difflib
    diff = difflib.unified_diff(expected.splitlines(), actual.splitlines(), lineterm='')
    print('\n'.join(diff))
