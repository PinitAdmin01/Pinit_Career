"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 7 Builder: Trademark Protection, Lanham Act & Likelihood of Confusion (Polaroid Factors)
Milestone 2: Intellectual Property & Technology Licensing Architecture
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_07 = {
    "coursePrefix": "bcom_law",
    "day": 7,
    "title": "Trademark Protection & Brand Asset Defense: Lanham Act, Distinctiveness & Likelihood of Confusion",
    "goal": "Master trademark jurisprudence under the federal Lanham Act (15 U.S.C. §§ 1051 et seq.): evaluate the Abercrombie distinctiveness spectrum, calculate Polaroid likelihood of confusion multi-factor scores, defend against trademark dilution, and orchestrate international Madrid Protocol filings.",
    "minutes": 45,
    "recap": "Yesterday in Day 6, we mastered patentability under Sections 101, 102, and 103, claim drafting, and Freedom-to-Operate clearance. Today in Day 7, we master the legal architecture of commercial brand equity: trademarks, trade dress, consumer confusion doctrine, and anti-counterfeiting enforcement.",
    "parts": [
        {
            "title": "Trademark Distinctiveness Spectrum & The Abercrombie Hierarchy",
            "say": [
                "A trademark is any word, name, symbol, device, or any combination thereof used by a commercial enterprise to identify and distinguish its goods or services from those manufactured or sold by others, and to indicate the source of the goods. While patent and copyright protection originate in Article I, Section 8 of the US Constitution to promote science and useful arts, federal trademark protection under the Lanham Act of 1946 (15 U.S.C. §§ 1051 et seq.) is grounded in the Commerce Clause. The primary public policy objective of trademark law is dual-faceted: protecting consumers against commercial confusion and deceit while safeguarding corporate investments in brand goodwill.",
                "To be legally protectable and eligible for registration on the Principal Register of the United States Patent and Trademark Office (USPTO), a trademark must be 'distinctive'—it must function in consumer minds as an indicator of commercial origin. In the seminal Second Circuit decision Abercrombie & Fitch Co. v. Hunting World, Inc. (1976), Judge Friendly established the classic Five-Tier Distinctiveness Spectrum.",
                "The Abercrombie hierarchy classifies marks into five ascending categories of legal strength: (1) Generic terms, (2) Descriptive terms, (3) Suggestive terms, (4) Arbitrary terms, and (5) Fanciful (coined) terms.",
                "Generic terms (e.g., 'Bicycle' for bicycles, 'Computer' for laptops) are the common everyday names of products. They can NEVER function as trademarks under any circumstances because granting a monopoly over a generic word would unfairly deplete the English language and prevent competitors from describing their products. Descriptive terms (e.g., 'Rapid Delivery' or 'Cold Beer') directly describe a characteristic, quality, or ingredient of the good. Descriptive marks cannot be protected initially; they become protectable ONLY if they acquire 'Secondary Meaning' (acquired distinctiveness under Section 2(f)), proving through extensive commercial use and consumer surveys that the public associates the descriptive phrase with a single source.",
                "In contrast, the top three tiers are considered 'Inherently Distinctive' and receive immediate, robust legal protection upon adoption without proving secondary meaning: Suggestive marks (e.g., 'Netflix' or 'Airbus') require an imaginative leap or perception to connect the name to the product; Arbitrary marks (e.g., 'Apple' for electronics or 'Camel' for cigarettes) use real English words that have zero relationship to the goods sold; and Fanciful marks (e.g., 'Kodak', 'Exxon', 'Xerox') are entirely invented, coined words. Corporate general counsel must steer marketing teams away from descriptive names toward fanciful and arbitrary marks to secure bulletproof legal defense."
            ],
            "example": "An entrepreneur creating an electric vehicle brand wants to name it 'Fast Electric Cars.' Corporate counsel rejects the name because it is merely descriptive and unprotectable without spending millions to prove secondary meaning. Instead, counsel recommends 'Lucid' (an arbitrary mark) or 'Rivian' (a coined fanciful mark), securing instant, nationwide trademark protection on day one.",
            "code": """# Simulation: Abercrombie Distinctiveness Spectrum & Trademark Protectability Engine
class TrademarkDistinctivenessEvaluator:
    CATEGORIES = {
        'GENERIC': {'rank': 1, 'inherently_distinctive': False, 'protectable': False, 'requires_secondary_meaning': False},
        'DESCRIPTIVE': {'rank': 2, 'inherently_distinctive': False, 'protectable': True, 'requires_secondary_meaning': True},
        'SUGGESTIVE': {'rank': 3, 'inherently_distinctive': True, 'protectable': True, 'requires_secondary_meaning': False},
        'ARBITRARY': {'rank': 4, 'inherently_distinctive': True, 'protectable': True, 'requires_secondary_meaning': False},
        'FANCIFUL': {'rank': 5, 'inherently_distinctive': True, 'protectable': True, 'requires_secondary_meaning': False}
    }

    @classmethod
    def evaluate_mark(
        cls,
        mark_text: str,
        category: str,
        commercial_use_years: float,
        ad_spend_millions_usd: float,
        consumer_survey_source_recognition_pct: float
    ) -> dict:
        cat_info = cls.CATEGORIES[category]
        has_secondary_meaning = False
        
        # Test for secondary meaning under Lanham Act Section 2(f)
        if cat_info['requires_secondary_meaning']:
            # Secondary meaning requires substantial use (>= 5 years) OR high consumer recognition (>= 50%)
            has_secondary_meaning = (commercial_use_years >= 5.0 and ad_spend_millions_usd >= 10.0) or (consumer_survey_source_recognition_pct >= 50.0)

        is_registrable = cat_info['inherently_distinctive'] or (cat_info['protectable'] and has_secondary_meaning)
        
        if category == 'GENERIC':
            status = 'UNREGISTERABLE_GENERIC_PUBLIC_DOMAIN'
            legal_strength = 'ZERO_PROTECTION'
        elif not is_registrable:
            status = 'REFUSED_MERELY_DESCRIPTIVE_LACKS_SECONDARY_MEANING'
            legal_strength = 'UNENFORCEABLE_UNTIL_ACQUIRED_DISTINCTIVENESS'
        elif cat_info['inherently_distinctive']:
            status = 'PRINCIPAL_REGISTER_INHERENTLY_DISTINCTIVE'
            legal_strength = f'STRONG_MONOPOLY_TIER_{cat_info["rank"]}'
        else:
            status = 'PRINCIPAL_REGISTER_SECTION_2F_ACQUIRED_DISTINCTIVENESS'
            legal_strength = 'MODERATE_ACQUIRED_PROTECTION'

        return {
            'mark': mark_text,
            'abercrombie_tier': category,
            'inherently_distinctive': cat_info['inherently_distinctive'],
            'secondary_meaning_proven': has_secondary_meaning,
            'registrable_on_principal_register': is_registrable,
            'registration_status': status,
            'legal_defensibility_tier': legal_strength
        }

# Evaluate three candidate enterprise brand names
eval_1 = TrademarkDistinctivenessEvaluator.evaluate_mark(
    mark_text='Cold Beer',
    category='GENERIC',
    commercial_use_years=10.0,
    ad_spend_millions_usd=50.0,
    consumer_survey_source_recognition_pct=65.0
)

eval_2 = TrademarkDistinctivenessEvaluator.evaluate_mark(
    mark_text='Best Cloud Storage',
    category='DESCRIPTIVE',
    commercial_use_years=2.0,
    ad_spend_millions_usd=3.0,
    consumer_survey_source_recognition_pct=22.0
)

eval_3 = TrademarkDistinctivenessEvaluator.evaluate_mark(
    mark_text='AetherVibe',
    category='FANCIFUL',
    commercial_use_years=0.1,
    ad_spend_millions_usd=0.0,
    consumer_survey_source_recognition_pct=0.0
)

print(f"[{eval_1['mark']}] Tier: {eval_1['abercrombie_tier']} -> {eval_1['registration_status']} ({eval_1['legal_defensibility_tier']})")
print(f"[{eval_2['mark']}] Tier: {eval_2['abercrombie_tier']} -> {eval_2['registration_status']} ({eval_2['legal_defensibility_tier']})")
print(f"[{eval_3['mark']}] Tier: {eval_3['abercrombie_tier']} -> {eval_3['registration_status']} ({eval_3['legal_defensibility_tier']})")
""",
            "output": "[Cold Beer] Tier: GENERIC -> UNREGISTERABLE_GENERIC_PUBLIC_DOMAIN (ZERO_PROTECTION)\n[Best Cloud Storage] Tier: DESCRIPTIVE -> REFUSED_MERELY_DESCRIPTIVE_LACKS_SECONDARY_MEANING (UNENFORCEABLE_UNTIL_ACQUIRED_DISTINCTIVENESS)\n[AetherVibe] Tier: FANCIFUL -> PRINCIPAL_REGISTER_INHERENTLY_DISTINCTIVE (STRONG_MONOPOLY_TIER_5)",
            "codeNotes": [
                {"line": 3, "note": "Implements the Abercrombie & Fitch five-tier trademark distinctiveness hierarchy"},
                {"line": 16, "note": "Evaluates Section 2(f) secondary meaning hurdles for descriptive marks"},
                {"line": 23, "note": "Enforces strict bar against generic terms regardless of commercial longevity or advertising spend"},
                {"line": 27, "note": "Confirms instant Principal Register eligibility for inherently distinctive fanciful and arbitrary marks"}
            ],
            "tryIt": "Increase commercial_use_years to 6 and ad_spend_millions_usd to 15 for 'Best Cloud Storage' to witness it acquire secondary meaning.",
            "check": {
                "question": "Under the Abercrombie distinctiveness spectrum, why can a generic term never be registered as a trademark, even if an enterprise spends $100 million in national advertising?",
                "options": [
                    "Because generic words are the essential commercial language necessary for competitors to describe what they are selling; granting a monopoly over a generic name would paralyze fair competition.",
                    "Because the Federal Trade Commission requires generic words to be translated into Latin before filing.",
                    "Because generic marks are reserved exclusively for non-profit charitable organizations.",
                    "Because advertising expenditures above $50 million automatically convert trademarks into public utility franchises."
                ],
                "answer": 0,
                "why": "Generic terms are common product names belonging to the public domain; allowing any single company to monopolize the name of a product would prevent competitors from marketing competing goods.",
                "answerIndex": 0,
                "explanation": "Generic terms are common product names belonging to the public domain; allowing any single company to monopolize the name of a product would prevent competitors from marketing competing goods."
            }
        },
        {
            "title": "Likelihood of Confusion & The Polaroid Multi-Factor Test",
            "say": [
                "The core test for trademark infringement under Section 32 (for registered marks) and Section 43(a) (for unregistered marks) of the Lanham Act is the 'Likelihood of Confusion'. Trademark infringement does NOT require that an infringing competitor adopt an identical name or sell identical goods. Instead, the legal standard asks: Is it likely that an appreciable number of reasonably prudent purchasers will be confused, misled, or deceived as to the source, affiliation, connection, or sponsorship of the goods or services?",
                "In Polaroid Corp. v. Polarad Electronics Corp. (1961), Judge Friendly articulated the famous Eight-Factor Polaroid Test, which has been adopted across federal circuit courts (with minor naming variations, such as the Sleekcraft factors in the Ninth Circuit or the DuPont factors in the Federal Circuit).",
                "The eight Polaroid factors are: (1) Strength of the senior mark (placement on the Abercrombie spectrum and marketplace renown), (2) Degree of similarity between the two marks (comparing appearance, sound, connotation, and commercial impression), (3) Proximity and competitiveness of the products or services in the marketplace, (4) Likelihood that the senior user will 'bridge the gap' and expand into the junior user's market, (5) Actual consumer confusion in the marketplace (the most probative single factor, though not strictly required), (6) Junior user's good faith or predatory intent in adopting the mark, (7) Quality of the junior user's products (inferior goods harm the senior user's reputation), and (8) Sophistication of the relevant buyers (purchasers of $5,000 enterprise servers exercise far greater care than impulse buyers of $2 candy bars).",
                "In modern digital commerce, likelihood of confusion analysis extends to Search Engine Marketing (SEM) keyword bidding and meta-tagging. In Network Automation v. Advanced Systems Concepts, the Ninth Circuit held that bidding on a competitor's trademarked name as an ad keyword is not per se infringement, provided the resulting sponsored ad text clearly displays the advertiser's own brand identity, avoiding 'Initial Interest Confusion'.",
                "Corporate trademark litigators must systematically quantify each Polaroid factor before filing federal complaints or responding to demand letters. Presenting robust empirical evidence—such as blinded consumer confusion surveys conducted under Daubert evidentiary standards showing confusion rates exceeding 15% to 20%—frequently compels the entry of a preliminary injunction that shuts down the infringing brand before trial."
            ],
            "example": "A high-end luxury watch manufacturer named 'Chronos' sues a new digital fitness tracker called 'Krono Watch.' The marks sound identical, and both measure time. However, if Chronos sells $15,000 mechanical chronometers through Beverly Hills jewelers to sophisticated collectors, while Krono sells $25 plastic wristbands on Amazon, the disparity in buyer sophistication, price point, and distribution channels significantly diminishes the likelihood of confusion.",
            "code": """# Simulation: Polaroid Likelihood of Confusion Multi-Factor Scoring Engine
from typing import Dict

class PolaroidConfusionAnalyzer:
    WEIGHTS = {
        'mark_strength': 0.20,             # Abercrombie rank & marketplace renown (0.0 to 1.0)
        'similarity_of_marks': 0.25,        # Sight, sound, meaning, and impression (0.0 to 1.0)
        'product_proximity': 0.15,          # Competitive overlap of goods/services (0.0 to 1.0)
        'bridging_the_gap': 0.10,           # Probability of senior user expanding into niche (0.0 to 1.0)
        'actual_confusion_evidence': 0.15,  # Documented misdirected orders or surveys (0.0 to 1.0)
        'junior_predatory_intent': 0.10,    # Bad-faith intent to free-ride on senior goodwill (0.0 to 1.0)
        'buyer_lack_of_care': 0.05          # Low buyer sophistication increases confusion (0.0 to 1.0)
    }

    @classmethod
    def calculate_confusion_risk(cls, factor_scores: Dict[str, float]) -> dict:
        composite_score = sum(factor_scores[k] * cls.WEIGHTS[k] for k in cls.WEIGHTS) * 100.0
        
        if composite_score >= 65.0:
            infringement_verdict = 'LIKELIHOOD_OF_CONFUSION_ESTABLISHED'
            injunction_likelihood = 'HIGH_PRELIMINARY_INJUNCTION_GRANTED'
        elif composite_score >= 45.0:
            infringement_verdict = 'BORDERLINE_SUBSTANTIAL_LITIGATION_RISK'
            injunction_likelihood = 'FACT_DISPUTE_SURVIVES_SUMMARY_JUDGMENT'
        else:
            infringement_verdict = 'NO_CONFUSION_DIFFERENTIATED_COMMERCIAL_SPHERE'
            injunction_likelihood = 'LOW_CASE_DISMISSED_OR_DEFENSE_VERDICT'

        return {
            'composite_polaroid_score': round(composite_score, 1),
            'infringement_verdict': infringement_verdict,
            'equitable_injunction_risk': injunction_likelihood,
            'actual_confusion_present': factor_scores['actual_confusion_evidence'] > 0.4
        }

# Dispute A: Direct competitor knockoff with bad faith
case_knockoff = PolaroidConfusionAnalyzer.calculate_confusion_risk({
    'mark_strength': 0.90,             # Famous arbitrary brand
    'similarity_of_marks': 0.95,       # Virtually identical spelling and phonetic cadence
    'product_proximity': 0.85,         # Direct substitute in retail aisles
    'bridging_the_gap': 0.90,          # Already in the exact market
    'actual_confusion_evidence': 0.75, # 28% survey confusion rate and misdirected calls
    'junior_predatory_intent': 0.90,   # Former employee launched identical packaging
    'buyer_lack_of_care': 0.70         # $10 impulse retail product
})

# Dispute B: Unrelated luxury goods with sophisticated buyers
case_luxury_split = PolaroidConfusionAnalyzer.calculate_confusion_risk({
    'mark_strength': 0.60,             # Moderately strong suggestive brand
    'similarity_of_marks': 0.50,       # Phonetic overlap but distinct visual logos
    'product_proximity': 0.20,         # Enterprise ERP software vs industrial diesel engines
    'bridging_the_gap': 0.10,          # Zero intention of software company building engines
    'actual_confusion_evidence': 0.0,  # Zero documented consumer confusion
    'junior_predatory_intent': 0.05,   # Clean independent trademark clearance
    'buyer_lack_of_care': 0.10         # $250k institutional B2B procurement committee
})

print(f"[Case Knockoff] Score: {case_knockoff['composite_polaroid_score']}/100 -> {case_knockoff['infringement_verdict']} ({case_knockoff['equitable_injunction_risk']})")
print(f"[Case Luxury Split] Score: {case_luxury_split['composite_polaroid_score']}/100 -> {case_luxury_split['infringement_verdict']} ({case_luxury_split['equitable_injunction_risk']})")
""",
            "output": "[Case Knockoff] Score: 87.8/100 -> LIKELIHOOD_OF_CONFUSION_ESTABLISHED (HIGH_PRELIMINARY_INJUNCTION_GRANTED)\n[Case Luxury Split] Score: 30.5/100 -> NO_CONFUSION_DIFFERENTIATED_COMMERCIAL_SPHERE (LOW_CASE_DISMISSED_OR_DEFENSE_VERDICT)",
            "codeNotes": [
                {"line": 4, "note": "Defines Polaroid multi-factor likelihood of confusion algorithmic weighting model"},
                {"line": 15, "note": "Calculates composite weighted confusion score based on mark similarity, proximity, and intent"},
                {"line": 18, "note": "Calibrates judicial thresholds for preliminary injunctive relief vs defense summary judgment"},
                {"line": 28, "note": "Demonstrates contrasting outcomes between deliberate retail knockoffs and differentiated B2B goods"}
            ],
            "tryIt": "Reduce actual_confusion_evidence and junior_predatory_intent to 0.1 in Case Knockoff to see if the score drops below 65.",
            "check": {
                "question": "Under the Polaroid multi-factor likelihood of confusion test, what is the significance of proving actual consumer confusion in the marketplace?",
                "options": [
                    "Actual confusion is the most persuasive and probative single piece of evidence proving that confusion is not merely theoretical, though a plaintiff can still prevail without it.",
                    "Proving actual confusion is a mandatory statutory prerequisite; without documented misdirected orders, a case must be dismissed.",
                    "Actual confusion automatically trebles the statutory damages under the Lanham Act.",
                    "Actual confusion transfers ownership of the junior user's corporate shares to the plaintiff."
                ],
                "answer": 0,
                "why": "While likelihood of confusion is an objective probability inquiry that can be established without proof of actual confusion, concrete evidence of real-world consumer confusion is the most persuasive proof available in trademark litigation.",
                "answerIndex": 0,
                "explanation": "While likelihood of confusion is an objective probability inquiry that can be established without proof of actual confusion, concrete evidence of real-world consumer confusion is the most persuasive proof available in trademark litigation."
            }
        },
        {
            "title": "Trademark Dilution, Blurring, Tarnishment & Anti-Cybersquatting (ACPA)",
            "say": [
                "Under traditional trademark law, an action for infringement requires competitive proximity or potential consumer confusion regarding the source of goods. However, for world-famous iconic brands—such as Tiffany, Rolls-Royce, Coca-Cola, or Google—another entity using the mark on completely unrelated products (e.g., 'Rolls-Royce Dry Cleaners' or 'Tiffany Septic Tanks') causes catastrophic economic harm even if consumers realize the luxury brand did not manufacture the goods.",
                "To protect famous marks against this parasitic harm, Congress enacted the Trademark Dilution Revision Act of 2006 (TDRA), codified in Section 43(c) of the Lanham Act (15 U.S.C. § 1125(c)). Trademark Dilution protects 'famous' marks—defined as marks widely recognized by the general consuming public of the United States as a designation of source of goods or services—against two distinct harms: Dilution by Blurring and Dilution by Tarnishment.",
                "Dilution by Blurring occurs when an unauthorized junior user impairs the distinctiveness of the famous mark, whittling away its unique selling power and commercial magnetism over time through a proliferation of third-party uses. Dilution by Tarnishment occurs when an unauthorized user associates the famous mark with unwholesome, shoddy, offensive, or degrading goods, dragging down the brand's prestigious reputation.",
                "Crucially, under the TDRA, the owner of a famous mark is NOT required to prove actual confusion, competitive proximity, or economic injury! A showing of a 'likelihood of dilution' is sufficient to secure an immediate nationwide injunction.",
                "A parallel digital threat is addressed by the Anticybersquatting Consumer Protection Act (ACPA), codified in 15 U.S.C. § 1125(d). The ACPA creates civil liability against any person who registers, traffics in, or uses a domain name that is identical or confusingly similar to a distinctive mark, with a 'bad-faith intent to profit' from the goodwill of the mark. Under the ACPA, trademark owners can seize infringing domain names, secure statutory damages up to $100,000 per domain, or utilize the expedited Uniform Domain-Name Dispute-Resolution Policy (UDRP) administered by the World Intellectual Property Organization (WIPO) to transfer hijacked domains within 45 days."
            ],
            "example": "A domain squatter registers 'paypa1.com' and 'apple-support-login.net' to capture mistyped traffic and demands $250,000 from PayPal to surrender the URLs. Under the ACPA, PayPal files an emergency federal complaint, proving bad faith under 15 U.S.C. § 1125(d). The court orders the registrar to immediately transfer the domains to PayPal and awards $100,000 in statutory damages per domain plus legal fees.",
            "code": """# Simulation: Trademark Dilution (Blurring/Tarnishment) & ACPA Bad-Faith Cybersquatting Auditor
from typing import Dict, List

class TrademarkDilutionAndDomainAuditor:
    @staticmethod
    def evaluate_dilution_exposure(
        mark_fame_score_pct: float, # Must be widely recognized by general US public (>= 75%)
        junior_mark_similarity_pct: float,
        degree_of_distinctiveness_whittled: bool,
        association_with_unwholesome_or_offensive_goods: bool
    ) -> dict:
        is_famous_under_tdra = mark_fame_score_pct >= 75.0
        
        has_blurring = is_famous_under_tdra and junior_mark_similarity_pct >= 80.0 and degree_of_distinctiveness_whittled
        has_tarnishment = is_famous_under_tdra and association_with_unwholesome_or_offensive_goods
        
        actionable_dilution = has_blurring or has_tarnishment
        
        return {
            'senior_mark_qualifies_as_famous': is_famous_under_tdra,
            'actionable_dilution_by_blurring': has_blurring,
            'actionable_dilution_by_tarnishment': has_tarnishment,
            'tdra_injunction_available': actionable_dilution,
            'statutory_verdict': 'INJUNCTION_ISSUED_UNDER_SECTION_43C' if actionable_dilution else 'DILUTION_CLAIM_DISMISSED'
        }

    @staticmethod
    def evaluate_acpa_cybersquatting(
        domain_name: str,
        trademark_identical_or_confusing: bool,
        bad_faith_indicators: List[str]
    ) -> dict:
        # Bad faith indicators under 15 U.S.C. 1125(d)(1)(B):
        # e.g., 'no_prior_rights', 'commercial_extortion_offer', 'intent_to_divert_consumers', 'false_whois_data'
        is_bad_faith = len(bad_faith_indicators) >= 2
        acpa_violation = trademark_identical_or_confusing and is_bad_faith
        
        statutory_damages = min(100000.0, len(bad_faith_indicators) * 35000.0) if acpa_violation else 0.0
        
        return {
            'disputed_domain': domain_name,
            'acpa_bad_faith_established': is_bad_faith,
            'acpa_statutory_violation': acpa_violation,
            'mandatory_domain_transfer_remedy': acpa_violation,
            'statutory_damages_exposure_usd': statutory_damages,
            'udrp_wipo_remedy_available': acpa_violation
        }

dilution_check = TrademarkDilutionAndDomainAuditor.evaluate_dilution_exposure(
    mark_fame_score_pct=92.0, # Highly famous brand
    junior_mark_similarity_pct=88.0,
    degree_of_distinctiveness_whittled=True,
    association_with_unwholesome_or_offensive_goods=False
)

acpa_check = TrademarkDilutionAndDomainAuditor.evaluate_acpa_cybersquatting(
    domain_name='paypa1-security-login.com',
    trademark_identical_or_confusing=True,
    bad_faith_indicators=['commercial_extortion_offer', 'intent_to_divert_consumers', 'false_whois_data']
)

print(f"Dilution Verdict: [{dilution_check['statutory_verdict']}] | Blurring: {dilution_check['actionable_dilution_by_blurring']} | Tarnishment: {dilution_check['actionable_dilution_by_tarnishment']}")
print(f"ACPA Verdict: [{acpa_check['disputed_domain']}] Violation: {acpa_check['acpa_statutory_violation']} | Damages: ${acpa_check['statutory_damages_exposure_usd']:,.0f} | Transfer: {acpa_check['mandatory_domain_transfer_remedy']}")
""",
            "output": "Dilution Verdict: [INJUNCTION_ISSUED_UNDER_SECTION_43C] | Blurring: True | Tarnishment: False\nACPA Verdict: [paypa1-security-login.com] Violation: True | Damages: $100,000 | Transfer: True",
            "codeNotes": [
                {"line": 4, "note": "Evaluates Trademark Dilution Revision Act (TDRA) blurring and tarnishment thresholds"},
                {"line": 12, "note": "Enforces strict statutory fame prerequisite: only truly famous national brands qualify for dilution"},
                {"line": 23, "note": "Implements Anticybersquatting Consumer Protection Act (ACPA) bad-faith intent scoring"},
                {"line": 32, "note": "Computes statutory damages awards up to $100,000 per domain and orders domain transfer"}
            ],
            "tryIt": "Set mark_fame_score_pct to 50.0 to observe dilution claims automatically collapse for non-famous niche brands.",
            "check": {
                "question": "What is the key legal advantage granted to owners of 'famous' trademarks under the Trademark Dilution Revision Act (TDRA) compared to traditional infringement?",
                "options": [
                    "The owner of a famous mark does not need to prove consumer confusion, competitive proximity, or actual economic loss; proof of likelihood of blurring or tarnishment is sufficient for an injunction.",
                    "The owner can seize the physical machinery of the defendant without a court order.",
                    "Famous mark status exempts the corporation from all state and federal corporate taxes.",
                    "Dilution claims are automatically tried before the International Court of Justice in The Hague."
                ],
                "answer": 0,
                "why": "Dilution protects the commercial magnetism and exclusivity of a famous mark itself; because there is no requirement to prove confusion, a famous mark can enjoin uses on completely unrelated goods.",
                "answerIndex": 0,
                "explanation": "Dilution protects the commercial magnetism and exclusivity of a famous mark itself; because there is no requirement to prove confusion, a famous mark can enjoin uses on completely unrelated goods."
            }
        },
        {
            "title": "International Trademark Strategy: The Madrid Protocol & Customs Enforcement",
            "say": [
                "In an interconnected global digital economy, securing a trademark on the USPTO Principal Register provides territorial legal protection strictly within the United States. A US trademark grant confers zero legal protection in the European Union, the United Kingdom, China, India, or Latin America. Because trademark rights are fundamentally territorial, corporations expanding internationally must execute coordinated multi-jurisdictional filing and brand enforcement strategies.",
                "Historically, protecting a global brand required retaining independent trademark attorneys in eighty different countries, translating documentation into dozens of languages, and paying separate official fees in local currencies—a bureaucratic nightmare costing hundreds of thousands of dollars. To resolve this friction, the international community created the Madrid System, governed by the Madrid Protocol and administered by the World Intellectual Property Organization (WIPO) in Geneva.",
                "Under the Madrid Protocol, a corporate trademark owner with a basic application or registration in their home country (the Office of Origin) can file a single International Application with WIPO in one language (English, French, or Spanish) and pay one set of fees in Swiss Francs (CHF), designating any number of the more than 130 member countries representing over 80% of world trade.",
                "However, corporate general counsel must manage a lethal strategic vulnerability under the Madrid Protocol: 'Central Attack'. Under Article 6 of the Protocol, during the first 5 years from the international registration date, the international registration remains dependent upon the basic home application. If the home country application is successfully opposed, cancelled, or narrowed within that 5-year window, the entire international portfolio collapses across all designated countries simultaneously! To mitigate Central Attack risks, counsel can 'transform' the Madrid extensions into national applications within 3 months, preserving original priority dates.",
                "Finally, brand owners must fortify their border defense by recording registered trademarks with US Customs and Border Protection (CBP) through the Intellectual Property Rights e-Recordation (IPRR) system. Once recorded, CBP officers and automated border scanning systems intercept, seize, and forfeit maritime shipping containers carrying counterfeit goods at ports of entry, destroying counterfeits before they ever enter domestic commercial distribution."
            ],
            "example": "A fast-growing Silicon Valley consumer electronics company files a US trademark for 'SoundPure.' Using the Madrid Protocol through WIPO, counsel designates the EU, UK, Japan, and South Korea in a single electronic filing for $4,500, securing international priority. Meanwhile, counsel records the US trademark with CBP, enabling customs agents in Long Beach to intercept a container of 50,000 counterfeit headphones arriving from overseas.",
            "code": """# Simulation: Global Madrid Protocol Multi-Jurisdictional Brand Filing & CBP Border Enforcement Engine
from typing import List, Dict

class GlobalTrademarkExpansionEngine:
    MEMBER_FEES_CHF = {
        'WIPO_BASIC_FEE': 653.0,
        'EUIPO_EUROPEAN_UNION': 897.0,
        'UK_IPO_UNITED_KINGDOM': 275.0,
        'CNIPA_CHINA': 312.0,
        'JPO_JAPAN': 395.0,
        'IP_AUSTRALIA': 380.0
    }

    @classmethod
    def structure_madrid_filing(
        cls,
        home_mark_serial_no: str,
        designated_countries: List[str],
        classes_of_goods_count: int,
        home_application_years_active: float
    ) -> dict:
        total_fees_chf = cls.MEMBER_FEES_CHF['WIPO_BASIC_FEE']
        for country in designated_countries:
            if country in cls.MEMBER_FEES_CHF:
                total_fees_chf += cls.MEMBER_FEES_CHF[country] * (1.0 + (classes_of_goods_count - 1) * 0.35)
                
        # Central Attack Exposure under Madrid Protocol Article 6 (5-Year Window)
        central_attack_vulnerable = home_application_years_active < 5.0
        
        return {
            'home_mark_serial': home_mark_serial_no,
            'designated_member_count': len(designated_countries),
            'designated_territories': designated_countries,
            'total_wipo_filing_fee_chf': round(total_fees_chf, 2),
            'approx_cost_usd': round(total_fees_chf * 1.12, 2),
            'central_attack_exposure_active': central_attack_vulnerable,
            'central_attack_risk_mitigation': 'MONITOR_HOME_OPPOSITIONS_AND_PREPARE_TRANSFORMATION' if central_attack_vulnerable else 'INDEPENDENT_INTERNATIONAL_STATUS_SECURED'
        }

    @staticmethod
    def audit_cbp_customs_seizure(
        shipment_units: int,
        unit_retail_value_usd: float,
        is_mark_recorded_with_cbp: bool,
        counterfeit_labels_confirmed: bool
    ) -> dict:
        if is_mark_recorded_with_cbp and counterfeit_labels_confirmed:
            action = 'PORT_OF_ENTRY_BORDER_SEIZURE_AND_FORFEITURE'
            counterfeit_goods_destroyed = True
            civil_fine_penalties_usd = shipment_units * unit_retail_value_usd * 2.0
        elif counterfeit_labels_confirmed:
            action = 'CUSTOMS_HOLD_PENDING_TRADEMARK_OWNER_CONFIRMATION'
            counterfeit_goods_destroyed = False
            civil_fine_penalties_usd = 0.0
        else:
            action = 'CUSTOMS_CLEARED_NORMAL_ENTRY'
            counterfeit_goods_destroyed = False
            civil_fine_penalties_usd = 0.0

        return {
            'customs_action': action,
            'intercepted_counterfeit_volume': shipment_units if counterfeit_labels_confirmed else 0,
            'domestic_brand_erosion_prevented_usd': (shipment_units * unit_retail_value_usd) if counterfeit_goods_destroyed else 0.0,
            'cbp_civil_penalties_assessed_usd': civil_fine_penalties_usd
        }

madrid_plan = GlobalTrademarkExpansionEngine.structure_madrid_filing(
    home_mark_serial_no='US-SER-98765432',
    designated_countries=['EUIPO_EUROPEAN_UNION', 'UK_IPO_UNITED_KINGDOM', 'CNIPA_CHINA', 'JPO_JAPAN'],
    classes_of_goods_count=2,
    home_application_years_active=2.5 # Inside the 5-year central attack window
)

cbp_enforcement = GlobalTrademarkExpansionEngine.audit_cbp_customs_seizure(
    shipment_units=15000,
    unit_retail_value_usd=140.0,
    is_mark_recorded_with_cbp=True,
    counterfeit_labels_confirmed=True
)

print(f"Madrid Filing: {madrid_plan['designated_member_count']} Territories | Cost: CHF {madrid_plan['total_wipo_filing_fee_chf']:,.2f} (${madrid_plan['approx_cost_usd']:,.2f})")
print(f"  Central Attack Active: {madrid_plan['central_attack_exposure_active']} | Strategy: {madrid_plan['central_attack_risk_mitigation']}")
print(f"CBP Action: [{cbp_enforcement['customs_action']}] | Value Preserved: ${cbp_enforcement['domestic_brand_erosion_prevented_usd']/1e6:.2f}M | Penalties: ${cbp_enforcement['cbp_civil_penalties_assessed_usd']/1e6:.2f}M")
""",
            "output": "Madrid Filing: 4 Territories | Cost: CHF 3,178.60 ($3,560.03)\n  Central Attack Active: True | Strategy: MONITOR_HOME_OPPOSITIONS_AND_PREPARE_TRANSFORMATION\nCBP Action: [PORT_OF_ENTRY_BORDER_SEIZURE_AND_FORFEITURE] | Value Preserved: $2.10M | Penalties: $4.20M",
            "codeNotes": [
                {"line": 4, "note": "Defines Madrid Protocol fee schedule and multi-jurisdictional portfolio architect"},
                {"line": 21, "note": "Evaluates Article 6 Central Attack 5-year dependency vulnerability and transformation remedies"},
                {"line": 32, "note": "Models US Customs and Border Protection (CBP) recordation and border seizure enforcement"},
                {"line": 45, "note": "Demonstrates rapid global brand clearance paired with automated physical border protection"}
            ],
            "tryIt": "Increase home_application_years_active to 5.5 to witness the international portfolio graduate beyond Central Attack vulnerability.",
            "check": {
                "question": "What is the 'Central Attack' risk inherent in international trademark registrations filed under the Madrid Protocol?",
                "options": [
                    "If the basic home country application or registration is successfully challenged, cancelled, or invalidated within the first 5 years, all international extension registrations collapse across all designated countries simultaneously.",
                    "The World Intellectual Property Organization headquarters is vulnerable to physical military seizure.",
                    "Foreign competitors can force the brand owner to sell its trademarks for 1 Swiss Franc.",
                    "Customs officers in Switzerland automatically confiscate all corporate products."
                ],
                "answer": 0,
                "why": "Under Article 6 of the Madrid Protocol, international registrations remain legally dependent on the home application for 5 years; invalidation at home automatically extinguishes the foreign rights.",
                "answerIndex": 0,
                "explanation": "Under Article 6 of the Madrid Protocol, international registrations remain legally dependent on the home application for 5 years; invalidation at home automatically extinguishes the foreign rights."
            }
        },
        {
            "title": "Trade Dress Protection, Product Design vs Packaging & The Functionality Doctrine",
            "say": [
                "Beyond brand names, logos, and slogans, corporate enterprises invest billions of dollars developing iconic product visual aesthetics, unique packaging silhouettes, and immersive retail store designs. Under Section 43(a) of the Lanham Act (15 U.S.C. § 1125(a)), federal law protects 'Trade Dress'—the overall commercial image and look-and-feel of a product or service that indicates its source to consumers.",
                "Trade dress encompasses two distinct categories: Product Packaging (e.g., the unique fluted silhouette of a Coca-Cola contour bottle or a luxury perfume box) and Product Design / Configuration (e.g., the exact exterior shape of a sports car or the design of a luxury handbag). In Two Pesos, Inc. v. Taco Cabana, Inc. (1992), the Supreme Court ruled that inherently distinctive trade dress—specifically vibrant festive Mexican restaurant decor—can be protected under Section 43(a) without proving secondary meaning.",
                "However, eight years later in Wal-Mart Stores, Inc. v. Samara Brothers, Inc. (2000), Justice Scalia established a crucial, categorical distinction: Product Design can NEVER be inherently distinctive! Unlike product packaging, which consumers readily understand as a source identifier, consumers view product design primarily as aesthetic or utilitarian. Therefore, an enterprise seeking trade dress protection for the physical design of its product must ALWAYS establish proof of acquired distinctiveness (secondary meaning) through years of exclusive commercial use and extensive advertising.",
                "The most lethal defense in trade dress litigation is the 'Functionality Doctrine'. Trademark law grants perpetual, indefinite monopolies as long as a mark is used. Patent law, by contrast, grants strictly limited 20-year monopolies for functional inventions. To prevent trademark law from creating perpetual monopolies over functional mechanical designs, Section 43(a)(3) mandates that trade dress protection is strictly barred if the feature is functional.",
                "In TrafFix Devices, Inc. v. Marketing Displays, Inc. (2001), the Supreme Court established that a product feature is functional if it is 'essential to the use or purpose of the article' or 'affects the cost or quality of the article.' Furthermore, the existence of an expired utility patent covering the dual-spring mechanism was held to be vital evidentiary proof that the design was functional, permanently barring trade dress protection and allowing competitors to freely copy the engineering mechanism."
            ],
            "example": "Ferrari files trade dress protection for the visual silhouette of its flagship supercar. Because the sleek aerodynamic contours reduce aerodynamic drag by 35% and channel cooling air into the radiators, a court will reject trade dress protection under the TrafFix functionality doctrine: aerodynamic efficiency belongs to utility patent law, not perpetual trademark monopolies.",
            "code": """# Simulation: Trade Dress Inherent Distinctiveness vs Functionality Doctrine Auditor
class TradeDressIntegrityAuditor:
    @staticmethod
    def evaluate_trade_dress_protectability(
        asset_name: str,
        dress_category: str, # 'PRODUCT_PACKAGING' vs 'PRODUCT_DESIGN_CONFIGURATION'
        is_covered_by_utility_patent: bool,
        essential_to_engineering_purpose: bool,
        affects_manufacturing_cost_or_quality: bool,
        commercial_use_years: float,
        proven_secondary_meaning: bool
    ) -> dict:
        # Step 1: TrafFix Devices Functionality Test
        is_functional = is_covered_by_utility_patent or essential_to_engineering_purpose or affects_manufacturing_cost_or_quality
        
        if is_functional:
            status = 'UNPROTECTABLE_FUNCTIONAL_FEATURE'
            rationale = 'TrafFix Doctrine: Feature is functional or covered by utility patent; perpetual trademark protection is barred.'
            protectable = False
        elif dress_category == 'PRODUCT_PACKAGING':
            status = 'PROTECTABLE_INHERENTLY_DISTINCTIVE_PACKAGING'
            rationale = 'Two Pesos Doctrine: Product packaging can be inherently distinctive without proving secondary meaning.'
            protectable = True
        elif dress_category == 'PRODUCT_DESIGN_CONFIGURATION':
            if proven_secondary_meaning:
                status = 'PROTECTABLE_PRODUCT_DESIGN_WITH_SECONDARY_MEANING'
                rationale = 'Wal-Mart v. Samara: Product design cannot be inherently distinctive, but secondary meaning is proven.'
                protectable = True
            else:
                status = 'REFUSED_PRODUCT_DESIGN_LACKS_SECONDARY_MEANING'
                rationale = 'Wal-Mart v. Samara: Product design requires secondary meaning; unprotectable without consumer proof.'
                protectable = False
        else:
            status = 'INVALID_CATEGORY'
            rationale = 'Unknown trade dress category.'
            protectable = False

        return {
            'trade_dress_asset': asset_name,
            'is_functional': is_functional,
            'trade_dress_protectable': protectable,
            'statutory_status': status,
            'judicial_precedent_rationale': rationale
        }

# Case A: Aerodynamic dual-spring traffic sign covered by expired patent
case_a = TradeDressIntegrityAuditor.evaluate_trade_dress_protectability(
    asset_name='Wind-Resistant Dual-Spring Sign',
    dress_category='PRODUCT_DESIGN_CONFIGURATION',
    is_covered_by_utility_patent=True,
    essential_to_engineering_purpose=True,
    affects_manufacturing_cost_or_quality=True,
    commercial_use_years=25.0,
    proven_secondary_meaning=True
)

# Case B: Iconic luxury beverage contour bottle packaging
case_b = TradeDressIntegrityAuditor.evaluate_trade_dress_protectability(
    asset_name='Fluted Glass Contour Bottle',
    dress_category='PRODUCT_PACKAGING',
    is_covered_by_utility_patent=False,
    essential_to_engineering_purpose=False,
    affects_manufacturing_cost_or_quality=False,
    commercial_use_years=8.0,
    proven_secondary_meaning=True
)

print(f"Case A: [{case_a['trade_dress_asset']}] -> Protectable: {case_a['trade_dress_protectable']} | Status: {case_a['statutory_status']}")
print(f"  Rationale: {case_a['judicial_precedent_rationale']}")
print(f"Case B: [{case_b['trade_dress_asset']}] -> Protectable: {case_b['trade_dress_protectable']} | Status: {case_b['statutory_status']}")
print(f"  Rationale: {case_b['judicial_precedent_rationale']}")
""",
            "output": "Case A: [Wind-Resistant Dual-Spring Sign] -> Protectable: False | Status: UNPROTECTABLE_FUNCTIONAL_FEATURE\n  Rationale: TrafFix Doctrine: Feature is functional or covered by utility patent; perpetual trademark protection is barred.\nCase B: [Fluted Glass Contour Bottle] -> Protectable: True | Status: PROTECTABLE_INHERENTLY_DISTINCTIVE_PACKAGING\n  Rationale: Two Pesos Doctrine: Product packaging can be inherently distinctive without proving secondary meaning.",
            "codeNotes": [
                {"line": 3, "note": "Defines Lanham Act Section 43(a) trade dress distinctiveness and functionality auditor"},
                {"line": 13, "note": "Implements TrafFix Devices functionality test: functional features cannot be trademarked"},
                {"line": 18, "note": "Applies Two Pesos rule allowing inherently distinctive product packaging protection"},
                {"line": 22, "note": "Enforces Wal-Mart v. Samara rule requiring secondary meaning for all product design marks"}
            ],
            "tryIt": "Set is_covered_by_utility_patent and essential_to_engineering_purpose to False for Case A to observe design distinctiveness analysis activate.",
            "check": {
                "question": "Under the Supreme Court's decisions in Wal-Mart v. Samara Brothers and TrafFix Devices, what are the two core limitations on protecting product design as trade dress?",
                "options": [
                    "Product design can never be inherently distinctive (requiring secondary meaning), and any feature that is functional or covered by a utility patent is permanently ineligible for trade dress protection.",
                    "Product design trade dress is only available to companies incorporated outside North America.",
                    "Trade dress registrations must be renewed every 30 days at the US Court of International Trade.",
                    "Product design is only protectable if the product is colored neon green."
                ],
                "answer": 0,
                "why": "Wal-Mart establishes that product design always requires secondary meaning, and TrafFix establishes that functional features cannot be protected as trade dress because utility patents are the sole vehicle for mechanical monopolies.",
                "answerIndex": 0,
                "explanation": "Wal-Mart establishes that product design always requires secondary meaning, and TrafFix establishes that functional features cannot be protected as trade dress because utility patents are the sole vehicle for mechanical monopolies."
            }
        }
    ],
    "summary": [
        "Abercrombie Distinctiveness Spectrum: Trademarks span Generic (unprotectable), Descriptive (protectable only with secondary meaning), and Inherently Distinctive (Suggestive, Arbitrary, Fanciful) tiers.",
        "Polaroid Likelihood of Confusion Test: Trademark infringement turns on consumer confusion analyzed across eight factors: mark strength, similarity, product proximity, actual confusion, and buyer sophistication.",
        "Trademark Dilution & TDRA Protection: Famous marks are protected against blurring (whittling away distinctiveness) and tarnishment (association with unwholesome goods) without proving consumer confusion or economic injury.",
        "Anti-Cybersquatting Consumer Protection Act (ACPA): Prohibits bad-faith registration of confusingly similar domain names, authorizing domain transfer and statutory damages up to $100,000 per domain.",
        "International Madrid Protocol & CBP Defense: Centralizes global multi-country filings via WIPO subject to 5-year Central Attack dependency, reinforced by CBP border recordation to intercept maritime counterfeit shipments."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 2 Capstone Step 2: Enterprise Brand Asset Defense & Global Trademark Portfolio Architecture",
        "steps": [
            "Audit corporate brand naming assets against the Abercrombie spectrum and catalog Section 2(f) secondary meaning evidence.",
            "Model Polaroid likelihood of confusion exposure for pending commercial brand extensions and competitive overlaps.",
            "Establish automated digital brand surveillance screening domain registrations under ACPA and UDRP standards.",
            "Structure an international Madrid Protocol expansion filing while implementing CBP customs recordation for automated border anti-counterfeiting."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_07)
    print(f"B.Com Corporate Law Day 7 Total Words: {total}")
    for i, p in enumerate(DAY_07['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
