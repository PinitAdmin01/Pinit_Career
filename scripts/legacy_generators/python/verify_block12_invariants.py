import json

all_ok = True
for d in range(56, 61):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    day_num = data['day']
    mins = data['minutes']
    parts = data['parts']
    summary = data['summary']
    project = data['projectStep']
    words = [sum(len(s.split()) for s in p['say']) for p in parts]
    min_w = min(words)
    print(f"Day {day_num}: mins={mins}, parts={len(parts)}, min_words={min_w}, total_words={sum(words)}, summary_len={len(summary)}, steps={len(project['steps'])}")
    if len(parts) != 5:
        all_ok = False
        print('  FAIL: parts != 5')
    if min_w < 580:
        all_ok = False
        print(f'  FAIL: min_w < 580 ({min_w})')
    if mins not in [38, 40]:
        all_ok = False
        print(f'  FAIL: mins not 38 or 40 ({mins})')
    for i, p in enumerate(parts):
        if not p.get('codeNotes') or len(p['codeNotes']) < 2:
            all_ok = False
            print(f'  FAIL: Day {day_num} Part {i+1} codeNotes < 2')
        if p.get('check', {}).get('answer') != 0:
            all_ok = False
            print(f'  FAIL: Day {day_num} Part {i+1} answer != 0')
        if not p.get('check', {}).get('why'):
            all_ok = False
            print(f'  FAIL: Day {day_num} Part {i+1} missing why')

print('ALL BLOCK 12 INVARIANTS PASSED:', all_ok)
assert all_ok, "Some invariants failed!"
