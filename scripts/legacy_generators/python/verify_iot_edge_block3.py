import json

for day_num in range(11, 16):
    fpath = f'scripts/iot_edge_day{day_num}.json'
    d = json.load(open(fpath, encoding='utf-8'))
    assert d['coursePrefix'] == 'iot_edge', f"Course prefix mismatch in Day {day_num}"
    assert d['day'] == day_num, f"Day mismatch in Day {day_num}"
    assert 35 <= d['minutes'] <= 40, f"Minutes out of range in Day {day_num}: {d['minutes']}"
    assert len(d['parts']) == 5, f"Parts count != 5 in Day {day_num}"
    total_words = 0
    for idx, p in enumerate(d['parts']):
        words = sum(len(s.split()) for s in p['say'])
        total_words += words
        assert words >= 580, f"Day {day_num} Part {idx+1} words < 580: {words}"
        assert len(p['check']['options']) == 4, f"Day {day_num} Part {idx+1} options != 4"
        assert p['check']['answer'] == 0, f"Day {day_num} Part {idx+1} answer != 0"
        assert len(p['check']['why']) > 20, f"Day {day_num} Part {idx+1} why too short"
        assert len(p['codeNotes']) >= 3, f"Day {day_num} Part {idx+1} codeNotes < 3"
        assert len(p['code'].strip()) > 0, f"Day {day_num} Part {idx+1} code empty"
        assert len(p['output'].strip()) > 0, f"Day {day_num} Part {idx+1} output empty"
    print(f"Day {day_num}: ALL 5 PARTS VERIFIED! Total words: {total_words}, Minutes: {d['minutes']}")

print(">>> ALL DAYS 11-15 INVARIANTS 100% CERTIFIED! <<<")
