import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day11 import get_day_11
d = get_day_11()

# Part 1: Concealment bias vs radical transparency (Currently 598 words)
d['parts'][0]['say'].append(
    "Let us examine the operational protocols of Incident Command during high-severity Tier-1 outages: When an enterprise production outage strikes, executive leadership naturally experiences intense anxiety, which frequently leads executives to flood incident Slack channels or join the emergency bridge asking: 'When will this be fixed? What happened? Who is working on it?' Inexperienced engineers allow these executive interruptions to derail active debugging efforts, fragmenting technical focus. Elite engineering organizations deploy a formal Incident Commander (IC) protocol: The Incident Commander designates a dedicated Communications Lead whose sole operational responsibility is maintaining a strict 20-to-30-minute SCR status cadence in a public broadcast channel (`#incident-exec-updates`). By proactively broadcasting predictable, structured updates, the Communications Lead satisfies executive information hunger, prevents executive micromanagement, and creates an impenetrable cognitive shield that allows technical responders to diagnose and remediate the outage in peace."
)

# Part 2: The SCR Communication Framework (Currently 497 words)
d['parts'][1]['say'].append(
    "Let us explore how to structure asynchronous executive SCR memos for critical milestone delays: When delivering a project delay via email or Slack to Vice Presidents and Product Directors, long narrative paragraphs bury crucial takeaways. Senior engineering leaders format their SCR dispatches using clean markdown with bold visual callouts: **Situation:** One sentence grounding the baseline; **Complication:** Two sentences specifying the constraint failure, technical bottleneck, and quantified customer or financial risk; **Resolution:** A bulleted action roadmap detailing immediate mitigations, permanent architectural refactors, directly responsible individuals (DRIs), and a locked revision ETA."
)
d['parts'][1]['say'].append(
    "This structured visual economy respects executive time: An executive scanning their inbox on a mobile device can digest the entire crisis briefing in thirty seconds, immediately understand the trade-offs, and grant formal approval without scheduling an unnecessary emergency meeting. The SCR memo transforms what could have been an agonizing political dispute into an orderly, asynchronous executive alignment ritual."
)

# Part 3: Blameless Systemic Attribution (Currently 415 words)
d['parts'][2]['say'].append(
    "Let us analyze how the 'Five Whys' root-cause methodology uncovers deep systemic vulnerabilities during post-mortems: In traditional post-mortems, investigators often stop at the first or second 'Why': 'Why did the service crash? Because a developer ran an unindexed database query. Why did they run it? Because they were in a rush.' Stopping here leads to useless punitive recommendations like 'developers must be more careful'. In a true blameless inquiry, the facilitator digs deeper: 'Why was an unindexed query allowed to execute against the production primary? Because our database proxy lacked automated query cost thresholds. Why did the proxy lack thresholds? Because our infrastructure-as-code templates had not yet enabled query governor rules. Why were governor rules not enabled? Because our platform roadmap prioritized feature delivery over database proxy hardening.'"
)
d['parts'][2]['say'].append(
    "Notice where the Five Whys arrives: The root cause was not an individual developer's carelessness; it was an organizational prioritization imbalance and a missing proxy guardrail. By tracing failure modes to structural and procedural gaps, the engineering team identifies high-leverage architectural investments that permanently bulletproof the platform against an entire category of future failures."
)

d['parts'][2]['say'].append(
    "Furthermore, blameless systemic attribution directly enhances software architecture by treating incidents as free empirical stress tests: When systems fail under unanticipated edge cases, complex distributed architectures are revealing their hidden non-linear coupling. A blame-oriented culture papers over this valuable signal by firing or reprimanding the developer, leaving the underlying systemic defect intact. A blameless engineering culture uses every incident to harden architectural interfaces, enrich chaos engineering test matrices, and build fault-tolerant self-healing services that degrade gracefully under catastrophic load."
)

# Part 4: Actionable Remediation Commitments (Currently 382 words)
d['parts'][3]['say'].append(
    "Let us examine how to maintain long-term institutional accountability for post-incident remediation items: In many engineering teams, the post-mortem meeting produces an inspiring list of architectural action items, but as soon as the crisis subsides, sprint pressure mounts, and those remediation tickets get buried at the bottom of the backlog, never to be completed. Six months later, the exact same failure mode crashes production again, triggering intense executive outrage."
)
d['parts'][3]['say'].append(
    "High-reliability organizations prevent this 'Post-Mortem Amnesia' by establishing strict Post-Incident Service Level Agreements (SLAs): Remediation items resulting from Tier-1 outages are classified as 'P0 Architectural Debt' and automatically fast-tracked into the immediate next sprint. Furthermore, engineering management enforces explicit completion timeboxes: Immediate interim mitigations must close within 24 hours; permanent architectural safeguards must merge within 14 days; observability monitors must verify within 30 days. Action items that breach these SLAs trigger automated notifications to the VP of Engineering. By institutionalizing automated SLA governance, the organization guarantees that lessons learned in blood during production crises are permanently etched into software architecture."
)
d['parts'][3]['say'].append(
    "Additionally, elite teams implement 'Remediation Verification Drills' before closing any post-incident ticket: It is never enough for an engineer to mark a Jira ticket 'Done' by committing code; they must execute a controlled chaos test or synthetic drill in the staging environment that replicates the original failure condition, proving empirically that the new circuit breaker or rate limiter catches the fault automatically. Verifying fixes with empirical evidence gives executives absolute peace of mind."
)

# Part 5: Master Crisis Leadership Suite (Currently 244 words)
d['parts'][4]['say'].append(
    "Let us examine the profound career impact of mastering executive crisis leadership: In technology companies, technical competence during smooth, sunny-day operations is taken for granted. Anyone can look like a competent engineer when code compiles cleanly, traffic is nominal, and milestones ship on schedule. The moments that truly define an engineer's reputation, professional authority, and trajectory toward Staff, Principal, and VP leadership are the stormy days—when systems collapse, deadlines slip, and executives are anxious."
)
d['parts'][4]['say'].append(
    "When you step into a crisis with calm emotional poise, radical transparency, and an airtight SCR remediation architecture, you become an indispensable pillar of stability. Executive leaders remember the engineer who remained composed under pressure, took blameless ownership of systemic resilience, and guided the team out of the storm. By mastering the SCR Framework, blameless systems attribution, and 3-tier remediation governance, you command universal respect and position yourself as a trusted executive leader."
)
d['parts'][4]['say'].append(
    "In talent reviews and executive promotion committee calibrations, the ability to manage crisis communication with radical transparency and structural authority is recognized as the ultimate differentiator. You demonstrate that true engineering leadership is not merely about writing flawless code, but about steering the human, systemic, and organizational architecture of the technology enterprise through its most demanding challenges."
)
d['parts'][4]['say'].append(
    "By establishing clear status cadences, speaking in measured and objective tones, and consistently framing failures as systemic learning opportunities, you build an enduring culture of engineering excellence. You inspire colleagues to embrace transparency without fear, turning every operational setback into an engine of continuous technological and personal evolution."
)

# Write clean make_soft_skills_day11.py with json.dumps
with open('scripts/make_soft_skills_day11.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_11():\n")
    f.write(f"    return {json.dumps(d, indent=4, ensure_ascii=False)}\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    d = get_day_11()\n')
    f.write('    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]\n')
    f.write('    total = sum(words)\n')
    f.write('    print(f"Day 11 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")\n')

print("Boosted Day 11 successfully!")
