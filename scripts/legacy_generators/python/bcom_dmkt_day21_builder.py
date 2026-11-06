"""
Day 21 Builder: Dynamic Retargeting & Ad Fatigue Frequency Capping
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 5 Kickoff
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day21_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 21,
        "title": "Dynamic Retargeting & Ad Fatigue Frequency Capping Architecture",
        "funnelSteps": [
            {
                "step": "CATALOG_AND_EVENT_SYNC",
                "label": "Product Catalog & SKU-Level Pixel Event Synchronization",
                "metric": "100.0% SKU Match Rate",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "RECENCY_WINDOW_TIERING",
                "label": "Audience Recency Decay & Bid Multiplier Segmentation",
                "metric": "4 Intent Tiers (1d to 30d)",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "FREQUENCY_CAPPING_GOVERNANCE",
                "label": "Daily Impression Capping & Spend Leakage Suppression",
                "metric": "Cap: 3 Imp/User/Day",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "AD_FATIGUE_AND_WEAROUT",
                "label": "CTR Decay Kinetics & Automated Creative Refresh Triggering",
                "metric": "Threshold: 30% CTR Decay",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "ENTERPRISE_RETARGETING_GATEWAY",
                "label": "Full-Stack Retargeting & Brand Equity Protection Gateway",
                "metric": "100.0/100 RFCI Certified",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "Catalog SKU Match Rate", "value": "100.0%"},
            {"label": "Optimal Frequency Cap", "value": "3 Imp/Day"},
            {"label": "Max Allowed CTR Decay", "value": "30.0%"},
            {"label": "Composite RFCI Score", "value": "100.0/100"}
        ]
    }

def build_day21_lesson() -> dict:
    p1_code = r'''def simulate_dpa_catalog_sync(catalog: list, events: list) -> dict:
    """
    Synchronizes e-commerce product catalog with pixel/CAPI event streams
    to generate personalized Dynamic Product Ads (DPA) with live pricing.
    """
    matched = []
    for ev in events:
        sku = ev.get("sku")
        item = next((c for c in catalog if c["sku"] == sku), None)
        if item and item["in_stock"]:
            discount_pct = round(((item["was_price"] - item["price"]) / item["was_price"]) * 100, 1)
            matched.append({
                "user_id": ev["user_id"],
                "sku": sku,
                "title": item["title"],
                "price": item["price"],
                "discount_pct": discount_pct
            })
    return {
        "catalog_skus_count": len(catalog),
        "events_processed": len(events),
        "matched_ads_rendered": len(matched),
        "ads": matched,
        "status": "CATALOG_SYNC_SUCCESSFUL"
    }

if __name__ == "__main__":
    catalog = [
        {"sku": "SKU-ULTRA-BOOT", "title": "Apex Trail Pro Boot", "price": 149.99, "was_price": 199.99, "in_stock": True},
        {"sku": "SKU-THERMAL-JACKET", "title": "Nordic Shield Parka", "price": 249.99, "was_price": 299.99, "in_stock": True},
        {"sku": "SKU-MERINO-SOCKS", "title": "Alpine Merino Pack", "price": 29.99, "was_price": 29.99, "in_stock": False}
    ]
    events = [
        {"user_id": "USR-801", "sku": "SKU-ULTRA-BOOT", "event": "add_to_cart"},
        {"user_id": "USR-802", "sku": "SKU-THERMAL-JACKET", "event": "view_item"},
        {"user_id": "USR-803", "sku": "SKU-MERINO-SOCKS", "event": "view_item"}
    ]
    res = simulate_dpa_catalog_sync(catalog, events)
    print("DPA Catalog Sync Report:")
    print(f"  Catalog SKUs: {res['catalog_skus_count']}")
    print(f"  Events Processed: {res['events_processed']}")
    print(f"  Dynamic Ads Rendered: {res['matched_ads_rendered']}")
    for ad in res['ads']:
        print(f"    User {ad['user_id']}: {ad['sku']} ({ad['title']}) - ${ad['price']} (-{ad['discount_pct']}%)")
    print(f"  Status: {res['status']}")
'''

    p2_code = r'''def calculate_recency_bid_multiplier(days_since_visit: int, event_type: str, has_purchased: bool) -> dict:
    """
    Computes dynamic bid multiplier based on intent event and recency decay.
    Recent buyers are suppressed (0.0x) to eliminate ad waste.
    """
    if has_purchased:
        return {"tier": "PAST_PURCHASER_EXCLUDED", "bid_multiplier": 0.0, "priority": "SUPPRESSED"}
    
    # Event base weight
    event_weights = {"add_to_cart": 2.5, "view_item": 1.5, "page_view": 1.0}
    base = event_weights.get(event_type, 1.0)
    
    # Recency decay brackets
    if days_since_visit <= 3:
        recency_factor = 1.0
        tier = "HIGH_INTENT_HOT_WINDOW_1_3D"
    elif days_since_visit <= 7:
        recency_factor = 0.75
        tier = "WARM_INTENT_WINDOW_4_7D"
    elif days_since_visit <= 14:
        recency_factor = 0.50
        tier = "COOLING_WINDOW_8_14D"
    else:
        recency_factor = 0.25
        tier = "COLD_RETARGETING_WINDOW_15_30D"
        
    final_mult = round(base * recency_factor, 2)
    return {
        "tier": tier,
        "event_type": event_type,
        "days_since_visit": days_since_visit,
        "bid_multiplier": final_mult,
        "priority": "ACTIVE_RETARGETING"
    }

if __name__ == "__main__":
    test_users = [
        {"uid": "USR-101", "days": 1, "event": "add_to_cart", "purchased": False},
        {"uid": "USR-102", "days": 5, "event": "view_item", "purchased": False},
        {"uid": "USR-103", "days": 12, "event": "page_view", "purchased": False},
        {"uid": "USR-104", "days": 2, "event": "add_to_cart", "purchased": True}
    ]
    print("Audience Recency Bid Multiplier Report:")
    for u in test_users:
        r = calculate_recency_bid_multiplier(u["days"], u["event"], u["purchased"])
        print(f"  {u['uid']}: {r['tier']} -> Multiplier: {r['bid_multiplier']}x ({r['priority']})")
'''

    p3_code = r'''def evaluate_frequency_cap_and_pacing(user_id: str, daily_impressions: int, max_daily_cap: int = 3) -> dict:
    """
    Evaluates whether an incoming bid request breaches the maximum daily
    frequency cap per user, suppressing over-exposed bid requests.
    """
    should_bid = daily_impressions < max_daily_cap
    remaining = max(0, max_daily_cap - daily_impressions)
    action = "BID_SUBMITTED_TO_EXCHANGE" if should_bid else "BID_SUPPRESSED_CAP_EXCEEDED"
    
    return {
        "user_id": user_id,
        "daily_impressions_served": daily_impressions,
        "max_daily_cap": max_daily_cap,
        "remaining_impressions_allowed": remaining,
        "should_bid": should_bid,
        "action": action
    }

if __name__ == "__main__":
    requests = [
        {"uid": "USR-401", "served": 0},
        {"uid": "USR-402", "served": 2},
        {"uid": "USR-403", "served": 3},
        {"uid": "USR-404", "served": 5}
    ]
    print("Programmatic Frequency Capping Evaluation:")
    for req in requests:
        res = evaluate_frequency_cap_and_pacing(req["uid"], req["served"])
        print(f"  {res['user_id']} (Served: {res['daily_impressions_served']}/{res['max_daily_cap']}): {res['action']}")
'''

    p4_code = r'''def audit_ad_fatigue_and_wearout(ad_set_id: str, baseline_ctr: float, current_ctr: float, frequency_per_user: float) -> dict:
    """
    Audits creative fatigue based on CTR decay and average user frequency.
    Triggers creative refresh if CTR drops by >= 30% or frequency > 4.5.
    """
    ctr_drop_pct = round(((baseline_ctr - current_ctr) / baseline_ctr) * 100, 2)
    is_fatigued = (ctr_drop_pct >= 30.0) or (frequency_per_user > 4.5)
    
    action = "TRIGGER_IMMEDIATE_CREATIVE_REFRESH" if is_fatigued else "MAINTAIN_CURRENT_ROTATION"
    fatigue_severity = "CRITICAL_FATIGUE_PAUSE_AD" if is_fatigued else "HEALTHY_CREATIVE_PERFORMANCE"
    
    return {
        "ad_set_id": ad_set_id,
        "baseline_ctr_pct": baseline_ctr,
        "current_ctr_pct": current_ctr,
        "ctr_drop_pct": ctr_drop_pct,
        "frequency_per_user": frequency_per_user,
        "is_ad_fatigued": is_fatigued,
        "action": action,
        "status": fatigue_severity
    }

if __name__ == "__main__":
    ad_sets = [
        {"id": "ADSET-ALPHA", "base_ctr": 2.4, "curr_ctr": 2.2, "freq": 2.1},
        {"id": "ADSET-BETA", "base_ctr": 3.0, "curr_ctr": 2.8, "freq": 3.4},
        {"id": "ADSET-GAMMA", "base_ctr": 2.5, "curr_ctr": 1.5, "freq": 5.2}
    ]
    print("Ad Creative Fatigue & Wear-Out Audit:")
    for a in ad_sets:
        res = audit_ad_fatigue_and_wearout(a["id"], a["base_ctr"], a["curr_ctr"], a["freq"])
        print(f"  {res['ad_set_id']}: CTR Drop -{res['ctr_drop_pct']}% (Freq {res['frequency_per_user']}) -> {res['action']}")
'''

    p5_code = r'''def audit_enterprise_retargeting_gateway(
    catalog_sync_ok: bool,
    recency_window_ok: bool,
    frequency_capping_ok: bool,
    fatigue_monitoring_ok: bool
) -> dict:
    """
    Enterprise Retargeting Gateway: Integrates real-time catalog synchronization,
    recency-based bid decay, frequency capping, and automated creative refresh triggers.
    """
    all_nominal = catalog_sync_ok and recency_window_ok and frequency_capping_ok and fatigue_monitoring_ok
    score = 100.0 if all_nominal else 70.0
    
    verdict = "RETARGETING_AND_FREQUENCY_CAPPING_ARCHITECT_CERTIFIED" if all_nominal else "RETARGETING_GOVERNANCE_DEFECT"
    
    return {
        "catalog_sync_active": catalog_sync_ok,
        "recency_tiering_active": recency_window_ok,
        "frequency_capping_enforced": frequency_capping_ok,
        "fatigue_refresh_operational": fatigue_monitoring_ok,
        "rfci_score": score,
        "certification": verdict,
        "status": "ENTERPRISE_RETARGETING_NOMINAL" if all_nominal else "AUDIT_REMEDIATION_REQUIRED"
    }

if __name__ == "__main__":
    gateway = audit_enterprise_retargeting_gateway(
        catalog_sync_ok=True,
        recency_window_ok=True,
        frequency_capping_ok=True,
        fatigue_monitoring_ok=True
    )
    print("Enterprise Retargeting & Frequency Capping Gateway Report:")
    print(f"  Catalog Sync Active: {gateway['catalog_sync_active']}")
    print(f"  Recency Tiering Active: {gateway['recency_tiering_active']}")
    print(f"  Frequency Capping Enforced: {gateway['frequency_capping_enforced']}")
    print(f"  Fatigue Refresh Operational: {gateway['fatigue_refresh_operational']}")
    print(f"  RFCI Composite Score: {gateway['rfci_score']} / 100.0")
    print(f"  Accreditation Verdict: {gateway['certification']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 21,
        "title": "Dynamic Retargeting & Ad Fatigue Frequency Capping Architecture",
        "goal": "Master advanced lower-funnel retargeting: Dynamic Product Ads (DPA) catalog feeds, audience recency decay brackets, programmatic frequency capping, ad creative fatigue kinetics, and the Enterprise Retargeting Gateway.",
        "minutes": 35,
        "recap": "Day 21 kicks off Milestone 5 with full-funnel retargeting science. Learn to synchronize live catalog SKUs into dynamic creatives, modulate bids by intent recency, cap user impressions to eliminate ad fatigue, and protect brand equity through automated refresh triggers.",
        "parts": [
            {
                "title": "Dynamic Product Ads (DPA) & Catalog Feed Synchronization",
                "say": [
                    "Welcome to Day 21 of Digital Marketing Analytics and Performance Strategy. Today, we initiate Milestone 5: Full-Funnel Performance Retargeting, Unit Economics, Conversational Commerce, and Econometric Marketing Mix Modeling. We begin by examining the premier engine of lower-funnel e-commerce conversion: Dynamic Product Ads (DPA). In generic retargeting, an advertiser serves static, one-size-fits-all banner ads to every visitor who browsed their website. This blunt approach suffers from dismal conversion rates and high creative burnout.",
                    "Dynamic Product Ads transform retargeting into an automated, highly personalized shopping assistant. Under the DPA architecture, the advertiser maintains a synchronized product catalog feed (such as Google Merchant Center XML or Meta Commerce Manager CSV) containing item-level attributes: SKU identifier, product title, real-time selling price, original MSRP, inventory stock availability, and high-resolution image URLs. When a user navigates the e-commerce storefront, client-side pixel tags and server-side Conversions API (CAPI) events transmit specific behavioral telemetry—such as view_item, view_item_list, and add_to_cart—carrying exact SKU identifiers in the event payload.",
                    "The advertising platform's recommendation engine matches the incoming SKU identifier against the advertiser's master catalog feed in under 50 milliseconds. If the item is in stock, the platform programmatically synthesizes a customized ad creative—such as a dynamic carousel or collection card—featuring the exact product the user viewed, complete with current pricing, localized currency, and dynamic promotional badges (such as '25% Off - Limited Stock'). If an item falls out of stock, the feed synchronizer automatically suppresses that SKU from active ad sets, eliminating wasted media spend on unfulfillable orders.",
                    "Furthermore, dynamic catalog synchronization mitigates cross-device attribution gaps. Because DPA matching is tied to hashed user identities and product SKUs, a consumer who browsed a luxury parka on their desktop during work hours can be retargeted with that exact parka on Instagram mobile during their evening commute. This granular SKU-level relevance drives click-through rates that are typically 3x to 5x higher than static display advertising, recovering abandoned purchase intent at scale.",
                    "In our institutional Python simulation for Part 1, we construct an enterprise DPA catalog synchronization engine. The system ingests a product catalog with pricing and inventory states, processes incoming user intent event payloads (view_item and add_to_cart), validates stock availability, calculates dynamic discount percentages, and outputs personalized ad creative payloads. Examine the code below to see how institutional retargeting engines execute catalog matching deterministically."
                ],
                "example": "Enterprise Case Study: A global outdoor apparel retailer implemented Dynamic Product Ads synchronized with their Shopify Plus inventory feed. Prior to DPA, their generic static retargeting banners delivered a 0.85% CTR and 1.8x ROAS. Following DPA deployment, users who abandoned shopping carts were served dynamic carousels displaying the exact boots and jackets they had added, with live stock counters. The catalog feed automatically filtered out out-of-stock sizes. Within 30 days, their retargeting CTR surged to 3.42%, cart recovery conversion rates doubled from 4.2% to 8.6%, and retargeting ROAS climbed to 6.2x.",
                "code": p1_code,
                "output": "DPA Catalog Sync Report:\n  Catalog SKUs: 3\n  Events Processed: 3\n  Dynamic Ads Rendered: 2\n    User USR-801: SKU-ULTRA-BOOT (Apex Trail Pro Boot) - $149.99 (-25.0%)\n    User USR-802: SKU-THERMAL-JACKET (Nordic Shield Parka) - $249.99 (-16.7%)\n  Status: CATALOG_SYNC_SUCCESSFUL",
                "codeNotes": [
                    "Simulates SKU-level matching between real-time product catalogs and user behavioral pixel events.",
                    "Enforces inventory availability checks, automatically suppressing out-of-stock items (SKU-MERINO-SOCKS).",
                    "Calculates dynamic promotional discount percentages (e.g., -25.0% and -16.7%) to maximize click-through velocity."
                ],
                "tryIt": "Modify the in_stock status of SKU-MERINO-SOCKS to True and observe how the dynamic catalog renderer immediately includes it in the active ad set.",
                "check": {
                    "question": "What is the primary operational advantage of Dynamic Product Ads (DPA) over static display retargeting?",
                    "options": [
                        "DPA automatically renders the exact product SKUs and live prices that individual users browsed, suppressing out-of-stock items.",
                        "DPA eliminates the need for ad auctions by guaranteeing top placement at zero cost.",
                        "DPA replaces server-side APIs with unencrypted cookies to bypass privacy regulations.",
                        "DPA delivers ads exclusively through broadcast SMS text messages."
                    ],
                    "answer": 0,
                    "why": "Dynamic Product Ads leverage product catalog feeds and SKU-level event tracking to dynamically generate ads showing the exact items users viewed or abandoned in carts, ensuring high relevance and suppressing out-of-stock items."
                }
            },
            {
                "title": "Audience Recency Window Segmentation & Bid Decay Curves",
                "say": [
                    "Having established automated catalog synchronization, we must address the temporal dynamics of consumer purchasing intent: Audience Recency Window Segmentation. Consumer purchase intent is not a static constant; it decays exponentially over time following an initial website interaction. A visitor who abandoned a cart 45 minutes ago has an extraordinarily high probability of conversion if reached immediately with an ad. Conversely, a visitor who merely viewed a blog article 28 days ago possesses dramatically lower purchase intent.",
                    "Treating all past visitors as a homogeneous retargeting pool leads to severe capital misallocation: advertisers overpay for cold, low-intent traffic while under-bidding for hot, high-converting prospects. Institutional performance marketing teams structure retargeting audiences into segmented recency windows: Window 1 (1 to 3 days), Window 2 (4 to 7 days), Window 3 (8 to 14 days), and Window 4 (15 to 30 days). Each window is assigned an algorithmic bid multiplier that decays as time elapses, reflecting the diminished expected conversion rate.",
                    "Furthermore, intent event hierarchy dictates the base bid weighting. An add_to_cart event represents far greater transactional commitment than a generic page_view or view_item event. Media buying algorithms combine the event base weight with the recency decay factor to calculate a granular bid multiplier. A cart abandoner within the 1-to-3-day hot window receives an aggressive 2.5x bid multiplier, ensuring maximum impression share in competitive programmatic ad auctions.",
                    "Crucially, institutional audience architecture enforces mandatory Negative Audience Exclusion rules. Foremost among these is Past Purchaser Suppression: any user who completes a purchase (firing a purchase conversion event) must be instantly added to an exclusion audience for a minimum of 14 to 30 days (or the typical product replenishment cycle). Serving retargeting ads featuring an item a customer purchased yesterday wastes marketing capital, alienates the customer, and inflates cost per acquisition.",
                    "In our institutional Python simulation for Part 2, we implement the Audience Recency Bid Decay and Exclusion Evaluator. The function evaluates a user's days since last interaction, event type, and purchase status, applying exclusion logic to past buyers (0.0x multiplier) and computing mathematical bid multipliers across temporal recency windows. Review the code below to see this logic execute deterministically."
                ],
                "example": "Enterprise Case Study: A direct-to-consumer mattress brand previously grouped all 30-day website visitors into a single retargeting ad set bidding a flat $3.50 CPC. When they audited their conversion analytics, they discovered that 82% of conversions occurred within the first 72 hours, while visitors between days 15 and 30 yielded a disastrous 0.4x ROAS. They segmented their audience into 1-3 day cart abandoners (bid multiplier 2.5x), 4-7 day viewers (1.5x), and suppressed recent buyers for 60 days. This recency-based bidding strategy reduced wasted retargeting spend by $42,000 per month while lifting overall retargeting ROAS from 2.1x to 4.8x.",
                "code": p2_code,
                "output": "Audience Recency Bid Multiplier Report:\n  USR-101: HIGH_INTENT_HOT_WINDOW_1_3D -> Multiplier: 2.5x (ACTIVE_RETARGETING)\n  USR-102: WARM_INTENT_WINDOW_4_7D -> Multiplier: 1.12x (ACTIVE_RETARGETING)\n  USR-103: COOLING_WINDOW_8_14D -> Multiplier: 0.5x (ACTIVE_RETARGETING)\n  USR-104: PAST_PURCHASER_EXCLUDED -> Multiplier: 0.0x (SUPPRESSED)",
                "codeNotes": [
                    "Implements temporal intent decay across four recency brackets: 1-3d (1.0 factor), 4-7d (0.75), 8-14d (0.50), and 15-30d (0.25).",
                    "Applies event-level base multipliers (add_to_cart = 2.5, view_item = 1.5, page_view = 1.0) multiplied by recency factors.",
                    "Enforces strict past purchaser suppression (0.0x multiplier), completely eliminating ad spend on recent buyers."
                ],
                "tryIt": "Change USR-104 purchased status to False and observe how a 2-day cart abandoner immediately receives a 2.5x high-intent bid multiplier.",
                "check": {
                    "question": "Why must recent purchasers be strictly excluded from retargeting audience pools for 14 to 30 days?",
                    "options": [
                        "To prevent wasting media budget on customers who have already converted and to avoid degrading brand sentiment with redundant ads.",
                        "Because advertising platforms automatically ban advertisers who show ads to verified buyers.",
                        "Because past purchasers are legally prohibited from viewing digital advertisements under FTC regulations.",
                        "To force past purchasers to clear their browser cache before returning to the website."
                    ],
                    "answer": 0,
                    "why": "Serving retargeting ads to consumers who recently completed a purchase burns marketing capital on redundant impressions and creates user frustration; negative exclusions prevent this leakage."
                }
            },
            {
                "title": "Frequency Capping & Impression Pacing Algorithms",
                "say": [
                    "While retargeting delivers high conversion efficiency, it introduces a dangerous operational hazard: Ad Saturation and User Harassment. In programmatic display and paid social channels, without strict frequency controls, an ad algorithm attempting to maximize conversion probability might serve the same retargeting ad to a single user 15 or 20 times in a single afternoon across various websites and apps. This phenomenon generates severe consumer backlash, banner blindness, and wasted media spend.",
                    "Programmatic Frequency Capping is the mathematical discipline of establishing hard limits on the number of times a specific creative or campaign can be delivered to a unique user within a defined time window. Across the digital marketing industry, the empirical sweet spot for lower-funnel retargeting is an optimal frequency cap of 3 impressions per user per day (or a cumulative ceiling of 12 to 15 impressions per week). Beyond this threshold, marginal conversion probability drops precipitously toward zero while cost per incremental conversion increases exponentially.",
                    "To operationalize frequency capping in real-time programmatic ad exchanges, Demand-Side Platforms (DSP) and supply partners maintain high-speed, in-memory counter stores (such as Redis or Aerospike). When an ad exchange transmits a bid request containing a device pseudo-ID or unified identity token (UID 2.0), the DSP executes a millisecond lookup against the user's daily impression counter. If the counter is less than the maximum frequency cap, the DSP enters the ad auction. If the counter meets or exceeds the cap, the DSP immediately suppresses the bid, passing on the opportunity and conserving capital.",
                    "Furthermore, enterprise ad platforms employ Impression Pacing algorithms. Pacing ensures that frequency-capped impressions are distributed evenly throughout the user's active browsing day rather than exhausting the full 3-impression allocation within the first ten minutes of the morning. Smooth pacing maintains continuous brand recall throughout the consumer's daily consideration cycle, maximizing conversion probability without intrusive ad bursts.",
                    "In our institutional Python simulation for Part 3, we construct a real-time programmatic frequency capping evaluation engine. The system ingests incoming bid requests, compares daily impressions served against a configurable maximum daily cap (3 impressions/day), and determines whether to submit an auction bid or suppress the bid request. Examine the code below to see programmatic frequency capping in action."
                ],
                "example": "Enterprise Case Study: A luxury SaaS provider running LinkedIn and Google Display retargeting observed that their cost per acquisition spiked from $180 to $620 over a 60-day period. An audit revealed that their retargeting campaign lacked frequency capping: individual enterprise IT managers were being served over 18 display impressions per day, generating numerous complaints. The team instituted a strict frequency cap of 3 impressions per user per day with even dayparting. Within two weeks, ad spend decreased by 44% with zero loss in demo signups, dropping effective CPA back to $172.",
                "code": p3_code,
                "output": "Programmatic Frequency Capping Evaluation:\n  USR-401 (Served: 0/3): BID_SUBMITTED_TO_EXCHANGE\n  USR-402 (Served: 2/3): BID_SUBMITTED_TO_EXCHANGE\n  USR-403 (Served: 3/3): BID_SUPPRESSED_CAP_EXCEEDED\n  USR-404 (Served: 5/3): BID_SUPPRESSED_CAP_EXCEEDED",
                "codeNotes": [
                    "Evaluates real-time daily impression counts per user against a strict policy cap of 3 impressions per day.",
                    "Permits auction bidding for users under the cap (USR-401 with 0 served, USR-402 with 2 served).",
                    "Suppresses bid submission immediately upon reaching or exceeding the threshold (USR-403 and USR-404), eliminating wasted ad spend."
                ],
                "tryIt": "Change the max_daily_cap to 5 and observe how USR-403 transitions from BID_SUPPRESSED_CAP_EXCEEDED to BID_SUBMITTED_TO_EXCHANGE.",
                "check": {
                    "question": "What is the recommended industry benchmark frequency cap for daily e-commerce retargeting campaigns?",
                    "options": [
                        "3 impressions per user per day to balance brand recall with consumer fatigue prevention.",
                        "50 impressions per user per day to guarantee brand dominance at all costs.",
                        "1 impression per month to minimize server processing costs.",
                        "Unlimited impressions until the user either purchases or closes their browser."
                    ],
                    "answer": 0,
                    "why": "A frequency cap of 3 impressions per user per day provides optimal brand recall while preventing banner blindness, negative brand sentiment, and wasted ad spend."
                }
            },
            {
                "title": "Ad Fatigue Index & Creative Wear-Out Kinetics",
                "say": [
                    "Even with disciplined frequency capping and recency segmentation, retargeting campaigns inevitably face a biological constraint: Human Habituation and Creative Ad Fatigue. When a target audience is repeatedly exposed to identical visual creative assets, color schemes, and copy over several weeks, the human brain progressively filters out the stimuli. This process of visual wear-out causes click-through rates (CTR) to decay, conversion rates to collapse, and platform algorithmic bidding penalties to escalate.",
                    "To govern creative lifecycle scientifically, performance marketing leadership monitors the Ad Fatigue Index. The Ad Fatigue Index measures the percentage degradation of current click-through rate relative to the ad creative's initial launch baseline: $\\text{CTR Decay \\%} = \\frac{\\text{Baseline CTR} - \\text{Current CTR}}{\\text{Baseline CTR}} \\times 100\\%$. Concurrently, platforms evaluate Average Frequency per User. When frequency surpasses 4.0 to 4.5 and CTR decay exceeds 30.0%, the creative asset has entered severe fatigue.",
                    "Algorithmic ad platforms (such as Meta Ads Auction and Google Display Network) actively punish fatigued ads. As users stop clicking and begin hiding ads or reporting them as repetitive, the platform's ad relevance score drops. Because Ad Rank in second-price auctions incorporates relevance and expected CTR, a decaying Quality Score forces the advertiser to pay substantially higher clearing prices (CPC) just to win the same impression slots, destroying campaign ROAS.",
                    "Enterprise marketing operations institutes Automated Creative Refresh Protocols. When monitoring systems detect that an ad set's CTR decay has breached the 30.0% threshold or user frequency has breached 4.5, an automated webhook fires: the fatigued creative is automatically paused or deprioritized, and fresh creative variations—featuring alternative hook angles, contrasting background colors, user-generated content (UGC), or updated value propositions—are rotated into active delivery.",
                    "In our institutional Python simulation for Part 4, we build an Ad Creative Fatigue and Wear-Out Auditor. The system ingests campaign baseline CTR, current 7-day rolling CTR, and user frequency, calculates CTR degradation percentages, evaluates fatigue thresholds, and triggers automated remediation actions. Examine the code below to see ad fatigue monitoring execute deterministically."
                ],
                "example": "Enterprise Case Study: A fintech startup ran an aggressive paid social retargeting campaign with a single hero image ad. During the first two weeks, the ad maintained a healthy 2.5% CTR and 3.2x ROAS. By week 5, average user frequency reached 5.2, and CTR plummeted to 1.5%—a 40% degradation. Despite higher bids, weekly conversions dropped by half. Their automated fatigue auditor flagged the ad set, paused the fatigued asset, and rotated in three fresh UGC video variations. Within 7 days, CTR rebounded to 2.6% and ROAS recovered to 3.4x.",
                "code": p4_code,
                "output": "Ad Creative Fatigue & Wear-Out Audit:\n  ADSET-ALPHA: CTR Drop -8.33% (Freq 2.1) -> MAINTAIN_CURRENT_ROTATION\n  ADSET-BETA: CTR Drop -6.67% (Freq 3.4) -> MAINTAIN_CURRENT_ROTATION\n  ADSET-GAMMA: CTR Drop -40.0% (Freq 5.2) -> TRIGGER_IMMEDIATE_CREATIVE_REFRESH",
                "codeNotes": [
                    "Calculates mathematical CTR degradation percentage: ((Baseline - Current) / Baseline) * 100.",
                    "Maintains normal rotation for healthy ad sets (ADSET-ALPHA at -8.33% and ADSET-BETA at -6.67%).",
                    "Detects severe wear-out on ADSET-GAMMA (-40.0% CTR drop and 5.2 frequency), triggering TRIGGER_IMMEDIATE_CREATIVE_REFRESH."
                ],
                "tryIt": "Change ADSET-GAMMA current_ctr to 2.2 and frequency to 3.0 to verify that the auditor maintains rotation when metrics remain within healthy bounds.",
                "check": {
                    "question": "What operational threshold typically defines severe ad creative fatigue requiring an immediate creative refresh?",
                    "options": [
                        "A click-through rate (CTR) degradation of >= 30% from baseline or user frequency exceeding 4.5 impressions.",
                        "A drop in company stock price of more than 5%.",
                        "An ad remaining active for exactly 24 hours regardless of performance.",
                        "The ad receiving fewer than 1,000,000 impressions in the first hour."
                    ],
                    "answer": 0,
                    "why": "Ad fatigue is quantified by significant performance decay—specifically a CTR degradation of 30% or more combined with high frequency (exceeding 4.5 impressions per user)."
                }
            },
            {
                "title": "Enterprise Retargeting & Frequency Capping Gateway",
                "say": [
                    "In this culminating session of Day 21, we synthesize all four foundational retargeting pillars into a unified operational governance system: the Enterprise Retargeting & Frequency Capping Gateway. Elite growth organizations do not manage retargeting as fragmented, manual ad set adjustments; they operate a continuous, automated control loop that bridges product catalog feeds, intent recency decay curves, programmatic frequency pacing, and creative fatigue lifecycle management.",
                    "The Enterprise Retargeting Gateway enforces four non-negotiable architectural mandates: First, 100% SKU-level catalog feed synchronization ensuring zero out-of-stock product promotion; Second, automated audience recency windowing with exponential bid decay and mandatory past purchaser negative exclusion; Third, programmatic frequency capping capped at 3 impressions per user per day across all digital touchpoints; and Fourth, automated ad fatigue telemetry that programmatically pauses fatigued creative and deploys refreshed creative assets when CTR decay breaches 30%.",
                    "When all four subsystems operate in seamless harmony, the organization maximizes conversion velocity at the bottom of the funnel while rigorously defending brand sentiment and capital efficiency. In our institutional Python simulation for Part 5, we execute the Enterprise Retargeting Gateway auditor. The gateway verifies that catalog synchronization, recency tiering, frequency capping, and fatigue monitoring are all fully active, assigning a composite Retargeting & Frequency Capping Index (RFCI) score of 100.0/100 and conferring the prestigious Retargeting & Frequency Capping Architect credential. Review the code below to see this capstone certification execute deterministically."
                ],
                "example": "Enterprise Case Study: An international e-commerce conglomerate deployed the Enterprise Retargeting Gateway across 14 brand properties. The gateway enforced real-time Shopify/SAP catalog feeds, automatically suppressed 45,000 past purchasers monthly, capped programmatic display frequency to 3 impressions/user/day, and rotated creatives whenever CTR dropped by 30%. Across the portfolio, retargeting ad spend decreased by 28% ($310,000/quarter in eliminated waste) while attributed revenue grew by 19%, lifting aggregate blended ROAS from 3.1x to 5.2x.",
                "code": p5_code,
                "output": "Enterprise Retargeting & Frequency Capping Gateway Report:\n  Catalog Sync Active: True\n  Recency Tiering Active: True\n  Frequency Capping Enforced: True\n  Fatigue Refresh Operational: True\n  RFCI Composite Score: 100.0 / 100.0\n  Accreditation Verdict: RETARGETING_AND_FREQUENCY_CAPPING_ARCHITECT_CERTIFIED",
                "codeNotes": [
                    "Integrates catalog feed sync, audience recency tiering, frequency capping, and fatigue auditing into a unified gateway.",
                    "Validates that all four enterprise retargeting pillars are operational, awarding a perfect 100.0/100 RFCI composite score.",
                    "Confers official RETARGETING_AND_FREQUENCY_CAPPING_ARCHITECT_CERTIFIED accreditation upon passing all audit gates."
                ],
                "tryIt": "Set frequency_capping_ok to False and observe how the gateway revokes certification and triggers an AUDIT_REMEDIATION_REQUIRED alert.",
                "check": {
                    "question": "Which set of capabilities characterizes an enterprise-grade retargeting architecture?",
                    "options": [
                        "Real-time catalog SKU synchronization, audience recency bid decay, strict frequency capping, and automated creative refresh triggers.",
                        "Serving the same static banner ad 30 times a day to all past website visitors regardless of purchase history.",
                        "Relying exclusively on unsegmented 365-day website visitor lists with manual monthly bidding adjustments.",
                        "Disabling all retargeting pixels to rely solely on upper-funnel TV and billboard advertising."
                    ],
                    "answer": 0,
                    "why": "Enterprise retargeting combines real-time catalog feeds, intent recency segmentation, frequency capping to prevent ad fatigue, and automated creative rotation."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day21_lesson()
    visual = build_day21_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 21 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
