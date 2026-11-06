import subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
from react_day31_data import day31

print(f"Testing code snippets for Day {day31['day']}...")
for i, p in enumerate(day31['parts']):
    code = p['code']
    expected = p['output']
    proc = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if proc.returncode != 0:
        print(f"FAILED Part {i+1} execution: {proc.stderr}")
        sys.exit(1)
    actual = proc.stdout.replace('\r\n', '\n').strip()
    expected_clean = expected.replace('\r\n', '\n').strip()
    if actual != expected_clean:
        print(f"MISMATCH Part {i+1}:")
        print(f"ACTUAL:\n{repr(actual)}")
        print(f"EXPECTED:\n{repr(expected_clean)}")
        sys.exit(1)
    print(f"Part {i+1} code output verified!")

print("All Day 31 code snippets match perfectly!")
