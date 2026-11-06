"""
Day 15 Builder: Milestone 2 Capstone: Autonomous Supply Chain, OMS, Logistics & Marketplace Operations Engine
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-810
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 funnel visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day15():
    parts = []

    # Part 1: End-to-End E-Commerce Supply Chain Architecture: From Inbound PO to Omnichannel Allocation
    p1_say = [
        "Welcome to Day 15 of B.Com E-Commerce and Digital Business. Today marks a pivotal academic and professional milestone: The Milestone 2 Capstone. Over the preceding nine intensive days, we systematically decomposed and engineered every foundational organ of enterprise digital commerce: frictionless checkout flow engineering and payment gateway MDR reconciliation (Day 6); distributed order management systems and split-shipment optimization (Day 7); stochastic safety stock, EOQ, and reorder point inventory mathematics (Day 8); high-throughput warehouse picking, packing, and volumetric freight calculations (Day 9); multi-carrier logistics routing and COD return-to-origin defense (Day 10); closed-loop reverse logistics, automated RMA gatekeeping, and recommerce triage (Day 11); multi-marketplace Buy Box algorithmic pricing and decentralized ONDC transactions (Day 12); composable headless Next.js architectures and high-concurrency flash sale resilience (Day 13); and omnichannel customer support SLAs, AI agent deflection, and Erlang C staffing models (Day 14).",
        
        "Today, in Day 15, we synthesize these disparate functional disciplines into a single, cohesive, self-healing operating system: The Autonomous E-Commerce Supply Chain, OMS, Logistics & Marketplace Operations Engine. In a multi-hundred-million-dollar global retail enterprise, digital commerce cannot operate as a disconnected federation of software dashboards. If marketing launches an aggressive performance ad campaign while the warehouse runs dangerously low on safety stock, the company burns customer acquisition capital only to generate stockouts, cancellations, and negative reviews. If the logistics routing engine allocates parcels to a carrier suffering severe regional hub congestion, delivery transit times double, WISMO customer support tickets surge, and COD delivery refusal rates spike.",
        
        "The Capstone Architecture is unified by a closed-loop event-driven data pipeline. When an inbound manufacturing purchase order arrives at port customs, the shipment is tracked via maritime IoT GPS milestones. Upon dock arrival at the central import distribution center (IDC), high-speed cross-dock sorters scan pallet barcodes, instantly synchronizing physical inventory counts with the centralized enterprise resource planning (ERP) master catalog. Rather than statically committing all inventory to a single warehouse, the Intelligent Inventory Allocation Subsystem dynamically partitions physical units into virtual pools: allocating forty percent to Amazon FBA for national Prime coverage, thirty percent to regional micro-fulfillment centers (MFCs) for same-day D2C delivery, twenty percent to wholesale marketplace channels (Flipkart and Walmart), and reserving ten percent as a dynamic buffer for decentralized ONDC network orders.",
        
        "Furthermore, by maintaining bi-directional API webhooks with factory suppliers, freight forwarders, domestic 3PL carriers, and marketplace seller registries, the autonomous engine continuously recalibrates lead-time forecasts. If ocean transit delays extend supplier lead time by seven days, the engine automatically adjusts safety stock calculations, recalculates Economic Order Quantities, and updates expected delivery dates on storefront product detail pages without human manual intervention.",
        
        "In our institutional Python model for Part 1, we simulate the end-to-end inbound procurement and multi-channel inventory allocation pipeline for a seasonal product launch of fifty thousand units. The engine calculates landed container freight, customs duties, warehouse cross-dock processing costs, and dynamically distributes available stock across D2C, Amazon FBA, Flipkart, and ONDC channels according to historical demand velocity and channel margin profiles. Review the deterministic code below."
    ]

    p1_code = '''def model_inbound_procurement_and_allocation(
    factory_production_units: int,
    unit_fob_cost_usd: float,
    ocean_freight_per_unit_usd: float,
    customs_duty_rate_pct: float,
    inbound_drayage_and_crossdock_usd: float
) -> dict:
    """
    Models end-to-end inbound procurement landed costs and executes
    algorithmic multi-channel virtual stock pooling across D2C, FBA, and ONDC.
    """
    # 1. Total Landed Cost Basis
    raw_goods_value = factory_production_units * unit_fob_cost_usd
    customs_duties = raw_goods_value * customs_duty_rate_pct
    ocean_freight_total = factory_production_units * ocean_freight_per_unit_usd
    total_inbound_logistics = ocean_freight_total + inbound_drayage_and_crossdock_usd
    
    total_capital_deployed = raw_goods_value + customs_duties + total_inbound_logistics
    landed_cost_per_unit = total_capital_deployed / factory_production_units
    
    # 2. Algorithmic Multi-Channel Stock Allocation
    # Allocation ratios driven by channel velocity & margin profile
    channel_allocations = {
        "D2C_Headless_Storefront": {"share": 0.35, "target_node": "MFC-REGIONAL-NETWORK"},
        "Amazon_FBA_Prime":        {"share": 0.40, "target_node": "AMZN-FBA-REGIONAL-HUBS"},
        "Flipkart_Assured":         {"share": 0.15, "target_node": "FK-WMS-EAST-WEST"},
        "ONDC_Decentralized_Pool":  {"share": 0.10, "target_node": "OPEN-LOGISTICS-NODE"}
    }
    
    allocated_breakdown = {}
    total_units_allocated = 0
    
    for ch, config in channel_allocations.items():
        units = int(factory_production_units * config['share'])
        total_units_allocated += units
        allocated_breakdown[ch] = {
            "allocated_units": units,
            "share_pct": config['share'] * 100.0,
            "inventory_valuation_usd": round(units * landed_cost_per_unit, 2),
            "fulfillment_target": config['target_node']
        }
        
    return {
        "total_production_units": factory_production_units,
        "fob_unit_cost_usd": unit_fob_cost_usd,
        "total_landed_cost_usd": round(total_capital_deployed, 2),
        "landed_cost_per_unit_usd": round(landed_cost_per_unit, 2),
        "customs_and_freight_overhead_usd": round(customs_duties + total_inbound_logistics, 2),
        "allocated_inventory_summary": allocated_breakdown
    }

# 50,000 Smart Home Hub units imported from overseas factory
inbound_plan = model_inbound_procurement_and_allocation(
    factory_production_units=50000,
    unit_fob_cost_usd=28.00,
    ocean_freight_per_unit_usd=2.40,
    customs_duty_rate_pct=0.075, # 7.5% import tariff
    inbound_drayage_and_crossdock_usd=45000.0
)

print("=== CAPSTONE: INBOUND PROCUREMENT & OMNICHANNEL ALLOCATION ===")
print(f"Total Manufactured Units: {inbound_plan['total_production_units']:,} units")
print(f"FOB Factory Cost: ${inbound_plan['fob_unit_cost_usd']:.2f}/unit | Landed Cost Basis: ${inbound_plan['landed_cost_per_unit_usd']:.2f}/unit")
print(f"Total Landed Capital Deployed: ${inbound_plan['total_landed_cost_usd']:,.2f}")
print(f"Duties & Inbound Freight: ${inbound_plan['customs_and_freight_overhead_usd']:,.2f}")
print()
print(f"{'Sales Channel':26s} | {'Allocated Units':15s} | {'Capital Deployed':18s} | {'Destination Node'}")
print("-" * 80)
for ch, d in inbound_plan['allocated_inventory_summary'].items():
    print(f"{ch:26s} | {d['allocated_units']:12,d} ({d['share_pct']:4.1f}%) | ${d['inventory_valuation_usd']:15,.2f} | {d['fulfillment_target']}")'''

    p1_output = """=== CAPSTONE: INBOUND PROCUREMENT & OMNICHANNEL ALLOCATION ===
Total Manufactured Units: 50,000 units
FOB Factory Cost: $28.00/unit | Landed Cost Basis: $33.40/unit
Total Landed Capital Deployed: $1,670,000.00
Duties & Inbound Freight: $270,000.00

Sales Channel              | Allocated Units | Capital Deployed   | Destination Node
--------------------------------------------------------------------------------
D2C_Headless_Storefront    |       17,500 (35.0%) | $     584,500.00 | MFC-REGIONAL-NETWORK
Amazon_FBA_Prime           |       20,000 (40.0%) | $     668,000.00 | AMZN-FBA-REGIONAL-HUBS
Flipkart_Assured           |        7,500 (15.0%) | $     250,500.00 | FK-WMS-EAST-WEST
ONDC_Decentralized_Pool    |        5,000 (10.0%) | $     167,000.00 | OPEN-LOGISTICS-NODE"""

    p1_check = {
        "question": "Why is multi-channel virtual stock pooling superior to physically siloing inventory into separate warehouse buildings for each channel?",
        "options": [
            "Because virtual stock pooling makes shipping couriers work for free",
            "Because virtual pooling aggregates safety stock, prevents regional stockouts on high-velocity channels, and maximizes inventory turns across D2C, marketplaces, and ONDC without duplicate holding costs",
            "Because marketplaces legally prohibit physical warehouses",
            "Because physical warehousing increases manufacturing defect rates"
        ],
        "answer": 1,
        "why": "Virtual stock pooling centralizes inventory visibility. Rather than locking stock into rigid physical silos where one channel starves while another sits overstocked, the DOMS dynamically allocates available stock based on real-time sales velocity."
    }

    p1_example = "Unilever and Procter & Gamble implemented consolidated omnichannel fulfillment networks in North America and India. By centralizing distribution centers and virtually allocating stock between direct retailers, Amazon, and local quick-commerce apps, they reduced inventory holding costs by 18% while eliminating stockouts during major promotional surges."
    p1_tryit = "Modify customs_duty_rate_pct to 0.15 to simulate a tariff hike. Observe how unit landed cost basis increases and recalculate the required minimum retail pricing to preserve a 50% gross margin."
    p1_notes = [
        "Landed cost basis includes FOB factory cost, ocean linehaul freight, customs tariffs, drayage, and warehouse cross-dock intake.",
        "Virtual inventory pooling partitions physical stock into dynamic channel pools (D2C, Amazon FBA, ONDC) based on sales velocity.",
        "Dynamic allocation eliminates the bullwhip effect and prevents channel stockouts without inflating working capital.",
        "Automated ASN (Advance Shipping Notice) tracking synchronizes inbound ocean shipments with downstream fulfillment scheduling."
    ]

    parts.append({
        "title": "End-to-End E-Commerce Supply Chain: Inbound PO to Omnichannel Allocation",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "check": p1_check,
        "example": p1_example,
        "tryIt": p1_tryit,
        "codeNotes": p1_notes
    })

    # Part 2: Autonomous OMS & Real-Time Multi-Warehouse Order Routing
    p2_say = [
        "In Part 2 of the Capstone, we engage the nerve center of order execution: The Distributed Order Management System (DOMS) Routing Engine. When an omnichannel enterprise receives thousands of customer orders per hour flowing concurrently from headless Next.js web storefronts, mobile native apps, Amazon Seller Central, and ONDC buyer apps, routing each order to the correct fulfillment node cannot be governed by static lookup tables. If an order containing three distinct items is naively assigned to three separate distant warehouses, the business incurs triple pick-and-pack labor, triple outbound carrier freight, and generates three separate unboxing events that confuse the consumer. Conversely, routing an order to a warehouse located two thousand miles away creates long transit delays and elevated delivery failure risks.",
        
        "The Autonomous DOMS Engine solves this multi-variable optimization puzzle in real time through algorithmic scoring. For every incoming order payload, the DOMS evaluates five strict criteria: First, Inventory Completeness—identifying fulfillment centers that can satisfy all line items in a single consolidated package, eliminating costly split shipments; Second, Geographical Proximity and Postal Code Zoning—measuring the exact geodesic and highway transit distance between the fulfillment node and the customer's delivery address to minimize carrier shipping zones (e.g., shipping from Zone 2 at $5.20 versus Zone 7 at $11.80); Third, Warehouse Node Workload and Queue Capacity—inspecting the active picking queue at each warehouse to avoid overloading congested facilities that are near operational capacity; Fourth, Channel SLA Requirements—prioritizing Amazon Prime orders requiring strict twenty-four-hour fulfillment dispatch over standard ground shipping; and Fifth, Stock Balancing and Expiration Triage—routing orders to warehouses holding aging or slow-moving stock batches to accelerate inventory velocity.",
        
        "Furthermore, modern DOMS platforms integrate Store-Fulfill-from-Store (SFS) capabilities. If a brand maintains fifty brick-and-mortar retail stores across major metropolitan hubs, the DOMS treats each physical store as a micro-fulfillment node. When a local D2C order is placed within five miles of a retail store, the system routes the pick-and-pack task to store associates, enabling ultra-fast same-day delivery via local gig couriers while draining store inventory.",
        
        "In our institutional Python model for Part 2, we execute an Autonomous Multi-Warehouse DOMS Routing Algorithm across a cohort of five diverse multi-item customer orders. The engine evaluates real-time inventory availability across four regional fulfillment centers (FC-East, FC-West, FC-Central, and Local Retail Store), penalizes split shipments, computes carrier freight zone costs, and outputs the optimal dispatch route with minimum total fulfillment expense. Review the deterministic code below."
    ]

    p2_code = '''def route_order_optimally(
    order_id: str,
    line_items: list,
    customer_postal_zone: int, # Zones 1 to 8 (Zone 1 = closest, Zone 8 = cross-country)
    fulfillment_nodes: dict
) -> dict:
    """
    Autonomous DOMS Routing Algorithm:
    Evaluates multi-node inventory completeness, transit zoning, split shipment
    penalties, and assigns the lowest-cost fulfillment path.
    """
    SPLIT_SHIPMENT_PENALTY_USD = 4.50
    BASE_CARRIER_COST = 4.80
    ZONE_RATE_MULTIPLIER = 0.95
    
    candidate_routes = []
    
    # 1. Single-node fulfillment evaluation (Consolidated package)
    for node_id, node_data in fulfillment_nodes.items():
        node_zone_distance = abs(node_data['base_zone'] - customer_postal_zone) + 1
        shipping_cost = BASE_CARRIER_COST + (node_zone_distance * ZONE_RATE_MULTIPLIER)
        
        # Check if node has all line items in stock
        can_fulfill_all = True
        for item, qty in line_items:
            if node_data['inventory'].get(item, 0) < qty:
                can_fulfill_all = False
                break
                
        if can_fulfill_all:
            candidate_routes.append({
                "routing_type": "CONSOLIDATED_SINGLE_NODE",
                "nodes_involved": [node_id],
                "split_count": 1,
                "shipping_freight_usd": round(shipping_cost, 2),
                "split_penalties_usd": 0.0,
                "total_fulfillment_cost_usd": round(shipping_cost, 2)
            })
            
    # 2. Multi-node split shipment evaluation if single node not available
    if not candidate_routes:
        # Must split across two nodes
        # Simplified: allocate item 1 to Node with item 1, item 2 to Node with item 2
        item_1, qty_1 = line_items[0]
        item_2, qty_2 = line_items[1]
        
        node_for_item_1 = None
        node_for_item_2 = None
        
        for node_id, node_data in fulfillment_nodes.items():
            if node_data['inventory'].get(item_1, 0) >= qty_1 and not node_for_item_1:
                node_for_item_1 = node_id
            if node_data['inventory'].get(item_2, 0) >= qty_2 and not node_for_item_2:
                node_for_item_2 = node_id
                
        dist_1 = abs(fulfillment_nodes[node_for_item_1]['base_zone'] - customer_postal_zone) + 1
        dist_2 = abs(fulfillment_nodes[node_for_item_2]['base_zone'] - customer_postal_zone) + 1
        ship_1 = BASE_CARRIER_COST + (dist_1 * ZONE_RATE_MULTIPLIER)
        ship_2 = BASE_CARRIER_COST + (dist_2 * ZONE_RATE_MULTIPLIER)
        total_freight = ship_1 + ship_2
        
        total_split_cost = total_freight + SPLIT_SHIPMENT_PENALTY_USD
        
        candidate_routes.append({
            "routing_type": "SPLIT_SHIPMENT_UNAVOIDABLE",
            "nodes_involved": [node_for_item_1, node_for_item_2],
            "split_count": 2,
            "shipping_freight_usd": round(total_freight, 2),
            "split_penalties_usd": SPLIT_SHIPMENT_PENALTY_USD,
            "total_fulfillment_cost_usd": round(total_split_cost, 2)
        })
        
    # Select candidate with lowest total fulfillment cost
    optimal_route = min(candidate_routes, key=lambda x: x['total_fulfillment_cost_usd'])
    optimal_route["order_id"] = order_id
    optimal_route["customer_destination_zone"] = customer_postal_zone
    return optimal_route

# Warehouse Network State
network = {
    'FC-East-NJ':      {'base_zone': 2, 'inventory': {'SKU-HUB': 400, 'SKU-CAM': 150}},
    'FC-West-CA':      {'base_zone': 8, 'inventory': {'SKU-HUB': 500, 'SKU-CAM': 0}},
    'FC-Central-IL':   {'base_zone': 5, 'inventory': {'SKU-HUB': 300, 'SKU-CAM': 300}},
    'Store-NYC-Retail':{'base_zone': 1, 'inventory': {'SKU-HUB': 20,  'SKU-CAM': 15}}
}

# Order 1: Customer in Zone 2 ordering SKU-HUB + SKU-CAM
ord_1 = route_order_optimally("ORD-101", [('SKU-HUB', 1), ('SKU-CAM', 1)], 2, network)
# Order 2: Customer in Zone 8 ordering SKU-HUB + SKU-CAM (West Coast out of SKU-CAM)
ord_2 = route_order_optimally("ORD-102", [('SKU-HUB', 1), ('SKU-CAM', 1)], 8, network)

print("=== CAPSTONE: AUTONOMOUS OMS ORDER ROUTING DECISIONS ===")
print(f"Order: {ord_1['order_id']} (Dest Zone {ord_1['customer_destination_zone']}) -> Type: {ord_1['routing_type']}")
print(f"  Fulfillment Nodes: {ord_1['nodes_involved']} | Freight: ${ord_1['shipping_freight_usd']:.2f} | Total: ${ord_1['total_fulfillment_cost_usd']:.2f}")
print(f"Order: {ord_2['order_id']} (Dest Zone {ord_2['customer_destination_zone']}) -> Type: {ord_2['routing_type']}")
print(f"  Fulfillment Nodes: {ord_2['nodes_involved']} | Freight: ${ord_2['shipping_freight_usd']:.2f} | Total: ${ord_2['total_fulfillment_cost_usd']:.2f}")'''

    p2_output = """=== CAPSTONE: AUTONOMOUS OMS ORDER ROUTING DECISIONS ===
Order: ORD-101 (Dest Zone 2) -> Type: CONSOLIDATED_SINGLE_NODE
  Fulfillment Nodes: ['FC-East-NJ'] | Freight: $5.75 | Total: $5.75
Order: ORD-102 (Dest Zone 8) -> Type: CONSOLIDATED_SINGLE_NODE
  Fulfillment Nodes: ['FC-Central-IL'] | Freight: $8.60 | Total: $8.60"""

    p2_check = {
        "question": "In the Order 2 routing decision, why did the autonomous DOMS route the shipment from FC-Central-IL ($8.60) rather than splitting between FC-West-CA and FC-East-NJ?",
        "options": [
            "Because FC-Central-IL had both items in stock, allowing a single consolidated shipment that avoided the $4.50 split packaging penalty and duplicate freight",
            "Because California warehouses are legally prohibited from shipping electronics to Zone 8",
            "Because the customer explicitly requested slower delivery transit",
            "Because FC-East-NJ refused to answer the API webhook call"
        ],
        "answer": 0,
        "why": "A single consolidated shipment from FC-Central-IL incurs $8.60 in total freight. Splitting across FC-West-CA and FC-East-NJ would incur double carrier freight plus the $4.50 split penalty (totaling > $18.00)."
    }

    p2_example = "Target's modern DOMS routes over 80% of digital orders through its 1,900 retail stores using store-fulfill-from-store (SFS) logic. By routing orders to the closest store with complete inventory, Target reduced shipping distances by an average of 400 miles per parcel, slashing fulfillment costs by 30% while offering same-day curbside pickup."
    p2_tryit = "Set SKU-CAM inventory in FC-Central-IL to 0. Run the code to observe how the DOMS automatically triggers an unavoidable split shipment and calculates the financial penalty."
    p2_notes = [
        "Distributed Order Management Systems (DOMS) evaluate inventory completeness, zone distance, and workload in real time.",
        "Consolidated single-node fulfillment eliminates expensive split shipments and secondary packaging overhead.",
        "Carrier shipping freight scales proportionally with postal zone distance from the originating fulfillment node.",
        "Store-Fulfill-from-Store (SFS) turns retail brick-and-mortar stores into distributed local fulfillment hubs."
    ]

    parts.append({
        "title": "Autonomous OMS & Real-Time Multi-Warehouse Order Routing",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "check": p2_check,
        "example": p2_example,
        "tryIt": p2_tryit,
        "codeNotes": p2_notes
    })

    # Part 3: Real-Time Carrier Logistics, Predictive RTO Shield & Dynamic Payment Failover
    p3_say = [
        "In Part 3 of the Capstone, we engineer the high-stakes operational control mechanisms governing final fulfillment: Multi-Carrier Least-Cost Routing, Machine Learning RTO Shielding, and Multi-Gateway Payment Resilience. In digital commerce execution, once the warehouse associates pack an order into an optimized carton, the parcel enters the domestic transportation network. Relying on a single shipping carrier (such as sole reliance on FedEx or a single regional 3PL) exposes the enterprise to catastrophic operational risks: carrier strikes, holiday network gridlock, sudden price increases, and regional service outages. Modern fulfillment platforms integrate Multi-Carrier Shipping Software (such as ShipBob, ClickPost, or ShipStation) that executes Least-Cost Dynamic Carrier Allocation.",
        
        "The carrier allocation engine evaluates real-time API webhooks from multiple carriers (FedEx, UPS, USPS, Delhivery, Blue Dart) at the packing station scale. The system compares exact dimensional volumetric weights against negotiated contract rate cards, SLA transit commitments, and current on-time delivery percentages. If Carrier A is experiencing severe sorting hub delays in Chicago, the system instantly shifts outbound volume to Carrier B, guaranteeing delivery SLA compliance while capturing the lowest contractual linehaul rate.",
        
        "Concurrently, the engine enforces the Predictive Return-to-Origin (RTO) Shield for emerging market Cash on Delivery (COD) orders. In markets where COD accounts for thirty to sixty percent of transactions, unverified orders suffer delivery refusal rates exceeding thirty percent. The RTO Shield inspects customer address completeness, historical refusal ratios, and IP telemetry. For high-risk COD orders, the gateway mandates dynamic friction: sending automated WhatsApp/SMS one-time passwords (OTP) to verify intent, or offering instant 5% UPI/Card payment discounts to convert high-risk COD into guaranteed prepaid orders before the package leaves the dock.",
        
        "Simultaneously, at the digital checkout counter, the platform maintains Multi-Gateway Smart Payment Routing with automated sub-second failover. If the primary payment acquiring bank experiences a latency spike or authorization drop below eighty-five percent, the payment orchestration layer instantly routes subsequent card transactions through secondary backup payment rails, preventing thousands of dollars in checkout abandonment.",
        
        "In our institutional Python model for Part 3, we build an integrated Logistics and Risk Control Tower. The engine evaluates carrier rate cards, applies volumetric weight billing, screens Cash on Delivery orders through predictive RTO risk scoring, and executes automated payment gateway failover. Review the deterministic code below."
    ]

    p3_code = '''def run_logistics_and_risk_control_tower(
    carrier_bids: list,
    package_dims_cm: tuple,
    actual_weight_kg: float,
    is_cod_order: bool,
    customer_rto_risk_score: float # 0.0 (Safe) to 1.0 (Extreme risk)
) -> dict:
    """
    Logistics & Risk Control Tower:
    Executes dimensional weight billing, dynamic multi-carrier rate selection,
    and automated COD RTO risk intervention.
    """
    length, width, height = package_dims_cm
    # Volumetric weight divisor = 5000 (standard IATA express)
    volumetric_weight_kg = (length * width * height) / 5000.0
    chargeable_weight_kg = max(actual_weight_kg, volumetric_weight_kg)
    
    # Dynamic carrier selection: Filter by reliability >= 94% then choose lowest rate
    eligible_carriers = [c for c in carrier_bids if c['on_time_reliability_pct'] >= 94.0]
    
    scored_carriers = []
    for c in eligible_carriers:
        freight_cost = c['base_fee_usd'] + (chargeable_weight_kg * c['rate_per_kg_usd'])
        scored_carriers.append({
            "carrier_name": c['carrier_name'],
            "freight_cost_usd": round(freight_cost, 2),
            "transit_days": c['transit_days'],
            "reliability_pct": c['on_time_reliability_pct']
        })
        
    selected_carrier = min(scored_carriers, key=lambda x: x['freight_cost_usd'])
    
    # COD RTO Defense Protocol
    cod_intervention_applied = None
    order_approved_for_dispatch = True
    
    if is_cod_order:
        if customer_rto_risk_score > 0.65:
            # High risk COD: Convert to prepaid or cancel
            cod_intervention_applied = "MANDATORY_OTP_OR_PREPAID_CONVERSION_REQUIRED"
            order_approved_for_dispatch = False
        elif customer_rto_risk_score > 0.35:
            cod_intervention_applied = "AUTOMATED_WHATSAPP_CONFIRMATION_VERIFIED"
            order_approved_for_dispatch = True
        else:
            cod_intervention_applied = "LOW_RISK_DIRECT_DISPATCH"
            order_approved_for_dispatch = True
            
    return {
        "chargeable_weight_kg": round(chargeable_weight_kg, 2),
        "volumetric_weight_kg": round(volumetric_weight_kg, 2),
        "selected_carrier": selected_carrier['carrier_name'],
        "freight_cost_usd": selected_carrier['freight_cost_usd'],
        "transit_days": selected_carrier['transit_days'],
        "is_cod": is_cod_order,
        "cod_intervention": cod_intervention_applied,
        "dispatch_approved": order_approved_for_dispatch
    }

# Carrier quotes for a 35x25x20 cm parcel, actual weight 2.2 kg
bids = [
    {'carrier_name': 'Express_Air_Cargo', 'base_fee_usd': 4.50, 'rate_per_kg_usd': 2.80, 'transit_days': 2, 'on_time_reliability_pct': 97.5},
    {'carrier_name': 'National_Surface_3PL','base_fee_usd': 3.20, 'rate_per_kg_usd': 1.60, 'transit_days': 4, 'on_time_reliability_pct': 95.0},
    {'carrier_name': 'Budget_Courier_Line', 'base_fee_usd': 2.50, 'rate_per_kg_usd': 1.20, 'transit_days': 6, 'on_time_reliability_pct': 88.0} # Low reliability
]

# Scenario 1: Low-risk prepaid parcel
res_prepaid = run_logistics_and_risk_control_tower(bids, (35, 25, 20), 2.2, False, 0.10)
# Scenario 2: High-risk COD parcel
res_cod_high_risk = run_logistics_and_risk_control_tower(bids, (35, 25, 20), 2.2, True, 0.78)

print("=== CAPSTONE: LOGISTICS & COD RTO CONTROL TOWER ===")
print(f"Parcel Chargeable Weight: {res_prepaid['chargeable_weight_kg']} kg (Volumetric: {res_prepaid['volumetric_weight_kg']} kg)")
print(f"Prepaid Order: Carrier -> {res_prepaid['selected_carrier']} (${res_prepaid['freight_cost_usd']:.2f}, {res_prepaid['transit_days']}d) | Approved: {res_prepaid['dispatch_approved']}")
print(f"High-Risk COD: Carrier -> {res_cod_high_risk['selected_carrier']} | Intervention: {res_cod_high_risk['cod_intervention']} | Approved: {res_cod_high_risk['dispatch_approved']}")'''

    p3_output = """=== CAPSTONE: LOGISTICS & COD RTO CONTROL TOWER ===
Parcel Chargeable Weight: 3.5 kg (Volumetric: 3.5 kg)
Prepaid Order: Carrier -> National_Surface_3PL ($8.80, 4d) | Approved: True
High-Risk COD: Carrier -> National_Surface_3PL | Intervention: MANDATORY_OTP_OR_PREPAID_CONVERSION_REQUIRED | Approved: False"""

    p3_check = {
        "question": "Why did the logistics routing algorithm select National_Surface_3PL ($8.80) rather than Budget_Courier_Line, which offered an even cheaper rate?",
        "options": [
            "Budget_Courier_Line was disqualified because its 88% on-time reliability score fell below the mandatory 94% SLA threshold",
            "Budget_Courier_Line only accepts payments in gold bullion",
            "National_Surface_3PL is owned by the e-commerce company's founder",
            "The customer explicitly requested delivery by National_Surface_3PL"
        ],
        "answer": 0,
        "why": "Carrier routing engines balance cost against reliability. Budget_Courier_Line had an 88% reliability score, violating the 94% SLA requirement. National_Surface_3PL was the lowest-cost carrier meeting reliability standards."
    }

    p3_example = "Meesho deployed an AI RTO Shield across millions of unbanked tier-3 and tier-4 Indian consumers. By identifying high-risk COD orders and triggering automated vernacular IVR phone calls and WhatsApp confirmations, Meesho reduced RTO delivery failure rates from 34% to under 18%, saving over $60 million in reverse logistics freight."
    p3_tryit = "Modify package dimensions to (20, 15, 10) cm and actual weight to 4.0 kg. Observe how actual physical weight exceeds volumetric weight, becoming the new chargeable basis."
    p3_notes = [
        "Chargeable freight weight is strictly the maximum of physical scale weight and dimensional volumetric weight.",
        "Dynamic carrier routing balances linehaul cost against real-time carrier SLA reliability thresholds (> 94%).",
        "Predictive RTO scoring blocks high-risk COD dispatches until confirmed via automated OTP or converted to prepaid.",
        "Payment orchestration layers execute instant sub-second failover between acquiring banks to protect checkout conversion."
    ]

    parts.append({
        "title": "Real-Time Carrier Logistics, Predictive RTO Shield & Dynamic Payment Failover",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "check": p3_check,
        "example": p3_example,
        "tryIt": p3_tryit,
        "codeNotes": p3_notes
    })

    # Part 4: Black Friday Cyber Monday (BFCM) 100,000-Order Mega-Sale Stress Test
    p4_say = [
        "In Part 4 of the Capstone, we subject our entire integrated autonomous commerce engine to the ultimate corporate stress test: The Black Friday Cyber Monday (BFCM) 100,000-Order Mega-Sale Simulation. In global retail, the four-day shopping period between Thanksgiving and Cyber Monday can account for up to thirty to forty percent of an e-commerce brand's entire annual net operating profit. During BFCM, every single operational subsystem is pushed to its absolute breaking point: storefront edge traffic surges by two thousand percent; checkout payment gateways process hundreds of authorizations per second; warehouse picking lines operate on 24/7 continuous shifts; carrier linehaul hubs face extreme volumetric congestion; and reverse logistics returns begin accumulating within forty-eight hours of first deliveries.",
        
        "A system failure during BFCM is not merely a technical inconvenience; it is an existential business catastrophe. Ten minutes of storefront downtime or payment gateway failure during peak hours can vaporize millions of dollars in gross revenue and cause irrevocable brand damage. To survive and dominate BFCM, institutional enterprises run pre-holiday End-to-End Stress Simulations that simulate the full lifecycle of hundreds of thousands of concurrent transactions across every architectural node.",
        
        "Our Capstone simulation models the complete operational lifecycle of a one-hundred-thousand-order peak BFCM event: First, Front-End Traffic & Concurrency Ingestion—processing one million unique shopper sessions with edge caching and virtual queue admission; Second, Distributed Checkout & Payment Gateway Settlement—authorizing transactions across multi-gateway rails, deducting merchant discount rates (MDR), and executing 3DS2 risk checks; Third, Autonomous DOMS Inventory Routing—allocating orders across regional fulfillment centers, avoiding split shipments, and decrementing stock via Redis in-memory locks; Fourth, Multi-Carrier Logistics Dispatch—applying volumetric weight billing and mitigating carrier bottlenecks; Fifth, AI Customer Support Deflection—deflecting post-purchase WISMO inquiries using autonomous AI agents; and Sixth, Reverse Logistics Closed-Loop Recovery—processing expected return cohorts and recovering Grade A inventory capital.",
        
        "Review the institutional Python model below to execute the complete one-hundred-thousand-order BFCM stress test simulation and evaluate consolidated enterprise performance."
    ]

    p4_code = '''def simulate_bfcm_mega_sale_stress_test(
    total_orders_placed: int,
    avg_order_value_usd: float,
    gross_margin_pct: float
) -> dict:
    """
    Grand BFCM Mega-Sale Stress Simulation (100,000 Orders):
    Executes full-loop operations from checkout payment settlement,
    DOMS allocation, multi-carrier shipping, AI support, to reverse returns.
    """
    total_gross_gmv = total_orders_placed * avg_order_value_usd
    total_cogs = total_gross_gmv * (1.0 - gross_margin_pct)
    gross_profit_baseline = total_gross_gmv * gross_margin_pct
    
    # 1. Payment Gateway MDR & Fees (1.85% blended)
    payment_gateway_fees = total_gross_gmv * 0.0185
    
    # 2. Fulfillment & Warehousing Operations
    # Pick, pack & carton box cost = $4.20 per order
    # Single consolidated shipments = 92%; Split shipments (8%) incur +$4.50 penalty
    consolidated_orders = int(total_orders_placed * 0.92)
    split_orders = total_orders_placed - consolidated_orders
    warehouse_labor_and_packaging = (total_orders_placed * 4.20) + (split_orders * 4.50)
    
    # 3. Outbound Multi-Carrier Logistics Freight
    # Average linehaul freight = $6.80 per consolidated package; splits require 2 packages
    total_packages_shipped = consolidated_orders + (split_orders * 2)
    outbound_carrier_freight = total_packages_shipped * 6.80
    
    # 4. Customer Support Operations (AI deflected + Tier 2)
    # 12% inquiry rate; 75% deflected by AI ($0.20), 25% human agent ($5.50)
    total_inquiries = int(total_orders_placed * 0.12)
    deflected_by_ai = int(total_inquiries * 0.75)
    escalated_to_human = total_inquiries - deflected_by_ai
    support_overhead = (deflected_by_ai * 0.20) + (escalated_to_human * 5.50)
    
    # 5. Reverse Logistics & Returns Management
    # 15% return rate on BFCM orders; $24.50 processing cost per returned unit
    # 70% recovered through Grade A restock and refurbishment
    returned_units = int(total_orders_placed * 0.15)
    gross_returned_gmv = returned_units * avg_order_value_usd
    reverse_processing_cost = returned_units * 24.50
    recovered_inventory_capital = (gross_returned_gmv * 0.70) - reverse_processing_cost
    net_return_loss = (gross_returned_gmv * gross_margin_pct) + reverse_processing_cost - (gross_returned_gmv * 0.70)
    
    # Consolidated Financial P&L
    total_operating_expenses = (
        payment_gateway_fees +
        warehouse_labor_and_packaging +
        outbound_carrier_freight +
        support_overhead +
        reverse_processing_cost
    )
    
    net_operating_profit = gross_profit_baseline - total_operating_expenses - (returned_units * avg_order_value_usd * gross_margin_pct * 0.30)
    net_operating_margin_pct = (net_operating_profit / total_gross_gmv) * 100.0
    
    return {
        "orders_fulfilled": total_orders_placed,
        "gross_gmv_usd": round(total_gross_gmv, 2),
        "total_cogs_usd": round(total_cogs, 2),
        "gross_profit_baseline_usd": round(gross_profit_baseline, 2),
        "payment_gateway_mdr_usd": round(payment_gateway_fees, 2),
        "warehouse_fulfillment_usd": round(warehouse_labor_and_packaging, 2),
        "outbound_freight_usd": round(outbound_carrier_freight, 2),
        "customer_support_usd": round(support_overhead, 2),
        "reverse_logistics_expense_usd": round(reverse_processing_cost, 2),
        "total_operating_expenses_usd": round(total_operating_expenses, 2),
        "net_operating_profit_usd": round(net_operating_profit, 2),
        "net_operating_margin_pct": round(net_operating_margin_pct, 2),
        "total_packages_dispatched": total_packages_shipped,
        "split_shipment_rate_pct": 8.0,
        "ai_support_deflection_pct": 75.0,
        "returned_units_processed": returned_units
    }

# Execute 100,000 order BFCM Stress Test at $85 AOV and 58% gross margin
bfcm_results = simulate_bfcm_mega_sale_stress_test(
    total_orders_placed=100000,
    avg_order_value_usd=85.0,
    gross_margin_pct=0.58
)

print("=== GRAND BFCM 100,000-ORDER MEGA-SALE STRESS TEST RESULTS ===")
print(f"Total Orders Fulfilled: {bfcm_results['orders_fulfilled']:,} orders")
print(f"Gross Merchandise Value (GMV): ${bfcm_results['gross_gmv_usd']:,.2f}")
print(f"Gross Profit Baseline: ${bfcm_results['gross_profit_baseline_usd']:,.2f}")
print(f"Total Operating Expenses: ${bfcm_results['total_operating_expenses_usd']:,.2f}")
print(f"  - Outbound Carrier Freight: ${bfcm_results['outbound_freight_usd']:,.2f} ({bfcm_results['total_packages_dispatched']:,} packages)")
print(f"  - Warehouse Pick/Pack Labor: ${bfcm_results['warehouse_fulfillment_usd']:,.2f}")
print(f"  - Reverse Logistics Costs: ${bfcm_results['reverse_logistics_expense_usd']:,.2f} ({bfcm_results['returned_units_processed']:,} returns)")
print(f"  - Payment Gateway MDR (1.85%): ${bfcm_results['payment_gateway_mdr_usd']:,.2f}")
print(f"  - AI Customer Support Overhead: ${bfcm_results['customer_support_usd']:,.2f} (75% AI Deflected)")
print(f"Net Operating Profit Realized: ${bfcm_results['net_operating_profit_usd']:,.2f}")
print(f"Final Net Operating Margin: {bfcm_results['net_operating_margin_pct']}% (Target: > 30%)")'''

    p4_output = """=== GRAND BFCM 100,000-ORDER MEGA-SALE STRESS TEST RESULTS ===
Total Orders Fulfilled: 100,000 orders
Gross Merchandise Value (GMV): $8,500,000.00
Gross Profit Baseline: $4,930,000.00
Total Operating Expenses: $1,733,450.00
  - Outbound Carrier Freight: $734,400.00 (108,000 packages)
  - Warehouse Pick/Pack Labor: $456,000.00
  - Reverse Logistics Costs: $367,500.00 (15,000 returns)
  - Payment Gateway MDR (1.85%): $157,250.00
  - AI Customer Support Overhead: $18,300.00 (75% AI Deflected)
Net Operating Profit Realized: $2,974,700.00
Final Net Operating Margin: 35.0% (Target: > 30%)"""

    p4_check = {
        "question": "In the 100,000-order BFCM stress test, what was the single largest operating expense incurred by the enterprise?",
        "options": [
            "Customer service software licensing",
            "Outbound carrier logistics freight ($734,400.00 for 108,000 packages)",
            "Credit card payment gateway merchant discount rates",
            "Warehouse cardboard packing tape"
        ],
        "answer": 1,
        "why": "Outbound carrier freight represents the largest single operational expense ($734,400.00), demonstrating why dynamic multi-carrier rate optimization and split shipment minimization are vital to net profitability."
    }

    p4_example = "Shopify merchants generated $9.3 billion in GMV during a single Black Friday Cyber Monday weekend, processing over 61 million items across 175 countries with 99.999% platform uptime. The unified execution of edge caching, in-memory inventory locks, and multi-carrier label generation enabled thousands of independent brands to operate at Amazon-scale efficiency."
    p4_tryit = "Increase split_orders from 8% to 25% by simulating poor multi-warehouse inventory balancing. Observe how outbound freight and warehouse labor surge, eroding net operating profit."
    p4_notes = [
        "BFCM mega-sales test all operational systems under 10x-20x baseline transaction volumes.",
        "Outbound carrier logistics and reverse logistics represent over 65% of total operating fulfillment expenses.",
        "AI customer support deflection protects operating margins, holding CX costs under 0.25% of gross revenue.",
        "Consolidated single-node fulfillment preserves millions in freight and packaging expenses during peak spikes."
    ]

    parts.append({
        "title": "Black Friday Cyber Monday (BFCM) 100,000-Order Mega-Sale Stress Test",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "check": p4_check,
        "example": p4_example,
        "tryIt": p4_tryit,
        "codeNotes": p4_notes
    })

    # Part 5: Grand Milestone 2 Capstone & Accreditation: Certified E-Commerce Supply Chain Architect
    p5_say = [
        "Congratulations on reaching the final capstone component of Day 15: The Grand Milestone 2 Capstone Accreditation as a Certified E-Commerce Supply Chain Operations Architect (CES-COA). Over the past fifteen comprehensive days, you have completed the rigorous academic and practical curriculum of Course 27: B.Com E-Commerce and Digital Business. You have transitioned from high-level retail theories into the uncompromising mathematical and algorithmic realities of institutional digital commerce.",
        
        "To graduate as a certified architect, you must demonstrate total mastery across the Four Pillars of Modern Digital Commerce Engineering: Pillar One is Demand Merchandising & Conversion Infrastructure—engineering frictionless single-page checkouts, tokenized PCI-compliant payment gateways, Google Core Web Vitals sub-second page performance, and composable headless GraphQL architectures; Pillar Two is Distributed Inventory Mathematics & Order Orchestration—governing stochastic safety stock thresholds, Reorder Points, Economic Order Quantities, multi-node DOMS allocation, and race-condition-free Redis inventory locking; Pillar Three is Transportation Logistics, Delivery SLAs & Fraud Defense—deploying least-cost multi-carrier routing, predictive RTO shields, dimensional volumetric pricing, and automated RMA state machines; and Pillar Four is Multi-Marketplace Economics & Customer Lifetime Value—winning Amazon and Walmart Buy Boxes through algorithmic repricing, transacting over decentralized Beckn protocols on ONDC, and maintaining sub-minute customer support SLAs via autonomous LLM agents.",
        
        "The Chief Commerce Officer (CCO) and Executive Accreditation Board evaluate candidate systems against the Autonomous Commerce Composite Index (ACCI). The ACCI synthesizes five fundamental operational benchmarks: First, Funnel Checkout Conversion Rate (> 2.5%); Second, On-Time Delivery SLA Compliance (> 95%); Third, Order Defect Rate (< 0.5%); Fourth, Support Contribution Index (> 3.0x); and Fifth, Net Operating Contribution Margin (> 30%). When an enterprise maintains an ACCI above ninety-two points, it operates as a best-in-class, self-sustaining commercial powerhouse.",
        
        "By mastering these quantitative principles, you possess the operational authority to architect, scale, and lead multi-billion-dollar direct-to-consumer brands, global marketplace merchant operations, and enterprise digital transformation initiatives across the international digital economy.",
        
        "In our final Python simulation for Day 15, we execute the Autonomous Commerce Composite Index (ACCI) Accreditation Audit. The engine evaluates the consolidated performance telemetry across all fifteen days of operational metrics, computes weighted scores across all four pillars, and deterministically renders the final Executive Accreditation Certificate. Review the complete institutional implementation below."
    ]

    p5_code = '''def evaluate_milestone2_capstone_accreditation(
    metrics: dict
) -> dict:
    """
    Grand Milestone 2 Capstone Accreditation Engine:
    Evaluates institutional telemetry across Conversion, OMS, Logistics,
    Marketplace, and Customer Support to award CES-COA Accreditation.
    """
    # 1. Pillar 1: Conversion & Tech Stack (Max 25 pts)
    # Target: Conv >= 2.4%, LCP <= 1.2s, Edge Cache >= 90%
    conv_score = min(10.0, (metrics['checkout_conversion_pct'] / 2.5) * 10.0)
    speed_score = min(8.0, (1.5 / max(0.8, metrics['lcp_seconds'])) * 8.0)
    cache_score = min(7.0, (metrics['edge_cache_hit_pct'] / 90.0) * 7.0)
    p1_total = conv_score + speed_score + cache_score
    
    # 2. Pillar 2: OMS & Inventory Mathematics (Max 25 pts)
    # Target: Split rate <= 10%, Stockout rate <= 1.0%, In-Stock CSL >= 98%
    split_score = max(0.0, 10.0 - (metrics['split_shipment_pct'] - 5.0) * 0.8)
    stockout_score = max(0.0, 15.0 - (metrics['stockout_rate_pct'] * 10.0))
    p2_total = split_score + stockout_score
    
    # 3. Pillar 3: Logistics & Fraud Defense (Max 25 pts)
    # Target: Carrier on-time >= 95%, RTO rate <= 8%, Volumetric cost efficiency >= 90%
    logistics_score = min(12.0, (metrics['carrier_on_time_pct'] / 95.0) * 12.0)
    rto_defense_score = max(0.0, 13.0 - (metrics['rto_rate_pct'] * 1.2))
    p3_total = logistics_score + rto_defense_score
    
    # 4. Pillar 4: Marketplace, ONDC & CX SLAs (Max 25 pts)
    # Target: Buy Box win rate >= 75%, AI deflection >= 70%, CSAT >= 90%
    buy_box_score = min(10.0, (metrics['buy_box_win_pct'] / 75.0) * 10.0)
    cx_ai_score = min(8.0, (metrics['ai_cx_deflection_pct'] / 70.0) * 8.0)
    csat_score = min(7.0, (metrics['csat_pct'] / 90.0) * 7.0)
    p4_total = buy_box_score + cx_ai_score + csat_score
    
    acci_composite_score = p1_total + p2_total + p3_total + p4_total
    
    accreditation_granted = acci_composite_score >= 85.0
    
    return {
        "candidate_title": "Certified E-Commerce Supply Chain Operations Architect (CES-COA)",
        "accreditation_status": "CONFERRED_WITH_DISTINCTION" if acci_composite_score >= 90.0 else ("CONFERRED_STANDARD" if accreditation_granted else "DEFERRED"),
        "acci_composite_score": round(acci_composite_score, 2),
        "pillars": {
            "pillar_1_conversion_and_tech": round(p1_total, 2),
            "pillar_2_oms_and_inventory": round(p2_total, 2),
            "pillar_3_logistics_and_rto": round(p3_total, 2),
            "pillar_4_marketplace_and_cx": round(p4_total, 2)
        },
        "executive_board_signoff": "CHIEF_COMMERCE_OFFICER_APPROVED"
    }

# Institutional telemetry across all 15 days of operations
telemetry = {
    'checkout_conversion_pct': 2.55,
    'lcp_seconds': 0.95,
    'edge_cache_hit_pct': 92.5,
    'split_shipment_pct': 7.8,
    'stockout_rate_pct': 0.35,
    'carrier_on_time_pct': 96.8,
    'rto_rate_pct': 5.2,
    'buy_box_win_pct': 82.0,
    'ai_cx_deflection_pct': 73.5,
    'csat_pct': 92.8
}

audit_report = evaluate_milestone2_capstone_accreditation(telemetry)

print("=" * 75)
print("  OFFICIAL ACCREDITATION: B.COM E-COMMERCE & DIGITAL BUSINESS")
print("  MILESTONE 2 GRAND CAPSTONE: CES-COA BOARD CERTIFICATION")
print("=" * 75)
print(f"Professional Title: {audit_report['candidate_title']}")
print(f"Accreditation Status: {audit_report['accreditation_status']}")
print(f"Autonomous Commerce Composite Index (ACCI): {audit_report['acci_composite_score']} / 100.00 pts")
print()
print("Pillar Score Breakdown:")
print(f"  Pillar 1 (Conversion & Headless Tech): {audit_report['pillars']['pillar_1_conversion_and_tech']:5.2f} / 25.00 pts")
print(f"  Pillar 2 (OMS & Inventory Mathematics):{audit_report['pillars']['pillar_2_oms_and_inventory']:5.2f} / 25.00 pts")
print(f"  Pillar 3 (Logistics & RTO Defense):    {audit_report['pillars']['pillar_3_logistics_and_rto']:5.2f} / 25.00 pts")
print(f"  Pillar 4 (Marketplaces, ONDC & CX):    {audit_report['pillars']['pillar_4_marketplace_and_cx']:5.2f} / 25.00 pts")
print()
print(f"Executive Board Decision: {audit_report['executive_board_signoff']}")
print("=" * 75)'''

    p5_output = """===========================================================================
  OFFICIAL ACCREDITATION: B.COM E-COMMERCE & DIGITAL BUSINESS
  MILESTONE 2 GRAND CAPSTONE: CES-COA BOARD CERTIFICATION
===========================================================================
Professional Title: Certified E-Commerce Supply Chain Operations Architect (CES-COA)
Accreditation Status: CONFERRED_STANDARD
Autonomous Commerce Composite Index (ACCI): 88.02 / 100.00 pts

Pillar Score Breakdown:
  Pillar 1 (Conversion & Headless Tech): 25.00 / 25.00 pts
  Pillar 2 (OMS & Inventory Mathematics):19.26 / 25.00 pts
  Pillar 3 (Logistics & RTO Defense):    18.76 / 25.00 pts
  Pillar 4 (Marketplaces, ONDC & CX):    25.00 / 25.00 pts

Executive Board Decision: CHIEF_COMMERCE_OFFICER_APPROVED
==========================================================================="""

    p5_check = {
        "question": "What does achieving an Autonomous Commerce Composite Index (ACCI) score of 88.02 indicate for an e-commerce enterprise?",
        "options": [
            "That the company is losing money on 88.02% of its transactions",
            "That the enterprise operates at an institutional standard of digital commerce execution, demonstrating strong proficiency across conversion tech, inventory math, logistics routing, and marketplace operations",
            "That the company must lay off 88.02% of its workforce",
            "That the website will be blocked by internet service providers"
        ],
        "answer": 1,
        "why": "An ACCI score of 88.02 reflects strong, balanced execution across all four operational pillars: headless speed, inventory completeness, carrier reliability, and marketplace Buy Box dominance."
    }

    p5_example = "Amazon's Senior Vice President of Worldwide Operations uses composite performance indexes similar to ACCI to monitor global fulfillment centers and regional carrier nodes during holiday peaks, maintaining four-pillar operational equilibrium across billions of parcels annually."
    p5_tryit = "Modify stockout_rate_pct to 2.5% and rto_rate_pct to 14.0% to observe how inventory and fraud penalties degrade the ACCI score below the distinction threshold."
    p5_notes = [
        "The Autonomous Commerce Composite Index (ACCI) benchmarks holistic multi-channel operational execution.",
        "Pillar 1 evaluates conversion rates, Core Web Vitals LCP, and edge caching efficiency.",
        "Pillar 2 measures split-shipment minimization, safety stock compliance, and inventory turnover.",
        "Pillar 3 and 4 audit carrier on-time reliability, RTO defense, Buy Box win rates, and AI support deflection."
    ]

    parts.append({
        "title": "Grand Milestone 2 Capstone Accreditation: Certified E-Commerce Supply Chain Architect",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "check": p5_check,
        "example": p5_example,
        "tryIt": p5_tryit,
        "codeNotes": p5_notes
    })

    day15_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 15,
        "title": "Milestone 2 Capstone: Autonomous Supply Chain, OMS, Logistics & Marketplace Operations Engine",
        "goal": "Synthesize and master end-to-end e-commerce supply chain operations: inbound procurement landed cost modeling, multi-channel virtual stock pooling, autonomous DOMS routing, carrier least-cost allocation, predictive RTO shielding, 100,000-order BFCM stress testing, and Certified E-Commerce Supply Chain Operations Architect (CES-COA) accreditation.",
        "minutes": 40,
        "recap": "Welcome to the Milestone 2 Grand Capstone of B.Com E-Commerce & Digital Business. Today we synthesized checkout engineering, inventory replenishment, warehouse fulfillment, carrier routing, reverse logistics, marketplace repricing, headless architecture, and AI support into an autonomous multi-channel commerce operating engine.",
        "parts": parts,
        "summary": [
            "Autonomous Distributed Order Management (DOMS) routes orders dynamically to minimize split shipments and cross-zonal carrier surcharges.",
            "Multi-channel virtual stock pooling synchronizes real-time inventory buffers across Amazon, Walmart, ONDC, and D2C storefronts.",
            "High-throughput fulfillment orchestration combines 3D cartonization, wave picking, and automated carrier routing for peak BFCM volume.",
            "Automated RMA inspection and reverse recommerce capture secondary resale capital while forensic anti-fraud rules shield net earnings.",
            "The Autonomous Commerce Composite Index (ACCI) certifies comprehensive operational excellence across all four supply chain pillars."
        ]
    }

    total_words = ensure_ecom_day_budget(day15_dict, min_part_words=580, min_day_words=2950)
    return day15_dict, total_words

if __name__ == '__main__':
    d, words = build_day15()
    print(f"Day 15 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
