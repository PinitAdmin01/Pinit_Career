import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day10 import get_day_10
d = get_day_10()

# Part 1: Top-down vs bottom-up (Currently 617 words)
d['parts'][0]['say'].append(
    "Let us explore how top-down communication transforms the psychological dynamic during high-stakes investment committee reviews: When engineering directors present annual capital expenditure requests to Chief Financial Officers and executive boards, the room is inherently primed to scrutinize every cost line item. An engineer who spends twenty minutes outlining server hardware specs and network topologies puts the CFO on high alert, creating an adversarial atmosphere where the CFO looks for ways to slash the budget. By contrast, when the engineering presenter leads on Slide 1 with: 'Recommendation: Invest $500,000 in Kubernetes multi-region clustering to eliminate $2.4M in potential downtime during Black Friday surges, generating an immediate 4.8x ROI within four months', the CFO's mindset shifts instantly from cost reduction to risk mitigation and revenue protection. Leading with the outcome frames technology not as an expensive operational burden, but as a strategic business multiplier."
)

# Part 2: Minto Pyramid & MECE (Currently 518 words)
d['parts'][1]['say'].append(
    "Let us examine how to construct bulletproof inductive groupings under intense executive cross-examination: In executive committee presentations, leaders frequently challenge a presenter's logic by asking: 'Why did you choose these three pillars? What else did you consider?' If your supporting pillars were brainstormed casually without MECE rigor, you will stumble and appear unprepared. However, when you have applied MECE discipline, you can answer with absolute authority: 'We evaluated our proposal across the three mutually exclusive operational dimensions that impact our business: Infrastructure Performance, Total Cost of Ownership, and Developer Deployment Velocity. Under Performance, our benchmarks prove a 4x latency reduction; under Cost, our cloud models project a $144k annual savings; and under Velocity, decoupled CI/CD pipelines cut PR merge times from three days to four hours.'"
)
d['parts'][1]['say'].append(
    "Notice how this structured inductive defense disarms skepticism: The executive realizes that every conceivable objection has already been anticipated, categorized, and quantitatively evaluated. The conversation never devolves into disorganized squabbling because the Minto Pyramid provides an unshakeable scaffolding of structured logical reasoning that withstands the most rigorous executive scrutiny."
)

# Part 3: The SCQA Narrative Arc (Currently 539 words)
d['parts'][2]['say'].append(
    "Let us analyze why beginning with an uncontroversial Situation is the definitive secret to disarming cynical stakeholders: In large technology enterprises, cross-functional proposals often face silent political resistance from skeptical department heads—such as Product Directors who fear engineering refactors will steal sprint capacity from customer-facing feature roadmaps. If an engineer opens their presentation by declaring: 'Our architecture is outdated and we need to pause feature development for six weeks to rewrite our database layer', the Product Director immediately arms their political defenses, preparing to shoot down the proposal."
)
d['parts'][2]['say'].append(
    "By deploying SCQA, the engineer disarms this resistance before it can even form: They begin with a Situation that celebrates the Product Director's recent wins: 'Over the past three quarters, our product squad has launched four flagship features that accelerated user signups by 180%, achieving record customer acquisition.' The Product Director smiles and nods in agreement. The engineer then introduces the Complication: 'However, this remarkable 180% growth has pushed our primary transactional database to 94% CPU utilization during peak hours, and synthetic stress testing proves that the upcoming Q4 promotional launch will trigger database connection drops and checkout failure.' Now, the Product Director does not view the refactor as a competitor for sprint capacity; they view it as the essential lifeline required to protect their own growth metrics. SCQA converts potential adversaries into passionate co-sponsors."
)

# Part 4: High-Signal Visual Slide Design (Currently 445 words)
d['parts'][3]['say'].append(
    "Let us explore how to translate complex distributed systems architectures into high-signal presentation diagrams: In formal Architecture Design Documents (RFCs), engineers write comprehensive diagrams detailing every VPC, subnet, ingress controller, sidecar proxy, and message topic. In a live executive slide presentation, however, projecting an RFC diagram containing forty boxes and crisscrossing lines is visual suicide. Executives cannot decipher where to look, their eyes glaze over, and you lose command of the room."
)
d['parts'][3]['say'].append(
    "High-signal presentation design requires 'Visual Abstraction Hierarchy': You strip away implementation minutiae and present only the conceptual data flow—typically three to five prominent components rendered with bold visual contrast. If you are proposing an event-driven architecture, your presentation slide shows only: Client App -> API Gateway -> EventBridge Buffer -> Decoupled Workers. You highlight the EventBridge Buffer in bright green to visually anchor the core innovation. If an architect in the back of the room asks about subnet routing or IAM role policies, you do not clutter the main slide; you instantly jump to Appendix Slide A-7, which displays the full enterprise VPC network topology. This dual strategy keeps your executive narrative clean and impactful while maintaining total technical credibility."
)

# Part 5: Master Technical Presentation Suite (Currently 373 words)
d['parts'][4]['say'].append(
    "Let us examine how master technical communicators rehearse and deliver their presentations: Delivering an exceptional technical deck is not merely about having well-designed slides; it is a performance of executive poise, vocal modulation, and empathetic presence. Elite presenters practice the 'Rule of the First 60 Seconds': They rehearse their opening BLUF and SCQA narrative until it flows effortlessly from memory, ensuring they maintain unbroken eye contact with the room or camera without once glancing down at notes or reading from the screen."
)
d['parts'][4]['say'].append(
    "Furthermore, they master the art of 'The Strategic Pause': When delivering a critical insight or stating a major recommendation ('Migrating to CockroachDB eliminates $450k in annual downtime'), an inexperienced engineer rushes onward nervously into sub-bullets. An executive-ready leader delivers the statement calmly, stops speaking, and pauses for three full seconds. This deliberate silence allows the profound business significance of the recommendation to register in the executive's working memory, exuding supreme confidence and commanding absolute authority."
)
d['parts'][4]['say'].append(
    "By operationalizing the complete Master Technical Presentation Suite—Top-Down Inversion, Barbara Minto's MECE Pyramid, the SCQA Narrative Arc, High-Signal Visual Design, and Executive Q&A Appendix Architecture—you unlock the ultimate career accelerator. You transition from an engineer who merely executes tasks assigned by others into an influential technical visionary who shapes organizational strategy, commands executive investment, and drives transformative technological innovation across the entire enterprise."
)
d['parts'][4]['say'].append(
    "In executive promotion deliberations and Staff-plus technical leadership reviews, the distinction between a Senior Engineer and a Principal Engineer often boils down to communication caliber: Senior engineers build great systems, but Principal engineers convince the organization to build the right systems. When you stand before leadership with an airtight Minto Pyramid, a captivating SCQA narrative, and high-signal visual clarity, you prove that you possess both the deep technical mastery and the executive presence required to guide the company's architectural destiny."
)

# Write clean make_soft_skills_day10.py with json.dumps
with open('scripts/make_soft_skills_day10.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_10():\n")
    f.write(f"    return {json.dumps(d, indent=4, ensure_ascii=False)}\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    d = get_day_10()\n')
    f.write('    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]\n')
    f.write('    total = sum(words)\n')
    f.write('    print(f"Day 10 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")\n')

print("Boosted Day 10 successfully!")
