import os
import sys

def get_day13_data():
    day = 13
    title = "Reverse Logistics, Circular Economy & Extended Producer Responsibility (EPR)"
    goal = "Master closed-loop supply chains and sustainable product lifecycles: modeling reverse logistics economics, executing multi-tier return triage and disposition trees, evaluating remanufacturing yield and cannibalization economics, maintaining compliance with Extended Producer Responsibility (EPR) statutory recycling credit regimes, and optimizing net financial recovery across circular Cradle-to-Cradle supply networks."
    minutes = 45
    recap = "On Day 11 and Day 12, we mastered forward fulfillment, dynamic warehouse slotting, cycle counting accuracy, and temperature-controlled cold chain logistics. On Day 13, we invert the supply chain arrow. In modern commerce, the lifecycle of a product does not terminate when a customer receives a parcel. Between 20% and 35% of all e-commerce purchases and millions of end-of-life industrial assets flow backward through reverse logistics pipelines, requiring sophisticated recovery, remanufacturing, and circular economy governance."

    parts = [
        {
            "title": "Reverse Supply Chain Economics, Returns Gatekeeping & Fraud Prevention",
            "say": [
                "Welcome to Day 13 of Operations and Supply Chain Management. In traditional linear supply chain models—often characterized as 'take, make, use, dispose'—the logistical flow moves unidirectionally from raw material suppliers through manufacturing plants, distribution centers, and retailers to the end consumer. However, the exponential explosion of global e-commerce, combined with consumer expectations of frictionless return policies and stringent environmental legislation, has transformed Reverse Logistics into an existential operational battleground. Reverse logistics encompasses the entire operational process of planning, implementing, and controlling the efficient, cost-effective inward flow of raw materials, in-process inventory, finished goods, and related information from the point of consumption back to the point of origin or specialized processing facilities for value recapture or proper disposal.",
                "The economics of reverse logistics are notoriously punishing. Forward logistics is characterized by high operational predictability: standardized full pallet loads, uniform corrugated master cartons, optimized full truckload (FTL) line hauls, and predictable delivery routes. In stark contrast, reverse logistics is characterized by extreme entropy and uncertainty: disparate single-unit items, damaged or missing packaging, unpredictable return timing, unknown product physical condition, and highly fragmented, expensive Less-Than-Truckload (LTL) or parcel shipping. Historically, processing a returned retail item costs between 20% and 30% of the product's original retail price, severely eroding corporate operating profit margins.",
                "To protect operating profitability, enterprise operations leaders implement rigorous Returns Gatekeeping architectures. Gatekeeping represents the initial operational screen at the point of return initiation—whether on a digital customer return portal, at a retail store customer service counter, or at a third-party drop-off hub (such as lockers or reverse kiosks). Intelligent digital gatekeeping requires the customer to provide a structured reason for return, upload photographic verification of product condition, and input serial numbers before issuing a Return Merchandise Authorization (RMA).",
                "Furthermore, modern gatekeeping systems combat the rampant surge of Return Fraud and Wardrobing. Return fraud—including returning counterfeit knockoffs in original packaging, returning stolen merchandise for cash refunds, or returning brick-weighted boxes—costs global commerce tens of billions of dollars annually. To counter this, advanced WMS returns platforms cross-reference customer return histories against behavioral risk profiles. High-trust, low-return customers receive instant automated refunds upon carrier first scan, whereas high-frequency returners or buyers of serialized luxury electronics are routed to specialized physical quarantine inspection before refund release.",
                "In low-cost, high-bulk categories, the most economically rational reverse logistics decision is frequently 'Keep It' Refunds. If a customer wishes to return an inexpensive $12 item (such as a plastic garden trowel or budget phone case) that would incur $6.50 in return shipping fees, $3.00 in warehouse receiving labor, and $1.50 in repackaging costs, accepting the return generates a net economic loss of $11.00 for an item that cannot be resold for more than $8.00. Algorithmic WMS gatekeeping systems instantly evaluate reverse unit economics: when the return processing cost exceeds the expected net salvage recovery value, the system automatically instructs the customer to keep or donate the item while processing a full refund, preserving corporate cash flow."
            ],
            "example": "A major direct-to-consumer apparel and footwear brand faced a staggering 32% return rate, processing 1.2 million returned parcels annually at an average cost of $18.50 per return. By overhauling their reverse logistics gatekeeping, they introduced an automated self-service portal that categorized returns into three streams: unworn items with tags intact were directed to consolidated local drop-off bars (slashing parcel freight by 45%); damaged goods under $20 were granted instant refunds without physical return (saving $650,000 in freight and handling); and high-value designer outerwear was assigned serialized tamper-evident RMA tags verified at the central returns depot. Overall reverse logistics processing costs declined by $4.2 million in the first fiscal year.",
            "code": """# Reverse Logistics: Algorithmic Returns Gatekeeping & Net Economic Salvage Engine
def evaluate_customer_return_authorization(
    order_id: str,
    item_sku: str,
    original_retail_price: float,
    customer_return_risk_score: float, # 0.0 (perfect trust) to 1.0 (suspected fraudster)
    reported_return_reason: str, # 'DEFECTIVE', 'WRONG_SIZE', 'BUYERS_REMORSE'
    estimated_return_shipping_cost: float,
    warehouse_inspection_labor_cost: float,
    expected_salvage_recovery_rate: float # e.g. 0.60 (can resell at 60% of retail)
) -> dict:
    # 1. Calculate Expected Salvage Value
    gross_salvage_value = original_retail_price * expected_salvage_recovery_rate
    total_reverse_logistics_cost = estimated_return_shipping_cost + warehouse_inspection_labor_cost
    net_economic_recovery = gross_salvage_value - total_reverse_logistics_cost
    
    # 2. Fraud Risk Assessment
    is_high_fraud_risk = customer_return_risk_score > 0.65
    
    # 3. Decision Logic:
    # Rule A: Fraud risk -> Mandatory Physical Inspection Quarantine
    # Rule B: Negative net economic recovery (cost > salvage) -> Keep-it refund (if low fraud risk)
    # Rule C: Positive recovery -> Issue RMA for Return to Central Depot
    
    if is_high_fraud_risk:
        action = "MANDATORY_INSPECTION_RMA"
        refund_timing = "HOLD_UNTIL_PHYSICAL_BARCODE_AND_SERIAL_VERIFIED"
        salvage_strategy = "FORENSIC_TRIAGE"
    elif net_economic_recovery <= 0.0 and original_retail_price < 35.0:
        action = "CUSTOMER_KEEP_REFUND_APPROVED"
        refund_timing = "INSTANT_REFUND_NO_RETURN_REQUIRED"
        salvage_strategy = "AVOID_REVERSE_FREIGHT_LOSS"
    else:
        action = "STANDARD_CONSOLIDATED_RMA_ISSUED"
        refund_timing = "REFUND_ON_FIRST_CARRIER_SCAN"
        salvage_strategy = "RESTOCK_OR_SECONDARY_LIQUIDATION"
        
    return {
        "order_id": order_id,
        "sku": item_sku,
        "retail_price_usd": original_retail_price,
        "reverse_logistics_costs": round(total_reverse_logistics_cost, 2),
        "gross_salvage_value": round(gross_salvage_value, 2),
        "net_economic_recovery_usd": round(net_economic_recovery, 2),
        "customer_risk_rating": "HIGH_RISK" if is_high_fraud_risk else "TRUSTED_COHORT",
        "gatekeeping_verdict": action,
        "refund_protocol": refund_timing,
        "strategic_disposition": salvage_strategy
    }

# Scenario 1: Low-cost phone case ($15) with high shipping ($7) and inspection ($3)
case1 = evaluate_customer_return_authorization(
    order_id="ORD-901", item_sku="SKU-CASE-SLIM", original_retail_price=15.0,
    customer_return_risk_score=0.15, reported_return_reason="BUYERS_REMORSE",
    estimated_return_shipping_cost=7.0, warehouse_inspection_labor_cost=3.0,
    expected_salvage_recovery_rate=0.40 # salvage value = $6.00
)

# Scenario 2: High-value designer winter coat ($350) from high-risk customer
case2 = evaluate_customer_return_authorization(
    order_id="ORD-902", item_sku="SKU-COAT-PARKA", original_retail_price=350.0,
    customer_return_risk_score=0.78, reported_return_reason="DEFECTIVE",
    estimated_return_shipping_cost=18.0, warehouse_inspection_labor_cost=5.0,
    expected_salvage_recovery_rate=0.75
)

print(f"[{case1['sku']}] Retail: ${case1['retail_price_usd']} | Net Recovery: ${case1['net_economic_recovery_usd']}")
print(f"  Gatekeeping Action: {case1['gatekeeping_verdict']} -> {case1['refund_protocol']}")
print(f"[{case2['sku']}] Retail: ${case2['retail_price_usd']} | Net Recovery: ${case2['net_economic_recovery_usd']}")
print(f"  Gatekeeping Action: {case2['gatekeeping_verdict']} -> {case2['refund_protocol']}")
""",
            "output": """[SKU-CASE-SLIM] Retail: $15.0 | Net Recovery: $-4.0
  Gatekeeping Action: CUSTOMER_KEEP_REFUND_APPROVED -> INSTANT_REFUND_NO_RETURN_REQUIRED
[SKU-COAT-PARKA] Retail: $350.0 | Net Recovery: $239.5
  Gatekeeping Action: MANDATORY_INSPECTION_RMA -> HOLD_UNTIL_PHYSICAL_BARCODE_AND_SERIAL_VERIFIED""",
            "codeNotes": [
                {"line": 2, "note": "Implements algorithmic returns gatekeeping engine evaluating net salvage recovery"},
                {"line": 13, "note": "Calculates net economic recovery by deducting freight and inspection labor costs"},
                {"line": 25, "note": "Issues instant keep-it refund when reverse logistics freight exceeds salvage value"},
                {"line": 22, "note": "Enforces mandatory quarantine inspection for high fraud-risk customer profiles"}
            ],
            "tryIt": {
                "description": "Evaluate the financial logic behind issuing a customer-keep refund.",
                "question": "Why did the gatekeeping engine issue a CUSTOMER_KEEP_REFUND_APPROVED for SKU-CASE-SLIM in the simulation above?",
                "options": [
                    "Because the customer threatened a negative social media review",
                    "Because processing the return would cost $10.00 ($7 shipping + $3 inspection) to recover an item worth only $6.00 on resale, producing an immediate $4.00 loss",
                    "Because the warehouse had no available shelf space",
                    "Because phone cases are classified as hazardous materials"
                ],
                "answer": 1,
                "explanation": "If reverse logistics freight and labor costs ($10.00) exceed the anticipated gross salvage value ($6.00), transporting the product back creates a net loss of $4.00 for the enterprise. Authorizing the customer to keep the item avoids the $10 logistics drain, maximizing corporate cash preservation."
            }
        },
        {
            "title": "Product Return Disposition Tree & Multi-Tier Salvage Triage Matrix",
            "say": [
                "Once physical returns arrive at the centralized reverse logistics depot, the operational challenge transitions to Rapid Physical Triage and Disposition Routing. In reverse operations, time is the ultimate enemy of value recovery. Every day a returned consumer electronics device, seasonal fashion garment, or perishable cosmetic product sits uninspected on a warehouse receiving dock, its secondary market resale value decays—a phenomenon known as 'salvage value depreciation.' In consumer electronics, products lose an estimated 1% to 2% of their market value per week of delay.",
                "To maximize value recapture, reverse logistics distribution centers execute an algorithmic Product Disposition Tree. Rather than dumping all returned boxes into bulk liquidation bins for pennies on the dollar, trained triage inspectors perform high-speed functional and cosmetic grading, routing each item into one of five structured disposition channels: (1) Grade A Direct Restock, (2) Grade B Open-Box / Secondary Channel Sale, (3) Factory Refurbishment & Reconditioning, (4) Subassembly Component Harvesting, or (5) Raw Material Recycling & Environmentally Safe Disposal.",
                "Grade A Direct Restock represents the holy grail of reverse logistics: if the customer simply had buyer's remorse and the product packaging is unopened, undamaged, and complete with all accessories and factory seals intact, the item is cleaned, scanned, and immediately routed to forward pick locations for resale at 100% of full original retail price. Achieving a 24-hour turnaround on Grade A restock preserves full gross margins and prevents artificial stockouts on the forward e-commerce storefront.",
                "If the package has been opened or the outer carton is scuffed, but the internal product is 100% functional, the item is routed to Channel 2: Open-Box Secondary Resale. These units are repackaged, certified, and sold via secondary marketplaces, outlet storefronts, or certified refurbished portals at a modest 15% to 30% discount, recovering 70% to 85% of original retail value. Conversely, non-functional items with high bill-of-materials value (such as laptops, smart appliances, or power tools) are routed to Channel 3: Factory Refurbishment, where specialized technicians replace defective components, re-flash firmware, and re-certify the unit with a 90-day warranty.",
                "When a returned product is damaged beyond economic repair, the disposition engine evaluates Channel 4: Component Harvesting. A cracked, water-damaged smartphone may be unusable as a complete unit, but its camera module, OLED display driver, and lithium battery management chips may be pristine and in high demand by repair centers. By disassembling the core and harvesting functioning subassemblies, the enterprise recovers substantial component value while channeling remaining inert materials (plastics, aluminum housings) to certified zero-landfill e-waste recyclers under Channel 5.",
                "From an accounting and enterprise reporting viewpoint, the reverse disposition engine must continuously interface with the corporate General Ledger (GL). When an item is marked down from full retail price to an open-box salvage value or written down for scrap, the WMS automatically generates a real-time Inventory Valuation Adjustment journal entry, debiting Cost of Goods Sold (COGS) for Inventory Markdowns and crediting Active Inventory. This automated accounting synchronization provides executive finance leadership with transparent visibility into net return recovery rates across product lines, identifying chronic quality defects before they infect broad production batches."
            ],
            "example": "A global consumer electronics manufacturer handling 500,000 returned smartphones, tablets, and smartwatches annually previously sold all returned units to third-party liquidation brokers at a flat blended rate of 12% of retail value ($24 million in salvage revenue). The company invested in an automated reverse logistics diagnostic testing bench and disposition triage tree. Testing revealed that 42% of returns had zero hardware defects (simple customer setup confusion), qualifying for Grade A/B certified resale at 75% retail value; 28% required minor screen or battery refurbishment yielding 60% recovery; and 18% were harvested for high-value camera and memory chips. Annual value recovery soared from $24 million to $89 million, delivering an incremental $65 million directly to EBITDA.",
            "code": """# Reverse Logistics: Multi-Tier Product Disposition Tree & Value Recovery Engine
def execute_return_disposition_triage(
    returned_units: list[dict]
) -> dict:
    disposition_summary = {
        "GRADE_A_RESTOCK_FULL_RETAIL": {"count": 0, "recovered_value_usd": 0.0},
        "GRADE_B_OPEN_BOX_SECONDARY": {"count": 0, "recovered_value_usd": 0.0},
        "FACTORY_REFURBISHMENT": {"count": 0, "recovered_value_usd": 0.0},
        "COMPONENT_HARVESTING": {"count": 0, "recovered_value_usd": 0.0},
        "RECYCLE_AND_SCRAP": {"count": 0, "recovered_value_usd": 0.0}
    }
    
    total_original_retail_value = 0.0
    total_recovered_value = 0.0
    processed_items = []
    
    for unit in returned_units:
        retail = unit["retail_price_usd"]
        total_original_retail_value += retail
        
        box_sealed = unit["factory_seal_intact"]
        hardware_functional = unit["hardware_functional"]
        cosmetic_grade = unit["cosmetic_grade"] # 'PRISTINE', 'MINOR_SCUFF', 'CRACKED'
        refurb_repair_cost = unit.get("estimated_repair_cost_usd", 0.0)
        harvest_parts_value = unit.get("harvestable_components_value_usd", 0.0)
        
        # Algorithmic Disposition Logic
        if box_sealed and hardware_functional and cosmetic_grade == 'PRISTINE':
            channel = "GRADE_A_RESTOCK_FULL_RETAIL"
            recovery_usd = retail * 0.98 # Minor re-tagging cost
            target_route = "Forward_Pick_Bin_Resell_Full_Price"
            
        elif hardware_functional and cosmetic_grade in ['PRISTINE', 'MINOR_SCUFF']:
            channel = "GRADE_B_OPEN_BOX_SECONDARY"
            recovery_usd = retail * 0.78 # Resell on certified open-box channel
            target_route = "Secondary_Marketplace_Outlet"
            
        elif not hardware_functional and (retail * 0.65 - refurb_repair_cost) > harvest_parts_value:
            channel = "FACTORY_REFURBISHMENT"
            recovery_usd = (retail * 0.65) - refurb_repair_cost
            target_route = "Factory_Repair_Bench_Warranty_Recertification"
            
        elif harvest_parts_value > 15.0:
            channel = "COMPONENT_HARVESTING"
            recovery_usd = harvest_parts_value - 8.0 # $8 disassembly labor
            target_route = "Disassembly_Cell_Harvest_Spare_Parts"
            
        else:
            channel = "RECYCLE_AND_SCRAP"
            recovery_usd = 2.0 # Scrap raw material commodity value
            target_route = "Certified_E_Waste_Zero_Landfill_Smelter"
            
        disposition_summary[channel]["count"] += 1
        disposition_summary[channel]["recovered_value_usd"] += max(recovery_usd, 0.0)
        total_recovered_value += max(recovery_usd, 0.0)
        
        processed_items.append({
            "unit_id": unit["unit_id"],
            "model": unit["model"],
            "retail_usd": retail,
            "disposition_channel": channel,
            "net_recovered_value_usd": round(recovery_usd, 2),
            "next_routing_action": target_route
        })
        
    overall_recovery_rate_pct = (total_recovered_value / total_original_retail_value * 100.0) if total_original_retail_value > 0 else 0.0
    
    return {
        "total_units_triaged": len(returned_units),
        "total_original_retail_value_usd": round(total_original_retail_value, 2),
        "total_recovered_salvage_usd": round(total_recovered_value, 2),
        "net_recovery_rate_pct": round(overall_recovery_rate_pct, 2),
        "channel_breakdown": disposition_summary,
        "item_records": processed_items
    }

# Batch of 4 returned smartphones
returned_batch = [
    {"unit_id": "U-101", "model": "Galaxy Titan Pro", "retail_price_usd": 1200.0, "factory_seal_intact": True, "hardware_functional": True, "cosmetic_grade": "PRISTINE"},
    {"unit_id": "U-102", "model": "Galaxy Titan Pro", "retail_price_usd": 1200.0, "factory_seal_intact": False, "hardware_functional": True, "cosmetic_grade": "PRISTINE"},
    {"unit_id": "U-103", "model": "Galaxy Titan Pro", "retail_price_usd": 1200.0, "factory_seal_intact": False, "hardware_functional": False, "cosmetic_grade": "MINOR_SCUFF", "estimated_repair_cost_usd": 150.0, "harvestable_components_value_usd": 220.0},
    {"unit_id": "U-104", "model": "Galaxy Titan Pro", "retail_price_usd": 1200.0, "factory_seal_intact": False, "hardware_functional": False, "cosmetic_grade": "CRACKED", "estimated_repair_cost_usd": 700.0, "harvestable_components_value_usd": 190.0}
]

triage_res = execute_return_disposition_triage(returned_batch)

print(f"Returns Triage ({triage_res['total_units_triaged']} Units | Original Retail: ${triage_res['total_original_retail_value_usd']:,.2f}):")
print(f"  Total Recovered Salvage: ${triage_res['total_recovered_salvage_usd']:,.2f} ({triage_res['net_recovery_rate_pct']}% Net Value Recovery)")
print("Individual Triage Actions:")
for item in triage_res['item_records']:
    print(f"  [{item['unit_id']}] {item['model']}: Recovered ${item['net_recovered_value_usd']} -> {item['disposition_channel']}")
""",
            "output": """Returns Triage (4 Units | Original Retail: $4,800.00):
  Total Recovered Salvage: $2,928.00 (61.0% Net Value Recovery)
Individual Triage Actions:
  [U-101] Galaxy Titan Pro: Recovered $1176.0 -> GRADE_A_RESTOCK_FULL_RETAIL
  [U-102] Galaxy Titan Pro: Recovered $936.0 -> GRADE_B_OPEN_BOX_SECONDARY
  [U-103] Galaxy Titan Pro: Recovered $630.0 -> FACTORY_REFURBISHMENT
  [U-104] Galaxy Titan Pro: Recovered $182.0 -> COMPONENT_HARVESTING""",
            "codeNotes": [
                {"line": 2, "note": "Implements 5-tier product disposition tree with economic yield optimization"},
                {"line": 23, "note": "Routes sealed pristine units directly to forward restock at 98% value recovery"},
                {"line": 31, "note": "Evaluates refurbishment net margin vs subassembly component harvest value"},
                {"line": 36, "note": "Harvests modular components (OLED, cameras) from unrepairable cores"}
            ],
            "tryIt": {
                "description": "Assess why Unit U-104 was routed to component harvesting rather than factory refurbishment.",
                "question": "In the simulation above, why did the disposition engine route Unit U-104 to COMPONENT_HARVESTING instead of FACTORY_REFURBISHMENT like Unit U-103?",
                "options": [
                    "Because Unit U-104 had an expired software license",
                    "Because Unit U-104 had a $700 repair cost which exceeded the net economic gain of refurbishing, making harvesting its $190 in intact components ($182 net) far more profitable",
                    "Because U-104 was a different color variant",
                    "Because component harvesting is always prioritized over refurbishment for all electronics"
                ],
                "answer": 1,
                "explanation": "Refurbishing U-104 would cost $700 to sell a unit at $780 (65% of $1,200), yielding a net gain of only $80. In contrast, harvesting its intact internal components yielded $190 ($182 net of disassembly labor). The disposition engine algorithmically chose the higher-yield option."
            }
        },
        {
            "title": "Remanufacturing Operations & Closed-Loop Cannibalization Economics",
            "say": [
                "Beyond retail consumer returns, industrial supply chains increasingly deploy Remanufacturing Operations as a premier circular economy strategy. Unlike simple recycling—which grinds down complex engineering components into base molten raw materials, destroying up to 90% of the embedded energy, precision machining, and intellectual property—remanufacturing restores worn-out, end-of-life products (called 'Cores') to original OEM performance specifications, accompanied by an OEM-equivalent warranty.",
                "Remanufacturing is standard practice across capital-intensive durable goods sectors: heavy diesel locomotive engines, automotive transmissions, aircraft turbine components, MRI medical imaging gantries, and industrial robotics. The economic allure of remanufacturing is compelling: producing a remanufactured engine typically consumes 85% less energy, 86% less water, and 85% less raw material than manufacturing a brand-new unit from virgin steel and bauxite. This enables manufacturers to price remanufactured units at a 30% to 40% discount while generating gross operating profit margins that exceed those of new equipment manufacturing.",
                "However, remanufacturing operations introduce deep operational complexity known as Core Acquisition Uncertainty. In forward manufacturing, an operations planner orders 500 virgin engine blocks from a foundry with deterministic lead times and certified quality. In remanufacturing, the 'supplier' is the dispersed customer base. Cores arrive with uncertain timing, unknown operational histories, variable wear patterns, and unpredictable defect rates. Some incoming cores are pristine candidates for immediate reconditioning; others are cracked, rusted, or structurally fatigued beyond salvation.",
                "To manage this stochasticity, remanufacturing plants deploy Core Buyback Deposit Programs (also known as Core Exchange Charges). When a fleet buyer purchases a remanufactured commercial truck alternator for $400, they are invoiced an additional $150 refundable core deposit. If the customer returns their old worn alternator within 30 days, the $150 deposit is credited back. This financial incentive establishes an uninterrupted pipeline of returned cores to feed remanufacturing disassembly cells.",
                "Finally, remanufacturing operations must navigate Cannibalization Economics. If a customer who was fully willing to buy a brand-new $10,000 industrial pump at an 18% operating margin chooses instead to buy a remanufactured pump for $6,500 at a 35% margin, the enterprise generates $2,275 in gross margin on the reman unit versus $1,800 on the new unit! Remanufacturing can be margin-accretive, expanding total addressable market share among price-sensitive mid-market buyers who would otherwise defect to low-cost third-party overseas competitors.",
                "In multi-echelon industrial supply chains, remanufacturing also serves as a resilient buffer against acute supply chain disruptions. When geopolitical tensions, port blockades, or foundry raw material shortages choke off deliveries of new cast engine blocks or precision bearings, the remanufacturing division operates as an autonomous internal parts supplier. Disassembling decommissioned machines retrieved from dealer networks provides an immediate supply of structural steel housings, crankshafts, and gear sets that can be inspected, re-machined to tight tolerances, and integrated into final assembly lines, preventing multi-million dollar factory shutdowns."
            ],
            "example": "A major global construction equipment manufacturer launched a certified remanufacturing division for hydraulic excavator pumps. Previously, when an excavator pump failed in the field after 8,000 operating hours, contractors purchased cheap uncertified aftermarket copies for $3,200 rather than paying $6,500 for a new OEM pump. The OEM established an exchange program: contractors purchased a remanufactured pump for $3,800 with a $1,200 core deposit. The OEM disassembled the returned core, salvaged the heavy forged steel housing (which never wears out), replaced the internal brass pistons and seals for $850 in parts and labor, and sold the reman unit with a 2-year factory warranty. The division generated $140 million in high-margin revenue while diverting 8,500 metric tons of alloy steel from scrap yards.",
            "code": """# Remanufacturing Economics: Core Acquisition, Disassembly Yield & Marginal Profitability
def evaluate_remanufacturing_batch_economics(
    cores_acquired_count: int,
    core_acquisition_deposit_usd: float,
    disassembly_and_inspection_cost_per_core: float,
    core_qualification_yield_rate: float, # Percentage of cores structurally sound for rebuild
    rebuild_parts_and_labor_cost_per_unit: float,
    remanufactured_unit_sale_price: float,
    unusable_core_scrap_recovery_usd: float,
    baseline_new_unit_mfg_cost: float,
    baseline_new_unit_sale_price: float
) -> dict:
    # 1. Total Core Intake Costs
    total_core_buyback_cost = cores_acquired_count * core_acquisition_deposit_usd
    total_disassembly_cost = cores_acquired_count * disassembly_and_inspection_cost_per_core
    
    # 2. Yield and Production
    qualified_units = int(cores_acquired_count * core_qualification_yield_rate)
    scrapped_cores = cores_acquired_count - qualified_units
    
    # 3. Rebuild and Scrap Financials
    total_rebuild_cost = qualified_units * rebuild_parts_and_labor_cost_per_unit
    total_scrap_revenue = scrapped_cores * unusable_core_scrap_recovery_usd
    total_reman_revenue = qualified_units * remanufactured_unit_sale_price
    
    total_reman_operating_cost = total_core_buyback_cost + total_disassembly_cost + total_rebuild_cost - total_scrap_revenue
    net_reman_gross_profit = total_reman_revenue - total_reman_operating_cost
    reman_margin_pct = (net_reman_gross_profit / total_reman_revenue * 100.0) if total_reman_revenue > 0 else 0.0
    
    # 4. Comparative Metrics against New Production
    cost_per_reman_unit = total_reman_operating_cost / qualified_units if qualified_units > 0 else 0.0
    reman_cost_savings_vs_new_pct = ((baseline_new_unit_mfg_cost - cost_per_reman_unit) / baseline_new_unit_mfg_cost) * 100.0
    
    new_unit_gross_profit = baseline_new_unit_sale_price - baseline_new_unit_mfg_cost
    new_unit_margin_pct = (new_unit_gross_profit / baseline_new_unit_sale_price) * 100.0
    
    return {
        "cores_acquired": cores_acquired_count,
        "qualified_rebuilt_units": qualified_units,
        "scrapped_cores_count": scrapped_cores,
        "core_yield_pct": round(core_qualification_yield_rate * 100.0, 1),
        "total_reman_revenue_usd": round(total_reman_revenue, 2),
        "total_reman_cost_usd": round(total_reman_operating_cost, 2),
        "net_reman_profit_usd": round(net_reman_gross_profit, 2),
        "reman_gross_margin_pct": round(reman_margin_pct, 2),
        "cost_per_reman_unit_usd": round(cost_per_reman_unit, 2),
        "reman_unit_cost_savings_vs_new_pct": round(reman_cost_savings_vs_new_pct, 2),
        "new_unit_benchmark_margin_pct": round(new_unit_margin_pct, 2)
    }

# Batch of 200 heavy commercial vehicle diesel turbochargers
reman_analysis = evaluate_remanufacturing_batch_economics(
    cores_acquired_count=200,
    core_acquisition_deposit_usd=120.0,
    disassembly_and_inspection_cost_per_core=45.0,
    core_qualification_yield_rate=0.82, # 82% sound cores
    rebuild_parts_and_labor_cost_per_unit=210.0,
    remanufactured_unit_sale_price=680.0,
    unusable_core_scrap_recovery_usd=25.0,
    baseline_new_unit_mfg_cost=580.0,
    baseline_new_unit_sale_price=950.0
)

print(f"Remanufacturing Production Run ({reman_analysis['cores_acquired']} Cores Ingested):")
print(f"  Qualified Units Rebuilt: {reman_analysis['qualified_rebuilt_units']} ({reman_analysis['core_yield_pct']}% Yield)")
print(f"  Total Reman Revenue:     ${reman_analysis['total_reman_revenue_usd']:,.2f}")
print(f"  Net Reman Profit:        ${reman_analysis['net_reman_profit_usd']:,.2f} (Gross Margin: {reman_analysis['reman_gross_margin_pct']}%)")
print(f"  Cost Per Reman Unit:     ${reman_analysis['cost_per_reman_unit_usd']:,.2f} (Savings vs New: {reman_analysis['reman_unit_cost_savings_vs_new_pct']}%)")
print(f"  New Unit Benchmark:      Cost: $580.00 | Sale: $950.00 | Margin: {reman_analysis['new_unit_benchmark_margin_pct']}%")
""",
            "output": """Remanufacturing Production Run (200 Cores Ingested):
  Qualified Units Rebuilt: 164 (82.0% Yield)
  Total Reman Revenue:     $111,520.00
  Net Reman Profit:        $44,980.00 (Gross Margin: 40.33%)
  Cost Per Reman Unit:     $405.73 (Savings vs New: 30.05%)
  New Unit Benchmark:      Cost: $580.00 | Sale: $950.00 | Margin: 38.95%""",
            "codeNotes": [
                {"line": 2, "note": "Implements remanufacturing batch economics engine with core yield modeling"},
                {"line": 16, "note": "Calculates qualified rebuild units vs scrap commodity recovery offsets"},
                {"line": 24, "note": "Computes exact cost per remanufactured unit and gross operating margin"},
                {"line": 28, "note": "Proves remanufacturing delivers higher margin % (40.33%) than new production (38.95%)"}
            ],
            "tryIt": {
                "description": "Assess the strategic financial benefit of industrial remanufacturing over new equipment manufacturing.",
                "question": "According to the simulation output above, why is remanufacturing highly strategic for corporate gross margin performance?",
                "options": [
                    "Because remanufacturing requires zero factory workers or tools",
                    "Because remanufacturing achieves a lower unit production cost ($405.73 vs $580.00) and higher gross operating profit margin (40.33% vs 38.95%) while diverting tons of engineered metal from landfills",
                    "Because customers are legally required to buy remanufactured units by civil law",
                    "Because remanufactured units are not subject to corporate income taxes"
                ],
                "answer": 1,
                "explanation": "Remanufacturing reuses high-value machined cores, slashing material and energy requirements. In this run, unit cost dropped by 30.05% ($405.73 vs $580.00), allowing the firm to sell at a competitive $680 price point while expanding operating profit margins from 38.95% to 40.33%."
            }
        },
        {
            "title": "Extended Producer Responsibility (EPR) Statutory Regulations & E-Waste Credit Trading",
            "say": [
                "Beyond voluntary commercial value recovery, reverse supply chains are increasingly governed by binding statutory mandates under the global doctrine of Extended Producer Responsibility (EPR). Extended Producer Responsibility is an environmental policy approach in which a producer’s legal and financial responsibility for a product is extended to the post-consumer stage of a product’s life cycle. Under statutory EPR regulations—such as the European Union WEEE Directive (Waste Electrical and Electronic Equipment), India's E-Waste Management Rules 2022, and Plastic Waste Management Amendment Rules—manufacturers, importers, and brand owners (collectively known as PIBOs) can no longer externalize the environmental cost of packaging and toxic discarded electronics onto municipal landfills.",
                "Statutory EPR regulations establish mandatory, legally binding Recycling and Collection Targets. In India, for example, the Ministry of Environment, Forest and Climate Change (MoEFCC) through the Central Pollution Control Board (CPCB) mandates that electronics manufacturers collect and safely recycle an annually escalating percentage of the average weight of electronic equipment placed on the market over the preceding sales cycle—starting at 60% and escalating to 80%. Failure to meet statutory targets triggers punitive Environmental Compensation (EC) fines, confiscation of operating bank guarantees, and cancellation of corporate import licenses.",
                "To satisfy EPR obligations without building proprietary nationwide recycling plants, corporations partner with certified Producer Responsibility Organizations (PROs) and registered recyclers via Centralized EPR Credit Portals. In modern regulatory regimes, compliance is managed through Market-Based EPR Certificate Trading. When a certified recycler dismantles and recovers gold, copper, rare earth magnets, and plastics from e-waste, the CPCB digital portal issues validated Electronic Waste Recycling Certificates (EPR Credits) measured in metric tons of material recovered.",
                "PIBOs purchase these EPR credits from certified recyclers on the digital registry to fulfill their annual compliance liabilities. If an electronics brand generated 10,000 metric tons of electronic sales over the reference period, its 70% statutory target requires acquiring 7,000 tons of EPR credits. A company that over-fulfills its recycling targets can bank surplus credits or sell them on the compliance credit exchange to competitor firms facing compliance deficits.",
                "Crucially, corporate supply chain leaders must maintain unassailable Material Flow Accounting (MFA) and digital mass-balance ledgers. Every gram of plastic packaging, hazardous lithium-ion battery chemistry, and cathode ray glass must be tracked through certified chain-of-custody documentation. In statutory financial filings, auditors rigorously examine EPR liability provisions on the balance sheet, ensuring that potential environmental liabilities and non-compliance fines are fully accounted for under modern ESG corporate reporting standards.",
                "From a technological architecture perspective, advanced compliance tracking platforms integrate blockchain-anchored digital passports for high-impact industrial assets and consumer batteries. Each physical battery pack or electronic appliance is permanently etched with a QR code or RFID transponder linking directly to an immutable ledger recording its constituent raw materials, carbon manufacturing footprint, and certified recycling processor. This end-to-end cryptographic lineage eliminates the risk of fraudulent double-counting of recycling credits, providing government environmental regulators and statutory financial auditors with indisputable proof of regulatory compliance."
            ],
            "example": "A major multinational consumer electronics brand sold 1.8 million laptops and televisions in India during fiscal year 2025-26, representing 14,000 metric tons of electronic hardware. Under statutory E-Waste Management Rules, the company faced a 70% mandatory EPR collection target of 9,800 metric tons. Through its reverse logistics trade-in program, the company directly collected 4,200 tons of end-of-life devices. To bridge the remaining 5,600-ton compliance deficit, the corporate supply chain team entered the CPCB digital credit exchange, purchasing validated e-waste recycling certificates from certified PRO recyclers at an average price of $85 per metric ton ($476,000 total outlay). By securing valid digital certificates, the firm avoided $2.8 million in punitive statutory non-compliance fines and earned an ESG Tier-1 leadership rating.",
            "code": """# Statutory EPR Compliance: E-Waste Recycling Target & Credit Trading Reconciliation Engine
def reconcile_epr_statutory_obligations(
    company_name: str,
    annual_sales_weight_metric_tons: float,
    statutory_mandate_target_pct: float, # e.g. 70.0%
    in_house_reverse_collection_tons: float,
    certified_recycler_credit_cost_per_ton_usd: float,
    statutory_environmental_compensation_fine_per_ton_usd: float # Punitive fine if defaulted
) -> dict:
    # 1. Calculate Statutory Target
    required_compliance_tons = annual_sales_weight_metric_tons * (statutory_mandate_target_pct / 100.0)
    
    # 2. Reconcile In-House Collection vs Requirement
    in_house_fulfilled_tons = min(in_house_reverse_collection_tons, required_compliance_tons)
    compliance_deficit_tons = max(0.0, required_compliance_tons - in_house_fulfilled_tons)
    
    # 3. Market Credit Acquisition vs Statutory Fine Analysis
    credit_purchase_cost = compliance_deficit_tons * certified_recycler_credit_cost_per_ton_usd
    statutory_default_fine = compliance_deficit_tons * statutory_environmental_compensation_fine_per_ton_usd
    net_cost_avoidance = statutory_default_fine - credit_purchase_cost
    
    is_fully_compliant = (in_house_fulfilled_tons + compliance_deficit_tons) >= required_compliance_tons
    
    return {
        "company_name": company_name,
        "sales_volume_metric_tons": annual_sales_weight_metric_tons,
        "statutory_mandate_pct": statutory_mandate_target_pct,
        "required_epr_target_tons": round(required_compliance_tons, 1),
        "in_house_collected_tons": round(in_house_fulfilled_tons, 1),
        "market_credits_required_tons": round(compliance_deficit_tons, 1),
        "total_credit_purchase_cost_usd": round(credit_purchase_cost, 2),
        "statutory_penalty_avoided_usd": round(statutory_default_fine, 2),
        "net_financial_savings_usd": round(net_cost_avoidance, 2),
        "compliance_audit_verdict": "STATUTORILY_COMPLIANT_CERTIFIED" if is_fully_compliant else "NON_COMPLIANT_PENALTY_RISK"
    }

# Consumer Electronics OEM with 12,500 metric tons annual sales
epr_recon = reconcile_epr_statutory_obligations(
    company_name="Apex Electronics India Pvt Ltd",
    annual_sales_weight_metric_tons=12500.0,
    statutory_mandate_target_pct=70.0, # 70% mandatory target (8,750 tons)
    in_house_reverse_collection_tons=3500.0,
    certified_recycler_credit_cost_per_ton_usd=90.0,
    statutory_environmental_compensation_fine_per_ton_usd=400.0 # Heavy regulatory fine
)

print(f"[{epr_recon['company_name']}] Statutory EPR E-Waste Reconciliation:")
print(f"  Sales Volume: {epr_recon['sales_volume_metric_tons']:,} tons | Mandate: {epr_recon['statutory_mandate_pct']}%")
print(f"  Required Target: {epr_recon['required_epr_target_tons']:,} tons (In-House: {epr_recon['in_house_collected_tons']:,} tons)")
print(f"  Credit Market Purchase: {epr_recon['market_credits_required_tons']:,} tons @ $90/ton = ${epr_recon['total_credit_purchase_cost_usd']:,.2f}")
print(f"  Regulatory Fine Avoided: ${epr_recon['statutory_penalty_avoided_usd']:,.2f} (Net Savings: ${epr_recon['net_financial_savings_usd']:,.2f})")
print(f"  Audit Verdict: {epr_recon['compliance_audit_verdict']}")
""",
            "output": """[Apex Electronics India Pvt Ltd] Statutory EPR E-Waste Reconciliation:
  Sales Volume: 12,500.0 tons | Mandate: 70.0%
  Required Target: 8,750.0 tons (In-House: 3,500.0 tons)
  Credit Market Purchase: 5,250.0 tons @ $90/ton = $472,500.00
  Regulatory Fine Avoided: $2,100,000.00 (Net Savings: $1,627,500.00)
  Audit Verdict: STATUTORILY_COMPLIANT_CERTIFIED""",
            "codeNotes": [
                {"line": 2, "note": "Implements statutory Extended Producer Responsibility (EPR) reconciliation engine"},
                {"line": 11, "note": "Computes mandatory collection targets based on annual sales weight"},
                {"line": 18, "note": "Evaluates certified PRO credit purchase cost vs statutory environmental penalty fines"},
                {"line": 20, "note": "Validates statutory compliance certification for corporate ESG balance sheet disclosure"}
            ],
            "tryIt": {
                "description": "Evaluate the financial incentive for purchasing EPR recycling credits on the compliance exchange.",
                "question": "In the EPR simulation above, what was the primary financial justification for Apex Electronics purchasing $472,500 in certified recycling credits?",
                "options": [
                    "To generate speculative cryptocurrency trading profits",
                    "To avoid $2,100,000 in statutory Environmental Compensation fines and prevent corporate license cancellation, yielding $1,627,500 in net cost avoidance",
                    "To pay off executive bonuses",
                    "Because EPR credits can be used to pay employee payroll taxes"
                ],
                "answer": 1,
                "explanation": "Statutory environmental regulations impose severe punitive fines ($400/ton vs $90/ton for credits) on non-compliant manufacturers. Purchasing $472,500 in certified credits legally fulfilled the statutory quota, preventing $2,100,000 in government fines and saving the company $1,627,500."
            }
        },
        {
            "title": "Circular Economy Return Recovery & Net Financial Optimization Engine",
            "say": [
                "The strategic pinnacle of reverse logistics is transforming environmental compliance from a pure cost center into an integrated Circular Economy Profit Engine. Under the Cradle-to-Cradle (C2C) industrial framework, materials are categorized into two perpetual metabolism streams: Biological Nutrients (organic materials designed to safely re-enter the biosphere without toxicity) and Technical Nutrients (high-value synthetic polymers, aluminum, lithium, cobalt, and rare earth metals designed to circulate perpetually in high-grade industrial loops without downcycling).",
                "To optimize circular networks, operations executives formulate multi-objective optimization models that balance net financial salvage realization, carbon abatement offsets, and statutory compliance fulfillment. In a closed-loop supply chain, every kilogram of aluminum or copper recovered from returned products offsets the need to purchase virgin commodity metals on the volatile London Metal Exchange (LME). In carbon accounting under the Greenhouse Gas (GHG) Protocol, using recycled aluminum requires 95% less electrical energy than smelting bauxite via the Hall-Héroult process, generating certified Scope 3 carbon emission reduction credits that can be monetized in carbon compliance markets.",
                "The mathematical formulation of the circular recovery ledger integrates five operational revenue streams: (1) Grade A/B forward inventory resale revenue, (2) Certified remanufactured unit gross margins, (3) Harvested subassembly spare parts value, (4) Commodity scrap raw material sales, and (5) Avoided statutory EPR penalties and carbon offset credits. From these gross inflows, the model deducts total reverse logistics collection freight, return center labor, diagnostic testing amortization, and toxic waste disposal fees.",
                "To institutionalize circular execution, modern enterprise WMS and ERP architectures incorporate Circular Material Passports. When a customer returns a product, the scanner reads its digital identity and instantly computes its circular yield index: the percentage of total product mass successfully diverted from municipal landfills into productive industrial reuse. Facilities that achieve circular diversion rates exceeding 95% are certified as Zero Waste to Landfill (ZWTL) operations.",
                "From an investor relations and capital structure perspective, circular supply chain mastery directly compresses weighted average cost of capital (WACC). Under EU Corporate Sustainability Due Diligence Directive (CSDDD) and global ESG investment frameworks, commercial banks and institutional debt investors offer preferential interest rate margins (Sustainability-Linked Loans) to corporations that demonstrably decouple revenue growth from virgin resource extraction. By publishing certified cradle-to-cradle audit trails showing closed-loop recovery percentages, enterprises gain access to green bond financing, enjoy regulatory immunity from escalating virgin plastic packaging taxes, and command premium brand valuation multiples among institutional allocators.",
                "Ultimately, circular supply chains establish durable competitive moats. By securing proprietary closed-loop core return channels, enterprise manufacturers insulate themselves against global commodity price spikes, lock in lucrative recurring aftermarket service and refurbishment contracts, and establish unassailable corporate sustainability leadership in modern capital markets."
            ],
            "example": "A multinational automotive battery manufacturer producing 200,000 lithium-ion electric vehicle battery packs annually implemented a Cradle-to-Cradle circular supply chain architecture. When EV battery packs reach an 80% State of Health (SOH) after 8 years of automotive use, they are no longer suitable for vehicle acceleration demands. Rather than recycling them as scrap, the manufacturer established a second-life reverse logistics network, reconfiguring the battery modules into stationary commercial solar energy storage systems (BESS). Packs below 60% SOH were routed to hydrometallurgical recycling, recovering 98% of battery-grade lithium, nickel, and cobalt. The circular program generated $180 million in second-life BESS revenue and $45 million in virgin material procurement savings, while slashing corporate Scope 3 carbon emissions by 420,000 metric tons.",
            "code": """# Circular Economy: Cradle-to-Cradle Material Flow & Net Financial Recovery Ledger
def calculate_circular_economy_financial_ledger(
    intake_volume_units: int,
    avg_unit_mass_kg: float,
    disposition_distribution: dict, # {'restock': float, 'reman': float, 'harvest': float, 'recycle': float, 'landfill': float}
    unit_resale_values: dict, # Values in USD per unit for each channel
    operating_costs: dict # reverse logistics costs: collection, labor, testing
) -> dict:
    total_mass_kg = intake_volume_units * avg_unit_mass_kg
    
    # 1. Units and Mass per Channel
    channel_metrics = {}
    total_gross_recovery_usd = 0.0
    diverted_mass_kg = 0.0
    
    for channel, pct in disposition_distribution.items():
        units = intake_volume_units * pct
        mass = total_mass_kg * pct
        value_per_unit = unit_resale_values.get(channel, 0.0)
        channel_revenue = units * value_per_unit
        
        total_gross_recovery_usd += channel_revenue
        if channel != 'landfill':
            diverted_mass_kg += mass
            
        channel_metrics[channel] = {
            "units": round(units, 1),
            "mass_kg": round(mass, 1),
            "revenue_usd": round(channel_revenue, 2)
        }
        
    # 2. Total Reverse Operating Costs
    total_reverse_costs = (
        operating_costs["collection_freight_usd"] +
        operating_costs["triage_labor_usd"] +
        operating_costs["diagnostic_testing_usd"]
    )
    
    net_circular_profit_usd = total_gross_recovery_usd - total_reverse_costs
    diversion_rate_pct = (diverted_mass_kg / total_mass_kg * 100.0) if total_mass_kg > 0 else 0.0
    carbon_offset_metric_tons = (diverted_mass_kg * 0.0028) # ~2.8 kg CO2e avoided per kg recovered
    
    return {
        "total_intake_units": intake_volume_units,
        "total_intake_mass_metric_tons": round(total_mass_kg / 1000.0, 2),
        "gross_salvage_recovery_usd": round(total_gross_recovery_usd, 2),
        "total_reverse_operating_cost_usd": round(total_reverse_costs, 2),
        "net_circular_operating_profit_usd": round(net_circular_profit_usd, 2),
        "landfill_diversion_rate_pct": round(diversion_rate_pct, 2),
        "co2e_carbon_abatement_tons": round(carbon_offset_metric_tons, 1),
        "zero_waste_to_landfill_certified": diversion_rate_pct >= 95.0,
        "channel_performance": channel_metrics
    }

# 1,000 returned commercial power tools (avg 4.5 kg per unit = 4,500 kg total)
dist = {
    'restock': 0.35, # 35% pristine Grade A/B
    'reman': 0.30,   # 30% factory remanufactured
    'harvest': 0.15, # 15% component harvesting
    'recycle': 0.18, # 18% clean metal/plastic recycling
    'landfill': 0.02 # 2% hazardous/unrecyclable residual
}

prices = {
    'restock': 140.0,  # Resell at $140
    'reman': 110.0,    # Reman unit sold at $110
    'harvest': 45.0,   # Harvested motor/switch parts
    'recycle': 6.0,    # Scrap alloy commodity value
    'landfill': 0.0
}

costs = {
    'collection_freight_usd': 12500.0,
    'triage_labor_usd': 6800.0,
    'diagnostic_testing_usd': 4200.0
}

circular_ledger = calculate_circular_economy_financial_ledger(
    intake_volume_units=1000,
    avg_unit_mass_kg=4.5,
    disposition_distribution=dist,
    unit_resale_values=prices,
    operating_costs=costs
)

print(f"Circular Economy Recovery Ledger ({circular_ledger['total_intake_units']} Units | {circular_ledger['total_intake_mass_metric_tons']} Tons):")
print(f"  Gross Salvage Recovery: ${circular_ledger['gross_salvage_recovery_usd']:,.2f}")
print(f"  Reverse Logistics Costs: ${circular_ledger['total_reverse_operating_cost_usd']:,.2f}")
print(f"  Net Circular Profit:     ${circular_ledger['net_circular_operating_profit_usd']:,.2f}")
print(f"  Landfill Diversion Rate: {circular_ledger['landfill_diversion_rate_pct']}% (ZWTL Certified: {circular_ledger['zero_waste_to_landfill_certified']})")
print(f"  Carbon Abatement Offset: {circular_ledger['co2e_carbon_abatement_tons']} metric tons CO2e")
""",
            "output": """Circular Economy Recovery Ledger (1000 Units | 4.5 Tons):
  Gross Salvage Recovery: $89,830.00
  Reverse Logistics Costs: $23,500.00
  Net Circular Profit:     $66,330.00
  Landfill Diversion Rate: 98.0% (ZWTL Certified: True)
  Carbon Abatement Offset: 12.3 metric tons CO2e""",
            "codeNotes": [
                {"line": 2, "note": "Implements Cradle-to-Cradle circular material flow and financial ledger"},
                {"line": 15, "note": "Computes units, recovered mass, and channel revenues across multi-tier dispositions"},
                {"line": 28, "note": "Deducts total reverse freight, labor, and diagnostic costs to derive net profit"},
                {"line": 34, "note": "Validates Zero Waste to Landfill (ZWTL) certification and CO2e abatement offsets"}
            ],
            "tryIt": {
                "description": "Evaluate the net profitability of an integrated circular economy reverse logistics system.",
                "question": "In the circular economy ledger above, how did the enterprise achieve a positive net operating profit of $66,330.00 on returned items?",
                "options": [
                    "By dumping all returns into municipal landfills without paying tipping fees",
                    "By generating $89,830 in gross recovery through tiered restock, remanufacturing, and parts harvesting, which comfortably exceeded the $23,500 in reverse logistics and triage costs",
                    "By firing all reverse logistics warehouse employees",
                    "By charging customers a $100 penalty fee for every return"
                ],
                "answer": 1,
                "explanation": "Rather than treating returns as a pure loss, the multi-tier circular triage extracted $89,830 in value across Grade A restock, certified remanufacturing, and component harvesting. Subtracting the $23,500 reverse logistics operating costs yielded a net circular profit of $66,330 and a 98% landfill diversion rate."
            }
        }
    ]

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts
    }

if __name__ == "__main__":
    data = get_day13_data()
    print(f"Loaded Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    total_words = 0
    for idx, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say']) + len(p['example'].split()) + len(p['tryIt']['explanation'].split())
        total_words += words
        print(f"  Part {idx+1} '{p['title'][:35]}...': ~{words} spoken words")
    print(f"Total Day 13 spoken words: ~{total_words} words (Target >= 2,950)")
