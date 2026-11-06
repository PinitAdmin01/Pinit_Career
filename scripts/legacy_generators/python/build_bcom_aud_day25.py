"""
Build Day 25 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Milestone Project 5: The Grand Enterprise Statutory Audit & Forensic Assurance Synthesis Capstone
"""
import json

day_data = {
    "day": 25,
    "title": "Milestone Project 5: Enterprise Statutory Audit, KAM Architecture & Forensic Assurance Cockpit",
    "parts": [
        {
            "title": "Enterprise Statutory Audit Cockpit & Materiality Reconciliation",
            "say": [
                "Welcome to Milestone Project 5: The Enterprise Statutory Audit, KAM Architecture & Forensic Assurance Cockpit. In this milestone capstone, you assume the supreme role of the Senior Statutory Assurance Partner and Lead Quality Reviewer commanding the comprehensive statutory audit of Bharat Infrastructure & Energy Conglomerate Ltd, a listed industrial powerhouse reporting Rs 14,500 Crore in annual turnover, Rs 1,150 Crore in Profit Before Tax, and Rs 22,000 Crore in total assets.",
                "In Part 1, your team establishes the master quantitative assurance architecture across Bharat Conglomerate's vast multi-entity structure: Overall Materiality is established at Rs 57.5 Crore (5% of PBT), Performance Materiality at Rs 37.38 Crore (65% factor), and the Clearly Trivial Threshold (Tolerable Error) at Rs 2.88 Crore (5% of Materiality).",
                "Your automated diagnostic reconciles the master Summary of Unadjusted Audit Differences (SUAD) across all operating divisions: aggregating identified audit differences, evaluating netting effects, and comparing uncorrected misstatements against materiality thresholds under SA 450.",
                "This quantitative reconciliation provides the empirical foundation upon which the final audit opinion is formulated."
            ],
            "example": "At the partner briefing, the engagement leader reviews the quantitative parameters for Bharat Conglomerate: evaluating 12 potential misstatements totaling Rs 48.5 Crore across 4 operating divisions. Because the aggregate uncorrected error of Rs 48.5 Crore is below overall materiality (Rs 57.5 Crore) but exceeds performance materiality (Rs 37.38 Crore), management agrees to record adjusting entries of Rs 26.0 Crore, bringing unadjusted differences down to Rs 22.5 Crore (well below performance materiality) and preserving a clean opinion.",
            "code": '''class EnterpriseAuditMaterialityReconciliationCockpit:
    def __init__(self, conglomerate_name: str, pbt_cr: float):
        self.conglomerate = conglomerate_name
        self.pbt_cr = pbt_cr
        self.overall_mat_cr = pbt_cr * 0.05
        self.pm_cr = self.overall_mat_cr * 0.65
        self.trivial_cr = self.overall_mat_cr * 0.05
        self.unadjusted_differences = []
        
    def log_misstatement(self, division: str, account: str, error_cr: float, management_agreed_to_adjust: bool):
        self.unadjusted_differences.append({
            "division": division,
            "account": account,
            "identified_error_cr": error_cr,
            "adjusted_by_management": management_agreed_to_adjust,
            "unadjusted_balance_cr": 0.0 if management_agreed_to_adjust else error_cr
        })
        
    def generate_materiality_reconciliation(self) -> dict:
        total_identified = sum(d["identified_error_cr"] for d in self.unadjusted_differences)
        total_adjusted = sum(d["identified_error_cr"] for d in self.unadjusted_differences if d["adjusted_by_management"])
        total_unadjusted = sum(d["unadjusted_balance_cr"] for d in self.unadjusted_differences)
        
        is_unadjusted_below_mat = total_unadjusted < self.overall_mat_cr
        is_unadjusted_below_pm = total_unadjusted < self.pm_cr
        
        return {
            "conglomerate": self.conglomerate,
            "overall_materiality_cr": round(self.overall_mat_cr, 2),
            "performance_materiality_cr": round(self.pm_cr, 2),
            "trivial_threshold_cr": round(self.trivial_cr, 2),
            "total_errors_identified_cr": round(total_identified, 2),
            "adjusted_by_management_cr": round(total_adjusted, 2),
            "net_unadjusted_differences_cr": round(total_unadjusted, 2),
            "unadjusted_below_overall_materiality": is_unadjusted_below_mat,
            "unadjusted_below_performance_materiality": is_unadjusted_below_pm,
            "audit_opinion_impact": "UNMODIFIED_OPINION_PERMITTED" if is_unadjusted_below_mat else "QUALIFIED_OPINION_REQUIRED",
            "differences_log": self.unadjusted_differences
        }

cockpit = EnterpriseAuditMaterialityReconciliationCockpit("Bharat Infrastructure & Energy Conglomerate Ltd", pbt_cr=1150.0)
cockpit.log_misstatement("Power Division", "Turbine Overhaul Capitalization vs Repairs", 18.5, True)
cockpit.log_misstatement("Solar Division", "Inverter NRV Inventory Valuation Deficit", 7.5, True)
cockpit.log_misstatement("Highways Division", "Unbilled Toll Revenue Accrual Cut-Off", 14.0, False)
cockpit.log_misstatement("Mining Division", "Environmental Decommissioning Provision Discount Rate", 8.5, False)

recon = cockpit.generate_materiality_reconciliation()
print("🏆 MILESTONE 5 MASTER MATERIALITY RECONCILIATION COCKPIT:")
print(f"  Conglomerate Name     : {recon['conglomerate']}")
print(f"  Overall Materiality   : INR {recon['overall_materiality_cr']} Crores (5% PBT)")
print(f"  Performance Mat. (65%): INR {recon['performance_materiality_cr']} Crores")
print(f"  Clearly Trivial (5%)  : INR {recon['trivial_threshold_cr']} Crores")
print(f"  Total Errors Found    : INR {recon['total_errors_identified_cr']} Cr (Adjusted: INR {recon['adjusted_by_management_cr']} Cr)")
print(f"  Net Unadjusted Diff.  : INR {recon['net_unadjusted_differences_cr']} Crores (Below Mat: {recon['unadjusted_below_overall_materiality']})")
print(f"  Master Opinion Impact : {recon['audit_opinion_impact']}")
''',
            "tryIt": "Set management_agreed_to_adjust to False for all items to observe net unadjusted errors surge to Rs 48.5 Cr.",
            "check": {
                "question": "In Milestone Project 5, what is the effect on the audit opinion when management agrees to adjust Rs 26.0 Crore of identified misstatements, bringing unadjusted differences to Rs 22.5 Crore?",
                "options": [
                    "An Unmodified (Clean) Opinion is permitted under SA 700 because the net unadjusted differences of Rs 22.5 Crore are well below overall materiality of Rs 57.5 Crore and performance materiality of Rs 37.38 Crore",
                    "The auditor must issue an Adverse Opinion regardless of adjustments",
                    "The auditor must disclaim an opinion because adjustments were made",
                    "The company must replace its Board of Directors"
                ],
                "answerIndex": 0,
                "why": "When management records adjustments reducing remaining uncorrected misstatements below materiality, an unmodified clean opinion under SA 700 is fully justified."
            }
        },
        {
            "title": "Module 2: Key Audit Matters (KAM) Formulation under SA 701",
            "say": [
                "As a major listed conglomerate, Bharat Infrastructure & Energy Conglomerate Ltd is legally subject to mandatory Key Audit Matters reporting under SA 701. In Module 2, your team deploys the 3-Step KAM Funnel across 18 candidate matters communicated to the Audit Committee.",
                "Your engine isolates two matters of most significance: KAM 1: Revenue Recognition and Percentage of Completion (POCM) Accounting on Long-Term Turnkey Infrastructure Contracts under Ind AS 115 (Turnover Rs 5,400 Crore); and KAM 2: Impairment Testing of Thermal Power Cash-Generating Units (CGUs) and Intangibles under Ind AS 36 (Asset Value Rs 4,800 Crore).",
                "For both matters, your team crafts the complete SA 701 disclosure architecture: cross-referencing Note 4 and Note 12, articulating WHY the matter was of most significance, detailing HOW our audit addressed it (including specialist involvement and sensitivity analysis), and summarizing the auditor's conclusion.",
                "This transparent reporting provides deep confidence to capital markets and credit rating agencies."
            ],
            "example": "The lead technical partner reviews the draft KAM for Ind AS 115 turnkey revenue: verifying that the narrative describes testing of IT ERP percentage-of-completion algorithms, engineering site visit inspections of physical progress, and retrospective analysis of past contract cost revisions. The partner concurs with the presentation.",
            "code": '''def formulate_milestone_5_kam_section(
    kam_entries: list
) -> dict:
    formatted_kams = []
    
    for k in kam_entries:
        kam_text = (
            f"Key Audit Matter: {k['title']}\\n"
            f"Reference: {k['note_reference']}\\n"
            f"Carrying Exposure: INR {k['exposure_cr']:.2f} Crores\\n\\n"
            f"Why it was a Key Audit Matter:\\n"
            f"{k['why_significant']}\\n\\n"
            f"How our audit addressed the Key Audit Matter:\\n"
            f"{k['how_addressed']}\\n\\n"
            f"Auditor Evaluation Conclusion:\\n"
            f"{k['conclusion']}"
        )
        formatted_kams.append({
            "title": k["title"],
            "exposure_cr": k["exposure_cr"],
            "full_text": kam_text
        })
        
    return {
        "kam_section_title": "KEY AUDIT MATTERS",
        "total_kams_reported": len(formatted_kams),
        "total_kam_exposure_cr": round(sum(k["exposure_cr"] for k in formatted_kams), 2),
        "kam_entries": formatted_kams
    }

kam_data = [
    {
        "title": "Turnkey Infrastructure Contract Revenue & POCM Cost Estimation (Ind AS 115)",
        "note_reference": "Note 4 (Revenue from Contracts with Customers)",
        "exposure_cr": 5400.0,
        "why_significant": "Turnkey construction revenue relies on percentage of completion models where total contract costs involve significant management judgment and estimation uncertainty.",
        "how_addressed": "Tested IT controls over milestone billings, verified physical engineering progress reports across 14 mega-sites, and evaluated contract contingency reserves.",
        "conclusion": "We found management's estimates of contract costs to complete and recognized revenue to be acceptable and supportable."
    },
    {
        "title": "Impairment Assessment of Thermal Power Generation CGUs (Ind AS 36)",
        "note_reference": "Note 12 (Property, Plant and Equipment & Impairment)",
        "exposure_cr": 4800.0,
        "why_significant": "Thermal generation assets face long-term ESG transition risks, requiring DCF Value-in-Use models with subjective discount rates and plant load factors (PLF).",
        "how_addressed": "Engaged auditor valuation specialists under SA 620 to benchmark WACC discount rates (11.8%) and stress-tested power purchase agreement (PPA) tariff assumptions.",
        "conclusion": "Based on our procedures, the carrying amounts of thermal CGUs are supportable within a reasonable sensitivity range."
    }
]

kam_section = formulate_milestone_5_kam_section(kam_data)
print("SA 701 Key Audit Matters Module 2 Architecture:")
print(f"  Section Title         : {kam_section['kam_section_title']}")
print(f"  Total KAMs Formulated : {kam_section['total_kams_reported']} (Exposure: INR {kam_section['total_kam_exposure_cr']} Crores)")
print("  Sample Formulated KAM:")
print(kam_section['kam_entries'][0]['full_text'])
''',
            "tryIt": "Add a third KAM entry for foreign exchange hedging derivatives to observe the total exposure calculate dynamically.",
            "check": {
                "question": "In Milestone Project 5, what two Key Audit Matters are formulated under SA 701 for Bharat Conglomerate?",
                "options": [
                    "Turnkey infrastructure contract revenue recognition (Ind AS 115) and Thermal power generation CGU impairment testing (Ind AS 36)",
                    "Petty cash reimbursement and office tea supplies",
                    "Employee uniform laundry costs and parking fees",
                    "Director personal golf club memberships"
                ],
                "answerIndex": 0,
                "why": "Long-term contract revenue recognition and thermal CGU impairment involve massive financial scale (Rs 5,400 Cr and Rs 4,800 Cr) and extreme estimation subjectivity."
            }
        },
        {
            "title": "Module 3: Joint Audit Allocation & Branch Audits Coordination",
            "say": [
                "Due to Bharat Conglomerate's vast national operations, the shareholders appointed two joint statutory auditors: Firm Alpha LLP and Firm Beta LLP. Furthermore, 14 regional manufacturing plants and power stations are audited by regional branch auditors under Section 143(8).",
                "In Module 3, your team deploys the Joint Audit Allocation Engine under SA 299: Firm Alpha audits the Infrastructure, Power, and Overseas SPVs; Firm Beta audits the Solar Division, Corporate Treasury, Procurement, and Employee Benefits. Common areas—Materiality, Going Concern, and Schedule III presentation—are executed jointly.",
                "Simultaneously, your team aggregates the 14 branch audit returns under Section 143(8) and SA 600: verifying that all branch reports, trial balances, and CARO returns were received on time, with identified local issues (such as local municipal tax disputes of Rs 8.5 Crore) appropriately consolidated.",
                "Under Section 143(3)(c), your team authors the statutory branch audit confirmation text, ensuring complete statutory compliance."
            ],
            "example": "The joint audit committee of Alpha LLP and Beta LLP reviews the combined audit status: certifying that all 14 branch audit returns were received and audited under Section 143(8), both firms reached consensus on all accounting policies, and the joint audit report will be executed jointly without separate dissenting reports.",
            "code": '''def coordinate_milestone_5_joint_and_branch_audits(
    joint_firms: list,
    branch_count: int,
    all_branch_reports_received: bool,
    disagreements_between_joint_auditors: bool
) -> dict:
    if disagreements_between_joint_auditors:
        joint_verdict = "DISAGREEMENT: SEPARATE_REPORTS_MANDATED_UNDER_SA299"
    else:
        joint_verdict = "CONSENSUS: SINGLE_CONSOLIDATED_JOINT_AUDIT_REPORT_SIGNED_BY_BOTH_FIRMS"
        
    branch_statutory_text = (
        f"The reports on the accounts of the {branch_count} branch offices of the Company audited under sub-section (8) "
        f"of Section 143 by branch auditors have been sent to us and have been properly dealt with by us in preparing this report."
        if all_branch_reports_received else
        f"Scope limitation: {branch_count} branch reports not received."
    )
    
    return {
        "joint_audit_firms": joint_firms,
        "joint_audit_consensus": joint_verdict,
        "branch_audits_count": branch_count,
        "all_branches_received": all_branch_reports_received,
        "sec143_3_c_statutory_text": branch_statutory_text,
        "governance_status": "MULTI_FIRM_GOVERNANCE_SUCCESSFUL" if all_branch_reports_received and not disagreements_between_joint_auditors else "GOVERNANCE_DEFICIENCY"
    }

multi_firm_eval = coordinate_milestone_5_joint_and_branch_audits(
    joint_firms=["Alpha Assurance Advisors LLP", "Beta Global Auditors LLP"],
    branch_count=14,
    all_branch_reports_received=True,
    disagreements_between_joint_auditors=False
)

print("SA 299 & Section 143(8) Joint & Branch Audit Coordination Module 3:")
print(f"  Joint Audit Firms     : {multi_firm_eval['joint_audit_firms']}")
print(f"  Joint Audit Consensus : {multi_firm_eval['joint_audit_consensus']}")
print(f"  Branch Coverage       : {multi_firm_eval['branch_audits_count']} branches (All Received: {multi_firm_eval['all_branches_received']})")
print(f"  Section 143(3)(c) Text: \"{multi_firm_eval['sec143_3_c_statutory_text']}\"")
print(f"  Overall Governance    : {multi_firm_eval['governance_status']}")
''',
            "tryIt": "Set disagreements_between_joint_auditors to True to observe how the engine immediately mandates separate dissenting reports under SA 299.",
            "check": {
                "question": "In Milestone Project 5, how are the branch audits under Section 143(8) formally acknowledged in the joint statutory audit report?",
                "options": [
                    "Through a mandatory statutory statement in the Report on Other Legal and Regulatory Requirements under Section 143(3)(c) confirming that all 14 branch reports were sent to the auditors and properly dealt with",
                    "By attaching photographs of all 14 branch buildings",
                    "By requiring all 14 branch auditors to travel to Mumbai for a group photo",
                    "Branch audits are confidential and never mentioned in the statutory report"
                ],
                "answerIndex": 0,
                "why": "Section 143(3)(c) of the Companies Act, 2013 explicitly mandates the inclusion of a statutory statement confirming receipt and handling of branch audit reports."
            }
        },
        {
            "title": "Module 4: CARO 2020 21-Clause Compliance & IFCoFR Section 143(3)(i) Annexures",
            "say": [
                "In Module 4, your team executes the comprehensive statutory audit reporting annexures: Annexure A (CARO 2020 21-Clause Report) and Annexure B (IFCoFR Internal Financial Controls Report under Section 143(3)(i)).",
                "For CARO 2020, your engine audits all 21 statutory clauses across Bharat Conglomerate: verifying PPE title deeds under Clause (i); inspecting bank quarterly stock statements under Clause (ii); confirming compliance with Section 185/186 on loans under Clause (iv); auditing timely payment of statutory dues under Clause (vii); verifying loan fund utilization under Clause (ix); investigating fraud and whistleblower complaints under Clause (xi); evaluating consecutive cash losses under Clause (xvii); delivering positive assurance on 1-year financial viability under Clause (xix); and confirming CSR spending under Clause (xx).",
                "For IFCoFR under Section 143(3)(i), your team evaluates the operating effectiveness of 220 internal financial controls across business process cycles and IT general controls (ITGC). With zero material weaknesses identified, your team issues a clean Unmodified IFCoFR Opinion.",
                "Synthesizing these annexures provides complete regulatory compliance across ICAI and MCA mandates."
            ],
            "example": "The engagement partner reviews the CARO 2020 annexure: all 21 clauses are clean except for an adverse remark under Clause (vii) regarding Rs 4.2 Crore in disputed municipal property tax arrears pending in High Court. The partner approves the disclosure, noting that all undisputed statutory dues were paid within 6 months.",
            "code": '''def evaluate_milestone_5_caro_and_ifcofr(
    total_caro_clauses: int = 21,
    disputed_statutory_dues_cr: float = 4.2,
    ifcofr_controls_tested: int = 220,
    material_weaknesses_count: int = 0
) -> dict:
    has_caro_adverse = disputed_statutory_dues_cr > 0
    is_ifcofr_clean = material_weaknesses_count == 0
    
    caro_verdict = (
        f"QUALIFIED_CARO_REPORT: Clause (vii)(b) adverse remark regarding INR {disputed_statutory_dues_cr} Cr "
        f"disputed municipal property tax pending before High Court; remaining 20 clauses clean."
        if has_caro_adverse else "UNMODIFIED_CLEAN_CARO_REPORT_ALL_21_CLAUSES_COMPLIANT"
    )
    
    ifcofr_verdict = (
        f"UNMODIFIED_CLEAN_IFCOFR_OPINION: Tested {ifcofr_controls_tested} key controls with zero material weaknesses."
        if is_ifcofr_clean else f"MODIFIED_IFCOFR_REPORT: {material_weaknesses_count} material weakness(es) identified."
    )
    
    return {
        "caro_clauses_evaluated": total_caro_clauses,
        "caro_status": caro_verdict,
        "ifcofr_controls_audited": ifcofr_controls_tested,
        "ifcofr_opinion": ifcofr_verdict,
        "annexures_ready_for_release": True
    }

annex_res = evaluate_milestone_5_caro_and_ifcofr()
print("CARO 2020 & IFCoFR Section 143(3)(i) Module 4 Engine:")
print(f"  CARO Clauses Evaluated: {annex_res['caro_clauses_evaluated']}")
print(f"  CARO 2020 Status      : {annex_res['caro_status']}")
print(f"  IFCoFR Controls Tested: {annex_res['ifcofr_controls_audited']}")
print(f"  IFCoFR Opinion        : {annex_res['ifcofr_opinion']}")
print(f"  Annexures Ready       : {annex_res['annexures_ready_for_release']}")
''',
            "tryIt": "Set material_weaknesses_count to 1 to observe the IFCoFR opinion transform to a modified report with an adverse control remark.",
            "check": {
                "question": "Under Section 143(3)(i) of the Companies Act, 2013, what must the statutory auditor report regarding internal financial controls?",
                "options": [
                    "Whether the company has adequate internal financial controls with reference to financial statements in place and the operating effectiveness of such controls",
                    "Whether the company uses antivirus software on office computers",
                    "Whether employees arrive at work before 9:00 AM",
                    "Whether the company's website has an SSL certificate"
                ],
                "answerIndex": 0,
                "why": "Section 143(3)(i) explicitly requires the auditor to state whether the company has adequate internal financial controls with reference to financial statements and whether they operated effectively."
            }
        },
        {
            "title": "Module 5: Master Synthesis & Grand Assurance Partner Accreditation",
            "say": [
                "Congratulations on completing Milestone Project 5 and conquering Block 5 (Days 21 through 25) of Auditing & Forensic Accounting. You have mastered the supreme technical, legal, and communicative frameworks governing global corporate assurance: the anatomy and sequencing of the Independent Auditor's Report under SA 700 (Revised); the decision matrix for opinion modifications (Qualified, Adverse, and Disclaimer) under SA 705 (Revised); the precise deployment of Emphasis of Matter and Other Matter paragraphs under SA 706 (Revised); the identification, funneling, and drafting of Key Audit Matters under SA 701; the division of work and separate reporting in Joint Audits under SA 299 (Revised); and Branch Audits under Section 143(8) and SA 600.",
                "Across the five comprehensive modules of Milestone Project 5, you have demonstrated the ability to command a multi-firm audit of a listed multi-billion-rupee conglomerate: reconciling materiality across complex subsidiaries, communicating high-stakes Key Audit Matters with technical clarity, executing seamless joint and branch audit governance, and authoring authoritative statutory annexures under CARO 2020 and Section 143(3).",
                "You are hereby conferred the prestigious professional accreditation of Senior Statutory Assurance Partner & Corporate Governance Director.",
                "As you prepare for the final Block 6 (Days 26 through 30), you will advance into the ultimate capstone frontiers: Digital Forensic E-Discovery, Cyber Incident Auditing, Artificial Intelligence & Machine Learning Audit Trails, and the CTO Grand Master Capstone, completing the full 30-day curriculum of Auditing & Forensic Accounting!"
            ],
            "example": "The National Financial Reporting Authority (NFRA) and ICAI Governing Council award the Senior Statutory Assurance Partner credential to the lead auditor, commending the flawless completion of the Bharat Conglomerate audit dossier: 100% test pass rate, perfect SA 700 sequencing, transparent SA 701 KAM reporting, and comprehensive CARO 2020 compliance.",
            "code": '''def generate_grand_assurance_partner_accreditation(
    candidate_name: str,
    days_completed: list,
    mastered_standards: list,
    milestone_project_score_pct: float
) -> dict:
    return {
        "accredited_professional": candidate_name,
        "course": "Auditing & Forensic Accounting (bcom_aud)",
        "milestone_completed": "Milestone Project 5: Enterprise Statutory Audit & Forensic Assurance Cockpit",
        "days_span": f"Days {days_completed[0]} to {days_completed[-1]} (100% Verified)",
        "mastered_standards": mastered_standards,
        "examination_score_pct": milestone_project_score_pct,
        "conferred_credential": "SENIOR_STATUTORY_ASSURANCE_PARTNER_AND_CORPORATE_GOVERNANCE_DIRECTOR",
        "accreditation_status": "ACTIVE_AND_FULLY_CERTIFIED"
    }

accred = generate_grand_assurance_partner_accreditation(
    candidate_name="Lead Assurance Partner",
    days_completed=[21, 22, 23, 24, 25],
    mastered_standards=[
        "SA 700 Revised (Forming an Opinion & Report Anatomy)",
        "SA 705 Revised (Modifications: Qualified, Adverse, Disclaimer)",
        "SA 706 Revised (Emphasis of Matter & Other Matter)",
        "SA 701 (Key Audit Matters Funnel & Drafting)",
        "SA 299 Revised (Joint Audits & Separate Reporting)",
        "Companies Act Sec 143(8) / SA 600 (Branch Audits)",
        "CARO 2020 (21 Statutory Clauses Annexure)",
        "Companies Act Sec 143(3)(i) (IFCoFR Operating Effectiveness)"
    ],
    milestone_project_score_pct=99.2
)

print("🏆 PRESTIGIOUS PROFESSIONAL ACCREDITATION ISSUANCE:")
print(f"  Recipient Name        : {accred['accredited_professional']}")
print(f"  Course & Milestone    : {accred['course']} — {accred['milestone_completed']}")
print(f"  Completed Days        : {accred['days_span']}")
print(f"  Conferred Credential  : {accred['conferred_credential']}")
print(f"  Accreditation Status  : {accred['accreditation_status']} (Score: {accred['examination_score_pct']}%)")
print("  Mastered Professional Standards & Statutes:")
for std in accred['mastered_standards']:
    print(f"    * {std}")
''',
            "tryIt": "Update candidate_name to your personal name to print your personalized Senior Statutory Assurance Partner accreditation.",
            "check": {
                "question": "What major professional milestone is certified upon completing Milestone Project 5 (Days 21-25) in Auditing & Forensic Accounting?",
                "options": [
                    "Senior Statutory Assurance Partner & Corporate Governance Director accreditation, certifying mastery of SA 700/705/706 audit opinions, SA 701 Key Audit Matters, SA 299 Joint Audits, Section 143(8) Branch Audits, and CARO 2020",
                    "Certification in basic bookkeeping and cash ledger entries",
                    "A certificate of attendance for a one-hour webinar",
                    "A license to drive corporate delivery trucks"
                ],
                "answerIndex": 0,
                "why": "Milestone Project 5 certifies comprehensive mastery over the entire statutory reporting and multi-firm audit architecture under Indian and international standards."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day25.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 25 base JSON created successfully.")
