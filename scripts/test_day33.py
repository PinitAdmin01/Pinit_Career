import subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
from react_day33_data import day33

print(f"Day {day33['day']}: {day33['title']}")
total_words = 0
for i, p in enumerate(day33['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

print(f"Total words: {total_words}")

# Test code snippets
print(f"Testing code snippets for Day {day33['day']}...")
for i, p in enumerate(day33['parts']):
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

print("Day 33 verified successfully!")
