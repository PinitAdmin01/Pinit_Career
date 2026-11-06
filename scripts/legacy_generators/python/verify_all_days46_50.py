# scripts/verify_all_days46_50.py
import json, subprocess

for d in range(46, 51):
    path = f'scripts/react_day{d}.json'
    data = json.load(open(path, 'r', encoding='utf-8'))
    words = [sum(len(s.split()) for s in p['say']) for p in data['parts']]
    total = sum(words)
    print(f'Day {d}: Total={total}, min={min(words)}, words={words}')
    assert total >= 2900, f'Day {d} total words < 2900: {total}'
    for i, w in enumerate(words):
        assert w >= 580, f'Day {d} part {i+1} words < 580: {w}'
    
    # Test all 5 codes
    for i, p in enumerate(data['parts']):
        res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
        actual = res.stdout.strip()
        expected = p['output'].strip()
        assert actual == expected, f'Day {d} Part {i+1} code output mismatch!\nActual:\n{actual}\nExpected:\n{expected}'
    print(f'Day {d}: 5/5 codes verified!')
print('\nALL DAYS 46-50 THOROUGHLY VERIFIED!')
