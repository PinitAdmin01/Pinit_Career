import data_devops_day41

day = data_devops_day41.DAY_41
tot = 0
print(f'=== DAY {day["day"]}: {day["title"]} ===')
for i, p in enumerate(day['parts']):
    wc = sum(len(para.split()) for para in p['say'])
    tot += wc
    status = 'PASS' if (wc >= 600 and len(p['say']) >= 7) else 'FAIL'
    print(f'  Part {i+1} ({p["title"][:50]}...): {len(p["say"])} paras, {wc} words -> {status}')
    assert p['check']['answer'] == 0
    assert len(p['check']['options']) == 4
print(f'Total: {tot} words ({"PASS" if tot >= 3000 else "FAIL"})')
