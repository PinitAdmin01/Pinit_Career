"""
Build Day 18 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Subsequent Events & Post-Balance Sheet Discoveries: SA 560 & Ind AS 10
"""
import json

day_data = {
    "day": 18,
    "title": "Subsequent Events, Dual Dating & Post-Issuance Discovery: SA 560 & Ind AS 10",
    "parts": [
        {
            "title": "Subsequent Events Framework: SA 560 & Ind AS 10 Classification",
            "say": [
                "Standard on Auditing (SA) 560, 'Subsequent Events', deals with the auditor's responsibilities relating to subsequent events in an audit of financial statements. Financial statements are prepared for a financial year ending on a specific balance sheet date (e.g., March 31). However, significant economic events, legal disputes, natural disasters, and commercial transactions frequently occur between the date of the financial statements and the date on which the financial statements and auditor's report are authorized and issued.",
                "Under Ind AS 10 (Events after the Reporting Period), subsequent events are classified into two distinct statutory categories: (1) Adjusting Events—events that provide additional evidence of conditions that existed at the balance sheet date. These events require management to adjust the amounts recognized in the financial statements (e.g., the bankruptcy of a major debtor post-March 31 confirming that trade receivables were uncollectible at year-end; the final court settlement of a pending lawsuit that confirms a pre-existing legal obligation; or the determination post-year-end of the cost of assets purchased or proceeds of assets sold before year-end); and (2) Non-Adjusting Events—events that are indicative of conditions that arose after the balance sheet date. These events do not require adjustment of financial statement amounts, but if material, non-disclosure could influence the economic decisions of users, requiring comprehensive note disclosure (e.g., the destruction of a major production facility by fire in April; a major corporate acquisition announced in May; or a sudden collapse in market share due to foreign regulatory bans).",
                "SA 560 establishes three distinct time horizons with varying auditor obligations: Period 1—Events occurring between the balance sheet date and the date of the auditor's report (active auditor duty to perform procedures to identify all material events); Period 2—Facts which become known to the auditor after the date of the auditor's report but before the date the financial statements are issued; and Period 3—Facts which become known to the auditor after the financial statements have been issued.",
                "The auditor must obtain sufficient appropriate audit evidence that all events occurring up to the date of the auditor's report that require adjustment or disclosure have been identified."
            ],
            "example": "A pharmaceutical manufacturer reporting on March 31 carries Rs 45 Crore in trade receivables due from an overseas distributor. On April 18 (prior to the signing of the audit report on May 10), the distributor files for Chapter 11 bankruptcy due to long-standing operational insolvency. Because the financial distress existed on March 31, this is an Adjusting Event under Ind AS 10. The auditor mandates a 100% ECL impairment provision of Rs 45 Crore in the March 31 financial statements.",
            "code": '''def classify_indas10_subsequent_event(
    event_description: str,
    event_date: str, # "YYYY-MM-DD"
    balance_sheet_date: str,
    audit_report_date: str,
    financial_impact_cr: float,
    condition_existed_at_balance_sheet_date: bool,
    performance_materiality_cr: float
) -> dict:
    is_period_1 = balance_sheet_date < event_date <= audit_report_date
    is_material = financial_impact_cr >= performance_materiality_cr
    
    if condition_existed_at_balance_sheet_date:
        ind_as_classification = "ADJUSTING_EVENT (Ind AS 10)"
        accounting_action = f"MANDATORY_BALANCE_SHEET_ADJUSTMENT_OF_INR_{financial_impact_cr}_CR"
        audit_requirement = "PROPOSE_AUDIT_ADJUSTMENT_AND_RECALCULATE_FINANCIALS"
    else:
        ind_as_classification = "NON_ADJUSTING_EVENT (Ind AS 10)"
        accounting_action = "DISCLOSURE_IN_NOTES_TO_ACCOUNTS_IF_MATERIAL" if is_material else "NO_ACTION_REQUIRED"
        audit_requirement = "VERIFY_DISCLOSURE_NOTE_NATURE_AND_ESTIMATED_FINANCIAL_EFFECT" if is_material else "DOCUMENT_IN_FILE"
        
    return {
        "event": event_description,
        "event_date": event_date,
        "occurred_in_period_1": is_period_1,
        "financial_impact_cr": financial_impact_cr,
        "is_material": is_material,
        "indas10_category": ind_as_classification,
        "mandated_financial_reporting": accounting_action,
        "mandated_audit_procedure": audit_requirement
    }

sub_event_1 = classify_indas10_subsequent_event(
    event_description="Major Debtor Insolvency Filing in Court",
    event_date="2026-04-18",
    balance_sheet_date="2026-03-31",
    audit_report_date="2026-05-10",
    financial_impact_cr=45.0,
    condition_existed_at_balance_sheet_date=True,
    performance_materiality_cr=15.0
)

sub_event_2 = classify_indas10_subsequent_event(
    event_description="Warehouse Fire Destroying Raw Material Inventory",
    event_date="2026-04-25",
    balance_sheet_date="2026-03-31",
    audit_report_date="2026-05-10",
    financial_impact_cr=35.0,
    condition_existed_at_balance_sheet_date=False,
    performance_materiality_cr=15.0
)

print("Ind AS 10 & SA 560 Subsequent Events Classification Engine:")
for res in [sub_event_1, sub_event_2]:
    print(f"  Event: {res['event']} (Date: {res['event_date']})")
    print(f"    * Classification: {res['indas10_category']}")
    print(f"    * Materiality   : INR {res['financial_impact_cr']} Cr (Material: {res['is_material']})")
    print(f"    * Action        : {res['mandated_financial_reporting']}")
    print(f"    * Audit Mandate : {res['mandated_audit_procedure']}")
''',
            "tryIt": "Set financial_impact_cr to 5.0 for the warehouse fire to observe how immaterial non-adjusting events do not require financial note disclosure.",
            "check": {
                "question": "Under Ind AS 10 and SA 560, what is the mandatory accounting treatment for a subsequent event occurring in April that provides evidence of conditions that already existed on March 31?",
                "options": [
                    "It is an Adjusting Event requiring management to adjust the figures recognized in the balance sheet and profit and loss statement as of March 31",
                    "It is a Non-Adjusting Event that cannot be mentioned anywhere in the financial statements",
                    "It can only be recorded in the subsequent fiscal year's income tax return",
                    "It requires the auditor to immediately resign from the audit engagement"
                ],
                "answerIndex": 0,
                "why": "Ind AS 10 explicitly defines adjusting events as those providing additional evidence of conditions existing at the reporting date, requiring restatement/adjustment of the year-end financial figures."
            }
        },
        {
            "title": "Auditor's Active Procedures in Period 1: Up to Auditor's Report Date",
            "say": [
                "During Period 1 (between the balance sheet date and the date of the auditor's report), the auditor has an affirmative statutory duty to design and perform procedures to identify all subsequent events that require adjustment of, or disclosure in, the financial statements. The auditor shall not rely solely on management's verbal assurances.",
                "SA 560 Paragraph 6 outlines specific mandatory procedures that the auditor shall perform as near as practicable to the date of the auditor's report: (1) Obtaining an understanding of any procedures management has established to ensure that subsequent events are identified; (2) Inquiring of management and Those Charged With Governance (TCWG) as to whether any subsequent events have occurred which might affect the financial statements (such as new commitments, borrowings, guarantees, sales of assets, increases in capital, or issues of debt instruments); (3) Reading minutes of the meetings of shareholders, board of directors, and audit committees held after the balance sheet date, and inquiring about matters discussed at meetings for which minutes are not yet available; (4) Reading the entity's latest available subsequent interim financial statements, management accounts, and cash flow forecasts; and (5) Inquiring of the entity's legal counsel regarding litigation, claims, and assessments.",
                "Furthermore, the auditor must obtain written representations under SA 580 from management and TCWG stating that all events occurring subsequent to the date of the financial statements and for which Ind AS requires adjustment or disclosure have been adjusted or disclosed.",
                "If management fails to adjust the financial statements for an adjusting event or fails to disclose a material non-adjusting event, the auditor must evaluate the effect under SA 450 and modify the audit opinion under SA 705."
            ],
            "example": "On May 5, while finalizing the audit report dated May 10, the audit senior reads the minutes of the Board meeting held on April 28. The minutes reveal that the Board approved the private placement issuance of Rs 500 Crore in compulsory convertible debentures (CCDs) to dilute equity by 18%. This major capital restructuring was not disclosed in the draft financial statements. The auditor requests management to insert a comprehensive subsequent event note under Ind AS 10. Management complies, avoiding an audit opinion qualification.",
            "code": '''class SA560Period1AuditChecklist:
    def __init__(self, client_name: str, report_date: str):
        self.client_name = client_name
        self.report_date = report_date
        self.procedures = []
        
    def add_procedure(self, name: str, executed: bool, findings_identified: bool, notes: str):
        self.procedures.append({
            "procedure_name": name,
            "executed": executed,
            "findings": findings_identified,
            "notes": notes
        })
        
    def evaluate_period_1_readiness(self) -> dict:
        total_p = len(self.procedures)
        executed_p = sum(1 for p in self.procedures if p["executed"])
        findings_count = sum(1 for p in self.procedures if p["findings"])
        
        all_executed = total_p == executed_p
        
        if all_executed and findings_count == 0:
            status = "ALL_PERIOD_1_PROCEDURES_COMPLETE_CLEAN_SIGN_OFF"
        elif all_executed and findings_count > 0:
            status = "PROCEDURES_COMPLETE_SUBSEQUENT_EVENTS_REQUIRE_DISCLOSURE_OR_ADJUSTMENT"
        else:
            status = "INCOMPLETE_AUDIT_PROCEDURES_CANNOT_SIGN_AUDIT_REPORT"
            
        return {
            "client": self.client_name,
            "scheduled_report_date": self.report_date,
            "total_mandatory_procedures": total_p,
            "executed_count": executed_p,
            "findings_count": findings_count,
            "readiness_verdict": status,
            "checklist": self.procedures
        }

chk = SA560Period1AuditChecklist("Apex Industrial Conglomerate Ltd", "2026-05-10")
chk.add_procedure("Inquire of Management on Subsequent Developments", True, False, "Inquiries conducted with CEO, CFO, and Treasury Head.")
chk.add_procedure("Review Post-Balance Sheet Board & Committee Minutes", True, True, "April 28 Board approved INR 500 Cr CCD issuance; note inserted.")
chk.add_procedure("Read Latest Available Post-Year-End Interim Financials", True, False, "Reviewed April 2026 monthly MIS; revenue margins stable.")
chk.add_procedure("Inquire of Internal & External Legal Counsel", True, True, "Arbitration award of INR 18 Cr settled in April; adjusting entry booked.")
chk.add_procedure("Obtain SA 580 Written Representation on Subsequent Events", True, False, "Signed representation letter received dated May 10.")

eval_res = chk.evaluate_period_1_readiness()
print("SA 560 Period 1 Audit Execution Engine:")
print(f"  Client Name           : {eval_res['client']} (Report Date: {eval_res['scheduled_report_date']})")
print(f"  Procedures Executed   : {eval_res['executed_count']}/{eval_res['total_mandatory_procedures']}")
print(f"  Subsequent Discoveries: {eval_res['findings_count']}")
print(f"  Audit Sign-Off Verdict: {eval_res['readiness_verdict']}")
print("  Procedure Checklist Details:")
for p in eval_res['checklist']:
    print(f"    * {p['procedure_name']}: Executed={p['executed']} | Findings={p['findings']} -> {p['notes']}")
''',
            "tryIt": "Set executed to False for Legal Counsel inquiry to observe how the engine blocks audit report signing until all mandatory procedures are complete.",
            "check": {
                "question": "What is the auditor's statutory obligation regarding subsequent events between the balance sheet date and the date of the auditor's report (Period 1) under SA 560?",
                "options": [
                    "The auditor has an active statutory duty to design and perform audit procedures to identify all subsequent events requiring adjustment or disclosure",
                    "The auditor has zero responsibility to look at any events occurring after the balance sheet date",
                    "The auditor only has responsibility if a newspaper publishes an exposé about the company",
                    "The auditor is only required to call the company's receptionist on the day of the annual general meeting"
                ],
                "answerIndex": 0,
                "why": "SA 560 Paragraph 6 explicitly mandates that the auditor shall perform procedures designed to obtain sufficient appropriate evidence that all subsequent events requiring adjustment or disclosure have been identified."
            }
        },
        {
            "title": "Period 2: Events Known After Audit Report Date but Before Financial Statements Issued",
            "say": [
                "Period 2 encompasses the window after the date of the auditor's report has been signed, but before the financial statements are issued to shareholders and published. During this period, the auditor does not have any active obligation to perform any audit procedures regarding the financial statements. However, if a fact becomes known to the auditor that, had it been known to the auditor at the date of the auditor's report, may have caused the auditor to amend the auditor's report, SA 560 establishes strict mandatory protocols.",
                "When such a material fact becomes known, SA 560 mandates that the auditor shall: (1) Discuss the matter with management and, where appropriate, Those Charged With Governance (TCWG); (2) Determine whether the financial statements need amendment; and (3) Inquire how management intends to address the matter in the financial statements.",
                "If management amends the financial statements, the auditor shall carry out the audit procedures necessary in the circumstances on the amendment and extend the subsequent events procedures to the date of the new auditor's report, issuing a new auditor's report.",
                "Alternatively, where law, regulation, or the financial reporting framework does not prohibit management from restricting the amendment of the financial statements to the effects of the subsequent event, the auditor may Dual Date the auditor's report (e.g., 'May 10, 2026, except as to Note 34, which is as of May 25, 2026'). Dual dating limits the auditor's procedures and legal liability regarding subsequent events solely to the specific amended note."
            ],
            "example": "On May 10, the auditor signs the audit report. On May 22, before the financial statements are mailed to shareholders, a massive commercial fraud committed by the treasury manager is uncovered, involving Rs 80 Crore in forged fixed deposit receipts. The auditor discusses the matter with the Audit Committee. Management amends the financial statements to book an Rs 80 Crore fraud loss and restate assets. The auditor audits the Rs 80 Crore amendment, performs subsequent event procedures up to June 2, and issues an amended auditor's report dated June 2.",
            "code": '''def handle_sa560_period_2_post_signing_discovery(
    discovery_description: str,
    discovery_date: str,
    original_report_date: str,
    is_management_willing_to_amend: bool,
    audit_procedure_choice: str # "EXTEND_ALL_PROCEDURES_NEW_DATE" or "DUAL_DATE_AMENDMENT_ONLY"
) -> dict:
    if not is_management_willing_to_amend:
        protocol_status = "MANAGEMENT_REFUSAL_TO_AMEND_FINANCIALS"
        mandated_action = "NOTIFY_TCWG_PREVENT_RELIANCE_AND_NOTIFY_REGULATORY_AUTHORITIES_MCA"
        dual_dating_applied = False
        final_report_date = original_report_date
    else:
        protocol_status = "MANAGEMENT_AGREES_TO_AMEND_FINANCIAL_STATEMENTS"
        if audit_procedure_choice == "DUAL_DATE_AMENDMENT_ONLY":
            dual_dating_applied = True
            mandated_action = "AUDIT_SPECIFIC_AMENDMENT_AND_ISSUE_DUAL_DATED_REPORT"
            final_report_date = f"{original_report_date}, except as to Note X, which is as of {discovery_date}"
        else:
            dual_dating_applied = False
            mandated_action = "EXTEND_SUBSEQUENT_EVENTS_PROCEDURES_TO_NEW_DATE_AND_RE-ISSUE"
            final_report_date = discovery_date
            
    return {
        "event_discovered": discovery_description,
        "discovery_date": discovery_date,
        "management_cooperation": is_management_willing_to_amend,
        "governance_status": protocol_status,
        "mandated_auditor_action": mandated_action,
        "dual_dating_utilized": dual_dating_applied,
        "resulting_audit_report_date": final_report_date
    }

p2_audit = handle_sa560_period_2_post_signing_discovery(
    discovery_description="Discovery of Forged FD Receipts of INR 80 Cr in Treasury",
    discovery_date="2026-05-25",
    original_report_date="2026-05-10",
    is_management_willing_to_amend=True,
    audit_procedure_choice="DUAL_DATE_AMENDMENT_ONLY"
)
print("SA 560 Period 2 Post-Signing Subsequent Event Handler:")
print(f"  Discovery Event       : {p2_audit['event_discovered']}")
print(f"  Discovery Date        : {p2_audit['discovery_date']}")
print(f"  Management Agrees     : {p2_audit['management_cooperation']}")
print(f"  Governance Verdict    : {p2_audit['governance_status']}")
print(f"  Auditor Legal Action  : {p2_audit['mandated_auditor_action']}")
print(f"  Dual Dating Applied   : {p2_audit['dual_dating_utilized']}")
print(f"  New Audit Report Date : {p2_audit['resulting_audit_report_date']}")
''',
            "tryIt": "Set is_management_willing_to_amend to False to observe how the protocol shifts to notifying the Board, preventing public reliance, and alerting regulatory bodies.",
            "check": {
                "question": "What is the legal effect of an auditor 'dual dating' an audit report under SA 560?",
                "options": [
                    "It limits the auditor's procedures and legal liability regarding subsequent events solely to the specific event or note described in the amendment",
                    "It doubles the statutory audit fees payable by the client",
                    "It indicates that two separate audit firms jointly conducted the audit",
                    "It permits the company to pay dividends twice in the same quarter"
                ],
                "answerIndex": 0,
                "why": "SA 560 Paragraph 12 explicitly establishes that dual dating informs readers that the auditor's procedures on subsequent events were restricted solely to the amendment described in the relevant note."
            }
        },
        {
            "title": "Period 3: Facts Discovered After Financial Statements Have Been Issued",
            "say": [
                "Period 3 represents the most legally precarious subsequent event phase: facts that become known to the auditor after the financial statements have already been issued to shareholders and filed with regulatory authorities (such as the Ministry of Corporate Affairs and stock exchanges). In Period 3, the auditor has no active obligation to perform any procedures. However, if a fact becomes known that, had it been known at the date of the auditor's report, may have caused the auditor to amend the report, SA 560 mandates aggressive action.",
                "The auditor must immediately discuss the matter with management and TCWG. If management revises the financial statements, the auditor shall: (1) Review the steps taken by management to ensure that anyone in receipt of the previously issued financial statements is informed of the situation; (2) Perform audit procedures on the revision; (3) Include in the new auditor's report an Emphasis of Matter paragraph or Other Matter paragraph referring to the note in the financial statements that discusses the reason for the revision and the earlier report issued by the auditor.",
                "Crucially, what happens if management refuses to take steps to inform recipients or refuses to restate the issued financial statements? Under SA 560 Paragraph 17, the auditor shall notify management and TCWG that the auditor will seek to prevent future reliance on the auditor's report.",
                "If, despite such notification, management or TCWG does not take the necessary steps, the auditor shall take appropriate action to prevent reliance on the auditor's report, including seeking legal advice, notifying shareholders publicly, and filing formal notices with the MCA, NFRA, and SEBI."
            ],
            "example": "Six months after publishing the audited annual report, a whistleblower provides definitive proof that top executives conspired to inflate inventory by Rs 150 Crore using fictitious warehouse receipts. Management refuses to recall the financial statements, claiming 'the year is already closed'. Under SA 560, the auditor immediately notifies the Board that reliance on the report is revoked, files an emergency regulatory notification with the National Financial Reporting Authority (NFRA) and SEBI, and issues a public press notification rescinding the audit opinion.",
            "code": '''def execute_sa560_period_3_recall_protocol(
    company_name: str,
    fraud_amount_cr: float,
    management_willing_to_recall_and_restate: bool
) -> dict:
    if management_willing_to_recall_and_restate:
        remedy_status = "MANAGEMENT_COOPERATING_VOLUNTARY_REVISION_COMMENCED"
        statutory_actions = [
            "ISSUE_PUBLIC_NOTICE_RECALLING_PREVIOUSLY_ISSUED_FINANCIAL_STATEMENTS",
            "AUDIT_RESTATED_FINANCIAL_STATEMENTS_AND_REVISION_NOTES",
            "ISSUE_NEW_AUDIT_REPORT_CONTAINING_EMPHASIS_OF_MATTER_PARAGRAPH",
            "TRANSMIT_REVISED_ANNUAL_REPORT_TO_MCA_NFRA_AND_SEBI"
        ]
        legal_escalation_required = False
    else:
        remedy_status = "CRITICAL_MANAGEMENT_REFUSAL_DEFENSE_ACTION_MANDATORY"
        statutory_actions = [
            "NOTIFY_BOARD_OF_DIRECTORS_THAT_AUDIT_OPINION_IS_OFFICIALLY_REVOKED",
            "ISSUE_PUBLIC_REGULATORY_NOTICE_TO_STOCK_EXCHANGES_SEBI_PREVENTING_RELIANCE",
            "FILE_EMERGENCY_FORM_ADT-4_AND_FRAUD_DOSSIER_WITH_MCA_AND_NFRA",
            "RETAIN_INDEPENDENT_LEGAL_COUNSEL_FOR_AUDITOR_LIABILITY_DEFENSE"
        ]
        legal_escalation_required = True
        
    return {
        "company": company_name,
        "fraud_exposure_cr": fraud_amount_cr,
        "protocol_tier": "SA_560_PERIOD_3_POST_ISSUANCE",
        "governance_status": remedy_status,
        "legal_escalation_active": legal_escalation_required,
        "statutory_mandates": statutory_actions
    }

period_3_case = execute_sa560_period_3_recall_protocol(
    company_name="Apex Global Technologies Ltd",
    fraud_amount_cr=150.0,
    management_willing_to_recall_and_restate=False
)
print("SA 560 Period 3 Post-Issuance Fraud Discovery & Reliance Revocation Engine:")
print(f"  Company Name          : {period_3_case['company']}")
print(f"  Fraud Exposure        : INR {period_3_case['fraud_exposure_cr']} Crores")
print(f"  Protocol Tier         : {period_3_case['protocol_tier']}")
print(f"  Governance Verdict    : {period_3_case['governance_status']}")
print(f"  Legal Escalation Active: {period_3_case['legal_escalation_active']}")
print("  Mandated Statutory Legal Actions:")
for action in period_3_case['statutory_mandates']:
    print(f"    * {action}")
''',
            "tryIt": "Set management_willing_to_recall_and_restate to True to observe how the protocol resolves through restatement, new audit reporting, and Emphasis of Matter disclosure.",
            "check": {
                "question": "What must the statutory auditor do under SA 560 if management refuses to take steps to inform financial statement users or restate financial statements after a material fraud is discovered post-issuance?",
                "options": [
                    "Notify management and the Board that the auditor will take appropriate action to prevent reliance on the audit report, including notifying regulatory bodies such as MCA, NFRA, and SEBI",
                    "Do nothing, because an auditor's legal liability terminates the instant financial statements are mailed",
                    "Agree to keep the discovery secret in exchange for doubled audit fees for the next financial year",
                    "Issue a private apology letter to the Chief Executive Officer"
                ],
                "answerIndex": 0,
                "why": "SA 560 Paragraph 17 mandates that if management refuses to take steps to prevent reliance on issued financial statements containing material errors, the auditor shall take active steps to prevent reliance, including regulatory notification."
            }
        },
        {
            "title": "Subsequent Events Audit File Assembly & Regulatory Form ADT-4 Cross-Link",
            "say": [
                "The comprehensive documentation of subsequent events procedures forms an indispensable component of the audit file under SA 230. The statutory auditor must assemble a dedicated Subsequent Events Working Paper Dossier containing: (1) Minutes of all post-balance sheet meetings with cross-references to relevant agenda papers; (2) Detailed schedules of all adjusting entries posted and non-adjusting notes disclosed; (3) Copies of legal inquiry letters and lawyer response letters obtained up to the date of the audit report; (4) The final signed Management Representation Letter under SA 580 explicitly confirming subsequent events; and (5) Detailed documentation of any dual dating rationale and procedures.",
                "Furthermore, if a subsequent event reveals a fraud committed by officers or employees of the company exceeding Rs 1 Crore (under Section 143(12) of the Companies Act, 2013), the statutory timeline for reporting is immediately triggered, irrespective of whether the financial statements have been signed.",
                "The auditor must report the matter to the Board within 2 days, seek their reply within 45 days, and forward Form ADT-4 to the Central Government (Ministry of Corporate Affairs) within 15 days of receiving the reply or upon expiry of the 45-day window. Synthesizing subsequent events verification with statutory fraud reporting guarantees complete legal compliance."
            ],
            "example": "In finalizing the subsequent events dossier for an engineering firm, the audit team documents: (a) Rs 14 Crore in adjusting entries for April debtor insolvencies; (b) Rs 60 Crore non-adjusting note disclosure for an April plant flood; and (c) Form ADT-4 filing documentation for an Rs 8 Crore procurement fraud discovered during post-balance sheet inquiries. The audit partner signs off on the dossier, completing the SA 560 audit requirements.",
            "code": '''class SubsequentEventsDossierEngine:
    def __init__(self, company_name: str, audit_year: str):
        self.company = company_name
        self.audit_year = audit_year
        self.events_logged = []
        
    def log_subsequent_event(self, description: str, amount_cr: float, is_adjusting: bool, is_fraud: bool):
        self.events_logged.append({
            "event": description,
            "amount_cr": amount_cr,
            "is_adjusting": is_adjusting,
            "is_fraud": is_fraud,
            "triggers_sec143_12_mca": is_fraud and (amount_cr >= 1.0)
        })
        
    def generate_dossier_report(self) -> dict:
        total_ev = len(self.events_logged)
        adjusting_sum = sum(e["amount_cr"] for e in self.events_logged if e["is_adjusting"])
        non_adjusting_sum = sum(e["amount_cr"] for e in self.events_logged if not e["is_adjusting"])
        mca_fraud_triggers = [e for e in self.events_logged if e["triggers_sec143_12_mca"]]
        
        return {
            "company": self.company,
            "fiscal_period": self.audit_year,
            "total_events_documented": total_ev,
            "total_adjusting_entries_cr": round(adjusting_sum, 2),
            "total_non_adjusting_disclosures_cr": round(non_adjusting_sum, 2),
            "mca_sec143_12_fraud_triggers_count": len(mca_fraud_triggers),
            "mca_reporting_mandated": len(mca_fraud_triggers) > 0,
            "events_detail": self.events_logged
        }

dossier = SubsequentEventsDossierEngine("Zenith Engineering Conglomerate Ltd", "FY 2025-26")
dossier.log_subsequent_event("Debtor Insolvency Bankruptcy Confirmation", 14.0, is_adjusting=True, is_fraud=False)
dossier.log_subsequent_event("Factory Flood Damage Post-Balance Sheet", 60.0, is_adjusting=False, is_fraud=False)
dossier.log_subsequent_event("Procurement Kickback Embezzlement by VP Supply Chain", 8.0, is_adjusting=True, is_fraud=True)

rep = dossier.generate_dossier_report()
print("SA 560 / Section 143(12) Subsequent Events Working Paper Dossier:")
print(f"  Company Name          : {rep['company']} ({rep['fiscal_period']})")
print(f"  Total Events Logged   : {rep['total_events_documented']}")
print(f"  Adjusting Entries Sum : INR {rep['total_adjusting_entries_cr']} Crores")
print(f"  Non-Adjusting Notes   : INR {rep['total_non_adjusting_disclosures_cr']} Crores")
print(f"  MCA Sec 143(12) Frauds: {rep['mca_sec143_12_fraud_triggers_count']} (Form ADT-4 Mandate: {rep['mca_reporting_mandated']})")
print("  Subsequent Events Working Paper Log:")
for ev in rep['events_detail']:
    print(f"    * {ev['event']} (INR {ev['amount_cr']} Cr): Adjusting={ev['is_adjusting']} | Sec 143(12) Trigger={ev['triggers_sec143_12_mca']}")
''',
            "tryIt": "Set is_fraud to False for the procurement embezzlement to observe how the MCA Section 143(12) fraud trigger turns False.",
            "check": {
                "question": "What is the statutory threshold under Section 143(12) of the Companies Act, 2013 that triggers mandatory fraud reporting by the auditor directly to the Central Government in Form ADT-4?",
                "options": [
                    "Fraud involving an amount of Rs 1 Crore or above committed against the company by its officers or employees",
                    "Any fraud exceeding Rs 100 Crore only",
                    "Fraud involving foreign currency transactions only",
                    "There is no statutory threshold; all petty thefts must be reported to the Prime Minister"
                ],
                "answerIndex": 0,
                "why": "Section 143(12) and Rule 13 of Companies (Audit and Auditors) Rules, 2014 mandate that fraud of Rs 1 Crore or above must be reported to the Central Government via Form ADT-4."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day18.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 18 base JSON created successfully.")
