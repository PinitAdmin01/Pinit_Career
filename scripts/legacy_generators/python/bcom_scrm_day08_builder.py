#!/usr/bin/env python3
"""
Day 8 Builder: Discovery Calls & The SPICED Qualification Framework
Course: B.Com Sales, Customer Success & CRM (bcom_scrm)
Block: 222 (Milestone 2: Outbound Sales, Cadences, Discovery & Pipeline Qualification)
Task: TASK-1179

Invariants:
- Exactly 5 parts
- Every part 'say' >= 580 words (>= 2950 words total)
- Real-world enterprise discovery examples
- Deterministic Python code with line notes (>= 3), tryIt, and Socratic check (4 options, valid answer index, non-empty why)
- Day 8 minutes: 45
"""

import json
from typing import Dict, List, Any

def get_day08_data() -> Dict[str, Any]:
    day = 8
    title = "Discovery Calls & The SPICED Qualification Framework"
    goal = "Master enterprise discovery call methodology, the SPICED qualification framework, negative business impact quantification, critical event backward planning, and decision criteria alignment."
    minutes = 45
    recap = "In Day 7, we built multi-channel cadences, engineered domain deliverability, mastered 10-80-10 copywriting, and conquered cold calling pattern interrupts. Today, we step into the discovery room to convert initial interest into qualified enterprise pipeline."

    parts: List[Dict[str, Any]] = [
        # Part 1: Architecture of an Executive Discovery Call & Upfront Contracts
        {
            "title": "Architecture of an Executive Discovery Call & Upfront Contracts",
            "say": [
                "Welcome to Day 8 of B.Com Sales, Customer Success & CRM. Having successfully secured qualified meetings through our multi-channel outbound cadences and inbound speed-to-lead routing, we now enter the most critical conversion milestone in enterprise B2B sales: The Executive Discovery Call. In commercial selling, discovery is not a preliminary administrative chore or an interrogation checklist where a sales representative fires twenty generic questions at a weary buyer. Discovery is the strategic crucible where enterprise value is co-created, buyer urgency is catalyzed, and commercial deal velocity is determined.",
                "Tragically, amateur sales representatives commit what enterprise sales veterans call the 'Pitch-Slap'. The representative spends the first thirty seconds exchanging awkward pleasantries about the weather, asks two superficial questions ('What keeps you up at night?' or 'Tell me about your tech stack'), and then immediately launches into a forty-minute, sixty-slide corporate overview deck followed by an exhaustive, feature-by-feature product demonstration. When a representative rushes into premature product presentation before diagnosing the buyer's underlying operational pain, they commoditize their solution. The buyer nods politely, requests a generic price quote, and then ghosts the sales representative forever because no compelling business case was established.",
                "In sharp contrast, elite enterprise Account Executives structure discovery calls around the Upfront Contract methodology, pioneered by the Sandler Selling System and refined for modern SaaS enterprise transactions. An Upfront Contract is an explicit, mutual agreement established within the first three minutes of a call that establishes the Purpose, Process, and Payoff (the 3Ps) of the meeting, ensures equal business stature, and eliminates mutual sales friction.",
                "The anatomy of an elite Upfront Contract contains five synchronized components: First, Time Boundary Confirmation: 'Sarah, we have forty-five minutes scheduled today through two-fifteen. Does that hard stop still work for your calendar?' Confirming the time boundary respects executive schedules and prevents the prospect from suddenly cutting the call short at minute twenty. Second, The Prospect's Agenda: 'I prepared an agenda focused on your recent cloud migration telemetry, but before we dive in, what was the primary item you were hoping we would cover today?' This uncovers latent motivations and ensures the buyer feels heard. Third, The Commercial Purpose: 'The purpose of our discussion today is to explore how your engineering team manages cross-cloud data egress and evaluate whether our automated routing architecture aligns with your infrastructure roadmap.'",
                "Fourth, The Collaborative Process: 'To do that effectively, I'll be asking several detailed questions about your current network topology and incident workflows. Naturally, feel free to stop me at any point to ask questions about our platform or push back on anything that doesn't fit your operational reality.' Fifth, and most importantly, The Mutual Outcome (The Payoff): 'At the end of our forty-five minutes, one of two things will happen: either we'll discover that our architecture isn't a tight operational fit for your immediate priorities—in which case, we'll part as friends and shake hands with zero pressure—or we'll both see a substantial business opportunity to reduce your cloud spend, and our next step will be to schedule a technical architecture workshop with your cloud ops leads. Does that sound fair and reasonable?'",
                "Notice the profound psychological effect of giving the prospect explicit permission to say 'No'. When an Account Executive removes the threat of high-pressure sales manipulation, the buyer's defensive walls dissolve. Equal business stature is firmly established: the AE is not a supplicant begging for an order, but a trusted diagnostic specialist, akin to an orthopedic surgeon consulting with a patient before proposing an operation.",
                "In this first part, we construct a Discovery Call Upfront Contract & Agenda Evaluation Engine in Python. This tool evaluates whether an AE has fulfilled the essential structural prerequisites of an enterprise upfront contract, calculates contract integrity scores, and identifies structural risks before deep qualification begins."
            ],
            "example": "An Account Executive at a cloud compliance software company scheduled a 30-minute discovery call with the VP of Security at an enterprise bank. Instead of pitching their 40-feature platform, the AE established a crisp Upfront Contract: confirmed a 30-minute hard stop, asked for the VP's priority agenda items, and explicitly proposed that if compliance automation didn't address their imminent SOC2 audit deadline, they would conclude without further follow-up. Relieved by the absence of sales pressure, the VP openly revealed that they had failed an internal penetration test three days prior—an explosive latent pain that allowed the AE to tailor the conversation and book an immediate technical deep-dive.",
            "code": """# Discovery Call Upfront Contract & Agenda Evaluation Engine
from typing import Dict, Any

def score_discovery_agenda_and_contract(
    time_boundary_confirmed: bool,
    prospect_agenda_solicited: bool,
    commercial_purpose_stated: bool,
    collaborative_process_agreed: bool,
    permission_to_say_no_granted: bool,
    clear_next_step_payoff_defined: bool
) -> Dict[str, Any]:
    # Pillar Weights for Upfront Contract Integrity (Max 100)
    scores = {
        "time_boundary": 15 if time_boundary_confirmed else 0,
        "prospect_agenda": 20 if prospect_agenda_solicited else 0,
        "commercial_purpose": 15 if commercial_purpose_stated else 0,
        "collaborative_process": 15 if collaborative_process_agreed else 0,
        "permission_to_say_no": 20 if permission_to_say_no_granted else 0,
        "next_step_payoff": 15 if clear_next_step_payoff_defined else 0
    }
    
    total_integrity_score = sum(scores.values())
    
    # Evaluate Stature & Risk
    if total_integrity_score >= 90:
        stature = "PEER_LEVEL_TRUSTED_ADVISOR"
        contract_status = "UPFRONT_CONTRACT_ROBUST_CONFIRMED"
    elif total_integrity_score >= 65:
        stature = "VENDOR_SALESPERSON_TRANSACTIONAL"
        contract_status = "UPFRONT_CONTRACT_PARTIAL_RISK"
    else:
        stature = "SUPPLICANT_COMMODITY_PITCHMAN"
        contract_status = "UPFRONT_CONTRACT_ABSENT_PITCHSLAP_HAZARD"
        
    return {
        "integrity_score": total_integrity_score,
        "pillar_scores": scores,
        "business_stature": stature,
        "contract_status": contract_status,
        "equal_footing_achieved": permission_to_say_no_granted and prospect_agenda_solicited
    }

# Execute Upfront Contract Audits
poor_contract = score_discovery_agenda_and_contract(
    time_boundary_confirmed=True,
    prospect_agenda_solicited=False,
    commercial_purpose_stated=True,
    collaborative_process_agreed=False,
    permission_to_say_no_granted=False,
    clear_next_step_payoff_defined=False
)

elite_contract = score_discovery_agenda_and_contract(
    time_boundary_confirmed=True,
    prospect_agenda_solicited=True,
    commercial_purpose_stated=True,
    collaborative_process_agreed=True,
    permission_to_say_no_granted=True,
    clear_next_step_payoff_defined=True
)

print("Discovery Upfront Contract Structural Audit:")
print(f"  Amateur Contract: Score={poor_contract['integrity_score']}/100 | Stature={poor_contract['business_stature']} | Status={poor_contract['contract_status']}")
print(f"  Elite Contract: Score={elite_contract['integrity_score']}/100 | Stature={elite_contract['business_stature']} | Status={elite_contract['contract_status']}")
""",
            "output": """Discovery Upfront Contract Structural Audit:
  Amateur Contract: Score=30/100 | Stature=SUPPLICANT_COMMODITY_PITCHMAN | Status=UPFRONT_CONTRACT_ABSENT_PITCHSLAP_HAZARD
  Elite Contract: Score=100/100 | Stature=PEER_LEVEL_TRUSTED_ADVISOR | Status=UPFRONT_CONTRACT_ROBUST_CONFIRMED""",
            "codeNotes": [
                "Defines the score_discovery_agenda_and_contract function evaluating the six essential pillars of an executive upfront contract.",
                "Heavily weights granting the prospect explicit permission to say no (20 pts) and soliciting their agenda (20 pts).",
                "Demonstrates how formal upfront contracting elevates the AE from a supplicant pitchman to an accredited trusted advisor."
            ],
            "tryIt": "Set permission_to_say_no_granted=False in elite_contract to see how omitting psychological safety drops business stature to transactional.",
            "check": {
                "question": "Why is explicitly giving the prospect permission to say 'No' in an Upfront Contract essential for successful enterprise discovery?",
                "options": [
                    "It disarms the buyer's defensive resistance against sales manipulation and establishes peer-level psychological safety for transparent dialogue",
                    "It automatically registers the deal as lost in Salesforce to keep pipeline forecasts artificially low",
                    "It allows the salesperson to end the call immediately if the prospect asks difficult technical questions",
                    "It is legally required by international consumer protection treaties before discussing pricing"
                ],
                "answer": 0,
                "why": "Granting permission to say 'No' neutralizes defensive buyer suspicion, eliminates sales pressure, and establishes equal business stature."
            }
        },

        # Part 2: The SPICED Framework: Situation, Pain & Root Cause Diagnosis
        {
            "title": "The SPICED Framework: Situation, Pain & Root Cause Diagnosis",
            "say": [
                "Once an Upfront Contract establishes mutual trust and equal stature, the Account Executive transitions into diagnostic qualification. In complex enterprise B2B sales, traditional qualification acronyms like BANT (Budget, Authority, Need, Timing)—formulated by IBM in the 1960s—are fundamentally obsolete. Modern enterprise software is rarely bought through static line-item budgets sitting in a bank account waiting for a vendor; rather, when compelling business pain is diagnosed and quantified, executive leadership actively creates new budget by reallocating capital from less urgent projects.",
                "To reflect how modern enterprise software is evaluated and procured, elite revenue organizations deploy the SPICED Framework, pioneered by Winning by Design. SPICED is an acronym representing the five foundational pillars of an enterprise deal: S stands for Situation (the current facts and operating background); P stands for Pain (the specific operational bottlenecks and emotional frustrations); I stands for Impact (the quantified negative business impact on revenue, cost, and risk); C stands for Critical Event (the hard external deadline driving urgency); and ED stands for Decision Criteria and Decision Process.",
                "In this part, we examine the critical distinction between Situation and Pain, and how to execute deep Root Cause Diagnosis. Most junior sales reps spend eighty percent of their discovery time cataloging Situation facts: 'How many employees do you have?', 'What database version are you running?', 'Which marketing automation tool do you use?' These questions are readily answerable via public LinkedIn data, job descriptions, and tech-lookup scrapers like BuiltWith. Interrogating an executive on basic situational facts wastes precious discovery minutes and irritates the buyer.",
                "Elite discovery rapidly acknowledges Situation facts and pivots immediately to Pain diagnosis. In commercial sales, pain exists on three hierarchical levels: Surface Level (the initial symptom), Operational Level (the workflow breakdown), and Emotional/Executive Level (the personal consequence). For example, when a Chief Information Officer remarks, 'Our customer onboarding is taking too long,' that is a surface symptom. An amateur immediately pitches: 'Our onboarding wizard accelerates onboarding by fifty percent!' An elite diagnostician peels back the onion using the 'Five Whys' and root-cause inquiry: 'Help me understand what happens when an enterprise onboarding stalls. Where in the workflow does the process get blocked?'",
                "As the CIO elaborates, the Operational Pain emerges: 'Our engineers have to manually write custom ETL connectors for every client's legacy database, which takes four weeks of back-and-forth debugging.' The AE probes deeper to uncover the Emotional and Executive Pain: 'What does that four-week delay mean for your engineering capacity and customer churn?' The CIO reveals: 'It means our senior infrastructure engineers are burning out doing routine data plumbing instead of building our core product, and two marquee enterprise customers threatened to cancel contracts because they haven't seen value after sixty days. If we miss our net revenue retention target this quarter, the board will freeze all engineering hiring.'",
                "Now the AE has diagnosed true enterprise pain. The software is no longer competing against other ETL tools; it is positioned as the strategic mechanism to prevent customer churn, stop engineer burnout, and protect board-level expansion plans. The diagnostic conversation transforms the seller from a feature vendor into a strategic business savior.",
                "Crucially, the sales representative must distinguish between Active Pain and Latent Pain. Active pain is already acknowledged by the executive; they are feeling the bleeding and actively seeking a remedy. Latent pain, however, is far more prevalent in enterprise environments: the customer has grown accustomed to the operational friction, considering chronic manual spreadsheets or constant weekend escalations to be 'just part of the job'. Uncovering latent pain requires provocative peer benchmarking: 'Most VPs of Infrastructure tell us that when their team scales past twenty engineers, manual schema migrations start creating silent staging environment drift. How is your team currently ensuring schema parity between staging and production?'",
                "Furthermore, diagnostic mastery requires testing whether the pain is urgent enough to compel change right now. In enterprise sales, 'No Decision' is the single largest competitor, accounting for more than forty percent of stalled pipeline. By asking consequence-oriented diagnostic questions—such as 'What happens if you decide to leave this workflow unchanged for the next two quarters?'—the AE forces the buyer to confront the reality that living with the status quo carries far greater organizational risk than adopting a new technology.",
                "In this second part, we implement a SPICED Pain Diagnostic Engine in Python. This system parses discovery call inputs, evaluates pain depth across surface, operational, and executive dimensions, validates root cause identification, and calculates an objective Pain Severity Index."
            ],
            "example": "A fintech SaaS startup pitchman asked a prospective Head of Fraud, 'What fraud tool do you use?' and pitched fraud detection algorithms. The deal stalled. A senior AE stepped in and asked, 'When a fraudulent transaction bypasses your verification gateway, who has to investigate it, how many hours does that take, and what happens when chargebacks exceed the 1.0% Visa threshold?' The Head of Fraud confessed that if chargebacks rose another 0.15%, Visa would suspend their merchant processing capabilities entirely—a catastrophic root-cause risk that immediately justified an eight-week enterprise rollout.",
            "code": """# SPICED Pain Diagnostic & Root Cause Evaluation Engine
from typing import Dict, Any, List

def score_spiced_pain_diagnosis(
    situation_facts_confirmed: bool,
    surface_symptom_identified: str,
    operational_breakdown_mapped: str,
    executive_personal_impact_uncovered: str,
    five_whys_depth_level: int, # 1 to 5
    root_cause_isolated: bool
) -> Dict[str, Any]:
    # 1. Evaluate Pain Depth Hierarchy (Max 60 points)
    depth_score = 0
    if surface_symptom_identified:
        depth_score += 15
    if operational_breakdown_mapped:
        depth_score += 20
    if executive_personal_impact_uncovered:
        depth_score += 25
        
    # 2. Inquiry Rigor Score based on 5-Whys depth (Max 25 points)
    inquiry_score = min(five_whys_depth_level * 5, 25)
    
    # 3. Root Cause Isolation Bonus (Max 15 points)
    root_cause_score = 15 if root_cause_isolated else 0
    
    composite_pain_severity_score = depth_score + inquiry_score + root_cause_score
    
    # Categorize Pain Maturity
    if composite_pain_severity_score >= 85 and executive_personal_impact_uncovered:
        pain_grade = "TIER_1_COMPELLING_EXECUTIVE_PAIN"
        deal_priority = "BOARD_LEVEL_URGENT"
    elif composite_pain_severity_score >= 60:
        pain_grade = "TIER_2_OPERATIONAL_INCONVENIENCE"
        deal_priority = "DEPARTMENTAL_NORMAL"
    else:
        pain_grade = "TIER_3_SURFACE_TRIVIAL_PAIN"
        deal_priority = "NICE_TO_HAVE_STALL_RISK"
        
    return {
        "surface_symptom": surface_symptom_identified,
        "operational_breakdown": operational_breakdown_mapped,
        "executive_impact": executive_personal_impact_uncovered,
        "five_whys_depth": five_whys_depth_level,
        "root_cause_isolated": root_cause_isolated,
        "composite_pain_score": composite_pain_severity_score,
        "pain_grade": pain_grade,
        "deal_priority": deal_priority
    }

# Execute SPICED Pain Audits
shallow_pain = score_spiced_pain_diagnosis(
    situation_facts_confirmed=True,
    surface_symptom_identified="Data syncing is slow",
    operational_breakdown_mapped="",
    executive_personal_impact_uncovered="",
    five_whys_depth_level=1,
    root_cause_isolated=False
)

profound_pain = score_spiced_pain_diagnosis(
    situation_facts_confirmed=True,
    surface_symptom_identified="Client onboarding takes 30 days instead of 5",
    operational_breakdown_mapped="Engineers spend 20 hours/week manually coding custom ETL connectors",
    executive_personal_impact_uncovered="Senior churn risk, $800k deferred ARR recognition, and board hiring freeze",
    five_whys_depth_level=4,
    root_cause_isolated=True
)

print("SPICED Pain Diagnosis Comparative Audit:")
print(f"  Shallow Discovery: Score={shallow_pain['composite_pain_score']}/100 | Grade={shallow_pain['pain_grade']} | Priority={shallow_pain['deal_priority']}")
print(f"  Profound Discovery: Score={profound_pain['composite_pain_score']}/100 | Grade={profound_pain['pain_grade']} | Priority={profound_pain['deal_priority']}")
""",
            "output": """SPICED Pain Diagnosis Comparative Audit:
  Shallow Discovery: Score=20/100 | Grade=TIER_3_SURFACE_TRIVIAL_PAIN | Priority=NICE_TO_HAVE_STALL_RISK
  Profound Discovery: Score=95/100 | Grade=TIER_1_COMPELLING_EXECUTIVE_PAIN | Priority=BOARD_LEVEL_URGENT""",
            "codeNotes": [
                "Implements the score_spiced_pain_diagnosis function modeling the three-tier pain hierarchy (surface, operational, executive).",
                "Rewards deep 5-Whys root-cause inquiry, penalizing superficial symptom cataloging.",
                "Proves that uncovering board-level executive consequences elevates an opportunity from a nice-to-have stall to urgent priority."
            ],
            "tryIt": "Set root_cause_isolated=False in profound_pain to see how failure to isolate the mechanical bottleneck reduces the audit score.",
            "check": {
                "question": "What is the primary danger of failing to probe beyond surface-level symptoms during B2B sales discovery?",
                "options": [
                    "The deal will be treated as a low-priority 'nice-to-have' and will inevitably stall or lose out to internal budget competing priorities",
                    "The customer will file a formal complaint with the Better Business Bureau",
                    "Software engineering teams will refuse to deploy cloud licenses to the client",
                    "Sales compensation plans automatically cut commission rates in half for deals without root causes"
                ],
                "answer": 0,
                "why": "Without connecting operational pain to executive consequences, deals lack urgency, fail to unlock budget, and succumb to inaction or competing corporate priorities."
            }
        },

        # Part 3: Quantifying Negative Business Impact (NBI) & Cost of Inaction (COI)
        {
            "title": "Quantifying Negative Business Impact (NBI) & Cost of Inaction (COI)",
            "say": [
                "In enterprise sales governance, emotional pain opens the buyer's mind, but quantified financial impact writes the check. The third pillar of the SPICED methodology—Impact (I)—represents the mathematical quantification of the customer's problem. Every modern enterprise transaction exceeding $50,000 in Annual Contract Value (ACV) must ultimately pass through the Office of the Chief Financial Officer (CFO) or an executive procurement committee. CFOs do not care about elegant user interfaces, microservice architectures, or machine learning buzzwords; CFOs care about Return on Investment (ROI), Capital Allocation Efficiency, and Risk Mitigation.",
                "To build an airtight business case that wins CFO approval, an Account Executive must collaboratively co-author the calculation of Negative Business Impact (NBI) and Cost of Inaction (COI) alongside the prospect during the discovery phase. If the AE calculates the ROI in a vacuum and emails a generic spreadsheet to the buyer, the numbers carry zero psychological ownership. The AE must guide the buyer to supply the numbers themselves: 'Sarah, how many engineers work on custom connectors? What is the fully loaded hourly cost of an engineer at your firm? If they spend twenty hours a week on manual fixes, what does that cost your business over a twelve-month calendar year?'",
                "Negative Business Impact consists of four quantifiable vectors: Vector One: Direct Labor Waste (Wasted Engineering or Operational Hours multiplied by Fully Loaded Hourly Compensation); Vector Two: Revenue Leakage and Deferred ARR (Delayed time-to-value causing lost subscription fees or delayed contract start dates); Vector Three: Customer Churn and Net Retention Loss (The enterprise value lost when dissatisfied clients cancel contracts); and Vector Four: Regulatory Non-Compliance and SLA Penalties (Contractual liquidated damages or statutory fines incurred due to operational failure).",
                "Once the total annual Negative Business Impact is tabulated, the AE establishes the Cost of Inaction (COI). The Cost of Inaction answers the single most formidable objection in enterprise software: 'Why don't we just wait until next year and do this in Q3?' By dividing the annual NBI into monthly and daily increments, the AE makes the financial cost of waiting immediately palpable: 'John, your team is currently losing $120,000 every single month to manual data reconciliation. If you defer this decision by four months, you are not saving money; you are consciously choosing to burn $480,000 of cash that can never be recovered.'",
                "Furthermore, the AE compares the Cost of Inaction against the prospective software investment. If the proposed software platform costs $80,000 annually, but eliminates $650,000 in validated Negative Business Impact, the net annual financial benefit is $570,000, representing an ROI multiple of 8.1x and a payback period of less than two months. Buying the software is no longer perceived as a discretionary expenditure; it is an immediate financial savings mechanism.",
                "In enterprise financial modeling, CFOs also scrutinize sensitivity and payback horizons. An elite Account Executive prepares a three-scenario sensitivity matrix: Conservative (capturing only 40% of projected efficiency gains), Expected (70% gains), and Optimistic (100% gains). When the AE shows that even under the most conservative assumption the software still pays for itself within five months, the CFO's fiduciary duty shifts from rejecting the purchase to actively approving it.",
                "Finally, linking NBI to corporate strategic initiatives elevates the purchase above tactical operational budgets. When software savings are framed as funding for new strategic hires or mitigating public breach disclosure risks under SEC regulatory rules, the project secures executive champion sponsorship that protects it from mid-cycle budget cuts.",
                "In this third part, we build a Negative Business Impact & Cost of Inaction Financial Engine in Python. This tool models multi-vector financial loss, calculates annualized cost of inaction, computes monthly cash burn from operational delay, and generates CFO-ready ROI metrics."
            ],
            "example": "A SaaS vendor selling automated compliance monitoring conducted discovery with a fintech CTO. Together, they calculated that 6 engineers spent 15 hours/week on manual SOC2 screenshot collection ($150/hr fully loaded = $702,000/yr labor waste), plus $250,000 in delayed enterprise contract starts. Total NBI was $952,000/yr, or $79,333/month. When the CFO proposed delaying the $90,000 purchase to next fiscal year, the CTO presented the $79k/month Cost of Inaction, demonstrating that delaying by two months cost more than the entire software license. The contract was signed in 7 business days.",
            "code": """# Negative Business Impact (NBI) & Cost of Inaction (COI) Calculator
from typing import Dict, Any

def quantify_negative_business_impact(
    wasted_hours_per_week: float,
    fully_loaded_hourly_rate: float,
    team_members_affected: int,
    annual_churn_revenue_risk: float,
    annual_compliance_sla_penalties: float,
    proposed_annual_software_cost: float
) -> Dict[str, Any]:
    # 1. Direct Labor Waste (52 weeks/year)
    annual_labor_waste = round(
        wasted_hours_per_week * fully_loaded_hourly_rate * team_members_affected * 52.0, 2
    )
    
    # 2. Total Annual Negative Business Impact (NBI)
    total_annual_nbi = round(
        annual_labor_waste + annual_churn_revenue_risk + annual_compliance_sla_penalties, 2
    )
    
    # 3. Cost of Inaction (COI) Metrics
    monthly_coi = round(total_annual_nbi / 12.0, 2)
    daily_coi = round(total_annual_nbi / 365.0, 2)
    
    # 4. Net Benefit & ROI Metrics
    net_annual_benefit = round(total_annual_nbi - proposed_annual_software_cost, 2)
    roi_multiple = round(total_annual_nbi / proposed_annual_software_cost, 2) if proposed_annual_software_cost > 0 else 0.0
    payback_period_months = round((proposed_annual_software_cost / monthly_coi), 2) if monthly_coi > 0 else 999.0
    
    # 5. Financial Urgency Rating
    if roi_multiple >= 5.0 and monthly_coi >= proposed_annual_software_cost * 0.5:
        urgency = "COMPELLING_CFO_NO_BRAINER"
    elif roi_multiple >= 2.5:
        urgency = "SOUND_BUSINESS_INVESTMENT"
    else:
        urgency = "MARGINAL_COMMERCIAL_CASE"
        
    return {
        "annual_labor_waste": annual_labor_waste,
        "annual_churn_risk": annual_churn_revenue_risk,
        "annual_penalties": annual_compliance_sla_penalties,
        "total_annual_nbi": total_annual_nbi,
        "monthly_cost_of_inaction": monthly_coi,
        "daily_cost_of_inaction": daily_coi,
        "proposed_software_cost": proposed_annual_software_cost,
        "net_annual_benefit": net_annual_benefit,
        "roi_multiple": roi_multiple,
        "payback_period_months": payback_period_months,
        "financial_urgency_rating": urgency
    }

# Execute NBI & COI Evaluation
fintech_nbi = quantify_negative_business_impact(
    wasted_hours_per_week=15.0,
    fully_loaded_hourly_rate=150.0,
    team_members_affected=6,
    annual_churn_revenue_risk=250000.0,
    annual_compliance_sla_penalties=50000.0,
    proposed_annual_software_cost=90000.0
)

print("Enterprise Financial Business Case & Cost of Inaction Audit:")
print(f"  Annual Labor Waste: ${fintech_nbi['annual_labor_waste']:,.2f}")
print(f"  Total Annual Negative Business Impact: ${fintech_nbi['total_annual_nbi']:,.2f}")
print(f"  Monthly Cost of Inaction (COI): ${fintech_nbi['monthly_cost_of_inaction']:,.2f}/mo")
print(f"  Net Annual Value Creation: ${fintech_nbi['net_annual_benefit']:,.2f}")
print(f"  ROI Multiple: {fintech_nbi['roi_multiple']}x | Payback Period: {fintech_nbi['payback_period_months']} months")
print(f"  CFO Approval Assessment: {fintech_nbi['financial_urgency_rating']}")
""",
            "output": """Enterprise Financial Business Case & Cost of Inaction Audit:
  Annual Labor Waste: $702,000.00
  Total Annual Negative Business Impact: $1,002,000.00
  Monthly Cost of Inaction (COI): $83,500.00/mo
  Net Annual Value Creation: $912,000.00
  ROI Multiple: 11.13x | Payback Period: 1.08 months
  CFO Approval Assessment: COMPELLING_CFO_NO_BRAINER""",
            "codeNotes": [
                "Quantifies Negative Business Impact across labor waste, churn exposure, and contractual SLA penalties.",
                "Computes monthly and daily Cost of Inaction, rendering the financial penalty of delay undeniable to enterprise CFOs.",
                "Demonstrates how an 11.13x ROI and 1.08-month payback period transforms a software pitch into a no-brainer balance sheet asset."
            ],
            "tryIt": "Increase proposed_annual_software_cost to $300,000 to observe how the payback period scales while remaining well under 4 months.",
            "check": {
                "question": "How does presenting the 'Cost of Inaction' (e.g., $83,500/month) dismantle the enterprise objection to delay a purchase until next quarter?",
                "options": [
                    "It mathematically proves that deferring the decision by three months burns $250,500 in wasted cash, which far exceeds the cost of purchasing the software now",
                    "It automatically charges the prospect's corporate credit card every thirty days they do not sign",
                    "It forces the prospect's accounting department to report deferred projects as balance sheet liabilities",
                    "It legally obligates the prospect to pay a cancellation penalty to the sales organization"
                ],
                "answer": 0,
                "why": "Cost of Inaction illustrates that waiting is not a neutral zero-cost decision, but a conscious choice to bleed hundreds of thousands of dollars in unrecoverable operational waste."
            }
        },

        # Part 4: Critical Events & Compelling Timelines: Driving Urgency Without Artificial Discounts
        {
            "title": "Critical Events & Compelling Timelines: Driving Urgency Without Artificial Discounts",
            "say": [
                "In enterprise sales forecasting, deals that lack a Critical Event inevitably slip. An Account Executive might diagnose profound pain, quantify millions of dollars in negative business impact, and maintain enthusiastic rapport with the buyer—and yet, the opportunity lingers in stage three for six months without closing. Amateur sales managers attempt to manufacture artificial urgency at the end of a fiscal quarter by offering arbitrary price discounts: 'If you sign by Friday, we'll discount the license by twenty percent!' Savvy enterprise procurement officers exploit this amateur tactic ruthlessly, holding out until the final day of the vendor's fiscal year to extract eighty-percent concession demands.",
                "In sharp contrast, master enterprise sellers anchor deal urgency to the fourth pillar of the SPICED framework: The Critical Event (C). A Critical Event is a verifiable, non-negotiable deadline that is external to the sales process, owned by the customer, and accompanied by severe business or financial consequences if missed. Critical Events are not vendor deadlines; they are customer deadlines.",
                "Examples of authentic enterprise Critical Events include: A mandatory regulatory compliance deadline (e.g. European Union DORA cybersecurity enforcement on January 17th); An existing legacy vendor contract renewal with an automatic twelve-month penalty rollover if cancellation notice is not delivered ninety days in advance; A physical data center lease termination on October 31st; A high-visibility corporate product launch at a major annual industry conference; Or a hard board-mandated enterprise ERP migration deadline.",
                "Once an authentic Critical Event is uncovered, the Account Executive executes Backward Timeline Planning (also known as Mutual Action Plan engineering). Deals do not close overnight; enterprise procurement requires security reviews, legal redlines, SOC2 audits, privacy assessments, executive steering committee approvals, and ERP vendor onboarding. If a client must be live in production by November 1st to satisfy a regulatory audit, the AE works backward along the critical path.",
                "The backward schedule reveals the true timeline physics: If onboarding and implementation require six weeks, production deployment must begin by September 15th. If IT security and privacy review require four weeks, security documentation must be submitted by August 15th. If legal contracting and Master Services Agreement (MSA) redlining require three weeks, the contract must enter legal by July 25th. Therefore, to safely hit their own non-negotiable November 1st compliance deadline, the customer must complete executive vendor selection by July 15th.",
                "When the AE presents this backward timeline, the sense of urgency shifts entirely from the salesperson to the buyer. If the buyer hesitates, the AE reminds them with dispassionate professionalism: 'Sarah, if we don't complete the security architecture sign-off this week, your legal team won't receive the MSA until August. That compresses your implementation window to less than three weeks, putting your November 1st regulatory audit at severe risk. Should we adjust our review sessions to protect your compliance deadline?' Urgency is maintained without a single dollar of margin discounting.",
                "To operationalize this timeline, elite revenue teams codify the backward schedule into a shared Mutual Action Plan (MAP) document. A Mutual Action Plan is a collaborative project tracker that assigns explicit owners and target completion dates for every milestone across both organizations. Rather than sending vague follow-up emails asking 'any updates on the contract?', the AE schedules weekly fifteen-minute MAP checkpoint calls with the internal Champion and project lead, reviewing completed tasks and clearing roadblocks before they jeopardize the go-live target.",
                "Moreover, an experienced AE builds contingency buffers into the critical path. Enterprise procurement and legal departments are notoriously unpredictable; a routine data processing agreement (DPA) can easily languish for two weeks if an in-house privacy attorney goes on vacation. By planning for at least a twenty-one-day safety buffer between contract execution and the hard critical event, the sales team ensures that minor bureaucratic delays do not derail the customer's strategic deadline.",
                "In this fourth part, we build an Enterprise Critical Event Backward Planning Engine in Python. This system calculates required project milestone dates, models procurement and security lag, and determines whether an enterprise opportunity is currently on schedule or facing critical path compression."
            ],
            "example": "An enterprise fintech prospect needed their core ledger migrated before their Dec 15 annual external audit. The AE mapped backward: 6 weeks deployment, 4 weeks security/legal, 2 weeks procurement. The math revealed that vendor contract execution had to occur by Sept 15. When procurement attempted to delay negotiations to November, the AE showed that signing in November mathematically guaranteed missing the audit deadline and triggering a $500,000 regulatory penalty. Procurement immediately accelerated the contract, signing on Sept 12 with zero discounting.",
            "code": """# Enterprise Critical Event Backward Planning Engine
from datetime import datetime, timedelta
from typing import Dict, Any, List

def evaluate_critical_event_timeline(
    critical_event_date_str: str, # "YYYY-MM-DD"
    current_date_str: str,        # "YYYY-MM-DD"
    implementation_weeks: int,
    security_legal_review_weeks: int,
    procurement_signoff_weeks: int
) -> Dict[str, Any]:
    critical_date = datetime.strptime(critical_event_date_str, "%Y-%m-%d")
    current_date = datetime.strptime(current_date_str, "%Y-%m-%d")
    
    total_lead_weeks = implementation_weeks + security_legal_review_weeks + procurement_signoff_weeks
    total_lead_days = total_lead_weeks * 7
    
    # Calculate Required Milestone Deadlines Working Backward
    go_live_target = critical_date
    implementation_start = go_live_target - timedelta(weeks=implementation_weeks)
    security_legal_start = implementation_start - timedelta(weeks=security_legal_review_weeks)
    decision_date_required = security_legal_start - timedelta(weeks=procurement_signoff_weeks)
    
    calendar_days_available = (critical_date - current_date).days
    buffer_days = calendar_days_available - total_lead_days
    
    # Evaluate Critical Path Feasibility
    if buffer_days >= 21:
        timeline_status = "CRITICAL_PATH_HEALTHY_WITH_BUFFER"
        urgency_action = "MAINTAIN_MUTUAL_ACTION_PLAN_CADENCE"
    elif 0 <= buffer_days < 21:
        timeline_status = "CRITICAL_PATH_TIGHT_IMMEDIATE_ACTION_REQUIRED"
        urgency_action = "EXPEDITE_SECURITY_LEGAL_PARALLEL_TRACKS"
    else:
        timeline_status = "CRITICAL_PATH_BREACHED_DEADLINE_AT_RISK"
        urgency_action = "DESCOPE_PHASE_1_OR_ESCALATE_TO_EXECUTIVE_SPONSOR"
        
    return {
        "critical_event_date": critical_event_date_str,
        "current_date": current_date_str,
        "calendar_days_available": calendar_days_available,
        "total_required_lead_days": total_lead_days,
        "net_buffer_days": buffer_days,
        "milestones": {
            "required_decision_date": decision_date_required.strftime("%Y-%m-%d"),
            "security_legal_submission": security_legal_start.strftime("%Y-%m-%d"),
            "implementation_kickoff": implementation_start.strftime("%Y-%m-%d"),
            "go_live_critical_deadline": go_live_target.strftime("%Y-%m-%d")
        },
        "timeline_status": timeline_status,
        "urgency_action": urgency_action
    }

# Execute Critical Event Backward Schedule Evaluation
deal_schedule = evaluate_critical_event_timeline(
    critical_event_date_str="2026-11-15",
    current_date_str="2026-08-01",
    implementation_weeks=6,
    security_legal_review_weeks=4,
    procurement_signoff_weeks=2
)

milestones = deal_schedule["milestones"]
print("Enterprise Critical Event Backward Timeline Schedule:")
print(f"  Target Critical Event: {deal_schedule['critical_event_date']} | Days Available: {deal_schedule['calendar_days_available']}")
print(f"  Total Required Lead Time: {deal_schedule['total_required_lead_days']} days ({deal_schedule['total_required_lead_days'] // 7} weeks)")
print(f"  Net Safety Buffer: {deal_schedule['net_buffer_days']} days")
print(f"  Required Vendor Decision Date: {milestones['required_decision_date']}")
print(f"  Security & Legal Redline Start: {milestones['security_legal_submission']}")
print(f"  Implementation Deployment Kickoff: {milestones['implementation_kickoff']}")
print(f"  Status: {deal_schedule['timeline_status']}")
print(f"  Prescribed Deal Urgency Action: {deal_schedule['urgency_action']}")
""",
            "output": """Enterprise Critical Event Backward Timeline Schedule:
  Target Critical Event: 2026-11-15 | Days Available: 106
  Total Required Lead Time: 84 days (12 weeks)
  Net Safety Buffer: 22 days
  Required Vendor Decision Date: 2026-08-23
  Security & Legal Redline Start: 2026-09-06
  Implementation Deployment Kickoff: 2026-10-04
  Status: CRITICAL_PATH_HEALTHY_WITH_BUFFER
  Prescribed Deal Urgency Action: MAINTAIN_MUTUAL_ACTION_PLAN_CADENCE""",
            "codeNotes": [
                "Implements evaluate_critical_event_timeline to perform deterministic backward date planning from external client deadlines.",
                "Calculates net safety buffer days between available calendar time and required cross-functional lead times.",
                "Demonstrates how milestone-based backward planning enforces natural buyer urgency without sacrificing pricing integrity."
            ],
            "tryIt": "Move current_date_str forward to '2026-09-01' to observe net_buffer_days turning negative and triggering deadline breach status.",
            "check": {
                "question": "What is the key difference between an authentic Critical Event and an artificial quarter-end sales discount deadline?",
                "options": [
                    "A Critical Event is an external, non-negotiable deadline owned by the customer with real business consequences if missed, whereas discounts are internal vendor deadlines that invite price erosion",
                    "A Critical Event must be registered with the United States Department of Commerce",
                    "A quarter-end discount is legally binding on the buyer, whereas a Critical Event is voluntary",
                    "Critical Events only apply to hardware sales, while software sales rely entirely on discounting"
                ],
                "answer": 0,
                "why": "Authentic Critical Events belong to the customer and carry real operational or regulatory penalties, creating natural urgency without eroding vendor price margins."
            }
        },

        # Part 5: Decision Criteria Alignment, SPICED Master Scorecard & Discovery Certification
        {
            "title": "Decision Criteria Alignment, SPICED Master Scorecard & Discovery Certification",
            "say": [
                "In this culminating synthesis for Day 8, we integrate Upfront Contracts, Pain diagnosis, Negative Business Impact quantification, Critical Event backward planning, and Decision Criteria into a unified enterprise qualification architecture: The SPICED Discovery Master Scorecard. In modern B2B buying, decisions are never made by an isolated individual. Gartner research reveals that the typical enterprise technology purchase involves six to ten distinct stakeholders on the Buying Committee—including the Economic Buyer, the Technical Evaluator, the Operational Champion, Legal Counsel, InfoSec Compliance, and Procurement Officers.",
                "To navigate this multi-stakeholder labyrinth, the Account Executive must uncover and influence the Decision Criteria (the objective standards by which solutions will be judged) and the Decision Process (the precise organizational sequence of approvals required to issue a purchase order). Decision Criteria split into three distinct categories: Technical Criteria (Does the API support 10,000 requests per second? Does it meet SOC2 Type II and ISO 27001 standards?); Business Criteria (Does the solution deliver at least 4x ROI with a payback period under six months?); and Operational/Vendor Criteria (Does the vendor provide 24/7 dedicated enterprise support and a designated Customer Success Manager?).",
                "Crucially, elite sales organizations do not passively accept a prospect's RFP or RFP criteria; they strive to 'Deposition' competitors and actively Shape the Decision Criteria. When an AE uncovers a unique technical advantage during early discovery—such as patent-pending real-time data tokenization—the AE guides the Champion to insert that specific requirement into the formal evaluation matrix: 'Sarah, as your committee evaluates vendors, will you require distributed client-side encryption, or is centralized server-side storage acceptable?' By framing client-side encryption as essential for risk mitigation, the AE locks out competitors who lack that architecture.",
                "To determine whether an enterprise sales opportunity has been rigorously qualified according to institutional standards, Revenue Operations enforces the deterministic verification gate: `audit_discovery_mastery_and_qualification(spiced_score, nbi_identified, critical_event_confirmed, champion_identified)`. Under accredited enterprise standards, an opportunity qualifies for Stage 3 (Solution Validation / Technical Proof of Concept) only when four non-negotiable gates are cleared: First, the composite SPICED integrity score must reach 85.0 or higher; Second, verified annual Negative Business Impact must exceed $250,000; Third, an external Critical Event with an active backward timeline must be verified; and Fourth, a verified internal Champion with access to the Economic Buyer must be engaged.",
                "Testing the Champion is an essential skill in enterprise sales. A true Champion possesses three characteristics: personal power within the organization, a direct personal interest in your victory, and willingness to sell on your behalf when you are not in the room. An AE tests their Champion by giving them small assignments: 'Sarah, to ensure our upcoming demonstration addresses the executive committee's exact requirements, can you share the internal slides from your last architecture review?' If the contact refuses or makes excuses, they are merely an enthusiastic fan or coach, not a genuine Champion with access to the Economic Buyer.",
                "In modern RevOps tech stacks, these SPICED qualification criteria are enforced directly within Salesforce and HubSpot via validation rules and stage-gate triggers. Deals cannot be dragged from Stage 2 (Discovery) to Stage 3 (Validation) unless the NBI dollar figure, the Critical Event date, and the Economic Buyer contact ID are populated and verified by the sales manager. This automated governance eliminates 'happy ears' forecasting, ensuring pipeline metrics reflect mathematically rigorous deal probability.",
                "When an opportunity meets these rigorous criteria, it receives the official accreditation: `SPICED_DISCOVERY_CERTIFIED_NOMINAL`. This certification guarantees that the sales team does not waste valuable Solutions Engineering and Sales Engineering resources building custom demos or launching complex Proofs of Concept on unqualified, low-probability opportunities.",
                "In this final part, we construct the complete Discovery Operations Orchestration Engine in Python. This comprehensive class encapsulates all Day 8 operational mechanics, audits multi-stakeholder criteria, validates qualification compliance, and issues official enterprise stage-advancement certification."
            ],
            "example": "A cybersecurity sales team was running 12 Proofs of Concept simultaneously, but only 2 were converting to closed deals (16% win rate), exhausting sales engineering resources. RevOps deployed the SPICED Discovery Master Scorecard, requiring verified NBI > $250k, confirmed Critical Events, and shaped Decision Criteria before approving any POC. Unqualified deals dropped by 60%, but qualified POC win rates skyrocketed from 16% to 68%, expanding net new ARR by $3.2 million while cutting the average sales cycle by 24 days.",
            "code": """# SPICED Discovery Master Scorecard & Qualification Certification Engine
from typing import Dict, Any, List

def audit_discovery_mastery_and_qualification(
    spiced_score: float,
    annual_nbi_amount: float,
    critical_event_confirmed: bool,
    champion_identified_with_eb_access: bool,
    decision_criteria_shaped: bool
) -> Dict[str, Any]:
    # Mandatory Stage Advancement Governance Gates
    min_spiced_score = 85.0
    min_nbi_threshold = 250000.0 # Minimum $250k validated business impact
    
    gate_spiced = spiced_score >= min_spiced_score
    gate_nbi = annual_nbi_amount >= min_nbi_threshold
    gate_critical_event = critical_event_confirmed
    gate_champion = champion_identified_with_eb_access
    
    is_certified = gate_spiced and gate_nbi and gate_critical_event and gate_champion
    
    # Calculate Deal Velocity Factor (1.0 to 2.5x multiplier)
    velocity_multiplier = 1.0
    if decision_criteria_shaped:
        velocity_multiplier += 0.5
    if annual_nbi_amount >= 500000.0:
        velocity_multiplier += 0.5
    if spiced_score >= 95.0:
        velocity_multiplier += 0.5
        
    status = "SPICED_DISCOVERY_CERTIFIED_NOMINAL" if is_certified else "DISCOVERY_AUDIT_UNQUALIFIED_STAGE_GATE_BLOCKED"
    
    return {
        "spiced_score": spiced_score,
        "annual_nbi_amount": annual_nbi_amount,
        "critical_event_confirmed": critical_event_confirmed,
        "champion_verified": champion_identified_with_eb_access,
        "decision_criteria_shaped": decision_criteria_shaped,
        "is_certified": is_certified,
        "certification_status": status,
        "velocity_multiplier": round(velocity_multiplier, 2),
        "stage_advancement_gates": {
            "spiced_integrity_gate": gate_spiced,
            "financial_impact_gate": gate_nbi,
            "critical_event_gate": gate_critical_event,
            "champion_economic_buyer_gate": gate_champion
        }
    }

class MasterDiscoveryOperationsOrchestrator:
    def __init__(self, enterprise_unit: str, opportunity_id: str):
        self.enterprise_unit = enterprise_unit
        self.opportunity_id = opportunity_id
        
    def execute_spiced_qualification_audit(
        self,
        spiced_pts: float,
        nbi_val: float,
        crit_event: bool,
        champ_eb: bool,
        crit_shaped: bool
    ) -> Dict[str, Any]:
        dossier = audit_discovery_mastery_and_qualification(
            spiced_score=spiced_pts,
            annual_nbi_amount=nbi_val,
            critical_event_confirmed=crit_event,
            champion_identified_with_eb_access=champ_eb,
            decision_criteria_shaped=crit_shaped
        )
        return {
            "unit": self.enterprise_unit,
            "opportunity_id": self.opportunity_id,
            "qualification_dossier": dossier
        }

# Execute executive qualification certification
orchestrator = MasterDiscoveryOperationsOrchestrator("Global Enterprise FinTech", "OPP-SPICED-8842")
result = orchestrator.execute_spiced_qualification_audit(
    spiced_pts=92.5,
    nbi_val=680000.0,
    crit_event=True,
    champ_eb=True,
    crit_shaped=True
)

dossier = result["qualification_dossier"]
print(f"Executive Discovery Qualification Audit: {result['opportunity_id']}")
print(f"  Certification Status: {dossier['certification_status']}")
print(f"  SPICED Integrity Score: {dossier['spiced_score']}/100.0 (Gate: >=85.0)")
print(f"  Annual Negative Business Impact: ${dossier['annual_nbi_amount']:,.2f} (Gate: >=$250,000)")
print(f"  Critical Event Confirmed: {dossier['critical_event_confirmed']}")
print(f"  Champion with Economic Buyer Access: {dossier['champion_verified']}")
print(f"  Decision Criteria Actively Shaped: {dossier['decision_criteria_shaped']}")
print(f"  Projected Deal Velocity Multiplier: {dossier['velocity_multiplier']}x")
print(f"  Eligible for Technical POC Stage Advancement: {dossier['is_certified']}")
""",
            "output": """Executive Discovery Qualification Audit: OPP-SPICED-8842
  Certification Status: SPICED_DISCOVERY_CERTIFIED_NOMINAL
  SPICED Integrity Score: 92.5/100.0 (Gate: >=85.0)
  Annual Negative Business Impact: $680,000.00 (Gate: >=$250,000)
  Critical Event Confirmed: True
  Champion with Economic Buyer Access: True
  Decision Criteria Actively Shaped: True
  Projected Deal Velocity Multiplier: 2.5x
  Eligible for Technical POC Stage Advancement: True""",
            "codeNotes": [
                "Defines the audit_discovery_mastery_and_qualification gate requiring SPICED >= 85, NBI >= $250k, Critical Event, and Champion access.",
                "Calculates a deal velocity multiplier (up to 2.5x) when criteria are proactively shaped and high business value is validated.",
                "Encapsulates enterprise stage governance within MasterDiscoveryOperationsOrchestrator, conferring SPICED_DISCOVERY_CERTIFIED_NOMINAL accreditation."
            ],
            "tryIt": "Reduce annual_nbi_amount to $180,000 to observe the financial impact gate failing and blocking stage advancement.",
            "check": {
                "question": "Why does enterprise sales governance require verified Champion access to the Economic Buyer before approving an intensive technical POC?",
                "options": [
                    "To prevent sales engineering resources from being wasted on 'science projects' or evaluations that lack executive purchasing power",
                    "Because technical evaluators are legally forbidden from testing cloud software",
                    "To ensure that the software license keys can only be generated by a Chief Financial Officer",
                    "Because economic buyers are required to write the technical code for all enterprise POC integrations"
                ],
                "answer": 0,
                "why": "Without an executive sponsor who controls budget and is committed to purchasing upon successful POC completion, proof of concepts become expensive, unpaid technical evaluations."
            }
        }
    ]

    summary = [
        "Mastered the Architecture of an Executive Discovery Call and Upfront Contracts (Purpose, Process, Payoff), securing equal business stature and granting prospects permission to say 'No'.",
        "Operationalized the SPICED Framework (Situation, Pain, Impact, Critical Event, Decision Criteria), driving root-cause 5-Whys diagnosis and uncovering executive-level pain.",
        "Quantified Negative Business Impact (NBI) across labor waste, churn, and SLA penalties, establishing monthly Cost of Inaction (COI) that justifies rapid CFO budget allocation.",
        "Engineered Backward Timeline Planning anchored to external client Critical Events, driving deal urgency without resorting to margin-destroying sales discounting.",
        "Synthesized the complete discovery discipline inside MasterDiscoveryOperationsOrchestrator, clearing governance gates and conferring SPICED_DISCOVERY_CERTIFIED_NOMINAL accreditation."
    ]

    projectStep = {
        "title": "Build the Enterprise SPICED Discovery & Qualification Engine",
        "steps": [
            "Construct and audit the discovery upfront contract to establish peer-level advisor stature.",
            "Execute the 5-Whys diagnostic framework to map operational breakdowns and executive consequences.",
            "Calculate multi-vector Negative Business Impact and monthly Cost of Inaction for CFO business case defense.",
            "Design the backward timeline schedule from client Critical Events and enforce SPICED stage-gate certification."
        ]
    }

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == "__main__":
    d8 = get_day08_data()
    print(f"Generated Day {d8['day']}: {d8['title']}")
    words = [len(" ".join(p["say"]).split()) for p in d8["parts"]]
    print(f"Parts word counts: {words} (Total: {sum(words)} words)")
    assert len(d8["parts"]) == 5, "Must have exactly 5 parts"
    assert all(w >= 580 for w in words), "Word count invariant failed!"
    assert sum(words) >= 2950, "Total word count invariant failed!"
    print("ALL INVARIANTS PASS GREEN!")
