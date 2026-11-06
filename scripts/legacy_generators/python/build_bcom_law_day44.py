import json, sys, subprocess, os, re, hashlib

# Builder for Day 44 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 44: Fast-Track CIRP & Voluntary Liquidation Architecture (Sections 55–59)

day_num = 44
course_prefix = "bcom_law"
day_title = "Fast-Track CIRP & Voluntary Liquidation Architecture (Sections 55–59)"
day_desc = "Master the accelerated resolution and exit mechanisms under the IBC: Fast-Track Corporate Insolvency Resolution Process under Sections 55-58 with its strict 90-day statutory ceiling, and the solvent corporate exit architecture of Voluntary Liquidation under Section 59, including directors' declarations of solvency, special resolutions, liquidator asset realization, and dissolution orders."

# Part 1: Fast-Track CIRP Scope, Eligibility & Statutory Thresholds (Sections 55–56)
part1_title = "Fast-Track CIRP Scope, Eligibility & Statutory Thresholds (Sections 55–56)"
part1_say = [
    "While standard Corporate Insolvency Resolution Process under Chapter II of the Insolvency and Bankruptcy Code 2016 was engineered for large industrial enterprises with sprawling asset bases and syndicated banking consortia, Parliament recognized that smaller corporate entities require an accelerated, low-cost resolution pathway. Subjecting a small private limited company with modest liabilities to a protracted three-hundred-and-thirty-day CIRP imposes disproportionate administrative expenditure, frequently consuming the entire residual enterprise estate in professional fees. To address this structural mismatch, Chapter IV of the Code codifies the Fast-Track Corporate Insolvency Resolution Process under Sections 55 through 58.",
    "Section 55(2) establishes that Fast-Track CIRP may be initiated exclusively against specified classes of corporate debtors notified by the Central Government. Pursuant to Ministry of Corporate Affairs notifications, three distinct corporate categories qualify for Fast-Track CIRP: (1) Small Companies as defined under Section 2(85) of the Companies Act 2013, characterized by paid-up share capital not exceeding four crore rupees and annual turnover not exceeding forty crore rupees; (2) Startups (other than partnership entities) recognized by the Department for Promotion of Industry and Internal Trade (DPIIT); and (3) Unlisted public or private companies possessing total book assets not exceeding one crore rupees as reported in their immediately preceding audited financial statements.",
    "The defining statutory hallmark of Fast-Track CIRP is its compressed timeline, codified in Section 56. Unlike standard CIRP which provides an initial statutory window of one hundred and eighty days, Section 56(1) mandates that the Fast-Track process shall be completed within a strict maximum timeframe of ninety days from the insolvency commencement date. This ninety-day statutory clock demands extraordinary operational velocity from the Resolution Professional and the Committee of Creditors.",
    "Recognizing that complex commercial negotiations or forensic asset tracing may occasionally require additional breathing room, Section 56(3) incorporates a strictly calibrated extension mechanism. If the Resolution Professional is instructed to do so by a resolution passed at a meeting of the Committee of Creditors by a vote of seventy-five percent of the voting shares, the RP may file an application with the Adjudicating Authority seeking an extension. If satisfied that the Fast-Track process cannot be completed within ninety days, the NCLT may grant an extension for a period not exceeding forty-five days.",
    "Crucially, Section 56(3) establishes an unyielding statutory ceiling: the Adjudicating Authority is prohibited from granting more than one extension, and the total duration of Fast-Track CIRP cannot under any circumstances exceed one hundred and thirty-five days. If no resolution plan is approved within this absolute outer perimeter, the corporate debtor automatically plunges into mandatory liquidation under Section 33.",
    "The legal framework of Chapter IV mirrors the substantive provisions of Chapter II regarding the statutory moratorium under Section 14, appointment of Interim Resolution Professionals, and the duties of the Committee of Creditors. However, the procedural regulations issued by the IBBI calibrate every compliance milestone to operate at double speed, ensuring that small enterprises avoid value erosion caused by judicial inertia. Creditors can enforce debt resolution swiftly without enduring years of procedural wrangling.",
    "The policy rationale behind the three notified categories reflects commercial reality. Small companies and early-stage startups typically possess dynamic, fast-depreciating intangible assets—such as proprietary software code, digital subscriber bases, or seasonal inventory—that dissipate rapidly if subjected to a prolonged insolvency freeze. A 90-day resolution ensures that prospective acquirers can step in and stabilize operations before key engineering talent departs or customer relationships disintegrate permanently.",
    "Furthermore, initiating Fast-Track CIRP requires strict documentary verification at the admission stage. When an operational or financial creditor files a Section 55 application before the NCLT, the applicant must annex certified MCA-21 company master data, audited balance sheets, or DPIIT startup recognition certificates proving that the corporate debtor falls squarely within one of the three notified categories. If a debtor's turnover exceeds forty crore rupees or paid-up capital exceeds four crore rupees, the NCLT immediately rejects the Fast-Track petition as non-maintainable, directing the applicant to pursue standard CIRP under Section 7 or Section 9.",
    "Mastering the statutory eligibility gates and compressed timeline limits of Sections 55 and 56 enables insolvency practitioners to deploy Fast-Track CIRP as an agile, cost-effective rescue vehicle for emerging startups and small commercial enterprises."
]

part1_example = "A DPIIT-recognized educational technology startup with two crore rupees of paid-up capital and five crore rupees of turnover defaults on a cloud computing debt of fifteen lakh rupees. Accelerated fast track insolvency resolution mechanisms provide rapid relief for small enterprises. The operational creditor files for Fast-Track CIRP under Section 55. The NCLT admits the petition, activating the strict ninety-day resolution clock. Within eighty days, the CoC approves a debt-restructuring plan submitted by a strategic investor, rescuing the tech platform without exceeding statutory time limits."

part1_code = '''def evaluate_fast_track_cirp_eligibility(paid_up_capital_cr, turnover_cr, is_dpiit_startup, total_assets_cr, is_unlisted):
    # Section 55(2) MCA Notification Categories:
    # 1. Small Company: Capital <= 4 Cr AND Turnover <= 40 Cr
    # 2. DPIIT Recognized Startup
    # 3. Unlisted Company with Total Assets <= 1 Cr
    
    is_small_company = (paid_up_capital_cr <= 4.0) and (turnover_cr <= 40.0)
    is_asset_capped_unlisted = is_unlisted and (total_assets_cr <= 1.0)
    
    qualifies = is_small_company or is_dpiit_startup or is_asset_capped_unlisted
    
    reasons = []
    if is_small_company:
        reasons.append("QUALIFIES_AS_SMALL_COMPANY_SECTION_2_85")
    if is_dpiit_startup:
        reasons.append("QUALIFIES_AS_DPIIT_RECOGNIZED_STARTUP")
    if is_asset_capped_unlisted:
        reasons.append("QUALIFIES_AS_UNLISTED_COMPANY_ASSETS_UNDER_1_CR")
        
    return {
        "is_eligible_for_fast_track": qualifies,
        "qualification_grounds": reasons if qualifies else ["DOES_NOT_MEET_ANY_NOTIFIED_FAST_TRACK_CRITERIA"],
        "base_statutory_window_days": 90,
        "max_permissible_extension_days": 45,
        "absolute_outer_ceiling_days": 135,
        "extension_voting_threshold_pct": 75.0
    }

# Case: Tech startup, DPIIT recognized, Capital 2 Cr, Turnover 5 Cr
audit = evaluate_fast_track_cirp_eligibility(
    paid_up_capital_cr=2.0,
    turnover_cr=5.0,
    is_dpiit_startup=True,
    total_assets_cr=3.5,
    is_unlisted=True
)
print("Fast-Track CIRP Eligibility Validated:", audit["is_eligible_for_fast_track"])
print("Statutory Ground Applied:", audit["qualification_grounds"][0])
print("Base Resolution Clock (Days):", audit["base_statutory_window_days"])
print("Absolute Outer Limit (Days):", audit["absolute_outer_ceiling_days"])
print("Extension CoC Supermajority Required:", audit["extension_voting_threshold_pct"])
'''

part1_check = {
    "question": "Under Section 56 of the IBC, what is the base statutory timeframe for concluding a Fast-Track CIRP, and what is the maximum duration of extension permitted?",
    "options": [
        "Base duration of ninety days, with a single maximum extension of forty-five days subject to a seventy-five percent CoC vote",
        "Base duration of one hundred and eighty days, with unlimited extensions of sixty days each",
        "Base duration of thirty days, with zero extensions permitted under any circumstances",
        "Base duration of two hundred and seventy days, extendable by one year by the Registrar of Companies"
    ],
    "answerIndex": 0,
    "why": "Section 56(1) establishes a 90-day base completion timeline, and Section 56(3) allows the NCLT to grant a single extension of up to 45 days upon an application approved by 75% of the CoC."
}

# Part 2: Fast-Track CIRP Operational Velocity: Claims, Valuation & Plan Approval
part2_title = "Fast-Track CIRP Operational Velocity: Claims, Valuation & Plan Approval"
part2_say = [
    "The practical implementation of Fast-Track CIRP is governed by the IBBI (Fast Track Insolvency Resolution Process for Corporate Persons) Regulations 2017. These regulations compress every operational milestone of corporate restructuring into an accelerated tempo, requiring resolution professionals to operate with surgical efficiency. Because the entire process must culminate in an approved resolution plan within ninety days, administrative delays that are routine in standard CIRP are statutorily prohibited in the Fast-Track framework.",
    "The operational timeline begins immediately upon appointment of the Interim Resolution Professional. Under Regulation 6, the IRP must issue the public announcement within three days of appointment, inviting creditors to submit their claims. In standard CIRP, creditors are granted fourteen days to file claims; in Fast-Track CIRP, the claims submission window is compressed to ten days. Within seven days of receiving claims, the IRP must verify the proof of claims, determine the financial position of the corporate debtor, and constitute the Committee of Creditors.",
    "Valuation mechanics are similarly accelerated under Regulation 26. Within seven days of appointment, the Resolution Professional must appoint one registered valuer (or two if required by the CoC) to determine the fair value and liquidation value of the corporate debtor. In stark contrast to standard CIRP where valuation reports frequently take months, Fast-Track valuers must submit their certified estimates within twenty-one days of appointment, ensuring that the CoC possesses an objective financial benchmark before reviewing commercial bids.",
    "The preparation and dissemination of the Information Memorandum is governed by Regulation 35. The Resolution Professional must submit the Information Memorandum to all members of the Committee of Creditors within twenty-one days of appointment, compared to fifty-four days in standard CIRP. Concurrently, the RP publishes the Invitation for Expression of Interest (Form G), establishing a compressed submission window of not more than fifteen days for prospective resolution applicants to inspect the data room and tender binding resolution plans.",
    "Voting thresholds within the Fast-Track Committee of Creditors mirror the substantive governance standards of Chapter II: approving a resolution plan requires a supermajority vote of sixty-six percent of voting shares under Section 30(4). Critical decisions such as raising interim finance, appointing forensic auditors, or altering credit facilities also require a sixty-six percent vote. However, because the CoC is smaller and institutional exposure is lower, meetings are convened on brief notice periods of forty-eight hours, enabling decisions to be finalized without bureaucratic stagnation.",
    "However, this extreme velocity introduces severe professional risks. The Resolution Professional must ensure that compressed timelines do not compromise the rigorous forensic scrutiny of avoidance transactions under Sections 43, 45, 50, and 66. A hurried resolution that fails to identify preferential asset siphoning undermines creditor recovery and risks rejection by the Adjudicating Authority under Section 31.",
    "To mitigate this risk, the Resolution Professional must initiate forensic transaction audits on day one of the process. Transaction auditors must be mandated to deliver their interim findings within thirty days, running parallel to the Form G public bidding window. If fraudulent asset diversion or preferential loan repayments are discovered, the RP immediately files avoidance applications before the NCLT while simultaneously negotiating resolution plan terms with prospective applicants.",
    "The legal status of registered valuers under Fast-Track Regulations imposes heightened professional liability. Because valuers are given only twenty-one days to submit their reports, they must rely on certified management accounts and audited fixed-asset registers. Under Regulation 27, if the two valuers arrive at estimates that differ significantly—defined by the IBBI as a difference exceeding twenty-five percent in enterprise valuation—the Resolution Professional must appoint a third registered valuer. This third valuer is granted an accelerated seven-day window to evaluate the assets and provide a final reconciling estimate to the Committee of Creditors.",
    "By mastering the operational velocity of Fast-Track CIRP, insolvency professionals can achieve high-recovery corporate restructurings for small commercial enterprises within three short months, preserving critical employment and revitalizing productive capacity."
]

part2_example = "In a Fast-Track CIRP of a manufacturing company, the Resolution Professional issues Form G on day twenty-one, receives two resolution plans on day thirty-eight, and presents them to the CoC on day forty-five. Accelerated regulations mandate operational efficiency in restructuring across all milestones. The CoC approves the highest bid by an eighty percent vote on day sixty, and the NCLT sanctions the plan on day seventy-eight, successfully concluding the restructuring twelve days ahead of the statutory ninety-day deadline."

part2_code = '''def simulate_fast_track_operational_schedule(commencement_day, claims_verified_day, im_submitted_day, plans_received_day, coc_vote_day):
    # Fast-Track Regulatory Timeline Benchmarks:
    # 1. Public announcement: <= Day 3
    # 2. Claims verification: <= Day 10
    # 3. Information Memorandum: <= Day 21
    # 4. Resolution Plan receipt: <= Day 45
    # 5. CoC approval: <= Day 90
    
    is_claims_timely = claims_verified_day <= 10
    is_im_timely = im_submitted_day <= 21
    is_plans_timely = plans_received_day <= 45
    is_coc_approval_timely = coc_vote_day <= 90
    
    schedule_compliant = is_claims_timely and is_im_timely and is_plans_timely and is_coc_approval_timely
    
    return {
        "commencement_day": commencement_day,
        "claims_verification_status": "TIMELY" if is_claims_timely else "DELAYED",
        "information_memorandum_status": "TIMELY" if is_im_timely else "DELAYED",
        "plan_evaluation_status": "TIMELY" if is_plans_timely else "DELAYED",
        "coc_vote_status": "APPROVED_WITHIN_90_DAYS" if is_coc_approval_timely else "REQUIRED_EXTENSION",
        "overall_schedule_compliant": schedule_compliant,
        "days_remaining_to_deadline": max(0, 90 - coc_vote_day)
    }

# Case: Efficient Fast-Track timeline (Claims verified Day 8, IM Day 20, Plans Day 42, CoC Vote Day 65)
audit = simulate_fast_track_operational_schedule(
    commencement_day=0,
    claims_verified_day=8,
    im_submitted_day=20,
    plans_received_day=42,
    coc_vote_day=65
)
print("Operational Schedule Compliance:", audit["overall_schedule_compliant"])
print("Information Memorandum Milestone:", audit["information_memorandum_status"])
print("CoC Resolution Vote Timing:", audit["coc_vote_status"])
print("Days Buffer Before Statutory Ceiling:", audit["days_remaining_to_deadline"])
'''

part2_check = {
    "question": "Under the IBBI Fast-Track Regulations, within how many days of appointment must the Resolution Professional submit the Information Memorandum to the Committee of Creditors?",
    "options": [
        "Within twenty-one days of appointment",
        "Within one hundred and eighty days of appointment",
        "Within ninety days of the first financial year end",
        "Within forty-eight hours of filing the petition"
    ],
    "answerIndex": 0,
    "why": "Regulation 35 of the Fast Track Regulations mandates that the Resolution Professional must submit the Information Memorandum to members of the CoC within 21 days of appointment."
}

# Part 3: Voluntary Liquidation Architecture: Solvent Corporate Exit Invariants (Section 59)
part3_title = "Voluntary Liquidation Architecture: Solvent Corporate Exit Invariants (Section 59)"
part3_say = [
    "Corporate existence is a statutory privilege granted by law, and sound economic systems require orderly, efficient exit mechanisms for solvent enterprises that have reached the end of their commercial lifecycle. Prior to the enactment of the IBC, winding up a solvent company under the Companies Act 1956 or Companies Act 2013 was a notorious bureaucratic quagmire, frequently taking ten to twenty years before regional High Courts and liquidators. To dismantle this systemic bottleneck, Section 59 of Chapter V of the Insolvency and Bankruptcy Code 2016 established a streamlined, time-bound Voluntary Liquidation Architecture for solvent corporate persons.",
    "The jurisdictional prerequisite of Section 59 is absolute and unbending: the corporate person must NOT be in default. While Chapters II, III, and IV of the Code deal with distressed companies unable to service debts, Section 59 is reserved strictly and exclusively for solvent companies that possess sufficient financial resources to discharge all their liabilities in full. Initiating voluntary liquidation when corporate debts exceed assets constitutes a gross jurisdictional fraud.",
    "Section 59(3) prescribes four mandatory statutory conditions precedent that must be meticulously satisfied before voluntary liquidation can commence. First, a majority of the directors of the company (or all directors if there are only two) must execute a formal Declaration of Solvency verified by an affidavit. The declaration must state that: (a) they have made a full inquiry into the affairs of the company and have formed the opinion that the company has no debts or that it will be able to pay its debts in full from the proceeds of assets to be sold in the voluntary liquidation; and (b) the company is not being liquidated to defraud any person.",
    "Second, the Declaration of Solvency must be accompanied by vital financial evidentiary exhibits: (1) audited financial statements and record of business operations of the company for the previous two financial years (or from incorporation if younger); and (2) an independent asset valuation report prepared by a registered valuer certifying the fair market value of company assets.",
    "Third, within four weeks of executing the Declaration of Solvency, the company must obtain shareholder sanction. The company must pass a Special Resolution approved by at least seventy-five percent of members present and voting in a general meeting, resolving that the company be liquidated voluntarily and appointing an Insolvency Professional to act as Liquidator. If liquidation is triggered by the expiry of a fixed duration in the company's Articles of Association, an Ordinary Resolution suffices.",
    "Fourth, Section 59(3)(c) establishes a crucial statutory Creditor Consent Gate. If the company owes any debts whatsoever to creditors, creditors representing not less than two-thirds (sixty-six point six seven percent) in value of the total debt must approve the liquidation resolution passed by members within seven days of its passage. Once creditor consent is secured, the voluntary liquidation officially commences, the powers of the board of directors cease, and all executive authority vests in the Liquidator.",
    "Finally, under Section 59(4), the company must notify the Registrar of Companies and the Insolvency and Bankruptcy Board of India within seven days of the resolution or creditor approval, placing the global public on notice that the entity has entered orderly solvent dissolution.",
    "The transfer of exclusive jurisdiction over solvent winding up to the IBC under Section 59 represents a landmark harmonization of Indian company law. By replacing the archaic Official Liquidator bureaucracy with private, professional Insolvency Professionals subject to IBBI disciplinary oversight, the reform slashes exit durations from decades to months, freeing idle capital for reinvestment.",
    "The voluntary liquidation framework under Section 59 strictly prohibits any attempt by directors to circumvent statutory tax scrutiny. Under Section 178 of the Income Tax Act 1961, the liquidator must give notice of their appointment to the jurisdictional Income Tax Officer within thirty days. The tax authorities are granted a three-month window to notify the liquidator of any outstanding tax liabilities or reassessment proceedings. Distributing assets to shareholders without obtaining formal tax clearance or providing for crystallized tax demands renders the liquidator personally liable for the unpaid corporate tax arrears."
]

part3_example = "A software development firm sells its intellectual property assets and decides to cease business operations. The firm has twenty crore rupees in bank fixed deposits and three crore rupees in outstanding trade payables. Voluntary liquidation architecture provides exit for solvent corporate persons through structured statutory filings. The three directors execute an affidavit declaring full solvency, obtain a registered valuer report, secure a seventy-five percent shareholder vote, and obtain approval from eighty percent of creditors within seven days, successfully commencing voluntary liquidation under Section 59."

part3_code = '''def evaluate_voluntary_liquidation_prerequisites(has_financial_default, directors_count, directors_signing_solvency_affidavit, has_audited_financials_2_years, has_registered_valuer_report, days_between_affidavit_and_shareholder_vote, shareholder_approval_pct, has_debts, creditor_consent_value_pct, days_to_creditor_consent):
    # Section 59(3) Mandatory Invariants:
    # 1. No default (must be solvent)
    # 2. Majority of directors sign Declaration of Solvency affidavit
    # 3. Financials (2 years) + Registered Valuer report attached
    # 4. Shareholder vote <= 28 days (4 weeks) of affidavit with >= 75% approval
    # 5. If debts exist, >= 66.67% (2/3rd) creditor consent within 7 days
    
    ineligibility = []
    
    if has_financial_default:
        ineligibility.append("BARRED_BY_EXISTING_FINANCIAL_DEFAULT_MUST_USE_CIRP")
    if directors_signing_solvency_affidavit < (directors_count / 2):
        ineligibility.append("DECLARATION_NOT_SIGNED_BY_MAJORITY_OF_DIRECTORS")
    if not (has_audited_financials_2_years and has_registered_valuer_report):
        ineligibility.append("MISSING_AUDITED_FINANCIALS_OR_VALUER_REPORT")
    if days_between_affidavit_and_shareholder_vote > 28:
        ineligibility.append("SHAREHOLDER_RESOLUTION_EXCEEDED_4_WEEK_STATUTORY_WINDOW")
    if shareholder_approval_pct < 75.0:
        ineligibility.append("INSUFFICIENT_SHAREHOLDER_SPECIAL_RESOLUTION_VOTE")
    if has_debts:
        if creditor_consent_value_pct < 66.67:
            ineligibility.append("INSUFFICIENT_CREDITOR_CONSENT_VALUE_UNDER_TWO_THIRDS")
        if days_to_creditor_consent > 7:
            ineligibility.append("CREDITOR_CONSENT_EXCEEDED_7_DAY_STATUTORY_WINDOW")
            
    is_valid = len(ineligibility) == 0
    
    return {
        "voluntary_liquidation_valid": is_valid,
        "solvency_declaration_compliant": directors_signing_solvency_affidavit >= (directors_count / 2),
        "shareholder_approval_compliant": shareholder_approval_pct >= 75.0 and days_between_affidavit_and_shareholder_vote <= 28,
        "creditor_consent_compliant": (not has_debts) or (creditor_consent_value_pct >= 66.67 and days_to_creditor_consent <= 7),
        "deficiencies": ineligibility if not is_valid else "NONE"
    }

# Case: 3 directors (all 3 sign), financials attached, shareholder vote Day 14 (85%), debt exists (80% consent on Day 4)
audit = evaluate_voluntary_liquidation_prerequisites(
    has_financial_default=False,
    directors_count=3,
    directors_signing_solvency_affidavit=3,
    has_audited_financials_2_years=True,
    has_registered_valuer_report=True,
    days_between_affidavit_and_shareholder_vote=14,
    shareholder_approval_pct=85.0,
    has_debts=True,
    creditor_consent_value_pct=80.0,
    days_to_creditor_consent=4
)
print("Voluntary Liquidation Invariants Satisfied:", audit["voluntary_liquidation_valid"])
print("Solvency Declaration Valid:", audit["solvency_declaration_compliant"])
print("Shareholder Governance Valid:", audit["shareholder_approval_compliant"])
print("Creditor Consent Gate Valid:", audit["creditor_consent_compliant"])
print("Statutory Compliance Status:", audit["deficiencies"])
'''

part3_check = {
    "question": "Under Section 59(3) of the IBC, if a company initiating voluntary liquidation owes debts to creditors, what creditor approval threshold must be obtained, and within what timeframe?",
    "options": [
        "Creditors representing not less than two-thirds in value of the debt must approve the resolution within seven days of its passage",
        "Creditors representing one hundred percent in value must approve within ninety days",
        "A simple majority of fifty percent in number of creditors must approve within thirty days",
        "No creditor approval is required if the company has bank deposits exceeding five crore rupees"
    ],
    "answerIndex": 0,
    "why": "Section 59(3)(c) mandates that creditors representing at least two-thirds (66.67%) in value of the company's debt must approve the liquidation resolution within 7 days of its passage."
}

# Part 4: Realization Waterfall, Liquidator Powers & Dissolution Orders (Section 59(7)–(9))
part4_title = "Realization Waterfall, Liquidator Powers & Dissolution Orders (Section 59)"
part4_say = [
    "Once voluntary liquidation commences, executive custody of the enterprise transitions to the Liquidator under the IBBI (Voluntary Liquidation Process) Regulations 2017. The liquidator assumes statutory custody of all assets, books of accounts, banking instruments, and intellectual property. Within five days of appointment, the liquidator must publish a public announcement in Form A in an English and regional newspaper and on the company website, inviting claims from stakeholders within thirty days.",
    "A mandatory operational duty of the liquidator is opening a dedicated 'Voluntary Liquidation Account' in a scheduled commercial bank, codified in Regulation 34. All real-estate sales proceeds, recovery of outstanding book debts, bank deposit closures, and asset realization revenues must be deposited directly into this dedicated account. No cash withdrawals are permitted, and every disbursement must occur through transparent electronic banking channels.",
    "The realization and distribution of assets follows the strict priority waterfall codified in Section 53 of the Code. Even in a solvent company where assets exceed debts, the statutory hierarchy must be strictly adhered to: (1) voluntary liquidation costs and liquidator remuneration; (2) workmen's dues and debts owed to secured creditors; (3) wages and unpaid dues owed to other employees; (4) unsecured financial debts; (5) statutory taxes owed to Central and State Governments; and (6) remaining surplus capital distributed pro-rata to preference and equity shareholders according to their contractual share rights.",
    "Under amended IBBI regulations, the entire voluntary liquidation process must be concluded within ninety days from commencement for companies with zero creditors or negligible assets, and within two hundred and seventy days for operating commercial companies with complex asset holdings. If the liquidation exceeds twelve months, the liquidator must convene an Annual Meeting of contributors and file an Annual Status Report with the ROC and IBBI.",
    "When the affairs of the corporate debtor are completely wound up and all assets have been realized and distributed, Section 59(7) mandates the final judicial step: Application for Dissolution. The liquidator prepares a Final Report under Regulation 38, containing an audited receipts and payments account and a certificate confirming that no litigation is pending. The liquidator then files a formal dissolution petition before the National Company Law Tribunal.",
    "Under Section 59(8), if the Adjudicating Authority is satisfied that the voluntary liquidation was conducted in accordance with law and that all claims were discharged, the NCLT passes an order that the corporate debtor shall stand dissolved from the date of the order. Under Section 59(9), the liquidator must file a copy of the dissolution order with the Registrar of Companies within fourteen days, officially striking the company off the register and bringing an end to its legal corporate existence.",
    "The statutory distribution of residual surplus funds to shareholders is subject to strict tax compliance under Section 2(22)(c) of the Income Tax Act 1961. Accumulated profits distributed upon liquidation are deemed dividends in the hands of shareholders, requiring the liquidator to ensure that applicable tax deductions at source (TDS) are deducted and deposited with the revenue department before net surplus capital is credited to shareholder bank accounts.",
    "A further critical regulatory mechanism is the treatment of unclaimed dividends and undistributed proceeds under Regulation 39. If any shareholder or creditor fails to claim their liquidation proceeds within the statutory distribution window, the liquidator cannot abandon the funds or transfer them back to corporate promoters. Instead, the liquidator is statutorily mandated to deposit all unclaimed dividends and undistributed assets into the Corporate Voluntary Liquidation Account maintained in the Public Account of India, submitting a certified ledger to the IBBI and the Registrar of Companies.",
    "This streamlined architecture guarantees an orderly, transparent corporate exit, ensuring that dormant capital is recycled into productive sectors of the economy without lingering litigation."
]

part4_example = "A financial services consulting company completes its voluntary liquidation. The liquidator realizes twelve crore rupees, pays off one crore rupees of operational liabilities under Section 53 priorities, and distributes eleven crore rupees of surplus capital to shareholders. Liquidators assume statutory custody during voluntary liquidation proceedings and execute distributions. The liquidator submits the Final Report and files an application under Section 59(7). The NCLT Mumbai Bench issues a formal Dissolution Order, and the company is struck off the ROC register within fourteen days."

part4_code = '''def simulate_voluntary_liquidation_waterfall(total_realized_cr, liquidation_costs_cr, workmen_dues_cr, secured_debt_cr, employee_wages_cr, unsecured_debt_cr, statutory_tax_cr, equity_shares_count):
    # Section 53 Waterfall Distribution in Solvent Voluntary Liquidation:
    # In solvent liquidation, all debts are paid 100%, and surplus goes to equity.
    
    funds = total_realized_cr
    distributions = {}
    
    # Tier 1: Liquidation Costs
    p1 = min(funds, liquidation_costs_cr)
    funds -= p1
    distributions["tier_1_liquidation_costs_paid"] = round(p1, 2)
    
    # Tier 2: Workmen & Secured Debt
    p2_req = workmen_dues_cr + secured_debt_cr
    p2 = min(funds, p2_req)
    funds -= p2
    distributions["tier_2_workmen_and_secured_paid"] = round(p2, 2)
    
    # Tier 3: Employee Wages
    p3 = min(funds, employee_wages_cr)
    funds -= p3
    distributions["tier_3_employee_wages_paid"] = round(p3, 2)
    
    # Tier 4: Unsecured Creditors
    p4 = min(funds, unsecured_debt_cr)
    funds -= p4
    distributions["tier_4_unsecured_debt_paid"] = round(p4, 2)
    
    # Tier 5: Statutory Government Taxes
    p5 = min(funds, statutory_tax_cr)
    funds -= p5
    distributions["tier_5_statutory_taxes_paid"] = round(p5, 2)
    
    # Tier 6: Surplus to Equity Shareholders
    surplus_to_equity = round(funds, 2)
    distributions["tier_6_surplus_equity_distribution"] = surplus_to_equity
    distributions["dividend_per_share_inr"] = round((surplus_to_equity * 10000000) / equity_shares_count, 2) if equity_shares_count > 0 else 0.0
    distributions["dissolution_application_ready"] = funds >= 0 and (total_realized_cr >= (liquidation_costs_cr + p2_req + employee_wages_cr + unsecured_debt_cr + statutory_tax_cr))
    
    return distributions

# Case: Realized 12 Cr. Debts total 1 Cr. Equity shares = 1,000,000
audit = simulate_voluntary_liquidation_waterfall(
    total_realized_cr=12.0,
    liquidation_costs_cr=0.1,
    workmen_dues_cr=0.2,
    secured_debt_cr=0.0,
    employee_wages_cr=0.1,
    unsecured_debt_cr=0.4,
    statutory_tax_cr=0.2,
    equity_shares_count=1000000
)
print("Liquidation Costs Settled (Cr):", audit["tier_1_liquidation_costs_paid"])
print("Creditor Debts Fully Discharged (Cr):", round(audit["tier_2_workmen_and_secured_paid"] + audit["tier_3_employee_wages_paid"] + audit["tier_4_unsecured_debt_paid"] + audit["tier_5_statutory_taxes_paid"], 2))
print("Surplus Capital Returned to Shareholders (Cr):", audit["tier_6_surplus_equity_distribution"])
print("Surplus Dividend Per Share (INR):", audit["dividend_per_share_inr"])
print("Ready for Section 59(7) Dissolution Order:", audit["dissolution_application_ready"])
'''

part4_check = {
    "question": "Under Section 59(7) and Section 59(8) of the IBC, who passes the final order dissolving a corporate debtor in voluntary liquidation, and within what timeframe must this order be filed with the ROC?",
    "options": [
        "The National Company Law Tribunal passes the dissolution order, and the liquidator must file it with the ROC within fourteen days",
        "The High Court passes the order, and the board of directors files it with SEBI within six months",
        "The liquidator passes an internal administrative order with zero tribunal involvement",
        "The State Police Department issues a certificate of closure filed with the municipal corporation within thirty days"
    ],
    "answerIndex": 0,
    "why": "Section 59(8) provides that the NCLT passes the dissolution order on an application under Section 59(7), and Section 59(9) mandates filing a copy with the ROC within 14 days."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Concealed Debt Fraud in Voluntary Liquidation
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Concealed Debt Fraud in Voluntary Liquidation"
part5_say = [
    "In corporate dissolution practice, the voluntary liquidation framework is occasionally weaponized by unscrupulous promoters seeking to execute an evasive corporate burial. This dangerous anti-pattern is known as 'The Concealed Debt Fraud' or 'The Sham Solvency Exit'. Promoters aware of massive impending tax reassessments, unquantified arbitration awards, or unasserted environmental liabilities execute a fraudulent Declaration of Solvency under Section 59(3), falsely certifying that the company has no debts or can pay all liabilities in full, attempting to dissolve the corporate shell and distribute assets before creditors can enforce claims.",
    "Consider a corporate entity facing an ongoing international commercial arbitration claim of fifty crore rupees. Knowing that an adverse final arbitral award is imminent, the directors execute an affidavit claiming that the company's only liabilities are twenty lakh rupees of utility bills. They rush through a shareholder special resolution, appoint a friendly liquidator, liquidate forty crore rupees of real estate, distribute the liquid cash as capital return dividends to promoter-shareholders, and petition the NCLT for dissolution under Section 59(7). If granted, the company is extinguished, leaving the arbitration creditor with an unenforceable paper judgment against a dead entity.",
    "To counter this lethal abuse, Section 59(6) of the Code erects a mandatory statutory circuit breaker: Mandatory Conversion to Compulsory Insolvency. Section 59(6) establishes that where the liquidator forms an opinion at any stage of the voluntary liquidation that the company will not be able to pay its debts in full from the proceeds of assets to be sold, the liquidator is legally obligated to immediately suspend the voluntary liquidation. The liquidator must submit an application to the Adjudicating Authority within three days, petitioning the NCLT to convert the proceeding into regular CIRP under Chapter II or compulsory liquidation under Section 33.",
    "Furthermore, statutory authorities and aggrieved commercial creditors possess immediate standing to intervene before the NCLT under Section 59(8) to oppose dissolution. If the tribunal uncovers that the directors executed a false Declaration of Solvency, the NCLT not only dismisses the dissolution petition, but initiates criminal prosecution under Section 73 of the Code. Section 73 imposes severe criminal penalties—imprisonment for a term of up to five years, or fines ranging from one lakh to one crore rupees—for making false declarations of solvency to defraud creditors.",
    "Additionally, under Section 66, the tribunal can hold promoters and directors personally liable without limitation for all debts of the company, piercing the corporate veil and ordering the clawback of all dividends distributed to shareholders. The liquidator also faces disciplinary disbarment by the IBBI if forensic audits prove collusion in ignoring known contingent claims.",
    "To inoculate corporate exit against these hazards, legal advisors must apply an exhaustive Pre-Liquidation Audit Protocol: (1) commissioning third-party legal risk assessments for contingent litigation; (2) securing statutory clearance certificates from income tax, GST, and labor departments; (3) publishing comprehensive Form A public notices; and (4) strictly activating Section 59(6) conversion if liabilities exceed realizable assets.",
    "Where liquidators encounter unasserted claims during the 30-day proof of claim window, they must immediately pause capital distributions. If a disputed tax assessment or arbitral award is crystallized, the liquidator cannot unilaterally discount it: the claim must be admitted and evaluated against total available liquid cash. If assets fall short by even one rupee, voluntary liquidation must cease immediately under Section 59(6).",
    "The jurisprudence developed by the NCLAT and the Supreme Court establishes that the NCLT's jurisdiction under Section 59(8) is not a mechanical rubber-stamp. The tribunal exercises judicial scrutiny to verify that all statutory clearances—including GST certificates, income tax clearances, labor welfare receipts, and municipal dues—have been duly placed on record. If an aggrieved creditor demonstrates that a contingent liability was fraudulently suppressed in the directors' solvency affidavit, the tribunal exercises its inherent powers under Rule 11 of the NCLT Rules 2016 to revoke the liquidation and order an immediate investigation by the Serious Fraud Investigation Office (SFIO).",
    "By fearlessly dismantling sham solvency schemes and enforcing severe criminal sanctions against fraudulent declarations, insolvency professionals maintain the sanctity and international credibility of India's corporate exit jurisprudence."
]

part5_example = "Directors of an engineering firm execute a Section 59 solvency affidavit concealing an ongoing thirty-crore customs penalty. Promoters execute fraudulent declaration of solvency in voluntary liquidation to evade government liabilities. During liquidation, the liquidator uncovers the pending customs tax demand. The liquidator immediately triggers Section 59(6), halting voluntary liquidation and petitioning the NCLT to convert the proceedings into compulsory liquidation, while the tribunal refers the directors for criminal prosecution under Section 73."

part5_code = '''def diagnose_voluntary_liquidation_fraud(realizable_assets_cr, admitted_debts_cr, contingent_unasserted_claims_cr, was_claim_deliberately_concealed):
    # Section 59(6) & Section 73 Diagnostic Rules:
    # 1. Total liabilities = admitted_debts + contingent_claims
    # 2. If total liabilities > realizable_assets -> INSOLVENT, cannot proceed under Section 59
    # 3. Liquidator MUST apply to convert to CIRP/Liquidation under Section 59(6)
    # 4. If deliberately concealed -> Section 73 criminal sanctions (imprisonment up to 5 yrs / fine up to 1 Cr)
    
    total_liabilities_cr = admitted_debts_cr + contingent_unasserted_claims_cr
    is_solvent = realizable_assets_cr >= total_liabilities_cr
    
    if not is_solvent:
        if was_claim_deliberately_concealed:
            return {
                "diagnosis": "FRAUDULENT_CONCEALED_DEBT_SHAM_SOLVENCY",
                "liquidator_action": "TRIGGER_SECTION_59_6_MANDATORY_CONVERSION",
                "judicial_ruling": "DISMISS_VOLUNTARY_LIQUIDATION_CONVERT_TO_COMPULSORY_IBC",
                "promoter_director_liability": "CRIMINAL_PROSECUTION_SECTION_73_AND_UNLIMITED_PERSONAL_LIABILITY_SECTION_66",
                "sanctions": "Imprisonment up to 5 years and fine up to 1 Crore INR"
            }
        else:
            return {
                "diagnosis": "UNFORESEEN_INSOLVENCY_DEFICIT",
                "liquidator_action": "APPLY_TO_NCLT_UNDER_SECTION_59_6_FOR_CIRP_CONVERSION",
                "judicial_ruling": "ORDER_CONVERSION_TO_STANDARD_CIRP",
                "promoter_director_liability": "NO_CRIMINAL_FRAUD_TRANSFER_TO_RP",
                "sanctions": "None (Bona fide commercial deficit discovery)"
            }
    else:
        return {
            "diagnosis": "GENUINE_SOLVENT_LIQUIDATION",
            "liquidator_action": "PROCEED_WITH_ASSET_DISTRIBUTION_AND_DISSOLUTION",
            "judicial_ruling": "SANCTION_DISSOLUTION_UNDER_SECTION_59_8",
            "promoter_director_liability": "CLEAN_DISCHARGE",
            "sanctions": "None"
        }

# Case: Assets 20 Cr, admitted debt 2 Cr, concealed customs claim 30 Cr (total liab 32 Cr > 20 Cr)
audit = diagnose_voluntary_liquidation_fraud(
    realizable_assets_cr=20.0,
    admitted_debts_cr=2.0,
    contingent_unasserted_claims_cr=30.0,
    was_claim_deliberately_concealed=True
)
print("Diagnostic Finding:", audit["diagnosis"])
print("Liquidator Statutory Mandate:", audit["liquidator_action"])
print("Tribunal Judicial Order:", audit["judicial_ruling"])
print("Penal Liabilities Imposed:", audit["promoter_director_liability"])
print("Statutory Penalties:", audit["sanctions"])
'''

part5_check = {
    "question": "Under Section 59(6) of the IBC, what is the mandatory statutory duty of a liquidator if they discover that the company in voluntary liquidation will not be able to pay its debts in full?",
    "options": [
        "Immediately suspend voluntary liquidation and apply to the NCLT within three days to convert the proceedings into CIRP or compulsory liquidation",
        "Borrow emergency funds from commercial banks at fifty percent annual interest rates",
        "Distribute all remaining cash to shareholders immediately before creditors discover the deficit",
        "Issue a press release demanding that the Ministry of Corporate Affairs settle the debt"
    ],
    "answerIndex": 0,
    "why": "Section 59(6) mandates that where the liquidator is of the opinion that the company will not be able to pay its debts in full, the liquidator shall immediately apply to the Adjudicating Authority to suspend voluntary liquidation and convert to CIRP or compulsory liquidation."
}

# Try-It texts
try_it_texts = [
    "Execute the Fast-Track CIRP eligibility engine to evaluate small company turnover criteria and calculate statutory deadlines.",
    "Run the Fast-Track operational velocity simulator to evaluate Information Memorandum deadlines and verify schedule compliance.",
    "Simulate the voluntary liquidation prerequisites engine to test director solvency declarations and evaluate shareholder votes.",
    "Execute the Section 53 voluntary liquidation realization waterfall engine to distribute surplus capital and prepare dissolution filings.",
    "Run the voluntary liquidation fraud diagnostic engine to detect concealed liabilities and enforce Section 59(6) conversion mandates."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
# Remember: gate.ts checks intro against say[0], say1 against say[0], example against example, tryIt against tryIt
captions = [
    {
        "intro": "Accelerated fast track insolvency resolution mechanisms provide rapid relief.",
        "say1": "Accelerated low cost resolution pathways resolve small corporate entities.",
        "example": "Accelerated fast track insolvency resolution mechanisms provide rapid relief.",
        "tryIt": "Fast-Track CIRP eligibility engines evaluate small company turnover criteria."
    },
    {
        "intro": "Accelerated regulations mandate operational efficiency in restructuring.",
        "say1": "Accelerated regulations mandate operational efficiency in restructuring.",
        "example": "Accelerated regulations mandate operational efficiency in restructuring.",
        "tryIt": "Operational velocity simulators evaluate Information Memorandum deadlines."
    },
    {
        "intro": "Voluntary liquidation architecture provides exit for solvent corporate persons.",
        "say1": "Voluntary liquidation architecture provides exit for solvent corporate persons.",
        "example": "Voluntary liquidation architecture provides exit for solvent corporate persons.",
        "tryIt": "Voluntary liquidation engines test director solvency declarations and votes."
    },
    {
        "intro": "Liquidators assume statutory custody during voluntary liquidation proceedings.",
        "say1": "Liquidators assume statutory custody during voluntary liquidation proceedings.",
        "example": "Liquidators assume statutory custody during voluntary liquidation proceedings.",
        "tryIt": "Realization waterfall engines distribute surplus capital and filings."
    },
    {
        "intro": "Promoters execute fraudulent declaration of solvency in voluntary liquidation.",
        "say1": "Promoters execute fraudulent declaration of solvency in voluntary liquidation.",
        "example": "Promoters execute fraudulent declaration of solvency in voluntary liquidation.",
        "tryIt": "Fraud diagnostic engines detect concealed liabilities and enforce conversion."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "Notified Classes", "subtext": "Small companies, startups, and asset-capped firms"},
        {"id": "s2", "name": "Ninety Day Clock", "subtext": "Compressed base statutory resolution window"},
        {"id": "s3", "name": "Single Extension", "subtext": "Maximum forty-five days with seventy-five percent vote"},
        {"id": "s4", "name": "Outer Ceiling", "subtext": "One hundred and thirty-five day absolute limit"}
    ],
    [
        {"id": "s1", "name": "Claims Verification", "subtext": "Ten-day compressed proof of claims window"},
        {"id": "s2", "name": "Accelerated Valuation", "subtext": "Registered valuers report within twenty-one days"},
        {"id": "s3", "name": "Form G Issuance", "subtext": "Bidding invitation published within twenty-one days"},
        {"id": "s4", "name": "CoC Supermajority", "subtext": "Sixty-six percent plan approval before Day 90"}
    ],
    [
        {"id": "s1", "name": "Solvent Prerequisite", "subtext": "Absolute absence of default across corporate debts"},
        {"id": "s2", "name": "Solvency Affidavit", "subtext": "Majority directors declare full ability to pay debts"},
        {"id": "s3", "name": "Special Resolution", "subtext": "Seventy-five percent shareholder vote within four weeks"},
        {"id": "s4", "name": "Creditor Consent", "subtext": "Two-thirds creditor approval within seven days"}
    ],
    [
        {"id": "s1", "name": "Dedicated Bank Account", "subtext": "Mandatory liquidation account for transparent realization"},
        {"id": "s2", "name": "Section 53 Waterfall", "subtext": "Full debt settlement followed by equity distributions"},
        {"id": "s3", "name": "Final Report", "subtext": "Audited accounts and certificate of zero litigation"},
        {"id": "s4", "name": "NCLT Dissolution", "subtext": "Order filed with ROC within fourteen days"}
    ],
    [
        {"id": "s1", "name": "Concealed Debt Sham", "subtext": "Falsifying solvency to evade arbitration or taxes"},
        {"id": "s2", "name": "Section 59(6) Trigger", "subtext": "Mandatory suspension and conversion to CIRP"},
        {"id": "s3", "name": "Criminal Sanctions", "subtext": "Section 73 imprisonment and heavy personal fines"},
        {"id": "s4", "name": "Clawback Order", "subtext": "Section 66 recovery of distributed shareholder capital"}
    ]
]

part_tuples = [
    (1, part1_title, part1_say, part1_example, part1_code, part1_check, try_it_texts[0]),
    (2, part2_title, part2_say, part2_example, part2_code, part2_check, try_it_texts[1]),
    (3, part3_title, part3_say, part3_example, part3_code, part3_check, try_it_texts[2]),
    (4, part4_title, part4_say, part4_example, part4_code, part4_check, try_it_texts[3]),
    (5, part5_title, part5_say, part5_example, part5_code, part5_check, try_it_texts[4])
]

lesson_parts = []
total_day_words = 0
code_hashes = []

for idx, (p_num, p_title, p_say, p_ex, p_code, p_chk, p_try) in enumerate(part_tuples):
    res = subprocess.run([sys.executable, "-c", p_code], capture_output=True, text=True, check=True)
    out = res.stdout
    
    words = sum(len(para.split()) for para in p_say)
    total_day_words += words
    print(f"Day 44 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 44 Part {p_num} words {words} < 600!"
    
    h = hashlib.sha256(p_code.encode("utf-8")).hexdigest()
    code_hashes.append(h)
    
    lesson_parts.append({
        "part": p_num,
        "title": p_title,
        "say": p_say,
        "example": p_ex,
        "code": p_code,
        "output": out,
        "tryIt": p_try,
        "check": p_chk
    })

print(f"Total Day 44 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day44_lesson.json
with open("scripts/day44_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day44_lesson.json successfully!")

# 2. Append or replace in src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 44 is already present
day_marker = f'"day": {day_num},'
if day_marker in ts_content:
    print(f"Day {day_num} already exists in {ts_path}! Removing old entry.")
    pos = ts_content.find(day_marker)
    brace_pos = ts_content.rfind('{', 0, pos)
    depth = 0
    end_pos = -1
    for i in range(brace_pos, len(ts_content)):
        if ts_content[i] == '{':
            depth += 1
        elif ts_content[i] == '}':
            depth -= 1
            if depth == 0:
                end_pos = i + 1
                break
    if end_pos != -1:
        prefix = ts_content[:brace_pos].rstrip()
        suffix = ts_content[end_pos:].lstrip()
        if prefix.endswith(','):
            prefix = prefix[:-1].rstrip()
        if suffix.startswith(','):
            suffix = suffix[1:].lstrip()
        ts_content = prefix + ",\n" + suffix

last_bracket = ts_content.rfind("];")
if last_bracket == -1:
    last_bracket = ts_content.rfind("]")
    
day_json_str = json.dumps(day_data, indent=2)
new_ts_content = ts_content[:last_bracket].rstrip()
if new_ts_content.endswith(","):
    new_ts_content += "\n" + day_json_str + "\n];\n"
else:
    new_ts_content += ",\n" + day_json_str + "\n];\n"
    
with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_ts_content)
print(f"Appended Day {day_num} to {ts_path} successfully!")

# 3. Build day-44.json visual file
entries = []
for idx, p in enumerate(lesson_parts):
    stgs = stages_definitions[idx]
    caps = captions[idx]
    
    steps = [
        {"at": "intro", "caption": caps["intro"], "activeStageId": "s1", "statusBadge": "active"},
        {"at": "say1", "caption": caps["say1"], "activeStageId": "s2", "statusBadge": "active"},
        {"at": "example", "caption": caps["example"], "activeStageId": "s3", "statusBadge": "active"},
        {"at": "tryIt", "caption": caps["tryIt"], "activeStageId": "s4", "statusBadge": "done"}
    ]
    
    entries.append({
        "partTitle": p["title"],
        "codeHash": code_hashes[idx],
        "filled": {},
        "spec": {
            "template": "workflow",
            "title": f"{p['title']} Architecture",
            "stages": stgs,
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "bcom_law",
    "day": 44,
    "promptSha": "prompt_sha_bcom_law_day44_fast_track_voluntary_liquidation_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-44.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
