import json
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

for d in range(56, 61):
    with open(f'scripts/day{d}_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    words = [sum(len(s.split()) for s in p['say']) for p in data['parts']]
    all_out = all(len(p['output']) > 0 for p in data['parts'])
    print(f"Day {data['day']}: '{data['title'][:55]}...' | Parts: {len(data['parts'])} | Total Words: {sum(words)} | Min Part: {min(words)} | Outputs Non-Empty: {all_out}")
    assert len(data['parts']) == 5, f"Day {d} parts != 5"
    assert sum(words) >= 3000, f"Day {d} total words < 3000"
    assert min(words) >= 600, f"Day {d} part word count < 600"
    assert all_out, f"Day {d} has empty output"

print("\nALL 5 DAYS OF BLOCK 12 PASSED EVERY INVARIANT WITH FLYING COLORS!")
