import json, sys
sys.path.append('.')
from scripts.make_soft_skills_day20 import get_day_20

d = get_day_20()
d['parts'][4]['say'].append(
    "Furthermore, notice how mastering blameless failure storytelling fundamentally dissolves interview anxiety: When you enter an interview terrified of being exposed, every question feels like a trap. But once you have thoroughly documented your greatest technical failures, deconstructed their five root causes, and built automated guardrails to prevent their recurrence, you have nothing left to hide! You realize that your mistakes are not liabilities; your mistakes are the empirical proof of your hard-won wisdom, systems resilience, and senior technical leadership."
)
with open('scripts/make_soft_skills_day20.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_20():\n    return ' + json.dumps(d, indent=4) + '\n')
print('Day 20 Part 5 boosted!')
