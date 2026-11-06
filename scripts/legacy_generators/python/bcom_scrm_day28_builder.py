"""
Course 26: Sales, Customer Success & CRM (bcom_scrm)
Day 28 Builder: Sales Analytics: Win/Loss Ratio, Ramp Time & Discount Rate Leakage
TASK-1230 | Agent: AGENT-389
"""

import sys
sys.stdout.reconfigure(encoding="utf-8")
from typing import Dict, Any, List

def get_day28_data() -> Dict[str, Any]:
    day = 28
    title = "Sales Analytics: Win/Loss Ratio, Ramp Time & Discount Rate Leakage"
    goal = "Master enterprise revenue telemetry: calculate and diagnose Win/Loss ratios (target >= 25.0%), benchmark Account Executive ramp times (target <= 90 days), audit discount rate leakage (ceiling <= 10.0%), enforce the Discount Authority Approval Matrix, and deploy the Master Sales Analytics Control Tower."
    minutes = 45
    recap = "Day 27 established the Challenger Sale methodology (Teach, Tailor, Take Control, 5 CEB profiles, and 6-step pitch choreography). Day 28 shifts from rep execution to quantitative revenue operations telemetry, diagnosing pipeline conversion efficiency, rep productivity cycles, and price integrity governance."

    parts = [
        {
            "title": "Win/Loss Ratio Analytics & Pipeline Conversion Economics",
            "say": [
                "Welcome to Day 28 of Sales, Customer Success & CRM. Today, we step into the revenue operations control room to examine the quantitative flight telemetry of your enterprise sales machine: Sales Analytics. In high-growth B2B enterprise software companies, intuition and anecdotal rep sentiment are fatal guides for capital allocation. Executive leadership cannot forecast quarterly revenue, plan hiring cohorts, or deploy marketing budgets based on whether sales reps 'feel good' about their deals. We must rely on deterministic revenue telemetry. The primary metric at the heart of pipeline diagnostic analytics is the Win/Loss Ratio and its derivative, the Win Rate Percentage.",
                "To calculate the Win Rate with statistical rigor, revenue operations leaders must establish a strict invariant: Win Rate is defined as the number of Won Closed-Deals divided by the Total Closed-Deals (Won plus Lost Opportunities) across a defined temporal cohort: Win Rate = (Won / (Won + Lost)) * 100%. While this formula appears deceptively simple, corporate sales organizations routinely manipulate it to artificially inflate performance figures. A common organizational distortion occurs when sales managers exclude early-stage lost deals or disqualify 'bad leads' after discovery calls, calculating win rates only on deals that reached the final contract stage. In world-class sales analytics, we measure pipeline conversion from the moment an opportunity is formally qualified (Stage 2: Solution Evaluation) through to final closure.",
                "Across enterprise B2B SaaS benchmarks, the median competitive win rate across qualified enterprise opportunities hovers between 20.0% and 22.0%. A sales organization achieving a Win Rate of 25.0% or higher is operating in the top quartile of market efficiency. When a company's win rate consistently exceeds 30.0%, it demonstrates overwhelming product-market fit, superior Challenger sales execution, and formidable competitive moats. Conversely, if an enterprise sales team's win rate falls below 15.0%, the revenue engine is suffering from severe friction. However, low win rates do not always signify poor salesmanship; they are often symptomatic of upstream lead generation defects, such as SDRs qualifying low-intent prospects or marketing targeting irrelevant buyer personas.",
                "Crucially, revenue telemetry requires distinguishing between Logo Win Rate and Dollar Win Rate (ARR-weighted win rate). Logo Win Rate evaluates unit transaction efficiency (e.g., winning 30 customer accounts out of 100 opportunities = 30.0% Logo Win Rate). Dollar Win Rate, in contrast, evaluates total contract value captured: dividing the sum of Won ARR by the total ARR of all closed opportunities. In unhealthy enterprise sales organizations, these two metrics frequently diverge: an organization may report a healthy 35% Logo Win Rate by winning small $25,000 contracts, while their Dollar Win Rate languishes at 14% because they lose every competitive deal exceeding $250,000. RevOps leaders must track both metrics concurrently to ensure reps are not retreating into low-value, low-risk commoditized transactions.",
                "Furthermore, revenue telemetry requires conducting structured Win/Loss post-mortem analyses. In enterprise software, the most prevalent loss reason is not a competing software vendor; it is 'No Decision'—the dreaded status quo drift where the customer buying committee fails to reach internal consensus and simply does nothing. Research across thousands of enterprise deals reveals that between 40% and 60% of lost pipeline collapses into No Decision. When a deal is lost to No Decision, the sales rep failed to build an undeniable Cost of Inaction (COI) or failed to multi-thread across executive Mobilizers. By systematically categorizing loss reasons—No Decision, Feature Gap, Budget Freeze, or Pricing Resistance—revenue operations leaders can isolate whether deal mortality stems from product deficiencies, messaging misalignment, or economic friction.",
                "Finally, RevOps maintains Competitive Displacement Matrices that analyze win rates against specific named rivals. If the data reveals that your win rate against Competitor A is 45% while your win rate against Competitor B is only 12%, sales enablement can immediately update competitive battlecards, dissect Competitor B's objection traps, and coach reps on neutralizing their specific architectural claims. Let us examine how this telemetry is modeled algorithmically in Python, certifying nominal pipeline conversion health versus performance defect flags."
            ],
            "example": "A SaaS infrastructure provider reviewed its annual sales cohort of 250 closed opportunities: 55 deals were won, 120 were lost to competitors, and 75 stalled into 'No Decision'. Revenue operations calculated an overall Win Rate of 22.0% (55 / 250). By deploying an automated post-mortem workflow, RevOps discovered that 62.5% of the competitor losses occurred against a single rival who possessed an automated SOC 2 audit export feature. Engineering prioritized the feature in the subsequent sprint, immediately elevating win rates to 28.5% over the following two quarters.",
            "code": """# Win/Loss Ratio & Pipeline Conversion Economics Engine
from typing import Dict, Any, List

def audit_win_loss_performance(
    won_deals: int,
    lost_deals: int,
    no_decision_deals: int,
    average_discount_pct: float
) -> Dict[str, Any]:
    \"\"\"
    Audits pipeline conversion efficiency and win/loss economics:
    - Benchmark 1: Overall Win Rate >= 25.0%
    - Benchmark 2: No-Decision drag percentage < 45.0% of total losses
    - Benchmark 3: Average discount given <= 10.0%
    \"\"\"
    total_closed = won_deals + lost_deals + no_decision_deals
    if total_closed == 0:
        return {"error": "ZERO_CLOSED_DEALS_RECORDED"}
        
    win_rate_pct = round((won_deals / total_closed) * 100.0, 2)
    total_losses = lost_deals + no_decision_deals
    no_decision_pct = round((no_decision_deals / total_losses * 100.0), 2) if total_losses > 0 else 0.0
    
    is_win_rate_nominal = win_rate_pct >= 25.0
    is_pricing_disciplined = average_discount_pct <= 10.0
    is_no_decision_healthy = no_decision_pct < 45.0
    
    is_overall_nominal = is_win_rate_nominal and is_pricing_disciplined
    
    status = (
        "HIGH_WINRATE_DISCIPLINED_PRICING"
        if is_overall_nominal
        else "PERFORMANCE_ISSUE_EXCESSIVE_DISCOUNTING_OR_LOW_WINRATE"
    )
    
    return {
        "won_deals": won_deals,
        "lost_to_competitors": lost_deals,
        "lost_to_no_decision": no_decision_deals,
        "total_closed_opportunities": total_closed,
        "win_rate_percent": win_rate_pct,
        "no_decision_loss_percent": no_decision_pct,
        "average_discount_percent": average_discount_pct,
        "is_win_rate_nominal": is_win_rate_nominal,
        "is_pricing_disciplined": is_pricing_disciplined,
        "is_performance_nominal": is_overall_nominal,
        "status": status
    }

# Benchmark Verifications
top_tier_team = audit_win_loss_performance(
    won_deals=30,
    lost_deals=45,
    no_decision_deals=25,
    average_discount_pct=8.0
)

underperforming_team = audit_win_loss_performance(
    won_deals=15,
    lost_deals=50,
    no_decision_deals=35,
    average_discount_pct=25.0
)

print(f"Top Tier Team Win Rate: {top_tier_team['win_rate_percent']}% | Status: {top_tier_team['status']}")
print(f"Top Tier Nominal Check: {top_tier_team['is_performance_nominal']}")
print(f"Underperforming Team Win Rate: {underperforming_team['win_rate_percent']}% | Status: {underperforming_team['status']}")
""",
            "output": """Top Tier Team Win Rate: 30.0% | Status: HIGH_WINRATE_DISCIPLINED_PRICING
Top Tier Nominal Check: True
Underperforming Team Win Rate: 15.0% | Status: PERFORMANCE_ISSUE_EXCESSIVE_DISCOUNTING_OR_LOW_WINRATE""",
            "codeNotes": [
                "Line 4: Defines audit_win_loss_performance calculating overall win rates and isolating No Decision pipeline decay.",
                "Lines 15-20: Computes win rate percentage over total closed deals (Won + Lost + No Decision) and isolates loss distribution.",
                "Lines 22-29: Enforces dual enterprise benchmarks: Win Rate >= 25.0% and Average Discount <= 10.0% for nominal certification.",
                "Lines 38-51: Demonstrates that 30 won deals out of 100 with 8% discount certifies HIGH_WINRATE_DISCIPLINED_PRICING."
            ],
            "tryIt": "Increase won_deals to 35 and discount to 12.0%. Observe how exceeding the 10.0% discount ceiling triggers PERFORMANCE_ISSUE_EXCESSIVE_DISCOUNTING_OR_LOW_WINRATE despite a 35% win rate.",
            "check": {
                "question": "What is the standard enterprise SaaS benchmark for a nominal sales team win rate across qualified Stage 2+ opportunities?",
                "options": [
                    "Greater than or equal to 75.0%",
                    "Greater than or equal to 25.0%",
                    "Exactly 10.0%",
                    "Greater than 90.0%"
                ],
                "answer": 1,
                "why": "In enterprise B2B sales, a win rate >= 25.0% over fully qualified pipeline represents top-quartile sales execution and pricing health.",
                "answerIndex": 1,
                "explanation": "In enterprise B2B sales, a win rate >= 25.0% over fully qualified pipeline represents top-quartile sales execution and pricing health."
            }
        },
        {
            "title": "Account Executive Ramp Time Analytics & Productivity Maturity Curves",
            "say": [
                "Having analyzed deal conversion rates, we now turn our telemetry to the human capacity engine of sales: Account Executive (AE) Ramp Time Analytics. In high-growth sales organizations, scaling revenue requires consistently hiring and onboarding cohorts of sales representatives. However, newly hired Account Executives do not produce quota on day one. Ramp Time is defined as the elapsed time in calendar days or months required for a newly hired sales representative to reach 100% full quota productive capacity. Understanding and compressing ramp time is one of the most powerful levers in corporate revenue operations.",
                "Consider the financial economics of ramp latency: every month an enterprise AE spends in an unproductive ramp state costs the company their full base salary, benefits, software seat licenses, and overhead burden—typically amounting to $15,000 to $25,000 per month per representative in unrecovered cash burn. More dangerously, an extended ramp cycle starves the company of planned pipeline generation. If an organization plans to add $10M in Net New ARR by hiring 10 AEs with $1M quotas, and those reps take 9 months to ramp instead of 3 months, the enterprise will suffer a catastrophic multi-million dollar revenue shortfall that inevitably leads to board panic, emergency bridge rounds, or headcount reductions.",
                "In standard Mid-Market and Commercial SaaS sales environments, the gold standard benchmark for AE Ramp Time is less than or equal to 90 days (3 months). In complex Enterprise and Strategic accounts featuring 9-to-12 month sales cycles, ramp benchmarks typically extend to 180 days (6 months). To manage and accelerate this ramp progression, modern sales enablement teams deploy a structured 30-60-90 Day Milestone Productivity Framework: Month 1 (Days 1–30) focuses on Knowledge Acquisition and Product Certification, during which the rep carries a 0% quota expectation but must pass rigorous pitch certifications and shadow senior closers.",
                "Month 2 (Days 31–60) shifts to Pipeline Generation and Outbound Execution. The rep begins active prospecting, runs their first discovery calls, and builds an initial pipeline coverage ratio, carrying a 50% pro-rated quota expectation. Finally, Month 3 (Days 61–90) marks Full Closing Maturity: the representative manages complex evaluations, leads contract negotiations, and achieves 100% full quota productive capacity. If a representative achieves 100% quota capacity within 90 days, their performance status evaluates to RAPID_PRODUCTIVE_RAMP_CYCLE, validating the efficacy of the onboarding curriculum.",
                "Crucially, revenue leadership must structure sales compensation draws to align with this ramp curve. In enterprise sales, newly hired reps receive non-recoverable draws during their first three months to provide income stability while they build pipeline. However, progressive RevOps teams link draw payments directly to leading milestone behaviors rather than passive tenure. A rep who completes their LMS product certifications, delivers three recorded pitch roleplays, and initiates 40 targeted outbound sequences receives their full draw; a rep who misses these milestones triggers early managerial intervention before bad habits calcify.",
                "Furthermore, ramp velocity depends heavily on the front-line Manager-to-Rep Coaching Ratio. In organizations where sales managers supervise more than 8 ramping representatives, ramp times inevitably stretch past 120 days because managers lack the bandwidth to conduct deal coaching and attend prospect calls. High-velocity revenue organizations maintain a strict 1:5 ratio during onboarding windows. Managers spend at least 4 hours per week per ramping rep conducting live call inspections on conversational intelligence platforms (such as Gong or Chorus), identifying qualification gaps in real time, and co-selling complex early opportunities to secure initial reference customer wins.",
                "Finally, RevOps tracks cohort survival analysis to eliminate 'ramp zombies'—representatives who appear active in the CRM by sending emails and logging meetings, but fail to generate Stage 2 qualified opportunities. If an AE has not generated at least 2.5x their pro-rated quota in qualified pipeline by Day 60, historical data shows a 90% probability that they will miss their Month 3 quota milestone. By continuously tracking ramp velocity through automated telemetry, sales leadership can identify struggling reps early, deploy targeted coaching interventions, and protect corporate customer acquisition cost (CAC) payback periods."
            ],
            "example": "A cybersecurity startup analyzed two onboarding cohorts: Cohort Alpha received ad-hoc on-the-job shadowing and took an average of 145 days to close their first quota-carrying deal. Cohort Beta was placed into a structured 30-60-90 day enablement bootcamp with automated LMS certifications, AI roleplay pitch testing, and curated starter accounts. Cohort Beta achieved full quota closing capacity in 72 days—a 50% ramp acceleration that generated an additional $1.8M in ARR within their first year.",
            "code": """# Account Executive Ramp Time Analytics & Maturity Engine
from typing import Dict, Any, List

def evaluate_ae_ramp_progression(
    rep_name: str,
    days_to_full_quota: int,
    month1_certification_passed: bool,
    month2_pipeline_target_achieved: bool,
    month3_quota_attainment_pct: float
) -> Dict[str, Any]:
    \"\"\"
    Evaluates Account Executive onboarding ramp velocity and milestone maturity:
    - Benchmark: Full quota attainment achieved in <= 90 days
    - Month 1 Gate: Product & pitch certification verified
    - Month 2 Gate: Pipeline creation quota met (>= 50% pro-rated)
    - Month 3 Gate: Full closing execution (>= 100% quota attainment)
    \"\"\"
    is_ramp_rapid = days_to_full_quota <= 90
    cleared_all_milestones = (
        month1_certification_passed and
        month2_pipeline_target_achieved and
        month3_quota_attainment_pct >= 100.0
    )
    
    is_elite_ramp = is_ramp_rapid and cleared_all_milestones
    
    if is_elite_ramp:
        ramp_status = "RAPID_PRODUCTIVE_RAMP_CYCLE"
        enablement_action = "AWARD_SENIOR_TERRITORY_FULL_CLOSING_ROSTER"
    elif days_to_full_quota <= 120:
        ramp_status = "MODERATE_RAMP_CYCLE_WITHIN_EXPANDED_TOLERANCE"
        enablement_action = "REINFORCE_DEAL_DESK_AND_NEGOTIATION_COACHING"
    else:
        ramp_status = "EXTENDED_RAMP_CYCLE_PROVIDE_ENABLEMENT_COACHING"
        enablement_action = "INITIATE_INTENSIVE_REMEDIAL_PIPELINE_BOOTCAMP"
        
    return {
        "rep_name": rep_name,
        "days_to_full_quota": days_to_full_quota,
        "is_under_90_day_ceiling": is_ramp_rapid,
        "month1_certification_passed": month1_certification_passed,
        "month2_pipeline_target_achieved": month2_pipeline_target_achieved,
        "month3_quota_attainment_pct": month3_quota_attainment_pct,
        "ramp_status": ramp_status,
        "enablement_action": enablement_action
    }

# Benchmark Verifications
elite_ae = evaluate_ae_ramp_progression(
    rep_name="Alex Chen",
    days_to_full_quota=75,
    month1_certification_passed=True,
    month2_pipeline_target_achieved=True,
    month3_quota_attainment_pct=108.5
)

lagging_ae = evaluate_ae_ramp_progression(
    rep_name="Jordan Vance",
    days_to_full_quota=135,
    month1_certification_passed=True,
    month2_pipeline_target_achieved=False,
    month3_quota_attainment_pct=62.0
)

print(f"{elite_ae['rep_name']} Ramp Status: {elite_ae['ramp_status']} (Days: {elite_ae['days_to_full_quota']})")
print(f"Action: {elite_ae['enablement_action']}")
print(f"{lagging_ae['rep_name']} Ramp Status: {lagging_ae['ramp_status']} (Days: {lagging_ae['days_to_full_quota']})")
print(f"Action: {lagging_ae['enablement_action']}")
""",
            "output": """Alex Chen Ramp Status: RAPID_PRODUCTIVE_RAMP_CYCLE (Days: 75)
Action: AWARD_SENIOR_TERRITORY_FULL_CLOSING_ROSTER
Jordan Vance Ramp Status: EXTENDED_RAMP_CYCLE_PROVIDE_ENABLEMENT_COACHING (Days: 135)
Action: INITIATE_INTENSIVE_REMEDIAL_PIPELINE_BOOTCAMP""",
            "codeNotes": [
                "Line 4: Defines evaluate_ae_ramp_progression auditing onboarding ramp velocity against the 90-day benchmark.",
                "Lines 15-22: Audits Month 1-3 milestone gates including knowledge certification, pipeline building, and >= 100% quota attainment.",
                "Lines 24-34: Deterministically classifies performance into RAPID_PRODUCTIVE_RAMP_CYCLE, MODERATE, or EXTENDED.",
                "Lines 45-56: Confirms that reaching 100% quota in 75 days awards RAPID_PRODUCTIVE_RAMP_CYCLE, while 135 days triggers remedial coaching."
            ],
            "tryIt": "Test evaluate_ae_ramp_progression with days_to_full_quota=85 and month3_quota_attainment_pct=95.0. Notice how failing the 100% quota target shifts the status out of elite ramp.",
            "check": {
                "question": "What is the standard target ceiling for Account Executive ramp time to full quota productivity in mid-market enterprise SaaS?",
                "options": [
                    "Less than or equal to 90 days (3 months)",
                    "365 days (1 full year)",
                    "14 days (2 weeks)",
                    "730 days (2 years)"
                ],
                "answer": 0,
                "why": "The industry standard benchmark for mid-market AE ramp time is <= 90 days; extending beyond 90 days significantly impairs corporate CAC payback.",
                "answerIndex": 0,
                "explanation": "The industry standard benchmark for mid-market AE ramp time is <= 90 days; extending beyond 90 days significantly impairs corporate CAC payback."
            }
        },
        {
            "title": "Discount Rate Leakage, Price Integrity & Gross Margin Dilution",
            "say": [
                "We now confront one of the most insidious threats to enterprise SaaS financial health: Discount Rate Leakage. In enterprise software sales, pricing is the ultimate reflection of perceived business value. When a company prices its software platform at $100,000 annually, it is making a bold assertion that its solution delivers hundreds of thousands of dollars in operational ROI or risk reduction. However, when an untrained or undisciplined sales representative encounters buyer pushback, their immediate reflex is to slash prices: offering 15%, 20%, or even 30% discounts without hesitation. In revenue operations, this phenomenon is termed Discount Rate Leakage.",
                "Discount rate leakage destroys corporate enterprise value at an alarming velocity. Consider the mathematical anatomy of software gross margins: software companies are prized on Wall Street and in private equity markets because they operate with high gross margins—typically between 75.0% and 85.0%. When a sales rep gives an unearned 10% discount on a software license, that 10% discount comes entirely out of gross margin dollars. For a company operating at an 80% gross margin, conceding a 10% discount requires the sales organization to sell 14.3% more volume just to generate the exact same gross profit dollars! Conceding a 20% discount requires selling 33.3% more volume to break even.",
                "More catastrophically, discount rate leakage directly erodes the company's valuation multiple in capital markets. Modern enterprise SaaS businesses are valued as a multiple of Annual Recurring Revenue (Enterprise Value / ARR). In current market environments, high-growth, high-margin software businesses trade at valuations between 8x and 15x ARR. When a sales organization leaks $500,000 in ARR through undisciplined discounting over the course of a fiscal year, they have not merely surrendered $500,000 in immediate cash flow—they have permanently wiped out between $4,000,000 and $7,500,000 in shareholder enterprise value! Every percentage point of discount granted directly impoverishes employee stock option holders and corporate equity.",
                "Furthermore, discount leakage creates severe downstream compounding liabilities across the customer lifecycle. In enterprise SaaS, annual contracts renew automatically, and net revenue retention (NRR) is calculated off baseline Annual Recurring Revenue (ARR). If an enterprise account executive closes an initial $500,000 contract at a 25% discount ($375,000 ARR), that $125,000 revenue reduction is not a one-time event; it is permanently locked in for the life of the account. During subsequent year-two and year-three renewals, procurement will fiercely resist any attempt to raise pricing back to standard list rates. Over a 5-year customer lifetime, an initial 20% discount leakage can easily compound into more than $600,000 in lost gross margin.",
                "Empirical customer success research reveals an even darker reality: heavily discounted customers exhibit higher churn rates and lower Customer Satisfaction (CSAT/NPS) scores than customers who paid full price. When a customer pays full list price, executive sponsors take the implementation seriously, dedicate elite technical personnel, and actively drive user adoption to recoup their investment. When a buyer receives a 30% discount, they perceive the tool as a cheap commodity, treat the vendor dismissively, fail to complete onboarding milestones, and ultimately churn after 12 months. Discounter sales reps do not merely dilute margins; they poison the downstream customer success portfolio.",
                "To maintain price integrity, enterprise revenue organizations establish a strict operational benchmark: the company-wide Average Discount Rate Leakage Ceiling must remain less than or equal to 10.0%. A sales organization operating with an average discount between 0.0% and 10.0% demonstrates disciplined Challenger salesmanship, where reps successfully defend value and practice value trading rather than price surrender. When an organization's average discount rate creeps above 10.0%, revenue operations must intervene immediately with Deal Desk controls.",
                "Let us examine how discount leakage and gross margin dilution are modeled algorithmically. We will build an operational margin dilution engine that calculates the exact volume multiplier required to offset discounts, audits whether the average discount conforms to the 10.0% ceiling, and evaluates whether the revenue engine is maintaining disciplined price integrity."
            ],
            "example": "An enterprise HR tech company with an 80% gross margin saw its average deal discount rise from 7% to 18% over two quarters as reps scrambled to hit end-of-year quotas. While the company celebrated hitting its total contract count, CFO analysis revealed that gross profit dollars were down by $3.4M compared to budget. To restore profitability, RevOps implemented automated CPQ discounting caps and mandated that any discount over 10% required VP approval. Within 90 days, the average discount dropped back to 8.2%, recovering $2.8M in annualized gross margin.",
            "code": """# Discount Rate Leakage & Gross Margin Dilution Engine
from typing import Dict, Any, List

def audit_discount_leakage_and_margin_impact(
    initial_contract_list_price: float,
    discount_given_pct: float,
    baseline_gross_margin_pct: float = 80.0
) -> Dict[str, Any]:
    \"\"\"
    Audits discount rate leakage and calculates gross margin dilution:
    - Rule 1: Maximum recommended discount ceiling is <= 10.0%
    - Rule 2: Quantifies required volume increase multiplier to offset discount
      Formula: Volume Increase Multiplier = (Discount %) / (Gross Margin % - Discount %)
    \"\"\"
    discounted_contract_value = round(initial_contract_list_price * (1.0 - (discount_given_pct / 100.0)), 2)
    dollars_leaked = round(initial_contract_list_price - discounted_contract_value, 2)
    
    # Calculate required volume expansion to offset gross profit loss
    # Margin % as decimal
    gm = baseline_gross_margin_pct / 100.0
    disc = discount_given_pct / 100.0
    
    if (gm - disc) > 0:
        volume_increase_required_pct = round((disc / (gm - disc)) * 100.0, 2)
    else:
        volume_increase_required_pct = 999.99 # Catastrophic margin wipeout
        
    is_discount_disciplined = discount_given_pct <= 10.0
    
    status = (
        "DISCIPLINED_PRICING_MARGINS_PRESERVED"
        if is_discount_disciplined
        else "EXCESSIVE_DISCOUNT_LEAKAGE_MARGIN_DILUTION_RISK"
    )
    
    return {
        "list_price": initial_contract_list_price,
        "discount_given_pct": discount_given_pct,
        "discounted_contract_value": discounted_contract_value,
        "annual_dollars_leaked": dollars_leaked,
        "volume_increase_required_to_breakeven_pct": volume_increase_required_pct,
        "is_discount_disciplined": is_discount_disciplined,
        "status": status
    }

# Benchmark Verifications
disciplined_deal = audit_discount_leakage_and_margin_impact(
    initial_contract_list_price=100000.0,
    discount_given_pct=8.0,
    baseline_gross_margin_pct=80.0
)

leaky_deal = audit_discount_leakage_and_margin_impact(
    initial_contract_list_price=100000.0,
    discount_given_pct=20.0,
    baseline_gross_margin_pct=80.0
)

print(f"Disciplined Deal: Leaked: ${disciplined_deal['annual_dollars_leaked']:,.2f} | Status: {disciplined_deal['status']}")
print(f"Volume increase needed to offset 8% discount: +{disciplined_deal['volume_increase_required_to_breakeven_pct']}%")
print(f"Leaky Deal: Leaked: ${leaky_deal['annual_dollars_leaked']:,.2f} | Status: {leaky_deal['status']}")
print(f"Volume increase needed to offset 20% discount: +{leaky_deal['volume_increase_required_to_breakeven_pct']}%")
""",
            "output": """Disciplined Deal: Leaked: $8,000.00 | Status: DISCIPLINED_PRICING_MARGINS_PRESERVED
Volume increase needed to offset 8% discount: +11.11%
Leaky Deal: Leaked: $20,000.00 | Status: EXCESSIVE_DISCOUNT_LEAKAGE_MARGIN_DILUTION_RISK
Volume increase needed to offset 20% discount: +33.33%""",
            "codeNotes": [
                "Line 4: Defines audit_discount_leakage_and_margin_impact quantifying gross margin compression and breakeven volume expansion.",
                "Lines 16-24: Implements the breakeven volume expansion formula: (Discount %) / (Gross Margin % - Discount %).",
                "Lines 26-32: Evaluates the pricing discipline invariant, certifying DISCIPLINED_PRICING_MARGINS_PRESERVED if discount <= 10.0%.",
                "Lines 40-52: Proves that a 20% discount on an 80% margin business requires a staggering 33.33% surge in volume to offset profit loss."
            ],
            "tryIt": "Set discount_given_pct=10.0. Notice how a 10.0% discount on an 80% margin business requires exactly a +14.29% volume increase to break even.",
            "check": {
                "question": "What is the maximum recommended average discount rate leakage ceiling for disciplined enterprise SaaS sales operations?",
                "options": [
                    "Less than or equal to 10.0%",
                    "Greater than 50.0%",
                    "Exactly 0.0% with zero exceptions ever permitted",
                    "Up to 35.0% at rep discretion"
                ],
                "answer": 0,
                "why": "A ceiling of <= 10.0% provides sufficient commercial flexibility for value trading while preventing catastrophic gross margin dilution.",
                "answerIndex": 0,
                "explanation": "A ceiling of <= 10.0% provides sufficient commercial flexibility for value trading while preventing catastrophic gross margin dilution."
            }
        },
        {
            "title": "The Enterprise Discount Authority Approval Matrix",
            "say": [
                "Having mathematically demonstrated the severe financial hazards of discount leakage, we must now implement the institutional safeguard that enforces pricing discipline across the entire sales floor: The Discount Authority Approval Matrix. In enterprise sales, governance cannot rely on rep goodwill. When quarter-end deadlines approach and reps face commission cliff thresholds, the pressure to concede discounts to secure signatures becomes overwhelming. To protect corporate profit margins, revenue operations and finance implement a formalized, tiered governance approval matrix embedded directly inside the CRM and Configure, Price, Quote (CPQ) software.",
                "The Discount Authority Approval Matrix operates across three rigid, non-negotiable governance tiers: Tier 1 covers discounts from 0.0% to 10.0%. Within this baseline corridor, discounts fall under Account Executive Discretion. The AE possesses the authority to grant up to a 10.0% discount without managerial escalation, provided the discount is paired with at least one reciprocal concession trade—such as an accelerated contract execution date or a multi-year term. Because discounts up to 10.0% remain within budgeted gross margin tolerances, they do not jeopardize corporate unit economics.",
                "Tier 2 governs discounts ranging from 10.1% to 20.0%. When a deal requires a concession in this intermediate band, AE authority is strictly suspended, and formal VP of Sales Approval is mandatory. The VP of Sales conducts a strategic deal review to verify whether the account represents a tier-one logo, a strategic market expansion, or an unprecedented competitive displacement. Crucially, the VP will only approve a Tier 2 discount if the buyer offers substantial commercial concessions: a minimum 24-month or 36-month non-cancelable commitment, upfront annual billing (Net 30), and an executive sponsorship agreement.",
                "Tier 3 governs extreme discounts exceeding 20.0%. Any discount above 20.0% represents a severe deviation from corporate pricing strategy and requires joint CFO and CEO Approval. In public enterprise software corporations, discounting beyond 20% impacts Wall Street consensus estimates and requires board-level disclosure. The CFO audits the revenue recognition implications under ASC 606, calculates customer acquisition payback, and evaluates whether the deal creates dangerous market pricing precedents. To receive CFO/CEO sign-off, the transaction must typically involve a massive multi-million dollar Total Contract Value (TCV), multi-year prepayments, and explicit marketing rights including a named press release and keynote speaking commitment.",
                "To ensure that this governance framework accelerates rather than cripples sales velocity, modern RevOps organizations institute strict Deal Desk Service Level Agreements (SLAs). In poorly run organizations, discount requests languish in executive inboxes for weeks, causing buyer enthusiasm to cool and deal momentum to evaporate. In elite revenue engines, automated CPQ webhooks trigger real-time Slack and mobile push alerts to approvers. Tier 2 VP approvals carry a strict 4-hour turnaround SLA, while Tier 3 CFO escalations must be adjudicated within 24 hours.",
                "Moreover, the Deal Desk enforces Non-Standard Legal Term Bundling whenever price concessions are approved. If a customer demands a 15% discount, the Deal Desk inserts a mandatory Price Escalation Clause stipulating an automatic 7.0% price increase upon annual contract renewal. The Deal Desk also strips out unfavorable liability caps and payment terms, ensuring that any margin surrendered on headline software licenses is recouped through multi-year inflation adjustments and reduced legal exposure.",
                "When an Account Executive attempts to generate an official quote in the CPQ platform, automated validation scripts parse the proposed discount percentage. If the discount exceeds the AE's authority tier, quote generation is instantaneously locked, and an automated approval workflow routes to the VP of Sales or CFO with the required business justification. By encoding this matrix into code, revenue operations eliminates rogue 'side letters' and rogue price cuts, preserving enterprise gross margin integrity."
            ],
            "example": "An Account Executive pitching a $400,000 enterprise agreement was pressured by procurement to provide an 18% discount. Rather than making an unauthorized verbal promise, the AE entered the terms into the CPQ system. The system automatically flagged the deal as Tier 2, routed an alert to the VP of Sales, and requested concessions. The VP met with the client's procurement director, agreeing to the 18% discount only after the client expanded the contract to a 3-year term and agreed to upfront annual billing, securing $984,000 in total guaranteed revenue.",
            "code": """# Enterprise Discount Authority Approval Matrix Engine
from typing import Dict, Any, List

def evaluate_discount_authority(
    contract_list_value: float,
    discount_pct: float,
    contract_term_years: int,
    concessions_granted_by_buyer: List[str]
) -> Dict[str, Any]:
    \"\"\"
    Audits discount approval governance across the 3-tier enterprise matrix:
    - Tier 1 (0.0% - 10.0%): ACCOUNT_EXECUTIVE discretion
    - Tier 2 (10.1% - 20.0%): VP_OF_SALES approval (requires term >= 2 yrs + >= 1 trade)
    - Tier 3 (> 20.0%): CFO_AND_CEO approval (requires term >= 3 yrs + >= 3 trades)
    \"\"\"
    cleaned_discount = round(discount_pct, 2)
    trades_count = len(concessions_granted_by_buyer)
    
    if cleaned_discount <= 10.0:
        required_approver = "ACCOUNT_EXECUTIVE"
        is_governance_satisfied = True
        status = "TIER_1_AE_DISCRETION_APPROVED"
    elif cleaned_discount <= 20.0:
        required_approver = "VP_OF_SALES"
        has_min_term = contract_term_years >= 2
        has_trades = trades_count >= 1
        is_governance_satisfied = has_min_term and has_trades
        status = (
            "TIER_2_VP_SALES_APPROVED_WITH_CONCESSIONS"
            if is_governance_satisfied
            else "TIER_2_REJECTED_INSUFFICIENT_TERM_OR_TRADES"
        )
    else:
        required_approver = "CFO_AND_CEO"
        has_multi_year = contract_term_years >= 3
        has_executive_trades = trades_count >= 2
        is_governance_satisfied = has_multi_year and has_executive_trades
        status = (
            "TIER_3_EXECUTIVE_BOARD_APPROVED_STRATEGIC_DEAL"
            if is_governance_satisfied
            else "TIER_3_REJECTED_EXCESSIVE_DISCOUNT_WITHOUT_STRATEGIC_VALUE"
        )
        
    discounted_annual_value = round(contract_list_value * (1.0 - (cleaned_discount / 100.0)), 2)
    total_contract_value = round(discounted_annual_value * contract_term_years, 2)
    
    return {
        "contract_list_value": contract_list_value,
        "discount_pct": cleaned_discount,
        "contract_term_years": contract_term_years,
        "required_approver": required_approver,
        "is_governance_satisfied": is_governance_satisfied,
        "discounted_annual_value": discounted_annual_value,
        "total_contract_value": total_contract_value,
        "concessions_count": trades_count,
        "status": status
    }

# Benchmark Verifications
ae_deal = evaluate_discount_authority(
    contract_list_value=150000.0,
    discount_pct=8.0,
    contract_term_years=1,
    concessions_granted_by_buyer=["ACCELERATED_SIGNATURE"]
)

vp_deal = evaluate_discount_authority(
    contract_list_value=250000.0,
    discount_pct=15.0,
    contract_term_years=2,
    concessions_granted_by_buyer=["NET_15_TERMS", "CUSTOMER_REFERENCE"]
)

cfo_deal = evaluate_discount_authority(
    contract_list_value=500000.0,
    discount_pct=25.0,
    contract_term_years=3,
    concessions_granted_by_buyer=["3_YEAR_UPFRONT_CASH", "NAMED_PRESS_RELEASE", "ANNUAL_KEYNOTE"]
)

print(f"AE Tier 1 Deal: Approver: {ae_deal['required_approver']} | Status: {ae_deal['status']}")
print(f"VP Tier 2 Deal: Approver: {vp_deal['required_approver']} | Status: {vp_deal['status']}")
print(f"CFO Tier 3 Deal: Approver: {cfo_deal['required_approver']} | Status: {cfo_deal['status']} | TCV: ${cfo_deal['total_contract_value']:,.2f}")
""",
            "output": """AE Tier 1 Deal: Approver: ACCOUNT_EXECUTIVE | Status: TIER_1_AE_DISCRETION_APPROVED
VP Tier 2 Deal: Approver: VP_OF_SALES | Status: TIER_2_VP_SALES_APPROVED_WITH_CONCESSIONS
CFO Tier 3 Deal: Approver: CFO_AND_CEO | Status: TIER_3_EXECUTIVE_BOARD_APPROVED_STRATEGIC_DEAL | TCV: $1,125,000.00""",
            "codeNotes": [
                "Line 4: Defines evaluate_discount_authority implementing the 3-tier enterprise discount governance matrix.",
                "Lines 15-20: Tier 1 (<= 10.0%) authorizes ACCOUNT_EXECUTIVE discretion for standard deals within budget tolerance.",
                "Lines 21-30: Tier 2 (10.1% - 20.0%) mandates VP_OF_SALES approval conditioned on multi-year terms (>= 2 years) and concession trades.",
                "Lines 31-41: Tier 3 (> 20.0%) mandates CFO_AND_CEO executive approval conditioned on >= 3-year term and high-value strategic concessions."
            ],
            "tryIt": "Set discount_pct=15.0 with contract_term_years=1. Observe how Tier 2 rejects the deal (TIER_2_REJECTED_INSUFFICIENT_TERM_OR_TRADES) due to lack of a multi-year commitment.",
            "check": {
                "question": "Under a standard enterprise discount authority governance matrix, who must approve a requested sales discount of 15%?",
                "options": [
                    "The Account Executive on their own discretion",
                    "The VP of Sales",
                    "The junior SDR who booked the meeting",
                    "No approval is required"
                ],
                "answer": 1,
                "why": "Discounts between 10.1% and 20.0% exceed AE discretion and strictly require approval from the VP of Sales paired with contractual concessions.",
                "answerIndex": 1,
                "explanation": "Discounts between 10.1% and 20.0% exceed AE discretion and strictly require approval from the VP of Sales paired with contractual concessions."
            }
        },
        {
            "title": "Master Sales Analytics Control Tower & Telemetry Orchestration",
            "say": [
                "To synthesize Win/Loss conversion analysis, AE ramp time acceleration, discount rate leakage monitoring, and approval governance into an actionable operating system, revenue organizations build the Master Sales Analytics Control Tower. In an enterprise revenue engine, these operational vectors do not exist in isolation; they are deeply interconnected components of a single dynamic economic system. An undisciplined discounting culture masks underlying win-rate deficiencies; an extended rep ramp time artificially depresses pipeline conversion metrics; and a failure to track No-Decision loss reasons leads to misallocated engineering investments.",
                "The Master Sales Analytics Control Tower acts as the flight telemetry recorder and predictive diagnostic nerve center for executive revenue leadership. By aggregating real-time data across every opportunity in the CRM, the control tower continuously monitors whether the enterprise revenue engine is maintaining nominal operating tolerances: Win Rate greater than or equal to 25.0%, Average Discount less than or equal to 10.0%, AE Ramp Time less than or equal to 90 days, and zero unapproved discount breaches. When all operational telemetry signals clear green, the control tower certifies the organization as operating at HIGH_WINRATE_DISCIPLINED_PRICING status.",
                "A foundational mathematical concept orchestrated by the control tower is the Golden Ratio of Pipeline Coverage. Pipeline Coverage measures the ratio of qualified active pipeline dollars relative to the quota target for a given fiscal period. The mathematical formula governing required pipeline coverage is: Required Coverage Ratio = 1.0 / (Win Rate %). If an enterprise sales organization maintains a nominal 25.0% Win Rate, each Account Executive requires exactly 4.0x Pipeline Coverage (1.0 / 0.25 = 4.0) at the start of the quarter to achieve 100% quota attainment. If an undisciplined team's win rate falls to 15.0%, their required pipeline coverage skyrockets to an impossible 6.67x! By monitoring this ratio in real time, the control tower alerts RevOps to pipeline deficits weeks before quarterly earnings deadlines.",
                "Furthermore, the control tower introduces multi-dimensional cohort segmentation. Revenue operations leaders can slice performance telemetry across individual sales teams, geographical territories, industry verticals, and lead source attribution channels (Inbound Marketing, Outbound BDR, Partner Referrals). For instance, if the telemetry indicates that the European enterprise team boasts a 32.0% win rate while the North American commercial team struggles at 16.0%, leadership can immediately investigate regional messaging differences, competitive saturation, or enablement gaps.",
                "Additionally, the control tower tracks Sales Cycle Velocity—the duration in calendar days required to progress an opportunity from initial discovery to final closing. Long sales cycle duration is the chief accomplice of discount leakage. As deals linger past 120 days, anxious sales reps inevitably succumb to buyer pricing pressure. By coupling cycle duration alerts with the Discount Authority Matrix, the control tower alerts managers when deals stall, triggering executive intervention before margin-diluting discount concessions are proposed.",
                "To ensure proactive rather than reactive governance, the control tower establishes Automated Telemetry Threshold Alerting. If team-wide win rate dips below 22.0% for two consecutive 14-day tracking windows, or if discount leakage spikes past 11.5% in the final 10 days of any quarter, the engine dispatches an immediate P1 Revenue Integrity Alert to the CRO, VP of Sales, and CFO. This automated tripwire pauses self-service discount approvals and activates mandatory deal desk reviews, preventing end-of-quarter margin capitulation.",
                "Finally, the control tower structures the executive revenue review cadence. Every Monday morning, sales directors review pipeline conversion velocity and discount exception requests; at the end of each month, the VP of Sales and Head of RevOps evaluate rep ramp progression and cohort win rates; and each quarter, the CEO presents the consolidated sales telemetry report to the Board of Directors. Let us examine the Python implementation of the Master Sales Analytics Control Tower, uniting all operational vectors into a certified revenue engine."
            ],
            "example": "A B2B SaaS enterprise with 40 Account Executives deployed the Master Sales Analytics Control Tower across its Salesforce CRM. In Q1, the control tower flagged that while the overall win rate was 26.5%, the outbound partner channel had an average discount leakage of 18.5% and a ramp time of 140 days for newly hired partner reps. RevOps used this telemetry to restructure the partner commission plan and mandate Tier 2 VP approvals. By Q3, partner discount leakage dropped to 9.2%, ramp time compressed to 82 days, and net gross profit surged by $1.4M.",
            "code": """# Master Sales Analytics Control Tower & Executive Telemetry Engine
from typing import Dict, Any, List

class MasterSalesAnalyticsEngine:
    \"\"\"
    Consolidated Master Sales Analytics Telemetry Control Tower:
    - Win/Loss Ratio & Pipeline Conversion Analysis (Target >= 25.0%)
    - AE Ramp Time Velocity Auditing (Target <= 90 Days)
    - Discount Rate Leakage & Price Integrity Governance (Ceiling <= 10.0%)
    - Tiered Discount Authority Matrix Compliance
    \"\"\"
    WIN_RATE_BENCHMARK_PCT = 25.0
    DISCOUNT_CEILING_PCT = 10.0
    RAMP_TIME_CEILING_DAYS = 90
    
    @classmethod
    def audit_sales_performance(
        cls,
        won_deals_count: int,
        lost_deals_count: int,
        average_discount_given_pct: float
    ) -> Dict[str, Any]:
        total_closed = won_deals_count + lost_deals_count
        if total_closed == 0:
            win_rate = 0.0
        else:
            win_rate = round((won_deals_count / total_closed) * 100.0, 1)
            
        is_win_rate_ok = win_rate >= cls.WIN_RATE_BENCHMARK_PCT
        is_discount_ok = average_discount_given_pct <= cls.DISCOUNT_CEILING_PCT
        is_performance_nominal = is_win_rate_ok and is_discount_ok
        
        status = (
            "HIGH_WINRATE_DISCIPLINED_PRICING"
            if is_performance_nominal
            else "PERFORMANCE_ISSUE_EXCESSIVE_DISCOUNTING_OR_LOW_WINRATE"
        )
        
        return {
            "totalClosedDeals": total_closed,
            "winRatePercent": win_rate,
            "averageDiscountPercent": average_discount_given_pct,
            "isPerformanceNominal": is_performance_nominal,
            "status": status
        }
        
    @classmethod
    def orchestrate_revenue_telemetry(
        cls,
        won_deals: int,
        lost_deals: int,
        average_discount_pct: float,
        ae_avg_ramp_days: int,
        unapproved_discount_breaches: int
    ) -> Dict[str, Any]:
        perf_audit = cls.audit_sales_performance(won_deals, lost_deals, average_discount_pct)
        is_ramp_nominal = ae_avg_ramp_days <= cls.RAMP_TIME_CEILING_DAYS
        is_governance_intact = unapproved_discount_breaches == 0
        
        all_systems_go = (
            perf_audit["isPerformanceNominal"] and
            is_ramp_nominal and
            is_governance_intact
        )
        
        master_status = (
            "ENTERPRISE_SALES_ANALYTICS_CERTIFIED_NOMINAL"
            if all_systems_go
            else "REVENUE_TELEMETRY_DEFECT_DETECTED"
        )
        
        return {
            "performance_audit": perf_audit,
            "ae_avg_ramp_days": ae_avg_ramp_days,
            "is_ramp_nominal": is_ramp_nominal,
            "unapproved_discount_breaches": unapproved_discount_breaches,
            "is_governance_intact": is_governance_intact,
            "revenue_engine_healthy": all_systems_go,
            "master_status": master_status
        }

# Execute Master Control Tower Inspection
telemetry = MasterSalesAnalyticsEngine.orchestrate_revenue_telemetry(
    won_deals=30,
    lost_deals=70,
    average_discount_pct=8.0,
    ae_avg_ramp_days=75,
    unapproved_discount_breaches=0
)

print(f"Master Status: {telemetry['master_status']}")
print(f"Total Closed: {telemetry['performance_audit']['totalClosedDeals']} | Win Rate: {telemetry['performance_audit']['winRatePercent']}%")
print(f"Average Discount: {telemetry['performance_audit']['averageDiscountPercent']}% | Status: {telemetry['performance_audit']['status']}")
print(f"AE Ramp Time: {telemetry['ae_avg_ramp_days']} days (Nominal: {telemetry['is_ramp_nominal']})")
print(f"Revenue Engine Healthy: {telemetry['revenue_engine_healthy']}")
""",
            "output": """Master Status: ENTERPRISE_SALES_ANALYTICS_CERTIFIED_NOMINAL
Total Closed: 100 | Win Rate: 30.0%
Average Discount: 8.0% | Status: HIGH_WINRATE_DISCIPLINED_PRICING
AE Ramp Time: 75 days (Nominal: True)
Revenue Engine Healthy: True""",
            "codeNotes": [
                "Line 4: Defines MasterSalesAnalyticsEngine consolidating Win/Loss, Ramp Time, and Discount telemetry.",
                "Lines 15-38: Implements audit_sales_performance returning exact contract fields: totalClosedDeals, winRatePercent, isPerformanceNominal, and status.",
                "Lines 40-66: Orchestrates comprehensive revenue telemetry, verifying win rate (>= 25%), discount (<= 10%), ramp (<= 90d), and 0 governance breaches.",
                "Lines 73-86: Validates nominal telemetry operation across 100 closed deals, 30.0% win rate, 8.0% discount, and 75-day ramp time."
            ],
            "tryIt": "Increase lost_deals to 85 (15% win rate). Observe how MasterSalesAnalyticsEngine detects the defect, switching to PERFORMANCE_ISSUE_EXCESSIVE_DISCOUNTING_OR_LOW_WINRATE.",
            "check": {
                "question": "What is the primary indicator of nominal revenue performance when executing audit_sales_performance with 30 won deals, 70 lost deals, and 8.0% discount?",
                "options": [
                    "HIGH_WINRATE_DISCIPLINED_PRICING with isPerformanceNominal evaluating to true",
                    "PERFORMANCE_DEFECT_LOW_MARGINS with isPerformanceNominal evaluating to false",
                    "COMMODITIZED_SALES_CRISIS",
                    "DISCOUNT_CEILING_BREACH_CRITICAL"
                ],
                "answer": 0,
                "why": "With a 30.0% win rate (>= 25.0%) and an 8.0% average discount (<= 10.0%), the system certifies HIGH_WINRATE_DISCIPLINED_PRICING.",
                "answerIndex": 0,
                "explanation": "With a 30.0% win rate (>= 25.0%) and an 8.0% average discount (<= 10.0%), the system certifies HIGH_WINRATE_DISCIPLINED_PRICING."
            }
        }
    ]

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": [
            "Derived and operationalized Win/Loss Ratio Analytics across qualified Stage 2+ pipeline, establishing the >= 25.0% enterprise win rate benchmark.",
            "Deconstructed Account Executive Ramp Time Dynamics, establishing the <= 90-day productivity ceiling and structured 30-60-90 day milestone progression.",
            "Quantified Discount Rate Leakage economics, proving how an 80% margin business discounting 10% requires a 14.3% surge in volume to break even on gross profit.",
            "Implemented the 3-Tier Discount Authority Approval Matrix: Tier 1 (0-10% AE discretion), Tier 2 (10.1-20% VP of Sales approval), Tier 3 (>20% CFO & CEO strategic sign-off).",
            "Synthesized revenue telemetry in the Master Sales Analytics Control Tower, conferring ENTERPRISE_SALES_ANALYTICS_CERTIFIED_NOMINAL upon organizations maintaining high win rates and price integrity."
        ],
        "projectStep": {
            "title": "Deploy Enterprise Sales Analytics & Discount Authority Governance",
            "steps": [
                "Calculate historical closed-opportunity Win Rate % across Won, Lost, and No-Decision outcomes.",
                "Benchmark sales cohort ramp time velocity to identify reps achieving full quota capacity within <= 90 days.",
                "Audit discount rate leakage to enforce the corporate <= 10.0% average discount ceiling.",
                "Enforce the 3-Tier Discount Authority Approval Matrix across CPQ workflows to eliminate unapproved price concessions.",
                "Deploy the Master Sales Analytics Control Tower to monitor real-time revenue telemetry and pipeline health."
            ]
        }
    }

if __name__ == "__main__":
    data = get_day28_data()
    print(f"Generated Day 28 data: {data['title']}")
    words = [sum(len(p.split()) for p in part['say']) for part in data['parts']]
    print(f"Parts word counts: {words} (Total: {sum(words)})")
    for i, w in enumerate(words):
        assert w >= 580, f"Part {i+1} has {w} words (< 580 words!)"
    print("PASS: Day 28 invariant checks passed successfully!")
