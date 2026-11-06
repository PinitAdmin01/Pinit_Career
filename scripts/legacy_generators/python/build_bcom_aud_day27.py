"""
Build Day 27 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Cyber Incident Auditing, Ransomware Forensics, Business Email Compromise (BEC) & CERT-In Reporting
"""
import json

day_data = {
    "day": 27,
    "title": "Cyber Incident Auditing, Ransomware Forensics & Business Email Compromise: CERT-In 6-Hour Rule",
    "parts": [
        {
            "title": "Cyber Incident Response Auditing & NIST Cybersecurity Framework (CSF)",
            "say": [
                "In modern enterprise statutory assurance, cyber incidents represent one of the most severe operational and financial statement risks. A catastrophic ransomware attack, unauthorized data exfiltration, or treasury compromise directly impacts internal controls over financial reporting (IFCoFR), going concern assumptions under SA 570, contingent liabilities under Ind AS 37, and statutory compliance under the Information Technology Act, 2000. Statutory and forensic auditors must evaluate the enterprise's Cyber Incident Response Plan (CIRP) against global frameworks, primarily the NIST Cybersecurity Framework (CSF 2.0).",
                "The NIST CSF establishes six continuous, concurrent functions: (1) Govern—establishing cybersecurity strategy, risk tolerance, and executive oversight; (2) Identify—mapping critical financial assets, ERP servers, database clusters, and supply chain dependencies; (3) Protect—implementing multi-factor authentication (MFA), network micro-segmentation, and endpoint encryption; (4) Detect—deploying Security Information and Event Management (SIEM) systems and continuous anomaly monitoring; (5) Respond—containing breaches, neutralizing adversary persistence, and executing crisis communications; and (6) Recover—restoring financial ledgers from immutable, air-gapped backups and validating transactional consistency.",
                "The forensic auditor must evaluate whether management maintained adequate business continuity and disaster recovery (BCDR) controls and whether recovery time objectives (RTO) and recovery point objectives (RPO) were validated through empirical restoration tests.",
                "Failure to maintain tested BCDR controls constitutes a material weakness in internal financial controls under Section 143(3)(i)."
            ],
            "example": "During the statutory audit of a fintech platform processing Rs 50 Crore in daily transactions, the auditor evaluates NIST CSF readiness: the company maintains immutable WORM (Write Once Read Many) cloud backups of its transactional database, automated SIEM alerts trigger within 30 seconds of credential stuffing, and quarterly failover tests verify that the secondary disaster recovery site achieves full transactional restoration within an RTO of 45 minutes and RPO of zero seconds.",
            "code": '''def audit_nist_csf_cyber_incident_readiness(
    has_immutable_airgapped_backups: bool,
    mfa_enforced_across_all_endpoints: bool,
    rto_hours_actual: float,
    rto_hours_sla: float,
    siem_24_7_monitoring_active: bool,
    incident_response_playbook_tested_annually: bool
) -> dict:
    readiness_factors = [
        has_immutable_airgapped_backups,
        mfa_enforced_across_all_endpoints,
        (rto_hours_actual <= rto_hours_sla),
        siem_24_7_monitoring_active,
        incident_response_playbook_tested_annually
    ]
    
    score = sum(1 for f in readiness_factors if f)
    total = len(readiness_factors)
    score_pct = (score / total) * 100.0
    
    if score == 5:
        csf_tier = "TIER_4_ADAPTIVE_ENTERPRISE_CYBER_RESILIENCE"
        ifcofr_impact = "CLEAN_IFCOFR_CYBER_CONTROLS_OPERATING_EFFECTIVELY"
    elif score >= 3:
        csf_tier = "TIER_2_RISK_INFORMED_DEFICIENT_CONTROLS"
        ifcofr_impact = "SIGNIFICANT_DEFICIENCY_MANAGEMENT_LETTER_POINT"
    else:
        csf_tier = "TIER_1_PARTIAL_UNPREPARED_CRITICAL_VULNERABILITY"
        ifcofr_impact = "MATERIAL_WEAKNESS_IN_IFCOFR_QUALIFICATION_MANDATED"
        
    return {
        "csf_compliance_score_pct": score_pct,
        "controls_passed": f"{score}/{total}",
        "rto_sla_compliant": rto_hours_actual <= rto_hours_sla,
        "evaluated_csf_tier": csf_tier,
        "ifcofr_statutory_impact": ifcofr_impact
    }

csf_audit = audit_nist_csf_cyber_incident_readiness(
    has_immutable_airgapped_backups=True,
    mfa_enforced_across_all_endpoints=True,
    rto_hours_actual=0.75, # 45 minutes
    rto_hours_sla=2.0,     # 2 hour SLA
    siem_24_7_monitoring_active=True,
    incident_response_playbook_tested_annually=True
)
print("NIST Cybersecurity Framework (CSF) Incident Readiness Engine:")
print(f"  CSF Readiness Score   : {csf_audit['csf_compliance_score_pct']}% ({csf_audit['controls_passed']} controls passed)")
print(f"  RTO SLA Achieved      : {csf_audit['rto_sla_compliant']}")
print(f"  NIST Maturity Tier    : {csf_audit['evaluated_csf_tier']}")
print(f"  IFCoFR Audit Impact   : {csf_audit['ifcofr_statutory_impact']}")
''',
            "tryIt": "Set has_immutable_airgapped_backups to False and rto_hours_actual to 12.0 to observe how cyber unpreparedness triggers a material weakness in IFCoFR.",
            "check": {
                "question": "Under the NIST Cybersecurity Framework (CSF 2.0), what are the six core functions that an auditor evaluates during a cyber resilience audit?",
                "options": [
                    "Govern, Identify, Protect, Detect, Respond, and Recover",
                    "Download, Install, Play, Delete, Format, and Reboot",
                    "Debit, Credit, Balance, Ledger, Voucher, and Journal",
                    "Tax, Audit, Penalty, Appeal, Scrutiny, and Assessment"
                ],
                "answerIndex": 0,
                "why": "NIST CSF 2.0 officially codifies six core functions: Govern, Identify, Protect, Detect, Respond, and Recover."
            }
        },
        {
            "title": "Business Email Compromise (BEC) & Treasury Wire Fraud Forensics",
            "say": [
                "Business Email Compromise (BEC), also known as CEO Fraud or Mandate Fraud, represents one of the fastest-growing and financially devastating cyber financial crimes globally. In a classic BEC scheme, sophisticated threat actors compromise corporate email accounts (through phishing, credential stuffing, or session hijacking) or spoof executive domains to deceive accounts payable staff into wiring corporate funds to fraudulent bank accounts controlled by criminal rings.",
                "Forensic investigation of BEC treasury fraud requires systematic technical and financial triangulation: (1) Email Header Analysis—extracting RFC 5322 headers, analyzing the Received hops trace, comparing the 'From' address against the 'Reply-To' and 'Return-Path' headers, and inspecting DomainKeys Identified Mail (DKIM) signatures, Sender Policy Framework (SPF) validation results, and DMARC (Domain-based Message Authentication, Reporting, and Conformance) alignment; (2) Exchange / Office 365 Audit Log Analysis—querying Microsoft Purview Unified Audit Logs (UAL) for suspicious user logins from foreign IP addresses, impossible travel velocity anomalies, and mailbox Inbox Rules (threat actors routinely create hidden forwarding rules to divert finance team responses to RSS or deleted folders); and (3) Financial Asset Tracing—coordinating with the corporate bank and financial intelligence units (FIU-IND) to freeze recipient accounts within the critical 24-hour wire recall window.",
                "The auditor must evaluate whether the entity maintained mandatory Segregation of Duties (SoD) and Out-of-Band (OOB) verbal callback verification controls before executing bank account detail changes.",
                "If treasury staff changed vendor bank details based solely on an email request, the loss represents a catastrophic breakdown in internal controls."
            ],
            "example": "A treasury accountant receives an urgent email appearing to come from the CEO, directing an immediate Rs 18 Crore wire transfer for a confidential corporate acquisition. The accountant executes the transfer without voice verification. Forensic inspection reveals: the email domain was spoofed ('apx-corp.com' instead of 'apex-corp.com'), SPF and DKIM failed, and the CEO's mailbox contained a malicious auto-forwarding rule created from a VPN in Lagos. The auditor logs an Rs 18 Crore unrecorded fraud loss and qualifies IFCoFR.",
            "code": '''def analyze_business_email_compromise_headers(
    sender_domain: str,
    reply_to_domain: str,
    spf_result: str, # "PASS", "FAIL", "SOFTFAIL", "NONE"
    dkim_result: str, # "PASS", "FAIL", "NONE"
    dmarc_result: str, # "PASS", "FAIL", "NONE"
    inbox_hidden_forwarding_rule_found: bool,
    wire_callback_performed: bool,
    wire_amount_cr: float
) -> dict:
    domain_spoofed = (sender_domain.lower() != reply_to_domain.lower())
    email_auth_failed = (spf_result.upper() != "PASS") or (dkim_result.upper() != "PASS") or (dmarc_result.upper() != "PASS")
    
    is_fraud_confirmed = domain_spoofed or email_auth_failed or inbox_hidden_forwarding_rule_found
    control_failure = not wire_callback_performed
    
    if is_fraud_confirmed and control_failure:
        incident_verdict = "CONFIRMED_BEC_WIRE_FRAUD_TREASURY_CONTROL_FAILURE"
        accounting_impact = f"MANDATORY_CHARGE_OF_INR_{wire_amount_cr}_CR_TO_PROFIT_AND_LOSS"
        ifcofr_status = "MATERIAL_WEAKNESS_IN_TREASURY_DISBURSEMENT_CONTROLS"
    elif is_fraud_confirmed and not control_failure:
        incident_verdict = "ATTEMPTED_BEC_ATTACK_SUCCESSFULLY_BLOCKED_BY_CALLBACK_CONTROL"
        accounting_impact = "ZERO_FINANCIAL_LOSS_INTERNAL_CONTROLS_OPERATED_EFFECTIVELY"
        ifcofr_status = "CLEAN_CONTROLS_EFFECTIVE"
    else:
        incident_verdict = "GENUINE_COMMUNICATION_NO_ANOMALY"
        accounting_impact = "STANDARD_OPERATION"
        ifcofr_status = "CLEAN"
        
    return {
        "sender": sender_domain,
        "reply_to": reply_to_domain,
        "domain_spoofed": domain_spoofed,
        "email_auth_passed": not email_auth_failed,
        "hidden_rule_active": inbox_hidden_forwarding_rule_found,
        "out_of_band_callback": wire_callback_performed,
        "fraud_loss_cr": wire_amount_cr if (is_fraud_confirmed and control_failure) else 0.0,
        "incident_classification": incident_verdict,
        "accounting_treatment": accounting_impact,
        "ifcofr_finding": ifcofr_status
    }

bec_case = analyze_business_email_compromise_headers(
    sender_domain="ceo@apx-corp.com",
    reply_to_domain="wire-desk@money-routing.com",
    spf_result="FAIL",
    dkim_result="FAIL",
    dmarc_result="FAIL",
    inbox_hidden_forwarding_rule_found=True,
    wire_callback_performed=False,
    wire_amount_cr=18.0
)
print("Forensic Business Email Compromise (BEC) Header Analysis Engine:")
print(f"  Sender vs Reply-To    : {bec_case['sender']} -> {bec_case['reply_to']} (Spoofed: {bec_case['domain_spoofed']})")
print(f"  Email Authentication  : SPF/DKIM/DMARC Pass={bec_case['email_auth_passed']}")
print(f"  Hidden Mailbox Rules  : {bec_case['hidden_rule_active']}")
print(f"  Voice Callback Done   : {bec_case['out_of_band_callback']}")
print(f"  Confirmed Fraud Loss  : INR {bec_case['fraud_loss_cr']} Crores")
print(f"  Forensic Verdict      : {bec_case['incident_classification']}")
print(f"  Accounting Action     : {bec_case['accounting_treatment']}")
print(f"  IFCoFR Control Finding: {bec_case['ifcofr_finding']}")
''',
            "tryIt": "Set wire_callback_performed to True to observe how secondary out-of-band verification blocks the fraud and prevents financial loss.",
            "check": {
                "question": "What is the primary anti-fraud internal control designed to prevent Business Email Compromise (BEC) treasury wire diversion?",
                "options": [
                    "Mandatory out-of-band (OOB) verbal callback verification using pre-registered phone numbers before modifying vendor bank details or wiring large funds",
                    "Forwarding all emails to the marketing manager",
                    "Changing executive email passwords to 'Password123'",
                    "Printing all emails on green paper"
                ],
                "answerIndex": 0,
                "why": "Out-of-band verbal callback verification ensures that changes to payment instructions are verified through an independent communication channel, defeating spoofed emails."
            }
        },
        {
            "title": "Ransomware Forensics, Double-Extortion & Accounting under Ind AS 37",
            "say": [
                "Ransomware attacks in corporate environments have evolved from simple file-locking malware into sophisticated Double-Extortion operations: threat actors infiltrate the corporate network, silently exfiltrate sensitive customer and intellectual property databases over weeks, and subsequently deploy military-grade encryption across virtual servers and cloud storage. The criminals demand millions of dollars in cryptocurrency (Bitcoin or Monero), threatening both permanent data destruction and public publication of proprietary source code.",
                "In statutory and forensic auditing, ransomware presents profound accounting and disclosure dilemmas under Ind AS 37 (Provisions, Contingent Liabilities and Contingent Assets) and Ind AS 10 (Events after the Reporting Period): (1) Evaluating Ransom Payments—paying ransoms involves severe legal and regulatory perils (such as sanctions violations under OFAC or PMLA anti-money laundering laws); from an accounting perspective, ransom payments must be classified as non-operating losses; (2) Data Breach Regulatory Liabilities—under the Digital Personal Data Protection Act, 2023 (DPDP Act), enterprises face statutory penalties of up to Rs 250 Crore for failing to prevent personal data breaches, requiring mandatory provision estimation under Ind AS 37; and (3) System Restoration & Forensic Costs—capitalizing versus expensing software reconstruction costs under Ind AS 38.",
                "The auditor must independently test whether reconstructed financial records from encrypted backups are complete and uncorrupted, performing balance reconciliation testing against external bank confirmations."
            ],
            "example": "A logistics conglomerate suffers a LockBit double-extortion ransomware attack that encrypts its active SAP databases. The criminals demand a Rs 35 Crore ransom. Management refuses to pay and restores data from 48-hour-old immutable offline backups. The forensic audit team reconstructs the 48-hour transaction gap from physical gate logs and bank API feeds, reconciling ending inventory within Rs 12 Lakh. Management records an Rs 8.5 Crore operational remediation charge, and discloses a contingent liability for DPDP regulatory inquiries.",
            "code": '''def evaluate_ransomware_incident_accounting(
    system_encrypted: bool,
    data_exfiltrated: bool,
    immutable_backup_restored: bool,
    transaction_gap_hours: int,
    reconstructed_loss_cr: float,
    forensic_and_legal_costs_cr: float,
    potential_dpdp_regulatory_penalty_cr: float,
    dpdp_penalty_probability_pct: float
) -> dict:
    total_immediate_loss_cr = reconstructed_loss_cr + forensic_and_legal_costs_cr
    
    # Ind AS 37 Provision vs Contingent Liability Evaluation
    # Probable (> 50%) -> Recognize Provision in P&L
    # Possible (10% to 50%) -> Disclose Contingent Liability in Notes
    if dpdp_penalty_probability_pct >= 50.0:
        regulatory_treatment = f"RECOGNIZE_IND_AS_37_PROVISION_OF_INR_{potential_dpdp_regulatory_penalty_cr}_CR"
        total_pnl_hit_cr = total_immediate_loss_cr + potential_dpdp_regulatory_penalty_cr
    else:
        regulatory_treatment = f"DISCLOSE_CONTINGENT_LIABILITY_IN_NOTES_INR_{potential_dpdp_regulatory_penalty_cr}_CR"
        total_pnl_hit_cr = total_immediate_loss_cr
        
    return {
        "double_extortion_active": data_exfiltrated,
        "backup_restoration_success": immutable_backup_restored,
        "transactional_gap_hours": transaction_gap_hours,
        "immediate_pnl_remediation_loss_cr": round(total_immediate_loss_cr, 2),
        "ind_as_37_regulatory_treatment": regulatory_treatment,
        "total_financial_statement_impact_cr": round(total_pnl_hit_cr, 2),
        "audit_opinion_impact": "UNMODIFIED_WITH_EOM_PARAGRAPH" if immutable_backup_restored else "DISCLAIMER_OF_OPINION_DESTROYED_RECORDS"
    }

ransom_audit = evaluate_ransomware_incident_accounting(
    system_encrypted=True,
    data_exfiltrated=True,
    immutable_backup_restored=True,
    transaction_gap_hours=48,
    reconstructed_loss_cr=1.2,
    forensic_and_legal_costs_cr=7.3,
    potential_dpdp_regulatory_penalty_cr=50.0,
    dpdp_penalty_probability_pct=35.0
)
print("Ransomware Double-Extortion & Ind AS 37 Accounting Engine:")
print(f"  Exfiltration Double-Extort: {ransom_audit['double_extortion_active']}")
print(f"  Backup Restored Success   : {ransom_audit['backup_restoration_success']}")
print(f"  Immediate Remediation Loss: INR {ransom_audit['immediate_pnl_remediation_loss_cr']} Crores")
print(f"  Ind AS 37 Penalty Action  : {ransom_audit['ind_as_37_regulatory_treatment']}")
print(f"  Total P&L Charge          : INR {ransom_audit['total_financial_statement_impact_cr']} Crores")
print(f"  Audit Reporting Mandate   : {ransom_audit['audit_opinion_impact']}")
''',
            "tryIt": "Set dpdp_penalty_probability_pct to 65.0 to observe how the regulatory penalty shifts from a footnote contingent liability to an active balance sheet provision under Ind AS 37.",
            "check": {
                "question": "Under Ind AS 37, when must an enterprise recognize a formal financial provision on the balance sheet for a potential regulatory penalty arising from a corporate cyber data breach?",
                "options": [
                    "When there is a present legal or constructive obligation as a result of a past event, it is probable (>50% likelihood) that an outflow of resources will be required, and a reliable estimate can be made",
                    "Only after the Chief Executive Officer pleads guilty in a court of law",
                    "Never, because cyber attacks are classified as acts of God",
                    "Only if the ransomware was written in Python"
                ],
                "answerIndex": 0,
                "why": "Ind AS 37 Paragraph 14 establishes the three criteria for recognizing a provision: present obligation, probable outflow (>50%), and reliable estimability."
            }
        },
        {
            "title": "CERT-In Mandatory 6-Hour Reporting Direction & Cyber Compliance",
            "say": [
                "In India, statutory reporting of cyber incidents is governed by the sweeping Cyber Security Directions issued by the Indian Computer Emergency Response Team (CERT-In) under Section 70B(6) of the Information Technology Act, 2000. These directives impose legally binding, time-critical obligations on all service providers, intermediaries, data centers, body corporates, and statutory auditors.",
                "The hallmark requirement is the Mandatory 6-Hour Reporting Window: Any service provider, intermediary, data center, or body corporate SHALL report specified cyber security incidents to CERT-In within SIX (6) HOURS of noticing or being brought to notice of such incidents. The specified reportable incidents span 20 categories, including: targeted scanning/probing of critical systems; compromise of critical systems/information; unauthorized access of IT systems/data; defacement of websites; malicious code attacks (ransomware); attacks on servers (database compromise); identity theft; spoofing and phishing attacks; and data breach or data leaks.",
                "Furthermore, CERT-In directions impose three additional compliance mandates: (1) Synchronization of system clocks with the National Physical Laboratory (NPL) or Network Time Protocol (NTP) servers of NIC; (2) Mandatory maintenance of system logs of all ICT systems for a rolling duration of 180 DAYS within Indian jurisdiction; and (3) Mandatory appointment of a designated Point of Contact (PoC) to interface with CERT-In 24/7.",
                "Failure to report a cyber incident within 6 hours carries criminal penalties under Section 70B(7) of the IT Act, including imprisonment for up to one year and statutory fines."
            ],
            "example": "At 2:00 AM on a Saturday, an enterprise intrusion detection system alerts the security operations center that an adversary has compromised the production ERP database. The incident response team confirms the breach at 2:30 AM. Under CERT-In directions, the official incident report must be transmitted to incident@cert-in.org.in before 8:30 AM (strictly within 6 hours). The statutory auditor verifies the timestamped CERT-In acknowledgment to confirm statutory legal compliance.",
            "code": '''def audit_cert_in_6_hour_compliance(
    incident_notice_time_ist: str, # "YYYY-MM-DD HH:MM"
    cert_in_filing_time_ist: str,
    incident_category: str,
    ntp_clock_sync_compliant: bool,
    logs_retained_180_days: bool
) -> dict:
    from datetime import datetime
    
    t_notice = datetime.strptime(incident_notice_time_ist, "%Y-%m-%d %H:%M")
    t_filing = datetime.strptime(cert_in_filing_time_ist, "%Y-%m-%d %H:%M")
    
    elapsed_hours = (t_filing - t_notice).total_seconds() / 3600.0
    is_6_hour_compliant = elapsed_hours <= 6.0
    is_fully_compliant = is_6_hour_compliant and ntp_clock_sync_compliant and logs_retained_180_days
    
    if is_fully_compliant:
        statutory_verdict = "CERT-IN_DIRECTIONS_FULLY_COMPLIANT_UNMODIFIED"
        legal_risk = "ZERO_STATUTORY_PENALTY_SAFE_HARBOR"
    elif not is_6_hour_compliant:
        statutory_verdict = f"NON_COMPLIANT_6_HOUR_VIOLATION: Reported in {elapsed_hours:.1f} hours (Limit: 6.0 hours)"
        legal_risk = "EXPOSURE_TO_SECTION_70B_7_CRIMINAL_PENALTY_AND_FINES"
    else:
        statutory_verdict = "NON_COMPLIANT: NTP Clock Sync or 180-Day Log Retention Omission"
        legal_risk = "REGULATORY_WARNING_AND_AUDIT_FINDING"
        
    return {
        "incident_category": incident_category,
        "elapsed_reporting_hours": round(elapsed_hours, 2),
        "met_6_hour_deadline": is_6_hour_compliant,
        "ntp_clock_sync": ntp_clock_sync_compliant,
        "log_retention_180_days": logs_retained_180_days,
        "statutory_compliance_status": statutory_verdict,
        "statutory_legal_exposure": legal_risk
    }

cert_in_audit = audit_cert_in_6_hour_compliance(
    incident_notice_time_ist="2026-05-12 02:30",
    cert_in_filing_time_ist="2026-05-12 07:15", # 4 hours 45 min elapsed
    incident_category="Compromise of Critical ERP Database & Ransomware Infiltration",
    ntp_clock_sync_compliant=True,
    logs_retained_180_days=True
)
print("CERT-In Cyber Security Directions Mandatory 6-Hour Audit Engine:")
print(f"  Incident Category     : {cert_in_audit['incident_category']}")
print(f"  Elapsed Reporting Time: {cert_in_audit['elapsed_reporting_hours']} hours (Limit: 6.0 hrs)")
print(f"  Within 6-Hour Deadline: {cert_in_audit['met_6_hour_deadline']}")
print(f"  NTP Clock Sync        : {cert_in_audit['ntp_clock_sync']}")
print(f"  180-Day Log Retention : {cert_in_audit['log_retention_180_days']}")
print(f"  Statutory Verdict     : {cert_in_audit['statutory_compliance_status']}")
print(f"  Legal Exposure Rating : {cert_in_audit['statutory_legal_exposure']}")
''',
            "tryIt": "Set cert_in_filing_time_ist to '2026-05-12 11:30' (9 hours elapsed) to observe Section 70B(7) criminal exposure trigger.",
            "check": {
                "question": "Under the CERT-In Cyber Security Directions issued under Section 70B of the IT Act, 2000, what is the mandatory time window within which a cyber incident must be reported to CERT-In?",
                "options": [
                    "Within six (6) hours of noticing or being brought to notice of such incidents",
                    "Within 30 days of the next board meeting",
                    "Within one calendar year",
                    "Only after the incident is reported in a national newspaper"
                ],
                "answerIndex": 0,
                "why": "CERT-In Cyber Directions Paragraph 2(i) explicitly mandates that all reportable cyber security incidents must be reported to CERT-In within 6 hours."
            }
        },
        {
            "title": "Comprehensive Cyber Incident Audit Dossier & Governance Sign-Off",
            "say": [
                "Synthesizing cyber incident auditing into the statutory financial audit file under SA 230 requires an exhaustive Cyber Incident & Resilience Audit Dossier. The engagement team must evaluate whether the cyber event compromised the truth and fairness of financial numbers or disrupted operational continuity.",
                "The dossier must assemble: (1) Technical Forensic Reports from independent incident response firms (Mandiant, CrowdStrike); (2) Evidence of timely CERT-In 6-hour filings and regulatory communications; (3) Reconciled general ledger balance sheets proving zero unrecorded asset destruction; (4) Quantitative assessments of Ind AS 37 provisions and DPDP regulatory exposures; and (5) The evaluation of Internal Financial Controls Over Financial Reporting (IFCoFR) under Section 143(3)(i).",
                "Completing this technical assurance guarantees that the statutory audit firm satisfies the rigorous inspection criteria of the National Financial Reporting Authority (NFRA), demonstrating unassailable cyber risk auditing rigor."
            ],
            "example": "The lead statutory auditor signs off on the cyber incident dossier for Apex Logistics: certifying that an April ransomware attack was contained, CERT-In was notified within 4 hours, backups were restored with zero ledger data loss, an Rs 8.5 Crore remediation expense was recorded in P&L, and IFCoFR controls operated effectively. The dossier is archived in the audit file.",
            "code": '''class CyberIncidentAuditDossier:
    def __init__(self, client_name: str, incident_date: str):
        self.client = client_name
        self.date = incident_date
        self.audit_checks = []
        
    def add_check(self, title: str, passed: bool, notes: str):
        self.audit_checks.append({
            "check": title,
            "passed": passed,
            "notes": notes
        })
        
    def generate_dossier_status(self) -> dict:
        total = len(self.audit_checks)
        passed_count = sum(1 for c in self.audit_checks if c["passed"])
        is_complete = total == passed_count
        
        return {
            "client": self.client,
            "incident_date": self.date,
            "total_checks": total,
            "passed_checks": passed_count,
            "dossier_sign_off_status": "CYBER_INCIDENT_AUDIT_DOSSIER_COMPLETE_AND_DEFENSIBLE" if is_complete else "REMEDIATION_REQUIRED_EVIDENCE_DEFICIENT",
            "checks_trace": self.audit_checks
        }

cyber_dossier = CyberIncidentAuditDossier("Apex Global Logistics Ltd", "2026-05-12")
cyber_dossier.add_check("CERT-In 6-Hour Timely Notification Verification", True, "Reported in 4.75 hours; acknowledgment on file.")
cyber_dossier.add_check("NIST CSF Incident Containment & Forensic Bitstream Imaging", True, "RAM and SSD images preserved under write-blockers.")
cyber_dossier.add_check("Immutable Offline Backup Restoration & Ledger Reconciliation", True, "Reconciled against 100% bank statements.")
cyber_dossier.add_check("Ind AS 37 Contingent Liability & Provision Evaluation", True, "Recorded INR 8.5 Cr expense; Note 39 disclosure verified.")
cyber_dossier.add_check("IFCoFR Section 143(3)(i) ITGC Control Deficiency Review", True, "Compensating controls verified; no material weakness.")

d_stat = cyber_dossier.generate_dossier_status()
print("Cyber Incident Audit Dossier & Governance Sign-Off Engine:")
print(f"  Client Name           : {d_stat['client']} (Incident: {d_stat['incident_date']})")
print(f"  Checks Verified       : {d_stat['passed_checks']}/{d_stat['total_checks']}")
print(f"  Dossier Status        : {d_stat['dossier_sign_off_status']}")
print("  Audit Verification Trail:")
for chk in d_stat['checks_trace']:
    print(f"    * {chk['check']}: Passed={chk['passed']} -> {chk['notes']}")
''',
            "tryIt": "Set passed to False for Ledger Reconciliation to observe how unreconciled records immediately block dossier sign-off.",
            "check": {
                "question": "What is the primary objective of assembling a Cyber Incident & Resilience Audit Dossier in a statutory financial audit?",
                "options": [
                    "To obtain sufficient appropriate audit evidence confirming that the cyber incident did not materially distort the financial statements, that statutory reporting (CERT-In) was executed, and that IFCoFR remained effective",
                    "To negotiate the cryptocurrency ransom with the hackers",
                    "To write malicious code to attack competitor companies",
                    "To sell confidential company data on the dark web"
                ],
                "answerIndex": 0,
                "why": "The audit dossier establishes that financial records remain complete, uncorrupted, and compliant with statutory reporting and internal financial control standards."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day27.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 27 base JSON created successfully.")
