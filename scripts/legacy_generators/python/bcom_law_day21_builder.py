"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 21 Builder: Delaware Takeover Defense: The Unocal Proportionality Standard & Poison Pills
Milestone 5 Kickoff: Takeover Defense, M&A Deal Protections & Antitrust Clearance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_21 = {
    "coursePrefix": "bcom_law",
    "day": 21,
    "title": "Delaware Takeover Defense: The Unocal Proportionality Standard & Poison Pills",
    "goal": "Master corporate takeover defense jurisprudence under Delaware law: analyze hostile tender offers and inherent director conflicts of interest under Enhanced Scrutiny, dissect the Unocal v. Mesa Petroleum two-prong proportionality test and Unitrin's non-draconian standards, model the mathematical dilution of Shareholder Rights Plans (Poison Pills) under Moran v. Household International, evaluate the impenetrable staggered board pill defense under Air Products v. Airgas, and audit advance notice bylaws under CytoDyn and AIM ImmunoTech.",
    "minutes": 45,
    "recap": "In Milestone 4 (Days 16–20), we mastered internal corporate governance, fiduciary duties under Caremark and Disney, interested transaction cleansing under DGCL § 144, derivative litigation under Zuckerberg, and universal proxy contests. Today we launch Milestone 5: Takeover Defenses, Hostile M&A, Deal Protections, Freeze-Out Mergers, and Regulatory Antitrust Clearance.",
    "parts": [
        {
            "title": "The Hostile Takeover Era & Inherent Conflicts of Interest: Enhanced Scrutiny",
            "say": [
                "The corporate takeover landscape is the most aggressive, high-stakes theater of modern financial capitalism. When an acquirer circumvents a target corporation's management and appeals directly to stockholders with an unsolicited tender offer, the board of directors faces an acute, existential crisis. In responding to a hostile bid, incumbent directors are confronted with an omnipresent, inescapable conflict of interest: the 'Omnipresent Specter' that directors may act primarily in their own self-interest to preserve their prestigious board seats, executive compensation, and corporate perquisites.",
                "Because of this inherent conflict, traditional standards of judicial review proved inadequate. If Delaware courts applied the deferential Business Judgment Rule, entrenched directors could unilaterally reject lucrative takeover bids, depriving stockholders of premium buyouts under the guise of good-faith business discretion. Conversely, if courts applied the strict Entire Fairness standard, boards would be stripped of defensive weapons, leaving public companies defenseless against predatory raiders, greenmailers, and coercive front-end-loaded tender offers.",
                "To resolve this structural tension, the Delaware Supreme Court forged an intermediate standard of review: Enhanced Scrutiny. Unlike the Business Judgment Rule (which presumes director propriety and places the burden of proof on the challenging shareholder), Enhanced Scrutiny places the initial burden of proof directly upon the defendant directors. Before receiving any judicial deference, directors must affirmatively demonstrate that their defensive actions were procedurally diligent and substantively proportionate.",
                "The modern takeover defense framework distinguishes between benign strategic offers and genuinely coercive acquisition tactics. During the 1980s raider era, acquirers frequently launched Two-Tier Coercive Tender Offers: offering an attractive all-cash premium for 51% of shares in Tier 1, while threatening to squeeze out the remaining 49% of stockholders in Tier 2 with subordinated, high-risk junk bonds. This structural coercion forced rational stockholders into a prisoners' dilemma, stampeding them into tendering even if they believed the company was worth far more.",
                "Recognizing these market abuses, Delaware equity empowers boards to act as defenders of the enterprise, provided their defensive measures satisfy the landmark Unocal doctrine."
            ],
            "example": "A corporate raider launches a two-tier tender offer: $80/share in cash for 51% of target stock, and $45/share in speculative subordinated debt for the back-end freeze-out. If the board does nothing, stockholders are coerced into tendering. Enhanced scrutiny permits the board to deploy defensive measures to neutralize this structural coercion, provided the defense is proportionate.",
            "code": """# Simulation: Hostile Tender Offer Threat Classifier & Enhanced Scrutiny Trigger Engine
from typing import Dict, List

def evaluate_takeover_threat_and_bid_structure(
    target_company_name: str,
    acquirer_name: str,
    current_unaffected_share_price_usd: float,
    tier1_tender_cash_price_usd: float,
    tier1_shares_solicited_percentage: float, # e.g. 0.51 for 51%
    tier2_freeze_out_consideration_usd: float,
    tier2_consideration_type: str, # 'CASH', 'SUBORDINATED_JUNK_BONDS', 'ILLIQUID_STOCK'
    bidder_has_fully_committed_financing: bool,
    board_conducted_independent_dcf_valuation: bool,
    target_intrinsic_standalone_dcf_value_usd: float
) -> dict:
    # 1. Structural Coercion Evaluation (Two-Tier Disparity)
    price_disparity_usd = tier1_tender_cash_price_usd - tier2_freeze_out_consideration_usd
    is_two_tier_coercive = (
        tier1_shares_solicited_percentage < 1.0 and 
        (price_disparity_usd > 5.0 or tier2_consideration_type == 'SUBORDINATED_JUNK_BONDS')
    )
    
    # 2. Substantive Coercion Evaluation (Offer below standalone DCF value)
    blended_offer_price = (
        (tier1_tender_cash_price_usd * tier1_shares_solicited_percentage) + 
        (tier2_freeze_out_consideration_usd * (1.0 - tier1_shares_solicited_percentage))
    )
    is_substantively_inadequate = blended_offer_price < target_intrinsic_standalone_dcf_value_usd
    
    # 3. Financing Threat
    is_financing_contingent = not bidder_has_fully_committed_financing
    
    # Threat Classification
    recognized_threats = []
    if is_two_tier_coercive:
        recognized_threats.append("STRUCTURAL_COERCION_PRISONERS_DILEMMA")
    if is_substantively_inadequate:
        recognized_threats.append("SUBSTANTIVE_COERCION_UNDERVALUED_BID")
    if is_financing_contingent:
        recognized_threats.append("ILLUSORY_FINANCING_CONTINGENCY")
        
    threat_severity = "HIGH_EXISTENTIAL_THREAT" if len(recognized_threats) >= 2 else ("MODERATE_THREAT" if len(recognized_threats) == 1 else "NO_RECOGNIZABLE_THREAT")
    
    return {
        'target_company': target_company_name,
        'acquirer': acquirer_name,
        'blended_offer_price_usd': round(blended_offer_price, 2),
        'intrinsic_dcf_value_usd': target_intrinsic_standalone_dcf_value_usd,
        'recognized_threats': recognized_threats,
        'threat_severity': threat_severity,
        'judicial_scrutiny_standard': "ENHANCED_SCRUTINY_UNOCAL_REVIEW",
        'directors_bear_initial_burden_of_proof': True
    }

# Execute deterministic validation
b1 = evaluate_takeover_threat_and_bid_structure(
    "BioGen Pharma", "Raider Capital LLC", 50.0,
    75.0, 0.51, 40.0, "SUBORDINATED_JUNK_BONDS", False, True, 82.0
)
b2 = evaluate_takeover_threat_and_bid_structure(
    "CloudTech Inc.", "Strategic Conglomerate", 60.0,
    95.0, 1.0, 95.0, "CASH", True, True, 88.0
)

print(f"[{b1['target_company']}] -> Threats: {b1['recognized_threats']} | Severity: {b1['threat_severity']} | Scrutiny: {b1['judicial_scrutiny_standard']}")
print(f"[{b2['target_company']}] -> Threats: {b2['recognized_threats']} | Severity: {b2['threat_severity']} | Scrutiny: {b2['judicial_scrutiny_standard']}")
""",
            "output": """[BioGen Pharma] -> Threats: ['STRUCTURAL_COERCION_PRISONERS_DILEMMA', 'SUBSTANTIVE_COERCION_UNDERVALUED_BID', 'ILLUSORY_FINANCING_CONTINGENCY'] | Severity: HIGH_EXISTENTIAL_THREAT | Scrutiny: ENHANCED_SCRUTINY_UNOCAL_REVIEW
[CloudTech Inc.] -> Threats: [] | Severity: NO_RECOGNIZABLE_THREAT | Scrutiny: ENHANCED_SCRUTINY_UNOCAL_REVIEW
""",
            "codeNotes": [
                {"line": 15, "note": "Detects structural coercion in two-tier tender offers with predatory junk bond back-ends"},
                {"line": 23, "note": "Evaluates substantive coercion: offer falling below standalone DCF intrinsic value"},
                {"line": 42, "note": "Triggers Delaware Enhanced Scrutiny shifting initial burden of proof to defendant board"}
            ],
            "tryIt": "Set tier2_consideration_type to CASH and tier2_freeze_out_consideration_usd to 75.0 in b1 to see how structural coercion is eliminated.",
            "check": {
                "question": "Why does the Delaware Court of Chancery apply the 'Enhanced Scrutiny' intermediate standard of review to defensive measures taken against a hostile takeover?",
                "options": [
                    "Because of the inherent conflict of interest ('omnipresent specter') that directors may act primarily to entrench themselves in office rather than protect stockholders.",
                    "Because all mergers are strictly illegal under Delaware state constitution.",
                    "Because Delaware judges are required to personally negotiate every corporate buyout.",
                    "Because tender offers must be approved by the United Nations Security Council."
                ],
                "answer": 0,
                "why": "Unocal established Enhanced Scrutiny because defensive actions carry an inherent risk of managerial entrenchment, requiring directors to prove good faith and proportionality.",
                "answerIndex": 0,
                "explanation": "Unocal established Enhanced Scrutiny because defensive actions carry an inherent risk of managerial entrenchment, requiring directors to prove good faith and proportionality."
            }
        },
        {
            "title": "The Unocal Enhanced Scrutiny Two-Prong Test & Unitrin Proportionality",
            "say": [
                "The defining charter of Delaware takeover defense jurisprudence is Unocal Corp. v. Mesa Petroleum Co. (Del. 1985). In Unocal, corporate raider T. Boone Pickens launched a hostile, two-tier coercive tender offer for Unocal at $54 per share. In defense, the Unocal board approved a self-tender offer, offering to purchase its own shares for $72 in senior debt securities, but with an unprecedented twist: Mesa Petroleum was expressly excluded from participating in the buyback. Mesa sued, arguing the selective exclusion violated director fiduciary duties.",
                "The Delaware Supreme Court upheld Unocal's selective self-tender, establishing the seminal Unocal Two-Prong Test that governs all defensive actions: (1) Reasonableness / Threat Prong: Directors must prove they had reasonable grounds for believing that a danger to corporate policy and effectiveness existed. This burden is satisfied by demonstrating good faith and reasonable investigation, and is materially strengthened if approved by a board dominated by outside independent directors. (2) Proportionality Prong: Directors must prove that the defensive measure adopted was reasonable in relation to the threat posed.",
                "Delaware courts recognize three legitimate categories of takeover threats under Prong 1: (a) Structural Coercion—the risk that disparate terms between front-end and back-end tiers coerce stockholders into tendering; (b) Substantive Coercion—the risk that stockholders mistakenly tender into an inadequate offer because they undervalue the company's long-term business model; and (c) Opportunity Loss—the risk that a hostile bid deprives stockholders of a superior alternative transaction.",
                "A decade later, the Delaware Supreme Court refined Unocal's proportionality prong in Unitrin, Inc. v. American General Corp. (Del. 1995). Under Unitrin, the court applies a two-step proportionality filter: First, is the defensive measure 'Draconian'? A defense is draconian if it is either Coercive (forcing stockholders to accept a management-sponsored alternative) or Preclusive (rendering a hostile bid mathematically impossible or realistically unattainable).",
                "If the defense is NOT draconian, the court proceeds to the second step: determining whether the defense falls within a 'Range of Reasonableness'. If the measure falls within that broad range, the court will not substitute its business judgment for that of the board, upholding the defense."
            ],
            "example": "A board faces an unsolicited cash bid at $60/share while internal DCF models value the company at $85/share. The board adopts a standard 15% poison pill. Under Unocal and Unitrin, substantive coercion represents a valid threat, and the pill is not draconian because a bidder can conduct a proxy fight; thus, the pill falls within the range of reasonableness.",
            "code": """# Simulation: Unocal Enhanced Scrutiny & Unitrin Draconian Proportionality Filter
from typing import Dict, List

def evaluate_unocal_proportionality_defense(
    defense_name: str,
    threat_category: str, # 'STRUCTURAL_COERCION', 'SUBSTANTIVE_COERCION', 'INADEQUATE_PRICE'
    board_conducted_reasonable_investigation: bool,
    approved_by_majority_independent_directors: bool,
    defensive_measure_is_coercive_to_shareholders: bool,
    defensive_measure_renders_proxy_contest_mathematically_impossible: bool, # Preclusive
    defense_proportional_to_threat_severity: bool
) -> dict:
    # 1. Unocal Prong 1: Reasonable Grounds for Believing Threat Existed
    prong1_threat_justified = (
        board_conducted_reasonable_investigation and 
        approved_by_majority_independent_directors and 
        threat_category in ['STRUCTURAL_COERCION', 'SUBSTANTIVE_COERCION', 'INADEQUATE_PRICE']
    )
    
    if not prong1_threat_justified:
        return {
            'defense_name': defense_name,
            'unocal_prong1_cleared': False,
            'unocal_prong2_cleared': False,
            'verdict': "DEFENSE_STRUCK_DOWN_UNOCAL_PRONG_1_FAILURE",
            'rationale': "Board failed to establish good faith and reasonable investigation of threat.",
            'chancery_injunction_granted': True
        }
        
    # 2. Unocal Prong 2 / Unitrin Analysis: Proportionality and Non-Draconian Test
    is_draconian = (
        defensive_measure_is_coercive_to_shareholders or 
        defensive_measure_renders_proxy_contest_mathematically_impossible
    )
    
    if is_draconian:
        draconian_type = "PRECLUSIVE" if defensive_measure_renders_proxy_contest_mathematically_impossible else "COERCIVE"
        return {
            'defense_name': defense_name,
            'unocal_prong1_cleared': True,
            'unocal_prong2_cleared': False,
            'verdict': f"DEFENSE_STRUCK_DOWN_DRACONIAN_{draconian_type}",
            'rationale': f"Defensive measure is draconian ({draconian_type}); shuts down shareholder franchise or forces management deal.",
            'chancery_injunction_granted': True
        }
        
    # Range of Reasonableness
    falls_within_range_of_reasonableness = defense_proportional_to_threat_severity
    
    if falls_within_range_of_reasonableness:
        verdict = "DEFENSE_UPHELD_UNOCAL_AND_UNITRIN_SATISFIED"
        rationale = "Measure is non-draconian and falls within broad range of boardroom reasonableness."
        injunction = False
    else:
        verdict = "DEFENSE_STRUCK_DOWN_DISPROPORTIONATE_RESPONSE"
        rationale = "Defensive response is disproportionate to mild threat severity."
        injunction = True
        
    return {
        'defense_name': defense_name,
        'unocal_prong1_cleared': True,
        'unocal_prong2_cleared': not injunction,
        'verdict': verdict,
        'rationale': rationale,
        'chancery_injunction_granted': injunction
    }

# Execute deterministic validation
u1 = evaluate_unocal_proportionality_defense("Shareholder Rights Plan (Poison Pill)", "SUBSTANTIVE_COERCION", True, True, False, False, True)
u2 = evaluate_unocal_proportionality_defense("Irreversible Lock-up Asset Sale", "INADEQUATE_PRICE", True, True, False, True, False)

print(f"[{u1['defense_name']}] -> Verdict: {u1['verdict']} | Injunction: {u1['chancery_injunction_granted']}")
print(f"[{u2['defense_name']}] -> Verdict: {u2['verdict']} | Injunction: {u2['chancery_injunction_granted']}")
""",
            "output": """[Shareholder Rights Plan (Poison Pill)] -> Verdict: DEFENSE_UPHELD_UNOCAL_AND_UNITRIN_SATISFIED | Injunction: False
[Irreversible Lock-up Asset Sale] -> Verdict: DEFENSE_STRUCK_DOWN_DRACONIAN_PRECLUSIVE | Injunction: True
""",
            "codeNotes": [
                {"line": 14, "note": "Audits Unocal Prong 1: reasonable investigation backed by independent directors"},
                {"line": 26, "note": "Applies Unitrin draconian filter: voids defenses that are coercive or preclusive"},
                {"line": 39, "note": "Validates that non-draconian defenses within range of reasonableness are upheld"}
            ],
            "tryIt": "Set defensive_measure_renders_proxy_contest_mathematically_impossible to True in u1 to see how an otherwise valid poison pill becomes an enjoined preclusive defense.",
            "check": {
                "question": "Under Unitrin v. American General Corp., what makes a corporate takeover defensive measure 'Draconian' and therefore illegal under Delaware law?",
                "options": [
                    "The defensive measure is either 'Coercive' (forcing shareholders to accept a management transaction) or 'Preclusive' (rendering a proxy contest or takeover realistically unattainable).",
                    "The defense costs more than $10,000 in filing fees.",
                    "The board hires an investment bank based in New York.",
                    "The defense was voted on after 5:00 PM."
                ],
                "answer": 0,
                "why": "Unitrin established that draconian defenses (those that coerce stockholders or preclude any contest) are per se disproportionate and invalid under Unocal.",
                "answerIndex": 0,
                "explanation": "Unitrin established that draconian defenses (those that coerce stockholders or preclude any contest) are per se disproportionate and invalid under Unocal."
            }
        },
        {
            "title": "The Shareholder Rights Plan: Anatomy of the Poison Pill & Dilution Dynamics",
            "say": [
                "The most lethal, elegant, and controversial financial weapon ever created in corporate governance is the Shareholder Rights Plan, universally known as the Poison Pill. Invented in 1982 by legendary M&A attorney Martin Lipton of Wachtell, Lipton, Rosen & Katz, the poison pill was designed to level the playing field between corporate boards and hostile raiders by making an unapproved acquisition financially suicidal.",
                "The legality of the poison pill was definitively validated by the Delaware Supreme Court in Moran v. Household International, Inc. (Del. 1985). In Moran, the court ruled that adopting a rights plan prior to the emergence of a hostile bid was a valid exercise of managerial authority under DGCL § 141(a) and DGCL § 157 (authorizing the issuance of rights and options to purchase stock).",
                "The mechanical anatomy of a modern 'Flip-In' Poison Pill operates through sophisticated capital structure engineering. First, the board declares a dividend of one preferred share purchase 'Right' for every outstanding common share. Initially, these rights are dormant, out-of-the-money, non-exercisable, and trade attached to common certificates.",
                "Second, the plan establishes a Trigger Threshold (typically 15% to 20% of outstanding common stock; or 10% to 12% in activist defense pills). If any person or group acquires beneficial ownership exceeding that threshold without prior board approval, a 'Flip-In Event' detonates: the rights detach from common stock and become immediately exercisable by every stockholder in the world EXCEPT the hostile acquirer.",
                "Third, upon exercise, each right entitles the holder to purchase shares of target common stock at a massive 50% discount (e.g., paying $100 exercise price to receive $200 worth of stock). Because the acquirer is strictly excluded from exercising rights, the detonate floods the market with millions of newly minted, half-price shares. The acquirer's ownership percentage collapses overnight (e.g., from 20% down to 8%), and hundreds of millions of dollars of the acquirer's capital are transferred directly into the pockets of the target's other stockholders.",
                "Because crossing the threshold causes catastrophic economic self-destruction, no hostile bidder has ever intentionally triggered a modern poison pill. Instead, the pill acts as an absolute show-stopper, forcing the acquirer to halt purchases and negotiate directly with the board of directors to redeem the pill."
            ],
            "example": "A raider buys 20.1% of a tech company with a 15% pill. The trigger detonates: the other 79.9% of shareholders exercise rights to buy stock at a 50% discount. The total shares double, the raider's stake is diluted to 10.5%, and the raider suffers an immediate $150 million loss in capital value. The threat alone forces bidders to negotiate.",
            "code": """# Simulation: Shareholder Rights Plan (Poison Pill) Flip-In Dilution Engine
from typing import Dict, List

def simulate_poison_pill_flip_in_dilution(
    company_name: str,
    total_shares_outstanding: int,
    current_share_price_usd: float,
    pill_trigger_threshold_percentage: float, # e.g. 0.15 for 15%
    acquirer_acquired_shares_percentage: float, # e.g. 0.20 for 20%
    right_exercise_price_usd: float, # e.g. 100.0
    discount_rate_on_exercise: float # Standard 0.50 (50% discount)
) -> dict:
    acquirer_shares_pre_trigger = total_shares_outstanding * acquirer_acquired_shares_percentage
    non_acquirer_shares_pre_trigger = total_shares_outstanding - acquirer_shares_pre_trigger
    
    # Check if trigger tripped
    tripped = acquirer_acquired_shares_percentage >= pill_trigger_threshold_percentage
    if not tripped:
        return {
            'company_name': company_name,
            'pill_detonated': False,
            'status': "RIGHTS_REMAIN_DORMANT",
            'acquirer_post_trigger_ownership_pct': round(acquirer_acquired_shares_percentage * 100, 2),
            'acquirer_capital_dilution_loss_usd': 0.0
        }
        
    # Detonation Mechanics: Non-acquirers exercise rights to buy discounted stock
    # Value received per right = right_exercise_price / (1 - discount_rate) = $100 / 0.5 = $200 of stock
    # Number of shares received per right = $200 / current_share_price
    value_of_stock_received_per_right = right_exercise_price_usd / (1.0 - discount_rate_on_exercise)
    shares_issued_per_exercised_right = value_of_stock_received_per_right / current_share_price_usd
    
    newly_issued_dilutive_shares = non_acquirer_shares_pre_trigger * shares_issued_per_exercised_right
    total_shares_post_trigger = total_shares_outstanding + newly_issued_dilutive_shares
    
    # Acquirer holds the exact same number of shares, but total shares expanded massively!
    acquirer_post_trigger_ownership_pct = (acquirer_shares_pre_trigger / total_shares_post_trigger) * 100.0
    
    # Acquirer value loss
    pre_trigger_acquirer_value = acquirer_shares_pre_trigger * current_share_price_usd
    # Post-dilution blended share price
    total_new_cash_invested = non_acquirer_shares_pre_trigger * right_exercise_price_usd
    post_trigger_enterprise_equity_value = (total_shares_outstanding * current_share_price_usd) + total_new_cash_invested
    post_trigger_share_price = post_trigger_enterprise_equity_value / total_shares_post_trigger
    
    post_trigger_acquirer_value = acquirer_shares_pre_trigger * post_trigger_share_price
    acquirer_capital_loss_usd = pre_trigger_acquirer_value - post_trigger_acquirer_value
    
    return {
        'company_name': company_name,
        'pill_detonated': True,
        'status': "FLIP_IN_RIGHTS_EXERCISED_ACQUIRER_DILUTED",
        'pre_trigger_acquirer_pct': round(acquirer_acquired_shares_percentage * 100, 1),
        'post_trigger_acquirer_pct': round(acquirer_post_trigger_ownership_pct, 1),
        'pre_trigger_shares_count': total_shares_outstanding,
        'post_trigger_shares_count': int(total_shares_post_trigger),
        'acquirer_capital_dilution_loss_usd': round(acquirer_capital_loss_usd, 2)
    }

# Execute deterministic validation
p_sim = simulate_poison_pill_flip_in_dilution(
    "CyberCore Defense Inc.", 100000000, 50.0, 0.15, 0.20, 100.0, 0.50
)
print(f"[{p_sim['company_name']}] -> Detonated: {p_sim['pill_detonated']} | Stake: {p_sim['pre_trigger_acquirer_pct']}% -> {p_sim['post_trigger_acquirer_pct']}% | Acquirer Loss: ${p_sim['acquirer_capital_dilution_loss_usd']/1e6:.1f}M")
""",
            "output": """[CyberCore Defense Inc.] -> Detonated: True | Stake: 20.0% -> 4.8% | Acquirer Loss: $381.0M
""",
            "codeNotes": [
                {"line": 15, "note": "Detects 15% flip-in trigger event detonating non-acquirer rights"},
                {"line": 28, "note": "Calculates massive non-acquirer share expansion at 50% statutory discount"},
                {"line": 34, "note": "Models catastrophic dilution: acquirer stake collapses from 20% to 4.8%, losing $381M"}
            ],
            "tryIt": "Reduce acquirer_acquired_shares_percentage to 0.14 in p_sim to observe how the poison pill remains dormant below the 15% trigger.",
            "check": {
                "question": "What is the mechanical reason why a hostile bidder cannot survive intentionally triggering a modern 'Flip-In' Poison Pill?",
                "options": [
                    "All other stockholders can buy massive amounts of stock at a 50% discount while the bidder is legally excluded, collapsing the bidder's ownership percentage and destroying hundreds of millions in capital.",
                    "The Delaware Chancery Court immediately executes the bidder's board of directors.",
                    "The target company's stock is deleted from the New York Stock Exchange.",
                    "The Federal Reserve takes over the target corporation's bank accounts."
                ],
                "answer": 0,
                "why": "The selective exclusion of the acquirer combined with 50% discounted stock purchases by non-acquirers creates catastrophic dilution that makes hostile triggers economically impossible.",
                "answerIndex": 0,
                "explanation": "The selective exclusion of the acquirer combined with 50% discounted stock purchases by non-acquirers creates catastrophic dilution that makes hostile triggers economically impossible."
            }
        },
        {
            "title": "Staggered Boards & The Interplay with Poison Pills: Airgas & Just Say No",
            "say": [
                "Because a poison pill makes a direct tender offer impossible, a sophisticated hostile bidder does not attempt to trigger the pill. Instead, the bidder pursues a two-track strategy: launching a simultaneous Tender Offer and Proxy Contest. The bidder nominates an opposition slate of directors committed to redeeming the poison pill. If the bidder wins the proxy contest and takes over the board, the new directors vote to redeem the rights plan, allowing the tender offer to proceed.",
                "To counter this proxy contest workaround, target corporations deploy the ultimate structural fortress: the Classified or Staggered Board under DGCL § 141(d). In a classified board, directors are divided into three equal classes (Class I, Class II, Class III), with each class serving a staggered three-year term, and only one class standing for election at each annual meeting.",
                "The combination of a Staggered Board and a Poison Pill creates an almost impenetrable defense: a hostile bidder cannot replace the majority of the board in a single election! To win 2 out of 3 classes, the bidder must mount and win two consecutive annual proxy contests over a grueling two-year period, keeping billions of dollars of acquisition financing committed while the target board defends itself.",
                "The legal limits of this fortress were tested in the landmark decision Air Products & Chemicals, Inc. v. Airgas, Inc. (Del. Ch. 2011). Air Products launched a hostile bid for Airgas at $60/share, raising it to $70. Airgas's classified board and poison pill blocked the bid. Air Products won the first annual meeting, electing 3 insurgent directors, but Airgas's board (including the newly elected insurgent directors!) unanimously voted that $70 was inadequate based on standalone intrinsic value.",
                "Air Products sued, asking Chancellor William B. Chandler III to force Airgas to redeem its pill. Chancellor Chandler held that under Delaware Unocal jurisprudence, an independent, staggered board acting in good faith on the advice of legal and banking advisors is legally entitled to 'Just Say No' indefinitely. The court ruled that as long as the bid poses a threat of substantive coercion, judges will not force a board to pull down its poison pill."
            ],
            "example": "A bidder offers $50 for a company trading at $35. The target has a 3-class staggered board and a pill. The bidder wins Class I (33% of seats) at the 2024 annual meeting. The board still refuses to sell. The bidder must wait until the 2025 annual meeting to win Class II before it can redeem the pill. Facing 18 months of delay, the bidder raises its bid to $68 to negotiate a friendly merger.",
            "code": """# Simulation: Airgas Staggered Board & Poison Pill 'Just Say No' Defense Engine
from typing import Dict, List

def model_airgas_staggered_board_pill_defense(
    target_company_name: str,
    bidder_name: str,
    hostile_cash_bid_per_share: float,
    standalone_dcf_valuation_per_share: float,
    board_has_effective_staggered_classes: bool, # DGCL § 141(d) 3 classes
    poison_pill_rights_plan_active: bool,
    board_consists_of_majority_independent_directors: bool,
    target_annual_meetings_won_by_bidder_so_far: int,
    advisors_formally_opined_bid_substantively_inadequate: bool
) -> dict:
    # 1. Substantive Coercion Threat Evaluation under Airgas
    substantive_coercion_threat_exists = (
        hostile_cash_bid_per_share < standalone_dcf_valuation_per_share and 
        advisors_formally_opined_bid_substantively_inadequate
    )
    
    # 2. Boardroom Power Assessment
    # With 3 staggered classes, bidder needs to win 2 annual meetings to gain control (66.7%)
    board_majority_controlled_by_bidder = target_annual_meetings_won_by_bidder_so_far >= 2
    
    # 3. Delaware Chancery Court Pill Redemption Injunction Analysis
    # Airgas Rule: Chancery will NOT order pill redemption if board acts in good faith on substantive coercion
    chancery_will_order_pill_redemption = False
    
    if board_majority_controlled_by_bidder:
        defense_posture = "BIDDER_CONTROLLED_BOARD_REDEEMS_PILL_TAKEOVER_PROCEEDS"
        takeover_outcome = "ACQUISITION_CONSUMMATED"
        board_can_just_say_no = False
    elif board_has_effective_staggered_classes and poison_pill_rights_plan_active:
        if substantive_coercion_threat_exists and board_consists_of_majority_independent_directors:
            defense_posture = "AIRGAS_JUST_SAY_NO_FORTRESS_INTACT"
            takeover_outcome = "BIDDER_BLOCKED_FORCED_TO_NEGOTIATE_OR_AWAIT_NEXT_AGM"
            board_can_just_say_no = True
        else:
            defense_posture = "PILL_VULNERABLE_TO_UNOCAL_RANGE_OF_REASONABLENESS_CHALLENGE"
            takeover_outcome = "POTENTIAL_JUDICIAL_REDEMPTION"
            board_can_just_say_no = False
    else:
        defense_posture = "DEFENSELESS_SINGLE_CLASS_BOARD_VULNERABLE_TO_IMMEDIATE_TAKEOVER"
        takeover_outcome = "PROXY_FIGHT_CONTEST_LOSS"
        board_can_just_say_no = False
        
    return {
        'target_company': target_company_name,
        'bidder_name': bidder_name,
        'board_can_just_say_no': board_can_just_say_no,
        'chancery_will_order_pill_redemption': chancery_will_order_pill_redemption,
        'defense_posture': defense_posture,
        'takeover_outcome': takeover_outcome,
        'years_required_for_hostile_bidder_to_gain_control': 2 if (board_has_effective_staggered_classes and target_annual_meetings_won_by_bidder_so_far < 2) else 0
    }

# Execute deterministic validation
airgas_case = model_airgas_staggered_board_pill_defense(
    "Airgas Inc.", "Air Products & Chemicals", 70.0, 78.0,
    True, True, True, 1, True
)
print(f"[{airgas_case['target_company']}] -> Just Say No: {airgas_case['board_can_just_say_no']} | Posture: {airgas_case['defense_posture']} | Delay: {airgas_case['years_required_for_hostile_bidder_to_gain_control']} years")
""",
            "output": """[Airgas Inc.] -> Just Say No: True | Posture: AIRGAS_JUST_SAY_NO_FORTRESS_INTACT | Delay: 2 years
""",
            "codeNotes": [
                {"line": 14, "note": "Evaluates substantive coercion under Airgas: cash bid below independent DCF value"},
                {"line": 28, "note": "Implements Airgas holding: Chancery Court will not order board to pull down pill"},
                {"line": 40, "note": "Forces hostile bidder to endure multi-year delay or raise price to negotiate"}
            ],
            "tryIt": "Set target_annual_meetings_won_by_bidder_so_far to 2 in airgas_case to simulate the bidder winning their second consecutive proxy contest and redeeming the pill.",
            "check": {
                "question": "Under Chancellor Chandler's landmark decision in Air Products v. Airgas, will the Delaware Court of Chancery force a corporate board to redeem its poison pill against an unsolicited all-cash tender offer?",
                "options": [
                    "No; as long as an independent board acts in good faith with independent advice and identifies a valid threat of substantive coercion, the board may 'Just Say No' indefinitely.",
                    "Yes; poison pills must be cancelled within 30 days of any tender offer.",
                    "Yes; Delaware law requires boards to accept any bid that offers a 10% premium.",
                    "No; but only if the target CEO moves to California."
                ],
                "answer": 0,
                "why": "Airgas established that Delaware courts will not substitute their judgment for an independent board's, permitting boards to maintain a pill against inadequate bids.",
                "answerIndex": 0,
                "explanation": "Airgas established that Delaware courts will not substitute their judgment for an independent board's, permitting boards to maintain a pill against inadequate bids."
            }
        },
        {
            "title": "Tactical Bylaw Defenses: Advance Notice Bylaws & Special Meeting Restrictions",
            "say": [
                "While poison pills deter tender offers, the frontline operational defense against hostile proxy fights is embedded in the corporation's Bylaws. Under DGCL § 109, the certificate of incorporation can confer upon the board of directors the power to adopt, amend, or repeal bylaws. Boards utilize this authority to construct comprehensive procedural hurdles that prevent activist ambushes and hostile sneak attacks.",
                "The premier procedural defense is the Advance Notice Bylaw. An advance notice bylaw stipulates strict procedural windows and disclosure requirements that a shareholder must satisfy before nominating directors or proposing business at an annual meeting. Typically, notice must be submitted between 90 and 120 calendar days prior to the anniversary of the prior year's annual meeting.",
                "In recent years, corporate boards modernized advance notice bylaws to demand exhaustive disclosures: (1) True beneficial ownership of all equity, debt, and derivative instruments (including cash-settled equity swaps and synthetic short positions designed to evade Section 13(d) filing requirements); (2) Detailed questionnaires disclosing any criminal records, bankruptcies, or conflicts of interest of nominees; and (3) Disclosure of 'Golden Leash' agreements (compensatory arrangements where an activist fund promises cash bonuses to dissident nominees if they successfully execute a corporate turnaround).",
                "In landmark Delaware Chancery rulings—including Rosenbaum v. CytoDyn Inc. (Del. Ch. 2021) and AIM ImmunoTech Inc. v. SFH (Del. Ch. 2023)—Delaware reaffirmed that unambiguous advance notice bylaws will be strictly enforced as a matter of contract law. When dissident nominees fail to disclose material third-party funding or synthetic swap arrangements, the board may lawfully disqualify the dissident slate without violating fiduciary duties.",
                "However, Delaware equity imposes strict temporal limits: if the board adopts aggressive, obscure advance notice amendments on the 'eve of an election' to deliberately ambush an active insurgent without reasonable notice, the Court of Chancery will intervene under Blasius and Unocal to enjoin the amendments and protect the democratic vote."
            ],
            "example": "An activist hedge fund attempts to nominate 3 directors 65 days before the annual meeting, concealing a side agreement to pay nominees $250,000 each upon board election. The company's advance notice bylaw requires 90 days' notice and full golden leash disclosure. Under CytoDyn, the board lawfully rejects the nominations, eliminating the contest.",
            "code": """# Simulation: Advance Notice Bylaw Compliance & Activist Nomination Auditing Engine
from typing import Dict, List

def audit_advance_notice_bylaw_enforceability(
    target_company_name: str,
    activist_fund_name: str,
    days_prior_to_agm_nomination_submitted: int, # Minimum required: 90 days
    bylaw_minimum_notice_days_required: int, # e.g. 90
    bylaw_maximum_notice_days_required: int, # e.g. 120
    disclosed_all_synthetic_derivative_equity_swaps: bool,
    disclosed_golden_leash_third_party_compensation: bool,
    bylaws_adopted_on_eve_of_election_in_bad_faith: bool
) -> dict:
    # 1. Timeliness Window Check
    is_timely = (
        bylaw_minimum_notice_days_required <= 
        days_prior_to_agm_nomination_submitted <= 
        bylaw_maximum_notice_days_required
    )
    
    # 2. Material Disclosure Integrity Check (CytoDyn / AIM ImmunoTech)
    disclosure_fully_compliant = (
        disclosed_all_synthetic_derivative_equity_swaps and 
        disclosed_golden_leash_third_party_compensation
    )
    
    # 3. Board Bad-Faith Eve-of-Election Ambush Check (Blasius / Unocal Constraint)
    is_inequitable_board_ambush = bylaws_adopted_on_eve_of_election_in_bad_faith
    
    if is_inequitable_board_ambush:
        return {
            'target_company': target_company_name,
            'activist_fund': activist_fund_name,
            'nomination_status': "NOMINATIONS_REINSTATED_CHANCERY_INJUNCTION",
            'bylaw_enforceability': "UNENFORCEABLE_BAD_FAITH_TIMING",
            'rationale': "Board adopted aggressive bylaw hurdles on eve of election to disenfranchise activist.",
            'activist_slate_on_ballot': True
        }
        
    if not is_timely:
        return {
            'target_company': target_company_name,
            'activist_fund': activist_fund_name,
            'nomination_status': "NOMINATIONS_REJECTED_UNTIMELY_NOTICE",
            'bylaw_enforceability': "ENFORCEABLE_STRICT_CONTRACTUAL_WINDOW",
            'rationale': f"Notice submitted {days_prior_to_agm_nomination_submitted} days prior; requires {bylaw_minimum_notice_days_required}-{bylaw_maximum_notice_days_required} days.",
            'activist_slate_on_ballot': False
        }
        
    if not disclosure_fully_compliant:
        return {
            'target_company': target_company_name,
            'activist_fund': activist_fund_name,
            'nomination_status': "NOMINATIONS_REJECTED_MATERIAL_DISCLOSURE_DEFECT",
            'bylaw_enforceability': "ENFORCEABLE_CYTODYN_AND_AIM_IMMUNOTECH_PRECEDENT",
            'rationale': "Failed to disclose synthetic swap equity or golden leash nominee bonuses under bylaw requirements.",
            'activist_slate_on_ballot': False
        }
        
    return {
        'target_company': target_company_name,
        'activist_fund': activist_fund_name,
        'nomination_status': "NOMINATIONS_VALIDATED_AND_CERTIFIED",
        'bylaw_enforceability': "VALID_CONTRACTUAL_COMPLIANCE",
        'rationale': "Activist satisfied all advance notice timelines and comprehensive disclosures.",
        'activist_slate_on_ballot': True
    }

# Execute deterministic validation
a1 = audit_advance_notice_bylaw_enforceability("CytoBio Inc.", "Activist Capital Partners", 95, 90, 120, False, False, False)
a2 = audit_advance_notice_bylaw_enforceability("Apex Systems", "Prudent Governance Fund", 100, 90, 120, True, True, False)
a3 = audit_advance_notice_bylaw_enforceability("Target Corp", "Insurgent Slated LLC", 95, 90, 120, True, True, True)

print(f"[{a1['activist_fund']}] -> Status: {a1['nomination_status']} | Enforceable: {a1['bylaw_enforceability']}")
print(f"[{a2['activist_fund']}] -> Status: {a2['nomination_status']} | Enforceable: {a2['bylaw_enforceability']}")
print(f"[{a3['activist_fund']}] -> Status: {a3['nomination_status']} | Enforceable: {a3['bylaw_enforceability']}")
""",
            "output": """[Activist Capital Partners] -> Status: NOMINATIONS_REJECTED_MATERIAL_DISCLOSURE_DEFECT | Enforceable: ENFORCEABLE_CYTODYN_AND_AIM_IMMUNOTECH_PRECEDENT
[Prudent Governance Fund] -> Status: NOMINATIONS_VALIDATED_AND_CERTIFIED | Enforceable: VALID_CONTRACTUAL_COMPLIANCE
[Insurgent Slated LLC] -> Status: NOMINATIONS_REINSTATED_CHANCERY_INJUNCTION | Enforceable: UNENFORCEABLE_BAD_FAITH_TIMING
""",
            "codeNotes": [
                {"line": 14, "note": "Audits contractual advance notice submission window (typically 90 to 120 days)"},
                {"line": 21, "note": "Enforces CytoDyn and AIM ImmunoTech rulings requiring full synthetic equity and bonus disclosure"},
                {"line": 28, "note": "Applies equitable Blasius check against bad-faith eve-of-election bylaw amendments"}
            ],
            "tryIt": "Set disclosed_all_synthetic_derivative_equity_swaps and disclosed_golden_leash_third_party_compensation to True in a1 to see the activist slate validated.",
            "check": {
                "question": "Under recent Delaware Court of Chancery decisions in Rosenbaum v. CytoDyn and AIM ImmunoTech, when can a board of directors lawfully reject an activist's director nominations?",
                "options": [
                    "When the activist fails to satisfy the clear, unambiguous procedural windows or disclosure requirements (such as synthetic swap or golden leash disclosures) set forth in advance notice bylaws.",
                    "Whenever the board of directors does not want to lose their jobs.",
                    "Only if the activist is based in a foreign country.",
                    "Never; advance notice bylaws are completely illegal under Delaware corporate law."
                ],
                "answer": 0,
                "why": "CytoDyn and AIM ImmunoTech affirmed that advance notice bylaws are enforceable contractual rules; failure to provide mandated disclosures justifies disqualifying nominees.",
                "answerIndex": 0,
                "explanation": "CytoDyn and AIM ImmunoTech affirmed that advance notice bylaws are enforceable contractual rules; failure to provide mandated disclosures justifies disqualifying nominees."
            }
        }
    ],
    "summary": [
        "Takeover Defense & Enhanced Scrutiny: Director conflicts in hostile bids invoke Enhanced Scrutiny; boards bear initial burden of proving reasonable threat investigation and proportional defense.",
        "Unocal & Unitrin Proportionality: Unocal requires good faith threat basis and proportional defense; Unitrin bars draconian (coercive or preclusive) responses, upholding range of reasonableness.",
        "Poison Pill Flip-In Dilution: Detonation grants non-acquirers rights to purchase stock at 50% discount under Moran, causing catastrophic dilution that makes hostile triggers suicidal.",
        "Airgas Staggered Board & Just Say No: Staggered boards require 2 years to capture; Chancery will not force an independent board to redeem a pill against substantive coercion (Airgas).",
        "Advance Notice Bylaws: Strictly enforced under CytoDyn and AIM ImmunoTech to disqualify non-compliant activist slates, unless adopted on the eve of election in bad faith under Blasius."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 5 Step 1: Takeover Defense & Unocal Rights Plan Architecture",
        "steps": [
            "Evaluate hostile tender offer structures for structural, substantive, and financing coercion threats under Unocal.",
            "Formulate a Unitrin proportionality defense ensuring measures are non-coercive and non-preclusive to proxy fights.",
            "Draft a Moran-compliant Shareholder Rights Plan (Poison Pill) and model flip-in 50% discount dilution math.",
            "Structure an Airgas staggered board defense and establish independent DCF valuation records to 'Just Say No'.",
            "Modernize advance notice bylaws to mandate synthetic equity and golden leash disclosures under CytoDyn."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_21)
    print(f"B.Com Corporate Law Day 21 Total Words: {total}")
    for i, p in enumerate(DAY_21['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
