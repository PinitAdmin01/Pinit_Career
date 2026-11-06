import sys
sys.path.append('.')
from scripts.make_soft_skills_day11 import get_day_11
from scripts.make_soft_skills_day12 import get_day_12
from scripts.make_soft_skills_day13 import get_day_13
from scripts.make_soft_skills_day14 import get_day_14
from scripts.make_soft_skills_day15 import get_day_15

days = [get_day_11(), get_day_12(), get_day_13(), get_day_14(), get_day_15()]
for d in days:
    has_sum = 'summary' in d and len(d['summary']) >= 4
    ps = d.get('projectStep', {})
    has_ps_steps = 'steps' in ps and len(ps['steps']) >= 4
    print(f"Day {d['day']}: summary={has_sum} ({len(d.get('summary', []))}), projectStep.steps={has_ps_steps} (has keys: {list(ps.keys())})")
