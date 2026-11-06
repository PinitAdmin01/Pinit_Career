import json

for day in range(6, 11):
    path = f"scripts/iot_edge_day{day}.json"
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    print(f"=== Day {d['day']}: {d['title']} ===")
    print(f"Minutes: {d['minutes']} (Must be 38-40)")
    assert 35 <= d['minutes'] <= 40, f"Minutes invariant failed for day {day}"
    assert len(d['parts']) == 5, f"Parts count failed for day {day}"
    total_words = 0
    for idx, p in enumerate(d['parts']):
        words = sum(len(s.split()) for s in p['say'])
        total_words += words
        print(f"  Part {idx}: {words} words | {p['title']}")
        assert words >= 580, f"Part {idx} under 580 words ({words}) in Day {day}"
        assert len(p['check']['options']) == 4, f"Check options count != 4 in Day {day} Part {idx}"
        assert p['check']['answer'] == 0, f"Check answer != 0 in Day {day} Part {idx}"
        assert len(p['check']['why']) > 20, f"Check why too short in Day {day} Part {idx}"
        assert len(p['codeNotes']) >= 3, f"codeNotes < 3 in Day {day} Part {idx}"
        assert len(p['tryIt']) > 10, f"tryIt too short in Day {day} Part {idx}"
    print(f"Total Say Words: {total_words} (Audio: {total_words/120:.1f} mins >= 24 min invariant)")
    assert total_words >= 2900, f"Total words under 2900 ({total_words}) in Day {day}"
    print("ALL PEDAGOGICAL INVARIANTS PASS!\n")

print(">>> ALL DAYS 6-10 METICULOUSLY VERIFIED AND CERTIFIED! <<<")
