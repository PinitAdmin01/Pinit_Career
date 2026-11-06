import sys
sys.path.append('scripts')
from fullstack_day41_data import DAY_41
from fullstack_day42_data import DAY_42
from fullstack_day43_data import DAY_43
from fullstack_day44_data import DAY_44
from fullstack_day45_data import DAY_45

days = [DAY_41, DAY_42, DAY_43, DAY_44, DAY_45]
for d in days:
    for idx, p in enumerate(d['parts']):
        say_text = ' '.join(p['say']) if isinstance(p['say'], list) else p['say']
        words = len(say_text.split())
        if words < 605:
            print(f"Day {d['day']} part {idx+1}: say has {words} words")
