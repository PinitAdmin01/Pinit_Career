import json
from scripts.make_soft_skills_day19 import get_day_19

d = get_day_19()
d['parts'][4]['say'].append(
    "Remember: Your 90-second pitch is not a static monologue to be rushed through; it is an engaging, living bridge between your proven engineering track record and your future contributions to the team. By mastering the 3-act balance, anchoring your authority in the Present, teasing high-impact crucible victories in the Past, and bridging to the company's mission in the Future, you establish yourself as an exceptional technical partner who inspires immediate confidence."
)
with open('scripts/make_soft_skills_day19.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_19():\n    return ' + json.dumps(d, indent=4) + '\n')
print('Day 19 Part 5 updated!')
