"""
Build Day 15 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Milestone Project 3: Substantive Asset Verification, Fraud Analytics & Financial Statement Integrity Engine
"""
import json

day_data = {
    "day": 15,
    "title": "Milestone Project 3: Substantive Asset Verification, Fraud Analytics & Financial Statement Integrity Engine",
    "parts": [
        {
            "title": "Enterprise Substantive Asset Verification & Audit Evidence Cockpit",
            "say": [
                "Welcome to Milestone Project 3: The Substantive Asset Verification, Fraud Analytics & Financial Statement Integrity Engine. In this milestone capstone, you step into the role of the Senior Forensic Assurance Lead and Technical Audit Director, commanding the complete substantive audit of Zenith Manufacturing & Logistics Conglomerate Ltd, a listed industrial powerhouse reporting Rs 4,800 Crore in annual turnover, Rs 380 Crore in Profit Before Tax, and Rs 5,500 Crore in total assets.",
                "In Part 1, your objective is to deploy the Master Substantive Asset Verification Cockpit under SA 500, SA 501, and SA 530 across Zenith's three largest asset portfolios: Property, Plant and Equipment (Rs 2,400 Crore), Inventories (Rs 850 Crore), and Trade Receivables (Rs 620 Crore).",
                "You establish the quantitative audit scope: with Overall Materiality at Rs 19.0 Crore (5% of PBT) and Performance Materiality at Rs 12.35 Crore (65% factor), your statistical sampling models establish sampling intervals and audit sample sizes. Across the three portfolios, your team inspects physical assets, attends year-end warehouse counts, and issues positive external circularization requests.",
                "You synthesize sample testing results across asset classes: identifying unrecorded liabilities in cut-off testing, computing NRV write-downs on obsolete inventory, and tracking confirmation disputes. This comprehensive dashboard establishes the empirical evidence base required to defend capital market assurance."
            ],
            "example": "At the audit team briefing, the technical director reviews the substantive scope: sampling 210 PPE additions (Rs 420 Crore), 185 inventory count sheets across 8 manufacturing plants (Rs 550 Crore), and 95 customer trade receivable confirmations (Rs 410 Crore). The master dashboard tracks real-time evidence assembly, calculating coverage ratios and logging audit findings.",
            "code": '''class SubstantiveAssetVerificationCockpit:
    def __init__(self, pbt_cr: float):
        self.overall_mat_cr = pbt_cr * 0.05
        self.pm_cr = self.overall_mat_cr * 0.65
        self.portfolios = []
        
    def register_asset_portfolio(self, name: str, book_value_cr: float, sampled_value_cr: float, identified_errors_cr: float):
        coverage_pct = (sampled_value_cr / book_value_cr) * 100.0 if book_value_cr > 0 else 0.0
        self.portfolios.append({
            "name": name,
            "book_value_cr": book_value_cr,
            "sampled_value_cr": sampled_value_cr,
            "coverage_pct": round(coverage_pct, 1),
            "errors_cr": identified_errors_cr,
            "is_error_material": identified_errors_cr >= self.pm_cr
        })
        
    def generate_substantive_integrity_report(self) -> dict:
        total_assets = sum(p["book_value_cr"] for p in self.portfolios)
        total_tested = sum(p["sampled_value_cr"] for p in self.portfolios)
        total_errors = sum(p["errors_cr"] for p in self.portfolios)
        
        return {
            "overall_materiality_cr": round(self.overall_mat_cr, 2),
            "performance_materiality_cr": round(self.pm_cr, 2),
            "total_portfolio_assets_cr": round(total_assets, 2),
            "total_tested_assets_cr": round(total_tested, 2),
            "overall_coverage_pct": round((total_tested / total_assets) * 100.0, 1),
            "total_accumulated_errors_cr": round(total_errors, 2),
            "requires_material_adjustment": total_errors >= self.pm_cr,
            "portfolios_audited": self.portfolios
        }

cockpit = SubstantiveAssetVerificationCockpit(pbt_cr=380.0)
cockpit.register_asset_portfolio("Property, Plant & Equipment", book_value_cr=2400.0, sampled_value_cr=680.0, identified_errors_cr=8.5)
cockpit.register_asset_portfolio("Inventories (Ind AS 2)", book_value_cr=850.0, sampled_value_cr=450.0, identified_errors_cr=5.2)
cockpit.register_asset_portfolio("Trade Receivables (Ind AS 109)", book_value_cr=620.0, sampled_value_cr=380.0, identified_errors_cr=4.1)

report = cockpit.generate_substantive_integrity_report()
print("MASTER SUBSTANTIVE ASSET VERIFICATION COCKPIT:")
print(f"  Overall Materiality (5% PBT): INR {report['overall_materiality_cr']} Crores")
print(f"  Performance Materiality     : INR {report['performance_materiality_cr']} Crores")
print(f"  Total Asset Scope           : INR {report['total_portfolio_assets_cr']} Crores (Tested: INR {report['total_tested_assets_cr']} Cr, {report['overall_coverage_pct']}%)")
print(f"  Accumulated Asset Errors    : INR {report['total_accumulated_errors_cr']} Crores")
print(f"  Material Adjustment Needed  : {report['requires_material_adjustment']}")
print("  Portfolio Breakdown:")
for p in report['portfolios_audited']:
    print(f"    * {p['name']}: Billed INR {p['book_value_cr']} Cr -> Tested {p['coverage_pct']}% | Errors: INR {p['errors_cr']} Cr")
''',
            "tryIt": "Increase identified_errors_cr on Property, Plant & Equipment to 15.0 Cr to see total errors breach performance materiality, triggering mandatory adjusting entries.",
            "check": {
                "question": "In Milestone Project 3, how does the Substantive Asset Verification Cockpit determine whether total accumulated asset errors require mandatory balance sheet adjustments?",
                "options": [
                    "By comparing total accumulated asset errors across portfolios against Performance Materiality (Rs 12.35 Cr); when total errors exceed Performance Materiality, the auditor must require adjustments to prevent aggregate misstatements from breaching Overall Materiality",
                    "By asking company executives whether they agree with the adjustments",
                    "By checking whether the stock exchange is open on the audit signing date",
                    "By waiting 12 months for errors to self-correct"
                ],
                "answerIndex": 0,
                "why": "Under SA 320 and SA 450, when accumulated uncorrected errors exceed performance materiality, the auditor must demand adjustments to mitigate the statistical risk that undetected errors cause total misstatements to exceed overall materiality."
            }
        },
        {
            "title": "Forensic Revenue Recognition & Channel Stuffing Detection Engine",
            "say": [
                "In Part 2 of Milestone Project 3, you execute the advanced Forensic Revenue Recognition & Channel Stuffing Diagnostic under SA 240 and Ind AS 115 across Zenith's 24 regional sales divisions.",
                "Your automated diagnostic analyzes 85,000 sales transactions recorded in the final 30 days of the fiscal year: querying for abnormal sales volume surges in the final 5 days of March; identifying subsequent credit notes issued in April and May; and cross-referencing invoice dates against government E-Invoicing IRP microsecond timestamps and E-Way Bill transit logs.",
                "The engine isolates two major revenue manipulation schemes: Scheme 1: In the Heavy Equipment Division, sales of Rs 35 Crore were booked on March 30 under 'Bill-and-Hold' terms. However, audit inspection reveals that the customer never requested bill-and-hold treatment, the goods were not segregated, and side letters guaranteed a 100% right of return within 120 days. Scheme 2: In the Automotive Components Division, Rs 18 Crore in invoices were booked on March 31, but IRP logs confirm that the government IRNs were generated on April 5, proving cut-off manipulation.",
                "You calculate total premature and fraudulent revenue, model the impact on gross margin, and generate the mandatory revenue reversal adjustment entries under Ind AS 115."
            ],
            "example": "The forensic revenue engine flags Invoice INV-HE-801 for Rs 35 Crore. Email archives confirm a confidential side letter from the Sales VP promising the distributor that if the machinery is not resold to end-users by June 30, Zenith will take the machines back at zero restocking fee. The auditor determines that control never passed under Ind AS 115, classifying the transaction as a consignment sale requiring 100% reversal.",
            "code": '''class ForensicRevenueDiagnosticEngine:
    def __init__(self, booked_revenue_cr: float):
        self.total_booked_cr = booked_revenue_cr
        self.fraudulent_schemes = []
        
    def add_revenue_finding(self, scheme_name: str, division: str, fictitious_revenue_cr: float, underlying_cogs_cr: float, violation_code: str):
        self.fraudulent_schemes.append({
            "scheme": scheme_name,
            "division": division,
            "revenue_cr": fictitious_revenue_cr,
            "cogs_cr": underlying_cogs_cr,
            "gross_profit_inflation_cr": fictitious_revenue_cr - underlying_cogs_cr,
            "violation": violation_code
        })
        
    def execute_revenue_reversal_synthesis(self) -> dict:
        total_rev_reversal = sum(s["revenue_cr"] for s in self.fraudulent_schemes)
        total_cogs_restoration = sum(s["cogs_cr"] for s in self.fraudulent_schemes)
        total_gp_inflation = sum(s["gross_profit_inflation_cr"] for s in self.fraudulent_schemes)
        
        post_reversal_revenue = self.total_booked_cr - total_rev_reversal
        
        return {
            "pre_audit_booked_revenue_cr": self.total_booked_cr,
            "total_fraudulent_revenue_cr": round(total_rev_reversal, 2),
            "restored_inventory_cogs_cr": round(total_cogs_restoration, 2),
            "operating_profit_inflation_cr": round(total_gp_inflation, 2),
            "restated_audited_revenue_cr": round(post_reversal_revenue, 2),
            "mandatory_adjusting_entry": f"Debit Revenue INR {total_rev_reversal:.2f} Cr / Credit Receivables INR {total_rev_reversal:.2f} Cr; Debit Inventory INR {total_cogs_restoration:.2f} Cr / Credit COGS INR {total_cogs_restoration:.2f} Cr",
            "statutory_fraud_reporting_mandated": total_rev_reversal >= 1.0,
            "schemes_identified": self.fraudulent_schemes
        }

rev_engine = ForensicRevenueDiagnosticEngine(booked_revenue_cr=4800.0)
rev_engine.add_revenue_finding("Sham Bill-and-Hold with Side Letters", "Heavy Equipment", fictitious_revenue_cr=35.0, underlying_cogs_cr=24.5, violation_code="IND_AS_115_CONTROL_TRANSFER_FAILURE")
rev_engine.add_revenue_finding("Post-Dated IRP Cut-Off Acceleration", "Automotive Components", fictitious_revenue_cr=18.0, underlying_cogs_cr=12.0, violation_code="SA_240_CUTOFF_MANIPULATION")

rev_res = rev_engine.execute_revenue_reversal_synthesis()
print("FORENSIC REVENUE FRAUD & CHANNEL STUFFING DIAGNOSTIC:")
print(f"  Pre-Audit Booked Revenue: INR {rev_res['pre_audit_booked_revenue_cr']} Crores")
print(f"  Fraudulent Revenue Billed: INR {rev_res['total_fraudulent_revenue_cr']} Crores")
print(f"  Inventory Restored      : INR {rev_res['restored_inventory_cogs_cr']} Crores")
print(f"  Operating Profit Bleed  : INR {rev_res['operating_profit_inflation_cr']} Crores")
print(f"  Restated Audited Revenue: INR {rev_res['restated_audited_revenue_cr']} Crores")
print(f"  Sec 143(12) MCA Mandate : {rev_res['statutory_fraud_reporting_mandated']}")
print("  Schemes Uncovered:")
for s in rev_res['schemes_identified']:
    print(f"    ! {s['scheme']} ({s['division']}): INR {s['revenue_cr']} Cr -> {s['violation']}")
''',
            "tryIt": "Clear all fraudulent schemes to see restated audited revenue equal the original booked revenue.",
            "check": {
                "question": "What is the complete two-sided adjusting journal entry required when the auditor reverses Rs 35 Crore of fraudulent revenue with Rs 24.5 Crore of underlying cost of goods sold?",
                "options": [
                    "Debit Sales Revenue Rs 35 Cr / Credit Accounts Receivable Rs 35 Cr (reversing the fake sale), AND Debit Finished Goods Inventory Rs 24.5 Cr / Credit Cost of Goods Sold Rs 24.5 Cr (restoring the asset)",
                    "Debit Cash Rs 35 Cr / Credit Retained Earnings Rs 35 Cr",
                    "Debit Share Capital Rs 35 Cr / Credit Tax Payable Rs 35 Cr",
                    "No entry is needed if the customer pays next year"
                ],
                "answerIndex": 0,
                "why": "Reversing premature revenue requires eliminating the unearned revenue and related receivable, while reversing the associated cost of goods sold and restoring the inventory asset on the balance sheet."
            }
        },
        {
            "title": "Supply Chain Forensics: Circular Trading & Shell Vendor Collision Engine",
            "say": [
                "In Part 3 of Milestone Project 3, you execute the Supply Chain Forensics & Shell Vendor Collision Engine under SA 240, analyzing Zenith's complete master vendor disbursements (Rs 2,850 Crore paid across 3,200 active suppliers) and HR employee records (4,500 personnel).",
                "Your automated forensic engine performs two multi-dimensional analyses: (1) Circular Trading Loop Detection—identifying transaction chains where funds or invoices circulate in closed loops across third-party dealers; and (2) Master Data Identity Collision Graphing—cross-referencing employee identification credentials (PAN, residential addresses, mobile numbers, and bank account numbers) against vendor masters.",
                "The engine isolates a major corrupt procurement ring: three approved vendor entities—'Alpha Logistics Transporters', 'Apex Freight Services', and 'Pinnacle Supply Movers'—all share a single common bank account number at Kotak Mahindra Bank. Graph analysis reveals that this exact bank account is registered under the personal PAN and residential address of Zenith's Vice President of Corporate Procurement.",
                "Total payments disbursed to these three shell vendors over the past 18 months amount to Rs 28.5 Crore. Physical shipping inspection confirms that zero transport services were ever rendered. You document the prima facie evidence of corporate embezzlement, quantify the criminal damages, and prepare the Section 143(12) Form ADT-4 referral."
            ],
            "example": "The collision graph displays an exact bank account match: Shell Vendor #1 (Rs 12 Crore disbursed), Shell Vendor #2 (Rs 9.5 Crore disbursed), and Shell Vendor #3 (Rs 7 Crore disbursed) all channel funds into bank account 0092144801, registered to VP of Procurement Rajesh Varma. The auditor freezes vendor payments and files Form ADT-4 with the MCA.",
            "code": '''class SupplyChainCollisionGraphEngine:
    def __init__(self, total_disbursements_cr: float):
        self.total_disbursed_cr = total_disbursements_cr
        
    def detect_corrupt_procurement_rings(self, vendor_disbursements: list, employee_credentials: list) -> dict:
        emp_pan_dict = {e["pan"]: e for e in employee_credentials}
        emp_bank_dict = {e["bank_acc"]: e for e in employee_credentials}
        emp_addr_dict = {e["address"].upper(): e for e in employee_credentials}
        
        tainted_vendors = []
        total_corrupt_spend = 0.0
        
        for v in vendor_disbursements:
            v_name = v["name"]
            v_disbursed = v["amount_cr"]
            v_pan = v["pan"]
            v_bank = v["bank_acc"]
            v_addr = v["address"].upper()
            
            collision_found = False
            matched_employee = None
            match_type = ""
            
            if v_pan in emp_pan_dict:
                collision_found = True
                matched_employee = emp_pan_dict[v_pan]
                match_type = "PAN_MATCH"
            elif v_bank in emp_bank_dict:
                collision_found = True
                matched_employee = emp_bank_dict[v_bank]
                match_type = "BANK_ACCOUNT_COLLISION"
            elif v_addr in emp_addr_dict:
                collision_found = True
                matched_employee = emp_addr_dict[v_addr]
                match_type = "RESIDENTIAL_ADDRESS_COLLISION"
                
            if collision_found:
                total_corrupt_spend += v_disbursed
                tainted_vendors.append({
                    "vendor_name": v_name,
                    "disbursed_cr": v_disbursed,
                    "employee_name": matched_employee["name"],
                    "employee_title": matched_employee["title"],
                    "collision_mechanism": match_type
                })
                
        is_fraud_present = len(tainted_vendors) > 0
        
        return {
            "total_corporate_disbursements_cr": self.total_disbursed_cr,
            "corrupt_disbursements_total_cr": round(total_corrupt_spend, 2),
            "tainted_vendors_count": len(tainted_vendors),
            "procurement_fraud_confirmed": is_fraud_present,
            "sec143_12_mca_reporting_mandate": total_corrupt_spend >= 1.0,
            "tainted_vendor_ring": tainted_vendors
        }

emp_creds = [
    {"name": "Rajesh Varma", "title": "VP Corporate Procurement", "pan": "ABCDE9911F", "bank_acc": "0092144801", "address": "74 Malabar Hill Mumbai"}
]
vendors_list = [
    {"name": "Alpha Logistics Transporters", "amount_cr": 12.0, "pan": "XYZPA1122B", "bank_acc": "0092144801", "address": "Flat 4 Andheri"},
    {"name": "Apex Freight Services", "amount_cr": 9.5, "pan": "XYZPA3344C", "bank_acc": "0092144801", "address": "Shop 12 Bandra"},
    {"name": "Pinnacle Supply Movers", "amount_cr": 7.0, "pan": "XYZPA5566D", "bank_acc": "0092144801", "address": "Plot 8 Chembur"},
    {"name": "Genuine Steel Suppliers Ltd", "amount_cr": 145.0, "pan": "GENST1234A", "bank_acc": "8877665544", "address": "12 Nariman Point"}
]

collision_engine = SupplyChainCollisionGraphEngine(total_disbursements_cr=2850.0)
collision_res = collision_engine.detect_corrupt_procurement_rings(vendors_list, emp_creds)

print("SUPPLY CHAIN FORENSICS & SHELL VENDOR COLLISION COCKPIT:")
print(f"  Total Corporate Spend  : INR {collision_res['total_corporate_disbursements_cr']} Crores")
print(f"  Corrupt Embezzlement   : INR {collision_res['corrupt_disbursements_total_cr']} Crores")
print(f"  Tainted Shell Vendors  : {collision_res['tainted_vendors_count']}")
print(f"  Procurement Fraud      : {collision_res['procurement_fraud_confirmed']}")
print(f"  Form ADT-4 MCA Filing  : {collision_res['sec143_12_mca_reporting_mandate']}")
print("  Corrupt Procurement Ring Details:")
for tv in collision_res['tainted_vendor_ring']:
    print(f"    * {tv['vendor_name']} (INR {tv['disbursed_cr']} Cr) -> Controlled by {tv['employee_name']} ({tv['employee_title']}) via {tv['collision_mechanism']}")
''',
            "tryIt": "Change the bank account on the three vendors to independent accounts to observe the collision engine clear without fraud findings.",
            "check": {
                "question": "When forensic collision graphing proves that a corporate Vice President of Procurement channeled Rs 28.5 Crore into shell vendors sharing their personal bank account, what statutory actions are legally mandated under Section 143(12) of the Companies Act?",
                "options": [
                    "The statutory auditor must report the fraud to the Board Audit Committee within 2 days, and on expiry of the 45-day window, transmit Form ADT-4 directly to the Central Government (Ministry of Corporate Affairs)",
                    "The auditor must keep the information strictly secret until the executive retires",
                    "The auditor should ask the executive to refund 10% of the money and close the file",
                    "The company can reclassify the embezzlement as research and development expense"
                ],
                "answerIndex": 0,
                "why": "Section 143(12) and Rule 13 legally compel the auditor to report fraud exceeding Rs 1 Crore committed by officers or employees to the Board within 2 days and subsequently file Form ADT-4 with the Central Government."
            }
        },
        {
            "title": "Fixed Asset & CWIP Impairment Synthesis: Ind AS 16, Ind AS 36 & CARO Clause i",
            "say": [
                "In Part 4 of Milestone Project 3, you execute the Fixed Asset, CWIP & Asset Impairment synthesis under Ind AS 16, Ind AS 36, and CARO 2020 Clause (i) across Zenith's manufacturing plants and capital projects.",
                "Your technical audit team reviews Rs 480 Crore in Capital Work-in-Progress (CWIP) and Rs 2,400 Crore in operating Property, Plant and Equipment: (1) CWIP Aging Analysis reveals that Rs 62 Crore allocated to 'Solar Power Facility Phase 2' has been stalled for 26 months following the cancellation of state solar tariff subsidies, with zero active construction; (2) Physical Verification of Fixed Assets identifies Rs 14.5 Crore in dismantled and scrapped machinery still recorded on the active asset register (Ghost Assets); and (3) Cash-Generating Unit (CGU) Impairment Testing on the Ceramic Tiles Division reveals that discounted Cash Flow Value in Use (VIU = Rs 140 Crore) and Fair Value Less Costs of Disposal (FVLCD = Rs 130 Crore) fall far below the CGU carrying value (Rs 195 Crore, including Rs 25 Crore of allocated Goodwill).",
                "You execute the Ind AS 36 impairment waterfall: (a) 100% write-off of the stalled CWIP (Rs 62 Crore); (b) 100% write-off of ghost assets (Rs 14.5 Crore); and (c) Rs 55 Crore CGU impairment (fully writing off Rs 25 Crore Goodwill to zero and writing down plant machinery by Rs 30 Crore).",
                "You compile the complete statutory CARO 2020 Clause (i) disclosure table detailing title deeds, physical discrepancies, and CWIP aging."
            ],
            "example": "The impairment synthesis engine calculates total capital asset write-downs: Rs 62 Crore on abandoned solar CWIP, Rs 14.5 Crore on ghost machinery, and Rs 55 Crore on the Ceramic Tiles CGU (total asset write-down = Rs 131.5 Crore). The auditor requires management to record these adjustments in the audited financial statements, preventing the massive overstatement of non-current assets.",
            "code": '''class FixedAssetImpairmentSynthesisEngine:
    def __init__(self, total_ppe_cr: float, total_cwip_cr: float):
        self.total_ppe = total_ppe_cr
        self.total_cwip = total_cwip_cr
        self.impairments = []
        
    def add_impairment_finding(self, category: str, asset_name: str, book_value_cr: float, recoverable_val_cr: float, standard_code: str):
        impairment_loss = max(0.0, book_value_cr - recoverable_val_cr)
        self.impairments.append({
            "category": category,
            "asset_name": asset_name,
            "book_value_cr": book_value_cr,
            "recoverable_cr": recoverable_val_cr,
            "loss_cr": impairment_loss,
            "standard": standard_code
        })
        
    def generate_impairment_dossier(self) -> dict:
        total_loss = sum(i["loss_cr"] for i in self.impairments)
        cwip_losses = sum(i["loss_cr"] for i in self.impairments if i["category"] == "CWIP")
        ppe_losses = sum(i["loss_cr"] for i in self.impairments if i["category"] == "PPE")
        goodwill_losses = sum(i["loss_cr"] for i in self.impairments if i["category"] == "GOODWILL")
        
        post_impairment_ppe = self.total_ppe - ppe_losses
        post_impairment_cwip = self.total_cwip - cwip_losses
        
        return {
            "pre_audit_ppe_cr": self.total_ppe,
            "pre_audit_cwip_cr": self.total_cwip,
            "total_capital_asset_writeoff_cr": round(total_loss, 2),
            "cwip_writeoff_cr": round(cwip_losses, 2),
            "ppe_writeoff_cr": round(ppe_losses, 2),
            "goodwill_writeoff_cr": round(goodwill_losses, 2),
            "restated_audited_ppe_cr": round(post_impairment_ppe, 2),
            "restated_audited_cwip_cr": round(post_impairment_cwip, 2),
            "caro_clause_i_modified": total_loss > 0,
            "impairments_list": self.impairments
        }

fa_engine = FixedAssetImpairmentSynthesisEngine(total_ppe_cr=2400.0, total_cwip_cr=480.0)
fa_engine.add_impairment_finding("CWIP", "Solar Power Facility Phase 2 (Stalled 26m)", book_value_cr=62.0, recoverable_val_cr=0.0, standard_code="IND_AS_36_STALLED_CWIP")
fa_engine.add_impairment_finding("PPE", "Dismantled Heat Exchangers & Ghost Machinery", book_value_cr=14.5, recoverable_val_cr=0.0, standard_code="CARO_CLAUSE_I_PHYSICAL_DISCREPANCY")
fa_engine.add_impairment_finding("GOODWILL", "Ceramic Tiles CGU Goodwill", book_value_cr=25.0, recoverable_val_cr=0.0, standard_code="IND_AS_36_GOODWILL_EXTINGUISHMENT")
fa_engine.add_impairment_finding("PPE", "Ceramic Tiles CGU Plant & Machinery", book_value_cr=170.0, recoverable_val_cr=140.0, standard_code="IND_AS_36_CGU_PPE_IMPAIRMENT")

fa_res = fa_engine.generate_impairment_dossier()
print("FIXED ASSET & CWIP IMPAIRMENT SYNTHESIS ENGINE:")
print(f"  Pre-Audit PPE / CWIP   : INR {fa_res['pre_audit_ppe_cr']} Cr / INR {fa_res['pre_audit_cwip_cr']} Cr")
print(f"  Total Asset Write-Off  : INR {fa_res['total_capital_asset_writeoff_cr']} Crores")
print(f"  CWIP Abandonment       : INR {fa_res['cwip_writeoff_cr']} Crores")
print(f"  PPE / Ghost Write-Down : INR {fa_res['ppe_writeoff_cr']} Crores")
print(f"  Goodwill Extinguished  : INR {fa_res['goodwill_writeoff_cr']} Crores")
print(f"  Restated Audited PPE   : INR {fa_res['restated_audited_ppe_cr']} Crores")
print(f"  Restated Audited CWIP  : INR {fa_res['restated_audited_cwip_cr']} Crores")
print("  Impairment Findings Breakdown:")
for imp in fa_res['impairments_list']:
    print(f"    * {imp['category']}: {imp['asset_name']} -> Loss: INR {imp['loss_cr']} Cr ({imp['standard']})")
''',
            "tryIt": "Clear all impairment findings to see restated PPE and CWIP equal their pre-audit carrying values.",
            "check": {
                "question": "What is the primary disclosure requirement under Schedule III and CARO 2020 Clause (i) for Capital Work-in-Progress (CWIP) projects whose completion is overdue or where construction has been suspended?",
                "options": [
                    "A detailed CWIP Aging Schedule (categorized by <1yr, 1-2yr, 2-3yr, >3yr) and CWIP Completion Schedule disclosing project-wise cost overruns, timeline delays, and impairment evaluations under Ind AS 36",
                    "A single one-line statement certifying that all projects are proceeding smoothly",
                    "No disclosure is required if the company plans to sell the project to a competitor",
                    "Disclosures are required only for foreign projects located in Europe"
                ],
                "answerIndex": 0,
                "why": "Schedule III of the Companies Act, 2013 legally mandates comprehensive CWIP aging schedules and completion plans for all overdue or cost-overrun capital projects, ensuring transparency over stalled capital expenditures."
            }
        },
        {
            "title": "Master Financial Statement Integrity & Special Investigator Accreditation",
            "say": [
                "In Part 5 of Milestone Project 3, you assemble the Master Financial Statement Integrity War Room, synthesizing all empirical evidence, substantive error schedules, revenue reversals, shell vendor kickbacks, and asset impairment write-offs into the restated financial statements and statutory audit report.",
                "Your synthesis incorporates the full-spectrum audit findings across all five days of Block 3: (1) Reversing Rs 53 Crore of premature and fraudulent revenue (Rs 35 Crore sham bill-and-hold + Rs 18 Crore IRP cut-off manipulation), restoring Rs 36.5 Crore of inventory; (2) Recording Rs 28.5 Crore in shell vendor embezzlement losses under Section 143(12) with Form ADT-4 filing; (3) Booking Rs 131.5 Crore in capital asset impairments and ghost asset write-offs under Ind AS 36 and Ind AS 16; and (4) Booking Rs 8.2 Crore in slow-moving inventory NRV write-downs under Ind AS 2.",
                "You evaluate the restated financial impact: Profit Before Tax (PBT) drops from Rs 380 Crore down to Rs 186.8 Crore (a 50.8% reduction in earnings). Net Debt-to-Equity ratios adjust from 0.82 to 1.15. You issue a Qualified Audit Opinion under SA 705 and formulate the comprehensive CARO 2020 statutory disclosures.",
                "Successfully commanding this multi-asset substantive audit, unmasking corporate procurement rings, and restoring financial statement integrity confers formal credentialing: Senior Forensic Assurance Lead & Certified Technical Audit Director."
            ],
            "example": "The Technical Audit Director executes the final restatement dossier: restating audited PBT from Rs 380 Crore to Rs 186.8 Crore, securing board approval for Rs 221.2 Crore in total adjustments, transmitting Form ADT-4 to the Ministry of Corporate Affairs for Rs 28.5 Crore procurement fraud, and issuing the independent auditor's report.",
            "code": '''class MasterFinancialIntegrityEngine:
    def __init__(self, reported_revenue_cr: float, reported_pbt_cr: float, reported_assets_cr: float):
        self.rep_rev = reported_revenue_cr
        self.rep_pbt = reported_pbt_cr
        self.rep_assets = reported_assets_cr
        
    def synthesize_master_restatements(
        self,
        revenue_reversals_cr: float,
        restored_inventory_cogs_cr: float,
        shell_vendor_fraud_loss_cr: float,
        capital_asset_impairments_cr: float,
        inventory_nrv_writedowns_cr: float
    ) -> dict:
        # P&L Impact:
        # Gross profit reduction = Revenue reversal - COGS restored
        gp_reduction = revenue_reversals_cr - restored_inventory_cogs_cr
        total_pbt_reduction = gp_reduction + shell_vendor_fraud_loss_cr + capital_asset_impairments_cr + inventory_nrv_writedowns_cr
        
        restated_pbt = self.rep_pbt - total_pbt_reduction
        restated_revenue = self.rep_rev - revenue_reversals_cr
        restated_assets = self.rep_assets - (revenue_reversals_cr) + (restored_inventory_cogs_cr) - capital_asset_impairments_cr - inventory_nrv_writedowns_cr
        
        earnings_impact_pct = (total_pbt_reduction / self.rep_pbt) * 100.0
        
        return {
            "reported_pbt_cr": self.rep_pbt,
            "total_audit_adjustments_cr": round(total_pbt_reduction, 2),
            "restated_audited_pbt_cr": round(restated_pbt, 2),
            "earnings_contraction_pct": round(earnings_impact_pct, 1),
            "restated_audited_revenue_cr": round(restated_revenue, 2),
            "restated_audited_assets_cr": round(restated_assets, 2),
            "mca_fraud_reported_sec143_12": shell_vendor_fraud_loss_cr >= 1.0,
            "statutory_opinion": "QUALIFIED_OPINION_MATERIAL_MISSTATEMENTS_RESTATED" if earnings_impact_pct >= 20.0 else "UNMODIFIED_CLEAN",
            "lead_investigator_credential": "CERTIFIED_TECHNICAL_AUDIT_DIRECTOR_AND_SENIOR_FORENSIC_ASSURANCE_LEAD"
        }

master_engine = MasterFinancialIntegrityEngine(reported_revenue_cr=4800.0, reported_pbt_cr=380.0, reported_assets_cr=5500.0)
final_dossier = master_engine.synthesize_master_restatements(
    revenue_reversals_cr=53.0,
    restored_inventory_cogs_cr=36.5, # Net GP reduction = 16.5 Cr
    shell_vendor_fraud_loss_cr=28.5,
    capital_asset_impairments_cr=131.5,
    inventory_nrv_writedowns_cr=8.2
)

print("=" * 80)
print("MASTER FINANCIAL STATEMENT INTEGRITY & AUDIT WAR ROOM DOSSIER")
print("=" * 80)
print(f"  Pre-Audit Reported PBT   : INR {final_dossier['reported_pbt_cr']} Crores")
print(f"  Total Audit Adjustments  : INR {final_dossier['total_audit_adjustments_cr']} Crores")
print(f"  Restated Audited PBT     : INR {final_dossier['restated_audited_pbt_cr']} Crores (-{final_dossier['earnings_contraction_pct']}%)")
print(f"  Restated Revenue         : INR {final_dossier['restated_audited_revenue_cr']} Crores")
print(f"  Restated Total Assets    : INR {final_dossier['restated_audited_assets_cr']} Crores")
print(f"  Sec 143(12) MCA Form ADT4: {final_dossier['mca_fraud_reported_sec143_12']}")
print(f"  Independent Audit Opinion: {final_dossier['statutory_opinion']}")
print(f"  Professional Accreditation: {final_dossier['lead_investigator_credential']}")
print("=" * 80)
''',
            "tryIt": "Set all adjustments to zero to verify that reported PBT passes cleanly without restatement contraction.",
            "check": {
                "question": "What is the strategic and ethical responsibility of the Senior Technical Audit Director when substantive audit testing reveals that reported corporate earnings must be restated downwards by 50.8% due to fraudulent revenue and asset impairments?",
                "options": [
                    "Uphold public interest and capital market integrity by insisting on full audited financial statement restatement, issuing an appropriately modified audit opinion, and filing Form ADT-4 with the Central Government for proven fraud",
                    "Conceal the adjustments in exchange for higher consulting fees",
                    "Resign quietly without notifying shareholders or regulatory authorities",
                    "Spread the write-downs over 50 years to avoid alarming investors"
                ],
                "answerIndex": 0,
                "why": "The statutory auditor serves as a public gatekeeper; when material fraud and asset impairments are substantiated, the auditor is legally bound by the Companies Act and ICAI standards to compel restatement and report fraud to the Central Government."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day15_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day15_data.json successfully!")
