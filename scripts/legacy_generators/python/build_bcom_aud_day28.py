"""
Build Day 28 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Artificial Intelligence, Machine Learning & Continuous Audit Analytics: Automated Anomaly Detection & AI Governance
"""
import json

day_data = {
    "day": 28,
    "title": "Artificial Intelligence & Continuous Audit Analytics: Automated Anomaly Detection & AI Governance",
    "parts": [
        {
            "title": "Continuous Auditing Architecture & 100% General Ledger Population Analytics",
            "say": [
                "Traditional statutory auditing relied on historical, retrospective sample testing conducted months after the financial year-end. In the modern era of high-frequency cloud transactions, enterprise resource planning (ERP) systems, and real-time payment rails, legacy sampling is scientifically obsolete. Leading assurance practices deploy Continuous Auditing & Continuous Monitoring (CA/CM) architectures powered by automated ETL (Extract, Transform, Load) pipelines and machine learning algorithms.",
                "Continuous auditing executes automated, rules-based and statistical tests across 100% of the population of general ledger transactions in real-time or near-real-time. Rather than sampling 100 vouchers out of 500,000, the continuous audit engine ingests every single journal entry, sales invoice, purchase order, bank credit, and vendor disbursement the moment it is posted in the ERP database.",
                "The continuous audit engine evaluates transactions against four deterministic forensic screening vectors: (1) Out-of-Sequence Numbering—identifying gaps in serial document sequences that signal unrecorded sales or off-book cash receipts; (2) Time-of-Posting Anomalies—flagging transactions posted at 2:00 AM on Sundays or national holidays when finance staff are absent; (3) User Authorization Collisions—detecting transactions where the creator (maker) and approver (checker) share the same user ID or where permissions bypass segregation of duties; and (4) Value Clustering—detecting concentrations of transactions just below delegated financial authority thresholds (e.g., invoices for Rs 4,95,000 when approval limits are Rs 5,00,000).",
                "Continuous auditing shifts the assurance paradigm from post-mortem detection to active deterrence."
            ],
            "example": "A nationwide retail chain processing 15 million annual transactions deploys a continuous auditing bot. Every night at midnight, the bot extracts the daily transaction ledger from SAP HANA. Within 4 minutes, the engine flags 12 purchase orders totaling Rs 58 Lakh that were approved by the creator without secondary review, and 8 invoices split into Rs 4,90,000 chunks to bypass director approvals. The automated alert is routed directly to the Chief Audit Executive for immediate investigation.",
            "code": '''def execute_continuous_audit_100pct_screening(
    total_ledger_entries: int,
    sample_vouchers: list
) -> dict:
    flagged_anomalies = []
    
    for v in sample_vouchers:
        flags = []
        # Vector 1: Split transactions just below approval limits (Limit = 500,000)
        if 480000 <= v["amount_inr"] < 500000:
            flags.append("THRESHOLD_STRUCTURING_SPLIT_INVOICE")
            
        # Vector 2: Maker-Checker Segregation of Duties bypass
        if v["maker_id"] == v["checker_id"]:
            flags.append("SOD_VIOLATION_SELF_APPROVED_VOUCHER")
            
        # Vector 3: Off-hours posting (post midnight or weekends)
        if v["is_weekend"] or v["posting_hour"] < 6 or v["posting_hour"] > 22:
            flags.append("OFF_HOURS_UNUSUAL_POSTING_TIME")
            
        if flags:
            flagged_anomalies.append({
                "voucher_id": v["id"],
                "amount_inr": v["amount_inr"],
                "flags": flags,
                "risk_tier": "CRITICAL" if len(flags) >= 2 else "ELEVATED"
            })
            
    flagged_amount = sum(a["amount_inr"] for a in flagged_anomalies)
    anomaly_rate = (len(flagged_anomalies) / len(sample_vouchers) * 100.0) if sample_vouchers else 0.0
    
    return {
        "total_population_screened": total_ledger_entries,
        "sample_batch_size": len(sample_vouchers),
        "anomalies_flagged_count": len(flagged_anomalies),
        "total_anomalous_exposure_inr": flagged_amount,
        "batch_anomaly_rate_pct": round(anomaly_rate, 2),
        "engine_verdict": "HIGH_RISK_EXCEPTIONS_IDENTIFIED_INVESTIGATE" if flagged_anomalies else "CLEAN_CONTINUOUS_STREAM",
        "flagged_entries": flagged_anomalies
    }

test_vouchers = [
    {"id": "JV-901", "amount_inr": 495000, "maker_id": "USR-101", "checker_id": "USR-101", "is_weekend": True, "posting_hour": 2},
    {"id": "JV-902", "amount_inr": 125000, "maker_id": "USR-102", "checker_id": "USR-105", "is_weekend": False, "posting_hour": 14},
    {"id": "JV-903", "amount_inr": 489000, "maker_id": "USR-103", "checker_id": "USR-106", "is_weekend": False, "posting_hour": 16}
]

ca_res = execute_continuous_audit_100pct_screening(total_ledger_entries=850000, sample_vouchers=test_vouchers)
print("Continuous Auditing & 100% General Ledger Screening Engine:")
print(f"  Total Ingested Population : {ca_res['total_population_screened']:,} vouchers")
print(f"  Anomalies Flagged         : {ca_res['anomalies_flagged_count']} ({ca_res['batch_anomaly_rate_pct']}% anomaly rate)")
print(f"  Anomalous Financial Amount: INR {ca_res['total_anomalous_exposure_inr']:,.2f}")
print(f"  Continuous Audit Verdict  : {ca_res['engine_verdict']}")
print("  Flagged Anomaly Audit Trace:")
for a in ca_res['flagged_entries']:
    print(f"    * {a['voucher_id']} (INR {a['amount_inr']:,.2f}) [{a['risk_tier']}] -> {a['flags']}")
''',
            "tryIt": "Modify JV-901 so maker_id != checker_id, is_weekend=False, and posting_hour=11 to observe the flags clear.",
            "check": {
                "question": "What is the primary operational advantage of Continuous Auditing over traditional retrospective audit sampling?",
                "options": [
                    "It analyzes 100% of transactions in real-time or near-real-time, immediately alerting auditors to control breaches, threshold structuring, and segregation of duties violations",
                    "It replaces the need to pay statutory corporate taxes",
                    "It allows companies to eliminate all accounting staff",
                    "It ensures that company stock prices never decline"
                ],
                "answerIndex": 0,
                "why": "Continuous auditing eliminates sampling risk by screening 100% of transactions in near-real-time, enabling proactive detection of fraud and control breakdowns."
            }
        },
        {
            "title": "Unsupervised Machine Learning & Isolation Forests in Audit Anomaly Detection",
            "say": [
                "While deterministic rules catch known red flags, sophisticated fraud schemes are designed specifically to bypass predictable rules. To detect novel, unknown fraud patterns, forensic assurance deploys Unsupervised Machine Learning algorithms—most notably Isolation Forests and Robust Z-Scores.",
                "The Isolation Forest algorithm operates on the mathematical premise that anomalies are 'few and different'. Unlike traditional clustering algorithms (such as K-Means or DBSCAN) which construct normal data clusters, an Isolation Forest isolates anomalies by randomly partitioning feature dimensions using decision trees (isolation trees). Because anomalous data points possess unusual attribute combinations (e.g., abnormal invoice amount combined with unusual vendor category, off-hours posting, and uncharacteristic ledger accounts), they require significantly fewer recursive splits to be isolated at shallow tree depths.",
                "The anomaly score $s(x, n)$ ranges from 0 to 1: a score close to 1 indicates a definite anomaly; a score less than 0.5 indicates normal data; and a score around 0.5 indicates an ambiguous boundary. Transactions with anomaly scores exceeding 0.70 are automatically extracted into the High-Risk Audit Queue.",
                "The auditor must validate the mathematical calibration of algorithm hyperparameters (contamination factor, number of trees) and document the algorithmic audit evidence in accordance with SA 500."
            ],
            "example": "In an audit of 250,000 vendor payments, management claims all transactions complied with corporate policy. The audit team runs an Isolation Forest model using 5 features (amount, vendor age, days to payment, processing hour, and cost center variance). The algorithm isolates 14 transactions with anomaly scores of 0.88 to 0.94: all were payments to newly onboarded marketing vendors approved within 8 minutes of invoice generation. Substantive inspection reveals these were sham shell vendor payments, exposing an Rs 8.5 Crore embezzlement scheme.",
            "code": '''def simulate_isolation_forest_anomaly_scoring(
    voucher_records: list,
    contamination_threshold: float = 0.70
) -> dict:
    scored_records = []
    
    for v in voucher_records:
        # Simulate tree path length calculation across 5 feature dimensions
        # Features: amount_zscore, vendor_tenure_days, approval_latency_mins, cost_center_variance_pct
        z = abs(v.get("amount_zscore", 0.0))
        tenure = v.get("vendor_tenure_days", 365)
        latency = v.get("approval_latency_mins", 120)
        variance = abs(v.get("budget_variance_pct", 0.0))
        
        # Anomaly heuristic: High z-score, new vendor (<30 days), near-zero latency (<15 min), high variance (>50%)
        anomaly_score = (
            (min(1.0, z / 4.0) * 0.35) +
            (max(0.0, (180.0 - tenure) / 180.0) * 0.25) +
            (max(0.0, (60.0 - latency) / 60.0) * 0.20) +
            (min(1.0, variance / 100.0) * 0.20)
        )
        anomaly_score = min(1.0, max(0.0, anomaly_score))
        
        is_isolated_anomaly = anomaly_score >= contamination_threshold
        
        scored_records.append({
            "id": v["id"],
            "amount_cr": v["amount_cr"],
            "anomaly_score": round(anomaly_score, 3),
            "is_anomaly": is_isolated_anomaly,
            "risk_verdict": "CRITICAL_ISOLATION_FOREST_OUTLIER" if is_isolated_anomaly else "NORMAL_TRANSACTION"
        })
        
    flagged = [r for r in scored_records if r["is_anomaly"]]
    
    return {
        "total_records_processed": len(voucher_records),
        "anomalies_isolated_count": len(flagged),
        "contamination_threshold": contamination_threshold,
        "highest_anomaly_score": max((r["anomaly_score"] for r in scored_records), default=0.0),
        "flagged_anomalies": flagged
    }

vouchers_data = [
    {"id": "TX-101", "amount_cr": 8.5, "amount_zscore": 3.8, "vendor_tenure_days": 12, "approval_latency_mins": 6, "budget_variance_pct": 85.0},
    {"id": "TX-102", "amount_cr": 0.45, "amount_zscore": 0.4, "vendor_tenure_days": 1200, "approval_latency_mins": 240, "budget_variance_pct": 2.0},
    {"id": "TX-103", "amount_cr": 6.2, "amount_zscore": 3.2, "vendor_tenure_days": 18, "approval_latency_mins": 9, "budget_variance_pct": 72.0}
]

if_res = simulate_isolation_forest_anomaly_scoring(vouchers_data, contamination_threshold=0.70)
print("Unsupervised Isolation Forest Audit Anomaly Detection Engine:")
print(f"  Total Ingested Records: {if_res['total_records_processed']}")
print(f"  Isolated Anomalies    : {if_res['anomalies_isolated_count']} (Max Score: {if_res['highest_anomaly_score']})")
print(f"  Contamination Cutoff  : >= {if_res['contamination_threshold']}")
print("  Isolated Outlier Transactions:")
for out in if_res['flagged_anomalies']:
    print(f"    * {out['id']} (INR {out['amount_cr']} Cr): Score={out['anomaly_score']} -> [{out['risk_verdict']}]")
''',
            "tryIt": "Set vendor_tenure_days to 500 and budget_variance_pct to 5.0 for TX-101 to observe its anomaly score drop below 0.50.",
            "check": {
                "question": "Why is the Isolation Forest algorithm particularly effective for financial fraud detection in auditing?",
                "options": [
                    "Because anomalies are 'few and different', requiring fewer recursive splits in isolation trees to be isolated at shallow tree depths compared to normal transactions",
                    "Because it is written in Java rather than Python",
                    "Because it only runs on computers located in forests",
                    "Because it requires zero mathematical understanding"
                ],
                "answerIndex": 0,
                "why": "Isolation Forests isolate outliers by exploiting their sparsity and unusual attribute combinations, requiring fewer partitions than normal cluster points."
            }
        },
        {
            "title": "Auditing Artificial Intelligence Systems & Algorithms: AI Governance & Bias",
            "say": [
                "As commercial enterprises increasingly deploy Artificial Intelligence (AI) and Machine Learning (ML) models to automate financial decisions—such as algorithmic revenue recognition, automated credit card credit limit underwriting, automated stock trading, and automated inventory reordering—the statutory auditor faces a profound responsibility: Auditing the AI Systems themselves.",
                "Auditing AI systems requires evaluating three critical pillars of AI Governance: (1) Data Integrity & Training Set Bias—verifying that the training datasets used to train models are complete, accurate, free from historical discriminatory bias, and representative of current operating realities (auditing IPE - Information Produced by the Entity under SA 500); (2) Model Explainability & Interpretability—ensuring that AI algorithms are not opaque 'black boxes'; the auditor must verify that management can explain the deterministic weights, feature importances, and decision logic (using SHAP - Shapley Additive Explanations or LIME); and (3) Algorithmic Drift & Performance Monitoring—verifying that models are continuously monitored for Data Drift and Concept Drift (e.g., changes in customer default rates post-macroeconomic shifts) and are regularly recalibrated.",
                "If management relies on an automated AI engine to record financial estimates (such as ECL provisions under Ind AS 109) but cannot explain model logic or demonstrate validation, the auditor must treat the model as an unverified internal control failure, potentially qualifying IFCoFR under Section 143(3)(i)."
            ],
            "example": "A fintech lender automates loan loss provisioning under Ind AS 109 using a deep neural network. The statutory audit team contracts AI auditing specialists under SA 620. The specialists evaluate model explainability: generating SHAP value plots to confirm that loan default probability is driven by verified income and repayment history rather than arbitrary proxy variables. The team verifies that data drift metrics (Population Stability Index - PSI) remained below 0.10 throughout the year, confirming model stability.",
            "code": '''def audit_enterprise_ai_model_governance(
    model_name: str,
    training_data_tested_for_bias: bool,
    model_explainability_framework_used: str, # "SHAP", "LIME", "NONE_BLACK_BOX"
    population_stability_index_psi: float, # PSI < 0.10: Stable; > 0.25: Significant Drift
    independent_model_validation_performed: bool
) -> dict:
    has_explainability = model_explainability_framework_used.upper() in ["SHAP", "LIME"]
    has_no_drift = population_stability_index_psi < 0.10
    
    is_governance_sound = (
        training_data_tested_for_bias and 
        has_explainability and 
        has_no_drift and 
        independent_model_validation_performed
    )
    
    if is_governance_sound:
        audit_verdict = "AI_MODEL_GOVERNANCE_ROBUST_RELIANCE_PERMITTED"
        ifcofr_status = "IFCOFR_AUTOMATED_CONTROLS_OPERATING_EFFECTIVELY"
    elif not has_explainability:
        audit_verdict = "OPAQUE_BLACK_BOX_MODEL_RELIANCE_PROHIBITED_UNDER_SA500"
        ifcofr_status = "MATERIAL_WEAKNESS_IN_AUTOMATED_FINANCIAL_REPORTING"
    elif not has_no_drift:
        audit_verdict = f"SIGNIFICANT_ALGORITHMIC_DRIFT_DETECTED (PSI: {population_stability_index_psi:.2f})"
        ifcofr_status = "SIGNIFICANT_DEFICIENCY_RECALIBRATION_MANDATED"
    else:
        audit_verdict = "INSUFFICIENT_MODEL_VALIDATION_EXPAND_SUBSTANTIVE_TESTING"
        ifcofr_status = "CONTROL_DEFICIENCY"
        
    return {
        "model_audited": model_name,
        "explainability_tool": model_explainability_framework_used,
        "psi_drift_metric": population_stability_index_psi,
        "governance_compliant": is_governance_sound,
        "ai_audit_verdict": audit_verdict,
        "ifcofr_impact": ifcofr_status
    }

ai_eval = audit_enterprise_ai_model_governance(
    model_name="Ind AS 109 Automated ECL Neural Provisioning Engine",
    training_data_tested_for_bias=True,
    model_explainability_framework_used="SHAP",
    population_stability_index_psi=0.065, # Highly stable
    independent_model_validation_performed=True
)
print("Enterprise AI System Governance & Model Audit Engine:")
print(f"  Model Under Audit     : {ai_eval['model_audited']}")
print(f"  Explainability Tool   : {ai_eval['explainability_tool']}")
print(f"  Population Drift (PSI): {ai_eval['psi_drift_metric']} (Stable < 0.10)")
print(f"  Governance Compliant  : {ai_eval['governance_compliant']}")
print(f"  AI Audit Verdict      : {ai_eval['ai_audit_verdict']}")
print(f"  IFCoFR Impact         : {ai_eval['ifcofr_impact']}")
''',
            "tryIt": "Set model_explainability_framework_used to 'NONE_BLACK_BOX' to observe how opaque models immediately trigger an IFCoFR material weakness.",
            "check": {
                "question": "Why is model explainability (such as SHAP or LIME) essential when auditing automated AI algorithms used for financial statement reporting?",
                "options": [
                    "To prove that the AI model is not an opaque 'black box', allowing auditors to understand the feature weights and mathematical logic driving financial figures under SA 500",
                    "To teach the AI model how to play chess",
                    "To translate the computer code into French",
                    "Because explainability allows computers to run without electricity"
                ],
                "answerIndex": 0,
                "why": "Auditors cannot obtain reasonable assurance on unexplainable black-box models; explainability frameworks provide the verifiable mathematical logic required under SA 500."
            }
        },
        {
            "title": "Automated Audit Trail Log Verification: Rule 11(g) Compliance Analytics",
            "say": [
                "Under Rule 11(g) of the Companies (Audit and Auditors) Rules, 2014, the statutory auditor must evaluate whether the company used accounting software with an Audit Trail (edit log) feature that operated continuously throughout the financial year without tampering. Manual verification of audit logs across hundreds of tables and millions of rows is impossible; statutory auditors deploy Automated Log Analytics Engines.",
                "The automated log analyzer executes five exhaustive verification checks: (1) Logging Status Continuity Check—verifying database configuration flags (e.g., Oracle Flashback Data Archive, SQL Server Change Data Capture CDC, or SAP CDHDR/CDPOS tables) to confirm logging was never disabled for even a single minute; (2) Tampering & Drop Table Detection—querying database schema logs for 'TRUNCATE TABLE', 'DROP TABLE', or direct SQL backend updates that bypassed the application layer; (3) Log Timestamp Monotonicity—verifying that log timestamps progress sequentially without gaps or overlaps; (4) User Privilege Separation—confirming that database administrators (DBAs) could not modify log records without leaving independent meta-audit trails; and (5) Preservation & Archival—confirming that audit logs are retained for the statutory 8-year period required by Section 128(5) of the Companies Act.",
                "If an entity disabled its audit trail during year-end adjustments or cannot prove log immutability, the auditor is legally compelled to issue an adverse qualification in the statutory report under Section 143(3) and Rule 11(g)."
            ],
            "example": "In auditing an automotive retailer's billing software, the automated log engine scans 1.8 million log entries across 12 months. The engine discovers that on March 29, database audit logging was administratively turned off for 3 hours, during which 45 invoices totaling Rs 12 Crore were altered before logging was re-enabled. The auditor issues an adverse statutory report under Rule 11(g), detailing the 3-hour logging blackout and reporting the matter under Section 143(12).",
            "code": '''def analyze_rule11g_audit_trail_database_logs(
    database_platform: str,
    total_log_records: int,
    logging_disabled_instances_count: int,
    unauthorized_backend_direct_edits_count: int,
    log_tampering_identified: bool,
    retention_period_years: int
) -> dict:
    is_continuous = (logging_disabled_instances_count == 0)
    is_untampered = not log_tampering_identified and (unauthorized_backend_direct_edits_count == 0)
    is_retention_compliant = (retention_period_years >= 8)
    
    is_rule11g_compliant = is_continuous and is_untampered and is_retention_compliant
    
    if is_rule11g_compliant:
        audit_verdict = "RULE_11(G)_FULLY_COMPLIANT_UNMODIFIED_STATUTORY_REMARK"
        report_text = (
            "The Company has used accounting software for maintaining its books of account which has a feature of recording "
            "audit trail (edit log) facility and the same has operated throughout the year for all relevant transactions recorded "
            "in the software. Further, during the course of our audit, we did not come across any instances of the audit trail "
            "feature being tampered with."
        )
    else:
        audit_verdict = "RULE_11(G)_ADVERSE_QUALIFICATION_MANDATED"
        report_text = (
            f"The Company's accounting software audit trail (edit log) feature was NOT operated continuously throughout the year. "
            f"Specifically, logging was disabled on {logging_disabled_instances_count} occasion(s) and {unauthorized_backend_direct_edits_count} "
            f"unauthorized direct backend modification(s) were identified."
        )
        
    return {
        "database": database_platform,
        "logs_screened": total_log_records,
        "continuous_operation": is_continuous,
        "log_integrity_preserved": is_untampered,
        "retention_compliant": is_retention_compliant,
        "rule11g_verdict": audit_verdict,
        "statutory_report_disclosure": report_text
    }

log_audit_res = analyze_rule11g_audit_trail_database_logs(
    database_platform="SAP HANA Enterprise Cluster",
    total_log_records=1850000,
    logging_disabled_instances_count=0,
    unauthorized_backend_direct_edits_count=0,
    log_tampering_identified=False,
    retention_period_years=8
)
print("Rule 11(g) Continuous Audit Trail Log Verification Engine:")
print(f"  Database Scanned      : {log_audit_res['database']} ({log_audit_res['logs_screened']:,} log events)")
print(f"  Continuous Operation  : {log_audit_res['continuous_operation']}")
print(f"  Log Tampering Clear   : {log_audit_res['log_integrity_preserved']}")
print(f"  8-Year Retention Met  : {log_audit_res['retention_compliant']}")
print(f"  Rule 11(g) Verdict    : {log_audit_res['rule11g_verdict']}")
print("  Statutory Audit Report Remark:")
print(f"  \"{log_audit_res['statutory_report_disclosure']}\"")
''',
            "tryIt": "Set logging_disabled_instances_count to 2 to observe Rule 11(g) trigger an immediate adverse statutory qualification.",
            "check": {
                "question": "Under Rule 11(g) of the Companies (Audit and Auditors) Rules, 2014, what is the statutory standard for the operation of the audit trail (edit log) feature in accounting software?",
                "options": [
                    "The audit trail feature must have operated continuously throughout the entire year for all transactions recorded in the software, without being disabled or tampered with",
                    "The audit trail only needs to operate on the last day of the fiscal year",
                    "The audit trail can be deleted every Friday afternoon to save hard drive space",
                    "Audit trail logging is voluntary for companies with female directors"
                ],
                "answerIndex": 0,
                "why": "Rule 11(g) explicitly mandates that the audit trail feature must operate continuously throughout the year without tampering for all transactions."
            }
        },
        {
            "title": "Comprehensive AI & Analytics Audit Dossier & Technical Validation",
            "say": [
                "The synthesis of Continuous Auditing, Machine Learning Anomaly Detection, AI Governance, and Rule 11(g) Audit Trail verification culminates in the assembly of the AI & Continuous Analytics Audit Dossier under SA 230 and SA 500. This dossier documents the modern technological foundation of the statutory assurance engagement.",
                "The dossier must assemble: (1) The Continuous Auditing Ingestion & Screening Reports covering 100% of general ledger transactions; (2) The Unsupervised Isolation Forest Model Hyperparameters, Anomaly Cutoffs, and High-Risk Queue Resolution Sheets; (3) The AI Governance & Explainability (SHAP/LIME) Reports validating automated management models; and (4) The Rule 11(g) Automated Database Log Inspection Certification confirming continuous, untampered edit logging.",
                "Completing this technical validation proves that the statutory audit firm leverages cutting-edge artificial intelligence to deliver unyielding audit rigor, satisfying the highest standards of the National Financial Reporting Authority (NFRA).",
                "This technical capability elevates the practitioner to the leading frontier of modern algorithmic auditing."
            ],
            "example": "The lead technical assurance partner reviews the AI and analytics dossier for Apex Financial: verifying that 100% of general ledger transactions were screened, 4 Isolation Forest anomalies were resolved, the automated Ind AS 109 credit loss model was validated using SHAP values, and Rule 11(g) SAP audit logs were verified across 12 months with zero tampering. The partner signs off on the dossier.",
            "code": '''class AIAndAnalyticsAuditDossierEngine:
    def __init__(self, client_name: str, fy: str):
        self.client = client_name
        self.fy = fy
        self.tech_checkpoints = []
        
    def add_tech_checkpoint(self, name: str, is_validated: bool, algorithmic_framework: str):
        self.tech_checkpoints.append({
            "checkpoint": name,
            "validated": is_validated,
            "framework": algorithmic_framework
        })
        
    def generate_analytics_sign_off(self) -> dict:
        total = len(self.tech_checkpoints)
        valid_count = sum(1 for c in self.tech_checkpoints if c["validated"])
        is_ready = total == valid_count
        
        return {
            "client": self.client,
            "fiscal_period": self.fy,
            "total_analytics_checkpoints": total,
            "validated_checkpoints": valid_count,
            "ai_dossier_status": "AI_AUDIT_DOSSIER_CERTIFIED_DEFENSIBLE" if is_ready else "ANALYTICS_VALIDATION_INCOMPLETE",
            "checkpoints_detail": self.tech_checkpoints
        }

dossier_ai = AIAndAnalyticsAuditDossierEngine("Apex Global Financial Services Ltd", "FY 2025-26")
dossier_ai.add_tech_checkpoint("100% General Ledger Continuous Auditing Pipeline", True, "CA/CM Automated ETL Stream")
dossier_ai.add_tech_checkpoint("Unsupervised Isolation Forest Fraud Anomaly Screening", True, "Scikit-Learn IsolationForest (Contamination 0.01)")
dossier_ai.add_tech_checkpoint("Ind AS 109 ECL Model Explainability & Drift Audit", True, "SHAP Feature Attribution & PSI Drift Tracking")
dossier_ai.add_tech_checkpoint("Rule 11(g) Continuous Audit Trail Database Log Verification", True, "Oracle CDC Log Monotonicity Analyzer")

ai_signoff = dossier_ai.generate_analytics_sign_off()
print("AI & Continuous Analytics Audit Dossier Sign-Off Engine:")
print(f"  Client Name           : {ai_signoff['client']} ({ai_signoff['fiscal_period']})")
print(f"  Checkpoints Validated : {ai_signoff['validated_checkpoints']}/{ai_signoff['total_analytics_checkpoints']}")
print(f"  Dossier Status        : {ai_signoff['ai_dossier_status']}")
print("  Analytics Framework Verification Trace:")
for cp in ai_signoff['checkpoints_detail']:
    print(f"    * {cp['checkpoint']}: Validated={cp['validated']} [{cp['framework']}]")
''',
            "tryIt": "Set is_validated to False for Rule 11(g) check to observe how the AI dossier sign-off is immediately blocked.",
            "check": {
                "question": "What is the primary role of assembling an AI & Continuous Analytics Audit Dossier under SA 230?",
                "options": [
                    "To document the scientific methodologies, algorithmic hyperparameters, explainability validations, and continuous log verifications supporting the audit opinion",
                    "To sell algorithmic trading bots to retail investors",
                    "To generate fake marketing videos using generative AI",
                    "To reduce electricity consumption in the audit firm's cafeteria"
                ],
                "answerIndex": 0,
                "why": "The dossier provides the permanent evidentiary audit trail required under SA 230 and SA 500, proving that algorithmic tools were calibrated, validated, and sound."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day28.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 28 base JSON created successfully.")
