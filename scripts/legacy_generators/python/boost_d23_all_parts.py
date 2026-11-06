import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day23 import get_day_23
from scripts.build_day23 import build_day_23

# Rebuild fresh Day 23
d = build_day_23()

# Part 1 (index 0) boost
d['parts'][0]['say'].extend([
    "Consider the cognitive load equation during an interview: When you attempt to solve a difficult graph traversal or dynamic programming recurrence in silence, your working memory is overloaded with syntax, edge cases, and panic. But the moment you speak your thoughts aloud, you offload cognitive strain from your working memory into the physical environment. Vocalizing your logic forces your brain to structure thoughts sequentially rather than spinning in recursive anxious loops.",
    "Furthermore, realize what happens when an interviewer cannot hear your thought process: In their evaluation rubric, under the competencies of 'Communication', 'Problem Solving', and 'Leadership', they are forced to give you a zero or minimal rating because there is no empirical evidence to evaluate! Even if you produce working code, hiring committees cannot determine if you memorized the LeetCode solution yesterday or if you genuinely derived it through rigorous first-principles engineering reasoning. Your voice provides the undeniable proof of authentic engineering mastery."
])

# Part 2 (index 1) boost
d['parts'][1]['say'].extend([
    "Let us explore how requirement framing directly mirrors real-world production engineering. In a mature microservices architecture, no senior engineer writes an API endpoint without specifying request payload limits, rate-limiting thresholds, idempotency keys, and error status codes. If you deploy a service that assumes input IDs are always positive integers, you cause a catastrophic production outage when a legacy client sends a negative integer or a UUID string.",
    "When an interviewer hears you ask about immutability and memory constraints, they instantly recognize an engineer who has been battle-tested in production. They see that you do not view code in isolation; you view code as part of a larger, living system with shared memory buffers, concurrency contention, and garbage collection overhead. This systems perspective is precisely what separates intermediate code monkeys from true Staff Software Engineers."
])

# Part 3 (index 2) boost
d['parts'][2]['say'].extend([
    "Notice how cognitive signposting transforms potential coding errors into collaborative victories. Suppose you write a sliding window loop and accidentally increment the right pointer twice. If you are silent, the interviewer sits back and thinks: 'This candidate does not know how pointers work.' But if you are signposting aloud: 'Now I am advancing the right pointer to expand the window until our constraint invariant is violated, after which we will contract the left pointer', the interviewer recognizes that your mental model is 100% correct! If they see your typo, they will gently say: 'Check line 24—is right incrementing properly?', and you can fix it in two seconds without losing any points on algorithmic competence.",
    "Practice this signposting cadence with a stopwatch or voice memo app during your home practice. As you write code, record yourself. When you listen back, listen for dead silence. Whenever you hear a silence lasting longer than fifteen seconds, pause the recording and ask yourself: 'What was I thinking at that exact moment? How could I have verbalized that mental step into a clean, professional signpost?' With just five practice sessions, your verbal fluency will increase by an order of magnitude."
])

# Part 4 (index 3) boost
d['parts'][3]['say'].extend([
    "Notice how hint handling reveals your long-term team trajectory. Software engineering is rarely an individual sport; it is an ongoing series of pull request reviews, design doc RFCs, and incident postmortems. An engineer who becomes defensive when an interviewer questions their algorithmic loop will inevitably become defensive when a peer leaves a critical comment on their GitHub pull request. Hiring managers are terrified of hiring toxic, brilliant jerks who destroy team psychological safety.",
    "By contrast, when you receive a hint with genuine curiosity, lean in, and say: 'That is a fascinating perspective—let us trace that scenario together', the interviewer experiences a surge of positive emotion. They think: 'I would love to have this person in my sprint retrospectives. They listen, they adapt, and they elevate everyone around them.' That feeling is what transforms an average candidate into an undeniable Strong Hire recommendation."
])

# Part 5 (index 4) boost
d['parts'][4]['say'].extend([
    "To integrate these four disciplines into an unbreakable muscle memory, conduct full-dress rehearsal mock interviews with a peer or mentor. Set a strict 45-minute timer, choose a LeetCode Hard problem that neither of you has seen before, and enforce the complete Master Live Coding Protocol: no typing for the first 10 minutes, continuous signposts every 20 seconds, and intentional interviewer hints at minute 25.",
    "When you master this holistic protocol, you will discover an astonishing paradox: Technical interviews actually become enjoyable! The anxiety vanishes because you are no longer trying to perform a solo magic trick; you are conducting a high-level engineering dialogue with a fellow professional. You take command of the room, articulate trade-offs with effortless precision, and showcase the full breadth of your senior technical leadership."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 23 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day23.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_23():\n    return {json.dumps(d, indent=4)}\n')

print('Day 23 updated successfully!')
