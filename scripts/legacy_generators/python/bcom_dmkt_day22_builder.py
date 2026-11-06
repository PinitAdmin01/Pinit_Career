"""
Day 22 Builder: Customer Lifetime Value to CAC Ratio (CLV:CAC >= 3:1) & Unit Economics
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 5
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day22_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 22,
        "title": "Customer Lifetime Value to CAC Ratio (CLV:CAC >= 3:1) Architecture",
        "funnelSteps": [
            {
                "step": "CAC_DECOMPOSITION",
                "label": "Blended CAC vs Paid Channel Acquisition Cost Analysis",
                "metric": "Paid CAC: $50.00 / Blended: $33.33",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "CLV_MATHEMATICAL_MODELING",
                "label": "Predictive Customer Lifetime Value (Gross Margin & Churn)",
                "metric": "CLV: $1,800.00",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "GOLDEN_RATIO_EVALUATION",
                "label": "Golden Growth Ratio (CLV:CAC >= 3.0) Sustainability Check",
                "metric": "Ratio: 4.0x (Elite)",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "CAC_PAYBACK_VELOCITY",
                "label": "Capital Recovery Horizon & Cash Flow Reinvestment Pacing",
                "metric": "Payback: 5.0 Months",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "ENTERPRISE_UNIT_ECONOMICS_GATEWAY",
                "label": "Institutional Growth Unit Economics Certification Gateway",
                "metric": "100.0/100 UEI Certified",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "Paid Customer CAC", "value": "$50.00"},
            {"label": "Customer Lifetime Value", "value": "$1,800.00"},
            {"label": "CLV:CAC Golden Ratio", "value": "4.0x"},
            {"label": "CAC Payback Horizon", "value": "5.0 Months"}
        ]
    }

def build_day22_lesson() -> dict:
    p1_code = r'''def decompose_customer_acquisition_cost(marketing_spend: float, paid_acquisitions: int, organic_acquisitions: int) -> dict:
    """
    Decomposes marketing expenditure into Blended CAC and True Paid CAC,
    preventing organic demand from disguising paid acquisition inefficiencies.
    """
    total_acquisitions = paid_acquisitions + organic_acquisitions
    blended_cac = round(marketing_spend / total_acquisitions, 2)
    paid_cac = round(marketing_spend / paid_acquisitions, 2)
    organic_share_pct = round((organic_acquisitions / total_acquisitions) * 100, 1)
    
    return {
        "total_marketing_spend": marketing_spend,
        "paid_acquisitions": paid_acquisitions,
        "organic_acquisitions": organic_acquisitions,
        "total_acquisitions": total_acquisitions,
        "blended_cac": blended_cac,
        "paid_cac": paid_cac,
        "organic_share_pct": organic_share_pct,
        "status": "CAC_DECOMPOSITION_COMPLETE"
    }

if __name__ == "__main__":
    res = decompose_customer_acquisition_cost(marketing_spend=50000.0, paid_acquisitions=1000, organic_acquisitions=500)
    print("Customer Acquisition Cost (CAC) Decomposition Report:")
    print(f"  Total Marketing Spend: ${res['total_marketing_spend']:,.2f}")
    print(f"  Acquisitions: {res['paid_acquisitions']} Paid, {res['organic_acquisitions']} Organic ({res['total_acquisitions']} Total)")
    print(f"  Organic Contribution: {res['organic_share_pct']}%")
    print(f"  Blended CAC: ${res['blended_cac']:.2f}")
    print(f"  True Paid Channel CAC: ${res['paid_cac']:.2f}")
    print(f"  Status: {res['status']}")
'''

    p2_code = r'''def calculate_customer_lifetime_value(monthly_arpu: float, gross_margin_pct: float, monthly_churn_pct: float) -> dict:
    """
    Calculates Customer Lifetime Value (CLV):
    CLV = (Monthly ARPU * Gross Margin %) / Monthly Churn %
    Also derives expected customer lifespan in months (1 / Churn %).
    """
    margin_dec = gross_margin_pct / 100.0
    churn_dec = monthly_churn_pct / 100.0
    
    expected_lifespan_months = round(1.0 / churn_dec, 1)
    monthly_gross_profit_per_user = monthly_arpu * margin_dec
    clv = round(monthly_gross_profit_per_user / churn_dec, 2)
    
    return {
        "monthly_arpu": monthly_arpu,
        "gross_margin_pct": gross_margin_pct,
        "monthly_churn_pct": monthly_churn_pct,
        "expected_lifespan_months": expected_lifespan_months,
        "monthly_gross_profit_per_user": round(monthly_gross_profit_per_user, 2),
        "customer_lifetime_value": clv,
        "status": "CLV_MODELING_COMPLETE"
    }

if __name__ == "__main__":
    res = calculate_customer_lifetime_value(monthly_arpu=120.0, gross_margin_pct=75.0, monthly_churn_pct=5.0)
    print("Customer Lifetime Value (CLV) Mathematical Model:")
    print(f"  Monthly ARPU: ${res['monthly_arpu']:.2f}")
    print(f"  Gross Margin: {res['gross_margin_pct']}%")
    print(f"  Monthly Churn Rate: {res['monthly_churn_pct']}%")
    print(f"  Expected Lifespan: {res['expected_lifespan_months']} Months")
    print(f"  Monthly Gross Profit Contribution: ${res['monthly_gross_profit_per_user']:.2f}")
    print(f"  Calculated Customer Lifetime Value (CLV): ${res['customer_lifetime_value']:,.2f}")
    print(f"  Status: {res['status']}")
'''

    p3_code = r'''def evaluate_clv_cac_ratio(clv: float, cac: float) -> dict:
    """
    Evaluates the Golden Growth Ratio: CLV / CAC.
    Industry Benchmarks:
      < 1.0: Severe Value Destruction (Insolvency Risk)
      1.0 - 2.9: Sub-Optimal Unit Economics (High Vulnerability)
      3.0 - 5.0: The Golden Ratio (Highly Profitable & Scalable)
      > 5.0: Under-Investment in Paid Growth (Market Share Opportunity)
    """
    ratio = round(clv / cac, 2)
    if ratio < 1.0:
        verdict = "VALUE_DESTRUCTION_INSOLVENCY_RISK"
        is_healthy = False
    elif ratio < 3.0:
        verdict = "SUB_OPTIMAL_UNIT_ECONOMICS"
        is_healthy = False
    elif ratio <= 5.0:
        verdict = "GOLDEN_RATIO_HIGHLY_PROFITABLE_AND_SCALABLE"
        is_healthy = True
    else:
        verdict = "UNDER_INVESTING_IN_GROWTH_SCALE_ACQUISITION"
        is_healthy = True
        
    return {
        "clv": clv,
        "cac": cac,
        "ratio": ratio,
        "is_healthy": is_healthy,
        "verdict": verdict
    }

if __name__ == "__main__":
    cases = [
        {"clv": 600.0, "cac": 800.0},
        {"clv": 1200.0, "cac": 600.0},
        {"clv": 1800.0, "cac": 450.0},
        {"clv": 3600.0, "cac": 500.0}
    ]
    print("CLV:CAC Golden Ratio Benchmark Evaluation:")
    for c in cases:
        r = evaluate_clv_cac_ratio(c["clv"], c["cac"])
        print(f"  CLV ${c['clv']} vs CAC ${c['cac']} -> Ratio: {r['ratio']}x | Verdict: {r['verdict']}")
'''

    p4_code = r'''def calculate_cac_payback_months(cac: float, monthly_arpu: float, gross_margin_pct: float) -> dict:
    """
    Calculates CAC Payback Horizon in months:
    Payback = CAC / (Monthly ARPU * Gross Margin %)
    Elite Benchmark: <= 12 months (Top-decile venture-scale <= 8 months).
    """
    monthly_margin_dollars = monthly_arpu * (gross_margin_pct / 100.0)
    payback_months = round(cac / monthly_margin_dollars, 1)
    is_elite = payback_months <= 12.0
    tier = "ELITE_CAPITAL_VELOCITY_SUB_12M" if is_elite else "PROLONGED_CASH_CONVERSION_CYCLE"
    
    return {
        "cac": cac,
        "monthly_margin_dollars": round(monthly_margin_dollars, 2),
        "payback_months": payback_months,
        "is_elite_payback": is_elite,
        "capital_efficiency_tier": tier
    }

if __name__ == "__main__":
    cohorts = [
        {"name": "Enterprise Plan", "cac": 450.0, "arpu": 120.0, "gm": 75.0},
        {"name": "SMB Tier", "cac": 300.0, "arpu": 40.0, "gm": 70.0},
        {"name": "Consumer Pro", "cac": 120.0, "arpu": 25.0, "gm": 80.0}
    ]
    print("CAC Payback Horizon & Capital Velocity Report:")
    for c in cohorts:
        res = calculate_cac_payback_months(c["cac"], c["arpu"], c["gm"])
        print(f"  {c['name']}: CAC ${c['cac']} -> Payback: {res['payback_months']} Months ({res['capital_efficiency_tier']})")
'''

    p5_code = r'''def audit_enterprise_unit_economics_gateway(
    cac_decomposed_ok: bool,
    clv_modeled_ok: bool,
    golden_ratio_achieved: bool,
    payback_sub_12m: bool
) -> dict:
    """
    Enterprise Unit Economics Gateway: Integrates CAC decomposition,
    predictive CLV modeling, CLV:CAC Golden Ratio enforcement, and capital velocity payback.
    """
    all_nominal = cac_decomposed_ok and clv_modeled_ok and golden_ratio_achieved and payback_sub_12m
    score = 100.0 if all_nominal else 65.0
    verdict = "UNIT_ECONOMICS_AND_LTV_DIRECTOR_CERTIFIED" if all_nominal else "UNIT_ECONOMICS_DEFICIT"
    
    return {
        "cac_decomposition_verified": cac_decomposed_ok,
        "clv_modeling_verified": clv_modeled_ok,
        "golden_ratio_verified": golden_ratio_achieved,
        "payback_velocity_verified": payback_sub_12m,
        "unit_economics_index": score,
        "certification": verdict,
        "status": "ENTERPRISE_FINANCE_NOMINAL" if all_nominal else "FINANCIAL_AUDIT_REQUIRED"
    }

if __name__ == "__main__":
    gateway = audit_enterprise_unit_economics_gateway(
        cac_decomposed_ok=True,
        clv_modeled_ok=True,
        golden_ratio_achieved=True,
        payback_sub_12m=True
    )
    print("Enterprise Unit Economics & LTV:CAC Gateway Report:")
    print(f"  CAC Decomposition Verified: {gateway['cac_decomposition_verified']}")
    print(f"  CLV Modeling Verified: {gateway['clv_modeling_verified']}")
    print(f"  Golden Ratio Verified: {gateway['golden_ratio_verified']}")
    print(f"  Payback Velocity Verified: {gateway['payback_velocity_verified']}")
    print(f"  Composite UEI Score: {gateway['unit_economics_index']} / 100.0")
    print(f"  Accreditation Verdict: {gateway['certification']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 22,
        "title": "Customer Lifetime Value to CAC Ratio (CLV:CAC >= 3:1) Architecture",
        "goal": "Master modern growth finance: Customer Acquisition Cost (CAC) decomposition, predictive Customer Lifetime Value (CLV) modeling, the Golden Ratio (CLV:CAC >= 3.0), CAC payback horizons, and the Enterprise Unit Economics Gateway.",
        "minutes": 35,
        "recap": "Day 22 anchors performance marketing in boardroom financial rigor. Learn to separate blended CAC from paid channel acquisition costs, model cohort lifetime values from gross margin and churn, enforce the 3:1 Golden Ratio, and accelerate CAC payback cycles.",
        "parts": [
            {
                "title": "Customer Acquisition Cost (CAC) Decomposition: Blended vs Paid CAC",
                "say": [
                    "Welcome to Day 22 of Digital Marketing Analytics and Performance Strategy. Today, we confront the foundational unit economics of sustainable enterprise growth: Customer Acquisition Cost (CAC) and Customer Lifetime Value (CLV). In amateur marketing operations, teams frequently report a single, naive metric known as 'Blended CAC'—calculated simply by dividing total sales and marketing spend by total new customers acquired across all channels.",
                    "While Blended CAC appears attractive on an executive dashboard, it is extraordinarily dangerous because it conceals severe paid media inefficiencies. When an established brand generates substantial organic search, word-of-mouth, direct navigational, and referral traffic, that high-volume organic stream inflates total customer acquisition numbers. If the company spends $50,000 on paid social and acquires 1,000 paid customers plus 500 organic customers, the Blended CAC is $33.33. However, the True Paid CAC is $50.00!",
                    "If the paid marketing channels are delivering customers whose lifetime value is only $40.00, the company is actively losing $10.00 on every paid customer it acquires! Yet, because the blended number ($33.33) appears profitable against a $40.00 LTV, management continues scaling paid media spend, burning millions of dollars in enterprise value. Growth marketing leadership must systematically decouple Blended CAC from Channel-Specific Paid CAC.",
                    "True Paid CAC isolates paid media expenditures—ad spend, agency management fees, creative production costs, and landing page software licenses—and divides them strictly by the customer cohorts directly acquired through paid clicks and attributed conversions. By auditing the organic acquisition baseline independently, finance and growth teams establish the true incremental cost of acquiring a customer through paid channels.",
                    "In our institutional Python simulation for Part 1, we construct an enterprise CAC decomposition engine. The function ingests total marketing spend, paid customer volume, and organic customer volume, calculating Blended CAC, True Paid Channel CAC, and the organic contribution percentage. Review the code below to see CAC decomposition execute deterministically."
                ],
                "example": "Enterprise Case Study: A subscription coffee brand scaled their Meta ad spend from $20,000 to $100,000 per month based on a reported Blended CAC of $28.00 against an LTV of $45.00. However, when a growth auditor decomposed the metrics, they discovered that paid ads were only acquiring 1,250 customers at a Paid CAC of $80.00, while 2,320 customers arrived organically through word-of-mouth. The paid acquisition channel was incinerating $35.00 per customer! By reallocating budget toward high-intent Google Search and email referrals, they brought Paid CAC down to $34.00, establishing authentic profitability.",
                "code": p1_code,
                "output": "Customer Acquisition Cost (CAC) Decomposition Report:\n  Total Marketing Spend: $50,000.00\n  Acquisitions: 1000 Paid, 500 Organic (1500 Total)\n  Organic Contribution: 33.3%\n  Blended CAC: $33.33\n  True Paid Channel CAC: $50.00\n  Status: CAC_DECOMPOSITION_COMPLETE",
                "codeNotes": [
                    "Decomposes marketing spend across paid ($50.00 CAC) and total customer volumes ($33.33 Blended CAC).",
                    "Calculates organic contribution percentage (33.3%) to evaluate the magnitude of organic masking.",
                    "Ensures growth leadership bases capital allocation decisions on True Paid CAC rather than distorted blended averages."
                ],
                "tryIt": "Reduce paid acquisitions from 1000 to 500 and observe how True Paid CAC doubles to $100.00 while Blended CAC only rises to $50.00.",
                "check": {
                    "question": "Why is relying solely on Blended CAC dangerous when scaling paid digital marketing campaigns?",
                    "options": [
                        "Because organic, direct, and referral customers artificially depress the blended metric, masking unprofitable paid channel acquisition costs.",
                        "Because Blended CAC is prohibited under standard GAAP accounting principles.",
                        "Because advertising platforms charge higher CPC bids if they detect a blended calculation.",
                        "Because Blended CAC excludes creative production costs from the tax deduction register."
                    ],
                    "answer": 0,
                    "why": "Blended CAC groups organic customers with paid customers, creating the illusion of low acquisition costs even when paid campaigns are operating at a severe net loss."
                }
            },
            {
                "title": "Customer Lifetime Value (CLV/LTV) Mathematical Modeling",
                "say": [
                    "Having established the precise cost of customer acquisition, we now examine the revenue engine that justifies that expenditure: Customer Lifetime Value (CLV or LTV). Customer Lifetime Value represents the total cumulative net profit that an individual customer generates for the enterprise over the entirety of their commercial relationship.",
                    "A frequent error among marketing practitioners is equating CLV to gross top-line revenue. If a customer spends $1,000 over their lifetime but the company's cost of goods sold (COGS) and fulfillment equals $700, the customer did not generate $1,000 in enterprise value; they generated $300 in gross margin contribution! Calculating unit economics against top-line revenue rather than gross profit margin inevitably leads to cash exhaustion.",
                    "In modern subscription and recurring e-commerce businesses, Customer Lifetime Value is modeled mathematically through three core variables: Monthly Average Revenue Per User (ARPU), Product Gross Margin Percentage ($GM\\%$), and Monthly Churn Rate ($\\text{Churn}\\%$). The governing mathematical formula is: $\\text{CLV} = \\frac{\\text{Monthly ARPU} \\times \\text{Gross Margin}\\%}{\\text{Monthly Churn}\\%}$. Concurrently, the expected customer lifespan in months is the reciprocal of the monthly churn rate: $\\text{Lifespan} = \\frac{1}{\\text{Monthly Churn}\\%}$.",
                    "For example, if a SaaS company generates $120.00 in monthly ARPU with a 75.0% gross profit margin and experiences a 5.0% monthly churn rate, the expected customer lifespan is $1 / 0.05 = 20.0$ months. The monthly gross profit contribution per customer is $120.00 * 0.75 = $90.00. Multiplying $90.00 by the 20-month lifespan yields a Customer Lifetime Value of exactly $1,800.00.",
                    "In our institutional Python simulation for Part 2, we implement the predictive Customer Lifetime Value mathematical model. The function computes monthly gross profit per user, derives expected customer lifespan in months, and calculates the exact net CLV contribution. Examine the code below to see CLV modeling execute deterministically."
                ],
                "example": "Enterprise Case Study: A cloud productivity platform with 10,000 subscribers evaluated two distinct customer tiers. Tier 1 had an ARPU of $50.00, 80% gross margin, and 8% monthly churn ($CLV = \\frac{50 \\times 0.80}{0.08} = \\$500.00$). Tier 2 had an ARPU of $120.00, 75% gross margin, and 2.5% monthly churn ($CLV = \\frac{120 \\times 0.75}{0.025} = \\$3,600.00$). Although Tier 2 required a higher acquisition cost, its 7.2x higher lifetime value allowed the growth team to bid aggressively in Google Ads auctions, capturing dominant enterprise market share.",
                "code": p2_code,
                "output": "Customer Lifetime Value (CLV) Mathematical Model:\n  Monthly ARPU: $120.00\n  Gross Margin: 75.0%\n  Monthly Churn Rate: 5.0%\n  Expected Lifespan: 20.0 Months\n  Monthly Gross Profit Contribution: $90.00\n  Calculated Customer Lifetime Value (CLV): $1,800.00\n  Status: CLV_MODELING_COMPLETE",
                "codeNotes": [
                    "Models CLV using gross profit margin rather than naive top-line revenue: (ARPU * GM%) / Churn%.",
                    "Derives expected customer lifespan as the mathematical reciprocal of monthly churn: 1 / 0.05 = 20.0 months.",
                    "Calculates monthly gross profit contribution ($90.00) and cumulative lifetime value ($1,800.00) deterministically."
                ],
                "tryIt": "Decrease monthly churn rate from 5.0% to 2.5% and observe how expected lifespan doubles to 40 months and CLV doubles to $3,600.00.",
                "check": {
                    "question": "Why must Customer Lifetime Value (CLV) be calculated using Gross Margin percentage rather than gross top-line revenue?",
                    "options": [
                        "Because marketing acquisition costs must be recouped from actual gross profit contribution after deducting cost of goods sold and fulfillment.",
                        "Because calculating revenue violates International Financial Reporting Standards (IFRS).",
                        "Because gross margin incorporates marketing ad spend directly into the product catalog.",
                        "Because payment processors withhold 100% of revenue until customer lifespan expires."
                    ],
                    "answer": 0,
                    "why": "Only gross profit (revenue minus COGS) is available to cover customer acquisition costs and corporate operating expenses; using top-line revenue leads to insolvency."
                }
            },
            {
                "title": "The Golden Growth Ratio: CLV:CAC >= 3:1",
                "say": [
                    "With CAC and CLV rigorously quantified, we synthesize them into the single most revered metric in growth finance: The Golden Growth Ratio ($CLV:CAC$). The CLV:CAC ratio measures the return on investment generated for every single dollar deployed in customer acquisition. Across institutional venture capital and private equity governance, this ratio dictates whether an enterprise is creating or destroying value.",
                    "The business world adheres to four clear benchmarking regimes for the CLV:CAC ratio: First, a ratio under 1.0 ($CLV:CAC < 1.0$) represents Severe Value Destruction: the company spends more to acquire a customer than that customer will ever generate in gross profit, guaranteeing impending bankruptcy unless acquisition is immediately halted. Second, a ratio between 1.0 and 2.9 represents Sub-Optimal Economics: while technically generating positive gross margin, high overhead, product development, and administrative costs will prevent profitability, leaving the company vulnerable to market shocks.",
                    "Third, a ratio between 3.0 and 5.0 ($3.0 \\le CLV:CAC \\le 5.0$) represents The Golden Ratio: the company generates $3.00 to $5.00 in gross margin for every $1.00 spent on acquisition. This provides ample gross margin to cover corporate operating expenses, fund ongoing research and development, and deliver robust net operating profit. This is the gold standard of scalable, venture-backed enterprise growth.",
                    "Finally, a ratio exceeding 5.0 ($CLV:CAC > 5.0$) often signals Under-Investment in Growth. While an 8:1 ratio appears impressive on a balance sheet, it typically indicates that the company is bidding too conservatively in ad auctions, leaving massive profitable market share on the table for competitors to capture. The company should aggressively increase its acquisition budget, accepting higher marginal CAC to capture market leadership.",
                    "In our institutional Python simulation for Part 3, we build the CLV:CAC Golden Ratio Benchmark Evaluator. The system processes a series of business cohorts with varying CLV and CAC levels, calculates the exact multiple, evaluates financial health, and outputs corporate growth directives. Review the code below to see this evaluation execute deterministically."
                ],
                "example": "Enterprise Case Study: A B2B supply chain platform maintained a CLV of $1,800.00 and a Paid CAC of $450.00, yielding a Golden Ratio of exactly 4.0x. This healthy margin enabled the company to comfortably absorb fluctuations in ad auction CPCs during Q4 holiday bidding surges while maintaining a 28% operating profit margin, satisfying both growth equity investors and executive leadership.",
                "code": p3_code,
                "output": "CLV:CAC Golden Ratio Benchmark Evaluation:\n  CLV $600.0 vs CAC $800.0 -> Ratio: 0.75x | Verdict: VALUE_DESTRUCTION_INSOLVENCY_RISK\n  CLV $1200.0 vs CAC $600.0 -> Ratio: 2.0x | Verdict: SUB_OPTIMAL_UNIT_ECONOMICS\n  CLV $1800.0 vs CAC $450.0 -> Ratio: 4.0x | Verdict: GOLDEN_RATIO_HIGHLY_PROFITABLE_AND_SCALABLE\n  CLV $3600.0 vs CAC $500.0 -> Ratio: 7.2x | Verdict: UNDER_INVESTING_IN_GROWTH_SCALE_ACQUISITION",
                "codeNotes": [
                    "Evaluates the four classic CLV:CAC operational regimes across distinct enterprise profiles.",
                    "Flags severe risk for 0.75x (insolvency) and sub-optimal performance for 2.0x.",
                    "Certifies the 4.0x cohort as GOLDEN_RATIO_HIGHLY_PROFITABLE_AND_SCALABLE and flags 7.2x for growth under-investment."
                ],
                "tryIt": "Modify the CAC of the 4.0x cohort from $450.0 to $700.0 and verify how the ratio drops to 2.57x, shifting the verdict to SUB_OPTIMAL_UNIT_ECONOMICS.",
                "check": {
                    "question": "What is the universally accepted target benchmark for the Customer Lifetime Value to CAC (CLV:CAC) ratio in scalable enterprise growth?",
                    "options": [
                        "At least 3:1 (CLV:CAC >= 3.0), ensuring adequate gross profit to absorb operating overhead and fund growth.",
                        "Exactly 1:1, meaning acquisition costs equal lifetime revenue.",
                        "0.5:1, relying entirely on venture capital subsidies to cover acquisition losses.",
                        "50:1, requiring marketing to operate with zero capital budget."
                    ],
                    "answer": 0,
                    "why": "A CLV:CAC ratio of 3.0 or greater ensures that the enterprise generates sufficient gross profit from each customer to pay for acquisition, cover administrative and R&D overhead, and generate net cash flow."
                }
            },
            {
                "title": "CAC Payback Horizon & Capital Velocity",
                "say": [
                    "While the CLV:CAC ratio dictates long-term economic profitability, it reveals nothing about near-term cash flow solvency. A company can boast an extraordinary 5:1 CLV:CAC ratio and still experience catastrophic bankruptcy if its customer lifetime value takes 7 years to materialize while its ad bills must be paid to Meta and Google within 30 days! This temporal cash conversion gap is governed by the CAC Payback Horizon.",
                    "The CAC Payback Horizon measures the exact number of months required for a newly acquired customer to generate enough gross profit contribution to fully reimburse the initial capital spent to acquire them. The mathematical formula is: $\\text{Payback Months} = \\frac{\\text{Customer Acquisition Cost (CAC)}}{\\text{Monthly ARPU} \\times \\text{Gross Margin}\\%}$. In subscription and recurring commerce models, the elite institutional benchmark is a payback period of 12 months or less (with top-decile venture-scale enterprises achieving 6 to 9 months).",
                    "The strategic significance of CAC Payback is Capital Velocity: the faster an enterprise recoups its acquisition capital, the more times that same dollar can be reinvested into acquiring additional customers within a single calendar year. If an enterprise has a 6-month CAC payback, it can recycle its acquisition capital twice per year, compounding growth exponentially without raising dilutive external equity.",
                    "Conversely, when CAC payback stretches beyond 18 to 24 months, the company's growth rate becomes severely bottlenecked by cash constraints. Even with an outstanding long-term LTV, every new customer acquired creates a multi-year cash deficit. Growth leadership must continuously optimize onboarding, price elasticity, and annual upfront billing incentives (offering a discount for paying 12 months in advance) to pull cash collection forward and compress the payback horizon.",
                    "In our institutional Python simulation for Part 4, we build the CAC Payback Horizon and Capital Velocity Engine. The system evaluates different customer cohorts, computes monthly gross profit contributions, calculates payback periods in months, and classifies capital efficiency tiers. Examine the code below to see CAC payback modeling execute deterministically."
                ],
                "example": "Enterprise Case Study: A SaaS collaboration company observed that customers paying month-to-month yielded a 14.2-month CAC payback period ($CAC = $450, Monthly Margin = $31.69). By introducing an annual billing option with a 15% discount, 62% of new customers paid upfront ($323 gross margin collected on Day 1). This compressed their blended CAC payback horizon to 5.0 months, enabling them to reinvest subscription cash flow three times faster and achieve 140% year-over-year ARR growth without outside capital.",
                "code": p4_code,
                "output": "CAC Payback Horizon & Capital Velocity Report:\n  Enterprise Plan: CAC $450.0 -> Payback: 5.0 Months (ELITE_CAPITAL_VELOCITY_SUB_12M)\n  SMB Tier: CAC $300.0 -> Payback: 10.7 Months (ELITE_CAPITAL_VELOCITY_SUB_12M)\n  Consumer Pro: CAC $120.0 -> Payback: 6.0 Months (ELITE_CAPITAL_VELOCITY_SUB_12M)",
                "codeNotes": [
                    "Calculates CAC payback in months: CAC / (Monthly ARPU * Gross Margin %).",
                    "Evaluates cohorts against the strict <= 12 months institutional capital efficiency benchmark.",
                    "Confirms elite performance across Enterprise (5.0m), SMB (10.7m), and Consumer (6.0m) customer tiers."
                ],
                "tryIt": "Increase SMB Tier CAC from $300.0 to $450.0 and verify how payback extends to 16.1 months, triggering a PROLONGED_CASH_CONVERSION_CYCLE alert.",
                "check": {
                    "question": "Why is compressing the CAC payback horizon to under 12 months critical for scaling digital marketing operations?",
                    "options": [
                        "It accelerates capital recycling, allowing the company to reinvest acquisition capital multiple times per year without exhausting cash reserves.",
                        "Because banks refuse to issue credit cards to companies with payback periods longer than 3 months.",
                        "Because advertising platforms forgive ad invoices if payback takes longer than one year.",
                        "To ensure the marketing team earns quarterly performance bonuses regardless of profitability."
                    ],
                    "answer": 0,
                    "why": "A short CAC payback period (sub-12 months) ensures fast cash recovery, enabling the business to reinvest the same capital into new acquisition loops and self-fund aggressive growth."
                }
            },
            {
                "title": "Enterprise Unit Economics & LTV:CAC Gateway",
                "say": [
                    "In this concluding session of Day 22, we synthesize the quantitative disciplines of growth finance into a single, cohesive governance engine: the Enterprise Unit Economics & LTV:CAC Gateway. Top-tier Chief Marketing Officers and performance marketing executives do not manage acquisition spend in an econometric vacuum; they operate with complete boardroom financial transparency, proving that every marketing dollar deployed yields predictable, high-multiple gross margin.",
                    "The Enterprise Unit Economics Gateway enforces four mandatory financial gates: Gate 1: Granular CAC Decomposition, strictly isolating True Paid Channel CAC from organic attribution contamination; Gate 2: Mathematical Predictive CLV Modeling based on gross profit margin and cohort churn rather than top-line revenue; Gate 3: Unyielding adherence to the Golden Ratio ($CLV:CAC \\ge 3.0$); and Gate 4: Capital Velocity Payback Horizons compressed to 12 months or less.",
                    "When all four gates are verified, the organization achieves complete harmony between aggressive performance marketing and institutional fiscal stewardship. In our institutional Python simulation for Part 5, we execute the Enterprise Unit Economics Gateway auditor. The gateway validates all four financial components, awards a composite Unit Economics Index (UEI) score of 100.0/100, and confers the prestigious Unit Economics & LTV Director credential. Review the code below to see this final financial certification execute deterministically."
                ],
                "example": "Enterprise Case Study: Prior to their Series B funding round, an enterprise logistics software firm implemented the Enterprise Unit Economics Gateway. The gateway verified a Paid CAC of $450, a predictive gross-margin CLV of $1,800 (Golden Ratio of 4.0x), and an average payback horizon of 5.0 months across their enterprise customer segment. Armed with these audited, deterministic unit economics, the company secured a $40M growth investment at a premium valuation.",
                "code": p5_code,
                "output": "Enterprise Unit Economics & LTV:CAC Gateway Report:\n  CAC Decomposition Verified: True\n  CLV Modeling Verified: True\n  Golden Ratio Verified: True\n  Payback Velocity Verified: True\n  Composite UEI Score: 100.0 / 100.0\n  Accreditation Verdict: UNIT_ECONOMICS_AND_LTV_DIRECTOR_CERTIFIED",
                "codeNotes": [
                    "Integrates CAC decomposition, gross-margin CLV, Golden Ratio verification, and sub-12m payback velocity.",
                    "Scores 100.0/100 on the composite Unit Economics Index (UEI) when all financial gates are nominal.",
                    "Confers official UNIT_ECONOMICS_AND_LTV_DIRECTOR_CERTIFIED credentials for institutional boardroom defense."
                ],
                "tryIt": "Set payback_sub_12m to False and observe how the gateway revokes accreditation and issues a FINANCIAL_AUDIT_REQUIRED alert.",
                "check": {
                    "question": "Which combination of metrics represents institutional excellence in digital marketing unit economics?",
                    "options": [
                        "True Paid CAC isolated from organic noise, gross-margin CLV, a CLV:CAC ratio >= 3.0, and a CAC payback horizon <= 12 months.",
                        "Relying solely on blended CAC with zero gross margin adjustments and unmonitored payback cycles.",
                        "Maintaining an unlimited marketing budget without calculating churn or customer lifetime value.",
                        "Requiring 100% of revenue to be derived from paid ads with zero organic brand equity."
                    ],
                    "answer": 0,
                    "why": "Elite unit economics requires isolated Paid CAC, gross-margin CLV, the 3:1 Golden Ratio, and sub-12-month capital payback to ensure scalable, cash-flow-positive growth."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day22_lesson()
    visual = build_day22_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 22 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
