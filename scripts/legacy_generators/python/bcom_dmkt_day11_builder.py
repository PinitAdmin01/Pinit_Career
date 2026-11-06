"""
Day 11 Builder: Performance Video Marketing: Hook Rates & View-Through Retention
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Task: TASK-831
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from digital_marketing_budget_ensurer import ensure_dmkt_day_budget

def build_day11():
    parts = []

    # Part 1: Video Hook Rates & Cognitive Thumb-Stopping Science
    p1_say = [
        "Welcome to Day 11 of Digital Marketing and Growth Hacking. Today, we inaugurate Milestone 3: Performance Video Engineering, Lifecycle Marketing Automation, and Statistical Conversion Rate Optimization. In modern programmatic and social feeds—across TikTok, Instagram Reels, YouTube Shorts, and Meta Feed—user attention is the rarest and most fiercely contested commodity on earth. The average mobile user scrolls past thousands of feet of content daily, making snap cognitive decisions in less than 400 milliseconds regarding whether to pause or scroll past an ad. In this unforgiving environment, the opening 3 seconds of a video advertisement dictate over 80% of its ultimate financial return.",
        
        "We quantify this critical initial engagement through the 3-Second Hook Rate. Mathematically, Hook Rate is defined as the total number of video impressions that play past the 3-second threshold divided by total gross ad impressions, expressed as a percentage: Hook Rate = (3-Second Video Plays / Gross Impressions) * 100%. In enterprise performance marketing, creative assets achieving a hook rate under 20% are classified as non-viable or fatigued, as four out of five paid impressions are squandered before the user even registers the brand or core value proposition. Conversely, top-tier performance creative achieves hook rates between 35% and 50%, dramatically depressing blended cost per mille (CPM) and cost per click (CPC).",
        
        "Engineering high hook rates requires a disciplined application of cognitive science and visual pacing. First, the opening visual frame must employ high-contrast movement, unexpected visual patterns, or immediate problem confrontation to disrupt passive scrolling inertia—a technique known as 'pattern interrupt'. Second, because over 70% of mobile social feeds are consumed in sound-off environments, dynamic, high-legibility kinetic captions and visual text overlays must convey the central hook without relying on auditory cues. Third, creators must eliminate bloated corporate logos, intro animations, or conversational greetings ('Hey guys!'), delivering the primary pain point or dramatic transformation in frame one.",
        
        "Furthermore, growth teams conduct rapid creative testing by producing 5 to 10 divergent opening 3-second hook variations for a single underlying product demonstration. By holding the remaining 20 seconds of the video constant and testing divergent opening concepts—such as negative-angle warnings ('Stop buying cheap sunscreen until you see this'), curiosity gaps, customer reaction teardowns, and split-screen comparisons—media buyers identify statistical outliers that expand top-of-funnel reach at a fraction of the cost.",
        
        "In our Python simulation for Part 1, we build a Video Hook Rate Diagnostic and Creative Tiering Engine. The script evaluates impression telemetry and 3-second play counts across multiple creative variations, computes hook rates, assigns performance classifications, and generates automated scaling or pausing directives. Examine the code below to master performance video hook evaluation."
    ]

    p1_code = r'''def audit_video_hook_performance(
    campaign_telemetry: list
) -> dict:
    """
    Audits 3-second video hook rates across ad creative variations.
    Classifies creative performance and provides automated media-spend actions.
    """
    audit_results = []
    total_impressions = 0
    total_3s_plays = 0
    
    for creative in campaign_telemetry:
        c_id = creative["creative_id"]
        impressions = creative["gross_impressions"]
        plays_3s = creative["three_sec_plays"]
        spend = creative["spend_usd"]
        
        hook_rate = round((plays_3s / impressions) * 100.0, 2)
        cpc_proxy = round(spend / max(1, plays_3s), 3)
        
        total_impressions += impressions
        total_3s_plays += plays_3s
        
        # Performance Tiering
        if hook_rate >= 35.0:
            tier = "TIER_1_VIRAL_HIGH_PERFORMER"
            action = "SCALE_BUDGET_50_PERCENT"
        elif hook_rate >= 25.0:
            tier = "TIER_2_ACCEPTABLE_MEDIAN"
            action = "MAINTAIN_CURRENT_SPEND"
        else:
            tier = "TIER_3_FATIGUED_LOW_HOOK"
            action = "PAUSE_AND_ITERATE_OPENING_HOOK"
            
        audit_results.append({
            "creative_id": c_id,
            "impressions": impressions,
            "three_sec_plays": plays_3s,
            "hook_rate_pct": hook_rate,
            "cost_per_hook_play": cpc_proxy,
            "tier": tier,
            "action": action
        })
        
    portfolio_hook_rate = round((total_3s_plays / total_impressions) * 100.0, 2)
    
    return {
        "portfolio_impressions": total_impressions,
        "portfolio_3s_plays": total_3s_plays,
        "portfolio_hook_rate_pct": portfolio_hook_rate,
        "creatives_audited": audit_results,
        "status": "VIDEO_HOOK_AUDIT_COMPLETED"
    }

if __name__ == "__main__":
    telemetry = [
        {"creative_id": "CR_HOOK_A_NEGATIVE_WARNING", "gross_impressions": 50000, "three_sec_plays": 21000, "spend_usd": 750.0},
        {"creative_id": "CR_HOOK_B_SPLIT_SCREEN_TEST", "gross_impressions": 40000, "three_sec_plays": 11200, "spend_usd": 600.0},
        {"creative_id": "CR_HOOK_C_CORPORATE_LOGO_INTRO", "gross_impressions": 30000, "three_sec_plays": 4500, "spend_usd": 450.0}
    ]
    
    report = audit_video_hook_performance(telemetry)
    print("=== PERFORMANCE VIDEO HOOK AUDIT ===")
    print(f"Total Portfolio Impressions: {report['portfolio_impressions']:,}")
    print(f"Total 3-Second Plays: {report['portfolio_3s_plays']:,}")
    print(f"Blended Portfolio Hook Rate: {report['portfolio_hook_rate_pct']}%")
    print("\n--- Individual Creative Breakdown ---")
    for cr in report["creatives_audited"]:
        print(f"[{cr['creative_id']}] Hook Rate: {cr['hook_rate_pct']}% | Cost/Play: ${cr['cost_per_hook_play']} | {cr['tier']} -> {cr['action']}")
'''

    p1_output = """=== PERFORMANCE VIDEO HOOK AUDIT ===
Total Portfolio Impressions: 120,000
Total 3-Second Plays: 36,700
Blended Portfolio Hook Rate: 30.58%

--- Individual Creative Breakdown ---
[CR_HOOK_A_NEGATIVE_WARNING] Hook Rate: 42.0% | Cost/Play: $0.036 | TIER_1_VIRAL_HIGH_PERFORMER -> SCALE_BUDGET_50_PERCENT
[CR_HOOK_B_SPLIT_SCREEN_TEST] Hook Rate: 28.0% | Cost/Play: $0.054 | TIER_2_ACCEPTABLE_MEDIAN -> MAINTAIN_CURRENT_SPEND
[CR_HOOK_C_CORPORATE_LOGO_INTRO] Hook Rate: 15.0% | Cost/Play: $0.1 | TIER_3_FATIGUED_LOW_HOOK -> PAUSE_AND_ITERATE_OPENING_HOOK"""

    parts.append({
        "title": "Video Hook Rates & Cognitive Thumb-Stopping Science",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            "Computes exact 3-second hook rate as (three_sec_plays / gross_impressions) * 100.0.",
            "Implements institutional tiering: >= 35.0% scales budget by 50%; < 25.0% pauses creative immediately.",
            "Calculates cost per hook play to evaluate comparative creative efficiency across paid media."
        ],
        "check": {
            "question": "Why does a video starting with an elaborate 3-second corporate logo animation typically exhibit a disastrous hook rate below 15%?",
            "options": [
                "Because mobile feeds require pattern interruption and immediate problem confrontation; logo animations introduce cognitive boredom and prompt users to scroll away instantly",
                "Because modern browsers block video players that contain brand logo pixels in their opening frames",
                "Because video compression algorithms reduce audio bitrate whenever corporate logos are detected",
                "Because Google Ads mandates that corporate logos can only appear in the final 5 seconds of an ad"
            ],
            "why": "Social media users scroll at breakneck speeds. A passive corporate logo conveys zero value or curiosity, creating immediate cognitive disengagement and causing over 85% of users to swipe past before the product is introduced."
        },
        "example": "A DTC skincare brand replaced a 3-second studio logo intro with a visceral macro camera shot showing pores unclogging under water. The hook rate surged from 14.2% to 44.8%, cutting blended customer acquisition cost (CAC) by 41% across Meta and TikTok.",
        "tryIt": "Run the diagnostic with your current paid video assets. Verify which opening hook achieves >= 35% hook rate before allocating scale budgets."
    })

    # Part 2: Hold Rate & View-Through Retention Curves
    p2_say = [
        "While the 3-second hook rate measures an ad's ability to capture attention, the Hold Rate measures its capacity to sustain attention and persuasively deliver the commercial narrative. If hook rate represents the doorway to the consumer's mind, hold rate represents the living room where buying conviction is constructed. In video marketing analytics, Hold Rate is mathematically defined as the percentage of users who watch a video to a specific milestone (typically 15 seconds, 50% duration, or 100% completion) conditional on having passed the 3-second mark: Hold Rate = (15-Second Views / 3-Second Views) * 100%.",
        
        "A healthy performance video creative demonstrates an inverted-exponential retention curve. The sharpest drop-off invariably occurs between seconds 0 and 3. However, once a viewer is hooked, a high-converting ad flattens the retention curve between seconds 3 and 20 by employing rhythmic visual pacing. Modern performance editors utilize the '2-Second Rule': every 2 to 3 seconds, the visual frame must change dynamically through B-roll cutaways, punch-in zooms, on-screen text animations, product macro close-ups, or sound effects to continually re-anchor viewer stimulation.",
        
        "Analyzing second-by-second drop-off telemetry allows growth engineers to diagnose narrative friction with surgical precision. For example, if retention curves show an abrupt, vertical cliff at second 7, the scriptwriter can inspect second 7 to discover that the creator shifted into a boring technical explanation or prolonged monologue. By cutting that friction point and bridging immediately to customer social proof or product demonstration, the video's average watch time and subsequent click-through rate (CTR) can be doubled.",
        
        "Furthermore, video completion rates directly influence ad platform algorithmic distribution. Algorithms on Meta, TikTok, and YouTube reward videos with superior View-Through Rates (VTR) by assigning them higher auction quality scores. This algorithmic favorability translates into lower CPMs, allowing high-retention creative to outbid competitors without raising nominal cost-per-click bids.",
        
        "In our Python simulation for Part 2, we build a Video Retention Curve and Narrative Friction Diagnostic Engine. The system ingests second-by-second viewer telemetry, computes conditional hold rates, identifies the exact timestamp of peak viewer attrition, and outputs editing remediation instructions. Inspect the simulation below to understand retention curve mechanics."
    ]

    p2_code = r'''def analyze_video_retention_curve(
    retention_telemetry: dict
) -> dict:
    """
    Analyzes second-by-second video viewer retention telemetry.
    Computes hold rate, locates steepest drop-off cliffs, and diagnoses narrative friction.
    """
    timestamps = retention_telemetry["timestamps_sec"]
    viewers = retention_telemetry["viewers_remaining"]
    total_started = viewers[0]
    
    # 1. Critical Milestones
    viewers_3s = viewers[timestamps.index(3)]
    viewers_15s = viewers[timestamps.index(15)]
    viewers_30s = viewers[timestamps.index(30)]
    
    hook_rate = round((viewers_3s / total_started) * 100.0, 2)
    hold_rate_15s = round((viewers_15s / viewers_3s) * 100.0, 2)
    completion_rate_30s = round((viewers_30s / total_started) * 100.0, 2)
    
    # 2. Attrition Analysis (Detect steepest second-by-second drop-off cliff after 3s)
    steepest_drop_sec = None
    max_drop_pct = 0.0
    
    for i in range(timestamps.index(3), len(timestamps) - 1):
        t_curr = timestamps[i]
        v_curr = viewers[i]
        v_next = viewers[i + 1]
        
        drop_pct = round(((v_curr - v_next) / v_curr) * 100.0, 2)
        if drop_pct > max_drop_pct:
            max_drop_pct = drop_pct
            steepest_drop_sec = t_curr
            
    # Narrative Health Assessment
    if hold_rate_15s >= 60.0:
        pacing_verdict = "EXCELLENT_HOLD_PACING_NOMINAL"
    elif hold_rate_15s >= 40.0:
        pacing_verdict = "MODERATE_HOLD_TRIM_FRICTION"
    else:
        pacing_verdict = "SEVERE_DROP_OFF_RESTRUCTURE_NARRATIVE"
        
    return {
        "hook_rate_3s_pct": hook_rate,
        "hold_rate_15s_pct": hold_rate_15s,
        "completion_rate_30s_pct": completion_rate_30s,
        "steepest_friction_timestamp_sec": steepest_drop_sec,
        "steepest_drop_magnitude_pct": max_drop_pct,
        "pacing_verdict": pacing_verdict,
        "status": "RETENTION_ANALYSIS_COMPLETED"
    }

if __name__ == "__main__":
    test_video_data = {
        "timestamps_sec": [0, 1, 2, 3, 5, 8, 10, 15, 20, 25, 30],
        "viewers_remaining": [10000, 8500, 6200, 4200, 3900, 3600, 2400, 2200, 1900, 1600, 1400]
    }
    
    analysis = analyze_video_retention_curve(test_video_data)
    print("=== VIDEO RETENTION & PACING DIAGNOSTIC ===")
    print(f"3-Second Hook Rate: {analysis['hook_rate_3s_pct']}%")
    print(f"15-Second Hold Rate (Conditional): {analysis['hold_rate_15s_pct']}%")
    print(f"30-Second Full Completion Rate: {analysis['completion_rate_30s_pct']}%")
    print(f"Steepest Drop Timestamp: Second {analysis['steepest_friction_timestamp_sec']} (-{analysis['steepest_drop_magnitude_pct']}%)")
    print(f"Narrative Pacing Verdict: {analysis['pacing_verdict']}")
'''

    p2_output = """=== VIDEO RETENTION & PACING DIAGNOSTIC ===
3-Second Hook Rate: 42.0%
15-Second Hold Rate (Conditional): 52.38%
30-Second Full Completion Rate: 14.0%
Steepest Drop Timestamp: Second 8 (-33.33%)
Narrative Pacing Verdict: MODERATE_HOLD_TRIM_FRICTION"""

    parts.append({
        "title": "Hold Rate & View-Through Retention Curves",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            "Computes conditional 15-second hold rate as (viewers_15s / viewers_3s) * 100.0.",
            "Scans timestamps after second 3 to isolate the exact second of highest viewer attrition.",
            "Detects second 8 as a critical friction cliff (-33.33% drop), directing video editors to cut narrative lag."
        ],
        "check": {
            "question": "If a video has a 42% hook rate at second 3, but viewers plunge by 33% at second 8, what action should the growth creative team take?",
            "options": [
                "Inspect the visual and script content at second 8 to remove conversational lag or boring slides and immediately splice in social proof or product action",
                "Increase the maximum CPC bid by 50% to force users to watch past second 8",
                "Lengthen the corporate logo intro at the start to prepare users for second 8",
                "Delete the entire ad account because algorithmic retention cannot be modified by editing"
            ],
            "why": "A steep retention cliff at a specific second indicates narrative friction—such as talking heads, technical jargon, or dead air. Splicing in dynamic B-roll or social proof directly resolves viewer drop-off."
        },
        "example": "An ed-tech platform identified that 40% of viewers abandoned their ad between seconds 7 and 10 when a static slide appeared. Replacing that slide with a live screen recording showing 1-click course enrollment lifted 15-second hold rate from 38% to 64%.",
        "tryIt": "Export your video drop-off curves from Meta Ads Manager or TikTok Ads. Pinpoint the single biggest drop-off timestamp and test an edited cut with dynamic B-roll."
    })

    # Part 3: Video Ad Platform Distribution: YouTube TrueView vs Vertical Short-Form
    p3_say = [
        "Performance video marketing is not monolithic; creative architecture must be engineered specifically for the target distribution channel and user intent state. Broadly, performance video bifurcates into two dominant ecosystems: High-Intent Horizontal/Skippable Video (typified by YouTube TrueView and In-Stream Ads) and Rapid-Scroll Vertical Short-Form Video (typified by TikTok, Instagram Reels, YouTube Shorts, and Snap).",
        
        "On YouTube TrueView In-Stream, advertisers benefit from a unique economic structure: skippable video ads allow users to skip the ad after 5 seconds. Google charges the advertiser on a Cost Per View (CPV) basis only if the viewer watches at least 30 seconds (or the entire ad if shorter) or engages with a clickable element. This creates a powerful strategic incentive called 'Intentional Filtering': performance marketers intentionally call out their specific target customer and price point in the first 5 seconds ('If you are not a B2B SaaS founder managing over $100k ARR, please skip this ad!'). Non-target prospects skip, costing the brand $0.00, while qualified prospects remain engaged, yielding hyper-efficient conversion rates.",
        
        "In contrast, vertical short-form platforms (TikTok and Reels) operate on algorithmic immersion with zero skip buttons—users simply flick their thumbs. Here, ads masquerade as native organic User-Generated Content (UGC). The creative must mirror the visual vernacular of the platform: 9:16 vertical aspect ratio, shot on an iPhone rather than cinema cameras, utilizing handheld camera motion, direct-to-camera eye contact, native green-screen effects, and trending sound cues. Highly polished, glossy TV-style commercial spots experience instant algorithmic rejection and user fatigue on TikTok.",
        
        "Furthermore, media distribution requires meticulous aspect ratio management. Deploying a 16:9 widescreen landscape video into an Instagram Reels placement results in awkward black bars on the top and bottom, telegraphing a lazy corporate ad and triggering instant viewer drop-off. Leading performance studios transcode every creative asset into bespoke ratios: 9:16 for vertical stories/reels, 1:1 square for feed carousels, and 16:9 for connected TV (CTV) and desktop YouTube placements.",
        
        "In our Python simulation for Part 3, we build a Multi-Platform Video Distribution and Channel Efficiency Simulator. The script models YouTube TrueView intentional skip economics versus TikTok native UGC acquisition, computing blended Cost Per Acquisition (CPA) and Return on Ad Spend (ROAS). Examine the code below to see platform distribution economics in action."
    ]

    p3_code = r'''def simulate_cross_platform_video_economics(
    budget_usd: float,
    platforms_config: list
) -> dict:
    """
    Simulates video ad distribution economics across YouTube TrueView and TikTok UGC.
    Models skip filtering savings and native UGC conversion efficiency.
    """
    results = []
    total_conversions = 0
    total_revenue = 0.0
    
    for cfg in platforms_config:
        p_name = cfg["platform_name"]
        alloc_spend = budget_usd * cfg["budget_share"]
        cpm = cfg["cpm_usd"]
        gross_imp = (alloc_spend / cpm) * 1000
        
        if cfg["format_type"] == "YOUTUBE_TRUEVIEW_SKIPPABLE":
            # TrueView: 68% skip before 30s (FREE views due to skip rule!), 32% billed CPV
            billable_views = gross_imp * (1.0 - cfg["intentional_skip_rate"])
            clicks = billable_views * cfg["ctr_on_views"]
            conversions = round(clicks * cfg["cvr_on_clicks"])
        else:
            # TikTok/Reels: Paid per impression, native UGC conversion funnel
            views_3s = gross_imp * cfg["hook_rate"]
            clicks = views_3s * cfg["ctr_on_views"]
            conversions = round(clicks * cfg["cvr_on_clicks"])
            
        aov = cfg["average_order_value_usd"]
        rev = conversions * aov
        cpa = round(alloc_spend / max(1, conversions), 2)
        roas = round((rev / alloc_spend) * 100.0, 1)
        
        total_conversions += conversions
        total_revenue += rev
        
        results.append({
            "platform": p_name,
            "format": cfg["format_type"],
            "allocated_spend": alloc_spend,
            "gross_impressions": round(gross_imp),
            "conversions": conversions,
            "cpa_usd": cpa,
            "revenue_usd": rev,
            "roas_pct": roas
        })
        
    blended_cpa = round(budget_usd / max(1, total_conversions), 2)
    blended_roas = round((total_revenue / budget_usd) * 100.0, 1)
    
    return {
        "total_budget_usd": budget_usd,
        "total_conversions": total_conversions,
        "total_revenue_usd": total_revenue,
        "blended_cpa_usd": blended_cpa,
        "blended_roas_pct": blended_roas,
        "platform_performance": results,
        "status": "CROSS_PLATFORM_SIMULATION_COMPLETED"
    }

if __name__ == "__main__":
    configs = [
        {
            "platform_name": "YouTube_InStream_TrueView",
            "format_type": "YOUTUBE_TRUEVIEW_SKIPPABLE",
            "budget_share": 0.50,
            "cpm_usd": 12.0,
            "intentional_skip_rate": 0.68,
            "ctr_on_views": 0.025,
            "cvr_on_clicks": 0.05,
            "average_order_value_usd": 180.0
        },
        {
            "platform_name": "TikTok_Native_Vertical_UGC",
            "format_type": "TIKTOK_REELS_SHORT_FORM",
            "budget_share": 0.50,
            "cpm_usd": 8.0,
            "hook_rate": 0.40,
            "ctr_on_views": 0.02,
            "cvr_on_clicks": 0.0332,
            "average_order_value_usd": 180.0
        }
    ]
    
    sim = simulate_cross_platform_video_economics(10000.0, configs)
    print("=== CROSS-PLATFORM VIDEO DISTRIBUTION ECONOMICS ===")
    print(f"Total Budget: ${sim['total_budget_usd']:,.2f} | Blended CPA: ${sim['blended_cpa_usd']} | Blended ROAS: {sim['blended_roas_pct']}%")
    for p in sim["platform_performance"]:
        print(f"[{p['platform']}] Spend: ${p['allocated_spend']:,.0f} | Conv: {p['conversions']} | CPA: ${p['cpa_usd']} | ROAS: {p['roas_pct']}%")
'''

    p3_output = """=== CROSS-PLATFORM VIDEO DISTRIBUTION ECONOMICS ===
Total Budget: $10,000.00 | Blended CPA: $30.03 | Blended ROAS: 599.4%
[YouTube_InStream_TrueView] Spend: $5,000 | Conv: 167 | CPA: $29.94 | ROAS: 601.2%
[TikTok_Native_Vertical_UGC] Spend: $5,000 | Conv: 166 | CPA: $30.12 | ROAS: 597.6%"""

    parts.append({
        "title": "Video Ad Platform Distribution: YouTube TrueView vs Vertical Short-Form",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            "Simulates YouTube TrueView skip mechanics where 68% intentional skips cost zero ad spend.",
            "Simulates TikTok native UGC video with a 40% hook rate driving high-volume mobile conversions.",
            "Achieves a balanced cross-platform ROAS of ~600% with blended CPA of $30.03."
        ],
        "check": {
            "question": "What is the strategic purpose of 'Intentional Filtering' in the first 5 seconds of a YouTube TrueView skippable video ad?",
            "options": [
                "To prompt unqualified users to skip the ad before the 30-second billable threshold, ensuring the advertiser pays $0.00 for non-target impressions",
                "To confuse the Google algorithm so that it gives free impressions indefinitely",
                "To ensure the video is never categorized as an ad by ad-blocking browser extensions",
                "To comply with federal television broadcasting regulations regarding commercial interruptions"
            ],
            "why": "Because YouTube TrueView does not bill advertisers if users skip prior to 30 seconds, explicitly telling non-customers to skip allows brands to educate non-buyers for free and spend media budget solely on high-intent buyers."
        },
        "example": "A B2B enterprise software provider opened its YouTube ad with: 'If you're not an IT director managing over 50 servers, please hit skip now.' 72% skipped for free, while the remaining qualified viewers converted at a 4.8% rate, slashing CPA by 55%.",
        "tryIt": "Author a 5-second intentional filtering opening script for your product. Test it against an unfiltered control ad on YouTube."
    })

    # Part 4: Dynamic Creative Optimization (DCO) & Video Iteration at Scale
    p4_say = [
        "In modern high-spend performance marketing accounts ($50,000 to $500,000+ monthly budget), manual video production cannot keep pace with algorithmic creative fatigue. When an ad creative is scaled across Meta or TikTok, audience saturation causes frequency to rise. Once average frequency passes 3.5 to 5.0 impressions per user, click-through rates decay exponentially while CPAs double. To counteract this relentless creative decay, elite growth engineering teams deploy Dynamic Creative Optimization (DCO) and programmatic video modularity.",
        
        "Modular video construction deconstructs a 30-second commercial into four discrete, interchangeable components: Hook (0 to 3 seconds), Problem Confrontation (3 to 8 seconds), Solution Demonstration (8 to 22 seconds), and Call to Action (CTA: 22 to 30 seconds). By shooting 4 distinct Hooks, 3 Problem variations, 3 Solution demonstrations, and 2 CTA offers, the production team generates 4 * 3 * 3 * 2 = 72 distinct, unique video assets from a single single-day shoot.",
        
        "These modular video permutations are ingested into Meta Advantage+ Creative or TikTok Smart Creative tools, which use machine learning multi-armed bandit algorithms to test permutations dynamically. The algorithm rapidly serves variations to micro-cohorts, measuring early engagement signals (hook rate, thumb-stop, and early add-to-cart velocity), and concentrates up to 80% of daily media spend into the top-performing 5% of permutations.",
        
        "Furthermore, DCO engines dynamically overlay localized product pricing, regional inventory availability, and seasonal promotional banners onto the base video asset in real time. For instance, a user in Chicago in January sees a video ad featuring heavy winter coats with local delivery estimates, while a user in Miami simultaneously receives a swimwear variant—all rendered programmatically from a single dynamic video template.",
        
        "In our Python simulation for Part 4, we build an Automated Modular Video DCO Generator and Combinatorial Permutation Evaluator. The script generates all permutations across modular components, computes diversity metrics, and simulates algorithmic budget allocation across the combinatorial matrix. Inspect the code below to see modular video scaling."
    ]

    p4_code = r'''def generate_modular_video_dco_matrix(
    modular_components: dict
) -> dict:
    """
    Generates and evaluates modular video permutations for Dynamic Creative Optimization (DCO).
    Computes total creative output, permutation matrix, and simulated budget allocation.
    """
    hooks = modular_components.get("hooks", [])
    problems = modular_components.get("problems", [])
    solutions = modular_components.get("solutions", [])
    ctas = modular_components.get("ctas", [])
    
    total_permutations_count = len(hooks) * len(problems) * len(solutions) * len(ctas)
    
    permutations = []
    for h in hooks:
        for p in problems:
            for s in solutions:
                for c in ctas:
                    perm_id = f"{h['id']}__{p['id']}__{s['id']}__{c['id']}"
                    # Estimated composite score based on component weights
                    expected_score = round((h["weight"] * 0.40) + (p["weight"] * 0.20) + (s["weight"] * 0.25) + (c["weight"] * 0.15), 2)
                    permutations.append({
                        "permutation_id": perm_id,
                        "hook_name": h["name"],
                        "problem_name": p["name"],
                        "solution_name": s["name"],
                        "cta_name": c["name"],
                        "expected_performance_score": expected_score
                    })
                    
    # Sort permutations by performance score descending
    sorted_perms = sorted(permutations, key=lambda x: x["expected_performance_score"], reverse=True)
    top_5_winners = sorted_perms[:5]
    
    return {
        "hooks_count": len(hooks),
        "problems_count": len(problems),
        "solutions_count": len(solutions),
        "ctas_count": len(ctas),
        "total_permutations_generated": total_permutations_count,
        "top_winning_permutations": top_5_winners,
        "status": "DCO_PERMUTATION_MATRIX_GENERATED"
    }

if __name__ == "__main__":
    components = {
        "hooks": [
            {"id": "HK1", "name": "Negative Warning Pattern Interrupt", "weight": 9.2},
            {"id": "HK2", "name": "Split-Screen Microscope Teardown", "weight": 8.7},
            {"id": "HK3", "name": "Celebrity UGC Reaction", "weight": 7.5},
            {"id": "HK4", "name": "Founder Direct Confession", "weight": 6.8}
        ],
        "problems": [
            {"id": "PR1", "name": "Wasted Money on Ineffective Serums", "weight": 8.5},
            {"id": "PR2", "name": "Chemical Skin Irritation Frustration", "weight": 8.1},
            {"id": "PR3", "name": "Time-Consuming 10-Step Routines", "weight": 7.6}
        ],
        "solutions": [
            {"id": "SL1", "name": "Patented 1-Step Peptide Formula", "weight": 9.0},
            {"id": "SL2", "name": "Dermatologist Lab Proof Demonstration", "weight": 8.8},
            {"id": "SL3", "name": "7-Day Clinical Split-Face Results", "weight": 8.4}
        ],
        "ctas": [
            {"id": "CTA1", "name": "Claim 50% Off First Bottle", "weight": 9.1},
            {"id": "CTA2", "name": "Free Derm Consult with Purchase", "weight": 8.0}
        ]
    }
    
    dco_matrix = generate_modular_video_dco_matrix(components)
    print("=== DCO MODULAR VIDEO COMBINATORIAL ENGINE ===")
    print(f"Generated {dco_matrix['total_permutations_generated']} Unique Video Ads from {dco_matrix['hooks_count']} Hooks, {dco_matrix['problems_count']} Problems, {dco_matrix['solutions_count']} Solutions, {dco_matrix['ctas_count']} CTAs.")
    print("\n--- Top 3 Algorithmic High-Yield Permutations ---")
    for idx, win in enumerate(dco_matrix["top_winning_permutations"][:3], 1):
        print(f"Rank {idx}: [{win['permutation_id']}] Score: {win['expected_performance_score']}/10.0")
        print(f"   Structure: {win['hook_name']} -> {win['solution_name']} -> {win['cta_name']}")
'''

    p4_output = """=== DCO MODULAR VIDEO COMBINATORIAL ENGINE ===
Generated 72 Unique Video Ads from 4 Hooks, 3 Problems, 3 Solutions, 2 CTAs.

--- Top 3 Algorithmic High-Yield Permutations ---
Rank 1: [HK1__PR1__SL1__CTA1] Score: 8.99/10.0
   Structure: Negative Warning Pattern Interrupt -> Patented 1-Step Peptide Formula -> Claim 50% Off First Bottle
Rank 2: [HK1__PR1__SL2__CTA1] Score: 8.95/10.0
   Structure: Negative Warning Pattern Interrupt -> Dermatologist Lab Proof Demonstration -> Claim 50% Off First Bottle
Rank 3: [HK1__PR2__SL1__CTA1] Score: 8.91/10.0
   Structure: Negative Warning Pattern Interrupt -> Patented 1-Step Peptide Formula -> Claim 50% Off First Bottle"""

    parts.append({
        "title": "Dynamic Creative Optimization (DCO) & Video Iteration at Scale",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            "Deconstructs video creative into 4 modular pillars: Hook, Problem, Solution, CTA.",
            "Generates 72 unique permutations from 12 video clips shot in a single day.",
            "Ranks permutations algorithmically to direct automated media buying systems to top-scoring variations."
        ],
        "check": {
            "question": "How does modular video production enable growth marketing teams to combat rapid creative fatigue without inflating production budgets?",
            "options": [
                "By filming interchangeable hooks, problems, solutions, and CTAs in a single shoot, producing dozens of distinct ad permutations that can be rotated dynamically",
                "By rendering videos in low resolution so that users fail to notice repetitive creative",
                "By running the exact same video file under 50 different file names to deceive ad review systems",
                "By turning off ad tracking so that frequency metrics remain at 1.0 permanently"
            ],
            "why": "Filming modular components allows 12 quick takes to yield 72 distinct video ads. Rotating these permutations prevents frequency fatigue while allowing algorithms to match specific hooks to divergent audience segments."
        },
        "example": "A fitness app filmed 3 hooks and 4 CTAs around a single core workout demonstration. The resulting 12 modular permutations generated 6 months of ad variations, preventing frequency fatigue and keeping CPA stable at $14.50 across $250,000 in monthly ad spend.",
        "tryIt": "Map out a 4x3x2 modular video grid for your primary offer. Calculate the total number of permutations available for your next paid campaign."
    })

    # Part 5: APEX Video Performance Marketing Control Gateway
    p5_say = [
        "In this final section of Day 11, we synthesize all video marketing dimensions into an institutional APEX Video Performance Marketing Control Gateway. Modern Chief Marketing Officers (CMOs) and Performance Marketing Directors do not evaluate video ads based on aesthetic subjective opinions or creative awards. Instead, video assets are evaluated strictly as programmatic financial instruments governed by quantifiable threshold metrics: 3-Second Hook Rates (>= 35.0%), 15-Second Hold Rates (>= 50.0%), Creative Fatigue Limits (Frequency <= 4.0), and Break-Even ROAS targets.",
        
        "The APEX Video Gateway functions as an automated media governance system. It continuously ingests real-time ad platform telemetry across YouTube, TikTok, and Meta, evaluates hook velocity, retention health, CPA efficiency, and creative fatigue, and executes automated budgetary commands: scaling high-hook high-hold winners, refreshing fatigued creative variations, and liquidating low-engagement assets.",
        
        "Furthermore, the gateway calculates a consolidated Video Performance Marketing Index (VPMI: 0 to 100), benchmarking institutional creative operations against global top-quartile standards. Successfully implementing and mastering this gateway earns the learner the Performance Video Marketing Specialist (PVMS) accreditation, signaling mastery in programmatic video creative engineering.",
        
        "In our final Python simulation, we construct the complete APEX Video Performance Marketing Control Gateway. The engine audits a portfolio of video campaigns, executes rule-based budget reallocations, computes the VPMI composite index, and outputs an executive certification dossier. Run the simulation to see institutional video governance executed."
    ]

    p5_code = r'''def execute_apex_video_marketing_gateway(
    portfolio_manifest: list,
    target_cpa_usd: float
) -> dict:
    """
    APEX Video Performance Marketing Control Gateway.
    Synthesizes Hook Rate, Hold Rate, Frequency Fatigue, and CPA Efficiency into
    a consolidated Video Performance Marketing Index (VPMI) and automated spend actions.
    """
    processed_assets = []
    total_spend = 0.0
    total_revenue = 0.0
    total_conversions = 0
    total_score = 0.0
    
    for asset in portfolio_manifest:
        a_id = asset["asset_id"]
        spend = asset["spend_usd"]
        rev = asset["revenue_usd"]
        convs = asset["conversions"]
        hook_rate = asset["hook_rate_pct"]
        hold_rate = asset["hold_rate_pct"]
        freq = asset["frequency"]
        
        total_spend += spend
        total_revenue += rev
        total_conversions += convs
        
        cpa = round(spend / max(1, convs), 2)
        roas = round((rev / spend) * 100.0, 1)
        
        # Scoring Components (Max 25 pts each)
        s_hook = min(25.0, (hook_rate / 40.0) * 25.0)
        s_hold = min(25.0, (hold_rate / 60.0) * 25.0)
        s_cpa = 25.0 if cpa <= target_cpa_usd else max(0.0, 25.0 - ((cpa - target_cpa_usd) / target_cpa_usd) * 25.0)
        s_fatigue = 25.0 if freq <= 3.5 else max(0.0, 25.0 - ((freq - 3.5) / 2.0) * 25.0)
        
        asset_score = round(s_hook + s_hold + s_cpa + s_fatigue, 1)
        total_score += asset_score
        
        # Automated Governance Directive
        if asset_score >= 85.0 and freq < 3.8:
            directive = "SCALE_PORTFOLIO_BUDGET_AGGRESSIVE"
        elif freq >= 4.0:
            directive = "CREATIVE_FATIGUE_TRIGGER_MODULAR_REFRESH"
        elif asset_score < 60.0:
            directive = "PAUSE_INEFFICIENT_ASSET"
        else:
            directive = "OPTIMIZE_MIDDLE_FUNNEL_RETENTION"
            
        processed_assets.append({
            "asset_id": a_id,
            "cpa_usd": cpa,
            "roas_pct": roas,
            "hook_rate_pct": hook_rate,
            "hold_rate_pct": hold_rate,
            "frequency": freq,
            "score": asset_score,
            "directive": directive
        })
        
    portfolio_cpa = round(total_spend / max(1, total_conversions), 2)
    portfolio_roas = round((total_revenue / total_spend) * 100.0, 1)
    portfolio_vpmi = round(total_score / len(portfolio_manifest), 1)
    
    status = "APEX_VIDEO_ENGINE_EXCELLENCE" if portfolio_vpmi >= 80.0 and portfolio_cpa <= target_cpa_usd else "OPTIMIZATION_REQUIRED"
    
    return {
        "portfolio_spend_usd": total_spend,
        "portfolio_revenue_usd": total_revenue,
        "portfolio_cpa_usd": portfolio_cpa,
        "portfolio_roas_pct": portfolio_roas,
        "portfolio_vpmi_index": portfolio_vpmi,
        "gateway_status": status,
        "accreditation": "PERFORMANCE_VIDEO_MARKETING_SPECIALIST_CERTIFIED" if status == "APEX_VIDEO_ENGINE_EXCELLENCE" else "PENDING_AUDIT",
        "assets_evaluated": processed_assets
    }

if __name__ == "__main__":
    campaign_data = [
        {"asset_id": "VID_DCO_WINNER_01", "spend_usd": 4000.0, "revenue_usd": 24000.0, "conversions": 133, "hook_rate_pct": 42.0, "hold_rate_pct": 58.0, "frequency": 2.4},
        {"asset_id": "VID_DCO_TIKTOK_UGC", "spend_usd": 3500.0, "revenue_usd": 18500.0, "conversions": 115, "hook_rate_pct": 38.0, "hold_rate_pct": 51.0, "frequency": 3.1},
        {"asset_id": "VID_YOUTUBE_FILTER", "spend_usd": 2500.0, "revenue_usd": 14000.0, "conversions": 84, "hook_rate_pct": 36.0, "hold_rate_pct": 54.0, "frequency": 2.2}
    ]
    
    target_cpa = 32.0
    gateway = execute_apex_video_marketing_gateway(campaign_data, target_cpa)
    
    print("=== APEX VIDEO PERFORMANCE CONTROL GATEWAY ===")
    print(f"Total Spend: ${gateway['portfolio_spend_usd']:,.2f} | Blended Revenue: ${gateway['portfolio_revenue_usd']:,.2f}")
    print(f"Portfolio CPA: ${gateway['portfolio_cpa_usd']} (Target: ${target_cpa}) | ROAS: {gateway['portfolio_roas_pct']}%")
    print(f"Portfolio VPMI Index: {gateway['portfolio_vpmi_index']}/100.0 | Status: {gateway['gateway_status']}")
    print(f"Accreditation: {gateway['accreditation']}")
    print("\n--- Action Directives ---")
    for a in gateway["assets_evaluated"]:
        print(f"[{a['asset_id']}] Score: {a['score']} | CPA: ${a['cpa_usd']} | ROAS: {a['roas_pct']}% -> {a['directive']}")
'''

    p5_output = """=== APEX VIDEO PERFORMANCE CONTROL GATEWAY ===
Total Spend: $10,000.00 | Blended Revenue: $56,500.00
Portfolio CPA: $30.12 (Target: $32.0) | ROAS: 565.0%
Portfolio VPMI Index: 96.4/100.0 | Status: APEX_VIDEO_ENGINE_EXCELLENCE
Accreditation: PERFORMANCE_VIDEO_MARKETING_SPECIALIST_CERTIFIED

--- Action Directives ---
[VID_DCO_WINNER_01] Score: 99.2 | CPA: $30.08 | ROAS: 600.0% -> SCALE_PORTFOLIO_BUDGET_AGGRESSIVE
[VID_DCO_TIKTOK_UGC] Score: 95.0 | CPA: $30.43 | ROAS: 528.6% -> SCALE_PORTFOLIO_BUDGET_AGGRESSIVE
[VID_YOUTUBE_FILTER] Score: 95.0 | CPA: $29.76 | ROAS: 560.0% -> SCALE_PORTFOLIO_BUDGET_AGGRESSIVE"""

    parts.append({
        "title": "APEX Video Performance Marketing Control Gateway & Creative Portfolio Governance",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            "Synthesizes Hook Rate, Hold Rate, CPA efficiency, and Frequency into a 100-point VPMI index.",
            "Executes automated scale directives for assets scoring >= 85.0 with healthy frequency (< 3.8).",
            "Achieves $30.12 blended CPA beneath $32.0 target, certifying the portfolio with APEX excellence."
        ],
        "check": {
            "question": "What primary operational triggers should cause an automated media governance system to scale a video asset's budget by 50%?",
            "options": [
                "Hook rate >= 35.0%, hold rate >= 50.0%, CPA beneath target threshold, and frequency safely below fatigue limits (< 3.8)",
                "The creative director personal preference and visual production cost exceeding $50,000",
                "Video resolution being 4K regardless of actual user conversion metrics",
                "The ad receiving positive comments from organic employees on social media"
            ],
            "why": "Institutional media buying relies on quantitative financial metrics. When an asset stops thumbs (hook >= 35%), sustains attention (hold >= 50%), delivers profit (CPA <= target), and is not fatigued, scaling budget is mathematically justified."
        },
        "example": "A global fitness brand implemented the APEX Video Gateway across $1.2M in quarterly ad spend. Automated budget scaling on assets scoring >= 85.0 VPMI lifted overall account ROAS from 340% to 565% while slashing creative burnout by 60%.",
        "tryIt": "Plug your campaign metrics into the APEX Video Gateway. Confirm whether your top creative qualifies for an aggressive budget scale directive."
    })

    day_dict = {
        "day": 11,
        "title": "Performance Video Marketing: Hook Rates & View-Through Retention",
        "parts": parts
    }

    total_words = ensure_dmkt_day_budget(day_dict, min_part_words=580, min_day_words=2950)
    return day_dict, total_words

if __name__ == "__main__":
    day11_data, total_words = build_day11()
    print(f"Day 11 built successfully: {total_words:,} spoken words.")
