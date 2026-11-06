import json, sys
sys.path.append('.')
from scripts.make_soft_skills_day21 import get_day_21

d = get_day_21()

d['parts'][1]['say'].append(
    "Notice how an optimized LinkedIn presence creates an inbound halo effect during the interview cycle itself: When interviewers are assigned to your interview panel, the first thing they do before entering the meeting is click your LinkedIn link! When they see a polished, high-signal profile featuring production architecture diagrams, clear systems scale, and technical articles, their mental model of you is established before you say a single word. They enter the interview expecting a senior peer, which fundamentally tilts the entire conversation in your favor."
)

d['parts'][2]['say'].append(
    "Consider the empowering psychological effect of rehearsing your STAR stories aloud: Many engineers write their behavioral bullet points on paper, but when they attempt to speak them in real time, they stumble, lose track of time, or revert to passive 'we' habits. The voice muscles and auditory feedback loops require physical rehearsal! Practice delivering your 60/40 STAR responses while recording your voice and timing yourself on a stopwatch until the cadence becomes second nature."
)

with open('scripts/make_soft_skills_day21.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_21():\n    return ' + json.dumps(d, indent=4) + '\n')
print('Day 21 Parts 2 & 3 boosted!')
