import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day29 import get_day_29
d = get_day_29()

# Part 1 boost
d['parts'][0]['say'].extend([
    "Consider the organizational lifecycle of an Architecture RFC: It begins as a Draft, moves into Active Review, undergoes rigorous Revision, and ultimately reaches one of three final states: Approved/Adopted, Rejected, or Superseded. Once approved, an RFC ceases to be a proposal; it becomes the binding technical constitution of the system! Any future pull request that deviates from the RFC must either justify the deviation or author an amendment RFC.",
    "Notice how this architectural constitution protects teams from revisionist history. In fast-growing startups, engineers constantly leave and join. Without written RFCs, new engineers look at a complex caching layer and ask: 'Why on earth did they build this bizarre gossip sync?' They assume the previous engineers were incompetent and propose a naive rewrite, only to trigger the exact race condition that the original design was built to prevent! The RFC preserves institutional memory, documenting not only what was built, but the operational scars and architectural context that shaped the decision."
])

# Part 2 boost
d['parts'][1]['say'].extend([
    "Let us explore how to structure the rejection rationale for alternatives that were legitimately considered. When rejecting an alternative, avoid vague hand-waving like 'Option A felt too complex' or 'Option A is uncool'. Use the Cost of Delay and Operational Complexity framework: 'While Option A would reduce database CPU load by 15%, it introduces a new distributed ZooKeeper dependency that requires dedicated SRE management, costing an estimated $80,000 annually in maintenance overhead and increasing our disaster recovery MTTR.'",
    "Notice the power of this quantitative framing: You demonstrate that you evaluate software through total lifecycle economics, not just raw execution speed. You prove that you understand operational maintenance, team cognitive load, and cloud infrastructure expenses. This total cost of ownership (TCO) perspective is the golden signature of a true Staff or Principal Systems Architect."
])

# Part 3 boost
d['parts'][2]['say'].extend([
    "Notice how an author's emotional posture dictates the health of an RFC review. When someone leaves a critical comment pointing out a flaw in your design, rookie engineers feel attacked and become defensive: 'You clearly didn't read Section 3 properly.' This defensive posture turns the review into an adversarial court battle.",
    "The Staff Engineer, by contrast, responds with genuine gratitude: 'Thank you for catching that! You just saved our team from a multi-million-dollar production outage. Let us update Section 3.2 to include an explicit idempotency key guard.' When reviewers see that you welcome critical scrutiny with intellectual humility, they lean in with trust and admiration. They realize that your goal is not to defend your ego, but to build bulletproof software."
])

# Part 4 boost
d['parts'][3]['say'].extend([
    "Let us analyze the tactical nuance of Shadow Traffic Replay in production migrations. When replaying production traffic against a new candidate service, you must carefully handle mutating write requests! If you blindly replay an actual customer's credit card charge against the new payment service in shadow mode, you will charge the customer twice!",
    "Senior architects solve this through Mock Sink and Idempotency Fencing: In shadow mode, the new service processes the entire computational pipeline—validating inputs, querying fraud models, and calculating balances—but all external write mutations (such as calling the Stripe API or writing to the production ledger) are routed to a verified mock sink that logs the intended payload without executing the real-world side effect. You verify 100% computational parity with zero financial or operational risk."
])

# Part 5 boost
d['parts'][4]['say'].extend([
    "Reflect on the compounding career power of becoming the definitive technical writer in your engineering organization. In any tech company, code commits are local, but technical specifications are global! An engineer who writes clear, compelling, rigorously reasoned RFCs quickly becomes known to the VP of Engineering, the CTO, and cross-functional directors as an architectural visionary who can be trusted to architect the company's most critical systems.",
    "As you conclude this milestone day, internalize this truth: Writing is not an administrative chore that distracts from coding; writing IS thinking! The clarity of your written prose reflects the clarity of your architectural thought. Master the written word, lead your peers through consensus, and author the systems that will shape the digital world."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 29 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day29.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_29():\n    return {json.dumps(d, indent=4)}\n')

print('Day 29 updated successfully!')
