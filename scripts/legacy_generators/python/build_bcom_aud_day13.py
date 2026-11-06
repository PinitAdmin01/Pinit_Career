"""
Build Day 13 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Substantive Testing of Inventory Valuation, Obsolescence & Supply Chain Forensics: Ind AS 2 & SA 501
"""
import json

day_data = {
    "day": 13,
    "title": "Substantive Testing of Inventory Valuation, Obsolescence & Supply Chain Forensics: Ind AS 2 & SA 501",
    "parts": [
        {
            "title": "Ind AS 2 Lower of Cost and Net Realizable Value (NRV) Substantive Testing",
            "say": [
                "Under Indian Accounting Standard (Ind AS) 2 (Inventories), the foundational measurement principle legally dictates that inventories shall be measured at the Lower of Cost and Net Realizable Value (NRV). Cost comprises all costs of purchase, costs of conversion (direct labor and systematically allocated fixed and variable production overheads), and other costs incurred in bringing the inventories to their present location and condition. Net Realizable Value is the estimated selling price in the ordinary course of business less the estimated costs of completion and the estimated costs necessary to make the sale.",
                "In statutory auditing, verifying the 'Lower of Cost and NRV' assertion is a high-risk substantive audit procedure. Management possesses natural incentives to overstate ending inventory because an overstatement of ending inventory directly reduces Cost of Goods Sold (COGS = Opening Stock + Purchases - Ending Stock), thereby artificially inflating Gross Profit and Operating Income on the P&L.",
                "To substantively test inventory valuation, the auditor executes two parallel procedures: (1) Cost Testing—vouching unit costs back to original supplier purchase invoices, freight manifests, and bill-of-entry customs documentation, while auditing overhead absorption rates to ensure abnormal idle capacity costs are expensed to P&L rather than capitalized into inventory; and (2) NRV Testing—comparing recorded unit costs against subsequent actual selling prices realized post-balance sheet date (April to June sales invoices).",
                "If actual post-period selling prices (net of packaging, shipping, and sales commissions) fall below carrying cost, Ind AS 2 legally mandates an immediate write-down to NRV. The write-down is recognized as an expense in the period in which the write-down occurs. The auditor must test NRV item-by-item rather than applying blanket group averages that conceal submerged losses."
            ],
            "example": "In auditing an electronics manufacturer with Rs 80 Crore in finished smartphone inventory, the auditor compares recorded carrying costs against subsequent sales: Model X is carried at Rs 18,000 per unit in the books (5,000 units = Rs 9 Crore). Post-balance sheet April invoices reveal that following the release of a competitor model, Model X was discounted to Rs 14,000 per unit, with sales commissions of Rs 1,000 (NRV = Rs 13,000). The auditor forces an immediate Rs 5,000 per unit write-down (Rs 2.5 Crore total), bringing inventory down to NRV.",
            "code": '''def audit_indas2_lower_of_cost_and_nrv(inventory_sku_sample: list) -> dict:
    audited_skus = []
    total_book_value_cr = 0.0
    total_nrv_value_cr = 0.0
    total_writedown_cr = 0.0
    
    for sku in inventory_sku_sample:
        units = sku["quantity"]
        cost_unit = sku["carrying_cost_per_unit_inr"]
        selling_price_unit = sku["subsequent_selling_price_inr"]
        selling_costs_unit = sku["completion_and_selling_costs_inr"]
        
        # Calculate NRV per unit
        nrv_unit = selling_price_unit - selling_costs_unit
        
        # Ind AS 2 Rule: Lower of Cost and NRV
        valuation_unit = min(cost_unit, nrv_unit)
        is_written_down = nrv_unit < cost_unit
        
        sku_book_val = (cost_unit * units) / 10000000.0 # in Crores
        sku_final_val = (valuation_unit * units) / 10000000.0
        sku_writedown = sku_book_val - sku_final_val
        
        total_book_value_cr += sku_book_val
        total_nrv_value_cr += sku_final_val
        total_writedown_cr += sku_writedown
        
        if is_written_down:
            audited_skus.append({
                "sku_id": sku["sku_id"],
                "units": units,
                "cost_unit": cost_unit,
                "nrv_unit": nrv_unit,
                "unit_impairment": cost_unit - nrv_unit,
                "total_sku_writedown_cr": round(sku_writedown, 3),
                "reason": sku.get("obsolescence_reason", "Post-period market price decline below carrying cost")
            })
            
    requires_adjustment = total_writedown_cr > 0.10 # > 10 Lakhs
    
    return {
        "skus_tested_count": len(inventory_sku_sample),
        "total_sample_book_value_cr": round(total_book_value_cr, 3),
        "total_audited_nrv_value_cr": round(total_nrv_value_cr, 3),
        "total_indas2_writedown_cr": round(total_writedown_cr, 3),
        "impaired_skus_count": len(audited_skus),
        "audit_determination": "RECORD_INVENTORY_WRITEDOWN_EXPENSE" if requires_adjustment else "INVENTORY_VALUATION_ADEQUATE",
        "impaired_sku_details": audited_skus
    }

sample_inventory = [
    {"sku_id": "SKU-ELEC-01", "quantity": 5000, "carrying_cost_per_unit_inr": 18000, "subsequent_selling_price_inr": 14000, "completion_and_selling_costs_inr": 1000, "obsolescence_reason": "Competitor product launch dropped market clearing price"},
    {"sku_id": "SKU-ELEC-02", "quantity": 12000, "carrying_cost_per_unit_inr": 8500, "subsequent_selling_price_inr": 11500, "completion_and_selling_costs_inr": 500},
    {"sku_id": "SKU-ELEC-03", "quantity": 3000, "carrying_cost_per_unit_inr": 32000, "subsequent_selling_price_inr": 26000, "completion_and_selling_costs_inr": 1500, "obsolescence_reason": "Damaged components in monsoon humidity"}
]

nrv_audit = audit_indas2_lower_of_cost_and_nrv(sample_inventory)
print("Ind AS 2 Lower of Cost and NRV Substantive Valuation Engine:")
print(f"  SKUs Audited           : {nrv_audit['skus_tested_count']}")
print(f"  Sample Book Value      : INR {nrv_audit['total_sample_book_value_cr']} Crores")
print(f"  Audited Value (Lower)  : INR {nrv_audit['total_audited_nrv_value_cr']} Crores")
print(f"  Total NRV Write-Down   : INR {nrv_audit['total_indas2_writedown_cr']} Crores")
print(f"  Audit Ruling           : {nrv_audit['audit_determination']}")
print("  Impaired Inventory Items:")
for i in nrv_audit['impaired_sku_details']:
    print(f"    * {i['sku_id']}: Cost INR {i['cost_unit']} vs NRV INR {i['nrv_unit']} -> Write-down INR {i['total_sku_writedown_cr']} Cr ({i['reason']})")
''',
            "tryIt": "Adjust SKU-ELEC-01 subsequent_selling_price_inr to 21,000 to see the write-down disappear for that item.",
            "check": {
                "question": "Under Ind AS 2, how is Net Realizable Value (NRV) calculated for finished goods inventory?",
                "options": [
                    "Estimated selling price in the ordinary course of business less the estimated costs of completion and the estimated costs necessary to make the sale",
                    "The original supplier invoice price plus 50% retail markup",
                    "The historical replacement cost adjusted for annual inflation indices",
                    "The liquidation value determined by bankruptcy court trustees"
                ],
                "answerIndex": 0,
                "why": "Ind AS 2 Paragraph 6 defines Net Realizable Value as the estimated selling price in the ordinary course of business less the estimated costs of completion and the estimated costs necessary to make the sale."
            }
        },
        {
            "title": "Inventory Aging Analytics, Slow-Moving Reserves & Scrap Revenue Forensics: SA 501",
            "say": [
                "Beyond specific SKU price testing, statutory auditors evaluate the completeness and adequacy of management's Slow-Moving and Obsolete Inventory Provisioning Policy. In fast-evolving manufacturing, automotive, and consumer electronics industries, inventory that sits in warehouses for extended periods inevitably suffers physical degradation, technological obsolescence, or market unsaleability.",
                "Under SA 501 and SA 540, the auditor extracts the full inventory aging matrix from the ERP database (e.g., SAP MM or Oracle SCM), classifying items into standard aging brackets: 0–90 days (active stock); 91–180 days (monitored stock); 181–365 days (slow-moving); and > 365 days (non-moving/obsolete). The auditor tests the statistical correlation between holding age and historical scrap salvage recoveries.",
                "Auditors enforce standardized minimum provisioning matrices: typically 0% for 0–90 days; 10% for 91–180 days; 35% for 181–365 days; and 75% to 100% for non-moving stock over 365 days, unless management presents binding customer orders. If management fails to adjust provisioning for aging stock, ending inventory is materially overstated.",
                "Concurrently, forensic auditors examine Industrial Scrap Disposals under SA 240. In heavy manufacturing (steel, chemical, automotive stamping), production processes generate tons of scrap metal, chemicals, and off-spec by-products. Corrupt plant managers frequently divert scrap sales off-book: selling scrap for cash to unorganized recyclers without recording revenue. Forensic auditors calculate theoretical scrap yields: Input Raw Material Weight - Finished Goods Weight = Standard Scrap Yield. Any variance between theoretical scrap and recorded scrap revenue indicates off-book embezzlement."
            ],
            "example": "In an automotive chassis stamping plant, 10,000 metric tons of sheet steel were consumed to produce 7,200 tons of finished frames (Theoretical Scrap = 2,800 tons, market value = Rs 8.4 Crore). Company books show only 1,100 tons of scrap sold for Rs 3.3 Crore. The auditor queries weighbridge digital records and CCTV logs, discovering that 1,700 tons of scrap were smuggled out on unmanifested night trucks, exposing a Rs 5.1 Crore scrap embezzlement scheme by the Plant Operations Director.",
            "code": '''def audit_inventory_aging_and_scrap_yield(
    aging_buckets_cr: dict, # {"0_90d": val, "91_180d": val, "181_365d": val, "over_365d": val}
    current_booked_provision_cr: float,
    raw_material_input_tons: float,
    finished_goods_output_tons: float,
    recorded_scrap_sales_tons: float,
    market_scrap_price_per_ton_inr: float
) -> dict:
    # 1. Standard Provisioning Matrix
    provision_rules = {"0_90d": 0.0, "91_180d": 0.10, "181_365d": 0.35, "over_365d": 0.85}
    
    calculated_required_provision = sum(aging_buckets_cr[b] * provision_rules[b] for b in aging_buckets_cr)
    provision_shortfall_cr = max(0.0, calculated_required_provision - current_booked_provision_cr)
    
    # 2. Forensic Scrap Mass-Balance Yield Analysis
    theoretical_scrap_tons = raw_material_input_tons - finished_goods_output_tons
    unaccounted_scrap_tons = theoretical_scrap_tons - recorded_scrap_sales_tons
    
    is_scrap_diverted = unaccounted_scrap_tons > (raw_material_input_tons * 0.02) # > 2% tolerance
    estimated_scrap_leakage_inr = (unaccounted_scrap_tons * market_scrap_price_per_ton_inr) if is_scrap_diverted else 0.0
    estimated_scrap_leakage_cr = estimated_scrap_leakage_inr / 10000000.0
    
    return {
        "required_aging_provision_cr": round(calculated_required_provision, 2),
        "current_booked_provision_cr": current_booked_provision_cr,
        "provision_shortfall_cr": round(provision_shortfall_cr, 2),
        "theoretical_scrap_yield_tons": round(theoretical_scrap_tons, 1),
        "recorded_scrap_sold_tons": recorded_scrap_sales_tons,
        "unaccounted_missing_scrap_tons": round(unaccounted_scrap_tons, 1),
        "estimated_offbook_scrap_fraud_cr": round(estimated_scrap_leakage_cr, 2),
        "scrap_audit_status": "OFF_BOOK_SCRAP_EMBEZZLEMENT_SUSPECTED" if is_scrap_diverted else "SCRAP_YIELD_NORMAL"
    }

scrap_audit = audit_inventory_aging_and_scrap_yield(
    aging_buckets_cr={"0_90d": 120.0, "91_180d": 45.0, "181_365d": 28.0, "over_365d": 18.0},
    current_booked_provision_cr=12.0,
    raw_material_input_tons=10000.0,
    finished_goods_output_tons=7200.0,
    recorded_scrap_sales_tons=1100.0,
    market_scrap_price_per_ton_inr=30000.0 # Rs 30,000 / ton
)
print("SA 501 Inventory Aging & Industrial Scrap Mass-Balance Forensics:")
print(f"  Required Aging Provision: INR {scrap_audit['required_aging_provision_cr']} Crores")
print(f"  Provision Shortfall     : INR {scrap_audit['provision_shortfall_cr']} Crores")
print(f"  Theoretical Scrap Yield : {scrap_audit['theoretical_scrap_yield_tons']} tons")
print(f"  Recorded Scrap Sold     : {scrap_audit['recorded_scrap_sold_tons']} tons")
print(f"  Missing Unaccounted Scrap: {scrap_audit['unaccounted_missing_scrap_tons']} tons")
print(f"  Estimated Fraud Leakage : INR {scrap_audit['estimated_offbook_scrap_fraud_cr']} Crores")
print(f"  Forensic Determination  : {scrap_audit['scrap_audit_status']}")
''',
            "tryIt": "Increase recorded_scrap_sales_tons to 2750.0 tons to see the missing scrap drop within normal tolerance and clear the embezzlement flag.",
            "check": {
                "question": "How do forensic auditors utilize the 'Mass-Balance Equation' to detect off-book scrap metal embezzlement in manufacturing enterprises?",
                "options": [
                    "By subtracting finished goods output weight from raw material input weight to establish theoretical scrap yield, and comparing that theoretical yield against recorded scrap sales to detect unrecorded cash diversions",
                    "By weighing all company executives at the annual general meeting",
                    "By inspecting the scrap dealer's personal credit card bills",
                    "By checking whether production machinery is painted in corporate colors"
                ],
                "answerIndex": 0,
                "why": "The mass-balance equation (Input Weight = Output Product Weight + Scrap Weight) establishes an objective physical expectation of scrap generation; significant shortfalls between theoretical scrap and recorded sales reveal off-book cash embezzlement."
            }
        },
        {
            "title": "Supply Chain Round-Tripping & Circular Trading Forensics: SA 240 & GST Cross-Audits",
            "say": [
                "Circular Trading and Supply Chain Round-Tripping represent sophisticated white-collar corporate fraud schemes designed to synthetically inflate company revenues, fabricate artificial business activity to secure bank loan sanctions, or generate fraudulent Goods and Services Tax (GST) Input Tax Credits without any underlying movement of physical goods.",
                "In a typical circular trading conspiracy, Enterprise A issues an invoice to Enterprise B, Enterprise B invoices Enterprise C, and Enterprise C invoices Enterprise A (or its affiliate) for the exact same consignment of goods at slightly escalated prices. On paper, all three entities report massive revenue expansion and growing turnover. In reality, no goods ever leave the warehouse—transactions are pure 'accommodation paper' accompanied by circular bank wire transfers that cancel each other out.",
                "Under SA 240 and CARO 2020 Clause (ix), statutory auditors must detect round-tripping through multi-source digital triangulation: (1) analyzing the velocity and turnaround time of goods (e.g., goods bought and resold within hours without entering inventory); (2) verifying transport documentation against E-Way Bill FASTag toll plaza logs; (3) auditing gross margins across circular loops (transactions frequently execute at zero or minimal 0.5% margins); and (4) performing Bank Statement Cash Flow Circularity Analytics.",
                "In bank circularity analytics, forensic algorithms track the flow of funds: tracing a Rs 10 Crore wire transfer originating from Company A's overdraft account to Company B, tracking B's transfer to Company C on the same afternoon, and C's transfer back to Company A by 5:00 PM. This zero-net-cash loop exposes synthetic accommodation entries, requiring 100% revenue reversal and mandatory fraud reporting under Section 143(12)."
            ],
            "example": "A metal trading firm reports Rs 250 Crore in revenue, representing a 300% growth. The auditor investigates the top three customers and discovers they are also the top three suppliers. Transaction logs show that on 14 dates, Company A billed Company B for aluminum ingots, B billed C, and C billed A within 6 hours, with identical truck vehicle numbers registered to an autorickshaw and zero toll plaza passes on the national highway. The auditor proves circular accommodation trading, reverses Rs 180 Crore in fictitious revenue, and files Form ADT-4 with the MCA.",
            "code": '''def detect_circular_trading_round_tripping(
    transaction_chains: list # list of dicts representing transaction loops
) -> dict:
    flagged_circular_loops = []
    total_fictitious_volume_cr = 0.0
    
    for chain in transaction_chains:
        entities = chain["entity_flow"] # e.g. ["A", "B", "C", "A"]
        amount_cr = chain["amount_cr"]
        hours_elapsed = chain["hours_to_complete_loop"]
        margin_pct = chain["loop_margin_pct"]
        has_verified_physical_transport = chain["has_fastag_toll_proof"]
        
        is_circular = (entities[0] == entities[-1]) and len(entities) >= 3
        is_suspicious_speed = hours_elapsed <= 24.0
        is_paper_margin = margin_pct <= 1.0
        no_physical_goods = not has_verified_physical_transport
        
        if is_circular and (is_suspicious_speed or is_paper_margin or no_physical_goods):
            flagged_circular_loops.append({
                "chain_id": chain["chain_id"],
                "entities_involved": " -> ".join(entities),
                "volume_cr": amount_cr,
                "hours_elapsed": hours_elapsed,
                "loop_margin_pct": margin_pct,
                "physical_transport_verified": has_verified_physical_transport,
                "violation": "CIRCULAR_ACCOMMODATION_BILLING_WITHOUT_SUBSTANCE"
            })
            total_fictitious_volume_cr += amount_cr
            
    return {
        "chains_audited_count": len(transaction_chains),
        "circular_loops_detected": len(flagged_circular_loops),
        "total_fictitious_revenue_cr": round(total_fictitious_volume_cr, 2),
        "circular_trading_confirmed": len(flagged_circular_loops) > 0,
        "flagged_loops": flagged_circular_loops,
        "statutory_mandate": "MANDATORY_REVERSAL_AND_SECTION_143_12_MCA_REPORTING" if total_fictitious_volume_cr >= 1.0 else "MANAGEMENT_INQUIRY"
    }

chains_sample = [
    {"chain_id": "CHAIN-01", "entity_flow": ["Apex Ltd", "Beta Traders", "Gamma Metals", "Apex Ltd"], "amount_cr": 45.0, "hours_to_complete_loop": 5.5, "loop_margin_pct": 0.25, "has_fastag_toll_proof": False},
    {"chain_id": "CHAIN-02", "entity_flow": ["Apex Ltd", "Delta Enterprises", "Genuine Client Inc"], "amount_cr": 12.0, "hours_to_complete_loop": 140.0, "loop_margin_pct": 14.5, "has_fastag_toll_proof": True},
    {"chain_id": "CHAIN-03", "entity_flow": ["Apex Ltd", "Zeta Infra", "Omega Corp", "Apex Ltd"], "amount_cr": 65.0, "hours_to_complete_loop": 8.0, "loop_margin_pct": 0.40, "has_fastag_toll_proof": False}
]

circ_audit = detect_circular_trading_round_tripping(chains_sample)
print("Supply Chain Circular Trading & Round-Tripping Forensics Engine:")
print(f"  Transaction Loops Audited: {circ_audit['chains_audited_count']}")
print(f"  Circular Schemes Uncovered: {circ_audit['circular_loops_detected']}")
print(f"  Fictitious Revenue Volume : INR {circ_audit['total_fictitious_revenue_cr']} Crores")
print(f"  Statutory Action Mandate  : {circ_audit['statutory_mandate']}")
print("  Identified Fraudulent Networks:")
for l in circ_audit['flagged_loops']:
    print(f"    * {l['chain_id']} ({l['entities_involved']}): INR {l['volume_cr']} Cr in {l['hours_elapsed']} hrs (Margin: {l['loop_margin_pct']}%, Transport: {l['physical_transport_verified']})")
''',
            "tryIt": "Set has_fastag_toll_proof=True and hours_to_complete_loop=180.0 on CHAIN-01 to see how legitimate transit logs differentiate genuine commercial distribution from circular trading.",
            "check": {
                "question": "What are the primary evidentiary characteristics of a fraudulent circular trading (round-tripping) scheme in corporate auditing?",
                "options": [
                    "Goods invoiced in a closed loop (Company A -> B -> C -> A) within hours at minimal or zero margins, accompanied by circular bank wire transfers and zero physical movement of goods verified by E-Way Bill toll records",
                    "Customers paying with cash on delivery at retail checkout counters",
                    "International export shipments requiring customs tariff inspections",
                    "Purchasing raw materials from ISO-certified suppliers with 30-day payment terms"
                ],
                "answerIndex": 0,
                "why": "Circular trading is characterized by closed entity loops, rapid settlement velocity, razor-thin accommodation margins, and absence of physical goods transport, creating synthetic revenue without commercial substance."
            }
        },
        {
            "title": "Substantive Inventory Cut-Off Testing & Warehouse Gate Pass Verification: SA 501",
            "say": [
                "Inventory Cut-Off Testing under SA 501 verifies that purchases, sales, and internal transfers of inventory are recorded in the proper accounting period. A breakdown in inventory cut-off causes major balance sheet and income statement distortions: if raw material goods are physically received before year-end and included in physical inventory count, but the purchase invoice is recorded in the subsequent fiscal year, current liabilities are understated and gross profit is artificially inflated.",
                "Similarly, if finished goods are invoiced and recorded as sales on March 31, but the goods remain physically inside the warehouse on count day and are also counted as ending inventory, the entity commits Double-Counting (booking both the revenue and the inventory asset), directly violating Ind AS 2 and Ind AS 115.",
                "To substantively test inventory cut-off, the statutory auditor inspects sequential serial documentation for the last 10 transactions before year-end and first 10 transactions after year-end: (1) Goods Receipt Notes (GRN) from the receiving dock; (2) Security Inward Gate Passes (IGP); (3) Goods Dispatch Notes (GDN) from the shipping dock; and (4) Outward Security Gate Passes (OGP).",
                "The auditor matches each physical gate pass number against the corresponding purchase voucher or sales invoice in the general ledger. Any GRN dated on or before March 31 must have an associated purchase or accrued liability (GRN Unbilled) in the March 31 balance sheet; any GDN dated post-March 31 must be excluded from March 31 sales."
            ],
            "example": "During a year-end physical inventory audit at a steel fabrication yard, the auditor notes that GRN-4491 for 500 tons of structural steel (Rs 3.2 Crore) was received on March 29 and included in the physical count. However, the purchase invoice was entered into the ERP on April 6 without an accrued liability entry on March 31. The auditor mandates an immediate adjusting journal entry: debiting Inventory Rs 3.2 Crore and crediting Accrued Purchases / GRN Clearing Rs 3.2 Crore on March 31.",
            "code": '''def audit_inventory_cutoff_grn_gdn(
    sampled_cutoff_records: list, # GRN and GDN records around March 31
    balance_sheet_cutoff_date: str = "2026-03-31"
) -> dict:
    cutoff_errors = []
    
    for rec in sampled_cutoff_records:
        rec_id = rec["doc_id"]
        doc_type = rec["type"] # "INWARD_GRN" or "OUTWARD_GDN"
        physical_date = rec["physical_gate_date"]
        gl_booked_date = rec["gl_posting_date"]
        amount_cr = rec["amount_cr"]
        included_in_physical_count = rec["included_in_physical_count"]
        
        # Scenario 1: Received before cutoff, counted in stock, but liability not booked in current year
        if doc_type == "INWARD_GRN":
            received_before_cutoff = physical_date <= balance_sheet_cutoff_date
            booked_post_cutoff = gl_booked_date > balance_sheet_cutoff_date
            
            if received_before_cutoff and booked_post_cutoff and included_in_physical_count:
                cutoff_errors.append({
                    "doc_id": rec_id,
                    "type": "PURCHASE_CUTOFF_UNDERSTATED_LIABILITY",
                    "amount_cr": amount_cr,
                    "details": f"Goods received {physical_date} and counted in stock, but purchase voucher entered {gl_booked_date}",
                    "adjusting_entry": f"Debit Inventory / Credit Accrued Liabilities (GRN Clearing) INR {amount_cr} Cr"
                })
                
        # Scenario 2: Shipped post-cutoff, but sales booked before cutoff AND counted in stock (Double Counting)
        elif doc_type == "OUTWARD_GDN":
            shipped_post_cutoff = physical_date > balance_sheet_cutoff_date
            sales_booked_pre_cutoff = gl_booked_date <= balance_sheet_cutoff_date
            
            if shipped_post_cutoff and sales_booked_pre_cutoff and included_in_physical_count:
                cutoff_errors.append({
                    "doc_id": rec_id,
                    "type": "DOUBLE_COUNTING_SALES_AND_INVENTORY",
                    "amount_cr": amount_cr,
                    "details": f"Sales booked {gl_booked_date} but goods shipped {physical_date} and still included in physical stock count",
                    "adjusting_entry": f"Reverse Sales Revenue of INR {amount_cr} Cr or exclude from inventory count"
                })
                
    total_cutoff_error_cr = sum(e["amount_cr"] for e in cutoff_errors)
    
    return {
        "records_tested": len(sampled_cutoff_records),
        "cutoff_exceptions_count": len(cutoff_errors),
        "total_cutoff_error_cr": round(total_cutoff_error_cr, 2),
        "cutoff_acceptable": len(cutoff_errors) == 0,
        "error_details": cutoff_errors
    }

cutoff_sample = [
    {"doc_id": "GRN-4491", "type": "INWARD_GRN", "physical_gate_date": "2026-03-29", "gl_posting_date": "2026-04-06", "amount_cr": 3.2, "included_in_physical_count": True},
    {"doc_id": "GDN-8812", "type": "OUTWARD_GDN", "physical_gate_date": "2026-04-03", "gl_posting_date": "2026-03-31", "amount_cr": 4.5, "included_in_physical_count": True},
    {"doc_id": "GRN-4492", "type": "INWARD_GRN", "physical_gate_date": "2026-03-30", "gl_posting_date": "2026-03-31", "amount_cr": 1.8, "included_in_physical_count": True}
]

cutoff_audit = audit_inventory_cutoff_grn_gdn(cutoff_sample)
print("SA 501 Inventory Cut-Off & Physical Gate Pass Verification Engine:")
print(f"  Records Tested         : {cutoff_audit['records_tested']}")
print(f"  Cut-Off Exceptions     : {cutoff_audit['cutoff_exceptions_count']}")
print(f"  Total Cut-Off Errors   : INR {cutoff_audit['total_cutoff_error_cr']} Crores")
print(f"  Cut-Off Status         : {'PASSED_CLEAN' if cutoff_audit['cutoff_acceptable'] else 'CUTOFF_ADJUSTMENTS_MANDATED'}")
print("  Identified Cut-Off Errors:")
for err in cutoff_audit['error_details']:
    print(f"    ! {err['doc_id']} ({err['type']}): INR {err['amount_cr']} Cr -> {err['details']}")
    print(f"      Required Entry: {err['adjusting_entry']}")
''',
            "tryIt": "Modify GRN-4491 to have gl_posting_date='2026-03-31' and GDN-8812 to have included_in_physical_count=False to see cutoff exceptions resolve cleanly.",
            "check": {
                "question": "What is the critical danger of an inventory cut-off breakdown where goods are shipped on April 3, but the sales invoice was booked on March 31 and the goods were also counted in the March 31 physical inventory count?",
                "options": [
                    "Double-Counting: The company records both the sales revenue and accounts receivable on the asset side, while simultaneously retaining the goods in ending inventory, artificially inflating current assets and profits twice",
                    "The warehouse manager must pay personal customs tariffs",
                    "The transport truck driver receives two paychecks",
                    "The inventory automatically depreciates to zero under tax rules"
                ],
                "answerIndex": 0,
                "why": "Double-counting occurs when a sale is recognized prematurely while the underlying goods are still counted in ending inventory, creating an unearned double boost to operating profit and assets."
            }
        },
        {
            "title": "Substantive Verification of Consignment Stock & Third-Party Warehouse Confirmations: SA 501",
            "say": [
                "Under SA 501, when inventory under the custody and control of a third party (such as public bonded warehouses, third-party logistics 3PL depots, consignment agents, or job-work processors) is material to the financial statements, the statutory auditor shall obtain sufficient appropriate audit evidence regarding the existence and condition of that inventory by performing one or both of the following procedures: (1) Request confirmation from the third party as to the quantities and condition of inventory held on behalf of the entity; and (2) Perform inspection or other audit procedures appropriate in the circumstances.",
                "External confirmations from third-party warehouse keepers cannot be accepted blindly if the auditor assesses a significant risk of fraud or if the warehouse keeper's integrity and objectivity are in question. Circumstances that warrant performing physical inspection in addition to or in lieu of third-party confirmation include: (a) where the third party is a related party or affiliated entity; (b) where the inventory value represents a significant percentage of total corporate assets; (c) where doubts exist regarding the integrity or independence of the third-party warehouse keeper; and (d) where previous audit cycles revealed discrepancies in third-party inventory records.",
                "In India, job-work inventory sent to outside vendors for processing is governed by Section 143 of the CGST Act and Ind AS 2. Companies must reconcile job-work delivery challans and e-way bills, ensuring that goods sent for job work are either returned to the principal's premises or sold directly from the job-worker's registered premises within statutory time limits (one year for inputs, three years for capital goods).",
                "If job-work inputs are not returned within one year, they are deemed to have been supplied by the principal to the job-worker on the date they were sent out, triggering retrospective GST liability with 18% interest under Section 50. The auditor must verify third-party physical quantities, condition, and GST compliance status."
            ],
            "example": "A textile manufacturer carries Rs 42 Crore in dyed yarn at four third-party independent warehouses and two job-work dyeing units. Under SA 501, the auditor sends positive confirmation requests to all six third parties. Four independent warehouses confirm stock matching client ledgers perfectly. However, the two job-work units (holding Rs 14 Crore of stock) fail to confirm. The auditor performs surprise physical inspections at the job-work sites, discovering that one unit has been shuttered for six months and the yarn was sold off, exposing a Rs 9 Crore fictitious inventory fraud.",
            "code": '''def audit_third_party_consignment_inventory(
    third_party_locations: list,
    materiality_threshold_cr: float = 2.0
) -> dict:
    audited_locations = []
    total_third_party_stock_cr = 0.0
    confirmed_clean_stock_cr = 0.0
    discrepancy_stock_cr = 0.0
    
    for loc in third_party_locations:
        val = loc["book_value_cr"]
        total_third_party_stock_cr += val
        
        # High value or related party requires physical inspection in addition to confirmation
        requires_physical_inspection = val >= materiality_threshold_cr or loc["is_related_party"]
        
        confirmed = loc["confirmation_received"]
        confirmed_val = loc["confirmed_value_cr"]
        physically_verified = loc["physically_inspected_by_auditor"]
        
        if confirmed and confirmed_val == val:
            confirmed_clean_stock_cr += val
            loc_status = "CONFIRMED_CLEAN"
        elif physically_verified and loc["physical_verified_value_cr"] == val:
            confirmed_clean_stock_cr += val
            loc_status = "PHYSICALLY_VERIFIED_CLEAN"
        else:
            diff = abs(val - (loc["physical_verified_value_cr"] if physically_verified else confirmed_val))
            discrepancy_stock_cr += diff
            loc_status = f"MATERIAL_DISCREPANCY_INR_{diff:.2f}_CR"
            
        audited_locations.append({
            "location_name": loc["name"],
            "book_value_cr": val,
            "requires_physical_count": requires_physical_inspection,
            "status": loc_status
        })
        
    requires_adjustment = discrepancy_stock_cr > 0.50 # > 50 Lakh
    
    return {
        "total_locations_audited": len(third_party_locations),
        "total_third_party_inventory_cr": round(total_third_party_stock_cr, 2),
        "confirmed_clean_stock_cr": round(confirmed_clean_stock_cr, 2),
        "total_discrepancy_exposure_cr": round(discrepancy_stock_cr, 2),
        "inventory_admissible": not requires_adjustment,
        "audit_finding": "ADJUSTMENT_AND_PROVISION_MANDATED" if requires_adjustment else "THIRD_PARTY_STOCK_CONFIRMED",
        "location_breakdown": audited_locations
    }

locations_sample = [
    {"name": "Central Public Logistics Depot", "book_value_cr": 18.0, "is_related_party": False, "confirmation_received": True, "confirmed_value_cr": 18.0, "physically_inspected_by_auditor": True, "physical_verified_value_cr": 18.0},
    {"name": "National Bonded Warehouse 4", "book_value_cr": 10.0, "is_related_party": False, "confirmation_received": True, "confirmed_value_cr": 10.0, "physically_inspected_by_auditor": False, "physical_verified_value_cr": 0.0},
    {"name": "Shree Ram Dyeing Job-Worker", "book_value_cr": 9.0, "is_related_party": True, "confirmation_received": False, "confirmed_value_cr": 0.0, "physically_inspected_by_auditor": True, "physical_verified_value_cr": 0.0}
]

tp_audit = audit_third_party_consignment_inventory(locations_sample)
print("SA 501 Third-Party Consignment Inventory Audit Engine:")
print(f"  Locations Audited      : {tp_audit['total_locations_audited']}")
print(f"  Total Third-Party Stock: INR {tp_audit['total_third_party_inventory_cr']} Crores")
print(f"  Confirmed Clean Stock  : INR {tp_audit['confirmed_clean_stock_cr']} Crores")
print(f"  Unreconciled Exposure  : INR {tp_audit['total_discrepancy_exposure_cr']} Crores")
print(f"  Audit Ruling           : {tp_audit['audit_finding']}")
print("  Location Inspection Breakdown:")
for l in tp_audit['location_breakdown']:
    print(f"    * {l['location_name']} (INR {l['book_value_cr']} Cr): Physical Count Required: {l['requires_physical_count']} -> {l['status']}")
''',
            "tryIt": "Set physical_verified_value_cr to 9.0 Cr on Shree Ram Dyeing to see the discrepancy exposure drop to zero and clear the audit finding.",
            "check": {
                "question": "Under SA 501, when is an auditor required to perform physical inspection of inventory held by a third party rather than relying solely on a written third-party confirmation?",
                "options": [
                    "When inventory value is material, when the third party is a related party, or where doubts exist regarding the integrity or independence of the third-party warehouse keeper",
                    "Only when the third party operates in an international tax haven",
                    "Whenever the warehouse has fewer than 10 security guards",
                    "Physical inspection of third-party warehouses is prohibited by Indian property law"
                ],
                "answerIndex": 0,
                "why": "SA 501 Paragraph 8 and A14 provide that where information obtained raises doubt about the integrity and objectivity of the third party, or where inventory is material or held by related parties, the auditor shall perform inspection or other procedures in addition to confirmation."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day13_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day13_data.json successfully!")
