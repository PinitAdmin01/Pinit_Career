import sys
sys.path.append('scripts')
from fullstack_day36_data import DAY_36
from fullstack_day37_data import DAY_37
from fullstack_day38_data import DAY_38
from fullstack_day39_data import DAY_39
from fullstack_day40_data import DAY_40

days = [DAY_36, DAY_37, DAY_38, DAY_39, DAY_40]
for d in days:
    print(f"=== Day {d['day']}: {d['title']} ===")
    total_w = 0
    for idx, p in enumerate(d['parts']):
        text = ' '.join(p['say']) + ' ' + p.get('example', '')
        words = len(text.split())
        total_w += words
        assert words >= 600, f"Day {d['day']} part {idx+1} word count {words} < 600"
        c = p['check']
        assert len(c['options']) == 4, f"Day {d['day']} part {idx+1} options len != 4"
        assert c['answer'] == 0, f"Day {d['day']} part {idx+1} answer != 0"
        assert c['answerIndex'] == 0, f"Day {d['day']} part {idx+1} answerIndex != 0"
        assert len(c['why']) >= 50, f"Day {d['day']} part {idx+1} why < 50 chars"
        print(f"  Part {idx+1}: {words} words | Check valid")
    print(f"Total words: {total_w}\n")
print("ALL DAYS 36-40 MEET SLOW-READER & PEDAGOGICAL INVARIANTS!")
