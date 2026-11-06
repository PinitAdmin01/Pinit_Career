import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day14 import get_day_14
d = get_day_14()

# Part 1 is 632 words: Add ~100 words
d['parts'][0]['say'].append(
    "Let us explore how to operationalize Amy Edmondson's psychological safety audit in weekly engineering rituals: It is not enough to administer an annual HR survey. High-performing engineering managers and staff leads run lightweight, anonymous pulse surveys at the conclusion of every two-week sprint retrospective. The lead presents a single anonymous poll asking: 'On a scale of 1 to 5, how comfortable did you feel raising technical doubts or admitting mistakes this sprint?' If the score dips below 4.0, the sprint retrospective immediately pivots from discussing Jira tickets to an open, compassionate inquiry into team dynamics. By treating psychological safety as a continuous telemetry metric, the team identifies and repairs interpersonal friction before it calcifies into organizational rot."
)

# Part 2 is 491 words: Add ~250 words
d['parts'][1]['say'].append(
    "Let us examine how to structure a bi-weekly 'Brag Alignment' cadence with your engineering manager: Many engineers feel uncomfortable writing down their accomplishments because they were raised to believe that self-advocacy is arrogant or self-centered. In high-trust technology companies, maintaining a Brag Document is not arrogance—it is an act of professional courtesy to your engineering manager. Your manager likely manages between six and twelve direct reports; they cannot possibly remember every bug you diagnosed, every PR you reviewed, or every junior engineer you unblocked during a busy quarter."
)
d['parts'][1]['say'].append(
    "When you arrive at your bi-weekly 1-on-1 with a concise, factual Brag Document update, you make your manager's job effortless: During calibration and promotion committee reviews, your manager does not have to rely on vague impressions or subjective memory. They copy and paste your verified metrics, pull request links, and architectural achievements directly into the promotion dossier. You take full sovereign ownership of your career progression, transforming performance reviews from anxious gambles into triumphant, data-driven milestones."
)
d['parts'][1]['say'].append(
    "Furthermore, a Brag Document acts as a powerful psychological grounding mechanism during turbulent corporate reorganizations or layoffs: When companies undergo restructuring, market downturns, or leadership churn, engineers naturally experience acute career insecurity. By reading through your comprehensive log of system architectures delivered and mission-critical incidents resolved, you anchor your professional identity in objective competence. You know with absolute certainty that your skills are real, valuable, and in high demand across the entire technology industry."
)

# Part 3 is 439 words: Add ~300 words
d['parts'][2]['say'].append(
    "Let us analyze the neurobiological mechanics of sleep deprivation and on-call trauma in engineering teams: In many tech startups and enterprise platforms, secondary on-call rotations are managed with brutal disregard for human circadian biology. When an engineer is paged at 2:00 AM, 3:30 AM, and 5:15 AM by noisy Datadog alerts, their prefrontal cortex experiences severe glucose and adenosine disruption. Research in neuroscience demonstrates that 24 hours of sustained sleep fragmentation impairs cognitive judgment, emotional regulation, and working memory to the same degree as blood alcohol intoxication."
)
d['parts'][2]['say'].append(
    "Expecting an engineer to wake up after a fragmented night on call, attend a 9:00 AM standup, and write critical financial transaction logic is gross organizational negligence. High-reliability engineering teams enforce strict 'Sleep Recovery Protocols': If an on-call engineer is paged between 11:00 PM and 6:00 AM, they are legally barred from writing production code or attending morning meetings the following day. Their primary responsibility is to sleep, recover neurobiological equilibrium, and hand off active tickets to the daytime secondary responder."
)
d['parts'][2]['say'].append(
    "Additionally, consider the vital role of 'Alert Fatigue Reduction' in preventing burnout: When an alerting system generates hundreds of non-actionable warnings every week, engineers live in an unceasing state of low-grade panic. Senior Site Reliability Engineers practice radical alert hygiene: Every alert that pages a human being MUST represent an immediate, user-impacting emergency with a documented runbook. If an alert fires and the engineer takes no action because 'it always does that', the alert is immediately deleted or downgraded to a silent daily dashboard. By eliminating alert noise, you protect the nervous systems of your engineers and ensure that true emergencies are met with sharp, focused attention."
)

# Part 4 is 419 words: Add ~320 words
d['parts'][3]['say'].append(
    "Let us explore how to integrate growth mindset reframing into architectural code reviews: In unhealthy engineering teams, code reviews are weaponized as intellectual combat arenas. A senior engineer leaves a blunt comment: 'This algorithm is terribly slow; why didn't you use a Patricia trie?' The junior engineer feels crushed, interprets the comment as proof of their fundamental incompetence, and retreats into silence. A growth-mindset engineering leader reframes the review into a masterclass: 'Great progress on getting this lookup logic working! At our current scale of 500k queries per second, this hashmap lookup will encounter significant hash collisions. Let's look at how a Patricia trie or radix tree can optimize our memory cache locality. Here is a great 5-minute reference doc.' The critique validates effort, points to deliberate learning resources, and inspires the engineer to level up their craft."
)
d['parts'][3]['say'].append(
    "Furthermore, practicing cognitive reframing protects you from the toxic trap of 'Comparison Despair': When you browse tech Twitter, LinkedIn, or internal company Slack channels, it is easy to look at other engineers who seem to effortlessly write custom compilers in their spare time and feel inadequate. The master engineer remembers: You are comparing your messy, private behind-the-scenes reality to someone else's carefully curated highlight reel. By reframing comparison into inspiration—saying 'If they can master that complex distributed primitive, it proves that the human brain can learn it, which means I can master it too'—you convert envy into fuel for disciplined growth."
)

# Part 5 is 266 words: Add ~450 words
d['parts'][4]['say'].append(
    "Let us examine how to present team well-being and psychological safety telemetry to executive leadership: In many corporate technology organizations, Chief Financial Officers and Chief Technology Officers view mental health initiatives as soft, non-essential perks. A strategic engineering leader reframes well-being in the language that executives respect: Enterprise Risk Management and Return on Investment (ROI)."
)
d['parts'][4]['say'].append(
    "When an engineering director presents our Master Engineering Well-Being audit to the executive board, they frame the numbers strategically: 'Replacing a departed Senior Staff Engineer costs our company approximately $250,000 in recruiting fees, signing bonuses, and lost institutional knowledge, plus six months of onboarding latency. By investing in psychological safety audits, enforcing reasonable on-call guardrails, and maintaining brag document alignment, our engineering attrition dropped from 22% to 4% this year. That directly saved our enterprise $1,800,000 in hiring costs while accelerating our product delivery velocity.' By translating human well-being into bottom-line financial stewardship, you secure enthusiastic executive backing for a humane engineering culture."
)
d['parts'][4]['say'].append(
    "Let us reflect on the profound ethical responsibility of technical leadership: As you advance in your engineering career and step into roles as Tech Lead, Staff Architect, Engineering Manager, or VP, you hold immense power over the daily lives, mental health, and happiness of the human beings on your team. You have the power to create a culture of terror, silence, and burnout—or a culture of psychological safety, intellectual courage, and profound human flourishing."
)
d['parts'][4]['say'].append(
    "When you choose to lead with vulnerability, defend deep work blocks, celebrate transparent learning, and institutionalize psychological safety, you create an environment where engineers do the greatest work of their lives. You prove that extraordinary technical excellence and deep human compassion are not mutually exclusive—they are the exact same thing."
)

with open('scripts/make_soft_skills_day14.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_14():\n")
    f.write("    return " + json.dumps(d, indent=4) + "\n")

print("Day 14 successfully boosted!")
