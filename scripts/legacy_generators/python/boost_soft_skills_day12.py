import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day12 import get_day_12
d = get_day_12()

# Part 1 is 732 words (already > 700)

# Part 2 is 633 words: Add ~150 words
d['parts'][1]['say'].append(
    "Let us explore how to mathematically model multiple concurrent negotiation dimensions using multi-attribute utility theory: In real-world software roadmaps, you are rarely negotiating on time alone. You are simultaneously trading off time, cloud infrastructure operational cost, code test coverage percentages, and user story point capacity. A senior tech lead constructs a multi-variable trade-off curve: If Product requires a delivery date compressed by 20%, Engineering demonstrates the compensatory adjustments required—either reducing test automation scope by transferring regression testing to temporary QA contractors, or increasing infrastructure spend by running auto-scaling clusters on premium GPU compute instances. By mapping these multidimensional trade-offs explicitly, you replace binary arguments with sophisticated portfolio optimization."
)
d['parts'][1]['say'].append(
    "Furthermore, calculating ZOPA overlap provides emotional insulation during contentious planning meetings: When an executive demands an aggressive target date, an untrained engineer feels personally attacked and becomes combative. An engineer grounded in ZOPA mathematics remains emotionally neutral: They recognize that the executive's reservation boundary simply reflects external business pressures, such as investor milestones or customer acquisition windows. Instead of trading insults, the engineer calmly charts the two reservation limits on a whiteboard, demonstrates the non-overlapping gap, and invites the executive to collaborate on unbundling non-critical requirements to manufacture positive overlap."
)

# Part 3 is 563 words: Add ~250 words
d['parts'][2]['say'].append(
    "Let us examine how to establish organizational credibility before you ever need to invoke a technical BATNA: A BATNA cannot be an empty bluff or a last-minute hallucination cooked up during a contentious meeting. If you propose using a third-party managed SaaS or deploying a simplified asynchronous cron job, executive leadership will immediately ask: 'Has security vetted this vendor? What is the data egress pricing? How does this integrate with our single sign-on?' If you stammer or admit that you have not reviewed their SOC2 report, your BATNA collapses, and your negotiating leverage evaporates."
)
d['parts'][2]['say'].append(
    "Elite engineers validate and pre-flight their BATNAs ahead of time: Before stepping into the quarterly roadmap negotiation, they conduct a two-day spike investigation, spin up a sandbox proof-of-concept, review compliance documentation, and draft a one-page technical memo. When they present the fallback option, it is completely vetted, fully priced, and ready for immediate deployment. This rigorous diligence demonstrates profound technical maturity, transforming a potential impasse into an executive masterclass in risk mitigation."
)
d['parts'][2]['say'].append(
    "Additionally, consider the psychological safety that a strong BATNA provides to junior developers on your team: When a tech lead lacks a viable BATNA, they absorb executive pressure and pass it downward, forcing junior engineers into unpaid overtime and stressful weekend work. A courageous tech lead with a validated BATNA acts as an immovable shield: They protect junior team members from unsustainable crunch by presenting viable technical alternatives to executive leadership, preserving team morale, preventing attrition, and sustaining long-term engineering velocity."
)

# Part 4 is 612 words: Add ~180 words
d['parts'][3]['say'].append(
    "Let us analyze how cognitive anchoring bias manifests during compensation and leveling negotiations: Just as anchoring distorts sprint estimation poker, it heavily influences career milestones. When an engineer enters a performance review and waits for management to propose a compensation adjustment, management frequently anchors with a modest standard cost-of-living increment (e.g. 3%). Once that anchor is set, negotiating a significant market-rate raise requires battling uphill against that baseline. Senior engineers establish proactive, empirical anchors: They compile verifiable industry salary percentiles (from Levels.fyi or Radford benchmarks), document their quantified business impact (such as reducing cloud infrastructure spend by $180,000 or mentoring four junior engineers to promotion), and introduce their expectations early with objective evidence."
)
d['parts'][3]['say'].append(
    "Furthermore, understanding the Iron Triangle provides a universal framework for cross-functional alignment: When product managers, marketing directors, and financial controllers learn that the engineering team operates by the immutable laws of Scope, Schedule, and Budget, organizational friction drops dramatically. Business partners realize that pushing for tighter deadlines does not mean engineers are stubborn; it simply means the business must make conscious, deliberate scope prioritization decisions rather than pretending trade-offs do not exist."
)

# Part 5 is 382 words: Add ~380 words
d['parts'][4]['say'].append(
    "Let us examine the strategic cadence of executive persuasion during multi-month enterprise initiatives: High-stakes technical alignment is rarely achieved in a single dramatic ninety-minute meeting. If you spring a radical architectural pivot or a major deadline extension on executive stakeholders during a formal steering committee review, you will encounter intense resistance, regardless of how elegant your ZOPA calculations or BATNA options are. Human beings resist surprises, especially when budgets and public commitments are at stake."
)
d['parts'][4]['say'].append(
    "Staff engineers and engineering directors utilize the ancient political art of 'Nemawashi' (the Japanese concept of quietly laying the groundwork and building informal consensus before a formal meeting): Days before the steering committee convenes, the tech lead schedules brief, ten-minute one-on-one alignment chats with each key stakeholder—the Product Director, the Security Architect, and the Finance Lead. In these informal settings, the lead shares the preliminary ZOPA analysis, walks through the candidate BATNAs, listens intently to their specific anxieties, and integrates their feedback into the proposal. By the time the formal meeting takes place, every leader in the room has already co-authored the solution, ensuring swift, unanimous executive endorsement."
)
d['parts'][4]['say'].append(
    "Let us examine how to handle irrational stakeholders who refuse to engage in principled negotiation: Occasionally, an engineer will encounter an executive or client who relies on intimidation, desk-pounding, or emotional manipulation ('If you don't ship this by Friday, I will question your commitment to this company'). Inexperienced engineers either capitulate out of terror or escalate with equal hostility. The principled engineer remains completely calm, unhooking emotionally from the provocation. They utilize William Ury's tactic of 'Going to the Balcony': mentally stepping back, observing the outburst without reacting, and redirecting the conversation back to objective reality: 'I understand the critical importance of this launch to our Q4 revenue. Let us look at our empirical test failure rate together and determine what combination of features we can deploy safely on Friday without risking customer data.' By refusing to enter the emotional ring, you force the conversation back onto the solid ground of empirical engineering truth."
)
d['parts'][4]['say'].append(
    "By internalizing the principles of Harvard negotiation, mathematical ZOPA analysis, validated technical BATNAs, and Iron Triangle trade-offs, you elevate your professional identity from a routine code implementer to a sovereign technical leader. You become the engineer that executives seek out during high-stakes strategic planning—the leader who can navigate complex organizational politics with grace, protect team well-being, and drive transformative technology initiatives to completion."
)

with open('scripts/make_soft_skills_day12.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_12():\n")
    f.write("    return " + json.dumps(d, indent=4) + "\n")

print("Day 12 successfully boosted!")
