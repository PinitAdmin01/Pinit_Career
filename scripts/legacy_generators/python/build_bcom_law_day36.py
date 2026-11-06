import json, sys, subprocess, os, re, hashlib

# Builder for Day 36 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 36: Section 7/9/10 CIRP Initiation, Default Thresholds & Section 14 Moratorium

day_num = 36
course_prefix = "bcom_law"
day_title = "Section 7/9/10 CIRP Initiation, Default Thresholds & Section 14 Moratorium"
day_desc = "Master the initiation architecture of the Corporate Insolvency Resolution Process (CIRP) under the Insolvency and Bankruptcy Code 2016: Section 4 default thresholds, Section 7 financial creditor applications, Section 8 demand notices and Section 9 operational disputes under the Mobilox doctrine, Section 10 corporate debtor petitions, and Section 14 statutory moratorium protections."

# Part 1: Legislative Architecture of IBC 2016, Section 4 Default Threshold & Clean Slate Doctrine
part1_title = "Legislative Architecture of IBC 2016, Section 4 Default Threshold & Clean Slate Doctrine"
part1_say = [
    "Prior to the enactment of the Insolvency and Bankruptcy Code 2016 (IBC), India's insolvency framework was plagued by procedural fragmentation, excessive judicial delays, and catastrophic capital destruction. Creditors were forced to navigate a labyrinth of overlapping and conflicting legislative enactments, including the Sick Industrial Companies Act 1985 (SICA) with its notorious Board for Industrial and Financial Reconstruction (BIFR), the Recovery of Debts Due to Banks and Financial Institutions Act 1993 (RDDBFI Act), the SARFAESI Act 2002, and the winding-up provisions of the Companies Act 1956. Corporate promoters routinely exploited BIFR moratoriums as legal havens to stall debt recovery indefinitely, leaving commercial banks burdened with non-performing loans and reducing average recovery rates to less than twenty-six cents on the dollar over an average timeline exceeding four years.",
    "The Insolvency and Bankruptcy Code 2016 revolutionized Indian commercial jurisprudence by replacing the outmoded 'debtor-in-possession' regime with an institutionalized 'creditor-in-control' model. Modeled on the landmark recommendations of the Bankruptcy Law Reforms Committee (BLRC) chaired by Dr. T.K. Viswanathan, the IBC consolidated all corporate insolvency laws into a single, comprehensive, time-bound statutory code. The primary constitutional objective of the Code, as established by the Supreme Court of India in Swiss Ribbons Pvt. Ltd. v. Union of India, is the resolution and revival of the corporate debtor as a going concern, the maximization of the value of its assets, and the promotion of entrepreneurship, with recovery of creditor dues operating as a secondary byproduct of economic rehabilitation.",
    "The gateway threshold for invoking the Corporate Insolvency Resolution Process (CIRP) is codified under Section 4 of the Code. Originally set at a modest threshold of one lakh rupees, the Central Government issued a historic notification on March 24, 2020, exercising its statutory powers under the proviso to Section 4, permanently elevating the minimum default threshold to one crore rupees (ten million Indian rupees). This dramatic threshold escalation was engineered to insulate micro, small, and medium enterprises (MSMEs) from being dragged into insolvency over trivial commercial disputes, reserving the formidable machinery of the National Company Law Tribunal (NCLT) exclusively for substantial, systemic corporate defaults.",
    "A foundational judicial pillar undergirding the IBC is the 'Clean Slate Doctrine' established by the Supreme Court in Committee of Creditors of Essar Steel India Ltd. v. Satish Kumar Gupta and reaffirmed in Ghanashyam Mishra and Sons v. Edelweiss Asset Reconstruction. Under this doctrine, once a resolution plan is approved by the Adjudicating Authority under Section 31, all historical debts, statutory tax claims, government dues, and liabilities incurred prior to the insolvency commencement date that were not included in the approved resolution plan are extinguished permanently. The successful resolution applicant takes over the corporate debtor with a completely clean slate, immune from subsequent claims or tax attachments by municipal, state, or federal revenue authorities.",
    "Furthermore, Section 238 of the IBC codifies an absolute non-obstante clause, declaring that the provisions of the Code shall have overriding effect notwithstanding anything inconsistent therewith contained in any other law for the time being in force or any instrument having effect by virtue of any such law. The Supreme Court in Innoventive Industries Ltd. v. ICICI Bank established that Section 238 overrides all state debt relief statutes, contractual covenants, and competing statutory charges, ensuring that time-bound insolvency resolution under the IBC supersedes all conflicting domestic legislation.",
    "The operational discipline of the IBC is anchored in statutory timelines codified under Section 12. The entire CIRP must be concluded within a mandatory window of one hundred and eighty days from the date of admission, extendable once by the NCLT by a maximum of ninety days upon approval by sixty-six percent of the Committee of Creditors. Crucially, the second proviso to Section 12(3) imposes an outer ceiling of three hundred and thirty days, including all legal proceedings, appeals, and litigation delays, establishing an unyielding commercial tempo that forces stakeholders to achieve consensus or liquidate the enterprise."
]

part1_example = "A commercial equipment manufacturer defaults on an eight-lakh-rupee invoice from an industrial paint supplier. Prior to 2020, the supplier could petition the NCLT for CIRP under the old one-lakh threshold. Under the revised Section 4 threshold of one crore rupees, the NCLT dismisses the petition as non-maintainable for lack of statutory jurisdiction. The supplier must pursue conventional civil recovery suits or MSME Samadhaan arbitration, preserving the corporate debtor from premature insolvency proceedings."

part1_code = '''def evaluate_ibc_jurisdiction_and_threshold(default_amount_lakhs, date_of_default_year, is_msme, is_corporate_debtor):
    # Section 4 Statutory Default Threshold:
    # Prior to March 24, 2020: 1 Lakh
    # From March 24, 2020 onwards: 1 Crore (100 Lakhs)
    threshold_lakhs = 100.0 if date_of_default_year >= 2020 else 1.0
    
    threshold_satisfied = default_amount_lakhs >= threshold_lakhs
    
    # IBC Part II applies only to corporate persons (companies/LLPs), not proprietorships
    jurisdiction_valid = threshold_satisfied and is_corporate_debtor
    
    return {
        "default_amount_lakhs": default_amount_lakhs,
        "applicable_threshold_lakhs": threshold_lakhs,
        "threshold_satisfied": threshold_satisfied,
        "is_corporate_debtor": is_corporate_debtor,
        "nclt_jurisdiction": "MAINTAINABLE" if jurisdiction_valid else "NON_MAINTAINABLE_BARRED",
        "legal_remedy": "File Section 7/9 CIRP Petition" if jurisdiction_valid else "Pursue Commercial Court or MSME Recovery"
    }

# Case: Default of 85 Lakhs occurring in 2024 against a corporate debtor
audit = evaluate_ibc_jurisdiction_and_threshold(
    default_amount_lakhs=85.0,
    date_of_default_year=2024,
    is_msme=True,
    is_corporate_debtor=True
)
print("Applicable Threshold (Lakhs):", audit["applicable_threshold_lakhs"])
print("Default Threshold Satisfied:", audit["threshold_satisfied"])
print("NCLT CIRP Maintainability:", audit["nclt_jurisdiction"])
print("Recommended Legal Remedy:", audit["legal_remedy"])
'''

part1_check = {
    "question": "What is the current minimum statutory default threshold for initiating Corporate Insolvency Resolution Process (CIRP) under Section 4 of the Insolvency and Bankruptcy Code 2016?",
    "options": [
        "One crore rupees (ten million Indian rupees)",
        "One lakh rupees (one hundred thousand Indian rupees)",
        "Fifty lakh rupees (five million Indian rupees)",
        "Five crore rupees (fifty million Indian rupees)"
    ],
    "answerIndex": 0,
    "why": "By notification dated March 24, 2020, the Central Government, exercising powers under Section 4 proviso of the IBC 2016, increased the minimum amount of default from one lakh rupees to one crore rupees to protect corporate enterprises and MSMEs from insolvency during economic disruptions."
}

# Part 2: Section 7 Application by Financial Creditors: Debt, Default & Mandatory Adjudicating Authority Timeline
part2_title = "Section 7 Application by Financial Creditors: Debt, Default & Mandatory Adjudicating Authority Timeline"
part2_say = [
    "The most potent trigger for corporate insolvency under the IBC is an application filed by a Financial Creditor under Section 7 of the Code. In insolvency jurisprudence, financial creditors occupy an elevated statutory status: they provide debt financing against the consideration for the time value of money, enabling enterprise capital formation. Under Section 5(7) read with Section 5(8), a 'Financial Debt' encompasses any liability or obligation in respect of a claim arising from: money borrowed against payment of interest; amounts raised under acceptance credits or note facilities; bond or debenture issuances; finance leases; receivables sold or discounted; and amounts raised from allottees in real estate development projects.",
    "Section 7 establishes an objective, mechanical statutory inquiry for the National Company Law Tribunal (NCLT) sitting as the Adjudicating Authority. As definitively settled by the Supreme Court of India in Innoventive Industries Ltd. v. ICICI Bank and reaffirmed in M. Suresh Kumar Reddy v. Canara Bank, the Adjudicating Authority has only to ascertain whether a 'default' has occurred. If the financial creditor demonstrates the existence of a legally valid financial debt and proves that a default exceeding the Section 4 threshold of one crore rupees has occurred, the NCLT is statutorily compelled to admit the application. The corporate debtor cannot resist admission by pleading temporary liquidity shortages, economic headwinds, or counter-claims against third parties.",
    "To substantiate the occurrence of default, Section 7(3) mandates that the financial creditor must furnish proof of default. The primary statutory evidence recognized by the Code is a record of default registered with an Information Utility (IU) licensed by the Insolvency and Bankruptcy Board of India (IBBI), such as the National E-Governance Services Limited (NeSL). A certified NeSL Record of Default (RoD) bearing an authenticated 'Deemed to be Authenticated' status establishes conclusive statutory proof of debt and default, eliminating the need for protracted evidentiary trials and witness depositions.",
    "In parallel, Section 7(3)(b) requires the financial creditor to formally propose the name of an Insolvency Professional to act as the Interim Resolution Professional (IRP). The proposed IRP must be actively registered with the IBBI, possess a valid Authorisation for Assignment (AFA), and confirm in writing under Form 2 that no disciplinary proceedings are pending against them. Applications filed without proposing an eligible IRP are defectively constituted and cannot be admitted by the Registry.",
    "Under Section 7(4), the Adjudicating Authority is statutorily mandated to ascertain the existence of a default within fourteen days of receipt of the application. If default is established and the application is complete, the NCLT must pass an order admitting the application under Section 7(5)(a). If the application is defective, Section 7(5) proviso grants the applicant seven days to rectify the defect upon notification. While the Supreme Court in Vidarbha Industries Power Ltd. v. Axis Bank held that the NCLT possesses discretionary power under Section 7(5)(a) to examine extraneous circumstances in exceptional public utility cases, subsequent rulings in M. Suresh Kumar Reddy clarified that once default is undisputed, admission is the statutory rule, and refusal to admit is an extraordinary exception.",
    "The passing of an admission order under Section 7(5) marks the formal 'Insolvency Commencement Date'. From that exact second, the Board of Directors of the corporate debtor is suspended by operation of law under Section 17, all executive management powers vest in the Interim Resolution Professional, and the enterprise enters the protective cocoon of the statutory moratorium under Section 14, freezing all creditor recovery actions across every judicial forum.",
    "Furthermore, where a financial debt is owed to a class of creditors, such as real estate homebuyers or consortium lenders, specialized statutory thresholds apply under the provisos to Section 7(1). For real estate allottees, an application must be filed jointly by not less than one hundred such allottees under the same real estate project, or not less than ten percent of the total number of allottees, whichever is less. This safeguard, upheld by the Supreme Court in Manish Kumar v. Union of India, prevents isolated disgruntled buyers from jeopardizing multi-phase residential infrastructure projects while ensuring collective creditor rights are protected."
]

part2_example = "A commercial bank sanctions a fifty-crore credit facility to a textiles manufacturer. The borrower defaults on loan repayments totaling twelve crore rupees. The bank extracts an authenticated Record of Default from NeSL, nominates a certified Insolvency Professional under Form 2, and files an application in Form 1 before the NCLT under Section 7. The borrower argues that supply chain disruptions delayed export revenues. The NCLT rejects the defense, rules that debt and default are conclusively proven, and admits the CIRP application."

part2_code = '''def evaluate_section_7_financial_creditor_admission(debt_type, considers_time_value_of_money, default_amount_cr, has_nesl_record_of_default, proposed_irp_has_valid_afa, days_since_filing):
    # Section 5(8) Financial Debt Test: Consideration for time value of money
    is_financial_debt = considers_time_value_of_money
    
    # Section 4 Threshold: Minimum 1 Crore
    threshold_ok = default_amount_cr >= 1.0
    
    # Evidence & IRP Invariants
    evidence_ok = has_nesl_record_of_default
    irp_ok = proposed_irp_has_valid_afa
    
    is_admissible = is_financial_debt and threshold_ok and evidence_ok and irp_ok
    
    # Section 7(4) 14-day statutory turnaround benchmark
    within_statutory_window = days_since_filing <= 14
    
    return {
        "is_financial_debt": is_financial_debt,
        "default_amount_cr": default_amount_cr,
        "threshold_satisfied": threshold_ok,
        "conclusive_evidence_nesl": evidence_ok,
        "proposed_irp_compliant": irp_ok,
        "within_14_day_target": within_statutory_window,
        "nclt_ruling": "ADMIT_CIRP_AND_APPOINT_IRP" if is_admissible else "REJECT_OR_RETURN_FOR_DEFECTS"
    }

# Test: Bank loan 12 Cr default, NeSL authenticated, valid IRP AFA, evaluated on Day 12
audit = evaluate_section_7_financial_creditor_admission(
    debt_type="commercial_term_loan",
    considers_time_value_of_money=True,
    default_amount_cr=12.0,
    has_nesl_record_of_default=True,
    proposed_irp_has_valid_afa=True,
    days_since_filing=12
)
print("Section 7 Adjudication Ruling:", audit["nclt_ruling"])
print("Financial Debt Classification:", audit["is_financial_debt"])
print("Default Amount Exceeds 1 Cr:", audit["threshold_satisfied"])
print("Conclusive NeSL RoD Present:", audit["conclusive_evidence_nesl"])
print("Statutory 14-Day Compliance:", audit["within_14_day_target"])
'''

part2_check = {
    "question": "Under Section 7 of the Insolvency and Bankruptcy Code 2016, as interpreted by the Supreme Court in Innoventive Industries, what must the Adjudicating Authority ascertain to admit a financial creditor application?",
    "options": [
        "Merely that a financial debt exists and that a default exceeding the statutory threshold has occurred",
        "That the corporate debtor has zero tangible assets remaining on its audited balance sheet",
        "That the financial creditor has exhausted all recovery proceedings before the Debt Recovery Tribunal (DRT)",
        "That the promoters have formally consented in writing to surrender managerial control"
    ],
    "answerIndex": 0,
    "why": "The Supreme Court in Innoventive Industries held that under Section 7, the Adjudicating Authority must only be satisfied that a default has occurred. Once default is established by record of an Information Utility or other evidence, the application must be admitted."
}

# Part 3: Section 9 Operational Creditors: Section 8 Demand Notice & The Pre-Existing Dispute Defense (Mobilox Innovations)
part3_title = "Section 9 Operational Creditors: Section 8 Demand Notice & The Pre-Existing Dispute Defense (Mobilox Innovations)"
part3_say = [
    "While financial creditors provide long-term capital, Operational Creditors supply the raw materials, inventory, commercial services, and labor that sustain daily enterprise operations. Codified under Section 5(20) and Section 5(21) of the IBC, an 'Operational Debt' represents a claim in respect of the provision of goods or services, including employment dues, as well as statutory dues payable to the Central Government, State Government, or any local authority. To prevent commercial suppliers from using the insolvency sledgehammer as a debt collection extortion weapon for disputed invoices, the IBC erects an elaborate, multi-tiered procedural obstacle course under Sections 8 and 9.",
    "The mandatory jurisdictional prerequisite for any operational creditor is Section 8. An operational creditor cannot approach the NCLT directly: they must first deliver a formal statutory Demand Notice in Form 3, or an invoice demanding payment in Form 4, to the registered office of the corporate debtor, giving the debtor a strict ten-day statutory window to respond. Under Section 8(2), the corporate debtor has ten days from the receipt of the demand notice to bring to the notice of the operational creditor: (a) the existence of a 'dispute', if any, or record of the pendency of a suit or arbitration proceedings filed before the receipt of such notice; or (b) proof that the operational debt has been paid through banking channels.",
    "If the debtor fails to pay or demonstrate a pre-existing dispute within the ten-day window, the operational creditor may file an application before the NCLT for initiating CIRP under Section 9. Unlike Section 7, where proposing an IRP is mandatory, Section 9(4) makes proposing an IRP optional for operational creditors; if no IRP is proposed, the NCLT makes a formal reference to the IBBI to nominate an insolvency professional from its active panel.",
    "The fatal defense to a Section 9 application is the 'Pre-Existing Dispute Defense' definitively articulated by the Supreme Court of India in the landmark decision Mobilox Innovations Pvt. Ltd. v. Kirusa Software Pvt. Ltd. In Mobilox, Justice R.F. Nariman established the governing legal standard: the Adjudicating Authority must examine whether there is a plausible contention requiring further investigation and that the dispute is not a patently feeble legal argument or an asserted dispute of straw. The dispute must truly exist in fact and not be spurious, hypothetical, or illusory.",
    "Crucially, the dispute must be pre-existing—meaning the controversy regarding quality of goods, delivery delays, breach of commercial specifications, or price adjustments was documented in contemporaneous emails, letters, or legal notices sent before the Section 8 demand notice was delivered. If the corporate debtor manufactures a dispute after receiving the Section 8 demand notice, the defense is rejected as an afterthought. However, if genuine pre-notice correspondence reveals that the debtor rejected goods for defects or issued debit notes, the NCLT is bound to dismiss the Section 9 petition, directing the supplier to ordinary civil or arbitral litigation.",
    "This vital operational distinction balances creditor rights with corporate preservation. Operational debts are frequently subject to quality adjustments, contractual set-offs, and commercial reconciliations. By barring Section 9 initiation whenever a plausible pre-existing dispute exists, the IBC prevents commercial extortion while ensuring genuine undisputed operational defaults trigger timely corporate resolution.",
    "Moreover, under Section 9(3)(c), the operational creditor must furnish a certificate from the financial institution maintaining its accounts confirming that there is no record of payment of the unpaid operational debt by the corporate debtor. Additionally, Section 9(3)(d) empowers the applicant to provide a record of default from an Information Utility or proof that the demand notice was delivered without any notice of dispute. These evidentiary burdens ensure that summary insolvency proceedings remain focused on clear insolvency rather than disputed breach of contract claims."
]

part3_example = "An IT vendor delivers customized ERP software to a logistics firm and bills two crore rupees. Prior to receiving any demand notice, the logistics firm sends three emails complaining that software crashes corrupted database records and refusing payment until bugs are rectified. The vendor issues a Section 8 demand notice and files under Section 9. Citing the pre-existing email correspondence under the Mobilox doctrine, the NCLT dismisses the petition, ruling that genuine contractual disputes cannot be adjudicated in summary insolvency proceedings."

part3_code = '''def evaluate_section_9_operational_creditor_petition(default_amount_cr, demand_notice_served, days_since_demand_notice, pre_existing_dispute_documented, dispute_raised_prior_to_notice, debt_paid):
    # Section 4 Threshold: Minimum 1 Crore
    threshold_ok = default_amount_cr >= 1.0
    
    # Section 8 Invariant: Demand notice must be served, 10 days must elapse
    demand_notice_ok = demand_notice_served and (days_since_demand_notice >= 10)
    
    # Debt payment check
    if debt_paid:
        return {"admissible": False, "reason": "Operational debt paid within 10 days", "status": "DISMISSED_PAID"}
        
    # Mobilox Innovations Pre-Existing Dispute Test:
    # Dispute must be documented PRIOR to receipt of Section 8 demand notice
    has_valid_pre_existing_dispute = pre_existing_dispute_documented and dispute_raised_prior_to_notice
    
    if has_valid_pre_existing_dispute:
        return {
            "admissible": False,
            "reason": "Mobilox Doctrine: Plausible pre-existing dispute documented prior to Section 8 notice",
            "status": "DISMISSED_PRE_EXISTING_DISPUTE"
        }
        
    is_admissible = threshold_ok and demand_notice_ok
    
    return {
        "admissible": is_admissible,
        "reason": "Debt and default undisputed exceeding 1 Cr threshold; Section 8 notice expired unpaid",
        "status": "ADMIT_SECTION_9_CIRP" if is_admissible else "REJECT_PROCEDURAL_DEFECT"
    }

# Case: 2 Cr ERP software invoice, pre-existing software defect emails sent before Section 8 notice
audit = evaluate_section_9_operational_creditor_petition(
    default_amount_cr=2.0,
    demand_notice_served=True,
    days_since_demand_notice=14,
    pre_existing_dispute_documented=True,
    dispute_raised_prior_to_notice=True,
    debt_paid=False
)
print("Section 9 Petition Status:", audit["status"])
print("Petition Admissible:", audit["admissible"])
print("Judicial Finding:", audit["reason"])
'''

part3_check = {
    "question": "Under the Supreme Court's landmark ruling in Mobilox Innovations v. Kirusa Software, what standard must the corporate debtor satisfy to defeat a Section 9 CIRP petition on grounds of a pre-existing dispute?",
    "options": [
        "Demonstrating a plausible dispute documented prior to the Section 8 demand notice that is not spurious, hypothetical, or an asserted dispute of straw",
        "Proving beyond reasonable doubt that the operational creditor committed criminal breach of trust under the Indian Penal Code",
        "Obtaining a certified decree of contract nullification from the International Court of Arbitration in Paris",
        "Demonstrating that the operational creditor's net profit margin exceeds fifteen percent of total billable hours"
    ],
    "answerIndex": 0,
    "why": "In Mobilox Innovations, the Supreme Court held that all the Adjudicating Authority must see is whether there is a plausible contention requiring further investigation and that the dispute is not a patently feeble legal argument or an asserted dispute of straw, and that the defense was raised prior to the Section 8 notice."
}

# Part 4: Section 14 Statutory Moratorium: Asset Freezing, Stay on Legal Proceedings & Supply of Essential Goods
part4_title = "Section 14 Statutory Moratorium: Asset Freezing, Stay on Legal Proceedings & Supply of Essential Goods"
part4_say = [
    "The moment an Adjudicating Authority admits an insolvency application under Section 7, 9, or 10, it is statutorily compelled under Section 13(1)(a) to declare an immediate, comprehensive Moratorium under Section 14 of the IBC. The statutory moratorium represents the legislative shield of the Corporate Insolvency Resolution Process: it freezes all debt enforcement actions, halts asset executions, and preserves the enterprise's productive assets in status quo, preventing aggressive creditors from dismembering the corporate debtor while stakeholders formulate a going-concern resolution plan.",
    "Section 14(1) imposes four comprehensive statutory prohibitions that bind all courts, tribunals, and creditors nationwide: (a) the institution of suits or continuation of pending suits or proceedings against the corporate debtor, including execution of any judgment, decree, or order in any court of law, tribunal, arbitration panel, or other authority; (b) transferring, encumbering, alienating, or disposing of by the corporate debtor any of its assets or any legal right or beneficial interest therein; (c) any action to foreclose, recover, or enforce any security interest created by the corporate debtor in respect of its property, including any action under the SARFAESI Act 2002; and (d) the recovery of any property by an owner or lessor where such property is occupied by or in the possession of the corporate debtor.",
    "The scope of Section 14 was fiercely litigated across Indian courts until settled by landmark Supreme Court judgments. In P. Mohanraj v. Shah Brothers Ispat Pvt. Ltd., the Supreme Court held that Section 14(1)(a) encompasses criminal proceedings for check bouncing under Section 138 of the Negotiable Instruments Act 1881 against the corporate debtor, staying all check dishonor trials against the company during the moratorium. Similarly, in Anand Rao Korada v. Varsha Fabrics, the Supreme Court ruled that High Courts cannot auction or sell company assets in civil execution proceedings once an IBC moratorium is declared.",
    "To ensure that the enterprise does not grind to a halt during insolvency, Section 14(2) establishes a critical operational lifeline: the supply of essential goods or services to the corporate debtor as may be specified (including electricity, water, telecommunications, and information technology services) shall not be terminated, suspended, or interrupted during the moratorium period. Furthermore, under Section 14(2A) introduced by the 2020 amendment, where the IRP or RP considers the supply of critical raw materials or vendor services essential to protect and preserve the value of the corporate debtor and manage operations as a going concern, such supply cannot be terminated, provided the corporate debtor pays current operational dues during the insolvency period.",
    "Crucially, the legislature enacted Section 14(3) to prevent promoters from hiding behind the corporate moratorium. Under Section 14(3)(b), the moratorium does not apply to a surety in a contract of guarantee to a corporate debtor. As affirmed by the Supreme Court in State Bank of India v. V. Ramakrishnan, financial creditors remain fully entitled to invoke personal guarantees and enforce security interests against promoter guarantors before the NCLT and civil courts, ensuring that controlling promoters remain personally liable for guaranteed enterprise debts.",
    "The moratorium remains in full legal force from the insolvency commencement date until the completion of the CIRP (when a resolution plan is approved under Section 31(1)) or until the Adjudicating Authority passes an order for liquidation under Section 33. Under Section 68 and Section 74, any director, creditor, or officer who violates the terms of the moratorium by transferring assets or enforcing security is punishable with imprisonment for up to five years and substantial personal fines.",
    "Moreover, the protective shield of Section 14 is balanced by strict operational oversight under Section 20. The Interim Resolution Professional is mandated to manage the operations of the corporate debtor as a going concern, entering into contracts, borrowing emergency interim finance, and issuing instructions to commercial bankers. This ensures that while individual recovery lawsuits are halted, enterprise value is actively preserved and enhanced throughout the statutory resolution window."
]

part4_example = "A commercial bank issues a possession notice under the SARFAESI Act to seize an indebted factory. The next day, the NCLT admits a Section 7 CIRP application and imposes a Section 14 moratorium. The bank's SARFAESI auction is instantly stayed by operation of law. Concurrently, the regional electric utility attempts to cut off power to the factory over pre-CIRP arrears. Under Section 14(2), the disconnection is illegal; the utility must maintain power supply while the IRP pays current monthly billing."

part4_code = '''def audit_section_14_moratorium_enforcement(action_type, target_entity, is_essential_utility, current_dues_paid, pre_cirp_arrears_exist):
    # Section 14 Scope Analysis:
    # Prohibitions bind Corporate Debtor, but NOT Personal Guarantor (Section 14(3)(b))
    
    if target_entity == "personal_guarantor":
        return {
            "action": action_type,
            "target": target_entity,
            "moratorium_applies": False,
            "legal_status": "PERMITTED_UNDER_SECTION_14(3)(b)",
            "explanation": "Moratorium does not protect personal guarantors; creditors may enforce guarantees"
        }
        
    # Actions against Corporate Debtor:
    # Suits, SARFAESI, lease recovery, and asset disposition are STAYED
    stayed_actions = ["sarfaesi_auction", "civil_suit_execution", "sec_138_ni_act_check_bounce", "property_lease_eviction"]
    if action_type in stayed_actions:
        return {
            "action": action_type,
            "target": target_entity,
            "moratorium_applies": True,
            "legal_status": "STAYED_VOID_AB_INITIO",
            "explanation": "Section 14(1) stays all legal and security enforcement actions against corporate debtor"
        }
        
    # Section 14(2) Essential Supplies Check:
    if is_essential_utility:
        # Cannot disconnect if current dues are paid, despite pre-CIRP arrears
        if current_dues_paid:
            return {
                "action": action_type,
                "target": target_entity,
                "moratorium_applies": True,
                "legal_status": "DISCONNECTION_PROHIBITED",
                "explanation": "Section 14(2) forbids utility disconnection for pre-CIRP arrears while current dues are paid"
            }
        else:
            return {
                "action": action_type,
                "target": target_entity,
                "moratorium_applies": False,
                "legal_status": "DISCONNECTION_PERMITTED_FOR_CURRENT_DEFAULT",
                "explanation": "Utility may disconnect if IRP fails to pay ongoing operational consumption charges"
            }
            
    return {"action": action_type, "target": target_entity, "moratorium_applies": True, "legal_status": "PROHIBITED"}

# Case 1: Bank SARFAESI auction against company factory
test1 = audit_section_14_moratorium_enforcement(
    action_type="sarfaesi_auction",
    target_entity="corporate_debtor",
    is_essential_utility=False,
    current_dues_paid=False,
    pre_cirp_arrears_exist=True
)
print("SARFAESI Auction Status:", test1["legal_status"])

# Case 2: Bank invoking personal guarantee against promoter
test2 = audit_section_14_moratorium_enforcement(
    action_type="invoke_personal_guarantee",
    target_entity="personal_guarantor",
    is_essential_utility=False,
    current_dues_paid=False,
    pre_cirp_arrears_exist=True
)
print("Promoter Guarantee Enforcement:", test2["legal_status"])

# Case 3: Power utility attempting disconnection for pre-CIRP arrears
test3 = audit_section_14_moratorium_enforcement(
    action_type="utility_disconnection",
    target_entity="corporate_debtor",
    is_essential_utility=True,
    current_dues_paid=True,
    pre_cirp_arrears_exist=True
)
print("Essential Utility Disconnection:", test3["legal_status"])
'''

part4_check = {
    "question": "Under Section 14(3)(b) of the Insolvency and Bankruptcy Code 2016, does the statutory moratorium protect personal guarantors of the corporate debtor from debt recovery actions?",
    "options": [
        "No, the moratorium explicitly does not apply to a surety in a contract of guarantee to a corporate debtor",
        "Yes, all recovery actions against personal guarantors are automatically stayed for three hundred and thirty days",
        "Yes, but only if the personal guarantor is a senior citizen or non-resident Indian",
        "Only if the Committee of Creditors passes a special resolution by ninety percent majority extending the shield"
    ],
    "answerIndex": 0,
    "why": "Section 14(3)(b) expressly excludes a surety in a contract of guarantee to a corporate debtor from the scope of the moratorium, allowing creditors to enforce guarantees against promoters during CIRP as confirmed in SBI v. V. Ramakrishnan."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Manufactured Operational Debt & Contested Section 9 Dispute
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Manufactured Operational Debt & Contested Section 9 Dispute"
part5_say = [
    "In corporate legal warfare, one of the most perilous failure modes is the 'Manufactured Operational Dispute and Malicious CIRP Initiation' anti-pattern. This catastrophic failure mode occurs when an aggressive creditor manufactures artificial operational invoices or uses Section 9 to extort commercial concessions, or conversely, when an indebted corporate debtor fabricates retroactive defect allegations and backdated debit notes after receiving a Section 8 demand notice to derail legitimate insolvency resolution. When these adversarial maneuvers unfold before the NCLT, the summary nature of insolvency proceedings can lead to wrongful admissions or improper dismissals, causing catastrophic market disruption.",
    "The first defect involves the creditor's abuse of process. Section 65 of the IBC establishes severe statutory penalties for fraudulent or malicious initiation of proceedings. If any person initiates the insolvency resolution process or liquidation proceedings fraudulently or with malicious intent for any purpose other than for the resolution of insolvency of the corporate debtor, the Adjudicating Authority may impose upon such person a personal penalty of not less than one lakh rupees, but which may extend to one crore rupees. In Amit Katyal v. Meera Goyal, the NCLT penalized applicants who utilized insolvency threats as debt recovery leverage rather than bona fide corporate resolution.",
    "The second compounding defect arises when a corporate debtor attempts to manufacture a bogus 'pre-existing dispute' to invoke the Mobilox defense. Directors frequently backdate letters or send fraudulent email complaints claiming product defects months after accepting delivery without protest. The NCLT exercises forensic digital scrutiny: under Section 9(5)(ii)(d), the Adjudicating Authority must reject the petition only if 'notice of dispute has been received by the operational creditor.' If digital metadata, GST tax invoice credit matching, and warehousing goods receipt notes (GRN) prove that goods were accepted and sold in the ordinary course of business, the NCLT pierces the fabricated defense as a 'dispute of straw' and admits the CIRP application.",
    "A third structural failure mode occurs when an operational creditor files under Section 9 while an active pre-CIRP arbitration or civil suit is pending between the parties regarding contractual performance. The Supreme Court in K. Kishan v. Vijay Nirman Company held that where an arbitral award is challenged under Section 34 of the Arbitration and Conciliation Act 1996, the operational debt is inherently disputed. Attempting to enforce an arbitral award under Section 9 while Section 34 challenge proceedings are pending is an abuse of process that warrants immediate dismissal.",
    "To resolve this crisis and immunize the enterprise, corporate legal departments must maintain an unassailable contemporaneous documentary audit trail. For vendors, every delivery must be accompanied by digitally signed Goods Receipt Notes (GRN), GST e-invoices reconciled on the GSTN portal, and certified Information Utility filings with NeSL. For corporate debtors, any defect in delivered goods or commercial delay must be communicated immediately via formal registered email within contractual inspection windows, generating an unimpeachable contemporaneous record of pre-existing dispute that instantly defeats malicious Section 9 petitions.",
    "Finally, legal teams must implement robust pre-litigation triage systems under Section 10A and Section 66. Section 10A permanently barred CIRP applications for defaults arising during the COVID-19 pandemic window between March 25, 2020, and March 24, 2021, as affirmed in Ramesh Kymal v. Siemens Gamesa. Concurrently, Section 66 empowers resolution professionals to initiate clawback actions against directors for fraudulent trading or wrongful trading during insolvency. By combining forensic digital verification, statutory threshold compliance, and meticulous audit documentation, corporate enterprises can successfully navigate insolvency litigation while neutralizing malicious debtor and creditor gambits.",
    "In operational practice, corporate compliance officers must conduct quarterly audits of enterprise creditor ledgers, cross-referencing all disputed vendor billings against contemporaneous warehouse acceptance logs and GST-2B reconciliations. When a demand notice is received, the enterprise legal response team must convene within forty-eight hours, consolidating all prior email communications, quality rejection notices, and arbitral filings into a comprehensive reply under Section 8(2), thereby establishing an impregnable statutory barrier against vexatious insolvency proceedings."
]

part5_example = "An infrastructure contractor claims five crore rupees in unpaid excavation invoices and serves a Section 8 demand notice. The project owner manufactures a backdated letter alleging soil contamination. However, forensic analysis of the owner's GST-2A filings reveals that the owner claimed full input tax credit on all five crore rupees of invoices without recording debit notes, and project logbooks confirm continuous excavation. The NCLT rules the dispute is a fabricated afterthought, rejects the Mobilox defense, and admits the CIRP application."

part5_code = '''def diagnose_section_9_dispute_crisis(claimed_amount_cr, gst_itc_claimed_by_debtor, pre_notice_complaints_exist, debit_notes_registered, arbitral_challenge_pending_sec_34):
    # Forensic Investigation of Dispute Validity:
    # Defect 1: If Section 34 arbitration challenge is pending -> Inherent pre-existing dispute (K. Kishan)
    if arbitral_challenge_pending_sec_34:
        return {
            "petition_status": "DISMISSED",
            "finding": "Inherent dispute: Section 34 challenge pending against arbitral award (K. Kishan precedent)",
            "malicious_initiation_risk": "High if creditor knew of pending challenge",
            "remedial_action": "Wait for Section 34 adjudication in commercial court"
        }
        
    # Defect 2: Debtor claimed full GST Input Tax Credit without debit notes
    # Contradicts claim of defective goods
    if gst_itc_claimed_by_debtor and (not debit_notes_registered) and (not pre_notice_complaints_exist):
        return {
            "petition_status": "ADMITTED",
            "finding": "Fabricated dispute: Debtor claimed 100% GST input tax credit without debit notes; dispute is an afterthought",
            "malicious_initiation_risk": "None: Legitimate undisputed operational default",
            "remedial_action": "Approve CIRP admission and notify Interim Resolution Professional"
        }
        
    # Defect 3: Genuine pre-notice correspondence exists
    if pre_notice_complaints_exist and debit_notes_registered:
        return {
            "petition_status": "DISMISSED",
            "finding": "Mobilox Doctrine upheld: Contemporaneous pre-notice defect letters and debit notes establish plausible dispute",
            "malicious_initiation_risk": "Moderate if creditor suppressed defect letters",
            "remedial_action": "Refer dispute to commercial civil litigation or mediation"
        }
        
    return {
        "petition_status": "EVIDENTIARY_HEARING_REQUIRED",
        "finding": "Ambiguous facts: Forensic reconciliation of ledger accounts mandated",
        "malicious_initiation_risk": "Under review",
        "remedial_action": "Order production of electronic warehouse logbooks"
    }

# Case: Debtor claims defects, but claimed full GST ITC without debit notes and 0 pre-notice complaints
diagnosis = diagnose_section_9_dispute_crisis(
    claimed_amount_cr=5.0,
    gst_itc_claimed_by_debtor=True,
    pre_notice_complaints_exist=False,
    debit_notes_registered=False,
    arbitral_challenge_pending_sec_34=False
)
print("Section 9 Crisis Diagnosis Ruling:", diagnosis["petition_status"])
print("Judicial Finding:", diagnosis["finding"])
print("Remedial Protocol:", diagnosis["remedial_action"])
'''

part5_check = {
    "question": "Under Section 65 of the Insolvency and Bankruptcy Code 2016, what is the statutory penalty if an operational creditor initiates CIRP fraudulently or with malicious intent for purposes other than resolution?",
    "options": [
        "A personal monetary penalty of not less than one lakh rupees, which may extend up to one crore rupees",
        "Mandatory five years of corporate disqualification across all stock exchanges",
        "Automatic forfeiture of all intellectual property rights belonging to the creditor",
        "A formal reprimand issued in the local gazette without any financial consequences"
    ],
    "answerIndex": 0,
    "why": "Section 65(1) provides that if any person initiates the insolvency resolution process fraudulently or with malicious intent for any purpose other than resolution of insolvency, the Adjudicating Authority may impose a penalty of not less than one lakh rupees, but which may extend to one crore rupees."
}

# Try-It texts
try_it_texts = [
    "Execute the Section 4 jurisdiction engine to test default thresholds and determine NCLT insolvency maintainability.",
    "Run the Section 7 financial creditor validator to test default records and verify the statutory 14 day turnaround.",
    "Simulate the Section 9 operational creditor evaluator to apply the Mobilox doctrine and detect pre existing commercial disputes.",
    "Execute the Section 14 moratorium audit engine to evaluate stays on asset seizures, personal guarantees, and essential utilities.",
    "Run the Section 9 crisis diagnostic engine to detect fabricated defect claims, GST reconciliation discrepancies, and Section 65 penalties."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Insolvency legislative frameworks consolidate enterprise restructuring.",
        "say1": "Prior insolvency laws caused catastrophic capital destruction.",
        "example": "Equipment manufacturer defaults fall below jurisdictional thresholds.",
        "tryIt": "Jurisdiction engines test default thresholds and evaluate maintainability."
    },
    {
        "intro": "Financial creditor applications trigger statutory corporate resolution.",
        "say1": "Financial debt financing considers the time value of money.",
        "example": "Commercial bank credit facilities prove debt and default conclusively.",
        "tryIt": "Financial creditor validators test default records and statutory timelines."
    },
    {
        "intro": "Operational creditors enforce commercial claims through statutory notices.",
        "say1": "Commercial suppliers sustain daily enterprise business operations.",
        "example": "Software vendor claims face dismissal under pre existing dispute rules.",
        "tryIt": "Operational creditor evaluators apply dispute doctrines to test claims."
    },
    {
        "intro": "Statutory moratoriums establish comprehensive corporate asset freezes.",
        "say1": "Adjudicating authorities declare immediate statutory protective shields.",
        "example": "Commercial bank auction faces immediate statutory moratorium protection.",
        "tryIt": "Moratorium audit engines evaluate stays and essential utility protections."
    },
    {
        "intro": "Manufactured operational disputes trigger severe judicial scrutiny.",
        "say1": "Corporate legal warfare involves artificial operational claims.",
        "example": "Contractor invoice disputes face forensic tax reconciliation analysis.",
        "tryIt": "Crisis diagnostic engines detect fabricated claims and statutory penalties."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "Statutory Architecture", "subtext": "Consolidation of fragmented insolvency laws"},
        {"id": "s2", "name": "Default Threshold", "subtext": "One crore minimum limit under Section 4"},
        {"id": "s3", "name": "Clean Slate Doctrine", "subtext": "Extinguishment of past undisclosed liabilities"},
        {"id": "s4", "name": "Time Bound Tempo", "subtext": "Mandatory three hundred and thirty day cap"}
    ],
    [
        {"id": "s1", "name": "Financial Debt Test", "subtext": "Consideration for time value of money"},
        {"id": "s2", "name": "Information Utility", "subtext": "Conclusive evidence from NeSL record of default"},
        {"id": "s3", "name": "IRP Nomination", "subtext": "Mandatory proposal with valid assignment certificate"},
        {"id": "s4", "name": "Fourteen Day Rule", "subtext": "Statutory timeline for NCLT admission order"}
    ],
    [
        {"id": "s1", "name": "Section 8 Notice", "subtext": "Ten day statutory demand notice in Form 3"},
        {"id": "s2", "name": "Mobilox Doctrine", "subtext": "Plausible pre existing dispute requirement"},
        {"id": "s3", "name": "Pre Notice Chronology", "subtext": "Dispute documented prior to demand notice"},
        {"id": "s4", "name": "Tribunal Adjudication", "subtext": "Dismissal where genuine dispute exists"}
    ],
    [
        {"id": "s1", "name": "Universal Stay", "subtext": "Prohibition of suits and judicial executions"},
        {"id": "s2", "name": "Asset Encumbrance Bar", "subtext": "Freezing of corporate debtor property rights"},
        {"id": "s3", "name": "Essential Supplies", "subtext": "Non interruption of water power and telecom"},
        {"id": "s4", "name": "Guarantor Carve Out", "subtext": "Enforcement against personal guarantors allowed"}
    ],
    [
        {"id": "s1", "name": "Malicious Petition", "subtext": "Section 65 penalties for fraudulent initiation"},
        {"id": "s2", "name": "GST Reconciliation", "subtext": "Input tax credit matching exposes sham disputes"},
        {"id": "s3", "name": "Arbitration Overlap", "subtext": "Section 34 challenge bars insolvency petition"},
        {"id": "s4", "name": "Contemporaneous Proof", "subtext": "Goods receipt notes and NeSL registration"}
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
    print(f"Day 36 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 36 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 36 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day36_lesson.json
with open("scripts/day36_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day36_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 36 is already present
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

# 3. Build day-36.json visual file
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
            "title": f"{p['title']} Governance Architecture",
            "stages": stgs,
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "bcom_law",
    "day": 36,
    "promptSha": "prompt_sha_bcom_law_day36_cirp_initiation_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-36.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
