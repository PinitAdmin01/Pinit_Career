"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 25 Builder: Milestone 5 Capstone: Sovereign M&A Transaction, Antitrust Clearance & Takeover Defense Control Tower
Milestone 5: Takeover Defense, M&A Deal Protections & Antitrust Clearance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_25 = {
    "coursePrefix": "bcom_law",
    "day": 25,
    "title": "Milestone 5 Capstone: Sovereign M&A Transaction, Antitrust Clearance & Takeover Defense Control Tower",
    "goal": "Synthesize and execute the full sovereign M&A transaction, takeover defense, and regulatory clearance command architecture: deploy Unocal enhanced scrutiny and Moran poison pills against hostile tender offers, structure Revlon-compliant auctions and Omnicare deal protections cleansed under Corwin, execute conflicted controller buyouts under the MFW dual-cleansing framework and Match Group (Del. 2024), navigate Clayton Act § 7A HSR antitrust clearance and FIRRMA CFIUS national security approvals, and certify sovereign transactional general counsel accreditation.",
    "minutes": 45,
    "recap": "In Days 21–24, we mastered the core transactional pillars of corporate law: takeover defenses and poison pills under Unocal, deal protections and Revlon duties, conflicted controller freeze-outs under MFW and Match Group, and federal regulatory clearance under HSR and CFIUS. Today in Day 25, we unify these four domains into the Milestone 5 Sovereign M&A Transaction & Takeover Defense Control Tower.",
    "parts": [
        {
            "title": "Tier 1: Hostile Takeover Defense, Unocal Proportionality & Rights Plan Fortress",
            "say": [
                "Welcome to the Milestone 5 Capstone: Sovereign M&A Transaction, Antitrust Clearance, and Takeover Defense Control Tower. In this master capstone, you direct the legal and strategic command center for a multi-billion dollar publicly traded corporation navigating an unsolicited hostile tender offer, a simultaneous competitive auction, a conflicted controller reorganization, and multi-agency federal antitrust and national security reviews.",
                "Tier 1 establishes the frontline defense against hostile, coercive acquisition attempts. When a predatory bidder launches an unsolicited tender offer, the board of directors faces an inherent conflict of interest. To withstand Delaware Court of Chancery review, Tier 1 invokes Enhanced Scrutiny under Unocal Corp. v. Mesa Petroleum Co.",
                "First, Tier 1 audits the bidder's offer for recognized corporate threats: (a) Structural Coercion (two-tier front-end-loaded tender offers); (b) Substantive Coercion (inadequate pricing where shareholders mistakenly undervalue standalone growth); and (c) Financing Contingency threats. The board documents thorough, independent discounted cash flow (DCF) analyses and retains independent banking advisors to establish reasonable grounds for believing the bid threatens enterprise policy.",
                "Second, Tier 1 filters all defensive measures through Unitrin, Inc. v. American General Corp., guaranteeing that defensive actions are non-draconian—neither coercive to stockholders nor preclusive to a proxy contest. The board adopts an enforceable Shareholder Rights Plan (Poison Pill) under Moran v. Household International with a 15% trigger and a 50% discount flip-in dilution mechanism.",
                "Third, paired with an effective classified board under DGCL § 141(d), Tier 1 establishes an impenetrable Airgas fortress: as affirmed in Air Products v. Airgas, an independent, staggered board acting in good faith may 'Just Say No' indefinitely, forcing the hostile bidder to abandon its coercive assault or raise its price to negotiate an arm's-length transaction."
            ],
            "example": "Facing a hostile $65 cash tender offer from a raider while independent DCF models value the enterprise at $82, the board adopts a 15% flip-in poison pill. Under Unocal and Unitrin, substantive coercion justifies the pill, and because the raider can run a proxy contest across the staggered board, the defense is non-preclusive and legally unassailable.",
            "code": """# Simulation: Tier 1 Hostile Takeover Defense & Unocal Proportionality Engine
from typing import Dict, List

def audit_tier1_hostile_takeover_defense(
    target_company_name: str,
    bidder_name: str,
    hostile_offer_price_usd: float,
    standalone_dcf_intrinsic_value_usd: float,
    board_conducted_independent_valuation: bool,
    board_consists_of_independent_majority: bool,
    poison_pill_rights_plan_active: bool,
    poison_pill_trigger_threshold_pct: float, # e.g. 0.15 for 15%
    defensive_response_is_preclusive_or_coercive: bool,
    board_has_staggered_classes_under_141d: bool
) -> dict:
    # 1. Unocal Prong 1: Threat Identification (Substantive Coercion under Airgas)
    is_substantive_coercion = (
        hostile_offer_price_usd < standalone_dcf_intrinsic_value_usd and 
        board_conducted_independent_valuation and 
        board_consists_of_independent_majority
    )
    
    # 2. Unocal Prong 2 & Unitrin: Non-Draconian Proportionality Test
    is_non_draconian = (
        not defensive_response_is_preclusive_or_coercive and 
        poison_pill_rights_plan_active and 
        (0.10 <= poison_pill_trigger_threshold_pct <= 0.20)
    )
    
    tier1_cleared = is_substantive_coercion and is_non_draconian
    
    if tier1_cleared:
        verdict = "TIER_1_TAKEOVER_DEFENSE_CERTIFIED_UNOCAL_UPHELD"
        chancery_posture = "AIRGAS_JUST_SAY_NO_FORTRESS_ACTIVE_NO_INJUNCTION"
        raider_coercion_neutralized = True
    else:
        verdict = "TIER_1_DEFENSE_DEFECT_DETECTED"
        chancery_posture = "PILL_ENJOINED_UNDER_UNITRIN_DRACONIAN_STANDARD"
        raider_coercion_neutralized = False
        
    return {
        'target_company': target_company_name,
        'bidder_name': bidder_name,
        'is_substantive_coercion': is_substantive_coercion,
        'is_non_draconian': is_non_draconian,
        'staggered_board_active': board_has_staggered_classes_under_141d,
        'tier1_status': verdict,
        'chancery_posture': chancery_posture,
        'raider_coercion_neutralized': raider_coercion_neutralized,
        'cleared': tier1_cleared
    }

# Execute deterministic validation
t1_res = audit_tier1_hostile_takeover_defense(
    "Apex Enterprise Technologies Inc.", "Hostile Raider Capital",
    65.0, 84.0, True, True, True, 0.15, False, True
)
print(f"[{t1_res['target_company']}] -> Status: {t1_res['tier1_status']} | Chancery: {t1_res['chancery_posture']} | Cleared: {t1_res['cleared']}")
""",
            "output": """[Apex Enterprise Technologies Inc.] -> Status: TIER_1_TAKEOVER_DEFENSE_CERTIFIED_UNOCAL_UPHELD | Chancery: AIRGAS_JUST_SAY_NO_FORTRESS_ACTIVE_NO_INJUNCTION | Cleared: True
""",
            "codeNotes": [
                {"line": 15, "note": "Audits substantive coercion threat under Airgas and Unocal Prong 1"},
                {"line": 22, "note": "Applies Unitrin non-draconian proportionality filter for 15% poison pill"},
                {"line": 28, "note": "Certifies Airgas 'Just Say No' fortress neutralizing raider tender offer"}
            ],
            "tryIt": "Set defensive_response_is_preclusive_or_coercive to True in t1_res to observe how preclusive defenses violate Unitrin.",
            "check": {
                "question": "Under Unocal and Unitrin, why is a standard 15% flip-in poison pill paired with a staggered board legally upheld by the Delaware Court of Chancery?",
                "options": [
                    "Because it is non-draconian—it does not coerce stockholders and does not preclude a hostile bidder from winning successive proxy contests to replace the board and redeem the pill.",
                    "Because Delaware judges are legally required to reject all hostile bids.",
                    "Because poison pills are created by the Federal Reserve.",
                    "Because raiders are prohibited from hiring attorneys in Delaware."
                ],
                "answer": 0,
                "why": "Unitrin established that a defense is non-preclusive if a bidder can realistically mount a proxy contest, keeping the pill within the range of reasonableness.",
                "answerIndex": 0,
                "explanation": "Unitrin established that a defense is non-preclusive if a bidder can realistically mount a proxy contest, keeping the pill within the range of reasonableness."
            }
        },
        {
            "title": "Tier 2: Negotiated M&A Deal Protections, Revlon Duties & Corwin Cleansing",
            "say": [
                "Once the board leverages its poison pill to defeat the raider's coercive bid, it initiates an orderly, competitive M&A auction to maximize immediate stockholder value. Under Paramount Communications v. QVC Network and Revlon, Inc. v. MacAndrews & Forbes Holdings, the transition to an all-cash sale triggers Revlon Duties, mandating that the board act as auctioneers to achieve the highest transaction consideration reasonably available.",
                "To attract white knight strategic bidders willing to pay a premium valuation, the board negotiates a balanced package of deal protection devices: (1) A No-Shop Covenant strictly prohibiting unauthorized solicitations, equipped with a mandatory Omnicare Fiduciary Out enabling the board to negotiate with unsolicited Superior Proposals; (2) A 4 business-day Buyer Match Right; and (3) A DGCL § 146 Force-the-Vote Covenant requiring the target to submit the deal to stockholders even if the board changes its recommendation.",
                "Tier 2 audits the economic magnitude of the Termination Fee under Unocal and In re Toys 'R' Us. The breakup fee is calibrated at exactly 3.50% of aggregate equity transaction value, placing it solidly within Delaware's presumptively valid market benchmark (2.5% to 3.75%), guaranteeing it cannot be challenged as a preclusive penalty.",
                "Finally, Tier 2 directs the shareholder voting process under Corwin v. KKR Financial Holdings LLC. The corporate secretary and securities counsel prepare an exhaustive Schedule 14A proxy statement disclosing all financial advisor success fees, fairness opinion discounted cash flow metrics, and auction chronology.",
                "When fully informed, uncoerced disinterested stockholders cast an overwhelming affirmative vote, the Corwin doctrine irrebuttably restores the Business Judgment Rule, completely extinguishing all post-closing Revlon damages claims at the pleading stage."
            ],
            "example": "A strategic buyer agrees to pay $92/share in cash ($4.6 billion). The contract includes a 3.5% breakup fee ($161M), a 4-day match right, and an Omnicare fiduciary out. Stockholders approve the deal after receiving full disclosure of all banker fees. Under Corwin, the Chancery Court dismisses all post-closing shareholder suits with prejudice under Rule 12(b)(6).",
            "code": """# Simulation: Tier 2 Negotiated M&A Deal Protections & Corwin Cleansing Engine
from typing import Dict, List

def audit_tier2_negotiated_deal_protections_and_revlon(
    deal_name: str,
    transaction_equity_value_usd: float,
    cash_consideration_percentage: float, # 1.0 for 100% cash -> Revlon triggered
    board_conducted_robust_auction_or_market_check: bool,
    breakup_fee_percentage: float, # e.g. 3.5 for 3.5%
    contract_contains_omnicare_fiduciary_out: bool,
    buyer_granted_standard_match_rights: bool,
    proxy_statement_fully_disclosed_all_material_facts: bool,
    disinterested_stockholders_approved_merger: bool
) -> dict:
    # 1. Revlon Compliance
    revlon_triggered = cash_consideration_percentage >= 0.50
    revlon_satisfied = board_conducted_robust_auction_or_market_check
    
    # 2. Deal Protection Invariants (Toys 'R' Us & Omnicare)
    breakup_fee_valid = breakup_fee_percentage <= 3.75
    fiduciary_out_valid = contract_contains_omnicare_fiduciary_out
    deal_protections_cleared = breakup_fee_valid and fiduciary_out_valid and buyer_granted_standard_match_rights
    
    # 3. Corwin Post-Closing Cleansing Audit
    corwin_cleansed = (
        proxy_statement_fully_disclosed_all_material_facts and 
        disinterested_stockholders_approved_merger
    )
    
    tier2_cleared = revlon_satisfied and deal_protections_cleared and corwin_cleansed
    
    if tier2_cleared:
        verdict = "TIER_2_DEAL_PROTECTIONS_AND_CORWIN_CLEANSED"
        chancery_posture = "IRREBUTTABLE_BJR_RESTORED_CASE_DISMISSED_WITH_PREJUDICE"
        deal_certainty_secured = True
    else:
        verdict = "TIER_2_M_AND_A_DEFECT_DETECTED"
        chancery_posture = "REVLON_OR_DISCLOSURE_DEFECT_TRIAL_ORDERED"
        deal_certainty_secured = False
        
    return {
        'deal_name': deal_name,
        'revlon_triggered': revlon_triggered,
        'revlon_satisfied': revlon_satisfied,
        'breakup_fee_percentage': breakup_fee_percentage,
        'breakup_fee_valid': breakup_fee_valid,
        'corwin_cleansed': corwin_cleansed,
        'tier2_status': verdict,
        'chancery_posture': chancery_posture,
        'deal_certainty_secured': deal_certainty_secured,
        'cleared': tier2_cleared
    }

# Execute deterministic validation
t2_res = audit_tier2_negotiated_deal_protections_and_revlon(
    "Apex Enterprise Technologies Merger", 4600000000.0, 1.0,
    True, 3.5, True, True, True, True
)
print(f"[{t2_res['deal_name']}] -> Status: {t2_res['tier2_status']} | Breakup Fee: {t2_res['breakup_fee_percentage']}% | Cleared: {t2_res['cleared']}")
""",
            "output": """[Apex Enterprise Technologies Merger] -> Status: TIER_2_DEAL_PROTECTIONS_AND_CORWIN_CLEANSED | Breakup Fee: 3.5% | Cleared: True
""",
            "codeNotes": [
                {"line": 15, "note": "Audits Revlon auctioneer compliance in 100% cash buyout transaction"},
                {"line": 19, "note": "Enforces 3.75% Toys 'R' Us breakup fee cap and Omnicare fiduciary out"},
                {"line": 24, "note": "Applies Corwin doctrine: fully informed vote irrebuttably restores BJR"}
            ],
            "tryIt": "Increase breakup_fee_percentage to 5.5% in t2_res to observe how an excessive fee invalidates Tier 2 clearance.",
            "check": {
                "question": "Under Corwin v. KKR Financial Holdings, what is the legal consequence of an M&A merger being approved by a fully informed, uncoerced vote of disinterested stockholders?",
                "options": [
                    "The Business Judgment Rule irrebuttably applies, resulting in the immediate dismissal of all post-closing fiduciary duty and Revlon damages claims at the pleading stage.",
                    "The merger is automatically rescinded by the Court of Chancery.",
                    "The buyer is required to pay a 10% cash dividend to all stockholders.",
                    "The transaction is transferred to federal criminal court."
                ],
                "answer": 0,
                "why": "Corwin establishes that stockholders' informed democratic approval cures all Revlon defects, conferring complete post-closing judicial immunity.",
                "answerIndex": 0,
                "explanation": "Corwin establishes that stockholders' informed democratic approval cures all Revlon defects, conferring complete post-closing judicial immunity."
            }
        },
        {
            "title": "Tier 3: Controlling Shareholder Buyouts & MFW Dual-Track Cleansing",
            "say": [
                "While third-party mergers are cleansed under Corwin, transactions involving a Controlling Shareholder inhabit a fundamentally different legal universe. Under Kahn v. Lynch and Tornetta v. Musk, controlling shareholders exert inherent coercion over the board and minority stockholders. Consequently, Corwin does NOT apply to controller buyouts or conflicted controller transactions.",
                "Tier 3 commands the specialized procedural architecture required to insulate controller freeze-outs from Entire Fairness trial scrutiny: the Kahn v. M&F Worldwide (MFW) Dual-Cleansing Framework, reinforced by the Delaware Supreme Court's April 2024 landmark ruling in In re Match Group, Inc. Derivative Litigation.",
                "Under MFW and Match Group, whenever a controlling shareholder executes a take-private freeze-out, or extracts a unique non-ratable benefit in a corporate reorganization, the transaction triggers the Entire Fairness standard of review by default. To extinguish Entire Fairness and restore the Business Judgment Rule at the motion to dismiss stage, the controller must condition the transaction ab initio (from the very first offer) upon two independent procedural protections:",
                "1. Special Committee Approval: The transaction must be negotiated, scrutinized, and approved by an autonomous Special Committee composed entirely of independent directors. The committee must be armed with independent legal and financial advisors and granted the absolute, non-delegable authority to say 'NO' to the controller.",
                "2. Majority of the Minority (MOM) Vote: The transaction must be conditioned upon and approved by an uncoerced, fully informed vote of a majority of the unaffiliated minority stockholders.",
                "Furthermore, Tier 3 anticipates and manages Statutory Appraisal Arbitrage under DGCL § 262. By structuring an open, unconflicted transaction, the company establishes under Dell and Aruba Networks that the deal price minus synergies represents fair value, eliminating opportunistic appraisal exposure."
            ],
            "example": "A 52% controlling shareholder proposes taking the company private at $55/share. The controller conditions the offer ab initio on Special Committee veto authority and an uncoerced MOM vote. The Special Committee negotiates the price to $62/share, and 84% of minority stockholders vote in favor. Under MFW, the Court of Chancery dismisses the minority shareholder suit on the pleadings under the Business Judgment Rule.",
            "code": """# Simulation: Tier 3 Controlling Shareholder Buyout & MFW Dual-Track Engine
from typing import Dict, List

def audit_tier3_controlling_shareholder_mfw_cleansing(
    enterprise_name: str,
    controller_name: str,
    controller_voting_equity_pct: float, # e.g. 52.0 for 52%
    conditioned_ab_initio_on_special_committee_and_mom_vote: bool,
    special_committee_had_full_veto_power_to_say_no: bool,
    special_committee_retained_independent_advisors: bool,
    mom_vote_was_fully_informed_and_uncoerced: bool,
    unaffiliated_minority_voted_majority_approval: bool,
    appraisal_risk_mitigated_under_aruba_networks: bool
) -> dict:
    # 1. Controller Status Check (Kahn v. Lynch / Tornetta)
    is_controller = controller_voting_equity_pct > 0.50 or controller_voting_equity_pct >= 0.25
    
    # 2. MFW Dual-Track Invariants (Kahn v. M&F Worldwide & Match Group)
    ab_initio_valid = conditioned_ab_initio_on_special_committee_and_mom_vote
    special_committee_sound = (
        special_committee_had_full_veto_power_to_say_no and 
        special_committee_retained_independent_advisors
    )
    mom_vote_sound = (
        mom_vote_was_fully_informed_and_uncoerced and 
        unaffiliated_minority_voted_majority_approval
    )
    
    mfw_cleansed = ab_initio_valid and special_committee_sound and mom_vote_sound
    
    tier3_cleared = is_controller and mfw_cleansed and appraisal_risk_mitigated_under_aruba_networks
    
    if tier3_cleared:
        verdict = "TIER_3_MFW_DUAL_CLEANSING_CERTIFIED_BJR_RESTORED"
        chancery_posture = "CASE_DISMISSED_AT_PLEADINGS_STAGE_UNDER_MFW"
        entire_fairness_threat_eliminated = True
    else:
        verdict = "TIER_3_CONTROLLER_CLEANSING_DEFECT"
        chancery_posture = "ENTIRE_FAIRNESS_TRIAL_ORDERED_BURDEN_ON_CONTROLLER"
        entire_fairness_threat_eliminated = False
        
    return {
        'enterprise_name': enterprise_name,
        'controller_name': controller_name,
        'is_controlling_shareholder': is_controller,
        'ab_initio_conditioning_satisfied': ab_initio_valid,
        'special_committee_cleared': special_committee_sound,
        'mom_vote_cleared': mom_vote_sound,
        'tier3_status': verdict,
        'chancery_posture': chancery_posture,
        'entire_fairness_eliminated': entire_fairness_threat_eliminated,
        'cleared': tier3_cleared
    }

# Execute deterministic validation
t3_res = audit_tier3_controlling_shareholder_mfw_cleansing(
    "Apex Enterprise Technologies Inc.", "Founder Capital Partners",
    52.0, True, True, True, True, True, True
)
print(f"[{t3_res['enterprise_name']}] -> Status: {t3_res['tier3_status']} | Entire Fairness Defeated: {t3_res['entire_fairness_eliminated']} | Cleared: {t3_res['cleared']}")
""",
            "output": """[Apex Enterprise Technologies Inc.] -> Status: TIER_3_MFW_DUAL_CLEANSING_CERTIFIED_BJR_RESTORED | Entire Fairness Defeated: True | Cleared: True
""",
            "codeNotes": [
                {"line": 15, "note": "Confirms controlling shareholder status triggering Entire Fairness baseline"},
                {"line": 21, "note": "Audits MFW ab initio dual-track conditioning: Special Committee and MOM vote"},
                {"line": 28, "note": "Restores Business Judgment Rule at pleadings stage, eliminating trial exposure"}
            ],
            "tryIt": "Set conditioned_ab_initio_on_special_committee_and_mom_vote to False in t3_res to see the transaction fall into an Entire Fairness trial under Match Group.",
            "check": {
                "question": "Under the Delaware Supreme Court's decisions in MFW and In re Match Group (Del. 2024), what happens when a controlling shareholder buyout is approved by an independent Special Committee but NOT conditioned upon a Majority-of-the-Minority stockholder vote?",
                "options": [
                    "The transaction remains subject to Entire Fairness review; the Special Committee alone merely shifts the burden of proof to the plaintiff, failing to restore the Business Judgment Rule.",
                    "The transaction is completely cleansed under Corwin.",
                    "The controller is forced to surrender all shares to the state of Delaware.",
                    "The Business Judgment Rule irrebuttably applies automatically."
                ],
                "answer": 0,
                "why": "Match Group reaffirmed that both MFW prongs are strictly mandatory; a Special Committee alone cannot restore the Business Judgment Rule.",
                "answerIndex": 0,
                "explanation": "Match Group reaffirmed that both MFW prongs are strictly mandatory; a Special Committee alone cannot restore the Business Judgment Rule."
            }
        },
        {
            "title": "Tier 4: Regulatory Antitrust (HSR) Clearance & CFIUS National Security Command",
            "say": [
                "Tier 4 activates the sovereign regulatory clearance command center, navigating federal antitrust enforcement under the Hart-Scott-Rodino (HSR) Act and national security scrutiny under the Committee on Foreign Investment in the United States (CFIUS). Even the most pristine corporate governance structure cannot close a deal if federal regulators secure an injunction.",
                "First, Tier 4 enforces compliance with Section 7A of the Clayton Act. Because the transaction exceeds the statutory threshold, the parties file comprehensive HSR premerger notifications with the FTC and DOJ, observing the mandatory 30-day waiting period and paying tiered statutory filing fees. To prevent millions in civil penalties, Tier 4 establishes strict pre-merger gun-jumping firewalls: the merging parties remain completely independent commercial competitors, barring premature price coordination or operational integration.",
                "Second, Tier 4 models horizontal market concentration under the 2023 FTC/DOJ Merger Guidelines. Where overlapping markets create post-merger HHI metrics exceeding 1,800 with increases exceeding 100 points, triggering a structural presumption of illegality under Section 7 of the Clayton Act, Tier 4 structures proactive divestiture remedy packages to resolve agency competitive concerns.",
                "Third, for cross-border investments or foreign buyer participation, Tier 4 directs national security reviews under CFIUS and FIRRMA. The control tower audits target operations for TID (Technology, Infrastructure, Sensitive Data) classifications, submits mandatory declarations, and negotiates formal National Security Mitigation Agreements to ring-fence sensitive source code, eliminating the threat of a non-reviewable Presidential blocking order.",
                "Finally, Tier 4 negotiates definitive merger agreement risk allocation: embedding Hell-or-High-Water covenants and calibrated Reverse Termination Fees to guarantee closing certainty or secure substantial monetary compensation upon regulatory blockage."
            ],
            "example": "In a $4.6 billion cross-border tech acquisition, the buyer agrees to a Hell-or-High-Water regulatory covenant and an 8% Reverse Breakup Fee ($368M). The parties file HSR, observe gun-jumping protocols, agree to divest an overlapping $60M product line, and execute a CFIUS data-security mitigation agreement. The transaction achieves full regulatory clearance.",
            "code": """# Simulation: Tier 4 Federal Antitrust & CFIUS Regulatory Clearance Command Engine
from typing import Dict, List

def audit_tier4_regulatory_antitrust_and_cfius_clearance(
    deal_name: str,
    hsr_premerger_filing_completed: bool,
    observed_pre_closing_gun_jumping_firewalls: bool,
    antitrust_hhi_concentration_resolved_via_divestiture: bool,
    cfius_covered_tid_business_identified: bool,
    cfius_national_security_mitigation_agreement_executed: bool,
    contract_includes_hell_or_high_water_covenant: bool,
    antitrust_reverse_termination_fee_secured_pct: float # e.g. 0.08 for 8%
) -> dict:
    # 1. HSR Antitrust and Gun-Jumping Clearance
    hsr_cleared = (
        hsr_premerger_filing_completed and 
        observed_pre_closing_gun_jumping_firewalls and 
        antitrust_hhi_concentration_resolved_via_divestiture
    )
    
    # 2. CFIUS National Security Clearance
    if cfius_covered_tid_business_identified:
        cfius_cleared = cfius_national_security_mitigation_agreement_executed
    else:
        cfius_cleared = True
        
    # 3. Contractual Risk Allocation Invariants
    risk_allocation_sound = (
        contract_includes_hell_or_high_water_covenant or 
        (antitrust_reverse_termination_fee_secured_pct >= 0.05)
    )
    
    tier4_cleared = hsr_cleared and cfius_cleared and risk_allocation_sound
    
    if tier4_cleared:
        verdict = "TIER_4_REGULATORY_ANTITRUST_AND_CFIUS_CLEARED"
        closing_authorized = True
        regulatory_barrier_status = "ALL_GOVERNMENT_APPROVALS_OBTAINED_NO_INJUNCTION"
    else:
        verdict = "TIER_4_REGULATORY_OBSTACLE_DETECTED"
        closing_authorized = False
        regulatory_barrier_status = "FTC_INJUNCTION_OR_PRESIDENTIAL_CFIUS_BLOCK_ACTIVE"
        
    return {
        'deal_name': deal_name,
        'hsr_antitrust_cleared': hsr_cleared,
        'cfius_security_cleared': cfius_cleared,
        'risk_allocation_sound': risk_allocation_sound,
        'tier4_status': verdict,
        'closing_authorized': closing_authorized,
        'regulatory_barrier_status': regulatory_barrier_status,
        'cleared': tier4_cleared
    }

# Execute deterministic validation
t4_res = audit_tier4_regulatory_antitrust_and_cfius_clearance(
    "Apex Enterprise Technologies Merger",
    True, True, True, True, True, True, 0.08
)
print(f"[{t4_res['deal_name']}] -> Status: {t4_res['tier4_status']} | Authorized: {t4_res['closing_authorized']} | Regulatory: {t4_res['regulatory_barrier_status']}")
""",
            "output": """[Apex Enterprise Technologies Merger] -> Status: TIER_4_REGULATORY_ANTITRUST_AND_CFIUS_CLEARED | Authorized: True | Regulatory: ALL_GOVERNMENT_APPROVALS_OBTAINED_NO_INJUNCTION
""",
            "codeNotes": [
                {"line": 15, "note": "Audits HSR premerger filing, gun-jumping firewalls, and HHI divestiture remedies"},
                {"line": 21, "note": "Validates CFIUS FIRRMA national security clearance via executed mitigation agreement"},
                {"line": 27, "note": "Authorizes global transaction closing free from federal regulatory injunctions"}
            ],
            "tryIt": "Set cfius_national_security_mitigation_agreement_executed to False in t4_res to observe how national security friction blocks merger closing.",
            "check": {
                "question": "Why is strict pre-merger gun-jumping compliance essential while merging parties await federal HSR antitrust clearance?",
                "options": [
                    "Because prematurely integrating operations or coordinating customer pricing violates Clayton Act § 7A and Sherman Act § 1, triggering daily civil penalties exceeding $51,000 and risking federal injunctions.",
                    "Because gun-jumping invalidates the corporate charter under Delaware state law.",
                    "Because all merger discussions must be broadcast on public television.",
                    "Because the DOJ will automatically seize the buyer's bank accounts."
                ],
                "answer": 0,
                "why": "Gun-jumping laws mandate that merging parties remain independent competitors until statutory waiting periods expire, enforcing massive civil penalties for premature coordination.",
                "answerIndex": 0,
                "explanation": "Gun-jumping laws mandate that merging parties remain independent competitors until statutory waiting periods expire, enforcing massive civil penalties for premature coordination."
            }
        },
        {
            "title": "Tier 5: Master Command Sovereign M&A General Counsel Certification",
            "say": [
                "Tier 5 synthesizes the four transactional and regulatory pillars into the definitive Master Command Sovereign M&A General Counsel briefing. In the upper echelons of corporate finance, successful transactions require total mastery across corporate defense, auction fiduciary jurisprudence, conflicted controller cleansing, and government regulatory oversight.",
                "In this final master certification tier, the Chief Legal Officer evaluates the enterprise across all four operational tiers: (1) Tier 1 Hostile Takeover Defense & Unocal Proportionality; (2) Tier 2 Negotiated M&A Deal Protections & Revlon Duties Cleansed under Corwin; (3) Tier 3 Controlling Shareholder Buyout & MFW Dual-Track Cleansing under Match Group; and (4) Tier 4 Regulatory Antitrust (HSR) Clearance & CFIUS National Security Approvals.",
                "To achieve Milestone 5 Sovereign Transactional General Counsel Certification, the enterprise must achieve an unblemished 100% composite clearance score (4/4 tiers). Any failure—whether a preclusive takeover defense, a Revlon auction breach, an uncleansed controller freeze-out, or a federal antitrust gun-jumping fine—paralyzes the transaction, exposing the enterprise to catastrophic damage awards and regulatory injunctions.",
                "When all four tiers clear deterministically, the control tower certifies that $1.2 billion in enterprise M&A transaction value has been consummated, $340 million in regulatory fines, appraisal exposure, and Entire Fairness liability has been permanently eliminated, and full sovereign transactional legitimacy has been achieved.",
                "Upon deterministic execution of all four tiers, the control tower confers the ultimate title of Certified Sovereign Transactional M&A & Takeover Defense General Counsel, bringing Course 29: B.Com Corporate & Commercial Law, Contracts & Governance to a triumphant, master-level conclusion."
            ],
            "example": "An enterprise conglomerate concludes a multi-step transaction. Tier 1 defeats a hostile raider under Unocal. Tier 2 negotiates a $4.6B cash merger with Corwin cleansing. Tier 3 structures a controller spinoff under MFW and Match Group. Tier 4 secures HSR and CFIUS clearance. The board confers Sovereign M&A General Counsel Certification with a 100% score.",
            "code": """# Simulation: Tier 5 Master Command Sovereign M&A General Counsel Certification
from typing import Dict, List

def execute_milestone5_master_transactional_certification(
    enterprise_name: str,
    tier1_takeover_defense_cleared: bool,
    tier2_negotiated_deal_protections_cleared: bool,
    tier3_controller_mfw_cleansing_cleared: bool,
    tier4_regulatory_antitrust_cleared: bool,
    total_enterprise_m_and_a_value_cleared_usd: float,
    total_regulatory_and_fiduciary_exposure_eliminated_usd: float
) -> dict:
    tiers_passed = sum([
        tier1_takeover_defense_cleared,
        tier2_negotiated_deal_protections_cleared,
        tier3_controller_mfw_cleansing_cleared,
        tier4_regulatory_antitrust_cleared
    ])
    
    composite_score_pct = (tiers_passed / 4.0) * 100.0
    all_tiers_cleared = (tiers_passed == 4)
    
    if all_tiers_cleared:
        certification = "CERTIFIED_SOVEREIGN_TRANSACTIONAL_M_AND_A_AND_TAKEOVER_DEFENSE_GENERAL_COUNSEL"
        verdict = "UNANIMOUS_BOARDROOM_APPROVAL_AND_SOVEREIGN_TRANSACTION_CERTIFICATION"
        status = "SOVEREIGN_M_AND_A_TRANSACTION_CONSUMMATED"
    else:
        certification = "ACCREDITATION_DENIED_CRITICAL_TRANSACTIONAL_DEFECT"
        verdict = "TRANSACTIONAL_M_AND_A_COMMAND_COMPROMISED"
        status = "DEFICIENCIES_DETECTED_CLOSING_ABORTED"
        
    print("=" * 60)
    print(f"BOARDROOM MASTER VERDICT: {verdict}")
    print(f"Composite Score: {composite_score_pct:.0f}% ({tiers_passed}/4 Tiers Cleared)")
    print(f"Total M&A Capital Cleared: ${total_enterprise_m_and_a_value_cleared_usd/1e6:.1f}M")
    print(f"Total Regulatory & Fiduciary Liability Eliminated: ${total_regulatory_and_fiduciary_exposure_eliminated_usd/1e6:.1f}M")
    print(f"Final Accreditation: [{certification}]")
    print("=" * 60)
    
    return {
        'enterprise_name': enterprise_name,
        'tiers_cleared_count': tiers_passed,
        'composite_score_pct': composite_score_pct,
        'all_tiers_cleared': all_tiers_cleared,
        'boardroom_verdict': verdict,
        'final_accreditation': certification,
        'm_and_a_capital_cleared_usd': total_enterprise_m_and_a_value_cleared_usd,
        'liability_eliminated_usd': total_regulatory_and_fiduciary_exposure_eliminated_usd
    }

# Execute deterministic validation
final_m5_master = execute_milestone5_master_transactional_certification(
    "Apex Enterprise Technologies Inc.",
    True, True, True, True,
    1200000000.0, 340000000.0
)
""",
            "output": """============================================================
BOARDROOM MASTER VERDICT: UNANIMOUS_BOARDROOM_APPROVAL_AND_SOVEREIGN_TRANSACTION_CERTIFICATION
Composite Score: 100% (4/4 Tiers Cleared)
Total M&A Capital Cleared: $1200.0M
Total Regulatory & Fiduciary Liability Eliminated: $340.0M
Final Accreditation: [CERTIFIED_SOVEREIGN_TRANSACTIONAL_M_AND_A_AND_TAKEOVER_DEFENSE_GENERAL_COUNSEL]
============================================================
""",
            "codeNotes": [
                {"line": 13, "note": "Synthesizes transactional M&A audit results across all 4 operational tiers"},
                {"line": 20, "note": "Demands 100% composite clearance to confer Sovereign M&A General Counsel Accreditation"},
                {"line": 28, "note": "Certifies $1.2B in M&A transaction value and $340M in eliminated regulatory liability"}
            ],
            "tryIt": "Set tier4_regulatory_antitrust_cleared to False in final_m5_master to observe how unresolved antitrust scrutiny blocks Master Accreditation.",
            "check": {
                "question": "What is the ultimate strategic objective of the Tier 5 Master Command Sovereign M&A Control Tower in the Milestone 5 Capstone?",
                "options": [
                    "To integrate Unocal takeover defense, Revlon deal protections with Corwin cleansing, MFW controller freeze-out dual cleansing, and HSR/CFIUS regulatory clearance into an unassailable sovereign transactional framework.",
                    "To dissolve all public corporations and replace them with private sole proprietorships.",
                    "To abolish federal antitrust enforcement.",
                    "To ban foreign investors from traveling to the United States."
                ],
                "answer": 0,
                "why": "Tier 5 integrates all four transactional pillars to execute high-stakes M&A, defeat hostile threats, ensure regulatory compliance, and confer Sovereign M&A General Counsel Accreditation.",
                "answerIndex": 0,
                "explanation": "Tier 5 integrates all four transactional pillars to execute high-stakes M&A, defeat hostile threats, ensure regulatory compliance, and confer Sovereign M&A General Counsel Accreditation."
            }
        }
    ],
    "summary": [
        "Tier 1 Hostile Takeover Defense: Applies Unocal enhanced scrutiny and Unitrin non-draconian review to deploy 15% flip-in poison pills under Moran and Airgas staggered board defenses.",
        "Tier 2 Negotiated M&A & Revlon: Manages cash buyout auctions under Revlon, drafts Omnicare fiduciary outs with 3.5% breakup fees, and achieves post-closing Corwin cleansing.",
        "Tier 3 Controller Buyouts & MFW: Conditions freeze-outs ab initio on independent Special Committees and MOM votes; applies Match Group (Del. 2024) across all conflicted transactions.",
        "Tier 4 Regulatory Antitrust & CFIUS: Manages Clayton Act § 7A HSR premerger filings, 2023 Merger Guidelines HHI thresholds, gun-jumping firewalls, and FIRRMA CFIUS TID clearances.",
        "Tier 5 Master Certification: Unifies all 4 tiers, clearing $1.2B in M&A transaction capital and $340M in regulatory liability, conferring Sovereign Transactional General Counsel accreditation."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 5 Capstone: Sovereign M&A Transaction, Antitrust Clearance & Takeover Defense Control Tower",
        "steps": [
            "Execute Tier 1 Unocal threat evaluation, Unitrin proportionality filters, and Moran flip-in poison pill rights plans.",
            "Structure Tier 2 Revlon cash auctions, Omnicare-compliant deal protections, and Corwin post-closing proxy cleansing.",
            "Audit Tier 3 controlling shareholder buyouts under the MFW ab initio framework and Match Group (Del. 2024) precedents.",
            "Manage Tier 4 HSR premerger antitrust clearance, gun-jumping compliance, and FIRRMA CFIUS national security reviews.",
            "Deliver Tier 5 Boardroom General Counsel Transactional Defense briefing and secure Milestone 5 Sovereign Accreditation."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_25)
    print(f"B.Com Corporate Law Day 25 Total Words: {total}")
    for i, p in enumerate(DAY_25['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
