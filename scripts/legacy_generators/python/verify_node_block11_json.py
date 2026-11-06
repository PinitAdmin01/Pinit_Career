import json, subprocess

def run_js(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True, encoding='utf-8')
    if res.returncode != 0:
        raise RuntimeError(f"Code failed to execute:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

days_to_check = [
    (51, 38, "scripts/node_day51.json"),
    (52, 38, "scripts/node_day52.json"),
    (53, 38, "scripts/node_day53.json"),
    (54, 38, "scripts/node_day54.json"),
    (55, 40, "scripts/node_day55.json"),
]

for day_num, expected_mins, filepath in days_to_check:
    print(f"\n--- Verifying Day {day_num} ({filepath}) ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    assert data['day'] == day_num, f"Day number mismatch: {data['day']} != {day_num}"
    assert data['minutes'] == expected_mins, f"Minutes mismatch: {data['minutes']} != {expected_mins}"
    assert len(data['parts']) == 5, f"Parts count mismatch: {len(data['parts'])} != 5"
    assert 'desc' not in data['projectStep'], f"projectStep has forbidden 'desc' field in Day {day_num}!"
    assert len(data['projectStep']['steps']) == 5, f"projectStep must have 5 steps, got {len(data['projectStep']['steps'])}"

    total_words = 0
    for idx, part in enumerate(data['parts'], 1):
        words = sum(len(s.split()) for s in part['say'])
        total_words += words
        print(f"  Part {idx} ('{part['title'][:35]}...'): {words} words")
        assert words >= 580, f"Day {day_num} Part {idx} has {words} words (< 580)!"

        # Check sandbox execution match
        actual_output = run_js(part['code'])
        assert actual_output == part['output'], f"Day {day_num} Part {idx} output mismatch!\nExpected:\n{part['output']}\nGot:\n{actual_output}"

        # Check structure
        check = part['check']
        assert check['answer'] == 0, f"Day {day_num} Part {idx} check answer must be 0!"
        assert len(check['options']) >= 2, f"Day {day_num} Part {idx} check options < 2!"
        assert len(check['why']) > 10, f"Day {day_num} Part {idx} check why missing or short!"

    print(f"  Total words for Day {day_num}: {total_words} (>= 2900 PASS)")
    assert total_words >= 2900, f"Total words {total_words} < 2900!"

print("\nALL BLOCK 11 (DAYS 51-55) JSON FILES VERIFIED 100% PERFECTLY!")
