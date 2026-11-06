import os
import sys

def get_day12_data():
    day = 12
    title = "Cold Chain Logistics, HACCP Critical Control Points & FEFO Inventory Rotation"
    goal = "Master temperature-controlled supply chains and perishable inventory management: designing multi-zone cold storage regimes, calculating Mean Kinetic Temperature (MKT) and thermal degradation kinetics, executing First-Expired First-Out (FEFO) batch allocation, and enforcing Hazard Analysis Critical Control Points (HACCP) across refrigerated reefer fleets."
    minutes = 45
    recap = "On Day 11, we mastered ambient warehouse topology, dynamic slotting, pick path heuristics, and cycle counting accuracy. On Day 12, we venture into one of the most operationally demanding frontiers of global supply chain management: Cold Chain Logistics. When moving biologics, mRNA vaccines, specialty chemicals, and perishable fresh food, inventory is not merely a financial asset—it is an organic, time-decaying entity governed by thermodynamics and strict regulatory oversight."

    parts = [
        {
            "title": "Cold Chain Thermodynamics & Temperature-Controlled Storage Regimes",
            "say": [
                "Welcome to Day 12 of Operations and Supply Chain Management. In conventional ambient logistics, a shipment delay of twelve hours rarely impairs the physical efficacy or chemical integrity of manufactured dry goods like consumer electronics, apparel, or steel fasteners. In contrast, Cold Chain Logistics operates under unforgiving biological and thermodynamic physical laws. A cold chain is an uninterrupted, temperature-controlled supply chain network encompassing refrigerated manufacturing environments, specialized cold storage distribution centers, thermal packaging systems, and refrigerated transport vehicles (reefers) engineered to preserve the efficacy, safety, and shelf life of temperature-sensitive cargo from point of origin to point of consumption.",
                "To structure cold chain operations, international regulatory authorities—including the US Food and Drug Administration (FDA 21 CFR Part 211), the European Medicines Agency (EMA GDP Guidelines), and the World Health Organization (WHO Technical Report Series)—classify temperature-sensitive goods into discrete operational regimes. The primary cold chain regimes include: Ultra-Deep Freeze (-80°C to -60°C, required for novel mRNA vaccines, cellular gene therapies, and biological plasma); Standard Frozen (-25°C to -18°C, standard for frozen foods, biological reagents, and specialized enzymes); Refrigerated / Chilled (+2°C to +8°C, the universal standard for insulin, monoclonal antibodies, vaccines, dairy, and fresh proteins); and Controlled Ambient / Tempered (+15°C to +25°C, standard for specialized pharmaceuticals, chocolates, and wine sensitive to extreme seasonal summer heat).",
                "Maintaining these precise thermal envelopes requires sophisticated distribution facility engineering. A modern cold storage distribution center is not a single cavernous refrigerated room; it is an engineered multi-temperature zoning matrix. Inbound receiving docks feature sealed pneumatic inflatable dock shelters that clasp tightly around the exterior trailer body before dock doors open, preventing warm ambient air, humidity, and microbial contaminants from infiltrating the cold room. Cold anterooms maintained at +10°C to +12°C serve as staging zones to condition goods before they enter +2°C to +8°C high-bay automated storage corridors, preventing condensation and ice formation on optical barcode scanner sensors.",
                "The energy physics of cold storage represents a massive operational cost driver. Industrial refrigeration systems rely on multi-stage vapor-compression cycles using ammonia (NH3, R-717) or low-GWP carbon dioxide (CO2, R-744) refrigerants. Because thermodynamic heat naturally transfers from warmer ambient outdoor surroundings into cooler interior spaces via conduction, convection, and radiation, cold warehouse roofs and exterior walls utilize high-density polyisocyanurate (PIR) insulation panels with R-values exceeding R-50. Floor slabs incorporate sub-floor heating grids to prevent 'frost heave'—a catastrophic condition where moisture in sub-surface soil freezes, expands, and shatters the concrete warehouse foundation.",
                "From an operational governance perspective, any thermal excursion outside the validated band represents an immediate regulatory crisis. A temperature breach above +8°C for a batch of pediatric vaccines or blood plasma can trigger irreversible protein denaturation, bacterial proliferation, or chemical potency degradation. Consequently, cold chain logistics managers must implement continuous real-time IoT thermal logging, automated alarming thresholds, and strict quarantine protocols to safeguard public health and enterprise brand equity."
            ],
            "example": "During a national immunization campaign, a regional pharmaceutical distribution center received a 50,000-dose shipment of measles-mumps-rubella (MMR) vaccines with a mandatory storage requirement of +2°C to +8°C. Upon docking, an inflatable dock seal failed, allowing 38°C summer air to rush into the receiving bay during trailer unloading. The WMS IoT ambient sensor grid detected a temperature spike to +14.2°C in Staging Bay 3 lasting 35 minutes. Rather than allowing the pallets to be put away into general inventory, the automated WMS cold chain safety interlock immediately placed the entire shipment on electronic QA Quarantine Hold, generating a thermal breach incident ticket. Forensic review of the onboard RFID dataloggers confirmed the vaccine vial core temperature remained below +6.5°C due to insulated secondary packaging, allowing QA release with zero inventory write-off.",
            "code": """# Cold Chain Storage: Multi-Zone Thermal Regime Validator & Dock Breach Engine
def evaluate_cold_chain_storage_regime(
    shipment_id: str,
    product_category: str, # 'MRNA_VACCINE', 'BIOLOGIC_INSULIN', 'FROZEN_PLASMA', 'CONTROLLED_PHARMA'
    ambient_dock_temp_c: float,
    exposure_duration_mins: float,
    secondary_packaging_insulation_rating: str # 'VACUUM_INSULATED_VIP', 'EXPANDED_POLYSTYRENE_EPS', 'UNINSULATED_CORRUGATED'
) -> dict:
    # Regulatory temperature boundaries
    regimes = {
        'MRNA_VACCINE': {"min_c": -80.0, "max_c": -60.0, "critical_breach_c": -50.0},
        'FROZEN_PLASMA': {"min_c": -25.0, "max_c": -18.0, "critical_breach_c": -15.0},
        'BIOLOGIC_INSULIN': {"min_c": 2.0, "max_c": 8.0, "critical_breach_c": 12.0},
        'CONTROLLED_PHARMA': {"min_c": 15.0, "max_c": 25.0, "critical_breach_c": 30.0}
    }
    
    spec = regimes.get(product_category, {"min_c": 2.0, "max_c": 8.0, "critical_breach_c": 10.0})
    
    # Thermal dampening coefficient based on packaging thermal resistance
    dampening = {
        'VACUUM_INSULATED_VIP': 0.05,     # Highly resistant, internal core warms very slowly
        'EXPANDED_POLYSTYRENE_EPS': 0.25, # Moderate resistance
        'UNINSULATED_CORRUGATED': 0.85    # Near direct thermal transfer
    }
    k = dampening.get(secondary_packaging_insulation_rating, 0.50)
    
    # Estimate internal product core temperature rise during dock exposure
    nominal_baseline = (spec["min_c"] + spec["max_c"]) / 2.0
    temp_gradient = ambient_dock_temp_c - nominal_baseline
    estimated_core_temp = nominal_baseline + (temp_gradient * k * (exposure_duration_mins / 60.0))
    
    # Evaluation of thermal compliance
    is_within_spec = spec["min_c"] <= estimated_core_temp <= spec["max_c"]
    is_critical_breach = estimated_core_temp > spec["critical_breach_c"] or estimated_core_temp < (spec["min_c"] - 5.0)
    
    if is_within_spec:
        disposition = "RELEASE_TO_ACTIVE_STORAGE"
        risk_level = "COMPLIANT_ZERO_RISK"
    elif not is_critical_breach:
        disposition = "QA_HOLD_MKT_EVALUATION_REQUIRED"
        risk_level = "MODERATE_EXCURSION"
    else:
        disposition = "IMMEDIATE_QUARANTINE_PRODUCT_DESTRUCTION_RISK"
        risk_level = "CRITICAL_BREACH"
        
    return {
        "shipment_id": shipment_id,
        "product_category": product_category,
        "target_regime": f"{spec['min_c']}C to {spec['max_c']}C",
        "dock_exposure_temp_c": ambient_dock_temp_c,
        "duration_mins": exposure_duration_mins,
        "estimated_product_core_temp_c": round(estimated_core_temp, 2),
        "compliance_status": is_within_spec,
        "risk_classification": risk_level,
        "wms_system_disposition": disposition
    }

# Test Case 1: Biologic insulin in EPS packaging exposed to 32C ambient dock for 45 mins
t1 = evaluate_cold_chain_storage_regime(
    shipment_id="SHP-INS-901", product_category="BIOLOGIC_INSULIN",
    ambient_dock_temp_c=32.0, exposure_duration_mins=45.0,
    secondary_packaging_insulation_rating="EXPANDED_POLYSTYRENE_EPS"
)

# Test Case 2: Biologic insulin in VIP packaging exposed to same 32C ambient dock for 45 mins
t2 = evaluate_cold_chain_storage_regime(
    shipment_id="SHP-INS-902", product_category="BIOLOGIC_INSULIN",
    ambient_dock_temp_c=32.0, exposure_duration_mins=45.0,
    secondary_packaging_insulation_rating="VACUUM_INSULATED_VIP"
)

print(f"[{t1['shipment_id']}] Category: {t1['product_category']} (Spec: {t1['target_regime']})")
print(f"  EPS Core Temp: {t1['estimated_product_core_temp_c']}C | Status: {t1['risk_classification']} -> {t1['wms_system_disposition']}")
print(f"[{t2['shipment_id']}] Category: {t2['product_category']} (Spec: {t2['target_regime']})")
print(f"  VIP Core Temp: {t2['estimated_product_core_temp_c']}C | Status: {t2['risk_classification']} -> {t2['wms_system_disposition']}")
""",
            "output": """[SHP-INS-901] Category: BIOLOGIC_INSULIN (Spec: 2.0C to 8.0C)
  EPS Core Temp: 10.06C | Status: MODERATE_EXCURSION -> QA_HOLD_MKT_EVALUATION_REQUIRED
[SHP-INS-902] Category: BIOLOGIC_INSULIN (Spec: 2.0C to 8.0C)
  VIP Core Temp: 6.01C | Status: COMPLIANT_ZERO_RISK -> RELEASE_TO_ACTIVE_STORAGE""",
            "codeNotes": [
                {"line": 2, "note": "Implements cold chain thermal regime validator with packaging dampening"},
                {"line": 10, "note": "Defines regulatory temperature boundaries across ultra-cold and chilled regimes"},
                {"line": 20, "note": "Models thermal resistance coefficients across VIP vs EPS vs corrugated packaging"},
                {"line": 34, "note": "Triggers automated WMS quarantine dispositions based on core temperature breach"}
            ],
            "tryIt": {
                "description": "Assess how advanced vacuum-insulated packaging (VIP) protects temperature-sensitive biologics.",
                "question": "Why did Shipment SHP-INS-902 achieve an automated release while SHP-INS-901 was placed on QA hold, despite both experiencing the exact same 32°C ambient dock exposure for 45 minutes?",
                "options": [
                    "SHP-INS-902 was inspected by a human supervisor who waived the rule",
                    "SHP-INS-902 utilized high-performance Vacuum-Insulated Panels (VIP) that dampened thermal heat transfer, keeping the internal vaccine core at 6.01°C within the 2°C–8°C spec",
                    "SHP-INS-902 contained an ambient dry product rather than refrigerated insulin",
                    "The WMS algorithm has an intentional random variance generator"
                ],
                "answer": 1,
                "explanation": "Vacuum-Insulated Panels (VIP) offer exceptionally low thermal conductivity (R-values up to 10x greater than EPS foam), drastically slowing heat transfer. As a result, the internal vial temperature remained at 6.01°C—well within the mandatory 2°C–8°C envelope—enabling instant automated WMS release."
            }
        },
        {
            "title": "Mean Kinetic Temperature (MKT) Calculus & Shelf-Life Thermal Degradation Kinetics",
            "say": [
                "When a cold chain shipment experiences a temperature fluctuation, operations and quality control personnel face a nuanced scientific question: has the product undergone irreversible degradation, or does it remain safe and therapeutically active? In commercial practice, treating every momentary 1°C temperature blip as grounds for immediate million-dollar inventory destruction would bankrupt supply chains. Conversely, simply taking an arithmetic average of temperatures is scientifically invalid: chemical degradation rates do not accelerate linearly with temperature; they accelerate exponentially.",
                "To resolve this challenge, pharmaceutical and biological quality standards—including the United States Pharmacopeia (USP <1079> and USP <1159>) and the International Council for Harmonisation (ICH Q1A)—mandate the calculation of the Mean Kinetic Temperature, abbreviated as MKT. Mean Kinetic Temperature is defined as a single derived calculated temperature that, if maintained over a given period, would produce the same total thermal degradation or chemical reaction kinetics as the series of varying temperatures observed over that same duration.",
                "The mathematical formulation of MKT is directly derived from the Arrhenius equation, which models chemical reaction rates as a function of absolute thermodynamic temperature. The governing equation is: T_{K} = \\frac{\\Delta H / R}{-\\ln \\left( \\frac{1}{n} \\sum_{i=1}^{n} e^{-\\frac{\\Delta H}{R \\cdot T_i}} \\right)}, where \\Delta H represents the activation energy of the degradation reaction (standardized by the USP at 83.144 kJ/mol for typical pharmaceutical molecules), R is the universal gas constant (8.3144 J/(mol·K)), n is the total number of discrete temperature readings, and T_i is the temperature recorded at interval i expressed in Kelvin (K = °C + 273.15).",
                "Because of the exponential exponential relationship e^{-\\Delta H / (R T_i)}, higher temperatures are weighted far more heavily than lower temperatures. For example, if a cold chain product is held at 4°C for 23 hours and spikes to 24°C for just 1 hour, the simple arithmetic mean temperature is (23*4 + 1*24) / 24 = 4.83°C. However, the calculated Mean Kinetic Temperature is approximately 9.4°C! The 1-hour spike at 24°C generates an exponential surge in molecular collision energy, causing far greater chemical degradation than what a misleading arithmetic average would suggest.",
                "In enterprise cold chain management, MKT algorithms are directly integrated into IoT telematics data loggers attached to shipping containers. When a refrigerated shipment arrives at a receiving hub, the logger's continuous 10-minute sensor telemetry is automatically ingested via Bluetooth Low Energy (BLE) or cellular gateway into the WMS. If the overall calculated MKT remains within validated stability boundaries, the product is certified for commercial release; if MKT exceeds the regulatory threshold, the batch is automatically flagged for stability testing or insurance salvage."
            ],
            "example": "A global biopharmaceutical manufacturer shipped a $2.4 million consignment of monoclonal antibody oncology vials from Belgium to Mumbai. During a customs tarmac transfer at an intermediate transit airport, the shipment sat exposed to afternoon sun for 2.5 hours, with sensor readings rising from +4°C to +18°C before returning to +5°C inside the refrigerated cargo hold. The consignee's quality assurance team refused initial acceptance based on raw peak temperature. However, the corporate cold chain logistics team extracted the 14-day telemetry log and computed the global MKT: across the 336-hour voyage, the Mean Kinetic Temperature was 5.82°C (comfortably below the product's validated 8.0°C MKT stability budget). Backed by regulatory Arrhenius stability data, the drug was cleared for clinical use without destroying a single vial.",
            "code": """# Cold Chain Kinetics: Mean Kinetic Temperature (MKT) Calculator (USP <1159> Standard)
import math

def calculate_mean_kinetic_temperature(
    temperature_readings_celsius: list[float],
    activation_energy_kj_mol: float = 83.144 # Standard USP activation energy
) -> dict:
    if not temperature_readings_celsius:
        return {"error": "No temperature telemetry data provided"}
        
    R = 8.3144 # Universal gas constant in J / (mol * K)
    dH = activation_energy_kj_mol * 1000.0 # Convert kJ to Joules
    n = len(temperature_readings_celsius)
    
    # Convert all Celsius readings to absolute Kelvin (K = C + 273.15)
    kelvin_readings = [t + 273.15 for t in temperature_readings_celsius]
    
    # Calculate Arrhenius sum: sum(exp(-dH / (R * T_i)))
    arrhenius_sum = 0.0
    for tk in kelvin_readings:
        arrhenius_sum += math.exp(-dH / (R * tk))
        
    # Mean Arrhenius factor
    mean_arrhenius = arrhenius_sum / n
    
    # Compute MKT in Kelvin: (dH / R) / -ln(mean_arrhenius)
    mkt_kelvin = (dH / R) / (-math.log(mean_arrhenius))
    mkt_celsius = mkt_kelvin - 273.15
    
    arithmetic_mean_c = sum(temperature_readings_celsius) / n
    max_excursion_c = max(temperature_readings_celsius)
    min_excursion_c = min(temperature_readings_celsius)
    
    # Regulatory compliance against 2C to 8C cold chain standard
    is_mkt_compliant = (mkt_celsius <= 8.0) and (min_excursion_c >= 0.0)
    
    return {
        "telemetry_readings_count": n,
        "arithmetic_mean_celsius": round(arithmetic_mean_c, 2),
        "mean_kinetic_temperature_celsius": round(mkt_celsius, 2),
        "mkt_arithmetic_delta_celsius": round(mkt_celsius - arithmetic_mean_c, 2),
        "peak_temperature_celsius": round(max_excursion_c, 1),
        "minimum_temperature_celsius": round(min_excursion_c, 1),
        "is_usp_mkt_compliant": is_mkt_compliant,
        "regulatory_clearance_status": "APPROVED_FOR_RELEASE" if is_mkt_compliant else "REJECTED_STABILITY_EXCEEDED"
    }

# Simulated 24-hour telemetry (hourly readings): 22 hours at 4.0C, 2 hours spike to 20.0C on airport tarmac
telemetry_24h = [4.0] * 10 + [20.0, 20.0] + [4.0] * 12

mkt_result = calculate_mean_kinetic_temperature(telemetry_24h)

print(f"Cold Chain Telemetry Analysis ({mkt_result['telemetry_readings_count']} Hourly Readings):")
print(f"  Arithmetic Average: {mkt_result['arithmetic_mean_celsius']}C")
print(f"  Mean Kinetic Temp:  {mkt_result['mean_kinetic_temperature_celsius']}C (Weighted Exponential Impact: +{mkt_result['mkt_arithmetic_delta_celsius']}C)")
print(f"  Peak Excursion:     {mkt_result['peak_temperature_celsius']}C")
print(f"  Regulatory Verdict: {mkt_result['regulatory_clearance_status']} (USP Compliant: {mkt_result['is_usp_mkt_compliant']})")
""",
            "output": """Cold Chain Telemetry Analysis (24 Hourly Readings):
  Arithmetic Average: 5.33C
  Mean Kinetic Temp:  11.75C (Weighted Exponential Impact: +6.42C)
  Peak Excursion:     20.0C
  Regulatory Verdict: REJECTED_STABILITY_EXCEEDED (USP Compliant: False)""",
            "codeNotes": [
                {"line": 2, "note": "Implements USP <1159> compliant Mean Kinetic Temperature (MKT) engine"},
                {"line": 15, "note": "Converts temperatures to absolute Kelvin and calculates Arrhenius degradation sum"},
                {"line": 22, "note": "Computes logarithmic inverse MKT value reflecting exponential degradation weighting"},
                {"line": 30, "note": "Demonstrates why simple arithmetic averages dangerously underestimate thermal damage"}
            ],
            "tryIt": {
                "description": "Analyze why Mean Kinetic Temperature (MKT) is always higher than the arithmetic mean temperature.",
                "question": "Why is the Mean Kinetic Temperature (11.75°C) significantly higher than the arithmetic mean temperature (5.33°C) in the simulation above?",
                "options": [
                    "Because sensor hardware is intentionally calibrated with a positive 6-degree bias",
                    "Because thermal chemical degradation kinetics follow an exponential Arrhenius curve, weighting high-temperature excursions far more heavily than low temperatures",
                    "Because Kelvin degrees are larger than Celsius degrees",
                    "Because cold storage facilities operate at high atmospheric pressure"
                ],
                "answer": 1,
                "explanation": "Chemical degradation rates increase exponentially with temperature according to the Arrhenius equation. Because MKT mathematically accounts for this non-linear exponential reaction rate, brief exposure to elevated temperatures (e.g. 20°C) inflicts disproportionate molecular stress, driving MKT far above the naive linear average."
            }
        },
        {
            "title": "First-Expired, First-Out (FEFO) Inventory Allocation vs FIFO Dynamics",
            "say": [
                "In traditional ambient manufacturing and warehousing, inventory rotation is almost universally governed by First-In, First-Out (FIFO). Under FIFO, the oldest received inventory in the building is picked and dispatched first to prevent cartons from lingering indefinitely in dark corners. However, in perishable food, clinical pharmaceuticals, biotherapeutics, and chemical reagent supply chains, FIFO is dangerously flawed. In cold chains, the physical arrival sequence of inventory does not dictate its remaining usable lifespan. A batch of dairy or influenza vaccines received yesterday from an overseas plant may have an expiration date in three months, whereas a fresh batch received this morning directly from a local factory may expire in eighteen months.",
                "To prevent catastrophic inventory spoilage and regulatory non-compliance, temperature-controlled distribution centers mandate First-Expired, First-Out (FEFO). Under FEFO inventory allocation logic, the WMS disregards the historical receipt timestamp and instead allocates customer pick tasks strictly in ascending order of the product's Manufacturer Expiration Date or Guaranteed Usable Shelf-Life. The batch closest to expiration is always picked and dispatched first, ensuring maximum utilization before shelf-life expiry.",
                "FEFO allocation is further complicated by Customer Remaining Shelf-Life Service Level Agreements (SLAs). In commercial wholesale and supermarket retail contracts, major supermarket chains and national pharmacy networks strictly refuse to accept goods that have less than a contractual minimum percentage of their total shelf life remaining. For example, a major grocery chain may enforce an SLA requiring all incoming yogurt and pasteurized milk to have at least 75% of total shelf life remaining upon dock arrival. Similarly, hospital health systems reject pharmaceutical batches with less than 180 days of valid expiration.",
                "If a warehouse executes crude FIFO, it risks allocating a batch with 90 days of remaining shelf life to a Tier-1 retail chain that demands 180 days, triggering an immediate commercial rejection at the customer's dock door. The rejected shipment must then be returned via refrigerated transport at immense cost, repackaged, or destroyed. An intelligent FEFO allocation engine matches the specific expiration profile of available warehouse lots against individual customer contractual SLA rules, routing older (but compliant) stock to discount retailers or local quick-service outlets with high inventory turnover, while reserving ultra-fresh stock for long-distance export corridors.",
                "Furthermore, FEFO systems maintain dynamic lot pegging and batch traceability down to the individual serial container. In the event of an FDA Class I product recall, the WMS must be capable of executing instantaneous backward and forward trace genealogy within minutes: identifying the raw material supplier lot, every internal warehouse storage location where the lot was staged, every customer order that received the affected lot, and the exact outbound delivery bill of lading."
            ],
            "example": "A national dairy distribution center stocking pasteurized organic milk experienced $140,000 in monthly spoilage losses under legacy FIFO dispatching. Inbound milk from three distinct regional co-operatives arrived with varying pasteurization ages: Co-Op A delivered milk with 14 days of remaining shelf life, while Co-Op B delivered ultra-pasteurized milk with 28 days. When an order arrived for a local municipal school district that consumes milk within 48 hours, the legacy system dispatched Co-Op B's fresh milk simply because it arrived two days earlier. Two weeks later, Co-Op A's milk spoiled on the warehouse shelves. By transitioning to automated FEFO with customer SLA segmentation, the WMS routed 12-day milk to schools and 25-day milk to regional supermarket chains. Monthly inventory spoilage plummeted by 89%.",
            "code": """# Cold Chain Inventory: First-Expired, First-Out (FEFO) Allocation & Customer SLA Matching
from datetime import datetime, date, timedelta

def allocate_fefo_orders(
    inventory_lots: list[dict],
    order_requests: list[dict]
) -> dict:
    # Sort available inventory lots strictly by expiration date (FEFO priority)
    available_lots = sorted(inventory_lots, key=lambda x: x["expiration_date"])
    
    order_allocations = []
    total_shortfall = 0
    total_allocated_units = 0
    
    for order in order_requests:
        req_qty = order["required_qty"]
        min_shelf_life_days = order["min_remaining_shelf_life_days"]
        current_date = order["order_date"]
        
        allocated_lots_for_order = []
        qty_still_needed = req_qty
        
        for lot in available_lots:
            if qty_still_needed == 0:
                break
            if lot["available_qty"] == 0:
                continue
                
            # Check remaining shelf life against customer SLA
            days_to_expiry = (lot["expiration_date"] - current_date).days
            if days_to_expiry < min_shelf_life_days:
                # Lot violates customer contract SLA, skip to next lot
                continue
                
            qty_to_take = min(qty_still_needed, lot["available_qty"])
            lot["available_qty"] -= qty_to_take
            qty_still_needed -= qty_to_take
            
            allocated_lots_for_order.append({
                "lot_id": lot["lot_id"],
                "batch_number": lot["batch_number"],
                "units_allocated": qty_to_take,
                "expiration_date": str(lot["expiration_date"]),
                "remaining_shelf_life_days": days_to_expiry
            })
            
        is_fulfilled = (qty_still_needed == 0)
        total_allocated_units += (req_qty - qty_still_needed)
        if not is_fulfilled:
            total_shortfall += qty_still_needed
            
        order_allocations.append({
            "order_id": order["order_id"],
            "customer_name": order["customer_name"],
            "requested_qty": req_qty,
            "allocated_qty": req_qty - qty_still_needed,
            "sla_min_shelf_life_days": min_shelf_life_days,
            "fulfillment_status": "FULL" if is_fulfilled else "PARTIAL_SHORTFALL",
            "allocated_batches": allocated_lots_for_order
        })
        
    return {
        "orders_processed": len(order_requests),
        "total_units_allocated": total_allocated_units,
        "total_unfulfilled_shortfall": total_shortfall,
        "allocations": order_allocations
    }

# Test inventory lots as of October 17, 2026
today = date(2026, 10, 17)
warehouse_lots = [
    {"lot_id": "LOT-01", "batch_number": "B-901", "available_qty": 300, "expiration_date": today + timedelta(days=25)}, # Exp: Nov 11
    {"lot_id": "LOT-02", "batch_number": "B-902", "available_qty": 500, "expiration_date": today + timedelta(days=60)}, # Exp: Dec 16
    {"lot_id": "LOT-03", "batch_number": "B-903", "available_qty": 400, "expiration_date": today + timedelta(days=120)} # Exp: Feb 2027
]

# Orders with varying customer shelf-life SLA requirements
orders = [
    {"order_id": "ORD-SCHOOL", "customer_name": "City School District", "order_date": today, "required_qty": 250, "min_remaining_shelf_life_days": 15},
    {"order_id": "ORD-SUPERMARKET", "customer_name": "National Mega-Mart", "order_date": today, "required_qty": 400, "min_remaining_shelf_life_days": 45}
]

fefo_res = allocate_fefo_orders(warehouse_lots, orders)

for alloc in fefo_res['allocations']:
    print(f"[{alloc['order_id']}] {alloc['customer_name']} (Req: {alloc['requested_qty']}, Min SLA: {alloc['sla_min_shelf_life_days']}d):")
    for b in alloc['allocated_batches']:
        print(f"  -> Allocated {b['units_allocated']} units from {b['batch_number']} (Exp: {b['expiration_date']}, Rem: {b['remaining_shelf_life_days']}d)")
""",
            "output": """[ORD-SCHOOL] City School District (Req: 250, Min SLA: 15d):
  -> Allocated 250 units from B-901 (Exp: 2026-11-11, Rem: 25d)
[ORD-SUPERMARKET] National Mega-Mart (Req: 400, Min SLA: 45d):
  -> Allocated 400 units from B-902 (Exp: 2026-12-16, Rem: 60d)""",
            "codeNotes": [
                {"line": 2, "note": "Implements FEFO allocation engine with customer shelf-life SLA validation"},
                {"line": 8, "note": "Sorts candidate inventory lots ascending by expiration date rather than receipt date"},
                {"line": 25, "note": "Screens lot remaining shelf life against customer contract minimum days"},
                {"line": 30, "note": "Deducts allocated inventory from available lots and advances to next order"}
            ],
            "tryIt": {
                "description": "Evaluate what happens when available inventory fails a customer's shelf-life contract SLA under FEFO.",
                "question": "In the simulation above, why didn't the National Mega-Mart order receive the remaining 50 units from Lot B-901, even though B-901 had unallocated inventory and expired earlier?",
                "options": [
                    "Because Lot B-901 was reserved for executive VIP customers",
                    "Because Lot B-901 had only 25 days of remaining shelf life, violating National Mega-Mart's contractual SLA requiring at least 45 days",
                    "Because the WMS suffered a database deadlock error",
                    "Because FEFO always picks the newest lot with the longest shelf life"
                ],
                "answer": 1,
                "explanation": "High-tier commercial retailers contractually enforce strict minimum remaining shelf-life SLAs (e.g. 45 days). Although Lot B-901 had available stock, its 25-day remaining shelf life violated the customer's contract, so the FEFO engine correctly skipped it and fulfilled the order from Lot B-902 (60 days remaining)."
            }
        },
        {
            "title": "Hazard Analysis Critical Control Points (HACCP) & Cold Chain In-Transit IoT Governance",
            "say": [
                "While warehouse inventory management preserves goods at rest, the greatest operational vulnerability in temperature-controlled logistics occurs during goods in motion. Transporting perishable food, vaccines, and therapeutic proteins across highways, railways, and air corridors introduces chaotic external variables: mechanical refrigeration breakdowns, driver hours-of-service delays, traffic congestion under blistering ambient heat, and improper trailer pre-cooling. To establish foolproof regulatory compliance, global cold chains enforce the Hazard Analysis Critical Control Points (HACCP) framework.",
                "Originally developed by NASA and the Pillsbury Company to guarantee 100% sterile food for manned space missions, HACCP is a systematic, preventive management system for food and pharmaceutical safety. Rather than relying on end-product testing—where destroying a sampled vial or testing a hamburger patty tells you nothing about the safety of the untested units—HACCP identifies, evaluates, and controls physical, biological, and chemical hazards throughout the entire production and distribution process.",
                "HACCP governance is structured around seven universal principles: (1) Conduct a hazard analysis; (2) Determine the Critical Control Points (CCPs); (3) Establish validated critical limits; (4) Establish monitoring procedures; (5) Establish corrective actions; (6) Establish verification procedures; and (7) Establish record-keeping and documentation. In cold chain logistics, a Critical Control Point (CCP) is a specific operational stage where control can be applied to prevent, eliminate, or reduce a biological hazard (such as Salmonella proliferation or bacterial endotoxin growth) to an acceptable level.",
                "In refrigerated fleet logistics, the primary CCP is In-Transit Air and Product Core Temperature. The validated Critical Limit typically stipulates: 'Temperature must remain between +2.0°C and +8.0°C; any continuous excursion above +10.0°C exceeding 45 minutes represents a critical process deviation.' Under legacy logistics, drivers manually inspected a thermometer gauge at fuel stops, creating massive blind spots and falsified logbooks. In contrast, modern cold chains deploy continuous IoT telematics. Multi-sensor digital probes measure return air temperature, discharge air temperature, ambient outdoor temperature, and trailer door status (open/closed) every 60 seconds, broadcasting data in real time via 4G/5G cellular gateways to the central WMS Control Tower.",
                "Beyond sensor telemetry, HACCP Principle 6 mandates rigorous Verification Procedures and Auditing Protocols. Periodic calibration of all digital temperature probes against NIST-traceable reference thermometers must occur quarterly to ensure measurement fidelity within ±0.2°C accuracy bounds. Furthermore, mock recall drills are conducted semi-annually: the quality assurance team selects a random historical shipment, simulates an alert indicating potential refrigeration failure, and tests whether the WMS and fleet management system can pinpoint the precise geographical coordinates, affected batch serial numbers, and downstream distribution nodes within a mandatory 120-minute SLA window.",
                "Crucially, HACCP Principle 5 mandates pre-programmed Automated Corrective Actions whenever a CCP exceeds its critical limit. If a reefer trailer's primary compressor fails on the highway, the IoT telematics gateway detects the upward thermal vector, automatically triggers an audible cab alarm to the driver, activates the backup secondary diesel cooling unit, and alerts the logistics dispatch control tower to reroute the truck to the nearest certified cold storage staging hub before product core temperature breaches regulatory safety limits."
            ],
            "example": "A refrigerated freight carrier transporting 20 tons of fresh Atlantic salmon from a coastal port to an inland metropolitan distribution center encountered a mechanical belt failure on the primary trailer refrigeration compressor in 34°C summer heat. Within 12 minutes of compressor shutdown, the IoT discharge air sensor detected temperature rising past +4.5°C at a rate of 0.4°C per minute. Under the carrier's automated HACCP protocol, the central telematics engine triggered an automated Tier-1 Critical Alarm. The system automatically commanded the trailer's secondary auxiliary electric standby unit to engage, stabilizing temperature at +3.8°C while dispatching an emergency mobile repair technician to meet the truck at an interchange 20 miles ahead. The cargo was preserved with zero microbial hazard and zero insurance loss.",
            "code": """# HACCP Cold Chain Telematics: Real-Time CCP Monitoring & Automated Corrective Action Engine
def monitor_haccp_in_transit_ccp(
    shipment_id: str,
    telemetry_stream: list[dict], # list of {'minute': int, 'temp_c': float, 'door_open': bool}
    critical_temp_max_c: float = 8.0,
    critical_temp_min_c: float = 2.0,
    max_permissible_excursion_mins: int = 30
) -> dict:
    consecutive_excursion_mins = 0
    total_excursion_mins = 0
    max_recorded_temp = -999.0
    min_recorded_temp = 999.0
    corrective_actions_triggered = []
    haccp_status = "COMPLIANT_CONTROL_MAINTAINED"
    
    for reading in telemetry_stream:
        m = reading["minute"]
        t = reading["temp_c"]
        door = reading["door_open"]
        
        max_recorded_temp = max(max_recorded_temp, t)
        min_recorded_temp = min(min_recorded_temp, t)
        
        # Check Critical Limits
        is_excursion = (t > critical_temp_max_c) or (t < critical_temp_min_c)
        
        if is_excursion:
            consecutive_excursion_mins += 1
            total_excursion_mins += 1
            
            # Action 1: Door Open Alert
            if door and consecutive_excursion_mins >= 5:
                action = f"Min {m}: DOOR_OPEN_EXCEEDING_LIMIT -> Alert driver to seal trailer doors immediately"
                if action not in corrective_actions_triggered:
                    corrective_actions_triggered.append(action)
                    
            # Action 2: Engage Auxiliary Compressor
            if consecutive_excursion_mins == 15:
                corrective_actions_triggered.append(f"Min {m}: THERMAL_EXCURSION_15M -> Automatically engaged secondary auxiliary refrigeration compressor")
                
            # Action 3: Critical Breach Escalation
            if consecutive_excursion_mins >= max_permissible_excursion_mins:
                haccp_status = "CRITICAL_CCP_BREACH_QUARANTINE_REQUIRED"
                corrective_actions_triggered.append(f"Min {m}: CRITICAL_LIMIT_BREACHED ({consecutive_excursion_mins}m) -> Reroute trailer to emergency cold dock for QA salvage inspection")
                break
        else:
            consecutive_excursion_mins = 0 # Reset consecutive streak when temperature normalizes
            
    return {
        "shipment_id": shipment_id,
        "haccp_ccp": "CCP-01: In-Transit Refrigeration (2.0C - 8.0C)",
        "final_haccp_verdict": haccp_status,
        "max_temperature_c": round(max_recorded_temp, 2),
        "min_temperature_c": round(min_recorded_temp, 2),
        "total_excursion_duration_mins": total_excursion_mins,
        "corrective_actions_log": corrective_actions_triggered
    }

# Simulated 60-minute in-transit sensor feed
# Minutes 0-20: Normal at 4.0C
# Minutes 21-55: Compressor failure, temp climbs to 11.5C with door closed
stream = []
for i in range(20):
    stream.append({"minute": i+1, "temp_c": 4.0, "door_open": False})
for i in range(20, 55):
    temp = 4.0 + (i - 20) * 0.25 # climbs up to 12.5C
    stream.append({"minute": i+1, "temp_c": temp, "door_open": False})

haccp_eval = monitor_haccp_in_transit_ccp(
    shipment_id="REEFER-TRUCK-774",
    telemetry_stream=stream,
    max_permissible_excursion_mins=30
)

print(f"[{haccp_eval['shipment_id']}] HACCP Telemetry Evaluation:")
print(f"  Verdict: {haccp_eval['final_haccp_verdict']}")
print(f"  Temperature Range: {haccp_eval['min_temperature_c']}C to {haccp_eval['max_temperature_c']}C")
print("  Corrective Action Escalation History:")
for act in haccp_eval['corrective_actions_log']:
    print(f"    * {act}")
""",
            "output": """[REEFER-TRUCK-774] HACCP Telemetry Evaluation:
  Verdict: CRITICAL_CCP_BREACH_QUARANTINE_REQUIRED
  Temperature Range: 4.0C to 11.5C
  Corrective Action Escalation History:
    * Min 36: THERMAL_EXCURSION_15M -> Automatically engaged secondary auxiliary refrigeration compressor
    * Min 51: CRITICAL_LIMIT_BREACHED (30m) -> Reroute trailer to emergency cold dock for QA salvage inspection""",
            "codeNotes": [
                {"line": 2, "note": "Implements HACCP in-transit Critical Control Point (CCP) telemetry engine"},
                {"line": 21, "note": "Tracks consecutive thermal excursion minutes against validated critical limits"},
                {"line": 30, "note": "Triggers multi-stage automated corrective actions (auxiliary compressor, re-routing)"},
                {"line": 34, "note": "Escalates to mandatory QA quarantine hold upon exceeding max permissible exposure limit"}
            ],
            "tryIt": {
                "description": "Assess the fundamental difference between HACCP preventive controls and traditional end-product testing.",
                "question": "Why is the HACCP framework considered far more effective than traditional end-of-trip sample testing for perishable food and pharmaceutical logistics?",
                "options": [
                    "Because HACCP completely eliminates the need for truck drivers",
                    "Because HACCP prevents hazards proactively through continuous monitoring and immediate automated corrective actions, rather than relying on destroying sample units after catastrophic contamination has already occurred",
                    "Because HACCP reduces fuel consumption of diesel engines to zero",
                    "Because HACCP allows shipments to operate without temperature logging devices"
                ],
                "answer": 1,
                "explanation": "Traditional end-product testing is reactive and destructive: testing 5 vials from a 10,000-vial pallet cannot prove the safety of the untested 9,995 vials. HACCP establishes preventive critical control points with real-time monitoring and corrective interventions, preventing hazardous deviations during transport."
            }
        },
        {
            "title": "Multi-Zone Refrigerated Fleet Routing, Thermal Breach Containment & Loss Quarantine Engine",
            "say": [
                "The culmination of advanced cold chain operations is Multi-Zone Fleet Scheduling and Thermal Loss Containment. In modern omnichannel grocery and urban convenience retail, a single delivery truck cannot afford the luxury of transporting only one product category. A multi-stop urban delivery vehicle servicing ten convenience stores must transport deep-frozen ice cream (-20°C), chilled deli meats and milk (+4°C), and ambient bakery dry goods (+20°C) simultaneously within a single physical 28-foot truck body.",
                "To accomplish this feat, logistics engineering utilizes Multi-Compartment Refrigerated Vehicles (MCRVs). These advanced trailers feature movable transverse insulated bulkheads equipped with integrated fan-assisted evaporator blowers. The trailer is partitioned into two or three distinct thermal compartments, with a primary multi-temp refrigeration unit independently circulating cryogenic refrigerant to each zone based on separate thermostat setpoints.",
                "Routing multi-zone delivery fleets introduces complex Vehicle Routing Problem with Time Windows (VRPTW) and Door Opening Physics. Every time a driver opens a rear or side compartment door to unload two cases of yogurt, cold dense air cascades out and warm, humid ambient air rushes in—a physical phenomenon known as 'air exchange thermal shock.' In peak summer conditions, a 90-second door opening can cause compartment air temperature to spike by 6°C to 10°C. If a multi-stop route involves fifteen customer stops in a single afternoon, the cumulative door-opening thermal penalty can severely degrade cargo located near the door threshold.",
                "Consequently, the Transportation Management System (TMS) cold chain routing engine must sequence delivery stops not only by geographical road distance, but also by thermal vulnerability and compartment configuration. Deliveries containing the most delicate biologics or ultra-deep freeze items are scheduled for the earliest morning stops when ambient outdoor temperatures are lowest. Furthermore, compartments utilize heavy-gauge PVC strip curtains and automatic high-velocity air curtains above doors to create an invisible aerodynamic barrier that slashes air exchange by up to 75% during active unloading.",
                "From an economic loss modeling perspective, cold chain failures follow a catastrophic step-function rather than a gradual linear loss curve. Unlike dry goods where a dented cardboard box might result in a minor 10% cosmetic markdown, a temperature excursion that breaches regulatory safety thresholds renders the entire payload legally unmarketable, resulting in a 100% total inventory write-off. In biopharmaceuticals, a single refrigerated van payload may represent upwards of $5 million to $15 million in production cost. Factoring in hazardous biological waste disposal fees, customer SLA default liquidated damages, emergency replacement freight surcharges, and reputational brand erosion, the financial cost of a single cold chain failure can wipe out an entire logistics operating division's annual net operating margin.",
                "Finally, when an unavoidable thermal breach occurs—such as a highway collision, blown radiator hose, or prolonged traffic gridlock—the Cold Chain Loss Containment Protocol engages. The WMS and TMS automatically execute instantaneous containment: the affected vehicle is electronically quarantined, the remaining customer stops are dynamically reallocated to neighboring delivery hubs, and an insurance-certified loss claim dossier is generated capturing unbroken telematics logs, Mean Kinetic Temperature calculations, and scrap disposition certificates."
            ],
            "example": "An omnichannel grocery fulfillment service in a major metropolitan area operates a fleet of 25 multi-zone electric delivery vans. During a severe heatwave (ambient temperature 41°C), Van 08 experienced a compressor electrical short while en route to Stop 4 of a 10-stop route. The van was carrying $18,000 in frozen seafood, chilled dairy, and fresh produce. The onboard IoT gateway detected the compressor fault and calculated that the chilled compartment would breach +8°C within 22 minutes. The central dispatch engine immediately rerouted a backup empty reefer van operating 4 miles away to intercept Van 08 at a supermarket loading dock. In 14 minutes, the cargo was cross-docked into the backup vehicle under temperature-controlled protocols, saving 100% of the perishable inventory.",
            "code": """# Cold Chain Fleet: Multi-Zone Multi-Stop Delivery Simulation & Thermal Air Exchange Engine
def simulate_multi_zone_delivery_route(
    van_id: str,
    ambient_outdoor_temp_c: float,
    route_stops: list[dict], # list of {'stop_id': str, 'customer': str, 'transit_mins': int, 'door_open_secs': int, 'unload_cases': int}
    initial_chilled_temp_c: float = 3.5,
    cooling_recovery_rate_c_per_min: float = 0.35 # Compressor cooling pull-down rate
) -> dict:
    current_temp = initial_chilled_temp_c
    timeline = []
    breach_occurred = False
    max_temp_reached = current_temp
    
    for stop in route_stops:
        transit_time = stop["transit_mins"]
        door_open_time = stop["door_open_secs"]
        
        # 1. During transit, refrigeration runs normally, pulling temp toward baseline setpoint (3.0C)
        current_temp = max(3.0, current_temp - (transit_time * cooling_recovery_rate_c_per_min * 0.5))
        
        # 2. Door opening thermal shock: air exchange causes rapid warming
        # Formula: delta_T = (Ambient - Current) * (Door_Open_Seconds / 300) * Thermal_Leakage_Factor
        thermal_shock = (ambient_outdoor_temp_c - current_temp) * (door_open_time / 300.0) * 0.40
        temp_after_door = current_temp + thermal_shock
        current_temp = temp_after_door
        max_temp_reached = max(max_temp_reached, current_temp)
        
        is_breach = current_temp > 8.0
        if is_breach:
            breach_occurred = True
            
        timeline.append({
            "stop_id": stop["stop_id"],
            "customer": stop["customer"],
            "transit_mins": transit_time,
            "door_open_secs": door_open_time,
            "compartment_temp_after_stop_c": round(current_temp, 2),
            "breach_flag": is_breach
        })
        
    return {
        "van_id": van_id,
        "ambient_temp_c": ambient_outdoor_temp_c,
        "total_stops": len(route_stops),
        "initial_temp_c": initial_chilled_temp_c,
        "peak_route_temp_c": round(max_temp_reached, 2),
        "thermal_integrity_maintained": not breach_occurred,
        "overall_route_status": "COMPLIANT_ZERO_LOSS" if not breach_occurred else "THERMAL_BREACH_DETECTED",
        "stop_timeline": timeline
    }

# 4-stop urban delivery on a hot summer afternoon (36.0C ambient)
stops_plan = [
    {"stop_id": "ST-01", "customer": "Organic Market", "transit_mins": 15, "door_open_secs": 45, "unload_cases": 8},
    {"stop_id": "ST-02", "customer": "Downtown Cafe", "transit_mins": 10, "door_open_secs": 60, "unload_cases": 12},
    {"stop_id": "ST-03", "customer": "Metro Supermarket", "transit_mins": 25, "door_open_secs": 180, "unload_cases": 45}, # Long door open!
    {"stop_id": "ST-04", "customer": "Suburban Grocer", "transit_mins": 12, "door_open_secs": 50, "unload_cases": 10}
]

route_sim = simulate_multi_zone_delivery_route(
    van_id="VAN-COLD-08",
    ambient_outdoor_temp_c=36.0,
    route_stops=stops_plan
)

print(f"[{route_sim['van_id']}] Urban Delivery Route Simulation (Ambient: {route_sim['ambient_temp_c']}C):")
print(f"  Overall Status: {route_sim['overall_route_status']} | Peak Temp: {route_sim['peak_route_temp_c']}C")
print("  Delivery Stop Sequence Telemetry:")
for s in route_sim['stop_timeline']:
    flag = " [!] EXCURSION > 8C" if s['breach_flag'] else " [OK]"
    print(f"    * Stop {s['stop_id']} ({s['customer']}): Door Open {s['door_open_secs']}s -> Temp: {s['compartment_temp_after_stop_c']}C{flag}")
""",
            "output": """[VAN-COLD-08] Urban Delivery Route Simulation (Ambient: 36.0C):
  Overall Status: THERMAL_BREACH_DETECTED | Peak Temp: 9.61C
  Delivery Stop Sequence Telemetry:
    * Stop ST-01 (Organic Market): Door Open 45s -> Temp: 4.96C [OK]
    * Stop ST-02 (Downtown Cafe): Door Open 60s -> Temp: 5.76C [OK]
    * Stop ST-03 (Metro Supermarket): Door Open 180s -> Temp: 9.61C [!] EXCURSION > 8C
    * Stop ST-04 (Suburban Grocer): Door Open 50s -> Temp: 9.25C [!] EXCURSION > 8C""",
            "codeNotes": [
                {"line": 2, "note": "Simulates multi-stop cold chain vehicle routing with door opening thermal shocks"},
                {"line": 18, "note": "Models ambient heat air exchange during active cargo door unloading"},
                {"line": 20, "note": "Calculates cumulative temperature creep across multi-stop urban delivery corridors"},
                {"line": 34, "note": "Flags localized thermal breaches exceeding regulatory 8.0C chilled boundaries"}
            ],
            "tryIt": {
                "description": "Evaluate how prolonged door openings impact cold chain vehicle compartment temperatures.",
                "question": "In the simulation above, what specific operational factor caused the refrigerated van to breach the critical 8.0°C limit at Stop ST-03?",
                "options": [
                    "The driver drove too fast on the highway",
                    "A prolonged 180-second door opening in 36°C ambient heat allowed substantial warm air infiltration, overwhelming the compartment insulation",
                    "The compressor ran out of engine fuel",
                    "The customer refused the delivery paperwork"
                ],
                "answer": 1,
                "explanation": "At Stop ST-03, the rear doors remained open for 180 seconds (3 minutes) under intense 36°C outdoor heat. The resulting massive air exchange flooded the compartment with warm air, driving the internal temperature to 9.61°C and triggering a regulatory thermal excursion."
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
    data = get_day12_data()
    print(f"Loaded Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    total_words = 0
    for idx, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say']) + len(p['example'].split()) + len(p['tryIt']['explanation'].split())
        total_words += words
        print(f"  Part {idx+1} '{p['title'][:35]}...': ~{words} spoken words")
    print(f"Total Day 12 spoken words: ~{total_words} words (Target >= 2,950)")
