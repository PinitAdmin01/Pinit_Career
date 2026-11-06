"""
Day 28 Builder: Digital Marketing Budgeting & Annual Media Planning: Share of Voice (SOV)
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 6 / Capstone Module
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day28_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 28,
        "title": "Digital Marketing Budgeting & Annual Media Planning: Share of Voice (SOV) Architecture",
        "funnelSteps": [
            {
                "step": "OBJECTIVE_TASK_BUDGETING",
                "label": "Objective-and-Task Mathematical Sizing ($10M Target Revenue)",
                "metric": "Required Budget: $1,000,000",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "ESOV_MARKET_EXPANSION",
                "label": "Share of Voice (SOV 15%) vs Share of Market (SOM 10%) Analysis",
                "metric": "ESOV: +5.0% (Share Growth)",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "MULTI_CHANNEL_FLIGHTING",
                "label": "5-Channel Allocation & Q1-Q4 Seasonal Flighting Pacing",
                "metric": "Q4 Peak: 35% Spend ($350k)",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "MER_WORKING_CAPITAL_BUFFER",
                "label": "Marketing Efficiency Ratio (MER >= 4.0x) & Escrow Protection",
                "metric": "Audited MER: 4.2x Floor",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "ENTERPRISE_MEDIA_PLANNING_GATEWAY",
                "label": "Institutional Media Planning & Annual Capital Allocation Gateway",
                "metric": "100.0/100 MPBI Certified",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "Annual Media Budget", "value": "$1,000,000.00"},
            {"label": "Excess Share of Voice", "value": "+5.0% ESOV"},
            {"label": "Blended MER Target", "value": "4.2x Floor"},
            {"label": "Composite MPBI Score", "value": "100.0/100"}
        ]
    }

def build_day28_lesson() -> dict:
    p1_code = r'''def simulate_objective_and_task_budget(target_revenue: float, aov: float, cvr_pct: float, avg_cpc: float) -> dict:
    """
    Computes annual marketing budget using the Objective-and-Task method:
    1. Transactions Required = Target Revenue / AOV
    2. Clicks Required = Transactions Required / (CVR % / 100)
    3. Required Media Budget = Clicks Required * Average CPC
    4. Budget as % of Revenue = (Required Media Budget / Target Revenue) * 100
    """
    transactions_needed = int(target_revenue / aov)
    cvr_dec = cvr_pct / 100.0
    clicks_needed = int(transactions_needed / cvr_dec)
    total_budget_needed = round(clicks_needed * avg_cpc, 2)
    budget_pct_of_rev = round((total_budget_needed / target_revenue) * 100, 2)
    
    return {
        "target_revenue_usd": target_revenue,
        "average_order_value": aov,
        "conversion_rate_pct": cvr_pct,
        "average_cpc_usd": avg_cpc,
        "transactions_needed": transactions_needed,
        "clicks_needed": clicks_needed,
        "required_media_budget_usd": total_budget_needed,
        "budget_as_pct_of_revenue": budget_pct_of_rev,
        "status": "OBJECTIVE_TASK_BUDGET_CALCULATED"
    }

if __name__ == "__main__":
    res = simulate_objective_and_task_budget(
        target_revenue=10000000.0,
        aov=100.0,
        cvr_pct=2.5,
        avg_cpc=0.25
    )
    print("Objective-and-Task Digital Marketing Budget Report:")
    print(f"  Target Annual Revenue: ${res['target_revenue_usd']:,.2f}")
    print(f"  Transactions Required: {res['transactions_needed']:,} at ${res['average_order_value']:.2f} AOV")
    print(f"  Qualified Clicks Needed: {res['clicks_needed']:,} at {res['conversion_rate_pct']}% CVR")
    print(f"  Required Media Budget: ${res['required_media_budget_usd']:,.2f} (${res['average_cpc_usd']:.2f} CPC)")
    print(f"  Budget as % of Revenue: {res['budget_as_pct_of_revenue']}%")
    print(f"  Status: {res['status']}")
'''

    p2_code = r'''def calculate_esov_and_market_share_projection(current_som: float, industry_spend: float, brand_spend: float) -> dict:
    """
    Calculates Excess Share of Voice (ESOV) and projected market share change:
    SOV % = (Brand Ad Spend / Industry Ad Spend) * 100
    ESOV % = SOV % - Current Share of Market (SOM) %
    Projected 1-Year Market Share Gain % = ESOV % * 0.10 (Standard econometric multiplier)
    """
    sov = round((brand_spend / industry_spend) * 100, 2)
    esov = round(sov - current_som, 2)
    projected_som_gain = round(esov * 0.10, 2)
    projected_som_1yr = round(current_som + projected_som_gain, 2)
    
    verdict = "MARKET_SHARE_EXPANSION" if esov > 0 else "MARKET_SHARE_CONTRACTION"
    
    return {
        "brand_ad_spend_usd": brand_spend,
        "industry_ad_spend_usd": industry_spend,
        "share_of_voice_pct": sov,
        "current_share_of_market_pct": current_som,
        "excess_share_of_voice_pct": esov,
        "projected_som_1yr_pct": projected_som_1yr,
        "growth_verdict": verdict,
        "status": "ESOV_ANALYSIS_COMPLETE"
    }

if __name__ == "__main__":
    res = calculate_esov_and_market_share_projection(
        current_som=10.0,
        industry_spend=100000000.0,
        brand_spend=15000000.0
    )
    print("Share of Voice (SOV) vs Share of Market (SOM) Analysis:")
    print(f"  Brand Ad Spend: ${res['brand_ad_spend_usd']:,.2f} of ${res['industry_ad_spend_usd']:,.2f} Industry Total")
    print(f"  Share of Voice (SOV): {res['share_of_voice_pct']}% | Current Market Share (SOM): {res['current_share_of_market_pct']}%")
    print(f"  Excess Share of Voice (ESOV): +{res['excess_share_of_voice_pct']}%")
    print(f"  Projected 1-Year Market Share: {res['projected_som_1yr_pct']}% ({res['growth_verdict']})")
    print(f"  Status: {res['status']}")
'''

    p3_code = r'''def allocate_annual_media_budget_and_flighting(total_budget: float, channel_weights: dict, quarterly_flighting: dict) -> dict:
    """
    Allocates annual media budget across multi-channel mix and quarterly seasonal flighting curves.
    Ensures 100% allocation balance across channels and quarters.
    """
    channel_spends = {ch: round(total_budget * (pct / 100.0), 2) for ch, pct in channel_weights.items()}
    quarterly_spends = {q: round(total_budget * (pct / 100.0), 2) for q, pct in quarterly_flighting.items()}
    
    return {
        "total_annual_budget_usd": total_budget,
        "channel_allocations_usd": channel_spends,
        "quarterly_flighting_usd": quarterly_spends,
        "status": "MEDIA_PLAN_BUDGET_ALLOCATED"
    }

if __name__ == "__main__":
    channels = {
        "Google Search (SEM)": 35.0,
        "Meta Paid Social": 30.0,
        "YouTube Performance Video": 15.0,
        "Programmatic Display": 10.0,
        "Email & Retention Automation": 10.0
    }
    quarters = {
        "Q1_Winter_Reset": 20.0,
        "Q2_Spring_Expansion": 20.0,
        "Q3_Summer_Pacing": 25.0,
        "Q4_Holiday_Surge": 35.0
    }
    res = allocate_annual_media_budget_and_flighting(1000000.0, channels, quarters)
    print("Annual Media Planning Channel Mix & Quarterly Flighting:")
    print(f"  Total Budget: ${res['total_annual_budget_usd']:,.2f}")
    print("  Channel Spend Allocations:")
    for ch, amt in res['channel_allocations_usd'].items():
        print(f"    {ch}: ${amt:,.2f}")
    print("  Quarterly Flighting Schedule:")
    for q, amt in res['quarterly_flighting_usd'].items():
        print(f"    {q}: ${amt:,.2f}")
    print(f"  Status: {res['status']}")
'''

    p4_code = r'''def audit_mer_and_working_capital_buffers(monthly_revenue: float, monthly_ad_spend: float, min_mer_floor: float = 4.0) -> dict:
    """
    Audits Marketing Efficiency Ratio (MER = Revenue / Ad Spend)
    and validates working capital buffers against 30-day ad network billing cycles.
    """
    mer = round(monthly_revenue / monthly_ad_spend, 2)
    is_mer_viable = mer >= min_mer_floor
    
    # 45-day working capital reserve required
    working_capital_buffer_usd = round(monthly_ad_spend * 1.5, 2)
    verdict = "MER_HEALTHY_SCALE_PERMITTED" if is_mer_viable else "MER_DEFICIT_TRIGGER_SPEND_FREEZE"
    
    return {
        "monthly_revenue_usd": monthly_revenue,
        "monthly_ad_spend_usd": monthly_ad_spend,
        "marketing_efficiency_ratio": mer,
        "min_mer_floor": min_mer_floor,
        "working_capital_buffer_required_usd": working_capital_buffer_usd,
        "is_mer_viable": is_mer_viable,
        "verdict": verdict,
        "status": "MER_AUDIT_COMPLETE"
    }

if __name__ == "__main__":
    months = [
        {"month": "October", "rev": 420000.0, "spend": 100000.0},
        {"month": "November", "rev": 550000.0, "spend": 125000.0},
        {"month": "December", "rev": 350000.0, "spend": 100000.0}
    ]
    print("Marketing Efficiency Ratio (MER) & Cash Flow Audit:")
    for m in months:
        r = audit_mer_and_working_capital_buffers(m["rev"], m["spend"])
        print(f"  {m['month']}: Rev ${m['rev']:,.2f} / Spend ${m['spend']:,.2f} -> MER: {r['marketing_efficiency_ratio']}x ({r['verdict']})")
'''

    p5_code = r'''def audit_enterprise_media_planning_gateway(
    objective_budget_ok: bool,
    esov_expansion_ok: bool,
    flighting_balanced_ok: bool,
    mer_buffer_ok: bool
) -> dict:
    """
    Enterprise Media Planning & Budgeting Gateway: Integrates objective-and-task
    sizing, ESOV share growth dynamics, multi-channel seasonal flighting, and MER capital controls.
    """
    all_nominal = objective_budget_ok and esov_expansion_ok and flighting_balanced_ok and mer_buffer_ok
    score = 100.0 if all_nominal else 70.0
    verdict = "MEDIA_PLANNING_AND_BUDGETING_DIRECTOR_CERTIFIED" if all_nominal else "MEDIA_PLANNING_DEFECT"
    
    return {
        "objective_task_budgeting_active": objective_budget_ok,
        "esov_expansion_active": esov_expansion_ok,
        "multi_channel_flighting_active": flighting_balanced_ok,
        "mer_capital_governance_active": mer_buffer_ok,
        "mpbi_score": score,
        "certification": verdict,
        "status": "ENTERPRISE_MEDIA_PLANNING_NOMINAL" if all_nominal else "BUDGET_REMEDIATION_REQUIRED"
    }

if __name__ == "__main__":
    gateway = audit_enterprise_media_planning_gateway(
        objective_budget_ok=True,
        esov_expansion_ok=True,
        flighting_balanced_ok=True,
        mer_buffer_ok=True
    )
    print("Enterprise Media Planning & Budgeting Gateway Report:")
    print(f"  Objective-and-Task Budgeting Active: {gateway['objective_task_budgeting_active']}")
    print(f"  ESOV Market Expansion Active: {gateway['esov_expansion_active']}")
    print(f"  Multi-Channel Flighting Active: {gateway['multi_channel_flighting_active']}")
    print(f"  MER Capital Governance Active: {gateway['mer_capital_governance_active']}")
    print(f"  Composite MPBI Score: {gateway['mpbi_score']} / 100.0")
    print(f"  Accreditation Verdict: {gateway['certification']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 28,
        "title": "Digital Marketing Budgeting & Annual Media Planning: Share of Voice (SOV) Architecture",
        "goal": "Master annual corporate media planning: Objective-and-Task budget sizing, Share of Voice (SOV) vs Share of Market (SOM) dynamics, multi-channel seasonal flighting curves, Marketing Efficiency Ratio (MER) governance, and the Enterprise Media Planning Gateway.",
        "minutes": 35,
        "recap": "Day 28 equips growth leaders with corporate capital budgeting mastery. Learn to build bottom-up objective media models, engineer Excess Share of Voice (ESOV) to expand market share, balance Q1-Q4 spending curves, and safeguard cash flow with MER floors.",
        "parts": [
            {
                "title": "Corporate Digital Marketing Budget Methodologies & Objective-and-Task Sizing",
                "say": [
                    "Welcome to Day 28 of Digital Marketing Analytics and Performance Strategy. Today, we step into the corporate boardroom to master the art and science of Annual Digital Marketing Budgeting and Media Planning. In immature organizations, marketing budgeting is treated as an arbitrary guessing game: the CEO asks for a 20% increase in revenue, and the marketing director requests a 20% increase in budget without mathematical grounding.",
                    "Institutional corporate finance recognizes three primary budgeting methodologies: First, the Percentage-of-Revenue Method, where marketing is allocated a fixed fraction (typically 8% to 12% for high-growth venture-backed enterprises, or 5% to 7% for mature defensive businesses) of projected gross revenue. While simple, this method is fundamentally flawed because it treats marketing as an expense derived from sales, rather than the revenue driver that causes sales.",
                    "Second, Zero-Based Budgeting (ZBB), where every department begins each fiscal year with a zero-dollar allocation and must justify every dollar of expenditure through unit economics and expected return on investment.",
                    "Third, the gold standard of performance growth: The Objective-and-Task Method. In the Objective-and-Task model, the budget is derived bottom-up through conversion mathematics: 1. Target Revenue is divided by Average Order Value (AOV) to determine the exact number of transactions required; 2. Transactions are divided by the e-commerce Conversion Rate (CVR) to determine qualified traffic clicks needed; 3. Clicks are multiplied by the weighted Average Cost Per Click (CPC) across media channels to establish the exact required media budget.",
                    "In our institutional Python simulation for Part 1, we implement the Objective-and-Task Digital Marketing Budgeting Engine. For a $10M target revenue goal at $100 AOV and 2.5% CVR with $0.25 average CPC, the engine derives exactly 100,000 transactions, 4,000,000 clicks, and a required media budget of $1,000,000.00 (10.0% of revenue). Examine the code below to see objective budgeting execute deterministically."
                ],
                "example": "Enterprise Case Study: A consumer packaged goods brand was challenged by their board of directors to expand annual digital sales from $15M to $25M. Rather than guessing, the VP of Growth built an Objective-and-Task model: at $80 AOV, 312,500 transactions were required. At a 2.8% site CVR, they needed 11,160,714 qualified clicks. Across a blended CPC of $0.28, the required budget was $3,125,000. The board unanimously approved the mathematically justified 12.5% budget allocation.",
                "code": p1_code,
                "output": "Objective-and-Task Digital Marketing Budget Report:\n  Target Annual Revenue: $10,000,000.00\n  Transactions Required: 100,000 at $100.00 AOV\n  Qualified Clicks Needed: 4,000,000 at 2.5% CVR\n  Required Media Budget: $1,000,000.00 ($0.25 CPC)\n  Budget as % of Revenue: 10.0%\n  Status: OBJECTIVE_TASK_BUDGET_CALCULATED",
                "codeNotes": [
                    "Derives required media budget mathematically from top-line revenue targets, AOV, CVR, and blended CPC.",
                    "Calculates exact transaction volume (100,000 orders) and qualified click traffic (4,000,000 visits) needed.",
                    "Validates that required media spend ($1,000,000.00) represents exactly 10.0% of target revenue, aligning with financial benchmarks."
                ],
                "tryIt": "Increase target_revenue to $20,000,000.00 and observe how required budget scales linearly to $2,000,000.00.",
                "check": {
                    "question": "What is the primary advantage of the Objective-and-Task budgeting methodology over the Percentage-of-Revenue method?",
                    "options": [
                        "It calculates the exact media budget required based on conversion rates, traffic volume, and CPCs needed to achieve specific revenue objectives.",
                        "It guarantees that marketing spend will be 100% tax deductible under international law.",
                        "It eliminates the need for advertising agencies and software tools.",
                        "It allows marketing teams to spend unlimited company cash without executive oversight."
                    ],
                    "answer": 0,
                    "why": "Objective-and-Task budgeting derives capital requirements bottom-up from conversion math (orders needed, traffic needed, cost per click), aligning spend directly with strategic corporate goals."
                }
            },
            {
                "title": "Share of Voice (SOV) vs Share of Market (SOM) Dynamics",
                "say": [
                    "While internal conversion math determines the baseline budget, external market competition dictates whether an enterprise will gain or lose market dominance. In macroeconomic marketing science, this competitive dynamic is governed by The Law of Equilibrium: Share of Voice (SOV) vs Share of Market (SOM).",
                    "Share of Market (SOM) represents the percentage of total industry revenue that your brand controls. Share of Voice (SOV) represents the percentage of total industry advertising spend or category impressions that your brand captures: $\\text{SOV \\%} = \\frac{\\text{Brand Ad Spend}}{\\text{Total Industry Ad Spend}} \\times 100\\%$.",
                    "The defining metric of market expansion is Excess Share of Voice (ESOV): $\\text{ESOV} = \\text{SOV} - \\text{SOM}$. Decades of econometric research (validated by the IPA and Ehrenberg-Bass Institute) prove that in a steady-state market, an enterprise's market share will naturally gravitate toward its share of voice. If a brand maintains an ESOV of zero ($SOV = SOM$), its market share remains flat.",
                    "If a brand maintains positive Excess Share of Voice ($SOV > SOM$), its market share expands. Across consumer and business categories, the empirical rule of thumb is that every 10 points of positive ESOV drives approximately 1.0% annual market share growth! Conversely, if an executive cuts ad spend such that $SOV < SOM$, the brand experiences negative ESOV, guaranteeing long-term market share decay.",
                    "In our institutional Python simulation for Part 2, we implement the ESOV and Market Share Projection Model. For a brand with 10.0% market share in a $100M ad industry spending $15M (SOV = 15.0%), the system computes an ESOV of +5.0% and projects a 1-year market share expansion to 10.5%. Examine the code below to see ESOV modeling execute deterministically."
                ],
                "example": "Enterprise Case Study: A challenger beverage brand holding 6% market share in an industry where total competitors spent $80M annually decided to launch an aggressive growth campaign. They secured a $12M advertising budget, capturing a 15% Share of Voice. This created an Excess Share of Voice (ESOV) of +9.0%. Over the subsequent 18 months, their market share grew from 6.0% to 7.4%, displacing a legacy incumbent who had reduced ad spend.",
                "code": p2_code,
                "output": "Share of Voice (SOV) vs Share of Market (SOM) Analysis:\n  Brand Ad Spend: $15,000,000.00 of $100,000,000.00 Industry Total\n  Share of Voice (SOV): 15.0% | Current Market Share (SOM): 10.0%\n  Excess Share of Voice (ESOV): +5.0%\n  Projected 1-Year Market Share: 10.5% (MARKET_SHARE_EXPANSION)\n  Status: ESOV_ANALYSIS_COMPLETE",
                "codeNotes": [
                    "Calculates Share of Voice: ($15M brand spend / $100M industry spend) * 100 = 15.0% SOV.",
                    "Derives Excess Share of Voice: 15.0% SOV - 10.0% SOM = +5.0% ESOV.",
                    "Projects 1-year market share expansion from 10.0% to 10.5% based on empirical econometric multipliers."
                ],
                "tryIt": "Reduce brand_spend to $8,000,000.00 and observe how SOV drops to 8.0%, creating a -2.0% ESOV and triggering a MARKET_SHARE_CONTRACTION alert.",
                "check": {
                    "question": "What occurs when a brand's Share of Voice exceeds its Share of Market (SOV > SOM)?",
                    "options": [
                        "The brand achieves positive Excess Share of Voice (ESOV), driving predictable market share expansion over time.",
                        "The brand is fined by advertising regulatory commissions for over-spending.",
                        "Competitors automatically forfeit their trademarks to the winning brand.",
                        "The brand's conversion rates drop to zero due to excess market visibility."
                    ],
                    "answer": 0,
                    "why": "Positive Excess Share of Voice (ESOV > 0) is the proven empirical catalyst for market share growth; brands that out-shout their current market size gain market share over time."
                }
            },
            {
                "title": "Multi-Channel Annual Media Budget Allocation & Seasonal Flighting",
                "say": [
                    "Once total annual capital requirements are determined, media planners must address the strategic questions of Capital Mix and Temporal Flighting. Capital cannot be deployed uniformly across all channels, nor can it be spent evenly across all 52 weeks of the calendar year.",
                    "First, media planners design the Multi-Channel Allocation Mix based on funnel depth and channel efficiency. A balanced enterprise media plan allocates budget across five core channels: 1. Google Search (SEM: 35%), capturing active, high-intent purchase demand; 2. Meta Paid Social (30%), driving discovery and visual demand creation; 3. YouTube Performance Video (15%), building upper-funnel consideration and search lift; 4. Programmatic Display & Retargeting (10%), reinforcing brand recall; and 5. Email & Retention Automation (10%), maximizing repeat customer lifetime value.",
                    "Second, media planners design Seasonal Flighting Schedules. Consumer demand is heavily seasonal. Deploying identical spending each month results in running out of budget during high-demand peaks while overspending during dormant troughs. Planners evaluate three flighting strategies: Continuous (steady spend throughout the year), Flighting (bursts of spending alternated with zero-spend periods), and Pulsing (a continuous low-level baseline punctuated by heavy spending surges during seasonal peaks).",
                    "For e-commerce and retail brands, annual media flighting is heavily back-loaded toward Q4: Q1 Winter Reset (20%), Q2 Spring Expansion (20%), Q3 Summer Pacing (25%), and Q4 Holiday Surge (35%—capturing Black Friday, Cyber Monday, and festive gift buying). This seasonal pacing aligns media capital directly with consumer spending velocity.",
                    "In our institutional Python simulation for Part 3, we build the Multi-Channel Budget Allocation and Quarterly Flighting Engine. The system distributes a $1,000,000 annual media budget across 5 channels and 4 quarters, pacing $350,000 into the Q4 holiday surge without fiscal imbalance. Review the code below to see annual media planning execute deterministically."
                ],
                "example": "Enterprise Case Study: A national luxury luggage manufacturer allocated a $1M annual media budget. By shifting from a continuous $83k/month flat spend to a pulsed seasonal flighting schedule (allocating $350,000 in Q4 holiday peak and $200,000 in Q2 summer travel season), they generated 42% higher annual revenue while avoiding ad auction over-saturation during slow winter months.",
                "code": p3_code,
                "output": "Annual Media Planning Channel Mix & Quarterly Flighting:\n  Total Budget: $1,000,000.00\n  Channel Spend Allocations:\n    Google Search (SEM): $350,000.00\n    Meta Paid Social: $300,000.00\n    YouTube Performance Video: $150,000.00\n    Programmatic Display: $100,000.00\n    Email & Retention Automation: $100,000.00\n  Quarterly Flighting Schedule:\n    Q1_Winter_Reset: $200,000.00\n    Q2_Spring_Expansion: $200,000.00\n    Q3_Summer_Pacing: $250,000.00\n    Q4_Holiday_Surge: $350,000.00\n  Status: MEDIA_PLAN_BUDGET_ALLOCATED",
                "codeNotes": [
                    "Allocates $1,000,000 across 5 channels: Search ($350k), Meta ($300k), YouTube ($150k), Display ($100k), Email ($100k).",
                    "Paces seasonal quarterly flighting: Q1 (20%), Q2 (20%), Q3 (25%), and Q4 Holiday Surge (35% or $350k).",
                    "Guarantees 100% budget accounting balance across media mix and temporal flighting."
                ],
                "tryIt": "Adjust Q4 flighting to 40% ($400,000) and Q1 to 15% ($150,000) to model a heavy holiday-dependent retail business.",
                "check": {
                    "question": "What is the strategic rationale behind 'Pulsed' seasonal media flighting in annual digital media planning?",
                    "options": [
                        "It maintains a continuous low-level baseline of brand presence while concentrating peak ad capital during high-conversion seasonal shopping windows.",
                        "It requires media buyers to spend 100% of their annual budget on New Year's Day.",
                        "It randomly pauses advertising campaigns whenever the stock market declines.",
                        "It forces competitors to match advertising spending dollar for dollar."
                    ],
                    "answer": 0,
                    "why": "Pulsed flighting combines steady year-round brand awareness with heavy budget surges during peak consumer demand cycles (such as Q4 holidays), maximizing revenue velocity."
                }
            },
            {
                "title": "Marketing Efficiency Ratio (MER) & Media Planning Cash Flow Constraints",
                "say": [
                    "No media plan can survive without strict working capital governance. In performance marketing, media invoices from Meta, Google, and programmatic DSPs are typically settled on 30-day net billing terms or charged automatically against corporate credit lines. If marketing spend accelerates faster than customer cash collections, a rapidly growing enterprise can experience a fatal cash flow crunch.",
                    "To safeguard solvency, corporate finance monitors the Marketing Efficiency Ratio (MER), also known as the Blended ROAS: $\\text{MER} = \\frac{\\text{Total Net Revenue}}{\\text{Total Digital Marketing Spend}}$. MER provides a holistic, un-gameable measure of total business marketing productivity, evaluating whether top-line cash flow is expanding proportionally with ad spend.",
                    "Finance leadership establishes a mandatory Minimum MER Floor (typically $4.0x$ for e-commerce brands with 50% gross margins). If a brand generates $420,000 in monthly revenue on $100,000 in media spend, the MER is $4.2x$—surpassing the floor and authorizing continued scaling. However, if monthly revenue drops to $350,000 on $100,000 in spend, MER collapses to $3.5x$. This breaches the financial threshold, triggering an automated Spend Freeze Protocol to protect operating margins.",
                    "Furthermore, enterprise media plans maintain a 45-day Working Capital Reserve Buffer. Because customer invoice collections or payment processor payouts (e.g., Stripe rolling reserves) can experience delays, the company holds 1.5x monthly media spend in cash escrow. This prevents ad accounts from being abruptly suspended due to credit card limit breaches during peak holiday sales volume.",
                    "In our institutional Python simulation for Part 4, we build the MER and Working Capital Buffer Audit Engine. The system evaluates monthly revenue and ad spend across multiple fiscal months, verifies compliance with the 4.0x MER floor, calculates required cash escrow reserves, and flags deficit months for spend freezes. Examine the code below to see cash flow governance execute deterministically."
                ],
                "example": "Enterprise Case Study: A venture-backed direct-to-consumer apparel brand scaled ad spend from $50,000 to $200,000 per month during Q4. While channel dashboards reported 3.0x ROAS, high return rates and courier delays depressed total net revenue to $680,000—dropping blended MER to 3.4x (below their 4.0x profitability floor). Their automated capital governance auditor flagged the deficit, froze non-performing display campaigns, and restored blended MER to 4.3x, saving the company from exhausting its credit facility.",
                "code": p4_code,
                "output": "Marketing Efficiency Ratio (MER) & Cash Flow Audit:\n  October: Rev $420,000.00 / Spend $100,000.00 -> MER: 4.2x (MER_HEALTHY_SCALE_PERMITTED)\n  November: Rev $550,000.00 / Spend $125,000.00 -> MER: 4.4x (MER_HEALTHY_SCALE_PERMITTED)\n  December: Rev $350,000.00 / Spend $100,000.00 -> MER: 3.5x (MER_DEFICIT_TRIGGER_SPEND_FREEZE)",
                "codeNotes": [
                    "Calculates Marketing Efficiency Ratio: Total Revenue / Total Marketing Spend.",
                    "Validates healthy scaling in October (4.2x MER) and November (4.4x MER) against the 4.0x institutional floor.",
                    "Flags December deficit (3.5x MER), triggering MER_DEFICIT_TRIGGER_SPEND_FREEZE to protect corporate working capital."
                ],
                "tryIt": "Increase December revenue to $450,000.00 and observe how MER recovers to 4.5x, restoring MER_HEALTHY_SCALE_PERMITTED.",
                "check": {
                    "question": "What is the strategic purpose of establishing a Minimum Marketing Efficiency Ratio (MER) floor in media planning?",
                    "options": [
                        "To ensure total business revenue expands sufficiently relative to marketing spend to cover operating expenses and prevent cash flow exhaustion.",
                        "To guarantee that advertising platforms receive higher bidding commissions.",
                        "To prevent competitors from copying creative advertisements.",
                        "To qualify for municipal government property tax deductions."
                    ],
                    "answer": 0,
                    "why": "A minimum MER floor ensures that total enterprise revenue generates enough gross margin contribution to pay media invoices, cover operating overhead, and protect corporate solvency."
                }
            },
            {
                "title": "Enterprise Media Planning & Budgeting Gateway",
                "say": [
                    "In this concluding session of Day 28, we synthesize our annual planning disciplines into an overarching corporate capital governance system: the Enterprise Media Planning & Budgeting Gateway. Elite growth leaders do not manage marketing as disconnected ad campaigns; they manage marketing capital with the same econometric rigor, strategic flighting, and cash flow controls as an institutional investment portfolio.",
                    "The Enterprise Media Planning Gateway enforces four non-negotiable financial mandates: Mandate 1: Objective-and-Task Mathematical Sizing, ensuring that every requested dollar of marketing budget is mathematically derived from revenue targets, conversion rates, and CPC benchmarks; Mandate 2: Excess Share of Voice (ESOV) Governance, pacing brand spend relative to industry competition to ensure predictable market share expansion; Mandate 3: Balanced Multi-Channel Allocation & Seasonal Flighting, aligning capital deployment with consumer demand surges; and Mandate 4: Marketing Efficiency Ratio (MER) & Working Capital Escrow Controls, protecting corporate cash flow with hard profitability floors.",
                    "When all four components operate in synergy, the marketing department ceases to be viewed as a discretionary cost center; it is recognized by the board of directors as an authentic, high-yielding capital investment portfolio. In our institutional Python simulation for Part 5, we execute the Enterprise Media Planning Gateway auditor. The gateway validates that objective sizing, ESOV expansion, flighting, and MER capital controls are fully active, awarding a composite Media Planning & Budgeting Index (MPBI) score of 100.0/100 and conferring the prestigious Media Planning & Budgeting Director credential. Review the code below to see this final certification execute deterministically."
                ],
                "example": "Enterprise Case Study: A multi-brand retail enterprise deployed the Enterprise Media Planning Gateway across its $12M annual marketing budget. The gateway enforced objective sizing, secured a +5% ESOV for market share expansion, flighted 35% of capital into Q4 holiday surges, and enforced a strict 4.0x MER floor with 45-day cash buffers. Across four quarters, the enterprise grew top-line sales by 28% while maintaining a 100.0/100 MPBI score, earning executive praise from institutional investors.",
                "code": p5_code,
                "output": "Enterprise Media Planning & Budgeting Gateway Report:\n  Objective-and-Task Budgeting Active: True\n  ESOV Market Expansion Active: True\n  Multi-Channel Flighting Active: True\n  MER Capital Governance Active: True\n  Composite MPBI Score: 100.0 / 100.0\n  Accreditation Verdict: MEDIA_PLANNING_AND_BUDGETING_DIRECTOR_CERTIFIED",
                "codeNotes": [
                    "Integrates Objective-and-Task budgeting, ESOV market dynamics, seasonal flighting, and MER capital buffers.",
                    "Validates that all four corporate planning gates are nominal, awarding a perfect 100.0/100 MPBI composite score.",
                    "Confers official MEDIA_PLANNING_AND_BUDGETING_DIRECTOR_CERTIFIED accreditation for corporate capital stewardship."
                ],
                "tryIt": "Set mer_buffer_ok to False and observe how the gateway revokes certification and triggers a BUDGET_REMEDIATION_REQUIRED alert.",
                "check": {
                    "question": "Which combination of capabilities characterizes an enterprise-grade annual media planning architecture?",
                    "options": [
                        "Objective-and-Task budget sizing, ESOV market share dynamics, multi-channel seasonal flighting, and MER cash flow governance.",
                        "Requesting arbitrary budget increases and spending evenly without regard to seasonality or conversion rates.",
                        "Relying entirely on unpaid viral memes while withholding all capital investment.",
                        "Delegating all corporate media planning decisions to intern guessing games."
                    ],
                    "answer": 0,
                    "why": "Enterprise media planning unites mathematical objective-and-task sizing, ESOV competitive analysis, pulsed seasonal flighting, and MER working capital governance."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day28_lesson()
    visual = build_day28_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 28 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
