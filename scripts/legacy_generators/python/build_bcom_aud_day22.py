"""
Build Day 22 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Modifications to the Opinion in the Independent Auditor's Report: SA 705 Revised & SA 706 Revised
"""
import json

day_data = {
    "day": 22,
    "title": "Modified Audit Opinions & Supplementary Paragraphs: SA 705 Revised & SA 706 Revised",
    "parts": [
        {
            "title": "The Decision Matrix for Opinion Modifications: SA 705 Revised",
            "say": [
                "Standard on Auditing (SA) 705 (Revised), 'Modifications to the Opinion in the Independent Auditor's Report', establishes the statutory framework and decision matrix when the auditor concludes that an unmodified opinion cannot be issued. SA 705 identifies three distinct types of modified opinions: (1) Qualified Opinion; (2) Adverse Opinion; and (3) Disclaimer of Opinion.",
                "The determination of which type of modified opinion is appropriate depends on two fundamental factors: Factor A—The nature of the matter giving rise to the modification: whether the financial statements are materially misstated (misstatements regarding accounting policies, application, or disclosure); or whether the auditor is unable to obtain sufficient appropriate audit evidence (scope limitation); and Factor B—The auditor's judgment about the Pervasiveness of the effects or possible effects of the matter on the financial statements.",
                "Pervasive effects are defined by SA 705 as those that, in the auditor's judgment: (1) Are not confined to specific elements, accounts, or items of the financial statements; (2) If so confined, represent or could represent a substantial proportion of the financial statements; or (3) In relation to disclosures, are fundamental to users' understanding of the financial statements.",
                "The SA 705 Decision Matrix establishes deterministic outcomes: If financial statements are Material but NOT Pervasive $\\rightarrow$ Qualified Opinion ('Except for'); If Material AND Pervasive due to Misstatement $\\rightarrow$ Adverse Opinion ('Do not give a true and fair view'); If Material AND Pervasive due to Inability to Obtain Evidence $\\rightarrow$ Disclaimer of Opinion ('We do not express an opinion')."
            ],
            "example": "A manufacturing company with Rs 400 Crore in assets fails to record depreciation of Rs 15 Crore on factory machinery (Materiality is Rs 10 Crore). The misstatement is Material because it exceeds materiality, but it is confined strictly to PPE and depreciation expense; it is NOT pervasive across the entire financial statements. Under SA 705, the auditor issues a Qualified Opinion ('except for the effects of the failure to record depreciation...'). Conversely, if inventory of Rs 250 Crore (62% of total assets) is completely fictitious, the misstatement is both Material AND Pervasive, compelling an Adverse Opinion.",
            "code": '''def evaluate_sa705_opinion_decision_matrix(
    misstatement_identified: bool,
    unable_to_obtain_evidence_scope_limitation: bool,
    financial_impact_cr: float,
    overall_materiality_cr: float,
    is_pervasive_across_financials: bool
) -> dict:
    is_material = financial_impact_cr >= overall_materiality_cr
    
    if not is_material:
        opinion_type = "UNMODIFIED_OPINION (SA 700)"
        statutory_wording = "The financial statements give a true and fair view in conformity with Ind AS."
        basis_section = "Basis for Opinion"
    elif misstatement_identified and not is_pervasive_across_financials:
        opinion_type = "QUALIFIED_OPINION (SA 705)"
        statutory_wording = "In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion section..."
        basis_section = "Basis for Qualified Opinion"
    elif misstatement_identified and is_pervasive_across_financials:
        opinion_type = "ADVERSE_OPINION (SA 705)"
        statutory_wording = "In our opinion, because of the significance of the matter described in the Basis for Adverse Opinion section, the financial statements do not give a true and fair view..."
        basis_section = "Basis for Adverse Opinion"
    elif unable_to_obtain_evidence_scope_limitation and not is_pervasive_across_financials:
        opinion_type = "QUALIFIED_OPINION_SCOPE_LIMITATION (SA 705)"
        statutory_wording = "In our opinion, except for the possible effects of the matter described in the Basis for Qualified Opinion section..."
        basis_section = "Basis for Qualified Opinion"
    elif unable_to_obtain_evidence_scope_limitation and is_pervasive_across_financials:
        opinion_type = "DISCLAIMER_OF_OPINION (SA 705)"
        statutory_wording = "We do not express an opinion on the accompanying financial statements. Because of the significance of the matter, we have not been able to obtain sufficient appropriate audit evidence..."
        basis_section = "Basis for Disclaimer of Opinion"
    else:
        opinion_type = "UNMODIFIED_OPINION"
        statutory_wording = "Clean true and fair view."
        basis_section = "Basis for Opinion"
        
    return {
        "is_material": is_material,
        "is_pervasive": is_pervasive_across_financials,
        "concluded_opinion": opinion_type,
        "section_header": basis_section,
        "mandated_report_wording": statutory_wording
    }

matrix_case_1 = evaluate_sa705_opinion_decision_matrix(
    misstatement_identified=True,
    unable_to_obtain_evidence_scope_limitation=False,
    financial_impact_cr=15.0,
    overall_materiality_cr=10.0,
    is_pervasive_across_financials=False
)

matrix_case_2 = evaluate_sa705_opinion_decision_matrix(
    misstatement_identified=True,
    unable_to_obtain_evidence_scope_limitation=False,
    financial_impact_cr=250.0,
    overall_materiality_cr=10.0,
    is_pervasive_across_financials=True
)

matrix_case_3 = evaluate_sa705_opinion_decision_matrix(
    misstatement_identified=False,
    unable_to_obtain_evidence_scope_limitation=True,
    financial_impact_cr=180.0,
    overall_materiality_cr=10.0,
    is_pervasive_across_financials=True
)

print("SA 705 Revised Opinion Decision Matrix Engine:")
for idx, c in enumerate([matrix_case_1, matrix_case_2, matrix_case_3], 1):
    print(f"  Case {idx}: Material={c['is_material']} | Pervasive={c['is_pervasive']} -> Concluded: [{c['concluded_opinion']}]")
    print(f"    * Section Header: {c['section_header']}")
    print(f"    * Report Wording: \"{c['mandated_report_wording']}\"")
''',
            "tryIt": "Set is_pervasive_across_financials to False in Case 2 to observe the opinion transform from Adverse to Qualified.",
            "check": {
                "question": "Under SA 705 (Revised), what type of audit opinion must be expressed when a material misstatement exists that is both Material AND Pervasive to the financial statements?",
                "options": [
                    "An Adverse Opinion stating that the financial statements do not give a true and fair view",
                    "A Qualified Opinion with an 'except for' paragraph",
                    "A Clean Unmodified Opinion with a Key Audit Matter paragraph",
                    "A Disclaimer of Opinion stating that the auditor was on leave"
                ],
                "answerIndex": 0,
                "why": "SA 705 Paragraph 8 mandates that the auditor shall express an adverse opinion when the auditor obtains sufficient evidence that misstatements are both material and pervasive."
            }
        },
        {
            "title": "Qualified Opinion Drafting & Quantification: SA 705",
            "say": [
                "When expressing a Qualified Opinion under SA 705, the auditor's report must feature precise structural modifications: (1) The heading of the opinion section must explicitly state 'Qualified Opinion'; (2) The opinion paragraph must state that, 'in our opinion, except for the effects of the matter(s) described in the Basis for Qualified Opinion section, the accompanying financial statements give a true and fair view...'; and (3) The Basis for Opinion section must be retitled 'Basis for Qualified Opinion' and placed immediately following the Qualified Opinion.",
                "In the 'Basis for Qualified Opinion' section, SA 705 Paragraph 21 legally requires the auditor to: (a) describe the specific reasons for the modification; (b) quantify the financial effects of the misstatement on the relevant balance sheet and profit and loss line items, unless impracticable; (c) if the misstatement relates to narrative disclosures, include an explanation of how the disclosures are misstated; and (d) if the modification arises from an inability to obtain sufficient appropriate audit evidence, describe the nature and circumstances of the scope limitation.",
                "Quantification of financial effects is a strict legal requirement. The auditor cannot merely state that 'inventory might be inaccurate'; the auditor must state: 'Inventory is overstated by Rs 18.5 Crore, deferred tax liabilities are overstated by Rs 4.6 Crore, and net profit for the year is overstated by Rs 13.9 Crore.'",
                "If it is not practicable to quantify the financial effects, the auditor shall explicitly state in the Basis for Qualified Opinion section why quantification was impossible."
            ],
            "example": "In an audit of a retail distributor, the client failed to consolidate an offshore SPV holding Rs 28 Crore in trade payables and Rs 22 Crore in losses. The auditor quantifies the misstatement: consolidating the SPV would increase current liabilities by Rs 28 Crore and reduce net profit by Rs 22 Crore. The auditor drafts the Basis for Qualified Opinion containing the full quantified impact table and issues a Qualified Opinion under SA 705.",
            "code": '''def draft_sa705_qualified_opinion_basis(
    matter_title: str,
    accounting_standard_violated: str,
    overstated_asset_account: str,
    asset_overstatement_cr: float,
    tax_rate_pct: float = 25.17
) -> dict:
    tax_impact_cr = round(asset_overstatement_cr * (tax_rate_pct / 100.0), 2)
    net_pat_impact_cr = round(asset_overstatement_cr - tax_impact_cr, 2)
    
    basis_draft = (
        f"The Company has not recorded write-downs for obsolete inventory as required by {accounting_standard_violated}. "
        f"The Company's records indicate that inventory is carried at cost, which exceeds net realizable value by "
        f"INR {asset_overstatement_cr:.2f} Crores. Consequently, {overstated_asset_account} is overstated by INR {asset_overstatement_cr:.2f} Crores, "
        f"deferred tax liability is overstated by INR {tax_impact_cr:.2f} Crores, and profit after tax and shareholders' equity "
        f"are overstated by INR {net_pat_impact_cr:.2f} Crores for the year ended March 31, 2026."
    )
    
    opinion_draft = (
        "In our opinion and to the best of our information and according to the explanations given to us, except for the effects "
        "of the matter described in the Basis for Qualified Opinion section of our report, the accompanying financial statements "
        "give a true and fair view in conformity with Indian Accounting Standards (Ind AS)."
    )
    
    return {
        "title": "Basis for Qualified Opinion",
        "standard_violated": accounting_standard_violated,
        "quantified_asset_error_cr": asset_overstatement_cr,
        "quantified_tax_error_cr": tax_impact_cr,
        "quantified_pat_error_cr": net_pat_impact_cr,
        "statutory_basis_text": basis_draft,
        "statutory_qualified_opinion_text": opinion_draft
    }

qual_draft = draft_sa705_qualified_opinion_basis(
    matter_title="Failure to record inventory NRV impairment",
    accounting_standard_violated="Ind AS 2 (Inventories)",
    overstated_asset_account="Inventories",
    asset_overstatement_cr=18.5,
    tax_rate_pct=25.17
)
print("SA 705 Qualified Opinion & Quantified Basis Generator:")
print(f"  Standard Violated     : {qual_draft['standard_violated']}")
print(f"  Asset Overstatement   : INR {qual_draft['quantified_asset_error_cr']} Crores")
print(f"  Tax Impact Calculated : INR {qual_draft['quantified_tax_error_cr']} Crores")
print(f"  Net Profit Distortion : INR {qual_draft['quantified_pat_error_cr']} Crores")
print("  Statutory Basis for Qualified Opinion Text:")
print(f"  \"{qual_draft['statutory_basis_text']}\"")
print("  Statutory Qualified Opinion Paragraph:")
print(f"  \"{qual_draft['statutory_qualified_opinion_text']}\"")
''',
            "tryIt": "Change asset_overstatement_cr to 45.0 to observe how the tax impact and net profit distortion are automatically recalculated.",
            "check": {
                "question": "What is the statutory requirement under SA 705 Paragraph 21 regarding the quantification of financial effects in a Basis for Qualified Opinion section?",
                "options": [
                    "The auditor must quantify the financial effects of the misstatement on the financial statements unless it is impracticable to do so",
                    "The auditor is strictly prohibited from mentioning any monetary numbers",
                    "The auditor can only provide estimates in percentage terms without currency",
                    "The auditor only quantifies if the company agrees in advance"
                ],
                "answerIndex": 0,
                "why": "SA 705 Paragraph 21 explicitly requires the auditor to quantify the financial effects on the relevant line items unless impracticable, ensuring complete stakeholder transparency."
            }
        },
        {
            "title": "Adverse Opinions & Disclaimers of Opinion: Pervasive Impacts",
            "say": [
                "An Adverse Opinion and a Disclaimer of Opinion represent the two ultimate measures of audit modification, reserved for situations of pervasive distortion or total evidentiary failure.",
                "Under SA 705 Paragraph 8, the auditor shall express an Adverse Opinion when the auditor, having obtained sufficient appropriate audit evidence, concludes that misstatements, individually or in aggregate, are BOTH material and pervasive to the financial statements. The opinion paragraph states: 'In our opinion, because of the significance of the matter(s) described in the Basis for Adverse Opinion section, the accompanying financial statements do not give a true and fair view...' Typical triggers include: failure to consolidate major subsidiaries representing 70% of enterprise revenues; preparing financial statements on a going concern basis when liquidation is imminent; or pervasive multi-year fabrication of sales, assets, and liabilities.",
                "Under SA 705 Paragraph 9, the auditor shall Disclaim an Opinion when the auditor is unable to obtain sufficient appropriate audit evidence on which to base the opinion, and the auditor concludes that the possible effects on the financial statements of undetected misstatements, if any, could be BOTH material and pervasive. In a disclaimer, the opening paragraph does NOT say 'we have audited'; instead, it states: 'We were engaged to audit the accompanying financial statements...' Furthermore, the opinion paragraph states: 'We do not express an opinion on the accompanying financial statements.'",
                "Crucially, when disclaiming an opinion, the auditor shall NOT include a Key Audit Matters (KAM) section under SA 701, nor shall the auditor include an opinion on internal financial controls under Section 143(3)(i) unless sufficient evidence exists."
            ],
            "example": "A commercial conglomerate suffers a catastrophic fire that destroys its corporate headquarters, wiping out all physical paper books, computer server drives, and backup systems. Management reconstructs financial statements from bank statements and memory. The auditor cannot verify revenue, expenses, inventories, fixed assets, or payables. Because the scope limitation is both Material AND Pervasive, the auditor issues a formal Disclaimer of Opinion under SA 705.",
            "code": '''def evaluate_adverse_vs_disclaimer_protocols(
    matter_type: str, # "PERVASIVE_FRAUD_AND_MISSTATEMENT" or "PERVASIVE_DESTRUCTION_OF_RECORDS_SCOPE_LIMITATION"
    client_name: str
) -> dict:
    if matter_type == "PERVASIVE_FRAUD_AND_MISSTATEMENT":
        opinion_name = "ADVERSE_OPINION (SA 705)"
        opening_sentence = "We have audited the accompanying financial statements..."
        opinion_sentence = (
            "In our opinion, because of the significance of the matters described in the Basis for Adverse Opinion section, "
            "the accompanying financial statements do not give a true and fair view in accordance with Indian Accounting Standards."
        )
        include_kam_section = True # KAM permitted in Adverse, but not in Disclaimer
        basis_section_title = "Basis for Adverse Opinion"
    else:
        opinion_name = "DISCLAIMER_OF_OPINION (SA 705)"
        opening_sentence = "We were engaged to audit the accompanying financial statements..."
        opinion_sentence = (
            "We do not express an opinion on the accompanying financial statements. Because of the significance of the matter "
            "described in the Basis for Disclaimer of Opinion section, we have not been able to obtain sufficient appropriate "
            "audit evidence to provide a basis for an audit opinion."
        )
        include_kam_section = False # Strictly PROHIBITED under SA 705 Paragraph 29 & SA 701
        basis_section_title = "Basis for Disclaimer of Opinion"
        
    return {
        "client": client_name,
        "opinion_type": opinion_name,
        "opening_wording": opening_sentence,
        "opinion_wording": opinion_sentence,
        "basis_title": basis_section_title,
        "include_kam_under_sa701": include_kam_section
    }

adverse_case = evaluate_adverse_vs_disclaimer_protocols("PERVASIVE_FRAUD_AND_MISSTATEMENT", "Apex Pervasive Fraud Ltd")
disclaimer_case = evaluate_adverse_vs_disclaimer_protocols("PERVASIVE_DESTRUCTION_OF_RECORDS_SCOPE_LIMITATION", "Zenith Fire-Destroyed Records Ltd")

print("SA 705 Adverse Opinion vs Disclaimer of Opinion Protocol Engine:")
print(f"  [1] Adverse Case: {adverse_case['client']}")
print(f"      * Opinion Type  : {adverse_case['opinion_type']}")
print(f"      * Opening Text  : \"{adverse_case['opening_wording']}\"")
print(f"      * Opinion Text  : \"{adverse_case['opinion_wording']}\"")
print(f"      * Include KAM   : {adverse_case['include_kam_under_sa701']}")
print(f"  [2] Disclaimer Case: {disclaimer_case['client']}")
print(f"      * Opinion Type  : {disclaimer_case['opinion_type']}")
print(f"      * Opening Text  : \"{disclaimer_case['opening_wording']}\"")
print(f"      * Opinion Text  : \"{disclaimer_case['opinion_wording']}\"")
print(f"      * Include KAM   : {disclaimer_case['include_kam_under_sa701']} (PROHIBITED)")
''',
            "tryIt": "Observe how include_kam_under_sa701 is False for Disclaimer of Opinion because an auditor who disclaims cannot report Key Audit Matters.",
            "check": {
                "question": "Can an auditor include a Key Audit Matters (KAM) section in an audit report that contains a Disclaimer of Opinion under SA 705 and SA 701?",
                "options": [
                    "No, SA 705 Paragraph 29 and SA 701 strictly prohibit the auditor from including a Key Audit Matters section when an opinion on the financial statements is disclaimed",
                    "Yes, a KAM section is always mandatory for every company in the world",
                    "Yes, provided the KAM section contains at least 10 matters",
                    "Only if the Audit Committee pays an extra statutory advisory fee"
                ],
                "answerIndex": 0,
                "why": "SA 705 Paragraph 29 and SA 701 Paragraph 11 prohibit including a KAM section when the auditor disclaims an opinion, to prevent confusing users about the absence of assurance."
            }
        },
        {
            "title": "Emphasis of Matter & Other Matter Paragraphs: SA 706 Revised",
            "say": [
                "Standard on Auditing (SA) 706 (Revised), 'Emphasis of Matter Paragraphs and Other Matter Paragraphs in the Independent Auditor's Report', governs supplementary communications in the audit report that do NOT modify the auditor's opinion.",
                "An Emphasis of Matter (EoM) paragraph is a paragraph included in the auditor's report that refers to a matter appropriately presented or disclosed in the financial statements that, in the auditor's judgment, is of such importance that it is fundamental to users' understanding of the financial statements. The golden rule of EoM is: (1) The matter MUST be appropriately presented or disclosed in the financial statements; (2) The auditor's opinion is NOT modified in respect of the matter; and (3) The matter has NOT been determined to be a Key Audit Matter under SA 701.",
                "Examples of EoM triggers include: an uncertainty relating to the future outcome of an exceptional litigation or regulatory action; early application of a new accounting standard; or a major catastrophe that has had a significant effect on the entity's financial position.",
                "An Other Matter (OM) paragraph is a paragraph included in the auditor's report that refers to a matter OTHER than those presented or disclosed in the financial statements that is relevant to users' understanding of the audit, the auditor's responsibilities, or the auditor's report (e.g., reporting on comparative figures audited by another predecessor auditor under SA 710; or reporting on joint audits under SA 299).",
                "Both paragraphs must have explicit statutory headings ('Emphasis of Matter' and 'Other Matter') and state that the auditor's opinion is not modified."
            ],
            "example": "A chemical manufacturer is named in an environmental lawsuit claiming damages of Rs 250 Crore. Legal counsel advises that the probability of liability is 50%, so management discloses a contingent liability in Note 36 in accordance with Ind AS 37. The auditor determines the disclosure is complete. Because the potential liability is fundamental to users' understanding, the auditor includes an Emphasis of Matter paragraph drawing attention to Note 36 and explicitly stating that 'our opinion is not modified in respect of this matter'.",
            "code": '''def formulate_sa706_supplementary_paragraphs(
    matter_description: str,
    is_disclosed_in_financial_statements: bool,
    note_reference: str,
    is_matter_fundamental_to_understanding: bool,
    is_matter_a_key_audit_matter: bool,
    refers_to_auditor_responsibilities_or_predecessor: bool
) -> dict:
    if is_matter_a_key_audit_matter:
        paragraph_type = "REPORT_UNDER_SA701_KEY_AUDIT_MATTERS"
        report_text = "Matter is reported under SA 701 KAM section; EoM paragraph is NOT permitted under SA 706."
    elif is_disclosed_in_financial_statements and is_matter_fundamental_to_understanding:
        paragraph_type = "EMPHASIS_OF_MATTER_PARAGRAPH (SA 706)"
        report_text = (
            f"Emphasis of Matter\\n"
            f"We draw attention to {note_reference} of the financial statements, which describes {matter_description}. "
            f"Our opinion is not modified in respect of this matter."
        )
    elif refers_to_auditor_responsibilities_or_predecessor:
        paragraph_type = "OTHER_MATTER_PARAGRAPH (SA 706)"
        report_text = (
            f"Other Matter\\n"
            f"The financial statements of the Company for the year ended March 31, 2025, were audited by another auditor "
            f"who expressed an unmodified opinion on those statements on May 12, 2025."
        )
    else:
        paragraph_type = "NO_SUPPLEMENTARY_PARAGRAPH_REQUIRED"
        report_text = "Standard presentation."
        
    return {
        "matter": matter_description,
        "concluded_paragraph_type": paragraph_type,
        "opinion_remains_unmodified": True,
        "statutory_draft_text": report_text
    }

eom_case = formulate_sa706_supplementary_paragraphs(
    matter_description="the uncertainty relating to the final outcome of the environmental lawsuit filed by the Pollution Control Board",
    is_disclosed_in_financial_statements=True,
    note_reference="Note 36 (Contingent Liabilities)",
    is_matter_fundamental_to_understanding=True,
    is_matter_a_key_audit_matter=False,
    refers_to_auditor_responsibilities_or_predecessor=False
)

om_case = formulate_sa706_supplementary_paragraphs(
    matter_description="Predecessor auditor reliance",
    is_disclosed_in_financial_statements=False,
    note_reference="N/A",
    is_matter_fundamental_to_understanding=False,
    is_matter_a_key_audit_matter=False,
    refers_to_auditor_responsibilities_or_predecessor=True
)

print("SA 706 Revised Supplementary Paragraphs Engine (EoM vs OM):")
print(f"  [1] EoM Output: {eom_case['concluded_paragraph_type']}")
print(f"  \"{eom_case['statutory_draft_text']}\"")
print(f"  [2] OM Output : {om_case['concluded_paragraph_type']}")
print(f"  \"{om_case['statutory_draft_text']}\"")
''',
            "tryIt": "Set is_matter_a_key_audit_matter to True to observe how SA 706 prohibits EoM when a matter is already reported as a KAM under SA 701.",
            "check": {
                "question": "What is the critical distinction between an Emphasis of Matter (EoM) paragraph and an Other Matter (OM) paragraph under SA 706 (Revised)?",
                "options": [
                    "An EoM paragraph refers to a matter appropriately presented or disclosed in the financial statements that is fundamental to users' understanding; an OM paragraph refers to matters not disclosed in the financial statements that are relevant to users' understanding of the audit or auditor's responsibilities",
                    "An EoM paragraph modifies the audit opinion to qualified, whereas an OM paragraph modifies it to adverse",
                    "An EoM paragraph is only for tax disputes, while an OM paragraph is only for inventory theft",
                    "There is no difference; the terms are interchangeable synonyms"
                ],
                "answerIndex": 0,
                "why": "SA 706 Paragraphs 5 and 7 explicitly define EoM as matters disclosed in the financial statements, and OM as matters not disclosed in the financial statements relevant to audit understanding."
            }
        },
        {
            "title": "Comprehensive Audit Opinion Formulation & Modification Dossier",
            "say": [
                "The formulation of the final audit opinion represents the ultimate synthesis of all audit evidence assembled across the entire engagement. Under SA 230 and SA 700/705/706, the engagement team must assemble a permanent Opinion Formulation Dossier.",
                "The dossier must document: (1) The Summary of Unadjusted Audit Differences (SUAD) and its comparison against materiality and performance materiality; (2) Detailed technical memos explaining the rationale for opinion modification (or non-modification); (3) The evaluation of pervasiveness; (4) The drafting and legal verification of Basis for Modification paragraphs; (5) Documentation of communications with the Audit Committee and Board regarding proposed modifications under SA 260; and (6) The formal sign-off by the Engagement Quality Control Reviewer (EQCR) under SA 220.",
                "This exhaustive archival provides complete legal protection under the National Financial Reporting Authority (NFRA) enforcement rules and ICAI disciplinary mechanisms, establishing that the auditor acted with absolute independence, technical competence, and ethical integrity."
            ],
            "example": "In finalizing the opinion dossier for a manufacturing conglomerate, the audit team documents why a Rs 22 Crore revenue cutoff misstatement was qualified under SA 705 rather than resulting in an adverse opinion: the error was material (exceeding Rs 15 Crore materiality) but confined strictly to trade receivables and sales, leaving fixed assets, debt, and cash balances uncorrupted (not pervasive). The partner and EQCR approve the dossier.",
            "code": '''class OpinionFormulationDossierEngine:
    def __init__(self, client_name: str, pbt_cr: float):
        self.client = client_name
        self.pbt_cr = pbt_cr
        self.mat_cr = pbt_cr * 0.05
        self.pm_cr = self.mat_cr * 0.65
        self.unadjusted_differences = []
        
    def add_unadjusted_difference(self, account: str, error_amount_cr: float, is_pervasive: bool, description: str):
        self.unadjusted_differences.append({
            "account": account,
            "error_cr": error_amount_cr,
            "pervasive": is_pervasive,
            "details": description
        })
        
    def conclude_audit_opinion_dossier(self) -> dict:
        total_error = sum(d["error_cr"] for d in self.unadjusted_differences)
        any_pervasive = any(d["pervasive"] for d in self.unadjusted_differences)
        
        is_material = total_error >= self.mat_cr
        
        if not is_material:
            opinion = "UNMODIFIED_OPINION (SA 700)"
            action = "ISSUE_STANDARD_CLEAN_REPORT"
        elif is_material and not any_pervasive:
            opinion = "QUALIFIED_OPINION (SA 705)"
            action = "DRAFT_QUANTIFIED_BASIS_FOR_QUALIFIED_OPINION"
        else:
            opinion = "ADVERSE_OPINION (SA 705)"
            action = "DRAFT_BASIS_FOR_ADVERSE_OPINION_NOTIFY_REGULATORS"
            
        return {
            "client": self.client,
            "overall_materiality_cr": round(self.mat_cr, 2),
            "performance_materiality_cr": round(self.pm_cr, 2),
            "total_unadjusted_error_cr": round(total_error, 2),
            "is_error_material": is_material,
            "has_pervasive_impact": any_pervasive,
            "final_opinion_verdict": opinion,
            "mandated_action": action,
            "differences_log": self.unadjusted_differences
        }

dossier_sim = OpinionFormulationDossierEngine("Apex Heavy Industries Ltd", pbt_cr=300.0)
dossier_sim.add_unadjusted_difference("Trade Receivables & Revenue Cutoff", 22.0, False, " premature invoice recognition post March 31 without physical dispatch")

conclusion = dossier_sim.conclude_audit_opinion_dossier()
print("SA 700 / SA 705 Opinion Formulation Dossier Engine:")
print(f"  Client Name           : {conclusion['client']}")
print(f"  Materiality Threshold : INR {conclusion['overall_materiality_cr']} Crores (PM: INR {conclusion['performance_materiality_cr']} Cr)")
print(f"  Total Errors Logged   : INR {conclusion['total_unadjusted_error_cr']} Crores (Material: {conclusion['is_error_material']})")
print(f"  Pervasive Distortion : {conclusion['has_pervasive_impact']}")
print(f"  Final Concluded Opinion: {conclusion['final_opinion_verdict']}")
print(f"  Audit Mandate Action  : {conclusion['mandated_action']}")
''',
            "tryIt": "Set error_amount_cr to 5.0 to observe how the total errors fall below materiality, returning the concluded opinion to Unmodified.",
            "check": {
                "question": "What is the primary role of the Engagement Quality Control Reviewer (EQCR) under SA 220 when the audit team proposes to issue a modified audit opinion under SA 705?",
                "options": [
                    "To independently evaluate the significant judgments made by the team, review the proposed wording of the modification, and ensure compliance before report release",
                    "To pay the client a refund on the audit fees",
                    "To file a lawsuit against the engagement partner",
                    "To rewrite the company's accounting software in C++"
                ],
                "answerIndex": 0,
                "why": "SA 220 and SQC 1 require the EQCR partner to independently evaluate significant judgments and the formulation of modified opinions prior to the release of the audit report."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day22.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 22 base JSON created successfully.")
