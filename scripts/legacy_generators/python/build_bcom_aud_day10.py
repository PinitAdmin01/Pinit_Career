"""
Build Day 10 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Milestone Project 2: Enterprise Statutory Audit & CARO 2020 Compliance Cockpit
"""
import json

day_data = {
    "day": 10,
    "title": "Milestone Project 2: Enterprise Statutory Audit, IFCoFR Verification & CARO 2020 Compliance Cockpit",
    "parts": [
        {
            "title": "Master Statutory Audit Risk & Materiality Allocation Engine",
            "say": [
                "Welcome to Milestone Project 2: The Enterprise Statutory Audit, IFCoFR Verification & CARO 2020 Compliance Cockpit. In this milestone capstone, you step into the role of the Senior Statutory Audit Manager and Engagement Partner of an independent accounting firm, commanding the complete year-end statutory audit of Apex Global Infrastructure & Logistics Ltd, a multi-divisional listed conglomerate with Rs 3,500 Crore in annual revenue, Rs 280 Crore in Profit Before Tax, and Rs 4,200 Crore in consolidated assets.",
                "In Part 1, your objective is to establish the Master Audit Strategy and Quantitative Materiality Waterfall under SA 300, SA 315, and SA 320. Financial reporting integrity begins with mathematical rigor; planning decisions dictate the scope, sample sizes, and threshold boundaries across every operating division of the enterprise.",
                "You will benchmark overall materiality against 5% of normalized Profit Before Tax (PBT = Rs 280 Crore), resulting in Overall Materiality of Rs 14.0 Crore. Assessing the corporate governance environment and past control deficiencies as Moderate-to-High Risk, you calculate Performance Materiality with a 35% haircut, establishing a working threshold of Rs 9.1 Crore (65% of overall materiality).",
                "Furthermore, you establish the Clearly Trivial Threshold (De Minimis) at 4% of overall materiality (Rs 56.0 Lakh), below which identified audit differences are disregarded. You allocate performance materiality across core balance sheet cycles—Property, Plant and Equipment, Trade Receivables, Inventory, and Borrowings—calculating allowable Detection Risk and deploying statistical Monetary Unit Sampling (MUS) sample size parameters."
            ],
            "example": "At the planning meeting, the audit partner models materiality: with PBT at Rs 280 Crore, Overall Materiality is set at Rs 14.0 Crore, Performance Materiality at Rs 9.1 Crore, and De Minimis at Rs 56 Lakh. The engagement team uses this framework to sample Rs 650 Crore in capital expenditure projects, setting sampling intervals at Rs 3.03 Crore and generating a statistical sample size of 215 capex vouchers.",
            "code": '''class MasterAuditStrategyEngine:
    def __init__(self, entity_name: str, revenue_cr: float, pbt_cr: float, assets_cr: float):
        self.entity_name = entity_name
        self.revenue_cr = revenue_cr
        self.pbt_cr = pbt_cr
        self.assets_cr = assets_cr
        
    def compute_materiality_waterfall(self, control_risk_rating: str = "MODERATE") -> dict:
        # SA 320: 5% of PBT
        overall_mat = self.pbt_cr * 0.05
        
        # Haircut based on control risk
        pm_factor = 0.65 if control_risk_rating.upper() == "MODERATE" else 0.50
        performance_mat = overall_mat * pm_factor
        trivial_threshold = overall_mat * 0.04
        
        return {
            "overall_materiality_cr": round(overall_mat, 2),
            "performance_materiality_cr": round(performance_mat, 2),
            "clearly_trivial_cr": round(trivial_threshold, 3),
            "clearly_trivial_lakhs": round(trivial_threshold * 100.0, 1),
            "pm_factor_pct": pm_factor * 100.0
        }
        
    def allocate_cycle_testing_scope(self, account_name: str, account_balance_cr: float, performance_mat_cr: float) -> dict:
        # Classical MUS Sampling Interval: SI = PM / 3.0 (95% confidence)
        sampling_interval_cr = performance_mat_cr / 3.0
        sample_size = max(30, int(account_balance_cr / sampling_interval_cr))
        
        return {
            "account_name": account_name,
            "balance_cr": account_balance_cr,
            "sampling_interval_cr": round(sampling_interval_cr, 3),
            "statistical_sample_size": sample_size,
            "coverage_pct": round((sample_size * sampling_interval_cr / account_balance_cr) * 100.0, 1)
        }

strategy_engine = MasterAuditStrategyEngine("Apex Global Infrastructure Ltd", revenue_cr=3500.0, pbt_cr=280.0, assets_cr=4200.0)
mat = strategy_engine.compute_materiality_waterfall(control_risk_rating="MODERATE")
capex_scope = strategy_engine.allocate_cycle_testing_scope("PPE & Capex Additions", account_balance_cr=650.0, performance_mat_cr=mat['performance_materiality_cr'])

print(f"MASTER AUDIT PLANNING — {strategy_engine.entity_name.upper()}")
print(f"  Overall Materiality (5% PBT): INR {mat['overall_materiality_cr']} Crores")
print(f"  Performance Materiality     : INR {mat['performance_materiality_cr']} Crores ({mat['pm_factor_pct']}%)")
print(f"  Clearly Trivial De Minimis  : INR {mat['clearly_trivial_lakhs']} Lakhs")
print(f"  Cycle: {capex_scope['account_name']} (INR {capex_scope['balance_cr']} Cr)")
print(f"  -> Sampling Interval        : INR {capex_scope['sampling_interval_cr']} Crores")
print(f"  -> Statistical Sample Size  : {capex_scope['statistical_sample_size']} items (Coverage: {capex_scope['coverage_pct']}%)")
''',
            "tryIt": "Adjust pbt_cr to 350.0 Cr to observe the entire materiality waterfall expand proportionately, increasing the sampling interval and optimizing audit testing efficiency.",
            "check": {
                "question": "In the Milestone Project 2 strategy engine, what is the statutory relationship between Overall Materiality (Rs 14.0 Cr), Performance Materiality (Rs 9.1 Cr), and the Sampling Interval?",
                "options": [
                    "Performance Materiality is set at 65% of Overall Materiality (Rs 9.1 Cr) to reduce aggregate undetected error risk, and the Sampling Interval (Rs 3.03 Cr) is derived by dividing Performance Materiality by the 95% confidence reliability coefficient of 3.0",
                    "The Sampling Interval is equal to the total net profit of the company divided by 365 days",
                    "Performance Materiality must always equal exactly 100% of the company's authorized share capital",
                    "Overall Materiality is determined by the Board of Directors without auditor input"
                ],
                "answerIndex": 0,
                "why": "Under SA 320 and SA 530, Performance Materiality incorporates a risk haircut (here 65%) to buffer against aggregated errors, and Monetary Unit Sampling derives the sampling interval by dividing PM by the Poisson 95% zero-error reliability factor (3.0)."
            }
        },
        {
            "title": "Internal Financial Controls (IFCoFR) Diagnostic & Walkthrough Simulator",
            "say": [
                "In Part 2 of Milestone Project 2, you execute the Internal Financial Controls over Financial Reporting (IFCoFR) diagnostic across five core enterprise business processes: (1) Procure-to-Pay (P2P); (2) Order-to-Cash (O2C); (3) Treasury and Borrowings; (4) Financial Close and Reporting (Record-to-Report); and (5) Entity-Level Controls (ELCs).",
                "Under Section 143(3)(i) and the ICAI IFCoFR Guidance Note, you must determine whether control deficiencies represent isolated procedural hiccups, Significant Deficiencies, or catastrophic Material Weaknesses that jeopardize the integrity of financial statement numbers.",
                "Your automated diagnostic tests 150 automated and manual key controls across the ERP system. The diagnostic flags two severe vulnerabilities: First, in the Financial Close process, three senior corporate finance controllers possess unmonitored master-level override credentials permitting manual journal vouchers to be posted directly into consolidated retained earnings without secondary reviewer sign-off.",
                "Second, in the Procure-to-Pay process, automated 3-way matching tolerances between purchase orders, goods receipt notes (GRNs), and vendor invoices were improperly set at 15% rather than zero, permitting vendor overpayments of Rs 6.5 Crore. You analyze the quantitative and qualitative severity of these findings against overall materiality to formulate the statutory IFCoFR opinion for Annexure B of the auditor's report."
            ],
            "example": "The audit team conducts an automated SAP ERP audit walkthrough for journal voucher JV-99214 for Rs 18 Crore crediting revenue. The system log confirms that the voucher was posted at 11:42 PM on Sunday by the Assistant Controller using executive super-user credentials with zero maker-checker approval. The team documents a Material Weakness in internal financial controls over financial reporting under Section 143(3)(i).",
            "code": '''class IFCoFRDiagnosticEngine:
    def __init__(self, overall_materiality_cr: float):
        self.overall_materiality_cr = overall_materiality_cr
        self.controls_tested = []
        
    def add_control_test(self, control_id: str, process: str, is_automated: bool, is_effective: bool, override_risk: bool, exposure_cr: float):
        self.controls_tested.append({
            "control_id": control_id,
            "process": process,
            "is_automated": is_automated,
            "is_effective": is_effective,
            "override_risk": override_risk,
            "exposure_cr": exposure_cr
        })
        
    def evaluate_statutory_ifcofr_opinion(self) -> dict:
        total_tested = len(self.controls_tested)
        ineffective_controls = [c for c in self.controls_tested if not c["is_effective"]]
        material_weaknesses = []
        
        for c in ineffective_controls:
            if c["override_risk"] or c["exposure_cr"] >= self.overall_materiality_cr:
                material_weaknesses.append(c)
                
        has_material_weakness = len(material_weaknesses) > 0
        
        if has_material_weakness:
            statutory_opinion = "ADVERSE_OPINION_MATERIAL_WEAKNESSES_EXIST"
        elif len(ineffective_controls) > 0:
            statutory_opinion = "UNMODIFIED_WITH_SIGNIFICANT_DEFICIENCIES_REPORTED_TO_TCWG"
        else:
            statutory_opinion = "UNMODIFIED_CLEAN_OPERATING_EFFECTIVENESS"
            
        return {
            "total_controls_audited": total_tested,
            "ineffective_controls_count": len(ineffective_controls),
            "material_weaknesses_count": len(material_weaknesses),
            "material_weakness_present": has_material_weakness,
            "statutory_ifcofr_opinion": statutory_opinion,
            "critical_weaknesses": material_weaknesses
        }

ifcofr_engine = IFCoFRDiagnosticEngine(overall_materiality_cr=14.0)
ifcofr_engine.add_control_test("CTRL-P2P-01", "Procure-to-Pay (3-Way Match)", is_automated=True, is_effective=False, override_risk=False, exposure_cr=6.5)
ifcofr_engine.add_control_test("CTRL-R2R-04", "Record-to-Report (Journal Overrides)", is_automated=False, is_effective=False, override_risk=True, exposure_cr=18.0)
ifcofr_engine.add_control_test("CTRL-TREAS-02", "Treasury Dual Authorization", is_automated=True, is_effective=True, override_risk=False, exposure_cr=0.0)

ifcofr_res = ifcofr_engine.evaluate_statutory_ifcofr_opinion()
print("IFCoFR STATUTORY AUDIT REPORT (Companies Act Section 143(3)(i)):")
print(f"  Total Controls Audited : {ifcofr_res['total_controls_audited']}")
print(f"  Ineffective Controls   : {ifcofr_res['ineffective_controls_count']}")
print(f"  Material Weaknesses    : {ifcofr_res['material_weaknesses_count']}")
print(f"  Statutory Audit Opinion: {ifcofr_res['statutory_ifcofr_opinion']}")
print("  Identified Critical Flaws:")
for w in ifcofr_res['critical_weaknesses']:
    print(f"    * {w['control_id']} ({w['process']}): Exposure INR {w['exposure_cr']} Cr | Override Risk: {w['override_risk']}")
''',
            "tryIt": "Set override_risk to False and exposure_cr to 5.0 on CTRL-R2R-04 to observe the IFCoFR opinion upgrade to Unmodified with Significant Deficiencies reported to TCWG.",
            "check": {
                "question": "Why does the presence of an unmitigated management override vulnerability on journal vouchers (CTRL-R2R-04) compel an Adverse IFCoFR opinion under Section 143(3)(i)?",
                "options": [
                    "Because management override represents a pervasive qualitative control breakdown that circumvents all automated controls, creating a reasonable possibility of undetected material financial statement fraud",
                    "Because the Companies Act automatically dissolves any company with manual journal entries",
                    "Because all journal vouchers must be approved by the President of India",
                    "Because the auditor must qualify the report whenever an accounting software updates its version"
                ],
                "answerIndex": 0,
                "why": "Under the ICAI IFCoFR Guidance Note, unauthorized management override of controls represents a foundational design breakdown that creates a reasonable possibility of material misstatement, legally constituting a Material Weakness requiring an adverse IFCoFR opinion."
            }
        },
        {
            "title": "Substantive Testing & Upper Error Limit Projection Engine",
            "say": [
                "In Part 3 of Milestone Project 2, you conduct substantive sampling and error evaluation under SA 450 and SA 530 across Apex Global's Trade Receivables and Inventory ledgers. The trade receivables portfolio comprises Rs 420 Crore distributed across 1,850 customer accounts.",
                "Using Monetary Unit Sampling with a sampling interval of Rs 3.03 Crore (derived from Performance Materiality of Rs 9.1 Crore), your statistical sample selects 138 accounts for direct external confirmation and substantive testing. Of the 138 sampled accounts, 134 balances match confirmed records perfectly.",
                "However, testing detects four tainted accounts: (1) Account CUST-104 (Book Value Rs 4.5 Crore, Audit Value Rs 3.6 Crore) has a 20% tainting due to unrecorded credit notes; (2) Account CUST-288 (Book Value Rs 3.2 Crore, Audit Value Rs 2.72 Crore) has a 15% tainting due to billing rate disputes; (3) Account CUST-612 (Book Value Rs 2.5 Crore, Audit Value Rs 2.25 Crore) has a 10% tainting due to duplicate invoicing; and (4) Account CUST-905 (Book Value Rs 5.5 Crore - Top Stratum Item exceeding sampling interval) has an actual factual cut-off error of Rs 85.0 Lakh.",
                "You execute the Monetary Unit Sampling Upper Error Limit (UEL) engine: calculating Basic Precision, projecting misstatements across the population, computing the incremental allowance for precision risk, and adding the factual top-stratum error. You compare the Upper Error Limit against Tolerable Misstatement (Rs 9.1 Crore) to evaluate whether the accounts receivable balance can be accepted as fairly stated."
            ],
            "example": "The sampling engine computes Basic Precision = Rs 9.09 Crore (Rs 3.03 Cr * 3.0). The three sample taintings generate Projected Misstatement of Rs 1.36 Crore and Precision Allowance of Rs 65 Lakh. With the top-stratum error of Rs 85 Lakh, the Upper Error Limit reaches Rs 11.95 Crore. Because UEL (Rs 11.95 Cr) exceeds Tolerable Misstatement (Rs 9.1 Cr), the auditor rejects the population as stated, demanding management record an immediate Rs 2.85 Crore adjustment.",
            "code": '''class SubstantiveSamplingEngine:
    def __init__(self, sampling_interval_cr: float, tolerable_misstatement_cr: float):
        self.si_cr = sampling_interval_cr
        self.tm_cr = tolerable_misstatement_cr
        
    def evaluate_mus_sample_results(self, sample_taintings: list, top_stratum_errors_cr: float) -> dict:
        # Poisson 95% confidence factors
        rf_0 = 3.00
        incremental_factors = [1.75, 1.55, 1.46, 1.40, 1.35]
        
        # 1. Basic Precision
        basic_precision_cr = self.si_cr * rf_0
        
        # 2. Projected Errors & Precision Allowance
        sorted_taints = sorted([t for t in sample_taintings if t > 0.0], reverse=True)
        projected_errors = []
        precision_allowances = []
        
        for idx, t in enumerate(sorted_taints):
            p_err = t * self.si_cr
            projected_errors.append(p_err)
            
            weight = incremental_factors[idx] if idx < len(incremental_factors) else 1.30
            p_allow = (weight - 1.0) * p_err
            precision_allowances.append(p_allow)
            
        tot_projected_cr = sum(projected_errors)
        tot_precision_allow_cr = sum(precision_allowances)
        
        # Total Upper Error Limit
        uel_cr = basic_precision_cr + tot_projected_cr + tot_precision_allow_cr + top_stratum_errors_cr
        is_acceptable = uel_cr <= self.tm_cr
        
        return {
            "basic_precision_cr": round(basic_precision_cr, 3),
            "total_projected_misstatement_cr": round(tot_projected_cr, 3),
            "precision_allowance_cr": round(tot_precision_allow_cr, 3),
            "top_stratum_factual_error_cr": round(top_stratum_errors_cr, 3),
            "upper_error_limit_cr": round(uel_cr, 3),
            "tolerable_misstatement_cr": round(self.tm_cr, 3),
            "population_acceptable": is_acceptable,
            "statutory_action": "ACCEPT_LEDGER_BALANCE" if is_acceptable else "REJECT_POPULATION_EXPAND_SAMPLE_OR_REQUIRE_ADJUSTMENT"
        }

sampling_engine = SubstantiveSamplingEngine(sampling_interval_cr=3.03, tolerable_misstatement_cr=9.10)
mus_eval = sampling_engine.evaluate_mus_sample_results(
    sample_taintings=[0.20, 0.15, 0.10],
    top_stratum_errors_cr=0.85
)
print("SA 530 MONETARY UNIT SAMPLING (MUS) PROJECTION ENGINE:")
print(f"  Basic Precision       : INR {mus_eval['basic_precision_cr']} Crores")
print(f"  Projected Misstatement: INR {mus_eval['total_projected_misstatement_cr']} Crores")
print(f"  Precision Allowance   : INR {mus_eval['precision_allowance_cr']} Crores")
print(f"  Top-Stratum Error     : INR {mus_eval['top_stratum_factual_error_cr']} Crores")
print(f"  Upper Error Limit(UEL): INR {mus_eval['upper_error_limit_cr']} Crores (Limit: INR {mus_eval['tolerable_misstatement_cr']} Cr)")
print(f"  Audit Determination   : {mus_eval['statutory_action']}")
''',
            "tryIt": "Reduce top_stratum_errors_cr to 0.0 and sample_taintings to [0.05] to see the Upper Error Limit drop below Tolerable Misstatement, clearing the receivables population.",
            "check": {
                "question": "What must the statutory auditor do under SA 530 and SA 450 when the Upper Error Limit (Rs 11.95 Cr) exceeds Tolerable Misstatement (Rs 9.1 Cr)?",
                "options": [
                    "The auditor cannot accept the population as fairly stated; the auditor must request management to investigate the causes, record adjustments, or expand testing to reduce sampling risk before issuing the audit report",
                    "The auditor must conceal the calculation from the working papers to ensure a clean opinion",
                    "The auditor should increase the tolerance threshold arbitrarily to match the higher error",
                    "The auditor must immediately resign without informing the Board of Directors"
                ],
                "answerIndex": 0,
                "why": "SA 530 Paragraph 13 mandates that when the projected misstatement combined with the allowance for sampling risk exceeds tolerable misstatement, the auditor shall request management to investigate and adjust or perform additional audit procedures."
            }
        },
        {
            "title": "CARO 2020 21-Clause Comprehensive Diagnostic Engine",
            "say": [
                "In Part 4 of Milestone Project 2, you deploy the master CARO 2020 Comprehensive Diagnostic Engine across all twenty-one (21) statutory clauses under Section 143(11) of the Companies Act, 2013.",
                "The diagnostic scrutinizes enterprise operational and financial data across the entire fiscal year: verifying PPE title deeds under Clause (i); physical inventory and bank drawing power reconciliations under Clause (ii); loans and guarantees under Clause (iii); director loan limits under Section 185/186 in Clause (iv); public deposits in Clause (v); cost audit records under Clause (vi); statutory dues and PF/GST arrears in Clause (vii); unrecorded tax search income in Clause (viii); term loan diversion and short-term fund misuse in Clause (ix); and IPO/private placement proceeds in Clause (x).",
                "Furthermore, the engine interrogates corporate governance clauses: Section 143(12) fraud reporting and whistleblower complaints in Clause (xi); Nidhi compliance in Clause (xii); Section 177/188 related party transactions in Clause (xiii); internal audit systems in Clause (xiv); Section 192 non-cash transactions in Clause (xv); RBI NBFC registration in Clause (xvi); cash losses in Clause (xvii); auditor resignation in Clause (xviii); 1-year financial liability viability in Clause (xix); Section 135 CSR compliance in Clause (xx); and subsidiary qualifications in Clause (xxi).",
                "Your automated diagnostic identifies three critical statutory breaches requiring adverse remarks: (1) Clause (ii)(b): A Rs 12 Crore variance between quarterly bank stock returns and audited inventory; (2) Clause (ix)(c): Rs 25 Crore in bank term loan proceeds diverted to finance an unapproved offshore equity acquisition; and (3) Clause (xi)(a): Form ADT-4 filed with the Central Government for a Rs 4.2 Crore vendor billing fraud. You compile the complete CARO 2020 Statutory Annexure."
            ],
            "example": "The CARO diagnostic engine audits quarterly drawing power: in Q3, Apex Global reported inventory of Rs 180 Crore to lender banks, while audited ERP records showed Rs 168 Crore (Rs 12 Crore difference). Concurrently, the engine flags a Rs 25 Crore term loan drawn from Punjab National Bank for power equipment that was transferred to an overseas subsidiary. Both findings are formatted into statutory CARO disclosures with exact clause citations.",
            "code": '''class CARO2020AuditEngine:
    def __init__(self, company_name: str):
        self.company_name = company_name
        self.findings = []
        
    def audit_clause(self, clause_number: str, clause_title: str, is_compliant: bool, adverse_remark: str = ""):
        self.findings.append({
            "clause": clause_number,
            "title": clause_title,
            "compliant": is_compliant,
            "remark": adverse_remark if not is_compliant else "Unmodified — Compliant"
        })
        
    def generate_caro_report(self) -> dict:
        adverse = [f for f in self.findings if not f["compliant"]]
        return {
            "company_name": self.company_name,
            "total_clauses_evaluated": len(self.findings),
            "clean_clauses_count": len(self.findings) - len(adverse),
            "qualified_clauses_count": len(adverse),
            "caro_verdict": "QUALIFIED_CARO_REPORT_ADVERSE_REMARKS_CONTAINED" if len(adverse) > 0 else "CLEAN_UNMODIFIED_CARO_REPORT",
            "adverse_disclosures": adverse
        }

caro = CARO2020AuditEngine("Apex Global Infrastructure Ltd")
caro.audit_clause("Clause (i)", "PPE Title Deeds & Physical Verification", True)
caro.audit_clause("Clause (ii)", "Inventory Verification & Bank Stock Returns", False, "Quarterly bank returns differ from books by INR 12.0 Cr")
caro.audit_clause("Clause (iii)", "Loans, Advances & Evergreening", True)
caro.audit_clause("Clause (iv)", "Sec 185 / 186 Compliance", True)
caro.audit_clause("Clause (v)", "Public Deposits", True)
caro.audit_clause("Clause (vii)", "Statutory Dues & Arrears", True)
caro.audit_clause("Clause (ix)", "Loan Defaults & Fund Diversion", False, "INR 25.0 Cr of project term loan diverted to overseas subsidiary")
caro.audit_clause("Clause (xi)", "Fraud & Whistleblower Complaints", False, "Form ADT-4 filed with MCA for INR 4.2 Cr vendor billing fraud")
caro.audit_clause("Clause (xvii)", "Cash Losses", True)
caro.audit_clause("Clause (xix)", "1-Year Financial Liability Viability", True)
caro.audit_clause("Clause (xx)", "Section 135 CSR Compliance", True)

caro_summary = caro.generate_caro_report()
print(f"CARO 2020 STATUTORY AUDIT REPORT — {caro_summary['company_name'].upper()}")
print(f"  Clauses Evaluated      : {caro_summary['total_clauses_evaluated']}")
print(f"  Compliant Clauses      : {caro_summary['clean_clauses_count']}")
print(f"  Adverse Remarks Flagged: {caro_summary['qualified_clauses_count']}")
print(f"  CARO Overall Verdict   : {caro_summary['caro_verdict']}")
print("  Statutory Disclosures:")
for a in caro_summary['adverse_disclosures']:
    print(f"    * {a['clause']} ({a['title']}): {a['remark']}")
''',
            "tryIt": "Set is_compliant to True for Clauses (ii), (ix), and (xi) to observe the CARO verdict transition to CLEAN_UNMODIFIED_CARO_REPORT.",
            "check": {
                "question": "What is the legal status and destination of the CARO 2020 report in Indian corporate law?",
                "options": [
                    "CARO 2020 is a mandatory statutory annexure issued under Section 143(11) of the Companies Act, 2013 that forms an integral part of the independent auditor's report presented to shareholders and filed with the MCA",
                    "It is a voluntary internal management memo prepared by the Chief Human Resources Officer",
                    "It is a secret report filed exclusively with foreign credit rating agencies",
                    "It is a commercial invoice for the audit fee"
                ],
                "answerIndex": 0,
                "why": "Section 143(11) of the Companies Act, 2013 authorizes the Central Government to order that the auditor's report shall include a statement on specified matters; CARO 2020 constitutes this mandatory statutory annexure to the audit report."
            }
        },
        {
            "title": "Master Independent Auditor's Report & Opinion Formulation War Room",
            "say": [
                "In Part 5 of Milestone Project 2, you convene the Master Audit Opinion Formulation War Room, synthesizing all empirical evidence, IFCoFR findings, substantive error schedules, and CARO disclosures into the formal Independent Auditor's Report under SA 700, SA 705, and SA 706.",
                "You evaluate the four statutory opinion typologies governed by Standard on Auditing (SA) 705: (1) Unmodified (Clean) Opinion; (2) Qualified Opinion (misstatements are material but not pervasive, or inability to obtain evidence is material but not pervasive); (3) Adverse Opinion (misstatements are both material and pervasive to the financial statements); and (4) Disclaimer of Opinion (inability to obtain sufficient appropriate audit evidence is both material and pervasive).",
                "Your synthesis reveals: (a) The unadjusted accounting misstatements total Rs 3.7 Crore (below overall materiality of Rs 14.0 Crore), meaning the financial statement numbers themselves give a True and Fair view in accordance with Ind AS; (b) Internal Financial Controls over Financial Reporting (IFCoFR) under Section 143(3)(i) contains a Material Weakness regarding management journal overrides, requiring an Adverse IFCoFR Opinion in Annexure B; (c) CARO 2020 contains three qualified clauses regarding bank stock reconciliation, term loan diversion, and Section 143(12) fraud reporting in Annexure A; and (d) SA 701 Key Audit Matters (KAM) must disclose the valuation of complex infrastructure construction contracts.",
                "You assemble and execute the complete Master Audit Dossier, certifying the financial statements, issuing the statutory qualification annexures, and securing formal accreditation as a Senior Statutory Assurance Controller & Audit Engagement Partner."
            ],
            "example": "The engagement partner executes the final sign-off: issuing an Unmodified Opinion on the Ind AS standalone financial statement numbers, an Adverse Opinion on Internal Financial Controls in Annexure B due to journal override vulnerabilities, a Qualified CARO report in Annexure A detailing Rs 25 Crore in loan diversion and Rs 4.2 Crore fraud, and certifying complete compliance with SAs 200 through 530.",
            "code": '''class IndependentAuditorReportWarRoom:
    def __init__(self, client_name: str, fy_year: str, overall_materiality_cr: float):
        self.client_name = client_name
        self.fy = fy_year
        self.overall_mat_cr = overall_materiality_cr
        
    def synthesize_master_audit_verdict(
        self,
        unadjusted_errors_cr: float,
        has_material_pervasive_error: bool,
        ifcofr_has_material_weakness: bool,
        caro_adverse_count: int,
        fraud_adt4_reported: bool
    ) -> dict:
        # Financial Statement Opinion (SA 700 / SA 705)
        if has_material_pervasive_error:
            fs_opinion = "ADVERSE_OPINION (Financial statements do not give True & Fair view)"
        elif unadjusted_errors_cr >= self.overall_mat_cr:
            fs_opinion = "QUALIFIED_OPINION (Material misstatements exist)"
        else:
            fs_opinion = "UNMODIFIED_CLEAN_OPINION (True and fair view in accordance with Ind AS)"
            
        # IFCoFR Opinion (Companies Act Sec 143(3)(i))
        ifcofr_opinion = "ADVERSE_OPINION (Material Weakness in journal overrides)" if ifcofr_has_material_weakness else "UNMODIFIED_CLEAN_OPINION"
        
        # CARO Opinion (Sec 143(11))
        caro_status = f"QUALIFIED_CARO_REPORT ({caro_adverse_count} statutory clauses modified)" if caro_adverse_count > 0 else "CLEAN_CARO_REPORT"
        
        # Statutory Fraud Disclosure (Sec 143(12))
        fraud_status = "DISCLOSED_IN_REPORT_AND_ADT4_TRANSMITTED_TO_MCA" if fraud_adt4_reported else "NO_FRAUD_REPORTED_UNDER_SEC_143_12"
        
        return {
            "entity": self.client_name,
            "financial_year": self.fy,
            "standalone_financial_statements_opinion": fs_opinion,
            "annexure_b_ifcofr_opinion": ifcofr_opinion,
            "annexure_a_caro_2020_status": caro_status,
            "section_143_12_fraud_reporting": fraud_status,
            "key_audit_matters_sa701": "Revenue Recognition on Infrastructure Projects & Recoverability of Claims",
            "lead_partner_credential": "SENIOR_STATUTORY_ASSURANCE_CONTROLLER_AND_ENGAGEMENT_PARTNER"
        }

war_room = IndependentAuditorReportWarRoom("Apex Global Infrastructure Ltd", "FY 2025-26", overall_materiality_cr=14.0)
dossier = war_room.synthesize_master_audit_verdict(
    unadjusted_errors_cr=3.7, # Under Rs 14 Cr materiality
    has_material_pervasive_error=False,
    ifcofr_has_material_weakness=True,
    caro_adverse_count=3,
    fraud_adt4_reported=True
)

print("=" * 80)
print(f"MASTER INDEPENDENT AUDITOR'S REPORT — {dossier['entity'].upper()} ({dossier['financial_year']})")
print("=" * 80)
print(f"  Financial Statements Opinion : {dossier['standalone_financial_statements_opinion']}")
print(f"  Annexure B (IFCoFR Sec 143) : {dossier['annexure_b_ifcofr_opinion']}")
print(f"  Annexure A (CARO 2020)      : {dossier['annexure_a_caro_2020_status']}")
print(f"  Fraud Reporting Sec 143(12) : {dossier['section_143_12_fraud_reporting']}")
print(f"  Key Audit Matter (SA 701)   : {dossier['key_audit_matters_sa701']}")
print(f"  Auditor Accreditation       : {dossier['lead_partner_credential']}")
print("=" * 80)
''',
            "tryIt": "Set unadjusted_errors_cr to 18.5 Cr (above materiality) to see the Financial Statements Opinion degrade to a Qualified Opinion under SA 705.",
            "check": {
                "question": "Can an independent auditor issue an Unmodified (Clean) opinion on financial statement numbers while simultaneously issuing an Adverse opinion on IFCoFR under Section 143(3)(i) and adverse remarks under CARO 2020?",
                "options": [
                    "Yes, because the financial statement opinion evaluates whether reported numbers give a true and fair view at balance sheet date, whereas IFCoFR and CARO evaluate internal control design/operation and statutory compliance matters independently",
                    "No, an adverse IFCoFR opinion automatically forces an adverse opinion on financial statements",
                    "No, CARO qualifications are strictly illegal if the balance sheet is unmodified",
                    "Only if the company pays a special waiver fee to the Ministry of Corporate Affairs"
                ],
                "answerIndex": 0,
                "why": "Under ICAI Standards on Auditing and the Companies Act, the financial statement opinion, IFCoFR opinion, and CARO report are legally distinct; an entity may present numbers that are materially true and fair despite having severe internal control weaknesses or CARO defaults."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day10_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day10_data.json successfully!")
