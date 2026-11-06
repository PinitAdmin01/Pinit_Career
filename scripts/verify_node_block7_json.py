import json, subprocess

days = [31, 32, 33, 34, 35]
all_passed = True

for d in days:
    path = f'scripts/node_day{d}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n--- Verifying Day {d}: {data.get('title')} ---")
    assert data.get('day') == d, f"Day {d} mismatch in 'day' field!"
    assert data.get('minutes') == (40 if d == 35 else 38), f"Day {d} minutes invalid: {data.get('minutes')}"
    assert isinstance(data.get('summary'), list), f"Day {d} summary must be a list!"
    assert len(data['summary']) >= 4, f"Day {d} summary must have >= 4 bullets!"
    
    ps = data.get('projectStep')
    assert isinstance(ps, dict), f"Day {d} projectStep must be dict!"
    assert 'title' in ps and 'steps' in ps, f"Day {d} projectStep missing title/steps!"
    assert 'desc' not in ps, f"Day {d} projectStep must NOT have 'desc'!"
    assert len(ps['steps']) >= 3, f"Day {d} projectStep must have >= 3 steps!"
    
    parts = data.get('parts', [])
    assert len(parts) == 5, f"Day {d} must have exactly 5 parts, found {len(parts)}!"
    
    day_words = 0
    for idx, p in enumerate(parts):
        assert isinstance(p.get('say'), list), f"Day {d} Part {idx+1} say must be list!"
        words = sum(len(s.split()) for s in p['say'])
        day_words += words
        assert words >= 580, f"Day {d} Part {idx+1} has {words} words, expected >= 580!"
        
        # Check answer
        check = p.get('check', {})
        assert check.get('answer') == 0, f"Day {d} Part {idx+1} check answer must be 0!"
        assert len(check.get('options', [])) >= 2, f"Day {d} Part {idx+1} check options must be >= 2!"
        
        # Test code execution
        code = p.get('code', '')
        res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
        actual = res.stdout.strip()
        expected = p.get('output', '').strip()
        assert actual == expected, f"Day {d} Part {idx+1} code mismatch!\nActual:\n{actual}\nExpected:\n{expected}"
        print(f"  Part {idx+1}: {words} words | check ans=0 | code PASS")
    
    print(f"Total Day {d} words: {day_words} (>= 2900: {day_words >= 2900})")
    assert day_words >= 2900, f"Day {d} total words {day_words} < 2900!"

print("\n=======================================================")
print("ALL BLOCK 7 DAYS (31-35) FULLY VERIFIED AND CERTIFIED!")
print("=======================================================")
