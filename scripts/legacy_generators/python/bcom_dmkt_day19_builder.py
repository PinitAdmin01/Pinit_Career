"""
Day 19 Builder: App Store Optimization (ASO) & Mobile User Acquisition
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Task: TASK-839
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from digital_marketing_budget_ensurer import ensure_dmkt_day_budget

def build_day19():
    parts = []

    # Part 1: ASO Keyword Indexing Algorithms (Apple App Store vs Google Play Vitals)
    p1_say = [
        "Welcome to Day 19 of Digital Marketing and Growth Hacking. Today, we conquer Mobile App Growth and App Store Optimization (ASO). In the smartphone era, mobile applications account for over 70% of digital media consumption. However, competing in the Apple App Store and Google Play Store requires mastering two fundamentally divergent indexing and ranking algorithms.",
        
        "On iOS, the Apple App Store indexing algorithm is rigidly structured around three explicit metadata fields: App Name (strictly capped at 30 characters), Subtitle (30 characters), and the hidden 100-character Keyword Field. In Apple's ecosystem, keywords placed in the 4,000-character promotional description have absolutely zero indexation weight. Furthermore, growth teams must enforce strict formatting in the keyword field: words must be separated solely by commas with no spaces (e.g., 'fitness,tracker,workout'), duplicate keywords across the title, subtitle, and keyword field must be ruthlessly eliminated, and category names or competitor brand terms must be avoided to prevent app store rejection.",
        
        "Conversely, Google Play operates like a traditional web crawler. Google indexes keywords across the App Title (30 characters), Short Description (80 characters), and Long Description (4,000 characters). On Android, growth marketers optimize for an ideal keyword density of 2.0% to 2.5%, avoiding keyword stuffing that triggers algorithmic penalties. Furthermore, Google Play enforces Android Vitals: apps exhibiting User-Perceived Crash Rates above 1.09% or Application Not Responding (ANR) rates above 0.47% suffer catastrophic organic search visibility penalties and exclusion from category top charts.",
        
        "In our Python simulation for Part 1, we build an ASO Metadata Compliance and Keyword Indexing Auditor. The script validates character counts, checks comma-delimited syntax, computes keyword density, and evaluates Android Vitals compliance. Review the code below to master store-specific ASO mechanics."
    ]

    p1_code = r'''def audit_aso_metadata_compliance(
    metadata: dict,
    store: str = "apple",
    vitals: dict = None
) -> dict:
    """
    Audits App Store Optimization (ASO) metadata against strict Apple and Google guidelines.
    Validates character limits, keyword formatting, description density, and Android Vitals.
    """
    issues = []
    
    if store == "apple":
        title_len = len(metadata.get("app_name", ""))
        subtitle_len = len(metadata.get("subtitle", ""))
        kw_field = metadata.get("keyword_field", "")
        kw_len = len(kw_field)
        
        if title_len > 30: issues.append(f"APP_NAME_EXCEEDS_30_CHARS_({title_len})")
        if subtitle_len > 30: issues.append(f"SUBTITLE_EXCEEDS_30_CHARS_({subtitle_len})")
        if kw_len > 100: issues.append(f"KEYWORD_FIELD_EXCEEDS_100_CHARS_({kw_len})")
        if " " in kw_field: issues.append("KEYWORD_FIELD_CONTAINS_ILLEGAL_SPACES_(USE_COMMAS_ONLY)")
        
        audit_result = {
            "store": "Apple_App_Store",
            "app_name_length": f"{title_len}/30",
            "subtitle_length": f"{subtitle_len}/30",
            "keyword_field_length": f"{kw_len}/100",
            "status": "APPROVED_FOR_SUBMISSION" if not issues else "REJECTED_NON_COMPLIANT",
            "violations": issues
        }
        
    elif store == "google":
        title_len = len(metadata.get("app_name", ""))
        short_desc_len = len(metadata.get("short_description", ""))
        long_desc = metadata.get("long_description", "")
        long_desc_words = long_desc.lower().split()
        
        target_kw = metadata.get("target_keyword", "").lower()
        kw_count = long_desc_words.count(target_kw)
        density = round((kw_count / max(1, len(long_desc_words))) * 100.0, 2)
        
        if title_len > 30: issues.append(f"TITLE_EXCEEDS_30_CHARS_({title_len})")
        if short_desc_len > 80: issues.append(f"SHORT_DESC_EXCEEDS_80_CHARS_({short_desc_len})")
        if density > 3.0: issues.append(f"KEYWORD_STUFFING_DETECTED_({density}%_DENSITY)")
        
        # Check Android Vitals
        vitals_status = "HEALTHY"
        if vitals:
            crash_rate = vitals.get("crash_rate_pct", 0.0)
            anr_rate = vitals.get("anr_rate_pct", 0.0)
            if crash_rate > 1.09 or anr_rate > 0.47:
                vitals_status = "BAD_BEHAVIOR_THRESHOLD_EXCEEDED_(RANKING_PENALTY)"
                issues.append(f"VITALS_PENALTY_(CRASH={crash_rate}%,_ANR={anr_rate}%)")
                
        audit_result = {
            "store": "Google_Play_Store",
            "app_name_length": f"{title_len}/30",
            "short_desc_length": f"{short_desc_len}/80",
            "keyword_density_pct": f"{density}%",
            "android_vitals_status": vitals_status,
            "status": "APPROVED_FOR_SUBMISSION" if not issues else "REJECTED_NON_COMPLIANT",
            "violations": issues
        }
        
    return audit_result

# Audit Apple App Store Submission
apple_meta = {
    "app_name": "ApexFit: Workout & Calorie Log",
    "subtitle": "Daily Fitness Coach & Planner",
    "keyword_field": "fitness,workout,tracker,calorie,gym,weights,muscle,hiit,coach,routine"
}
a_res = audit_aso_metadata_compliance(apple_meta, store="apple")
print("ASO Metadata Compliance Audit (Apple iOS):")
print(f"- Store: {a_res['store']} | Status: {a_res['status']}")
print(f"- Character Bounds: Title={a_res['app_name_length']}, Subtitle={a_res['subtitle_length']}, Keywords={a_res['keyword_field_length']}")
print(f"- Violations: {a_res['violations']}")
'''

    p1_output = """ASO Metadata Compliance Audit (Apple iOS):
- Store: Apple_App_Store | Status: APPROVED_FOR_SUBMISSION
- Character Bounds: Title=30/30, Subtitle=29/30, Keywords=69/100
- Violations: []"""

    parts.append({
        "part": 1,
        "title": "ASO Keyword Indexing & Store Compliance Mechanics",
        "say": p1_say,
        "rawCode": p1_code,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            "Audits Apple metadata against 30-character title, 30-character subtitle, and 100-character keyword field caps.",
            "Enforces zero-space, comma-delimited syntax for iOS keyword fields to maximize indexed search terms.",
            "Validates Google Play keyword density (2.0%-2.5%) and Android Vitals thresholds (crash < 1.09%, ANR < 0.47%)."
        ],
        "example": "Like packing luggage for a strict budget airline where a single overweight suitcase (title > 30 chars) gets your entire app rejected at the gate.",
        "tryIt": "Add spaces after the commas in apple_meta['keyword_field'] to verify that the compliance engine catches the illegal space syntax.",
        "check": {
            "question": "What is the primary difference in keyword indexing between the Apple App Store and the Google Play Store?",
            "options": [
                "Apple indexes Title, Subtitle, and a hidden Keyword Field; Google indexes Title, Short Description, and Long Description like a web crawler.",
                "Apple indexes emojis while Google Play only indexes Latin character strings.",
                "Google Play requires apps to pay $5,000 per keyword to be listed in search results.",
                "Apple indexes user reviews and support tickets while Google ignores all customer feedback."
            ],
            "answer": 0,
            "why": "Apple uses strict metadata fields (Title, Subtitle, 100-char Keyword field) and ignores the description, whereas Google Play crawls the entire description using natural language search algorithms.",
            "answerIndex": 0,
            "explanation": "Apple uses strict metadata fields (Title, Subtitle, 100-char Keyword field) and ignores the description, whereas Google Play crawls the entire description using natural language search algorithms."
        }
    })

    # Part 2: Conversion Rate Optimization for App Store Product Pages (Custom Product Pages & CPPs)
    p2_say = [
        "Securing high organic search rankings in the app store only generates impressions; converting those impressions into app downloads requires App Store Conversion Rate Optimization (CRO). The visual assets of an app store listing—specifically the App Icon, the first three Screenshots, and the optional App Preview Video—dictate over 80% of a user's decision to download. Eye-tracking telemetry reveals that fewer than 15% of mobile users ever tap 'Read More' to inspect the written description.",
        
        "Historically, app listings were monolithic: every user who landed on the app page saw the identical icon, headline, and screenshots, regardless of whether they searched for 'yoga for seniors', 'marathon training', or clicked an ad from a fitness influencer. Apple revolutionized mobile CRO by introducing Custom Product Pages (CPPs) in iOS 15, while Google Play introduced Custom Store Listings (CSLs).",
        
        "Custom Product Pages enable growth teams to create up to 35 tailored versions of their App Store product page, each featuring distinct screenshots, promotional text, and app preview videos linked to unique URLs. By pairing specific paid social ad creatives with contextually identical CPPs—such as directing users who clicked a marathon running ad to a CPP highlighting GPS running pace and distance tracking—enterprises eliminate cognitive dissonance, boosting impression-to-install conversion rates from a baseline of 12% to over 24%.",
        
        "In our Python simulation for Part 2, we build an App Store Custom Product Page (CPP) Performance and Conversion Uplift Engine. The script evaluates impression and download telemetry across default product pages versus targeted CPP variants, computes conversion rate lifts, and models the incremental installs generated. Review the code below to see mobile CRO modeling."
    ]

    p2_code = r'''def analyze_app_product_page_cro(store_variants: list) -> dict:
    """
    Evaluates Impression-to-Install conversion rates across default product pages
    and Custom Product Pages (CPPs). Calculates relative conversion uplift.
    """
    results = []
    default_cvr = 0.0
    total_impressions = 0
    total_installs = 0
    
    # First pass: find default baseline
    for v in store_variants:
        if v.get("is_default", False):
            default_cvr = round((v["installs"] / max(1, v["impressions"])) * 100.0, 2)
            break
            
    for v in store_variants:
        name = v["variant_name"]
        impr = v["impressions"]
        inst = v["installs"]
        cvr = round((inst / max(1, impr)) * 100.0, 2)
        
        uplift_pct = round(((cvr - default_cvr) / default_cvr) * 100.0, 2) if default_cvr > 0 else 0.0
        
        total_impressions += impr
        total_installs += inst
        
        results.append({
            "variant": name,
            "impressions": impr,
            "installs": inst,
            "cvr_pct": cvr,
            "uplift_vs_default_pct": uplift_pct
        })
        
    blended_cvr = round((total_installs / max(1, total_impressions)) * 100.0, 2)
    
    return {
        "variants": results,
        "default_cvr_pct": default_cvr,
        "blended_cvr_pct": blended_cvr,
        "total_installs": total_installs
    }

# App Store Telemetry (Default vs 2 Custom Product Pages)
variants_telemetry = [
    {"variant_name": "Default_Generic_Listing", "impressions": 100000, "installs": 12500, "is_default": True},
    {"variant_name": "CPP_Marathon_Runners", "impressions": 45000, "installs": 10350, "is_default": False},
    {"variant_name": "CPP_Yoga_Meditation", "impressions": 35000, "installs": 7700, "is_default": False}
]

cro_res = analyze_app_product_page_cro(variants_telemetry)
print("App Store CRO & Custom Product Page (CPP) Uplift Analysis:")
print(f"- Default Product Page Baseline CVR: {cro_res['default_cvr_pct']}%")
print(f"- Blended Omni-Listing CVR: {cro_res['blended_cvr_pct']}% | Total Installs: {cro_res['total_installs']:,}")
print("Variant Performance Breakdown:")
for v in cro_res["variants"]:
    sign = "+" if v["uplift_vs_default_pct"] > 0 else ""
    print(f"- {v['variant']:24} | CVR: {v['cvr_pct']:5.2f}% | Uplift: {sign}{v['uplift_vs_default_pct']:5.2f}% | Installs: {v['installs']:,}")
'''

    p2_output = """App Store CRO & Custom Product Page (CPP) Uplift Analysis:
- Default Product Page Baseline CVR: 12.5%
- Blended Omni-Listing CVR: 16.97% | Total Installs: 30,550
Variant Performance Breakdown:
- Default_Generic_Listing  | CVR: 12.50% | Uplift:  0.00% | Installs: 12,500
- CPP_Marathon_Runners     | CVR: 23.00% | Uplift: +84.00% | Installs: 10,350
- CPP_Yoga_Meditation      | CVR: 22.00% | Uplift: +76.00% | Installs: 7,700"""

    parts.append({
        "part": 2,
        "title": "Custom Product Pages (CPPs) & Visual Asset CRO",
        "say": p2_say,
        "rawCode": p2_code,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            "Evaluates Impression-to-Install conversion rates across default vs targeted Custom Product Pages (CPPs).",
            "Demonstrates that tailored screenshot messaging produces an +84% conversion uplift for marathon audiences.",
            "Expands blended app store install velocity from 12.5% to 17.0% across 180,000 total impressions."
        ],
        "example": "Like a department store that changes its front window display dynamically based on whether an approaching shopper is dressed in running gear or business attire.",
        "tryIt": "Add a fourth variant 'CPP_Crossfit' with 20,000 impressions and 5,000 installs to evaluate its relative conversion performance.",
        "check": {
            "question": "What is the primary architectural purpose of deploying Apple Custom Product Pages (CPPs)?",
            "options": [
                "To display hyper-relevant screenshot and video variations that match specific audience segments or paid ad creatives.",
                "To allow users to download paid applications without authenticating with Apple ID or FaceID.",
                "To increase the maximum file download size limit of the application beyond 2 Gigabytes.",
                "To automatically bypass Apple's 30% in-app purchase commission fee."
            ],
            "answer": 0,
            "why": "CPPs allow marketers to align tailored screenshots and messaging with specific marketing campaigns and user segments, dramatically increasing conversion rates.",
            "answerIndex": 0,
            "explanation": "CPPs allow marketers to align tailored screenshots and messaging with specific marketing campaigns and user segments, dramatically increasing conversion rates."
        }
    })

    # Part 3: Apple Search Ads (ASA): Brand Protection, Discovery & Share of Voice
    p3_say = [
        "In the mobile ecosystem, search is the primary driver of high-intent downloads: over 65% of all App Store downloads occur directly after a user conducts an app store search query. To monetize this intent, Apple deployed Apple Search Ads (ASA), a native sponsored search auction operating directly inside the App Store. A high-performance ASA campaign structure is partitioned into four disciplined campaign tiers.",
        
        "Tier 1 is Brand Protection. Even if an enterprise ranks organically as the #1 result for its own trademarked name, aggressive competitors can and will bid on that exact brand keyword to conquest prospective users at the exact moment of intent. Bidding on one's own brand terms guarantees a 90%+ Share of Voice (SOV) and depresses competitor conquesting at a negligible Cost-Per-Tap (CPT).",
        
        "Tier 2 is Category / Generic Search, targeting high-volume unbranded search terms (e.g., 'budget planner', 'calorie counter') with exact match bidding. Tier 3 is Competitor Conquesting, intentionally bidding on rival app titles to capture users dissatisfied with alternative solutions. Tier 4 is Discovery / Search Match, which leverages Apple's semantic matching algorithms and broad match keywords to uncover long-tail search queries that can subsequently be harvested into Tier 2 as exact match targets.",
        
        "In our Python simulation for Part 3, we build an Apple Search Ads (ASA) Campaign Auction Simulator. The script processes performance metrics across Brand Defense, Generic, Competitor, and Discovery campaign tiers, computes Cost-Per-Tap (CPT), Cost-Per-Acquisition (CPA), and Share of Voice (SOV), and outputs the campaign telemetry report. Review the ASA auction simulation below."
    ]

    p3_code = r'''def simulate_apple_search_ads_campaigns(campaign_tiers: list) -> dict:
    """
    Evaluates Apple Search Ads performance across Brand, Generic, Competitor, and Discovery tiers.
    Computes Cost-Per-Tap (CPT), Cost-Per-Acquisition (CPA), Tap-Through Rate (TTR), and CVR.
    """
    audit = []
    total_spend = 0.0
    total_installs = 0
    
    for camp in campaign_tiers:
        name = camp["tier_name"]
        spend = camp["spend_usd"]
        impr = camp["impressions"]
        taps = camp["taps"]
        inst = camp["installs"]
        sov = camp["share_of_voice_pct"]
        
        ttr = round((taps / max(1, impr)) * 100.0, 2)
        cvr = round((inst / max(1, taps)) * 100.0, 2)
        cpt = round(spend / max(1, taps), 2)
        cpa = round(spend / max(1, inst), 2)
        
        total_spend += spend
        total_installs += inst
        
        audit.append({
            "tier": name,
            "spend": spend,
            "sov_pct": sov,
            "ttr_pct": ttr,
            "cvr_pct": cvr,
            "cpt_usd": cpt,
            "cpa_usd": cpa,
            "installs": inst
        })
        
    blended_cpa = round(total_spend / max(1, total_installs), 2)
    
    return {
        "campaign_tiers": audit,
        "total_spend_usd": total_spend,
        "total_installs": total_installs,
        "blended_cpa_usd": blended_cpa
    }

# Campaign Telemetry Across 4 ASA Tiers
asa_data = [
    {"tier_name": "Tier_1_Brand_Defense", "spend_usd": 5000.0, "impressions": 120000, "taps": 36000, "installs": 25200, "share_of_voice_pct": 92.0},
    {"tier_name": "Tier_2_Generic_Category", "spend_usd": 15000.0, "impressions": 85000, "taps": 10200, "installs": 5100, "share_of_voice_pct": 45.0},
    {"tier_name": "Tier_3_Competitor_Conquest", "spend_usd": 12000.0, "impressions": 60000, "taps": 4800, "installs": 1440, "share_of_voice_pct": 28.0},
    {"tier_name": "Tier_4_Discovery_Mining", "spend_usd": 6000.0, "impressions": 40000, "taps": 3200, "installs": 1280, "share_of_voice_pct": 35.0}
]

asa_res = simulate_apple_search_ads_campaigns(asa_data)
print("Apple Search Ads (ASA) Multi-Tier Performance Audit:")
print(f"- Total Spend: ${asa_res['total_spend_usd']:,.2f} | Total Installs: {asa_res['total_installs']:,} | Blended CPA: ${asa_res['blended_cpa_usd']}")
print("Campaign Tier Breakdown:")
for c in asa_res["campaign_tiers"]:
    print(f"- {c['tier']:26} | SOV: {c['sov_pct']:4.1f}% | CPT: ${c['cpt_usd']:4.2f} | CPA: ${c['cpa_usd']:5.2f} | CVR: {c['cvr_pct']:5.2f}% | Installs: {c['installs']:,}")
'''

    p3_output = """Apple Search Ads (ASA) Multi-Tier Performance Audit:
- Total Spend: $38,000.00 | Total Installs: 33,020 | Blended CPA: $1.15
Campaign Tier Breakdown:
- Tier_1_Brand_Defense       | SOV: 92.0% | CPT: $0.14 | CPA: $ 0.20 | CVR: 70.00% | Installs: 25,200
- Tier_2_Generic_Category    | SOV: 45.0% | CPT: $1.47 | CPA: $ 2.94 | CVR: 50.00% | Installs: 5,100
- Tier_3_Competitor_Conquest | SOV: 28.0% | CPT: $2.50 | CPA: $ 8.33 | CVR: 30.00% | Installs: 1,440
- Tier_4_Discovery_Mining    | SOV: 35.0% | CPT: $1.88 | CPA: $ 4.69 | CVR: 40.00% | Installs: 1,280"""

    parts.append({
        "part": 3,
        "title": "Apple Search Ads (ASA) Bidding & Share of Voice (SOV)",
        "say": p3_say,
        "rawCode": p3_code,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            "Partitions ASA campaigns into Brand Defense, Generic Category, Competitor Conquest, and Discovery Mining.",
            "Demonstrates that Brand Defense captures 92% Share of Voice at a negligible $0.20 CPA and 70% CVR.",
            "Balances cheap brand protection with higher-cost competitor conquesting to produce a blended $1.15 CPA."
        ],
        "example": "Like an airline owning the billboard directly above its own terminal (Brand Defense) while also renting a smaller billboard across the street from a rival airline's check-in counter (Competitor Conquest).",
        "tryIt": "Increase spend in Tier 3 Competitor Conquest to $20,000 to see how aggressive conquesting shifts blended CPA upward.",
        "check": {
            "question": "Why is it essential to bid on one's own trademarked brand terms in Apple Search Ads?",
            "options": [
                "To prevent aggressive competitors from conquesting your high-intent searchers and capturing 90%+ Share of Voice.",
                "Because Apple will permanently remove the app from the store if it does not spend at least $1,000 on brand ads.",
                "To allow the app to be installed automatically without user confirmation.",
                "To eliminate all sales tax obligations associated with in-app digital purchases."
            ],
            "answer": 0,
            "why": "If an app does not bid on its own trademarked terms, competitors can bid on that keyword and display their sponsored ad above the organic result, stealing high-intent customers.",
            "answerIndex": 0,
            "explanation": "If an app does not bid on its own trademarked terms, competitors can bid on that keyword and display their sponsored ad above the organic result, stealing high-intent customers."
        }
    })

    # Part 4: Mobile Measurement Partners (MMPs), SKAdNetwork 4.0 & Conversion Values
    p4_say = [
        "The introduction of Apple's App Tracking Transparency (ATT) framework in iOS 14.5 permanently disrupted legacy mobile attribution. With over 80% of iOS users opting out of tracking, deterministic device identifiers (Apple IDFA) were effectively eradicated. To provide privacy-safe attribution without user tracking, Apple deployed SKAdNetwork (SKAN), with modern mobile acquisition operating on SKAdNetwork 4.0.",
        
        "SKAN 4.0 abandons user-level tracking in favor of cryptographically signed, delayed postbacks sent directly from iOS to ad networks and Mobile Measurement Partners (MMPs) such as AppsFlyer, Adjust, and Branch. SKAN postbacks feature three distinct conversion windows: Window 1 (0 to 2 days post-install), Window 2 (3 to 7 days), and Window 3 (8 to 35 days). Furthermore, Apple enforces Crowd Anonymity tiers (Low, Medium, High) based on ad campaign install volume to prevent fingerprinting.",
        
        "The core technical mechanism of SKAN is the Conversion Value (CV). In Window 1, apps transmit a 6-bit Fine-Grained Conversion Value (an integer from 0 to 63) when crowd anonymity is satisfied, alongside Coarse-Grained values ('low', 'medium', 'high'). MMPs work with mobile engineers to map these 64 discrete integers into revenue tiers and behavioral milestones (e.g., CV 0-10 = completed tutorial; CV 11-30 = added payment method; CV 31-63 = purchase value > $50). By predicting long-term Customer Lifetime Value from 48-hour fine-grained conversion values, mobile acquisition algorithms optimize ad bids in a privacy-safe world.",
        
        "In our Python simulation for Part 4, we build an SKAdNetwork 4.0 Conversion Value Decoder and LTV Modeling Engine. The script ingests simulated SKAN postbacks, decodes fine-grained integers and coarse-grained buckets, maps behavioral monetization tiers, and aggregates cohort revenue. Examine the code below to understand post-IDFA mobile attribution."
    ]

    p4_code = r'''def decode_skan_conversion_values(postbacks: list) -> dict:
    """
    Decodes Apple SKAdNetwork (SKAN 4.0) conversion values (Fine: 0-63, Coarse: low/medium/high).
    Maps encoded values to behavioral revenue tiers and computes estimated cohort LTV.
    """
    decoded_events = []
    total_modeled_revenue = 0.0
    
    # Conversion Value Mapping Schema
    # 0: Install only
    # 1-10: Onboarding completed ($0)
    # 11-25: Freemium engaged ($5 modeled value)
    # 26-45: Subscription trial started ($25 modeled value)
    # 46-63: Direct IAP transaction completed ($85 modeled value)
    
    for pb in postbacks:
        p_id = pb["postback_id"]
        fine_cv = pb.get("fine_conversion_value")
        coarse_cv = pb.get("coarse_conversion_value", "none")
        ad_network = pb["ad_network"]
        
        if fine_cv is not None:
            if fine_cv == 0:
                tier = "INSTALL_ONLY"
                modeled_val = 0.0
            elif fine_cv <= 10:
                tier = "ONBOARDING_COMPLETED"
                modeled_val = 0.0
            elif fine_cv <= 25:
                tier = "FREEMIUM_ENGAGED"
                modeled_val = 5.0
            elif fine_cv <= 45:
                tier = "TRIAL_SUBSCRIBER"
                modeled_val = 25.0
            else:
                tier = "HIGH_VALUE_IAP_PURCHASE"
                modeled_val = 85.0
        else:
            # Fallback to Coarse-Grained values under low crowd anonymity
            if coarse_cv == "high":
                tier = "COARSE_HIGH_VALUE"
                modeled_val = 50.0
            elif coarse_cv == "medium":
                tier = "COARSE_MEDIUM_VALUE"
                modeled_val = 15.0
            else:
                tier = "COARSE_LOW_VALUE"
                modeled_val = 2.0
                
        total_modeled_revenue += modeled_val
        decoded_events.append({
            "postback_id": p_id,
            "network": ad_network,
            "fine_cv": fine_cv,
            "coarse_cv": coarse_cv,
            "mapped_tier": tier,
            "modeled_revenue_usd": modeled_val
        })
        
    return {
        "decoded_postbacks": decoded_events,
        "total_postbacks_processed": len(postbacks),
        "total_modeled_revenue_usd": total_modeled_revenue
    }

# Simulated SKAN 4.0 Ingested Postbacks
sample_postbacks = [
    {"postback_id": "SKAN_001", "ad_network": "Google_Ads", "fine_conversion_value": 52, "coarse_conversion_value": "high"},
    {"postback_id": "SKAN_002", "ad_network": "Meta_Ads", "fine_conversion_value": 34, "coarse_conversion_value": "medium"},
    {"postback_id": "SKAN_003", "ad_network": "TikTok_Ads", "fine_conversion_value": 18, "coarse_conversion_value": "medium"},
    {"postback_id": "SKAN_004", "ad_network": "Unity_Ads", "fine_conversion_value": None, "coarse_conversion_value": "low"}
]

skan_res = decode_skan_conversion_values(sample_postbacks)
print("Apple SKAdNetwork 4.0 Telemetry & Conversion Value Decoder:")
for p in skan_res["decoded_postbacks"]:
    fine_str = f"Fine={p['fine_cv']:2}" if p['fine_cv'] is not None else "Fine=None"
    print(f"- [{p['postback_id']}] Network: {p['network']:10} | {fine_str} | Coarse: {p['coarse_cv']:6} | Tier: {p['mapped_tier']:24} | Rev: ${p['modeled_revenue_usd']:5.2f}")
print(f"Total Cohort Modeled Revenue: ${skan_res['total_modeled_revenue_usd']:,.2f}")
'''

    p4_output = """Apple SKAdNetwork 4.0 Telemetry & Conversion Value Decoder:
- [SKAN_001] Network: Google_Ads | Fine=52 | Coarse: high   | Tier: HIGH_VALUE_IAP_PURCHASE  | Rev: $85.00
- [SKAN_002] Network: Meta_Ads   | Fine=34 | Coarse: medium | Tier: TRIAL_SUBSCRIBER         | Rev: $25.00
- [SKAN_003] Network: TikTok_Ads | Fine=18 | Coarse: medium | Tier: FREEMIUM_ENGAGED         | Rev: $ 5.00
- [SKAN_004] Network: Unity_Ads  | Fine=None | Coarse: low    | Tier: COARSE_LOW_VALUE         | Rev: $ 2.00
Total Cohort Modeled Revenue: $117.00"""

    parts.append({
        "part": 4,
        "title": "SKAdNetwork 4.0 Architecture & Conversion Value Schemas",
        "say": p4_say,
        "rawCode": p4_code,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            "Decodes Apple SKAN 4.0 6-bit fine-grained conversion values (0-63) into behavioral revenue tiers.",
            "Handles fallback coarse-grained values (low/medium/high) when crowd anonymity thresholds are unmet.",
            "Models cohort revenue and LTV from 48-hour in-app telemetry without violating user privacy."
        ],
        "example": "Like receiving an encrypted postcard from a secret agent with only a 2-digit number (52), which your codebook decodes to mean 'VIP customer completed transaction over $50'.",
        "tryIt": "Add a fifth postback with fine_conversion_value=60 to observe its categorization as a high-value IAP purchase.",
        "check": {
            "question": "What is the primary operational role of Mobile Measurement Partners (MMPs) in the post-IDFA SKAdNetwork 4.0 era?",
            "options": [
                "To aggregate cryptographic SKAN postbacks, decode conversion value schemas, and predict long-term LTV for ad bidding.",
                "To bypass Apple's App Tracking Transparency prompt by installing unauthorized root certificates.",
                "To store plaintext copies of users' private contacts and text messages on third-party servers.",
                "To eliminate all cloud hosting fees associated with mobile backend databases."
            ],
            "answer": 0,
            "why": "MMPs ingest delayed, privacy-safe SKAN postbacks, decode fine and coarse conversion values according to business rules, and provide unified attribution analytics across ad networks.",
            "answerIndex": 0,
            "explanation": "MMPs ingest delayed, privacy-safe SKAN postbacks, decode fine and coarse conversion values according to business rules, and provide unified attribution analytics across ad networks."
        }
    })

    # Part 5: Enterprise Mobile Acquisition Gateway & Unified App Growth Command Tower
    p5_say = [
        "In this final capstone part for Day 19, we unify ASO keyword metadata, Custom Product Pages, Apple Search Ads campaigns, and SKAN 4.0 MMP attribution into an Enterprise Mobile Growth Command Tower and Acquisition Gateway. Mobile app acquisition is an interconnected ecosystem: high organic ASO rankings expand brand awareness, which lowers ASA bid clearing prices; tailored CPPs double conversion rates, which signals strong app quality to Apple's search algorithms; and SKAN telemetry provides the ground truth required to optimize algorithmic media bids.",
        
        "The Enterprise Mobile Gateway continuously monitors five operational dimensions: Metadata Compliance (zero formatting violations across Apple and Google), Store CRO Velocity (blended listing CVR >= 16%), Search Ad Dominance (Brand Defense SOV >= 90%), Postback Decoding Integrity (100% of SKAN postbacks mapped to LTV models), and Android Vitals Health (crash rates well below Google's 1.09% penalty threshold).",
        
        "We evaluate mobile growth maturity through the Mobile App Acquisition Index (MAAI / 100). Systems scoring 90.0 or above receive the industry credential of Mobile Growth and ASO Director Certified. This certification confirms that the mobile growth architect possesses the technical and economic capabilities required to scale mobile applications to the top of the global app store charts.",
        
        "In our final simulation, we run the Enterprise Mobile Growth Gateway across a multi-channel campaign portfolio of 500,000 mobile impressions. The script audits compliance, checks blended CVR, evaluates ASA spend efficiency, confirms SKAN ingestion health, and outputs the certified executive briefing. Execute the code below to complete Day 19."
    ]

    p5_code = r'''def run_enterprise_mobile_acquisition_gateway(telemetry: dict) -> dict:
    """
    Synthesizes ASO metadata compliance, CPP conversion rates, Apple Search Ads efficiency,
    and SKAN 4.0 postback telemetry into a unified Mobile App Acquisition Index (MAAI).
    """
    aso_compliant = telemetry["aso_compliant"]
    blended_cvr_pct = telemetry["blended_cvr_pct"]
    brand_sov_pct = telemetry["brand_sov_pct"]
    skan_mapping_rate = telemetry["skan_mapping_rate"]
    android_vitals_healthy = telemetry["android_vitals_healthy"]
    total_impressions = telemetry["total_impressions"]
    total_installs = telemetry["total_installs"]
    
    score = 0.0
    if aso_compliant: score += 20.0
    if blended_cvr_pct >= 15.0: score += 25.0
    if brand_sov_pct >= 90.0: score += 20.0
    if skan_mapping_rate >= 0.95: score += 20.0
    if android_vitals_healthy: score += 15.0
    
    tier = "ENTERPRISE_TOP_TIER_MOBILE_PORTFOLIO" if score >= 90.0 else "SUB_OPTIMAL"
    accreditation = "MOBILE_GROWTH_AND_ASO_DIRECTOR_CERTIFIED" if score >= 90.0 else "REAUDIT_REQUIRED"
    
    return {
        "maai_score": round(score, 1),
        "tier": tier,
        "accreditation": accreditation,
        "total_impressions": total_impressions,
        "total_installs": total_installs,
        "blended_cvr": f"{blended_cvr_pct}%",
        "brand_sov": f"{brand_sov_pct}%",
        "ecosystem_status": "APP_STORE_&_PLAY_STORE_OPTIMIZED"
    }

# Enterprise Mobile Gateway Execution
gateway_input = {
    "aso_compliant": True,
    "blended_cvr_pct": 17.5,
    "brand_sov_pct": 94.5,
    "skan_mapping_rate": 0.98,
    "android_vitals_healthy": True,
    "total_impressions": 500000,
    "total_installs": 87500
}

g_mob = run_enterprise_mobile_acquisition_gateway(gateway_input)
print("=== ENTERPRISE MOBILE GROWTH COMMAND TOWER & ASO GATEWAY ===")
print(f"Mobile Index (MAAI): {g_mob['maai_score']}/100 | Tier: {g_mob['tier']}")
print(f"Volume: {g_mob['total_impressions']:,} Impressions -> {g_mob['total_installs']:,} Installs ({g_mob['blended_cvr']} CVR)")
print(f"Brand Protection: {g_mob['brand_sov']} Share of Voice | Ecosystem: {g_mob['ecosystem_status']}")
print(f"Final Accreditation: {g_mob['accreditation']}")
'''

    p5_output = """=== ENTERPRISE MOBILE GROWTH COMMAND TOWER & ASO GATEWAY ===
Mobile Index (MAAI): 100.0/100 | Tier: ENTERPRISE_TOP_TIER_MOBILE_PORTFOLIO
Volume: 500,000 Impressions -> 87,500 Installs (17.5% CVR)
Brand Protection: 94.5% Share of Voice | Ecosystem: APP_STORE_&_PLAY_STORE_OPTIMIZED
Final Accreditation: MOBILE_GROWTH_AND_ASO_DIRECTOR_CERTIFIED"""

    parts.append({
        "part": 5,
        "title": "Enterprise Mobile Command Tower & Unified ASO Gateway",
        "say": p5_say,
        "rawCode": p5_code,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            "Integrates ASO metadata compliance, CPP conversion uplift, ASA Share of Voice, and SKAN decoding.",
            "Evaluates Mobile App Acquisition Index (MAAI) across five core enterprise operational dimensions.",
            "Grants MOBILE_GROWTH_AND_ASO_DIRECTOR_CERTIFIED accreditation for scores achieving 100.0."
        ],
        "example": "Like mission control overseeing a satellite launch, checking navigation telemetry, fuel reserves, orbital velocity, and payload communication links before declaring mission success.",
        "tryIt": "Set brand_sov_pct to 75.0% to observe how an inadequate brand defense drops the MAAI score.",
        "check": {
            "question": "What is the strategic synergy between App Store Optimization (ASO) and Apple Search Ads (ASA)?",
            "options": [
                "Strong organic ASO relevancy increases ASA Quality Score, which decreases cost-per-tap and expands ad impression share.",
                "Running ASA campaigns completely eliminates the need for software updates or bug fixes.",
                "ASO allows developers to publish mobile apps without paying Apple's annual developer program fee.",
                "ASA guarantees that competitors will be legally barred from displaying banner ads on websites."
            ],
            "answer": 0,
            "why": "Apple's ad auction evaluates relevance; well-optimized ASO metadata increases tap-through rates and relevance scores, allowing the app to win auction impressions at lower CPT clearing prices.",
            "answerIndex": 0,
            "explanation": "Apple's ad auction evaluates relevance; well-optimized ASO metadata increases tap-through rates and relevance scores, allowing the app to win auction impressions at lower CPT clearing prices."
        }
    })

    lesson_dict = {
        "coursePrefix": "bcom_dmkt",
        "day": 19,
        "title": "App Store Optimization (ASO) & Mobile User Acquisition",
        "totalParts": 5,
        "duration": "35m",
        "parts": parts
    }

    total_words = ensure_dmkt_day_budget(lesson_dict, min_part_words=580, min_day_words=2950)
    print(f"Day 19 build complete! Total words: {total_words}")
    for idx, p in enumerate(lesson_dict["parts"]):
        p_words = count_words(p["say"])
        print(f"  Part {idx + 1} words: {p_words}")

    return lesson_dict

if __name__ == '__main__':
    build_day19()
