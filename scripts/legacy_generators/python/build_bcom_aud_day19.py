"""
Build Day 19 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Going Concern Assessment & Financial Viability: SA 570 Revised, CARO 2020 Clause xix & CARO 2020 Clause xvii
"""
import json

day_data = {
    "day": 19,
    "title": "Going Concern Assessment, Financial Viability & SA 570 Reporting: CARO Clauses xvii & xix",
    "parts": [
        {
            "title": "Going Concern Assumption & SA 570 Revised Responsibilities",
            "say": [
                "Under the Going Concern basis of accounting, financial statements are prepared on the assumption that the entity is a going concern and will continue its operations for the foreseeable future (at least 12 months from the balance sheet date). Assets and liabilities are recorded on the basis that the entity will be able to realize its assets and discharge its liabilities in the normal course of business, rather than at liquidation break-up values.",
                "Standard on Auditing (SA) 570 (Revised), 'Going Concern', deals with the auditor's responsibilities in the audit of financial statements relating to going concern and the implications for the auditor's report. The auditor's responsibilities are: (1) To obtain sufficient appropriate audit evidence regarding, and conclude on, the appropriateness of management's use of the going concern basis of accounting; and (2) To conclude, based on the audit evidence obtained, whether a Material Uncertainty exists related to events or conditions that may cast significant doubt on the entity's ability to continue as a going concern.",
                "The foreseeable future period evaluated by the auditor must cover at least 12 months from the date of the financial statements. If management's assessment of the entity's ability to continue as a going concern covers less than twelve months, SA 570 mandates that the auditor shall request management to extend its assessment period to at least twelve months from that date.",
                "The auditor must independently evaluate whether management has identified all relevant events or conditions, test the underlying data and assumptions in management's cash flow projections, and evaluate mitigating turnaround plans."
            ],
            "example": "An airline company incurs net losses of Rs 420 Crore for the third consecutive year, with current liabilities exceeding current assets by Rs 650 Crore and bond maturities of Rs 300 Crore due in 6 months. Management prepares financial statements on a going concern basis, presenting a draft forecast showing future passenger growth. Under SA 570, the auditor cannot accept this forecast without stress-testing fuel price assumptions and verifying binding bank refinancing commitments. If refinancing is unconfirmed, a Material Uncertainty exists.",
            "code": '''def evaluate_sa570_going_concern_indicators(
    current_ratio: float,
    quick_ratio: float,
    consecutive_loss_years: int,
    net_operating_cash_flow_cr: float,
    debt_maturing_next_12_months_cr: float,
    unencumbered_cash_and_lines_cr: float,
    has_debt_covenant_breach: bool,
    has_loss_of_major_customer: bool
) -> dict:
    red_flags = []
    
    # Financial Indicators under SA 570
    if current_ratio < 1.0:
        red_flags.append("NEGATIVE_NET_WORKING_CAPITAL (CURRENT_RATIO < 1.0)")
    if consecutive_loss_years >= 2:
        red_flags.append(f"CHRONIC_OPERATING_LOSSES ({consecutive_loss_years}_CONSECUTIVE_YEARS)")
    if net_operating_cash_flow_cr < 0:
        red_flags.append("NEGATIVE_OPERATING_CASH_FLOWS")
    if debt_maturing_next_12_months_cr > unencumbered_cash_and_lines_cr:
        refinancing_deficit = debt_maturing_next_12_months_cr - unencumbered_cash_and_lines_cr
        red_flags.append(f"LIQUIDITY_DEFICIT_INR_{refinancing_deficit:.1f}_CR_OVER_NEXT_12_MONTHS")
    if has_debt_covenant_breach:
        red_flags.append("FORMAL_DEBT_COVENANT_DEFAULT_RECALL_RISK")
        
    # Operating Indicators
    if has_loss_of_major_customer:
        red_flags.append("LOSS_OF_KEY_CUSTOMER_OR_PRINCIPAL_MARKET")
        
    severity_score = len(red_flags)
    
    if severity_score >= 3:
        status = "SIGNIFICANT_DOUBT_MATERIAL_UNCERTAINTY_HIGHLY_LIKELY"
        mandate = "DEMAND_12_MONTH_STRESS_TESTED_CASH_FLOWS_AND_BANK_SUPPORT_LETTERS"
    elif severity_score >= 1:
        status = "POTENTIAL_GOING_CONCERN_STRESS_MONITOR_CLOSELY"
        mandate = "EXPAND_SENSITIVITY_ANALYSIS_ON_WORKING_CAPITAL"
    else:
        status = "ROBUST_GOING_CONCERN_METRICS_HEALTHY_LIQUIDITY"
        mandate = "STANDARD_GOING_CONCERN_INQUIRIES"
        
    return {
        "current_ratio": round(current_ratio, 2),
        "operating_cash_flow_cr": net_operating_cash_flow_cr,
        "refinancing_gap_cr": max(0.0, debt_maturing_next_12_months_cr - unencumbered_cash_and_lines_cr),
        "total_red_flags_identified": severity_score,
        "red_flags_list": red_flags,
        "going_concern_status": status,
        "mandated_audit_procedure": mandate
    }

gc_eval = evaluate_sa570_going_concern_indicators(
    current_ratio=0.72,
    quick_ratio=0.45,
    consecutive_loss_years=3,
    net_operating_cash_flow_cr=-180.0,
    debt_maturing_next_12_months_cr=450.0,
    unencumbered_cash_and_lines_cr=120.0,
    has_debt_covenant_breach=True,
    has_loss_of_major_customer=True
)
print("SA 570 Going Concern Indicator Diagnostic Engine:")
print(f"  Current Ratio             : {gc_eval['current_ratio']}")
print(f"  Operating Cash Flow       : INR {gc_eval['operating_cash_flow_cr']} Crores")
print(f"  12-Month Liquidity Deficit: INR {gc_eval['refinancing_gap_cr']} Crores")
print(f"  Red Flags Count           : {gc_eval['total_red_flags_identified']}")
print(f"  Going Concern Assessment  : {gc_eval['going_concern_status']}")
print(f"  Audit Mandate             : {gc_eval['mandated_audit_procedure']}")
print("  Active Going Concern Red Flags:")
for rf in gc_eval['red_flags_list']:
    print(f"    * {rf}")
''',
            "tryIt": "Set consecutive_loss_years to 0, current_ratio to 1.8, operating cash flow to +200.0 Cr, and eliminate covenant breaches to observe going concern metrics return to robust health.",
            "check": {
                "question": "What is the minimum future period that management and the statutory auditor must evaluate when assessing the going concern assumption under SA 570 (Revised)?",
                "options": [
                    "At least 12 months from the date of the financial statements",
                    "Three months from the date of the annual general meeting",
                    "Exactly five years into the future based on unapproved strategic visions",
                    "Until the end of the next calendar month only"
                ],
                "answerIndex": 0,
                "why": "SA 570 Paragraph 13 mandates that the assessment period must cover at least 12 months from the date of the financial statements."
            }
        },
        {
            "title": "Evaluating Management's Mitigation Plans & Cash Flow Stress Testing",
            "say": [
                "When events or conditions have been identified that cast significant doubt on the entity's ability to continue as a going concern, SA 570 mandates that the auditor shall design and perform additional audit procedures to obtain sufficient appropriate audit evidence regarding management's plans for future actions.",
                "The auditor must rigorously analyze management's mitigation plans: (1) Plans to liquidate assets—evaluating whether assets are readily marketable, free of legal encumbrances, and whether sale proceeds will suffice to pay liabilities; (2) Plans to borrow money or restructure debt—verifying executed term sheets, binding bank sanctions, loan agreements, and covenant waivers rather than informal discussions; (3) Plans to reduce or delay expenditures—confirming whether operational cost cuts are feasible without crippling core production; and (4) Plans to increase capital—verifying underwritten rights issues, binding promoter subscription agreements, or escrow deposits.",
                "Furthermore, the auditor must perform independent stress testing on management's 12-month rolling cash flow forecast: evaluating the reliability of underlying data, challenging growth assumptions against industry trends, applying sensitivity analyses to key revenue and cost drivers, and calculating the minimum liquidity buffer (the 'zero-cash date').",
                "If management's plans are unrealistic or lack legally binding execution, the auditor cannot rely on them to eliminate significant doubt."
            ],
            "example": "A retail chain facing a Rs 200 Crore debt maturity claims it will survive by closing 40 unprofitable stores and securing a Rs 150 Crore promoter equity infusion. The auditor inspects the evidence: lease agreements show early store closures trigger Rs 60 Crore in non-cancellable penalty payouts, and the promoter has not deposited funds or secured regulatory shareholder approval. Because management's mitigation plan is legally unexecutable and cash-negative, the auditor concludes that a Material Uncertainty exists.",
            "code": '''def stress_test_going_concern_cash_flow_plan(
    opening_cash_cr: float,
    projected_operating_inflows_cr: float,
    projected_operating_outflows_cr: float,
    debt_service_obligations_cr: float,
    proposed_asset_sales_cr: float,
    asset_sale_legally_binding: bool,
    proposed_equity_infusion_cr: float,
    equity_infusion_in_escrow: bool,
    revenue_stress_haircut_pct: float = 15.0, # 15% downside stress
    opex_stress_inflation_pct: float = 10.0   # 10% cost inflation stress
) -> dict:
    # Baseline Management Plan
    base_inflows = projected_operating_inflows_cr + proposed_asset_sales_cr + proposed_equity_infusion_cr
    base_outflows = projected_operating_outflows_cr + debt_service_obligations_cr
    base_net_cash = opening_cash_cr + base_inflows - base_outflows
    
    # Audited Downside Stress Test under SA 570
    # Discard non-binding mitigation items
    audited_asset_sales = proposed_asset_sales_cr if asset_sale_legally_binding else 0.0
    audited_equity = proposed_equity_infusion_cr if equity_infusion_in_escrow else 0.0
    
    stressed_operating_inflow = projected_operating_inflows_cr * (1.0 - (revenue_stress_haircut_pct / 100.0))
    stressed_operating_outflow = projected_operating_outflows_cr * (1.0 + (opex_stress_inflation_pct / 100.0))
    
    stressed_total_inflows = stressed_operating_inflow + audited_asset_sales + audited_equity
    stressed_total_outflows = stressed_operating_outflow + debt_service_obligations_cr
    stressed_closing_cash = opening_cash_cr + stressed_total_inflows - stressed_total_outflows
    
    plan_viable = stressed_closing_cash > 0.0
    
    return {
        "management_baseline_closing_cash_cr": round(base_net_cash, 2),
        "audited_stressed_closing_cash_cr": round(stressed_closing_cash, 2),
        "discarded_unsubstantiated_inflows_cr": round((proposed_asset_sales_cr - audited_asset_sales) + (proposed_equity_infusion_cr - audited_equity), 2),
        "plan_is_financially_viable": plan_viable,
        "audit_conclusion": "MITIGATION_PLAN_FEASIBLE_GOING_CONCERN_PLAUSIBLE" if plan_viable else "MATERIAL_UNCERTAINTY_EXISTS_PLAN_FAILS_STRESS_TEST",
        "mandated_reporting": "DISCLOSE_MATERIAL_UNCERTAINTY_IN_AUDIT_REPORT_OR_QUALIFY" if not plan_viable else "STANDARD_GOING_CONCERN_NOTE"
    }

stress_test = stress_test_going_concern_cash_flow_plan(
    opening_cash_cr=50.0,
    projected_operating_inflows_cr=800.0,
    projected_operating_outflows_cr=680.0,
    debt_service_obligations_cr=250.0,
    proposed_asset_sales_cr=120.0,
    asset_sale_legally_binding=False,
    proposed_equity_infusion_cr=100.0,
    equity_infusion_in_escrow=False,
    revenue_stress_haircut_pct=15.0,
    opex_stress_inflation_pct=10.0
)
print("SA 570 Mitigation Plan & Downside Cash Flow Stress Testing Engine:")
print(f"  Management Baseline Cash  : INR {stress_test['management_baseline_closing_cash_cr']} Crores (Apparent Surplus)")
print(f"  Audited Stressed Cash     : INR {stress_test['audited_stressed_closing_cash_cr']} Crores (Deficit!)")
print(f"  Discarded Unproven Inflows: INR {stress_test['discarded_unsubstantiated_inflows_cr']} Crores")
print(f"  Plan Feasibility          : {stress_test['plan_is_financially_viable']}")
print(f"  Audit Diagnostic Verdict  : {stress_test['audit_conclusion']}")
print(f"  Reporting Mandate         : {stress_test['mandated_reporting']}")
''',
            "tryIt": "Set asset_sale_legally_binding to True and equity_infusion_in_escrow to True to observe the stressed closing cash turn positive, making the plan viable.",
            "check": {
                "question": "When auditing management's plans to sell assets or secure financing to mitigate going concern distress under SA 570, what must the auditor obtain?",
                "options": [
                    "Sufficient appropriate audit evidence corroborating that the plans are feasible and legally binding, such as executed agreements, bank sanctions, or escrow deposits",
                    "A verbal promise made during a telephone call with the Chief Marketing Officer",
                    "A screenshot of a positive news headline from a financial blog",
                    "An internal management memorandum claiming the stock price will triple"
                ],
                "answerIndex": 0,
                "why": "SA 570 Paragraph 16 mandates that the auditor evaluate whether the outcome of management's plans is likely to improve the situation and whether management's plans are feasible in the circumstances."
            }
        },
        {
            "title": "Audit Reporting Scenarios: Material Uncertainty Related to Going Concern (MURGC)",
            "say": [
                "The formulation of the auditor's opinion and the structure of the auditor's report under SA 570 (Revised) depend strictly on two critical determinations: (1) Is the use of the going concern basis of accounting appropriate? and (2) Does a material uncertainty exist, and is it adequately disclosed in the financial statements?",
                "Scenario A (Going Concern Basis Appropriate, But Material Uncertainty Exists and is Adequately Disclosed): If the auditor concludes that the use of the going concern basis of accounting is appropriate in the circumstances but a material uncertainty exists, AND adequate disclosure about the material uncertainty is made in the financial statements, the auditor shall express an UNMODIFIED OPINION. Crucially, the auditor's report shall include a dedicated, separate section with the mandatory statutory heading: 'Material Uncertainty Related to Going Concern' (MURGC). This section draws attention to the relevant note in the financial statements and states that these events or conditions indicate that a material uncertainty exists that may cast significant doubt on the entity's ability to continue as a going concern, explicitly stating that the auditor's opinion is not modified in respect of this matter.",
                "Scenario B (Material Uncertainty Exists But is NOT Adequately Disclosed): If adequate disclosure about the material uncertainty is NOT made in the financial statements, the auditor shall express a QUALIFIED OPINION or ADVERSE OPINION in accordance with SA 705, stating in the Basis for Qualified (or Adverse) Opinion section that a material uncertainty exists and that the financial statements do not adequately disclose this matter.",
                "Scenario C (Use of Going Concern Basis is Inappropriate): If the financial statements have been prepared using the going concern basis of accounting but, in the auditor's judgment, management's use of the going concern basis is inappropriate (e.g., liquidation is imminent), the auditor shall express an ADVERSE OPINION, regardless of whether or not the financial statements include disclosure of the inappropriateness."
            ],
            "example": "A textile manufacturer incurs heavy losses and violates debt covenants. Management prepares financial statements on a going concern basis and includes Note 38 fully disclosing the covenant defaults and ongoing debt restructuring talks. The auditor agrees that the going concern basis is appropriate because lenders agreed to a standstill, but acknowledges that success is uncertain. The auditor issues a Clean Unmodified Opinion with a prominent 'Material Uncertainty Related to Going Concern' paragraph referencing Note 38.",
            "code": '''def formulate_sa570_audit_reporting_outcome(
    is_going_concern_basis_appropriate: bool,
    material_uncertainty_identified: bool,
    is_material_uncertainty_adequately_disclosed: bool,
    note_reference: str = "Note 38"
) -> dict:
    if not is_going_concern_basis_appropriate:
        opinion_type = "ADVERSE_OPINION (SA 705)"
        section_heading = "Basis for Adverse Opinion"
        report_text = (
            "In our opinion, because of the significance of the matter discussed in the Basis for Adverse Opinion section "
            "of our report, the accompanying financial statements do not give a true and fair view in accordance with "
            "Indian Accounting Standards (Ind AS). The entity's financing has collapsed and management's use of the "
            "going concern basis of accounting is inappropriate."
        )
        has_murgc_section = False
    elif material_uncertainty_identified and is_material_uncertainty_adequately_disclosed:
        opinion_type = "UNMODIFIED_OPINION (CLEAN_OPINION)"
        section_heading = "Material Uncertainty Related to Going Concern"
        report_text = (
            f"We draw attention to {note_reference} in the financial statements, which indicates that the Company incurred a net loss "
            f"of INR 320 Crores during the year ended March 31, 2026, and, as of that date, the Company's current liabilities exceeded "
            f"its current assets by INR 450 Crores. As stated in {note_reference}, these events or conditions, along with other matters "
            f"set forth in {note_reference}, indicate that a material uncertainty exists that may cast significant doubt on the Company's "
            f"ability to continue as a going concern. Our opinion is not modified in respect of this matter."
        )
        has_murgc_section = True
    elif material_uncertainty_identified and not is_material_uncertainty_adequately_disclosed:
        opinion_type = "QUALIFIED_OR_ADVERSE_OPINION (SA 705)"
        section_heading = "Basis for Qualified / Adverse Opinion"
        report_text = (
            "The Company's financing arrangements expire and amounts outstanding are payable on demand. The Company has been unable "
            "to conclude renegotiations. These events indicate that a material uncertainty exists on going concern. The financial "
            "statements do not adequately disclose this matter, resulting in a material misstatement."
        )
        has_murgc_section = False
    else:
        opinion_type = "UNMODIFIED_OPINION (STANDARD_CLEAN)"
        section_heading = "Standard Auditor's Report Sections"
        report_text = "Standard clean audit report; no going concern modifications or MURGC section required."
        has_murgc_section = False
        
    return {
        "opinion_formulation": opinion_type,
        "requires_dedicated_murgc_section": has_murgc_section,
        "statutory_section_heading": section_heading,
        "statutory_report_draft": report_text
    }

audit_scenario_1 = formulate_sa570_audit_reporting_outcome(
    is_going_concern_basis_appropriate=True,
    material_uncertainty_identified=True,
    is_material_uncertainty_adequately_disclosed=True,
    note_reference="Note 38 (Financial Restructuring & Liquidity)"
)

print("SA 570 Revised Audit Opinion Formulation Engine:")
print(f"  Opinion Type          : {audit_scenario_1['opinion_formulation']}")
print(f"  Dedicated MURGC Para  : {audit_scenario_1['requires_dedicated_murgc_section']}")
print(f"  Section Header        : \"{audit_scenario_1['statutory_section_heading']}\"")
print(f"  Draft Report Text     :\n  \"{audit_scenario_1['statutory_report_draft']}\"")
''',
            "tryIt": "Set is_material_uncertainty_adequately_disclosed to False to observe how failure to disclose shifts the opinion to Qualified or Adverse under SA 705.",
            "check": {
                "question": "Under SA 570 (Revised), what is the correct reporting format when the going concern assumption is appropriate, a material uncertainty exists, and management has adequately disclosed the matter in Note 38?",
                "options": [
                    "Express an Unmodified Opinion with a separate, dedicated section headed 'Material Uncertainty Related to Going Concern' referencing Note 38 and stating the opinion is not modified in respect of this matter",
                    "Express a Disclaimer of Opinion and delete the audit report",
                    "Issue an Adverse Opinion and remove all references to the company's directors",
                    "Bury the note inside the Key Audit Matters (KAM) section without any separate heading"
                ],
                "answerIndex": 0,
                "why": "SA 570 Paragraph 22 explicitly prescribes that when material uncertainty is adequately disclosed, the auditor issues an unmodified opinion with a dedicated 'Material Uncertainty Related to Going Concern' section."
            }
        },
        {
            "title": "Statutory Reporting: CARO 2020 Clause (xvii) Cash Losses & Clause (xix) Financial Viability",
            "say": [
                "Beyond the audit opinion under SA 570, the Companies (Auditor's Report) Order, 2020 (CARO 2020) places two critical statutory obligations on auditors regarding financial solvency and going concern: Clause (xvii) Cash Losses and Clause (xix) Financial Liability Viability.",
                "Under CARO 2020 Clause (xvii), the auditor must explicitly state: whether the company has incurred cash losses in the financial year and in the immediately preceding financial year, and if so, state the amount of cash losses. Cash loss is defined as: Net Profit/Loss After Tax plus non-cash expenses (such as depreciation, amortization, and deferred tax expense/credit) minus non-cash income. Incurring cash losses across two consecutive financial years signals acute operational bleeding, alerting lenders and regulators to impending insolvency.",
                "Under CARO 2020 Clause (xix), the auditor must deliver a definitive, forward-looking statutory opinion: whether the auditor is of the opinion that no material uncertainty exists as of the date of the audit report that company is capable of meeting its liabilities existing at the date of balance sheet as and when they fall due within a period of one year from the balance sheet date.",
                "Clause (xix) requires the auditor to evaluate: financial ratios (current ratio, quick ratio, debt-equity ratio); aging and expected dates of realization of financial assets and payment of financial liabilities; other information accompanying the financial statements; the auditor's knowledge of Board plans and debt refinancing; and subsequent events. If the auditor cannot form positive assurance, an explicit adverse statutory qualification is mandatory."
            ],
            "example": "In auditing an automotive components firm, the auditor calculates cash losses: Rs 48 Crore in FY 2025-26 and Rs 32 Crore in FY 2024-25. In evaluating Clause (xix), the company has Rs 180 Crore in bank debt maturing in 7 months, with only Rs 25 Crore in liquid cash and negative operating cash flows. The auditor reports: (1) Under Clause (xvii): cash losses of Rs 48 Crore and Rs 32 Crore; and (2) Under Clause (xix): an adverse remark stating that a material uncertainty exists regarding the company's capability to meet liabilities falling due within one year.",
            "code": '''def evaluate_caro2020_clauses_xvii_and_xix(
    company_name: str,
    pat_current_year_cr: float,
    pat_prior_year_cr: float,
    depr_amort_current_cr: float,
    depr_amort_prior_cr: float,
    current_assets_cr: float,
    current_liabilities_cr: float,
    debts_due_within_1_year_cr: float,
    liquid_cash_and_confirmed_lines_cr: float,
    operating_cash_flow_cr: float
) -> dict:
    # 1. Clause (xvii): Cash Losses Evaluation
    # Cash Loss = PAT + Depreciation + Non-Cash Charges (if negative, it is a cash loss)
    cash_profit_current = pat_current_year_cr + depr_amort_current_cr
    cash_profit_prior = pat_prior_year_cr + depr_amort_prior_cr
    
    has_cash_loss_curr = cash_profit_current < 0
    has_cash_loss_prev = cash_profit_prior < 0
    
    clause_xvii_report = {
        "cash_loss_current_year_cr": round(abs(cash_profit_current), 2) if has_cash_loss_curr else 0.0,
        "cash_loss_prior_year_cr": round(abs(cash_profit_prior), 2) if has_cash_loss_prev else 0.0,
        "incurred_cash_losses": has_cash_loss_curr or has_cash_loss_prev
    }
    
    # 2. Clause (xix): 1-Year Financial Liability Viability
    current_ratio = current_assets_cr / current_liabilities_cr if current_liabilities_cr > 0 else 1.0
    liquidity_gap_cr = debts_due_within_1_year_cr - (liquid_cash_and_confirmed_lines_cr + max(0.0, operating_cash_flow_cr))
    
    is_viable_without_uncertainty = (current_ratio >= 1.0) and (liquidity_gap_cr <= 0.0)
    
    if is_viable_without_uncertainty:
        clause_xix_text = (
            "On the basis of the financial ratios, ageing and expected dates of realization of financial assets and payment of financial "
            "liabilities, other information accompanying the financial statements, our knowledge of the Board of Directors and management plans "
            "and based on our examination of the evidence supporting the assumptions, nothing has come to our attention, which causes us to believe "
            "that any material uncertainty exists as on the date of the audit report that company is not capable of meeting its liabilities existing "
            "at the date of balance sheet as and when they fall due within a period of one year from the balance sheet date."
        )
        clause_xix_status = "POSITIVE_ASSURANCE_COMPLIANT"
    else:
        clause_xix_text = (
            f"On the basis of financial ratios (Current Ratio: {current_ratio:.2f}), cash losses, and a 1-year liquidity gap of "
            f"INR {liquidity_gap_cr:.2f} Crores, we draw attention to the existence of a material uncertainty as on the date of the audit report "
            f"that the Company is capable of meeting its liabilities existing at the date of balance sheet as and when they fall due within one year."
        )
        clause_xix_status = "ADVERSE_QUALIFIED_REMARK_MANDATED"
        
    return {
        "company": company_name,
        "clause_xvii_cash_losses": clause_xvii_report,
        "clause_xix_viability_verdict": clause_xix_status,
        "clause_xix_statutory_report_text": clause_xix_text
    }

caro_res = evaluate_caro2020_clauses_xvii_and_xix(
    company_name="Apex Auto Components Ltd",
    pat_current_year_cr=-95.0,
    pat_prior_year_cr=-65.0,
    depr_amort_current_cr=47.0, # Cash loss = -95 + 47 = -48 Cr
    depr_amort_prior_cr=33.0,   # Cash loss = -65 + 33 = -32 Cr
    current_assets_cr=140.0,
    current_liabilities_cr=260.0, # Current ratio = 0.54
    debts_due_within_1_year_cr=180.0,
    liquid_cash_and_confirmed_lines_cr=25.0,
    operating_cash_flow_cr=-20.0
)
print("CARO 2020 Clause (xvii) Cash Losses & Clause (xix) 1-Year Viability Engine:")
print(f"  Company Name          : {caro_res['company']}")
print(f"  Clause (xvii) Losses  : Current=INR {caro_res['clause_xvii_cash_losses']['cash_loss_current_year_cr']} Cr | Prior=INR {caro_res['clause_xvii_cash_losses']['cash_loss_prior_year_cr']} Cr")
print(f"  Clause (xix) Verdict  : {caro_res['clause_xix_viability_verdict']}")
print("  Statutory CARO 2020 Clause (xix) Audit Remark:")
print(f"  \"{caro_res['clause_xix_statutory_report_text']}\"")
''',
            "tryIt": "Set pat_current_year_cr to +80.0 and current_assets_cr to 350.0 to observe the Clause (xix) verdict turn to positive compliance and cash losses drop to zero.",
            "check": {
                "question": "What is the statutory requirement under Clause (xix) of CARO 2020 regarding the financial liabilities of a company?",
                "options": [
                    "The auditor must state whether in their opinion no material uncertainty exists that the company is capable of meeting liabilities existing at balance sheet date as and when they fall due within one year",
                    "The auditor must guarantee that the company's shares will outperform the Nifty 50 index",
                    "The auditor must pay off any defaulting debts on behalf of the company",
                    "The auditor must verify whether the company bought insurance from a government-owned insurer"
                ],
                "answerIndex": 0,
                "why": "CARO 2020 Clause (xix) explicitly requires the auditor to state whether a material uncertainty exists regarding the company's capability to meet liabilities falling due within one year from the balance sheet date."
            }
        },
        {
            "title": "Comprehensive Going Concern Audit Program & Documentation Dossier",
            "say": [
                "Synthesizing the complete going concern audit under SA 570, SA 230, and CARO 2020 requires the assembly of an exhaustive, unassailable audit dossier. The engagement team must execute and document a 5-step verification process: (1) Initial Risk Assessment—identifying financial, operating, and other indicators of going concern distress during engagement planning; (2) Evaluation of Management's Assessment—verifying that management's assessment period extends at least 12 months from the balance sheet date and challenges underlying assumptions; (3) Cash Flow Modeling & Sensitivity Stress Testing—independently modeling downside scenarios, stripping out non-binding asset sales or uncommitted equity, and determining minimum liquidity thresholds; (4) Mitigation Plan Verification—inspecting executed loan restructuring agreements, formal covenant waivers, and binding bank sanctions; and (5) Audit Reporting Formulation—drafting the MURGC section, modifying the audit opinion under SA 705 if required, and authoring statutory remarks under CARO Clauses (xvii) and (xix).",
                "All communications with Those Charged With Governance (Audit Committee and Board) regarding going concern uncertainties must be conducted in writing and retained in the permanent working paper file under SA 230.",
                "This rigorous documentation ensures that if the entity subsequently faces corporate insolvency under the Insolvency and Bankruptcy Code (IBC, 2016), the statutory auditor can demonstrate total adherence to professional standards and complete legal protection."
            ],
            "example": "In an audit of a stressed infrastructure firm undergoing IBC pre-packaged insolvency, the audit partner reviews the completed 5-step going concern working paper file. The file contains independent cash flow stress tests, minutes of three meetings with the Audit Committee, bank consortium debt restructuring letters, and the draft audit report featuring an unmodified opinion with a detailed MURGC paragraph and CARO Clause (xix) disclosure. The dossier is archived under SA 230, conferring complete statutory assurance defensibility.",
            "code": '''class GoingConcernDossierEngine:
    def __init__(self, client: str, fy: str):
        self.client = client
        self.fy = fy
        self.audit_phases = []
        
    def add_audit_phase(self, phase_name: str, passed: bool, evidence_documented: str):
        self.audit_phases.append({
            "phase": phase_name,
            "status": "PASSED" if passed else "FAILED_DEFICIENT",
            "evidence": evidence_documented
        })
        
    def generate_dossier_status(self) -> dict:
        total_p = len(self.audit_phases)
        passed_p = sum(1 for p in self.audit_phases if p["status"] == "PASSED")
        
        is_ready = total_p == passed_p
        
        return {
            "client_name": self.client,
            "fiscal_year": self.fy,
            "total_phases_evaluated": total_p,
            "passed_phases_count": passed_p,
            "dossier_sign_off_status": "SA570_AUDIT_DOSSIER_COMPLETE_DEFENSIBLE" if is_ready else "DEFICIENT_AUDIT_EVIDENCE_REMEDIATION_REQUIRED",
            "phase_audit_trail": self.audit_phases
        }

dossier_engine = GoingConcernDossierEngine("Zenith Stressed Assets Holding Ltd", "FY 2025-26")
dossier_engine.add_audit_phase("Phase 1: Risk Assessment & Red Flag Diagnostics", True, "SA 570 financial/operating indicators logged.")
dossier_engine.add_audit_phase("Phase 2: Management 12-Month Assessment Inspection", True, "Verified forecast covering full 12-month horizon.")
dossier_engine.add_audit_phase("Phase 3: Downside Cash Flow Stress Testing", True, "Stressed fuel/raw material prices by 15%; verified liquidity floor.")
dossier_engine.add_audit_phase("Phase 4: Bank Covenant Waiver Verification", True, "Executed consortium standstill agreement verified.")
dossier_engine.add_audit_phase("Phase 5: MURGC Drafting & CARO Clause xix Reporting", True, "Formulated MURGC note cross-reference and CARO (xvii)/(xix) text.")

dossier_rep = dossier_engine.generate_dossier_status()
print("SA 570 Going Concern Audit Dossier Sign-Off Engine:")
print(f"  Client Name          : {dossier_rep['client_name']} ({dossier_rep['fiscal_year']})")
print(f"  Phases Completed     : {dossier_rep['passed_phases_count']}/{dossier_rep['total_phases_evaluated']}")
print(f"  Dossier Status       : {dossier_rep['dossier_sign_off_status']}")
print("  Audit Phase Documentation Trace:")
for ph in dossier_rep['phase_audit_trail']:
    print(f"    * {ph['phase']}: [{ph['status']}] -> {ph['evidence']}")
''',
            "tryIt": "Set passed to False for Phase 4 to observe how missing bank waiver documentation blocks audit dossier sign-off.",
            "check": {
                "question": "If an auditor concludes that an entity's going concern basis of accounting is appropriate and a material uncertainty exists that has been adequately disclosed in the financial statements, does this mean the auditor guarantees the entity will survive?",
                "options": [
                    "No, an audit report is never a guarantee of future operational viability; the auditor's opinion provides reasonable assurance on historical financial statements and transparently discloses identified material uncertainties",
                    "Yes, the statutory audit firm must financially reimburse creditors if the entity goes bankrupt within 12 months",
                    "Yes, the audit partner personally guarantees all company debts",
                    "No, because the auditor's report only applies to the day it is printed"
                ],
                "answerIndex": 0,
                "why": "SA 570 Paragraph A2 explicitly clarifies that an auditor cannot predict future events or conditions and the auditor's report does not guarantee the entity's future viability."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day19.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 19 base JSON created successfully.")
