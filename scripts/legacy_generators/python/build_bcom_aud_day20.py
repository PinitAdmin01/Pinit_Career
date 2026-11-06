"""
Build Day 20 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Written Representations & Milestone Project 4: SA 580, Management Representation Letters & Complex Substantive Synthesis
"""
import json

day_data = {
    "day": 20,
    "title": "Milestone Project 4: Complex Substantive Assurance, Going Concern & Governance Audit Workbench",
    "parts": [
        {
            "title": "Nature, Purpose & Legal Status of Written Representations: SA 580",
            "say": [
                "Standard on Auditing (SA) 580, 'Written Representations', deals with the auditor's responsibilities to obtain written representations from management and, where appropriate, Those Charged With Governance (TCWG) in an audit of financial statements. A Written Representation is a written statement by management provided to the auditor to confirm certain matters or to support other audit evidence. Written representations in this context do not include financial statements, the assertions therein, or supporting books and records.",
                "SA 580 establishes two critical legal doctrines regarding written representations: (1) Written representations are necessary audit evidence—they provide documentary confirmation that management recognizes its responsibility for the preparation of the financial statements and the completeness of information provided; and (2) Written representations do NOT provide sufficient appropriate audit evidence on their own about any of the matters with which they deal. The auditor cannot substitute a management representation letter for substantive inspection, physical counts, or external confirmations.",
                "SA 580 mandates that the auditor shall request written representations from management with appropriate responsibilities for the financial statements (typically the Chief Executive Officer and Chief Financial Officer). The representations must cover: (a) that management has fulfilled its responsibility for the preparation of the financial statements in accordance with the applicable financial reporting framework (Ind AS); (b) that management has provided the auditor with all relevant information and access as agreed in the terms of the audit engagement; and (c) that all transactions have been recorded and are reflected in the financial statements.",
                "The date of the written representations shall be as near as practicable to, but NOT after, the date of the auditor's report on the financial statements."
            ],
            "example": "During the audit of a retail corporation, management provides a signed letter of representation claiming that Rs 40 Crore in slow-moving inventory is fully salable at retail prices. However, the audit team inspects subsequent sales ledgers and discovers the goods were liquidated at an 80% discount. The auditor rejects management's representation because a written representation cannot override contradictory empirical audit evidence. The auditor demands an Rs 32 Crore inventory write-down under Ind AS 2.",
            "code": '''def evaluate_sa580_written_representation_evidentiary_weight(
    matter_under_audit: str,
    has_signed_representation_letter: bool,
    has_independent_corroborating_evidence: bool,
    contradictory_evidence_identified: bool,
    rep_letter_date: str,
    audit_report_date: str
) -> dict:
    # Rule 1: Rep letter date must be as near as practicable to, but not after, audit report date
    is_date_valid = rep_letter_date <= audit_report_date
    
    # Rule 2: Cannot rely on rep letter alone without corroboration
    if contradictory_evidence_identified:
        evidentiary_status = "REJECTED_CONTRADICTORY_EVIDENCE_OVERRIDES_REPRESENTATION"
        audit_action = "PROPOSE_AUDIT_ADJUSTMENT_BASED_ON_EMPIRICAL_EVIDENCE"
    elif not has_signed_representation_letter:
        evidentiary_status = "CRITICAL_DEFICIENCY_MISSING_MANDATORY_REPRESENTATION"
        audit_action = "DISCLAIM_OPINION_OR_WITHDRAW_FROM_ENGAGEMENT_UNDER_SA580"
    elif has_signed_representation_letter and not has_independent_corroborating_evidence:
        evidentiary_status = "INSUFFICIENT_EVIDENCE_REPRESENTATION_CANNOT_SUBSTITUTE_SUBSTANTIVE_AUDIT"
        audit_action = "PERFORM_ADDITIONAL_SUBSTANTIVE_PROCEDURES_BEFORE_SIGN_OFF"
    elif has_signed_representation_letter and has_independent_corroborating_evidence and is_date_valid:
        evidentiary_status = "VALID_AUDIT_EVIDENCE_CORROBORATED_AND_COMPLIANT"
        audit_action = "RELIANCE_PERMITTED_FILE_IN_WORKING_PAPERS"
    else:
        evidentiary_status = "INVALID_DATE_SEQUENCE_REP_LETTER_DATED_AFTER_AUDIT_REPORT"
        audit_action = "RE-DATE_AND_RE-OBTAIN_SIGNED_REPRESENTATION_LETTER"
        
    return {
        "matter_audited": matter_under_audit,
        "rep_letter_signed": has_signed_representation_letter,
        "corroboration_present": has_independent_corroborating_evidence,
        "contradiction_found": contradictory_evidence_identified,
        "date_compliance": is_date_valid,
        "evidentiary_verdict": evidentiary_status,
        "mandated_audit_action": audit_action
    }

sa580_eval = evaluate_sa580_written_representation_evidentiary_weight(
    matter_under_audit="Inventory NRV Recoverability Valuation",
    has_signed_representation_letter=True,
    has_independent_corroborating_evidence=False,
    contradictory_evidence_identified=True,
    rep_letter_date="2026-05-10",
    audit_report_date="2026-05-10"
)
print("SA 580 Written Representation Evidentiary Weight Engine:")
print(f"  Matter Evaluated          : {sa580_eval['matter_audited']}")
print(f"  Signed Rep Letter Received: {sa580_eval['rep_letter_signed']}")
print(f"  Independent Corroboration : {sa580_eval['corroboration_present']}")
print(f"  Contradictory Evidence    : {sa580_eval['contradiction_found']}")
print(f"  Evidentiary Status        : {sa580_eval['evidentiary_verdict']}")
print(f"  Audit Mandate             : {sa580_eval['mandated_audit_action']}")
''',
            "tryIt": "Set contradictory_evidence_identified to False and has_independent_corroborating_evidence to True to observe the representation status become valid, corroborated, and compliant.",
            "check": {
                "question": "Can a statutory auditor rely solely on a written representation from management as sufficient appropriate audit evidence regarding an account balance or assertion under SA 580?",
                "options": [
                    "No, written representations do not provide sufficient appropriate audit evidence on their own and cannot substitute for other substantive audit procedures that are available",
                    "Yes, a signed management representation letter eliminates the need to perform any physical counts or bank confirmations",
                    "Yes, provided the letter is notarized by a public notary",
                    "Only if the letter is printed on expensive watermark paper"
                ],
                "answerIndex": 0,
                "why": "SA 580 Paragraph 4 explicitly states that although written representations provide necessary audit evidence, they do not provide sufficient appropriate audit evidence on their own about any of the matters with which they deal."
            }
        },
        {
            "title": "Specific Mandatory Representations & Doubt Over Reliability: SA 580",
            "say": [
                "Beyond general representations on financial statement preparation and access, other Standards on Auditing mandate specific written representations: (1) SA 240 (Fraud)—that management has disclosed to the auditor the results of its assessment of the risk of fraud, and has disclosed all knowledge of actual, suspected, or alleged fraud involving management, employees who have significant roles in internal control, or others; (2) SA 250 (Laws & Regulations)—that all known actual or possible instances of non-compliance with laws and regulations have been disclosed; (3) SA 450 (Uncorrected Misstatements)—that management believes the effects of uncorrected misstatements are immaterial, individually and in aggregate, to the financial statements (with a summary of uncorrected misstatements attached to the representation letter); (4) SA 550 (Related Parties)—that all related party identities and transactions have been disclosed; (5) SA 560 (Subsequent Events)—that all subsequent events requiring adjustment or disclosure have been adjusted or disclosed; and (6) SA 570 (Going Concern)—that management's plans for future action are realistic and feasible.",
                "What occurs if the auditor has doubts about the competence, integrity, ethical values, or diligence of management? If the auditor concludes that the representations are not reliable, the auditor shall take appropriate actions, including determining the possible effect on the opinion.",
                "Crucially, under SA 580 Paragraph 20, if management does NOT provide the requested written representations regarding fulfillment of its basic responsibilities, or if the auditor concludes that there is sufficient doubt about the integrity of management such that the written representations are not reliable, the auditor shall DISCLAIM AN OPINION on the financial statements in accordance with SA 705."
            ],
            "example": "During an audit, the Chief Financial Officer refuses to sign the mandatory written representation under SA 240 confirming that all known fraud has been disclosed, stating 'our legal department advises against making fraud declarations'. Under SA 580, because management refuses to provide a mandatory representation on its core responsibilities, the auditor is legally prohibited from issuing an unqualified or qualified opinion; the auditor must issue a formal Disclaimer of Opinion under SA 705.",
            "code": '''def handle_sa580_refusal_or_unreliable_representations(
    company_name: str,
    management_integrity_assessed_as_compromised: bool,
    refusal_to_sign_general_responsibilities: bool,
    refusal_to_sign_specific_fraud_representation: bool,
    unremedied_uncorrected_misstatements_attached: bool
) -> dict:
    if management_integrity_assessed_as_compromised or refusal_to_sign_general_responsibilities or refusal_to_sign_specific_fraud_representation:
        opinion_type = "DISCLAIMER_OF_OPINION (SA 705 & SA 580 Paragraph 20)"
        reporting_text = (
            "We were engaged to audit the financial statements of the Company. We do not express an opinion on the accompanying "
            "financial statements. Because of the significance of the matter described in the Basis for Disclaimer of Opinion section, "
            "we have not been able to obtain sufficient appropriate audit evidence. Specifically, management has refused to provide "
            "written representations confirming its fundamental responsibilities for the preparation of financial statements and "
            "disclosure of fraud under SA 580 and SA 240."
        )
        can_issue_clean_opinion = False
    elif not unremedied_uncorrected_misstatements_attached:
        opinion_type = "QUALIFIED_OPINION (SCOPE_LIMITATION_SA705)"
        reporting_text = "Management omitted the SUAD schedule of uncorrected misstatements from the representation letter."
        can_issue_clean_opinion = False
    else:
        opinion_type = "UNMODIFIED_OPINION_PERMITTED"
        reporting_text = "All mandatory and specific written representations successfully obtained and verified."
        can_issue_clean_opinion = True
        
    return {
        "company": company_name,
        "management_integrity_compromised": management_integrity_assessed_as_compromised,
        "refusal_to_sign": refusal_to_sign_general_responsibilities or refusal_to_sign_specific_fraud_representation,
        "resulting_opinion_mandate": opinion_type,
        "can_issue_clean_opinion": can_issue_clean_opinion,
        "audit_report_wording": reporting_text
    }

rep_refusal_case = handle_sa580_refusal_or_unreliable_representations(
    company_name="Apex Logistics Holdings Ltd",
    management_integrity_assessed_as_compromised=False,
    refusal_to_sign_general_responsibilities=False,
    refusal_to_sign_specific_fraud_representation=True,
    unremedied_uncorrected_misstatements_attached=True
)
print("SA 580 Refusal / Unreliable Written Representations Protocol Engine:")
print(f"  Company Name          : {rep_refusal_case['company']}")
print(f"  Integrity Compromised : {rep_refusal_case['management_integrity_compromised']}")
print(f"  Refusal to Sign Flags : {rep_refusal_case['refusal_to_sign']}")
print(f"  Opinion Mandate       : {rep_refusal_case['resulting_opinion_mandate']}")
print("  Statutory Audit Report Disclosure:")
print(f"  \"{rep_refusal_case['audit_report_wording']}\"")
''',
            "tryIt": "Set refusal_to_sign_specific_fraud_representation to False to observe how the engine permits an unmodified opinion when all representations are obtained.",
            "check": {
                "question": "What is the mandatory audit opinion required under SA 580 Paragraph 20 if management refuses to provide written representations confirming that it has fulfilled its responsibility for the preparation of the financial statements?",
                "options": [
                    "The auditor shall disclaim an opinion on the financial statements in accordance with SA 705",
                    "The auditor shall issue an unmodified clean opinion with an Emphasis of Matter paragraph",
                    "The auditor shall issue a qualified opinion and deduct 10% from the reported net profit",
                    "The auditor shall ask the company's receptionist to sign the representation letter instead"
                ],
                "answerIndex": 0,
                "why": "SA 580 Paragraph 20 explicitly mandates that the auditor shall disclaim an opinion on the financial statements if management refuses to provide the basic written representations on its responsibilities."
            }
        },
        {
            "title": "Milestone Project 4: Enterprise Complex Assurance & Going Concern Audit Workbench",
            "say": [
                "Welcome to Milestone Project 4: The Enterprise Complex Substantive Assurance, Going Concern & Governance Audit Workbench. In this milestone capstone, you assume the executive role of the Lead Assurance Partner and Technical Quality Reviewer commanding the high-stakes statutory audit of Apex Heavy Industrial Engineering Conglomerate Ltd, an infrastructure giant reporting Rs 6,200 Crore in annual turnover, Rs 420 Crore in Profit Before Tax, and Rs 7,800 Crore in balance sheet assets.",
                "In Module 1, your team deploys the SA 540 Accounting Estimates & Level 3 Fair Value Verification Suite across Apex's Rs 850 Crore infrastructure project valuation and warranty provision models: auditing unobservable Level 3 inputs, challenging discounted cash flow discount rates, and verifying an independent auditor point estimate range.",
                "In Module 2, you execute the SA 550 / Section 188 Related Party & UBO Collision Engine: matching vendor director records against MCA registries, uncovering Rs 68 Crore in undisclosed transactions with entities controlled by family members of the Managing Director, and formulating adverse CARO 2020 Clause (xiii) statutory reporting remarks.",
                "In Module 3, your team executes the SA 560 Subsequent Events Triangulation: identifying an April debtor bankruptcy requiring an Rs 28 Crore adjusting impairment entry and an April factory fire requiring a Rs 45 Crore non-adjusting note disclosure.",
                "In Module 4, you deploy the SA 570 / CARO Clause (xvii) & (xix) Going Concern Stress Testing Engine: evaluating chronic cash losses, stress-testing 12-month rolling liquidity forecasts against bond maturities, and drafting the mandatory 'Material Uncertainty Related to Going Concern' (MURGC) section.",
                "In Module 5, you finalize the SA 580 Written Representation Dossier: securing signed executive letters across all statutory standards, reconciling the Summary of Unadjusted Audit Differences (SUAD), and delivering the comprehensive Independent Auditor's Report, conferring Senior Assurance Director & Statutory Governance Controller accreditation."
            ],
            "example": "At the final Audit Committee meeting of Apex Conglomerate, the Lead Assurance Partner presents the completed Milestone 4 Audit Workbench findings: quantifying Rs 28 Crore in subsequent adjusting entries, Rs 68 Crore in unauthorized related party spend under Section 188, a validated SA 540 Level 3 fair value impairment of Rs 42 Crore, and an unmodified audit opinion featuring a dedicated Material Uncertainty Related to Going Concern section and CARO adverse remarks.",
            "code": '''class MilestoneProject4AuditWorkbench:
    def __init__(self, client_name: str, turnover_cr: float, pbt_cr: float):
        self.client_name = client_name
        self.turnover_cr = turnover_cr
        self.pbt_cr = pbt_cr
        self.materiality_cr = pbt_cr * 0.05
        self.pm_cr = self.materiality_cr * 0.65
        self.modules_executed = []
        self.proposed_audit_adjustments = []
        
    def add_audit_module(self, module_num: int, name: str, issues_identified: int, net_adjustment_cr: float, caro_impact: str):
        self.modules_executed.append({
            "module": f"Module {module_num}: {name}",
            "issues": issues_identified,
            "adjustment_cr": net_adjustment_cr,
            "caro_clause_impact": caro_impact
        })
        if net_adjustment_cr > 0:
            self.proposed_audit_adjustments.append({
                "module": name,
                "amount_cr": net_adjustment_cr
            })
            
    def generate_master_assurance_dashboard(self) -> dict:
        total_adj = sum(a["amount_cr"] for a in self.proposed_audit_adjustments)
        is_material_adjustment = total_adj >= self.materiality_cr
        
        return {
            "conglomerate_name": self.client_name,
            "annual_turnover_cr": self.turnover_cr,
            "overall_materiality_cr": round(self.materiality_cr, 2),
            "performance_materiality_cr": round(self.pm_cr, 2),
            "total_modules_completed": len(self.modules_executed),
            "total_proposed_adjustments_cr": round(total_adj, 2),
            "requires_financial_restatement": is_material_adjustment,
            "audit_opinion_formulation": "UNMODIFIED_WITH_MURGC_AND_QUALIFIED_CARO_REPORT",
            "modules_summary": self.modules_executed
        }

workbench = MilestoneProject4AuditWorkbench("Apex Heavy Industrial Engineering Ltd", turnover_cr=6200.0, pbt_cr=420.0)
workbench.add_audit_module(1, "SA 540 / Ind AS 113 Estimates & Level 3 Fair Value Audit", issues_identified=2, net_adjustment_cr=42.0, caro_impact="Clause (i) PPE Revaluation Disclosures")
workbench.add_audit_module(2, "SA 550 / Sec 188 Related Party UBO Collision Engine", issues_identified=3, net_adjustment_cr=0.0, caro_impact="Clause (xiii) ADVERSE REMARK (INR 68 Cr Unauthorized RPT)")
workbench.add_audit_module(3, "SA 560 / Ind AS 10 Subsequent Events Triangulation", issues_identified=2, net_adjustment_cr=28.0, caro_impact="Clause (vii) Statutory Dues & Post-Balance Sheet Settlement")
workbench.add_audit_module(4, "SA 570 / CARO Clause (xix) Going Concern Stress Test", issues_identified=1, net_adjustment_cr=0.0, caro_impact="Clause (xvii) Cash Losses INR 35 Cr & Clause (xix) Adverse Remark")
workbench.add_audit_module(5, "SA 580 Written Representations & Final Dossier Assembly", issues_identified=0, net_adjustment_cr=0.0, caro_impact="Clean Representation Letter Obtained")

dashboard = workbench.generate_master_assurance_dashboard()
print("🏆 MILESTONE PROJECT 4 MASTER ASSURANCE & GOVERNANCE DASHBOARD:")
print(f"  Client Conglomerate       : {dashboard['conglomerate_name']}")
print(f"  Annual Turnover           : INR {dashboard['annual_turnover_cr']} Crores")
print(f"  Overall Materiality (5%)  : INR {dashboard['overall_materiality_cr']} Crores")
print(f"  Performance Materiality   : INR {dashboard['performance_materiality_cr']} Crores")
print(f"  Total Audit Adjustments   : INR {dashboard['total_proposed_adjustments_cr']} Crores (Material: {dashboard['requires_financial_restatement']})")
print(f"  Master Audit Opinion      : {dashboard['audit_opinion_formulation']}")
print("  Module Execution Summary:")
for m in dashboard['modules_summary']:
    print(f"    * {m['module']}: {m['issues']} issues | Adj: INR {m['adjustment_cr']} Cr | CARO: {m['caro_clause_impact']}")
''',
            "tryIt": "Change net_adjustment_cr to 0.0 across all modules to observe the total proposed adjustments drop to 0.0, resulting in clean financials without required restatement.",
            "check": {
                "question": "In Milestone Project 4, how are the statutory reporting requirements of SA 570 (Material Uncertainty Related to Going Concern) and CARO 2020 Clause (xix) integrated into the final audit delivery?",
                "options": [
                    "The auditor issues an Unmodified Opinion with a dedicated 'Material Uncertainty Related to Going Concern' paragraph in the independent auditor's report, and simultaneously includes an adverse qualified remark under CARO 2020 Clause (xix) highlighting the 1-year liquidity gap",
                    "The auditor deletes the CARO 2020 report to avoid confusing shareholders",
                    "The auditor replaces the entire audit report with a one-sentence tweet",
                    "The auditor resigns and leaves the country without issuing an opinion"
                ],
                "answerIndex": 0,
                "why": "When material uncertainty exists and is disclosed, SA 570 mandates an unmodified opinion with a MURGC paragraph, while CARO Clause (xix) requires an explicit statutory remark on 1-year liability viability."
            }
        },
        {
            "title": "Comprehensive Working Paper Archival & Quality Control Sign-Off: SA 220 & SA 230",
            "say": [
                "The completion of Milestone Project 4 marks the culmination of the core substantive assurance phases of the statutory audit. Under Standard on Quality Control (SQC) 1 and SA 220 (Revised), 'Quality Control for an Audit of Financial Statements', an Engagement Quality Control Review (EQCR) must be completed before the auditor's report is formally released and signed. The EQCR partner independently evaluates the significant judgments made by the engagement team, the conclusions reached in formulating the auditor's report, and the resolution of contentious matters.",
                "Under SA 230, the statutory audit documentation must be assembled into a final audit file within the mandatory statutory assembly period of not more than 60 days after the date of the auditor's report. Once the assembly of the final audit file has been completed, the auditor shall not delete or discard audit documentation of any nature before the end of its statutory retention period (not less than 7 years under SQC 1).",
                "The audit file must provide a record of: (1) Compliance with all applicable Standards on Auditing (SAs 200 through 580); (2) Professional skepticism exercised across fraud, accounting estimates, related parties, and going concern; and (3) The sufficient appropriate audit evidence supporting the audit opinion.",
                "Completing this milestone certifies your mastery across enterprise statutory assurance, elevating you to the rank of Senior Assurance Director and Governance Controller."
            ],
            "example": "The EQCR partner completes the quality review checklist for Apex Conglomerate: independently reviewing the SA 540 valuation workpapers, SA 550 UBO collision analysis, SA 560 subsequent events log, SA 570 going concern cash flow models, and the final SA 580 representation letter. The partner signs off on the quality control documentation, authorizing the formal issuance of the audit report and initiating the 60-day SA 230 file assembly lockdown.",
            "code": '''class SA220EQCRQualitySignOffEngine:
    def __init__(self, engagement_name: str, engagement_partner: str, eqcr_partner: str):
        self.engagement = engagement_name
        self.ep = engagement_partner
        self.eqcr = eqcr_partner
        self.checkpoints = []
        
    def add_checkpoint(self, checkpoint_name: str, approved: bool, comments: str):
        self.checkpoints.append({
            "checkpoint": checkpoint_name,
            "approved": approved,
            "comments": comments
        })
        
    def execute_quality_sign_off(self) -> dict:
        total_cp = len(self.checkpoints)
        approved_cp = sum(1 for c in self.checkpoints if c["approved"])
        can_release_report = total_cp == approved_cp
        
        return {
            "engagement": self.engagement,
            "engagement_partner": self.ep,
            "eqcr_reviewer": self.eqcr,
            "checkpoints_evaluated": total_cp,
            "checkpoints_approved": approved_cp,
            "eqcr_sign_off_granted": can_release_report,
            "status": "AUDIT_REPORT_RELEASE_AUTHORIZED_INITIATE_60_DAY_SA230_ASSEMBLY" if can_release_report else "AUDIT_REPORT_RELEASE_BLOCKED_RESOLVE_CONTENTIOUS_MATTERS",
            "checkpoints_detail": self.checkpoints
        }

eqcr = SA220EQCRQualitySignOffEngine("Apex Heavy Industrial Engineering Ltd", "Vikram Malhotra, FCA", "Sunita Rao, FCA (Senior Quality Partner)")
eqcr.add_checkpoint("SA 540 Accounting Estimates & Level 3 Valuation Review", True, "Corroborated with independent specialist range.")
eqcr.add_checkpoint("SA 550 Related Party & Section 188 Governance Compliance", True, "CARO Clause (xiii) adverse remark concurred.")
eqcr.add_checkpoint("SA 560 Subsequent Events & Adjusting Entries Review", True, "April debtor bankruptcy adjusting entry verified.")
eqcr.add_checkpoint("SA 570 Going Concern Stress Testing & MURGC Wording", True, "MURGC section and CARO Clause (xix) wording approved.")
eqcr.add_checkpoint("SA 580 Written Representation Completeness Verification", True, "Signed representation letter dated audit report date received.")

quality_res = eqcr.execute_quality_sign_off()
print("SA 220 Engagement Quality Control Review (EQCR) Sign-Off Engine:")
print(f"  Engagement Name       : {quality_res['engagement']}")
print(f"  Engagement Partner    : {quality_res['engagement_partner']}")
print(f"  EQCR Review Partner   : {quality_res['eqcr_reviewer']}")
print(f"  Checkpoints Approved  : {quality_res['checkpoints_approved']}/{quality_res['checkpoints_evaluated']}")
print(f"  Sign-Off Status       : {quality_res['status']}")
print("  EQCR Quality Review Trail:")
for cp in quality_res['checkpoints_detail']:
    print(f"    * {cp['checkpoint']}: Approved={cp['approved']} -> {cp['comments']}")
''',
            "tryIt": "Set approved to False for SA 570 Going Concern checkpoint to observe how the engine immediately blocks the release of the audit report under SA 220.",
            "check": {
                "question": "Under SA 220 and SQC 1, what is the mandatory rule regarding Engagement Quality Control Review (EQCR) for listed company audits?",
                "options": [
                    "The auditor's report shall not be dated or issued until the completion of the engagement quality control review",
                    "The EQCR can be conducted within three years after the audit report is printed",
                    "EQCR is optional if the engagement partner has more than 20 years of experience",
                    "EQCR is only required if the client requests it in writing"
                ],
                "answerIndex": 0,
                "why": "SA 220 Paragraph 19 explicitly mandates that the auditor's report shall not be dated until the completion of the engagement quality control review."
            }
        },
        {
            "title": "Milestone 4 Synthesis: Professional Assurance Director Accreditation",
            "say": [
                "Congratulations on completing Milestone Project 4 and conquering Days 16 through 20 of Auditing & Forensic Accounting. You have mastered the most sophisticated technical standards governing corporate auditing: auditing complex accounting estimates and Level 3 fair values under SA 540 and Ind AS 113; unmasking undisclosed related party networks and verifying arm's-length assertions under SA 550, Ind AS 24, and Section 188; executing subsequent event dual dating and post-issuance recall protocols under SA 560 and Ind AS 10; stress-testing going concern operational viability under SA 570 and authoring definitive statutory remarks under CARO 2020 Clauses (xvii) and (xix); and securing unassailable written representations under SA 580 while enforcing quality control under SA 220 and SA 230.",
                "Your mastery bridges the gap between mechanical checklist compliance and high-stakes forensic assurance. You possess the quantitative, legal, and investigative capabilities required to audit listed industrial conglomerates, defend capital market integrity, and navigate complex corporate restructurings.",
                "As you transition into Block 5 (Days 21 through 25), you will advance into the ultimate frontiers of assurance: Key Audit Matters (KAM) formulation under SA 701, the Anatomy of the Independent Auditor's Report under SA 700/705/706, Joint Audits under SA 299, Branch Audits, and Special Audit Investigations under the Companies Act and NFRA regulations.",
                "You are hereby conferred the professional credential of Senior Assurance Director & Corporate Governance Controller."
            ],
            "example": "The managing partner presents the Senior Assurance Director credential to the lead auditor, commending the flawless completion of the Apex Conglomerate Milestone 4 audit dossier: 5 modules executed, 100% test passing rate, zero uncorroborated representations, and complete statutory compliance under the Companies Act, 2013 and ICAI Standards on Auditing.",
            "code": '''def generate_milestone_4_assurance_director_credential(
    candidate_name: str,
    days_completed: list,
    mastered_standards: list,
    milestone_project_score_pct: float
) -> dict:
    return {
        "accredited_professional": candidate_name,
        "course_title": "Auditing & Forensic Accounting (bcom_aud)",
        "milestone_completed": "Milestone Project 4: Complex Substantive Assurance & Governance Workbench",
        "completed_days_span": f"Days {days_completed[0]} to {days_completed[-1]} (100% Verified)",
        "mastered_standards_list": mastered_standards,
        "examination_score_pct": milestone_project_score_pct,
        "conferred_credential": "SENIOR_ASSURANCE_DIRECTOR_AND_STATUTORY_GOVERNANCE_CONTROLLER",
        "professional_accreditation_status": "CERTIFIED_ACTIVE"
    }

cred = generate_milestone_4_assurance_director_credential(
    candidate_name="Lead Assurance Specialist",
    days_completed=[16, 17, 18, 19, 20],
    mastered_standards=["SA 540 Revised (Estimates)", "Ind AS 113 (Fair Value Level 1-3)", "SA 550 / Ind AS 24 / Sec 188 (Related Parties)", "SA 560 / Ind AS 10 (Subsequent Events)", "SA 570 Revised / CARO Clauses xvii & xix (Going Concern)", "SA 580 (Written Representations)", "SA 220 / SQC 1 (EQCR Quality Control)"],
    milestone_project_score_pct=98.5
)
print("🏆 PROFESSIONAL CREDENTIAL ISSUANCE:")
print(f"  Recipient Name        : {cred['accredited_professional']}")
print(f"  Course & Milestone    : {cred['course_title']} — {cred['milestone_completed']}")
print(f"  Completed Days        : {cred['completed_days_span']}")
print(f"  Conferred Credential  : {cred['conferred_credential']}")
print(f"  Accreditation Status  : {cred['professional_accreditation_status']}")
print("  Mastered Professional Standards:")
for std in cred['mastered_standards_list']:
    print(f"    * {std}")
''',
            "tryIt": "Update candidate_name to your own name to generate your personalized Senior Assurance Director credential.",
            "check": {
                "question": "What core competencies are certified upon successful completion of Milestone Project 4 in Auditing & Forensic Accounting?",
                "options": [
                    "Mastery of SA 540 accounting estimates, SA 550 related parties, SA 560 subsequent events, SA 570 going concern, SA 580 written representations, and CARO 2020 Clauses (xiii), (xvii), and (xix)",
                    "Basic knowledge of how to enter invoices into Tally Prime",
                    "How to prepare personal income tax returns for salaried individuals",
                    "How to trade cryptocurrency on offshore exchanges"
                ],
                "answerIndex": 0,
                "why": "Milestone Project 4 synthesizes the entire spectrum of complex substantive standards (SAs 540, 550, 560, 570, 580) and statutory CARO 2020 governance clauses."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day20.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 20 base JSON created successfully.")
