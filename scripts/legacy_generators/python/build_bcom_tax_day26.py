"""
Build Day 26 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Tax Audits under Section 44AB & Form 3CD Reporting (Clauses 13-44, Disallowances & GST Cross-Reconciliation)
"""
import json
import os

day_data = {
    "day": 26,
    "title": "Tax Audits under Section 44AB & Form 3CD Reporting: Clauses 13 to 44 & Cross-Reconciliations",
    "parts": [
        {
            "title": "Section 44AB Audit Mandate, Thresholds & Form 3CA/3CB Framework",
            "say": [
                "In Indian corporate tax administration, Section 44AB mandates that every person carrying on business whose total sales, turnover, or gross receipts exceed statutory thresholds must get their accounts audited by an independent Chartered Accountant. The tax audit is not a substitute for the statutory financial audit under the Companies Act; it is a specialized fiscal audit designed to verify compliance with Income Tax Act deductions, allowances, and reporting requirements.",
                "The general threshold for business under Section 44AB(a) is Rs 1 Crore in gross turnover. However, to incentivize digital payments, the Finance Act introduced an expanded threshold of Rs 10 Crore, provided that aggregate cash receipts and aggregate cash payments during the financial year do not exceed 5% of total receipts and payments respectively.",
                "Tax audit reports are certified through two distinct forms: (1) Form 3CA, applicable to companies whose financial accounts are already audited under the Companies Act, 2013; and (2) Form 3CB, applicable to entities (such as partnerships, LLPs, or sole proprietorships) whose accounts are not required to be audited under any other law.",
                "Both Form 3CA and Form 3CB are accompanied by the extensive statutory disclosure statement: Form 3CD. Form 3CD comprises 44 specialized clauses requiring granular certifications of accounting methods, valuation policies, depreciation schedules, statutory liabilities, and related-party payments. The deadline for e-filing the tax audit report is September 30 following the end of the previous year."
            ],
            "example": "A manufacturing company with Rs 8 Crore in annual sales transacts 97% of its payments and receipts through NEFT/RTGS and corporate credit cards. Because cash transactions are only 3% (under the 5% threshold), the company is exempt from tax audit under the expanded Rs 10 Crore limit. Conversely, if cash transactions reach 6%, the threshold snaps back to Rs 1 Crore, making Section 44AB audit mandatory.",
            "code": '''def evaluate_sec44ab_applicability(gross_turnover_cr: float, total_receipts_cr: float, cash_receipts_cr: float, total_payments_cr: float, cash_payments_cr: float) -> dict:
    cash_receipt_pct = (cash_receipts_cr / total_receipts_cr) * 100.0 if total_receipts_cr > 0 else 0.0
    cash_payment_pct = (cash_payments_cr / total_payments_cr) * 100.0 if total_payments_cr > 0 else 0.0
    
    digital_incentive_qualifies = (cash_receipt_pct <= 5.0) and (cash_payment_pct <= 5.0)
    effective_threshold_cr = 10.0 if digital_incentive_qualifies else 1.0
    
    is_audit_mandatory = gross_turnover_cr > effective_threshold_cr
    
    return {
        "gross_turnover_cr": gross_turnover_cr,
        "cash_receipt_pct": cash_receipt_pct,
        "cash_payment_pct": cash_payment_pct,
        "digital_qualifies_under_proviso": digital_incentive_qualifies,
        "statutory_threshold_cr": effective_threshold_cr,
        "tax_audit_mandatory": is_audit_mandatory,
        "statutory_form": "Form 3CA + Form 3CD" if is_audit_mandatory else "Exempt",
        "filing_deadline": "September 30" if is_audit_mandatory else "Not Applicable"
    }

audit_eval = evaluate_sec44ab_applicability(
    gross_turnover_cr=8.5,
    total_receipts_cr=9.0,
    cash_receipts_cr=0.25,
    total_payments_cr=7.5,
    cash_payments_cr=0.30
)
print(f"Gross Turnover: INR {audit_eval['gross_turnover_cr']} Cr")
print(f"Cash Receipts: {audit_eval['cash_receipt_pct']:.2f}% | Cash Payments: {audit_eval['cash_payment_pct']:.2f}%")
print(f"Expanded Rs 10 Cr Threshold Applicable: {audit_eval['digital_qualifies_under_proviso']}")
print(f"Tax Audit Mandatory: {audit_eval['tax_audit_mandatory']} ({audit_eval['statutory_form']})")
''',
            "tryIt": "Increase cash_receipts_cr to 0.55 Cr (6.11%) to verify that exceeding the 5% cash limit reduces the statutory threshold to Rs 1 Crore, triggering mandatory audit.",
            "check": {
                "question": "Under what condition does the statutory turnover threshold for business tax audit under Section 44AB increase from Rs 1 Crore to Rs 10 Crore?",
                "options": [
                    "Aggregate cash receipts and cash payments do not exceed 5% of total receipts and payments respectively",
                    "The business is incorporated as a Private Limited Company with at least 50 employees",
                    "The company has exported more than 50% of its manufactured goods",
                    "The business operates in a Special Economic Zone (SEZ)"
                ],
                "answerIndex": 0,
                "why": "The proviso to Section 44AB(a) provides that the threshold is Rs 10 Crore if the aggregate of all amounts received in cash does not exceed 5% of total receipts and aggregate cash payments do not exceed 5% of total payments."
            }
        },
        {
            "title": "Form 3CD PGBP Disallowance Clauses (Clauses 20, 21, 26 & 27)",
            "say": [
                "Form 3CD is the primary evidentiary foundation upon which the Centralized Processing Centre and Assessing Officers verify PGBP adjustments. Disclosures made by the tax auditor in Form 3CD carry direct statutory consequences; under Section 143(1)(a)(iv), items disallowed in Form 3CD are automatically added to taxable income during initial return processing.",
                "Clause 20(b) requires granular reporting of employee statutory contributions (Provident Fund, ESI, Superannuation). The tax auditor must certify: the sum received from employees, due date for payment under the respective labor act, actual date of payment, and the extent of delay. Following the Supreme Court ruling in Checkmate Services, any payment made past the labor due date is permanently disallowed under Section 36(1)(va).",
                "Clause 21 covers statutory disallowances under Section 40, Section 40A, and Section 43B. This includes: Clause 21(a) disallowance of payments to non-residents without TDS under Section 40(a)(i) (100% disallowance) or to residents under Section 40(a)(ia) (30% disallowance); Clause 21(d) cash payments exceeding Rs 10,000 to a person in a day under Section 40A(3); and Clause 21(g) personal, political, or penal expenditures under Section 37(1).",
                "Clause 26 tracks statutory liabilities covered under Section 43B—including GST payable, customs duty, employee bonus, bank interest, and leave encashment—disclosing whether payments were cleared before the Section 139(1) return filing due date."
            ],
            "example": "In Form 3CD, the tax auditor reports: (a) Rs 3 Lakh in employee PF deposited 2 days after the 15th of the month, (b) Rs 10 Lakh paid to an interior decorator without TDS, and (c) Rs 4 Lakh in state GST paid in December after the October 31 return due date. The CPC automatically disallows Rs 3 Lakh under Section 36(1)(va), Rs 3 Lakh (30% of Rs 10L) under Section 40(a)(ia), and Rs 4 Lakh under Section 43B.",
            "code": '''def calculate_form_3cd_disallowances(pf_delayed_deposits: float, domestic_vendor_no_tds: float, cash_payments_over_10k: float, sec43b_unpaid_statutory_dues: float) -> dict:
    disallowances = []
    total_addition = 0.0
    
    # Clause 20(b): Sec 36(1)(va) Employee PF deposited late (100% disallowance post-Checkmate Services)
    if pf_delayed_deposits > 0:
        disallowances.append(f"Clause 20(b) / Sec 36(1)(va): Delayed employee PF (INR {pf_delayed_deposits:,.2f})")
        total_addition += pf_delayed_deposits
        
    # Clause 21(b): Sec 40(a)(ia) Domestic vendor payment without TDS (30% disallowance)
    if domestic_vendor_no_tds > 0:
        tds_disallowance = domestic_vendor_no_tds * 0.30
        disallowances.append(f"Clause 21(b) / Sec 40(a)(ia): 30% TDS default on domestic payment (INR {tds_disallowance:,.2f})")
        total_addition += tds_disallowance
        
    # Clause 21(d): Sec 40A(3) Cash expenditure > Rs 10,000 per day (100% disallowance)
    if cash_payments_over_10k > 0:
        disallowances.append(f"Clause 21(d) / Sec 40A(3): Excess cash payments (INR {cash_payments_over_10k:,.2f})")
        total_addition += cash_payments_over_10k
        
    # Clause 26: Sec 43B Unpaid statutory dues before return filing date (100% disallowance)
    if sec43b_unpaid_statutory_dues > 0:
        disallowances.append(f"Clause 26 / Sec 43B: Unpaid GST/statutory dues (INR {sec43b_unpaid_statutory_dues:,.2f})")
        total_addition += sec43b_unpaid_statutory_dues
        
    tax_leakage = total_addition * 0.25168  # Sec 115BAA corporate tax rate
    
    return {
        "total_disallowance_inr": total_addition,
        "corporate_tax_liability_inr": tax_leakage,
        "disallowance_breakdown": disallowances
    }

form3cd_res = calculate_form_3cd_disallowances(
    pf_delayed_deposits=300000.0,
    domestic_vendor_no_tds=1000000.0,
    cash_payments_over_10k=50000.0,
    sec43b_unpaid_statutory_dues=400000.0
)
print(f"Total Form 3CD Additions to PGBP: INR {form3cd_res['total_disallowance_inr']:,.2f}")
print(f"Resulting Tax Liability (25.168%): INR {form3cd_res['corporate_tax_liability_inr']:,.2f}")
print("Statutory Audit Findings:")
for d in form3cd_res['disallowance_breakdown']:
    print(f"  -> {d}")
''',
            "tryIt": "Set domestic_vendor_no_tds to 0.0 to observe the 30% Section 40(a)(ia) disallowance dropping out of the PGBP addition calculation.",
            "check": {
                "question": "What percentage of expenditure is disallowed under Section 40(a)(ia) and reported in Clause 21(b) of Form 3CD when tax is not deducted on payments to a resident contractor?",
                "options": [
                    "30% of the payment value is disallowed",
                    "100% of the payment value is disallowed",
                    "50% of the payment value is disallowed",
                    "Zero disallowance if the contractor has an active GSTIN"
                ],
                "answerIndex": 0,
                "why": "Section 40(a)(ia) provides that thirty percent (30%) of any sum payable to a resident on which tax is deductible at source and has not been deducted or paid shall be disallowed."
            }
        },
        {
            "title": "Related Party Reporting & Deemed Dividends (Clauses 23, 31 & 36A)",
            "say": [
                "Form 3CD incorporates strict disclosures designed to detect artificial profit siphoning and unrecorded corporate benefits among related entities. Corporate tax controllers must maintain audited ledgers supporting Clauses 23, 31, and 36A.",
                "Clause 23 mandates the comprehensive disclosure of all payments made to persons specified under Section 40A(2)(b)—including directors, major shareholders holding not less than 20% voting power, and affiliated sister concerns. The tax auditor must report the name of the related party, PAN, relationship, transaction value, and state whether the payment is excessive or unreasonable having regard to open market value.",
                "Clause 31 requires exhaustive certification of compliance with Section 269SS and Section 269T. Section 269SS prohibits accepting any loan, deposit, or specified advance of Rs 20,000 or more otherwise than by an account payee cheque, bank draft, or electronic clearing system. Section 269T enforces identical restrictions on loan repayments. Violations trigger equivalent 100% penalties under Section 271D and Section 271E.",
                "Clause 36A covers deemed dividends under Section 2(22)(e). It requires disclosure of any payment by way of advance or loan made by a closely held company to a shareholder holding not less than 10% voting power, or to any concern in which such shareholder has a substantial interest (20%+ share), to the extent of accumulated profits."
            ],
            "example": "Company A advances a short-term cash loan of Rs 50,000 to Director X. Under Clause 31(a), the auditor certifies this as a cash loan violating Section 269SS. The company faces a 100% penalty of Rs 50,000 under Section 271D. Furthermore, if Company A has accumulated profits, the loan is treated as a deemed dividend under Section 2(22)(e) and reported in Clause 36A.",
            "code": '''def evaluate_related_party_and_sec269ss(related_payments_cr: float, loan_accepted_cash: float, loan_repaid_cash: float, accumulated_profits_cr: float, shareholder_loan_cr: float) -> dict:
    violations = []
    penalties = 0.0
    
    # Clause 31(a): Section 269SS Violation (Accepting loan >= Rs 20,000 in cash)
    if loan_accepted_cash >= 20000.0:
        violations.append(f"Clause 31(a) / Sec 269SS: Cash loan accepted (INR {loan_accepted_cash:,.2f})")
        penalties += loan_accepted_cash  # 100% penalty under Sec 271D
        
    # Clause 31(b): Section 269T Violation (Repaying loan >= Rs 20,000 in cash)
    if loan_repaid_cash >= 20000.0:
        violations.append(f"Clause 31(b) / Sec 269T: Cash loan repaid (INR {loan_repaid_cash:,.2f})")
        penalties += loan_repaid_cash  # 100% penalty under Sec 271E
        
    # Clause 36A: Section 2(22)(e) Deemed Dividend
    deemed_dividend_cr = min(shareholder_loan_cr, accumulated_profits_cr)
    
    return {
        "clause_23_related_payments_cr": related_payments_cr,
        "sec269ss_violations_count": len(violations),
        "potential_sec271d_penalties_inr": penalties,
        "deemed_dividend_sec2_22_e_cr": deemed_dividend_cr,
        "audit_violations": violations
    }

rp_audit = evaluate_related_party_and_sec269ss(
    related_payments_cr=2.5,
    loan_accepted_cash=75000.0,
    loan_repaid_cash=30000.0,
    accumulated_profits_cr=1.5,
    shareholder_loan_cr=0.40
)
print(f"Related Party Transactions (Clause 23): INR {rp_audit['clause_23_related_payments_cr']:.2f} Cr")
print(f"Deemed Dividend (Clause 36A): INR {rp_audit['deemed_dividend_sec2_22_e_cr']:.2f} Cr")
print(f"Potential Penalties under Sec 271D/271E: INR {rp_audit['potential_sec271d_penalties_inr']:,.2f}")
for v in rp_audit['audit_violations']:
    print(f"  [!] {v}")
''',
            "tryIt": "Set loan_accepted_cash and loan_repaid_cash to 0.0 to verify that conducting all loan transactions through banking channels eliminates Section 271D/271E penalty liabilities.",
            "check": {
                "question": "What is the monetary threshold under Section 269SS beyond which accepting a loan or deposit otherwise than by an account payee cheque or electronic bank transfer is prohibited?",
                "options": [
                    "Rs 20,000 or more",
                    "Rs 10,000 or more",
                    "Rs 50,000 or more",
                    "Rs 2,00,000 or more"
                ],
                "answerIndex": 0,
                "why": "Section 269SS explicitly bars any person from taking or accepting any loan or deposit of twenty thousand rupees (Rs 20,000) or more otherwise than by an account payee cheque, bank draft, or electronic clearing system."
            }
        },
        {
            "title": "Clause 44: Cross-Verification of Expenditure with GST Registered Entities",
            "say": [
                "The most operationally demanding addition to Form 3CD in recent tax reform history is Clause 44: Breakdown of total expenditure of entities registered or not registered under the GST Act. Inserted to establish an automated digital cross-verification pipeline between corporate general ledgers and GST portal returns, Clause 44 requires companies to categorize every single rupee of operational and capital expenditure debited to the profit and loss account.",
                "Under Clause 44, total expenditure must be dissected into five distinct columns: (1) Total amount of expenditure incurred during the year; (2) Expenditure in respect of entities registered under GST, further split into: (a) relating to goods or services exempt from GST, (b) relating to entities falling under the composition scheme, and (c) relating to other registered entities; (3) Total payment to registered entities; and (4) Expenditure relating to entities not registered under GST.",
                "Tax authorities use Clause 44 data to identify corporate procurement leakage: comparing payments made to unregistered vendors against reverse charge liabilities under Section 9(4) of the CGST Act, and matching total purchases against Form GSTR-2B credit feeds.",
                "Corporate enterprise resource planning (ERP) systems must tag every vendor master with active GSTIN status, MSME categorization, and supply classifications to automate Clause 44 tables during year-end tax audit closing."
            ],
            "example": "A corporation incurs Rs 50 Crore in total operating expenditure. The ERP extracts vendor GSTIN masters, generating the Clause 44 breakdown: Rs 38 Crore to registered taxable vendors, Rs 2 Crore to composition vendors, Rs 4 Crore on exempt healthcare/education, and Rs 6 Crore to unregistered contractors, reconciling 100% of P&L debits.",
            "code": '''def generate_clause_44_reconciliation(total_pnl_expenditure_cr: float, exp_registered_taxable_cr: float, exp_registered_composition_cr: float, exp_registered_exempt_cr: float, exp_unregistered_cr: float) -> dict:
    total_registered_cr = exp_registered_taxable_cr + exp_registered_composition_cr + exp_registered_exempt_cr
    total_reported_cr = total_registered_cr + exp_unregistered_cr
    
    variance_cr = abs(total_pnl_expenditure_cr - total_reported_cr)
    is_balanced = variance_cr < 0.001
    
    unregistered_pct = (exp_unregistered_cr / total_pnl_expenditure_cr) * 100.0 if total_pnl_expenditure_cr > 0 else 0.0
    
    return {
        "total_pnl_expenditure_cr": total_pnl_expenditure_cr,
        "expenditure_registered_taxable_cr": exp_registered_taxable_cr,
        "expenditure_registered_composition_cr": exp_registered_composition_cr,
        "expenditure_registered_exempt_cr": exp_registered_exempt_cr,
        "total_expenditure_registered_cr": total_registered_cr,
        "expenditure_unregistered_entities_cr": exp_unregistered_cr,
        "unregistered_ratio_pct": unregistered_pct,
        "reconciled_total_cr": total_reported_cr,
        "variance_cr": variance_cr,
        "is_reconciled": is_balanced
    }

c44_res = generate_clause_44_reconciliation(
    total_pnl_expenditure_cr=50.0,
    exp_registered_taxable_cr=38.0,
    exp_registered_composition_cr=2.0,
    exp_registered_exempt_cr=4.0,
    exp_unregistered_cr=6.0
)
print("Form 3CD Clause 44 GST Cross-Reconciliation:")
print(f"  Total P&L Debits: INR {c44_res['total_pnl_expenditure_cr']:.2f} Cr")
print(f"  Expenditure to Registered Entities: INR {c44_res['total_expenditure_registered_cr']:.2f} Cr (Taxable: {c44_res['expenditure_registered_taxable_cr']:.2f} Cr)")
print(f"  Expenditure to Unregistered Entities: INR {c44_res['expenditure_unregistered_entities_cr']:.2f} Cr ({c44_res['unregistered_ratio_pct']:.2f}%)")
print(f"  100% Reconciled: {c44_res['is_reconciled']} (Variance: INR {c44_res['variance_cr']:.4f} Cr)")
''',
            "tryIt": "Modify exp_unregistered_cr to 5.5 Cr to observe the model flagging an unreconciled variance between general ledger expenditure and Clause 44 disclosures.",
            "check": {
                "question": "What is the primary disclosure objective of Clause 44 in Form 3CD of the Tax Audit Report?",
                "options": [
                    "To provide a complete breakdown of total corporate expenditure incurred with entities registered and not registered under the GST Act",
                    "To disclose all foreign exchange hedging contracts entered into with international banks",
                    "To report the personal travel expenditures of the board of directors",
                    "To certify corporate income tax deductions under Section 80G"
                ],
                "answerIndex": 0,
                "why": "Clause 44 of Form 3CD mandates the disclosure of the breakdown of total expenditure of entities registered or not registered under the GST Act."
            }
        },
        {
            "title": "Direct Tax & GST 3-Way Reconciliations (Turnover, Inward ITC & Clause 44)",
            "say": [
                "The ultimate frontier of corporate tax risk management is the synthesis of Direct and Indirect Tax Reconciliations. Historically, corporate direct tax teams and indirect tax teams operated in isolated silos. Today, the tax department's automated cross-database matching engines continuously compare turnover and expenditure figures across general ledgers, Form 26AS, Form GSTR-1, Form GSTR-3B, and Form 3CD.",
                "Turnover Reconciliation: The corporate controller must execute an unbroken reconciliation between Revenue from Operations in the audited Financial Statements, Total Turnover declared in Form 3CD Clause 40, and Outward Taxable Turnover reported in Table 3.1 of Form GSTR-3B. Permissible timing differences—such as unbilled revenue under Ind AS 115, financial interest income exempt under GST, and stock transfers taxable under GST Schedule I but eliminated in corporate consolidation—must be documented on an ongoing basis.",
                "Inward Expenditure Reconciliation: Comparing input tax credits claimed in GSTR-3B Table 4 with trade purchases and Clause 44 expenditures ensures zero discrepancy between corporate P&L asset debits and the electronic credit ledger.",
                "Establishing an automated three-way reconciliation engine before signing off on Form 3CA/3CD eliminates automated scrutiny notices generated by the CPC and DGGI (Directorate General of GST Intelligence)."
            ],
            "example": "An enterprise reports Rs 100 Crore in P&L revenue. GST GSTR-3B turnover is Rs 108 Crore. The direct tax auditor reconciles the Rs 8 Crore difference: Rs 5 Crore inter-state branch stock transfers (Schedule I supply) and Rs 3 Crore unbilled revenue recognized under Ind AS 115, certifying zero revenue leakage.",
            "code": '''def execute_three_way_tax_reconciliation(pnl_revenue_cr: float, gstr3b_turnover_cr: float, branch_transfers_sch1_cr: float, unbilled_ind_as115_cr: float, interest_income_exempt_gst_cr: float) -> dict:
    # Bridge P&L Revenue to GST Turnover:
    # GST Turnover = P&L Revenue + Inter-branch transfers (Sec 7 Schedule I) - Unbilled revenue + GST adjustments
    reconciled_gst_turnover = pnl_revenue_cr + branch_transfers_sch1_cr - unbilled_ind_as115_cr - interest_income_exempt_gst_cr
    variance_cr = abs(gstr3b_turnover_cr - reconciled_gst_turnover)
    is_fully_reconciled = variance_cr < 0.001
    
    return {
        "pnl_financial_revenue_cr": pnl_revenue_cr,
        "gstr3b_reported_turnover_cr": gstr3b_turnover_cr,
        "add_inter_branch_stock_transfers_cr": branch_transfers_sch1_cr,
        "less_unbilled_revenue_ind_as115_cr": unbilled_ind_as115_cr,
        "less_exempt_interest_cr": interest_income_exempt_gst_cr,
        "bridged_gst_turnover_cr": reconciled_gst_turnover,
        "reconciliation_variance_cr": variance_cr,
        "is_audited_and_certified": is_fully_reconciled,
        "status": "100% Reconciled: Zero DGGI Scrutiny Risk" if is_fully_reconciled else f"Discrepancy of INR {variance_cr:.4f} Cr Detected"
    }

recon_res = execute_three_way_tax_reconciliation(
    pnl_revenue_cr=100.0,
    gstr3b_turnover_cr=102.0,
    branch_transfers_sch1_cr=5.0,
    unbilled_ind_as115_cr=2.0,
    interest_income_exempt_gst_cr=1.0
)
print("Direct Tax & GST Turnover Reconciliation:")
print(f"  Financial P&L Revenue : INR {recon_res['pnl_financial_revenue_cr']:.2f} Cr")
print(f"  GSTR-3B GST Turnover  : INR {recon_res['gstr3b_reported_turnover_cr']:.2f} Cr")
print(f"  Bridged GST Turnover  : INR {recon_res['bridged_gst_turnover_cr']:.2f} Cr")
print(f"  Variance              : INR {recon_res['reconciliation_variance_cr']:.4f} Cr")
print(f"  Certification         : {recon_res['status']}")
''',
            "tryIt": "Adjust branch_transfers_sch1_cr to 4.0 Cr to observe how an un-reconciled variance between general ledger turnover and GST returns is flagged immediately.",
            "check": {
                "question": "Why does taxable turnover reported in Form GSTR-3B frequently differ from commercial revenue reported in audited financial statements and Form 3CD?",
                "options": [
                    "Due to legitimate statutory differences such as inter-branch stock transfers under Schedule I, Ind AS 115 unbilled revenue timing, and GST-exempt financial income",
                    "Because corporate accountants are permitted to arbitrarily reduce turnover for income tax purposes",
                    "Because GST returns are only required to report cash sales",
                    "Because financial accounts strictly exclude all goods sales"
                ],
                "answerIndex": 0,
                "why": "Legitimate differences arise from Schedule I deemed supplies (taxable under GST but eliminated in P&L), Ind AS 115 contract revenue recognition timing, and exempt income categories."
            }
        }
    ]
}

with open("scripts/bcom_tax_day26_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day26_data.json")
