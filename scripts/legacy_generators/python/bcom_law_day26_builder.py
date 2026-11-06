"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 26 Builder: Cross-Border Insolvency & Chapter 15 Recognition (UNCITRAL Model Law)
Milestone 6 Kickoff: Transnational Corporate Law, International Disputes & Global Governance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_26 = {
    "coursePrefix": "bcom_law",
    "day": 26,
    "title": "Cross-Border Insolvency & Chapter 15 Recognition (UNCITRAL Model Law)",
    "goal": "Master cross-border insolvency jurisprudence and international restructuring mechanisms: examine the UNCITRAL Model Law on Cross-Border Insolvency and Center of Main Interests (COMI) determination under In re SPhinX and Fairfield Sentry, dissect U.S. Bankruptcy Code Chapter 15 recognition of Foreign Main versus Non-Main proceedings, analyze cross-border asset marshalling and the Hotchpot dividend equalization rule under concurrent plenary proceedings, audit the Section 1506 narrow public policy exception under In re Qimonda AG, and simulate an enterprise cross-border debt restructuring across the US, UK, and Singapore.",
    "minutes": 45,
    "recap": "In Milestone 5 (Days 21–25), we conquered domestic takeover defense, Unocal poison pills, Revlon auction duties, MFW controlling shareholder freeze-outs, and Hart-Scott-Rodino/CFIUS regulatory clearances. Today we inaugurate Milestone 6: Transnational Corporate Law, Cross-Border Insolvency, International Commercial Arbitration, Global Supply Chain ESG, FCPA Anti-Corruption Compliance, and Sovereign Transnational Enterprise Governance.",
    "parts": [
        {
            "title": "The UNCITRAL Model Law & Center of Main Interests (COMI) Determination",
            "say": [
                "When a multinational enterprise with assets, operating subsidiaries, and creditors dispersed across multiple sovereign nations collapses into financial distress, traditional insolvency regimes face a severe structural conflict. Historically, two competing doctrines governed transnational defaults: 'Universalism' (which posits that a single court at the debtor's home base should administer a global liquidation or reorganization of all worldwide assets) and 'Territorialism' or the 'Grab Rule' (where each sovereign state independently seizes and liquidates whatever local assets sit within its geographical borders to satisfy local creditors first). Territorialism inevitably triggers catastrophic value destruction, race-to-the-courthouse scrambles, and discriminatory asset ring-fencing.",
                "To harmonize these conflicting approaches, the United Nations Commission on International Trade Law promulgated the 1997 UNCITRAL Model Law on Cross-Border Insolvency, establishing the prevailing regime of 'Modified Universalism'. Under Modified Universalism, domestic bankruptcy courts maintain their judicial sovereignty while extending formal recognition, cooperation, and judicial assistance to a single primary foreign proceeding, ensuring orderly cross-border debt restructuring and equitable asset distribution.",
                "The bedrock jurisdictional pillar of the UNCITRAL Model Law and U.S. Bankruptcy Code Chapter 15 is the debtor's 'Center of Main Interests' (COMI). Under statutory law, a debtor's registered office or place of formal incorporation is presumed to be its COMI. However, this presumption is strictly rebuttable! Courts look beyond nominal corporate incorporation charters to discern where the debtor's actual commercial nerve center is situated. As established in landmark jurisprudence including In re SPhinX, Ltd., In re Fairfield Sentry Ltd., and European Court of Justice rulings in Eurofood IFSC Ltd., COMI must be ascertainable by third parties—specifically corporate creditors.",
                "Courts weigh several objective evidentiary factors to ascertain COMI: (1) The location of the debtor's primary executive headquarters and senior operational management, (2) The jurisdiction where principal treasury, payroll, and cash management functions are executed, (3) The governing law and jurisdiction specified in the debtor's primary commercial financing agreements, (4) The location of the debtor's primary physical operational assets, and (5) Most critically, the external perception of third-party creditors regarding where corporate affairs are conducted.",
                "Crucially, debtor corporations cannot opportunistically engage in abusive 'COMI Migration' or forum shopping on the eve of bankruptcy to evade creditor rights. While a legitimate, transparent operational relocation months prior to insolvency may shift COMI, courts rigorously examine whether the relocation possessed genuine commercial substance or constituted bad-faith tactical manipulation."
            ],
            "example": "A holding company is nominally incorporated in the Cayman Islands for tax pass-through purposes, but possesses no physical offices, employees, or operations in George Town. Its board meetings occur in London, its executive officers reside in New York, its bank accounts and syndicated credit facilities are located in Manhattan, and all major creditor negotiations are conducted in the United States. A bankruptcy court will rebut the Cayman registered office presumption and hold that the debtor's true COMI is the United States.",
            "code": """# Simulation: Transnational Debtor COMI Classifier & Jurisdictional Nerve Center Engine
from typing import Dict, List, Any

def evaluate_transnational_comi_jurisdiction(
    entity_name: str,
    place_of_incorporation: str,
    headquarters_location: str,
    senior_executive_residence_jurisdiction: str,
    treasury_and_cash_management_jurisdiction: str,
    primary_creditor_concentration_jurisdiction: str,
    primary_financing_law_jurisdiction: str,
    days_since_headquarters_relocation: int
) -> dict:
    # Statutory Presumption: Place of Incorporation starts with 30 base points
    scores = {place_of_incorporation: 30.0}
    
    # Operational Factors (Objective Evidentiary Realities)
    # 1. Executive Headquarters Location (35 points)
    scores[headquarters_location] = scores.get(headquarters_location, 0.0) + 35.0
    
    # 2. Senior Management Residence (15 points)
    scores[senior_executive_residence_jurisdiction] = scores.get(senior_executive_residence_jurisdiction, 0.0) + 15.0
    
    # 3. Treasury & Cash Management (20 points)
    scores[treasury_and_cash_management_jurisdiction] = scores.get(treasury_and_cash_management_jurisdiction, 0.0) + 20.0
    
    # 4. Creditor Concentration & Perception (25 points)
    scores[primary_creditor_concentration_jurisdiction] = scores.get(primary_creditor_concentration_jurisdiction, 0.0) + 25.0
    
    # 5. Governing Law of Primary Debt Facilities (15 points)
    scores[primary_financing_law_jurisdiction] = scores.get(primary_financing_law_jurisdiction, 0.0) + 15.0
    
    # Check for opportunistic eve-of-bankruptcy COMI migration
    is_eve_of_bankruptcy_migration = days_since_headquarters_relocation < 90
    if is_eve_of_bankruptcy_migration:
        # Penalize relocated headquarters if manipulative
        scores[headquarters_location] -= 25.0
        migration_verdict = "SUSPECT_EVE_OF_FILING_MIGRATION_REJECTED"
    else:
        migration_verdict = "BONA_FIDE_ESTABLISHED_COMMERCIAL_PRESENCE"
        
    # Determine true COMI
    determined_comi = max(scores.items(), key=lambda x: x[1])[0]
    presumption_rebutted = determined_comi != place_of_incorporation
    
    return {
        "entity_name": entity_name,
        "nominal_registered_office": place_of_incorporation,
        "determined_comi": determined_comi,
        "presumption_rebutted": presumption_rebutted,
        "migration_verdict": migration_verdict,
        "jurisdiction_scores": scores,
        "comi_confidence_score": round(scores[determined_comi], 1)
    }

# Execute deterministic simulation
res = evaluate_transnational_comi_jurisdiction(
    entity_name="Titan Transnational Holdings Ltd",
    place_of_incorporation="Cayman Islands",
    headquarters_location="United States",
    senior_executive_residence_jurisdiction="United States",
    treasury_and_cash_management_jurisdiction="United States",
    primary_creditor_concentration_jurisdiction="United States",
    primary_financing_law_jurisdiction="United States",
    days_since_headquarters_relocation=365
)
print(f"Entity: {res['entity_name']}")
print(f"Registered Office: {res['nominal_registered_office']} -> Determined COMI: {res['determined_comi']}")
print(f"Statutory Presumption Rebutted: {res['presumption_rebutted']} (Confidence Score: {res['comi_confidence_score']})")
print(f"Migration Status: {res['migration_verdict']}")
""",
            "output": """Entity: Titan Transnational Holdings Ltd
Registered Office: Cayman Islands -> Determined COMI: United States
Statutory Presumption Rebutted: True (Confidence Score: 110.0)
Migration Status: BONA_FIDE_ESTABLISHED_COMMERCIAL_PRESENCE""",
            "tryIt": "Modify `days_since_headquarters_relocation` to 45 and observe how the anti-manipulation penalty reduces the headquarters score.",
            "check": {
                "question": "Under the UNCITRAL Model Law on Cross-Border Insolvency and Chapter 15 jurisprudence (e.g., In re SPhinX, In re Fairfield Sentry), how is the statutory presumption that a debtor's registered office is its Center of Main Interests (COMI) treated?",
                "options": [
                    "It is an irrebuttable statutory presumption that conclusively binds all international bankruptcy courts",
                    "It is a rebuttable presumption that readily yields to objective evidence regarding where the debtor's actual nerve center, headquarters, and operational decisions are perceived by creditors",
                    "It applies only if the debtor has zero physical assets anywhere in the world",
                    "It is determined solely by the citizenship of the debtor's largest equity shareholder"
                ],
                "answerIndex": 1,
                "explanation": "Under 11 U.S.C. § 1516(c) and international UNCITRAL jurisprudence, the presumption that the registered office is the debtor's COMI is strictly rebuttable. Courts evaluate where the debtor conducts regular administration ascertainable by third parties (creditors).",
                "why": "Understanding COMI prevents corporate debtors from engaging in bad-faith jurisdictional arbitrage and ensures that cross-border debt restructurings are administered by the court with the most legitimate economic connection to the enterprise."
            },
            "codeNotes": [
                "`evaluate_transnational_comi_jurisdiction` models multi-factor COMI adjudication.",
                "Weights operational management, cash handling, and creditor perception over formal incorporation.",
                "Implements an anti-manipulation penalty for opportunistic eve-of-bankruptcy forum shifts."
            ]
        },
        {
            "title": "Chapter 15 Recognition: Foreign Main vs Non-Main Proceedings & Automatic Relief",
            "say": [
                "Enacted under the Bankruptcy Abuse Prevention and Consumer Protection Act of 2005, Chapter 15 of the U.S. Bankruptcy Code (11 U.S.C. §§ 1501–1532) permanently incorporated the UNCITRAL Model Law into American federal jurisprudence. Chapter 15 is not an independent plenary bankruptcy reorganization regime like Chapter 11. Instead, it is an ancillary proceeding designed to provide recognition, enforcement, and injunctive relief in the United States in aid of a foreign primary proceeding.",
                "To obtain Chapter 15 recognition, a 'Foreign Representative' (the court-appointed liquidator, administrator, or debtor-in-possession from the foreign jurisdiction) must file a formal petition for recognition in a U.S. federal bankruptcy court pursuant to 11 U.S.C. § 1515. The court conducts an evidentiary hearing to classify the foreign proceeding into one of two statutory categories under Section 1517: a 'Foreign Main Proceeding' or a 'Foreign Non-Main Proceeding'.",
                "A 'Foreign Main Proceeding' is a proceeding taking place in the country where the debtor has its Center of Main Interests (COMI). If the U.S. bankruptcy court grants recognition as a Foreign Main Proceeding, landmark statutory consequences follow automatically under 11 U.S.C. § 1520: (1) The Section 362 Automatic Stay immediately applies to all debtor property situated within the territorial jurisdiction of the United States, halting all lawsuits, foreclosures, and asset attachments, (2) The foreign representative is authorized to operate the debtor's business and exercise Section 363 powers to use, sell, or lease U.S. property, and (3) Sections 364 (DIP financing), 549 (post-petition transactions), and 552 (post-petition security interests) are activated.",
                "Conversely, a 'Foreign Non-Main Proceeding' is a proceeding taking place in a country where the debtor does NOT have its COMI, but possesses an 'Establishment'—defined under Section 1502(2) as 'any place of operations where the debtor carries out a non-transitory economic activity with human means and goods or services'. If a proceeding is recognized merely as Non-Main, automatic Section 362 stay relief does NOT apply! Instead, the foreign representative must affirmatively petition the court for discretionary relief under Section 1521, proving that the requested stay or asset transfer adequately protects local U.S. creditors.",
                "If the debtor has neither its COMI nor an Establishment in the foreign jurisdiction, recognition must be denied entirely, leaving the foreign administrator with zero judicial enforcement authority over U.S. assets."
            ],
            "example": "A global shipping conglomerate undergoing judicial administration in the United Kingdom files for Chapter 15 recognition in the Southern District of New York. Because its COMI is London, the SDNY bankruptcy court recognizes the UK proceeding as a Foreign Main Proceeding. Instantly, all pending debt collection lawsuits and maritime asset arrest warrants across all U.S. ports are frozen under the automatic stay of 11 U.S.C. § 362.",
            "code": """# Simulation: Chapter 15 Recognition & Statutory Relief Determination Engine
from typing import Dict, List, Any

def evaluate_chapter15_petition_recognition(
    debtor_name: str,
    foreign_proceeding_country: str,
    is_foreign_proceeding_collective: bool,
    is_foreign_representative_properly_appointed: bool,
    debtor_comi_country: str,
    debtor_has_non_transitory_establishment: bool,
    us_assets_value_usd: float
) -> dict:
    # Statutory Prerequisites under 11 U.S.C. § 1515 & § 1517
    # 1. Collective proceeding under foreign insolvency law
    # 2. Authorized foreign representative
    # 3. Proper certified documentation
    if not is_foreign_proceeding_collective:
        return {
            "status": "RECOGNITION_DENIED",
            "reason": "Foreign proceeding is not a collective judicial or administrative proceeding under insolvency law.",
            "relief_granted": []
        }
    if not is_foreign_representative_properly_appointed:
        return {
            "status": "RECOGNITION_DENIED",
            "reason": "Petitioner lacks certified credentials as an authorized foreign representative under 11 U.S.C. § 1515.",
            "relief_granted": []
        }
        
    # Classification: Main vs Non-Main
    is_main = foreign_proceeding_country == debtor_comi_country
    
    if is_main:
        classification = "FOREIGN_MAIN_PROCEEDING"
        # Automatic Relief under 11 U.S.C. § 1520
        relief = [
            "AUTOMATIC_STAY_SECTION_362_ENFORCED",
            "SECTION_363_PROPERTY_DISPOSITION_POWERS_GRANTED",
            "SECTION_549_AVOIDANCE_OF_POST_PETITION_TRANSFERS",
            "FOREIGN_REP_EMPOWERED_TO_EXAMINE_US_WITNESSES_AND_ASSETS"
        ]
        status = "RECOGNITION_GRANTED_AS_FOREIGN_MAIN"
    elif debtor_has_non_transitory_establishment:
        classification = "FOREIGN_NON_MAIN_PROCEEDING"
        # Discretionary Relief under 11 U.S.C. § 1521 (Subject to judicial hearing)
        relief = [
            "DISCRETIONARY_STAY_AVAILABLE_UPON_MOTION_SECTION_1521",
            "PROVISION_OF_EVIDENCE_OR_INFORMATION_AUTHORIZATION"
        ]
        status = "RECOGNITION_GRANTED_AS_FOREIGN_NON_MAIN"
    else:
        classification = "NO_COMI_OR_ESTABLISHMENT"
        relief = []
        status = "RECOGNITION_DENIED_NO_QUALIFYING_PRESENCE"
        
    return {
        "debtor_name": debtor_name,
        "foreign_country": foreign_proceeding_country,
        "comi_country": debtor_comi_country,
        "classification": classification,
        "recognition_status": status,
        "statutory_relief": relief,
        "us_assets_protected_usd": us_assets_value_usd if "AUTOMATIC_STAY_SECTION_362_ENFORCED" in relief else 0.0
    }

# Execute deterministic simulation
recog = evaluate_chapter15_petition_recognition(
    debtor_name="Atlantic Merchant Shipping Ltd",
    foreign_proceeding_country="United Kingdom",
    is_foreign_proceeding_collective=True,
    is_foreign_representative_properly_appointed=True,
    debtor_comi_country="United Kingdom",
    debtor_has_non_transitory_establishment=True,
    us_assets_value_usd=145_000_000.0
)
print(f"Debtor: {recog['debtor_name']}")
print(f"Classification: {recog['classification']} -> Status: {recog['recognition_status']}")
print(f"US Assets Shielded: ${recog['us_assets_protected_usd']:,.2f}")
print("Relief Enacted:")
for r in recog['statutory_relief']:
    print(f" - {r}")
""",
            "output": """Debtor: Atlantic Merchant Shipping Ltd
Classification: FOREIGN_MAIN_PROCEEDING -> Status: RECOGNITION_GRANTED_AS_FOREIGN_MAIN
US Assets Shielded: $145,000,000.00
Relief Enacted:
 - AUTOMATIC_STAY_SECTION_362_ENFORCED
 - SECTION_363_PROPERTY_DISPOSITION_POWERS_GRANTED
 - SECTION_549_AVOIDANCE_OF_POST_PETITION_TRANSFERS
 - FOREIGN_REP_EMPOWERED_TO_EXAMINE_US_WITNESSES_AND_ASSETS""",
            "tryIt": "Set `debtor_comi_country` to 'Bermuda' while keeping `foreign_proceeding_country` as 'United Kingdom' and observe how recognition shifts from Foreign Main to Foreign Non-Main.",
            "check": {
                "question": "What is the primary legal consequence of a U.S. bankruptcy court recognizing a foreign insolvency proceeding as a 'Foreign Main Proceeding' under 11 U.S.C. § 1520?",
                "options": [
                    "All debts of the foreign entity are immediately and permanently discharged under U.S. law without creditor voting",
                    "The Section 362 automatic stay applies automatically to all property of the debtor located within the territorial jurisdiction of the United States",
                    "The foreign representative is barred from communicating with U.S. creditors",
                    "The U.S. government assumes all outstanding pension liabilities of the debtor"
                ],
                "answerIndex": 1,
                "explanation": "Under 11 U.S.C. § 1520(a)(1), upon recognition of a foreign proceeding that is a foreign main proceeding, Section 362 applies with respect to the debtor and that property of the debtor that is within the territorial jurisdiction of the United States.",
                "why": "This automatic statutory injunction prevents creditors from engaging in destructive asset grabs in the U.S. while the global restructuring plan is being formulated in the debtor's primary home forum."
            },
            "codeNotes": [
                "`evaluate_chapter15_petition_recognition` verifies jurisdictional prerequisites under 11 U.S.C. §§ 1515 & 1517.",
                "Differentiates between Foreign Main (automatic stay) and Foreign Non-Main (discretionary stay).",
                "Calculates total value of U.S. enterprise assets shielded from aggressive creditor attachment."
            ]
        },
        {
            "title": "Cross-Border Asset Marshalling, Concurrent Proceedings & The Hotchpot Rule",
            "say": [
                "Multinational corporate collapses frequently involve 'Concurrent Proceedings'—where a primary insolvency proceeding is underway in the debtor's COMI jurisdiction (e.g., an administration in London or a judicial management in Singapore), while a parallel plenary bankruptcy proceeding is initiated under domestic law (e.g., a Chapter 11 filing in Delaware) to manage domestic operating subsidiaries.",
                "Managing concurrent proceedings without coordination results in severe cross-border jurisdictional chaos: conflicting court orders, duplicative litigation costs, and conflicting debtor-in-possession financing structures. To prevent these failures, international bankruptcy judges and restructuring counsel deploy 'Cross-Border Insolvency Protocols'. Pioneered in massive collapses like Maxwell Communication Corporation, Lehman Brothers, and Nortel Networks, cross-border protocols are bilateral or multilateral court-approved contracts between domestic and foreign courts.",
                "Modern protocols incorporate the Judicial Insolvency Network (JIN) Guidelines for Communication and Cooperation Between Courts in Cross-Border Insolvency Matters. These guidelines permit judges in different sovereign jurisdictions to conduct joint hearings, exchange non-confidential filings, coordinate the scheduling of major asset auctions, and harmonize claims resolution procedures while strictly preserving each court's independent sovereign jurisdiction.",
                "A foundational equity doctrine governing concurrent proceedings is the 'Hotchpot Rule' (codified in U.S. Bankruptcy Code 11 U.S.C. § 1532 and common-law insolvency jurisprudence). The Hotchpot Rule prevents aggressive, well-resourced creditors from securing an unfair double recovery by attaching assets across multiple sovereign territories.",
                "Under the Hotchpot doctrine, if an unsecured creditor successfully seizes assets or recovers a partial dividend in a foreign proceeding, that creditor is legally barred from receiving any distribution in the domestic proceeding until all other parity creditors of the same class have received an equivalent pro-rata dividend percentage! Hotchpot equalizes recovery across all global creditors, eliminating the incentive for destructive territorial asset grabs."
            ],
            "example": "Creditor A and Creditor B each hold identical $10,000,000 unsecured claims against a global shipping group. Creditor A races to Rotterdam and seizes a cargo vessel, obtaining a $3,000,000 recovery (30% payout). When the primary restructuring trust in New York distributes an initial 20% dividend to general unsecured creditors, Creditor A receives $0.00! Creditor A will receive no further distributions until Creditor B has also received at least $3,000,000 (30%).",
            "code": """# Simulation: Hotchpot Dividend Equalization & Cross-Border Asset Marshalling Engine
from typing import Dict, List, Any

def calculate_hotchpot_cross_border_dividend_equalization(
    creditor_claims: Dict[str, float],
    prior_foreign_recoveries: Dict[str, float],
    total_distributable_cash_pool_usd: float
) -> dict:
    total_allowed_claims = sum(creditor_claims.values())
    total_prior_recoveries = sum(prior_foreign_recoveries.values())
    global_total_fund = total_distributable_cash_pool_usd + total_prior_recoveries
    
    # Calculate target global equalized recovery percentage
    target_recovery_ratio = min(1.0, global_total_fund / total_allowed_claims)
    
    distributions = {}
    remaining_cash = total_distributable_cash_pool_usd
    
    # Pass 1: Identify creditors whose prior foreign recovery already exceeds or equals target
    for c_id, claim in creditor_claims.items():
        prior_rec = prior_foreign_recoveries.get(c_id, 0.0)
        target_amount = claim * target_recovery_ratio
        
        if prior_rec >= target_amount:
            # Hotchpot rule applies: Creditor receives $0 until peers catch up
            distributions[c_id] = 0.0
        else:
            needed = target_amount - prior_rec
            distributions[c_id] = needed
            remaining_cash -= needed
            
    # Final cumulative recovery audit
    audit_summary = []
    for c_id, claim in creditor_claims.items():
        prior = prior_foreign_recoveries.get(c_id, 0.0)
        dist = distributions[c_id]
        total_rec = prior + dist
        effective_pct = (total_rec / claim) * 100.0
        audit_summary.append({
            "creditor": c_id,
            "claim_usd": claim,
            "prior_foreign_recovery_usd": prior,
            "hotchpot_distribution_usd": dist,
            "total_recovery_usd": total_rec,
            "effective_recovery_percentage": round(effective_pct, 2)
        })
        
    return {
        "total_claims_usd": total_allowed_claims,
        "distributable_pool_usd": total_distributable_cash_pool_usd,
        "target_equalized_recovery_pct": round(target_recovery_ratio * 100.0, 2),
        "creditor_audit": audit_summary
    }

# Execute deterministic simulation
claims = {"Creditor_Alpha": 10_000_000.0, "Creditor_Beta": 10_000_000.0, "Creditor_Gamma": 10_000_000.0}
priors = {"Creditor_Alpha": 3_000_000.0, "Creditor_Beta": 500_000.0, "Creditor_Gamma": 0.0}
cash_pool = 7_000_000.0 # $7M available to distribute locally

res = calculate_hotchpot_cross_border_dividend_equalization(claims, priors, cash_pool)
print(f"Target Global Equalized Recovery: {res['target_equalized_recovery_pct']}%")
for c in res['creditor_audit']:
    print(f" - {c['creditor']}: Prior ${c['prior_foreign_recovery_usd']:,.0f} + Hotchpot Dist ${c['hotchpot_distribution_usd']:,.0f} = Total ${c['total_recovery_usd']:,.0f} ({c['effective_recovery_percentage']}%)")
""",
            "output": """Target Global Equalized Recovery: 35.0%
 - Creditor_Alpha: Prior $3,000,000 + Hotchpot Dist $500,000 = Total $3,500,000 (35.0%)
 - Creditor_Beta: Prior $500,000 + Hotchpot Dist $3,000,000 = Total $3,500,000 (35.0%)
 - Creditor_Gamma: Prior $0 + Hotchpot Dist $3,500,000 = Total $3,500,000 (35.0%)""",
            "tryIt": "Increase Creditor_Alpha's prior recovery to $4,000,000 and observe how Creditor_Alpha receives $0 under Hotchpot while Beta and Gamma receive the available cash.",
            "check": {
                "question": "What is the primary function of the 'Hotchpot Rule' codified in 11 U.S.C. § 1532 in cross-border insolvency proceedings?",
                "options": [
                    "To force all foreign creditors to surrender their claims to the U.S. Department of the Treasury",
                    "To prevent a creditor who seized assets in a foreign proceeding from receiving distributions in the domestic proceeding until all parity creditors have achieved an equivalent percentage recovery",
                    "To mandate that all cross-border bankruptcies be settled through mandatory binding arbitration in Switzerland",
                    "To convert all unsecured corporate debt into non-voting preferred equity"
                ],
                "answerIndex": 1,
                "explanation": "Under 11 U.S.C. § 1532, an unsecured creditor who receives part payment in a foreign proceeding may not receive a dividend in a U.S. case so long as other creditors of the same class receive a proportionately smaller payment.",
                "why": "The Hotchpot rule neutralizes territorial asset grabs by ensuring that aggressive litigation abroad does not yield an unfair windfall over cooperative creditors."
            },
            "codeNotes": [
                "`calculate_hotchpot_cross_border_dividend_equalization` implements the statutory Hotchpot rule under 11 U.S.C. § 1532.",
                "Computes global equalized recovery percentages across multi-jurisdictional creditor recoveries.",
                "Withholds domestic distributions from creditors whose foreign seizures already equal or exceed peer recovery."
            ]
        },
        {
            "title": "The Section 1506 Public Policy Exception & Due Process Protection",
            "say": [
                "While Modified Universalism commands international comity and deference to foreign insolvency courts, sovereign nations refuse to enforce foreign restructuring decrees that violate their own fundamental constitutional or equitable legal values. In the United States, this sovereign safeguard is codified under 11 U.S.C. § 1506: 'Nothing in this chapter prevents the court from refusing to take an action governed by this chapter if the action would be manifestly contrary to the public policy of the United States.'",
                "Appellate courts have repeatedly emphasized that Section 1506 is an extremely narrow exception, not a broad license to reject foreign laws merely because they differ from the U.S. Bankruptcy Code. The statutory inclusion of the restrictive adverb 'manifestly' was deliberate. As held in In re Ephedra Products Liability Litigation and In re Iida, Section 1506 is invoked only where the foreign proceeding infringes fundamental constitutional principles, violates basic procedural due process, or severely undermines national security.",
                "The most famous application of Section 1506 occurred in In re Qimonda AG. In Qimonda, a German insolvency administrator sought Chapter 15 recognition in Virginia and attempted to cancel U.S. patent cross-licenses granted to American technology companies, asserting rights under German insolvency law (which allowed liquidators to terminate patent licenses). In the U.S., 11 U.S.C. § 365(n) strictly protects intellectual property licensees, allowing them to retain their license rights despite a licensor's bankruptcy. The Fourth Circuit affirmed that stripping U.S. companies of their Section 365(n) patent protections without just compensation was manifestly contrary to U.S. public policy, upholding the Section 1506 shield.",
                "Similarly, in In re Toft, a German administrator sought to intercept the debtor's private emails stored on U.S. servers without prior notice or judicial probable cause. The bankruptcy court invoked Section 1506, holding that unauthorized surveillance of private electronic communications violated fundamental Fourth Amendment privacy rights and international human rights principles.",
                "Therefore, cross-border restructuring counsel must audit foreign proceedings for minimum procedural due process: adequate notice to creditors, fair opportunity to be heard, and absence of confiscatory property deprivation."
            ],
            "example": "A foreign bankruptcy decree purports to cancel all secured maritime liens held by U.S. commercial banks without notice, hearing, or any cash compensation, transferring the unencumbered collateral to an entity controlled by the foreign debtor's political allies. A U.S. bankruptcy court will invoke 11 U.S.C. § 1506 and refuse recognition, as uncompensated confiscation of property violates Fifth Amendment Due Process.",
            "code": """# Simulation: Chapter 15 Section 1506 Public Policy Barrier & Due Process Auditor
from typing import Dict, List, Any

def evaluate_section1506_public_policy_barrier(
    foreign_jurisdiction: str,
    creditors_provided_adequate_notice: bool,
    impartial_independent_tribunal_adjudicated: bool,
    strips_us_statutory_ip_protections_365n: bool,
    engages_in_warrantless_private_communications_interception: bool,
    constitutes_uncompensated_confiscatory_expropriation: bool
) -> dict:
    violations = []
    
    # 1. Procedural Due Process Violations
    if not creditors_provided_adequate_notice:
        violations.append({
            "code": "DUE_PROCESS_NOTICE_FAILURE",
            "description": "Lack of adequate notice to affected creditors violated fundamental constitutional due process."
        })
    if not impartial_independent_tribunal_adjudicated:
        violations.append({
            "code": "JUDICIAL_INDEPENDENCE_FAILURE",
            "description": "Proceeding was tainted by political interference or lacked an independent judicial tribunal."
        })
        
    # 2. Substantive Public Policy Violations (Landmark Precedent)
    if strips_us_statutory_ip_protections_365n:
        violations.append({
            "code": "SECTION_365N_PATENT_PROTECTION_STRIP",
            "description": "Eliminating patent licensee rights without compensation violates U.S. public policy (In re Qimonda AG)."
        })
    if engages_in_warrantless_private_communications_interception:
        violations.append({
            "code": "FOURTH_AMENDMENT_PRIVACY_BREACH",
            "description": "Warrantless interception of private electronic communications violates Fourth Amendment (In re Toft)."
        })
    if constitutes_uncompensated_confiscatory_expropriation:
        violations.append({
            "code": "FIFTH_AMENDMENT_TAKINGS_VIOLATION",
            "description": "Uncompensated confiscation of secured creditor collateral violates the Fifth Amendment Takings Clause."
        })
        
    is_manifestly_contrary = len(violations) > 0
    verdict = "SECTION_1506_PUBLIC_POLICY_SHIELD_ACTIVATED" if is_manifestly_contrary else "COMPLIANT_WITH_US_PUBLIC_POLICY"
    
    return {
        "jurisdiction": foreign_jurisdiction,
        "is_manifestly_contrary_to_us_public_policy": is_manifestly_contrary,
        "verdict": verdict,
        "total_violations": len(violations),
        "violations": violations
    }

# Execute deterministic simulation
audit = evaluate_section1506_public_policy_barrier(
    foreign_jurisdiction="Foreign State X",
    creditors_provided_adequate_notice=True,
    impartial_independent_tribunal_adjudicated=True,
    strips_us_statutory_ip_protections_365n=True, # Qimonda scenario
    engages_in_warrantless_private_communications_interception=False,
    constitutes_uncompensated_confiscatory_expropriation=False
)
print(f"Jurisdiction: {audit['jurisdiction']}")
print(f"Public Policy Barrier Triggered: {audit['is_manifestly_contrary_to_us_public_policy']}")
print(f"Final Chancery Verdict: {audit['verdict']}")
for v in audit['violations']:
    print(f" - [{v['code']}]: {v['description']}")
""",
            "output": """Jurisdiction: Foreign State X
Public Policy Barrier Triggered: True
Final Chancery Verdict: SECTION_1506_PUBLIC_POLICY_SHIELD_ACTIVATED
 - [SECTION_365N_PATENT_PROTECTION_STRIP]: Eliminating patent licensee rights without compensation violates U.S. public policy (In re Qimonda AG).""",
            "tryIt": "Set `strips_us_statutory_ip_protections_365n` to False and observe how the foreign decree clears the Section 1506 public policy review.",
            "check": {
                "question": "In the landmark Chapter 15 decision In re Qimonda AG, why did the federal court invoke the 11 U.S.C. § 1506 public policy exception?",
                "options": [
                    "Because the German liquidator charged excessive hourly legal fees under European standards",
                    "Because applying German insolvency law would have stripped U.S. patent licensees of their statutory Section 365(n) rights without compensation, severely destabilizing the technological economy",
                    "Because the debtor's corporate executives were not citizens of the United States",
                    "Because German bankruptcy petitions must be translated into French before filing"
                ],
                "answerIndex": 1,
                "explanation": "In Qimonda, the Fourth Circuit held that stripping patent licensees of their 11 U.S.C. § 365(n) protections without just compensation was manifestly contrary to U.S. public policy under Section 1506.",
                "why": "Section 1506 serves as the constitutional backstop that prevents foreign insolvency courts from eradicating core property and due process rights created under domestic law."
            },
            "codeNotes": [
                "`evaluate_section1506_public_policy_barrier` codifies landmark Chapter 15 public policy jurisprudence.",
                "Evaluates procedural due process (notice, impartiality) and substantive statutory rights (Section 365(n), 4th/5th Amendments).",
                "Triggers the Section 1506 shield only for manifest constitutional or statutory infringements."
            ]
        },
        {
            "title": "Enterprise Cross-Border Insolvency Simulation: Multi-Jurisdictional Restructuring Engine",
            "say": [
                "To synthesize the entirety of transnational corporate insolvency jurisprudence, we now deploy an enterprise-grade cross-border debt restructuring simulation: the 'Sovereign Multi-Jurisdictional Cross-Border Restructuring Engine'. This control system models an enterprise undergoing simultaneous financial restructuring across the United States, the United Kingdom, and Singapore.",
                "Consider 'Apex Global Logistics Group'—a global freight conglomerate with parent company headquarters in London (UK), major asset holding subsidiaries in Delaware (US), and Asian logistics hubs in Singapore. Apex has $1.2B in total funded debt, including $750M in New York law syndicated term loans, $300M in English law senior secured notes, and $150M in local Singapore trade facilities.",
                "The simulation executes a synchronized multi-jurisdictional workout: (1) Filing a UK Restructuring Plan under Part 26A of the Companies Act 2006 to utilize the English Cross-Class Cramdown mechanism against dissenting mezzanine lenders, (2) Filing an ancillary Chapter 15 petition in the U.S. Bankruptcy Court for the Southern District of New York to secure Foreign Main recognition and enjoin U.S. noteholders under the Section 362 automatic stay, (3) Obtaining cross-border recognition of the English scheme in Singapore under Section 64 of the Insolvency, Restructuring and Dissolution Act (IRDA), (4) Executing cross-border protocol court-to-court communications between SDNY and the High Court of London, and (5) Applying the Hotchpot dividend equalization rule across all global distribution accounts.",
                "By orchestrating this parallel transnational framework, the enterprise eliminates $650M in distressed debt, provides equity warrants to cooperative creditors, and emerges with an investment-grade balance sheet without liquidation.",
                "Let us execute the master simulation and audit the transnational restructuring waterfall."
            ],
            "example": "A global conglomerate restructures $1.2B of debt by pairing an English Part 26A cross-class cramdown with an SDNY Chapter 15 recognition order. The Chapter 15 injunction protects $450M of U.S. terminal assets from attachment by holdout hedge funds, enabling global debt-for-equity swap execution.",
            "code": """# Simulation: Sovereign Multi-Jurisdictional Cross-Border Restructuring Orchestrator
from typing import Dict, List, Any

def simulate_cross_border_insolvency_orchestration(
    debtor_name: str,
    total_funded_debt_usd: float,
    us_term_loan_debt_usd: float,
    uk_senior_notes_debt_usd: float,
    singapore_trade_debt_usd: float,
    uk_part26a_creditor_approval_pct: float,
    has_judicial_court_protocol: bool
) -> dict:
    # 1. Primary COMI Determination (UK Headquarters)
    comi_country = "United Kingdom"
    
    # 2. UK Restructuring Plan (Part 26A Companies Act 2006)
    # Requires 75% approval in value; if rejected, allows Cross-Class Cramdown
    if uk_part26a_creditor_approval_pct >= 0.75:
        uk_plan_status = "UK_PART_26A_CONSENSUAL_APPROVAL"
        cross_class_cramdown_used = False
    else:
        uk_plan_status = "UK_PART_26A_CROSS_CLASS_CRAMDOWN_SANCTIONED"
        cross_class_cramdown_used = True
        
    # 3. U.S. Chapter 15 Recognition (SDNY)
    chapter15_recognition = "FOREIGN_MAIN_RECOGNITION_GRANTED_SDNY"
    us_stay_active = True
    
    # 4. Singapore Recognition (IRDA Section 64 Moratorium)
    singapore_moratorium = "SINGAPORE_IRDA_MORATORIUM_CONFIRMED"
    
    # 5. Debt Restructuring Waterfall
    # $650M debt converted into 85% new common equity
    debt_converted_to_equity_usd = 650_000_000.0
    reinstated_senior_debt_usd = total_funded_debt_usd - debt_converted_to_equity_usd
    
    # Annual Interest Savings (assumed 8.5% weighted average rate)
    annual_interest_savings_usd = debt_converted_to_equity_usd * 0.085
    
    return {
        "debtor_name": debtor_name,
        "primary_comi": comi_country,
        "uk_restructuring_status": uk_plan_status,
        "cross_class_cramdown_utilized": cross_class_cramdown_used,
        "us_chapter15_status": chapter15_recognition,
        "us_automatic_stay_enforced": us_stay_active,
        "singapore_recognition_status": singapore_moratorium,
        "court_to_court_protocol_active": has_judicial_court_protocol,
        "original_total_debt_usd": total_funded_debt_usd,
        "equitized_debt_usd": debt_converted_to_equity_usd,
        "reinstated_senior_exit_debt_usd": reinstated_senior_debt_usd,
        "annual_interest_expense_saved_usd": annual_interest_savings_usd,
        "enterprise_solvency_rating": "INVESTMENT_GRADE_RESTRUCTURED"
    }

# Execute master simulation
res = simulate_cross_border_insolvency_orchestration(
    debtor_name="Apex Global Logistics Group",
    total_funded_debt_usd=1_200_000_000.0,
    us_term_loan_debt_usd=750_000_000.0,
    uk_senior_notes_debt_usd=300_000_000.0,
    singapore_trade_debt_usd=150_000_000.0,
    uk_part26a_creditor_approval_pct=0.71, # Triggers cross-class cramdown
    has_judicial_court_protocol=True
)
print(f"=== CROSS-BORDER RESTRUCTURING AUDIT: {res['debtor_name']} ===")
print(f"Primary COMI: {res['primary_comi']}")
print(f"UK Proceeding: {res['uk_restructuring_status']} (Cramdown: {res['cross_class_cramdown_utilized']})")
print(f"US Chapter 15: {res['us_chapter15_status']} (Stay Active: {res['us_automatic_stay_enforced']})")
print(f"Singapore Moratorium: {res['singapore_recognition_status']}")
print(f"JIN Court Protocol Active: {res['court_to_court_protocol_active']}")
print(f"Original Debt: ${res['original_total_debt_usd']:,.0f} -> Equitized: ${res['equitized_debt_usd']:,.0f}")
print(f"Reinstated Debt: ${res['reinstated_senior_exit_debt_usd']:,.0f} (Annual Interest Saved: ${res['annual_interest_expense_saved_usd']:,.0f})")
print(f"Enterprise Exit Rating: {res['enterprise_solvency_rating']}")
""",
            "output": """=== CROSS-BORDER RESTRUCTURING AUDIT: Apex Global Logistics Group ===
Primary COMI: United Kingdom
UK Proceeding: UK_PART_26A_CROSS_CLASS_CRAMDOWN_SANCTIONED (Cramdown: True)
US Chapter 15: FOREIGN_MAIN_RECOGNITION_GRANTED_SDNY (Stay Active: True)
Singapore Moratorium: SINGAPORE_IRDA_MORATORIUM_CONFIRMED
JIN Court Protocol Active: True
Original Debt: $1,200,000,000 -> Equitized: $650,000,000
Reinstated Debt: $550,000,000 (Annual Interest Saved: $55,250,000)
Enterprise Exit Rating: INVESTMENT_GRADE_RESTRUCTURED""",
            "tryIt": "Change `uk_part26a_creditor_approval_pct` to 0.85 and observe how the restructuring achieves consensual class confirmation without cross-class cramdown.",
            "check": {
                "question": "What is the primary strategic benefit of pairing an English Part 26A Restructuring Plan with an ancillary U.S. Chapter 15 recognition proceeding for a multinational corporation with significant U.S. operations?",
                "options": [
                    "It eliminates the need to pay any income taxes to either the UK or US governments for five years",
                    "It allows the debtor to bind dissenting debt classes via English cross-class cramdown while simultaneously shielding U.S. assets from creditor attachment via the Chapter 15 automatic stay",
                    "It automatically converts all corporate employees into independent general partners",
                    "It waives all securities disclosure requirements under SEC Rule 10b-5"
                ],
                "answerIndex": 1,
                "explanation": "Pairing a foreign primary reorganization (like a UK Part 26A plan) with Chapter 15 combines foreign restructuring powers (like cross-class cramdown) with U.S. injunctive protection under Section 362/1520.",
                "why": "This multi-jurisdictional technique is the gold standard for global enterprise debt restructuring, allowing companies to preserve enterprise value across borders."
            },
            "codeNotes": [
                "`simulate_cross_border_insolvency_orchestration` synthesizes UK Part 26A, US Chapter 15, and Singapore IRDA frameworks.",
                "Simulates judicial coordination via the Judicial Insolvency Network (JIN) protocol.",
                "Models debt equitization and resulting cash interest expense reductions."
            ]
        }
    ]
}
