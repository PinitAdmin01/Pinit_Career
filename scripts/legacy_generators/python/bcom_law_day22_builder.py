"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 22 Builder: M&A Deal Protections: Breakup Fees, No-Shops, Match Rights & Revlon Duties
Milestone 5: Takeover Defense, M&A Deal Protections & Antitrust Clearance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_22 = {
    "coursePrefix": "bcom_law",
    "day": 22,
    "title": "M&A Deal Protections: Breakup Fees, No-Shops, Match Rights & Revlon Duties",
    "goal": "Master transactional M&A jurisprudence and deal protection mechanics under Delaware law: determine the triggers and auctioneer mandate of Revlon duties under Paramount v. QVC and Time-Warner, structure valid No-Shop and Go-Shop covenants with mandatory fiduciary outs under Omnicare, evaluate the mathematical reasonableness and preclusiveness of Breakup Fees under Unocal, model Buyer Match Rights and DGCL § 146 Force-the-Vote provisions, and deploy post-closing Corwin cleansing to dismiss shareholder damages litigation.",
    "minutes": 45,
    "recap": "In Day 21, we analyzed takeover defenses, the Unocal proportionality test, poison pills under Moran, and Airgas's 'Just Say No' doctrine. Today in Day 22, we transition from takeover defense to negotiated M&A: the board's Revlon auction duties, structural deal protections, breakup fees, and post-closing Corwin cleansing.",
    "parts": [
        {
            "title": "The Revlon Moment: Breakup of the Company & Cash-Out Mergers",
            "say": [
                "When a corporate board transitions from managing a standalone enterprise to negotiating a sale of the company, the legal duties governing directorial conduct undergo a seismic, irreversible transformation. Under standard corporate governance, directors are charged under DGCL § 141(a) with preserving and enhancing the long-term enterprise value of the corporation. However, once the corporation enters the sale process, this long-term perspective is extinguished by equity.",
                "In the landmark decision Revlon, Inc. v. MacAndrews & Forbes Holdings, Inc. (Del. 1986), the Delaware Supreme Court established that when the breakup or sale of a corporation becomes inevitable, the board's traditional role as enterprise defender ceases. The directors' statutory role shifts radically from that of defenders of the corporate bastion to that of 'Auctioneers' charged with obtaining the highest price for stockholders at an immediate sale of the company. In the famous words of Justice Moore, 'The duty of the board had thus changed from the preservation of Revlon as a corporate entity to the maximization of the company's value at a sale for the stockholders' benefit.'",
                "The legal triggers of 'Revlon Duties' were definitively synthesized in Paramount Communications Inc. v. QVC Network Inc. (Del. 1994). Revlon enhanced scrutiny is triggered in three specific transactional settings: (1) When a corporation initiates an active bidding process seeking to sell itself or to effect a business reorganization involving a clear breakup of the company; (2) Where, in response to a bidder's offer, a target abandons its long-term strategy and seeks an alternative transaction involving the breakup of the company; or (3) When the target approves a transaction that results in a Change of Control—shifting control from a dispersed public shareholder body to a single controlling individual or entity.",
                "Crucially, the Delaware Supreme Court drew a sharp doctrinal boundary in Paramount Communications, Inc. v. Time, Inc. (Del. 1989): a pure stock-for-stock merger between two publicly held corporations with widely dispersed share ownership does NOT trigger Revlon duties. Why? Because post-merger, control remains fluid in a large, fluid, changeable and changing market of public shareholders; the shareholders have not been permanently cashed out, nor has a controlling block been created.",
                "Under Revlon, the Court of Chancery reviews board conduct with Enhanced Scrutiny, demanding that directors prove two elements: (a) Diligence in decision-making and process (conducting an active market check or market canvass); and (b) Reasonableness in achieving the highest transaction value reasonably available."
            ],
            "example": "A board agrees to sell 100% of the company for $80/share in cash to a private equity sponsor. Because public shareholders are permanently cashed out, Revlon duties apply: the board must obtain the highest price available and cannot grant lock-ups that prematurely cut off higher competing bids. But if two equal public tech giants merge 100% in stock, Time-Warner preserves BJR review.",
            "code": """# Simulation: Revlon Trigger Classifier & Auctioneer Mandate Engine
from typing import Dict, List

def evaluate_revlon_trigger_and_auction_mandate(
    target_company_name: str,
    transaction_type: str, # 'ALL_CASH_BUYOUT', 'STOCK_FOR_STOCK_PUBLIC_DISPERSED', 'STOCK_AND_CASH_HYBRID', 'SALE_TO_CONTROLLING_SHAREHOLDER'
    cash_consideration_percentage: float, # e.g. 1.0 for 100% cash
    post_transaction_control_structure: str, # 'CONTROL_IN_PUBLIC_MARKET' or 'CONTROL_CONCENTRATED_IN_SINGLE_ENTITY'
    board_actively_initiated_sale_process: bool,
    board_conducted_pre_or_post_signing_market_check: bool,
    highest_reasonably_available_price_achieved: bool
) -> dict:
    # 1. Determine Revlon Trigger under Paramount v. QVC and Time-Warner
    is_cash_sale = cash_consideration_percentage >= 0.50
    is_control_shift = post_transaction_control_structure == 'CONTROL_CONCENTRATED_IN_SINGLE_ENTITY'
    is_active_breakup_or_sale = board_actively_initiated_sale_process
    
    revlon_triggered = is_cash_sale or is_control_shift or is_active_breakup_or_sale
    
    # Doctrinal Exception: Paramount v. Time (Pure stock-for-stock between dispersed public entities)
    if transaction_type == 'STOCK_FOR_STOCK_PUBLIC_DISPERSED' and post_transaction_control_structure == 'CONTROL_IN_PUBLIC_MARKET' and cash_consideration_percentage == 0.0:
        revlon_triggered = False
        
    if not revlon_triggered:
        return {
            'target_company': target_company_name,
            'revlon_triggered': False,
            'governing_doctrine': "PARAMOUNT_V_TIME_INDEPENDENT_BUSINESS_JUDGMENT",
            'board_mandate': "PRESERVE_LONG_TERM_STRATEGIC_ENTERPRISE_VALUE",
            'judicial_scrutiny_standard': "BUSINESS_JUDGMENT_RULE_PRESUMPTION",
            'revlon_duty_satisfied': True
        }
        
    # 2. Revlon Enhanced Scrutiny Review
    # Board must demonstrate diligent market check and reasonable pursuit of highest price
    revlon_satisfied = board_conducted_pre_or_post_signing_market_check and highest_reasonably_available_price_achieved
    
    if revlon_satisfied:
        verdict = "REVLON_DUTIES_MET_MAXIMUM_SHAREHOLDER_VALUE_ACHIEVED"
        litigation_exposure = "CHANCERY_CLEARANCE_NO_INJUNCTION"
    else:
        verdict = "REVLON_BREACH_FAILED_AUCTIONEER_MANDATE"
        litigation_exposure = "PRELIMINARY_INJUNCTION_ENJOINING_MERGER_OR_DAMAGES"
        
    return {
        'target_company': target_company_name,
        'revlon_triggered': True,
        'governing_doctrine': "PARAMOUNT_V_QVC_AND_REVLON_AUCTION_MANDATE",
        'board_mandate': "MAXIMIZE_IMMEDIATE_CASH_CONSIDERATION_FOR_STOCKHOLDERS",
        'judicial_scrutiny_standard': "ENHANCED_SCRUTINY_REVLON_REVIEW",
        'revlon_duty_satisfied': revlon_satisfied,
        'verdict': verdict,
        'litigation_exposure': litigation_exposure
    }

# Execute deterministic validation
r1 = evaluate_revlon_trigger_and_auction_mandate(
    "CloudSaaS Inc.", "ALL_CASH_BUYOUT", 1.0,
    "CONTROL_CONCENTRATED_IN_SINGLE_ENTITY", True, True, True
)
r2 = evaluate_revlon_trigger_and_auction_mandate(
    "BioPharma Alliance", "STOCK_FOR_STOCK_PUBLIC_DISPERSED", 0.0,
    "CONTROL_IN_PUBLIC_MARKET", False, False, False
)

print(f"[{r1['target_company']}] -> Revlon: {r1['revlon_triggered']} | Mandate: {r1['board_mandate']} | Verdict: {r1['verdict']}")
print(f"[{r2['target_company']}] -> Revlon: {r2['revlon_triggered']} | Doctrine: {r2['governing_doctrine']} | Standard: {r2['judicial_scrutiny_standard']}")
""",
            "output": """[CloudSaaS Inc.] -> Revlon: True | Mandate: MAXIMIZE_IMMEDIATE_CASH_CONSIDERATION_FOR_STOCKHOLDERS | Verdict: REVLON_DUTIES_MET_MAXIMUM_SHAREHOLDER_VALUE_ACHIEVED
[BioPharma Alliance] -> Revlon: False | Doctrine: PARAMOUNT_V_TIME_INDEPENDENT_BUSINESS_JUDGMENT | Standard: BUSINESS_JUDGMENT_RULE_PRESUMPTION
""",
            "codeNotes": [
                {"line": 15, "note": "Identifies Revlon triggers: cash consideration, control shift, or active company sale"},
                {"line": 21, "note": "Applies Paramount v. Time exception for pure public dispersed stock-for-stock mergers"},
                {"line": 34, "note": "Demands diligent market check and reasonable pursuit of highest available transaction value"}
            ],
            "tryIt": "Set board_conducted_pre_or_post_signing_market_check to False in r1 to observe how procedural shortcuts trigger a Revlon breach.",
            "check": {
                "question": "Under Paramount Communications v. QVC Network and Revlon, when does a corporate board's duty shift from long-term enterprise growth to the auctioneer mandate of maximizing immediate share value?",
                "options": [
                    "Whenever the board initiates an active sale process, seeks an alternative transaction involving a company breakup, or enters a transaction resulting in a change of corporate control.",
                    "Only when the corporation files for Chapter 7 bankruptcy liquidation.",
                    "Whenever the company's quarterly revenue declines by more than 2%.",
                    "Never; Delaware law prohibits corporate auctions."
                ],
                "answer": 0,
                "why": "Paramount v. QVC solidified that Revlon duties apply whenever control shifts or public stockholders are cashed out, requiring value maximization.",
                "answerIndex": 0,
                "explanation": "Paramount v. QVC solidified that Revlon duties apply whenever control shifts or public stockholders are cashed out, requiring value maximization."
            }
        },
        {
            "title": "Deal Protection Invariants: No-Shops vs. Go-Shops & Fiduciary Outs",
            "say": [
                "When a buyer signs a definitive merger agreement to acquire a public company, the buyer expends massive resources on due diligence, investment banking fees, and debt financing commitments. To protect its deal from being poached by a rival bidder after announcement, the buyer demands strict contractual Deal Protection Devices.",
                "The primary deal protection covenants in public M&A agreements include: (1) The No-Shop Covenant; (2) The Go-Shop Provision; and (3) The Fiduciary Out Clause. Negotiating the balance between buyer deal certainty and board fiduciary obligations is one of the most heavily scrutinized areas of M&A practice.",
                "A standard 'No-Shop' covenant strictly prohibits the target corporation, its board, officers, and financial advisors from actively soliciting, initiating, or knowingly encouraging alternative acquisition proposals from third parties. However, under Delaware law, an absolute or 'watertight' no-shop clause is completely illegal. In the seminal ruling Omnicare, Inc. v. NCS Healthcare, Inc. (Del. 2003), the Delaware Supreme Court held that deal protections that are preclusive or coercive, and that disable the board from exercising its fiduciary duties upon the emergence of a superior proposal, are void ab initio.",
                "To remain enforceable, every no-shop clause must contain a 'Fiduciary Out'. The fiduciary out allows the target board to provide non-public information and engage in negotiations with an unsolicited third party if: (a) The proposal constitutes, or is reasonably likely to lead to, a 'Superior Proposal' (a bona fide transaction offering superior financial terms); and (b) The board determines in good faith, after consulting outside legal counsel, that failing to negotiate would violate its fiduciary duties.",
                "Conversely, in private equity buyouts or transactions without an extensive pre-signing auction, agreements often feature a 'Go-Shop' provision. A go-shop affirmatively permits the target board for a 30 to 50 day post-signing window to actively market the company to competing bidders, typically paired with a reduced termination fee if a superior deal emerges during the window."
            ],
            "example": "A merger agreement contains a strict no-shop covenant. Two weeks later, a rival bidder submits an unsolicited all-cash offer at a 25% premium. Because the contract contains a valid fiduciary out, the board can negotiate with the rival, share diligence, and accept the bid upon paying the initial buyer's breakup fee.",
            "code": """# Simulation: M&A Deal Protection Covenant Auditor & Omnicare Fiduciary Out Engine
from typing import Dict, List

def audit_deal_protection_covenants(
    deal_name: str,
    has_no_shop_covenant: bool,
    has_fiduciary_out_for_superior_proposals: bool,
    fiduciary_out_requires_advice_of_outside_counsel: bool,
    merger_agreement_is_completely_locked_up_without_escape: bool, # Omnicare defect
    has_go_shop_window_days: int, # e.g. 45 days
    breakup_fee_discount_during_go_shop_pct: float # e.g. 0.50 (50% fee discount)
) -> dict:
    # 1. Omnicare v. NCS Healthcare Absolute Lock-up Audit
    # Rule: Board cannot enter into a transaction that completely disables fiduciary duties
    is_omnicare_violation = (
        merger_agreement_is_completely_locked_up_without_escape or 
        (has_no_shop_covenant and not has_fiduciary_out_for_superior_proposals)
    )
    
    if is_omnicare_violation:
        return {
            'deal_name': deal_name,
            'deal_protection_status': "VOID_AB_INITIO_OMNICARE_VIOLATION",
            'fiduciary_out_valid': False,
            'rationale': "Merger lock-up is preclusive/coercive; board impermissibly abdicated non-delegable fiduciary duties.",
            'enforceable_in_chancery': False
        }
        
    # 2. Fiduciary Out Completeness Check
    fiduciary_out_sound = (
        has_fiduciary_out_for_superior_proposals and 
        fiduciary_out_requires_advice_of_outside_counsel
    )
    
    # 3. Market Check Posture (Go-Shop vs Standard No-Shop)
    if has_go_shop_window_days > 0:
        market_canvass_posture = f"ACTIVE_GO_SHOP_WINDOW_{has_go_shop_window_days}_DAYS"
        fee_structure = f"TIERED_BREAKUP_FEE_{int(breakup_fee_discount_during_go_shop_pct*100)}PCT_DISCOUNT"
    else:
        market_canvass_posture = "STANDARD_NO_SHOP_WITH_WINDOW_SHOPPING_OUT"
        fee_structure = "SINGLE_TIER_STANDARD_BREAKUP_FEE"
        
    return {
        'deal_name': deal_name,
        'deal_protection_status': "VALID_AND_ENFORCEABLE_DEAL_PROTECTIONS",
        'fiduciary_out_valid': fiduciary_out_sound,
        'market_canvass_posture': market_canvass_posture,
        'fee_structure': fee_structure,
        'rationale': "Covenants strike balanced deal certainty while preserving board fiduciary duties upon superior proposal.",
        'enforceable_in_chancery': True
    }

# Execute deterministic validation
d1 = audit_deal_protection_covenants("Enterprise SaaS Acquisition", True, True, True, False, 45, 0.50)
d2 = audit_deal_protection_covenants("Predatory Lock-up Deal", True, False, False, True, 0, 0.0)

print(f"[{d1['deal_name']}] -> Status: {d1['deal_protection_status']} | Enforceable: {d1['enforceable_in_chancery']}")
print(f"[{d2['deal_name']}] -> Status: {d2['deal_protection_status']} | Enforceable: {d2['enforceable_in_chancery']}")
""",
            "output": """[Enterprise SaaS Acquisition] -> Status: VALID_AND_ENFORCEABLE_DEAL_PROTECTIONS | Enforceable: True
[Predatory Lock-up Deal] -> Status: VOID_AB_INITIO_OMNICARE_VIOLATION | Enforceable: False
""",
            "codeNotes": [
                {"line": 15, "note": "Implements Omnicare rule: voiding absolute lock-ups lacking fiduciary out clauses"},
                {"line": 26, "note": "Audits fiduciary out prerequisites: outside legal advice and superior proposal threshold"},
                {"line": 31, "note": "Models tiered go-shop provisions featuring 50% breakup fee discounts"}
            ],
            "tryIt": "Set has_fiduciary_out_for_superior_proposals to False in d1 to observe how the contract immediately triggers an Omnicare violation.",
            "check": {
                "question": "Under the Delaware Supreme Court's ruling in Omnicare, Inc. v. NCS Healthcare, why are merger lock-ups that completely omit a fiduciary out clause invalid?",
                "options": [
                    "Because they are preclusive and coercive under Unocal, impermissibly disabling the board from fulfilling its fiduciary duties if a superior proposal emerges.",
                    "Because all merger agreements must be written entirely in Latin.",
                    "Because buyers are forbidden from recovering any expenses.",
                    "Because the Federal Trade Commission automatically voids all tech contracts."
                ],
                "answer": 0,
                "why": "Omnicare established that boards cannot contractually bind themselves to an absolute lock-up that renders a superior transaction impossible.",
                "answerIndex": 0,
                "explanation": "Omnicare established that boards cannot contractually bind themselves to an absolute lock-up that renders a superior transaction impossible."
            }
        },
        {
            "title": "Termination Fees (Breakup Fees) & Market Practice: The 3.5% Benchmark",
            "say": [
                "The most ubiquitous economic deal protection in M&A transactions is the Termination Fee, universally known as the Breakup Fee. A breakup fee is a stipulated dollar amount payable by the target corporation to the initial buyer if the target board terminates the merger agreement to accept an unsolicited superior proposal, or if stockholders vote down the merger following a change in board recommendation.",
                "The commercial justification for breakup fees is legitimate: the buyer invests millions in legal, accounting, and advisory fees, uncovers proprietary enterprise value, and risks reputational harm as a 'stalking horse' if outbid. The breakup fee reimburses the buyer's out-of-pocket expenses and compensates the buyer for lost opportunity costs.",
                "However, Delaware corporate law imposes strict judicial limits on the size of breakup fees under Unocal enhanced scrutiny. A breakup fee cannot be so exorbitantly large that it becomes 'Preclusive'—meaning it imposes such an onerous financial penalty that no third-party bidder could economically afford to submit a topping bid. If a fee is preclusive, it coerces stockholders into voting for the initial merger.",
                "Through decades of Court of Chancery jurisprudence—led by Vice Chancellor Leo E. Strine Jr. in In re Toys 'R' Us, Inc. Shareholder Litigation (Del. Ch. 2005) and Phelps Dodge Corp. v. Cyprus Amax Minerals Co.—Delaware established the established market benchmark: termination fees ranging between 2.5% and 3.75% of aggregate equity or enterprise transaction value are routinely upheld as reasonable.",
                "Fees exceeding 4.0% to 5.0% face intense judicial skepticism and are vulnerable to being struck down as preclusive penalties. Conversely, 'Reverse Termination Fees'—payable by the buyer to the target if the buyer fails to secure financing or regulatory antitrust clearance—routinely range from 5% to 8%, reflecting the severe operational damage inflicted on a target if a buyer walks away."
            ],
            "example": "In a $2 billion public company acquisition, the parties agree to a $70 million breakup fee (3.5% of equity value). A competing bidder offering $2.1 billion can easily absorb the $70 million fee ($3.50/share net improvement). The Chancery Court upholds the fee under Toys 'R' Us. But if the contract mandated a $200 million fee (10%), the court voids it as preclusive.",
            "code": """# Simulation: M&A Breakup Fee Reasonableness & Preclusiveness Calculator
from typing import Dict, List

def calculate_breakup_fee_reasonableness(
    deal_name: str,
    transaction_equity_value_usd: float,
    breakup_fee_dollar_amount_usd: float,
    is_go_shop_tiered_fee: bool,
    go_shop_breakup_fee_dollar_amount_usd: float
) -> dict:
    fee_percentage = (breakup_fee_dollar_amount_usd / transaction_equity_value_usd) * 100.0
    
    # Delaware Chancery Benchmarks (Toys 'R' Us / Phelps Dodge):
    # <= 3.75%: Standard Presumptively Valid Range
    # 3.75% - 4.5%: Scrutiny Zone (defensible only with extraordinary justification or small deal size)
    # > 4.5%: Presumptively Preclusive / Coercive
    
    if fee_percentage <= 3.75:
        chancery_status = "PRESUMPTIVELY_VALID_MARKET_BENCHMARK"
        preclusive_risk = "LOW_PERMISSIBLE_DEAL_PROTECTION"
        enforceable = True
    elif fee_percentage <= 4.50:
        chancery_status = "ELEVATED_SCRUTINY_REQUIRES_COMPELLING_JUSTIFICATION"
        preclusive_risk = "MODERATE_RISK_OF_INJUNCTION"
        enforceable = True
    else:
        chancery_status = "EXCESSIVE_PRECLUSIVE_PENALTY"
        preclusive_risk = "HIGH_UNENFORCEABLE_UNDER_UNOCAL"
        enforceable = False
        
    return {
        'deal_name': deal_name,
        'equity_value_usd': transaction_equity_value_usd,
        'breakup_fee_usd': breakup_fee_dollar_amount_usd,
        'breakup_fee_percentage': round(fee_percentage, 2),
        'chancery_status': chancery_status,
        'preclusive_risk': preclusive_risk,
        'enforceable_in_delaware': enforceable,
        'has_tiered_go_shop_fee': is_go_shop_tiered_fee
    }

# Execute deterministic validation
f1 = calculate_breakup_fee_reasonableness("Enterprise Tech Buyout", 2000000000.0, 70000000.0, False, 0.0)
f2 = calculate_breakup_fee_reasonableness("Mid-Cap Healthcare Merger", 500000000.0, 28000000.0, False, 0.0)

print(f"[{f1['deal_name']}] -> Fee: {f1['breakup_fee_percentage']}% | Status: {f1['chancery_status']} | Enforceable: {f1['enforceable_in_delaware']}")
print(f"[{f2['deal_name']}] -> Fee: {f2['breakup_fee_percentage']}% | Status: {f2['chancery_status']} | Enforceable: {f2['enforceable_in_delaware']}")
""",
            "output": """[Enterprise Tech Buyout] -> Fee: 3.5% | Status: PRESUMPTIVELY_VALID_MARKET_BENCHMARK | Enforceable: True
[Mid-Cap Healthcare Merger] -> Fee: 5.6% | Status: EXCESSIVE_PRECLUSIVE_PENALTY | Enforceable: False
""",
            "codeNotes": [
                {"line": 13, "note": "Calculates breakup fee as exact percentage of total equity transaction value"},
                {"line": 20, "note": "Applies Delaware Court of Chancery 3.75% benchmark established in Toys 'R' Us"},
                {"line": 29, "note": "Disqualifies fees exceeding 4.5% as impermissibly preclusive and coercive"}
            ],
            "tryIt": "Reduce breakup_fee_dollar_amount_usd in f2 to 17,500,000 (3.5%) to see the fee shift from an unenforceable penalty to an approved market benchmark.",
            "check": {
                "question": "What is the standard, presumptively valid percentage range for target breakup fees in public company acquisitions under Delaware Court of Chancery precedents?",
                "options": [
                    "Between 2.5% and 3.75% of aggregate equity or transaction value.",
                    "Exactly 25% of annual gross revenue.",
                    "Between 10% and 15% of total company debt.",
                    "Zero; breakup fees are completely illegal under federal law."
                ],
                "answer": 0,
                "why": "In re Toys 'R' Us and related Chancery decisions establish that fees within the 2.5% to 3.75% range provide reasonable deal certainty without precluding topping bids.",
                "answerIndex": 0,
                "explanation": "In re Toys 'R' Us and related Chancery decisions establish that fees within the 2.5% to 3.75% range provide reasonable deal certainty without precluding topping bids."
            }
        },
        {
            "title": "Information Rights, Match Rights & DGCL § 146 Force-the-Vote Covenants",
            "say": [
                "Beyond termination fees and no-shop covenants, buyers insist upon procedural mechanisms to ensure they retain the last word before a target board walks away with a competing bidder. The two most powerful procedural clauses in modern M&A agreements are Match Rights and Force-the-Vote Covenants.",
                "A 'Match Right' grants the initial buyer an exclusive contractual window—typically 3 to 5 business days—to amend its merger agreement and match or exceed the economic and structural terms of any unsolicited superior proposal received by the target. If the third-party bidder increases its offer, the agreement provides the initial buyer with a secondary match period (usually 2 to 3 days).",
                "During the match period, the target board is legally prohibited from terminating the agreement or changing its recommendation to stockholders. In practice, match rights heavily favor the initial buyer: competing bidders are hesitant to spend millions formulating a topping bid when the incumbent buyer can simply match the price with zero execution risk.",
                "To further maximize deal certainty, buyers utilize Section 146 of the Delaware General Corporation Law (DGCL § 146), known as the 'Force-the-Vote' statute. Enacted to overturn common-law ambiguities, DGCL § 146 expressly authorizes corporations to agree that a merger agreement must be submitted to a vote of stockholders even if the board of directors subsequently changes, withdraws, or modifies its recommendation.",
                "Under DGCL § 146, even if a rival emerges with an attractive topping bid and the target board issues an adverse recommendation warning stockholders to vote AGAINST the initial deal, the initial buyer can legally compel the target to convene the stockholder meeting and hold the vote. If stockholders nonetheless reject the deal, the initial buyer collects its breakup fee and moves on."
            ],
            "example": "Target agrees to sell to Buyer A for $50/share. Rival Bidder B offers $55/share. Under the match right clause, Buyer A has 4 business days to match. Buyer A amends its agreement to $55.50/share. Under the contract, Bidder B's proposal ceases to be a superior proposal, and the board cannot terminate. The deal closes with Buyer A.",
            "code": """# Simulation: M&A Match Right Negotiation & DGCL § 146 Force-the-Vote Engine
from typing import Dict, List

def model_match_right_and_force_the_vote_dynamics(
    deal_name: str,
    initial_buyer_price_per_share: float,
    unsolicited_rival_topping_price_per_share: float,
    buyer_match_window_business_days: int,
    initial_buyer_matches_or_tops_rival_bid: bool,
    matched_new_price_per_share: float,
    merger_agreement_includes_dgcl_146_force_the_vote: bool,
    stockholders_vote_in_favor_of_initial_buyer_deal: bool,
    breakup_fee_payable_usd: float
) -> dict:
    rival_premium_pct = ((unsolicited_rival_topping_price_per_share - initial_buyer_price_per_share) / initial_buyer_price_per_share) * 100.0
    
    # 1. Match Right Dynamics
    if initial_buyer_matches_or_tops_rival_bid and matched_new_price_per_share >= unsolicited_rival_topping_price_per_share:
        return {
            'deal_name': deal_name,
            'match_right_invoked': True,
            'buyer_status': "BUYER_MATCHED_RIVAL_BID_SUPERIOR_PROPOSAL_CURED",
            'final_deal_price_per_share': matched_new_price_per_share,
            'acquirer_closing_deal': "INITIAL_BUYER",
            'breakup_fee_paid': False,
            'closing_posture': "MERGER_CLOSES_WITH_INITIAL_BUYER_AT_MATCHED_PRICE"
        }
        
    # 2. Match Right Expired Without Match: Target Board seeks termination
    # Check DGCL § 146 Force-the-Vote Covenant
    if merger_agreement_includes_dgcl_146_force_the_vote:
        if stockholders_vote_in_favor_of_initial_buyer_deal:
            closing_posture = "MERGER_APPROVED_BY_STOCKHOLDERS_DESPITE_RIVAL_BID"
            acquirer = "INITIAL_BUYER"
            fee_paid = False
        else:
            closing_posture = "STOCKHOLDERS_REJECTED_INITIAL_DEAL_TERMINATION_TRIGGERED"
            acquirer = "RIVAL_BIDDER"
            fee_paid = True
    else:
        # Without Force-the-Vote, board exercises fiduciary out and terminates immediately
        closing_posture = "BOARD_TERMINATED_FOR_SUPERIOR_PROPOSAL_PAID_BREAKUP_FEE"
        acquirer = "RIVAL_BIDDER"
        fee_paid = True
        
    return {
        'deal_name': deal_name,
        'match_right_invoked': True,
        'buyer_status': "BUYER_DECLINED_TO_MATCH_TOPPING_BID",
        'final_deal_price_per_share': unsolicited_rival_topping_price_per_share,
        'acquirer_closing_deal': acquirer,
        'breakup_fee_paid': fee_paid,
        'closing_posture': closing_posture
    }

# Execute deterministic validation
m1 = model_match_right_and_force_the_vote_dynamics(
    "Global Logistics Acquisition", 60.0, 68.0, 4, True, 68.5, True, True, 45000000.0
)
m2 = model_match_right_and_force_the_vote_dynamics(
    "Solar Energy Buyout", 40.0, 48.0, 4, False, 0.0, True, False, 25000000.0
)

print(f"[{m1['deal_name']}] -> Status: {m1['buyer_status']} | Winner: {m1['acquirer_closing_deal']} | Posture: {m1['closing_posture']}")
print(f"[{m2['deal_name']}] -> Status: {m2['buyer_status']} | Winner: {m2['acquirer_closing_deal']} | Posture: {m2['closing_posture']}")
""",
            "output": """[Global Logistics Acquisition] -> Status: BUYER_MATCHED_RIVAL_BID_SUPERIOR_PROPOSAL_CURED | Winner: INITIAL_BUYER | Posture: MERGER_CLOSES_WITH_INITIAL_BUYER_AT_MATCHED_PRICE
[Solar Energy Buyout] -> Status: BUYER_DECLINED_TO_MATCH_TOPPING_BID | Winner: RIVAL_BIDDER | Posture: STOCKHOLDERS_REJECTED_INITIAL_DEAL_TERMINATION_TRIGGERED
""",
            "codeNotes": [
                {"line": 15, "note": "Implements match right mechanics: curing superior proposals by matching terms"},
                {"line": 26, "note": "Enforces DGCL § 146 force-the-vote statutory covenants requiring shareholder meeting"},
                {"line": 34, "note": "Triggers payment of contractual breakup fee upon termination for superior proposal"}
            ],
            "tryIt": "Set initial_buyer_matches_or_tops_rival_bid to False in m1 to simulate the rival bidder winning the target and paying the breakup fee.",
            "check": {
                "question": "What is the legal effect of including a 'Force-the-Vote' covenant authorized under DGCL § 146 in an M&A merger agreement?",
                "options": [
                    "The target corporation must submit the merger agreement to a stockholder vote even if the board of directors subsequently changes its recommendation to oppose the deal.",
                    "The board of directors is arrested if stockholders vote against the merger.",
                    "The merger closes automatically without requiring any shareholder vote.",
                    "The rival bidder is banned from buying stock for ten years."
                ],
                "answer": 0,
                "why": "Section 146 expressly authorizes agreements requiring a merger vote regardless of whether the board withdraws its recommendation.",
                "answerIndex": 0,
                "explanation": "Section 146 expressly authorizes agreements requiring a merger vote regardless of whether the board withdraws its recommendation."
            }
        },
        {
            "title": "Post-Closing Judicial Cleansing: The Corwin Doctrine",
            "say": [
                "Even when an M&A transaction was negotiated with minor procedural defects, tight deal protections, or aggressive banker compensation structures, does every closed merger expose directors to personal post-closing damages liability under Revlon? The definitive answer under modern Delaware corporate law is a resounding NO, thanks to the revolutionary doctrine of Corwin Cleansing.",
                "In the watershed decision Corwin v. KKR Financial Holdings LLC (Del. 2015), the Delaware Supreme Court—authored by Chief Justice Leo E. Strine Jr.—radically reshaped post-closing M&A litigation. Chief Justice Strine established that when a transaction not subject to Entire Fairness review (meaning an unconflicted transaction, free of a controlling shareholder buyout) has been approved by a fully informed, uncoerced vote of disinterested stockholders, the Business Judgment Rule irrebuttably applies!",
                "The legal consequence of Corwin cleansing is monumental: it extinguishes all fiduciary duty claims—including alleged Revlon violations, deal protection defects, and banker conflicts of interest—at the very inception of litigation. Once Corwin applies, the Court of Chancery will grant a motion to dismiss the complaint with prejudice under Rule 12(b)(6), unless the plaintiff can prove Corporate Waste (an impossible standard requiring proof that the board gifted assets for no consideration whatsoever).",
                "Because of Corwin, plaintiff shareholder litigation in Delaware shifted entirely away from post-closing damages to pre-closing Disclosure Challenges. To plead around Corwin and survive a motion to dismiss, plaintiffs must prove that the shareholder vote was NOT fully informed—demonstrating that the proxy statement contained material misstatements or omitted material facts under TSC Industries v. Northway.",
                "Crucially, Corwin does NOT apply if the transaction involves a Controlling Shareholder who extracted private benefits or engaged in a freeze-out merger. In controlling shareholder buyouts, Delaware equity demands the specialized MFW framework to lower scrutiny, preserving Entire Fairness as the baseline protection."
            ],
            "example": "Shareholders sue a board post-closing, claiming directors violated Revlon by accepting an all-cash bid too quickly. However, 82% of disinterested shareholders voted in favor after receiving a 120-page proxy statement disclosing all banker fees and valuation models. Under Corwin, the Chancery Court grants a motion to dismiss with prejudice, holding that the informed shareholder vote cleansed all Revlon claims.",
            "code": """# Simulation: Corwin v. KKR Post-Closing Cleansing & M&A Dismissal Engine
from typing import Dict, List

def evaluate_corwin_post_closing_cleansing(
    merger_title: str,
    involves_conflicted_controlling_shareholder: bool, # e.g. MFW required instead of Corwin
    proxy_disclosed_all_material_facts_under_tsc: bool,
    material_banker_success_fees_or_conflicts_omitted: bool,
    vote_was_uncoerced_by_structural_penalties: bool,
    disinterested_stockholder_majority_approved: bool,
    allegation_of_corporate_waste_plausibly_pled: bool
) -> dict:
    # 1. Ineligibility Check: Controlling Shareholder Freeze-Out Mergers
    if involves_conflicted_controlling_shareholder:
        return {
            'merger_title': merger_title,
            'corwin_cleansing_applied': False,
            'verdict': "CONTROLLING_SHAREHOLDER_TRANSACTION_REQUIRES_MFW",
            'cleansing_disqualification_reason': "CONTROLLING_SHAREHOLDER_TRANSACTION_REQUIRES_MFW",
            'judicial_review_standard': "ENTIRE_FAIRNESS_STANDARD",
            'motion_to_dismiss_granted': False,
            'litigation_posture': "CASE_PROCEEDS_TO_FULL_ENTIRE_FAIRNESS_DISCOVERY"
        }
        
    # 2. Fully Informed Vote Audit (TSC Industries v. Northway materiality test)
    is_fully_informed = (
        proxy_disclosed_all_material_facts_under_tsc and 
        not material_banker_success_fees_or_conflicts_omitted
    )
    
    # 3. Uncoerced Disinterested Vote Check
    is_uncoerced = vote_was_uncoerced_by_structural_penalties
    stockholders_approved = disinterested_stockholder_majority_approved
    
    corwin_prerequisites_met = is_fully_informed and is_uncoerced and stockholders_approved
    
    if corwin_prerequisites_met:
        # Corwin Rule: Irrebuttable Business Judgment Rule applies unless Waste is pled
        if allegation_of_corporate_waste_plausibly_pled:
            verdict = "CORWIN_APPLIED_BUT_WASTE_CLAIM_SURVIVES"
            review_standard = "WASTE_STANDARD_EXTREME_BURDEN"
            mtd_granted = False
        else:
            verdict = "CORWIN_CLEANSING_IRREBUTTABLE_BJR_RESTORED"
            review_standard = "IRREBUTTABLE_BUSINESS_JUDGMENT_RULE"
            mtd_granted = True
    else:
        disqual_reasons = []
        if not is_fully_informed: disqual_reasons.append("MATERIAL_DISCLOSURE_DEFECT")
        if not is_uncoerced: disqual_reasons.append("STRUCTURAL_COERCION")
        if not stockholders_approved: disqual_reasons.append("NO_DISINTERESTED_MAJORITY")
        verdict = f"CORWIN_CLEANSING_DENIED_{'_AND_'.join(disqual_reasons)}"
        review_standard = "ENHANCED_SCRUTINY_REVLON_REVIEW"
        mtd_granted = False
        
    return {
        'merger_title': merger_title,
        'corwin_cleansing_applied': corwin_prerequisites_met,
        'verdict': verdict,
        'judicial_review_standard': review_standard,
        'motion_to_dismiss_granted': mtd_granted,
        'litigation_posture': "ACTION_DISMISSED_WITH_PREJUDICE" if mtd_granted else "CASE_PROCEEDS_TO_DISCOVERY"
    }

# Execute deterministic validation
c1 = evaluate_corwin_post_closing_cleansing("Enterprise SaaS Cash-Out Merger", False, True, False, True, True, False)
c2 = evaluate_corwin_post_closing_cleansing("Defective Proxy M&A Deal", False, True, True, True, True, False)
c3 = evaluate_corwin_post_closing_cleansing("Controlling Founder Buyout", True, True, False, True, True, False)

print(f"[{c1['merger_title']}] -> Status: {c1['verdict']} | MTD Granted: {c1['motion_to_dismiss_granted']}")
print(f"[{c2['merger_title']}] -> Status: {c2['verdict']} | MTD Granted: {c2['motion_to_dismiss_granted']}")
print(f"[{c3['merger_title']}] -> Status: {c3['verdict']} | MTD Granted: {c3['motion_to_dismiss_granted']}")
""",
            "output": """[Enterprise SaaS Cash-Out Merger] -> Status: CORWIN_CLEANSING_IRREBUTTABLE_BJR_RESTORED | MTD Granted: True
[Defective Proxy M&A Deal] -> Status: CORWIN_CLEANSING_DENIED_MATERIAL_DISCLOSURE_DEFECT | MTD Granted: False
[Controlling Founder Buyout] -> Status: CONTROLLING_SHAREHOLDER_TRANSACTION_REQUIRES_MFW | MTD Granted: False
""",
            "codeNotes": [
                {"line": 13, "note": "Disqualifies controlling shareholder transactions from Corwin; mandates MFW framework"},
                {"line": 23, "note": "Audits fully informed voting baseline under TSC Industries disclosure materiality"},
                {"line": 34, "note": "Applies irrebuttable Business Judgment Rule granting motion to dismiss with prejudice"}
            ],
            "tryIt": "Set material_banker_success_fees_or_conflicts_omitted to False in c2 to observe how complete disclosure restores Corwin dismissal.",
            "check": {
                "question": "What is the legal effect of Corwin cleansing under Delaware law when a non-controller merger is approved by a fully informed, uncoerced vote of disinterested stockholders?",
                "options": [
                    "The Business Judgment Rule irrebuttably applies, resulting in the immediate dismissal of all fiduciary duty and Revlon claims with prejudice.",
                    "The merger is automatically cancelled and the buyer forfeits its breakup fee.",
                    "The transaction is reviewed under Entire Fairness with the burden on the board.",
                    "All directors are barred from serving on corporate boards for five years."
                ],
                "answer": 0,
                "why": "Corwin establishes that an informed, uncoerced stockholder vote restores the irrebuttable Business Judgment Rule, extinguishing post-closing damages claims.",
                "answerIndex": 0,
                "explanation": "Corwin establishes that an informed, uncoerced stockholder vote restores the irrebuttable Business Judgment Rule, extinguishing post-closing damages claims."
            }
        }
    ],
    "summary": [
        "The Revlon Moment: Triggered in cash buyouts, breakups, or control shifts under Paramount v. QVC; mandates maximizing immediate share value (Time-Warner stock exception).",
        "Deal Protections & Fiduciary Outs: Strict no-shops are void ab initio under Omnicare; contracts must preserve fiduciary outs to negotiate superior proposals.",
        "Breakup Fees: Reviewed under Unocal; Delaware Court of Chancery 3.5% benchmark (Toys 'R' Us) is presumptively valid; fees above 4.5% risk invalidation as preclusive.",
        "Match Rights & DGCL § 146: Match rights allow buyers to cure superior proposals; § 146 force-the-vote covenants require holding shareholder meeting even upon adverse board recommendation.",
        "The Corwin Doctrine: Approval by fully informed, uncoerced disinterested stockholders irrebuttably restores the Business Judgment Rule, cleansing Revlon defects at the pleading stage."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 5 Step 2: M&A Deal Protection & Revlon Auction Architecture",
        "steps": [
            "Assess M&A transaction structures under Paramount v. QVC to determine Revlon auctioneer duties vs. Time-Warner business judgment.",
            "Draft No-Shop covenants equipped with Omnicare-compliant fiduciary outs for unsolicited superior proposals.",
            "Structure target breakup fees within the 3.5% Toys 'R' Us market benchmark to ensure judicial enforceability under Unocal.",
            "Negotiate buyer match rights and embed DGCL § 146 Force-the-Vote covenants to maximize deal closing certainty.",
            "Audit proxy disclosure statements under TSC Industries to guarantee complete Corwin post-closing judicial cleansing."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_22)
    print(f"B.Com Corporate Law Day 22 Total Words: {total}")
    for i, p in enumerate(DAY_22['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
