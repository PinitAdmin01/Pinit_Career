"""
Build Day 21 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Assessment Procedures, Scrutiny & Faceless E-Assessment (Sections 142, 143(1), 143(3), 144, 144B)
"""
import json
import os

day_data = {
    "day": 21,
    "title": "Assessment Procedures, Scrutiny & Faceless E-Assessment: Sections 142 to 144B",
    "parts": [
        {
            "title": "Return Processing & Summary Intimation under Section 143(1)",
            "say": [
                "The corporate tax compliance lifecycle shifts from self-assessment to statutory assessment upon the filing of the return of income under Section 139. The initial statutory milestone is the automated electronic processing conducted by the Centralized Processing Centre (CPC) in Bengaluru pursuant to Section 143(1). Unlike formal scrutiny, Section 143(1) processing is a code-driven, rule-based computational audit of the electronically filed return.",
                "Under Section 143(1)(a), the CPC is empowered to make six explicit categories of prima facie adjustments: (1) arithmetic errors in the return, (2) incorrect claims apparent from any information in the return, (3) disallowance of loss claimed if the return was filed beyond the due date specified under Section 139(1), (4) disallowance of expenditure indicated in the audit report (Form 3CD) but not taken into account in computing total income, (5) disallowance of deductions under Section 10AA or Chapter VI-A (under the heading 'C') if the return is filed late, and (6) addition of income appearing in Form 26AS, AIS, or Form 16A that has not been included in the return.",
                "Prior to making any adjustment, the CPC must issue an automated electronic intimation under the first proviso to Section 143(1)(a), granting the taxpayer 30 days to file an online response or submit a rectified return. If the taxpayer fails to respond within 30 days, the proposed additions are automatically confirmed.",
                "The resulting Section 143(1) Intimation details total income, tax determined, interest under Sections 234A, 234B, and 234C, and specifies whether a net tax demand or tax refund is due. The statutory limitation period for sending an intimation under Section 143(1) is strictly nine months from the end of the financial year in which the return was furnished."
            ],
            "example": "A corporate taxpayer files its return on November 15 (due date October 31). It reports business losses of Rs 40 Lakh and claims Chapter VI-A deductions of Rs 10 Lakh. In Form 3CD, the tax auditor noted Rs 5 Lakh of employee PF deposited late. Under Section 143(1)(a), the CPC automatically disallows the Rs 40 Lakh loss carry-forward, disallows the Rs 10 Lakh deduction due to late filing, and adds back the Rs 5 Lakh PF disallowance, generating an automated demand notice.",
            "code": '''def process_sec143_1_intimation(reported_income: float, loss_claimed: float, deduction_claimed: float, auditor_disallowance_3cd: float, is_filed_on_time: bool, cpc_processing_months_from_ye: int) -> dict:
    # Limitation check: Must be within 9 months from end of FY in which return was furnished
    if cpc_processing_months_from_ye > 9:
        return {"valid_intimation": False, "status": "Barred by Limitation: Exceeded 9-month statutory window under Sec 143(1)"}
        
    adjustments = []
    adjusted_income = reported_income
    
    # 1. Auditor Disallowance in Form 3CD not added back
    if auditor_disallowance_3cd > 0:
        adjustments.append(f"Sec 143(1)(a)(iv): Form 3CD disallowance added back (INR {auditor_disallowance_3cd:,.2f})")
        adjusted_income += auditor_disallowance_3cd
        
    # 2. Late filing consequences
    if not is_filed_on_time:
        if loss_claimed > 0:
            adjustments.append(f"Sec 143(1)(a)(iii): Loss carry-forward disallowed due to belated return under Sec 139(1) (INR {loss_claimed:,.2f})")
        if deduction_claimed > 0:
            adjustments.append(f"Sec 143(1)(a)(v): Chapter VI-A / 10AA deductions disallowed due to belated return (INR {deduction_claimed:,.2f})")
            adjusted_income += deduction_claimed
            
    # Compute tax on adjusted income at corporate base rate 25.168% (Sec 115BAA)
    tax_demand = adjusted_income * 0.25168
    
    return {
        "valid_intimation": True,
        "reported_income_inr": reported_income,
        "total_adjustments_count": len(adjustments),
        "adjustments_breakdown": adjustments,
        "adjusted_total_income_inr": adjusted_income,
        "computed_tax_demand_inr": tax_demand,
        "statutory_timeline": "Processed within 9 months"
    }

cpc_res = process_sec143_1_intimation(
    reported_income=5000000.0,
    loss_claimed=4000000.0,
    deduction_claimed=1000000.0,
    auditor_disallowance_3cd=500000.0,
    is_filed_on_time=False,
    cpc_processing_months_from_ye=7
)
print(f"CPC Intimation Valid: {cpc_res['valid_intimation']}")
print(f"Adjusted Total Income: INR {cpc_res['adjusted_total_income_inr']:,.2f}")
print(f"Computed Tax Liability: INR {cpc_res['computed_tax_demand_inr']:,.2f}")
print("Statutory Adjustments Executed:")
for a in cpc_res['adjustments_breakdown']:
    print(f"  -> {a}")
''',
            "tryIt": "Set is_filed_on_time to True to verify that timely filing restores deduction claims and allows valid loss carry-forward under Section 139(1).",
            "check": {
                "question": "What is the statutory limitation period under Section 143(1) for sending an intimation of return processing to the taxpayer?",
                "options": [
                    "Nine months from the end of the financial year in which the return is furnished",
                    "Twelve months from the date of filing the return of income",
                    "Six months from the end of the relevant assessment year",
                    "Twenty-four months from the date of digital signature verification"
                ],
                "answerIndex": 0,
                "why": "The second proviso to Section 143(1) explicitly provides that no intimation shall be sent after the expiry of nine months from the end of the financial year in which the return is made."
            }
        },
        {
            "title": "Inquiry before Assessment & Notice Issuance (Sections 142(1) & 142(2A))",
            "say": [
                "When a tax authority identifies specific discrepancies, high-value transactions, or requires evidentiary verification before framing an assessment, it issues statutory notices under Section 142. Section 142(1) empowers the Assessing Officer (or National Faceless Assessment Centre) to issue notices: (1) calling upon a person who has not filed a return to furnish a return of income, (2) requiring the production of specified books of accounts and documents, and (3) requiring written answers to detailed questionnaires or asset-liability statements.",
                "To ensure taxpayer protection against fishing expeditions, the proviso to Section 142(1) mandates that the Assessing Officer shall not require the production of any books of account relating to a period more than three years prior to the previous year.",
                "Where an assessment involves complex accounts, high transaction volumes, specialized overseas inventory valuations, or suspicions of financial manipulation, the tax authority can order a Special Audit under Section 142(2A). Having regard to the nature and complexity of the accounts, the Principal Chief Commissioner or Chief Commissioner may direct the assessee to get their accounts audited by a nominated external Chartered Accountant.",
                "The nominated special auditor submits an independent audit report in Form 6B within the prescribed period (up to 180 days). Crucially, the Supreme Court in Sahara India (Firm) held that ordering a Special Audit entails civil consequences; therefore, the tax authority must afford the taxpayer a pre-decisional hearing before passing an order under Section 142(2A)."
            ],
            "example": "A conglomerate engaged in multi-state infrastructure projects is selected for scrutiny. Citing 50,000 inter-branch inventory vouchers and complex Ind AS revenue recognition contracts, the Assessing Officer issues a show-cause notice and, with prior PCIT approval, appoints a special auditor under Section 142(2A) to verify PGBP deductions within 90 days.",
            "code": '''def evaluate_sec142_inquiry(books_years_requested: int, has_complex_accounts: bool, pcit_approval_obtained: bool, opportunity_of_hearing_given: bool) -> dict:
    notices = []
    
    # Sec 142(1) Proviso Check: Max 3 prior years
    if books_years_requested > 3:
        notices.append(f"Sec 142(1) Defect: Cannot demand books older than 3 prior years (requested: {books_years_requested} years)")
        sec142_1_valid = False
    else:
        notices.append(f"Sec 142(1) Valid: Book production demand ({books_years_requested} years) within statutory 3-year limit")
        sec142_1_valid = True
        
    # Sec 142(2A) Special Audit Check
    if has_complex_accounts:
        if pcit_approval_obtained and opportunity_of_hearing_given:
            special_audit_status = "Valid: Special Audit ordered under Sec 142(2A) (PCIT approval + Sahara India hearing compliance)"
        else:
            reasons = []
            if not pcit_approval_obtained:
                reasons.append("PCIT approval missing")
            if not opportunity_of_hearing_given:
                reasons.append("Natural justice violated (Sahara India precedent)")
            special_audit_status = f"Invalid: Special Audit quashable ({', '.join(reasons)})"
    else:
        special_audit_status = "Not Applicable: Standard scrutiny assessment"
        
    return {
        "sec142_1_validity": sec142_1_valid,
        "sec142_2a_status": special_audit_status,
        "audit_trail": notices
    }

inquiry_res = evaluate_sec142_inquiry(books_years_requested=2, has_complex_accounts=True, pcit_approval_obtained=True, opportunity_of_hearing_given=True)
print(f"Sec 142(1) Notice Validity: {inquiry_res['sec142_1_validity']}")
print(f"Sec 142(2A) Special Audit Status: {inquiry_res['sec142_2a_status']}")
for n in inquiry_res['audit_trail']:
    print(f"  -> {n}")
''',
            "tryIt": "Set books_years_requested to 5 to observe how the proviso to Section 142(1) invalidates statutory notices demanding accounts older than three prior years.",
            "check": {
                "question": "What is the statutory restriction under the proviso to Section 142(1) regarding the production of books of accounts demanded by an Assessing Officer?",
                "options": [
                    "The Assessing Officer cannot demand the production of books of accounts relating to a period more than three years prior to the previous year",
                    "Books of accounts can never be demanded if the company is audited by a Big Four accounting firm",
                    "The Assessing Officer cannot inspect accounts unless accompanied by a police warrant",
                    "Accounts relating to foreign subsidiaries can only be inspected after 10 years"
                ],
                "answerIndex": 0,
                "why": "The proviso to Section 142(1) strictly bars the Assessing Officer from requiring the production of any books of account relating to a period more than three years prior to the previous year."
            }
        },
        {
            "title": "Regular Scrutiny Assessment (Section 143(3)) & Best Judgment (Section 144)",
            "say": [
                "Section 143(3) governs regular scrutiny assessment—the comprehensive, substantive examination where tax authorities verify the completeness, correctness, and statutory admissibility of income, deductions, and exemptions reported by the corporate assessee. Scrutiny proceedings are formally initiated by serving a notice under Section 143(2).",
                "The service of a valid Section 143(2) notice is a mandatory jurisdictional condition precedent. Under the proviso to Section 143(2), no notice shall be served on the assessee after the expiry of three months from the end of the financial year in which the return is furnished. If the Section 143(2) notice is served even one day after this three-month limitation deadline, the entire subsequent scrutiny assessment order is jurisdictionally void ab initio (Supreme Court in CIT v. Hotel Blue Moon).",
                "During scrutiny, the assessing unit evaluates vouchers, bank statements, transfer pricing studies, depreciation schedules, and statutory registers. If the taxpayer complies with all notices, the officer passes a speaking order under Section 143(3) quantifying assessed income and tax payable.",
                "In contrast, Section 144 mandates a Best Judgment Assessment (ex-parte assessment) when the taxpayer fails to: (a) file a return under Section 139(1), (4), or (5), (b) comply with a Section 142(1) document notice, (c) comply with a Section 142(2A) Special Audit direction, or (d) comply with a Section 143(2) scrutiny notice. In a Best Judgment Assessment, the officer computes income based on available records, industry benchmarks, and reasonable estimation, strictly observing principles of natural justice by issuing a final pre-assessment show-cause notice."
            ],
            "example": "A company files its return on October 31, 2025 (FY 2025-26). The three-month limitation period from the end of FY 2025-26 expires on June 30, 2026. A Section 143(2) notice served on July 5, 2026 is barred by limitation. Under the Hotel Blue Moon precedent, any subsequent scrutiny order passed under Section 143(3) is a legal nullity.",
            "code": '''def evaluate_scrutiny_jurisdiction(fy_return_filed: int, notice_service_date: str, non_compliance_flags: list) -> dict:
    # Limitation deadline: 3 months from end of FY in which return was furnished
    # E.g. FY 2025-26 ends March 31, 2026 -> 3 months = June 30, 2026
    limitation_deadline = f"{fy_return_filed + 1}-06-30"
    is_time_barred = notice_service_date > limitation_deadline
    
    if is_time_barred:
        return {
            "valid_scrutiny_notice": False,
            "notice_served_on": notice_service_date,
            "statutory_deadline": limitation_deadline,
            "assessment_legality": "VOID AB INITIO under CIT v. Hotel Blue Moon (Supreme Court)"
        }
        
    # Check if defaults trigger Best Judgment Assessment under Section 144
    best_judgment_triggered = len(non_compliance_flags) > 0
    if best_judgment_triggered:
        mode = "Best Judgment Assessment under Section 144 (Ex-Parte)"
        reason = f"Defaults triggered: {', '.join(non_compliance_flags)}"
    else:
        mode = "Regular Scrutiny Assessment under Section 143(3)"
        reason = "Assessee fully compliant with all statutory notices"
        
    return {
        "valid_scrutiny_notice": True,
        "notice_served_on": notice_service_date,
        "statutory_deadline": limitation_deadline,
        "assessment_mode": mode,
        "procedural_basis": reason
    }

jurisdiction_check = evaluate_scrutiny_jurisdiction(
    fy_return_filed=2025,
    notice_service_date="2026-06-15",
    non_compliance_flags=[]
)
print(f"Sec 143(2) Notice Valid: {jurisdiction_check['valid_scrutiny_notice']}")
print(f"Limitation Deadline: {jurisdiction_check['statutory_deadline']} (Served: {jurisdiction_check['notice_served_on']})")
print(f"Assessment Mode: {jurisdiction_check['assessment_mode']}")
''',
            "tryIt": "Change notice_service_date to '2026-07-02' to verify that serving the Section 143(2) notice after June 30 makes the assessment void ab initio.",
            "check": {
                "question": "What is the statutory limitation deadline under the proviso to Section 143(2) for serving a regular scrutiny notice on a corporate assessee?",
                "options": [
                    "Three months from the end of the financial year in which the return is furnished",
                    "Six months from the date of filing the income tax return",
                    "Twelve months from the end of the assessment year",
                    "Thirty days from the receipt of the Section 143(1) intimation"
                ],
                "answerIndex": 0,
                "why": "The proviso to Section 143(2) establishes that no notice under Section 143(2) shall be served after the expiry of three months from the end of the financial year in which the return is furnished."
            }
        },
        {
            "title": "Faceless E-Assessment Architecture under Section 144B",
            "say": [
                "The historic paradigm shift in Indian direct tax administration was the introduction of the Faceless Assessment Regime, codified in Section 144B. Enacted to eliminate territorial physical interface between taxpayers and tax officers, curb corruption, and introduce dynamic functional specialization, Section 144B replaced the traditional jurisdictional Assessing Officer with a nationwide electronic assessment network.",
                "The architecture of the National Faceless Assessment Centre (NaFAC) is organized into four specialized electronic functional units: (1) Assessment Units (AU), responsible for identifying issues, analyzing material, and preparing draft assessment orders; (2) Verification Units (VU), conducting electronic inquiries, cross-verification, and digital forensic examinations; (3) Technical Units (TU), providing specialized legal, transfer pricing, valuation, and accounting advice; and (4) Review Units (RU), performing peer review on draft assessment orders to ensure evidentiary soundness.",
                "Under Section 144B(1), all communications between the taxpayer and the income tax department pass exclusively through the electronic portal of NaFAC. Cases are assigned to assessment units across the country using automated algorithmic randomization. Crucially, if an assessment unit proposes an adverse variation (an addition to income or disallowance of deduction), NaFAC must issue a Show Cause Notice along with the draft assessment order, granting the taxpayer an opportunity to respond in writing or request a personal hearing via secure video conferencing.",
                "Section 144B(9) originally declared any assessment not made in accordance with the faceless procedure to be void. While sub-section (9) was subsequently omitted to prevent technical hyper-technical litigation, High Courts consistently set aside orders passed in violation of mandatory show-cause procedures or video hearing denials."
            ],
            "example": "A Mumbai corporate assessee is assessed by an Assessment Unit in Chennai. When the AU proposes disallowing Rs 2 Crore of R&D expenses, NaFAC issues an electronic Show Cause Notice. The taxpayer submits written legal submissions and requests a video hearing. The video hearing is conducted by the Chennai AU via an encrypted portal. The resulting order incorporates the taxpayer's defenses, demonstrating full Section 144B compliance.",
            "code": '''def simulate_faceless_assessment(adverse_variation_cr: float, scn_issued: bool, video_hearing_requested: bool, video_hearing_granted: bool) -> dict:
    workflow = [
        "Step 1: NaFAC receives return; assigns to Assessment Unit (AU) via automated algorithmic allocation",
        "Step 2: AU requests Technical Unit (TU) advice on complex R&D valuation",
        "Step 3: Verification Unit (VU) executes electronic cross-verification of vendor invoices"
    ]
    
    if adverse_variation_cr > 0:
        workflow.append(f"Step 4: Adverse variation of INR {adverse_variation_cr:,.2f} Cr proposed by AU")
        
        if not scn_issued:
            return {
                "valid_order": False,
                "status": "FATAL DEFECT: Violation of Section 144B mandatory Show Cause Notice requirement",
                "audit_trail": workflow
            }
            
        workflow.append("Step 5: NaFAC issues electronic Show Cause Notice with draft variation")
        
        if video_hearing_requested:
            if not video_hearing_granted:
                return {
                    "valid_order": False,
                    "status": "QUASHABLE: Natural justice breach - Video conference hearing requested but denied",
                    "audit_trail": workflow
                }
            workflow.append("Step 6: Video conference hearing conducted through secure NaFAC encrypted link")
            
    workflow.append("Step 7: Review Unit (RU) peer reviews draft order; final assessment order issued by NaFAC")
    return {
        "valid_order": True,
        "status": "Compliant Faceless Assessment Order under Section 144B",
        "audit_trail": workflow
    }

nafac_res = simulate_faceless_assessment(adverse_variation_cr=2.0, scn_issued=True, video_hearing_requested=True, video_hearing_granted=True)
print(f"Faceless Order Validity: {nafac_res['valid_order']}")
print(f"Status: {nafac_res['status']}")
print("NaFAC Electronic Workflow Execution:")
for step in nafac_res['audit_trail']:
    print(f"  {step}")
''',
            "tryIt": "Set video_hearing_granted to False to observe how denying a requested video conference hearing breaches principles of natural justice under Section 144B.",
            "check": {
                "question": "Under the Faceless Assessment architecture in Section 144B, which specialized unit is responsible for conducting electronic inquiries and digital cross-examinations?",
                "options": [
                    "Verification Unit (VU)",
                    "Assessment Unit (AU)",
                    "Review Unit (RU)",
                    "Technical Unit (TU)"
                ],
                "answerIndex": 0,
                "why": "Section 144B(2) assigns the specific function of inquiry, verification, examination of books, and witness recording to the Verification Unit (VU)."
            }
        },
        {
            "title": "Assessment Timelines & Statutory Limitation Schedules (Section 153)",
            "say": [
                "The certainty of corporate financial reporting depends on strict statutory deadlines beyond which tax authorities lose all legal authority to frame or amend assessments. Section 153 of the Income Tax Act establishes absolute time limits for the completion of assessments, reassessments, and recomputations.",
                "For regular assessments under Section 143(3) or Section 144, the general statutory limitation period is 12 months from the end of the assessment year in which the income was first assessable. However, to account for legislative transitions, recent amendments have calibrated these windows: for Assessment Year 2022-23 onwards, assessments must be completed within 12 months (or 9 months in certain transitional periods).",
                "Crucially, Section 153 incorporates explicit statutory extensions: (1) if a reference is made to the Transfer Pricing Officer (TPO) under Section 92CA, the period for completing the assessment is automatically extended by an additional 12 months; (2) where a Special Audit is ordered under Section 142(2A), the period from the direction to the submission of the audit report is excluded; and (3) any period during which assessment proceedings are stayed by an injunction order of any court is strictly excluded.",
                "Corporate tax directors must maintain automated limitation countdown calendars. If the statutory limitation window expires without the service of a valid assessment order, the entire assessment proceeding lapses permanently by operation of law, confirming the returned income as final."
            ],
            "example": "For AY 2024-25, the standard 12-month limitation period under Section 153 from the end of AY (March 31, 2025) expires on March 31, 2026. However, because the company has cross-border transactions and the AO makes a reference to the TPO under Section 92CA, the limitation deadline is automatically extended by 12 months to March 31, 2027.",
            "code": '''def calculate_sec153_limitation_deadline(assessment_year: int, has_tp_reference: bool, stay_months: int, special_audit_days: int) -> dict:
    # Base limitation: 12 months from end of AY
    # E.g. AY 2024-25 ends March 31, 2025 -> Base deadline: March 31, 2026
    ay_end_year = assessment_year + 1
    base_deadline_year = ay_end_year + 1
    
    # TP Reference extension under Sec 153 Proviso / sub-section (4): +12 months
    tp_extension_years = 1 if has_tp_reference else 0
    final_year = base_deadline_year + tp_extension_years
    
    total_months_added = (tp_extension_years * 12) + stay_months
    
    return {
        "assessment_year": f"AY {assessment_year}-{str(assessment_year+1)[-2:]}",
        "base_limitation_deadline": f"{base_deadline_year}-03-31",
        "has_transfer_pricing_reference": has_tp_reference,
        "tp_extended_deadline": f"{final_year}-03-31",
        "additional_stay_months_excluded": stay_months,
        "special_audit_days_excluded": special_audit_days,
        "final_statutory_limitation_date": f"{final_year}-03-31 (plus {stay_months}m {special_audit_days}d exclusions)"
    }

lim_res = calculate_sec153_limitation_deadline(assessment_year=2024, has_tp_reference=True, stay_months=0, special_audit_days=0)
print(f"Limitation Calendar for {lim_res['assessment_year']}:")
print(f"  Base Limitation Deadline : {lim_res['base_deadline_year']}-03-31")
print(f"  TP Reference Extension   : +12 Months under Sec 153(4)")
print(f"  Final Statutory Deadline : {lim_res['tp_extended_deadline']}")
''',
            "tryIt": "Set has_tp_reference to False to observe the limitation deadline snapping back by 12 months to the standard base deadline.",
            "check": {
                "question": "Under Section 153, by how much time is the statutory deadline for completing a scrutiny assessment extended if the Assessing Officer refers an international transaction to the Transfer Pricing Officer (TPO)?",
                "options": [
                    "Extended by an additional 12 months",
                    "Extended by an additional 6 months",
                    "Extended by an additional 24 months",
                    "No extension is granted; the deadline remains unchanged"
                ],
                "answerIndex": 0,
                "why": "The third proviso to Section 153(1) and Section 153(4) explicitly provide that where a reference is made to the Transfer Pricing Officer under Section 92CA, the period for making an assessment order shall be extended by 12 months."
            }
        }
    ]
}

with open("scripts/bcom_tax_day21_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day21_data.json")
