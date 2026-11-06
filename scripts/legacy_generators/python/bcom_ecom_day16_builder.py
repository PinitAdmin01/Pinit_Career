"""
Day 16 Builder: Digital Advertising Economics: ROAS, CPA, Blended CAC & Attribution
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-811
"""

import os
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day16():
    parts = []

    # Part 1: Paid Traffic Channels, First-Price vs Second-Price Ad Auctions & Bid Dynamics
    p1_say = [
        "Welcome to Day 16 of B.Com E-Commerce and Digital Business. Today, we transition from the operational supply chain into the high-stakes financial engine of digital growth: Paid Advertising Economics, Return on Ad Spend (ROAS), Customer Acquisition Cost (CAC), and Algorithmic Media Attribution. In contemporary digital commerce, customer acquisition is often an enterprise's single largest operational expenditure, frequently consuming thirty to fifty percent of top-line revenue. Whether a brand scales to hundreds of millions in Gross Merchandise Value (GMV) or collapses into insolvency is determined not by storefront aesthetics, but by the mathematical discipline with which it allocates capital across programmatic advertising auctions.",
        
        "To operate effectively in performance marketing, commercial leaders must master the algorithmic mechanics of real-time advertising auctions. Platforms like Google Search, Meta Ads (Facebook/Instagram), TikTok, and Amazon Advertising do not sell ad impressions at static price points. Instead, every single ad placement is determined in milliseconds via a Generalized Second-Price (GSP) or Vickrey-Clarke-Groves (VCG) auction. In a standard Generalized Second-Price auction, the winning advertiser does not pay their maximum submitted bid; rather, they pay the bid of the second-highest bidder plus one cent. However, modern advertising networks augment raw monetary bids with proprietary Quality Scores (in Google) or Total Value Scores (in Meta, combining bid, estimated action rate, and ad quality score). A merchant with a stellar click-through rate (CTR) and exceptional landing page relevance can consistently outrank competitors while paying forty percent less per click.",
        
        "Furthermore, media buyers must understand the financial metrics governing ad buying: Cost Per Mille (CPM, the cost per one thousand impressions), Cost Per Click (CPC), and Click-Through Rate (CTR). When market competition intensifies—such as during fourth-quarter holiday sales or major retail festivals—auction density spikes, causing CPM rates across Meta and Google to inflate by fifty to one hundred percent. If an e-commerce brand's conversion rate (CVR) and Average Order Value (AOV) remain static during an auction surge, its Cost Per Acquisition (CPA) doubles, immediately turning previously profitable product lines cash-negative. Sustainable digital commerce requires real-time algorithmic bidding strategies that dynamically adjust bid caps based on SKU inventory levels and margin contribution.",
        
        "In our institutional Python model for Part 1, we simulate a multi-channel real-time programmatic ad auction. The algorithm takes advertiser bids, historical click-through rates, and landing page quality scores to calculate the Effective Ad Rank, determine the auction winner under GSP auction mechanics, and compute the clearing Cost Per Click (CPC) and clearing Cost Per Acquisition (CPA). Review the deterministic implementation below to master the quantitative foundations of digital ad auctions."
    ]

    p1_code = '''def simulate_gsp_ad_auction(
    bidders: list[dict],
    target_conversion_rate_pct: float
) -> dict:
    """
    Simulates a Generalized Second-Price (GSP) ad auction with Quality Score weighting.
    Calculates Effective Ad Rank, clearing CPC, and resulting CPA.
    """
    # 1. Calculate Ad Rank for each bidder: Bid * Quality Score
    ranked_bidders = []
    for b in bidders:
        ad_rank = b['max_cpc_bid_usd'] * b['quality_score']
        ranked_bidders.append({
            'advertiser': b['name'],
            'bid_usd': b['max_cpc_bid_usd'],
            'quality_score': b['quality_score'],
            'ad_rank': round(ad_rank, 4)
        })
    
    # Sort descending by Ad Rank
    ranked_bidders.sort(key=lambda x: x['ad_rank'], reverse=True)
    
    # 2. Determine Clearing CPC for Winner: (Ad_Rank_Runner_Up / Winner_Quality_Score) + $0.01
    winner = ranked_bidders[0]
    runner_up = ranked_bidders[1]
    
    clearing_cpc_usd = (runner_up['ad_rank'] / winner['quality_score']) + 0.01
    clearing_cpc_usd = min(clearing_cpc_usd, winner['bid_usd']) # Cannot exceed max bid
    
    # 3. Compute CPA based on Conversion Rate: CPC / (CVR / 100)
    cvr_decimal = target_conversion_rate_pct / 100.0
    clearing_cpa_usd = clearing_cpc_usd / cvr_decimal if cvr_decimal > 0 else 0.0
    
    return {
        'winner_name': winner['advertiser'],
        'winner_max_bid_usd': winner['bid_usd'],
        'winner_quality_score': winner['quality_score'],
        'winner_ad_rank': winner['ad_rank'],
        'runner_up_name': runner_up['advertiser'],
        'runner_up_ad_rank': runner_up['ad_rank'],
        'clearing_cpc_usd': round(clearing_cpc_usd, 2),
        'clearing_cpa_usd': round(clearing_cpa_usd, 2),
        'auction_leaderboard': ranked_bidders
    }

bidders_cohort = [
    {'name': 'AlphaRetail', 'max_cpc_bid_usd': 3.50, 'quality_score': 9.2},
    {'name': 'BetaDirect',  'max_cpc_bid_usd': 4.20, 'quality_score': 7.1},
    {'name': 'GammaBrands', 'max_cpc_bid_usd': 5.00, 'quality_score': 5.5},
    {'name': 'DeltaOutlet', 'max_cpc_bid_usd': 2.80, 'quality_score': 6.8}
]

auction_result = simulate_gsp_ad_auction(bidders_cohort, target_conversion_rate_pct=3.2)

print("=== REAL-TIME PROGRAMMATIC AD AUCTION (GSP) ===")
print(f"Auction Winner:            {auction_result['winner_name']}")
print(f"Winner Quality Score:      {auction_result['winner_quality_score']} / 10.0")
print(f"Winner Ad Rank:            {auction_result['winner_ad_rank']}")
print(f"Runner-Up:                 {auction_result['runner_up_name']} (Ad Rank: {auction_result['runner_up_ad_rank']})")
print(f"Clearing Cost Per Click:   ${auction_result['clearing_cpc_usd']:.2f} (Max Bid: ${auction_result['winner_max_bid_usd']:.2f})")
print(f"Clearing Cost Per Acquisition: ${auction_result['clearing_cpa_usd']:.2f} (at 3.2% CVR)")'''

    p1_output = """=== REAL-TIME PROGRAMMATIC AD AUCTION (GSP) ===
Auction Winner:            AlphaRetail
Winner Quality Score:      9.2 / 10.0
Winner Ad Rank:            32.2
Runner-Up:                 BetaDirect (Ad Rank: 29.82)
Clearing Cost Per Click:   $3.25 (Max Bid: $3.50)
Clearing Cost Per Acquisition: $101.60 (at 3.2% CVR)"""

    p1_notes = [
        "In a Generalized Second-Price (GSP) auction, the winning bidder pays only the minimum amount required to beat the runner-up's Ad Rank.",
        "Quality Score acts as a direct financial discount: AlphaRetail won the auction despite bidding $3.50 against GammaBrands' $5.00 bid.",
        "Clearing Cost Per Click ($3.25) divided by conversion rate (3.2%) produces a clearing Cost Per Acquisition (CPA) of $101.60."
    ]

    p1_check = {
        "question": "Why did AlphaRetail win the ad auction despite submitting a lower maximum bid ($3.50) than GammaBrands ($5.00)?",
        "options": [
            "Because AlphaRetail had a higher Quality Score (9.2 vs 5.5), generating a higher total Ad Rank (32.20 vs 27.50)",
            "Because AlphaRetail paid Google a private kickback under the table",
            "Because GammaBrands was disqualified for bidding too high",
            "Because the auction platform randomly selects a winner among all bids above $3.00"
        ],
        "answer": 0,
        "why": "Ad Rank is the product of bid price and quality score. AlphaRetail's superior relevance and landing page experience gave it a higher Ad Rank, securing the top ad spot at a lower cost."
    }

    parts.append({
        "title": "Paid Traffic Channels, First-Price vs Second-Price Ad Auctions & Bid Dynamics",
        "say": p1_say,
        "example": "Wayfair optimized its Google Search ad campaigns by improving Product Detail Page load speeds and title relevance, raising its Google Quality Score from 6 to 9. This lifted Ad Rank and decreased average CPC by 28%, saving over $14M in annual ad spend.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Lower AlphaRetail's quality_score to 6.5 in bidders_cohort and re-run. Observe how BetaDirect captures the top auction position.",
        "check": p1_check
    })

    # Part 2: ROAS vs POAS (Profit on Ad Spend) & Contribution Margin 3 (CM3)
    p2_say = [
        "In performance marketing, the most common metric cited by digital marketing agencies is Return on Ad Spend (ROAS), defined as Gross Attributed Ad Revenue divided by Total Ad Spend. A digital agency will proudly report a 4.0x ROAS—meaning that for every one dollar spent on Meta or Google ads, the store generated four dollars in top-line sales. However, modern e-commerce CFOs recognize that ROAS is a vanity metric that can easily mask corporate bankruptcy. High ROAS does not guarantee profitability because it completely ignores Cost of Goods Sold (COGS), merchant processing fees, pick-and-pack fulfillment labor, and shipping overhead.",
        
        "To illustrate the fatal flaw of ROAS, consider a luxury watch brand selling a chronograph for $1,000 with a $250 ad spend, achieving a 4.0x ROAS ($1,000 / $250). If the wholesale COGS of the watch is $800, shipping is $30, and payment processing is $30, the brand's total costs are $1,110 ($800 + $30 + $30 + $250), resulting in a net loss of $110 per sale despite the celebrated 4.0x ROAS! Conversely, a high-margin digital skincare brand selling a serum for $100 with $20 COGS and $5 fulfillment can spend $40 on ads (a modest 2.5x ROAS) and still generate $35 in pure operating profit per unit.",
        
        "Because of this fundamental distortion, sophisticated digital retailers transition from ROAS to POAS: Profit on Ad Spend. POAS is calculated as Gross Profit (Net Revenue minus COGS) divided by Ad Spend. A POAS greater than 1.0 indicates that the ad campaign generates more gross margin dollars than it consumes in advertising costs, contributing directly to fixed overhead and EBITDA. Even more rigorously, corporate finance teams calculate Contribution Margin 3 (CM3): Revenue minus COGS (CM1), minus direct variable fulfillment, payment processing, and return reserves (CM2), minus direct performance marketing ad spend (CM3). If CM3 is negative, scaling ad budgets accelerates company losses.",
        
        "In our institutional Python model for Part 2, we simulate an enterprise SKU-level campaign audit comparing traditional ROAS against POAS and Contribution Margin 3 across three diverse product categories. The engine determines whether each marketing campaign is truly profit-accretive or secretly value-destroying. Review the deterministic code below to analyze the quantitative mechanics of POAS and margin gating."
    ]

    p2_code = '''def evaluate_roas_vs_poas_and_cm3(
    campaign_name: str,
    gross_ad_revenue_usd: float,
    ad_spend_usd: float,
    cogs_usd: float,
    variable_fulfillment_usd: float,
    payment_processing_pct: float,
    return_allowance_pct: float
) -> dict:
    """
    Evaluates campaign performance using ROAS, POAS, and Contribution Margin 3 (CM3).
    Determines true operational profitability beyond top-line agency vanity metrics.
    """
    # 1. Traditional ROAS: Gross Revenue / Ad Spend
    roas_ratio = gross_ad_revenue_usd / ad_spend_usd if ad_spend_usd > 0 else 0.0
    
    # 2. Variable Costs & Contribution Margin 1 & 2
    cm1_gross_profit_usd = gross_ad_revenue_usd - cogs_usd
    poas_ratio = cm1_gross_profit_usd / ad_spend_usd if ad_spend_usd > 0 else 0.0
    
    payment_fees_usd = gross_ad_revenue_usd * (payment_processing_pct / 100.0)
    return_reserve_usd = gross_ad_revenue_usd * (return_allowance_pct / 100.0)
    
    cm2_net_variable_usd = cm1_gross_profit_usd - variable_fulfillment_usd - payment_fees_usd - return_reserve_usd
    
    # 3. Contribution Margin 3 (CM3): CM2 - Direct Ad Spend
    cm3_net_profit_usd = cm2_net_variable_usd - ad_spend_usd
    cm3_margin_pct = (cm3_net_profit_usd / gross_ad_revenue_usd) * 100.0 if gross_ad_revenue_usd > 0 else 0.0
    
    status = "PROFIT_ACCRETIVE" if cm3_net_profit_usd > 0 else "VALUE_DESTROYING_LOSS"
    
    return {
        'campaign': campaign_name,
        'revenue_usd': round(gross_ad_revenue_usd, 2),
        'ad_spend_usd': round(ad_spend_usd, 2),
        'roas': round(roas_ratio, 2),
        'poas': round(poas_ratio, 2),
        'cm1_gross_profit_usd': round(cm1_gross_profit_usd, 2),
        'cm2_net_variable_usd': round(cm2_net_variable_usd, 2),
        'cm3_net_profit_usd': round(cm3_net_profit_usd, 2),
        'cm3_margin_pct': round(cm3_margin_pct, 2),
        'status': status
    }

campaign_a = evaluate_roas_vs_poas_and_cm3(
    campaign_name="Consumer_Electronics_Gadgets",
    gross_ad_revenue_usd=50000.0,
    ad_spend_usd=12500.0, # 4.0x ROAS!
    cogs_usd=35000.0,     # Low gross margin (70% COGS)
    variable_fulfillment_usd=3200.0,
    payment_processing_pct=2.9,
    return_allowance_pct=5.0
)

campaign_b = evaluate_roas_vs_poas_and_cm3(
    campaign_name="D2C_Organic_Cosmetics",
    gross_ad_revenue_usd=50000.0,
    ad_spend_usd=20000.0, # 2.5x ROAS (Lower vanity score)
    cogs_usd=9000.0,      # High gross margin (18% COGS)
    variable_fulfillment_usd=2800.0,
    payment_processing_pct=2.9,
    return_allowance_pct=2.0
)

print("=== CAMPAIGN FINANCIAL INTEGRITY AUDIT: ROAS VS POAS VS CM3 ===")
print(f"[{campaign_a['campaign']}]")
print(f"  Gross Revenue: ${campaign_a['revenue_usd']:,.2f} | Ad Spend: ${campaign_a['ad_spend_usd']:,.2f}")
print(f"  Reported ROAS: {campaign_a['roas']}x | POAS: {campaign_a['poas']}x")
print(f"  CM3 Net Profit: ${campaign_a['cm3_net_profit_usd']:,.2f} ({campaign_a['cm3_margin_pct']}%) -> Status: [{campaign_a['status']}]")
print()
print(f"[{campaign_b['campaign']}]")
print(f"  Gross Revenue: ${campaign_b['revenue_usd']:,.2f} | Ad Spend: ${campaign_b['ad_spend_usd']:,.2f}")
print(f"  Reported ROAS: {campaign_b['roas']}x | POAS: {campaign_b['poas']}x")
print(f"  CM3 Net Profit: ${campaign_b['cm3_net_profit_usd']:,.2f} ({campaign_b['cm3_margin_pct']}%) -> Status: [{campaign_b['status']}]")'''

    p2_output = """=== CAMPAIGN FINANCIAL INTEGRITY AUDIT: ROAS VS POAS VS CM3 ===
[Consumer_Electronics_Gadgets]
  Gross Revenue: $50,000.00 | Ad Spend: $12,500.00
  Reported ROAS: 4.0x | POAS: 1.2x
  CM3 Net Profit: $-4,650.00 (-9.3%) -> Status: [VALUE_DESTROYING_LOSS]

[D2C_Organic_Cosmetics]
  Gross Revenue: $50,000.00 | Ad Spend: $20,000.00
  Reported ROAS: 2.5x | POAS: 2.05x
  CM3 Net Profit: $15,750.00 (31.5%) -> Status: [PROFIT_ACCRETIVE]"""

    p2_notes = [
        "Campaign A achieved a 4.0x agency ROAS but lost $4,650 (-9.3% CM3) due to heavy 70% COGS and variable shipping overhead.",
        "Campaign B reported an ostensibly weaker 2.5x ROAS but generated $15,750 (+31.5% CM3) in net operating cash flow.",
        "POAS (Profit on Ad Spend) measures gross margin dollars generated per ad dollar, shielding retailers from margin-dilutive ad scaling."
    ]

    p2_check = {
        "question": "Why did the Consumer Electronics campaign generate a net operational loss despite reporting an impressive 4.0x ROAS?",
        "options": [
            "Because its low gross margins (70% COGS) plus fulfillment and merchant fees exceeded the 25% gross ad revenue margin, causing a negative CM3",
            "Because the ad platform failed to deliver impressions to mobile devices",
            "Because Google Search charges higher sales tax on electronic goods",
            "Because 4.0x ROAS is mathematically equivalent to zero revenue"
        ],
        "answer": 0,
        "why": "At a 4.0x ROAS, ad spend accounts for 25% of gross revenue. With 70% COGS, product costs and ads alone consume 95% of revenue, leaving only 5%—which was entirely wiped out by fulfillment, returns, and payment fees."
    }

    parts.append({
        "title": "ROAS vs POAS (Profit on Ad Spend) & Contribution Margin 3 (CM3)",
        "say": p2_say,
        "example": "Anker Electronics transitioned its Amazon Sponsored Products management from ROAS targets to SKU-level POAS and CM3 rules. By pausing high-ROAS but low-margin accessory campaigns and reallocating capital to high-POAS GaN chargers, Anker increased net operating profit by $8.2M.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Increase Consumer Electronics ad_spend_usd to $15,000 to observe how ROAS degrades to 3.33x and accelerates company losses to -$7,150.",
        "check": p2_check
    })

    # Part 3: Blended CAC, Paid CAC, Marketing Efficiency Ratio (MER) & Organic Multipliers
    p3_say = [
        "In modern digital business, tracking isolated ad metrics inside platform ad managers (such as Facebook Ads Manager or Google Ads) leads to significant reporting discrepancies. Following Apple's iOS 14.5 App Tracking Transparency (ATT) framework and universal cookie deprecation, platform-reported conversion metrics have become fragmented and unreliable. If an e-commerce executive relies exclusively on platform-reported Paid CAC (Ad Spend divided by Platform-Attributed Orders), they risk either over-investing in cannibalizing ads or starving high-impact brand discovery channels.",
        
        "To navigate post-cookie marketing realities, performance leaders rely on the Marketing Efficiency Ratio (MER), colloquially known as the 'Blended ROAS'. MER is defined as Total Top-Line Store Revenue divided by Total Marketing Ad Spend across all channels. If a direct-to-consumer brand generates $1,000,000 in total monthly sales and spends $200,000 in aggregate ad spend across Meta, Google, and TikTok, its MER is 5.0x ($1,000,000 / $200,000). Unlike platform ROAS, MER cannot be faked or double-counted by competing ad networks; it reflects the unvarnished efficiency of the total marketing flywheel.",
        
        "Concurrently, financial executives analyze the relationship between Paid CAC and Blended CAC. Paid Customer Acquisition Cost is calculated as Direct Ad Spend divided by Paid Ad Conversions. In contrast, Blended Customer Acquisition Cost is calculated as Total Ad Spend divided by Total New Customers Acquired across ALL channels (including organic search, direct word-of-mouth, referrals, and social virality). The ratio between Paid CAC and Blended CAC reveals the Organic Multiplier of the brand. A brand with a strong brand moat, high SEO authority, and customer word-of-mouth may have a Paid CAC of $80 on Facebook, but a Blended CAC of only $40 because every paid customer introduces additional unpaid organic shoppers.",
        
        "In our institutional Python model for Part 3, we simulate an enterprise multi-channel marketing budget across Meta, Google Ads, TikTok, and Organic direct traffic. The algorithm reconciles platform-reported conversions against holistic Shopify backend order data, computing channel-specific Paid CAC, portfolio-wide Blended CAC, and the overall Marketing Efficiency Ratio (MER). Review the deterministic implementation below to master blended acquisition economics."
    ]

    p3_code = '''def analyze_blended_acquisition_and_mer(
    channel_data: dict[str, dict],
    organic_revenue_usd: float,
    organic_new_customers: int
) -> dict:
    """
    Computes Paid CAC, Blended CAC, and Marketing Efficiency Ratio (MER).
    Reconciles multi-platform ad spend against holistic store performance.
    """
    total_ad_spend_usd = 0.0
    total_paid_orders = 0
    total_paid_revenue_usd = 0.0
    channel_breakdown = {}
    
    for channel, metrics in channel_data.items():
        spend = metrics['ad_spend_usd']
        orders = metrics['attributed_orders']
        rev = metrics['attributed_revenue_usd']
        
        paid_cac = spend / orders if orders > 0 else 0.0
        platform_roas = rev / spend if spend > 0 else 0.0
        
        total_ad_spend_usd += spend
        total_paid_orders += orders
        total_paid_revenue_usd += rev
        
        channel_breakdown[channel] = {
            'ad_spend_usd': round(spend, 2),
            'orders': orders,
            'paid_cac_usd': round(paid_cac, 2),
            'platform_roas': round(platform_roas, 2)
        }
        
    total_store_revenue_usd = total_paid_revenue_usd + organic_revenue_usd
    total_new_customers = total_paid_orders + organic_new_customers
    
    # Portfolio Financial Metrics
    blended_cac_usd = total_ad_spend_usd / total_new_customers if total_new_customers > 0 else 0.0
    blended_paid_cac_usd = total_ad_spend_usd / total_paid_orders if total_paid_orders > 0 else 0.0
    mer_ratio = total_store_revenue_usd / total_ad_spend_usd if total_ad_spend_usd > 0 else 0.0
    organic_lift_multiplier = total_new_customers / total_paid_orders if total_paid_orders > 0 else 1.0
    
    return {
        'total_ad_spend_usd': round(total_ad_spend_usd, 2),
        'total_store_revenue_usd': round(total_store_revenue_usd, 2),
        'total_new_customers': total_new_customers,
        'blended_paid_cac_usd': round(blended_paid_cac_usd, 2),
        'blended_cac_usd': round(blended_cac_usd, 2),
        'mer_ratio': round(mer_ratio, 2),
        'organic_lift_multiplier': round(organic_lift_multiplier, 2),
        'channel_metrics': channel_breakdown
    }

paid_channels = {
    'Meta_Ads':   {'ad_spend_usd': 45000.0, 'attributed_orders': 900,  'attributed_revenue_usd': 99000.0},
    'Google_Ads': {'ad_spend_usd': 30000.0, 'attributed_orders': 500,  'attributed_revenue_usd': 65000.0},
    'TikTok_Ads': {'ad_spend_usd': 15000.0, 'attributed_orders': 250,  'attributed_revenue_usd': 27500.0}
}

mer_audit = analyze_blended_acquisition_and_mer(
    channel_data=paid_channels,
    organic_revenue_usd=78500.0,
    organic_new_customers=650
)

print("=== ENTERPRISE MARKETING EFFICIENCY & BLENDED CAC AUDIT ===")
print(f"Total Ad Spend:              ${mer_audit['total_ad_spend_usd']:,.2f}")
print(f"Total Store Revenue:         ${mer_audit['total_store_revenue_usd']:,.2f}")
print(f"Marketing Efficiency Ratio (MER): {mer_audit['mer_ratio']}x")
print(f"Total New Customers:         {mer_audit['total_new_customers']:,} (Paid: 1,650 | Organic: 650)")
print(f"Blended Paid CAC:            ${mer_audit['blended_paid_cac_usd']:.2f} per customer")
print(f"Holistic Blended CAC:        ${mer_audit['blended_cac_usd']:.2f} per customer")
print(f"Organic Customer Multiplier: {mer_audit['organic_lift_multiplier']}x")'''

    p3_output = """=== ENTERPRISE MARKETING EFFICIENCY & BLENDED CAC AUDIT ===
Total Ad Spend:              $90,000.00
Total Store Revenue:         $270,000.00
Marketing Efficiency Ratio (MER): 3.0x
Total New Customers:         2,300 (Paid: 1,650 | Organic: 650)
Blended Paid CAC:            $54.55 per customer
Holistic Blended CAC:        $39.13 per customer
Organic Customer Multiplier: 1.39x"""

    p3_notes = [
        "Marketing Efficiency Ratio (MER = 3.0x) evaluates total storefront revenue against total marketing outlay, eliminating double-counted ad conversions.",
        "While Blended Paid CAC was $54.55 across paid ad networks, organic word-of-mouth and SEO reduced the true Holistic Blended CAC to $39.13.",
        "The Organic Multiplier of 1.39x indicates that for every 100 customers acquired through paid ads, the brand earns an additional 39 organic customers."
    ]

    p3_check = {
        "question": "What is the primary operational advantage of using Marketing Efficiency Ratio (MER) over individual platform-reported ROAS?",
        "options": [
            "MER reconciles total top-line store revenue against total marketing ad spend, immune to platform attribution overlap, pixel loss, and double counting",
            "MER guarantees that Facebook and Google will stop charging credit card fees",
            "MER automatically generates video advertisements using artificial intelligence",
            "MER eliminates the need to pay for shipping and logistics"
        ],
        "answer": 0,
        "why": "Ad networks routinely double-count conversions (e.g., a customer clicks a Facebook ad and then a Google Search ad). MER uses actual bank deposits and total spend to reveal true commercial marketing efficiency."
    }

    parts.append({
        "title": "Blended CAC, Paid CAC, Marketing Efficiency Ratio (MER) & Organic Multipliers",
        "say": p3_say,
        "example": "Gymshark structured its global media buying around a strict 4.0x MER threshold rather than isolated platform ROAS. By allowing individual channel ROAS to fluctuate while defending top-line MER, Gymshark scaled global revenue past £500M while keeping customer acquisition profitable.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Increase organic_new_customers from 650 to 1,200 to observe how the Organic Multiplier climbs to 1.73x and Blended CAC drops to $31.58.",
        "check": p3_check
    })

    # Part 4: Multi-Touch Attribution (MTA), Shapley Value & Media Mix Modeling (MMM)
    p4_say = [
        "One of the greatest unsolved dilemmas in modern digital merchandising is media attribution: how should revenue and conversion credit be distributed across the multiple touchpoints a consumer encounters before completing a checkout? Historically, e-commerce brands relied on simplistic single-touch attribution models: First-Touch Attribution (which credits 100% of the sale to the initial ad that introduced the user to the brand) or Last-Touch Attribution (which credits 100% of the sale to the final click immediately prior to checkout). Both single-touch models are deeply flawed: First-Touch over-credits top-of-funnel TikTok videos while ignoring closing search ads; Last-Touch over-credits branded Google search and retargeting ads that merely captured customers who were already committed to buying.",
        
        "To achieve fair credit distribution, data science teams implement Multi-Touch Attribution (MTA) frameworks based on cooperative game theory, most notably the Shapley Value formulation. Originating from Nobel laureate Lloyd Shapley's work in economics, the Shapley Value calculates the marginal contribution of each marketing channel across all possible order sequences and channel coalitions. If a customer journey consists of a Facebook discovery ad, a Pinterest inspiration pin, an email newsletter click, and a final Google Search ad, Shapley attribution assigns fractional credit proportional to how much each touchpoint increased the statistical conversion probability.",
        
        "However, even multi-touch click attribution faces severe limitations due to privacy legislation (GDPR/CCPA) and Safari Intelligent Tracking Prevention (ITP). Therefore, advanced enterprise brands complement MTA with top-down Media Mix Modeling (MMM). Media Mix Modeling uses aggregate statistical regression (such as Bayesian Ridge regression) to model the macro relationship between marketing spend across channels and total sales volume over time. MMM incorporates channel-specific Adstock Decay (the lingering carryover effect of advertising over subsequent weeks) and Diminishing Marginal Returns (the Hill function, where incremental ad spend yields progressively smaller sales gains).",
        
        "In our institutional Python model for Part 4, we simulate an algorithmic Shapley Value attribution engine across a multi-touch customer journey dataset. The engine evaluates channel coalitions, measures marginal conversion lift, and allocates fair fractional revenue attribution across Paid Social, Paid Search, and Email Marketing. Review the deterministic code below to analyze algorithmic attribution."
    ]

    p4_code = '''def calculate_shapley_attribution(
    coalition_conversion_rates: dict[tuple, float],
    total_conversions: int,
    total_order_value_usd: float
) -> dict:
    """
    Computes algorithmic Shapley Value attribution across marketing touchpoints.
    Calculates marginal contributions across all coalition permutations.
    """
    channels = ['Paid_Social', 'Paid_Search', 'Email_Marketing']
    n = len(channels)
    import itertools
    import math
    
    shapley_weights = {ch: 0.0 for ch in channels}
    
    # Iterate through all channels and coalitions
    for ch in channels:
        other_channels = [c for c in channels if c != ch]
        
        for k in range(0, n):
            for subset in itertools.combinations(other_channels, k):
                coalition = tuple(sorted(subset))
                coalition_with_ch = tuple(sorted(subset + (ch,)))
                
                v_coalition = coalition_conversion_rates.get(coalition, 0.0)
                v_with_ch = coalition_conversion_rates.get(coalition_with_ch, 0.0)
                marginal_contribution = v_with_ch - v_coalition
                
                # Shapley permutation weight: |S|! * (n - |S| - 1)! / n!
                s_len = len(subset)
                weight = (math.factorial(s_len) * math.factorial(n - s_len - 1)) / math.factorial(n)
                shapley_weights[ch] += weight * marginal_contribution
                
    # Normalize weights into attribution percentages
    total_shapley_sum = sum(shapley_weights.values())
    attribution_results = {}
    
    for ch, val in shapley_weights.items():
        pct = (val / total_shapley_sum) if total_shapley_sum > 0 else 0.0
        allocated_conversions = round(total_conversions * pct, 1)
        allocated_revenue = round(total_order_value_usd * pct, 2)
        
        attribution_results[ch] = {
            'shapley_weight': round(val, 4),
            'attribution_pct': round(pct * 100.0, 2),
            'attributed_conversions': allocated_conversions,
            'attributed_revenue_usd': allocated_revenue
        }
        
    return attribution_results

# Observed empirical conversion rates across channel touchpoint combinations
journey_rates = {
    (): 0.005,                        # Baseline baseline organic
    ('Email_Marketing',): 0.015,
    ('Paid_Search',): 0.025,
    ('Paid_Social',): 0.020,
    ('Email_Marketing', 'Paid_Search'): 0.045,
    ('Email_Marketing', 'Paid_Social'): 0.038,
    ('Paid_Search', 'Paid_Social'): 0.055,
    ('Email_Marketing', 'Paid_Search', 'Paid_Social'): 0.082
}

shapley_audit = calculate_shapley_attribution(
    coalition_conversion_rates=journey_rates,
    total_conversions=1500,
    total_order_value_usd=187500.0
)

print("=== GAME-THEORETIC SHAPLEY MULTI-TOUCH ATTRIBUTION ===")
print(f"Total Attributed Conversions: 1,500 orders | Total Attributed GMV: $187,500.00")
for ch, res in shapley_audit.items():
    print(f"Channel: {ch:<16} | Weight: {res['shapley_weight']:.4f} | Share: {res['attribution_pct']:5.2f}% | Attributed GMV: ${res['attributed_revenue_usd']:,.2f}")'''

    p4_output = """=== GAME-THEORETIC SHAPLEY MULTI-TOUCH ATTRIBUTION ===
Total Attributed Conversions: 1,500 orders | Total Attributed GMV: $187,500.00
Channel: Paid_Social      | Weight: 0.0262 | Share: 33.98% | Attributed GMV: $63,717.53
Channel: Paid_Search      | Weight: 0.0322 | Share: 41.77% | Attributed GMV: $78,327.92
Channel: Email_Marketing  | Weight: 0.0187 | Share: 24.24% | Attributed GMV: $45,454.55"""

    p4_notes = [
        "Shapley Value multi-touch attribution calculates the fair marginal contribution of each channel across all coalition permutations.",
        "Paid Search captured 41.77% of conversion credit ($78,327.92), while Paid Social earned 33.98% ($63,717.53) for top-of-funnel discovery.",
        "Email Marketing secured 24.24% of attributed revenue ($45,454.55), proving that lifecycle retention significantly lifts total conversion velocity."
    ]

    p4_check = {
        "question": "Why is Shapley Value Multi-Touch Attribution superior to Last-Click Attribution in multi-channel e-commerce?",
        "options": [
            "Because it measures each channel's marginal contribution across all customer journey permutations, fairly crediting top-of-funnel discovery ads rather than just the final click",
            "Because it completely eliminates advertising costs across all social media networks",
            "Because it allows brands to track users without their browser consent",
            "Because it automatically refunds customer purchase charges"
        ],
        "answer": 0,
        "why": "Last-Click attribution creates an extreme bias toward branded search and retargeting ads. Shapley attribution evaluates marginal lift across all channel combinations, ensuring discovery channels receive appropriate budget."
    }

    parts.append({
        "title": "Multi-Touch Attribution (MTA), Shapley Value & Media Mix Modeling (MMM)",
        "say": p4_say,
        "example": "Allbirds replaced last-click Google Analytics attribution with a Shapley Value and Media Mix Modeling engine. The company discovered that top-of-funnel YouTube video campaigns—which appeared unprofitable under last-click rules—actually drove 34% of downstream branded search conversions, prompting a strategic budget rebalancing.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Increase the triple coalition ('Email_Marketing', 'Paid_Search', 'Paid_Social') conversion rate to 0.120 and observe how synergistic multi-touch lift redistributes attribution percentages.",
        "check": p4_check
    })

    # Part 5: Enterprise Advertising Control Gateway & Portfolio Allocation Certification
    p5_say = [
        "To conclude Day 16, we synthesize programmatic ad auctions, Contribution Margin 3 (CM3) thresholds, Marketing Efficiency Ratios (MER), and Shapley multi-touch attribution into a unified executive infrastructure: the Enterprise Digital Advertising Operations & Capital Allocation Gateway. In enterprise digital commerce, marketing leadership cannot operate campaigns in disconnected silos. Ad budgets must dynamically respond to SKU inventory stockouts, gross margin variations, warehouse pick-and-pack capacity, and blended customer lifetime value (LTV).",
        
        "The Enterprise Advertising Command Gateway executes four continuous autonomous governance loops: First, Margin Floor Protection—it monitors SKU-level gross margins and automatically caps ad spend on low-margin products before CM3 turns negative; Second, Inventory-Aware Bidding—it pulls real-time inventory feeds from the warehouse management system (WMS) and automatically throttles ad spend when a SKU drops below safety stock levels to prevent costly stockouts; Third, Blended Portfolio Efficiency—it enforces minimum corporate MER thresholds (such as 3.5x MER) across aggregate ad spend to prevent overspending during seasonal auction spikes; and Fourth, Algorithmic Capital Reallocation—it shifts marginal ad dollars from saturated channels experiencing diminishing returns into high-efficiency discovery and retention channels based on Shapley marginal lift curves.",
        
        "In our institutional Python capstone for Day 16, we simulate an enterprise portfolio managing $500,000 in monthly ad spend across an omnichannel catalog of 200 SKUs. The gateway analyzes multi-channel acquisition metrics, audits contribution margin waterfalls, checks inventory availability, and calculates the overall Performance Marketing Health Score (PMHS). Achieving a PMHS above 85.0 points confers the Apex Enterprise Performance Marketing Certification. Review the deterministic code below to analyze enterprise digital ad governance."
    ]

    p5_code = '''def run_enterprise_advertising_control_gateway(
    total_monthly_ad_spend_usd: float,
    gross_ad_attributed_revenue_usd: float,
    total_store_revenue_usd: float,
    cogs_usd: float,
    fulfillment_and_fees_usd: float,
    in_stock_inventory_rate_pct: float,
    shapley_balanced_score: float
) -> dict:
    """
    Enterprise Digital Advertising Command Gateway.
    Synthesizes ROAS, POAS, CM3, MER, inventory health, and attribution into PMHS certification.
    """
    # 1. Financial Efficiency Metrics
    roas = gross_ad_attributed_revenue_usd / total_monthly_ad_spend_usd
    gross_profit_usd = gross_ad_attributed_revenue_usd - cogs_usd
    poas = gross_profit_usd / total_monthly_ad_spend_usd
    cm3_net_profit_usd = gross_profit_usd - fulfillment_and_fees_usd - total_monthly_ad_spend_usd
    cm3_margin_pct = (cm3_net_profit_usd / gross_ad_attributed_revenue_usd) * 100.0
    mer = total_store_revenue_usd / total_monthly_ad_spend_usd
    
    # 2. Performance Marketing Health Score (PMHS, 100 pt max)
    # Component A: CM3 Margin Health (30 pts, target >= 20% CM3)
    score_cm3 = min(30.0, max(0.0, (cm3_margin_pct / 20.0) * 30.0))
    
    # Component B: Marketing Efficiency Ratio (25 pts, target >= 3.5x MER)
    score_mer = min(25.0, max(0.0, (mer / 3.5) * 25.0))
    
    # Component C: Inventory Alignment (25 pts, target >= 95% in-stock)
    score_inventory = min(25.0, max(0.0, (in_stock_inventory_rate_pct / 95.0) * 25.0))
    
    # Component D: Multi-Touch Attribution Discipline (20 pts)
    score_attribution = min(20.0, shapley_balanced_score * 20.0)
    
    total_pmhs_score = round(score_cm3 + score_mer + score_inventory + score_attribution, 2)
    certified = total_pmhs_score >= 85.0
    
    return {
        'monthly_ad_spend_usd': round(total_monthly_ad_spend_usd, 2),
        'store_revenue_usd': round(total_store_revenue_usd, 2),
        'roas': round(roas, 2),
        'poas': round(poas, 2),
        'cm3_net_profit_usd': round(cm3_net_profit_usd, 2),
        'cm3_margin_pct': round(cm3_margin_pct, 2),
        'mer': round(mer, 2),
        'pmhs_composite_score': total_pmhs_score,
        'pillar_scores': {
            'cm3_margin_pts': round(score_cm3, 2),
            'mer_efficiency_pts': round(score_mer, 2),
            'inventory_sync_pts': round(score_inventory, 2),
            'attribution_balance_pts': round(score_attribution, 2)
        },
        'certification_conferred': certified,
        'status': 'APEX_PERFORMANCE_MARKETING_CERTIFIED' if certified else 'MARGIN_REMEDIATION_REQUIRED'
    }

ad_audit = run_enterprise_advertising_control_gateway(
    total_monthly_ad_spend_usd=500000.0,
    gross_ad_attributed_revenue_usd=1750000.0, # 3.5x ROAS
    total_store_revenue_usd=2450000.0,         # 4.9x MER
    cogs_usd=525000.0,                         # 30% COGS
    fulfillment_and_fees_usd=297500.0,         # 17% fulfillment/merchant fees
    in_stock_inventory_rate_pct=96.8,          # 96.8% in-stock rate
    shapley_balanced_score=0.92                # Strong multi-touch balance
)

print("=== ENTERPRISE ADVERTISING CONTROL GATEWAY & PORTFOLIO ACCREDITATION ===")
print(f"Monthly Ad Capital Allocated:   ${ad_audit['monthly_ad_spend_usd']:,.2f}")
print(f"Total Omnichannel Revenue:      ${ad_audit['store_revenue_usd']:,.2f}")
print(f"Blended ROAS:                   {ad_audit['roas']}x | POAS: {ad_audit['poas']}x")
print(f"Marketing Efficiency Ratio:     {ad_audit['mer']}x (Target: >= 3.5x)")
print(f"Contribution Margin 3 (CM3):    ${ad_audit['cm3_net_profit_usd']:,.2f} ({ad_audit['cm3_margin_pct']}%)")
print(f"Performance Marketing Health:   {ad_audit['pmhs_composite_score']} / 100.00 pts")
print(f"Pillar Breakdown:               CM3: {ad_audit['pillar_scores']['cm3_margin_pts']} | MER: {ad_audit['pillar_scores']['mer_efficiency_pts']} | WMS: {ad_audit['pillar_scores']['inventory_sync_pts']} | MTA: {ad_audit['pillar_scores']['attribution_balance_pts']}")
print(f"Governance Status:              [{ad_audit['status']}] (Certified: {ad_audit['certification_conferred']})")'''

    p5_output = """=== ENTERPRISE ADVERTISING CONTROL GATEWAY & PORTFOLIO ACCREDITATION ===
Monthly Ad Capital Allocated:   $500,000.00
Total Omnichannel Revenue:      $2,450,000.00
Blended ROAS:                   3.5x | POAS: 2.45x
Marketing Efficiency Ratio:     4.9x (Target: >= 3.5x)
Contribution Margin 3 (CM3):    $427,500.00 (24.43%)
Performance Marketing Health:   98.4 / 100.00 pts
Pillar Breakdown:               CM3: 30.0 | MER: 25.0 | WMS: 25.0 | MTA: 18.4
Governance Status:              [APEX_PERFORMANCE_MARKETING_CERTIFIED] (Certified: True)"""

    p5_notes = [
        "The Enterprise Advertising Control Gateway integrates financial margin gates, WMS inventory feeds, and multi-touch attribution.",
        "Generating $427,500.00 in CM3 profit (24.43% margin) alongside a 4.9x MER confirms that the $500k ad spend is strongly profit-accretive.",
        "A Performance Marketing Health Score of 98.4/100 confers Apex Performance Marketing Certification."
    ]

    p5_check = {
        "question": "What is the primary function of inventory-aware bidding in an enterprise advertising control gateway?",
        "options": [
            "To automatically suppress or throttle ad spend on SKUs that drop below warehouse safety stock levels, preventing paid advertising on out-of-stock items",
            "To force suppliers to manufacture products for free",
            "To send emails to social media influencers asking for free promotions",
            "To change the font color of the checkout page"
        ],
        "answer": 0,
        "why": "Advertising out-of-stock items wastes ad spend, drives up bounce rates, damages search ranking velocity, and frustrates customers. Inventory-aware bidding synchronizes WMS feeds with ad APIs to pause campaigns automatically."
    }

    parts.append({
        "title": "Enterprise Advertising Control Gateway & Portfolio Allocation Certification",
        "say": p5_say,
        "example": "A Tier-1 fashion conglomerate managing $2M monthly across Meta, Google, and TikTok integrated an automated ad gateway with its NetSuite ERP. The system automatically adjusted bid caps based on SKU inventory depth and real-time gross margin, eliminating over $250k in wasted ad spend on out-of-stock dresses.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Reduce in_stock_inventory_rate_pct to 75.0% to observe how inventory stockouts degrade the PMHS score and threaten certification status.",
        "check": p5_check
    })

    day16_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 16,
        "title": "Digital Advertising Economics: ROAS, CPA, Blended CAC & Attribution",
        "goal": "Master digital performance advertising economics and capital allocation: programmatic ad auctions (GSP mechanics), ROAS vs POAS vs Contribution Margin 3 (CM3) financial gating, Marketing Efficiency Ratio (MER) portfolio tracking, Shapley Value multi-touch attribution, and inventory-aware enterprise ad gateways.",
        "minutes": 35,
        "recap": "Welcome to Day 16 of E-Commerce & Marketplace Economics. Today we mastered Generalized Second-Price ad auctions, analyzed POAS and CM3 margin integrity over vanity ROAS, modeled blended acquisition and MER multipliers, formulated Shapley multi-touch attribution, and governed enterprise advertising capital.",
        "parts": parts,
        "summary": [
            "Programmatic ad auctions utilize Generalized Second-Price (GSP) mechanics where Quality Score directly discounts the clearing CPC.",
            "Return on Ad Spend (ROAS) is a top-line vanity metric; commercial leaders govern campaigns using POAS and Contribution Margin 3 (CM3).",
            "The Marketing Efficiency Ratio (MER = Total Revenue / Total Ad Spend) measures holistic commercial acquisition without platform overlap.",
            "Game-theoretic Shapley Value attribution distributes fractional conversion credit fairly across multi-touch customer journeys.",
            "Enterprise ad control gateways synchronize real-time WMS inventory telemetry to automatically pause ad spend on depleted SKUs."
        ]
    }

    total_words = ensure_ecom_day_budget(day16_dict, min_part_words=580, min_day_words=2950)
    return day16_dict, total_words

if __name__ == '__main__':
    d, words = build_day16()
    print(f"Day 16 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
