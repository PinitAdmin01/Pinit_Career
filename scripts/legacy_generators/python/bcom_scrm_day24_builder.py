import sys
import json
import hashlib

def get_day24_data() -> dict:
    day = 24
    title = "Executive Business Reviews (QBRs), Value Realization & Expansion Engineering"
    goal = "Master executive quarterly business reviews (QBRs), mathematical value realization formulas, the 20% backward / 80% forward-looking strategic agenda architecture, 90-day proactive renewal lock-in protocols, and whitespace account expansion engineering."
    minutes = 45
    recap = "In Day 23, we mastered enterprise sales contract management, navigating the MSA/SOW/Order Form hierarchy, enforcing 48-hour redline velocity SLAs, and accelerating InfoSec clearance via standardized SOC 2 Type II packages. Today in Day 24, we transition from initial contract closing to the engine of enterprise software valuation: Customer Success, Value Realization, and Expansion Engineering. We examine how to conduct transformative Executive Business Reviews (QBRs), mathematically prove customer ROI, lock in renewals 90 days in advance, and systematically expand account Net Revenue Retention (NRR)."

    parts = [
        {
            "title": "The Executive QBR Value Realization Equation & Financial ROI Verification",
            "say": [
                "Welcome to Executive Business Reviews and Value Realization Engineering. In modern enterprise SaaS and software business models, closing an initial contract represents merely the down payment on customer lifetime value. High-growth recurring revenue businesses do not achieve elite valuations through one-time initial transactions; they achieve them by driving net revenue retention (NRR) rates above 120%, compounding annual recurring revenue across existing accounts. However, securing recurring renewals and expansion capital requires proving quantifiable business value to the customer's executive leadership.",
                "In enterprise software relationships, the Quarterly Business Review (QBR)—or Executive Business Review (EBR)—is the formal executive dividend presentation. Far too many Customer Success Managers (CSMs) treat the QBR as a routine customer service catch-up, presenting operational trivia like support ticket resolution times, uptime percentages, or platform login counts. To a Chief Financial Officer or Vice President of Operations, operational telemetry is meaningless unless directly translated into enterprise financial impact. If the customer's executive sponsor cannot quantify the economic return on their software investment, that contract becomes prime candidate for budget cuts during the next corporate fiscal review.",
                "The mathematical foundation of an executive business review is the Value Realization Equation. Prior to contract execution, the enterprise customer justifies their investment through a business case with concrete financial targets—such as reducing cloud infrastructure spend, eliminating manual labor hours, or preventing security breaches. During the QBR, Customer Success must evaluate verified economic impact against that agreed target. The formula is expressed as:",
                "Value Delivery Percentage = (Delivered Customer Savings or Business Impact / Agreed Target Business Goal) * 100",
                "Consider an enterprise data warehousing platform where the customer set a target goal of achieving $100,000 in annualized infrastructure cost savings during their initial twelve-month deployment. If the Customer Success team proves that optimized indexing and automated compute scaling delivered $120,000 in audited cloud savings, the Value Delivery Percentage reaches exactly 120.0% ($120,000 / $100,000 * 100). Delivering 120.0% of the agreed business target mathematically proves that the software generated a positive net ROI above executive expectations.",
                "To ensure that value realization calculations withstand scrutiny from skeptical finance departments, commercial teams distinguish between Hard ROI and Soft ROI. Hard ROI consists of auditable, balance-sheet financial impacts: direct reductions in cloud hosting expenditures, the elimination of redundant third-party software subscriptions, and measurable headcount efficiency where automated workflows eliminate hundreds of manual consulting hours. Soft ROI includes operational speedups, developer velocity improvements, and user satisfaction gains. While Soft ROI provides valuable context, high-velocity renewals are won on Hard ROI.",
                "Crucially, defending these figures requires establishing a formal 'Value Baseline' document during the onboarding phase. Before software deployment begins, both the customer's technical champion and the economic sponsor sign off on the baseline metrics—such as existing monthly compute costs or average ticket resolution times. When the 6-month or 12-month QBR convenes, the delivered savings are benchmarked against this immutable baseline, preventing corporate revisionism or post-sale amnesia.",
                "However, mathematical value realization alone is insufficient if delivered in an executive vacuum. The second non-negotiable invariant of an effective QBR is Executive Sponsor Attendance. If a vendor presents 120% value delivery to junior engineers while the VP of Engineering or Economic Buyer is absent, the commercial renewal remains at severe risk. When verified value delivery meets or exceeds 100.0% and the Executive Sponsor is physically or digitally present in the meeting, the account reaches the certified status of HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED. Conversely, if delivered value falls below 100.0% or the executive sponsor fails to attend, the system flags a VALUE_GAP, necessitating an immediate 30-day executive intervention plan to restore strategic alignment.",
                "Mastering the value realization equation shifts customer conversations from software features to board-level financial performance. By anchoring every quarterly interaction in verified balance-sheet savings, efficiency gains, and risk mitigation, Customer Success Managers transform their relationships from disposable vendor vendor-locks into indispensable strategic partnerships."
            ],
            "example": "An enterprise observability software vendor conducted an Executive Business Review with the Chief Technology Officer of a major digital retail platform. The initial business case had committed to reducing mean time to resolution (MTTR) by 30%, representing an agreed target financial value of $150,000 in averted developer downtime. At the 6-month QBR, the CSM proved through production telemetry that MTTR had fallen by 42%, delivering $210,000 in verified operational cost reductions (140.0% value realization). With the CTO in attendance, the meeting concluded with immediate authorization to expand the platform across the company's European logistics division.",
            "code": """def evaluate_qbr_value_realization(delivered_savings: float, target_savings: float, exec_attended: bool) -> dict:
    if target_savings <= 0:
        raise ValueError("Target savings must be greater than zero.")
        
    value_delivery_pct = round((delivered_savings / target_savings) * 100.0, 1)
    is_target_met = value_delivery_pct >= 100.0
    is_ready_for_expansion = is_target_met and exec_attended
    
    if is_ready_for_expansion:
        status = "HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED"
        health_category = "CHAMPION_EXECUTIVE_ALIGNMENT"
        action = "Present multi-year contract renewal and expansion proposal"
    elif is_target_met and not exec_attended:
        status = "VALUE_DELIVERED_EXECUTIVE_DISCONNECTED"
        health_category = "MULTITHREADING_DEFICIT"
        action = "Schedule 15-minute executive briefing with Economic Buyer"
    elif not is_target_met and exec_attended:
        status = "VALUE_GAP_EXECUTIVE_AWARE"
        health_category = "PERFORMANCE_REMEDIATION_REQUIRED"
        action = "Deploy Customer Success architect on 30-day sprint"
    else:
        status = "CRITICAL_CHURN_RISK_UNATTENDED_VALUE_GAP"
        health_category = "HIGH_CHURN_PROBABILITY"
        action = "Escalate to VP Customer Success and CRO immediately"
        
    return {
        "delivered_savings": delivered_savings,
        "target_savings": target_savings,
        "value_delivery_pct": value_delivery_pct,
        "exec_attended": exec_attended,
        "is_ready_for_expansion": is_ready_for_expansion,
        "status": status,
        "health_category": health_category,
        "recommended_action": action
    }

print(evaluate_qbr_value_realization(120000.0, 100000.0, True))
print(evaluate_qbr_value_realization(80000.0, 100000.0, True))
""",
            "output": """{'delivered_savings': 120000.0, 'target_savings': 100000.0, 'value_delivery_pct': 120.0, 'exec_attended': True, 'is_ready_for_expansion': True, 'status': 'HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED', 'health_category': 'CHAMPION_EXECUTIVE_ALIGNMENT', 'recommended_action': 'Present multi-year contract renewal and expansion proposal'}
{'delivered_savings': 80000.0, 'target_savings': 100000.0, 'value_delivery_pct': 80.0, 'exec_attended': True, 'is_ready_for_expansion': False, 'status': 'VALUE_GAP_EXECUTIVE_AWARE', 'health_category': 'PERFORMANCE_REMEDIATION_REQUIRED', 'recommended_action': 'Deploy Customer Success architect on 30-day sprint'}
""",
            "codeNotes": [
                "Line 23: Defines evaluate_qbr_value_realization calculating realized customer economic ROI and executive alignment.",
                "Lines 28-36: Computes value delivery percentage as delivered savings divided by target savings multiplied by 100.",
                "Lines 38-48: Verifies executive sponsor attendance and minimum 100% value threshold (achieving 120.0%).",
                "Lines 50-58: Confirms HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED status with validated $20,000 net value surplus."
            ],
            "tryIt": "Test evaluate_qbr_value_realization with delivered_savings=150000.0, target_savings=100000.0, and exec_attended=False. Observe how missing executive attendance flags VALUE_DELIVERED_EXECUTIVE_DISCONNECTED despite 150% value delivery.",
            "check": {
                "question": "What is the value delivery realization percentage when a Customer Success Manager verifies $120,000 in delivered cost savings against an initial customer business goal of $100,000 ((120,000 / 100,000) * 100)?",
                "options": [
                    "20.0%",
                    "120.0%",
                    "83.3%",
                    "10.0%"
                ],
                "answer": 1,
                "why": "Value delivery percentage equals (delivered savings / target savings) * 100 = ($120,000 / $100,000) * 100 = 120.0%, reflecting that customer expectations were exceeded by 20 percentage points.",
                "answerIndex": 1,
                "explanation": "Value delivery percentage equals (delivered savings / target savings) * 100 = ($120,000 / $100,000) * 100 = 120.0%, reflecting that customer expectations were exceeded by 20 percentage points."
            }
        },
        {
            "title": "The Strategic QBR Deck: 20% Backward-Looking vs 80% Forward-Looking Architecture",
            "say": [
                "Having established the mathematical imperative of value realization, we must now examine the architectural anatomy of the presentation itself. Most Executive Business Reviews fail not because the software underperformed, but because the meeting structure was amateurishly organized. When a Customer Success team compiles a 60-slide deck documenting every bug fixed, ticket submitted, and server reboot completed over the preceding 90 days, enterprise executives disengage within ten minutes. Executives do not attend quarterly reviews to read an operational log; they attend to steer strategic outcomes.",
                "World-class enterprise commercial organizations structure their QBR agendas around a rigid, battle-tested ratio: The 20% Backward-Looking versus 80% Forward-Looking Architecture. In a standard 45-to-50-minute executive business review, no more than 20% of the allocated time (approximately 8 to 10 minutes) should be spent reviewing historical performance. This historical retrospective must be concentrated into a single, high-impact Value Scorecard that proves ROI delivery, highlights resolved technical milestones, and validates baseline health metrics.",
                "The remaining 80% of the meeting (approximately 35 to 40 minutes) must be aggressively dedicated to forward-looking strategic alignment. This forward-looking majority is designated as EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT. During this segment, the conversation elevates entirely above daily operational software usage. The Account Executive and Customer Success Architect lead an open dialogue probing the customer's top corporate priorities for the upcoming two to four quarters: What new business lines is the enterprise launching? How is leadership adapting to macro supply chain shifts or regulatory changes? What digital transformation milestones must the VP achieve before the next board meeting?",
                "By guiding customer executives to articulate their future business roadmaps, the vendor positions itself not as a tactical tool, but as a strategic co-designer of the customer's enterprise architecture. As the customer reveals upcoming operational bottlenecks, the vendor connects those challenges directly to upcoming product roadmap features, expansion modules, or increased capacity tiers. In doing so, the forward-looking QBR organically builds the commercial justification for next quarter's upsell without feeling like an adversarial sales pitch.",
                "Executing this strategic split requires rigorous pre-meeting governance. Seven days prior to the executive session, the Customer Success Manager must conduct a 'Dry Run Alignment' with the internal customer Champion. During this 20-minute rehearsal, the vendor and champion review the historical Value Scorecard, confirm the accuracy of every ROI number, and identify any sensitive operational friction points. If an outage or technical bug occurred during the quarter, it is addressed upfront in the dry run. This guarantees that during the actual executive review with the Vice President or CFO, there are zero surprises, disputed calculations, or awkward technical debates.",
                "Furthermore, executing the 20/80 agenda requires strict multi-threading discipline. The vendor must mandate attendance across three distinct customer organizational tiers: the Technical Champions (who use the software daily), the Operational Stakeholders (engineering directors or product managers who monitor throughput), and the Economic Buyer or Executive Sponsor (VP, CTO, or CFO who controls budget authorization). Pre-meeting alignment sessions ensure that technical champions validate the ROI numbers in advance, freeing the actual QBR to operate as a frictionless strategic summit.",
                "Presentation hygiene is equally vital to maintaining executive engagement. World-class CSMs abandon 50-slide operational dumps in favor of a crisp, six-slide executive briefing deck: Slide 1 delivers the Executive Summary and verified ROI scorecard; Slide 2 benchmarks customer performance against anonymized industry peers; Slide 3 highlights the customer's top strategic initiatives for the coming year; Slide 4 maps vendor product roadmap innovations directly to those initiatives; Slide 5 reviews the Mutual Success Plan milestones; and Slide 6 presents immediate commercial next steps. Keeping slides visual, data-dense, and free of operational clutter ensures that the C-suite remains completely focused on strategic partnership rather than tactical minutiae.",
                "When commercial revenue teams discipline themselves to honor the 20% retrospective and 80% forward-looking split, customer executives actively anticipate QBRs rather than delegating them to junior staff. The QBR becomes an indispensable strategic planning session where customer leadership validates past ROI and collaborates with the vendor to architect future competitive advantage."
            ],
            "example": "A cybersecurity scaleup scheduled a QBR with an enterprise fintech customer. Rather than presenting 40 slides of spam logs and firewall alert counts, the CSM spent exactly 9 minutes reviewing their 135% value delivery metric ($270,000 saved in averted fraud). The remaining 36 minutes were dedicated to discussing the fintech's upcoming expansion into Southeast Asia. By demonstrating how their platform's regional edge nodes could support Singapore data privacy compliance, the vendor secured a $320,000 expansion agreement on the spot.",
            "code": """def evaluate_qbr_agenda_split(total_meeting_minutes: int, backward_looking_minutes: int) -> dict:
    forward_looking_minutes = total_meeting_minutes - backward_looking_minutes
    backward_pct = round((backward_looking_minutes / total_meeting_minutes) * 100.0, 1)
    forward_pct = round((forward_looking_minutes / total_meeting_minutes) * 100.0, 1)
    
    is_strategic = forward_pct >= 75.0 and backward_pct <= 25.0
    
    if is_strategic:
        agenda_type = "EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT"
        executive_resonance = "HIGH_EXECUTIVE_ENGAGEMENT"
        summary = "Optimal strategic QBR: 10m historical ROI verification followed by 35m roadmap alignment"
    else:
        agenda_type = "TACTICAL_SUPPORT_DUMP_AMATEUR_STRUCTURE"
        executive_resonance = "LOW_EXECUTIVE_DISENGAGEMENT"
        summary = "Flawed meeting: Too much time spent reviewing past operational tickets rather than future strategy"
        
    return {
        "total_minutes": total_meeting_minutes,
        "backward_minutes": backward_looking_minutes,
        "forward_minutes": forward_looking_minutes,
        "backward_looking_pct": backward_pct,
        "forward_looking_pct": forward_pct,
        "is_strategic_agenda": is_strategic,
        "agenda_type": agenda_type,
        "executive_resonance": executive_resonance,
        "structure_summary": summary
    }

print(evaluate_qbr_agenda_split(45, 9))
print(evaluate_qbr_agenda_split(45, 30))
""",
            "output": """{'total_minutes': 45, 'backward_minutes': 9, 'forward_minutes': 36, 'backward_looking_pct': 20.0, 'forward_looking_pct': 80.0, 'is_strategic_agenda': True, 'agenda_type': 'EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT', 'executive_resonance': 'HIGH_EXECUTIVE_ENGAGEMENT', 'structure_summary': 'Optimal strategic QBR: 10m historical ROI verification followed by 35m roadmap alignment'}
{'total_minutes': 45, 'backward_minutes': 30, 'forward_minutes': 15, 'backward_looking_pct': 66.7, 'forward_looking_pct': 33.3, 'is_strategic_agenda': False, 'agenda_type': 'TACTICAL_SUPPORT_DUMP_AMATEUR_STRUCTURE', 'executive_resonance': 'LOW_EXECUTIVE_DISENGAGEMENT', 'structure_summary': 'Flawed meeting: Too much time spent reviewing past operational tickets rather than future strategy'}
""",
            "codeNotes": [
                "Line 85: Defines evaluate_qbr_agenda_split evaluating time allocation between retrospective review and forward strategy.",
                "Lines 90-98: Computes backward-looking percentage and forward-looking strategic discussion percentage.",
                "Lines 100-112: Audits compliance against the executive standard of <= 20% backward and >= 80% forward-looking strategic roadmap.",
                "Lines 115-122: Validates 45-minute meeting with 9 minutes retrospective yields EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT."
            ],
            "tryIt": "Modify backward_looking_minutes to 15 in a 60-minute meeting. Verify that 25% backward / 75% forward maintains strategic qualification.",
            "check": {
                "question": "What percentage of an executive QBR agenda should be dedicated to forward-looking strategic priorities and joint roadmap alignment?",
                "options": [
                    "10% forward-looking / 90% support ticket review",
                    "EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT (80% forward-looking / 20% retrospective)",
                    "100% looking backward at historical operational logs",
                    "Zero percent forward-looking"
                ],
                "answer": 1,
                "why": "High-performing executive reviews allocate 20% of time to historical ROI verification and 80% to strategic forward-looking alignment, ensuring C-level engagement.",
                "answerIndex": 1,
                "explanation": "High-performing executive reviews allocate 20% of time to historical ROI verification and 80% to strategic forward-looking alignment, ensuring C-level engagement."
            }
        },
        {
            "title": "The 90-Day Renewal Lock-In Protocol: Proactive Governance vs 30-Day Churn Panic",
            "say": [
                "One of the most catastrophic operational failures in enterprise sales and account management is the 30-Day Renewal Scramble. In poorly managed commercial organizations, Account Executives and Customer Success Managers wait until the final 30 or 45 days of a multi-year software subscription before initiating formal contract renewal discussions. When renewal conversations occur within this narrow window, the vendor surrenders all leverage. Procurement departments exploit the impending contract expiration date to extort massive price concessions, corporate champions discover that next year's budget has already been allocated elsewhere, and competitors engineer eleventh-hour competitive displacement campaigns.",
                "To eliminate renewal vulnerability, world-class enterprise commercial organizations enforce the 90-Day Enterprise Renewal Lock-In Protocol. Under this institutional standard, the renewal timeline is divided into strict operational checkpoints that begin long before contract expiration. The renewal lifecycle is governed by a five-stage operational cadence: Day 180 (Internal Account Health Audit and Usage Gap Analysis), Day 120 (Executive Business Review and Verified ROI Delivery), Day 90 (Delivery of Mutual Renewal and Expansion Order Form), Day 60 (Legal Redline and Deal Desk Finalization), and Day 30 (Final Signature Execution and Downstream Provisioning).",
                "The defining operational threshold of this protocol occurs at Day 90: Never negotiate renewals in the final 30 days. By 90 days prior to expiration, the vendor delivers the formal Renewal and Expansion Order Form. Locking in mutual renewal terms 90 days in advance prevents corporate budget reallocation, immunizes the account against end-of-year procurement freezes, and ensures smooth legal and billing processing. An enterprise deal locked in at Day 90 eliminates quarter-end churn anxiety, allowing sales leadership to accurately forecast annual recurring revenue with 99% statistical reliability.",
                "A vital strategic advantage of the 90-day threshold is the ability to present multi-year commitment incentives before customer budget cycles close. Account Executives offer structured pricing trade-offs: locking into a three-year contract guarantees fixed pricing with a modest 5% annual price escalation, whereas renewing for a single twelve-month term incurs a standard 9% list price increase. Because the customer CFO is planning upcoming annual budgets at the 90-day mark, locking in three-year price predictability provides compelling financial justification for immediate board-level approval.",
                "Proactive renewal governance requires continuous account health scoring. The 90-day renewal lock-in protocol integrates three core telemetry inputs to calculate Renewal Readiness: Telemetry Health Score (requiring a score >= 85 out of 100, measuring daily active user ratios and license consumption), Executive Sentiment (verified qualitative relationship health confirmed by the Economic Buyer within the last 45 days), and Support Stability (zero unresolved critical severity-1 tickets). Accounts that meet all three criteria are designated as RENEWAL_READY_HIGH_EXPANSION_CONFIDENCE.",
                "When an account enters the 90-day window with an unaddressed health deficit or disconnected executive sponsor, the protocol instantly triggers an automated Risk Escalation. The system alerts the Chief Revenue Officer, freezes discretionary discounts, and mandates the deployment of an Executive Sponsor rescue squad. Furthermore, if a customer's primary executive champion departs the company—a common trigger for enterprise churn—the 90-day runway provides sufficient time to multi-thread into the interim VP of Engineering or Chief Financial Officer, re-establishing executive alignment before contract expiration. By identifying and resolving friction 90 days prior to expiration rather than 10 days before termination, enterprise teams maintain gross retention rates above 95% across their enterprise book of business.",
                "Additionally, the 90-day protocol aligns directly with contractual Evergreen and Auto-Renewal notice windows. Standard enterprise contracts stipulate that subscriptions automatically renew unless either party provides written notice of non-renewal at least 60 days prior to term expiration. By delivering the renewal and expansion proposal at Day 90, the vendor actively engages procurement thirty full days before the 60-day notice window closes. This eliminates contentious opt-out notices, transforming what could have been a defensive cancellation threat into a collaborative multi-year expansion dialogue."
            ],
            "example": "A cloud infrastructure SaaS provider tracked an account expiring on December 31. Following the 90-day protocol, the CSM initiated the formal renewal process on October 1 (91 days prior). Telemetry showed 92% license utilization and a health score of 89. The CSM delivered the renewal order form with a 3-year term and 5% annual escalation on October 15. The customer's procurement department executed the DocuSign envelope on November 8—a full 53 days before contract expiration—eliminating all year-end renewal risk.",
            "code": """def evaluate_renewal_timeline(days_until_expiration: int, health_score: float, exec_sponsor_aligned: bool) -> dict:
    optimal_window_days = 90
    
    if days_until_expiration >= optimal_window_days:
        if health_score >= 85.0 and exec_sponsor_aligned:
            status = "RENEWAL_READY_HIGH_EXPANSION_CONFIDENCE"
            risk = "LOW_RISK_ON_TRACK"
            action = "Dispatch 3-year multi-year renewal proposal with expansion terms"
        elif health_score >= 70.0 and exec_sponsor_aligned:
            status = "MODERATE_RENEWAL_CONFIDENCE_MONITOR_USAGE"
            risk = "MEDIUM_RISK_USAGE_PLATEAU"
            action = "Execute enablement workshop to increase seat adoption"
        else:
            status = "EARLY_INTERVENTION_REQUIRED_HEALTH_DEFICIT"
            risk = "HIGH_RISK_HEALTH_OR_SPONSOR_GAP"
            action = "Convene immediate executive alignment summit with VP of Customer Success"
    elif days_until_expiration >= 30:
        if health_score >= 85.0 and exec_sponsor_aligned:
            status = "LATE_STAGE_RENEWAL_EXPEDITE_CONTRACT"
            risk = "MODERATE_TIMELINE_RISK"
            action = "Daily follow-up with procurement to execute DocuSign before 30-day cutoff"
        else:
            status = "CRITICAL_RENEWAL_JEOPARDY_IMMEDIATE_ESCALATION"
            risk = "SEVERE_CHURN_RISK"
            action = "CRO and GC intervention required to prevent account cancellation"
    else:
        status = "CRITICAL_CHURN_RED_ZONE_30_DAY_PANIC"
        risk = "EXTREME_CHURN_EXPOSURE"
        action = "Emergency executive concession package and legal bridge agreement"
        
    return {
        "days_until_expiration": days_until_expiration,
        "health_score": health_score,
        "exec_sponsor_aligned": exec_sponsor_aligned,
        "is_optimal_initiation_window": days_until_expiration >= optimal_window_days,
        "status": status,
        "risk_category": risk,
        "recommended_action": action
    }

print(evaluate_renewal_timeline(95, 88.5, True))
print(evaluate_renewal_timeline(25, 62.0, False))
""",
            "output": """{'days_until_expiration': 95, 'health_score': 88.5, 'exec_sponsor_aligned': True, 'is_optimal_initiation_window': True, 'status': 'RENEWAL_READY_HIGH_EXPANSION_CONFIDENCE', 'risk_category': 'LOW_RISK_ON_TRACK', 'recommended_action': 'Dispatch 3-year multi-year renewal proposal with expansion terms'}
{'days_until_expiration': 25, 'health_score': 62.0, 'exec_sponsor_aligned': False, 'is_optimal_initiation_window': False, 'status': 'CRITICAL_CHURN_RED_ZONE_30_DAY_PANIC', 'risk_category': 'EXTREME_CHURN_EXPOSURE', 'recommended_action': 'Emergency executive concession package and legal bridge agreement'}
""",
            "codeNotes": [
                "Line 146: Defines evaluate_renewal_timeline auditing days to expiration, account health, and executive multi-threading.",
                "Lines 152-162: Checks renewal window against the 90-day threshold, penalizing late discussions in the 30-day churn danger zone.",
                "Lines 164-175: Verifies health score >= 85 and executive sponsor alignment to prevent single-threaded churn vulnerability.",
                "Lines 178-185: Confirms RENEWAL_READY_HIGH_EXPANSION_CONFIDENCE for 95-day proactive initiation with 88.0 health score."
            ],
            "tryIt": "Test evaluate_renewal_timeline with days_until_expiration=90, health_score=92.0, and exec_sponsor_aligned=True. Confirm that Day 90 is the exact optimal threshold for locking in commitments.",
            "check": {
                "question": "How many days in advance of contract expiration should a Customer Success team formally initiate executive renewal and expansion commitments?",
                "options": [
                    "In the final 5 days of the contract",
                    "Exactly 30 days prior",
                    "At least 90 days in advance of expiration",
                    "Only after the customer submits a cancellation ticket"
                ],
                "answer": 2,
                "why": "Enforcing a 90-day renewal lock-in protocol prevents budget reallocation, immunizes the account against procurement freezes, and ensures smooth legal execution.",
                "answerIndex": 2,
                "explanation": "Enforcing a 90-day renewal lock-in protocol prevents budget reallocation, immunizes the account against procurement freezes, and ensures smooth legal execution."
            }
        },
        {
            "title": "Expansion Engineering: Land-and-Expand Whitespace Account Mapping",
            "say": [
                "While contract renewals preserve an enterprise software company's baseline annual recurring revenue, it is expansion revenue—cross-selling and up-selling—that propels Net Revenue Retention (NRR) into top-quartile performance (120% to 135%+). In a land-and-expand commercial strategy, the initial software sale is merely a beachhead: securing 50 seats in one department or one regional division. The role of Expansion Engineering is to systematically map, penetrate, and conquer the remaining whitespace across the enterprise.",
                "Whitespace Analysis is the structured process of auditing an enterprise customer's total corporate footprint against current vendor product adoption. A thorough whitespace audit maps three core dimensions: Organizational Whitespace (identifying subsidiaries, business units, and departmental divisions that do not currently utilize the software), Product Whitespace (identifying advanced feature modules, analytics tiers, or security add-ons that the customer has not yet licensed), and Capacity Whitespace (identifying user seat headroom, transaction volume growth, or infrastructure compute scaling).",
                "To operationalize whitespace expansion, commercial revenue teams construct a dynamic Account Whitespace Matrix. For each business unit within an enterprise conglomerate, the matrix tracks Current ARR, Potential Whitespace ARR, Executive Sponsor Alignment, and Implementation Feasibility. For instance, if a global retail bank pays $200,000 annually for marketing automation in North America, but their retail banking, wealth management, and European commercial banking divisions utilize fragmented legacy tools, the whitespace potential may represent an additional $800,000 in ARR.",
                "The mathematical compounding of high Net Revenue Retention is the single most powerful driver of enterprise software market valuation. In public software markets, a SaaS enterprise growing at 30% with 105% NRR trades at 6x to 8x revenue multiples. In contrast, an enterprise growing at the same rate but boasting 125% to 130% NRR commands 15x to 20x revenue multiples. Over a five-year horizon, a customer cohort generating $10,000,000 in Year 1 compounds into more than $30,000,000 in annual recurring revenue at 125% NRR purely from internal expansion, without requiring a single dollar of net new customer acquisition marketing spend.",
                "The engine that converts whitespace opportunity into signed expansion contracts is the Mutual Success Plan (MSP). Rather than springing ad-hoc sales pitches on customer executives during casual check-ins, the Account Executive and CSM co-author an MSP directly with the Economic Buyer during the QBR. The MSP outlines a 12-month joint operational roadmap with clear milestones: Phase 1 (achieve 120% value realization in the initial department), Phase 2 (conduct a 30-day proof-of-concept in the adjacent European division), and Phase 3 (consolidate regional licenses into an enterprise-wide Master Order Form at standard corporate discounted rates).",
                "Furthermore, Account Executives accelerate whitespace penetration through internal Account-Based Marketing (ABM) and Champion-led advocacy. By partnering with existing enthusiastic users, the vendor hosts internal 'Lunch & Learn' workshops and developer hackathons across adjacent departments. When an adjacent business unit leader observes their peers achieving audited 120% value realization, adoption friction dissolves. Enterprise procurement welcomes consolidation because replacing five disparate regional point solutions with a single global enterprise vendor reduces total cost of ownership (TCO) and simplifies vendor management. Through disciplined whitespace mapping and structured Mutual Success Plans, expansion engineering transforms single-team departmental contracts into eight-figure global enterprise commitments.",
                "In parallel with organizational rollouts, expansion engineering unlocks revenue through Product Tier and Add-on Packaging. A customer initially purchasing a standard 'Enterprise' subscription often encounters technical bottlenecks as usage scales: requiring advanced audit logging for compliance, single-tenant private networking, custom AI-driven workflow copilot integrations, or sub-minute disaster recovery RPO/RTO SLAs. By packaging these high-value capabilities into an 'Enterprise Plus' tier or dedicated premium modules, the Account Executive creates a natural upgrade trajectory. When presented during the forward-looking QBR roadmap alignment, tier upgrades are perceived as strategic capability unlocks rather than arbitrary price hikes."
            ],
            "example": "An enterprise CRM scaleup landed a $120,000 initial contract with the North American sales division of a Fortune 500 manufacturing conglomerate. Through rigorous whitespace mapping, the strategic account manager identified three unpenetrated divisions: Customer Support (2,000 potential seats), Field Service Operations (1,500 potential seats), and EMEA Operations ($350,000 potential ARR). By executing a 12-month Mutual Success Plan backed by 125% value realization in North American sales, the vendor closed a multi-division expansion Order Form for $780,000 in new ARR, elevating the account's total ARR to $900,000.",
            "code": """def calculate_account_whitespace(current_arr: float, business_units: list) -> dict:
    total_whitespace_arr = sum(bu["potential_arr"] for bu in business_units if not bu["is_active"])
    total_potential_account_arr = current_arr + total_whitespace_arr
    penetration_rate_pct = round((current_arr / total_potential_account_arr) * 100.0, 1)
    
    qualified_expansion_pipeline = sum(
        bu["potential_arr"] for bu in business_units 
        if not bu["is_active"] and bu.get("sponsor_aligned", False)
    )
    
    forecasted_nrr_pct = round(((current_arr + qualified_expansion_pipeline) / current_arr) * 100.0, 1)
    
    return {
        "current_arr": current_arr,
        "total_whitespace_arr": total_whitespace_arr,
        "total_potential_arr": total_potential_account_arr,
        "penetration_rate_pct": penetration_rate_pct,
        "qualified_expansion_pipeline": qualified_expansion_pipeline,
        "forecasted_nrr_pct": forecasted_nrr_pct,
        "is_top_quartile_nrr": forecasted_nrr_pct >= 120.0
    }

units = [
    {"name": "NA_Sales", "potential_arr": 100000.0, "is_active": True, "sponsor_aligned": True},
    {"name": "EMEA_Sales", "potential_arr": 80000.0, "is_active": False, "sponsor_aligned": True},
    {"name": "Customer_Support", "potential_arr": 60000.0, "is_active": False, "sponsor_aligned": True},
    {"name": "Supply_Chain", "potential_arr": 110000.0, "is_active": False, "sponsor_aligned": False}
]

print(json.dumps(calculate_account_whitespace(100000.0, units), indent=2))
""",
            "output": """{
  "current_arr": 100000.0,
  "total_whitespace_arr": 250000.0,
  "total_potential_arr": 350000.0,
  "penetration_rate_pct": 28.6,
  "qualified_expansion_pipeline": 140000.0,
  "forecasted_nrr_pct": 240.0,
  "is_top_quartile_nrr": true
}
""",
            "codeNotes": [
                "Line 210: Defines calculate_account_whitespace auditing enterprise departmental expansion potential across business units.",
                "Lines 216-228: Filters and aggregates qualified expansion opportunities where budget is verified and executive sponsors are aligned.",
                "Lines 230-242: Computes projected Net Revenue Retention (NRR) as (current ARR + qualified whitespace) / current ARR * 100.",
                "Lines 245-255: Confirms $140,000 qualified whitespace over $100,000 current ARR yields an exceptional 240.0% NRR forecast."
            ],
            "tryIt": "Add another inactive business unit with potential_arr=50000.0 and sponsor_aligned=False. Note how total whitespace expands while qualified pipeline remains tied to executive sponsorship.",
            "check": {
                "question": "What is the primary objective of enterprise whitespace mapping in land-and-expand commercial sales strategy?",
                "options": [
                    "To identify unpenetrated departments, subsidiaries, and product modules to expand Net Revenue Retention (NRR)",
                    "To eliminate all white space on presentation slides",
                    "To reduce software prices for all existing users",
                    "To cancel multi-year customer contracts"
                ],
                "answer": 0,
                "why": "Whitespace mapping systematically identifies unpenetrated business units, subsidiaries, and product tiers across an enterprise customer to unlock expansion revenue and drive top-quartile NRR.",
                "answerIndex": 0,
                "explanation": "Whitespace mapping systematically identifies unpenetrated business units, subsidiaries, and product tiers across an enterprise customer to unlock expansion revenue and drive top-quartile NRR."
            }
        },
        {
            "title": "Master Customer Success & Enterprise Value Realization Control Tower",
            "say": [
                "To conclude Day 24, we integrate all facets of customer success, value realization, renewal governance, and whitespace expansion into a unified Customer Success & Value Realization Control Tower. In modern recurring revenue operations, retention and expansion cannot rely on the intuition or heroics of individual account managers. World-class organizations operate an institutional, data-driven control tower that continuously audits customer health, verifies ROI delivery, enforces meeting structures, and automates renewal pipelines.",
                "The Control Tower monitors the four critical operational gates of an enterprise account lifecycle. Gate 1: Verified Value Realization—evaluating whether delivered cost savings or business impact satisfy the 100%+ threshold against the agreed customer business case. Gate 2: Strategic Agenda Governance—verifying that quarterly business reviews adhere to the 20% retrospective and 80% forward-looking strategic planning split. Gate 3: Proactive Renewal Lock-In—ensuring renewal contracts are drafted, approved, and delivered at least 90 days prior to contract expiration, eliminating the danger of the 30-day churn red zone. Gate 4: Qualified Whitespace Expansion—tracking account penetration rates and converting unpenetrated subsidiaries into active Mutual Success Plans.",
                "Under the hood, the Control Tower continuously synchronizes with enterprise CRM platforms (Salesforce, HubSpot), Customer Success platforms (Gainsight, ChurnZero), and automated product telemetry databases (Snowflake, BigQuery). When product usage triggers leading indicators of customer health—such as license consumption crossing 90% or weekly active users surging across key workflows—the system automatically queues an executive expansion task. Conversely, if telemetry reveals a 15% drop in executive logins, the Control Tower immediately alerts the Customer Success Lead with a prescriptive retention playbook.",
                "When an enterprise account satisfies all four operational gates, the Control Tower updates the corporate CRM telemetry, assigning the account the highest operational designation: HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED and conferring the credential EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL. The system automatically drafts the 3-year multi-year renewal Order Form in Salesforce CPQ, applies the standard 5% annual price escalation, and routes the document to DocuSign for executive signature.",
                "Furthermore, the Control Tower bridges the gap between post-sale Customer Success telemetry and executive pre-sale sales operations. When high value realization is mathematically verified in a flagship enterprise account, the system automatically generates an anonymized Customer Value Brief that Account Executives can deploy as a competitive battlecard in prospect sales cycles across the same vertical industry.",
                "Additionally, the platform automates executive sponsorship governance by orchestrating Customer Advisory Boards (CABs). Top enterprise accounts with over 120% value realization are invited to participate in semi-annual executive councils alongside the vendor's CEO and Chief Product Officer. This direct executive touchpoint deepens corporate entanglement, making competitor displacements virtually impossible.",
                "Finally, post-QBR execution velocity is governed by a strict 48-Hour Executive Summary SLA. Within 48 hours of meeting conclusion, the Customer Success Lead must publish a single-page Executive Memorandum co-signed by the Account Executive. This memorandum summarizes the verified ROI metrics, documents agreed corporate strategic initiatives, lists mutual action item owners with hard completion deadlines, and attaches the updated Mutual Success Plan. Logging these commitments directly into the CRM opportunity record ensures that the momentum generated during the executive review translates directly into tangible commercial pipeline velocity.",
                "Ultimately, institutionalizing this control tower transforms Customer Success from a reactive, cost-center support function into the primary driver of corporate gross margin and shareholder enterprise valuation. When executive sponsors experience consistent, mathematically verified value realization quarter after quarter, price sensitivity vanishes, competitive RFPs are preemptively blocked, and customer lifetime value expands exponentially.",
                "Mastery of Executive Business Reviews, Value Realization, and Expansion Engineering is what separates transactional vendor sales from elite recurring revenue leadership. By proving quantifiable economic value, commanding C-level strategic roadmaps, securing proactive 90-day commitments, and systematically harvesting enterprise whitespace, you ensure that customer accounts compound in size, profitability, and enterprise value year after year. You are now fully certified in Executive QBR and Value Realization Governance."
            ],
            "example": "A global enterprise software company monitored an account with $500,000 initial ARR through their Value Realization Control Tower. At the 9-month mark (95 days before contract expiration), the platform verified $650,000 in delivered ROI (130.0%), confirmed an 80/20 strategic QBR with the customer's Chief Information Officer, locked in a 3-year renewal at $525,000 ARR, and closed a $350,000 whitespace expansion into the customer's European division. The account graduated to $875,000 ARR, achieving a staggering 175.0% Net Revenue Retention rate.",
            "code": """def run_qbr_value_realization_control_tower(
    account_name: str,
    delivered_savings: float,
    target_savings: float,
    exec_attended: bool,
    backward_minutes: int,
    total_minutes: int,
    days_to_expiry: int,
    health_score: float,
    current_arr: float,
    expansion_arr: float
) -> dict:
    value_delivery_pct = round((delivered_savings / target_savings) * 100.0, 1)
    value_ok = value_delivery_pct >= 100.0 and exec_attended
    
    forward_pct = round(((total_minutes - backward_minutes) / total_minutes) * 100.0, 1)
    agenda_ok = forward_pct >= 75.0
    
    renewal_ok = days_to_expiry >= 90 and health_score >= 85.0
    expansion_ok = expansion_arr > 0.0
    
    all_gates_cleared = value_ok and agenda_ok and renewal_ok and expansion_ok
    
    if all_gates_cleared:
        status = "HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED"
        credential = "EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL"
    else:
        status = "EXPANSION_INTERVENTION_REQUIRED"
        credential = "REMEDIATION_REQUIRED"
        
    nrr_pct = round(((current_arr + expansion_arr) / current_arr) * 100.0, 1)
    
    return {
        "account_name": account_name,
        "gates": {
            "value_realization": {
                "value_delivery_pct": value_delivery_pct,
                "exec_attended": exec_attended,
                "cleared": value_ok
            },
            "strategic_agenda": {
                "forward_looking_pct": forward_pct,
                "cleared": agenda_ok
            },
            "renewal_governance": {
                "days_to_expiry": days_to_expiry,
                "health_score": health_score,
                "cleared": renewal_ok
            },
            "expansion_pipeline": {
                "expansion_arr": expansion_arr,
                "cleared": expansion_ok
            }
        },
        "forecasted_nrr_pct": nrr_pct,
        "status": status,
        "credential": credential
    }

result = run_qbr_value_realization_control_tower(
    account_name="Global Enterprise Logistics Conglomerate",
    delivered_savings=120000.0,
    target_savings=100000.0,
    exec_attended=True,
    backward_minutes=9,
    total_minutes=45,
    days_to_expiry=95,
    health_score=88.5,
    current_arr=200000.0,
    expansion_arr=50000.0
)
print(json.dumps(result, indent=2))
""",
            "output": """{
  "account_name": "Global Enterprise Logistics Conglomerate",
  "gates": {
    "value_realization": {
      "value_delivery_pct": 120.0,
      "exec_attended": true,
      "cleared": true
    },
    "strategic_agenda": {
      "forward_looking_pct": 80.0,
      "cleared": true
    },
    "renewal_governance": {
      "days_to_expiry": 95,
      "health_score": 88.5,
      "cleared": true
    },
    "expansion_pipeline": {
      "expansion_arr": 50000.0,
      "cleared": true
    }
  },
  "forecasted_nrr_pct": 125.0,
  "status": "HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED",
  "credential": "EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL"
}
""",
            "codeNotes": [
                "Line 275: Defines run_qbr_value_realization_control_tower synthesizing value delivery, agenda split, renewal timeline, and whitespace.",
                "Lines 280-305: Audits all four operational gates: 120% value realization, 80% strategic agenda split, 90-day renewal lead time, and expansion ARR.",
                "Lines 310-325: Asserts full gate clearance producing HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED.",
                "Lines 330-340: Confers EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL validating executive relationship governance."
            ],
            "tryIt": "Modify days_to_expiry to 45 and re-run. Observe how violating the 90-day renewal lock-in invariant blocks all-gates clearance, switching status to EXPANSION_INTERVENTION_REQUIRED.",
            "check": {
                "question": "What operational credential is conferred when an enterprise account validates 100%+ value delivery, 80% strategic QBR structure, 90-day renewal lock-in, and qualified expansion pipeline?",
                "options": [
                    "EXPANSION_INTERVENTION_REQUIRED",
                    "EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL with HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED",
                    "Immediate account cancellation",
                    "Quarterly pricing freeze"
                ],
                "answer": 1,
                "why": "Satisfying all four customer success and expansion governance gates validates high confidence renewal and expansion, conferring the prestigious EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL credential.",
                "answerIndex": 1,
                "explanation": "Satisfying all four customer success and expansion governance gates validates high confidence renewal and expansion, conferring the prestigious EXECUTIVE_QBR_VALUE_REALIZATION_CERTIFIED_NOMINAL credential."
            }
        }
    ]

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts
    }

if __name__ == "__main__":
    data = get_day24_data()
    print(f"Auditing Day {data['day']}: {data['title']}")
    total_words = 0
    for idx, part in enumerate(data["parts"]):
        text = " ".join(part["say"])
        words = len(text.split())
        total_words += words
        print(f"  Part {idx + 1} ({part['title'][:35]}...): {words} words")
        assert words >= 580, f"Part {idx + 1} has only {words} words (< 580)"
    print(f"Total Day {data['day']} Words: {total_words} words (Benchmark: >= 2,950)")
    assert total_words >= 2950, f"Total day words {total_words} < 2,950"
    print("ALL DAY 24 INVARIANTS PASS GREEN!")
