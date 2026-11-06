import json

with open('scripts/make_soft_skills_day06.py', 'r', encoding='utf-8') as f:
    text = f.read()

from scripts.make_soft_skills_day06 import get_day_06
d = get_day_06()

# Part 1 boost
d['parts'][0]['say'].append(
    "Let us examine how senior engineering leaders cultivate cognitive empathy in practice: They establish structured Communication Pre-flight Checklists before high-stakes cross-functional engagements. When authoring an architectural RFC, design proposal, or post-incident review for cross-functional consumption, the engineering author asks: What are the three non-negotiable takeaways? Have I defined every specialized term? Am I connecting every technical constraint directly to customer experience or organizational risk? By rigorously applying these pre-flight checks, technical leaders eliminate ambiguity, prevent adversarial defensive posturing, and foster a collaborative environment where product managers, designers, and executives feel like trusted co-architects of technological strategy."
)

# Part 2 boost
# Part 2 has 650, which is already >= 620! Let's ensure it stays strong.

# Part 3 boost
d['parts'][2]['say'].append(
    "Let us explore how to structure an Executive Technical Debt Investment Proposal: When presenting to the Chief Technology Officer and Chief Product Officer, senior engineers employ the 'Cost of Inaction' (COI) framework. Most developers only describe the benefits of refactoring; elite engineering leaders detail the catastrophic compound interest accrued by doing nothing. They present concrete historical data: 'Over the past six months, unoptimized database queries caused 14 minor degradation events and 2 severe customer-facing outages during peak traffic hours, requiring 120 person-hours of emergency triage and resulting in $45,000 in customer service concession credits. If we do not address this architectural debt this quarter, our projected 40 percent user growth during the upcoming holiday season will exceed database connection limits, risking a multi-hour complete outage during our highest-grossing weekend of the year.' Framing technical debt around the Cost of Inaction makes infrastructure maintenance a strategic necessity rather than an optional engineering indulgence."
)
d['parts'][2]['say'].append(
    "Furthermore, technical leaders link infrastructure health directly to talent retention and developer happiness. Elite software engineers do not leave companies because the work is too challenging; they leave because they spend 60 percent of their week battling brittle legacy code, waiting for 50-minute test suites, and manually deploying fragile microservices at 2 AM. By demonstrating that technical debt remediation liberates engineering capacity and reduces developer attrition, technical leaders present an unassailable business case that unites Human Resources, Finance, and Product around engineering excellence."
)

# Part 4 boost
d['parts'][3]['say'].append(
    "Let us analyze the psychological dynamics of collaborative scope negotiation during sprint planning: When a Product Manager feels that Engineering is constantly pushing back or making excuses, they begin inflating estimations or micromanaging delivery dates out of self-defense. To dismantle this adversarial dynamic, engineering leads practice Transparent Capacity Accounting. During backlog refinement, the engineering team visualizes the total team bandwidth as a literal finite pie chart: 60 percent dedicated to core product feature roadmap, 20 percent dedicated to technical debt and platform reliability, and 20 percent reserved for operational interrupts, bug fixes, and security patches."
)
d['parts'][3]['say'].append(
    "When Product leadership requests an additional high-priority initiative mid-sprint, the engineering lead pulls up the Transparent Capacity Accounting chart and collaboratively invites Product to make the allocation decision: 'Our team bandwidth is currently at 100 percent allocation. We can certainly absorb this critical new partner integration! To fit it into this sprint cycle, should we draw the required 20 story points from next week\\'s reporting dashboard or defer the secondary profile settings feature?' This shifts the conversation from an emotional tug-of-war into a calm, rational portfolio management session where Product owns the trade-off with complete transparency."
)

# Part 5 boost
d['parts'][4]['say'].append(
    "Let us examine the tangible career trajectory unlocked by mastering cross-functional alignment: In engineering compensation and promotion calibration committees, technical competence is merely the baseline table stakes. What elevates an engineer from a Senior level (L5) to Staff (L6), Principal (L7), and Distinguished (L8) is Organizational Leverage: The measurable ability to multiply the effectiveness of surrounding teams, influence product strategy without formal managerial authority, and bridge executive vision with technological execution."
)
d['parts'][4]['say'].append(
    "Staff+ engineers are sought out by Vice Presidents of Product and Chief Executives not because they type code faster than junior developers, but because they possess the rare ability to translate high-stakes business ambiguity into clear, robust architectural execution roadmaps. They attend executive roadmap summits, ask incisive questions that uncover hidden constraints, calm anxious non-technical stakeholders during severe production outages, and ensure that every line of code written by their squads moves the enterprise toward durable commercial success."
)
d['parts'][4]['say'].append(
    "By establishing the Master Cross-Functional Communication Suite within your daily engineering practice, you transcend the limitations of pure syntax and become a true technical leader. You become the engineer who can debate distributed consensus algorithms with systems architects in the morning, collaborate with UX designers on intuitive workflow states at lunch, negotiate sprint allocations with product managers in the afternoon, and pitch a multimillion-dollar cloud infrastructure modernization initiative to the Board of Directors before the day concludes."
)

# Write back to make_soft_skills_day06.py
with open('scripts/make_soft_skills_day06.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_06():\n")
    f.write(f"    return {json.dumps(d, indent=4, ensure_ascii=False)}\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    d = get_day_06()\n')
    f.write('    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]\n')
    f.write('    total = sum(words)\n')
    f.write('    print(f"Day 6 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")\n')

print("Boosted Day 6 successfully!")
