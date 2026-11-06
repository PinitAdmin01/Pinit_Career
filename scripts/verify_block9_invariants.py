import sys
sys.path.append('scripts')
from fullstack_day41_data import DAY_41
from fullstack_day42_data import DAY_42
from fullstack_day43_data import DAY_43
from fullstack_day44_data import DAY_44
from fullstack_day45_data import DAY_45

days = [DAY_41, DAY_42, DAY_43, DAY_44, DAY_45]
grand_total = 0

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
    grand_total += total_w

print(f"ALL DAYS 41-45 MEET SLOW-READER & PEDAGOGICAL INVARIANTS! GRAND TOTAL: {grand_total} words")
