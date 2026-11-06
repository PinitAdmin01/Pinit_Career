"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 6 Builder: Patent Law & Patentability Invariants (35 U.S.C. 101/102/103 & FTO)
Milestone 2 Kickoff: Intellectual Property & Technology Licensing Architecture
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_06 = {
    "coursePrefix": "bcom_law",
    "day": 6,
    "title": "Patent Law & Patentability Invariants: 35 U.S.C. §§ 101, 102, 103 & Freedom-to-Operate",
    "goal": "Master patent jurisprudence and statutory invariants under 35 U.S.C. §§ 101 (eligible subject matter), 102 (novelty and prior art anticipation), and 103 (non-obviousness), model Patent Prosecution Highway claims, and conduct institutional Freedom-to-Operate (FTO) clearance audits.",
    "minutes": 45,
    "recap": "In Milestone 1 (Days 1–5), we mastered foundational commercial contracts, veil piercing, director fiduciary duties under the Business Judgment Rule, SEC Rule 10b-5 insider trading, and Chapter 11 restructuring. Today we launch Milestone 2: Intellectual Property, Technology Licensing, Brand Protection & Trade Secret Asset Governance.",
    "parts": [
        {
            "title": "Patentable Subject Matter & The Alice/Mayo Two-Step Framework (35 U.S.C. § 101)",
            "say": [
                "Patent protection confers a government-sanctioned 20-year legal monopoly from the filing date, granting the patentee the exclusive right to exclude all other commercial competitors from making, using, selling, offering for sale, or importing the claimed invention into the territorial jurisdiction. However, not every breakthrough concept or technical algorithm qualifies for patent protection. Under Section 101 of the Patent Act (35 U.S.C. § 101), whoever invents or discovers any new and useful process, machine, manufacture, or composition of matter, or any new and useful improvement thereof, may obtain a patent, subject to the conditions and requirements of Title 35.",
                "For over a century, the Supreme Court has recognized three critical judicial exceptions to Section 101 patent eligibility: Laws of Nature, Natural Phenomena, and Abstract Ideas. An enterprise cannot patent the law of gravity, a naturally occurring DNA sequence in the human genome, or pure mathematical formulas. In the landmark decisions Mayo Collaborative Services v. Prometheus Laboratories (2012) and Alice Corp. Pty. Ltd. v. CLS Bank International (2014), the Supreme Court established the mandatory Alice/Mayo Two-Step Framework to resolve subject matter eligibility.",
                "Under Step 1 of Alice, the examining court or patent examiner must determine whether the patent claims as a whole are directed to one of the patent-ineligible concepts—most frequently an 'abstract idea' such as fundamental economic practices, methods of organizing human activity, mathematical calculations, or data manipulation. If the claims are directed to an abstract idea, the analysis proceeds immediately to Step 2: searching for an 'Inventive Concept' (significantly more than the ineligible concept itself).",
                "Under Step 2, the patent applicant must prove that the claim elements, considered individually and as an ordered combination, transform the nature of the claim into a patent-eligible application. Merely stating an abstract idea and appending the phrase 'apply it on a generic computer' or 'transmit over the internet' is fundamentally insufficient. The patent must disclose a specific technological improvement to the functioning of the computer system itself (e.g., specialized data structures, memory caching architectures, or hardware signal processing) or an inventive unconventional combination of elements that solves a technical problem.",
                "For corporate general counsel and enterprise technology executives, Alice/Mayo represents an existential litigation battlefield. Thousands of software patents, fintech clearing systems, and algorithmic trading patents have been invalidated under Rule 12(b)(6) motions to dismiss before trial. To secure resilient patent protection, corporate patent attorneys must draft patent specifications that meticulously ground software inventions in concrete physical transformations, unconventional technical architectures, and measurable hardware efficiency gains."
            ],
            "example": "A fintech corporation files a patent claim for 'an automated electronic escrow system where a central computer verifies buyer deposit before releasing securities.' Federal courts invalidate the patent under Alice Step 2 because escrow is a fundamental abstract economic practice, and executing it on generic web servers adds no inventive concept. Conversely, a cybersecurity company patenting a deep packet inspection firewall using hardware ring buffer hashing is upheld because it improves computer network functioning itself.",
            "code": """# Simulation: Alice/Mayo Two-Step Patent Subject Matter Eligibility Engine
from typing import Dict, List

def evaluate_alice_mayo_patentability(
    claim_id: str,
    claim_title: str,
    directed_to_abstract_concept: bool,
    abstract_category: str, # 'MATHEMATICAL_FORMULA', 'ECONOMIC_PRACTICE', 'DATA_MANIPULATION', 'NONE'
    generic_computer_implementation_only: bool,
    improves_computer_functionality: bool,
    unconventional_technical_combination: bool
) -> dict:
    step1_is_abstract = directed_to_abstract_concept and abstract_category != 'NONE'
    
    # Step 2: Search for Inventive Concept ('Significantly More')
    has_inventive_concept = (improves_computer_functionality or unconventional_technical_combination) and not generic_computer_implementation_only
    
    if not step1_is_abstract:
        status_101 = 'ELIGIBLE_STATUTORY_SUBJECT_MATTER'
        rationale = 'Claim is directed to a technological process or machine, not a judicial exception.'
        survives_motion_to_dismiss = True
    elif has_inventive_concept:
        status_101 = 'ELIGIBLE_UNDER_ALICE_STEP_2'
        rationale = f'Directed to {abstract_category}, but contains a transformative inventive concept improving technological functioning.'
        survives_motion_to_dismiss = True
    else:
        status_101 = 'INVALID_UNDER_ALICE_SECTION_101'
        rationale = f'Directed to patent-ineligible {abstract_category} with mere generic computer implementation; lacks an inventive concept.'
        survives_motion_to_dismiss = False

    return {
        'claim_id': claim_id,
        'claim_title': claim_title,
        'step1_abstract_idea': step1_is_abstract,
        'step2_inventive_concept_present': has_inventive_concept,
        'section_101_verdict': status_101,
        'survives_rule_12b6_motion': survives_motion_to_dismiss,
        'judicial_rationale': rationale
    }

# Claim A: Generic cloud-based e-commerce escrow
eval_claim_a = evaluate_alice_mayo_patentability(
    claim_id='US-PAT-901-A',
    claim_title='Automated Cloud Escrow Clearing',
    directed_to_abstract_concept=True,
    abstract_category='ECONOMIC_PRACTICE',
    generic_computer_implementation_only=True,
    improves_computer_functionality=False,
    unconventional_technical_combination=False
)

# Claim B: Zero-copy DMA packet inspection kernel
eval_claim_b = evaluate_alice_mayo_patentability(
    claim_id='US-PAT-902-B',
    claim_title='Hardware Ring Buffer Deep Packet Slicer',
    directed_to_abstract_concept=False,
    abstract_category='NONE',
    generic_computer_implementation_only=False,
    improves_computer_functionality=True,
    unconventional_technical_combination=True
)

print(f"[{eval_claim_a['claim_id']}] Verdict: {eval_claim_a['section_101_verdict']} | Survives 12(b)(6): {eval_claim_a['survives_rule_12b6_motion']}")
print(f"  Rationale: {eval_claim_a['judicial_rationale']}")
print(f"[{eval_claim_b['claim_id']}] Verdict: {eval_claim_b['section_101_verdict']} | Survives 12(b)(6): {eval_claim_b['survives_rule_12b6_motion']}")
print(f"  Rationale: {eval_claim_b['judicial_rationale']}")
""",
            "output": "[US-PAT-901-A] Verdict: INVALID_UNDER_ALICE_SECTION_101 | Survives 12(b)(6): False\n  Rationale: Directed to patent-ineligible ECONOMIC_PRACTICE with mere generic computer implementation; lacks an inventive concept.\n[US-PAT-902-B] Verdict: ELIGIBLE_STATUTORY_SUBJECT_MATTER | Survives 12(b)(6): True\n  Rationale: Claim is directed to a technological process or machine, not a judicial exception.",
            "codeNotes": [
                {"line": 4, "note": "Defines two-step Alice/Mayo statutory eligibility evaluator"},
                {"line": 15, "note": "Evaluates Step 1 judicial exception: laws of nature, natural phenomena, or abstract ideas"},
                {"line": 18, "note": "Evaluates Step 2 search for inventive concept transforming claim into significantly more"},
                {"line": 25, "note": "Emits Section 101 patentability verdict and assesses susceptibility to pre-trial dismissal"}
            ],
            "tryIt": "Set generic_computer_implementation_only to False and improves_computer_functionality to True for Claim A to witness it survive under Alice Step 2.",
            "check": {
                "question": "Under the Supreme Court's Alice/Mayo two-step framework, when is a software-implemented invention eligible for patent protection under 35 U.S.C. § 101?",
                "options": [
                    "When the patent claims recite an inventive concept that provides a specific technological improvement to the functioning of a computer or network, rather than merely implementing an abstract idea on generic hardware.",
                    "Whenever the software application is written in an object-oriented programming language like C++ or Java.",
                    "Only when the software program generates over $1 million in commercial subscription revenues.",
                    "Whenever the source code is filed under an open-source MIT or Apache license."
                ],
                "answer": 0,
                "why": "Alice Step 2 requires an inventive concept that transforms an abstract concept into eligible subject matter by improving underlying computer technology or solving a technical problem in an unconventional manner.",
                "answerIndex": 0,
                "explanation": "Alice Step 2 requires an inventive concept that transforms an abstract concept into eligible subject matter by improving underlying computer technology or solving a technical problem in an unconventional manner."
            }
        },
        {
            "title": "Novelty & Prior Art Anticipation Invariants (35 U.S.C. § 102)",
            "say": [
                "Even if an invention clears the threshold hurdle of Section 101 subject matter eligibility, it must satisfy the fundamental constitutional requirement of Novelty under Section 102 of the Patent Act (35 U.S.C. § 102). A patent grant represents a reciprocal bargain with the public: in exchange for publicly disclosing a technical advancement, the inventor receives a limited monopoly. If the technical knowledge was already in the public domain, the public receives no consideration, and the patent must be rejected.",
                "Following the enactment of the Leahy-Smith America Invents Act (AIA) in 2011, the United States transitioned from a historic 'First-to-Invent' system to an internationalized 'First-Inventor-to-File' (FITF) system. Under 35 U.S.C. § 102(a)(1), a person is entitled to a patent unless the claimed invention was patented, described in a printed publication, or in public use, on sale, or otherwise available to the public before the effective filing date of the claimed invention.",
                "The legal standard for Novelty is strict: Anticipation. An Examiner or litigation adversary cannot stitch together three different textbooks to establish a lack of novelty. To anticipate a patent claim under Section 102, a single prior art reference must disclose, either expressly or inherently, each and every element of the claimed invention arranged in the exact same manner. If even a single claim limitation is missing from that single prior art reference, the claim is novel under Section 102 (though it must still survive Section 103 obviousness scrutiny).",
                "Furthermore, corporate patent strategists must rigorously manage the Section 102(b) Grace Period. In the United States, an inventor receives a limited 1-year grace period for their own public disclosures or sales before their effective filing date. However, relying on this grace period is catastrophic for global enterprise IP strategies: virtually all foreign jurisdictions—including the European Patent Office (EPO), China National Intellectual Property Administration (CNIPA), and Japan Patent Office (JPO)—enforce strict 'Absolute Novelty', wherein any public disclosure anywhere in the world prior to the priority filing date permanently extinguishes patent rights.",
                "Corporate executives and engineering teams must enforce strict Non-Disclosure Agreements (NDAs) and pre-filing secrecy protocols. Announcing a product feature at an industry trade show, publishing a whitepaper, or releasing an open-source repository prior to filing a provisional patent application permanently forfeits multi-million-dollar foreign patent monopolies."
            ],
            "example": "A biomedical startup invents a dual-chamber glucose infusion pump. On January 10, the lead scientist presents a technical slide deck detailing every valve, microcontroller sensor, and microfluidic channel at an unrecorded medical conference. If the startup files a patent on July 10, the US filing survives under the 1-year grace period of § 102(b), but all European and Asian patent applications are immediately voided under absolute novelty rules.",
            "code": """# Simulation: Patent Prior Art Anticipation & Section 102 Novelty Checker
from typing import List, Set

def evaluate_section_102_novelty(
    claim_id: str,
    claim_elements: List[str],
    prior_art_references: List[dict],
    effective_filing_date_days_ago: int,
    inventor_own_disclosure_days_ago: int = None
) -> dict:
    claim_set = set(e.lower().strip() for e in claim_elements)
    anticipating_references = []
    
    # Check grace period under AIA 102(b)
    us_grace_period_valid = False
    if inventor_own_disclosure_days_ago is not None:
        us_grace_period_valid = inventor_own_disclosure_days_ago <= 365
        
    for ref in prior_art_references:
        ref_elements = set(e.lower().strip() for e in ref['disclosed_elements'])
        is_prior_to_filing = ref['publication_days_ago'] > effective_filing_date_days_ago
        
        # Single reference must disclose 100% of claim elements
        if claim_set.issubset(ref_elements) and is_prior_to_filing:
            # Check if reference is shielded by inventor grace period
            if ref.get('is_inventor_own_work', False) and us_grace_period_valid:
                continue
            anticipating_references.append(ref['reference_citation'])
            
    is_novel = len(anticipating_references) == 0
    
    return {
        'claim_id': claim_id,
        'total_claim_elements_checked': len(claim_elements),
        'anticipating_prior_art_count': len(anticipating_references),
        'anticipating_references': anticipating_references,
        'us_section_102_novel': is_novel,
        'international_absolute_novelty_risk': inventor_own_disclosure_days_ago is not None and inventor_own_disclosure_days_ago > 0,
        'statutory_verdict': 'NOVEL_UNDER_SECTION_102' if is_novel else 'ANTICIPATED_LACKS_NOVELTY'
    }

claim_elements_pump = [
    "dual_fluid_reservoir",
    "piezoelectric_actuator",
    "capacitive_glucose_sensor",
    "bluetooth_low_energy_transceiver",
    "fail_safe_occlusion_lock"
]

prior_art_database = [
    {
        'reference_citation': 'US Pat. 7,890,111 (Medtronic 2018)',
        'disclosed_elements': ["dual_fluid_reservoir", "piezoelectric_actuator", "bluetooth_low_energy_transceiver"],
        'publication_days_ago': 800,
        'is_inventor_own_work': False
    },
    {
        'reference_citation': 'Journal of Bio-Engineering (Smith 2021)',
        'disclosed_elements': ["dual_fluid_reservoir", "piezoelectric_actuator", "capacitive_glucose_sensor", "bluetooth_low_energy_transceiver", "fail_safe_occlusion_lock"],
        'publication_days_ago': 450,
        'is_inventor_own_work': False
    }
]

novelty_result = evaluate_section_102_novelty(
    claim_id='CLAIM-1-MED-PUMP',
    claim_elements=claim_elements_pump,
    prior_art_references=prior_art_database,
    effective_filing_date_days_ago=100,
    inventor_own_disclosure_days_ago=None
)

print(f"Claim: {novelty_result['claim_id']} | Status: [{novelty_result['statutory_verdict']}]")
print(f"  Anticipating References ({novelty_result['anticipating_prior_art_count']}): {novelty_result['anticipating_references']}")
print(f"  US Section 102 Novel: {novelty_result['us_section_102_novel']} | Global Absolute Novelty Breach: {novelty_result['international_absolute_novelty_risk']}")
""",
            "output": "Claim: CLAIM-1-MED-PUMP | Status: [ANTICIPATED_LACKS_NOVELTY]\n  Anticipating References (1): ['Journal of Bio-Engineering (Smith 2021)']\n  US Section 102 Novel: False | Global Absolute Novelty Breach: False",
            "codeNotes": [
                {"line": 4, "note": "Defines Section 102 anticipation and novelty verification engine"},
                {"line": 15, "note": "Enforces all-elements rule: a single prior art document must disclose 100% of claim limitations"},
                {"line": 21, "note": "Evaluates Leahy-Smith AIA Section 102(b) 1-year domestic grace period exceptions"},
                {"line": 31, "note": "Emits statutory anticipation verdict and highlights foreign absolute novelty forfeiture risks"}
            ],
            "tryIt": "Add a unique limitation like 'quantum_dot_spectrometer' to claim_elements_pump to observe the claim clear Section 102 as NOVEL.",
            "check": {
                "question": "What is the legal standard required to invalidate a patent claim for lack of novelty (anticipation) under 35 U.S.C. § 102?",
                "options": [
                    "A single prior art reference must disclose, either expressly or inherently, each and every element of the claimed invention.",
                    "Three independent patents must disclose at least 50% of the claim elements in aggregate.",
                    "The Examiner must prove that the inventor had a subjective intent to copy competitor technology.",
                    "The patent must have been rejected by at least two foreign patent offices."
                ],
                "answer": 0,
                "why": "Anticipation under Section 102 requires identity: a single prior art document, patent, or public sale must contain every single limitation recited in the patent claim.",
                "answerIndex": 0,
                "explanation": "Anticipation under Section 102 requires identity: a single prior art document, patent, or public sale must contain every single limitation recited in the patent claim."
            }
        },
        {
            "title": "Non-Obviousness & The Graham v. John Deere Framework (35 U.S.C. § 103)",
            "say": [
                "While Section 102 prevents an inventor from re-patenting an identical pre-existing technology, Section 103 (35 U.S.C. § 103) addresses the far more prevalent and contentious patent hurdle: Non-Obviousness. An invention may be strictly novel—in that no single prior art document discloses all of its parts—yet still be legally unpatentable if the advancement represents an obvious, trivial combination of known elements.",
                "Under Section 103, a patent may not be obtained if the differences between the claimed invention and the prior art are such that the claimed invention as a whole would have been obvious before the effective filing date of the claimed invention to a Person Having Ordinary Skill in the Art (PHOSITA) to which the claimed invention pertains.",
                "To eliminate subjective hindsight bias, the Supreme Court established the mandatory four-factor factual inquiry in Graham v. John Deere Co. (1966): (1) Determining the scope and content of the prior art, (2) Ascertaining the differences between the prior art and the claims at issue, (3) Resolving the level of ordinary skill in the pertinent art, and (4) Evaluating objective secondary considerations of non-obviousness.",
                "In KSR International Co. v. Teleflex Inc. (2007), the Supreme Court rejected rigid, formulaic obviousness rules (such as the rigid 'Teaching, Suggestion, or Motivation' test), holding that an Examiner or judge may rely on common sense, market pressure, and predictable combinations of known elements. If a PHOSITA would have found it obvious to try a finite number of predictable solutions with a reasonable expectation of success, the claim is obvious under Section 103.",
                "However, patent applicants and litigators wield a powerful counter-weapon: Graham Factor 4 Secondary Considerations of Non-Obviousness (often termed 'objective indicia'). Objective evidence of commercial success directly linked to the patented feature, long-felt but unresolved industry need, failure of sophisticated competitors to solve the problem, unexpected technical results, and industry skepticism or copying by competitors can decisively rebut a prima facie obviousness rejection."
            ],
            "example": "An automotive engineering team combines an adjustable gas pedal with an electronic pedal position sensor. Both components were widely known in separate patents. Under KSR v. Teleflex, the Supreme Court ruled the combination obvious because placing a known sensor on a known adjustable pedal was a predictable mechanical combination yielding no unexpected results. If the team had proven that electronic sensors previously caught fire when attached to adjustable linkages and their novel mounting solved that long-felt defect, secondary indicia would have rescued the patent.",
            "code": """# Simulation: Graham v. John Deere & KSR Non-Obviousness Evaluation Matrix
class PatentObviousnessEvaluator:
    @staticmethod
    def evaluate_section_103_patentability(
        claim_id: str,
        prior_art_combination_predictable: bool,
        reasonable_expectation_of_success: bool,
        synergistic_unexpected_results: bool,
        commercial_success_nexus: bool,
        long_felt_unresolved_need_solved: bool,
        competitor_copying_proven: bool
    ) -> dict:
        # Step 1: Prima Facie Obviousness Case (KSR Analysis)
        prima_facie_obvious = prior_art_combination_predictable and reasonable_expectation_of_success and not synergistic_unexpected_results
        
        # Step 2: Rebuttal via Objective Secondary Considerations
        secondary_points = 0
        if commercial_success_nexus:
            secondary_points += 30
        if long_felt_unresolved_need_solved:
            secondary_points += 40
        if competitor_copying_proven:
            secondary_points += 30
        if synergistic_unexpected_results:
            secondary_points += 50
            
        has_sufficient_rebuttal = secondary_points >= 60
        
        if not prima_facie_obvious:
            verdict = 'NON_OBVIOUS_SECTION_103_CLEARED'
            rationale = 'Combination yields unexpected synergistic results beyond ordinary skill of a PHOSITA.'
        elif has_sufficient_rebuttal:
            verdict = 'NON_OBVIOUS_SAVED_BY_SECONDARY_CONSIDERATIONS'
            rationale = f'Prima facie obviousness successfully rebutted by objective indicia (Score: {secondary_points}/100).'
        else:
            verdict = 'OBVIOUS_UNDER_SECTION_103'
            rationale = f'Predictable assembly of known elements lacking unexpected synergy or sufficient secondary evidence (Score: {secondary_points}/100).'

        return {
            'claim_id': claim_id,
            'prima_facie_obvious': prima_facie_obvious,
            'secondary_indicia_score': secondary_points,
            'statutory_103_verdict': verdict,
            'legal_rationale': rationale
        }

# Case 1: Routine component combination lacking commercial proof
case_1 = PatentObviousnessEvaluator.evaluate_section_103_patentability(
    claim_id='CLAIM-AUTO-PEDAL-01',
    prior_art_combination_predictable=True,
    reasonable_expectation_of_success=True,
    synergistic_unexpected_results=False,
    commercial_success_nexus=False,
    long_felt_unresolved_need_solved=False,
    competitor_copying_proven=False
)

# Case 2: Breakthrough combination solving 10-year defect with competitor copying
case_2 = PatentObviousnessEvaluator.evaluate_section_103_patentability(
    claim_id='CLAIM-BATTERY-ANODE-99',
    prior_art_combination_predictable=True,
    reasonable_expectation_of_success=True,
    synergistic_unexpected_results=True,
    commercial_success_nexus=True,
    long_felt_unresolved_need_solved=True,
    competitor_copying_proven=True
)

print(f"Case 1: [{case_1['claim_id']}] -> {case_1['statutory_103_verdict']}")
print(f"  Rationale: {case_1['legal_rationale']}")
print(f"Case 2: [{case_2['claim_id']}] -> {case_2['statutory_103_verdict']}")
print(f"  Rationale: {case_2['legal_rationale']}")
""",
            "output": "Case 1: [CLAIM-AUTO-PEDAL-01] -> OBVIOUS_UNDER_SECTION_103\n  Rationale: Predictable assembly of known elements lacking unexpected synergy or sufficient secondary evidence (Score: 0/100).\nCase 2: [CLAIM-BATTERY-ANODE-99] -> NON_OBVIOUS_SECTION_103_CLEARED\n  Rationale: Combination yields unexpected synergistic results beyond ordinary skill of a PHOSITA.",
            "codeNotes": [
                {"line": 3, "note": "Implements Graham v. John Deere and KSR v. Teleflex obviousness evaluation matrix"},
                {"line": 13, "note": "Assesses prima facie obviousness based on predictable combinations and expectation of success"},
                {"line": 16, "note": "Calculates weight of objective secondary considerations: commercial success, long-felt need, and copying"},
                {"line": 26, "note": "Determines whether prima facie case is rebutted or sustained under Section 103"}
            ],
            "tryIt": "Enable commercial_success_nexus and long_felt_unresolved_need_solved in Case 1 to witness secondary considerations rescue the claim.",
            "check": {
                "question": "Under Graham v. John Deere and KSR v. Teleflex, how can a patent applicant overcome an Examiner's prima facie obviousness rejection under 35 U.S.C. § 103?",
                "options": [
                    "By presenting objective evidence of secondary considerations, such as long-felt but unresolved industry need, unexpected synergistic results, commercial success tied directly to the invention, or competitor copying.",
                    "By paying an accelerated examination fee to the Patent Office.",
                    "By threatening to relocate corporate manufacturing offshore.",
                    "By removing all independent claims and submitting only abstract flowcharts."
                ],
                "answer": 0,
                "why": "Objective secondary considerations provide concrete real-world economic proof that an invention was not obvious to competitors at the time of filing, effectively defeating hindsight bias.",
                "answerIndex": 0,
                "explanation": "Objective secondary considerations provide concrete real-world economic proof that an invention was not obvious to competitors at the time of filing, effectively defeating hindsight bias."
            }
        },
        {
            "title": "Patent Prosecution, Claim Drafting & Freedom-to-Operate (FTO) Clearance",
            "say": [
                "Securing and defending commercial monopoly power requires strategic excellence across two distinct disciplines: Patent Prosecution (the administrative process of obtaining a patent from the Patent Office) and Freedom-to-Operate (FTO) Clearance (ensuring that commercializing your own product does not infringe competitor patents).",
                "Patent claims define the legal boundaries of the property right—often analogized to the 'metes and bounds' of real estate deeds. Claim drafting follows a strict inverted pyramid structure: independent claims recite only the essential, irreducible limitations to maximize claim breadth and commercial coverage, while dependent claims progressively add narrower structural limitations to provide fallback defense positions if the broad independent claims are invalidated during litigation.",
                "During prosecution before the United States Patent and Trademark Office (USPTO), applicants frequently encounter Office Actions rejecting claims under Sections 101, 102, or 103. In response, patent attorneys amend claim language or present legal arguments. However, attorneys must navigate Prosecution History Estoppel (the file wrapper estoppel doctrine): any claim scope surrendered via amendment or argument to overcome a prior art rejection can never be recaptured in future infringement litigation under the Doctrine of Equivalents (Festo Corp. v. Shoketsu Kinzoku Kogyo Kabushiki Co.).",
                "Equally vital is the institutional Freedom-to-Operate (FTO) clearance audit. Having a valid patent on your own invention does NOT give you the right to make or sell it! If your patented product incorporates an underlying component patented by a competitor, your patent is an 'Improvement Patent' (blocking patent), and commercializing it will trigger willful patent infringement liability.",
                "Before spending tens of millions of dollars building tooling, manufacturing facilities, and launching commercial sales, corporate legal departments must commission comprehensive FTO clearance searches. If unexpired third-party patents are identified, counsel must evaluate invalidity defenses, design around competitor claim limitations, negotiate commercial cross-licenses, or file Inter Partes Review (IPR) petitions before the Patent Trial and Appeal Board (PTAB) to cancel vulnerable competitor patents."
            ],
            "example": "Company A patents a revolutionary 4K drone camera with an automated obstacle-avoidance algorithm. However, Company B holds an active patent covering 'any quadcopter having foldable rotor arms.' Even though Company A's camera is novel and patented, Company A CANNOT sell its drone with foldable arms without infringing Company B's patent! Company A must either design non-folding arms or negotiate a cross-licensing royalty agreement.",
            "code": """# Simulation: Enterprise Freedom-to-Operate (FTO) Infringement & Clearance Risk Engine
from typing import List, Dict

class FreedomToOperateClearanceEngine:
    @staticmethod
    def audit_commercial_product_fto(
        product_sku: str,
        product_features: List[str],
        competitor_patent_claims: List[dict]
    ) -> dict:
        product_feat_set = set(f.lower().strip() for f in product_features)
        infringement_exposures = []
        
        for pat in competitor_patent_claims:
            claim_elements = set(e.lower().strip() for e in pat['claim_limitations'])
            # Literal Infringement occurs when product contains EVERY limitation of the claim
            is_literal_infringement = claim_elements.issubset(product_feat_set)
            
            missing_elements = claim_elements - product_feat_set
            
            if is_literal_infringement:
                infringement_exposures.append({
                    'patent_number': pat['patent_no'],
                    'assignee': pat['assignee'],
                    'infringement_type': 'LITERAL_ALL_ELEMENTS_READ_ON_PRODUCT',
                    'missing_limitations': [],
                    'recommended_action': 'DESIGN_AROUND_OR_ACQUIRE_LICENSE'
                })
            elif len(missing_elements) == 1:
                # High risk of Doctrine of Equivalents infringement
                infringement_exposures.append({
                    'patent_number': pat['patent_no'],
                    'assignee': pat['assignee'],
                    'infringement_type': 'DOCTRINE_OF_EQUIVALENTS_RISK',
                    'missing_limitations': list(missing_elements),
                    'recommended_action': 'CONFIRM_FUNCTION_WAY_RESULT_TEST_DIFFERENCES'
                })

        cleared_for_commercial_launch = len(infringement_exposures) == 0
        risk_tier = 'CLEAR_ZERO_BLOCKING_PATENTS' if cleared_for_commercial_launch else (
            'HIGH_LITIGATION_RISK_LITERAL_BREACH' if any(e['infringement_type'] == 'LITERAL_ALL_ELEMENTS_READ_ON_PRODUCT' for e in infringement_exposures) else 'MODERATE_DOE_RISK'
        )

        return {
            'product_sku': product_sku,
            'cleared_for_launch': cleared_for_commercial_launch,
            'clearance_risk_tier': risk_tier,
            'active_blocking_patents_count': len(infringement_exposures),
            'exposure_audit_log': infringement_exposures
        }

product_features_drone = [
    "4k_hdr_gimbal_camera",
    "lidar_obstacle_avoidance",
    "foldable_rotor_arms",
    "lithium_silicon_battery_pack"
]

competitor_patents = [
    {
        'patent_no': 'US 9,112,400',
        'assignee': 'DJI Innovations',
        'claim_limitations': ["foldable_rotor_arms", "lithium_silicon_battery_pack"]
    },
    {
        'patent_no': 'US 10,400,890',
        'assignee': 'Skydio Inc',
        'claim_limitations': ["4k_hdr_gimbal_camera", "lidar_obstacle_avoidance", "thermal_imaging_sensor"]
    }
]

fto_audit = FreedomToOperateClearanceEngine.audit_commercial_product_fto(
    product_sku='DRONE-APEX-V1',
    product_features=product_features_drone,
    competitor_patent_claims=competitor_patents
)

print(f"Product: {fto_audit['product_sku']} | Cleared: {fto_audit['cleared_for_launch']} | Risk Tier: [{fto_audit['clearance_risk_tier']}]")
for exp in fto_audit['exposure_audit_log']:
    print(f"  Blocking: {exp['patent_number']} ({exp['assignee']}) -> {exp['infringement_type']} | Action: {exp['recommended_action']}")
""",
            "output": "Product: DRONE-APEX-V1 | Cleared: False | Risk Tier: [HIGH_LITIGATION_RISK_LITERAL_BREACH]\n  Blocking: US 9,112,400 (DJI Innovations) -> LITERAL_ALL_ELEMENTS_READ_ON_PRODUCT | Action: DESIGN_AROUND_OR_ACQUIRE_LICENSE\n  Blocking: US 10,400,890 (Skydio Inc) -> DOCTRINE_OF_EQUIVALENTS_RISK | Action: CONFIRM_FUNCTION_WAY_RESULT_TEST_DIFFERENCES",
            "codeNotes": [
                {"line": 4, "note": "Defines enterprise Freedom-to-Operate clearance and infringement exposure auditor"},
                {"line": 13, "note": "Applies All-Elements Rule: literal infringement occurs only when product embodies every limitation"},
                {"line": 23, "note": "Identifies near-miss single-element variances that trigger Doctrine of Equivalents litigation risk"},
                {"line": 34, "note": "Issues commercial release clearance authorization or assigns structural design-around directives"}
            ],
            "tryIt": "Remove 'foldable_rotor_arms' from product_features_drone to eliminate literal infringement against US 9,112,400.",
            "check": {
                "question": "What is the critical distinction between possessing a granted patent and having Freedom-to-Operate (FTO)?",
                "options": [
                    "A patent confers only the right to exclude others from practicing your invention; it does not grant an affirmative right to sell your product if it infringes another entity's broader, pre-existing patent.",
                    "FTO requires approval from the United Nations World Trade Organization.",
                    "A granted patent automatically immunizes a corporation against all competitor infringement lawsuits.",
                    "FTO is only required for retail grocery products, never high-technology electronics."
                ],
                "answer": 0,
                "why": "Patents are exclusionary rights, not permissions. If your patented device incorporates another party's patented component, you are blocked from commercialization without a license.",
                "answerIndex": 0,
                "explanation": "Patents are exclusionary rights, not permissions. If your patented device incorporates another party's patented component, you are blocked from commercialization without a license."
            }
        },
        {
            "title": "Patent Litigation, Willful Infringement & Treble Damages Architecture",
            "say": [
                "Patent litigation before federal district courts and the US Court of Appeals for the Federal Circuit (CAFC) represents the highest-stakes legal combat in corporate America, routinely generating verdicts in the hundreds of millions or billions of dollars. When an enterprise is sued for patent infringement, defense counsel must navigate literal infringement, the Doctrine of Equivalents, invalidity counterclaims, and the existential threat of Enhanced Damages for Willful Infringement.",
                "Under the All-Elements Rule, literal infringement requires that the accused commercial product or process embody every single limitation recited in an asserted patent claim. If the accused product omits even one claim limitation, literal infringement is defeated. However, plaintiffs will invoke the equitable Doctrine of Equivalents (DOE). Under the Graver Tank 'Function-Way-Result' test, an accused element is equivalent to a claimed limitation if it performs substantially the same function in substantially the same way to achieve substantially the same result.",
                "The most catastrophic financial exposure arises from Willful Infringement under 35 U.S.C. § 284. In Halo Electronics, Inc. v. Pulse Electronics, Inc. (2016), the Supreme Court reformed the standard for enhanced damages, rejecting rigid objective tests and restoring judicial discretion to punish 'egregious infringement behavior' characterized as willful, wanton, or in bad faith. If a jury or court finds that a corporation knew of a competitor's patent and deliberately copied it without a good-faith defense, the court may award Treble Damages (multiplying actual damages up to three times) plus attorney's fees under Section 285.",
                "To inoculate against willful infringement charges, corporate executives must institutionalize strict Opinion of Counsel protocols. The moment an enterprise receives a formal Cease-and-Desist letter or identifies a high-risk competitor patent during an FTO search, the general counsel must immediately retain an independent, outside patent litigation firm to prepare a formal, written Non-Infringement or Invalidity Legal Opinion.",
                "A well-reasoned, contemporaneous legal opinion establishing credible reasons why the competitor's patent is invalid under Sections 101/102/103 or why the commercial product does not infringe serves as an impenetrable shield against subjective bad-faith allegations, completely defusing willful infringement claims and insulating corporate balance sheets from punitive treble damages awards."
            ],
            "example": "A medical device manufacturer receives a warning letter citing a competitor's catheter patent. The CEO ignores the letter and ramps production. At trial, the jury finds $80M in actual lost profits damages, and the judge trebles the verdict to $240M due to willful infringement. Conversely, if the CEO had commissioned a $50k outside counsel opinion concluding in good faith that the catheter was non-infringing, enhanced treble damages would have been legally barred.",
            "code": """# Simulation: Patent Damages & Willful Infringement Treble Damages Calculator
class PatentLitigationDamagesEngine:
    @staticmethod
    def calculate_litigation_damages_exposure(
        base_infringing_units_sold: int,
        average_selling_price_usd: float,
        patentee_lost_profit_margin_pct: float,
        reasonable_royalty_rate_pct: float,
        had_pre_suit_notice_of_patent: bool,
        obtained_timely_outside_counsel_opinion: bool,
        deliberate_copying_proven: bool
    ) -> dict:
        total_infringing_revenue = base_infringing_units_sold * average_selling_price_usd
        
        # Damages standard: Greater of Lost Profits or Reasonable Royalty (Georgia-Pacific)
        lost_profits_claim = total_infringing_revenue * patentee_lost_profit_margin_pct
        reasonable_royalty_claim = total_infringing_revenue * reasonable_royalty_rate_pct
        base_compensatory_damages = max(lost_profits_claim, reasonable_royalty_claim)
        
        # Willful Infringement & Halo Enhanced Damages Evaluation
        is_willful = had_pre_suit_notice_of_patent and deliberate_copying_proven and not obtained_timely_outside_counsel_opinion
        
        damage_multiplier = 3.0 if is_willful else 1.0
        final_judgment_exposure = base_compensatory_damages * damage_multiplier
        attorney_fees_awarded = is_willful # Exceptional case under 35 U.S.C. 285
        
        return {
            'total_infringing_commercial_sales_usd': total_infringing_revenue,
            'base_compensatory_damages_usd': round(base_compensatory_damages, 2),
            'willful_infringement_established': is_willful,
            'treble_damages_multiplier': damage_multiplier,
            'total_final_judgment_exposure_usd': round(final_judgment_exposure, 2),
            'exceptional_case_attorney_fees_risk': attorney_fees_awarded,
            'counsel_opinion_shield_effective': obtained_timely_outside_counsel_opinion
        }

# Scenario A: Willful infringement without legal opinion
litigation_exposure_reckless = PatentLitigationDamagesEngine.calculate_litigation_damages_exposure(
    base_infringing_units_sold=500000,
    average_selling_price_usd=120.0,
    patentee_lost_profit_margin_pct=0.35,
    reasonable_royalty_rate_pct=0.08,
    had_pre_suit_notice_of_patent=True,
    obtained_timely_outside_counsel_opinion=False,
    deliberate_copying_proven=True
)

# Scenario B: Protected by contemporaneous outside counsel opinion
litigation_exposure_protected = PatentLitigationDamagesEngine.calculate_litigation_damages_exposure(
    base_infringing_units_sold=500000,
    average_selling_price_usd=120.0,
    patentee_lost_profit_margin_pct=0.35,
    reasonable_royalty_rate_pct=0.08,
    had_pre_suit_notice_of_patent=True,
    obtained_timely_outside_counsel_opinion=True,
    deliberate_copying_proven=False
)

print(f"[Reckless] Base: ${litigation_exposure_reckless['base_compensatory_damages_usd']/1e6:.1f}M -> Final: ${litigation_exposure_reckless['total_final_judgment_exposure_usd']/1e6:.1f}M (Willful: {litigation_exposure_reckless['willful_infringement_established']})")
print(f"[Protected] Base: ${litigation_exposure_protected['base_compensatory_damages_usd']/1e6:.1f}M -> Final: ${litigation_exposure_protected['total_final_judgment_exposure_usd']/1e6:.1f}M (Willful: {litigation_exposure_protected['willful_infringement_established']})")
""",
            "output": "[Reckless] Base: $21.0M -> Final: $63.0M (Willful: True)\n[Protected] Base: $21.0M -> Final: $21.0M (Willful: False)",
            "codeNotes": [
                {"line": 3, "note": "Defines patent damages modeling engine under 35 U.S.C. Section 284"},
                {"line": 15, "note": "Calculates compensatory damages under Georgia-Pacific reasonable royalty vs lost profits"},
                {"line": 18, "note": "Evaluates Halo Electronics willful infringement test and outside counsel opinion defense"},
                {"line": 21, "note": "Computes statutory treble damages multiplier and Section 285 exceptional attorney fees"}
            ],
            "tryIt": "Set obtained_timely_outside_counsel_opinion to True in Scenario A to dismantle the willful infringement claim and eliminate $42M in treble exposure.",
            "check": {
                "question": "Under the Supreme Court's Halo Electronics doctrine, what is the primary corporate defense to defeat a claim of willful patent infringement and avoid treble damages?",
                "options": [
                    "Securing a timely, competent written Opinion of Counsel from independent outside patent litigators establishing a good-faith belief of non-infringement or invalidity.",
                    "Filing for corporate dissolution in Delaware before the jury verdict.",
                    "Demonstrating that the company's patent attorney has a law degree.",
                    "Appealing directly to the United States President for an executive pardon."
                ],
                "answer": 0,
                "why": "A timely, competent legal opinion establishes subjective good faith, demonstrating that the corporation acted reasonably and negating the egregious misconduct required for treble damages under Halo.",
                "answerIndex": 0,
                "explanation": "A timely, competent legal opinion establishes subjective good faith, demonstrating that the corporation acted reasonably and negating the egregious misconduct required for treble damages under Halo."
            }
        }
    ],
    "summary": [
        "Patent Subject Matter Invariants: 35 U.S.C. § 101 and the Alice/Mayo two-step framework demand that software and algorithmic patents embody a technical inventive concept improving computer functioning, not merely generic computer automation.",
        "Novelty & Prior Art Anticipation: Section 102 requires strict identity under the All-Elements Rule; Leahy-Smith AIA enforces first-inventor-to-file with a 1-year US grace period, while foreign jurisdictions enforce absolute novelty.",
        "Non-Obviousness & Graham Indicia: Section 103 bars predictable combinations of known elements under KSR v. Teleflex; prima facie obviousness can be conclusively overcome by objective secondary considerations like commercial success and long-felt need.",
        "Freedom-to-Operate (FTO) Clearance: A granted patent confers only the right to exclude others, not an affirmative right to operate; FTO audits must screen third-party blocking patents to prevent literal and DOE infringement.",
        "Willful Infringement & Halo Damages: Ignoring known competitor patents risks statutory treble damages under 35 U.S.C. § 284; timely outside counsel non-infringement opinions provide an indispensable shield against willful infringement liability."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 2 Capstone Step 1: Enterprise Patent Prosecution & FTO Clearance Architecture",
        "steps": [
            "Conduct an Alice/Mayo Section 101 subject matter eligibility audit on proprietary core software and machine learning architectures.",
            "Screen global prior art databases under Section 102 all-elements anticipation rules to verify international absolute novelty compliance.",
            "Model KSR Section 103 obviousness defenses and catalog objective secondary considerations including commercial success nexus.",
            "Formulate an institutional Freedom-to-Operate clearance matrix and outside counsel opinion protocol to shield against willful infringement treble damages."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_06)
    print(f"B.Com Corporate Law Day 6 Total Words: {total}")
    for i, p in enumerate(DAY_06['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
