"""
Build Day 24 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Joint Audits, Branch Audits & Group Audits: SA 299 Revised, Section 143(8) & SA 600
"""
import json

day_data = {
    "day": 24,
    "title": "Joint Audits, Branch Audits & Group Financial Statements: SA 299 Revised, Section 143(8) & SA 600",
    "parts": [
        {
            "title": "Joint Audit Architecture, Division of Work & Allocation: SA 299 Revised",
            "say": [
                "Standard on Auditing (SA) 299 (Revised), 'Joint Audit of Financial Statements', governs the professional responsibilities, work allocation, and reporting framework when two or more independent audit firms are appointed jointly as the statutory auditors of an entity. Joint audits are widely prevalent in India across public sector banks, large insurance corporations, and major public sector undertakings (PSUs), and are increasingly encouraged for large listed commercial conglomerates to enhance audit quality and independence.",
                "Where joint auditors are appointed, they shall arrive at an agreed division of audit work. In developing the joint audit plan, the joint auditors shall identify the division of audit areas and common audit areas, and allocate work among themselves. Such division of work is typically agreed upon with management and documented in a formal Work Allocation Document (Engagement Work Allocation Agreement).",
                "Work allocation may be executed on the basis of: (1) Specific geographical divisions or branch locations (e.g., Joint Auditor A audits North and East regions, while Joint Auditor B audits West and South regions); (2) Functional accounting areas or individual financial statement components (e.g., Joint Auditor A audits Revenue, Trade Receivables, and Fixed Assets; Joint Auditor B audits Treasury, Borrowings, Inventories, and Operating Expenses); or (3) Specified asset classes or operating subsidiaries.",
                "The Work Allocation Document must be signed by all joint auditors and communicated to Those Charged With Governance (TCWG). Work not specifically allocated is deemed to be the joint and several responsibility of all joint auditors."
            ],
            "example": "In a joint statutory audit of a national commercial bank with Rs 4,50,000 Crore in assets, two prominent audit firms (Firm Alpha and Firm Beta) are appointed joint auditors. The firms sign a formal Work Allocation Agreement: Firm Alpha audits Corporate Credit, Treasury Operations, and International Branches; Firm Beta audits Retail Banking, NPA Provisioning, Fixed Assets, and IT Systems. Common areas (Going Concern under SA 570, Compliance with Banking Regulation Act, and Overall Materiality) are agreed upon jointly.",
            "code": '''class JointAuditWorkAllocationEngine:
    def __init__(self, entity_name: str, joint_firms: list):
        self.entity = entity_name
        self.firms = joint_firms
        self.allocated_areas = []
        self.common_areas = []
        
    def allocate_work(self, area_name: str, assigned_firm: str, asset_volume_cr: float):
        self.allocated_areas.append({
            "audit_area": area_name,
            "assigned_firm": assigned_firm,
            "volume_cr": asset_volume_cr,
            "responsibility": "INDIVIDUAL_AND_SEPARATE_LIABILITY"
        })
        
    def add_common_area(self, area_name: str, description: str):
        self.common_areas.append({
            "common_area": area_name,
            "description": description,
            "responsibility": "JOINT_AND_SEVERAL_LIABILITY_OF_ALL_FIRMS"
        })
        
    def generate_work_allocation_charter(self) -> dict:
        total_vol = sum(a["volume_cr"] for a in self.allocated_areas)
        firm_breakdown = {}
        for a in self.allocated_areas:
            f = a["assigned_firm"]
            firm_breakdown[f] = firm_breakdown.get(f, 0.0) + a["volume_cr"]
            
        return {
            "entity": self.entity,
            "joint_auditors": self.firms,
            "total_allocated_volume_cr": round(total_vol, 2),
            "firm_volume_distribution_cr": firm_breakdown,
            "allocated_areas_count": len(self.allocated_areas),
            "common_areas_count": len(self.common_areas),
            "work_allocation_document_status": "SA299_REVISED_COMPLIANT_SIGNED",
            "allocated_areas_detail": self.allocated_areas,
            "common_areas_detail": self.common_areas
        }

joint_eng = JointAuditWorkAllocationEngine("Apex National Commercial Bank Ltd", ["Alpha & Associates LLP", "Beta & Co LLP"])
joint_eng.allocate_work("Corporate Credit & Large NPA Provisions", "Alpha & Associates LLP", 240000.0)
joint_eng.allocate_work("Treasury & Derivatives Portfolio", "Alpha & Associates LLP", 65000.0)
joint_eng.allocate_work("Retail & SME Advances Portfolio", "Beta & Co LLP", 110000.0)
joint_eng.allocate_work("Physical Cash & Branch Operations", "Beta & Co LLP", 35000.0)

joint_eng.add_common_area("Overall Materiality & Planning (SA 320)", "Joint determination of audit materiality and benchmark percentages.")
joint_eng.add_common_area("Going Concern & Viability Assessment (SA 570)", "Joint stress testing of liquidity ratios and statutory reserve compliance.")
joint_eng.add_common_area("Final Financial Statement Presentation (SA 700)", "Joint review of Schedule III disclosures and notes to accounts.")

charter = joint_eng.generate_work_allocation_charter()
print("SA 299 Revised Joint Audit Work Allocation Engine:")
print(f"  Entity Audited        : {charter['entity']}")
print(f"  Joint Audit Firms     : {charter['joint_auditors']}")
print(f"  Total Portfolio Volume: INR {charter['total_allocated_volume_cr']} Crores")
print(f"  Firm Workload Share   : {charter['firm_volume_distribution_cr']}")
print(f"  Charter Legal Status  : {charter['work_allocation_document_status']}")
print("  Common Areas (Joint & Several Liability):")
for ca in charter['common_areas_detail']:
    print(f"    * {ca['common_area']}: {ca['description']}")
''',
            "tryIt": "Add a new allocated area for Fixed Assets and IT systems assigned to Beta & Co to observe the volume distribution update dynamically.",
            "check": {
                "question": "Under SA 299 (Revised), what is the legal liability of joint auditors regarding audit areas that have NOT been specifically divided and allocated among them?",
                "options": [
                    "All joint auditors are jointly and severally responsible for all audit work that is not specifically divided and allocated",
                    "The senior partner's firm takes 100% of the blame alone",
                    "Neither auditor is responsible; the error is blamed on management",
                    "Responsibility is decided by a coin toss in the High Court"
                ],
                "answerIndex": 0,
                "why": "SA 299 Paragraph 11 explicitly establishes that in respect of audit work that is not divided and is carried out by all joint auditors, the joint auditors shall be jointly and severally responsible."
            }
        },
        {
            "title": "Individual vs Joint & Several Liability & Reliance Rules: SA 299",
            "say": [
                "SA 299 (Revised) establishes clear legal boundaries demarcating Individual Responsibility from Joint and Several Responsibility, providing statutory protection against unfair liability.",
                "Individual Responsibility: Each joint auditor is separately and individually responsible ONLY for the work allocated to such joint auditor, including the appropriateness of the nature, timing, and extent of the audit procedures performed on such allocated work. A joint auditor is NOT required to review the work done by other joint auditors and is entitled to rely on the work performed by other joint auditors (SA 299 Paragraph 9).",
                "Joint and Several Responsibility: All joint auditors are jointly and severally responsible for: (a) Audit work which is not divided among them and is carried out by all joint auditors; (b) Decisions taken by all joint auditors under audit planning in respect of common audit areas concerning the nature, timing, and extent of audit procedures; (c) Matters which are brought to the notice of all joint auditors by any one of them and on which there is an agreement among all joint auditors; (d) Examining that the financial statements comply with the requirements of the relevant statute (Schedule III of Companies Act); (e) Presentation and disclosure of the financial statements as required by the applicable financial reporting framework (Ind AS); and (f) Ensuring that the audit report complies with the requirements of the relevant statute and Standards on Auditing.",
                "Each joint auditor must assume that other joint auditors have performed their assigned work in accordance with Standards on Auditing."
            ],
            "example": "In a joint audit, Firm Alpha is assigned Treasury and Foreign Exchange. Firm Alpha fails to detect a massive Rs 60 Crore unauthorized derivative loss due to gross negligence in its sampling procedures. Firm Beta had zero involvement in Treasury and had no knowledge of the issue. Under SA 299, Firm Beta is legally protected: Firm Beta was entitled to rely on Firm Alpha's execution of its allocated work. Liability rests solely with Firm Alpha.",
            "code": '''def evaluate_sa299_liability_attribution(
    issue_description: str,
    allocated_to_firm: str, # "FIRM_ALPHA", "FIRM_BETA", or "COMMON_UNALLOCATED_AREA"
    was_issue_brought_to_notice_of_all_firms: bool,
    is_presentation_or_disclosure_issue: bool
) -> dict:
    if allocated_to_firm == "COMMON_UNALLOCATED_AREA" or is_presentation_or_disclosure_issue or was_issue_brought_to_notice_of_all_firms:
        liability_verdict = "JOINT_AND_SEVERAL_LIABILITY_OF_ALL_AUDIT_FIRMS"
        legal_rationale = (
            "Under SA 299 Paragraph 11, common unallocated areas, overall presentation/disclosure compliance, "
            "and matters formally brought to the notice of all joint auditors carry undivided joint and several liability."
        )
        liable_parties = ["FIRM_ALPHA", "FIRM_BETA"]
    else:
        liability_verdict = f"INDIVIDUAL_EXCLUSIVE_LIABILITY_OF_{allocated_to_firm}"
        legal_rationale = (
            f"Under SA 299 Paragraph 9, each joint auditor is entitled to assume that the other joint auditor "
            f"has complied with Standards on Auditing. Liability is confined exclusively to {allocated_to_firm}."
        )
        liable_parties = [allocated_to_firm]
        
    return {
        "issue": issue_description,
        "allocation": allocated_to_firm,
        "liability_classification": liability_verdict,
        "liable_firms": liable_parties,
        "sa299_legal_basis": legal_rationale
    }

case_1 = evaluate_sa299_liability_attribution(
    issue_description="Failure to detect Rs 60 Cr derivative loss in Treasury",
    allocated_to_firm="FIRM_ALPHA",
    was_issue_brought_to_notice_of_all_firms=False,
    is_presentation_or_disclosure_issue=False
)

case_2 = evaluate_sa299_liability_attribution(
    issue_description="Omission of Ind AS 115 revenue accounting policy note in published annual report",
    allocated_to_firm="FIRM_ALPHA",
    was_issue_brought_to_notice_of_all_firms=False,
    is_presentation_or_disclosure_issue=True
)

print("SA 299 Revised Joint Audit Liability Attribution Engine:")
print(f"  [1] Treasury Case : {case_1['liability_classification']}")
print(f"      * Liable Parties: {case_1['liable_firms']}")
print(f"      * Legal Defense : {case_1['sa299_legal_basis']}")
print(f"  [2] Disclosure Case: {case_2['liability_classification']}")
print(f"      * Liable Parties: {case_2['liable_firms']}")
print(f"      * Legal Defense : {case_2['sa299_legal_basis']}")
''',
            "tryIt": "Set was_issue_brought_to_notice_of_all_firms to True in Case 1 to observe liability transform from individual to joint and several.",
            "check": {
                "question": "Under SA 299 (Revised), is a joint auditor required to review or re-perform the audit procedures executed by another joint auditor on their allocated area?",
                "options": [
                    "No, a joint auditor is not required to review the work done by the other joint auditors and is entitled to assume that the other joint auditors have performed their work in accordance with Standards on Auditing",
                    "Yes, every joint auditor must 100% re-perform all audit procedures of the other firm",
                    "Only if the other audit firm has fewer than 10 partners",
                    "Yes, but only on national holidays"
                ],
                "answerIndex": 0,
                "why": "SA 299 Paragraph 9 explicitly establishes that each joint auditor is entitled to rely on the work performed by other joint auditors and is not required to review their work."
            }
        },
        {
            "title": "Disagreement Among Joint Auditors & Separate Reporting: SA 299",
            "say": [
                "What occurs when joint auditors disagree on the audit opinion or on the accounting treatment of a material matter? SA 299 (Revised) establishes one of the most distinctive and legally protective provisions in Indian auditing standards.",
                "Under SA 299 Paragraph 13, normally, the joint auditors are able to arrive at an agreed report. However, where the joint auditors disagree with regard to the opinion or any matters to be stated in the audit report, SA 299 legally mandates that:",
                "Each joint auditor shall express their own opinion through a separate audit report! A joint auditor shall NOT be bound to adopt the majority opinion or the opinion of the other joint auditor.",
                "In such circumstances, each separate audit report issued by each joint auditor shall make reference to the other audit report(s) issued by the other joint auditor(s). For example, Joint Auditor A may issue a clean Unmodified Report referencing the Qualified Report issued by Joint Auditor B, while Joint Auditor B issues a Qualified Report referencing Joint Auditor A's report.",
                "This guarantees that no audit firm can be coerced into signing a report with which it disagrees, protecting partner independence and integrity."
            ],
            "example": "In a joint audit of a state enterprise, Joint Auditor Alpha believes that Rs 120 Crore in overdue government subsidies is fully recoverable and demands a clean opinion. Joint Auditor Beta discovers that the subsidy scheme was terminated by official notification and insists on an immediate 100% impairment under Ind AS 109. Because the firms disagree, Joint Auditor Alpha issues an Unmodified Report referencing Beta's report, while Joint Auditor Beta issues a Qualified Report referencing Alpha's report. Both reports are published in the annual report.",
            "code": '''def handle_sa299_joint_auditor_disagreement(
    firm_alpha_name: str,
    firm_alpha_opinion: str, # "UNMODIFIED_OPINION"
    firm_beta_name: str,
    firm_beta_opinion: str,  # "QUALIFIED_OPINION"
    matter_in_dispute: str
) -> dict:
    has_disagreement = firm_alpha_opinion != firm_beta_opinion
    
    if not has_disagreement:
        reporting_protocol = "SINGLE_CONSOLIDATED_JOINT_AUDIT_REPORT_SIGNED_BY_ALL_FIRMS"
        reports_issued = [{
            "report_type": "JOINT_AGREED_REPORT",
            "signatories": [firm_alpha_name, firm_beta_name],
            "opinion": firm_alpha_opinion
        }]
    else:
        reporting_protocol = "MANDATORY_SEPARATE_AUDIT_REPORTS_WITH_CROSS_REFERENCES"
        reports_issued = [
            {
                "report_id": f"REPORT_1_{firm_alpha_name.upper().replace(' ', '_')}",
                "signatory": firm_alpha_name,
                "opinion_expressed": firm_alpha_opinion,
                "statutory_cross_reference": f"We draw attention to the separate audit report dated May 15, 2026 issued by {firm_beta_name}, who expressed a {firm_beta_opinion} on the financial statements."
            },
            {
                "report_id": f"REPORT_2_{firm_beta_name.upper().replace(' ', '_')}",
                "signatory": firm_beta_name,
                "opinion_expressed": firm_beta_opinion,
                "statutory_cross_reference": f"We draw attention to the separate audit report dated May 15, 2026 issued by {firm_alpha_name}, who expressed an {firm_alpha_opinion} on the financial statements."
            }
        ]
        
    return {
        "dispute_matter": matter_in_dispute,
        "disagreement_active": has_disagreement,
        "reporting_verdict": reporting_protocol,
        "reports_generated": reports_issued
    }

disagreement_res = handle_sa299_joint_auditor_disagreement(
    firm_alpha_name="Alpha & Associates LLP",
    firm_alpha_opinion="UNMODIFIED_OPINION",
    firm_beta_name="Beta & Co LLP",
    firm_beta_opinion="QUALIFIED_OPINION",
    matter_in_dispute="INR 120 Cr Disputed Government Subsidy Impairment"
)
print("SA 299 Revised Joint Auditor Disagreement Protocol Engine:")
print(f"  Matter in Dispute     : {disagreement_res['dispute_matter']}")
print(f"  Disagreement Active   : {disagreement_res['disagreement_active']}")
print(f"  Reporting Mandate     : {disagreement_res['reporting_verdict']}")
print("  Generated Reports Structure:")
for r in disagreement_res['reports_generated']:
    print(f"    * Signatory: {r['signatory']} -> Opinion: [{r['opinion_expressed']}]")
    print(f"      Cross-Reference: \"{r['statutory_cross_reference']}\"")
''',
            "tryIt": "Set firm_beta_opinion to UNMODIFIED_OPINION to observe how agreement collapses the output into a single consolidated joint audit report.",
            "check": {
                "question": "Under SA 299 (Revised), what is the mandatory requirement when joint auditors disagree regarding the audit opinion on financial statements?",
                "options": [
                    "Each joint auditor shall express their own opinion through a separate audit report, and each report shall make reference to the other audit report(s)",
                    "The audit firm with the higher gross fee revenue gets to decide the opinion for both firms",
                    "The company's Board of Directors casts the tie-breaking vote",
                    "Both audit firms are automatically disqualified and fired without payment"
                ],
                "answerIndex": 0,
                "why": "SA 299 Paragraph 13 explicitly mandates that when joint auditors disagree, each shall issue a separate report referencing the other report(s)."
            }
        },
        {
            "title": "Branch Audits & Division of Responsibilities: Companies Act Section 143(8)",
            "say": [
                "Under Section 143(8) of the Companies Act, 2013, where a company has a branch office, the accounts of that branch shall be audited either by the company's principal statutory auditor or by any other person qualified for appointment as an auditor of the company under this Act (a Branch Auditor). For branches outside India, the accounts can be audited by an accountant qualified under the laws of that foreign country.",
                "Section 143(8) imposes a strict statutory communication protocol: (1) The Branch Auditor shall prepare a report on the accounts of the branch examined by them and send it to the company's principal auditor; and (2) The principal auditor shall deal with such report in such manner as they consider necessary.",
                "In dealing with branch audit reports, the principal auditor applies Standard on Auditing (SA) 600, 'Using the Work of Another Auditor'. The principal auditor evaluates whether the branch auditor's work is adequate for the principal auditor's purposes.",
                "Under Section 143(3)(c), the principal auditor's report must state: whether the report on the accounts of any branch office audited under sub-section (8) by a person other than the company's auditor has been sent to him and the manner in which he has dealt with it in preparing his report. The principal auditor is entitled to rely on the branch auditor's report unless clear red flags indicate deficiency."
            ],
            "example": "A manufacturing enterprise with corporate headquarters in Mumbai operates 12 manufacturing branches across India audited by regional branch auditors under Section 143(8). The regional branch auditors transmit their signed Branch Audit Reports, CARO returns, and trial balances to the principal auditor. The principal auditor evaluates the reports, aggregates branch trial balances, and confirms under Section 143(3)(c) that all 12 branch reports were received and appropriately incorporated into the consolidated financial statements.",
            "code": '''class BranchAuditAggregationEngine:
    def __init__(self, company_name: str, principal_auditor: str):
        self.company = company_name
        self.principal_auditor = principal_auditor
        self.branches = []
        
    def add_branch_report(self, branch_name: str, branch_auditor: str, branch_assets_cr: float, is_report_received: bool, has_adverse_remark: bool, remark_text: str = ""):
        self.branches.append({
            "branch": branch_name,
            "auditor": branch_auditor,
            "assets_cr": branch_assets_cr,
            "received": is_report_received,
            "adverse": has_adverse_remark,
            "remark": remark_text
        })
        
    def generate_sec143_3_c_disclosure(self) -> dict:
        total_branches = len(self.branches)
        received_branches = sum(1 for b in self.branches if b["received"])
        total_branch_assets = sum(b["assets_cr"] for b in self.branches)
        adverse_branches = [b for b in self.branches if b["adverse"]]
        
        all_received = total_branches == received_branches
        
        sec143_3_c_text = (
            f"The reports on the accounts of the {total_branches} branch office(s) of the Company audited under sub-section (8) "
            f"of Section 143 by branch auditors have been sent to us and have been properly dealt with by us in preparing this report."
            if all_received else
            f"Reports for {total_branches - received_branches} branch(es) were NOT received prior to audit finalization, "
            f"representing a scope limitation under Section 143(8)."
        )
        
        return {
            "company": self.company,
            "principal_auditor": self.principal_auditor,
            "total_branches_count": total_branches,
            "reports_received_count": received_branches,
            "total_branch_assets_cr": round(total_branch_assets, 2),
            "all_branch_reports_incorporated": all_received,
            "sec143_3_c_statutory_text": sec143_3_c_text,
            "branch_adverse_findings": adverse_branches
        }

branch_eng = BranchAuditAggregationEngine("Zenith Industrial Manufacturing Ltd", "Vikram Malhotra & Co LLP")
branch_eng.add_branch_report("Chennai Plant Branch", "S. Raman & Associates", 420.0, True, False)
branch_eng.add_branch_report("Kolkata Logistics Depot", "Mukherjee & Sen LLP", 180.0, True, False)
branch_eng.add_branch_report("Ahmedabad Chemical SPV", "Patel & Shah Co", 350.0, True, True, "Disputed GST input credit of INR 4.2 Cr")

b_rep = branch_eng.generate_sec143_3_c_disclosure()
print("Companies Act Section 143(8) & 143(3)(c) Branch Audit Engine:")
print(f"  Company Name          : {b_rep['company']}")
print(f"  Principal Auditor     : {b_rep['principal_auditor']}")
print(f"  Branch Coverage       : {b_rep['reports_received_count']}/{b_rep['total_branches_count']} branches (INR {b_rep['total_branch_assets_cr']} Cr assets)")
print(f"  Section 143(3)(c) Text: \"{b_rep['sec143_3_c_statutory_text']}\"")
print("  Branch Adverse Remarks Logged:")
for adv in b_rep['branch_adverse_findings']:
    print(f"    * {adv['branch']} ({adv['auditor']}): {adv['remark']}")
''',
            "tryIt": "Set is_report_received to False for one branch to observe Section 143(3)(c) trigger an explicit scope limitation warning.",
            "check": {
                "question": "Under Section 143(3)(c) of the Companies Act, 2013, what specific statement must the principal statutory auditor include in the audit report regarding branch audits?",
                "options": [
                    "Whether the report on the accounts of any branch office audited under Section 143(8) by a branch auditor has been sent to him and the manner in which he has dealt with it in preparing his report",
                    "A list of the names of all branch security guards",
                    "A statement that the principal auditor visited every single branch in person",
                    "A declaration of branch real estate property tax rates"
                ],
                "answerIndex": 0,
                "why": "Section 143(3)(c) explicitly requires the auditor to report whether branch audit reports were sent to him and how he dealt with them in preparing the auditor's report."
            }
        },
        {
            "title": "Comprehensive Multi-Firm Audit Dossier & Governance Coordination",
            "say": [
                "Synthesizing Joint Audits under SA 299, Branch Audits under Section 143(8), and Group Component Audits under SA 600 requires an integrated governance cockpit. The Lead Assurance Partner must assemble an exhaustive Multi-Firm Governance Dossier.",
                "The dossier must include: (1) The executed Work Allocation Document signed by all joint auditors and acknowledged by TCWG; (2) The Minutes of Joint Auditor Coordination Meetings held during audit planning, interim testing, and completion review; (3) Copies of all Branch Audit Questionnaires, Returns, and certified Trial Balances received from regional auditors; (4) Formal written confirmations that all joint and branch auditors comply with the ICAI Code of Ethics and independence standards; and (5) The final agreed audit report (or documentation supporting separate reports in the event of disagreement).",
                "This unassailable archival provides complete regulatory defensibility under NFRA inspection frameworks, guaranteeing that the multi-firm audit was executed with seamless coordination and technical rigor."
            ],
            "example": "In finalizing the joint audit of a national public enterprise, the joint audit partners sign the multi-firm governance sign-off sheet: certifying that 2 joint audit firms, 8 branch auditors, and 3 overseas subsidiary auditors executed their procedures in accordance with SAs 299, 600, and Section 143(8), with 100% of trial balances reconciled without material unadjusted differences.",
            "code": '''class MultiFirmGovernanceDossier:
    def __init__(self, entity_name: str, fy: str):
        self.entity = entity_name
        self.fy = fy
        self.governance_checkpoints = []
        
    def add_checkpoint(self, name: str, verified: bool, standard: str):
        self.governance_checkpoints.append({
            "checkpoint": name,
            "verified": verified,
            "governing_standard": standard
        })
        
    def evaluate_governance_sign_off(self) -> dict:
        total_cp = len(self.governance_checkpoints)
        verified_cp = sum(1 for c in self.governance_checkpoints if c["verified"])
        is_ready = total_cp == verified_cp
        
        return {
            "entity": self.entity,
            "fiscal_year": self.fy,
            "total_checkpoints": total_cp,
            "verified_checkpoints": verified_cp,
            "multi_firm_sign_off_status": "APPROVED_READY_FOR_JOINT_AUDIT_SIGNING" if is_ready else "BLOCKED_PENDING_MULTI_FIRM_EVIDENCE",
            "checkpoints": self.governance_checkpoints
        }

dossier = MultiFirmGovernanceDossier("Apex National Infrastructure Ltd", "FY 2025-26")
dossier.add_checkpoint("Work Allocation Charter Signed by Joint Auditors", True, "SA 299 Revised")
dossier.add_checkpoint("Joint Audit Planning & Materiality Meeting Minutes", True, "SA 299 & SA 320")
dossier.add_checkpoint("Section 143(8) Branch Auditor Returns Reconciled", True, "Companies Act Sec 143(8)")
dossier.add_checkpoint("ICAI Code of Ethics Independence Declarations", True, "SQC 1 & SA 220")
dossier.add_checkpoint("Section 143(3)(c) Branch Disclosure Formulated", True, "Companies Act Sec 143(3)(c)")

gov_res = dossier.evaluate_governance_sign_off()
print("Multi-Firm Governance & Joint Audit Sign-Off Engine:")
print(f"  Entity Audited        : {gov_res['entity']} ({gov_res['fiscal_year']})")
print(f"  Checkpoints Verified  : {gov_res['verified_checkpoints']}/{gov_res['total_checkpoints']}")
print(f"  Multi-Firm Status     : {gov_res['multi_firm_sign_off_status']}")
print("  Governance Verification Trace:")
for cp in gov_res['checkpoints']:
    print(f"    * {cp['checkpoint']} [{cp['governing_standard']}]: Verified={cp['verified']}")
''',
            "tryIt": "Set verified to False for Branch Auditor Returns Reconciled to observe how multi-firm sign-off is immediately blocked.",
            "check": {
                "question": "What is the primary objective of assembling a Multi-Firm Governance Dossier under SA 299 and Section 143(8)?",
                "options": [
                    "To establish an unassailable audit trail documenting work allocation, coordination meetings, branch audit reliance, and ethical independence compliance across all participating firms",
                    "To calculate the division of lunch expenses among audit teams",
                    "To determine which firm has the newest laptops",
                    "To merge the two audit firms into a single partnership"
                ],
                "answerIndex": 0,
                "why": "The Multi-Firm Governance Dossier provides documentary evidence of adherence to SA 299, SA 600, and Section 143(8), proving that work was properly allocated and coordinated."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day24.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 24 base JSON created successfully.")
