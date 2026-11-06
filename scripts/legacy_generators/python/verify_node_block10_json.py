import json, subprocess, sys

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True, encoding='utf-8')
    if res.returncode != 0:
        raise RuntimeError(f"Execution failed:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

for day_num in range(46, 51):
    path = f'scripts/node_day{day_num}.json'
    print(f"--- Verifying Day {day_num} ({path}) ---")
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    assert data['day'] == day_num, f"Day number mismatch: {data['day']} != {day_num}"
    assert 'title' in data and data['title'], "Missing title"
    assert 'goal' in data and data['goal'], "Missing goal"
    assert data['minutes'] in [38, 40], f"Unexpected minutes: {data['minutes']}"
    if day_num == 50:
        assert data['minutes'] == 40, f"Milestone 9 minutes must be 40, got {data['minutes']}"
    assert len(data['parts']) == 5, f"Day {day_num} must have exactly 5 parts, got {len(data['parts'])}"

    total_words = 0
    for idx, part in enumerate(data['parts']):
        words = sum(len(s.split()) for s in part['say'])
        total_words += words
        assert words >= 580, f"Day {day_num} Part {idx+1} has {words} words (< 580)!"
        assert 'code' in part and part['code'], f"Day {day_num} Part {idx+1} missing code"
        assert 'output' in part, f"Day {day_num} Part {idx+1} missing output"
        
        # Verify code execution matches output
        actual_out = run_code(part['code'])
        assert actual_out == part['output'], f"Day {day_num} Part {idx+1} output mismatch!\nActual:\n{actual_out}\nExpected:\n{part['output']}"

        # Verify check
        check = part['check']
        assert check['answer'] == 0, f"Day {day_num} Part {idx+1} check.answer must be 0!"
        assert len(check['options']) >= 2, f"Day {day_num} Part {idx+1} check.options < 2"
        assert check['question'] and check['why']

    print(f"Day {day_num} Total Words: {total_words} (All 5 parts >= 580)")

    # Verify projectStep
    assert 'projectStep' in data, f"Day {day_num} missing projectStep"
    ps = data['projectStep']
    assert 'title' in ps and ps['title'], "projectStep missing title"
    assert 'steps' in ps and len(ps['steps']) >= 4, "projectStep steps < 4"
    assert 'desc' not in ps, f"Day {day_num} projectStep must NOT have desc property!"

print("\nALL 5 DAYS (46-50) VERIFIED 100% INVARIANT-COMPLIANT!")
