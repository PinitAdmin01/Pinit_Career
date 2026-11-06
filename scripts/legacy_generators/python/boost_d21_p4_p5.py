import json, sys
sys.path.append('.')
from scripts.make_soft_skills_day21 import get_day_21

d = get_day_21()

d['parts'][3]['say'].append(
    "Let us examine how to adapt your elevator pitch and postmortem for engineering management and Staff+ rounds: When interviewing for engineering management, tech lead, or Staff roles, the core mechanics remain the same, but the scope expands: In your elevator pitch, highlight organizational impact ('...where I led an organization of 24 engineers across three pods'); in your postmortem, highlight how you fostered psychological safety across teams and instituted systemic postmortem rituals that permanently leveled up team-wide operational hygiene."
)

d['parts'][4]['say'].append(
    "Let us examine how to prepare your physical environment for high-stakes virtual interviews: Ensure your camera is elevated to eye level so you are not looking down into a laptop screen; use a dedicated external microphone or headset to ensure pristine audio fidelity without echo or room reverb; position a soft light source in front of you rather than behind you to eliminate harsh shadows; and maintain a tidy, professional background. These physical environmental factors subconsciously reinforce your executive polish before you utter your first word."
)
d['parts'][4]['say'].append(
    "Furthermore, approach the final offer decision with sovereign strategic poise: Once you receive an offer, the power dynamic shifts entirely in your favor! In Milestone 4, we will master the delicate, high-leverage art of salary and total compensation negotiation, teaching you how to evaluate base salary, equity vesting schedules, sign-on bonuses, and competing offers to maximize your lifetime earnings. Milestone 3 has laid the unshakeable foundation; you are now equipped to command the market."
)

with open('scripts/make_soft_skills_day21.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_21():\n    return ' + json.dumps(d, indent=4) + '\n')
print('Day 21 Parts 4 & 5 boosted!')
