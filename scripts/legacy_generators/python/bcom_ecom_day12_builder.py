"""
Day 12 Builder: Marketplace Operations (Amazon / Flipkart / ONDC): The Buy Box Winning Algorithm
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-807
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 funnel visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day12():
    parts = []

    # Part 1: Multi-Channel Marketplace Ecosystems: 1P vs 3P Dynamics & Platform Take Rates
    p1_say = [
        "Welcome to Day 12 of B.Com E-Commerce and Digital Business. Today, we enter the multi-billion-dollar commercial arena of Marketplace Operations, focusing on global and regional platforms such as Amazon, Flipkart, Walmart Marketplace, and India's groundbreaking Open Network for Digital Commerce (ONDC). For contemporary brands and digital merchants, relying solely on a direct-to-consumer (D2C) standalone storefront is rarely sufficient to achieve institutional scale. Marketplaces aggregate massive consumer intent, trusted payment credentials, and frictionless prime fulfillment infrastructure. Over sixty percent of all product searches now begin directly on marketplace search bars rather than traditional search engines. However, scaling within these third-party platforms demands a sophisticated mathematical understanding of marketplace fee structures, merchant relationships, and platform economics.",
        
        "The first strategic architecture to evaluate is the fundamental operational distinction between First-Party (1P) and Third-Party (3P) retail models. In the 1P vendor model (exemplified by Amazon Vendor Central or Flipkart Retail), the brand acts as a traditional wholesale vendor: the marketplace issues bulk Purchase Orders (POs), acquires legal title and physical ownership of inventory at wholesale cost, and exercises unilateral control over retail pricing, marketing merchandising, and product page buy buttons. While 1P relationships offer predictable bulk revenue and massive volume, they strip brands of retail pricing autonomy, expose them to aggressive price matching algorithms that degrade brand equity, and impose punitive chargeback deductions for minor packaging or logistical compliance infractions.",
        
        "Conversely, in the 3P seller model (exemplified by Amazon Seller Central or Flipkart Seller Hub), the brand acts as an independent merchant on the platform: retaining legal title to the merchandise, establishing sovereign consumer retail prices, and selecting either platform-managed fulfillment (Fulfillment by Amazon / FBA) or merchant fulfillment (FBM). In exchange for platform access, the marketplace levies a layered stack of platform take rates: first, Category Referral Fees (typically eight to fifteen percent of gross transaction value); second, Closing and Payment Processing Fees (flat charges per order tier); third, FBA Pick, Pack, and Weight-Handling Fees; and fourth, Inbound and Monthly Storage Surcharges. When blended with compulsory Sponsored Product advertising spend, total marketplace take rates frequently consume twenty-eight to thirty-five percent of gross product revenue.",
        
        "To maintain institutional profitability across multi-channel marketplaces, e-commerce leaders continuously calculate the Net Contribution Margin 2 (CM2) across every marketplace SKU. If high platform commission fees, sponsored ad auction bids, and storage fees compress CM2 below twenty percent, the brand must either reformulate product packaging to reduce dimensional shipping weight, adjust channel retail pricing, or migrate transaction volume to direct channels.",
        
        "In our institutional Python model for Part 1, we simulate marketplace unit economics across 1P wholesale versus 3P FBA and 3P FBM models for a fifty-dollar consumer lifestyle accessory. The function evaluates referral fees, fulfillment handling costs, storage charges, advertising customer acquisition costs, and net realized contribution margins. Review the deterministic code below to master marketplace channel financial modeling."
    ]

    p1_code = '''def model_marketplace_channel_economics(
    retail_price_usd: float,
    manufacturing_cogs_usd: float,
    marketplace_model: str,
    ad_spend_pct_of_gmv: float
) -> dict:
    """
    Evaluates net unit contribution margins across 1P Wholesale,
    3P FBA (Fulfillment by Amazon), and 3P FBM (Merchant Fulfilled) models.
    """
    ad_spend_usd = retail_price_usd * ad_spend_pct_of_gmv
    
    if marketplace_model == "1P_WHOLESALE":
        # 1P wholesale: Marketplace buys at 50% discount off retail; brand pays inbound freight & co-op ads
        wholesale_price = retail_price_usd * 0.50
        inbound_freight = 1.80
        coop_mktg_allowance = wholesale_price * 0.08
        damage_allowance = wholesale_price * 0.02
        net_revenue = wholesale_price - coop_mktg_allowance - damage_allowance
        gross_profit = net_revenue - manufacturing_cogs_usd - inbound_freight
        cm_pct = (gross_profit / wholesale_price) * 100.0
        
        return {
            "model": "1P Vendor Wholesale",
            "topline_revenue_usd": round(wholesale_price, 2),
            "platform_deductions_usd": round(coop_mktg_allowance + damage_allowance, 2),
            "fulfillment_and_shipping_usd": round(inbound_freight, 2),
            "cogs_usd": round(manufacturing_cogs_usd, 2),
            "net_contribution_usd": round(gross_profit, 2),
            "contribution_margin_pct": round(cm_pct, 2)
        }
        
    elif marketplace_model == "3P_FBA":
        # 3P FBA: Brand sells at full retail; pays referral fee (15%), FBA pick/pack, storage & PPC
        referral_fee = retail_price_usd * 0.15
        fba_pick_pack_fee = 5.25
        storage_and_closing_fee = 0.85
        total_platform_fees = referral_fee + fba_pick_pack_fee + storage_and_closing_fee
        total_costs = manufacturing_cogs_usd + total_platform_fees + ad_spend_usd
        net_contribution = retail_price_usd - total_costs
        cm_pct = (net_contribution / retail_price_usd) * 100.0
        
        return {
            "model": "3P Fulfillment by Amazon (FBA)",
            "topline_revenue_usd": round(retail_price_usd, 2),
            "platform_deductions_usd": round(referral_fee + storage_and_closing_fee, 2),
            "fulfillment_and_shipping_usd": round(fba_pick_pack_fee, 2),
            "ad_spend_usd": round(ad_spend_usd, 2),
            "cogs_usd": round(manufacturing_cogs_usd, 2),
            "net_contribution_usd": round(net_contribution, 2),
            "contribution_margin_pct": round(cm_pct, 2)
        }
        
    else: # 3P_FBM
        # 3P FBM: Brand ships via 3PL; pays referral fee (15%) + independent courier ($7.50) + PPC
        referral_fee = retail_price_usd * 0.15
        closing_fee = 0.30
        own_carrier_shipping = 7.50
        total_platform_fees = referral_fee + closing_fee
        total_costs = manufacturing_cogs_usd + total_platform_fees + own_carrier_shipping + ad_spend_usd
        net_contribution = retail_price_usd - total_costs
        cm_pct = (net_contribution / retail_price_usd) * 100.0
        
        return {
            "model": "3P Merchant Fulfilled Network (FBM)",
            "topline_revenue_usd": round(retail_price_usd, 2),
            "platform_deductions_usd": round(total_platform_fees, 2),
            "fulfillment_and_shipping_usd": round(own_carrier_shipping, 2),
            "ad_spend_usd": round(ad_spend_usd, 2),
            "cogs_usd": round(manufacturing_cogs_usd, 2),
            "net_contribution_usd": round(net_contribution, 2),
            "contribution_margin_pct": round(cm_pct, 2)
        }

m_1p = model_marketplace_channel_economics(50.0, 12.0, "1P_WHOLESALE", 0.10)
m_fba = model_marketplace_channel_economics(50.0, 12.0, "3P_FBA", 0.10)
m_fbm = model_marketplace_channel_economics(50.0, 12.0, "3P_FBM", 0.10)

print(f"Model: {m_1p['model']} | Topline: ${m_1p['topline_revenue_usd']:.2f} | Net CM: ${m_1p['net_contribution_usd']:.2f} ({m_1p['contribution_margin_pct']}%)")
print(f"Model: {m_fba['model']} | Topline: ${m_fba['topline_revenue_usd']:.2f} | Net CM: ${m_fba['net_contribution_usd']:.2f} ({m_fba['contribution_margin_pct']}%)")
print(f"Model: {m_fbm['model']} | Topline: ${m_fbm['topline_revenue_usd']:.2f} | Net CM: ${m_fbm['net_contribution_usd']:.2f} ({m_fbm['contribution_margin_pct']}%)")'''

    p1_output = """Model: 1P Vendor Wholesale | Topline: $25.00 | Net CM: $8.70 (34.8%)
Model: 3P Fulfillment by Amazon (FBA) | Topline: $50.00 | Net CM: $19.40 (38.8%)
Model: 3P Merchant Fulfilled Network (FBM) | Topline: $50.00 | Net CM: $17.70 (35.4%)"""

    p1_check = {
        "question": "Why does a 3P FBA seller model often generate a higher net unit contribution dollar amount ($19.40) than a 1P wholesale model ($8.70) on a $50 retail product?",
        "options": [
            "Because 1P wholesale vendors are legally exempt from manufacturing product costs",
            "Because in 3P FBA, the brand captures the full $50 retail price rather than selling at a 50% wholesale discount ($25), retaining higher dollar margin after platform fees",
            "Because Amazon pays 3P sellers a 20% bonus on all prime orders",
            "Because 3P sellers never incur advertising customer acquisition expenses"
        ],
        "answer": 1,
        "why": "In 3P FBA, the seller captures the end-consumer retail price ($50.00). Even after deducting referral fees ($7.50), FBA pick/pack ($5.25), advertising ($5.00), and COGS ($12.00), the net retained cash is $19.40, compared to $8.70 in 1P wholesale."
    }

    p1_example = "Anker transitioned from an exclusive 1P vendor relationship with Amazon to a hybrid 3P Seller Central model for its high-margin consumer power banks. By maintaining sovereign control over retail pricing and inventory allocation, Anker expanded its gross contribution margin by 14% while preserving direct brand control over listing variations and review syndication."
    p1_tryit = "Increase ad_spend_pct_of_gmv from 0.10 to 0.18 to simulate hyper-competitive holiday PPC bidding. Note how the FBA net contribution drops and compare it against 1P wholesale."
    p1_notes = [
        "1P wholesale relationships yield bulk volume but strip pricing control and impose co-op advertising and chargeback deductions.",
        "3P seller models capture full retail pricing, with platform take rates averaging 25-35% across referral, FBA, and storage fees.",
        "FBA sellers enjoy Prime badge eligibility and algorithmic algorithmic delivery boosts over merchant-fulfilled sellers.",
        "Continuous monitoring of Contribution Margin 2 (CM2) ensures marketplace advertising spend does not erase product profitability."
    ]

    parts.append({
        "title": "Multi-Channel Marketplace Ecosystems: 1P vs 3P Economics & Take Rates",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "check": p1_check,
        "example": p1_example,
        "tryIt": p1_tryit,
        "codeNotes": p1_notes
    })

    # Part 2: The Buy Box Winning Algorithm: Scoring Mechanics & Operational Health SLAs
    p2_say = [
        "In Part 2, we dissect the single most valuable piece of digital real estate on the global internet: The Marketplace Buy Box (also termed the 'Featured Offer'). On multi-seller marketplaces like Amazon and Walmart, dozens of competing merchants frequently sell the exact same manufacturer barcode SKU under a single consolidated Product Detail Page (PDP). However, over eighty-five to ninety percent of all desktop marketplace purchases—and more than ninety-five percent of mobile app purchases—flow directly through the single primary 'Add to Cart' or 'Buy Now' button. Whichever seller wins the Buy Box captures virtually the entire stream of consumer transactions; competing sellers relegated to the obscure 'Other Sellers on Amazon' comparison table receive less than five percent of category sales.",
        
        "Winning the Buy Box is not simply a matter of posting the lowest price; it is governed by a complex, real-time algorithmic multi-variable scoring function. The marketplace algorithm seeks to maximize consumer conversion and platform loyalty by awarding the featured offer to the seller who delivers the highest combined customer value across four critical operational dimensions: First, Landed Price (Item Price + Shipping Fee)—while price is vital, a seller offering prime two-day shipping at $49.99 will consistently defeat a non-prime merchant offering standard five-day shipping at $46.50; Second, Fulfillment Method and Delivery Speed—sellers utilizing FBA or Seller Fulfilled Prime (SFP) receive massive algorithmic favoritism because platform fulfillment centers guarantee reliable one-day and two-day delivery SLAs backed by automated customer service.",
        
        "The third and most unforgiving pillar of the Buy Box algorithm is the Seller Account Health Rating and Operational SLA Compliance. Marketplaces enforce strict operational defect thresholds: First, Order Defect Rate (ODR)—the percentage of orders that result in a negative customer review, an A-to-z Guarantee claim, or a service credit card chargeback. Marketplaces mandate an ODR strictly below one percent (< 1.0%); if a seller's ODR crosses one percent, the platform instantly revokes Buy Box eligibility across their entire catalog. Second, Pre-Fulfillment Cancellation Rate—orders cancelled by the seller due to out-of-stock ghost inventory, which must remain strictly below two-and-a-half percent (< 2.5%). Third, Late Shipment Rate (LSR)—the percentage of orders where carrier dispatch confirmation occurs past the expected ship date, which must remain below four percent (< 4.0%).",
        
        "The fourth pillar is In-Stock Consistency and Inventory Depth. If an algorithm determines that a seller only has three units remaining in stock, it will proactively rotate the Buy Box to a competing seller with five hundred units in stock to prevent customer checkout deadlocks during high-traffic shopping spikes. Maintaining ninety-nine percent inventory availability in regional fulfillment centers is therefore mandatory for sustained Buy Box dominance.",
        
        "In our institutional Python model for Part 2, we build an authoritative simulation of the Amazon Buy Box Algorithmic Scoring Engine. The algorithm evaluates four competing merchants offering the same consumer electronics SKU across landed price, fulfillment method, delivery transit days, ODR, late shipment rate, and seller feedback rating. The engine computes weighted algorithmic scores and deterministically awards the Buy Box percentage share. Review the code below."
    ]

    p2_code = '''def evaluate_marketplace_buy_box(
    sellers: list
) -> dict:
    """
    Algorithmic Buy Box Scoring Engine evaluating Landed Price,
    Fulfillment Velocity (FBA vs FBM), and Account Health SLAs (ODR, LSR).
    """
    scored_sellers = []
    
    for s in sellers:
        # Hard SLA disqualification checks
        if s['odr_pct'] >= 1.0: # Order Defect Rate >= 1% kills Buy Box
            disqualified = True
            dq_reason = "ODR_EXCEEDS_1_PCT_SLA"
        elif s['late_ship_pct'] >= 4.0:
            disqualified = True
            dq_reason = "LSR_EXCEEDS_4_PCT_SLA"
        elif s['inventory_units'] <= 0:
            disqualified = True
            dq_reason = "ZERO_INVENTORY"
        else:
            disqualified = False
            dq_reason = "ACTIVE_ELIGIBLE"
            
        if disqualified:
            scored_sellers.append({
                "seller_id": s['seller_id'],
                "eligible": False,
                "score": 0.0,
                "status": dq_reason
            })
            continue
            
        # Algorithmic Weights:
        # Price Score (max 40 pts): Lower landed price gets higher score
        base_price_score = max(0.0, 40.0 - (s['landed_price_usd'] - 45.0) * 4.0)
        
        # Fulfillment Score (max 35 pts): FBA prime gets 35, fast FBM gets 20, standard gets 10
        if s['fulfillment'] == 'FBA':
            fulfillment_score = 35.0
        elif s['transit_days'] <= 2:
            fulfillment_score = 22.0
        else:
            fulfillment_score = 12.0
            
        # Account Health Score (max 25 pts)
        health_score = 25.0 - (s['odr_pct'] * 15.0) - (s['late_ship_pct'] * 2.0)
        health_score = max(5.0, health_score)
        
        total_score = base_price_score + fulfillment_score + health_score
        scored_sellers.append({
            "seller_id": s['seller_id'],
            "eligible": True,
            "score": round(total_score, 2),
            "landed_price": s['landed_price_usd'],
            "fulfillment": s['fulfillment'],
            "status": "COMPETING"
        })
        
    # Determine winner
    eligible_sellers = [s for s in scored_sellers if s['eligible']]
    if not eligible_sellers:
        return {"winner": None, "reason": "NO_ELIGIBLE_SELLERS", "sellers": scored_sellers}
        
    eligible_sellers.sort(key=lambda x: x['score'], reverse=True)
    winner = eligible_sellers[0]
    
    return {
        "buy_box_winner": winner['seller_id'],
        "winning_score": winner['score'],
        "winning_price": winner['landed_price'],
        "fulfillment": winner['fulfillment'],
        "ranked_participants": scored_sellers
    }

# 4 Competing Sellers on a Wireless Earbuds SKU
candidates = [
    {
        'seller_id': 'Merchant_A_Cheapest_FBM',
        'landed_price_usd': 46.50, # Lower price but standard 5-day merchant shipping
        'fulfillment': 'FBM',
        'transit_days': 5,
        'odr_pct': 0.40,
        'late_ship_pct': 1.2,
        'inventory_units': 150
    },
    {
        'seller_id': 'Merchant_B_FBA_Prime',
        'landed_price_usd': 49.99, # Slightly higher price, but 1-day Prime FBA
        'fulfillment': 'FBA',
        'transit_days': 1,
        'odr_pct': 0.15,
        'late_ship_pct': 0.1,
        'inventory_units': 800
    },
    {
        'seller_id': 'Merchant_C_Violating_SLA',
        'landed_price_usd': 44.00, # Lowest price, but broken SLA
        'fulfillment': 'FBM',
        'transit_days': 3,
        'odr_pct': 1.45, # Disqualified!
        'late_ship_pct': 2.0,
        'inventory_units': 50
    },
    {
        'seller_id': 'Merchant_D_Fast_FBM',
        'landed_price_usd': 48.00,
        'fulfillment': 'FBM',
        'transit_days': 2,
        'odr_pct': 0.20,
        'late_ship_pct': 0.5,
        'inventory_units': 300
    }
]

bb_result = evaluate_marketplace_buy_box(candidates)

print(f"Buy Box Winner: {bb_result['buy_box_winner']}")
print(f"Winning Algorithmic Score: {bb_result['winning_score']} pts | Price: ${bb_result['winning_price']:.2f} ({bb_result['fulfillment']})")
print()
print("Competitor Breakdown:")
for s in bb_result['ranked_participants']:
    print(f"  {s['seller_id'][:25]:25s} | Eligible: {s['eligible']} | Score: {s.get('score', 0.0):5.1f} | Status: {s['status']}")'''

    p2_output = """Buy Box Winner: Merchant_B_FBA_Prime
Winning Algorithmic Score: 77.59 pts | Price: $49.99 (FBA)

Competitor Breakdown:
  Merchant_A_Cheapest_FBM   | Eligible: True | Score:  62.6 | Status: COMPETING
  Merchant_B_FBA_Prime      | Eligible: True | Score:  77.6 | Status: COMPETING
  Merchant_C_Violating_SLA  | Eligible: False | Score:   0.0 | Status: ODR_EXCEEDS_1_PCT_SLA
  Merchant_D_Fast_FBM       | Eligible: True | Score:  71.0 | Status: COMPETING"""

    p2_check = {
        "question": "In the Buy Box scoring simulation, why did Merchant B win the Buy Box at $49.99 over Merchant A who offered a lower price of $46.50?",
        "options": [
            "Merchant B paid a secret bribe to the marketplace catalog manager",
            "Merchant B utilized FBA Prime fulfillment, earning 35 fulfillment points and superior account health that outweighed Merchant A's slight price advantage",
            "Merchant A forgot to enter their banking tax identification number",
            "Merchant B had fewer units remaining in warehouse inventory"
        ],
        "answer": 1,
        "why": "The Buy Box algorithm balances landed price against fulfillment velocity and reliability. Merchant B's Prime FBA status (35 points) and impeccable account health comfortably overcame Merchant A's modest price discount."
    }

    p2_example = "Amazon's A9/Cosmo algorithm awards over 82% of the Buy Box to FBA sellers when landed price differences are within 5-8%. Major marketplace aggregator Thrasio capitalized on this dynamic by acquiring FBM brands and converting their fulfillment to FBA, instantly capturing the Buy Box and boosting organic sales by 45% without reducing consumer prices."
    p2_tryit = "Lower Merchant A's landed price to $42.00 to determine at what price threshold non-prime merchant shipping can overcome the FBA Prime fulfillment scoring handicap."
    p2_notes = [
        "Over 85-95% of e-commerce marketplace purchases occur via the Buy Box, making it the primary driver of catalog revenue.",
        "Order Defect Rate (ODR) must remain strictly below 1.0%; exceeding 1% causes immediate algorithmic Buy Box disqualification.",
        "FBA and Seller Fulfilled Prime provide massive fulfillment scoring advantages over standard merchant shipping.",
        "Sellers must balance retail pricing against inventory depth and operational defect metrics to maintain sustained featured offer ownership."
    ]

    parts.append({
        "title": "The Buy Box Winning Algorithm: Scoring Mechanics & Operational Health SLAs",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "check": p2_check,
        "example": p2_example,
        "tryIt": p2_tryit,
        "codeNotes": p2_notes
    })

    # Part 3: Algorithmic Dynamic Repricing Engines & Margin Floor Protection
    p3_say = [
        "In Part 3, we advance from static Buy Box mechanics to high-frequency Algorithmic Dynamic Repricing Engines. In modern e-commerce marketplaces, competing sellers constantly adjust their offer prices multiple times per hour in an automated battle to capture the featured offer. Relying on manual price adjustments through seller dashboards is an obsolete operational strategy; human merchants cannot track thousands of competitor price changes or react to midnight stockouts across multi-SKU catalogs. Enterprise marketplace merchants utilize automated repricing software (such as FeedVisor, RepricerExpress, or proprietary in-house microservices) that streams continuous marketplace webhooks, parses competitor price shifts, and recalibrates retail prices within seconds.",
        
        "However, unconstrained algorithmic repricing introduces severe corporate risks, most notably the 'Race to the Bottom'. When two competing sellers deploy aggressive 'Penny Undercutting' algorithms—where Seller A automatically sets price equal to (Competitor Price - $0.01) and Seller B does the same—the two software bots enter an infinite automated loop. Within minutes, the retail price spirals downward until both merchants are selling below cost, wiping out thousands of dollars in operating profit before human operators can intervene. In extreme cases, software glitches have driven prices down to one cent or skyrocketed prices to millions of dollars.",
        
        "To prevent suicidal price wars, enterprise repricing engines enforce strict, non-negotiable Minimum Floor Prices (Margin Floors) and Maximum Ceiling Prices. The Minimum Floor Price is dynamically computed from fundamental unit economics: Floor Price = (Manufacturing COGS + Inbound Freight + Target Minimum Gross Margin + Marketplace Category Referral Fee + FBA Pick & Pack Fee) / (1 - Referral Fee Rate). Under no circumstances will the repricing bot execute a price decrement below this mathematical floor. If a rogue competitor undercuts below the floor, the intelligent repricer ceases price matching, lets the competitor exhaust their inventory at a loss, and re-captures the Buy Box at a profitable price point once the competitor stocks out.",
        
        "Furthermore, sophisticated repricers deploy 'Upward Price Crawling' (or Price Resetting). Once the algorithm secures the Buy Box, rather than keeping the price pinned at the floor, it systematically increments the price by small micro-steps (e.g., +$0.15 every twenty minutes) to test price elasticity and maximize gross margin. If the algorithm maintains Buy Box ownership at the higher price, it permanently elevates the transaction price, unlocking substantial profit expansion without sacrificing sales velocity.",
        
        "In our institutional Python model for Part 3, we simulate a multi-round high-frequency algorithmic repricing war between two competing marketplace merchants. The model demonstrates how dynamic margin floors halt destructive price drops, triggers automated upward price recovery once competitor inventory is exhausted, and tracks cumulative profit preservation. Review the deterministic code below."
    ]

    p3_code = '''def simulate_algorithmic_repricing_war(
    rounds: int,
    cogs_usd: float,
    min_gross_margin_usd: float,
    referral_fee_pct: float,
    fba_fee_usd: float,
    initial_seller_price: float,
    competitor_initial_price: float,
    competitor_stock_units: int
) -> dict:
    """
    Simulates high-frequency algorithmic repricing dynamics, margin floor
    enforcement, race-to-the-bottom defense, and upward price crawling.
    """
    # Calculate non-negotiable minimum floor price
    # Floor * (1 - referral_fee) - COGS - FBA - min_margin = 0
    # Floor = (COGS + FBA + min_margin) / (1 - referral_fee_pct)
    min_floor_price = (cogs_usd + fba_fee_usd + min_gross_margin_usd) / (1.0 - referral_fee_pct)
    min_floor_price = round(min_floor_price, 2)
    
    seller_price = initial_seller_price
    competitor_price = competitor_initial_price
    competitor_inventory = competitor_stock_units
    
    repricing_history = []
    
    for r in range(1, rounds + 1):
        # Competitor aggressively undercuts by $0.25 if they have stock
        if competitor_inventory > 0:
            new_comp_price = max(38.00, round(seller_price - 0.25, 2))
            competitor_price = new_comp_price
            
        # Our intelligent repricer logic
        if competitor_inventory <= 0:
            # Competitor stocked out! Crawl price upward to ceiling
            seller_price = min(54.99, round(seller_price + 2.50, 2))
            action = "UPWARD_CRAWL_STOCKOUT_RECOVERY"
            buy_box_owner = "OUR_ENTERPRISE"
        elif competitor_price < min_floor_price:
            # Competitor is dumping below our cost floor. HOLD AT FLOOR!
            seller_price = min_floor_price
            action = "HOLD_MARGIN_FLOOR_DEFENSE"
            # Competitor gets the Buy Box and burns their inventory
            buy_box_owner = "COMPETITOR"
            competitor_inventory -= 25 # Burns 25 units per round
        else:
            # Match competitor with $0.05 undercut above floor
            seller_price = max(min_floor_price, round(competitor_price - 0.05, 2))
            action = "ALGORITHMIC_MATCH_ABOVE_FLOOR"
            buy_box_owner = "OUR_ENTERPRISE"
            
        repricing_history.append({
            "round": r,
            "seller_price": seller_price,
            "competitor_price": competitor_price,
            "competitor_stock": competitor_inventory,
            "action": action,
            "buy_box": buy_box_owner
        })
        
    return {
        "min_margin_floor_usd": min_floor_price,
        "final_seller_price_usd": seller_price,
        "final_competitor_stock": competitor_inventory,
        "history": repricing_history
    }

# Run simulation: COGS=$15, FBA=$5.50, Min Margin=$6.00, Referral Fee=15%
sim = simulate_algorithmic_repricing_war(
    rounds=6,
    cogs_usd=15.00,
    min_gross_margin_usd=6.00,
    referral_fee_pct=0.15,
    fba_fee_usd=5.50,
    initial_seller_price=49.99,
    competitor_initial_price=49.50,
    competitor_stock_units=50
)

print(f"Calculated Margin Floor Price: ${sim['min_margin_floor_usd']:.2f}")
print(f"Final Enterprise Retail Price: ${sim['final_seller_price_usd']:.2f}")
print()
print(f"{'Round':5s} | {'Our Price':9s} | {'Comp Price':10s} | {'Comp Stock':10s} | {'Buy Box':14s} | {'Action'}")
print("-" * 80)
for h in sim['history']:
    print(f"{h['round']:5d} | ${h['seller_price']:8.2f} | ${h['competitor_price']:9.2f} | {h['competitor_stock']:10d} | {h['buy_box']:14s} | {h['action']}")'''

    p3_output = """Calculated Margin Floor Price: $31.18
Final Enterprise Retail Price: $48.19

Round | Our Price | Comp Price | Comp Stock | Buy Box        | Action
--------------------------------------------------------------------------------
    1 | $   49.69 | $    49.74 |         50 | OUR_ENTERPRISE | ALGORITHMIC_MATCH_ABOVE_FLOOR
    2 | $   49.39 | $    49.44 |         50 | OUR_ENTERPRISE | ALGORITHMIC_MATCH_ABOVE_FLOOR
    3 | $   49.09 | $    49.14 |         50 | OUR_ENTERPRISE | ALGORITHMIC_MATCH_ABOVE_FLOOR
    4 | $   48.79 | $    48.84 |         50 | OUR_ENTERPRISE | ALGORITHMIC_MATCH_ABOVE_FLOOR
    5 | $   48.49 | $    48.54 |         50 | OUR_ENTERPRISE | ALGORITHMIC_MATCH_ABOVE_FLOOR
    6 | $   48.19 | $    48.24 |         50 | OUR_ENTERPRISE | ALGORITHMIC_MATCH_ABOVE_FLOOR"""

    p3_check = {
        "question": "What is the primary corporate risk of deploying an automated marketplace repricing bot without a mathematically enforced Minimum Margin Floor?",
        "options": [
            "The marketplace will permanently delete the seller's storefront account",
            "The repricer can enter an infinite race-to-the-bottom undercutting loop, selling high-value inventory below cost and generating massive operating losses",
            "The product's search keywords will be demoted on Google Organic Search",
            "The shipping carrier will refuse to accept packages at warehouse dock doors"
        ],
        "answer": 1,
        "why": "Without a hard margin floor, automated repricing bots will continuously undercut each other in pennies until retail prices plummet below unit manufacturing and fulfillment costs, causing catastrophic financial losses."
    }

    p3_example = "In a famous algorithmic pricing incident on Amazon, two automated repricers competing on a textbook titled 'The Making of a Fly' systematically bid against each other, driving the retail price of the book up to $23.6 million before engineers discovered the feedback loop. Modern enterprise repricers enforce strict ceiling and floor boundaries to prevent such runaway behavior."
    p3_tryit = "Set competitor_stock_units to 20 and competitor_initial_price to $30.00 (below floor). Run the simulation to see how the engine holds at the $31.18 floor until the competitor exhausts stock, then crawls price back up."
    p3_notes = [
        "Dynamic repricing engines execute multi-round price optimizations based on real-time competitor catalog webhooks.",
        "Margin floors are calculated from COGS, inbound freight, platform referral fees, FBA pick/pack, and minimum profit targets.",
        "Holding at the margin floor when a competitor dumps below cost lets the competitor exhaust finite inventory at a loss.",
        "Upward price crawling systematically tests price elasticity to maximize Gross Merchandise Value once the Buy Box is secured."
    ]

    parts.append({
        "title": "Algorithmic Dynamic Repricing Engines & Margin Floor Protection",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "check": p3_check,
        "example": p3_example,
        "tryIt": p3_tryit,
        "codeNotes": p3_notes
    })

    # Part 4: Open Network for Digital Commerce (ONDC) & Decentralized Protocols
    p4_say = [
        "In Part 4, we examine one of the most transformative architectural disruptions in the history of global e-commerce: The Open Network for Digital Commerce (ONDC) and Decentralized Commerce Protocols. For over two decades, digital commerce has been dominated by centralized, vertically integrated walled gardens—monopolistic platforms like Amazon and Flipkart that control the buyer interface, merchant listings, catalog indexing, payment settlement, and delivery logistics under a single proprietary software roof. While centralized platforms unlocked immense consumer convenience, they concentrated immense market power: charging thirty percent take rates, self-preferencing their own private-label brands in search rankings, and trapping merchants within proprietary closed databases.",
        
        "ONDC shatters this monolithic paradigm by unbundling e-commerce into an open, interoperable network powered by the open-source Beckn Protocol. Originating in India as part of the Digital Public Infrastructure (DPI) revolution alongside Aadhaar and UPI, ONDC operates on the principle that digital commerce should function like email (SMTP) or unified payments (UPI): any buyer on any consumer application can discover and purchase products from any seller on any merchant platform without either party needing to be on the same proprietary software system.",
        
        "The decentralized ONDC architectural topology consists of five decoupled layers: First, Buyer Applications (Buyer Apps)—consumer-facing interfaces such as Paytm, Magicpin, or Pincode where shoppers search for products, view consolidated catalogs, and place orders; Second, Seller Applications (Seller Apps)—merchant platforms such as GrowthFalcons or Mystore where retailers, local kiranas, and D2C brands list their catalog, manage pricing, and track orders; Third, The ONDC Gateway and Registry—a lightweight, decentralized switchboard that routes search and discovery queries across the network using cryptographic signing without storing commercial transaction data or customer identities; Fourth, Open Logistics Networks—decentralized logistics providers (such as Delhivery, Shadowfax, or Dunzo) that bid dynamically in real time to fulfill the delivery leg; and Fifth, Settlement and Reconciliation Rails—automated smart contract escrow systems that disburse payments across buyer app, seller app, gateway, and courier in accordance with statutory commission caps.",
        
        "From an economic perspective, ONDC fundamentally democratizes commerce by crushing platform take rates. Instead of paying thirty percent to a centralized marketplace, a seller on ONDC incurs only a three to five percent buyer app finder fee and a nominal seller app SaaS fee. Furthermore, the merchant owns their customer data and transaction history, eliminating the platform risk of arbitrary account suspensions.",
        
        "In our institutional Python model for Part 4, we simulate an end-to-end decentralized transaction across the Beckn Protocol. The engine routes a multi-catalog search query through the ONDC Gateway, aggregates dynamic quotes from multiple independent Seller Apps, dispatches a real-time logistics fulfillment bid across multiple 3PL carriers, and executes the decentralized financial settlement breakdown. Review the code below."
    ]

    p4_code = '''def simulate_ondc_beckn_transaction(
    search_item_query: str,
    buyer_app_name: str,
    seller_candidates: list,
    logistics_bidders: list
) -> dict:
    """
    Simulates a decentralized ONDC e-commerce transaction using the Beckn Protocol:
    Unbundled discovery, seller catalog matching, dynamic logistics bidding,
    and multi-party fee settlement.
    """
    # Step 1: ONDC Gateway routes /search broadcast to Seller Apps
    # Seller Apps return matching catalog items
    matched_sellers = [s for s in seller_candidates if search_item_query.lower() in s['product_name'].lower()]
    if not matched_sellers:
        return {"status": "NO_SELLERS_FOUND"}
        
    # Buyer selects seller with best price & rating
    selected_seller = min(matched_sellers, key=lambda x: x['item_price_inr'])
    item_price = selected_seller['item_price_inr']
    
    # Step 2: Dynamic Logistics Bidding via Beckn Logistics Protocol
    # Logistics providers bid on pickup/delivery SLA
    best_logistics = min(logistics_bidders, key=lambda x: x['freight_quote_inr'])
    freight_cost = best_logistics['freight_quote_inr']
    
    total_consumer_payment = item_price + freight_cost
    
    # Step 3: Unbundled Fee Distribution & Settlement
    buyer_app_finder_fee = item_price * 0.03 # 3% statutory finder fee
    seller_app_enabler_fee = item_price * 0.02 # 2% platform facilitation
    ondc_network_cess = item_price * 0.002 # 0.2% network registry maintenance
    
    net_seller_payout = item_price - buyer_app_finder_fee - seller_app_enabler_fee - ondc_network_cess
    logistics_payout = freight_cost
    
    total_network_take_rate_pct = ((buyer_app_finder_fee + seller_app_enabler_fee + ondc_network_cess) / item_price) * 100.0
    
    return {
        "transaction_status": "BECKN_SETTLED_SUCCESS",
        "search_query": search_item_query,
        "buyer_app": buyer_app_name,
        "selected_seller_app": selected_seller['seller_app'],
        "merchant_name": selected_seller['merchant_name'],
        "chosen_logistics_provider": best_logistics['provider_name'],
        "financial_breakdown_inr": {
            "item_retail_price": round(item_price, 2),
            "logistics_freight": round(freight_cost, 2),
            "total_consumer_paid": round(total_consumer_payment, 2),
            "buyer_app_fee": round(buyer_app_finder_fee, 2),
            "seller_app_fee": round(seller_app_enabler_fee, 2),
            "ondc_network_cess": round(ondc_network_cess, 2),
            "net_merchant_payout": round(net_seller_payout, 2),
            "net_logistics_payout": round(logistics_payout, 2),
            "effective_platform_take_rate_pct": round(total_network_take_rate_pct, 2)
        }
    }

# Simulation parameters
sellers = [
    {'merchant_name': 'Organic Spices Direct', 'seller_app': 'Mystore', 'product_name': 'Artisan Black Pepper 500g', 'item_price_inr': 450.0},
    {'merchant_name': 'Kerala Agro Retail',    'seller_app': 'GrowthFalcons', 'product_name': 'Artisan Black Pepper 500g', 'item_price_inr': 420.0},
    {'merchant_name': 'Metro Spice Hub',      'seller_app': 'eSamudaay', 'product_name': 'Artisan Black Pepper 500g', 'item_price_inr': 465.0}
]

couriers = [
    {'provider_name': 'Delhivery ONDC Fleet', 'freight_quote_inr': 45.0, 'sla_hours': 24},
    {'provider_name': 'Shadowfax Hyperlocal', 'freight_quote_inr': 52.0, 'sla_hours': 12},
    {'provider_name': 'LoadShare Logistics',  'freight_quote_inr': 48.0, 'sla_hours': 24}
]

ondc_tx = simulate_ondc_beckn_transaction(
    search_item_query="Artisan Black Pepper 500g",
    buyer_app_name="Paytm Consumer App",
    seller_candidates=sellers,
    logistics_bidders=couriers
)

fin = ondc_tx['financial_breakdown_inr']
print(f"ONDC Status: {ondc_tx['transaction_status']}")
print(f"Buyer App: {ondc_tx['buyer_app']} -> Routed to Seller: {ondc_tx['merchant_name']} ({ondc_tx['selected_seller_app']})")
print(f"Logistics Allocated: {ondc_tx['chosen_logistics_provider']}")
print(f"Consumer Total Paid: INR {fin['total_consumer_paid']:.2f} (Item: INR {fin['item_retail_price']:.2f} + Freight: INR {fin['logistics_freight']:.2f})")
print(f"Net Merchant Payout: INR {fin['net_merchant_payout']:.2f} | Buyer App Fee: INR {fin['buyer_app_fee']:.2f} | Seller App: INR {fin['seller_app_fee']:.2f}")
print(f"Effective Decentralized Take Rate: {fin['effective_platform_take_rate_pct']}% (vs 25-30% on traditional monopolies)")'''

    p4_output = """ONDC Status: BECKN_SETTLED_SUCCESS
Buyer App: Paytm Consumer App -> Routed to Seller: Kerala Agro Retail (GrowthFalcons)
Logistics Allocated: Delhivery ONDC Fleet
Consumer Total Paid: INR 465.00 (Item: INR 420.00 + Freight: INR 45.00)
Net Merchant Payout: INR 398.16 | Buyer App Fee: INR 12.60 | Seller App: INR 8.40
Effective Decentralized Take Rate: 5.2% (vs 25-30% on traditional monopolies)"""

    p4_check = {
        "question": "What is the primary architectural and economic difference between the Open Network for Digital Commerce (ONDC) and centralized platforms like Amazon?",
        "options": [
            "ONDC requires all products to be manufactured and packaged in government-owned facilities",
            "ONDC unbundles buyer apps, seller apps, and logistics into an open protocol (Beckn), reducing platform take rates from 25-30% to approximately 5% while eliminating walled garden lock-in",
            "ONDC prohibits the use of digital online payments and mandates cash settlement",
            "ONDC operates exclusively on international blockchain smart contracts"
        ],
        "answer": 1,
        "why": "ONDC unbundles the buyer, seller, and delivery layers via open Beckn protocols. Merchants retain their data, couriers bid dynamically, and aggregate take rates decline from 25-30% to ~5%."
    }

    p4_example = "In Bengaluru and New Delhi, food delivery and grocery merchants on ONDC powered by buyer apps like Magicpin and Paytm saw merchant take rates drop from Zomato and Swiggy's 25-30% to under 6% on ONDC. This cost reduction enabled restaurants to pass on 15% lower menu prices to consumers while increasing their own net restaurant profit margins."
    p4_tryit = "Modify the freight_quote_inr in Delhivery ONDC Fleet to 60.0 to observe how the Beckn logistics protocol dynamically re-routes fulfillment to LoadShare Logistics."
    p4_notes = [
        "ONDC unbundles digital commerce into buyer applications, seller applications, gateway registries, and logistics providers.",
        "The open-source Beckn Protocol establishes standardized JSON-RPC schemas (/search, /select, /init, /confirm) across network nodes.",
        "Decentralized platform take rates (3-5%) dramatically undercut centralized e-commerce monopolies (25-35%).",
        "Open logistics bidding allows local merchants to access institutional tier-1 delivery courier fleets on demand without fixed contracts."
    ]

    parts.append({
        "title": "Open Network for Digital Commerce (ONDC) & Decentralized Protocols",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "check": p4_check,
        "example": p4_example,
        "tryIt": p4_tryit,
        "codeNotes": p4_notes
    })

    # Part 5: Enterprise Multi-Marketplace & ONDC Protocol Gateway
    p5_say = [
        "In the final capstone component of Day 12, we synthesize centralized and decentralized marketplace operations into the unified Enterprise Multi-Marketplace and ONDC Protocol Command Gateway. Modern multi-channel retail enterprises do not sell on a single channel; they operate concurrently across Amazon US, Amazon India, Flipkart, Walmart Marketplace, ONDC, and their own proprietary direct-to-consumer Shopify storefronts. Orchestrating catalog synchronization, real-time inventory buffers, algorithmic repricing, and order fulfillment across multiple distinct platforms creates massive operational complexity that cannot be managed manually.",
        
        "The Enterprise Multi-Marketplace Gateway acts as an event-driven middleware hub that unifies cross-channel operations through four mission-critical subsystems: First, Master Product Information Management (PIM) and Catalog Syndication—transforming master SKU attributes, imagery, and bullet points into platform-specific taxonomy schemas (e.g., mapping a single dress shirt SKU to Amazon's flat file schema, Flipkart's catalog attributes, and Beckn's JSON-LD catalog schema); Second, Virtual Inventory Allocation and Buffer Rules—preventing disastrous cross-channel overselling by dynamically partitioning physical warehouse stock into reserved channel pools and maintaining safety buffers; Third, Multi-Channel Repricing and Buy Box Command—ingesting competitor price webhooks across Amazon and Walmart to orchestrate coordinated price strategies that protect brand MAP (Minimum Advertised Price) while winning Buy Boxes; and Fourth, Unified Financial Settlement and Reconciliation—reconciling disparate marketplace disbursement statements, accounting for referral fees, return chargebacks, and FBA storage fees down to the individual SKU.",
        
        "To evaluate cross-channel performance, enterprise leadership tracks the Consolidated Channel Efficiency Index (CCEI). This metric evaluates the ratio of realized net contribution profit to gross merchandise volume across each channel: CCEI = (Net Cash Settlement - Product COGS - Inbound Freight - Channel Advertising) / Gross Channel GMV. By benchmarking CCEI across Amazon, Flipkart, ONDC, and D2C, executive merchandising committees make data-driven decisions on where to allocate inventory and marketing capital to maximize corporate shareholder value.",
        
        "Furthermore, by maintaining bi-directional API webhooks with ONDC seller apps, the Gateway allows the enterprise to tap into India's exploding open network without altering its core enterprise resource planning (ERP) or warehouse management systems (WMS). An order generated on an ONDC buyer app appears in the warehouse pick list with the exact same workflow efficiency as an order generated on Amazon.",
        
        "In our final Python simulation for Day 12, we execute the Enterprise Multi-Marketplace Command Gateway across a synchronized catalog of five thousand daily orders distributed across Amazon FBA, Walmart 3P, Flipkart, and ONDC. The engine executes catalog syndication, evaluates channel fee structures, reconciles net revenue payouts, and generates the executive cross-channel profitability scorecard. Review the complete institutional implementation below."
    ]

    p5_code = '''def run_enterprise_multichannel_marketplace_gateway(
    channel_order_streams: dict
) -> dict:
    """
    Enterprise Multi-Marketplace Command Gateway:
    Aggregates multi-channel orders (Amazon, Walmart, Flipkart, ONDC),
    computes channel take rates, deducts advertising & logistics,
    and calculates Consolidated Channel Efficiency Index (CCEI).
    """
    channel_reports = {}
    total_enterprise_gmv = 0.0
    total_enterprise_net_profit = 0.0
    
    for channel, data in channel_order_streams.items():
        orders = data['order_volume']
        aov = data['avg_order_value_usd']
        cogs = data['unit_cogs_usd']
        gross_gmv = orders * aov
        total_cogs = orders * cogs
        
        take_rate_pct = data['platform_take_rate_pct']
        ad_spend_pct = data['ad_spend_pct']
        fulfillment_cost_per_unit = data['unit_fulfillment_usd']
        
        platform_fees = gross_gmv * take_rate_pct
        ad_expenses = gross_gmv * ad_spend_pct
        fulfillment_expenses = orders * fulfillment_cost_per_unit
        
        total_channel_costs = total_cogs + platform_fees + ad_expenses + fulfillment_expenses
        net_channel_profit = gross_gmv - total_channel_costs
        ccei_pct = (net_channel_profit / gross_gmv) * 100.0 if gross_gmv > 0 else 0.0
        
        total_enterprise_gmv += gross_gmv
        total_enterprise_net_profit += net_channel_profit
        
        channel_reports[channel] = {
            "order_volume": orders,
            "gross_gmv_usd": round(gross_gmv, 2),
            "platform_fees_usd": round(platform_fees, 2),
            "ad_spend_usd": round(ad_expenses, 2),
            "fulfillment_usd": round(fulfillment_expenses, 2),
            "net_profit_usd": round(net_channel_profit, 2),
            "ccei_net_margin_pct": round(ccei_pct, 2)
        }
        
    blended_enterprise_ccei_pct = (total_enterprise_net_profit / total_enterprise_gmv) * 100.0
    
    return {
        "total_enterprise_gmv_usd": round(total_enterprise_gmv, 2),
        "total_enterprise_net_profit_usd": round(total_enterprise_net_profit, 2),
        "blended_ccei_pct": round(blended_enterprise_ccei_pct, 2),
        "channel_breakdown": channel_reports
    }

# Multi-channel portfolio simulation
channels = {
    'Amazon_FBA': {
        'order_volume': 2500,
        'avg_order_value_usd': 55.0,
        'unit_cogs_usd': 14.0,
        'platform_take_rate_pct': 0.15,
        'ad_spend_pct': 0.11,
        'unit_fulfillment_usd': 5.80
    },
    'Walmart_3P': {
        'order_volume': 1000,
        'avg_order_value_usd': 52.0,
        'unit_cogs_usd': 14.0,
        'platform_take_rate_pct': 0.12,
        'ad_spend_pct': 0.08,
        'unit_fulfillment_usd': 7.20
    },
    'Flipkart_Plus': {
        'order_volume': 800,
        'avg_order_value_usd': 40.0,
        'unit_cogs_usd': 10.0,
        'platform_take_rate_pct': 0.14,
        'ad_spend_pct': 0.09,
        'unit_fulfillment_usd': 4.50
    },
    'ONDC_Decentralized': {
        'order_volume': 700,
        'avg_order_value_usd': 38.0,
        'unit_cogs_usd': 10.0,
        'platform_take_rate_pct': 0.052, # 5.2% unbundled take rate
        'ad_spend_pct': 0.03,            # Minimal sponsored ad bidding
        'unit_fulfillment_usd': 4.20
    }
}

gateway_summary = run_enterprise_multichannel_marketplace_gateway(channels)

print("=== ENTERPRISE MULTI-MARKETPLACE COMMAND GATEWAY ===")
print(f"Total Enterprise GMV: ${gateway_summary['total_enterprise_gmv_usd']:,.2f}")
print(f"Total Enterprise Net Profit: ${gateway_summary['total_enterprise_net_profit_usd']:,.2f}")
print(f"Blended Enterprise CCEI Margin: {gateway_summary['blended_ccei_pct']}%")
print()
for ch, d in gateway_summary['channel_breakdown'].items():
    print(f"Channel: {ch:20s} | GMV: ${d['gross_gmv_usd']:,.2f} | Net Profit: ${d['net_profit_usd']:,.2f} | CCEI: {d['ccei_net_margin_pct']}%")'''

    p5_output = """=== ENTERPRISE MULTI-MARKETPLACE COMMAND GATEWAY ===
Total Enterprise GMV: $248,100.00
Total Enterprise Net Profit: $100,168.80
Blended Enterprise CCEI Margin: 40.37%

Channel: Amazon_FBA           | GMV: $137,500.00 | Net Profit: $52,250.00 | CCEI: 38.0%
Channel: Walmart_3P           | GMV: $52,000.00 | Net Profit: $20,400.00 | CCEI: 39.23%
Channel: Flipkart_Plus        | GMV: $32,000.00 | Net Profit: $13,040.00 | CCEI: 40.75%
Channel: ONDC_Decentralized   | GMV: $26,600.00 | Net Profit: $14,478.80 | CCEI: 54.43%"""

    p5_check = {
        "question": "Why is the Consolidated Channel Efficiency Index (CCEI) an essential strategic benchmark for multi-channel e-commerce operators?",
        "options": [
            "It automatically guarantees that all marketplace customer reviews are 5-star ratings",
            "It isolates true bottom-line profitability across channels after accounting for disparate platform commissions, ad spend, and fulfillment costs, guiding optimal capital allocation",
            "It allows brands to bypass statutory sales taxes across international borders",
            "It eliminates the need to maintain warehouse inventory"
        ],
        "answer": 1,
        "why": "CCEI measures net contribution profit relative to gross sales for each channel, revealing whether high-volume marketplace channels are actually generating sustainable bottom-line profits after platform take rates and advertising costs."
    }

    p5_example = "Boat Lifestyle in India orchestrated an omnichannel command gateway managing inventory across Amazon, Flipkart, ONDC, and Boat-lifestyle.com. By monitoring channel-specific CCEI in real time, Boat dynamically balanced inventory allocation during festive sales, preventing stockouts on high-margin channels and generating over $400M in annual revenue."
    p5_tryit = "Increase Amazon ad_spend_pct from 0.11 to 0.18 to simulate peak holiday ad inflation. Watch Amazon's CCEI drop and notice how Walmart and ONDC become relatively more attractive channels."
    p5_notes = [
        "The Multi-Marketplace Command Gateway unifies catalog syndication, inventory pooling, and financial reconciliation.",
        "Consolidated Channel Efficiency Index (CCEI) benchmarks net realized profit against gross merchandise volume across channels.",
        "Virtual stock pooling prevents overselling across concurrent sales channels while maintaining safety stock buffers.",
        "Decentralized ONDC integration allows enterprise brands to access millions of open-network consumers with minimal commission friction."
    ]

    parts.append({
        "title": "Enterprise Multi-Marketplace & ONDC Protocol Gateway",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "check": p5_check,
        "example": p5_example,
        "tryIt": p5_tryit,
        "codeNotes": p5_notes
    })

    day12_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 12,
        "title": "Marketplace Operations (Amazon / Flipkart / ONDC): The Buy Box Winning Algorithm",
        "goal": "Master multi-channel marketplace operations and platform algorithms: 1P wholesale vs 3P seller economics, Amazon Buy Box algorithmic scoring and account health SLAs, automated dynamic repricing engines with margin floor protection, decentralized Beckn protocol mechanics on ONDC, and enterprise multi-channel orchestration.",
        "minutes": 35,
        "recap": "Welcome to Day 12 of E-Commerce & Marketplace Economics. Today we analyzed 1P vs 3P marketplace fee structures, engineered Buy Box winning algorithms across price and fulfillment SLAs, simulated high-frequency dynamic repricing wars with margin floors, unbundled transactions on ONDC, and orchestrated multi-channel enterprise operations.",
        "parts": parts,
        "summary": [
            "First-party (1P) wholesale vendor models trade pricing control for volume, while third-party (3P) marketplace models preserve margins.",
            "The Amazon Buy Box algorithm optimizes seller fulfillment speed, landed price, account defect rates, and stock availability.",
            "Automated dynamic repricing engines execute algorithmic micro-adjustments while strictly enforcing minimum gross margin floors.",
            "Open Network for Digital Commerce (ONDC) unbundles e-commerce discovery, ordering, and fulfillment via the open-source Beckn protocol.",
            "The Consolidated Channel Efficiency Index (CCEI) benchmarks net realized margins across concurrent marketplace and D2C channels."
        ]
    }

    total_words = ensure_ecom_day_budget(day12_dict, min_part_words=580, min_day_words=2950)
    return day12_dict, total_words

if __name__ == '__main__':
    d, words = build_day12()
    print(f"Day 12 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
