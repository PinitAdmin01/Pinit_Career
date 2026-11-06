import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day22 import get_day_22
d = get_day_22()

# Additional paragraphs for Part 3
d['parts'][2]['say'].extend([
    "Consider the tactical nuance of uncovering the reality behind technical debt. When an interviewer says 'we are very pragmatic about debt', that could mean two diametrically opposed things: It could mean they practice deliberate architectural trade-offs with structured repayment plans, or it could mean they have zero automated testing, manual copy-paste deployments, and three years of unaddressed security vulnerabilities. By asking 'Could you walk me through the lifecycle of the last major architectural refactor your team completed?', you force the conversation out of vague marketing theory into concrete engineering history.",
    "Pay close attention to body language and emotional resonance as well. When you ask a senior engineer about on-call stress, watch if they chuckle nervously, glance away, or sigh before speaking. Micro-expressions often reveal the truth long before verbal answers can be polished. A confident, relaxed response backed by hard operational metrics like MTTR (Mean Time to Resolution) and automated canary rollbacks indicates a truly world-class engineering culture that respects its people."
])

# Additional paragraphs for Part 4
d['parts'][3]['say'].extend([
    "Let us explore how to structure your inquiry delivery when facing a multi-person panel. Often, an onsite interview will include both an Engineering Manager and a Tech Lead in the same room. In this scenario, rookie candidates direct questions to whoever speaks first, ignoring group dynamics. Senior candidates, by contrast, address both leaders with deliberate balance: 'I would love to hear from both of you on this: from the engineering management perspective, how do you measure team success over the first 90 days; and from the tech lead perspective, what is the single hardest distributed systems problem currently facing the team?'",
    "Notice how this dual-targeted inquiry demonstrates profound emotional intelligence and executive situational awareness. You avoid alienating either leader, you invite healthy cross-perspective dialogue, and you frequently prompt the two interviewers to banter naturally about their shared challenges. This turns the final minutes of a grueling technical screen into an engaging, collaborative working session where the interviewers begin imagining what it would be like to have you on their team every day."
])

# Additional paragraphs for Part 5
d['parts'][4]['say'].extend([
    "To operationalize this complete reverse interviewing engine into your daily preparation routine, maintain a living Markdown document titled 'Reverse_Interview_Playbook.md' in your personal workspace. For every target company on your radar, create a dedicated dossier with three columns: Interviewer Name & Title, Tailored 4-Pillar Inquiries, and Anticipated Red Flag Euphemisms. Review this dossier ten minutes before your interview commences, ensuring your questions are primed and razor-sharp.",
    "Finally, remember the Golden Rule of the Reverse Interview: Never ask a question whose answer could have been easily found in thirty seconds on the company's public careers page or tech blog. Asking 'What programming languages do you use?' or 'How many employees work here?' broadcasts intellectual laziness and superficial preparation. But asking 'I read your recent engineering blog post on migrating from monolith to event-driven microservices with Kafka; how has that shift impacted your team's local development environments and CI test runtimes?' demonstrates world-class initiative, technical sophistication, and genuine passion for engineering excellence."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 22 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day22.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_22():\n    return {json.dumps(d, indent=4)}\n')

print('Day 22 updated successfully!')
