"""
Build Day 9 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Statutory Audit Reporting & CARO 2020: Companies Act 2013 Sec 143 & 21 Clauses of CARO 2020
"""
import json

day_data = {
    "day": 9,
    "title": "Companies Act Statutory Reporting & CARO 2020: Section 143 & The 21 Statutory Clauses",
    "parts": [
        {
            "title": "Companies Act Statutory Audit Powers, Duties & Duty to Report Fraud: Section 143",
            "say": [
                "Section 143 of the Companies Act, 2013 establishes the statutory powers, rights, and duties of the company auditor in India. Under Section 143(1), the statutory auditor has an unfettered legal right of access at all times to the books, accounts, and vouchers of the company, whether kept at the registered office of the company or elsewhere, and is entitled to require from the officers of the company such information and explanation as the auditor may consider necessary for the performance of their duties.",
                "Section 143(1) additionally imposes mandatory inquiries on six specific matters: (a) whether loans and advances made by the company on the basis of security have been properly secured and whether the terms on which they have been made are prejudicial to the interests of the company or its members; (b) whether transactions of the company which are represented merely by book entries are prejudicial to the interests of the company; (c) where the company is not an investment company, whether so much of the assets of the company as consist of shares, debentures, and other securities have been sold at a price less than that at which they were purchased; (d) whether loans and advances made by the company have been shown as deposits; (e) whether personal expenses have been charged to revenue account; and (f) where it is stated in the books and documents of the company that any shares have been allotted for cash, whether cash has actually been received in respect of such allotment.",
                "Under Section 143(12) read with Rule 13 of the Companies (Audit and Auditors) Rules, 2014, if the statutory auditor in the course of the performance of their duties as auditor has reason to believe that an offence of fraud involving an amount of Rupees One Crore (Rs 1 Crore) or above is being or has been committed in the company by its officers or employees, the auditor shall report the matter to the Central Government (Ministry of Corporate Affairs - MCA).",
                "The statutory reporting timeline under Section 143(12) is rigid and non-negotiable: (1) the auditor shall report the matter to the Board or the Audit Committee immediately, but not later than two (2) days of knowledge, seeking their reply or observations within forty-five (45) days; (2) on receipt of such reply or observations, the auditor shall forward their report and the reply to the Central Government within fifteen (15) days; (3) in case the Board or Audit Committee fails to reply within 45 days, the auditor shall forward their report directly to the Central Government in Form ADT-4 within fifteen (15) days from the expiry of the 45-day window. Failure to report fraud under Section 143(12) attracts severe statutory penalties on the individual auditor up to Rs 5 Lakh under Section 143(15)."
            ],
            "example": "During the statutory audit of an infrastructure firm, the audit team detects a fabricated vendor billing scheme involving fake excavation invoices totaling Rs 4.2 Crore approved by the Senior Project Manager. Because the fraud amount exceeds the statutory threshold of Rs 1 Crore, the engagement partner cannot resolve the matter quietly with management. Within 48 hours of discovery, the partner submits a confidential memorandum to the Board Audit Committee initiating the 45-day response countdown, and prepares Form ADT-4 for mandatory transmission to the Secretary, Ministry of Corporate Affairs (MCA).",
            "code": '''import datetime

def evaluate_sec143_fraud_reporting_mandate(
    suspected_fraud_amount_inr: float,
    fraud_committed_by: str, # "OFFICERS_OR_EMPLOYEES", "THIRD_PARTY_VENDOR_ONLY"
    discovery_date_str: str,
    board_notified_date_str: str,
    board_reply_received_date_str: str = None
) -> dict:
    fmt = "%Y-%m-%d"
    d_disc = datetime.datetime.strptime(discovery_date_str, fmt)
    d_board = datetime.datetime.strptime(board_notified_date_str, fmt)
    
    # Statutory threshold: INR 1 Crore (10,000,000)
    STATUTORY_MCA_THRESHOLD = 10000000.0
    
    # 1. 2-day Notification Gate
    days_to_notify_board = (d_board - d_disc).days
    is_board_notified_within_2_days = 0 <= days_to_notify_board <= 2
    
    is_mca_reporting_mandatory = (
        suspected_fraud_amount_inr >= STATUTORY_MCA_THRESHOLD and 
        fraud_committed_by == "OFFICERS_OR_EMPLOYEES"
    )
    
    # 2. 45-day response window and 15-day MCA filing deadline
    board_deadline_45d = d_board + datetime.timedelta(days=45)
    
    if is_mca_reporting_mandatory:
        if board_reply_received_date_str:
            d_reply = datetime.datetime.strptime(board_reply_received_date_str, fmt)
            mca_filing_deadline = d_reply + datetime.timedelta(days=15)
        else:
            mca_filing_deadline = board_deadline_45d + datetime.timedelta(days=15)
        reporting_destination = "CENTRAL_GOVERNMENT_MCA_FORM_ADT_4"
    else:
        mca_filing_deadline = None
        reporting_destination = "REPORT_TO_AUDIT_COMMITTEE_AND_DISCLOSE_IN_BOARD_REPORT"
        
    return {
        "suspected_fraud_amount_inr": suspected_fraud_amount_inr,
        "is_above_1cr_threshold": suspected_fraud_amount_inr >= STATUTORY_MCA_THRESHOLD,
        "days_elapsed_to_board_notice": days_to_notify_board,
        "board_notification_timely": is_board_notified_within_2_days,
        "mca_reporting_statutory_mandate": is_mca_reporting_mandatory,
        "statutory_form": "Form ADT-4" if is_mca_reporting_mandatory else "Audit Committee Memo",
        "mca_filing_statutory_deadline": mca_filing_deadline.strftime(fmt) if mca_filing_deadline else "N/A",
        "statutory_reporting_destination": reporting_destination
    }

fraud_eval = evaluate_sec143_fraud_reporting_mandate(
    suspected_fraud_amount_inr=42000000.0, # Rs 4.2 Crore
    fraud_committed_by="OFFICERS_OR_EMPLOYEES",
    discovery_date_str="2026-06-10",
    board_notified_date_str="2026-06-11",
    board_reply_received_date_str="2026-07-15"
)
print("Section 143(12) Statutory Fraud Reporting Compliance Engine:")
print(f"  Suspected Fraud Amount : INR {fraud_eval['suspected_fraud_amount_inr']:,.2f}")
print(f"  Exceeds 1 Cr Threshold : {fraud_eval['is_above_1cr_threshold']}")
print(f"  Board Notice in 2 Days : {fraud_eval['board_notification_timely']} ({fraud_eval['days_elapsed_to_board_notice']} days elapsed)")
print(f"  Central Govt Mandate   : {fraud_eval['mca_reporting_statutory_mandate']} ({fraud_eval['statutory_form']})")
print(f"  MCA Filing Deadline    : {fraud_eval['mca_filing_statutory_deadline']}")
print(f"  Statutory Action       : {fraud_eval['statutory_reporting_destination']}")
''',
            "tryIt": "Lower suspected_fraud_amount_inr to 75,00,000 (Rs 75 Lakh) to observe the statutory mandate drop below the Central Government threshold, requiring internal Board disclosure only.",
            "check": {
                "question": "Under Section 143(12) of the Companies Act, 2013 and Rule 13, what is the monetary threshold that legally triggers mandatory reporting of fraud directly to the Central Government in Form ADT-4?",
                "options": [
                    "Frauds involving an amount of Rupees One Crore (INR 1 Crore) or above committed against the company by its officers or employees",
                    "Any fraud exceeding Rupees Ten Lakh involving cash transactions",
                    "Only multi-state banking frauds exceeding Rupees One Hundred Crore",
                    "Reporting to the Central Government is never required if the company files a police FIR"
                ],
                "answerIndex": 0,
                "why": "Section 143(12) read with Rule 13(1) of the Companies (Audit and Auditors) Rules, 2014 establishes that if an auditor has reason to believe that an offence of fraud involving an amount of Rs 1 Crore or above is being or has been committed by officers or employees, the auditor must report it to the Central Government."
            }
        },
        {
            "title": "Companies (Auditor's Report) Order, 2020: Property, Plant & Equipment and Inventory (Clauses i & ii)",
            "say": [
                "The Companies (Auditor's Report) Order, 2020 (CARO 2020), issued by the Ministry of Corporate Affairs under Section 143(11) of the Companies Act, 2013, represents a massive expansion in statutory audit disclosure, comprising twenty-one (21) comprehensive reporting clauses designed to detect corporate asset dissipation, NPA window-dressing, unrecorded benami holdings, and shell company conduits.",
                "Clause (i) of CARO 2020 governs Property, Plant and Equipment (PPE) and Intangible Assets across five exhaustive sub-clauses: (a) whether the company is maintaining proper records showing full particulars, including quantitative details and situation of PPE and intangible assets; (b) whether these PPE have been physically verified by management at reasonable intervals (ordinarily once every 3 years), whether any material discrepancies were noticed, and whether they have been properly dealt with in the books of account; (c) whether the title deeds of all immovable properties (other than properties where the company is the lessee) disclosed in financial statements are held in the name of the company, and if not, reporting in a prescribed tabular format detailing description, gross carrying value, held in whose name, relationship, and dispute status; (d) whether the company has revalued its PPE or intangible assets, and whether revaluation is based on a Registered Valuer's report, disclosing amount of change if revaluation is 10% or more; and (e) whether any proceedings have been initiated or are pending against the company for holding any Benami property under the Prohibition of Benami Property Transactions Act, 1988.",
                "Clause (ii) governs Inventory and Working Capital limits: (a) whether physical verification of inventory has been conducted at reasonable intervals by management, whether coverage and procedure of such verification is appropriate, and whether any discrepancies of 10% or more in the aggregate for each class of inventory were noticed and properly dealt with in the books; and (b) whether during any point of time of the year, the company has been sanctioned working capital limits in excess of Rupees Five Crore (Rs 5 Crore), in aggregate, from banks or financial institutions on the basis of security of current assets, and whether the quarterly returns or statements filed by the company with such banks are in agreement with the books of account of the company, and if not, giving details.",
                "The working capital reconciliation under Clause (ii)(b) is a critical anti-fraud audit control. In the past, companies inflated stock statements submitted to banks to draw maximum overdraft limits while reporting deflated inventory in audited books to evade taxes. CARO 2020 legally requires the statutory auditor to verify and report every quarterly mismatch between bank stock statements and general ledger inventory."
            ],
            "example": "A manufacturing company holds a Rs 15 Crore working capital loan from a consortium of nationalized banks. In its September 30 quarterly stock statement submitted to the lead bank, management reported inventory of Rs 22 Crore and trade receivables of Rs 18 Crore (Drawing Power = Rs 30 Crore). However, the general ledger audited records showed inventory of Rs 14 Crore and trade receivables of Rs 11 Crore (a Rs 15 Crore inflation). Under CARO 2020 Clause (ii)(b), the statutory auditor discloses this material mismatch in the CARO report, alerting the board, banks, and regulatory authorities to synthetic drawing power inflation.",
            "code": '''def evaluate_caro2020_clauses_i_and_ii(
    immovable_property_held_in_other_names: bool,
    revaluation_occurred: bool,
    revaluation_variance_pct: float,
    benami_proceedings_pending: bool,
    inventory_discrepancy_pct: float,
    working_capital_sanctioned_limit_cr: float,
    bank_stock_statement_inventory_cr: float,
    books_of_account_inventory_cr: float
) -> dict:
    caro_qualifications = []
    
    # Clause (i)(c): Title deeds
    if immovable_property_held_in_other_names:
        caro_qualifications.append("Clause (i)(c): Immovable properties disclosed in financial statements not held in company name (Tabular reporting required)")
        
    # Clause (i)(d): Revaluation >= 10%
    if revaluation_occurred and abs(revaluation_variance_pct) >= 10.0:
        caro_qualifications.append(f"Clause (i)(d): PPE revalued by {revaluation_variance_pct:.1f}% (>= 10% threshold requires valuer disclosure)")
        
    # Clause (i)(e): Benami property
    if benami_proceedings_pending:
        caro_qualifications.append("Clause (i)(e): Proceedings pending under Prohibition of Benami Property Transactions Act, 1988")
        
    # Clause (ii)(a): Inventory discrepancy >= 10%
    if abs(inventory_discrepancy_pct) >= 10.0:
        caro_qualifications.append(f"Clause (ii)(a): Inventory physical verification discrepancy ({inventory_discrepancy_pct:.1f}%) exceeds 10% threshold")
        
    # Clause (ii)(b): Bank quarterly returns vs books for limits > Rs 5 Cr
    if working_capital_sanctioned_limit_cr > 5.0:
        bank_variance_cr = abs(bank_stock_statement_inventory_cr - books_of_account_inventory_cr)
        if bank_variance_cr > 0.05: # > 5 Lakh variance
            caro_qualifications.append(f"Clause (ii)(b): Quarterly bank stock returns (INR {bank_stock_statement_inventory_cr} Cr) differ from audited books (INR {books_of_account_inventory_cr} Cr) by INR {bank_variance_cr:.2f} Cr")
            
    is_caro_clean = len(caro_qualifications) == 0
    
    return {
        "clauses_evaluated": ["Clause (i) PPE & Intangibles", "Clause (ii) Inventory & Working Capital"],
        "is_report_unmodified_clean": is_caro_clean,
        "statutory_qualifications_count": len(caro_qualifications),
        "qualifications_list": caro_qualifications
    }

caro_eval = evaluate_caro2020_clauses_i_and_ii(
    immovable_property_held_in_other_names=False,
    revaluation_occurred=True,
    revaluation_variance_pct=14.5,
    benami_proceedings_pending=False,
    inventory_discrepancy_pct=4.2,
    working_capital_sanctioned_limit_cr=15.0,
    bank_stock_statement_inventory_cr=22.0,
    books_of_account_inventory_cr=14.0
)
print("CARO 2020 Clauses (i) & (ii) Compliance Audit Report:")
print(f"  CARO Clean Status      : {caro_eval['is_report_unmodified_clean']}")
print(f"  Qualifications Flagged : {caro_eval['statutory_qualifications_count']}")
print("  Statutory Disclosures  :")
for q in caro_eval['qualifications_list']:
    print(f"    * {q}")
''',
            "tryIt": "Set bank_stock_statement_inventory_cr equal to 14.0 Cr and revaluation_variance_pct to 5.0% to see all qualifications clear, resulting in an unmodified CARO clean status.",
            "check": {
                "question": "Under Clause (ii)(b) of CARO 2020, what is the statutory threshold of sanctioned working capital limits that triggers mandatory auditor reconciliation between quarterly bank stock statements and audited books of account?",
                "options": [
                    "Sanctioned working capital limits in excess of Rupees Five Crore (INR 5 Crore) in aggregate from banks or financial institutions on the basis of security of current assets",
                    "Sanctioned limits in excess of Rupees Fifty Crore from international foreign banks",
                    "Any unsecured personal loan taken by company promoters",
                    "There is no threshold; all companies must file monthly reconciliations regardless of borrowing size"
                ],
                "answerIndex": 0,
                "why": "CARO 2020 Clause (ii)(b) specifies that where the company has been sanctioned working capital limits in excess of Rs 5 Crore, in aggregate, from banks or financial institutions on the security of current assets, the auditor must report whether quarterly returns/statements filed agree with the books."
            }
        },
        {
            "title": "CARO 2020: Loans, Investments, Guarantees & Deposits (Clauses iii, iv & v)",
            "say": [
                "Clauses (iii), (iv), and (v) of CARO 2020 establish stringent statutory oversight over corporate financial inter-dealings, inter-corporate deposits, advances, and public deposits, directly targeting diversion of corporate borrowed funds to related parties or promoters.",
                "Clause (iii) imposes exhaustive reporting whenever the company has made investments in, provided any guarantee or security, or granted any loans or advances in the nature of loans, secured or unsecured, to companies, firms, LLPs, or any other parties. The auditor must report across six sub-clauses: (a) whether during the year the company has provided loans, advances, guarantees, or security to entities other than subsidiaries, joint ventures, and associates, disclosing aggregate amounts and year-end balances; (b) whether the investments made, guarantees provided, security given, and the terms and conditions of the grant of all loans are not prejudicial to the company's interest; (c) in respect of loans and advances, whether schedule of repayment of principal and payment of interest has been stipulated and whether repayments are regular; (d) if amount is overdue for more than 90 days, whether reasonable steps have been taken by the company for recovery; (e) whether any loan or advance fallen due during the year has been renewed or extended or fresh loans granted to settle the overdues of existing loans (Evergreening of loans); and (f) whether the company has granted any loans or advances in the nature of loans either repayable on demand or without specifying any terms or periods of repayment, disclosing aggregate amount and percentage to total loans.",
                "Clause (iv) requires the statutory auditor to report whether in respect of loans, investments, guarantees, and security, provisions of Section 185 (Loans to Directors and interested entities) and Section 186 (Loan and investment by company limits) of the Companies Act, 2013 have been complied with, and if not, provide details thereof. Section 185 imposes an outright prohibition on advancing loans to directors or their relatives, except under narrow statutory exemptions.",
                "Clause (v) governs Public Deposits under Sections 73 to 76 of the Companies Act, 2013 and RBI directives. The auditor must certify whether the company has accepted deposits from the public or amounts deemed to be deposits, whether directives of the RBI and statutory rules have been complied with, and if not, state the nature of contraventions."
            ],
            "example": "An enterprise grants a Rs 35 Crore unsecured loan to a partnership firm in which the promoter's son holds a 50% profit share. The loan agreement specifies no repayment schedule and states the loan is 'repayable on demand'. Under CARO 2020 Clause (iii)(f), the auditor must disclose that Rs 35 Crore (representing 45% of total company loans) is granted without repayment terms to a related party. Furthermore, under Clause (iv), the auditor reports a direct statutory violation of Section 185, exposing the company and directors to severe criminal penalties under the Companies Act.",
            "code": '''def evaluate_caro_clauses_iii_iv_v(
    total_loans_granted_cr: float,
    loans_repayable_on_demand_cr: float,
    overdue_loans_over_90_days_cr: float,
    recovery_legal_steps_taken: bool,
    evergreened_loans_cr: float,
    sec185_loans_to_directors_violation: bool,
    unauthorized_public_deposits_cr: float
) -> dict:
    disclosures = []
    
    # Clause (iii)(e): Evergreening of loans
    if evergreened_loans_cr > 0:
        disclosures.append(f"Clause (iii)(e): Evergreening detected — INR {evergreened_loans_cr:.2f} Cr granted to settle existing overdue loans")
        
    # Clause (iii)(f): Demand loans without terms
    if loans_repayable_on_demand_cr > 0:
        demand_pct = (loans_repayable_on_demand_cr / total_loans_granted_cr) * 100.0 if total_loans_granted_cr > 0 else 0.0
        disclosures.append(f"Clause (iii)(f): INR {loans_repayable_on_demand_cr:.2f} Cr ({demand_pct:.1f}% of total loans) granted repayable on demand without repayment terms")
        
    # Clause (iii)(d): Overdue > 90 days without recovery steps
    if overdue_loans_over_90_days_cr > 0 and not recovery_legal_steps_taken:
        disclosures.append(f"Clause (iii)(d): Overdue loans of INR {overdue_loans_over_90_days_cr:.2f} Cr past 90 days with no reasonable legal recovery steps taken")
        
    # Clause (iv): Sec 185 / 186 Non-compliance
    if sec185_loans_to_directors_violation:
        disclosures.append("Clause (iv): Contravention of Section 185 — Unlawful loan granted to director-interested entities")
        
    # Clause (v): Public deposits
    if unauthorized_public_deposits_cr > 0:
        disclosures.append(f"Clause (v): Deemed public deposits of INR {unauthorized_public_deposits_cr:.2f} Cr accepted without Section 73/76 compliance")
        
    is_compliant = len(disclosures) == 0
    
    return {
        "clauses_evaluated": ["Clause (iii) Loans & Advances", "Clause (iv) Sec 185/186", "Clause (v) Public Deposits"],
        "caro_adverse_remarks": disclosures,
        "is_caro_clean": is_compliant,
        "regulatory_risk_level": "CRITICAL_STATUTORY_NON_COMPLIANCE" if not is_compliant else "CLEAN_COMPLIANT"
    }

loans_audit = evaluate_caro_clauses_iii_iv_v(
    total_loans_granted_cr=80.0,
    loans_repayable_on_demand_cr=35.0,
    overdue_loans_over_90_days_cr=12.0,
    recovery_legal_steps_taken=False,
    evergreened_loans_cr=8.5,
    sec185_loans_to_directors_violation=True,
    unauthorized_public_deposits_cr=0.0
)
print("CARO 2020 Clauses (iii), (iv) & (v) Corporate Lending Audit:")
print(f"  CARO Clean Status      : {loans_audit['is_caro_clean']}")
print(f"  Regulatory Risk Rating : {loans_audit['regulatory_risk_level']}")
print("  Adverse Statutory Disclosures:")
for d in loans_audit['caro_adverse_remarks']:
    print(f"    ! {d}")
''',
            "tryIt": "Set loans_repayable_on_demand_cr to 0, evergreened_loans_cr to 0, recovery_legal_steps_taken to True, and sec185_loans_to_directors_violation to False to observe the regulatory risk level shift to CLEAN_COMPLIANT.",
            "check": {
                "question": "Under Clause (iii)(e) of CARO 2020, what specific financial practice must the statutory auditor investigate and disclose regarding maturing loans?",
                "options": [
                    "Evergreening of loans: whether any loan fallen due during the year has been renewed or extended or fresh loans granted to settle overdues of existing loans",
                    "Whether the company charges interest rates exceeding 36% per annum under usury laws",
                    "Whether loan agreements were printed on legal green paper",
                    "Whether loan proceeds were used to pay employee health club memberships"
                ],
                "answerIndex": 0,
                "why": "CARO 2020 Clause (iii)(e) specifically targets the fraudulent corporate practice of evergreening, requiring auditors to report whether maturing loans were renewed, extended, or settled with fresh loans to disguise default."
            }
        },
        {
            "title": "CARO 2020: Statutory Dues, Unrecorded Income, Defaults & Fund Diversion (Clauses vii, viii, ix & x)",
            "say": [
                "Clauses (vii), (viii), (ix), and (x) of CARO 2020 address corporate statutory discipline, tax search disclosures, bank default contagion, and the illegal diversion of borrowed funds.",
                "Clause (vii) governs Statutory Dues across two critical dimensions: (a) whether the company is regular in depositing undisputed statutory dues including Goods and Services Tax, Provident Fund, Employees' State Insurance, Income Tax, Sales Tax, Service Tax, Duty of Customs, Duty of Excise, Value Added Tax, Cess, and any other statutory dues with appropriate authorities, and if not, disclosing arrears exceeding six (6) months from the date they became payable at the balance sheet date; and (b) where statutory dues have not been deposited on account of any dispute, disclosing the amounts involved and the forum where the dispute is pending.",
                "Clause (viii) targets Unrecorded Income: whether any transactions not recorded in the books of account have been surrendered or disclosed as income during the year in tax assessments under the Income Tax Act, 1961 (such as during search and survey operations under Section 132 or Section 133A), and whether the previously unrecorded income has been properly recorded in the books of account during the year.",
                "Clause (ix) is the most comprehensive loan default and diversion clause in corporate audit history, comprising six sub-clauses: (a) whether the company has defaulted in repayment of loans or borrowings to any lender, detailing nature, period, and amount of default; (b) whether the company is a declared Willful Defaulter by any bank or financial institution; (c) whether term loans were applied for the purpose for which the loans were obtained; (d) whether funds raised on short-term basis have been utilized for long-term purposes (Asset-Liability Mismatch); (e) whether the company has taken any funds from any entity or person on account of or to meet obligations of subsidiaries, associates, or joint ventures; and (f) whether the company has raised loans during the year on the pledge of securities held in its subsidiaries, joint ventures, or associates. Clause (x) audits the end-use of moneys raised through IPOs, FPOs, and private placement/preferential allotments under Section 42 of the Companies Act."
            ],
            "example": "A real estate developer secures a Rs 120 Crore term loan from an infrastructure bank sanctioned specifically for constructing an IT park. The auditor discovers that Rs 45 Crore of the term loan proceeds were transferred into a promoter-controlled subsidiary to acquire agricultural land, and Rs 15 Crore was utilized to pay past-due short-term vendor payables. Under CARO 2020 Clause (ix)(c), the auditor discloses Rs 60 Crore in term loan fund diversion. Under Clause (vii)(a), the auditor reports Rs 4.8 Crore in employee PF unpaid for over 8 months.",
            "code": '''def evaluate_caro_clauses_vii_viii_ix(
    undisputed_statutory_dues_arrears_over_6_months_cr: float,
    unrecorded_tax_search_income_cr: float,
    previously_unrecorded_income_booked: bool,
    lender_defaults_exist: bool,
    is_declared_willful_defaulter: bool,
    term_loan_diverted_amount_cr: float,
    short_term_funds_used_for_long_term_cr: float
) -> dict:
    caro_findings = []
    
    # Clause (vii)(a): Undisputed arrears > 6 months
    if undisputed_statutory_dues_arrears_over_6_months_cr > 0:
        caro_findings.append(f"Clause (vii)(a): Arrears of statutory dues exceeding 6 months outstanding: INR {undisputed_statutory_dues_arrears_over_6_months_cr:,.2f} Cr")
        
    # Clause (viii): Tax search surrendered income
    if unrecorded_tax_search_income_cr > 0 and not previously_unrecorded_income_booked:
        caro_findings.append(f"Clause (viii): Tax search surrendered income (INR {unrecorded_tax_search_income_cr} Cr) not properly accounted in financial statements")
        
    # Clause (ix)(a): Loan defaults
    if lender_defaults_exist:
        caro_findings.append("Clause (ix)(a): Defaults in repayment of loans/borrowings to financial institutions or banks")
        
    # Clause (ix)(b): Willful Defaulter
    if is_declared_willful_defaulter:
        caro_findings.append("Clause (ix)(b): Company is declared a WILLFUL DEFAULTER by lender banks under RBI Master Circular")
        
    # Clause (ix)(c): Fund Diversion
    if term_loan_diverted_amount_cr > 0:
        caro_findings.append(f"Clause (ix)(c): DIVERSION OF FUNDS — Term loans of INR {term_loan_diverted_amount_cr:,.2f} Cr not applied for sanctioned purpose")
        
    # Clause (ix)(d): Short-term used for long-term (ALM Mismatch)
    if short_term_funds_used_for_long_term_cr > 0:
        caro_findings.append(f"Clause (ix)(d): ALM Mismatch — Short-term borrowings of INR {short_term_funds_used_for_long_term_cr:,.2f} Cr used for long-term investments")
        
    return {
        "clauses_evaluated": ["Clause (vii) Statutory Dues", "Clause (viii) Unrecorded Income", "Clause (ix) Defaults & Diversions"],
        "adverse_findings_count": len(caro_findings),
        "caro_audit_findings": caro_findings,
        "caro_status": "HIGH_SEVERITY_QUALIFICATIONS" if len(caro_findings) > 0 else "CLEAN_COMPLIANT"
    }

defaults_audit = evaluate_caro_clauses_vii_viii_ix(
    undisputed_statutory_dues_arrears_over_6_months_cr=4.80,
    unrecorded_tax_search_income_cr=0.0,
    previously_unrecorded_income_booked=True,
    lender_defaults_exist=True,
    is_declared_willful_defaulter=False,
    term_loan_diverted_amount_cr=60.0,
    short_term_funds_used_for_long_term_cr=15.0
)
print("CARO 2020 Clauses (vii), (viii) & (ix) Statutory Compliance Audit:")
print(f"  CARO Status            : {defaults_audit['caro_status']}")
print(f"  Adverse Findings Count : {defaults_audit['adverse_findings_count']}")
print("  Statutory Disclosures  :")
for f in defaults_audit['caro_audit_findings']:
    print(f"    * {f}")
''',
            "tryIt": "Set term_loan_diverted_amount_cr to 0, undisputed_statutory_dues_arrears_over_6_months_cr to 0, and lender_defaults_exist to False to verify that clean operations yield a CLEAN_COMPLIANT CARO status.",
            "check": {
                "question": "Under Clause (ix)(c) and Clause (ix)(d) of CARO 2020, what two critical banking fund utilization violations must the statutory auditor audit and disclose?",
                "options": [
                    "Whether term loans were applied for the purpose for which they were obtained (detecting fund diversion), and whether funds raised on a short-term basis were utilized for long-term purposes (asset-liability mismatch)",
                    "Whether the company pays bank managers higher interest rates than corporate credit cards",
                    "Whether bank cheques were signed with blue ink rather than black ink",
                    "Whether corporate loan applications were submitted on public holidays"
                ],
                "answerIndex": 0,
                "why": "CARO 2020 Clause (ix)(c) mandates reporting whether term loans were applied for the sanctioned purpose, while Clause (ix)(d) requires disclosing whether short-term borrowings were inappropriately used for long-term commitments."
            }
        },
        {
            "title": "CARO 2020: Fraud, Whistleblower, Nidhi, Internal Audit & Cash Losses (Clauses xi to xxi)",
            "say": [
                "The remaining clauses of CARO 2020 (Clauses xi through xxi) provide critical intelligence on fraud detection, corporate whistleblower transparency, related party compliance, non-cash transactions, registration under RBI Act, cash losses, auditor resignations, financial ratio viability, and CSR compliance.",
                "Clause (xi) governs Fraud and Whistleblower complaints: (a) whether any fraud by the company or any fraud on the company has been noticed or reported during the year, and if so, nature and amount involved; (b) whether any report under Section 143(12) has been filed by the auditors in Form ADT-4 with the Central Government; and (c) whether the auditor has considered whistle-blower complaints, if any, received during the year by the company. Mandatory consideration of whistleblower complaints represents a revolutionary shift, empowering external auditors to examine confidential whistleblower logs.",
                "Clause (xiv) requires the auditor to state: (a) whether the company has an internal audit system commensurate with the size and nature of its business (mandated under Section 138); and (b) whether the reports of the Internal Auditors for the period under audit were considered by the statutory auditor (aligning with SA 610). Clause (xvi) verifies whether the company is required to be registered under Section 45-IA of the Reserve Bank of India Act, 1934 as an NBFC or Core Investment Company (CIC).",
                "Clause (xvii) mandates disclosing whether the company has incurred Cash Losses in the financial year and in the immediately preceding financial year, and if so, the amount of cash losses. Clause (xviii) states whether there has been any resignation of the statutory auditors during the year, and whether the incoming auditor has taken into consideration the issues, objections, or concerns raised by the outgoing auditor under Section 140. Clause (xix) requires the auditor to certify, based on financial ratios, ageing and expected dates of realization of financial assets and payment of financial liabilities, whether any material uncertainty exists that the company is capable of meeting its liabilities existing at the date of balance sheet as and when they fall due within a period of one (1) year. Finally, Clause (xx) audits CSR unspent funds under Section 135, and Clause (xxi) audits qualifications in subsidiary CARO reports."
            ],
            "example": "During an annual audit, the statutory auditor reviews the internal vigil mechanism log under Clause (xi)(c) and discovers two anonymous whistleblower complaints alleging kickbacks in scrap steel disposals. The auditor investigates, confirming Rs 85 Lakh in unrecorded scrap sales. Furthermore, under Clause (xvii), the auditor reports that the company incurred cash losses of Rs 28 Crore in FY 2025-26 and Rs 34 Crore in FY 2024-25. Finally, under Clause (xix), based on a current ratio of 0.62 and negative operating cash flows, the auditor issues an adverse remark on 1-year debt service viability.",
            "code": '''def evaluate_caro_clauses_xi_to_xxi(
    fraud_noticed_or_reported: bool,
    fraud_amount_cr: float,
    adt4_filed_with_mca: bool,
    whistleblower_complaints_count: int,
    cash_loss_current_year_cr: float,
    cash_loss_prior_year_cr: float,
    outgoing_auditor_resigned: bool,
    outgoing_auditor_objections_considered: bool,
    current_ratio: float,
    dscr_ratio: float,
    can_meet_1yr_liabilities: bool,
    csr_unspent_transferred_to_fund_sec135: bool
) -> dict:
    adverse_clauses = []
    
    # Clause (xi): Fraud & Whistleblower
    if fraud_noticed_or_reported:
        adverse_clauses.append(f"Clause (xi)(a): Fraud reported during the year amounting to INR {fraud_amount_cr:.2f} Cr")
    if adt4_filed_with_mca:
        adverse_clauses.append("Clause (xi)(b): Form ADT-4 filed with Central Government under Section 143(12)")
    if whistleblower_complaints_count > 0:
        adverse_clauses.append(f"Clause (xi)(c): Considered {whistleblower_complaints_count} whistleblower complaints during audit procedures")
        
    # Clause (xvii): Cash Losses
    if cash_loss_current_year_cr > 0:
        adverse_clauses.append(f"Clause (xvii): Incurred cash losses of INR {cash_loss_current_year_cr:.2f} Cr in current FY and INR {cash_loss_prior_year_cr:.2f} Cr in prior FY")
        
    # Clause (xviii): Auditor Resignation
    if outgoing_auditor_resigned and not outgoing_auditor_objections_considered:
        adverse_clauses.append("Clause (xviii): Failure to evaluate concerns/objections raised by outgoing auditor")
        
    # Clause (xix): 1-year Financial Viability (Going concern indicator)
    if not can_meet_1yr_liabilities or current_ratio < 1.0 or dscr_ratio < 1.0:
        adverse_clauses.append(f"Clause (xix): MATERIAL UNCERTAINTY on 1-year liability realization (Current Ratio: {current_ratio:.2f}, DSCR: {dscr_ratio:.2f})")
        
    # Clause (xx): CSR Compliance
    if not csr_unspent_transferred_to_fund_sec135:
        adverse_clauses.append("Clause (xx): Unspent CSR obligations not transferred to specified Fund within statutory timeline")
        
    return {
        "clauses_evaluated": ["Clause (xi) Fraud", "Clause (xvii) Cash Losses", "Clause (xviii) Auditor Resignation", "Clause (xix) Financial Viability", "Clause (xx) CSR"],
        "caro_disclosures_count": len(adverse_clauses),
        "caro_disclosures": adverse_clauses,
        "audit_viability_verdict": "SIGNIFICANT_FINANCIAL_DISTRESS_AND_GOVERNANCE_WARNING" if len(adverse_clauses) >= 3 else "ROUTINE_CARO_DISCLOSURE"
    }

governance_eval = evaluate_caro_clauses_xi_to_xxi(
    fraud_noticed_or_reported=True,
    fraud_amount_cr=0.85,
    adt4_filed_with_mca=False,
    whistleblower_complaints_count=2,
    cash_loss_current_year_cr=28.0,
    cash_loss_prior_year_cr=34.0,
    outgoing_auditor_resigned=True,
    outgoing_auditor_objections_considered=True,
    current_ratio=0.62,
    dscr_ratio=0.74,
    can_meet_1yr_liabilities=False,
    csr_unspent_transferred_to_fund_sec135=True
)
print("CARO 2020 Clauses (xi) to (xxi) Advanced Governance & Viability Audit:")
print(f"  Viability Verdict      : {governance_eval['audit_viability_verdict']}")
print(f"  Disclosures Accumulated: {governance_eval['caro_disclosures_count']}")
print("  Statutory Disclosures  :")
for d in governance_eval['caro_disclosures']:
    print(f"    * {d}")
''',
            "tryIt": "Set can_meet_1yr_liabilities to True, current_ratio to 1.45, dscr_ratio to 1.80, and cash_loss_current_year_cr to 0 to observe Clause (xvii) and (xix) distress warnings disappear.",
            "check": {
                "question": "Under Clause (xix) of CARO 2020, what specific forward-looking assurance must the statutory auditor certify regarding the company's financial health?",
                "options": [
                    "Whether based on financial ratios, ageing, expected dates of realization of financial assets and liabilities, any material uncertainty exists that the company is capable of meeting its liabilities existing at balance sheet date as and when they fall due within a period of one (1) year",
                    "Whether the company's stock price will double on the stock exchange over the next 12 months",
                    "Whether the company will open at least 50 new international retail branches",
                    "Whether all corporate employees will receive a mandatory 15% salary increase"
                ],
                "answerIndex": 0,
                "why": "CARO 2020 Clause (xix) requires auditors to certify whether on the basis of financial ratios, ageing, realization schedules, and board plans, there is material uncertainty regarding the company's capability to meet liabilities falling due within one year."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day09_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day09_data.json successfully!")
