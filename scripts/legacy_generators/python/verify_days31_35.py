import json
import re

def wc(t):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', t))

for d in range(31, 36):
    with open(f"scripts/bcom_acc_day{d}.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"=== Day {d}: {data['title']} ===")
    assert len(data['parts']) == 5, f"Day {d} parts != 5"
    tot = 0
    for p in data['parts']:
        c = wc(p['say'])
        tot += c
        assert c >= 580, f"Day {d} Part {p['part']} words {c} < 580"
        assert p['check']['answer'] == 0, f"Day {d} Part {p['part']} answer != 0"
        assert len(p['check']['options']) == 4, f"Day {d} Part {p['part']} options != 4"
    print(f"Day {d} Total Words: {tot} (All 5 parts >= 580 words!)")

print("ALL DAYS 31-35 FULLY VALIDATED!")
