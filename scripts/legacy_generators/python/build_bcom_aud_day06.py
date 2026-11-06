"""
Build Day 6 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Professional Standards, Audit Planning & Risk Assessment Architecture: ICAI SAs 200, 210, 220, 230, 300, 315 & 320
"""
import json

day_data = {
    "day": 6,
    "title": "Professional Standards, Engagement Terms & Risk Assessment Architecture: SAs 200 to 320",
    "parts": [
        {
            "title": "Overall Objectives of the Independent Auditor & Professional Skepticism: SA 200",
            "say": [
                "Under Standard on Auditing (SA) 200, the foundational mandate of an independent statutory audit is to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, thereby enabling the auditor to express an opinion on whether the financial statements are prepared, in all material respects, in accordance with an applicable financial reporting framework (such as Ind AS or AS). Reasonable assurance is a high level of assurance, but it is not an absolute guarantee; the nature of audit evidence, the inherent limitations of internal controls, and the pervasive reality of management override mean that an audit cannot provide 100% certainty.",
                "Central to SA 200 is the non-negotiable statutory doctrine of Professional Skepticism. Professional skepticism is defined as an attitude that includes a questioning mind, being alert to conditions which may indicate possible misstatement due to error or fraud, and a critical assessment of audit evidence. In practice, professional skepticism requires the engagement partner and audit team to critically interrogate management representations rather than accepting client assertions at face value, recognizing that past honesty of management does not eliminate the possibility of current fraud.",
                "SA 200 delineates the inherent limitations of an audit into four critical operational dimensions: (1) the nature of financial reporting, which inevitably involves subjective management estimates and complex accounting judgments; (2) the nature of audit procedures, which face legal and practical constraints because auditors possess no statutory search-and-seizure powers and may be deceived by sophisticated, coordinated collusion; (3) the timeliness of financial reporting and the balance between benefit and cost; and (4) the necessity of conducting the engagement within a reasonable period of time.",
                "Furthermore, SA 200 establishes the ethical pillars governing assurance engagements: integrity, objectivity, professional competence and due care, confidentiality, and professional behavior. Independence is both a state of mind and a state of appearance; any financial, employment, or personal conflict of interest that compromises independence immediately impairs the statutory validity of the audit opinion under Section 141 of the Companies Act, 2013."
            ],
            "example": "During the statutory audit of a large technology company, management provides signed confirmations from three offshore cloud infrastructure suppliers verifying that $45 million in prepaid software licensing costs are valid assets. Applying SA 200 professional skepticism, the engagement team does not rely solely on the written management representation; they inspect the underlying master services agreements, independently verify supplier domain registrations, analyze IP server traffic logs, and cross-reference bank outflow swift receipts, discovering that two suppliers are recently formed shell corporations sharing registered office addresses with the Chief Technology Officer's personal holding vehicle.",
            "code": '''def evaluate_sa200_engagement_integrity(
    acceptable_audit_risk: float,
    inherent_risk_rating: str,
    control_risk_rating: str,
    management_integrity_score: float,
    skepticism_index: float
) -> dict:
    risk_weights = {"LOW": 0.20, "MODERATE": 0.50, "HIGH": 0.90, "CRITICAL": 1.0}
    
    ir = risk_weights.get(inherent_risk_rating.upper(), 0.50)
    cr = risk_weights.get(control_risk_rating.upper(), 0.50)
    
    # Risk of Material Misstatement: RMM = IR * CR
    rmm = ir * cr
    
    # Allowable Detection Risk: DR = AR / RMM
    allowable_dr = acceptable_audit_risk / rmm if rmm > 0 else 1.0
    allowable_dr = min(1.0, max(0.01, allowable_dr))
    
    # Skepticism Adjustment: High skepticism lowers allowable DR to force larger sample sizes
    effective_detection_risk = allowable_dr * (1.0 - (skepticism_index * 0.30))
    substantive_testing_percentage = (1.0 - effective_detection_risk) * 100.0
    
    is_engagement_acceptable = management_integrity_score >= 0.70 and skepticism_index >= 0.75
    
    return {
        "acceptable_audit_risk": acceptable_audit_risk,
        "rmm_score": round(rmm, 4),
        "allowable_detection_risk": round(allowable_dr, 4),
        "effective_detection_risk": round(effective_detection_risk, 4),
        "substantive_testing_coverage_pct": round(substantive_testing_percentage, 2),
        "engagement_acceptable": is_engagement_acceptable,
        "mandated_action": "EXPAND_SAMPLE_SIZE_INDEPENDENT_EXTERNAL_CONFIRMATIONS" if effective_detection_risk < 0.15 else "STANDARD_SUBSTANTIVE_TESTING"
    }

sa200_audit = evaluate_sa200_engagement_integrity(
    acceptable_audit_risk=0.05,
    inherent_risk_rating="HIGH",
    control_risk_rating="HIGH",
    management_integrity_score=0.82,
    skepticism_index=0.88
)
print("SA 200 Audit Risk & Professional Skepticism Engine:")
print(f"  RMM Score               : {sa200_audit['rmm_score']}")
print(f"  Allowable Detection Risk: {sa200_audit['allowable_detection_risk']}")
print(f"  Effective DR (Skepticism): {sa200_audit['effective_detection_risk']}")
print(f"  Substantive Testing Req : {sa200_audit['substantive_testing_coverage_pct']}%")
print(f"  Mandated Audit Strategy : {sa200_audit['mandated_action']}")
''',
            "tryIt": "Increase inherent_risk_rating to CRITICAL and observe how allowable detection risk collapses below 0.05, driving required substantive testing coverage above 96%.",
            "check": {
                "question": "Under SA 200, what is the statutory relationship between Inherent Risk (IR), Control Risk (CR), and the auditor's planned Detection Risk (DR)?",
                "options": [
                    "Detection risk is inversely related to the risk of material misstatement (RMM = IR * CR); when RMM is assessed as high, the auditor must set allowable detection risk low by increasing substantive testing scope",
                    "Detection risk is directly proportional to inherent risk, meaning auditors test fewer samples when internal controls fail",
                    "Control risk is directly determined by the external auditor, while detection risk is controlled exclusively by corporate management",
                    "Detection risk and inherent risk must always sum to 100% across all financial statement audit cycles"
                ],
                "answerIndex": 0,
                "why": "The Audit Risk Model states AR = IR * CR * DR. To maintain an acceptably low Audit Risk (typically 5%), any increase in RMM (IR * CR) necessitates an inverse reduction in allowable Detection Risk (DR), forcing the auditor to expand sample sizes and conduct deeper substantive testing."
            }
        },
        {
            "title": "Agreeing Engagement Terms & Quality Control for Audits: SA 210 & SA 220",
            "say": [
                "Standard on Auditing (SA) 210 establishes mandatory requirements for agreeing the terms of audit engagements. Before accepting or continuing an audit engagement, the statutory auditor must establish whether the preconditions for an audit are present. Preconditions require that management acknowledges and understands its fundamental statutory responsibilities: (1) preparing the financial statements in accordance with the applicable financial reporting framework (Ind AS / AS); (2) designing, implementing, and maintaining internal financial controls over financial reporting (IFCoFR) to ensure financial statements are free from material misstatement; and (3) providing the auditor with unrestricted access to all relevant information, documentation, personnel, and additional information requested for audit evidence.",
                "The agreed terms of the engagement must be recorded in an Engagement Letter prior to commencing field work. Under SA 210, the engagement letter must explicitly state: the objective and scope of the audit; the responsibilities of the auditor; the responsibilities of management; the identification of the applicable financial reporting framework; and reference to the expected form and content of reports to be issued. If management or those charged with governance (TCWG) impose an impermissible scope limitation before engagement acceptance that would result in a disclaimer of opinion, the auditor must decline the appointment.",
                "Complementing engagement acceptance, SA 220 (read alongside SQC 1 - Standard on Quality Control) mandates rigorous quality control procedures across the entire lifecycle of an audit. The Engagement Partner remains personally responsible for overall audit quality, directing, supervising, and performing the engagement in compliance with professional standards and regulatory requirements. For audits of listed entities, SA 220 legally mandates an Engagement Quality Control Review (EQCR).",
                "The EQCR reviewer—an objective Chartered Accountant not otherwise participating in the engagement—must independently evaluate significant judgments made by the engagement team and the conclusions reached in formulating the audit report. The audit report cannot be signed or dated until the EQCR review is formally completed, documented, and signed off."
            ],
            "example": "A listed telecom company with Rs 12,000 Crore in debt seeks to appoint an audit firm. Before executing the engagement letter under SA 210, the proposed audit partner discovers that the Board Audit Committee wants to restrict external verification of complex revenue sharing agreements with government regulators. The auditor refuses to sign the engagement letter until the restrictive clause is completely excised and management formally signs the preconditions acknowledging unrestricted access to all regulatory correspondence.",
            "code": '''def evaluate_sa210_sa220_quality_gate(
    preconditions_signed: bool,
    unrestricted_access_guaranteed: bool,
    reporting_framework_acceptable: bool,
    is_listed_entity: bool,
    eqcr_partner_assigned: bool,
    eqcr_review_completed: bool,
    partner_rotation_years_served: int
) -> dict:
    preconditions_met = preconditions_signed and unrestricted_access_guaranteed and reporting_framework_acceptable
    
    # Companies Act 2013 Sec 139(2) mandatory 5-year partner rotation
    rotation_valid = partner_rotation_years_served < 5
    
    if is_listed_entity:
        eqcr_compliant = eqcr_partner_assigned and eqcr_review_completed
    else:
        eqcr_compliant = True
        
    can_accept_and_sign_report = preconditions_met and rotation_valid and eqcr_compliant
    
    blockers = []
    if not preconditions_met:
        blockers.append("Preconditions for audit not satisfied under SA 210")
    if not rotation_valid:
        blockers.append("Statutory partner rotation limit exceeded (>= 5 years) under Sec 139(2)")
    if is_listed_entity and not eqcr_compliant:
        blockers.append("Mandatory EQCR review incomplete under SA 220 / SQC 1")
        
    return {
        "preconditions_status": "SATISFIED" if preconditions_met else "DEFICIENT",
        "statutory_rotation_ok": rotation_valid,
        "eqcr_quality_gate": "PASSED" if eqcr_compliant else "PENDING_REVIEW",
        "engagement_authorized": can_accept_and_sign_report,
        "active_blockers": blockers
    }

q_gate = evaluate_sa210_sa220_quality_gate(
    preconditions_signed=True,
    unrestricted_access_guaranteed=True,
    reporting_framework_acceptable=True,
    is_listed_entity=True,
    eqcr_partner_assigned=True,
    eqcr_review_completed=True,
    partner_rotation_years_served=3
)
print("SA 210 / SA 220 Quality Control Compliance Report:")
print(f"  Preconditions Status   : {q_gate['preconditions_status']}")
print(f"  Partner Rotation Valid : {q_gate['statutory_rotation_ok']}")
print(f"  EQCR Quality Review    : {q_gate['eqcr_quality_gate']}")
print(f"  Audit Report Sign-off  : {q_gate['engagement_authorized']}")
''',
            "tryIt": "Set eqcr_review_completed to False to confirm that an audit report for a listed entity cannot be authorized without documented EQCR clearance.",
            "check": {
                "question": "What is the statutory consequence under SA 220 and SQC 1 if the Engagement Quality Control Review (EQCR) for a public listed entity is not completed prior to the audit report release date?",
                "options": [
                    "The statutory auditor is legally prohibited from signing and dating the auditor's report until the EQCR review is fully resolved and documented",
                    "The auditor may release the audit report conditionally provided EQCR finishes within 60 days",
                    "The audit opinion automatically degrades to an adverse opinion without further inquiry",
                    "The EQCR review is purely voluntary and has no bearing on report issuance"
                ],
                "answerIndex": 0,
                "why": "SA 220 Paragraph 19 strictly mandates that the engagement partner shall not date the auditor's report until the completion of the engagement quality control review."
            }
        },
        {
            "title": "Audit Documentation & Evidence Retention Architecture: SA 230",
            "say": [
                "Standard on Auditing (SA) 230 establishes the binding statutory rules for audit documentation—traditionally known as audit working papers. Audit documentation provides: (1) evidence of the auditor's basis for a conclusion about the achievement of the overall objectives; and (2) evidence that the audit was planned and performed in accordance with SAs and applicable legal and regulatory requirements. The cardinal legal axiom of assurance is: 'What is not documented in the audit file was never done.'",
                "SA 230 establishes the 'Experienced Auditor Standard': audit documentation must be prepared on a timely basis and must be sufficient to enable an experienced auditor, having no previous connection with the audit, to understand: the nature, timing, and extent of the audit procedures performed; the results of the audit procedures performed, and the audit evidence obtained; and significant matters arising during the audit, the conclusions reached thereon, and significant professional judgments made in reaching those conclusions.",
                "In documenting the nature, timing, and extent of audit procedures, the auditor must record: the identifying characteristics of the specific items or matters tested; who performed the audit work and the date such work was completed; and who reviewed the audit work performed and the date and extent of such review. Working papers must document discussions of significant matters with management, TCWG, and others, including the nature of the matters discussed and when and with whom the discussions occurred.",
                "SA 230 and SQC 1 prescribe strict statutory timelines for assembly and retention: the auditor must assemble the final audit file on a timely basis, strictly within 60 days after the date of the auditor's report (Assembly Period). After the assembly of the final audit file has been completed, the auditor shall not delete or discard audit documentation of any nature before the end of its retention period. Under ICAI rules and Companies Act regulations, working papers must be retained for a mandatory minimum period of not less than seven (7) years from the date of the auditor's report."
            ],
            "example": "Following the sudden collapse of an infrastructure group, regulatory enforcement agencies subpoena the audit workpapers. The inspection team reviews the electronic audit file and verifies that all 1,420 substantive test sheets have cryptographically timestamped preparer signatures, manager review sign-offs within 14 days of testing, documented justifications for revenue cut-off selections, and an immutable final file lockdown hash completed exactly 38 days post-signing, satisfying SA 230 and insulating the firm from negligence claims.",
            "code": '''import datetime

def verify_sa230_audit_file_compliance(
    report_signature_date: str,
    file_assembly_lock_date: str,
    working_papers_count: int,
    reviewed_papers_count: int,
    unresolved_exceptions_count: int,
    mandatory_retention_years: int = 7
) -> dict:
    fmt = "%Y-%m-%d"
    d_sign = datetime.datetime.strptime(report_signature_date, fmt)
    d_lock = datetime.datetime.strptime(file_assembly_lock_date, fmt)
    
    assembly_days_elapsed = (d_lock - d_sign).days
    is_assembly_timely = 0 <= assembly_days_elapsed <= 60
    
    review_coverage_pct = (reviewed_papers_count / working_papers_count) * 100.0 if working_papers_count > 0 else 0.0
    all_papers_reviewed = review_coverage_pct == 100.0
    
    retention_expiry = d_sign.replace(year=d_sign.year + mandatory_retention_years).strftime(fmt)
    
    is_sa230_compliant = (
        is_assembly_timely and 
        all_papers_reviewed and 
        unresolved_exceptions_count == 0
    )
    
    return {
        "assembly_days_elapsed": assembly_days_elapsed,
        "is_within_60_day_statutory_limit": is_assembly_timely,
        "review_coverage_pct": review_coverage_pct,
        "unresolved_matters": unresolved_exceptions_count,
        "statutory_retention_until": retention_expiry,
        "sa230_file_compliant": is_sa230_compliant,
        "audit_file_status": "LOCKED_AND_COMPLIANT" if is_sa230_compliant else "NON_COMPLIANT_DEFICIENCY"
    }

file_audit = verify_sa230_audit_file_compliance(
    report_signature_date="2026-05-15",
    file_assembly_lock_date="2026-06-25",
    working_papers_count=450,
    reviewed_papers_count=450,
    unresolved_exceptions_count=0
)
print("SA 230 Audit Documentation & Assembly Tracker:")
print(f"  Assembly Days Elapsed   : {file_audit['assembly_days_elapsed']} days (Limit: 60 days)")
print(f"  Statutory Window Met    : {file_audit['is_within_60_day_statutory_limit']}")
print(f"  Manager/Partner Reviews : {file_audit['review_coverage_pct']}%")
print(f"  Mandatory Retention Date: {file_audit['statutory_retention_until']}")
print(f"  Compliance Verdict      : {file_audit['audit_file_status']}")
''',
            "tryIt": "Change file_assembly_lock_date to '2026-08-01' (78 days post-report) to verify that an assembly violation triggers a non-compliant deficiency.",
            "check": {
                "question": "What is the statutory maximum time limit permitted under SA 230 and SQC 1 for completing the assembly of the final audit file after the date of the auditor's report?",
                "options": [
                    "Ordinarily not more than 60 days after the date of the auditor's report",
                    "Strictly within 15 calendar days from the conclusion of fieldwork",
                    "Prior to the company's next quarterly earnings filing date",
                    "There is no statutory time limit provided papers are archived before the next annual audit"
                ],
                "answerIndex": 0,
                "why": "SA 230 Paragraph A21 and SQC 1 specify that an appropriate time limit within which to complete the assembly of the final audit file is ordinarily not more than 60 days after the date of the auditor's report."
            }
        },
        {
            "title": "Audit Planning, Strategy & Direction: SA 300",
            "say": [
                "Standard on Auditing (SA) 300 establishes that planning an audit involves establishing the overall audit strategy for the engagement and developing an audit plan. Planning is not a discrete phase of an audit, but rather a continual and iterative process that often begins shortly after (or in connection with) the completion of the previous audit and continues until the completion of the current audit engagement.",
                "The engagement partner must establish the Overall Audit Strategy. The audit strategy sets the scope, timing, and direction of the audit, and guides the development of the more detailed audit plan. In establishing the overall audit strategy, the auditor must: (1) identify the characteristics of the engagement that define its scope (e.g., reporting currency, multi-location subsidiaries, statutory deadlines); (2) ascertain the reporting objectives of the engagement to plan the timing of the audit and the nature of communications required (e.g., interim reviews, reporting to TCWG); (3) consider the factors that in the auditor's professional judgment are significant in directing the engagement team's efforts; (4) consider the results of preliminary engagement activities; and (5) ascertain the nature, timing, and extent of resources necessary to perform the engagement.",
                "Following the strategy, the auditor develops the Detailed Audit Plan. The audit plan is more operational and granular than the strategy, including: a description of the nature, timing, and extent of planned risk assessment procedures under SA 315; the nature, timing, and extent of planned further audit procedures at the assertion level under SA 330; and other planned audit procedures required to ensure the engagement complies with SAs.",
                "SA 300 explicitly mandates that the engagement partner and key members of the engagement team shall be involved in planning the audit, including participating in the discussion among team members regarding the susceptibility of the entity's financial statements to material misstatement due to error or fraud as required by SA 240 and SA 315."
            ],
            "example": "In planning the audit of a retail chain with 450 stores, the audit partner establishes the strategy: 12 high-turnover flagship locations accounting for 65% of revenue are designated for full-scope interim inventory counts on September 30; 30 regional stores are scheduled for surprise counts on March 31; and centralized IT automated billing controls are tested by IT forensic specialists in November. This strategy governs the allocation of 3,200 audit hours across 24 team members.",
            "code": '''def formulate_sa300_audit_resource_plan(
    consolidated_revenue_cr: float,
    locations_count: int,
    high_risk_subsidiaries: int,
    it_complexity_score: float, # 0.0 to 1.0
    statutory_deadline_weeks: int
) -> dict:
    base_hours = 400.0
    size_hours = (consolidated_revenue_cr / 100.0) * 120.0
    location_hours = locations_count * 18.0
    risk_hours = high_risk_subsidiaries * 150.0
    it_audit_hours = it_complexity_score * 350.0
    
    total_budgeted_hours = base_hours + size_hours + location_hours + risk_hours + it_audit_hours
    
    partner_hours = total_budgeted_hours * 0.08
    manager_hours = total_budgeted_hours * 0.18
    senior_hours = total_budgeted_hours * 0.34
    staff_hours = total_budgeted_hours * 0.40
    
    weekly_hours_needed = total_budgeted_hours / statutory_deadline_weeks if statutory_deadline_weeks > 0 else total_budgeted_hours
    team_size_required = max(3, int(weekly_hours_needed / 45.0) + 1)
    
    return {
        "total_budgeted_hours": round(total_budgeted_hours, 1),
        "partner_hours": round(partner_hours, 1),
        "manager_hours": round(manager_hours, 1),
        "senior_associate_hours": round(senior_hours, 1),
        "staff_associate_hours": round(staff_hours, 1),
        "statutory_weeks_available": statutory_deadline_weeks,
        "recommended_team_size": team_size_required
    }

plan = formulate_sa300_audit_resource_plan(
    consolidated_revenue_cr=2500.0,
    locations_count=45,
    high_risk_subsidiaries=3,
    it_complexity_score=0.85,
    statutory_deadline_weeks=8
)
print("SA 300 Strategic Audit Resource & Allocation Engine:")
print(f"  Total Budgeted Hours   : {plan['total_budgeted_hours']} hrs")
print(f"  Partner / Manager Split: {plan['partner_hours']} hrs / {plan['manager_hours']} hrs")
print(f"  Senior / Staff Split   : {plan['senior_associate_hours']} hrs / {plan['staff_associate_hours']} hrs")
print(f"  Recommended Team Size  : {plan['recommended_team_size']} professionals")
''',
            "tryIt": "Compress statutory_deadline_weeks from 8 to 4 and observe the team size doubling to accommodate the concentrated audit workload.",
            "check": {
                "question": "What is the primary difference between the Overall Audit Strategy and the Detailed Audit Plan under SA 300?",
                "options": [
                    "The overall audit strategy sets the broad scope, timing, and direction of the audit, whereas the audit plan is more detailed and specifies the nature, timing, and extent of specific risk assessment and substantive procedures",
                    "The strategy is prepared by client management while the audit plan is prepared by the external auditor",
                    "The audit plan is filed with government regulators while the strategy remains strictly confidential to the client",
                    "The strategy applies only to forensic fraud investigations while the audit plan governs routine statutory filings"
                ],
                "answerIndex": 0,
                "why": "SA 300 Paragraphs 7-9 explain that the audit strategy establishes the high-level scope, timing, and direction to guide the development of the detailed audit plan, which operationalizes specific audit procedures at the assertion level."
            }
        },
        {
            "title": "Identifying Risks of Material Misstatement & Materiality: SA 315 & SA 320",
            "say": [
                "Standard on Auditing (SA) 315 requires the auditor to identify and assess the risks of material misstatement (RMM), whether due to fraud or error, at the financial statement and assertion levels, through understanding the entity and its environment, including the entity's internal control. Risk assessment procedures must include: inquiries of management; analytical procedures; and observation and inspection. The auditor must understand the entity's organizational structure, ownership governance, business model, regulatory environment, and its information system and communication.",
                "Under SA 315, internal control consists of five interrelated components: (1) Control Environment (tone at the top); (2) Entity's Risk Assessment Process; (3) Information System and Communication; (4) Control Activities (segregation of duties, authorizations, physical reconciliations); and (5) Monitoring of Controls. The auditor must determine whether any of the assessed risks of material misstatement are, in the auditor's judgment, a Significant Risk—defined as an identified and assessed risk of material misstatement that, in the auditor's judgment, requires special audit consideration (such as complex related-party dealings or high fraud risk).",
                "Concurrently, Standard on Auditing (SA) 320 governs Materiality in Planning and Performing an Audit. Materiality is fundamentally based on the premise that misstatements, including omissions, are considered material if they, individually or in the aggregate, could reasonably be expected to influence the economic decisions of users taken on the basis of the financial statements. Financial statement materiality is typically benchmarked against: 0.5% to 1% of Gross Turnover; 5% of Profit Before Tax (PBT) from continuing operations; or 1% to 2% of Total Assets.",
                "To address the risk of aggregated undetected misstatements exceeding overall materiality, SA 320 legally mandates that the auditor calculate Performance Materiality. Performance Materiality is set at a lower amount (typically 60% to 75% of overall materiality) to reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds materiality for the financial statements as a whole. Additionally, the auditor establishes a Trivial Threshold (De Minimis, usually 3% to 5% of overall materiality), below which misstatements need not be accumulated on the Summary of Unadjusted Audit Differences (SUAD)."
            ],
            "example": "An enterprise reports Profit Before Tax of Rs 100 Crore and Revenue of Rs 1,500 Crore. The auditor benchmarks Materiality at 5% of PBT = Rs 5.0 Crore. Assessing control risk as moderate, the auditor sets Performance Materiality at 70% = Rs 3.5 Crore, which establishes the sample testing threshold. The De Minimis trivial cutoff is set at 4% = Rs 20 Lakh; any error below Rs 20 Lakh is ignored, while errors between Rs 20 Lakh and Rs 3.5 Crore are accumulated on the audit error schedule.",
            "code": '''def calculate_sa320_materiality_waterfall(
    pbt_inr_cr: float,
    revenue_inr_cr: float,
    total_assets_inr_cr: float,
    control_environment_risk: str, # "LOW", "MODERATE", "HIGH"
    primary_benchmark: str = "PBT"
) -> dict:
    if primary_benchmark == "PBT" and pbt_inr_cr > 0:
        overall_materiality = pbt_inr_cr * 0.05  # 5% of PBT
    elif primary_benchmark == "REVENUE":
        overall_materiality = revenue_inr_cr * 0.0075  # 0.75% of Revenue
    else:
        overall_materiality = total_assets_inr_cr * 0.01  # 1% of Assets
        
    # Performance Materiality Haircut based on Control Environment Risk
    pm_factors = {"LOW": 0.75, "MODERATE": 0.65, "HIGH": 0.50}
    pm_ratio = pm_factors.get(control_environment_risk.upper(), 0.65)
    
    performance_materiality = overall_materiality * pm_ratio
    
    # Clearly Trivial Threshold (De Minimis: 4% of Overall Materiality)
    trivial_threshold = overall_materiality * 0.04
    
    return {
        "primary_benchmark_used": primary_benchmark,
        "overall_materiality_cr": round(overall_materiality, 3),
        "performance_materiality_cr": round(performance_materiality, 3),
        "performance_materiality_pct": round(pm_ratio * 100.0, 1),
        "clearly_trivial_threshold_cr": round(trivial_threshold, 4),
        "clearly_trivial_threshold_lakhs": round(trivial_threshold * 100.0, 2),
        "substantive_testing_scope": f"Test all transactions > INR {performance_materiality:.2f} Cr; Accumulate errors > INR {trivial_threshold*100.0:.2f} Lakhs"
    }

materiality = calculate_sa320_materiality_waterfall(
    pbt_inr_cr=120.0,
    revenue_inr_cr=1800.0,
    total_assets_inr_cr=2200.0,
    control_environment_risk="MODERATE",
    primary_benchmark="PBT"
)
print("SA 320 Quantitative Materiality Waterfall Engine:")
print(f"  Overall Materiality (5% PBT): INR {materiality['overall_materiality_cr']} Crores")
print(f"  Performance Materiality     : INR {materiality['performance_materiality_cr']} Crores ({materiality['performance_materiality_pct']}%)")
print(f"  Clearly Trivial (De Minimis): INR {materiality['clearly_trivial_threshold_lakhs']} Lakhs")
print(f"  Audit Testing Rule          : {materiality['substantive_testing_scope']}")
''',
            "tryIt": "Change control_environment_risk to HIGH to see Performance Materiality contract to 50% (Rs 3.0 Cr), tightening substantive sampling thresholds across all accounts.",
            "check": {
                "question": "What is the statutory objective of calculating Performance Materiality under SA 320?",
                "options": [
                    "To reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements in the financial statements exceeds overall materiality",
                    "To determine the statutory audit fee payable by the company under Companies Act Section 142",
                    "To set the maximum civil penalty that an auditor can incur before the National Financial Reporting Authority (NFRA)",
                    "To identify personal income tax liability for corporate directors"
                ],
                "answerIndex": 0,
                "why": "SA 320 Paragraph 9 establishes that Performance Materiality is set by the auditor at an amount less than overall materiality to mitigate the risk that the accumulation of individual undetected or unadjusted errors exceeds overall financial statement materiality."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day06_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day06_data.json successfully!")
