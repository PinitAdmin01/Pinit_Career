"""
Build Day 17 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Related Parties & Related Party Transactions: SA 550, Ind AS 24 & Companies Act Sec 188
"""
import json

day_data = {
    "day": 17,
    "title": "Related Party Transactions, Arms-Length Verification & Statutory Disclosures: SA 550, Ind AS 24 & Section 188",
    "parts": [
        {
            "title": "Related Party Definition, Risks & Auditor Responsibilities: SA 550 & Ind AS 24",
            "say": [
                "Standard on Auditing (SA) 550, 'Related Parties', establishes the auditor's responsibilities regarding related party relationships and transactions in an audit of financial statements. Related party relationships present inherently elevated risks of material misstatement, including fraud risks. Related parties often operate through complex structures, ownership networks, and off-balance-sheet vehicles that are not easily visible; information systems may be ineffective at identifying related party transactions; and related party transactions may not be conducted under normal market terms and conditions.",
                "Under Ind AS 24 (Related Party Disclosures), a related party is a person or entity that is related to the reporting entity. This includes: parent companies, subsidiaries, associates, and joint ventures; Key Management Personnel (KMP) such as Executive Directors, CEO, and CFO, and their close family members; and entities controlled, jointly controlled, or significantly influenced by KMP or their close family members.",
                "SA 550 explicitly recognizes that related parties may provide opportunities for management override of controls or fraudulent financial reporting. Corrupt executives routinely use related entities to execute round-trip transactions, siphon corporate funds, evergreen bad debts, sell impaired assets at inflated valuations, or pay exorbitant management consulting fees that lack commercial substance.",
                "The auditor must obtain an understanding of the entity's related party relationships and transactions to conclude whether the financial statements, insofar as they are affected by those relationships and transactions, achieve fair presentation and comply with statutory disclosure requirements."
            ],
            "example": "In an audit of an infrastructure developer, management awards a Rs 120 Crore subcontract for highway earthmoving to an entity named 'TerraMove Infrastructure LLP'. Inquiring into ownership records reveals that TerraMove is 99% owned by the brother-in-law of the client's Chief Executive Officer. Management failed to disclose this relationship under Ind AS 24 or seek Board approval under Section 188. Under SA 550, this undisclosed related party represents a significant fraud risk, requiring immediate investigation.",
            "code": '''def evaluate_sa550_related_party_risk_profile(
    entity_name: str,
    identified_related_entities_count: int,
    undisclosed_related_entities_found: int,
    total_rpt_volume_cr: float,
    total_revenue_cr: float,
    has_audit_committee_prior_approval: bool,
    has_transfer_pricing_arms_length_study: bool
) -> dict:
    rpt_intensity_pct = (total_rpt_volume_cr / total_revenue_cr * 100.0) if total_revenue_cr > 0 else 0.0
    
    # Assess Fraud Risk Flags under SA 550
    risk_flags = []
    if undisclosed_related_entities_found > 0:
        risk_flags.append("UNDISCLOSED_RELATED_PARTIES_CONCEALED_BY_MANAGEMENT")
    if rpt_intensity_pct >= 25.0:
        risk_flags.append("HIGH_CONCENTRATION_OF_RELATED_PARTY_REVENUE_OR_PURCHASES")
    if not has_audit_committee_prior_approval:
        risk_flags.append("SECTION_188_AUDIT_COMMITTEE_OMISSION")
    if not has_transfer_pricing_arms_length_study:
        risk_flags.append("LACK_OF_ARMS_LENGTH_TRANSFER_PRICING_DOCUMENTATION")
        
    if len(risk_flags) >= 2 or undisclosed_related_entities_found > 0:
        overall_risk = "SIGNIFICANT_FRAUD_RISK_MANDATORY_SPECIAL_SCRUTINY"
        audit_strategy = "PERFORM_EXTENDED_BENEFICIAL_OWNERSHIP_AND_BANK_CIRCULARIZATION"
    elif len(risk_flags) == 1:
        overall_risk = "ELEVATED_RELATED_PARTY_RISK"
        audit_strategy = "SUBSTANTIVE_CONTRACT_TESTING_AND_VALUATION_INSPECTION"
    else:
        overall_risk = "NORMAL_GOVERNANCE_CONTROL_RISK"
        audit_strategy = "STANDARD_INDAS24_DISCLOSURE_RECONCILIATION"
        
    return {
        "entity_name": entity_name,
        "related_entities_count": identified_related_entities_count,
        "undisclosed_found": undisclosed_related_entities_found,
        "rpt_volume_cr": total_rpt_volume_cr,
        "rpt_intensity_pct": round(rpt_intensity_pct, 1),
        "identified_risk_flags": risk_flags,
        "sa550_risk_rating": overall_risk,
        "mandated_audit_strategy": audit_strategy
    }

rpt_risk = evaluate_sa550_related_party_risk_profile(
    entity_name="Apex Infrastructure Developers Ltd",
    identified_related_entities_count=14,
    undisclosed_related_entities_found=2,
    total_rpt_volume_cr=350.0,
    total_revenue_cr=1000.0,
    has_audit_committee_prior_approval=False,
    has_transfer_pricing_arms_length_study=False
)
print("SA 550 Related Party Risk Assessment Engine:")
print(f"  Entity Evaluated          : {rpt_risk['entity_name']}")
print(f"  RPT Volume & Intensity    : INR {rpt_risk['rpt_volume_cr']} Cr ({rpt_risk['rpt_intensity_pct']}% of revenue)")
print(f"  Undisclosed Entities Found: {rpt_risk['undisclosed_found']}")
print(f"  SA 550 Risk Rating        : {rpt_risk['sa550_risk_rating']}")
print(f"  Audit Strategy Mandated   : {rpt_risk['mandated_audit_strategy']}")
print("  Identified Statutory Risk Flags:")
for flag in rpt_risk['identified_risk_flags']:
    print(f"    * {flag}")
''',
            "tryIt": "Set undisclosed_related_entities_found to 0, has_audit_committee_prior_approval to True, and has_transfer_pricing_arms_length_study to True to see risk normalize to standard disclosure reconciliation.",
            "check": {
                "question": "What is the primary reason why SA 550 treats related party relationships and transactions as carrying inherently elevated risk of material misstatement?",
                "options": [
                    "Related parties often operate through complex non-transparent ownership structures and provide opportunities for collusion, concealment, or management override of normal controls",
                    "Related parties are illegal under the Indian Penal Code",
                    "Related party transactions are exempt from Goods and Services Tax",
                    "All related parties must be registered in the state of Delaware"
                ],
                "answerIndex": 0,
                "why": "SA 550 Paragraph 3 explicitly notes that related party relationships provide greater opportunities for collusion, concealment, and management override, creating significant fraud and presentation risks."
            }
        },
        {
            "title": "Identifying Undisclosed Related Parties & Ultimate Beneficial Ownership (UBO)",
            "say": [
                "Management is responsible for the identification and disclosure of related parties. However, in statutory and forensic audits, the auditor cannot passively accept management's representation. SA 550 requires the auditor to remain alert, throughout the audit, for arrangements or information that may indicate the existence of related party relationships or transactions that management has not previously identified or disclosed to the auditor.",
                "To uncover undisclosed related parties, the auditor performs specific investigative inspection procedures: (1) Reviewing corporate bank statements, loan agreements, and guarantee contracts for significant transactions outside the normal course of business; (2) Inspecting minutes of meetings of shareholders and Those Charged With Governance (Board of Directors and Audit Committee); (3) Reviewing statutory registers maintained under the Companies Act, 2013—specifically the Register of Contracts in which Directors are Interested (Section 189) and the Register of Significant Beneficial Owners (Section 90); (4) Reviewing declarations of interest submitted by directors in Form MBP-1; and (5) Inspecting Ministry of Corporate Affairs (MCA) filings (Form DIR-12, Form MGT-7).",
                "Furthermore, modern forensic assurance deploys automated entity resolution and Ultimate Beneficial Ownership (UBO) collision mapping. The auditor extracts Director Identification Numbers (DIN), Permanent Account Numbers (PAN), corporate registered email addresses, and residential addresses from the vendor master file and matches them against the MCA master database.",
                "When previously undisclosed related parties are identified, SA 550 mandates that the auditor promptly communicate the relevant information to the other members of the engagement team, request management to identify all transactions with the newly discovered party, and determine why the entity's internal controls failed."
            ],
            "example": "During a forensic audit of an enterprise's top 100 suppliers, the audit team executes an automated DIN-PAN collision script. The script uncovers that 'Matrix Tech Solutions Pvt Ltd', which billed Rs 42 Crore for IT consulting, shares the exact registered corporate email address and residential director address as the client's Chief Technology Officer. The CTO never disclosed this entity in Form MBP-1. The auditor immediately isolates all transactions with Matrix Tech for 100% substantive inspection under SA 550.",
            "code": '''def detect_undisclosed_related_parties_collision_graph(
    vendor_master: list,
    kmp_and_directors_directory: list
) -> dict:
    flagged_collisions = []
    
    # Index KMP directory by PAN, Address, and Immediate Family
    kmp_pans = {d["pan"].upper(): d for d in kmp_and_directors_directory}
    kmp_addresses = {d["residential_pincode"]: d for d in kmp_and_directors_directory}
    kmp_phone_tails = {d["phone_last_4"]: d for d in kmp_and_directors_directory}
    
    for v in vendor_master:
        collision_reasons = []
        v_pan = v.get("director_pan", "").upper()
        v_pin = v.get("registered_pincode", "")
        v_phone = v.get("contact_phone_tail", "")
        
        if v_pan in kmp_pans:
            matched_kmp = kmp_pans[v_pan]
            collision_reasons.append(f"DIRECT_PAN_MATCH: Vendor Director PAN matches {matched_kmp['name']} ({matched_kmp['role']})")
            
        if v_pin in kmp_addresses and v_phone in kmp_phone_tails:
            matched_kmp = kmp_addresses[v_pin]
            collision_reasons.append(f"CO-LOCATION_MATCH: Vendor registered at same PIN {v_pin} and phone with {matched_kmp['name']}")
            
        if collision_reasons:
            flagged_collisions.append({
                "vendor_name": v["name"],
                "vendor_code": v["code"],
                "annual_spend_cr": v["annual_spend_cr"],
                "collision_evidence": collision_reasons,
                "is_disclosed_in_indas24": v.get("disclosed_by_management", False)
            })
            
    total_undisclosed_spend = sum(c["annual_spend_cr"] for c in flagged_collisions if not c["is_disclosed_in_indas24"])
    
    return {
        "vendors_analyzed": len(vendor_master),
        "suspicious_collisions_count": len(flagged_collisions),
        "undisclosed_related_party_spend_cr": round(total_undisclosed_spend, 2),
        "audit_action_required": "EXPAND_SA550_INVESTIGATION_AND_NOTIFY_AUDIT_COMMITTEE" if total_undisclosed_spend > 0 else "CLEAN_NO_COLLISIONS",
        "collision_details": flagged_collisions
    }

vendors = [
    {"name": "Matrix Tech Solutions Pvt Ltd", "code": "V-1002", "director_pan": "ABCDE1234F", "registered_pincode": "560034", "contact_phone_tail": "8899", "annual_spend_cr": 42.0, "disclosed_by_management": False},
    {"name": "Global Office Supplies Corp", "code": "V-1003", "director_pan": "XYZPK9988Z", "registered_pincode": "110001", "contact_phone_tail": "1234", "annual_spend_cr": 5.2, "disclosed_by_management": True},
    {"name": "Zenith Logistics SPV", "code": "V-1004", "director_pan": "LMNOP5544Q", "registered_pincode": "560034", "contact_phone_tail": "8899", "annual_spend_cr": 18.5, "disclosed_by_management": False}
]

kmps = [
    {"name": "Rajesh Sharma", "role": "Chief Technology Officer", "pan": "ABCDE1234F", "residential_pincode": "560034", "phone_last_4": "8899"},
    {"name": "Ananya Sen", "role": "Chief Financial Officer", "pan": "AABBC9988D", "residential_pincode": "400001", "phone_last_4": "4321"}
]

collision_res = detect_undisclosed_related_parties_collision_graph(vendors, kmps)
print("Forensic Related Party Collision Graph Engine (SA 550):")
print(f"  Vendors Screened          : {collision_res['vendors_analyzed']}")
print(f"  Collisions Identified     : {collision_res['suspicious_collisions_count']}")
print(f"  Undisclosed RPT Spend     : INR {collision_res['undisclosed_related_party_spend_cr']} Crores")
print(f"  Mandated Audit Action     : {collision_res['audit_action_required']}")
print("  Collision Details:")
for c in collision_res['collision_details']:
    print(f"    * {c['vendor_name']} (INR {c['annual_spend_cr']} Cr): Disclosed={c['is_disclosed_in_indas24']} | Evidence: {c['collision_evidence']}")
''',
            "tryIt": "Set disclosed_by_management to True for Matrix Tech and Zenith Logistics to see how disclosed items are distinguished from concealed undisclosed conduits.",
            "check": {
                "question": "What is the mandatory action required of an auditor under SA 550 upon identifying a related party or significant related party transaction that management failed to previously identify or disclose?",
                "options": [
                    "Promptly communicate the relevant information to the other members of the engagement team, request management to identify all transactions with the newly discovered party, and inquire why controls failed",
                    "Immediately resign from the audit engagement without informing anyone",
                    "Issue a clean unmodified audit report because related party identification is exclusively management's duty",
                    "Keep the discovery strictly confidential from the rest of the audit engagement team"
                ],
                "answerIndex": 0,
                "why": "SA 550 Paragraph 22 explicitly prescribes that the auditor shall promptly communicate the information to the engagement team, request identification of all related transactions, and evaluate control failures."
            }
        },
        {
            "title": "Arm's-Length Assertion Verification & Pricing Methodologies: SA 550",
            "say": [
                "In corporate financial statements, management frequently asserts that related party transactions were conducted on terms equivalent to those prevailing in an arm's-length transaction (as required under Ind AS 24 and the Transfer Pricing provisions of the Income-tax Act, 1961). An arm's-length transaction is one conducted on such terms and conditions as between a willing buyer and a willing seller who are unrelated and are acting independently and in their own best interests.",
                "SA 550 establishes that management's assertion that a related party transaction was conducted on an arm's-length basis is an accounting assertion subject to substantive audit verification. The auditor shall not accept management's assertion at face value without obtaining sufficient appropriate audit evidence to corroborate it.",
                "To audit the arm's-length assertion, the auditor applies established economic and transfer pricing methodologies: (1) Comparable Uncontrolled Price (CUP) Method—comparing the price charged in the related party transaction with prices charged in comparable transactions with independent third parties; (2) Resale Price Method (RPM)—evaluating the gross profit margin earned by a related distributor against margins earned by independent distributors; (3) Cost Plus Method (CPM)—verifying that the markup applied to direct and indirect manufacturing costs aligns with industry benchmarks; and (4) Transactional Net Margin Method (TNMM)—benchmarking the operating profit margin against comparable independent operating companies.",
                "If management cannot substantiate the arm's-length assertion with credible market data or a certified transfer pricing study, the auditor shall request management to remove the assertion from the notes to the financial statements. If management refuses, the auditor must consider issuing a qualified or adverse audit opinion under SA 705."
            ],
            "example": "A listed conglomerate leases its corporate headquarters building from an entity owned by the promoter family for Rs 24 Crore annually, disclosing in the notes that the rent is 'at arm's-length market terms'. The auditor contracts an independent real estate valuer, who determines that prime commercial office rent for identical grade-A floorplates in the same locality is only Rs 11 Crore annually. Management overpaid the promoter by Rs 13 Crore. Because management refuses to restate the transaction or retract the arm's-length claim, the auditor issues a qualified opinion.",
            "code": '''def verify_arms_length_assertion_cup(
    transaction_description: str,
    related_party_rate: float,
    uncontrolled_third_party_market_rates: list,
    total_volume_units: float,
    performance_materiality_cr: float
) -> dict:
    import statistics
    
    mean_market_rate = statistics.mean(uncontrolled_third_party_market_rates)
    median_market_rate = statistics.median(uncontrolled_third_party_market_rates)
    interquartile_low = sorted(uncontrolled_third_party_market_rates)[len(uncontrolled_third_party_market_rates) // 4]
    interquartile_high = sorted(uncontrolled_third_party_market_rates)[(len(uncontrolled_third_party_market_rates) * 3) // 4]
    
    # Check if Related Party Rate falls within arm's-length range
    is_within_arms_length_range = (interquartile_low <= related_party_rate <= interquartile_high)
    
    # Calculate premium or discount
    unit_variance = related_party_rate - median_market_rate
    total_excess_transfer_cr = (unit_variance * total_volume_units) / 10000000.0 # Convert to Crores
    
    if is_within_arms_length_range:
        verdict = "ARMS_LENGTH_ASSERTION_SUBSTANTIATED_COMPLIANT"
        audit_opinion_impact = "CLEAN_DISCLOSURE_PERMITTED"
    else:
        verdict = "ARMS_LENGTH_ASSERTION_REFUTED_NON_ARMS_LENGTH_TERMS"
        audit_opinion_impact = "DEMAND_REMOVAL_OF_ARMS_LENGTH_NOTE_OR_QUALIFY_OPINION"
        
    return {
        "transaction": transaction_description,
        "related_party_rate": round(related_party_rate, 2),
        "median_market_benchmark": round(median_market_rate, 2),
        "arms_length_interquartile_band": [round(interquartile_low, 2), round(interquartile_high, 2)],
        "is_arms_length": is_within_arms_length_range,
        "excess_transfer_volume_cr": round(total_excess_transfer_cr, 2),
        "exceeds_performance_materiality": abs(total_excess_transfer_cr) >= performance_materiality_cr,
        "audit_verdict": verdict,
        "mandated_action": audit_opinion_impact
    }

cup_audit = verify_arms_length_assertion_cup(
    transaction_description="Lease Rental of Corporate Commercial HQ",
    related_party_rate=2400.0, # Rs per sq ft per annum
    uncontrolled_third_party_market_rates=[1050.0, 1100.0, 1150.0, 1200.0, 1250.0, 1300.0],
    total_volume_units=100000.0, # 100,000 sq ft
    performance_materiality_cr=5.0
)
print("SA 550 Arm's-Length Assertion Verification Engine (CUP Method):")
print(f"  Transaction Audited       : {cup_audit['transaction']}")
print(f"  Related Party Contract Rt : INR {cup_audit['related_party_rate']}/unit")
print(f"  Market Benchmark Median   : INR {cup_audit['median_market_benchmark']}/unit")
print(f"  Arm's-Length Band (IQR)   : INR {cup_audit['arms_length_interquartile_band']}")
print(f"  Arm's Length Substantiated: {cup_audit['is_arms_length']}")
print(f"  Excess Transfer to Related: INR {cup_audit['excess_transfer_volume_cr']} Crores (Material: {cup_audit['exceeds_performance_materiality']})")
print(f"  Audit Diagnostic Verdict  : {cup_audit['audit_verdict']}")
print(f"  Audit Reporting Mandate   : {cup_audit['mandated_action']}")
''',
            "tryIt": "Set related_party_rate to 1150.0 to bring the rate within the interquartile band, validating the arm's-length assertion.",
            "check": {
                "question": "What must the statutory auditor do if management includes an assertion in the financial statement notes that a related party transaction was conducted at arm's-length, but management cannot provide sufficient appropriate audit evidence supporting the claim?",
                "options": [
                    "Request management to remove the unsubstantiated arm's-length assertion from the financial statements, and if management refuses, evaluate the need to issue a qualified or adverse audit opinion under SA 705",
                    "Automatically rewrite the financial statement notes without informing management",
                    "Disregard the issue because note disclosures are voluntary and non-binding",
                    "File a criminal FIR with the local police station within 24 hours"
                ],
                "answerIndex": 0,
                "why": "SA 550 Paragraph A44 states that if management cannot support an arm's-length assertion, the auditor must request its removal; refusal results in a misstatement requiring an audit opinion modification under SA 705."
            }
        },
        {
            "title": "Statutory Governance & Compliance: Companies Act Section 188 & CARO 2020 Clause (xiii)",
            "say": [
                "In India, related party transactions are subject to rigorous statutory governance under the Companies Act, 2013 and CARO 2020. The statutory auditor must independently verify compliance with three primary legal pillars: Section 188 of the Companies Act; Section 177 (Audit Committee approval); and Clause (xiii) of the Companies (Auditor's Report) Order, 2020 (CARO 2020).",
                "Under Section 188(1) of the Companies Act, 2013, a company cannot enter into specified contracts or arrangements with a related party (such as sale, purchase, or supply of goods/materials; selling or disposing of property; leasing property; availing or rendering services; or appointing to an office or place of profit) without the consent of the Board of Directors given by a resolution at a meeting. Crucially, if the transaction is entered into in the ordinary course of business AND on an arm's-length basis, the requirements of Section 188(1) do not apply.",
                "However, under Section 177(4)(iv), the Audit Committee must grant prior approval for ALL related party transactions, including ordinary course and arm's-length transactions (though omnibus approvals valid for up to one year are permitted under Rule 6A). Furthermore, if a related party transaction exceeds statutory threshold limits (e.g., 10% of annual turnover), prior approval of shareholders by Ordinary Resolution is mandatory, wherein related parties cannot vote on the resolution.",
                "Under CARO 2020 Clause (xiii), the auditor must explicitly state in the audit report: whether all transactions with related parties are in compliance with Sections 177 and 188 of the Companies Act, 2013 where applicable, and the details have been disclosed in the financial statements as required by the applicable accounting standards (Ind AS 24). Any non-compliance requires an adverse statutory remark."
            ],
            "example": "A listed steel producer sells steel billets worth Rs 280 Crore to an associate company without seeking prior Audit Committee omnibus approval or Board approval under Section 188. Management argues that the sale was in the ordinary course of business. However, Section 177 requires prior Audit Committee approval for ALL transactions without exception. Under CARO 2020 Clause (xiii), the statutory auditor must issue an adverse remark detailing the Section 177 statutory violation and quantifying the Rs 280 Crore transaction.",
            "code": '''def audit_companies_act_sec188_and_caro_clause_xiii(
    company_name: str,
    rpt_transactions: list
) -> dict:
    non_compliant_transactions = []
    
    for tx in rpt_transactions:
        violations = []
        # Rule 1: Section 177 prior Audit Committee approval is MANDATORY for all RPTs
        if not tx["has_prior_audit_committee_approval"]:
            violations.append("SECTION_177_PRIOR_AUDIT_COMMITTEE_APPROVAL_MISSING")
            
        # Rule 2: Section 188 Board approval required unless ordinary course AND arm's-length
        is_exempt_sec188 = tx["is_ordinary_course_of_business"] and tx["is_substantiated_arms_length"]
        if not is_exempt_sec188 and not tx["has_board_approval"]:
            violations.append("SECTION_188_BOARD_RESOLUTION_OMITTED_FOR_NON_ARMS_LENGTH_CONTRACT")
            
        # Rule 3: Shareholder approval required if exceeding 10% turnover
        if tx["exceeds_10pct_turnover_threshold"] and not tx["has_shareholder_ordinary_resolution"]:
            violations.append("SECTION_188_SHAREHOLDER_ORDINARY_RESOLUTION_OMITTED")
            
        # Rule 4: Ind AS 24 full disclosure required
        if not tx["disclosed_under_indas24"]:
            violations.append("IND_AS_24_STATUTORY_DISCLOSURE_DEFICIENCY")
            
        if violations:
            non_compliant_transactions.append({
                "transaction_id": tx["id"],
                "related_party_name": tx["party_name"],
                "amount_cr": tx["amount_cr"],
                "statutory_violations": violations
            })
            
    total_violation_amount_cr = sum(t["amount_cr"] for t in non_compliant_transactions)
    has_caro_adverse_remark = len(non_compliant_transactions) > 0
    
    caro_remark = (
        f"According to the information and explanations given to us and based on our examination of the records of the Company, "
        f"transactions with the related parties are not in full compliance with Sections 177 and 188 of the Companies Act, 2013. "
        f"Specifically, {len(non_compliant_transactions)} transaction(s) totaling INR {total_violation_amount_cr:.2f} Crores lacked mandatory prior "
        f"approvals. Details have been reported in Note X to the financial statements."
        if has_caro_adverse_remark else
        "According to the information and explanations given to us, all transactions with related parties are in compliance with "
        "Sections 177 and 188 of the Companies Act, 2013 where applicable and the details have been disclosed in the financial statements "
        "as required by the applicable accounting standards (Ind AS 24)."
    )
    
    return {
        "company_name": company_name,
        "total_rpt_evaluated": len(rpt_transactions),
        "non_compliant_count": len(non_compliant_transactions),
        "total_violation_exposure_cr": round(total_violation_amount_cr, 2),
        "caro_clause_xiii_verdict": "ADVERSE_REMARK_REQUIRED" if has_caro_adverse_remark else "CLEAN_UNMODIFIED_COMPLIANCE",
        "caro_statutory_text": caro_remark,
        "flagged_transactions": non_compliant_transactions
    }

contracts = [
    {"id": "RPT-01", "party_name": "Zenith Real Estate SPV", "amount_cr": 28.0, "has_prior_audit_committee_approval": True, "is_ordinary_course_of_business": True, "is_substantiated_arms_length": True, "has_board_approval": True, "exceeds_10pct_turnover_threshold": False, "has_shareholder_ordinary_resolution": False, "disclosed_under_indas24": True},
    {"id": "RPT-02", "party_name": "Apex Mining Associates LLP", "amount_cr": 145.0, "has_prior_audit_committee_approval": False, "is_ordinary_course_of_business": False, "is_substantiated_arms_length": False, "has_board_approval": False, "exceeds_10pct_turnover_threshold": True, "has_shareholder_ordinary_resolution": False, "disclosed_under_indas24": True}
]

caro_eval = audit_companies_act_sec188_and_caro_clause_xiii("Zenith Steel Industries Ltd", contracts)
print("Companies Act Section 177/188 & CARO 2020 Clause (xiii) Statutory Audit Engine:")
print(f"  Company Name              : {caro_eval['company_name']}")
print(f"  Total RPT Contracts Tested: {caro_eval['total_rpt_evaluated']}")
print(f"  Non-Compliant Contracts   : {caro_eval['non_compliant_count']}")
print(f"  Violation Exposure Amount : INR {caro_eval['total_violation_exposure_cr']} Crores")
print(f"  CARO Clause (xiii) Verdict: {caro_eval['caro_clause_xiii_verdict']}")
print("  Statutory CARO 2020 Audit Report Remark:")
print(f"  \"{caro_eval['caro_statutory_text']}\"")
''',
            "tryIt": "Set has_prior_audit_committee_approval to True, has_board_approval to True, and has_shareholder_ordinary_resolution to True for RPT-02 to observe the CARO verdict change to clean unmodified compliance.",
            "check": {
                "question": "Under Section 177(4)(iv) of the Companies Act, 2013, which related party transactions require prior approval from the Audit Committee?",
                "options": [
                    "All related party transactions require prior approval of the Audit Committee, without exception for whether they are in the ordinary course of business or at arm's length",
                    "Only transactions exceeding Rs 100 Crore entered into with offshore tax havens",
                    "Only transactions that involve immediate blood relatives of the Company Secretary",
                    "None, because the Audit Committee only reviews financial statements after year-end"
                ],
                "answerIndex": 0,
                "why": "Section 177(4)(iv) explicitly mandates that the Audit Committee must give prior approval for all related party transactions; ordinary course and arm's length exemptions apply to Section 188 Board approval, not Section 177."
            }
        },
        {
            "title": "Comprehensive Related Party Audit Program & Working Paper Documentation",
            "say": [
                "To synthesize related party audit procedures into an unassailable audit defense under SA 230 and SA 550, the statutory audit team executes an integrated 5-stage audit program: (1) Inherent Risk & Governance Assessment—obtaining a complete register of related parties and assessing tone-at-the-top governance; (2) Completeness Testing—running automated entity resolution scripts matching master data against MCA registries and bank transaction logs; (3) Business Rationale & Commercial Substance Evaluation—verifying that related party transactions serve legitimate corporate purposes rather than tax evasion or capital siphoning; (4) Valuation & Arm's-Length Testing—validating transfer pricing benchmarks and independent appraisal reports; and (5) Financial Statement & Statutory Reporting—reconciling Ind AS 24 disclosures and formulating CARO 2020 Clause (xiii) reporting.",
                "In evaluating business rationale, SA 550 Paragraph 23 directs the auditor to question: (a) whether the transaction is overly complex (e.g., involving multi-layered offshore pass-through entities); (b) whether unusual terms of trade exist, such as uncollateralized long-term credit terms or below-market interest rates; (c) whether the transaction was processed outside standard ERP controls; and (d) whether the transaction occurred immediately before balance sheet date to manipulate financial ratios.",
                "All findings, including management representations, expert reports, and identified non-compliance, must be fully documented in the audit working papers and retained for the statutory 7-year retention period under SA 230."
            ],
            "example": "In an audit of a diversified conglomerate, the engagement team executes the complete 5-stage RPT audit program across 45 related party contracts totaling Rs 890 Crore. The program uncovers that Rs 65 Crore in loans granted to an associate company bore 0% interest and lacked repayment schedules, violating Section 186. The audit working papers document the Section 186 violation, the CARO Clause (iv) qualification, and the Ind AS 24 disclosure notes.",
            "code": '''class ComprehensiveRPTAuditProgram:
    def __init__(self, client_name: str, audit_year: str):
        self.client_name = client_name
        self.audit_year = audit_year
        self.audit_stages = []
        
    def record_stage(self, stage_name: str, procedures_performed: int, exceptions_found: int, status: str):
        self.audit_stages.append({
            "stage": stage_name,
            "procedures_count": procedures_performed,
            "exceptions": exceptions_found,
            "stage_status": status
        })
        
    def generate_audit_summary(self) -> dict:
        total_procs = sum(s["procedures_count"] for s in self.audit_stages)
        total_ex = sum(s["exceptions"] for s in self.audit_stages)
        
        return {
            "client": self.client_name,
            "fiscal_year": self.audit_year,
            "total_audit_procedures_executed": total_procs,
            "total_audit_exceptions_flagged": total_ex,
            "audit_file_status": "SA230_COMPLIANT_READY_FOR_PARTNER_SIGN_OFF" if total_ex == 0 else "AUDIT_DIFFERENCES_REQUIRE_MANAGEMENT_LETTER_AND_DISCLOSURE",
            "stages_detail": self.audit_stages
        }

rpt_audit = ComprehensiveRPTAuditProgram("Zenith Global Conglomerate Ltd", "FY 2025-26")
rpt_audit.record_stage("Stage 1: Governance & Register Review", procedures_performed=8, exceptions_found=0, status="CLEAN")
rpt_audit.record_stage("Stage 2: Completeness & MCA UBO Graphing", procedures_performed=12, exceptions_found=2, status="UNDISCLOSED_ENTITIES_IDENTIFIED")
rpt_audit.record_stage("Stage 3: Business Rationale & Commercial Substance", procedures_performed=15, exceptions_found=1, status="SHAM_SUB_CONTRACT_FLAGGED")
rpt_audit.record_stage("Stage 4: Transfer Pricing & Arm's Length Testing", procedures_performed=10, exceptions_found=1, status="NON_ARMS_LENGTH_RENTAL_OVERPAYMENT")
rpt_audit.record_stage("Stage 5: Ind AS 24 & CARO 2020 Clause (xiii)", procedures_performed=6, exceptions_found=1, status="CARO_ADVERSE_REMARK_MANDATED")

summary = rpt_audit.generate_audit_summary()
print("Comprehensive SA 550 / Ind AS 24 Related Party Audit Program:")
print(f"  Client Name               : {summary['client']} ({summary['fiscal_year']})")
print(f"  Procedures Executed       : {summary['total_audit_procedures_executed']}")
print(f"  Audit Exceptions Flagged  : {summary['total_audit_exceptions_flagged']}")
print(f"  Audit File Status         : {summary['audit_file_status']}")
print("  Stage-by-Stage Working Paper Summary:")
for st in summary['stages_detail']:
    print(f"    * {st['stage']}: {st['procedures_count']} procedures | {st['exceptions']} exceptions -> [{st['stage_status']}]")
''',
            "tryIt": "Modify the exceptions_found in stages 2-5 to 0 to observe the audit file status transition to SA 230 partner sign-off ready.",
            "check": {
                "question": "What is the mandatory retention period for audit documentation and related party working papers under SA 230?",
                "options": [
                    "Not less than seven years from the date of the auditor's report (or group auditor's report)",
                    "One year until the next annual general meeting of shareholders",
                    "Three years until the completion of the income tax assessment",
                    "There is no retention requirement once the audited financial statements are published"
                ],
                "answerIndex": 0,
                "why": "SA 230 Paragraph A23 and SQC 1 mandate a minimum retention period of not less than seven years from the date of the auditor's report."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day17.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 17 base JSON created successfully.")
