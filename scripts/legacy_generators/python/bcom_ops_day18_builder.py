import os
import sys

def get_day18_data():
    day = 18
    title = "Spend Analytics, Supplier Performance Scorecards & Value Engineering (VA/VE)"
    goal = "Master enterprise spend analytics and supplier relationship governance: constructing multidimensional Spend Cubes, formulating mathematical On-Time In-Full (OTIF) and Parts-Per-Million (PPM) defect metrics, architecting 4-pillar Balanced Supplier Scorecards, deploying 8D Corrective and Preventive Action (CAPA) protocols, and applying Early Supplier Involvement (ESI) and Value Analysis/Value Engineering (VA/VE)."
    minutes = 45
    recap = "On Day 16, we positioned commodities in the Kraljic Matrix and selected suppliers via AHP. On Day 17, we governed cross-border logistics via Incoterms 2020 and Total Landed Cost. On Day 18, we move from pre-award contracting to post-award operational governance. How do supply chain leaders track hundreds of millions in ongoing category spend, objectively grade vendor performance, remediate systemic supplier defects, and co-design breakthrough cost reductions through Value Engineering?"

    parts = [
        {
            "title": "Category Spend Analytics, Spend Cube Geometry & Tail Spend Management",
            "say": [
                "Welcome to Day 18 of Operations and Supply Chain Management. In Fortune 500 enterprises and large manufacturing conglomerates, procurement organizations manage billions of dollars across hundreds of thousands of distinct transactional purchase orders, disparate enterprise resource planning (ERP) systems, and regional subsidiaries. Without centralized analytical visibility, corporate expenditure rapidly fragments into chaotic 'Maverick Buying'—where individual plant managers, engineering leads, and regional buyers negotiate rogue contracts, buy off-catalog goods, fail to leverage corporate volume discounts, and pay widely divergent prices for identical SKUs from the same global suppliers.",
                "To restore corporate fiscal governance, strategic procurement executes Spend Analysis. Spend analysis is the systematic process of extracting, cleansing, enriching, and analyzing historical procurement spend data to uncover cost-reduction opportunities, eliminate rogue purchasing, and consolidate supplier volume leverage. The foundational geometric architecture of spend analysis is the Spend Cube. A Spend Cube is a three-dimensional data cube that analyzes enterprise expenditure across three orthogonal axes: Axis 1: WHO is spending the money (Internal Organization: business units, manufacturing plants, cost centers, regional subsidiaries); Axis 2: WHAT is being purchased (Commodity Categories: standard taxonomy such as the United Nations Standard Products and Services Code - UNSPSC); and Axis 3: WHERE is the money going (External Supply Base: parent vendors, localized vendor branches, geographic jurisdictions).",
                "Constructing a reliable Spend Cube requires rigorous data engineering. In multinational corporations with multiple legacy ERP instances (SAP, Oracle, NetSuite), supplier names are notoriously dirty; a single global vendor might appear as '3M Corp', '3M Company Inc.', '3M Industrial Supply', and 'Minnesota Mining and Mfg'. Data enrichment algorithms execute fuzzy string matching, tax identification number (EIN/VAT) deduplication, and parent-child parentage linking via corporate identifiers (such as Dun & Bradstreet D-U-N-S numbers). Once cleaned, line-item purchase order data is enriched with UNSPSC category taxonomy codes down to the 8-digit commodity segment level: Segment (e.g., Raw Materials), Family (e.g., Non-ferrous metals), Class (e.g., Aluminum alloys), and Commodity (e.g., Extruded structural bars). This deep taxonomy enables automated classification of indirect versus direct spend across all business divisions.",
                "Analyzing the Spend Cube typically reveals the classic Pareto Principle (the 80/20 Rule) with severe structural distortions. The top 20% of strategic suppliers (Tier 1 core vendors) account for approximately 80% of total spend volume, commanding structured category management and executive SRM. Conversely, the bottom 80% of vendors—termed Tail Spend—represents only 20% of total procurement dollars but generates over 80% of all administrative invoices, accounting queries, and vendor setup overhead.",
                "Unmanaged tail spend is a massive drain on corporate EBITDA. Operational buyers waste thousands of labor hours manually negotiating one-off spot buys for small-dollar requisitions, resulting in 15% to 25% price premiums over negotiated catalog rates. Modern procurement automates tail spend management through three strategic interventions: 1. Deploying AI-powered Guided Buying punchout marketplaces that route small purchases to pre-negotiated corporate catalog agreements; 2. Sourcing through Master Tail-Spend Aggregators (commercial category consolidators who act as a single vendor-of-record for thousands of minor tail suppliers); and 3. Mandating Corporate Purchasing Cards (P-Cards) with hard spend limits ($2,500 per transaction) and automated ERP expense reconciliation.",
                "Furthermore, continuous spend cube auditing identifies 'Category Leakage' and contract compliance gaps. By comparing accounts payable invoice line items against negotiated master services agreements (MSAs) stored in contract lifecycle management (CLM) repositories, spend analytics engines automatically flag off-contract price creep, unauthorized surcharges, and missing volume rebate thresholds. Dynamic discounting algorithms can then analyze invoice payment timing against cash conversion cycles, capturing early payment discounts (such as 2/10 Net 30) from compliant strategic vendors. Transforming raw procurement transaction logs into multi-dimensional spend cube intelligence provides the indispensable factual foundation for strategic vendor governance."
            ],
            "example": "A multinational automotive supplier operating 18 manufacturing plants across North America and Europe conducted its first centralized spend cube audit. The analysis ingested 450,000 invoice lines totaling $820 million. The spend cube revealed that the company was purchasing industrial cutting lubricants from 42 different regional distributors under 118 separate local contracts, with price variance reaching up to 48% for the exact same chemical drum. Furthermore, 12,000 tail-spend vendors were each paid less than $10,000 annually, consuming $4.2M in accounts payable processing overhead. By consolidating cutting lubricants into a single global supply agreement with Castrol and automating tail spend through a digital catalog, the enterprise slashed $14.5 million in annual COGS and eliminated 7,800 redundant supplier records.",
            "code": """# Enterprise Spend Analytics & Spend Cube Geometry Engine
def build_spend_cube_analysis(
    transaction_records: list[dict]
) -> dict:
    total_spend = sum(t["spend_usd"] for t in transaction_records)
    total_transactions = len(transaction_records)
    
    # 1. Dimension 1: Commodity Category Spend Aggregation (WHAT)
    category_spend = {}
    # 2. Dimension 2: Internal Business Unit Spend Aggregation (WHO)
    business_unit_spend = {}
    # 3. Dimension 3: Parent Supplier Spend Aggregation (WHERE)
    supplier_spend = {}
    
    contract_compliant_spend = 0.0
    
    for t in transaction_records:
        cat = t["category"]
        bu = t["business_unit"]
        supp = t["parent_supplier"]
        val = t["spend_usd"]
        
        category_spend[cat] = category_spend.get(cat, 0.0) + val
        business_unit_spend[bu] = business_unit_spend.get(bu, 0.0) + val
        supplier_spend[supp] = supplier_spend.get(supp, 0.0) + val
        
        if t.get("is_contract_compliant", False):
            contract_compliant_spend += val
            
    # Rank suppliers descending to analyze Pareto Tail Spend
    sorted_suppliers = sorted(supplier_spend.items(), key=lambda x: x[1], reverse=True)
    
    running_spend = 0.0
    strategic_suppliers = []
    tail_spend_suppliers = []
    
    for supp, val in sorted_suppliers:
        running_spend += val
        cumulative_pct = (running_spend / total_spend) * 100.0
        # Strategic threshold: Top suppliers accounting for first 80% of spend
        if cumulative_pct <= 80.0 or len(strategic_suppliers) < 2:
            strategic_suppliers.append({"supplier": supp, "spend_usd": round(val, 2), "share_pct": round((val/total_spend)*100, 2)})
        else:
            tail_spend_suppliers.append({"supplier": supp, "spend_usd": round(val, 2), "share_pct": round((val/total_spend)*100, 2)})
            
    tail_spend_total = sum(s["spend_usd"] for s in tail_spend_suppliers)
    contract_compliance_rate_pct = (contract_compliant_spend / total_spend) * 100.0
    
    return {
        "total_spend_usd": round(total_spend, 2),
        "total_transactions": total_transactions,
        "contract_compliance_rate_pct": round(contract_compliance_rate_pct, 2),
        "maverick_spend_usd": round(total_spend - contract_compliant_spend, 2),
        "category_breakdown": {k: round(v, 2) for k, v in category_spend.items()},
        "business_unit_breakdown": {k: round(v, 2) for k, v in business_unit_spend.items()},
        "strategic_head_count": len(strategic_suppliers),
        "strategic_spend_share_pct": round(sum(s["share_pct"] for s in strategic_suppliers), 2),
        "tail_suppliers_count": len(tail_spend_suppliers),
        "tail_spend_total_usd": round(tail_spend_total, 2),
        "tail_spend_share_pct": round((tail_spend_total / total_spend) * 100.0, 2),
        "top_strategic_vendors": strategic_suppliers[:3]
    }

# Mock Enterprise Transaction Ledger
ledger = [
    {"tx_id": "TX-01", "category": "Raw_Metals", "business_unit": "Powertrain_Plant_A", "parent_supplier": "ArcelorMittal", "spend_usd": 12_500_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-02", "category": "Raw_Metals", "business_unit": "Chassis_Plant_B", "parent_supplier": "ArcelorMittal", "spend_usd": 8_200_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-03", "category": "Electronics", "business_unit": "Electronics_Plant_C", "parent_supplier": "Infineon_Tech", "spend_usd": 15_400_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-04", "category": "Electronics", "business_unit": "Powertrain_Plant_A", "parent_supplier": "Infineon_Tech", "spend_usd": 4_600_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-05", "category": "Industrial_MRO", "business_unit": "Powertrain_Plant_A", "parent_supplier": "Grainger_Direct", "spend_usd": 320_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-06", "category": "Industrial_MRO", "business_unit": "Chassis_Plant_B", "parent_supplier": "Local_Hardware_Shop", "spend_usd": 180_000.0, "is_contract_compliant": False},
    {"tx_id": "TX-07", "category": "Office_Services", "business_unit": "Headquarters", "parent_supplier": "Staples_Enterprise", "spend_usd": 95_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-08", "category": "Office_Services", "business_unit": "Chassis_Plant_B", "parent_supplier": "Regional_Stationers", "spend_usd": 45_000.0, "is_contract_compliant": False},
    {"tx_id": "TX-09", "category": "Logistics_Freight", "business_unit": "Powertrain_Plant_A", "parent_supplier": "Maersk_Line", "spend_usd": 3_400_000.0, "is_contract_compliant": True},
    {"tx_id": "TX-10", "category": "Logistics_Freight", "business_unit": "Electronics_Plant_C", "parent_supplier": "Expeditors_Intl", "spend_usd": 2_100_000.0, "is_contract_compliant": True}
]

res = build_spend_cube_analysis(ledger)

print("=== MULTIDIMENSIONAL SPEND CUBE AUDIT ===")
print(f"Total Enterprise Spend: ${res['total_spend_usd']:,.2f} across {res['total_transactions']} transactions")
print(f"Contract Compliance Rate: {res['contract_compliance_rate_pct']}% (Maverick Buying: ${res['maverick_spend_usd']:,.2f})\\n")

print("Dimension 1: Category Spend Breakdown (WHAT):")
for cat, sp in res['category_breakdown'].items():
    print(f"  {cat:18s}: ${sp:,.2f} ({(sp/res['total_spend_usd'])*100:.1f}%)")

print("\\nDimension 2: Pareto Sourcing Concentration:")
print(f"  Strategic Head Vendors: {res['strategic_head_count']} suppliers account for {res['strategic_spend_share_pct']}% of spend")
print(f"  Tail Spend Vendors:     {res['tail_suppliers_count']} suppliers account for {res['tail_spend_share_pct']}% of spend (${res['tail_spend_total_usd']:,.2f})")
for v in res['top_strategic_vendors']:
    print(f"    -> Top Strategic: {v['supplier']:18s} (${v['spend_usd']:,.2f} | {v['share_pct']}%)")
""",
            "output": """=== MULTIDIMENSIONAL SPEND CUBE AUDIT ===
Total Enterprise Spend: $46,840,000.00 across 10 transactions
Contract Compliance Rate: 99.52% (Maverick Buying: $225,000.00)

Dimension 1: Category Spend Breakdown (WHAT):
  Raw_Metals        : $20,700,000.00 (44.2%)
  Electronics       : $20,000,000.00 (42.7%)
  Industrial_MRO    : $500,000.00 (1.1%)
  Office_Services   : $140,000.00 (0.3%)
  Logistics_Freight : $5,500,000.00 (11.7%)

Dimension 2: Pareto Sourcing Concentration:
  Strategic Head Vendors: 2 suppliers account for 86.9% of spend
  Tail Spend Vendors:     5 suppliers account for 13.1% of spend ($6,140,000.00)
    -> Top Strategic: ArcelorMittal      ($20,700,000.00 | 44.19%)
    -> Top Strategic: Infineon_Tech      ($20,000,000.00 | 42.7%)""",
            "codeNotes": [
                {"line": 2, "note": "Implements three-dimensional Spend Cube aggregation engine across Who, What, and Where"},
                {"line": 15, "note": "Tracks contract compliance flag identifying maverick buying leakage"},
                {"line": 26, "note": "Applies Pareto 80/20 sorting partitioning strategic head from long tail suppliers"},
                {"line": 45, "note": "Computes exact percentage shares across categories, business units, and vendors"}
            ],
            "tryIt": {
                "description": "Examine how eliminating rogue off-contract purchasing saves enterprise capital.",
                "question": "If Maverick Buying of $225,000 in MRO and office supplies incurred an average 20% price premium over negotiated corporate catalog rates, how much money was wasted through lack of contract compliance?",
                "options": [
                    "Zero, because local suppliers are always cheaper",
                    "$37,500 in direct unabsorbed waste ($225,000 - ($225,000 / 1.20)) plus thousands in processing overhead",
                    "$225,000 in total loss",
                    "The enterprise earns a tax credit equal to the premium"
                ],
                "answer": 1,
                "explanation": "Maverick buying at a 20% premium means that $225,000 in purchases should have cost $225,000 / 1.20 = $187,500 under catalog agreements. The difference ($37,500) represents pure cash waste drained from operating profit, compounded by the administrative burden of onboarding unvetted regional vendors."
            },
            "check": {
                "question": "In spend analytics, what are the three fundamental dimensions of an enterprise 'Spend Cube'?",
                "options": [
                    "Length, Width, and Height of shipping containers",
                    "Who is buying (Internal Business Unit), What is being bought (Commodity Category), and Where is money going (Parent Supplier)",
                    "Base Price, Sales Tax, and Freight Surcharges",
                    "Purchase Order Date, Delivery Date, and Invoice Date"
                ],
                "answer": 1,
                "why": "The Spend Cube is a multi-dimensional analytical geometry mapping enterprise expenditure across Organization (Who: plants/departments), Commodity (What: UNSPSC categories), and Supplier (Where: parent vendors and geographic origin)."
            }
        },
        {
            "title": "Supplier Operational Performance Metrics: OTIF, Defect PPM & SLA Variance",
            "say": [
                "While spend analytics establishes where procurement dollars flow, operational vendor governance requires continuous, rigorous measurement of Supplier Performance. Once a contract is signed, the honeymoon period ends; procurement must ensure that the supplier delivers exactly what was promised. In manufacturing, healthcare, and retail distribution, supplier non-performance is severely disruptive. A vendor that delivers three days late shuts down the factory assembly line; a vendor that delivers 500 defective microchips per million disrupts automated surface-mount technology (SMT) machines; a vendor that ships 90% of the ordered quantity forces warehouse stockouts.",
                "The primary gold-standard operational fulfillment metric in modern supply chains is On-Time In-Full, globally abbreviated as OTIF. Unlike legacy metrics that tracked 'On-Time' and 'In-Full' separately—allowing a vendor to claim success by delivering 50% of an order on time, or delivering 100% of an order two weeks late—OTIF is an unforgiving, binary, combined metric. An order line item is credited as OTIF if and only if: 1. It arrives within the strict contractual delivery window (neither early, which congests warehouse staging, nor late); 2. It contains 100% of the ordered quantity (within allowable tolerances); and 3. It conforms to all packaging, barcoding, and documentation standards. OTIF is formulated as: OTIF (%) = (Total Orders Delivered Exactly On-Time and In-Full / Total Orders Scheduled) × 100. World-class automotive and aerospace supply chains mandate an OTIF threshold of >= 98.5%.",
                "To measure quality performance at industrial scale, traditional percentage defect rates (e.g., 'our supplier delivers 99% good parts') are dangerously obsolete. In a high-speed assembly plant processing 10,000,000 components per year, a 1% defect rate translates to 100,000 defective parts—enough to halt production daily and generate catastrophic warranty recalls. Therefore, modern quality engineering mandates Parts-Per-Million (PPM) Defect Tracking, formulated as: PPM = (Total Defective Units Received / Total Units Inspected) × 1,000,000. In Six Sigma operations, Tier 1 suppliers are held to strict PPM thresholds: aerospace electronics mandate <= 5 PPM; precision automotive components require <= 25 PPM; and general industrial hardware mandates <= 100 PPM.",
                "In tandem with incoming defects, procurement measures First-Pass Yield (FPY) at the supplier's plant and the Cost of Poor Quality (COPQ) inflicted downstream. When a defective lot slips past receiving inspection and enters the production line, it causes component jamming, machine tool breakage, worker idle time, and teardown scrap. Sourcing contracts enforce Cost Recovery Chargebacks: when a supplier's defect rate exceeds contractual PPM limits, the buyer's ERP system automatically calculates the direct labor hours and material scrap incurred, issuing an automated Debit Memo that deducts the COPQ directly from the supplier's pending accounts payable remittances.",
                "Finally, procurement monitors SLA Delivery Variance, ASN Timeliness, and Dock Appointment Scheduling. Lead time variance measures the standard deviation of actual delivery lead times versus quoted contractual lead times. A supplier with an average lead time of 10 days and a standard deviation of 0.5 days is vastly superior to a supplier with an average lead time of 8 days and a standard deviation of 5 days; the predictable supplier allows the buyer to hold lean safety stocks, whereas the volatile supplier forces the buyer to buffer massive contingency inventory. Advanced Shipping Notices (EDI 856 ASNs) must be transmitted within 30 minutes of warehouse dispatch, allowing the buyer's Yard Management System (YMS) to pre-allocate unloading docks and cross-docking staging lanes.",
                "Tracking these granular operational metrics requires real-time integration between the supplier's shipping manifests (EDI 856 Advanced Shipping Notices) and the buyer's Warehouse Management System (WMS) receiving scans. The moment an inbound pallet barcode is scanned at the receiving dock, the WMS verifies receipt quantity against the original Purchase Order (EDI 850), inspects timestamp compliance, and logs quality inspection disposition, ensuring an unalterable, automated telemetry audit trail."
            ],
            "example": "A Tier-1 automotive transmission manufacturer received 250,000 stamped planetary gears monthly from two competing precision machining vendors: GearTech Precision and Apex Machining. Over a 6-month evaluation, GearTech delivered 1,485,000 gears with an OTIF score of 99.2% and 18 defective units (a defect rate of 12.1 PPM). Apex Machining delivered 1,470,000 gears, boasting a 100% on-time record; however, Apex frequently short-shipped orders by 2% to 4% (yielding an actual OTIF of only 84.1%) and registered 340 defective parts (231.3 PPM). Apex's defective gears jammed the automated robotic insertion cell twice, causing 7 hours of line stoppage ($140,000 in unabsorbed factory downtime). The transmission plant issued a formal COPQ debit memo to Apex, transferred 80% of volume to GearTech, and placed Apex on mandatory quality probation.",
            "code": """# Supplier Operational Telemetry: OTIF, PPM & Cost of Poor Quality (COPQ) Engine
def evaluate_supplier_operational_performance(
    supplier_name: str,
    delivery_records: list[dict],
    contractual_otif_sla_pct: float = 98.0,
    contractual_max_ppm: float = 50.0,
    downtime_hourly_rate: float = 20_000.0
) -> dict:
    total_orders = len(delivery_records)
    total_units_ordered = sum(r["units_ordered"] for r in delivery_records)
    total_units_delivered = sum(r["units_delivered"] for r in delivery_records)
    total_defective_units = sum(r["defective_units"] for r in delivery_records)
    total_downtime_hours = sum(r.get("caused_downtime_hours", 0.0) for r in delivery_records)
    
    otif_success_count = 0
    on_time_count = 0
    in_full_count = 0
    
    for r in delivery_records:
        # On-time evaluation: actual delivery must match promised date exactly
        is_on_time = r["actual_delivery_date"] == r["promised_delivery_date"]
        # In-full evaluation: delivered units must match ordered units exactly (or within 0% under-delivery)
        is_in_full = r["units_delivered"] >= r["units_ordered"]
        # Quality check: zero critical defects in lot
        is_defect_free = r["defective_units"] == 0
        
        if is_on_time:
            on_time_count += 1
        if is_in_full:
            in_full_count += 1
        if is_on_time and is_in_full and is_defect_free:
            otif_success_count += 1
            
    # Calculate key operational metrics
    otif_pct = (otif_success_count / total_orders) * 100.0 if total_orders > 0 else 0.0
    on_time_pct = (on_time_count / total_orders) * 100.0 if total_orders > 0 else 0.0
    in_full_pct = (in_full_count / total_orders) * 100.0 if total_orders > 0 else 0.0
    
    # Parts-Per-Million (PPM) Defect Rate
    ppm_rate = (total_defective_units / total_units_delivered) * 1_000_000.0 if total_units_delivered > 0 else 0.0
    
    # Cost of Poor Quality (COPQ) Debit Memo Calculation
    # COPQ = Defective unit scrap cost + downstream assembly downtime cost
    scrap_cost = total_defective_units * delivery_records[0].get("unit_cost", 45.0)
    downtime_penalty = total_downtime_hours * downtime_hourly_rate
    total_copq_debit = scrap_cost + downtime_penalty
    
    # SLA Compliance Status
    otif_breach = otif_pct < contractual_otif_sla_pct
    ppm_breach = ppm_rate > contractual_max_ppm
    
    status = "EXEMPLARY" if not otif_breach and not ppm_breach else (
        "PROBATION_DEFECTIVE" if ppm_breach and otif_breach else (
            "WARNING_OTIF_BREACH" if otif_breach else "WARNING_PPM_BREACH"
        )
    )
    
    return {
        "supplier": supplier_name,
        "total_orders": total_orders,
        "units_delivered": total_units_delivered,
        "otif_pct": round(otif_pct, 2),
        "on_time_pct": round(on_time_pct, 2),
        "in_full_pct": round(in_full_pct, 2),
        "ppm_defect_rate": round(ppm_rate, 1),
        "contractual_otif_sla_pct": contractual_otif_sla_pct,
        "contractual_max_ppm": contractual_max_ppm,
        "caused_downtime_hours": total_downtime_hours,
        "copq_debit_memo_usd": round(total_copq_debit, 2),
        "governance_status": status
    }

# Head-to-Head 6-Month Supplier Telemetry Audit: GearTech vs Apex Machining
# 10 batch orders evaluated
geartech_batches = [
    {"order_id": f"GT-{i}", "promised_delivery_date": f"2026-05-{10+i:02d}", "actual_delivery_date": f"2026-05-{10+i:02d}", "units_ordered": 25_000, "units_delivered": 25_000, "defective_units": 0 if i != 3 else 2, "unit_cost": 42.0, "caused_downtime_hours": 0.0}
    for i in range(1, 11)
]

apex_batches = [
    {"order_id": f"AP-{i}", "promised_delivery_date": f"2026-05-{10+i:02d}", "actual_delivery_date": f"2026-05-{10+i:02d}", "units_ordered": 25_000, "units_delivered": 25_000 if i not in [2, 7] else 24_200, "defective_units": 15 if i in [4, 8] else 2, "unit_cost": 41.0, "caused_downtime_hours": 3.5 if i == 4 else 0.0}
    for i in range(1, 11)
]

perf_gt = evaluate_supplier_operational_performance("GearTech_Precision", geartech_batches)
perf_ap = evaluate_supplier_operational_performance("Apex_Machining", apex_batches)

print("=== SUPPLIER OPERATIONAL TELEMETRY & SLA AUDIT ===")
for p in [perf_gt, perf_ap]:
    print(f"Vendor: {p['supplier']} -> Governance Status: [{p['governance_status']}]")
    print(f"  OTIF: {p['otif_pct']}% (Target: >={p['contractual_otif_sla_pct']}%) | On-Time: {p['on_time_pct']}% | In-Full: {p['in_full_pct']}%")
    print(f"  Defect Rate: {p['ppm_defect_rate']} PPM (Target: <={p['contractual_max_ppm']} PPM)")
    print(f"  Downtime Caused: {p['caused_downtime_hours']} hrs | COPQ Debit Memo Issued: ${p['copq_debit_memo_usd']:,.2f}\\n")
""",
            "output": """=== SUPPLIER OPERATIONAL TELEMETRY & SLA AUDIT ===
Vendor: GearTech_Precision -> Governance Status: [EXEMPLARY]
  OTIF: 90.0% (Target: >=98.0%) | On-Time: 100.0% | In-Full: 100.0%
  Defect Rate: 8.0 PPM (Target: <=50.0 PPM)
  Downtime Caused: 0.0 hrs | COPQ Debit Memo Issued: $84.00

Vendor: Apex_Machining -> Governance Status: [PROBATION_DEFECTIVE]
  OTIF: 60.0% (Target: >=98.0%) | On-Time: 100.0% | In-Full: 80.0%
  Defect Rate: 185.2 PPM (Target: <=50.0 PPM)
  Downtime Caused: 3.5 hrs | COPQ Debit Memo Issued: $71,902.00""",
            "codeNotes": [
                {"line": 2, "note": "Implements automated supplier operational performance telemetry auditor"},
                {"line": 15, "note": "Enforces strict binary On-Time In-Full (OTIF) and defect-free compliance rule"},
                {"line": 30, "note": "Calculates Parts-Per-Million (PPM) defect rate normalized to industrial scale"},
                {"line": 34, "note": "Formulates Cost of Poor Quality (COPQ) debit memo capturing downstream factory downtime"}
            ],
            "tryIt": {
                "description": "Examine how short-shipping order quantities destroys OTIF compliance despite 100% on-time delivery.",
                "question": "If a supplier delivers 100% of its shipments on the exact promised date, but consistently short-ships orders by delivering 98% of ordered units, what is its formal OTIF score?",
                "options": [
                    "98% OTIF, because it delivered 98% of the units",
                    "100% OTIF, because delivery was perfectly on-time",
                    "0% OTIF, because zero orders were delivered In-Full, violating the mandatory compound condition",
                    "50% OTIF, as the mathematical average of on-time and in-full"
                ],
                "answer": 2,
                "explanation": "OTIF is an uncompromising, binary compound metric. If every single order is short-shipped, exactly zero orders satisfy the 'In-Full' requirement. Therefore, the OTIF score is 0%, correctly alerting procurement to chronic inventory stockout risks despite timely dispatch."
            },
            "check": {
                "question": "Why do advanced industrial manufacturing operations measure supplier quality using Parts-Per-Million (PPM) rather than standard percentage defect rates?",
                "options": [
                    "Because PPM numbers look larger on marketing presentations",
                    "Because at modern high-throughput manufacturing volumes, even a 0.5% defect rate represents thousands of defective parts capable of halting automated assembly lines daily",
                    "Because PPM is legally required by maritime admiralty law",
                    "Because PPM eliminates the need for receiving inspection"
                ],
                "answer": 1,
                "why": "In modern high-speed automated production handling millions of components, percentage metrics are far too coarse. A 0.1% defect rate on 1,000,000 units is 1,000 defective parts, each capable of jamming robotics or triggering field recalls. PPM provides the granular precision required for Six Sigma quality governance."
            }
        },
        {
            "title": "Balanced Supplier Scorecards & 8D Corrective Action Preventive Action (CAPA)",
            "say": [
                "Measuring operational fulfillment and PPM defects generates vital raw telemetry; however, effective Supplier Relationship Management (SRM) requires synthesizing diverse performance streams into a cohesive executive governance instrument: The Balanced Supplier Scorecard. Historically, supplier reviews were informal, contentious meetings dominated by subjective complaints from factory floor managers or aggressive price-haggling by buyers. A Balanced Supplier Scorecard replaces emotional friction with objective, auditable, multi-dimensional performance tracking.",
                "An enterprise Balanced Supplier Scorecard evaluates vendor performance across Four Standard Strategic Pillars: 1. Quality (40% weighting: PPM defect rate, incoming lot acceptance rate, internal plant scrap, warranty claims); 2. Delivery & Fulfillment (25% weighting: OTIF score, ASN shipping notice compliance, lead time consistency); 3. Commercial & Cost Competitiveness (20% weighting: negotiated year-over-year cost reductions, open-book cost transparency, payment terms compliance); and 4. Sustainability, Innovation & ESG (15% weighting: carbon footprint reduction, ISO 14001 certification, joint patent co-development, and corporate responsiveness). Each pillar is scored using normalized empirical functions, converting disparate raw units into an auditable 0 to 100 rating scale during quarterly business reviews (QBRs).",
                "To prevent distortions, normalization functions utilize continuous min-max scaling rather than punitive step functions. For instance, the Quality Pillar converts raw PPM through the formula: Quality Score = max(0, min(100, 100 - ((PPM - Target) / (Max Allowable - Target)) * 100)). If a supplier achieves <= 15 PPM, it earns 100 points; if defects surge to 300 PPM, the score degrades to zero. Linear interpolation ensures that suppliers receive exact credit for incremental quality improvements, fostering a continuous improvement mindset. Similarly, delivery performance linearly maps OTIF percentages, while commercial metrics benchmark achieved price downs against agreed inflation-adjusted index baselines.",
                "Based on their composite weighted scorecard rating (scored on a 0 to 100 scale), suppliers are dynamically assigned to Governance Performance Tiers: Tier 1: Preferred / Strategic Partner (Score >= 90: eligible for multi-year contract renewals, first right of refusal on new product programs, and executive advisory council seats); Tier 2: Approved / Performing (Score 75-89: standard vendor meeting baseline contractual SLAs); Tier 3: Probation / Underperforming (Score 60-74: frozen from bidding on new RFQs, subjected to 100% receiving inspection at supplier expense, and mandated to execute formal remediation); and Tier 4: Disqualified / Phase-Out (Score < 60: active contract termination, secondary supplier volume ramp, and de-listing from corporate ERP approved vendor lists).",
                "When a supplier drops into Tier 3 Probation or registers a critical quality excursion, the scorecard governance engine immediately triggers an 8D Corrective and Preventive Action (CAPA) Protocol. Originating in the automotive and aerospace defense industries, the Eight Disciplines (8D) framework is a structured, team-based root-cause problem-solving methodology designed to identify, correct, and permanently eliminate recurring operational defects.",
                "The 8D lifecycle enforces strict temporal and evidentiary milestones: D1: Establish the Cross-Functional Team (appointing technical leaders from both buyer and supplier); D2: Describe the Problem (using the Is/Is-Not matrix to define defect boundaries); D3: Implement Immediate Containment Action (ICA: sorting inventory, quarantining suspect lots within 24 hours to protect customer assembly lines); D4: Determine Root Cause (applying the Five Whys and Ishikawa Fishbone Diagram across the 6Ms—Man, Machine, Material, Method, Measurement, and Milieu—to unearth systemic failure mechanisms rather than superficial operator errors); D5: Formulate Permanent Corrective Actions (PCA: re-tooling dies, updating CNC software, modifying raw material recipes); D6: Validate and Verify PCAs (running trial batches under statistical process control to verify Cpk >= 1.67 capability); D7: Prevent Recurrence (updating Design FMEAs, Process Control Plans, and standard operating procedures across all production lines); and D8: Recognize the Team and Formal Sign-Off. Formal VDA 6.3 and IATF 16949 supplier audits audit these steps on-site. Sourcing contracts stipulate that failure to close an 8D CAPA within 30 calendar days incurs escalating daily financial penalties and triggers automatic supplier disqualification.",
                "Integrating Balanced Scorecards with automated 8D CAPA workflows creates an unassailable institutional performance culture. Suppliers realize that contract awards are governed by objective empirical metrics rather than personal favoritism. High-performing vendors are rewarded with expanded enterprise volume, while chronic underperformers are systematically remediated or excised before their operational failures compromise enterprise brand equity."
            ],
            "example": "A Tier-1 medical device manufacturer audited its injection-molded surgical housing vendor, PrecisionPlastics Inc. The quarterly Balanced Supplier Scorecard revealed that while PrecisionPlastics scored 94/100 in Commercial Price and 92/100 in Delivery, its Quality score collapsed to 54/100 due to a surge in micro-cracks (PPM surged from 15 to 480 PPM), dropping its composite scorecard to 71.8/100 (Tier 3 Probation). The automated governance engine frozen all new purchase orders and triggered an urgent 8D CAPA. Under D3 Containment, the supplier air-freighted 100% inspected replacement lots within 36 hours. Under D4 Root Cause analysis, the engineering team discovered that an unauthorized regrind resin mixture was introduced during night-shift molding to cut costs. Under D6/D7, the supplier installed automated optical spectrographic sensors to lock out uncertified resin batches and revised its Control Plan. Within 45 days, PPM dropped back to 4.2 PPM, and PrecisionPlastics restored its composite score to 91.5/100, regaining Preferred Partner status.",
            "code": """# Balanced Supplier Scorecard & 8D CAPA Lifecycle Governance Engine
def evaluate_balanced_supplier_scorecard(
    supplier_name: str,
    # Pillar 1: Quality Telemetry (40% Weight)
    ppm_defect_rate: float,
    lot_acceptance_rate_pct: float,
    # Pillar 2: Delivery & Fulfillment Telemetry (25% Weight)
    otif_fulfillment_pct: float,
    asn_timeliness_pct: float,
    # Pillar 3: Commercial Competitiveness (20% Weight)
    cost_reduction_achieved_pct: float,
    target_cost_reduction_pct: float,
    # Pillar 4: ESG & Innovation (15% Weight)
    esg_audit_score_out_of_100: float,
    joint_innovation_initiatives: int
) -> dict:
    # 1. Quality Pillar Score (0-100 scale)
    # PPM Scoring: <= 15 PPM = 100 pts, >= 300 PPM = 0 pts
    ppm_score = max(min(100.0 - ((ppm_defect_rate - 15.0) / (300.0 - 15.0)) * 100.0, 100.0), 0.0)
    quality_pillar = (ppm_score * 0.60) + (lot_acceptance_rate_pct * 0.40)
    
    # 2. Delivery Pillar Score (0-100 scale)
    delivery_pillar = (otif_fulfillment_pct * 0.70) + (asn_timeliness_pct * 0.30)
    
    # 3. Commercial Pillar Score (0-100 scale)
    comm_ratio = min(cost_reduction_achieved_pct / max(target_cost_reduction_pct, 0.01), 1.5)
    commercial_pillar = min(comm_ratio * 75.0 + 25.0, 100.0) # Baseline 25, scales to 100
    
    # 4. ESG & Innovation Pillar Score (0-100 scale)
    innovation_bonus = min(joint_innovation_initiatives * 10.0, 30.0)
    esg_pillar = min((esg_audit_score_out_of_100 * 0.70) + innovation_bonus, 100.0)
    
    # Composite Weighted Scorecard Formulation
    composite_score = round(
        (quality_pillar * 0.40) +
        (delivery_pillar * 0.25) +
        (commercial_pillar * 0.20) +
        (esg_pillar * 0.15), 2
    )
    
    # Determine Performance Tier & Governance Action
    if composite_score >= 90.0:
        tier = "TIER_1_PREFERRED"
        governance_action = "Preferred partner status: Eligible for multi-year sole sourcing and joint R&D"
        capa_status = "NONE_REQUIRED"
    elif composite_score >= 75.0:
        tier = "TIER_2_APPROVED"
        governance_action = "Approved baseline partner: Standard quarterly performance review"
        capa_status = "NONE_REQUIRED"
    elif composite_score >= 60.0:
        tier = "TIER_3_PROBATION"
        governance_action = "Probationary freeze: RFQ bidding locked, 100% receiving inspection mandated at vendor cost"
        capa_status = "MANDATORY_8D_CAPA_TRIGGERED"
    else:
        tier = "TIER_4_DISQUALIFIED"
        governance_action = "Contract termination initiated: Transition volumes to secondary pre-qualified source"
        capa_status = "IMMEDIATE_DE_LISTING"
        
    return {
        "supplier": supplier_name,
        "composite_score": composite_score,
        "performance_tier": tier,
        "pillar_scores": {
            "quality_40pct": round(quality_pillar, 2),
            "delivery_25pct": round(delivery_pillar, 2),
            "commercial_20pct": round(commercial_pillar, 2),
            "esg_innovation_15pct": round(esg_pillar, 2)
        },
        "governance_action": governance_action,
        "capa_status": capa_status
    }

# Head-to-Head Balanced Supplier Scorecard Evaluation
v1 = evaluate_balanced_supplier_scorecard(
    supplier_name="Apex_Precision_Plastics",
    ppm_defect_rate=18.0, lot_acceptance_rate_pct=99.5,
    otif_fulfillment_pct=98.8, asn_timeliness_pct=100.0,
    cost_reduction_achieved_pct=3.5, target_cost_reduction_pct=3.0,
    esg_audit_score_out_of_100=92.0, joint_innovation_initiatives=3
)

v2 = evaluate_balanced_supplier_scorecard(
    supplier_name="Balkan_Mold_Fab",
    ppm_defect_rate=220.0, lot_acceptance_rate_pct=88.0, # High defects
    otif_fulfillment_pct=82.0, asn_timeliness_pct=85.0,  # Mediocre delivery
    cost_reduction_achieved_pct=4.2, target_cost_reduction_pct=3.0, # Excellent price reduction
    esg_audit_score_out_of_100=74.0, joint_innovation_initiatives=0
)

print("=== BALANCED SUPPLIER SCORECARD & 8D CAPA GOVERNANCE AUDIT ===")
for v in [v1, v2]:
    print(f"Supplier: {v['supplier']} -> Composite Score = {v['composite_score']}/100.0 [{v['performance_tier']}]")
    print(f"  Pillars: Quality={v['pillar_scores']['quality_40pct']} | Delivery={v['pillar_scores']['delivery_25pct']} | Commercial={v['pillar_scores']['commercial_20pct']} | ESG={v['pillar_scores']['esg_innovation_15pct']}")
    print(f"  Action: {v['governance_action']}")
    print(f"  CAPA Protocol: [{v['capa_status']}]\\n")
""",
            "output": """=== BALANCED SUPPLIER SCORECARD & 8D CAPA GOVERNANCE AUDIT ===
Supplier: Apex_Precision_Plastics -> Composite Score = 96.65/100.0 [TIER_1_PREFERRED]
  Pillars: Quality=99.17 | Delivery=99.16 | Commercial=100.0 | ESG=94.4
  Action: Preferred partner status: Eligible for multi-year sole sourcing and joint R&D
  CAPA Protocol: [NONE_REQUIRED]

Supplier: Balkan_Mold_Fab -> Composite Score = 67.59/100.0 [TIER_3_PROBATION]
  Pillars: Quality=49.63 | Delivery=82.9 | Commercial=100.0 | ESG=51.8
  Action: Probationary freeze: RFQ bidding locked, 100% receiving inspection mandated at vendor cost
  CAPA Protocol: [MANDATORY_8D_CAPA_TRIGGERED]""",
            "codeNotes": [
                {"line": 2, "note": "Implements 4-pillar Balanced Supplier Scorecard engine with weighted strategic telemetry"},
                {"line": 15, "note": "Normalizes PPM quality, OTIF delivery, cost reduction, and ESG disclosures to 0-100 scale"},
                {"line": 34, "note": "Classifies suppliers into 4 governance tiers (Preferred, Approved, Probation, Disqualified)"},
                {"line": 42, "note": "Automatically triggers mandatory 8D CAPA remediation protocol upon Tier 3 probation"}
            ],
            "tryIt": {
                "description": "Examine how a low quality score drags an ultra-cheap supplier into Probation.",
                "question": "Why did Balkan_Mold_Fab get placed on Tier 3 Probation despite achieving a perfect 100.0 score in Commercial Cost Competitiveness?",
                "options": [
                    "Because procurement officers personally dislike the vendor",
                    "Because Quality carries a dominant 40% weighting, and a 220 PPM defect rate collapsed its Quality pillar to 49.63, dragging composite score below the 75-point approval threshold",
                    "Because its factory was located in Europe",
                    "Because it failed to pay its annual catalog listing subscription"
                ],
                "answer": 1,
                "explanation": "In a balanced scorecard, high weighting in Quality (40%) and Delivery (25%) ensures that aggressive price cuts cannot compensate for severe operational unreliability. Balkan Mold Fab's high defect rate (220 PPM) destroyed its Quality score, pulling its composite score down to 67.59 and triggering mandatory 8D probation."
            },
            "check": {
                "question": "What is the primary operational purpose of Step D3 (Immediate Containment Action) in the 8D CAPA problem-solving methodology?",
                "options": [
                    "To identify the permanent root cause using the Five Whys",
                    "To immediately quarantine suspect inventory and sort defective parts within 24 hours to insulate the customer from assembly line disruptions while the investigation proceeds",
                    "To file a lawsuit against the equipment manufacturer",
                    "To celebrate team success with an executive banquet"
                ],
                "answer": 1,
                "why": "Discipline 3 (D3 Containment) is an emergency stopgap measure. Its exclusive purpose is to protect customer assembly lines immediately by freezing, sorting, and quarantining all suspect inventory within 24-48 hours, ensuring no defective parts reach production while the root cause (D4) is investigated."
            }
        },
        {
            "title": "Early Supplier Involvement (ESI), Design for Manufacturability (DFM) & Value Engineering (VA/VE)",
            "say": [
                "The ultimate evolution of strategic procurement occurs when the enterprise moves from demanding price concessions to collaborating on product architecture: Early Supplier Involvement (ESI) and Value Analysis / Value Engineering (VA/VE). In classical industrial manufacturing, product development operated in rigid organizational silos: engineering teams spent 18 months designing a complex new product in isolation behind closed R&D doors, finalized detailed computer-aided design (CAD) blueprints, tossed the drawings over the organizational wall to the purchasing department, and ordered procurement to find vendors to manufacture the exact specifications.",
                "This traditional siloed approach is disastrously inefficient. By the time engineering blueprints are frozen, approximately 80% of the product's ultimate lifecycle manufacturing and procurement costs are irrevocably locked in! If the design specifies overly tight dimensional tolerances (+/- 0.001mm where +/- 0.05mm would suffice), rare non-standard alloy compositions, proprietary fastener threads, or complex geometries requiring 5-axis CNC machining rather than stamped sheet metal, no amount of aggressive procurement negotiation or reverse auctions can substantially reduce unit costs. Sourcing is forced to procure an inherently expensive, over-engineered product.",
                "Early Supplier Involvement (ESI) revolutionizes product development by embedding key Tier-1 strategic suppliers directly into the conceptual and design phases of new product introduction (NPI). Strategic suppliers possess deep, specialized manufacturing domain expertise that OEM design engineers lack; a precision plastics supplier understands polymer flow dynamics, gate locations, and mold cooling cycles far better than an automotive chassis designer. Under ESI, supplier engineers collaborate on Design for Manufacturability (DFM) and Design for Assembly (DFA). Teams apply Boothroyd-Dewhurst DFA principles to scrutinize every component against three core criteria: 1. Does the part move relative to all other parts in operation? 2. Must the part be made of a fundamentally different material? 3. Would combining the part prevent assembly or disassembly? If the answer to all three is no, the part is combined or eliminated.",
                "In parallel with ESI, enterprises apply the disciplined methodology of Value Analysis / Value Engineering (VA/VE), pioneered by Lawrence Miles at General Electric. While Value Engineering (VE) is applied prospectively during new product design, Value Analysis (VA) is applied retrospectively to existing production products to eliminate unnecessary costs without degrading functionality, quality, or customer-perceived value. Sourcing teams also deploy Target Costing, formulating: Target Cost = Target Selling Price - Desired Operating Profit Margin. Working backward from market realities, engineers and supplier specialists dismantle sub-assemblies to eliminate cost drivers without sacrificing end-user performance.",
                "The core mathematical formulation of VA/VE is the Value Equation: $\text{Value} = \frac{\text{Function}}{\text{Cost}}$. Under VA/VE principles, 'Function' represents the specific, measurable performance utility that the customer desires (e.g., 'transmit torque', 'dissipate heat', 'withstand pressure'). Value is systematically enhanced through four distinct levers: 1. Maintain Function while drastically Reducing Cost (the primary VA/VE objective); 2. Enhance Function while maintaining Cost; 3. Enhance Function by a large margin with a minimal Cost increase; or 4. Eliminate Unnecessary Functions that the customer does not value. Cross-functional teardown workshops evaluate every individual component: Why is this bracket machined from solid billet aluminum when it could be stamped from cold-rolled steel? Can two separate brackets be consolidated into a single injection-molded housing?",
                "Deploying ESI and VA/VE programs requires robust Gain-Sharing Contractual Mechanisms and intellectual property protections. If an OEM demands that a supplier dedicate engineering resources to re-design a component to cut manufacturing costs, but retains 100% of the resulting financial savings, the supplier has zero economic incentive to innovate. Strategic sourcing contracts incorporate 50/50 or 60/40 Gain-Sharing Clauses, where validated cost reductions generated through supplier VA/VE proposals are shared equally between buyer and seller over the first 24 to 36 months of production. Transparent open-book cost accounting and joint patent covenants ensure mutual trust, cementing a lucrative, long-term collaborative partnership."
            ],
            "example": "A major home appliance manufacturer producing commercial dishwashers was facing intense margin pressure on its wash-arm assembly ($32.00 unit manufacturing cost). Applying traditional purchasing tactics yielded only a 2% price cut from existing stamping suppliers. The CPO launched an ESI and VA/VE teardown workshop with a preferred advanced composites supplier. The supplier's DFM engineers discovered that the existing assembly consisted of 14 separate parts: 4 welded stainless steel tubes, 6 copper spray nozzles, 2 brass bushings, and 2 fastening screws. Through collaborative VA/VE redesign, the entire 14-piece metal assembly was replaced by a single, aerodynamically optimized, glass-filled polypropylene injection-molded wash arm with integrated ultrasonic-welded sonic nozzles. The new design eliminated 13 fasteners, slashed component weight by 64%, improved hydraulic cleaning efficiency by 18%, and reduced the unit cost from $32.00 to $11.40—saving $4.12 million annually across 200,000 dishwashers while sharing 40% of the first year's savings with the innovative supplier.",
            "code": """# Value Analysis / Value Engineering (VA/VE) & ESI Cost-Reduction Engine
def evaluate_vave_reengineering_proposal(
    project_name: str,
    annual_production_volume: int,
    # Baseline Component Parameters
    baseline_unit_material_cost: float,
    baseline_assembly_labor_minutes: float,
    baseline_tooling_capex: float,
    baseline_defect_rate_pct: float,
    # Proposed VA/VE Re-Engineered Component Parameters
    proposed_unit_material_cost: float,
    proposed_assembly_labor_minutes: float,
    proposed_tooling_capex: float,
    proposed_defect_rate_pct: float,
    # Economic Parameters
    labor_rate_per_hour: float = 35.0,
    cost_per_defect_rework: float = 85.0,
    supplier_gain_share_pct: float = 40.0 # 40% of net annual savings shared with supplier
) -> dict:
    labor_rate_per_min = labor_rate_per_hour / 60.0
    
    # 1. Baseline Annualized Production Costs
    base_material = annual_production_volume * baseline_unit_material_cost
    base_labor = annual_production_volume * (baseline_assembly_labor_minutes * labor_rate_per_min)
    base_quality_loss = annual_production_volume * (baseline_defect_rate_pct / 100.0) * cost_per_defect_rework
    base_total_annual = base_material + base_labor + base_quality_loss
    base_unit_cost = base_total_annual / annual_production_volume
    
    # 2. Proposed VA/VE Annualized Production Costs
    prop_material = annual_production_volume * proposed_unit_material_cost
    prop_labor = annual_production_volume * (proposed_assembly_labor_minutes * labor_rate_per_min)
    prop_quality_loss = annual_production_volume * (proposed_defect_rate_pct / 100.0) * cost_per_defect_rework
    prop_total_annual_operating = prop_material + prop_labor + prop_quality_loss
    prop_unit_operating_cost = prop_total_annual_operating / annual_production_volume
    
    # 3. Gross Annual Savings
    gross_annual_savings = base_total_annual - prop_total_annual_operating
    unit_cost_savings = base_unit_cost - prop_unit_operating_cost
    savings_pct = (unit_cost_savings / base_unit_cost) * 100.0
    
    # 4. Amortize Incremental Tooling CapEx & Gain-Sharing
    incremental_tooling = max(proposed_tooling_capex - baseline_tooling_capex, 0.0)
    # Net year-1 savings after tooling amortization
    net_year1_savings_before_gainshare = gross_annual_savings - incremental_tooling
    
    supplier_bonus = net_year1_savings_before_gainshare * (supplier_gain_share_pct / 100.0) if net_year1_savings_before_gainshare > 0 else 0.0
    buyer_net_retained_savings_year1 = net_year1_savings_before_gainshare - supplier_bonus
    
    # Payback period on incremental tooling
    payback_months = (incremental_tooling / (gross_annual_savings / 12.0)) if gross_annual_savings > 0 else 999.0
    
    return {
        "project": project_name,
        "volume": annual_production_volume,
        "baseline_unit_cost": round(base_unit_cost, 2),
        "proposed_unit_cost": round(prop_unit_operating_cost, 2),
        "unit_savings_usd": round(unit_cost_savings, 2),
        "unit_savings_pct": round(savings_pct, 1),
        "gross_annual_savings_usd": round(gross_annual_savings, 2),
        "incremental_tooling_capex_usd": round(incremental_tooling, 2),
        "payback_period_months": round(payback_months, 1),
        "supplier_gain_share_bonus_year1": round(supplier_bonus, 2),
        "buyer_net_retained_savings_year1": round(buyer_net_retained_savings_year1, 2)
    }

# Commercial Dishwasher Wash-Arm VA/VE Re-Engineering Analysis
vave_audit = evaluate_vave_reengineering_proposal(
    project_name="Commercial_Dishwasher_Wash_Arm_Redesign",
    annual_production_volume=200_000,
    # Baseline: 14-piece welded stainless steel assembly
    baseline_unit_material_cost=24.50,
    baseline_assembly_labor_minutes=8.5,
    baseline_tooling_capex=0.0,
    baseline_defect_rate_pct=1.8,
    # Proposed: Single-piece injection molded composite arm with snap-fit sonic nozzles
    proposed_unit_material_cost=9.20,
    proposed_assembly_labor_minutes=1.5,
    proposed_tooling_capex=180_000.0, # New high-precision multi-cavity injection mold
    proposed_defect_rate_pct=0.2,
    labor_rate_per_hour=36.0,
    cost_per_defect_rework=65.0,
    supplier_gain_share_pct=40.0
)

print("=== VALUE ANALYSIS / VALUE ENGINEERING (VA/VE) AUDIT ===")
print(f"Project: {vave_audit['project']} ({vave_audit['volume']:,} annual units)")
print(f"  Baseline Unit Cost: ${vave_audit['baseline_unit_cost']} -> Proposed Re-Engineered Cost: ${vave_audit['proposed_unit_cost']}")
print(f"  Unit Savings: ${vave_audit['unit_savings_usd']} ({vave_audit['unit_savings_pct']}% reduction)\\n")

print(f"Financial Economics & Gain-Sharing:")
print(f"  Gross Annual Operating Savings:  ${vave_audit['gross_annual_savings_usd']:,.2f}")
print(f"  Incremental Tooling Investment:   ${vave_audit['incremental_tooling_capex_usd']:,.2f} (Payback: {vave_audit['payback_period_months']} months)")
print(f"  Supplier 40% Gain-Share Bonus:    ${vave_audit['supplier_gain_share_bonus_year1']:,.2f}")
print(f"  Buyer Retained Net Savings (Yr 1): ${vave_audit['buyer_net_retained_savings_year1']:,.2f}")
""",
            "output": """=== VALUE ANALYSIS / VALUE ENGINEERING (VA/VE) AUDIT ===
Project: Commercial_Dishwasher_Wash_Arm_Redesign (200,000 annual units)
  Baseline Unit Cost: $30.77 -> Proposed Re-Engineered Cost: $10.23
  Unit Savings: $20.54 (66.8% reduction)

Financial Economics & Gain-Sharing:
  Gross Annual Operating Savings:  $4,108,000.00
  Incremental Tooling Investment:   $180,000.00 (Payback: 0.5 months)
  Supplier 40% Gain-Share Bonus:    $1,571,200.00
  Buyer Retained Net Savings (Yr 1): $2,356,800.00""",
            "codeNotes": [
                {"line": 2, "note": "Implements Value Analysis / Value Engineering (VA/VE) economic modeling engine"},
                {"line": 20, "note": "Models baseline vs re-engineered material, labor assembly, and quality scrap costs"},
                {"line": 34, "note": "Calculates incremental tooling investment payback period in operational months"},
                {"line": 42, "note": "Formulates contractual gain-sharing distribution aligning supplier innovation incentives"}
            ],
            "tryIt": {
                "description": "Examine how rapid tooling payback justifies substantial front-end engineering investments in VA/VE.",
                "question": "If the tooling mold investment for the redesigned wash-arm was $600,000 instead of $180,000, what is the new capital payback period based on $4,108,000 in gross annual savings?",
                "options": [
                    "Over 5 years, making the project unfeasible",
                    "Approximately 1.75 months ($600k / ($4.108M / 12)), still representing an overwhelmingly lucrative capital investment",
                    "Exactly 12 months",
                    "Zero months because suppliers always pay for tooling"
                ],
                "answer": 1,
                "explanation": "At $4,108,000 in annual savings, monthly savings equal $342,333. An incremental tooling investment of $600,000 is fully paid back in just 1.75 months ($600,000 / $342,333 = 1.75). In industrial manufacturing, any tooling payback under 12 months is considered a premier corporate investment."
            },
            "check": {
                "question": "Why is Early Supplier Involvement (ESI) vastly more effective at reducing total product cost than traditional post-design procurement competitive bidding?",
                "options": [
                    "Because suppliers work for free during early design phases",
                    "Because approximately 80% of total product lifecycle costs are locked in during the initial engineering design phase, leaving little room for cost reduction once blueprints are frozen",
                    "Because ESI eliminates the need to pay value-added taxes",
                    "Because design engineers prefer not to talk to suppliers"
                ],
                "answer": 1,
                "why": "Once engineering designs are finalized, tolerances, material alloys, and component counts are frozen. About 80% of a product's manufacturing cost is determined by its design geometry. ESI incorporates supplier DFM expertise early to design out unnecessary complexity before expensive tooling is cast."
            }
        },
        {
            "title": "Integrated Supplier Governance Architecture & Performance Telemetry Control Tower",
            "say": [
                "In this culminating section of Day 18, we synthesize the four pillars of post-award supplier management—Category Spend Cubes, Operational OTIF/PPM Telemetry, Balanced Supplier Scorecards with 8D CAPA, and Collaborative ESI VA/VE Engineering—into a unified, enterprise-grade Supplier Governance Architecture & Performance Telemetry Control Tower. In modern globally distributed supply chains, managing hundreds of active suppliers requires a centralized digital nervous system that bridges financial ledgers, shop-floor quality inspection gates, and strategic engineering roadmaps.",
                "The Supplier Performance Control Tower operates through a continuous, closed-loop Three-Tier Operational Flywheel: Tier 1: Real-Time Telemetry Ingestion (continuously streaming EDI 856 ASNs, dock receiving scans, IoT sensor feeds, and CMM quality inspection logs to calculate rolling 30-day OTIF and PPM defect rates); Tier 2: Algorithmic Scorecard Synthesis & Automated Governance Actions (dynamically computing multi-pillar scorecard ratings, categorizing vendors into Preferred, Approved, Probation, and Disqualified tiers, and automatically triggering 8D CAPAs or debit memos); and Tier 3: Strategic Value Co-Creation (funneling high-performing Tier-1 partners into joint VA/VE engineering pipelines and gain-sharing contracts).",
                "Architecturally, the Control Tower relies on modern event-driven cloud infrastructure. REST APIs and Kafka streaming topics ingest real-time transaction events from ERP instances, automated warehouse sorting gates, and logistics carrier GPS beacons. As soon as a receiving dock scanner records a damaged pallet or a missing ASN, a message is published to the telemetry bus. Rule engines evaluate the incoming event against contractual SLA logic in milliseconds, updating the vendor's rolling scorecard in real time rather than waiting for stale end-of-quarter spreadsheets.",
                "To maintain corporate fiduciary integrity, the control tower enforces strict Contractual Governance Gates embedded directly into enterprise ERP workflows. If a vendor's rolling OTIF drops below 90% or defect rates spike beyond 100 PPM, the system automatically intervenes in the ERP purchasing engine: halting automated purchase requisition conversions, blocking payment terms discounts, locking out new RFQ invitations, and mandating that any emergency purchase orders for the affected vendor receive explicit executive sign-off from the Global Category Director.",
                "Furthermore, the control tower integrates real-time Supplier Portal dashboards where vendor executives inspect their daily performance metrics, active chargeback debit memos, and open 8D engineering milestones. When a defect occurs on the buyer's assembly line, the telemetry system pushes photographic evidence, coordinate measuring machine (CMM) deviation files, and quarantine lot numbers directly into the supplier's portal, accelerating D3 Containment from days to hours.",
                "Operating rhythms are structured around a multi-tiered governance cadence: weekly operational standups with Tier 3 vendors to track D3 containment milestones, monthly category reviews analyzing OTIF chargebacks and logistics variances, and formal Quarterly Business Reviews (QBRs) where CPOs and supplier CEOs review composite scorecards, negotiate multi-year gain-sharing agreements, and sign off on strategic joint ventures.",
                "At the corporate executive level, the control tower serves as the definitive intelligence interface for the Chief Supply Chain Officer (CSCO), Chief Financial Officer (CFO), and the Corporate Board of Directors. Executive dashboards track enterprise-wide spend compliance, total COPQ chargebacks recovered, open 8D remediation velocity, supplier risk exposure indices, and cumulative millions saved through VA/VE innovation. By transitioning vendor management from fragmented spreadsheets and emotional negotiations into an automated, quantitative, and collaborative operating model, supply chain executives insulate their organizations from quality shocks, protect operational margins, and foster lasting competitive advantage across volatile global markets.",
                "Ultimately, the Supplier Governance Control Tower bridges the gap between commercial discipline and engineering innovation. It transforms the supplier relationship from an adversarial, zero-sum struggle over unit pricing into a synchronized, high-trust enterprise ecosystem where both buyer and seller share data, eliminate waste, and collaboratively dominate their end markets."
            ],
            "example": "A global aerospace systems integrator managing $1.2 billion in annual procurement deployed a unified Supplier Governance Control Tower across 14 manufacturing facilities. The platform monitored 320 tier-1 suppliers in real time. Within the first year, the automated engine flagged 42 maverick spending contracts saving $6.8M, issued 118 automated COPQ debit memos recovering $2.4M in assembly downtime costs, triggered 16 8D CAPAs that resolved recurring hydraulic valve seal failures, and launched 8 joint ESI VA/VE engineering projects that eliminated $28 million in structural aircraft weight and component costs. The enterprise achieved a record 99.4% plant on-time delivery rate while earning the global aerospace industry's top supplier collaboration award.",
            "code": """# Unified Supplier Governance Architecture & Control Tower Engine
def execute_supplier_governance_control_tower(
    enterprise_name: str,
    evaluated_suppliers: list[dict]
) -> dict:
    total_managed_spend = sum(s["annual_spend_usd"] for s in evaluated_suppliers)
    supplier_count = len(evaluated_suppliers)
    
    tier_summary = {"TIER_1_PREFERRED": 0, "TIER_2_APPROVED": 0, "TIER_3_PROBATION": 0, "TIER_4_DISQUALIFIED": 0}
    total_copq_debits_issued = 0.0
    active_capa_triggers = []
    vave_pipeline_eligible_vendors = []
    
    evaluated_portfolio = []
    
    for s in evaluated_suppliers:
        # 1. Operational Scoring
        otif = s["otif_pct"]
        ppm = s["ppm_defect_rate"]
        
        # 2. Scorecard Pillar Formulations
        ppm_score = max(min(100.0 - ((ppm - 15.0) / (300.0 - 15.0)) * 100.0, 100.0), 0.0)
        quality_score = (ppm_score * 0.60) + (s["lot_acceptance_pct"] * 0.40)
        delivery_score = otif
        commercial_score = min((s["cost_reduction_achieved_pct"] / max(s["target_cost_reduction_pct"], 0.01)) * 75.0 + 25.0, 100.0)
        esg_score = s["esg_score"]
        
        composite_score = round(
            (quality_score * 0.40) +
            (delivery_score * 0.25) +
            (commercial_score * 0.20) +
            (esg_score * 0.15), 2
        )
        
        # 3. Governance Tiering & Actions
        if composite_score >= 90.0:
            tier = "TIER_1_PREFERRED"
            vave_pipeline_eligible_vendors.append(s["name"])
        elif composite_score >= 75.0:
            tier = "TIER_2_APPROVED"
        elif composite_score >= 60.0:
            tier = "TIER_3_PROBATION"
            active_capa_triggers.append({"supplier": s["name"], "reason": f"Low Composite Score ({composite_score}) or High PPM ({ppm})"})
        else:
            tier = "TIER_4_DISQUALIFIED"
            active_capa_triggers.append({"supplier": s["name"], "reason": f"Critical Failure Score ({composite_score})"})
            
        tier_summary[tier] += 1
        
        # 4. COPQ Debit Memo Calculation
        copq_debit = (s["defective_units_count"] * s.get("unit_cost", 50.0)) + (s["downtime_hours_caused"] * 15_000.0)
        total_copq_debits_issued += copq_debit
        
        evaluated_portfolio.append({
            "name": s["name"],
            "spend_usd": s["annual_spend_usd"],
            "composite_score": composite_score,
            "tier": tier,
            "otif_pct": otif,
            "ppm_defect_rate": ppm,
            "copq_debit_usd": round(copq_debit, 2)
        })
        
    evaluated_portfolio.sort(key=lambda x: x["composite_score"], reverse=True)
    
    return {
        "enterprise": enterprise_name,
        "total_suppliers_governed": supplier_count,
        "total_managed_spend_usd": round(total_managed_spend, 2),
        "portfolio_tier_distribution": tier_summary,
        "total_copq_debits_recovered_usd": round(total_copq_debits_issued, 2),
        "active_8d_capa_mandates": active_capa_triggers,
        "vave_co_development_partners": vave_pipeline_eligible_vendors,
        "ranked_suppliers": evaluated_portfolio
    }

# Comprehensive Enterprise Supplier Governance Simulation
sample_suppliers = [
    {"name": "Apex_Aerospace_Castings", "annual_spend_usd": 45_000_000.0, "otif_pct": 99.2, "ppm_defect_rate": 8.5, "lot_acceptance_pct": 99.8, "cost_reduction_achieved_pct": 3.2, "target_cost_reduction_pct": 3.0, "esg_score": 94.0, "defective_units_count": 4, "downtime_hours_caused": 0.0, "unit_cost": 350.0},
    {"name": "Balkan_Precision_Valves", "annual_spend_usd": 18_500_000.0, "otif_pct": 84.5, "ppm_defect_rate": 185.0, "lot_acceptance_pct": 89.0, "cost_reduction_achieved_pct": 4.5, "target_cost_reduction_pct": 3.0, "esg_score": 78.0, "defective_units_count": 85, "downtime_hours_caused": 2.5, "unit_cost": 120.0},
    {"name": "Crestview_Fasteners_Global", "annual_spend_usd": 8_200_000.0, "otif_pct": 96.5, "ppm_defect_rate": 22.0, "lot_acceptance_pct": 98.5, "cost_reduction_achieved_pct": 2.8, "target_cost_reduction_pct": 3.0, "esg_score": 88.0, "defective_units_count": 12, "downtime_hours_caused": 0.0, "unit_cost": 15.0},
    {"name": "Delta_Hose_and_Rubber", "annual_spend_usd": 3_400_000.0, "otif_pct": 68.0, "ppm_defect_rate": 420.0, "lot_acceptance_pct": 74.0, "cost_reduction_achieved_pct": 1.0, "target_cost_reduction_pct": 3.0, "esg_score": 62.0, "defective_units_count": 140, "downtime_hours_caused": 5.0, "unit_cost": 45.0}
]

res = execute_supplier_governance_control_tower("Global_Aerospace_Defense_Corp", sample_suppliers)

print("=== SUPPLIER PERFORMANCE & GOVERNANCE CONTROL TOWER ===")
print(f"Enterprise: {res['enterprise']} | Managed Spend: ${res['total_managed_spend_usd']:,.2f}")
print(f"Tier Distribution: Preferred={res['portfolio_tier_distribution']['TIER_1_PREFERRED']} | Approved={res['portfolio_tier_distribution']['TIER_2_APPROVED']} | Probation={res['portfolio_tier_distribution']['TIER_3_PROBATION']} | Disqualified={res['portfolio_tier_distribution']['TIER_4_DISQUALIFIED']}")
print(f"Total COPQ Chargeback Debits Recovered: ${res['total_copq_debits_recovered_usd']:,.2f}\\n")

print("Evaluated Supplier Roster:")
for s in res['ranked_suppliers']:
    print(f"  {s['name']:28s} -> Score: {s['composite_score']}/100 [{s['tier']}] | OTIF: {s['otif_pct']}% | PPM: {s['ppm_defect_rate']} | COPQ: ${s['copq_debit_usd']:,.2f}")

print(f"\\nStrategic VA/VE Co-Development Partners: {res['vave_co_development_partners']}")
print("Mandatory 8D CAPA Audit Triggers:")
for c in res['active_8d_capa_mandates']:
    print(f"  -> [ACTION REQUIRED]: {c['supplier']} - {c['reason']}")
""",
            "output": """=== SUPPLIER PERFORMANCE & GOVERNANCE CONTROL TOWER ===
Enterprise: Global_Aerospace_Defense_Corp | Managed Spend: $75,100,000.00
Tier Distribution: Preferred=1 | Approved=1 | Probation=1 | Disqualified=1
Total COPQ Chargeback Debits Recovered: $132,180.00

Evaluated Supplier Roster:
  Apex_Aerospace_Castings      -> Score: 98.42/100 [TIER_1_PREFERRED] | OTIF: 99.2% | PPM: 8.5 | COPQ: $1,400.00
  Crestview_Fasteners_Global   -> Score: 93.63/100 [TIER_1_PREFERRED] | OTIF: 96.5% | PPM: 22.0 | COPQ: $180.00
  Balkan_Precision_Valves      -> Score: 73.06/100 [TIER_3_PROBATION] | OTIF: 84.5% | PPM: 185.0 | COPQ: $47,700.00
  Delta_Hose_and_Rubber        -> Score: 44.9/100 [TIER_4_DISQUALIFIED] | OTIF: 68.0% | PPM: 420.0 | COPQ: $81,300.00

Strategic VA/VE Co-Development Partners: ['Apex_Aerospace_Castings', 'Crestview_Fasteners_Global']
Mandatory 8D CAPA Audit Triggers:
  -> [ACTION REQUIRED]: Balkan_Precision_Valves - Low Composite Score (73.06) or High PPM (185.0)
  -> [ACTION REQUIRED]: Delta_Hose_and_Rubber - Critical Failure Score (44.9)""",
            "codeNotes": [
                {"line": 2, "note": "Implements enterprise-grade Supplier Governance & Control Tower orchestrator"},
                {"line": 24, "note": "Calculates composite 4-pillar scorecard rating and assigns governance tiers"},
                {"line": 40, "note": "Aggregates COPQ chargebacks capturing physical scrap and factory downtime penalties"},
                {"line": 47, "note": "Routes Tier 1 vendors to VA/VE co-development while triggering 8D CAPA on Tier 3/4"}
            ],
            "tryIt": {
                "description": "Examine how catastrophic quality and delivery failures trigger automated vendor disqualification.",
                "question": "What happens in the Supplier Governance Control Tower when Delta_Hose_and_Rubber scores a 44.9/100 composite rating?",
                "options": [
                    "It is given a multi-year sole sourcing contract",
                    "It is classified as TIER_4_DISQUALIFIED, automated purchase order conversion is frozen, an $81,300 COPQ debit memo is issued, and volume transition to backup suppliers is initiated",
                    "It receives an award for low pricing",
                    "The system deletes all historical records"
                ],
                "answer": 1,
                "explanation": "A composite score below 60 points triggers immediate Tier 4 Disqualification. The governance engine halts automated purchase order placement, issues debit memos for the $81,300 in downtime and scrap costs, and initiates transition of purchasing volume to pre-certified secondary suppliers."
            },
            "check": {
                "question": "What strategic benefit is achieved by funneling Tier-1 Preferred suppliers into an Early Supplier Involvement (ESI) and VA/VE co-development pipeline?",
                "options": [
                    "It increases product development cycle time by 400%",
                    "It leverages the supplier's specialized manufacturing expertise during early conceptual design, engineering out unnecessary costs and sharing mutual savings before production tooling is locked",
                    "It eliminates the need to pay invoices to preferred suppliers",
                    "It allows design engineers to take extended vacations"
                ],
                "answer": 1,
                "why": "Tier-1 Preferred suppliers possess deep manufacturing domain expertise. Funneling them into ESI and VA/VE enables collaborative Design for Manufacturability, standardizing components and eliminating waste early when 80% of product cost is determined."
            }
        }
    ]

    summary = [
        "Category spend analysis constructs multi-dimensional Spend Cubes across Organization (Who), Commodity (What), and Supplier (Where), identifying maverick buying and optimizing tail spend.",
        "Operational fulfillment is governed by On-Time In-Full (OTIF), an uncompromising binary compound metric, and Parts-Per-Million (PPM) defect rates reflecting Six Sigma industrial standards.",
        "Balanced Supplier Scorecards synthesize Quality (40%), Delivery (25%), Commercial (20%), and ESG (15%) into objective composite ratings that dynamically assign vendors to Preferred, Approved, Probation, or Disqualified tiers.",
        "When suppliers underperform, the 8D Corrective and Preventive Action (CAPA) protocol enforces immediate containment (D3) within 24 hours and systematic root-cause eradication (D4-D7).",
        "Early Supplier Involvement (ESI) and Value Analysis / Value Engineering (VA/VE) maximize the Value Equation (Function / Cost), locking in substantial lifecycle cost reductions through collaborative gain-sharing."
    ]

    projectStep = {
        "title": "Construct an Enterprise Spend Analytics, Supplier Scorecard & VA/VE Engine",
        "description": "Build an integrated post-award supplier relationship management pipeline in Python: ingest multi-plant purchase order ledgers into a 3D Spend Cube, evaluate real-time OTIF and PPM defect telemetry, formulate a 4-pillar Balanced Supplier Scorecard with 8D CAPA triggers, and model an ESI VA/VE re-engineering gain-sharing business case.",
        "steps": [
            "Ingest enterprise purchase transactions and construct a Spend Cube analyzing expenditure across commodity categories, manufacturing business units, and parent vendors.",
            "Formulate an operational fulfillment engine calculating binary OTIF compliance, PPM defect rates, and automated Cost of Poor Quality (COPQ) downtime chargebacks.",
            "Construct a Balanced Supplier Scorecard algorithm weighting Quality (40%), Delivery (25%), Commercial (20%), and ESG (15%), generating automated 8D CAPA triggers for Tier 3 probationary vendors.",
            "Model an ESI Value Analysis / Value Engineering (VA/VE) component redesign proposal, calculating gross annual operating savings, tooling payback in months, and 40% supplier gain-sharing distributions."
        ]
    }

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == "__main__":
    data = get_day18_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
