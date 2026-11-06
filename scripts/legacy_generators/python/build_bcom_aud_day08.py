"""
Build Day 8 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Audit Evidence, External Confirmations & Analytical Procedures: SAs 500, 501, 505 & 520
"""
import json

day_data = {
    "day": 8,
    "title": "Audit Evidence, Physical Inventories, External Confirmations & Analytical Procedures: SAs 500 to 520",
    "parts": [
        {
            "title": "Audit Evidence Architecture: Sufficiency, Appropriateness & Management Expert Reliability: SA 500",
            "say": [
                "Standard on Auditing (SA) 500 defines the statutory obligations of the auditor to design and perform audit procedures in such a way as to enable the auditor to obtain sufficient appropriate audit evidence to be able to draw reasonable conclusions on which to base the auditor's opinion. The dual criteria of evidence are distinct yet inseparable: 'Sufficiency' is the measure of the quantity of audit evidence, which is affected by the auditor's assessment of the risks of material misstatement and the quality of such evidence; 'Appropriateness' is the measure of the quality of audit evidence, namely, its relevance and its reliability in providing support for the conclusions on which the auditor's opinion is based.",
                "The reliability of audit evidence is influenced by its source and its nature, and is dependent on the individual circumstances under which it is obtained. SA 500 establishes five core legal presumptions regarding reliability: (1) evidence obtained from independent external sources outside the entity is more reliable than evidence generated internally; (2) evidence generated internally is more reliable when the related controls, including controls over its preparation and maintenance, are effective; (3) evidence obtained directly by the auditor (such as observation of a physical control activity) is more reliable than evidence obtained indirectly or by inference (such as inquiry about the application of a control); (4) evidence in documentary form (whether paper, electronic, or other medium) is more reliable than evidence obtained orally; and (5) evidence provided by original documents is more reliable than evidence provided by photocopies, faxes, or digitized scans.",
                "When information to be used as audit evidence has been prepared using the work of a Management's Expert (such as an independent actuarial valuation for employee gratuity under Ind AS 19 or a certified mining engineer's ore reserve estimate), SA 500 requires the auditor to: (a) evaluate the competence, capabilities, and objectivity of that expert; (b) obtain an understanding of the work of that expert; and (c) evaluate the appropriateness of that expert's work as audit evidence for the relevant assertion.",
                "Furthermore, when using information produced by the entity (IPE)—such as ERP system inventory dumps or automated sales reports—the auditor must obtain audit evidence about the accuracy and completeness of the information, and evaluate whether the information is sufficiently precise and detailed for the auditor's purposes."
            ],
            "example": "In auditing a commercial airline, management submits an internally generated spreadsheet showing $180 million in unearned passenger ticket liabilities. Recognizing that internally generated data carries lower reliability, the auditor verifies the IPE report: the auditor independently inspects the underlying relational database scripts, reconciles the booking engine transaction log against payment gateway cash settlements, and extracts direct merchant processor confirmations, proving completeness and accuracy before relying on the schedule.",
            "code": '''def evaluate_sa500_evidence_reliability(
    source_type: str, # "INDEPENDENT_EXTERNAL", "INTERNAL_STRONG_CONTROLS", "INTERNAL_WEAK_CONTROLS", "ORAL_INQUIRY"
    document_format: str, # "ORIGINAL_DIGITALLY_SIGNED", "SCANNED_COPY", "ORAL_STATEMENT"
    direct_auditor_observation: bool,
    management_expert_used: bool,
    expert_independent_and_certified: bool,
    ipe_tested_for_accuracy_and_completeness: bool
) -> dict:
    source_scores = {
        "INDEPENDENT_EXTERNAL": 1.0,
        "INTERNAL_STRONG_CONTROLS": 0.75,
        "INTERNAL_WEAK_CONTROLS": 0.35,
        "ORAL_INQUIRY": 0.15
    }
    format_scores = {
        "ORIGINAL_DIGITALLY_SIGNED": 1.0,
        "SCANNED_COPY": 0.60,
        "ORAL_STATEMENT": 0.20
    }
    
    base_reliability = source_scores.get(source_type.upper(), 0.30) * format_scores.get(document_format.upper(), 0.40)
    if direct_auditor_observation:
        base_reliability = max(base_reliability, 0.95)
        
    if management_expert_used and not expert_independent_and_certified:
        base_reliability *= 0.40
        
    if not ipe_tested_for_accuracy_and_completeness:
        base_reliability *= 0.50
        
    is_sufficient_appropriate = base_reliability >= 0.70
    
    return {
        "source_category": source_type,
        "composite_reliability_score": round(base_reliability, 3),
        "expert_validity_status": "VALID_AND_RELIABLE" if (not management_expert_used or expert_independent_and_certified) else "OBJECTIVITY_IMPAIRED",
        "ipe_verification_cleared": ipe_tested_for_accuracy_and_completeness,
        "evidence_admissible": is_sufficient_appropriate,
        "audit_evidence_tier": "TIER_1_PRIMA_FACIE" if base_reliability >= 0.85 else ("TIER_2_CORROBORATIVE" if base_reliability >= 0.60 else "TIER_3_INSUFFICIENT")
    }

ev_audit = evaluate_sa500_evidence_reliability(
    source_type="INDEPENDENT_EXTERNAL",
    document_format="ORIGINAL_DIGITALLY_SIGNED",
    direct_auditor_observation=False,
    management_expert_used=True,
    expert_independent_and_certified=True,
    ipe_tested_for_accuracy_and_completeness=True
)
print("SA 500 Audit Evidence Quantitative Reliability Evaluator:")
print(f"  Source Category        : {ev_audit['source_category']}")
print(f"  Reliability Score      : {ev_audit['composite_reliability_score']} (Scale 0.0 - 1.0)")
print(f"  Management Expert Valid: {ev_audit['expert_validity_status']}")
print(f"  Evidence Admissible    : {ev_audit['evidence_admissible']} ({ev_audit['audit_evidence_tier']})")
''',
            "tryIt": "Set ipe_tested_for_accuracy_and_completeness to False to confirm that unverified internal entity reports degrade reliability by 50%, rendering the evidence insufficient.",
            "check": {
                "question": "Under SA 500, what is the hierarchy of audit evidence reliability when evaluating conflicting sources of evidence?",
                "options": [
                    "Directly obtained original documentary evidence from independent third-party sources outside the entity is most reliable, followed by internal documents under effective controls, while oral management representations are least reliable",
                    "Oral statements from corporate executives always supersede external bank confirmations",
                    "Photocopied invoices have higher statutory reliability than digitally signed electronic records",
                    "Internal spreadsheets generated by company accountants carry maximum reliability under Indian Evidence law"
                ],
                "answerIndex": 0,
                "why": "SA 500 Paragraph A31 establishes that audit evidence obtained directly by the auditor in original documentary form from independent external sources possesses the highest degree of reliability, whereas internal or oral evidence is least reliable."
            }
        },
        {
            "title": "Specific Considerations for Selected Items: Physical Inventory Count & Litigation: SA 501",
            "say": [
                "Standard on Auditing (SA) 501 addresses the auditor's specific responsibilities regarding: (1) existence and condition of inventory; (2) completeness of litigation and claims involving the entity; and (3) presentation and disclosure of segment information in accordance with the applicable financial reporting framework (Ind AS 108).",
                "When inventory is material to the financial statements, SA 501 legally mandates that the auditor shall obtain sufficient appropriate audit evidence regarding the existence and condition of inventory by: (a) Attendance at physical inventory counting, unless impracticable; and (b) Performing audit procedures over the entity's final inventory records to determine whether they accurately reflect actual inventory count results.",
                "Attending the physical count requires the auditor to: (1) evaluate management's instructions and procedures for recording and controlling the count; (2) observe the performance of management's count procedures; (3) inspect the inventory to evaluate its condition and identify damaged, obsolete, or slow-moving items; and (4) perform test counts—tracing items from the warehouse floor to management's count sheets (test for completeness) and tracing items from count sheets to the floor (test for existence). If physical inventory counting is conducted at a date other than the balance sheet date, the auditor must perform roll-forward or roll-back audit procedures over intervening transactions.",
                "Regarding litigation and claims, SA 501 requires the auditor to design and perform audit procedures in order to identify litigation and claims involving the entity which may give rise to a risk of material misstatement, including: inquiry of management and in-house legal counsel; reviewing minutes of meetings of TCWG; and reviewing legal expense accounts. If the auditor assesses a risk of material misstatement regarding litigation or when audit procedures indicate other material claims may exist, the auditor shall seek direct communication with the entity's external legal counsel through a Letter of General or Specific Legal Inquiry under SA 501."
            ],
            "example": "In auditing a pharmaceutical manufacturer with Rs 450 Crore in finished drug inventory, the audit team attends physical counts at five manufacturing plants on March 31. The team inspects batch temperature logs, identifying Rs 12 Crore in active ingredients stored in a malfunctioning cold room where temperatures breached 18 degrees Celsius. The auditor tags the lot as obsolete/damaged, compelling management to record an immediate Net Realizable Value (NRV) write-down under Ind AS 2, ensuring inventory is not overstated on the balance sheet.",
            "code": '''def audit_sa501_inventory_roll_forward(
    count_date_inventory_inr_cr: float,
    count_date: str,
    balance_sheet_date: str,
    intervening_purchases_grn_cr: float,
    intervening_sales_cogs_cr: float,
    intervening_scrap_writeoffs_cr: float,
    balance_sheet_gl_balance_cr: float,
    materiality_threshold_cr: float
) -> dict:
    # Inventory Roll-Forward Equation:
    # Final Inventory = Count Date Inventory + Purchases (GRN) - COGS Shipped - Scrap/Writeoffs
    calculated_yearend_inventory = (
        count_date_inventory_inr_cr + 
        intervening_purchases_grn_cr - 
        intervening_sales_cogs_cr - 
        intervening_scrap_writeoffs_cr
    )
    
    rollforward_variance_cr = abs(calculated_yearend_inventory - balance_sheet_gl_balance_cr)
    is_variance_material = rollforward_variance_cr >= materiality_threshold_cr
    
    return {
        "count_date_verified_cr": count_date_inventory_inr_cr,
        "intervening_additions_purchases_cr": intervening_purchases_grn_cr,
        "intervening_deductions_cogs_cr": intervening_sales_cogs_cr,
        "calculated_balance_sheet_inventory_cr": round(calculated_yearend_inventory, 3),
        "reported_gl_inventory_cr": round(balance_sheet_gl_balance_cr, 3),
        "rollforward_unexplained_variance_cr": round(rollforward_variance_cr, 4),
        "is_material_discrepancy": is_variance_material,
        "audit_finding": "INVENTORY_ACCURATELY_RECONCILED" if not is_variance_material else "MATERIAL_INVENTORY_CUTOFF_MISSTATEMENT_REQUIRES_ADJUSTMENT"
    }

inv_test = audit_sa501_inventory_roll_forward(
    count_date_inventory_inr_cr=145.0, # Physical count on March 25
    count_date="2026-03-25",
    balance_sheet_date="2026-03-31",
    intervening_purchases_grn_cr=12.4,
    intervening_sales_cogs_cr=16.8,
    intervening_scrap_writeoffs_cr=0.6,
    balance_sheet_gl_balance_cr=140.0,
    materiality_threshold_cr=1.0
)
print("SA 501 Physical Inventory Count & Roll-Forward Verification:")
print(f"  Physical Count Value   : INR {inv_test['count_date_verified_cr']} Crores")
print(f"  Intervening Purchases  : +INR {inv_test['intervening_additions_purchases_cr']} Crores")
print(f"  Intervening COGS       : -INR {inv_test['intervening_deductions_cogs_cr']} Crores")
print(f"  Calculated Year-End Inv: INR {inv_test['calculated_balance_sheet_inventory_cr']} Crores")
print(f"  Reported GL Balance    : INR {inv_test['reported_gl_inventory_cr']} Crores")
print(f"  Unreconciled Variance  : INR {inv_test['rollforward_unexplained_variance_cr']} Crores")
print(f"  Audit Status           : {inv_test['audit_finding']}")
''',
            "tryIt": "Increase intervening_sales_cogs_cr to 22.0 Cr to simulate an unrecorded sales surge and observe the roll-forward variance spike, triggering a material cut-off audit finding.",
            "check": {
                "question": "Under SA 501, what is the mandatory statutory procedure required of the external auditor when physical inventory is material to the financial statements?",
                "options": [
                    "The auditor shall attend physical inventory counting unless impracticable, observe management count procedures, inspect the condition of stock, and perform independent test counts",
                    "The auditor is required only to obtain a written email from the warehouse supervisor confirming inventory values",
                    "The auditor must personally weigh and measure 100% of all raw materials in the warehouse",
                    "Attendance at physical inventory counts is optional if the company maintains an annual insurance policy"
                ],
                "answerIndex": 0,
                "why": "SA 501 Paragraph 4 establishes that if inventory is material to the financial statements, the auditor shall obtain sufficient appropriate audit evidence regarding existence and condition by attending physical inventory counting unless impracticable."
            }
        },
        {
            "title": "External Confirmations Architecture & Negative vs Positive Requests: SA 505",
            "say": [
                "Standard on Auditing (SA) 505 deals with the auditor's use of external confirmation procedures to obtain audit evidence in accordance with the requirements of SA 330 and SA 500. External confirmation is defined as audit evidence obtained as a direct written response to the auditor from a third party (the confirming party), in paper form, or by electronic or other medium. External confirmations provide exceptionally high-quality evidence regarding financial assertions, especially existence, rights and obligations, and valuation.",
                "SA 505 distinguishes between two confirmation request structures: (1) Positive Confirmation Request—a request that the confirming party respond directly to the auditor indicating whether the confirming party agrees or disagrees with the information in the request, or providing the requested information (including 'blank' confirmations where the third party fills in the balance); and (2) Negative Confirmation Request—a request that the confirming party respond directly to the auditor only if the confirming party disagrees with the information provided in the request.",
                "Negative confirmations provide substantially less persuasive audit evidence than positive confirmations. Consequently, SA 505 legally prohibits the use of negative confirmation requests as the sole substantive procedure unless ALL four of the following statutory conditions are met: (a) the auditor has assessed the risk of material misstatement as low and has obtained sufficient appropriate audit evidence regarding the operating effectiveness of controls; (b) the population of items subject to negative confirmation procedures comprises a large number of small, homogeneous account balances; (c) a very low exception rate is expected; and (d) the auditor is not aware of circumstances or conditions that would cause recipients of negative confirmation requests to disregard such requests.",
                "Critical Rule on Management Refusal: If management refuses to allow the auditor to send a confirmation request, the auditor shall: (a) inquire as to management's reasons for the refusal, and seek audit evidence as to their validity and reasonableness; (b) evaluate the implications of management's refusal on the auditor's assessment of the relevant risks of material misstatement, including the risk of fraud, and on the nature, timing, and extent of other audit procedures; and (c) perform alternative audit procedures designed to obtain relevant and reliable audit evidence. If the auditor concludes that management's refusal is unreasonable, or the auditor is unable to obtain relevant and reliable audit evidence from alternative procedures, the auditor shall communicate with TCWG and determine the implications for the audit opinion under SA 705."
            ],
            "example": "In auditing trade receivables of Rs 180 Crore, management asks the auditor not to send balance confirmations to its largest customer, arguing that doing so would irritate the customer during sensitive commercial negotiations. The auditor refuses to accept this rationale without independent verification. Applying SA 505, the auditor investigates the customer's background, discovers the customer is an undisclosed related party, and when management continues to block direct confirmation, modifies the audit report due to a management-imposed scope limitation.",
            "code": '''def evaluate_sa505_confirmation_strategy(
    account_type: str, # "CASH_AND_BANK", "TRADE_RECEIVABLES", "TRADE_PAYABLES", "LEGAL_CLAIMS"
    rmm_level: str, # "LOW", "MODERATE", "HIGH"
    homogenous_small_balances: bool,
    management_refused_confirmation: bool,
    alternative_procedures_successful: bool
) -> dict:
    if management_refused_confirmation:
        if not alternative_procedures_successful:
            opinion_impact = "DISCLAIMER_OR_QUALIFIED_OPINION_SA705 (Scope Limitation)"
            protocol = "COMMUNICATE_TO_TCWG_AND_CONSIDER_RESIGNATION_OR_QUALIFICATION"
        else:
            opinion_impact = "REASSESS_FRAUD_RISK_EVALUATE_INTEGRITY_DOCUMENT_ALTERNATIVES"
            protocol = "EXTENSIVE_ALTERNATIVE_TESTING_VOUCHING_SUBSEQUENT_CASH_RECEIPTS"
        return {
            "confirmation_method": "BLOCKED_BY_MANAGEMENT",
            "statutory_compliance": "POTENTIAL_SCOPE_LIMITATION",
            "audit_opinion_impact": opinion_impact,
            "mandatory_action": protocol
        }
        
    # Determine Positive vs Negative Confirmation Validity
    can_use_negative = (
        rmm_level == "LOW" and 
        homogenous_small_balances and 
        account_type in ["TRADE_RECEIVABLES", "UTILITY_CUSTOMERS"]
    )
    
    if can_use_negative:
        chosen_strategy = "NEGATIVE_CONFIRMATION_REQUESTS_PERMITTED"
        persuasiveness = "MODERATE_EVIDENCE"
    else:
        chosen_strategy = "POSITIVE_CONFIRMATION_REQUESTS_MANDATORY"
        persuasiveness = "HIGH_PRIMA_FACIE_EVIDENCE"
        
    return {
        "account_under_audit": account_type,
        "assessed_rmm": rmm_level,
        "confirmation_strategy": chosen_strategy,
        "evidentiary_strength": persuasiveness,
        "direct_auditor_control_mandate": "MANDATORY: Auditor must maintain direct control over dispatch and receipt of responses"
    }

sa505_plan = evaluate_sa505_confirmation_strategy(
    account_type="CASH_AND_BANK",
    rmm_level="HIGH",
    homogenous_small_balances=False,
    management_refused_confirmation=False,
    alternative_procedures_successful=True
)
print("SA 505 External Confirmation Architecture & Decision Engine:")
print(f"  Account Class          : {sa505_plan['account_under_audit']}")
print(f"  Assessed RMM           : {sa505_plan['assessed_rmm']}")
print(f"  Confirmation Strategy  : {sa505_plan['confirmation_strategy']}")
print(f"  Evidentiary Strength   : {sa505_plan['evidentiary_strength']}")
print(f"  Control Protocol       : {sa505_plan['direct_auditor_control_mandate']}")
''',
            "tryIt": "Set management_refused_confirmation to True and alternative_procedures_successful to False to observe the immediate escalation to a Scope Limitation and report qualification under SA 705.",
            "check": {
                "question": "Under SA 505, when is an auditor legally permitted to use Negative Confirmation requests as the sole substantive procedure for auditing accounts receivable?",
                "options": [
                    "Only when ALL four statutory conditions are met: assessed RMM is low and controls are effective; the population consists of large numbers of small, homogeneous balances; very low exception rate is expected; and recipients are unlikely to disregard requests",
                    "Whenever the client requests negative confirmations to save postage costs",
                    "For all bank balances and derivatives positions exceeding Rs 100 Crore",
                    "Whenever the auditor has less than two weeks remaining to complete the annual audit"
                ],
                "answerIndex": 0,
                "why": "SA 505 Paragraph 15 strictly prohibits relying on negative confirmations as the sole substantive audit procedure unless all four cumulative criteria (low RMM, large homogeneous population, low exception rate, high likelihood of response) are satisfied."
            }
        },
        {
            "title": "Substantive Analytical Procedures & Reasonableness Tests: SA 520",
            "say": [
                "Standard on Auditing (SA) 520 deals with the auditor's use of analytical procedures as substantive procedures ('Substantive Analytical Procedures') and as procedures near the end of the audit that assist the auditor when forming an overall conclusion on the financial statements. Analytical procedures are defined as evaluations of financial information through analysis of plausible relationships among both financial and non-financial data, encompassing investigation of identified fluctuations, inconsistent relationships, or amounts that differ from expected values by a significant amount.",
                "Substantive analytical procedures are generally more applicable to large volumes of predictable transactions over time (such as employee payroll expenses, hotel room revenues, depreciation charges, or interest expenses on known debt). When designing and performing substantive analytical procedures, SA 520 mandates that the auditor shall: (1) determine the suitability of particular substantive analytical procedures for given assertions; (2) evaluate the reliability of data from which the auditor's expectation of recorded amounts or ratios is developed; (3) develop an expectation of recorded amounts or ratios and evaluate whether the expectation is sufficiently precise to identify a misstatement; and (4) determine the amount of any difference of recorded amounts from expected values that is acceptable without further investigation (Acceptable Difference Threshold, linked to performance materiality).",
                "The mathematical precision of an auditor's expectation dictates its substantive value. Techniques range from simple trend and ratio analysis to sophisticated reasonableness tests and econometric multi-variable regression models. For instance, in auditing payroll, the auditor does not merely compare this year's total salary to last year's; the auditor builds an independent expectation: (Beginning Headcount + Additions - Departures) * Weighted Average Grade Salaries * Statutory Social Security Rates.",
                "Under SA 520, if analytical procedures identify fluctuations or relationships that are inconsistent with other relevant information or that differ from expected values by a significant amount, the auditor shall investigate such differences by: (a) inquiring of management and obtaining appropriate audit evidence relevant to management's responses; and (b) performing other audit procedures as necessary in the circumstances."
            ],
            "example": "In auditing interest expenses for an enterprise with Rs 500 Crore in long-term bonds, the auditor constructs a Substantive Analytical reasonableness model: multiplying the verified monthly average principal balance by the contractual coupon rates across all debt tranches, predicting expected interest expense of Rs 42.5 Crore. The company reported Rs 38.0 Crore in interest expense—a Rs 4.5 Crore difference exceeding the acceptable variance of Rs 1.5 Crore. The auditor investigates the mismatch, uncovering that management inappropriately capitalized Rs 4.5 Crore of operating interest into construction work-in-progress, violating Ind AS 23.",
            "code": '''def execute_sa520_substantive_analytical_test(
    average_principal_debt_cr: float,
    weighted_contractual_interest_rate_pct: float,
    reported_interest_expense_cr: float,
    performance_materiality_cr: float,
    threshold_factor: float = 0.50 # Tolerable difference typically 50% of PM
) -> dict:
    # 1. Auditor Independent Expectation
    expected_interest_expense_cr = average_principal_debt_cr * (weighted_contractual_interest_rate_pct / 100.0)
    
    # 2. Variance Analysis
    variance_cr = abs(reported_interest_expense_cr - expected_interest_expense_cr)
    variance_pct = (variance_cr / expected_interest_expense_cr) * 100.0 if expected_interest_expense_cr > 0 else 0.0
    
    # 3. Acceptable Difference Limit
    acceptable_difference_cr = performance_materiality_cr * threshold_factor
    
    requires_corroborative_investigation = variance_cr > acceptable_difference_cr
    
    return {
        "auditor_independent_expectation_cr": round(expected_interest_expense_cr, 3),
        "reported_interest_expense_cr": round(reported_interest_expense_cr, 3),
        "absolute_variance_cr": round(variance_cr, 3),
        "percentage_variance": round(variance_pct, 2),
        "acceptable_threshold_cr": round(acceptable_difference_cr, 3),
        "investigation_mandated": requires_corroborative_investigation,
        "audit_verdict": "SIGNIFICANT_ANOMALY_INVESTIGATE_AND_VOUCH" if requires_corroborative_investigation else "REASONABLE_AND_SUBSTANTIATED"
    }

sa520_res = execute_sa520_substantive_analytical_test(
    average_principal_debt_cr=500.0,
    weighted_contractual_interest_rate_pct=8.5,
    reported_interest_expense_cr=38.0,
    performance_materiality_cr=2.5,
    threshold_factor=0.50
)
print("SA 520 Substantive Analytical Reasonableness Testing Engine:")
print(f"  Auditor Expectation    : INR {sa520_res['auditor_independent_expectation_cr']} Crores")
print(f"  Reported Ledger Expense: INR {sa520_res['reported_interest_expense_cr']} Crores")
print(f"  Calculated Variance    : INR {sa520_res['absolute_variance_cr']} Crores ({sa520_res['percentage_variance']}%)")
print(f"  Acceptable Threshold   : INR {sa520_res['acceptable_threshold_cr']} Crores")
print(f"  Investigation Required : {sa520_res['investigation_mandated']}")
print(f"  Audit Action           : {sa520_res['audit_verdict']}")
''',
            "tryIt": "Adjust reported_interest_expense_cr to 42.0 Cr (within the acceptable variance threshold of 1.25 Cr) to observe the analytical test pass without requiring further substantive investigation.",
            "check": {
                "question": "What is the mandatory procedure under SA 520 when a substantive analytical procedure reveals a significant variance between the auditor's independent expectation and the client's reported financial figures?",
                "options": [
                    "The auditor shall investigate the difference by inquiring of management, obtaining corroborative audit evidence to support management's explanations, and performing other necessary audit procedures",
                    "The auditor must immediately alter the mathematical expectation to match the client's ledger",
                    "The auditor can accept management's oral explanation without requesting corroborating documentary proof",
                    "The auditor must notify the local police within 24 hours of detecting any variance"
                ],
                "answerIndex": 0,
                "why": "SA 520 Paragraph 7 explicitly mandates that if analytical procedures identify significant unexplained differences, the auditor shall inquire of management and obtain appropriate audit evidence relevant to management's responses, corroborating all explanations."
            }
        },
        {
            "title": "Overall Analytical Review near Audit Completion: SA 520",
            "say": [
                "Beyond substantive testing during fieldwork, Standard on Auditing (SA) 520 legally mandates that the auditor shall design and perform analytical procedures near the end of the audit that assist the auditor when forming an overall conclusion as to whether the financial statements are consistent with the auditor's understanding of the entity (Final Analytical Review).",
                "The objective of the final analytical review is fundamentally different from preliminary risk assessment or substantive testing. During the final review, the engagement partner and senior team step back from detailed working papers and examine the financial statements as an integrated whole. The conclusions drawn from the results of final analytical procedures are intended to corroborate conclusions formed during the audit of individual components or elements of the financial statements and to assist in arriving at the overall conclusion as to the reasonableness of the financial statements.",
                "The final analytical review must evaluate critical enterprise-level metrics: gross and operating margin stability, working capital velocity (days sales outstanding, inventory turnover days, payables turnover), debt service coverage ratios (DSCR), effective tax rate reconciliations, and unusual balance sheet swings. If the final review identifies previously unrecognized risks of material misstatement—for example, if cash collections suddenly collapse in the fourth quarter despite record reported revenues—the auditor cannot simply issue the audit report.",
                "Under SA 520 and SA 315, when final analytical procedures reveal unanticipated fluctuations or contradictory trends, the auditor must: (1) revise the auditor's preliminary assessment of the risks of material misstatement; and (2) modify the planned audit procedures accordingly, performing additional substantive testing to resolve the contradiction before formulating the final audit opinion."
            ],
            "example": "During the final analytical review of a retail corporation two days before board approval, the engagement partner reviews the consolidated statement of cash flows alongside the P&L. While operating profit increased by 35% to Rs 120 Crore, cash flow from operations plunged from positive Rs 90 Crore to negative Rs 45 Crore, accompanied by a 60% surge in Days Sales Outstanding (DSO) from 45 days to 72 days. Recognizing this divergence as a classic warning sign of channel stuffing or fictitious revenue under SA 240, the partner halts sign-off, orders surprise confirmations of Q4 receivables, and discovers Rs 65 Crore in unbilled, uncollected shipments requiring immediate reversal.",
            "code": '''def execute_sa520_final_overall_analytical_review(
    ebit_current_year_cr: float,
    ebit_prior_year_cr: float,
    cfo_operating_cashflow_current_cr: float,
    cfo_operating_cashflow_prior_cr: float,
    dso_days_current: float,
    dso_days_prior: float,
    gross_margin_pct_current: float,
    gross_margin_pct_prior: float
) -> dict:
    ebit_growth_pct = ((ebit_current_year_cr - ebit_prior_year_cr) / ebit_prior_year_cr) * 100.0
    cfo_growth_pct = ((cfo_operating_cashflow_current_cr - cfo_operating_cashflow_prior_cr) / abs(cfo_operating_cashflow_prior_cr)) * 100.0
    dso_change_days = dso_days_current - dso_days_prior
    gm_change_bps = (gross_margin_pct_current - gross_margin_pct_prior) * 100.0
    
    red_flags = []
    
    # Divergence 1: High profit growth with negative/collapsing cash flows
    if ebit_growth_pct > 15.0 and cfo_operating_cashflow_current_cr < 0:
        red_flags.append("Severe Divergence: Operating profits surging while operating cash flows are negative (Earnings Quality Warning)")
        
    # Divergence 2: Significant expansion in collection days
    if dso_change_days > 15.0:
        red_flags.append(f"Working Capital Deterioration: DSO expanded by {dso_change_days:.1f} days (Potential Channel Stuffing / Bad Debt)")
        
    # Divergence 3: Unexplained gross margin expansion
    if gm_change_bps > 300.0:
        red_flags.append(f"Unusual Margin Surge: Gross margin expanded by {gm_change_bps:.0f} bps without operational justification")
        
    requires_audit_plan_revision = len(red_flags) > 0
    
    return {
        "ebit_growth_pct": round(ebit_growth_pct, 2),
        "cashflow_operating_cr": cfo_operating_cashflow_current_cr,
        "dso_expansion_days": round(dso_change_days, 1),
        "margin_change_basis_points": round(gm_change_bps, 0),
        "unrecognized_risks_detected": requires_audit_plan_revision,
        "identified_red_flags": red_flags,
        "final_clearance": "AUDIT_SIGN_OFF_PROHIBITED_PERFORM_ADDITIONAL_SUBSTANTIVE_WORK" if requires_audit_plan_revision else "OVERALL_FINANCIALS_CONSISTENT_PROCEED_TO_OPINION"
    }

final_review = execute_sa520_final_overall_analytical_review(
    ebit_current_year_cr=120.0,
    ebit_prior_year_cr=88.8, # +35% EBIT growth
    cfo_operating_cashflow_current_cr=-45.0, # Negative operating cash flow
    cfo_operating_cashflow_prior_cr=90.0,
    dso_days_current=72.0,
    dso_days_prior=45.0, # +27 days DSO surge
    gross_margin_pct_current=32.5,
    gross_margin_pct_prior=28.0 # +450 bps margin surge
)
print("SA 520 Final Overall Analytical Review & Governance Cockpit:")
print(f"  Operating Profit Growth : +{final_review['ebit_growth_pct']}%")
print(f"  Operating Cash Flow     : INR {final_review['cashflow_operating_cr']} Crores")
print(f"  DSO Surge               : +{final_review['dso_expansion_days']} days")
print(f"  Margin Expansion        : +{final_review['margin_change_basis_points']} bps")
print(f"  Unrecognized Risks Flag : {final_review['unrecognized_risks_detected']}")
print(f"  Engagement Sign-off Gate: {final_review['final_clearance']}")
print("  Identified Contradictions:")
for f in final_review['identified_red_flags']:
    print(f"    ! {f}")
''',
            "tryIt": "Adjust cfo_operating_cashflow_current_cr to +110.0 Cr and dso_days_current to 47.0 to eliminate the red flags, allowing the final analytical review to clear for sign-off.",
            "check": {
                "question": "What is the primary objective of performing analytical procedures near the end of the audit under SA 520?",
                "options": [
                    "To assist the auditor when forming an overall conclusion as to whether the financial statements as a whole are consistent with the auditor's understanding of the entity",
                    "To calculate the income tax refund due to the company for advance tax installments",
                    "To compute annual executive bonuses under the nomination and remuneration policy",
                    "To file quarterly Goods and Services Tax returns with the GSTN portal"
                ],
                "answerIndex": 0,
                "why": "SA 520 Paragraph 6 mandates that the auditor shall design and perform analytical procedures near the end of the audit to assist in forming an overall conclusion as to whether the financial statements are consistent with the auditor's understanding of the entity."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day08_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day08_data.json successfully!")
