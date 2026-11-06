"""
Day 24 Builder: Marketing Mix Modeling (MMM) & Incrementality Geo-Testing
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 5
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day24_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 24,
        "title": "Marketing Mix Modeling (MMM) & Incrementality Geo-Testing Architecture",
        "funnelSteps": [
            {
                "step": "TOP_DOWN_MMM_REGRESSION",
                "label": "Econometric Time-Series Decomposition (Base vs Media Sales)",
                "metric": "Base: $450k / Media: $225k",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "ADSTOCK_AND_SATURATION",
                "label": "Adstock Carryover Decay (Theta=0.50) & Hill Saturation",
                "metric": "Diminishing Returns Modeled",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "GEO_LIFT_EXPERIMENTATION",
                "label": "Synthetic Counterfactual Geo-Testing & Regional Control",
                "metric": "+$35k Lift (+21.21%)",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "CAUSAL_IROAS_GOVERNANCE",
                "label": "Incremental ROAS (iROAS) vs Platform-Reported Cannibalization",
                "metric": "Causal iROAS: 2.33x",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "ENTERPRISE_MMM_GATEWAY",
                "label": "Institutional Econometric Modeling & Causal Science Gateway",
                "metric": "100.0/100 EMGI Certified",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "Baseline Organic Sales", "value": "$450,000/Wk"},
            {"label": "Adstock Half-Life (Theta)", "value": "0.50 Decay"},
            {"label": "Geo-Lift Incremental Lift", "value": "+$35,000.00"},
            {"label": "True Causal iROAS", "value": "2.33x"}
        ]
    }

def build_day24_lesson() -> dict:
    p1_code = r'''def simulate_top_down_mmm_regression(weekly_records: list) -> dict:
    """
    Simulates top-down econometric Marketing Mix Modeling (MMM) regression:
    Decomposes total sales into Unpromoted Baseline Sales and Paid Media Lift.
    """
    total_sales = sum(r["sales"] for r in weekly_records)
    total_base = sum(r["base_sales"] for r in weekly_records)
    total_media_lift = total_sales - total_base
    media_contribution_pct = round((total_media_lift / total_sales) * 100, 1)
    
    avg_weekly_sales = round(total_sales / len(weekly_records), 2)
    avg_base_sales = round(total_base / len(weekly_records), 2)
    avg_media_sales = round(total_media_lift / len(weekly_records), 2)
    
    return {
        "weeks_analyzed": len(weekly_records),
        "total_revenue": total_sales,
        "unpromoted_base_revenue": total_base,
        "paid_media_incremental_revenue": total_media_lift,
        "marketing_contribution_pct": media_contribution_pct,
        "avg_weekly_base_sales": avg_base_sales,
        "avg_weekly_media_sales": avg_media_sales,
        "status": "MMM_DECOMPOSITION_COMPLETE"
    }

if __name__ == "__main__":
    records = [
        {"week": 1, "sales": 650000.0, "base_sales": 440000.0},
        {"week": 2, "sales": 680000.0, "base_sales": 450000.0},
        {"week": 3, "sales": 700000.0, "base_sales": 460000.0},
        {"week": 4, "sales": 670000.0, "base_sales": 450000.0}
    ]
    res = simulate_top_down_mmm_regression(records)
    print("Top-Down Marketing Mix Modeling (MMM) Decomposition Report:")
    print(f"  Weeks Analyzed: {res['weeks_analyzed']}")
    print(f"  Total Sales Revenue: ${res['total_revenue']:,.2f}")
    print(f"  Unpromoted Organic Base: ${res['unpromoted_base_revenue']:,.2f} (Avg ${res['avg_weekly_base_sales']:,.2f}/wk)")
    print(f"  Paid Media Driven Lift: ${res['paid_media_incremental_revenue']:,.2f} (Avg ${res['avg_weekly_media_sales']:,.2f}/wk)")
    print(f"  Marketing Revenue Contribution: {res['marketing_contribution_pct']}%")
    print(f"  Status: {res['status']}")
'''

    p2_code = r'''def calculate_adstock_and_saturation(spends: list, theta: float, half_saturation_k: float) -> list:
    """
    Computes Adstock Carryover Decay (Theta) and Diminishing Marginal Returns (Hill Saturation):
    Adstock_t = Spend_t + Theta * Adstock_{t-1}
    Effective_Output_t = (Adstock_t) / (half_saturation_k + Adstock_t)
    """
    adstocked = []
    prev_adstock = 0.0
    
    results = []
    for week_idx, spend in enumerate(spends, start=1):
        current_adstock = spend + (theta * prev_adstock)
        prev_adstock = current_adstock
        
        # Hill saturation curve response (0.0 to 1.0)
        saturation_response = current_adstock / (half_saturation_k + current_adstock)
        effective_sales_index = round(saturation_response * 100.0, 2)
        
        results.append({
            "week": week_idx,
            "raw_spend": spend,
            "adstock_carryover": round(current_adstock, 2),
            "saturation_response_pct": effective_sales_index
        })
        
    return results

if __name__ == "__main__":
    spend_schedule = [10000.0, 20000.0, 30000.0, 15000.0]
    res = calculate_adstock_and_saturation(spends=spend_schedule, theta=0.50, half_saturation_k=25000.0)
    print("Adstock Carryover & Hill Saturation Curve Analysis:")
    for r in res:
        print(f"  Week {r['week']}: Spend ${r['raw_spend']:,} -> Adstock: ${r['adstock_carryover']:,} | Saturation Output: {r['saturation_response_pct']}%")
'''

    p3_code = r'''def evaluate_geo_lift_experiment(t_pre: float, t_post: float, c_pre: float, c_post: float, test_spend: float) -> dict:
    """
    Evaluates regional Geo-Lift Experimentation using synthetic counterfactual controls:
    Counterfactual = Treated_Pre * (Control_Post / Control_Pre)
    Incremental Lift = Treated_Post - Counterfactual
    iROAS = Incremental Lift / Test Ad Spend
    """
    control_growth_rate = c_post / c_pre
    synthetic_counterfactual = round(t_pre * control_growth_rate, 2)
    incremental_lift_dollars = round(t_post - synthetic_counterfactual, 2)
    incremental_lift_pct = round((incremental_lift_dollars / synthetic_counterfactual) * 100, 2)
    iroas = round(incremental_lift_dollars / test_spend, 2)
    
    status = "GEO_LIFT_SIGNIFICANT" if iroas >= 1.5 else "MARGINAL_INCREMENTALITY"
    
    return {
        "control_pre": c_pre,
        "control_post": c_post,
        "treated_pre": t_pre,
        "treated_post": t_post,
        "synthetic_counterfactual": synthetic_counterfactual,
        "incremental_lift_dollars": incremental_lift_dollars,
        "incremental_lift_pct": incremental_lift_pct,
        "incremental_roas": iroas,
        "status": status
    }

if __name__ == "__main__":
    res = evaluate_geo_lift_experiment(
        t_pre=150000.0,
        t_post=200000.0,
        c_pre=100000.0,
        c_post=110000.0,
        test_spend=15000.0
    )
    print("Geo-Lift Experimentation & Synthetic Control Report:")
    print(f"  Control Market: Pre ${res['control_pre']:,.2f} -> Post ${res['control_post']:,.2f} (+10.0% Macro Trend)")
    print(f"  Treated Market: Pre ${res['treated_pre']:,.2f} -> Post ${res['treated_post']:,.2f}")
    print(f"  Synthetic Counterfactual (Expected without Ads): ${res['synthetic_counterfactual']:,.2f}")
    print(f"  Causal Incremental Sales Lift: ${res['incremental_lift_dollars']:,.2f} (+{res['incremental_lift_pct']}%)")
    print(f"  Causal Incremental ROAS (iROAS): {res['incremental_roas']}x")
    print(f"  Experiment Verdict: {res['status']}")
'''

    p4_code = r'''def calculate_incremental_roas(channels: list) -> list:
    """
    Audits Causal Incrementality vs Platform-Reported ROAS:
    Calculates True Incremental Revenue = Reported Revenue * Incrementality %
    Calculates True iROAS = Incremental Revenue / Ad Spend
    Identifies brand search cannibalization and recommends budget reallocation.
    """
    results = []
    for ch in channels:
        reported_rev = ch["spend"] * ch["reported_roas"]
        incremental_rev = round(reported_rev * (ch["incrementality_pct"] / 100.0), 2)
        iroas = round(incremental_rev / ch["spend"], 2)
        
        is_cannibalizing = ch["incrementality_pct"] < 30.0
        recommendation = "REALLOCATE_BUDGET_AWAY" if is_cannibalizing else "SCALE_OR_MAINTAIN"
        
        results.append({
            "channel": ch["name"],
            "spend": ch["spend"],
            "reported_roas": ch["reported_roas"],
            "reported_revenue": reported_rev,
            "incrementality_pct": ch["incrementality_pct"],
            "incremental_revenue": incremental_rev,
            "true_iroas": iroas,
            "recommendation": recommendation
        })
    return results

if __name__ == "__main__":
    channels = [
        {"name": "Google Brand Search", "spend": 10000.0, "reported_roas": 10.0, "incrementality_pct": 15.0},
        {"name": "Google Non-Brand Search", "spend": 25000.0, "reported_roas": 3.0, "incrementality_pct": 80.0},
        {"name": "Meta Social Video", "spend": 20000.0, "reported_roas": 2.5, "incrementality_pct": 75.0}
    ]
    print("Causal Incrementality vs Platform ROAS Audit:")
    for r in calculate_incremental_roas(channels):
        print(f"  {r['channel']}: Spend ${r['spend']:,} | Reported ROAS {r['reported_roas']}x -> True iROAS: {r['true_iroas']}x ({r['recommendation']})")
'''

    p5_code = r'''def audit_enterprise_mmm_gateway(
    top_down_mmm_ok: bool,
    adstock_saturation_ok: bool,
    geo_lift_experiment_ok: bool,
    causal_iroas_ok: bool
) -> dict:
    """
    Enterprise Econometric MMM & Geo-Lift Gateway: Integrates top-down time-series
    econometrics, adstock decay kinetics, synthetic control geo-testing, and causal iROAS.
    """
    all_nominal = top_down_mmm_ok and adstock_saturation_ok and geo_lift_experiment_ok and causal_iroas_ok
    score = 100.0 if all_nominal else 70.0
    verdict = "ECONOMETRIC_MMM_AND_INCREMENTALITY_ARCHITECT_CERTIFIED" if all_nominal else "MMM_INCREMENTALITY_DEFECT"
    
    return {
        "top_down_mmm_active": top_down_mmm_ok,
        "adstock_saturation_active": adstock_saturation_ok,
        "geo_lift_testing_active": geo_lift_experiment_ok,
        "causal_iroas_governance_active": causal_iroas_ok,
        "emgi_score": score,
        "certification": verdict,
        "status": "ENTERPRISE_ECONOMETRICS_NOMINAL" if all_nominal else "CALIBRATION_REQUIRED"
    }

if __name__ == "__main__":
    gateway = audit_enterprise_mmm_gateway(
        top_down_mmm_ok=True,
        adstock_saturation_ok=True,
        geo_lift_experiment_ok=True,
        causal_iroas_ok=True
    )
    print("Enterprise Econometric MMM & Geo-Lift Gateway Report:")
    print(f"  Top-Down MMM Active: {gateway['top_down_mmm_active']}")
    print(f"  Adstock & Saturation Active: {gateway['adstock_saturation_active']}")
    print(f"  Geo-Lift Testing Active: {gateway['geo_lift_testing_active']}")
    print(f"  Causal iROAS Governance Active: {gateway['causal_iroas_governance_active']}")
    print(f"  Composite EMGI Score: {gateway['emgi_score']} / 100.0")
    print(f"  Accreditation Verdict: {gateway['certification']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 24,
        "title": "Marketing Mix Modeling (MMM) & Incrementality Geo-Testing Architecture",
        "goal": "Master econometric measurement science: Top-down Marketing Mix Modeling (MMM), adstock carryover half-life decay, Hill saturation curves, synthetic control geo-lift experimentation, and causal incremental ROAS (iROAS).",
        "minutes": 35,
        "recap": "Day 24 elevates measurement above cookie-dependent tracking. Learn to decompose time-series sales into unpromoted base demand and media lift, model diminishing marginal adstock returns, run randomized regional geo-holdouts, and optimize media budgets against true causal incrementality.",
        "parts": [
            {
                "title": "Marketing Mix Modeling (MMM) Foundations: Top-Down Econometric Regression",
                "say": [
                    "Welcome to Day 24 of Digital Marketing Analytics and Performance Strategy. Today, we confront the gold standard of macro-level marketing measurement: Marketing Mix Modeling (MMM) and Regional Incrementality Geo-Testing. Over the past decade, digital marketers grew dangerously reliant on bottom-up deterministic tracking—relying on third-party tracking pixels, click cookies, and device identifiers (such as Apple's IDFA) to trace individual user journeys.",
                    "However, global privacy regulations (GDPR, CCPA, DPDP Act 2023), Apple's App Tracking Transparency (ATT), and the systematic deprecation of third-party cookies in web browsers have permanently dismantled deterministic click tracking. Bottom-up attribution platforms are blind to offline purchases, upper-funnel TV and billboard campaigns, cross-device switching, and view-through impressions. To establish definitive, unassailable measurement, elite enterprises have returned to econometric Marketing Mix Modeling.",
                    "Marketing Mix Modeling is a top-down statistical methodology that utilizes multivariate time-series regression to estimate the relationship between marketing expenditures and business outcomes (such as total sales revenue, new customer volume, or market share). Crucially, MMM does not require tracking individual users, cookies, or personal data; it operates entirely on aggregate, time-stamped macroeconomic and media data.",
                    "In an enterprise MMM specification, the dependent variable ($Y_t$) is total weekly enterprise sales. The independent variables include: Paid Media Spend across channels (Google Search, Meta Social, YouTube, TV, Digital Out-of-Home), Macroeconomic Controls (consumer price index, interest rates, seasonal weather variations), Baseline Organic Demand (brand equity, unpromoted baseline sales), and Promotional Price Discounts. The econometric model decomposes total weekly revenue into two distinct components: Base Sales (revenue that would occur naturally without marketing) and Incremental Media Lift.",
                    "In our institutional Python simulation for Part 1, we implement a top-down MMM time-series regression decomposition. The system evaluates weekly revenue against unpromoted baseline demand, isolating media-driven lift and quantifying marketing's true contribution percentage to the corporate top line. Examine the code below to see econometric MMM decomposition in action."
                ],
                "example": "Enterprise Case Study: A national retail chain generating $35M in annual sales previously relied on Meta and Google ad manager dashboards, which collectively claimed credit for $42M in revenue—an obvious mathematical impossibility caused by platform double-counting. The enterprise deployed an open-source Bayesian MMM engine (such as Google Meridian or Meta Robyn). The econometric model proved that $24M of sales was baseline unpromoted brand equity that occurred regardless of media spend, while paid advertising truly drove $11M in incremental revenue, eliminating multi-platform reporting illusions.",
                "code": p1_code,
                "output": "Top-Down Marketing Mix Modeling (MMM) Decomposition Report:\n  Weeks Analyzed: 4\n  Total Sales Revenue: $2,700,000.00\n  Unpromoted Organic Base: $1,800,000.00 (Avg $450,000.00/wk)\n  Paid Media Driven Lift: $900,000.00 (Avg $225,000.00/wk)\n  Marketing Revenue Contribution: 33.3%\n  Status: MMM_DECOMPOSITION_COMPLETE",
                "codeNotes": [
                    "Decomposes aggregate weekly sales ($2.7M) into baseline organic revenue ($1.8M) and paid media lift ($900k).",
                    "Calculates average unpromoted baseline sales ($450,000/week), representing organic brand momentum independent of ads.",
                    "Determines true marketing revenue contribution (33.3%), providing unassailable aggregate truth without third-party cookies."
                ],
                "tryIt": "Increase weekly sales to $800,000 across all 4 weeks and observe how paid media driven lift expands to $1.4M (43.8% contribution).",
                "check": {
                    "question": "What makes Marketing Mix Modeling (MMM) completely immune to third-party cookie deprecation and iOS privacy tracking restrictions?",
                    "options": [
                        "MMM operates on aggregate time-series sales and spend data without tracking individual user identities or cookies.",
                        "MMM hacks into mobile operating systems to read encrypted WhatsApp messages.",
                        "MMM replaces digital marketing with newspaper advertisements exclusively.",
                        "MMM guarantees that all ad clicks are stored in government tax databases."
                    ],
                    "answer": 0,
                    "why": "Because MMM uses aggregate macro-level time-series regression rather than user-level tracking pixels, it is 100% privacy-compliant and immune to cookie deprecation."
                }
            },
            {
                "title": "Diminishing Marginal Returns, Adstock Decay & Hill Saturation Curves",
                "say": [
                    "A naive linear regression assumes that if spending $10,000 on Google Search produces $50,000 in sales, then spending $1,000,000 will produce $5,000,000 in sales. In the physical reality of digital advertising, this assumption is catastrophically false. Advertising is governed by two fundamental non-linear physical phenomena: Advertising Adstock (Memory Carryover) and Diminishing Marginal Returns (Saturation).",
                    "First, Advertising Adstock accounts for the fact that the psychological impact of an ad impression does not vanish the second the user scrolls past. It lingers in consumer memory and decays over time. Adstock is modeled mathematically as a geometric decay function: $\\text{Adstock}_t = \\text{Spend}_t + (\\theta \\times \\text{Adstock}_{t-1})$, where $\\theta \\in [0, 1]$ represents the memory retention parameter (half-life). A TV ad or YouTube brand video might have a high carryover parameter ($\\theta = 0.70$), exerting sales influence for weeks, whereas a search ad has a rapid decay ($\\theta = 0.15$).",
                    "Second, Diminishing Marginal Returns dictates that as media spend increases within a target audience, each additional dollar yields progressively fewer incremental sales. The audience experiences ad fatigue, and the platform runs out of high-intent prospects, forcing bids onto marginal users. Econometricians model this saturation through the Hill Function or S-Curve: $\\text{Response} = \\frac{\\text{Adstock}^S}{K^S + \\text{Adstock}^S}$, where $K$ represents the half-saturation spend threshold.",
                    "When media spend is low, the saturation curve exhibits rapid acceleration. However, as cumulative adstock approaches and exceeds the saturation constant $K$, the marginal return on ad spend flattens. Pushing additional spend into a saturated channel burns capital with negligible revenue lift. Growth data scientists use these saturation equations to calculate the exact optimal spend ceiling for each marketing channel.",
                    "In our institutional Python simulation for Part 2, we implement Adstock Carryover Decay and the Hill Saturation Response Engine. The system processes a 4-week media spend schedule, calculates cumulative carryover adstock with $\\theta = 0.50$, and evaluates the non-linear saturation output percentage. Review the code below to see adstock decay and saturation modeling execute deterministically."
                ],
                "example": "Enterprise Case Study: A direct-to-consumer home furnishings brand spent $50,000/week on Meta Ads and achieved a 4.0x ROAS. Eager to grow, executive leadership tripled the budget to $150,000/week. Instead of tripling sales, revenue only increased by 22%, and ROAS collapsed to 1.6x. An econometric adstock analysis revealed that the brand's Meta target audience had hit the flat plateau of the Hill saturation curve at $75,000/week. By capping Meta spend at $70,000 and shifting the remaining $80,000 into un-saturated YouTube and TikTok channels, total revenue grew by 85% at a healthy 3.2x blended ROAS.",
                "code": p2_code,
                "output": "Adstock Carryover & Hill Saturation Curve Analysis:\n  Week 1: Spend $10,000 -> Adstock: $10,000.0 | Saturation Output: 28.57%\n  Week 2: Spend $20,000 -> Adstock: $25,000.0 | Saturation Output: 50.0%\n  Week 3: Spend $30,000 -> Adstock: $42,500.0 | Saturation Output: 62.96%\n  Week 4: Spend $15,000 -> Adstock: $36,250.0 | Saturation Output: 59.18%",
                "codeNotes": [
                    "Models memory carryover using geometric decay: Adstock_t = Spend_t + (0.50 * Adstock_{t-1}).",
                    "Calculates non-linear Hill saturation response against a half-saturation threshold (K = $25,000).",
                    "Demonstrates diminishing marginal returns: Week 3 spend doubles from Week 4, but saturation output only expands from 59.18% to 62.96%."
                ],
                "tryIt": "Increase theta to 0.80 and observe how Week 4 adstock carryover rises substantially due to longer consumer memory retention.",
                "check": {
                    "question": "What does the Hill saturation curve demonstrate regarding scaling digital marketing ad spend?",
                    "options": [
                        "Beyond a specific spend threshold, each additional marketing dollar yields progressively smaller incremental sales returns due to audience saturation.",
                        "Advertising spend generates identical linear returns infinitely without limit.",
                        "Media spending should always be reduced to zero to maximize profits.",
                        "Ad platforms give 100% free ad credits once an advertiser spends $1,000,000."
                    ],
                    "answer": 0,
                    "why": "The Hill saturation curve models diminishing marginal returns: as media spend expands, high-intent prospects are exhausted, and additional impressions produce diminishing incremental sales."
                }
            },
            {
                "title": "Geo-Lift Experimentation & Synthetic Control Regions",
                "say": [
                    "While econometric MMM models provide macro-level insights, they require empirical real-world validation. In statistical science, observational regression can identify correlations, but it cannot definitively prove causality without controlled experimentation. The gold standard for validating marketing causality is Randomized Regional Incrementality Testing: Geo-Lift Experimentation.",
                    "In a Geo-Lift experiment, an enterprise divides its geographic footprint (such as Designated Market Areas in the United States, states in India, or postal regions in Europe) into two carefully matched cohorts: Treatment Regions and Control Regions. Prior to launching the experiment, data science teams conduct a 6-to-12-week pre-treatment calibration audit. Using algorithms such as Synthetic Control Modeling, the team constructs a synthetic counterfactual—a weighted combination of control regions that mirrors the pre-treatment sales trajectory of the treatment market with an $R^2 > 0.90$.",
                    "During the active test phase, marketing spend is altered in the Treatment Market (for example, ad spend is increased by 50% in Chicago and Dallas, or completely paused in Ohio and Georgia) while marketing spend in the Control Markets is maintained strictly at baseline. Because both cohorts are exposed to the same macroeconomic conditions (such as inflation, national holidays, and competitor product launches), any divergence between the actual sales in the treated market and the synthetic counterfactual represents true causal incremental impact.",
                    "Geo-Lift testing eliminates the false attribution traps that plague ad platforms. If ad spend is paused in a region and total sales revenue remains completely flat, it proves conclusively that the ad channel was generating zero incremental lift—the consumers were existing brand fans who were going to buy anyway!",
                    "In our institutional Python simulation for Part 3, we build the Regional Geo-Lift and Synthetic Counterfactual Engine. The system compares pre-treatment baseline sales and active test sales across treated and control regions, calculates the synthetic counterfactual expectation, isolates causal incremental revenue, and derives the true causal Incremental ROAS (iROAS). Examine the code below to see geo-lift experimentation execute deterministically."
                ],
                "example": "Enterprise Case Study: A nationwide fitness subscription brand spent $250,000/month on Google Brand Search. The platform claimed a 14.0x ROAS. Skeptical of causal incrementality, the CMO ran a 4-week Geo-Lift holdout test, pausing Brand Search across 15 Designated Market Areas (DMAs) representing 20% of their national footprint. In the holdout DMAs, total organic conversions and direct traffic immediately absorbed 88% of the paused paid traffic! The true causal incremental revenue was only $42,000 against $50,000 in spend—yielding an iROAS of 0.84x. The CMO immediately slashed Brand Search budgets by $180,000/month, reallocating capital to high-incrementality YouTube discovery campaigns.",
                "code": p3_code,
                "output": "Geo-Lift Experimentation & Synthetic Control Report:\n  Control Market: Pre $100,000.00 -> Post $110,000.00 (+10.0% Macro Trend)\n  Treated Market: Pre $150,000.00 -> Post $200,000.00\n  Synthetic Counterfactual (Expected without Ads): $165,000.00\n  Causal Incremental Sales Lift: $35,000.00 (+21.21%)\n  Causal Incremental ROAS (iROAS): 2.33x\n  Experiment Verdict: GEO_LIFT_SIGNIFICANT",
                "codeNotes": [
                    "Establishes a synthetic counterfactual ($165,000.00) based on control market organic growth (+10.0%).",
                    "Isolates true causal incremental sales lift ($35,000.00 or +21.21%) beyond the baseline macro trend.",
                    "Calculates causal Incremental ROAS: $35,000 lift / $15,000 test spend = 2.33x iROAS (GEO_LIFT_SIGNIFICANT)."
                ],
                "tryIt": "Change treated_post to $170,000.00 and test_spend to $20,000.00 to observe how iROAS collapses to 0.25x, triggering a MARGINAL_INCREMENTALITY alert.",
                "check": {
                    "question": "What is the primary objective of a regional Geo-Lift holdout experiment?",
                    "options": [
                        "To isolate true causal sales lift by comparing treated regions against a synthetic counterfactual control group exposed to the same macro trends.",
                        "To punish customers living in control markets by withholding customer support.",
                        "To artificially inflate click-through rates by disabling ad blockers.",
                        "To test whether courier delivery vans can drive faster in specific zip codes."
                    ],
                    "answer": 0,
                    "why": "Geo-Lift experiments measure true causality by establishing a synthetic counterfactual control group, isolating whether marketing spend drove incremental purchases that would not have occurred organically."
                }
            },
            {
                "title": "Causal Incrementality & Incremental ROAS (iROAS)",
                "say": [
                    "The ultimate deliverable of econometrics and geo-experimentation is the metric that governs enterprise capital stewardship: Causal Incrementality and Incremental Return on Ad Spend (iROAS). In digital media buying, the metric most commonly celebrated by ad agencies and platform dashboards is Platform-Reported ROAS (Return on Ad Spend = Platform Revenue / Ad Spend).",
                    "Platform-Reported ROAS is fundamentally biased because ad platforms have a direct financial incentive to claim credit for as many conversions as possible. An advertising network drops a cookie on a user who views an ad for 0.5 seconds on their social feed; when that user purchases on the website four days later, the platform claims 100% of the credit for that $200 transaction. In reality, that customer was already an existing subscriber who intended to make their monthly replenishment order.",
                    "Causal Incrementality Percentage measures the proportion of platform-reported revenue that was genuinely caused by the ad impression: $\\text{Incrementality \\%} = \\frac{\\text{Incremental Revenue Tested}}{\\text{Reported Revenue}} \\times 100\\%$. Armed with this factor, growth finance calculates True Incremental ROAS: $\\text{iROAS} = \\frac{\\text{Reported Revenue} \\times \\text{Incrementality \\%}}{\\text{Ad Spend}} = \\frac{\\text{True Incremental Revenue}}{\\text{Ad Spend}}$.",
                    "Comparing channels through the lens of iROAS completely upends traditional media buying strategies. Google Brand Search frequently displays an extraordinary 10.0x Platform ROAS. However, because its incrementality percentage is often only 10% to 15% (cannibalizing users who were searching specifically for the brand name), its true iROAS is a mediocre 1.5x. Conversely, Meta Social Video might report a modest 2.5x Platform ROAS, but with an 75% incrementality percentage, its true iROAS is 1.88x—making it far more value-accretive to corporate top-line growth than branded search!",
                    "In our institutional Python simulation for Part 4, we build the Causal Incrementality and iROAS Audit Engine. The system processes multiple marketing channels, compares platform-reported metrics against calibrated incrementality percentages, derives true iROAS, and issues automated budget reallocation directives. Review the code below to see incrementality governance execute deterministically."
                ],
                "example": "Enterprise Case Study: A direct-to-consumer footwear brand allocated $10,000/month to Brand Search (reported ROAS 10.0x, incrementality 15%, iROAS 1.5x) and $25,000/month to Non-Brand Search (reported ROAS 3.0x, incrementality 80%, iROAS 2.4x). Guided by incrementality science, the VP of Marketing reallocated $7,000 from Brand Search into Non-Brand Search. While platform-reported ROAS appeared to decrease slightly, the company's bank deposits grew by $18,400 in net new monthly revenue, proving that true iROAS is the only metric that matters.",
                "code": p4_code,
                "output": "Causal Incrementality vs Platform ROAS Audit:\n  Google Brand Search: Spend $10,000 | Reported ROAS 10.0x -> True iROAS: 1.5x (REALLOCATE_BUDGET_AWAY)\n  Google Non-Brand Search: Spend $25,000 | Reported ROAS 3.0x -> True iROAS: 2.4x (SCALE_OR_MAINTAIN)\n  Meta Social Video: Spend $20,000 | Reported ROAS 2.5x -> True iROAS: 1.88x (SCALE_OR_MAINTAIN)",
                "codeNotes": [
                    "Contrasts platform-reported ROAS against true causal incrementality across three major media channels.",
                    "Exposes Brand Search cannibalization: 10.0x reported ROAS translates to only 1.5x true iROAS at 15% incrementality.",
                    "Demonstrates that Non-Brand Search (2.4x iROAS) and Meta Social Video (1.88x iROAS) generate superior causal profit."
                ],
                "tryIt": "Increase Brand Search incrementality to 50% and observe how iROAS surges to 5.0x, reversing the recommendation to SCALE_OR_MAINTAIN.",
                "check": {
                    "question": "Why is an ad channel with a lower platform-reported ROAS sometimes superior to a channel with a very high reported ROAS?",
                    "options": [
                        "Because the lower-ROAS channel may possess high causal incrementality (driving net new customers), whereas the high-ROAS channel merely claims credit for organic brand demand.",
                        "Because advertising agencies prefer channels that lose money for tax write-offs.",
                        "Because lower-ROAS channels are guaranteed to rank higher on Google's search engine results page.",
                        "Because platform-reported ROAS is calculated in foreign currencies with unpredictable exchange rates."
                    ],
                    "answer": 0,
                    "why": "Platform-reported ROAS often reflects organic cannibalization (claiming credit for existing buyers); true causal incrementality isolates whether the ads drove net new transactions that would not have happened otherwise."
                }
            },
            {
                "title": "Enterprise Econometric MMM & Geo-Lift Gateway",
                "say": [
                    "In this concluding session of Day 24, we synthesize the disciplines of top-down econometrics, adstock decay kinetics, synthetic control experimentation, and causal iROAS into a unified institutional measurement system: the Enterprise Econometric MMM & Geo-Lift Gateway. Elite growth organizations do not rely on biased platform dashboards or blind attribution models; they operate a continuously calibrated causal intelligence loop.",
                    "The Enterprise Econometric Gateway enforces four non-negotiable measurement standards: First, top-down multivariate time-series MMM decomposition isolating baseline organic revenue from media-driven lift; Second, mathematical adstock carryover half-life modeling and Hill saturation curves preventing spend into exhausted audience segments; Third, quarterly regional Geo-Lift holdout experiments establishing synthetic counterfactual baselines; and Fourth, causal iROAS budget reallocation that dynamically re-routes capital toward channels generating authentic incremental profit.",
                    "When all four components operate in synergy, the marketing organization is fully insulated against privacy regulation changes and browser cookie deprecation, maintaining complete scientific credibility in the executive boardroom. In our institutional Python simulation for Part 5, we execute the Enterprise Econometric MMM Gateway auditor. The gateway verifies that top-down MMM, adstock saturation, geo-lift testing, and causal iROAS governance are fully active, awarding a composite Econometric & Marketing Governance Index (EMGI) score of 100.0/100 and conferring the prestigious Econometric MMM & Incrementality Architect credential. Review the code below to see this final econometric certification execute deterministically."
                ],
                "example": "Enterprise Case Study: A multinational consumer goods conglomerate deployed the Enterprise Econometric MMM Gateway across 8 global markets. By continuously calibrating top-down Bayesian MMM models with quarterly regional geo-holdout experiments, the conglomerate identified $14.2M in annual media waste across over-credited brand search and retargeting channels, reallocating that capital into high-incrementality CTV and performance video, generating an incremental $32M in audited top-line revenue.",
                "code": p5_code,
                "output": "Enterprise Econometric MMM & Geo-Lift Gateway Report:\n  Top-Down MMM Active: True\n  Adstock & Saturation Active: True\n  Geo-Lift Testing Active: True\n  Causal iROAS Governance Active: True\n  Composite EMGI Score: 100.0 / 100.0\n  Accreditation Verdict: ECONOMETRIC_MMM_AND_INCREMENTALITY_ARCHITECT_CERTIFIED",
                "codeNotes": [
                    "Integrates top-down MMM, adstock saturation kinetics, regional geo-lift testing, and causal iROAS governance.",
                    "Confirms all four econometric gates are nominal, awarding a perfect 100.0/100 composite EMGI score.",
                    "Confers official ECONOMETRIC_MMM_AND_INCREMENTALITY_ARCHITECT_CERTIFIED accreditation for corporate governance."
                ],
                "tryIt": "Set geo_lift_testing_ok to False and observe how the gateway revokes accreditation and issues a CALIBRATION_REQUIRED alert.",
                "check": {
                    "question": "Which set of practices defines an institutional-grade marketing measurement and attribution architecture?",
                    "options": [
                        "Top-down econometric MMM time-series regression, non-linear adstock saturation curves, regional geo-lift experiments, and causal iROAS governance.",
                        "Relying 100% on Meta and Google Ads Manager last-click attribution reports without validation.",
                        "Estimating marketing return on investment by surveying employees in the lunchroom.",
                        "Turning off all marketing tracking and guessing revenue impact based on intuition."
                    ],
                    "answer": 0,
                    "why": "Institutional measurement combines aggregate econometric MMM, adstock decay kinetics, randomized regional geo-testing, and causal incrementality to ensure unbiased capital allocation."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day24_lesson()
    visual = build_day24_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 24 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
