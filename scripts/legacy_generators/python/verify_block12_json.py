import json, subprocess

days = [56, 57, 58, 59, 60]

for day_num in days:
    with open(f'scripts/react_day{day_num}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    assert data['day'] == day_num, f"Day {day_num} day number mismatch: {data['day']}"
    assert len(data['parts']) == 5, f"Day {day_num} does not have 5 parts: {len(data['parts'])}"
    
    expected_minutes = 40 if day_num == 60 else 38
    assert data['minutes'] == expected_minutes, f"Day {day_num} minutes mismatch: {data['minutes']} vs {expected_minutes}"
    
    # Check forbidden keys
    for k in ['course', 'track', 'declaredMinutes']:
        assert k not in data, f"Day {day_num} has forbidden top-level key: {k}"
    
    assert 'title' in data['projectStep'] and 'steps' in data['projectStep']
    assert 'desc' not in data['projectStep'], f"Day {day_num} projectStep has forbidden 'desc'"
    
    total_words = 0
    for idx, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say'])
        total_words += words
        assert words >= 580, f"Day {day_num} Part {idx+1} has {words} words (< 580)"
        
        # Check forbidden part keys
        for pk in ['id', 'part']:
            assert pk not in p, f"Day {day_num} Part {idx+1} has forbidden key: {pk}"
            
        # Check check format
        chk = p['check']
        assert 'question' in chk and 'options' in chk and 'answer' in chk and 'why' in chk
        assert len(chk['options']) >= 2, f"Day {day_num} Part {idx+1} check options < 2"
        assert chk['answer'] == 0, f"Day {day_num} Part {idx+1} check answer is not 0"
        
        # Check code in node
        res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
        actual = res.stdout.strip()
        expected = p['output'].strip()
        assert actual == expected, f"Day {day_num} Part {idx+1} code mismatch:\nActual:\n{actual}\nExpected:\n{expected}"
    
    assert total_words >= 2900, f"Day {day_num} total words {total_words} < 2900"
    print(f"Day {day_num} VERIFIED: {len(data['parts'])} parts, {total_words} words, 5/5 codes pass, {data['minutes']} mins.")

print("ALL 5 DAYS (56-60) FULLY VERIFIED ACCORDING TO ALL INVARIANTS!")
