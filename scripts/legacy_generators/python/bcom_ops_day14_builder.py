import os
import sys

def get_day14_data():
    day = 14
    title = "Corporate Governance, Companies Act 2013 Compliance & Supply Chain Due Diligence"
    goal = "Master statutory corporate governance and regulatory compliance across supply chain operations: operationalizing Internal Financial Controls over Reporting (ICoFR) under Section 134/143 of the Companies Act 2013, auditing Related Party Transactions (Section 188) at arm's length, executing CARO 2020 statutory inventory physical verifications and bank hypothecation reconciliations, and enforcing ESG vendor human rights due diligence."
    minutes = 45
    recap = "On Days 11, 12, and 13, we mastered distribution physics: warehouse slotting, cold chain thermodynamics, and reverse circular economy networks. On Day 14, we examine the legal, fiduciary, and statutory scaffolding that underpins enterprise operations. Modern supply chains do not operate in a regulatory vacuum; procurement contracts, vendor relationships, and inventory valuations are subject to stringent corporate governance laws, statutory audit scrutiny, and anti-fraud mandates."

    parts = [
        {
            "title": "Statutory Governance Framework: Companies Act 2013 & Internal Financial Controls (ICoFR)",
            "say": [
                "Welcome to Day 14 of Operations and Supply Chain Management. In large-scale corporate enterprise, supply chain operations represent the single largest outflow of corporate cash. Between 50% and 70% of total enterprise revenue is expended on raw material procurement, logistics freight, sub-assembly contracting, and warehousing services. Consequently, corporate procurement and inventory management are prime targets for financial statement fraud, unauthorized vendor favoritism, kickback schemes, and inventory phantom asset inflation. To protect shareholder capital, modern corporate jurisprudence places supply chain operations under strict statutory governance.",
                "In India, the bedrock of statutory corporate governance is the Companies Act 2013. Under Section 134(5)(e) of the Act, the Board of Directors of every listed company is legally mandated to include a formal 'Directors' Responsibility Statement' in their annual report, explicitly stating that the company has laid down Internal Financial Controls (IFC) to be followed by the company, and that such internal financial controls are adequate and operating effectively. Furthermore, under Section 143(3)(i), the independent statutory auditor must issue an explicit audit opinion stating whether the company has adequate internal financial controls over financial reporting (ICoFR) in place and the operating effectiveness of such controls.",
                "In supply chain operations, Internal Financial Controls over Financial Reporting (ICoFR) govern the entire 'Procure-to-Pay' (P2P) and 'Order-to-Cash' (O2C) lifecycles. Crucial internal controls include: (1) Strict Segregation of Duties (SoD)—ensuring that the individual who creates a purchase requisition cannot approve the purchase order, and the warehouse associate who receives physical goods cannot authorize vendor invoice payments; (2) Three-Way Matching—an automated ERP control gate where payment is strictly blocked unless the Purchase Order, Receiving Goods Receipt Note (GRN), and Vendor Invoice match exactly on item description, quantity, and unit price within pre-approved micro-tolerance limits; and (3) Approved Vendor List (AVL) governance, prohibiting the issuance of purchase orders to unregistered vendors who have not undergone anti-money laundering and tax identification verification.",
                "A material weakness in supply chain internal controls carries catastrophic legal and executive consequences. If statutory auditors identify that inventory valuation spreadsheets lack access controls, or that warehouse managers can manually adjust inventory balances without dual-authorization sign-offs, the auditors are legally bound to issue a Qualified or Adverse Audit Opinion under Section 143. Such adverse findings trigger regulatory scrutiny by the National Financial Reporting Authority (NFRA) and the Securities and Exchange Board of India (SEBI), resulting in executive disqualification, severe civil fines, and immediate stock price collapse.",
                "Therefore, contemporary supply chain executives must operate as dual professionals: masters of logistics velocity and guardians of internal fiduciary controls. Automated WMS and ERP audit trails, cryptographic timestamp logs, and automated segregation-of-duties conflict checkers ensure that every procurement dollar and warehouse transaction complies fully with statutory governance standards."
            ],
            "example": "A major automotive components conglomerate with $800 million in annual procurement underwent a statutory ICoFR audit. The auditors discovered that within its casting division, plant procurement managers possessed ERP administrative privileges allowing them to simultaneously create purchase orders and release goods receipt notes without independent secondary approval. Over a 14-month period, a rogue manager routed $1.8 million in fraudulent tooling orders to a dormant shell entity registered under an associate's name. Because the company's internal controls failed to enforce Segregation of Duties and Three-Way Matching, statutory auditors issued an adverse ICoFR opinion. The board was forced to dismiss the division head, restate two years of audited financial statements, and settle with capital market regulators for $450,000 in penalties.",
            "code": """# Statutory Governance: Procure-to-Pay (P2P) Three-Way Match & Segregation of Duties (SoD) Engine
def audit_procurement_transaction_icofr(
    transaction_id: str,
    requisition_user_id: str,
    po_approver_user_id: str,
    receiving_user_id: str,
    invoice_approver_user_id: str,
    purchase_order: dict, # {'sku': str, 'qty': int, 'unit_price': float}
    goods_receipt_note: dict, # {'sku': str, 'qty_received': int}
    vendor_invoice: dict # {'sku': str, 'qty_billed': int, 'unit_price_billed': float}
) -> dict:
    violations = []
    
    # 1. Segregation of Duties (SoD) Audit
    # Rule A: Requisitioner cannot approve the PO
    if requisition_user_id == po_approver_user_id:
        violations.append("SOD_VIOLATION: Requisitioner cannot be PO Approver")
    # Rule B: Receiver cannot approve invoice payment
    if receiving_user_id == invoice_approver_user_id:
        violations.append("SOD_VIOLATION: Goods Receiver cannot authorize Invoice Payment")
    # Rule C: Single user cannot execute entire lifecycle
    unique_users = {requisition_user_id, po_approver_user_id, receiving_user_id, invoice_approver_user_id}
    if len(unique_users) < 3:
        violations.append("SOD_VIOLATION: Insufficient separation of authority (fewer than 3 independent users)")
        
    # 2. Automated Three-Way Matching Invariant
    # Matching Item SKU
    sku_match = (purchase_order["sku"] == goods_receipt_note["sku"] == vendor_invoice["sku"])
    if not sku_match:
        violations.append("THREE_WAY_MISMATCH: SKU inconsistency across PO, GRN, and Invoice")
        
    # Quantity Matching: Billed quantity cannot exceed received quantity or PO quantity
    qty_po = purchase_order["qty"]
    qty_grn = goods_receipt_note["qty_received"]
    qty_inv = vendor_invoice["qty_billed"]
    
    if qty_inv > qty_grn:
        violations.append(f"THREE_WAY_MISMATCH: Invoice billed qty ({qty_inv}) exceeds GRN received qty ({qty_grn})")
    if qty_inv > qty_po:
        violations.append(f"THREE_WAY_MISMATCH: Invoice billed qty ({qty_inv}) exceeds authorized PO qty ({qty_po})")
        
    # Price Matching: Invoiced unit price cannot exceed authorized PO unit price
    price_po = purchase_order["unit_price"]
    price_inv = vendor_invoice["unit_price_billed"]
    if price_inv > price_po:
        violations.append(f"THREE_WAY_MISMATCH: Invoiced price (${price_inv}) exceeds authorized PO price (${price_po})")
        
    is_icofr_compliant = len(violations) == 0
    disposition = "AUTHORIZED_FOR_PAYMENT" if is_icofr_compliant else "PAYMENT_BLOCKED_AUDIT_INVESTIGATION"
    
    return {
        "transaction_id": transaction_id,
        "is_compliant": is_icofr_compliant,
        "governance_status": "ICoFR_EFFECTIVE" if is_icofr_compliant else "MATERIAL_CONTROL_DEFICIENCY",
        "system_disposition": disposition,
        "identified_violations": violations
    }

# Test Transaction 1: Perfect SoD and exact 3-Way Match
tx1 = audit_procurement_transaction_icofr(
    transaction_id="TX-COMPLIANT-01",
    requisition_user_id="USER-ALICE", po_approver_user_id="USER-BOB-VP",
    receiving_user_id="USER-CHARLIE-DOCK", invoice_approver_user_id="USER-DAVE-FINANCE",
    purchase_order={"sku": "SKU-BEARING-6205", "qty": 500, "unit_price": 12.50},
    goods_receipt_note={"sku": "SKU-BEARING-6205", "qty_received": 500},
    vendor_invoice={"sku": "SKU-BEARING-6205", "qty_billed": 500, "unit_price_billed": 12.50}
)

# Test Transaction 2: SoD violation (same user approves PO and invoice) + Overbilling
tx2 = audit_procurement_transaction_icofr(
    transaction_id="TX-BREACH-02",
    requisition_user_id="USER-ROGUE", po_approver_user_id="USER-ROGUE", # SoD breach!
    receiving_user_id="USER-CHARLIE-DOCK", invoice_approver_user_id="USER-ROGUE", # SoD breach!
    purchase_order={"sku": "SKU-VALVE-DN50", "qty": 100, "unit_price": 85.00},
    goods_receipt_note={"sku": "SKU-VALVE-DN50", "qty_received": 80}, # Received only 80 units
    vendor_invoice={"sku": "SKU-VALVE-DN50", "qty_billed": 100, "unit_price_billed": 95.00} # Billed 100 @ $95!
)

print(f"[{tx1['transaction_id']}] Status: {tx1['governance_status']} -> {tx1['system_disposition']}")
print(f"[{tx2['transaction_id']}] Status: {tx2['governance_status']} -> {tx2['system_disposition']}")
for v in tx2['identified_violations']:
    print(f"  * {v}")
""",
            "output": """[TX-COMPLIANT-01] Status: ICoFR_EFFECTIVE -> AUTHORIZED_FOR_PAYMENT
[TX-BREACH-02] Status: MATERIAL_CONTROL_DEFICIENCY -> PAYMENT_BLOCKED_AUDIT_INVESTIGATION
  * SOD_VIOLATION: Requisitioner cannot be PO Approver
  * SOD_VIOLATION: Insufficient separation of authority (fewer than 3 independent users)
  * THREE_WAY_MISMATCH: Invoice billed qty (100) exceeds GRN received qty (80)
  * THREE_WAY_MISMATCH: Invoiced price ($95.0) exceeds authorized PO price ($85.0)""",
            "codeNotes": [
                {"line": 2, "note": "Implements statutory P2P internal financial controls (ICoFR) verification engine"},
                {"line": 13, "note": "Enforces strict Segregation of Duties (SoD) across requisition, PO, and invoice roles"},
                {"line": 25, "note": "Validates Three-Way Matching invariants across SKU, quantity, and unit price"},
                {"line": 40, "note": "Blocks automated payment authorization upon detecting control deficiency"}
            ],
            "tryIt": {
                "description": "Assess the critical function of Three-Way Matching in corporate supply chain governance.",
                "question": "In Transaction TX-BREACH-02 above, why was vendor payment blocked by the automated ICoFR engine?",
                "options": [
                    "Because the vendor sent the invoice via email rather than postal mail",
                    "Because the transaction committed multiple Segregation of Duties breaches, and the invoice billed for 100 units at $95.00 when only 80 units were physically received at an authorized PO price of $85.00",
                    "Because the company ran out of working capital cash",
                    "Because bearings are subject to export control tariffs"
                ],
                "answer": 1,
                "explanation": "The transaction violated core ICoFR controls: the same user initiated and approved the order (SoD breach), and the vendor overbilled both on quantity (billing 100 when only 80 arrived) and price ($95 vs $85 PO price). Automated Three-Way Matching immediately halted payment to prevent corporate fraud."
            }
        },
        {
            "title": "Related Party Transactions (Section 188) & Arm's Length Pricing Auditing",
            "say": [
                "Among the most heavily scrutinized areas in corporate governance is Related Party Transactions (RPT) in procurement and logistics contracting. A Related Party Transaction occurs when an enterprise enters into a commercial contract—such as purchasing raw materials, leasing warehouse space, or outsourcing freight logistics—with an entity connected to company directors, key managerial personnel (KMP), substantial shareholders, or holding/subsidiary affiliates. The inherent fiduciary risk in RPTs is self-dealing: an executive might direct lucrative corporate contracts to a logistics firm owned by their spouse or relative at inflated prices, siphoning corporate profits away from public shareholders.",
                "Under Section 188 of the Indian Companies Act 2013 and SEBI Listing Obligations and Disclosure Requirements (LODR) Regulations, corporate boards face rigorous statutory compliance mandates governing Related Party Transactions. Section 188 stipulates that no company shall enter into any contract or arrangement with a related party with respect to sale, purchase, or supply of any goods or materials, or leasing of property, or availing of services, EXCEPT with the prior approval of the Board of Directors and the Audit Committee.",
                "Crucially, the Act provides a critical statutory safe harbor: Section 188(1) explicitly states that board approval and shareholder voting mandates do not apply to transactions entered into by the company in its 'Ordinary Course of Business' conducted on an 'Arm's Length Basis'. An Arm's Length Transaction is defined under the Act as a transaction between two related parties that is conducted as if they were unrelated, so that there is no conflict of interest, and the pricing, payment terms, and delivery conditions match prevailing open-market competitive conditions.",
                "To prove Arm's Length Pricing to statutory auditors and regulatory authorities, supply chain procurement departments must deploy rigorous Transfer Pricing Benchmarking methodologies. These methodologies—standardized under the Income Tax Act 1961 (Section 92C) and OECD Transfer Pricing Guidelines—include the Comparable Uncontrolled Price (CUP) method, the Cost Plus Method (CPM), and the Transactional Net Margin Method (TNMM). For every related party logistics contract, procurement must maintain an unassailable audit dossier containing competing blind commercial bids from independent third-party carriers demonstrating that the related party's pricing is equal to or lower than market benchmarks.",
                "If a company enters into an RPT that is not at arm's length without prior Audit Committee pre-approval, the contract is statutorily voidable at the option of the Board. Furthermore, under Section 188(5), any director or employee who entered into such unauthorized contracts is punishable with imprisonment for a term up to one year, or a fine of up to ₹25 lakh (₹2,500,000), or both, accompanied by mandatory clawback of all ill-gotten financial gains."
            ],
            "example": "A listed pharmaceutical enterprise required cold storage warehousing services in Gujarat. The CEO's brother owned an industrial logistics park offering temperature-controlled warehousing. To ensure full compliance with Section 188, the corporate supply chain procurement team initiated a formal competitive Request for Proposal (RFP). Three independent logistics providers submitted verified commercial bids: Provider A quoted ₹420 per pallet/month, Provider B quoted ₹445, and Provider C quoted ₹410. The brother's facility submitted an arm's length quote of ₹395 per pallet/month with identical GDP-certified specifications. The procurement team compiled the CUP benchmarking dossier and presented it to the Independent Audit Committee. The Audit Committee granted formal pre-approval, documenting that the transaction was in the ordinary course of business, at arm's length, and saved the company ₹180,000 annually.",
            "code": """# Statutory Governance: Related Party Transaction (Section 188) Arm's Length Validator
def evaluate_related_party_procurement_contract(
    contract_id: str,
    vendor_id: str,
    vendor_name: str,
    is_related_party: bool,
    relationship_nature: str, # e.g. 'Director Relative', 'Subsidiary Entity', 'None'
    contract_value_inr: float,
    proposed_unit_price_inr: float,
    independent_market_bids: list[float], # Competing blind market quotes
    prior_audit_committee_approval: bool,
    material_threshold_inr: float = 10000000.0 # 1 Crore INR (Material RPT threshold under SEBI LODR)
) -> dict:
    # 1. Arm's Length Benchmark using Comparable Uncontrolled Price (CUP)
    min_market_price = min(independent_market_bids) if independent_market_bids else 0.0
    avg_market_price = sum(independent_market_bids) / len(independent_market_bids) if independent_market_bids else 0.0
    
    # Arm's length tolerance: proposed price cannot exceed minimum market price by more than 2%
    is_arms_length = proposed_unit_price_inr <= (min_market_price * 1.02)
    
    # 2. Materiality and Approval Gate
    is_material_rpt = contract_value_inr >= material_threshold_inr
    
    compliance_violations = []
    
    if is_related_party:
        if not prior_audit_committee_approval:
            compliance_violations.append("SECTION_188_VIOLATION: Related Party Transaction executed without prior Audit Committee approval")
            
        if not is_arms_length:
            variance_pct = round(((proposed_unit_price_inr - min_market_price) / min_market_price) * 100.0, 2)
            compliance_violations.append(f"ARMS_LENGTH_FAILURE: Proposed price (₹{proposed_unit_price_inr}) exceeds market minimum (₹{min_market_price}) by {variance_pct}%")
            
        if is_material_rpt and not prior_audit_committee_approval:
            compliance_violations.append("SEBI_LODR_REG_23_VIOLATION: Material RPT exceeds ₹10 Crore threshold requiring prior shareholder approval")
            
    is_fully_compliant = len(compliance_violations) == 0
    statutory_verdict = "SECTION_188_COMPLIANT_APPROVED" if is_fully_compliant else "ILLEGAL_UNAUTHORIZED_RPT_CONTRACT"
    
    return {
        "contract_id": contract_id,
        "vendor": vendor_name,
        "is_related_party": is_related_party,
        "contract_value_inr": contract_value_inr,
        "proposed_price": proposed_unit_price_inr,
        "market_benchmark_min": min_market_price,
        "market_benchmark_avg": round(avg_market_price, 2),
        "is_arms_length": is_arms_length,
        "audit_committee_approved": prior_audit_committee_approval,
        "compliance_status": statutory_verdict,
        "statutory_violations": compliance_violations
    }

# Contract A: Director's relative with Audit Committee approval and competitive market price
contract_a = evaluate_related_party_procurement_contract(
    contract_id="RPT-LOG-01", vendor_id="V-REL-101", vendor_name="Suraksha Cold Storage Pvt Ltd",
    is_related_party=True, relationship_nature="Director Brother Enterprise",
    contract_value_inr=4500000.0, proposed_unit_price_inr=395.0, # Below market!
    independent_market_bids=[410.0, 420.0, 445.0],
    prior_audit_committee_approval=True
)

# Contract B: Key executive affiliate with no approval and 25% price inflation
contract_b = evaluate_related_party_procurement_contract(
    contract_id="RPT-LOG-02", vendor_id="V-REL-102", vendor_name="Apex Global Freight LLP",
    is_related_party=True, relationship_nature="CFO Subsidiary Affiliate",
    contract_value_inr=15000000.0, proposed_unit_price_inr=550.0, # Inflated!
    independent_market_bids=[420.0, 430.0, 440.0],
    prior_audit_committee_approval=False
)

print(f"[{contract_a['contract_id']}] {contract_a['vendor']}: Verdict -> {contract_a['compliance_status']}")
print(f"[{contract_b['contract_id']}] {contract_b['vendor']}: Verdict -> {contract_b['compliance_status']}")
for v in contract_b['statutory_violations']:
    print(f"  * {v}")
""",
            "output": """[RPT-LOG-01] Suraksha Cold Storage Pvt Ltd: Verdict -> SECTION_188_COMPLIANT_APPROVED
[RPT-LOG-02] Apex Global Freight LLP: Verdict -> ILLEGAL_UNAUTHORIZED_RPT_CONTRACT
  * SECTION_188_VIOLATION: Related Party Transaction executed without prior Audit Committee approval
  * ARMS_LENGTH_FAILURE: Proposed price (₹550.0) exceeds market minimum (₹420.0) by 30.95%
  * SEBI_LODR_REG_23_VIOLATION: Material RPT exceeds ₹10 Crore threshold requiring prior shareholder approval""",
            "codeNotes": [
                {"line": 2, "note": "Implements Section 188 Companies Act 2013 Related Party Transaction evaluator"},
                {"line": 14, "note": "Applies Comparable Uncontrolled Price (CUP) benchmarking against market quotes"},
                {"line": 22, "note": "Verifies mandatory prior Audit Committee pre-approval for related party transactions"},
                {"line": 29, "note": "Enforces SEBI LODR Regulation 23 material transaction threshold governance"}
            ],
            "tryIt": {
                "description": "Assess the legal requirements for a related party transaction to qualify for the safe harbor under Section 188.",
                "question": "Under Section 188(1) of the Indian Companies Act 2013, what two essential criteria must be satisfied simultaneously for an operational supply chain contract with a related party to qualify for exemption from board voting restrictions?",
                "options": [
                    "The contract must be paid in foreign currency and executed outside India",
                    "The transaction must be entered into in the Ordinary Course of Business AND conducted on an Arm's Length Basis",
                    "The contract must be signed by the junior warehouse associate rather than a director",
                    "The transaction value must be exactly zero"
                ],
                "answer": 1,
                "explanation": "Section 188(1) second proviso explicitly establishes that board approval and shareholder voting mandates do not apply if the transaction is entered into by the company in its 'ordinary course of business' and on an 'arm's length basis' (demonstrating competitive market pricing and terms)."
            }
        },
        {
            "title": "Statutory Physical Inventory Verification: CARO 2020 Reporting & Bank Hypothecation",
            "say": [
                "In financial accounting, inventory is typically the single largest current asset on an enterprise balance sheet. Because inventory directly impacts Cost of Goods Sold (COGS) and Gross Profit, any fraudulent inflation of inventory quantities or valuation artificially inflates reported corporate earnings. To protect capital markets and institutional lenders, the Ministry of Corporate Affairs (MCA) enforces the Companies (Auditor’s Report) Order, universally known as CARO 2020.",
                "Under Clause 3(ii) of CARO 2020, statutory auditors face strict, non-negotiable reporting duties regarding physical inventory verification. The order requires the auditor to explicitly report: (a) Whether physical verification of inventory has been conducted at reasonable intervals by the management; (b) Whether, in the opinion of the auditor, the coverage and procedure of such verification by the management is appropriate; (c) Whether any discrepancies of 10% or more in the aggregate for each class of inventory were noticed and if so, whether they have been properly dealt with in the books of account.",
                "The 10% Discrepancy Materiality Rule represents a major statutory audit flashpoint. In traditional accounting, minor 0.5% inventory shrinkage was routinely written off into miscellaneous operating expenses without fanfare. Under CARO 2020, if physical inventory verification reveals that discrepancies in raw materials, work-in-progress, or finished goods equal or exceed 10% of total class value, the auditor MUST formally disclose this failure in the public audit report, detailing the precise monetary magnitude and management's reconciliation accounting.",
                "Furthermore, CARO 2020 Clause 3(ii)(b) introduced a revolutionary governance mandate regarding Working Capital Bank Borrowings. Most manufacturing and trading corporations finance their inventory and receivables through revolving working capital credit facilities (such as Cash Credit - CC or Working Capital Demand Loans - WCDL) secured by hypothecation of current assets. Historically, companies routinely submitted inflated 'Monthly Stock Statements' to banks to artificially boost their Drawing Power (DP), while submitting lower, conservative inventory figures in audited quarterly financial statements.",
                "From an internal auditing and IT systems integration perspective, reconciling inventory records for CARO 2020 compliance requires real-time data bridges between shop-floor WMS databases and general ledger ERP financial modules. When physical counts reveal shrinkage or damage, inventory controllers must immediately post discrepancy write-downs into appropriate general ledger scrap accounts rather than parking unresolved variances in suspense balance sheet accounts. Maintaining continuous automated inventory reconciliations with bank drawing power statements ensures that executive leadership can sign off on statutory audit schedules with complete confidence, eliminating the risk of embarrassing public audit qualifications or sudden debt facility freezes.",
                "Under CARO 2020, if a company has sanctioned working capital limits exceeding ₹5 crore (₹50,000,000) from banks or financial institutions on the basis of security of current assets, the statutory auditor must verify and report whether the quarterly returns or stock statements submitted by the company to banks are in agreement with the books of account of the company. Any material variance between bank stock statements and general ledger books must be disclosed in the audit report, immediately triggering bank loan recall or punitive credit downgrades."
            ],
            "example": "A mid-sized textile manufacturing enterprise with a ₹35 crore working capital credit facility from a consortium of public sector banks underwent statutory year-end audit under CARO 2020. During quarterly stock verification, the company submitted a stock statement to the lead bank claiming ₹28.5 crore in cotton yarn inventory to maintain maximum Drawing Power. However, physical inventory verification by statutory auditors revealed actual physical stock of only ₹24.2 crore (a 15.1% discrepancy exceeding the 10% statutory threshold). Under CARO 2020 Clause 3(ii)(b), the auditor reported the ₹4.3 crore variance in the public audit report. The bank immediately froze the company's credit line, demanded ₹4.3 crore in immediate loan margin repayment, and imposed a 2% punitive interest surcharge for covenant breach.",
            "code": """# Statutory Audit: CARO 2020 Clause 3(ii) Inventory Verification & Bank Statement Reconciler
def audit_caro_2020_inventory_compliance(
    company_name: str,
    inventory_classes: dict, # {'Raw_Materials': {'book_val': float, 'phys_val': float}, ...}
    quarterly_bank_stock_statement_val: float,
    working_capital_limit_sanctioned: float,
    threshold_limit_caro_inr: float = 50000000.0 # 5 Crore INR statutory threshold
) -> dict:
    discrepancy_findings = []
    has_material_10pct_discrepancy = False
    total_book_value = 0.0
    total_physical_value = 0.0
    
    # 1. Clause 3(ii)(a): 10% Discrepancy per Class Audit
    for cls_name, vals in inventory_classes.items():
        book = vals["book_val"]
        phys = vals["phys_val"]
        total_book_value += book
        total_physical_value += phys
        
        diff = abs(book - phys)
        diff_pct = (diff / book * 100.0) if book > 0 else 0.0
        
        if diff_pct >= 10.0:
            has_material_10pct_discrepancy = True
            discrepancy_findings.append({
                "class": cls_name,
                "book_value_inr": book,
                "physical_value_inr": phys,
                "variance_inr": round(diff, 2),
                "variance_pct": round(diff_pct, 2),
                "caro_statutory_breach": True
            })
            
    # 2. Clause 3(ii)(b): Bank Statement vs Book Reconciliation
    is_clause_b_applicable = working_capital_limit_sanctioned >= threshold_limit_caro_inr
    bank_book_variance_inr = abs(quarterly_bank_stock_statement_val - total_book_value)
    bank_variance_pct = (bank_book_variance_inr / total_book_value * 100.0) if total_book_value > 0 else 0.0
    
    bank_statement_compliant = (bank_variance_pct < 2.0) # Within 2% acceptable reconciliation tolerance
    
    # Statutory Auditor's Opinion
    caro_adverse_qualification = has_material_10pct_discrepancy or (is_clause_b_applicable and not bank_statement_compliant)
    
    return {
        "company": company_name,
        "total_book_value_inr": round(total_book_value, 2),
        "total_physical_value_inr": round(total_physical_value, 2),
        "has_10pct_inventory_breach": has_material_10pct_discrepancy,
        "class_discrepancy_details": discrepancy_findings,
        "bank_limit_sanctioned_inr": working_capital_limit_sanctioned,
        "bank_stock_statement_inr": quarterly_bank_stock_statement_val,
        "bank_book_delta_inr": round(bank_book_variance_inr, 2),
        "bank_delta_pct": round(bank_variance_pct, 2),
        "clause_3iib_compliant": bank_statement_compliant,
        "caro_2020_audit_qualification_required": caro_adverse_qualification,
        "auditor_report_opinion": "QUALIFIED_ADVERSE_REPORTING_MANDATED" if caro_adverse_qualification else "UNQUALIFIED_CLEAN_COMPLIANCE"
    }

# Company with 6 Crore working capital limit (exceeds 5 Cr threshold)
inv_data = {
    "Raw_Materials": {"book_val": 15000000.0, "phys_val": 14850000.0}, # 1.0% diff (Clean)
    "Finished_Goods": {"book_val": 22000000.0, "phys_val": 19200000.0} # 12.7% diff! (> 10% CARO Breach!)
}

audit_report = audit_caro_2020_inventory_compliance(
    company_name="Vardhman Precision Textiles Ltd",
    inventory_classes=inv_data,
    quarterly_bank_stock_statement_val=42000000.0, # Bank statement claimed 4.2 Cr vs Book 3.7 Cr!
    working_capital_limit_sanctioned=60000000.0 # 6 Crore limit
)

print(f"[{audit_report['company']}] CARO 2020 Statutory Audit Evaluation:")
print(f"  Auditor Report Opinion: {audit_report['auditor_report_opinion']}")
print(f"  10% Class Discrepancy Breach: {audit_report['has_10pct_inventory_breach']}")
for d in audit_report['class_discrepancy_details']:
    print(f"    * {d['class']}: Book ₹{d['book_value_inr']:,.0f} vs Phys ₹{d['physical_value_inr']:,.0f} (Variance: {d['variance_pct']}%)")
print(f"  Bank Stock Statement Delta: ₹{audit_report['bank_book_delta_inr']:,.0f} ({audit_report['bank_delta_pct']}%) -> Compliant: {audit_report['clause_3iib_compliant']}")
""",
            "output": """[Vardhman Precision Textiles Ltd] CARO 2020 Statutory Audit Evaluation:
  Auditor Report Opinion: QUALIFIED_ADVERSE_REPORTING_MANDATED
  10% Class Discrepancy Breach: True
    * Finished_Goods: Book ₹22,000,000 vs Phys ₹19,200,000 (Variance: 12.73%)
  Bank Stock Statement Delta: ₹5,000,000 (13.51%) -> Compliant: False""",
            "codeNotes": [
                {"line": 2, "note": "Implements MCA CARO 2020 Clause 3(ii) statutory audit verification engine"},
                {"line": 16, "note": "Checks each inventory class against the strict 10% statutory discrepancy threshold"},
                {"line": 29, "note": "Audits quarterly bank stock statements against internal books for > ₹5 Cr credit limits"},
                {"line": 34, "note": "Mandates formal statutory audit qualification in annual public financial statements"}
            ],
            "tryIt": {
                "description": "Assess the reporting duty of statutory auditors under CARO 2020 when inventory discrepancies exceed 10%.",
                "question": "Under Clause 3(ii) of CARO 2020, what is the statutory auditor legally required to do if physical verification reveals a 12.73% discrepancy between book inventory and physical stock in Finished Goods?",
                "options": [
                    "Quietly delete the inventory records and ignore the discrepancy",
                    "Explicitly report the material discrepancy in the public CARO 2020 audit report and state whether it has been properly dealt with in the books of account",
                    "Instruct the warehouse manager to work overtime to produce missing units",
                    "File an immediate criminal case with the local police station"
                ],
                "answer": 1,
                "explanation": "CARO 2020 Clause 3(ii)(a) explicitly mandates that if discrepancies of 10% or more in the aggregate for each class of inventory are noticed during physical verification, the statutory auditor MUST disclose this fact in their formal audit report and detail how management has accounted for the variance."
            }
        },
        {
            "title": "Supply Chain Human Rights, ESG Due Diligence & Vendor Code of Conduct Audits",
            "say": [
                "In modern multinational commerce, statutory corporate governance extends far beyond internal balance sheets to encompass the ethical, environmental, and human rights conduct of upstream supply chain partners. Over the past decade, sweeping international legislation—including the European Union Corporate Sustainability Due Diligence Directive (CSDDD), the German Supply Chain Due Diligence Act (LkSG), the US Uyghur Forced Labor Prevention Act (UFLPA), and the UK Modern Slavery Act—has imposed strict legal liability on corporations for human rights violations and environmental crimes committed by Tier-1 and Tier-2 suppliers.",
                "Under these statutory due diligence frameworks, an enterprise can no longer defend itself by claiming: 'We did not know our overseas supplier was using forced child labor or dumping toxic dye into local rivers.' The law imposes a proactive 'Duty of Care' requiring multinational enterprises to establish comprehensive Supply Chain Due Diligence Management Systems.",
                "A robust supply chain due diligence architecture is built upon three operational pillars: (1) The Vendor Code of Conduct (VCoC)—a legally binding contractual addendum signed by all suppliers prohibiting forced labor, child labor, excessive working hours, discrimination, and unsafe occupational health conditions; (2) Multi-Tier Risk Mapping—using geospatial and trade database analytics to identify suppliers operating in high-risk geographic jurisdictions or high-risk commodity sectors (such as cobalt mining, cotton cultivation, and palm oil plantations); and (3) Unannounced On-Site Social and Environmental Audits.",
                "To ensure auditing credibility, global supply chains rely on standardized social audit frameworks, such as the Sedex Members Ethical Trade Audit (SMETA 4-Pillar) and Social Accountability 8000 (SA8000). Certified independent auditors inspect factory working conditions, interview shop-floor workers in private without supervisory presence, examine payroll records for minimum statutory wage compliance, and verify occupational safety certifications (such as emergency fire exits and machine emergency stop interlocks).",
                "From a contract law and commercial risk allocation standpoint, multinational enterprises incorporate explicit ESG Indemnification Clauses into standard master vendor agreements. These clauses stipulate that any regulatory fines, customs import seizure losses, or legal defense costs incurred by the buyer as a result of the vendor's non-compliance with child labor, human rights, or environmental statutes must be fully indemnified by the vendor. In addition, procurement departments maintain an unalterable digital repository of environmental consent-to-operate (CTO) permits, hazardous waste manifest records, and local labor department inspection certificates for all Tier-1 and critical Tier-2 sub-contractors, subjecting supplier master files to mandatory annual re-certification.",
                "If an audit reveals a 'Zero-Tolerance Non-Compliance'—such as verified child labor or locked fire escape doors—the enterprise must initiate immediate contractual sanctions. Under advanced ESG governance protocols, rather than immediately terminating the supplier (which might throw vulnerable workers into deeper poverty), the buyer enforces a Corrective Action Plan (CAP) with a strict 30-to-60-day remediation window and financial support for remediation. If the supplier refuses to remediate, the enterprise executes mandatory contract termination and reports the vendor to global compliance sanction registries."
            ],
            "example": "A European apparel retail conglomerate sourcing garments from 120 factories across South Asia faced audit scrutiny under the German Supply Chain Due Diligence Act (LkSG). During an unannounced SMETA audit of a Tier-1 textile processing mill in Bangladesh, auditors uncovered two critical non-compliances: workers were coerced into working 80 hours per week exceeding the statutory 60-hour legal ceiling, and industrial chemical wastewater was being discharged into a local canal without passing through the required Effluent Treatment Plant (ETP). The European retailer immediately issued a formal LkSG Default Notice, freezing 20% of invoice payments pending compliance. Under the mandatory 45-day Corrective Action Plan, the mill installed continuous flow meters on its ETP and hired an additional shift of 45 workers to compress weekly hours to 54. The mill achieved full recertification, avoiding a 2% global turnover fine for the European retailer.",
            "code": """# ESG Due Diligence: Vendor Code of Conduct (VCoC) Social & Environmental Audit Scorer
def evaluate_vendor_esg_due_diligence_audit(
    vendor_id: str,
    vendor_name: str,
    tier_level: int, # 1 = Direct Tier-1, 2 = Upstream Sub-Supplier
    audit_findings: list[dict] # list of {'category': str, 'issue': str, 'severity': str}
) -> dict:
    severity_weights = {
        'ZERO_TOLERANCE': 100.0, # Immediate shutdown / legal breach (e.g. child labor, forced labor)
        'CRITICAL': 25.0,        # Severe safety hazard, toxic discharge, major wage theft
        'MAJOR': 10.0,           # Excessive overtime, missing PPE, improper waste labeling
        'MINOR': 2.0             # Cosmetic record-keeping lapses, expired fire extinguisher tag
    }
    
    total_penalty_score = 0.0
    zero_tolerance_count = 0
    critical_count = 0
    remediation_actions = []
    
    for finding in audit_findings:
        sev = finding["severity"]
        penalty = severity_weights.get(sev, 5.0)
        total_penalty_score += penalty
        
        if sev == 'ZERO_TOLERANCE':
            zero_tolerance_count += 1
            remediation_actions.append(f"IMMEDIATE_ACTION: {finding['issue']} -> Mandatory factory freeze & 14-day human rights rescue remediation")
        elif sev == 'CRITICAL':
            critical_count += 1
            remediation_actions.append(f"CRITICAL_CAP_30D: {finding['issue']} -> 30-day Corrective Action Plan with escrow hold")
        elif sev == 'MAJOR':
            remediation_actions.append(f"MAJOR_CAP_60D: {finding['issue']} -> 60-day process remediation")
            
    # ESG Audit Score (Base 100 - Penalties, bounded between 0 and 100)
    final_esg_score = max(0.0, 100.0 - total_penalty_score)
    
    # Statutory Vendor Rating
    if zero_tolerance_count > 0:
        status = "SUSPENDED_ZERO_TOLERANCE_BREACH"
        procurement_eligibility = "DISQUALIFIED_FROM_PURCHASE_ORDERS"
    elif final_esg_score < 70.0 or critical_count >= 2:
        status = "HIGH_RISK_CONDITIONAL_PROBATION"
        procurement_eligibility = "CONDITIONAL_APPROVAL_PENDING_REAUDIT"
    elif final_esg_score < 85.0:
        status = "ACCEPTABLE_CONTINUOUS_IMPROVEMENT"
        procurement_eligibility = "APPROVED_TIER_SUPPLIER"
    else:
        status = "ESG_EXEMPLAR_CERTIFIED"
        procurement_eligibility = "PREFERRED_PARTNER_LONG_TERM_CONTRACT"
        
    return {
        "vendor_id": vendor_id,
        "vendor_name": vendor_name,
        "tier": f"Tier-{tier_level}",
        "audit_findings_count": len(audit_findings),
        "zero_tolerance_breaches": zero_tolerance_count,
        "critical_breaches": critical_count,
        "final_esg_score": round(final_esg_score, 1),
        "esg_governance_rating": status,
        "procurement_status": procurement_eligibility,
        "corrective_action_roadmap": remediation_actions
    }

# Audit 1: High-performing supplier with minor record-keeping lapse
vendor_1 = evaluate_vendor_esg_due_diligence_audit(
    vendor_id="V-ESG-101", vendor_name="GreenSpin Sustainable Yarns Ltd", tier_level=1,
    audit_findings=[
        {"category": "SAFETY", "issue": "Expired inspection tag on secondary emergency exit door", "severity": "MINOR"},
        {"category": "ENVIRONMENT", "issue": "Sludge storage area lacks secondary containment berm", "severity": "MAJOR"}
    ]
)

# Audit 2: High-risk factory with critical effluent violation and locked fire exits
vendor_2 = evaluate_vendor_esg_due_diligence_audit(
    vendor_id="V-ESG-102", vendor_name="Apex Dyeing & Chemical Wash Mills", tier_level=2,
    audit_findings=[
        {"category": "HUMAN_RIGHTS", "issue": "Overtime exceeds 75 hours/week without overtime premium wage", "severity": "CRITICAL"},
        {"category": "SAFETY", "issue": "Emergency fire escape locked from outside during production shift", "severity": "CRITICAL"},
        {"category": "ENVIRONMENT", "issue": "Untreated chemical dye wastewater discharge directly to river", "severity": "CRITICAL"}
    ]
)

print(f"[{vendor_1['vendor_name']}] ESG Score: {vendor_1['final_esg_score']}/100 | Status: {vendor_1['esg_governance_rating']} -> {vendor_1['procurement_status']}")
print(f"[{vendor_2['vendor_name']}] ESG Score: {vendor_2['final_esg_score']}/100 | Status: {vendor_2['esg_governance_rating']} -> {vendor_2['procurement_status']}")
for act in vendor_2['corrective_action_roadmap']:
    print(f"  * {act}")
""",
            "output": """[GreenSpin Sustainable Yarns Ltd] ESG Score: 88.0/100 | Status: ESG_EXEMPLAR_CERTIFIED -> PREFERRED_PARTNER_LONG_TERM_CONTRACT
[Apex Dyeing & Chemical Wash Mills] ESG Score: 25.0/100 | Status: HIGH_RISK_CONDITIONAL_PROBATION -> CONDITIONAL_APPROVAL_PENDING_REAUDIT
  * CRITICAL_CAP_30D: Overtime exceeds 75 hours/week without overtime premium wage -> 30-day Corrective Action Plan with escrow hold
  * CRITICAL_CAP_30D: Emergency fire escape locked from outside during production shift -> 30-day Corrective Action Plan with escrow hold
  * CRITICAL_CAP_30D: Untreated chemical dye wastewater discharge directly to river -> 30-day Corrective Action Plan with escrow hold""",
            "codeNotes": [
                {"line": 2, "note": "Implements ESG supply chain due diligence audit scoring engine (SMETA aligned)"},
                {"line": 8, "note": "Defines weighted penalties across Zero-Tolerance, Critical, Major, and Minor tiers"},
                {"line": 34, "note": "Automatically suspends procurement eligibility for zero-tolerance human rights breaches"},
                {"line": 36, "note": "Places suppliers with multiple critical findings on probation with 30-day CAP mandates"}
            ],
            "tryIt": {
                "description": "Evaluate the operational response to critical environmental and human rights non-compliances in supply chains.",
                "question": "In the ESG audit above, why was Apex Dyeing & Chemical Wash Mills placed on HIGH_RISK_CONDITIONAL_PROBATION rather than receiving full procurement approval?",
                "options": [
                    "Because the factory was located in a different time zone",
                    "Because it accumulated 3 critical violations (unpaid 75hr overtime, locked fire exits, untreated wastewater discharge), slashing its ESG score to 25/100 and triggering mandatory corrective action plans",
                    "Because its fabric prices were too low",
                    "Because it lacked ISO 9001 marketing materials"
                ],
                "answer": 1,
                "explanation": "Accumulating three critical violations (severe wage theft, locked fire escape life-safety hazard, and illegal wastewater pollution) slashed the supplier's score to 25/100, violating statutory supply chain due diligence laws and triggering mandatory 30-day corrective action probation."
            }
        },
        {
            "title": "Integrated Anti-Bribery Compliance, FCPA/PCA & Whistleblower Red-Flag Investigation",
            "say": [
                "The ultimate pillar of supply chain corporate governance is Anti-Bribery, Anti-Corruption, and Whistleblower Protection. In global logistics and cross-border trade, operations intersect constantly with government customs officers, port harbor masters, municipal building inspectors, and tax officials. The operational pressure to expedite shipments often tempts unethical personnel to pay 'Facilitation Payments' or outright bribes to accelerate customs clearances, bypass quarantine inspections, or secure government procurement tenders.",
                "Such corrupt practices violate stringent extraterritorial anti-corruption statutes, foremost among them the US Foreign Corrupt Practices Act (FCPA), the UK Bribery Act 2010, and India's Prevention of Corruption (Amendment) Act 2018 (PCA). Under the FCPA and UK Bribery Act, a corporation is held criminally liable not only for bribes paid directly by its own employees, but also for corrupt payments made by third-party intermediaries—including customs freight brokers, clearing and forwarding (C&F) agents, and distributor networks. The legal standard is strict: a company cannot insulate itself by outsourcing customs clearance to a third-party agent and looking the other way.",
                "To mitigate extraterritorial criminal liability, corporate legal and supply chain compliance teams implement Automated Corruption Red-Flag Detection Engines. These algorithms scan procurement payment streams, vendor master data, and freight customs invoices for characteristic fraud anomalies: round-dollar invoice amounts (e.g. ₹5,00,000 or $10,000 exactly), vague billing descriptions (e.g. 'special customs facilitation fee', 'government administrative liaison charges', or 'urgent port expediting surcharge'), offshore bank accounts in tax havens with zero commercial connection to the shipping route, and vendor address matches against employee residential records.",
                "Simultaneously, under Section 177 of the Indian Companies Act 2013 and SEBI corporate governance norms, every listed company must establish a robust 'Vigil Mechanism' (Whistleblower Hotline). The whistleblower architecture must provide secure, anonymous channels for factory workers, truck drivers, and procurement associates to report corrupt demands, procurement kickbacks, or regulatory cover-ups without fear of retaliation.",
                "To ensure forensic non-repudiation, enterprise compliance monitoring systems maintain tamper-evident event streaming pipelines. Any attempt by a corrupt insider to delete payment logs, alter vendor bank routing codes, or backdate compliance sign-offs triggers an instantaneous automated notification to the Chief Compliance Officer (CCO) and the Chairman of the Audit Committee. Furthermore, third-party freight intermediaries are subjected to mandatory periodic forensic book inspections where compliance officers verify that customs duty payments match official government treasury receipts down to the exact rupee, ensuring that corporate funds are never funneled into illicit facilitation payments or slush funds.",
                "When a high-priority whistleblower complaint is logged, the WMS and ERP compliance engine initiates an automated Forensic Triage Protocol: instantly preserving immutable system audit logs, locking user editing privileges, sequestering associated bank wire transfers, and routing the incident directly to the Board Audit Committee and external independent forensic counsel. By embedding automated anti-corruption defenses into daily operational execution, corporate enterprises protect their global operating licenses and maintain the highest standards of corporate integrity."
            ],
            "example": "A multinational medical equipment distributor shipping diagnostic MRI scanners into emerging markets engaged a local third-party customs clearing agent. During an internal audit, the automated compliance monitoring engine flagged two invoices submitted by the agent: an invoice for $24,500 labeled 'Special Expediting Protocol for Port Authority Health Clearance' and a $15,000 invoice payable to an offshore bank account in Belize. The compliance engine immediately froze the automated wire transfer and alerted corporate legal. A forensic audit revealed that the agent had used the funds to bribe customs officials to bypass mandatory radiation safety checks. By catching the corrupt payment before disbursement and self-reporting the incident to the US Department of Justice under FCPA voluntary disclosure guidelines, the enterprise avoided tens of millions in criminal penalties and preserved its global defense contracting eligibility.",
            "code": """# Corporate Governance: Anti-Bribery & Corruption (FCPA / PCA) Red-Flag Detection Engine
def audit_vendor_invoice_anti_corruption(
    invoice_id: str,
    vendor_id: str,
    vendor_category: str, # 'CUSTOMS_BROKER', 'FREIGHT_FORWARDER', 'RAW_MATERIAL_SUPPLIER'
    invoice_amount_usd: float,
    line_item_description: str,
    vendor_bank_country: str,
    operational_country: str,
    is_round_dollar_amount: bool,
    has_prior_anti_corruption_certification: bool
) -> dict:
    red_flags = []
    
    # 1. Red Flag: Suspicious Billing Description Keywords
    suspicious_keywords = [
        "facilitation", "expediting", "liaison", "special protocol", 
        "government fee", "unofficial", "gratuity", "urgent clearance"
    ]
    desc_lower = line_item_description.lower()
    for kw in suspicious_keywords:
        if kw in desc_lower:
            red_flags.append(f"SUSPICIOUS_KEYWORD: Invoice contains flagged corruption term '{kw}'")
            
    # 2. Red Flag: Offshore Tax Haven / Cross-Border Mismatch
    # If operational services in India/Germany, but payment routed to Cayman/Belize/Panama
    tax_havens = ["cayman islands", "belize", "panama", "british virgin islands", "seychelles"]
    if vendor_bank_country.lower() in tax_havens and operational_country.lower() not in tax_havens:
        red_flags.append(f"OFFSHORE_PAYMENT_RISK: Operating in {operational_country} but paying to offshore bank in {vendor_bank_country}")
        
    # 3. Red Flag: Round dollar amounts on customs/freight pass-throughs
    if is_round_dollar_amount and invoice_amount_usd > 5000.0 and vendor_category in ['CUSTOMS_BROKER', 'FREIGHT_FORWARDER']:
        red_flags.append(f"ROUND_DOLLAR_ANOMALY: High-value round amount (${invoice_amount_usd:,.2f}) typical of slush fund reimbursement")
        
    # 4. Red Flag: Missing Anti-Corruption FCPA Certification
    if not has_prior_anti_corruption_certification:
        red_flags.append("COMPLIANCE_GAP: Vendor has not executed mandatory annual FCPA/Anti-Bribery compliance warranty")
        
    is_red_flag_triggered = len(red_flags) > 0
    risk_level = "CRITICAL_BRIBERY_RISK" if len(red_flags) >= 2 else ("MODERATE_REVIEW" if len(red_flags) == 1 else "CLEAN_COMPLIANT")
    disposition = "FREEZE_PAYMENT_DISPATCH_FORENSIC_AUDIT" if is_red_flag_triggered else "CLEARED_FOR_STANDARD_DISBURSEMENT"
    
    return {
        "invoice_id": invoice_id,
        "vendor": vendor_id,
        "category": vendor_category,
        "amount_usd": invoice_amount_usd,
        "red_flag_count": len(red_flags),
        "corruption_risk_tier": risk_level,
        "compliance_disposition": disposition,
        "identified_red_flags": red_flags
    }

# Invoice 1: Legitimate maritime ocean freight billing
inv1 = audit_vendor_invoice_anti_corruption(
    invoice_id="INV-OCEAN-8801", vendor_id="V-MAERSK-LINE", vendor_category="FREIGHT_FORWARDER",
    invoice_amount_usd=14328.45, line_item_description="Standard 40ft High-Cube Ocean Freight Container Transit",
    vendor_bank_country="Denmark", operational_country="India",
    is_round_dollar_amount=False, has_prior_anti_corruption_certification=True
)

# Invoice 2: Highly suspicious customs clearance invoice
inv2 = audit_vendor_invoice_anti_corruption(
    invoice_id="INV-CUSTOMS-9902", vendor_id="V-QUICK-CLEAR-LLC", vendor_category="CUSTOMS_BROKER",
    invoice_amount_usd=25000.00, line_item_description="Urgent customs liaison and port authority expediting fee",
    vendor_bank_country="Belize", operational_country="India",
    is_round_dollar_amount=True, has_prior_anti_corruption_certification=False
)

print(f"[{inv1['invoice_id']}] {inv1['vendor']}: Risk -> {inv1['corruption_risk_tier']} | Disposition: {inv1['compliance_disposition']}")
print(f"[{inv2['invoice_id']}] {inv2['vendor']}: Risk -> {inv2['corruption_risk_tier']} | Disposition: {inv2['compliance_disposition']}")
for flag in inv2['identified_red_flags']:
    print(f"  * {flag}")
""",
            "output": """[INV-OCEAN-8801] V-MAERSK-LINE: Risk -> CLEAN_COMPLIANT | Disposition: CLEARED_FOR_STANDARD_DISBURSEMENT
[INV-CUSTOMS-9902] V-QUICK-CLEAR-LLC: Risk -> CRITICAL_BRIBERY_RISK | Disposition: FREEZE_PAYMENT_DISPATCH_FORENSIC_AUDIT
  * SUSPICIOUS_KEYWORD: Invoice contains flagged corruption term 'expediting'
  * SUSPICIOUS_KEYWORD: Invoice contains flagged corruption term 'liaison'
  * OFFSHORE_PAYMENT_RISK: Operating in India but paying to offshore bank in Belize
  * ROUND_DOLLAR_ANOMALY: High-value round amount ($25,000.00) typical of slush fund reimbursement
  * COMPLIANCE_GAP: Vendor has not executed mandatory annual FCPA/Anti-Bribery compliance warranty""",
            "codeNotes": [
                {"line": 2, "note": "Implements FCPA and UK Bribery Act anti-corruption red-flag monitoring engine"},
                {"line": 14, "note": "Scans billing line items for illicit bribery euphemisms (expediting, liaison, facilitation)"},
                {"line": 23, "note": "Detects cross-border tax haven routing anomalies disconnected from operations"},
                {"line": 34, "note": "Freezes automated payment release and dispatches forensic audit investigation"}
            ],
            "tryIt": {
                "description": "Evaluate how automated anti-bribery red-flag engines protect corporations from multi-million dollar criminal liabilities.",
                "question": "Why did the anti-corruption engine classify Invoice INV-CUSTOMS-9902 as CRITICAL_BRIBERY_RISK and freeze payment?",
                "options": [
                    "Because the font size on the invoice was too small",
                    "Because it triggered 5 classic bribery red flags: corruption keywords ('expediting', 'liaison'), payment to an offshore tax haven (Belize), an exact round $25,000 amount, and missing anti-bribery compliance warranties",
                    "Because the vendor was located in a different city",
                    "Because the payment was made via credit card rather than bitcoin"
                ],
                "answer": 1,
                "explanation": "Invoice INV-CUSTOMS-9902 triggered multiple severe bribery red flags under the FCPA and UK Bribery Act: illicit facilitation terminology, payment routing to a high-risk offshore haven (Belize), round-dollar amount typical of kickback slush funds, and missing compliance warranties. The automated freeze prevents criminal corporate exposure."
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
    data = get_day14_data()
    print(f"Loaded Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    total_words = 0
    for idx, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say']) + len(p['example'].split()) + len(p['tryIt']['explanation'].split())
        total_words += words
        print(f"  Part {idx+1} '{p['title'][:35]}...': ~{words} spoken words")
    print(f"Total Day 14 spoken words: ~{total_words} words (Target >= 2,950)")
