"""
Build Day 29 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Courtroom Expert Testimony, Legal Report Writing, Cross-Examination & NFRA Sanctions
"""
import json

day_data = {
    "day": 29,
    "title": "Courtroom Expert Testimony, Forensic Report Writing & NFRA Sanctions: Section 45 & Section 132",
    "parts": [
        {
            "title": "Forensic Expert Report Writing & Judicial Standards: Section 45",
            "say": [
                "Under Section 45 of the Indian Evidence Act, 1872 (and Section 39 of the Bharatiya Sakshya Adhiniyam, 2023 - BSA), when the Court has to form an opinion upon a point of foreign law or of science, art, or as to identity of handwriting or electronic evidence, the opinions upon that point of persons specially skilled in such science or art are relevant facts. Such persons are called 'Expert Witnesses'. In corporate fraud trials, economic offense prosecutions, and NCLT insolvency proceedings, the forensic accountant serves as an Expert Witness whose written report forms the primary evidentiary foundation.",
                "Writing an expert forensic report demands exceptional legal and technical discipline. Unlike standard management consulting reports, a forensic expert report is a judicial document subject to hostile cross-examination and strict evidentiary scrutiny. The report must strictly adhere to the Daubert / Mohan judicial admissibility standards: (1) Empirical Grounding—every statement of fact must be tied to verified exhibits, primary bank statements, or audited vouchers; (2) Scientific Methodology—the investigative techniques used (e.g., Benford's Law, Beneish M-Score, digital disk carving) must be widely accepted in the professional community, peer-reviewed, and repeatable with a known error rate; (3) Objective Neutrality—the expert must remain an impartial minister of justice, avoiding emotional, accusatory, or speculative language; and (4) Clear Demarcation of Facts vs Opinions—distinguishing verified transactional data from professional opinions deduced therefrom.",
                "The report must articulate the mandate, the scope of examination, the limitations encountered, the methodologies applied, the chronological narrative of findings, and the final quantified conclusions.",
                "A poorly written forensic report full of uncorroborated assumptions will be shredded in court, destroying the investigation."
            ],
            "example": "In an SFIO investigation into an Rs 850 Crore siphoning scheme, the forensic accountant drafts the Expert Witness Report for the Special Court. The report outlines: (a) Mandate and qualifications; (b) Chronological trace of 145 wire transfers through 12 shell companies; (c) Attached Section 65B electronic certificates for bank server dumps; and (d) A clear summary table of funds diverted. The expert explicitly avoids calling the director a 'thief', stating objectively: 'The documented fund flows establish that funds were diverted to entities with no commercial operations.'",
            "code": '''class ForensicExpertReportArchitect:
    def __init__(self, case_caption: str, tribunal_name: str, expert_name: str, expert_credentials: str):
        self.case = case_caption
        self.tribunal = tribunal_name
        self.expert = expert_name
        self.credentials = expert_credentials
        self.sections = []
        
    def add_section(self, order: int, title: str, is_fact_or_opinion: str, content_summary: str):
        self.sections.append({
            "order": order,
            "title": title,
            "type": is_fact_or_opinion,
            "summary": content_summary
        })
        
    def generate_expert_report_structure(self) -> dict:
        sorted_s = sorted(self.sections, key=lambda s: s["order"])
        
        # Verify judicial standards under Section 45
        has_mandate = any("mandate" in s["title"].lower() or "scope" in s["title"].lower() for s in sorted_s)
        has_methodology = any("method" in s["title"].lower() for s in sorted_s)
        has_findings = any("findings" in s["title"].lower() or "facts" in s["title"].lower() for s in sorted_s)
        has_conclusions = any("conclusion" in s["title"].lower() or "opinion" in s["title"].lower() for s in sorted_s)
        
        is_structurally_admissible = has_mandate and has_methodology and has_findings and has_conclusions
        
        return {
            "tribunal": self.tribunal,
            "matter": self.case,
            "expert_witness": f"{self.expert}, {self.credentials}",
            "admissible_structure_sec45": is_structurally_admissible,
            "sections_trace": sorted_s
        }

report_eng = ForensicExpertReportArchitect(
    case_caption="Serious Fraud Investigation Office v. Apex Infrastructure Ltd & Ors",
    tribunal_name="Special Court for Economic Offenses / NCLT Mumbai Bench",
    expert_name="Dr. Vikram Seth",
    expert_credentials="FCA, CFE, EnCE, Forensic Expert Witness"
)
report_eng.add_section(1, "Executive Summary & Formal Investigative Mandate", "FACTUAL", "Mandate from Central Government under Section 212 of Companies Act.")
report_eng.add_section(2, "Forensic Investigation Methodology & Scientific Principles", "METHODOLOGICAL", "Bank statement hashing, UBO entity collision graphing, Benford's Law analysis.")
report_eng.add_section(3, "Chronological Factual Trace of Diverted Funds", "FACTUAL", "145 wire transfers through 12 shell conduits totaling INR 850 Crores.")
report_eng.add_section(4, "Expert Opinion & Synthesis of Fund Siphoning", "PROFESSIONAL_OPINION", "Deductions establishing that funds lacked genuine commercial business purpose.")
report_eng.add_section(5, "Index of Cryptographic Exhibits & Section 65B Certificates", "EVIDENTIARY", "Attached verified bank statements, ERP logs, and sworn affidavits.")

expert_dossier = report_eng.generate_expert_report_structure()
print("Forensic Expert Witness Report Architecture Engine (Section 45):")
print(f"  Tribunal Jurisdiction : {expert_dossier['tribunal']}")
print(f"  In the Matter of      : {expert_dossier['matter']}")
print(f"  Expert Witness Signer : {expert_dossier['expert_witness']}")
print(f"  Admissibility Status  : {expert_dossier['admissible_structure_sec45']}")
print("  Mandatory Section Breakdown:")
for sec in expert_dossier['sections_trace']:
    print(f"    [{sec['order']}] {sec['title']} ({sec['type']}) -> {sec['summary']}")
''',
            "tryIt": "Add a new section for Defense Inquiries Rebuttal to observe the expert report structure expand.",
            "check": {
                "question": "Under Section 45 of the Indian Evidence Act, what is the primary role of an expert witness's written forensic report in court?",
                "options": [
                    "To provide an objective, scientifically sound, and impartial analysis of technical facts to assist the court in reaching a just determination",
                    "To automatically convict the accused without a trial",
                    "To advertise the audit firm's accounting services to other clients",
                    "To demand monetary bribes from the defense lawyers"
                ],
                "answerIndex": 0,
                "why": "Section 45 explicitly recognizes expert opinion as an objective aid to the court in understanding specialized technical, scientific, or financial facts."
            }
        },
        {
            "title": "Cross-Examination Tactics, Credibility Defense & Evidentiary Rules",
            "say": [
                "Courtroom cross-examination by hostile defense advocates represents the supreme crucible in which a forensic auditor's findings and professional reputation are tested. In Indian trial procedure, evidence is adduced through Examination-in-Chief (presenting the report), followed immediately by Cross-Examination by opposing counsel, and potential Re-Examination under Sections 137 and 138 of the Indian Evidence Act.",
                "Hostile defense advocates deploy classic psychological and procedural cross-examination strategies: (1) Attacking Qualifications & Competence—challenging whether the witness possesses specialized forensic certifications or relevant industry experience; (2) Attacking Objectivity & Independence—accusing the expert of being a 'hired gun' biased in favor of management or the prosecution; (3) Attacking Methodology & Scope—highlighting missing documents, unverified assumptions, or cherry-picked sample transactions; (4) The Hypothetical Trap—forcing the expert to agree with hypothetical alternative scenarios designed to plant reasonable doubt; and (5) The Rapid-Fire Interruption Technique—demanding 'Yes or No' answers to complex accounting questions to truncate necessary technical explanations.",
                "To prevail, the expert must adhere to golden rules of testimony: (a) Never guess or speculate—if a document was not reviewed, state calmly, 'That document was outside our mandate'; (b) Pause before answering to formulate precise answers; (c) Concede obvious, undisputed facts gracefully without becoming defensive; (d) Explain technical terms in plain, intuitive language for the judge; and (e) Anchor all assertions in the written working papers.",
                "Mastering cross-examination transforms vulnerable forensic findings into unassailable judicial proof."
            ],
            "example": "In a cross-examination at the NCLT, defense counsel thunders: 'Isn't it true that you only sampled 15% of vendor invoices, and therefore your entire Rs 50 Crore fraud allegation is mere guesswork?' The forensic expert responds calmly: 'Counsel, our initial risk assessment tested 100% of journal entries using continuous automated analytics. That population screening isolated 42 high-risk shell vendor vouchers. For those specific 42 vouchers, we performed 100% substantive verification, proving that every single one lacked goods receipt notes and physical gate passes. It was not guesswork; it was a targeted 100% census of the high-risk population.' The defense counsel moves on.",
            "code": '''def simulate_cross_examination_defense(
    defense_tactic: str,
    expert_response_strategy: str,
    remained_calm_and_objective: bool,
    anchored_in_written_working_papers: bool
) -> dict:
    tactics_db = {
        "ATTACK_SAMPLE_SIZE": "Rebut by demonstrating 100% population screening via data analytics followed by 100% census of flagged high-risk vouchers.",
        "ACCUSE_HIRED_GUN_BIAS": "Affirm duty to the court: 'My duty under Section 45 is to assist the court with objective scientific facts, not to advocate for any party.'",
        "HYPOTHETICAL_TRAP": "Refuse to speculate on hypothetical assumptions: 'I am testifying strictly to the empirical facts documented in the evidence file.'",
        "DEMAND_YES_NO_ON_COMPLEX_MATTER": "State calmly: 'A simple yes or no would be misleading to the court; the accounting standard Ind AS 115 requires context.'"
    }
    
    tactic_normalized = defense_tactic.upper()
    standard_rebuttal = tactics_db.get(tactic_normalized, "Anchor answer in verified working papers.")
    
    is_defense_successful = remained_calm_and_objective and anchored_in_written_working_papers
    
    if is_defense_successful:
        credibility_score = 98.0
        witness_status = "CREDIBILITY_INTACT_EVIDENCE_UPHELD_BY_TRIBUNAL"
    else:
        credibility_score = 45.0
        witness_status = "CREDIBILITY_DAMAGED_EXPERT_APPEARED_SPECULATIVE_OR_DEFENSIVE"
        
    return {
        "tactic_deployed_by_defense": defense_tactic,
        "standard_expert_rebuttal": standard_rebuttal,
        "expert_strategy_executed": expert_response_strategy,
        "credibility_rating_pct": credibility_score,
        "tribunal_verdict_on_testimony": witness_status
    }

cross_sim = simulate_cross_examination_defense(
    defense_tactic="ATTACK_SAMPLE_SIZE",
    expert_response_strategy="Explained 100% automated analytics screening followed by 100% substantive testing of flagged shell vouchers.",
    remained_calm_and_objective=True,
    anchored_in_written_working_papers=True
)
print("Courtroom Cross-Examination Simulation Engine (Section 138):")
print(f"  Defense Attack Tactic : {cross_sim['tactic_deployed_by_defense']}")
print(f"  Standard Legal Counter: {cross_sim['standard_expert_rebuttal']}")
print(f"  Expert Strategy Used  : {cross_sim['expert_strategy_executed']}")
print(f"  Credibility Score     : {cross_sim['credibility_rating_pct']}%")
print(f"  Tribunal Verdict      : {cross_sim['tribunal_verdict_on_testimony']}")
''',
            "tryIt": "Set remained_calm_and_objective to False to observe how defensiveness cuts the credibility score by more than half.",
            "check": {
                "question": "What is the golden rule for an expert witness during hostile cross-examination regarding facts outside their mandate?",
                "options": [
                    "Never guess or speculate; state calmly that the matter was outside the investigative mandate and confine answers strictly to verified evidence in the working papers",
                    "Make up a creative story to entertain the judge",
                    "Shout at the defense lawyer and demand an apology",
                    "Admit that all accountants make up their numbers"
                ],
                "answerIndex": 0,
                "why": "Speculation destroys expert credibility; the expert must remain objective and confine testimony strictly to verified evidence within their mandate."
            }
        },
        {
            "title": "NFRA Regulatory Enforcement & Sanctions: Section 132 of Companies Act",
            "say": [
                "The National Financial Reporting Authority (NFRA) is India's independent, overarching statutory regulator for the auditing and accounting profession, established under Section 132 of the Companies Act, 2013. NFRA possesses sweeping investigative and quasi-judicial powers over all listed companies, large unlisted public companies, and their statutory auditors.",
                "Under Section 132(4), NFRA has the power to investigate professional misconduct committed by any member or firm of Chartered Accountants. When conducting an investigation, NFRA has the same powers as are vested in a civil court under the Code of Civil Procedure, 1908: (a) Discovery and production of books of account and other documents; (b) Summoning and enforcing the attendance of persons and examining them on oath; (c) Inspecting books, registers, and other documents; and (d) Issuing commissions for the examination of witnesses.",
                "Where professional or other misconduct is proved, Section 132(4)(c) empowers NFRA to impose draconian statutory sanctions: (1) Monetary Penalties—not less than Rs 1 Lakh, which may extend up to FIVE TIMES the fees received in case of individuals; and not less than Rs 5 Lakh, which may extend up to TEN TIMES the fees received in case of audit firms; and (2) Professional Debarment—debarring the member or firm from: (i) Being appointed as an auditor or internal auditor of any company or body corporate; or (ii) Performing any valuation, for a minimum period of six months and UP TO TEN YEARS (or permanently in severe corporate frauds).",
                "NFRA inspection reports routinely target: failure to assemble audit files within 60 days under SA 230; blind reliance on management representations; failure to exercise professional skepticism under SA 200; and failure to report fraud under Section 143(12)."
            ],
            "example": "NFRA issues a landmark disciplinary order under Section 132 against an audit partner who audited an infrastructure developer. The investigation revealed that the auditor failed to challenge the commercial substance of Rs 1,200 Crore in shell company loans, accepted management representations without corroboration, and failed to maintain working papers under SA 230. NFRA imposes a fine of Rs 50 Lakh and debars the partner from statutory audits for 5 years.",
            "code": '''def evaluate_nfra_regulatory_investigation_sanctions(
    audit_fee_received_lakhs: float,
    failed_sa230_file_assembly: bool,
    blind_reliance_on_management_reps: bool,
    failed_sec143_12_fraud_reporting: bool,
    audit_partner_years_experience: int
) -> dict:
    violations = []
    if failed_sa230_file_assembly:
        violations.append("SA 230 VIOLATION: Failure to assemble audit file within 60 days and lack of working paper evidence.")
    if blind_reliance_on_management_reps:
        violations.append("SA 580 / SA 200 VIOLATION: Blind reliance on management representations without professional skepticism.")
    if failed_sec143_12_fraud_reporting:
        violations.append("SECTION 143(12) VIOLATION: Failure to report corporate fraud to the Central Government in Form ADT-4.")
        
    severity = len(violations)
    
    if severity >= 2 or failed_sec143_12_fraud_reporting:
        # Severe misconduct: Maximum penalty & long debarment
        individual_fine_lakhs = min(100.0, audit_fee_received_lakhs * 5.0)
        firm_fine_lakhs = min(500.0, audit_fee_received_lakhs * 10.0)
        debarment_years = 5 if severity == 2 else 10
        verdict = "SEVERE_PROFESSIONAL_MISCONDUCT_PROVEN_MAXIMUM_SANCTIONS"
    elif severity == 1:
        individual_fine_lakhs = max(1.0, audit_fee_received_lakhs * 1.0)
        firm_fine_lakhs = max(5.0, audit_fee_received_lakhs * 2.0)
        debarment_years = 1
        verdict = "PROFESSIONAL_MISCONDUCT_ESTABLISHED_MODERATE_SANCTIONS"
    else:
        individual_fine_lakhs = 0.0
        firm_fine_lakhs = 0.0
        debarment_years = 0
        verdict = "NO_MISCONDUCT_ESTABLISHED_AUDIT_DOCUMENTATION_SOUND"
        
    return {
        "violations_identified": violations,
        "nfra_order_verdict": verdict,
        "individual_penalty_inr_lakhs": round(individual_fine_lakhs, 2),
        "firm_penalty_inr_lakhs": round(firm_fine_lakhs, 2),
        "statutory_debarment_duration_years": debarment_years,
        "statutory_basis": "Companies Act, 2013 Section 132(4)(c)"
    }

nfra_case = evaluate_nfra_regulatory_investigation_sanctions(
    audit_fee_received_lakhs=40.0,
    failed_sa230_file_assembly=True,
    blind_reliance_on_management_reps=True,
    failed_sec143_12_fraud_reporting=True,
    audit_partner_years_experience=22
)
print("National Financial Reporting Authority (NFRA) Section 132 Enforcement Engine:")
print(f"  Misconduct Verdict    : {nfra_case['nfra_order_verdict']}")
print(f"  Individual Fine       : INR {nfra_case['individual_penalty_inr_lakhs']} Lakhs")
print(f"  Firm Penalty          : INR {nfra_case['firm_penalty_inr_lakhs']} Lakhs")
print(f"  Professional Debarment: {nfra_case['statutory_debarment_duration_years']} YEARS debarred from corporate audits")
print(f"  Legal Statute         : {nfra_case['statutory_basis']}")
print("  Proven Disciplinary Violations:")
for v in nfra_case['violations_identified']:
    print(f"    * {v}")
''',
            "tryIt": "Set all violation flags to False to observe the verdict turn to clean sound audit documentation with zero fines or debarment.",
            "check": {
                "question": "Under Section 132(4)(c) of the Companies Act, 2013, what is the maximum period for which the National Financial Reporting Authority (NFRA) can debar a Chartered Accountant or audit firm for professional misconduct?",
                "options": [
                    "Debarment for a minimum period of six months and up to ten years (or permanently in severe corporate fraud cases)",
                    "A maximum of 14 days over the Diwali holidays",
                    "Three weeks of community service cleaning the local library",
                    "NFRA cannot debar auditors; it can only write angry letters"
                ],
                "answerIndex": 0,
                "why": "Section 132(4)(c)(B) explicitly grants NFRA the power to debar an auditor or audit firm for a minimum period of 6 months and up to 10 years."
            }
        },
        {
            "title": "The Forensic Auditor's Permanent Defense Shield: The SA 230 Lockdown",
            "say": [
                "In light of aggressive regulatory enforcement by NFRA, the Serious Fraud Investigation Office (SFIO), and the Enforcement Directorate (ED), how does a statutory and forensic auditor build an impenetrable defense? The answer lies in the strict, unyielding execution of Standard on Auditing (SA) 230, 'Audit Documentation'—the Auditor's Permanent Defense Shield.",
                "The cardinal judicial maxim of auditing is: 'What is not documented in the audit working papers was NEVER done!' Verbal recollections, reconstructed memories, or post-dated explanations are completely inadmissible and rejected by judicial tribunals.",
                "To construct an impenetrable defense shield, the auditor must enforce the SA 230 Lockdown Protocol: (1) Experienced Auditor Standard—working papers must contain sufficient detail to enable an experienced auditor having no previous connection with the audit to understand the nature, timing, and extent of procedures, the results of tests, and the rationale for significant professional judgments; (2) The 60-Day Assembly Rule—under SQC 1 and SA 230, the final audit file must be assembled, indexed, and locked within NOT MORE THAN 60 DAYS from the date of the auditor's report; (3) The 7-Year Retention Mandate—working papers must be securely preserved for not less than seven years, protected against unauthorized modification or deletion; and (4) Cryptographic Timestamping—generating immutable hash digests of the finalized working paper archive to prove that no documents were added, altered, or deleted retroactively.",
                "An auditor who maintains an unassailable, cryptographically locked SA 230 file is virtually immune to regulatory sanctions."
            ],
            "example": "NFRA initiates an investigation into an auditor's evaluation of a client's revenue cut-off. The auditor produces the cryptographically locked SA 230 audit file: showing that the file was assembled 28 days after report date, featuring timestamped working papers, independent bank circularization logs, physical inventory count observation sheets, and minutes of Audit Committee meetings. NFRA drops all charges, commending the auditor's documentation rigor.",
            "code": '''import hashlib

class SA230DefenseShieldLockdownEngine:
    def __init__(self, engagement_name: str, report_date: str):
        self.engagement = engagement_name
        self.report_date = report_date
        self.working_papers = []
        
    def add_working_paper(self, wp_id: str, title: str, author: str, completion_date: str, content_summary: str):
        wp_hash = hashlib.sha256(f"{wp_id}:{title}:{content_summary}".encode("utf-8")).hexdigest()
        self.working_papers.append({
            "wp_id": wp_id,
            "title": title,
            "author": author,
            "date": completion_date,
            "hash": wp_hash
        })
        
    def execute_file_assembly_lockdown(self, assembly_date: str) -> dict:
        from datetime import datetime
        
        t_rep = datetime.strptime(self.report_date, "%Y-%m-%d")
        t_ass = datetime.strptime(assembly_date, "%Y-%m-%d")
        
        elapsed_days = (t_ass - t_rep).days
        is_within_60_days = 0 <= elapsed_days <= 60
        
        # Combine all WP hashes into a master Merkle root hash
        combined_hashes = "".join(wp["hash"] for wp in self.working_papers)
        master_archive_hash = hashlib.sha256(combined_hashes.encode("utf-8")).hexdigest()
        
        return {
            "engagement": self.engagement,
            "report_date": self.report_date,
            "assembly_date": assembly_date,
            "assembly_elapsed_days": elapsed_days,
            "met_60_day_sa230_deadline": is_within_60_days,
            "total_working_papers_archived": len(self.working_papers),
            "master_archive_sha256": master_archive_hash,
            "retention_policy": "7_YEARS_MANDATORY_LOCKDOWN_SQC1",
            "defense_shield_status": "IMPERVIOUS_SA230_DEFENSE_ESTABLISHED" if is_within_60_days else "DEFECTIVE_ASSEMBLY_NFRA_SANCTION_RISK"
        }

shield = SA230DefenseShieldLockdownEngine("Statutory Audit of Zenith Infrastructure Ltd", "2026-05-15")
shield.add_working_paper("WP-101", "Materiality & Performance Materiality Allocation Memo", "Audit Senior", "2026-04-10", "Established 5% PBT materiality.")
shield.add_working_paper("WP-201", "SA 240 Fraud Analytics & Benford Chi-Square Test", "Forensic Specialist", "2026-04-25", "Screened 100% GL vouchers.")
shield.add_working_paper("WP-301", "SA 501 Physical Inventory Attendance Observation", "Audit Senior", "2026-03-31", "Attended warehouse counts.")
shield.add_working_paper("WP-401", "SA 701 Key Audit Matters Technical Determination Memo", "Lead Partner", "2026-05-10", "3-step funnel evaluation.")

lockdown_res = shield.execute_file_assembly_lockdown(assembly_date="2026-06-12") # 28 days elapsed
print("SA 230 Permanent Defense Shield & Cryptographic Lockdown Engine:")
print(f"  Engagement Name       : {lockdown_res['engagement']}")
print(f"  Assembly Elapsed Days : {lockdown_res['assembly_elapsed_days']} days (SA 230 Limit: <= 60 days)")
print(f"  Within 60-Day Window  : {lockdown_res['met_60_day_sa230_deadline']}")
print(f"  Working Papers Locked : {lockdown_res['total_working_papers_archived']} files")
print(f"  Master Archive SHA-256: {lockdown_res['master_archive_sha256']}")
print(f"  Defense Shield Status : {lockdown_res['defense_shield_status']}")
''',
            "tryIt": "Set assembly_date to '2026-08-15' (92 days elapsed) to observe how exceeding the 60-day limit triggers an immediate NFRA sanction risk.",
            "check": {
                "question": "What is the mandatory statutory assembly deadline for the final audit file under SA 230 and SQC 1?",
                "options": [
                    "Not more than 60 days after the date of the auditor's report",
                    "Within three calendar years after the AGM",
                    "On the day before the company files for bankruptcy",
                    "There is no assembly deadline; working papers can be gathered whenever NFRA sends a notice"
                ],
                "answerIndex": 0,
                "why": "SQC 1 and SA 230 Paragraph A21 mandate that the assembly of the final audit file shall be completed within an ordinary limit of not more than 60 days after the date of the auditor's report."
            }
        },
        {
            "title": "Comprehensive Legal Testimony & Regulatory Defense Dossier",
            "say": [
                "Synthesizing Courtroom Expert Testimony under Section 45, cross-examination resilience, NFRA enforcement awareness under Section 132, and the cryptographic SA 230 defense shield culminates in the Master Legal Testimony & Regulatory Defense Dossier.",
                "The dossier brings together: (1) The Expert Witness Report with all technical exhibits and Section 65B certificates; (2) The Cross-Examination Preparation Matrix anticipating defense challenges; (3) The NFRA Compliance Checklist verifying that all statutory procedures were executed and documented; and (4) The Cryptographically Signed SA 230 File Lockdown Certificate.",
                "This comprehensive mastery ensures that the forensic auditor stands as an invincible, incorruptible pillar of truth and justice in corporate legal and regulatory arenas."
            ],
            "example": "The forensic partner presents the completed legal testimony dossier in a major corporate prosecution: demonstrating that every statement in the expert report is backed by indexed working papers, verified by SHA-256 hashes, certified under Section 65B, and assembled within the SA 230 60-day window. The court accepts the testimony in full, leading to a landmark conviction.",
            "code": '''class MasterLegalDefenseDossier:
    def __init__(self, investigation_name: str, lead_investigator: str):
        self.investigation = investigation_name
        self.investigator = lead_investigator
        self.dossier_pillars = []
        
    def add_pillar(self, pillar_name: str, is_certified: bool, statute: str):
        self.dossier_pillars.append({
            "pillar": pillar_name,
            "certified": is_certified,
            "governing_statute": statute
        })
        
    def evaluate_dossier_invincibility(self) -> dict:
        total = len(self.dossier_pillars)
        certified_count = sum(1 for p in self.dossier_pillars if p["certified"])
        is_invincible = total == certified_count
        
        return {
            "investigation": self.investigation,
            "lead_expert": self.investigator,
            "total_pillars": total,
            "certified_pillars": certified_count,
            "courtroom_and_nfra_defense_status": "INVINCIBLE_LEGAL_DEFENSE_DOSSIER_CERTIFIED" if is_invincible else "DEFENSE_VULNERABILITY_REMEDIATION_REQUIRED",
            "pillars_detail": self.dossier_pillars
        }

defense_dossier = MasterLegalDefenseDossier("Supreme Corporate Prosecution v. Megacorp", "Vikram Malhotra, FCA, CFE")
defense_dossier.add_pillar("Section 45 Forensic Expert Witness Report & Exhibits", True, "Indian Evidence Act Sec 45")
defense_dossier.add_pillar("Section 65B Electronic Evidence Admissibility Certificates", True, "Indian Evidence Act Sec 65B")
defense_dossier.add_pillar("Cross-Examination Factual Anchor & Rebuttal Matrix", True, "Evidence Act Sec 138")
defense_dossier.add_pillar("NFRA Section 132 Regulatory Compliance Verification", True, "Companies Act Sec 132")
defense_dossier.add_pillar("SA 230 Cryptographic 60-Day File Lockdown & 7-Year Retention", True, "SA 230 & SQC 1")

dossier_summary = defense_dossier.evaluate_dossier_invincibility()
print("Master Legal Testimony & Regulatory Defense Dossier Engine:")
print(f"  Investigation Title   : {dossier_summary['investigation']}")
print(f"  Lead Expert Witness   : {dossier_summary['lead_expert']}")
print(f"  Pillars Certified     : {dossier_summary['certified_pillars']}/{dossier_summary['total_pillars']}")
print(f"  Defense Status        : {dossier_summary['courtroom_and_nfra_defense_status']}")
print("  Defense Pillars Trace:")
for p in dossier_summary['pillars_detail']:
    print(f"    * {p['pillar']} [{p['governing_statute']}]: Certified={p['certified']}")
''',
            "tryIt": "Set is_certified to False for Section 65B to observe how the defense status flags a critical vulnerability.",
            "check": {
                "question": "What is the primary judicial benefit of combining an expert report under Section 45 with a cryptographically locked SA 230 audit file?",
                "options": [
                    "It establishes that the expert's conclusions are grounded in objective scientific evidence and that working papers were locked in an untampered state within statutory timelines, defeating allegations of bias or fabrication",
                    "It permits the auditor to skip all court appearances",
                    "It eliminates the need for a trial",
                    "It makes the auditor eligible for a government pension"
                ],
                "answerIndex": 0,
                "why": "Grounding expert testimony in cryptographically verified, timely locked SA 230 working papers provides unassailable proof of evidentiary integrity and objectivity."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day29.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 29 base JSON created successfully.")
