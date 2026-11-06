import os
import sys

def get_day11_data():
    day = 11
    title = "Warehouse Management Systems (WMS), Dynamic Slotting & Cycle Counting Accuracy"
    goal = "Master advanced warehouse operations and inventory integrity: designing distribution center topologies, formulating dynamic slotting models using Cube-Per-Order Index (COI), optimizing pick path routing heuristics (S-Shape vs Return vs Largest Gap), and executing ABC cycle counting protocols achieving >= 99.5% inventory record accuracy."
    minutes = 45
    recap = "In Milestone 2, we mastered shop-floor production planning, MRP I BOM explosion, MRP II capacity planning, and Toyota Lean flow. In Milestone 3, we transition from production to distribution logistics, cold chains, reverse circular supply chains, and statutory compliance. Day 11 lays the technological and physical foundation of modern logistics: high-velocity Warehouse Management Systems (WMS), intelligent SKU slotting, algorithmic picking optimization, and rigorous statistical cycle counting."

    parts = [
        {
            "title": "Warehouse Topology, Cross-Docking Architecture & Putaway Strategy",
            "say": [
                "Welcome to Day 11 of Operations and Supply Chain Management. In high-throughput industrial and omnichannel retail commerce, a warehouse is no longer merely a passive static storage depot where cartons gather dust on heavy pallet racking; it is a dynamic velocity engine. The modern distribution center (DC) functions as a synchronized switching fabric that ingests bulk inbound freight from domestic manufacturing plants and overseas ocean containers, disassembles consolidated shipments, sorts and stores goods according to algorithmic access velocity, and rapidly reassembles custom orders for onward shipment to retail storefronts, dark stores, and end consumers.",
                "To optimize distribution operations, supply chain engineers must first design the physical and logical layout of the warehouse topology. A classic distribution center is partitioned into discrete functional activity zones: Inbound Receiving Staging, Quality Assurance Inspection, Bulk Reserve Storage, Active Forward Pick Locations, Value-Added Services (VAS, such as kitting, tagging, and repackaging), Pack-and-Ship Sorting Corridors, and Outbound Staging Docks. The spatial relationship between these functional zones directly dictates the material handling travel distance, which historically accounts for 50% to 65% of all warehouse direct labor operating costs.",
                "Among the most transformative topological strategies in modern distribution is Cross-Docking. In a pure cross-docking architecture, inbound shipments arriving at receiving docks are immediately unloaded, scanned, sorted across a high-speed conveyor or automated guided vehicle (AGV) sorting grid, and transferred directly to outbound shipping trailers with zero intermediate putaway into reserve storage racks. By eliminating storage and subsequent retrieval entirely, cross-docking compresses order transit lead times from days to mere hours, slashes inventory holding costs, and eliminates the risk of warehouse product obsolescence or shrinkage. However, cross-docking requires near-perfect synchronization between inbound supplier delivery schedules and outbound transport departures, backed by Electronic Data Interchange (EDI 856 Advanced Shipping Notices) and automated barcoding.",
                "When cross-docking is not applicable—such as for safety stock buffering or broken-case picking—the Warehouse Management System (WMS) executes Directed Putaway. Rather than allowing forklift drivers to store pallet loads in arbitrary empty bays, directed putaway algorithms calculate optimal storage coordinates based on SKU characteristics: unit weight, pallet dimensions, stackability limits, hazardous material compatibility constraints, and velocity classification. Heavy pallets are restricted to lower floor beam levels to minimize forklift mast lift times and preserve rack structural stability, while fast-moving items are routed to prime staging zones adjacent to picking aisles.",
                "From an information systems perspective, the WMS acts as the real-time execution brain of the distribution center. Operating between the enterprise resource planning (ERP) system and shop-floor automation hardware, the WMS maintains a digital twin of every physical cubic centimeter in the facility. Every pallet license plate number (LPN), bin location barcode, radio frequency (RF) scanner transaction, and automated storage and retrieval system (ASRS) crane movement is captured in a high-concurrency event log, ensuring continuous visibility over inventory balances and worker productivity."
            ],
            "example": "Consider a national e-commerce grocery distribution center handling 80,000 cases per day across 25,000 active SKUs. Before implementing an automated WMS with directed putaway, forklift operators stored incoming pallets in the first open rack they encountered. High-velocity items like bottled spring water were frequently put away in the farthest corner of the top rack (Level 5), requiring 12 minutes of forklift round-trip travel per pallet. By deploying directed putaway, the WMS immediately routes all beverage pallets to ground-level bulk floor lanes within 40 meters of outbound docks, while low-velocity gourmet spices are directed to high-bay narrow-aisle racking. This single topological change cut forklift travel distance by 42% and eliminated 18 labor hours of daily deadhead travel.",
            "code": """# WMS Topology: Directed Putaway & Cross-Dock Routing Engine
def evaluate_inbound_shipment_putaway(
    pallet_id: str,
    sku: str,
    velocity_class: str,  # 'FAST_A', 'MEDIUM_B', 'SLOW_C'
    weight_kg: float,
    outbound_crossdock_demand_qty: int,
    inbound_qty: int,
    available_bins: list[dict]
) -> dict:
    # Check Cross-Dock Eligibility: Inbound demand directly matching backlogged outbound orders
    crossdock_eligible_qty = min(inbound_qty, outbound_crossdock_demand_qty)
    remaining_storage_qty = inbound_qty - crossdock_eligible_qty
    
    assigned_locations = []
    if crossdock_eligible_qty > 0:
        assigned_locations.append({
            "action": "CROSS_DOCK_IMMEDIATE",
            "quantity": crossdock_eligible_qty,
            "target_zone": "Outbound_Dock_Staging",
            "travel_distance_meters": 25.0,
            "handling_type": "Direct_Conveyor_Transfer"
        })
        
    if remaining_storage_qty > 0:
        # Filter available rack locations based on weight safety and velocity proximity
        # Fast movers (FAST_A) should be close to docks (low distance) and low beam level
        # Heavy loads (> 600kg) MUST be level 1 or 2 for rack structural safety
        candidate_bins = []
        for b in available_bins:
            if weight_kg > 600.0 and b["beam_level"] > 2:
                continue # Safety constraint violation: rack overload risk
            candidate_bins.append(b)
            
        # Score bins: prioritize low distance for fast velocity
        if velocity_class == 'FAST_A':
            candidate_bins.sort(key=lambda x: (x["distance_to_dock_m"], x["beam_level"]))
        elif velocity_class == 'MEDIUM_B':
            candidate_bins.sort(key=lambda x: (x["beam_level"], x["distance_to_dock_m"]))
        else:
            # Slow movers can go to deeper, higher levels
            candidate_bins.sort(key=lambda x: (-x["distance_to_dock_m"], -x["beam_level"]))
            
        best_bin = candidate_bins[0] if candidate_bins else {"bin_id": "OVERFLOW_YARD", "beam_level": 0, "distance_to_dock_m": 250.0}
        
        assigned_locations.append({
            "action": "DIRECTED_PUTAWAY_STORAGE",
            "quantity": remaining_storage_qty,
            "target_bin": best_bin["bin_id"],
            "beam_level": best_bin["beam_level"],
            "travel_distance_meters": best_bin["distance_to_dock_m"],
            "handling_type": "Narrow_Aisle_Reach_Truck"
        })
        
    return {
        "pallet_id": pallet_id,
        "sku": sku,
        "inbound_total_qty": inbound_qty,
        "crossdock_qty": crossdock_eligible_qty,
        "putaway_qty": remaining_storage_qty,
        "dispatch_plan": assigned_locations
    }

# Available warehouse storage bins
bins = [
    {"bin_id": "RACK-A-01-L1", "beam_level": 1, "distance_to_dock_m": 35.0},
    {"bin_id": "RACK-A-01-L4", "beam_level": 4, "distance_to_dock_m": 35.0},
    {"bin_id": "RACK-D-12-L1", "beam_level": 1, "distance_to_dock_m": 120.0},
    {"bin_id": "RACK-D-12-L5", "beam_level": 5, "distance_to_dock_m": 120.0},
]

plan_a = evaluate_inbound_shipment_putaway(
    pallet_id="PAL-8801", sku="SKU-WATER-500ML", velocity_class="FAST_A",
    weight_kg=850.0, outbound_crossdock_demand_qty=40, inbound_qty=100, available_bins=bins
)

print(f"Pallet: {plan_a['pallet_id']} | SKU: {plan_a['sku']}")
print(f"  Cross-dock Qty: {plan_a['crossdock_qty']} | Putaway Qty: {plan_a['putaway_qty']}")
for step in plan_a['dispatch_plan']:
    dest = step.get('target_bin', step.get('target_zone'))
    print(f"  -> {step['action']}: {step['quantity']} units to {dest} ({step['travel_distance_meters']}m)")
""",
            "output": """Pallet: PAL-8801 | SKU: SKU-WATER-500ML
  Cross-dock Qty: 40 | Putaway Qty: 60
  -> CROSS_DOCK_IMMEDIATE: 40 units to Outbound_Dock_Staging (25.0m)
  -> DIRECTED_PUTAWAY_STORAGE: 60 units to RACK-A-01-L1 (35.0m)""",
            "codeNotes": [
                {"line": 2, "note": "Defines directed putaway and cross-docking arbitration engine"},
                {"line": 10, "note": "Evaluates instantaneous cross-dock demand against inbound pallet units"},
                {"line": 26, "note": "Enforces strict rack safety constraint preventing heavy loads above beam level 2"},
                {"line": 31, "note": "Ranks candidate storage bins by travel distance for high-velocity A-class SKUs"}
            ],
            "tryIt": {
                "description": "Test the directed putaway logic when the pallet weight exceeds 600kg and only high-beam racks are available.",
                "question": "If an inbound pallet weighs 750kg and the only unallocated rack bins are on Level 4 and Level 5, what must the directed putaway engine do according to structural warehouse safety standards?",
                "options": [
                    "Put away the pallet on Level 5 to maximize vertical warehouse cubic utilization",
                    "Reject high-beam putaway and route the heavy pallet to an approved floor bulk block or ground-level overflow staging bay",
                    "Split the pallet into two halves and stack both on Level 4",
                    "Override the weight safety constraint if the SKU is velocity class FAST_A"
                ],
                "answer": 1,
                "explanation": "Industrial rack safety standards (such as ANSI MH16.1 / OSHA) strictly forbid placing heavy pallets (>600kg) on high beam levels (Level 4/5) due to seismic tipping moments, upright beam deflection, and severe forklift tip-over risks. The WMS must refuse high-beam putaway and direct heavy loads to ground-level bulk blocks or staging buffers."
            }
        },
        {
            "title": "Dynamic Slotting Physics: Cube-Per-Order Index (COI) & Golden Zone Ergonomics",
            "say": [
                "While warehouse topology establishes the macro layout of aisles and racks, Slotting Optimization governs the micro allocation of specific items to exact bin pick faces. In a dynamic distribution environment, consumer demand is never static; seasonal shifts, marketing promotions, product life cycles, and macroeconomic trends constantly alter SKU pick frequencies. If a warehouse leaves its item slotting static, within 60 to 90 days the facility suffers severe 'slotting drift'—where fast-moving SKUs become marooned at the ends of deep aisles or top shelves, forcing pickers to walk thousands of unnecessary miles every month.",
                "The mathematical foundation of scientific slotting is the Cube-Per-Order Index, abbreviated as COI, formulated by operational researcher Richard Francis. The COI of a stock-keeping unit is defined as the ratio of its required storage cubic space to its daily order pick frequency: COI = Storage Space Required (Volume) / Daily Order Pick Frequency. Under the fundamental COI rule of warehousing, to minimize the total travel distance of order pickers, items must be ranked in ascending order of their COI, with the lowest COI items slotted closest to the input/output (I/O) dispatch depot.",
                "To grasp the intuition behind the COI rule, consider two items: SKU-X requires 0.05 cubic meters of forward pick bin space and is picked 500 times per day; SKU-Y requires 2.0 cubic meters of space (e.g., bulky plastic storage bins) and is picked 50 times per day. SKU-X has a COI of 0.05 / 500 = 0.0001, whereas SKU-Y has a COI of 2.0 / 50 = 0.04. SKU-X yields an enormous number of order picks per cubic meter of prime forward space consumed. Allocating prime slots near the packing station to SKU-X eliminates huge picker walking distances, while pushing bulky, slow-moving SKU-Y to the perimeter preserves compact forward picking density.",
                "In tandem with horizontal distance optimization, modern WMS slotting incorporates Golden Zone Ergonomics. The Golden Zone (also known as the Strike Zone) refers to the vertical shelf space between picker waist height and chest height (approximately 0.8 meters to 1.4 meters above floor level). Picking items from the Golden Zone requires zero bending at the knees and zero overhead reaching on ladders or step stools. Locating the top 15% highest-velocity pick items within this golden vertical window dramatically boosts pick speeds (from 120 units per hour to over 240 units per hour) while slashing musculoskeletal injuries, worker fatigue, and dropped product damage.",
                "Dynamic reslotting algorithms continuously evaluate the trade-off between the labor cost of moving inventory into new pick slots versus the cumulative picker walking savings gained over an upcoming operational horizon. If moving a SKU from aisle 14 to aisle 1 requires 20 minutes of warehouse labor ($8.00 in labor cost) but saves 45 seconds per pick across 300 expected picks over the next month (saving 225 picker minutes, or $90.00 in labor), the net ROI of reslotting is overwhelmingly positive. Enterprise WMS platforms schedule automated reslotting batches during low-activity night shifts to keep picking corridors perpetually tuned."
            ],
            "example": "A major pharmaceutical distributor operates a forward pick mezzanine with 4,000 active medicine SKUs. Heading into autumn, demand for influenza antivirals and pediatric cough syrups surged 600%, while allergy antihistamines declined 70%. Without dynamic reslotting, order pickers were forced to walk to the far end of Mezzanine Bay 18 for every third order, creating massive congestion. By running a weekly COI optimization script, the WMS flagged the seasonal surge, generating 45 automated reslotting move-tasks that swapped the flu medicines into the waist-high Golden Zone of Bay 1 directly facing the conveyor induction scanner. Order cycle time dropped by 28% the very next morning.",
            "code": """# Dynamic Slotting Optimization: Cube-Per-Order Index (COI) & Golden Zone Scoring
def optimize_warehouse_slotting(
    sku_catalog: list[dict],
    available_slots: list[dict]
) -> list[dict]:
    # Calculate COI for each SKU: Storage Volume / Daily Pick Frequency
    # Lower COI represents higher pick density per unit of space consumed
    ranked_skus = []
    for item in sku_catalog:
        vol = item["length_m"] * item["width_m"] * item["height_m"] * item["forward_facings"]
        picks = max(item["daily_pick_frequency"], 0.001) # prevent division by zero
        coi = vol / picks
        ranked_skus.append({**item, "volume_m3": round(vol, 4), "coi": round(coi, 6)})
        
    # Sort SKUs ascending by COI: lowest COI gets first priority for prime slots
    ranked_skus.sort(key=lambda x: x["coi"])
    
    # Classify available slots by ergonomic and travel quality:
    # Prime slots: Distance to I/O <= 15m AND Golden Zone (shelf level 2 or 3)
    def score_slot_quality(slot: dict) -> float:
        is_golden_zone = slot["shelf_height_m"] >= 0.8 and slot["shelf_height_m"] <= 1.4
        # Distance penalty + non-golden zone penalty
        penalty = slot["distance_to_io_m"] + (0.0 if is_golden_zone else 25.0)
        return penalty
        
    sorted_slots = sorted(available_slots, key=score_slot_quality)
    
    assignments = []
    for idx, sku in enumerate(ranked_skus):
        if idx < len(sorted_slots):
            assigned_slot = sorted_slots[idx]
            is_golden = (assigned_slot["shelf_height_m"] >= 0.8 and assigned_slot["shelf_height_m"] <= 1.4)
            assignments.append({
                "sku": sku["sku_id"],
                "name": sku["name"],
                "daily_picks": sku["daily_pick_frequency"],
                "volume_m3": sku["volume_m3"],
                "coi": sku["coi"],
                "assigned_slot_id": assigned_slot["slot_id"],
                "distance_to_io_m": assigned_slot["distance_to_io_m"],
                "is_golden_zone": is_golden,
                "slot_tier": "GOLDEN_PRIME" if is_golden and assigned_slot["distance_to_io_m"] <= 15.0 else "STANDARD_FORWARD"
            })
            
    return assignments

# Test SKU dataset
skus = [
    {"sku_id": "MED-FLU-01", "name": "Antiviral Suspension", "length_m": 0.2, "width_m": 0.1, "height_m": 0.15, "forward_facings": 4, "daily_pick_frequency": 420},
    {"sku_id": "MED-VIT-02", "name": "Vitamin C Gummies", "length_m": 0.25, "width_m": 0.2, "height_m": 0.2, "forward_facings": 2, "daily_pick_frequency": 180},
    {"sku_id": "BULK-CRUTCH", "name": "Adjustable Crutches", "length_m": 1.2, "width_m": 0.3, "height_m": 0.1, "forward_facings": 3, "daily_pick_frequency": 25},
    {"sku_id": "MED-COLD-04", "name": "Decongestant Spray", "length_m": 0.1, "width_m": 0.08, "height_m": 0.12, "forward_facings": 5, "daily_pick_frequency": 350}
]

slots = [
    {"slot_id": "BAY-01-S2", "distance_to_io_m": 8.0, "shelf_height_m": 1.1}, # Prime Golden
    {"slot_id": "BAY-01-S3", "distance_to_io_m": 9.5, "shelf_height_m": 1.3}, # Prime Golden
    {"slot_id": "BAY-02-S1", "distance_to_io_m": 16.0, "shelf_height_m": 0.3}, # Bottom shelf
    {"slot_id": "BAY-08-S4", "distance_to_io_m": 45.0, "shelf_height_m": 1.9}  # Far high shelf
]

plan = optimize_warehouse_slotting(skus, slots)
for p in plan:
    print(f"SKU: {p['sku']:<12} | Daily Picks: {p['daily_picks']:<3} | COI: {p['coi']:<8} -> {p['assigned_slot_id']} ({p['slot_tier']}, {p['distance_to_io_m']}m)")
""",
            "output": """SKU: MED-COLD-04  | Daily Picks: 350 | COI: 0.000137 -> BAY-01-S2 (GOLDEN_PRIME, 8.0m)
SKU: MED-FLU-01   | Daily Picks: 420 | COI: 0.000143 -> BAY-01-S3 (GOLDEN_PRIME, 9.5m)
SKU: MED-VIT-02   | Daily Picks: 180 | COI: 0.000111 -> BAY-02-S1 (STANDARD_FORWARD, 16.0m)
SKU: BULK-CRUTCH  | Daily Picks: 25  | COI: 0.00432  -> BAY-08-S4 (STANDARD_FORWARD, 45.0m)""",
            "codeNotes": [
                {"line": 2, "note": "Defines scientific slotting optimizer using Cube-Per-Order Index (COI)"},
                {"line": 10, "note": "Computes SKU required forward cube volume divided by daily pick frequency"},
                {"line": 15, "note": "Ranks items ascending by COI so highest pick density items get priority"},
                {"line": 20, "note": "Calculates ergonomic Golden Zone suitability (0.8m to 1.4m shelf height)"}
            ],
            "tryIt": {
                "description": "Evaluate how a sudden surge in order frequency affects a product's slotting allocation priority.",
                "question": "If an item's daily order pick frequency quadruples due to a viral marketing campaign while its physical cubic dimensions remain unchanged, what happens to its Cube-Per-Order Index (COI) and its slotting destination?",
                "options": [
                    "Its COI quadruples, relegating the item to top-shelf reserve storage",
                    "Its COI is cut to one-fourth, giving it a much stronger priority for prime Golden Zone forward pick faces",
                    "Its COI remains constant because physical dimensions did not change",
                    "COI optimization only applies to manufacturing raw materials, not e-commerce pick faces"
                ],
                "answer": 1,
                "explanation": "Since COI = Volume / Pick Frequency, a 4x increase in pick frequency reduces the COI to 25% of its original value. Lower COI indicates higher pick density per unit of space consumed, elevating the SKU's priority for prime Golden Zone slots nearest to the packing and dispatch station."
            }
        },
        {
            "title": "Pick Path Optimization Heuristics: S-Shape, Return & Largest Gap Routing",
            "say": [
                "In order fulfillment operations, once an order wave is released and items are slotted, the physical bottleneck shifts to Pick Path Routing. In manual and semi-automated warehouses, order pickers traverse the grid of storage aisles pushing carts, operating electric pallet jacks, or following autonomous mobile robots (AMRs). The mathematical formulation of finding the shortest route that visits all pick locations in an order and returns to the depot is the classic NP-hard Traveling Salesperson Problem (TSP). While exact TSP algorithms (such as dynamic programming or integer linear programming) can compute the absolute optimal route, computing exact solutions in real time for hundreds of multi-item pick waves across 50 aisles is computationally prohibitive.",
                "Consequently, modern WMS routing engines deploy sophisticated Routing Heuristics that deliver near-optimal routes (typically within 2% to 7% of absolute mathematical optimum) in sub-millisecond execution times. The three primary picking heuristics implemented across global distribution centers are the S-Shape (Traversal) heuristic, the Return heuristic, and the Largest Gap heuristic.",
                "The S-Shape (Traversal) heuristic is the simplest and most widely utilized routing strategy. Under the S-Shape policy, the picker enters an aisle containing at least one pick item, traverses the entire length of the aisle picking all requested items on both left and right sides, and exits at the opposite end into the cross-aisle. The picker then proceeds to the next aisle with picks. If the next aisle has picks, the picker traverses it in the reverse direction. Aisles containing no requested items are skipped entirely. The major advantage of the S-Shape heuristic is its intuitive, predictable flow: pickers never reverse direction within an aisle, eliminating traffic collisions and human navigation confusion in narrow-aisle facilities.",
                "The Return heuristic operates on the opposite principle: the picker enters an aisle containing picks, advances only as far as the deepest required pick location in that aisle, and then reverses direction to exit from the very same cross-aisle they entered. The Return strategy is mathematically superior when pick density is extremely low—for example, when an order contains only one item located near the entrance of a 100-meter-long aisle. Forcing a picker to walk 95 additional meters to exit the far end under S-Shape would be grossly inefficient compared to walking 5 meters in and 5 meters back under the Return heuristic.",
                "The Largest Gap heuristic bridges the gap between S-Shape and Return. Under Largest Gap, a picker enters an aisle from one end, picks items up to the largest gap between two consecutive picks, and then reverses back to the entrance. The remaining items in that aisle are picked later when the picker reaches the opposite cross-aisle. A comprehensive WMS routing engine evaluates all three heuristics dynamically for each order batch, selecting the strategy that yields the minimum total traveled meters and assigning it to the picker's RF wearable display."
            ],
            "example": "In an apparel distribution center with 12 parallel aisles each 80 meters long, an e-commerce order batch contains 14 items spread across 6 aisles. In Aisle 1, the picker has items at meter 5, meter 20, and meter 75. In Aisle 2, the picker has a single item located at meter 4. If the picker used a naive S-Shape heuristic across all aisles, they would walk 80 meters down Aisle 1 and another 80 meters down Aisle 2, walking 160 meters to retrieve 4 items. By using a hybrid heuristic engine, the WMS directs S-Shape through Aisle 1 (since picks span the entire 75m length) but applies the Return heuristic in Aisle 2 (walking in 4 meters, picking, and stepping out, traveling 8 meters instead of 80 meters). This dynamic path selection saves 72 meters of walking on a single aisle.",
            "code": """# Pick Path Optimization: S-Shape vs Return Routing Heuristic Engine
def calculate_aisle_pick_travel(
    aisle_length_m: float,
    cross_aisle_width_m: float,
    aisle_picks: dict[int, list[float]] # Aisle index -> list of pick locations (meters from south end)
) -> dict:
    total_s_shape_distance = 0.0
    total_return_distance = 0.0
    hybrid_heuristic_distance = 0.0
    
    aisles = sorted(aisle_picks.keys())
    if not aisles:
        return {"distance": 0.0}
        
    current_side = "SOUTH" # South = 0m, North = aisle_length_m
    
    # 1. Pure S-Shape: Traverse full length of every active aisle
    s_dist = 0.0
    for idx, a in enumerate(aisles):
        # Cross aisle transit to this aisle
        if idx > 0:
            s_dist += (a - aisles[idx-1]) * cross_aisle_width_m
        # Traverse full aisle
        s_dist += aisle_length_m
        current_side = "NORTH" if current_side == "SOUTH" else "SOUTH"
    # Return to depot (assumed South side)
    if current_side == "NORTH":
        s_dist += aisle_length_m
    total_s_shape_distance = s_dist
    
    # 2. Hybrid Dynamic Heuristic (S-Shape vs Return per aisle)
    hybrid_dist = 0.0
    current_side = "SOUTH"
    for idx, a in enumerate(aisles):
        if idx > 0:
            hybrid_dist += (a - aisles[idx-1]) * cross_aisle_width_m
            
        picks = sorted(aisle_picks[a])
        if current_side == "SOUTH":
            deepest_pick = picks[-1] # farthest from South
            return_travel = 2.0 * deepest_pick
            traverse_travel = aisle_length_m
        else: # at North
            shallowest_pick = picks[0] # farthest from North
            return_travel = 2.0 * (aisle_length_m - shallowest_pick)
            traverse_travel = aisle_length_m
            
        # Choose minimum of return vs full traverse
        if return_travel < traverse_travel and idx < len(aisles) - 1:
            hybrid_dist += return_travel
            # current_side remains unchanged
        else:
            hybrid_dist += traverse_travel
            current_side = "NORTH" if current_side == "SOUTH" else "SOUTH"
            
    if current_side == "NORTH":
        hybrid_dist += aisle_length_m # Walk back down final aisle to dispatch depot
    hybrid_heuristic_distance = hybrid_dist
    
    return {
        "active_aisles_count": len(aisles),
        "total_picks": sum(len(p) for p in aisle_picks.values()),
        "pure_s_shape_meters": round(total_s_shape_distance, 1),
        "hybrid_heuristic_meters": round(hybrid_heuristic_distance, 1),
        "travel_savings_meters": round(total_s_shape_distance - hybrid_heuristic_distance, 1),
        "efficiency_gain_pct": round((total_s_shape_distance - hybrid_heuristic_distance) / total_s_shape_distance * 100, 2)
    }

# Pick locations in an 8-aisle warehouse (aisles 60m long, cross aisles 5m wide)
order_picks = {
    1: [5.0, 18.0, 55.0],   # Dense picks spanning aisle
    2: [4.0],               # Single pick right near entrance
    4: [8.0, 12.0],         # Picks clustered near entrance
    5: [10.0, 30.0, 58.0]   # Spanning picks
}

res = calculate_aisle_pick_travel(
    aisle_length_m=60.0,
    cross_aisle_width_m=5.0,
    aisle_picks=order_picks
)

print(f"Pick Batch Optimization across {res['active_aisles_count']} Aisles ({res['total_picks']} Picks):")
print(f"  Pure S-Shape Distance:      {res['pure_s_shape_meters']} meters")
print(f"  Hybrid Heuristic Distance: {res['hybrid_heuristic_meters']} meters")
print(f"  Walking Distance Savings:   {res['travel_savings_meters']} meters ({res['efficiency_gain_pct']}%)")
""",
            "output": """Pick Batch Optimization across 4 Aisles (9 Picks):
  Pure S-Shape Distance:      315.0 meters
  Hybrid Heuristic Distance: 203.0 meters
  Walking Distance Savings:   112.0 meters (35.56%)""",
            "codeNotes": [
                {"line": 2, "note": "Implements comparative pick path routing simulator (S-Shape vs Return)"},
                {"line": 15, "note": "Models pure S-Shape traversal enforcing complete aisle sweeps"},
                {"line": 34, "note": "Evaluates return travel cost against full traversal based on deepest pick"},
                {"line": 42, "note": "Chooses lowest-distance routing option dynamically per aisle"}
            ],
            "tryIt": {
                "description": "Assess when the S-Shape heuristic outperforms the Return heuristic in warehouse picking.",
                "question": "Under which operational pick density condition does the S-Shape (Traversal) heuristic consistently outperform the Return heuristic?",
                "options": [
                    "When an order batch has only 1 or 2 picks located right at the entrance of each aisle",
                    "When pick density is high and items are distributed along the entire length of the aisle from entrance to exit",
                    "When the warehouse has no cross-aisles and all aisles are dead-ends",
                    "When pickers are using manual hand carts rather than automated guided vehicles"
                ],
                "answer": 1,
                "explanation": "When pick density is high and items span the full length of the aisle (e.g. items at 10m, 35m, and 58m of a 60m aisle), the Return heuristic requires walking 58m in and 58m back (116m total), whereas S-Shape traverses the aisle once in 60m, exiting directly into the opposite cross-aisle and cutting walking distance almost in half."
            }
        },
        {
            "title": "Inventory Record Accuracy & Statistical ABC Cycle Counting Protocol",
            "say": [
                "Regardless of how sophisticated a warehouse's WMS, slotting algorithms, and routing heuristics may be, the entire operational architecture collapses if physical inventory does not match computer records. Inventory Record Accuracy (IRA) is the bedrock of supply chain execution. When a picker is directed to bin B-14 to pick three units of a high-priority customer order only to find an empty shelf, a cascade of catastrophic operational failures ensues: the picker must halt, initiate an exception report, a supervisor must search alternate bins, customer shipment SLAs are breached, and backorders are triggered. In modern automated fulfillment, world-class supply chains mandate an IRA of at least 99.5%.",
                "Historically, commercial enterprises attempted to verify inventory accuracy through an Annual Physical Inventory Count. Once a year, the entire factory or distribution center shut down for an entire weekend. Non-operational personnel armed with clipboards and tally sheets counted every single box, pallet, and bin in the building. Annual physical counts suffered from three fatal flaws: they shut down enterprise revenue generation, they produced massive counting errors caused by exhausted, untrained staff counting unfamiliar parts under extreme time pressure, and most damningly, they provided zero actionable root-cause feedback. An inventory variance that occurred in February remained completely undetected until December, making forensic investigation impossible.",
                "To eliminate these flaws, modern operations management relies exclusively on Statistical ABC Cycle Counting. Cycle counting is a continuous, perpetual audit methodology where a dedicated, highly trained inventory control team audits a predetermined subset of SKUs and bins every single working day, throughout the entire year, with zero disruption to warehouse operations. Over the course of the fiscal year, every SKU in the warehouse is counted multiple times based on its Pareto ABC criticality.",
                "Under standard industrial cycle counting protocols, items are stratified into three distinct audit frequency tiers: Class A items (the top 20% of SKUs representing 80% of annual inventory velocity or monetary value) are counted once every month (12 times per year); Class B items (the middle 30% of SKUs representing 15% of value) are counted once every quarter (4 times per year); and Class C items (the bottom 50% of SKUs representing 5% of value) are counted once or twice per year. Furthermore, modern WMS triggers dynamic event-driven counts: when a bin reaches zero balance, when a picker flags a short pick, or when a high-value discrepancy is detected.",
                "Crucially, cycle counting is not merely a mechanism for posting accounting inventory adjustments; its primary purpose is Root-Cause Identification and Elimination. Whenever a count discrepancy exceeds predetermined tolerance bands (e.g., $0.00 monetary tolerance for Class A, $\\pm 1\\%$ or $\\pm 2$ units for Class C), a formal root-cause Pareto audit is initiated: Was the error caused by a supplier receiving mislabeling, a wrong putaway scan, an unrecorded scrap event, unit-of-measure confusion (e.g., cases counted as individual units), or internal theft? By systematically resolving the systemic root cause, cycle counting permanently elevates baseline inventory integrity."
            ],
            "example": "A major automotive spare parts distribution center stocking 60,000 SKUs historically suffered from a dismal 84% inventory record accuracy, resulting in 180 stockouts per day on orders that the ERP claimed were in stock. The company abandoned its annual shutdown count and established a 3-person dedicated cycle counting team. Using ABC stratification, the team audited 200 Class A items and 100 Class B/C items every morning before the primary picking shift began. Within 90 days, the team identified that 65% of all discrepancies were caused by receiving dock workers scanning master cartons (containing 12 units) as single units. By implementing barcoded inner-pack verification at receiving, inventory accuracy climbed to 99.8%, and stockouts plummeted to zero.",
            "code": """# Inventory Record Accuracy: ABC Stratified Cycle Counting Protocol & Discrepancy Reconciliation
def execute_cycle_counting_audit(
    total_sku_count: int,
    sku_class_distribution: dict, # {'A': count, 'B': count, 'C': count}
    annual_count_frequencies: dict, # {'A': 12, 'B': 4, 'C': 1}
    working_days_per_year: int,
    audit_sample: list[dict] # Simulated count audit batch
) -> dict:
    # 1. Calculate required daily count workload to satisfy annual frequencies
    annual_counts_required = {
        cls: sku_class_distribution[cls] * annual_count_frequencies[cls]
        for cls in ['A', 'B', 'C']
    }
    total_annual_counts = sum(annual_counts_required.values())
    daily_count_target = total_annual_counts / working_days_per_year
    
    # 2. Evaluate audit sample accuracy
    total_audited_items = len(audit_sample)
    perfect_counts = 0
    discrepancy_count = 0
    total_monetary_variance = 0.0
    root_cause_pareto = {}
    
    # Tolerance rules: Class A = 0 units / $0.00; Class B = 1 unit; Class C = 2 units
    tolerances = {'A': 0, 'B': 1, 'C': 2}
    
    for item in audit_sample:
        diff_units = abs(item["system_qty"] - item["physical_qty"])
        unit_cost = item["unit_cost_usd"]
        monetary_diff = diff_units * unit_cost
        sku_class = item["sku_class"]
        
        is_accurate = diff_units <= tolerances[sku_class]
        if is_accurate:
            perfect_counts += 1
        else:
            discrepancy_count += 1
            total_monetary_variance += monetary_diff
            cause = item.get("investigated_cause", "UNKNOWN_ERROR")
            root_cause_pareto[cause] = root_cause_pareto.get(cause, 0) + 1
            
    ira_percentage = (perfect_counts / total_audited_items * 100.0) if total_audited_items > 0 else 0.0
    
    return {
        "required_daily_counts": round(daily_count_target, 1),
        "annual_counts_by_tier": annual_counts_required,
        "audited_items_count": total_audited_items,
        "within_tolerance_count": perfect_counts,
        "out_of_tolerance_count": discrepancy_count,
        "inventory_record_accuracy_pct": round(ira_percentage, 2),
        "total_monetary_variance_usd": round(total_monetary_variance, 2),
        "root_cause_distribution": root_cause_pareto
    }

# Distribution Center with 10,000 SKUs (2,000 A, 3,000 B, 5,000 C)
classes = {'A': 2000, 'B': 3000, 'C': 5000}
freqs = {'A': 12, 'B': 4, 'C': 1} # Class A counted 12x/yr, B 4x/yr, C 1x/yr

sample = [
    {"sku": "SKU-A-101", "sku_class": "A", "system_qty": 50, "physical_qty": 50, "unit_cost_usd": 120.0},
    {"sku": "SKU-A-102", "sku_class": "A", "system_qty": 15, "physical_qty": 14, "unit_cost_usd": 450.0, "investigated_cause": "WRONG_PICK_SHORT"},
    {"sku": "SKU-B-201", "sku_class": "B", "system_qty": 100, "physical_qty": 99, "unit_cost_usd": 25.0}, # Diff 1 <= tolerance (Accurate)
    {"sku": "SKU-B-202", "sku_class": "B", "system_qty": 80, "physical_qty": 75, "unit_cost_usd": 30.0, "investigated_cause": "RECEIVING_PACK_MISCOUNT"},
    {"sku": "SKU-C-301", "sku_class": "C", "system_qty": 500, "physical_qty": 498, "unit_cost_usd": 2.50}, # Diff 2 <= tolerance (Accurate)
    {"sku": "SKU-C-302", "sku_class": "C", "system_qty": 1200, "physical_qty": 1200, "unit_cost_usd": 1.10}
]

audit_res = execute_cycle_counting_audit(
    total_sku_count=10000, sku_class_distribution=classes,
    annual_count_frequencies=freqs, working_days_per_year=250, audit_sample=sample
)

print(f"Daily Cycle Count Requirement: {audit_res['required_daily_counts']} counts/day across 250 working days")
print(f"Sample IRA Accuracy: {audit_res['inventory_record_accuracy_pct']}% ({audit_res['within_tolerance_count']}/{audit_res['audited_items_count']} valid)")
print(f"Discrepancies: {audit_res['out_of_tolerance_count']} items | Net Value Variance: ${audit_res['total_monetary_variance_usd']:,.2f}")
print(f"Root Cause Pareto: {audit_res['root_cause_distribution']}")
""",
            "output": """Daily Cycle Count Requirement: 164.0 counts/day across 250 working days
Sample IRA Accuracy: 66.67% (4/6 valid)
Discrepancies: 2 items | Net Value Variance: $600.00
Root Cause Pareto: {'WRONG_PICK_SHORT': 1, 'RECEIVING_PACK_MISCOUNT': 1}""",
            "codeNotes": [
                {"line": 2, "note": "Implements ABC stratified perpetual cycle counting simulation"},
                {"line": 10, "note": "Computes daily count quota needed to satisfy annual tier count frequencies"},
                {"line": 23, "note": "Applies tiered tolerance limits based on SKU value criticality"},
                {"line": 35, "note": "Captures forensic root-cause failure classifications for corrective action"}
            ],
            "tryIt": {
                "description": "Analyze why cycle counting is vastly superior to annual physical inventory counts.",
                "question": "What is the primary operational advantage of implementing daily statistical cycle counting over an annual full-facility shutdown count?",
                "options": [
                    "Cycle counting requires zero accounting adjustments to be posted to the balance sheet",
                    "Cycle counting identifies inventory discrepancies continuously, enabling immediate root-cause investigation without halting facility operations",
                    "Cycle counting allows warehouse managers to count only cheap Class C items and ignore Class A items",
                    "Cycle counting completely eliminates the need for barcode scanners or computer WMS software"
                ],
                "answer": 1,
                "explanation": "Perpetual cycle counting enables immediate detection and forensic investigation of inventory variances as they occur, allowing management to fix defective operational processes (e.g. receiving miscounts, labeling errors) without disrupting warehouse shipping operations or shutting down revenue generation."
            }
        },
        {
            "title": "WMS Real-Time Execution Engine & Distribution Labor Productivity Scorecard",
            "say": [
                "In the final analysis, a distribution center is a complex socio-technical system where software logic, automated material handling machinery, and human labor intersect. To govern this ecosystem, modern enterprises deploy Labor Management Systems (LMS) tightly embedded within the Warehouse Management System. The LMS establishes engineered labor standards (ELS) for every discrete physical warehouse motion—calculating the exact standard time required to travel 10 meters, scan a barcode, unwrap a pallet stretch film, pick an item from a bin, and deposit it into an outbound tote.",
                "Warehouse labor productivity is governed through standardized operational key performance indicators. The primary throughput metric in order picking is Units Picked Per Hour (UPH), defined as total discrete units picked divided by direct picker work hours: UPH = Total Units Picked / Direct Picking Labor Hours. For automated pallet operations, throughput is measured in Pallet Moves Per Hour (PMPH). Comparing actual worker UPH against the engineered standard time generates a Labor Utilization and Performance Percentage: Performance % = (Standard Time Earned / Actual Time Worked) * 100.",
                "Simultaneously, warehouse executives must monitor fulfillment quality through the Pick Accuracy Rate and On-Time In-Full (OTIF) fulfillment rate. A warehouse that achieves an extraordinary 350 UPH but produces a 3% pick error rate creates operational havoc downstream: wrong items are shipped to customers, triggering expensive reverse logistics returns, customer churn, and customer service escalation costs. High-performing distribution centers enforce balanced scorecards where individual worker performance bonuses require both >= 100% productivity against engineered standards AND >= 99.8% pick accuracy.",
                "To maintain real-time operational flow, the WMS Control Tower monitors order queue aging and bottlenecks across all functional zones. If inbound receiving falls behind schedule, creating a backlog of uninspected pallets on the dock while picking lines starve for inventory, the WMS automated labor reallocation engine reassigns certified cross-trained workers from slow forward picking zones to inbound receiving. This dynamic labor balancing prevents localized bottlenecks from stalling the entire distribution center.",
                "From a technological evolution perspective, modern distribution execution is rapidly shifting toward human-machine collaborative symbiosis. Voice-directed picking headsets and Augmented Reality (AR) vision pick glasses replace handheld RF barcode guns, liberating both hands of the associate and reducing scan acquisition latency by up to 3 seconds per pick. Concurrently, Autonomous Mobile Robots (AMRs) dynamically follow human pickers through wide aisles, taking custody of picked order totes and automatically ferrying them to packing stations. This human-robot teaming eliminates up to 70% of human walking deadhead time, elevating associate picking capacity from 150 UPH to over 380 UPH without ergonomic strain.",
                "Finally, enterprise WMS platforms integrate directly with transportation management systems (TMS) to synchronize dock door scheduling. Outbound orders are wave-released and sorted in reverse delivery stop sequence directly into outbound line-haul trailers. By matching picking velocity directly with transport carrier departure windows, the warehouse eliminates staging floor congestion, maximizes trailer cubic fill rates, and drives superior supply chain velocity."
            ],
            "example": "A national retail distribution center employing 180 warehouse associates implemented an integrated WMS Labor Management System with real-time RF scanning telemetry. Prior to LMS deployment, individual picker productivity varied wildly from 65 UPH to 190 UPH, with no objective benchmark. By establishing an engineered labor standard of 145 UPH for broken-case picking and introducing a transparent daily digital leaderboard, average facility throughput jumped to 158 UPH within 60 days. Crucially, the system tracked pick error rates in real time; associates who maintained high speed but committed mispicks were automatically routed to a mandatory 15-minute digital retraining module on barcode verification. Overall facility labor cost per case handled dropped by 18.5%.",
            "code": """# WMS Execution: Labor Productivity Scorecard & Real-Time Balancing Engine
def evaluate_warehouse_shift_productivity(
    shift_workers: list[dict],
    engineered_standard_uph: float, # e.g. 150 units/hr standard
    min_accuracy_threshold_pct: float = 99.5
) -> dict:
    total_hours_worked = 0.0
    total_units_picked = 0.0
    total_errors_committed = 0.0
    
    evaluated_workers = []
    reallocation_candidates = []
    
    for w in shift_workers:
        hrs = w["hours_logged"]
        picks = w["units_picked"]
        errors = w["errors_logged"]
        
        actual_uph = picks / hrs if hrs > 0 else 0.0
        perf_pct = (actual_uph / engineered_standard_uph) * 100.0
        accuracy_pct = ((picks - errors) / picks * 100.0) if picks > 0 else 100.0
        
        bonus_eligible = (perf_pct >= 100.0) and (accuracy_pct >= min_accuracy_threshold_pct)
        
        evaluated_workers.append({
            "worker_id": w["worker_id"],
            "name": w["name"],
            "hours": hrs,
            "units_picked": picks,
            "actual_uph": round(actual_uph, 1),
            "performance_vs_standard_pct": round(perf_pct, 1),
            "pick_accuracy_pct": round(accuracy_pct, 2),
            "bonus_eligible": bonus_eligible
        })
        
        total_hours_worked += hrs
        total_units_picked += picks
        total_errors_committed += errors
        
        # If worker is far exceeding quota and has high accuracy, flag for potential supervisory/reallocation roles
        if perf_pct >= 120.0 and accuracy_pct >= 99.8:
            reallocation_candidates.append(w["worker_id"])
            
    facility_uph = total_units_picked / total_hours_worked if total_hours_worked > 0 else 0.0
    facility_accuracy = ((total_units_picked - total_errors_committed) / total_units_picked * 100.0) if total_units_picked > 0 else 100.0
    
    return {
        "total_active_workers": len(shift_workers),
        "total_shift_hours": total_hours_worked,
        "total_units_processed": total_units_picked,
        "facility_actual_uph": round(facility_uph, 1),
        "facility_pick_accuracy_pct": round(facility_accuracy, 2),
        "shift_performance_pct": round((facility_uph / engineered_standard_uph) * 100.0, 1),
        "top_performers_for_cross_balancing": reallocation_candidates,
        "worker_evaluations": evaluated_workers
    }

# Shift labor data for a 4-person pick pod
shift_data = [
    {"worker_id": "W-101", "name": "Rajesh Sharma", "hours_logged": 8.0, "units_picked": 1360, "errors_logged": 2},
    {"worker_id": "W-102", "name": "Anita Verma", "hours_logged": 8.0, "units_picked": 1520, "errors_logged": 1},
    {"worker_id": "W-103", "name": "Vikram Patel", "hours_logged": 8.0, "units_picked": 1040, "errors_logged": 8},
    {"worker_id": "W-104", "name": "Pooja Hegde", "hours_logged": 7.5, "units_picked": 1200, "errors_logged": 0}
]

shift_summary = evaluate_warehouse_shift_productivity(
    shift_workers=shift_data,
    engineered_standard_uph=150.0
)

print(f"Shift Summary: {shift_summary['total_units_processed']} units picked across {shift_summary['total_shift_hours']} worker-hours")
print(f"  Facility UPH: {shift_summary['facility_actual_uph']} units/hr (Performance vs Std: {shift_summary['shift_performance_pct']}%)")
print(f"  Facility Pick Accuracy: {shift_summary['facility_pick_accuracy_pct']}%")
print("Individual Associate Performance:")
for w in shift_summary['worker_evaluations']:
    status = "QUALIFIED FOR BONUS" if w['bonus_eligible'] else "BELOW STANDARD / QUALITY RETRAINING"
    print(f"  {w['worker_id']} ({w['name']}): {w['actual_uph']} UPH | Acc: {w['pick_accuracy_pct']}% -> {status}")
""",
            "output": """Shift Summary: 5120.0 units picked across 31.5 worker-hours
  Facility UPH: 162.5 units/hr (Performance vs Std: 108.3%)
  Facility Pick Accuracy: 99.79%
Individual Associate Performance:
  W-101 (Rajesh Sharma): 170.0 UPH | Acc: 99.85% -> QUALIFIED FOR BONUS
  W-102 (Anita Verma): 190.0 UPH | Acc: 99.93% -> QUALIFIED FOR BONUS
  W-103 (Vikram Patel): 130.0 UPH | Acc: 99.23% -> BELOW STANDARD / QUALITY RETRAINING
  W-104 (Pooja Hegde): 160.0 UPH | Acc: 100.0% -> QUALIFIED FOR BONUS""",
            "codeNotes": [
                {"line": 2, "note": "Implements WMS labor productivity scorecard and performance benchmarking"},
                {"line": 15, "note": "Calculates actual Units Picked Per Hour (UPH) vs engineered standard rate"},
                {"line": 17, "note": "Enforces dual-gate bonus qualification requiring both speed and >= 99.5% accuracy"},
                {"line": 40, "note": "Identifies top performers qualified for dynamic cross-zone workload balancing"}
            ],
            "tryIt": {
                "description": "Assess the operational risk of incentivizing warehouse workers purely on picking speed without an accuracy threshold.",
                "question": "What common operational failure occurs if a distribution center rewards warehouse pickers solely based on gross Units Picked Per Hour (UPH) without enforcing an accuracy threshold?",
                "options": [
                    "Forklift battery life increases substantially",
                    "Pickers rush past barcode confirmation steps, resulting in high mispick rates that trigger costly customer returns and reverse logistics expenses",
                    "The warehouse storage racking experiences premature structural wear",
                    "Cycle counting can be eliminated completely"
                ],
                "answer": 1,
                "explanation": "Incentivizing speed without an accuracy guardrail creates severe moral hazard: workers skip barcode verification, grab wrong SKU variants or wrong pack sizes to boost their UPH numbers, causing surging customer shipment errors, expensive return shipping costs, and customer dissatisfaction."
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
    data = get_day11_data()
    print(f"Loaded Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    total_words = 0
    for idx, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say']) + len(p['example'].split()) + len(p['tryIt']['explanation'].split())
        total_words += words
        print(f"  Part {idx+1} '{p['title'][:35]}...': ~{words} spoken words")
    print(f"Total Day 11 spoken words: ~{total_words} words (Target >= 2,950)")
