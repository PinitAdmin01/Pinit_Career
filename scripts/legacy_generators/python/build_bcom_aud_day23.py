"""
Build Day 23 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Communicating Key Audit Matters (KAM) in the Independent Auditor's Report: SA 701
"""
import json

day_data = {
    "day": 23,
    "title": "Communicating Key Audit Matters in the Independent Auditor's Report: SA 701",
    "parts": [
        {
            "title": "Scope, Objective & Mandatory Applicability of SA 701",
            "say": [
                "Standard on Auditing (SA) 701, 'Communicating Key Audit Matters in the Independent Auditor's Report', establishes standards and guidance on the auditor's responsibility to communicate key audit matters in the auditor's report. The primary purpose of communicating Key Audit Matters (KAM) is to enhance the communicative value of the auditor's report by providing greater transparency about the audit that was performed. Communicating KAM provides intended users with additional information to assist them in understanding those matters that, in the auditor's professional judgment, were of most significance in the audit of the financial statements of the current period.",
                "SA 701 is MANDATORY for audits of complete sets of general purpose financial statements of LISTED entities. It also applies when the auditor is required by law or regulation to communicate key audit matters, or when the auditor decides to communicate key audit matters voluntarily.",
                "Crucially, SA 701 establishes four vital negative boundaries—what KAM is NOT: (1) Communicating KAM is NOT a substitute for disclosures in the financial statements that the applicable financial reporting framework (Ind AS) requires management to make; (2) Communicating KAM is NOT a substitute for the auditor expressing a modified opinion when required by the circumstances of a specific audit engagement in accordance with SA 705 (Revised); (3) Communicating KAM is NOT a substitute for reporting in accordance with SA 570 (Revised) when a material uncertainty exists relating to events or conditions that may cast significant doubt on an entity's ability to continue as a going concern; and (4) Communicating KAM is NOT a separate opinion on individual matters.",
                "KAM represents a window into the actual audit cockpit, illuminating areas of high management judgment and rigorous auditor scrutiny."
            ],
            "example": "In auditing a listed IT multinational with Rs 12,000 Crore in revenue, the auditor identifies two matters of most significance: (a) Revenue recognition under Ind AS 115 on complex multi-element software contracts involving ongoing maintenance and cloud hosting; and (b) Impairment assessment of goodwill of Rs 1,400 Crore arising from US acquisitions under Ind AS 36. Both matters are communicated as Key Audit Matters in the auditor's report, detailing why the matter was significant and how the audit addressed it.",
            "code": '''def evaluate_sa701_kam_applicability(
    is_listed_entity: bool,
    is_voluntary_adoption: bool,
    has_going_concern_material_uncertainty: bool,
    has_opinion_modification: bool,
    proposed_matters: list
) -> dict:
    is_kam_mandatory = is_listed_entity or is_voluntary_adoption
    
    # Filter out matters that are mandated under SA 570 or SA 705
    valid_kam_candidates = []
    excluded_matters = []
    
    for m in proposed_matters:
        if m.get("is_going_concern_uncertainty", False):
            excluded_matters.append({
                "matter": m["title"],
                "reason": "EXCLUDED_FROM_KAM: Must be reported under dedicated MURGC section under SA 570"
            })
        elif m.get("is_basis_for_modified_opinion", False):
            excluded_matters.append({
                "matter": m["title"],
                "reason": "EXCLUDED_FROM_KAM: Must be reported under Basis for Qualified/Adverse Opinion under SA 705"
            })
        else:
            valid_kam_candidates.append(m["title"])
            
    return {
        "is_listed": is_listed_entity,
        "is_kam_required": is_kam_mandatory,
        "valid_kam_candidates_count": len(valid_kam_candidates),
        "valid_kam_titles": valid_kam_candidates,
        "excluded_matters_redirected": excluded_matters,
        "sa701_compliance_status": "KAM_SECTION_MANDATORY_AND_PREPARED" if is_kam_mandatory else "KAM_SECTION_NOT_REQUIRED"
    }

kam_eval = evaluate_sa701_kam_applicability(
    is_listed_entity=True,
    is_voluntary_adoption=False,
    has_going_concern_material_uncertainty=True,
    has_opinion_modification=False,
    proposed_matters=[
        {"title": "Ind AS 115 Revenue Recognition on Fixed-Price Turnkey Contracts", "is_going_concern_uncertainty": False, "is_basis_for_modified_opinion": False},
        {"title": "Ind AS 36 Goodwill Impairment Testing on Overseas SPV", "is_going_concern_uncertainty": False, "is_basis_for_modified_opinion": False},
        {"title": "Material Uncertainty Regarding Operational Cash Flows and Debt Maturity", "is_going_concern_uncertainty": True, "is_basis_for_modified_opinion": False}
    ]
)
print("SA 701 Key Audit Matters (KAM) Applicability & Filtering Engine:")
print(f"  Entity Listed Status  : {kam_eval['is_listed']}")
print(f"  KAM Mandated by Law   : {kam_eval['is_kam_required']}")
print(f"  Valid KAM Matters     : {kam_eval['valid_kam_candidates_count']} {kam_eval['valid_kam_titles']}")
print(f"  SA 701 Status         : {kam_eval['sa701_compliance_status']}")
print("  Excluded Matters Redirected to Other Standards:")
for ex in kam_eval['excluded_matters_redirected']:
    print(f"    * {ex['matter']} -> [{ex['reason']}]")
''',
            "tryIt": "Set is_listed_entity to False to observe how KAM becomes non-mandatory for unlisted private entities.",
            "check": {
                "question": "Can an auditor report a Material Uncertainty Related to Going Concern as a Key Audit Matter (KAM) under SA 701?",
                "options": [
                    "No, SA 701 Paragraph 15 explicitly prohibits reporting a going concern material uncertainty as a KAM; it must be reported in a dedicated 'Material Uncertainty Related to Going Concern' section under SA 570",
                    "Yes, going concern is always the first Key Audit Matter",
                    "Only if the company is listed on both the BSE and NSE",
                    "Yes, provided the auditor does not mention any financial numbers"
                ],
                "answerIndex": 0,
                "why": "SA 701 Paragraph 15 and SA 570 mandate that matters giving rise to a material uncertainty regarding going concern must be reported under the dedicated SA 570 section, not inside KAM."
            }
        },
        {
            "title": "The 3-Step Filter for Determining Key Audit Matters: SA 701",
            "say": [
                "SA 701 Paragraphs 8, 9, and 10 establish a rigorous, disciplined 3-step narrowing process (the 'KAM Funnel') that the auditor must execute to determine which matters become Key Audit Matters in the auditor's report.",
                "Step 1: The Broadest Universe—Matters Communicated with Those Charged With Governance (TCWG). The auditor begins with the entire universe of significant audit matters communicated to the Audit Committee and Board of Directors during engagement planning and completion under SA 260.",
                "Step 2: Narrowing to 'Matters that Required Significant Auditor Attention'. From the matters communicated with TCWG, the auditor identifies those matters that required significant auditor attention in performing the audit. In doing so, SA 701 Paragraph 9 mandates that the auditor shall take into account: (a) Areas of higher assessed risk of material misstatement, or significant risks identified in accordance with SA 315; (b) Significant auditor judgments relating to areas in the financial statements that involved significant management judgment, including accounting estimates identified as having high estimation uncertainty under SA 540; and (c) The effect on the audit of significant events or transactions that occurred during the period (such as major business combinations, restructurings, or regulatory investigations).",
                "Step 3: The Final Selection—'Matters of Most Significance'. From the matters requiring significant auditor attention, the auditor makes the final determination: which of these matters were of MOST significance in the audit of the financial statements of the current period. These matters are the Key Audit Matters."
            ],
            "example": "During the audit of a banking institution, the audit team communicates 14 matters with the Audit Committee. Applying Step 2, the auditor narrows this to 5 matters requiring significant auditor attention (ECL provisioning under Ind AS 109, Level 3 derivative valuations, IT general controls over core banking, corporate tax disputes, and lease accounting). In Step 3, the auditor determines that ECL provisioning (Rs 4,200 Crore) and Level 3 derivative valuation (Rs 1,800 Crore) were the matters of most significance. These two become the reported Key Audit Matters.",
            "code": '''def execute_sa701_three_step_kam_funnel(
    matters_communicated_with_tcwg: list
) -> dict:
    # Step 2: Filter for matters requiring significant auditor attention
    significant_attention_matters = []
    for m in matters_communicated_with_tcwg:
        has_high_rmm = m["is_significant_risk_sa315"]
        has_high_judgment = m["involves_high_management_judgment_sa540"]
        has_major_event = m["significant_unusual_transaction"]
        
        attention_score = (3.0 if has_high_rmm else 0.0) + (3.0 if has_high_judgment else 0.0) + (2.0 if has_major_event else 0.0)
        
        if attention_score >= 3.0:
            significant_attention_matters.append({
                "title": m["title"],
                "score": attention_score,
                "audit_hours_spent": m["audit_hours"]
            })
            
    # Step 3: Select matters of MOST significance (top tier by score & audit intensity)
    sorted_candidates = sorted(significant_attention_matters, key=lambda x: (x["score"], x["audit_hours_spent"]), reverse=True)
    selected_kams = sorted_candidates[:2] # Top 2 most significant
    
    return {
        "step_1_tcwg_matters_count": len(matters_communicated_with_tcwg),
        "step_2_significant_attention_count": len(significant_attention_matters),
        "step_3_matters_of_most_significance_count": len(selected_kams),
        "final_selected_kams": selected_kams
    }

tcwg_log = [
    {"title": "Expected Credit Loss (ECL) Model Provisioning (Ind AS 109)", "is_significant_risk_sa315": True, "involves_high_management_judgment_sa540": True, "significant_unusual_transaction": False, "audit_hours": 320},
    {"title": "Level 3 Complex Derivative Portfolio Fair Value", "is_significant_risk_sa315": True, "involves_high_management_judgment_sa540": True, "significant_unusual_transaction": False, "audit_hours": 240},
    {"title": "Routine Verification of Office Furniture Additions", "is_significant_risk_sa315": False, "involves_high_management_judgment_sa540": False, "significant_unusual_transaction": False, "audit_hours": 25},
    {"title": "IT General Controls (ITGC) over SAP Core Banking", "is_significant_risk_sa315": True, "involves_high_management_judgment_sa540": False, "significant_unusual_transaction": False, "audit_hours": 150},
    {"title": "Statutory Gratuity Actuarial Assumptions (Ind AS 19)", "is_significant_risk_sa315": False, "involves_high_management_judgment_sa540": True, "significant_unusual_transaction": False, "audit_hours": 60}
]

kam_funnel_res = execute_sa701_three_step_kam_funnel(tcwg_log)
print("SA 701 Three-Step KAM Determination Funnel Engine:")
print(f"  Step 1: TCWG Communicated Matters   : {kam_funnel_res['step_1_tcwg_matters_count']}")
print(f"  Step 2: Significant Auditor Attention: {kam_funnel_res['step_2_significant_attention_count']}")
print(f"  Step 3: Matters of Most Significance : {kam_funnel_res['step_3_matters_of_most_significance_count']}")
print("  Final Selected Key Audit Matters (KAMs):")
for k in kam_funnel_res['final_selected_kams']:
    print(f"    * {k['title']} (Attention Score: {k['score']} | Audit Effort: {k['audit_hours_spent']} hours)")
''',
            "tryIt": "Set is_significant_risk_sa315 and involves_high_management_judgment_sa540 to False for ECL provisioning to observe how it gets eliminated from the KAM funnel.",
            "check": {
                "question": "What is the correct 3-step sequence mandated by SA 701 for determining Key Audit Matters?",
                "options": [
                    "Matters communicated with TCWG -> Matters that required significant auditor attention -> Matters of most significance in the audit of the financial statements of the current period",
                    "Matters published in newspapers -> Matters selected by shareholders -> Matters approved by the Chief Executive Officer",
                    "All accounts with balances over Rs 1 Lakh -> Accounts audited on Fridays -> Accounts with zero errors",
                    "Draft financial statements -> Income tax return -> Board report"
                ],
                "answerIndex": 0,
                "why": "SA 701 Paragraphs 8, 9, and 10 explicitly delineate the 3-step funnel: TCWG communication -> significant auditor attention -> matters of most significance."
            }
        },
        {
            "title": "Structuring & Drafting Individual Key Audit Matters: SA 701",
            "say": [
                "SA 701 Paragraph 13 establishes the mandatory statutory architecture for drafting each individual Key Audit Matter. The description of each Key Audit Matter in the 'Key Audit Matters' section of the auditor's report must include: (1) An appropriate heading identifying the specific matter; (2) A reference to the related disclosure(s) in the financial statements; (3) An explanation of WHY the matter was considered to be one of most significance in the audit (the 'Why It Was a KAM' component); and (4) A detailed description of HOW the matter was addressed in the audit (the 'How It Was Addressed in the Audit' component).",
                "In describing 'Why It Was a KAM', the auditor highlights the quantitative magnitude, the complexity of valuation models, the subjectivity of key assumptions, and the risks of management bias.",
                "In describing 'How It Was Addressed in the Audit', the auditor provides a granular, technical walkthrough of the substantive audit procedures performed: (a) Testing design and operating effectiveness of internal controls (including IT automated controls); (b) Involving auditor's valuation specialists under SA 620; (c) Testing underlying data (IPE) for completeness and accuracy; (d) Challenging and stress-testing management's significant assumptions against independent industry benchmarks; and (e) Evaluating the adequacy of disclosures in the notes.",
                "Crucially, the auditor shall not provide original financial information about the entity that has not been disclosed by management; the auditor describes the audit procedures and conclusions without usurping management's reporting role."
            ],
            "example": "In drafting the KAM for Goodwill Impairment (Rs 850 Crore) for an industrial client, the auditor includes: (1) Reference: Note 14 to financial statements; (2) Why it was a KAM: Testing involves significant estimation uncertainty regarding 5-year revenue growth rates, terminal growth rates (3.0%), and pre-tax discount rates (12.5%); and (3) How it was addressed: The audit team, including our internal valuation specialists, tested IT controls, benchmarked WACC discount rates against market peer groups, evaluated management's historical forecasting accuracy through retrospective review, and performed sensitivity analyses on headroom.",
            "code": '''def draft_sa701_individual_kam(
    kam_title: str,
    note_reference: str,
    balance_amount_cr: float,
    why_significant: str,
    substantive_procedures_executed: list,
    auditor_conclusion: str
) -> dict:
    procedures_formatted = "\\n".join([f"    - {p}" for p in substantive_procedures_executed])
    
    kam_draft = (
        f"Key Audit Matter: {kam_title}\\n"
        f"Refer to {note_reference} of the standalone financial statements.\\n\\n"
        f"Why the matter was considered to be one of most significance in the audit:\\n"
        f"{why_significant} Carrying amount: INR {balance_amount_cr:.2f} Crores.\\n\\n"
        f"How our audit addressed the Key Audit Matter:\\n"
        f"Our audit procedures included the following:\\n"
        f"{procedures_formatted}\\n\\n"
        f"Auditor Evaluation Conclusion:\\n"
        f"{auditor_conclusion}"
    )
    
    return {
        "title": kam_title,
        "note_ref": note_reference,
        "carrying_val_cr": balance_amount_cr,
        "draft_kam_text": kam_draft
    }

kam_draft_example = draft_sa701_individual_kam(
    kam_title="Impairment Assessment of Goodwill and Intangible Assets under Ind AS 36",
    note_reference="Note 14 (Goodwill and Intangibles)",
    balance_amount_cr=850.0,
    why_significant="Goodwill impairment involves significant management judgment in establishing Cash-Generating Units (CGUs), estimating future cash flows, and selecting discount rates.",
    substantive_procedures_executed=[
        "Tested design and operating effectiveness of key internal controls over the annual impairment review process.",
        "Engaged auditor's valuation specialists under SA 620 to challenge discount rates (WACC) and terminal growth assumptions against market benchmarks.",
        "Evaluated management's historical budgeting accuracy through retrospective review of prior-period cash flow projections.",
        "Performed independent sensitivity testing on discount rates and revenue growth rates to assess the impact on CGU headroom.",
        "Assessed the adequacy and completeness of disclosures in Note 14 in compliance with Ind AS 36."
    ],
    auditor_conclusion="Based on our procedures, we found management's assumptions and the valuation model used for goodwill impairment assessment to be acceptable and supportable."
)

print("SA 701 Individual Key Audit Matter (KAM) Generator:")
print(f"  KAM Title             : {kam_draft_example['title']}")
print(f"  Note Reference        : {kam_draft_example['note_ref']}")
print(f"  Carrying Amount       : INR {kam_draft_example['carrying_val_cr']} Crores")
print("  Statutory KAM Draft Text:")
print(kam_draft_example['draft_kam_text'])
''',
            "tryIt": "Add a new substantive procedure to the list to observe how the audit response dynamically expands in the generated statutory draft.",
            "check": {
                "question": "Under SA 701 Paragraph 13, what two essential technical explanations must the description of each Key Audit Matter provide?",
                "options": [
                    "An explanation of WHY the matter was considered to be one of most significance in the audit, and a description of HOW the matter was addressed in the audit",
                    "An explanation of why the company hired the audit firm, and how much the audit partner was paid",
                    "A list of all employees fired during the year, and their residential addresses",
                    "A prediction of next quarter's dividend yield, and stock trading tips"
                ],
                "answerIndex": 0,
                "why": "SA 701 Paragraph 13 explicitly requires that each KAM must state why the matter was of most significance and how the audit addressed it, cross-referenced to the financial statement notes."
            }
        },
        {
            "title": "Circumstances When a Matter Determined to be a KAM is Not Communicated",
            "say": [
                "Under SA 701 Paragraph 14, the auditor shall describe each key audit matter in the auditor's report UNLESS one of two extremely narrow statutory exceptions applies: (1) Law or regulation precludes public disclosure about the matter (e.g., when a matter involves national security secrets or ongoing criminal investigations where public disclosure is forbidden by law); or (2) In extremely rare circumstances, the auditor determines that the matter should not be communicated because the adverse consequences of doing so would reasonably be expected to outweigh the public interest benefits of such communication.",
                "However, the second exception (adverse consequences outweighing public interest) is strictly conditional: it does NOT apply if the entity has already publicly disclosed information about the matter.",
                "Furthermore, SA 701 establishes the relationship between KAM and Modified Opinions: A matter giving rise to a qualified opinion, adverse opinion, or disclaimer of opinion under SA 705, or a material uncertainty related to going concern under SA 570, is by its nature a key audit matter; however, these matters shall NOT be presented in the Key Audit Matters section. Instead, they are reported in their respective dedicated statutory sections (Basis for Qualified/Adverse Opinion, or Material Uncertainty Related to Going Concern), and the KAM section includes a cross-reference statement pointing readers to those sections.",
                "This guarantees that modified opinions and going concern crises receive maximum legal prominence."
            ],
            "example": "During an audit of a public telecommunications entity, a significant risk arises regarding an ongoing classified defense satellite communication contract. Under the Official Secrets Act, public disclosure of technical contract details is prohibited by law. The auditor documents the matter in the audit file under SA 230, explains the legal prohibition to the Audit Committee, and appropriately excludes the matter from the published KAM section under SA 701 Paragraph 14.",
            "code": '''def evaluate_sa701_non_disclosure_exceptions(
    matter_name: str,
    law_precludes_public_disclosure: bool,
    adverse_consequences_outweigh_public_interest: bool,
    has_entity_publicly_disclosed_matter: bool,
    is_matter_basis_for_modified_opinion: bool,
    is_going_concern_material_uncertainty: bool
) -> dict:
    if is_matter_basis_for_modified_opinion:
        action = "DO_NOT_INCLUDE_IN_KAM_REPORT_IN_BASIS_FOR_MODIFICATION_SECTION_SA705"
        can_publish_in_kam = False
    elif is_going_concern_material_uncertainty:
        action = "DO_NOT_INCLUDE_IN_KAM_REPORT_IN_MURGC_SECTION_SA570"
        can_publish_in_kam = False
    elif law_precludes_public_disclosure:
        action = "EXCLUDE_FROM_AUDIT_REPORT_LAW_OR_REGULATION_PRECLUDES_PUBLIC_DISCLOSURE"
        can_publish_in_kam = False
    elif adverse_consequences_outweigh_public_interest and not has_entity_publicly_disclosed_matter:
        action = "EXTREMELY_RARE_EXCEPTION_ADVERSE_CONSEQUENCES_OUTWEIGH_BENEFITS"
        can_publish_in_kam = False
    elif adverse_consequences_outweigh_public_interest and has_entity_publicly_disclosed_matter:
        action = "MUST_COMMUNICATE_IN_KAM_ENTITY_ALREADY_PUBLICLY_DISCLOSED_MATTER"
        can_publish_in_kam = True
    else:
        action = "STANDARD_KAM_COMMUNICATION_MANDATED"
        can_publish_in_kam = True
        
    return {
        "matter": matter_name,
        "publish_in_kam_section": can_publish_in_kam,
        "reporting_protocol_verdict": action
    }

ex_1 = evaluate_sa701_non_disclosure_exceptions(
    matter_name="Classified Defense Communications Contract",
    law_precludes_public_disclosure=True,
    adverse_consequences_outweigh_public_interest=False,
    has_entity_publicly_disclosed_matter=False,
    is_matter_basis_for_modified_opinion=False,
    is_going_concern_material_uncertainty=False
)

ex_2 = evaluate_sa701_non_disclosure_exceptions(
    matter_name="Impending Hostile Takeover Vulnerability",
    law_precludes_public_disclosure=False,
    adverse_consequences_outweigh_public_interest=True,
    has_entity_publicly_disclosed_matter=True,
    is_matter_basis_for_modified_opinion=False,
    is_going_concern_material_uncertainty=False
)

print("SA 701 KAM Non-Disclosure Exceptions Evaluator:")
print(f"  [1] Classified Contract : Publish={ex_1['publish_in_kam_section']} -> [{ex_1['reporting_protocol_verdict']}]")
print(f"  [2] Hostile Takeover    : Publish={ex_2['publish_in_kam_section']} -> [{ex_2['reporting_protocol_verdict']}]")
''',
            "tryIt": "Set has_entity_publicly_disclosed_matter to False in Case 2 to observe how the adverse consequences exception becomes effective.",
            "check": {
                "question": "Can management's commercial sensitivity concerns prevent the auditor from communicating a Key Audit Matter if the company has already publicly disclosed information about the matter?",
                "options": [
                    "No, under SA 701 Paragraph 14(b), the adverse consequences exception cannot apply if the entity has already publicly disclosed information about the matter",
                    "Yes, management can unilaterally redact any section of the auditor's report",
                    "Yes, if the Board passes an extraordinary resolution",
                    "Only if the company pays a fine to the stock exchange"
                ],
                "answerIndex": 0,
                "why": "SA 701 Paragraph 14(b) explicitly establishes that the adverse consequences exception does not apply if the entity has publicly disclosed information about the matter."
            }
        },
        {
            "title": "Comprehensive KAM Working Paper Documentation & Technical Quality Review",
            "say": [
                "Under SA 230 and SA 701 Paragraph 18, the auditor shall document in the audit working papers: (1) The matters that required significant auditor attention in performing the audit, and the rationale for the auditor's determination as to whether or not each of these matters is a Key Audit Matter; (2) Where applicable, the rationale for the auditor's determination that there are no key audit matters to be communicated in the auditor's report; and (3) Where applicable, the rationale for the auditor's determination not to communicate in the auditor's report a matter determined to be a key audit matter under the non-disclosure exceptions.",
                "The Engagement Quality Control Reviewer (EQCR) must independently review the KAM documentation under SA 220, challenging the selection of matters, the accuracy of descriptions, and ensuring that KAM descriptions do not conflict with findings in the CARO annexure or the main audit opinion.",
                "Completing this technical review guarantees that the auditor's communication is rigorous, defensible, and enhances investor confidence across global capital markets."
            ],
            "example": "The EQCR partner reviews the KAM working paper dossier for a listed conglomerate. The dossier documents why 3 matters were selected out of 9 candidates, details the independent specialist reviews for each matter, and verifies that the KAM descriptions match the disclosures in Note 14 and Note 22. The partner signs off on the KAM documentation.",
            "code": '''class SA701KAMWorkingPaperDossier:
    def __init__(self, client_name: str, audit_year: str):
        self.client = client_name
        self.year = audit_year
        self.evaluated_matters = []
        
    def log_matter_evaluation(self, title: str, attention_required: bool, selected_as_kam: bool, justification: str):
        self.evaluated_matters.append({
            "matter_title": title,
            "significant_attention": attention_required,
            "is_kam": selected_as_kam,
            "rationale": justification
        })
        
    def generate_dossier_status(self) -> dict:
        total_eval = len(self.evaluated_matters)
        kam_count = sum(1 for m in self.evaluated_matters if m["is_kam"])
        
        return {
            "client": self.client,
            "fiscal_year": self.year,
            "total_matters_evaluated": total_eval,
            "kams_selected_for_report": kam_count,
            "dossier_compliance": "SA701_PARAGRAPH_18_COMPLIANT_ARCHIVED",
            "evaluated_matters_log": self.evaluated_matters
        }

kam_dossier = SA701KAMWorkingPaperDossier("Apex Listed Multinational Ltd", "FY 2025-26")
kam_dossier.log_matter_evaluation("Ind AS 115 Revenue Cut-Off on Software Licenses", True, True, "High estimation uncertainty in allocating standalone selling prices across multi-year SaaS contracts.")
kam_dossier.log_matter_evaluation("Ind AS 36 Goodwill Impairment Testing", True, True, "Material goodwill balance of INR 850 Cr requiring DCF modeling and specialist WACC benchmarking.")
kam_dossier.log_matter_evaluation("Lease Accounting Transition (Ind AS 116)", True, False, "Significant effort in prior years; current year represents routine renewals without high estimation risk.")
kam_dossier.log_matter_evaluation("Routine Intercompany Trade Confirmations", False, False, "Low risk; fully reconciled through automated SAP intercompany matching.")

status = kam_dossier.generate_dossier_status()
print("SA 701 KAM Working Paper Dossier Sign-Off Engine:")
print(f"  Client Name           : {status['client']} ({status['fiscal_year']})")
print(f"  Matters Evaluated     : {status['total_matters_evaluated']}")
print(f"  Final KAMs Selected   : {status['kams_selected_for_report']}")
print(f"  Working Paper Status  : {status['dossier_compliance']}")
print("  KAM Determination Audit Trail:")
for m in status['evaluated_matters_log']:
    print(f"    * {m['matter_title']}: Significant={m['significant_attention']} | Selected KAM={m['is_kam']} -> {m['rationale']}")
''',
            "tryIt": "Add a new matter evaluation to the dossier to observe the working paper log track all evaluations dynamically.",
            "check": {
                "question": "What is the mandatory working paper documentation requirement under SA 701 Paragraph 18 regarding Key Audit Matters?",
                "options": [
                    "The auditor must document the matters that required significant auditor attention and the rationale for determining whether or not each matter is a Key Audit Matter",
                    "The auditor only documents matters that were rejected by management",
                    "The auditor deletes all working papers once the audit report is signed",
                    "The auditor must publish all working papers on Wikipedia"
                ],
                "answerIndex": 0,
                "why": "SA 701 Paragraph 18 explicitly mandates that the auditor shall document the matters that required significant auditor attention and the technical rationale for determining whether or not each is a KAM."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day23.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 23 base JSON created successfully.")
