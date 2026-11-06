"""
Build Day 23 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Appeals & Revisions: CIT(Appeals) Sec 246A/250, ITAT Sec 253/254, High Court Sec 260A, Revision Sec 263/264
"""
import json
import os

day_data = {
    "day": 23,
    "title": "Appeals, Revisions & Dispute Resolution Hierarchy: CIT(A), ITAT, High Court & Sec 263/264",
    "parts": [
        {
            "title": "First Appellate Stage: Appeal before CIT(Appeals) under Section 246A & 250",
            "say": [
                "When an adverse assessment order is passed under Section 143(3), Section 144, or Section 147, the taxpayer has the statutory right to file a first appeal before the Commissioner of Income Tax (Appeals) pursuant to Section 246A. The appeal must be electronically lodged in Form 35 on the income tax e-filing portal within 30 days from the date of service of the assessment order and notice of demand under Section 156.",
                "The powers of the CIT(Appeals) under Section 251 are coterminous with those of the Assessing Officer. The CIT(A) does not act merely as an umpire; they can confirm, reduce, enhance, or annul the assessment. Under Section 251(1)(a), the CIT(A) can enhance an assessment or penalty, provided they issue a specific enhancement show-cause notice to the appellant granting an opportunity of being heard.",
                "Production of additional evidence before the CIT(A) is strictly restricted under Rule 46A. A corporate appellant cannot introduce new books, contracts, or foreign invoices unless they establish one of four exceptional statutory circumstances: (a) the AO refused to admit evidence which ought to have been admitted, (b) the appellant was prevented by sufficient cause from producing the evidence called for by the AO, (c) the appellant was prevented by sufficient cause from producing evidence relevant to any ground of appeal, or (d) the assessment order was passed without giving the appellant an opportunity of hearing.",
                "Under Section 250(6B), first appeals are now adjudicated through the Faceless Appeal Scheme, ensuring dynamic, anonymous allocation across national appeal units."
            ],
            "example": "A company is assessed with a Rs 50 Lakh addition under Section 68. Within 30 days, it e-files Form 35 before the Faceless CIT(Appeals). It submits vendor confirmations under Rule 46A(1)(b), proving that severe floods prevented document submission during scrutiny. The CIT(A) admits the evidence, calls for a remand report from the AO, and deletes the addition.",
            "code": '''def evaluate_first_appeal(notice_of_demand_date: str, appeal_filing_date: str, new_evidence_submitted: bool, rule46a_ground_established: bool, enhancement_proposed: bool, enhancement_notice_issued: bool) -> dict:
    from datetime import datetime
    d1 = datetime.strptime(notice_of_demand_date, "%Y-%m-%d")
    d2 = datetime.strptime(appeal_filing_date, "%Y-%m-%d")
    days_elapsed = (d2 - d1).days
    
    is_within_limitation = days_elapsed <= 30
    
    evidence_status = "Admitted" if (not new_evidence_submitted or rule46a_ground_established) else "Inadmissible under Rule 46A"
    
    if enhancement_proposed and not enhancement_notice_issued:
        enhancement_legal = False
        enhancement_finding = "VOID: Cannot enhance assessment without mandatory notice under Sec 251(2)"
    else:
        enhancement_legal = True
        enhancement_finding = "Compliant enhancement procedure" if enhancement_proposed else "No enhancement"
        
    return {
        "days_elapsed": days_elapsed,
        "is_within_30d_limitation": is_within_limitation,
        "limitation_remedy": "File Condonation of Delay petition in Form 35" if not is_within_limitation else "Timely Filed",
        "evidence_admissibility": evidence_status,
        "enhancement_legality": enhancement_finding
    }

appeal_res = evaluate_first_appeal(
    notice_of_demand_date="2026-05-01",
    appeal_filing_date="2026-05-25",
    new_evidence_submitted=True,
    rule46a_ground_established=True,
    enhancement_proposed=False,
    enhancement_notice_issued=False
)
print(f"Appeal Filed Within 30 Days: {appeal_res['is_within_30d_limitation']} ({appeal_res['days_elapsed']} days)")
print(f"Rule 46A Evidence Status: {appeal_res['evidence_admissibility']}")
print(f"Enhancement Ruling: {appeal_res['enhancement_legality']}")
''',
            "tryIt": "Set appeal_filing_date to '2026-06-15' (45 days) to observe the need for a formal Condonation of Delay petition showing sufficient cause.",
            "check": {
                "question": "Under what statutory condition can the CIT(Appeals) enhance an assessment or penalty under Section 251(1)(a)?",
                "options": [
                    "Only after providing the appellant a reasonable opportunity of showing cause against such enhancement under Section 251(2)",
                    "Only if the enhancement is approved in writing by the Central Board of Direct Taxes",
                    "Enhancement is strictly prohibited; CIT(A) can only confirm or reduce an assessment",
                    "Only if the taxpayer withdraws the appeal"
                ],
                "answerIndex": 0,
                "why": "Section 251(2) explicitly mandates that the CIT(Appeals) shall not enhance an assessment or a penalty unless the appellant has had a reasonable opportunity of showing cause against such enhancement."
            }
        },
        {
            "title": "Second Appellate Stage: Income Tax Appellate Tribunal (ITAT) (Sec 253 & 254)",
            "say": [
                "The Income Tax Appellate Tribunal (ITAT), constituted under Section 252, is the second appellate authority and the final fact-finding authority in direct tax jurisprudence. Both the taxpayer and the revenue department (represented by the Commissioner) have the statutory right to appeal before the ITAT under Section 253 against orders passed by the CIT(Appeals), Dispute Resolution Panels (DRP), or revision orders passed by the PCIT under Section 263.",
                "The appeal before the ITAT must be filed in Form 36 within 60 days from the date of communication of the order appealed against. The opposing party has the statutory right to file a Memorandum of Cross-Objections in Form 36A within 30 days of receiving the appeal notice. The ITAT operates as an independent judicial tribunal under the Ministry of Law and Justice, consisting of Judicial Members and Accountant Members sitting in division benches.",
                "Under Section 254(1), the ITAT may, after giving both parties an opportunity of being heard, pass such orders thereon as it thinks fit. Crucially, the factual findings arrived at by the ITAT on appreciation of evidence are conclusive and binding; higher constitutional courts cannot overturn factual findings unless they are proven to be legally perverse.",
                "Under Section 254(2A), the ITAT can grant a stay of demand for a period not exceeding 180 days, provided the taxpayer deposits not less than 20% of the disputed demand or furnishes adequate security. The aggregate period of stay cannot exceed 365 days, even if delay in disposal of the appeal is not attributable to the assessee."
            ],
            "example": "A company is assessed with a Rs 1 Crore transfer pricing adjustment. The CIT(A) upholds the addition. Within 60 days, the company files Form 36 before the ITAT. It deposits 20% of the tax demand (Rs 5 Lakh) and secures an interim stay of demand under Section 254(2A). The ITAT bench examines the functional comparability of benchmarked companies and deletes the entire adjustment on factual grounds.",
            "code": '''def evaluate_itat_appeal_and_stay(order_communication_date: str, itat_filing_date: str, disputed_tax_demand_cr: float, deposit_percentage: float) -> dict:
    from datetime import datetime
    d1 = datetime.strptime(order_communication_date, "%Y-%m-%d")
    d2 = datetime.strptime(itat_filing_date, "%Y-%m-%d")
    days = (d2 - d1).days
    
    is_timely = days <= 60
    
    # Sec 254(2A) Stay Requirement: Min 20% deposit
    min_required_deposit_cr = disputed_tax_demand_cr * 0.20
    actual_deposit_cr = disputed_tax_demand_cr * (deposit_percentage / 100.0)
    stay_eligible = deposit_percentage >= 20.0
    
    return {
        "days_elapsed": days,
        "timely_filed_within_60d": is_timely,
        "disputed_demand_cr": disputed_tax_demand_cr,
        "statutory_min_20pct_deposit_cr": min_required_deposit_cr,
        "actual_deposit_cr": actual_deposit_cr,
        "stay_of_demand_eligible": stay_eligible,
        "max_initial_stay_days": 180,
        "max_aggregate_stay_days": 365
    }

itat_res = evaluate_itat_appeal_and_stay(
    order_communication_date="2026-06-01",
    itat_filing_date="2026-07-15",
    disputed_tax_demand_cr=1.0,
    deposit_percentage=20.0
)
print(f"ITAT Appeal Timely: {itat_res['timely_filed_within_60d']} ({itat_res['days_elapsed']} days <= 60d)")
print(f"Stay of Demand Eligible: {itat_res['stay_of_demand_eligible']} (Deposited: INR {itat_res['actual_deposit_cr']:.2f} Cr >= 20%)")
print(f"Max Initial Stay Duration: {itat_res['max_initial_stay_days']} days (Max cap: {itat_res['max_aggregate_stay_days']} days)")
''',
            "tryIt": "Set deposit_percentage to 15.0% to observe the model flagging non-eligibility for stay of demand under the Section 254(2A) proviso.",
            "check": {
                "question": "Under the first proviso to Section 254(2A), what mandatory condition must an appellant satisfy for the ITAT to grant an order staying recovery of tax demand?",
                "options": [
                    "The assessee must deposit not less than 20% of the disputed tax demand or furnish adequate security",
                    "The assessee must deposit 100% of the disputed demand into an escrow account",
                    "The assessee must obtain a personal guarantee from the Chief Financial Officer",
                    "The assessee must agree to waive all claims for interest on eventual refunds"
                ],
                "answerIndex": 0,
                "why": "The first proviso to Section 254(2A) strictly provides that the ITAT may grant a stay only if the assessee deposits not less than twenty percent of the amount of tax, interest, or penalty, or furnishes security in respect thereof."
            }
        },
        {
            "title": "Substantial Question of Law before High Court & Supreme Court (Sec 260A & 261)",
            "say": [
                "Because the ITAT is the ultimate tribunal of fact, no appeal lies to the High Court against a pure finding of fact. Under Section 260A of the Income Tax Act, an appeal lies to the High Court from every order passed in appeal by the Appellate Tribunal if and only if the High Court is satisfied that the case involves a Substantial Question of Law.",
                "The appeal before the High Court must be filed within 120 days from the date of receipt of the ITAT order. In the landmark ruling Sir Chunilal V. Mehta & Sons Ltd. v. Century Spg. & Mfg. Co. Ltd., the Supreme Court formulated the classic test of a 'substantial question of law': (1) whether it is of general public importance, (2) whether it directly and substantially affects the rights of the parties, and (3) whether it is an open question not settled by the Supreme Court, or where the principle is not free from difficulty.",
                "A finding of fact arrived at by the ITAT gives rise to a question of law only if the finding is perverse—meaning it is based on no evidence, ignores vital documentary material, or arrives at a conclusion that no reasonable person could reach.",
                "From an order of the High Court, an appeal lies to the Supreme Court of India under Section 261, provided the High Court certifies the case to be fit for appeal to the Supreme Court, or through a Special Leave Petition (SLP) under Article 136 of the Constitution of India."
            ],
            "example": "The ITAT rules that software licensing fees paid to an overseas vendor do not constitute 'Royalty' under the India-US DTAA. The revenue department files an appeal under Section 260A before the High Court, framing the question: 'Whether software payments constitute royalty under Article 12?' Because treaty interpretation represents a pure substantial question of law, the High Court admits the appeal.",
            "code": '''def evaluate_high_court_appeal(order_receipt_date: str, appeal_filing_date: str, is_pure_question_of_fact: bool, is_perverse_fact_finding: bool, is_statutory_interpretation: bool) -> dict:
    from datetime import datetime
    d1 = datetime.strptime(order_receipt_date, "%Y-%m-%d")
    d2 = datetime.strptime(appeal_filing_date, "%Y-%m-%d")
    days = (d2 - d1).days
    
    is_timely = days <= 120
    
    # Substantial Question of Law test under Chunilal Mehta
    if is_pure_question_of_fact and not is_perverse_fact_finding:
        admits = False
        reason = "REJECTED: Pure question of fact; ITAT is final fact-finding authority"
    elif is_perverse_fact_finding:
        admits = True
        reason = "ADMITTED: Perverse factual finding constitutes a substantial question of law"
    elif is_statutory_interpretation:
        admits = True
        reason = "ADMITTED: Treaty / statutory interpretation constitutes a substantial question of law"
    else:
        admits = False
        reason = "REJECTED: No substantial question of law formulated"
        
    return {
        "days_elapsed": days,
        "timely_filed_within_120d": is_timely,
        "high_court_admission": admits,
        "judicial_basis": reason
    }

hc_res = evaluate_high_court_appeal(
    order_receipt_date="2026-04-01",
    appeal_filing_date="2026-07-15",
    is_pure_question_of_fact=False,
    is_perverse_fact_finding=False,
    is_statutory_interpretation=True
)
print(f"High Court Appeal Timely: {hc_res['timely_filed_within_120d']} ({hc_res['days_elapsed']} days <= 120d)")
print(f"Admission Status: {hc_res['high_court_admission']}")
print(f"Judicial Finding: {hc_res['judicial_basis']}")
''',
            "tryIt": "Set is_pure_question_of_fact to True and is_statutory_interpretation to False to verify that pure factual disputes cannot be entertained by the High Court under Section 260A.",
            "check": {
                "question": "What is the statutory limitation period for filing an appeal before the High Court under Section 260A against an order of the ITAT?",
                "options": [
                    "120 days from the date of communication of the order of the Appellate Tribunal",
                    "60 days from the date of receipt of the ITAT order",
                    "30 days from the date of the tribunal hearing",
                    "180 days from the close of the financial year"
                ],
                "answerIndex": 0,
                "why": "Section 260A(1) explicitly provides that an appeal shall be filed within one hundred and twenty days from the date on which the order appealed against is received by the assessee or the Principal Chief Commissioner."
            }
        },
        {
            "title": "Revision of Orders: Suo-Moto Revision under Section 263 vs Section 264",
            "say": [
                "Beyond the appellate chain, the Income Tax Act provides administrative oversight mechanisms through the supervisory powers of the Principal Commissioner of Income Tax (PCIT) codified in Section 263 and Section 264.",
                "Section 263 empowers the PCIT to suo-moto call for and examine the record of any proceeding and revise an assessment order passed by the Assessing Officer if the PCIT considers that the order is BOTH 'erroneous' AND 'prejudicial to the interests of the revenue.' In the landmark Supreme Court ruling Malabar Industrial Co. Ltd. v. CIT, the Court held that both conditions must be satisfied cumulatively; an order is not erroneous simply because the AO adopted one of two legally permissible views.",
                "Under Explanation 2 to Section 263, an order is deemed erroneous and prejudicial to revenue if: (a) the order is passed without making inquiries or verification which should have been made, (b) the order allows relief without inquiring into the claim, or (c) the order has not been made in accordance with an order, direction, or circular issued by the CBDT. The limitation period under Section 263(2) is strictly two years from the end of the financial year in which the order sought to be revised was passed.",
                "In contrast, Section 264 provides a benevolent revision mechanism in favor of the taxpayer. The PCIT can revise an order on an application made by the assessee within one year, granting relief where the taxpayer inadvertently omitted to claim a legitimate deduction or relief in the return of income, provided no appeal has been filed before appellate authorities."
            ],
            "example": "An Assessing Officer completes a scrutiny assessment allowing Rs 1 Crore in corporate social responsibility (CSR) deductions without raising any query. Section 37(1) explicitly bars CSR deduction. The PCIT invokes Section 263, holding that the order was passed without inquiry and contrary to statutory law, setting aside the assessment within the 2-year limitation window.",
            "code": '''def evaluate_sec263_revision(is_erroneous: bool, is_prejudicial_to_revenue: bool, fy_order_passed: int, current_fy: int, was_two_views_possible: bool) -> dict:
    years_elapsed = current_fy - fy_order_passed
    is_within_2yr_limitation = years_elapsed <= 2
    
    if not is_within_2yr_limitation:
        return {
            "valid_sec263_order": False,
            "status": "BARRED BY LIMITATION under Sec 263(2): Exceeded 2 years from end of FY in which order was passed"
        }
        
    # Malabar Industrial Co. Ltd. (Supreme Court) Rule: Cumulative test
    if was_two_views_possible:
        return {
            "valid_sec263_order": False,
            "status": "INVALID: AO adopted one of two plausible views; not erroneous under Malabar Industrial doctrine"
        }
        
    if is_erroneous and is_prejudicial_to_revenue:
        return {
            "valid_sec263_order": True,
            "status": "VALID REVISION: Order is both Erroneous AND Prejudicial to Revenue under Section 263"
        }
    else:
        return {
            "valid_sec263_order": False,
            "status": "DEFECTIVE: Both conditions (erroneous and prejudicial) must exist cumulatively"
        }

sec263_res = evaluate_sec263_revision(
    is_erroneous=True,
    is_prejudicial_to_revenue=True,
    fy_order_passed=2024,
    current_fy=2026,
    was_two_views_possible=False
)
print(f"Sec 263 Revision Valid: {sec263_res['valid_sec263_order']}")
print(f"Finding: {sec263_res['status']}")
''',
            "tryIt": "Set was_two_views_possible to True to verify that when an Assessing Officer adopts a legally plausible view, the PCIT cannot invoke Section 263 under the Malabar Industrial precedent.",
            "check": {
                "question": "What twin conditions must be satisfied cumulatively under Section 263 for the Principal Commissioner to revise an assessment order passed by an Assessing Officer?",
                "options": [
                    "The order must be both 'erroneous' AND 'prejudicial to the interests of the revenue'",
                    "The order must involve escaped income exceeding Rs 50 Lakh",
                    "The order must be approved by the Comptroller and Auditor General",
                    "The taxpayer must have filed an affidavit consenting to the revision"
                ],
                "answerIndex": 0,
                "why": "Section 263(1) and the Supreme Court in Malabar Industrial Co. Ltd. establish that the order must satisfy twin cumulative conditions: it must be erroneous, and it must be prejudicial to the interests of the revenue."
            }
        },
        {
            "title": "Dispute Resolution Panel (DRP) Mechanism for MNEs (Section 144C)",
            "say": [
                "Recognizing that multinational corporations and foreign companies faced extensive disruption from immediate demand notices following transfer pricing adjustments, Parliament created an alternative, fast-track dispute resolution channel: the Dispute Resolution Panel (DRP) codified in Section 144C.",
                "Section 144C applies to any 'eligible assessee'—defined as: (a) any foreign company, or (b) any person in whose case a transfer pricing adjustment is proposed by the Transfer Pricing Officer (TPO) under Section 92CA. In such cases, the Assessing Officer is strictly prohibited from passing a final assessment order directly; they must first issue a Draft Assessment Order.",
                "Upon receiving the draft assessment order, the eligible assessee has two statutory options: (1) accept the variations and allow the AO to pass a final order, or (2) file objections before the Dispute Resolution Panel (DRP) within 30 days. The DRP comprises a collegium of three Principal Commissioners or Commissioners of Income Tax.",
                "Under Section 144C(5), the DRP issues binding directions within nine months from the end of the month in which the draft order was forwarded. The Assessing Officer must pass the final assessment order in strict conformity with DRP directions. Crucially, because DRP directions bind the revenue, the department cannot appeal them; however, the taxpayer retains the unilateral right to appeal directly to the ITAT under Section 253(1)(d), bypassing the CIT(Appeals) entirely."
            ],
            "example": "TechCorp India receives a draft assessment order proposing a Rs 15 Crore transfer pricing adjustment. It files objections before the DRP within 30 days. The DRP directs the exclusion of three non-comparable companies. The AO passes a final order reducing the addition to Rs 4 Crore. TechCorp appeals the remaining Rs 4 Crore directly before the ITAT, saving years of first-appeal litigation.",
            "code": '''def execute_drp_workflow(is_eligible_assessee: bool, draft_order_received: bool, objections_filed_days: int, drp_disposal_months: int) -> dict:
    if not is_eligible_assessee:
        return {"drp_applicable": False, "status": "Standard route: Final order passed under Sec 143(3); appeal lies to CIT(A)"}
        
    if not draft_order_received:
        return {"drp_applicable": True, "valid": False, "status": "FATAL DEFECT: Failure to issue Draft Assessment Order under Sec 144C(1)"}
        
    if objections_filed_days > 30:
        return {"drp_applicable": True, "valid": False, "status": "DEFECTIVE: Objections filed beyond 30-day statutory limitation"}
        
    drp_timely = drp_disposal_months <= 9
    
    return {
        "drp_applicable": True,
        "valid": True,
        "objections_filed_within_30d": True,
        "drp_composition": "Collegium of 3 Principal Commissioners / Commissioners of Income Tax",
        "statutory_disposal_window": "9 months from end of month in which draft order was forwarded",
        "drp_timely": drp_timely,
        "binding_on_ao": True,
        "department_appeal_permitted": False,
        "taxpayer_appellate_remedy": "Direct appeal to ITAT under Section 253(1)(d) bypassing CIT(Appeals)"
    }

drp_case = execute_drp_workflow(is_eligible_assessee=True, draft_order_received=True, objections_filed_days=25, drp_disposal_months=8)
print(f"DRP Mechanism Applicable: {drp_case['drp_applicable']}")
print(f"Objections Timely: {drp_case['objections_filed_within_30d']}")
print(f"Binding on AO: {drp_case['binding_on_ao']} (Dept Appeal Barred: {not drp_case['department_appeal_permitted']})")
print(f"Appellate Remedy: {drp_case['taxpayer_appellate_remedy']}")
''',
            "tryIt": "Set objections_filed_days to 35 to observe how missing the strict 30-day objection deadline forfeits the DRP route, forcing the AO to finalize the draft order.",
            "check": {
                "question": "What unique procedural advantage is granted to an eligible corporate assessee who receives an adverse final assessment order passed in conformity with DRP directions under Section 144C?",
                "options": [
                    "The taxpayer can appeal directly to the Income Tax Appellate Tribunal (ITAT) under Section 253(1)(d), bypassing the CIT(Appeals)",
                    "The tax demand is permanently forgiven by the central government",
                    "The taxpayer is exempt from paying corporate tax for the subsequent five years",
                    "The dispute must be settled exclusively through binding international arbitration"
                ],
                "answerIndex": 0,
                "why": "Section 253(1)(d) explicitly provides that an assessee aggrieved by an order passed by an Assessing Officer in pursuance of directions of the Dispute Resolution Panel can appeal directly to the Appellate Tribunal (ITAT)."
            }
        }
    ]
}

with open("scripts/bcom_tax_day23_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day23_data.json")
