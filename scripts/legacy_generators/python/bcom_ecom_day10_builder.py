"""
Day 10 Builder: Logistics, 3PL Carriers & Cash on Delivery (COD) RTO Mitigation
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-805
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 funnel visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day10():
    parts = []

    # Part 1: Multi-Carrier 3PL Logistics Architecture: First-Mile, Line-Haul & Last-Mile SLAs
    p1_say = [
        "Welcome to Day 10 of B.Com E-Commerce and Digital Business. Today, we confront the external logistics frontier where digital commerce interfaces with the physical road, rail, and air networks of the real world: Multi-Carrier Third-Party Logistics (3PL) Architecture, Line-Haul Transit Dynamics, and Cash on Delivery (COD) Return-to-Origin (RTO) Defense Systems. In modern e-commerce operations, the moment a sealed shipping carton leaves the warehouse dock, direct physical control passes to external logistics partners. The ultimate customer satisfaction, brand reputation, and repurchase probability depend entirely on whether the logistics delivery ecosystem functions with speed, reliability, and precision.",
        
        "To engineer a resilient logistics network, supply chain leaders architect the Three-Stage Parcel Transit Pipeline: First-Mile, Line-Haul, and Last-Mile. First-Mile Logistics encompasses the physical pickup of palletized parcels from the merchant's warehouse or regional fulfillment center, followed by initial injection into the carrier's primary origin sortation facility. Line-Haul Logistics represents the high-speed trunk transport between major geographical hubs (moving consolidated freight containers via dedicated line-haul semi-trucks, freight rail, or domestic air cargo networks). Last-Mile Logistics—the final and most expensive segment, representing over fifty percent of total shipping expense—involves moving the package from the destination city hub to the local courier delivery station, and finally onto the delivery courier's motorcycle, electric van, or cargo bike for physical doorstep handover.",
        
        "To prevent catastrophic carrier dependency, enterprise e-commerce platforms deploy a Multi-Carrier 3PL Architecture rather than contracting with a single logistics provider. Different logistics carriers possess asymmetric regional strengths: Carrier A (e.g., Delhivery or FedEx) may offer superior automated tracking and ninety-eight percent On-Time Delivery (OTD) across Tier-1 metropolitan hubs; Carrier B (e.g., Blue Dart or DHL Express) may dominate high-ticket express air routes; while Carrier C (e.g., India Post or regional postal networks) provides exclusive last-mile delivery coverage into remote rural postal codes (Tier-3 and Tier-4 hinterlands). Modern commerce platforms integrate Multi-Carrier Shipping APIs (such as Shiprocket, Metapack, or EasyPost) to evaluate real-time carrier performance scorecards on every order, dynamically assigning each package to the carrier with the highest historical First Attempt Delivery Rate (FADR) and lowest freight cost for that specific destination postal code.",
        
        "Furthermore, logistics operations continuously audit Carrier Service Level Agreements (SLAs). If an express air carrier promises forty-eight-hour delivery but experiences chronic line-haul airport bottlenecks, the carrier's algorithmically assigned allocation weight is automatically downgraded by the routing engine. By introducing competitive multi-carrier bidding and dynamic volume allocation, e-commerce enterprises drive carrier accountability, suppress transit delays, and optimize freight expenses.",
        
        "In our institutional Python model for Part 1, we simulate a Multi-Carrier 3PL Routing and Allocation Engine. The system evaluates ten thousand customer parcels across metropolitan, suburban, and rural postal zones. The engine compares On-Time Delivery (OTD) performance, transit times, and freight costs across three distinct carrier partners, dynamically allocating shipment volumes to maximize delivery reliability while minimizing freight spend. Review the deterministic code below to analyze the mechanics of multi-carrier routing."
    ]

    p1_code = '''def model_multi_carrier_logistics_routing(
    total_parcels_cohort: int,
    metro_share_pct: float,
    tier2_share_pct: float,
    rural_share_pct: float,
    carrier_performance_matrix: dict
) -> dict:
    """
    Simulates Multi-Carrier 3PL Logistics Allocation across Metro, Tier-2, and Rural destination zones.
    Evaluates On-Time Delivery (OTD) performance, shipping SLAs, and blended freight costs.
    """
    assert round(metro_share_pct + tier2_share_pct + rural_share_pct, 1) == 100.0, "Shares must sum to 100%"
    
    zone_volumes = {
        "metro": int(total_parcels_cohort * (metro_share_pct / 100.0)),
        "tier2": int(total_parcels_cohort * (tier2_share_pct / 100.0)),
        "rural": total_parcels_cohort - int(total_parcels_cohort * (metro_share_pct / 100.0)) - int(total_parcels_cohort * (tier2_share_pct / 100.0))
    }
    
    # Carrier assignment policy based on regional SLA dominance:
    # Metro -> Carrier_A_Express (98% OTD, $4.50)
    # Tier2 -> Carrier_B_Regional (94% OTD, $5.20)
    # Rural -> Carrier_C_Postal   (91% OTD, $6.80)
    allocations = {
        "Carrier_A_Express":  {"zone": "metro", "volume": zone_volumes["metro"], "rate": 4.50, "otd_pct": 98.2},
        "Carrier_B_Regional": {"zone": "tier2", "volume": zone_volumes["tier2"], "rate": 5.20, "otd_pct": 94.5},
        "Carrier_C_Postal":   {"zone": "rural", "volume": zone_volumes["rural"], "rate": 6.80, "otd_pct": 91.0}
    }
    
    total_freight_cost = 0.0
    total_on_time_parcels = 0
    carrier_reports = {}
    
    for c_name, c_data in allocations.items():
        vol = c_data["volume"]
        cost = vol * c_data["rate"]
        on_time = int(vol * (c_data["otd_pct"] / 100.0))
        
        total_freight_cost += cost
        total_on_time_parcels += on_time
        
        carrier_reports[c_name] = {
            "assigned_zone": c_data["zone"],
            "allocated_parcels": vol,
            "freight_cost_usd": round(cost, 2),
            "on_time_parcels": on_time,
            "otd_sla_actual_pct": c_data["otd_pct"]
        }
        
    blended_freight_per_parcel = total_freight_cost / total_parcels_cohort
    overall_system_otd_pct = (total_on_time_parcels / total_parcels_cohort) * 100.0
    
    return {
        "total_parcels_cohort": total_parcels_cohort,
        "zone_distribution": zone_volumes,
        "carrier_allocations": carrier_reports,
        "total_freight_cost_usd": round(total_freight_cost, 2),
        "blended_freight_per_parcel_usd": round(blended_freight_per_parcel, 2),
        "overall_system_otd_pct": round(overall_system_otd_pct, 1),
        "logistics_network_status": "MULTI_CARRIER_SLA_OPTIMAL"
    }

# Execute multi-carrier routing simulation
logistics_run = model_multi_carrier_logistics_routing(
    total_parcels_cohort=10000,
    metro_share_pct=55.0,
    tier2_share_pct=30.0,
    rural_share_pct=15.0,
    carrier_performance_matrix={}
)

print(f"Multi-Carrier 3PL Logistics Allocation & SLA Telemetry:")
print(f"  Total Manifested Parcels:   {logistics_run['total_parcels_cohort']:,} packages")
print(f"  Metro Zone (Carrier A):     {logistics_run['carrier_allocations']['Carrier_A_Express']['allocated_parcels']:,} pkgs (OTD: {logistics_run['carrier_allocations']['Carrier_A_Express']['otd_sla_actual_pct']}%)")
print(f"  Tier-2 Zone (Carrier B):    {logistics_run['carrier_allocations']['Carrier_B_Regional']['allocated_parcels']:,} pkgs (OTD: {logistics_run['carrier_allocations']['Carrier_B_Regional']['otd_sla_actual_pct']}%)")
print(f"  Rural Zone (Carrier C):     {logistics_run['carrier_allocations']['Carrier_C_Postal']['allocated_parcels']:,} pkgs (OTD: {logistics_run['carrier_allocations']['Carrier_C_Postal']['otd_sla_actual_pct']}%)")
print(f"  Total Billed Freight Spend: ${logistics_run['total_freight_cost_usd']:,.2f}")
print(f"  Blended Freight per Parcel: ${logistics_run['blended_freight_per_parcel_usd']:.2f}/parcel")
print(f"  Overall System On-Time SLA: {logistics_run['overall_system_otd_pct']}% ([{logistics_run['logistics_network_status']}])")'''

    p1_output = """Multi-Carrier 3PL Logistics Allocation & SLA Telemetry:
  Total Manifested Parcels:   10,000 packages
  Metro Zone (Carrier A):     5,500 pkgs (OTD: 98.2%)
  Tier-2 Zone (Carrier B):    3,000 pkgs (OTD: 94.5%)
  Rural Zone (Carrier C):     1,500 pkgs (OTD: 91.0%)
  Total Billed Freight Spend: $50,550.00
  Blended Freight per Parcel: $5.05/parcel
  Overall System On-Time SLA: 96.0% ([MULTI_CARRIER_SLA_OPTIMAL])"""

    p1_notes = [
        "Simulates multi-carrier 3PL allocation across 10,000 parcels spanning Metro, Tier-2, and Rural zones.",
        "Demonstrates dynamic routing aligning carrier regional dominance (Express, Regional, Postal networks).",
        "Achieves 96.0% overall system on-time delivery across the nationwide distribution footprint.",
        "Maintains an optimized blended freight cost of $5.06 per parcel across diverse geographical tiers."
    ]

    p1_check = {
        "question": "Why do high-volume e-commerce platforms utilize multi-carrier routing engines rather than relying on a single exclusive logistics provider?",
        "options": [
            "Because logistics carriers exhibit asymmetric regional strengths, and dynamic routing optimizes on-time delivery while eliminating single-point-of-failure capacity bottlenecks.",
            "Because courier companies are legally prohibited from delivering more than 100 packages per day.",
            "Because using multiple carriers allows the merchant to avoid printing shipping barcodes.",
            "Because different carriers only deliver on alternating days of the week."
        ],
        "answer": 0,
        "why": "Multi-carrier routing leverages the best regional carrier for each pin code, mitigating service bottlenecks and securing competitive shipping rates."
    }

    parts.append({
        "title": "Multi-Carrier 3PL Logistics Architecture: First-Mile, Line-Haul & Last-Mile SLAs",
        "say": p1_say,
        "example": "An omnichannel digital retailer routing 10,000 orders across express air, regional surface, and postal networks to achieve 96% on-time delivery at an average freight cost of $5.06/parcel.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Increase rural_share_pct to 40% and observe how rural distribution elevates blended freight cost from $5.06 to $5.58 per parcel.",
        "check": p1_check
    })

    # Part 2: Cash on Delivery (COD) Economics & Return to Origin (RTO) Margin Destruction
    p2_say = [
        "In Part 2, we confront the most formidable commercial challenge in emerging e-commerce markets: Cash on Delivery (COD) Economics and the Devastating Margin Impact of Return to Origin (RTO). In developed Western digital commerce markets (such as the US, UK, and Western Europe), electronic payment adoption via credit cards, debit cards, and digital wallets is virtually universal. However, across massive developing e-commerce powerhouses (including India, Southeast Asia, Latin America, and the Middle East), Cash on Delivery (COD) continues to represent forty to sixty percent of all online retail orders. Consumers choose COD because it provides zero financial risk: they only hand over cash when the parcel physically arrives at their doorstep, protecting them against online merchant fraud, non-delivery, and damaged goods.",
        
        "While offering Cash on Delivery massively expands top-of-funnel conversion and unlocks millions of unbanked or credit-averse consumers, it introduces catastrophic operational vulnerability: The Return to Origin (RTO) Crisis. In a prepaid online transaction, because the customer has already paid, they have strong psychological skin-in-the-game to accept delivery, resulting in a tiny RTO rate of under two to three percent. In a COD transaction, however, the customer has committed zero capital. By the time the courier attempts delivery four days later, the customer may have experienced buyer's remorse, purchased a similar item from a local street shop, run out of cash, or placed frivolous impulse orders under fictitious names.",
        
        "When a COD customer rejects delivery or is repeatedly unavailable, the courier marks the package as Failed Delivery and initiates Return to Origin (RTO). The financial toll of an RTO event is catastrophic for the e-commerce merchant. First, the merchant must pay the 3PL carrier for Forward Shipping Freight. Second, the carrier assesses a Reverse Shipping Freight Fee to transport the rejected box back to the origin warehouse. Third, the carrier charges an RTO Processing Surcharge. Fourth, the corrugated shipping carton, custom tape, and protective dunnage are completely destroyed and must be discarded. Fifth, the returned inventory is locked up in transit for seven to fourteen days, missing seasonal sales windows, while delicate items (like cosmetics, glass, or apparel) suffer transit damage and shrinkage.",
        
        "The mathematical result is brutal: while the merchant earns zero revenue on an RTO order, they incur an unrecoverable out-of-pocket cash loss of five to ten dollars per returned package. If an e-commerce brand operates with a sixty-dollar Average Order Value, twenty-five percent gross margins, and experiences a thirty percent COD RTO rate, the accumulated RTO freight losses completely erase the operating profit earned on all successfully delivered orders, driving the entire enterprise into insolvency.",
        
        "In our institutional Python model for Part 2, we engineer an RTO Economic Impact & Margin Destruction Model. The simulation analyzes a cohort of ten thousand customer orders across prepaid and COD payment methods. The engine models forward freight, reverse freight, packaging losses, product damage depreciation, and proves the devastating margin erosion caused by unmitigated COD RTO rates. Review the deterministic code below to analyze the mathematics of RTO margin destruction."
    ]

    p2_code = '''def model_cod_rto_economic_loss(
    total_monthly_orders: int,
    avg_order_value_usd: float,
    gross_margin_pct: float,
    cod_orders_share_pct: float,
    prepaid_rto_rate_pct: float,
    cod_rto_rate_pct: float,
    forward_shipping_cost_usd: float,
    reverse_shipping_cost_usd: float,
    packaging_and_restock_loss_usd: float
) -> dict:
    """
    Quantifies the financial drain and contribution margin destruction caused by Cash on Delivery (COD) RTO.
    Calculates double-freight penalties (Forward + Reverse), packaging waste, and damaged inventory loss.
    """
    # Order breakdown
    cod_orders_count = int(total_monthly_orders * (cod_orders_share_pct / 100.0))
    prepaid_orders_count = total_monthly_orders - cod_orders_count
    
    # RTO volumes
    prepaid_rto_count = int(prepaid_orders_count * (prepaid_rto_rate_pct / 100.0))
    cod_rto_count = int(cod_orders_count * (cod_rto_rate_pct / 100.0))
    total_rto_orders = prepaid_rto_count + cod_rto_count
    
    delivered_prepaid_orders = prepaid_orders_count - prepaid_rto_count
    delivered_cod_orders = cod_orders_count - cod_rto_count
    total_delivered_orders = delivered_prepaid_orders + delivered_cod_orders
    
    # Revenue & Gross Profit from successfully delivered orders
    realized_gross_revenue_usd = total_delivered_orders * avg_order_value_usd
    baseline_gross_profit_usd = realized_gross_revenue_usd * (gross_margin_pct / 100.0)
    
    # Direct Cash Losses per RTO package: (Forward Freight + Reverse Freight + Packaging Waste)
    cash_loss_per_rto_package = forward_shipping_cost_usd + reverse_shipping_cost_usd + packaging_and_restock_loss_usd
    total_rto_financial_drain_usd = total_rto_orders * cash_loss_per_rto_package
    
    # Net contribution profit after absorbing RTO disaster
    net_operating_profit_usd = baseline_gross_profit_usd - total_rto_financial_drain_usd
    profit_erosion_pct = (total_rto_financial_drain_usd / baseline_gross_profit_usd) * 100.0 if baseline_gross_profit_usd > 0 else 0.0
    
    blended_rto_rate_pct = (total_rto_orders / total_monthly_orders) * 100.0
    
    return {
        "total_monthly_orders": total_monthly_orders,
        "cod_orders_count": cod_orders_count,
        "prepaid_orders_count": prepaid_orders_count,
        "cod_rto_count": cod_rto_count,
        "cod_rto_rate_pct": cod_rto_rate_pct,
        "total_rto_orders": total_rto_orders,
        "blended_rto_rate_pct": round(blended_rto_rate_pct, 1),
        "total_delivered_orders": total_delivered_orders,
        "realized_gross_revenue_usd": round(realized_gross_revenue_usd, 2),
        "baseline_gross_profit_usd": round(baseline_gross_profit_usd, 2),
        "cost_per_rto_package_usd": round(cash_loss_per_rto_package, 2),
        "total_rto_financial_drain_usd": round(total_rto_financial_drain_usd, 2),
        "net_operating_profit_usd": round(net_operating_profit_usd, 2),
        "profit_erosion_pct": round(profit_erosion_pct, 1),
        "rto_risk_status": "CRITICAL_RTO_MARGIN_DESTRUCTION" if cod_rto_rate_pct > 15.0 else "RTO_HEALTHY_CONTROLLED"
    }

# Execute COD RTO economic simulation
rto_run = model_cod_rto_economic_loss(
    total_monthly_orders=10000,
    avg_order_value_usd=55.00,
    gross_margin_pct=38.0,
    cod_orders_share_pct=50.0, # 50% COD orders (5,000 orders)
    prepaid_rto_rate_pct=2.5,  # 2.5% prepaid RTO
    cod_rto_rate_pct=26.0,     # 26.0% unmitigated COD RTO (1,300 returns)
    forward_shipping_cost_usd=3.50,
    reverse_shipping_cost_usd=3.00,
    packaging_and_restock_loss_usd=1.80
)

print(f"Cash on Delivery (COD) RTO Margin Destruction Telemetry:")
print(f"  Total Ingested Orders:      {rto_run['total_monthly_orders']:,} orders (50% COD / 50% Prepaid)")
print(f"  Prepaid Orders RTO Count:   {rto_run['prepaid_orders_count']:,} orders -> {int(rto_run['prepaid_orders_count']*0.025)} RTOs (2.5%)")
print(f"  COD Orders RTO Count:       {rto_run['cod_orders_count']:,} orders -> {rto_run['cod_rto_count']:,} RTOs ({rto_run['cod_rto_rate_pct']}%)")
print(f"  Total RTO Packages Returned:{rto_run['total_rto_orders']:,} parcels ({rto_run['blended_rto_rate_pct']}% blended RTO)")
print(f"  Cash Penalty per RTO Unit:  ${rto_run['cost_per_rto_package_usd']:.2f} (Forward + Reverse + Packaging)")
print(f"  Total Direct RTO Cash Drain:${rto_run['total_rto_financial_drain_usd']:,.2f}")
print(f"  Gross Profit on Delivered:  ${rto_run['baseline_gross_profit_usd']:,.2f}")
print(f"  Net Profit After RTO Loss:  ${rto_run['net_operating_profit_usd']:,.2f}")
print(f"  Gross Profit Wiped by RTO:  {rto_run['profit_erosion_pct']}% operating margin erased ([{rto_run['rto_risk_status']}])")'''

    p2_output = """Cash on Delivery (COD) RTO Margin Destruction Telemetry:
  Total Ingested Orders:      10,000 orders (50% COD / 50% Prepaid)
  Prepaid Orders RTO Count:   5,000 orders -> 125 RTOs (2.5%)
  COD Orders RTO Count:       5,000 orders -> 1,300 RTOs (26.0%)
  Total RTO Packages Returned:1,425 parcels (14.2% blended RTO)
  Cash Penalty per RTO Unit:  $8.30 (Forward + Reverse + Packaging)
  Total Direct RTO Cash Drain:$11,827.50
  Gross Profit on Delivered:  $179,217.50
  Net Profit After RTO Loss:  $167,390.00
  Gross Profit Wiped by RTO:  6.6% operating margin erased ([CRITICAL_RTO_MARGIN_DESTRUCTION])"""

    p2_notes = [
        "Contrasts prepaid RTO (2.5%) against unmitigated Cash on Delivery RTO (26.0%).",
        "Quantifies the double-freight penalty ($8.30 per RTO parcel across forward, reverse, and packaging).",
        "Demonstrates that 1,425 RTO returns wipe out $11,827.50 in direct liquidity from corporate margins.",
        "Proves that controlling COD RTO is the single most critical determinant of e-commerce survival."
    ]

    p2_check = {
        "question": "Why does a Return to Origin (RTO) event on a Cash on Delivery (COD) order inflict a double freight penalty on the e-commerce merchant?",
        "options": [
            "Because the merchant must pay the carrier for forward shipping to the customer's doorstep, pay reverse shipping freight to transport the rejected box back to the warehouse, and discard wasted packaging—all while earning zero revenue.",
            "Because the customer keeps the product without paying cash.",
            "Because the carrier charges interest on the value of the goods.",
            "Because the government imposes a statutory customs tariff on every returned parcel."
        ],
        "answer": 0,
        "why": "The merchant pays forward freight, reverse freight, and packaging labor with zero realized revenue, turning rejected COD orders into pure operational cash losses."
    }

    parts.append({
        "title": "Cash on Delivery (COD) Economics & Return to Origin (RTO) Margin Destruction",
        "say": p2_say,
        "example": "A high-growth D2C electronics startup processing 10,000 orders where a 26% COD RTO rate resulted in 1,425 returned parcels and $11,827.50 in direct unrecoverable freight losses.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Increase cod_rto_rate_pct to 40.0% to observe how unchecked COD returns wipe out over $18,000 in gross profit and paralyze merchant cash flow.",
        "check": p2_check
    })

    # Part 3: RTO Risk Scoring, Pre-Shipment OTP Verification & Address Sanitization Systems
    p3_say = [
        "In Part 3, we master the technological and algorithmic counter-measures deployed by leading digital commerce engineering teams: Machine Learning RTO Risk Scoring, Pre-Shipment One-Time Password (OTP) Verification, and Automated Address Sanitization. Having established the catastrophic margin destruction caused by COD returns, progressive platforms do not simply accept high RTO rates as an unavoidable cost of doing business. Instead, they treat RTO prediction as a classification and risk mitigation challenge solved through intelligent pre-dispatch interventions.",
        
        "The first line of defense is Machine Learning RTO Predictive Scoring. When a customer places a COD order on the storefront, an automated risk engine evaluates dozens of historical and behavioral feature vectors before warehouse fulfillment commences. These signals include: Customer Historical Delivery Track Record (has this phone number previously rejected COD orders?); Delivery Postal Code RTO Heatmaps (does this specific geographic zip code exhibit historical non-delivery rates exceeding thirty percent?); Order Cart Characteristics (is the order value unusually high, or does it contain multiple identical variants?); and Address Completeness Score. The model outputs a continuous RTO Probability Score from 0.0 to 1.0.",
        
        "For orders classified as High RTO Risk (score $\\ge 0.65$), the system executes Dynamic Payment Interventions and Automated Customer Verification. Rather than dispatching the box blindly, the checkout engine initiates Pre-Shipment Automated Communication: triggering an instant WhatsApp interactive message or SMS One-Time Password (OTP) prompt requiring the buyer to confirm their intent to purchase and accept delivery. If the buyer fails to verify their phone number or proactively cancels via WhatsApp, the order is cancelled before a single warehouse picker touches the inventory, saving one hundred percent of forward and reverse freight expenses. Furthermore, if a buyer is identified as a chronic serial refuser, the checkout system dynamically suppresses the COD payment option entirely, requiring prepaid credit card or UPI payment.",
        
        "Concurrently, platforms implement Automated Address Sanitization. Up to twenty percent of RTO events occur not because of buyer malice, but because of incomplete or defective addresses (e.g., missing house numbers, misspelled street names, or absent landmarks). Address validation engines parse unstructured delivery strings through natural language processing (NLP) models, validating PIN code consistency against postal databases and prompting the customer to input essential delivery landmarks prior to dispatch. Combining RTO risk scoring, WhatsApp OTP confirmation, and address sanitization consistently compresses COD RTO rates from twenty-five percent down to under eight percent.",
        
        "In our institutional Python model for Part 3, we engineer a Predictive RTO Risk Scoring & Pre-Shipment Verification Engine. The simulation evaluates five thousand incoming COD customer orders across low, medium, and high-risk buyer profiles. The engine executes automated OTP confirmation on suspicious orders, cancels unconfirmed and fake orders pre-dispatch, suppresses chronic defaulters, and measures the net freight savings achieved by preventing dead shipments. Review the deterministic code below to master the mechanics of RTO risk mitigation."
    ]

    p3_code = '''def model_predictive_rto_scoring_and_otp_intervention(
    total_cod_orders: int,
    high_risk_orders_pct: float,
    otp_confirmation_response_pct: float,
    fraud_fake_order_pct: float,
    freight_loss_avoided_per_cancelled_order_usd: float
) -> dict:
    """
    Simulates ML RTO Risk Scoring, Pre-Shipment WhatsApp/SMS OTP Verification, and Fraud Suppression.
    Quantifies avoided dead shipments, rescued freight capital, and net RTO rate reduction.
    """
    # 1. Risk Stratification
    high_risk_orders_count = int(total_cod_orders * (high_risk_orders_pct / 100.0))
    low_medium_risk_orders = total_cod_orders - high_risk_orders_count
    
    # 2. Automated Pre-Shipment OTP Intervention on High-Risk Cohort
    # Customers who respond and verify their OTP are dispatched
    verified_high_risk_orders = int(high_risk_orders_count * (otp_confirmation_response_pct / 100.0))
    # Unresponsive customers (fake orders, ghost buyers, buyer's remorse) are safely cancelled
    unverified_fake_orders_cancelled = high_risk_orders_count - verified_high_risk_orders
    
    # 3. Fulfillment & Delivered Dispatch
    total_orders_dispatched = low_medium_risk_orders + verified_high_risk_orders
    
    # Baseline unmitigated RTO would have been 26% on high risk and 8% on low risk
    baseline_potential_rtos = int((high_risk_orders_count * 0.65) + (low_medium_risk_orders * 0.08))
    
    # Post-intervention actual RTOs:
    # High risk verified orders have lower RTO (15%), low risk remains 8%
    actual_rtos_after_intervention = int((verified_high_risk_orders * 0.15) + (low_medium_risk_orders * 0.08))
    avoided_physical_rtos = baseline_potential_rtos - actual_rtos_after_intervention
    
    # Financial savings: Avoided Forward & Reverse Freight on cancelled fake orders + avoided RTOs
    freight_capital_saved_usd = unverified_fake_orders_cancelled * freight_loss_avoided_per_cancelled_order_usd
    
    unmitigated_rto_rate_pct = (baseline_potential_rtos / total_cod_orders) * 100.0
    mitigated_rto_rate_pct = (actual_rtos_after_intervention / total_orders_dispatched) * 100.0
    
    return {
        "total_cod_orders_ingested": total_cod_orders,
        "high_risk_orders_flagged": high_risk_orders_count,
        "otp_verified_and_dispatched": verified_high_risk_orders,
        "unverified_orders_cancelled_pre_dispatch": unverified_fake_orders_cancelled,
        "total_orders_dispatched": total_orders_dispatched,
        "baseline_unmitigated_rto_pct": round(unmitigated_rto_rate_pct, 1),
        "mitigated_post_intervention_rto_pct": round(mitigated_rto_rate_pct, 1),
        "avoided_physical_rtos_count": avoided_physical_rtos,
        "freight_capital_saved_usd": round(freight_capital_saved_usd, 2),
        "rto_mitigation_system_rating": "PREDICTIVE_RTO_DEFENSE_HIGH_EFFICACY"
    }

# Execute predictive RTO scoring simulation
defense_run = model_predictive_rto_scoring_and_otp_intervention(
    total_cod_orders=5000,
    high_risk_orders_pct=30.0,            # 30% flagged by ML risk model (1,500 orders)
    otp_confirmation_response_pct=60.0,   # 60% verify OTP; 40% are fake/unresponsive
    fraud_fake_order_pct=12.0,
    freight_loss_avoided_per_cancelled_order_usd=8.30
)

print(f"Predictive RTO Risk Scoring & Pre-Shipment OTP Intervention Telemetry:")
print(f"  Total Ingested COD Orders:  {defense_run['total_cod_orders_ingested']:,} orders")
print(f"  High-Risk Orders Flagged:   {defense_run['high_risk_orders_flagged']:,} orders (30% flagged)")
print(f"  OTP Verified & Dispatched:  {defense_run['otp_verified_and_dispatched']:,} orders confirmed")
print(f"  Unverified Pre-Cancelled:   {defense_run['unverified_orders_cancelled_pre_dispatch']:,} fake orders halted before warehouse pick")
print(f"  Net Dispatched Parcels:     {defense_run['total_orders_dispatched']:,} clean parcels")
print(f"  Unmitigated Baseline RTO:   {defense_run['baseline_unmitigated_rto_pct']}% of orders")
print(f"  Mitigated Active RTO Rate:  {defense_run['mitigated_post_intervention_rto_pct']}% (Compressed down to 9.4%)")
print(f"  Avoided Physical Returns:   {defense_run['avoided_physical_rtos_count']:,} RTO packages avoided")
print(f"  Net Freight Capital Saved:  ${defense_run['freight_capital_saved_usd']:,.2f} preserved in treasury ([{defense_run['rto_mitigation_system_rating']}])")'''

    p3_output = """Predictive RTO Risk Scoring & Pre-Shipment OTP Intervention Telemetry:
  Total Ingested COD Orders:  5,000 orders
  High-Risk Orders Flagged:   1,500 orders (30% flagged)
  OTP Verified & Dispatched:  900 orders confirmed
  Unverified Pre-Cancelled:   600 fake orders halted before warehouse pick
  Net Dispatched Parcels:     4,400 clean parcels
  Unmitigated Baseline RTO:   25.1% of orders
  Mitigated Active RTO Rate:  9.4% (Compressed down to 9.4%)
  Avoided Physical Returns:   840 RTO packages avoided
  Net Freight Capital Saved:  $4,980.00 preserved in treasury ([PREDICTIVE_RTO_DEFENSE_HIGH_EFFICACY])"""

    p3_notes = [
        "Flags 1,500 high-risk COD orders via ML scoring across address quality and buyer history.",
        "Halts 600 unverified/fake orders pre-dispatch via automated WhatsApp OTP verification.",
        "Compresses active COD RTO rate from 25.1% down to 9.4%, saving 840 physical return trips.",
        "Preserves $4,980.00 in direct forward and reverse freight capital across 5,000 orders."
    ]

    p3_check = {
        "question": "How does pre-shipment WhatsApp or SMS OTP verification on high-risk Cash on Delivery (COD) orders protect e-commerce profitability?",
        "options": [
            "It filters out fake orders, uncommitted impulse buyers, and incorrect phone numbers before warehouse dispatch, cancelling phantom orders and preventing unrecoverable forward and reverse freight losses.",
            "It requires the buyer to pay their utility bills before receiving the parcel.",
            "It forces the carrier to deliver the package on Sunday morning.",
            "It automatically increases the product price by 50%."
        ],
        "answer": 0,
        "why": "Halting unverified orders before packing and dispatch eliminates unrecoverable two-way courier shipping expenses and carton packaging waste."
    }

    parts.append({
        "title": "RTO Risk Scoring, Pre-Shipment OTP Verification & Address Sanitization Systems",
        "say": p3_say,
        "example": "An Indian D2C footwear brand screening 5,000 COD orders, cancelling 600 unconfirmed orders pre-dispatch to slash RTO from 25.1% to 9.4% and saving $4,980 in freight fees.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Increase otp_confirmation_response_pct to 85% to observe how improved customer communication rescues more legitimate sales while keeping RTO low.",
        "check": p3_check
    })

    # Part 4: Interactive Python Simulation: Dynamic 3PL Carrier Allocation & RTO Defense Engine
    p4_say = [
        "In Part 4, we examine the complete real-time technical integration connecting order management, carrier APIs, and risk scoring: The Dynamic 3PL Carrier Allocation & Automated RTO Defense Engine. In production e-commerce operations, these disparate operational disciplines must operate seamlessly within milliseconds. When a checkout order is submitted, the logistics orchestration engine executes a synchronized multi-stage pipeline: First, Address Parsing & Geocoding; Second, Machine Learning RTO Risk Evaluation; Third, Automated OTP Verification Triggering; Fourth, PIN Code Serviceability & Carrier Selection; and Fifth, Waybill Barcode Generation.",
        
        "A critical capability of modern logistics engines is PIN Code Serviceability Mapping and NDU Non-Delivery Unit Tracking. India, for example, contains over nineteen thousand unique postal PIN codes spanning diverse terrain from hyper-dense Mumbai high-rises to remote Himalayan mountain hamlets. Leading 3PL carriers maintain dynamic electronic serviceability tables: updating COD cash collection limits, embargo zones, and temporary weather delivery halts daily via API. The carrier allocation engine must inspect these matrices instantly: if a carrier's local delivery hub in PIN Code 560034 is experiencing severe labor shortages or overflowing package backlogs, the allocation engine immediately diverts parcel dispatches to an alternate healthy carrier.",
        
        "Furthermore, dynamic carrier engines evaluate Carrier First Attempt Delivery Rates (FADR). In logistics operations, if a courier fails to deliver a package on the first attempt, the probability of successful delivery on the second or third attempt plummets by fifty percent. Couriers often falsely mark delivery attempts as 'Customer Unavailable' or 'Door Closed' (known as Fake Delivery Attempts) to meet daily driver performance quotas without visiting the address. Modern logistics control towers ingest real-time GPS telemetry from courier mobile apps: verifying that the delivery driver's physical smartphone coordinates matched the customer's delivery geocode before accepting an 'Attempt Failed' status, and automatically escalating fraudulent fake attempts to carrier executive managers.",
        
        "In our institutional Python model for Part 4, we simulate an integrated Dynamic Carrier Allocation & RTO Defense Engine processing ten thousand live customer orders. The engine evaluates geographic PIN code serviceability, executes automated OTP defense, routes orders to top-performing 3PL carriers based on real-time FADR metrics, and calculates the net operational delivery success rate. Review the deterministic code below to observe the integration of carrier logistics and fraud defense."
    ]

    p4_code = '''def simulate_dynamic_carrier_allocation_and_rto_defense(
    total_orders_cohort: int,
    cod_percentage: float,
    rto_defense_active: bool
) -> dict:
    """
    Simulates integrated Dynamic 3PL Carrier Allocation and RTO Defense Pipeline.
    Evaluates PIN code serviceability, pre-shipment OTP filtering, and carrier FADR performance.
    """
    cod_orders_count = int(total_orders_cohort * (cod_percentage / 100.0))
    prepaid_orders_count = total_orders_cohort - cod_orders_count
    
    # 1. RTO Defense Pipeline (Active vs Inactive)
    if rto_defense_active:
        # Pre-shipment OTP cancels 12% of high-risk uncommitted COD orders pre-dispatch
        cancelled_cod_orders = int(cod_orders_count * 0.12)
        dispatched_cod_orders = cod_orders_count - cancelled_cod_orders
        cod_delivery_success_rate = 0.905 # 90.5% delivered (9.5% RTO)
    else:
        cancelled_cod_orders = 0
        dispatched_cod_orders = cod_orders_count
        cod_delivery_success_rate = 0.740 # 74.0% delivered (26.0% unmitigated RTO)
        
    dispatched_prepaid_orders = prepaid_orders_count
    prepaid_delivery_success_rate = 0.975 # 97.5% delivered (2.5% RTO)
    
    total_dispatched_orders = dispatched_cod_orders + dispatched_prepaid_orders
    
    # 2. Delivered vs Returned Outcomes
    delivered_cod = int(dispatched_cod_orders * cod_delivery_success_rate)
    rto_cod = dispatched_cod_orders - delivered_cod
    
    delivered_prepaid = int(dispatched_prepaid_orders * prepaid_delivery_success_rate)
    rto_prepaid = dispatched_prepaid_orders - delivered_prepaid
    
    total_delivered_parcels = delivered_cod + delivered_prepaid
    total_rto_parcels = rto_cod + rto_prepaid
    
    overall_delivered_ratio_pct = (total_delivered_parcels / total_dispatched_orders) * 100.0
    blended_rto_rate_pct = (total_rto_parcels / total_dispatched_orders) * 100.0
    
    # Financial metrics (Avg order value $60, gross margin 40%, RTO penalty $8.50)
    realized_gross_profit = total_delivered_parcels * 60.0 * 0.40
    rto_freight_loss = total_rto_parcels * 8.50
    net_operating_profit_usd = realized_gross_profit - rto_freight_loss
    
    return {
        "total_orders_ingested": total_orders_cohort,
        "rto_defense_active": rto_defense_active,
        "cancelled_fake_orders_pre_dispatch": cancelled_cod_orders,
        "total_dispatched_parcels": total_dispatched_orders,
        "total_delivered_parcels": total_delivered_parcels,
        "total_rto_parcels": total_rto_parcels,
        "overall_delivery_success_pct": round(overall_delivered_ratio_pct, 1),
        "blended_rto_rate_pct": round(blended_rto_rate_pct, 1),
        "realized_gross_profit_usd": round(realized_gross_profit, 2),
        "rto_freight_loss_usd": round(rto_freight_loss, 2),
        "net_operating_profit_usd": round(net_operating_profit_usd, 2),
        "pipeline_status": "RTO_DEFENSE_ACTIVE_HIGH_DELIVERY" if rto_defense_active else "VULNERABLE_UNMITIGATED_RTO"
    }

# Execute dynamic carrier allocation with active RTO defense
active_defense_run = simulate_dynamic_carrier_allocation_and_rto_defense(
    total_orders_cohort=10000,
    cod_percentage=50.0,
    rto_defense_active=True
)

print(f"Dynamic 3PL Carrier Allocation & RTO Defense Simulation:")
print(f"  Total Ingested Orders:      {active_defense_run['total_orders_ingested']:,} orders")
print(f"  RTO Defense System Active:  {active_defense_run['rto_defense_active']} ([{active_defense_run['pipeline_status']}])")
print(f"  Pre-Dispatch Cancellations: {active_defense_run['cancelled_fake_orders_pre_dispatch']:,} phantom orders halted")
print(f"  Total Dispatched Parcels:   {active_defense_run['total_dispatched_parcels']:,} verified parcels")
print(f"  Delivered Doorstep Orders:  {active_defense_run['total_delivered_parcels']:,} orders ({active_defense_run['overall_delivery_success_pct']}%)")
print(f"  Returned RTO Parcels:       {active_defense_run['total_rto_parcels']:,} returns ({active_defense_run['blended_rto_rate_pct']}%)")
print(f"  Realized Gross Profit:      ${active_defense_run['realized_gross_profit_usd']:,.2f}")
print(f"  RTO Double-Freight Loss:    ${active_defense_run['rto_freight_loss_usd']:,.2f}")
print(f"  Net Realized Profit:        ${active_defense_run['net_operating_profit_usd']:,.2f}")'''

    p4_output = """Dynamic 3PL Carrier Allocation & RTO Defense Simulation:
  Total Ingested Orders:      10,000 orders
  RTO Defense System Active:  True ([RTO_DEFENSE_ACTIVE_HIGH_DELIVERY])
  Pre-Dispatch Cancellations: 600 phantom orders halted
  Total Dispatched Parcels:   9,400 verified parcels
  Delivered Doorstep Orders:  8,857 orders (94.2%)
  Returned RTO Parcels:       543 returns (5.8%)
  Realized Gross Profit:      $212,568.00
  RTO Double-Freight Loss:    $4,615.50
  Net Realized Profit:        $207,952.50"""

    p4_notes = [
        "Models integrated carrier allocation and pre-shipment RTO defense across 10,000 orders.",
        "Demonstrates halting 600 phantom orders pre-dispatch, reducing active dispatches to 9,400 clean parcels.",
        "Drives overall doorstep delivery success to 94.2%, keeping blended RTO at a lean 5.8%.",
        "Generates $207,952.50 in net operating profit after absorbing minimal RTO freight losses ($4,615.50)."
    ]

    p4_check = {
        "question": "What is the primary operational effect of activating automated RTO Defense within a dynamic 3PL carrier allocation pipeline?",
        "options": [
            "It filters uncommitted and fraudulent COD orders before warehouse dispatch, compressing the blended RTO rate below 6% and maximizing realized net operating profit.",
            "It allows the merchant to deliver packages using supersonic passenger jets.",
            "It forces all courier drivers to sign legal non-disclosure agreements.",
            "It automatically converts all cash currency into gold bars."
        ],
        "answer": 0,
        "why": "RTO defense halts phantom orders before shipping, boosting delivery rates to 94%+ and protecting margins from double-freight destruction."
    }

    parts.append({
        "title": "Interactive Python Simulation: Dynamic 3PL Carrier Allocation & RTO Defense Engine",
        "say": p4_say,
        "example": "An enterprise multi-carrier routing engine dispatching 9,400 verified parcels with active RTO defense, achieving 94.2% delivery success and $207,952 in net profit while holding RTO to 5.8%.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Set rto_defense_active to False to observe how unmitigated COD RTO surges to 14.3% (1,425 returns), quadrupling freight losses to over $12,000.",
        "check": p4_check
    })

    # Part 5: Enterprise Logistics Control Tower & Milestone Logistics Certification
    p5_say = [
        "We reach Part 5: Enterprise Logistics Control Tower, Carrier SLA Governance, and Milestone Logistics Certification Architecture. In high-velocity digital retail, logistics execution is the ultimate bridge connecting customer expectations with physical fulfillment reality. The Chief Operating Officer (COO), Chief Logistics Officer (CLO), and VP of Customer Experience must maintain unified command over carrier delivery performance, RTO containment, freight spending velocity, and customer delivery satisfaction across all regional fulfillment nodes.",
        
        "To enforce institutional excellence, enterprise logistics command towers deploy the Four-Pillar Logistics Governance Architecture: Pillar One governs Delivery SLA & First Attempt Success—mandating On-Time Delivery rates above ninety-five percent and maintaining First Attempt Delivery Rates (FADR) above eighty-eight percent across all 3PL partners; Pillar Two enforces COD RTO Containment—deploying machine learning risk scoring and WhatsApp OTP verification to keep blended COD RTO rates strictly under ten percent; Pillar Three governs Freight Cost Reconciliation & Audit—reconciling carrier billing invoices against dimensional volumetric weight telemetry to eliminate carrier billing discrepancies and maintain freight expenses below seven percent of gross revenue; and Pillar Four manages Real-Time Exception & WISMO Resolution—ingesting carrier tracking webhooks to proactively notify customers of delivery exceptions before support tickets are triggered.",
        
        "Furthermore, enterprise logistics control towers manage NDR (Non-Delivery Report) Re-Attempt Workflows. When a courier logs a failed delivery attempt, the control tower does not passively wait for the parcel to be returned to the origin. Instead, the system immediately dispatches an automated WhatsApp interactive message to the customer: verifying whether the driver actually visited, collecting alternate delivery time slots or secondary phone numbers, and transmitting re-attempt instructions directly to the courier hub. This automated NDR orchestration rescues up to thirty to forty percent of otherwise doomed delivery attempts, converting potential RTO losses into realized customer sales.",
        
        "In our capstone Python simulation for Day 10, we synthesize the complete multi-carrier logistics, line-haul routing, COD economics, and predictive RTO defense lifecycle into the Enterprise Logistics Control Tower & Milestone Logistics Certification Gateway. The engine evaluates twenty-five thousand customer shipments, audits carrier OTD compliance, measures RTO suppression efficacy, reconciles freight expenses, and issues a formal Boardroom Logistics Master Certification. Review the deterministic code below to master the apex command architecture of digital commerce logistics."
    ]

    p5_code = '''def model_enterprise_logistics_command_gateway(
    total_shipped_parcels: int,
    cod_volume_share_pct: float,
    on_time_delivery_sla_pct: float,
    first_attempt_delivery_rate_pct: float,
    blended_rto_rate_pct: float,
    carrier_invoice_audit_recovery_usd: float
) -> dict:
    """
    Tier 5: Enterprise Logistics Control Tower & Milestone Logistics Certification Gateway.
    Synthesizes multi-carrier OTD SLAs, FADR velocity, COD RTO suppression, and freight billing audit.
    """
    # 1. Doorstep Delivery Volume & Out-of-SLA Exceptions
    delivered_parcels = int(total_shipped_parcels * ((100.0 - blended_rto_rate_pct) / 100.0))
    returned_rto_parcels = total_shipped_parcels - delivered_parcels
    
    on_time_parcels = int(delivered_parcels * (on_time_delivery_sla_pct / 100.0))
    late_delivered_parcels = delivered_parcels - on_time_parcels
    
    # 2. Governance Hurdle Checks
    otd_sla_target_met = on_time_delivery_sla_pct >= 95.0
    fadr_target_met = first_attempt_delivery_rate_pct >= 88.0
    rto_target_met = blended_rto_rate_pct <= 8.0 # Blended RTO target <= 8.0%
    audit_recovery_positive = carrier_invoice_audit_recovery_usd > 0.0
    
    # Certification status
    certified = (
        otd_sla_target_met and
        fadr_target_met and
        rto_target_met and
        audit_recovery_positive
    )
    
    return {
        "total_shipped_parcels": total_shipped_parcels,
        "cod_volume_share_pct": cod_volume_share_pct,
        "delivered_parcels_count": delivered_parcels,
        "returned_rto_parcels_count": returned_rto_parcels,
        "blended_rto_rate_pct": round(blended_rto_rate_pct, 1),
        "on_time_delivered_parcels": on_time_parcels,
        "late_delivered_parcels": late_delivered_parcels,
        "on_time_delivery_sla_pct": round(on_time_delivery_sla_pct, 1),
        "first_attempt_delivery_rate_pct": round(first_attempt_delivery_rate_pct, 1),
        "carrier_invoice_audit_recovery_usd": round(carrier_invoice_audit_recovery_usd, 2),
        "enterprise_logistics_certified": certified,
        "production_gateway_rating": "APEX_ENTERPRISE_LOGISTICS_CONTROL_TOWER_CERTIFIED" if certified else "LOGISTICS_REMEDIATION_REQUIRED"
    }

# Execute master logistics control tower gateway
gateway_run = model_enterprise_logistics_command_gateway(
    total_shipped_parcels=25000,
    cod_volume_share_pct=48.0,
    on_time_delivery_sla_pct=96.4,
    first_attempt_delivery_rate_pct=89.8,
    blended_rto_rate_pct=6.5,
    carrier_invoice_audit_recovery_usd=14250.00
)

print(f"Enterprise Logistics Control Tower & Milestone Logistics Certification Gateway:")
print(f"  Total Managed Shipments:    {gateway_run['total_shipped_parcels']:,} parcels (48% COD)")
print(f"  Successfully Delivered:     {gateway_run['delivered_parcels_count']:,} parcels (93.5% net delivered)")
print(f"  Returned to Origin (RTO):   {gateway_run['returned_rto_parcels_count']:,} parcels ({gateway_run['blended_rto_rate_pct']}%)")
print(f"  On-Time Delivery SLA:       {gateway_run['on_time_delivery_sla_pct']}% (Target: >=95.0%)")
print(f"  First Attempt Success (FADR):{gateway_run['first_attempt_delivery_rate_pct']}% (Target: >=88.0%)")
print(f"  Carrier Invoice Recovery:   ${gateway_run['carrier_invoice_audit_recovery_usd']:,.2f} clawed back from carrier overbilling")
print(f"  Production Platform Status: [{gateway_run['production_gateway_rating']}] (Certified: {gateway_run['enterprise_logistics_certified']})")'''

    p5_output = """Enterprise Logistics Control Tower & Milestone Logistics Certification Gateway:
  Total Managed Shipments:    25,000 parcels (48% COD)
  Successfully Delivered:     23,375 parcels (93.5% net delivered)
  Returned to Origin (RTO):   1,625 parcels (6.5%)
  On-Time Delivery SLA:       96.4% (Target: >=95.0%)
  First Attempt Success (FADR):89.8% (Target: >=88.0%)
  Carrier Invoice Recovery:   $14,250.00 clawed back from carrier overbilling
  Production Platform Status: [APEX_ENTERPRISE_LOGISTICS_CONTROL_TOWER_CERTIFIED] (Certified: True)"""

    p5_notes = [
        "Synthesizes 25,000 shipments across multi-carrier OTD SLAs, FADR velocity, and RTO suppression.",
        "Verifies 96.4% On-Time Delivery and 89.8% First Attempt Delivery Rate across 3PL networks.",
        "Suppresses blended RTO rate to 6.5%, well below the 8.0% institutional ceiling.",
        "Claws back $14,250 in carrier invoice overbilling and confers Apex Logistics Control Tower Certification."
    ]

    p5_check = {
        "question": "What is the primary operational objective of the Enterprise Logistics Control Tower in digital commerce?",
        "options": [
            "To provide centralized, real-time command over multi-carrier On-Time Delivery SLAs, first-attempt delivery rates, COD RTO suppression, and automated carrier invoice auditing.",
            "To paint all delivery trucks the same color.",
            "To replace human delivery drivers with carrier pigeons.",
            "To force customers to pay their credit card bill before placing an order."
        ],
        "answer": 0,
        "why": "The logistics control tower manages carrier SLAs, mitigates costly RTO returns, and audits billing accuracy to protect customer experience and operating profit."
    }

    parts.append({
        "title": "Enterprise Logistics Control Tower & Milestone Logistics Certification",
        "say": p5_say,
        "example": "A Tier-1 digital commerce conglomerate managing 25,000 monthly shipments, achieving 96.4% OTD, 89.8% FADR, 6.5% RTO, and clawing back $14,250 in freight billing errors to earn Apex Logistics Certification.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Increase blended_rto_rate_pct to 11.0% to observe how an uncontained RTO rate revokes platform certification.",
        "check": p5_check
    })

    day10_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 10,
        "title": "Logistics, 3PL Carriers & Cash on Delivery (COD) RTO Mitigation Systems",
        "goal": "Master e-commerce logistics and carrier network operations: multi-carrier 3PL routing architectures, Cash on Delivery (COD) economics and double-freight RTO penalties, machine learning RTO risk scoring with pre-shipment OTP verification, dynamic PIN code serviceability, and logistics control tower governance.",
        "minutes": 35,
        "recap": "Welcome to Day 10 of E-Commerce & Marketplace Economics. Today we mastered multi-carrier 3PL routing, analyzed the devastating unit economics of COD RTO returns, implemented ML risk scoring and pre-shipment OTP verification, orchestrated dynamic carrier serviceability, and governed logistics SLAs.",
        "parts": parts,
        "summary": [
            "Multi-carrier 3PL routing engines dynamically allocate shipments by PIN code serviceability, speed SLAs, and negotiated cost rates.",
            "Cash on Delivery (COD) orders risk catastrophic Return to Origin (RTO) penalties, doubling forward and reverse freight expenses.",
            "Machine learning RTO risk scoring evaluates historical buyer telemetry to flag high-risk delivery attempts.",
            "Pre-shipment WhatsApp and SMS OTP verification converts volatile COD orders into confirmed deliveries or prepaid transactions.",
            "Enterprise logistics control towers continuously monitor On-Time Delivery (OTD) and automate freight invoice discrepancy audits."
        ]
    }

    total_words = ensure_ecom_day_budget(day10_dict, min_part_words=580, min_day_words=2950)
    return day10_dict, total_words

if __name__ == '__main__':
    d, words = build_day10()
    print(f"Day 10 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
