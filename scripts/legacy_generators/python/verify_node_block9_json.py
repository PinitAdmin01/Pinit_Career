import json, os, subprocess

days = [41, 42, 43, 44, 45]
allowed_templates = ['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states']

for d in days:
    path = f'scripts/node_day{d}.json'
    assert os.path.exists(path), f"File {path} missing!"
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    assert data['day'] == d, f"Day mismatch in {path}: expected {d}, got {data['day']}"
    assert len(data['parts']) == 5, f"Day {d} must have exactly 5 parts, got {len(data['parts'])}"
    
    total_words = 0
    for p_idx, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say'])
        total_words += words
        assert words >= 580, f"Day {d} Part {p_idx+1} has {words} words (< 580)!"
        
        # Test code in node
        code = p['code']
        assert code and len(code.strip()) > 0, f"Day {d} Part {p_idx+1} code empty!"
        res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
        assert res.returncode == 0, f"Day {d} Part {p_idx+1} code failed: {res.stderr}"
        assert res.stdout.strip() == p['output'].strip(), f"Day {d} Part {p_idx+1} output mismatch! Expected: {p['output'].strip()}, got: {res.stdout.strip()}"
        
        # Check structure
        check = p['check']
        assert check['answer'] == 0, f"Day {d} Part {p_idx+1} check answer must be 0, got {check['answer']}"
        assert len(check['options']) >= 2, f"Day {d} Part {p_idx+1} options < 2"
        assert check['question'] and check['why'], f"Day {d} Part {p_idx+1} missing question or why"

    assert total_words >= 2900, f"Day {d} total words {total_words} < 2900"
    
    # Check projectStep
    ps = data['projectStep']
    assert 'title' in ps and 'steps' in ps, f"Day {d} projectStep missing title or steps"
    assert 'desc' not in ps, f"Day {d} projectStep must NOT have desc!"
    assert len(ps['steps']) == 5, f"Day {d} projectStep steps count != 5"

    print(f"Day {d} fully verified! Total words: {total_words}, All 5 parts >= 580 words, 5/5 code sandbox passed.")

print("All Block 9 days (41-45) verified successfully!")
