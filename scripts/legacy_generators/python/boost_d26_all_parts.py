import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day26 import get_day_26
d = get_day_26()

# Part 1 boost
d['parts'][0]['say'].extend([
    "Consider the tactical architecture of a high-impact Brag Document: Divide your document into four dedicated quadrants: Quadrant 1: Hard Technical Artifacts (shipped features, merged PRs, production telemetry charts); Quadrant 2: Mentorship and Force Multiplication (junior developers mentored, onboarding documents written, interview loops conducted); Quadrant 3: Company Impact and Operational Health (on-call shifts navigated, postmortems led, technical debt deprecated); Quadrant 4: Peer and Executive Recognition (Slack shout-outs, quarterly performance accolades).",
    "Notice how this structural discipline transforms your relationship with performance reviews: When performance review cycles arrive, amateur engineers panic, trying to recall what they accomplished five months ago. But an engineer armed with an active Brag Document can produce an authoritative, chronological portfolio of high-impact engineering delivery in five minutes. This empirical foundation completely silences internal self-doubt and equips your engineering manager with the exact business case needed to champion your promotion to Staff leveling."
])

# Part 2 boost
d['parts'][1]['say'].extend([
    "Let us explore how boundary setting operates in async communication channels like Slack and Microsoft Teams. The modern engineering environment is plagued by continuous partial attention: Engineers are tagged in dozen-channel threads, paged for trivial questions, and interrupted during deep architectural thinking. Rookie engineers keep Slack notifications on constantly, answering pings within thirty seconds out of anxiety that they will appear unresponsive.",
    "Senior engineers, by contrast, practice disciplined Asynchronous Hygiene: They schedule dedicated Maker Blocks for deep work, turn off notifications during flow state, and update their status to reflect their focus: 'Focusing on distributed cache refactor; checking Slack at 12:00 PM and 4:30 PM. For P0 production outages, page on PagerDuty.' When you set clear, predictable communication cadences, your colleagues learn to respect your focus, and your daily engineering output doubles."
])

# Part 3 boost
d['parts'][2]['say'].extend([
    "Notice how managing up creates deep psychological safety for your entire team. When an individual contributor or tech lead bravely tells an executive: 'If we try to ship all ten features in three weeks, we will launch a brittle, untested product that causes customer churn', they are protecting not only themselves, but every junior developer on the team who would otherwise be forced to work midnight fire-fighting shifts.",
    "Furthermore, realize that executives respect pushback that comes packaged with structured options. When you walk into a leadership meeting and present three concrete scenarios: Option 1: Full scope in eight weeks; Option 2: Core MVP in four weeks with fast-follow enhancements; Option 3: Add two dedicated contract engineers to parallelize non-critical frontend views, you are not acting as a blocker—you are acting as an executive partner in resource allocation and risk management."
])

# Part 4 boost
d['parts'][3]['say'].extend([
    "Let us examine how to handle code review stalemates where two engineers disagree on architectural direction. Suppose you propose an event-driven architecture with Kafka, while a peer insists on synchronous REST calls. Inexperienced engineers let the disagreement sit unresolved in pull request comments for two weeks, building resentment. Passive engineers surrender immediately, while aggressive engineers escalate to leadership in frustration.",
    "The assertive engineer executes The 3-Step Disagreement Protocol: Step 1: Timebox the text discussion (no more than 3 back-and-forth comments on GitHub); Step 2: Move to high-bandwidth synchronous communication: 'Hey Sarah, let us jump on a quick 10-minute huddle with a virtual whiteboard to align on the trade-offs'; Step 3: Frame the decision around shared team principles and escalate neutrally if needed: 'We have analyzed both options: Kafka provides decoupled resilience at the cost of operational overhead, while REST provides simplicity at the cost of cascading latency. Let us present this one-page summary to our Tech Lead to decide, and we will both commit 100% to whatever direction they choose.' This is the epitome of mature engineering leadership: Disagree and commit."
])

# Part 5 boost
d['parts'][4]['say'].extend([
    "Reflect on the compounding career trajectory of an engineer who masters both technical craftsmanship and professional self-advocacy. You are no longer at the mercy of chaotic management, unreasonable timelines, or toxic team dynamics. You have engineered your professional environment to sustain peak performance, continuous learning, and profound creative fulfillment across a multi-decade journey.",
    "As you step into your next sprint planning, pull request review, or architectural RFC discussion, carry this conviction: You belong in this room, your technical voice matters, and your boundaries are the sacred foundation of your engineering excellence. Protect your focus, communicate with grounded assertiveness, and lead your team with unshakable integrity."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 26 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day26.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_26():\n    return {json.dumps(d, indent=4)}\n')

print('Day 26 updated successfully!')
