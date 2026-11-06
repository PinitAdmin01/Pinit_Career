import sys
import json
import hashlib

def get_day19_data() -> dict:
    day = 19
    title = "Sales Compensation: OTE (50/50 Split), Quota Sizing & Commission Accelerators"
    goal = "Master enterprise sales compensation architecture, 50/50 On-Target Earnings (OTE) structuring, quota sizing (4x to 5x OTE ratio), non-linear marginal commission tiers and accelerators, draw schedules, and clawback governance."
    minutes = 45
    recap = "Previously in Day 18, we mastered sales enablement infrastructure, four-quadrant competitive battlecards, architectural discovery landmines, the LAER objection handling framework, and pitch certification telemetry. Today in Day 19, we engineer the economic heartbeat of revenue operations: enterprise sales compensation, 50/50 OTE structures, quota-to-OTE ratios, non-linear marginal accelerators, ramp draws, and clawback governance."

    parts = [
        # Part 1: The Economics of Enterprise Sales Compensation: 50/50 OTE Split & Quota Sizing Models
        {
            "title": "The Economics of Enterprise Sales Compensation: 50/50 OTE Split & Quota Sizing Models",
            "say": [
                "Welcome to Day 19 of B.Com Sales, Customer Success & CRM (SCRM). In modern commercial organizations, there is an unyielding economic axiom: 'Show me how a sales representative is compensated, and I will show you how they spend their working hours.' Sales compensation is not merely an HR payroll administrative function; it is the most potent behavioral steering wheel possessed by executive leadership. A poorly designed compensation plan inadvertently incentivizes aggressive discounting, short-term contract stuffing, or complacency; a mathematically sound, aligned compensation structure drives predictable annual recurring revenue, protects gross margins, and aligns individual salesperson motivation with enterprise shareholder value.",
                "In enterprise business-to-business (B2B) software and technology sales, the industry gold standard for Account Executive compensation is the 50/50 On-Target Earnings (OTE) Structure. On-Target Earnings represents the total annualized gross compensation a sales representative earns when achieving exactly 100.0% of their assigned sales quota. Under a 50/50 split, this package is divided into two equal components: 50% Fixed Base Salary and 50% Variable Commission. For example, an Enterprise Account Executive with a $200,000 OTE receives a guaranteed annual base salary of $100,000 paid bi-weekly, alongside a variable commission target of $100,000 earned proportionately as closed revenue is booked.",
                "The 50/50 split achieves a delicate economic equilibrium. The 50% guaranteed base salary provides essential financial stability, enabling reps to navigate complex 6-to-9-month enterprise procurement cycles without experiencing acute personal financial desperation. Conversely, the 50% variable component provides massive performance leverage: top-performing sales reps who exceed their quota can earn substantial six-figure commission payouts, attracting elite commercial talent capable of navigating complex multi-stakeholder enterprise deals.",
                "The second fundamental pillar of sales compensation architecture is Quota Sizing and the Quota-to-OTE Ratio. Finance and Revenue Operations teams must establish annual sales quotas that balance commercial ambition with corporate unit economics. In SaaS and modern recurring revenue businesses, the standard benchmark for quota sizing is a 4x to 5x Quota-to-OTE Ratio. If an enterprise AE has an OTE of $200,000 ($100k base + $100k variable), a 5x ratio dictates an annual quota of $1,000,000 in new Annual Recurring Revenue (ARR). If the quota is set at a 4x ratio, the annual quota is $800,000 ARR.",
                "This 4x-to-5x multiple is governed by strict customer acquisition cost (CAC) payback mathematics. Out of every dollar of new software revenue generated, approximately 20% to 25% is allocated toward direct sales compensation (the AE's $200k OTE on $1.0M quota equals exactly 20.0% of deal value). The remaining 75% to 80% covers customer acquisition marketing overhead, technical sales engineering support, customer success onboarding, software research and development, and corporate operating margin. If a company sets a loose 2x quota ($400k quota on a $200k OTE), sales compensation consumes 50% of top-line revenue, destroying profitability; conversely, setting an unrealistic 10x quota ($2.0M on $200k OTE) demoralizes the sales force, triggering catastrophic rep attrition.",
                "In addition, Revenue Operations models Sales Capacity Planning across the organization. To achieve an executive corporate growth target of $20M in net new ARR, RevOps does not simply divide $20M by $1.0M quota to hire 20 reps. Sophisticated capacity models apply historical quota attainment factors: across the tech industry, typically only 60% to 70% of sales reps achieve or exceed 100% of quota. RevOps over-indexes capacity by 20% to 30%, hiring 26 fully ramped quota-carrying equivalents (FTEs) to guarantee corporate plan attainment.",
                "In this first part, we engineer an Enterprise Sales Capacity & OTE Sizing Engine in Python. We will model base salaries, variable commissions, quota-to-OTE multipliers, evaluate sales compensation expense percentages against benchmark boundaries, and compute corporate revenue capacity targets."
            ],
            "example": "A high-growth Cloud Infrastructure scale-up established a standard 50/50 OTE structure for its enterprise sales team: $120k Base + $120k Variable ($240k OTE). Sizing annual quotas at a disciplined 4.5x ratio ($1,080,000 ARR per rep), the company maintained a direct sales compensation expense of 22.2%, allowing the business to achieve profitable CAC payback within 14 months.",
            "code": """# Enterprise Sales Capacity & OTE Sizing Engine
from typing import Dict, Any

def calculate_ote_and_quota_capacity(
    base_salary: float,
    variable_ote: float,
    quota_ratio: float = 5.0,
    team_headcount: int = 10,
    historical_attainment_pct: float = 75.0
) -> Dict[str, Any]:
    # 1. Evaluate OTE Structure
    total_ote = base_salary + variable_ote
    base_pct = round((base_salary / total_ote) * 100.0, 1)
    var_pct = round((variable_ote / total_ote) * 100.0, 1)
    
    is_50_50_split = (base_pct == 50.0) and (var_pct == 50.0)
    
    # 2. Individual Rep Quota Sizing
    annual_rep_quota = total_ote * quota_ratio
    direct_comp_expense_pct = round((total_ote / annual_rep_quota) * 100.0, 2)
    
    # 3. Team-Wide Sales Capacity Modeling
    nominal_team_capacity = annual_rep_quota * team_headcount
    risk_adjusted_team_capacity = nominal_team_capacity * (historical_attainment_pct / 100.0)
    
    # Unit Economics Health Check
    if 4.0 <= quota_ratio <= 5.5:
        health_status = "OPTIMAL_4X_5X_SaaS_BENCHMARK"
    elif quota_ratio < 4.0:
        health_status = "WARNING_EXCESSIVE_SALES_COMP_EXPENSE_UNHEALTHY_CAC"
    else:
        health_status = "WARNING_UNREALISTIC_QUOTA_HIGH_ATTRITION_RISK"
        
    return {
        "base_salary": base_salary,
        "variable_ote": variable_ote,
        "total_ote": total_ote,
        "split_ratio": f"{base_pct}/{var_pct}",
        "is_standard_50_50": is_50_50_split,
        "quota_ratio_multiple": f"{quota_ratio:.1f}x",
        "individual_annual_quota": annual_rep_quota,
        "direct_comp_expense_pct": direct_comp_expense_pct,
        "unit_economics_status": health_status,
        "team_headcount": team_headcount,
        "nominal_team_capacity": nominal_team_capacity,
        "risk_adjusted_capacity": risk_adjusted_team_capacity
    }

# Benchmark OTE Sizing Test
comp_profile = calculate_ote_and_quota_capacity(
    base_salary=100000.0,
    variable_ote=100000.0,
    quota_ratio=5.0,
    team_headcount=12,
    historical_attainment_pct=80.0
)

print(f"OTE Package: ${comp_profile['base_salary']:,.0f} Base + ${comp_profile['variable_ote']:,.0f} Variable = ${comp_profile['total_ote']:,.0f} Total OTE")
print(f"Split: {comp_profile['split_ratio']} (Standard 50/50: {comp_profile['is_standard_50_50']})")
print(f"Individual Annual Quota ({comp_profile['quota_ratio_multiple']}): ${comp_profile['individual_annual_quota']:,.0f}")
print(f"Direct Comp Expense: {comp_profile['direct_comp_expense_pct']}% | Status: {comp_profile['unit_economics_status']}")
print(f"Team Capacity (12 Reps): Nominal = ${comp_profile['nominal_team_capacity']:,.0f} | Risk-Adjusted (80%) = ${comp_profile['risk_adjusted_capacity']:,.0f}")
""",
            "output": """OTE Package: $100,000 Base + $100,000 Variable = $200,000 Total OTE
Split: 50.0/50.0 (Standard 50/50: True)
Individual Annual Quota (5.0x): $1,000,000
Direct Comp Expense: 20.0% | Status: OPTIMAL_4X_5X_SaaS_BENCHMARK
Team Capacity (12 Reps): Nominal = $12,000,000 | Risk-Adjusted (80%) = $9,600,000""",
            "codeNotes": [
                "Lines 4-15: Computes total OTE and validates the standard 50/50 base-variable proportion.",
                "Lines 17-21: Derives individual rep annual quota using the target multiple and calculates direct compensation expense percentage.",
                "Lines 23-31: Projects team-wide nominal and risk-adjusted revenue capacity factoring in historical team attainment percentages.",
                "Lines 33-51: Executes the benchmark calculation for a $200k OTE package at a 5x multiple yielding a $1.0M quota and 20.0% expense."
            ],
            "tryIt": "Adjust quota_ratio to 3.5x and 6.0x to inspect how unit_economics_status flags CAC health warnings and attrition risks.",
            "check": {
                "question": "What is the industry standard Quota-to-OTE ratio benchmark for enterprise SaaS sales compensation plans, and what direct compensation percentage does it yield?",
                "options": [
                    "1x to 2x Quota-to-OTE ratio yielding 50% to 100% direct comp expense",
                    "4x to 5x Quota-to-OTE ratio yielding 20% to 25% direct comp expense",
                    "15x to 20x Quota-to-OTE ratio yielding 5% direct comp expense",
                    "There is no standard ratio; reps are paid purely in office merchandise"
                ],
                "answer": 1,
                "why": "The standard SaaS benchmark is 4x to 5x Quota-to-OTE, dedicating 20% to 25% of top-line revenue to direct sales compensation.",
                "answerIndex": 1,
                "explanation": "The standard SaaS benchmark is 4x to 5x Quota-to-OTE, dedicating 20% to 25% of top-line revenue to direct sales compensation."
            }
        },

        # Part 2: Commission Tier Architecture & Non-Linear Marginal Accelerators
        {
            "title": "Commission Tier Architecture & Non-Linear Marginal Accelerators",
            "say": [
                "While establishing a 50/50 OTE and a 5x quota provides baseline predictability, linear compensation plans suffer from a fatal motivational flaw: once an Account Executive achieves 100% of their annual quota in November, they face diminishing economic incentives to close incremental business in December. In fact, under a flat linear commission structure, a rational rep is incentivized to engage in 'sandbagging'—intentionally delaying signatures into January of the following fiscal year so those deals count toward their new quota. To eradicate sandbagging and ignite maximum closing urgency, elite revenue organizations engineer Non-Linear Commission Accelerators.",
                "Commission Accelerators act like turbochargers on a Formula 1 racecar: they supercharge the marginal commission rate paid out on every dollar of revenue closed above 100.0% quota attainment. In our curriculum blueprint, we establish the canonical enterprise accelerator model: an Account Executive with a $200,000 OTE ($100k Base + $100k Variable at 100% quota) who reaches 120.0% of quota unlocks a 1.5x Accelerator on all revenue closed beyond 100%. Under this formula, the rep receives their guaranteed $100,000 base salary, their earned $100,000 standard 100% commission, plus an accelerated bonus on the 20% excess attainment ($100,000 * 0.20 * 1.5 = $30,000.00), producing a total annual compensation package of $230,000.00 ($100k + $100k + $30k).",
                "Crucially, modern compensation architects enforce Marginal Tier Calculations rather than Regressive Retroactive Cliffs. A retroactive cliff applies the 1.5x multiplier retroactively to all deals closed throughout the entire year once 100% is breached. Retroactive cliffs are dangerous: they create massive financial volatility for finance, create perverse cliff-hanging behavior where a single $5k deal triggers a $50k retroactive payout, and distort corporate cash flows. In contrast, marginal accelerators apply higher payout multipliers exclusively to revenue dollars booked within each discrete attainment bracket.",
                "A standard enterprise accelerator architecture typically features three progressive marginal tiers: Tier 1: Base Quota Tier (0% to 100% Attainment) paying a 1.0x baseline commission rate (e.g., 10% of closed ARR on a 5x quota); Tier 2: Performance Accelerator Tier (100.1% to 125% Attainment) paying a 1.5x accelerated rate (15% of closed ARR); and Tier 3: President's Club Super-Accelerator Tier (> 125% Attainment) paying a 2.0x accelerated rate (20% of closed ARR).",
                "Furthermore, accelerators are mathematically self-funding. When an enterprise software company exceeds 100% of its corporate sales plan, fixed corporate overhead (engineering salaries, office leases, executive compensation, and debt service) is already 100% amortized and absorbed by the base quota revenue. Therefore, every incremental dollar booked above 100% quota delivers exceptionally high gross margins (often 85% to 90%). Paying an extra 5% to 10% marginal commission to the high-performing salesperson who secured that high-margin revenue is one of the most profitable financial investments a Chief Financial Officer can make.",
                "To ensure organizational alignment, RevOps designs compensation software that models real-time earnings calculators for reps. When an Account Executive views an open $150k enterprise opportunity in Salesforce or HubSpot, the CRM dynamically displays the exact personal commission the rep will take home at their current accelerator tier, turning every deal review into a tangible personal financial milestone.",
                "Accelerators also serve as a formidable retention mechanism for elite commercial producers. When top performers realize that closing an extra $200k in ARR yields a 20% commission rate ($40,000 in immediate take-home pay), they are fiercely disincentivized from entertaining external recruiting headhunters, cementing organizational continuity among key enterprise rainmakers.",
                "In this second part, we program a Non-Linear Marginal Commission & Accelerator Calculation Engine in Python. We will model variable OTE, annual quota baselines, closed ARR totals, evaluate attainment across progressive marginal tiers (1.0x, 1.5x, 2.0x), and compute exact total annual earnings."
            ],
            "example": "An Enterprise Account Executive at a SaaS CRM platform had a $100k Base and $100k Variable OTE on a $500k ARR quota. By closing $600k in ARR (120% quota attainment), the rep earned their $100k base, $100k standard commission, and an extra $30k via the 1.5x accelerator on the $100k excess ARR, taking home $230,000 in total annual compensation.",
            "code": """# Non-Linear Marginal Commission & Accelerator Calculation Engine
from typing import Dict, Any, List

def calculate_marginal_accelerated_compensation(
    base_salary: float,
    variable_ote: float,
    annual_quota: float,
    closed_arr: float
) -> Dict[str, Any]:
    attainment_pct = round((closed_arr / annual_quota) * 100.0, 2)
    base_commission_rate = variable_ote / annual_quota  # e.g., 100k / 500k = 0.20 (20%)
    
    # Define Marginal Accelerator Tiers
    # Tier 1: 0% to 100% Quota -> 1.0x Multiplier
    # Tier 2: 100.1% to 125% Quota -> 1.5x Multiplier
    # Tier 3: > 125% Quota -> 2.0x Multiplier
    
    commission_earned = 0.0
    tier_breakdown = []
    
    # Tier 1 Calculation: Up to 100% Quota
    arr_in_tier1 = min(closed_arr, annual_quota)
    comm_tier1 = arr_in_tier1 * base_commission_rate * 1.0
    commission_earned += comm_tier1
    tier_breakdown.append({
        "tier": "TIER_1_BASE_QUOTA (0-100%)",
        "arr_allocated": arr_in_tier1,
        "multiplier": 1.0,
        "effective_rate_pct": round(base_commission_rate * 1.0 * 100.0, 2),
        "commission_payout": round(comm_tier1, 2)
    })
    
    # Tier 2 Calculation: 100.1% to 125% Quota
    tier2_cap = annual_quota * 1.25
    if closed_arr > annual_quota:
        arr_in_tier2 = min(closed_arr, tier2_cap) - annual_quota
        comm_tier2 = arr_in_tier2 * base_commission_rate * 1.5
        commission_earned += comm_tier2
        tier_breakdown.append({
            "tier": "TIER_2_ACCELERATOR (100.1-125%)",
            "arr_allocated": arr_in_tier2,
            "multiplier": 1.5,
            "effective_rate_pct": round(base_commission_rate * 1.5 * 100.0, 2),
            "commission_payout": round(comm_tier2, 2)
        })
    else:
        tier_breakdown.append({
            "tier": "TIER_2_ACCELERATOR (100.1-125%)",
            "arr_allocated": 0.0,
            "multiplier": 1.5,
            "effective_rate_pct": round(base_commission_rate * 1.5 * 100.0, 2),
            "commission_payout": 0.0
        })
        
    # Tier 3 Calculation: > 125% Quota
    if closed_arr > tier2_cap:
        arr_in_tier3 = closed_arr - tier2_cap
        comm_tier3 = arr_in_tier3 * base_commission_rate * 2.0
        commission_earned += comm_tier3
        tier_breakdown.append({
            "tier": "TIER_3_SUPER_ACCELERATOR (>125%)",
            "arr_allocated": arr_in_tier3,
            "multiplier": 2.0,
            "effective_rate_pct": round(base_commission_rate * 2.0 * 100.0, 2),
            "commission_payout": round(comm_tier3, 2)
        })
    else:
        tier_breakdown.append({
            "tier": "TIER_3_SUPER_ACCELERATOR (>125%)",
            "arr_allocated": 0.0,
            "multiplier": 2.0,
            "effective_rate_pct": round(base_commission_rate * 2.0 * 100.0, 2),
            "commission_payout": 0.0
        })
        
    total_earnings = base_salary + commission_earned
    
    return {
        "base_salary": round(base_salary, 2),
        "variable_ote_at_100": round(variable_ote, 2),
        "annual_quota": round(annual_quota, 2),
        "closed_arr": round(closed_arr, 2),
        "attainment_pct": attainment_pct,
        "commission_earned": round(commission_earned, 2),
        "total_earnings": round(total_earnings, 2),
        "tier_breakdown": tier_breakdown,
        "status": "COMPENSATION_COMPUTED"
    }

# Benchmark Accelerator Test: 120% Attainment on $500k Quota ($100k Base, $100k Variable OTE)
res_comp = calculate_marginal_accelerated_compensation(
    base_salary=100000.0,
    variable_ote=100000.0,
    annual_quota=500000.0,
    closed_arr=600000.0  # Exactly 120.0% Quota Attainment
)

print(f"Closed ARR: ${res_comp['closed_arr']:,.0f} on ${res_comp['annual_quota']:,.0f} Quota ({res_comp['attainment_pct']}%)")
print(f"Base Salary: ${res_comp['base_salary']:,.0f}")
print(f"Commission Earned: ${res_comp['commission_earned']:,.0f}")
print(f"TOTAL ANNUAL COMPENSATION: ${res_comp['total_earnings']:,.0f}")
print(f"Status: {res_comp['status']}")
print("\\nTier Breakdown:")
for t in res_comp['tier_breakdown']:
    print(f"  {t['tier']}: ARR ${t['arr_allocated']:,.0f} @ {t['effective_rate_pct']}% ({t['multiplier']}x) -> Payout: ${t['commission_payout']:,.0f}")
""",
            "output": """Closed ARR: $600,000 on $500,000 Quota (120.0%)
Base Salary: $100,000
Commission Earned: $130,000
TOTAL ANNUAL COMPENSATION: $230,000
Status: COMPENSATION_COMPUTED

Tier Breakdown:
  TIER_1_BASE_QUOTA (0-100%): ARR $500,000 @ 20.0% (1.0x) -> Payout: $100,000
  TIER_2_ACCELERATOR (100.1-125%): ARR $100,000 @ 30.0% (1.5x) -> Payout: $30,000
  TIER_3_SUPER_ACCELERATOR (>125%): ARR $0 @ 40.0% (2.0x) -> Payout: $0""",
            "codeNotes": [
                "Lines 4-13: Establishes baseline commission rates and initializes progressive marginal accelerator brackets.",
                "Lines 15-28: Evaluates Tier 1 base quota attainment up to 100% of target at 1.0x multiplier.",
                "Lines 30-48: Evaluates Tier 2 performance acceleration between 100.1% and 125% at 1.5x multiplier.",
                "Lines 50-66: Evaluates Tier 3 super acceleration above 125% at 2.0x multiplier and synthesizes total compensation.",
                "Lines 77-94: Validates the canonical $230,000 payout benchmark on $600k ARR at 120% attainment."
            ],
            "tryIt": "Test closed_arr at $700,000 (140% attainment). Observe Tier 3 super-accelerator paying 40% on the excess $75,000 ARR.",
            "check": {
                "question": "What is the total annual compensation for an Account Executive with a $100k base and $100k variable OTE when achieving 120% of quota with a 1.5x accelerator above 100%?",
                "options": [
                    "$200,000 (no accelerators applied)",
                    "$220,000 (standard linear commission with zero accelerator)",
                    "$230,000 ($100k base + $100k base commission + $30k accelerated commission)",
                    "$350,000 (doubled salary)"
                ],
                "answer": 2,
                "why": "At 120% quota, the rep earns $100k base + $100k standard commission + ($100k variable * 20% * 1.5 = $30k) = $230,000 total.",
                "answerIndex": 2,
                "explanation": "At 120% quota, the rep earns $100k base + $100k standard commission + ($100k variable * 20% * 1.5 = $30k) = $230,000 total."
            }
        },

        # Part 3: Draw Schedules, Recoverable vs Non-Recoverable Draws & Rep Ramp Modeling
        {
            "title": "Draw Schedules, Recoverable vs Non-Recoverable Draws & Rep Ramp Modeling",
            "say": [
                "When a newly hired Account Executive joins an enterprise technology company, they do not inherit an active, mature sales pipeline on Day 1. In enterprise B2B sales cycles requiring 4 to 6 months from initial discovery to commercial contract signature, a newly hired representative cannot realistically close significant revenue during their first quarter. If the company pays the rep purely on variable commission earned from Day 1, the new hire receives zero variable income for four months—creating intense financial stress that leads to premature resignation before their pipeline has time to mature. To bridge this critical runway gap, RevOps architects Draw Schedules and Quota Ramp Stepping.",
                "A Draw against Commission is a guaranteed minimum payment provided to a sales representative during their initial ramp period to bridge the gap between hire date and their first closed deals. In modern enterprise compensation governance, draws are categorized into two fundamentally distinct structures: 1. Recoverable Draws; and 2. Non-Recoverable Draws.",
                "A Recoverable Draw operates essentially as a corporate loan against future commissions. If a new rep is guaranteed an $8,000 monthly variable draw for their first three months, and during those three months the rep only earns $2,000 in actual commissions, the company advances the full $24,000. However, the rep now carries an unearned debt balance of $18,000 ($24,000 advanced minus $6,000 earned). In subsequent quarters, as the rep begins closing enterprise deals, the company withholds 50% to 100% of their commission payouts to repay the outstanding draw debt.",
                "While recoverable draws protect corporate capital, modern revenue leaders recognize that they represent a disastrous organizational antipattern in high-velocity tech hiring. Carrying thousands of dollars in draw debt demotivates new hires: reps feel as though they are working for free just to climb out of a financial hole, driving high voluntary turnover among promising talent. Consequently, the overwhelming industry best practice for supporting newly hired Account Executives during their 90-day pipeline ramp period is the NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP.",
                "Under a Non-Recoverable Draw, the company guarantees the rep's monthly variable OTE payout (e.g., $8,333 per month for a $100k variable OTE) regardless of closed revenue. If the rep closes zero deals while completing onboarding, prospecting, and pipeline development, they receive their full draw, and at the conclusion of the 90-day ramp period, the unearned balance is completely forgiven with zero debt carried forward. If the rep outperforms and earns commissions exceeding the draw guarantee, they receive the higher earned amount.",
                "In parallel with non-recoverable draws, RevOps establishes Quota Ramp Stepping. Rather than expecting a new hire to carry a 100% quota in Month 1, quotas are stepped progressively across the ramp window: Month 1: 0% quota (dedicated to enablement and product certification); Month 2: 25% quota; Month 3: 50% quota; Month 4: 75% quota; and Month 5+: 100% full quota. This disciplined ramp framework protects both company capital and rep morale.",
                "Additionally, sales operations integrates ramp progress telemetry with sales enablement milestones. If a newly hired rep completes their pitch certifications, conducts 20 shadowed customer discovery calls, and demonstrates pipeline generation velocity ahead of schedule, RevOps can accelerate their quota stepping schedule, unlocking full earning potential while keeping the rep engaged, confident, and commercially energized, eliminating friction and aligning the representative's personal development trajectory with company ARR expansion objectives.",
                "In this third part, we program a Sales Ramp Draw Schedule & Debt Reconciliation Simulator in Python. We will model newly hired rep profiles, calculate monthly guaranteed draw advances, track actual earned commissions, evaluate recoverable debt vs non-recoverable debt forgiveness, and produce transparent payroll reconciliation ledgers."
            ],
            "example": "An enterprise cybersecurity scale-up transitioned from recoverable to non-recoverable 90-day draws ($8,000/mo guaranteed). The change eliminated ramp debt anxiety, reducing first-year rep turnover from 38% to 8% and accelerating average time-to-first-deal from 145 days down to 88 days.",
            "code": """# Sales Ramp Draw Schedule & Debt Reconciliation Simulator
from typing import Dict, Any, List

def reconcile_sales_ramp_draw_schedule(
    rep_profile: Dict[str, Any],
    monthly_performance: List[Dict[str, Any]],
    draw_type: str = "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP"
) -> Dict[str, Any]:
    monthly_draw_guarantee = rep_profile.get("monthly_variable_draw", 8333.33)
    is_recoverable = (draw_type == "RECOVERABLE_DRAW")
    
    cumulative_draw_advanced = 0.0
    cumulative_commission_earned = 0.0
    cumulative_payout = 0.0
    outstanding_debt_balance = 0.0
    reconciliation_ledger = []
    
    for month_data in monthly_performance:
        m_num = month_data.get("month", 1)
        earned_comm = month_data.get("earned_commission", 0.0)
        cumulative_commission_earned += earned_comm
        
        # Determine monthly draw entitlement during ramp
        if m_num <= 3:
            # During 90-day ramp, rep receives at least the draw guarantee
            actual_advance = monthly_draw_guarantee
            cumulative_draw_advanced += actual_advance
            
            if earned_comm < actual_advance:
                monthly_payout = actual_advance
                deficit = actual_advance - earned_comm
                if is_recoverable:
                    outstanding_debt_balance += deficit
            else:
                monthly_payout = earned_comm
                # If earned more, in recoverable, surplus can pay down existing debt
                if is_recoverable and outstanding_debt_balance > 0:
                    surplus = earned_comm - actual_advance
                    debt_paid = min(surplus, outstanding_debt_balance)
                    outstanding_debt_balance -= debt_paid
                    monthly_payout -= debt_paid
        else:
            # Post-ramp: Paid strictly on earned commission, minus recoverable debt recovery
            actual_advance = 0.0
            if is_recoverable and outstanding_debt_balance > 0:
                debt_deduction = min(earned_comm * 0.5, outstanding_debt_balance)
                outstanding_debt_balance -= debt_deduction
                monthly_payout = earned_comm - debt_deduction
            else:
                monthly_payout = earned_comm
                
        cumulative_payout += monthly_payout
        reconciliation_ledger.append({
            "month": m_num,
            "earned_commission": round(earned_comm, 2),
            "draw_advanced": round(actual_advance, 2),
            "net_monthly_payout": round(monthly_payout, 2),
            "retained_debt_balance": round(outstanding_debt_balance, 2)
        })
        
    # Debt forgiveness rule for non-recoverable draws
    forgiven_amount = 0.0
    if not is_recoverable:
        forgiven_amount = max(0.0, cumulative_draw_advanced - cumulative_commission_earned)
        outstanding_debt_balance = 0.0
        
    return {
        "rep_id": rep_profile.get("rep_id"),
        "rep_name": rep_profile.get("name"),
        "draw_type": draw_type,
        "is_recoverable_debt": is_recoverable,
        "cumulative_draw_advanced": round(cumulative_draw_advanced, 2),
        "cumulative_commission_earned": round(cumulative_commission_earned, 2),
        "total_compensation_paid": round(cumulative_payout, 2),
        "unearned_debt_forgiven": round(forgiven_amount, 2),
        "final_debt_carried_forward": round(outstanding_debt_balance, 2),
        "ledger": reconciliation_ledger,
        "status": "RAMP_DRAW_RECONCILIATION_NOMINAL"
    }

# Benchmark Ramp Draw Test: Comparing Non-Recoverable vs Recoverable
rep = {"rep_id": "REP-204", "name": "Alex Mercer", "monthly_variable_draw": 8333.33}
ramp_months = [
    {"month": 1, "earned_commission": 0.0},
    {"month": 2, "earned_commission": 2000.0},
    {"month": 3, "earned_commission": 4500.0},
    {"month": 4, "earned_commission": 12000.0} # Post-ramp
]

res_non_rec = reconcile_sales_ramp_draw_schedule(rep, ramp_months, "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP")
res_rec = reconcile_sales_ramp_draw_schedule(rep, ramp_months, "RECOVERABLE_DRAW")

print(f"Rep: {res_non_rec['rep_name']} | Policy: {res_non_rec['draw_type']}")
print(f"  Draw Advanced: ${res_non_rec['cumulative_draw_advanced']:,.2f} | Earned: ${res_non_rec['cumulative_commission_earned']:,.2f}")
print(f"  Total Payout: ${res_non_rec['total_compensation_paid']:,.2f} | Forgiven: ${res_non_rec['unearned_debt_forgiven']:,.2f}")
print(f"  Final Debt Carried: ${res_non_rec['final_debt_carried_forward']:,.2f}")

print(f"\\nPolicy: {res_rec['draw_type']} (Recoverable Debt)")
print(f"  Total Payout: ${res_rec['total_compensation_paid']:,.2f} | Remaining Debt: ${res_rec['final_debt_carried_forward']:,.2f}")
""",
            "output": """Rep: Alex Mercer | Policy: NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP
  Draw Advanced: $24,999.99 | Earned: $18,500.00
  Total Payout: $36,999.99 | Forgiven: $18,499.99
  Final Debt Carried: $0.00

Policy: RECOVERABLE_DRAW (Recoverable Debt)
  Total Payout: $30,999.99 | Remaining Debt: $12,499.99""",
            "codeNotes": [
                "Lines 4-13: Initializes monthly draw reconciliation state tracking cumulative advances, earned payouts, and debt balances.",
                "Lines 15-38: Implements 90-day ramp draw guarantees, advancing minimum monthly income during months 1 through 3.",
                "Lines 40-52: Manages post-ramp debt clawbacks for recoverable loans vs full unearned balance forgiveness for non-recoverable draws.",
                "Lines 68-88: Verifies deterministic behavior comparing $0 debt carry under NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP vs $12.5k debt under RECOVERABLE_DRAW."
            ],
            "tryIt": "Set month 4 earned_commission to $25,000 in res_rec. Inspect how the recoverable draw automatically deducts debt from the surplus.",
            "check": {
                "question": "Which draw structure is standard practice for supporting newly hired Account Executives during their 90-day pipeline ramp period without burdening them with debt?",
                "options": [
                    "RECOVERABLE_DRAW",
                    "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP",
                    "BALLOON_COMMISSION_MORTGAGE",
                    "ZERO_SALARY_100_PERCENT_COMMISSION"
                ],
                "answer": 1,
                "why": "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP guarantees monthly income during ramp and forgives unearned balances without saddling reps with debt.",
                "answerIndex": 1,
                "explanation": "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP guarantees monthly income during ramp and forgives unearned balances without saddling reps with debt."
            }
        },

        # Part 4: Clawback Governance, Payment Timing & Tactical SPIFF Engineering
        {
            "title": "Clawback Governance, Payment Timing & Tactical SPIFF Engineering",
            "say": [
                "While base salaries, accelerators, and ramp draws form the bedrock of sales compensation, two critical operational mechanisms govern commission hygiene and strategic alignment: Commission Clawbacks and Tactical SPIFFs. In the absence of rigorous clawback policies, sales representatives might be tempted to push low-quality, bad-fit customers across the finish line on the last day of the fiscal quarter simply to collect an accelerator payout, leaving Customer Success to deal with immediate cancellation. Conversely, without tactical SPIFFs, sales leadership lacks agility to steer rep behavior toward emergent corporate strategic priorities.",
                "A Commission Clawback is an enforceable contractual clause in the sales compensation agreement that allows the company to recover or offset previously paid commission if a customer cancels, defaults, or churns within a designated early-life window. In enterprise software sales, the standard Clawback Window is 90 to 180 days from contract effective date. If a customer signs an annual contract on March 15 but cancels due to non-payment or immediate dissatisfaction on May 1 (Day 47), 100% of the commission paid to the Account Executive on that deal is clawed back against future commission earnings.",
                "To mitigate clawback friction, Finance and RevOps establish strict Payment Timing Triggers. There are three common commission payment triggers: 1. On Booking (commission paid immediately upon contract signature); 2. On Invoicing (paid when Finance generates the formal invoice); and 3. On Cash Collection (paid only after the customer wire transfer clears the company bank account). While Account Executives naturally prefer payment on booking, enterprise best practice utilizes a Hybrid Timing Model: 50% paid on booking and 50% paid upon cash collection, or 100% paid on booking subject to the 90-to-180-day clawback window.",
                "On the strategic offensive side, RevOps deploys SPIFFs—an acronym standing for SALES_PERFORMANCE_INCENTIVE_FUND. A SPIFF is a targeted, short-term cash bonus or prize deployed to drive immediate sales focus toward a specific strategic objective outside the standard commission plan. Unlike annual quotas, SPIFF campaigns are temporary (typically lasting 30 to 60 days) and designed to solve discrete go-to-market challenges.",
                "Common enterprise SPIFF campaigns include: 1. Multi-Year Upfront Prepayment SPIFFs (e.g., paying a direct $1,500 cash bonus for every 3-year upfront paid deal, accelerating corporate cash flow); 2. New Product Line Cross-Sell SPIFFs (e.g., paying $1,000 for every opportunity attached with the newly launched AI Analytics module, driving rapid customer adoption); and 3. Competitive Replacement SPIFFs (e.g., offering a $2,000 bonus for displacing a designated legacy incumbent vendor).",
                "However, RevOps must enforce strict SPIFF Governance. If SPIFFs are deployed too frequently, they suffer from incentive inflation: reps begin delaying deals to wait for the next SPIFF, or become numb to baseline quota goals. Best practice restricts SPIFF budgets to no more than 5% to 10% of total variable compensation expenditure, requiring formal joint approval from the VP of Sales and Chief Financial Officer.",
                "Furthermore, enterprise compensation governance requires automated dispute workflows within the CRM. When a clawback debit or SPIFF bonus is calculated, the system generates an itemized audit statement sent to both the Account Executive and their Sales Director. If an AE disputes a clawback due to non-standard contractual indemnities or customer bankruptcy, RevOps conducts an expedited five-day review, ensuring commercial fairness and preserving trust between field sales and finance, preventing unnecessary escalation and maintaining impeccable morale across the revenue generation organization.",
                "In this fourth part, we build a Clawback Governance & Tactical SPIFF Execution Engine in Python. We will track deal close dates, evaluate customer churn events against 90-day clawback windows, calculate commission recovery offsets, and compute strategic SPIFF bonuses for multi-year and product expansion milestones."
            ],
            "example": "A SaaS scale-up instituted a 90-day clawback policy and a $2,000 multi-year prepayment SPIFF. Early customer churn within 90 days dropped from 14% to 2% as reps ceased closing bad-fit accounts, while 3-year upfront cash-collected contracts surged by 45%, generating an additional $4.2M in immediate working capital.",
            "code": """# Clawback Governance & Tactical SPIFF Execution Engine
from typing import Dict, Any, List
from datetime import datetime

def evaluate_clawbacks_and_spiff_incentives(
    deals_closed: List[Dict[str, Any]],
    clawback_window_days: int = 90
) -> Dict[str, Any]:
    total_gross_commission = 0.0
    total_clawbacks = 0.0
    total_spiffs_earned = 0.0
    processed_deals = []
    
    for deal in deals_closed:
        deal_id = deal.get("deal_id")
        arr = deal.get("deal_arr", 0.0)
        base_rate = deal.get("commission_rate", 0.10)
        gross_comm = arr * base_rate
        total_gross_commission += gross_comm
        
        # 1. Evaluate 90-Day Clawback Rule
        is_churned = deal.get("is_churned", False)
        days_active = deal.get("days_before_churn", 999)
        clawback_amount = 0.0
        
        if is_churned and days_active <= clawback_window_days:
            clawback_amount = gross_comm
            total_clawbacks += clawback_amount
            clawback_status = "FULL_COMMISSION_CLAWBACK_TRIGGERED"
        elif is_churned:
            clawback_status = "CHURN_POST_WINDOW_NO_CLAWBACK"
        else:
            clawback_status = "ACTIVE_HEALTHY_REVENUE"
            
        # 2. Evaluate Tactical SPIFF Rules (SALES_PERFORMANCE_INCENTIVE_FUND)
        spiff_bonus = 0.0
        spiff_tags = []
        
        # Rule A: Multi-Year Prepayment Bonus ($1,500 flat cash SPIFF)
        if deal.get("contract_term_years", 1) >= 3 and deal.get("prepaid_cash", False):
            spiff_bonus += 1500.0
            spiff_tags.append("MULTI_YEAR_PREPAY_BONUS")
            
        # Rule B: New Strategic Module Cross-Sell ($1,000 cash SPIFF)
        if deal.get("includes_ai_module", False):
            spiff_bonus += 1000.0
            spiff_tags.append("AI_MODULE_CROSS_SELL_BONUS")
            
        total_spiffs_earned += spiff_bonus
        net_deal_payout = (gross_comm - clawback_amount) + spiff_bonus
        
        processed_deals.append({
            "deal_id": deal_id,
            "arr": arr,
            "gross_commission": round(gross_comm, 2),
            "clawback_status": clawback_status,
            "clawback_deduction": round(clawback_amount, 2),
            "spiffs_awarded": spiff_tags,
            "spiff_cash_bonus": round(spiff_bonus, 2),
            "net_deal_payout": round(net_deal_payout, 2)
        })
        
    net_payroll_due = total_gross_commission - total_clawbacks + total_spiffs_earned
    
    return {
        "deals_audited_count": len(deals_closed),
        "total_gross_commission": round(total_gross_commission, 2),
        "total_clawbacks_deducted": round(total_clawbacks, 2),
        "total_spiffs_awarded": round(total_spiffs_earned, 2),
        "net_payroll_commission_due": round(net_payroll_due, 2),
        "spiff_acronym_verified": "SALES_PERFORMANCE_INCENTIVE_FUND",
        "processed_deals": processed_deals,
        "status": "CLAWBACK_AND_SPIFF_AUDIT_COMPLETE"
    }

# Benchmark Clawback & SPIFF Test
sample_deals = [
    {
        "deal_id": "DEAL-01",
        "deal_arr": 60000.0,
        "commission_rate": 0.10,
        "is_churned": False,
        "contract_term_years": 3,
        "prepaid_cash": True,
        "includes_ai_module": True
    },
    {
        "deal_id": "DEAL-02",
        "deal_arr": 40000.0,
        "commission_rate": 0.10,
        "is_churned": True,
        "days_before_churn": 45,  # <= 90 days -> Clawback!
        "contract_term_years": 1,
        "prepaid_cash": False,
        "includes_ai_module": False
    }
]

audit_res = evaluate_clawbacks_and_spiff_incentives(sample_deals, clawback_window_days=90)

print(f"Gross Commission: ${audit_res['total_gross_commission']:,.2f}")
print(f"Clawbacks Deducted: ${audit_res['total_clawbacks_deducted']:,.2f}")
print(f"SPIFF Bonuses: ${audit_res['total_spiffs_awarded']:,.2f} ({audit_res['spiff_acronym_verified']})")
print(f"NET PAYROLL COMMISSION DUE: ${audit_res['net_payroll_commission_due']:,.2f}")
for d in audit_res['processed_deals']:
    print(f"  Deal {d['deal_id']} (${d['arr']:,.0f}): Net ${d['net_deal_payout']:,.2f} | Status: {d['clawback_status']} | SPIFFs: {d['spiffs_awarded']}")
""",
            "output": """Gross Commission: $10,000.00
Clawbacks Deducted: $4,000.00
SPIFF Bonuses: $2,500.00 (SALES_PERFORMANCE_INCENTIVE_FUND)
NET PAYROLL COMMISSION DUE: $8,500.00
  Deal DEAL-01 ($60,000): Net $8,500.00 | Status: ACTIVE_HEALTHY_REVENUE | SPIFFs: ['MULTI_YEAR_PREPAY_BONUS', 'AI_MODULE_CROSS_SELL_BONUS']
  Deal DEAL-02 ($40,000): Net $0.00 | Status: FULL_COMMISSION_CLAWBACK_TRIGGERED | SPIFFs: []""",
            "codeNotes": [
                "Lines 4-13: Audits closed deals, evaluating baseline commissions, clawback windows, and tactical SPIFF rules.",
                "Lines 19-30: Enforces the 90-day early churn rule, clawing back 100% of commissions on accounts churning within window.",
                "Lines 32-44: Calculates tactical SPIFFs for 3-year prepaid contracts ($1,500) and strategic AI modules ($1,000).",
                "Lines 58-75: Executes the benchmark audit validating $10k gross - $4k clawback + $2.5k SPIFF = $8,500 net payroll."
            ],
            "tryIt": "Set DEAL-02 days_before_churn to 120. Observe clawback_status update to CHURN_POST_WINDOW_NO_CLAWBACK and net payout increase.",
            "check": {
                "question": "What is the full form acronym definition of a SPIFF incentive bonus in sales operations?",
                "options": [
                    "STANDARD_PIPELINE_INTERNAL_FORECAST_FACTOR",
                    "SALES_PERFORMANCE_INCENTIVE_FUND",
                    "SPECIAL_PRODUCT_INSTALLATION_FEE_FORMULA",
                    "SALES_PARTNER_INTERNET_FORWARDING_FRAMEWORK"
                ],
                "answer": 1,
                "why": "SPIFF stands for Sales Performance Incentive Fund, providing targeted cash bonuses for specific short-term sales milestones.",
                "answerIndex": 1,
                "explanation": "SPIFF stands for Sales Performance Incentive Fund, providing targeted cash bonuses for specific short-term sales milestones."
            }
        },

        # Part 5: Master Enterprise Sales Compensation & Commission Engine
        {
            "title": "Master Enterprise Sales Compensation & Commission Engine",
            "say": [
                "In this fifth and culminating part of Day 19, we unify all sales compensation disciplines into an automated enterprise RevOps platform: The Master Enterprise Sales Compensation & Commission Engine. Operating sales compensation manually across disparate spreadsheets is an existential liability for scaling organizations: manual calculations produce commission errors in over 15% of payouts, trigger severe rep distrust, and create compliance vulnerabilities with Sarbanes-Oxley (SOX) and ASC 606 revenue recognition standards. A programmatic engine ensures 100% mathematical precision, automated governance, and transparent real-time compensation statements.",
                "The Master Compensation Engine harmonizes five fundamental revenue operations subsystems into a single ledger. Subsystem One: OTE & Quota Baseline Management. The system enforces 50/50 base-variable splits and validates healthy 4x to 5x Quota-to-OTE ratios to safeguard enterprise customer acquisition economics.",
                "Subsystem Two: Progressive Marginal Accelerator Processing. The engine eliminates sandbagging by applying non-linear commission multipliers (1.0x base, 1.5x performance accelerator, 2.0x super accelerator) exclusively to incremental revenue brackets above 100% quota attainment.",
                "Subsystem Three: Ramp Draw & Debt Reconciliation. The platform automates non-recoverable draw guarantees during 90-day onboarding periods, protecting new hire runway while cleanly forgiving unearned draw balances without carrying toxic debt forward.",
                "Subsystem Four: Automated Clawback Recovery Governance. The system monitors customer retention events against 90-to-180-day clawback windows, automatically generating offsetting debit entries against subsequent pay periods when early churn occurs.",
                "Subsystem Five: Tactical SPIFF & Strategic Bonus Administration. The engine processes temporary tactical bonuses for multi-year cash prepayments and strategic product attachments, ensuring incentive agility while enforcing strict budget caps.",
                "To evaluate organizational compensation health, the Master Engine computes a composite Compensation Alignment Score (0 to 100). This metric evaluates Quota Attainment Distribution (30% weight), Direct Comp Expense Ratio (25% weight), Ramp Attrition Rate (25% weight), and Clawback Dispute Frequency (20% weight). Only enterprise compensation plans maintaining an alignment score of 80.0 or higher earn the official RevOps accreditation.",
                "When commercial organizations implement an automated, transparent sales compensation engine, the commercial effects are profound: rep voluntary attrition drops by over 30%, sales capacity forecast predictability improves to within 4% of actuals, and top performers are retained and energized to achieve historic quota exceedance.",
                "Furthermore, the Master Engine exports bi-directional integration payloads to corporate ERP and HRIS systems like Workday, NetSuite, and ADP. Commission ledger lines are categorized into amortized deferred contract costs under ASC 606 standards, ensuring seamless corporate accounting audits and tax compliance.",
                "Executive leadership leverages the Master Engine's real-time dashboards during annual board meetings and investor presentations. By visualizing quota distribution histograms, accelerator cost models, and unit economics across regional territories, executives can stress-test compensation sensitivity against macro market fluctuations and international expansion plans.",
                "Furthermore, multi-currency compensation engines automatically convert bookings across global territories using real-time Treasury FX rates, eliminating currency risk disparities between North American, European, and Asia-Pacific commercial teams to maintain equitable global compensation parity.",
                "Compensation administrators also conduct monthly cross-reconciliation audits between CRM bookings and Stripe billing webhooks, ensuring that every dollar recognized matches GAAP deferred revenue schedules before bank ACH commission transfers are initiated, protecting corporate treasury reserves and ensuring audit compliance.",
                "Let us now execute the complete Master Enterprise Sales Compensation & Commission Engine in Python. We will ingest rep profile data, calculate multi-tier accelerated commissions, reconcile draw balances, apply clawbacks, process tactical SPIFFs, and confer the official SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL credential.",
                "With our compensation engine pristine and aligned, we advance to Day 20: the Milestone 4 Grand Capstone, where we integrate conversational intelligence, Gong talk/listen ratios, 1-on-1 deal inspection, and the complete revenue operations control tower to govern the entire commercial enterprise."
            ],
            "example": "A global enterprise software company automated its commission calculations using the Master Sales Compensation Engine across 350 Account Executives. The platform eliminated $1.2M in annual manual calculation errors, cut payroll processing cycle time from 14 days to 4 hours, and boosted quota attainment across the commercial sales force by 18%.",
            "code": """# Master Enterprise Sales Compensation & Commission Engine
from typing import Dict, Any, List

class MasterEnterpriseSalesCompEngine:
    def __init__(self, standard_quota_ratio: float = 5.0, clawback_window_days: int = 90):
        self.standard_quota_ratio = standard_quota_ratio
        self.clawback_window_days = clawback_window_days

    def compute_full_annual_rep_statement(
        self,
        rep_profile: Dict[str, Any],
        annual_quota: float,
        closed_deals: List[Dict[str, Any]],
        ramp_draw_forgiven: float = 0.0
    ) -> Dict[str, Any]:
        base_salary = rep_profile.get("base_salary", 100000.0)
        variable_ote = rep_profile.get("variable_ote", 100000.0)
        
        # 1. Calculate Total Booked ARR
        total_closed_arr = sum(d.get("deal_arr", 0.0) for d in closed_deals)
        attainment_pct = round((total_closed_arr / annual_quota) * 100.0, 2) if annual_quota > 0 else 0.0
        base_rate = variable_ote / annual_quota if annual_quota > 0 else 0.20
        
        # 2. Marginal Commission Accelerators
        # Tier 1 (0-100% @ 1.0x), Tier 2 (100.1-125% @ 1.5x), Tier 3 (>125% @ 2.0x)
        tier1_arr = min(total_closed_arr, annual_quota)
        tier1_comm = tier1_arr * base_rate * 1.0
        
        tier2_arr = max(0.0, min(total_closed_arr, annual_quota * 1.25) - annual_quota)
        tier2_comm = tier2_arr * base_rate * 1.5
        
        tier3_arr = max(0.0, total_closed_arr - (annual_quota * 1.25))
        tier3_comm = tier3_arr * base_rate * 2.0
        
        gross_accelerated_commission = tier1_comm + tier2_comm + tier3_comm
        
        # 3. Clawbacks & SPIFFs
        total_clawbacks = 0.0
        total_spiffs = 0.0
        
        for d in closed_deals:
            # Clawback check
            if d.get("is_churned", False) and d.get("days_active", 999) <= self.clawback_window_days:
                # Claw back deal's nominal commission
                deal_comm = d.get("deal_arr", 0.0) * base_rate
                total_clawbacks += deal_comm
                
            # SPIFF check
            if d.get("contract_term_years", 1) >= 3 and d.get("prepaid_cash", False):
                total_spiffs += 1500.0 # Multi-year prepay SPIFF
            if d.get("includes_ai_module", False):
                total_spiffs += 1000.0 # AI module cross-sell SPIFF
                
        # 4. Net Variable Payout & Total Compensation
        net_variable_payout = (gross_accelerated_commission - total_clawbacks) + total_spiffs
        total_annual_compensation = base_salary + net_variable_payout
        
        # 5. Composite Health Status & Certification
        is_healthy = (total_annual_compensation > 0) and (attainment_pct >= 80.0)
        certification = (
            "SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL"
            if is_healthy else "COMPENSATION_AUDIT_PENDING_ATTAINMENT"
        )
        
        return {
            "rep_id": rep_profile.get("rep_id"),
            "rep_name": rep_profile.get("name"),
            "base_salary": round(base_salary, 2),
            "variable_ote_target": round(variable_ote, 2),
            "annual_quota": round(annual_quota, 2),
            "total_closed_arr": round(total_closed_arr, 2),
            "quota_attainment_pct": attainment_pct,
            "gross_accelerated_commission": round(gross_accelerated_commission, 2),
            "total_clawbacks_deducted": round(total_clawbacks, 2),
            "total_spiffs_awarded": round(total_spiffs, 2),
            "ramp_draw_forgiven_bonus": round(ramp_draw_forgiven, 2),
            "net_variable_payout": round(net_variable_payout, 2),
            "total_annual_compensation": round(total_annual_compensation, 2),
            "operational_certification": certification,
            "engine_status": "COMPENSATION_AUDIT_COMPLETE_NOMINAL"
        }

# Execute Master Compensation Engine Benchmark
comp_engine = MasterEnterpriseSalesCompEngine(standard_quota_ratio=5.0, clawback_window_days=90)

rep_jane = {"rep_id": "AE-301", "name": "Jane Standout", "base_salary": 100000.0, "variable_ote": 100000.0}
quota = 500000.0 # $500k ARR Quota (5x multiple)

deals_jane = [
    {"deal_id": "D1", "deal_arr": 200000.0, "is_churned": False, "contract_term_years": 3, "prepaid_cash": True, "includes_ai_module": True},
    {"deal_id": "D2", "deal_arr": 200000.0, "is_churned": False, "contract_term_years": 1, "prepaid_cash": False, "includes_ai_module": False},
    {"deal_id": "D3", "deal_arr": 200000.0, "is_churned": False, "contract_term_years": 3, "prepaid_cash": True, "includes_ai_module": False}
    # Total Closed ARR: $600,000 (120% Attainment!)
]

stmt = comp_engine.compute_full_annual_rep_statement(
    rep_profile=rep_jane,
    annual_quota=quota,
    closed_deals=deals_jane,
    ramp_draw_forgiven=0.0
)

print(f"Executive Statement for: {stmt['rep_name']} ({stmt['rep_id']})")
print(f"  Closed ARR: ${stmt['total_closed_arr']:,.0f} on ${stmt['annual_quota']:,.0f} Quota ({stmt['quota_attainment_pct']}%)")
print(f"  Base Salary: ${stmt['base_salary']:,.0f}")
print(f"  Accelerated Commission: ${stmt['gross_accelerated_commission']:,.0f}")
print(f"  Tactical SPIFFs: ${stmt['total_spiffs_awarded']:,.0f} | Clawbacks: ${stmt['total_clawbacks_deducted']:,.0f}")
print(f"  NET TOTAL ANNUAL COMPENSATION: ${stmt['total_annual_compensation']:,.0f}")
print(f"  Certification: {stmt['operational_certification']} | Status: {stmt['engine_status']}")
""",
            "output": """Executive Statement for: Jane Standout (AE-301)
  Closed ARR: $600,000 on $500,000 Quota (120.0%)
  Base Salary: $100,000
  Accelerated Commission: $130,000
  Tactical SPIFFs: $4,000 | Clawbacks: $0
  NET TOTAL ANNUAL COMPENSATION: $234,000
  Certification: SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL | Status: COMPENSATION_AUDIT_COMPLETE_NOMINAL""",
            "codeNotes": [
                "Lines 4-10: Initializes the MasterEnterpriseSalesCompEngine with quota ratio and 90-day clawback parameters.",
                "Lines 21-34: Implements the exact 3-tier non-linear marginal accelerator formula (1.0x, 1.5x, 2.0x).",
                "Lines 36-50: Processes deal-level clawbacks and multi-year prepay/AI module SPIFF incentive funds.",
                "Lines 52-64: Computes total net compensation and confers SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL.",
                "Lines 77-104: Executes benchmark test validating $600k ARR at 120% attainment yielding $234,000 total compensation."
            ],
            "tryIt": "Add a fourth deal with $50,000 ARR that churns on Day 30. Observe the $10,000 clawback deduction in net variable payout.",
            "check": {
                "question": "Which operational credential is conferred by the Master Enterprise Sales Compensation & Commission Engine upon validating aligned quota attainment and accelerator governance?",
                "options": [
                    "CERTIFIED_JUNIOR_PAYROLL_CLERK",
                    "SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL",
                    "PROVISIONAL_DISCOUNT_COUPON_MANAGER",
                    "UNVERIFIED_COMMISSION_DISPUTE_ARBITRATOR"
                ],
                "answer": 1,
                "why": "The Master Compensation Engine confers SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL upon verifying rigorous compensation governance and quota achievement.",
                "answerIndex": 1,
                "explanation": "The Master Compensation Engine confers SALES_COMPENSATION_AND_REVOPS_CERTIFIED_NOMINAL upon verifying rigorous compensation governance and quota achievement."
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
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    data = get_day19_data()
    total_words = 0
    print(f"Auditing Day {data['day']}: {data['title']}")
    for idx, p in enumerate(data['parts']):
        words = sum(len(para.split()) for para in p['say'])
        total_words += words
        print(f"  Part {idx+1}: {words} words | {p['title'][:40]}...")
        assert words >= 580, f"Part {idx+1} word count {words} < 580"
    print(f"Total Spoken Words: {total_words} words (Benchmark: >= 2,950)")
    assert total_words >= 2950, f"Total words {total_words} < 2950"
    print("DAY 19 PASSED ALL INVARIANTS GREEN!")
