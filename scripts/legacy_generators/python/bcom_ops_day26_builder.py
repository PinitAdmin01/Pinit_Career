import sys
import json
import hashlib

def get_day26_data() -> dict:
    day = 26
    title = "Quality Certifications: ISO 9001:2015 & Stage 1/Stage 2 Audit Closure"
    goal = "Master the implementation, governance, and audit closure of international Quality Management Systems under ISO 9001:2015, executing the Plan-Do-Check-Act (PDCA) continuous improvement cycle, conducting rigorous Stage 1 Documentation Readiness and Stage 2 On-Site Certification Audits, and systematically resolving Major and Minor Non-Conformances through Root Cause Analysis (8D / 5-Why) and Corrective and Preventive Actions (CAPA) to achieve 100% audit closure and institutional accreditation."
    minutes = 45
    recap = "Previously in Milestone 5, we integrated Industry 4.0 cyber-physical systems into an Autonomous Smart Factory and Digital Twin Control Tower. Today in Milestone 6, we establish the gold standard for global operational governance by operationalizing ISO 9001:2015 Quality Management Systems and executing complete audit non-conformance closure."

    parts = [
        # Part 1: Foundations of ISO 9001:2015 QMS & The High-Level Annex SL Framework
        {
            "title": "Foundations of ISO 9001:2015 QMS & The High-Level Annex SL Framework",
            "say": [
                "Welcome to Day 26 of B.Com Operations, Logistics & Supply Chain Management. Today, we initiate our sixth and final milestone: Strategic Resilience, Quality Certifications & Capstone Mastery. We begin this journey by mastering the world's most widely recognized operational governance standard: ISO 9001:2015 Quality Management Systems (QMS). Over one million organizations across 170 countries hold ISO 9001 certification. Far from being a ceremonial exercise in administrative bureaucracy or wall-mounted framed certificates, modern ISO 9001 is a dynamic, risk-based operational operating system designed to ensure that an enterprise consistently meets customer expectations, statutory mandates, and regulatory obligations through disciplined, measurable process control.",
                "The structural architecture of ISO 9001:2015 is governed by Annex SL, the standardized High-Level Structure (HLS) adopted by the International Organization for Standardization across all modern management frameworks, including ISO 14001 for Environmental Management, ISO 45001 for Occupational Health & Safety, and ISO 27001 for Information Security Management. Annex SL establishes an identical 10-clause architecture with common terms, core definitions, and shared high-level text. Clauses 1 through 3 establish the scope, normative references, and formal terms. The operational engine resides in Clauses 4 through 10: Clause 4 establishes the Context of the Organization (SWOT/PESTLE external and internal analysis, stakeholder expectations, and boundary definitions); Clause 5 mandates Top Management Leadership and Commitment (quality policies and resource allocation); Clause 6 governs Planning and Risk-Based Thinking (identifying operational risks and mitigation opportunities); Clause 7 details Support (competence, infrastructure, and documented information); Clause 8 commands Operational Planning and Control; Clause 9 dictates Performance Evaluation (internal audits and management reviews); and Clause 10 drives Continuous Improvement.",
                "A transformative paradigm shift introduced in the 2015 revision is the elimination of the formal 'Quality Manual' requirement in favor of flexible 'Documented Information' (Clause 7.5), alongside the replacement of reactive preventive actions with proactive 'Risk-Based Thinking' (Clause 6.1). Operations executives are no longer asked to draft static procedural handbooks that gather dust on factory shelves. Instead, corporate leadership must formulate dynamic risk registers that evaluate operational failure modes, supply chain disruptions, machine breakdowns, and regulatory non-compliance across probability and severity matrices, designing preventive safeguards directly into the physical workflows.",
                "Furthermore, ISO 9001 is grounded in Seven Core Quality Management Principles (QMPs): Customer Focus (aligning all operational processes with buyer value creation); Leadership (establishing unity of purpose and corporate direction); Engagement of People (empowering operators at all shop-floor levels); Process Approach (managing activities as interrelated systems rather than disconnected departmental silos); Improvement (driving relentless continuous optimization); Evidence-Based Decision Making (analyzing statistical process data rather than subjective intuition); and Relationship Management (collaborating closely with tier-1 suppliers and logistics partners). When leadership weaves these principles into daily routines, organizational silos dissolve into cross-functional value streams.",
                "In Clause 4, determining the context of the organization requires leadership to conduct rigorous stakeholder mapping. An enterprise must identify not only immediate customers, but also regulatory bodies, factory labor unions, local communities, financial lenders, and tier-1 suppliers. Clause 4.3 mandates the precise definition of the QMS scope, specifying the products, physical manufacturing facilities, engineering design centers, and outsourced fulfillment services included under certification. Any exclusion must be formally justified under Clause 8 requirements, ensuring that an enterprise cannot selectively exclude poorly performing operational processes from auditor scrutiny.",
                "Clause 6 introduces the mathematical and operational discipline of risk registers. Every significant business process—whether raw material procurement, CNC machining, automated electronic surface-mount soldering, or cold-chain pharmaceutical packaging—must undergo risk assessment. Process owners evaluate failure modes by multiplying Likelihood of Occurrence (rated on a 1-to-5 scale) by Severity of Impact (rated on a 1-to-5 scale) and Detection Difficulty (rated on a 1-to-5 scale) to calculate a Risk Priority Number (RPN). Operational risks with RPN values exceeding defined corporate risk appetites trigger mandatory engineering redesign, mistake-proofing (Poka-Yoke), or redundant inspection protocols.",
                "From a supply chain perspective, ISO 9001:2015 acts as a universal passport for global commerce. Tier-1 automotive assemblers, aerospace primes, and medical device manufacturers legally mandate that suppliers maintain certified QMS compliance before issuing Requests for Quotation (RFQs). An enterprise operating without ISO 9001 certification is immediately disqualified from participating in regulated international supply chains, facing severe friction in cross-border procurement and vendor qualification.",
                "In this first part, we construct a Python-based QMS Annex SL Readiness Evaluator. This engine audits an enterprise's organizational context registers, verifies mandatory documented information controls, evaluates clause-specific compliance weights, and calculates an overall Annex SL governance maturity index to confirm audit preparedness before committing capital to third-party registrar assessments."
            ],
            "example": "A global precision CNC machining supplier in Stuttgart delivering high-pressure hydraulic manifolds to industrial clients had its certification jeopardized due to undocumented engineering change orders. By deploying an Annex SL-compliant digital QMS architecture, the company mapped all 10 standard clauses directly to ERP production routings and integrated automated version-controlled digital work instructions. During its surveillance audit, the third-party registrar praised the zero-defect documentation flow, resulting in an unconditional renewal of its ISO 9001:2015 certification and securing a €14.5 million long-term supplier contract with a multinational tractor manufacturer.",
            "code": """# Foundations of ISO 9001:2015 QMS: Annex SL Readiness Evaluator
from typing import Dict, List, Any

def evaluate_qms_annex_sl_readiness(
    clause_evaluations: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    clause_weights = {
        "clause_4_context": 0.10,
        "clause_5_leadership": 0.15,
        "clause_6_risk_planning": 0.20,
        "clause_7_support_docs": 0.15,
        "clause_8_operations": 0.20,
        "clause_9_performance_eval": 0.10,
        "clause_10_improvement": 0.10
    }
    
    total_weighted_score = 0.0
    audit_findings = []
    
    for clause, weight in clause_weights.items():
        eval_data = clause_evaluations.get(clause, {"score": 0.0, "status": "NON_COMPLIANT"})
        score = eval_data.get("score", 0.0)
        total_weighted_score += score * weight
        if score < 80.0:
            audit_findings.append(f"{clause.upper()}: Score {score:.1f}% below minimum benchmark")
            
    is_ready_for_stage1 = total_weighted_score >= 85.0 and len(audit_findings) == 0
    
    return {
        "weighted_qms_readiness_score": round(total_weighted_score, 2),
        "total_clauses_evaluated": len(clause_weights),
        "findings_count": len(audit_findings),
        "audit_findings": audit_findings,
        "is_ready_for_stage1_audit": is_ready_for_stage1,
        "qms_status": "ANNEX_SL_GOVERNANCE_NOMINAL" if is_ready_for_stage1 else "QMS_DOCUMENTATION_DEFICIT"
    }

# Execute QMS Annex SL Readiness Audit
facility_audit = {
    "clause_4_context": {"score": 92.0, "status": "COMPLIANT"},
    "clause_5_leadership": {"score": 95.0, "status": "COMPLIANT"},
    "clause_6_risk_planning": {"score": 88.0, "status": "COMPLIANT"},
    "clause_7_support_docs": {"score": 90.0, "status": "COMPLIANT"},
    "clause_8_operations": {"score": 94.0, "status": "COMPLIANT"},
    "clause_9_performance_eval": {"score": 89.0, "status": "COMPLIANT"},
    "clause_10_improvement": {"score": 91.0, "status": "COMPLIANT"}
}

audit_result = evaluate_qms_annex_sl_readiness(facility_audit)
print(f"ISO 9001 Annex SL Score: {audit_result['weighted_qms_readiness_score']}%")
print(f"Stage 1 Readiness: {audit_result['is_ready_for_stage1_audit']}")
print(f"Status: {audit_result['qms_status']}")
""",
            "output": """ISO 9001 Annex SL Score: 91.3%
Stage 1 Readiness: True
Status: ANNEX_SL_GOVERNANCE_NOMINAL""",
            "lineNotes": [
                {"line": 5, "note": "Evaluates mandatory Annex SL Clauses 4 through 10 using weighted governance parameters."},
                {"line": 19, "note": "Computes weighted maturity score and flags any clause scoring below 80.0% benchmark."},
                {"line": 24, "note": "Enforces strict certification readiness rule requiring overall score >= 85.0% and zero defect findings."}
            ],
            "tryIt": "Perturb the score of 'clause_6_risk_planning' down to 72.0% and observe how audit findings flag the deficiency and block Stage 1 readiness.",
            "check": {
                "question": "Which of the following describes the standardized High-Level Structure (HLS) shared across modern ISO management standards such as ISO 9001, ISO 14001, and ISO 45001?",
                "options": [
                    "Annex SL 10-clause architecture",
                    "Six Sigma DMAIC framework",
                    "Sarbanes-Oxley Section 404",
                    "Incoterms 2020 Rules"
                ],
                "answer": 0,
                "why": "Annex SL is the universal High-Level Structure created by ISO to provide an identical clause structure (Clauses 1 to 10), core text, and common terms across all modern management systems standards."
            }
        },

        # Part 2: The Closed-Loop Plan-Do-Check-Act (PDCA) Continuous Improvement Engine
        {
            "title": "The Closed-Loop Plan-Do-Check-Act (PDCA) Continuous Improvement Engine",
            "say": [
                "Having examined the high-level architecture of Annex SL, we now explore the operational heartbeat that animates ISO 9001:2015: the Plan-Do-Check-Act (PDCA) cycle. Originally conceived by Walter Shewhart at Bell Telephone Laboratories during the 1920s as a statistical model for manufacturing feedback, and subsequently championed globally by W. Edwards Deming during Japan's post-war industrial renaissance, the PDCA cycle is not an abstract theoretical loop; it is the definitive procedural mechanism for driving continuous operational excellence and systematic error eradication.",
                "In ISO 9001:2015, the PDCA cycle is explicitly mapped across the standard's clauses. 'Plan' encompasses Clauses 4, 5, and 6: establishing customer requirements, formulating organizational quality objectives, assessing risks and opportunities, and allocating capital and human resources. 'Do' encompasses Clauses 7 and 8: implementing operational controls, executing manufacturing and service processes, managing supply chains, and controlling documented information. 'Check' corresponds to Clause 9: monitoring process parameters, measuring product conformity against specifications, conducting internal audits, and evaluating customer satisfaction. Finally, 'Act' maps to Clause 10: executing corrective actions, eliminating root causes of systemic non-conformances, and updating baseline procedures to institutionalize improvements.",
                "The power of PDCA lies in its closed-loop iterative velocity. An open-loop operational process executes activities without systematic measurement or corrective feedback, allowing defects to recur unchecked and waste to accumulate. In contrast, a closed-loop PDCA engine treats every deviation as a diagnostic learning opportunity. When a packaging line experiences a 2% labeling misalignment, the 'Check' phase quantifies the variance using statistical process control (SPC); the 'Act' phase investigates the mechanical feeder tolerance, recalibrates sensor thresholds, and updates standard operating procedures (SOPs); and the subsequent 'Plan' phase integrates these revised thresholds into future production schedules.",
                "A vital component of the 'Check' phase is the Management Review Meeting (MRM) dictated by Clause 9.3. ISO 9001 mandates that top executive leadership must review the organization's QMS at planned intervals. The mandatory inputs to an MRM include the status of previous review actions, changes in external and internal issues, customer satisfaction feedback, quality objective attainment, process performance and product conformity metrics, non-conformances and corrective actions, monitoring and measurement results, audit findings, supplier performance, and resource adequacy. The mandatory outputs include strategic decisions on improvement opportunities and required resource allocations.",
                "Without disciplined execution across all four quadrants, organizations fall into the classic 'Plan-Do' paralysis trap, where initiatives are enthusiastically planned and launched, but results are never rigorously checked and corrective actions are never institutionalized. Over time, cynicism spreads and operational capability degrades. High-performing organizations counter this by instituting rapid PDCA cycles, shortening the cycle time from defect detection in 'Check' to root-cause elimination in 'Act' from months down to hours.",
                "The relationship between the PDCA cycle and organizational capability can be visualized as a wheel rolling up an inclined plane. The inclined plane represents rising market expectations, tighter regulatory thresholds, and intensifying competitor cost structures. The PDCA wheel climbs the incline through continuous innovation. However, without a wedge placed behind the wheel, gravity will inevitably pull the wheel backward into mediocrity. In ISO 9001, standardization (documented SOPs, calibrated gauges, and digital poka-yoke controls) serves as that indispensable wedge, locking in every operational gain achieved through the Act phase.",
                "Furthermore, executive governance requires establishing quantitative closure rates for all action items generated during internal audits and MRMs. An organization that documents hundreds of audit findings but closes fewer than 80% within designated deadlines is accumulating compliance technical debt. Registrars inspect historical action closure logs as a direct litmus test of top management commitment under Clause 5.1.",
                "In this part, we implement a Python-based PDCA Continuous Improvement Cycle Engine. This tool models multi-phase operational cycle audits, tracks closed-loop feedback velocity, calculates stage-specific closure metrics, and computes a composite PDCA Maturity Index ensuring complete operational governance."
            ],
            "example": "A commercial aircraft landing gear maintenance, repair, and overhaul (MRO) facility in Singapore implemented a closed-loop digital PDCA tracking dashboard. Previously, turn-around times (TAT) for overhaul operations averaged 38 days due to recurring component sourcing delays and inspection backlogs. By applying PDCA, the engineering team mapped the 'Check' phase to daily bottleneck takt times, used 'Act' to establish kanban staging for high-wear hydraulic seals, and redesigned the 'Plan' phase with dynamic multi-skilled technician scheduling. Within six months, overhaul TAT dropped from 38 to 22 days, while rework rates declined by 64%, satisfying civil aviation regulatory audits.",
            "code": """# The Closed-Loop Plan-Do-Check-Act (PDCA) Continuous Improvement Engine
from typing import Dict, List, Any

def audit_pdca_continuous_improvement_cycle(
    pdca_stages: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    required_stages = ["plan", "do", "check", "act"]
    stage_scores = {}
    stage_gaps = []
    
    for stage in required_stages:
        data = pdca_stages.get(stage, {"score": 0.0, "closed_actions": 0, "total_actions": 1})
        score = data.get("score", 0.0)
        closed = data.get("closed_actions", 0)
        total = max(data.get("total_actions", 1), 1)
        closure_rate = (closed / total) * 100.0
        
        stage_scores[stage] = {
            "effectiveness_score": score,
            "action_closure_rate_pct": round(closure_rate, 1)
        }
        
        if score < 85.0 or closure_rate < 90.0:
            stage_gaps.append(f"Stage '{stage.upper()}': Score {score}% / Closure {closure_rate:.1f}% below target")
            
    composite_pdca_index = sum(s["effectiveness_score"] for s in stage_scores.values()) / len(required_stages)
    is_closed_loop_mature = composite_pdca_index >= 90.0 and len(stage_gaps) == 0
    
    return {
        "composite_pdca_index": round(composite_pdca_index, 2),
        "stage_breakdown": stage_scores,
        "active_gaps_count": len(stage_gaps),
        "stage_gaps": stage_gaps,
        "is_closed_loop_mature": is_closed_loop_mature,
        "pdca_status": "CLOSED_LOOP_CONTINUOUS_IMPROVEMENT_NOMINAL" if is_closed_loop_mature else "PDCA_EXECUTION_DEFICIT"
    }

# Execute PDCA Audit
plant_pdca = {
    "plan": {"score": 94.0, "closed_actions": 10, "total_actions": 10},
    "do": {"score": 92.0, "closed_actions": 18, "total_actions": 19},
    "check": {"score": 95.0, "closed_actions": 15, "total_actions": 15},
    "act": {"score": 91.0, "closed_actions": 12, "total_actions": 12}
}

pdca_audit = audit_pdca_continuous_improvement_cycle(plant_pdca)
print(f"Composite PDCA Index: {pdca_audit['composite_pdca_index']}%")
print(f"Closed-Loop Maturity: {pdca_audit['is_closed_loop_mature']}")
print(f"Status: {pdca_audit['pdca_status']}")
""",
            "output": """Composite PDCA Index: 93.0%
Closed-Loop Maturity: True
Status: CLOSED_LOOP_CONTINUOUS_IMPROVEMENT_NOMINAL""",
            "lineNotes": [
                {"line": 5, "note": "Validates the four foundational quadrants of the Shewhart-Deming PDCA continuous improvement cycle."},
                {"line": 15, "note": "Calculates both qualitative effectiveness scores and quantitative action closure percentages per stage."},
                {"line": 23, "note": "Certifies closed-loop maturity only when composite index >= 90.0% and all four stages satisfy strict targets."}
            ],
            "tryIt": "Reduce the 'closed_actions' in the 'act' stage to 8 out of 12 (66.7% closure) and verify how the engine identifies the closure gap.",
            "check": {
                "question": "In ISO 9001:2015, which clause directly corresponds to the 'Act' phase of the Plan-Do-Check-Act cycle?",
                "options": [
                    "Clause 10 (Improvement)",
                    "Clause 4 (Context of the Organization)",
                    "Clause 7 (Support)",
                    "Clause 8 (Operation)"
                ],
                "answer": 0,
                "why": "Clause 10 is titled 'Improvement' and represents the 'Act' quadrant of PDCA, requiring organizations to take corrective actions on non-conformances and drive continuous improvement."
            }
        },

        # Part 3: Two-Stage External Certification Audits: Stage 1 Readiness & Stage 2 Execution
        {
            "title": "Two-Stage External Certification Audits: Stage 1 Readiness & Stage 2 Execution",
            "say": [
                "Achieving accredited ISO 9001:2015 certification requires undergoing a formal, independent two-stage audit conducted by an accredited third-party Certification Body (also known as a Registrar), such as TÜV SÜD, BSI, DNV, SGS, or Bureau Veritas. These Certification Bodies are themselves rigorously accredited by national accreditation bodies (such as ANAB in the United States, UKAS in the United Kingdom, or NABCB in India) under ISO/IEC 17021-1, ensuring absolute technical competence, impartiality, and mutual international recognition via the International Accreditation Forum (IAF) Multilateral Recognition Arrangement (MLA).",
                "The certification journey is structured into two mandatory, sequential milestones: The Stage 1 Audit (Documentation Readiness & System Adequacy) and The Stage 2 Audit (On-Site Operational Implementation & Verification). Under ISO 19011 (Guidelines for Auditing Management Systems), an organization cannot bypass Stage 1; it serves as a critical gateway determining whether the facility's QMS is mature enough to justify the full on-site scrutiny of Stage 2.",
                "During the Stage 1 Audit, lead auditors perform an in-depth review of the organization's documented information: quality policy, operational scope, context registers, process interaction maps, internal audit records, and management review meeting minutes. Crucially, auditors evaluate whether the enterprise has conducted at least one complete internal audit cycle covering all processes and held at least one formal management review meeting prior to the audit. If documentation is missing, process boundaries are ambiguous, or statutory licenses are incomplete, auditors issue 'Areas of Concern' or formal Non-Conformances that must be remediated before the company is cleared to proceed to Stage 2.",
                "Once Stage 1 readiness is confirmed (typically with a 30 to 60-day window for preparations), the auditors deploy to the facility for the comprehensive Stage 2 Audit. During Stage 2, lead auditors leave the conference room to examine physical shop-floor realities. Utilizing ISO 19011 evidence gathering techniques—triangulating employee interviews, direct process observation, and random sampling of operational records—auditors trace processes from customer order receipt through procurement, receiving inspection, manufacturing routing, calibration of inspection equipment, final test, packaging, and dispatch.",
                "The auditors evaluate whether everyday shop-floor practice strictly adheres to documented processes. They inspect whether CNC operators are using current, approved CAD drawings; whether calipers and micrometers have active, traceable calibration stickers; whether quarantine zones are physically segregated for non-conforming materials; and whether machine operators are trained and competent. Every finding is classified as a Conformity, an Opportunity for Improvement (OFI), a Minor Non-Conformance, or a Major Non-Conformance.",
                "Sampling methodology in Stage 2 audits is governed by statistical sampling theory to balance audit time against discovery risk. Auditors determine sample sizes based on production batch volumes, risk severity, and process stability. If an auditor samples 50 batch records out of a monthly run of 10,000 units and discovers 2 non-conformances, the binomial probability indicates potential systemic process slippage. The audit team expands the sample size to 100 units; if further defects emerge, a Minor finding escalates immediately to a Major Non-Conformance.",
                "Auditors also rigorously test calibration traceability under Clause 7.1.5. Measurement equipment—such as coordinate measuring machines (CMM), digital micrometers, pressure transmitters, and optical comparators—must be calibrated against standards traceable to national metrology institutes (such as NIST in the USA, PTB in Germany, or NPL in India). An uncalibrated gauge used to release finished product represents an immediate, severe breakdown in product assurance, frequently resulting in an unyielding Major Non-Conformance.",
                "In this part, we engineer a Python-based Two-Stage Certification Audit Pipeline Evaluator. This system tracks Stage 1 readiness prerequisites, audits Stage 2 physical sampling depth across operational departments, evaluates calibration and record verification counts, and calculates registrar recommendation status."
            ],
            "example": "A biomedical catheter manufacturing facility in Massachusetts underwent its ISO 9001:2015 initial certification audit. In Stage 1, the lead auditor verified complete coverage of its cleanroom procedures, internal audit records, and risk assessments. During the 4-day Stage 2 on-site audit, auditors reviewed 85 production batch records, inspected 40 calibrated temperature loggers, and interviewed 22 cleanroom operators across three shifts. The registrar identified 2 minor administrative observations and zero major non-conformances, issuing a formal recommendation for immediate ISO 9001:2015 certification.",
            "code": """# Two-Stage External Certification Audits: Stage 1 Readiness & Stage 2 Execution
from typing import Dict, List, Any

def evaluate_stage1_stage2_audit_pipeline(
    stage1_prerequisites: Dict[str, bool],
    stage2_sampling_metrics: Dict[str, Any]
) -> Dict[str, Any]:
    # Stage 1 Verification
    required_stage1_items = [
        "scope_and_context_documented",
        "internal_audit_cycle_completed",
        "management_review_meeting_held",
        "quality_objectives_defined",
        "statutory_licenses_current"
    ]
    
    stage1_passed = all(stage1_prerequisites.get(item, False) for item in required_stage1_items)
    missing_stage1 = [item for item in required_stage1_items if not stage1_prerequisites.get(item, False)]
    
    # Stage 2 Verification
    departments_audited = stage2_sampling_metrics.get("departments_audited", 0)
    samples_examined = stage2_sampling_metrics.get("records_sampled", 0)
    major_ncs_found = stage2_sampling_metrics.get("major_non_conformances", 0)
    minor_ncs_found = stage2_sampling_metrics.get("minor_non_conformances", 0)
    
    is_sampling_adequate = departments_audited >= 5 and samples_examined >= 50
    can_recommend_certification = stage1_passed and is_sampling_adequate and (major_ncs_found == 0)
    
    audit_status = (
        "RECOMMENDED_FOR_ACCREDITED_CERTIFICATION"
        if can_recommend_certification and minor_ncs_found == 0
        else "CONDITIONAL_APPROVAL_PENDING_MINOR_NC_CLOSURE"
        if can_recommend_certification
        else "CERTIFICATION_DENIED_MAJOR_NC_OR_STAGE1_FAILURE"
    )
    
    return {
        "stage1_readiness_passed": stage1_passed,
        "missing_stage1_prerequisites": missing_stage1,
        "stage2_departments_audited": departments_audited,
        "stage2_records_sampled": samples_examined,
        "major_ncs": major_ncs_found,
        "minor_ncs": minor_ncs_found,
        "can_recommend_certification": can_recommend_certification,
        "audit_pipeline_status": audit_status
    }

# Execute Certification Pipeline Evaluation
stage1_checklist = {
    "scope_and_context_documented": True,
    "internal_audit_cycle_completed": True,
    "management_review_meeting_held": True,
    "quality_objectives_defined": True,
    "statutory_licenses_current": True
}

stage2_results = {
    "departments_audited": 6,
    "records_sampled": 75,
    "major_non_conformances": 0,
    "minor_non_conformances": 2
}

pipeline_eval = evaluate_stage1_stage2_audit_pipeline(stage1_checklist, stage2_results)
print(f"Stage 1 Passed: {pipeline_eval['stage1_readiness_passed']}")
print(f"Major NCs: {pipeline_eval['major_ncs']} | Minor NCs: {pipeline_eval['minor_ncs']}")
print(f"Recommendation: {pipeline_eval['audit_pipeline_status']}")
""",
            "output": """Stage 1 Passed: True
Major NCs: 0 | Minor NCs: 2
Recommendation: CONDITIONAL_APPROVAL_PENDING_MINOR_NC_CLOSURE""",
            "lineNotes": [
                {"line": 5, "note": "Validates mandatory Stage 1 documentation prerequisites including internal audit and MRM completion."},
                {"line": 19, "note": "Audits Stage 2 physical sampling depth across minimum department and record thresholds."},
                {"line": 26, "note": "Categorizes recommendation status: immediate approval, conditional pending minor NCs, or outright denial."}
            ],
            "tryIt": "Set 'internal_audit_cycle_completed' to False in the stage1 checklist and verify how the pipeline immediately blocks Stage 2.",
            "check": {
                "question": "What is the primary objective of a Stage 1 ISO 9001 audit conducted by a Certification Body?",
                "options": [
                    "To evaluate documented system readiness, verify internal audit and management review completion, and determine preparedness for Stage 2 on-site evaluation",
                    "To immediately issue the final accredited certification certificate on the first day",
                    "To interview every individual factory employee across all three operating shifts",
                    "To inspect physical manufacturing machines for thermodynamic mechanical stress"
                ],
                "answer": 0,
                "why": "Stage 1 is the readiness and documentation audit. It verifies that mandatory QMS documentation exists, internal audits and management reviews have occurred, and the facility is prepared for Stage 2."
            }
        },

        # Part 4: Root Cause Analysis (RCA) & 8D / 5-Why Corrective Action Non-Conformance Closure
        {
            "title": "Root Cause Analysis (RCA) & 8D / 5-Why Corrective Action Non-Conformance Closure",
            "say": [
                "When an external auditor or internal audit team identifies an operational deviation during an audit, that finding is officially documented as a Non-Conformance (NC). In the realm of accredited quality management, a Non-Conformance is defined as the non-fulfillment of a specified requirement. How an enterprise handles Non-Conformances is the true measure of its quality culture. Under ISO 9001:2015 Clause 10.2, organizations must react promptly to non-conformances, control and correct them, deal with consequences, and eliminate root causes so that defects do not recur.",
                "Audit findings fall into three distinct classifications based on severity: 1. Major Non-Conformance (Major NC): A significant breakdown or total absence of a required management system clause, or an operational breakdown that directly endangers product conformity, safety, or legal compliance. A single Major NC automatically halts the certification process, requiring a formal re-audit within 90 days. 2. Minor Non-Conformance (Minor NC): An isolated, low-risk operational slip, clerical oversight, or minor inconsistency that does not indicate a systemic failure of the QMS (such as one technician working with an expired calibration gauge while five others use calibrated gauges). Minor NCs allow conditional certification provided an approved Corrective Action Plan is submitted and closed within 60 to 90 days. 3. Opportunity for Improvement (OFI): An advisory observation where the current process satisfies the standard, but where adopting best practices could prevent future vulnerabilities.",
                "To resolve Non-Conformances effectively, organizations employ disciplined problem-solving methodologies, most notably the 8 Disciplines (8D) framework and the 5-Why Root Cause Analysis technique. Treating the symptom (e.g., disciplining an operator or rewriting a work instruction) is an unpardonable mistake in quality engineering. If a supplier ships parts with incorrect dimensions, merely returning the batch is 'containment', not 'corrective action'. Containment protects the customer today; corrective action permanently prevents the problem from recurring tomorrow.",
                "The 8D methodology enforces a rigorous 8-step lifecycle: D1: Establish the cross-functional team with domain subject-matter experts; D2: Describe the problem with precision (utilizing 5W2H: Who, What, Where, When, Why, How, How many); D3: Implement Immediate Containment Actions (such as 100% sorting, quarantining suspect WIP inventory, and establishing customer boundary inspection gates); D4: Determine Root Causes using Ishikawa (Fishbone) Cause-and-Effect diagrams and recursive 5-Why questioning to distinguish systemic root causes from superficial symptoms; D5: Develop Permanent Corrective Actions (PCAs) that eliminate the root cause mechanism; D6: Implement and Validate PCAs through empirical testing and statistical verification; D7: Prevent Recurrence by institutionalizing procedural, tooling, and system updates across similar production lines; and D8: Formally recognize team contributions.",
                "In executing D4 root cause analysis, quality engineers categorize potential failure drivers using the Ishikawa 6M classification: Machine (equipment wear, tooling vibration, sensor drift), Method (ambiguous SOPs, improper feeds and speeds), Material (raw material hardness variation, supplier batch defects), Manpower (insufficient training, operator fatigue), Measurement (gauge R&R error, uncalibrated instruments), and Milieu/Mother Nature (ambient temperature fluctuations, relative humidity swings). The 5-Why recursive questioning is then applied down the primary fishbone branch until systemic management, engineering, or design roots are uncovered.",
                "Certification bodies mandate that all corrective actions be verified for effectiveness before formal closure. Auditors will not accept a generic closure statement such as 'trained the employee'. The organization must provide objective evidence demonstrating that the root cause was eliminated and that subsequent production runs show zero recurrences over a 30 to 60-day verification horizon. If a repeat non-conformance occurs during a subsequent surveillance audit, the registrar will immediately escalate the finding to a Major NC for failure of corrective action effectiveness.",
                "In this part, we implement a Python-based Non-Conformance CAPA Resolution Engine. This system processes audit non-conformances, verifies containment implementation, validates 5-Why root cause logic, tracks time-to-closure against strict accreditation deadlines, and calculates enterprise closure health scores."
            ],
            "example": "During a surveillance audit at an automotive stamping plant in Detroit, auditors discovered that 3 die stamping presses lacked verified hourly maintenance logs, resulting in a Minor Non-Conformance under Clause 8.5.1. The plant initiated an 8D CAPA: D3 contained the risk by 100% optical scanning of all stamped panels in warehouse inventory; D4 identified the root cause via 5-Why analysis—maintenance technicians lacked mobile rugged tablets and had to walk 200 meters to log checks on desktop PCs; D5/D6 deployed rugged barcode-scanning tablets directly at the presses; and D7 modified the autonomous maintenance procedure. Within 45 days, log compliance reached 100%, and the registrar formally closed the NC.",
            "code": """# Root Cause Analysis (RCA) & 8D / 5-Why Corrective Action NC Closure
from typing import Dict, List, Any

class AuditNonConformanceManager:
    def __init__(self, audit_id: str):
        self.audit_id = audit_id
        self.non_conformances: List[Dict[str, Any]] = []

    def register_nc(
        self, nc_id: str, severity: str, clause: str, description: str, max_closure_days: int = 60
    ) -> None:
        self.non_conformances.append({
            "nc_id": nc_id,
            "severity": severity.upper(),
            "clause": clause,
            "description": description,
            "max_closure_days": max_closure_days,
            "containment_active": False,
            "root_cause_validated": False,
            "pca_implemented": False,
            "days_elapsed": 0,
            "status": "OPEN"
        })

    def execute_capa_step(
        self, nc_id: str, containment: bool, root_cause_verified: bool, pca_active: bool, days_spent: int
    ) -> Dict[str, Any]:
        for nc in self.non_conformances:
            if nc["nc_id"] == nc_id:
                nc["containment_active"] = containment
                nc["root_cause_validated"] = root_cause_verified
                nc["pca_implemented"] = pca_active
                nc["days_elapsed"] = days_spent
                
                if containment and root_cause_verified and pca_active and days_spent <= nc["max_closure_days"]:
                    nc["status"] = "CLOSED_VERIFIED"
                elif days_spent > nc["max_closure_days"]:
                    nc["status"] = "OVERDUE_ESCALATED"
                else:
                    nc["status"] = "IN_PROGRESS"
                return nc
        raise ValueError(f"NC ID {nc_id} not found.")

    def evaluate_audit_closure_summary(self) -> Dict[str, Any]:
        total = len(self.non_conformances)
        closed = sum(1 for nc in self.non_conformances if nc["status"] == "CLOSED_VERIFIED")
        open_majors = sum(1 for nc in self.non_conformances if nc["severity"] == "MAJOR" and nc["status"] != "CLOSED_VERIFIED")
        
        closure_rate_pct = (closed / total * 100.0) if total > 0 else 100.0
        is_ready_for_certification = (open_majors == 0) and (closure_rate_pct == 100.0)
        
        return {
            "total_ncs": total,
            "closed_ncs": closed,
            "open_major_ncs": open_majors,
            "nc_closure_rate_pct": round(closure_rate_pct, 1),
            "is_certification_approved": is_ready_for_certification,
            "audit_summary_status": (
                "ALL_NON_CONFORMANCES_CLOSED_APPROVED"
                if is_ready_for_certification
                else "OPEN_NON_CONFORMANCES_PENDING_CLOSURE"
            )
        }

# Instantiate and Test NC Manager
nc_manager = AuditNonConformanceManager("ISO-EXT-2026-001")
nc_manager.register_nc("NC-01", "MINOR", "Clause 8.5.1", "Stamping press check log missing", 60)
nc_manager.register_nc("NC-02", "MINOR", "Clause 7.1.5", "Torque wrench past calibration date", 60)

# Resolve both Minor NCs through validated 8D CAPA
nc_manager.execute_capa_step("NC-01", containment=True, root_cause_verified=True, pca_active=True, days_spent=35)
nc_manager.execute_capa_step("NC-02", containment=True, root_cause_verified=True, pca_active=True, days_spent=28)

summary = nc_manager.evaluate_audit_closure_summary()
print(f"Total NCs: {summary['total_ncs']} | Closed: {summary['closed_ncs']}")
print(f"Closure Rate: {summary['nc_closure_rate_pct']}% | Open Majors: {summary['open_major_ncs']}")
print(f"Certification Approved: {summary['is_certification_approved']}")
print(f"Status: {summary['audit_summary_status']}")
""",
            "output": """Total NCs: 2 | Closed: 2
Closure Rate: 100.0% | Open Majors: 0
Certification Approved: True
Status: ALL_NON_CONFORMANCES_CLOSED_APPROVED""",
            "lineNotes": [
                {"line": 5, "note": "Maintains an enterprise registry of audit non-conformances with severity and deadline metadata."},
                {"line": 28, "note": "Enforces 8D CAPA validation requiring containment, root cause verification, and PCA implementation within time limits."},
                {"line": 40, "note": "Evaluates overall audit closure: requires zero open Major NCs and 100% Minor NC resolution for certification."}
            ],
            "tryIt": "Simulate an overdue corrective action by changing days_spent to 65 days for NC-01 and observe how status shifts to OVERDUE_ESCALATED.",
            "check": {
                "question": "What is the consequence of receiving a single Major Non-Conformance during a Stage 2 ISO 9001 certification audit?",
                "options": [
                    "Accredited certification is blocked and cannot be granted until the Major NC is fully contained, root cause resolved, and verified via a follow-up re-audit",
                    "The company is immediately awarded gold-level certification with no further actions required",
                    "The registrar automatically converts the Major NC into a harmless verbal compliment",
                    "The company is permanently banned from ever applying for ISO standards in the future"
                ],
                "answer": 0,
                "why": "A Major Non-Conformance indicates a serious breakdown of the QMS or direct risk to product quality; accredited certification cannot be granted until the issue is remediated and verified."
            }
        },

        # Part 5: Executive Synthesis: The Master ISO 9001 QMS Certification & Audit Closure Scorecard
        {
            "title": "Executive Synthesis: The Master ISO 9001 QMS Certification & Audit Closure Scorecard",
            "say": [
                "We now culminate Day 26 with an executive synthesis of the complete Quality Management System and audit closure architecture. In corporate boardrooms and global executive committees, operations leaders must bridge the technical rigor of quality engineering with the strategic mandate of commercial compliance. Holding an accredited ISO 9001:2015 certificate is not merely a technical achievement; it is a vital competitive moat that protects enterprise valuation, enables participation in global procurement consortiums, and eliminates multimillion-dollar customer warranty liability.",
                "The Master ISO 9001 QMS Certification Scorecard integrates the four operational pillars we have developed: Pillar 1: Annex SL high-level clause compliance (Context, Leadership, Risk Planning, Operations, and Improvement); Pillar 2: Closed-loop PDCA continuous improvement velocity (Shewhart-Deming cycle execution); Pillar 3: Two-stage audit gateway progression (Stage 1 documentation readiness and Stage 2 on-site evidence sampling); and Pillar 4: Defect-free non-conformance closure (strict 8D root-cause eradication ensuring 0 open Major NCs and 100% Minor NC resolution within statutory 60-day deadlines).",
                "To satisfy international accreditation regulations and standard enterprise resource planning (ERP) governance, our scorecard exposes the deterministic audit function: `audit_iso_non_conformance_closure(major_open_count, minor_resolved_pct)`. Under accredited IAF guidelines, certification can only be recommended if and only if two deterministic conditions are satisfied simultaneously: First, `major_nc_open_count == 0` (zero open major non-conformances); and Second, `minor_nc_resolved_percent == 100.0` (all minor non-conformances resolved and verified).",
                "If an enterprise has even a single open Major NC, the audit status is immediately categorized as `AUDIT_NON_CONFORMANCE_OPEN_CERTIFICATION_BLOCKED`. Conversely, when an organization successfully demonstrates 0 open Major NCs and 100% closure of all Minor NCs, the engine issues the official designation: `ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED`.",
                "From a balance sheet perspective, accredited ISO 9001 certification yields substantial financial returns. Empirical studies across manufacturing industries reveal that enterprises maintaining mature, certified QMS architectures experience a 20% to 35% reduction in the Cost of Poor Quality (CoPQ)—including internal scrap, rework, reinspection, and external warranty claims. Moreover, corporate insurance underwriters routinely discount product liability premiums by 15% to 25% for certified facilities, recognizing that disciplined process controls drastically reduce catastrophic liability events.",
                "Furthermore, corporate governance requires institutionalizing these standards through continuous internal audits and annual surveillance audits. ISO 9001 certificates are valid for a three-year cycle, subject to mandatory Year 1 and Year 2 surveillance audits by the registrar. An organization that treats quality as an enduring cultural operating system rather than an episodic pre-audit panic maintains permanent audit readiness, driving down internal cost of poor quality and creating an enduring foundation for commercial leadership.",
                "The international legitimacy of an accredited certificate is guaranteed by the IAF Multilateral Recognition Arrangement (MLA). Because national accreditation bodies (such as ANAB, UKAS, Dakks, or NABCB) sign the IAF MLA, a certificate issued by an accredited registrar in Munich or Chicago is legally recognized by procurement authorities and customs regulators in Tokyo, London, Mumbai, and São Paulo without requiring duplicative audits.",
                "In modern enterprise architectures, quality assurance is operationalized through digital Enterprise Quality Management Systems (eQMS) platforms such as SAP Quality Management, MasterControl, Veeva, or TrackWise. These cloud platforms integrate directly with shop-floor IoT sensors and ERP manufacturing execution systems (MES). When an in-line vision camera or torque sensor registers a non-conformance, the eQMS automatically initiates an electronic CAPA ticket, quarantines the affected production lot in warehouse inventory, and enforces cryptographic digital signatures compliant with FDA 21 CFR Part 11 and EU Annex 11. Automated escalation workflows alert plant managers if containment actions are not logged within 24 hours or if root cause verification exceeds 14 days.",
                "Finally, operations executives must recognize that ISO 9001:2015 provides the master governance chassis upon which all sector-specific quality frameworks are built. Automotive manufacturers extend ISO 9001 with IATF 16949 (mandating PPAP and APQP); aerospace primes require AS9100D (adding configuration management and counterfeit parts prevention); medical device producers implement ISO 13485 (demanding clinical risk management under ISO 14971); and telecommunications providers adhere to TL 9000. Mastering the Annex SL architecture and audit closure mechanics of ISO 9001 gives operations leaders the universal scaffolding required to govern any highly regulated industrial enterprise on earth.",
                "In this final part, we construct and execute the Master ISO 9001:2015 Audit Non-Conformance Closure Scorecard. We verify deterministic mathematical invariants, confirm certification recommendation logic, and establish the sovereign baseline for supply chain resilience."
            ],
            "example": "A Tier-1 precision medical device contract manufacturer in Ireland serving global orthopedic implant companies implemented this Master ISO 9001 Audit Scorecard. Prior to their recertification audit, their internal audit identified 1 potential Major NC in software validation and 4 Minor NCs in tool calibration. Utilizing the scorecard dashboard, executive leadership marshaled engineering taskforces to validate CNC software algorithms and calibrate 100% of gauges within 3 weeks. When the external BSI audit team arrived, the plant presented 0 open Major NCs and 100% Minor NC closure, securing unreserved ISO 9001:2015 recertification and expanding export contracts to 42 countries.",
            "code": """# Master ISO 9001:2015 Audit Non-Conformance Closure Scorecard
from typing import Dict, Any

def audit_iso_non_conformance_closure(
    major_nc_open_count: int,
    minor_nc_resolved_percent: float
) -> Dict[str, Any]:
    # Exact statutory certification condition: 0 Major NCs and 100% Minor NCs resolved
    is_certified = (major_nc_open_count == 0) and (minor_nc_resolved_percent == 100.0)
    
    status = (
        "ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED"
        if is_certified
        else "AUDIT_NON_CONFORMANCE_OPEN_CERTIFICATION_BLOCKED"
    )
    
    return {
        "majorNcOpenCount": major_nc_open_count,
        "minorNcResolvedPercent": float(minor_nc_resolved_percent),
        "isIso9001Certified": is_certified,
        "status": status
    }

class MasterIso9001CertificationEngine:
    def __init__(self, enterprise_name: str, facility_id: str):
        self.enterprise_name = enterprise_name
        self.facility_id = facility_id

    def execute_executive_certification_audit(
        self,
        annex_sl_score: float,
        pdca_index: float,
        major_open_count: int,
        minor_resolved_pct: float
    ) -> Dict[str, Any]:
        nc_closure_result = audit_iso_non_conformance_closure(major_open_count, minor_resolved_pct)
        governance_ok = (annex_sl_score >= 85.0) and (pdca_index >= 90.0)
        overall_accreditation = nc_closure_result["isIso9001Certified"] and governance_ok
        
        return {
            "enterprise": self.enterprise_name,
            "facility_id": self.facility_id,
            "annex_sl_governance_score": annex_sl_score,
            "pdca_improvement_index": pdca_index,
            "nc_closure_metrics": nc_closure_result,
            "is_accreditation_recommended": overall_accreditation,
            "executive_decision": (
                "GRANT_ACCREDITED_ISO_9001_2015_CERTIFICATION"
                if overall_accreditation
                else "WITHHOLD_CERTIFICATION_PENDING_GOVERNANCE_REMEDIATION"
            )
        }

# Execute Master Certification Engine
engine = MasterIso9001CertificationEngine("Apex Global Precision Aerospace", "FAC-MUNICH-09")
audit_decision = engine.execute_executive_certification_audit(
    annex_sl_score=91.3,
    pdca_index=93.0,
    major_open_count=0,
    minor_resolved_pct=100.0
)

print(f"Enterprise: {audit_decision['enterprise']}")
print(f"Major NCs Open: {audit_decision['nc_closure_metrics']['majorNcOpenCount']}")
print(f"Minor NCs Resolved: {audit_decision['nc_closure_metrics']['minorNcResolvedPercent']}%")
print(f"Certified: {audit_decision['nc_closure_metrics']['isIso9001Certified']}")
print(f"Status: {audit_decision['nc_closure_metrics']['status']}")
print(f"Executive Decision: {audit_decision['executive_decision']}")
""",
            "output": """Enterprise: Apex Global Precision Aerospace
Major NCs Open: 0
Minor NCs Resolved: 100.0%
Certified: True
Status: ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED
Executive Decision: GRANT_ACCREDITED_ISO_9001_2015_CERTIFICATION""",
            "lineNotes": [
                {"line": 4, "note": "Deterministic ISO 9001 audit closure function matching corporate compliance specifications."},
                {"line": 10, "note": "Evaluates exact statutory logic: requires major_nc_open_count == 0 and minor_nc_resolved_percent == 100.0."},
                {"line": 28, "note": "Synthesizes Annex SL compliance, PDCA closed-loop maturity, and NC closure into executive accreditation."}
            ],
            "tryIt": "Test edge cases: pass major_nc_open_count=1 with minor_nc_resolved_percent=100.0, and pass major_nc_open_count=0 with minor_nc_resolved_percent=98.5%. Confirm both block certification.",
            "check": {
                "question": "Under accredited ISO 9001:2015 registrar audit guidelines, what are the precise quantitative criteria required for a certification recommendation?",
                "options": [
                    "Exactly 0 Major Non-Conformances open and 100.0% of Minor Non-Conformances resolved and verified",
                    "Less than 5 Major Non-Conformances and at least 50% Minor Non-Conformances resolved",
                    "Zero documentation but high operator enthusiasm",
                    "Any number of Major Non-Conformances provided an appeal letter is submitted within 1 year"
                ],
                "answer": 0,
                "why": "Accredited certification rules dictate that an organization cannot be recommended for ISO 9001:2015 certification if any Major Non-Conformance remains open, and all Minor Non-Conformances must have approved 100% closed CAPAs."
            }
        }
    ]

    summary = [
        "ISO 9001:2015 is built upon the Annex SL 10-clause High-Level Structure (HLS), embedding proactive risk-based thinking (Clause 6) and dynamic documented information (Clause 7.5).",
        "The closed-loop Plan-Do-Check-Act (PDCA) cycle operationalizes continuous improvement across Clauses 4 through 10, converting process deviations into verified systemic safeguards.",
        "Accredited certification requires a two-stage audit: Stage 1 evaluates documentation readiness and mandatory internal audit/MRM completion, while Stage 2 inspects physical on-site execution.",
        "Non-conformances are classified as Major, Minor, or Opportunities for Improvement (OFI); Major NCs halt certification, while Minor NCs require approved CAPAs within 60 to 90 days.",
        "The 8 Disciplines (8D) methodology and 5-Why root cause analysis eliminate the underlying systemic vulnerabilities causing defects rather than merely treating superficial symptoms.",
        "The Master Audit Non-Conformance Closure Scorecard enforces the deterministic rule: 0 open Major NCs and 100% Minor NC resolution are required for ISO 9001:2015 certification recommendation."
    ]

    projectStep = {
        "title": "Operationalize ISO 9001:2015 QMS & Execute Complete Audit Non-Conformance Closure",
        "steps": [
            "Conduct an Annex SL High-Level Structure readiness assessment auditing Clauses 4 through 10 context and risk registers.",
            "Implement the closed-loop Plan-Do-Check-Act (PDCA) continuous improvement engine calculating the composite PDCA maturity index.",
            "Evaluate Stage 1 documentation readiness prerequisites and Stage 2 physical on-site audit sampling depth across operational departments.",
            "Deploy an 8D Root Cause Analysis and CAPA management system verifying containment, 5-Why root cause isolation, and permanent corrective action closure.",
            "Execute the Master ISO 9001 Audit Closure Scorecard, verifying 0 open Major NCs and 100% Minor NC resolution to recommend institutional certification."
        ]
    }

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == "__main__":
    data = get_day26_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
