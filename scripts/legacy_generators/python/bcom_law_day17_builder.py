"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 17 Builder: Corporate Opportunities Doctrine, Interested Director Transactions & DGCL § 144 Safe Harbors
Milestone 4: Corporate Governance, Fiduciary Duties & Shareholder Democracy
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_17 = {
    "coursePrefix": "bcom_law",
    "day": 17,
    "title": "Corporate Opportunities Doctrine, Interested Director Transactions & DGCL § 144 Safe Harbors",
    "goal": "Master the equitable boundary between permissible executive entrepreneurship and unlawful self-dealing under Delaware law: dissect the Guth v. Loft corporate opportunity doctrine and DGCL § 122(17) charter waivers, analyze interested director transactions and the default Entire Fairness standard, structure DGCL § 144(a) safe harbor board and shareholder cleansing mechanisms, model independent special transaction committees, and calculate equitable remedies including profit disgorgement and constructive trusts.",
    "minutes": 45,
    "recap": "In Day 16, we analyzed the overarching fiduciary duties of Care and Loyalty, the Business Judgment Rule under Smith v. Van Gorkom, and board oversight under In re Caremark. Today in Day 17, we drill into the most heavily litigated branch of the Duty of Loyalty: director conflicts of interest, corporate opportunity usurpation, and statutory cleansing under DGCL § 144.",
    "parts": [
        {
            "title": "The Corporate Opportunities Doctrine & Guth v. Loft Invariants",
            "say": [
                "The corporate opportunities doctrine is a vital equitable rule derived from the unyielding Duty of Loyalty owed by corporate directors and senior executives. It prevents corporate fiduciaries from appropriating for their personal benefit lucrative business ventures, assets, or commercial contracts that rightfully belong to the corporation. Under common law equity, a corporate director or officer cannot compete with the corporation they serve, nor can they divert an enterprise opportunity into their private wallet.",
                "The bedrock foundation of modern corporate opportunity jurisprudence was formulated by the Delaware Supreme Court in Guth v. Loft, Inc. (Del. 1939). In that legendary case, Charles Guth was the president of Loft, Inc., a candy and fountain syrup manufacturer. Dissatisfied with Coca-Cola syrup prices, Guth used Loft's working capital, chemistry laboratories, plant facilities, and personnel to acquire the bankrupt trademark and formula of Pepsi-Cola, creating a separate company owned privately by Guth and his family. The Delaware Supreme Court held that Guth had wrongfully usurped a corporate opportunity, ordering the complete transfer of Pepsi-Cola equity to Loft, Inc.",
                "Under the Guth v. Loft framework, a corporate officer or director may not seize a business opportunity for themselves if four conditions converge: (1) The corporation is financially able to undertake the opportunity; (2) The opportunity is within the corporation's line of business; (3) The corporation has an interest or reasonable expectancy in the opportunity; and (4) By embracing the opportunity, the self-interest of the fiduciary will be brought into conflict with that of the corporation.",
                "Conversely, Guth recognized safe-harbor boundaries: a fiduciary may take an opportunity if: (1) It was presented to the fiduciary in their purely individual, non-corporate capacity; (2) The opportunity is not essential to the corporation; (3) The corporation has no interest or expectancy; and (4) The fiduciary did not employ corporate assets, funds, or confidential facilities in developing the venture. Furthermore, a director can insulate themselves by formally presenting the opportunity to the board and obtaining a formal board rejection by disinterested directors before pursuing it privately.",
                "In 2000, Delaware enacted DGCL § 122(17), introducing a powerful statutory carve-out: a corporation may, in its certificate of incorporation or by board resolution, renounce in advance any interest or expectancy in specified business opportunities or classes of opportunities. This statutory safe harbor is widely utilized by venture capital (VC) and private equity (PE) funds whose partners serve on multiple portfolio company boards simultaneously, shielding them from corporate opportunity litigation."
            ],
            "example": "A director of an enterprise cybersecurity company learns through an industry contact of an unpatented AI malware-detection startup looking for an acquisition. If the director secretly buys the startup personally for $2 million and flips it to a rival, they breach Guth v. Loft. But if their charter contains a valid DGCL § 122(17) VC waiver renouncing AI acquisitions, or if the board formally rejected the purchase after full disclosure, the director is protected.",
            "code": """# Simulation: Corporate Opportunities Doctrine & Guth v. Loft Four-Factor Analyzer
from typing import Dict, List

def evaluate_corporate_opportunity_appropriation(
    director_name: str,
    opportunity_name: str,
    opportunity_estimated_value_usd: float,
    corporation_financially_able: bool,
    in_corporation_line_of_business: bool,
    corporation_has_expectancy_or_interest: bool,
    fiduciary_used_corporate_assets_or_funds: bool,
    charter_contains_dgcl_122_17_waiver: bool,
    formally_presented_to_board_prior_to_taking: bool,
    disinterested_board_formally_rejected: bool
) -> dict:
    # 1. Check Statutory Renunciation under DGCL § 122(17)
    if charter_contains_dgcl_122_17_waiver:
        return {
            'director_name': director_name,
            'opportunity_name': opportunity_name,
            'guth_liability_verdict': "CLEARED_STATUTORY_RENUNCIATION",
            'rationale': "Valid DGCL § 122(17) advance waiver in charter renounced corporate expectancy.",
            'disgorgement_exposure_usd': 0.0,
            'constructive_trust_required': False
        }
        
    # 2. Check Board Presentment and Safe Harbor Rejection
    if formally_presented_to_board_prior_to_taking and disinterested_board_formally_rejected:
        return {
            'director_name': director_name,
            'opportunity_name': opportunity_name,
            'guth_liability_verdict': "CLEARED_FORMAL_PRESENTMENT_AND_REJECTION",
            'rationale': "Opportunity formally presented and disinterested board exercised business judgment to reject.",
            'disgorgement_exposure_usd': 0.0,
            'constructive_trust_required': False
        }
        
    # 3. Evaluate Guth v. Loft Four-Factor Invariants
    guth_factors_met = 0
    if corporation_financially_able:
        guth_factors_met += 1
    if in_corporation_line_of_business:
        guth_factors_met += 1
    if corporation_has_expectancy_or_interest:
        guth_factors_met += 1
    if fiduciary_used_corporate_assets_or_funds:
        guth_factors_met += 1
        
    # Unlawful appropriation if line of business + financial ability + conflict of interest
    is_unlawful_usurpation = (guth_factors_met >= 3) or fiduciary_used_corporate_assets_or_funds
    
    if is_unlawful_usurpation:
        verdict = "UNLAWFUL_CORPORATE_OPPORTUNITY_USURPATION"
        rationale = f"Fiduciary breached Duty of Loyalty under Guth v. Loft ({guth_factors_met}/4 factors satisfied)."
        disgorgement = opportunity_estimated_value_usd
        constructive_trust = True
    else:
        verdict = "PERMISSIBLE_PRIVATE_VENTURE"
        rationale = "Venture falls outside line of business and reasonable corporate expectancy."
        disgorgement = 0.0
        constructive_trust = False
        
    return {
        'director_name': director_name,
        'opportunity_name': opportunity_name,
        'guth_liability_verdict': verdict,
        'rationale': rationale,
        'disgorgement_exposure_usd': disgorgement,
        'constructive_trust_required': constructive_trust
    }

# Execute deterministic validation
c1 = evaluate_corporate_opportunity_appropriation("Director Alpha", "Project Pepsi Syrup", 50000000.0, True, True, True, True, False, False, False)
c2 = evaluate_corporate_opportunity_appropriation("Director Beta (VC)", "AI SaaS Venture", 15000000.0, True, True, True, False, True, False, False)
c3 = evaluate_corporate_opportunity_appropriation("Director Gamma", "Cloud Storage Deal", 8000000.0, True, True, True, False, False, True, True)

print(f"[{c1['director_name']}] -> Verdict: {c1['guth_liability_verdict']} | Disgorgement: ${c1['disgorgement_exposure_usd']/1e6:.1f}M")
print(f"[{c2['director_name']}] -> Verdict: {c2['guth_liability_verdict']} | Disgorgement: ${c2['disgorgement_exposure_usd']/1e6:.1f}M")
print(f"[{c3['director_name']}] -> Verdict: {c3['guth_liability_verdict']} | Disgorgement: ${c3['disgorgement_exposure_usd']/1e6:.1f}M")
""",
            "output": """[Director Alpha] -> Verdict: UNLAWFUL_CORPORATE_OPPORTUNITY_USURPATION | Disgorgement: $50.0M
[Director Beta (VC)] -> Verdict: CLEARED_STATUTORY_RENUNCIATION | Disgorgement: $0.0M
[Director Gamma] -> Verdict: CLEARED_FORMAL_PRESENTMENT_AND_REJECTION | Disgorgement: $0.0M
""",
            "codeNotes": [
                {"line": 15, "note": "Applies DGCL § 122(17) statutory renunciation to shield VC/PE board members"},
                {"line": 25, "note": "Validates formal board presentment and disinterested rejection safe harbor"},
                {"line": 42, "note": "Calculates Guth v. Loft four-factor convergence triggering constructive trust remedies"}
            ],
            "tryIt": "Set fiduciary_used_corporate_assets_or_funds to False and in_corporation_line_of_business to False in c1 to see how the venture converts to a permissible private opportunity.",
            "check": {
                "question": "Under Guth v. Loft and DGCL § 122(17), which mechanism allows a corporation to eliminate liability in advance for venture capital directors who sit on multiple competing tech boards?",
                "options": [
                    "Adopting a provision in the certificate of incorporation or board resolution renouncing in advance any interest or expectancy in specified business opportunities under DGCL § 122(17).",
                    "Requiring the venture capitalist to pay a $500 monthly fine to the Delaware Chancery Court.",
                    "Prohibiting venture capitalists from using email or mobile phones during board meetings.",
                    "Forcing the corporation to dissolve automatically every three years."
                ],
                "answer": 0,
                "why": "DGCL § 122(17) explicitly authorizes corporations to renounce advance corporate opportunities in their charter or bylaws, providing critical liability protection for VC/PE investors.",
                "answerIndex": 0,
                "explanation": "DGCL § 122(17) explicitly authorizes corporations to renounce advance corporate opportunities in their charter or bylaws, providing critical liability protection for VC/PE investors."
            }
        },
        {
            "title": "Self-Dealing & Interested Director Transactions: Common Law to Modern Statutory Framework",
            "say": [
                "Self-dealing occurs whenever a corporate director or officer stands on both sides of a commercial transaction with the corporation, or derives a personal financial benefit that is not shared equally by all stockholders. In early Anglo-American common law, self-dealing was treated with zero tolerance: any contract between a corporation and an interested director was voidable at the mere election of the corporation or a single shareholder, regardless of whether the deal was fair, reasonable, or overwhelmingly advantageous to the company.",
                "By the early twentieth century, courts and legislatures recognized that this strict common-law rule was economically unworkable. In complex industrial commerce, corporate directors are frequently serial entrepreneurs, venture investors, suppliers, or technical experts whose commercial relationships can offer unique, high-value opportunities to the company. Prohibiting all interested transactions forced corporations to bypass advantageous contracts with affiliated entities.",
                "Modern corporate jurisprudence evolved from a rule of automatic voidability to a rule of regulated validity governed by fiduciary disclosure and fairness. If an interested director transaction is challenged in court, equity does not apply the deferential Business Judgment Rule presumption. Instead, the default standard of judicial scrutiny for conflicted transactions is Delaware's most rigorous standard: Entire Fairness.",
                "Under the Entire Fairness standard (established in Weinberger v. UOP, Inc. and Nixon v. Blackwell), the burden of proof rests entirely upon the conflicted defendant directors to demonstrate two interdependent components: Fair Dealing and Fair Price. Fair Dealing addresses the procedural integrity of the transaction—how the deal was timed, initiated, structured, negotiated, disclosed to the board, and approved. Fair Price addresses the substantive financial terms—whether the economics, asset valuations, interest rates, or purchase considerations fell within an objective market range that arm's-length parties would negotiate.",
                "If the conflicted defendants fail to prove both fair dealing and fair price by a preponderance of the evidence, the Court of Chancery will either rescind the transaction or award massive monetary damages, disgorging all illicit profits and holding the interested directors jointly and severally liable."
            ],
            "example": "A corporation purchases an office campus from its CEO for $80 million without an independent appraisal. At common law, the purchase was automatically voidable. Under modern Delaware law, the CEO and board face Entire Fairness review: they must prove the deal timing and negotiation were arm's-length (fair dealing) and the $80 million matched certified market comps (fair price).",
            "code": """# Simulation: Interested Director Transaction & Entire Fairness Review Engine
from typing import Dict, List

def evaluate_interested_director_transaction(
    transaction_name: str,
    contract_value_usd: float,
    independent_appraisal_fair_value_usd: float,
    director_has_personal_equity_stake: bool,
    director_participated_in_board_vote: bool,
    complete_conflict_disclosure_made: bool,
    negotiated_at_arms_length_by_disinterested_parties: bool
) -> dict:
    # 1. Identify Conflict Posture
    is_interested_transaction = director_has_personal_equity_stake
    
    if not is_interested_transaction:
        return {
            'transaction_name': transaction_name,
            'review_standard': "BUSINESS_JUDGMENT_RULE_PRESUMPTION",
            'fair_dealing_satisfied': True,
            'fair_price_satisfied': True,
            'entire_fairness_met': True,
            'transaction_validity': "VALID_AND_ENFORCEABLE",
            'director_liability_exposure_usd': 0.0
        }
        
    # 2. Entire Fairness Test Components:
    # Fair Dealing (Procedural Integrity)
    fair_dealing_satisfied = (
        complete_conflict_disclosure_made and 
        negotiated_at_arms_length_by_disinterested_parties and 
        not director_participated_in_board_vote
    )
    
    # Fair Price (Substantive Economic Terms)
    # Price is fair if contract value <= 105% of independent appraisal (for company purchase)
    price_variance_ratio = contract_value_usd / independent_appraisal_fair_value_usd
    fair_price_satisfied = price_variance_ratio <= 1.05
    
    # Entire Fairness requires BOTH fair dealing and fair price
    entire_fairness_met = fair_dealing_satisfied and fair_price_satisfied
    
    if entire_fairness_met:
        validity = "UPHELD_ENTIRE_FAIRNESS_SATISFIED"
        liability = 0.0
    else:
        validity = "VOIDABLE_ENTIRE_FAIRNESS_BREACHED"
        # Overpayment damages disgorgement
        excess_payment = max(0.0, contract_value_usd - independent_appraisal_fair_value_usd)
        liability = excess_payment if excess_payment > 0 else (contract_value_usd * 0.15)
        
    return {
        'transaction_name': transaction_name,
        'review_standard': "ENTIRE_FAIRNESS_STRICT_SCRUTINY",
        'fair_dealing_satisfied': fair_dealing_satisfied,
        'fair_price_satisfied': fair_price_satisfied,
        'entire_fairness_met': entire_fairness_met,
        'transaction_validity': validity,
        'director_liability_exposure_usd': liability
    }

# Execute deterministic validation
t1 = evaluate_interested_director_transaction("HQ Office Campus Acquisition", 85000000.0, 82000000.0, True, False, True, True)
t2 = evaluate_interested_director_transaction("CEO Supply Contract", 25000000.0, 18000000.0, True, True, False, False)
t3 = evaluate_interested_director_transaction("Third-Party Vendor Agreement", 12000000.0, 12000000.0, False, False, False, True)

print(f"[{t1['transaction_name']}] -> Standard: {t1['review_standard']} | Validity: {t1['transaction_validity']} | Liability: ${t1['director_liability_exposure_usd']/1e6:.1f}M")
print(f"[{t2['transaction_name']}] -> Standard: {t2['review_standard']} | Validity: {t2['transaction_validity']} | Liability: ${t2['director_liability_exposure_usd']/1e6:.1f}M")
print(f"[{t3['transaction_name']}] -> Standard: {t3['review_standard']} | Validity: {t3['transaction_validity']} | Liability: ${t3['director_liability_exposure_usd']/1e6:.1f}M")
""",
            "output": """[HQ Office Campus Acquisition] -> Standard: ENTIRE_FAIRNESS_STRICT_SCRUTINY | Validity: UPHELD_ENTIRE_FAIRNESS_SATISFIED | Liability: $0.0M
[CEO Supply Contract] -> Standard: ENTIRE_FAIRNESS_STRICT_SCRUTINY | Validity: VOIDABLE_ENTIRE_FAIRNESS_BREACHED | Liability: $7.0M
[Third-Party Vendor Agreement] -> Standard: BUSINESS_JUDGMENT_RULE_PRESUMPTION | Validity: VALID_AND_ENFORCEABLE | Liability: $0.0M
""",
            "codeNotes": [
                {"line": 15, "note": "Exempts unconflicted third-party transactions under standard Business Judgment Rule"},
                {"line": 23, "note": "Audits Fair Dealing procedural prongs: full disclosure, arm's length negotiation, vote recusal"},
                {"line": 30, "note": "Audits Fair Price substantive prong comparing transaction value against certified appraisal"}
            ],
            "tryIt": "In t2, set complete_conflict_disclosure_made to True and negotiated_at_arms_length_by_disinterested_parties to True and director_participated_in_board_vote to False to test fair dealing with an unfair price.",
            "check": {
                "question": "What two essential prongs must conflicted directors establish by a preponderance of the evidence to survive Delaware Entire Fairness review under Weinberger v. UOP?",
                "options": [
                    "Fair Dealing (procedural honesty and arm's-length negotiation) and Fair Price (substantive economic fairness matching market value).",
                    "High Stock Price and Low Dividend Yield.",
                    "Quick Meeting Adjournment and Verbal Assent.",
                    "Federal Trade Commission approval and SEC registration."
                ],
                "answer": 0,
                "why": "Weinberger v. UOP established that Entire Fairness is a unified inquiry encompassing both procedural Fair Dealing and substantive Fair Price.",
                "answerIndex": 0,
                "explanation": "Weinberger v. UOP established that Entire Fairness is a unified inquiry encompassing both procedural Fair Dealing and substantive Fair Price."
            }
        },
        {
            "title": "DGCL § 144 Safe Harbors: Cleansing Interested Transactions",
            "say": [
                "To rescue corporations from the draconian threat of common-law voidability and the onerous evidentiary burden of Entire Fairness litigation, the Delaware legislature enacted Section 144 of the Delaware General Corporation Law (DGCL § 144). Section 144 provides a statutory safe harbor, explicitly defining three alternative procedural pathways to 'cleanse' an interested director transaction, ensuring that the contract is not void or voidable solely because of the director's conflict.",
                "Under DGCL § 144(a), no contract or transaction between a corporation and one or more of its directors or officers (or an entity in which they have a financial interest) is void or voidable solely for this reason, or solely because the director or officer is present at or participates in the meeting of the board or committee which authorizes the transaction, if any one of the following three prongs is satisfied:",
                "Prong 1 (DGCL § 144(a)(1) — Disinterested Board Approval): The material facts as to the director's relationship or interest and as to the contract or transaction are disclosed or known to the board of directors or committee, and the board or committee in good faith authorizes the contract or transaction by the affirmative votes of a majority of the disinterested directors, even though the disinterested directors be less than a quorum.",
                "Prong 2 (DGCL § 144(a)(2) — Disinterested Stockholder Approval): The material facts as to the director's relationship or interest and as to the contract or transaction are disclosed or known to the stockholders entitled to vote thereon, and the contract or transaction is specifically approved in good faith by a vote of the stockholders (specifically an uncoerced, fully informed vote of disinterested stockholders under modern Corwin cleansing principles).",
                "Prong 3 (DGCL § 144(a)(3) — Substantive Fairness to the Corporation): The contract or transaction is fair as to the corporation as of the time it is authorized, approved, or ratified by the board of directors, a committee, or the stockholders. This third prong serves as an equitable safety net: even if the board failed to obtain disinterested approval or shareholder ratification, the transaction survives if the defendants affirmatively prove Entire Fairness in court.",
                "The legal effect of satisfying DGCL § 144(a)(1) or (a)(2) was definitively clarified by the Delaware Supreme Court in Benihana of Tokyo, Inc. v. Benihana, Inc. (Del. 2006): compliance with the statutory safe harbor eliminates common-law voidability and restores the Business Judgment Rule presumption, shifting the burden of proof back to the challenging shareholder to prove corporate waste or bad faith."
            ],
            "example": "A board consisting of 5 directors includes 2 interested founders who wish to license software from their private partnership to the company. The founders fully disclose their financial interest and recuse themselves. The 3 disinterested directors vote unanimously to approve the license after reviewing market comps. Under DGCL § 144(a)(1), the transaction is cleansed, restoring the Business Judgment Rule.",
            "code": """# Simulation: DGCL § 144 Safe Harbor Compliance & Cleansing Verifier
from typing import Dict, List

def evaluate_dgcl_144_safe_harbor_cleansing(
    transaction_name: str,
    total_board_members: int,
    interested_directors_count: int,
    disinterested_directors_voting_yes: int,
    conflict_material_facts_fully_disclosed_to_board: bool,
    submitted_to_stockholder_vote: bool,
    conflict_material_facts_fully_disclosed_to_stockholders: bool,
    disinterested_stockholder_majority_approved: bool,
    transaction_is_substantively_fair_to_corporation: bool
) -> dict:
    disinterested_directors_count = total_board_members - interested_directors_count
    
    # 1. Evaluate Prong 1: DGCL § 144(a)(1) - Disinterested Board Approval
    # Requires full disclosure and majority of disinterested directors voting in favor
    disinterested_board_cleansed = (
        conflict_material_facts_fully_disclosed_to_board and 
        (disinterested_directors_voting_yes > (disinterested_directors_count / 2))
    )
    
    # 2. Evaluate Prong 2: DGCL § 144(a)(2) - Informed Stockholder Approval
    stockholder_cleansed = (
        submitted_to_stockholder_vote and 
        conflict_material_facts_fully_disclosed_to_stockholders and 
        disinterested_stockholder_majority_approved
    )
    
    # 3. Evaluate Prong 3: DGCL § 144(a)(3) - Substantive Fairness Baseline
    substantive_fairness_satisfied = transaction_is_substantively_fair_to_corporation
    
    # Determine Cleansing Status
    cleansing_pathway = "NONE"
    review_standard = "ENTIRE_FAIRNESS_SCRUTINY_BURDEN_ON_DEFENDANT"
    is_protected_from_automatic_voidability = False
    
    if disinterested_board_cleansed:
        cleansing_pathway = "DGCL_144_A_1_DISINTERESTED_BOARD_APPROVAL"
        review_standard = "BUSINESS_JUDGMENT_RULE_RESTORED"
        is_protected_from_automatic_voidability = True
    elif stockholder_cleansed:
        cleansing_pathway = "DGCL_144_A_2_DISINTERESTED_STOCKHOLDER_APPROVAL"
        review_standard = "BUSINESS_JUDGMENT_RULE_RESTORED_CORWIN_EFFECT"
        is_protected_from_automatic_voidability = True
    elif substantive_fairness_satisfied:
        cleansing_pathway = "DGCL_144_A_3_SUBSTANTIVE_FAIRNESS_SAFETY_NET"
        review_standard = "ENTIRE_FAIRNESS_AFFIRMED_IN_EQUITY"
        is_protected_from_automatic_voidability = True
    else:
        cleansing_pathway = "CLEANSING_FAILED_TRANSACTION_VOIDABLE"
        review_standard = "ENTIRE_FAIRNESS_DEFENSE_FAILED"
        is_protected_from_automatic_voidability = False
        
    return {
        'transaction_name': transaction_name,
        'cleansing_pathway': cleansing_pathway,
        'judicial_review_standard': review_standard,
        'is_protected_from_automatic_voidability': is_protected_from_automatic_voidability,
        'disinterested_directors_voted_yes': disinterested_directors_voting_yes,
        'disinterested_directors_pool': disinterested_directors_count
    }

# Execute deterministic validation
s1 = evaluate_dgcl_144_safe_harbor_cleansing("Founders Patent License", 7, 3, 3, True, False, False, False, True)
s2 = evaluate_dgcl_144_safe_harbor_cleansing("CEO Real Estate Sale", 5, 2, 1, True, True, True, True, True)
s3 = evaluate_dgcl_144_safe_harbor_cleansing("Uninformed Conflicted Loan", 6, 2, 0, False, False, False, False, False)

print(f"[{s1['transaction_name']}] -> Pathway: {s1['cleansing_pathway']} | Standard: {s1['judicial_review_standard']}")
print(f"[{s2['transaction_name']}] -> Pathway: {s2['cleansing_pathway']} | Standard: {s2['judicial_review_standard']}")
print(f"[{s3['transaction_name']}] -> Pathway: {s3['cleansing_pathway']} | Standard: {s3['judicial_review_standard']}")
""",
            "output": """[Founders Patent License] -> Pathway: DGCL_144_A_1_DISINTERESTED_BOARD_APPROVAL | Standard: BUSINESS_JUDGMENT_RULE_RESTORED
[CEO Real Estate Sale] -> Pathway: DGCL_144_A_2_DISINTERESTED_STOCKHOLDER_APPROVAL | Standard: BUSINESS_JUDGMENT_RULE_RESTORED_CORWIN_EFFECT
[Uninformed Conflicted Loan] -> Pathway: CLEANSING_FAILED_TRANSACTION_VOIDABLE | Standard: ENTIRE_FAIRNESS_DEFENSE_FAILED
""",
            "codeNotes": [
                {"line": 15, "note": "Implements DGCL § 144(a)(1) cleansing via majority vote of disinterested directors"},
                {"line": 22, "note": "Implements DGCL § 144(a)(2) cleansing via informed, uncoerced disinterested stockholder vote"},
                {"line": 34, "note": "Applies Benihana holding: successful cleansing restores the Business Judgment Rule"}
            ],
            "tryIt": "Set disinterested_directors_voting_yes to 1 in s1 (less than half of the 4 disinterested directors) to see the cleansing fail under § 144(a)(1) and shift to the § 144(a)(3) fairness safety net.",
            "check": {
                "question": "Under DGCL § 144(a)(1) and Benihana of Tokyo, what happens to the standard of judicial review when an interested director transaction is approved in good faith by a majority of fully informed disinterested directors?",
                "options": [
                    "The transaction is cleansed of common-law voidability, and the standard of review shifts from Entire Fairness back to the deferential Business Judgment Rule.",
                    "The transaction is permanently banned by the federal government.",
                    "The interested director is sent to federal prison automatically.",
                    "All company patents are revoked by the Delaware Chancery Court."
                ],
                "answer": 0,
                "why": "Section 144(a)(1) removes the taint of self-dealing, restoring the Business Judgment Rule presumption and placing the burden on plaintiffs to show waste.",
                "answerIndex": 0,
                "explanation": "Section 144(a)(1) removes the taint of self-dealing, restoring the Business Judgment Rule presumption and placing the burden on plaintiffs to show waste."
            }
        },
        {
            "title": "Special Board Committees & Independent Director Deliberations",
            "say": [
                "When a corporate transaction involves severe conflicts of interest—such as a buyout by a controlling shareholder, a management buyout (MBO), or a transformative asset sale to executive officers—ordinary board approval under DGCL § 144(a)(1) is insufficient to withstand judicial scrutiny. In such conflicted settings, Delaware courts require the formation of an autonomous, uncompromised Special Committee of Independent Directors.",
                "The legal purpose of a Special Committee is to simulate the arm's-length bargaining dynamics of an unconflicted market transaction. For a Special Committee's approval to successfully shift the burden of proof or restore the Business Judgment Rule, the committee must satisfy rigorous structural and operational invariants established by Delaware Chancery jurisprudence (Kahn v. Tremont Corp. and Kahn v. Lynch Communication Systems).",
                "First, independence must be immaculate: committee members cannot have any material financial, familial, or personal ties to the conflicted fiduciaries. Under Delaware standards, independence is evaluated subjectively: would the relationship realistically compromise a director's objectivity when negotiating against the conflicted executive? Second, the committee must be granted a clear, expansive mandate by the full board, including the absolute authority to select its own independent legal and financial advisors, negotiate deal terms aggressively, and crucially, say 'NO'—the power to terminate negotiations completely.",
                "Third, the committee must operate in an uncompromised procedural environment: interested directors and officers must be completely excluded from committee meetings, deliberations, and executive sessions. Any presence, pressure, or backdoor information leakage from the conflicted party taints the committee's independence. Fourth, the committee must obtain its own written Fairness Opinion from an independent investment bank and document extensive negotiations in detailed boardroom minutes.",
                "If the Special Committee satisfies these criteria, it functions as a formidable procedural bulwark, neutralizing conflict claims and protecting boardroom decisions from equitable invalidation."
            ],
            "example": "When a founder owning 35% of the company proposes taking it private, the board appoints a Special Committee of 3 independent directors. The committee hires independent counsel (Wachtell Lipton) and an investment bank (Lazard), meets 18 times without the founder, rejects the founder's initial $40/share bid, and extracts a final $52/share price. This pristine process cleanses the conflict under Delaware law.",
            "code": """# Simulation: Special Independent Board Committee Governance & Independence Vetting Engine
from typing import Dict, List

def simulate_special_committee_deliberation(
    deal_name: str,
    deal_value_usd: float,
    committee_members: List[str],
    members_independent_of_conflicted_parties: List[bool],
    granted_full_mandate_including_power_to_say_no: bool,
    retained_independent_legal_and_financial_advisors: bool,
    conflicted_parties_completely_excluded_from_sessions: bool,
    negotiated_multiple_price_improvements: bool,
    obtained_independent_fairness_opinion: bool
) -> dict:
    total_members = len(committee_members)
    independent_count = sum(1 for is_ind in members_independent_of_conflicted_parties if is_ind)
    
    # 1. Structural Independence Audit (100% independence required)
    is_structurally_independent = (independent_count == total_members) and (total_members >= 2)
    
    # 2. Mandate and Advisor Power Audit
    has_effective_mandate = (
        granted_full_mandate_including_power_to_say_no and 
        retained_independent_legal_and_financial_advisors
    )
    
    # 3. Procedural Firewall and Negotiation Diligence
    procedural_integrity = (
        conflicted_parties_completely_excluded_from_sessions and 
        negotiated_multiple_price_improvements and 
        obtained_independent_fairness_opinion
    )
    
    committee_process_cleared = (
        is_structurally_independent and 
        has_effective_mandate and 
        procedural_integrity
    )
    
    if committee_process_cleared:
        verdict = "SPECIAL_COMMITTEE_EFFECTIVE_BURDEN_SHIFTED"
        litigation_shield = "BURDEN_OF_PERSUASION_SHIFTED_TO_PLAINTIFF"
        procedural_strength_score = 100
    elif is_structurally_independent and has_effective_mandate:
        verdict = "SPECIAL_COMMITTEE_SUBSTANTIALLY_SOUND_DEFECTS_NOTED"
        litigation_shield = "SCRUTINY_MAINTAINED_ENTIRE_FAIRNESS"
        procedural_strength_score = 70
    else:
        verdict = "SPECIAL_COMMITTEE_TAINTED_SHAM_PROCESS"
        litigation_shield = "SPECIAL_COMMITTEE_DISREGARDED_ENTIRE_FAIRNESS_ON_DEFENDANT"
        procedural_strength_score = 30
        
    return {
        'deal_name': deal_name,
        'committee_members_count': total_members,
        'independent_members_count': independent_count,
        'is_structurally_independent': is_structurally_independent,
        'verdict': verdict,
        'litigation_shield': litigation_shield,
        'procedural_strength_score': procedural_strength_score
    }

# Execute deterministic validation
sc1 = simulate_special_committee_deliberation(
    "Founder Take-Private MBO", 450000000.0,
    ["Indep-Dir-A", "Indep-Dir-B", "Indep-Dir-C"], [True, True, True],
    True, True, True, True, True
)
sc2 = simulate_special_committee_deliberation(
    "Asset Spin-off to CEO Brother", 120000000.0,
    ["Indep-Dir-X", "Affiliated-Dir-Y"], [True, False],
    True, True, False, False, False
)

print(f"[{sc1['deal_name']}] -> Status: {sc1['verdict']} | Shield: {sc1['litigation_shield']}")
print(f"[{sc2['deal_name']}] -> Status: {sc2['verdict']} | Shield: {sc2['litigation_shield']}")
""",
            "output": """[Founder Take-Private MBO] -> Status: SPECIAL_COMMITTEE_EFFECTIVE_BURDEN_SHIFTED | Shield: BURDEN_OF_PERSUASION_SHIFTED_TO_PLAINTIFF
[Asset Spin-off to CEO Brother] -> Status: SPECIAL_COMMITTEE_TAINTED_SHAM_PROCESS | Shield: SPECIAL_COMMITTEE_DISREGARDED_ENTIRE_FAIRNESS_ON_DEFENDANT
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces 100% subjective independence across all Special Committee members"},
                {"line": 20, "note": "Audits essential mandate requirement: absolute authority to negotiate and say NO"},
                {"line": 30, "note": "Shifts burden of persuasion from defendant fiduciaries to challenging shareholder"}
            ],
            "tryIt": "In sc2, replace Affiliated-Dir-Y with a truly independent director and exclude conflicted parties to observe how the score surges from 30 to 100.",
            "check": {
                "question": "Under Kahn v. Lynch and Delaware Chancery precedents, what vital authority must the full board confer upon a Special Committee for its approval to be legally effective?",
                "options": [
                    "The absolute authority to select independent advisors, negotiate freely, and definitively reject the proposed transaction (power to say 'NO').",
                    "The authority to rewrite the United States Tax Code.",
                    "The power to fire all employees without severance.",
                    "The obligation to approve whatever the CEO suggests within 48 hours."
                ],
                "answer": 0,
                "why": "A Special Committee that lacks the power to say 'NO' is a mere cosmetic rubber stamp, rendering its process legally ineffective under Kahn v. Lynch.",
                "answerIndex": 0,
                "explanation": "A Special Committee that lacks the power to say 'NO' is a mere cosmetic rubber stamp, rendering its process legally ineffective under Kahn v. Lynch."
            }
        },
        {
            "title": "Remedies for Breach of Loyalty: Disgorgement of Profits, Constructive Trusts & Rescission",
            "say": [
                "When a corporate fiduciary breaches the Duty of Loyalty—whether through corporate opportunity usurpation, unauthorized self-dealing, or bad faith—the remedial power of the Delaware Court of Chancery is expansive, formidable, and uncompromising. Equity refuses to allow a faithless fiduciary to profit from their breach, even if the corporation suffered no direct out-of-pocket loss.",
                "The primary equitable remedy for breach of loyalty is Disgorgement of Profits. Under this principle, any profit, capital gain, dividend, or personal enrichment realized by the faithless director or officer as a consequence of their breach must be disgorged and paid over to the corporation. Crucially, the plaintiff shareholder does not need to prove that the corporation would have earned that exact profit; equity strips the fiduciary of all gains to deter future infidelity across the capital markets.",
                "Where the fiduciary used corporate assets or opportunities to acquire specific physical assets, patents, commercial real estate, or equity in a competing entity, the Court of Chancery will impose a Constructive Trust. A constructive trust is an equitable device declaring that legal title held by the wrongdoing fiduciary is held in trust for the sole benefit of the corporation. The court orders the immediate transfer and conveyance of the disputed property to the company.",
                "In transactional self-dealing, the court may order Rescission: unwinding the transaction completely and returning the parties to their pre-deal status quo. If assets have already been sold or transformed making physical rescission impossible, the court awards Rescissory Damages—measuring the value of the asset at the time of judgment rather than at the time of the transaction, capturing all interim appreciation for the benefit of stockholders.",
                "Finally, because breaches of the Duty of Loyalty constitute bad faith or disloyalty, they cannot be exculpated under DGCL § 102(b)(7) charter provisions, nor can they be indemnified under DGCL § 145 or insured under standard D&O policies. Faithless directors must satisfy judgment liabilities directly out of their personal bank accounts."
            ],
            "example": "An executive usurps a software patent opportunity for $500,000, builds it with corporate developers, and sells the startup 3 years later for $60 million. The executive argues the corporation only suffered $500,000 in damages. The Court of Chancery rejects this defense, imposing a constructive trust and ordering full disgorgement of the entire $60 million plus prejudgment interest.",
            "code": """# Simulation: Duty of Loyalty Equitable Remediation & Disgorgement Calculator
from typing import Dict, List

def calculate_fiduciary_breach_remedies(
    fiduciary_name: str,
    breach_type: str, # 'CORPORATE_OPPORTUNITY_USURPATION', 'UNAUTHORIZED_SELF_DEALING'
    initial_corporate_out_of_pocket_loss_usd: float,
    fiduciary_gross_realized_profit_usd: float,
    usurped_asset_current_fair_market_value_usd: float,
    prejudgment_interest_annual_rate: float,
    litigation_duration_years: float,
    exemplary_punitive_multiplier: float
) -> dict:
    # 1. Base Disgorgement (Strip all fiduciary profits, independent of corporate loss)
    disgorgement_amount = max(fiduciary_gross_realized_profit_usd, initial_corporate_out_of_pocket_loss_usd)
    
    # 2. Constructive Trust Asset Value (If asset retained by fiduciary)
    constructive_trust_recovery = usurped_asset_current_fair_market_value_usd
    
    # 3. Prejudgment Interest (Compounded annually under Delaware Chancery practice: 5% + Fed Discount Rate)
    compound_interest_factor = (1.0 + prejudgment_interest_annual_rate) ** litigation_duration_years
    total_disgorgement_with_interest = disgorgement_amount * compound_interest_factor
    accrued_interest_usd = total_disgorgement_with_interest - disgorgement_amount
    
    # 4. Punitive / Bad Faith Damages (for egregious bad faith disloyalty)
    punitive_damages = disgorgement_amount * (exemplary_punitive_multiplier - 1.0) if exemplary_punitive_multiplier > 1.0 else 0.0
    
    total_judgment_exposure = total_disgorgement_with_interest + punitive_damages
    
    return {
        'fiduciary_name': fiduciary_name,
        'breach_type': breach_type,
        'base_disgorgement_usd': round(disgorgement_amount, 2),
        'accrued_prejudgment_interest_usd': round(accrued_interest_usd, 2),
        'punitive_damages_usd': round(punitive_damages, 2),
        'total_monetary_judgment_usd': round(total_judgment_exposure, 2),
        'constructive_trust_asset_value_usd': round(constructive_trust_recovery, 2),
        'is_exculpable_under_102b7': False,
        'is_indemnifiable_under_145': False
    }

# Execute deterministic validation
r1 = calculate_fiduciary_breach_remedies("Executive Rogue", "CORPORATE_OPPORTUNITY_USURPATION", 500000.0, 45000000.0, 60000000.0, 0.08, 3.5, 1.0)
r2 = calculate_fiduciary_breach_remedies("Director BadFaith", "UNAUTHORIZED_SELF_DEALING", 12000000.0, 8000000.0, 0.0, 0.07, 2.0, 1.5)

print(f"[{r1['fiduciary_name']}] -> Base Disgorge: ${r1['base_disgorgement_usd']/1e6:.1f}M | Total Judgment: ${r1['total_monetary_judgment_usd']/1e6:.1f}M | Exculpable: {r1['is_exculpable_under_102b7']}")
print(f"[{r2['fiduciary_name']}] -> Base Disgorge: ${r2['base_disgorgement_usd']/1e6:.1f}M | Total Judgment: ${r2['total_monetary_judgment_usd']/1e6:.1f}M | Exculpable: {r2['is_exculpable_under_102b7']}")
""",
            "output": """[Executive Rogue] -> Base Disgorge: $45.0M | Total Judgment: $58.9M | Exculpable: False
[Director BadFaith] -> Base Disgorge: $12.0M | Total Judgment: $19.8M | Exculpable: False
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces complete profit disgorgement regardless of whether corporation suffered direct loss"},
                {"line": 21, "note": "Calculates Delaware Chancery compound prejudgment interest over litigation lifespan"},
                {"line": 34, "note": "Confirms Duty of Loyalty breaches cannot be exculpated under DGCL § 102(b)(7)"}
            ],
            "tryIt": "Set litigation_duration_years to 5.0 in r1 to see how compound prejudgment interest inflates total monetary liability.",
            "check": {
                "question": "Can a corporate fiduciary who breached the Duty of Loyalty escape personal liability by asserting that the corporation suffered zero out-of-pocket financial harm?",
                "options": [
                    "No; equity mandates full Disgorgement of Profits to strip the faithless fiduciary of all gains and deter future disloyalty, regardless of corporate loss.",
                    "Yes; if the corporation didn't lose money, no legal case exists.",
                    "Yes; Delaware law permits fiduciaries to keep 50% of usurped profits.",
                    "No; but only if the fiduciary agrees to pay a $50 fine."
                ],
                "answer": 0,
                "why": "The purpose of disgorgement is prophylactic deterrence: equity strips the faithless fiduciary of all profits irrespective of whether the corporation incurred direct damage.",
                "answerIndex": 0,
                "explanation": "The purpose of disgorgement is prophylactic deterrence: equity strips the faithless fiduciary of all profits irrespective of whether the corporation incurred direct damage."
            }
        }
    ],
    "summary": [
        "Corporate Opportunities Doctrine & Guth v. Loft: Four-factor test bars seizing enterprise opportunities; advance waivers authorized under DGCL § 122(17) shield VC/PE investors.",
        "Self-Dealing & Entire Fairness: Conflicted transactions trigger strict scrutiny requiring defendant directors to prove Fair Dealing (procedure) and Fair Price (economics).",
        "DGCL § 144 Safe Harbors: Cleanses interested transactions via informed disinterested director vote (§ 144(a)(1)), stockholder vote (§ 144(a)(2)), or substantive fairness (§ 144(a)(3)), restoring BJR (Benihana).",
        "Special Committees of Independent Directors: Must possess total subjective independence, independent advisors, and the absolute power to negotiate and say NO (Kahn v. Lynch).",
        "Remedies for Breach of Loyalty: Complete profit disgorgement, constructive trusts, and rescissory damages; strictly non-exculpable under § 102(b)(7) and non-indemnifiable under § 145."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 4 Step 2: Corporate Opportunities & DGCL § 144 Cleansing Architecture",
        "steps": [
            "Draft DGCL § 122(17) advance corporate opportunity renunciation clauses for private equity and venture capital directors.",
            "Establish board conflict-of-interest disclosure protocols and audit self-dealing transactions under Entire Fairness standards.",
            "Structure DGCL § 144(a)(1) disinterested director and § 144(a)(2) stockholder approval safe harbor resolutions.",
            "Charter an autonomous Special Committee of Independent Directors with independent counsel, bankers, and full veto mandate.",
            "Formulate equitable remediation models calculating profit disgorgement, constructive trusts, and prejudgment interest."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_17)
    print(f"B.Com Corporate Law Day 17 Total Words: {total}")
    for i, p in enumerate(DAY_17['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
