import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day08 import get_day_08
d = get_day_08()

# Part 1: Cognitive vs Affective Conflict (Currently 551 words)
d['parts'][0]['say'].append(
    "Let us examine how to handle high-friction architectural debates in remote-first engineering cultures: In distributed teams communicating asynchronously over Slack, Discord, and Jira, affective conflict often escalates with terrifying speed because written text lacks the crucial non-verbal cues—vocal inflection, facial expressions, body language, and empathetic tone—that human beings naturally rely on to calibrate social intent. A terse, three-word message like 'Why this again?' or 'This won't work' can easily be interpreted by the recipient as malicious contempt, triggering an intense fight-or-flight biological response. Senior engineering leaders establish explicit Asynchronous Debate Norms: Whenever a technical thread exceeds four back-and-forth exchanges or begins generating defensive emotional posturing, engineers are required to transition from text to a synchronous video call or huddle. Seeing each other's faces and hearing human voices instantly dissolves manufactured hostility, humanizes the debate, and reminds both developers that they are allies tackling a shared technical challenge."
)

# Part 2: The Interest-Based Relational (IBR) Approach (Currently 519 words)
d['parts'][1]['say'].append(
    "Let us explore how the IBR framework transforms technical disputes during critical architectural reviews: In high-stakes architecture committees where senior developers represent conflicting functional areas—such as frontend client developers battling backend infrastructure architects over GraphQL versus REST and gRPC—the discussion frequently deteriorates into entrenched political warfare. Frontend developers argue that backend APIs are rigid and slow to iterate on, while infrastructure architects argue that frontend engineers write uncontrolled queries that overwhelm downstream microservices and exhaust database connection pools."
)
d['parts'][1]['say'].append(
    "By deploying the IBR protocol, the facilitating Tech Lead resets the entire conversation: First, the facilitator explicitly validates both parties' contributions and affirms that preserving mutual respect and operational trust is paramount for the company's long-term health. Second, the facilitator separates the relational dynamic from the technical problem: 'Our friction is not because the frontend team is careless or the backend team is stubborn. The problem is that our current data layer lacks automated query depth limiting and type-safe schema generation.' Third, they establish objective, verifiable decision criteria: 'We will evaluate candidate solutions against client bundle size, network round-trip latency, backend memory consumption, and developer onboarding velocity.' This principled decoupling transforms an adversarial turf war into an inspiring engineering co-design sprint."
)

# Part 3: Positions vs Interests: The Core Unlocking Secret (Currently 593 words)
d['parts'][2]['say'].append(
    "Let us analyze how the Position-to-Interest mapping method resolves seemingly intractable cross-functional deadlocks between Product Management and Engineering: In fast-paced startup environments, a Product Manager often insists on a rigid position: 'We must ship the new subscription onboarding flow by next Friday, no exceptions!' The Engineering Lead responds with an equally rigid counter-position: 'That is impossible; we refuse to deploy without rewriting our legacy payment processing worker from scratch to support idempotency keys!' Trapped in positional bargaining, both sides view the other as unreasonable blockers, and executive escalation looms."
)
d['parts'][2]['say'].append(
    "When an empathetic engineering leader steps in to diagnose underlying interests, the gridlock evaporates: The PM's core interest is not the arbitrary Friday deadline; their interest is capturing revenue from an upcoming national marketing campaign that has already been booked. The Engineering Lead's core interest is not a total architectural rewrite; their interest is preventing customer double-billing incidents caused by race conditions during peak checkout surges. Once these underlying interests are articulated clearly, the team invents a creative win-win synthesis: They implement lightweight, targeted distributed locking using Redis tokens in the existing payment path within 48 hours to guarantee zero duplicate charges, enabling the marketing campaign to launch on time, while scheduling the comprehensive architectural rewrite for the following sprint. Both stakeholders achieve 100% of their fundamental strategic interests without compromising quality or schedule."
)

# Part 4: The Weighted Pugh Decision Matrix (Currently 477 words)
d['parts'][3]['say'].append(
    "Let us examine how to construct and socialise a Weighted Pugh Decision Matrix within formal Architecture Decision Records (ADRs): When an engineering team faces a major structural pivot—such as selecting a new distributed event streaming broker between Apache Kafka, RabbitMQ, and AWS SQS—subjective opinions and developer familiarity often bias the decision. One developer might have seven years of Kafka experience and fiercely advocate for it, while another developer fears Kafka's operational complexity and argues vehemently for SQS."
)
d['parts'][3]['say'].append(
    "The Pugh Matrix completely neutralizes subjective bias by enforcing a strict mathematical discipline: Before scoring any tool, the entire engineering group must collaboratively establish and lock down the weighted criteria. By forcing team members to debate the relative importance of criteria—such as weighting 'Operational Maintenance Overhead' at 35% versus 'Sub-Millisecond P99 Throughput' at 25%—the team aligns on organizational priorities first. Once the criteria weights sum to exactly 1.0, candidates are evaluated against verifiable data: official vendor benchmarks, prototype latency tests, security audit findings, and total cost of ownership models."
)
d['parts'][3]['say'].append(
    "Furthermore, the completed Pugh Matrix is committed directly into version control as part of the official Architecture Decision Record. When new engineers join the squad six months later and ask, 'Why are we using RabbitMQ instead of Kafka?', the team does not have to recall faded hallway conversations or justify past choices emotionally. They point to the version-controlled ADR and Pugh Matrix, which transparently displays the criteria, weights, data-backed candidate scores, and mathematical rationale that guided the architecture. This builds an enduring institutional culture of analytical transparency and engineering rigor."
)

# Part 5: Master Conflict Resolution Suite (Currently 283 words)
d['parts'][4]['say'].append(
    "Let us examine the operational anatomy of the Master Technical Consensus Dossier: A comprehensive conflict governance framework combines all four foundational pillars into a cohesive organizational standard. Pillar 1 enforces Conflict Taxonomy Auditing, maintaining a strict 0.0% tolerance for affective interpersonal toxicity, personal insults, and passive-aggressive cynicism across PR comments and team channels. Pillar 2 institutionalizes the Interest-Based Relational protocol, guaranteeing that every architectural disagreement separates human beings from technical problems and prioritizes long-term team psychological safety."
)
d['parts'][4]['say'].append(
    "Pillar 3 establishes continuous Position-to-Interest Discovery, training engineers and tech leads to look beyond rigid tactical demands and uncover the genuine technical, operational, and business motivations driving their colleagues. Pillar 4 deploys mathematical multi-criteria decision tooling, utilizing Weighted Pugh Matrices and formal Architecture Decision Records to resolve stalemates with objective benchmark data rather than executive mandate or political maneuvering."
)
d['parts'][4]['say'].append(
    "When an engineering division operationalizes this complete four-pillar consensus framework, team velocity and innovation surge dramatically. High-trust engineering teams resolve complex distributed systems disputes in hours rather than weeks, preserve deep psychological safety, eliminate developer burnout and voluntary turnover, and consistently engineer resilient, world-class software architectures that propel the business forward."
)
d['parts'][4]['say'].append(
    "Furthermore, let us analyze the psychological impact of institutionalizing consensus certification on retention and team morale: In technology companies plagued by toxic affective conflict, senior engineers spend an average of eight to twelve hours each week in defensive posturing, drafting lengthy self-justifying emails, or seeking political alliances to defeat architectural opponents. This massive cognitive tax directly induces burnout, cynicism, and high voluntary attrition. Conversely, when an engineering division adopts the certified consensus framework, developers experience profound psychological safety: they know that their ideas will be evaluated on objective merits, that technical disagreements will never threaten interpersonal relationships, and that decisions will be made transparently using verifiable data."
)
d['parts'][4]['say'].append(
    "By mastering the principles of cognitive conflict differentiation, the Interest-Based Relational method, position-to-interest discovery, and weighted Pugh matrix analysis, you position yourself as an extraordinary engineering leader. You become the trusted mediator whom executives and staff engineers call upon when mission-critical technical disagreements threaten to paralyze project delivery. Your ability to de-escalate emotional friction and guide adversarial factions toward creative, data-backed architectural consensus is one of the rarest, highest-leverage leadership competencies in the global technology industry."
)

# Write clean make_soft_skills_day08.py with json.dumps
with open('scripts/make_soft_skills_day08.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_08():\n")
    f.write(f"    return {json.dumps(d, indent=4, ensure_ascii=False)}\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    d = get_day_08()\n')
    f.write('    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]\n')
    f.write('    total = sum(words)\n')
    f.write('    print(f"Day 8 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")\n')

print("Boosted Day 8 successfully!")
