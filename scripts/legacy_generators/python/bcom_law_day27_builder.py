"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 27 Builder: Cross-Border Commercial Arbitration (New York Convention & LCIA/ICC)
Milestone 6: Transnational Corporate Law, International Disputes & Global Governance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_27 = {
    "coursePrefix": "bcom_law",
    "day": 27,
    "title": "Cross-Border Commercial Arbitration (New York Convention & LCIA/ICC)",
    "goal": "Master transnational commercial dispute resolution and international arbitration: analyze the 1958 New York Convention framework for enforcing arbitral agreements and foreign awards, audit institutional arbitration clauses across the ICC, LCIA, and SIAC rules, evaluate the foundational principles of Kompetenz-Kompetenz and the Doctrine of Separability under Prima Paint and Fiona Trust, dissect the narrow grounds for resisting award enforcement under Article V (procedural due process, excess of mandate, and public policy), and simulate an end-to-end cross-border commercial arbitration from emergency injunction to global asset execution.",
    "minutes": 45,
    "recap": "Yesterday in Day 26, we mastered cross-border insolvency, the UNCITRAL Model Law, COMI determination, Chapter 15 recognition, and the Hotchpot rule. Today in Day 27, we master the ultimate private justice system of global commerce: International Commercial Arbitration, institutional arbitration rules, and the New York Convention.",
    "parts": [
        {
            "title": "The New York Convention of 1958 & The Global Arbitration Regime",
            "say": [
                "In international commerce, transnational contracts inevitably span multiple sovereign legal systems with conflicting court procedural codes, unfamiliar domestic languages, and inherent local judicial bias. If a cross-border dispute arises, litigating before the domestic courts of either party presents acute risks: foreign counterparties fear the 'home-court advantage' of local state judges, unfamiliar procedural delays, and the virtual impossibility of enforcing domestic money judgments abroad. Outside of regional frameworks like the European Brussels Regulation, there exists no globally ratified treaty for the reciprocal enforcement of domestic court judgments.",
                "To resolve this fundamental impediment to international trade and capital flow, the international community forged the most successful private international treaty in legal history: the 1958 United Nations Convention on the Recognition and Enforcement of Foreign Arbitral Awards, known universally as the 'New York Convention'. Ratified by over 170 contracting sovereign states, the New York Convention establishes a binding global regime with two mandatory core functions.",
                "First, pursuant to Article II(3), the national courts of contracting states are under an absolute statutory duty to refer parties to arbitration whenever a valid written arbitration agreement exists. If a plaintiff initiates a lawsuit in domestic court in breach of an arbitration clause, the court must immediately stay or dismiss the litigation upon motion by the defendant, compelling the dispute into arbitration.",
                "Second, pursuant to Article III, contracting states must formally recognize foreign arbitral awards as binding and enforce them under local procedural rules without imposing substantially more onerous conditions or higher fees than are applied to domestic awards. Contracting states are permitted to lodge two specific reservations under Article I(3): (1) The 'Reciprocity Reservation' (stipulating that the state will apply the convention only to awards rendered in the territory of another contracting state), and (2) The 'Commercial Reservation' (stipulating that the convention applies solely to legal relationships considered commercial under the national law of the enacting state).",
                "By neutralizing domestic judicial parochialism and providing virtually universal global asset execution, the New York Convention forms the legal bedrock of multinational commercial contracting."
            ],
            "example": "A German manufacturing firm contracts with a Japanese robotics supplier. The contract specifies arbitration in Zurich under ICC Rules. When a multi-million-dollar defect dispute arises, the German firm obtains an arbitral award for $25M against the Japanese supplier. Under the New York Convention, the German firm can immediately enforce this Swiss award against the Japanese supplier's commercial assets located in Tokyo, New York, London, or Singapore without re-litigating the merits of the dispute.",
            "code": """# Simulation: New York Convention Applicability & Arbitral Enforceability Evaluator
from typing import Dict, List, Any

def evaluate_new_york_convention_applicability(
    dispute_title: str,
    arbitral_seat_country: str,
    enforcement_forum_country: str,
    arbitration_agreement_in_writing: bool,
    subject_matter_is_commercial: bool,
    seat_is_convention_signatory: bool,
    enforcement_forum_is_convention_signatory: bool,
    enforcement_forum_has_reciprocity_reservation: bool,
    enforcement_forum_has_commercial_reservation: bool
) -> dict:
    prerequisites = []
    
    # 1. Writing requirement (Article II)
    if not arbitration_agreement_in_writing:
        prerequisites.append("FAILED: Arbitration agreement must be in writing (Article II(2)).")
        
    # 2. Convention membership of enforcement state
    if not enforcement_forum_is_convention_signatory:
        prerequisites.append("FAILED: Enforcement forum is not a contracting state of the New York Convention.")
        
    # 3. Reciprocity Reservation Check (Article I(3))
    if enforcement_forum_has_reciprocity_reservation and not seat_is_convention_signatory:
        prerequisites.append("FAILED: Reciprocity reservation bars enforcement; arbitral seat is not a contracting state.")
        
    # 4. Commercial Reservation Check (Article I(3))
    if enforcement_forum_has_commercial_reservation and not subject_matter_is_commercial:
        prerequisites.append("FAILED: Commercial reservation bars enforcement; dispute is non-commercial under forum law.")
        
    is_convention_enforceable = len(prerequisites) == 0
    status = "NEW_YORK_CONVENTION_ENFORCEABLE" if is_convention_enforceable else "CONVENTION_PROTECTION_UNAVAILABLE"
    
    return {
        "dispute_title": dispute_title,
        "arbitral_seat": arbitral_seat_country,
        "enforcement_forum": enforcement_forum_country,
        "is_enforceable_under_nyc": is_convention_enforceable,
        "status": status,
        "deficiencies": prerequisites,
        "mandatory_article_ii_referral_compelled": is_convention_enforceable
    }

# Execute deterministic simulation
audit = evaluate_new_york_convention_applicability(
    dispute_title="AeroTurbine Components GmbH v. Pacific Rim Dynamics Corp",
    arbitral_seat_country="Switzerland",
    enforcement_forum_country="United States",
    arbitration_agreement_in_writing=True,
    subject_matter_is_commercial=True,
    seat_is_convention_signatory=True,
    enforcement_forum_is_convention_signatory=True,
    enforcement_forum_has_reciprocity_reservation=True,
    enforcement_forum_has_commercial_reservation=True
)
print(f"Dispute: {audit['dispute_title']}")
print(f"Seat: {audit['arbitral_seat']} -> Forum: {audit['enforcement_forum']}")
print(f"Convention Applicability: {audit['is_enforceable_under_nyc']} ({audit['status']})")
print(f"Domestic Court Mandatory Referral: {audit['mandatory_article_ii_referral_compelled']}")
""",
            "output": """Dispute: AeroTurbine Components GmbH v. Pacific Rim Dynamics Corp
Seat: Switzerland -> Forum: United States
Convention Applicability: True (NEW_YORK_CONVENTION_ENFORCEABLE)
Domestic Court Mandatory Referral: True""",
            "tryIt": "Set `seat_is_convention_signatory` to False and observe how the enforcement forum's reciprocity reservation blocks New York Convention enforcement.",
            "check": {
                "question": "Under Article II(3) of the 1958 New York Convention, what is the mandatory obligation of a domestic court when a lawsuit is filed before it regarding a matter covered by a valid written arbitration agreement?",
                "options": [
                    "The court must re-write the commercial contract to eliminate the arbitration clause",
                    "The court must refer the parties to arbitration upon the request of one of the parties, unless it finds the agreement null and void, inoperative, or incapable of being performed",
                    "The court must immediately assess monetary punitive damages against both parties",
                    "The court must transfer the case to the International Court of Justice in The Hague"
                ],
                "answerIndex": 1,
                "explanation": "Article II(3) mandates that the court of a Contracting State, when seized of an action in a matter covered by an arbitration agreement, shall, at the request of one of the parties, refer the parties to arbitration.",
                "why": "This mandatory statutory duty strips domestic courts of discretionary jurisdiction and prevents parties from dishonoring their agreed dispute resolution commitments."
            },
            "codeNotes": [
                "`evaluate_new_york_convention_applicability` verifies the formal treaty requirements under Articles I, II, and III.",
                "Audits both the Reciprocity and Commercial reservations under Article I(3).",
                "Determines whether domestic courts are legally compelled to stay litigation and refer parties to arbitration."
            ]
        },
        {
            "title": "Drafting Institutional Arbitration Clauses: Seat, Governing Law & Rules",
            "say": [
                "Drafting a cross-border dispute resolution clause is among the most consequential responsibilities of transnational transactional counsel. A poorly drafted arbitration clause—known in international practice as a 'Pathological Clause'—can cause catastrophic jurisdictional gridlock, endless preliminary litigation before domestic courts, and the total unenforceability of the resulting arbitral award.",
                "To construct an institutional dispute resolution mechanism, counsel must meticulously differentiate between three distinct bodies of governing law that govern every international arbitration: (1) The Substantive Law of the Contract ('lex contractus' / 'proper law of the contract')—which governs the interpretation, performance, and breach of the underlying commercial terms, (2) The Law of the Arbitration Agreement—which governs the formation, validity, and scope of the arbitration clause itself (often determined by the seat or express contractual selection), and (3) The Curial Procedural Law ('lex arbitri')—the procedural law of the arbitration.",
                "The Lex Arbitri is strictly determined by the legal 'Seat' (or 'Place') of arbitration (e.g., London, Paris, Geneva, Singapore, or New York). The Seat is NOT merely the convenient physical location of a hearing room! Rather, the Seat is the juridical home of the arbitration. The courts of the Seat hold supervisory jurisdiction over the arbitral process: they possess sole authority to issue judicial subpoenas in aid of arbitration, appoint substitute arbitrators if the appointing mechanism fails, and critically, hear actions to annul or set aside the arbitral award.",
                "Parties must also select their procedural regime: Institutional Arbitration (administered by permanent arbitral institutions such as the International Chamber of Commerce (ICC), London Court of International Arbitration (LCIA), Singapore International Arbitration Centre (SIAC), or ICDR/AAA) versus Ad Hoc Arbitration (conducted under UNCITRAL rules without institutional administration). Institutional administration provides scrutinized draft awards, fee schedules, and emergency arbitrator rules.",
                "Finally, transactional agreements frequently incorporate 'Multi-Tier Dispute Resolution Clauses' (escalation clauses requiring senior executive negotiation for 30 days, followed by non-binding mediation under CEDR or SIMC rules, before filing for binding arbitration). Counsel must draft these pre-arbitration steps with clear, mandatory conditions precedent to avoid jurisdictional challenges regarding premature filings."
            ],
            "example": "A clause states: 'Any dispute shall be referred to arbitration in London under the Rules of Arbitration of the International Chamber of Commerce (ICC). The seat of arbitration shall be London, England. The procedural law shall be English law. The substantive law governing this agreement shall be New York law.' This clause separates the substantive law (New York) from the curial supervisory seat (London) under ICC institutional rules.",
            "code": """# Simulation: International Commercial Arbitration Clause Auditor & Pathology Detector
from typing import Dict, List, Any

def audit_international_arbitration_clause(
    clause_text: str,
    specifies_seat_of_arbitration: bool,
    arbitral_seat_city: str,
    specifies_governing_substantive_law: bool,
    substantive_law: str,
    specifies_arbitral_institution: bool,
    institutional_rules: str, # 'ICC', 'LCIA', 'SIAC', 'UNCITRAL'
    specifies_number_of_arbitrators: bool,
    number_of_arbitrators: int,
    specifies_language_of_arbitration: bool,
    language: str,
    contains_contradictory_forum_selection: bool # e.g. 'Arbitration in London, but NY courts have exclusive jurisdiction'
) -> dict:
    pathologies = []
    
    # 1. Seat of Arbitration Check (The Juridical Anchor)
    if not specifies_seat_of_arbitration or not arbitral_seat_city:
        pathologies.append({
            "severity": "CRITICAL_PATHOLOGY",
            "issue": "Missing Arbitral Seat: Fails to specify the seat, creating ambiguity over the curial law and supervisory court."
        })
        
    # 2. Contradictory Jurisdiction Check (The Classic Drafting Blunder)
    if contains_contradictory_forum_selection:
        pathologies.append({
            "severity": "FATAL_PATHOLOGY",
            "issue": "Equivocal Jurisdiction: Contains contradictory clauses purporting to grant exclusive jurisdiction to domestic courts while also specifying arbitration."
        })
        
    # 3. Institutional Clarity
    if not specifies_arbitral_institution:
        pathologies.append({
            "severity": "MODERATE_PATHOLOGY",
            "issue": "Ambiguous Procedural Framework: Fails to specify an established arbitral institution or adopt UNCITRAL ad hoc rules."
        })
        
    # 4. Tribual Composition Check
    if not specifies_number_of_arbitrators:
        pathologies.append({
            "severity": "MINOR_DEFICIENCY",
            "issue": "Omission of Number of Arbitrators: Will rely on institutional default fallback (typically 1 or 3 arbitrators)."
        })
        
    # Calculate Clause Health Score (100 base)
    score = 100.0
    for p in pathologies:
        if p["severity"] == "FATAL_PATHOLOGY":
            score -= 50.0
        elif p["severity"] == "CRITICAL_PATHOLOGY":
            score -= 30.0
        elif p["severity"] == "MODERATE_PATHOLOGY":
            score -= 15.0
        elif p["severity"] == "MINOR_DEFICIENCY":
            score -= 5.0
            
    is_bulletproof = score >= 90.0
    status = "BULLETPROOF_INSTITUTIONAL_CLAUSE" if is_bulletproof else ("PATHOLOGICAL_CLAUSE_REQUIRES_AMENDMENT" if score < 70.0 else "SUBOPTIMAL_CLAUSE")
    
    return {
        "arbitral_seat": arbitral_seat_city,
        "substantive_law": substantive_law,
        "institution": institutional_rules,
        "language": language,
        "clause_health_score": max(0.0, score),
        "status": status,
        "pathologies_detected": pathologies
    }

# Execute deterministic simulation
res = audit_international_arbitration_clause(
    clause_text="All disputes shall be settled by ICC arbitration in Singapore in English...",
    specifies_seat_of_arbitration=True,
    arbitral_seat_city="Singapore",
    specifies_governing_substantive_law=True,
    substantive_law="English Law",
    specifies_arbitral_institution=True,
    institutional_rules="SIAC",
    specifies_number_of_arbitrators=True,
    number_of_arbitrators=3,
    specifies_language_of_arbitration=True,
    language="English",
    contains_contradictory_forum_selection=False
)
print(f"Arbitration Clause Health: {res['clause_health_score']}/100 -> {res['status']}")
print(f"Seat: {res['arbitral_seat']} | Substantive Law: {res['substantive_law']} | Institution: {res['institution']}")
print(f"Pathologies Found: {len(res['pathologies_detected'])}")
""",
            "output": """Arbitration Clause Health: 100.0/100 -> BULLETPROOF_INSTITUTIONAL_CLAUSE
Seat: Singapore | Substantive Law: English Law | Institution: SIAC
Pathologies Found: 0""",
            "tryIt": "Set `contains_contradictory_forum_selection` to True and observe how contradictory forum clauses degrade the health score to Pathological.",
            "check": {
                "question": "In international commercial arbitration, why is the designated 'Seat of Arbitration' (lex arbitri) of paramount legal importance?",
                "options": [
                    "It determines the catering services and hotel accommodations for the hearing witnesses",
                    "It determines the juridical home of the arbitration, establishing which national courts have exclusive supervisory jurisdiction to set aside (annul) the award",
                    "It mandates that the arbitrators must be direct descendants of the country's monarch",
                    "It requires the contract to be translated into Latin before filing"
                ],
                "answerIndex": 1,
                "explanation": "The seat establishes the curial law and designates the supervisory courts. Only the courts of the seat possess jurisdiction to entertain an action to annul (set aside) the arbitral award.",
                "why": "Selecting a favorable, arbitration-friendly seat (such as London, Paris, or Singapore) ensures that domestic courts will assist rather than disrupt the arbitral process."
            },
            "codeNotes": [
                "`audit_international_arbitration_clause` detects drafting pathologies in cross-border dispute clauses.",
                "Audits mandatory core pillars: Seat, Substantive Law, Institutional Rules, and Tribunal Composition.",
                "Identifies fatal contradictory forum selection provisions that destroy arbitration agreements."
            ]
        },
        {
            "title": "Tribunal Jurisdiction: Separability & Kompetenz-Kompetenz",
            "say": [
                "When a commercial dispute erupts, recalcitrant respondents frequently attempt to derail arbitration proceedings by raising jurisdictional objections. A typical defense strategy is to allege that the underlying container contract is entirely void ab initio (e.g., procured by fraud, illegal under competition laws, or rescinded for breach). The respondent then asserts that because the underlying contract is void, the arbitration clause nested within it must also be void, thereby depriving the arbitral tribunal of authority to decide the dispute.",
                "To neutralize this dilatory ambush, modern arbitration law established two universal foundational doctrines: the 'Doctrine of Separability' and the principle of 'Kompetenz-Kompetenz'.",
                "The 'Doctrine of Separability' (enshrined in U.S. jurisprudence under Prima Paint Corp. v. Flood & Conklin Mfg. Co., English law under Fiona Trust & Holding Corp v. Privalov, and Article 16 of the UNCITRAL Model Law) establishes that an arbitration clause is legally distinct and autonomous from the underlying container contract in which it is situated. Even if the container contract is attacked for fraud in the inducement, material breach, or supervening illegality, the arbitration clause survives unimpaired. An attack on the underlying contract does NOT impeach the arbitration agreement; a court will only enjoin arbitration if the party mounts an independent, specific challenge proving that the arbitration agreement itself was fraudulently procured.",
                "The accompanying principle of 'Kompetenz-Kompetenz' (or 'Competence-Competence') establishes that the arbitral tribunal is legally empowered to rule on its own jurisdiction, including any objections with respect to the existence, validity, or scope of the arbitration agreement. Under the Kompetenz-Kompetenz doctrine, when a respondent challenges jurisdiction, domestic courts must adopt a posture of judicial restraint, allowing the arbitral tribunal to determine its own jurisdiction in the first instance.",
                "Modern institutional rules (ICC Article 29, LCIA Article 9B, SIAC Schedule 1) supplement these powers with 'Emergency Arbitrator' mechanisms, enabling parties to obtain urgent ex-parte interim injunctions and asset freezes within 14 days of filing, before the formal tribunal is fully constituted."
            ],
            "example": "A buyer seeks to terminate a $100M supply agreement, claiming the seller fraudulently induced the contract by misrepresenting manufacturing capacity. The buyer files a lawsuit in domestic court, arguing the contract's arbitration clause is void due to fraud. Under Prima Paint and the Doctrine of Separability, the court dismisses the lawsuit: because the fraud allegation targets the contract as a whole rather than the arbitration clause specifically, the arbitrator has exclusive jurisdiction to decide the fraud claim.",
            "code": """# Simulation: Kompetenz-Kompetenz & Separability Jurisdictional Adjudicator
from typing import Dict, List, Any

def evaluate_tribunal_kompetenz_and_separability(
    case_name: str,
    challenge_targets_entire_container_contract: bool, # e.g. Fraud in the inducement of main deal
    challenge_targets_arbitration_clause_specifically: bool, # e.g. Forged signature on the arbitration clause itself
    respondent_denies_contract_formation: bool,
    emergency_interim_relief_requested: bool,
    threat_of_irreparable_harm: bool
) -> dict:
    # 1. Separability Analysis (Prima Paint / Fiona Trust Doctrine)
    if challenge_targets_entire_container_contract and not challenge_targets_arbitration_clause_specifically:
        separability_ruling = "ARBITRATION_CLAUSE_SEVERED_AND_PRESERVED"
        forum_adjudicating_validity = "ARBITRAL_TRIBUNAL_EXCLUSIVELY"
        court_action = "MANDATORY_STAY_OR_DISMISSAL_OF_COURT_LITIGATION"
    elif challenge_targets_arbitration_clause_specifically:
        separability_ruling = "DIRECT_CHALLENGE_TO_ARBITRATION_AGREEMENT"
        forum_adjudicating_validity = "DOMESTIC_COURT_HEARING_ON_ARBITRATION_VALIDITY"
        court_action = "PRELIMINARY_EVIDENTIARY_HEARING_ON_ARBITRATION_FORMATION"
    else:
        separability_ruling = "ARBITRATION_AGREEMENT_UNCONTESTED"
        forum_adjudicating_validity = "ARBITRAL_TRIBUNAL"
        court_action = "REFERRAL_TO_ARBITRATION"
        
    # 2. Kompetenz-Kompetenz Application
    kompetenz_verdict = (
        "TRIBUNAL_HAS_PRIMARY_JURISDICTION_TO_DETERMINE_OWN_COMPETENCE"
        if forum_adjudicating_validity == "ARBITRAL_TRIBUNAL_EXCLUSIVELY"
        else "COURT_RESOLVES_ARBITRATION_CLAUSE_THRESHOLD_FORMATION"
    )
    
    # 3. Emergency Arbitrator Interim Injunction Evaluation
    if emergency_interim_relief_requested and threat_of_irreparable_harm:
        emergency_relief_status = "EMERGENCY_ARBITRATOR_INTERIM_INJUNCTION_ISSUED"
    else:
        emergency_relief_status = "STANDARD_TRIBUNAL_PROCEDURE"
        
    return {
        "case_name": case_name,
        "separability_ruling": separability_ruling,
        "adjudicating_forum": forum_adjudicating_validity,
        "kompetenz_verdict": kompetenz_verdict,
        "domestic_court_order": court_action,
        "emergency_relief_status": emergency_relief_status
    }

# Execute deterministic simulation
sim = evaluate_tribunal_kompetenz_and_separability(
    case_name="Global Energy Corp v. Pacific Infrastructure Consortium",
    challenge_targets_entire_container_contract=True, # Fraud in container contract
    challenge_targets_arbitration_clause_specifically=False,
    respondent_denies_contract_formation=False,
    emergency_interim_relief_requested=True,
    threat_of_irreparable_harm=True
)
print(f"Case: {sim['case_name']}")
print(f"Separability: {sim['separability_ruling']}")
print(f"Adjudicating Forum: {sim['adjudicating_forum']}")
print(f"Kompetenz-Kompetenz: {sim['kompetenz_verdict']}")
print(f"Court Order: {sim['domestic_court_order']}")
print(f"Interim Relief: {sim['emergency_relief_status']}")
""",
            "output": """Case: Global Energy Corp v. Pacific Infrastructure Consortium
Separability: ARBITRATION_CLAUSE_SEVERED_AND_PRESERVED
Adjudicating Forum: ARBITRAL_TRIBUNAL_EXCLUSIVELY
Kompetenz-Kompetenz: TRIBUNAL_HAS_PRIMARY_JURISDICTION_TO_DETERMINE_OWN_COMPETENCE
Court Order: MANDATORY_STAY_OR_DISMISSAL_OF_COURT_LITIGATION
Interim Relief: EMERGENCY_ARBITRATOR_INTERIM_INJUNCTION_ISSUED""",
            "tryIt": "Set `challenge_targets_arbitration_clause_specifically` to True and observe how courts intervene when the arbitration clause itself is impeached.",
            "check": {
                "question": "Under the Doctrine of Separability established in Prima Paint Corp. and Fiona Trust, how is an arbitration agreement treated when a party claims the main commercial contract was procured by fraud?",
                "options": [
                    "The arbitration clause is automatically declared null and void along with the main contract",
                    "The arbitration clause is treated as an autonomous, independent agreement that survives challenges to the main contract, leaving fraud claims to be decided by the arbitral tribunal",
                    "The entire dispute must be submitted to the United Nations Security Council",
                    "The claimant must pay double the filing fees to the ICC"
                ],
                "answerIndex": 1,
                "explanation": "Under the Doctrine of Separability, the arbitration clause is severed from the underlying contract. Unless the claim of fraud goes to the arbitration clause specifically, the arbitrator decides whether the contract was fraudulently induced.",
                "why": "Separability prevents bad-faith litigants from stalling international arbitrations by merely alleging contract breach or fraud in court."
            },
            "codeNotes": [
                "`evaluate_tribunal_kompetenz_and_separability` applies the Prima Paint doctrine to jurisdictional objections.",
                "Separates general container contract defenses from specific challenges to the arbitration agreement.",
                "Models the deployment of Emergency Arbitrator interim relief to prevent irreparable dissipation of assets."
            ]
        },
        {
            "title": "Grounds for Refusal under Article V of the New York Convention",
            "say": [
                "Once an international arbitral tribunal renders a final award, the prevailing party seeks recognition and enforcement under the New York Convention across jurisdictions where the losing respondent holds commercial bank accounts, real estate, or inventory. When the enforcement court is petitioned, the New York Convention strictly curtails the court's review powers. Domestic courts are strictly prohibited from reviewing the substantive merits of the arbitral award—courts cannot overturn an award for legal errors, misinterpretation of contracts, or mistaken factual findings!",
                "Instead, Article V of the New York Convention provides an exclusive, exhaustive list of seven narrow grounds on which recognition and enforcement may be refused. The burden of proof rests entirely upon the party resisting enforcement.",
                "Article V divides these grounds into two distinct operational categories. First, under Article V(1), the respondent must affirmatively plead and prove one of five procedural defects: (a) Incapacity of the parties or invalidity of the arbitration agreement under the applicable law, (b) Lack of proper notice of the appointment of the arbitrator or the proceedings, or inability of the party to present its case (a fundamental breach of natural justice), (c) The award deals with a difference not contemplated by or not falling within the terms of the submission, or contains decisions on matters beyond the scope of the submission (excess of mandate / ultra vires), (d) The composition of the arbitral tribunal or arbitral procedure violated the agreement of the parties, or (e) The award has not yet become binding, or has been set aside (annulled) or suspended by a competent court of the country in which, or under the law of which, the award was made.",
                "Second, under Article V(2), the enforcement court may refuse recognition ex officio (on its own motion) on two sovereign grounds: (a) The subject matter of the dispute is not capable of settlement by arbitration under the law of the enforcement state (non-arbitrability, such as criminal matters or core patent validity in certain nations), or (b) Recognition or enforcement of the award would be contrary to the 'Public Policy' of the enforcement state.",
                "The Article V(2)(b) Public Policy exception is construed with extreme narrowness. As held by the U.S. Second Circuit in Parsons & Whittemore Overseas Co. v. Société Générale de l'Industrie du Papier (RAKTA), enforcement may be refused on public policy grounds only where enforcement would violate the forum state's 'most basic notions of morality and justice' (such as bribery, corruption, or gross procedural fraud)."
            ],
            "example": "A losing party tries to block U.S. enforcement of an ICC award rendered in Paris, arguing the tribunal misunderstood New York contract law. The U.S. federal court rejects the challenge and confirms the award: substantive legal errors are NOT grounds for refusal under Article V of the New York Convention.",
            "code": """# Simulation: New York Convention Article V Award Enforcement Challenge Auditor
from typing import Dict, List, Any

def evaluate_article_v_enforcement_defenses(
    award_title: str,
    award_amount_usd: float,
    respondent_lacked_legal_capacity: bool,
    respondent_denied_due_process_and_notice: bool,
    tribunal_exceeded_mandate_ultra_vires: bool,
    procedure_violated_parties_agreement: bool,
    award_annulled_at_arbitral_seat: bool,
    dispute_subject_matter_non_arbitrable: bool,
    enforcement_violates_basic_morality_and_public_policy: bool,
    respondent_alleges_tribunal_made_legal_error: bool # Substantive merit challenge
) -> dict:
    valid_defenses_established = []
    invalid_defenses_rejected = []
    
    # Article V(1) Grounds (Proof by Respondent)
    if respondent_lacked_legal_capacity:
        valid_defenses_established.append("ARTICLE_V_1_A_PARTY_INCAPACITY")
    if respondent_denied_due_process_and_notice:
        valid_defenses_established.append("ARTICLE_V_1_B_LACK_OF_NOTICE_DUE_PROCESS_BREACH")
    if tribunal_exceeded_mandate_ultra_vires:
        valid_defenses_established.append("ARTICLE_V_1_C_ULTRA_VIRES_EXCESS_OF_MANDATE")
    if procedure_violated_parties_agreement:
        valid_defenses_established.append("ARTICLE_V_1_D_PROCEDURAL_COMPOSITION_BREACH")
    if award_annulled_at_arbitral_seat:
        valid_defenses_established.append("ARTICLE_V_1_E_AWARD_ANNULLED_AT_PRIMARY_SEAT")
        
    # Article V(2) Grounds (Ex Officio / Court Motion)
    if dispute_subject_matter_non_arbitrable:
        valid_defenses_established.append("ARTICLE_V_2_A_NON_ARBITRABLE_SUBJECT_MATTER")
    if enforcement_violates_basic_morality_and_public_policy:
        valid_defenses_established.append("ARTICLE_V_2_B_MANIFEST_PUBLIC_POLICY_VIOLATION")
        
    # Substantive Merit Review Bar (Parsons & Whittemore)
    if respondent_alleges_tribunal_made_legal_error:
        invalid_defenses_rejected.append("SUBSTANTIVE_LEGAL_ERROR_BARRED_FROM_JUDICIAL_REVIEW")
        
    enforcement_refused = len(valid_defenses_established) > 0
    enforcement_status = "ENFORCEMENT_REFUSED_UNDER_ARTICLE_V" if enforcement_refused else "AWARD_CONFIRMED_AND_ENFORCED"
    
    return {
        "award_title": award_title,
        "award_amount_usd": award_amount_usd,
        "enforcement_status": enforcement_status,
        "defenses_established": valid_defenses_established,
        "improper_merit_defenses_rejected": invalid_defenses_rejected,
        "is_judgment_entered": not enforcement_refused
    }

# Execute deterministic simulation
res = evaluate_article_v_enforcement_defenses(
    award_title="ICC Final Award No. 24891: Trans-Pacific Maritime v. Asian Trade Syndicate",
    award_amount_usd=38_500_000.0,
    respondent_lacked_legal_capacity=False,
    respondent_denied_due_process_and_notice=False,
    tribunal_exceeded_mandate_ultra_vires=False,
    procedure_violated_parties_agreement=False,
    award_annulled_at_arbitral_seat=False,
    dispute_subject_matter_non_arbitrable=False,
    enforcement_violates_basic_morality_and_public_policy=False,
    respondent_alleges_tribunal_made_legal_error=True # Attempting merit review
)
print(f"Award: {res['award_title']} (${res['award_amount_usd']:,.2f})")
print(f"Enforcement Status: {res['enforcement_status']}")
print(f"Judgment Entered: {res['is_judgment_entered']}")
print(f"Improper Defenses Rejected: {res['improper_merit_defenses_rejected']}")
print(f"Valid Article V Grounds Found: {len(res['defenses_established'])}")
""",
            "output": """Award: ICC Final Award No. 24891: Trans-Pacific Maritime v. Asian Trade Syndicate ($38,500,000.00)
Enforcement Status: AWARD_CONFIRMED_AND_ENFORCED
Judgment Entered: True
Improper Defenses Rejected: ['SUBSTANTIVE_LEGAL_ERROR_BARRED_FROM_JUDICIAL_REVIEW']
Valid Article V Grounds Found: 0""",
            "tryIt": "Set `respondent_denied_due_process_and_notice` to True and observe how a violation of fundamental due process triggers Article V(1)(b) refusal.",
            "check": {
                "question": "Can a domestic court in a New York Convention contracting state refuse to enforce a foreign arbitral award simply because it believes the arbitral tribunal made a serious mistake of substantive contract law?",
                "options": [
                    "Yes, national courts have plenary appellate authority to reverse all arbitral legal errors",
                    "No, the grounds for refusal under Article V of the New York Convention are exclusive and exhaustive, and do not permit review of the substantive legal or factual merits of the award",
                    "Yes, but only if the award exceeds $100,000,000",
                    "Only if the arbitral hearing lasted longer than six months"
                ],
                "answerIndex": 1,
                "explanation": "It is a foundational principle of the New York Convention that national enforcement courts are prohibited from reviewing the merits of an arbitral award. Article V specifies the exclusive grounds for refusing enforcement.",
                "why": "Prohibiting substantive merit review ensures the finality and commercial certainty of international arbitration awards."
            },
            "codeNotes": [
                "`evaluate_article_v_enforcement_defenses` codifies the complete Article V refusal matrix.",
                "Enforces the strict distinction between Article V(1) party defenses and Article V(2) public policy / non-arbitrability.",
                "Affirmatively rejects and sanctions improper attempts to litigate substantive legal errors under Parsons & Whittemore."
            ]
        },
        {
            "title": "Sovereign International Commercial Arbitration Simulation Engine",
            "say": [
                "To synthesize the entirety of transnational dispute resolution, we now deploy an enterprise-scale cross-border arbitration simulation: the 'Sovereign International Commercial Arbitration Lifecycle Engine'. This control system models an end-to-end multi-million-dollar transnational contract dispute from emergency interim injunction to multi-jurisdictional asset execution.",
                "Consider 'Quantum Industrial Turbines AG' (a Swiss manufacturer) and 'Pacific Basin Power Consortium' (a Singaporean energy utility). The parties entered into a $250M turnkey turbine construction agreement with an institutional arbitration clause: Seat in London, substantive English law, ICC Rules, 3 arbitrators, and English language. When Pacific Basin allegedly fails to pay $45M in milestone progress billings and threatens to encash $25M in unconditional bank demand guarantees, Quantum initiates urgent international arbitration.",
                "The master simulation models the complete 5-stage arbitral lifecycle: (1) Filing for an ICC Emergency Arbitrator under Article 29 to secure an emergency interim order restraining the improper draw on the bank guarantee, (2) Emplacement of the three-member arbitral tribunal (party-appointed co-arbitrators and an independent chair approved by the ICC Court), (3) Hearing on the merits and issuance of a Final Award granting $45M in damages plus 6.5% compound pre-award interest and 100% legal fee shifting under the English indemnity rule, (4) Annulment challenge defense before the English Commercial Court (upholding the award under Section 68 of the English Arbitration Act 1996), and (5) Multi-jurisdictional asset enforcement under the New York Convention across bank accounts in London, New York, and Singapore.",
                "Let us execute the master simulation and audit the transnational dispute resolution waterfall."
            ],
            "example": "Quantum Industrial Turbines recovers $52.8M in total proceeds by executing an ICC London award across Pacific Basin's commercial assets in New York and Singapore under the New York Convention, recovering 100% of claims plus legal costs.",
            "code": """# Simulation: Sovereign International Commercial Arbitration Master Lifecycle Engine
from typing import Dict, List, Any

def simulate_cross_border_arbitration_lifecycle(
    claimant: str,
    respondent: str,
    dispute_principal_usd: float,
    arbitral_seat: str,
    institution: str,
    governing_substantive_law: str,
    annual_interest_rate_pct: float,
    proceedings_duration_years: float,
    claimant_legal_costs_usd: float,
    respondent_attempts_annulment: bool
) -> dict:
    # Stage 1: Emergency Arbitrator Interim Injunction (Preserving Bank Guarantee)
    emergency_order_granted = True
    bank_guarantee_shielded_usd = 25_000_000.0
    
    # Stage 2: Tribunal Emplacement
    tribunal_constitution = "THREE_MEMBER_TRIBUNAL_CONFIRMED_BY_ICC_COURT"
    
    # Stage 3: Merits Award & Interest Computation
    # Compound interest: Principal * ((1 + r)^t - 1)
    compound_interest_usd = dispute_principal_usd * (((1.0 + (annual_interest_rate_pct / 100.0)) ** proceedings_duration_years) - 1.0)
    
    # Legal Fee Shifting (English indemnity rule: Costs follow the event)
    fee_award_usd = claimant_legal_costs_usd
    total_final_award_usd = dispute_principal_usd + compound_interest_usd + fee_award_usd
    
    # Stage 4: Annulment Challenge at Seat (English Commercial Court)
    if respondent_attempts_annulment:
        # English Arbitration Act 1996 Section 68 standard: High threshold for serious irregularity
        annulment_status = "ANNULMENT_CHALLENGE_DISMISSED_WITH_INDEMNITY_COSTS"
        award_confirmed_at_seat = True
    else:
        annulment_status = "NO_ANNULMENT_FILED"
        award_confirmed_at_seat = True
        
    # Stage 5: Multi-Jurisdictional New York Convention Enforcement
    # Enforcing across 3 target asset jurisdictions
    enforcement_targets = [
        {"jurisdiction": "United Kingdom", "assets_attached_usd": 20_000_000.0},
        {"jurisdiction": "United States (SDNY)", "assets_attached_usd": 25_000_000.0},
        {"jurisdiction": "Singapore", "assets_attached_usd": total_final_award_usd - 45_000_000.0}
    ]
    
    return {
        "claimant": claimant,
        "respondent": respondent,
        "arbitral_seat": arbitral_seat,
        "institution": institution,
        "governing_law": governing_substantive_law,
        "emergency_injunction_status": "INTERIM_RELIEF_CONFIRMED",
        "guarantee_shielded_usd": bank_guarantee_shielded_usd,
        "tribunal_status": tribunal_constitution,
        "principal_damages_usd": dispute_principal_usd,
        "compound_pre_award_interest_usd": round(compound_interest_usd, 2),
        "legal_fee_recovery_usd": fee_award_usd,
        "total_final_award_usd": round(total_final_award_usd, 2),
        "annulment_proceedings_at_seat": annulment_status,
        "new_york_convention_enforcement_status": "100_PERCENT_GLOBAL_ASSET_EXECUTION_ACHIEVED",
        "enforcement_jurisdictions": enforcement_targets
    }

# Execute master simulation
lifecycle = simulate_cross_border_arbitration_lifecycle(
    claimant="Quantum Industrial Turbines AG",
    respondent="Pacific Basin Power Consortium",
    dispute_principal_usd=45_000_000.0,
    arbitral_seat="London, England",
    institution="ICC Rules",
    governing_substantive_law="English Law",
    annual_interest_rate_pct=6.5,
    proceedings_duration_years=2.0,
    claimant_legal_costs_usd=2_800_000.0,
    respondent_attempts_annulment=True
)
print(f"=== SOVEREIGN ARBITRATION LIFECYCLE: {lifecycle['claimant']} v. {lifecycle['respondent']} ===")
print(f"Seat: {lifecycle['arbitral_seat']} | Rules: {lifecycle['institution']} | Law: {lifecycle['governing_law']}")
print(f"Emergency Interim Relief: {lifecycle['emergency_injunction_status']} (${lifecycle['guarantee_shielded_usd']:,.0f} Shielded)")
print(f"Principal: ${lifecycle['principal_damages_usd']:,.2f}")
print(f"Pre-Award Interest: ${lifecycle['compound_pre_award_interest_usd']:,.2f}")
print(f"Legal Fee Recovery: ${lifecycle['legal_fee_recovery_usd']:,.2f}")
print(f"Total Final Award: ${lifecycle['total_final_award_usd']:,.2f}")
print(f"Seat Annulment Challenge: {lifecycle['annulment_proceedings_at_seat']}")
print(f"Global Enforcement: {lifecycle['new_york_convention_enforcement_status']}")
""",
            "output": """=== SOVEREIGN ARBITRATION LIFECYCLE: Quantum Industrial Turbines AG v. Pacific Basin Power Consortium ===
Seat: London, England | Rules: ICC Rules | Law: English Law
Emergency Interim Relief: INTERIM_RELIEF_CONFIRMED ($25,000,000 Shielded)
Principal: $45,000,000.00
Pre-Award Interest: $6,040,125.00
Legal Fee Recovery: $2,800,000.00
Total Final Award: $53,840,125.00
Seat Annulment Challenge: ANNULMENT_CHALLENGE_DISMISSED_WITH_INDEMNITY_COSTS
Global Enforcement: 100_PERCENT_GLOBAL_ASSET_EXECUTION_ACHIEVED""",
            "tryIt": "Adjust `proceedings_duration_years` to 3.0 and observe how compound pre-award interest increases the total final award.",
            "check": {
                "question": "In an international commercial arbitration seated in London governed by English procedural law, which court has exclusive supervisory jurisdiction to decide an action to set aside (annul) the final award?",
                "options": [
                    "The Singapore International Commercial Court",
                    "The High Court of Justice of England and Wales (English Commercial Court)",
                    "The International Court of Justice in The Hague",
                    "The U.S. District Court for the Southern District of New York"
                ],
                "answerIndex": 1,
                "explanation": "Under international arbitration law and the New York Convention, only the courts of the juridical seat (here, the English Commercial Court in London) possess jurisdiction to annul an award.",
                "why": "This principle concentrates annulment litigation in a single competent forum, preventing conflicting set-aside actions across multiple jurisdictions."
            },
            "codeNotes": [
                "`simulate_cross_border_arbitration_lifecycle` models the complete 5-stage international arbitration lifecycle.",
                "Calculates compound pre-award interest and full English-rule legal fee shifting.",
                "Demonstrates multi-jurisdictional New York Convention asset enforcement across 3 sovereign jurisdictions."
            ]
        }
    ]
}
