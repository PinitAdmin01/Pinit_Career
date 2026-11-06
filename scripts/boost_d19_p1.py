import json, sys
sys.path.append('.')
from scripts.make_soft_skills_day19 import get_day_19

d = get_day_19()
d['parts'][0]['say'].append(
    "Let us examine how to adapt your opening pitch across different interview rounds: When speaking to a non-technical corporate recruiter, your pitch should emphasize broad business impact, team collaboration, and leveling alignment. However, when speaking to a Principal Systems Architect or VP of Engineering, dial up the architectural density: Name specific distributed systems patterns, database locking models, and latency metrics. By calibrating your technical vocabulary to your interviewer's leveling, you demonstrate exceptional situational intelligence."
)
with open('scripts/make_soft_skills_day19.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_19():\n    return ' + json.dumps(d, indent=4) + '\n')
print('Day 19 Part 1 boosted!')
