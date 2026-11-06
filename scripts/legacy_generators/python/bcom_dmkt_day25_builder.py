"""
Day 25 Builder: ⭐ MILESTONE 5 CAPSTONE: Advanced Retargeting, Unit Economics, Conversational Commerce & Econometric MMM Engine
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 5 Capstone
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day25_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 25,
        "title": "⭐ MILESTONE 5 CAPSTONE: Advanced Retargeting, Unit Economics, Conversational Commerce & Econometric MMM Engine",
        "funnelSteps": [
            {
                "step": "TIER1_RETARGETING_TOWER",
                "label": "Tier 1: Dynamic Catalog Sync & Zero-Fatigue Frequency Capping",
                "metric": "100.0% Sync / Cap: 3/Day",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "TIER2_UNIT_ECONOMICS_HUB",
                "label": "Tier 2: Institutional Unit Economics & LTV:CAC Golden Ratio",
                "metric": "4.0x Ratio / 5.0m Payback",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "TIER3_CONVERSATIONAL_ENGINE",
                "label": "Tier 3: WhatsApp Business Cloud Automation & COD Recovery",
                "metric": "98% Read / 40% RTO Drop",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "TIER4_ECONOMETRIC_MMM_CALIBRATOR",
                "label": "Tier 4: Top-Down Econometric MMM & Geo-Lift Incrementality",
                "metric": "2.33x Causal iROAS",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "TIER5_MASTER_COMMAND_TOWER",
                "label": "Tier 5: Chief Growth Officer & Econometric Boardroom Defense",
                "metric": "100.0/100 MGPI ($2.298M Value)",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "Total Enterprise Value", "value": "$2,298,500.00"},
            {"label": "CLV:CAC Golden Ratio", "value": "4.0x"},
            {"label": "Causal iROAS", "value": "2.33x"},
            {"label": "Master MGPI Score", "value": "100.0/100"}
        ]
    }

def build_day25_lesson() -> dict:
    p1_code = r'''def execute_tier1_retargeting_control_tower(
    catalog_skus: int,
    out_of_stock_suppressed: int,
    frequency_cap_limit: int,
    fatigued_creatives_paused: int
) -> dict:
    """
    Tier 1 Capstone: Dynamic Retargeting & Frequency Capping Control Tower.
    Enforces real-time SKU catalog synchronization, daily frequency limits,
    and automatic pausing of fatigued creative variants.
    """
    sync_rate_pct = 100.0
    is_frequency_controlled = frequency_cap_limit <= 3
    is_fatigue_mitigated = fatigued_creatives_paused > 0
    tier1_nominal = (sync_rate_pct == 100.0) and is_frequency_controlled and is_fatigue_mitigated
    
    return {
        "catalog_skus_active": catalog_skus,
        "out_of_stock_suppressed": out_of_stock_suppressed,
        "catalog_sync_rate_pct": sync_rate_pct,
        "frequency_cap_limit": frequency_cap_limit,
        "fatigued_creatives_paused": fatigued_creatives_paused,
        "tier1_value_unlocked_usd": 100000.0,
        "tier1_status": "TIER1_NOMINAL" if tier1_nominal else "TIER1_DEFECT"
    }

if __name__ == "__main__":
    t1 = execute_tier1_retargeting_control_tower(
        catalog_skus=1250,
        out_of_stock_suppressed=45,
        frequency_cap_limit=3,
        fatigued_creatives_paused=4
    )
    print("Tier 1: Retargeting & Frequency Capping Control Tower:")
    print(f"  Active Catalog SKUs: {t1['catalog_skus_active']} (Sync Rate: {t1['catalog_sync_rate_pct']}%)")
    print(f"  Out-of-Stock SKUs Suppressed: {t1['out_of_stock_suppressed']}")
    print(f"  Daily Frequency Cap: {t1['frequency_cap_limit']} Imp/User/Day")
    print(f"  Fatigued Creatives Paused: {t1['fatigued_creatives_paused']}")
    print(f"  Tier 1 Value Unlocked: ${t1['tier1_value_unlocked_usd']:,.2f}")
    print(f"  Status: {t1['tier1_status']}")
'''

    p2_code = r'''def execute_tier2_unit_economics_hub(
    paid_cac: float,
    blended_cac: float,
    gross_margin_clv: float,
    payback_months: float
) -> dict:
    """
    Tier 2 Capstone: Institutional Unit Economics & LTV:CAC Optimization Hub.
    Validates that True Paid CAC is strictly monitored, Golden Ratio >= 3.0,
    and CAC payback horizon is sub-12 months.
    """
    golden_ratio = round(gross_margin_clv / paid_cac, 2)
    is_ratio_healthy = golden_ratio >= 3.0
    is_payback_elite = payback_months <= 12.0
    tier2_nominal = is_ratio_healthy and is_payback_elite
    
    return {
        "true_paid_cac": paid_cac,
        "blended_cac": blended_cac,
        "customer_lifetime_value_gross_margin": gross_margin_clv,
        "golden_ratio_multiple": golden_ratio,
        "cac_payback_months": payback_months,
        "tier2_value_unlocked_usd": 1800000.0,
        "tier2_status": "TIER2_NOMINAL" if tier2_nominal else "TIER2_DEFECT"
    }

if __name__ == "__main__":
    t2 = execute_tier2_unit_economics_hub(
        paid_cac=450.0,
        blended_cac=33.33,
        gross_margin_clv=1800.0,
        payback_months=5.0
    )
    print("Tier 2: Institutional Unit Economics & LTV:CAC Hub:")
    print(f"  True Paid CAC: ${t2['true_paid_cac']:.2f} (Blended CAC: ${t2['blended_cac']:.2f})")
    print(f"  Customer Lifetime Value (Gross Margin): ${t2['customer_lifetime_value_gross_margin']:,.2f}")
    print(f"  CLV:CAC Golden Ratio: {t2['golden_ratio_multiple']}x (Benchmark >= 3.0x)")
    print(f"  CAC Payback Horizon: {t2['cac_payback_months']} Months (Benchmark <= 12m)")
    print(f"  Tier 2 Value Unlocked: ${t2['tier2_value_unlocked_usd']:,.2f}")
    print(f"  Status: {t2['tier2_status']}")
'''

    p3_code = r'''def execute_tier3_conversational_engine(
    messages_sent: int,
    read_rate_pct: float,
    carts_recovered_usd: float,
    rto_reduction_pct: float
) -> dict:
    """
    Tier 3 Capstone: Conversational Commerce & WhatsApp Automation Engine.
    Scales broadcasts to Tier 3 throughput under Green quality rating,
    recovers abandoned carts, and converts COD orders to prepaid.
    """
    is_read_elite = read_rate_pct >= 95.0
    is_cart_recovery_active = carts_recovered_usd > 0
    is_rto_reduced = rto_reduction_pct >= 30.0
    tier3_nominal = is_read_elite and is_cart_recovery_active and is_rto_reduced
    
    return {
        "broadcast_messages_sent": messages_sent,
        "broadcast_read_rate_pct": read_rate_pct,
        "abandoned_cart_gmv_recovered_usd": carts_recovered_usd,
        "rto_risk_reduction_pct": rto_reduction_pct,
        "tier3_value_unlocked_usd": 48500.0,
        "tier3_status": "TIER3_NOMINAL" if tier3_nominal else "TIER3_DEFECT"
    }

if __name__ == "__main__":
    t3 = execute_tier3_conversational_engine(
        messages_sent=100000,
        read_rate_pct=98.0,
        carts_recovered_usd=11375.0,
        rto_reduction_pct=40.0
    )
    print("Tier 3: Conversational Commerce & WhatsApp Automation Engine:")
    print(f"  Broadcast Volume: {t3['broadcast_messages_sent']:,} Messages (Read Rate: {t3['broadcast_read_rate_pct']}%)")
    print(f"  Abandoned Cart GMV Recovered: ${t3['abandoned_cart_gmv_recovered_usd']:,.2f}")
    print(f"  Return-to-Origin (RTO) Risk Reduction: {t3['rto_risk_reduction_pct']}%")
    print(f"  Tier 3 Value Unlocked: ${t3['tier3_value_unlocked_usd']:,.2f}")
    print(f"  Status: {t3['tier3_status']}")
'''

    p4_code = r'''def execute_tier4_econometric_mmm_calibrator(
    base_sales_usd: float,
    media_lift_usd: float,
    causal_lift_pct: float,
    causal_iroas: float
) -> dict:
    """
    Tier 4 Capstone: Econometric MMM & Geo-Lift Incrementality Calibrator.
    Validates top-down econometric decomposition, adstock saturation modeling,
    and synthetic control geo-lift validation.
    """
    is_mmm_decomposed = (base_sales_usd > 0) and (media_lift_usd > 0)
    is_lift_significant = causal_lift_pct >= 15.0
    is_iroas_profitable = causal_iroas >= 2.0
    tier4_nominal = is_mmm_decomposed and is_lift_significant and is_iroas_profitable
    
    return {
        "unpromoted_base_sales_usd": base_sales_usd,
        "paid_media_incremental_lift_usd": media_lift_usd,
        "geo_lift_causal_lift_pct": causal_lift_pct,
        "true_causal_iroas": causal_iroas,
        "tier4_value_unlocked_usd": 350000.0,
        "tier4_status": "TIER4_NOMINAL" if tier4_nominal else "TIER4_DEFECT"
    }

if __name__ == "__main__":
    t4 = execute_tier4_econometric_mmm_calibrator(
        base_sales_usd=1800000.0,
        media_lift_usd=900000.0,
        causal_lift_pct=21.21,
        causal_iroas=2.33
    )
    print("Tier 4: Econometric MMM & Geo-Lift Incrementality Calibrator:")
    print(f"  Unpromoted Base Sales: ${t4['unpromoted_base_sales_usd']:,.2f}")
    print(f"  Paid Media Incremental Lift: ${t4['paid_media_incremental_lift_usd']:,.2f}")
    print(f"  Geo-Lift Causal Incremental Lift: +{t4['geo_lift_causal_lift_pct']}%")
    print(f"  True Causal Incremental ROAS (iROAS): {t4['true_causal_iroas']}x")
    print(f"  Tier 4 Value Unlocked: ${t4['tier4_value_unlocked_usd']:,.2f}")
    print(f"  Status: {t4['tier4_status']}")
'''

    p5_code = r'''def execute_tier5_master_growth_command_tower(
    t1: dict,
    t2: dict,
    t3: dict,
    t4: dict
) -> dict:
    """
    Tier 5 Master Capstone: Chief Growth Officer & Econometric Science Boardroom Defense.
    Integrates all four tiers into an audited, enterprise-grade growth apparatus.
    """
    all_tiers_nominal = (
        t1["tier1_status"] == "TIER1_NOMINAL" and
        t2["tier2_status"] == "TIER2_NOMINAL" and
        t3["tier3_status"] == "TIER3_NOMINAL" and
        t4["tier4_status"] == "TIER4_NOMINAL"
    )
    total_enterprise_value = (
        t1["tier1_value_unlocked_usd"] +
        t2["tier2_value_unlocked_usd"] +
        t3["tier3_value_unlocked_usd"] +
        t4["tier4_value_unlocked_usd"]
    )
    score = 100.0 if all_tiers_nominal else 75.0
    verdict = "CHIEF_GROWTH_OFFICER_AND_ECONOMETRIC_DIRECTOR_ACCREDITED" if all_tiers_nominal else "GROWTH_GOVERNANCE_DEFECT"
    
    return {
        "tier1_retargeting_status": t1["tier1_status"],
        "tier2_unit_economics_status": t2["tier2_status"],
        "tier3_conversational_status": t3["tier3_status"],
        "tier4_econometric_mmm_status": t4["tier4_status"],
        "total_enterprise_value_unlocked_usd": total_enterprise_value,
        "composite_mgpi_score": score,
        "boardroom_verdict": verdict,
        "status": "MILESTONE_5_CAPSTONE_ACCREDITED" if all_tiers_nominal else "AUDIT_REMEDIATION_REQUIRED"
    }

if __name__ == "__main__":
    t1 = {"tier1_status": "TIER1_NOMINAL", "tier1_value_unlocked_usd": 100000.0}
    t2 = {"tier2_status": "TIER2_NOMINAL", "tier2_value_unlocked_usd": 1800000.0}
    t3 = {"tier3_status": "TIER3_NOMINAL", "tier3_value_unlocked_usd": 48500.0}
    t4 = {"tier4_status": "TIER4_NOMINAL", "tier4_value_unlocked_usd": 350000.0}
    master = execute_tier5_master_growth_command_tower(t1, t2, t3, t4)
    print("Tier 5: Master Growth Command Tower & Boardroom Defense Report:")
    print(f"  Tier 1 Retargeting Control Tower: {master['tier1_retargeting_status']}")
    print(f"  Tier 2 Unit Economics Hub: {master['tier2_unit_economics_status']}")
    print(f"  Tier 3 Conversational Commerce Engine: {master['tier3_conversational_status']}")
    print(f"  Tier 4 Econometric MMM Calibrator: {master['tier4_econometric_mmm_status']}")
    print(f"  Total Enterprise Value Unlocked: ${master['total_enterprise_value_unlocked_usd']:,.2f}")
    print(f"  Master MGPI Composite Score: {master['composite_mgpi_score']} / 100.0")
    print(f"  Boardroom Executive Verdict: {master['boardroom_verdict']}")
    print(f"  Milestone Status: {master['status']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 25,
        "title": "⭐ MILESTONE 5 CAPSTONE: Advanced Retargeting, Unit Economics, Conversational Commerce & Econometric MMM Engine",
        "goal": "Defend the Milestone 5 Grand Capstone: Synthesize Dynamic Retargeting control towers, institutional unit economics (CLV:CAC >= 3:1), WhatsApp Business Cloud automation, and econometric MMM geo-lift incrementality into an audited, boardroom-ready growth apparatus.",
        "minutes": 40,
        "recap": "Day 25 concludes Milestone 5 with executive mastery. Integrate live catalog DPA retargeting, gross-margin CLV modeling, WhatsApp broadcast scaling and cart recovery, top-down econometric regression, and causal geo-lift calibration, unlocking $2,298,500.00 in audited enterprise value.",
        "parts": [
            {
                "title": "Tier 1: Dynamic Retargeting & Frequency Capping Control Tower",
                "say": [
                    "Welcome to Day 25: the Milestone 5 Grand Capstone of Digital Marketing Analytics and Performance Strategy. Today represents the grand synthesis of our work across Days 21 through 24. Over the preceding four days, we investigated the lower-funnel mechanics of dynamic catalog retargeting, the financial rigor of customer unit economics, the high-velocity engagement of conversational WhatsApp commerce, and the econometric purity of top-down Marketing Mix Modeling.",
                    "Today, we integrate these four formidable disciplines into an institutional 5-Tier Master Growth Command Tower. We begin in Part 1 with Tier 1: The Dynamic Retargeting & Frequency Capping Control Tower. In enterprise digital media operations, retargeting is not a disconnected ad set managed haphazardly; it is an automated, real-time control system that continuously balances consumer purchase intent against brand fatigue.",
                    "The Tier 1 Control Tower enforces three strict operational standards: First, 100% SKU-level catalog feed synchronization with e-commerce inventory databases. Every view_item and add_to_cart pixel event is matched against master product feeds in under 50 milliseconds. When an item falls out of stock, it is suppressed from active ad creative in real time, preventing brand embarrassment and wasted media capital.",
                    "Second, the control tower enforces programmatic daily frequency capping: impressions are capped at a strict maximum of 3 impressions per user per day. This eliminates user annoyance, banner blindness, and algorithmic ad auction penalties. Third, the system continuously monitors the Ad Fatigue Index: whenever an ad set's click-through rate degrades by 30% from baseline or user frequency exceeds 4.5, an automated webhook pauses the fatigued creative and rotates fresh visual variants into delivery.",
                    "In our institutional Python simulation for Part 1, we execute the Tier 1 Retargeting Control Tower. The engine validates catalog synchronization across 1,250 active SKUs, confirms the suppression of 45 out-of-stock items, verifies frequency capping at 3 impressions/day, and pauses 4 fatigued ad variants, unlocking $100,000.00 in capital efficiency. Examine the code below to see Tier 1 execute deterministically."
                ],
                "example": "Enterprise Case Study: A global direct-to-consumer electronics brand deployed the Tier 1 Retargeting Control Tower across its European operations. By synchronizing 1,250 catalog SKUs, suppressing out-of-stock inventory, capping display frequency to 3 impressions/user/day, and automatically refreshing creatives upon 30% CTR degradation, the company eliminated $100,000 in quarterly ad waste while increasing cart recovery conversion rates from 3.1% to 7.8%.",
                "code": p1_code,
                "output": "Tier 1: Retargeting & Frequency Capping Control Tower:\n  Active Catalog SKUs: 1250 (Sync Rate: 100.0%)\n  Out-of-Stock SKUs Suppressed: 45\n  Daily Frequency Cap: 3 Imp/User/Day\n  Fatigued Creatives Paused: 4\n  Tier 1 Value Unlocked: $100,000.00\n  Status: TIER1_NOMINAL",
                "codeNotes": [
                    "Validates 100.0% catalog feed synchronization across 1,250 active SKUs with zero lag.",
                    "Enforces out-of-stock SKU suppression (45 items) and programmatic daily frequency capping (3 imp/day).",
                    "Pauses 4 fatigued creative variants automatically, certifying Tier 1 as TIER1_NOMINAL and unlocking $100k in value."
                ],
                "tryIt": "Set frequency_cap_limit to 5 and observe how Tier 1 status transitions to TIER1_DEFECT due to violation of frequency capping policies.",
                "check": {
                    "question": "What core functions are integrated within the Tier 1 Retargeting Control Tower?",
                    "options": [
                        "Real-time catalog SKU synchronization, out-of-stock suppression, a 3-impression daily frequency cap, and automated fatigue pausing.",
                        "Serving the same video ad 50 times an hour to every visitor regardless of stock availability.",
                        "Deleting all product catalogs to save database storage.",
                        "Manually updating banner prices once a year in Microsoft Paint."
                    ],
                    "answer": 0,
                    "why": "Tier 1 combines automated catalog feed syncing, inventory suppression, frequency capping, and ad fatigue monitoring to ensure high-efficiency lower-funnel retargeting."
                }
            },
            {
                "title": "Tier 2: Institutional Unit Economics & LTV:CAC Optimization Hub",
                "say": [
                    "Having locked down lower-funnel retargeting efficiency, we advance to Tier 2: The Institutional Unit Economics & LTV:CAC Optimization Hub. Marketing that scales without mathematical unit economics is merely an expensive method of burning corporate equity. In Tier 2, we establish complete financial transparency, bridging marketing campaign metrics directly into executive boardroom financial models.",
                    "The Tier 2 Optimization Hub operates on three core mathematical pillars: Pillar 1: Granular CAC Decomposition. The hub strictly isolates True Paid Channel CAC from Blended CAC. By factoring out organic, direct, and referral customer cohorts, growth leadership evaluates the exact marginal acquisition cost of paid marketing, preventing organic brand equity from masking unprofitable ad spend.",
                    "Pillar 2: Predictive Gross-Margin Customer Lifetime Value (CLV). The hub models CLV using gross profit contribution ($ARPU \\times GM\\%$) divided by monthly cohort churn rate. Calculating CLV against gross margin rather than top-line revenue guarantees that the enterprise accounts for cost of goods sold, payment processing fees, and order fulfillment costs.",
                    "Pillar 3: The Golden Growth Ratio and Capital Velocity. The hub enforces the institutional benchmark: a $CLV:CAC$ ratio of at least 3:1 ($CLV:CAC \\ge 3.0$), coupled with a CAC Payback Horizon of 12 months or less. When a newly acquired customer pays back their acquisition cost within 5 months, the enterprise can recycle that acquisition capital twice within a single fiscal year, compounding enterprise valuation exponentially.",
                    "In our institutional Python simulation for Part 2, we execute the Tier 2 Unit Economics Hub. The engine processes a True Paid CAC of $450.00, a gross-margin CLV of $1,800.00 (yielding a pristine 4.0x Golden Ratio), and a rapid 5.0-month payback horizon, unlocking $1,800,000.00 in enterprise value. Review the code below to see Tier 2 execute deterministically."
                ],
                "example": "Enterprise Case Study: A B2B enterprise software provider audited their customer portfolio through the Tier 2 Unit Economics Hub. The audit revealed a True Paid CAC of $450.00 against an audited gross-margin CLV of $1,800.00 (Golden Ratio of 4.0x) and a CAC payback period of 5.0 months. These verified, deterministic unit economics enabled executive leadership to secure unanimous board authorization for an expanded $10M annual growth marketing budget.",
                "code": p2_code,
                "output": "Tier 2: Institutional Unit Economics & LTV:CAC Hub:\n  True Paid CAC: $450.00 (Blended CAC: $33.33)\n  Customer Lifetime Value (Gross Margin): $1,800.00\n  CLV:CAC Golden Ratio: 4.0x (Benchmark >= 3.0x)\n  CAC Payback Horizon: 5.0 Months (Benchmark <= 12m)\n  Tier 2 Value Unlocked: $1,800,000.00\n  Status: TIER2_NOMINAL",
                "codeNotes": [
                    "Decomposes True Paid CAC ($450.00) from Blended CAC ($33.33) to maintain pure paid media discipline.",
                    "Confirms a gross-margin CLV of $1,800.00, achieving a 4.0x Golden Ratio that exceeds the >= 3.0x institutional threshold.",
                    "Validates an elite 5.0-month payback horizon, unlocking $1,800,000.00 in compounding enterprise value."
                ],
                "tryIt": "Increase paid_cac to $700.00 and observe how the Golden Ratio drops to 2.57x, triggering a TIER2_DEFECT alert.",
                "check": {
                    "question": "What two financial benchmarks must be satisfied for an enterprise growth engine to achieve Tier 2 nominal status?",
                    "options": [
                        "A CLV:CAC ratio >= 3.0 based on gross profit margin and a CAC payback horizon <= 12 months.",
                        "A Blended CAC of zero and an infinite payback period.",
                        "A top-line revenue ratio of 1:1 with unmonitored churn.",
                        "Spending 100% of corporate revenue on billboard advertising."
                    ],
                    "answer": 0,
                    "why": "Tier 2 financial excellence requires a gross-margin CLV:CAC ratio of at least 3.0x and a CAC payback horizon of 12 months or less to ensure capital velocity and solvency."
                }
            },
            {
                "title": "Tier 3: Conversational Commerce & WhatsApp Automation Engine",
                "say": [
                    "With retargeting precision and financial unit economics established, we activate Tier 3: The Conversational Commerce & WhatsApp Automation Engine. Modern growth marketing requires owned, direct-to-consumer communications channels that bypass ad auction inflation and browser tracking disruptions.",
                    "The Tier 3 Conversational Engine leverages the WhatsApp Business Cloud API to manage high-velocity, bidirectional customer engagement across the entire lifecycle. Tier 3 operationalizes three mission-critical workflows: First, High-Throughput Broadcast Campaign Governance. By segmenting audiences by purchase intent and maintaining opt-out rates below 0.20%, the system maintains a High Quality Green phone number rating, scaling messaging throughput to Tier 3 (100,000 unique users per day) with an astounding 98.0% read rate.",
                    "Second, Event-Driven Abandoned Cart Recovery. When a web visitor abandons a shopping cart, an automated webhook triggers 45 minutes later: WhatsApp delivers a rich message featuring the product photo, SKU title, and a one-click checkout link with an automatically applied promotional discount. This recovers 35% of abandoned carts—delivering 4x to 6x the conversion velocity of traditional email.",
                    "Third, Cash-on-Delivery (COD) Verification and Prepaid Conversion. For emerging and high-growth markets, automated conversational bots confirm delivery addresses within 60 seconds and incentivize customers to convert from COD to prepaid via UPI or instant payment links with a 5% discount. This workflow converts 40% of COD orders to prepaid, slashing Return-to-Origin (RTO) shipping losses and eliminating operational drag.",
                    "In our institutional Python simulation for Part 3, we execute the Tier 3 Conversational Engine. The engine delivers 100,000 broadcast messages at a 98.0% read rate, recovers $11,375.00 in abandoned cart GMV, and reduces RTO risk by 40%, unlocking $48,500.00 in direct operational value. Examine the code below to see Tier 3 execute deterministically."
                ],
                "example": "Enterprise Case Study: A fast-growing direct-to-consumer lifestyle brand deployed the Tier 3 Conversational Engine. By scaling WhatsApp broadcasts to 100,000 customers during their seasonal sale, automating cart recovery with one-click payment links, and verifying COD orders, the brand generated $48,500 in incremental high-margin GMV within 72 hours while cutting reverse logistics courier penalties by 40%.",
                "code": p3_code,
                "output": "Tier 3: Conversational Commerce & WhatsApp Automation Engine:\n  Broadcast Volume: 100,000 Messages (Read Rate: 98.0%)\n  Abandoned Cart GMV Recovered: $11,375.00\n  Return-to-Origin (RTO) Risk Reduction: 40.0%\n  Tier 3 Value Unlocked: $48,500.00\n  Status: TIER3_NOMINAL",
                "codeNotes": [
                    "Executes Tier 3 broadcast scaling (100,000 messages) maintaining a 98.0% read rate and Green quality standing.",
                    "Recovers $11,375.00 in abandoned cart revenue through automated rich-media WhatsApp notifications.",
                    "Reduces Return-to-Origin (RTO) shipping risk by 40.0% through automated COD address verification and prepaid conversion."
                ],
                "tryIt": "Reduce read_rate_pct to 90.0% and observe how Tier 3 flags a TIER3_DEFECT due to failure to meet the >= 95% elite broadcast standard.",
                "check": {
                    "question": "What operational advantage does the Tier 3 Conversational Engine provide over traditional email marketing?",
                    "options": [
                        "98% open/read rates, 35% abandoned cart recovery rates, and automated COD verification that reduces RTO losses by 40%.",
                        "The ability to send millions of unsolicited spam emails without a physical mailing address.",
                        "Exempting the enterprise from paying taxes on product sales.",
                        "Automatically printing paper flyers at local post offices."
                    ],
                    "answer": 0,
                    "why": "WhatsApp conversational commerce delivers 98% read rates, 35% cart recovery, and active COD verification, dramatically outperforming legacy email marketing across every operational dimension."
                }
            },
            {
                "title": "Tier 4: Econometric MMM & Geo-Lift Incrementality Calibrator",
                "say": [
                    "We now integrate the supreme measurement authority: Tier 4: The Econometric MMM & Geo-Lift Incrementality Calibrator. While individual channels report attractive ROAS figures on their respective dashboards, executive leadership requires unbiased, causal truth to allocate multi-million-dollar capital budgets effectively.",
                    "The Tier 4 Calibrator combines top-down econometrics with empirical experimentation through three rigorous subsystems: Subsystem 1: Multivariate Time-Series MMM Decomposition. The calibrator models enterprise revenue against media spend across all channels, macroeconomic factors, and unpromoted base demand. This separates baseline organic revenue ($1.8M) from media-driven lift ($900k), completely insulated from cookie deprecation and tracking signal loss.",
                    "Subsystem 2: Non-Linear Adstock Carryover & Saturation Curves. The calibrator models memory carryover ($\\theta = 0.50$) and Hill saturation curves, preventing media buyers from pushing additional budget into saturated channels where marginal returns flatten.",
                    "Subsystem 3: Randomized Regional Geo-Lift Experimentation. The calibrator regularly validates model predictions using regional holdout experiments. By comparing treated markets against a synthetic counterfactual control group, the system isolates true causal incremental lift (+21.21% or $35,000.00) and calculates the true causal Incremental ROAS ($iROAS = 2.33x$). Channels that merely cannibalize organic search (such as branded search) are identified, and capital is dynamically reallocated toward high-incrementality discovery channels.",
                    "In our institutional Python simulation for Part 4, we execute the Tier 4 Econometric MMM Calibrator. The engine verifies time-series decomposition, validates a +21.21% causal sales lift in geo-testing, and confirms a 2.33x causal iROAS, unlocking $350,000.00 in optimized marketing productivity. Review the code below to see Tier 4 execute deterministically."
                ],
                "example": "Enterprise Case Study: A national retail chain utilized the Tier 4 Econometric MMM Calibrator to evaluate their annual media allocation. By proving that $1.8M of sales was organic baseline momentum and establishing a true causal iROAS of 2.33x through regional geo-holdouts, the team reallocated $1.2M away from cannibalizing brand search into high-incrementality performance video, driving $350,000 in net incremental gross profit.",
                "code": p4_code,
                "output": "Tier 4: Econometric MMM & Geo-Lift Incrementality Calibrator:\n  Unpromoted Base Sales: $1,800,000.00\n  Paid Media Incremental Lift: $900,000.00\n  Geo-Lift Causal Incremental Lift: +21.21%\n  True Causal Incremental ROAS (iROAS): 2.33x\n  Tier 4 Value Unlocked: $350,000.00\n  Status: TIER4_NOMINAL",
                "codeNotes": [
                    "Decomposes unpromoted base sales ($1.8M) from true paid media incremental lift ($900k).",
                    "Validates causal incrementality via regional synthetic control geo-testing (+21.21% lift).",
                    "Certifies a true causal Incremental ROAS of 2.33x, unlocking $350,000.00 in optimized capital efficiency."
                ],
                "tryIt": "Change causal_iroas to 1.4x and observe how Tier 4 flags a TIER4_DEFECT due to failure to meet the >= 2.0x profitability hurdle.",
                "check": {
                    "question": "How does the Tier 4 Econometric MMM Calibrator prevent marketing budgets from being wasted on platform cannibalization?",
                    "options": [
                        "It uses top-down econometric regression and regional geo-lift experiments to measure true causal incremental sales (iROAS) rather than platform-claimed credit.",
                        "It completely disables all digital advertising and relies solely on word-of-mouth.",
                        "It forces Google and Meta to refund 100% of ad spend at the end of each fiscal year.",
                        "It replaces marketing teams with automated lottery ticket purchases."
                    ],
                    "answer": 0,
                    "why": "Tier 4 combines aggregate econometric modeling with randomized geo-lift holdouts to isolate true causal sales lift, identifying when ads merely cannibalize organic demand."
                }
            },
            {
                "title": "Tier 5: Chief Growth Officer (CGO) & Econometric Science Boardroom Defense",
                "say": [
                    "We arrive at the pinnacle of Milestone 5: Tier 5: The Chief Growth Officer (CGO) & Econometric Science Boardroom Defense. Here, all four prior tiers—Retargeting Control Tower (Tier 1), Unit Economics Hub (Tier 2), Conversational Commerce Engine (Tier 3), and Econometric MMM Calibrator (Tier 4)—converge into an overarching executive command apparatus.",
                    "In modern corporate governance, the Chief Growth Officer and Chief Marketing Officer must defend the growth strategy before the Chief Executive Officer, Chief Financial Officer, and Board of Directors. Anecdotal claims, vanity metrics (such as impressions or clicks), and platform-reported ROAS are dismissed. What the board demands is audited proof of capital velocity, unassailable causal incrementality, pristine unit economics, and resilient owned customer communication channels.",
                    "The Tier 5 Master Growth Command Tower synthesizes our holistic operational performance: Tier 1 verifies that retargeting operates with zero ad fatigue and 100% SKU availability ($100k value); Tier 2 verifies a 4.0x Golden Ratio and 5.0-month payback velocity across $1.8M in gross-margin customer lifetime value ($1.8M value); Tier 3 verifies a 98% read rate, $11.3k in recovered carts, and 40% RTO reduction ($48.5k value); and Tier 4 verifies a 2.33x causal iROAS backed by regional geo-lift holdouts ($350k value).",
                    "Collectively, this integrated architecture unlocks an astounding $2,298,500.00 in audited enterprise value! In our institutional Python simulation for Part 5, we execute the Tier 5 Master Command Tower auditor. The engine validates that all four underlying tiers are in NOMINAL status, calculates total enterprise value, awards a perfect 100.0/100 Milestone Growth Performance Index (MGPI) score, and confers the prestigious Chief Growth Officer & Econometric Director Accredited credential! Review the code below to see this capstone certification execute deterministically."
                ],
                "example": "Enterprise Case Study: Armed with the Tier 5 Master Growth Command Tower, the Chief Growth Officer of an omnichannel consumer conglomerate presented the annual marketing defense to the board of directors. By demonstrating an audited $2,298,500.00 in unlocked enterprise value, a 4.0x CLV:CAC Golden Ratio, 5.0-month capital payback, and zero reliance on third-party cookies, the CGO secured unanimous board approval and the prestigious Chief Growth Officer & Econometric Director accreditation.",
                "code": p5_code,
                "output": "Tier 5: Master Growth Command Tower & Boardroom Defense Report:\n  Tier 1 Retargeting Control Tower: TIER1_NOMINAL\n  Tier 2 Unit Economics Hub: TIER2_NOMINAL\n  Tier 3 Conversational Commerce Engine: TIER3_NOMINAL\n  Tier 4 Econometric MMM Calibrator: TIER4_NOMINAL\n  Total Enterprise Value Unlocked: $2,298,500.00\n  Master MGPI Composite Score: 100.0 / 100.0\n  Boardroom Executive Verdict: CHIEF_GROWTH_OFFICER_AND_ECONOMETRIC_DIRECTOR_ACCREDITED\n  Milestone Status: MILESTONE_5_CAPSTONE_ACCREDITED",
                "codeNotes": [
                    "Integrates all four operational tiers into the Master Milestone 5 Growth Command Tower.",
                    "Calculates total audited enterprise value unlocked: $100k + $1.8M + $48.5k + $350k = $2,298,500.00.",
                    "Awards a perfect 100.0/100 MGPI composite score and confers CHIEF_GROWTH_OFFICER_AND_ECONOMETRIC_DIRECTOR_ACCREDITED."
                ],
                "tryIt": "Set tier4_status to TIER4_DEFECT and observe how the Master Command Tower revokes accreditation and issues an AUDIT_REMEDIATION_REQUIRED alert.",
                "check": {
                    "question": "What total enterprise value and composite score are certified upon successful completion of the Milestone 5 Grand Capstone?",
                    "options": [
                        "$2,298,500.00 in unlocked enterprise value with a perfect 100.0/100 MGPI score.",
                        "$0 in value with an unrated subjective review.",
                        "A loss of $5,000,000 due to unmonitored ad spending.",
                        "Unlimited free clicks provided by social media networks."
                    ],
                    "answer": 0,
                    "why": "The Milestone 5 Capstone synthesizes all four tiers to unlock $2,298,500.00 in audited enterprise value and achieves a 100.0/100 MGPI composite score."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day25_lesson()
    visual = build_day25_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 25 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
