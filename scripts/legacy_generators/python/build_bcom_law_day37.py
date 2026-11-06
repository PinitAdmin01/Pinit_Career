import json, sys, subprocess, os, re, hashlib

# Builder for Day 37 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 37: Interim Resolution Professional (IRP) Appointment, Public Announcement (Form A) & Collation of Claims (Forms B/C/CA)

day_num = 37
course_prefix = "bcom_law"
day_title = "Interim Resolution Professional (IRP) Appointment, Public Announcement & Collation of Claims"
day_desc = "Master the operational and statutory duties of the Interim Resolution Professional (IRP) during the initial thirty days of CIRP: Section 16 appointment orders, Section 17 statutory suspension of board powers, Section 15 public announcement in Form A, collation and forensic verification of creditor claims across Form B, Form C, and Form CA, and going-concern preservation under Section 20."

# Part 1: Section 16 Appointment of IRP, Section 17 Suspension of Board & Section 18 Management Powers
part1_title = "Section 16 Appointment of IRP, Section 17 Suspension of Board & Section 18 Management Powers"
part1_say = [
    "The statutory admission of an insolvency application under Section 7, 9, or 10 triggers an immediate executive transition within the corporate debtor. Under Section 16(1) of the Insolvency and Bankruptcy Code 2016, the Adjudicating Authority must appoint an Interim Resolution Professional (IRP) on the insolvency commencement date itself. Where the application is initiated by a financial creditor or corporate debtor, the proposed insolvency professional is appointed, provided no disciplinary proceedings are pending against them. Where an operational creditor does not propose an IRP, the NCLT directs the Insolvency and Bankruptcy Board of India (IBBI) under Section 16(3)(a) to nominate an insolvency professional within ten days, ensuring seamless statutory leadership.",
    "The legal consequence of appointing an IRP is immediate, sweeping, and non-negotiable. Under Section 17(1)(a), the powers of the Board of Directors of the corporate debtor stand suspended by operation of law from the date of appointment of the interim resolution professional, and such powers vest exclusively in the IRP. Former directors lose all legal authority to execute commercial contracts, operate enterprise bank accounts, alienate company assets, or issue corporate instructions. Promoters and directors are relegated to assisting the IRP, with Section 19 imposing an affirmative statutory duty upon all personnel, promoters, and auditors to extend full cooperation and produce all accounting records upon demand.",
    "Under Section 18, the IRP assumes comprehensive custodial and managerial responsibilities over the enterprise. The IRP is mandated to collect all information relating to the assets, finances, and commercial operations of the corporate debtor, including business operations for the prior two financial years, financial and operating results, and the list of assets and liabilities. The IRP must take immediate physical and digital custody and control of all enterprise assets, including tangible properties, plant machinery, intellectual property rights, inventories, banking accounts, and contractual receivables.",
    "To effectuate banking control, Section 17(1)(d) empowers the IRP to instruct all scheduled commercial banks, financial institutions, and depository participants holding accounts of the corporate debtor to freeze operation of existing signatory authorities. The IRP issues formal regulatory notices replacing suspended promoter signatures with their own digital signatures, assuming unilateral debit and credit authorization over corporate funds. Bankers who honor checks or transactions initiated by suspended promoters face severe contempt proceedings and personal penalties before the NCLT.",
    "Crucially, the IRP acts as an officer of the court and a statutory fiduciary for the entire creditor collective. Under Section 233 of the IBC, the IRP is granted statutory immunity, protecting them from criminal prosecution, civil suits, or damages for anything done in good faith during the discharge of their official functions. However, this immunity is conditional upon strict compliance with the IBBI Code of Conduct: the IRP must maintain complete professional independence, refrain from self-dealing, disclose conflicts of interest, and protect enterprise value with reasonable skill and forensic diligence.",
    "If the suspended management or employees refuse to deliver financial records, ERP passwords, or factory keys, the IRP is not left helpless. Under Section 19(2), the IRP can immediately file an application before the NCLT seeking coercive orders. The NCLT is statutorily empowered to issue binding directions compelling compliance, ordering local police assistance, or directing revenue authorities to enforce the physical surrender of corporate assets, breaking promoter resistance and upholding the rule of law.",
    "Finally, the term of the Interim Resolution Professional continues until the formal appointment of a Resolution Professional (RP) under Section 22 by the Committee of Creditors. During this crucial transitional window of thirty days, the IRP lays the institutional foundation for the entire Corporate Insolvency Resolution Process, establishing physical asset registries, taking control of electronic enterprise resource planning software, and safeguarding corporate records from spoliation."
]

part1_example = "Upon admitting a Section 7 CIRP application against an automobile parts supplier, the NCLT appoints an Interim Resolution Professional. The managing director attempts to withdraw twenty lakh rupees from the company bank account to settle personal legal fees. The commercial bank, having received the IRP's Section 17 notice of board suspension, instantly rejects the check. The IRP assumes exclusive banking control and issues instructions that only operational payroll and utility bills will be disbursed."

part1_code = '''def audit_irp_appointment_and_board_suspension(appointment_order_served, bank_notices_issued, promoter_resisting_access, erp_passwords_surrendered):
    # Section 17 Invariants: Board powers suspended immediately upon IRP appointment
    board_powers_suspended = appointment_order_served
    banking_control_vested = appointment_order_served and bank_notices_issued
    
    # Section 19 Invariants: Personnel must cooperate
    compliance_complete = erp_passwords_surrendered and (not promoter_resisting_access)
    
    remedial_action = "PROCEED_WITH_NORMAL_CUSTODY"
    if promoter_resisting_access or (not erp_passwords_surrendered):
        remedial_action = "FILE_SECTION_19(2)_COERCIVE_APPLICATION_BEFORE_NCLT"
        
    return {
        "board_powers_suspended": board_powers_suspended,
        "banking_control_secured": banking_control_vested,
        "section_19_compliance": compliance_complete,
        "immediate_legal_remedy": remedial_action,
        "irp_status": "EXECUTIVE_CUSTODIAN_IN_CHARGE" if banking_control_vested else "TRANSITIONAL_PENDING_NOTICES"
    }

# Case: IRP appointed, bank notices served, but suspended promoter refuses to surrender ERP passwords
audit = audit_irp_appointment_and_board_suspension(
    appointment_order_served=True,
    bank_notices_issued=True,
    promoter_resisting_access=True,
    erp_passwords_surrendered=False
)
print("Board Powers Suspended:", audit["board_powers_suspended"])
print("Banking Control Secured:", audit["banking_control_secured"])
print("Section 19 Cooperation Compliant:", audit["section_19_compliance"])
print("Required Legal Remedy:", audit["immediate_legal_remedy"])
'''

part1_check = {
    "question": "Under Section 17 of the Insolvency and Bankruptcy Code 2016, what happens to the powers of the Board of Directors upon the appointment of an Interim Resolution Professional?",
    "options": [
        "The powers of the Board of Directors stand suspended by operation of law and vest exclusively in the IRP",
        "The Board continues to manage all commercial banking operations while the IRP acts as an advisory observer",
        "The Board shares joint executive veto power with the IRP over all transactions exceeding ten lakh rupees",
        "The Board is automatically dissolved and all directors are barred from entering company premises"
    ],
    "answerIndex": 0,
    "why": "Section 17(1)(a) provides that from the date of appointment of the IRP, the powers of the board of directors of the corporate debtor stand suspended and are exercised by the interim resolution professional."
}

# Part 2: Section 15 Public Announcement in Form A: Statutory Deadlines & Notification Protocols
part2_title = "Section 15 Public Announcement in Form A: Statutory Deadlines & Notification Protocols"
part2_say = [
    "The statutory clock of the Corporate Insolvency Resolution Process begins ticking aggressively from day one. Under Section 13(1)(b) read with Section 15 of the IBC and Regulation 6 of the IBBI (Insolvency Resolution Process for Corporate Persons) Regulations 2016, the Interim Resolution Professional is under a strict statutory obligation to make a Public Announcement within three days of their appointment. The public announcement represents the universal summons to all stakeholders, notifying global and domestic creditors that the corporate debtor is under insolvency administration and inviting them to submit proof of their financial or operational claims.",
    "Regulation 6 prescribes that the public announcement must be issued in statutory Form A. Form A must contain precise, non-negotiable particulars: the name and registration number of the corporate debtor; its registered office address and corporate identification number (CIN); the date of the NCLT admission order; the details and registration credentials of the IRP; the last date for submission of claims (which must be fourteen days from the date of appointment of the IRP); and the website address where claim forms can be downloaded.",
    "The statutory publication protocols governing Form A are stringent. The IRP must publish the announcement in at least one English language national newspaper and at least one regional language newspaper with wide circulation in the state where the registered office of the corporate debtor is located, as well as in other regions where the debtor conducts substantial commercial operations. Furthermore, the announcement must be uploaded to the official website of the corporate debtor (if operational) and submitted electronically to the Insolvency and Bankruptcy Board of India for publication on its dedicated insolvency portal.",
    "The fourteenth day from appointment represents the primary statutory claim submission deadline. However, commercial realities frequently prevent creditors—such as foreign suppliers, retail debenture holders, or unorganized vendors—from submitting claims within fourteen days. To ensure equitable participation, Regulation 12(2) provides that a creditor who fails to submit proof of claim within the fourteen-day window may submit such proof to the IRP or RP at any time on or before the ninetieth day of the insolvency commencement date.",
    "Claims submitted up to the ninetieth day must be collated and verified by the Resolution Professional. However, any claim submitted after the ninetieth day is statutorily barred, unless specifically condoned by an order of the NCLT upon proving extraordinary circumstances. The Supreme Court in RPS Infrastructure Ltd. v. Mukul Kumar affirmed that once a resolution plan is approved by the Committee of Creditors, belated claims cannot be entertained, as reopening settled claims would torpedo commercial certainty and wreck the time-bound CIRP architecture.",
    "The costs incurred in publishing the public announcement in national and regional newspapers form part of the Insolvency Resolution Process Costs (IRPC) under Section 5(13). The IRP is legally authorized to pay these publication expenses from enterprise operational revenues or through emergency interim finance, ensuring that transparency and public notice requirements are executed without delay.",
    "In operational practice, the IRP must meticulously archive physical copies of newspaper clippings, electronic proof of delivery to the IBBI portal, and website upload timestamp logs. This comprehensive documentary audit trail protects the IRP from procedural challenges filed by delinquent creditors before the NCLT alleging defective public notification or denial of natural justice.",
    "Under Regulation 6A introduced by IBBI, the IRP is also encouraged to send direct electronic communications to all financial and operational creditors whose contact information appears on the books of accounts of the corporate debtor. This proactive multi-channel notification ensures that creditors with valid claims are alerted promptly, minimizing subsequent claim disputes and facilitating comprehensive debt mapping during the opening weeks of the insolvency resolution journey."
]

part2_example = "An IRP is appointed on Monday morning. By Wednesday evening, the IRP compiles Form A and dispatches it for publication in a leading English financial daily and a vernacular Marathi daily in Mumbai. The notice specifies the fourteenth-day claim cutoff. A German equipment manufacturer misses the fourteen-day deadline due to overseas apostille delays, but submits Form B on day forty-five. Under Regulation 12(2), the IRP is statutorily bound to accept and verify the claim before the ninety-day outer limit."

part2_code = '''def evaluate_form_a_public_announcement_deadlines(appointment_day, announcement_day, claim_submission_day, newspaper_circulation_ok, ibbi_portal_uploaded):
    # Invariant 1: Announcement within 3 days of appointment (Regulation 6)
    days_to_announce = announcement_day - appointment_day
    announcement_timely = days_to_announce <= 3
    
    # Invariant 2: Publication in English + Regional + IBBI portal
    publication_valid = newspaper_circulation_ok and ibbi_portal_uploaded
    
    # Invariant 3: Claim submission timing (Regulation 12)
    # Days 0-14: Primary statutory window
    # Days 15-90: Permitted extended window (Regulation 12(2))
    # Days > 90: Statutorily barred without NCLT condonation
    claim_status = "REJECTED_STATUTORILY_BARRED"
    if claim_submission_day <= 14:
        claim_status = "PRIMARY_WINDOW_ACCEPTED"
    elif claim_submission_day <= 90:
        claim_status = "REGULATION_12(2)_EXTENDED_WINDOW_ACCEPTED"
        
    return {
        "days_to_announce": days_to_announce,
        "announcement_compliant": announcement_timely and publication_valid,
        "claim_submission_day": claim_submission_day,
        "claim_status": claim_status
    }

# Case: Announcement on Day 2 with dual newspaper and portal filing; claim filed on Day 45
audit = evaluate_form_a_public_announcement_deadlines(
    appointment_day=1,
    announcement_day=3,
    claim_submission_day=45,
    newspaper_circulation_ok=True,
    ibbi_portal_uploaded=True
)
print("Public Announcement Compliant:", audit["announcement_compliant"])
print("Claim Submission Day:", audit["claim_submission_day"])
print("Claim Verification Status:", audit["claim_status"])
'''

part2_check = {
    "question": "Under Regulation 6 of the IBBI CIRP Regulations 2016, within how many days of appointment must the Interim Resolution Professional make the public announcement in Form A?",
    "options": [
        "Within three days of appointment",
        "Within fourteen days of appointment",
        "Within thirty days of appointment",
        "Within forty-eight hours of board approval"
    ],
    "answerIndex": 0,
    "why": "Regulation 6(1) of the IBBI CIRP Regulations mandates that the interim resolution professional shall make a public announcement within three days from their appointment."
}

# Part 3: Collation and Verification of Claims: Form B (Operational), Form C (Financial) & Form CA (Class Claims)
part3_title = "Collation and Verification of Claims: Form B (Operational), Form C (Financial) & Form CA (Class Claims)"
part3_say = [
    "The core statutory responsibility of the IRP during the first thirty days is the collation and verification of claims submitted by enterprise creditors. The IBC establishes distinct statutory forms tailored to specific categories of debt: Form B for Operational Creditors (except workmen and employees); Form C for Financial Creditors; Form D for Workmen and Employees; Form E for Authorized Representatives of Workmen; and Form CA for Financial Creditors in a Class, specifically real estate homebuyers and debenture holders.",
    "Form B claims submitted by operational creditors encompass vendor invoices, supplier contracts, transport billings, and government statutory dues. Regulation 7 requires the operational creditor to substantiate their claim with: commercial invoices; contracts for supply of goods or services; proof of delivery such as Goods Receipt Notes (GRN); certified bank statements showing non-payment; and orders of courts or arbitral tribunals. The IRP does not adjudicate claims as a judge, but functions as a forensic administrative verifier: under Swiss Ribbons, the IRP cross-references claimed invoices against the corporate debtor's accounting ledgers, GST input tax credits, and warehouse inventory records.",
    "Form C claims submitted by financial creditors represent long-term term loans, working capital facilities, and debenture debt. Regulation 8 mandates financial creditors to furnish: loan agreements and sanction letters; deed of hypothecation or mortgage documents evidencing security interests; certified records of default from an Information Utility (NeSL); and bank statement certificates under the Bankers' Books Evidence Act 1891. Crucially, the IRP must verify whether interest calculations comply with contractual covenants, disallowing retroactive penal interest or uncapitalized charges.",
    "Form CA governs Financial Creditors in a Class under Section 21(6A)(b) and Regulation 8A, most commonly hundreds of homebuyers in a stalled real estate development. Individual homebuyers submit allotment letters, builder-buyer agreements, bank payment receipts, and interest calculations. To facilitate their collective voice, homebuyers vote in Form A to elect an Authorized Representative (AR)—a qualified insolvency professional who attends Committee of Creditors meetings and casts votes on behalf of the class according to instructions received through online electronic voting.",
    "Under Regulation 13(1), the IRP or RP must verify every claim within seven days from the date of its receipt. The IRP classifies verified claims into admitted amounts, rejected amounts, and amounts under verification pending further documentary substantiation. The IRP must maintain an updated List of Creditors on the corporate debtor's website, detailing the name of each creditor, the amount claimed, the amount admitted, the nature of security interest held, and the calculated voting share.",
    "Where a creditor disagrees with the IRP's determination or claims partial rejection, their statutory remedy is codified under Section 60(5) of the Code. The aggrieved creditor can file an application before the NCLT challenging the IRP's rejection order. The NCLT exercises supervisory jurisdiction over claim collation, ordering the IRP to reconsider admitted amounts if documentary proof demonstrates arbitrary disallowance.",
    "Furthermore, Section 77 of the Companies Act 2013 intersects critically with claim verification under the IBC. Where a financial creditor asserts a secured claim against real estate, plant machinery, or book debts, the IRP must verify whether the underlying charge was duly registered with the Registrar of Companies (ROC) and indexed on the CERSAI portal. Under Section 77(3), an unregistered charge is void against the liquidator or resolution professional, stripping the creditor of secured status and reclassifying their exposure as unsecured debt.",
    "Additionally, under Regulation 14, where the amount of a claim cannot be determined with certainty due to pending arbitral proceedings or ongoing tax assessments, the IRP or RP shall make the best estimate of the amount of the claim based on the information available with them. As more information becomes available or as judicial decrees are rendered, the Resolution Professional must revise the estimated claim amount under Regulation 14(2), ensuring that contingent and disputed creditor exposures are dynamically reflected throughout the resolution period.",
    "Finally, the integrity of the claim collation process determines the balance of power across the entire CIRP. The admitted amounts of financial debt form the mathematical denominator for calculating each lender's voting share in the Committee of Creditors, making rigorous forensic verification the ultimate safeguard of creditor democracy."
]

part3_example = "A commercial bank submits Form C claiming one hundred and ten crore rupees, including ten crore rupees of compounded penal charges. The IRP inspects loan covenants, notes that the loan agreement only permitted simple interest on overdue balances, and admits one hundred and four crore rupees while rejecting six crore rupees of unauthorized penal compounding. The bank accepts the forensic calculation, and its voting share is calibrated against the total admitted financial debt."

part3_code = '''def collate_and_verify_creditor_claim(form_type, claimed_principal_cr, claimed_interest_cr, contract_permits_penal_interest, has_nesl_or_invoice_proof, ledger_shows_unpaid):
    # Form Type Verification:
    # Form B: Operational Creditor
    # Form C: Financial Creditor
    # Form CA: Creditor in Class (e.g. Homebuyer)
    
    if not (has_nesl_or_invoice_proof and ledger_shows_unpaid):
        return {
            "form": form_type,
            "claimed_total": claimed_principal_cr + claimed_interest_cr,
            "admitted_amount": 0.0,
            "rejected_amount": claimed_principal_cr + claimed_interest_cr,
            "status": "REJECTED_LACK_OF_EVIDENTIARY_PROOF"
        }
        
    admitted_principal = claimed_principal_cr
    
    # Penal interest disallowance rule:
    # If penal compounding is unauthorized by loan covenant, disallow unauthorized portion
    admitted_interest = claimed_interest_cr if contract_permits_penal_interest else (claimed_interest_cr * 0.6)
    rejected_interest = claimed_interest_cr - admitted_interest
    
    admitted_total = admitted_principal + admitted_interest
    rejected_total = rejected_interest
    
    return {
        "form": form_type,
        "claimed_total": round(claimed_principal_cr + claimed_interest_cr, 2),
        "admitted_amount": round(admitted_total, 2),
        "rejected_amount": round(rejected_total, 2),
        "status": "PARTIALLY_ADMITTED" if rejected_total > 0 else "FULLY_ADMITTED"
    }

# Case: Bank claims 100 Cr principal + 10 Cr interest; loan covenant does not permit penal interest
audit = collate_and_verify_creditor_claim(
    form_type="Form_C_Financial",
    claimed_principal_cr=100.0,
    claimed_interest_cr=10.0,
    contract_permits_penal_interest=False,
    has_nesl_or_invoice_proof=True,
    ledger_shows_unpaid=True
)
print("Claim Form Type:", audit["form"])
print("Total Claimed (Cr):", audit["claimed_total"])
print("Admitted Amount (Cr):", audit["admitted_amount"])
print("Rejected Amount (Cr):", audit["rejected_amount"])
print("Verification Status:", audit["status"])
'''

part3_check = {
    "question": "Under the IBBI CIRP Regulations 2016, which statutory form must be utilized by Financial Creditors in a Class, such as real estate homebuyers, to submit proof of their claims?",
    "options": [
        "Form CA (Submission of claim by financial creditors in a class)",
        "Form B (Submission of claim by operational creditors)",
        "Form C (Submission of claim by financial creditors)",
        "Form D (Submission of claim by workmen and employees)"
    ],
    "answerIndex": 0,
    "why": "Regulation 8A of the IBBI CIRP Regulations prescribes that a financial creditor in a class shall submit proof of claim to the interim resolution professional in Form CA."
}

# Part 4: Section 20 Management of Corporate Debtor as Going Concern & Interim Finance
part4_title = "Section 20 Management of Corporate Debtor as Going Concern & Interim Finance"
part4_say = [
    "A foundational objective of the Insolvency and Bankruptcy Code 2016 is enterprise preservation: the corporate debtor must not be liquidated or broken up at the inception of insolvency, but maintained as an active, productive economic entity. Under Section 20(1) of the Code, the Interim Resolution Professional is under an affirmative statutory mandate to make every endeavor to protect and preserve the value of the property of the corporate debtor and manage the operations of the corporate debtor as a going concern throughout the CIRP.",
    "To fulfill this going-concern mandate, Section 20(2) confers extensive executive powers upon the IRP: (a) to appoint accountants, legal counsel, and other professionals to assist in enterprise administration; (b) to enter into contracts on behalf of the corporate debtor or amend existing commercial contracts; (c) to raise emergency interim finance; (d) to issue instructions to personnel of the corporate debtor and take disciplinary action against non-compliant staff; and (e) to execute all deeds, receipts, or other documents on behalf of the enterprise.",
    "The raising of Interim Finance under Section 20(2)(c) represents the financial lifeline for an enterprise undergoing insolvency. Distressed companies routinely face acute liquidity crunches, unable to pay monthly wages, purchase raw materials, or pay industrial power tariffs. Section 5(13) defines 'Insolvency Resolution Process Costs' (IRPC) to include any interim finance raised, along with the costs of raising such finance. Under Section 30(2)(a) and the Section 53 liquidation waterfall, IRPC enjoys absolute first-priority repayment status over all financial creditors, secured lenders, and government taxes, providing private credit funds and banks with statutory super-priority security to advance working capital.",
    "However, Section 20(2)(c) contains a crucial checks-and-balances proviso: no interim finance can be raised by creating a security interest over encumbered property of the corporate debtor without the prior approval of the creditors whose security interests are affected, or without the sixty-six percent approval of the Committee of Creditors once the CoC is constituted. Furthermore, unencumbered assets may be pledged up to the value of the interim credit, protecting existing secured lenders from arbitrary asset dilution.",
    "Section 20 also governs vendor continuity. Critical suppliers cannot unilaterally cancel supply agreements simply because an insolvency petition was admitted. Under Section 14(2A) read with Section 20, where the IRP determines that the supply of specialized industrial gases, raw chemicals, or software licenses is essential to keep factory assembly lines running, suppliers must continue providing goods, provided the IRP pays current operational invoices from enterprise cash flows.",
    "All expenditures incurred by the IRP in managing going-concern operations—including employee salaries, vendor payments for current supplies, security guard services, factory maintenance, and professional fees—are classified as IRPC. The IRP must present a comprehensive accounting of process costs at every meeting of the Committee of Creditors for statutory ratification under Regulation 34.",
    "In addition, under Section 25, when the Resolution Professional takes over from the IRP, they assume all duties to maintain operational continuity, represent the corporate debtor before judicial and administrative forums, and issue expressions of interest to attract prospective resolution applicants. The RP coordinates daily factory shifts, manages supply chains, and ensures regulatory filings with environmental and labor authorities remain current.",
    "Furthermore, Section 28 imposes strict parliamentary checks on the operational powers of the Resolution Professional. While managing going-concern affairs, the RP cannot take certain high-stakes actions without the prior approval of the Committee of Creditors by a vote of sixty-six percent of voting shares. These restricted actions include: raising interim finance in excess of the amount decided by the CoC; creating any security interest over the assets of the corporate debtor; changing the capital structure or management hierarchy; entering into related party transactions; or delegating statutory duties. This governance architecture ensures that executive management remains accountable to the creditor collective.",
    "By safeguarding commercial continuity and providing statutory super-priority for interim lenders, Section 20 transforms insolvency from a death sentence into a revitalizing corporate rescue mechanism, preserving jobs, enterprise brand equity, and productive capacity for prospective resolution applicants."
]

part4_example = "A steel manufacturing plant in CIRP requires four crore rupees to purchase coking coal and pay workers' monthly wages. The company's treasury is empty. The IRP negotiates an emergency credit line of four crore rupees from a specialized private debt fund under Section 20(2)(c). The credit line is categorized as Insolvency Resolution Process Cost, guaranteeing first-priority repayment before all secured mortgage lenders. The factory continues production without a single hour of downtime."

part4_code = '''def evaluate_interim_finance_and_going_concern(monthly_revenue_cr, monthly_fixed_opex_cr, raw_material_needs_cr, interim_finance_requested_cr, unencumbered_assets_available_cr):
    # Monthly operational cash deficit calculation
    monthly_outflows = monthly_fixed_opex_cr + raw_material_needs_cr
    net_monthly_deficit = monthly_outflows - monthly_revenue_cr
    
    # Interim Finance Feasibility:
    # Requires adequate unencumbered collateral or super-priority IRPC status
    has_sufficient_collateral = unencumbered_assets_available_cr >= interim_finance_requested_cr
    covers_six_months_deficit = interim_finance_requested_cr >= (net_monthly_deficit * 6)
    
    return {
        "monthly_burn_rate_cr": round(net_monthly_deficit, 2),
        "interim_finance_requested_cr": interim_finance_requested_cr,
        "super_priority_irpc_status": True,
        "collateral_backed": has_sufficient_collateral,
        "covers_six_months_burn": covers_six_months_deficit,
        "going_concern_feasibility": "SUSTAINABLE" if (has_sufficient_collateral and covers_six_months_deficit) else "LIQUIDATION_RISK"
    }

# Case: Steel mill revenues 2 Cr, opex 3 Cr, coal 2 Cr (Deficit 3 Cr/mo). Seeks 18 Cr interim finance backed by 25 Cr unencumbered plant land
audit = evaluate_interim_finance_and_going_concern(
    monthly_revenue_cr=2.0,
    monthly_fixed_opex_cr=3.0,
    raw_material_needs_cr=2.0,
    interim_finance_requested_cr=18.0,
    unencumbered_assets_available_cr=25.0
)
print("Monthly Operational Cash Deficit (Cr):", audit["monthly_burn_rate_cr"])
print("Interim Finance Super-Priority IRPC Status:", audit["super_priority_irpc_status"])
print("Adequate Unencumbered Collateral:", audit["collateral_backed"])
print("Going Concern Operations Status:", audit["going_concern_feasibility"])
'''

part4_check = {
    "question": "Under Section 5(13) read with Section 53 of the Insolvency and Bankruptcy Code 2016, what priority does Interim Finance raised by the IRP enjoy in debt repayment?",
    "options": [
        "First-priority repayment status as part of Insolvency Resolution Process Costs (IRPC)",
        "Equal pari passu priority with unsecured commercial trade creditors",
        "Subordinated priority ranking behind central and state government tax arrears",
        "Priority ranking below promoter equity redemption and dividend arrears"
    ],
    "answerIndex": 0,
    "why": "Section 5(13) defines IRPC to include interim finance and the costs of raising it, and under Section 30(2)(a) and Section 53(1)(a), IRPC must be paid in full with top super-priority before any other creditor distributions."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Bogus Creditor Claim & Inflated Penal Interest Crisis
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Bogus Creditor Claim & Inflated Penal Interest Crisis"
part5_say = [
    "In corporate insolvency practice, one of the most destructive systemic pathologies is the 'Bogus Creditor Claim and Voting Share Hijacking' anti-pattern. This crisis arises during the first thirty days of CIRP when fraudulent or related-party claimants submit astronomical, fictitious claims—frequently backed by fabricated backdated promissory notes, bogus advisory service contracts, or compounded default penalties. If an inexperienced or negligent IRP admits these phantom debts without rigorous forensic scrutiny, the balance of power within the Committee of Creditors is fatally corrupted, allowing tainted actors to seize the statutory sixty-six percent voting threshold.",
    "The first vulnerability occurs with related-party financial claims. Section 21(2) first proviso codifies an absolute statutory disqualification: a financial creditor or its authorized representative who is a 'related party' of the corporate debtor shall not have any right of representation, participation, or voting in a meeting of the Committee of Creditors. Corrupt promoters routinely route unsecured loans through shell companies, offshore trusts, or second-tier holding entities, attempting to pass off promoter-controlled funds as independent third-party debt. The IRP must trace ultimate beneficial ownership (UBO) under Section 2(76) of the Companies Act 2013 and Section 5(24) of the IBC, stripping related parties of voting shares.",
    "The second major defect involves the inflation of operational and financial claims through unconscionable penal interest. Lenders frequently calculate claims using compounded default interest rates exceeding thirty percent per annum, or append ambiguous 'processing charges' not backed by signed credit agreements. Under the Supreme Court's ruling in Swiss Ribbons, the Resolution Professional is not a rubber stamp: they possess full statutory authority to verify claims against primary documentary evidence, bank records, and the terms of underlying contracts. The IRP must recalculate claims using contractual base rates, disallowing arbitrary penal markups.",
    "The third structural defect occurs when operational creditors submit claims based on forged invoices for goods that were never delivered. Promoters and colluding vendors execute sham paper transactions to inflate balance sheet debt prior to insolvency. The IRP's forensic defense team must verify every invoice against electronic toll plaza e-way bills on the National Informatics Centre (NIC) portal, warehouse gate entries, and input tax credit reconciliations under Form GSTR-2B. Where an invoice lacks corresponding transportation e-way bills and warehouse physical acceptance, the claim must be rejected in its entirety.",
    "To resolve this crisis and immunize the CoC from manipulation, the IRP must institute a multi-tier forensic verification protocol: (1) automated NeSL electronic matching; (2) digital GSTN and e-way bill verification; (3) contractual interest benchmarking against signed loan covenants; and (4) UBO corporate tree mapping to detect related parties. When a suspicious claim is detected, the IRP issues a detailed Reasoned Disallowance Order under Regulation 13.",
    "If the aggrieved claimant challenges the disallowance before the NCLT under Section 60(5), the IRP presents the electronic verification trail: missing e-way bills, unsigned covenants, or related-party shareholding registers. The NCLT will dismiss the fraudulent challenge with exemplary costs, safeguarding the integrity of creditor democracy and ensuring that only bona fide commercial debt dictates the corporate debtor's destiny.",
    "Furthermore, the IRP must collaborate with forensic auditors appointed under Section 25(2)(d) to investigate avoidance transactions under Sections 43, 45, 50, and 66 of the Code. Preferential transfers to favored vendors, undervalued property transfers to promoter relatives, and extortionate credit terms are meticulously cataloged for clawback litigation. Reporting these transactions before the NCLT neutralizes promoter leverage and restores stolen capital to the corporate estate.",
    "By establishing rigorous forensic gates and unyielding evidentiary standards during the initial thirty days of claim collation, the IRP preserves enterprise capital, defends legitimate creditor rights, and guarantees that the Committee of Creditors operates on verified, unassailable financial foundations."
]

part5_example = "An offshore holding entity files Form C claiming forty crore rupees as an unsecured financial loan with twenty-four percent interest. Forensic investigation of corporate registries reveals that the offshore entity is wholly owned by the corporate debtor's promoter's brother. Under Section 21(2) first proviso, the IRP admits the debt on the creditor register but completely revokes its voting rights in the Committee of Creditors, preventing the promoter family from hijacking the insolvency process."

part5_code = '''def diagnose_bogus_claim_and_voting_share_crisis(claimed_amount_cr, is_related_party, contractual_base_interest_cr, penal_compounding_claimed_cr, e_way_bills_verified, gst_matching_verified):
    # Step 1: Physical delivery verification for invoice claims
    if not (e_way_bills_verified and gst_matching_verified):
        return {
            "admitted_amount_cr": 0.0,
            "disallowed_amount_cr": claimed_amount_cr,
            "voting_share_permitted": False,
            "finding": "FRAUDULENT_CLAIM_SHAM_DELIVERY",
            "statutory_remedy": "Issue Regulation 13 Disallowance Order and report under Section 65"
        }
        
    # Step 2: Penal interest pruning
    admitted_debt = claimed_amount_cr - penal_compounding_claimed_cr
    disallowed_penal = penal_compounding_claimed_cr
    
    # Step 3: Related party voting disqualification under Section 21(2) proviso
    voting_eligible = not is_related_party
    
    return {
        "admitted_amount_cr": round(admitted_debt, 2),
        "disallowed_amount_cr": round(disallowed_penal, 2),
        "voting_share_permitted": voting_eligible,
        "finding": "RELATED_PARTY_VOTING_DISQUALIFIED" if is_related_party else "BONA_FIDE_CLAIM_ADMITTED",
        "statutory_remedy": "Exclude from CoC voting under Section 21(2)" if is_related_party else "Assign proportional CoC voting share"
    }

# Case: 40 Cr claim from promoter brother's entity; 8 Cr penal interest, valid delivery logs, but related party
diagnosis = diagnose_bogus_claim_and_voting_share_crisis(
    claimed_amount_cr=40.0,
    is_related_party=True,
    contractual_base_interest_cr=32.0,
    penal_compounding_claimed_cr=8.0,
    e_way_bills_verified=True,
    gst_matching_verified=True
)
print("Admitted Debt (Cr):", diagnosis["admitted_amount_cr"])
print("Disallowed Penal Interest (Cr):", diagnosis["disallowed_amount_cr"])
print("CoC Voting Share Permitted:", diagnosis["voting_share_permitted"])
print("Forensic Finding:", diagnosis["finding"])
print("Statutory Remedy:", diagnosis["statutory_remedy"])
'''

part5_check = {
    "question": "Under the first proviso to Section 21(2) of the Insolvency and Bankruptcy Code 2016, what is the statutory status of a financial creditor who is a related party of the corporate debtor?",
    "options": [
        "They shall not have any right of representation, participation, or voting in a meeting of the Committee of Creditors",
        "They are granted fifty percent of standard voting rights subject to approval by the Resolution Professional",
        "They may vote on all ordinary resolutions but cannot vote on Section 28 special resolution matters",
        "They automatically assume the position of CoC Chairman if they hold the largest financial exposure"
    ],
    "answerIndex": 0,
    "why": "The first proviso to Section 21(2) explicitly provides that a financial creditor or its authorized representative who is a related party of the corporate debtor shall not have any right of representation, participation, or voting in a meeting of the Committee of Creditors."
}

# Try-It texts
try_it_texts = [
    "Execute the Section 17 board suspension engine to test administrative transfers and evaluate NCLT Section 19 orders.",
    "Run the Form A public announcement validator to test publication deadlines and verify Regulation 12 claim windows.",
    "Simulate the Section 21 claim collation engine to verify creditor forms and detect unauthorized penal interest.",
    "Execute the Section 20 going concern evaluator to calculate operational cash deficits and test interim finance feasibility.",
    "Run the forensic claim diagnostic engine to detect related party shareholding and enforce Section 21 voting disqualifications."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Insolvency admission orders trigger statutory corporate executive transitions.",
        "say1": "Corporate insolvency triggers immediate statutory executive transitions.",
        "example": "Automobile parts supplier management faces immediate banking suspension.",
        "tryIt": "Administrative transfers test board suspension and evaluate tribunal orders."
    },
    {
        "intro": "Public announcements initiate statutory insolvency claim submission windows.",
        "say1": "Statutory corporate timelines mandate immediate public stakeholder summons.",
        "example": "Equipment manufacturer claims proceed through formal publication notices.",
        "tryIt": "Public announcement validators test publication deadlines and claim windows."
    },
    {
        "intro": "Claim collation frameworks verify creditor filings across statutory categories.",
        "say1": "Creditor claim collation establishes foundational insolvency debt registers.",
        "example": "Commercial bank loan covenants govern forensic claim interest calculations.",
        "tryIt": "Claim collation engines verify creditor forms and detect penal interest."
    },
    {
        "intro": "Going concern mandates preserve enterprise operational value during insolvency.",
        "say1": "Statutory insolvency mandates require enterprise going concern preservation.",
        "example": "Manufacturing plants utilize interim finance for operational stability.",
        "tryIt": "Going concern evaluators calculate cash deficits and test finance feasibility."
    },
    {
        "intro": "Forensic claim investigations detect fraudulent filings and related parties.",
        "say1": "Insolvency practice requires rigorous forensic scrutiny against phantom claims.",
        "example": "Offshore entity loan claims face promoter related party disqualification.",
        "tryIt": "Forensic claim diagnostics detect related parties and enforce disqualifications."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "IRP Appointment", "subtext": "Section 16 fourteen-day mandate"},
        {"id": "s2", "name": "Board Suspension", "subtext": "Section 17 management vesting"},
        {"id": "s3", "name": "Custody of Assets", "subtext": "Section 18 taking control of ledgers and accounts"},
        {"id": "s4", "name": "Statutory Fiduciary", "subtext": "Public servant immunity under Section 233"}
    ],
    [
        {"id": "s1", "name": "Form A Public Notice", "subtext": "Mandatory publication within three days"},
        {"id": "s2", "name": "Dual Newspaper Notice", "subtext": "Regional vernacular and English national"},
        {"id": "s3", "name": "IBBI Electronic Filing", "subtext": "Publication on statutory insolvency website"},
        {"id": "s4", "name": "Fourteen Day Cutoff", "subtext": "Statutory window for initial claim lodgment"}
    ],
    [
        {"id": "s1", "name": "Form B Operational", "subtext": "Invoices bills and statutory authority claims"},
        {"id": "s2", "name": "Form C Financial", "subtext": "Bank loan sanctions and interest schedules"},
        {"id": "s3", "name": "Form CA Class Claims", "subtext": "Real estate homebuyers and authorized representative"},
        {"id": "s4", "name": "Forensic Verification", "subtext": "Validation against debtor ledgers and GST"}
    ],
    [
        {"id": "s1", "name": "Going Concern Mandate", "subtext": "Preserving enterprise operations and employment"},
        {"id": "s2", "name": "Interim Finance", "subtext": "Priority repayment status under Section 5(13)"},
        {"id": "s3", "name": "Vendor Continuity", "subtext": "Protecting raw material supply and utilities"},
        {"id": "s4", "name": "Process Cost Governance", "subtext": "Committee approval for insolvency expenses"}
    ],
    [
        {"id": "s1", "name": "Bogus Claim Detection", "subtext": "Forged contracts and fabricated interest claims"},
        {"id": "s2", "name": "Forensic Accounting", "subtext": "Bank statement reconciliation and GST matching"},
        {"id": "s3", "name": "Disallowance Orders", "subtext": "Rejection of unverified and fraudulent filings"},
        {"id": "s4", "name": "Related Party Disqualification", "subtext": "Section 21 voting exclusions"}
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
    print(f"Day 37 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 37 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 37 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day37_lesson.json
with open("scripts/day37_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day37_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 37 is already present
if f'"day": {day_num},' in ts_content or f'day: {day_num},' in ts_content:
    print(f"Day {day_num} already exists in {ts_path}! Skipping append.")
else:
    # Find closing array bracket
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

# 3. Build day-37.json visual file
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
    "day": 37,
    "promptSha": "prompt_sha_bcom_law_day37_irp_claims_collation_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-37.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
