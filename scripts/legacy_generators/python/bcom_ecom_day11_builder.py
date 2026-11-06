"""
Day 11 Builder: Reverse Logistics & Returns Management: Automated RMA & Restocking Inspection
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-806
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 funnel visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day11():
    parts = []

    # Part 1: Reverse Logistics Economics: Return Rates by Category & Net Margin Erosion
    p1_say = [
        "Welcome to Day 11 of B.Com E-Commerce and Digital Business. As we embark on Module 3, we transition from forward fulfillment velocity to the complex and costly discipline of Reverse Logistics, Returns Management, and Restocking Engineering. In modern digital commerce, product returns are no longer an operational afterthought or incidental cost of doing business; they represent one of the most critical determinants of gross profit margin survival. Across the global retail landscape, e-commerce return rates average between twenty and thirty percent—more than three times the eight to ten percent return rate typical of brick-and-mortar retail stores. In high-velocity apparel, footwear, and fashion categories, return rates frequently surge to thirty-five or even forty percent as consumers adopt bracketing behavior, ordering multiple sizes or colors of the same garment with the deliberate intention of returning those that do not fit.",
        
        "The financial anatomy of an e-commerce return reveals substantial margin erosion that extends far beyond the mere reversal of top-line merchandise revenue. When a customer initiates a return, the enterprise incurs a cascading sequence of unrecoverable costs: first, customer service inquiry handling and return label generation; second, reverse linehaul freight and carrier collection surcharges, which are often thirty to fifty percent higher per parcel than bulk forward shipping; third, warehouse receiving, barcode unbagging, and physical inspection labor; fourth, sanitization, dry cleaning, steaming, or repackaging expenses; and fifth, inventory depreciation and markdown loss due to seasonal obsolescence while units sit in transit. For a typical eighty-dollar apparel purchase, total reverse logistics processing costs can easily consume twenty to twenty-five dollars—turning an initially profitable transaction into a catastrophic net margin loss.",
        
        "To mitigate this economic drain, institutional e-commerce platforms model the Net Landed Recovery Rate across product categories. If an item cannot be returned to prime 'Grade A' sellable condition quickly, it risks becoming stranded capital. The velocity of the reverse supply chain is paramount: every week an apparel item spends languishing in a return processing center reduces its resale value by two to five percent as fashion cycles advance. Consequently, modern fulfillment networks establish specialized Reverse Logistics Centers (RLCs) engineered specifically for high-throughput triage, unbagging, optical quality inspection, and rapid re-inventorying within forty-eight hours of parcel receipt.",
        
        "Furthermore, leading Direct-to-Consumer (D2C) brands and multi-brand marketplaces deploy strategic behavioral nudges during the digital return initiation workflow. Rather than defaulting to a friction-free cash refund to the original payment method, platforms offer instant store credit bonuses (such as offering a 110% credit voucher), promote one-click size exchanges before the return parcel is even shipped, or suggest contextual product alternatives. By converting return requests into immediate exchanges or wallet credits, brands preserve cash flow, prevent customer churn, and recover customer lifetime value (LTV).",
        
        "In our institutional Python model for Part 1, we simulate the comprehensive financial dynamics of e-commerce returns across diverse merchandise categories (Apparel, Consumer Electronics, Home Goods, and Luxury Accessories). The function calculates category return rates, forward shipping write-offs, return transit freight, inspection labor, repackaging overhead, markdown depreciation, and the net economic loss per returned unit. Examine the deterministic code below to master the quantitative economics governing reverse supply chains."
    ]

    p1_code = '''def model_reverse_logistics_economics(
    order_volume: int,
    avg_order_value_usd: float,
    gross_margin_pct: float,
    category_params: dict
) -> dict:
    """
    Models reverse logistics unit economics, return rates, processing costs,
    and net margin erosion across retail merchandise categories.
    """
    total_gmv = order_volume * avg_order_value_usd
    gross_profit = total_gmv * gross_margin_pct
    
    return_rate = category_params['return_rate_pct']
    return_units = int(order_volume * return_rate)
    returned_gmv = return_units * avg_order_value_usd
    
    # Reverse cost components per returned unit
    carrier_reverse_freight = category_params['reverse_freight_usd']
    warehouse_inspection_labor = category_params['inspection_labor_usd']
    repackaging_refurb_cost = category_params['repackaging_cost_usd']
    salvage_depreciation_pct = category_params['markdown_loss_pct']
    
    total_reverse_freight = return_units * carrier_reverse_freight
    total_inspection_labor = return_units * warehouse_inspection_labor
    total_repackaging = return_units * repackaging_refurb_cost
    total_markdown_loss = returned_gmv * salvage_depreciation_pct
    
    total_reverse_cost = (
        total_reverse_freight + 
        total_inspection_labor + 
        total_repackaging + 
        total_markdown_loss
    )
    
    cost_per_returned_unit = total_reverse_cost / return_units if return_units > 0 else 0.0
    net_retained_gmv = total_gmv - returned_gmv
    adjusted_profit = gross_profit - (returned_gmv * gross_margin_pct) - total_reverse_cost
    net_margin_pct = (adjusted_profit / net_retained_gmv) * 100.0 if net_retained_gmv > 0 else 0.0
    
    return {
        "category": category_params['name'],
        "order_volume": order_volume,
        "return_units": return_units,
        "return_rate_pct": round(return_rate * 100.0, 1),
        "returned_gmv_usd": round(returned_gmv, 2),
        "total_reverse_cost_usd": round(total_reverse_cost, 2),
        "cost_per_returned_unit_usd": round(cost_per_returned_unit, 2),
        "net_retained_gmv_usd": round(net_retained_gmv, 2),
        "adjusted_profit_usd": round(adjusted_profit, 2),
        "effective_net_margin_pct": round(net_margin_pct, 2)
    }

# Simulation for Apparel (High return, high restocking markdown)
apparel_config = {
    'name': 'Apparel & Footwear',
    'return_rate_pct': 0.28,
    'reverse_freight_usd': 6.50,
    'inspection_labor_usd': 3.20,
    'repackaging_cost_usd': 2.10,
    'markdown_loss_pct': 0.18
}

apparel_metrics = model_reverse_logistics_economics(
    order_volume=10000,
    avg_order_value_usd=75.0,
    gross_margin_pct=0.55,
    category_params=apparel_config
)

print(f"Category: {apparel_metrics['category']}")
print(f"Total Orders: {apparel_metrics['order_volume']} | Returned Units: {apparel_metrics['return_units']} ({apparel_metrics['return_rate_pct']}%)")
print(f"Returned GMV: ${apparel_metrics['returned_gmv_usd']:,.2f}")
print(f"Reverse Logistics Cost: ${apparel_metrics['total_reverse_cost_usd']:,.2f} (${apparel_metrics['cost_per_returned_unit_usd']:.2f}/unit)")
print(f"Net Retained GMV: ${apparel_metrics['net_retained_gmv_usd']:,.2f}")
print(f"Adjusted Retained Profit: ${apparel_metrics['adjusted_profit_usd']:,.2f} (Net Margin: {apparel_metrics['effective_net_margin_pct']}%)")'''

    p1_output = """Category: Apparel & Footwear
Total Orders: 10000 | Returned Units: 2800 (28.0%)
Returned GMV: $210,000.00
Reverse Logistics Cost: $70,840.00 ($25.30/unit)
Net Retained GMV: $540,000.00
Adjusted Retained Profit: $226,160.00 (Net Margin: 41.88%)"""

    p1_check = {
        "question": "An e-commerce brand ships 10,000 apparel orders with an AOV of $75 and a 28% return rate. If total reverse processing costs equal $25.30 per returned unit, what is the total direct reverse logistics cost incurred?",
        "options": [
            "$25,300.00",
            "$70,840.00",
            "$140,560.00",
            "$210,000.00"
        ],
        "answer": 1,
        "why": "2,800 returned units multiplied by $25.30 total reverse logistics cost per returned unit equals exactly $70,840.00 in unrecoverable reverse processing overhead."
    }

    p1_example = "ASOS and Zara engineered dynamic return fees in select European and UK markets, charging a nominal return fee of £1.95 to £2.50 for postal returns while offering free returns if drop-offs occur at physical retail stores. This operational shift dramatically reduced postal return volume by 18%, lowered carrier freight expenses, and drove foot traffic into physical stores where returning customers converted on new purchases 32% of the time."
    p1_tryit = "Modify the markdown_loss_pct from 0.18 to 0.08 by introducing automated rapid re-bagging within 24 hours. Re-run the simulation to calculate the total recovered profit and the uplift in effective net margin percentage."
    p1_notes = [
        "Return rates in e-commerce apparel (25-35%) exceed brick-and-mortar retail by 3x due to online sizing uncertainty and intentional customer bracketing.",
        "Total reverse processing cost includes reverse linehaul freight, inspection labor, repackaging, and depreciation markdowns.",
        "Rapid turnaround velocity in reverse logistics prevents fashion markdown decay, which depreciates inventory value by 2-5% per idle week.",
        "Strategic incentives like store credit vouchers (110%) or 1-click size exchanges preserve gross merchandise value and prevent cash depletion."
    ]

    parts.append({
        "title": "Reverse Logistics Economics: Category Return Rates & Margin Erosion",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "check": p1_check,
        "example": p1_example,
        "tryIt": p1_tryit,
        "codeNotes": p1_notes
    })

    # Part 2: Automated RMA State Machine & Digital Gatekeeping
    p2_say = [
        "In Part 2, we architect the technical control system governing returns: The Automated Return Merchandise Authorization (RMA) State Machine. In early e-commerce operations, returns were handled manually through unstructured email exchanges with customer care agents who generated static PDF shipping slips. This manual approach created severe operational blind spots: fulfillment warehouses had zero advance visibility into incoming freight volumes, customers experienced weeks of anxiety regarding refund statuses, and invalid or fraudulent returns slipped through unchecked. Modern enterprise commerce mandates an automated, programmatic RMA workflow that validates eligibility, enforces return policies in real time, and dynamically determines the most economically optimal routing path.",
        
        "The automated RMA state machine operates as a strict five-stage finite state automata: Stage One is 'REQUESTED', where the customer initiates a return through a self-service portal, selecting structured return reasons (e.g., 'Defective', 'Wrong Item Received', 'Too Small', 'Changed Mind') and uploading photographic evidence if damaged; Stage Two is 'ELIGIBILITY_VALIDATED', where the system programmatically checks business rules—such as whether the order falls within the thirty-day return window, whether the item belongs to an excluded final-sale or hygienic category, and whether the customer's historical return frequency triggers fraud flags; Stage Three is 'LABEL_ISSUED', where the system generates a dynamic carrier barcode (or QR code for paperless drop-off) containing pre-encoded RMA metadata; Stage Four is 'CARRIER_SCAN_ORIGIN', which updates tracking and can trigger instant gift card refunds for trusted VIP cohorts; and Stage Five is 'INSPECTION_SETTLED', where warehouse receiving verifies physical contents and finalizes payment settlement.",
        
        "A critical capability of modern RMA software is 'Keep It' algorithmics or Returnless Refunds. For low-cost, bulky, or liquid items where the reverse carrier freight and inspection labor exceed the item's salvage value (e.g., an eleven-dollar pet shampoo or fifteen-dollar bulky plastic container), shipping the product back produces guaranteed negative unit contribution. The RMA gateway automatically runs a micro-economic threshold calculation: if (Carrier Freight + Warehouse Processing Cost) > (Item Landed Cost - Expected Resale Value), the system immediately issues a full refund and instructs the customer to keep, donate, or dispose of the item. This single programmatic intervention saves retailers millions of dollars in pointless reverse shipping fees while generating exceptional customer delight.",
        
        "Furthermore, the RMA engine manages customer incentives dynamically. If a shopper chooses 'Size Too Small', the portal immediately surfaces an instantaneous 1-click exchange recommendation, reserving the correct size in the nearest fulfillment node before inventory depletes. If the customer accepts the exchange, the new order is dispatched immediately, transforming an impending $25 return loss into a successfully retained customer transaction.",
        
        "In our Python model for Part 2, we build an enterprise RMA Decision Engine. The script evaluates customer return requests against return window rules, product category restrictions, economic returnless refund thresholds, and instant exchange incentives. It outputs the authoritative RMA routing status, calculated freight costs, and the customer settlement outcome. Review the implementation below."
    ]

    p2_code = '''def process_automated_rma_request(
    order_days_elapsed: int,
    item_category: str,
    item_retail_price: float,
    item_cost_basis: float,
    return_reason: str,
    customer_lifetime_orders: int,
    customer_return_rate_pct: float,
    reverse_shipping_cost: float,
    warehouse_processing_cost: float
) -> dict:
    """
    Automated RMA State Machine evaluating policy eligibility,
    economic returnless refund thresholds, and exchange incentives.
    """
    MAX_RETURN_WINDOW_DAYS = 30
    NON_RETURNABLE_CATEGORIES = ['Intimates', 'Health & Hygiene', 'Perishables', 'Customized']
    
    # Policy validation
    if order_days_elapsed > MAX_RETURN_WINDOW_DAYS:
        return {
            "rma_status": "REJECTED_WINDOW_EXPIRED",
            "reason": f"Order age ({order_days_elapsed} days) exceeds {MAX_RETURN_WINDOW_DAYS}-day policy.",
            "refund_issued": False,
            "reverse_freight_incurred": 0.0
        }
        
    if item_category in NON_RETURNABLE_CATEGORIES:
        return {
            "rma_status": "REJECTED_NON_RETURNABLE_CATEGORY",
            "reason": f"Category '{item_category}' is non-returnable due to hygiene and safety regulations.",
            "refund_issued": False,
            "reverse_freight_incurred": 0.0
        }
        
    # High-risk abuse check
    if customer_lifetime_orders > 3 and customer_return_rate_pct > 0.65:
        return {
            "rma_status": "FLAGGED_FOR_MANUAL_AUDIT",
            "reason": f"High return frequency ({customer_return_rate_pct*100:.1f}%) requires anti-fraud review.",
            "refund_issued": False,
            "reverse_freight_incurred": 0.0
        }
        
    # Economic Returnless Refund evaluation
    total_reverse_expense = reverse_shipping_cost + warehouse_processing_cost
    salvage_recovery_value = item_retail_price * 0.20 # Estimated resale recovery
    
    # If shipping and handling cost exceeds potential recovery and customer is trusted
    if total_reverse_expense >= salvage_recovery_value and item_retail_price <= 25.0:
        return {
            "rma_status": "RETURNLESS_REFUND_APPROVED",
            "action": "Customer instructed to keep/donate product; full refund credited.",
            "refund_amount_usd": item_retail_price,
            "reverse_freight_incurred": 0.0,
            "net_cash_saved_usd": round(total_reverse_expense, 2)
        }
        
    # Standard authorized return with dynamic QR label
    return {
        "rma_status": "AUTHORIZED_LABEL_ISSUED",
        "tracking_type": "PAPERLESS_QR_CARRIER_DROP",
        "refund_amount_usd": item_retail_price,
        "reverse_freight_incurred": reverse_shipping_cost,
        "warehouse_destination": "RLC-NODE-EAST-01",
        "action": "Return authorized. Carrier scan triggers refund or exchange dispatch."
    }

# Test Cases
t1 = process_automated_rma_request(
    order_days_elapsed=14,
    item_category='Pet Supplies',
    item_retail_price=16.50,
    item_cost_basis=5.0,
    return_reason='Defective',
    customer_lifetime_orders=8,
    customer_return_rate_pct=0.12,
    reverse_shipping_cost=7.50,
    warehouse_processing_cost=3.50
)

t2 = process_automated_rma_request(
    order_days_elapsed=10,
    item_category='Footwear',
    item_retail_price=120.0,
    item_cost_basis=45.0,
    return_reason='Size Too Small',
    customer_lifetime_orders=5,
    customer_return_rate_pct=0.20,
    reverse_shipping_cost=8.50,
    warehouse_processing_cost=4.00
)

print(f"Scenario 1 ($16.50 Pet Supplies): Status -> {t1['rma_status']} | Saved: ${t1.get('net_cash_saved_usd', 0.0):.2f}")
print(f"Scenario 2 ($120.00 Footwear): Status -> {t2['rma_status']} | Freight Incurred: ${t2['reverse_freight_incurred']:.2f}")'''

    p2_output = """Scenario 1 ($16.50 Pet Supplies): Status -> RETURNLESS_REFUND_APPROVED | Saved: $11.00
Scenario 2 ($120.00 Footwear): Status -> AUTHORIZED_LABEL_ISSUED | Freight Incurred: $8.50"""

    p2_check = {
        "question": "Under what operational and financial conditions does an automated RMA engine trigger a 'Returnless Refund'?",
        "options": [
            "When the item is an expensive luxury watch covered by third-party insurance",
            "When total reverse logistics expenses (freight and inspection) exceed the expected net salvage recovery value on low-ticket items",
            "When the customer initiates a chargeback dispute through their issuing bank",
            "When the order was placed during peak holiday shopping periods"
        ],
        "answer": 1,
        "why": "When the sum of reverse shipping freight and warehouse labor exceeds the salvage resale value of a low-ticket item, shipping the product back guarantees negative contribution margin. Issuing a returnless refund saves direct cash."
    }

    p2_example = "Amazon and Chewy utilize proprietary returnless refund algorithms for low-ticket pet foods and bulky household essentials under $20. By calculating that reverse freight ($7-$9) and sanitary disposal costs exceed product recovery value, Chewy encourages customers to donate unopened food to local animal shelters, eliminating reverse freight expenses while generating peerless brand loyalty."
    p2_tryit = "Test the effect of an order age of 35 days in the simulation. Notice how the state machine immediately rejects the RMA request under policy expiration before incurring any carrier freight liabilities."
    p2_notes = [
        "Automated RMA systems transition returns from chaotic manual inbox handling to programmatic state machine execution.",
        "Returnless refunds protect contribution margin when total reverse handling expenses exceed net salvage recovery value.",
        "Non-returnable classifications (hygiene, intimate apparel, customized goods) protect platforms from regulatory and sanitization liabilities.",
        "Real-time fraud scoring flags accounts exhibiting abusive return ratios (>65%) for forensic manual auditing prior to label generation."
    ]

    parts.append({
        "title": "Automated RMA State Machine & Digital Gatekeeping",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "check": p2_check,
        "example": p2_example,
        "tryIt": p2_tryit,
        "codeNotes": p2_notes
    })

    # Part 3: Warehouse Restocking Inspection, Grading & Secondary Liquidation
    p3_say = [
        "In Part 3, we enter the physical Reverse Logistics Center (RLC) to examine the operational mechanics of Warehouse Restocking, Quality Inspection, and Secondary Liquidation. Once a returned parcel arrives at the warehouse dock doors, it enters the receiving and unbagging staging area. Warehouse associates scan the unique carrier RMA barcode to reconcile the physical parcel against the digital order record. This scan initiates the License Plate Number (LPN) tracking protocol: a unique internal tracking barcode is attached to the unit, establishing complete serial and batch custody throughout its post-return lifecycle.",
        
        "The core of reverse operations is the multi-point Quality Grading Decision Matrix. Quality control inspectors evaluate returned merchandise across four rigorous physical criteria: First, Packaging Integrity—is the original factory box or polybag intact with manufacturer tags and barcodes attached? Second, Functional Performance—does electronic or mechanical hardware power on, complete self-tests, and contain all original cables and user manuals? Third, Cosmetic Condition—are there stains, pet hair, perfume odors, scuffs, scratches, or wear marks? Fourth, Completeness—are all accessories, extra buttons, and bundled warranty cards present?",
        
        "Based on this systematic physical audit, the unit is assigned an authoritative disposition grade that dictates its economic route: 'Grade A' (Brand New / Pristine Condition) requires minor cleaning or re-bagging and is immediately restocked into forward fulfillable inventory at 100% full retail price; 'Grade B' (Open Box / Minor Cosmetic Imperfections) cannot be sold as new under legal truth-in-advertising statutes and is routed to a dedicated 'Open Box / Outlet' storefront channel at a 15-25% discount; 'Grade C' (Refurbished / Missing Secondary Accessories) is transferred to in-house technicians for repair, re-flashing, and repackaging with generic accessories, targeted for certified refurbished sales at a 35-50% discount; and 'Grade D' (Salvage / Damaged Beyond Economical Repair) is sorted into bulk gaylord pallets and sold to B2B liquidation brokers for pennies on the dollar (5-10% of retail) or sent to certified e-waste recycling facilities.",
        
        "The economic efficiency of a reverse logistics operation is measured by its Restocking Velocity and Landed Recovery Yield. High-performing e-commerce operators maintain a Grade A restock velocity under forty-eight hours from dock receipt, ensuring that returned merchandise is relisted online before seasonal demand fades. Furthermore, integrating warehouse management systems (WMS) directly with secondary liquidation auction platforms (such as B-Stock or eBay Enterprise) enables brands to auction salvage lots programmatically, maximizing salvage cash recovery without cannibalizing prime retail sales.",
        
        "In our Python model for Part 3, we simulate the inspection and grading triage of a ten-thousand-unit returns batch across consumer electronics and fashion apparel. The algorithm distributes units across Grade A, Open Box, Refurbished, and Salvage tiers, computes refurbishment labor and testing costs, and calculates the net recovered inventory capital and overall salvage realization percentage. Review the deterministic code below."
    ]

    p3_code = '''def model_warehouse_restocking_and_grading(
    total_returned_units: int,
    original_retail_value_per_unit: float,
    grading_distribution: dict
) -> dict:
    """
    Models physical warehouse inspection, grading triage, refurbishment costs,
    and net recovered inventory value across Grade A, B, C, and Salvage tiers.
    """
    total_original_value = total_returned_units * original_retail_value_per_unit
    
    tier_results = {}
    total_net_recovery_usd = 0.0
    total_refurb_labor_usd = 0.0
    
    for tier, data in grading_distribution.items():
        units_in_tier = int(total_returned_units * data['share_pct'])
        resale_price_per_unit = original_retail_value_per_unit * data['resale_realization_pct']
        gross_resale_value = units_in_tier * resale_price_per_unit
        
        refurb_labor_cost = units_in_tier * data['labor_cost_per_unit']
        net_recovered_value = gross_resale_value - refurb_labor_cost
        
        total_refurb_labor_usd += refurb_labor_cost
        total_net_recovery_usd += net_recovered_value
        
        tier_results[tier] = {
            "units": units_in_tier,
            "resale_price_usd": round(resale_price_per_unit, 2),
            "gross_resale_usd": round(gross_resale_value, 2),
            "refurb_cost_usd": round(refurb_labor_cost, 2),
            "net_recovered_usd": round(net_recovered_value, 2)
        }
        
    overall_recovery_yield_pct = (total_net_recovery_usd / total_original_value) * 100.0
    
    return {
        "total_units_inspected": total_returned_units,
        "total_original_value_usd": round(total_original_value, 2),
        "total_refurb_labor_usd": round(total_refurb_labor_usd, 2),
        "total_net_recovery_usd": round(total_net_recovery_usd, 2),
        "overall_recovery_yield_pct": round(overall_recovery_yield_pct, 2),
        "tiers": tier_results
    }

# Distribution parameters for Consumer Electronics returns
electronics_grading = {
    'Grade_A_Pristine_Restock': {'share_pct': 0.50, 'resale_realization_pct': 1.00, 'labor_cost_per_unit': 2.50},
    'Grade_B_Open_Box':         {'share_pct': 0.25, 'resale_realization_pct': 0.80, 'labor_cost_per_unit': 5.00},
    'Grade_C_Refurbished':      {'share_pct': 0.15, 'resale_realization_pct': 0.55, 'labor_cost_per_unit': 14.00},
    'Grade_D_Salvage_Liquidation': {'share_pct': 0.10, 'resale_realization_pct': 0.10, 'labor_cost_per_unit': 1.00}
}

audit_summary = model_warehouse_restocking_and_grading(
    total_returned_units=5000,
    original_retail_value_per_unit=120.0,
    grading_distribution=electronics_grading
)

print(f"Total Returned Units Inspected: {audit_summary['total_units_inspected']}")
print(f"Total Original Retail Value: ${audit_summary['total_original_value_usd']:,.2f}")
print(f"Inspection & Refurbishment Cost: ${audit_summary['total_refurb_labor_usd']:,.2f}")
print(f"Total Net Recovered Capital: ${audit_summary['total_net_recovery_usd']:,.2f}")
print(f"Blended Inventory Recovery Yield: {audit_summary['overall_recovery_yield_pct']}%")
print(f"Grade A Units Restocked at 100%: {audit_summary['tiers']['Grade_A_Pristine_Restock']['units']} units (${audit_summary['tiers']['Grade_A_Pristine_Restock']['net_recovered_usd']:,.2f})")
print(f"Grade C Units Refurbished: {audit_summary['tiers']['Grade_C_Refurbished']['units']} units (${audit_summary['tiers']['Grade_C_Refurbished']['net_recovered_usd']:,.2f})")'''

    p3_output = """Total Returned Units Inspected: 5000
Total Original Retail Value: $600,000.00
Inspection & Refurbishment Cost: $23,500.00
Total Net Recovered Capital: $452,000.00
Blended Inventory Recovery Yield: 75.33%
Grade A Units Restocked at 100%: 2500 units ($293,750.00)
Grade C Units Refurbished: 750 units ($39,000.00)"""

    p3_check = {
        "question": "In warehouse reverse logistics triage, what distinguishes Grade A restocked units from Grade B Open Box inventory?",
        "options": [
            "Grade A items require complete PCB board replacements and soldering",
            "Grade A units retain pristine original packaging and appearance, enabling re-shelving at 100% full retail price without open-box disclosures",
            "Grade A units are liquidated in bulk gaylord containers to external brokers",
            "Grade A items cannot be sold under standard manufacturer warranties"
        ],
        "answer": 1,
        "why": "Grade A merchandise satisfies pristine cosmetic and packaging standards, allowing the retailer to restock the unit into forward prime inventory at 100% full retail value, whereas Grade B open-box items must be discounted."
    }

    p3_example = "Best Buy operates specialized regional Geek Squad return and repair centers where thousands of returned laptops and televisions are diagnostically scanned, wiped to DOD data sanitization standards, repackaged in certified open-box packaging, and relisted on BestBuy.com at an 85% recovery yield. This systematic refurbishment infrastructure recovers over $300 million annually in inventory value."
    p3_tryit = "Increase Grade C Refurbished labor cost from $14.00 to $25.00 per unit to simulate complex electronic micro-soldering. Observe how net recovered capital decreases and recalculate the revised blended recovery yield."
    p3_notes = [
        "License Plate Number (LPN) barcodes attach to returned items at dock doors, creating complete traceability through inspection.",
        "Grading triage channels items into Grade A (100% retail), Grade B Open Box (80%), Grade C Refurbished (55%), and Salvage Liquidation (10%).",
        "Refurbishment labor must be measured against expected secondary market resale realization to avoid over-investing in low-recovery products.",
        "Rapid restock velocity (under 48 hours) prevents seasonal markdown depreciation and restores active SKU availability."
    ]

    parts.append({
        "title": "Warehouse Restocking Inspection, Grading & Secondary Liquidation",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "check": p3_check,
        "example": p3_example,
        "tryIt": p3_tryit,
        "codeNotes": p3_notes
    })

    # Part 4: Return Fraud, Wardrobing & Anti-Abuse Forensics
    p4_say = [
        "In Part 4, we examine the dark side of consumer behavior in digital commerce: Return Fraud, Wardrobing, and Anti-Abuse Engineering. Industry research published by the National Retail Federation (NRF) reveals that fraudulent and abusive returns account for ten to fourteen percent of all e-commerce returns, costing retailers tens of billions of dollars annually. As e-commerce platforms competed fiercely on customer convenience by offering free shipping, no-questions-asked thirty-day return windows, and instant refunds upon carrier scan, organized fraud rings and dishonest shoppers systematically exploited these operational loopholes.",
        
        "The most prevalent return abuse vectors include: First, 'Wardrobing' or Free Renting—where a consumer purchases high-ticket designer apparel, formal evening wear, or luxury electronics for a specific event (such as a wedding, photoshoot, or Super Bowl party), hides the price tags or uses tag-reattaching guns, and returns the used item on Monday for a full refund; Second, 'Brick-in-the-Box' or Phantom Returns—where the fraudster returns a package matching the exact expected parcel weight, but fills the interior with gravel, dirt, or old phone books, relying on the carrier origin scan to trigger an automated refund before the parcel reaches the warehouse; Third, 'Counterfeit Swapping'—where an authentic luxury handbag, designer sneaker, or high-end graphics card is purchased, replaced with a sophisticated Chinese replica, and returned while the authentic item is resold on gray markets; and Fourth, 'Serial Number Mismatch'—returning a burnt-out or broken electronic device using the serial box of a newly purchased unit.",
        
        "To combat these sophisticated threats without alienating legitimate loyal shoppers, enterprise e-commerce platforms deploy multi-layered Anti-Fraud Forensic Protocols. At the physical level, brands attach tamper-evident, brightly colored security tags ('360 ID Tags') in prominent visible locations on garments or luxury accessories. These tags cannot be concealed or reattached once severed; return policies explicitly state that returns are void if the security ribbon is removed. In warehouse intake, automated optical scales weigh parcels dynamically and cross-reference gross measured weight against the known master SKU tare weight down to the single gram. If an incoming return displays a weight discrepancy exceeding three percent, the system immediately diverts the parcel to a forensic inspection lane equipped with high-definition video recording docks.",
        
        "At the algorithmic level, digital platforms maintain persistent Customer Return Velocity Scores. Machine learning classifiers analyze consumer transaction histories across multiple behavioral dimensions: return frequency percentage, time elapsed between delivery and return initiation, category skew towards high-risk wardrobing goods, and discrepancy history. When an account exceeds risk thresholds, the system dynamically alters the checkout and RMA experience: disabling free return shipping, requiring physical photo uploads during RMA creation, and delaying refund settlement until physical warehouse inspection and serial number validation are complete.",
        
        "In our Python model for Part 4, we build an automated Return Fraud Detection & Forensic Audit Engine. The algorithm evaluates incoming return packages by cross-referencing expected master SKU weights, inspecting serial number hash parity, checking tamper-evident tag integrity, and computing customer behavioral risk scores. It categorizes returns as 'CLEARED_FOR_INSTANT_REFUND', 'DIVERTED_TO_WEIGHT_AUDIT', or 'QUARANTINED_FRAUD_INVESTIGATION'. Review the code below."
    ]

    p4_code = '''def audit_return_fraud_and_tampering(
    expected_sku_weight_grams: float,
    actual_parcel_weight_grams: float,
    serial_number_match: bool,
    tamper_tag_intact: bool,
    customer_return_frequency_pct: float,
    item_retail_price_usd: float
) -> dict:
    """
    Forensic anti-abuse engine analyzing parcel weight discrepancies,
    serial number integrity, tamper-evident security tags, and customer risk.
    """
    weight_variance_pct = abs(actual_parcel_weight_grams - expected_sku_weight_grams) / expected_sku_weight_grams
    
    # Critical Fraud Indicators
    fraud_flags = []
    
    if not serial_number_match:
        fraud_flags.append("SERIAL_NUMBER_MISMATCH_SUSPECT_SWAP")
        
    if not tamper_tag_intact:
        fraud_flags.append("SECURITY_TAMPER_TAG_SEVERED_WARDROBING_SUSPECT")
        
    if weight_variance_pct > 0.05: # > 5% weight variance
        fraud_flags.append(f"WEIGHT_DISCREPANCY_{weight_variance_pct*100:.1f}_PCT")
        
    if customer_return_frequency_pct > 0.50:
        fraud_flags.append("CHRONIC_HIGH_RETURN_VELOCITY_ACCOUNT")
        
    # Decision Logic
    if "SERIAL_NUMBER_MISMATCH_SUSPECT_SWAP" in fraud_flags or "SECURITY_TAMPER_TAG_SEVERED_WARDROBING_SUSPECT" in fraud_flags:
        disposition = "QUARANTINED_FRAUD_INVESTIGATION"
        action = "Hold refund. Escalate to loss prevention team with dock video recording."
        refund_approved = False
    elif "WEIGHT_DISCREPANCY_" in str(fraud_flags):
        disposition = "DIVERTED_TO_FORENSIC_MANUAL_INSPECTION"
        action = "Physical box unbagging and contents verification required prior to refund."
        refund_approved = False
    elif customer_return_frequency_pct > 0.50 and item_retail_price_usd > 100.0:
        disposition = "HELD_FOR_STANDARD_RECEIVING_AUDIT"
        action = "Disable carrier-scan instant refund; settle upon physical dock check."
        refund_approved = False
    else:
        disposition = "CLEARED_FOR_INSTANT_SETTLEMENT"
        action = "All forensic checks passed. Release customer refund immediately."
        refund_approved = True
        
    return {
        "disposition": disposition,
        "refund_approved": refund_approved,
        "action_taken": action,
        "weight_variance_pct": round(weight_variance_pct * 100.0, 2),
        "fraud_flags_detected": fraud_flags
    }

# Test Cases
# Scenario A: Legitimate returning customer with minor packaging variation
res_a = audit_return_fraud_and_tampering(
    expected_sku_weight_grams=850.0,
    actual_parcel_weight_grams=858.0,
    serial_number_match=True,
    tamper_tag_intact=True,
    customer_return_frequency_pct=0.15,
    item_retail_price_usd=80.0
)

# Scenario B: High-end graphics card with serial mismatch (suspected swap)
res_b = audit_return_fraud_and_tampering(
    expected_sku_weight_grams=1400.0,
    actual_parcel_weight_grams=1395.0,
    serial_number_match=False,
    tamper_tag_intact=True,
    customer_return_frequency_pct=0.20,
    item_retail_price_usd=799.0
)

# Scenario C: Designer evening gown with severed security tag (wardrobing)
res_c = audit_return_fraud_and_tampering(
    expected_sku_weight_grams=450.0,
    actual_parcel_weight_grams=448.0,
    serial_number_match=True,
    tamper_tag_intact=False,
    customer_return_frequency_pct=0.55,
    item_retail_price_usd=420.0
)

print(f"Scenario A (Legitimate): {res_a['disposition']} (Refund: {res_a['refund_approved']})")
print(f"Scenario B (GPU Swap):    {res_b['disposition']} | Flags: {res_b['fraud_flags_detected']}")
print(f"Scenario C (Wardrobing):  {res_c['disposition']} | Flags: {res_c['fraud_flags_detected']}")'''

    p4_output = """Scenario A (Legitimate): CLEARED_FOR_INSTANT_SETTLEMENT (Refund: True)
Scenario B (GPU Swap):    QUARANTINED_FRAUD_INVESTIGATION | Flags: ['SERIAL_NUMBER_MISMATCH_SUSPECT_SWAP']
Scenario C (Wardrobing):  QUARANTINED_FRAUD_INVESTIGATION | Flags: ['SECURITY_TAMPER_TAG_SEVERED_WARDROBING_SUSPECT', 'CHRONIC_HIGH_RETURN_VELOCITY_ACCOUNT']"""

    p4_check = {
        "question": "How do enterprise e-commerce apparel brands prevent 'wardrobing' (free renting for events) without eliminating returns for legitimate customers?",
        "options": [
            "By charging a 50% non-refundable deposit on all orders across the storefront",
            "By deploying prominent, tamper-evident security tags that void returns if cut, combined with algorithmic return velocity scoring",
            "By replacing all human clothing models with 3D virtual avatars",
            "By prohibiting returns on any apparel orders placed on weekends"
        ],
        "answer": 1,
        "why": "Prominently placed tamper-evident security tags cannot be concealed or reattached after wearing an item to an event. If the tag is removed, the return is void, halting wardrobing while preserving legitimate returns."
    }

    p4_example = "Nordstrom and Bloomingdale's attached high-visibility 3-inch black security tags to formal evening gowns and luxury designer dresses. If the tag is removed, the return is immediately disqualified. This forensic measure reduced wardrobing fraud by 62% in luxury evening categories without reducing sales conversion among legitimate high-net-worth shoppers."
    p4_tryit = "Modify the actual_parcel_weight_grams in Scenario A to 600.0 grams to simulate a phantom return where packaging contents were removed. Note how the engine automatically flags the weight discrepancy and blocks instant settlement."
    p4_notes = [
        "Return fraud and wardrobing account for 10-14% of all digital returns, inflicting billions in losses across retail.",
        "Phantom returns and counterfeit swaps are detected through micro-gram parcel weight validation and serial number parity.",
        "Tamper-evident security tags protect high-ticket apparel from single-use event wear and fraudulent weekend renting.",
        "Algorithmic risk scoring disables instant carrier-scan refunds for accounts exhibiting chronic return abuse (>50%)."
    ]

    parts.append({
        "title": "Return Fraud, Wardrobing & Anti-Abuse Forensics",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "check": p4_check,
        "example": p4_example,
        "tryIt": p4_tryit,
        "codeNotes": p4_notes
    })

    # Part 5: Enterprise Reverse Logistics & Restocking Optimization Gateway
    p5_say = [
        "In the final capstone component of Day 11, we synthesize our technical and economic models into the unified Enterprise Reverse Logistics and Restocking Optimization Gateway. In a multi-billion dollar omnichannel retail organization, reverse supply chain operations cannot operate in isolated departmental silos. Customer care portals, carrier tracking webhooks, warehouse receiving sorters, forensic inspection docks, and secondary liquidation channels must synchronize in real time through an event-driven command gateway.",
        
        "The Enterprise Gateway orchestrates four high-stakes operational mandates: First, Dynamic Routing Allocation—determining whether an inbound return should be routed back to the regional fulfillment center for immediate forward restocking, diverted to a centralized specialized refurbishment depot, or instructed for local store drop-off; Second, Cash Flow Settlement Synchronization—balancing customer satisfaction against fraud risk by orchestrating instant store credit issuance, carrier-scan settlement for low-risk VIP customers, or deferred inspection settlement for high-value electronics; Third, Continuous Vendor Accountability—tracking manufacturing defect return rates by supplier SKU and automatically generating chargeback debit notes against third-party vendors whose defective items exceed contractual quality thresholds; and Fourth, Circular Economy Asset Maximization—channeling unsellable products into sustainable B2B recommerce, recycling, or charitable tax-deduction pipelines.",
        
        "To achieve peak operational efficiency, the Gateway calculates the Closed-Loop Efficiency Ratio (CLER). This executive metric measures the proportion of returned merchandise value successfully recovered through Grade A restock, certified refurbishment, and organized liquidation after deducting all freight, handling, and labor costs: CLER = (Net Recovered Resale Value - Total Reverse Operational Expenses) / Total Original Returned Merchandise Value. A CLER exceeding sixty-five percent indicates an institutional-grade reverse supply chain capable of turning an operational liability into a profitable, sustainable asset recovery flywheel.",
        
        "Furthermore, by feeding granular return reason analytics (such as 'Sleeves Too Tight' or 'Battery Overheats') back into product engineering, sizing charts, and digital merchandising teams, the Gateway closes the feedback loop. This predictive intelligence enables merchant teams to adjust sizing guidance on Product Detail Pages, preventing return creation before the customer even submits their cart order.",
        
        "In our final Python simulation for Day 11, we execute an end-to-end Enterprise Reverse Logistics Gateway. The engine processes a cohort of one thousand diverse return events, executing policy gatekeeping, routing optimization, inspection grading, forensic abuse screening, and financial settlement. It outputs the consolidated executive reverse logistics P&L, showing total gross returned value, carrier freight, warehouse labor, fraud mitigation savings, net recovered cash, and the final Closed-Loop Efficiency Ratio. Review the complete institutional implementation below."
    ]

    p5_code = '''def run_enterprise_reverse_logistics_gateway(
    return_events: list
) -> dict:
    """
    Enterprise Reverse Logistics Gateway orchestrating gatekeeping,
    fraud detection, inspection grading, and net capital recovery.
    """
    total_returns_received = len(return_events)
    gross_returned_value = 0.0
    total_freight_incurred = 0.0
    total_inspection_labor = 0.0
    total_fraud_blocked_usd = 0.0
    total_net_recovered_capital = 0.0
    
    status_counts = {
        "CLEARED_GRADE_A_RESTOCK": 0,
        "REFURBISHED_GRADE_B_C": 0,
        "RETURNLESS_REFUND": 0,
        "FRAUD_QUARANTINED": 0,
        "LIQUIDATED_SALVAGE": 0
    }
    
    for event in return_events:
        item_val = event['retail_price']
        gross_returned_value += item_val
        
        # Fraud check
        if event.get('serial_mismatch', False) or event.get('tamper_tag_cut', False):
            status_counts["FRAUD_QUARANTINED"] += 1
            total_fraud_blocked_usd += item_val
            continue
            
        # Returnless refund check
        if event.get('returnless_eligible', False):
            status_counts["RETURNLESS_REFUND"] += 1
            continue
            
        # Incur freight & handling for authorized returns
        freight = event.get('reverse_freight', 7.50)
        labor = event.get('inspection_labor', 3.50)
        total_freight_incurred += freight
        total_inspection_labor += labor
        
        grade = event.get('grade', 'Grade_A')
        if grade == 'Grade_A':
            status_counts["CLEARED_GRADE_A_RESTOCK"] += 1
            net_recovered = item_val * 1.00 - labor
        elif grade in ['Grade_B', 'Grade_C']:
            status_counts["REFURBISHED_GRADE_B_C"] += 1
            realization = 0.70 if grade == 'Grade_B' else 0.50
            net_recovered = item_val * realization - labor
        else:
            status_counts["LIQUIDATED_SALVAGE"] += 1
            net_recovered = item_val * 0.10 - labor
            
        total_net_recovered_capital += max(0.0, net_recovered)
        
    total_operational_expense = total_freight_incurred + total_inspection_labor
    net_realized_economic_recovery = total_net_recovered_capital - total_freight_incurred
    cler_pct = (net_realized_economic_recovery / gross_returned_value) * 100.0 if gross_returned_value > 0 else 0.0
    
    return {
        "total_returns_received": total_returns_received,
        "gross_returned_value_usd": round(gross_returned_value, 2),
        "total_freight_incurred_usd": round(total_freight_incurred, 2),
        "total_inspection_labor_usd": round(total_inspection_labor, 2),
        "total_operational_expense_usd": round(total_operational_expense, 2),
        "total_fraud_blocked_usd": round(total_fraud_blocked_usd, 2),
        "total_net_recovered_capital_usd": round(total_net_recovered_capital, 2),
        "net_realized_economic_recovery_usd": round(net_realized_economic_recovery, 2),
        "closed_loop_efficiency_ratio_pct": round(cler_pct, 2),
        "status_distribution": status_counts
    }

# Synthetic cohort of 1,000 return events
import random
random.seed(42)

cohort = []
for i in range(1000):
    val = random.choice([45.0, 85.0, 150.0, 220.0, 18.0])
    is_fraud = (random.random() < 0.04)
    is_returnless = (val <= 20.0 and not is_fraud)
    
    if is_fraud:
        event = {'retail_price': val, 'serial_mismatch': True}
    elif is_returnless:
        event = {'retail_price': val, 'returnless_eligible': True}
    else:
        g = random.choices(['Grade_A', 'Grade_B', 'Grade_C', 'Grade_D'], weights=[0.55, 0.25, 0.12, 0.08])[0]
        event = {
            'retail_price': val,
            'grade': g,
            'reverse_freight': 7.50,
            'inspection_labor': 3.50
        }
    cohort.append(event)

gateway_results = run_enterprise_reverse_logistics_gateway(cohort)

print("=== ENTERPRISE REVERSE LOGISTICS CONTROL GATEWAY ===")
print(f"Total Returns Processed: {gateway_results['total_returns_received']}")
print(f"Gross Returned Merchandise Value: ${gateway_results['gross_returned_value_usd']:,.2f}")
print(f"Total Reverse Operational Overhead: ${gateway_results['total_operational_expense_usd']:,.2f}")
print(f"Fraudulent Returns Blocked: ${gateway_results['total_fraud_blocked_usd']:,.2f}")
print(f"Net Recovered Inventory Capital: ${gateway_results['total_net_recovered_capital_usd']:,.2f}")
print(f"Net Realized Economic Recovery: ${gateway_results['net_realized_economic_recovery_usd']:,.2f}")
print(f"Closed-Loop Efficiency Ratio (CLER): {gateway_results['closed_loop_efficiency_ratio_pct']}%")
print(f"Disposition Distribution: {gateway_results['status_distribution']}")'''

    p5_output = """=== ENTERPRISE REVERSE LOGISTICS CONTROL GATEWAY ===
Total Returns Processed: 1000
Gross Returned Merchandise Value: $105,152.00
Total Reverse Operational Overhead: $8,437.00
Fraudulent Returns Blocked: $3,558.00
Net Recovered Inventory Capital: $74,268.00
Net Realized Economic Recovery: $68,515.50
Closed-Loop Efficiency Ratio (CLER): 65.16%
Disposition Distribution: {'CLEARED_GRADE_A_RESTOCK': 406, 'REFURBISHED_GRADE_B_C': 293, 'RETURNLESS_REFUND': 193, 'FRAUD_QUARANTINED': 40, 'LIQUIDATED_SALVAGE': 68}"""

    p5_check = {
        "question": "What does a Closed-Loop Efficiency Ratio (CLER) of 65.16% indicate to an e-commerce executive?",
        "options": [
            "That 65.16% of all orders placed on the website are returned by consumers",
            "That after paying all reverse freight and inspection labor, the enterprise successfully recovers 65.16% of original returned merchandise value through restock, refurbishment, and liquidation",
            "That the company loses 65.16% of its gross merchandise profit to delivery couriers",
            "That customer support satisfaction scores have declined by 65.16%"
        ],
        "answer": 1,
        "why": "CLER measures net economic recovery relative to original returned value. A CLER of 65.16% means over sixty-five cents of every returned merchandise dollar is preserved and reinvested after deducting reverse logistics operational costs."
    }

    p5_example = "Shopify Plus and Narvar integrated automated reverse logistics hubs for Gymshark, enabling automated local carrier drop-offs, dynamic size exchanges, and real-time WMS intake. The unified reverse command architecture increased Gymshark's Grade A restock velocity by 40% and lifted net capital recovery to 68%."
    p5_tryit = "Evaluate the effect of eliminating fraud by setting is_fraud probability to 0.0. Observe the recovery of the previously blocked merchandise value into legitimate liquidation or restock channels."
    p5_notes = [
        "The Enterprise Reverse Logistics Gateway unifies RMA validation, carrier drop-off, WMS inspection, and recommerce.",
        "Closed-Loop Efficiency Ratio (CLER) benchmarks net recovered resale capital against total returned merchandise value.",
        "Supplier SKU return telemetry informs merchandising and design teams to correct chronic product flaws and inaccurate sizing tables.",
        "Automating secondary recommerce through B2B liquidation auction channels prevents stranded inventory from writing down to zero."
    ]

    parts.append({
        "title": "Enterprise Reverse Logistics & Restocking Optimization Gateway",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "check": p5_check,
        "example": p5_example,
        "tryIt": p5_tryit,
        "codeNotes": p5_notes
    })

    day11_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 11,
        "title": "Reverse Logistics & Returns Management: Automated RMA & Restocking Inspection",
        "goal": "Master reverse supply chain economics and returns engineering: category return rate dynamics, automated RMA finite state machine gatekeeping, physical warehouse restocking inspection and LPN triage, and forensic anti-abuse wardrobing defense.",
        "minutes": 35,
        "recap": "Welcome to Day 11 of E-Commerce & Marketplace Economics. Today we analyzed reverse logistics margin erosion across product categories, engineered automated RMA state machines with returnless refund rules, executed warehouse inspection and LPN triage, and implemented forensic fraud defense protocols.",
        "parts": parts,
        "summary": [
            "Category return rates range from 2% in groceries to over 30% in apparel, eroding gross profit margins without rigorous gatekeeping.",
            "Automated RMA finite state machines validate return eligibility and grant instant returnless refunds for low-value SKUs.",
            "Physical warehouse returns processing utilizes License Plate Numbers (LPN) to triage restockable Grade A inventory from refurbished goods.",
            "Forensic anti-abuse telemetry protects retailers against wardrobing, empty box claims, and fraudulent serial number substitutions.",
            "The Closed-Loop Efficiency Ratio (CLER) quantifies net recovered resale value relative to original returned merchandise value."
        ]
    }

    total_words = ensure_ecom_day_budget(day11_dict, min_part_words=580, min_day_words=2950)
    return day11_dict, total_words

if __name__ == '__main__':
    d, words = build_day11()
    print(f"Day 11 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
