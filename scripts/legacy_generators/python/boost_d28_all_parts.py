import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day28 import get_day_28
d = get_day_28()

# Part 1 boost
d['parts'][0]['say'].extend([
    "Consider the organizational psychology of engineering change: Every software team is governed by the Second Law of Thermodynamics—unless continuous energy is invested, systems naturally decay into disorder, complexity, and inertia. Over time, codebases accumulate technical debt, dependencies rot, and processes ossify. When an engineer proposes a major change, they are attempting to reverse organizational entropy.",
    "Notice how an amateur engineer responds to resistance: They become bitter, cynicism creeps in, and they complain to peers at lunch: 'Management doesn't care about code quality; this company is hopeless.' The Staff Engineer, by contrast, responds with anthropological fascination! They do not view organizational friction as a personal insult; they view it as an engineering constraint to be modeled, debugged, and solved. They analyze the political architecture with the same objective precision they use to analyze a distributed deadlock, discovering the exact leverage points needed to mobilize change."
])

# Part 2 boost
d['parts'][1]['say'].extend([
    "Let us explore how to engage with the most dangerous persona on the power grid: The Covert Blocker. An overt blocker is easy to spot—they argue with you publicly on Slack or in meetings. A covert blocker, however, smiles and nods during your presentation, and then privately lobbies leadership to kill your initiative behind closed doors!",
    "How does a Staff Engineer neutralize a covert blocker? Through Proactive Socratic Alignment: Schedule a private coffee chat and ask: 'I noticed you seemed slightly reserved during our discussion on the service mesh migration. You have deep historical context on this system that I lack; what risks or historical landmines am I overlooking that could impact your team?' By asking for their wisdom and validating their historical expertise, you disarm their defensiveness and invite them to become a guardian of the solution rather than a saboteur."
])

# Part 3 boost
d['parts'][2]['say'].extend([
    "Notice how Nemawashi protects the political capital of your executive sponsors. When a VP of Engineering or Director agrees to sponsor your initiative, they are staking their personal organizational reputation on your success! If you call an architecture review meeting and your proposal gets publicly dismantled by peer tech leads because you failed to pre-wire their concerns, your sponsor looks foolish for backing an unvetted proposal.",
    "By contrast, when you pre-wire every stakeholder, resolve objections in advance, and deliver a smooth, unanimous review meeting, your sponsor looks like a visionary leader who guides cohesive, high-velocity engineering organizations. Your sponsor will actively seek out your proposals in the future, knowing that you are a dependable, politically astute partner who always executes with flawless organizational rigor."
])

# Part 4 boost
d['parts'][3]['say'].extend([
    "Let us analyze the tactical nuance of creating executive-ready one-pagers. Executives do not have the time to read forty-page architectural specifications. When pitching an initiative to directors and VPs, distill your proposal into an Amazon-style Six-Pager or a crisp One-Page Executive Briefing: Section 1: Executive Summary & Problem Statement; Section 2: Financial ROI & Revenue Impact; Section 3: Strategic Architectural Solution; Section 4: De-Risking Pilot Plan & Milestones; Section 5: Unanimous Stakeholder Endorsements.",
    "Notice the power of Section 5: When an executive glances at your one-pager and sees that the Tech Leads of Checkout, Infrastructure, and Security have already signed off as co-endorsers, the decision becomes a no-brainer! The executive does not need to re-litigate the technical debate; they simply approve the resources, confident that the engineering organization is already fully aligned."
])

# Part 5 boost
d['parts'][4]['say'].extend([
    "Reflect on the compounding organizational legacy of an engineer who masters influence without authority: Over the course of your career, programming languages will change, frameworks will rise and fall, and code you wrote five years ago will inevitably be refactored or deprecated. But your ability to inspire people, unite disparate teams around a shared vision, and guide complex organizations through transformative change will NEVER be obsolete!",
    "It is the single most durable, high-value, and revered capability in the entire technology industry. As you conclude this day of influence mastery, look around your current codebase and organization: What broken systems are crying out for leadership? Who needs to be brought together? You now possess the complete toolkit to step forward, lead without permission, and drive enduring engineering greatness."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 28 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day28.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_28():\n    return {json.dumps(d, indent=4)}\n')

print('Day 28 updated successfully!')
