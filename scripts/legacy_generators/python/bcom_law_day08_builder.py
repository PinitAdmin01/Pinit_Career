"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 8 Builder: Trade Secrets, Defend Trade Secrets Act (DTSA) & Misappropriation Litigation
Milestone 2: Intellectual Property & Technology Licensing Architecture
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_08 = {
    "coursePrefix": "bcom_law",
    "day": 8,
    "title": "Trade Secrets, Defend Trade Secrets Act (DTSA) & Corporate Asset Misappropriation",
    "goal": "Master trade secret jurisprudence under the Uniform Trade Secrets Act (UTSA) and federal Defend Trade Secrets Act (DTSA, 18 U.S.C. § 1836): enforce the 'Reasonable Measures' security invariant, structure restrictive non-compete covenants under evolving FTC and state guidelines, navigate the Inevitable Disclosure doctrine, audit DTSA ex parte civil seizure orders, and calculate unjust enrichment and reasonable royalty damages.",
    "minutes": 45,
    "recap": "In Days 6 and 7, we mastered public intellectual property: patents and trademarks, where rights are granted in exchange for public disclosure. Today in Day 8, we master the polar opposite realm of proprietary IP: Trade Secrets, where multi-billion-dollar enterprise value exists only so long as absolute confidentiality is preserved.",
    "parts": [
        {
            "title": "Trade Secret Invariants & The 'Reasonable Measures' Standard (DTSA / UTSA)",
            "say": [
                "In enterprise technology, finance, and industrial manufacturing, trade secrets represent the crown jewels of corporate valuation—encompassing proprietary source code, algorithmic trading strategies, chemical formulas, manufacturing tolerances, customer margin lists, and unannounced product roadmaps. Unlike patents, trade secrets require no government registration, pay no maintenance fees, and can endure indefinitely for centuries (such as the Coca-Cola syrup formula protected since 1886).",
                "Historically governed exclusively by state common law and the Uniform Trade Secrets Act (UTSA), Congress transformed trade secret enforcement in 2016 by enacting the Defend Trade Secrets Act (DTSA), codified in 18 U.S.C. §§ 1836 et seq. The DTSA created a federal private right of action, granting corporations direct access to federal courts with nationwide subpoena powers and powerful statutory remedies.",
                "Under both the DTSA (18 U.S.C. § 1839(3)) and the UTSA, information qualifies as a legally protectable trade secret only if two strict statutory prongs are satisfied: (1) The information derives independent economic value, actual or potential, from not being generally known to, and not being readily ascertainable through proper means by, another person who can obtain economic value from its disclosure or use; and (2) The owner has taken 'Reasonable Measures under the circumstances' to keep such information secret.",
                "The 'Reasonable Measures' prong is the fatal litigation graveyard for careless corporations. If a company treats proprietary information casually—leaving source code on public GitHub repositories, failing to encrypt employee laptops, granting unrestricted file access to all staff, or failing to mandate signed Non-Disclosure Agreements (NDAs)—the legal trade secret status evaporates instantaneously! Once trade secret status is lost, competitors and former employees can freely use the information without liability, because the law refuses to protect as a secret what the owner failed to safeguard.",
                "Corporate legal counsel must architect a multi-layered Trade Secret Protection Program (TSPP). This requires: (1) Mandatory, signed NDAs and Proprietary Information and Inventions Agreements (PIIA) with all employees and contractors, (2) Role-based access control (RBAC) and least-privilege permissions, (3) Prominent confidentiality markings on all sensitive documents, (4) Automated Data Loss Prevention (DLP) telemetry alerting on massive file downloads or USB exports, and (5) Formal exit interview protocols accompanied by forensic device wipe certifications."
            ],
            "example": "A robotics manufacturer discovers a departing senior engineer downloaded 10,000 CAD blueprints to a personal hard drive before joining a competitor. At trial, the competitor proves the blueprints were stored on an open internal network share accessible to 500 warehouse workers without passwords, and the company never required contractors to sign NDAs. The judge dismisses the lawsuit: because the company failed to take reasonable measures, the blueprints are not legally trade secrets.",
            "code": """# Simulation: Enterprise Trade Secret 'Reasonable Measures' Statutory Compliance Auditor
from typing import Dict, List

class TradeSecretIntegrityAuditor:
    MANDATORY_SAFEGUARDS = {
        'signed_ndas_with_all_recipients': 0.25,
        'role_based_access_controls_rbac': 0.20,
        'confidentiality_markings_enforced': 0.15,
        'network_dlp_and_usb_export_monitoring': 0.15,
        'formal_exit_interviews_and_device_wipe': 0.15,
        'restricted_physical_and_cloud_access': 0.10
    }

    @classmethod
    def audit_trade_secret_status(
        cls,
        asset_name: str,
        derives_independent_economic_value: bool,
        not_generally_known_or_readily_ascertainable: bool,
        safeguards_implemented: Dict[str, bool]
    ) -> dict:
        # Step 1: Economic Value Prongs
        has_economic_value = derives_independent_economic_value and not_generally_known_or_readily_ascertainable
        
        # Step 2: Reasonable Measures Score
        reasonable_measures_score = sum(
            cls.MANDATORY_SAFEGUARDS[k] for k, v in safeguards_implemented.items() if v
        ) * 100.0
        
        meets_reasonable_measures = reasonable_measures_score >= 70.0
        is_legal_trade_secret = has_economic_value and meets_reasonable_measures
        
        if not has_economic_value:
            verdict = 'NOT_A_TRADE_SECRET_LACKS_INDEPENDENT_ECONOMIC_VALUE'
            litigation_status = 'ACTION_DISMISSED_INFORMATION_PUBLICLY_KNOWN'
        elif not meets_reasonable_measures:
            verdict = 'TRADE_SECRET_STATUS_FORFEITED_INSUFFICIENT_SECURITY'
            litigation_status = 'ACTION_DISMISSED_FAILURE_TO_TAKE_REASONABLE_MEASURES'
        else:
            verdict = 'ENFORCEABLE_STATUTORY_TRADE_SECRET'
            litigation_status = 'DTSA_FEDERAL_JURISDICTION_CONFIRMED'

        return {
            'asset': asset_name,
            'economic_value_prong_satisfied': has_economic_value,
            'reasonable_measures_score_pct': round(reasonable_measures_score, 1),
            'statutory_status': verdict,
            'federal_litigation_viability': litigation_status
        }

# Audit 1: High-security algorithmic trading execution kernel
audit_quant = TradeSecretIntegrityAuditor.audit_trade_secret_status(
    asset_name='Proprietary HFT Alpha Kernel',
    derives_independent_economic_value=True,
    not_generally_known_or_readily_ascertainable=True,
    safeguards_implemented={
        'signed_ndas_with_all_recipients': True,
        'role_based_access_controls_rbac': True,
        'confidentiality_markings_enforced': True,
        'network_dlp_and_usb_export_monitoring': True,
        'formal_exit_interviews_and_device_wipe': True,
        'restricted_physical_and_cloud_access': True
    }
)

# Audit 2: Customer margin spreadsheet on shared corporate drive
audit_sloppy = TradeSecretIntegrityAuditor.audit_trade_secret_status(
    asset_name='Client Discount Margin Table',
    derives_independent_economic_value=True,
    not_generally_known_or_readily_ascertainable=True,
    safeguards_implemented={
        'signed_ndas_with_all_recipients': True,
        'role_based_access_controls_rbac': False, # Open folder
        'confidentiality_markings_enforced': False, # Unlabeled
        'network_dlp_and_usb_export_monitoring': False,
        'formal_exit_interviews_and_device_wipe': False,
        'restricted_physical_and_cloud_access': False
    }
)

print(f"Audit 1: [{audit_quant['asset']}] Score: {audit_quant['reasonable_measures_score_pct']}% -> {audit_quant['statutory_status']}")
print(f"  Litigation: {audit_quant['federal_litigation_viability']}")
print(f"Audit 2: [{audit_sloppy['asset']}] Score: {audit_sloppy['reasonable_measures_score_pct']}% -> {audit_sloppy['statutory_status']}")
print(f"  Litigation: {audit_sloppy['federal_litigation_viability']}")
""",
            "output": "Audit 1: [Proprietary HFT Alpha Kernel] Score: 100.0% -> ENFORCEABLE_STATUTORY_TRADE_SECRET\n  Litigation: DTSA_FEDERAL_JURISDICTION_CONFIRMED\nAudit 2: [Client Discount Margin Table] Score: 25.0% -> TRADE_SECRET_STATUS_FORFEITED_INSUFFICIENT_SECURITY\n  Litigation: ACTION_DISMISSED_FAILURE_TO_TAKE_REASONABLE_MEASURES",
            "codeNotes": [
                {"line": 4, "note": "Defines DTSA and UTSA trade secret qualification scoring engine"},
                {"line": 15, "note": "Evaluates statutory independent economic value and secrecy prongs"},
                {"line": 23, "note": "Calculates composite reasonable measures score based on NDAs, RBAC, and DLP"},
                {"line": 34, "note": "Emits federal subject matter jurisdiction verdict and dismissal risk profile"}
            ],
            "tryIt": "Enable role_based_access_controls_rbac and confidentiality_markings_enforced in Audit 2 to elevate the security score above 50%.",
            "check": {
                "question": "Under the Defend Trade Secrets Act (DTSA), what happens to a company's lawsuit if the judge finds that the company failed to take 'reasonable measures under the circumstances' to protect the secrecy of its formula?",
                "options": [
                    "The lawsuit must be dismissed because failure to take reasonable measures legally forfeits trade secret status, transforming the formula into unprotected public domain knowledge.",
                    "The judge converts the trade secret into a granted 20-year utility patent.",
                    "The defendant must pay a nominal $500 fine to the Department of Commerce.",
                    "The lawsuit is transferred to a private binding AAA arbitration panel."
                ],
                "answer": 0,
                "why": "Reasonable measures are an essential statutory element of a trade secret; if an owner fails to protect its own information, the law will not recognize any property right in it.",
                "answerIndex": 0,
                "explanation": "Reasonable measures are an essential statutory element of a trade secret; if an owner fails to protect its own information, the law will not recognize any property right in it."
            }
        },
        {
            "title": "Trade Secret Misappropriation, Improper Means & Whistleblower Immunity",
            "say": [
                "Under both the DTSA (18 U.S.C. § 1839(5)) and state UTSA enactments, 'Misappropriation' is defined with statutory precision across two primary branches: (1) Acquisition of a trade secret by a person who knows or has reason to know that the trade secret was acquired by 'improper means', or (2) Disclosure or use of a trade secret without express or implied consent by a person who used improper means to acquire it, or who acquired it under circumstances giving rise to a duty to maintain its secrecy.",
                "The statute specifically defines 'Improper Means' to include theft, bribery, misrepresentation, breach or inducement of a breach of a duty to maintain secrecy, or espionage through electronic or other means. Conversely, the law explicitly protects 'Proper Means': Independent Invention (two scientists independently discovering the same formulation) and Reverse Engineering (purchasing a lawfully marketed product and disassembling, analyzing, or decompiling it to discover its underlying mechanisms).",
                "Reverse engineering is completely lawful under trade secret law! If a competitor buys your commercial software and reverse engineers the unpatented algorithms through cleanroom disassembly without violating an enforceable terms of service contract, there is zero trade secret liability. This fundamental rule highlights why companies must patent structural architectures that can be reverse engineered, reserving trade secret protection for back-end SaaS algorithms, server-side weights, and internal chemical processing parameters that cannot be deduced from the finished product.",
                "A vital statutory safeguard embedded in the federal DTSA is the Whistleblower Immunity Provision under 18 U.S.C. § 1833(b). To protect corporate insiders reporting corporate fraud, environmental crimes, or securities violations, Congress enacted absolute civil and criminal immunity: an individual cannot be held liable under federal or state trade secret law for disclosing a trade secret in confidence to a federal, state, or local government official, or to an attorney, solely for the purpose of reporting or investigating a suspected violation of law.",
                "Crucially, the DTSA imposes a strict mandatory employer notice requirement: corporations MUST include a clear notice of whistleblower immunity in any contract with an employee, contractor, or consultant that governs the use of trade secrets. If a corporation fails to include this statutory whistleblower notice in its employee NDAs, the corporation is permanently barred from recovering exemplary (punitive) damages and attorney's fees in any subsequent trade secret litigation against that employee!"
            ],
            "example": "An automotive battery startup discovers a senior chemist emailed battery test logs to a private Gmail account. However, the chemist sent the logs directly to the EPA and SEC to report that the startup was falsifying safety crash test data. The startup sues the chemist for trade secret theft. The federal court dismisses the suit under DTSA Section 1833(b) whistleblower immunity and sanctions the startup.",
            "code": """# Simulation: Trade Secret Misappropriation Evaluator & DTSA Whistleblower Immunity Filter
class TradeSecretMisappropriationEngine:
    @staticmethod
    def evaluate_liability_and_whistleblower_shield(
        acquisition_method: str, # 'THEFT_ESPIONAGE', 'BREACH_OF_NDA', 'REVERSE_ENGINEERING', 'INDEPENDENT_INVENTION'
        disclosed_to_party: str, # 'COMMERCIAL_COMPETITOR', 'PUBLIC_BLOG', 'GOVERNMENT_REGULATOR_OR_ATTORNEY'
        purpose_of_disclosure: str, # 'COMMERCIAL_EXPLOITATION', 'REPORTING_SUSPECTED_CRIME', 'LEVERAGE_IN_SALARY_DISPUTE'
        employment_agreement_had_dtsa_notice: bool,
        actual_economic_harm_usd: float
    ) -> dict:
        is_proper_means = acquisition_method in ['REVERSE_ENGINEERING', 'INDEPENDENT_INVENTION']
        
        # DTSA Whistleblower Immunity Test (18 U.S.C. 1833(b))
        qualifies_for_whistleblower_immunity = (
            disclosed_to_party == 'GOVERNMENT_REGULATOR_OR_ATTORNEY' and
            purpose_of_disclosure == 'REPORTING_SUSPECTED_CRIME'
        )
        
        if qualifies_for_whistleblower_immunity:
            verdict = 'ABSOLUTE_WHISTLEBLOWER_IMMUNITY_SHIELD'
            actionable = False
            exemplary_damages = 0.0
            rationale = 'Protected under 18 U.S.C. 1833(b); disclosure made in confidence to government solely to report suspected legal violation.'
        elif is_proper_means:
            verdict = 'LAWFUL_ACQUISITION_PROPER_MEANS'
            actionable = False
            exemplary_damages = 0.0
            rationale = f'Acquired via {acquisition_method}; lawful under UTSA and DTSA.'
        else:
            verdict = 'UNLAWFUL_MISAPPROPRIATION_ESTABLISHED'
            actionable = True
            # Exemplary damages up to 2x actual harm under 18 U.S.C. 1836(b)(3)(C)
            # BUT barred if employer failed to include mandatory DTSA notice in contract!
            if employment_agreement_had_dtsa_notice:
                exemplary_damages = actual_economic_harm_usd * 2.0
                exemplary_status = 'MAX_PUNITIVE_DAMAGES_AVAILABLE_2X'
            else:
                exemplary_damages = 0.0
                exemplary_status = 'PUNITIVE_DAMAGES_STATUTORILY_FORFEITED_NO_DTSA_NOTICE'
            rationale = f'Unlawful misappropriation via {acquisition_method}; {exemplary_status}.'

        return {
            'misappropriation_actionable': actionable,
            'statutory_verdict': verdict,
            'whistleblower_immunity_applied': qualifies_for_whistleblower_immunity,
            'base_actual_damages_usd': actual_economic_harm_usd if actionable else 0.0,
            'exemplary_punitive_damages_usd': exemplary_damages,
            'employer_statutory_notice_compliant': employment_agreement_had_dtsa_notice,
            'legal_rationale': rationale
        }

# Case 1: Departing employee steals source code and gives to competitor; NDA lacked DTSA notice
case_theft_no_notice = TradeSecretMisappropriationEngine.evaluate_liability_and_whistleblower_shield(
    acquisition_method='BREACH_OF_NDA',
    disclosed_to_party='COMMERCIAL_COMPETITOR',
    purpose_of_disclosure='COMMERCIAL_EXPLOITATION',
    employment_agreement_had_dtsa_notice=False,
    actual_economic_harm_usd=5000000.0
)

# Case 2: Employee discloses emissions testing code to EPA to report environmental fraud
case_whistleblower = TradeSecretMisappropriationEngine.evaluate_liability_and_whistleblower_shield(
    acquisition_method='THEFT_ESPIONAGE',
    disclosed_to_party='GOVERNMENT_REGULATOR_OR_ATTORNEY',
    purpose_of_disclosure='REPORTING_SUSPECTED_CRIME',
    employment_agreement_had_dtsa_notice=True,
    actual_economic_harm_usd=10000000.0
)

print(f"[Case 1 Theft] Verdict: {case_theft_no_notice['statutory_verdict']}")
print(f"  Base Damages: ${case_theft_no_notice['base_actual_damages_usd']/1e6:.1f}M | Punitive: ${case_theft_no_notice['exemplary_punitive_damages_usd']/1e6:.1f}M (Notice: {case_theft_no_notice['employer_statutory_notice_compliant']})")
print(f"[Case 2 Whistleblower] Verdict: {case_whistleblower['statutory_verdict']} (Immunity: {case_whistleblower['whistleblower_immunity_applied']})")
print(f"  Rationale: {case_whistleblower['legal_rationale']}")
""",
            "output": "[Case 1 Theft] Verdict: UNLAWFUL_MISAPPROPRIATION_ESTABLISHED\n  Base Damages: $5.0M | Punitive: $0.0M (Notice: False)\n[Case 2 Whistleblower] Verdict: ABSOLUTE_WHISTLEBLOWER_IMMUNITY_SHIELD (Immunity: True)\n  Rationale: Protected under 18 U.S.C. 1833(b); disclosure made in confidence to government solely to report suspected legal violation.",
            "codeNotes": [
                {"line": 3, "note": "Implements trade secret misappropriation evaluation under 18 U.S.C. 1839(5)"},
                {"line": 13, "note": "Enforces absolute federal whistleblower immunity shield under 18 U.S.C. 1833(b)"},
                {"line": 28, "note": "Penalizes employers who omit mandatory DTSA statutory whistleblower notice from NDAs"},
                {"line": 30, "note": "Computes statutory exemplary damages up to 2x actual harm for bad-faith theft"}
            ],
            "tryIt": "Set employment_agreement_had_dtsa_notice to True in Case 1 to unlock $10M in exemplary punitive damages.",
            "check": {
                "question": "What is the severe legal consequence if an employer fails to include the mandatory DTSA Whistleblower Notice in an employment agreement or NDA governing trade secrets?",
                "options": [
                    "The employer is statutorily barred from recovering exemplary (punitive) damages and attorney's fees in a subsequent federal DTSA lawsuit against that employee.",
                    "The employer's corporate charter is automatically revoked by the Secretary of State.",
                    "The employee becomes the legal co-owner of all corporate patents.",
                    "The employer must pay triple wages to the employee for the duration of their tenure."
                ],
                "answer": 0,
                "why": "18 U.S.C. § 1833(b)(3) explicitly strips employers of the right to recover exemplary damages or attorney's fees if they fail to provide the required statutory notice of whistleblower immunity.",
                "answerIndex": 0,
                "explanation": "18 U.S.C. § 1833(b)(3) explicitly strips employers of the right to recover exemplary damages or attorney's fees if they fail to provide the required statutory notice of whistleblower immunity."
            }
        },
        {
            "title": "Non-Compete Agreements, The Inevitable Disclosure Doctrine & Restrictive Covenants",
            "say": [
                "For decades, corporate employers sought to safeguard trade secrets by pairing non-disclosure agreements with aggressive Employee Non-Compete Agreements—contractual clauses prohibiting departing employees from working for a competing business within a specified geographic territory for a defined duration (e.g., 1 to 2 years).",
                "However, non-compete agreements face unprecedented legal and regulatory hostility. Under common law, courts refuse to enforce restrictive covenants unless they are reasonably tailored in duration, geographic scope, and scope of proscribed activity, protecting a legitimate business interest without imposing undue hardship on the worker or injuring the public interest. States like California (Cal. Bus. & Prof. Code § 16600), Minnesota, and Oklahoma categorically ban employee non-competes as void against public policy.",
                "Furthermore, the Federal Trade Commission (FTC) issued a historic nationwide Non-Compete Clause Rule classifying non-compete agreements as unfair methods of competition under Section 5 of the FTC Act. Even where federal rules face judicial challenges, the clear regulatory trend requires corporations to abandon broad non-compete bans and rely on narrower, highly enforceable covenants: Non-Disclosure Agreements (protecting trade secrets), Non-Solicitation of Customers (prohibiting raiding client accounts), and Non-Solicitation of Employees (prohibiting poaching engineering teams).",
                "In jurisdictions where non-competes are unenforceable or absent, employers frequently petition courts under the controversial 'Inevitable Disclosure Doctrine', established in PepsiCo, Inc. v. Redmond (7th Cir. 1995). Under this doctrine, a court may enjoin a former employee from taking a new job at a direct competitor if the court finds that the employee's new role is so identical that they will 'inevitably rely upon and disclose' the former employer's trade secrets, even in the absence of an explicit non-compete agreement.",
                "However, the Inevitable Disclosure doctrine is rejected by many states (including California, New York, and Texas) because it operates as an involuntary, back-door non-compete that restricts employee mobility. Moreover, Section 1836(b)(3)(A) of the federal DTSA explicitly limits injunctions against employment: an injunction cannot prevent an individual from entering an employment relationship unless there is independent evidence of threatened misappropriation, not merely based on information the person knows."
            ],
            "example": "A senior VP of sports beverage marketing at PepsiCo attempts to leave and become VP of field operations at Gatorade (Quaker Oats). In PepsiCo v. Redmond, the Seventh Circuit blocked the move under the Inevitable Disclosure doctrine because the VP possessed PepsiCo's confidential annual marketing playbook, and he could not make tactical marketing decisions at Gatorade without inevitably using PepsiCo's pricing and distribution secrets.",
            "code": """# Simulation: Restrictive Covenant Enforceability & Inevitable Disclosure Risk Engine
class RestrictiveCovenantAuditor:
    STATE_POLICIES = {
        'CALIFORNIA': {'allows_non_competes': False, 'recognizes_inevitable_disclosure': False, 'allows_customer_nonsolicit': False},
        'NEW_YORK': {'allows_non_competes': True, 'recognizes_inevitable_disclosure': False, 'allows_customer_nonsolicit': True},
        'ILLINOIS': {'allows_non_competes': True, 'recognizes_inevitable_disclosure': True, 'allows_customer_nonsolicit': True},
        'TEXAS': {'allows_non_competes': True, 'recognizes_inevitable_disclosure': False, 'allows_customer_nonsolicit': True},
        'DELAWARE': {'allows_non_competes': True, 'recognizes_inevitable_disclosure': True, 'allows_customer_nonsolicit': True}
    }

    @classmethod
    def evaluate_covenant_and_mobility(
        cls,
        governing_state: str,
        duration_months: int,
        geographic_scope_miles: float,
        employee_compensation_tier: str, # 'EXECUTIVE_C_SUITE', 'SENIOR_ENGINEER', 'LOW_WAGE_HOURLY'
        has_direct_evidence_of_actual_theft: bool
    ) -> dict:
        state_rules = cls.STATE_POLICIES.get(governing_state.upper(), cls.STATE_POLICIES['DELAWARE'])
        
        # Reasonableness checks
        duration_reasonable = duration_months <= 12
        geography_reasonable = geographic_scope_miles <= 50.0 or geographic_scope_miles == 0 # 0 = tailored customer-based
        is_exempt_hourly = employee_compensation_tier == 'LOW_WAGE_HOURLY'
        
        if not state_rules['allows_non_competes'] or is_exempt_hourly:
            non_compete_valid = False
            nc_status = 'VOID_AND_UNENFORCEABLE_PER_SE'
        elif duration_reasonable and geography_reasonable and employee_compensation_tier == 'EXECUTIVE_C_SUITE':
            non_compete_valid = True
            nc_status = 'ENFORCEABLE_REASONABLE_RESTRICTIVE_COVENANT'
        else:
            non_compete_valid = False
            nc_status = 'HIGH_JUDICIAL_BLUE_PENCIL_OR_STRIKE_DOWN_RISK'
            
        # Inevitable Disclosure Assessment
        can_invoke_inevitable_disclosure = state_rules['recognizes_inevitable_disclosure'] and not has_direct_evidence_of_actual_theft
        
        return {
            'jurisdiction': governing_state.upper(),
            'non_compete_enforceable': non_compete_valid,
            'non_compete_legal_status': nc_status,
            'customer_nonsolicitation_allowed': state_rules['allows_customer_nonsolicit'],
            'inevitable_disclosure_available': can_invoke_inevitable_disclosure,
            'dtsa_employment_injunction_barred': not has_direct_evidence_of_actual_theft
        }

# Scenario 1: California tech employee
eval_california = RestrictiveCovenantAuditor.evaluate_covenant_and_mobility(
    governing_state='CALIFORNIA',
    duration_months=12,
    geographic_scope_miles=25.0,
    employee_compensation_tier='SENIOR_ENGINEER',
    has_direct_evidence_of_actual_theft=False
)

# Scenario 2: Illinois executive under PepsiCo jurisdiction
eval_illinois = RestrictiveCovenantAuditor.evaluate_covenant_and_mobility(
    governing_state='ILLINOIS',
    duration_months=12,
    geographic_scope_miles=50.0,
    employee_compensation_tier='EXECUTIVE_C_SUITE',
    has_direct_evidence_of_actual_theft=False
)

print(f"[California] Non-Compete: {eval_california['non_compete_legal_status']} | Inevitable Disclosure: {eval_california['inevitable_disclosure_available']}")
print(f"[Illinois] Non-Compete: {eval_illinois['non_compete_legal_status']} | Inevitable Disclosure: {eval_illinois['inevitable_disclosure_available']}")
""",
            "output": "[California] Non-Compete: VOID_AND_UNENFORCEABLE_PER_SE | Inevitable Disclosure: False\n[Illinois] Non-Compete: ENFORCEABLE_REASONABLE_RESTRICTIVE_COVENANT | Inevitable Disclosure: True",
            "codeNotes": [
                {"line": 3, "note": "Models state-by-state variations in non-compete enforceability and trade secret doctrine"},
                {"line": 19, "note": "Enforces strict statutory bans on non-competes in California and for hourly wage employees"},
                {"line": 28, "note": "Evaluates PepsiCo v. Redmond Inevitable Disclosure doctrine availability"},
                {"line": 34, "note": "Applies federal DTSA statutory limitations on employee mobility injunctions"}
            ],
            "tryIt": "Set governing_state to 'NEW_YORK' to observe non-competes permitted under strict scrutiny while Inevitable Disclosure is barred.",
            "check": {
                "question": "What was the landmark legal precedent established in PepsiCo, Inc. v. Redmond (1995) regarding the Inevitable Disclosure Doctrine?",
                "options": [
                    "A court can enjoin a departing employee from working for a direct competitor if the employee's new position will inevitably cause them to rely upon and disclose the former employer's trade secrets, even without proof of actual past theft.",
                    "All commercial beverage formulas must be registered with the United States Patent Office.",
                    "Employees who sign NDAs forfeit their right to file for unemployment benefits.",
                    "Non-compete agreements are automatically extended by 10 years if an employee joins a Fortune 500 company."
                ],
                "answer": 0,
                "why": "PepsiCo v. Redmond established that when a competitor hires an executive with intimate knowledge of marketing secrets into an identical role, disclosure is inevitable, justifying an injunction.",
                "answerIndex": 0,
                "explanation": "PepsiCo v. Redmond established that when a competitor hires an executive with intimate knowledge of marketing secrets into an identical role, disclosure is inevitable, justifying an injunction."
            }
        },
        {
            "title": "DTSA Civil Seizure Orders & Trade Secret Damages Architecture",
            "say": [
                "When a corporate trade secret is stolen by an espionage operative or disgruntled employee about to flee the country or transmit proprietary algorithms to an offshore server, standard civil litigation timelines—waiting weeks for a preliminary injunction hearing—are tragically inadequate. Once a trade secret is uploaded to an unmonitored foreign server, it is permanently compromised, destroying hundreds of millions of dollars in enterprise value.",
                "To confront this catastrophic threat, the federal DTSA introduced the most aggressive equitable weapon in American civil jurisprudence: the Ex Parte Civil Seizure Order under 18 U.S.C. § 1836(b)(2). Upon an ex parte motion (meaning without prior notice to the accused thief!), a federal judge can direct federal US Marshals to physically raid the defendant's premises, seize servers, laptops, USB drives, and cloud backups, and lock them in a court-supervised forensic vault.",
                "Because of the severe Fourth Amendment due process implications, Congress restricted civil seizures to 'extraordinary circumstances'. The plaintiff must satisfy eight rigorous statutory criteria: (1) Preliminary injunction orders under Rule 65 would be inadequate because the defendant would evade, destroy, or hide the data; (2) Immediate and irreparable injury will occur; (3) The harm to the applicant outweighs the harm to the legitimate interests of the person against whom seizure is ordered; (4) The applicant is likely to succeed on the merits; (5) The target has actual possession of the trade secret; (6) The application describes the property with particularity; (7) The target would destroy or conceal the property if notified; and (8) The applicant has not publicized the requested seizure.",
                "Furthermore, the applicant must post a substantial cash bond. If a corporation abuses the civil seizure process or executes a wrongful seizure against an innocent competitor, Section 1836(b)(2)(G) exposes the applicant to massive civil damages, including punitive damages and attorney's fees.",
                "If the trade secret has already been used commercially, damages under both the DTSA and UTSA are calculated across three cumulative measures: (1) Actual loss caused by the misappropriation (e.g., lost corporate revenues), (2) Unjust enrichment caused by the misappropriation that is not taken into account in computing actual loss (e.g., the defendant's illicit profits), or (3) In lieu of damages measured by any other methods, a Reasonable Royalty for the unauthorized disclosure or use. If willful and malicious misappropriation is proven, the court may award exemplary damages up to two times the compensatory damages award."
            ],
            "example": "A departing semiconductor engineer downloads proprietary EUV lithography mask designs and books a one-way flight to Shenzhen. Before the flight departs, general counsel files an emergency sealed DTSA application in federal court, posting a $2M cash bond. The judge issues an ex parte civil seizure order. US Marshals intercept the engineer at San Francisco International Airport, seizing the encrypted hard drives before the plane takes off.",
            "code": """# Simulation: DTSA Ex Parte Civil Seizure Statutory Qualifier & Damages Waterfall Engine
from typing import Dict, List

class DTSACivilSeizureAndDamagesEngine:
    @staticmethod
    def evaluate_ex_parte_seizure_qualifiers(
        applicant_posted_cash_bond: bool,
        rule_65_injunction_inadequate_flight_risk: bool,
        irreparable_harm_imminent: bool,
        property_described_with_particularity: bool,
        risk_defendant_destroys_evidence_if_notified: bool,
        applicant_kept_seizure_confidential: bool
    ) -> dict:
        # All statutory prongs of 18 U.S.C. 1836(b)(2)(A)(ii) must be met
        prongs_met = [
            applicant_posted_cash_bond,
            rule_65_injunction_inadequate_flight_risk,
            irreparable_harm_imminent,
            property_described_with_particularity,
            risk_defendant_destroys_evidence_if_notified,
            applicant_kept_seizure_confidential
        ]
        
        all_criteria_satisfied = all(prongs_met)
        score_pct = (sum(prongs_met) / len(prongs_met)) * 100.0
        
        return {
            'qualifies_for_ex_parte_us_marshal_raid': all_criteria_satisfied,
            'statutory_prongs_satisfied_pct': round(score_pct, 1),
            'judicial_ruling': 'EX_PARTE_SEIZURE_ORDER_GRANTED_TO_US_MARSHALS' if all_criteria_satisfied else 'SEIZURE_DENIED_PROCEED_VIA_STANDARD_PRELIMINARY_INJUNCTION',
            'mandatory_post_seizure_hearing_window_days': 7 if all_criteria_satisfied else 0
        }

    @staticmethod
    def calculate_misappropriation_damages(
        plaintiff_lost_sales_revenue_usd: float,
        plaintiff_profit_margin_pct: float,
        defendant_illicit_commercial_profits_usd: float,
        rd_cost_avoided_by_defendant_usd: float,
        willful_and_malicious_proven: bool
    ) -> dict:
        # Measure 1: Actual loss to plaintiff
        actual_loss = plaintiff_lost_sales_revenue_usd * plaintiff_profit_margin_pct
        
        # Measure 2: Unjust enrichment not duplicative of actual loss
        # Defendant's illicit profits + developmental cost avoided
        unjust_enrichment = max(0.0, defendant_illicit_commercial_profits_usd - actual_loss) + rd_cost_avoided_by_defendant_usd
        
        total_compensatory_damages = actual_loss + unjust_enrichment
        
        # Exemplary punitive damages up to 2x under 18 U.S.C. 1836(b)(3)(C)
        punitive_multiplier = 2.0 if willful_and_malicious_proven else 0.0
        punitive_damages = total_compensatory_damages * punitive_multiplier
        total_judgment = total_compensatory_damages + punitive_damages

        return {
            'plaintiff_actual_loss_usd': round(actual_loss, 2),
            'defendant_unjust_enrichment_usd': round(unjust_enrichment, 2),
            'total_compensatory_damages_usd': round(total_compensatory_damages, 2),
            'exemplary_punitive_damages_usd': round(punitive_damages, 2),
            'total_judgment_exposure_usd': round(total_judgment, 2),
            'willful_malice_established': willful_and_malicious_proven
        }

seizure_audit = DTSACivilSeizureAndDamagesEngine.evaluate_ex_parte_seizure_qualifiers(
    applicant_posted_cash_bond=True,
    rule_65_injunction_inadequate_flight_risk=True,
    irreparable_harm_imminent=True,
    property_described_with_particularity=True,
    risk_defendant_destroys_evidence_if_notified=True,
    applicant_kept_seizure_confidential=True
)

damages_audit = DTSACivilSeizureAndDamagesEngine.calculate_misappropriation_damages(
    plaintiff_lost_sales_revenue_usd=20000000.0,
    plaintiff_profit_margin_pct=0.40,
    defendant_illicit_commercial_profits_usd=12000000.0,
    rd_cost_avoided_by_defendant_usd=15000000.0,
    willful_and_malicious_proven=True
)

print(f"Seizure Ruling: [{seizure_audit['judicial_ruling']}] (Score: {seizure_audit['statutory_prongs_satisfied_pct']}%)")
print(f"  US Marshal Raid Authorized: {seizure_audit['qualifies_for_ex_parte_us_marshal_raid']} | Hearing Window: {seizure_audit['mandatory_post_seizure_hearing_window_days']} Days")
print(f"Damages: Compensatory: ${damages_audit['total_compensatory_damages_usd']/1e6:.1f}M + Punitive: ${damages_audit['exemplary_punitive_damages_usd']/1e6:.1f}M -> Total Judgment: ${damages_audit['total_judgment_exposure_usd']/1e6:.1f}M")
""",
            "output": "Seizure Ruling: [EX_PARTE_SEIZURE_ORDER_GRANTED_TO_US_MARSHALS] (Score: 100.0%)\n  US Marshal Raid Authorized: True | Hearing Window: 7 Days\nDamages: Compensatory: $27.0M + Punitive: $54.0M -> Total Judgment: $81.0M",
            "codeNotes": [
                {"line": 4, "note": "Implements federal DTSA 18 U.S.C. 1836(b)(2) ex parte civil seizure qualifying tests"},
                {"line": 23, "note": "Calculates trade secret damages across actual loss, unjust enrichment, and avoided R&D costs"},
                {"line": 32, "note": "Applies statutory 2x exemplary damages cap for willful and malicious theft under the DTSA"},
                {"line": 45, "note": "Demonstrates emergency federal law enforcement physical seizure paired with multi-million damages"}
            ],
            "tryIt": "Set willful_and_malicious_proven to False in damages_audit to observe the $54M punitive multiplier collapse to zero.",
            "check": {
                "question": "Under what exceptional circumstances does the federal Defend Trade Secrets Act (DTSA) authorize a federal judge to issue an Ex Parte Civil Seizure Order executed by US Marshals?",
                "options": [
                    "Only in extraordinary circumstances where standard preliminary injunctions would be inadequate because the defendant would destroy, move, or hide the stolen trade secret if given advance notice.",
                    "Whenever an employee resigns with less than two weeks of advance notice.",
                    "Whenever a corporation files for Chapter 7 bankruptcy liquidation.",
                    "Only if the trade secret involves cryptographic currencies valued over $100 million."
                ],
                "answer": 0,
                "why": "18 U.S.C. § 1836(b)(2) authorizes ex parte civil seizures only upon clear proof that notifying the defendant would cause the immediate destruction or concealment of the stolen proprietary property.",
                "answerIndex": 0,
                "explanation": "18 U.S.C. § 1836(b)(2) authorizes ex parte civil seizures only upon clear proof that notifying the defendant would cause the immediate destruction or concealment of the stolen proprietary property."
            }
        },
        {
            "title": "Industrial Espionage, The Economic Espionage Act (EEA) & Criminal Trade Secret Enforcement",
            "say": [
                "While trade secret misappropriation is routinely litigated as a civil dispute between commercial enterprises, egregious trade secret theft transcends private tort law: it constitutes a serious federal felony under the Economic Espionage Act of 1996 (EEA), codified in 18 U.S.C. §§ 1831–1839.",
                "Enacted by Congress to safeguard American technological leadership and national economic security, the EEA establishes two distinct federal criminal offenses: Section 1831 criminalizes Foreign Economic Espionage—knowingly stealing, unauthorized copying, or possessing a trade secret with intent or knowledge that the offense will benefit any foreign government, foreign instrumentality, or foreign agent. Section 1832 criminalizes Commercial Trade Secret Theft—stealing trade secrets related to a product or service used in or intended for use in interstate or foreign commerce, intending to convert the trade secret to the economic benefit of anyone other than the rightful owner.",
                "The criminal statutory penalties under the EEA are severe and punitive: individuals convicted of Section 1831 foreign economic espionage face up to 15 years in federal prison and criminal fines up to $5,000,000. For corporations and organizations, the statutory fine under Section 1831 is the greater of $10,000,000 or three times the value of the stolen trade secret to the organization, including research and development costs avoided. For domestic commercial trade secret theft under Section 1832, individuals face up to 10 years imprisonment, while corporations face fines up to the greater of $5,000,000 or three times the value of the trade secret.",
                "For corporate general counsel, uncovering a suspected industrial espionage operation requires delicate legal choreography. When internal digital forensics reveal that an employee downloaded gigabytes of proprietary source code to personal encrypted storage devices or scheduled transfers to offshore foreign IP addresses, counsel must decide whether to pursue private civil litigation under the DTSA, make an immediate criminal referral to the Federal Bureau of Investigation (FBI) Cyber Division and the US Attorney's Office, or orchestrate parallel dual-track proceedings.",
                "Making a criminal referral unlocks vast federal law enforcement powers unavailable in civil litigation: FBI search warrants, Title III wiretaps, border customs interdictions, and INTERPOL red notices. However, corporate counsel must manage critical tradeoffs: federal prosecutors will routinely seek a stay of civil discovery under Federal Rule of Civil Procedure 26 to protect the integrity of the grand jury investigation, temporarily freezing the corporation's civil damages litigation while the criminal indictment proceeds."
            ],
            "example": "A senior research scientist at a US aerospace defense contractor downloads 5,000 thermal coating specifications for hypersonic missiles onto an encrypted micro-SD card and prepares to board a flight to a foreign nation. The general counsel immediately alerts the FBI Counterintelligence Division. Federal agents arrest the scientist at the boarding gate under 18 U.S.C. § 1831 for foreign economic espionage. The scientist is convicted and sentenced to 12 years in federal prison, and the foreign shell company is fined $15 million.",
            "code": """# Simulation: Economic Espionage Act (18 U.S.C. 1831-1832) Criminal Liability & Penalty Matrix
class EconomicEspionageAuditor:
    @staticmethod
    def audit_criminal_trade_secret_exposure(
        theft_method: str,
        benefits_foreign_government_or_agent: bool,
        intended_commercial_interstate_commerce: bool,
        trade_secret_estimated_value_usd: float,
        organization_involved: bool
    ) -> dict:
        is_foreign_espionage = benefits_foreign_government_or_agent
        is_commercial_theft = intended_commercial_interstate_commerce and not benefits_foreign_government_or_agent
        
        if is_foreign_espionage:
            statutory_section = "18 U.S.C. § 1831 (Foreign Economic Espionage)"
            max_prison_years = 15
            max_individual_fine = 5000000.0
            max_org_fine = max(10000000.0, trade_secret_estimated_value_usd * 3.0) if organization_involved else 0.0
            verdict = "CRIMINAL_FOREIGN_ECONOMIC_ESPIONAGE_FELONY"
        elif is_commercial_theft:
            statutory_section = "18 U.S.C. § 1832 (Theft of Commercial Trade Secrets)"
            max_prison_years = 10
            max_individual_fine = 250000.0
            max_org_fine = max(5000000.0, trade_secret_estimated_value_usd * 3.0) if organization_involved else 0.0
            verdict = "CRIMINAL_COMMERCIAL_TRADE_SECRET_THEFT_FELONY"
        else:
            statutory_section = "NONE"
            max_prison_years = 0
            max_individual_fine = 0.0
            max_org_fine = 0.0
            verdict = "CIVIL_DISPUTE_ONLY_NO_CRIMINAL_EEA_NEXUS"

        return {
            'applicable_statute': statutory_section,
            'statutory_charge': verdict,
            'max_prison_sentence_years': max_prison_years,
            'individual_fine_limit_usd': max_individual_fine,
            'organizational_fine_limit_usd': max_org_fine,
            'mandatory_fbi_referral_recommended': is_foreign_espionage or (is_commercial_theft and trade_secret_estimated_value_usd >= 1000000.0)
        }

# Scenario 1: State-sponsored espionage targeting quantum computing
case_state = EconomicEspionageAuditor.audit_criminal_trade_secret_exposure(
    theft_method='ENCRYPTED_USB_EXFILTRATION',
    benefits_foreign_government_or_agent=True,
    intended_commercial_interstate_commerce=True,
    trade_secret_estimated_value_usd=50000000.0, # $50M secret
    organization_involved=True
)

# Scenario 2: Domestic employee taking customer database to local competitor
case_domestic = EconomicEspionageAuditor.audit_criminal_trade_secret_exposure(
    theft_method='GMAIL_ATTACHMENT_EXPORT',
    benefits_foreign_government_or_agent=False,
    intended_commercial_interstate_commerce=True,
    trade_secret_estimated_value_usd=2500000.0, # $2.5M secret
    organization_involved=True
)

print(f"Case 1 (Foreign): [{case_state['applicable_statute']}] -> {case_state['statutory_charge']}")
print(f"  Max Prison: {case_state['max_prison_sentence_years']} Yrs | Org Fine: ${case_state['organizational_fine_limit_usd']/1e6:.1f}M | FBI Referral: {case_state['mandatory_fbi_referral_recommended']}")
print(f"Case 2 (Domestic): [{case_domestic['applicable_statute']}] -> {case_domestic['statutory_charge']}")
print(f"  Max Prison: {case_domestic['max_prison_sentence_years']} Yrs | Org Fine: ${case_domestic['organizational_fine_limit_usd']/1e6:.1f}M | FBI Referral: {case_domestic['mandatory_fbi_referral_recommended']}")
""",
            "output": "Case 1 (Foreign): [18 U.S.C. § 1831 (Foreign Economic Espionage)] -> CRIMINAL_FOREIGN_ECONOMIC_ESPIONAGE_FELONY\n  Max Prison: 15 Yrs | Org Fine: $150.0M | FBI Referral: True\nCase 2 (Domestic): [18 U.S.C. § 1832 (Theft of Commercial Trade Secrets)] -> CRIMINAL_COMMERCIAL_TRADE_SECRET_THEFT_FELONY\n  Max Prison: 10 Yrs | Org Fine: $7.5M | FBI Referral: True",
            "codeNotes": [
                {"line": 3, "note": "Implements Economic Espionage Act (18 U.S.C. Sections 1831-1832) criminal liability matrix"},
                {"line": 13, "note": "Distinguishes Section 1831 foreign state-sponsored espionage from Section 1832 domestic commercial theft"},
                {"line": 16, "note": "Computes statutory maximum fines: greater of statutory floor or 3x value of the stolen secret"},
                {"line": 28, "note": "Authorizes immediate criminal referral to FBI Counterintelligence and Cyber Divisions"}
            ],
            "tryIt": "Set benefits_foreign_government_or_agent to False in Case 1 to observe the statutory classification transition to Section 1832 commercial theft.",
            "check": {
                "question": "Under the Economic Espionage Act of 1996, what is the critical legal factor that distinguishes Section 1831 (Foreign Economic Espionage) from Section 1832 (Commercial Trade Secret Theft)?",
                "options": [
                    "Section 1831 requires intent or knowledge that the offense will benefit any foreign government, foreign instrumentality, or foreign agent, carrying higher prison terms (up to 15 years) and organizational fines up to $10M or 3x the secret's value.",
                    "Section 1831 applies only to trade secret thefts involving physical paper files.",
                    "Section 1832 applies exclusively to non-profit university laboratories.",
                    "Section 1831 requires personal approval from the Chief Justice of the United States."
                ],
                "answer": 0,
                "why": "Section 1831 specifically penalizes state-sponsored economic espionage intended to benefit foreign governments, whereas Section 1832 addresses commercial thefts between private business competitors.",
                "answerIndex": 0,
                "explanation": "Section 1831 specifically penalizes state-sponsored economic espionage intended to benefit foreign governments, whereas Section 1832 addresses commercial thefts between private business competitors."
            }
        }
    ],
    "summary": [
        "Trade Secret Statutory Invariants: Protects information deriving independent economic value from secrecy, provided the owner exercises 'Reasonable Measures under the circumstances' to preserve confidentiality.",
        "Misappropriation & Proper Means: Prohibits acquisition via theft, bribery, or breach of duty; explicitly protects independent invention and reverse engineering as lawful commercial methods.",
        "DTSA Whistleblower Immunity Shield: 18 U.S.C. § 1833(b) grants absolute immunity for confidential disclosures to government regulators reporting crimes; requires mandatory employer notice in NDAs to preserve punitive damages.",
        "Restrictive Covenants & Inevitable Disclosure: Non-competes face heavy statutory bans (e.g. California); PepsiCo inevitable disclosure allows injunctions only in select states and is heavily constrained by federal DTSA rules.",
        "Ex Parte Civil Seizure & Damages: 18 U.S.C. § 1836(b)(2) authorizes US Marshals to seize stolen servers without prior notice; damages incorporate actual loss, unjust enrichment, and up to 2x exemplary damages."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 2 Capstone Step 3: Enterprise Trade Secret Protection Program & DTSA Forensic Defense Architecture",
        "steps": [
            "Audit corporate information assets and enforce the statutory 'Reasonable Measures' security baseline across RBAC and DLP telemetry.",
            "Revise employee and contractor NDAs to embed mandatory 18 U.S.C. § 1833(b) whistleblower immunity notices, preserving exemplary damages.",
            "Model employee departure risks under state restrictive covenant laws and evaluate DTSA employment injunction constraints.",
            "Formulate an emergency rapid-response Ex Parte Civil Seizure filing protocol and calculate cumulative misappropriation damages exposure."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_08)
    print(f"B.Com Corporate Law Day 8 Total Words: {total}")
    for i, p in enumerate(DAY_08['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
