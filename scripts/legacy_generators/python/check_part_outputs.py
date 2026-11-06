import sys
sys.path.append('scripts')
from make_soft_skills_day26 import get_day_26
from make_soft_skills_day27 import get_day_27
from make_soft_skills_day28 import get_day_28
from make_soft_skills_day29 import get_day_29
from make_soft_skills_day30 import get_day_30

days = [get_day_26(), get_day_27(), get_day_28(), get_day_29(), get_day_30()]
for d in days:
    print(f"=== DAY {d['day']} ===")
    for p in d['parts']:
        first_line = p['output'].strip().split('\n')[0]
        print(f"  {p['title'][:35]} -> {first_line}")
