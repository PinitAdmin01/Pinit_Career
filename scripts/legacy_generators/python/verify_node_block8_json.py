import json, subprocess

days = [36, 37, 38, 39, 40]

for day in days:
    path = f"scripts/node_day{day}.json"
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    assert data['day'] == day, f"Day mismatch in {path}: {data['day']} != {day}"
    expected_min = 40 if day == 40 else 38
    assert data['minutes'] == expected_min, f"Minutes mismatch in {path}: {data['minutes']} != {expected_min}"
    assert len(data['parts']) == 5, f"Parts count != 5 in {path}"
    assert len(data['summary']) == 5, f"Summary count != 5 in {path}"
    assert 'projectStep' in data, f"Missing projectStep in {path}"
    assert 'title' in data['projectStep'] and 'steps' in data['projectStep'], f"Invalid projectStep in {path}"
    assert 'desc' not in data['projectStep'], f"projectStep has forbidden 'desc' in {path}"
    
    total_words = 0
    for idx, part in enumerate(data['parts']):
        wc = sum(len(s.split()) for s in part['say'])
        total_words += wc
        assert wc >= 580, f"Day {day} Part {idx+1} wc {wc} < 580"
        
        # Test code execution
        res = subprocess.run(['node', '-e', part['code']], capture_output=True, text=True)
        assert res.returncode == 0, f"Day {day} Part {idx+1} code failed: {res.stderr}"
        actual_out = res.stdout.strip()
        expected_out = part['output'].strip()
        assert actual_out == expected_out, f"Day {day} Part {idx+1} output mismatch:\nACTUAL:\n{actual_out}\nEXPECTED:\n{expected_out}"
        
        # Test check question
        check = part['check']
        assert check['answer'] == 0, f"Day {day} Part {idx+1} check answer != 0"
        assert len(check['options']) >= 2, f"Day {day} Part {idx+1} options < 2"
        assert len(check['why']) > 10, f"Day {day} Part {idx+1} why too short"
    
    assert total_words >= 2900, f"Day {day} total words {total_words} < 2900"
    print(f"Verified Day {day}: 5 parts, {total_words} words, code/output 100% matching, checks valid.")

print("\nALL 5 DAYS OF BLOCK 8 VERIFIED DETERMINISTICALLY!")
