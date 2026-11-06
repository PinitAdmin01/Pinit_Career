"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 29 Builder: FCPA & UK Bribery Act Anti-Corruption Compliance (DOJ/SEC Corporate Enforcement Policy)
Milestone 6: Transnational Corporate Law, International Disputes & Global Governance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_29 = {
    "coursePrefix": "bcom_law",
    "day": 29,
    "title": "FCPA & UK Bribery Act Anti-Corruption Compliance (DOJ/SEC Corporate Enforcement Policy)",
    "goal": "Master global anti-corruption and anti-bribery compliance jurisprudence: examine the Foreign Corrupt Practices Act (FCPA) anti-bribery provisions, expansive foreign official definitions under United States v. Esquenazi, and extraterritorial jurisdiction, dissect statutory Books-and-Records and Internal Accounting Controls requirements under 15 U.S.C. § 78m(b)(2), evaluate the UK Bribery Act 2010 Section 7 corporate failure-to-prevent offense and the 'Adequate Procedures' affirmative defense, audit the DOJ Criminal Division Corporate Enforcement and Voluntary Self-Disclosure Policy (CEP), and simulate a sovereign transnational anti-corruption forensic triage and DOJ/SEC settlement resolution.",
    "minutes": 45,
    "recap": "Yesterday in Day 28, we conquered global supply chain ESG due diligence, the German LkSG, the EU CSDDD civil liability framework, and Paris-aligned climate transition plans. Today in Day 29, we master the ultimate criminal and regulatory minefield of transnational commerce: Global Anti-Corruption Compliance under the FCPA, the UK Bribery Act, and the DOJ Corporate Enforcement Policy.",
    "parts": [
        {
            "title": "The Foreign Corrupt Practices Act (FCPA): Anti-Bribery Provisions & Scope",
            "say": [
                "Enacted in 1977 following the Watergate scandal and SEC investigations revealing that over 400 major American corporations had paid hundreds of millions of dollars in bribes to foreign government officials, the Foreign Corrupt Practices Act (FCPA), codified at 15 U.S.C. §§ 78dd-1, et seq., represents the cornerstone of global white-collar criminal enforcement. Jointly enforced by the Department of Justice (DOJ) and the Securities and Exchange Commission (SEC), the FCPA transformed international commercial dealmaking by criminalizing overseas bribery.",
                "To establish a criminal or civil anti-bribery violation under the FCPA, the government must prove five cumulative statutory elements: (1) An Issuer, Domestic Concern, or person acting within the territory of the United States, (2) Made use of the mails or any means or instrumentality of interstate commerce (the jurisdictional nexus—satisfied by a single U.S. dollar wire transfer, email routing through U.S. servers, or telephone call), (3) Corruptly gave, offered, promised, or authorized the giving of anything of value, (4) To a 'Foreign Official', foreign political party, or candidate, or to any third party while knowing that all or a portion of the value would be offered to a foreign official, (5) For the purpose of influencing any official act or decision, or inducing the official to use their influence, to assist in 'obtaining or retaining business' (the broad business nexus test).",
                "A vital legal battleground centers on the statutory definition of a 'Foreign Official'. In United States v. Esquenazi (11th Cir. 2014), the federal appellate court established that 'Foreign Official' encompasses not only traditional elected politicians or cabinet ministers, but also officers and employees of state-owned or state-controlled commercial enterprises (SOEs). The court established a two-prong test: an entity is an 'instrumentality' of a foreign government if (a) the foreign state controls the entity (examining government ownership percentage, board appointments, and profit distribution), and (b) the entity performs a function that the government treats as its own.",
                "Consequently, paying kickbacks to physicians employed at state-owned hospitals, engineers at national oil companies, or procurement managers at municipal transit utilities constitutes a felony violation of the FCPA, carrying penalties up to $2,000,000 per violation for corporations and up to 5 years imprisonment for individual corporate officers.",
                "While the statute historically contained a narrow exception for 'Facilitating or Expediting Payments' ('grease payments' made to expedite routine non-discretionary governmental actions, such as obtaining phone service or customs clearance), this exception has become a legal dead letter in modern practice. Grease payments are illegal under local law in virtually every country, prohibited by the UK Bribery Act, and strictly banned by all Fortune 500 corporate compliance policies."
            ],
            "example": "A multinational telecom provider hires a local consultant in an emerging market to help win a $150M nationwide 5G infrastructure contract with the state-owned telecommunications agency. The consultant submits an invoice for $3,000,000 in 'advisory services' without any work product. The funds are routed to an offshore account controlled by the state agency's procurement director. Because the state agency is a government instrumentality under Esquenazi, the telecom company faces felony FCPA prosecution.",
            "code": """# Simulation: FCPA Anti-Bribery Violation & Foreign Official Instrumentality Classifier
from typing import Dict, List, Any

def evaluate_fcpa_anti_bribery_violation(
    target_entity_name: str,
    target_entity_state_ownership_pct: float,
    state_appoints_board_members: bool,
    performs_governmental_function: bool,
    payment_amount_usd: float,
    payment_purpose: str, # 'INFLUENCE_CONTRACT_AWARD', 'ROUTINE_CLERICAL_PERMIT', 'CHARITABLE_DONATION'
    routed_through_us_instrumentality: bool, # e.g. USD wire clearing through Manhattan
    recipient_role: str
) -> dict:
    # 1. Foreign Official / Instrumentality Determination (United States v. Esquenazi)
    is_state_controlled = (target_entity_state_ownership_pct > 0.50 or state_appoints_board_members)
    is_instrumentality = is_state_controlled and performs_governmental_function
    is_foreign_official = is_instrumentality or "MINISTRY" in target_entity_name.upper()
    
    # 2. Jurisdictional Nexus (Interstate / Foreign Commerce)
    has_us_jurisdiction = routed_through_us_instrumentality
    
    # 3. Corrupt Intent & Business Purpose Nexus
    is_corrupt_business_nexus = (payment_purpose == 'INFLUENCE_CONTRACT_AWARD')
    is_grease_payment = (payment_purpose == 'ROUTINE_CLERICAL_PERMIT')
    
    # 4. Liability Adjudication
    violations = []
    if is_foreign_official and has_us_jurisdiction and is_corrupt_business_nexus:
        violations.append({
            "statute": "15 U.S.C. § 78dd-1 / § 78dd-2",
            "charge": "CRIMINAL_FCPA_ANTI_BRIBERY_FELONY",
            "details": f"Corrupt payment of ${payment_amount_usd:,.2f} to foreign official ({recipient_role}) to obtain/retain business."
        })
    elif is_grease_payment:
        violations.append({
            "statute": "COMPLIANCE_ALERT",
            "charge": "FACILITATING_PAYMENT_HIGH_RISK",
            "details": "Technically excepted under narrow FCPA clause, but illegal under local foreign law and UKBA."
        })
        
    is_felony_breach = any(v["charge"] == "CRIMINAL_FCPA_ANTI_BRIBERY_FELONY" for v in violations)
    verdict = "CRIMINAL_FCPA_LIABILITY_ESTABLISHED" if is_felony_breach else "NO_CRIMINAL_FCPA_ANTI_BRIBERY_BREACH"
    
    return {
        "entity": target_entity_name,
        "is_foreign_instrumentality": is_instrumentality,
        "recipient_is_foreign_official": is_foreign_official,
        "has_us_jurisdiction": has_us_jurisdiction,
        "verdict": verdict,
        "statutory_charges": violations,
        "max_statutory_corporate_fine_usd": max(2_000_000.0, payment_amount_usd * 2.0) if is_felony_breach else 0.0
    }

# Execute deterministic simulation
audit = evaluate_fcpa_anti_bribery_violation(
    target_entity_name="National Power Grid Authority (State SOE)",
    target_entity_state_ownership_pct=0.70, # 70% state-owned utility
    state_appoints_board_members=True,
    performs_governmental_function=True,
    payment_amount_usd=2_500_000.0,
    payment_purpose="INFLUENCE_CONTRACT_AWARD",
    routed_through_us_instrumentality=True,
    recipient_role="Managing Director of Grid Procurement"
)
print(f"Target Entity: {audit['entity']}")
print(f"Esquenazi Instrumentality: {audit['is_foreign_instrumentality']} -> Foreign Official: {audit['recipient_is_foreign_official']}")
print(f"US Jurisdiction: {audit['has_us_jurisdiction']}")
print(f"Chancery Verdict: {audit['verdict']}")
print(f"Max Statutory Corporate Fine: ${audit['max_statutory_corporate_fine_usd']:,.2f}")
for c in audit['statutory_charges']:
    print(f" - [{c['charge']}]: {c['details']}")
""",
            "output": """Target Entity: National Power Grid Authority (State SOE)
Esquenazi Instrumentality: True -> Foreign Official: True
US Jurisdiction: True
Chancery Verdict: CRIMINAL_FCPA_LIABILITY_ESTABLISHED
Max Statutory Corporate Fine: $5,000,000.00
 - [CRIMINAL_FCPA_ANTI_BRIBERY_FELONY]: Corrupt payment of $2,500,000.00 to foreign official (Managing Director of Grid Procurement) to obtain/retain business.""",
            "tryIt": "Set `target_entity_state_ownership_pct` to 0.10 and `state_appoints_board_members` to False to see how commercial private status negates the Foreign Official element.",
            "check": {
                "question": "Under the landmark Eleventh Circuit decision in United States v. Esquenazi, how is an 'instrumentality' of a foreign government defined for purposes of classifying individuals as 'foreign officials' under the FCPA?",
                "options": [
                    "Only entities that operate military aircraft or naval ships",
                    "Any entity controlled by the foreign government (e.g. through majority ownership) that performs a function the government treats as its own",
                    "Any company with an annual revenue of less than $1,000,000",
                    "Only entities located in countries with which the United States maintains no diplomatic relations"
                ],
                "answerIndex": 1,
                "explanation": "Esquenazi established that an entity is an instrumentality of a foreign government if the government controls it and the entity performs a function that the government treats as its own, bringing state-owned enterprises within the FCPA.",
                "why": "This expansive definition prevents multinational corporations from bribing executives of state-owned utilities, oil companies, and hospitals under the guise of private commercial contracting."
            },
            "codeNotes": [
                "`evaluate_fcpa_anti_bribery_violation` codifies the Esquenazi two-prong instrumentality framework.",
                "Checks the five cumulative statutory elements of an FCPA anti-bribery violation.",
                "Calculates maximum statutory corporate fines under the Alternative Fines Act (twice the gross pecuniary gain)."
            ]
        },
        {
            "title": "FCPA Books-and-Records & Internal Accounting Controls Provisions",
            "say": [
                "While the anti-bribery provisions attract major headlines, the vast majority of SEC and DOJ FCPA enforcement actions are prosecuted under the less visible but far more lethal 'Accounting Provisions', codified at Section 13(b)(2) of the Securities Exchange Act of 1934 (15 U.S.C. § 78m(b)(2)). The accounting provisions apply to all 'Issuers' (any company with securities listed on a U.S. exchange or required to file periodic reports with the SEC, including foreign corporations trading via American Depositary Receipts / ADRs).",
                "The Accounting Provisions contain two distinct, non-overlapping statutory mandates. First, the 'Books-and-Records' provision (Section 13(b)(2)(A)) mandates that issuers must 'make and keep books, records, and accounts, which, in reasonable detail, accurately and fairly reflect the transactions and dispositions of the assets of the issuer'. In enforcement practice, bribes are never recorded on corporate ledgers as 'Bribe to Minister'; instead, they are disguised under innocuous general ledger accounts—such as 'Consulting Fees', 'Marketing Expenses', 'Customs Clearance Agent Fees', or 'Customer Hospitality'. Disguising an illicit payment, or maintaining an off-the-books slush fund, constitutes an independent statutory violation of the books-and-records provision.",
                "Crucially, the Books-and-Records provision is a STRICT LIABILITY statute! The SEC is NOT required to prove corrupt intent, materiality, or that a bribe was successfully paid! An issuer violates the statute whenever its books and records fail to accurately describe a transaction in reasonable detail. Furthermore, an issuer is strictly liable for the inaccurate books and records of its consolidated foreign subsidiaries, even if corporate management in the United States had zero knowledge of the subsidiary's accounting misstatements.",
                "Second, the 'Internal Accounting Controls' provision (Section 13(b)(2)(B)) mandates that issuers must devise and maintain a system of internal accounting controls sufficient to provide reasonable assurances that: (1) Transactions are executed in accordance with management's general or specific authorization, (2) Transactions are recorded as necessary to permit preparation of financial statements in conformity with GAAP and to maintain accountability for assets, and (3) Access to assets is permitted only in accordance with management authorization.",
                "The SEC routinely brings internal controls charges against issuers that fail to perform due diligence on high-risk third-party distributors, pay invoices lacking substantiating work product, or permit single-signature disbursements in corrupt jurisdictions."
            ],
            "example": "A foreign subsidiary of a U.S. chemical manufacturer pays $250,000 to an offshore shell company owned by a local customs broker to fast-track import permits, recording the disbursement as 'Routine Import Consulting'. Even if the U.S. parent had no knowledge of the payment and the amount is immaterial to its multi-billion-dollar balance sheet, the SEC charges the parent with violating the Books-and-Records and Internal Controls provisions.",
            "code": """# Simulation: FCPA Accounting Provisions & Internal Controls Red Flag Auditor
from typing import Dict, List, Any

def audit_fcpa_books_and_records_internal_controls(
    issuer_name: str,
    disbursement_amount_usd: float,
    recorded_general_ledger_account: str,
    actual_economic_purpose: str,
    third_party_vendor_is_shell_company: bool,
    lacks_documented_work_product_deliverables: bool,
    payment_routed_to_offshore_secrecy_haven: bool,
    approved_by_sole_signature_bypassing_controls: bool
) -> dict:
    accounting_violations = []
    
    # 1. Books-and-Records Strict Liability Check (Section 13(b)(2)(A))
    # Mischaracterization of transactions constitutes an automatic violation
    is_mischaracterized = (recorded_general_ledger_account != actual_economic_purpose)
    if is_mischaracterized:
        accounting_violations.append({
            "section": "15 U.S.C. § 78m(b)(2)(A)",
            "violation": "BOOKS_AND_RECORDS_MISCHARACTERIZATION",
            "details": f"Disbursement of ${disbursement_amount_usd:,.2f} recorded as '{recorded_general_ledger_account}' but used for '{actual_economic_purpose}'."
        })
        
    # 2. Internal Accounting Controls Check (Section 13(b)(2)(B))
    red_flags = []
    if third_party_vendor_is_shell_company:
        red_flags.append("HIGH_RISK_THIRD_PARTY_SHELL_COMPANY_VENDOR")
    if lacks_documented_work_product_deliverables:
        red_flags.append("PAYMENT_DISBURSED_WITHOUT_SUBSTANTIATING_WORK_PRODUCT")
    if payment_routed_to_offshore_secrecy_haven:
        red_flags.append("OFFSHORE_TAX_HAVEN_BANKING_ROUTING")
    if approved_by_sole_signature_bypassing_controls:
        red_flags.append("DUAL_AUTHORIZATION_INTERNAL_CONTROL_BYPASS")
        
    if len(red_flags) >= 2:
        accounting_violations.append({
            "section": "15 U.S.C. § 78m(b)(2)(B)",
            "violation": "INTERNAL_ACCOUNTING_CONTROLS_FAILURE",
            "details": f"Issuer failed to maintain internal accounting controls sufficient to prevent unauthorized disbursements ({', '.join(red_flags)})."
        })
        
    is_strictly_liable = len(accounting_violations) > 0
    status = "SEC_CIVIL_ENFORCEMENT_ACTION_COMMENCED" if is_strictly_liable else "ACCOUNTING_CONTROLS_VERIFIED_CLEAN"
    
    return {
        "issuer": issuer_name,
        "is_strictly_liable_under_section13b2": is_strictly_liable,
        "enforcement_status": status,
        "accounting_violations": accounting_violations,
        "red_flag_count": len(red_flags),
        "red_flags": red_flags
    }

# Execute deterministic simulation
res = audit_fcpa_books_and_records_internal_controls(
    issuer_name="OmniCorp Global Technologies Inc (NYSE: OMG)",
    disbursement_amount_usd=850_000.0,
    recorded_general_ledger_account="Marketing_and_Sponsorship_Expense",
    actual_economic_purpose="Bribe_to_Ministry_Chief_of_Staff",
    third_party_vendor_is_shell_company=True,
    lacks_documented_work_product_deliverables=True,
    payment_routed_to_offshore_secrecy_haven=True,
    approved_by_sole_signature_bypassing_controls=True
)
print(f"Issuer: {res['issuer']}")
print(f"SEC Strict Liability: {res['is_strictly_liable_under_section13b2']} ({res['enforcement_status']})")
print(f"Internal Controls Red Flags: {res['red_flag_count']}")
for v in res['accounting_violations']:
    print(f" - [{v['violation']}]: {v['details']}")
""",
            "output": """Issuer: OmniCorp Global Technologies Inc (NYSE: OMG)
SEC Strict Liability: True (SEC_CIVIL_ENFORCEMENT_ACTION_COMMENCED)
Internal Controls Red Flags: 4
 - [BOOKS_AND_RECORDS_MISCHARACTERIZATION]: Disbursement of $850,000.00 recorded as 'Marketing_and_Sponsorship_Expense' but used for 'Bribe_to_Ministry_Chief_of_Staff'.
 - [INTERNAL_ACCOUNTING_CONTROLS_FAILURE]: Issuer failed to maintain internal accounting controls sufficient to prevent unauthorized disbursements (HIGH_RISK_THIRD_PARTY_SHELL_COMPANY_VENDOR, PAYMENT_DISBURSED_WITHOUT_SUBSTANTIATING_WORK_PRODUCT, OFFSHORE_TAX_HAVEN_BANKING_ROUTING, DUAL_AUTHORIZATION_INTERNAL_CONTROL_BYPASS).""",
            "tryIt": "Set `recorded_general_ledger_account` equal to `actual_economic_purpose` and all red flags to False to see how transparent accounting clears the Section 13(b)(2) audit.",
            "check": {
                "question": "Is the Securities and Exchange Commission (SEC) required to prove criminal corrupt intent or financial statement materiality to establish a violation of the FCPA's Books-and-Records provision (15 U.S.C. § 78m(b)(2)(A))?",
                "options": [
                    "Yes, the SEC must prove criminal intent beyond a reasonable doubt in all cases",
                    "No, the Books-and-Records provision is a strict liability statute; any failure to accurately and fairly reflect corporate transactions in reasonable detail constitutes an independent civil violation regardless of intent or materiality",
                    "Only if the company is incorporated in Delaware",
                    "Only if the misstatement exceeds 10% of global net income"
                ],
                "answerIndex": 1,
                "explanation": "The Books-and-Records provision imposes strict civil liability on issuers. The SEC is not required to show corrupt intent or financial materiality to prove a violation.",
                "why": "This strict liability standard prevents corporations from hiding behind plausible deniability or claiming that small foreign bribes were immaterial to consolidated financial statements."
            },
            "codeNotes": [
                "`audit_fcpa_books_and_records_internal_controls` codifies the strict liability standards of 15 U.S.C. § 78m(b)(2).",
                "Evaluates Section 13(b)(2)(A) books-and-records mischaracterization.",
                "Audits Section 13(b)(2)(B) internal accounting controls against forensic third-party red flags."
            ]
        },
        {
            "title": "The UK Bribery Act 2010: Section 7 & The 'Adequate Procedures' Defense",
            "say": [
                "While the United States pioneered anti-corruption enforcement with the FCPA, the United Kingdom enacted what is widely regarded as the most rigorous and unforgiving anti-bribery statute in the world: the UK Bribery Act 2010 (UKBA), entering into force on July 1, 2011. The UKBA significantly exceeds the statutory reach of the FCPA in several decisive respects.",
                "First, whereas the FCPA is restricted exclusively to the bribery of foreign public officials, the UK Bribery Act criminalizes BOTH public bribery and commercial bribery (private business-to-business bribery under Sections 1 and 2). Paying a kickback to a private procurement manager at a commercial airline is just as criminal under the UKBA as bribing a government minister.",
                "Second, unlike the FCPA's historic facilitation payment exception, the UK Bribery Act strictly prohibits ALL facilitation payments ('grease payments'), regardless of amount. Paying a £10 cash bribe to a port official to stamp a customs document is a criminal offense.",
                "Third, the centerpiece of the UKBA is the revolutionary corporate offense established under Section 7: 'Failure of commercial organisations to prevent bribery'. Under Section 7, a commercial organisation is strictly liable to an unlimited criminal fine if a person 'associated' with the organization (defined broadly as any employee, agent, subsidiary, joint venture partner, or distributor) pays a bribe intending to obtain or retain business or a business advantage for the organization.",
                "Crucially, Section 7 is a strict liability corporate offense! The Serious Fraud Office (SFO) does NOT need to prove that the corporate board or senior management authorized, knew of, or was even negligent regarding the bribe. The mere fact that an associated person paid a bribe triggers automatic corporate criminal liability.",
                "The SOLE statutory affirmative defense available to a corporation charged under Section 7 is to prove that it had in place 'Adequate Procedures' designed to prevent associated persons from undertaking such conduct. Under official Ministry of Justice Guidance, Adequate Procedures are evaluated against Six Core Principles: (1) Proportionate procedures, (2) Top-level commitment ('tone at the top'), (3) Risk assessment, (4) Due diligence, (5) Communication and training, and (6) Monitoring and review."
            ],
            "example": "A UK engineering firm's local sales agent in West Africa pays a $50,000 bribe to a private mining company's chief engineer to secure a multi-million-pound drilling contract. The UK board had no knowledge of the bribe. Under Section 7 of the UKBA, the UK engineering firm is criminally prosecuted for failure to prevent bribery. The company escapes criminal conviction only if it proves it implemented all Six Principles of Adequate Procedures.",
            "code": """# Simulation: UK Bribery Act Section 7 Liability & 'Adequate Procedures' Defense Evaluator
from typing import Dict, List, Any

def evaluate_ukba_section7_adequate_procedures(
    company_name: str,
    associated_person_paid_bribe: bool,
    bribe_type: str, # 'COMMERCIAL_PRIVATE_TO_PRIVATE', 'PUBLIC_FOREIGN_OFFICIAL', 'FACILITATION_PAYMENT'
    has_proportionate_compliance_policies: bool,
    has_demonstrated_top_level_board_commitment: bool,
    conducts_periodic_anti_bribery_risk_assessments: bool,
    conducts_risk_based_third_party_due_diligence: bool,
    provides_mandatory_employee_anti_bribery_training: bool,
    conducts_continuous_monitoring_and_internal_audit: bool
) -> dict:
    # 1. Base Offense Evaluation (Sections 1, 2, 6, 7)
    # The UKBA bans commercial bribery, public bribery, and all facilitation payments
    if not associated_person_paid_bribe:
        return {
            "company": company_name,
            "section7_triggered": False,
            "status": "NO_BRIBERY_OFFENSE_DETECTED",
            "affirmative_defense_upheld": True,
            "criminal_liability": "NO_LIABILITY"
        }
        
    # 2. Six Principles of Adequate Procedures Audit (Ministry of Justice)
    principles = {
        "P1_PROPORTIONATE_PROCEDURES": has_proportionate_compliance_policies,
        "P2_TOP_LEVEL_COMMITMENT": has_demonstrated_top_level_board_commitment,
        "P3_RISK_ASSESSMENT": conducts_periodic_anti_bribery_risk_assessments,
        "P4_DUE_DILIGENCE": conducts_risk_based_third_party_due_diligence,
        "P5_COMMUNICATION_AND_TRAINING": provides_mandatory_employee_anti_bribery_training,
        "P6_MONITORING_AND_REVIEW": conducts_continuous_monitoring_and_internal_audit
    }
    
    satisfied_principles_count = sum(1 for v in principles.values() if v)
    all_six_principles_satisfied = (satisfied_principles_count == 6)
    
    # 3. Section 7 Affirmative Defense Adjudication
    if all_six_principles_satisfied:
        defense_verdict = "ADEQUATE_PROCEDURES_DEFENSE_PROVEN_UNDER_SECTION_7_2"
        criminal_status = "ABSOLUTE_STATUTORY_ACQUITTAL"
        unlimited_fine_exposure = False
    else:
        defense_verdict = "DEFENSE_FAILED_INADEQUATE_ANTI_CORRUPTION_PROCEDURES"
        criminal_status = "CRIMINAL_CONVICTION_UNDER_SECTION_7_UKBA"
        unlimited_fine_exposure = True
        
    return {
        "company": company_name,
        "section7_triggered": True,
        "bribe_classification": bribe_type,
        "principles_audit": principles,
        "satisfied_principles_score": f"{satisfied_principles_count}/6",
        "affirmative_defense_status": defense_verdict,
        "criminal_liability": criminal_status,
        "subject_to_unlimited_fine": unlimited_fine_exposure
    }

# Execute deterministic simulation
audit = evaluate_ukba_section7_adequate_procedures(
    company_name="Caledonian Marine Infrastructure Ltd",
    associated_person_paid_bribe=True,
    bribe_type="COMMERCIAL_PRIVATE_TO_PRIVATE", # Private kickback covered by UKBA
    has_proportionate_compliance_policies=True,
    has_demonstrated_top_level_board_commitment=True,
    conducts_periodic_anti_bribery_risk_assessments=True,
    conducts_risk_based_third_party_due_diligence=True,
    provides_mandatory_employee_anti_bribery_training=True,
    conducts_continuous_monitoring_and_internal_audit=True
)
print(f"Company: {audit['company']}")
print(f"Section 7 Triggered: {audit['section7_triggered']} (Type: {audit['bribe_classification']})")
print(f"Ministry of Justice Principles: {audit['satisfied_principles_score']}")
print(f"Affirmative Defense Status: {audit['affirmative_defense_status']}")
print(f"Criminal Status: {audit['criminal_liability']} (Unlimited Fine: {audit['subject_to_unlimited_fine']})")
""",
            "output": """Company: Caledonian Marine Infrastructure Ltd
Section 7 Triggered: True (Type: COMMERCIAL_PRIVATE_TO_PRIVATE)
Ministry of Justice Principles: 6/6
Affirmative Defense Status: ADEQUATE_PROCEDURES_DEFENSE_PROVEN_UNDER_SECTION_7_2
Criminal Status: ABSOLUTE_STATUTORY_ACQUITTAL (Unlimited Fine: False)""",
            "tryIt": "Set `conducts_risk_based_third_party_due_diligence` to False and observe how missing a single principle causes the affirmative defense to fail, resulting in a criminal conviction.",
            "check": {
                "question": "What is the sole statutory affirmative defense available to a commercial organization charged with the strict liability corporate offense of failure to prevent bribery under Section 7 of the UK Bribery Act 2010?",
                "options": [
                    "Proving that the CEO did not personally receive any of the bribe money",
                    "Proving that the commercial organization had in place adequate procedures designed to prevent persons associated with it from undertaking such conduct",
                    "Demonstrating that the bribe was paid in foreign currency outside the UK",
                    "Showing that the bribe was less than £500,000"
                ],
                "answerIndex": 1,
                "explanation": "Under Section 7(2) of the UKBA, it is a complete defense for the organization to prove that it had in place adequate procedures designed to prevent associated persons from bribing.",
                "why": "This statutory defense incentivizes corporations to invest heavily in institutional anti-corruption compliance systems and rigorous third-party due diligence."
            },
            "codeNotes": [
                "`evaluate_ukba_section7_adequate_procedures` models the Section 7 failure-to-prevent strict liability offense.",
                "Audits compliance against the Six Principles of the Ministry of Justice Adequate Procedures guidance.",
                "Determines whether the corporation qualifies for complete statutory acquittal under Section 7(2)."
            ]
        },
        {
            "title": "The DOJ Corporate Enforcement Policy (CEP) & Voluntary Self-Disclosure",
            "say": [
                "When a multinational enterprise uncovers an internal bribery conspiracy or FCPA violation, executive management and the Board Audit Committee face a monumental strategic decision: Should the corporation immediately self-report the violation to the Department of Justice and SEC, or should it conduct a confidential internal investigation and remediate quietly without disclosure? The answer to this dilemma is governed by the DOJ Criminal Division's Corporate Enforcement and Voluntary Self-Disclosure Policy (CEP), significantly updated in 2023 and 2024 under Deputy Attorney General Lisa Monaco.",
                "Under the revised DOJ Corporate Enforcement Policy, the Department provides powerful statutory and financial incentives to encourage corporate self-reporting. The CEP establishes a formal presumption that the DOJ will grant a 'Declination' (an official decision to close the investigation with zero criminal charges filed and no criminal penalties imposed) if a corporation satisfies three cumulative criteria.",
                "The three mandatory criteria for a full Declination are: (1) Voluntary Self-Disclosure (the disclosure must be made promptly upon discovery of the misconduct, prior to an imminent threat of disclosure or government investigation, and must include all known relevant facts), (2) Full Cooperation (proactive, real-time disclosure of non-privileged facts, preservation of ephemeral messaging apps, attribution of individual culpability, and making overseas witnesses available for interview), and (3) Timely and Appropriate Remediation (thorough root-cause analysis, disciplinary sanctions against culpable employees, implementation of compensation clawback policies under the Monaco Memo to recoup bonuses from wrongdoers, and testing compliance program effectiveness).",
                "Even if aggravating circumstances (such as involvement of the corporate CEO, severe executive recidivism, or pervasive corporate culture corruption) preclude a full declination, companies that satisfy all three criteria remain eligible for extraordinary fine reductions: between 50% and 75% off the low end of the U.S. Sentencing Guidelines fine range, and the complete avoidance of an independent compliance monitor! Conversely, corporations that fail to self-disclose and are later caught face aggressive criminal indictment, guilty pleas, zero fine discounts, and the imposition of a costly three-year federal monitorship."
            ],
            "example": "An industrial manufacturing conglomerate discovers that its Latin American subsidiary paid $4M in illicit bribes to secure port construction permits. The board immediately self-discloses to the DOJ within weeks of discovery, claws back bonuses from involved executives, fires the country manager, and overhauls internal accounting controls. The DOJ rewards this cooperation with a full Declination with Disgorgement, requiring only the return of net illicit profits ($12M) while imposing $0.00 in criminal fines.",
            "code": """# Simulation: DOJ Corporate Enforcement Policy (CEP) Penalty & Declination Calculator
from typing import Dict, List, Any

def calculate_doj_corporate_enforcement_resolution(
    company_name: str,
    base_fine_ussg_usd: float,
    culpability_score: int, # U.S. Sentencing Guidelines § 8C2.5 (Typically 5 to 10)
    voluntarily_self_disclosed_timely: bool,
    fully_cooperated_proactively: bool,
    timely_and_appropriately_remediated: bool,
    clawed_back_executive_bonuses: bool,
    has_aggravating_circumstances: bool, # e.g. CEO personal involvement or recidivism
    illicit_profits_disgorgement_usd: float
) -> dict:
    # 1. U.S. Sentencing Guidelines Fine Multiplier Matrix (§ 8C2.6)
    # Multiplier ranges based on culpability score
    multiplier_low = max(0.05, (culpability_score * 0.20))
    guidelines_bottom_fine_usd = base_fine_ussg_usd * multiplier_low
    
    # 2. Check for Presumption of Declination
    qualifies_for_declination = (
        voluntarily_self_disclosed_timely and 
        fully_cooperated_proactively and 
        timely_and_appropriately_remediated and 
        clawed_back_executive_bonuses and 
        not has_aggravating_circumstances
    )
    
    # 3. Fine Calculation & Resolution Structure
    if qualifies_for_declination:
        resolution_type = "DOJ_DECLINATION_WITH_DISGORGEMENT"
        criminal_fine_usd = 0.0
        discount_percentage = 100.0
        independent_monitor_required = False
    elif voluntarily_self_disclosed_timely and fully_cooperated_proactively:
        # Aggravating factor present, but disclosed & cooperated: 50% - 75% discount off bottom
        resolution_type = "NON_PROSECUTION_AGREEMENT_NPA_WITH_MAX_DISCOUNT"
        discount_percentage = 75.0
        criminal_fine_usd = guidelines_bottom_fine_usd * (1.0 - 0.75)
        independent_monitor_required = False
    elif fully_cooperated_proactively and timely_and_appropriately_remediated:
        # Did NOT self-disclose, but cooperated: Max 50% discount off guidelines
        resolution_type = "DEFERRED_PROSECUTION_AGREEMENT_DPA"
        discount_percentage = 50.0
        criminal_fine_usd = guidelines_bottom_fine_usd * (1.0 - 0.50)
        independent_monitor_required = True
    else:
        # No disclosure, no cooperation: Guilty Plea, zero discount, monitor imposed
        resolution_type = "CRIMINAL_GUILTY_PLEA_MAX_PENALTY"
        discount_percentage = 0.0
        criminal_fine_usd = guidelines_bottom_fine_usd * 1.5 # Enhanced penalty
        independent_monitor_required = True
        
    total_financial_outlay_usd = criminal_fine_usd + illicit_profits_disgorgement_usd
    
    return {
        "company": company_name,
        "resolution_type": resolution_type,
        "qualifies_for_declination": qualifies_for_declination,
        "guidelines_base_fine_usd": guidelines_bottom_fine_usd,
        "cep_fine_discount_pct": discount_percentage,
        "criminal_penalty_payable_usd": criminal_fine_usd,
        "disgorgement_payable_usd": illicit_profits_disgorgement_usd,
        "total_financial_settlement_usd": total_financial_outlay_usd,
        "independent_compliance_monitor_imposed": independent_monitor_required
    }

# Execute deterministic simulation
cep = calculate_doj_corporate_enforcement_resolution(
    company_name="Apex Infrastructure Global Corp",
    base_fine_ussg_usd=40_000_000.0,
    culpability_score=6, # Base multiplier 1.20 -> Bottom fine $48M
    voluntarily_self_disclosed_timely=True,
    fully_cooperated_proactively=True,
    timely_and_appropriately_remediated=True,
    clawed_back_executive_bonuses=True,
    has_aggravating_circumstances=False,
    illicit_profits_disgorgement_usd=14_500_000.0
)
print(f"Company: {cep['company']}")
print(f"DOJ Resolution: {cep['resolution_type']} (Declination: {cep['qualifies_for_declination']})")
print(f"Sentencing Guidelines Bottom Fine: ${cep['guidelines_base_fine_usd']:,.2f}")
print(f"CEP Discount: {cep['cep_fine_discount_pct']}%")
print(f"Criminal Penalty: ${cep['criminal_penalty_payable_usd']:,.2f}")
print(f"SEC/DOJ Disgorgement: ${cep['disgorgement_payable_usd']:,.2f}")
print(f"Total Settlement: ${cep['total_financial_settlement_usd']:,.2f}")
print(f"Independent Monitor Imposed: {cep['independent_compliance_monitor_imposed']}")
""",
            "output": """Company: Apex Infrastructure Global Corp
DOJ Resolution: DOJ_DECLINATION_WITH_DISGORGEMENT (Declination: True)
Sentencing Guidelines Bottom Fine: $48,000,000.00
CEP Discount: 100.0%
Criminal Penalty: $0.00
SEC/DOJ Disgorgement: $14,500,000.00
Total Settlement: $14,500,000.00
Independent Monitor Imposed: False""",
            "tryIt": "Set `voluntarily_self_disclosed_timely` to False and observe how the resolution shifts from a Declination ($0 fine) to a DPA with a $24M criminal fine and a mandatory monitor.",
            "check": {
                "question": "Under the revised Department of Justice (DOJ) Corporate Enforcement and Voluntary Self-Disclosure Policy, what is the presumptive resolution for a company that timely self-discloses misconduct, fully cooperates, and appropriately remediates, in the absence of aggravating circumstances?",
                "options": [
                    "A mandatory criminal guilty plea and immediate liquidation of the company",
                    "A formal Declination of criminal prosecution, requiring only disgorgement of illicit profits with zero criminal fines and no independent monitor",
                    "A five-year suspension of all corporate export licenses",
                    "A mandatory transfer of 51% of corporate equity to the United Nations"
                ],
                "answerIndex": 1,
                "explanation": "Under the DOJ Corporate Enforcement Policy, there is a presumption that the DOJ will grant a Declination (no criminal charges or criminal penalties) if the company satisfies the criteria of timely voluntary disclosure, full cooperation, and remediation without aggravating factors.",
                "why": "This policy provides an overwhelming financial and reputational incentive for corporate boards to self-report corruption rather than attempt internal cover-ups."
            },
            "codeNotes": [
                "`calculate_doj_corporate_enforcement_resolution` implements the revised DOJ Corporate Enforcement Policy (CEP).",
                "Models U.S. Sentencing Guidelines § 8C2.6 culpability scores and baseline fine calculation.",
                "Simulates resolution tiers: Declination, NPA with 75% discount, DPA with 50% discount, and Guilty Plea."
            ]
        },
        {
            "title": "Sovereign Anti-Corruption Forensic Triage & Settlement Engine",
            "say": [
                "To synthesize the entirety of transnational anti-corruption compliance, we now deploy an enterprise-scale forensic simulation: the 'Sovereign Anti-Corruption Forensic Triage & Settlement Engine'. This control system models a Fortune 500 multinational facing a major cross-border bribery investigation.",
                "Consider 'Vanguard Aerospace & Defense Group Inc.' (NYSE: VAD)—a global defense and aerospace contractor with operations in 40 nations, annual revenue of $18B, and 65,000 employees. An anonymous internal whistleblower complaint alerts the Board Audit Committee that Vanguard's Middle Eastern subsidiary paid $3.8M in sham consulting fees to an offshore shell entity in Dubai, which funneled the cash to military procurement officials to secure a $220M sovereign radar avionics supply contract.",
                "The master simulation models the complete five-stage anti-corruption response: (1) Forensic triage of whistleblower evidence, digital communications, and bank wire logs, (2) Board Special Committee authorization of immediate voluntary self-disclosure to the DOJ and SEC under the Monaco Memo guidelines, (3) Root-cause remediation, including termination of the subsidiary president, executive compensation clawbacks totaling $4.5M, and termination of all unvetted third-party sales intermediaries, (4) Quantitative fine modeling under U.S. Sentencing Guidelines § 8C2.6, applying the 100% fine discount under the DOJ CEP Declination framework, and (5) SEC disgorgement settlement returning $32.5M in net contract profits plus compound prejudgment interest.",
                "Let us execute the master simulation and audit the transnational enforcement waterfall."
            ],
            "example": "Vanguard Aerospace resolves a potential $150M criminal bribery catastrophe by self-reporting within 14 days, securing a formal DOJ Declination, eliminating all criminal fines, and settling with the SEC for $32.5M disgorgement without an independent monitor.",
            "code": """# Simulation: Sovereign Transnational Anti-Corruption Settlement & Triage Master Engine
from typing import Dict, List, Any

def simulate_sovereign_anti_corruption_settlement(
    corporation_name: str,
    contract_secured_via_bribery_usd: float,
    gross_illicit_profit_margin_pct: float,
    bribe_amount_paid_usd: float,
    board_enacted_immediate_voluntary_disclosure: bool,
    fired_culpable_executives: bool,
    clawed_back_executive_compensation_usd: float,
    overhauled_internal_accounting_controls: bool
) -> dict:
    # 1. Economic Disgorgement Calculation (SEC / DOJ Mandate)
    # Net ill-gotten profits must be surrendered regardless of declination
    net_illicit_profit_usd = contract_secured_via_bribery_usd * (gross_illicit_profit_margin_pct / 100.0)
    prejudgment_interest_usd = net_illicit_profit_usd * 0.08 # 8% statutory interest
    total_disgorgement_payable_usd = net_illicit_profit_usd + prejudgment_interest_usd
    
    # 2. U.S. Sentencing Guidelines Baseline Criminal Fine
    # Base fine: Greatest of pecuniary gain, pecuniary loss, or statutory schedule ($45M)
    base_fine_usd = max(net_illicit_profit_usd, 45_000_000.0)
    
    # 3. DOJ CEP Declination Audit
    qualifies_for_declination = (
        board_enacted_immediate_voluntary_disclosure and 
        fired_culpable_executives and 
        clawed_back_executive_compensation_usd > 0.0 and 
        overhauled_internal_accounting_controls
    )
    
    if qualifies_for_declination:
        doj_verdict = "DOJ_CRIMINAL_DECLINATION_GRANTED"
        criminal_fine_payable_usd = 0.0
        independent_monitor_imposed = False
        corporate_reputation_impact = "ENTERPRISE_PRESERVED_NO_DEBARMENT"
    else:
        doj_verdict = "CRIMINAL_DPA_WITH_PUNITIVE_FINE"
        criminal_fine_payable_usd = base_fine_usd * 1.20 # $54M penalty
        independent_monitor_imposed = True
        corporate_reputation_impact = "PROBATION_AND_PUBLIC_TENDER_DEBARMENT_RISK"
        
    total_settlement_cost_usd = criminal_fine_payable_usd + total_disgorgement_payable_usd
    net_compensation_clawback_recovery_usd = clawed_back_executive_compensation_usd
    net_corporate_treasury_outlay_usd = total_settlement_cost_usd - net_compensation_clawback_recovery_usd
    
    return {
        "corporation": corporation_name,
        "contract_value_usd": contract_secured_via_bribery_usd,
        "bribe_paid_usd": bribe_amount_paid_usd,
        "doj_resolution": doj_verdict,
        "criminal_fine_usd": criminal_fine_payable_usd,
        "sec_disgorgement_usd": total_disgorgement_payable_usd,
        "compensation_clawback_recovered_usd": net_compensation_clawback_recovery_usd,
        "total_settlement_cost_usd": total_settlement_cost_usd,
        "net_cash_outflow_usd": net_corporate_treasury_outlay_usd,
        "independent_monitor_required": independent_monitor_imposed,
        "enterprise_survival_status": corporate_reputation_impact
    }

# Execute master simulation
res = simulate_sovereign_anti_corruption_settlement(
    corporation_name="Vanguard Aerospace & Defense Group Inc",
    contract_secured_via_bribery_usd=220_000_000.0,
    gross_illicit_profit_margin_pct=14.0, # $30.8M net illicit profit
    bribe_amount_paid_usd=3_800_000.0,
    board_enacted_immediate_voluntary_disclosure=True,
    fired_culpable_executives=True,
    clawed_back_executive_compensation_usd=4_500_000.0,
    overhauled_internal_accounting_controls=True
)
print(f"=== SOVEREIGN ANTI-CORRUPTION RESOLUTION: {res['corporation']} ===")
print(f"Contract: ${res['contract_value_usd']:,.0f} | Bribe: ${res['bribe_paid_usd']:,.0f}")
print(f"DOJ Resolution: {res['doj_resolution']}")
print(f"Criminal Penalty: ${res['criminal_fine_usd']:,.2f}")
print(f"SEC Disgorgement & Interest: ${res['sec_disgorgement_usd']:,.2f}")
print(f"Executive Compensation Clawback: -${res['compensation_clawback_recovered_usd']:,.2f}")
print(f"Net Treasury Outlay: ${res['net_cash_outflow_usd']:,.2f}")
print(f"Independent Monitor Imposed: {res['independent_monitor_required']}")
print(f"Enterprise Survival: {res['enterprise_survival_status']}")
""",
            "output": """=== SOVEREIGN ANTI-CORRUPTION RESOLUTION: Vanguard Aerospace & Defense Group Inc ===
Contract: $220,000,000 | Bribe: $3,800,000
DOJ Resolution: DOJ_CRIMINAL_DECLINATION_GRANTED
Criminal Penalty: $0.00
SEC Disgorgement & Interest: $33,264,000.00
Executive Compensation Clawback: -$4,500,000.00
Net Treasury Outlay: $28,764,000.00
Independent Monitor Imposed: False
Enterprise Survival: ENTERPRISE_PRESERVED_NO_DEBARMENT""",
            "tryIt": "Set `board_enacted_immediate_voluntary_disclosure` to False and observe how failure to self-disclose triggers a $54M criminal fine and a mandatory 3-year federal monitor.",
            "check": {
                "question": "In a corporate anti-corruption settlement under the DOJ Corporate Enforcement Policy, does receiving a full Declination exempt the corporation from paying disgorgement of ill-gotten profits to the SEC or DOJ?",
                "options": [
                    "Yes, a declination forgives all financial penalties and disgorgement completely",
                    "No, a declination eliminates criminal fines and monitorships, but the corporation must still pay full disgorgement of all net ill-gotten profits resulting from the corrupt transactions",
                    "Only if the company pays an equivalent amount to the United Nations",
                    "Only if the company changes its corporate name"
                ],
                "answerIndex": 1,
                "explanation": "Under the DOJ Corporate Enforcement Policy, a Declination does not allow the company to keep the fruits of corruption. The company must pay full disgorgement of all illicit profits.",
                "why": "Disgorgement strips wrongdoers of unjust enrichment while the declination shields the enterprise from punitive criminal fines and devastating debarment from government contracts."
            },
            "codeNotes": [
                "`simulate_sovereign_anti_corruption_settlement` integrates DOJ CEP declination and SEC disgorgement frameworks.",
                "Calculates net ill-gotten contract profits and statutory compound prejudgment interest.",
                "Factors in executive compensation clawbacks under the Monaco Memo to offset corporate treasury outlays."
            ]
        }
    ]
}
