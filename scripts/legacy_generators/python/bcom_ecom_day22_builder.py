"""
Day 22 Builder: Omnichannel Retail Integration (BOPIS, Ship-from-Store & Curbside Pickup): Endless Aisle & Physical Store Inventory Sync
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-817
"""

import os
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day22():
    parts = []

    # Part 1: Unified Commerce Architecture: Merging Brick-and-Mortar POS with Digital Storefronts & Single-Pool Real-Time Inventory
    p1_say = [
        "Welcome to Day 22 of B.Com E-Commerce and Digital Business. Today, we investigate one of the most transformative strategic evolutions in contemporary retail: Unified Omnichannel Commerce. For decades, traditional retailers operated physical brick-and-mortar stores and digital e-commerce storefronts as completely siloed business units, maintaining separate inventory databases, distinct Point of Sale (POS) terminals, and competing commercial profit-and-loss (P&L) statements. This operational bifurcation created severe consumer friction: a customer examining a product online could not verify if it was available at their local boutique, while in-store associates could not access digital customer purchase histories.",
        
        "Modern enterprise retail overcomes this friction by implementing Unified Commerce: consolidating physical store POS systems, native mobile applications, social commerce feeds, and web storefronts onto a Single-Pool Centralized Inventory Engine. In a unified architecture, inventory is not locked into rigid departmental silos. Every physical store shelf, backroom storage rack, regional cross-dock facility, and centralized automated fulfillment center is treated as an active, interconnected node in a distributed supply network. When a cashier scans a barcode at a brick-and-mortar checkout counter in Chicago, the event streams via WebSocket or event message bus (such as Apache Kafka) to the centralized inventory ledger, instantly decrementing available-to-promise (ATP) inventory across all global digital channels in under two hundred milliseconds.",
        
        "However, merging physical and digital inventory introduces severe concurrency and race condition vulnerabilities. If a physical store has exactly one coat remaining on the rack, a shopper inside the store might be carrying it toward the cash register at the exact moment an online customer in another state clicks 'Place Order'. To prevent catastrophic overselling and backorder cancellations, omnichannel inventory architects implement Dynamic Store Safety Buffers. The system reserves a mathematical safety buffer (typically 1 to 2 units on low-velocity SKUs, or 5% of stock) that is hidden from digital storefronts, reserving physical floor inventory exclusively for walk-in store traffic while exposing only reliable buffer-cleared inventory to online channels.",
        
        "In our institutional Python model for Part 1, we simulate a unified commerce inventory gateway processing concurrent in-store POS checkout events and digital web reservations. The engine calculates available-to-promise (ATP) inventory, applies dynamic safety stock buffers, detects concurrency conflicts, and prevents digital overselling. Review the deterministic code below to master unified inventory mechanics."
    ]

    p1_code = '''def simulate_unified_pos_and_digital_inventory_sync(
    store_nodes: dict,
    concurrent_transactions: list[dict]
) -> dict:
    """
    Unified Commerce Inventory Gateway & POS Synchronization Engine.
    Processes concurrent in-store POS scans and online reservations against unified inventory.
    """
    sync_audit = []
    oversell_preventions = 0
    successful_pos_sales = 0
    successful_web_allocations = 0
    
    for tx in concurrent_transactions:
        store_id = tx['store_id']
        sku = tx['sku']
        channel = tx['channel'] # 'STORE_POS' or 'DIGITAL_WEB'
        requested_qty = tx['quantity']
        
        store = store_nodes.get(store_id, {})
        inventory_record = store.get('inventory', {}).get(sku, {'on_hand': 0, 'safety_buffer': 1})
        
        on_hand = inventory_record['on_hand']
        buffer = inventory_record['safety_buffer']
        
        # In-store POS has priority over physical inventory on the floor
        if channel == 'STORE_POS':
            if on_hand >= requested_qty:
                inventory_record['on_hand'] -= requested_qty
                successful_pos_sales += 1
                status = 'POS_COMPLETED_REGISTER_SALE'
            else:
                status = 'POS_FAILED_STOCK_DEFICIT'
        elif channel == 'DIGITAL_WEB':
            # Digital can only allocate what exceeds the physical safety buffer
            available_to_promise = max(0, on_hand - buffer)
            if available_to_promise >= requested_qty:
                inventory_record['on_hand'] -= requested_qty
                successful_web_allocations += 1
                status = 'WEB_RESERVED_FOR_STORE_PICKUP'
            else:
                oversell_preventions += 1
                status = 'WEB_ORDER_SUPPRESSED_BUFFER_PROTECTED'
                
        sync_audit.append({
            'tx_id': tx['tx_id'],
            'store_id': store_id,
            'sku': sku,
            'channel': channel,
            'status': status,
            'remaining_on_hand': inventory_record['on_hand']
        })
        
    return {
        'total_transactions_processed': len(concurrent_transactions),
        'successful_pos_sales': successful_pos_sales,
        'successful_web_allocations': successful_web_allocations,
        'oversell_preventions_enforced': oversell_preventions,
        'sample_sync_events': sync_audit[:3]
    }

mock_stores = {
    'STORE-CHI-01': {
        'name': 'Chicago Flagship',
        'inventory': {
            'SKU-COAT-RED': {'on_hand': 3, 'safety_buffer': 2}, # 3 total, 2 reserved for floor shoppers
            'SKU-JEANS-32': {'on_hand': 12, 'safety_buffer': 2}
        }
    }
}

mock_tx_stream = [
    {'tx_id': 'TX-101', 'store_id': 'STORE-CHI-01', 'sku': 'SKU-COAT-RED', 'channel': 'DIGITAL_WEB', 'quantity': 1}, # ATP=3-2=1 -> Success!
    {'tx_id': 'TX-102', 'store_id': 'STORE-CHI-01', 'sku': 'SKU-COAT-RED', 'channel': 'DIGITAL_WEB', 'quantity': 1}, # ATP=2-2=0 -> Suppressed!
    {'tx_id': 'TX-103', 'store_id': 'STORE-CHI-01', 'sku': 'SKU-COAT-RED', 'channel': 'STORE_POS',   'quantity': 1}, # POS buys from buffer -> Success!
    {'tx_id': 'TX-104', 'store_id': 'STORE-CHI-01', 'sku': 'SKU-JEANS-32',  'channel': 'DIGITAL_WEB', 'quantity': 2}  # ATP=12-2=10 -> Success!
]

sync_results = simulate_unified_pos_and_digital_inventory_sync(mock_stores, mock_tx_stream)

print("=== UNIFIED COMMERCE POS & INVENTORY SYNCHRONIZATION AUDIT ===")
print(f"Total Transactions Processed:   {sync_results['total_transactions_processed']}")
print(f"Successful Physical POS Sales:  {sync_results['successful_pos_sales']}")
print(f"Successful Digital Allocations: {sync_results['successful_web_allocations']}")
print(f"Oversell Preventions Enforced:  {sync_results['oversell_preventions_enforced']} (Protected floor stock)")
print()
print("Sample Event Stream Synchronization:")
for e in sync_results['sample_sync_events']:
    print(f"  [{e['tx_id']}] Channel: {e['channel']:<11} | SKU: {e['sku']} -> Status: [{e['status']}] (Stock Left: {e['remaining_on_hand']})")'''

    p1_output = """=== UNIFIED COMMERCE POS & INVENTORY SYNCHRONIZATION AUDIT ===
Total Transactions Processed:   4
Successful Physical POS Sales:  1
Successful Digital Allocations: 2
Oversell Preventions Enforced:  1 (Protected floor stock)

Sample Event Stream Synchronization:
  [TX-101] Channel: DIGITAL_WEB | SKU: SKU-COAT-RED -> Status: [WEB_RESERVED_FOR_STORE_PICKUP] (Stock Left: 2)
  [TX-102] Channel: DIGITAL_WEB | SKU: SKU-COAT-RED -> Status: [WEB_ORDER_SUPPRESSED_BUFFER_PROTECTED] (Stock Left: 2)
  [TX-103] Channel: STORE_POS   | SKU: SKU-COAT-RED -> Status: [POS_COMPLETED_REGISTER_SALE] (Stock Left: 1)"""

    p1_notes = [
        "The first digital reservation (TX-101) succeeded because available-to-promise inventory (1 unit) exceeded the safety buffer.",
        "The second digital order (TX-102) was dynamically suppressed because stock fell to 2 units, exactly matching the in-store floor buffer.",
        "The in-store POS transaction (TX-103) completed successfully at the physical register, proving safety buffer protection prevents walk-in stockouts."
    ]

    p1_check = {
        "question": "What is the primary operational role of an in-store Safety Buffer in a unified omnichannel inventory model?",
        "options": [
            "It holds back a small quantity of store stock from digital online channels to ensure walk-in physical shoppers do not encounter empty shelves",
            "It physically locks store doors when inventory levels drop below 10%",
            "It charges in-store customers an extra fee for buying products in person",
            "It automatically orders emergency inventory from competitors"
        ],
        "answer": 0,
        "why": "Safety buffers prevent digital orders from claiming the last few units on physical store shelves, protecting walk-in customer satisfaction while avoiding costly online order cancellations."
    }

    parts.append({
        "title": "Unified Commerce Architecture: Merging Brick-and-Mortar POS with Digital Storefronts & Single-Pool Real-Time Inventory",
        "say": p1_say,
        "example": "Zara's parent company Inditex connects all 2,000+ global stores to a single RFID inventory platform. Store stock is fully integrated with Zara.com; if an online customer orders a blazer that is sold out in central warehouses, Zara's DOMS instantly routes the fulfillment order to a local store where RFID tags guide associates to pick it in minutes.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Set safety_buffer to 0 for SKU-COAT-RED and observe how TX-102 succeeds while TX-103 later causes an in-store stock deficit.",
        "check": p1_check
    })

    # Part 2: Buy Online, Pick Up In-Store (BOPIS) & Curbside Fulfillment Workflows, In-Store Staging & Fulfillment SLA Tracking
    p2_say = [
        "Buy Online, Pick Up In-Store (BOPIS)—frequently extended into contactless Curbside Pickup or Drive-Up—has transformed consumer retail expectations. Originally pioneered as an emergency convenience during global supply disruptions, BOPIS has matured into a cornerstone of enterprise retail profitability. For consumers, BOPIS eliminates shipping fees and provides instant gratification, allowing shoppers to collect goods within one to two hours of purchase. For retailers, BOPIS eliminates outward parcel carrier delivery costs and packaging cardboard expenses, while driving lucrative in-store foot traffic.",
        
        "Executing BOPIS at scale requires a precision In-Store Fulfillment Pipeline governed by strict Service Level Agreements (SLAs). The workflow comprises five sequential operational stages: First, Real-Time Store Order Ingestion—the Distributed Order Management System (DOMS) transmits the order to associate handheld RF terminals at the assigned retail location; Second, Pick and Staging Wave—store team members navigate aisles using visual store-mapping software to pick the items from shelves within a forty-five-minute SLA; Third, Staging Bay / Smart Locker Placement—picked orders are scanned into temperature-controlled holding zones (ambient, chilled, frozen) or automated digital pickup lockers; Fourth, Automated Customer Arrival Telemetry—using geofencing and GPS mobile app triggers, the store system alerts associates when the customer is approaching the parking lot; and Fifth, Curbside Hand-Off—a designated runner delivers the order to the customer's vehicle trunk within a two-minute window.",
        
        "Furthermore, retail analysts rigorously track the Omnichannel Attach Rate. When a consumer walks into a physical store to retrieve a BOPIS parcel, industry studies prove that twenty-five to thirty-five percent of shoppers purchase additional impulse merchandise (such as snacks, accessories, or complementary apparel) before exiting the store. This high-margin cross-sell attach rate transforms the physical store from a pure cost center into a high-ROI customer conversion hub.",
        
        "In our institutional Python model for Part 2, we simulate an enterprise BOPIS and curbside fulfillment pipeline. The program tracks associate picking velocities, evaluates SLA breach risks, models geofenced customer arrival alerts, and calculates the incremental revenue generated through physical store cross-sell attach rates. Review the deterministic code below to master BOPIS operational engineering."
    ]

    p2_code = '''def model_bopis_curbside_fulfillment_pipeline(
    bopis_orders: list[dict],
    target_prep_sla_minutes: int,
    target_curbside_handoff_seconds: int
) -> dict:
    """
    BOPIS & Curbside Pickup Operations Pipeline.
    Monitors in-store picking velocity, staging compliance, and cross-sell attach revenue.
    """
    total_orders = len(bopis_orders)
    sla_on_time_preps = 0
    curbside_runner_passes = 0
    total_bopis_gmv_usd = 0.0
    total_in_store_attach_gmv_usd = 0.0
    
    for order in bopis_orders:
        prep_time = order['actual_pick_and_stage_minutes']
        handoff_time = order['actual_curbside_handoff_seconds']
        order_value = order['order_value_usd']
        cross_sell_attach = order.get('in_store_impulse_purchase_usd', 0.0)
        
        total_bopis_gmv_usd += order_value
        total_in_store_attach_gmv_usd += cross_sell_attach
        
        # Check Prep SLA (e.g. ready in <= 45 mins)
        prep_passed = prep_time <= target_prep_sla_minutes
        if prep_passed:
            sla_on_time_preps += 1
            
        # Check Curbside Handoff SLA (e.g. car delivery in <= 120 seconds)
        handoff_passed = handoff_time <= target_curbside_handoff_seconds
        if handoff_passed:
            curbside_runner_passes += 1
            
        order['prep_sla_passed'] = prep_passed
        order['handoff_sla_passed'] = handoff_passed
        order['total_store_realized_revenue_usd'] = round(order_value + cross_sell_attach, 2)
        
    prep_compliance_pct = (sla_on_time_preps / total_orders) * 100.0 if total_orders > 0 else 0.0
    curbside_compliance_pct = (curbside_runner_passes / total_orders) * 100.0 if total_orders > 0 else 0.0
    attach_revenue_share_pct = (total_in_store_attach_gmv_usd / total_bopis_gmv_usd) * 100.0 if total_bopis_gmv_usd > 0 else 0.0
    
    return {
        'total_bopis_orders_audited': total_orders,
        'prep_sla_compliance_pct': round(prep_compliance_pct, 1),
        'curbside_handoff_compliance_pct': round(curbside_compliance_pct, 1),
        'total_bopis_gmv_usd': round(total_bopis_gmv_usd, 2),
        'in_store_attach_gmv_usd': round(total_in_store_attach_gmv_usd, 2),
        'attach_revenue_expansion_pct': round(attach_revenue_share_pct, 1),
        'sample_order_records': bopis_orders[:3]
    }

mock_bopis_pipeline = [
    {'order_id': 'BOPIS-801', 'order_value_usd': 85.0,  'actual_pick_and_stage_minutes': 28, 'actual_curbside_handoff_seconds': 95,  'in_store_impulse_purchase_usd': 24.50},
    {'order_id': 'BOPIS-802', 'order_value_usd': 140.0, 'actual_pick_and_stage_minutes': 42, 'actual_curbside_handoff_seconds': 110, 'in_store_impulse_purchase_usd': 0.0},
    {'order_id': 'BOPIS-803', 'order_value_usd': 65.0,  'actual_pick_and_stage_minutes': 55, 'actual_curbside_handoff_seconds': 180, 'in_store_impulse_purchase_usd': 18.00}, # SLA breach on prep & curbside!
    {'order_id': 'BOPIS-804', 'order_value_usd': 210.0, 'actual_pick_and_stage_minutes': 35, 'actual_curbside_handoff_seconds': 80,  'in_store_impulse_purchase_usd': 45.00}
]

bopis_metrics = model_bopis_curbside_fulfillment_pipeline(
    bopis_orders=mock_bopis_pipeline,
    target_prep_sla_minutes=45,
    target_curbside_handoff_seconds=120
)

print("=== BOPIS & CURBSIDE RETAIL FULFILLMENT PIPELINE AUDIT ===")
print(f"Total BOPIS Orders Processed:   {bopis_metrics['total_bopis_orders_audited']}")
print(f"In-Store Prep SLA Compliance:   {bopis_metrics['prep_sla_compliance_pct']}% (Target: >= 95.0%)")
print(f"Curbside Handoff SLA Rate:      {bopis_metrics['curbside_handoff_compliance_pct']}% (Target: >= 90.0%)")
print(f"Base BOPIS Order GMV:           ${bopis_metrics['total_bopis_gmv_usd']:,.2f}")
print(f"In-Store Cross-Sell Attach GMV: ${bopis_metrics['in_store_attach_gmv_usd']:,.2f} (+{bopis_metrics['attach_revenue_expansion_pct']}% top-line lift)")
print()
print("Sample Order Pipeline Records:")
for o in bopis_metrics['sample_order_records']:
    print(f"  [{o['order_id']}] Pick Time: {o['actual_pick_and_stage_minutes']}m (SLA: {o['prep_sla_passed']}) | Curbside: {o['actual_curbside_handoff_seconds']}s (SLA: {o['handoff_sla_passed']}) | Total Rev: ${o['total_store_realized_revenue_usd']:.2f}")'''

    p1_output_2 = """=== BOPIS & CURBSIDE RETAIL FULFILLMENT PIPELINE AUDIT ===
Total BOPIS Orders Processed:   4
In-Store Prep SLA Compliance:   75.0% (Target: >= 95.0%)
Curbside Handoff SLA Rate:      75.0% (Target: >= 90.0%)
Base BOPIS Order GMV:           $500.00
In-Store Cross-Sell Attach GMV: $87.50 (+17.5% top-line lift)

Sample Order Pipeline Records:
  [BOPIS-801] Pick Time: 28m (SLA: True) | Curbside: 95s (SLA: True) | Total Rev: $109.50
  [BOPIS-802] Pick Time: 42m (SLA: True) | Curbside: 110s (SLA: True) | Total Rev: $140.00
  [BOPIS-803] Pick Time: 55m (SLA: False) | Curbside: 180s (SLA: False) | Total Rev: $83.00"""

    p2_notes = [
        "In-store picking and curbside handoff achieved 75.0% SLA compliance, flagging order BOPIS-803 for staffing bottlenecks.",
        "Physical store cross-sell attach generated $87.50 in incremental impulse purchases, expanding top-line GMV by 17.5%.",
        "Sub-2-minute curbside delivery (orders 801, 802, 804) protects Net Promoter Scores and drives high customer retention."
    ]

    p2_check = {
        "question": "Why is the In-Store Attach Rate a critical financial KPI for retail executives evaluating BOPIS programs?",
        "options": [
            "Because customer visits to retrieve online orders generate unplanned, high-margin in-store impulse purchases, subsidizing store picking costs",
            "Because retail associates are legally required to buy items every time a customer enters",
            "Because attach rate measures the weight of cardboard boxes used in pickup",
            "Because attach rate determines the rent paid to shopping mall landlords"
        ],
        "answer": 0,
        "why": "When shoppers pick up online orders in-store, 25-35% make additional purchases, creating incremental high-margin gross profit that offsets in-store fulfillment labor."
    }

    parts.append({
        "title": "Buy Online, Pick Up In-Store (BOPIS) & Curbside Fulfillment Workflows, In-Store Staging & Fulfillment SLA Tracking",
        "say": p2_say,
        "example": "Target's 'Drive Up' curbside pickup program accounts for billions in annual digital sales. By utilizing GPS arrival tracking and dedicated parking stalls, Target associates deliver groceries and home goods to shoppers' trunks in an average of 90 seconds, while in-store pickup generates over $1B in annual attach purchases.",
        "code": p2_code,
        "output": p1_output_2,
        "codeNotes": p2_notes,
        "tryIt": "Reduce actual_pick_and_stage_minutes for BOPIS-803 to 39 to observe the prep SLA compliance rate increase to 100.0%.",
        "check": p2_check
    })

    # Part 3: Ship-from-Store (SFS) Economics: Store Capacity Balancing, Safety Stock Buffering & Markdown Inventory Clearance Routing
    p3_say = [
        "While BOPIS relies on consumers coming to the store, Ship-from-Store (SFS) transforms retail stores into distributed mini-fulfillment centers that dispatch packages directly to local consumer homes. In a pure centralized e-commerce model, orders are fulfilled from massive, automated distribution centers (DCs) located in low-cost exurban areas. However, shipping a parcel from an exurban mega-DC in Pennsylvania to a customer in downtown Miami requires cross-country transit across multiple postal carrier zones (e.g., Zone 7 or Zone 8), incurring steep line-haul freight fees ($14 to $22 per parcel) and taking three to five business days.",
        
        "Ship-from-Store fundamentally restructures last-mile unit economics through Geographic Proximity. By routing the order to a local retail store located ten miles from the customer in Miami, the parcel is injected into the carrier network at Zone 2 local rates ($5.50 to $7.50 per parcel) or delivered same-day via crowdsourced courier fleets (e.g., DoorDash Drive, Uber Direct, Roadie). This reduces parcel shipping expenses by forty to sixty percent while achieving lightning-fast 24-hour delivery.",
        
        "However, SFS fulfillment introduces complex operational trade-offs: Store Labor Efficiency vs DC Automation. Centralized distribution centers feature multi-million-dollar automated conveyor systems and robotic pickers, achieving a labor Cost Per Unit (CPU) under $1.50. In contrast, in-store manual picking and packing is performed by retail sales associates, where labor CPU averages $3.50 to $5.00 per unit. Furthermore, store packing stations have limited physical footprints and cannot process unlimited volume without overwhelming staff. Advanced Distributed Order Management Systems (DOMS) resolve this trade-off using Algorithmic Markdown Clearance Routing: the routing algorithm prioritizes fulfilling orders from retail stores where specific SKUs are overstocked and heading toward imminent end-of-season clearance markdowns, clearing aging inventory at full digital retail price and saving millions in liquidation write-offs.",
        
        "In our institutional Python model for Part 3, we simulate an intelligent Ship-from-Store order routing engine. The algorithm compares centralized DC transit costs against local store delivery rates, enforces daily store packing capacity limits, factors in retail labor differentials, and evaluates markdown clearance salvage values. Review the deterministic code below to master Ship-from-Store optimization."
    ]

    p3_code = '''def route_ship_from_store_orders(
    pending_orders: list[dict],
    store_facilities: dict,
    central_dc: dict
) -> dict:
    """
    Intelligent Ship-from-Store (SFS) Distributed Routing Engine.
    Optimizes freight savings, enforces store daily packing caps, and prioritizes markdown liquidation.
    """
    routing_decisions = []
    total_freight_savings_usd = 0.0
    total_markdown_margin_salvaged_usd = 0.0
    sfs_dispatched = 0
    dc_dispatched = 0
    
    for order in pending_orders:
        sku = order['sku']
        destination_zip = order['dest_zip']
        item_retail_price = order['retail_price_usd']
        
        # Calculate baseline cost to fulfill from Central DC (Zone 6/7 linehaul)
        dc_freight = central_dc['zone_freight_usd']
        dc_labor = central_dc['pick_pack_labor_usd']
        dc_total_cost = dc_freight + dc_labor
        
        # Identify candidate local store with inventory
        candidate_store_id = None
        best_store_cost = float('inf')
        is_markdown_salvage = False
        
        for s_id, s_data in store_facilities.items():
            has_stock = s_data['inventory'].get(sku, 0) > 0
            has_capacity = s_data['daily_packs_dispatched'] < s_data['max_daily_pack_capacity']
            
            if has_stock and has_capacity:
                store_freight = s_data['local_zone_freight_usd']
                store_labor = s_data['store_labor_cpu_usd']
                store_total = store_freight + store_labor
                
                # Check if this store has aging markdown inventory for this SKU
                aging_flag = s_data.get('markdown_clearance_skus', {}).get(sku, False)
                if aging_flag:
                    # Markdown salvage: selling online at full price avoids a 40% in-store markdown
                    salvage_bonus = item_retail_price * 0.40
                else:
                    salvage_bonus = 0.0
                    
                net_store_cost = store_total - salvage_bonus
                if net_store_cost < best_store_cost:
                    best_store_cost = net_store_cost
                    candidate_store_id = s_id
                    is_markdown_salvage = aging_flag
                    
        # Route decision
        if candidate_store_id and best_store_cost < dc_total_cost:
            s_data = store_facilities[candidate_store_id]
            s_data['inventory'][sku] -= 1
            s_data['daily_packs_dispatched'] += 1
            
            freight_savings = dc_freight - s_data['local_zone_freight_usd']
            total_freight_savings_usd += freight_savings
            
            if is_markdown_salvage:
                salvaged = item_retail_price * 0.40
                total_markdown_margin_salvaged_usd += salvaged
            else:
                salvaged = 0.0
                
            sfs_dispatched += 1
            routing_decisions.append({
                'order_id': order['order_id'],
                'assigned_node': candidate_store_id,
                'fulfillment_mode': 'SHIP_FROM_STORE_LOCAL',
                'freight_saved_usd': round(freight_savings, 2),
                'markdown_salvaged_usd': round(salvaged, 2)
            })
        else:
            dc_dispatched += 1
            routing_decisions.append({
                'order_id': order['order_id'],
                'assigned_node': central_dc['dc_id'],
                'fulfillment_mode': 'CENTRAL_DC_LINEHAUL',
                'freight_saved_usd': 0.0,
                'markdown_salvaged_usd': 0.0
            })
            
    return {
        'total_orders_routed': len(pending_orders),
        'sfs_dispatched_count': sfs_dispatched,
        'central_dc_dispatched_count': dc_dispatched,
        'total_freight_savings_usd': round(total_freight_savings_usd, 2),
        'total_markdown_margin_salvaged_usd': round(total_markdown_margin_salvaged_usd, 2),
        'sample_routings': routing_decisions[:3]
    }

mock_central_dc = {
    'dc_id': 'DC-OHIO-01',
    'zone_freight_usd': 14.50, # Zone 7 air/linehaul
    'pick_pack_labor_usd': 1.80
}

mock_stores = {
    'STORE-MIA-04': {
        'local_zone_freight_usd': 6.20, # Zone 2 local ground
        'store_labor_cpu_usd': 4.10,
        'daily_packs_dispatched': 28,
        'max_daily_pack_capacity': 30, # Only 2 capacity slots remaining!
        'inventory': {'SKU-SUMMER-DRESS': 4, 'SKU-WINTER-BOOT': 0},
        'markdown_clearance_skus': {'SKU-SUMMER-DRESS': True} # 40% markdown salvage!
    },
    'STORE-ORL-02': {
        'local_zone_freight_usd': 7.10,
        'store_labor_cpu_usd': 3.90,
        'daily_packs_dispatched': 10,
        'max_daily_pack_capacity': 40,
        'inventory': {'SKU-SUMMER-DRESS': 2, 'SKU-WINTER-BOOT': 5},
        'markdown_clearance_skus': {}
    }
}

orders_queue = [
    {'order_id': 'ORD-501', 'sku': 'SKU-SUMMER-DRESS', 'dest_zip': '33101', 'retail_price_usd': 120.0},
    {'order_id': 'ORD-502', 'sku': 'SKU-SUMMER-DRESS', 'dest_zip': '33102', 'retail_price_usd': 120.0},
    {'order_id': 'ORD-503', 'sku': 'SKU-SUMMER-DRESS', 'dest_zip': '33103', 'retail_price_usd': 120.0}, # Store MIA hits capacity cap!
    {'order_id': 'ORD-504', 'sku': 'SKU-WINTER-BOOT',  'dest_zip': '33104', 'retail_price_usd': 180.0}
]

sfs_results = route_ship_from_store_orders(orders_queue, mock_stores, mock_central_dc)

print("=== INTELLIGENT SHIP-FROM-STORE (SFS) ROUTING AUDIT ===")
print(f"Total Customer Orders Evaluated: {sfs_results['total_orders_routed']}")
print(f"Dispatched via Ship-from-Store:  {sfs_results['sfs_dispatched_count']} orders (Local Zone ground)")
print(f"Dispatched via Central DC:       {sfs_results['central_dc_dispatched_count']} orders (Linehaul fallback)")
print(f"Net Parcel Freight Savings:      ${sfs_results['total_freight_savings_usd']:,.2f}")
print(f"Markdown Margin Capital Salvaged:${sfs_results['total_markdown_margin_salvaged_usd']:,.2f}")
print()
print("Sample Order Dispatch Routing:")
for r in sfs_results['sample_routings']:
    print(f"  [{r['order_id']}] Routed To: {r['assigned_node']:<13} | Mode: {r['fulfillment_mode']} | Freight Saved: ${r['freight_saved_usd']:.2f} | Markdown Salvaged: ${r['markdown_salvaged_usd']:.2f}")'''

    p3_output = """=== INTELLIGENT SHIP-FROM-STORE (SFS) ROUTING AUDIT ===
Total Customer Orders Evaluated: 4
Dispatched via Ship-from-Store:  4 orders (Local Zone ground)
Dispatched via Central DC:       0 orders (Linehaul fallback)
Net Parcel Freight Savings:      $31.40
Markdown Margin Capital Salvaged:$96.00

Sample Order Dispatch Routing:
  [ORD-501] Routed To: STORE-MIA-04  | Mode: SHIP_FROM_STORE_LOCAL | Freight Saved: $8.30 | Markdown Salvaged: $48.00
  [ORD-502] Routed To: STORE-MIA-04  | Mode: SHIP_FROM_STORE_LOCAL | Freight Saved: $8.30 | Markdown Salvaged: $48.00
  [ORD-503] Routed To: STORE-ORL-02  | Mode: SHIP_FROM_STORE_LOCAL | Freight Saved: $7.40 | Markdown Salvaged: $0.00"""

    p3_notes = [
        "Store STORE-MIA-04 fulfilled orders 501 and 502, saving $8.30/package and liquidating aging summer dress inventory at full price.",
        "When STORE-MIA-04 reached its daily 30-package capacity cap, order 503 seamlessly failed over to regional store STORE-ORL-02.",
        "In total, the SFS engine saved $31.40 in parcel freight and salvaged $96.00 in markdown depreciation across 4 orders."
    ]

    p3_check = {
        "question": "How does intelligent Ship-from-Store (SFS) routing generate value beyond simple parcel freight reduction?",
        "options": [
            "By dynamically routing digital orders to retail stores with overstocked aging inventory, selling products at full digital retail price before in-store markdowns occur",
            "By firing warehouse associates and replacing them with in-store customers",
            "By requiring postal carriers to deliver packages on bicycles",
            "By allowing retail stores to evade local property taxes"
        ],
        "answer": 0,
        "why": "Fulfilling online orders from stores with excess seasonal stock liquidates aging inventory at full digital price, avoiding steep 30-50% in-store clearance markdowns."
    }

    parts.append({
        "title": "Ship-from-Store (SFS) Economics: Store Capacity Balancing, Safety Stock Buffering & Markdown Inventory Clearance Routing",
        "say": p3_say,
        "example": "Nordstrom routes online apparel orders directly to over 100 department stores. If a designer handbag is languishing in a suburban Austin store where it would soon be marked down 40%, Nordstrom's DOMS assigns an online order from Seattle to the Austin store, saving freight and protecting full-margin revenue.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Reduce STORE-ORL-02 max_daily_pack_capacity to 10 to observe how ORD-503 falls back to DC-OHIO-01 when all stores hit capacity.",
        "check": p3_check
    })

    # Part 4: Endless Aisle & Clienteling: In-Store Digital Kiosks, Associate-Assisted Selling, Unified Loyalty Accounts & Cross-Channel Returns
    p4_say = [
        "A common point of retail friction occurs when a customer visits a physical store seeking a specific garment size or colorway, only to find the store shelf out of stock. Historically, the retail associate apologized, and the customer walked out to purchase from a competitor—resulting in a permanent lost sale. In modern unified commerce, retailers deploy the Endless Aisle: empowering in-store associates with handheld mobile devices or interactive digital kiosks that access the enterprise's entire global inventory catalog across all regional warehouses and sister stores.",
        
        "Through Endless Aisle clienteling, the associate locates the customer's desired size in a central fulfillment center, processes the payment on their mobile POS tablet, and schedules express delivery directly to the customer's residence before they leave the store. The transaction is attributed to the local retail store and associate, aligning sales incentives across physical and digital channels. Simultaneously, the associate accesses the customer's Unified Omnichannel CRM Profile—viewing past online browsing history, preferred fabric fits, and lifetime loyalty tier status to deliver personalized clienteling recommendations.",
        
        "Equally vital to omnichannel profitability is Buy Online, Return In-Store (BORIS). In pure e-commerce, customer returns are an operational catastrophe: return parcel shipping costs ($8 to $12), inspection delays, and liquidation losses consume thirty percent of item value. When retailers encourage consumers to return digital purchases to local stores, outward and return shipping costs are eliminated. Furthermore, when the customer enters the store to process the return, skilled associates facilitate immediate size exchanges or complementary styling consultations, converting twenty to thirty percent of return visits into fresh retail transactions.",
        
        "In our institutional Python model for Part 4, we simulate an Endless Aisle and BORIS returns engine. The algorithm tracks associate-assisted order captures, evaluates omnichannel loyalty profile lifetime value, models in-store return salvage economics, and calculates customer re-spend conversion during physical return interactions. Review the deterministic code below to master endless aisle clienteling."
    ]

    p4_code = '''def simulate_endless_aisle_and_cross_channel_return(
    in_store_interactions: list[dict]
) -> dict:
    """
    Endless Aisle & Buy Online Return In-Store (BORIS) Economics Engine.
    Tracks associate-assisted digital sales and in-store return exchange conversions.
    """
    total_interactions = len(in_store_interactions)
    endless_aisle_orders = 0
    endless_aisle_gmv_usd = 0.0
    boris_returns = 0
    boris_refunded_usd = 0.0
    boris_exchanges_converted = 0
    boris_respend_gmv_usd = 0.0
    saved_return_shipping_usd = 0.0
    
    for event in in_store_interactions:
        event_type = event['type']
        val = event['amount_usd']
        
        if event_type == 'ENDLESS_AISLE_ASSISTED_SALE':
            endless_aisle_orders += 1
            endless_aisle_gmv_usd += val
            event['outcome'] = 'CAPTURED_LOST_SALE_SHIPPED_TO_HOME'
        elif event_type == 'BORIS_RETURN':
            boris_returns += 1
            boris_refunded_usd += val
            # Eliminating postal return label saves ~$8.50 per parcel
            saved_return_shipping_usd += 8.50
            
            # Check if associate converted return into in-store exchange/purchase
            respend = event.get('immediate_in_store_respend_usd', 0.0)
            if respend > 0:
                boris_exchanges_converted += 1
                boris_respend_gmv_usd += respend
                event['outcome'] = f'RETURN_RECOVERED_EXCHANGE_${respend:.2f}'
            else:
                event['outcome'] = 'FULL_REFUND_COMPLETED'
                
    boris_exchange_conversion_rate_pct = (boris_exchanges_converted / boris_returns) * 100.0 if boris_returns > 0 else 0.0
    net_omnichannel_equity_lift_usd = endless_aisle_gmv_usd + boris_respend_gmv_usd + saved_return_shipping_usd
    
    return {
        'total_events_processed': total_interactions,
        'endless_aisle_sales_captured': endless_aisle_orders,
        'endless_aisle_gmv_usd': round(endless_aisle_gmv_usd, 2),
        'boris_returns_processed': boris_returns,
        'boris_refunds_issued_usd': round(boris_refunded_usd, 2),
        'boris_exchange_rate_pct': round(boris_exchange_conversion_rate_pct, 1),
        'boris_immediate_respend_usd': round(boris_respend_gmv_usd, 2),
        'return_freight_capital_saved_usd': round(saved_return_shipping_usd, 2),
        'net_omnichannel_equity_lift_usd': round(net_omnichannel_equity_lift_usd, 2),
        'sample_events': in_store_interactions[:3]
    }

mock_store_events = [
    {'event_id': 'EVT-901', 'type': 'ENDLESS_AISLE_ASSISTED_SALE', 'amount_usd': 175.0, 'sku': 'SKU-SUIT-42R', 'store_id': 'STORE-BOS-01'},
    {'event_id': 'EVT-902', 'type': 'BORIS_RETURN',                'amount_usd': 95.0,  'sku': 'SKU-DRESS-MED', 'store_id': 'STORE-BOS-01', 'immediate_in_store_respend_usd': 110.0}, # Converted to exchange!
    {'event_id': 'EVT-903', 'type': 'BORIS_RETURN',                'amount_usd': 60.0,  'sku': 'SKU-SHIRT-LRG', 'store_id': 'STORE-BOS-01', 'immediate_in_store_respend_usd': 0.0},   # Standard refund
    {'event_id': 'EVT-904', 'type': 'ENDLESS_AISLE_ASSISTED_SALE', 'amount_usd': 240.0, 'sku': 'SKU-COAT-WOOL', 'store_id': 'STORE-BOS-01'}
]

clienteling_audit = simulate_endless_aisle_and_cross_channel_return(mock_store_events)

print("=== ENDLESS AISLE CLIENTELING & BORIS RETURNS RECOVERY AUDIT ===")
print(f"Endless Aisle Sales Captured:   {clienteling_audit['endless_aisle_sales_captured']} orders (${clienteling_audit['endless_aisle_gmv_usd']:,.2f} GMV recovered)")
print(f"BORIS Returns Handled:          {clienteling_audit['boris_returns_processed']} returns (${clienteling_audit['boris_refunds_issued_usd']:,.2f} refunded)")
print(f"BORIS In-Store Exchange Rate:   {clienteling_audit['boris_exchange_rate_pct']}% (Target: >= 25.0%)")
print(f"Immediate Re-Spend Captured:    ${clienteling_audit['boris_immediate_respend_usd']:,.2f}")
print(f"Return Shipping Freight Saved:  ${clienteling_audit['return_freight_capital_saved_usd']:,.2f}")
print(f"Net Omnichannel Equity Created: ${clienteling_audit['net_omnichannel_equity_lift_usd']:,.2f}")
print()
print("Sample Interaction Logs:")
for s in clienteling_audit['sample_events']:
    print(f"  [{s['event_id']}] Type: {s['type']:<27} | Amount: ${s['amount_usd']:.2f} -> Outcome: [{s['outcome']}]")'''

    p4_output = """=== ENDLESS AISLE CLIENTELING & BORIS RETURNS RECOVERY AUDIT ===
Endless Aisle Sales Captured:   2 orders ($415.00 GMV recovered)
BORIS Returns Handled:          2 returns ($155.00 refunded)
BORIS In-Store Exchange Rate:   50.0% (Target: >= 25.0%)
Immediate Re-Spend Captured:    $110.00
Return Shipping Freight Saved:  $17.00
Net Omnichannel Equity Created: $542.00

Sample Interaction Logs:
  [EVT-901] Type: ENDLESS_AISLE_ASSISTED_SALE | Amount: $175.00 -> Outcome: [CAPTURED_LOST_SALE_SHIPPED_TO_HOME]
  [EVT-902] Type: BORIS_RETURN                | Amount: $95.00 -> Outcome: [RETURN_RECOVERED_EXCHANGE_$110.00]
  [EVT-903] Type: BORIS_RETURN                | Amount: $60.00 -> Outcome: [FULL_REFUND_COMPLETED]"""

    p4_notes = [
        "Endless aisle clienteling recovered $415.00 in high-margin apparel sales that would have been lost to physical store stockouts.",
        "Processing returns in-store (BORIS) eliminated $17.00 in carrier return parcel fees across the two return events.",
        "A 50.0% in-store return exchange rate converted return EVT-902 into an immediate $110.00 replacement sale, generating $542.00 net omnichannel equity."
    ]

    p4_check = {
        "question": "What is the primary commercial advantage of Buy Online, Return In-Store (BORIS) compared to mail-in returns?",
        "options": [
            "It eliminates return postal shipping costs and provides retail associates an immediate opportunity to convert the returning customer into an in-store exchange or purchase",
            "It legally waives the merchant's obligation to issue a refund",
            "It requires returning customers to sweep the store floors",
            "It destroys the returned item to prevent resale"
        ],
        "answer": 0,
        "why": "BORIS removes return shipping fees, returns stock instantly to store shelves for immediate resale, and puts customers in physical stores where 25-35% make a new purchase."
    }

    parts.append({
        "title": "Endless Aisle & Clienteling: In-Store Digital Kiosks, Associate-Assisted Selling, Unified Loyalty Accounts & Cross-Channel Returns",
        "say": p4_say,
        "example": "Sephora seamlessly integrates in-store tablets with digital accounts. If a foundation shade is out of stock in a retail boutique, beauty advisors order it via Endless Aisle with free home delivery. Concurrently, online beauty returns brought in-store yield a 30%+ exchange re-spend rate, boosting omnichannel customer lifetime value.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Add an immediate_in_store_respend_usd of $75.00 to EVT-903 to observe the BORIS exchange rate surge to 100.0%.",
        "check": p4_check
    })

    # Part 5: Enterprise Omnichannel Unified Commerce Command Gateway & UCOI Certification
    p5_say = [
        "To conclude Day 22, we synthesize unified POS inventory synchronization, BOPIS curbside fulfillment pipelines, Ship-from-Store distributed routing, and Endless Aisle clienteling into the Enterprise Unified Commerce Operations Command Gateway. In the highest-performing enterprise retailers, physical stores and digital channels do not operate as isolated competitors; they form a symbiotic, mutually reinforcing commerce ecosystem.",
        
        "The Enterprise Unified Commerce Operations Command Gateway continuously evaluates four strategic operational pillars to calculate the Unified Commerce Operations Index (UCOI, 100 max points): First, Single-Pool Inventory Accuracy & Sync Velocity (30 points)—it audits real-time event synchronization latency across physical POS registers and digital storefronts, verifying inventory sync accuracy above 99.0%; Second, BOPIS & Curbside SLA Adherence (25 points)—it benchmarks in-store pick-and-stage speed (target <= 45 minutes) and curbside car-side delivery latency (target <= 120 seconds), driving customer NPS above 80; Third, Ship-from-Store Routing & Markdown Optimization (25 points)—it calculates parcel freight savings derived from local store delivery and measures markdown margin salvage from liquidating aging store inventory; and Fourth, Endless Aisle & In-Store Return Recovery (20 points)—it tracks revenue captured through associate clienteling and benchmarks BORIS in-store exchange conversion rates (target >= 25.0%).",
        
        "Achieving a UCOI score of 85.0 points or above confers the Apex Unified Commerce Operations Certification. In our institutional Python capstone for Day 22, we simulate an enterprise unified commerce command gateway governing an omnichannel retail network spanning two hundred physical stores and five hundred million dollars in annual Gross Merchandise Value. Review the deterministic code below to master omnichannel retail operations."
    ]

    p5_code = '''def run_enterprise_omnichannel_gateway(
    total_network_gmv_usd: float,
    inventory_sync_accuracy_pct: float,
    bopis_prep_sla_compliance_pct: float,
    sfs_freight_reduction_pct: float,
    boris_exchange_conversion_pct: float
) -> dict:
    """
    Enterprise Unified Commerce Operations Command Gateway.
    Synthesizes omnichannel metrics into the UCOI certification score.
    """
    # 1. Real-Time Inventory Sync Accuracy (30 pts, target >= 99.0%)
    score_inventory = min(30.0, (inventory_sync_accuracy_pct / 99.0) * 30.0)
    
    # 2. BOPIS / Curbside SLA Compliance (25 pts, target >= 95.0%)
    score_bopis = min(25.0, (bopis_prep_sla_compliance_pct / 95.0) * 25.0)
    
    # 3. Ship-from-Store Freight Reduction (25 pts, target >= 35.0% savings)
    score_sfs = min(25.0, (sfs_freight_reduction_pct / 35.0) * 25.0)
    
    # 4. In-Store Return Exchange Recovery (20 pts, target >= 25.0% exchange rate)
    score_recovery = min(20.0, (boris_exchange_conversion_pct / 25.0) * 20.0)
    
    ucoi_score = round(score_inventory + score_bopis + score_sfs + score_recovery, 2)
    certified = ucoi_score >= 85.0
    
    return {
        'total_network_gmv_usd': round(total_network_gmv_usd, 2),
        'ucoi_composite_score': ucoi_score,
        'pillar_scores': {
            'inventory_sync_pts': round(score_inventory, 2),
            'bopis_fulfillment_pts': round(score_bopis, 2),
            'sfs_freight_optimization_pts': round(score_sfs, 2),
            'in_store_recovery_pts': round(score_recovery, 2)
        },
        'system_kpis': {
            'inventory_sync_accuracy': f"{inventory_sync_accuracy_pct}%",
            'bopis_sla_compliance': f"{bopis_prep_sla_compliance_pct}%",
            'sfs_freight_reduction': f"{sfs_freight_reduction_pct}%",
            'boris_exchange_rate': f"{boris_exchange_conversion_pct}%"
        },
        'certification_conferred': certified,
        'governance_status': 'APEX_UNIFIED_COMMERCE_OPERATIONS_CERTIFIED' if certified else 'OMNICHANNEL_OPERATIONS_REMEDIATION_REQUIRED'
    }

omnichannel_audit = run_enterprise_omnichannel_gateway(
    total_network_gmv_usd=500000000.0,      # $500M Omnichannel Network GMV
    inventory_sync_accuracy_pct=99.4,        # 99.4% Inventory accuracy
    bopis_prep_sla_compliance_pct=96.8,      # 96.8% BOPIS 45-min SLA
    sfs_freight_reduction_pct=38.5,          # 38.5% Freight reduction via SFS
    boris_exchange_conversion_pct=28.4       # 28.4% Return exchange conversion
)

print("=== ENTERPRISE UNIFIED COMMERCE OPERATIONS COMMAND GATEWAY ===")
print(f"Total Omnichannel Network GMV:  ${omnichannel_audit['total_network_gmv_usd']:,.2f}")
print(f"UCOI Composite Score:           {omnichannel_audit['ucoi_composite_score']} / 100.00 pts")
print(f"Pillar Breakdown:               Inventory: {omnichannel_audit['pillar_scores']['inventory_sync_pts']} | BOPIS: {omnichannel_audit['pillar_scores']['bopis_fulfillment_pts']} | SFS: {omnichannel_audit['pillar_scores']['sfs_freight_optimization_pts']} | Recovery: {omnichannel_audit['pillar_scores']['in_store_recovery_pts']}")
print(f"System Performance KPIs:        {omnichannel_audit['system_kpis']}")
print(f"Platform Governance Status:     [{omnichannel_audit['governance_status']}] (Certified: {omnichannel_audit['certification_conferred']})")'''

    p5_output = """=== ENTERPRISE UNIFIED COMMERCE OPERATIONS COMMAND GATEWAY ===
Total Omnichannel Network GMV:  $500,000,000.00
UCOI Composite Score:           100.0 / 100.00 pts
Pillar Breakdown:               Inventory: 30.0 | BOPIS: 25.0 | SFS: 25.0 | Recovery: 20.0
System Performance KPIs:        {'inventory_sync_accuracy': '99.4%', 'bopis_sla_compliance': '96.8%', 'sfs_freight_reduction': '38.5%', 'boris_exchange_rate': '28.4%'}
Platform Governance Status:     [APEX_UNIFIED_COMMERCE_OPERATIONS_CERTIFIED] (Certified: True)"""

    p5_notes = [
        "The Unified Commerce Gateway verified multi-channel operations across $500M in annual network GMV across 200 stores.",
        "Surpassing industry benchmarks in SFS freight reduction (38.5%) and in-store return exchanges (28.4%) unlocked massive EBITDA gains.",
        "Achieving a perfect 100.0/100 UCOI score confers Apex Unified Commerce Operations Certification."
    ]

    p5_check = {
        "question": "What is the ultimate strategic objective of the Unified Commerce Operations Index (UCOI) in retail enterprise governance?",
        "options": [
            "To align store operations, digital e-commerce, and logistics into a single synchronized profit engine that maximizes customer lifetime value and asset utilization",
            "To replace physical store associates with automated phone bots",
            "To eliminate the use of barcodes across all retail stores",
            "To prevent customers from returning products"
        ],
        "answer": 0,
        "why": "UCOI benchmarks physical store and digital platform synchronization, ensuring inventory accuracy, rapid BOPIS fulfillment, and reduced last-mile freight costs."
    }

    parts.append({
        "title": "Enterprise Omnichannel Unified Commerce Command Gateway & UCOI Certification",
        "say": p5_say,
        "example": "Best Buy's 'Total Retail' transformation unified over 900 big-box stores with BestBuy.com. By turning retail stores into primary local shipping and pickup hubs, Best Buy fulfills over 70% of online orders from physical stores, driving faster delivery times, lower logistics costs, and superior profit margins.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Lower inventory_sync_accuracy_pct to 85.0% to observe how inventory drift triggers an omnichannel operational remediation flag.",
        "check": p5_check
    })

    # Assemble Day 22 dictionary
    day22_dict = {
        "day": 22,
        "title": "Omnichannel Retail Integration (BOPIS, Ship-from-Store & Curbside Pickup): Endless Aisle & Physical Store Inventory Sync",
        "summary": [
            "Unified Commerce architecture: single-pool real-time inventory ledger and POS safety buffers preventing digital overselling.",
            "Buy Online, Pick Up In-Store (BOPIS) & Curbside pickup workflows: picking SLAs, staging bays, and 25-35% in-store attach rates.",
            "Ship-from-Store (SFS) unit economics: Zone 2 local ground savings, store capacity balancing, and markdown inventory liquidation.",
            "Endless Aisle clienteling and BORIS returns: associate-assisted orders and in-store exchange recovery economics.",
            "Enterprise Unified Commerce Operations Command Gateway and UCOI institutional certification."
        ],
        "parts": parts
    }

    # Ensure invariant: >= 580 words per part and >= 2,950 words total
    total_words = ensure_ecom_day_budget(day22_dict, min_part_words=580, min_day_words=2950)
    return day22_dict, total_words

if __name__ == '__main__':
    d, w = build_day22()
    print(f"Day 22 Built Successfully! Total Spoken Words: {w:,}")
    for idx, p in enumerate(d['parts']):
        words = count_words(" ".join(p['say']))
        print(f"  Part {idx+1}: {p['title'][:45]}... ({words} words)")
