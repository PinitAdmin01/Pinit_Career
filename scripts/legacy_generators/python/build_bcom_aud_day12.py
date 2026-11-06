"""
Build Day 12 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Substantive Testing of Revenue Recognition Fraud & Channel Stuffing: Ind AS 115 & SA 240
"""
import json

day_data = {
    "day": 12,
    "title": "Substantive Testing of Revenue Recognition Fraud, Channel Stuffing & Bill-and-Hold: Ind AS 115 & SA 240",
    "parts": [
        {
            "title": "Ind AS 115 5-Step Model & Revenue Assertions: Existence vs Completeness",
            "say": [
                "Under Indian Accounting Standard (Ind AS) 115 (Revenue from Contracts with Customers), revenue recognition is governed by a legally binding 5-Step Framework: (1) Identify the contract(s) with a customer; (2) Identify the performance obligations in the contract; (3) Determine the transaction price; (4) Allocate the transaction price to the performance obligations; and (5) Recognize revenue when (or as) the entity satisfies a performance obligation by transferring control of a promised good or service to the customer.",
                "In statutory auditing, revenue recognition involves competing assertions that carry asymmetrical fraud risks. For revenue, the predominant fraud risk is Overstatement—violating the assertions of Occurrence (did the revenue transactions actually happen?), Accuracy (is the monetary measurement correct?), and Cut-Off (were transactions recorded in the correct accounting period?). Management rarely commits fraud by understating revenue; therefore, substantive testing focuses aggressively on the 'Existence and Occurrence' assertion.",
                "To test Occurrence under SA 240 and Ind AS 115, the auditor must establish that 'Control' has legally transferred to the customer. Transfer of control occurs when the customer obtains the ability to direct the use of, and obtain substantially all of the remaining benefits from, the asset. Control includes the present ability to prevent other entities from directing the use of, and obtaining the benefits from, an asset.",
                "Indicators of transfer of control include: (a) the entity has a present right to payment; (b) the customer has legal title to the asset; (c) the entity has transferred physical possession; (d) the customer has the significant risks and rewards of ownership; and (e) the customer has accepted the asset. Recording revenue prior to the satisfaction of these criteria represents premature revenue recognition and fraudulent financial reporting."
            ],
            "example": "A commercial machinery manufacturer books Rs 25 Crore in revenue on March 30 after generating an electronic sales invoice for customized generators. However, the machines remain physically located inside the manufacturer's assembly plant, and the customer has not signed the factory acceptance test (FAT). Because legal title, physical possession, and customer acceptance have not transferred, the auditor determines that control has not passed under Ind AS 115 Step 5, compelling the reversal of the entire Rs 25 Crore entry.",
            "code": '''def evaluate_indas115_revenue_recognition(
    has_enforceable_contract: bool,
    performance_obligations_identified: bool,
    transaction_price_fixed_or_determinable: bool,
    price_allocated_to_obligations: bool,
    customer_has_present_obligation_to_pay: bool,
    legal_title_transferred: bool,
    physical_possession_transferred: bool,
    significant_risks_and_rewards_transferred: bool,
    customer_acceptance_signed: bool,
    invoice_amount_cr: float
) -> dict:
    steps_1_to_4_met = (
        has_enforceable_contract and 
        performance_obligations_identified and 
        transaction_price_fixed_or_determinable and 
        price_allocated_to_obligations
    )
    
    # Control Transfer Criteria (Step 5)
    control_indicators = [
        customer_has_present_obligation_to_pay,
        legal_title_transferred,
        physical_possession_transferred,
        significant_risks_and_rewards_transferred,
        customer_acceptance_signed
    ]
    control_transfer_score = sum(1 for c in control_indicators if c)
    
    # Must have at least 4 of 5 indicators including customer acceptance to recognize revenue
    control_transferred = steps_1_to_4_met and (control_transfer_score >= 4 and customer_acceptance_signed)
    
    if control_transferred:
        revenue_recognized_cr = invoice_amount_cr
        audit_verdict = "REVENUE_RECOGNITION_COMPLIANT_IND_AS_115"
        adjustment_required_cr = 0.0
    else:
        revenue_recognized_cr = 0.0
        audit_verdict = "PREMATURE_REVENUE_RECOGNITION_REVERSAL_MANDATED"
        adjustment_required_cr = invoice_amount_cr
        
    return {
        "invoice_value_cr": invoice_amount_cr,
        "contract_steps_1_to_4_satisfied": steps_1_to_4_met,
        "control_transfer_indicators_met": f"{control_transfer_score} / 5",
        "customer_acceptance_on_record": customer_acceptance_signed,
        "allowable_revenue_cr": revenue_recognized_cr,
        "mandatory_audit_adjustment_cr": adjustment_required_cr,
        "audit_statutory_ruling": audit_verdict
    }

rev_audit = evaluate_indas115_revenue_recognition(
    has_enforceable_contract=True,
    performance_obligations_identified=True,
    transaction_price_fixed_or_determinable=True,
    price_allocated_to_obligations=True,
    customer_has_present_obligation_to_pay=True,
    legal_title_transferred=False,
    physical_possession_transferred=False,
    significant_risks_and_rewards_transferred=False,
    customer_acceptance_signed=False,
    invoice_amount_cr=25.0
)
print("Ind AS 115 5-Step Model Revenue Audit Engine:")
print(f"  Invoice Billed Amount  : INR {rev_audit['invoice_value_cr']} Crores")
print(f"  Contract Steps 1-4 Met : {rev_audit['contract_steps_1_to_4_satisfied']}")
print(f"  Control Indicators Met : {rev_audit['control_indicators_met']}")
print(f"  Customer Acceptance    : {rev_audit['customer_acceptance_on_record']}")
print(f"  Allowable Revenue      : INR {rev_audit['allowable_revenue_cr']} Crores")
print(f"  Audit Adjustment Needed: INR {rev_audit['mandatory_audit_adjustment_cr']} Crores")
print(f"  Audit Ruling           : {rev_audit['audit_statutory_ruling']}")
''',
            "tryIt": "Set physical_possession_transferred, legal_title_transferred, and customer_acceptance_signed to True to see the revenue recognized as fully compliant under Ind AS 115.",
            "check": {
                "question": "Under Ind AS 115 Step 5, what is the core legal principle that dictates when an entity is permitted to recognize revenue from the sale of goods?",
                "options": [
                    "When (or as) the entity satisfies a performance obligation by transferring control of a promised good or service to the customer",
                    "When the sales manager sends an email forecast to executive leadership",
                    "Immediately upon generating a pro-forma invoice in the accounting software",
                    "When the customer opens a corporate bank account"
                ],
                "answerIndex": 0,
                "why": "Ind AS 115 Paragraph 31 establishes that revenue is recognized when or as performance obligations are satisfied through the transfer of control of promised goods or services to the customer."
            }
        },
        {
            "title": "Channel Stuffing Analytics, Side Agreements & Bill-and-Hold Arrangements: SA 240",
            "say": [
                "Two of the most prevalent corporate revenue fraud schemes investigated by statutory and forensic auditors are Channel Stuffing and Sham Bill-and-Hold Arrangements. Under SA 240, auditors must deploy targeted substantive procedures to unmask these schemes, which are frequently orchestrated by sales executives facing quarterly bonus deadlines.",
                "Channel Stuffing is the fraudulent business practice of artificially inflating sales and earnings figures by deliberately shipping excess, unwanted products to distributors or downstream dealers late in the reporting period, accompanied by secret side agreements (side letters) granting the distributors the right to return unsold goods post-period with zero penalty, extended payment terms (e.g., 180 to 360 days), or guaranteed price concessions.",
                "Forensic auditors detect channel stuffing through quantitative velocity testing: (1) analyzing sales volume spikes in the final five trading days of the fiscal year; (2) computing dealer inventory holding days; (3) auditing credit notes issued in the first 60 days of the subsequent financial year (post-closing sales returns); and (4) reviewing confirmation exceptions where dealers report consignment terms.",
                "Concurrently, Bill-and-Hold Arrangements—where a customer is billed for goods but the entity retains physical possession—are legally prohibited from revenue recognition under Ind AS 115 unless ALL four of the following strict criteria are satisfied: (a) the reason for the bill-and-hold arrangement must be substantive (requested by customer for genuine storage/logistics reasons); (b) the product must be identified separately as belonging to the customer; (c) the product currently must be ready for physical transfer to the customer; and (d) the entity cannot have the ability to use the product or direct it to another customer."
            ],
            "example": "A consumer appliances manufacturer ships Rs 40 Crore in air conditioners to 12 regional wholesalers between March 26 and March 31, booking immediate revenue. The auditor performs a subsequent-period credit note audit under SA 240: in April and May, the manufacturer issued Rs 32 Crore in credit notes cancelling the March sales. The auditor inspects confidential email archives, uncovering side letters from the VP of Sales promising full return privileges, proving a classic channel stuffing fraud designed to manipulate year-end operating profit.",
            "code": '''def audit_channel_stuffing_and_bill_and_hold(
    q4_final_week_sales_cr: float,
    q4_weekly_average_sales_cr: float,
    subsequent_period_returns_cr: float,
    side_agreements_discovered: bool,
    bill_and_hold_sales_cr: float,
    customer_requested_bill_and_hold: bool,
    goods_segregated_and_ready: bool
) -> dict:
    red_flags = []
    
    # 1. Final Week Volume Surge Test
    surge_multiplier = q4_final_week_sales_cr / q4_weekly_average_sales_cr if q4_weekly_average_sales_cr > 0 else 1.0
    if surge_multiplier >= 3.0:
        red_flags.append(f"Abnormal Sales Surge: Final week revenue (INR {q4_final_week_sales_cr} Cr) is {surge_multiplier:.1f}x the quarterly weekly average")
        
    # 2. Subsequent Returns Test (Post-closing credit notes)
    return_rate_pct = (subsequent_period_returns_cr / q4_final_week_sales_cr) * 100.0 if q4_final_week_sales_cr > 0 else 0.0
    if return_rate_pct >= 25.0:
        red_flags.append(f"Excessive Subsequent Returns: INR {subsequent_period_returns_cr} Cr ({return_rate_pct:.1f}%) returned/reversed post-closing")
        
    # 3. Side Agreements
    if side_agreements_discovered:
        red_flags.append("Fraudulent Side Letters: Undisclosed return rights and extended payment terms granted outside master contracts")
        
    # 4. Bill and Hold Criteria (Ind AS 115)
    bill_and_hold_valid = customer_requested_bill_and_hold and goods_segregated_and_ready
    if bill_and_hold_sales_cr > 0 and not bill_and_hold_valid:
        red_flags.append(f"Invalid Bill-and-Hold: INR {bill_and_hold_sales_cr} Cr booked without satisfying Ind AS 115 substantive customer request criteria")
        
    total_fraudulent_revenue_cr = 0.0
    if side_agreements_discovered or return_rate_pct >= 25.0:
        total_fraudulent_revenue_cr += subsequent_period_returns_cr
    if bill_and_hold_sales_cr > 0 and not bill_and_hold_valid:
        total_fraudulent_revenue_cr += bill_and_hold_sales_cr
        
    is_channel_stuffing_proven = len(red_flags) >= 2
    
    return {
        "final_week_surge_ratio": round(surge_multiplier, 2),
        "post_closing_return_rate_pct": round(return_rate_pct, 1),
        "bill_and_hold_criteria_met": bill_and_hold_valid,
        "channel_stuffing_detected": is_channel_stuffing_proven,
        "total_revenue_reversal_mandated_cr": round(total_fraudulent_revenue_cr, 2),
        "forensic_audit_findings": red_flags
    }

cs_audit = audit_channel_stuffing_and_bill_and_hold(
    q4_final_week_sales_cr=40.0,
    q4_weekly_average_sales_cr=8.5, # 4.7x volume surge
    subsequent_period_returns_cr=32.0, # 80% return rate
    side_agreements_discovered=True,
    bill_and_hold_sales_cr=12.0,
    customer_requested_bill_and_hold=False,
    goods_segregated_and_ready=False
)
print("Forensic Channel Stuffing & Bill-and-Hold Diagnostic Engine:")
print(f"  Final Week Sales Surge : {cs_audit['final_week_surge_ratio']}x quarterly baseline")
print(f"  Post-Closing Return Pct: {cs_audit['post_closing_return_rate_pct']}%")
print(f"  Channel Stuffing Proven: {cs_audit['channel_stuffing_detected']}")
print(f"  Mandatory Rev Reversal : INR {cs_audit['total_revenue_reversal_mandated_cr']} Crores")
print("  Forensic Audit Flags   :")
for f in cs_audit['forensic_audit_findings']:
    print(f"    ! {f}")
''',
            "tryIt": "Set side_agreements_discovered to False, subsequent_period_returns_cr to 2.0 Cr, and customer_requested_bill_and_hold to True to observe the channel stuffing flags clear.",
            "check": {
                "question": "Under Ind AS 115, what four cumulative criteria must be satisfied before an entity is legally permitted to recognize revenue on a Bill-and-Hold transaction?",
                "options": [
                    "The arrangement must be substantive (requested by customer); product must be identified separately as customer's; product must be ready for transfer; and entity cannot use or redirect the product to another customer",
                    "The customer must pay in foreign currency within 3 days",
                    "The product must be insured with a government insurance provider",
                    "The sales invoice must be stamped by a notary public"
                ],
                "answerIndex": 0,
                "why": "Ind AS 115 Appendix B Paragraph B81 outlines the four mandatory criteria for bill-and-hold recognition: customer substantive request, separate identification, readiness for physical transfer, and inability to redirect goods."
            }
        },
        {
            "title": "Substantive Revenue Cut-Off Testing & E-Invoicing Real-Time Triangulation: SA 240",
            "say": [
                "Revenue Cut-Off Testing under SA 240 and SA 500 verifies that sales transactions and related cost of goods sold (COGS) are recorded in the correct accounting period. Cut-off errors—whether accidental administrative delays or deliberate earnings acceleration—distort both the Income Statement (revenue and gross margin) and Balance Sheet (trade receivables and inventory).",
                "The traditional substantive audit procedure for sales cut-off involves sampling sales invoices, shipping documents (Goods Dispatch Notes - GDN / Lorry Receipts - LR / Bills of Lading - BL), and inventory ledgers for a defined window: typically the last 15 days before the balance sheet date (March 16–31) and the first 15 days after the balance sheet date (April 1–15).",
                "In modern audited enterprise environments in India, the statutory auditor has access to an unalterable government data infrastructure: the GST E-Invoicing System and E-Way Bill Portal. Under Rule 48(4) of the CGST Rules, B2B invoices generate a 64-character cryptographic Invoice Reference Number (IRN) with microsecond timestamps. Under Rule 138, electronic waybills record transporter vehicle numbers and RFID toll plaza passes.",
                "Forensic auditors perform Real-Time Triangulation: matching ERP invoice posting dates against the IRP IRN generation timestamp, e-way bill generation date, and FASTag physical movement logs. If an enterprise books an invoice on March 31, but the government IRP timestamp shows the IRN was generated on April 4, or toll plaza RFID logs confirm the transport vehicle departed the factory on April 6, the auditor exposes a definitive statutory cut-off violation under SA 240."
            ],
            "example": "During a year-end cut-off audit, the team samples invoice INV-9941 for Rs 8.5 Crore recorded in the ERP on March 31. Triangulation against the government GST portal reveals that the IRP IRN was generated on April 3 at 2:15 PM, and the e-way bill was created on April 5 when the truck crossed the state border toll booth. The auditor forces management to reverse Rs 8.5 Crore of revenue and restore the inventory on the March 31 balance sheet.",
            "code": '''import datetime

def audit_real_time_revenue_cutoff_triangulation(
    sampled_invoices: list,
    balance_sheet_cutoff_date_str: str = "2026-03-31"
) -> dict:
    fmt = "%Y-%m-%d"
    d_cutoff = datetime.datetime.strptime(balance_sheet_cutoff_date_str, fmt)
    
    cutoff_exceptions = []
    
    for inv in sampled_invoices:
        d_erp = datetime.datetime.strptime(inv["erp_posting_date"], fmt)
        d_irn = datetime.datetime.strptime(inv["irp_irn_date"], fmt)
        d_gdn = datetime.datetime.strptime(inv["physical_dispatch_date"], fmt)
        
        # Check if booked in current year (<= cutoff) but real-world transfer occurred post-cutoff (> cutoff)
        is_booked_in_current_year = d_erp <= d_cutoff
        real_event_post_cutoff = d_irn > d_cutoff or d_gdn > d_cutoff
        
        if is_booked_in_current_year and real_event_post_cutoff:
            cutoff_exceptions.append({
                "invoice_id": inv["id"],
                "amount_cr": inv["amount_cr"],
                "erp_booked_date": inv["erp_posting_date"],
                "government_irn_date": inv["irp_irn_date"],
                "physical_movement_date": inv["physical_dispatch_date"],
                "days_accelerated": (d_gdn - d_erp).days,
                "audit_action": "REVERSE_FROM_CURRENT_YEAR_RESTORE_INVENTORY"
            })
            
    total_accelerated_revenue = sum(e["amount_cr"] for e in cutoff_exceptions)
    
    return {
        "invoices_sampled_count": len(sampled_invoices),
        "cutoff_violations_count": len(cutoff_exceptions),
        "total_accelerated_revenue_cr": round(total_accelerated_revenue, 2),
        "cutoff_audit_status": "MATERIAL_CUTOFF_MANIPULATION_DETECTED" if total_accelerated_revenue >= 5.0 else "MINOR_OR_CLEAN",
        "violations_list": cutoff_exceptions
    }

invoices = [
    {"id": "INV-101", "amount_cr": 8.5, "erp_posting_date": "2026-03-31", "irp_irn_date": "2026-04-03", "physical_dispatch_date": "2026-04-05"},
    {"id": "INV-102", "amount_cr": 4.2, "erp_posting_date": "2026-03-30", "irp_irn_date": "2026-03-30", "physical_dispatch_date": "2026-03-31"},
    {"id": "INV-103", "amount_cr": 6.8, "erp_posting_date": "2026-03-31", "irp_irn_date": "2026-04-02", "physical_dispatch_date": "2026-04-04"}
]

cutoff_res = audit_real_time_revenue_cutoff_triangulation(invoices)
print("SA 240 Real-Time Revenue Cut-Off Triangulation Engine:")
print(f"  Invoices Sampled       : {cutoff_res['invoices_sampled_count']}")
print(f"  Cut-Off Violations     : {cutoff_res['cutoff_violations_count']}")
print(f"  Accelerated Revenue    : INR {cutoff_res['total_accelerated_revenue_cr']} Crores")
print(f"  Audit Diagnostic Status: {cutoff_res['cutoff_audit_status']}")
print("  Accelerated Entries Identified:")
for v in cutoff_res['violations_list']:
    print(f"    * {v['invoice_id']} (INR {v['amount_cr']} Cr): Booked {v['erp_booked_date']} | Government IRN {v['government_irn_date']} | Dispatch {v['physical_movement_date']} ({v['days_accelerated']} days premature)")
''',
            "tryIt": "Modify INV-101 and INV-103 to have irp_irn_date='2026-03-31' and physical_dispatch_date='2026-03-31' to see cut-off violations drop to zero.",
            "check": {
                "question": "How does cross-referencing ERP sales dates with government E-Invoicing (IRP) timestamps and E-Way bill RFID logs enhance revenue cut-off testing under SA 240?",
                "options": [
                    "It provides unalterable third-party timestamped cryptographic evidence of when invoices were registered and when goods physically moved, exposing premature revenue recognition booked prior to actual shipment",
                    "It calculates road freight transport tax refunds for the trucking company",
                    "It reduces highway toll charges paid by the corporate vehicle fleet",
                    "It verifies that all transport truck drivers have valid commercial driver licenses"
                ],
                "answerIndex": 0,
                "why": "IRP timestamps and E-Way Bill RFID toll logs provide independent, immutable digital proof of actual dispatch dates, preventing management from backdating ERP revenue invoices to manipulate fiscal cut-offs."
            }
        },
        {
            "title": "Long-Term Construction Contracts & POCM Manipulation: Ind AS 115",
            "say": [
                "For infrastructure, engineering, real estate, and defense contracting corporations, revenue is recognized over time using the Percentage of Completion Method (POCM) under Ind AS 115. Revenue recognized in period t is calculated as: Cumulative Revenue = Cumulative Incurred Costs / Estimated Total Contract Costs * Total Transaction Price.",
                "POCM accounting is inherently susceptible to financial statement manipulation because 'Estimated Total Contract Costs' is a subjective management estimate. By artificially underestimating total costs to complete a multi-year project, corrupt management inflates the completion percentage, prematurely recognizing revenue and gross margins while concealing contract losses.",
                "Under SA 240 and SA 540 (Auditing Accounting Estimates), the statutory auditor must challenge and test management's engineering estimates: (1) inspecting project site logs and engineering milestone certificates; (2) testing cost accruals for unrecorded contractor bills; (3) comparing original project cost budgets against historical cost inflation trends across comparable projects; and (4) evaluating whether contracts are Onerous Contracts under Ind AS 37.",
                "Under Ind AS 115 and Ind AS 37, if total estimated contract costs exceed total contract revenue, the entire expected loss across the contract must be recognized as an immediate expense in the current period's P&L, regardless of the percentage of completion. Delaying the recognition of contract losses represents a severe fraud scheme."
            ],
            "example": "A civil construction company manages a Rs 500 Crore highway bridge contract. In Year 2, incurred costs reach Rs 200 Crore. Management estimates remaining costs to complete at Rs 100 Crore (Total Budget = Rs 300 Crore, Completion = 66.7%), booking Rs 333 Crore cumulative revenue. The auditor performs an independent engineering audit under SA 540: actual remaining steel and labor costs are Rs 380 Crore (Total Budget = Rs 580 Crore). Because total costs (Rs 580 Crore) exceed revenue (Rs 500 Crore), the project is an Onerous Contract. The auditor forces management to reverse the fictitious profit and book an immediate Rs 80 Crore provision for loss.",
            "code": '''def audit_pocm_construction_contract(
    contract_price_cr: float,
    costs_incurred_to_date_cr: float,
    management_estimated_cost_to_complete_cr: float,
    auditor_verified_cost_to_complete_cr: float,
    revenue_previously_recognized_cr: float
) -> dict:
    # 1. Management Position
    mgmt_total_costs = costs_incurred_to_date_cr + management_estimated_cost_to_complete_cr
    mgmt_pocm_pct = (costs_incurred_to_date_cr / mgmt_total_costs) * 100.0 if mgmt_total_costs > 0 else 0.0
    mgmt_cumulative_rev = contract_price_cr * (mgmt_pocm_pct / 100.0)
    mgmt_current_year_rev = mgmt_cumulative_rev - revenue_previously_recognized_cr
    
    # 2. Auditor Independent Assessment
    audit_total_costs = costs_incurred_to_date_cr + auditor_verified_cost_to_complete_cr
    is_onerous_contract = audit_total_costs > contract_price_cr
    
    if is_onerous_contract:
        # Mandatory immediate recognition of total anticipated loss under Ind AS 37 / Ind AS 115
        total_contract_loss_cr = audit_total_costs - contract_price_cr
        audit_pocm_pct = (costs_incurred_to_date_cr / audit_total_costs) * 100.0
        audit_cumulative_rev = contract_price_cr * (audit_pocm_pct / 100.0)
        audit_current_year_rev = audit_cumulative_rev - revenue_previously_recognized_cr
        onerous_loss_provision_cr = total_contract_loss_cr
    else:
        total_contract_loss_cr = 0.0
        audit_pocm_pct = (costs_incurred_to_date_cr / audit_total_costs) * 100.0
        audit_cumulative_rev = contract_price_cr * (audit_pocm_pct / 100.0)
        audit_current_year_rev = audit_cumulative_rev - revenue_previously_recognized_cr
        onerous_loss_provision_cr = 0.0
        
    revenue_overstatement_cr = mgmt_current_year_rev - audit_current_year_rev
    
    return {
        "contract_price_cr": contract_price_cr,
        "costs_incurred_to_date_cr": costs_incurred_to_date_cr,
        "mgmt_reported_total_cost_cr": round(mgmt_total_costs, 2),
        "audit_verified_total_cost_cr": round(audit_total_costs, 2),
        "mgmt_pocm_completion_pct": round(mgmt_pocm_pct, 1),
        "audit_verified_pocm_pct": round(audit_pocm_pct, 1),
        "is_contract_onerous": is_onerous_contract,
        "revenue_overstatement_cr": round(revenue_overstatement_cr, 2),
        "mandatory_onerous_loss_provision_cr": round(onerous_loss_provision_cr, 2),
        "audit_adjustment_required": f"Reduce Revenue by INR {revenue_overstatement_cr:.2f} Cr; Record Onerous Provision of INR {onerous_loss_provision_cr:.2f} Cr"
    }

pocm_audit = audit_pocm_construction_contract(
    contract_price_cr=500.0,
    costs_incurred_to_date_cr=200.0,
    management_estimated_cost_to_complete_cr=100.0, # Budget: Rs 300 Cr
    auditor_verified_cost_to_complete_cr=380.0,    # Real budget: Rs 580 Cr
    revenue_previously_recognized_cr=120.0
)
print("Ind AS 115 Percentage of Completion (POCM) Construction Contract Audit:")
print(f"  Contract Value         : INR {pocm_audit['contract_price_cr']} Crores")
print(f"  Incurred Costs to Date : INR {pocm_audit['costs_incurred_to_date_cr']} Crores")
print(f"  Mgmt vs Audit Total Cost: INR {pocm_audit['mgmt_reported_total_cost_cr']} Cr vs INR {pocm_audit['audit_verified_total_cost_cr']} Cr")
print(f"  Mgmt vs Audit POCM Pct : {pocm_audit['mgmt_pocm_completion_pct']}% vs {pocm_audit['audit_verified_pocm_pct']}%")
print(f"  Onerous Contract Status: {pocm_audit['is_contract_onerous']}")
print(f"  Revenue Overstatement  : INR {pocm_audit['revenue_overstatement_cr']} Crores")
print(f"  Onerous Loss Provision : INR {pocm_audit['mandatory_onerous_loss_provision_cr']} Crores")
print(f"  Mandated Audit Action  : {pocm_audit['audit_adjustment_required']}")
''',
            "tryIt": "Lower auditor_verified_cost_to_complete_cr to 120.0 Cr (total cost 320 Cr < 500 Cr contract price) to verify the contract is no longer onerous and calculate standard completion adjustments.",
            "check": {
                "question": "Under Ind AS 115 and Ind AS 37, what is the mandatory accounting and auditing treatment when total estimated costs on a long-term construction contract exceed total contract revenue?",
                "options": [
                    "The contract is an Onerous Contract, and the entire expected loss must be recognized as an immediate expense in the current period P&L, regardless of the percentage of completion",
                    "The loss can be capitalized as goodwill and amortized over 30 years",
                    "The contractor is permitted to hide the loss until final physical handover",
                    "The contract is transferred to the Ministry of Finance for direct settlement"
                ],
                "answerIndex": 0,
                "why": "Ind AS 115 and Ind AS 37 mandate that when it is probable that total contract costs will exceed total contract revenue, the expected loss must be recognized as an immediate expense in full, establishing an onerous contract provision."
            }
        },
        {
            "title": "Substantive Receivables Circularization & Dispute Aging Forensics: SA 505",
            "say": [
                "Trade Receivables circularization under SA 505 serves as the definitive substantive test verifying the existence, rights, and valuation of revenue transactions. Fictitious revenue schemes invariably leave telltale scars in the accounts receivable subledger: balances that never get collected, accounts that age indefinitely beyond commercial credit terms, and customers who refuse to confirm balances.",
                "In executing receivables circularization, the auditor must enforce strict procedural controls: (1) maintaining direct control over the preparation, mailing, and receipt of confirmation requests; (2) using positive 'blank' confirmations for major corporate accounts; (3) independently verifying customer mailing addresses, corporate email domains, and telephone numbers to ensure confirmations are not sent to employee-controlled PO boxes or dummy email accounts; and (4) performing mandatory alternative procedures for non-responses.",
                "For accounts where confirmations are returned with disputes or where customers fail to respond, the auditor must perform rigorous alternative substantive procedures: (a) vouching subsequent cash collections in bank statements post-balance sheet date; (b) inspecting customer purchase orders, signed bills of lading (BL), and proof of delivery (POD); and (c) performing Disputed Aging Analysis under Ind AS 109.",
                "Under Ind AS 109 (Financial Instruments), enterprises must provide for Expected Credit Losses (ECL) using a provision matrix based on historical default rates adjusted for forward-looking macroeconomic factors. In forensic audits, accounts overdue for more than 180 or 360 days where customers actively dispute invoice legitimacy must be evaluated for 100% specific impairment provisioning, preventing the balance sheet overstatement of defunct receivables."
            ],
            "example": "In auditing trade receivables of Rs 320 Crore, the team circularizes 45 positive confirmations. Five customers with balances totaling Rs 28 Crore reply disputing invoice validity, stating goods were never ordered or delivered. Management claims the balances are fully recoverable and provides no provision. The auditor inspects subsequent bank collections: zero cash was received from these five customers in the 90 days following year-end. The auditor mandates an immediate Rs 28 Crore impairment write-down under Ind AS 109, exposing fictitious billing.",
            "code": '''def audit_receivables_circularization_and_ecl(
    total_receivables_book_value_cr: float,
    circularized_sample_count: int,
    confirmed_clean_cr: float,
    confirmed_with_disputes_cr: float,
    non_responses_cr: float,
    subsequent_cash_collected_on_non_responses_cr: float,
    current_ecl_provision_booked_cr: float
) -> dict:
    # 1. Evaluate Disputed Balances (100% loss exposure if uncorroborated)
    disputed_exposure_cr = confirmed_with_disputes_cr
    
    # 2. Evaluate Non-responses (Exposed if subsequent cash collections are low)
    uncollected_non_responses_cr = non_responses_cr - subsequent_cash_collected_on_non_responses_cr
    uncollected_non_responses_cr = max(0.0, uncollected_non_responses_cr)
    
    # 3. Required ECL Provisioning under Ind AS 109
    required_ecl_provision_cr = disputed_exposure_cr + (uncollected_non_responses_cr * 0.50)
    
    ecl_shortfall_cr = required_ecl_provision_cr - current_ecl_provision_booked_cr
    requires_balance_sheet_adjustment = ecl_shortfall_cr > 0.50 # > 50 Lakh variance
    
    return {
        "total_receivables_portfolio_cr": total_receivables_book_value_cr,
        "sample_confirmed_clean_cr": confirmed_clean_cr,
        "confirmed_disputed_balance_cr": confirmed_with_disputes_cr,
        "non_response_uncollected_cr": round(uncollected_non_responses_cr, 2),
        "required_indas109_ecl_provision_cr": round(required_ecl_provision_cr, 2),
        "current_booked_provision_cr": current_ecl_provision_booked_cr,
        "ecl_provision_shortfall_cr": round(max(0.0, ecl_shortfall_cr), 2),
        "audit_determination": "SUBSTANTIVE_ECL_IMPAIRMENT_ADJUSTMENT_MANDATED" if requires_balance_sheet_adjustment else "ECL_PROVISION_ADEQUATE"
    }

ar_audit = audit_receivables_circularization_and_ecl(
    total_receivables_book_value_cr=320.0,
    circularized_sample_count=45,
    confirmed_clean_cr=185.0,
    confirmed_with_disputes_cr=28.0,
    non_responses_cr=45.0,
    subsequent_cash_collected_on_non_responses_cr=12.0,
    current_ecl_provision_booked_cr=5.0
)
print("SA 505 Receivables Circularization & Ind AS 109 ECL Forensics Engine:")
print(f"  Total Portfolio Value  : INR {ar_audit['total_receivables_portfolio_cr']} Crores")
print(f"  Confirmed Clean Balance: INR {ar_audit['sample_confirmed_clean_cr']} Crores")
print(f"  Disputed Balances      : INR {ar_audit['confirmed_disputed_balance_cr']} Crores")
print(f"  Uncollected Non-Resp   : INR {ar_audit['non_response_uncollected_cr']} Crores")
print(f"  Required Ind AS 109 ECL: INR {ar_audit['required_indas109_ecl_provision_cr']} Crores")
print(f"  Current Booked ECL     : INR {ar_audit['current_booked_provision_cr']} Crores")
print(f"  ECL Shortfall          : INR {ar_audit['ecl_provision_shortfall_cr']} Crores")
print(f"  Audit Ruling           : {ar_audit['audit_determination']}")
''',
            "tryIt": "Increase current_ecl_provision_booked_cr to 45.0 Cr to see the shortfall disappear and the audit determination update to ECL_PROVISION_ADEQUATE.",
            "check": {
                "question": "Under SA 505, what mandatory alternative audit procedures must the statutory auditor perform when a customer fails to reply to a positive accounts receivable confirmation request?",
                "options": [
                    "Vouch subsequent cash receipts in bank statements after year-end, inspect signed customer shipping documents (bills of lading/proof of delivery), and verify customer purchase orders",
                    "Forgive the customer's debt automatically and issue a clean audit report",
                    "Call the customer's receptionist on a personal cell phone without documentation",
                    "Assume the balance is 100% correct because silence implies consent"
                ],
                "answerIndex": 0,
                "why": "SA 505 Paragraph 12 mandates that for each non-response to positive confirmation requests, the auditor shall perform alternative audit procedures, such as examining subsequent cash receipts, shipping documentation, and sales orders."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day12_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day12_data.json successfully!")
