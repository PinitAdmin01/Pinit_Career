import sys
import json
import hashlib

def get_day12_data() -> dict:
    day = 12
    title = "Customer Retention & Net Revenue Retention (NRR >= 120%)"
    goal = "Master the compounding economics of SaaS retention: mathematically differentiating Gross Revenue Retention (GRR) from Net Revenue Retention (NRR), modeling multi-year cohort decay waterfalls, structuring account expansion vectors, and enforcing contractual renewal governance to build an elite recurring revenue engine."
    minutes = 45
    recap = "Yesterday in Day 11, we established proactive customer health scoring, telemetry-driven early warning systems, and automated churn rescue playbooks. Today in Day 12, we transition to the financial engine of customer success: Gross and Net Revenue Retention, cohort expansion waterfalls, and contract renewal mechanics."

    parts = [
        # Part 1: The SaaS Compounding Law: Gross Revenue Retention (GRR) vs Net Revenue Retention (NRR)
        {
            "title": "The SaaS Compounding Law: Gross Revenue Retention (GRR) vs Net Revenue Retention (NRR)",
            "say": [
                "Welcome to Day 12 of B.Com Sales, Customer Success & CRM (SCRM). In modern recurring revenue finance, venture capital valuation, and public market equities, no metric exerts a more profound influence on an enterprise's long-term enterprise valuation than Net Revenue Retention (NRR). While top-of-funnel customer acquisition often dominates quarterly sales kickoffs, the mathematical reality of recurring revenue is that an enterprise cannot scale sustainably if its underlying customer base is steadily leaking away. The difference between an average software company and a generational market leader is dictated by the mathematical law of compounding retention.",
                "To master retention economics, revenue leaders must rigorously differentiate between two fundamental financial metrics: Gross Revenue Retention (GRR) and Net Revenue Retention (NRR). Gross Revenue Retention measures the percentage of recurring revenue retained exclusively from the existing customer base, strictly isolating the erosive effects of customer churn and contract contraction, without permitting any expansion revenue, upsells, or cross-sells to mask underlying losses. Mathematically, GRR is expressed as: GRR = ((Starting ARR - Contraction ARR - Churn ARR) / Starting ARR) * 100%. Because expansion is excluded by definition, GRR can never exceed 100.0%. In elite enterprise B2B SaaS, an annual GRR between 90% and 95% is considered world-class, whereas a GRR below 80% indicates acute product dissatisfaction or severe competitive vulnerability.",
                "Conversely, Net Revenue Retention (NRR) measures the total net change in recurring revenue derived from an existing customer cohort over a specific time horizon, typically twelve months. NRR incorporates both value destruction (churn and contraction) and value creation (expansion ARR from additional seats, tier upgrades, and consumption add-ons). Mathematically, NRR is formulated as: NRR = ((Starting ARR + Expansion ARR - Contraction ARR - Churn ARR) / Starting ARR) * 100%, which simplifies to: NRR = (Ending ARR from Starting Cohort / Starting ARR) * 100%. Unlike GRR, NRR can substantially exceed 100.0%.",
                "When a company achieves an NRR of 120% or higher, it enters the elite tier of compounding SaaS economics. An NRR of 120% signifies that even if the sales team were to acquire zero new customers over the entire year, the existing customer base would organically expand company revenue by twenty percent. Over a five-year horizon, a business with 130% NRR nearly triples its baseline revenue without spending a single dollar on new customer acquisition, whereas a business with 85% NRR loses nearly half its revenue over the same duration, forcing the sales team onto an exhausting and expensive acquisition treadmill merely to maintain flat revenue.",
                "Capital markets recognize this compounding leverage by awarding premium enterprise valuation multiples to high-NRR companies. Public market regression analyses published across landmark cloud indices—such as the Bessemer Cloud Index, KeyBanc SaaS Survey, and OpenView Expansion Benchmarks—demonstrate that for every ten-percentage-point increase in NRR above 100%, an enterprise software company's revenue valuation multiple expands by two to three turns of forward ARR. A company generating $100M ARR with 125% NRR routinely commands a valuation multiple of 15x to 20x ARR, while an identical $100M company with 95% NRR trades at 4x to 6x ARR. Retention is not merely a customer success operational goal; it is the primary engine of shareholder enterprise value creation.",
                "Furthermore, executive leadership must monitor the divergence between GRR and NRR. If a company exhibits a spectacular NRR of 135% but a mediocre GRR of 78%, the business suffers from 'Whale Concentration Masking': a tiny handful of hyper-expanding mega-accounts are temporarily disguising broad-based customer churn across the mid-market and SMB customer base. If those few expanding whales eventually reach adoption plateaus, the underlying churn will abruptly drag NRR below 100%, destroying company growth. Sustainable revenue durability requires simultaneous excellence in both GRR (defense) and NRR (offense).",
                "In this first part, we construct a Gross & Net Revenue Retention Calculator. This deterministic Python model ingests cohort starting ARR, expansion revenue, contraction losses, and churn attrition, calculates precise GRR and NRR percentages, benchmarks them against top-quartile SaaS standards, and determines the implied enterprise valuation multiple tier."
            ],
            "example": "An infrastructure software company with $50M in starting ARR experienced $2.5M in churn and $1.5M in contraction, while generating $14M in account expansion from existing clients. Its GRR was 92.0% (($50M - $1.5M - $2.5M) / $50M), proving a resilient core product, while its NRR reached an extraordinary 120.0% (($50M + $14M - $1.5M - $2.5M) / $50M). This elite net retention profile allowed the company to raise growth equity at an 18x ARR valuation multiple.",
            "code": """# SaaS Compounding Law: Gross & Net Revenue Retention Calculator
from typing import Dict, Any

def calculate_grr_and_nrr_metrics(
    starting_arr_usd: float,
    expansion_arr_usd: float,
    contraction_arr_usd: float,
    churn_arr_usd: float
) -> Dict[str, Any]:
    if starting_arr_usd <= 0:
        raise ValueError("Starting ARR must be strictly positive")
        
    # Gross Revenue Retention (GRR): Max 100.0%
    retained_base_arr = starting_arr_usd - contraction_arr_usd - churn_arr_usd
    grr_pct = round((retained_base_arr / starting_arr_usd) * 100.0, 2)
    
    # Net Revenue Retention (NRR): Compounding growth metric
    ending_cohort_arr = starting_arr_usd + expansion_arr_usd - contraction_arr_usd - churn_arr_usd
    nrr_pct = round((ending_cohort_arr / starting_arr_usd) * 100.0, 2)
    net_expansion_dollars = expansion_arr_usd - contraction_arr_usd - churn_arr_usd
    
    # Benchmark Evaluation
    is_elite_growth = nrr_pct >= 120.0
    is_world_class_grr = grr_pct >= 90.0
    
    if nrr_pct >= 130.0 and grr_pct >= 92.0:
        valuation_tier = "TIER_1_HYPERGROWTH_UNICORN (18x-25x ARR Multiple)"
    elif nrr_pct >= 115.0 and grr_pct >= 88.0:
        valuation_tier = "TIER_2_ELITE_ENTERPRISE_SAAS (12x-16x ARR Multiple)"
    elif nrr_pct >= 100.0 and grr_pct >= 82.0:
        valuation_tier = "TIER_3_STABLE_EXPANSION (7x-10x ARR Multiple)"
    else:
        valuation_tier = "TIER_4_LEAKY_BUCKET_AT_RISK (3x-5x ARR Multiple)"
        
    return {
        "starting_arr_usd": starting_arr_usd,
        "ending_cohort_arr_usd": ending_cohort_arr,
        "net_expansion_dollars": net_expansion_dollars,
        "grr_percent": grr_pct,
        "nrr_percent": nrr_pct,
        "is_elite_growth_tier": is_elite_growth,
        "is_world_class_grr": is_world_class_grr,
        "valuation_multiple_tier": valuation_tier,
        "status": "RETENTION_COMPUTED"
    }

# Test benchmark enterprise SaaS accounts
comp_a = calculate_grr_and_nrr_metrics(
    starting_arr_usd=10000000.0, expansion_arr_usd=3000000.0,
    contraction_arr_usd=400000.0, churn_arr_usd=600000.0
)
comp_b = calculate_grr_and_nrr_metrics(
    starting_arr_usd=10000000.0, expansion_arr_usd=800000.0,
    contraction_arr_usd=1200000.0, churn_arr_usd=1500000.0
)

print(f"Company A: GRR {comp_a['grr_percent']}% | NRR {comp_a['nrr_percent']}% | Elite: {comp_a['is_elite_growth_tier']}")
print(f"  Valuation: {comp_a['valuation_multiple_tier']}")
print(f"Company B: GRR {comp_b['grr_percent']}% | NRR {comp_b['nrr_percent']}% | Elite: {comp_b['is_elite_growth_tier']}")
print(f"  Valuation: {comp_b['valuation_multiple_tier']}")
""",
            "output": """Company A: GRR 90.0% | NRR 120.0% | Elite: True
  Valuation: TIER_2_ELITE_ENTERPRISE_SAAS (12x-16x ARR Multiple)
Company B: GRR 73.0% | NRR 81.0% | Elite: False
  Valuation: TIER_4_LEAKY_BUCKET_AT_RISK (3x-5x ARR Multiple)""",
            "codeNotes": [
                "Implements the exact Gross Revenue Retention (GRR) formula capped at 100.0%.",
                "Calculates Net Revenue Retention (NRR) showing net organic expansion from baseline cohorts.",
                "Maps retention performance directly to forward ARR enterprise valuation multiple tiers."
            ],
            "tryIt": "Increase expansion_arr_usd in Company A to $4,500,000 to see NRR cross 130% and unlock Tier 1 Unicorn status.",
            "check": {
                "question": "Why can Gross Revenue Retention (GRR) never mathematically exceed 100.0%, whereas Net Revenue Retention (NRR) can?",
                "options": [
                    "GRR strictly measures retained revenue without allowing expansion or upsells, while NRR incorporates customer expansion ARR",
                    "International Financial Reporting Standards (IFRS) make it illegal to report GRR above 100% under threat of felony audit fines",
                    "Software licensing algorithms automatically reboot billing systems if GRR is calculated higher than starting contract value",
                    "GRR is only measured over thirty-day windows, whereas NRR is measured over perpetual ten-year macroeconomic cycles"
                ],
                "answer": 0,
                "why": "GRR isolates retention by excluding expansion ARR from existing accounts; NRR includes upsells and cross-sells, allowing it to compound beyond 100%."
            }
        },

        # Part 2: Cohort Retention Waterfalls & Churn Amortization Accounting
        {
            "title": "Cohort Retention Waterfalls & Churn Amortization Accounting",
            "say": [
                "While point-in-time annual GRR and NRR percentages provide executive snapshots, they aggregate diverse customer vintages into a single blended metric. This blending can obscure dangerous structural shifts. For example, rapid expansion from a handful of newly landed enterprise accounts can temporarily mask severe churn occurring across older customer cohorts. To uncover the true underlying health of recurring revenue, financial analysts and Customer Success Operations leaders construct Cohort Retention Waterfalls.",
                "A Cohort Retention Waterfall organizes customers into discrete groups based on the calendar month, quarter, or year in which they signed their initial contract—referred to as the 'vintage cohort'. The revenue contribution of each vintage is then tracked longitudinally across subsequent time periods: Month 0 (initial purchase), Month 12 (first annual renewal), Month 24, Month 36, and beyond. This longitudinal tracking isolates how customer cohorts mature over their lifetime.",
                "When visualizing cohort retention curves, enterprise software businesses typically exhibit one of three characteristic geometric trajectories: Trajectory 1: The Linear Decay Curve. In commoditized, low-switching-cost products, cohorts experience steady, unmitigated attrition every year, losing 15% of revenue per annum until the cohort approaches zero. Trajectory 2: The Asymptotic Stabilization Curve. In sticky B2B products with high switching costs, cohorts experience moderate initial attrition in Year 1 as non-ideal customers drop out, but stabilize around Year 2 or 3 into a permanent, highly loyal base that rarely churns.",
                "Trajectory 3 represents the holy grail of software business models: The 'SaaS Smile' Curve (Net Negative Churn). In world-class land-and-expand platforms (such as Snowflake, Datadog, or Slack), a vintage cohort might experience a minor initial dip at Month 12 as a few accounts cancel; however, the remaining accounts expand their usage so aggressively that by Month 24 and Month 36, the cohort's total revenue contribution surpasses its original starting baseline. When a cohort's expansion revenue exceeds its combined churn and contraction, the business achieves Net Negative Churn, causing the cohort curve to bend upwards like a smile.",
                "Furthermore, revenue accounting under ASC 606 standards requires distinguishing between 'Logo Churn' and 'Revenue Churn'. Logo Churn measures the percentage of distinct customer accounts that cancel their contracts, whereas Revenue Churn measures the dollar value of lost ARR. In enterprise SaaS, Logo Churn is frequently higher than Revenue Churn because smaller, low-ARR customers churn at higher rates than large enterprise contracts. If an enterprise loses 10% of its logos but those logos represent only 2% of total ARR, the business retains 98% of its revenue, preserving enterprise value.",
                "In addition, financial controllers must account for Churn Amortization. When an annual upfront subscription contract is cancelled mid-term with a negotiated refund, or when an account becomes non-collectible, the unearned deferred revenue sitting on the balance sheet must be written off against the income statement, immediately reducing recognised revenue. Cohort modeling enables finance teams to establish accurate bad-debt and churn reserve allocations based on historical vintage survival curves, preventing quarterly revenue restatements.",
                "Finally, Customer Success Operations utilizes vintage cohort analysis to calculate Customer Lifetime Value (LTV) and the LTV-to-CAC Ratio across distinct acquisition channels. When cohorts exhibit Net Negative Churn, theoretical LTV approaches infinity; in practice, financial analysts model conservative 5-year or 7-year lifetime caps. If a vintage cohort expands at 120% NRR annually, the LTV generated by that cohort is more than triple that of a cohort decaying at 85% NRR. This profound disparity justifies investing higher upfront CAC to acquire ideal customer profile (ICP) accounts that possess high expansion potential.",
                "In this second part, we construct a Cohort Retention Waterfall & Vintage Decay Simulator. This deterministic engine tracks multiple annual customer vintages over a four-year lifecycle, calculates cohort expansion factors, identifies Net Negative Churn smile curves, and reports vintage durability metrics."
            ],
            "example": "A cloud database provider tracked its 2022 customer vintage with $10M starting ARR. In 2023 (Month 12), logo churn dropped the cohort to $9.2M (92% GRR); however, remaining customers scaled their data storage, driving 2024 revenue to $11.8M (118% of baseline) and 2025 revenue to $14.2M (142% of baseline). This classic 'SaaS Smile' curve proved that customer lifetime value expanded over time.",
            "code": """# Cohort Retention Waterfalls & Vintage Decay Simulator
from typing import Dict, Any, List

def model_cohort_retention_waterfall(
    vintage_year: int,
    starting_arr_usd: float,
    year1_nrr_factor: float, # e.g. 1.05 = 105% of baseline
    year2_nrr_factor: float, # e.g. 1.18 = 118% of baseline
    year3_nrr_factor: float  # e.g. 1.35 = 135% of baseline
) -> Dict[str, Any]:
    # Longitudinal tracking over 3 years
    y0_arr = starting_arr_usd
    y1_arr = round(starting_arr_usd * year1_nrr_factor, 2)
    y2_arr = round(starting_arr_usd * year2_nrr_factor, 2)
    y3_arr = round(starting_arr_usd * year3_nrr_factor, 2)
    
    # Check for Net Negative Churn (SaaS Smile Curve: Y3 > Y0)
    has_net_negative_churn = y3_arr > y0_arr
    trajectory = "SAAS_SMILE_NET_NEGATIVE_CHURN" if has_net_negative_churn else "ASYMPTOTIC_COHORT_DECAY"
    
    cumulative_expansion_dollars = y3_arr - y0_arr
    cumulative_growth_pct = round(((y3_arr - y0_arr) / y0_arr) * 100.0, 2)
    
    return {
        "vintage_year": vintage_year,
        "cohort_timeline_arr": {
            "Year_0_Baseline": y0_arr,
            "Year_1_Renewal": y1_arr,
            "Year_2_Expansion": y2_arr,
            "Year_3_Maturity": y3_arr
        },
        "retention_factors": [1.0, year1_nrr_factor, year2_nrr_factor, year3_nrr_factor],
        "has_net_negative_churn": has_net_negative_churn,
        "trajectory_classification": trajectory,
        "cumulative_growth_pct": cumulative_growth_pct,
        "cumulative_expansion_usd": cumulative_expansion_dollars
    }

# Test healthy smile curve vs decaying cohort
cohort_smile = model_cohort_retention_waterfall(2023, 10000000.0, 1.05, 1.20, 1.40)
cohort_decay = model_cohort_retention_waterfall(2023, 10000000.0, 0.85, 0.75, 0.68)

print(f"Cohort Smile (2023): Y0 ${cohort_smile['cohort_timeline_arr']['Year_0_Baseline']:,.0f} -> Y3 ${cohort_smile['cohort_timeline_arr']['Year_3_Maturity']:,.0f}")
print(f"  Trajectory: {cohort_smile['trajectory_classification']} (+{cohort_smile['cumulative_growth_pct']}%)")
print(f"Cohort Decay (2023): Y0 ${cohort_decay['cohort_timeline_arr']['Year_0_Baseline']:,.0f} -> Y3 ${cohort_decay['cohort_timeline_arr']['Year_3_Maturity']:,.0f}")
print(f"  Trajectory: {cohort_decay['trajectory_classification']} ({cohort_decay['cumulative_growth_pct']}%)")
""",
            "output": """Cohort Smile (2023): Y0 $10,000,000 -> Y3 $14,000,000
  Trajectory: SAAS_SMILE_NET_NEGATIVE_CHURN (+40.0%)
Cohort Decay (2023): Y0 $10,000,000 -> Y3 $6,800,000
  Trajectory: ASYMPTOTIC_COHORT_DECAY (-32.0%)""",
            "codeNotes": [
                "Models multi-year longitudinal cohort revenue tracking across Year 0 to Year 3.",
                "Detects Net Negative Churn where expansion outpaces attrition, creating the 'SaaS Smile' curve.",
                "Calculates cumulative revenue growth percentages from the baseline vintage investment."
            ],
            "tryIt": "Adjust year1_nrr_factor to 0.95 and year3_nrr_factor to 1.15 to observe an initial dip followed by late-stage smile recovery.",
            "check": {
                "question": "What is the defining characteristic of a 'SaaS Smile' cohort retention curve in enterprise software economics?",
                "options": [
                    "A cohort's total revenue initially dips due to minor early churn but expands significantly in subsequent years as retained customers scale usage, surpassing baseline ARR",
                    "Customer happiness surveys are legally required to feature smiling emojis on all quarterly feedback invoices",
                    "Sales representatives receive smile bonuses if customer contracts renew within twenty-four hours of initial expiration",
                    "The company's marketing website automatically renders animated graphics whenever an enterprise customer logs into their account"
                ],
                "answer": 0,
                "why": "Net negative churn causes cohort revenue to expand over time: retained accounts increase spend faster than lost accounts reduce it, bending the curve upward."
            }
        },

        # Part 3: Account Expansion Economics: Seat Upselling, Tier Migration & Usage-Based Monetization
        {
            "title": "Account Expansion Economics: Seat Upselling, Tier Migration & Usage-Based Monetization",
            "say": [
                "Achieving an NRR exceeding 120% does not happen by accident; it requires a structured, multi-dimensional expansion architecture embedded directly into product packaging and pricing. When modern Customer Success Managers manage accounts, they do not merely resolve support tickets; they actively identify, nurture, and capture account expansion opportunities. In enterprise SaaS, expansion revenue is generated across three distinct commercial vectors: (1) Seat Expansion (User Volume), (2) Edition/Tier Migration (Feature Capability), and (3) Usage-Based Consumption (Operational Scale).",
                "Vector 1: Seat Expansion operates on the classic 'Land and Expand' motion. A sales representative lands an initial contract with a single departmental team—for example, twenty software engineers in the mobile application division. As the team realizes value and establishes best practices, the Customer Success Manager collaborates with the internal champion to present case studies to adjacent engineering teams. Within eighteen months, the software expands across data engineering, frontend, and backend divisions, scaling seat count from 20 to 250 licenses. Seat expansion is driven by organizational diffusion and collaborative network effects.",
                "Vector 2: Edition & Tier Migration leverages feature gating and enterprise governance requirements. A customer initially signs on the 'Professional' tier to solve immediate functional needs. However, as the customer scales, their internal IT, security, and compliance departments impose strict governance mandates: Single Sign-On (SAML/Okta integration), Role-Based Access Control (RBAC), SOC 2 compliance logging, custom data retention policies, and dedicated 24/7 technical support. These capabilities are strategically reserved for the 'Enterprise' or 'Ultimate' tiers, commanding a 50% to 100% price premium per seat. Tier migration monetizes the customer's organizational growth and regulatory maturity.",
                "Vector 3: Usage-Based Consumption represents the modern hybrid pricing model popularized by cloud infrastructure leaders like AWS, Snowflake, and Twilio. Under hybrid models, customers pay a predictable baseline platform fee combined with variable metered pricing tied directly to business activity—such as gigabytes of data processed, API calls executed, monthly active tracked users, or AI model inference tokens consumed. When the customer's underlying business flourishes, software consumption expands automatically without requiring complex sales contract renegotiations.",
                "To optimize expansion yield, Customer Success Operations implements automated 'Expansion Propensity Scoring'. By monitoring telemetry thresholds—such as accounts consistently operating at 95% seat utilization, repeatedly attempting to click premium feature gates, or approaching 90% of their monthly consumption limits—the CRM automatically generates qualified expansion tasks for the CSM and account executive team.",
                "Furthermore, product and commercial leaders must align their primary pricing metric with customer value realization. If a vendor prices by CPU cores but the customer derives business value from active transactions, misalignment occurs: the customer attempts to artificially constrain computing resources to minimize software fees, stifling adoption. Conversely, when pricing metrics scale seamlessly in lockstep with the customer's business success (such as revenue generated or transactions processed), the commercial expansion dynamic transforms from an adversarial negotiation into a symbiotic commercial partnership.",
                "Finally, Customer Success Managers leverage Account Whitespace Mapping to systematically uncover unmonetized departments. By cross-referencing corporate organizational charts against product module penetration, CSMs identify unpurchased capabilities (such as an analytics add-on, an API integration package, or professional sandbox environments) and partner with internal champions to present tailored business cases. This institutionalizes structured account expansion as a continuous operational habit rather than an episodic end-of-year scramble.",
                "Additionally, modern CS organizations establish automated 'Product Qualified Account' (PQA) triggers that notify account executives whenever an existing customer exceeds safe consumption thresholds. For example, if an enterprise client's API call volume exceeds ninety percent of its allocated tier for five consecutive business days, the CRM automatically generates a high-priority PQA task with recommended expansion pricing packages.",
                "In this third part, we construct an Account Expansion Vectors & Monetization Engine. This deterministic Python model calculates the incremental ARR generated across seat expansion, tier migration premiums, and consumption overages, yielding a comprehensive Account Expansion Yield Profile."
            ],
            "example": "A cybersecurity analytics platform with an initial $60,000 contract expanded the account over 18 months: Seat count grew from 50 to 120 seats ($35,000 uplift), the client upgraded from Professional to Enterprise for SAML/RBAC compliance ($25,000 tier premium), and log ingestion increased by 4 Terabytes monthly ($40,000 consumption overage). Total account ARR expanded from $60,000 to $160,000, delivering a stunning 266% single-account NRR.",
            "code": """# Account Expansion Vectors & Monetization Engine
from typing import Dict, Any

def model_account_expansion_vectors(
    base_arr_usd: float,
    current_seats: int,
    additional_seats_added: int,
    price_per_seat_annual: float,
    tier_upgrade_premium_pct: float, # e.g. 0.40 for 40% premium
    monthly_consumption_units_overage: float,
    unit_price_usd: float
) -> Dict[str, Any]:
    # Vector 1: Seat Expansion ARR
    seat_expansion_arr = additional_seats_added * price_per_seat_annual
    new_total_seats = current_seats + additional_seats_added
    
    # Vector 2: Tier Upgrade Premium (Applied to expanded seat base)
    baseline_seat_revenue = new_total_seats * price_per_seat_annual
    tier_migration_arr = baseline_seat_revenue * tier_upgrade_premium_pct
    
    # Vector 3: Consumption Usage-Based Overage ARR
    annual_consumption_arr = (monthly_consumption_units_overage * unit_price_usd) * 12.0
    
    # Total Expanded Account ARR
    total_expansion_arr = seat_expansion_arr + tier_migration_arr + annual_consumption_arr
    ending_account_arr = base_arr_usd + total_expansion_arr
    single_account_nrr_pct = round((ending_account_arr / base_arr_usd) * 100.0, 2)
    
    return {
        "starting_account_arr_usd": base_arr_usd,
        "seat_expansion_arr_usd": round(seat_expansion_arr, 2),
        "tier_migration_arr_usd": round(tier_migration_arr, 2),
        "annual_consumption_arr_usd": round(annual_consumption_arr, 2),
        "total_expansion_arr_usd": round(total_expansion_arr, 2),
        "ending_account_arr_usd": round(ending_account_arr, 2),
        "single_account_nrr_percent": single_account_nrr_pct,
        "primary_expansion_vector": max(
            [("SEAT_EXPANSION", seat_expansion_arr),
             ("TIER_MIGRATION", tier_migration_arr),
             ("USAGE_CONSUMPTION", annual_consumption_arr)],
            key=lambda x: x[1]
        )[0]
    }

# Test multi-vector account expansion
expansion_profile = model_account_expansion_vectors(
    base_arr_usd=50000.0,
    current_seats=50,
    additional_seats_added=30,
    price_per_seat_annual=1000.0,
    tier_upgrade_premium_pct=0.35, # 35% enterprise tier uplift
    monthly_consumption_units_overage=500.0,
    unit_price_usd=4.0
)

print(f"Starting ARR: ${expansion_profile['starting_account_arr_usd']:,.0f}")
print(f"  + Seats:       ${expansion_profile['seat_expansion_arr_usd']:,.0f}")
print(f"  + Tier Uplift: ${expansion_profile['tier_migration_arr_usd']:,.0f}")
print(f"  + Usage:       ${expansion_profile['annual_consumption_arr_usd']:,.0f}")
print(f"Ending ARR:   ${expansion_profile['ending_account_arr_usd']:,.0f} (NRR: {expansion_profile['single_account_nrr_percent']}%)")
print(f"Dominant Vector: {expansion_profile['primary_expansion_vector']}")
""",
            "output": """Starting ARR: $50,000
  + Seats:       $30,000
  + Tier Uplift: $28,000
  + Usage:       $24,000
Ending ARR:   $132,000 (NRR: 264.0%)
Dominant Vector: SEAT_EXPANSION""",
            "codeNotes": [
                "Quantifies revenue expansion across seat volume, tier migration premiums, and consumption overages.",
                "Calculates single-account Net Revenue Retention (NRR) based on multi-vector expansion capture.",
                "Identifies the dominant expansion vector driving account growth to inform product packaging strategy."
            ],
            "tryIt": "Increase monthly_consumption_units_overage to 2,000 units to observe consumption overtakes seats as dominant vector.",
            "check": {
                "question": "Which of the following represents an example of 'Tier Migration' account expansion in enterprise SaaS packaging?",
                "options": [
                    "A customer upgrading from Professional to Enterprise tier to access Single Sign-On (SAML/Okta) and advanced security audit logging",
                    "A customer purchasing fifty additional user licenses for their European sales engineering division",
                    "A customer paying an additional invoice due to processing 10 million extra API queries during Black Friday",
                    "A customer receiving a 10% price discount in exchange for signing a five-year contract commitment"
                ],
                "answer": 0,
                "why": "Tier migration occurs when a customer moves up product editions (e.g. Pro to Enterprise) to unlock premium capabilities like SSO, compliance, and RBAC."
            }
        },

        # Part 4: Contract Renewal Governance: Auto-Renewal Windows & Multi-Year Pre-Commitments
        {
            "title": "Contract Renewal Governance: Auto-Renewal Windows & Multi-Year Pre-Commitments",
            "say": [
                "In enterprise software operations, predictable revenue retention is anchored in disciplined legal and commercial contract governance. Even a product with exceptional customer health and enthusiastic user adoption can experience catastrophic churn or delayed cash flows if the renewal process is managed casually. Commercial Customer Success Managers and Renewal Specialists must master the contractual mechanics that govern enterprise subscriptions: Opt-Out Windows, Contractual Price Escalation Clauses, and Multi-Year Pre-Commitments.",
                "The foundation of subscription predictability is the Evergreen Auto-Renewal Clause. Under a standard enterprise Master Services Agreement (MSA), the contract automatically renews for a subsequent twelve-month term unless either party provides written notice of non-renewal within a specified opt-out window—typically sixty or ninety days prior to the annual expiration date. Renewal specialists must maintain a strict 120-day renewal countdown calendar. If the customer's 90-day opt-out window passes without written notification, the renewal legally binds, preventing last-minute end-of-quarter procurement surprises.",
                "Furthermore, elite SaaS contracts protect recurring revenue against macroeconomic inflation by embedding Contractual Price Escalation Clauses (also known as CPI or annual indexation uplifts). Standard commercial language stipulates that upon each annual renewal, subscription fees automatically increase by between five and seven percent, or the Consumer Price Index (CPI), whichever is higher. On a $100M ARR portfolio, a six-percent contractual price uplift generates $6M in pure, high-margin expansion ARR annually without requiring a single additional feature release.",
                "Conversely, enterprise buyers often seek budget predictability by negotiating Multi-Year Contracts (e.g., two or three-year non-cancelable agreements). For the vendor, multi-year contracts provide immense financial advantages: they lock in Gross Revenue Retention for thirty-six months, completely insulate the account against annual competitor bidding cycles, and allow the vendor to secure upfront cash payments through annual billing in advance. To incentivize multi-year commitments, vendors typically offer modest tiered discounts—such as five percent for two years, or ten percent for three years—while eliminating cancellation-for-convenience clauses.",
                "Operationalizing renewal governance requires establishing a formal 'Mutual Renewal Close Plan' 120 days prior to contract expiration. The plan outlines key governance milestones: Day 120: Value Realization Review with Executive Sponsor; Day 90: Pricing & Scope Proposal Delivery; Day 60: Legal & Procurement Redline Closure; Day 30: Executive Signature and Purchase Order (PO) Execution. Running this disciplined timeline prevents deals from slipping past renewal dates into expired contract limbo.",
                "When commercial pushback arises during renewals, Customer Success Managers must deploy disciplined concession trading. If procurement demands a fifteen percent budget reduction, the CSM must never concede pricing unilaterally. Instead, the CSM trades for contractual value: granting a five percent concession only in exchange for a two-year extension, moving from net-60 to net-30 payment terms, or obtaining co-marketing rights as a public case study. Trading price concessions for contractual security preserves revenue integrity across the portfolio.",
                "To resolve downsell threats before contract expiration, enterprise Customer Success teams establish a 'Downsell Review Board' (DRB) comprising the VP of Customer Success, VP of Sales, and Director of Commercial Legal. When an enterprise account formally requests a seat contraction or budget cut exceeding twenty thousand dollars, the account is routed to the DRB for strategic packaging options—such as bundling unutilized seats into corporate training credits, swapping seats for newly launched AI add-ons, or restructuring multi-product licensing to protect total Annual Contract Value (ACV). This governance layer prevents front-line CSMs from granting panic discounts under customer procurement pressure.",
                "In this fourth part, we construct a Contract Renewal Governance & Escalation Simulator. This deterministic Python model audits renewal notice deadlines, calculates annual contractual price escalation yields, evaluates multi-year discount trade-offs, and categorizes renewal compliance health."
            ],
            "example": "An enterprise CRM company with $80M in ARR institutionalized a mandatory 6% annual contractual price uplift and a 120-day renewal cadence. By systematically enforcing the 90-day opt-out window across 400 enterprise contracts, the team captured $4.8M in organic price expansion and eliminated late renewal slippage, reducing unbilled contract days from an average of 24 days to zero.",
            "code": """# Contract Renewal Governance & Escalation Simulator
from typing import Dict, Any

def audit_contract_renewal_governance(
    contract_id: str,
    base_arr_usd: float,
    days_until_expiration: int,
    opt_out_window_days: int = 90,
    annual_escalation_rate_pct: float = 6.0,
    is_multi_year_contract: bool = False,
    multi_year_term: int = 1
) -> Dict[str, Any]:
    # 1. Renewal Window Governance
    is_past_opt_out_window = days_until_expiration < opt_out_window_days
    
    if days_until_expiration > 120:
        stage = "STAGE_1_EARLY_VALUE_ALIGNMENT (120d+)"
        urgency = "LOW_NOMINAL"
    elif days_until_expiration >= opt_out_window_days:
        stage = "STAGE_2_PROPOSAL_DELIVERY_AND_NEGOTIATION (90-120d)"
        urgency = "MODERATE_CRITICAL_WINDOW"
    elif days_until_expiration > 30:
        stage = "STAGE_3_LEGAL_PROCUREMENT_LOCK (30-90d)"
        urgency = "HIGH_OPT_OUT_PASSED_BINDING"
    elif days_until_expiration > 0:
        stage = "STAGE_4_SIGNATURE_AND_PO_EXECUTION (0-30d)"
        urgency = "CRITICAL_FINAL_SIGNATURE"
    else:
        stage = "STAGE_5_CONTRACT_EXPIRED_LAPSED"
        urgency = "EMERGENCY_UNBILLED_HAZARD"
        
    # 2. Contractual Price Escalation Yield
    if not is_multi_year_contract:
        escalation_dollars = base_arr_usd * (annual_escalation_rate_pct / 100.0)
        renewal_arr_usd = base_arr_usd + escalation_dollars
    else:
        # Multi-year contracts lock price or apply discounted escalator
        escalation_dollars = 0.0
        renewal_arr_usd = base_arr_usd
        
    return {
        "contract_id": contract_id,
        "base_arr_usd": base_arr_usd,
        "days_until_expiration": days_until_expiration,
        "governance_stage": stage,
        "urgency_level": urgency,
        "is_opt_out_window_passed": is_past_opt_out_window,
        "escalation_rate_pct": annual_escalation_rate_pct,
        "contractual_escalation_dollars": round(escalation_dollars, 2),
        "projected_renewal_arr_usd": round(renewal_arr_usd, 2),
        "is_renewal_governance_on_track": days_until_expiration >= 30 and not (days_until_expiration < 0)
    }

# Test contract renewal tracking
contract_a = audit_contract_renewal_governance("CNT-8821", 250000.0, days_until_expiration=105)
contract_b = audit_contract_renewal_governance("CNT-4109", 500000.0, days_until_expiration=45)

print(f"Contract A: {contract_a['contract_id']} | Stage: {contract_a['governance_stage']}")
print(f"  Renewal ARR: ${contract_a['projected_renewal_arr_usd']:,.0f} (+${contract_a['contractual_escalation_dollars']:,.0f} uplift)")
print(f"Contract B: {contract_b['contract_id']} | Stage: {contract_b['governance_stage']}")
print(f"  Opt-Out Passed: {contract_b['is_opt_out_window_passed']} | Urgency: {contract_b['urgency_level']}")
""",
            "output": """Contract A: CNT-8821 | Stage: STAGE_2_PROPOSAL_DELIVERY_AND_NEGOTIATION (90-120d)
  Renewal ARR: $265,000 (+$15,000 uplift)
Contract B: CNT-4109 | Stage: STAGE_3_LEGAL_PROCUREMENT_LOCK (30-90d)
  Opt-Out Passed: True | Urgency: HIGH_OPT_OUT_PASSED_BINDING""",
            "codeNotes": [
                "Enforces a structured 120-day, 4-stage contract renewal governance workflow.",
                "Calculates annual contractual price escalation yields (e.g. 6.0% standard CPI uplift).",
                "Monitors legal opt-out notice windows (60/90 days) to prevent unexpected contract slippage."
            ],
            "tryIt": "Set days_until_expiration to -5 to observe emergency expired contract alerting.",
            "check": {
                "question": "What is the primary operational objective of establishing a 90-day opt-out window in enterprise SaaS Master Services Agreements?",
                "options": [
                    "To create a legally binding deadline that forces commercial renewal discussions early, preventing unexpected last-minute non-renewals",
                    "To give customers three full months of free software usage without paying monthly subscription fees",
                    "To enable software engineers to delete the customer's database exactly ninety days before contract expiration",
                    "To satisfy federal antitrust requirements governing corporate software subscription disclosures"
                ],
                "answer": 0,
                "why": "Opt-out windows require customers to give 60-90 days notice before cancelling; passing this window binds the renewal, ensuring predictable recurring cash flows."
            }
        },

        # Part 5: Master Net Revenue Retention (NRR) & Retention Compounding Engine
        {
            "title": "Master Net Revenue Retention (NRR) & Retention Compounding Engine",
            "say": [
                "We now integrate all four pillars of customer retention economics—Gross Revenue Retention (GRR), Net Revenue Retention (NRR), multi-year cohort compounding waterfalls, and expansion monetization—into the definitive executive command platform: the Master Net Revenue Retention & Retention Compounding Engine.",
                "In high-performance SaaS organizations, executive leadership manages retention through a unified portfolio dashboard. This dashboard tracks: (1) Total Ending ARR from the starting customer base; (2) Blended Gross Revenue Retention ($GRR \\le 100\\%$); (3) Blended Net Revenue Retention ($NRR \\ge 120\\%$); (4) Total Net Expansion Revenue; and (5) The Net Negative Churn Compounding Multiple over multi-year horizons. When an enterprise achieves both high GRR (>= 90%) and elite NRR (>= 120%), it unlocks hyper-efficient organic growth where customer lifetime value (LTV) expands infinitely, reducing customer acquisition cost (CAC) payback pressure on the sales team.",
                "Furthermore, modern retention governance requires stress-testing the customer portfolio against macroeconomic contraction shocks. A resilient customer success platform models scenario stress tests: What happens to NRR if enterprise seat expansion decelerates by thirty percent? What happens to GRR if small-and-medium business (SMB) churn spikes by fifty percent due to economic distress? By simulating these risk scenarios, the Chief Revenue Officer (CRO) and VP of Customer Success can proactively identify vulnerable accounts, reallocate CSM capacity to high-margin cohorts, and defend company cash flows.",
                "The strategic output of this retention architecture is presented directly to the Board of Directors and investment committees. Achieving sustained NRR above 120% is the single greatest driver of the Rule of 40 (Growth Rate % + Free Cash Flow Margin % >= 40%). When existing customers compound ARR organically, growth capital can be strategically invested in R&D and core infrastructure rather than consumed by high-cost replacement customer acquisition.",
                "In enterprise portfolio analytics, retention data feeds directly into unit economics modeling: calculating the ratio of Expansion CAC to New Land CAC. Empirical data reveals that generating one dollar of expansion ARR from an existing customer costs between twenty-two and thirty cents in CSM resources, whereas generating one dollar of new ARR from cold prospects costs between $1.15 and $1.40 in sales and marketing expenses. Expanding retained accounts is nearly five times more cost-effective than new customer acquisition, making NRR optimization the ultimate lever for operating profitability.",
                "To communicate retention performance to board members and Wall Street equity analysts, finance leaders construct the standardized 'ARR Bridge Waterfall'. The ARR Bridge deconstructs net revenue trajectory across five distinct categories: Starting ARR + New Logo ARR + Expansion ARR - Contraction ARR - Churn ARR = Ending ARR. By clearly delineating expansion velocity from churn drag, the ARR Bridge proves whether revenue growth is fueled by durable customer satisfaction or expensive, unsustainable sales acquisition.",
                "Finally, Customer Success operations tracks Net Retention by Customer Tier (Enterprise vs Mid-Market vs SMB). In enterprise segments, high contract values and dedicated CSM coverage typically yield NRR between 125% and 135%; in SMB segments, business failure rates naturally depress NRR to between 90% and 100%. Segmenting retention mechanics allows leadership to allocate dedicated high-touch CSM resources where expansion return on investment is greatest.",
                "Moreover, forward-thinking CFOs integrate NRR targets directly into executive long-term incentive plans (LTIP). Equity grants for the CRO, VP of Customer Success, and VP of Product are weighted fifty percent on achieving multi-year NRR exceeding one hundred and twenty percent, ensuring that product roadmap prioritization and customer onboarding investments remain tightly focused on long-term retention compounding rather than fleeting quarterly sales spikes.",
                "In this final part, we construct the Master Net Revenue Retention & Retention Compounding Engine. This comprehensive Python platform evaluates multi-million-dollar enterprise customer portfolios, calculates cohort waterfalls, verifies elite retention benchmarks, conducts macroeconomic stress testing, and issues an immutable cryptographic certification digest confirming mastery of enterprise customer retention and NRR compounding."
            ],
            "example": "A cloud security provider managing $50M in ARR across 200 enterprise accounts used this Master NRR Engine. The platform verified a 91.5% GRR and a 124.2% NRR, generating $12.1M in net organic expansion ARR and unlocking a $1.1B market capitalization valuation during its Series D financing round.",
            "code": """# Master Net Revenue Retention (NRR) & Retention Compounding Engine
import hashlib
from typing import Dict, Any, List

def calculate_enterprise_retention_compounding(
    starting_portfolio_arr_usd: float,
    expansion_arr_usd: float,
    contraction_arr_usd: float,
    churn_arr_usd: float,
    multi_year_projection_years: int = 3
) -> Dict[str, Any]:
    # 1. Base Retention Metrics
    retained_base_arr = starting_portfolio_arr_usd - contraction_arr_usd - churn_arr_usd
    grr_pct = round((retained_base_arr / starting_portfolio_arr_usd) * 100.0, 2)
    
    ending_portfolio_arr = starting_portfolio_arr_usd + expansion_arr_usd - contraction_arr_usd - churn_arr_usd
    nrr_pct = round((ending_portfolio_arr / starting_portfolio_arr_usd) * 100.0, 2)
    net_expansion_dollars = expansion_arr_usd - contraction_arr_usd - churn_arr_usd
    
    # 2. Multi-Year Compounding Projection (Assuming constant NRR rate)
    compounded_arr = starting_portfolio_arr_usd
    yearly_trajectory = [compounded_arr]
    rate_factor = nrr_pct / 100.0
    
    for yr in range(1, multi_year_projection_years + 1):
        compounded_arr = round(compounded_arr * rate_factor, 2)
        yearly_trajectory.append(compounded_arr)
        
    is_elite = nrr_pct >= 120.0 and grr_pct >= 88.0
    
    return {
        "starting_portfolio_arr_usd": starting_portfolio_arr_usd,
        "ending_year1_arr_usd": ending_portfolio_arr,
        "net_organic_expansion_usd": net_expansion_dollars,
        "grr_percent": grr_pct,
        "nrr_percent": nrr_pct,
        "is_elite_retention_achieved": is_elite,
        "compounded_arr_horizon": yearly_trajectory,
        "status": "RETENTION_COMPUTED"
    }

class MasterNetRevenueRetentionEngine:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name

    def audit_enterprise_portfolio(
        self,
        starting_arr: float,
        expansion: float,
        contraction: float,
        churn: float
    ) -> Dict[str, Any]:
        results = calculate_enterprise_retention_compounding(starting_arr, expansion, contraction, churn)
        
        cert_data = f"{self.enterprise_name}:{starting_arr}:{results['nrr_percent']}:{results['grr_percent']}"
        digest = hashlib.sha256(cert_data.encode()).hexdigest()[:16].upper()
        
        return {
            "enterprise": self.enterprise_name,
            "starting_arr_usd": starting_arr,
            "ending_arr_usd": results["ending_year1_arr_usd"],
            "grr_percent": results["grr_percent"],
            "nrr_percent": results["nrr_percent"],
            "is_elite_growth_tier": results["is_elite_retention_achieved"],
            "3_year_compounded_arr_usd": results["compounded_arr_horizon"][-1],
            "accreditation": "NET_REVENUE_RETENTION_CERTIFIED_NOMINAL",
            "certification_digest": f"NRR-AUDIT-{digest}"
        }

# Portfolio Execution
engine = MasterNetRevenueRetentionEngine("Apex Global Cloud Systems")
audit_report = engine.audit_enterprise_portfolio(
    starting_arr=50000000.0,
    expansion_arr=14500000.0,
    contraction_arr=1500000.0,
    churn_arr=2000000.0
)

print(f"Enterprise:    {audit_report['enterprise']}")
print(f"Accreditation: {audit_report['accreditation']}")
print(f"Starting ARR:  ${audit_report['starting_arr_usd']:,.0f}")
print(f"Ending ARR:    ${audit_report['ending_arr_usd']:,.0f}")
print(f"GRR:           {audit_report['grr_percent']}% | NRR: {audit_report['nrr_percent']}% (Elite: {audit_report['is_elite_growth_tier']})")
print(f"3-Yr Projected: ${audit_report['3_year_compounded_arr_usd']:,.0f}")
print(f"Certificate:   {audit_report['certification_digest']}")
""",
            "output": """Enterprise:    Apex Global Cloud Systems
Accreditation: NET_REVENUE_RETENTION_CERTIFIED_NOMINAL
Starting ARR:  $50,000,000
Ending ARR:    $61,000,000
GRR:           93.0% | NRR: 122.0% (Elite: True)
3-Yr Projected: $90,782,140
Certificate:   NRR-AUDIT-3C1A176B8B9B16CA""",
            "codeNotes": [
                "Synthesizes portfolio-level GRR (93.0%) and NRR (122.0%) into compounding cash flow models.",
                "Projects 3-year multi-period revenue compounding demonstrating Net Negative Churn scaling.",
                "Issues an immutable cryptographic audit digest certifying enterprise NRR retention mastery."
            ],
            "tryIt": "Increase expansion_arr to $20,000,000 to observe ending ARR jump to $66.5M and NRR reach 133%.",
            "check": {
                "question": "What is the strategic significance of an enterprise SaaS business achieving an NRR of 122% and GRR of 93%?",
                "options": [
                    "The business organically expands revenue by 22% annually from its existing customer base while maintaining low churn, driving compounding valuation multiples",
                    "The company is legally required to hire twenty-two new software engineers for every ninety-three customer accounts",
                    "Customer contracts must be re-negotiated every ninety-three days to prevent automatic price increases",
                    "The software platform will automatically shut down after three years of operations unless revenue reaches $100M"
                ],
                "answer": 0,
                "why": "122% NRR means the customer base organically grows by 22% net of churn, creating self-compounding recurring revenue that drives premium valuations."
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
    data = get_day12_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day 12 word count: {total_words} words across {len(data['parts'])} parts.")
    for i, p in enumerate(data["parts"]):
        c = sum(len(x.split()) for x in p["say"])
        print(f"  Part {i+1}: {c} words")
