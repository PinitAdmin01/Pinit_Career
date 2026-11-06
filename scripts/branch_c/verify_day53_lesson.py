import json

d = json.load(open('scripts/branch_c/day53_lesson.json', encoding='utf-8'))
assert d['coursePrefix'] == 'dsa-optim'
assert d['day'] == 53
assert len(d['parts']) == 5
assert len(d['summary']) >= 5
assert len(d['projectStep']['steps']) >= 3
for i, p in enumerate(d['parts']):
    wc = len(' '.join(p['say']).split())
    assert wc >= 600, f'Part {i+1} wc {wc} < 600'
    assert len(p['say']) >= 4, f'Part {i+1} say count {len(p["say"])} < 4'
    ch = p['check']
    assert len(ch['options']) == 4, f'Part {i+1} options {len(ch["options"])}'
    assert ch['answer'] == 0
    assert ch['answerIndex'] == 0
    assert len(ch['why']) >= 50, f'Part {i+1} why {len(ch["why"])}'
    assert len(p['example']) > 0
    assert len(p['tryIt']) > 0
print('All Day 53 lesson invariants passed!')
