import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day15 import get_day_15
d = get_day_15()

# Part 1 is 519 words: Add ~250 words
d['parts'][0]['say'].append(
    "Let us examine how this technical leadership synthesis alters your day-to-day interactions across the enterprise: In ordinary technology companies, engineers frequently complain about 'the business' or 'management' as if they are an antagonistic external force. They feel that management imposes arbitrary deadlines, misunderstands technical debt, and prioritizes flashy features over system stability. When you operate with integrated technical leadership, that adversarial wall dissolves completely. You realize that management's anxieties stem from a lack of technical transparency and predictability."
)
d['parts'][0]['say'].append(
    "By providing structured executive summaries, translating engineering trade-offs into commercial ROI, and framing refactors as risk-mitigation investments, you bridge the chasm between code and capital. You transform the engineering department from a reactive cost center into a strategic innovation engine. Product Directors and Vice Presidents do not treat you as an order-taker; they invite you to the executive table as an indispensable co-creator of corporate strategy."
)
d['parts'][0]['say'].append(
    "Furthermore, this integrated communication pipeline serves as your personal leadership operating system: Whether you are facilitating a tense sprint retrospective, negotiating a contentious architectural boundary with a sister team, or delivering an emergency briefing during a regional cloud outage, you never have to guess what to do. You have an internalized library of battle-tested mental models—ELI5 analogies, SBI feedback formulas, IBR interest discovery, Minto Pyramid decks, SCR crisis briefings, and ZOPA negotiation boundaries—that guide your words and actions with effortless grace."
)

# Part 2 is 330 words: Add ~400 words
d['parts'][1]['say'].append(
    "Let us explore how to build a 'Cross-Functional Business Dictionary' within your engineering organization: In many high-growth technology companies, engineering and business teams speak completely different dialects. Engineers talk about Kubernetes pods, P99 tail latency, Kafka partition rebalancing, and database read replicas. Business stakeholders talk about Customer Acquisition Cost (CAC), Lifetime Value (LTV), Net Churn, Monthly Recurring Revenue (MRR), and Gross Margins. When an engineer attempts to justify an infrastructure overhaul using pure engineering jargon, the business stakeholder tunes out because they cannot map the technical inputs to their business balance sheet."
)
d['parts'][1]['say'].append(
    "The master tech lead creates a permanent bridge by maintaining an explicit mapping between technical telemetry and business KPIs: 1. P99 Latency maps directly to Checkout Abandonment and User Conversion; 2. Database Connection Pooling maps to Cloud Infrastructure Spend and Multi-Tenant Security Isolation; 3. Automated CI/CD Pipelines map to Time-to-Market Velocity and Developer Headcount Efficiency; 4. Zero-Downtime Blue-Green Deployments map to Enterprise Contract SLA Compliance and Brand Reputation Protection."
)
d['parts'][1]['say'].append(
    "When you speak to the Chief Marketing Officer, you do not talk about caching algorithms; you talk about conversion rates during the Black Friday ad campaign. When you speak to the Chief Financial Officer, you do not talk about optimizing memory usage in Go; you talk about slashing $45,000 off next quarter's AWS compute bill. By consistently framing technical excellence through the lens of financial and commercial stewardship, you command unconditional executive respect."
)

# Part 3 is 323 words: Add ~420 words
d['parts'][2]['say'].append(
    "Let us examine how to facilitate an Interest-Based Relational mediation session when technical tempers flare: In complex software systems, architectural disagreements are rarely trivial. Two senior engineers might spend four weeks arguing over whether to build a centralized GraphQL gateway versus decentralized RESTful microservices. Each engineer has invested substantial cognitive effort into their design doc; their professional reputations feel at stake. In a traditional meeting, the conversation quickly degenerates into sarcastic remarks, passive-aggressive comments in RFC docs, and political lobbying."
)
d['parts'][2]['say'].append(
    "The master engineering mediator steps in with calm authority: First, they validate the passion of both engineers: 'I want to thank both Alex and David for the incredible architectural rigor you've brought to this debate. It is a privilege to work with engineers who care so deeply about our system's future.' This immediately establishes psychological safety and honors their dignity. Second, the mediator draws a line down the center of the whiteboard and writes: 'Shared Team Interests.' They ask: 'What do both of our proposals want for our users and our team?' Both engineers agree: We want fast mobile response times, minimal backend maintenance overhead, and clear API contracts."
)
d['parts'][2]['say'].append(
    "Third, the mediator shifts the focus to Objective Empirical Criteria: 'Instead of debating theoretical virtues, let us define our evaluation benchmarks: 1. Network payload size on 3G mobile networks; 2. Edge CDN caching hit rates; 3. Schema migration complexity across ten services. Let us spend three days running synthetic spikes on both prototypes and measure the results against these exact criteria.' By replacing subjective opinions with verifiable empirical metrics, the mediator transforms a bitter political feud into a collaborative scientific experiment."
)

# Part 4 is 349 words: Add ~380 words
d['parts'][3]['say'].append(
    "Let us explore how to deliver an SCR executive crisis briefing when the root cause of an outage is still unknown: One of the most terrifying moments for an engineering leader is having the Chief Executive Officer or Vice President join an emergency bridge forty-five minutes into a major production outage, demanding: 'What happened? Why is the site down?' An inexperienced lead freezes or babbles: 'We don't know yet! It could be AWS, or maybe Redis crashed, or someone pushed bad code.' This triggers immediate executive panic."
)
d['parts'][3]['say'].append(
    "The master tech lead delivers an authoritative SCR briefing even amidst partial information: **Situation:** 'Our checkout service experienced an abrupt 40% error rate starting at 2:15 PM UTC, impacting approximately 1,200 European users.'; **Complication:** 'Our preliminary telemetry indicates database connection starvation, but the underlying root trigger is still being isolated across our connection pool and network gateway.'; **Resolution:** 'We have divided our response into two parallel tracks: Lead SRE Marcus has rolled back the 2:00 PM deployment to rule out code regressions, while Staff Database Architect Sarah is profiling active lock contention on the primary database cluster. We have established our dedicated update cadence in `#incident-exec-updates`, and our next structured status briefing will be published in exactly twenty minutes at 2:50 PM UTC.'"
)
d['parts'][3]['say'].append(
    "Notice the effect: Even though the root cause is not yet pinpointed, the executive feels total confidence! They see a calm, disciplined command structure, parallel diagnostic tracks, explicit ownership, and a predictable communication rhythm. Executive presence is not about having all the answers instantly; it is about projecting calm, systematic command in the face of chaos."
)

# Part 5 is 253 words: Add ~480 words
d['parts'][4]['say'].append(
    "Let us examine the profound career trajectory unlocked by completing Milestone 2: In the global technology landscape, there are millions of developers who can write functional code. But software developers who possess the rare trifecta of Deep Architectural Brilliance, Master Business Translation, and Sovereign Emotional Poise represent less than 1% of the entire engineering workforce. These are the rare individuals who are entrusted with multi-million-dollar technology budgets, who architect mission-critical national infrastructure, and who ascend to roles as Staff Engineers, Principal Architects, Fellows, and Chief Technology Officers."
)
d['parts'][4]['say'].append(
    "Consider how you will approach your upcoming engineering challenges: When you encounter an ambiguous project requirement, you will not grumble—you will deploy principled negotiation to discover underlying interests and establish feasible ZOPA boundaries. When an outage strikes, you will not panic—you will orchestrate blameless SCR communications that preserve executive trust. When a junior colleague struggles, you will not judge—you will deliver surgical SBI feedback and foster psychological safety. And when you design complex systems, you will defend your Maker's Schedule to ensure your mind operates at peak intellectual flow."
)
d['parts'][4]['say'].append(
    "As we prepare to transition into Milestone 3—where we apply these master communication principles to Tech Resume Engineering, LinkedIn Personal Branding, and Advanced Behavioral & System Design Interview Mastery—take a moment to recognize the profound transformation in your professional identity. You have mastered the human operating system of software engineering. You are equipped with the unshakeable tools of leadership, persuasion, empathy, and resilience."
)
d['parts'][4]['say'].append(
    "Step forward into your engineering career with supreme confidence. You are not merely building software; you are leading human beings, solving society's most difficult technological challenges, and authoring the future of computing."
)

with open('scripts/make_soft_skills_day15.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_15():\n")
    f.write("    return " + json.dumps(d, indent=4) + "\n")

print("Day 15 successfully boosted!")
