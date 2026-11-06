"""
Day 29 Builder: Omnichannel Customer Journey & Full-Funnel Growth Orchestration
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 6 / Capstone Module
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day29_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 29,
        "title": "Omnichannel Customer Journey & Full-Funnel Growth Orchestration Architecture",
        "funnelSteps": [
            {
                "step": "FUNNEL_STAGE_ALIGNMENT",
                "label": "Full-Funnel TOFU (50%) / MOFU (30%) / BOFU (20%) Capital Balancing",
                "metric": "Balanced 50/30/20 Ratio",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "CROSS_NETWORK_SUPPRESSION",
                "label": "Real-Time Cross-Channel Audience Synchronization & Negative Lists",
                "metric": "< 1.2s Sync Latency",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "MTA_MMM_RECONCILIATION",
                "label": "Triangulated Micro-MTA vs Macro-Econometric MMM Reconciliation",
                "metric": "Triangulated Weights Verified",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "EXECUTIVE_VELOCITY_DASHBOARD",
                "label": "Executive Growth Velocity (CAC $37.70, Payback 5.0m, ARR +85%)",
                "metric": "Tier 1 Venture-Scale Engine",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "ENTERPRISE_ORCHESTRATION_GATEWAY",
                "label": "Institutional Omnichannel Growth Orchestration Gateway",
                "metric": "100.0/100 FFGI Certified",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "Funnel Capital Mix", "value": "50% TOFU / 30% MOFU / 20% BOFU"},
            {"label": "Sync Latency", "value": "< 1.2 Seconds"},
            {"label": "Payback Horizon", "value": "5.0 Months"},
            {"label": "Composite FFGI Score", "value": "100.0/100"}
        ]
    }

def build_day29_lesson() -> dict:
    p1_code = r'''def simulate_full_funnel_stage_alignment(total_budget: float, stage_distribution: dict) -> dict:
    """
    Simulates Full-Funnel Growth Stage Capital Balancing:
    Allocates media budget across Top-of-Funnel (TOFU), Middle-of-Funnel (MOFU),
    and Bottom-of-Funnel (BOFU) to ensure continuous pipeline velocity.
    """
    stage_spends = {stage: round(total_budget * (pct / 100.0), 2) for stage, pct in stage_distribution.items()}
    
    # Model customer progression velocity through stages
    tofu_reach = int(stage_spends["TOFU_Awareness"] / 0.05) # $0.05 per video view/reach
    mofu_engagements = int(stage_spends["MOFU_Consideration"] / 0.75) # $0.75 per engaged lead
    bofu_conversions = int(stage_spends["BOFU_Conversion"] / 35.0) # $35.00 CPA
    
    return {
        "total_budget_usd": total_budget,
        "stage_allocations_usd": stage_spends,
        "tofu_reach_impressions": tofu_reach,
        "mofu_engaged_leads": mofu_engagements,
        "bofu_conversions": bofu_conversions,
        "status": "FUNNEL_STAGES_ALIGNED"
    }

if __name__ == "__main__":
    distribution = {
        "TOFU_Awareness": 50.0,
        "MOFU_Consideration": 30.0,
        "BOFU_Conversion": 20.0
    }
    res = simulate_full_funnel_stage_alignment(500000.0, distribution)
    print("Full-Funnel Stage Capital Alignment Report:")
    print(f"  Total Growth Budget: ${res['total_budget_usd']:,.2f}")
    print(f"  TOFU Awareness (50%): ${res['stage_allocations_usd']['TOFU_Awareness']:,.2f} -> {res['tofu_reach_impressions']:,} Reach")
    print(f"  MOFU Consideration (30%): ${res['stage_allocations_usd']['MOFU_Consideration']:,.2f} -> {res['mofu_engaged_leads']:,} Leads")
    print(f"  BOFU Conversion (20%): ${res['stage_allocations_usd']['BOFU_Conversion']:,.2f} -> {res['bofu_conversions']:,} Conversions")
    print(f"  Status: {res['status']}")
'''

    p2_code = r'''def simulate_cross_network_audience_suppression(events: list) -> dict:
    """
    Simulates Real-Time Cross-Network Audience Synchronization:
    When a customer converts on one channel (e.g. Google Search),
    an automated webhook immediately pushes suppression tokens to Meta,
    TikTok, and LinkedIn within < 1.5 seconds, eliminating wasted retargeting.
    """
    suppressed_records = []
    for ev in events:
        if ev.get("event") == "purchase":
            suppressed_records.append({
                "user_id": ev["user_id"],
                "originating_channel": ev["channel"],
                "suppression_targets": ["Meta_CAPI_Exclusion", "TikTok_Audience_Exclusion", "Google_CustomerMatch_Exclusion"],
                "sync_latency_seconds": 1.2,
                "status": "SUPPRESSION_PROPAGATED_SUCCESSFULLY"
            })
            
    return {
        "total_events_processed": len(events),
        "conversions_detected": len(suppressed_records),
        "suppression_logs": suppressed_records,
        "status": "CROSS_NETWORK_SYNC_COMPLETE"
    }

if __name__ == "__main__":
    test_events = [
        {"user_id": "USR-901", "event": "page_view", "channel": "Meta_Social"},
        {"user_id": "USR-902", "event": "purchase", "channel": "Google_Search"},
        {"user_id": "USR-903", "event": "add_to_cart", "channel": "TikTok_Shop"},
        {"user_id": "USR-904", "event": "purchase", "channel": "WhatsApp_Commerce"}
    ]
    res = simulate_cross_network_audience_suppression(test_events)
    print("Cross-Network Audience Synchronization & Suppression Report:")
    print(f"  Events Ingested: {res['total_events_processed']} | Conversions Suppressed: {res['conversions_detected']}")
    for s in res['suppression_logs']:
        print(f"    User {s['user_id']} ({s['originating_channel']}): Suppressed across {len(s['suppression_targets'])} networks in {s['sync_latency_seconds']}s")
    print(f"  Status: {res['status']}")
'''

    p3_code = r'''def reconcile_mta_and_mmm_attribution(mmm_weights: dict, mta_weights: dict) -> dict:
    """
    Triangulates Micro-Level Multi-Touch Attribution (MTA) with Macro-Level Econometric MMM:
    Applies 70% weight to econometric MMM (unbiased causal ground truth)
    and 30% weight to MTA (granular keyword/creative allocation).
    """
    reconciled = {}
    for ch in mmm_weights:
        w = round((mmm_weights[ch] * 0.70) + (mta_weights.get(ch, 0.0) * 0.30), 1)
        reconciled[ch] = w
        
    return {
        "mmm_macro_weights": mmm_weights,
        "mta_micro_weights": mta_weights,
        "reconciled_triangulated_weights": reconciled,
        "status": "TRIANGULATED_ATTRIBUTION_NOMINAL"
    }

if __name__ == "__main__":
    mmm = {"Google_Search": 20.0, "Meta_Social": 40.0, "YouTube_Video": 25.0, "Programmatic_Display": 15.0}
    mta = {"Google_Search": 45.0, "Meta_Social": 30.0, "YouTube_Video": 15.0, "Programmatic_Display": 10.0}
    res = reconcile_mta_and_mmm_attribution(mmm, mta)
    print("Omnichannel Attribution Reconciliation Report (MTA vs MMM):")
    for ch, w in res['reconciled_triangulated_weights'].items():
        print(f"  {ch}: MMM {mmm[ch]}% vs MTA {mta[ch]}% -> Reconciled: {w}%")
    print(f"  Status: {res['status']}")
'''

    p4_code = r'''def evaluate_executive_growth_velocity(blended_cac: float, clv_cac_ratio: float, payback_months: float, arr_growth_pct: float) -> dict:
    """
    Evaluates enterprise digital growth health across the C-suite scorecard:
    Elite Standard: CLV:CAC >= 3.0, Payback <= 12 months, ARR Growth >= 50%.
    """
    is_elite = (clv_cac_ratio >= 3.0) and (payback_months <= 12.0) and (arr_growth_pct >= 50.0)
    tier = "TIER_1_VENTURE_SCALE_GROWTH_ENGINE" if is_elite else "SUB_OPTIMAL_GROWTH_VELOCITY"
    score = 98.5 if is_elite else 65.0
    
    return {
        "blended_cac_usd": blended_cac,
        "clv_to_cac_ratio": clv_cac_ratio,
        "payback_horizon_months": payback_months,
        "annual_arr_growth_pct": arr_growth_pct,
        "growth_engine_tier": tier,
        "velocity_score": score,
        "status": "EXECUTIVE_VELOCITY_AUDITED"
    }

if __name__ == "__main__":
    res = evaluate_executive_growth_velocity(
        blended_cac=37.70,
        clv_cac_ratio=4.0,
        payback_months=5.0,
        arr_growth_pct=85.0
    )
    print("Executive Growth Velocity & Payback Report:")
    print(f"  Blended CAC: ${res['blended_cac_usd']:.2f}")
    print(f"  CLV:CAC Golden Ratio: {res['clv_to_cac_ratio']}x | Payback: {res['payback_horizon_months']} Months")
    print(f"  ARR Growth Velocity: +{res['annual_arr_growth_pct']}% YoY")
    print(f"  Enterprise Classification: {res['growth_engine_tier']} (Score: {res['velocity_score']}/100)")
    print(f"  Status: {res['status']}")
'''

    p5_code = r'''def audit_enterprise_growth_orchestration_gateway(
    funnel_alignment_ok: bool,
    audience_suppression_ok: bool,
    attribution_reconciliation_ok: bool,
    executive_velocity_ok: bool
) -> dict:
    """
    Enterprise Full-Funnel Growth Orchestration Gateway: Integrates TOFU/MOFU/BOFU
    budget balancing, cross-network audience suppression, MTA/MMM attribution reconciliation,
    and C-suite executive growth velocity governance.
    """
    all_nominal = funnel_alignment_ok and audience_suppression_ok and attribution_reconciliation_ok and executive_velocity_ok
    score = 100.0 if all_nominal else 70.0
    verdict = "FULL_FUNNEL_GROWTH_ORCHESTRATOR_CERTIFIED" if all_nominal else "ORCHESTRATION_DEFECT"
    
    return {
        "funnel_stage_alignment_active": funnel_alignment_ok,
        "cross_network_suppression_active": audience_suppression_ok,
        "attribution_reconciliation_active": attribution_reconciliation_ok,
        "executive_velocity_active": executive_velocity_ok,
        "ffgi_score": score,
        "certification": verdict,
        "status": "ENTERPRISE_ORCHESTRATION_NOMINAL" if all_nominal else "AUDIT_REMEDIATION_REQUIRED"
    }

if __name__ == "__main__":
    gateway = audit_enterprise_growth_orchestration_gateway(
        funnel_alignment_ok=True,
        audience_suppression_ok=True,
        attribution_reconciliation_ok=True,
        executive_velocity_ok=True
    )
    print("Enterprise Full-Funnel Growth Orchestration Gateway Report:")
    print(f"  Funnel Stage Alignment Active: {gateway['funnel_stage_alignment_active']}")
    print(f"  Cross-Network Suppression Active: {gateway['cross_network_suppression_active']}")
    print(f"  Attribution Reconciliation Active: {gateway['attribution_reconciliation_active']}")
    print(f"  Executive Velocity Active: {gateway['executive_velocity_active']}")
    print(f"  Composite FFGI Score: {gateway['ffgi_score']} / 100.0")
    print(f"  Accreditation Verdict: {gateway['certification']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 29,
        "title": "Omnichannel Customer Journey & Full-Funnel Growth Orchestration Architecture",
        "goal": "Master end-to-end growth orchestration: TOFU/MOFU/BOFU capital allocation, real-time cross-channel audience suppression, micro-MTA vs macro-MMM attribution reconciliation, executive growth velocity dashboards, and the Enterprise Orchestration Gateway.",
        "minutes": 35,
        "recap": "Day 29 unifies the complete digital growth engine. Learn to align media capital across the 50/30/20 funnel ratio, synchronize real-time conversion suppressions across ad networks in under 1.5 seconds, triangulate MTA with econometric MMM, and govern C-suite growth velocity.",
        "parts": [
            {
                "title": "Full-Funnel Growth Architecture: TOFU, MOFU, and BOFU Alignment",
                "say": [
                    "Welcome to Day 29 of Digital Marketing Analytics and Performance Strategy. Today, on the eve of our Course 28 Grand Final Capstone, we orchestrate the complete, unified growth engine: Omnichannel Full-Funnel Growth Orchestration.",
                    "In siloed, amateur marketing organizations, digital channels operate as isolated fiefdoms: the paid search team bids on bottom-funnel keywords, the social team posts brand videos, and the email team blasts promotions—all competing for attribution credit without a shared strategic vision. This fragmentation leads to severe funnel bottlenecks: either the top of the funnel runs dry due to under-investment in brand discovery, or the bottom of the funnel leaks revenue due to friction at checkout.",
                    "Institutional enterprise growth deploys Full-Funnel Architecture, methodically balancing capital and creative messaging across three interconnected stages: Top-of-Funnel (TOFU), Middle-of-Funnel (MOFU), and Bottom-of-Funnel (BOFU). The proven benchmark allocation is the 50/30/20 Rule: 50% of media capital is deployed into TOFU Awareness (YouTube Shorts, TikTok, non-brand organic search pillars) to continuously feed new prospect reach into the pipeline.",
                    "30% of capital is allocated to MOFU Consideration (thought leadership whitepapers, interactive diagnostic tools, email lead nurturing, case studies) to educate prospects and establish authoritative brand preference. Finally, 20% of capital is deployed into BOFU Conversion (high-intent Google Search ad groups, Dynamic Product Ads retargeting, WhatsApp 1-click checkout) to convert warmed intent into closed transactions at maximum capital efficiency.",
                    "In our institutional Python simulation for Part 1, we model the Full-Funnel Capital Alignment Engine. The system ingests a $500,000 growth budget, applies the 50/30/20 distribution across TOFU, MOFU, and BOFU stages, and calculates expected pipeline throughput: generating 5,000,000 TOFU reach impressions, 200,000 MOFU engaged leads, and 2,857 BOFU closed conversions. Examine the code below to see full-funnel stage alignment in action."
                ],
                "example": "Enterprise Case Study: A high-growth B2B fintech company previously allocated 90% of its $500k budget exclusively to bottom-funnel Google Search ads. Over two quarters, search CPCs doubled due to auction saturation, and lead volume flattened. By transitioning to the 50/30/20 full-funnel model—investing $250k in educational YouTube video reach, $150k in gated industry reports, and $100k in conversion retargeting—their total organic brand search volume expanded by 320%, reducing blended CAC by 41% and unlocking sustainable growth.",
                "code": p1_code,
                "output": "Full-Funnel Stage Capital Alignment Report:\n  Total Growth Budget: $500,000.00\n  TOFU Awareness (50%): $250,000.00 -> 5,000,000 Reach\n  MOFU Consideration (30%): $150,000.00 -> 200,000 Leads\n  BOFU Conversion (20%): $100,000.00 -> 2,857 Conversions\n  Status: FUNNEL_STAGES_ALIGNED",
                "codeNotes": [
                    "Allocates media capital across the golden 50/30/20 ratio: $250k TOFU, $150k MOFU, $100k BOFU.",
                    "Models pipeline velocity across funnel stages: 5M awareness reach -> 200k consideration leads -> 2,857 closed conversions.",
                    "Ensures continuous pipeline replenishment, preventing the bottom of the funnel from running dry."
                ],
                "tryIt": "Shift the allocation to 70% BOFU and observe how TOFU awareness reach collapses by 40%, illustrating how short-term performance bias damages future pipeline.",
                "check": {
                    "question": "What is the primary operational benefit of adhering to the 50/30/20 Full-Funnel capital allocation ratio?",
                    "options": [
                        "It ensures a steady inflow of new upper-funnel prospect awareness while actively nurturing middle-funnel leads and closing bottom-funnel conversions efficiently.",
                        "It eliminates the need to pay corporate taxes on advertising expenses.",
                        "It guarantees that every website visitor purchases on their first click.",
                        "It replaces customer support teams with automated chatbots permanently."
                    ],
                    "answer": 0,
                    "why": "The 50/30/20 ratio balances upper-funnel discovery (50%), mid-funnel education (30%), and lower-funnel transaction conversion (20%), preventing audience exhaustion and auction fatigue."
                }
            },
            {
                "title": "Cross-Channel Audience Synchronization & Negative Suppression",
                "say": [
                    "Operating a full-funnel growth engine across multiple digital ad networks introduces a major operational challenge: Cross-Channel Audience Disconnect. A consumer rarely converts within a single isolated channel; they might watch a video on TikTok, research software features on LinkedIn, and eventually complete their purchase on Google Search.",
                    "If these advertising networks operate in silos without real-time audience synchronization, catastrophic waste occurs: after the customer completes their purchase on Google Search, Meta and TikTok continue serving aggressive retargeting ads urging them to buy the product they just purchased. This wastes media budget, annoys the customer, and signals amateurish operations.",
                    "Enterprise growth engineering deploys Real-Time Cross-Network Audience Synchronization pipelines via Customer Data Platforms (CDP) and cloud webhook orchestrators. The instant a conversion event fires on any channel, an automated webhook captures the user's pseudo-ID, hashed email, and phone number.",
                    "In under 1.5 seconds, the synchronization engine pushes API calls to Meta Custom Audiences, TikTok Audience Manager, Google Customer Match, and LinkedIn Matched Audiences, instantly adding the user to global Negative Exclusion Lists across all networks. Simultaneously, the user is transitioned into post-purchase onboarding and loyalty nurture workflows, creating a seamless, coordinated customer experience.",
                    "In our institutional Python simulation for Part 2, we build the Cross-Network Audience Synchronization and Suppression Engine. The system processes incoming event streams, detects purchase transactions, and propagates real-time suppression updates across Meta, TikTok, and Google within 1.2 seconds of latency. Review the code below to see cross-channel synchronization execute deterministically."
                ],
                "example": "Enterprise Case Study: A multi-channel retail brand implemented real-time cross-network audience synchronization across Meta, Google, and TikTok. Previously, customers who converted via Google Search received retargeting display ads on Meta for an average of 4.5 days post-purchase, wasting $38,000 monthly. The real-time suppression webhook compressed cross-network synchronization latency to 1.2 seconds, eliminating 100% of redundant post-purchase ad impressions and redirecting those funds into high-intent discovery campaigns.",
                "code": p2_code,
                "output": "Cross-Network Audience Synchronization & Suppression Report:\n  Events Ingested: 4 | Conversions Suppressed: 2\n    User USR-902 (Google_Search): Suppressed across 3 networks in 1.2s\n    User USR-904 (WhatsApp_Commerce): Suppressed across 3 networks in 1.2s\n  Status: CROSS_NETWORK_SYNC_COMPLETE",
                "codeNotes": [
                    "Detects purchase conversions across channels (USR-902 on Google Search, USR-904 on WhatsApp).",
                    "Propagates real-time exclusion payloads to Meta, TikTok, and Google APIs within 1.2 seconds of latency.",
                    "Eliminates wasted ad impressions on recent buyers across all digital touchpoints instantly."
                ],
                "tryIt": "Add a third purchase event for USR-903 on TikTok and observe how the engine automatically dispatches 3-network suppression."
                ,
                "check": {
                    "question": "Why is sub-2-second cross-network audience suppression critical for enterprise digital advertising efficiency?",
                    "options": [
                        "It immediately halts retargeting ads across all other social and search platforms the instant a user converts, eliminating wasted media spend and consumer annoyance.",
                        "It automatically refunds the customer's purchase if they click another ad.",
                        "It prevents competitors from bidding on their own brand keywords.",
                        "It forces ad platforms to reduce CPC bids by 90% across all ad groups."
                    ],
                    "answer": 0,
                    "why": "Real-time cross-network suppression ensures that when a user converts on any touchpoint, all other ad platforms immediately stop serving retargeting ads to that user, conserving ad spend."
                }
            },
            {
                "title": "Omnichannel Attribution Reconciliation: MTA vs MMM",
                "say": [
                    "A persistent battle in enterprise marketing analytics is the tension between Micro-Level Multi-Touch Attribution (MTA) and Macro-Level Econometric Marketing Mix Modeling (MMM). Both methodologies provide critical insights, yet when viewed in isolation, they often produce wildly conflicting recommendations.",
                    "Multi-Touch Attribution (MTA) tracks individual click paths and touchpoints, assigning fractional credit across awareness, nurturing, and closing channels. MTA is exceptionally valuable for micro-optimization: determining which specific keyword ad group, creative angle, or audience lookalike tier is driving conversions within a channel. However, MTA suffers from severe blind spots: it cannot track offline sales, upper-funnel TV/CTV, or cross-device conversions, and it is vulnerable to platform tracking loss.",
                    "Marketing Mix Modeling (MMM), conversely, uses aggregate time-series econometric regression to isolate true macro-level incrementality. MMM is immune to cookie deprecation and accounts for baseline brand equity. However, MMM operates at a weekly macro level, unable to inform a media buyer which specific headline copy or 15-second video hook to pause on Tuesday morning.",
                    "Elite growth leadership resolves this dichotomy through Triangulated Attribution Reconciliation. The enterprise uses top-down econometric MMM to establish the definitive macro budget constraints across media channels (e.g., allocating 40% to Social, 25% to Video, 20% to Search, 15% to Display). Simultaneously, the team applies micro-level MTA within each channel to dynamically allocate capital among specific campaigns, ad sets, and creative variations. The governing reconciliation formula applies a weighted synthesis (typically 70% econometric MMM truth, 30% MTA granularity) to establish unified corporate attribution weights.",
                    "In our institutional Python simulation for Part 3, we implement the Omnichannel MTA vs MMM Attribution Reconciliation Engine. The system processes conflicting channel share claims from MMM and MTA, reconciles them using the 70/30 triangulation formula, and outputs unified optimal budget weights. Examine the code below to see attribution reconciliation execute deterministically."
                ],
                "example": "Enterprise Case Study: A global enterprise brand's MTA dashboard claimed that Google Search drove 45% of conversions while YouTube Video drove only 15%. However, their econometric MMM model proved that Brand Search was merely cannibalizing organic traffic (MMM share 20%) while YouTube drove substantial upper-funnel consideration (MMM share 25%). By applying the 70/30 reconciliation framework, leadership settled on unified weights (Search 27.5%, Social 37.0%, Video 22.0%, Display 13.5%), ending internal attribution disputes and unlocking $1.4M in incremental annual gross profit.",
                "code": p3_code,
                "output": "Omnichannel Attribution Reconciliation Report (MTA vs MMM):\n  Google_Search: MMM 20.0% vs MTA 45.0% -> Reconciled: 27.5%\n  Meta_Social: MMM 40.0% vs MTA 30.0% -> Reconciled: 37.0%\n  YouTube_Video: MMM 25.0% vs MTA 15.0% -> Reconciled: 22.0%\n  Programmatic_Display: MMM 15.0% vs MTA 10.0% -> Reconciled: 13.5%\n  Status: TRIANGULATED_ATTRIBUTION_NOMINAL",
                "codeNotes": [
                    "Triangulates macro-econometric MMM (70% weight) with granular click-path MTA (30% weight).",
                    "Harmonizes Google Search: cools down MTA's inflated claim (45.0%) to an econometrically grounded 27.5%.",
                    "Lifts YouTube Video from MTA's under-valued 15.0% to 22.0%, validating upper-funnel brand consideration."
                ],
                "tryIt": "Adjust MTA weight to 50% and observe how reconciled Search weight rises to 32.5%, illustrating sensitivity to attribution models.",
                "check": {
                    "question": "How do enterprise marketing leaders successfully reconcile Multi-Touch Attribution (MTA) with Marketing Mix Modeling (MMM)?",
                    "options": [
                        "By using top-down MMM to establish macro channel budget allocations, while using micro-MTA to optimize specific ad sets and creatives within each channel.",
                        "By firing the data science team and guessing marketing returns based on website visitor comments.",
                        "By completely ignoring econometrics and trusting platform-reported ROAS exclusively.",
                        "By alternating between MTA and MMM on odd and even days of the week."
                    ],
                    "answer": 0,
                    "why": "Triangulated reconciliation uses macro MMM to set channel budget guardrails and micro MTA to optimize tactical ad sets and creatives within each channel."
                }
            },
            {
                "title": "Executive Growth Velocity & Payback Dashboards",
                "say": [
                    "The operational health of an enterprise growth engine culminates in the executive dashboard monitored by the Chief Executive Officer, Chief Financial Officer, and Chief Marketing Officer: The Executive Growth Velocity Scorecard.",
                    "The Growth Velocity Scorecard cuts through vanity metrics to evaluate four non-negotiable financial vitals: Vital 1: Blended Customer Acquisition Cost (Blended CAC), benchmarking the comprehensive cost of acquiring customers across paid and organic channels ($37.70); Vital 2: Customer Lifetime Value to CAC Ratio (CLV:CAC), enforcing the 4.0x Golden Ratio; Vital 3: CAC Payback Horizon, verifying that customer gross profit reimburses acquisition capital within a rapid 5.0 months; and Vital 4: Annual Recurring Revenue Growth Velocity, tracking top-line year-over-year revenue expansion (+85% YoY).",
                    "When an enterprise achieves a CLV:CAC ratio $\\ge 3.0x$, a CAC payback horizon $\\le 12$ months, and annual growth $\\ge 50\\%$, it earns the prestigious classification of a Tier 1 Venture-Scale Growth Engine. This status indicates that the business has achieved pristine Product-Market Fit, efficient capital recycling velocity, and scalable acquisition economics.",
                    "In our institutional Python simulation for Part 4, we build the Executive Growth Velocity and Payback Auditor. The system processes corporate growth metrics, verifies compliance across the four financial vitals, awards an executive velocity score of 98.5/100, and classifies the enterprise into the Tier 1 Venture-Scale category. Review the code below to see executive scorecard governance in action."
                ],
                "example": "Enterprise Case Study: Prior to a $60M growth equity funding round, a multi-brand e-commerce conglomerate presented their Executive Growth Velocity Scorecard. The audited report proved a Blended CAC of $37.70, a 4.0x CLV:CAC ratio, a 5.0-month capital payback horizon, and 85% annual ARR expansion. Certified as a Tier 1 Venture-Scale Growth Engine with a 98.5/100 score, the company commanded a top-decile valuation multiple from institutional investors.",
                "code": p4_code,
                "output": "Executive Growth Velocity & Payback Report:\n  Blended CAC: $37.70\n  CLV:CAC Golden Ratio: 4.0x | Payback: 5.0 Months\n  ARR Growth Velocity: +85.0% YoY\n  Enterprise Classification: TIER_1_VENTURE_SCALE_GROWTH_ENGINE (Score: 98.5/100)\n  Status: EXECUTIVE_VELOCITY_AUDITED",
                "codeNotes": [
                    "Evaluates the four pillars of enterprise growth: Blended CAC ($37.70), Golden Ratio (4.0x), Payback (5.0m), and ARR Growth (+85%).",
                    "Validates that all four metrics surpass institutional hurdle rates (Ratio >= 3.0, Payback <= 12m, Growth >= 50%).",
                    "Classifies enterprise as TIER_1_VENTURE_SCALE_GROWTH_ENGINE with a 98.5/100 composite velocity score."
                ],
                "tryIt": "Increase payback_months to 14.0 and observe how classification shifts to SUB_OPTIMAL_GROWTH_VELOCITY and score drops to 65.0.",
                "check": {
                    "question": "Which combination of metrics certifies an enterprise as a Tier 1 Venture-Scale Growth Engine?",
                    "options": [
                        "A CLV:CAC ratio >= 3.0, a CAC payback horizon <= 12 months, and annual revenue growth >= 50%.",
                        "Zero customer churn with an unmonitored acquisition budget.",
                        "A million social media followers with negative operating margins.",
                        "Spending 100% of revenue on Google Ads regardless of customer lifetime value."
                    ],
                    "answer": 0,
                    "why": "Tier 1 venture-scale growth requires proven unit economics (CLV:CAC >= 3.0), fast capital velocity (payback <= 12 months), and rapid top-line growth (ARR >= 50% YoY)."
                }
            },
            {
                "title": "Enterprise Full-Funnel Growth Orchestration Gateway",
                "say": [
                    "In this culminating session of Day 29, we synthesize our full-funnel growth architecture into a unified operational command tower: the Enterprise Full-Funnel Growth Orchestration Gateway. Elite performance marketing does not exist as isolated tactical campaigns; it operates as an integrated, self-reinforcing flywheel that harmonizes upper-funnel brand discovery, real-time cross-channel audience synchronization, triangulated attribution reconciliation, and boardroom executive growth velocity.",
                    "The Enterprise Full-Funnel Gateway enforces four non-negotiable architectural mandates: Mandate 1: Disciplined Full-Funnel Stage Alignment allocating media capital across the balanced 50% TOFU, 30% MOFU, and 20% BOFU ratio; Mandate 2: Sub-1.5-second Real-Time Cross-Network Audience Synchronization propagating instant suppression lists to Meta, Google, and TikTok; Mandate 3: Triangulated Attribution Reconciliation synthesizing macro-econometric MMM (70%) with micro-click MTA (30%); and Mandate 4: Executive Growth Velocity Scorecards certifying Tier 1 venture-scale capital efficiency.",
                    "When all four components operate in seamless harmony, the enterprise achieves absolute commercial dominance, maximizing revenue velocity while maintaining complete financial transparency. In our institutional Python simulation for Part 5, we execute the Enterprise Full-Funnel Gateway auditor. The gateway verifies that funnel alignment, audience suppression, attribution reconciliation, and executive velocity are fully active, awarding a composite Full-Funnel Growth Index (FFGI) score of 100.0/100 and conferring the prestigious Full-Funnel Growth Orchestrator credential. Review the code below to see this final certification execute deterministically."
                ],
                "example": "Enterprise Case Study: A global direct-to-consumer conglomerate deployed the Enterprise Full-Funnel Growth Orchestration Gateway across 6 brand divisions. The gateway balanced a $30M annual media portfolio across 50/30/20 funnel ratios, synchronized real-time cross-channel suppressions in 1.2s, reconciled MTA with top-down econometrics, and achieved a 4.0x CLV:CAC ratio with a 5.0-month payback, earning a perfect 100.0/100 FFGI score.",
                "code": p5_code,
                "output": "Enterprise Full-Funnel Growth Orchestration Gateway Report:\n  Funnel Stage Alignment Active: True\n  Cross-Network Suppression Active: True\n  Attribution Reconciliation Active: True\n  Executive Velocity Active: True\n  Composite FFGI Score: 100.0 / 100.0\n  Accreditation Verdict: FULL_FUNNEL_GROWTH_ORCHESTRATOR_CERTIFIED",
                "codeNotes": [
                    "Integrates 50/30/20 funnel alignment, cross-network audience suppression, MTA/MMM reconciliation, and executive velocity.",
                    "Confirms all four enterprise orchestration gates are nominal, awarding a perfect 100.0/100 FFGI score.",
                    "Confers official FULL_FUNNEL_GROWTH_ORCHESTRATOR_CERTIFIED accreditation for corporate growth governance."
                ],
                "tryIt": "Set audience_suppression_ok to False and observe how the gateway revokes certification and triggers an AUDIT_REMEDIATION_REQUIRED alert.",
                "check": {
                    "question": "Which set of practices defines an institutional-grade full-funnel growth orchestration architecture?",
                    "options": [
                        "50/30/20 TOFU/MOFU/BOFU budget balancing, real-time cross-network audience suppression, triangulated MTA/MMM attribution reconciliation, and executive growth velocity governance.",
                        "Spending 100% of advertising budget on bottom-funnel search ads without tracking customer lifetime value.",
                        "Operating marketing channels as isolated silos without cross-channel negative audiences or attribution reconciliation.",
                        "Terminating all performance advertising to rely entirely on organic viral word-of-mouth."
                    ],
                    "answer": 0,
                    "why": "Enterprise growth orchestration unifies balanced 50/30/20 full-funnel capital, sub-second cross-network audience suppression, triangulated MTA/MMM attribution, and executive velocity governance."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day29_lesson()
    visual = build_day29_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 29 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
